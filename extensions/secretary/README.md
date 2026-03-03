# ClawSecretary: The Autonomous AI Event Manager 🦞

Welcome to **ClawSecretary**, a high-leverage SaaS extension for OpenClaw designed to transform your digital life into a streamlined, proactive experience. This project represents a state-of-the-art implementation of the "Digital Twin" concept for 2026.

## 🚀 The Vision: From Assistant to Partner

ClawSecretary doesn't just manage a calendar; it **owns** your schedule. Built on the **Hal Stack** methodology, it uses relentless resourcefulness to solve conflicts, research meetings, and keep you briefed via premium channels.

---

## 🛠️ Integrated Modules & Features

### 1. **Autonomous Intelligence (The Proactive Core)**

Located in `workspace/`, this module defines how the agent thinks and remembers.

- **SOUL.md**: Defines the "Owner" identity. The secretary initiates actions instead of waiting for prompts.
- **WAL Protocol (SESSION-STATE.md)**: A Write-Ahead Log that acts as the agent's RAM. Every user preference and decision is captured here _before_ a response is sent, ensuring zero context loss.
- **HEARTBEAT.md**: A self-monitoring loop that proactively scans for conflicts, prepares meeting research, and drafts surprises for the user.

### 2. **Omnichannel Orchestration**

The brains reside in `extensions/secretary/src/orchestrator.ts`.

- **Google Calendar (GOG)**: Seamless personal sync.
- **Outlook (Microsoft Graph)**: Premium corporate integration using Maton.ai managed OAuth.
- **Calendly**: Automated booking management.
- **Conflict Guardian**: Advanced logic that detects overlaps and suggests 15-minute buffered moves.
- **Premium Email Concierge**: Intelligent inbox triage and automated drafting for Outlook and Gmail. Features 1-click response buttons via WhatsApp.

### 3. **Premium Interaction Layer & Frictionless Onboarding**

- **WhatsApp Business**: Our primary notification channel. v2 supports interactive buttons for one-click briefings and conflict approvals.
- **ClawSecretary SaaS Dashboard**: A production-ready **React + Vite** frontend with a glassmorphic design. Centralizes agent status, WhatsApp pairing, and Privacy Node monitoring.
- **Zero-Touch OAuth (Auto-Auth)**: Using the `AutoAuthOrchestrator`, the SaaS captures tokens (Google/Outlook) and injects them silenty into the agent's `auth-profiles.json` via Magic Links.
- **SaaS Management Bridge**: Real-time integration via `GatewayClient`. Supports **Live QR Streaming** for WhatsApp and **Remote Commands** (e.g., Emergency Reboot) directly from the dashboard.

### 4. **Federated Architecture (SaaS + Mobile Edge)**

Built for the **Privacy-First** economy of 2026.

- **SaaS Orchestrator**: Manages high-availability cloud gateways.
- **Mobile Edge Node**: Runs directly on the user's phone. Handles sensitive tool execution (local file access, private messages) via a secure bridge.
- **Hybrid Intelligence**: The SaaS "Brain" uses SLM (Small Language Models) for triage while delegating sensitive tasks to the phone's local node.

---

## 📄 Technical Insights

### Persistent Stateful Memory

Unlike standard agents, ClawSecretary maintains its state across sessions via the WAL Protocol:

```markdown
# workspace/SESSION-STATE.md

- Capture Preference: "I prefer morning meetings for deep work"
- Stop & Write: Immediate persistence before replying.
```

### Proactive Orchestration Logic

Snippet from `orchestrator.ts` handling the daily heartbeat:

```typescript
if (params.action === "setup_proactive") {
  // Configures CronService for isolated agent turns
  const cronParams = {
    schedule: "0 8 * * *",
    payload: { kind: "agentTurn", message: "Generate briefing..." },
  };
}

// Zero-Touch OAuth Injection logic
await orchestrator.injectCloudProfiles({
  google_calendar: { token: "...", type: "oauth2" },
});
```

---

## 💡 Casos de Uso (Use Cases)

ClawSecretary brilla en situaciones donde la agenda convencional falla. Aquí algunos escenarios donde el SaaS aporta valor masivo:

### 1. El Ejecutivo "Context-Shifted"

Un usuario con una mañana llena de reuniones en **Outlook** y citas personales en **Google Calendar**.

- **Valor**: El secretario unifica ambas vidas y le envía un **WhatsApp Interactivo** a las 8:00 AM: _"Hoy tienes 5 reuniones. La de las 11:00 (Corporativa) choca con tu Dentista (Personal). ¿Quieres que mueva al Dentista a las 16:00? [SÍ] [NO]"_.

### 2. Preparación de Reuniones Proactiva

Antes de una reunión importante detectada en la agenda, el secretario utiliza el módulo `proactive_research`.

- **Valor**: 15 minutos antes, recibes: _"Investigación lista para tu reunión con 'X Tech': Su última ronda fue de $20M y el CEO acaba de publicar sobre IA. Aquí tienes los puntos clave para destacar en la conversación"_.

### 3. El Guardián del Tiempo de Enfoque

El usuario ha definido en su `SESSION-STATE.md` que prefiere mañanas libres para trabajo profundo.

- **Valor**: El secretario filtra el ruido y le presenta solo lo esencial. _"Ivan, tienes 40 correos nuevos. 37 son basura. 2 son informativos. Pero uno de 'Inversor Beta' es crítico. He redactado una respuesta aceptando la reunión de mañana. ¿La envío? [ENVIAR] [CORREGIR]"_.

### 5. El Perfil "Privacy-First" (Mobile Edge)

Un usuario que maneja documentos legales altamente confidenciales.

- **Valor**: El secretario procesa los documentos **dentro del propio teléfono** del usuario (Mobile Edge). Los metadatos y el triaje se hacen localmente, y la nube solo recibe resúmenes anonimizados para la orquestación. Los datos crudos nunca salen del dispositivo.

---

## 📈 Evolution Timeline (Git History)

- **Phase 1**: Initial CRUD extension and local calendar storage.
- **Phase 2**: Conflict detection and basic proactivity.
- **Phase 3**: Integration of `calendly`, `tavily`, and `gog`.
- **Phase 4**: **ClawSecretary v2 Evolution**. Implementation of the Hal Stack, WAL Protocol, and Maton Premium APIs (Outlook & WhatsApp).
- **Phase 8**: **Email Concierge & Proactive Triage**. Advanced inbox management with automated drafting and interactive WhatsApp briefings.
- **Phase 10**: **Federated Gateway & Mobile Edge**. Architectural shift to support local node execution on mobile devices for enhanced privacy.
- **Phase 11**: **Plug and Play Onboarding**. Implementation of the `headless-prompting` system and `openclaw onboard --headless`.
- **Phase 12**: **Zero-Touch OAuth (Cloud Sync)**. Creation of the `AutoAuthOrchestrator` for automated, non-interactive credential injection.
- **Phase 13**: **Federated Privacy Protocol**. Implementation of `secretary_privacy` tools for local mobile execution.
- **Phase 14**: **SaaS Dashboard Production**. Full React/Vite frontend with glassmorphic UI for full transparency and 1-click pairings.
- **Phase 15**: **SaaS Management Bridge (Dynamic Link)**. Implementation of real-time QR streaming and remote execution of system commands (Reboot) from the cloud dashboard.

---

## 🛠️ Verification & Health Check

Verify the assistant's setup and workspace integrity at any time:

```bash
npx tsx extensions/secretary/verify-v2.ts
```

---

_Powered by [OpenClaw](https://github.com/openclaw/openclaw) & [IvanInTech Fork](https://github.com/ivanintech/openclaw)_ 🦞🚀
