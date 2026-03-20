'use server'

import { NextResponse } from 'next/server'
import { getBridgeClient } from '@/lib/bridge/client'

interface WhatsAppLoginResult {
  success: boolean
  qrDataUrl?: string
  qrCode?: string
  sessionId?: string
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

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('gateway_url, bridge_url, whatsapp_connected, whatsapp_phone, whatsapp_name, whatsapp_session_id, whatsapp_encrypted_session, whatsapp_preauth_started, whatsapp_preauth_expires')
      .eq('id', user.id)
      .single()

    const profile = profileData as {
      gateway_url?: string
      bridge_url?: string
      whatsapp_connected?: boolean
      whatsapp_phone?: string
      whatsapp_name?: string
      whatsapp_session_id?: string
      whatsapp_encrypted_session?: string
      whatsapp_preauth_started?: boolean
      whatsapp_preauth_expires?: string
    }

    const body = await request.json().catch(() => ({}))
    const { action = 'start' } = body

    const bridgeUrl = profile?.bridge_url || process.env.BRIDGE_URL || 'http://localhost:3001'
    const bridge = getBridgeClient({ url: bridgeUrl })

    if (action === 'start') {
      try {
        const result = await bridge.startWhatsAppPreAuth(user.id)
        
        await supabase
          .from('profiles')
          .update({
            whatsapp_session_id: result.sessionId,
            whatsapp_preauth_started: true,
            whatsapp_preauth_expires: new Date(Date.now() + result.expiresIn * 1000).toISOString()
          })
          .eq('id', user.id)

        return NextResponse.json({
          success: true,
          status: 'pending',
          qrCode: result.qrCode,
          sessionId: result.sessionId,
          message: 'Escanea el código QR con WhatsApp',
          expiresIn: result.expiresIn
        } as WhatsAppLoginResult)
      } catch (bridgeError) {
        console.error('Bridge error:', bridgeError)
        
        const demoQR = generateDemoQR()
        return NextResponse.json({
          success: true,
          status: 'pending',
          qrCode: demoQR,
          sessionId: `demo-${Date.now()}`,
          message: 'Escanea este código con WhatsApp (Demo)',
          demo: true,
          expiresIn: 60
        } as WhatsAppLoginResult)
      }
    }

    if (action === 'status') {
      if (profile?.whatsapp_connected) {
        return NextResponse.json({
          success: true,
          connected: true,
          status: 'connected',
          phone: profile.whatsapp_phone,
          name: profile.whatsapp_name
        })
      }

      const sessionId = profile?.whatsapp_session_id
      if (sessionId && !sessionId.startsWith('demo-')) {
        try {
          const status = await bridge.getWhatsAppStatus(sessionId)
          
          if (status.status === 'connected' && status.phoneNumber) {
            await supabase
              .from('profiles')
              .update({
                whatsapp_connected: true,
                whatsapp_phone: status.phoneNumber
              })
              .eq('id', user.id)

            return NextResponse.json({
              success: true,
              connected: true,
              status: 'connected',
              phone: status.phoneNumber
            })
          }

          return NextResponse.json({
            success: true,
            status: status.status,
            qrCode: status.qrCode,
            connected: false
          })
        } catch {
          // Fall through to demo mode
        }
      }

      return NextResponse.json({
        success: true,
        connected: false,
        status: profile?.whatsapp_preauth_started ? 'pending' : 'not_linked',
        qrCode: profile?.whatsapp_preauth_started ? 'demo-qr' : undefined
      })
    }

    if (action === 'complete') {
      const sessionId = body.sessionId || profile?.whatsapp_session_id
      if (!sessionId || sessionId.startsWith('demo-')) {
        return NextResponse.json({
          success: true,
          connected: true,
          message: 'Demo mode - session simulated'
        })
      }

      try {
        const result = await bridge.completeWhatsAppPreAuth(sessionId)
        
        await supabase
          .from('profiles')
          .update({
            whatsapp_connected: true,
            whatsapp_encrypted_session: result.encryptedSession,
            whatsapp_session_id: result.whatsappSessionId
          })
          .eq('id', user.id)

        return NextResponse.json({
          success: true,
          connected: true,
          sessionId: result.whatsappSessionId
        })
      } catch (error) {
        console.error('Complete error:', error)
        return NextResponse.json({
          success: false,
          error: 'Failed to complete WhatsApp connection'
        })
      }
    }

    if (action === 'logout') {
      const sessionId = profile?.whatsapp_session_id
      
      if (sessionId && !sessionId.startsWith('demo-')) {
        try {
          await bridge.cancelWhatsAppPreAuth(sessionId)
        } catch {
          // Ignore bridge errors on logout
        }
      }

      await supabase
        .from('profiles')
        .update({
          whatsapp_connected: false,
          whatsapp_phone: null,
          whatsapp_name: null,
          whatsapp_session_id: null,
          whatsapp_encrypted_session: null,
          whatsapp_preauth_started: false
        })
        .eq('id', user.id)

      return NextResponse.json({
        success: true,
        message: 'Logged out from WhatsApp'
      })
    }

    if (action === 'getSession') {
      if (!profile?.whatsapp_encrypted_session) {
        return NextResponse.json({
          success: false,
          error: 'No session available'
        })
      }

      return NextResponse.json({
        success: true,
        sessionId: profile.whatsapp_session_id,
        encryptedSession: profile.whatsapp_encrypted_session,
        phoneNumber: profile.whatsapp_phone
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

export async function GET() {
  return NextResponse.json({ 
    error: 'Use POST to interact with WhatsApp login'
  }, { status: 405 })
}

function generateDemoQR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 50; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
