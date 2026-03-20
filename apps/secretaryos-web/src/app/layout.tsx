import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'SecretaryOS - Tu asistente personal 24/7',
  description: 'Un asistente de IA que corre 24/7 en tu móvil. Todo por WhatsApp.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
