'use server'

import { NextResponse } from 'next/server'

interface WhatsAppLoginResult {
  success: boolean
  qrDataUrl?: string
  qrCode?: string
  message?: string
  error?: string
  connected?: boolean
  status?: string
  phone?: string
  name?: string
}

export async function POST(request: Request) {
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile to check gateway URL
    const { data: profile } = await supabase
      .from('profiles')
      .select('gateway_url, whatsapp_connected, whatsapp_phone, whatsapp_name')
      .eq('id', user.id)
      .single()

    if (!profile?.gateway_url) {
      return NextResponse.json({ 
        error: 'Gateway not configured',
        setupRequired: true 
      }, { status: 400 })
    }

    const body = await request.json().catch(() => ({}))
    const { action = 'start' } = body

    if (action === 'start') {
      // Start WhatsApp login - generate QR code
      // Communicate with OpenClaw gateway to start WhatsApp login
      const gatewayUrl = profile.gateway_url.replace(/^http/, 'ws') + '/api/whatsapp/login'
      
      try {
        const res = await fetch(gatewayUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user.id,
            accountId: `user_${user.id.replace(/-/g, '')}`
          })
        })

        if (res.ok) {
          const data = await res.json()
          
          // Store connection info when connected
          if (data.connected) {
            await supabase
              .from('profiles')
              .update({
                whatsapp_connected: true,
                whatsapp_phone: data.phone || null,
                whatsapp_name: data.name || null
              })
              .eq('id', user.id)
          }

          return NextResponse.json(data)
        }
      } catch (err) {
        // Gateway not reachable - simulate for demo
        console.log('Gateway not reachable, simulating WhatsApp QR')
      }

      // Demo mode - return a simulated QR response
      const demoQR = generateDemoQR()
      return NextResponse.json({
        success: true,
        status: 'pending',
        qrCode: demoQR,
        message: 'Escanea este código con WhatsApp (Demo)',
        demo: true
      } as WhatsAppLoginResult)
    }

    if (action === 'status') {
      // Check if already connected from profile
      if (profile.whatsapp_connected) {
        return NextResponse.json({
          success: true,
          connected: true,
          status: 'connected',
          phone: profile.whatsapp_phone,
          name: profile.whatsapp_name
        })
      }

      // Check with gateway
      const gatewayUrl = profile.gateway_url.replace(/^http/, 'ws') + '/api/whatsapp/status'
      try {
        const res = await fetch(gatewayUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        })

        if (res.ok) {
          const data = await res.json()
          return NextResponse.json(data)
        }
      } catch {
        // Gateway not reachable
      }

      return NextResponse.json({
        success: true,
        connected: false,
        status: 'not_linked'
      })
    }

    if (action === 'logout') {
      // Logout from WhatsApp
      await supabase
        .from('profiles')
        .update({
          whatsapp_connected: false,
          whatsapp_phone: null,
          whatsapp_name: null
        })
        .eq('id', user.id)

      // Notify gateway
      const gatewayUrl = profile.gateway_url.replace(/^http/, 'ws') + '/api/whatsapp/logout'
      try {
        await fetch(gatewayUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        })
      } catch {
        // Ignore gateway errors
      }

      return NextResponse.json({
        success: true,
        message: 'Logged out from WhatsApp'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (err) {
    console.error('WhatsApp login error:', err)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to poll for QR updates
export async function GET() {
  return NextResponse.json({ 
    error: 'Use POST to interact with WhatsApp login'
  }, { status: 405 })
}

function generateDemoQR(): string {
  // Generate a demo QR code (in production, this comes from the gateway)
  // This is just a placeholder that represents WhatsApp Web QR format
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 50; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
