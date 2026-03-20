import pino from 'pino'
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'
import { query, queryOne } from '../db/client.js'
import { SessionEncryption } from '../utils/encryption.js'
import type { AuthenticationState, SignalDataTypeMap } from '@whiskeysockets/baileys'

const logger = pino({ name: 'whatsapp-preauth' })

interface WhatsAppSession {
  id: string
  user_id: string
  encrypted_session: string
  phone_number: string | null
  device_name: string | null
  expires_at: Date
  created_at: Date
}

interface PendingSession {
  id: string
  qrPromise: Promise<string>
  resolve: (qr: string) => void
  reject: (err: Error) => void
  userId: string
  timeout: NodeJS.Timeout
}

export class WhatsAppPreAuthService {
  private encryption: SessionEncryption
  private pendingSessions: Map<string, PendingSession> = new Map()
  private sock: ReturnType<typeof makeWASocket> | null = null
  private authState: AuthenticationState | null = null

  constructor(masterKey: string) {
    this.encryption = new SessionEncryption(masterKey)
  }

  async startPreAuth(userId: string): Promise<{
    sessionId: string
    qrCode: string
    expiresIn: number
  }> {
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
      })
    })

    const { state, saveCreds } = await useMultiFileAuthState(`/tmp/wa-auth-${sessionId}`)
    this.authState = state

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
          const qrDataUrl = await QRCode.toDataURL(qr, {
            margin: 2,
            width: 300,
            color: { dark: '#000000', light: '#FFFFFF' },
          })
          pending.resolve(qrDataUrl)
        }
      }
      
      if (connection === 'open') {
        logger.info({ sessionId }, 'WhatsApp connected successfully')
        await saveCreds()
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

  async getPreAuthStatus(sessionId: string): Promise<{
    status: 'pending' | 'connected' | 'expired' | 'failed'
    qrCode?: string
    phoneNumber?: string
  }> {
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

    const session = await queryOne<WhatsAppSession>(
      'SELECT * FROM whatsapp_sessions WHERE id = $1',
      [sessionId]
    )

    if (!session) {
      return { status: 'expired' }
    }

    if (new Date() > session.expires_at) {
      return { status: 'expired' }
    }

    return {
      status: 'connected',
      phoneNumber: session.phone_number || undefined,
    }
  }

  async completePreAuth(sessionId: string): Promise<{
    success: boolean
    whatsappSessionId: string
    encryptedSession: string
  }> {
    logger.info({ sessionId }, 'Completing pre-auth')

    if (!this.authState) {
      throw new Error('Auth state not available')
    }

    const keysData: Record<string, Record<string, unknown>> = {}
    const keyTypes: (keyof SignalDataTypeMap)[] = ['pre-key', 'session', 'sender-key', 'app-state-sync-key']
    
    for (const type of keyTypes) {
      const keys = await this.authState.keys.get(type, [])
      keysData[type] = keys
    }

    const sessionData = {
      creds: this.authState.creds,
      keys: keysData,
    }

    const encryptedSession = this.encryption.encryptSession(sessionData)

    const phoneNumber = this.authState.creds.me?.jid?.replace('@s.whatsapp.net', '') || null

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const userId = this.pendingSessions.get(sessionId)?.userId || ''

    await query(
      `INSERT INTO whatsapp_sessions (id, user_id, encrypted_session, phone_number, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET encrypted_session = $3, phone_number = $4`,
      [sessionId, userId, encryptedSession, phoneNumber, expiresAt]
    )

    this.pendingSessions.delete(sessionId)
    
    return {
      success: true,
      whatsappSessionId: sessionId,
      encryptedSession,
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

  async getSession(userId: string): Promise<{
    sessionId: string
    encryptedSession: string
    phoneNumber: string | null
  } | null> {
    const session = await queryOne<WhatsAppSession>(
      `SELECT * FROM whatsapp_sessions 
       WHERE user_id = $1 AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    )

    if (!session) {
      return null
    }

    return {
      sessionId: session.id,
      encryptedSession: session.encrypted_session,
      phoneNumber: session.phone_number,
    }
  }

  async revokeSession(userId: string): Promise<void> {
    logger.info({ userId }, 'Revoking WhatsApp session')
    await query('DELETE FROM whatsapp_sessions WHERE user_id = $1', [userId])
  }
}
