import { v4 as uuidv4 } from 'uuid'
import pino from 'pino'

const logger = pino({ name: 'device-manager' })

export interface DeviceInfo {
  id: string
  userId: string
  phoneNumber: string | null
  lastSeen: Date
  isActive: boolean
}

const devices = new Map<string, DeviceInfo>()

export class DeviceManager {
  registerDevice(userId: string, phoneNumber: string | null): string {
    let deviceId: string | undefined
    
    for (const [id, device] of devices.entries()) {
      if (device.userId === userId) {
        deviceId = id
        break
      }
    }

    if (deviceId) {
      const device = devices.get(deviceId)!
      device.lastSeen = new Date()
      device.isActive = true
      device.phoneNumber = phoneNumber || device.phoneNumber
      logger.info({ deviceId, userId }, 'Device updated')
      return deviceId
    }

    const newDeviceId = uuidv4()
    devices.set(newDeviceId, {
      id: newDeviceId,
      userId,
      phoneNumber,
      lastSeen: new Date(),
      isActive: true
    })
    
    logger.info({ deviceId: newDeviceId, userId }, 'Device registered')
    return newDeviceId
  }

  getDevice(deviceId: string): DeviceInfo | null {
    return devices.get(deviceId) || null
  }

  getUserDevices(userId: string): DeviceInfo[] {
    return Array.from(devices.values())
      .filter(d => d.userId === userId && d.isActive)
      // eslint-disable-next-line unicorn/no-array-sort
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
      .slice()
  }

  getActiveDevices(): DeviceInfo[] {
    return Array.from(devices.values())
      .filter(d => d.isActive)
  }

  deactivateDevice(deviceId: string): void {
    const device = devices.get(deviceId)
    if (device) {
      device.isActive = false
      logger.info({ deviceId }, 'Device deactivated')
    }
  }

  updateLastSeen(deviceId: string): void {
    const device = devices.get(deviceId)
    if (device) {
      device.lastSeen = new Date()
    }
  }

  cleanupInactiveDevices(maxAgeMs: number = 24 * 60 * 60 * 1000): number {
    let cleaned = 0
    const now = Date.now()
    
    for (const [, device] of devices.entries()) {
      if (device.isActive && (now - device.lastSeen.getTime()) > maxAgeMs) {
        device.isActive = false
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      logger.info({ cleaned }, 'Inactive devices cleaned')
    }
    
    return cleaned
  }
}
