'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react'

export default function OAuthCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Connecting to service...')

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const provider = searchParams.get('provider')

    if (error) {
      setStatus('error')
      setMessage(`Connection failed: ${error}`)
      return
    }

    if (!code || !state) {
      setStatus('error')
      setMessage('Missing authorization code')
      return
    }

    try {
      // Send the code to our server to complete the OAuth flow
      const response = await fetch('/api/oauth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state, provider }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        setMessage(data.message || 'Successfully connected!')
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/dashboard/settings?connected=' + (provider || 'unknown'))
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to complete connection')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error during connection')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Connecting...
            </h1>
            <p className="text-slate-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Connected!
            </h1>
            <p className="text-slate-600 mb-6">{message}</p>
            <p className="text-sm text-slate-500">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Connection Failed
            </h1>
            <p className="text-slate-600 mb-6">{message}</p>
            <button
              onClick={() => router.push('/dashboard/settings')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Back to Settings
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}
