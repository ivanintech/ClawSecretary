import { query, queryOne } from '../db/client.js'
import { v4 as uuidv4 } from 'uuid'

export interface DeviceInfo {
  id: string
  user_id: string
  device_token: string
  phone_number: string | null
  last_seen: Date
  created_at: Date
  is_active: boolean
}

export interface RegisterDeviceParams {
  token: string
  phoneNumber: string | null
}

export class DeviceManager {
  async registerDevice(userId: string, params: RegisterDeviceParams): Promise<string> {
    const existing = await queryOne<DeviceInfo>(
      'SELECT * FROM devices WHERE user_id = $1 AND device_token = $2',
      [userId, params.token]
    )

    if (existing) {
      await query(
        `UPDATE devices 
         SET last_seen = NOW(), is_active = true, phone_number = COALESCE($3, phone_number)
         WHERE id = $1`,
        [existing.id, params.phoneNumber]
      )
      return existing.id
    }

    const deviceId = uuidv4()
    await query(
      `INSERT INTO devices (id, user_id, device_token, phone_number, last_seen, is_active)
       VALUES ($1, $2, $3, $4, NOW(), true)`,
      [deviceId, userId, params.token, params.phoneNumber]
    )

    return deviceId
  }

  async getDevice(deviceId: string): Promise<DeviceInfo | null> {
    return queryOne<DeviceInfo>('SELECT * FROM devices WHERE id = $1', [deviceId])
  }

  async getUserDevices(userId: string): Promise<DeviceInfo[]> {
    return query<DeviceInfo>(
      'SELECT * FROM devices WHERE user_id = $1 AND is_active = true ORDER BY last_seen DESC',
      [userId]
    )
  }

  async deactivateDevice(deviceId: string): Promise<void> {
    await query('UPDATE devices SET is_active = false WHERE id = $1', [deviceId])
  }

  async updateLastSeen(deviceId: string): Promise<void> {
    await query('UPDATE devices SET last_seen = NOW() WHERE id = $1', [deviceId])
  }

  async cleanupInactiveDevices(maxAgeHours: number = 24): Promise<number> {
    const result = await queryOne<{ count: string }>(
      `UPDATE devices SET is_active = false 
       WHERE is_active = true AND last_seen < NOW() - INTERVAL '${maxAgeHours} hours'
       RETURNING id`
    )
    
    return result ? 1 : 0
  }
}
