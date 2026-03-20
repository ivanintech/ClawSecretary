/**
 * SecretaryOS Bridge Integration Tests
 * 
 * Run with: npx tsx tests/integration.ts
 * 
 * Prerequisites:
 * 1. PostgreSQL database running
 * 2. Bridge server running (npm run dev)
 * 3. DATABASE_URL and SESSION_ENCRYPTION_KEY env vars set
 */

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://localhost:3001'

interface TestResult {
  name: string
  passed: boolean
  error?: string
  duration: number
}

const results: TestResult[] = []

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  const start = Date.now()
  try {
    await fn()
    results.push({ name, passed: true, duration: Date.now() - start })
    console.log(`  ✓ ${name}`)
  } catch (error) {
    results.push({ 
      name, 
      passed: false, 
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start 
    })
    console.log(`  ✗ ${name}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function runTests() {
  console.log('\n🧪 SecretaryOS Bridge Integration Tests')
  console.log('─'.repeat(50))
  console.log(`Bridge URL: ${BRIDGE_URL}`)
  console.log('')

  // Health Check
  console.log('Health Check:')
  await test('GET /health returns 200', async () => {
    const res = await fetch(`${BRIDGE_URL}/health`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.status !== 'ok') throw new Error(`Expected status ok, got ${data.status}`)
  })

  // Metrics
  console.log('\nMetrics:')
  await test('GET /metrics returns 200', async () => {
    const res = await fetch(`${BRIDGE_URL}/metrics`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (typeof data.activeConnections !== 'number') throw new Error('Missing activeConnections')
  })

  // WhatsApp Pre-Auth
  console.log('\nWhatsApp Pre-Auth:')
  const testUserId = `test-user-${Date.now()}`
  let sessionId = ''

  await test('POST /auth/whatsapp/start creates session', async () => {
    const res = await fetch(`${BRIDGE_URL}/auth/whatsapp/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: testUserId })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data.sessionId) throw new Error('Missing sessionId')
    sessionId = data.sessionId
    if (data.expiresIn !== 60) throw new Error(`Expected expiresIn 60, got ${data.expiresIn}`)
  })

  if (sessionId) {
    await test('GET /auth/whatsapp/status/:sessionId returns status', async () => {
      const res = await fetch(`${BRIDGE_URL}/auth/whatsapp/status/${sessionId}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!['pending', 'connected', 'expired', 'failed'].includes(data.status)) {
        throw new Error(`Invalid status: ${data.status}`)
      }
    })

    await test('DELETE /auth/whatsapp/cancel/:sessionId cancels session', async () => {
      const res = await fetch(`${BRIDGE_URL}/auth/whatsapp/cancel/${sessionId}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    })
  }

  // Error handling
  console.log('\nError Handling:')
  await test('POST /auth/whatsapp/start without userId returns 400', async () => {
    const res = await fetch(`${BRIDGE_URL}/auth/whatsapp/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`)
  })

  await test('GET /auth/whatsapp/status/invalid-session returns pending', async () => {
    const res = await fetch(`${BRIDGE_URL}/auth/whatsapp/status/invalid-session-xyz`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.status !== 'expired') throw new Error(`Expected expired, got ${data.status}`)
  })

  // Print summary
  console.log('\n' + '─'.repeat(50))
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  
  console.log(`\nResults: ${passed} passed, ${failed} failed`)
  
  if (failed > 0) {
    console.log('\nFailed tests:')
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`)
    })
    process.exit(1)
  } else {
    console.log('\n✅ All tests passed!\n')
    process.exit(0)
  }
}

// Run tests
runTests().catch((error) => {
  console.error('Test runner error:', error)
  process.exit(1)
})
