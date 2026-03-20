import crypto from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32
const IV_LENGTH = 16
const SALT_LENGTH = 32

export interface EncryptedData {
  iv: string
  encryptedData: string
  authTag: string
  salt: string
}

export class SessionEncryption {
  private masterKey: Buffer

  constructor(masterKeyBase64: string) {
    this.masterKey = Buffer.from(masterKeyBase64, 'base64')
    if (this.masterKey.length !== KEY_LENGTH) {
      throw new Error(`Master key must be ${KEY_LENGTH} bytes`)
    }
  }

  private deriveKey(salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(this.masterKey, salt, 100000, KEY_LENGTH, 'sha256')
  }

  encrypt(plaintext: string): EncryptedData {
    const salt = crypto.randomBytes(SALT_LENGTH)
    const iv = crypto.randomBytes(IV_LENGTH)
    const key = this.deriveKey(salt)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    
    let encrypted = cipher.update(plaintext, 'utf8', 'base64')
    encrypted += cipher.final('base64')
    
    const authTag = cipher.getAuthTag()

    return {
      iv: iv.toString('base64'),
      encryptedData: encrypted,
      authTag: authTag.toString('base64'),
      salt: salt.toString('base64'),
    }
  }

  decrypt(data: EncryptedData): string {
    const salt = Buffer.from(data.salt, 'base64')
    const iv = Buffer.from(data.iv, 'base64')
    const authTag = Buffer.from(data.authTag, 'base64')
    const key = this.deriveKey(salt)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(data.encryptedData, 'base64', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }

  encryptSession(sessionData: object): string {
    const json = JSON.stringify(sessionData)
    const encrypted = this.encrypt(json)
    return JSON.stringify(encrypted)
  }

  decryptSession<T = unknown>(encryptedSession: string): T {
    const data: EncryptedData = JSON.parse(encryptedSession)
    const json = this.decrypt(data)
    return JSON.parse(json) as T
  }
}

export function generateMasterKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('base64')
}

export function generateBridgeToken(): string {
  return crypto.randomBytes(32).toString('base64url')
}

export function generateQRToken(): string {
  return crypto.randomBytes(16).toString('base64url')
}

// HMAC for QR signature verification
export function signQRPayload(payload: object, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(JSON.stringify(payload))
  return hmac.digest('base64url')
}

export function verifyQRPayload(payload: object, signature: string, secret: string): boolean {
  const expected = signQRPayload(payload, secret)
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}
