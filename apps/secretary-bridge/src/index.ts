import Fastify from 'fastify'
import cors from '@fastify/cors'
import websocket from '@fastify/websocket'
import jwt from '@fastify/jwt'
import { WhatsAppPreAuthService } from './services/whatsapp-preauth.js'
import { healthCheck } from './db/client.js'
import { v4 as uuidv4 } from 'uuid'

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

const preAuthService = new WhatsAppPreAuthService(
  process.env.SESSION_ENCRYPTION_KEY || 'default-dev-key-32-chars-xxxx'
)

fastify.get('/health', async () => {
  const dbHealthy = await healthCheck()
  return { status: 'ok', database: dbHealthy ? 'connected' : 'disconnected' }
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
}>('/sessions/:userId', async (request, reply) => {
  const { userId } = request.params
  const token = request.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
  
  try {
    await fastify.jwt.verify(token)
    const session = await preAuthService.getSession(userId)
    return session || { error: 'No active session' }
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid token' })
  }
})

fastify.delete<{
  Params: { userId: string }
  Headers: { authorization: string }
}>('/sessions/:userId', async (request, reply) => {
  const { userId } = request.params
  const token = request.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }
  
  try {
    await fastify.jwt.verify(token)
    await preAuthService.revokeSession(userId)
    return { success: true }
  } catch (error) {
    return reply.status(401).send({ error: 'Invalid token' })
  }
})

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10)
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`SecretaryOS Bridge running on port ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
