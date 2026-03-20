'use client'

import { useState } from 'react'
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
  ExternalLink
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
    title: 'Dispositivo',
    items: [
      { label: 'Estado', icon: Smartphone, description: 'iPhone 15 Pro - Conectado' },
      { label: 'Reinstalar app', icon: Smartphone, description: 'Generar nuevo código QR' },
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

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mt-6"
      >
        <div className="px-4 py-3 bg-slate-50 border-b">
          <h3 className="font-semibold text-slate-900">Notificaciones</h3>
        </div>
        <div className="divide-y">
          {[
            { key: 'briefing', label: 'Morning Briefing', description: 'Resumen diario a primera hora' },
            { key: 'reminders', label: 'Recordatorios', description: 'Cuando se cumplan tus recordatorios' },
            { key: 'emails', label: 'Emails importantes', description: 'Notificaciones de emails críticos' },
            { key: 'meetings', label: 'Cambios de reunión', description: 'Cuando alguien modifique una cita' },
            { key: 'whatsapp', label: 'WhatsApp', description: 'Canal principal de comunicación' },
          ].map((item) => (
            <div key={item.key} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">{item.label}</div>
                <div className="text-sm text-slate-500">{item.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={() => setNotifications(prev => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof notifications]
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Device Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mt-6"
      >
        <div className="px-4 py-3 bg-slate-50 border-b">
          <h3 className="font-semibold text-slate-900">Estado del Dispositivo</h3>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">iPhone 15 Pro</h4>
              <p className="text-sm text-slate-500">Última conexión: Hace 2 minutos</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-slate-600">Secretary activo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-slate-600">WhatsApp conectado</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-slate-600">Voice wake activo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-slate-600">Background ON</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <button className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium">
              <ExternalLink className="w-4 h-4" />
              Ver detalles en OpenClaw
            </button>
          </div>
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
