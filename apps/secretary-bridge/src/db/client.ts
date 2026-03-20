import { createClient, SupabaseClient } from '@supabase/supabase-js'
import pino from 'pino'

const logger = pino({ name: 'db' })

let supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!supabase) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error('Missing Supabase configuration')
    }

    supabase = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })

    logger.info({ url: url.replace(/\/\/.*@/, '//***@') }, 'Supabase client initialized')
  }

  return supabase
}

export async function healthCheck(): Promise<boolean> {
  try {
    const client = getSupabase()
    const { error } = await client.from('profiles').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

export function getActiveConnections(): number {
  return 0
}
