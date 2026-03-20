import pino from 'pino'

const logger = pino({ name: 'progress-notifier' })

export interface InstallationProgress {
  stage: 'download' | 'install' | 'whatsapp' | 'complete' | 'error'
  percent: number
  message: string
  details?: string
}

export interface ProgressConfig {
  onProgress?: (progress: InstallationProgress) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

export class ProgressNotifier {
  private config: ProgressConfig
  private currentProgress: InstallationProgress | null = null

  constructor(config: ProgressConfig) {
    this.config = config
  }

  async notifyProgress(progress: InstallationProgress): Promise<void> {
    this.currentProgress = progress
    logger.info(progress, 'Installation progress')
    
    if (this.config.onProgress) {
      this.config.onProgress(progress)
    }
  }

  async startDownload(totalSize: number): Promise<void> {
    await this.notifyProgress({
      stage: 'download',
      percent: 0,
      message: 'Descargando modelo de IA...',
      details: `Tamaño total: ${this.formatBytes(totalSize)}`
    })
  }

  async updateDownloadProgress(downloaded: number, total: number): Promise<void> {
    const percent = Math.round((downloaded / total) * 100)
    await this.notifyProgress({
      stage: 'download',
      percent,
      message: 'Descargando modelo de IA...',
      details: `${this.formatBytes(downloaded)} / ${this.formatBytes(total)}`
    })
  }

  async downloadComplete(): Promise<void> {
    await this.notifyProgress({
      stage: 'download',
      percent: 100,
      message: 'Modelo descargado',
      details: 'Verificando integridad...'
    })
  }

  async startInstall(): Promise<void> {
    await this.notifyProgress({
      stage: 'install',
      percent: 0,
      message: 'Instalando SecretaryOS...',
      details: 'Configurando entorno...'
    })
  }

  async updateInstallProgress(stage: string, percent: number): Promise<void> {
    await this.notifyProgress({
      stage: 'install',
      percent,
      message: 'Instalando SecretaryOS...',
      details: stage
    })
  }

  async installComplete(): Promise<void> {
    await this.notifyProgress({
      stage: 'install',
      percent: 100,
      message: 'Instalación completada',
      details: 'Conectando WhatsApp...'
    })
  }

  async startWhatsApp(): Promise<void> {
    await this.notifyProgress({
      stage: 'whatsapp',
      percent: 0,
      message: 'Conectando WhatsApp...',
      details: 'Restaurando sesión...'
    })
  }

  async whatsappConnected(): Promise<void> {
    await this.notifyProgress({
      stage: 'whatsapp',
      percent: 100,
      message: 'WhatsApp conectado',
      details: '¡Listo para usar!'
    })
  }

  async complete(): Promise<void> {
    await this.notifyProgress({
      stage: 'complete',
      percent: 100,
      message: '¡SecretaryOS listo!',
      details: 'Bienvenido a tu nuevo asistente'
    })
    
    if (this.config.onComplete) {
      this.config.onComplete()
    }
  }

  async error(error: Error): Promise<void> {
    await this.notifyProgress({
      stage: 'error',
      percent: 0,
      message: 'Error en la instalación',
      details: error.message
    })
    
    if (this.config.onError) {
      this.config.onError(error)
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  getCurrentProgress(): InstallationProgress | null {
    return this.currentProgress
  }
}

export function createProgressMessages(lang: 'es' | 'en' = 'es'): Record<InstallationProgress['stage'], string[]> {
  const messages = {
    es: {
      download: [
        'Descargando modelo de IA... 🤖',
        'Este modelo permite que Secretary piense...',
        'Casi listo, sigue descargando...',
        '¡Modelo descargado!'
      ],
      install: [
        'Configurando entorno... ⚙️',
        'Instalando extensiones...',
        'Casi listo...',
        '¡Secretary instalado!'
      ],
      whatsapp: [
        'Conectando WhatsApp... 📱',
        'Restaurando sesión...',
        'Verificando conexión...',
        '¡WhatsApp listo!'
      ],
      complete: [
        '🎉 ¡SecretaryOS está listo!',
        'Bienvenido a tu nuevo asistente personal.',
        'Puedes empezar a chatear ahora.'
      ],
      error: [
        '⚠️ Hubo un problema',
        'Revisa los detalles e intenta de nuevo.'
      ]
    },
    en: {
      download: [
        'Downloading AI model... 🤖',
        'This model enables Secretary to think...',
        'Almost done, still downloading...',
        'Model downloaded!'
      ],
      install: [
        'Setting up environment... ⚙️',
        'Installing extensions...',
        'Almost ready...',
        'Secretary installed!'
      ],
      whatsapp: [
        'Connecting WhatsApp... 📱',
        'Restoring session...',
        'Verifying connection...',
        'WhatsApp ready!'
      ],
      complete: [
        '🎉 SecretaryOS is ready!',
        'Welcome to your new personal assistant.',
        'You can start chatting now.'
      ],
      error: [
        '⚠️ There was a problem',
        'Check the details and try again.'
      ]
    }
  }
  return messages[lang]
}
