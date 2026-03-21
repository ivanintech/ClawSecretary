'use client'

import { useEffect, useState } from 'react'
import { Camera, Smartphone, CheckCircle, Loader2, QrCode, Shield } from 'lucide-react'

export default function MobileSetupPage() {
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [setupStatus, setSetupStatus] = useState<'idle' | 'installing' | 'ready' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    
    setIsStandalone(isStandalone)

    if (!isStandalone) {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
      })
    }

    const savedConfig = localStorage.getItem('secretaryos_config')
    if (savedConfig) {
      setSetupStatus('ready')
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  const handleScanQR = () => {
    setShowQRScanner(true)
  }

  const handleQRScan = (data: string) => {
    try {
      const config = JSON.parse(atob(data))
      
      if (!config.bridgeUrl || !config.encryptedSession) {
        throw new Error('Invalid QR code')
      }

      localStorage.setItem('secretaryos_config', JSON.stringify(config))
      setScannedData(data.substring(0, 50) + '...')
      setSetupStatus('installing')
      
      setTimeout(() => {
        setSetupStatus('ready')
      }, 2000)
    } catch {
      setError('QR code inválido. Asegúrate de escanear el código de setup.')
      setSetupStatus('error')
    }
  }

  const clearSetup = () => {
    localStorage.removeItem('secretaryos_config')
    setSetupStatus('idle')
    setScannedData(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold">SecretaryOS</h1>
          <p className="text-slate-400 mt-2">Tu secretary privado en tu teléfono</p>
        </div>

        {!isStandalone && (
          <div className="bg-slate-800 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <span className="font-medium">Instala la app</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">
              Añade SecretaryOS a tu pantalla de inicio para una mejor experiencia
            </p>
            {deferredPrompt && (
              <button
                onClick={handleInstall}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl transition"
              >
                Añadir a Inicio
              </button>
            )}
          </div>
        )}

        {setupStatus === 'idle' && (
          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <QrCode className="w-5 h-5 text-green-400" />
              <span className="font-medium">Escanea el código QR</span>
            </div>
            <p className="text-sm text-slate-400 mb-3">
              Abre SecretaryOS en tu ordenador y genera el código QR de setup
            </p>
            <button
              onClick={handleScanQR}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Escanear QR
            </button>
          </div>
        )}

        {setupStatus === 'installing' && (
          <div className="bg-slate-800 rounded-2xl p-6 text-center">
            <Loader2 className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold mb-2">Configurando...</h2>
            <p className="text-slate-400">Guardando tu configuración segura</p>
          </div>
        )}

        {setupStatus === 'ready' && (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">¡Listo!</h2>
              <p className="text-slate-400">
                SecretaryOS está configurado y listo para usar
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4">
              <h3 className="font-medium mb-3">Estado</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bridge</span>
                  <span className="text-green-400">Conectado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">WhatsApp</span>
                  <span className="text-yellow-400">Pendiente</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">LLM Local</span>
                  <span className="text-slate-400">No instalado</span>
                </div>
              </div>
            </div>

            <button
              onClick={clearSetup}
              className="w-full py-3 border border-slate-600 text-slate-400 font-medium rounded-xl transition hover:bg-slate-800"
            >
              Reiniciar setup
            </button>
          </div>
        )}

        {setupStatus === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <p className="text-red-400 text-center mb-3">{error}</p>
            <button
              onClick={() => setSetupStatus('idle')}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition"
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {showQRScanner && (
          <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Escanea el QR</h2>
              <button
                onClick={() => setShowQRScanner(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center bg-slate-800 m-4 rounded-2xl">
              <div className="text-center p-8">
                <QrCode className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">
                  Apunta la cámara al código QR de setup
                </p>
                <input
                  type="text"
                  placeholder="O pega el código aquí"
                  className="mt-4 w-full px-4 py-3 bg-slate-700 rounded-xl text-white placeholder-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleQRScan((e.target as HTMLInputElement).value)
                    }
                  }}
                />
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="mt-4 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-slate-500 text-xs mt-8">
          Privacidad primero • Todo funciona offline
        </p>
      </div>
    </div>
  )
}
