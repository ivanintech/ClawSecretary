'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Smartphone, 
  MessageSquare, 
  Clock, 
  Bell, 
  Zap, 
  Shield,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Menu,
  X,
  Play,
  Brain,
  Calendar,
  Mail,
  Coffee
} from 'lucide-react'
import { UseCasesSection } from '@/components/UseCasesSection'
import { DayTimelineSection } from '@/components/DayTimelineSection'
import { ComparisonSection } from '@/components/ComparisonSection'

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkMobile)
    checkMobile()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const features = [
    {
      icon: Clock,
      title: 'Funciona 24/7',
      description: 'Tu secretary trabaja en segundo plano, sin importar si tienes la app abierta o no.'
    },
    {
      icon: MessageSquare,
      title: 'Todo por WhatsApp',
      description: 'No necesitas aprender a usar nada nuevo. Habla con tu secretary como hablas con cualquier contacto.'
    },
    {
      icon: Bell,
      title: 'Proactivo',
      description: 'Te envía resúmenes, recordatorios y alertas antes de que las necesites.'
    },
    {
      icon: Zap,
      title: 'Instantáneo',
      description: 'Lánzalo con "Hey Secretary" y obtén ayuda en segundos.'
    },
    {
      icon: Shield,
      title: 'Privado',
      description: 'Tus datos se procesan en tu dispositivo. Nada se almacena en servidores externos.'
    },
    {
      icon: Brain,
      title: 'Te Conoce',
      description: 'Aprende tus preferencias y toma decisiones inteligentes por ti.'
    }
  ]

  const steps = [
    {
      number: '1',
      title: 'Regístrate',
      description: 'Crea tu cuenta en 30 segundos'
    },
    {
      number: '2',
      title: 'Instala',
      description: 'Escanea un QR con tu móvil'
    },
    {
      number: '3',
      title: 'Conecta WhatsApp',
      description: 'Vincúla tu número en minutos'
    },
    {
      number: '4',
      title: '¡Listo!',
      description: 'Tu secretary está activo'
    }
  ]

  const testimonials = [
    {
      quote: "Por fin tengo un assistant que de verdad me ahorra tiempo. No tengo que abrir nada, simplemente me llega la info que necesito.",
      author: "María G.",
      role: "CEO, TechStartup"
    },
    {
      quote: "El briefing matutino me cambió las mañanas. Llego a reuniones sabiendo exactamente qué tengo pendiente.",
      author: "Carlos R.",
      role: "Director Comercial"
    },
    {
      quote: "Mi secretary me recuerda cosas que yo olvidaría. Y lo hace por WhatsApp, que es donde ya estoy.",
      author: "Ana L.",
      role: "Freelance Designer"
    }
  ]

  const pricingPlans = [
    {
      name: 'Básico',
      price: '4.99',
      features: [
        'Morning briefing',
        'Recordatorios básicos',
        '5 comandos activos',
        '1 dispositivo'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: '9.99',
      features: [
        'Todo lo de Básico',
        'Evening summary',
        'Comandos ilimitados',
        'Memory bank',
        'Hasta 3 dispositivos',
        'Soporte prioritario'
      ],
      popular: true
    },
    {
      name: 'Teams',
      price: '24.99',
      features: [
        'Todo lo de Pro',
        'Compartición familiar',
        'Up to 6 dispositivos',
        'Integración calendario',
        'API access'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-lg text-slate-900">SecretaryOS</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition">Características</a>
              <a href="#how" className="text-slate-600 hover:text-slate-900 transition">Cómo funciona</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition">Precios</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-slate-600 hover:text-slate-900 transition font-medium">
                Iniciar sesión
              </Link>
              <Link 
                href={isMobile ? '/install' : '/register'} 
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
              >
                {isMobile ? 'Instalar app' : 'Empezar gratis'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-slate-600">Características</a>
              <a href="#how" className="block text-slate-600">Cómo funciona</a>
              <a href="#pricing" className="block text-slate-600">Precios</a>
              <Link href="/login" className="block text-slate-600">Iniciar sesión</Link>
              <Link href="/register" className="block bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium text-center">
                Empezar gratis
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-6">
              🚀 Nuevo: Installation en 60 segundos
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 text-balance">
              Tu asistente personal, 
              <span className="text-brand-600"> funcionando 24/7</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              No necesitas abrir ninguna app. Solo habla con él por WhatsApp 
              y él se encarga del resto. Briefing matutino, recordatorios, 
              coordinación de reuniones...
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={isMobile ? '/install' : '/register'}
                className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                {isMobile ? '📱' : '⚡'} {isMobile ? 'Instalar ahora' : 'Empezar gratis'}
                {!isMobile && <ArrowRight className="w-5 h-5" />}
              </Link>
              <a 
                href="#how"
                className="bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg transition border border-slate-200 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Ver cómo funciona
              </a>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative max-w-lg mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl shadow-brand-900/10 p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-600 font-bold">S</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Secretary</div>
                    <div className="text-sm text-slate-500">Activo ahora</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-100 rounded-xl p-4 text-sm text-slate-700">
                    Buenos días Juan! 👋
                    <br /><br />
                    📅 Tienes 3 reuniones hoy:
                    <br />
                    • 10:00 - Revisión Q4
                    <br />
                    • 15:00 - Llamada con investor
                    <br />
                    • 18:00 - Cena con Ana
                    <br /><br />
                    ⏰ Recordatorio: Llamar a mamá
                    <br /><br />
                    ¿Te preparo algo antes de la primera?
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-200 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-brand-100 rounded-full opacity-50 blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Todo lo que necesitas, nada que gestionar
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              SecretaryOS hace el trabajo pesado por ti. Instálalo una vez 
              y olvídate de gestión. Él se encarga de todo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition"
              >
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Day Timeline Section */}
      <DayTimelineSection />

      {/* NEW: Use Cases Section with WhatsApp */}
      <UseCasesSection />

      {/* How it Works */}
      <section id="how" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Instalación en minutos
            </h2>
            <p className="text-lg text-slate-600">
              No necesitas conocimientos técnicos. Solo tu teléfono y un código QR.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-1">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* QR Code Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-8 border border-slate-200"
          >
            <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center mb-4">
              <QrCode className="w-24 h-24 text-slate-400" />
            </div>
            <p className="text-center text-sm text-slate-500">
              Escanea este código con tu cámara para instalar
            </p>
          </motion.div>
        </div>
      </section>

      {/* NEW: Comparison Section */}
      <ComparisonSection />

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Lo que dicen nuestros usuarios
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl p-6"
              >
                <p className="text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple pricing
            </h2>
            <p className="text-lg text-slate-600">
              Sin sorpresas. Cancela cuando quieras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-brand-600 text-white ring-4 ring-brand-300 scale-105' 
                    : 'bg-white border border-slate-200'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-white text-brand-600 text-sm font-medium rounded-full mb-4">
                    Más popular
                  </span>
                )}
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    ${plan.price}
                  </span>
                  <span className={plan.popular ? 'text-brand-200' : 'text-slate-500'}>
                    /mes
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-5 h-5 ${plan.popular ? 'text-brand-200' : 'text-brand-500'}`} />
                      <span className={plan.popular ? 'text-brand-100' : 'text-slate-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 px-6 rounded-xl font-medium transition ${
                    plan.popular
                      ? 'bg-white text-brand-600 hover:bg-brand-50'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  Empezar con {plan.name}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-slate-500 mt-8">
            Todos los planes incluyen 14 días de prueba gratis. Sin tarjeta de crédito requerida.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Listo para tener tu propio secretary?
          </h2>
          <p className="text-xl text-brand-100 mb-8">
            Únete a miles de personas que ya han automatizado su día a día.
          </p>
          <Link
            href={isMobile ? '/install' : '/register'}
            className="inline-flex items-center gap-2 bg-white text-brand-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-50 transition"
          >
            {isMobile ? '📱' : '⚡'} {isMobile ? 'Instalar ahora' : 'Empezar gratis'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-white">SecretaryOS</span>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-white transition">Privacidad</a>
              <a href="#" className="hover:text-white transition">Términos</a>
              <a href="#" className="hover:text-white transition">Contacto</a>
            </div>
            <p className="text-sm">
              © 2024 SecretaryOS. Powered by OpenClaw.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
