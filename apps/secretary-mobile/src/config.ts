import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

export interface MobileConfig {
  deviceId: string
  userId: string
  bridgeUrl: string
  bridgeToken: string
  encryptedSession: string
  phoneNumber: string | null
  platform: 'android' | 'ios' | 'linux' | 'macos' | 'windows'
  appVersion: string
  setupCode?: string
}

const defaultConfig: MobileConfig = {
  deviceId: '',
  userId: '',
  bridgeUrl: '',
  bridgeToken: '',
  encryptedSession: '',
  phoneNumber: null,
  platform: (process.platform === 'win32' ? 'windows' : 
             process.platform === 'darwin' ? 'macos' : 'linux') as MobileConfig['platform'],
  appVersion: '0.1.0',
  setupCode: ''
}

export class ConfigManager {
  private configPath: string
  private config: MobileConfig

  constructor() {
    const home = process.env.HOME || process.env.APPDATA || '/tmp'
    const configDir = join(home, '.secretary-mobile')
    
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true })
    }
    
    this.configPath = join(configDir, 'config.json')
    this.config = this.load()
  }

  private load(): MobileConfig {
    try {
      if (existsSync(this.configPath)) {
        const data = readFileSync(this.configPath, 'utf-8')
        return { ...defaultConfig, ...JSON.parse(data) }
      }
    } catch {
      // Ignore errors, use defaults
    }
    return { ...defaultConfig }
  }

  private save(): void {
    try {
      writeFileSync(this.configPath, JSON.stringify(this.config, null, 2))
    } catch (error) {
      console.error('Failed to save config:', error)
    }
  }

  get<K extends keyof MobileConfig>(key: K): MobileConfig[K] {
    return this.config[key]
  }

  set<K extends keyof MobileConfig>(key: K, value: MobileConfig[K]): void {
    this.config[key] = value
    this.save()
  }

  getAll(): MobileConfig {
    return { ...this.config }
  }

  setFromSetupCode(code: string): void {
    try {
      const data = JSON.parse(Buffer.from(code, 'base64').toString('utf-8'))
      this.config.userId = data.userId
      this.config.bridgeUrl = data.bridgeUrl
      this.config.bridgeToken = data.bridgeToken
      this.config.encryptedSession = data.encryptedSession
      this.config.phoneNumber = data.phoneNumber || null
      this.save()
    } catch (error) {
      throw new Error('Invalid setup code')
    }
  }

  generateSetupCode(): string {
    const data = {
      userId: this.config.userId,
      bridgeUrl: this.config.bridgeUrl,
      bridgeToken: this.config.bridgeToken,
      encryptedSession: this.config.encryptedSession,
      phoneNumber: this.config.phoneNumber
    }
    return Buffer.from(JSON.stringify(data)).toString('base64')
  }

  isConfigured(): boolean {
    return !!(
      this.config.userId &&
      this.config.bridgeUrl &&
      this.config.bridgeToken &&
      this.config.encryptedSession
    )
  }

  clear(): void {
    this.config = { ...defaultConfig }
    this.save()
  }
}
