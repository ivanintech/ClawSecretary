import WebSocket from 'ws'
import { v4 as uuidv4 } from 'uuid'
import type pino from 'pino'
import { DeviceManager } from './device-manager.js'

export interface BridgeMessage {
  type: 'message' | 'ack' | 'typing' | 'presence' | 'config' | 'ping' | 'pong'
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
  private deviceManager: DeviceManager
  private connections: Map<string, DeviceConnection> = new Map()
  private logger: pino.Logger

  constructor(deviceManager: DeviceManager, logger: pino.Logger) {
    this.deviceManager = deviceManager
    this.logger = logger
  }

  handleConnection(
    socket: WebSocket,
    userId: string,
    phoneNumber: string | null
  ): string {
    const deviceId = this.deviceManager.registerDevice(userId, phoneNumber)

    const connection: DeviceConnection = {
      deviceId,
      userId,
      socket,
      phoneNumber,
      isAlive: true,
      lastSeen: new Date(),
    }

    this.connections.set(deviceId, connection)
    this.logger.info({ deviceId, userId }, 'Device connected')

    this.setupSocketHandlers(connection)

    return deviceId
  }

  private setupSocketHandlers(connection: DeviceConnection): void {
    const { socket, deviceId } = connection

    socket.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString()) as BridgeMessage
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
    message: BridgeMessage
  ): Promise<void> {
    connection.lastSeen = new Date()
    connection.isAlive = true
    this.deviceManager.updateLastSeen(connection.deviceId)

    switch (message.type) {
      case 'message':
        await this.handleRelayMessage(connection, message)
        break
      case 'ack':
        this.logger.debug({ messageId: message.id }, 'Message ack')
        break
      case 'typing':
        this.logger.debug({ to: message.to }, 'Typing indicator')
        break
      case 'presence':
        this.logger.debug({ jid: (message.payload as { jid: string }).jid }, 'Presence update')
        break
      case 'pong':
        this.logger.debug('Pong received')
        break
    }
  }

  private async handleRelayMessage(
    connection: DeviceConnection,
    message: BridgeMessage
  ): Promise<void> {
    this.logger.debug({
      deviceId: connection.deviceId,
      messageId: message.id,
      to: message.to
    }, 'Message relayed')

    const ack: BridgeMessage = {
      type: 'ack',
      id: message.id,
      payload: { status: 'delivered', timestamp: Date.now() },
      timestamp: Date.now(),
    }
    connection.socket.send(JSON.stringify(ack))
  }

  sendToUser(userId: string, message: BridgeMessage): boolean {
    const userConnections = this.getUserConnections(userId)
    
    if (userConnections.length === 0) {
      return false
    }

    for (const connection of userConnections) {
      if (connection.isAlive) {
        connection.socket.send(JSON.stringify(message))
      }
    }
    
    return true
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

  pingConnections(): number {
    let alive = 0
    for (const connection of this.connections.values()) {
      if (connection.isAlive) {
        alive++
      } else {
        connection.socket.terminate()
        this.connections.delete(connection.deviceId)
        this.deviceManager.deactivateDevice(connection.deviceId)
      }
      connection.isAlive = false
      connection.socket.ping()
    }
    return alive
  }
}
