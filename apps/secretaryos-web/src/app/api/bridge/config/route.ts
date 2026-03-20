'use server'

import { NextResponse } from 'next/server'
import { getBridgeClient } from '@/lib/bridge/client'

export async function POST(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bridgeUrl } = await request.json().catch(() => ({ bridgeUrl: null }))

    if (!bridgeUrl) {
      return NextResponse.json({ error: 'bridgeUrl is required' }, { status: 400 })
    }

    const bridge = getBridgeClient({ url: bridgeUrl })
    
    try {
      const health = await bridge.healthCheck()
      
      await supabase
        .from('profiles')
        .update({ bridge_url: bridgeUrl })
        .eq('id', user.id)

      return NextResponse.json({
        success: true,
        connected: true,
        health
      })
    } catch (bridgeError) {
      return NextResponse.json({
        success: false,
        connected: false,
        error: 'Cannot connect to bridge server'
      })
    }

  } catch (err) {
    console.error('Bridge config error:', err)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('bridge_url')
      .eq('id', user.id)
      .single()

    if (!profile?.bridge_url) {
      return NextResponse.json({ configured: false })
    }

    const bridge = getBridgeClient({ url: profile.bridge_url })
    
    try {
      const health = await bridge.healthCheck()
      return NextResponse.json({
        configured: true,
        url: profile.bridge_url,
        healthy: true,
        health
      })
    } catch {
      return NextResponse.json({
        configured: true,
        url: profile.bridge_url,
        healthy: false
      })
    }

  } catch (err) {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
