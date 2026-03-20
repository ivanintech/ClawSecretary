'use client'

import { motion } from 'framer-motion'
import { 
  X,
  Check,
  Clock,
  MessageSquare,
  Calendar,
  Mail,
  Brain,
  Zap,
  Smartphone,
  Shield,
  Heart,
  TrendingUp
} from 'lucide-react'

const comparisons = [
  {
    task: 'Morning briefing',
    without: {
      time: '15-20 min',
      actions: ['Abrir calendario', 'Revisar emails', 'Buscar noticias', 'Resumen mental']
    },
    with: {
      time: '0 seg',
      actions: ['Recibes WhatsApp', 'Listo']
    }
  },
  {
    task: 'Coordinar reunión',
    without: {
      time: '10-15 min',
      actions: ['Email来回', 'Buscar slot', 'Crear evento', 'Enviar invite']
    },
    with: {
      time: '5 seg',
      actions: ['"Hey Secretary..."', 'Auto-coordinado P2P']
    }
  },
  {
    task: 'Triage emails',
    without: {
      time: '30-45 min',
      actions: ['Leer 47 emails', 'Decidir importancia', '¿Cuál es urgente?']
    },
    with: {
      time: '2 min',
      actions: ['Ver 2 actionables', 'El resto, Secretary']
    }
  },
  {
    task: 'Ghost write',
    without: {
      time: '45-60 min',
      actions: ['Escribir acta', 'Enviar por email', 'Copiar a Notion', '¿Quién tomó notas?']
    },
    with: {
      time: '3 seg',
      actions: ['"Hey Secretary, cierra"', 'Auto-sincronizado']
    }
  }
]

const features = [
  {
    icon: Brain,
    title: 'Memoria Persistente',
    description: 'Nunca olvida. SESSION-STATE.md mantiene todo el contexto entre sesiones.'
  },
  {
    icon: Shield,
    title: 'P2P Encriptado',
    description: 'RSA-2048. Las negociaciones con otros secretaries son privadas.'
  },
  {
    icon: Zap,
    title: 'Proactivo',
    description: 'No espera comandos. Te envía información antes de que la pidas.'
  },
  {
    icon: Smartphone,
    title: 'Zero UI',
    description: 'Todo por WhatsApp. No necesitas abrir ninguna app.'
  },
  {
    icon: MessageSquare,
    title: 'Voice Wake',
    description: '"Hey Secretary" y habla. Manos libres, siempre disponible.'
  },
  {
    icon: Heart,
    title: 'Te Conoce',
    description: 'Aprende tus preferencias y toma decisiones por ti.'
  }
]

export function ComparisonSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
            📊 Impacto Real
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            El Antes y Después
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Mira exactamente cuánto tiempo y esfuerzo te ahorra SecretaryOS cada día.
          </p>
        </motion.div>

        {/* Comparisons */}
        <div className="space-y-6 mb-20">
          {comparisons.map((comp, index) => (
            <motion.div
              key={comp.task}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Task Header */}
              <div className="px-6 py-4 bg-slate-100 border-b">
                <h3 className="font-bold text-slate-900">{comp.task}</h3>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {/* Without */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-semibold text-red-700">Sin Secretary</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-red-600">{comp.without.time}</span>
                    <span className="text-slate-500 ml-2">de tu tiempo</span>
                  </div>
                  <ul className="space-y-2">
                    {comp.without.actions.map((action, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                        <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* With */}
                <div className="p-6 bg-green-50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-semibold text-green-700">Con Secretary</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-green-600">{comp.with.time}</span>
                    <span className="text-slate-500 ml-2">de tu tiempo</span>
                  </div>
                  <ul className="space-y-2">
                    {comp.with.actions.map((action, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 text-white text-center mb-20"
        >
          <div className="text-5xl font-bold mb-2">~2.9 horas</div>
          <p className="text-xl text-brand-100">ahorradas por día = 60+ horas al mes</p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Por qué es diferente
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
              >
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
