'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { 
  Smartphone,
  CheckCircle,
  Loader2,
  QrCode,
  RefreshCw,
  MessageCircle,
  Monitor,
  Copy,
  Check
} from 'lucide-react'

type InstallStatus = 'loading' | 'no_auth' | 'ready' | 'connecting_whatsapp' | 'generating_qr' | 'qr_ready' | 'error'

export default function InstallPage() {
  const [status, setStatus] = useState<InstallStatus>('loading')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [setupCode, setSetupCode] = useState<string>('')
  const [sessionId, setSessionId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showMobileSetup, setShowMobileSetup] = useState(false)

  useEffect(() => {
    const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setIsMobile(mobile)
    
    if (mobile) {
      window.location.href = '/mobile'
      return
    }
    
    checkAuth()
    return () => {
      if (pollingInterval) clearInterval(pollingInterval)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/status')
      if (!res.ok) {
        window.location.href = '/login?redirect=/install'
        return
      }
      setStatus('ready')
    } catch {
      window.location.href = '/login?redirect=/install'
    }
  }

  const startInstall = async () => {
    setStatus('connecting_whatsapp')
    setError(null)
    
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      })
      
      const data = await res.json()
      
      if (res.status === 503) {
        throw new Error(data.message || 'WhatsApp connection failed. Please try again in a few minutes.')
      }
      
      if (!data.success && !data.qrCode && !data.qrDataUrl) {
        throw new Error(data.error || 'Failed to start WhatsApp connection')
      }

      setSessionId(data.sessionId)
      
      if (data.qrCode) {
        const qr = await QRCode.toDataURL(data.qrCode, {
          margin: 2,
          width: 300,
          color: { dark: '#000000', light: '#FFFFFF' }
        })
        setQrDataUrl(qr)
      } else if (data.qrDataUrl) {
        setQrDataUrl(data.qrDataUrl)
      }
      
      setStatus('connecting_whatsapp')
      startPolling(data.sessionId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect WhatsApp')
      setStatus('error')
    }
  }

  const startPolling = (sid: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'status' })
        })
        const data = await res.json()
        
      if (data.connected) {
        clearInterval(interval)
        setPollingInterval(null)
        await completeInstall(sid)
      }
      } catch {
        // Continue polling
      }
    }, 3000)
    setPollingInterval(interval)
  }

  const completeInstall = async (sid: string) => {
    setStatus('generating_qr')
    
    try {
      // First complete the WhatsApp connection to get encrypted session
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', sessionId: sid })
      })
      
      // Then get the session
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getSession' })
      })
      
      const data = await res.json()
      
      if (!data.success || !data.encryptedSession) {
        throw new Error('Failed to get WhatsApp session')
      }

      const bridgeRes = await fetch('/api/bridge/config')
      const bridgeData = await bridgeRes.json()

      const setupData = {
        userId: data.sessionId || 'user',
        bridgeUrl: bridgeData.url || 'https://bridge.secretaryos.app',
        bridgeToken: `token-${Date.now()}`,
        encryptedSession: data.encryptedSession,
        phoneNumber: data.phoneNumber
      }

      const code = btoa(JSON.stringify(setupData))
      setSetupCode(code)

      const qr = await QRCode.toDataURL(code, {
        margin: 2,
        width: 300,
        color: { dark: '#000000', light: '#FFFFFF' }
      })
      setQrDataUrl(qr)
      
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
      
      setStatus('qr_ready')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate setup QR')
      setStatus('error')
    }
  }

  const regenerateQR = () => {
    setStatus('ready')
    setQrDataUrl(null)
    setSetupCode('')
    setSessionId('')
    setError(null)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="max-w-lg mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-10 h-10 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Install Secretary
          </h1>
          <p className="text-slate-600">
            One QR code to set up everything
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          {status === 'ready' && (
            <div className="text-center">
              <div className="w-64 h-64 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-24 h-24 text-slate-300" />
              </div>
              <button
                onClick={startInstall}
                className="w-full py-4 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Generate Setup QR
              </button>
            </div>
          )}

          {status === 'connecting_whatsapp' && (
            <div className="text-center">
              <div className="w-64 h-64 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="WhatsApp QR" className="w-48 h-48" />
                ) : (
                  <Loader2 className="w-16 h-16 animate-spin text-slate-400" />
                )}
              </div>
              <div className="flex items-center gap-2 justify-center mb-4">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-medium">WhatsApp QR</span>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Scan this QR with WhatsApp to link your account
              </p>
              <div className="flex items-center gap-2 justify-center text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for scan...
              </div>
            </div>
          )}

          {status === 'generating_qr' && (
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-brand-500 mx-auto mb-4" />
              <p className="text-slate-600">Generating your setup QR...</p>
            </div>
          )}

          {status === 'qr_ready' && (
            <div className="text-center">
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <img 
                  src={qrDataUrl!}
                  alt="Setup QR"
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <div className="flex items-center gap-2 justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-medium">¡Listo! Código QR generado</span>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-left">
                <h4 className="font-medium text-blue-800 mb-2">📱 Desde tu teléfono:</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Abre SecretaryOS en tu teléfono</li>
                  <li>2. Toca "Escanear QR"</li>
                  <li>3. Escanea este código</li>
                </ol>
              </div>
              
              <div className="bg-slate-100 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">O copia el código:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(setupCode)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="text-xs text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <code className="text-xs text-slate-600 break-all line-clamp-2">
                  {setupCode.substring(0, 80)}...
                </code>
              </div>
              
              <button
                onClick={regenerateQR}
                className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Empezar de nuevo
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <MessageCircle className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              {error?.includes('WhatsApp connection failed') ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    This may be due to regional restrictions. Try again in a few minutes.
                  </p>
                  <button
                    onClick={regenerateQR}
                    className="py-3 px-6 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <button
                  onClick={regenerateQR}
                  className="py-3 px-6 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <h3 className="font-semibold text-slate-900 mb-4">
            How it works
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-6 h-6 text-brand-600" />
              </div>
              <p className="text-sm text-slate-600">Link WhatsApp</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Smartphone className="w-6 h-6 text-brand-600" />
              </div>
              <p className="text-sm text-slate-600">Scan Setup QR</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-brand-600" />
              </div>
              <p className="text-sm text-slate-600">Done!</p>
            </div>
          </div>
        </motion.div>

        <p className="text-xs text-slate-500 text-center mt-8">
          Your data stays on your phone. The bridge only relays messages.
        </p>
      </main>
    </div>
  )
}
