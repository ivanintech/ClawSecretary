'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface SetupCodePayload {
  url: string
  token: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let deviceType = 'mobile'
    try {
      const body = await request.json()
      deviceType = body?.deviceType || 'mobile'
    } catch {
      // No body provided, use default
    }

    // Get user's gateway URL from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('gateway_url')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.gateway_url) {
      return NextResponse.json({ 
        error: 'Gateway not configured',
        setupRequired: true
      }, { status: 400 })
    }

    const gatewayUrl = profile.gateway_url

    // Generate pairing token
    const pairingToken = generateSecureToken()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Parse gateway URL and create WebSocket URL
    const wsUrl = parseGatewayToWsUrl(gatewayUrl)
    if (!wsUrl) {
      return NextResponse.json({ error: 'Invalid gateway URL' }, { status: 400 })
    }

    // Create setup code payload (base64 encoded JSON)
    const payload: SetupCodePayload = {
      url: wsUrl,
      token: pairingToken,
    }
    const setupCode = encodeBase64Url(JSON.stringify(payload))

    // Store token
    const { error: insertError } = await supabase
      .from('install_tokens')
      .insert({
        user_id: user.id,
        token: setupCode,
        device_type: deviceType,
        expires_at: expiresAt.toISOString(),
        gateway_url: gatewayUrl,
      })

    if (insertError) {
      console.error('Error creating install token:', insertError)
      return NextResponse.json({ error: 'Failed to create token' }, { status: 500 })
    }

    return NextResponse.json({
      setupCode,
      gatewayUrl,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (err) {
    console.error('Unexpected error in /api/install/token:', err)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}

function parseGatewayToWsUrl(gatewayUrl: string): string | null {
  try {
    let host: string
    let port: number
    let tls: boolean

    if (gatewayUrl.startsWith('http://') || gatewayUrl.startsWith('https://') ||
        gatewayUrl.startsWith('ws://') || gatewayUrl.startsWith('wss://')) {
      const parsed = new URL(gatewayUrl)
      host = parsed.hostname
      port = parsed.port ? parseInt(parsed.port) : (gatewayUrl.startsWith('https') || gatewayUrl.startsWith('wss') ? 443 : 18789)
      tls = gatewayUrl.startsWith('https') || gatewayUrl.startsWith('wss')
    } else if (gatewayUrl.includes(':')) {
      // host:port format
      const [h, p] = gatewayUrl.split(':')
      host = h
      port = parseInt(p) || 18789
      tls = false
    } else {
      host = gatewayUrl
      port = 18789
      tls = false
    }

    if (!host || isNaN(port)) return null
    const scheme = tls ? 'wss' : 'ws'
    return `${scheme}://${host}:${port}`
  } catch {
    return null
  }
}

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => chars[byte % chars.length]).join('')
}

function encodeBase64Url(str: string): string {
  const base64 = Buffer.from(str).toString('base64')
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}
