# ClawSecretary - Análisis de Gaps y Oportunidades para SAS Móvil

**Fecha:** 18 de Marzo 2026  
**Versión:** 1.0  
**Propósito:** Identificar integración de skills y features nativas faltantes para el producto SAS de Secretary en móvil

---

## Resumen Ejecutivo

### Estado Actual

| Dimensión | Estado | Detalle |
|-----------|--------|---------|
| **OpenClaw Core Integration** | ✅ 98% | 14 runtime APIs integradas |
| **Skills Nativas Integradas** | 🔄 3/9 | gog, himalaya, blogwatcher |
| **Skills Faltantes (Tier 1)** | ⚠️ 6/9 | calendly-api, apple-reminders, imsg, 1password, telegram, slack |
| **Skills Faltantes (Tier 2)** | ⚠️ 7/9 | notion, things-mac, apple-notes, openhue, goplaces, trello |
| **Features Móviles Nativas** | ⚠️ 4/10 | Voice Wake, Node Mode, Canvas |

### Visión del Producto

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CLAWSECRETARY SAS MÓVIL                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   📱 Mobile App                                                     │
│   ├── Voice Wake ("Hey Secretary")                                  │
│   ├── Camera (doc scanning, voice notes)                          │
│   ├── Notifications (WhatsApp, iMessage, Reminders)              │
│   ├── Node Mode (local actions when remote unavailable)           │
│   └── Biometrics (Face ID for secrets)                             │
│                                                                      │
│   ☁️ Cloud Gateway                                                 │
│   ├── Always-on processing                                          │
│   ├── P2P negotiations                                             │
│   ├── Cron jobs (briefings, triages)                              │
│   ├── Multi-device sync                                           │
│   └── Security (1Password integration)                             │
│                                                                      │
│   🏠 Local Node (Optional)                                         │
│   ├── Home automation (Hue, Sonos)                                │
│   ├── iMessage/SMS handling                                       │
│   ├── Apple Reminders sync                                         │
│   ├── Local file processing                                        │
│   └── macOS tools (Things, Notes, Calendar)                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Parte 1: Análisis de Skills Disponibles

### Skills por Categoría - Prioridad para Secretary

#### 📅 Calendario y Productividad

| Skill | Integrado | Prioridad | Esfuerzo | Beneficio |
|-------|-----------|-----------|----------|-----------|
| `gog` | ✅ Parcial | 🔴 CRÍTICA | Bajo | Alto |
| `calendly-api` | ❌ | 🔴 CRÍTICA | Medio | Alto |
| `things-mac` | ❌ | 🟡 ALTA | Medio | Alto |
| `apple-reminders` | ❌ | 🔴 CRÍTICA | Bajo | Alto |
| `notion` | ✅ Parcial | 🟡 ALTA | Medio | Alto |
| `obsidian` | ✅ Parcial | 🟢 MEDIA | Bajo | Medio |

**Gap Analysis:**
- `calendly-api`: No integrado - Necesario para booking automático
- `things-mac`: macOS only - Alternativa: `apple-reminders` para cross-platform
- `apple-reminders`: No integrado - Crítico para sync universal con iOS

#### 💬 Comunicación

| Skill | Integrado | Prioridad | Esfuerzo | Beneficio |
|-------|-----------|-----------|----------|-----------|
| `whatsapp-business` | ✅ Completo | 🔴 CRÍTICA | - | - |
| `imsg` | ❌ | 🔴 CRÍTICA | Bajo | Alto |
| `slack` | ❌ | 🔴 CRÍTICA | Bajo | Alto |
| `telegram` | ✅ Core Channel | 🟡 ALTA | - | - |
| `discord` | ✅ Core Channel | 🟢 MEDIA | - | - |

**Gap Analysis:**
- `imsg`: No integrado - iMessage/SMS crítico para Apple users
- `slack`: No integrado - Workplace communication esencial

#### 🏠 IoT y Smart Home

| Skill | Integrado | Prioridad | Esfuerzo | Beneficio |
|-------|-----------|-----------|----------|-----------|
| `openhue` | ✅ Completo | 🟡 ALTA | - | - |
| `sonoscli` | ✅ Completo | 🟢 MEDIA | - | - |
| `blucli` | ❌ | 🟢 BAJA | Bajo | Bajo |

**Estado:** ✅ Bien integrado - Focus mode funcional

#### 📰 Información

| Skill | Integrado | Prioridad | Esfuerzo | Beneficio |
|-------|-----------|-----------|----------|-----------|
| `weather` | ✅ Completo | 🟢 MEDIA | - | - |
| `goplaces` | ✅ Parcial | 🟡 ALTA | Medio | Alto |
| `blogwatcher` | ✅ Completo | 🟢 MEDIA | - | - |
| `ordercli` | ❌ | 🟢 BAJA | Medio | Medio |

**Estado:** ✅ Bien cubierto - Briefing incluye weather y RSS

#### 🧠 Memoria y Notas

| Skill | Integrado | Prioridad | Esfuerzo | Beneficio |
|-------|-----------|-----------|----------|-----------|
| `apple-notes` | ❌ | 🔴 CRÍTICA | Bajo | Alto |
| `bear-notes` | ❌ | 🟢 MEDIA | Bajo | Medio |
| `himalaya` | ✅ Completo | 🔴 CRÍTICA | - | - |

**Gap Analysis:**
- `apple-notes`: No integrado - Zero-friction note capture
- Fallback actual: `himalaya` para email, no para notas

#### 🎵 Media y Voz

| Skill | Integrado | Prioridad | Esfuerzo | Beneficio |
|-------|-----------|-----------|----------|-----------|
| `openai-whisper` | ✅ Completo | 🟡 ALTA | - | - |
| `spotify-player` | ❌ | 🟢 BAJA | Bajo | Medio |
| `video-frames` | ❌ | 🟢 BAJA | Trivial | Bajo |
| `camsnap` | ❌ | 🟢 BAJA | Bajo | Bajo |

**Estado:** ✅ Whisper integrado via `runtime.mediaUnderstanding`

#### 🔐 Seguridad

| Skill | Integrado | Prioridad | Esfuerzo | Beneficio |
|-------|-----------|-----------|----------|-----------|
| `1password` | ❌ | 🔴 CRÍTICA | Medio | Alto |
| `healthcheck` | ❌ | 🟢 MEDIA | Bajo | Medio |

**Gap Analysis:**
- `1password`: No integrado - Vault manager propio vs 1Password
- Consideración: Mantener vault propietario para zero-config

---

## Parte 2: Features Nativas de OpenClaw Faltantes

### Análisis de Capacidades Móviles

```
┌─────────────────────────────────────────────────────────────────────┐
│              CAPACIDADES MÓVILES OPENCLAW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📱 iOS/Android Apps                                               │
│  ├── Node Mode ✅                                                  │
│  │   └── Secretary como edge node cuando gateway no reachable      │
│  ├── Voice Wake ✅                                                 │
│  │   └── "Hey Secretary" - wake word para activación              │
│  ├── Camera ✅                                                     │
│  │   └── Doc scanning, voice notes                                 │
│  ├── Canvas ❌                                                     │
│  │   └── UI generation para briefings interactivos                 │
│  └── Notifications ✅                                              │
│      └── Push para briefings, alerts                               │
│                                                                      │
│  🖥️ macOS App                                                     │
│  ├── Menu Bar ✅                                                   │
│  ├── Voice Wake ✅                                                 │
│  ├── Canvas ✅                                                     │
│  └── Control UI ✅                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Features Críticas Faltantes

#### 1. Canvas Runtime (UI Generation)

**¿Qué es?** Capacidad de generar interfaces de usuario interactivas desde el agent.

**Estado actual en Secretary:** ❌ No integrado

**¿Por qué es crítico?**
```
SIN Canvas:
├── Briefing como texto plano
├── Botones solo en WhatsApp
└── Sin visualización de datos

CON Canvas:
├── Dashboard interactivo del día
├── Gráficos de analytics
├── Timeline visual de reuniones
└── UI para acciones rápidas
```

**Integración propuesta:**
```typescript
// En orchestrator.ts - handleBriefing
private async handleBriefingWithCanvas() {
  const canvas = await api.runtime.canvas.createDashboard({
    title: "Secretary Briefing",
    sections: [
      { type: "calendar", events: todayEvents },
      { type: "weather", location: userCity },
      { type: "tasks", items: pendingTasks },
      { type: "quick-actions", buttons: [...] }
    ]
  });
  return { canvas };
}
```

**Prioridad:** 🟡 ALTA - Diferenciador visual clave

---

#### 2. Voice Wake con Wake Words Personalizados

**¿Qué es?** "Hey Secretary" como wake word dedicado.

**Estado actual:** ⚠️ OpenClaw tiene Voice Wake pero no personalizado

**¿Por qué es crítico?**
```
┌─────────────────────────────────────────┐
│           ACTUAL                        │
├─────────────────────────────────────────┤
│  "Hey Siri" → iPhone                  │
│  "Hey Google" → Android                │
│  "Hey OpenClaw" → ???                  │
│                                          │
│  PROBLEMA: Confusión de asistente       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           CON WAKE WORD PROPIO          │
├─────────────────────────────────────────┤
│  "Hey Secretary" → Secretary App       │
│  "Hey Siri" → iPhone                   │
│  "Hey Google" → Android                │
│                                          │
│  BENEFICIO: Sin confusión              │
└─────────────────────────────────────────┘
```

**Integración propuesta:**
- Voice Wake ya existe en iOS/Android
- Solo necesita configuración de wake word
- Script de activación: `scripts/voice-wake-setup.sh`

**Prioridad:** 🔴 CRÍTICA - UX móvil fundamental

---

#### 3. Node Mode para Secretary Edge

**¿Qué es?** Secretary funcionando como edge node cuando el gateway principal no está reachable.

**Estado actual:** ✅ Implementado parcialmente

**Arquitectura:**
```
┌─────────────────────────────────────────────────────────────────────┐
│                         NODE MODE ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   📱 Secretary Mobile (Edge Node)                                   │
│   │                                                                   │
│   ├── Cuando gateway reachable:                                       │
│   │   └── Todas las acciones via cloud                              │
│   │                                                                   │
│   ├── Cuando gateway offline:                                        │
│   │   ├── Calendar local (último sync)                             │
│   │   ├── Notas locales                                            │
│   │   ├── Cola de acciones (replay cuando online)                  │
│   │   └── Sync de estado al reconnect                              │
│   │                                                                   │
│   └── Sync automático:                                              │
│       └── Cada 5 min en background                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Integración propuesta:**
```typescript
// En store.ts - CalendarStore con sync
class CalendarStore {
  async load(): Promise<CalendarEvent[]>
  async save(events: CalendarEvent[]): Promise<void>
  
  // NEW: Node mode sync
  async syncWithGateway(): Promise<SyncResult> {
    if (this.isOnline) {
      const remote = await fetchRemoteCalendar();
      return this.merge(remote);
    }
    return { status: "offline", queued: [...] };
  }
}
```

**Prioridad:** 🟡 ALTA - Offline resilience

---

#### 4. Notifications Push Personalizadas

**¿Qué es?** Notificaciones push estructuradas con actions.

**Estado actual:** ⚠️ WhatsApp como canal de notificación

**¿Por qué Canvas sería mejor?**
```
WHATSAPP (actual):
┌────────────────────────────┐
│ 📱 Secretary              │
│ Briefing listo            │
│ 3 reuniones, 2 urgent    │
└────────────────────────────┘

CANVAS PUSH (futuro):
┌────────────────────────────┐
│ 📊 Secretary Briefing     │
├────────────────────────────┤
│ 📅 3 reuniones           │
│    [Ver] [Ignorar]       │
│ 📧 2 emails action req   │
│    [Ver] [OK]            │
│ 💡 Tip: Día intenso      │
└────────────────────────────┘
```

**Prioridad:** 🟡 MEDIA - Nice to have

---

## Parte 3: Roadmap de Integración

### Fase 3: Skills Core (Semanas 1-2)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 3: SKILLS CORE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Semana 1: Comunicación                                            │
│  ├── imsg integration                                             │
│  │   ├── src/helpers/imsg.ts (nuevo)                              │
│  │   ├── orchestrator.handleImsg()                                │
│  │   └── register imsg command in index.ts                        │
│  │                                                                │
│  └── slack integration                                            │
│      ├── src/helpers/slack.ts (nuevo)                              │
│      ├── orchestrator.handleSlack()                                │
│      └── Update /status para mostrar Slack                        │
│                                                                      │
│  Semana 2: Tasks y Reminders                                        │
│  ├── apple-reminders integration                                   │
│  │   ├── src/helpers/apple-reminders.ts (nuevo)                   │
│  │   ├── orchestrator.handleReminders()                            │
│  │   └── "Hey Secretary, recuérdame..." action                   │
│  │                                                                │
│  └── calendly-api integration                                      │
│      ├── src/helpers/calendly-booking.ts (nuevo)                   │
│      ├── orchestrator.handleBookMeeting()                          │
│      └── "Hey Secretary, reserva con..." action                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Fase 4: Second Brain Amplification (Semanas 3-4)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 4: SECOND BRAIN                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Semana 3: Apple Notes + Notion Amplification                        │
│  ├── apple-notes integration                                        │
│  │   ├── src/helpers/apple-notes.ts (nuevo)                       │
│  │   ├── "Hey Secretary, anota..." → Apple Notes                   │
│  │   └── Sync bidireccional con Vault                              │
│  │                                                                │
│  └── notion-amplification                                          │
│      ├── Enhanced database schemas                                 │
│      ├── Meeting notes templates                                  │
│      └── Project tracker integration                              │
│                                                                      │
│  Semana 4: Obsidian Enhancement                                     │
│  ├── obsidian-sync enhancement                                    │
│  │   ├── Daily notes templates                                    │
│  │   ├── Meeting capture workflow                                 │
│  │   └── Cross-vault linking                                     │
│  │                                                                │
│  └── Knowledge graph visualization                                 │
│      └── Canvas-based graph display                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Fase 5: Canvas UI (Semanas 5-6)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 5: CANVAS UI                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Semana 5: Briefing Dashboard                                        │
│  ├── canvas-briefing.ts (nuevo)                                    │
│  │   ├── Calendar view                                             │
│  │   ├── Weather widget                                           │
│  │   ├── Task summary                                             │
│  │   └── Quick actions                                            │
│  │                                                                │
│  └── Update orchestrator.handleBriefing()                          │
│      └── Return canvas dashboard instead of text                   │
│                                                                      │
│  Semana 6: Interactive Analytics                                    │
│  ├── canvas-analytics.ts (nuevo)                                   │
│  │   ├── Productivity metrics                                     │
│  │   ├── IoT usage patterns                                      │
│  │   ├── Meeting analytics                                       │
│  │   └── Memory insights                                          │
│  │                                                                │
│  └── canvas.push() para notificaciones enriched                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Fase 6: Mobile Native (Semanas 7-8)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FASE 6: MOBILE NATIVE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Semana 7: Voice Wake + Node Mode                                   │
│  ├── Wake word configuration                                       │
│  │   └── "Hey Secretary" setup script                             │
│  │                                                                │
│  ├── Node mode enhancement                                        │
│  │   ├── Offline action queue                                      │
│  │   ├── Background sync                                          │
│  │   └── Reconnection handling                                    │
│  │                                                                │
│  └── 1password integration (opcional)                              │
│      └── Para usuarios enterprise                                   │
│                                                                      │
│  Semana 8: Push Notifications                                       │
│  ├── Rich notifications                                           │
│  │   ├── Briefing cards                                           │
│  │   ├── Meeting reminders                                        │
│  │   └── Action buttons                                           │
│  │                                                                │
│  └── Notification preferences                                      │
│      └── Per-user configuration                                    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Parte 4: Análisis de Competencia

### Secretary vs Asistentes Existentes

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COMPARACIÓN DE MERCADO                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Feature              │ Siri  │ Google │ Alexa │ Secretary │ Gap  │
│  ────────────────────┼───────┼────────┼───────┼───────────┼─────  │
│  Calendar Proactivo   │   -   │   -    │   -   │    ✅     │  +1   │
│  Email Triage         │   -   │   -    │   -   │    ✅     │  +1   │
│  P2P Encryption      │   -   │   -    │   -   │    ✅     │  +1   │
│  Ghost Write         │   -   │   -    │   -   │    ✅     │  +1   │
│  WAL Persistence     │   -   │   -    │   -   │    ✅     │  +1   │
│  IoT Integration     │   ⚠️  │   ⚠️   │   ✅  │    ✅     │   -   │
│  Voice Notes         │   ✅  │   ✅   │   ✅  │    ⚠️     │  -1   │
│  Cross-Platform      │   ✅  │   ✅   │   ✅  │    ⚠️     │  -1   │
│  Wake Word Custom    │   ✅  │   ✅   │   ✅  │    ❌     │  -2   │
│  Canvas UI           │   -   │   -    │   -   │    ❌     │  +1   │
│                                                                      │
│  PROPIO:            │       │        │       │           │       │
│  P2P Negotiations   │   -   │   -    │   -   │    ✅     │  +1   │
│  Memory Lifecycle    │   -   │   -    │   -   │    ✅     │  +1   │
│  Second Brain Sync   │   -   │   -    │   -   │    ✅     │  +1   │
│  Focus Mode         │   -   │   -    │   -   │    ✅     │  +1   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

LEYENDA:
✅ = Soportado
⚠️ = Parcial
❌ = No soportado
-  = No aplicable
```

### Ventajas Competitivas de ClawSecretary

| Ventaja | Descripción |防御 moat |
|---------|-------------|----------|
| **P2P Encryption** | Negotiations without servers seeing data | 🔒 Muy alto |
| **WAL Protocol** | Persistence across sessions | 🧠 Alto |
| **Ghost Write** | Automatic documentation | 📝 Medio |
| **Proactividad** | Acts before you ask | 🤖 Medio |
| **Zero-Config** | QR setup = ready | ⚡ Muy alto |
| **Open Source** | Transparency, customization | 🟢 Medio |

---

## Parte 5: Integración con OpenClaw Mobile Apps

### Arquitectura de Comunicación

```
┌─────────────────────────────────────────────────────────────────────┐
│              OPENCLAW MOBILE ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  📱 iOS App                                                        │
│  ├── OpenClaw App                                                   │
│  │   ├── Voice Wake                                                 │
│  │   ├── Canvas                                                    │
│  │   ├── Node Mode                                                 │
│  │   └── Camera/Mic                                                │
│  │                                                                   │
│  └── Secretary Extension (Future)                                    │
│      └── "Hey Secretary" wake word                                  │
│          └── Routes to gateway                                      │
│                                                                      │
│  ☁️ Gateway (Cloud/VPS)                                            │
│  └── ClawSecretary Plugin                                           │
│      ├── Orchestrator                                              │
│      ├── All Skills                                                 │
│      └── WAL Persistence                                            │
│                                                                      │
│  🖥️ macOS App                                                     │
│  └── Secretary Node Mode                                           │
│      ├── Local tools (iMessage, Reminders)                          │
│      ├── Full gateway fallback                                      │
│      └── Menu bar presence                                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Mobile Node Mode para Secretary

```typescript
// src/helpers/node-mode.ts

export interface SecretaryNodeConfig {
  localMode: boolean;
  syncIntervalMs: number;
  offlineQueue: Action[];
  lastSyncTimestamp: string;
}

export class SecretaryNodeMode {
  private config: SecretaryNodeConfig;
  private isOnline: boolean;
  
  async handleAction(action: SecretaryAction): Promise<ActionResult> {
    if (this.isOnline) {
      return this.forwardToGateway(action);
    }
    
    // Offline mode - queue action
    return this.queueOffline(action);
  }
  
  async syncWhenOnline(): Promise<void> {
    const queued = await this.loadOfflineQueue();
    for (const action of queued) {
      await this.forwardToGateway(action);
    }
    await this.clearOfflineQueue();
  }
}
```

### Voice Wake Configuration

```typescript
// Para iOS/Android - scripts/voice-wake-setup.sh

#!/bin/bash
# Configura "Hey Secretary" como wake word

# 1. Detectar platform
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Configuring macOS Voice Wake..."
  # Usar Shortcuts app para custom phrase
elif [[ "$OSTYPE" == "darwin" ]]; then
  if command -v xcrun &> /dev/null; then
    echo "Configuring iOS Voice Wake via Shortcuts..."
    # Crear shortcut con phrase detection
  fi
fi

# 2. Generar config
cat > ~/.openclaw/voice-wake.json << EOF
{
  "wakeWord": "Hey Secretary",
  "platform": "auto-detect",
  "sensitivity": 0.7,
  "timeoutMs": 5000
}
EOF

echo "✅ Voice Wake configured"
```

---

## Parte 6: Dependencias y Pre-requisitos

### Para Mobile SAS - Requisitos Mínimos

```
┌─────────────────────────────────────────────────────────────────────┐
│                    REQUISITOS MÍNIMOS                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  🖥️ GATEWAY                                                        │
│  ├── OpenClaw 2026.3+                                              │
│  ├── Node.js 22+                                                    │
│  ├── 2GB RAM                                                        │
│  ├── 10GB Storage                                                    │
│  └── VPS o macOS siempre encendido                                   │
│                                                                      │
│  📱 MOBILE                                                          │
│  ├── iOS 17+ (para mejor Voice Wake)                               │
│  ├── Android 13+                                                    │
│  ├── OpenClaw App installed                                         │
│  └── Internet connection (para node mode)                           │
│                                                                      │
│  🏠 LOCAL NODE (Opcional)                                          │
│  ├── macOS 14+                                                      │
│  ├── Homebrew                                                       │
│  └── CLI tools: gog, remindctl, imessage-cli                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Skills Dependencies

| Skill | Dependencias | Instalación |
|-------|-------------|------------|
| `gog` | Google OAuth | `brew install gog` |
| `himalaya` | IMAP/SMTP config | `brew install himalaya` |
| `blogwatcher` | Go toolchain | `go install...` |
| `openhue` | Hue Bridge | Pairing inicial |
| `sonoscli` | Red local | `go install...` |
| `imsg` | macOS + FDA | Configuración permisos |
| `apple-reminders` | macOS | `brew install remindctl` |
| `slack` | Slack Bot Token | Configurar en slack.com |
| `apple-notes` | macOS + Notes app | Permisos |
| `notion` | Notion API Key | Setup integration |
| `1password` | 1Password CLI | `brew install 1password-cli` |

---

## Parte 7: Recomendaciones Finales

### Priorización para SAS Móvil

#### Inmediato (Esta semana)

1. **integrar `slack`** - Communication crítico
2. **Integrar `imsg`** - Apple users lo esperan
3. **Voice Wake setup script** - UX móvil

#### Corto plazo (2 semanas)

4. **integrar `apple-reminders`** - Task management universal
5. **Integrar `calendly-api`** - Booking profesional
6. **Node mode enhancement** - Offline resilience

#### Medio plazo (1 mes)

7. **Canvas UI** - Diferenciador visual
8. **`apple-notes` integration** - Zero-friction capture
9. **`notion` enhancement** - Second brain amplification

#### Largo plazo (2-3 meses)

10. **1Password integration** - Enterprise security
11. **Rich push notifications** - Engagement
12. **Cross-platform parity** - Android focus

### Lo que NO hacer

| No hacer | Razón |
|----------|-------|
| No reimplementar 1Password | Mantener vault propietario para zero-config |
| No dependencia de macOS | Mobile-first, macOS como enhancement |
| No sobre-engineering | Empezar simple, iterar |
| No lock-in | Mantener open source |

---

## Anexo: Checklist de Integración

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CHECKLIST DE INTEGRACIÓN                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  SKILLS                                                             │
│  ☐ gog                  (✅ Parcial - verificar coverage)          │
│  ☐ calendly-api         (❌ - critical)                             │
│  ☐ apple-reminders      (❌ - critical)                             │
│  ☐ imsg                 (❌ - critical)                             │
│  ☐ slack                 (❌ - critical)                             │
│  ☐ 1password            (❌ - opcional enterprise)                 │
│  ☐ apple-notes           (❌ - media)                              │
│  ☐ notion               (⚠️ Parcial - mejorar)                    │
│  ☐ things-mac           (❌ - solo macOS)                         │
│                                                                      │
│  FEATURES NATIVAS                                                   │
│  ☐ Canvas UI              (❌ - fases 5-6)                          │
│  ☐ Voice Wake Custom      (❌ - fase 6)                             │
│  ☐ Node Mode Enhancement  (❌ - fase 6)                             │
│  ☐ Rich Push             (❌ - fase 6)                             │
│                                                                      │
│  MOBILE APPS                                                        │
│  ☐ iOS App Review          (Pending OpenClaw)                      │
│  ☐ Android App Review       (Pending OpenClaw)                     │
│  ☐ Secretary-specific app   (Future)                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

**Documento creado:** 18 de Marzo 2026  
**Próxima revisión:** Después de Fase 3  
**Estado:** En progreso de integración
