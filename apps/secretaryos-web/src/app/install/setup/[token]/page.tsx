'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { 
  Smartphone,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
  ExternalLink,
  Shield,
  Wifi
} from 'lucide-react'

interface ValidationResult {
  success: boolean
  pairingUrl?: string
  gatewayUrl?: string
  error?: string
  setupRequired?: boolean
}

export default function InstallSetupPage() {
  const params = useParams()
  const token = params.token as string
  
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutes

  useEffect(() => {
    validateToken()
  }, [token])

  useEffect(() => {
    if (!validation?.success) return
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          validateToken() // Re-validate when expired
          return 900
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [validation])

  const validateToken = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/install/validate?token=${token}`)
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Invalid token')
        setValidation({ success: false, error: data.error })
      } else {
        setValidation(data)
        setTimeLeft(900)
      }
    } catch (err) {
      setError('Failed to validate token')
      setValidation({ success: false, error: 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Validating installation token...</p>
        </div>
      </div>
    )
  }

  if (error || !validation?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {error === 'Token expired' || error === 'Token already used' 
              ? 'Link Expired' 
              : 'Installation Failed'}
          </h1>
          <p className="text-slate-600 mb-6">
            {error || 'An error occurred during installation.'}
          </p>
          
          {validation?.setupRequired && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm">
                <strong>Gateway not configured.</strong> Please set up your OpenClaw gateway first.
              </p>
            </div>
          )}
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-3 px-4 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">SecretaryOS</h1>
              <p className="text-sm text-slate-500">Mobile Installation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        {/* Success State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Ready to Install
          </h2>
          <p className="text-slate-600">
            Scan the QR code with your OpenClaw app
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
            {validation.pairingUrl && (
              <QRCodeSVG 
                value={validation.pairingUrl}
                size={256}
                level="M"
                includeMargin
                className="rounded-lg"
              />
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${timeLeft < 60 ? 'bg-red-500 animate-pulse' : 'bg-brand-500'}`} />
            <span className={`text-sm font-medium ${timeLeft < 60 ? 'text-red-600' : 'text-slate-600'}`}>
              Expires in {formatTime(timeLeft)}
            </span>
          </div>

          {/* Gateway Info */}
          {validation.gatewayUrl && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Wifi className="w-4 h-4" />
                <span>Gateway: {validation.gatewayUrl}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-50 rounded-2xl p-6"
        >
          <h3 className="font-semibold text-slate-900 mb-4">
            Installation Steps:
          </h3>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <span className="text-slate-700">
                Open the OpenClaw app on your phone
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <span className="text-slate-700">
                Tap "Scan QR Code" and scan the code above
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <span className="text-slate-700">
                Wait for automatic configuration
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </span>
              <span className="text-slate-700">
                Start using SecretaryOS!
              </span>
            </li>
          </ol>
        </motion.div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500">
          <Shield className="w-4 h-4" />
          <span>Secure end-to-end encrypted connection</span>
        </div>
      </main>
    </div>
  )
}
