'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity,
  Filter,
  Calendar,
  Bell,
  Mail,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sun,
  RefreshCcw
} from 'lucide-react'

type ActivityType = 'briefing' | 'meeting' | 'reminder' | 'email' | 'action' | 'notification'

interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  time: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

const mockActivities: ActivityItem[] = [
  { id: '1', type: 'briefing', title: 'Morning Briefing', description: 'Resumen del día: 3 reuniones, 2 pendientes', time: '07:50', date: 'Hoy', status: 'completed' },
  { id: '2', type: 'meeting', title: 'Reunión confirmada', description: 'Con Carlos - Mañana 10:00', time: '09:45', date: 'Hoy', status: 'completed' },
  { id: '3', type: 'reminder', title: 'Recordatorio enviado', description: 'Llamar a mamá', time: '09:30', date: 'Hoy', status: 'completed' },
  { id: '4', type: 'email', title: 'Resumen de emails', description: '12 nuevos, 3 importantes', time: '08:00', date: 'Hoy', status: 'completed' },
  { id: '5', type: 'action', title: 'Tarea completada', description: 'Revisión de propuesta Q2', time: '08:30', date: 'Hoy', status: 'completed' },
  { id: '6', type: 'notification', title: 'Cambio de reunión', description: 'Carlos movió la reunión a 11:00', time: 'Yesterday', date: 'Ayer', status: 'completed' },
  { id: '7', type: 'briefing', title: 'Evening Summary', description: '5 tareas completadas, 2 pendientes', time: '21:00', date: 'Ayer', status: 'completed' },
  { id: '8', type: 'email', title: 'Email importante', description: 'URGENTE de cliente@empresa.com', time: '18:30', date: 'Ayer', status: 'completed' },
  { id: '9', type: 'meeting', title: 'Reunión equipos', description: 'TechStart Weekly', time: '10:00', date: 'Ayer', status: 'completed' },
  { id: '10', type: 'action', title: 'Follow-up enviado', description: 'Revisar Q4 propuesta', time: '14:00', date: 'Hace 2 días', status: 'completed' },
]

const typeConfig: Record<ActivityType, { icon: any; color: string; bgColor: string; label: string }> = {
  briefing: { icon: Sun, color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Briefing' },
  meeting: { icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Reunión' },
  reminder: { icon: Bell, color: 'text-pink-600', bgColor: 'bg-pink-100', label: 'Recordatorio' },
  email: { icon: Mail, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'Email' },
  action: { icon: Zap, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Acción' },
  notification: { icon: RefreshCcw, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Notificación' },
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all')

  const filteredActivities = mockActivities.filter(activity => {
    if (filter !== 'all' && activity.type !== filter) return false
    if (dateFilter === 'today' && activity.date !== 'Hoy') return false
    if (dateFilter === 'week' && activity.date === 'Hace 2 días') return false
    return true
  })

  const groupedByDate = filteredActivities.reduce((acc, activity) => {
    if (!acc[activity.date]) acc[activity.date] = []
    acc[activity.date].push(activity)
    return acc
  }, {} as Record<string, ActivityItem[]>)

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Activity className="w-8 h-8 text-brand-600" />
          Actividad
        </h1>
        <p className="text-slate-600 mt-1">
          Todo lo que ha hecho tu secretary
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ActivityType | 'all')}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="all">Todos</option>
            {Object.entries(typeConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {(['all', 'today', 'week'] as const).map((date) => (
            <button
              key={date}
              onClick={() => setDateFilter(date)}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                dateFilter === date
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {date === 'all' ? 'Todo' : date === 'today' ? 'Hoy' : 'Esta semana'}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, activities]) => (
          <div key={date}>
            <h2 className="text-sm font-semibold text-slate-500 mb-3">{date}</h2>
            <div className="space-y-3">
              {activities.map((activity, index) => {
                const config = typeConfig[activity.type]
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor}`}>
                      <config.icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900">{activity.title}</h3>
                        {activity.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        {activity.status === 'failed' && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{activity.description}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm text-slate-400">{activity.time}</span>
                      <span className="block text-xs text-slate-400 mt-1 capitalize">{activity.type}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Sin actividad</h3>
          <p className="text-slate-500">No hay actividades que coincidan con los filtros</p>
        </div>
      )}
    </div>
  )
}
