import Fastify from 'fastify'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'
import jwt from '@fastify/jwt'
import { WhatsAppPreAuthService } from './services/whatsapp-preauth.js'
import { DeviceManager } from './services/device-manager.js'
import { WebSocketRelayService } from './services/websocket-relay.js'
import { healthCheck } from './db/client.js'
import type { WebSocket } from 'ws'

const fastify = Fastify({
  logger: true,
})

await fastify.register(cors, {
  origin: true,
})

await fastify.register(websocket)

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
})

const MASTER_KEY = process.env.SESSION_ENCRYPTION_KEY || 'default-dev-key-32-chars-xxxx'

const preAuthService = new WhatsAppPreAuthService(MASTER_KEY)
const deviceManager = new DeviceManager()
const relayService = new WebSocketRelayService(deviceManager, fastify.log as never)

setInterval(async () => {
  await relayService.pingConnections()
}, 30000)

setInterval(async () => {
  await deviceManager.cleanupInactiveDevices()
}, 60 * 60 * 1000)

fastify.get('/health', async () => {
  const dbHealthy = await healthCheck()
  return {
    status: 'ok',
    database: dbHealthy ? 'connected' : 'disconnected',
    connections: relayService.getActiveConnectionCount()
  }
})

fastify.post<{
  Body: { userId: string }
}>('/auth/whatsapp/start', async (request, reply) => {
  const { userId } = request.body
  
  if (!userId) {
    return reply.status(400).send({ error: 'userId is required' })
  }
  
  try {
    const result = await preAuthService.startPreAuth(userId)
    return result
  } catch (error) {
    fastify.log.error(error)
    return reply.status(500).send({ error: 'Failed to start WhatsApp pre-auth' })
  }
})

fastify.get<{
  Params: { sessionId: string }
}>('/auth/whatsapp/status/:sessionId', async (request, reply) => {
  const { sessionId } = request.params
  
  try {
    const status = await preAuthService.getPreAuthStatus(sessionId)
    return status
  } catch (error) {
    fastify.log.error(error)
    return reply.status(500).send({ error: 'Failed to get pre-auth status' })
  }
})

fastify.post<{
  Params: { sessionId: string }
}>('/auth/whatsapp/complete/:sessionId', async (request, reply) => {
  const { sessionId } = request.params
  
  try {
    const result = await preAuthService.completePreAuth(sessionId)
    return result
  } catch (error) {
    fastify.log.error(error)
    return reply.status(500).send({ error: 'Failed to complete pre-auth' })
  }
})

fastify.delete<{
  Params: { sessionId: string }
}>('/auth/whatsapp/cancel/:sessionId', async (request, reply) => {
  const { sessionId } = request.params
  
  try {
    await preAuthService.cancelPreAuth(sessionId)
    return { success: true }
  } catch (error) {
    fastify.log.error(error)
    return reply.status(500).send({ error: 'Failed to cancel pre-auth' })
  }
})

fastify.get<{
  Params: { userId: string }
  Headers: { authorization: string }
}>('/devices/:userId', async (request, reply) => {
  const { userId } = request.params
  const token = request.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
  
  try {
    await fastify.jwt.verify(token)
    const devices = await deviceManager.getUserDevices(userId)
    return { devices }
  } catch {
    return reply.status(401).send({ error: 'Invalid token' })
  }
})

fastify.delete<{
  Params: { deviceId: string }
  Headers: { authorization: string }
}>('/devices/:deviceId', async (request, reply) => {
  const { deviceId } = request.params
  const token = request.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
  
  try {
    await fastify.jwt.verify(token)
    await deviceManager.deactivateDevice(deviceId)
    return { success: true }
  } catch {
    return reply.status(401).send({ error: 'Invalid token' })
  }
})

fastify.get('/metrics', async () => {
  return {
    activeConnections: relayService.getActiveConnectionCount(),
    timestamp: new Date().toISOString()
  }
})

fastify.register(async function (fastify) {
  fastify.get('/relay', { websocket: true }, (socket, req) => {
    const query = req.query as { 'device-token'?: string; session?: string }
    const deviceToken = query['device-token']
    const encryptedSession = query.session

    if (!deviceToken || !encryptedSession) {
      socket.send(JSON.stringify({ error: 'Missing authentication parameters' }))
      socket.close(4001, 'Missing auth')
      return
    }

    try {
      const deviceId = relayService.handleConnection(
        socket as unknown as WebSocket,
        deviceToken,
        encryptedSession
      )
      socket.send(JSON.stringify({
        type: 'connected',
        deviceId,
        timestamp: Date.now()
      }))
    } catch (error) {
      fastify.log.error(error)
      socket.send(JSON.stringify({ error: 'Connection failed' }))
      socket.close(4001, 'Connection failed')
    }
  })
})

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10)
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`SecretaryOS Bridge running on port ${port}`)
    console.log(`WebSocket relay endpoint: ws://localhost:${port}/relay`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
