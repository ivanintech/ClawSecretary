'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard,
  Brain,
  Clock,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  QrCode
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/activity', icon: Activity, label: 'Actividad' },
  { href: '/dashboard/routines', icon: Clock, label: 'Rutinas' },
  { href: '/dashboard/memory', icon: Brain, label: 'Memoria' },
  { href: '/dashboard/settings', icon: Settings, label: 'Ajustes' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const [deviceStatus, setDeviceStatus] = useState({
    connected: true,
    model: 'iPhone 15 Pro',
    battery: 78,
    signal: 'Excelente',
    secretaryActive: true,
    whatsappConnected: true,
    voiceWakeActive: true,
    backgroundRefresh: true
  })

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-slate-900">SecretaryOS</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            className="absolute right-0 top-0 bottom-0 w-72 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Menú</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    pathname === item.href
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r min-h-screen sticky top-0">
          <div className="p-6 border-b">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">SecretaryOS</span>
                <p className="text-xs text-slate-500">Tu assistant activo</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  pathname === item.href
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Device Status */}
          <div className="p-4 border-t">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">iPhone 15 Pro</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {deviceStatus.connected ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-slate-600">Conectado</span>
                </div>
                <div className="flex items-center gap-2">
                  {deviceStatus.secretaryActive ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-slate-600">Secretary activo</span>
                </div>
                <div className="flex items-center gap-2">
                  {deviceStatus.whatsappConnected ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-slate-600">WhatsApp ✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t">
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition">
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
