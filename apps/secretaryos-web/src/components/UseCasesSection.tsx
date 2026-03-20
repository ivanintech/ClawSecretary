'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sun,
  Calendar,
  Mail,
  Bell,
  Zap,
  Coffee,
  Brain,
  MessageSquare,
  Clock,
  Heart,
  Lightbulb,
  Shield,
  CheckCircle2,
  ChevronRight,
  Play,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { WhatsAppChat } from './WhatsAppChat'

const useCases = [
  {
    id: 'morning',
    icon: Sun,
    title: '7:50 AM - Briefing Matutino',
    description: 'Secretary te despierta con todo lo que necesitas saber',
    chat: {
      messages: [
        { sender: 'secretary' as const, text: 'Buenos días Juan! 👋\n\n📅 AGENDA HOY:\n• 10:00 - Revisión Q1 con equipo\n• 14:00 - Call con investor\n• 18:00 - Cena con Ana\n\n🌤️ Madrid: ☀️ 22°C\n\n💡 AI Tips:\n• Cumpleaños de María mañana\n• Tu proyecto "TechStart" tiene docs pendientes', time: '07:50' },
        { sender: 'secretary' as const, text: 'Tengo 2 emails importantes:\n🚨 Presupuesto Q2 de cliente (deadline hoy)\n🚨 Firma requerida ASAP', buttons: [{ label: '📖 Ver' }, { label: '✅ OK' }] }
      ]
    }
  },
  {
    id: 'meeting',
    icon: Calendar,
    title: 'Coordinación de Reuniones',
    description: 'Negocia por ti con cifrado P2P',
    chat: {
      messages: [
        { sender: 'user' as const, text: 'Hey Secretary, propón a Carlos una reunión mañana', time: '10:15' },
        { sender: 'secretary' as const, text: '🔐 Enviando propuesta cifrada a Carlos...\n\n⏳ Esperando respuesta...', time: '10:15' },
        { sender: 'secretary' as const, text: '✅ Carlos aceptó: 14:00 - 15:00\n📅 Evento creado automáticamente\n\n🤝 Reunión coordinada sin emails', time: '10:17' }
      ]
    }
  },
  {
    id: 'conflict',
    icon: AlertCircle,
    title: 'Detección de Conflictos',
    description: 'Evita solapamientos antes de que ocurran',
    chat: {
      messages: [
        { sender: 'user' as const, text: 'Añade reunión con cliente a las 10:00', time: '09:30' },
        { sender: 'secretary' as const, text: '⚠️ CONFLICTO DETECTADO\n\n❌ "Reunión equipo" ocupa 09:30-10:30\n\n💡 Sugerencia: Mover a 10:30', buttons: [{ label: '✅ Sí, mover' }, { label: '❌ No' }] },
        { sender: 'secretary' as const, text: '✅ Movido a 10:30\n📧 Notificación enviada a cliente', time: '09:31' }
      ]
    }
  },
  {
    id: 'email',
    icon: Mail,
    title: 'Triage de Emails',
    description: '47 emails → 2 actionables',
    chat: {
      messages: [
        { sender: 'secretary' as const, text: '📧 EMAIL TRIAGE\n━━━━━━━━━━━━━━━━━━\n🚨 Críticos: 2\n• Juan: "URGENTE - Presupuesto Q2"\n• Cliente: "Firma requerida"\n\n⚪ FYI: 45\n\n💡 AI Advisor:\n• Presupuesto tiene deadline hoy\n• Cliente espera respuesta hace 3 días', time: '08:00', buttons: [{ label: '📖 Ver' }, { label: '✅ OK' }] }
      ]
    }
  },
  {
    id: 'focus',
    icon: Zap,
    title: 'Modo Focus',
    description: 'Activa tu entorno de concentración perfecto',
    chat: {
      messages: [
        { sender: 'user' as const, text: 'Activa modo concentración', time: '10:00' },
        { sender: 'secretary' as const, text: '🧘 Modo focus activado\n\n✅ Luces ajustadas (Philips Hue)\n   → Oficina: "Concentración" 50%\n\n✅ Música Sonos iniciada\n   → Playlist "Deep Focus"\n\n✅ Notificaciones silenciadas', time: '10:00' }
      ]
    }
  },
  {
    id: 'memory',
    icon: Brain,
    title: 'Te Conoce Mejor',
    description: 'Decisiones inteligentes basadas en conocerte',
    chat: {
      messages: [
        { sender: 'secretary' as const, text: '💡 Basado en lo que sé de ti:\n\n• Prefieres reuniones por la mañana\n• No bebes café\n•Tienes gym los Lunes y Miércoles\n\n📅 Te sugiero la reunion a las 10:00', time: '10:05', buttons: [{ label: '✅ Perfecto' }, { label: '📅 Ver opciones' }] }
      ]
    }
  }
]

function AlertCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

export function UseCasesSection() {
  const [activeCase, setActiveCase] = useState('morning')
  
  const currentCase = useCases.find(c => c.id === activeCase) || useCases[0]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-500/20 text-brand-400 rounded-full text-sm font-medium mb-4">
            💬 Todo por WhatsApp
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Un día con SecretaryOS
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Mira cómo Secretary trabaja para ti durante el día. 
            Todo llega a tu WhatsApp, sin abrir ninguna app.
          </p>
        </motion.div>

        {/* Use Case Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {useCases.map((useCase, index) => (
            <motion.button
              key={useCase.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveCase(useCase.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeCase === useCase.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <useCase.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{useCase.title.split(' - ')[0]}</span>
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Chat */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <WhatsAppChat messages={currentCase.chat.messages} className="max-w-md mx-auto lg:mx-0" />
            </motion.div>
          </AnimatePresence>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-brand-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <currentCase.icon className="w-7 h-7 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{currentCase.title}</h3>
                  <p className="text-slate-400">{currentCase.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-brand-400">
                    {activeCase === 'morning' && '~15 min'}
                    {activeCase === 'meeting' && '~10 min'}
                    {activeCase === 'conflict' && '~30 min'}
                    {activeCase === 'email' && '~28 min'}
                    {activeCase === 'focus' && '~5 min'}
                    {activeCase === 'memory' && '∞'}
                  </div>
                  <div className="text-sm text-slate-400">Ahorro de tiempo</div>
                </div>
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-400">
                    {activeCase === 'morning' && '100%'}
                    {activeCase === 'meeting' && '100%'}
                    {activeCase === 'conflict' && '100%'}
                    {activeCase === 'email' && '95%'}
                    {activeCase === 'focus' && '100%'}
                    {activeCase === 'memory' && '∞'}
                  </div>
                  <div className="text-sm text-slate-400">Automatizado</div>
                </div>
              </div>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2">
                {activeCase === 'morning' && (
                  <>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">📅 Calendario</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">🌤️ Clima</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">📧 Emails</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">💡 AI Advisor</span>
                  </>
                )}
                {activeCase === 'meeting' && (
                  <>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">🔐 RSA Encryption</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">🤝 P2P</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">📅 Auto-schedule</span>
                  </>
                )}
                {activeCase === 'conflict' && (
                  <>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">⚠️ Smart Detection</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">💡 Sugerencias</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">📧 Auto-notify</span>
                  </>
                )}
                {activeCase === 'email' && (
                  <>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">🤖 AI Triage</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">🚨 Priority</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">⏰ Deadline alerts</span>
                  </>
                )}
                {activeCase === 'focus' && (
                  <>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">💡 Philips Hue</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">🎵 Sonos</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">🔕 Notifications</span>
                  </>
                )}
                {activeCase === 'memory' && (
                  <>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">🧠 Vector Memory</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">🎯 Personalizado</span>
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">💡 Context-aware</span>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
