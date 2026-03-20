import WebSocket from 'ws'
import { v4 as uuidv4 } from 'uuid'
import type pino from 'pino'
import type { MobileConfig } from './config.js'

export type MessageHandler = (message: IncomingMessage) => Promise<void>

export interface BridgeMessage {
  type: 'message' | 'ack' | 'typing' | 'presence' | 'config' | 'ping' | 'pong'
  id: string
  from?: string
  to?: string
  payload: unknown
  timestamp: number
}

export interface IncomingMessage {
  id: string
  from: string
  fromMe: boolean
  message: string
  timestamp: number
}

export class BridgeClient {
  private ws: WebSocket | null = null
  private config: MobileConfig
  private logger: pino.Logger
  private messageHandler: MessageHandler | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectDelay = 1000
  private pingInterval: NodeJS.Timeout | null = null
  private isConnecting = false

  constructor(config: MobileConfig, logger: pino.Logger) {
    this.config = config
    this.logger = logger
  }

  setMessageHandler(handler: MessageHandler): void {
    this.messageHandler = handler
  }

  async connect(): Promise<boolean> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return true
    }

    this.isConnecting = true

    const wsUrl = this.config.bridgeUrl
      .replace(/^http/, 'ws')
      .replace(/\/api$/, '/relay')

    const url = `${wsUrl}?device-token=${encodeURIComponent(this.config.bridgeToken)}&session=${encodeURIComponent(this.config.encryptedSession)}`

    this.logger.info({ url: wsUrl }, 'Connecting to bridge')

    return new Promise((resolve) => {
      this.ws = new WebSocket(url)

      this.ws.on('open', () => {
        this.logger.info('Connected to bridge')
        this.isConnecting = false
        this.reconnectAttempts = 0
        this.startPing()
        resolve(true)
      })

      this.ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString()) as BridgeMessage
          await this.handleMessage(message)
        } catch (error) {
          this.logger.error({ error }, 'Failed to parse message')
        }
      })

      this.ws.on('close', (code, reason) => {
        this.logger.info({ code, reason }, 'Disconnected from bridge')
        this.isConnecting = false
        this.stopPing()
        this.scheduleReconnect()
      })

      this.ws.on('error', (error) => {
        this.logger.error({ error }, 'WebSocket error')
        this.isConnecting = false
      })
    })
  }

  private async handleMessage(message: BridgeMessage): Promise<void> {
    switch (message.type) {
      case 'message':
        if (this.messageHandler && message.payload) {
          const payload = message.payload as {
            text?: string
            conversation?: string
            extendedTextMessage?: { text: string }
          }
          const text = payload.text || payload.conversation || 
                       payload.extendedTextMessage?.text || ''
          
          if (text) {
            await this.messageHandler({
              id: message.id,
              from: message.from || '',
              fromMe: false,
              message: text,
              timestamp: message.timestamp
            })
          }
        }
        break

      case 'ack':
        this.logger.debug({ messageId: message.id, payload: message.payload }, 'Message ack')
        break

      case 'pong':
        this.logger.debug('Pong received')
        break

      case 'config':
        if (message.payload) {
          const payload = message.payload as Partial<MobileConfig>
          Object.assign(this.config, payload)
          this.logger.info('Config updated from bridge')
        }
        break

      default:
        this.logger.debug({ message }, 'Unknown message type')
    }
  }

  async sendMessage(to: string, text: string): Promise<string> {
    const messageId = uuidv4()

    const message: BridgeMessage = {
      type: 'message',
      id: messageId,
      to,
      payload: { text },
      timestamp: Date.now()
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      this.logger.warn('Cannot send message - not connected')
    }

    return messageId
  }

  async sendTyping(to: string, isTyping: boolean): Promise<void> {
    const message: BridgeMessage = {
      type: 'typing',
      id: uuidv4(),
      to,
      payload: { isTyping },
      timestamp: Date.now()
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  async sendPresence(jid: string, presence: 'available' | 'unavailable'): Promise<void> {
    const message: BridgeMessage = {
      type: 'presence',
      id: uuidv4(),
      payload: { jid, presence },
      timestamp: Date.now()
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const message: BridgeMessage = {
          type: 'ping',
          id: uuidv4(),
          payload: {},
          timestamp: Date.now()
        }
        this.ws.send(JSON.stringify(message))
      }
    }, 30000)
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    this.logger.info({ 
      attempt: this.reconnectAttempts, 
      delay 
    }, 'Scheduling reconnect')

    setTimeout(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        this.connect()
      }
    }, delay)
  }

  disconnect(): void {
    this.stopPing()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}
