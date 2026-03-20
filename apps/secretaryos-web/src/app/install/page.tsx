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
  ExternalLink,
  Shield,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function InstallPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    createInstallToken()
  }, [])

  const createInstallToken = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch('/api/install/token', { method: 'POST' })
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login?redirect=/install')
          return
        }
        throw new Error(data.error || 'Failed to create token')
      }
      
      setToken(data.token)
      setTimeLeft(900)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create installation token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          createInstallToken()
          return 900
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [token])

  const installUrl = `/install/setup/${token}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const refreshToken = () => {
    setLoading(true)
    const newToken = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15)
    setToken(newToken)
    setTimeLeft(900)
    setLoading(false)
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
            Instalar en tu móvil
          </h1>
          <p className="text-slate-600">
            Escanea el código QR con la cámara de tu teléfono
          </p>
        </motion.div>

        {/* QR Code Card */}
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
            ) : token ? (
              <QRCodeSVG 
                value={installUrl}
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

          {/* Refresh Button */}
          <button
            onClick={refreshToken}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Generar nuevo código</span>
          </button>
        </motion.div>

        {/* Alternative: Copy Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h3 className="font-semibold text-slate-900 mb-3">
            ¿No funciona el QR?
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={installUrl}
              readOnly
              className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-600 border border-slate-200"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-50 rounded-2xl p-6"
        >
          <h3 className="font-semibold text-slate-900 mb-4">
            Pasos de instalación:
          </h3>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <span className="text-slate-700">
                Abre el enlace en tu móvil
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <span className="text-slate-700">
                Descarga OpenClaw (si no lo tienes)
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <span className="text-slate-700">
                Secretary se configura automáticamente
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </span>
              <span className="text-slate-700">
                ¡Listo! Recibirás tu primer briefing
              </span>
            </li>
          </ol>
        </motion.div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500">
          <Shield className="w-4 h-4" />
          <span>Conexión segura y cifrada</span>
        </div>
      </main>
    </div>
  )
}
