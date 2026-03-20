# SecretaryOS - Plan de Implementación Option A

## Privacy-First AI Secretary as a Service

**Arquitectura**: Edge as the Brain, Cloud as the Bridge

---

## Arquitectura Objetivo

```
┌─────────────────────────────────────────────────────────────────┐
│  TELEFONO USUARIO (Edge - Processing)                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  OpenClaw App (iOS/Android)                              ││
│  │                                                            ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  Local LLM (Q4_K_M, ~3GB)                         │││
│  │  │  • Quantized para eficiencia                        │││
│  │  │  • NUNCA sale del dispositivo                        │││
│  │  └─────────────────────────────────────────────────────┘││
│  │                                                            ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  ChromaDB Local (embeddings)                       │││
│  │  │  • Memorias, contexto                              │││
│  │  │  • NUNCA sale del dispositivo                      │││
│  │  └─────────────────────────────────────────────────────┘││
│  │                                                            ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  Secretary Extension                                 │││
│  │  │  • Briefings, hooks, orchestrator                 │││
│  │  │  • Corre LOCALMENTE                                │││
│  │  └─────────────────────────────────────────────────────┘││
│  │                                                            ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │  WhatsApp Channel (Baileys)                        │││
│  │  │  • Sesión local                                    │││
│  │  │  • NO pasa por nuestros servidores                  │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  → 100% LOCAL: mensajes, embeddings, modelo                     │
└─────────────────────────────────────────────────────────────────┘
          │
          │  WebSocket (cifrado E2E)
          │  Solo datos cifrados pasan por aquí
          ↓
┌─────────────────────────────────────────────────────────────────┐
│  BRIDGE SERVER (nosotros)                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Responsibilities:                                          ││
│  │  • Recibir mensajes de WhatsApp Web (Baileys)              ││
│  │  • Retransmitir al teléfono (sin almacenar)               ││
│  │  • Notificaciones push cuando teléfono offline               ││
│  │  • Dashboard del usuario (config, métricas)                ││
│  │  • Billing y subscriptions                                  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  NO puede:                                                ││
│  │  • Leer mensajes (cifrado E2E)                            ││
││  │  • Almacenar conversaciones                              │││
│  │  • Acceder a embeddings                                    │││
│  │  • Procesar requests                                        │││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────────┐
│  WHATSAPP WEB (Baileys)                                        │
│  Corriendo en el TELÉFONO, no en nuestro servidor            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diferenciadores Clave

| Aspecto | SecretaryOS | Competidores |
|----------|-------------|--------------|
| **Modelo** | Local en teléfono | Cloud (OpenAI, etc) |
| **Embeddings** | ChromaDB local | Servidores externos |
| **Mensajes** | Nunca salen del teléfono | Almacenados en servidor |
| **Bridge** | Proxy tonto, auditable | Almacenan todo |
| **Privacidad** | Técnicamente garantizada | Solo legal |
| **Pricing** | Solo bridge + soporte | Compute + almacenamiento |

---

## Componentes a Construir

### 1. OpenClaw Mobile App (Ya existe)

**Lo que tenemos:**
- iOS app en `apps/ios/`
- Android app en `apps/android/`
- QR scanner para pairing
- Node-host integration

**Lo que falta:**
- Descarga automática de modelo quantizado
- Instalación silenciosa de extensión Secretary

### 2. Bridge Server (Nuevo)

**Responsabilidades:**
```
├── WhatsApp Bridge
│   ├── Recibe sesiones de WhatsApp Web de múltiples usuarios
│   ├── Retransmite mensajes al teléfono correspondiente
│   └── NO almacena mensajes
│
├── WebSocket Relay
│   ├── Mantiene conexiones WebSocket con teléfonos
│   ├── Routing de mensajes por user_id
│   └── Reconnection handling
│
├── Dashboard API
│   ├── Gestión de usuarios
│   ├── Métricas de uso
│   ├── Billing integration
│   └── Configuración no-sensible
│
└── Notification Service
    ├── Push cuando teléfono offline
    └── Fallback a email/SMS
```

**Stack propuesto:**
- Node.js + Fastify (ligero, rápido)
- Redis (sessions, no mensajes)
- PostgreSQL (usuarios, billing, config)
- WebSocket para relay

### 3. Mobile App Updates (Nuevo)

**Instalación silenciosa:**
```typescript
// Al escanear QR:
1. Descargar OpenClaw app (si no existe)
2. Descargar modelo quantizado (~3GB, en background)
3. Instalar Secretary extension
4. Conectar WhatsApp (QR adicional)
5. Primera notificación: "Secretary listo! 🎉"
```

### 4. Dashboard Web (Extender existente)

**Lo que tenemos:**
- `apps/secretaryos-web/` con Next.js + Supabase

**Lo que falta:**
- Estado de conexión del teléfono
- Metrics (mensajes procesandos, uptime)
- Configuración de notificaciones
- Billing/payments

---

## Flujo de Instalación

```
┌──────────────────────────────────────────────────────────────────┐
│                     INSTALACIÓN ZERO-TOUCH                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. USUARIO ESQUEA QR                                           │
│     └─→ Landing page detecta dispositivo                          │
│                                                                   │
│  2. "¿Instalar Secretary?"                                       │
│     └─→ [Sí, instalar]                                           │
│                                                                   │
│  3. DESCARGA AUTOMÁTICA                                         │
│     ┌─────────────────────────────────────────────────────────┐  │
│     │  📱 OpenClaw App          → App Store / Play Store    │  │
│     │  🧠 Modelo Quantizado     → ~3GB (background)        │  │
│     │  📦 Secretary Extension    → Incluido en app           │  │
│     │  💬 WhatsApp Session      → QR scan in-app             │  │
│     └─────────────────────────────────────────────────────────┘  │
│                                                                   │
│  4. WHATSAPP NOTIFICATION                                       │
│     └─→ "🔧 Instalando SecretaryOS..."                           │
│                                                                   │
│  5. MODELO DESCARGANDO                                          │
│     └─→ Progress: ████████░░ 80%                               │
│                                                                   │
│  6. CONFIGURACIÓN COMPLETA                                      │
│     └─→ "✅ Secretary listo!"                                    │
│                                                                   │
│  7. BRIEFING BIENVENIDA                                         │
│     └─→ Primer mensaje de Secretary por WhatsApp                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Base de Datos

### Lo que almacenamos (Bridge)

```sql
-- Usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  plan TEXT DEFAULT 'free',
  bridge_token TEXT UNIQUE,  -- Para conectar con teléfono
  phone_last_seen TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT FALSE
);

-- Configuración no-sensible
CREATE TABLE user_config (
  user_id UUID REFERENCES users(id),
  key TEXT,
  value JSONB,
  PRIMARY KEY (user_id, key)
);

-- Métricas (no mensajes)
CREATE TABLE metrics (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  metric_type TEXT,  -- 'message_count', 'uptime', 'errors'
  value JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status TEXT,
  plan TEXT,
  current_period_end TIMESTAMPTZ
);
```

### Lo que NO almacenamos

- ❌ Mensajes de WhatsApp
- ❌ Embeddings
- ❌ Contenido de conversaciones
- ❌ Archivos multimedia
- ❌ Historial de chat

---

## Seguridad

### Cifrado E2E

```
┌─────────────────────────────────────────────────────────────┐
│                    MENSAJE FLOW                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📱 TELÉFONO                                                │
│     │                                                       │
│     │ 1. Usuario escribe mensaje                            │
│     │ 2. Cifra con clave local                            │
│     ▼                                                       │
│     [CIFRADO] ──────────────────────────────                │
│                                                              │
│                    │                                        │
│                    │ WebSocket (cifrado TLS)              │
│                    ▼                                        │
│                                                              │
│     [CIFRADO] ──────────────────────────────                │
│     │                                                       │
│     │ 3. Bridge retransmite (NO puede leer)               │
│     │                                                       │
│     ▼                                                       │
│  📱 TELÉFONO (destinatario)                               │
│     │                                                       │
│     │ 4. Descifra con clave local                          │
│     ▼                                                       │
│     Mensaje legible                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Auditoría

El bridge server es **open source** y auditable:
- Código público en GitHub
- Sin dependencias externas sospechosas
- Logs solo de metadata (timestamps, user_id, message_size)
- No logs de contenido

---

## Roadmap de Implementación

### Fase 1: MVP (1-2 semanas)

- [ ] Bridge server básico con WebSocket relay
- [ ] WhatsApp Web connection via Baileys (en teléfono)
- [ ] Dashboard simple de status
- [ ] Un-Click install flow (web → app)

### Fase 2: Mobile (2-3 semanas)

- [ ] Descarga automática de modelo
- [ ] Instalación silenciosa de Secretary extension
- [ ] Notificaciones de progreso
- [ ] WhatsApp QR integration

### Fase 3: Polish (1 semana)

- [ ] Onboarding UX
- [ ] Briefings iniciales
- [ ] Testing con usuarios reales

### Fase 4: Scale (2-3 semanas)

- [ ] Multi-tenant bridge server
- [ ] Redis clustering
- [ ] Metrics y monitoring
- [ ] Billing integration

---

## Pricing Model

| Tier | Precio | Incluye |
|------|--------|---------|
| **Free** | $0 | Bridge básico, 1 dispositivo |
| **Pro** | $9.99/mes | Múltiples dispositivos, priority support |
| **Team** | $29.99/mes | 5 usuarios, admin dashboard |

**Nota**: El modelo local y embeddings son FREE - solo pagas por el bridge si necesitas multi-device o soporte.

---

## Métricas de Éxito

- ✅ Tiempo de instalación < 5 minutos
- ✅ Mensajes procesando < 1 segundo latency
- ✅ 0 mensajes almacenados en nuestros servidores
- ✅ Uptime bridge > 99.9%

---

## Competitors Comparison

| Feature | SecretaryOS | Reclaim.ai | Clockwise | Motion |
|---------|-------------|------------|-----------|--------|
| Privacy | 100% local | Cloud | Cloud | Cloud |
| WhatsApp | ✅ | ❌ | ❌ | ❌ |
| Modelo local | ✅ | ❌ | ❌ | ❌ |
| Zero-config | QR only | Setup required | Setup required | Setup required |
| Pricing | Pay for bridge | Full price | Full price | Full price |

---

## Próximos Pasos Inmediatos

1. **Decidir stack del bridge** (Node.js vs Go vs Rust)
2. **Crear repo separado** para bridge-server
3. **MVP funcional**: phone ↔ bridge ↔ WhatsApp
4. **Test con 5 usuarios beta**
