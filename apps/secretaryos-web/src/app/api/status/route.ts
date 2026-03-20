import { NextResponse } from 'next/server'
import { mockActivities, mockDeviceStatus, mockStats } from '@/lib/mock-data'

export async function GET() {
  try {
    // Simulate checking gateway status
    // In production, this would call the actual OpenClaw gateway
    
    const isGatewayConnected = process.env.GATEWAY_URL ? true : false // Mock

    return NextResponse.json({
      success: true,
      data: {
        gateway: {
          connected: isGatewayConnected,
          url: process.env.GATEWAY_URL || 'localhost:18789',
        },
        activities: mockActivities,
        device: mockDeviceStatus,
        stats: mockStats,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
