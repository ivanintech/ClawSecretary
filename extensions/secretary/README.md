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
- **Mobile-Edge OAuth Bridge (Phase 28)**: ✅ Established. "Cloud as a Bridge, Edge as the Brain." Next.js and Nango are used strictly as an ephemeral cloud router to perform OAuth dances (Notion, Google). The resulting `access_tokens` are instantly injected via secure WebSockets back into the user's local phone (`AutoAuthOrchestrator`) via the `/plugins/secretary/oauth-inject` listener, leaving zero storage footprint in the cloud. Long-term memory and vector embeddings live exclusively on the user's local device.

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

The `setup_proactive` action returns **two isolated `agentTurn` crons** (proactive-agent v3.1 pattern). These run autonomously — no user prompt needed:

```typescript
// Cron 1 — Daily briefing at 08:00 (isolated, NOT systemEvent)
{
  name: "Secretary Daily Briefing",
  schedule: { kind: "cron", expr: "0 8 * * *", tz: "Local" },
  payload: { kind: "agentTurn", message: "AUTONOMOUS: run briefing + send WA buttons" },
  sessionTarget: "isolated",
}

// Cron 2 — Pre-meeting research at each :45
{
  name: "Secretary Pre-Meeting Research",
  schedule: { kind: "cron", expr: "45 * * * *", tz: "Local" },
  payload: { kind: "agentTurn", message: "AUTONOMOUS: check next 15min meeting, research" },
  sessionTarget: "isolated",
}
```

### Real WhatsApp Business Payload

`briefing` and `conflict_guardian` return a ready-to-use `waInteractivePayload`:

```typescript
// conflict_guardian output.details.waInteractivePayload:
{
  messaging_product: "whatsapp",
  to: "34612345678",
  type: "interactive",
  interactive: {
    type: "button",
    body: { text: "⚠️ Conflicto: Dentista choca con Sprint Review. Mover a 16:15?" },
    action: { buttons: [
      { type: "reply", reply: { id: "btn_0", title: "✅ Sí, mover" } },
      { type: "reply", reply: { id: "btn_1", title: "❌ No, mantener" } }
    ]}
  }
}
// → Pass directly to secretary_whatsapp(action="send_buttons", ...)
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
- **Phase 16**: **Upstream Innovation Integration**. Integrated new core features from OpenClaw:
  - **Hyper-Diagnostic Logic**: Real-time health monitoring via `/healthz` and latency tracking.
  - **Knowledge Vault**: Native PDF analysis directly in the dashboard using the upstream's new ingestion engine.
  - **iOS Live Activity Mirroring**: Real-time "Dynamic Island" widget reflecting agent state (Thinking, Tokens, Heartbeat).
  - **Privacy-First Governance**: Dynamic switching between Ollama (Local) and OpenAI (Cloud) via `config.patch` and live embedding health checks.
  - **Autonomous Cron Orchestration**: `CronManager` UI with 1-click `cron.run` and `SecurityAudit` badge from `doctor.security.audit`.
- **Phase 17**: **Proactive Intelligence Layer** (SaaS Command Center):
  - **Opportunity Search**: Real-time Tavily web search via the `search_opportunities` orchestrator action. Results include AI Executive Summary and are WAL-logged.
  - **Magic Activation**: One-click button in the SaaS dashboard that calls `setup_proactive` → auto-registers both autonomous crons (`cron.add`) for the Daily Briefing (08:00) and Pre-Meeting Research (every :45 min).
  - **Proactive Control Panel**: Unified connection status cards for Google, Outlook, Tavily; global Intelligence badge; Calendar Sync trigger.
- **Phase 22**: **Intelligent Document Vault & Financial Guardian**.
  - **Document Ingestion**: Seamless PDF extraction using the native `Knowledge Vault` engine and `extractPdfContent`. Summaries persistent in WAL.
  - **Financial Guardian**: Advanced keyword-based triage for invoices, bills, and payments across Gmail and Outlook.
- **Phase 23**: **Voice AI & Audio Intelligence**.
  - **Native STT/TTS**: Complete migration to OpenClaw's native `PluginRuntime` for transcription and speech generation.
  - **Voice Intent Mapping**: Heuristic-based routing for voice notes: Commands (< 80 chars) vs. Brain Dumps (summaries).
  - **Omnichannel Voice Replies**: Ability to respond with synthesized audio directly via WhatsApp Business.
- **Phase 24**: **Proactive Contextual Awareness**: Autonomous monitoring of session state to provide proactive advice and interventions via WhatsApp.
- **Phase 25**: **Multimodal Financial Guardian** (Upstream 2026):
  - Transitioned to native `extractPdfContent` for multimodal document ingestion.
  - Automated detection of amounts, deadlines, and financial status in invoices and receipts.
- **Phase 26**: **Autonomous Lifestyle Hooks**:
  - Implemented `session_start` auto-briefings and `tool_result_persist` conflict guardian.
  - Silent `message_received` triage for non-intrusive background monitoring.
  - Voice Pipeline Optimization with real-time intent mapping.
- **Phase 27**: **Personal OS Hyper-Integration**:
  - Secure Vault Access via 1Password (op CLI).
  - Task Orchestration with Things 3 and Apple Reminders.
  - Digital Second Brain automation with Notion Sync.
  - Enriched Autonomous Briefings (Weather + News context).
- **Phase 28**: **SaaS Mobile-Edge Bridge ("Cloud as a Bridge, Edge as the Brain")**:
  - [x] Configured `embeddinggemma-300m-qat-Q8_0.gguf` for 100% local memory vectors.
  - [x] Established `Listener Mode` (webhook `/plugins/secretary/oauth-inject`) in local `AutoAuthOrchestrator` to catch payloads.
  - [x] Secured bridge with `SAAS_BRIDGE_TOKEN` verification.
  - [x] Integrated SaaS Dashboard with local listener for zero-storage OAuth routing.
  - [x] Standardized plugin route registration within the OpenClaw Gateway.
- **Phase 29**: **Secure Tunnel & PWA Enforcement**:
  - [x] **Asymmetric Tunnel**: RSA-2048 encryption for cross-origin token payloads.
  - [x] **Zero-Visibility Bridge**: SaaS Bridge handles only encrypted blobs.
  - [x] **PWA Dashboard**: Standalone mobile experience with `manifest.json` and service worker.
  - [x] **Edge Decryption**: Local private keys never leave the phone.
- **Phase 30**: **Hyper-Convenience 2026 (Logistics & Biometry)**:
  - [x] **Logistics Orchestrator**: Integrated `logistics_triage` for Uber/Delivery suggestions based on calendar events.
  - [x] **Biometry Hook**: Implementation of the `node_event` hook for real-time stress and fatigue detection. 
  - [x] **Proactive Resilience**: Automatic triggering of reduction actions when cognitive load is high.

---

## 🔧 Required Environment Variables

| Variable             | Required  | Purpose                                      |
| -------------------- | --------- | -------------------------------------------- |
| `MATON_API_KEY`      | ✅ Core   | Outlook + WhatsApp Business via Maton.ai     |
| `WA_PHONE_NUMBER_ID` | ✅ For WA | Meta WhatsApp Business Phone Number ID       |
| `WA_DEFAULT_PHONE`   | Optional  | Default WA recipient (international, no `+`) |
| `GOG_ACCOUNT`        | Optional  | Google Calendar via `gog` CLI                |
| `TAVILY_API_KEY`     | Optional  | Proactive meeting research                   |
| `CALENDLY_API_KEY`   | Optional  | Calendly booking management                  |

Get `MATON_API_KEY` at [maton.ai/settings](https://maton.ai/settings).
Get `WA_PHONE_NUMBER_ID` from [Meta Business Manager](https://business.facebook.com/).

---

---

## 🌟 Phase 17 — Proactive Intelligence (Delivered)

> **Status**: ✅ Complete. The SaaS dashboard is now a proactive command center.

### A. ✅ Magic Activation (One-Click Cron Setup)

Instead of manual `cron.add` calls, the SaaS dashboard has a **"Magic Activation"** button:

1. It calls `secretary_orchestrator(action="setup_proactive")` to get the cron parameters.
2. It then automatically registers both crons via `GatewayClient.addCron()`.
3. Crons appear immediately in the **Autonomous Cron Manager**.

```typescript
// GatewayClient — new methods
gateway.setupProactive(); // → retrieves cron params from orchestrator
gateway.addCron(params);  // → invokes cron.add on the real Gateway
```

### B. ✅ Opportunity Search (Live Tavily)

The `search_opportunities` orchestrator action:
- Executes the native `tavily_search.py` skill script.
- Returns structured results + an AI answer summary.
- Logs search activity to `SESSION-STATE.md` via WAL.
- Dashboard shows results with clickable links and an **AI Executive Summary** block.

### C. ✅ Proactive Control Panel
- Connection status for all integrations (Google, Outlook, Tavily, WhatsApp).
- Manual calendar sync trigger.
- Global "Intelligence" badge in the Governance header.

---

## 🌟 Phase 18 & 19 — Commercial Prep & Autonomous Crons (Delivered)

> **Status**: ✅ Complete. ClawSecretary now features a public commercial landing page and 5 autonomous intelligence crons.

### A. Commercial Landing Page
- Built a premium, glassmorphic public landing page at `apps/landing`.
- Highlights the "Digital Twin Executive" value proposition and WAL Protocol.

### B. ✅ 5 Autonomous Core Crons (`setup_proactive`)
The "Magic Activation" button in the SaaS dashboard now automatically registers **5 isolated `agentTurn` crons**:
1. **Daily Briefing (08:00)**: Weather-aware agenda briefing via WhatsApp.
2. **Pre-Meeting Research (every :45)**: Scans for meetings in 15 mins, uses Tavily to research the title, and the `summarize` skill if there's a link.
3. **Gmail Hourly Triager (0 *:*:*)**: Scans unread emails, classifies them (Critical, Action Required, FYI), and pushes critical ones to WhatsApp.
4. **RSS Intelligence Digest (Mon 07:30)**: Uses the `blogwatcher` skill to scan industry feeds and sends a 10-article digest to start the week.
5. **Memory Freshener (Sun 20:00)**: Analyzes the weekly WAL logs (`SESSION-STATE.md`) to update long-term user preferences.

---
 
 ## 🌟 Phase 20 — Deep Integrations & Voice (Delivered)
 
 > **Status**: ✅ Complete. ClawSecretary now supports omnichannel deep-links and voice commands.
 
 ### A. ✅ Voice-to-Task Engine (WhatsApp Audio)
 - Intercepts voice notes via the new `/secretary/wa-webhook`.
 - Transcribes locally using `openai-whisper` skill.
 - Autonomous execution of intents (e.g., "Schedule a meeting").
 
 ### B. ✅ Calendly Intelligence
 - Syncs new bookings and automatically performs **Tavily Prospect Research**.
 - Notifies the user via WhatsApp with a background summary of the invitee.
  ### C. ✅ Notion Second Brain
  - Exports WAL logs and session decisions to a centralized Notion Database ("ClawSecretary Second Brain").

---

## 🌟 Phase 22 & 23 — Document Intelligence & Voice AI (Delivered)

> **Status**: ✅ Complete. ClawSecretary is now a full-spectrum digital auditor and conversational voice partner.

### A. ✅ Financial & Document Guardian
- **Triage**: Automatic identification of financial documents in incoming streams.
- **Vaulting**: Direct ingestion of workspace PDFs with AI-generated summaries stored in the WAL.
- **Awareness**: The `memory_freshener` now digests financial patterns and ingested summaries for long-term consistency.

### B. ✅ High-Fidelity Voice Interaction
- **Transcribe & Route**: Audio messages are transcribed via the native runtime and routed to specific intent handlers or summary modules.
- **Conversational Responses**: Synthesized replies (TTS) confirm task execution, closing the voice-only feedback loop.
- **Local-First Processing**: Prioritizes local STT/TTS via the OpenClaw core to maintain privacy and reduce latency.
 
 ---
 
  ## 🗺️ Roadmap & Evolution

  - **Phase 28 & 29**: **Mobile-Edge Secure Bridge ("Cloud as a Bridge, Edge as the Brain")**.
    - [x] Configure `embeddinggemma-300m-qat-Q8_0.gguf` for 100% local memory vectors.
    - [x] Implement `Listener Mode` (webhook `/plugins/secretary/oauth-inject`) in local `AutoAuthOrchestrator`.
    - [x] **Secure Tunnel**: RSA-2048 asymmetric encryption for cross-origin token payloads.
    - [x] **PWA Dashboard**: Standalone mobile experience with standalone manifest and service worker.
    - [x] **Zero-storage pledge**: Ephemeral cloud routing with instant local injection.
    - **Architecture rules**: Ephemeral Cloud (Zero-storage), Instant Injection (Real-time RSA delivery), Local Sovereignty (Private keys & memory strictly on-device).

 ## 🛠️ Verification & Health Check

Verify the assistant's setup and workspace integrity at any time:

```bash
npx tsx extensions/secretary/verify-v2.ts
```

---

_Powered by [OpenClaw](https://github.com/openclaw/openclaw) & [IvanInTech Fork](https://github.com/ivanintech/openclaw)_ 🦞🚀
