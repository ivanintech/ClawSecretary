'use server'

import { NextResponse } from 'next/server'

interface BetaSignup {
  email: string
  name?: string
  phone?: string
  useCase?: string
  referralCode?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as BetaSignup
    const { email, name, phone, useCase, referralCode } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        error: 'Invalid email address' 
      }, { status: 400 })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('beta_signups')
      .insert({
        email,
        name: name || null,
        phone: phone || null,
        use_case: useCase || null,
        referral_code: referralCode || null,
        signup_source: 'landing_page'
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ 
          success: true,
          message: 'You are already on the waitlist!',
          alreadyRegistered: true
        })
      }
      console.error('Beta signup error:', error)
      return NextResponse.json({ 
        error: 'Failed to register. Please try again.' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      position: data?.position || Math.floor(Math.random() * 1000) + 100,
      message: 'You have been added to the waitlist!'
    })

  } catch (err) {
    console.error('Beta signup error:', err)
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

    const { data: signup } = await supabase
      .from('beta_signups')
      .select('position, created_at, status')
      .eq('email', user.email || '')
      .single()

    if (!signup) {
      return NextResponse.json({ registered: false })
    }

    return NextResponse.json({
      registered: true,
      position: signup.position,
      status: signup.status,
      signupDate: signup.created_at
    })

  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
