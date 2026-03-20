# SecretaryOS - Zero-Touch Installation Flow

## El Flujo Completo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  FASE 1: REGISTRO WEB                                                  │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  👤 Usuario entra a secretaryos.app                                     │
│       ↓                                                                  │
│  🌐 Formulario: Email + Número WhatsApp                              │
│       ↓                                                                  │
│  📱 Generamos QR de WhatsApp Web (nosotros)                           │
│       ↓                                                                  │
│  👤 Usuario escanea con SU WhatsApp (1 única vez)                      │
│       ↓                                                                  │
│  💾 Guardamos sesión WhatsApp cifrada en nuestros servidores            │
│       ↓                                                                  │
│  📧 Enviamos email con QR de instalación SecretaryOS                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

                                 ↓

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  FASE 2: INSTALACIÓN ZERO-TOUCH (El usuario solo escanea)           │
│  ────────────────────────────────────────────────────────────────────   │
│                                                                          │
│  1️⃣  Usuario escanea QR del email                                   │
│                                                                          │
│  2️⃣  Teléfono recibe:                                                │
│       ┌─────────────────────────────────────────────────────────┐     │
│       │  📱 App OpenClaw se abre (o descarga si no existe)       │     │
│       │  🔐 Auth con bridge.server                                   │     │
│       │  🔑 Recibe sesión WhatsApp pre-autenticada                 │     │
│       │  💬 Conecta WhatsApp SILENCIOSAMENTE (sin QR extra)       │     │
│       │  ⬇️ Descarga modelo quantizado (~3GB, background)          │     │
│       │  📦 Instala Secretary extension                              │     │
│       └─────────────────────────────────────────────────────────┘     │
│                                                                          │
│  3️⃣  Progress en WhatsApp:                                          │
│       "🔧 Instalando SecretaryOS..."                                 │
│       "⬇️ Modelo: 45%..."                                           │
│       "📦 Extensión: Instalando..."                                   │
│       "💬 WhatsApp: Conectado"                                       │
│                                                                          │
│  4️⃣  ✅ "¡SecretaryOS listo!"                                       │
│                                                                          │
│  5️⃣  📱 Primer mensaje de Secretary:                                │
│       "¡Hola! Soy tu Secretary..."                                    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Detalle Técnico por Componente

### 1. Pre-Auth Service (WhatsApp)

```
┌─────────────────────────────────────────────────────────────────┐
│  WHATSAPP PRE-AUTH SERVICE                                     │
│                                                                  │
│  Objetivo: Conectar WhatsApp Web ANTES de que el usuario       │
│  instale la app                                                │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Flujo:                                                 │  │
│  │                                                          │  │
│  │  1. Usuario da su número en web                        │  │
│  │  2. Generamos QR de WhatsApp Web                       │  │
│  │  3. Usuario escanea con su WhatsApp (1 vez)           │  │
│  │  4. Baileys conecta y obtenemos sesión                │  │
│  │  5. Guardamos sesión cifrada (AES-256)               │  │
│  │  6. Asociamos sesión a user_id                        │  │
│  │  7. Generamos installation QR                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Almacenamiento (cifrado):                                      │
│  • Session tokens de WhatsApp                                    │
│  • Device identity                                              │
│  • NO mensajes, NO contactos, NO media                        │
│                                                                  │
│  Security:                                                       │
│  • Sesiones cifradas en disco                                  │
│  • Rotación automática de claves                                │
│  • Caducidad de sesiones (30 días)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Installation QR Generator

```
┌─────────────────────────────────────────────────────────────────┐
│  INSTALLATION QR GENERATOR                                     │
│                                                                  │
│  Formato del QR:                                               │
│  ─────────────────                                             │
│  {                                                             │
│    "type": "secretaryos_install",                            │
│    "version": "1.0",                                         │
│    "userId": "usr_abc123xyz",                               │
│    "bridge": {                                               │
│      "url": "wss://bridge.secretaryos.app",                  │
│      "token": "bridg_tok_xxx"                               │
│    },                                                         │
│    "whatsapp": {                                            │
│      "sessionId": "wa_sess_xxx",                            │
│      "encryptedSession": "base64_encrypted_session"           │
│    },                                                         │
│    "expires": "2026-03-21T00:00:00Z",                      │
│    "signature": "hmac_sha256"                                │
│  }                                                             │
│                                                                  │
│  → QR codificado en base64                                     │
│  → Tamaño típico: ~500-800 caracteres                         │
│  → Escaneable en < 1 segundo                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Mobile App (OpenClaw + Secretary)

```
┌─────────────────────────────────────────────────────────────────┐
│  MOBILE APP (OpenClaw + Secretary)                            │
│                                                                  │
│  Al recibir installation QR:                                   │
│  ───────────────────────────────────                           │
│                                                                  │
│  1. PARSE QR                                                 │
│     └─→ Extrae userId, bridge URL, whatsapp session           │
│                                                                  │
│  2. AUTH CON BRIDGE                                          │
│     └─→ POST /install/verify con bridging token              │
│     └─→ Bridge responde con config + download URLs            │
│                                                                  │
│  3. DOWNLOAD MODEL (background)                              │
│     ├─→ URL: https://models.secretaryos.app/llm-q4.tar.gz  │
│     ├─→ Tamaño: ~3GB                                       │
│     ├─→ Progress: Notifica via WhatsApp                     │
│     └─→ Checksum verification                                │
│                                                                  │
│  4. INSTALL EXTENSIONS                                       │
│     ├─→ Secretary extension                                  │
│     ├─→ WhatsApp channel                                    │
│     └─→ Required capabilities                              │
│                                                                  │
│  5. RESTORE WHATSAPP SESSION                                │
│     ├─→ Decrypt session with local key                       │
│     ├─→ Connect to WhatsApp servers                         │
│     └─→ Verify connection                                   │
│                                                                  │
│  6. FIRST BOOT                                              │
│     └─→ Send welcome message via WhatsApp                   │
│     └─→ Register device with bridge                          │
│     └─→ Start heartbeat                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Bridge Server

```
┌─────────────────────────────────────────────────────────────────┐
│  BRIDGE SERVER                                                 │
│                                                                  │
│  Responsabilidades:                                             │
│  ────────────────                                              │
│                                                                  │
│  📡 WebSocket Relay                                            │
│     • Mantiene conexión persistente con phones                 │
│     • Routing de mensajes por userId                           │
│     • Reconnection con exponential backoff                     │
│     • Heartbeat para detectar offline                         │
│                                                                  │
│  🔐 Session Management                                        │
│     • Almacena sesiones WhatsApp cifradas                    │
│     • Proporciona sesiones a phones para restore             │
│     • Rotación de claves                                     │
│     • Revocación de sesiones                                  │
│                                                                  │
│  📊 Metrics (NO mensajes)                                     │
│     • message_count                                          │
│     • session_duration                                       │
│     • errors                                                 │
│     • online_time                                           │
│                                                                  │
│  🚨 Notifications (fallback)                                 │
│     • Push notification si phone offline                      │
│     • Email fallback                                         │
│                                                                  │
│  Lo que NO hace:                                             │
│  ──────────────────                                          │
│  ❌ Lee mensajes                                             │
│  ❌ Almacena conversaciones                                  │
│  ❌ Procesa contenido                                        │
│  ❌ Accede a embeddings                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Roadmap de Implementación

### Fase 0: Fundamentos (Semana 1-2)

**Objetivo:** Infraestructura base y Pre-Auth de WhatsApp

| Task | Descripción | Entregable |
|------|-------------|------------|
| 0.1 | Crear repo `secretary-bridge` | Repo en GitHub |
| 0.2 | Setup PostgreSQL schema | Tablas: users, sessions, metrics |
| 0.3 | Implementar Pre-Auth WhatsApp | Servicio que conecta WhatsApp Web |
| 0.4 | Sistema de cifrado de sesiones | AES-256-GCM |
| 0.5 | API de generación de installation QR | `/api/install/generate` |

**Definición de terminado:**
- [ ] Podemos conectar WhatsApp Web programáticamente
- [ ] Sesiones se guardan cifradas
- [ ] QR de instalación se genera correctamente

---

### Fase 1: Bridge Server MVP (Semana 3-4)

**Objetivo:** Bridge funcional que retransmite mensajes

| Task | Descripción | Entregable |
|------|-------------|------------|
| 1.1 | WebSocket server básico | ws://localhost:8080 |
| 1.2 | Auth de phones con JWT | Tokens de sesión |
| 1.3 | Routing de mensajes | Por userId |
| 1.4 | Reconnection handling | Exponential backoff |
| 1.5 | Session restore endpoint | `/session/restore` |

**Definición de terminado:**
- [ ] Phone puede conectar via WebSocket
- [ ] Phone puede restaurar sesión WhatsApp
- [ ] Mensajes pasan sin almacenarse

---

### Fase 2: Mobile App Updates (Semana 5-6)

**Objetivo:** OpenClaw app puede instalarse silenciosamente

| Task | Descripción | Entregable |
|------|-------------|------------|
| 2.1 | Parse installation QR | Detectar tipo "secretaryos_install" |
| 2.2 | Auth con bridge | Conexión WebSocket |
| 2.3 | Download manager | Descarga con progress |
| 2.4 | Model installer | Descompresión, verificación |
| 2.5 | Session restore | Conectar WhatsApp automáticamente |

**Definición de terminado:**
- [ ] App procesa installation QR
- [ ] Modelo se descarga en background
- [ ] WhatsApp conecta sin QR extra

---

### Fase 3: Progress Notifications (Semana 7)

**Objetivo:** UX de instalación transparente

| Task | Descripción | Entregable |
|------|-------------|------------|
| 3.1 | Progress via WhatsApp | "⬇️ Modelo: 45%" |
| 3.2 | Status updates | Errores, éxito |
| 3.3 | Welcome message | Primer briefing |
| 3.4 | Installation complete | Notificación final |

**Definición de terminado:**
- [ ] Usuario ve progreso en WhatsApp
- [ ] Recibe mensaje de bienvenida
- [ ] Sabe cuándo está listo

---

### Fase 4: Dashboard + Auth Flow (Semana 8-9)

**Objetivo:** Web completo para registro e instalación

| Task | Descripción | Entregable |
|------|-------------|------------|
| 4.1 | Landing page actualizada | Messaging privacy-first |
| 4.2 | Formulario registro | Email + WhatsApp |
| 4.3 | WhatsApp QR flow | Pre-auth UI |
| 4.4 | Email con installation QR | Templating + envío |
| 4.5 | Dashboard básico | Estado de conexión |

**Definición de terminado:**
- [ ] Usuario puede registrarse
- [ ] Recibe email con QR
- [ ] Ve estado en dashboard

---

### Fase 5: Secretary Extension + Briefing (Semana 10-11)

**Objetivo:** Secretary extension funciona en mobile

| Task | Descripción | Entregable |
|------|-------------|------------|
| 5.1 | Secretary extension en mobile | Hooks, memory, briefing |
| 5.2 | Morning briefing cron | 8:00 AM automático |
| 5.3 | Calendar sync | Eventos locales |
| 5.4 | First briefing | "Buenos días" template |

**Definición de terminado:**
- [ ] Secretary responde a mensajes
- [ ] Briefing se envía cada mañana
- [ ] Memorias se guardan localmente

---

### Fase 6: Testing + Bug Fixes (Semana 12)

**Objetivo:** Estabilidad para beta

| Task | Descripción | Entregable |
|------|-------------|------------|
| 6.1 | Alpha testing interno | 5 usuarios |
| 6.2 | Bug fixing round 1 | Issues críticos |
| 6.3 | Alpha testing extendido | 20 usuarios |
| 6.4 | Bug fixing round 2 | Issues menores |
| 6.5 | Performance optimization | Latencia < 1s |

**Definición de terminado:**
- [ ] 50+ installs exitosos
- [ ] 0 crashes críticos
- [ ] Latencia promedio < 1s

---

### Fase 7: Beta Launch (Semana 13-14)

**Objetivo:** Primeros clientes reales

| Task | Descripción | Entregable |
|------|-------------|------------|
| 7.1 | Landing page beta | secretaryos.app |
| 7.2 | Waitlist signup | Formulario interés |
| 7.3 | Onboarding flow | UX optimizado |
| 7.4 | Support setup | Discord + docs |
| 7.5 | Billing basic | Stripe integration |

**Definición de terminado:**
- [ ] 100 waitlist signups
- [ ] 20 installs en beta
- [ ] NPS > 40

---

## Arquitectura Detallada de Componentes

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  SECRETARYOS STACK                                                       │
│  ─────────────────                                                       │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  FRONTEND (Next.js)                                              │   │
│  │  ────────────────────────                                       │   │
│  │                                                                  │   │
│  │  Pages:                                                         │   │
│  │  • / (Landing - privacy messaging)                              │   │
│  │  • /register (Email + WhatsApp pre-auth)                       │   │
│  │  • /install (QR display)                                       │   │
│  │  • /dashboard (Status, config)                                  │   │
│  │                                                                  │   │
│  │  Components:                                                    │   │
│  │  • WhatsAppQRFlow (Pre-auth UI)                                │   │
│  │  • InstallationProgress                                         │   │
│  │  • DeviceStatus                                                 │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  API LAYER (Next.js API Routes)                                 │   │
│  │  ─────────────────────────────                                  │   │
│  │                                                                  │   │
│  │  POST /api/auth/register                                        │   │
│  │  POST /api/auth/login                                          │   │
│  │  POST /api/whatsapp/connect      ← Pre-Auth Service           │   │
│  │  POST /api/whatsapp/status                                    │   │
│  │  POST /api/install/generate                                    │   │
│  │  GET  /api/install/verify                                      │   │
│  │  GET  /api/device/status                                       │   │
│  │  POST /api/device/register                                      │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PRE-AUTH SERVICE (Node.js + Baileys)                         │   │
│  │  ─────────────────────────────────────────                      │   │
│  │                                                                  │   │
│  │  Responsibility: Connect WhatsApp Web BEFORE user installs      │   │
│  │                                                                  │   │
│  │  Flow:                                                         │   │
│  │  1. Receive phone number                                      │   │
│  │  2. Generate WhatsApp Web QR                                 │   │
│  │  3. Wait for user scan (60s timeout)                         │   │
│  │  4. Extract session                                           │   │
│  │  5. Encrypt and store session                                │   │
│  │  6. Return session ID                                         │   │
│  │                                                                  │   │
│  │  Security:                                                     │   │
│  │  • Sessions encrypted with AES-256-GCM                        │   │
│  │  • Keys rotated daily                                         │   │
│  │  • Sessions expire after 30 days                              │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  BRIDGE SERVER (Node.js + WebSocket)                          │   │
│  │  ─────────────────────────────────────────                     │   │
│  │                                                                  │   │
│  │  Responsabilidades:                                             │   │
│  │  • WebSocket relay (phone ↔ WhatsApp)                         │   │
│  │  • Session distribution                                        │   │
│  │  • Offline notifications                                       │   │
│  │  • Metrics collection                                          │   │
│  │                                                                  │   │
│  │  NO almacena:                                                 │   │
│  │  • Mensajes                                                   │   │
│  │  • Contenido                                                  │   │
│  │  • Embeddings                                                 │   │
│  │                                                                  │   │
│  │  Endpoints:                                                    │   │
│  │  • WS /ws/connect (Phone connection)                        │   │
│  │  • WS /ws/whatsapp (WhatsApp relay)                         │   │
│  │  • POST /session/restore                                      │   │
│  │  • POST /session/revoke                                       │   │
│  │  • GET  /health                                               │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  DATABASE (PostgreSQL)                                         │   │
│  │  ───────────────────                                          │   │
│  │                                                                  │   │
│  │  Tables:                                                       │   │
│  │  • users (id, email, created_at, plan)                        │   │
│  │  • whatsapp_sessions (user_id, encrypted_session, expires)   │   │
│  │  • devices (user_id, device_id, last_seen, is_online)        │   │
│  │  • metrics (user_id, type, value, timestamp)                  │   │
│  │  • billing (user_id, stripe_customer_id, subscription)         │   │
│  │                                                                  │   │
│  │  NO tablas:                                                   │   │
│  │  ❌ messages                                                   │   │
│  │  ❌ conversations                                             │   │
│  │  ❌ contacts                                                  │   │
│  │  ❌ media                                                     │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  MOBILE (OpenClaw + Secretary)                               │   │
│  │  ─────────────────────────────                                 │   │
│  │                                                                  │   │
│  │  Installation Flow:                                             │   │
│  │  1. Parse installation QR                                      │   │
│  │  2. Auth with bridge                                          │   │
│  │  3. Download model (~3GB)                                     │   │
│  │  4. Install extensions                                         │   │
│  │  5. Restore WhatsApp session                                  │   │
│  │  6. Register device                                           │   │
│  │  7. Send welcome message                                      │   │
│  │                                                                  │   │
│  │  Local Storage:                                                │   │
│  │  • /data/models/ - LLM quantized                             │   │
│  │  • /data/embeddings/ - ChromaDB                              │   │
│  │  • /data/sessions/ - WhatsApp session                         │   │
│  │  • /data/secretary/ - Extension data                         │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                    SECRETARYOS - INSTALLATION FLOW                        │
│                                                                          │
│  ┌──────────┐                              ┌──────────────────────────┐  │
│  │  USER    │                              │  secretaryos.app         │  │
│  └────┬─────┘                              └────────────┬───────────┘  │
│       │                                                 │              │
│       │  1. Visit /register                            │              │
│       │───────────────────────────────────────────────>│              │
│       │                                                 │              │
│       │  2. Enter email + phone                        │              │
│       │<───────────────────────────────────────────────│              │
│       │                                                 │              │
│       │                    ┌─────────────────────────────────────────┐ │
│       │                    │         PRE-AUTH SERVICE                │ │
│       │                    │  ┌─────────────────────────────────────┐ │ │
│       │                    │  │ 3. Generate WhatsApp QR          │ │ │
│       │  4. Show QR       │  │ 4. User scans with WhatsApp       │ │ │
│       │<──────────────────│  │ 5. Extract session               │ │ │
│       │                    │  │ 6. Encrypt + Store              │ │ │
│       │  5. Scan with      │  │ 7. Generate installation QR     │ │ │
│       │     WhatsApp       │  └─────────────────────────────────────┘ │ │
│       │───────────────────>│                                        │ │
│       │                    └────────────────────┬────────────────────┘ │
│       │                                             │                   │
│       │  6. Email with installation QR            │                   │
│       │<──────────────────────────────────────────│                   │
│       │                                             │                   │
│       │  7. Scan installation QR                   │                   │
│       │───────────────────────────────────────────>│                   │
│       │                                             │                   │
│       │                    ┌─────────────────────────────────────────┐ │
│       │                    │         BRIDGE SERVER                   │ │
│       │                    │  ┌─────────────────────────────────────┐ │ │
│       │                    │  │ 8. Verify token                  │ │ │
│       │                    │  │ 9. Return session + config        │ │ │
│       │  10. Installation │  └─────────────────────────────────────┘ │ │
│       │<──────────────────│                                        │ │
│       │                     └────────────────────┬────────────────────┘ │
│       │                                              │                    │
│       │  ┌──────────────────────────────────────┐  │                    │
│       │  │           MOBILE APP                 │  │                    │
│       │  │  ┌────────────────────────────────┐ │  │                    │
│       │  │  │ 11. Download model (~3GB)    │ │  │                    │
│       │  │  │ 12. Install extensions       │ │  │                    │
│       │  │  │ 13. Restore WhatsApp sess.  │ │  │                    │
│       │  │  │ 14. Register device         │ │  │                    │
│       │  │  └────────────────────────────────┘ │  │                    │
│       │  │                                        │  │                    │
│       │  │  15. Welcome message via WhatsApp  │  │                    │
│       │  │  ────────────────────────────────────────>│              │
│       │  └──────────────────────────────────────┘  │                    │
│       │                                             │                   │
│       │  ✅ INSTALLATION COMPLETE                   │                   │
│       │<────────────────────────────────────────────│                   │
│       │                                             │                   │
│       │  16. First briefing (8 AM tomorrow)       │                   │
│       │<────────────────────────────────────────────│                   │
│       │                                             │                   │
│       └────────────────────────────────────────────┘                   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Métricas de Éxito

| Métrica | Target | Measurement |
|---------|--------|-------------|
| Install success rate | > 95% | installs / QR scans |
| Time to first message | < 5 min | install → first WhatsApp message |
| Message latency | < 1s | send → receive |
| Bridge uptime | > 99.9% | uptime monitoring |
| Crash rate | < 0.1% | crashes / sessions |
| NPS | > 40 | survey after 1 week |

---

## Stack Tecnológico

| Componente | Tecnología | Por qué |
|------------|------------|---------|
| Frontend | Next.js 14 | SSR, API routes, Vercel deploy |
| Database | PostgreSQL | Reliability, JSON support |
| Cache | Redis | Sessions, rate limiting |
| WhatsApp | Baileys | WhatsApp Web protocol |
| WebSocket | ws library | Performance, Node.js native |
| Auth | NextAuth.js | Social logins, JWT |
| Payments | Stripe | Subscription management |
| Email | Resend | Developer-friendly API |
| Hosting | Vercel + Railway | Edge + DB hosting |

---

## Pricing Strategy

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 100 msg/day, 1 device |
| Pro | $9.99/mo | Unlimited, 3 devices |
| Team | $29.99/mo | 5 users, admin panel |

**Rationale:**
- Free tier attracts users
- Pro tier covers our bridge costs
- Team tier is profit margin

---

## Documentación Adicional

Ver también:
- `docs/SECRETARYOS_PLAN_OPTION_A.md` - Arquitectura general
- `README.md` - Diferenciadores y messaging

---

**Última actualización:** 2026-03-20
**Versión:** 1.4
**Estado:** BETA LAUNCH READY (All Phases Complete)

---

## Implementación Actual

### ✅ Fase 0: Fundamentos (COMPLETADA)
- [x] `apps/secretary-bridge/` - Bridge server repo
- [x] PostgreSQL schema - users, sessions, devices, metrics
- [x] WhatsApp Pre-Auth con Baileys v6.7
- [x] Cifrado AES-256-GCM para sesiones
- [x] API de generación de installation QR

### ✅ Fase 1: Bridge Server MVP (COMPLETADA)
- [x] WebSocket relay server (`/relay` endpoint)
- [x] DeviceManager para registro de phones
- [x] Auth con device tokens
- [x] Routing de mensajes por userId
- [x] Heartbeat ping/pong
- [x] Métricas de conexión

### ✅ Fase 2: Web Integration (COMPLETADA)
- [x] BridgeClient para comunicación con bridge
- [x] API routes para Pre-Auth, devices, bridge config
- [x] Dashboard pages: bridge config, devices
- [x] Página de instalación con QR

### ✅ Fase 3: Mobile Client (COMPLETADA)
- [x] `apps/secretary-mobile/` - Node.js client
- [x] ConfigManager con setup codes
- [x] BridgeClient WebSocket
- [x] MessageProcessor con LLM local
- [x] CLI con --setup, --start, --status

### ✅ Fase 4: Testing (COMPLETADA)
- [x] Integration tests for bridge API
- [x] Test documentation

### ✅ Fase 5: Progress Notifications (COMPLETADA)
- [x] ProgressNotifier for installation progress
- [x] Message templates (welcome, briefing, complete)
- [x] Multilingual support (ES/EN)

### ✅ Fase 6: Secretary Extension (COMPLETADA)
- [x] BriefingScheduler for morning/evening briefings
- [x] MemoryManager for facts, preferences, contacts, notes
- [x] Command parsing and natural language understanding

### ✅ Fase 7: Beta Launch (COMPLETADA)
- [x] Beta signup API and waitlist page
- [x] Onboarding flow (4 steps)
- [x] Billing plans (free, basic, pro, teams)
- [x] BetaSignupForm component
