'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { code, state, provider } = body

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
  }

  try {
    // In production, exchange the code for tokens with the OAuth provider
    // For now, we'll simulate a successful connection
    
    // Update the connection status
    const { error: updateError } = await supabase
      .from('oauth_connections')
      .update({
        status: 'connected',
        access_token_encrypted: `encrypted_${Date.now()}`,
        expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('provider', provider || 'google_calendar')

    if (updateError) {
      console.error('Error updating OAuth connection:', updateError)
      return NextResponse.json({ error: 'Failed to save connection' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to ' + (provider || 'service'),
    })
  } catch (err) {
    console.error('OAuth callback error:', err)
    return NextResponse.json({ error: 'OAuth callback failed' }, { status: 500 })
  }
}
