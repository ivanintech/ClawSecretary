'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { 
  Smartphone,
  CheckCircle,
  Loader2,
  Download,
  Copy,
  QrCode,
  Terminal
} from 'lucide-react'

export default function InstallPage() {
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [setupCode, setSetupCode] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/status')
      if (!res.ok) {
        window.location.href = '/login?redirect=/install'
        return
      }
    } catch {
      window.location.href = '/login?redirect=/install'
    } finally {
      setLoading(false)
    }
  }

  const generateSetup = async () => {
    setGenerating(true)
    setError(null)
    
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getSession' })
      })
      
      if (!res.ok) {
        throw new Error('Failed to get session')
      }

      const data = await res.json()
      
      if (!data.success || !data.encryptedSession) {
        throw new Error('WhatsApp not connected. Please connect WhatsApp first.')
      }

      const profileRes = await fetch('/api/profile/gateway')
      const profileData = await profileRes.json()

      const bridgeRes = await fetch('/api/bridge/config')
      const bridgeData = await bridgeRes.json()

      const setupData = {
        userId: data.sessionId?.split('-')[0] || 'unknown',
        bridgeUrl: bridgeData.url || 'https://your-bridge.com',
        bridgeToken: 'auto-generated-token',
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate setup code')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(setupCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
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
            One-Click Installation
          </h1>
          <p className="text-slate-600">
            Scan the QR code with your phone to install Secretary
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          {!qrDataUrl ? (
            <div className="text-center">
              <div className="w-64 h-64 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-24 h-24 text-slate-300" />
              </div>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <button
                onClick={generateSetup}
                disabled={generating}
                className="w-full py-4 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <QrCode className="w-5 h-5" />
                )}
                Generate Setup QR
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <img 
                  src={qrDataUrl}
                  alt="Setup QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>
              
              <div className="flex items-center gap-2 justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700 font-medium">QR Code Ready</span>
              </div>
              
              <p className="text-sm text-slate-600 mb-6">
                Scan this QR code with Secretary app or Termux on your phone
              </p>
              
              <button
                onClick={generateSetup}
                className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition"
              >
                Generate New QR
              </button>
            </div>
          )}
        </motion.div>

        {setupCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Manual Installation
            </h3>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={setupCode.substring(0, 50) + '...'}
                readOnly
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-mono"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>
            
            <div className="text-sm text-slate-600 space-y-2">
              <p className="font-medium">For Termux:</p>
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
{`# Install Termux from F-Droid
# Then run:
pkg update && pkg install nodejs
npm i -g secretary-mobile
secretary-mobile --setup ${setupCode.substring(0, 20)}...`}
              </pre>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <h3 className="font-semibold text-slate-900 mb-4">
            How it works
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-brand-600 font-bold">1</span>
              </div>
              <p className="text-sm text-slate-600">Scan QR</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-brand-600 font-bold">2</span>
              </div>
              <p className="text-sm text-slate-600">App installs</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <span className="text-brand-600 font-bold">3</span>
              </div>
              <p className="text-sm text-slate-600">Ready!</p>
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
