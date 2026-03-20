'use client'

import { motion } from 'framer-motion'
import { 
  Sun,
  Coffee,
  Calendar,
  Mail,
  Zap,
  Moon,
  CheckCircle2,
  Clock,
  Bell,
  Brain,
  TrendingUp,
  Sparkles
} from 'lucide-react'

const timeline = [
  {
    time: '07:50',
    icon: Sun,
    title: 'Morning Briefing',
    description: 'Secretary genera tu resumen del día automáticamente',
    details: ['📅 3 reuniones coordinadas', '📧 2 emails action required', '💡 AI insights'],
    proactive: true,
    color: 'bg-amber-500'
  },
  {
    time: '09:00',
    icon: Calendar,
    title: 'Conflict Detection',
    description: 'Secretary detecta y resuelve conflictos de agenda',
    details: ['⚠️ Overlap detectado', '💡 Auto-sugerencia aplicada', '✅ Resuelto sin interrupciones'],
    proactive: true,
    color: 'bg-blue-500'
  },
  {
    time: '10:30',
    icon: Mail,
    title: 'Email Triage',
    description: 'Secretary prioriza y alerta sobre emails críticos',
    details: ['🚨 2 críticos detectados', '📊 47 → 2 actionables', '⏰ Deadline alerts'],
    proactive: true,
    color: 'bg-purple-500'
  },
  {
    time: '11:00',
    icon: Zap,
    title: 'Mode Auto-Switch',
    description: 'Secretary ajusta tu ambiente según la reunión',
    details: ['💡 Luces: presentación', '🎵 Música: pausa activa', '📱 Notificaciones: allowed'],
    proactive: true,
    color: 'bg-green-500'
  },
  {
    time: '14:00',
    icon: Coffee,
    title: 'Meeting Closure',
    description: 'Secretary documenta y sincroniza automáticamente',
    details: ['📝 Acta → Notion + VectorDB', '🧠 Memorias actualizadas', '✅ Ghost write completo'],
    proactive: true,
    color: 'bg-indigo-500'
  },
  {
    time: '21:00',
    icon: Moon,
    title: 'Evening Summary',
    description: 'Secretary te resume el día y prepara mañana',
    details: ['📊 Stats del día', '⏰ Tareas pendientes', '📅 Previsión mañana'],
    proactive: true,
    color: 'bg-slate-600'
  }
]

const stats = [
  { value: '2.9h', label: 'Ahorradas por día', icon: Clock },
  { value: '47→2', label: 'Emails priorizados', icon: Mail },
  { value: '100%', label: 'Decisiones asistidas', icon: Brain },
  { value: '0', label: 'Apps a abrir', icon: Zap }
]

export function DayTimelineSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            ⚡ 100% Proactivo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Secretary trabaja mientras tú descansas
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Durante todo el día, Secretary está activo en segundo plano. 
            No tienes que pedirle nada - él lo hace por ti.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 rounded-2xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-brand-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 transform lg:-translate-x-1/2" />

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className={`relative flex items-start gap-6 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex-row`}
              >
                {/* Timeline dot */}
                <div className={`absolute left-4 lg:left-1/2 w-4 h-4 rounded-full ${item.color} transform -translate-x-1/2 lg:translate-x-0 lg:left-1/2 z-10 ring-4 ring-white`} />

                {/* Content card */}
                <div className={`flex-1 ml-12 lg:ml-0 lg:w-[calc(50%-3rem)] ${
                  index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:text-left'
                }`}>
                  <div className={`bg-white rounded-2xl shadow-lg border border-slate-100 p-6 ${
                    index % 2 === 0 ? 'lg:ml-auto' : ''
                  }`}>
                    {/* Time badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-mono font-medium ${
                        index % 2 === 0 ? 'bg-slate-100' : 'bg-brand-50 text-brand-700'
                      }`}>
                        {item.time}
                      </span>
                      {item.proactive && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Auto
                        </span>
                      )}
                    </div>

                    {/* Icon and title */}
                    <div className={`flex items-center gap-3 mb-2 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                    </div>

                    <p className="text-slate-600 text-sm mb-3">{item.description}</p>

                    {/* Details */}
                    <div className="flex flex-wrap gap-2">
                      {item.details.map((detail, i) => (
                        <span key={i} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded">
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
