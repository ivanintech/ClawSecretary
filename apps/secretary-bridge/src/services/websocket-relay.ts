import { DeviceManager } from './device-manager.js'
import { SessionEncryption } from '../utils/encryption.js'
import { query } from '../db/client.js'
import type pino from 'pino'
import type { WebSocket } from 'ws'

export interface RelayMessage {
  type: 'message' | 'ack' | 'typing' | 'presence'
  id: string
  from?: string
  to?: string
  payload: unknown
  timestamp: number
}

export interface DeviceConnection {
  deviceId: string
  userId: string
  socket: WebSocket
  phoneNumber: string | null
  isAlive: boolean
  lastSeen: Date
}

export class WebSocketRelayService {
  private encryption: SessionEncryption
  private deviceManager: DeviceManager
  private connections: Map<string, DeviceConnection> = new Map()
  private logger: pino.Logger

  constructor(
    masterKey: string,
    deviceManager: DeviceManager,
    logger: pino.Logger
  ) {
    this.encryption = new SessionEncryption(masterKey)
    this.deviceManager = deviceManager
    this.logger = logger
  }

  async handleConnection(
    socket: WebSocket,
    deviceToken: string,
    encryptedSession: string
  ): Promise<{ success: boolean; deviceId?: string; error?: string }> {
    try {
      const decrypted = this.encryption.decryptSession(encryptedSession) as string
      const sessionData = JSON.parse(decrypted) as { userId?: string; phoneNumber?: string }
      
      const userId = sessionData.userId
      if (!userId) {
        return { success: false, error: 'Invalid session data' }
      }

      const deviceId = await this.deviceManager.registerDevice(userId, {
        token: deviceToken,
        phoneNumber: sessionData.phoneNumber || null,
      })

      const connection: DeviceConnection = {
        deviceId,
        userId,
        socket,
        phoneNumber: sessionData.phoneNumber || null,
        isAlive: true,
        lastSeen: new Date(),
      }

      this.connections.set(deviceId, connection)
      this.logger.info({ deviceId, userId }, 'Device connected')

      this.setupSocketHandlers(connection)

      return { success: true, deviceId }
    } catch (error) {
      this.logger.error({ error }, 'Failed to handle WebSocket connection')
      return { success: false, error: 'Authentication failed' }
    }
  }

  private setupSocketHandlers(connection: DeviceConnection): void {
    const { socket, deviceId } = connection

    socket.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString()) as RelayMessage
        await this.handleMessage(connection, message)
      } catch (error) {
        this.logger.error({ error, deviceId }, 'Failed to process message')
      }
    })

    socket.on('pong', () => {
      connection.isAlive = true
    })

    socket.on('close', () => {
      this.logger.info({ deviceId }, 'Device disconnected')
      this.connections.delete(deviceId)
    })

    socket.on('error', (error) => {
      this.logger.error({ error, deviceId }, 'WebSocket error')
      this.connections.delete(deviceId)
    })
  }

  private async handleMessage(
    connection: DeviceConnection,
    message: RelayMessage
  ): Promise<void> {
    connection.lastSeen = new Date()
    connection.isAlive = true

    switch (message.type) {
      case 'message':
        await this.handleRelayMessage(connection, message)
        break
      case 'ack':
        await this.handleAck(connection, message)
        break
      case 'typing':
        await this.handleTyping(connection, message)
        break
      case 'presence':
        await this.handlePresence(connection, message)
        break
    }
  }

  private async handleRelayMessage(
    connection: DeviceConnection,
    message: RelayMessage
  ): Promise<void> {
    this.logger.debug({
      deviceId: connection.deviceId,
      messageId: message.id,
      to: message.to
    }, 'Relaying message')

    await query(
      `INSERT INTO message_metrics (user_id, direction, status) VALUES ($1, $2, 'relayed')`,
      [connection.userId, message.to ? 'outbound' : 'inbound']
    )

    const ack: RelayMessage = {
      type: 'ack',
      id: message.id,
      payload: { status: 'delivered', timestamp: Date.now() },
      timestamp: Date.now(),
    }
    connection.socket.send(JSON.stringify(ack))
  }

  private async handleAck(
    connection: DeviceConnection,
    message: RelayMessage
  ): Promise<void> {
    this.logger.debug({
      deviceId: connection.deviceId,
      messageId: message.id,
      status: (message.payload as { status: string }).status
    }, 'Message ack received')
  }

  private async handleTyping(
    connection: DeviceConnection,
    message: RelayMessage
  ): Promise<void> {
    const payload = message.payload as { to: string; isTyping: boolean }
    this.logger.debug({
      deviceId: connection.deviceId,
      to: payload.to,
      isTyping: payload.isTyping
    }, 'Typing indicator')
  }

  private async handlePresence(
    connection: DeviceConnection,
    message: RelayMessage
  ): Promise<void> {
    const payload = message.payload as { jid: string; presence: string }
    this.logger.debug({
      deviceId: connection.deviceId,
      jid: payload.jid,
      presence: payload.presence
    }, 'Presence update')
  }

  getConnection(deviceId: string): DeviceConnection | undefined {
    return this.connections.get(deviceId)
  }

  getUserConnections(userId: string): DeviceConnection[] {
    return Array.from(this.connections.values()).filter(
      (c) => c.userId === userId
    )
  }

  getActiveConnectionCount(): number {
    return this.connections.size
  }

  async pingConnections(): Promise<number> {
    let alive = 0
    for (const connection of this.connections.values()) {
      if (connection.isAlive) {
        alive++
      } else {
        connection.socket.terminate()
        this.connections.delete(connection.deviceId)
      }
      connection.isAlive = false
      connection.socket.ping()
    }
    return alive
  }
}
