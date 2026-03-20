import pino from 'pino'
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'
import type { AuthenticationState, SignalDataTypeMap } from '@whiskeysockets/baileys'
import { SessionEncryption } from '../utils/encryption.js'

const logger = pino({ name: 'whatsapp-preauth' })

interface PendingSession {
  id: string
  qrPromise: Promise<string>
  resolve: (qr: string) => void
  reject: (err: Error) => void
  userId: string
  timeout: NodeJS.Timeout
  createdAt: Date
}

export interface WhatsAppPreAuthResult {
  sessionId: string
  qrCode: string
  expiresIn: number
}

export interface WhatsAppStatusResult {
  status: 'pending' | 'connected' | 'expired' | 'failed'
  qrCode?: string
  phoneNumber?: string
}

export interface WhatsAppCompleteResult {
  success: boolean
  whatsappSessionId: string
  encryptedSession: string
  phoneNumber: string | null
}

export class WhatsAppPreAuthService {
  private encryption: SessionEncryption
  private pendingSessions: Map<string, PendingSession> = new Map()
  private sock: ReturnType<typeof makeWASocket> | null = null
  private authState: AuthenticationState | null = null
  private saveCredsFn: (() => Promise<void>) | null = null

  constructor(masterKey: string) {
    this.encryption = new SessionEncryption(masterKey)
  }

  async startPreAuth(userId: string): Promise<WhatsAppPreAuthResult> {
    logger.info({ userId }, 'Starting WhatsApp pre-auth')

    const sessionId = uuidv4()

    const qrPromise = new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingSessions.delete(sessionId)
        reject(new Error('QR code expired - no scan within 60 seconds'))
      }, 60 * 1000)

      this.pendingSessions.set(sessionId, {
        id: sessionId,
        qrPromise: Promise.resolve(''),
        resolve: (qr: string) => {
          clearTimeout(timeout)
          resolve(qr)
        },
        reject: (err: Error) => {
          clearTimeout(timeout)
          this.pendingSessions.delete(sessionId)
          reject(err)
        },
        userId,
        timeout,
        createdAt: new Date()
      })
    })

    const authDir = `/tmp/wa-auth-${sessionId}`
    const { state, saveCreds } = await useMultiFileAuthState(authDir)
    this.authState = state
    this.saveCredsFn = saveCreds

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger,
    })

    this.sock.ev.on('connection.update', async ({ connection, qr }) => {
      const pending = this.pendingSessions.get(sessionId)
      
      if (qr) {
        logger.info({ sessionId }, 'QR code generated')
        if (pending) {
          try {
            const qrDataUrl = await QRCode.toDataURL(qr, {
              margin: 2,
              width: 300,
              color: { dark: '#000000', light: '#FFFFFF' },
            })
            pending.resolve(qrDataUrl)
          } catch (error) {
            logger.error({ error }, 'Failed to generate QR image')
          }
        }
      }
      
      if (connection === 'open') {
        logger.info({ sessionId }, 'WhatsApp connected successfully')
        if (this.saveCredsFn) {
          await this.saveCredsFn()
        }
        if (pending) {
          pending.resolve('ALREADY_CONNECTED')
        }
      }
    })

    const qrCode = await qrPromise

    return {
      sessionId,
      qrCode,
      expiresIn: 60,
    }
  }

  async getPreAuthStatus(sessionId: string): Promise<WhatsAppStatusResult> {
    const pending = this.pendingSessions.get(sessionId)
    
    if (pending) {
      try {
        const qr = await Promise.race([
          pending.qrPromise,
          new Promise<'TIMEOUT'>((resolve) => setTimeout(() => resolve('TIMEOUT'), 100)),
        ])
        
        if (qr === 'TIMEOUT') {
          return { status: 'pending' }
        }
        
        return { 
          status: 'pending', 
          qrCode: qr !== 'ALREADY_CONNECTED' ? qr : undefined 
        }
      } catch {
        return { status: 'failed' }
      }
    }

    return { status: 'expired' }
  }

  async completePreAuth(sessionId: string): Promise<WhatsAppCompleteResult> {
    logger.info({ sessionId }, 'Completing pre-auth')

    if (!this.authState) {
      throw new Error('Auth state not available')
    }

    if (!this.saveCredsFn) {
      throw new Error('Save creds function not available')
    }

    await this.saveCredsFn()

    const keysData: Record<string, Record<string, unknown>> = {}
    const keyTypes: (keyof SignalDataTypeMap)[] = ['pre-key', 'session', 'sender-key', 'app-state-sync-key']
    
    for (const type of keyTypes) {
      try {
        const keys = await this.authState.keys.get(type, [])
        keysData[type] = keys
      } catch {
        keysData[type] = {}
      }
    }

    const sessionData = {
      creds: this.authState.creds,
      keys: keysData,
    }

    const encryptedSession = this.encryption.encryptSession(sessionData)

    const phoneNumber = this.authState.creds.me?.jid?.replace('@s.whatsapp.net', '') || null

    this.pendingSessions.delete(sessionId)
    
    return {
      success: true,
      whatsappSessionId: sessionId,
      encryptedSession,
      phoneNumber,
    }
  }

  async cancelPreAuth(sessionId: string): Promise<void> {
    logger.info({ sessionId }, 'Cancelling pre-auth')
    this.pendingSessions.delete(sessionId)
    if (this.sock) {
      this.sock.end(undefined)
      this.sock = null
    }
  }

  getActiveSessionCount(): number {
    return this.pendingSessions.size
  }

  cleanupExpiredSessions(): void {
    const now = new Date()
    const maxAge = 5 * 60 * 1000

    for (const [sessionId, pending] of this.pendingSessions.entries()) {
      if (now.getTime() - pending.createdAt.getTime() > maxAge) {
        this.pendingSessions.delete(sessionId)
      }
    }
  }
}
