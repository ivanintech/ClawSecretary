'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface SetupCodePayload {
  url: string
  bootstrapToken?: string
  token?: string
  password?: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Find the token
  const { data: installToken, error } = await supabase
    .from('install_tokens')
    .select('*, profiles(gateway_url)')
    .eq('token', token)
    .single()

  if (error || !installToken) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 })
  }

  // Check if expired
  if (new Date(installToken.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expired' }, { status: 410 })
  }

  // Check if already used
  if (installToken.used_at) {
    return NextResponse.json({ error: 'Token already used' }, { status: 410 })
  }

  // Get gateway URL from profile
  const gatewayUrl = installToken.profiles?.gateway_url

  if (!gatewayUrl) {
    return NextResponse.json({ 
      error: 'Gateway not configured',
      setupRequired: true 
    }, { status: 400 })
  }

  // Mark token as used
  await supabase
    .from('install_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', installToken.id)

  // Parse gateway URL to extract host, port, and scheme
  const parsedUrl = parseGatewayUrl(gatewayUrl)
  if (!parsedUrl) {
    return NextResponse.json({ error: 'Invalid gateway URL' }, { status: 400 })
  }

  // Generate pairing token
  const pairingToken = generatePairingToken()

  // Build WebSocket URL (same as gateway URL but with ws/wss scheme)
  const wsScheme = parsedUrl.tls ? 'wss' : 'ws'
  const wsUrl = `${wsScheme}://${parsedUrl.host}:${parsedUrl.port}`

  // Create setup code payload (works for both iOS and Android)
  const payload: SetupCodePayload = {
    url: wsUrl,
    token: pairingToken,
  }

  // Encode as base64url (URL-safe base64)
  const setupCode = encodeBase64Url(JSON.stringify(payload))

  return NextResponse.json({
    success: true,
    setupCode,
    gatewayUrl,
    deviceType: installToken.device_type
  })
}

function parseGatewayUrl(url: string): { host: string; port: number; tls: boolean } | null {
  try {
    // Handle both full URLs and host:port formats
    let host: string
    let port: number
    let tls: boolean

    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ws://') || url.startsWith('wss://')) {
      const parsed = new URL(url)
      host = parsed.hostname
      port = parsed.port ? parseInt(parsed.port) : (url.startsWith('https') || url.startsWith('wss') ? 443 : 18789)
      tls = url.startsWith('https') || url.startsWith('wss')
    } else {
      // host:port format
      const parts = url.split(':')
      host = parts[0]
      port = parts[1] ? parseInt(parts[1]) : 18789
      tls = false
    }

    if (!host || isNaN(port)) return null
    return { host, port, tls }
  } catch {
    return null
  }
}

function generatePairingToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function encodeBase64Url(str: string): string {
  // Standard base64
  const base64 = Buffer.from(str).toString('base64')
  // Convert to URL-safe base64 (RFC 4648)
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
