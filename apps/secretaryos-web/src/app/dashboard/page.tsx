'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Sun,
  Calendar,
  Mail,
  Clock,
  MessageSquare,
  Zap,
  CheckCircle2,
  QrCode,
  Smartphone,
  ChevronRight,
  TrendingUp,
  Bell,
  FileText,
  RefreshCcw,
  Brain
} from 'lucide-react'

const mockActivities = [
  {
    id: '1',
    type: 'briefing',
    title: 'Morning Briefing',
    description: 'Resumen del día: 3 reuniones, 2 pendientes',
    time: '07:50',
    icon: Sun,
    status: 'completed'
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Reunión confirmada',
    description: 'Con Carlos - Mañana 10:00',
    time: '09:45',
    icon: Calendar,
    status: 'completed'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Recordatorio enviado',
    description: 'Llamar a mamá',
    time: '09:30',
    icon: Bell,
    status: 'completed'
  },
  {
    id: '4',
    type: 'email',
    title: 'Resumen de emails',
    description: '12 nuevos, 3 importantes',
    time: '08:00',
    icon: Mail,
    status: 'completed'
  },
  {
    id: '5',
    type: 'action',
    title: 'Tarea completada',
    description: 'Revisión de propuesta Q2',
    time: '08:30',
    icon: Zap,
    status: 'completed'
  }
]

const mockStats = [
  { label: 'Emails', value: '12', change: '+3 hoy', icon: Mail },
  { label: 'Reuniones', value: '3', change: '2 coordinadas', icon: Calendar },
  { label: 'Recordatorios', value: '5', change: '4 enviados', icon: Bell },
  { label: 'Acciones', value: '47', change: '+12%', icon: Zap },
]

const mockRoutines = [
  { name: 'Morning Briefing', time: '07:50', active: true, type: 'morning' },
  { name: 'Evening Summary', time: '21:00', active: true, type: 'evening' },
  { name: 'Email Digest', time: 'Cada hora', active: true, type: 'periodic' },
  { name: 'Follow-ups', time: 'Cuando expire', active: false, type: 'trigger' },
]

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('')
  
  useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Buenos días')
    else if (hour < 18) setGreeting('Buenas tardes')
    else setGreeting('Buenas noches')
  })

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Buenos días, Juan 👋
          </h1>
          <p className="text-slate-600">
            Tu secretary ha estado activo
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/install"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition"
          >
            <QrCode className="w-5 h-5" />
            <span className="hidden sm:inline">Instalar app</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-slate-400" />
              <span className="text-xs text-green-600 font-medium">{stat.change}</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Actividad Reciente
            </h2>
            <Link href="/dashboard/activity" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              Ver más <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === 'briefing' ? 'bg-amber-100 text-amber-600' :
                  activity.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'email' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'reminder' ? 'bg-pink-100 text-pink-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900">{activity.title}</h3>
                    {activity.status === 'completed' && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-500 truncate">{activity.description}</p>
                </div>
                <span className="text-sm text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold text-slate-900 mb-4">Acciones Rápidas</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 transition">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                <span className="text-slate-700">Enviar mensaje</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 transition">
                <Calendar className="w-5 h-5 text-brand-600" />
                <span className="text-slate-700">Ver calendario</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 transition">
                <Bell className="w-5 h-5 text-brand-600" />
                <span className="text-slate-700">Crear recordatorio</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-slate-50 transition">
                <FileText className="w-5 h-5 text-brand-600" />
                <span className="text-slate-700">Resumen emails</span>
              </button>
            </div>
          </div>

          {/* Today's Briefing Preview */}
          <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl shadow-sm p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-5 h-5" />
              <h2 className="font-semibold">Tu día de hoy</h2>
            </div>
            <div className="space-y-2 text-sm text-brand-100">
              <p>📅 3 reuniones programadas</p>
              <p>⏰ 2 recordatorios activos</p>
              <p>📧 12 emails pendientes</p>
            </div>
            <button className="mt-4 w-full py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition">
              Ver briefing completo
            </button>
          </div>

          {/* Memory Snippet */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Memorias
              </h2>
              <Link href="/dashboard/memory" className="text-xs text-brand-600 hover:underline">
                Editar
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-slate-600">👤 CEO de TechStart</p>
              <p className="text-slate-600">📧 Reuniones: mañanas</p>
              <p className="text-slate-600">☕ No bebo café</p>
              <p className="text-slate-400">+ 9 más</p>
            </div>
          </div>
        </div>
      </div>

      {/* Routines Grid */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Mis Rutinas
          </h2>
          <Link href="/dashboard/routines" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
            Gestionar <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockRoutines.map((routine, index) => (
            <motion.div
              key={routine.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl p-4 shadow-sm ${
                routine.active ? '' : 'opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`w-3 h-3 rounded-full ${
                  routine.type === 'morning' ? 'bg-amber-400' :
                  routine.type === 'evening' ? 'bg-indigo-400' :
                  routine.type === 'periodic' ? 'bg-blue-400' :
                  'bg-pink-400'
                }`} />
                {routine.active ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <span className="text-xs text-slate-400">Inactivo</span>
                )}
              </div>
              <h3 className="font-medium text-slate-900 mb-1">{routine.name}</h3>
              <p className="text-sm text-slate-500">{routine.time}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
