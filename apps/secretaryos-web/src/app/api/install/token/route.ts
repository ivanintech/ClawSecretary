'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { deviceType = 'mobile' } = body

  // Generate token
  const token = generateSecureToken()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

  // Store token
  const { data: installToken, error } = await supabase
    .from('install_tokens')
    .insert({
      user_id: user.id,
      token,
      device_type: deviceType,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating install token:', error)
    return NextResponse.json({ error: 'Failed to create token' }, { status: 500 })
  }

  // Get install URL (use request headers to determine base URL)
  const headersList = await headers()
  const host = headersList.get('host') || 'secretaryos.app'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const installUrl = `${baseUrl}/install/setup/${token}`

  return NextResponse.json({
    token,
    installUrl,
    expiresAt: expiresAt.toISOString(),
    qrUrl: installUrl, // For QR code generation
  })
}

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => chars[byte % chars.length]).join('')
}
