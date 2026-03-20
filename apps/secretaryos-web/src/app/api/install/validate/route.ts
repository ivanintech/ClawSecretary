'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

  // Generate the pairing URL
  // Format: openclaw://pair?gateway={gatewayUrl}&token={pairingToken}
  const pairingToken = generatePairingToken()
  const pairingUrl = `openclaw://pair?gateway=${encodeURIComponent(gatewayUrl)}&token=${pairingToken}`

  return NextResponse.json({
    success: true,
    pairingUrl,
    gatewayUrl,
    deviceType: installToken.device_type
  })
}

function generatePairingToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
