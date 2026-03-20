import pino from 'pino'
import { ConfigManager } from './config.js'
import { BridgeClient } from './bridge-client.js'
import { MessageProcessor } from './message-processor.js'
import { scanQRFromImage, decodeSetupCode } from './qr-scanner.js'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
})

class SecretaryMobile {
  private config: ConfigManager
  private bridge: BridgeClient | null = null
  private processor: MessageProcessor
  private isRunning = false

  constructor() {
    this.config = new ConfigManager()
    this.processor = new MessageProcessor(logger)
  }

  async start(): Promise<void> {
    logger.info('SecretaryOS Mobile starting...')

    if (!this.config.isConfigured()) {
      logger.error('Device not configured. Run with --setup or --configure')
      this.printSetupInstructions()
      process.exit(1)
    }

    const config = this.config.getAll()
    
    if (process.env.LLM_ENDPOINT) {
      this.processor.setLLMEndpoint(process.env.LLM_ENDPOINT)
    }

    this.bridge = new BridgeClient(config, logger)
    
    this.bridge.setMessageHandler(async (message) => {
      await this.handleIncomingMessage(message)
    })

    const connected = await this.bridge.connect()
    
    if (!connected) {
      logger.error('Failed to connect to bridge')
      process.exit(1)
    }

    this.isRunning = true
    logger.info({ 
      deviceId: config.deviceId,
      phoneNumber: config.phoneNumber 
    }, 'SecretaryOS Mobile running')

    process.on('SIGINT', () => this.shutdown())
    process.on('SIGTERM', () => this.shutdown())
  }

  private async handleIncomingMessage(message: { from: string; message: string; id: string }): Promise<void> {
    logger.info({ from: message.from, messageId: message.id }, 'Incoming message')

    if (this.bridge) {
      await this.bridge.sendTyping(message.from, true)
    }

    try {
      const result = await this.processor.processMessage(
        message.message,
        message.from.split('@')[0]
      )

      if (result.action !== 'none' && result.response) {
        await this.sendReply(message.from, result.response)
      }
    } catch (error) {
      logger.error({ error }, 'Failed to process message')
      await this.sendReply(message.from, 'Sorry, I encountered an error.')
    }
  }

  private async sendReply(to: string, text: string): Promise<void> {
    if (this.bridge) {
      await this.bridge.sendMessage(to, text)
      logger.info({ to }, 'Reply sent')
    }
  }

  private async shutdown(): Promise<void> {
    logger.info('Shutting down...')
    this.isRunning = false
    
    if (this.bridge) {
      this.bridge.disconnect()
    }
    
    process.exit(0)
  }

  private printSetupInstructions(): void {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                  SecretaryOS Mobile Setup                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  To configure this device, you have these options:            ║
║                                                               ║
║  1. SETUP CODE (Recommended):                               ║
║     - Open http://localhost:3000/install                      ║
║     - Complete WhatsApp setup                                 ║
║     - Copy the setup code shown on screen                    ║
║     - Run: secretary-mobile --code "<code>"                   ║
║                                                               ║
║  2. SCAN QR IMAGE:                                           ║
║     - Save the setup QR as setup-qr.png                      ║
║     - Run: secretary-mobile --scan setup-qr.png               ║
║                                                               ║
║  3. MANUAL SETUP:                                            ║
║     - Run: secretary-mobile --setup <base64-code>            ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
`)
  }

  async setupFromCode(code: string): Promise<void> {
    try {
      this.config.setFromSetupCode(code)
      logger.info('Setup code applied successfully')
    } catch (error) {
      logger.error({ error }, 'Invalid setup code')
      throw error
    }
  }

  async setupFromQRImage(imagePath: string): Promise<void> {
    try {
      const data = await scanQRFromImage(imagePath)
      this.config.setFromSetupCode(Buffer.from(JSON.stringify(data)).toString('base64'))
      logger.info('Setup from QR image successful')
    } catch (error) {
      logger.error({ error }, 'Failed to scan QR from image')
      throw error
    }
  }

  async setupFromBase64Code(code: string): Promise<void> {
    const data = decodeSetupCode(code)
    this.config.setFromSetupCode(Buffer.from(JSON.stringify(data)).toString('base64'))
    logger.info('Setup from code successful')
  }

  async generateSetupQR(): Promise<string> {
    return this.config.generateSetupCode()
  }

  getStatus(): { connected: boolean; configured: boolean } {
    return {
      connected: this.bridge?.isConnected() || false,
      configured: this.config.isConfigured()
    }
  }
}

const secretary = new SecretaryMobile()

const args = process.argv.slice(2)

if (args.includes('--setup') && args[1]) {
  secretary.setupFromCode(args[1])
    .then(() => {
      console.log('Setup complete! Run --start to connect.')
      process.exit(0)
    })
    .catch(() => process.exit(1))
} else if (args.includes('--code') && args[1]) {
  const code = args.slice(1).join(' ')
  secretary.setupFromBase64Code(code)
    .then(() => {
      console.log('Setup complete! Run --start to connect.')
      process.exit(0)
    })
    .catch(() => process.exit(1))
} else if (args.includes('--scan') && args[1]) {
  secretary.setupFromQRImage(args[1])
    .then(() => {
      console.log('QR scanned! Run --start to connect.')
      process.exit(0)
    })
    .catch(() => process.exit(1))
} else if (args.includes('--start')) {
  secretary.start().catch((error) => {
    logger.error({ error }, 'Failed to start')
    process.exit(1)
  })
} else if (args.includes('--status')) {
  const status = secretary.getStatus()
  console.log(`Configured: ${status.configured}`)
  console.log(`Connected: ${status.connected}`)
  process.exit(0)
} else if (args.includes('--qr')) {
  secretary.generateSetupQR()
    .then((qr) => {
      console.log('Setup QR (base64):', qr)
      process.exit(0)
    })
    .catch(() => process.exit(1))
} else if (args.includes('--help')) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    SecretaryOS Mobile CLI                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Usage:                                                       ║
║    secretary-mobile [options]                                 ║
║                                                               ║
║  Options:                                                    ║
║    --start           Start the mobile client                  ║
║    --code <code>     Setup from base64 setup code            ║
║    --scan <file>     Scan QR from image file                 ║
║    --setup <code>    Setup from base64 code (legacy)         ║
║    --status          Check connection status                  ║
║    --qr              Generate setup QR code                   ║
║    --help            Show this help                          ║
║                                                               ║
║  Environment Variables:                                       ║
║    LLM_ENDPOINT      URL for local LLM inference (optional)  ║
║    LOG_LEVEL         Logging level (default: info)            ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
`)
  process.exit(0)
} else {
  secretary.start().catch((error) => {
    logger.error({ error }, 'Failed to start')
    process.exit(1)
  })
}

export { SecretaryMobile }
