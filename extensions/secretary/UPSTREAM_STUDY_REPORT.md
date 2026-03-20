# SecretaryOS - Upstream Study Report
## OpenClaw Core Analysis & Strategic Integration

**Fecha:** 2026-03-20
**Versión Core:** upstream/main @ 57f1cf66ad
**Autor:** AI Agent

---

## 1. Resumen de Novedades en OpenClaw Core

### 1.1 Arquitectura SaaS (`src/saas/`)

**Nuevo: SaaS Orchestrator**
```typescript
// src/saas/orchestrator.ts
class AutoAuthOrchestrator {
  generateMagicLink(): Promise<string>
  captureToken(): Promise<void>
  injectCredential(provider: string, token: string): Promise<void>
  injectCloudProfiles(): Promise<void>
}
```

**Nuevo: Simulated Onboarding**
```typescript
// src/saas/simulate-onboarding.ts
// Para testing de flujos SaaS completos
```

**Impacto para SecretaryOS:** Podemos usar `AutoAuthOrchestrator` para:
- OAuth flow con Google Calendar, Notion, etc.
- Inyección automática de credenciales en config
- Magic links para onboarding

---

### 1.2 Plugin SDK Expandido (`src/plugins/`)

**Nuevos hooks disponibles:**
| Hook | Propósito | Caso de Uso Secretary |
|------|-----------|----------------------|
| `inbound_claim` | Reclamar mensajes antes del agent | Interceptar "briefing" |
| `before_tool_call` | Bloquear/modificar tools | Controlar acceso a tools |
| `after_tool_call` | Observar resultados | Logging/debugging |
| `session_start/end` | Lifecycle de sesión | Analytics |
| `before_prompt_build` | Inyectar contexto | Contexto del secretary |
| `before_message_write` | Filtrar outputs | Content filtering |

**Nuevo Runtime API:**
```typescript
// runtime.agent - Agent utilities
runtime.agent.getDefaults()
runtime.agent.getWorkspaceDir()
runtime.agent.getTimeout()

// runtime.session - Session storage
runtime.session.loadSessionStore()
runtime.session.saveSessionStore()

// runtime.tools - Memory tools
runtime.tools.createMemorySearchTool()
runtime.tools.createMemoryGetTool()

// runtime.subagent - Subagent execution
runtime.subagent.run({ prompt, model, tools })
runtime.subagent.waitForRun(runId)
```

---

### 1.3 Nuevos Providers

**Providers OAuth añadidos:**
- `github-copilot` - GitHub Copilot integration
- `qwen-portal` - Qwen/Ollama portal
- Provider auth requiere `ProviderPluginWizardSetup` types

---

### 1.4 CLI Patterns (`src/cli/secretary-cli.ts`)

**Nuevo: Secretary CLI integrado**
```typescript
// Patrón oficial para plugins CLI
registerCli(registrar, { commands: ['status', 'briefing', 'configure'] })

// Usa buildPluginStatusReport() para formato unificado
// Usa loadConfig() / writeConfigFile() para config management
```

---

### 1.5 Workspace Templates (`workspace/`)

**Nuevos archivos de workspace:**
```
workspace/
├── AGENTS.md           # Template de agente
├── HEARTBEAT.md        # Protocolo de heartbeat
├── MEMORY.md           # Sistema de memoria
├── ONBOARDING.md       # Guía de onboarding
├── SESSION-STATE.md    # Estado de sesión
├── SOUL.md             # Personalidad/core
├── TOOLS.md            # Herramientas disponibles
├── WAL-PROTOCOL.md     # Protocolo WAL
└── memory/
    └── working-buffer.md
```

---

## 2. Potencial de Integración para SecretaryOS

### 2.1 Inmediato (Fase 1)

| Mejora | Cómo Integrar | Beneficio |
|--------|---------------|-----------|
| **Memory Tools** | Usar `runtime.tools.createMemorySearchTool()` | Reemplazar implementación custom |
| **Session Hooks** | Implementar `session_start/end` | Tracking de conversaciones |
| **Inbound Claim** | Interceptar mensajes "briefing" | Zero-command briefings |
| **CLI Status** | Usar `buildPluginStatusReport()` | Status unificado |

### 2.2 Corto Plazo (Fase 2)

| Mejora | Cómo Integrar | Beneficio |
|--------|---------------|-----------|
| **SaaS Orchestrator** | Integrar `AutoAuthOrchestrator` | OAuth automático |
| **Subagents** | Usar `runtime.subagent.run()` | Briefings como subagentes |
| **Workspace Templates** | Adoptar estructura de `workspace/` | Consistencia |

### 2.3 Medio Plazo (Fase 3)

| Mejora | Cómo Integrar | Beneficio |
|--------|---------------|-----------|
| **Hook chaining** | Encadenar hooks para analytics | Pipeline de eventos |
| **Provider sync** | Sincronizar providers con cloud | Multi-device |

---

## 3. Propuesta de Evolución

### 3.1 Refactor Inmediato (1-2 días)

```typescript
// ANTES (custom)
const memory = await searchMemory(query)

// DESPUÉS (oficial)
import { runtime } from 'openclaw/plugin-sdk'
const memory = await runtime.tools.createMemorySearchTool({...})
```

### 3.2 Nueva Arquitectura de Hooks

```typescript
// secretary-extension/src/hooks.ts
export function registerSecretaryHooks(api: OpenClawPluginApi) {
  api.registerHook({
    name: 'inbound_claim',
    handler: async (message) => {
      if (message.text?.includes('briefing')) {
        return { claimed: true, response: await generateBriefing() }
      }
      return { claimed: false }
    }
  })

  api.registerHook({
    name: 'session_end',
    handler: async ({ sessionKey, messageCount }) => {
      await trackAnalytics(sessionKey, messageCount)
    }
  })
}
```

### 3.3 Briefing como Subagent

```typescript
// secretary-extension/src/briefing-subagent.ts
import { runtime } from 'openclaw/plugin-sdk'

export async function runBriefingAsSubagent(agentId: string) {
  const run = await runtime.subagent.run({
    prompt: 'Genera un briefing matutino...',
    agentId,
    tools: ['memory_search', 'calendar', 'email_summary'],
    timeout: 60000
  })

  const result = await runtime.subagent.waitForRun(run.id)
  return result.output
}
```

---

## 4. Compatibilidad

### 4.1 Breaking Changes Detectados

1. **Config Schema:** Requiere `OpenClawPluginConfigSchema`
2. **Tool Registration:** Requiere `OpenClawPluginToolOptions` con `name/names/optional`
3. **Session Hooks:** `session_start` ahora provee `{ sessionId, sessionKey }`
4. **Provider Auth:** Requiere `ProviderPluginWizardSetup` types

### 4.2 Migración Recomendada

```
1. Actualizar package.json con nuevas dependencias
2. Refactorizar tools para usar runtime.tools.*
3. Migrar hooks a nuevo formato
4. Actualizar tipos de sesión
5. Testear con pnpm test
```

---

## 5. Roadmap de Integración

```
Semana 1:
├── Reemplazar custom memory con runtime.tools
├── Implementar inbound_claim para briefings
└── Usar buildPluginStatusReport()

Semana 2:
├── Integrar AutoAuthOrchestrator
├── Implementar session hooks para analytics
└── Migrar a OpenClawPluginConfigSchema

Semana 3:
├── Briefing como subagent
├── Adoptar workspace templates
└── Full test suite

Semana 4:
├── Profiling y optimización
├── Documentación actualizada
└── Release v2.0
```

---

## 6. Estado de Implementación (Actualizado: 2026-03-20)

### ✅ Completado

| Feature | Status | Notes |
|---------|--------|-------|
| `inbound_claim` hook | ✅ Done | `src/hooks.ts:19-44` |
| `session_start` hook | ✅ Done | `src/hooks.ts:46-67` |
| `session_end` hook | ✅ Done | `src/hooks.ts:69-91` |
| `message_sending` hook | ✅ Done | `src/hooks.ts:93-117` |
| `buildPluginStatusReport` usage | ✅ Done | CLI already uses it |
| SecretaryOS Web App | ✅ Done | `apps/secretaryos-web/` |
| Supabase Integration | ✅ Done | Auth, Memories, Routines |
| Tests passing | ✅ Done | 19/19 tests pass |
| **Mobile Deep Link Handler** | ✅ Done | Uses OpenClaw device pairing |
| **AutoAuthOrchestrator Integration** | ✅ Done | Web UI + OAuth connections |
| **OAuth API Routes** | ✅ Done | `/api/oauth`, `/api/oauth/callback` |

### 🔄 En Progreso

| Feature | Status | Notes |
|---------|--------|-------|
| `runtime.tools.createMemorySearchTool()` | 🔄 Partial | Used in index.ts |

### 📋 Pendiente

| Feature | Priority | Notes |
|---------|----------|-------|
| Full memory migration to runtime.tools | Low | Current implementation works |
| Google Places API native calls | Low | Replace CLI calls |

---

## 7. Archivos de Referencia

- `src/saas/orchestrator.ts` - OAuth integration
- `src/plugins/hooks.ts` - Hook system completo
- `src/plugins/types.ts` - Plugin API types
- `src/plugins/runtime/` - Runtime API
- `src/cli/secretary-cli.ts` - CLI patterns
- `workspace/` - Workspace templates
