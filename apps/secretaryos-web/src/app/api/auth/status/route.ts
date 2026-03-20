'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    return NextResponse.json({
      authenticated: !!user,
      userId: user?.id || null
    })
  } catch {
    return NextResponse.json({
      authenticated: false,
      userId: null
    })
  }
}
