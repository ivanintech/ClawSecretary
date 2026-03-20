'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Link2,
  Unlink,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Calendar,
  MapPin,
  Brain,
  MessageSquare,
  Mail,
  Clock
} from 'lucide-react'

interface OAuthProvider {
  id: string
  name: string
  description: string
  icon: string
  status: 'disconnected' | 'connecting' | 'connected' | 'error'
  connectedAt?: string
  lastSyncAt?: string
  error?: string
}

const PROVIDER_ICONS: Record<string, React.ElementType> = {
  google_calendar: Calendar,
  google_places: MapPin,
  notion: Brain,
  slack: MessageSquare,
  outlook: Mail,
  apple_reminders: Clock,
}

export default function OAuthConnectionsSettings() {
  const [providers, setProviders] = useState<OAuthProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/oauth')
      const data = await res.json()
      setProviders(data.providers || [])
    } catch (err) {
      console.error('Failed to fetch providers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (providerId: string) => {
    setActionLoading(providerId)
    try {
      const res = await fetch('/api/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId, action: 'connect' }),
      })
      const data = await res.json()
      
      if (data.success && data.oauthUrl) {
        // Open OAuth URL in popup or redirect
        window.open(data.oauthUrl, '_blank', 'width=600,height=700')
        fetchProviders()
      } else {
        alert(data.error || 'Failed to initiate connection')
      }
    } catch (err) {
      console.error('Failed to connect:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDisconnect = async (providerId: string) => {
    if (!confirm('Are you sure you want to disconnect this service?')) return
    
    setActionLoading(providerId)
    try {
      const res = await fetch('/api/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId, action: 'disconnect' }),
      })
      
      if (res.ok) {
        fetchProviders()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to disconnect')
      }
    } catch (err) {
      console.error('Failed to disconnect:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const handleSync = async (providerId: string) => {
    setActionLoading(providerId)
    try {
      const res = await fetch('/api/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId, action: 'sync' }),
      })
      
      if (res.ok) {
        fetchProviders()
      }
    } catch (err) {
      console.error('Failed to sync:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {providers.map((provider, index) => {
        const Icon = PROVIDER_ICONS[provider.id] || Link2
        const isLoading = actionLoading === provider.id
        
        return (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4 flex items-center gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                provider.status === 'connected' 
                  ? 'bg-green-100' 
                  : provider.status === 'error'
                    ? 'bg-red-100'
                    : 'bg-slate-100'
              }`}>
                {provider.icon}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900">{provider.name}</h4>
                  {provider.status === 'connected' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </span>
                  )}
                  {provider.status === 'error' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      <XCircle className="w-3 h-3" />
                      Error
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{provider.description}</p>
                {provider.lastSyncAt && (
                  <p className="text-xs text-slate-400 mt-1">
                    Last sync: {formatDate(provider.lastSyncAt)}
                  </p>
                )}
                {provider.error && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {provider.error}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {provider.status === 'connected' && (
                  <>
                    <button
                      onClick={() => handleSync(provider.id)}
                      disabled={isLoading}
                      className="p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition disabled:opacity-50"
                      title="Sync now"
                    >
                      <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDisconnect(provider.id)}
                      disabled={isLoading}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="Disconnect"
                    >
                      <Unlink className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {(provider.status === 'disconnected' || provider.status === 'error') && (
                  <button
                    onClick={() => handleConnect(provider.id)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                    Connect
                  </button>
                )}

                {provider.status === 'connecting' && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Help text */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl">
        <h4 className="font-medium text-slate-900 mb-2">About OAuth Connections</h4>
        <p className="text-sm text-slate-600">
          OAuth connections allow SecretaryOS to access your services securely. 
          Your credentials are encrypted and stored safely. You can revoke access 
          at any time from your service settings.
        </p>
      </div>
    </div>
  )
}
