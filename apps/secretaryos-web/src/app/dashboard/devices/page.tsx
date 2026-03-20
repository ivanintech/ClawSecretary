'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Smartphone,
  Monitor,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  Globe
} from 'lucide-react'

interface Device {
  id: string
  phoneNumber: string | null
  lastSeen: string
  isActive: boolean
  platform?: string
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchDevices = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/devices')
      if (res.ok) {
        const data = await res.json()
        setDevices(data.devices || [])
      } else {
        setError('Failed to load devices')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const removeDevice = async (deviceId: string) => {
    setDeleting(deviceId)
    try {
      const res = await fetch('/api/devices', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId })
      })
      if (res.ok) {
        setDevices(prev => prev.filter(d => d.id !== deviceId))
      }
    } catch {
      setError('Failed to remove device')
    } finally {
      setDeleting(null)
    }
  }

  const formatLastSeen = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/dashboard"
          className="p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Connected Devices</h1>
          <p className="text-slate-600">Manage devices that access your Secretary</p>
        </div>
      </div>

      {/* Devices List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            <p>{error}</p>
            <button 
              onClick={fetchDevices}
              className="mt-2 text-sm underline"
            >
              Retry
            </button>
          </div>
        ) : devices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">No devices connected</h3>
            <p className="text-sm text-slate-600 mb-4">
              Your Secretary will appear here when connected from the mobile app
            </p>
            <Link
              href="/install"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
            >
              <Smartphone className="w-4 h-4" />
              Setup mobile app
            </Link>
          </motion.div>
        ) : (
          devices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                device.platform === 'web' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-green-100 text-green-600'
              }`}>
                {device.platform === 'web' ? (
                  <Monitor className="w-6 h-6" />
                ) : (
                  <Smartphone className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">
                    {device.phoneNumber || 'Unknown device'}
                  </h3>
                  {device.isActive ? (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <span className="w-2 h-2 bg-slate-300 rounded-full"></span>
                      Offline
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  Last seen {formatLastSeen(device.lastSeen)}
                </p>
              </div>

              <button
                onClick={() => removeDevice(device.id)}
                disabled={deleting === device.id}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
              >
                {deleting === device.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-8 p-4 bg-slate-50 rounded-xl">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-slate-900 mb-1">About device connections</h4>
            <p className="text-sm text-slate-600">
              Your Secretary runs locally on your phone. The bridge server only relays messages 
              without storing them. Remove devices you don't recognize.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
