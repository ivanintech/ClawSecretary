'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Sun,
  Moon,
  RefreshCcw,
  Zap,
  CheckCircle2,
  Eye
} from 'lucide-react'

type RoutineType = 'morning' | 'evening' | 'periodic' | 'trigger'
type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

interface Routine {
  id: string
  name: string
  type: RoutineType
  enabled: boolean
  time: string
  days: DayOfWeek[]
  content: {
    greeting: boolean
    weather: boolean
    calendar: boolean
    reminders: boolean
    emails: boolean
    tasks: boolean
    news: boolean
  }
}

const days: { id: DayOfWeek; label: string }[] = [
  { id: 'mon', label: 'L' },
  { id: 'tue', label: 'M' },
  { id: 'wed', label: 'X' },
  { id: 'thu', label: 'J' },
  { id: 'fri', label: 'V' },
  { id: 'sat', label: 'S' },
  { id: 'sun', label: 'D' },
]

const initialRoutines: Routine[] = [
  {
    id: '1',
    name: 'Morning Briefing',
    type: 'morning',
    enabled: true,
    time: '07:50',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    content: {
      greeting: true,
      weather: true,
      calendar: true,
      reminders: true,
      emails: true,
      tasks: false,
      news: false
    }
  },
  {
    id: '2',
    name: 'Evening Summary',
    type: 'evening',
    enabled: true,
    time: '21:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    content: {
      greeting: true,
      weather: false,
      calendar: false,
      reminders: false,
      emails: false,
      tasks: true,
      news: false
    }
  },
  {
    id: '3',
    name: 'Email Digest',
    type: 'periodic',
    enabled: true,
    time: 'Cada hora',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    content: {
      greeting: false,
      weather: false,
      calendar: false,
      reminders: false,
      emails: true,
      tasks: false,
      news: false
    }
  }
]

const typeConfig: Record<RoutineType, { icon: any; color: string; bgColor: string }> = {
  morning: { icon: Sun, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  evening: { icon: Moon, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  periodic: { icon: RefreshCcw, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  trigger: { icon: Zap, color: 'text-pink-600', bgColor: 'bg-pink-100' }
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const toggleRoutine = async (id: string) => {
    setRoutines(routines.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const updateRoutine = async (id: string, updates: Partial<Routine>) => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setRoutines(routines.map(r => 
      r.id === id ? { ...r, ...updates } : r
    ))
    setEditingId(null)
    setSaving(false)
  }

  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter(r => r.id !== id))
  }

  const toggleDay = (routineId: string, day: DayOfWeek) => {
    setRoutines(routines.map(r => {
      if (r.id !== routineId) return r
      const newDays = r.days.includes(day)
        ? r.days.filter(d => d !== day)
        : [...r.days, day]
      return { ...r, days: newDays }
    }))
  }

  const toggleContent = (routineId: string, key: keyof Routine['content']) => {
    setRoutines(routines.map(r => {
      if (r.id !== routineId) return r
      return { 
        ...r, 
        content: { ...r.content, [key]: !r.content[key] } 
      }
    }))
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Clock className="w-8 h-8 text-brand-600" />
            Mis Rutinas
          </h1>
          <p className="text-slate-600 mt-1">
            Configura qué hace tu secretary y cuándo
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition">
          <Plus className="w-5 h-5" />
          Nueva Rutina
        </button>
      </div>

      <div className="space-y-4">
        {routines.map((routine, index) => {
          const config = typeConfig[routine.type]
          const isEditing = editingId === routine.id
          
          return (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                routine.enabled ? '' : 'opacity-60'
              }`}
            >
              {/* Header */}
              <div className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor}`}>
                  <config.icon className={`w-6 h-6 ${config.color}`} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{routine.name}</h3>
                  <p className="text-sm text-slate-500">{routine.time}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={routine.enabled}
                    onChange={() => toggleRoutine(routine.id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>

                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingId(isEditing ? null : routine.id)}
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition"
                  >
                    {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Days */}
              <div className="px-4 pb-4 flex items-center gap-2">
                <span className="text-sm text-slate-500 mr-2">Días:</span>
                {days.map(day => (
                  <button
                    key={day.id}
                    onClick={() => routine.enabled && toggleDay(routine.id, day.id)}
                    disabled={!routine.enabled}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                      routine.days.includes(day.id)
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    } ${!routine.enabled ? 'cursor-not-allowed' : ''}`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>

              {/* Expanded Content (when editing) */}
              {isEditing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t p-4 bg-slate-50"
                >
                  <h4 className="font-medium text-slate-900 mb-3">Contenido del briefing:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(routine.content).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => toggleContent(routine.id, key as keyof Routine['content'])}
                          className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-slate-700 capitalize">
                          {key === 'greeting' && 'Saludo personalizado'}
                          {key === 'weather' && 'Clima'}
                          {key === 'calendar' && 'Calendario'}
                          {key === 'reminders' && 'Recordatorios'}
                          {key === 'emails' && 'Emails'}
                          {key === 'tasks' && 'Tareas'}
                          {key === 'news' && 'Noticias'}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => updateRoutine(routine.id, {})}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {routines.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Sin rutinas configuradas</h3>
          <p className="text-slate-500 mb-4">Crea tu primera rutina para automatizar tu día</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition mx-auto">
            <Plus className="w-5 h-5" />
            Crear rutina
          </button>
        </div>
      )}
    </div>
  )
}
