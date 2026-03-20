'use server'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const OAUTH_PROVIDERS = {
  google_calendar: {
    name: 'Google Calendar',
    description: 'Sync your calendar events and meetings',
    icon: '📅',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events'],
  },
  google_places: {
    name: 'Google Places',
    description: 'Search nearby venues and locations',
    icon: '📍',
    scopes: ['https://www.googleapis.com/auth/places'],
  },
  notion: {
    name: 'Notion',
    description: 'Sync your notes and second brain',
    icon: '🧠',
    scopes: ['read', 'update'],
  },
  slack: {
    name: 'Slack',
    description: 'Send messages and read channels',
    icon: '💬',
    scopes: ['chat:write', 'channels:read'],
  },
  outlook: {
    name: 'Microsoft Outlook',
    description: 'Sync emails and calendar',
    icon: '📧',
    scopes: ['Calendars.ReadWrite', 'Mail.Read'],
  },
  apple_reminders: {
    name: 'Apple Reminders',
    description: 'Sync with Reminders app (macOS)',
    icon: '⏰',
    scopes: [],
  },
} as const

export type OAuthProvider = keyof typeof OAUTH_PROVIDERS

export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: connections, error } = await supabase
    .from('oauth_connections')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching OAuth connections:', error)
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 })
  }

  const providers = Object.entries(OAUTH_PROVIDERS).map(([key, config]) => {
    const connection = connections?.find(c => c.provider === key)
    return {
      id: key,
      ...config,
      status: connection?.status || 'disconnected',
      connectedAt: connection?.updated_at,
      lastSyncAt: connection?.last_sync_at,
      error: connection?.error_message,
    }
  })

  return NextResponse.json({ providers })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { provider, action } = body

  if (!provider || !action) {
    return NextResponse.json({ error: 'Provider and action required' }, { status: 400 })
  }

  if (!Object.keys(OAUTH_PROVIDERS).includes(provider)) {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
  }

  switch (action) {
    case 'connect': {
      // Generate OAuth URL and store pending connection
      const config = OAUTH_PROVIDERS[provider as OAuthProvider]
      
      // Generate a state token for CSRF protection
      const state = generateStateToken()
      
      // Store connection as 'connecting'
      const { error: insertError } = await supabase
        .from('oauth_connections')
        .upsert({
          user_id: user.id,
          provider,
          status: 'connecting',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,provider'
        })

      if (insertError) {
        console.error('Error creating OAuth connection:', insertError)
        return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 })
      }

      // Generate OAuth URL based on provider
      const oauthUrl = generateOAuthUrl(provider, state)

      return NextResponse.json({
        success: true,
        oauthUrl,
        state,
        provider: {
          id: provider,
          ...config,
        }
      })
    }

    case 'disconnect': {
      // Remove OAuth connection
      const { error: deleteError } = await supabase
        .from('oauth_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', provider)

      if (deleteError) {
        console.error('Error deleting OAuth connection:', deleteError)
        return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Disconnected successfully' })
    }

    case 'sync': {
      // Trigger a sync for the connected provider
      const { data: connection } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .single()

      if (!connection || connection.status !== 'connected') {
        return NextResponse.json({ error: 'Provider not connected' }, { status: 400 })
      }

      // Update last_sync_at
      await supabase
        .from('oauth_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', connection.id)

      return NextResponse.json({ success: true, message: 'Sync triggered' })
    }

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
}

function generateStateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => chars[byte % chars.length]).join('')
}

function generateOAuthUrl(provider: string, state: string): string {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'https://secretaryos.app'}/oauth/callback`
  
  switch (provider) {
    case 'google_calendar':
    case 'google_places':
      return `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(provider === 'google_calendar' 
          ? 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events'
          : 'https://www.googleapis.com/auth/places')}&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${state}`
    
    case 'notion':
      return `https://api.notion.com/v1/oauth/authorize?` +
        `client_id=${process.env.NOTION_CLIENT_ID}&` +
        `response_type=code&` +
        `owner=user&` +
        `state=${state}`
    
    case 'slack':
      return `https://slack.com/oauth/v2/authorize?` +
        `client_id=${process.env.SLACK_CLIENT_ID}&` +
        `scope=chat:write,channels:read,channels:history&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `state=${state}`
    
    case 'outlook':
      return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${process.env.MICROSOFT_CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=Calendars.ReadWrite Mail.Read&` +
        `state=${state}`
    
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
