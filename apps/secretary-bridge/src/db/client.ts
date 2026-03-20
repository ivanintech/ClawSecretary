import pg from 'pg'
import { pino } from 'pino'

const { Pool } = pg

const logger = pino({ name: 'db' })

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err: Error) => {
  logger.error({ err }, 'Unexpected database pool error')
})

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const start = Date.now()
  const result = await pool.query(text, params)
  const duration = Date.now() - start
  
  logger.debug({ 
    query: text.substring(0, 100), 
    rows: result.rowCount, 
    duration 
  }, 'Query executed')
  
  return result.rows as T[]
}

export async function queryOne<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] || null
}

export async function transaction<T>(
  callback: (client: pg.PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function checkRateLimit(
  identifier: string,
  action: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000)
  
  const result = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM rate_limits 
     WHERE identifier = $1 AND action = $2 AND window_start > $3`,
    [identifier, action, windowStart]
  )
  
  const currentCount = parseInt(result?.count || '0', 10)
  
  if (currentCount >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }
  
  await query(
    `INSERT INTO rate_limits (identifier, action, count, window_start)
     VALUES ($1, $2, 1, NOW())
     ON CONFLICT (identifier, action) 
     DO UPDATE SET count = rate_limits.count + 1, window_start = NOW()`,
    [identifier, action]
  )
  
  return { allowed: true, remaining: maxRequests - currentCount - 1 }
}

export async function cleanupExpiredSessions(): Promise<number> {
  const result = await queryOne<{ count: string }>(
    'SELECT cleanup_expired_sessions() as count'
  )
  return parseInt(result?.count || '0', 10)
}

export async function healthCheck(): Promise<boolean> {
  try {
    await pool.query('SELECT 1')
    return true
  } catch {
    return false
  }
}
