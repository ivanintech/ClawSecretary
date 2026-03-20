'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  MessageCircle, 
  Smartphone, 
  Bell, 
  Calendar,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react'

type Step = 'welcome' | 'whatsapp' | 'permissions' | 'complete'

const steps = [
  { id: 'welcome', icon: MessageCircle, title: 'Bienvenido' },
  { id: 'whatsapp', icon: Smartphone, title: 'WhatsApp' },
  { id: 'permissions', icon: Bell, title: 'Notificaciones' },
  { id: 'complete', icon: Calendar, title: '¡Listo!' }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [loading, setLoading] = useState(false)
  const [whatsappConnected, setWhatsappConnected] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id as Step)
    }
  }

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id as Step)
    }
  }

  const handleWhatsAppConnect = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      })
      
      if (res.ok) {
        setWhatsappConnected(true)
        setTimeout(nextStep, 1500)
      }
    } catch {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotificationsEnabled(true)
        setTimeout(nextStep, 1000)
      }
    }
  }

  const handleComplete = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      {/* Progress Bar */}
      <div className="h-1 bg-slate-200">
        <motion.div
          className="h-full bg-brand-500"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <button 
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-50"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-sm text-slate-500">
          Paso {currentStepIndex + 1} de {steps.length}
        </div>
        <div className="w-10" />
      </header>

      {/* Step Indicators */}
      <div className="flex justify-center gap-2 py-4">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= currentStepIndex ? 'bg-brand-500' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {currentStep === 'welcome' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-brand-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                ¡Bienvenido a SecretaryOS!
              </h1>
              <p className="text-slate-600 mb-8">
                Tu asistente personal de IA está listo para ayudarte.
                configuremos todo en unos minutos.
              </p>
              <button
                onClick={nextStep}
                className="w-full py-4 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition flex items-center justify-center gap-2"
              >
                Comenzar
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {currentStep === 'whatsapp' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Conecta tu WhatsApp
              </h1>
              <p className="text-slate-600 mb-8">
                Vincula tu WhatsApp para que Secretary pueda 
                recibir y enviar mensajes.
              </p>
              
              {whatsappConnected ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">¡Conectado!</span>
                </div>
              ) : (
                <button
                  onClick={handleWhatsAppConnect}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5" />
                      Conectar WhatsApp
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={nextStep}
                className="mt-4 text-slate-500 hover:text-slate-700 text-sm"
              >
                Omitir por ahora
              </button>
            </motion.div>
          )}

          {currentStep === 'permissions' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Activa las notificaciones
              </h1>
              <p className="text-slate-600 mb-8">
                Recibe briefings matutinos y recordatorios 
                para no perderte nada importante.
              </p>
              
              {notificationsEnabled ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">¡Activadas!</span>
                </div>
              ) : (
                <button
                  onClick={handleEnableNotifications}
                  className="w-full py-4 px-6 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition flex items-center justify-center gap-2"
                >
                  <Bell className="w-5 h-5" />
                  Activar notificaciones
                </button>
              )}
              
              <button
                onClick={nextStep}
                className="mt-4 text-slate-500 hover:text-slate-700 text-sm"
              >
                Omitir por ahora
              </button>
            </motion.div>
          )}

          {currentStep === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                ¡Todo listo!
              </h1>
              <p className="text-slate-600 mb-8">
                SecretaryOS está configurado y funcionando.
                Recibirás tu primer briefing mañana a las 8:00 AM.
              </p>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-medium text-slate-900 mb-2">Lo que puedes hacer ahora:</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Chatea con Secretary por WhatsApp
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Configura tu briefing matutino
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Añade recordatorios y contactos
                  </li>
                </ul>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 px-6 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition flex items-center justify-center gap-2"
              >
                Ir al dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
