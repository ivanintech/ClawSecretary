'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings,
  User,
  Bell,
  Globe,
  CreditCard,
  Smartphone,
  Shield,
  LogOut,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Wifi,
  Loader2,
  Save
} from 'lucide-react'

const settingsSections = [
  {
    title: 'Cuenta',
    items: [
      { label: 'Perfil', icon: User, description: 'Tu información personal' },
      { label: 'Suscripción', icon: CreditCard, description: 'Plan y facturación' },
    ]
  },
  {
    title: 'Preferencias',
    items: [
      { label: 'Idioma', icon: Globe, description: 'Español' },
      { label: 'Zona horaria', icon: Globe, description: 'Europe/Madrid' },
      { label: 'Notificaciones', icon: Bell, description: 'Todas activas' },
    ]
  },
  {
    title: 'Seguridad',
    items: [
      { label: 'Privacidad', icon: Shield, description: 'Tus datos están protegidos' },
      { label: 'Cambiar contraseña', icon: Shield, description: 'Actualiza tu contraseña' },
    ]
  }
]

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    briefing: true,
    reminders: true,
    emails: true,
    meetings: true,
    whatsapp: true
  })
  
  const [gatewayUrl, setGatewayUrl] = useState('')
  const [gatewayLoading, setGatewayLoading] = useState(true)
  const [gatewaySaving, setGatewaySaving] = useState(false)
  const [gatewaySaved, setGatewaySaved] = useState(false)
  const [gatewayError, setGatewayError] = useState<string | null>(null)
  
  useEffect(() => {
    fetchGatewayUrl()
  }, [])
  
  const fetchGatewayUrl = async () => {
    setGatewayLoading(true)
    try {
      const res = await fetch('/api/profile/gateway')
      const data = await res.json()
      setGatewayUrl(data.gateway_url || '')
    } catch (err) {
      console.error('Failed to fetch gateway URL:', err)
    } finally {
      setGatewayLoading(false)
    }
  }
  
  const saveGatewayUrl = async () => {
    setGatewaySaving(true)
    setGatewayError(null)
    setGatewaySaved(false)
    
    try {
      const res = await fetch('/api/profile/gateway', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gatewayUrl })
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }
      
      setGatewaySaved(true)
      setTimeout(() => setGatewaySaved(false), 3000)
    } catch (err) {
      setGatewayError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setGatewaySaving(false)
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Settings className="w-8 h-8 text-brand-600" />
          Configuración
        </h1>
        <p className="text-slate-600 mt-1">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      {/* Profile Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-brand-600">JG</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Juan García</h2>
            <p className="text-slate-500">juan@techstart.io</p>
            <span className="inline-block mt-1 px-3 py-1 bg-brand-100 text-brand-700 text-sm font-medium rounded-full">
              Plan Pro
            </span>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-4 py-3 bg-slate-50 border-b">
              <h3 className="font-semibold text-slate-900">{section.title}</h3>
            </div>
            <div className="divide-y">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition text-left"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{item.label}</div>
                    <div className="text-sm text-slate-500">{item.description}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gateway Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mt-6"
      >
        <div className="px-4 py-3 bg-slate-50 border-b">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            OpenClaw Gateway
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-slate-600 mb-4">
            Configura la URL de tu gateway de OpenClaw para poder instalar SecretaryOS en tu móvil.
            La URL debe empezar con <code className="bg-slate-100 px-1 rounded">ws://</code> o <code className="bg-slate-100 px-1 rounded">wss://</code>.
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={gatewayUrl}
              onChange={(e) => {
                setGatewayUrl(e.target.value)
                setGatewaySaved(false)
              }}
              placeholder="wss://tu-gateway.com:18789"
              className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
              disabled={gatewayLoading}
            />
            <button
              onClick={saveGatewayUrl}
              disabled={gatewayLoading || gatewaySaving || !gatewayUrl}
              className="px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {gatewaySaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : gatewaySaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Guardado
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
          
          {gatewayError && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {gatewayError}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t">
            <a 
              href="/dashboard/settings/gateway" 
              className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Configuración avanzada del gateway
            </a>
          </div>
        </div>
      </motion.div>

      {/* Device / Install */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mt-6"
      >
        <div className="px-4 py-3 bg-slate-50 border-b">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Instalación Móvil
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-slate-600 mb-4">
            Instala SecretaryOS en tu móvil escaneando un código QR.
          </p>
          
          <a 
            href="/install" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition"
          >
            <Smartphone className="w-5 h-5" />
            Generar QR de instalación
          </a>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mt-6 border border-red-200"
      >
        <div className="px-4 py-3 bg-red-50 border-b border-red-200">
          <h3 className="font-semibold text-red-700">Zona de Peligro</h3>
        </div>
        <div className="p-4">
          <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
            <LogOut className="w-5 h-5" />
            Cerrar sesión en todos los dispositivos
          </button>
        </div>
      </motion.div>
    </div>
  )
}
