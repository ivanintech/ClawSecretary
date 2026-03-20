import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  phone: z.string().optional(),
  plan: z.enum(['free', 'pro', 'team']).default('free'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type User = z.infer<typeof UserSchema>

export const WhatsAppSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  encryptedSession: z.string(),
  phoneNumber: z.string().optional(),
  deviceName: z.string().optional(),
  expiresAt: z.date(),
  createdAt: z.date().default(() => new Date()),
})

export type WhatsAppSession = z.infer<typeof WhatsAppSessionSchema>

export const InstallationQRSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  bridgeUrl: z.string().url(),
  bridgeToken: z.string(),
  whatsappSessionId: z.string().uuid().optional(),
  expiresAt: z.date(),
  used: z.boolean().default(false),
  usedAt: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
})

export type InstallationQR = z.infer<typeof InstallationQRSchema>

export const DeviceSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  deviceName: z.string(),
  platform: z.enum(['ios', 'android']),
  appVersion: z.string(),
  lastSeen: z.date(),
  isOnline: z.boolean().default(false),
  registrationToken: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
})

export type Device = z.infer<typeof DeviceSchema>

export const MetricSchema = z.object({
  id: z.number(),
  userId: z.string().uuid(),
  metricType: z.enum(['message_count', 'session_duration', 'error', 'online_time']),
  value: z.record(z.string(), z.unknown()),
  recordedAt: z.date().default(() => new Date()),
})

export type Metric = z.infer<typeof MetricSchema>

// API Request/Response types
export const PreAuthRequestSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

export type PreAuthRequest = z.infer<typeof PreAuthRequestSchema>

export const PreAuthResponseSchema = z.object({
  sessionId: z.string(),
  qrCode: z.string(),
  expiresIn: z.number(),
})

export type PreAuthResponse = z.infer<typeof PreAuthResponseSchema>

// QR Code payload structure (what gets encoded in the QR)
export const QRPayloadSchema = z.object({
  type: z.literal('secretaryos_install'),
  version: z.literal('1.0'),
  userId: z.string(),
  bridge: z.object({
    url: z.string().url(),
    token: z.string(),
  }),
  whatsapp: z.object({
    sessionId: z.string().optional(),
    encryptedSession: z.string().optional(),
  }).optional(),
  expires: z.string(),
})

export type QRPayload = z.infer<typeof QRPayloadSchema>
