import pino from 'pino'
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'
import type { AuthenticationState, SignalDataTypeMap } from '@whiskeysockets/baileys'
import { SessionEncryption } from '../utils/encryption.js'

const logger = pino({ name: 'whatsapp-preauth' })

interface PendingSession {
  id: string
  userId: string
  qrCode: string | null
  qrResolve: ((qr: string) => void) | null
  status: 'pending' | 'connected' | 'expired'
  phoneNumber: string | null
  createdAt: Date
  timeout: NodeJS.Timeout
}

export interface WhatsAppPreAuthResult {
  sessionId: string
  qrCode: string
  expiresIn: number
  error?: string
  retry?: boolean
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
    let qrResolve: ((qr: string) => void) | null = null

    const pendingSession: PendingSession = {
      id: sessionId,
      userId,
      qrCode: null,
      qrResolve: null,
      status: 'pending',
      phoneNumber: null,
      createdAt: new Date(),
      timeout: setTimeout(() => {
        const p = this.pendingSessions.get(sessionId)
        if (p) {
          p.status = 'expired'
          p.qrResolve = null
        }
      }, 5 * 60 * 1000)
    }

    this.pendingSessions.set(sessionId, pendingSession)

    let resolvePreAuth: (() => void) | null = null

    const authDir = `/tmp/wa-auth-${sessionId}`
    const { state, saveCreds } = await useMultiFileAuthState(authDir)
    this.authState = state
    this.saveCredsFn = saveCreds

    const connectionFailureTimeout = setTimeout(() => {
      const p = this.pendingSessions.get(sessionId)
      if (p && !p.qrCode && p.status === 'pending') {
        logger.warn({ sessionId }, 'Connection timeout without QR - will retry')
        if (resolvePreAuth) {
          resolvePreAuth()
          resolvePreAuth = null
        }
      }
    }, 15000)

    const createSock = () => makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger,
    })

    this.sock = createSock()

    this.sock.ev.on('connection.update', async ({ connection, qr }) => {
      const pending = this.pendingSessions.get(sessionId)
      
      if (qr) {
        clearTimeout(connectionFailureTimeout)
        logger.info({ sessionId }, 'QR code generated')
        try {
          const qrDataUrl = await QRCode.toDataURL(qr, {
            margin: 2,
            width: 300,
            color: { dark: '#000000', light: '#FFFFFF' },
          })
          if (pending) {
            pending.qrCode = qrDataUrl
            if (resolvePreAuth) {
              resolvePreAuth()
              resolvePreAuth = null
            }
          }
        } catch (error) {
          logger.error({ error }, 'Failed to generate QR image')
        }
      }
      
      if (connection === 'open') {
        clearTimeout(connectionFailureTimeout)
        logger.info({ sessionId }, 'WhatsApp connected successfully')
        if (this.saveCredsFn) {
          await this.saveCredsFn()
        }
        if (pending) {
          pending.status = 'connected'
          pending.phoneNumber = this.authState?.creds?.me?.jid?.replace('@s.whatsapp.net', '') || null
        }
        if (resolvePreAuth) {
          resolvePreAuth()
          resolvePreAuth = null
        }
      }
      
      if (connection === 'close') {
        logger.info({ sessionId }, 'WhatsApp connection closed')
        if (pending && pending.qrCode && pending.status === 'pending') {
          logger.info({ sessionId }, 'QR was generated but connection closed - QR still valid for scanning')
          if (resolvePreAuth) {
            resolvePreAuth()
            resolvePreAuth = null
          }
        }
      }
    })

    await new Promise<void>((resolve) => {
      resolvePreAuth = resolve
      
      const checkInterval = setInterval(() => {
        const p = this.pendingSessions.get(sessionId)
        if (p?.qrCode || p?.status === 'connected' || p?.status === 'expired') {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
    })

    const pending = this.pendingSessions.get(sessionId)
    const qrCode = pending?.qrCode || ''

    if (!qrCode) {
      logger.warn({ sessionId }, 'No QR code generated - WhatsApp connection may be blocked')
      return {
        sessionId,
        qrCode: '',
        expiresIn: 300,
        error: 'whatsapp_connection_failed',
        retry: true
      }
    }

    return {
      sessionId,
      qrCode,
      expiresIn: 300,
    }
  }

  async getPreAuthStatus(sessionId: string): Promise<WhatsAppStatusResult> {
    const pending = this.pendingSessions.get(sessionId)
    
    if (pending) {
      if (pending.status === 'connected') {
        return {
          status: 'connected',
          phoneNumber: pending.phoneNumber || undefined
        }
      }
      
      return {
        status: pending.status,
        qrCode: pending.qrCode || undefined
      }
    }

    return { status: 'expired' }
  }

  async completePreAuth(sessionId: string): Promise<WhatsAppCompleteResult> {
    logger.info({ sessionId }, 'Completing pre-auth')

    const pending = this.pendingSessions.get(sessionId)

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

    const phoneNumber = pending?.phoneNumber || this.authState.creds.me?.jid?.replace('@s.whatsapp.net', '') || null

    if (pending) {
      clearTimeout(pending.timeout)
      this.pendingSessions.delete(sessionId)
    }
    
    return {
      success: true,
      whatsappSessionId: sessionId,
      encryptedSession,
      phoneNumber,
    }
  }

  async cancelPreAuth(sessionId: string): Promise<void> {
    logger.info({ sessionId }, 'Cancelling pre-auth')
    const pending = this.pendingSessions.get(sessionId)
    if (pending) {
      clearTimeout(pending.timeout)
      this.pendingSessions.delete(sessionId)
    }
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
        clearTimeout(pending.timeout)
        this.pendingSessions.delete(sessionId)
      }
    }
  }
}
