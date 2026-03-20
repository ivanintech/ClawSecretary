'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  MessageCircle,
  Shield,
  Zap,
  Calendar,
  Clock
} from 'lucide-react'

export default function InstallPage() {
  const [checking, setChecking] = useState(true)
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setChecking(true)
    try {
      const res = await fetch('/api/auth/status')
      if (res.ok) {
        const data = await res.json()
        setUserLoggedIn(data.authenticated)
      }
    } catch {
      setUserLoggedIn(false)
    } finally {
      setChecking(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    )
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
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Secretary funciona por WhatsApp
          </h1>
          <p className="text-slate-600">
            Zero apps, zero configuración. Solo tu WhatsApp.
          </p>
        </motion.div>

        {/* Installation Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <h2 className="font-semibold text-slate-900 mb-6">
            Cómo empezar en 30 segundos:
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-600 font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">
                  {userLoggedIn ? 'Conecta tu WhatsApp' : 'Regístrate gratis'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {userLoggedIn 
                    ? 'Vincula tu WhatsApp escaneando un código QR'
                    : 'Crea tu cuenta en 10 segundos'
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-600 font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Secretary se activa</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Recibe briefings diarios y responde a tus mensajes 24/7
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-600 font-semibold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900">¡Listo!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Chatea con Secretary como si fuera un contacto normal
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={userLoggedIn ? '/whatsapp/install' : '/register'}
              className="block w-full py-4 px-6 bg-green-600 text-white text-center font-semibold rounded-xl hover:bg-green-700 transition"
            >
              {userLoggedIn ? 'Conectar WhatsApp →' : 'Crear cuenta gratis →'}
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <h3 className="font-semibold text-slate-900 mb-4">
            Qué puede hacer Secretary:
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Calendar className="w-5 h-5 text-brand-500" />
              Coordinar reuniones
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Clock className="w-5 h-5 text-brand-500" />
              Recordatorios automáticos
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <MessageCircle className="w-5 h-5 text-brand-500" />
              Responder mensajes
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Zap className="w-5 h-5 text-brand-500" />
              Briefings diarios
            </div>
          </div>
        </motion.div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500">
          <Shield className="w-4 h-4" />
          <span>Tu WhatsApp permanece seguro en tu teléfono</span>
        </div>
      </main>
    </div>
  )
}
