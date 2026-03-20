export interface BriefingContext {
  userName?: string
  date: Date
  todayMeetings?: number
  pendingTasks?: number
  unreadEmails?: number
  weather?: string
  language: 'es' | 'en'
}

export interface WelcomeConfig {
  userName?: string
  language: 'es' | 'en'
  sendWelcome: boolean
  sendDailyBriefing: boolean
  briefingTime: string // HH:mm format
}

export function generateWelcomeMessage(config: WelcomeConfig): string {
  const lang = config.language
  const hour = new Date().getHours()
  const greeting = getGreeting(hour, lang)
  
  if (lang === 'es') {
    return `${greeting}! 👋

Soy *Secretary*, tu asistente personal de IA.

Puedo ayudarte con:
• 📅 Coordinar reuniones
• ⏰ Establecer recordatorios
• 📧 Resumir emails importantes
• 💬 Responder mensajes
• 🧠 Recordar información importante

*Comandos disponibles:*
• "Agenda una reunión con [nombre]"
• "Recuérdame [cosa] a las [hora]"
• "Resúmeme mis emails de hoy"
• "Qué tengo pendiente?"

¿En qué puedo ayudarte hoy?`
  }
  
  return `${greeting}! 👋

I'm *Secretary*, your AI personal assistant.

I can help you with:
• 📅 Schedule meetings
• ⏰ Set reminders
• 📧 Summarize important emails
• 💬 Respond to messages
• 🧠 Remember important information

*Available commands:*
• "Schedule a meeting with [name]"
• "Remind me [thing] at [time]"
• "Summarize my emails for today"
• "What do I have pending?"

How can I help you today?`
}

export function generateMorningBriefing(context: BriefingContext): string {
  const lang = context.language
  const hour = context.date.getHours()
  const greeting = getGreeting(hour, lang)
  const dateStr = formatDate(context.date, lang)
  
  if (lang === 'es') {
    const parts: string[] = []
    
    parts.push(`${greeting}! ☀️`)
    parts.push(`*Resumen del ${dateStr}*\n`)
    
    if (context.todayMeetings && context.todayMeetings > 0) {
      parts.push(`📅 Tienes *${context.todayMeetings} reunión${context.todayMeetings > 1 ? 'es' : ''}* programadas`)
    } else {
      parts.push(`📅 No tienes reuniones programadas`)
    }
    
    if (context.pendingTasks && context.pendingTasks > 0) {
      parts.push(`📋 Tienes *${context.pendingTasks} tarea${context.pendingTasks > 1 ? 's' : ''}* pendiente${context.pendingTasks > 1 ? 's' : ''}`)
    }
    
    if (context.unreadEmails && context.unreadEmails > 0) {
      parts.push(`📧 Tienes *${context.unreadEmails} email${context.unreadEmails > 1 ? 's' : ''}* sin leer`)
    }
    
    if (context.weather) {
      parts.push(`🌤️ ${context.weather}`)
    }
    
    parts.push(`\n_¿En qué puedo ayudarte?_)
    
Escribe *“ayuda”* para ver todos los comandos disponibles.`)

    return parts.join('\n')
  }
  
  const parts: string[] = []
  
  parts.push(`${greeting}! ☀️`)
  parts.push(`*Summary for ${dateStr}*\n`)
  
  if (context.todayMeetings && context.todayMeetings > 0) {
    parts.push(`📅 You have *${context.todayMeetings} meeting${context.todayMeetings > 1 ? 's' : ''}* scheduled`)
  } else {
    parts.push(`📅 No meetings scheduled`)
  }
  
  if (context.pendingTasks && context.pendingTasks > 0) {
    parts.push(`📋 You have *${context.pendingTasks} pending task${context.pendingTasks > 1 ? 's' : ''}*`)
  }
  
  if (context.unreadEmails && context.unreadEmails > 0) {
    parts.push(`📧 You have *${context.unreadEmails} unread email${context.unreadEmails > 1 ? 's' : ''}*`)
  }
  
  if (context.weather) {
    parts.push(`🌤️ ${context.weather}`)
  }
  
  parts.push(`\n_How can I help?_)
  
Type *"help"* to see all available commands.`)

  return parts.join('\n')
}

export function generateEveningBriefing(context: BriefingContext): string {
  const lang = context.language
  
  if (lang === 'es') {
    return `🌙 *Resumen del día*

${context.todayMeetings && context.todayMeetings > 0 
  ? `Hoy tuviste ${context.todayMeetings} reunión${context.todayMeetings > 1 ? 'es' : ''}.` 
  : `Hoy no tuviste reuniones.`}

${context.pendingTasks && context.pendingTasks > 0 
  ? `Tienes ${context.pendingTasks} tarea${context.pendingTasks > 1 ? 's' : ''} pendiente${context.pendingTasks > 1 ? 's' : ''} para mañana.` 
  : `¡Nada pendiente para mañana! 🎉`}

¿Necesitas algo antes de dormir? 💤`
  }
  
  return `🌙 *End of day summary*

${context.todayMeetings && context.todayMeetings > 0 
  ? `You had ${context.todayMeetings} meeting${context.todayMeetings > 1 ? 's' : ''} today.` 
  : `No meetings today.`}

${context.pendingTasks && context.pendingTasks > 0 
  ? `You have ${context.pendingTasks} pending task${context.pendingTasks > 1 ? 's' : ''} for tomorrow.` 
  : `Nothing pending for tomorrow! 🎉`}

Anything else before bed? 💤`
}

export function generateInstallationCompleteMessage(lang: 'es' | 'en'): string {
  if (lang === 'es') {
    return `🎉 *¡SecretaryOS instalado!*

Tu asistente personal está listo.

*Mañana a las 8:00 AM* recibirás tu primer briefing con el resumen del día.

¿Listo para probar? Escríbeme algo! 💬`
  }
  
  return `🎉 *SecretaryOS installed!*

Your personal assistant is ready.

*Tomorrow at 8:00 AM* you'll receive your first briefing with the day's summary.

Ready to try? Send me a message! 💬`
}

function getGreeting(hour: number, lang: 'es' | 'en'): string {
  if (hour < 12) {
    return lang === 'es' ? 'Buenos días' : 'Good morning'
  }
  if (hour < 18) {
    return lang === 'es' ? 'Buenas tardes' : 'Good afternoon'
  }
  return lang === 'es' ? 'Buenas noches' : 'Good evening'
}

function formatDate(date: Date, lang: 'es' | 'en'): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }
  return date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', options)
}
