import pino from 'pino'
import { generateMorningBriefing, generateEveningBriefing, type BriefingContext } from './messages.js'

const logger = pino({ name: 'briefing-scheduler' })

export interface ScheduleConfig {
  userId: string
  timezone: string
  morningTime: string // HH:mm
  eveningTime: string // HH:mm
  language: 'es' | 'en'
  enabled: boolean
}

export interface BriefingProvider {
  getContext(): Promise<BriefingContext>
}

export class BriefingScheduler {
  private config: ScheduleConfig
  private sendFn: (message: string) => Promise<void>
  private provider: BriefingProvider | null = null
  private morningTimer: NodeJS.Timeout | null = null
  private eveningTimer: NodeJS.Timeout | null = null
  private isRunning = false

  constructor(config: ScheduleConfig, sendFn: (message: string) => Promise<void>) {
    this.config = config
    this.sendFn = sendFn
  }

  setProvider(provider: BriefingProvider): void {
    this.provider = provider
  }

  start(): void {
    if (this.isRunning || !this.config.enabled) {
      return
    }

    this.isRunning = true
    this.scheduleNextBriefing()
    logger.info({ config: this.config }, 'Briefing scheduler started')
  }

  stop(): void {
    this.isRunning = false
    if (this.morningTimer) {
      clearTimeout(this.morningTimer)
      this.morningTimer = null
    }
    if (this.eveningTimer) {
      clearTimeout(this.eveningTimer)
      this.eveningTimer = null
    }
    logger.info('Briefing scheduler stopped')
  }

  private scheduleNextBriefing(): void {
    const now = new Date()
    const [morningHour, morningMin] = this.config.morningTime.split(':').map(Number)
    const [eveningHour, eveningMin] = this.config.eveningTime.split(':').map(Number)

    const morningTarget = new Date(now)
    morningTarget.setHours(morningHour, morningMin, 0, 0)
    if (morningTarget <= now) {
      morningTarget.setDate(morningTarget.getDate() + 1)
    }

    const eveningTarget = new Date(now)
    eveningTarget.setHours(eveningHour, eveningMin, 0, 0)
    if (eveningTarget <= now) {
      eveningTarget.setDate(eveningTarget.getDate() + 1)
    }

    const msUntilMorning = morningTarget.getTime() - now.getTime()
    const msUntilEvening = eveningTarget.getTime() - now.getTime()

    this.morningTimer = setTimeout(() => {
      this.sendMorningBriefing()
      this.scheduleNextBriefing()
    }, msUntilMorning)

    this.eveningTimer = setTimeout(() => {
      this.sendEveningBriefing()
      this.scheduleNextBriefing()
    }, msUntilEvening)

    logger.debug({
      nextMorning: morningTarget.toISOString(),
      nextEvening: eveningTarget.toISOString()
    }, 'Briefings scheduled')
  }

  private async sendMorningBriefing(): Promise<void> {
    logger.info('Sending morning briefing')
    try {
      const context = await this.getContext()
      const message = generateMorningBriefing(context)
      await this.sendFn(message)
      logger.info('Morning briefing sent')
    } catch (error) {
      logger.error({ error }, 'Failed to send morning briefing')
    }
  }

  private async sendEveningBriefing(): Promise<void> {
    logger.info('Sending evening briefing')
    try {
      const context = await this.getContext()
      const message = generateEveningBriefing(context)
      await this.sendFn(message)
      logger.info('Evening briefing sent')
    } catch (error) {
      logger.error({ error }, 'Failed to send evening briefing')
    }
  }

  private async getContext(): Promise<BriefingContext> {
    if (this.provider) {
      return this.provider.getContext()
    }

    return {
      date: new Date(),
      language: this.config.language,
      todayMeetings: 0,
      pendingTasks: 0,
      unreadEmails: 0
    }
  }

  updateConfig(newConfig: Partial<ScheduleConfig>): void {
    this.config = { ...this.config, ...newConfig }
    if (this.isRunning) {
      this.stop()
      this.start()
    }
  }
}

export function createDefaultConfig(userId: string, language: 'es' | 'en' = 'es'): ScheduleConfig {
  return {
    userId,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    morningTime: '08:00',
    eveningTime: '21:00',
    language,
    enabled: true
  }
}
