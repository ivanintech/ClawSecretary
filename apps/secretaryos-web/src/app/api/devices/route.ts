'use server'

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ devices: [], error: 'No access token' })
    }

    const { getBridgeClient } = await import('@/lib/bridge/client')
    const bridge = getBridgeClient()

    const { data: profile } = await supabase
      .from('profiles')
      .select('bridge_url')
      .eq('id', user.id)
      .single()

    if (profile?.bridge_url) {
      const bridgeClient = getBridgeClient({ url: profile.bridge_url })
      const result = await bridgeClient.getDevices(user.id, accessToken)
      return NextResponse.json(result)
    }

    return NextResponse.json({ devices: [] })

  } catch (err) {
    console.error('Devices error:', err)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { deviceId } = await request.json().catch(() => ({ deviceId: null }))
    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId required' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token' })
    }

    const { getBridgeClient } = await import('@/lib/bridge/client')
    const { data: profile } = await supabase
      .from('profiles')
      .select('bridge_url')
      .eq('id', user.id)
      .single()

    if (profile?.bridge_url) {
      const bridgeClient = getBridgeClient({ url: profile.bridge_url })
      await bridgeClient.deactivateDevice(deviceId, accessToken)
    }

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('Device delete error:', err)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
