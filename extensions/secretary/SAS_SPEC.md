# SecretaryOS - Product Specification

**Zero-touch AI secretary that runs 24/7 on your phone. No app to open. Everything through WhatsApp.**

---

## Product Philosophy

### The Problem
- Existing AI assistants require you to open an app and interact with them
- Most "personal assistants" need constant management
- Phone batteries die, apps get killed, integrations break

### The Solution
- **Invisible**: Installs once, runs forever, never need to open it
- **Proactive**: Sends you information before you ask
- **Natural**: Talk to it like a human via WhatsApp
- **Always On**: Survives app kills, runs in background

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              SecretaryOS                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     WEB (Full Interface)                          │   │
│   │   ├── Landing page (marketing, how it works, pricing)            │   │
│   │   ├── Login / Signup                                             │   │
│   │   ├── Billing (Stripe)                                           │   │
│   │   ├── Dashboard                                                  │   │
│   │   │   ├── What My Secretary Does (activity feed)                 │   │
│   │   │   ├── My Routines (config automation)                       │   │
│   │   │   ├── Memory Bank (personal context)                        │   │
│   │   │   ├── Quick Commands (WhatsApp cheatsheet)                  │   │
│   │   │   ├── Briefing Preview                                      │   │
│   │   │   └── Settings                                              │   │
│   │   └── Install Bridge (QR code for mobile installation)          │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                     │
│                                    │ WhatsApp                            │
│                                    ▼                                     │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     MOBILE (Zero UI)                             │   │
│   │   OpenClaw app running in background                            │   │
│   │   └── Secretary extension active                                │   │
│   │   └── Voice wake enabled                                        │   │
│   │   └── No user interaction required                              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Web Features

### 1. Landing Page

**Purpose**: Convert visitors into users. Explain value in 30 seconds.

**Sections**:
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [Logo]                                           [Login] [Start]     │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Tu asistente personal,                                              │
│  funcionando 24/7 en tu móvil.                                       │
│                                                                      │
│  No necesitas abrir ninguna app.                                     │
│  Solo habla con él por WhatsApp.                                     │
│                                                                      │
│  [Empezar Gratis]  [$9.99/mes]                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │ 📅               │  │ 🔔              │  │ 🤖              │      │
│  │                 │  │                 │  │                 │      │
│  │ Gestiona tu    │  │ Te notifica     │  │ Responde        │      │
│  │ calendario     │  │ lo importante   │  │ preguntas       │      │
│  │ automáticamente│  │ antes de que    │  │ y ejecuta       │      │
│  │                │  │ lo preguntes    │  │ tareas          │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Cómo funciona:                                                      │
│                                                                      │
│  ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐ │
│  │    1️⃣     │───▶│    2️⃣     │───▶│    3️⃣     │───▶│    4️⃣     │ │
│  │           │    │           │    │           │    │           │ │
│  │ Regístrate│    │ Escanea   │    │ Conecta   │    │ Listo!    │ │
│  │ 30 seg    │    │ QR en     │    │ WhatsApp  │    │ Olvídate  │ │
│  │           │    │ tu móvil  │    │           │    │ de la app │ │
│  └───────────┘    └───────────┘    └───────────┘    └───────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  "Necesito concertar una reunión con María la próxima       │   │
│  │   semana para revisar el proyecto. ¿Qué días tienes        │   │
│  │   disponibles?"                                             │   │
│  │                                                              │   │
│  │                    🤖 Secretary                               │   │
│  │   "He visto tu calendario. Tienes disponible:               │   │
│  │    - Martes 10:00-11:00                                     │   │
│  │    - Miércoles 15:00-16:00                                  │   │
│  │    - Jueves 9:00-10:00                                      │   │
│  │                                                              │   │
│  │    ¿Quieres que envíe la invitación?"                       │   │
│  │                                                              │   │
│  │   ✓ Enviada ✅                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Casos de Uso:                                                       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 🏢 Profesional                                              │   │
│  │    "Gestiona reuniones, recuerda follow-ups,                 │   │
│  │     resume emails importantes"                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 👨‍👩‍👧 Familia                                                 │   │
│  │    "Coordina actividades familiares, recuerda                │   │
│  │     cumpleaños, organiza viajes"                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 🚀 Emprendedor                                              │   │
│  │    "Gestiona múltiples proyectos, detecta                   │   │
│  │     oportunidades, optimiza tiempo"                         │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Preguntas Frecuentes:                                               │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ¿Necesito mantener la app abierta?                          │   │
│  │ NO. Secretary funciona en segundo plano.                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ¿Qué pasa con mi privacidad?                                │   │
│  │ Tus datos se procesan en tu dispositivo. No almacenamos      │   │
│  │ transcripciones ni contenido de mensajes.                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ ¿Funciona sin internet?                                     │   │
│  │ Algunas funciones offline, pero necesita conexión para        │   │
│  │ conectar con servicios externos.                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [$9.99/mes]  [Yearly: $89/year (save 25%) ]                        │
│                                                                      │
│  ✓ Sin compromiso  ✓ Cancela cuando quieras                        │
│                                                                      │
│  [Empezar Ahora]                                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Dashboard

**Purpose**: Show what Secretary has done, configure routines, manage settings.

```
┌─────────────────────────────────────────────────────────────────────┐
│  SecretaryOS                    [👤 Juan]  [⚙️]  [🚪 Logout]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Buenos días, Juan                                                   │
│  Tu secretary ha estado activo                                      │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📊 Resumen de Hoy                     [Descargar QR] [Inst. App]  │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  📧 12 emails procesados                                        ││
│  │  📅 3 reuniones coordinadas                                     ││
│  │  ⏰ 5 recordatorios enviados                                     ││
│  │  💬 28 mensajes gestionados                                      ││
│  │  🤖 47 acciones automatizadas                                    ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📋 Actividad Reciente                                               │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │ 09:45  ✓ Reunion confirmada con Carlos - Mañana 10:00          ││
│  │ 09:30  ✓ Briefing matutino enviado                              ││
│  │ 09:15  ✓ Recordatorio: Llamar a mamá                            ││
│  │ 08:00  📬 Resumen emails: 12 nuevos, 3 importantes              ││
│  │ 07:55  ⏰ Alarma: Día de recoger trajes en tintorería           ││
│  │ 07:50  🌤️ Buenos días! Tengo tu día: 3 reuniones, 2 pendientes ││
│  └─────────────────────────────────────────────────────────────────┘│
│  [Ver más actividad →]                                              │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🌅 Mis Rutinas                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  ┌─────────────────────┐  ┌─────────────────────┐              ││
│  │  │ ☀️ Morning Briefing │  │ 🌙 Evening Summary   │              ││
│  │  │ 07:50               │  │ 21:00               │              ││
│  │  │ [✓] Activo          │  │ [✓] Activo          │              ││
│  │  │ [Editar] [Ver]      │  │ [Editar] [Ver]      │              ││
│  │  └─────────────────────┘  └─────────────────────┘              ││
│  │                                                                  ││
│  │  ┌─────────────────────┐  ┌─────────────────────┐              ││
│  │  │ 📧 Email Digest     │  │ 📞 Follow-ups       │              ││
│  │  │ Cada hora           │  │ Cuando expire plazo │              ││
│  │  │ [✓] Activo          │  │ [ ] Inactivo       │              ││
│  │  │ [Editar] [Ver]      │  │ [Editar] [Ver]      │              ││
│  │  └─────────────────────┘  └─────────────────────┘              ││
│  │                                                                  ││
│  │  [+ Nueva Rutina]                                               ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🧠 Mi Banco de Memoria                                              │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Secretary recuerda estas cosas sobre ti:                        ││
│  │                                                                  ││
│  │  👤 Soy Juan, CEO de TechStart                                  ││
│  │  📧 Email principal: juan@techstart.io                           ││
│  │  🏠 Vivo en Madrid                                              ││
│  │  👶 Hijos: Lucía (8) y Pablo (5)                                ││
│  │  🏃 Ejercicio: Lunes y Miércoles 7:00                           ││
│  │  ☕ No bebo café                                                ││
│  │  ... 12 elementos más                                           ││
│  │                                                                  ││
│  │  [+ Añadir información]  [Editar]                               ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  💬 Comandos Rápidos (WhatsApp)                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  " resumen del día "           → Resumen actividad              ││
│  │  " coordina reunion "          → Agenda automáticamente         ││
│  │  " recordatorio a las 3 "      → Crea recordatorio              ││
│  │  " mi proxima cita "          → Muestra siguiente evento       ││
│  │  " llama a [nombre] "         → Inicia llamada                 ││
│  │  " traduce al ingles "        → Traduce último mensaje         ││
│  │                                                                  ││
│  │  [+ Ver todos los comandos]                                     ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📱 Estado del Dispositivo                                           │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  ┌─────────────────┐                                          ││
│  │  │ 📱 iPhone 15 Pro │  ✓ Conectado                              ││
│  │  │ ⚡ Batería: 78%  │  ✓ Secretary activo                      ││
│  │  │ 📶 Señal: Excel. │  ✓ WhatsApp vinculado                     ││
│  │  │                  │  ✓ Voice wake activo                      ││
│  │  │ [Ver detalles]   │  ✓ Background refresh ON                   ││
│  │  └─────────────────┘                                           ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ⚙️ Configuración                                                    │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Lenguaje          Español          →                        ││
│  │  Zona horaria      Europe/Madrid     →                        ││
│  │  Modo proactivo    Completo         →                        ││
│  │  Notificaciones    Todas            →                        ││
│  │  Canal             WhatsApp         →                        ││
│  │  Billing           Pro Plan         →                        ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3. Memory Bank

**Purpose**: User teaches Secretary about themselves for better personalization.

```
┌─────────────────────────────────────────────────────────────────────┐
│  🧠 Banco de Memoria                                      [Guardar] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Cuéntale a Secretary cosas sobre ti.                               │
│  Las usará para dar respuestas más personalizadas.                   │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 👤 Sobre Mí                                                   │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ Me llamo Juan García, tengo 35 años                      │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ Soy CEO de TechStart, una startup de SaaS B2B            │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ [+ Añadir]                                                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 👨‍👩‍👧 Familia                                                   │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ Mi mujer se llama Ana, trabaja como médica               │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ Tenemos dos hijos: Lucía (8 años) y Pablo (5 años)        │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ [+ Añadir]                                                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🎯 Preferencias                                                │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ Prefiero reuniones por la mañana                          │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ No bebo alcohol, no cafe                                  │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ [+ Añadir]                                                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 📍 Ubicación                                                  │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ Vivo en Chamberí, Madrid                                  │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ Trabajo en Madrid centro, Torre Picasso                   │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ [+ Añadir]                                                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ ⏰ Disponibilidad                                              │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ Ejercicio: Lunes y Miércoles 7:00-8:00                   │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ ┌───────────────────────────────────────────────────────────┐ │ │
│  │ │ Reuniones: Preferiblemente 10:00-12:00 y 16:00-18:00      │ │ │
│  │ └───────────────────────────────────────────────────────────┘ │ │
│  │ [+ Añadir]                                                    │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4. Routines Editor

**Purpose**: Configure automated routines that run at specific times or triggers.

```
┌─────────────────────────────────────────────────────────────────────┐
│  🌅 Editar Rutina: Morning Briefing                        [Guardar]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Activar    [✓]                                                 │ │
│  │  Hora       [07:50]                                             │ │
│  │  Días       [L] [M] [X] [J] [V] [ ] [ ]                         │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Contenido del Briefing:                                             │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ ☑️ Saludo personalizado                                          │ │
│  │ ☑️ Clima actual de Madrid                                        │ │
│  │ ☑️ Resumen del calendario del día                                │ │
│  │ ☑️ Recordatorios activos                                        │ │
│  │ ☑️ Emails importantes (últimas 24h)                              │ │
│  │ ☑️ Tareas pendientes                                             │ │
│  │ ☐️ News headlines                                               │ │
│  │ ☐️ Crypto/bolsa                                                  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  Preview:                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ 🤖 Secretary                                                    │ │
│  │                                                                  │ │
│  │ Buenos días Juan! 👋                                            │ │
│  │                                                                  │ │
│  │ 📅 HOY:                                                         │ │
│  │ • 10:00 - Llamada con Carlos                                    │ │
│  │ • 15:00 - Reunión equipo TechStart                              │ │
│  │ • 18:00 - Cena con Ana                                         │ │
│  │                                                                  │ │
│  │ ⏰ RECORDATORIOS:                                               │ │
│  │ • Llamar a mamá (pendiente desde ayer)                          │ │
│  │ • Enviar factura TechStart (hoy)                                │ │
│  │                                                                  │ │
│  │ 📧 IMPORTANTE:                                                  │ │
│  │ • Nuevo email de investor (requires response)                     │ │
│  │                                                                  │ │
│  │ 🌤️ Madrid: 18°C, soleado                                        │ │
│  │                                                                  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  [Eliminar Rutina]                                                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 5. Install Bridge

**Purpose**: Generate QR code for easy mobile installation.

```
┌─────────────────────────────────────────────────────────────────────┐
│  📱 Instalar en tu Móvil                                   [← Volver]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. Abre la cámara de tu teléfono                                    │
│                                                                      │
│  2. Escanea este código QR                                           │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                                                                  │ │
│  │                    ████████████████████                        │ │
│  │                    ██                  ██                        │ │
│  │                    ██  ████    ████    ██                        │ │
│  │                    ██  ████    ████    ██                        │ │
│  │                    ██                  ██                        │ │
│  │                    ██  ██  ████  ██    ██                        │ │
│  │                    ██  ██  ████  ██    ██                        │ │
│  │                    ██                  ██                        │ │
│  │                    ████████████████████                        │ │
│  │                                                                  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  ⏱️ Este código expira en 14:32                                  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  [🔄 Generar nuevo código]                                           │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ¿No funciona el QR?                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  https://secretaryos.app/install/a1b2c3d4                       │ │
│  │  [Copiar enlace]                                                │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📋 Pasos de instalación:                                             │
│                                                                      │
│  1. 📲 Abre el enlace en tu móvil                                   │
│  2. ⬇️  Descarga OpenClaw (si no lo tienes)                        │
│  3. 🔐 Autoriza permisos necesarios                                 │
│  4. 📱 Secretary se configura automáticamente                        │
│  5. ✅ ¡Listo! Recibirás tu primer briefing                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Mobile Experience (Zero UI)

### What Happens on Phone

After installation, the phone runs completely autonomously:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  NO HAY NADA QUE ABRIR.                                              │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │  OpenClaw está funcionando en segundo plano                  │     │
│  │                                                              │     │
│  │  📱 iPhone                                                    │     │
│  │  ├── Secretary extension ✓                                   │     │
│  │  ├── Voice wake listening ✓                                  │     │
│  │  ├── WhatsApp connected ✓                                    │     │
│  │  └── Gateway linked ✓                                        │     │
│  │                                                              │     │
│  │  El usuario recibe un WhatsApp:                              │     │
│  │                                                              │     │
│  │  ┌─────────────────────────────────────────────────────────┐│     │
│  │  │ 🤖 Secretary                                             ││     │
│  │  │                                                          ││     │
│  │  │ Buenos días Juan!                                        ││     │
│  │  │                                                          ││     │
│  │  │ 📅 Tienes 2 reuniones hoy:                               ││     │
│  │  │ • 10:00 - Revisión Q4 con equipo                       ││     │
│  │  │ • 15:00 - Llamada con investor                          ││     │
│  │  │                                                          ││     │
│  │  │ ¿Te preparo un resumen antes de la primera?             ││     │
│  │  │                                                          ││     │
│  │  │ [Sí, prepara el resumen]  [No gracias]                  ││     │
│  │  └─────────────────────────────────────────────────────────┘│     │
│  │                                                              │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Voice Wake

User can say "Hey Secretary" and speak naturally:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Usuario (voz):                                                      │
│  "Hey Secretary, necesito concertar una reunión con María para        │
│   revisar el presupuesto del proyecto la próxima semana"            │
│                                                                      │
│  Secretary procesa y responde:                                       │
│                                                                      │
│  🤖 Secretary:                                                       │
│  "Perfecto. He revisado tu calendario y tienes disponible:          │
│                                                                      │
│   • Martes 15:00-16:00                                              │
│   • Miércoles 10:00-11:00                                           │
│   • Jueves 16:00-17:00                                              │
│                                                                      │
│   ¿Cuál prefieres? También puedo enviar una invitación              │
│   provisional a maria@email.com para que ella elija."                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## WhatsApp Commands

### Proactive Notifications (Secretary sends)

| Notificación | Cuándo |
|--------------|--------|
| 🌅 Morning Briefing | Cada día a la hora configurada |
| 📧 Resumen emails | Cada hora (configurable) |
| ⏰ Recordatorio | Cuando lo creaste |
| 📅 Cambio de reunión | Cuando alguien modifica una cita |
| 🎂 Cumpleaños | Un día antes |
| 📈 Alerta importante | Cuando detecta algo que requiere tu atención |

### Reactive Commands (User sends)

| Comando | Ejemplo | Resultado |
|---------|---------|-----------|
| `resumen` | "resumen del día" | Lista de actividad del día |
| `reunión` | "coordina reunión con Carlos" | Secretary inicia proceso |
| `recordatorio` | "recuérdame llamar a mamá en 2 horas" | Crea recordatorio |
| `busca` | "busca información sobre..." | Busca y resume web |
| `traduce` | "traduce esto al inglés" | Traduce texto |
| `resumen emails` | "resumen emails importantes" | Top emails de la semana |
| `mi agenda` | "qué tengo mañana" | Muestra calendario |
| `llama` | "llama a Juan" | Inicia llamada |
| `tarea` | "anota: comprar leche" | Añade a lista |
| `ayuda` | "qué puedes hacer" | Lista de comandos |

---

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Auth**: NextAuth.js + Supabase
- **Payments**: Stripe Checkout
- **UI Components**: shadcn/ui

### Backend
- **Runtime**: Next.js API Routes
- **Database**: Supabase (Postgres)
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Push**: Expo Notifications (if native) or WhatsApp only

### Mobile Integration
- **iOS**: OpenClaw app with deep links
- **Android**: OpenClaw app with app links
- **Universal Links**: `https://secretaryos.app/...`

---

## API Endpoints

### Authentication
```
POST   /api/auth/signup          - Create account
POST   /api/auth/login           - Login
POST   /api/auth/logout          - Logout
GET    /api/auth/me              - Get current user
```

### Installation
```
POST   /api/install/generate-qr  - Generate QR token
POST   /api/install/claim        - Claim installation
GET    /api/install/status        - Check installation status
```

### User Data
```
GET    /api/user/config           - Get user configuration
PUT    /api/user/config           - Update configuration
GET    /api/user/memory           - Get memory bank
PUT    /api/user/memory           - Update memory bank
GET    /api/user/routines         - Get routines
PUT    /api/user/routines         - Update routines
```

### Activity
```
GET    /api/activity              - Get recent activity
GET    /api/activity/stats        - Get activity statistics
```

### Billing
```
POST   /api/billing/create-checkout  - Create Stripe checkout
POST   /api/billing/webhook         - Stripe webhook
GET    /api/billing/subscription    - Get current subscription
POST   /api/billing/cancel          - Cancel subscription
```

---

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
  createdAt: Date;
  
  // Device
  deviceId?: string;
  deviceType?: 'ios' | 'android';
  installStatus: 'pending' | 'installed';
  
  // Config
  config: UserConfig;
  memory: MemoryItem[];
  routines: Routine[];
}

interface UserConfig {
  language: string;
  timezone: string;
  briefingTime: string; // "07:50"
  proactiveMode: 'full' | 'minimal' | 'off';
  notificationLevel: 'all' | 'critical' | 'none';
}

interface MemoryItem {
  id: string;
  category: 'personal' | 'family' | 'preferences' | 'work' | 'location';
  content: string;
  createdAt: Date;
}

interface Routine {
  id: string;
  name: string;
  type: 'morning' | 'evening' | 'periodic' | 'trigger';
  enabled: boolean;
  schedule?: {
    time: string;
    days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  };
  content: RoutineContent;
}

interface RoutineContent {
  greeting?: boolean;
  weather?: boolean;
  calendar?: boolean;
  reminders?: boolean;
  emails?: boolean;
  tasks?: boolean;
  news?: boolean;
  custom?: string;
}
```

### Activity
```typescript
interface Activity {
  id: string;
  userId: string;
  type: 'briefing' | 'reminder' | 'email' | 'meeting' | 'action' | 'notification';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}
```

---

## Security

1. **Token Security**
   - QR tokens expire in 15 minutes
   - Single-use tokens
   - JWT with short expiry for API auth

2. **Data Privacy**
   - User data encrypted at rest
   - No content stored in plain text
   - Memory bank is user-controlled

3. **Device Security**
   - Device binding for installation tokens
   - Rate limiting on API endpoints
   - HTTPS only

---

## Success Metrics

- **Installation → Active**: 80%+ complete installation
- **Time to First Briefing**: < 5 minutes average
- **Command Usage**: > 10 commands/week per active user
- **Retention**: > 70% monthly active users after 30 days
- **Support Tickets**: < 5% of installs generate a ticket

---

## Implementation Phases

### Phase 1: Core (MVP)
- Landing page with device detection
- Auth (email/password)
- Stripe integration
- QR generation
- Mobile installation flow
- Basic WhatsApp commands
- Morning briefing

### Phase 2: Intelligence
- Memory bank
- Email integration
- Calendar sync (Google/Outlook)
- Smart scheduling
- Activity feed

### Phase 3: Automation
- Custom routines
- Periodic summaries
- Task management
- Contact management

### Phase 4: Polish
- Voice commands
- Family sharing
- Advanced analytics
- Mobile dashboard (read-only status)

---

## Notes

- Mobile app is **OpenClaw** - no custom app needed
- SecretaryOS is a **service/wrapper** around OpenClaw
- User pays for convenience of auto-install + pre-configured secretary
- WhatsApp is the **only interface** on mobile
- Web dashboard is for **configuration and monitoring**, not daily use
