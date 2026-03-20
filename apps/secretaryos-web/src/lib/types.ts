// Types for SecretaryOS

export interface Profile {
  id: string
  email: string
  name: string | null
  plan: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface Memory {
  id: string
  user_id: string
  category: 'personal' | 'work' | 'family' | 'preferences' | 'location' | 'availability'
  content: string
  created_at: string
}

export interface Routine {
  id: string
  user_id: string
  name: string
  type: 'morning' | 'evening' | 'periodic' | 'trigger'
  enabled: boolean
  time: string
  days: string[]
  content: RoutineContent
  created_at: string
  updated_at: string
}

export interface RoutineContent {
  greeting?: boolean
  weather?: boolean
  calendar?: boolean
  reminders?: boolean
  emails?: boolean
  tasks?: boolean
  news?: boolean
}

export interface InstallToken {
  id: string
  user_id: string
  token: string
  device_type: string | null
  expires_at: string
  used_at: string | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  status: string
  plan: string
  current_period_end: string
  created_at: string
}

export interface Activity {
  id: string
  type: 'briefing' | 'meeting' | 'reminder' | 'email' | 'action' | 'notification'
  title: string
  description: string
  time: string
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export interface DeviceStatus {
  connected: boolean
  model: string
  battery: number
  signal: string
  secretaryActive: boolean
  whatsappConnected: boolean
  voiceWakeActive: boolean
  backgroundRefresh: boolean
}

export interface UserStats {
  emails: number
  meetings: number
  reminders: number
  actions: number
  emailChange: string
  meetingChange: string
  reminderChange: string
  actionChange: string
}
