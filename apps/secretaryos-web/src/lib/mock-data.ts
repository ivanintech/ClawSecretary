// Mock data for development when Supabase is not configured
import type { Memory, Routine, Activity, DeviceStatus, UserStats } from './types'

export const mockMemories: Memory[] = [
  { id: '1', user_id: 'demo', category: 'personal', content: 'Me llamo Juan García, tengo 35 años', created_at: new Date().toISOString() },
  { id: '2', user_id: 'demo', category: 'personal', content: 'CEO de TechStart, una startup de SaaS B2B', created_at: new Date().toISOString() },
  { id: '3', user_id: 'demo', category: 'work', content: 'Trabajo en Torre Picasso, Madrid centro', created_at: new Date().toISOString() },
  { id: '4', user_id: 'demo', category: 'work', content: 'Prefiero reuniones por la mañana', created_at: new Date().toISOString() },
  { id: '5', user_id: 'demo', category: 'family', content: 'Mi mujer se llama Ana, trabaja como médica', created_at: new Date().toISOString() },
  { id: '6', user_id: 'demo', category: 'family', content: 'Dos hijos: Lucía (8 años) y Pablo (5 años)', created_at: new Date().toISOString() },
  { id: '7', user_id: 'demo', category: 'preferences', content: 'No bebo alcohol ni café', created_at: new Date().toISOString() },
  { id: '8', user_id: 'demo', category: 'availability', content: 'Ejercicio: Lunes y Miércoles 7:00-8:00', created_at: new Date().toISOString() },
  { id: '9', user_id: 'demo', category: 'location', content: 'Vivo en Chamberí, Madrid', created_at: new Date().toISOString() },
]

export const mockRoutines: Routine[] = [
  {
    id: '1',
    user_id: 'demo',
    name: 'Morning Briefing',
    type: 'morning',
    enabled: true,
    time: '07:50',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    content: { greeting: true, weather: true, calendar: true, reminders: true, emails: true, tasks: false, news: false },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'demo',
    name: 'Evening Summary',
    type: 'evening',
    enabled: true,
    time: '21:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    content: { greeting: true, weather: false, calendar: false, reminders: false, emails: false, tasks: true, news: false },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'demo',
    name: 'Email Digest',
    type: 'periodic',
    enabled: true,
    time: 'Cada hora',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    content: { greeting: false, weather: false, calendar: false, reminders: false, emails: true, tasks: false, news: false },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockActivities: Activity[] = [
  { id: '1', type: 'briefing', title: 'Morning Briefing', description: 'Resumen del día: 3 reuniones, 2 pendientes', time: '07:50', date: 'Hoy', status: 'completed' },
  { id: '2', type: 'meeting', title: 'Reunión confirmada', description: 'Con Carlos - Mañana 10:00', time: '09:45', date: 'Hoy', status: 'completed' },
  { id: '3', type: 'reminder', title: 'Recordatorio enviado', description: 'Llamar a mamá', time: '09:30', date: 'Hoy', status: 'completed' },
  { id: '4', type: 'email', title: 'Resumen de emails', description: '12 nuevos, 3 importantes', time: '08:00', date: 'Hoy', status: 'completed' },
  { id: '5', type: 'action', title: 'Tarea completada', description: 'Revisión de propuesta Q2', time: '08:30', date: 'Hoy', status: 'completed' },
  { id: '6', type: 'notification', title: 'Cambio de reunión', description: 'Carlos movió la reunión a 11:00', time: 'Yesterday', date: 'Ayer', status: 'completed' },
  { id: '7', type: 'briefing', title: 'Evening Summary', description: '5 tareas completadas, 2 pendientes', time: '21:00', date: 'Ayer', status: 'completed' },
  { id: '8', type: 'email', title: 'Email importante', description: 'URGENTE de cliente@empresa.com', time: '18:30', date: 'Ayer', status: 'completed' },
]

export const mockDeviceStatus: DeviceStatus = {
  connected: true,
  model: 'iPhone 15 Pro',
  battery: 78,
  signal: 'Excelente',
  secretaryActive: true,
  whatsappConnected: true,
  voiceWakeActive: true,
  backgroundRefresh: true,
}

export const mockStats: UserStats = {
  emails: 12,
  meetings: 3,
  reminders: 5,
  actions: 47,
  emailChange: '+3 hoy',
  meetingChange: '2 coordinadas',
  reminderChange: '4 enviados',
  actionChange: '+12%',
}

// In-memory store for development
let memories = [...mockMemories]
let routines = [...mockRoutines]

export const mockStore = {
  memories: {
    getAll: () => [...memories],
    add: (memory: Omit<Memory, 'id' | 'created_at'>) => {
      const newMemory = {
        ...memory,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      }
      memories.push(newMemory)
      return newMemory
    },
    update: (id: string, updates: Partial<Memory>) => {
      const index = memories.findIndex(m => m.id === id)
      if (index !== -1) {
        memories[index] = { ...memories[index], ...updates }
        return memories[index]
      }
      return null
    },
    delete: (id: string) => {
      memories = memories.filter(m => m.id !== id)
      return true
    },
  },
  routines: {
    getAll: () => [...routines],
    add: (routine: Omit<Routine, 'id' | 'created_at' | 'updated_at'>) => {
      const newRoutine = {
        ...routine,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      routines.push(newRoutine)
      return newRoutine
    },
    update: (id: string, updates: Partial<Routine>) => {
      const index = routines.findIndex(r => r.id === id)
      if (index !== -1) {
        routines[index] = { ...routines[index], ...updates, updated_at: new Date().toISOString() }
        return routines[index]
      }
      return null
    },
    delete: (id: string) => {
      routines = routines.filter(r => r.id !== id)
      return true
    },
  },
}
