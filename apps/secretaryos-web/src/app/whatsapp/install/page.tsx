'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  MessageCircle,
  Smartphone
} from 'lucide-react'

type WhatsAppStatus = 'idle' | 'loading' | 'pending' | 'connected' | 'error'

interface WhatsAppState {
  status: WhatsAppStatus
  qrDataUrl?: string
  message?: string
  error?: string
}

export default function WhatsAppInstallPage() {
  const [state, setState] = useState<WhatsAppState>({ status: 'idle' })
  const [phoneNumber, setPhoneNumber] = useState('')

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status' })
      })
      const data = await res.json()
      
      if (data.connected) {
        setState({ status: 'connected', message: 'WhatsApp conectado' })
      } else {
        setState({ status: 'idle', message: 'No vinculado' })
      }
    } catch {
      setState({ status: 'error', error: 'Error al verificar estado' })
    }
  }, [])

  const startLogin = async () => {
    setState({ status: 'loading' })
    
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      })
      const data = await res.json()
      
      if (data.qrDataUrl) {
        setState({ 
          status: 'pending', 
          qrDataUrl: data.qrDataUrl,
          message: 'Escanea el código QR con WhatsApp'
        })
      } else {
        setState({ 
          status: 'pending',
          message: data.message || 'Esperando código QR...'
        })
      }
    } catch (err) {
      setState({ 
        status: 'error', 
        error: err instanceof Error ? err.message : 'Error desconocido' 
      })
    }
  }

  const logout = async () => {
    setState({ status: 'loading' })
    
    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      })
      setState({ status: 'idle', message: 'Desconectado' })
    } catch {
      setState({ status: 'error', error: 'Error al desconectar' })
    }
  }

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  // Poll for updates when pending
  useEffect(() => {
    if (state.status !== 'pending') return
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'status' })
        })
        const data = await res.json()
        
        if (data.connected) {
          setState({ status: 'connected', message: 'WhatsApp conectado' })
          clearInterval(interval)
        }
      } catch {
        // Ignore polling errors
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [state.status])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al dashboard</span>
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Conectar WhatsApp
          </h1>
          <p className="text-slate-600">
            Vincula tu WhatsApp para chatear con Secretary
          </p>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          {/* Current Status */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-slate-700 font-medium">Estado:</span>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              state.status === 'connected' 
                ? 'bg-green-100 text-green-700'
                : state.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : state.status === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-700'
            }`}>
              {state.status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : state.status === 'connected' ? (
                <CheckCircle className="w-4 h-4" />
              ) : state.status === 'error' ? (
                <XCircle className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {state.status === 'idle' && 'No conectado'}
                {state.status === 'loading' && 'Cargando...'}
                {state.status === 'pending' && 'Esperando escaneo'}
                {state.status === 'connected' && 'Conectado'}
                {state.status === 'error' && 'Error'}
              </span>
            </div>
          </div>

          {/* QR Code Area */}
          {state.status === 'pending' && state.qrDataUrl && (
            <div className="mb-6">
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-center">
                <img 
                  src={state.qrDataUrl} 
                  alt="WhatsApp QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-slate-600 text-center mt-4">
                Abre WhatsApp → Ajustes → Dispositivos vinculados → Vincular dispositivo
              </p>
            </div>
          )}

          {/* Message */}
          {state.message && (
            <div className={`p-4 rounded-xl mb-6 ${
              state.status === 'error' 
                ? 'bg-red-50 text-red-700'
                : state.status === 'connected'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-blue-50 text-blue-700'
            }`}>
              <p className="text-sm">{state.message}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {state.status === 'idle' && (
              <button
                onClick={startLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Generar código QR</span>
              </button>
            )}

            {state.status === 'pending' && (
              <button
                onClick={startLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Generar nuevo código</span>
              </button>
            )}

            {state.status === 'connected' && (
              <>
                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">¡WhatsApp conectado!</p>
                    <p className="text-sm text-green-700">
                      Secretary está listo para recibir mensajes
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition"
                >
                  <span>Desconectar WhatsApp</span>
                </button>
              </>
            )}

            {state.status === 'error' && (
              <button
                onClick={startLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Reintentar</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-50 rounded-2xl p-6"
        >
          <h3 className="font-semibold text-slate-900 mb-4">
            ¿Cómo funciona?
          </h3>
          <ol className="space-y-3 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                1
              </span>
              <span>Genera el código QR con el botón de arriba</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                2
              </span>
              <span>Abre WhatsApp en tu teléfono</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                3
              </span>
              <span>Ve a Ajustes → Dispositivos vinculados</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                4
              </span>
              <span>Escanea el código QR</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                5
              </span>
              <span>¡Listo! Ya puedes chatear con Secretary</span>
            </li>
          </ol>
        </motion.div>

        {/* Note */}
        <p className="text-xs text-slate-500 text-center mt-6">
          Tu WhatsApp permanece vinculado a tu teléfono. Solo permite que Secretary lea y responda mensajes.
        </p>
      </main>
    </div>
  )
}
