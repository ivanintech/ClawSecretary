'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  Smartphone,
  Shield,
  Loader2,
  AlertCircle,
  Download
} from 'lucide-react'

interface SetupCodeResponse {
  setupCode?: string
  gatewayUrl?: string
  error?: string
}

export default function InstallPage() {
  const router = useRouter()
  const [setupCode, setSetupCode] = useState('')
  const [gatewayUrl, setGatewayUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    createSetupCode()
  }, [])

  const createSetupCode = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/install/token', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceType: 'mobile' })
      })
      const data: SetupCodeResponse = await res.json()
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login?redirect=/install')
          return
        }
        throw new Error(data.error || 'Failed to create setup code')
      }
      
      setSetupCode(data.setupCode || '')
      setGatewayUrl(data.gatewayUrl || '')
      setTimeLeft(900)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create installation code')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!setupCode) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          createSetupCode()
          return 900
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [setupCode])

  const copySetupCode = () => {
    navigator.clipboard.writeText(setupCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Instalar Secretary en tu móvil
          </h1>
          <p className="text-slate-600">
            Escanea este código QR con la app de OpenClaw
          </p>
        </motion.div>

        {/* QR Code Card - Shows SETUP CODE directly */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center mb-6">
            {loading ? (
              <Loader2 className="w-16 h-16 text-slate-400 animate-spin" />
            ) : error ? (
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : setupCode ? (
              <QRCodeSVG 
                value={setupCode}
                size={256}
                level="M"
                includeMargin
                className="rounded-lg"
              />
            ) : (
              <Loader2 className="w-16 h-16 text-slate-400 animate-spin" />
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${timeLeft < 60 ? 'bg-red-500 animate-pulse' : 'bg-brand-500'}`} />
            <span className={`text-sm font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-slate-600'}`}>
              Expira en {formatTime(timeLeft)}
            </span>
          </div>

          {/* Instructions */}
          <div className="bg-brand-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-brand-800 mb-2 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Cómo instalar:
            </h3>
            <ol className="text-sm text-brand-700 space-y-1 ml-4">
              <li>1. Descarga OpenClaw en tu móvil</li>
              <li>2. Abre la app y pulsa "Escanear QR"</li>
              <li>3. Escanea este código</li>
              <li>4. ¡Listo! Secretary se configura automáticamente</li>
            </ol>
          </div>

          {/* Refresh Button */}
          <button
            onClick={createSetupCode}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Generar nuevo código</span>
          </button>
        </motion.div>

        {/* Gateway Info */}
        {gatewayUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <h3 className="font-semibold text-slate-900 mb-2">
              Conectando a:
            </h3>
            <p className="text-sm text-slate-600 font-mono bg-slate-50 px-3 py-2 rounded">
              {gatewayUrl}
            </p>
          </motion.div>
        )}

        {/* Manual Copy */}
        {setupCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="font-semibold text-slate-900 mb-3">
              ¿No puedes escanear?
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Copia este código y pégalo en la app:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={setupCode}
                readOnly
                className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-200 font-mono"
              />
              <button
                onClick={copySetupCode}
                className="px-4 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500">
          <Shield className="w-4 h-4" />
          <span>Conexión directa al gateway - sin pasar por servidores</span>
        </div>
      </main>
    </div>
  )
}
