import type pino from 'pino'

export interface ProcessResult {
  response: string
  confidence: number
  action?: 'reply' | 'schedule' | 'remind' | 'forward' | 'none'
  metadata?: Record<string, unknown>
}

export class MessageProcessor {
  private logger: pino.Logger
  private llmEndpoint: string | null = null

  constructor(logger: pino.Logger) {
    this.logger = logger
  }

  setLLMEndpoint(endpoint: string): void {
    this.llmEndpoint = endpoint
    this.logger.info({ endpoint }, 'LLM endpoint configured')
  }

  async processMessage(
    message: string,
    senderName: string,
    context?: Record<string, unknown>
  ): Promise<ProcessResult> {
    this.logger.info({ message, senderName }, 'Processing message')

    try {
      if (this.llmEndpoint) {
        return await this.processWithLLM(message, senderName, context)
      }

      return this.processWithRules(message, senderName)
    } catch (error) {
      this.logger.error({ error }, 'Failed to process message')
      return {
        response: 'Sorry, I encountered an error processing your message.',
        confidence: 0
      }
    }
  }

  private async processWithLLM(
    message: string,
    senderName: string,
    context?: Record<string, unknown>
  ): Promise<ProcessResult> {
    const systemPrompt = `You are Secretary, a helpful AI assistant. 
You help the user manage their messages, schedule meetings, set reminders, and more.
Be concise, friendly, and helpful.
Current time: ${new Date().toISOString()}`

    const response = await fetch(this.llmEndpoint!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'local',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Message from ${senderName}: ${message}` }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`LLM request failed: ${response.status}`)
    }

    const data = await response.json() as { choices?: { message?: { content?: string } }[] }
    const reply = data.choices?.[0]?.message?.content || 'I understand.'

    return {
      response: reply,
      confidence: 0.9,
      action: this.detectAction(reply)
    }
  }

  private processWithRules(message: string, senderName: string): ProcessResult {
    const lowerMessage = message.toLowerCase()
    const now = new Date()

    if (lowerMessage.includes('meeting') || lowerMessage.includes('reunión') || lowerMessage.includes('reunion')) {
      return {
        response: `I can help you schedule a meeting. What day and time works best?`,
        confidence: 0.85,
        action: 'schedule'
      }
    }

    if (lowerMessage.includes('remind') || lowerMessage.includes('recordar') || lowerMessage.includes('recordatorio')) {
      return {
        response: `I'll set a reminder for you. What would you like to be reminded about and when?`,
        confidence: 0.85,
        action: 'remind'
      }
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hola')) {
      return {
        response: `Hello! I'm Secretary. How can I help you today?`,
        confidence: 0.95,
        action: 'reply'
      }
    }

    if (lowerMessage.includes('thanks') || lowerMessage.includes('gracias') || lowerMessage.includes('thank you')) {
      return {
        response: `You're welcome! Is there anything else I can help you with?`,
        confidence: 0.95,
        action: 'reply'
      }
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('ayuda')) {
      return {
        response: `I can help you with:
- Scheduling meetings
- Setting reminders
- Managing your calendar
- Answering questions
- And more!

What would you like help with?`,
        confidence: 0.9,
        action: 'reply'
      }
    }

    return {
      response: `I understand you said: "${message}". I'm here to help you manage your schedule, set reminders, and more. How can I assist you?`,
      confidence: 0.5,
      action: 'reply'
    }
  }

  private detectAction(response: string): ProcessResult['action'] {
    const lower = response.toLowerCase()
    
    if (lower.includes('meeting') || lower.includes('reunión') || lower.includes('calendar')) {
      return 'schedule'
    }
    if (lower.includes('reminder') || lower.includes('recordar') || lower.includes('nota')) {
      return 'remind'
    }
    if (lower.includes('forward') || lower.includes('enviar')) {
      return 'forward'
    }
    
    return 'reply'
  }

  async generateBriefing(context: {
    todayMeetings?: number
    pendingTasks?: number
    unreadEmails?: number
    weather?: string
  }): Promise<string> {
    const parts: string[] = []

    parts.push(`Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}! Here's your briefing.`)

    if (context.todayMeetings && context.todayMeetings > 0) {
      parts.push(`You have ${context.todayMeetings} meeting${context.todayMeetings > 1 ? 's' : ''} scheduled today.`)
    } else {
      parts.push(`No meetings scheduled for today.`)
    }

    if (context.pendingTasks && context.pendingTasks > 0) {
      parts.push(`${context.pendingTasks} pending task${context.pendingTasks > 1 ? 's' : ''} to review.`)
    }

    if (context.unreadEmails && context.unreadEmails > 0) {
      parts.push(`${context.unreadEmails} unread email${context.unreadEmails > 1 ? 's' : ''}.`)
    }

    if (context.weather) {
      parts.push(`Current weather: ${context.weather}`)
    }

    parts.push(`Is there anything you'd like me to help with?`)

    return parts.join(' ')
  }
}
