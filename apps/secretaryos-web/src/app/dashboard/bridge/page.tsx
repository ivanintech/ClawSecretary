'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Server,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ExternalLink
} from 'lucide-react'

export default function BridgeConfigPage() {
  const [bridgeUrl, setBridgeUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState<{
    configured: boolean
    healthy: boolean
    connections?: number
    error?: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bridge/config')
      if (res.ok) {
        const data = await res.json()
        setStatus(data)
        if (data.url) {
          setBridgeUrl(data.url)
        }
      }
    } catch {
      setError('Failed to check bridge status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const testConnection = async () => {
    setTesting(true)
    try {
      const res = await fetch('/api/bridge/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bridgeUrl })
      })
      const data = await res.json()
      setStatus({
        configured: data.success,
        healthy: data.health?.status === 'ok',
        connections: data.health?.connections,
        error: data.error
      })
    } catch {
      setStatus({
        configured: false,
        healthy: false,
        error: 'Connection failed'
      })
    } finally {
      setTesting(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/bridge/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bridgeUrl })
      })
      const data = await res.json()
      
      if (data.success) {
        setStatus({
          configured: true,
          healthy: data.health?.status === 'ok',
          connections: data.health?.connections
        })
      } else {
        setError(data.error || 'Failed to save')
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
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
          <h1 className="text-2xl font-bold text-slate-900">Bridge Server</h1>
          <p className="text-slate-600">Configure your SecretaryOS bridge server</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                status?.healthy 
                  ? 'bg-green-100 text-green-600' 
                  : status?.configured 
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-slate-100 text-slate-400'
              }`}>
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Connection Status</h2>
                <div className="flex items-center gap-2 text-sm">
                  {status?.healthy ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Connected</span>
                      {status.connections !== undefined && (
                        <span className="text-slate-500">
                          ({status.connections} active connections)
                        </span>
                      )}
                    </>
                  ) : status?.configured ? (
                    <>
                      <XCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600">Unreachable</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">Not configured</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {status?.error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {status.error}
              </div>
            )}
          </motion.div>

          {/* Configuration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="font-semibold text-slate-900 mb-4">Bridge URL</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Server URL
                </label>
                <input
                  type="url"
                  value={bridgeUrl}
                  onChange={(e) => setBridgeUrl(e.target.value)}
                  placeholder="https://your-bridge-server.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-2">
                  The URL of your SecretaryOS bridge server
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={testConnection}
                  disabled={!bridgeUrl || testing}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  {testing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                  Test Connection
                </button>

                <button
                  onClick={saveConfig}
                  disabled={!bridgeUrl || saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <div className="p-4 bg-slate-50 rounded-xl">
            <h4 className="font-medium text-slate-900 mb-2">What is the Bridge Server?</h4>
            <p className="text-sm text-slate-600 mb-3">
              The bridge server relays messages between your phone and other services 
              without storing them. This keeps your data private while enabling 
              cross-platform functionality.
            </p>
            <a
              href="https://docs.secretaryos.ai/bridge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-brand-600 hover:underline"
            >
              Learn more <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
