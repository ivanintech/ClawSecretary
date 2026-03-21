export interface BridgeConfig {
  url: string
  apiKey?: string
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
}

export interface DeviceInfo {
  id: string
  phoneNumber: string | null
  lastSeen: string
  isActive: boolean
}

export class BridgeClient {
  private config: BridgeConfig
  private timeout = 90000 // 90 seconds for WhatsApp pre-auth

  constructor(config: BridgeConfig) {
    this.config = config
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.url}${path}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    })

    if (!response.ok) {
      const error = await response.text().catch(() => 'Unknown error')
      throw new Error(`Bridge request failed: ${response.status} ${error}`)
    }

    return response.json()
  }

  async healthCheck(): Promise<{ status: string; database: string; connections: number }> {
    return this.request('/health')
  }

  async startWhatsAppPreAuth(userId: string): Promise<WhatsAppPreAuthResult> {
    return this.request<WhatsAppPreAuthResult>('/auth/whatsapp/start', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
  }

  async getWhatsAppStatus(sessionId: string): Promise<WhatsAppStatusResult> {
    return this.request<WhatsAppStatusResult>(`/auth/whatsapp/status/${sessionId}`)
  }

  async completeWhatsAppPreAuth(sessionId: string): Promise<WhatsAppCompleteResult> {
    return this.request<WhatsAppCompleteResult>(`/auth/whatsapp/complete/${sessionId}`, {
      method: 'POST',
    })
  }

  async cancelWhatsAppPreAuth(sessionId: string): Promise<void> {
    await this.request(`/auth/whatsapp/cancel/${sessionId}`, {
      method: 'DELETE',
    })
  }

  async getSession(userId: string, token: string): Promise<{
    sessionId: string
    encryptedSession: string
    phoneNumber: string | null
  } | { error: string }> {
    return this.request(`/sessions/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
  }

  async revokeSession(userId: string, token: string): Promise<void> {
    await this.request(`/sessions/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
  }

  async getDevices(userId: string, token: string): Promise<{ devices: DeviceInfo[] }> {
    return this.request(`/devices/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
  }

  async deactivateDevice(deviceId: string, token: string): Promise<void> {
    await this.request(`/devices/${deviceId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
  }

  getWebSocketUrl(deviceToken: string, encryptedSession: string): string {
    const wsUrl = this.config.url.replace(/^http/, 'ws')
    return `${wsUrl}/relay?device-token=${encodeURIComponent(deviceToken)}&session=${encodeURIComponent(encryptedSession)}`
  }

  getMetrics(): Promise<{ activeConnections: number; timestamp: string }> {
    return this.request('/metrics')
  }
}

let cachedClient: BridgeClient | null = null

export function getBridgeClient(config?: BridgeConfig): BridgeClient {
  if (config) {
    cachedClient = new BridgeClient(config)
  }
  
  if (!cachedClient) {
    const url = process.env.BRIDGE_URL || 'http://localhost:3001'
    const apiKey = process.env.BRIDGE_API_KEY
    cachedClient = new BridgeClient({ url, apiKey })
  }
  
  return cachedClient
}
