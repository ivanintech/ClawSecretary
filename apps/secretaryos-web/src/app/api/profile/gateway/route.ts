'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  const supabase = await createClient()

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { gatewayUrl } = body

  if (!gatewayUrl) {
    return NextResponse.json({ error: 'Gateway URL required' }, { status: 400 })
  }

  // Validate URL format
  try {
    const url = new URL(gatewayUrl)
    if (!['ws:', 'wss:', 'http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid protocol')
    }
  } catch {
    return NextResponse.json({ error: 'Invalid gateway URL format' }, { status: 400 })
  }

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({ 
      gateway_url: gatewayUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating gateway URL:', error)
    return NextResponse.json({ error: 'Failed to update gateway URL' }, { status: 500 })
  }

  return NextResponse.json({ success: true, gatewayUrl })
}

export async function GET() {
  const supabase = await createClient()

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('gateway_url')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching gateway URL:', error)
    return NextResponse.json({ gateway_url: null })
  }

  return NextResponse.json({ gateway_url: profile?.gateway_url })
}
