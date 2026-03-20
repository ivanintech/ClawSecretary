'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Clock, Users, Zap, Share2 } from 'lucide-react'
import { BetaSignupForm } from '@/components/BetaSignupForm'

export default function WaitlistPage() {
  const [position, setPosition] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/beta')
      if (res.ok) {
        const data = await res.json()
        if (data.registered && data.position) {
          setPosition(data.position)
        }
      }
    } catch {
      // Not registered
    } finally {
      setChecked(true)
    }
  }

  const handleSuccess = (pos: number) => {
    setPosition(pos)
  }

  const shareWaitlist = () => {
    const text = encodeURIComponent('¡Me acabo de unir a SecretaryOS! Tu asistente personal de IA por WhatsApp. Únete a la lista:')
    const url = encodeURIComponent(window.location.origin)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
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

      <main className="max-w-lg mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Lista de Espera
          </h1>
          <p className="text-slate-600">
            ¡Gracias por tu interés en SecretaryOS!
          </p>
        </motion.div>

        {!checked ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-slate-400">Verificando...</div>
          </div>
        ) : position ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center mb-6"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              ¡Ya estás registrado!
            </h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-brand-600">#{position}</span>
              <p className="text-slate-500 text-sm mt-1">Tu posición en la lista</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-600">
                Te avisaremos por email cuando sea tu turno. 
                Mientras tanto, comparte con tus amigos y sube posiciones!
              </p>
            </div>
            <button
              onClick={shareWaitlist}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
            >
              <Share2 className="w-5 h-5" />
              Compartir en Twitter
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4 text-center">
              Únete a la lista de espera
            </h2>
            <BetaSignupForm onSuccess={handleSuccess} />
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          <div className="bg-white rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-brand-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">1,000+</div>
            <div className="text-xs text-slate-500">Registrados</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-brand-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">~2 sem</div>
            <div className="text-xs text-slate-500">Tiempo espera</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <Zap className="w-6 h-6 text-brand-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">Beta</div>
            <div className="text-xs text-slate-500">Early access</div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h3 className="font-semibold text-slate-900 mb-4">
            ¿Qué incluye el acceso beta?
          </h3>
          <ul className="space-y-3">
            {[
              'Precios especiales de lanzamiento',
              'Acceso prioritario a nuevas funciones',
              'Soporte directo del equipo',
              'Influir en el desarrollo del producto'
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-600">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* FAQ */}
        <div className="mt-12 space-y-4">
          <h3 className="font-semibold text-slate-900">
            Preguntas frecuentes
          </h3>
          
          <details className="bg-white rounded-xl p-4 group">
            <summary className="font-medium text-slate-900 cursor-pointer">
              ¿Cuándo empezaré a usarlo?
            </summary>
            <p className="text-slate-600 mt-2 text-sm">
              Invitamos usuarios en lotes. Si te registras ahora, 
              podrías tener acceso en 2-4 semanas.
            </p>
          </details>

          <details className="bg-white rounded-xl p-4 group">
            <summary className="font-medium text-slate-900 cursor-pointer">
              ¿Cuánto costará?
            </summary>
            <p className="text-slate-600 mt-2 text-sm">
              Los precios aún no están definidos, pero habrá un plan gratuito 
              y planes de pago desde €4.99/mes.
            </p>
          </details>

          <details className="bg-white rounded-xl p-4 group">
            <summary className="font-medium text-slate-900 cursor-pointer">
              ¿Puedo cancelar?
            </summary>
            <p className="text-slate-600 mt-2 text-sm">
              Sí, puedes cancelar en cualquier momento. 
              No hay compromiso de permanencia.
            </p>
          </details>
        </div>
      </main>
    </div>
  )
}
