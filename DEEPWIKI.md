# Overview

# Overview
Relevant source files
- [.npmrc](https://github.com/openclaw/openclaw/blob/8090cb4c/.npmrc)
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts)
- [apps/ios/ShareExtension/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/ShareExtension/Info.plist)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/Info.plist)
- [apps/ios/WatchApp/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/WatchApp/Info.plist)
- [apps/ios/WatchExtension/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/WatchExtension/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8090cb4c/assets/avatar-placeholder.svg)
- [docs/channels/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/index.md)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md)
- [docs/docs.json](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/docs.json)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/getting-started.md)
- [docs/start/hubs.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/hubs.md)
- [docs/start/onboarding.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/onboarding.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard.md)
- [docs/zh-CN/channels/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/zh-CN/channels/index.md)
- [extensions/memory-lancedb/package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/memory-lancedb/package.json)
- [package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-lock.yaml)
- [pnpm-workspace.yaml](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-workspace.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/update-clawtributors.types.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program.ts)
- [src/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/package.json)

This page introduces OpenClaw: what it is, its overall architecture, and the role each major component plays. It covers the system at a level of detail sufficient to navigate the codebase and understand how subsystems relate.

For installation and first-run setup, see [Getting Started](/openclaw/openclaw/1.1-getting-started). For definitions of terms used throughout the codebase, see [Core Concepts](/openclaw/openclaw/1.2-core-concepts).

---

## What OpenClaw Is

OpenClaw is a self-hosted, personal AI assistant that you run on your own hardware. It exposes a single **Gateway** process — a combined WebSocket and HTTP server — that connects messaging channels (WhatsApp, Telegram, Discord, Signal, iMessage, Slack, and many more) to an AI agent runtime. The Gateway is the central control plane for sessions, routing, configuration, scheduling, and all connected clients.

The product is defined in [package.json1-10](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L1-L10) with description `"Multi-channel AI gateway with extensible messaging integrations"`. The runtime entry point is [src/index.ts1-93](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts#L1-L93) which loads environment, initializes console capture and runtime guards, then calls `buildProgram()` from [src/cli/program.ts1-2](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program.ts#L1-L2) to construct the CLI.

The current version is `2026.2.27` and requires Node ≥ 22.

---

## Monorepo Structure

The repository is a pnpm workspace ([pnpm-workspace.yaml1-17](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-workspace.yaml#L1-L17)) containing several distinct packages:
PathPurpose`.` (root)Core Gateway, CLI, agent runtime, channel integrations — the `openclaw` npm package`ui/`Browser-based Control UI (`openclaw-control-ui`, built with Vite + LitElement)`extensions/*`Channel and feature plugins (telegram, discord, slack, signal, whatsapp, matrix, feishu, msteams, etc.)`apps/ios/`iOS native node app (`ai.openclaw.ios`)`apps/macos/`macOS native node app (`ai.openclaw.mac`)`apps/android/`Android native node app (`ai.openclaw.android`)`packages/*`Internal packages (e.g., `clawdbot`, `moltbot`)
Sources: [pnpm-workspace.yaml1-17](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-workspace.yaml#L1-L17)[package.json1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L1-L50)[ui/package.json1-28](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/package.json#L1-L28)[apps/android/app/build.gradle.kts9-30](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L9-L30)[apps/ios/Sources/Info.plist1-88](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Info.plist#L1-L88)[apps/macos/Sources/OpenClaw/Resources/Info.plist1-30](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Sources/OpenClaw/Resources/Info.plist#L1-L30)

---

## System Topology

The following diagram maps the major runtime components to their primary code locations.

**System component topology with code entities**

```
Channel Extensions

AI Model Providers

Native Nodes

Control UI

Gateway (ws://127.0.0.1:18789)

CLI (openclaw)

Messaging Channels

Human

sends message

sends message

sends message

sends message

sends message

channel monitor

channel monitor

channel monitor

channel monitor

channel monitor

inbound dispatch

CLI commands

WebSocket RPC

browser

WebSocket RPC

WebSocket (node role)

WebSocket (node role)

WebSocket (node role)

API calls

User

Telegram

Discord

WhatsApp

Slack

iMessage / Signal / Matrix / etc.

src/index.ts
buildProgram()

GatewayServer
(message-handler.ts)

openclaw.json
(Zod schema validation)

sessions.json
+ transcript .jsonl files

Agent Runtime
(@mariozechner/pi-coding-agent)

Cron Service

MemorySearchManager
(SQLite / LanceDB)

ui/
OpenClawApp (LitElement)
GatewayBrowserClient

apps/ios/
ai.openclaw.ios

apps/macos/
ai.openclaw.mac

apps/android/
ai.openclaw.android

Anthropic / OpenAI / Ollama
OpenRouter / Gemini / MiniMax / etc.

extensions/telegram
extensions/discord
extensions/slack
extensions/signal
extensions/whatsapp
extensions/matrix
extensions/feishu
extensions/msteams
etc.
```

Sources: [src/index.ts1-93](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts#L1-L93)[package.json150-209](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L150-L209)[pnpm-workspace.yaml1-17](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-workspace.yaml#L1-L17)[apps/ios/Sources/Info.plist1-88](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Info.plist#L1-L88)[apps/android/app/build.gradle.kts9-30](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L9-L30)

---

## Key Components

### Gateway

The Gateway is the central process. All other components connect to it. It exposes a single multiplexed port (default `18789`) that serves:

- **WebSocket RPC** — all control traffic from the CLI, Control UI, channel plugins, and node apps
- **HTTP APIs** — `POST /tools/invoke` for external tool calls, OpenAI-compatible API surface
- **Served assets** — the Control UI SPA (browser dashboard)

The Gateway is responsible for:
ResponsibilityDescriptionSession managementCreates, stores, resets, and deletes conversation sessionsConfigurationLoads and hot-reloads `openclaw.json` via Zod schemaChannel coordinationMonitors inbound channel events and dispatches to the agentAgent executionRuns the embedded Pi agent runtime for each turnCron schedulingRuns scheduled jobs (`CronJob` records)Auth enforcementValidates tokens, passwords, device identity, and Tailscale headersMemory indexingDelegates to `MemorySearchManager` (SQLite or LanceDB backend)
For a full Gateway architecture breakdown, see [Gateway](/openclaw/openclaw/2-gateway).

### Agents

An agent is an isolated conversational context with its own workspace directory, session history, system prompt, and tool access. The runtime is built on `@mariozechner/pi-coding-agent` (see [package.json164-166](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L164-L166)). Each agent has:

- A **workspace directory** (default `~/.openclaw/workspace`) containing `AGENTS.md`, `SOUL.md`, `MEMORY.md`, and other injected prompt files
- A **session store** — conversations persisted in `sessions.json` and transcript `.jsonl` files
- A **model configuration** — primary model + fallback chain from one or more AI providers
- A **tool set** — exec, browser, memory search, subagent spawning, filesystem operations, etc.

For details on the agent execution pipeline and system prompt construction, see [Agents](/openclaw/openclaw/3-agents).

### Channels

Channels are messaging platform integrations. Each channel runs a monitor that receives inbound messages, normalizes them into a common format, and delivers them to the Gateway's agent runtime. On the outbound side, the Gateway delivers the agent reply back through the channel.

Most channels are implemented as extensions under `extensions/` and loaded as plugins. Core channels (Telegram, Discord, WhatsApp, Slack, Signal) ship in the root package; others (Matrix, Feishu, MS Teams, Google Chat, IRC, Mattermost, Zalo, etc.) are shipped as extension packages.

For channel integration details and the plugin SDK, see [Channels](/openclaw/openclaw/4-channels).

### Control UI

The Control UI is a browser-based single-page application (`ui/`) built with LitElement. It connects to the Gateway over WebSocket using the same RPC protocol as the CLI. It provides a dashboard for chat, session management, cron configuration, node status, agent management, and config editing.

It is built with Vite and served directly by the Gateway from its HTTP surface. See [Control UI](/openclaw/openclaw/5-control-ui).

### Native Nodes (Nodes)

Native node apps for iOS, macOS, and Android connect to the Gateway as clients with the `node` role. They expose device-local capabilities — camera, screen recording, location, notifications, voice wake, and canvas rendering — which the agent can invoke via `node.invoke` RPC calls. Nodes are paired to the Gateway via a pairing flow and authenticate with a device keypair.
AppBundle IDLanguageiOS`ai.openclaw.ios`SwiftmacOS`ai.openclaw.mac`SwiftAndroid`ai.openclaw.android`Kotlin / Compose
For node architecture and pairing, see [Native Clients (Nodes)](/openclaw/openclaw/6-native-clients-(nodes)).

### CLI

The `openclaw` CLI is the primary operator interface. Its entry point is [src/index.ts46-48](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts#L46-L48) which builds the command tree via `buildProgram()`. The CLI communicates with the running Gateway over WebSocket RPC for most operations (`gateway call`, `agent`, `sessions`, `cron`, `nodes`, `models`, etc.) and can also start or stop the Gateway daemon directly.

The CLI binary is published as `openclaw` in the npm package (`openclaw.mjs` as the bin entry, per [package.json17-18](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L17-L18)).

Sources: [src/index.ts46-93](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts#L46-L93)[src/cli/program.ts1-2](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program.ts#L1-L2)[package.json17-18](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L17-L18)[docs/cli/index.md1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md#L1-L100)

---

## Gateway Protocol and RPC

All clients (CLI, Control UI, channel plugins, node apps) communicate with the Gateway using a typed WebSocket RPC protocol. The protocol is built around three frame types:
Frame typeDirectionPurpose`RequestFrame`client → serverInvoke a named RPC method`ResponseFrame`server → clientReturn value for a request`EventFrame`server → clientPush event (agent output, session changes, etc.)
RPC methods are grouped by subsystem:
NamespaceExamples`agent.*``agent.run`, `agent.identity`, `agent.wait``chat.*``chat.history`, `chat.send`, `chat.abort`, `chat.inject``sessions.*``sessions.list`, `sessions.patch`, `sessions.reset`, `sessions.delete``cron.*``cron.add`, `cron.update`, `cron.remove`, `cron.run``config.*``config.get`, `config.apply`, `config.patch``nodes.*``nodes.status`, `nodes.invoke``mesh.*`Multi-gateway routing
For full protocol documentation, see [WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol).

---

## Gateway Internals (Code Entities)

The following diagram maps the internal Gateway subsystems to the code entities that implement them.

**Gateway internal subsystems with code entities**

```
Agent Runtime

Config Layer

Session Layer

RPC Methods

GatewayServer core

Inbound

WebSocket clients
(CLI, Control UI, Channels, Nodes)

HTTP clients
(/tools/invoke, OpenAI-compat)

message-handler.ts
WSHandler

Auth
(token / password / device identity / Tailscale)

RequestFrame
ResponseFrame
EventFrame
(protocol.schema.json)

agent.*

chat.*

sessions.*

cron.*

config.*

nodes.*

POST /tools/invoke

sessions.json

*.jsonl transcript files

openclaw.json (JSON5)

Zod schema
(validation + hot-reload)

@mariozechner/pi-coding-agent
runReplyAgent
runEmbeddedPiAgent

createOpenClawCodingTools()

MemorySearchManager
(SQLite / LanceDB)
```

Sources: [package.json163-166](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L163-L166)[docs/gateway/index.md1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md#L1-L100)[docs/cli/index.md140-200](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md#L140-L200)

---

## Configuration

All runtime configuration lives in `~/.openclaw/openclaw.json` (JSON5 format). The file is validated against a Zod schema on load and can hot-reload when the file changes on disk. The primary fields are:

```
{
  agent: {
    model: "anthropic/claude-opus-4-6",
  },
  channels: {
    telegram: { botToken: "..." },
    discord: { token: "..." },
  },
  gateway: {
    port: 18789,
    bind: "loopback",
    auth: { mode: "token" },
  },
}
```

For the full configuration reference, see [Configuration](/openclaw/openclaw/2.3-configuration) and [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference).

---

## Security Model

OpenClaw is designed as a **personal, single-operator** tool. The security model assumes one trusted user who controls the Gateway. Key defaults:

- The Gateway binds to loopback (`127.0.0.1`) by default.
- Auth is required for all WebSocket connections (shared token or password).
- Inbound DMs from unknown senders require a pairing approval by default (`dmPolicy: "pairing"`).
- Non-main sessions (groups, channels) can be sandboxed in Docker containers (`agents.defaults.sandbox.mode: "non-main"`).

Shared or multi-user deployments require explicit hardening. See [Security](/openclaw/openclaw/7-security) for the full model, [Security Audit](/openclaw/openclaw/7.1-security-audit) for the `openclaw security audit` command, and [Sandboxing](/openclaw/openclaw/7.2-sandboxing) for Docker-based isolation.

Sources: [README.md112-124](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L112-L124)[docs/start/onboarding.md30-36](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/onboarding.md#L30-L36)

---

## Supported AI Model Providers

The agent runtime supports multiple AI providers simultaneously, with primary and fallback model selection:
ProviderAuth methodAnthropic (Claude)API key or OAuth tokenOpenAI / OpenRouterAPI key or OAuth tokenOllamaLocal endpoint (auto-discovery)Google Gemini / Gemini CLIAPI key or OAuthMiniMaxAPI keyAWS BedrockAWS credentialsCustom OpenAI-compatibleBase URL + API key
Model configuration is covered in [Model Configuration & Authentication](/openclaw/openclaw/3.3-model-configuration-and-authentication).

---

## Supported Messaging Channels
ChannelExtension packageNotesTelegram`extensions/telegram`grammY SDKDiscord`extensions/discord`discord.js + slash commandsWhatsApp`extensions/whatsapp`Baileys (QR pairing)Slack`extensions/slack`Bolt SDK (socket + HTTP)Signal`extensions/signal`signal-cliiMessage (BlueBubbles)built-inRecommended iMessage pathiMessage (legacy)`extensions/imessage`macOS only, via `imsg`Matrix`extensions/matrix`matrix-bot-sdkFeishu/Lark`extensions/feishu`Lark Node SDKMicrosoft Teams`extensions/msteams`Bot FrameworkGoogle Chat`extensions/googlechat`Chat API webhookIRC`extensions/irc`—Mattermost`extensions/mattermost`—Zalo`extensions/zalo`—LINE`extensions/line`—Nextcloud Talk`extensions/nextcloud-talk`—WebChatbuilt-inServed by Gateway
Sources: [pnpm-workspace.yaml1-17](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-workspace.yaml#L1-L17)[docs/channels/index.md1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/index.md#L1-L50)[package.json150-209](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L150-L209)

---

## Related Pages
PagePurpose[Getting Started](/openclaw/openclaw/1.1-getting-started)Installation, `openclaw onboard`, first run[Core Concepts](/openclaw/openclaw/1.2-core-concepts)Definitions: Gateway, Agent, Node, Channel, Session, Workspace, Skill[Gateway](/openclaw/openclaw/2-gateway)GatewayServer architecture, HTTP/WS surfaces, startup[WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol)Frame structures, RPC semantics, event names[Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing)Auth modes, device keypairs, pairing flow[Configuration](/openclaw/openclaw/2.3-configuration)`openclaw.json` format, hot-reload, `$include`, SecretRef[Agents](/openclaw/openclaw/3-agents)Agent system overview, workspace, multi-agent isolation[Agent Execution Pipeline](/openclaw/openclaw/3.1-agent-execution-pipeline)End-to-end message → reply trace[Channels](/openclaw/openclaw/4-channels)Channel integrations, inbound/outbound flow, access control[Control UI](/openclaw/openclaw/5-control-ui)LitElement SPA, `OpenClawApp`, `GatewayBrowserClient`[Native Clients (Nodes)](/openclaw/openclaw/6-native-clients-(nodes))iOS/macOS/Android node apps, Bridge protocol, pairing[Security](/openclaw/openclaw/7-security)Trust model, attack surface, audit, sandboxing[Development Guide](/openclaw/openclaw/8-development-guide)Monorepo structure, conventions, CI/CD

---

# Getting-Started

# Getting Started
Relevant source files
- [README.md](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8090cb4c/assets/avatar-placeholder.svg)
- [docs/channels/googlechat.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/googlechat.md)
- [docs/channels/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/index.md)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md)
- [docs/cli/onboard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/onboard.md)
- [docs/concepts/models.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/models.md)
- [docs/docs.json](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/docs.json)
- [docs/gateway/authentication.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/authentication.md)
- [docs/gateway/background-process.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/background-process.md)
- [docs/gateway/doctor.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/doctor.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/troubleshooting.md)
- [docs/help/environment.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/environment.md)
- [docs/help/faq.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/faq.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/index.md)
- [docs/reference/wizard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/wizard.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/getting-started.md)
- [docs/start/hubs.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/hubs.md)
- [docs/start/onboarding.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/onboarding.md)
- [docs/start/setup.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/setup.md)
- [docs/start/wizard-cli-automation.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard-cli-automation.md)
- [docs/start/wizard-cli-reference.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard-cli-reference.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard.md)
- [docs/tools/skills-config.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/skills-config.md)
- [docs/tools/skills.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/skills.md)
- [docs/zh-CN/channels/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/zh-CN/channels/index.md)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/update-clawtributors.types.ts)
- [src/agents/bash-process-registry.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-process-registry.test.ts)
- [src/agents/bash-process-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-process-registry.ts)
- [src/agents/bash-tools.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.test.ts)
- [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.ts)
- [src/agents/pi-tools-agent-config.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools-agent-config.test.ts)
- [src/cli/banner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/banner.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program.ts)
- [src/cli/progress.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/progress.test.ts)
- [src/cli/progress.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/progress.ts)
- [src/cli/tagline.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/tagline.ts)
- [src/commands/configure.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/configure.ts)
- [src/commands/doctor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/doctor.ts)
- [src/commands/onboard-helpers.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-helpers.test.ts)
- [src/commands/onboard-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-helpers.ts)
- [src/commands/onboard-interactive.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-interactive.ts)
- [src/config/merge-config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/merge-config.ts)
- [src/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts)
- [src/terminal/theme.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/terminal/theme.ts)
- [src/wizard/onboarding.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/wizard/onboarding.ts)

This page covers prerequisites, installation, the `openclaw onboard` wizard, the `openclaw doctor` command, and verifying a working setup. It targets first-time users going from zero to a running Gateway.

For definitions of Gateway, Agent, Node, Channel, and Session, see [Core Concepts](/openclaw/openclaw/1.2-core-concepts). For deep Gateway configuration after setup is working, see [Configuration](/openclaw/openclaw/2.3-configuration). For the full CLI surface, see [Gateway](/openclaw/openclaw/2-gateway).

---

## Prerequisites
RequirementDetails**Node.js**Version 22 or newer (`node --version` to check)**Package manager**npm, pnpm, or bun; pnpm recommended for source builds**OS**macOS, Linux, or Windows via WSL2 (WSL2 strongly recommended on Windows)
The minimum runtime is enforced at process startup via `assertSupportedRuntime` before any commands run.

Sources: [src/index.ts44-45](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts#L44-L45)

---

## Installation

Three installation paths are supported:
MethodCommandUse case**Installer script (recommended)**`curl -fsSL https://openclaw.ai/install.sh | bash`Most users; handles PATH setup automatically**npm/pnpm global**`npm install -g openclaw@latest`Clean installs with Node already on PATH**From source**`git clone` + `pnpm install && pnpm build`Contributors and development
**macOS/Linux installer:**

```
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**

```
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**npm/pnpm:**

```
npm install -g openclaw@latest
# or
pnpm add -g openclaw@latest
```

**From source:**

```
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build   # auto-installs UI deps on first run
pnpm build      # produces dist/ and the openclaw binary
```

For source installs, `pnpm openclaw ...` runs TypeScript directly via `tsx`. `pnpm build` is needed before running via Node or the packaged binary. The development auto-reload loop uses `pnpm gateway:watch`.

Sources: [README.md52-108](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L52-L108)[src/index.ts1-10](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts#L1-L10)

---

## Running the Onboarding Wizard

`openclaw onboard` is the recommended first step after installing. It is an interactive wizard that configures auth, workspace, Gateway settings, channels, and optionally installs a background daemon.

```
openclaw onboard --install-daemon
```

`--install-daemon` installs the Gateway as a launchd user service (macOS) or systemd user unit (Linux/WSL2), keeping it running after the terminal closes.

### Wizard Code Flow

**Diagram: onboard command → code entities**

```
quickstart

advanced

openclaw onboard

runInteractiveOnboarding()
onboard-interactive.ts

runOnboardingWizard()
onboarding.ts

requireRiskAcknowledgement()

readConfigFileSnapshot()

WizardFlow
quickstart | advanced

QuickStart defaults
port:18789, loopback, token auth

Manual step-by-step prompts

applyOnboardingLocalWorkspaceConfig()
onboard-config.ts

promptAuthChoiceGrouped()
auth-choice-prompt.ts

promptDefaultModel()
model-picker.ts

configureGatewayForOnboarding()
onboarding.gateway-config.ts

Channel setup (optional)

Daemon install
--install-daemon flag

probeGatewayReachable()

Skills install (optional)

writeConfigFile()
→ ~/.openclaw/openclaw.json

applyWizardMetadata()
wizard.lastRunAt, lastRunVersion
```

Sources: [src/wizard/onboarding.ts71-450](https://github.com/openclaw/openclaw/blob/8090cb4c/src/wizard/onboarding.ts#L71-L450)[src/commands/onboard-interactive.ts9-30](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-interactive.ts#L9-L30)[src/commands/onboard-helpers.ts114-130](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-helpers.ts#L114-L130)

### QuickStart vs Advanced Mode

The first prompt is mode selection. QuickStart applies defaults and reduces the number of prompts.
SettingQuickStart DefaultAdvancedGateway bind`loopback` (127.0.0.1)Fully configurableGateway port`18789`Fully configurableGateway authToken (auto-generated)Token or PasswordTailscaleOffOff / Serve / FunnelModeLocalLocal or RemoteDM isolation`per-channel-peer`Configurable
`WizardFlow` is the internal type representing `"quickstart" | "advanced"`. The `"manual"` CLI value is normalized to `"advanced"` before processing.

Sources: [src/wizard/onboarding.ts104-137](https://github.com/openclaw/openclaw/blob/8090cb4c/src/wizard/onboarding.ts#L104-L137)

### What the Wizard Writes to Config

All wizard output is written to `~/.openclaw/openclaw.json` (`CONFIG_PATH`). The sections it populates:
Config keyWhat is set`agents.defaults.workspace`Workspace directory (default `~/.openclaw/workspace`)`agents.defaults.model`Primary model (e.g., `anthropic/claude-opus-4-6`)`gateway.mode``local` or `remote``gateway.port`Default `18789``gateway.bind``loopback`, `lan`, `tailnet`, `custom`, or `auto``gateway.auth.token`Auto-generated hex token (`randomToken()`)`gateway.tailscale.mode``off`, `serve`, or `funnel``channels.*`Channel tokens and allowlists`wizard.lastRunAt`ISO timestamp`wizard.lastRunVersion`Package version at run time`wizard.lastRunCommand``"onboard"`
Sources: [src/commands/onboard-helpers.ts40-130](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-helpers.ts#L40-L130)[src/wizard/onboarding.ts330-450](https://github.com/openclaw/openclaw/blob/8090cb4c/src/wizard/onboarding.ts#L330-L450)

### Key `onboard` Flags
FlagEffect`--install-daemon`Install Gateway as a launchd/systemd service`--flow quickstart|advanced`Skip the mode selection prompt`--non-interactive`Run without prompts; apply safe defaults`--reset`Clear config/credentials/sessions before running`--reset-scope full`Also remove the workspace on reset`--skip-channels`Skip the channel setup step`--skip-skills`Skip the skills install step`--auth-choice <choice>`Non-interactive: set auth method directly`--anthropic-api-key <key>`Non-interactive: provide API key`--gateway-port <port>`Override gateway port`--gateway-bind <mode>`Override bind address
Sources: [docs/cli/onboard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/onboard.md)[docs/cli/index.md325-375](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md#L325-L375)

---

## The `doctor` Command

`openclaw doctor` is the repair and migration tool. Run it after initial setup to catch misconfigurations, after upgrades to apply migrations, or any time something is not working as expected.

```
openclaw doctor
```

For headless or automated environments:

```
openclaw doctor --yes          # accept all defaults without prompting
openclaw doctor --non-interactive  # safe migrations only, no prompts
openclaw doctor --deep         # also scan for extra gateway service installs
```

### What `doctor` Checks

**Diagram: doctorCommand → check modules**

```
doctorCommand()
doctor.ts

noteSourceInstallIssues()
doctor-install.ts

loadAndMaybeMigrateDoctorConfig()
doctor-config-flow.ts

maybeRepairAnthropicOAuthProfileId()
noteAuthProfileHealth()
doctor-auth.ts

Generate gateway token
(if missing)

detectLegacyStateMigrations()
runLegacyStateMigrations()
doctor-state-migrations.ts

noteStateIntegrity()
noteSessionLockHealth()
doctor-state-integrity.ts

maybeRepairSandboxImages()
noteSandboxScopeWarnings()
doctor-sandbox.ts

maybeRepairGatewayServiceConfig()
doctor-gateway-services.ts

noteSecurityWarnings()
doctor-security.ts

checkGatewayHealth()
probeGatewayMemoryStatus()
doctor-gateway-health.ts

maybeRepairGatewayDaemon()
doctor-gateway-daemon-flow.ts

noteWorkspaceStatus()
doctor-workspace-status.ts

doctorShellCompletion()
doctor-completion.ts

writeConfigFile()
(if changes)
```

Sources: [src/commands/doctor.ts67-326](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/doctor.ts#L67-L326)
Check categoryWhat it examinesSource installVersion skew, build freshness issuesConfig validity`openclaw.json` against the Zod schemaAuth profilesOAuth and API key profiles; repairs Anthropic OAuth profile IDsGateway tokenEnsures `gateway.auth.token` is set; offers to generate oneLegacy stateOld session/agent file paths; migrates automaticallyState integritySession lock health; dangling lock filesSandbox imagesDocker image availability when sandboxing is configuredGateway servicesLaunchAgent/systemd unit config matches current settingsSecurityOpen DM policies, non-loopback bind without authGateway healthLive WebSocket probe; memory search statusDaemonService running status; offers restartWorkspaceWorkspace directory status; memory system suggestionsShell completionTab completion installation for bash/zsh/fish
Sources: [src/commands/doctor.ts94-315](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/doctor.ts#L94-L315)

### `doctor` Options
FlagEffect`--yes`Accept all prompts with defaults`--non-interactive`No prompts; safe migrations only`--deep`Scan system services for extra gateway instances`--fix` / `--repair`Apply recommended repairs`--generate-gateway-token`Generate and write a gateway token non-interactively`--no-workspace-suggestions`Suppress workspace memory hints
Sources: [docs/gateway/doctor.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/doctor.md)[docs/cli/index.md392-400](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md#L392-L400)

---

## Verifying a Working Setup

**Diagram: Verification sequence → Gateway components**

```
"Control UI (browser)"
"GatewayServer (ws://127.0.0.1:18789)"
"openclaw CLI (src/index.ts)"
User
"Control UI (browser)"
"GatewayServer (ws://127.0.0.1:18789)"
"openclaw CLI (src/index.ts)"
User
openclaw gateway status
RPC probe (WebSocket)
pong / error
"Runtime: running, RPC probe: ok"
openclaw status
health + agent + session snapshot
status report
summary
openclaw dashboard
opens http://127.0.0.1:18789/
WebSocket connection + token auth
OpenClawApp rendered
```

Sources: [src/index.ts46-93](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts#L46-L93)[docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/getting-started.md)

Run these commands in sequence to confirm a healthy install:

```
# 1. Is the gateway service running?
openclaw gateway status
 
# 2. Overall status snapshot
openclaw status
 
# 3. Open the Control UI in the browser
openclaw dashboard
 
# 4. Full health audit
openclaw doctor
```

### Expected Healthy Signals
CommandHealthy Output`openclaw gateway status``Runtime: running` and `RPC probe: ok``openclaw status`No blocking errors`openclaw doctor`No critical issues; config is valid`openclaw channels status`Channels show connected/ready
If the gateway does not start, check logs:

```
openclaw logs --follow
# or, if the RPC is down:
tail -f "$(ls -t /tmp/openclaw/openclaw-*.log | head -1)"
```

Sources: [docs/help/faq.md201-265](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/faq.md#L201-L265)[docs/gateway/troubleshooting.md16-30](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/troubleshooting.md#L16-L30)

---

## Key Environment Variables
VariableEffect`OPENCLAW_HOME`Overrides the home directory for all internal path resolution`OPENCLAW_STATE_DIR`Overrides the state directory`OPENCLAW_CONFIG_PATH`Overrides config file path (default `~/.openclaw/openclaw.json`)`OPENCLAW_GATEWAY_TOKEN`Gateway auth token; read by both CLI and Gateway at startup`OPENCLAW_GATEWAY_PASSWORD`Gateway password (alternative to token)`OPENCLAW_GATEWAY_PORT`Overrides gateway port (default `18789`)
Sources: [docs/start/getting-started.md104-112](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/getting-started.md#L104-L112)[docs/help/faq.md121-137](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/faq.md#L121-L137)

---

## Important Files and Paths
PathPurpose`~/.openclaw/openclaw.json`Primary config file (`CONFIG_PATH`)`~/.openclaw/workspace/`Default agent workspace root (`DEFAULT_AGENT_WORKSPACE_DIR`)`~/.openclaw/sessions.json`Session store`~/.openclaw/auth-profiles.json`Model provider auth profiles`~/.openclaw/credentials/`Channel credential storage (e.g., WhatsApp)`/tmp/openclaw/openclaw-*.log`Gateway log files
Sources: [src/commands/onboard-helpers.ts1-30](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-helpers.ts#L1-L30)[docs/help/faq.md90-96](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/faq.md#L90-L96)

---

## Minimal Config Example

If you bypass the wizard and want a minimal hand-written config:

```
{
  gateway: {
    mode: "local",
    auth: { mode: "token", token: "<your-token>" },
  },
  agents: {
    defaults: {
      model: "anthropic/claude-opus-4-6",
    },
  },
}
```

The Zod schema validates all fields at startup. An invalid config file prevents the Gateway from starting.

Sources: [README.md320-330](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L320-L330)[docs/index.md133-150](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/index.md#L133-L150)

---

## Next Steps
GoalWhere to goConnect WhatsApp, Telegram, Discord[Channels](/openclaw/openclaw/4-channels)Learn Gateway, Agent, Session concepts[Core Concepts](/openclaw/openclaw/1.2-core-concepts)Configure `openclaw.json` in detail[Configuration](/openclaw/openclaw/2.3-configuration)Understand the Gateway WebSocket protocol[WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol)Set up authentication and device pairing[Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing)Understand the agent execution pipeline[Agent Execution Pipeline](/openclaw/openclaw/3.1-agent-execution-pipeline)Run a security audit[Security Audit](/openclaw/openclaw/7.1-security-audit)

---

# Core-Concepts

# Core Concepts
Relevant source files
- [.npmrc](https://github.com/openclaw/openclaw/blob/8090cb4c/.npmrc)
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts)
- [apps/ios/ShareExtension/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/ShareExtension/Info.plist)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/Info.plist)
- [apps/ios/WatchApp/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/WatchApp/Info.plist)
- [apps/ios/WatchExtension/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/WatchExtension/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8090cb4c/assets/avatar-placeholder.svg)
- [docs/channels/googlechat.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/googlechat.md)
- [docs/channels/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/index.md)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md)
- [docs/cli/onboard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/onboard.md)
- [docs/concepts/models.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/models.md)
- [docs/docs.json](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/docs.json)
- [docs/gateway/authentication.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/authentication.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/troubleshooting.md)
- [docs/help/environment.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/environment.md)
- [docs/help/faq.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/faq.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/platforms/mac/release.md)
- [docs/reference/wizard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/wizard.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/getting-started.md)
- [docs/start/hubs.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/hubs.md)
- [docs/start/onboarding.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/onboarding.md)
- [docs/start/setup.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/setup.md)
- [docs/start/wizard-cli-automation.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard-cli-automation.md)
- [docs/start/wizard-cli-reference.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard-cli-reference.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard.md)
- [docs/tools/skills-config.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/skills-config.md)
- [docs/tools/skills.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/skills.md)
- [docs/zh-CN/channels/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/zh-CN/channels/index.md)
- [extensions/memory-lancedb/package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/memory-lancedb/package.json)
- [package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-lock.yaml)
- [pnpm-workspace.yaml](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-workspace.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/update-clawtributors.types.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program.ts)
- [src/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/package.json)

This page defines the fundamental terminology used throughout the OpenClaw codebase: Gateway, Agent, Node, Channel, Session, Workspace, Skill, and the personal-assistant trust model. Each term is mapped to the specific code entities and config keys that implement it.

For initial setup, see [Getting Started](/openclaw/openclaw/1.1-getting-started). For full configuration field details, see [Configuration](/openclaw/openclaw/2.3-configuration) and the [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference). For the WebSocket protocol that connects these components, see [WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol).

---

## Summary Table
ConceptRolePrimary Code EntityConfig Key**Gateway**Central control plane`GatewayServer``gateway.*`**Agent**AI runtime instance`runEmbeddedPiAgent` / `@mariozechner/pi-agent-core``agents.defaults.*`, `agents.list[]`**Node**Native device client`role: "node"` in `ConnectPolicy``nodes.*`**Channel**Messaging platform integration`ChannelPlugin` interface`channels.<platform>.*`**Session**Conversation thread`sessions.json` + `.jsonl` transcripts`session.*`**Workspace**Per-agent filesystem rootdirectory on disk`agents.defaults.workspace`**Skill**Tool-teaching extension`SKILL.md` (AgentSkills format)`skills.*`
---

## Concept-to-Code Entity Map

**Concepts mapped to their primary code representations**

```
Code / Config Entities

Concepts

Gateway

Agent

Node

Channel

Session

Workspace

Skill

GatewayServer
ws://127.0.0.1:18789

runEmbeddedPiAgent
@mariozechner/pi-agent-core

role: node
iOS / macOS / Android apps

ChannelPlugin
extensions/telegram, discord, slack ...

sessions.json
deriveSessionKey / resolveSessionKey

agents.defaults.workspace
~/.openclaw/workspace

SKILL.md
workspace/skills/name/
```

Sources: [src/index.ts1-73](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts#L1-L73)[README.md186-202](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L186-L202)[package.json163-166](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L163-L166)

---

## Gateway

The Gateway is the single long-running process that all other components connect to. It exposes:

- A **WebSocket RPC server** at `ws://127.0.0.1:18789` (default port) for CLI, Control UI, channel monitors, and device nodes
- An **HTTP server** on the same port for the Control UI SPA, `POST /tools/invoke`, and an OpenAI-compatible API surface

Internally, the Gateway hosts these subsystems:
SubsystemResponsibility`ConfigMgr`Loads and hot-reloads `openclaw.json` (JSON5), validated by Zod schema`SessionMgr`Manages session store, session keys, and JSONL transcripts`AgentRuntime`Runs the Pi agent pipeline per conversation turn`CronSvc`Scheduled job execution`MemoryMgr`Memory search (SQLite / LanceDB backends)`SecurityAudit`Config and runtime security checks
The WebSocket protocol uses structured frames (`RequestFrame`, `ResponseFrame`, `EventFrame`) with versioned RPC method namespaces: `agent.*`, `chat.*`, `sessions.*`, `cron.*`, `config.*`, `nodes.*`, `mesh.*`.

**Startup:**`openclaw gateway --port 18789` or via the daemon (`launchd` on macOS, `systemd` on Linux). Configuration is read from `~/.openclaw/openclaw.json`.

Sources: [README.md186-202](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L186-L202)[docs/gateway/index.md1-60](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md#L1-L60)

---

## Agent

An Agent is a named AI runtime instance. The Gateway can host multiple agents defined under `agents.list[]` with an `agents.defaults` base configuration.

Each agent has:

- Its own **workspace** directory (isolated filesystem root)
- Its own **sessions** (conversation threads, not shared with other agents)
- A **model** configuration (primary model + ordered fallbacks)
- A **system prompt** assembled at runtime from workspace files

The AI runtime is provided by `@mariozechner/pi-agent-core` and `@mariozechner/pi-coding-agent`. The entrypoint inside the Gateway is `runEmbeddedPiAgent` (called from `runReplyAgent`).

**Routing:** Inbound messages are routed to a specific agent via `bindings` configuration. Each binding maps a channel account or sender to an agent. For multi-agent setup details, see [Agents](/openclaw/openclaw/3-agents).

**Diagram: Agent configuration hierarchy**

```
agents.defaults

agents.list[]

bindings
channel account → agentId

agents.defaults.workspace
~/.openclaw/workspace

agents.defaults.model.primary
agents.defaults.model.fallbacks

agents.defaults.session.*
```

Sources: [README.md311-316](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L311-L316)[package.json163-166](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L163-L166)[docs/start/wizard.md87-103](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard.md#L87-L103)

---

## Node

A Node is a native device application that connects to the Gateway with the `node` client role (as opposed to the `operator` role used by CLI and Control UI). Nodes extend the Gateway with device-local capabilities.
PlatformBundle / App IDKey capabilitiesiOS`ai.openclaw.ios`Camera, Canvas, Voice Wake, Talk Mode, location, screen recordingmacOS`ai.openclaw.macos` (Clawdis)`system.run`, `system.notify`, Canvas, camera, menu barAndroid`ai.openclaw.android`Camera, Canvas, notifications, device info
A Node connects over the same Gateway WebSocket, completes the `connect.challenge` handshake, and registers its capability set. The Gateway and agents can then invoke node commands via `node.invoke` RPC calls.

Nodes are distinct from the Gateway host: when the Gateway runs on a remote server, nodes on a local device expose that device's peripherals to the agent via `node.invoke`.

Sources: [apps/ios/Sources/Info.plist1-88](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Info.plist#L1-L88)[apps/android/app/build.gradle.kts19-29](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L19-L29)[README.md233-252](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L233-L252)

---

## Channel

A Channel is a messaging platform integration. Each channel:

- Monitors inbound messages from the platform (using the platform's SDK or webhook)
- Delivers agent replies back to the platform
- Enforces access control policies (`dmPolicy`, `groupPolicy`, `allowFrom`)

All built-in and extension channels implement the `ChannelPlugin` interface from the Plugin SDK. Channel implementations live under `extensions/<platform>/`:
DirectoryPlatformSDK dependency`extensions/telegram`Telegram`grammy``extensions/discord`Discord`@buape/carbon` / discord API`extensions/slack`Slack`@slack/bolt``extensions/whatsapp`WhatsApp`@whiskeysockets/baileys``extensions/signal`Signal`signal-cli` (external)`extensions/feishu`Feishu/Lark`@larksuiteoapi/node-sdk``extensions/matrix`Matrix`@vector-im/matrix-bot-sdk``extensions/msteams`MS Teams`@microsoft/agents-hosting``extensions/googlechat`Google Chat`google-auth-library``extensions/line`LINE`@line/bot-sdk``extensions/mattermost`Mattermostinternal`extensions/irc`IRCinternal
Channel configuration lives under `channels.<platform>.*` in `openclaw.json`. For channel architecture details, see [Channel Architecture & Plugin SDK](/openclaw/openclaw/4.1-channel-architecture-and-plugin-sdk).

Sources: [pnpm-lock.yaml264-452](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-lock.yaml#L264-L452)[package.json168-195](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L168-L195)[docs/channels/index.md1-40](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/index.md#L1-L40)

---

## Session

A Session is a persisted conversation thread between a user and an agent.

**Session Key:** A structured string that identifies a session. Keys are derived by `deriveSessionKey()` from the channel, account, and peer (sender) context. The key format encodes agent, channel, and peer information (e.g., `agent:main:telegram:+15555550123`). `resolveSessionKey()` handles short-form references and aliasing.

**Storage:** Session metadata is stored in `sessions.json` (the session store). Message history is stored as JSONL files, one per session, with a filename derived from the session ID (UUID).

**Session key resolution and storage**

```
Inbound message
(channel + sender)

deriveSessionKey()
src/config/sessions.ts

Session Key
agent:agentId:channel:peer

resolveSessionKey()
(alias + short-form lookup)

resolveStorePath()
sessions.json location

sessions.json
(SessionStore)

sessionId.jsonl
(JSONL transcript)

loadSessionStore()
saveSessionStore()
```

**Session reset and lifecycle:**

- `/new` or `/reset` command starts a fresh session
- `session.resetPolicy` can auto-reset on a daily schedule or after idle timeout
- Compaction summarizes long histories when the context window fills

For full session management documentation, see [Session Management](/openclaw/openclaw/2.4-session-management).

Sources: [src/index.ts12-19](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts#L12-L19)[README.md148](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L148-L148)[docs/help/faq.md125-132](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/faq.md#L125-L132)

---

## Workspace

The Workspace is a directory on the Gateway host's filesystem that belongs to a single agent. It is the agent's working environment for file I/O, code, and memory.

**Default location:**`~/.openclaw/workspace` (configurable via `agents.defaults.workspace`)

Multiple agents each get their own workspace. Default workspaces for additional agents follow `~/.openclaw/workspace-<agentId>`.

**Workspace file layout:**

```
~/.openclaw/workspace/
├── AGENTS.md         # Agent instructions and persona
├── SOUL.md           # Identity / personality overrides
├── MEMORY.md         # Long-term memory notes (searchable)
├── TOOLS.md          # Tool documentation injected into system prompt
├── skills/
│   └── <skill-name>/
│       └── SKILL.md  # Per-skill instructions
└── <agent work files...>

```

These files are injected into the agent's system prompt by `buildAgentSystemPrompt` at the start of each turn. For the full system prompt construction logic, see [System Prompt](/openclaw/openclaw/3.2-system-prompt).

Sources: [README.md311-316](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L311-L316)[docs/help/faq.md91-96](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/faq.md#L91-L96)

---

## Skill

A Skill is an [AgentSkills](https://agentskills.io)-compatible directory that teaches the agent how to use a specific tool, API, or workflow. The primary artifact is a `SKILL.md` file that the agent reads as part of its system prompt.

**Types of skills:**
TypeLocationManaged byBundledShipped with OpenClaw in `skills/`OpenClaw packageManagedInstalled from ClawHub registry`openclaw skills` CLIWorkspaceUser-created under `workspace/skills/`Operator
The ClawHub registry (`clawhub.com`) allows the agent to discover and install new skills automatically.

Skills are activated at Gateway startup and their `SKILL.md` content is included in the tools section of the agent's system prompt. Skill installation state is tracked in config under `skills.*`.

Sources: [README.md312-313](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L312-L313)[docs/tools/skills.md1-30](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/skills.md#L1-L30)[package.json33](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L33-L33)

---

## Personal-Assistant Trust Model

OpenClaw is explicitly designed as a **single-operator** system. The Gateway is owned by one person; all channels, agents, and tools serve that operator. This model means the default security posture prioritizes convenience for the operator and safety against unknown external senders.

**Key design decisions:**

- **DM pairing by default:** Unknown senders receive a short pairing challenge code and are not processed until the operator approves them with `openclaw pairing approve <channel> <code>`
- **Exec runs on the Gateway host:** Shell commands run on the host machine (not sandboxed) for the `main` session — giving the agent full access for personal use
- **Sandbox is opt-in:** Setting `agents.defaults.sandbox.mode: "non-main"` moves non-main sessions (groups, channels with unknown senders) into per-session Docker containers

**DM access policy flow**

```
pairing

allowlist

open

disabled

approved

not approved

sender in allowFrom

sender not in allowFrom

Inbound DM
(unknown sender)

dmPolicy

pairing (default)
Send challenge code
openclaw pairing approve

allowlist
Check allowFrom array

open
Accept all
requires explicit opt-in

disabled
Drop silently

Message sent to agent

Message dropped
```

**Config keys for the trust model:**
Config keyValuesEffect`channels.<platform>.dmPolicy``pairing` (default), `allowlist`, `open`, `disabled`Controls DM access`channels.<platform>.allowFrom`Array of sender IDs or `["*"]`Explicit allowlist`channels.<platform>.groupPolicy``open`, `allowlist`, `disabled`Group message access`agents.defaults.sandbox.mode``off`, `non-main`, `all`Docker sandbox scope
**Exec approval levels** control what shell commands the agent can run without prompting the operator. The exec approvals subsystem maintains a `safe bins` allowlist and supports `ask` and `security` modes.

`openclaw doctor` can detect and flag misconfigured DM policies (e.g., `dmPolicy: "allowlist"` with an empty `allowFrom`).

For a full security overview and the audit command, see [Security](/openclaw/openclaw/7-security) and [Security Audit](/openclaw/openclaw/7.1-security-audit). For sandboxing details, see [Sandboxing](/openclaw/openclaw/7.2-sandboxing). For exec approval mechanics, see [Exec Tool & Exec Approvals](/openclaw/openclaw/3.4.1-exec-tool-and-exec-approvals).

Sources: [README.md112-124](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L112-L124)[README.md332-339](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L332-L339)[docs/help/faq.md83-89](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/faq.md#L83-L89)

---

# Gateway

# Gateway
Relevant source files
- [README.md](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8090cb4c/assets/avatar-placeholder.svg)
- [docs/channels/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/index.md)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md)
- [docs/docs.json](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/docs.json)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/index.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/getting-started.md)
- [docs/start/hubs.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/hubs.md)
- [docs/start/onboarding.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/onboarding.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard.md)
- [docs/zh-CN/channels/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/zh-CN/channels/index.md)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/clawtributors-map.json)
- [scripts/protocol-gen-swift.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/protocol-gen-swift.ts)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/update-clawtributors.types.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program.ts)
- [src/discord/monitor/thread-bindings.shared-state.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/thread-bindings.shared-state.test.ts)
- [src/gateway/protocol/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/index.ts)
- [src/gateway/protocol/schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema.ts)
- [src/gateway/protocol/schema/protocol-schemas.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/protocol-schemas.ts)
- [src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/types.ts)
- [src/gateway/server-methods-list.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts)
- [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts)
- [src/gateway/server.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server.ts)
- [src/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/index.ts)

This page describes the `GatewayServer` — its role as the central control plane, the network surfaces it exposes, how it starts up, and how all subsystems attach to it.

For the WebSocket protocol details (frames, handshake, RPC semantics), see [WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol). For authentication modes and device pairing, see [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing). For `openclaw.json` configuration, see [Configuration](/openclaw/openclaw/2.3-configuration).

---

## Role

The Gateway is the single always-on process that bridges messaging channels, AI agents, CLI clients, the browser Control UI, and native device nodes. Every subsystem — channels, sessions, cron, memory, security audit — attaches to it at startup. No subsystem communicates with another directly; all routing goes through the Gateway.

Sources: [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md)[README.md185-201](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L185-L201)

---

## Network Surface

The Gateway exposes a single multiplexed port for all traffic:
Traffic typeProtocolDefault addressWebSocket RPC (clients, CLI, nodes)`ws://``ws://127.0.0.1:18789`Control UI (browser SPA)HTTP`http://127.0.0.1:18789/`OpenAI-compatible APIHTTP`http://127.0.0.1:18789/…`Tools invoke endpoint`POST /tools/invoke``http://127.0.0.1:18789/tools/invoke`Hooks and webhooksHTTP`http://127.0.0.1:18789/…`
**Port resolution order:**`--port` CLI flag → `OPENCLAW_GATEWAY_PORT` env var → `gateway.port` config key → `18789`

**Bind mode resolution:** CLI/override → `gateway.bind` → `loopback` (default)

Auth is required by default. Non-loopback binds (`lan`, `tailnet`, `custom`) refuse to start without `gateway.auth.token` or `gateway.auth.password` configured.

Sources: [docs/gateway/index.md70-85](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md#L70-L85)[README.md213-226](https://github.com/openclaw/openclaw/blob/8090cb4c/README.md#L213-L226)

---

## Server Startup

The entry point for starting the Gateway is `startGatewayServer`, exported from `src/gateway/server.ts`. The implementation lives in `src/gateway/server.impl.ts`.

```
startGatewayServer(options: GatewayServerOptions) → GatewayServer

```

`GatewayServerOptions` controls port, bind address, auth mode, hot-reload mode, Tailscale settings, and which subsystems to initialize. `GatewayServer` is the returned handle used for lifecycle control (stop, restart).

The CLI surface for running the Gateway is `openclaw gateway [--port N] [--bind …] [--verbose]`. The service management commands (`gateway install`, `gateway start`, `gateway stop`, `gateway restart`) wrap a launchd/systemd unit that calls `openclaw gateway` with the configured arguments.

Sources: [src/gateway/server.ts1-4](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server.ts#L1-L4)[docs/cli/index.md731-779](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md#L731-L779)

---

## Internal Architecture

**Gateway internal component map**

```
Subsystems

coreGatewayHandlers (server-methods.ts)

server.impl.ts (GatewayServer)

Network Layer

WebSocket Clients
(CLI, Control UI, Channels, Nodes)

HTTP Clients
(/tools/invoke, OpenAI-compat)

WS Message Handler
(message-handler.ts)

Auth / Role Check
(authorizeGatewayMethod)

handleGatewayRequest
(server-methods.ts)

Control Plane Rate Limiter
(control-plane-rate-limit.ts)

agentHandlers

chatHandlers

sessionsHandlers

cronHandlers

configHandlers

nodeHandlers

skillsHandlers

...25+ more handler modules

Session Store
(sessions.json)

OpenClawConfig
(openclaw.json)

Cron Service

Agent Runtime
(runReplyAgent)

MemorySearchManager

runSecurityAudit
```

Sources: [src/gateway/server-methods.ts1-149](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts#L1-L149)[src/gateway/server.ts1-4](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server.ts#L1-L4)

---

## Subsystems Attached at Startup
SubsystemPrimary roleKey file/functionConfiguration ManagerLoads, validates, and hot-reloads `openclaw.json``loadConfig` in `src/config/config.ts`Session ManagerTracks sessions, transcripts, reset policies`loadSessionStore` / `sessions.json`Cron ServiceSchedules and executes timed jobs`cronHandlers` in `src/gateway/server-methods/cron.ts`Agent RuntimeRuns conversational turns via the Pi agent`agentHandlers` in `src/gateway/server-methods/agent.ts`Memory Search ManagerVector/BM25 memory search for agents`MemorySearchManager`Security AuditScans config and state for security issues`runSecurityAudit`Channel PluginsMonitors messaging platforms inbound/outbound`listChannelPlugins()` in `src/channels/plugins/index.ts`Control UIBrowser SPA served from the Gateway HTTP surface`webHandlers`Node RegistryManages paired native device nodes`nodeHandlers`
Sources: [src/gateway/server-methods.ts66-95](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts#L66-L95)[src/gateway/server-methods-list.ts1-127](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts#L1-L127)

---

## Request Dispatch Pipeline

Every WebSocket RPC call goes through the same three-stage pipeline:

**Gateway RPC dispatch pipeline**

```
unauthorized

ok

rate limited

ok

missing

found

Inbound WS frame
(RequestFrame)

Is first frame connect?
(connect handler)

authorizeGatewayMethod
(role + scopes)

consumeControlPlaneWriteBudget
(config.apply, config.patch, update.run)

handler = coreGatewayHandlers[method]
|| extraHandlers[method]

respond: unknown method
(ErrorCodes.INVALID_REQUEST)

handler(req, params, client, respond, context)

respond: error
```

The `handleGatewayRequest` function in [src/gateway/server-methods.ts97-149](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts#L97-L149) implements this pipeline.

`authorizeGatewayMethod` checks:

1. The client's `role` field from the connect params (`operator` or `node`).
2. The client's `scopes` array for scope-gated methods.
3. The `ADMIN_SCOPE` bypass for fully-trusted operators.

`CONTROL_PLANE_WRITE_METHODS` (the set `{"config.apply", "config.patch", "update.run"}`) is subject to an additional rate limit of 3 calls per 60 seconds per actor.

Sources: [src/gateway/server-methods.ts36-149](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts#L36-L149)

---

## RPC Method Namespaces

All built-in server methods are assembled in `coreGatewayHandlers`[src/gateway/server-methods.ts66-95](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts#L66-L95) Handler modules are imported from `src/gateway/server-methods/`.
NamespaceHandler moduleExample methods`agent.*``agent.ts``agent`, `agent.identity.get`, `agent.wait``agents.*``agents.ts``agents.list`, `agents.create`, `agents.update`, `agents.delete`, `agents.files.*``chat.*``chat.ts``chat.history`, `chat.send`, `chat.abort``sessions.*``sessions.ts``sessions.list`, `sessions.patch`, `sessions.reset`, `sessions.delete`, `sessions.compact``cron.*``cron.ts``cron.list`, `cron.add`, `cron.update`, `cron.remove`, `cron.run`, `cron.runs``config.*``config.ts``config.get`, `config.set`, `config.apply`, `config.patch`, `config.schema``node.*``nodes.ts``node.list`, `node.describe`, `node.invoke`, `node.pair.*`, `node.rename``device.*``devices.ts``device.pair.list`, `device.pair.approve`, `device.token.rotate``exec.*``exec-approvals.ts``exec.approvals.get`, `exec.approvals.set`, `exec.approval.request`, `exec.approval.resolve``skills.*``skills.ts``skills.status`, `skills.bins`, `skills.install`, `skills.update``models.*``models.ts``models.list``browser.*``browser.ts``browser.request``tts.*``tts.ts``tts.status`, `tts.convert`, `tts.enable`, `tts.disable``wizard.*``wizard.ts``wizard.start`, `wizard.next`, `wizard.cancel`, `wizard.status``send` / `agent``send.ts` / `agent.ts`Outbound messaging and agent turn`health``health.ts`Gateway health snapshot`logs.tail``logs.ts`Streaming log tail`update.run``update.ts`Self-update trigger
Channel plugins may add additional methods via `plugin.gatewayMethods`. The full merged list is returned by `listGatewayMethods()` in [src/gateway/server-methods-list.ts101-104](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts#L101-L104)

Sources: [src/gateway/server-methods-list.ts1-104](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts#L1-L104)[src/gateway/server-methods.ts6-34](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts#L6-L34)

---

## Gateway Events

The Gateway pushes unsolicited `EventFrame` messages to connected clients. The full list is defined in `GATEWAY_EVENTS` at [src/gateway/server-methods-list.ts106-126](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts#L106-L126):
Event nameWhen emitted`connect.challenge`Immediately after the WebSocket is opened, before auth completes`agent`During an agent turn (streaming partial results, tool calls, final reply)`chat`WebChat messages`presence`Connected client / session presence changes`tick`Periodic heartbeat tick`talk.mode`Talk mode state changes`shutdown`Gateway is about to close (graceful shutdown)`health`Health state changes`heartbeat`Scheduled heartbeat delivery`cron`Cron scheduler events`node.pair.requested` / `node.pair.resolved`Node pairing lifecycle`device.pair.requested` / `device.pair.resolved`Device pairing lifecycle`node.invoke.request`Node tool invocation request forwarded to a node client`voicewake.changed`Voice wake configuration changed`exec.approval.requested` / `exec.approval.resolved`Exec approval lifecycle`update.available`A new version is available
Sources: [src/gateway/server-methods-list.ts106-126](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts#L106-L126)

---

## Hot Reload

The Gateway watches `openclaw.json` for changes. The reload behavior is controlled by `gateway.reload.mode`:
ModeBehavior`off`No automatic reload`hot`Applies only changes that are safe to apply without restarting`restart`Restarts the process when a reload-required change is detected`hybrid` (default)Hot-applies safe changes; restarts for others
The active config file path is resolved from the `OPENCLAW_CONFIG_PATH` environment variable, or from the profile/state defaults.

Sources: [docs/gateway/index.md86-93](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md#L86-L93)

---

## Service Management

The Gateway can be installed as a supervised OS service:
PlatformMechanismService labelmacOSlaunchd LaunchAgent`ai.openclaw.gateway` (or `ai.openclaw.<profile>`)Linuxsystemd user unit`openclaw-gateway[-<profile>].service`
Commands:

```
openclaw gateway install     # install service
openclaw gateway start       # start service
openclaw gateway stop        # stop service
openclaw gateway restart     # restart service
openclaw gateway status      # probe + print runtime status
```

`gateway status` probes the Gateway RPC and reports `Runtime: running` and `RPC probe: ok` for a healthy instance.

Sources: [docs/gateway/index.md125-168](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md#L125-L168)[docs/cli/index.md757-779](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/index.md#L757-L779)

---

## Common Failure Signatures
Log / error messageCause`refusing to bind gateway … without auth`Non-loopback bind configured without auth token/password`another gateway instance is already listening` / `EADDRINUSE`Port conflict with another process`Gateway start blocked: set gateway.mode=local``gateway.mode` is set to `remote` in config`unauthorized` during connectAuth token or password mismatch between client and Gateway`device identity required`Client connected without completing device identity challenge`rate limit exceeded for config.apply`More than 3 control-plane write calls in 60 seconds
Sources: [docs/gateway/index.md235-244](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md#L235-L244)[docs/gateway/troubleshooting.md128-140](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/troubleshooting.md#L128-L140)[src/gateway/server-methods.ts106-130](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts#L106-L130)

---

## Relationship to Other Components

**How clients and subsystems connect to the Gateway**

```
Inbound Channels

Nodes (role=node)

Operators (role=operator)

WebSocket RPC

WebSocket RPC

WebSocket RPC

WebSocket (node role)

WebSocket (node role)

WebSocket (node role)

channel monitor

channel monitor

channel monitor

channel monitor

openclaw CLI
(buildProgram)

Control UI SPA
(OpenClawApp)

WebChat
(chat.* methods)

iOS App
(Clawdis)

macOS App
(Clawdis)

Android App
(Clawdis)

Telegram
(grammY)

Discord
(discord.js)

WhatsApp
(Baileys)

Slack, Signal, iMessage, etc.

GatewayServer
ws://127.0.0.1:18789
(startGatewayServer)
```

- For the full WebSocket protocol (frames, handshake, RPC semantics), see [WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol).
- For authentication modes, see [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing).
- For `openclaw.json` configuration, see [Configuration](/openclaw/openclaw/2.3-configuration).
- For session lifecycle, see [Session Management](/openclaw/openclaw/2.4-session-management).
- For scheduled jobs, see [Cron Service](/openclaw/openclaw/2.5-cron-service).
- For agent execution, see [Agents](/openclaw/openclaw/3-agents).
- For channel integrations, see [Channels](/openclaw/openclaw/4-channels).
- For the browser Control UI, see [Control UI](/openclaw/openclaw/5-control-ui).
- For native device nodes, see [Native Clients (Nodes)](/openclaw/openclaw/6-native-clients-(nodes)).
- For security subsystems, see [Security](/openclaw/openclaw/7-security).

Sources: [src/gateway/server-methods.ts1-149](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts#L1-L149)[src/gateway/server-methods-list.ts1-127](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts#L1-L127)[docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/index.md)

---

# WebSocket-Protocol

# WebSocket Protocol
Relevant source files
- [docs/gateway/protocol.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/protocol.md)
- [docs/gateway/tools-invoke-http-api.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/tools-invoke-http-api.md)
- [scripts/protocol-gen-swift.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/protocol-gen-swift.ts)
- [src/agents/tool-policy-pipeline.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-policy-pipeline.test.ts)
- [src/agents/tool-policy-pipeline.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-policy-pipeline.ts)
- [src/cli/program/message/helpers.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program/message/helpers.test.ts)
- [src/cli/program/message/helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program/message/helpers.ts)
- [src/discord/monitor/thread-bindings.shared-state.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/thread-bindings.shared-state.test.ts)
- [src/gateway/auth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/auth.test.ts)
- [src/gateway/auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/auth.ts)
- [src/gateway/call.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/call.test.ts)
- [src/gateway/call.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/call.ts)
- [src/gateway/client.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts)
- [src/gateway/net.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/net.test.ts)
- [src/gateway/net.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/net.ts)
- [src/gateway/protocol/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/index.ts)
- [src/gateway/protocol/schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema.ts)
- [src/gateway/protocol/schema/frames.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/frames.ts)
- [src/gateway/protocol/schema/protocol-schemas.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/protocol-schemas.ts)
- [src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/types.ts)
- [src/gateway/role-policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/role-policy.test.ts)
- [src/gateway/role-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/role-policy.ts)
- [src/gateway/server-methods-list.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts)
- [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts)
- [src/gateway/server.auth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server.auth.test.ts)
- [src/gateway/server.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server.ts)
- [src/gateway/server/ws-connection/connect-policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/connect-policy.test.ts)
- [src/gateway/server/ws-connection/connect-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/connect-policy.ts)
- [src/gateway/server/ws-connection/message-handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts)
- [src/gateway/test-helpers.server.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/test-helpers.server.ts)
- [src/gateway/tools-invoke-http.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/tools-invoke-http.test.ts)
- [src/gateway/tools-invoke-http.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/tools-invoke-http.ts)
- [src/tui/gateway-chat.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/tui/gateway-chat.test.ts)

This page documents the Gateway WebSocket protocol: frame types, connection handshake, RPC request/response semantics, server-push event semantics, protocol versioning, and the complete method and event reference.

Authentication mechanisms (token, password, Tailscale, device keypairs) are covered in [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing). Gateway configuration (`openclaw.json`) is in [Configuration](/openclaw/openclaw/2.3-configuration). The HTTP surface (`POST /tools/invoke`) is a separate channel and is not part of this protocol.

---

## Transport

The Gateway listens on `ws://127.0.0.1:18789` by default. TLS (`wss://`) is supported for remote access. All messages are **text frames carrying UTF-8 JSON**. Binary frames are not used.

Size limits enforced server-side are defined in `src/gateway/server-constants.ts` as `MAX_PAYLOAD_BYTES` (max inbound message size) and `MAX_BUFFERED_BYTES` (max write-queue backpressure before a slow-client close). The client sets `maxPayload: 25 * 1024 * 1024` (25 MiB) to accommodate large node canvas snapshots.

Sources: [src/gateway/client.ts139-141](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L139-L141)[src/gateway/server/ws-connection/message-handler.ts65](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts#L65-L65)

---

## Protocol Version

`PROTOCOL_VERSION` is exported from `src/gateway/protocol/index.ts` (currently `3`). Every `connect` request carries `minProtocol` and `maxProtocol`. The server rejects a connection when:

```
maxProtocol < PROTOCOL_VERSION  OR  minProtocol > PROTOCOL_VERSION

```

A version mismatch causes WebSocket close code `1002` with reason `"protocol mismatch"` and an error response carrying `details: { expectedProtocol: PROTOCOL_VERSION }`.

Sources: [src/gateway/protocol/index.ts159](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/index.ts#L159-L159)[src/gateway/server/ws-connection/message-handler.ts435-450](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts#L435-L450)

---

## Frame Types

All frame schemas are defined in `src/gateway/protocol/schema/frames.ts` and re-exported through `src/gateway/protocol/schema.ts` and `src/gateway/protocol/index.ts`. Runtime AJV validators are compiled in `src/gateway/protocol/index.ts`.

**Frame type hierarchy:**

```
GatewayFrameSchema
(union)

RequestFrameSchema
type: "req"

ResponseFrameSchema
type: "res"

EventFrameSchema
type: "event"

id: string
method: string
params?: unknown

id: string
ok: boolean
payload?: unknown
error?: ErrorShape

event: string
payload?: unknown
seq?: number
```

Sources: [src/gateway/protocol/schema/frames.ts1-120](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/frames.ts#L1-L120)[src/gateway/protocol/index.ts241-244](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/index.ts#L241-L244)
FrameDirectionValidatorKey Fields`RequestFrame`Client → Server`validateRequestFrame``type: "req"`, `id`, `method`, `params?``ResponseFrame`Server → Client`validateResponseFrame``type: "res"`, `id`, `ok`, `payload?`, `error?``EventFrame`Server → Client`validateEventFrame``type: "event"`, `event`, `payload?`, `seq?`
Sources: [src/gateway/protocol/index.ts241-244](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/index.ts#L241-L244)

---

## Connection Handshake

The first message a client sends **must** be a `connect` request. Before the client can send that request, the server emits a `connect.challenge` event. The `nonce` from that event must be included in the `connect` request (and in the device signature if device auth is used).

**Handshake sequence:**

```

```

Sources: [src/gateway/client.ts356-368](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L356-L368)[src/gateway/server/ws-connection/message-handler.ts364-406](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts#L364-L406)

If the first message is not a valid `connect` request, the server responds with an error and closes the connection with code `1008`.

### connect.challenge

Sent by the server immediately after the socket opens, before any client message arrives:

```
{
  "type": "event",
  "event": "connect.challenge",
  "payload": { "nonce": "<uuid>", "ts": 1737264000000 }
}
```

The `nonce` must be included verbatim as `device.nonce` in `ConnectParams`, and it must be incorporated into the device signature payload. The server enforces a clock-skew tolerance of 2 minutes (`DEVICE_SIGNATURE_SKEW_MS`). A missing or mismatched nonce returns a structured error with detail codes from `ConnectErrorDetailCodes`.

Sources: [src/gateway/server/ws-connection/message-handler.ts91](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts#L91-L91)[src/gateway/server/ws-connection/message-handler.ts654-676](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts#L654-L676)

### ConnectParams

The `connect` method's parameter schema is `ConnectParamsSchema` in `src/gateway/protocol/schema/frames.ts`. The client builds and sends this via `GatewayClient.sendConnect()`.
FieldTypeNotes`minProtocol``number`Minimum protocol version the client supports`maxProtocol``number`Maximum protocol version the client supports`client.id``string`Well-known client identifier (e.g. `"cli"`, `"control-ui"`, `"node-host"`)`client.version``string`Client software version`client.platform``string`OS platform string (e.g. `"macos"`, `"ios"`, `"linux"`)`client.mode``string`Operational mode (e.g. `"cli"`, `"webchat"`, `"node"`)`client.displayName?``string`Human-readable name shown in presence list`client.instanceId?``string`Unique instance UUID for presence tracking`role``"operator"` | `"node"`Requested connection role`scopes``string[]`Requested operator scopes (e.g. `["operator.admin"]`)`caps``string[]`Declared client capabilities`commands?``string[]`Node role only: declared executable command names`auth?``object``{ token?, deviceToken?, password? }``device?``object``{ id, publicKey, signature, signedAt, nonce }` — device keypair identity`permissions?``object`Capability key/boolean map`pathEnv?``string`PATH override (node role)
Sources: [src/gateway/client.ts266-318](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L266-L318)[src/gateway/server/ws-connection/message-handler.ts408-466](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts#L408-L466)

### HelloOk Response

On a successful `connect`, the server responds with `ok: true` and a `HelloOk` payload (`HelloOkSchema`):

```
{
  "type": "res",
  "id": "<connect-request-id>",
  "ok": true,
  "payload": {
    "type": "hello-ok",
    "server": { "version": "1.2.3" },
    "snapshot": { "configPath": "/...", "stateDir": "/...", "presence": [...] },
    "auth": { "deviceToken": "...", "role": "operator", "scopes": ["operator.admin"] },
    "policy": { "tickIntervalMs": 30000 },
    "methods": ["health", "status", ...],
    "events": ["connect.challenge", "agent", ...],
    "caps": []
  }
}
```
FieldDescription`server.version`Gateway software version string`snapshot`Initial state snapshot — `SnapshotSchema` (presence, config path, state dir)`auth.deviceToken`Issued per-device token; stored by `GatewayClient` via `storeDeviceAuthToken` for future reconnects`auth.role` / `auth.scopes`Confirmed role and scopes for this connection`policy.tickIntervalMs`Interval between `tick` events; used to configure the tick watchdog`methods`RPC methods available on this connection`events`Server-push events that may be received
Sources: [src/gateway/client.ts321-338](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L321-L338)[docs/gateway/protocol.md69-100](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/protocol.md#L69-L100)

---

## RPC Semantics

### Request / Response

Every RPC call uses a `RequestFrame` with a caller-generated UUID `id`. The server sends back a matching `ResponseFrame`.

```
// Request
{ "type": "req", "id": "550e8400-e29b-41d4-a716-446655440000", "method": "sessions.list", "params": {} }
 
// Success
{ "type": "res", "id": "550e8400-e29b-41d4-a716-446655440000", "ok": true, "payload": { ... } }
 
// Failure
{ "type": "res", "id": "550e8400-e29b-41d4-a716-446655440000", "ok": false, "error": { "code": "INVALID_REQUEST", "message": "..." } }
```

`GatewayClient` keeps a `pending` map keyed by `id` and resolves or rejects the corresponding `Promise` when the matching `ResponseFrame` arrives.

Sources: [src/gateway/client.ts496-520](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L496-L520)

### Accepted / Final Pattern

Some long-running operations (e.g., agent runs) return an intermediate acknowledgement before the final result. Callers signal this with `expectFinal: true` in `GatewayClient.request()`.

```
// Intermediate ack — caller keeps waiting
{ "type": "res", "id": "...", "ok": true, "payload": { "status": "accepted" } }
 
// Final response — caller resolves
{ "type": "res", "id": "...", "ok": true, "payload": { <final result> } }
```

Sources: [src/gateway/client.ts388-393](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L388-L393)[src/gateway/client.ts510-511](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L510-L511)

---

## Event Semantics

`EventFrame` messages are server-pushed and not tied to any request. Events carry a monotonically increasing `seq` integer. `GatewayClient` tracks `lastSeq` and fires the `onGap` callback when a gap is detected between consecutive sequence numbers.

```
{ "type": "event", "event": "agent", "seq": 42, "payload": { ... } }
```

The `tick` event is a mandatory heartbeat. `GatewayClient.startTickWatch()` closes the socket with code `4000` (`"tick timeout"`) if no tick is received within `tickIntervalMs × 2`. The `tickIntervalMs` value is set from `HelloOk.policy.tickIntervalMs`.

Sources: [src/gateway/client.ts369-380](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L369-L380)[src/gateway/client.ts445-467](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L445-L467)

---

## Error Shape

All error responses carry an `ErrorShape` (`ErrorShapeSchema`):

```
{
  "code": "INVALID_REQUEST",
  "message": "device nonce mismatch",
  "details": { "code": "DEVICE_AUTH_NONCE_MISMATCH", "reason": "device-nonce-mismatch" }
}
```

`errorShape()` is a factory function exported from `src/gateway/protocol/index.ts` for constructing these objects server-side.
`ErrorCodes` valueWhen used`INVALID_REQUEST`Malformed request, auth failure, unknown method, scope check failure`NOT_PAIRED`Device identity required but device is not paired`UNAVAILABLE`Rate limit exceeded or service temporarily unavailable
Sources: [src/gateway/protocol/index.ts515-516](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/index.ts#L515-L516)[src/gateway/server/ws-connection/message-handler.ts374-404](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts#L374-L404)

---

## WebSocket Close Codes
CodeMeaning`1000`Normal closure`1002`Protocol version mismatch`1006`Abnormal closure (no close frame — network drop)`1008`Policy violation (auth failure, invalid handshake)`1012`Service restart`4000`Tick heartbeat timeout (client-side watchdog)
Sources: [src/gateway/client.ts74-79](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts#L74-L79)[src/gateway/server/ws-connection/message-handler.ts447-448](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts#L447-L448)

---

## Method Reference

Methods are assembled in `coreGatewayHandlers` in `src/gateway/server-methods.ts` and dispatched by `handleGatewayRequest()`. Channel plugins can inject additional methods via `extraHandlers`. The full base method list is `BASE_METHODS` in `src/gateway/server-methods-list.ts`.

**Method groups and their handler files:**

```
handleGatewayRequest()
server-methods.ts

connectHandlers
server-methods/connect.js

healthHandlers
server-methods/health.js

agentHandlers
server-methods/agent.js

agentsHandlers
server-methods/agents.js

chatHandlers
server-methods/chat.js

sessionsHandlers
server-methods/sessions.js

configHandlers
server-methods/config.js

cronHandlers
server-methods/cron.js

nodeHandlers
server-methods/nodes.js

deviceHandlers
server-methods/devices.js

execApprovalsHandlers
server-methods/exec-approvals.js

skillsHandlers
server-methods/skills.js

modelsHandlers
server-methods/models.js
```

Sources: [src/gateway/server-methods.ts66-149](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts#L66-L149)

### System & Health
MethodDescription`health`Liveness check — no scope required`status`Gateway and agent status`usage.status`Token usage summary`usage.cost`Cost breakdown`doctor.memory.status`Memory subsystem diagnostics`logs.tail`Stream recent log entries`secrets.reload`Hot-reload secret references`update.run`Trigger a software update check
### Agent
MethodDescription`agent`Run an agent turn`agent.identity.get`Get the agent's identity info`agent.wait`Wait for an in-progress agent run to complete`send`Send a message to an agent (non-streaming)`wake`Trigger an agent wake (heartbeat / cron)`last-heartbeat`Get the last heartbeat timestamp`set-heartbeats`Configure heartbeat schedule
### Chat (WebChat / Control UI)
MethodDescription`chat.history`Retrieve chat transcript`chat.send`Send a chat message`chat.abort`Abort an in-progress streaming response
### Sessions
MethodDescription`sessions.list`List sessions`sessions.preview`Preview a session transcript`sessions.patch`Update session metadata`sessions.reset`Reset (clear) a session`sessions.delete`Delete a session and its transcript`sessions.compact`Compact session context manually
### Configuration
MethodDescription`config.get`Read the current configuration`config.set`Overwrite the configuration`config.apply`Apply configuration from raw text`config.patch`Patch specific configuration fields`config.schema`Retrieve the config schema with UI labels
### Cron
MethodDescription`cron.list`List scheduled jobs`cron.status`Get cron service status`cron.add`Create a new cron job`cron.update`Update an existing cron job`cron.remove`Delete a cron job`cron.run`Immediately trigger a cron job`cron.runs`Retrieve run history for a job
### Nodes
MethodDescription`node.pair.request`Initiate a node pairing`node.pair.list`List node pairings`node.pair.approve` / `reject` / `verify`Manage node pairings`node.rename`Rename a paired node`node.list`List connected nodes`node.describe`Describe node capabilities`node.invoke`Invoke a command on a node`node.invoke.result`Report the result of a node invocation (node role)`node.event`Deliver an event from a node (node role)`node.canvas.capability.refresh`Refresh a Canvas capability token
### Devices
MethodDescription`device.pair.list`List device pairings`device.pair.approve` / `reject` / `remove`Manage device pairings`device.token.rotate`Rotate a device auth token`device.token.revoke`Revoke a device auth token
### Exec Approvals
MethodDescription`exec.approvals.get` / `.set`Get/set gateway exec approval policy`exec.approvals.node.get` / `.set`Get/set node exec approval policy`exec.approval.request`Request an exec approval`exec.approval.waitDecision`Long-poll for approval decision`exec.approval.resolve`Resolve an approval request
### Agents Management
MethodDescription`agents.list`List configured agents`agents.create` / `update` / `delete`Manage agent definitions`agents.files.list` / `get` / `set`Read and write agent workspace files
### Other
MethodDescription`channels.status` / `channels.logout`Channel integration status and logout`models.list`List available AI models`skills.status` / `bins` / `install` / `update`Skill management`tools.catalog`List available agent tools`wizard.start` / `next` / `cancel` / `status`Interactive onboarding wizard`talk.config` / `talk.mode`Voice talk mode configuration`tts.*`Text-to-speech provider controls`voicewake.get` / `.set`Voice wake-word configuration`push.test`Test push notification delivery`browser.request`Browser automation control`system-presence` / `system-event`Internal system presence and event delivery
Sources: [src/gateway/server-methods-list.ts4-103](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts#L4-L103)

---

## Event Reference

Server-push events are declared in `GATEWAY_EVENTS` in `src/gateway/server-methods-list.ts`. The payload schemas are in `src/gateway/protocol/schema/`.
EventSchemaDescription`connect.challenge`—Nonce challenge sent on socket open (before `connect`)`tick``TickEventSchema`Periodic heartbeat carrying a timestamp`shutdown``ShutdownEventSchema`Gateway is shutting down`agent``AgentEventSchema`Streaming agent reply fragment or run status update`chat``ChatEventSchema`Chat transcript update pushed to webchat clients`presence``PresenceEntrySchema`Connected client presence list update`health`—Health snapshot push`heartbeat`—Agent heartbeat tick`cron`—Cron job run status update`talk.mode`—Voice talk mode state change`node.pair.requested`—A node pairing request has been initiated`node.pair.resolved`—A node pairing request was approved or rejected`node.invoke.request`—A command invocation has been dispatched to a node`device.pair.requested`—A device pairing request has been initiated`device.pair.resolved`—A device pairing request was approved or rejected
Sources: [src/gateway/server-methods-list.ts106-140](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts#L106-L140)

---

## Protocol Schema Generation

`ProtocolSchemas` (a named map of all TypeBox schemas) is exported from `src/gateway/protocol/index.ts`. The script `scripts/protocol-gen-swift.ts` reads `ProtocolSchemas`, `PROTOCOL_VERSION`, and `ErrorCodes` from the compiled gateway module and emits `GatewayModels.swift` for both the macOS and iOS native clients, keeping Swift types in sync with TypeScript schema definitions.

**Schema generation pipeline:**

```
TypeBox schemas
protocol/schema/*.ts

ProtocolSchemas
protocol/schema/protocol-schemas.ts

protocol-gen-swift.ts

apps/macos/.../GatewayModels.swift

apps/shared/OpenClawKit/.../GatewayModels.swift
```

Sources: [scripts/protocol-gen-swift.ts1-5](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/protocol-gen-swift.ts#L1-L5)[src/gateway/protocol/schema/protocol-schemas.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/protocol-schemas.ts#L1-L50)

---

# Authentication-&-Device-Pairing

# Authentication & Device Pairing
Relevant source files
- [apps/ios/Sources/Chat/IOSGatewayChatTransport.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Chat/IOSGatewayChatTransport.swift)
- [apps/ios/Sources/Gateway/GatewayConnectionController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift)
- [apps/ios/Sources/Location/LocationService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Location/LocationService.swift)
- [apps/ios/Sources/Model/NodeAppModel.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift)
- [apps/ios/Sources/Motion/MotionService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Motion/MotionService.swift)
- [apps/ios/Sources/Onboarding/OnboardingWizardView.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Onboarding/OnboardingWizardView.swift)
- [apps/ios/Sources/OpenClawApp.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/OpenClawApp.swift)
- [apps/ios/Sources/Reminders/RemindersService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Reminders/RemindersService.swift)
- [apps/ios/Sources/RootCanvas.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootCanvas.swift)
- [apps/ios/Sources/RootTabs.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootTabs.swift)
- [apps/ios/Sources/Screen/ScreenController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenController.swift)
- [apps/ios/Sources/Screen/ScreenTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenTab.swift)
- [apps/ios/Sources/Services/NodeServiceProtocols.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/NodeServiceProtocols.swift)
- [apps/ios/Sources/Services/WatchMessagingService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/WatchMessagingService.swift)
- [apps/ios/Sources/Settings/SettingsTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Settings/SettingsTab.swift)
- [apps/ios/Sources/Status/StatusPill.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/StatusPill.swift)
- [apps/ios/Sources/Status/VoiceWakeToast.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/VoiceWakeToast.swift)
- [apps/ios/Sources/Voice/TalkModeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/TalkModeManager.swift)
- [apps/ios/Sources/Voice/VoiceWakeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/VoiceWakeManager.swift)
- [apps/ios/SwiftSources.input.xcfilelist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/SwiftSources.input.xcfilelist)
- [apps/ios/Tests/GatewayConnectionControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/GatewayConnectionControllerTests.swift)
- [apps/ios/Tests/NodeAppModelInvokeTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/NodeAppModelInvokeTests.swift)
- [apps/ios/Tests/ScreenControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/ScreenControllerTests.swift)
- [apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift)
- [docs/gateway/pairing.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/pairing.md)
- [docs/gateway/protocol.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/protocol.md)
- [docs/gateway/tools-invoke-http-api.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/tools-invoke-http-api.md)
- [src/agents/tool-policy-pipeline.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-policy-pipeline.test.ts)
- [src/agents/tool-policy-pipeline.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-policy-pipeline.ts)
- [src/cli/program/message/helpers.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program/message/helpers.test.ts)
- [src/cli/program/message/helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program/message/helpers.ts)
- [src/gateway/auth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/auth.test.ts)
- [src/gateway/auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/auth.ts)
- [src/gateway/call.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/call.test.ts)
- [src/gateway/call.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/call.ts)
- [src/gateway/client.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/client.ts)
- [src/gateway/net.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/net.test.ts)
- [src/gateway/net.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/net.ts)
- [src/gateway/protocol/schema/frames.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/frames.ts)
- [src/gateway/role-policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/role-policy.test.ts)
- [src/gateway/role-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/role-policy.ts)
- [src/gateway/server.auth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server.auth.test.ts)
- [src/gateway/server/ws-connection/connect-policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/connect-policy.test.ts)
- [src/gateway/server/ws-connection/connect-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/connect-policy.ts)
- [src/gateway/server/ws-connection/message-handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server/ws-connection/message-handler.ts)
- [src/gateway/test-helpers.server.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/test-helpers.server.ts)
- [src/gateway/tools-invoke-http.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/tools-invoke-http.test.ts)
- [src/gateway/tools-invoke-http.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/tools-invoke-http.ts)
- [src/infra/machine-name.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/machine-name.ts)
- [src/tui/gateway-chat.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/tui/gateway-chat.test.ts)

This page covers the Gateway's authentication system, the cryptographic device identity mechanism, the device pairing approval workflow, and the role/scope permission model.

For the WebSocket frame structures that wrap the connect handshake, see [WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol). For configuring `gateway.auth` fields in `openclaw.json`, see [Configuration](/openclaw/openclaw/2.3-configuration). For how native node apps use the pairing mechanism, see [Native Clients (Nodes)](/openclaw/openclaw/6-native-clients-(nodes)).

---

## Authentication Modes

At startup, the gateway resolves a single `ResolvedGatewayAuth` object from config and environment. Every subsequent auth check reads from this object.

**Defined in:**`src/gateway/auth.ts` — `ResolvedGatewayAuth` type [`src/gateway/auth.ts30-37](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/auth.ts#L30-L37)
Mode (`ResolvedGatewayAuthMode`)CredentialTypical use`"token"`Shared secret string; `OPENCLAW_GATEWAY_TOKEN` env or `gateway.auth.token`Default`"password"`Gateway password; `gateway.auth.password`Alternative to token`"trusted-proxy"`Identity injected via HTTP header by a reverse proxySSO / Tailscale Serve`"none"`No credential requiredLoopback-only, development
Tailscale peer authentication is a separate overlay controlled by `allowTailscale: boolean` on `ResolvedGatewayAuth`. It is only available on the WS Control UI surface (`authorizeWsControlUiGatewayConnect`), not HTTP.

The `GatewayAuthResult.method` field reports how auth actually resolved:

```
"none" | "token" | "password" | "tailscale" | "device-token" | "trusted-proxy"

```

**Auth surface functions**[`src/gateway/auth.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/auth.ts`):
FunctionSurface`resolveGatewayAuth`Resolves `ResolvedGatewayAuth` from config/env at startup`authorizeGatewayConnect`Core shared-secret check used internally`authorizeHttpGatewayConnect`Used by `POST /tools/invoke``authorizeWsControlUiGatewayConnect`WS variant; enables Tailscale header auth
Sources: [`src/gateway/auth.ts1-47](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/auth.ts#L1-L47)[`src/gateway/auth.test.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/auth.test.ts#L1-L50)

---

## The Connect Handshake

Every WebSocket client must complete a `connect` handshake as its first message. The handshake:

1. Binds the client to a server-issued nonce (replay-attack prevention)
2. Validates credentials (shared token, password, or device token)
3. Validates device identity (Ed25519 keypair signature)
4. Verifies or initiates device pairing

**Connect Handshake Sequence**

```
"infra/device-pairing.js"
"GatewayServer (message-handler.ts)"
"Client (GatewayClient)"
"infra/device-pairing.js"
"GatewayServer (message-handler.ts)"
"Client (GatewayClient)"
"1. Protocol version check"
"2. Origin check (browser/webchat clients)"
"3. resolveConnectAuthState()"
"4. Validate device identity"
" deriveDeviceIdFromPublicKey"
" signedAt skew check"
" nonce match"
" resolveDeviceSignaturePayloadVersion"
"5. resolveConnectAuthDecision()"
alt
["shouldAllowSilentLocalPairing = true"]
["manual approval required"]
alt
["not paired or upgrade required"]
["paired and all checks pass"]
"WebSocket open"
"event: connect.challenge { nonce }"
"req connect (ConnectParams)"
"getPairedDevice(device.id)"
"PairedDevice | null"
"requestDevicePairing()"
"approveDevicePairing()"
"res { ok: true, HelloOk }"
"res { ok: false, NOT_PAIRED, requestId }"
"ensureDeviceToken()"
"res { ok: true, HelloOk }"
```

Sources: [`src/gateway/server/ws-connection/message-handler.ts335-970](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L335-L970)[`src/gateway/test-helpers.server.ts254-274](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/test-helpers.server.ts#L254-L274)

### connect.challenge Event

Immediately on WebSocket open — before the client sends anything — the server emits a `connect.challenge` EventFrame:

```
{ "type": "event", "event": "connect.challenge", "payload": { "nonce": "<uuid>" } }

```

The nonce is per-connection and must be included in the device's cryptographic signature. A missing or blank nonce returns error detail code `DEVICE_AUTH_NONCE_REQUIRED`; a nonce that does not match the challenge returns `DEVICE_AUTH_NONCE_MISMATCH`.

Sources: [`src/gateway/server.auth.test.ts564-576](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server.auth.test.ts#L564-L576)[`src/gateway/server/ws-connection/message-handler.ts654-662](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L654-L662)

### ConnectParams Structure

The client sends a request frame `{ type: "req", method: "connect", params: ConnectParams }`. Key fields:
FieldTypeNotes`minProtocol` / `maxProtocol``number`Must bracket the server's `PROTOCOL_VERSION``client.id``string`From `GATEWAY_CLIENT_IDS` / `GATEWAY_CLIENT_NAMES``client.mode``GatewayClientMode``"cli"`, `"node"`, `"webchat"`, etc.`client.platform``string?`Pinned after first approved pairing`client.deviceFamily``string?`Pinned after first approved pairing`auth.token``string?`Shared gateway token or device token`auth.deviceToken``string?`Explicit device token`auth.password``string?`Gateway password`role``"operator" | "node"`Requested role; committed to in device signature`scopes``string[]`Requested scopes; committed to in device signature`device.id``string`Must equal `deriveDeviceIdFromPublicKey(device.publicKey)``device.publicKey``string`Base64url Ed25519 public key`device.signature``string`Ed25519 signature over auth payload`device.signedAt``number`Unix ms; must be within ±2 min of server time`device.nonce``string`Must match `connect.challenge` nonce
Sources: [`src/gateway/client.ts270-318](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/client.ts#L270-L318)[`src/gateway/server/ws-connection/message-handler.ts434-467](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L434-L467)

### Protocol Version Negotiation

The server rejects connections where `maxProtocol < PROTOCOL_VERSION || minProtocol > PROTOCOL_VERSION`, returning an `INVALID_REQUEST` error with `{ expectedProtocol }` in the details. `PROTOCOL_VERSION` is a numeric constant in [`src/gateway/protocol/index.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/protocol/index.ts`)

Sources: [`src/gateway/server/ws-connection/message-handler.ts435-450](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L435-L450)

### Origin Check

For connections that carry a browser `Origin` header, or for `CONTROL_UI` and webchat clients, `checkBrowserOrigin` validates that the origin matches the request host or an allowlist from `gateway.controlUi.allowedOrigins`. Failed origin checks close the connection before auth is attempted.

Sources: [`src/gateway/server/ws-connection/message-handler.ts471-491](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L471-L491)[`src/gateway/origin-check.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/origin-check.ts`)

---

## Device Identity

Each client that uses device-based auth maintains a persistent Ed25519 keypair on disk. The keypair is created by `loadOrCreateDeviceIdentity()` on first run and is never transmitted — only the public key and a signature over a request-specific payload leave the client.

**Device Identity and Signing — Code Entity Map**

```
Server — message-handler.ts

Payload — gateway/device-auth.ts

Client — infra/device-identity.js

loadOrCreateDeviceIdentity()

DeviceIdentity
{ deviceId, privateKeyPem, publicKeyPem }

publicKeyRawBase64UrlFromPem()

signDevicePayload(privateKeyPem, payload)

buildDeviceAuthPayloadV3()
{ deviceId, clientId, clientMode,
  role, scopes, signedAtMs,
  token, nonce, platform,
  deviceFamily }

buildDeviceAuthPayload() v2
(omits platform, deviceFamily)

deriveDeviceIdFromPublicKey()

resolveDeviceSignaturePayloadVersion()
try v3 then v2

verifyDeviceSignature(publicKey, payload, sig)
```

Sources: [`src/gateway/server/ws-connection/message-handler.ts139-181](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L139-L181)[`src/gateway/client.ts270-294](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/client.ts#L270-L294)[`src/gateway/device-auth.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/device-auth.ts`)

### Device ID Derivation

`device.id` in `ConnectParams` must equal `deriveDeviceIdFromPublicKey(device.publicKey)`. The server computes this independently and rejects mismatches (`device-id-mismatch`) before any pairing check.

### Signature Payload Versions

`resolveDeviceSignaturePayloadVersion` tries the **v3 payload** first (includes `platform` and `deviceFamily`), then falls back to **v2**. If neither verifies, the connection is rejected with `device-signature-invalid` (detail code `DEVICE_AUTH_SIGNATURE_INVALID`).

Because `scopes` are included in the signed payload, a client cannot present different scopes in `ConnectParams` than those it signed over — any mismatch fails signature verification.

### Clock Skew Tolerance

`device.signedAt` must be within `DEVICE_SIGNATURE_SKEW_MS` (2 minutes) of the server clock. Stale timestamps are rejected with `device-signature-stale`.

Sources: [`src/gateway/server/ws-connection/message-handler.ts91](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L91-L91)[`src/gateway/server/ws-connection/message-handler.ts646-662](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L646-L662)

---

## Device Pairing

Pairing associates a device's public key with an approved set of roles and scopes in the gateway's persistent store (`infra/device-pairing.js`). All device connections go through a pairing check; unrecognized devices must be approved by an operator.

### Pairing Decision Flow

```
No

Yes

No

Yes

platform or deviceFamily mismatch

role not in pairedRoles

scopes exceed pairedScopes

all pass

Yes

No

Device identity present in ConnectParams?

handleMissingDeviceIdentity()

getPairedDevice(device.id)

publicKey matches
stored record?

requirePairing reason=not-paired

Check role / scope / metadata

requirePairing reason=metadata-upgrade

requirePairing reason=role-upgrade

requirePairing reason=scope-upgrade

updatePairedDeviceMetadata()

ensureDeviceToken()

hello-ok

shouldAllowSilentLocalPairing?

requestDevicePairing()
broadcast device.pair.requested
Return NOT_PAIRED + requestId

requestDevicePairing(silent=true)
approveDevicePairing()
broadcast device.pair.resolved
```

Sources: [`src/gateway/server/ws-connection/message-handler.ts764-912](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L764-L912)[`src/gateway/server/ws-connection/message-handler.ts125-137](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L125-L137)

### Silent vs. Manual Pairing

`shouldAllowSilentLocalPairing` returns `true` when all of the following hold:

- The connection originates from a **loopback address** (`isLocalClient = true`)
- No untrusted `Origin` header is present, *or* the client is Control UI or webchat
- The pairing reason is `"not-paired"` or `"scope-upgrade"` (not `"role-upgrade"` or `"metadata-upgrade"`)

Silent pairing auto-approves the request within the same handshake. This covers the typical CLI and local Control UI cases.

Manual pairing causes the gateway to:

1. Call `requestDevicePairing()` and broadcast `device.pair.requested` to all connected operators
2. Return `ErrorCodes.NOT_PAIRED` with `{ requestId, reason }` in error details
3. Close the connection

The client must display the pairing request and wait for an operator to approve it (via channel command, Control UI, or CLI), then reconnect.

Sources: [`src/gateway/server/ws-connection/message-handler.ts764-824](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L764-L824)

### Pairing Upgrade Triggers

When a device is already paired but the new connection requests more access, a fresh pairing approval is required:
TriggerReason codeAllows silent?Public key not found in pairing store`"not-paired"`Yes (local client)Requested `role` not in `pairedRoles``"role-upgrade"`NoRequested `scopes` not covered by `pairedScopes``"scope-upgrade"`Yes (local client)Claimed `platform` or `deviceFamily` differs from pinned value`"metadata-upgrade"`No
Role and metadata upgrades always require manual operator approval regardless of connection locality.

Sources: [`src/gateway/server/ws-connection/message-handler.ts861-906](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L861-L906)

### Platform and Device Family Pinning

On first approved pairing, the device's `platform` and `deviceFamily` values are stored. On subsequent connections:

- If stored value is set and the claimed value differs → `metadata-upgrade` required
- If stored value is set and claims match → the stored value is written back to `connectParams.client`, preventing drift

This makes it harder for a stolen public key to be used from a different device type.

Sources: [`src/gateway/server/ws-connection/message-handler.ts833-860](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L833-L860)

### Device Tokens

After a successful pairing and handshake, `ensureDeviceToken({ deviceId, role, scopes })` generates a per-device, per-role secret token. This token:

- Is returned in the `hello-ok` response as `auth.deviceToken`
- Is cached by `GatewayClient` via `storeDeviceAuthToken` ([`src/infra/device-auth-store.js`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/infra/device-auth-store.js`))
- Can substitute for the shared gateway token in future `ConnectParams.auth.deviceToken`
- Is included in the device signature payload, so it is cryptographically bound to the keypair

When the gateway closes with code `1008` and reason `"device token mismatch"`, `GatewayClient` automatically clears the cached token and pairing record via `clearDeviceAuthToken` and `clearDevicePairing`.

Token resolution priority in `GatewayClient.sendConnect()`:

1. Explicit `opts.token` (shared gateway token)
2. Explicit `opts.deviceToken`
3. Stored device token from `loadDeviceAuthToken` (only when no explicit shared token)

Sources: [`src/gateway/client.ts244-254](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/client.ts#L244-L254)[`src/gateway/client.ts183-210](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/client.ts#L183-L210)[`src/gateway/server/ws-connection/message-handler.ts915-917](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L915-L917)

---

## Roles and Scopes

### Roles
RolePurpose`"operator"`Full gateway control: chat, config, agent management, sessions`"node"`Device capability provider: camera, location, exec. Used by native apps.
`node` role requires a device identity — connections requesting `role: "node"` without a `device` block are rejected immediately.

Sources: [`src/gateway/server/ws-connection/message-handler.ts452-461](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L452-L461)[`src/gateway/server/ws-connection/message-handler.ts919-929](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L919-L929)

### Scopes

Scopes are declared in `ConnectParams.scopes`, committed to by the device signature, and verified against the pairing record via `roleScopesAllow`. They follow a **default-deny** model: omitting scopes produces a connected session with access only to unscopeced methods like `health`.
ScopeAccess granted`operator.admin`All admin operations`operator.read`Read-only (health, config read, session history)`operator.write`Write operations (send message, config apply)`operator.approvals`Exec approval handling`operator.pairing`Device pairing management
The CLI (`callGatewayCli`) requests all five scopes by default (`CLI_DEFAULT_OPERATOR_SCOPES`). Internal gateway-to-gateway callers use `resolveLeastPrivilegeOperatorScopesForMethod`, which returns only the minimum scope for each RPC method.

**Scope stripping:** When no device identity is present and shared auth did not succeed, `clearUnboundScopes` removes any scopes claimed in `ConnectParams`. This prevents self-declared privilege escalation on connections that cannot be bound to a pairing record.

Sources: [`src/gateway/call.ts22-25](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/call.ts#L22-L25)[`src/gateway/server/ws-connection/message-handler.ts462-465](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L462-L465)[`src/gateway/server/ws-connection/message-handler.ts560-565](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L560-L565)[`src/gateway/call.test.ts185-200](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/call.test.ts#L185-L200)

---

## Tailscale Authentication

When `allowTailscale: true` is configured, `authorizeWsControlUiGatewayConnect` inspects Tailscale-forwarded HTTP headers:

- `tailscale-user-login` — authenticated Tailscale user login name
- `tailscale-user-name` — display name

Alternatively, `readTailscaleWhoisIdentity(clientIp)` queries `tailscaled` locally to resolve the peer. A successful lookup sets `method: "tailscale"` on `GatewayAuthResult`.

Tailscale auth is **not available** on `POST /tools/invoke`. It requires `gateway.trustedProxies` to be set so that forwarded headers from Tailscale Serve are accepted.

Sources: [`src/gateway/auth.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/auth.ts`)[`src/gateway/server.auth.test.ts63-77](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server.auth.test.ts#L63-L77)

---

## Trusted Proxy Authentication

When `gateway.auth.mode = "trusted-proxy"`:

- `gateway.auth.trustedProxy.userHeader` — header name injected by the proxy (e.g., `"x-forwarded-user"`)
- `gateway.auth.trustedProxy.requiredHeaders` — headers that must be present for the auth to be considered valid
- `gateway.trustedProxies` — list of upstream proxy IPs allowed to inject these headers

For the Control UI, a successful trusted-proxy auth bypasses device pairing entirely via `shouldSkipControlUiPairing` and `isTrustedProxyControlUiOperatorAuth`.

Sources: [`src/gateway/auth.ts22-48](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/auth.ts#L22-L48)[`src/gateway/server/ws-connection/message-handler.ts708-719](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L708-L719)[`src/gateway/server.auth.test.ts200-215](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server.auth.test.ts#L200-L215)

---

## Control UI Auth Policy

The Control UI (`client.id === GATEWAY_CLIENT_IDS.CONTROL_UI`) has a distinct auth policy resolved by `resolveControlUiAuthPolicy` in [`src/gateway/server/ws-connection/connect-policy.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/connect-policy.ts`):

- Over a non-secure context (non-HTTPS, non-localhost), device identity is **required** to prevent credential interception. Missing device identity returns error code `CONTROL_UI_DEVICE_IDENTITY_REQUIRED`.
- If shared auth (token or password) succeeds, device pairing is **skipped** entirely (`shouldSkipControlUiPairing`).
- If trusted-proxy auth succeeds, pairing is also skipped.

This allows the Control UI to connect with just a shared token, without going through the device pairing workflow.

Sources: [`src/gateway/server/ws-connection/message-handler.ts499-503](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L499-L503)[`src/gateway/server/ws-connection/message-handler.ts714-719](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/gateway/server/ws-connection/message-handler.ts#L714-L719)

---

## iOS Dual-Session Pattern

The iOS Clawdis app (and similarly macOS/Android) maintains **two simultaneous WebSocket connections** to the gateway:
Session`NodeAppModel` fieldRolePurpose`nodeGateway``GatewayNodeSession``"node"`Device capabilities: camera, location, exec, push`operatorGateway``GatewayNodeSession``"operator"`Chat, config, voicewake, agent RPCs
Both sessions use the same Ed25519 keypair but request different roles. Both go through the full device identity and pairing flow.

`gatewayPairingPaused: Bool` on `NodeAppModel` suppresses reconnect attempts while a pairing request is pending, preventing duplicate pairing requests from reconnect churn.

Sources: [`apps/ios/Sources/Model/NodeAppModel.swift94-99](https://github.com/openclaw/openclaw/blob/8090cb4c/`apps/ios/Sources/Model/NodeAppModel.swift#L94-L99)[`apps/ios/Sources/Model/NodeAppModel.swift83-84](https://github.com/openclaw/openclaw/blob/8090cb4c/`apps/ios/Sources/Model/NodeAppModel.swift#L83-L84)

### TLS Trust Prompt

When a native client connects over `wss://` to a self-signed gateway certificate, `GatewayConnectionController` presents a `TrustPrompt` to the user showing the host, port, and SHA-256 fingerprint. After the user confirms, the fingerprint is persisted and used to validate the certificate on all future connections.

Sources: [`apps/ios/Sources/Gateway/GatewayConnectionController.swift21-57](https://github.com/openclaw/openclaw/blob/8090cb4c/`apps/ios/Sources/Gateway/GatewayConnectionController.swift#L21-L57)

### Setup Code Onboarding

The iOS app provides a setup code flow that bundles gateway URL and token into a single transferable string issued by a Telegram channel command:

1. User sends `/pair` to their Telegram bot
2. Bot returns a setup code encoding the gateway URL and a shared token
3. User pastes the setup code into the iOS Settings tab and taps **Connect**
4. App extracts the URL and token, connects to the gateway, and presents its device identity
5. User sends `/pair approve` in Telegram; this calls `approveDevicePairing` on the gateway
6. Gateway broadcasts `device.pair.resolved`; the iOS app's next reconnect succeeds

This flow is the channel-based path to `approveDevicePairing`. The underlying cryptographic device pairing mechanism is the same regardless of how approval is delivered.

Sources: [`apps/ios/Sources/Settings/SettingsTab.swift67-99](https://github.com/openclaw/openclaw/blob/8090cb4c/`apps/ios/Sources/Settings/SettingsTab.swift#L67-L99)[`apps/ios/Sources/Onboarding/OnboardingWizardView.swift`](https://github.com/openclaw/openclaw/blob/8090cb4c/`apps/ios/Sources/Onboarding/OnboardingWizardView.swift`)

---

# Configuration

# Configuration
Relevant source files
- [docs/cli/memory.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/memory.md)
- [docs/concepts/compaction.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/compaction.md)
- [docs/concepts/memory.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/memory.md)
- [docs/concepts/session-pruning.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/session-pruning.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration-reference.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md)
- [docs/providers/anthropic.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/providers/anthropic.md)
- [docs/providers/openai.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/providers/openai.md)
- [docs/reference/prompt-caching.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/prompt-caching.md)
- [docs/reference/token-use.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/token-use.md)
- [src/agents/compaction.identifier-policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/compaction.identifier-policy.test.ts)
- [src/agents/compaction.identifier-preservation.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/compaction.identifier-preservation.test.ts)
- [src/agents/compaction.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/compaction.ts)
- [src/agents/memory-search.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/memory-search.test.ts)
- [src/agents/memory-search.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/memory-search.ts)
- [src/agents/pi-embedded-runner-extraparams.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner-extraparams.test.ts)
- [src/agents/pi-embedded-runner/extensions.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/extensions.ts)
- [src/agents/pi-embedded-runner/extra-params.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/extra-params.ts)
- [src/agents/pi-extensions/compaction-safeguard-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-extensions/compaction-safeguard-runtime.ts)
- [src/agents/pi-extensions/compaction-safeguard.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-extensions/compaction-safeguard.ts)
- [src/agents/tools/memory-tool.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/memory-tool.ts)
- [src/cli/memory-cli.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/memory-cli.test.ts)
- [src/cli/memory-cli.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/memory-cli.ts)
- [src/commands/status.scan.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/status.scan.ts)
- [src/config/config.compaction-settings.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.compaction-settings.test.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.labels.ts)
- [src/config/schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.agent-defaults.ts)
- [src/config/types.memory.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.memory.ts)
- [src/config/types.tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.tools.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.agent-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.agent-runtime.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts)
- [src/memory/backend-config.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/backend-config.test.ts)
- [src/memory/backend-config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/backend-config.ts)
- [src/memory/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/index.ts)
- [src/memory/manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/manager.ts)
- [src/memory/qmd-manager.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/qmd-manager.test.ts)
- [src/memory/qmd-manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/qmd-manager.ts)
- [src/memory/search-manager.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.test.ts)
- [src/memory/search-manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.ts)

This page covers how the OpenClaw Gateway reads, validates, and applies `openclaw.json`: the file format, schema enforcement, hot-reload behavior, `$include` directives, environment variable substitution, `SecretRef` objects, CLI commands, and the Config RPC API.

For the complete field-by-field reference of every config key, see [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference). For authentication-specific gateway settings (`gateway.auth.*`), see [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing). For session-related config fields, see [Session Management](/openclaw/openclaw/2.4-session-management).

---

## Config File Location and Format

The gateway reads `~/.openclaw/openclaw.json`. The file is **optional**; if missing, safe defaults apply.

The format is **JSON5** — standard JSON extended with:

- Single-line and block comments
- Trailing commas in objects and arrays
- Unquoted keys

The only root-level key allowed outside the schema is `$schema` (a string), enabling editor JSON Schema tooling without triggering validation errors.

```
// ~/.openclaw/openclaw.json
{
  agents: { defaults: { workspace: "~/.openclaw/workspace" } },
  channels: { whatsapp: { allowFrom: ["+15555550123"] } },
}
```

Sources: [docs/gateway/configuration.md1-34](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md#L1-L34)

---

## Schema Validation

The entire config is validated against a Zod schema (`OpenClawSchema`) defined in [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts) The schema uses `.strict()` on every object, meaning unknown keys are rejected at load time.

**On validation failure:**

- The Gateway refuses to start.
- Only diagnostic commands work (`openclaw doctor`, `openclaw logs`, `openclaw health`, `openclaw status`).
- `openclaw doctor --fix` (or `--yes`) can repair common issues.

**Schema pipeline diagram**

```

```

Sources: [src/config/zod-schema.ts131-813](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts#L131-L813)[docs/gateway/configuration.md62-72](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md#L62-L72)

**Key sub-schemas**
Sub-schema fileCovers[src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts)Root `OpenClawSchema`, top-level fields[src/config/zod-schema.agent-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.agent-runtime.ts)`HeartbeatSchema`, `SandboxDockerSchema`, `ToolPolicySchema`[src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.agent-defaults.ts)`AgentDefaultsSchema`[src/config/zod-schema.agents.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.agents.ts)`AgentsSchema`, `BindingsSchema`, `BroadcastSchema`, `AudioSchema`[src/config/zod-schema.providers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers.ts)`ChannelsSchema`[src/config/zod-schema.hooks.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.hooks.ts)`HookMappingSchema`, `HooksGmailSchema`, `InternalHooksSchema`[src/config/zod-schema.core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.core.ts)`ModelsConfigSchema`, `SecretInputSchema`, `SecretsConfigSchema`, `HexColorSchema`
Sources: [src/config/zod-schema.ts1-23](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts#L1-L23)

---

## Top-Level Config Structure

The following diagram maps the principal top-level keys in `openclaw.json` to their Zod schema definitions.

**Top-level config structure (OpenClawSchema)**

```

```

Sources: [src/config/zod-schema.ts131-813](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts#L131-L813)[src/config/types.ts1-34](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.ts#L1-L34)

---

## Editing Config

There are four ways to edit configuration:
MethodHow**Interactive wizard**`openclaw onboard` or `openclaw configure`**CLI one-liners**`openclaw config get <key>`, `openclaw config set <key> <value>`, `openclaw config unset <key>`**Control UI**Browser form at `http://127.0.0.1:18789` — schema-driven form with Raw JSON editor**Direct edit**Edit `~/.openclaw/openclaw.json` directly; the gateway watches the file
Sources: [docs/gateway/configuration.md37-59](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md#L37-L59)

---

## Config Hot Reload

The Gateway watches `~/.openclaw/openclaw.json` for changes and applies them automatically. Reload behavior is controlled by `gateway.reload.mode`.
ModeBehavior`hybrid` (default)Hot-applies safe changes instantly; auto-restarts for critical ones`hot`Hot-applies safe changes only; logs a warning when restart is needed`restart`Restarts on any change`off`Disables file watching; changes require manual restart
```
{
  gateway: {
    reload: { mode: "hybrid", debounceMs: 300 },
  },
}
```

**What hot-applies vs. what needs a restart:**
CategoryFieldsRestart needed?Channels`channels.*`, `web`NoAgent & models`agent`, `agents`, `models`, `routing`NoAutomation`hooks`, `cron`, `agent.heartbeat`NoSessions & messages`session`, `messages`NoTools & media`tools`, `browser`, `skills`, `audio`, `talk`NoUI & misc`ui`, `logging`, `identity`, `bindings`NoGateway server`gateway.*` (port, bind, auth, tailscale, TLS, HTTP)**Yes**Infrastructure`discovery`, `canvasHost`, `plugins`**Yes**
> **Note:**`gateway.reload` and `gateway.remote` are exceptions — changing them does **not** trigger a restart.

Sources: [docs/gateway/configuration.md344-382](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md#L344-L382)[src/config/zod-schema.ts590-603](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts#L590-L603)

---

## `$include` Directives

Large configs can be split into multiple files using the `$include` key:

```
// ~/.openclaw/openclaw.json
{
  gateway: { port: 18789 },
  agents: { $include: "./agents.json5" },
  broadcast: {
    $include: ["./clients/a.json5", "./clients/b.json5"],
  },
}
```

**Rules:**

- **Single file** — value at the `$include` key is replaced by the file's contents.
- **Array of files** — files are deep-merged in order (later files win).
- **Sibling keys** — merged after includes, overriding included values.
- **Nested includes** — supported up to 10 levels deep.
- **Relative paths** — resolved relative to the including file.
- **Circular includes** — detected and reported as an error.

Sources: [docs/gateway/configuration.md320-341](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md#L320-L341)

---

## Environment Variables

The gateway loads env vars from:

1. The parent process environment.
2. `.env` in the current working directory (does not override existing vars).
3. `~/.openclaw/.env` (global fallback, does not override existing vars).

Vars can also be declared inline in config:

```
{
  env: {
    OPENROUTER_API_KEY: "sk-or-...",
    vars: { GROQ_API_KEY: "gsk-..." },
  },
}
```

Optionally, if expected keys are missing, OpenClaw can import from the login shell:

```
{
  env: {
    shellEnv: { enabled: true, timeoutMs: 15000 },
  },
}
```

The env-var equivalent is `OPENCLAW_LOAD_SHELL_ENV=1`.

### Substitution in Config Values

Reference env vars in any config string value using `${VAR_NAME}` syntax:

```
{
  gateway: { auth: { token: "${OPENCLAW_GATEWAY_TOKEN}" } },
  models: { providers: { custom: { apiKey: "${CUSTOM_API_KEY}" } } },
}
```

**Substitution rules:**

- Only uppercase names matched: `[A-Z_][A-Z0-9_]*`
- Missing or empty vars throw an error at load time
- Escape with `$${VAR}` for literal output
- Works inside `$include` files
- Supports inline concatenation: `"${BASE}/v1"` → `"https://api.example.com/v1"`

Sources: [docs/gateway/configuration.md444-493](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md#L444-L493)[src/config/zod-schema.ts155-167](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts#L155-L167)

---

## SecretRef Objects

For sensitive fields, `SecretRef` objects allow secrets to be fetched from external sources at load time rather than stored inline. Three sources are supported:
SourceDescription`env`Read from an environment variable`file`Read from a file path`exec`Execute a command and use stdout (e.g., Vault integration)
```
{
  models: {
    providers: {
      openai: { apiKey: { source: "env", provider: "default", id: "OPENAI_API_KEY" } },
    },
  },
  channels: {
    googlechat: {
      serviceAccountRef: {
        source: "exec",
        provider: "vault",
        id: "channels/googlechat/serviceAccount",
      },
    },
  },
}
```

`SecretRef` fields are defined by `SecretInputSchema` in [src/config/zod-schema.core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.core.ts) and marked with `.register(sensitive)` throughout the schema. The `SecretsConfigSchema` governs the `secrets.providers` block that configures these backends.

Sources: [docs/gateway/configuration.md496-530](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md#L496-L530)[src/config/zod-schema.ts297](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts#L297-L297)

---

## Schema Metadata for the Control UI

The `buildConfigSchema` function in [src/config/schema.ts342-370](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.ts#L342-L370) produces a `ConfigSchemaResponse` that includes:

- `schema` — JSON Schema (Draft-07) derived from `OpenClawSchema.toJSONSchema()`
- `uiHints` — a `ConfigUiHints` record mapping config paths to `ConfigUiHint` objects (labels, help text, `sensitive` flags, placeholder values)
- `version` and `generatedAt`

Field labels come from `FIELD_LABELS` in [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.labels.ts) and help text from `FIELD_HELP` in [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.help.ts) Sensitive field paths are tracked by the `.register(sensitive)` mechanism in [src/config/zod-schema.sensitive.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.sensitive.ts)

Plugins and extension channels can inject additional schema properties and UI hints via `PluginUiMetadata` and `ChannelUiMetadata` interfaces — merged in `applyPluginSchemas` and `applyChannelSchemas` ([src/config/schema.ts232-297](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.ts#L232-L297)).

**Schema build pipeline**

```

```

Sources: [src/config/schema.ts322-370](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.ts#L322-L370)[src/config/schema.ts114-188](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.ts#L114-L188)[src/config/schema.ts232-297](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.ts#L232-L297)

---

## Config RPC API

The gateway exposes three RPC methods for programmatic config management. Write RPCs (`config.apply`, `config.patch`) are rate-limited to **3 requests per 60 seconds** per `deviceId+clientIp`; when limited, the RPC returns `UNAVAILABLE` with `retryAfterMs`.

### `config.get`

Returns the current config hash and raw config text. The `baseHash` from this response is required for `config.apply` and `config.patch` to prevent lost-update races.

```
openclaw gateway call config.get --params '{}'
```

### `config.apply` (full replace)

Validates and writes the entire config, then restarts the gateway.

**Parameters:**
ParameterTypeDescription`raw`stringJSON5 payload for the entire config`baseHash`string (required if config exists)Hash from `config.get``sessionKey`string (optional)Session key for post-restart wake-up ping`note`string (optional)Note for the restart sentinel`restartDelayMs`number (optional)Delay before restart (default 2000ms)
Restart requests are coalesced while one is pending, and a 30-second cooldown applies between restart cycles.

```
openclaw gateway call config.apply --params '{
  "raw": "{ agents: { defaults: { workspace: \"~/.openclaw/workspace\" } } }",
  "baseHash": "<hash>"
}'
```

### `config.patch` (partial update)

Merges a partial update into the existing config using JSON merge patch semantics:

- Objects merge recursively.
- `null` deletes a key.
- Arrays replace (no merge).

**Parameters:**
ParameterTypeDescription`raw`stringJSON5 with only the keys to change`baseHash`string (required)Hash from `config.get``sessionKey`, `note`, `restartDelayMs`—Same as `config.apply`
```
openclaw gateway call config.patch --params '{
  "raw": "{ channels: { telegram: { groups: { \"*\": { requireMention: false } } } } }",
  "baseHash": "<hash>"
}'
```

Sources: [docs/gateway/configuration.md384-442](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md#L384-L442)

---

## Common Configuration Tasks

The table below maps common use-cases to their config key locations.
TaskKey pathSet agent workspace`agents.defaults.workspace`Set primary AI model`agents.defaults.model.primary`Add fallback models`agents.defaults.model.fallbacks`Configure heartbeat`agents.defaults.heartbeat.every`, `.target`Control who can DM`channels.<provider>.dmPolicy`, `.allowFrom`Group mention gating`channels.<provider>.groups."*".requireMention`Session reset policy`session.reset.mode`, `.atHour`, `.idleMinutes`Enable sandboxing`agents.defaults.sandbox.mode`, `.scope`Enable cron jobs`cron.enabled`, `cron.maxConcurrentRuns`HTTP webhooks`hooks.enabled`, `hooks.token`, `hooks.mappings`Multi-agent routing`agents.list[].id`, `bindings[].match`Split config into files`$include: "./other.json5"`Store secrets externally`SecretRef` on any `apiKey` / credential fieldGateway port`gateway.port`Gateway auth mode`gateway.auth.mode` (`token` / `password` / `trusted-proxy`)Reload behavior`gateway.reload.mode` (`hybrid` / `hot` / `restart` / `off`)
Sources: [docs/gateway/configuration.md74-342](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md#L74-L342)[docs/gateway/configuration-reference.md18-660](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration-reference.md#L18-L660)

---

## Full Reference

For every available field with defaults and channel-specific details, see [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference).

---

# Configuration-Reference

Relevant source files
- [docs/cli/memory.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/memory.md)
- [docs/concepts/compaction.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/compaction.md)
- [docs/concepts/memory.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/memory.md)
- [docs/concepts/session-pruning.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/session-pruning.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration-reference.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md)
- [docs/providers/anthropic.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/providers/anthropic.md)
- [docs/providers/openai.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/providers/openai.md)
- [docs/reference/prompt-caching.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/prompt-caching.md)
- [docs/reference/token-use.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/token-use.md)
- [src/agents/compaction.identifier-policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/compaction.identifier-policy.test.ts)
- [src/agents/compaction.identifier-preservation.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/compaction.identifier-preservation.test.ts)
- [src/agents/compaction.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/compaction.ts)
- [src/agents/memory-search.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/memory-search.test.ts)
- [src/agents/memory-search.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/memory-search.ts)
- [src/agents/pi-embedded-runner-extraparams.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner-extraparams.test.ts)
- [src/agents/pi-embedded-runner/extensions.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/extensions.ts)
- [src/agents/pi-embedded-runner/extra-params.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/extra-params.ts)
- [src/agents/pi-extensions/compaction-safeguard-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-extensions/compaction-safeguard-runtime.ts)
- [src/agents/pi-extensions/compaction-safeguard.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-extensions/compaction-safeguard.ts)
- [src/agents/tools/memory-tool.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/memory-tool.ts)
- [src/cli/memory-cli.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/memory-cli.test.ts)
- [src/cli/memory-cli.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/memory-cli.ts)
- [src/commands/status.scan.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/status.scan.ts)
- [src/config/config.compaction-settings.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.compaction-settings.test.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.labels.ts)
- [src/config/schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.agent-defaults.ts)
- [src/config/types.memory.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.memory.ts)
- [src/config/types.tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.tools.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.agent-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.agent-runtime.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts)
- [src/memory/backend-config.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/backend-config.test.ts)
- [src/memory/backend-config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/backend-config.ts)
- [src/memory/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/index.ts)
- [src/memory/manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/manager.ts)
- [src/memory/qmd-manager.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/qmd-manager.test.ts)
- [src/memory/qmd-manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/qmd-manager.ts)
- [src/memory/search-manager.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.test.ts)
- [src/memory/search-manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.ts)

---

**Note: This wiki page content was truncated due to reaching the token limit.**

---

# Session-Management

# Session Management
Relevant source files
- [src/agents/pi-embedded-runner/session-manager-init.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/session-manager-init.ts)
- [src/auto-reply/reply/session-run-accounting.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session-run-accounting.ts)
- [src/auto-reply/reply/session.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.test.ts)
- [src/auto-reply/reply/session.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.ts)
- [src/config/sessions/metadata.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/metadata.ts)
- [src/config/sessions/paths.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/paths.ts)
- [src/config/sessions/sessions.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/sessions.test.ts)
- [src/config/sessions/transcript.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/transcript.ts)
- [src/config/sessions/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/types.ts)
- [src/gateway/chat-attachments.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/chat-attachments.test.ts)
- [src/gateway/chat-attachments.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/chat-attachments.ts)
- [src/gateway/protocol/schema/sessions.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/sessions.ts)
- [src/gateway/server-methods/agent.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods/agent.ts)
- [src/gateway/server-methods/chat.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods/chat.ts)
- [src/gateway/server-methods/sessions.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods/sessions.ts)
- [src/gateway/server.e2e-ws-harness.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server.e2e-ws-harness.ts)
- [src/gateway/session-preview.test-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-preview.test-helpers.ts)
- [src/gateway/session-utils.fs.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.test.ts)
- [src/gateway/session-utils.fs.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.ts)
- [src/gateway/session-utils.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.test.ts)
- [src/gateway/session-utils.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.ts)
- [src/gateway/session-utils.types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.types.ts)
- [src/gateway/test-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/test-helpers.ts)
- [src/infra/transport-ready.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/transport-ready.test.ts)
- [src/media/sniff-mime-from-base64.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/media/sniff-mime-from-base64.ts)

This page documents how OpenClaw creates, stores, updates, resets, and deletes sessions. It covers the session key format, the `sessions.json` store, JSONL transcript files, reset policies, thread/topic forking, and the `sessions.*` RPC API.

For how a session is used during agent execution (tool calls, compaction, context tracking), see [Agents](/openclaw/openclaw/3-agents) and [Agent Execution Pipeline](/openclaw/openclaw/3.1-agent-execution-pipeline). For how the cron service creates synthetic session turns, see [Cron Service](/openclaw/openclaw/2.5-cron-service). For subagent session spawning, see [Subagents](/openclaw/openclaw/3.4.3-subagents).

---

## Core Concepts
TermMeaning**Session key**A structured string that identifies a conversation slot (e.g., `agent:main:telegram:12345`). Keys are stable across resets.**Session ID**A UUID assigned to one contiguous conversation. A new UUID is generated when the session is reset.**Session entry**A `SessionEntry` object (see type below) persisted in `sessions.json`, keyed by session key.**Transcript file**A `.jsonl` file that records every message in a session. Named from the session ID, located in the same directory as `sessions.json`.**Store path**Path to `sessions.json`. Defaults to `{stateDir}/agents/{agentId}/sessions/sessions.json`.**Session scope**Either `per-sender` (default, one session per sender identity) or `global` (all senders share one session per agent).
---

## Session Key Format

Session keys follow a colon-delimited structure. The canonical form always starts with `agent:{agentId}:`.

**Session key structure diagram**

```

```

Key normalization rules (implemented in `resolveSessionStoreKey()` in [src/gateway/session-utils.ts417-452](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.ts#L417-L452)):

- All keys are lowercased.
- Bare aliases like `"main"` are expanded to `"agent:{defaultAgentId}:{mainKey}"`.
- The configured `mainKey` (defaults to `"main"`) can remap what `"main"` resolves to.
- Agent-scoped keys (`agent:{id}:...`) pass through after lowercasing.

Sources: [src/gateway/session-utils.ts402-452](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.ts#L402-L452)[src/gateway/session-utils.test.ts72-132](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.test.ts#L72-L132)

---

## Storage Layout

**Storage layout diagram**

```
key: SessionEntry

{stateDir}

agents/

{agentId}/

sessions/

sessions.json

{sessionId}.jsonl

{sessionId}-topic-456.jsonl

{sessionId}.jsonl.reset.20250101-120000

Record
```

- `sessions.json` is a flat JSON object mapping session keys to `SessionEntry` records.
- Each transcript is a separate JSONL file. The session entry's `sessionFile` field records the exact path.
- When using multiple agents with the template store path `{agentId}/sessions/sessions.json`, each agent has its own store file.
- Archived transcripts are renamed with `.reset.{timestamp}` or `.deleted.{timestamp}` suffix via `archiveFileOnDisk()`.

Sources: [src/config/sessions/paths.ts33-35](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/paths.ts#L33-L35)[src/gateway/session-utils.fs.ts176-227](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.ts#L176-L227)[src/config/sessions/sessions.test.ts28-43](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/sessions.test.ts#L28-L43)

---

## `SessionEntry` Type

`SessionEntry` is defined in [src/config/sessions/types.ts68-167](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/types.ts#L68-L167) Key fields:
FieldTypePurpose`sessionId``string`UUID for the current conversation`updatedAt``number`Epoch ms of last update`sessionFile``string?`Absolute path to the JSONL transcript`systemSent``boolean?`Whether the system prompt has been sent this session`abortedLastRun``boolean?`Whether the previous run was aborted`chatType``"direct" | "group" | "channel"?`Conversation type`thinkingLevel``string?`Per-session thinking override`verboseLevel``string?`Per-session verbose level`modelOverride``string?`Per-session model override`providerOverride``string?`Per-session provider override`model``string?`Runtime model last used`modelProvider``string?`Runtime provider last used`totalTokens``number?`Accumulated token count`compactionCount``number?`Number of context compactions`sendPolicy``"allow" | "deny"?`Whether sends are permitted`spawnedBy``string?`Parent session key (for subagents)`forkedFromParent``boolean?`Whether this thread was forked`label``string?`User-assigned label`displayName``string?`Display name (e.g., thread label)`lastChannel``SessionChannelId?`Last delivery channel`lastTo``string?`Last delivery target`origin``SessionOrigin?`Originating sender metadata`deliveryContext``DeliveryContext?`Full delivery routing context`acp``SessionAcpMeta?`ACP runtime state (if applicable)
`mergeSessionEntry(existing, patch)` merges a patch onto an existing entry, ensuring `updatedAt` is always the maximum of all timestamps and normalizing runtime model fields. [src/config/sessions/types.ts228-249](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/types.ts#L228-L249)

Sources: [src/config/sessions/types.ts68-262](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/types.ts#L68-L262)

---

## Transcript File Format

Each transcript is a JSONL file (one JSON object per line) with the following record types:
Line typeExample structureSession header (first line)`{ "type": "session", "version": 3, "id": "<uuid>", "timestamp": "...", "cwd": "..." }`Message record`{ "type": "message", "message": { "role": "user"/"assistant", "content": "..." } }`Compaction marker`{ "type": "compaction", "id": "...", "timestamp": "..." }`
Transcript files are created with `0o600` permissions (owner read/write only).

The `readSessionMessages()` function in [src/gateway/session-utils.fs.ts73-118](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.ts#L73-L118) reads a transcript and returns the message array. Compaction entries are converted to synthetic system messages for UI display.

`resolveSessionTranscriptCandidates()` in [src/gateway/session-utils.fs.ts120-163](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.ts#L120-L163) searches multiple candidate paths for a transcript file, including the sessions directory, agent-specific paths, and a legacy `~/.openclaw/sessions/` fallback.

Sources: [src/gateway/session-utils.fs.ts73-163](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.ts#L73-L163)[src/config/sessions/sessions.test.ts257-300](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/sessions.test.ts#L257-L300)

---

## Session Initialization Flow

Every inbound message runs through `initSessionState()` in [src/auto-reply/reply/session.ts165-579](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.ts#L165-L579) This function resolves the session key, checks freshness, applies resets, and persists the updated entry.

**Session initialization flow diagram**

```
no

yes

stale

fresh

yes

yes

no

yes

no

inbound MsgContext

resolveSessionKey(scope, ctx, mainKey)

loadSessionStore(storePath, skipCache=true)

entry exists?

isNewSession=true, sessionId=randomUUID()

evaluateSessionFreshness(updatedAt, policy)

resume: sessionId=entry.sessionId

reset trigger in body?
(/new, /reset, etc.)

build SessionEntry
(carry over overrides)

parentSessionKey present
and not yet forked?

forkSessionFromParent()
(SessionManager.createBranchedSession)

resolveAndPersistSessionFile()

updateSessionStore(storePath, ...)

was previous session
reset or replaced?

archiveSessionTranscripts(previousSessionId)

return SessionInitResult
```

Sources: [src/auto-reply/reply/session.ts165-579](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.ts#L165-L579)

---

## Reset Policies

Reset policies determine when a session is automatically expired and a new `sessionId` generated. The policy is resolved by `resolveSessionResetPolicy()` in [src/config/sessions/reset.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/reset.ts) (referenced from [src/auto-reply/reply/session.ts295-299](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.ts#L295-L299)).

**Reset policy by session type**
Reset typeDefault policyNotes`direct``daily` (at 4am local)DMs and webchat`group``daily` (at 4am local)Group chats`thread``daily` (at 4am local)Forum threads, Slack threads
Configurable via `session.resetByType` in `openclaw.json`:

```
"session": {
  "resetByType": {
    "direct": { "mode": "idle", "idleMinutes": 60 },
    "group":  { "mode": "daily" },
    "thread": { "mode": "none" }
  }
}
```

The `mode` values are:

- `"daily"` — session expires when the current local time is past 4am and the session's `updatedAt` is before the last 4am boundary.
- `"idle"` — session expires when it has not been updated for `idleMinutes` minutes.
- `"none"` — never auto-expire.

`evaluateSessionFreshness({ updatedAt, now, policy })` returns `{ fresh: boolean }`. If not fresh, `initSessionState` starts a new session.

Reset triggers (e.g., `/new`, `/reset` commands) are checked against `session.resetTriggers` (default: `["/new", "/reset"]`). Matching is case-insensitive. After a trigger fires, behavior overrides (thinking level, model override, etc.) are carried forward to the new session.

Sources: [src/auto-reply/reply/session.ts249-273](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.ts#L249-L273)[src/auto-reply/reply/session.test.ts466-523](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.test.ts#L466-L523)[src/config/sessions/sessions.test.ts121-138](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/sessions.test.ts#L121-L138)

---

## Thread / Topic Forking

When a thread session is created with a `ParentSessionKey`, the system attempts to fork the parent's transcript so the thread inherits the parent's conversation history.

**Fork logic diagram**

```
no

yes

yes

no

leafId found

no leaf

thread SessionKey detected
with ParentSessionKey

parentEntry exists
in sessionStore?

no fork, start fresh

parentTokens > parentForkMaxTokens?
(default 100,000)

skip fork
set forkedFromParent=true
start fresh to avoid overflow

forkSessionFromParent()

SessionManager.open(parentSessionFile)
.getLeafId()

manager.createBranchedSession(leafId)

write new .jsonl with parentSession header

new sessionId + sessionFile

forkedFromParent=true
(prevents re-fork on subsequent turns)
```

`forkSessionFromParent()` is implemented in [src/auto-reply/reply/session.ts123-163](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.ts#L123-L163) The `parentForkMaxTokens` limit is configurable via `session.parentForkMaxTokens` in `openclaw.json`; the default is `100_000`.

The `forkedFromParent` flag on the session entry prevents re-fork attempts on every subsequent turn in the same thread.

Sources: [src/auto-reply/reply/session.ts108-163](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.ts#L108-L163)[src/auto-reply/reply/session.test.ts54-336](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.test.ts#L54-L336)

---

## Session Store Concurrency

`updateSessionStore(storePath, mutator)` in `src/config/sessions.js` uses a per-store-path Promise chain mutex to serialize concurrent writes. Each call reads the current file, runs the mutator, then writes the result back.

Key properties:

- Concurrent callers for the same `storePath` are queued and run one at a time.
- If one mutator throws, the queue continues with the next caller (the error does not poison the queue).
- `loadSessionStore(storePath)` uses an in-memory cache keyed by `(path, mtime)`. Pass `{ skipCache: true }` when freshness is critical (as `initSessionState` does).
- `normalizeSessionRuntimeModelFields()` runs at write time to strip orphaned `modelProvider` fields when no `model` is present.

Sources: [src/config/sessions/sessions.test.ts140-255](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/sessions.test.ts#L140-L255)[src/config/sessions/types.ts174-212](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/types.ts#L174-L212)

---

## Path Safety

`validateSessionId()` in [src/config/sessions/paths.ts60-66](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/paths.ts#L60-L66) enforces that session IDs match `/^[a-z0-9][a-z0-9._-]{0,127}$/i`, rejecting path traversal strings like `../etc/passwd`.

`resolveSessionFilePath()` (referenced throughout) validates that a stored `sessionFile` path resolves within the agent's sessions directory. If a stored path is outside the sessions dir (including symlinks that escape the boundary), it falls back to a derived path inside the sessions dir.

Sources: [src/config/sessions/paths.ts58-88](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/paths.ts#L58-L88)[src/config/sessions/sessions.test.ts45-118](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/sessions.test.ts#L45-L118)

---

## `sessions.*` RPC Methods

All session RPC handlers are implemented in `sessionsHandlers` in [src/gateway/server-methods/sessions.ts283](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods/sessions.ts#L283-LNaN) Schema definitions are in [src/gateway/protocol/schema/sessions.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/sessions.ts)

**sessions.* method overview diagram**

```
sessions.list

sessions.preview

sessions.resolve

sessions.patch

sessions.reset

sessions.delete

WebSocket client

sessionsHandlers
[sessions.list]

sessionsHandlers
[sessions.preview]

sessionsHandlers
[sessions.resolve]

sessionsHandlers
[sessions.patch]

sessionsHandlers
[sessions.reset]

sessionsHandlers
[sessions.delete]

loadCombinedSessionStoreForGateway()

readSessionPreviewItemsFromTranscript()

resolveSessionKeyFromResolveParams()

applySessionsPatchToStore()

ensureSessionRuntimeCleanup()

archiveSessionTranscripts()
```

### `sessions.list`

Returns all sessions across all agents. Parameters:
ParameterTypeDescription`limit``integer?`Max results`activeMinutes``integer?`Only sessions active within N minutes`includeDerivedTitles``boolean?`Read first 8KB of each transcript for title`includeLastMessage``boolean?`Read last 16KB of each transcript for preview`label``string?`Filter by label`agentId``string?`Filter by agent`search``string?`Text search across keys/labels
### `sessions.preview`

Reads message previews from transcripts for a set of keys. Returns up to `limit` recent messages per session, truncated to `maxChars`.

### `sessions.resolve`

Resolves a session key from a `key`, `sessionId`, `label`, or `spawnedBy` reference. Useful for looking up a session key when only a label or session ID is known.

### `sessions.patch`

Updates mutable fields on a session entry without resetting it. Supported patch fields include `label`, `thinkingLevel`, `verboseLevel`, `reasoningLevel`, `model`, `sendPolicy`, `groupActivation`, `execHost`, `execSecurity`, `spawnedBy`, and others. Webchat clients are not permitted to call `sessions.patch`.

When `model` is patched without a `provider`, `mergeSessionEntry` clears any stale `modelProvider` to prevent provider mismatch.

### `sessions.reset`

Starts a fresh conversation under an existing session key:

1. Fires internal `command`/`new`/`reset` hook via `triggerInternalHook()`.
2. Calls `ensureSessionRuntimeCleanup()`: aborts in-flight embedded agent runs, stops subagents, clears session queues.
3. Closes ACP runtime session if present (`closeAcpRuntimeForSession`).
4. Generates a new `sessionId` and writes it to the store.
5. Archives the old transcript via `archiveSessionTranscripts()`.
6. Returns the new entry.

### `sessions.delete`

Removes the session entry from the store. Optionally deletes the transcript (`deleteTranscript: true`) or archives it. Also unbinds Discord thread bindings and fires lifecycle hooks.

Sources: [src/gateway/server-methods/sessions.ts283](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods/sessions.ts#L283-LNaN)[src/gateway/protocol/schema/sessions.ts1-131](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/sessions.ts#L1-L131)

---

## Session Key Lifecycle Diagram

The following diagram shows how session keys and session IDs relate across resets and how the store and transcript files are updated.

**Session key vs. session ID lifecycle diagram**

```
"transcript .jsonl"
"sessions.json"
"initSessionState()"
"Inbound message"
"transcript .jsonl"
"sessions.json"
"initSessionState()"
"Inbound message"
alt
["fresh (resume)"]
["stale or reset trigger"]
"ctx with SessionKey"
"loadSessionStore(skipCache=true)"
"existing SessionEntry (or nil)"
"evaluateSessionFreshness()"
"updateSessionStore(): merge patch"
"sessionId = randomUUID()"
"updateSessionStore(): write new entry"
"archiveSessionTranscripts(oldSessionId)"
"resolveAndPersistSessionFile()"
"sessionFile path"
"SessionInitResult"
```

Sources: [src/auto-reply/reply/session.ts165-579](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session.ts#L165-L579)[src/gateway/session-utils.fs.ts187-227](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.ts#L187-L227)

---

## Session Archiving

When a session is reset or deleted, its transcript files are **archived** (renamed) rather than deleted immediately. This preserves history for debugging.

`archiveSessionTranscripts()` in [src/gateway/session-utils.fs.ts187-227](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.ts#L187-L227):

- Resolves all candidate transcript paths for the session ID.
- Renames each existing file to `{original}.{reason}.{timestamp}` where reason is `"reset"` or `"deleted"`.
- The `restrictToStoreDir` flag ensures only files within the agent's sessions directory are renamed.

`cleanupArchivedSessionTranscripts()` in [src/gateway/session-utils.fs.ts229-266](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.ts#L229-L266) can later remove archived files older than a given age.

Sources: [src/gateway/session-utils.fs.ts176-266](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/session-utils.fs.ts#L176-L266)[src/gateway/server-methods/sessions.ts125-142](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods/sessions.ts#L125-L142)

---

# Cron-Service

# Cron Service
Relevant source files
- [src/agents/openclaw-tools.subagents.test-harness.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/openclaw-tools.subagents.test-harness.ts)
- [src/browser/resolved-config-refresh.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/resolved-config-refresh.ts)
- [src/browser/server-context.hot-reload-profiles.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/server-context.hot-reload-profiles.test.ts)
- [src/commands/test-runtime-config-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/test-runtime-config-helpers.ts)
- [src/cron/isolated-agent.delivers-response-has-heartbeat-ok-but-includes.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.delivers-response-has-heartbeat-ok-but-includes.test.ts)
- [src/cron/isolated-agent.delivery.test-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.delivery.test-helpers.ts)
- [src/cron/isolated-agent.direct-delivery-forum-topics.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.direct-delivery-forum-topics.test.ts)
- [src/cron/isolated-agent.mocks.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.mocks.ts)
- [src/cron/isolated-agent.skips-delivery-without-whatsapp-recipient-besteffortdeliver-true.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.skips-delivery-without-whatsapp-recipient-besteffortdeliver-true.test.ts)
- [src/cron/isolated-agent.test-harness.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.test-harness.ts)
- [src/cron/isolated-agent/run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent/run.ts)
- [src/cron/run-log.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/run-log.test.ts)
- [src/cron/run-log.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/run-log.ts)
- [src/cron/service.delivery-plan.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.delivery-plan.test.ts)
- [src/cron/service.every-jobs-fire.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.every-jobs-fire.test.ts)
- [src/cron/service.issue-16156-list-skips-cron.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.issue-16156-list-skips-cron.test.ts)
- [src/cron/service.issue-regressions.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.issue-regressions.test.ts)
- [src/cron/service.persists-delivered-status.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.persists-delivered-status.test.ts)
- [src/cron/service.prevents-duplicate-timers.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.prevents-duplicate-timers.test.ts)
- [src/cron/service.read-ops-nonblocking.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.read-ops-nonblocking.test.ts)
- [src/cron/service.rearm-timer-when-running.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.rearm-timer-when-running.test.ts)
- [src/cron/service.restart-catchup.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.restart-catchup.test.ts)
- [src/cron/service.runs-one-shot-main-job-disables-it.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.runs-one-shot-main-job-disables-it.test.ts)
- [src/cron/service.skips-main-jobs-empty-systemevent-text.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.skips-main-jobs-empty-systemevent-text.test.ts)
- [src/cron/service.store-migration.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.store-migration.test.ts)
- [src/cron/service.store.migration.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.store.migration.test.ts)
- [src/cron/service.test-harness.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.test-harness.ts)
- [src/cron/service/locked.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/locked.ts)
- [src/cron/service/ops.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/ops.ts)
- [src/cron/service/state.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/state.ts)
- [src/cron/service/timer.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts)
- [src/cron/store.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/store.ts)
- [src/cron/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/types.ts)
- [src/discord/monitor.tool-result.test-harness.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.tool-result.test-harness.ts)
- [src/gateway/protocol/schema/cron.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/cron.ts)
- [src/gateway/server-cron.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-cron.ts)

The Cron Service is an internal scheduler embedded in the Gateway that runs time-triggered jobs. It supports one-shot and recurring schedules, two execution modes (injecting into a main session or running a full isolated agent turn), and optional outbound delivery of results to messaging channels.

This page covers the scheduler internals, job data structures, execution pipeline, delivery system, run log, and the `cron.*` RPC methods exposed over the Gateway WebSocket protocol. For the overall Gateway architecture see page [2](https://github.com/openclaw/openclaw/blob/8090cb4c/2) and for the Agent execution pipeline that isolated cron jobs invoke see page [3.1](https://github.com/openclaw/openclaw/blob/8090cb4c/3.1)

---

## Core Data Model

### CronJob

A `CronJob` is the central record. Its type is defined in [src/cron/types.ts111-128](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/types.ts#L111-L128)
FieldTypeDescription`id``string`Unique job identifier`name``string`Human-readable label`agentId``string?`Target agent; falls back to default agent`sessionKey``string?`Origin session namespace for wake routing`enabled``boolean`Whether the job participates in scheduling`deleteAfterRun``boolean?`Delete the job after a successful run`schedule``CronSchedule`When to fire`sessionTarget``CronSessionTarget``"main"` or `"isolated"``wakeMode``CronWakeMode``"now"` or `"next-heartbeat"``payload``CronPayload`What to do when fired`delivery``CronDelivery?`How to deliver results to a channel`state``CronJobState`Runtime tracking fields
### Schedule Types

Defined in [src/cron/types.ts3-12](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/types.ts#L3-L12)
`kind`FieldsBehavior`at``at: string` (ISO 8601)One-shot: fires once at the specified time`every``everyMs: number`, `anchorMs?: number`Interval: fires repeatedly with a fixed gap from an anchor point`cron``expr: string`, `tz?: string`, `staggerMs?: number`Cron expression (supports seconds-level); optional timezone and deterministic stagger window
The `staggerMs` field on `cron` schedules introduces a deterministic per-job offset derived from the job ID (via SHA-256 hash) to avoid all jobs firing exactly at the top of the hour.

### Payload Kinds

Defined in [src/cron/types.ts58-72](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/types.ts#L58-L72)
`kind`FieldsBehavior`systemEvent``text: string`Injects `text` as a system event into the main session`agentTurn``message`, `model?`, `thinking?`, `timeoutSeconds?`, `allowUnsafeExternalContent?`Runs a full isolated agent turn with the given message
### Session Targets
ValueDescription`"main"`The payload text is enqueued as a system event on the main session; no separate agent context is created`"isolated"`A dedicated session is created (or reused) for this job; the agent runs independently
### Delivery Modes

Defined in [src/cron/types.ts19-27](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/types.ts#L19-L27)
ModeBehavior`"none"`No outbound delivery; result is only available in the run log`"announce"`After the isolated run, dispatch output to the specified channel via the subagent announce flow or a direct channel send`"webhook"`POST the result summary to an HTTP URL
---

## Service Architecture

**Title: CronService internal structure**

```
execution

service/ modules

CronService
(service.ts)

ops.ts
add/update/remove/list/run/status

timer.ts
onTimer/armTimer/executeJobCore

store.ts
ensureLoaded/persist

jobs.ts
computeJobNextRunAtMs/createJob

locked.ts
mutex serialization

state.ts
CronServiceState/CronServiceDeps

isolated-agent/run.ts
runCronIsolatedAgentTurn

isolated-agent/delivery-dispatch.ts
dispatchCronDelivery

run-log.ts
appendCronRunLog

server-cron.ts
buildGatewayCronService

jobs.json
CronStoreFile

runs/.jsonl
CronRunLogEntry
```

Sources: [src/cron/service/state.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/state.ts)[src/cron/service/ops.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/ops.ts)[src/cron/service/timer.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts)[src/cron/run-log.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/run-log.ts)[src/gateway/server-cron.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-cron.ts)

---

### CronServiceDeps

The `CronServiceDeps` interface ([src/cron/service/state.ts37-92](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/state.ts#L37-L92)) wires the scheduler to the rest of the Gateway:
DepSignaturePurpose`enqueueSystemEvent``(text, opts?) => void`Inject text into a main-session event queue`requestHeartbeatNow``(opts?) => void`Trigger the heartbeat runner without waiting`runHeartbeatOnce``(opts?) => Promise<HeartbeatRunResult>`Wait for a single heartbeat cycle to complete`runIsolatedAgentJob``(params) => Promise<...>`Run a full isolated agent turn for a cron job`onEvent``(evt: CronEvent) => void`Receive job lifecycle events (added/started/finished/removed)`cronConfig``CronConfig?`Session retention and run log settings`resolveSessionStorePath``(agentId?) => string`Look up sessions.json path per agent
---

### CronServiceState

`CronServiceState` ([src/cron/service/state.ts98-107](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/state.ts#L98-L107)) is the runtime state object threaded through all internal operations:
FieldTypeDescription`deps``CronServiceDepsInternal`All wired-in dependencies`store``CronStoreFile | null`In-memory copy of `jobs.json``timer``NodeJS.Timeout | null`Active `setTimeout` handle`running``boolean``true` while a timer tick is executing`storeLoadedAtMs``number | null`When the store was last loaded`storeFileMtimeMs``number | null`Mtime of the store file at last load; used for change detection
---

## Scheduling & Timer Loop

**Title: Timer tick and job execution flow**

```
yes

no

none

some

armTimer(state)

nextWakeAtMs(state)
finds earliest nextRunAtMs

setTimeout(onTimer, clampedDelay)
max 60s cap

onTimer(state)

state.running?

armRunningRecheckTimer
60s fixed delay

state.running = true
armRunningRecheckTimer

locked: ensureLoaded
findDueJobs

due jobs?

recomputeNextRunsForMaintenance
persist

mark jobs runningAtMs
persist

executeJobCoreWithTimeout
per job

locked: applyOutcomeToStoredJob
recomputeNextRunsForMaintenance
persist

sweepCronRunSessions
session reaper

state.running = false
armTimer
```

Sources: [src/cron/service/timer.ts239-278](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts#L239-L278)[src/cron/service/timer.ts291-443](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts#L291-L443)

#### Key Invariants

- The timer delay is clamped to `MAX_TIMER_DELAY_MS = 60_000` ms. Even jobs scheduled years away will cause a tick every 60 seconds.
- If `state.running` is already `true` when the timer fires (a job is still running), a new 60 s recheck timer is armed and the tick exits immediately. This prevents the scheduler from going silent during long-running jobs (issue #12025).
- After every tick, the store is force-reloaded before writing results so that concurrent disk writes (e.g., from isolated delivery paths) are not overwritten.

#### Startup Catch-up

On `start()` ([src/cron/service/ops.ts89-128](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/ops.ts#L89-L128)), the service:

1. Clears any stale `runningAtMs` markers left from a previous crash.
2. Calls `runMissedJobs` ([src/cron/service/timer.ts500-578](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts#L500-L578)) to immediately execute any jobs whose `nextRunAtMs` is in the past and that have not yet run since the last terminal status (guarded by `skipAtIfAlreadyRan`).
3. Recomputes all `nextRunAtMs` values and arms the timer.

---

## Job Execution

**Title: executeJobCore branching by sessionTarget and payload kind**

```
isolated path

main path

yes

yes

no

no

no

yes

executeJobCore(state, job)

job.sessionTarget
== 'main'?

resolveJobPayloadTextForMain(job)

deps.enqueueSystemEvent(text)

job.wakeMode
== 'now'?

deps.runHeartbeatOnce()
wait for completion

deps.requestHeartbeatNow()
fire and forget

payload.kind
== 'agentTurn'?

return skipped

deps.runIsolatedAgentJob()
runCronIsolatedAgentTurn

post summary to main
via enqueueSystemEvent
```

Sources: [src/cron/service/timer.ts591-765](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts#L591-L765)

### Main Session Jobs

When `sessionTarget === "main"`:

- The payload `text` is passed to `enqueueSystemEvent`, which places it into the system-event queue for the appropriate session.
- With `wakeMode === "now"`: `runHeartbeatOnce` is awaited. If the main lane is busy (returns `reason: "requests-in-flight"`), the service retries up to `wakeNowHeartbeatBusyMaxWaitMs` (default 2 min) before falling back to `requestHeartbeatNow`.
- With `wakeMode === "next-heartbeat"`: `requestHeartbeatNow` is called non-blocking.

### Isolated Agent Jobs

When `sessionTarget === "isolated"` and `payload.kind === "agentTurn"`:

1. `runIsolatedAgentJob` is called, which delegates to `runCronIsolatedAgentTurn` ([src/cron/isolated-agent/run.ts90-646](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent/run.ts#L90-L646)).
2. The isolated run resolves the agent config, model, auth profile, and session; then calls `runEmbeddedPiAgent` (or `runCliAgent` for CLI-backed providers).
3. After the run completes, if delivery was not already handled and a summary is available, the summary is enqueued as a system event on the main session.

#### Security: External Hook Content

If the session key marks the job as an external hook (e.g., `hook:gmail:`), `runCronIsolatedAgentTurn` wraps the message in security boundaries using `buildSafeExternalPrompt` to prevent prompt injection, unless `allowUnsafeExternalContent: true` is set on the payload ([src/cron/isolated-agent/run.ts327-362](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent/run.ts#L327-L362)).

---

## Error Backoff

Defined in [src/cron/service/timer.ts94-105](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts#L94-L105)

When a recurring job errors, its next run is delayed by an exponential backoff. The natural next-run time and the backoff time are compared and the later one wins:
Consecutive ErrorsDelay130 seconds21 minute35 minutes415 minutes5+60 minutes
The `consecutiveErrors` counter resets to `0` on a successful run.

### One-shot Jobs

For `schedule.kind === "at"` jobs ([src/cron/service/timer.ts153-167](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts#L153-L167)):

- After any terminal status (`ok`, `error`, or `skipped`), the job is disabled (`enabled = false`) and `nextRunAtMs` is cleared.
- If `deleteAfterRun === true`**and** the status is `ok`, the job is deleted from the store entirely.

---

## Delivery

After an isolated run completes, `dispatchCronDelivery` ([src/cron/isolated-agent/delivery-dispatch.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent/delivery-dispatch.ts)) routes the output based on the job's `delivery` configuration.

**Title: Delivery dispatch decision tree**

```
no

yes

yes (skip)

no

yes (skip)

no

yes (thread)

no

webhook mode

dispatchCronDelivery

deliveryRequested?

skipHeartbeatDelivery?
(HEARTBEAT_OK with no media)

skipMessagingToolDelivery?
(agent already sent via tool)

resolvedDelivery.channel
has threadId?

direct channel send
(sendMessageTelegram etc.)

runSubagentAnnounceFlow
(announce mode)

HTTP POST
webhook URL

no delivery
post summary to main session
```

Sources: [src/cron/isolated-agent/run.ts585-645](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent/run.ts#L585-L645)[src/gateway/server-cron.ts52-70](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-cron.ts#L52-L70)

**Delivery modes in detail:**
`delivery.mode`Behavior`"none"`Output is only available in run log; no outbound send`"announce"`Calls `runSubagentAnnounceFlow` (or direct channel send for threaded targets). If `bestEffort: true`, delivery failures downgrade the run status from `error` to `ok``"webhook"`POSTs the run summary to `delivery.to` as JSON; timeout is 10 seconds
The `delivery.channel` field accepts any `ChannelId` (e.g., `"telegram"`, `"discord"`) or the special value `"last"` which resolves to the channel used in the most recent conversation in that session.

---

## Run Log

Every completed job execution is appended to a per-job JSONL file. The relevant code is in [src/cron/run-log.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/run-log.ts)

**Storage layout:**

```
~/.openclaw/cron/
  jobs.json              # CronStoreFile (all job definitions + state)
  runs/
    <jobId>.jsonl        # CronRunLogEntry per completed execution

```

`CronRunLogEntry` fields ([src/cron/run-log.ts7-23](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/run-log.ts#L7-L23)):
FieldDescription`ts`Unix timestamp of log write`jobId`Job identifier`status``ok` / `error` / `skipped``error`Error message if applicable`summary`Agent output summary`delivered`Whether output was delivered to a channel`deliveryStatus``delivered` / `not-delivered` / `unknown` / `not-requested``durationMs`Wall-clock duration of the run`model` / `provider`Model used for the run`usage`Token usage telemetry
Log files are pruned automatically: default cap is **2 MB** and **2000 lines** (`DEFAULT_CRON_RUN_LOG_MAX_BYTES`, `DEFAULT_CRON_RUN_LOG_KEEP_LINES`). These limits are configurable via `cron.runLog.maxBytes` and `cron.runLog.keepLines` in `openclaw.json` (see page [2.3.1](https://github.com/openclaw/openclaw/blob/8090cb4c/2.3.1)).

---

## Store Persistence

Defined in [src/cron/store.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/store.ts)
SymbolValue`DEFAULT_CRON_STORE_PATH``~/.openclaw/cron/jobs.json``resolveCronStorePath(cfg?)`Resolves store path from config or default`loadCronStore(storePath)`Reads and parses; returns empty store on `ENOENT``saveCronStore(storePath, store)`Atomic write via tmp-file rename
The store is hot-reloaded on each timer tick (force-reload) and on each mutation operation. The service tracks `storeFileMtimeMs` to skip unnecessary disk reads when the file has not changed.

---

## RPC Methods

The `cron.*` methods are available to authenticated operator clients over the Gateway WebSocket protocol (see page [2.1](https://github.com/openclaw/openclaw/blob/8090cb4c/2.1)). Schemas are defined in [src/gateway/protocol/schema/cron.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/cron.ts)

**Title: cron.* RPC surface mapped to internal operations**

```
run-log.ts

ops.ts

WebSocket RPC

cron.add
CronAddParamsSchema

cron.update
CronJobPatchSchema

cron.remove

cron.list
CronListParamsSchema

cron.listPage

cron.status

cron.run
mode: force | due

cron.runs.read
cron.runs.list
cron.runs.page

add(state, input)

update(state, id, patch)

remove(state, id)

list(state, opts)

listPage(state, opts)

status(state)

run(state, id, mode)

readCronRunLogEntries

readCronRunLogEntriesPage
```

Sources: [src/cron/service/ops.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/ops.ts)[src/gateway/protocol/schema/cron.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/cron.ts)[src/cron/run-log.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/run-log.ts)

### Method Reference
MethodParametersReturns`cron.add``CronAddParamsSchema``CronJob``cron.update``id`, `CronJobPatchSchema``CronJob``cron.remove``id``{ ok, removed }``cron.list``includeDisabled?`, `limit?`, `offset?`, `query?`, `enabled?`, `sortBy?`, `sortDir?``CronJob[]``cron.listPage`Same as list`CronListPageResult``cron.status`—`{ enabled, storePath, jobs, nextWakeAtMs }``cron.run``id`, `mode: "force" | "due"``CronRunResult``cron.runs.read``jobId`, `limit?``CronRunLogEntry[]``cron.runs.page``jobId`, `offset?`, `limit?`, `status?`, `sortDir?``CronRunLogPageResult`
The `cron.run` method with `mode: "force"` bypasses the schedule check and runs the job immediately. If the job is already running (`runningAtMs` is set), it returns `{ ok: true, ran: false, reason: "already-running" }` without executing a second instance.

---

## Gateway Integration

`buildGatewayCronService` in [src/gateway/server-cron.ts72](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-cron.ts#L72-LNaN) instantiates the `CronService` and wires it into the running Gateway:

- **Store path** is resolved from `cfg.cron?.store` via `resolveCronStorePath`.
- **Enabled flag**: disabled by either `OPENCLAW_SKIP_CRON=1` env var or `cron.enabled: false` in config.
- **Agent/session resolution**: `enqueueSystemEvent` and `requestHeartbeatNow` callbacks resolve the target `agentId` and `sessionKey` at call time by re-reading the live config (hot-reload safe).
- **Webhook delivery**: Handled in the `onEvent` callback inside `buildGatewayCronService`; fires HTTP POSTs using `fetchWithSsrFGuard` (SSRF-protected) with a 10 s timeout.
- **WebSocket broadcast**: Every `CronEvent` (added / updated / started / finished / removed) is broadcast to all connected operator clients via the Gateway's `broadcast` function.

Sources: [src/gateway/server-cron.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-cron.ts)

---

## Concurrency

The service serializes mutations through an async mutex (`locked` in [src/cron/service/locked.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/locked.ts)). Read operations (`list`, `status`, `listPage`) acquire the same lock but use a maintenance-only recompute path that never advances a past-due `nextRunAtMs` without executing the job, so they remain non-blocking even during long-running isolated turns.

Concurrent job execution is controlled by `cronConfig.maxConcurrentRuns` (resolved in `resolveRunConcurrency` in [src/cron/service/timer.ts73-79](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts#L73-L79)). It defaults to `1` (sequential). When greater than 1, the timer tick fans out across a worker pool up to `min(maxConcurrentRuns, dueJobCount)`.

---

# Agents

# Agents
Relevant source files
- [docs/concepts/context.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/context.md)
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/system-prompt.md)
- [docs/concepts/typing-indicators.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/typing-indicators.md)
- [src/agents/auth-profiles/oauth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles/oauth.test.ts)
- [src/agents/auth-profiles/oauth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles/oauth.ts)
- [src/agents/auth-profiles/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles/types.ts)
- [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-helpers.ts)
- [src/agents/pi-embedded-helpers/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-helpers/types.ts)
- [src/agents/pi-embedded-runner.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner.test.ts)
- [src/agents/pi-embedded-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner.ts)
- [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/compact.ts)
- [src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts)
- [src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts)
- [src/agents/pi-embedded-runner/run/params.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/params.ts)
- [src/agents/pi-embedded-runner/run/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/types.ts)
- [src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/system-prompt.ts)
- [src/agents/pi-embedded-runner/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/types.ts)
- [src/agents/pi-embedded-subscribe.handlers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.handlers.ts)
- [src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts)
- [src/agents/pi-embedded-subscribe.types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.types.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts)
- [src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-execution.ts)
- [src/auto-reply/reply/agent-runner-memory.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-memory.ts)
- [src/auto-reply/reply/agent-runner-utils.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-utils.test.ts)
- [src/auto-reply/reply/agent-runner-utils.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-utils.ts)
- [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts)
- [src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/followup-runner.ts)
- [src/auto-reply/reply/normalize-reply.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/normalize-reply.ts)
- [src/auto-reply/reply/test-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/test-helpers.ts)
- [src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/typing-mode.ts)
- [src/browser/control-auth.auto-token.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/control-auth.auto-token.test.ts)
- [src/browser/control-auth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/control-auth.test.ts)
- [src/browser/control-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/control-auth.ts)
- [src/cli/models-cli.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/models-cli.test.ts)
- [src/gateway/startup-auth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/startup-auth.test.ts)
- [src/gateway/startup-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/startup-auth.ts)

This page covers what an agent is in OpenClaw, how multiple agents are configured and isolated from each other, how workspace directories are resolved, and how the embedded runner orchestrates a conversational turn. For a detailed end-to-end execution trace, see [Agent Execution Pipeline](/openclaw/openclaw/3.1-agent-execution-pipeline). For system prompt construction, see [System Prompt](/openclaw/openclaw/3.2-system-prompt). For model and API key configuration, see [Model Configuration & Authentication](/openclaw/openclaw/3.3-model-configuration-and-authentication). For the tool system, see [Tools](/openclaw/openclaw/3.4-tools). For the command processing layer that sits above the agent, see [Commands & Auto-Reply](/openclaw/openclaw/3.5-commands-and-auto-reply).

---

## What is an Agent

An agent is a named AI assistant configuration that processes inbound messages and produces replies. Each agent:

- Has a unique **agent ID** — a key in `openclaw.json` under `agents`, with `"default"` as the baseline fallback.
- Owns a **workspace directory** on disk where it reads and writes files.
- Is assigned a primary **AI model and provider** (with optional fallbacks).
- Has a **tool policy** controlling which tools it can invoke and which filesystem paths it can access.
- Maintains **conversation history** in per-session JSONL transcript files.

An agent is distinct from a session. A single agent can have many concurrent sessions (one per Telegram chat, one per Discord thread, one per cron job, etc.). The agent defines the configuration; the session holds the conversational state.

The primary runtime is the **embedded runner** — an in-process engine built on the `@mariozechner/pi-coding-agent` SDK (`createAgentSession`, `SessionManager`). A separate **CLI runner** path (`runCliAgent`) exists for providers that expose their own agentic CLI (Claude Code, Codex CLI, Gemini CLI, etc.).

---

## Agent Configuration

Agents are declared in `openclaw.json` under `agents.defaults` (baseline, always applied) and `agents.<agentId>` (per-agent overrides). For the full field reference, see [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference).
Config pathPurpose`agents.defaults.workspace`Workspace root directory for file operations`agents.defaults.userTimezone`Timezone string injected into the system prompt`agents.defaults.timeFormat``auto` / `12` / `24` — time display format`agents.defaults.heartbeat.prompt`Periodic heartbeat poll message sent by the cron service`agents.defaults.bootstrapMaxChars`Per-file size limit for injected workspace context files (default: 20,000)`agents.defaults.bootstrapTotalMaxChars`Total size cap across all injected workspace files (default: 150,000)
The function `resolveSessionAgentIds` (in `src/agents/agent-scope.ts`) maps a session key and config to `{ defaultAgentId, sessionAgentId }`. The `sessionAgentId` drives all per-session decisions: workspace resolution, tool policy, model selection, and prompt mode. `isDefaultAgent` (when `sessionAgentId === defaultAgentId`) is checked to conditionally include features like heartbeats that apply only to the primary agent.

---

## Session Isolation

Each session is independently isolated from others through several mechanisms:
Isolation axisMechanismConversation historyUnique `sessionFile` (`.jsonl` JSONL transcript) per session, opened by `SessionManager.open(sessionFile)`File accessPer-agent `workspaceDir` resolved by `resolveRunWorkspaceDir` using agent ID and session keyConcurrencyPer-session command lane via `resolveSessionLane(sessionKey)` — concurrent messages to the same session are serialized; a global lane via `resolveGlobalLane` provides a shared execution queueSubagentsDetected via `isSubagentSessionKey(sessionKey)`; automatically assigned `promptMode: "minimal"` and filtered bootstrap files
Session keys are structured strings that encode agent routing context. They serve as stable identifiers for workspace resolution, session file paths, command-lane routing, and tool policy lookups.

---

## Workspace Directory

The workspace is the agent's root for all file operations. It is resolved by `resolveRunWorkspaceDir` (in `src/agents/workspace-run.ts`) using the agent ID, session key, and config. The process working directory is `chdir`'d to this path at the start of every run attempt [src/agents/pi-embedded-runner/run/attempt.ts454](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L454-L454)

When Docker sandbox mode is active (see [Sandboxing](/openclaw/openclaw/7.2-sandboxing)), the workspace splits into two paths:

- **Host path** (`workspaceDir`) — used by file tools (`read`, `write`, `edit`) that bridge the host filesystem into the sandbox.
- **Container path** (`containerWorkspaceDir`) — the path inside Docker where `exec` commands run; injected into the system prompt as the working directory guidance.

Workspace context files (`AGENTS.md`, `SOUL.md`, `MEMORY.md`, etc.) are read and injected into the system prompt on every turn via `resolveBootstrapContextForRun`. Their sizes are capped by `bootstrapMaxChars` and `bootstrapTotalMaxChars`. See [System Prompt](/openclaw/openclaw/3.2-system-prompt) for the full list of injected files and truncation behavior.

---

## Agent System Architecture

The diagram below maps the key agent system concepts to their implementing code entities.

**Agent System: Concept-to-Code Entity Map**

```
Code Entities

Concepts

Agent Configuration

Session State

Workspace Directory

System Prompt

Tool Set

Model and Auth

resolveSessionAgentIds
agent-scope.ts

SessionManager
pi-coding-agent SDK

resolveRunWorkspaceDir
workspace-run.ts

buildAgentSystemPrompt
system-prompt.ts

createOpenClawCodingTools
pi-tools.ts

resolveModel
pi-embedded-runner/model.ts

getApiKeyForModel
model-auth.ts
```

Sources: [src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts)[src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts)[src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts)

---

## The Embedded Runner

The embedded runner is organized as a layered call stack. Each layer has a distinct responsibility:
LayerFunctionFile1. Turn orchestration`runReplyAgent``src/auto-reply/reply/agent-runner.ts`2. Fallback loop wrapper`runAgentTurnWithFallback``src/auto-reply/reply/agent-runner-execution.ts`3. Model fallback`runWithModelFallback``src/agents/model-fallback.ts`4. Auth and retry loop`runEmbeddedPiAgent``src/agents/pi-embedded-runner/run.ts`5. Single attempt`runEmbeddedAttempt``src/agents/pi-embedded-runner/run/attempt.ts`6. Streaming event handler`subscribeEmbeddedPiSession``src/agents/pi-embedded-subscribe.ts`
**`runEmbeddedPiAgent`** is responsible for:

- Resolving the model object (`resolveModel`) and enforcing context window minimums (`evaluateContextWindowGuard`)
- Resolving auth profiles in priority order (`resolveAuthProfileOrder`) and rotating through them on failure (`advanceAuthProfile`)
- Running the per-attempt retry loop with thinking-level fallback and compaction retries

**`runEmbeddedAttempt`** is responsible for:

- Loading workspace skills (`loadWorkspaceSkillEntries`, `resolveSkillsPromptForRun`)
- Loading and size-capping bootstrap files (`resolveBootstrapContextForRun`)
- Assembling the tool set (`createOpenClawCodingTools`, `sanitizeToolsForGoogle`, `splitSdkTools`)
- Building the system prompt (`buildEmbeddedSystemPrompt`)
- Acquiring a session write lock (`acquireSessionWriteLock`)
- Opening the session file and initializing the SDK session (`SessionManager.open`, `createAgentSession`)
- Subscribing to streaming model events (`subscribeEmbeddedPiSession`)

**Turn Execution Call Chain**

```
yes

no

yes

no

Inbound message

runReplyAgent (agent-runner.ts)

runAgentTurnWithFallback (agent-runner-execution.ts)

isCliProvider?

runCliAgent (cli-runner.ts)

runWithModelFallback (model-fallback.ts)

runEmbeddedPiAgent (run.ts)

resolveAuthProfileOrder + applyApiKeyInfo (model-auth.ts)

runEmbeddedAttempt (run/attempt.ts)

createOpenClawCodingTools + buildEmbeddedSystemPrompt

SessionManager.open + createAgentSession (pi-coding-agent)

subscribeEmbeddedPiSession (pi-embedded-subscribe.ts)

context overflow?

compactEmbeddedPiSessionDirect (compact.ts)

EmbeddedPiRunResult -> ReplyPayload
```

Sources: [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts)[src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-execution.ts)[src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts)[src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts)[src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts)

---

## Session & Transcript Management

Conversation history is stored in JSONL files — one JSON object per line, one file per session. The `SessionManager` class (from `@mariozechner/pi-coding-agent`) reads and appends messages to these files.

Key operations performed around the session file:
OperationFunctionFileResolve file path`resolveSessionTranscriptPath``src/config/sessions.ts`Prevent concurrent writes`acquireSessionWriteLock``src/agents/session-write-lock.ts`Fix orphaned user messages`repairSessionFileIfNeeded``src/agents/session-file-repair.ts`Remove unpaired tool entries`sanitizeToolUseResultPairing``src/agents/session-transcript-repair.ts`Warm file into read cache`prewarmSessionFile``src/agents/pi-embedded-runner/session-manager-cache.ts`Enforce tool-name allowlist`guardSessionManager``src/agents/session-tool-result-guard-wrapper.ts`
Session write locks prevent a race condition where two concurrent messages to the same session produce interleaved transcript entries. The lock's max hold time is derived from the run's `timeoutMs` via `resolveSessionLockMaxHoldFromTimeout`.

Sources: [src/agents/pi-embedded-runner/run/attempt.ts707-741](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L707-L741)

---

## System Prompt Modes

`buildAgentSystemPrompt` in [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts) assembles the system prompt from injected context files, tool lists, skills, heartbeat config, runtime info, and safety guardrails. The `promptMode` parameter controls the scope of included content:
ModeTriggerWhat is omitted relative to `"full"``"full"`All normal agent sessionsNothing`"minimal"`Subagent sessions (`isSubagentSessionKey` → `true`)Authorized Senders, Reply Tags, Messaging, Memory Recall, Heartbeats, Silent Replies, Model Aliases, OpenClaw Self-Update`"none"`Bare identity onlyAll sections; returns the single identity line
The mode is selected automatically by `resolvePromptModeForSession(sessionKey)`[src/agents/pi-embedded-runner/run/attempt.ts347-352](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L347-L352) Subagent sessions also receive a `"Subagent Context"` header for any `extraSystemPrompt` injection, instead of the `"Group Chat Context"` header used in full mode.

For complete details on prompt structure and workspace file injection, see [System Prompt](/openclaw/openclaw/3.2-system-prompt).

Sources: [src/agents/system-prompt.ts11-17](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L11-L17)[src/agents/pi-embedded-runner/run/attempt.ts347-352](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L347-L352)

---

## Context Compaction

When conversation history approaches the model's context window limit, the runner triggers automatic compaction:

1. **Detect overflow** — `isContextOverflowError` or `isLikelyContextOverflowError` (in `src/agents/pi-embedded-helpers/errors.ts`) identifies the condition.
2. **Compact** — `compactEmbeddedPiSessionDirect` in [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/compact.ts) runs a summarization pass using the same configured model, condensing the session history.
3. **Inject context** — `readPostCompactionContext` injects a post-compaction workspace snapshot as a system event for the next turn.
4. **Retry** — the outer loop in `runEmbeddedPiAgent` retries the original prompt with the compacted history.
5. **Reset on failure** — if compaction itself fails (too many retries), the session is reset: a new `sessionId` is generated, the transcript is discarded, and the run restarts from scratch.

The compaction count is tracked in `EmbeddedPiAgentMeta.compactionCount` and persisted in the session store via `persistRunSessionUsage`.

Sources: [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/compact.ts)[src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts)[src/auto-reply/reply/agent-runner.ts676-704](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L676-L704)

---

## Key Types Reference
TypeFilePurpose`EmbeddedPiRunResult``src/agents/pi-embedded-runner/types.ts`Return value of `runEmbeddedPiAgent` — reply payloads, metadata, messaging tool sent-texts`EmbeddedPiRunMeta``src/agents/pi-embedded-runner/types.ts`Duration, agent metadata, error kind (`context_overflow`, `compaction_failure`, `role_ordering`, `retry_limit`), stop reason`EmbeddedPiAgentMeta``src/agents/pi-embedded-runner/types.ts`Session ID, provider, model, token usage breakdown, `lastCallUsage`, compaction count`EmbeddedRunAttemptParams``src/agents/pi-embedded-runner/run/types.ts`Full parameter set passed into `runEmbeddedAttempt`, extends `RunEmbeddedPiAgentParams` with resolved model/auth`EmbeddedRunAttemptResult``src/agents/pi-embedded-runner/run/types.ts`Per-attempt result: assistant texts, tool metas, usage, error flags, messaging tool state, client tool call`RunEmbeddedPiAgentParams``src/agents/pi-embedded-runner/run/params.ts`Top-level parameters for `runEmbeddedPiAgent` — session, workspace, config, prompt, streaming callbacks`PromptMode``src/agents/system-prompt.ts``"full"` / `"minimal"` / `"none"` — controls system prompt scope`CompactEmbeddedPiSessionParams``src/agents/pi-embedded-runner/compact.ts`Parameters for the compaction operation — session, model, provider, workspace, skills snapshot
Sources: [src/agents/pi-embedded-runner/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/types.ts)[src/agents/pi-embedded-runner/run/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/types.ts)[src/agents/pi-embedded-runner/run/params.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/params.ts)[src/agents/system-prompt.ts11-17](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L11-L17)[src/agents/pi-embedded-runner/compact.ts88-125](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/compact.ts#L88-L125)

---

# Agent-Execution-Pipeline

# Agent Execution Pipeline
Relevant source files
- [docs/concepts/context.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/context.md)
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/system-prompt.md)
- [docs/concepts/typing-indicators.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/typing-indicators.md)
- [docs/tools/slash-commands.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/slash-commands.md)
- [src/agents/auth-profiles/oauth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles/oauth.test.ts)
- [src/agents/auth-profiles/oauth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles/oauth.ts)
- [src/agents/auth-profiles/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles/types.ts)
- [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-helpers.ts)
- [src/agents/pi-embedded-helpers/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-helpers/types.ts)
- [src/agents/pi-embedded-runner.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner.test.ts)
- [src/agents/pi-embedded-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner.ts)
- [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/compact.ts)
- [src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts)
- [src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts)
- [src/agents/pi-embedded-runner/run/params.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/params.ts)
- [src/agents/pi-embedded-runner/run/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/types.ts)
- [src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/system-prompt.ts)
- [src/agents/pi-embedded-runner/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/types.ts)
- [src/agents/pi-embedded-subscribe.handlers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.handlers.ts)
- [src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts)
- [src/agents/pi-embedded-subscribe.types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.types.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts)
- [src/agents/tools/session-status-tool.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/session-status-tool.ts)
- [src/auto-reply/command-detection.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/command-detection.ts)
- [src/auto-reply/commands-args.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-args.ts)
- [src/auto-reply/commands-registry.data.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-registry.data.ts)
- [src/auto-reply/commands-registry.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-registry.test.ts)
- [src/auto-reply/commands-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-registry.ts)
- [src/auto-reply/group-activation.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/group-activation.ts)
- [src/auto-reply/reply.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply.ts)
- [src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-execution.ts)
- [src/auto-reply/reply/agent-runner-memory.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-memory.ts)
- [src/auto-reply/reply/agent-runner-utils.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-utils.test.ts)
- [src/auto-reply/reply/agent-runner-utils.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-utils.ts)
- [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts)
- [src/auto-reply/reply/commands-core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands-core.ts)
- [src/auto-reply/reply/commands-info.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands-info.ts)
- [src/auto-reply/reply/commands-status.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands-status.ts)
- [src/auto-reply/reply/commands.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands.test.ts)
- [src/auto-reply/reply/commands.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands.ts)
- [src/auto-reply/reply/directive-handling.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/directive-handling.ts)
- [src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/followup-runner.ts)
- [src/auto-reply/reply/normalize-reply.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/normalize-reply.ts)
- [src/auto-reply/reply/test-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/test-helpers.ts)
- [src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/typing-mode.ts)
- [src/auto-reply/send-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/send-policy.ts)
- [src/auto-reply/status.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/status.test.ts)
- [src/auto-reply/status.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/status.ts)
- [src/auto-reply/templating.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/templating.ts)
- [src/browser/control-auth.auto-token.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/control-auth.auto-token.test.ts)
- [src/browser/control-auth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/control-auth.test.ts)
- [src/browser/control-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/control-auth.ts)
- [src/cli/models-cli.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/models-cli.test.ts)
- [src/gateway/startup-auth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/startup-auth.test.ts)
- [src/gateway/startup-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/startup-auth.ts)

This page traces a message end-to-end: from when a processed message body arrives at the agent layer, through model invocation, streaming, and reply delivery. It covers the function call chain, lane queuing, model resolution, auth profile failover, session initialization, streaming partial replies, compaction on context overflow, and typing indicators.

For how commands and directives are detected and dispatched *before* the agent is invoked, see [Commands & Auto-Reply](/openclaw/openclaw/3.5-commands-and-auto-reply). For the contents of the system prompt built on each turn, see [System Prompt](/openclaw/openclaw/3.2-system-prompt). For how tools are assembled and policy-enforced, see [Tools](/openclaw/openclaw/3.4-tools). For session storage and lifecycle management, see [Session Management](/openclaw/openclaw/2.4-session-management).

---

## Pipeline Layers

A single agent turn passes through four named function layers before reaching the model API.
LayerFunctionFilePrimary Concern1`runReplyAgent``src/auto-reply/reply/agent-runner.ts`Queue policy, steer/inject, typing, post-processing2`runAgentTurnWithFallback``src/auto-reply/reply/agent-runner-execution.ts`Retry loops (compaction, transient errors, role ordering conflicts)3`runEmbeddedPiAgent``src/agents/pi-embedded-runner/run.ts`Lane queuing, model resolution, auth profile iteration4`runEmbeddedAttempt``src/agents/pi-embedded-runner/run/attempt.ts`Workspace setup, tool creation, session init, single attempt—`subscribeEmbeddedPiSession``src/agents/pi-embedded-subscribe.ts`Streaming events, block chunking, tag stripping, tool callbacks
Sources: [src/auto-reply/reply/agent-runner.ts92-122](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L92-L122)[src/auto-reply/reply/agent-runner-execution.ts72-99](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-execution.ts#L72-L99)[src/agents/pi-embedded-runner/run.ts192-212](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts#L192-L212)[src/agents/pi-embedded-runner/run/attempt.ts427-440](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L427-L440)[src/agents/pi-embedded-subscribe.ts34-82](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts#L34-L82)

---

**Pipeline call chain and primary data flow**

```
"Model API"
"subscribeEmbeddedPiSession (pi-embedded-subscribe.ts)"
"runEmbeddedAttempt (run/attempt.ts)"
"runEmbeddedPiAgent (run.ts)"
"runAgentTurnWithFallback (agent-runner-execution.ts)"
"runReplyAgent (agent-runner.ts)"
"Channel (inbound)"
"Model API"
"subscribeEmbeddedPiSession (pi-embedded-subscribe.ts)"
"runEmbeddedAttempt (run/attempt.ts)"
"runEmbeddedPiAgent (run.ts)"
"runAgentTurnWithFallback (agent-runner-execution.ts)"
"runReplyAgent (agent-runner.ts)"
"Channel (inbound)"
"Queue check: drop / enqueue / proceed"
"Steer check: queueEmbeddedPiMessage?"
"Session lane + global lane queued"
"Auth profile loop: applyApiKeyInfo"
"Build system prompt, create tools, open session"
"commandBody, followupRun, sessionCtx"
"run agent turn"
"runWithModelFallback → runEmbeddedPiAgent"
"runEmbeddedAttempt(params)"
"subscribeEmbeddedPiSession(params)"
"createAgentSession + agent.run(prompt)"
"streaming events (text_delta, tool_call, usage)"
"onBlockReply (partial streamed chunks)"
"EmbeddedRunAttemptResult"
"EmbeddedPiRunResult"
"AgentRunLoopResult"
"ReplyPayload[]"
```

Sources: [src/auto-reply/reply/agent-runner.ts92-728](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L92-L728)[src/auto-reply/reply/agent-runner-execution.ts72-380](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-execution.ts#L72-L380)[src/agents/pi-embedded-runner/run.ts192](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts#L192-LNaN)[src/agents/pi-embedded-runner/run/attempt.ts427](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L427-LNaN)[src/agents/pi-embedded-subscribe.ts34](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts#L34-LNaN)

---

## Layer 1: runReplyAgent

`runReplyAgent`[src/auto-reply/reply/agent-runner.ts92-728](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L92-L728) is the first function in the agent path. It receives:

- `commandBody` – the processed message text (after directive stripping)
- `followupRun` – a `FollowupRun` struct containing the `run` object (`sessionId`, `sessionFile`, `provider`, `model`, `config`, `prompt`, etc.)
- `sessionCtx` – a `TemplateContext` with sender/channel metadata
- `typing` – a `TypingController` for typing indicator lifecycle
- Queue, session store, and verbose-level parameters

### Queue and Steer Checks

Before invoking the model, two early-exit checks run:

**Steer check** – If `shouldSteer && isStreaming` is true, `queueEmbeddedPiMessage` is called to inject the new message into the currently-active streaming run for the same session. If the injection succeeds, the function returns early without starting a new turn.

**Queue policy** – `resolveActiveRunQueueAction`[src/auto-reply/reply/queue-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/queue-policy.ts) returns one of:

- `"drop"` – silently discard the message
- `"enqueue-followup"` – save the run to a follow-up queue via `enqueueFollowupRun`
- `"proceed"` – continue to model invocation

### Post-Processing

After `runAgentTurnWithFallback` completes, `runReplyAgent` performs:
ActionFunctionFallback state tracking`resolveFallbackTransition` → updates `fallbackNotice*` fields in session storeCompaction count`incrementRunCompactionCount` (if compaction ran)Usage persistence`persistRunSessionUsage`Diagnostic event`emitDiagnosticEvent` (`type: "model.usage"`)Response usage line`formatResponseUsageLine` (appended if `/usage` is enabled)Verbose noticesPrepend notices for new sessions, fallback, and compaction eventsUnscheduled reminder note`appendUnscheduledReminderNote` if agent promised a reminder but created no cron job
Sources: [src/auto-reply/reply/agent-runner.ts154-248](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L154-L248)[src/auto-reply/reply/agent-runner.ts362-716](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L362-L716)[src/auto-reply/reply/session-run-accounting.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session-run-accounting.ts)

---

## Layer 2: runAgentTurnWithFallback

`runAgentTurnWithFallback`[src/auto-reply/reply/agent-runner-execution.ts72-380](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-execution.ts#L72-L380) wraps the model invocation in a retry loop that handles several failure modes.

**Retry loop in runAgentTurnWithFallback**

```
success

context overflow error

success

failure

compaction failure error

transient HTTP error

role ordering conflict

max retries exceeded

runAgentTurnWithFallback

runWithModelFallback

Outcome?

return AgentRunLoopResult (kind=success)

compactEmbeddedPiSession (outer)

Compaction result?

resetSessionAfterCompactionFailure

resetSessionAfterCompactionFailure

sleep TRANSIENT_HTTP_RETRY_DELAY_MS (2500ms)

resetSessionAfterRoleOrderingConflict

return error payload
```

Key failure classifications used:
ClassifierSourceAction`isContextOverflowError``pi-embedded-helpers.ts`Trigger compaction then retry`isLikelyContextOverflowError``pi-embedded-helpers.ts`Same as above`isCompactionFailureError``pi-embedded-helpers.ts`Reset session ID, retry`isTransientHttpError``pi-embedded-helpers.ts`Wait 2,500 ms, retry onceRole ordering conflictGoogle/Gemini-specificReset session + delete transcript
`resetSessionAfterCompactionFailure` generates a new `sessionId` and `sessionFile` via `generateSecureUuid`, updates the session store, and points the `followupRun` at the new file.

`resetSessionAfterRoleOrderingConflict` does the same but also deletes the old transcript file.

This layer also manages the `blockReplyPipeline` (`createBlockReplyPipeline`) for streaming partial replies. `createBlockReplyDeliveryHandler` routes flushed chunks directly to the channel during the turn.

Sources: [src/auto-reply/reply/agent-runner-execution.ts100-380](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-execution.ts#L100-L380)[src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-helpers.ts)[src/auto-reply/reply/block-reply-pipeline.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/block-reply-pipeline.ts)

---

## Layer 3: runEmbeddedPiAgent

`runEmbeddedPiAgent`[src/agents/pi-embedded-runner/run.ts192](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts#L192-LNaN) handles concurrency, model resolution, and auth profile iteration.

### Lane Queuing

Every call is serialized through two lanes:

```
enqueueSession(() =>
  enqueueGlobal(async () => { ... })
)

```

- **Session lane** – keyed on `sessionKey` (or `sessionId`), serialized via `resolveSessionLane`. Prevents concurrent writes to the same session file.
- **Global lane** – keyed on the configured `lane` name (or a default), serialized via `resolveGlobalLane`. Bounds total parallel model calls across all sessions.

Both use `enqueueCommandInLane` from `src/process/command-queue.ts`.

### Model Resolution

`resolveModel(provider, modelId, agentDir, config)`[src/agents/pi-embedded-runner/model.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/model.ts) looks up the model definition (API type, context window, input modalities, cost) from the `openclaw-models.json` registry. If the model is not found, a `FailoverError` is thrown with `reason: "model_not_found"`.

`evaluateContextWindowGuard` then checks the resolved context window:

- Below `CONTEXT_WINDOW_WARN_BELOW_TOKENS` → logs a warning
- Below `CONTEXT_WINDOW_HARD_MIN_TOKENS` → throws `FailoverError` and blocks the run

### Auth Profile Iteration

**Auth profile iteration and fallover within runEmbeddedPiAgent**

```
yes

no

ok

auth error

rate limit

billing error

context overflow

no more profiles

runEmbeddedPiAgent

resolveAuthProfileOrder

iterate profileCandidates

isProfileInCooldown?

advance profileIndex

applyApiKeyInfo (setRuntimeApiKey)

runEmbeddedAttempt

Result?

markAuthProfileGood → return EmbeddedPiRunResult

markAuthProfileFailure

markAuthProfileFailure (cooldown)

throw billing error (no failover)

compactEmbeddedPiSessionDirect

throwAuthProfileFailover (FailoverError)
```

`authStore` (an `AuthProfileStore`) is loaded from `auth-profiles.json` in `agentDir`. `resolveAuthProfileOrder` sorts profiles by priority. A locked `authProfileId` (set by the user via `/model ... @profile`) bypasses the iteration and uses only that profile.

When a profile fails temporarily (rate limit), `markAuthProfileFailure` sets a cooldown timestamp. `isProfileInCooldown` skips it on future iterations.

Sources: [src/agents/pi-embedded-runner/run.ts192-480](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts#L192-L480)[src/agents/pi-embedded-runner/run.ts354-480](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts#L354-L480)[src/agents/pi-embedded-runner/lanes.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/lanes.ts)[src/agents/auth-profiles.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles.ts)

---

## Layer 4: runEmbeddedAttempt

`runEmbeddedAttempt`[src/agents/pi-embedded-runner/run/attempt.ts427](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L427-LNaN) executes a single model invocation attempt and sets up the full execution environment.

### Execution Environment Setup
StepKey Function / ClassPurposeWorkspace`resolveUserPath`, `fs.mkdir`Resolve and create workspace directorySandbox`resolveSandboxContext`Detect Docker sandbox; determine effective workspaceSkills`loadWorkspaceSkillEntries`, `resolveSkillsPromptForRun`Load skill definitions from workspaceBootstrap files`resolveBootstrapContextForRun`Load `AGENTS.md`, `SOUL.md`, `MEMORY.md`, etc. as `EmbeddedContextFile[]`Agent IDs`resolveSessionAgentIds`Determine `sessionAgentId` and `defaultAgentId`Tools`createOpenClawCodingTools`Build the full tool set for this agent and sessionGoogle sanitization`sanitizeToolsForGoogle`Adjust tool schemas for Gemini API compatibilitySystem prompt`buildEmbeddedSystemPrompt`Delegate to `buildAgentSystemPrompt` with all resolved paramsSession lock`acquireSessionWriteLock`Prevent concurrent writes to the JSONL transcriptSession repair`repairSessionFileIfNeeded`Fix corrupted or incomplete session transcriptsSession open`SessionManager.open` + `guardSessionManager`Open the session file with tool-use pairing guardsSession init`prepareSessionManagerForRun`Initialize cwd, inject session header if neededExtensions`buildEmbeddedExtensionFactories`Register compaction and context-pruning extensionsTool split`splitSdkTools`Partition tools into `builtInTools` and `customTools`Agent session`createAgentSession` (pi-coding-agent SDK)Create the `AgentSession` with model, tools, and session managerSystem prompt inject`applySystemPromptOverrideToSession`Write the computed system prompt into the sessionTool result guard`installToolResultContextGuard`Guard against tool results that would overflow context
Sources: [src/agents/pi-embedded-runner/run/attempt.ts427-820](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L427-L820)[src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/system-prompt.ts)[src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts)

### System Prompt Construction

`buildEmbeddedSystemPrompt`[src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/system-prompt.ts) calls `buildAgentSystemPrompt`[src/agents/system-prompt.ts189-664](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L189-L664) with all resolved parameters including tools, runtime info, context files, skills prompt, timezone, sandbox info, and reaction guidance.

The `promptMode` is resolved by `resolvePromptModeForSession`[src/agents/pi-embedded-runner/run/attempt.ts347-352](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L347-L352): sessions with a subagent key use `"minimal"` mode; all others use `"full"` mode. Minimal mode omits sections like `## Authorized Senders`, `## Heartbeats`, `## Silent Replies`, and `## Messaging`.

---

## Streaming: subscribeEmbeddedPiSession

`subscribeEmbeddedPiSession`[src/agents/pi-embedded-subscribe.ts34-640](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts#L34-L640) is called before the agent turn begins. It returns an event handler object that the pi-coding-agent SDK calls as the model streams output.

### Internal State
FieldTypePurpose`assistantTexts``string[]`Collected assistant text segments → final `ReplyPayload``toolMetas`arrayTool call metadata for verbose/tool-result display`deltaBuffer``string`In-progress text delta accumulation`blockBuffer``string`Text buffered for block reply chunking`blockState``{thinking, final, inlineCode}`Stateful tag-stripping context (crosses chunk boundaries)`messagingToolSentTexts``string[]`Texts already sent via the `message` tool (deduplication)`compactionInFlight``boolean`Pauses chunk emission during compaction`pendingCompactionRetry``number`Counts pending compactions to resolve after all complete
### Tag Stripping

`stripBlockTags`[src/agents/pi-embedded-subscribe.ts355-443](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts#L355-L443) handles two tag families across chunk boundaries:

- **`<think>` / `<thinking>` / `<thought>` / `<antthinking>`** — Content inside is stripped from the user-visible reply. Tracks open/close state across chunks via `blockState.thinking`.
- **`<final>`** — When `enforceFinalTag` is true (reasoning-tag providers), only content inside `<final>` is emitted; all other text is discarded.

Code-span detection (`buildCodeSpanIndex`) prevents tag matches inside backtick code spans.

### Block Reply Streaming

When the `onBlockReply` callback is provided, text is delivered incrementally. The `EmbeddedBlockChunker`[src/agents/pi-embedded-block-chunker.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-block-chunker.ts) splits the stream into delivery-sized pieces based on `blockReplyChunking` config (`minChars`, `maxChars`, `breakPreference`).

`emitBlockChunk`[src/agents/pi-embedded-subscribe.ts465-521](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts#L465-L521) is called for each chunk. It:

1. Strips `<think>` / `<final>` tags via `stripBlockTags`
2. Strips downgraded tool call text via `stripDowngradedToolCallText`
3. Checks normalized text against `messagingToolSentTextsNormalized` to suppress duplicates already sent via the `message` tool
4. Calls `onBlockReply` with `{text, mediaUrls, audioAsVoice, replyToId, replyToCurrent}`

**Event flow within subscribeEmbeddedPiSession**

```
text_delta

yes

text_end

tool_call

tool_result

yes

usage

compaction_start

compaction_end

message_end

Model SDK event

event.type

append to deltaBuffer

EmbeddedBlockChunker.feed

chunk ready?

emitBlockChunk → onBlockReply callback

finalizeAssistantTexts

stripBlockTags (think / final)

push to assistantTexts

add to toolMetas / toolMetaById

emitToolSummary / emitToolOutput

shouldEmitToolResult?

onToolResult callback

recordAssistantUsage (accumulate usageTotals)

compactionInFlight = true

resolveCompactionRetry → resume emit

flushBlockReplyBuffer (force-drain chunker)
```

### Reasoning Stream

When `reasoningMode === "stream"`, thinking block content is forwarded to `emitReasoningStream`[src/agents/pi-embedded-subscribe.ts543-573](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts#L543-L573) which:

- Computes a delta from the previously-sent reasoning text
- Calls `emitAgentEvent` with `stream: "thinking"` (broadcast to WebSocket clients)
- Calls the `onReasoningStream` callback

Sources: [src/agents/pi-embedded-subscribe.ts34-640](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts#L34-L640)[src/agents/pi-embedded-block-chunker.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-block-chunker.ts)

---

## Compaction on Context Overflow

When the model reports context overflow, compaction condenses the conversation history to free up context space. It can be triggered at two layers:
Trigger SiteWhenFunction CalledInside `runEmbeddedPiAgent`Overflow detected within a running attempt`compactEmbeddedPiSessionDirect`Inside `runAgentTurnWithFallback`Overflow propagates out of `runEmbeddedPiAgent``compactEmbeddedPiSession`
Both ultimately execute logic in [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/compact.ts) which:

1. Opens the session transcript with `SessionManager.open`
2. Constructs a compaction-specific system prompt and tool set
3. Runs a dedicated agent turn that summarizes the transcript into a compact form
4. Replaces the original transcript entries with the summary
5. Returns `EmbeddedPiCompactResult` with the new message count and token estimate

After compaction, the interrupted run is retried. `incrementRunCompactionCount`[src/auto-reply/reply/session-run-accounting.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/session-run-accounting.ts) updates the session store so `/status` reports the compaction count. A post-compaction workspace context snapshot (`readPostCompactionContext`) is injected as a system event for the next turn.

Detection helpers used: `isContextOverflowError`, `isLikelyContextOverflowError`, `isCompactionFailureError` from [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-helpers.ts)

Sources: [src/agents/pi-embedded-runner/compact.ts88](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/compact.ts#L88-LNaN)[src/agents/pi-embedded-runner/run.ts53-57](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts#L53-L57)[src/auto-reply/reply/agent-runner-execution.ts90-130](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-execution.ts#L90-L130)[src/auto-reply/reply/agent-runner.ts676-703](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L676-L703)

---

## Model Fallback

`runWithModelFallback`[src/agents/model-fallback.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/model-fallback.ts) attempts the configured primary model. On `FailoverError`, it tries configured fallback models in sequence.

`FailoverError` carries a `reason` field:
ReasonMeaning`"rate_limit"`Rate limited; try next profile or model`"auth"`Auth failure; try next profile`"context_overflow"`Context window exceeded`"model_not_found"`Model not in registry`"billing"`Billing issue; do not failover`"unknown"`Generic failure
When a fallback transition occurs, `runReplyAgent` records it in the session store via `fallbackNoticeSelectedModel`, `fallbackNoticeActiveModel`, `fallbackNoticeReason`, and emits a `phase: "fallback"` agent event. If verbose mode is on, a notice is prepended to the reply payloads.

When the primary model becomes available again on a subsequent turn, `fallbackCleared` is detected and a `phase: "fallback_cleared"` event is emitted.

Sources: [src/agents/model-fallback.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/model-fallback.ts)[src/agents/pi-embedded-runner/run.ts232-240](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts#L232-L240)[src/auto-reply/reply/agent-runner.ts444-674](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L444-L674)[src/auto-reply/fallback-state.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/fallback-state.ts)

---

## Typing Indicators

Typing indicators are managed by a `TypingController` passed into `runReplyAgent`. The `createTypingSignaler` factory [src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/typing-mode.ts) wraps it and controls when signals are sent based on `typingMode` config.
Signal methodWhen called`signalRunStart`After queue check passes, before model invocation`signalTextDelta(text)`During streaming, for each partial text chunk`markRunComplete`In `finally` block of `runReplyAgent``markDispatchIdle`Also in `finally` block (safety net for stuck keepalive loops)
Heartbeat turns (`isHeartbeat === true`) skip the typing indicator. The `TypingMode` values (`"off"`, `"pre-reply"`, `"streaming"`, etc.) determine which signals are suppressed.

Sources: [src/auto-reply/reply/agent-runner.ts154-159](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L154-L159)[src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/typing-mode.ts)[src/auto-reply/reply/agent-runner.ts717-727](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L717-L727)

---

## Reply Payload Assembly

After the model turn completes, `buildReplyPayloads`[src/auto-reply/reply/agent-runner-payloads.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-payloads.ts) assembles the final `ReplyPayload[]` from the collected `assistantTexts` and tool-related payloads.

Key transformations applied:
TransformationDetailSilent reply filteringPayloads whose full text is `SILENT_REPLY_TOKEN` are dropped`HEARTBEAT_OK` stripping`stripHeartbeatToken` removes the token from non-heartbeat repliesMessaging tool deduplicationTexts matching `messagingToolSentTexts` are filtered outReply-to threading`applyReplyToMode` applies `[[reply_to_current]]` or `[[reply_to:<id>]]` per channel configMedia URL attachmentTool result screenshots and images are attached to payloadsBlock-stream deduplicationChunks already sent via `blockReplyPipeline` are excluded from final delivery
`finalizeWithFollowup` then checks for queued follow-up runs and, if present, dispatches them via `createFollowupRunner`[src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/followup-runner.ts)

Sources: [src/auto-reply/reply/agent-runner-payloads.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-payloads.ts)[src/auto-reply/reply/agent-runner.ts506-534](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts#L506-L534)[src/auto-reply/reply/followup-runner.ts35-45](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/followup-runner.ts#L35-L45)

---

## Code Entity Reference

**Key functions and their file locations**

```
src/agents/

src/agents/pi-embedded-runner/

src/auto-reply/reply/

runReplyAgent (agent-runner.ts)

runAgentTurnWithFallback (agent-runner-execution.ts)

buildReplyPayloads (agent-runner-payloads.ts)

createFollowupRunner (followup-runner.ts)

createTypingSignaler (typing-mode.ts)

runEmbeddedPiAgent (run.ts)

runEmbeddedAttempt (run/attempt.ts)

compactEmbeddedPiSession (compact.ts)

subscribeEmbeddedPiSession (pi-embedded-subscribe.ts)

buildAgentSystemPrompt (system-prompt.ts)

createOpenClawCodingTools (pi-tools.ts)

runWithModelFallback (model-fallback.ts)
```

Sources: [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner.ts)[src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-execution.ts)[src/auto-reply/reply/agent-runner-payloads.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/agent-runner-payloads.ts)[src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/followup-runner.ts)[src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/typing-mode.ts)[src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts)[src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts)[src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/compact.ts)[src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.ts)[src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts)[src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts)[src/agents/model-fallback.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/model-fallback.ts)

---

# System-Prompt

# System Prompt
Relevant source files
- [docs/concepts/context.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/context.md)
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/system-prompt.md)
- [src/agents/auth-profiles/oauth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles/oauth.test.ts)
- [src/agents/auth-profiles/oauth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles/oauth.ts)
- [src/agents/auth-profiles/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles/types.ts)
- [src/agents/pi-embedded-helpers/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-helpers/types.ts)
- [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/compact.ts)
- [src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run.ts)
- [src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts)
- [src/agents/pi-embedded-runner/run/params.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/params.ts)
- [src/agents/pi-embedded-runner/run/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/types.ts)
- [src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/system-prompt.ts)
- [src/agents/pi-embedded-runner/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/types.ts)
- [src/agents/pi-embedded-subscribe.handlers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.handlers.ts)
- [src/agents/pi-embedded-subscribe.types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-subscribe.types.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts)

This page documents how the agent system prompt is assembled: which function builds it, what sections it contains, how prompt mode controls section inclusion, and what workspace files are injected as context. For the broader agent execution pipeline that invokes the prompt builder, see page [3.1](https://github.com/openclaw/openclaw/blob/8090cb4c/3.1) For tool availability (which affects the Tooling section), see page [3.4](https://github.com/openclaw/openclaw/blob/8090cb4c/3.4)

---

## Overview

Every agent run receives a fully assembled system prompt built by `buildAgentSystemPrompt` in [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts) The prompt is **OpenClaw-owned** — it does not rely on any default system prompt from the underlying `pi-coding-agent` SDK. After construction, it is injected into the agent session by overriding the SDK's prompt slot via `applySystemPromptOverrideToSession`.

The prompt is rebuilt fresh on each run, with runtime values (active tools, sandbox state, session key, channel capabilities, etc.) resolved at call time.

**Call chain from run to prompt injection:**

```
returns string

returns string

returns closure

runEmbeddedPiAgent
(run.ts)

runEmbeddedAttempt
(run/attempt.ts)

buildEmbeddedSystemPrompt
(pi-embedded-runner/system-prompt.ts)

buildAgentSystemPrompt
(system-prompt.ts)

createSystemPromptOverride
(pi-embedded-runner/system-prompt.ts)

applySystemPromptOverrideToSession
(pi-embedded-runner/system-prompt.ts)

session.agent.setSystemPrompt(prompt)
```

Sources: [src/agents/pi-embedded-runner/run/attempt.ts651-680](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L651-L680)[src/agents/pi-embedded-runner/system-prompt.ts11-106](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/system-prompt.ts#L11-L106)[src/agents/system-prompt.ts189-236](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L189-L236)

---

## Prompt Modes

The `PromptMode` type controls which sections are emitted. It is determined per-session by `resolvePromptModeForSession`, which returns `"minimal"` for any session key recognized as a subagent session (checked via `isSubagentSessionKey`), and `"full"` otherwise. Cron sessions are also given `"minimal"` mode in the compaction path.

```
export type PromptMode = "full" | "minimal" | "none";
```
Section`full``minimal``none`Identity line✓✓✓ (only this)Tooling✓✓✗Tool Call Style✓✓✗Safety✓✓✗OpenClaw CLI Quick Reference✓✓✗Skills✓ (if `skillsPrompt`)✓ (if `skillsPrompt`)✗Memory Recall✓ (if memory tools)✗✗OpenClaw Self-Update✓ (if `gateway` tool)✗✗Model Aliases✓ (if aliases)✗✗Workspace✓✓✗Documentation✓ (if `docsPath`)✗✗Sandbox✓ (if enabled)✓ (if enabled)✗Authorized Senders✓ (if `ownerNumbers`)✗✗Current Date & Time✓ (if `userTimezone`)✓ (if `userTimezone`)✗Workspace Files (injected)✓✓✗Reply Tags✓✗✗Messaging✓✗✗Voice (TTS)✓ (if `ttsHint`)✗✗Subagent/Group Chat Context✓ (if `extraSystemPrompt`)✓ as "Subagent Context"✗Reactions✓ (if `reactionGuidance`)✓ (if `reactionGuidance`)✗Reasoning Format✓ (if `reasoningTagHint`)✓ (if `reasoningTagHint`)✗Project Context (context files)✓ (if `contextFiles`)✓ (if `contextFiles`)✗Silent Replies✓✗✗Heartbeats✓✗✗Runtime✓✓✗
When `promptMode === "none"`, `buildAgentSystemPrompt` returns the single string `"You are a personal assistant running inside OpenClaw."` immediately, with no other sections.

Skills are included in `"minimal"` mode whenever `skillsPrompt` is non-empty. This is intentional: isolated cron sessions use `"minimal"` but still need skill routing.

Sources: [src/agents/system-prompt.ts17](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L17-L17)[src/agents/system-prompt.ts413-416](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L413-L416)[src/agents/system-prompt.ts376](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L376-L376)[src/agents/pi-embedded-runner/run/attempt.ts347-352](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L347-L352)

---

## Section Builder Map

Each section in the prompt is either built by a dedicated helper function or assembled inline in `buildAgentSystemPrompt`.

**Prompt section construction — function to output mapping:**

```
Inline in buildAgentSystemPrompt

Section helpers

buildAgentSystemPrompt
(system-prompt.ts)

buildSkillsSection

buildMemorySection

buildUserIdentitySection / buildOwnerIdentityLine

buildTimeSection

buildReplyTagsSection

buildMessagingSection

buildVoiceSection

buildDocsSection

buildRuntimeLine

Tooling section

Safety section

OpenClaw CLI Quick Reference

Workspace section

Sandbox section

Silent Replies

Heartbeats

Project Context (contextFiles)

Reasoning Format

Reactions
```

Sources: [src/agents/system-prompt.ts20-187](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L20-L187)[src/agents/system-prompt.ts390-665](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L390-L665)

---

## Section Details

### Identity Line

The prompt always opens with:

```
You are a personal assistant running inside OpenClaw.

```

### Tooling

The `## Tooling` section lists every tool the agent can call, filtered to those in `toolNames` and ordered by `toolOrder`. Each tool gets a one-line description from the `coreToolSummaries` map, or from the `toolSummaries` override map passed in. Tool names are printed in the casing supplied by the caller (case-sensitive; deduped by lowercase).

The `buildEmbeddedSystemPrompt` wrapper passes tool names and summaries derived from the live `AgentTool[]` array via `buildToolSummaryMap`.

A fixed note after the list states that `TOOLS.md` does not control tool availability — it is user guidance only.

Sources: [src/agents/system-prompt.ts237-335](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L237-L335)[src/agents/pi-embedded-runner/system-prompt.ts76-77](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/system-prompt.ts#L76-L77)

### Safety

The `## Safety` section is hardcoded and always present in non-`none` modes. It contains three lines:

1. No independent goals (no self-preservation, resource acquisition, power-seeking).
2. Prioritize safety and human oversight over task completion.
3. No manipulation, no copying itself, no modifying system prompts or tool policies without explicit request.

These are advisory guardrails, not enforcement mechanisms.

Sources: [src/agents/system-prompt.ts390-396](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L390-L396)

### Skills

The `## Skills (mandatory)` section is built by `buildSkillsSection`. It instructs the model to scan an injected `<available_skills>` XML block and use `read` to load the matching `SKILL.md` before responding. The section is omitted entirely when `skillsPrompt` is empty or absent.

The `skillsPrompt` string (the XML block) is resolved before the call to `buildAgentSystemPrompt` by `resolveSkillsPromptForRun` from the skills subsystem.

Sources: [src/agents/system-prompt.ts20-35](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L20-L35)[src/agents/pi-embedded-runner/run/attempt.ts470-475](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L470-L475)

### Memory Recall

Built by `buildMemorySection`. Included in `full` mode when either `memory_search` or `memory_get` is present in the available tool set. Instructs the model to search `MEMORY.md` and `memory/*.md` before answering questions about prior work, decisions, or preferences.

The `memoryCitationsMode` parameter controls whether a citations line is appended (`"off"` suppresses it).

Sources: [src/agents/system-prompt.ts37-63](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L37-L63)

### Workspace

The `## Workspace` section states the effective working directory. When sandbox is enabled, the section shows the **container** path for exec commands and the **host** path for file tool operations. The `workspaceGuidance` string adapts the wording accordingly.

The `displayWorkspaceDir` resolves to `sandboxInfo.containerWorkspaceDir` when sandbox is active, otherwise the agent's `workspaceDir`.

Sources: [src/agents/system-prompt.ts377-389](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L377-L389)[src/agents/system-prompt.ts502-506](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L502-L506)

### Authorized Senders

Built by `buildUserIdentitySection` using `buildOwnerIdentityLine`. Owner identifiers can be displayed as-is (`ownerDisplay: "raw"`) or hashed (`ownerDisplay: "hash"`).

When hashing:

- Without `ownerDisplaySecret`: plain SHA-256, first 12 hex chars.
- With `ownerDisplaySecret`: HMAC-SHA-256 keyed by the secret, first 12 hex chars.

This prevents raw phone numbers from appearing in prompt logs while keeping the section stable for cache purposes.

Sources: [src/agents/system-prompt.ts65-94](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L65-L94)

### Current Date & Time

Built by `buildTimeSection`. Included when `userTimezone` is configured. Contains only the **timezone string**, not the current clock time, to keep the system prompt stable for provider-side prompt caching. Agents needing the current time are directed to call `session_status`.

Sources: [src/agents/system-prompt.ts96-101](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L96-L101)[src/agents/system-prompt.ts499-501](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L499-L501)

### Sandbox

Included when `sandboxInfo.enabled` is true. Informs the model it is operating in a Docker-based sandbox, lists the container workspace path, host mount source, browser availability, and whether elevated exec is available. Constructed inline in `buildAgentSystemPrompt`.

Sources: [src/agents/system-prompt.ts508-552](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L508-L552)

### Reply Tags

Built by `buildReplyTagsSection`. Documents the `[[reply_to_current]]` and `[[reply_to:<id>]]` tag syntax for native quote-replies on supported channels. Tags must appear as the first token in the reply. Stripped before delivery.

Sources: [src/agents/system-prompt.ts103-117](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L103-L117)

### Messaging

Built by `buildMessagingSection`. Covers:

- Session reply routing
- Cross-session messaging via `sessions_send`
- Sub-agent orchestration via `subagents`
- System Message block handling
- `message` tool usage (if `message` is in available tools), including channel parameter options, inline buttons support, and `SILENT_REPLY_TOKEN` use.

The `runtimeCapabilities` set (derived from channel config) controls whether inline buttons guidance is emitted.

Sources: [src/agents/system-prompt.ts119-158](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L119-L158)

### Voice (TTS)

Built by `buildVoiceSection`. Included only when a `ttsHint` string is provided (resolved from `buildTtsSystemPromptHint`). Contains TTS-specific formatting guidance for the active voice configuration.

Sources: [src/agents/system-prompt.ts160-169](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L160-L169)

### Subagent / Group Chat Context

When `extraSystemPrompt` is provided, it is appended under a context header. In `full` mode the header is `## Group Chat Context`; in `minimal` mode it is `## Subagent Context`.

Sources: [src/agents/system-prompt.ts572-577](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L572-L577)

### Reactions

When `reactionGuidance` is provided (resolved from `resolveTelegramReactionLevel` or `resolveSignalReactionLevel`), a `## Reactions` section is appended with guidance for `"minimal"` or `"extensive"` reaction frequency.

Sources: [src/agents/system-prompt.ts578-600](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L578-L600)

### Silent Replies

Full mode only. Instructs the model to respond with only the `SILENT_REPLY_TOKEN` constant (imported from `src/auto-reply/tokens.ts`) when it has nothing to say. Provides explicit formatting rules and wrong/right examples.

Sources: [src/agents/system-prompt.ts628-643](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L628-L643)

### Heartbeats

Full mode only. States the heartbeat prompt string (from `resolveHeartbeatPrompt`) and instructs the model to respond with `HEARTBEAT_OK` when there is nothing requiring attention, or with an alert message otherwise.

Sources: [src/agents/system-prompt.ts645-656](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L645-L656)

### Runtime

Always the final section. Assembled by `buildRuntimeLine`. A single line reporting:

```
Runtime: agent=<id> | host=<host> | os=<os> | node=<version> | model=<provider/model> | default_model=<...> | shell=<shell> | channel=<channel> | capabilities=<caps> | thinking=<level>

```

Followed by a reasoning level line.

Sources: [src/agents/system-prompt.ts658-663](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L658-L663)[src/agents/system-prompt.ts667-704](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L667-L704)

---

## Project Context (Workspace File Injection)

When `contextFiles` is non-empty, a `# Project Context` section is appended before Silent Replies. Each `EmbeddedContextFile` (`{ path: string; content: string }`) is rendered as:

```
## <path>

<content>

```

If any file's path basename is `soul.md` (case-insensitive, with path normalization), a line is prepended instructing the model to embody the SOUL.md persona.

**Which files are injected:**

The `contextFiles` array is populated by `resolveBootstrapContextForRun` before the prompt is built. For full sessions:
FileCondition`AGENTS.md`Always (if present)`SOUL.md`Always (if present)`TOOLS.md`Always (if present)`IDENTITY.md`Always (if present)`USER.md`Always (if present)`HEARTBEAT.md`Always (if present)`MEMORY.md` / `memory.md`Always (if present)`BOOTSTRAP.md`First-run workspaces only
For subagent sessions, only `AGENTS.md` and `TOOLS.md` are injected to keep context small.

Per-file character limit: `agents.defaults.bootstrapMaxChars` (default 20,000). Total cap: `agents.defaults.bootstrapTotalMaxChars` (default 150,000).

Sources: [src/agents/system-prompt.ts605-625](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L605-L625)[docs/concepts/system-prompt.md53-82](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/system-prompt.md#L53-L82)

---

## Parameter Reference for `buildAgentSystemPrompt`

The full signature is defined at [src/agents/system-prompt.ts189-235](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L189-L235) Key parameters:
ParameterTypePurpose`workspaceDir``string`Agent working directory`promptMode``PromptMode`Section inclusion mode (`"full"` / `"minimal"` / `"none"`)`toolNames``string[]`Available tool names (case-preserved)`toolSummaries``Record<string, string>`Tool description overrides`contextFiles``EmbeddedContextFile[]`Workspace files to inject as Project Context`skillsPrompt``string`Pre-formatted `<available_skills>` XML block`heartbeatPrompt``string`Heartbeat trigger phrase`ownerNumbers``string[]`Sender IDs for Authorized Senders section`ownerDisplay``"raw" | "hash"`How owner IDs are rendered`ownerDisplaySecret``string`HMAC key for hashed owner IDs`userTimezone``string`IANA timezone string`extraSystemPrompt``string`Extra context appended under Group Chat/Subagent Context`sandboxInfo``EmbeddedSandboxInfo`Sandbox state and paths`runtimeInfo`objectHost, OS, model, channel, capabilities`reactionGuidance`objectReaction level and channel for Reactions section`reasoningTagHint``boolean`Whether to include `<think>/<final>` format section`acpEnabled``boolean`Whether to include ACP harness guidance`memoryCitationsMode``MemoryCitationsMode`Citation display preference in Memory section`modelAliasLines``string[]`Model alias list for Model Aliases section`docsPath``string`Local docs directory path`ttsHint``string`TTS guidance string for Voice section`messageToolHints``string[]`Channel-specific hints for message tool section
Sources: [src/agents/system-prompt.ts189-235](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.ts#L189-L235)

---

## Integration with the Run Pipeline

The `buildEmbeddedSystemPrompt` function in [src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/system-prompt.ts) is the adapter between the embedded run infrastructure and `buildAgentSystemPrompt`. It accepts `AgentTool[]` objects directly (rather than `string[]` + `Record<string, string>`) and calls `buildToolSummaryMap` to derive the summary map.

**Prompt construction and application in `runEmbeddedAttempt`:**

```
prompt string

prompt string

session

closure

resolveBootstrapContextForRun
→ contextFiles[]

resolveSkillsPromptForRun
→ skillsPrompt string

buildSystemPromptParams
→ runtimeInfo, userTimezone

buildModelAliasLines
→ modelAliasLines[]

buildEmbeddedSystemPrompt
(pi-embedded-runner/system-prompt.ts)

buildAgentSystemPrompt
(system-prompt.ts)

createSystemPromptOverride
→ closure

createAgentSession
(pi-coding-agent SDK)

applySystemPromptOverrideToSession
→ session.agent.setSystemPrompt()
```

Sources: [src/agents/pi-embedded-runner/run/attempt.ts476-705](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.ts#L476-L705)[src/agents/pi-embedded-runner/system-prompt.ts11-106](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/system-prompt.ts#L11-L106)

---

## Prompt Caching Considerations

The system prompt is intentionally kept stable across turns to maximize provider-side prompt cache hits (particularly for Anthropic). Key design decisions that follow from this:

- The **current time is not embedded** in the system prompt, only the timezone. Agents use `session_status` for the current timestamp.
- Owner IDs can be hashed (via `ownerDisplay: "hash"`) to avoid sensitive data in prompt logs while keeping cache stability.
- Runtime metadata (host, OS, model) changes only when the agent starts or the model changes — not per-message.

Sources: [docs/concepts/system-prompt.md87-94](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/system-prompt.md#L87-L94)[src/agents/system-prompt.test.ts382-399](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/system-prompt.test.ts#L382-L399)

---

# Model-Configuration-&-Authentication

# Model Configuration & Authentication
Relevant source files
- [docs/channels/googlechat.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/googlechat.md)
- [docs/cli/onboard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/onboard.md)
- [docs/concepts/models.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/models.md)
- [docs/gateway/authentication.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/authentication.md)
- [docs/help/environment.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/environment.md)
- [docs/help/faq.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/help/faq.md)
- [docs/providers/ollama.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/providers/ollama.md)
- [docs/reference/wizard.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/wizard.md)
- [docs/start/setup.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/setup.md)
- [docs/start/wizard-cli-automation.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard-cli-automation.md)
- [docs/start/wizard-cli-reference.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/start/wizard-cli-reference.md)
- [docs/tools/skills-config.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/skills-config.md)
- [docs/tools/skills.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/skills.md)
- [src/agents/model-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/model-auth.ts)
- [src/agents/models-config.fills-missing-provider-apikey-from-env-var.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.fills-missing-provider-apikey-from-env-var.test.ts)
- [src/agents/models-config.providers.ollama.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.providers.ollama.test.ts)
- [src/agents/models-config.providers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.providers.ts)
- [src/agents/models-config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.ts)
- [src/agents/pi-embedded-runner/model.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/model.test.ts)
- [src/agents/pi-embedded-runner/model.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/model.ts)
- [src/agents/pi-embedded-runner/run/attempt.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/run/attempt.test.ts)
- [src/cli/program/register.onboard.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/program/register.onboard.ts)
- [src/commands/auth-choice-options.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-choice-options.test.ts)
- [src/commands/auth-choice-options.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-choice-options.ts)
- [src/commands/auth-choice.apply.api-providers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-choice.apply.api-providers.ts)
- [src/commands/auth-choice.preferred-provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-choice.preferred-provider.ts)
- [src/commands/auth-choice.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-choice.test.ts)
- [src/commands/auth-choice.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-choice.ts)
- [src/commands/onboard-auth.config-core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-auth.config-core.ts)
- [src/commands/onboard-auth.credentials.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-auth.credentials.ts)
- [src/commands/onboard-auth.models.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-auth.models.ts)
- [src/commands/onboard-auth.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-auth.test.ts)
- [src/commands/onboard-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-auth.ts)
- [src/commands/onboard-non-interactive.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-non-interactive.ts)
- [src/commands/onboard-non-interactive/local/auth-choice.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-non-interactive/local/auth-choice.ts)
- [src/commands/onboard-types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-types.ts)

This page covers how OpenClaw configures AI model providers, stores and resolves credentials, selects primary and fallback models, and exposes the `openclaw models` CLI commands. It applies to the agent-side model API (Anthropic, OpenAI, Ollama, etc.).

For **Gateway authentication** (WebSocket token, password, Tailscale), see page [2.2](/openclaw/openclaw/2.2-authentication-and-device-pairing). For the full `openclaw.json` configuration reference, see page [2.3.1](/openclaw/openclaw/2.3.1-configuration-reference).

---

## Auth Profiles

Credentials for model providers are stored in `auth-profiles.json`, located in the agent directory (`~/.openclaw/agents/<agentId>/agent/auth-profiles.json`). The file is managed by `upsertAuthProfile` and read by `ensureAuthProfileStore`, both in [src/agents/auth-profiles.js](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/auth-profiles.js)

### Profile ID Format

Profile IDs follow the pattern `<provider>:<name>`, e.g.:
Profile IDMeaning`anthropic:default`Default Anthropic credentials`openai-codex:user@example.com`Codex OAuth keyed by email`google:default`Default Google Gemini credentials`minimax:default`Default MiniMax credentials
The name segment is typically `default` for API keys or the account email for OAuth profiles.

### Credential Types

The `profiles` map in `auth-profiles.json` contains entries of three types:
`type`FieldsUsed for`api_key``key` (string) or `keyRef` (SecretRef)API keys for most providers`oauth``access`, `refresh`, `expires`, `email`OAuth flows (OpenAI Codex, GitHub Copilot, Chutes, etc.)`token``token`, optional `expires`Anthropic setup-token
`SecretRef` objects (type `keyRef`) allow storing a reference to an environment variable instead of the raw key value:

```
{
  "source": "env",
  "provider": "env",
  "id": "ANTHROPIC_API_KEY"
}
```

This is activated by the `--secret-input-mode ref` flag in `openclaw onboard` / `openclaw configure`, which calls `resolveApiKeySecretInput` in [src/commands/onboard-auth.credentials.ts52-70](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-auth.credentials.ts#L52-L70)

Sources: [src/agents/model-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/model-auth.ts)[src/commands/onboard-auth.credentials.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-auth.credentials.ts)

---

## Auth Modes by Provider

The `AuthChoice` union type in [src/commands/onboard-types.ts5-53](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-types.ts#L5-L53) enumerates every supported auth flow. The onboarding wizard (`openclaw onboard`) and the `openclaw configure` command both resolve these choices via `applyAuthChoice` in [src/commands/auth-choice.apply.js](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-choice.apply.js)

### Common Provider Auth Flows
Auth ChoiceProfile TypeProfile IDMechanism`apiKey``api_key``anthropic:default`Anthropic API key`token``token``anthropic:<name>`Anthropic setup-token (from `claude setup-token`)`openai-api-key``api_key``openai:default`OpenAI API key`openai-codex``oauth``openai-codex:<email>`OpenAI Codex OAuth (ChatGPT subscription)`gemini-api-key``api_key``google:default`Google Gemini API key`google-gemini-cli``oauth``google:<email>`Gemini CLI OAuth (unofficial)`github-copilot``oauth``github-copilot:*`GitHub device-flow OAuth`openrouter-api-key``api_key``openrouter:default`OpenRouter API key`minimax-api``api_key``minimax:default`MiniMax API key`minimax-portal``oauth``minimax-portal:*`MiniMax OAuth`moonshot-api-key``api_key``moonshot:default`Moonshot (Kimi) API key`vllm``api_key``vllm:default`vLLM (any value)
For OAuth providers, `writeOAuthCredentials` in [src/commands/onboard-auth.credentials.ts153-199](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-auth.credentials.ts#L153-L199) handles persisting the credentials and broadcasting to sibling agent directories when `syncSiblingAgents` is set.

### Anthropic Setup-Token Flow

The setup-token is a long-lived credential generated by the Claude Code CLI (`claude setup-token`). It is stored as a `token`-type profile rather than `api_key`. The flow:

1. Run `claude setup-token` on any machine.
2. Copy the token string.
3. In the wizard, select "Anthropic token (paste setup-token)" or run:

```
openclaw models auth paste-token --provider anthropic

```
4. `validateAnthropicSetupToken` in [src/commands/auth-token.js](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-token.js) validates the format before it is stored via `upsertAuthProfile`.

Sources: [src/commands/onboard-types.ts5-53](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-types.ts#L5-L53)[src/commands/auth-choice-options.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-choice-options.ts)[src/commands/onboard-auth.credentials.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-auth.credentials.ts)

---

## Auth Resolution at Runtime

When the agent attempts a model call, `resolveApiKeyForProvider` in [src/agents/model-auth.ts135-233](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/model-auth.ts#L135-L233) resolves credentials by checking sources in priority order.

**Title: Auth Resolution Chain in `resolveApiKeyForProvider`**

```
yes

no

yes

no

yes

no

yes

no

yes

no

yes

no

resolveApiKeyForProvider(provider, cfg, profileId?, preferredProfile?)

explicit
profileId?

resolveApiKeyForProfile(store, profileId)

resolveProviderAuthOverride(cfg, provider)
= aws-sdk?

resolveAwsSdkAuthInfo()
AWS_BEARER_TOKEN_BEDROCK
AWS_ACCESS_KEY_ID+SECRET
AWS_PROFILE

resolveAuthProfileOrder(cfg, store, provider)
profiles in openclaw.json auth.profiles + auth-profiles.json

profile
with key
found?

return apiKey + profileId + source

resolveEnvApiKey(provider)
check ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.

env var
found?

return apiKey, source = 'env: VAR_NAME'

getCustomProviderApiKey(cfg, provider)
models.providers[provider].apiKey in openclaw.json

inline key
found?

return apiKey, source = 'models.json'

provider ==
amazon-bedrock?

throw Error: No API key found for provider
```

Sources: [src/agents/model-auth.ts135-233](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/model-auth.ts#L135-L233)

---

## Provider Configuration

### `models.providers` in `openclaw.json`

Explicit provider entries live under `models.providers` in `openclaw.json`. Each entry specifies the API surface, base URL, auth mode, and model catalog:

```
{
  models: {
    providers: {
      "openrouter": {
        baseUrl: "https://openrouter.ai/api/v1",
        api: "openai-completions",        // or "anthropic-messages", "ollama"
        apiKey: "OPENROUTER_API_KEY",     // env var name or literal value
        models: [
          {
            id: "auto",
            name: "OpenRouter Auto",
            reasoning: false,
            input: ["text", "image"],
            contextWindow: 200000,
            maxTokens: 8192,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
          }
        ]
      }
    }
  }
}
```

The `api` field selects the wire protocol:
ValueWire Protocol`anthropic-messages`Anthropic Messages API`openai-completions`OpenAI chat completions`openai-responses`OpenAI responses API`ollama`Ollama native API (`/api/chat`)
A common misconfiguration is setting `apiKey: "${ENV_VAR}"` instead of `apiKey: "ENV_VAR"`. The `normalizeApiKeyConfig` function in [src/agents/models-config.providers.ts387-391](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.providers.ts#L387-L391) automatically strips the `${}` wrapper.

### `models.json` and the Merge Pipeline

`ensureOpenClawModelsJson` in [src/agents/models-config.ts113-199](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.ts#L113-L199) is the central routine that generates `models.json` in the agent directory. It runs on gateway startup and on config reload.

**Title: models.json Generation Pipeline (`ensureOpenClawModelsJson`)**

```
openclaw.json
models.providers (explicit)

mergeProviders(implicit, explicit)

resolveImplicitProviders(agentDir, explicitProviders)
auto-registers providers with credentials

resolveImplicitBedrockProvider(agentDir, cfg)
checks AWS env vars / SDK

resolveImplicitCopilotProvider(agentDir)
checks github-copilot token

normalizeProviders(providers, agentDir)
- fills missing apiKey from env/profiles
- normalizes model IDs (google, antigravity)

agentDir/models.json
{ providers: { ... } }

discoverModels(authStorage, agentDir)
→ ModelRegistry

resolveModel(provider, modelId, agentDir, cfg)
```

Sources: [src/agents/models-config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.ts)[src/agents/models-config.providers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.providers.ts)

### Implicit Provider Registration

`resolveImplicitProviders` in [src/agents/models-config.providers.ts904-1060](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.providers.ts#L904-L1060) auto-registers providers when credentials exist (env var or auth profile) **without** requiring explicit `models.providers` config. For example, if `MINIMAX_API_KEY` is set or a `minimax:default` profile exists in `auth-profiles.json`, the `minimax` provider is automatically registered with its built-in model catalog.

Providers registered implicitly include: `minimax`, `minimax-portal`, `moonshot`, `kimi-coding`, `synthetic`, `venice`, `qwen-portal`, `volcengine`, `byteplus`, `xiaomi`, `cloudflare-ai-gateway`, and others.

### Auto-Discovered Providers (Ollama and vLLM)

**Ollama**: `discoverOllamaModels` in [src/agents/models-config.providers.ts273-332](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.providers.ts#L273-L332) calls `/api/tags` to list locally running models, then calls `/api/show` on each to query actual context window sizes. It skips discovery in test environments.

**vLLM**: `discoverVllmModels` in [src/agents/models-config.providers.ts334-385](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.providers.ts#L334-L385) calls `/models` on the configured base URL (default `http://127.0.0.1:8000/v1`).

Both providers require at least a placeholder API key value (any non-empty string) in `auth-profiles.json` or environment variables to trigger registration.

Sources: [src/agents/models-config.providers.ts273-385](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.providers.ts#L273-L385)[src/agents/models-config.ts113-199](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.ts#L113-L199)

---

## Model Selection

### Model Reference Format

Models are referenced as `<provider>/<model-id>`, e.g.:

- `anthropic/claude-sonnet-4-5`
- `openai-codex/gpt-5.3-codex`
- `openrouter/moonshotai/kimi-k2` (double slash for pass-through providers)
- `ollama/llama3.2`

The `resolveModel` function in [src/agents/pi-embedded-runner/model.ts42-127](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/model.ts#L42-L127) splits on the first `/` to get provider and model ID.

### Primary and Fallback Models

Model selection is configured in `agents.defaults.model` (or per-agent `agents.list[].model`):

```
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-5",
        fallbacks: [
          "openai-codex/gpt-5.3-codex",
          "openrouter/auto"
        ]
      }
    }
  }
}
```

The agent pipeline in [3.1](/openclaw/openclaw/3.1-agent-execution-pipeline) tries the primary model first, then falls through the fallbacks list in order. Provider-level auth failover (rotating across multiple credentials for one provider) happens inside a provider before moving to the next fallback entry.

### Model Aliases

Aliases map short names to full model references. They are configured in `agents.defaults.models`:

```
{
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-6": { alias: "opus" },
        "anthropic/claude-sonnet-4-5": { alias: "sonnet" },
        "openrouter/auto": { alias: "router" }
      }
    }
  }
}
```

This map also acts as an **allowlist**: when `agents.defaults.models` is non-empty, only models listed there can be selected with `/model` in chat. Models not in the allowlist return an error before generating a reply. The built-in alias line builder (`buildModelAliasLines` in [src/agents/pi-embedded-runner/model.ts23](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/model.ts#L23-L23)) injects alias metadata into the system prompt.

**Title: Model Reference Lifecycle**

```
allowed

not in allowlist

found

not found

found

not found

not found

yes

no

User input:
'/model opus'
or config primary

Alias resolution
agents.defaults.models[ref].alias

Allowlist check
agents.defaults.models (non-empty = allowlist)

resolveModel(provider, modelId)
[pi-embedded-runner/model.ts]

'Model not allowed' reply
(no agent run)

modelRegistry.find(provider, modelId)
from models.json

Model object
(api, baseUrl, contextWindow, ...)

buildInlineProviderModels(providers)
from openclaw.json models.providers

resolveForwardCompatModel()
per-provider fallback logic

provider ==
openrouter?

synthetic fallback Model
OpenRouter pass-through

error: Unknown model: provider/id
```

Sources: [src/agents/pi-embedded-runner/model.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-embedded-runner/model.ts)[docs/concepts/models.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/models.md)

---

## The `openclaw models` CLI

The `openclaw models` command group manages model and auth configuration without editing `openclaw.json` directly. Subcommands from [docs/concepts/models.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/models.md):
CommandEffect`openclaw models status`Shows configured providers, auth candidates, model availability`openclaw models list`Lists models from the configured catalog`openclaw models list --all`Full catalog including auto-discovered providers`openclaw models set <provider/model>`Sets `agents.defaults.model.primary``openclaw models set-image <provider/model>`Sets `agents.defaults.imageModel.primary``openclaw models aliases list`Lists all aliases from `agents.defaults.models``openclaw models aliases add <alias> <ref>`Adds an alias entry`openclaw models aliases remove <alias>`Removes an alias entry`openclaw models fallbacks list`Shows `agents.defaults.model.fallbacks``openclaw models fallbacks add <ref>`Appends to fallbacks list`openclaw models fallbacks remove <ref>`Removes from fallbacks list`openclaw models fallbacks clear`Clears all fallbacks`openclaw models scan`Probes configured models for tool and image support
`openclaw models status` calls `openclaw status --deep` internally for provider probe details.

---

## Environment Variables

`resolveEnvApiKey` in [src/agents/model-auth.ts238](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/model-auth.ts#L238-LNaN) maps provider names to known environment variables. Standard env vars:
ProviderEnvironment Variable(s)`anthropic``ANTHROPIC_API_KEY``openai``OPENAI_API_KEY``google``GEMINI_API_KEY`, `GOOGLE_API_KEY``openrouter``OPENROUTER_API_KEY``ollama``OLLAMA_API_KEY` (any value enables Ollama)`vllm``VLLM_API_KEY``amazon-bedrock``AWS_BEARER_TOKEN_BEDROCK`, `AWS_ACCESS_KEY_ID`+`AWS_SECRET_ACCESS_KEY`, or `AWS_PROFILE``minimax``MINIMAX_API_KEY``moonshot``MOONSHOT_API_KEY``huggingface``HF_TOKEN`, `HUGGINGFACE_HUB_TOKEN``mistral``MISTRAL_API_KEY``xai``XAI_API_KEY`
The label in `openclaw models status` distinguishes "shell env" (loaded from `~/.openclaw/.env` via the daemon env loader) from "env" (already in the process environment).

For the Gateway daemon (`launchd`/`systemd`), env vars not set in the system environment must be placed in `~/.openclaw/.env`. See page [2.3](/openclaw/openclaw/2.3-configuration) for env var loading details.

Sources: [src/agents/model-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/model-auth.ts)[docs/gateway/authentication.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/authentication.md)

---

## Custom and Third-Party Providers

Any OpenAI-compatible or Anthropic-compatible HTTP endpoint can be registered as a custom provider in `models.providers`:

```
{
  models: {
    providers: {
      "my-proxy": {
        baseUrl: "https://my-llm-proxy.example.com/v1",
        api: "openai-completions",
        apiKey: "MY_PROXY_KEY",   // env var name
        models: [
          {
            id: "my-model-id",
            name: "My Model",
            reasoning: false,
            input: ["text"],
            contextWindow: 128000,
            maxTokens: 8192,
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }
          }
        ]
      }
    }
  }
}
```

The onboarding wizard exposes this as `--auth-choice custom-api-key` via `applyCustomApiConfig` in [src/commands/onboard-custom.js](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/onboard-custom.js) which accepts `--custom-base-url`, `--custom-api-key`, `--custom-model-id`, and `--custom-compatibility openai|anthropic`.

Sources: [src/agents/models-config.providers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/models-config.providers.ts)[src/commands/auth-choice-options.ts184-188](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/auth-choice-options.ts#L184-L188)

---

# Tools

# Tools
Relevant source files
- [docs/concepts/session-tool.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/session-tool.md)
- [docs/tools/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/index.md)
- [docs/tools/subagents.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/subagents.md)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts)
- [src/agents/subagent-announce-dispatch.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce-dispatch.test.ts)
- [src/agents/subagent-announce-dispatch.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce-dispatch.ts)
- [src/agents/subagent-announce.format.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.format.test.ts)
- [src/agents/subagent-announce.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts)
- [src/agents/subagent-registry.announce-loop-guard.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.announce-loop-guard.test.ts)
- [src/agents/subagent-registry.persistence.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.persistence.test.ts)
- [src/agents/subagent-registry.store.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.store.ts)
- [src/agents/subagent-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts)
- [src/agents/tool-display.json](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-display.json)
- [src/agents/tools/sessions-spawn-tool.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/sessions-spawn-tool.ts)
- [src/commands/agent.delivery.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent.delivery.test.ts)
- [src/commands/agent.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent.test.ts)
- [src/commands/agent.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent.ts)
- [src/commands/agent/delivery.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent/delivery.ts)
- [src/config/sessions.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions.test.ts)
- [src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions.ts)
- [src/config/sessions/store.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/store.ts)
- [src/cron/isolated-agent.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.ts)
- [src/infra/outbound/agent-delivery.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/agent-delivery.test.ts)
- [src/infra/outbound/agent-delivery.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/agent-delivery.ts)
- [src/infra/outbound/channel-resolution.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/channel-resolution.ts)
- [src/infra/outbound/targets.channel-resolution.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/targets.channel-resolution.test.ts)
- [src/utils/delivery-context.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/utils/delivery-context.test.ts)
- [src/utils/delivery-context.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/utils/delivery-context.ts)

This page covers the agent tool system: how tools are assembled for each agent turn, the policy enforcement pipeline that filters and guards them, workspace root protection, schema normalization, and the full inventory of available tools.

For details on specific tool subsystems, see:

- Exec tool, exec approvals, and PTY support: [3.4.1](/openclaw/openclaw/3.4.1-exec-tool-and-exec-approvals)
- Memory tools (`memory_search`, `memory_get`): [3.4.2](/openclaw/openclaw/3.4.2-memory-tools)
- Subagent spawning via `sessions_spawn`: [3.4.3](/openclaw/openclaw/3.4.3-subagents)
- How tools are injected into the system prompt: [3.2](/openclaw/openclaw/3.2-system-prompt)
- Sandbox interaction with tools: [7.2](/openclaw/openclaw/7.2-sandboxing)

---

## Tool Assembly Entry Point

Every agent turn begins by calling `createOpenClawCodingTools` in [src/agents/pi-tools.ts182-544](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L182-L544) This function constructs and returns the complete `AnyAgentTool[]` list that is passed to the model API. It accepts a rich `options` object covering agent identity, model provider, sandbox context, filesystem policy, message routing, and policy overrides.

The assembled list is the result of several sequential operations:

**Tool assembly diagram**

```
Tool Sources

Post-processing (per tool)

normalizeToolParameters
(pi-tools.schema.ts)

wrapToolWithBeforeToolCallHook
(pi-tools.before-tool-call.ts)

wrapToolWithAbortSignal
(pi-tools.abort.ts)

Policy Filters (in order)

applyMessageProviderToolPolicy

applyOwnerOnlyToolPolicy

applyToolPolicyPipeline
(profile, provider, global, agent, group,
sandbox, subagent policies)

Base Tool Mutations

createOpenClawReadTool /
createS andboxedReadTool

createHostWorkspaceWriteTool /
createSandboxedWriteTool

createHostWorkspaceEditTool /
createSandboxedEditTool

bash tool: removed

createOpenClawCodingTools
(pi-tools.ts)

codingTools
(@mariozechner/pi-coding-agent)

createExecTool
(bash-tools.ts)

createProcessTool
(bash-tools.ts)

createApplyPatchTool
(apply-patch.ts)

listChannelAgentTools
(channel-tools.ts)

createOpenClawTools
(openclaw-tools.ts)

concat all tools

AnyAgentTool[]
```

Sources: [src/agents/pi-tools.ts331-543](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L331-L543)

---

## Tool Categories

Tools come from two origins: the upstream `codingTools` set (from `@mariozechner/pi-coding-agent`) and OpenClaw-native tools created in `createOpenClawTools` ([src/agents/openclaw-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/openclaw-tools.ts)).

### Base Coding Tools

The `codingTools` array from `@mariozechner/pi-coding-agent` provides the core filesystem tools. OpenClaw replaces several of these in-place during assembly:
Tool nameReplacement in `createOpenClawCodingTools`Source`read``createOpenClawReadTool` or `createSandboxedReadTool``pi-tools.read.ts``write``createHostWorkspaceWriteTool` or `createSandboxedWriteTool``pi-tools.read.ts``edit``createHostWorkspaceEditTool` or `createSandboxedEditTool``pi-tools.read.ts``bash`**Removed entirely**—`exec`**Removed from base, re-added via `createExecTool`**`bash-tools.ts`
Sources: [src/agents/pi-tools.ts331-373](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L331-L373)

### OpenClaw-Native Tools

`createOpenClawTools` ([src/agents/openclaw-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/openclaw-tools.ts)) adds the following tool groups. These are documented in [docs/tools/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/index.md):
Tool group shorthandTools included`group:runtime``exec`, `bash`, `process``group:fs``read`, `write`, `edit`, `apply_patch``group:sessions``sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`, `session_status``group:memory``memory_search`, `memory_get``group:web``web_search`, `web_fetch``group:ui``browser`, `canvas``group:automation``cron`, `gateway``group:messaging``message``group:nodes``nodes``group:openclaw`All built-in tools
Additional tools: `image`, `agents_list`, `tts` (voice; excluded when `messageProvider=voice`).

Channel plugins may also contribute tools via `listChannelAgentTools` ([src/agents/channel-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/channel-tools.ts)).

Sources: [docs/tools/index.md141-164](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/index.md#L141-L164)[src/agents/pi-tools.ts454-496](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L454-L496)

---

## Tool Policy Pipeline

Policy enforcement is the most complex part of tool assembly. Multiple independent policy layers are resolved and then applied in sequence via `applyToolPolicyPipeline` ([src/agents/tool-policy-pipeline.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-policy-pipeline.ts)).

### Policy Layers

**Tool policy resolution diagram**

```
applyToolPolicyPipeline
(tool-policy-pipeline.ts)

buildDefaultToolPolicyPipelineSteps
(profile, providerProfile, global,
globalProvider, agent, agentProvider, group)

sandbox tools.allow step

subagent tools.allow step

Policy Merging (tool-policy.ts)

mergeAlsoAllowPolicy
(profile + alsoAllow)

collectExplicitAllowlist
(for plugin tool gating)

applyOwnerOnlyToolPolicy
(senderIsOwner gate)

Policy Resolution (pi-tools.policy.ts)

resolveEffectiveToolPolicy
→ globalPolicy, agentPolicy,
globalProviderPolicy, agentProviderPolicy,
profile, providerProfile,
profileAlsoAllow, providerProfileAlsoAllow

resolveGroupToolPolicy
→ groupPolicy

resolveSubagentToolPolicy
→ subagentPolicy

resolveToolProfilePolicy
→ profilePolicy / providerProfilePolicy

OpenClawConfig
(openclaw.json)

filtered AnyAgentTool[]
```

Sources: [src/agents/pi-tools.ts244-521](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L244-L521)[src/agents/pi-tools.policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.policy.ts)[src/agents/tool-policy-pipeline.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-policy-pipeline.ts)[src/agents/tool-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-policy.ts)

### Policy Precedence

The pipeline applies policies as ordered steps. Within each step, `deny` wins over `allow`. The effective precedence (from broadest to narrowest) is:

1. **Profile policy** (`tools.profile`) — base allowlist before explicit allow/deny
2. **Provider profile policy** (`tools.byProvider[provider].profile`) — further narrows for a specific model provider or `provider/model`
3. **Global policy** (`tools.allow` / `tools.deny`)
4. **Global provider policy** (`tools.byProvider[provider].allow/deny`)
5. **Agent policy** (`agents.list[].tools.allow/deny`)
6. **Agent provider policy** (`agents.list[].tools.byProvider`)
7. **Group policy** — channel-level restrictions (resolved by `resolveGroupToolPolicy`)
8. **Sandbox tools policy** (`sandbox.tools.allow/deny`)
9. **Subagent policy** — depth-based restrictions (resolved by `resolveSubagentToolPolicy`)

Additionally:

- **Owner-only policy** (`applyOwnerOnlyToolPolicy`): certain tools are gated on `senderIsOwner === true`
- **Message provider policy** (`applyMessageProviderToolPolicy`): e.g., `tts` is excluded when `messageProvider=voice`

Sources: [src/agents/pi-tools.ts259-522](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L259-L522)[docs/tools/index.md34-136](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/index.md#L34-L136)

### Tool Profiles

The `tools.profile` setting establishes a base allowlist before explicit `allow`/`deny` lists:
ProfileIncluded tools`minimal``session_status` only`coding``group:fs`, `group:runtime`, `group:sessions`, `group:memory`, `image``messaging``group:messaging`, `sessions_list`, `sessions_history`, `sessions_send`, `session_status``full`No restriction (same as unset)
Per-agent override: `agents.list[].tools.profile`. Provider override: `tools.byProvider[key].profile`.

Sources: [docs/tools/index.md34-80](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/index.md#L34-L80)

---

## Workspace Root Guards

When `tools.fs.workspaceOnly` is `true` (or the agent is sandboxed), filesystem tools are wrapped with guards that enforce path containment. This is done via wrappers defined in [src/agents/pi-tools.read.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.read.ts):
WrapperWhen appliedPurpose`wrapToolWorkspaceRootGuard`Host (non-sandbox) mode + `workspaceOnly`Rejects paths outside `workspaceRoot``wrapToolWorkspaceRootGuardWithOptions`Sandbox mode + `workspaceOnly`Same, but also maps container paths via `containerWorkdir`
**Workspace guard flow diagram**

```
Host path

Sandbox path

yes

yes

no

no

yes

no

read tool
(base)

sandbox
enabled?

workspaceOnly
= true?

createSandboxedReadTool
(root=sandboxRoot, bridge=sandboxFsBridge)

wrapToolWorkspaceRootGuardWithOptions
(containerWorkdir mapping)

createReadTool(workspaceRoot)
(@mariozechner/pi-coding-agent)

createOpenClawReadTool
(adds image sanitization + context window budget)

wrapToolWorkspaceRootGuard
(workspaceRoot)

sandboxed read (unguarded)

workspaceOnly?

host read (unguarded)
```

Sources: [src/agents/pi-tools.ts331-373](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L331-L373)[src/agents/pi-tools.read.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.read.ts)

The `workspaceRoot` is resolved via `resolveWorkspaceRoot` ([src/agents/workspace-dir.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/workspace-dir.ts)), which uses `options.workspaceDir` or falls back to the configured agent workspace. The filesystem policy itself is created by `createToolFsPolicy` in [src/agents/tool-fs-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-fs-policy.ts)

For `apply_patch`, an analogous flag `applyPatchConfig.workspaceOnly` defaults to `true` and is checked independently:

```
applyPatchWorkspaceOnly = workspaceOnly || applyPatchConfig?.workspaceOnly !== false

```

Sources: [src/agents/pi-tools.ts311-323](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L311-L323)

---

## Exec Tool Configuration

The `exec` tool is constructed via `createExecTool` from [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.ts) which merges configuration from:

1. Inline `options.exec` overrides (passed directly by the caller)
2. Per-agent exec config (`agents.list[id].tools.exec`)
3. Global exec config (`tools.exec`)

This merging is done by `resolveExecConfig` in [src/agents/pi-tools.ts118-145](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L118-L145) The resulting `execTool` is always included in the assembled list, regardless of policy (policy filtering happens afterward).

The `process` tool (for managing background exec sessions) is created via `createProcessTool` from [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.ts) with its own `cleanupMs` and `scopeKey`. When `process` is disallowed by policy, `exec` runs synchronously and ignores `yieldMs`/`background` parameters.

Sources: [src/agents/pi-tools.ts374-413](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L374-L413)[docs/tools/index.md188-226](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/index.md#L188-L226)

---

## Schema Normalization and Provider Quirks

After policy filtering, every tool in the list is passed through `normalizeToolParameters` from [src/agents/pi-tools.schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.schema.ts):

- **OpenAI and most providers**: strips root-level union schemas that would be rejected
- **Gemini**: applies `cleanToolSchemaForGemini`, which removes constraint keywords (e.g., `minLength`, `pattern`) that the Gemini API rejects

This is applied uniformly to prevent provider-specific schema rejections at the API layer.

Additionally, two provider-specific gating rules exist in `createOpenClawCodingTools`:

- `apply_patch` is only enabled for OpenAI-family providers (`isOpenAIProvider` check at [src/agents/pi-tools.ts60-63](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L60-L63))
- Anthropic OAuth transport remaps tool names to Claude Code–style names on the wire (handled in `pi-ai`, not in this layer)

Sources: [src/agents/pi-tools.ts524-528](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L524-L528)[src/agents/pi-tools.schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.schema.ts)

---

## Tool Lifecycle Wrappers

After schema normalization, each tool receives two additional wrappers applied in order:

**`wrapToolWithBeforeToolCallHook`** ([src/agents/pi-tools.before-tool-call.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.before-tool-call.ts)):

- Intercepts every tool call before execution
- Runs loop detection logic (see below)
- Receives `agentId`, `sessionKey`, and `loopDetection` config

**`wrapToolWithAbortSignal`** ([src/agents/pi-tools.abort.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.abort.ts)):

- Wraps tool execution with an `AbortSignal`
- Only applied when `options.abortSignal` is provided
- Throws on signal abort before or during tool execution

Sources: [src/agents/pi-tools.ts529-541](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L529-L541)

---

## Tool-Call Loop Detection

Loop detection is configured via `tools.loopDetection` in `openclaw.json` and resolved per-agent by `resolveToolLoopDetectionConfig` in [src/agents/pi-tools.ts147-172](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L147-L172):

```
{
  tools: {
    loopDetection: {
      enabled: true,
      warningThreshold: 10,
      criticalThreshold: 20,
      globalCircuitBreakerThreshold: 30,
      historySize: 30,
      detectors: {
        genericRepeat: true,
        knownPollNoProgress: true,
        pingPong: true,
      },
    },
  },
}
```
DetectorDescription`genericRepeat`Same tool + same params called repeatedly`knownPollNoProgress`Poll-like tools returning identical output`pingPong`Alternating A/B/A/B patterns with no progress
The per-agent config is merged over the global config when both exist, with `detectors` merged shallowly. Per-agent override: `agents.list[].tools.loopDetection`.

Sources: [src/agents/pi-tools.ts147-172](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L147-L172)[docs/tools/index.md228-255](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/index.md#L228-L255)

---

## Sandbox Integration

When `options.sandbox` is provided and `sandbox.enabled` is `true`, tool assembly adapts in several ways:

- `read`, `write`, `edit` use sandboxed variants that route through `sandboxFsBridge`
- The filesystem root for path guards becomes `sandboxRoot` (the container workspace path)
- `exec` receives a `sandbox` object with `containerName`, `workspaceDir`, `containerWorkdir`, and Docker env
- `apply_patch` is only created when `allowWorkspaceWrites` (i.e., `sandbox.workspaceAccess !== "ro"`)
- Plugin tool allowlist is computed from `sandbox.tools.allow` as an additional pipeline step

The `SandboxContext` type is defined in [src/agents/sandbox.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox.ts)

Sources: [src/agents/pi-tools.ts241-328](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L241-L328)[src/agents/pi-tools.ts400-450](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L400-L450)

---

## Tool Display Metadata

Tool call display in the Control UI is driven by [src/agents/tool-display.json](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-display.json) which maps tool names to emoji, display titles, and which parameter keys to extract for the detail label. For example:
ToolEmojiDetail keys`exec`🛠️`command``read`📖`path``browser`🌐action-specific (e.g., `targetUrl`)`nodes`📱action-specific (e.g., `node`, `facing`)`cron`⏰action-specific`sessions_spawn`🤖`task`, `agentId`, `mode`
A `fallback` entry handles any tool not explicitly listed.

Sources: [src/agents/tool-display.json1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-display.json#L1-L50)

---

## Key Types and Files Reference
SymbolFileRole`createOpenClawCodingTools`[src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts)Main tool assembly entry point`AnyAgentTool``src/agents/pi-tools.types.ts`Union type for all tool objects`resolveEffectiveToolPolicy``src/agents/pi-tools.policy.ts`Resolves global/agent/provider policies`resolveGroupToolPolicy``src/agents/pi-tools.policy.ts`Resolves channel-level group restrictions`resolveSubagentToolPolicy``src/agents/pi-tools.policy.ts`Depth-based subagent tool restrictions`applyToolPolicyPipeline``src/agents/tool-policy-pipeline.ts`Applies ordered policy steps to tool list`applyOwnerOnlyToolPolicy``src/agents/tool-policy.ts`Gates owner-only tools on `senderIsOwner``resolveToolProfilePolicy``src/agents/tool-policy.ts`Converts a profile string to an allow set`mergeAlsoAllowPolicy``src/agents/tool-policy.ts`Merges `alsoAllow` extension into a profile policy`wrapToolWorkspaceRootGuard``src/agents/pi-tools.read.ts`Enforces path containment (host mode)`createToolFsPolicy``src/agents/tool-fs-policy.ts`Creates the fs policy object from config`resolveWorkspaceRoot``src/agents/workspace-dir.ts`Resolves the effective workspace root path`normalizeToolParameters``src/agents/pi-tools.schema.ts`Provider-aware JSON Schema normalization`cleanToolSchemaForGemini``src/agents/pi-tools.schema.ts`Removes Gemini-incompatible schema keywords`wrapToolWithBeforeToolCallHook``src/agents/pi-tools.before-tool-call.ts`Loop detection intercept`wrapToolWithAbortSignal``src/agents/pi-tools.abort.ts`Abort signal wrapper`createExecTool``src/agents/bash-tools.ts`Creates the `exec` tool`createProcessTool``src/agents/bash-tools.ts`Creates the `process` tool`createApplyPatchTool``src/agents/apply-patch.ts`Creates the `apply_patch` tool`createOpenClawTools``src/agents/openclaw-tools.ts`Creates all OpenClaw-native tools`listChannelAgentTools``src/agents/channel-tools.ts`Returns channel plugin–contributed tools`resolveExecConfig`[src/agents/pi-tools.ts118-145](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L118-L145)Merges global + agent exec configuration`resolveToolLoopDetectionConfig`[src/agents/pi-tools.ts147-172](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L147-L172)Merges global + agent loop detection config

---

# Exec-Tool-&-Exec-Approvals

# Exec Tool & Exec Approvals
Relevant source files
- [docs/concepts/session-tool.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/session-tool.md)
- [docs/tools/exec-approvals.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/exec-approvals.md)
- [docs/tools/exec.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/exec.md)
- [docs/tools/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/index.md)
- [docs/tools/subagents.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/subagents.md)
- [src/agents/bash-tools.exec-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec-runtime.ts)
- [src/agents/bash-tools.exec.path.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.path.test.ts)
- [src/agents/bash-tools.exec.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts)
- [src/agents/sandbox-merge.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox-merge.test.ts)
- [src/agents/subagent-announce-dispatch.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce-dispatch.test.ts)
- [src/agents/subagent-announce-dispatch.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce-dispatch.ts)
- [src/agents/subagent-announce.format.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.format.test.ts)
- [src/agents/subagent-announce.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts)
- [src/agents/subagent-registry.announce-loop-guard.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.announce-loop-guard.test.ts)
- [src/agents/subagent-registry.persistence.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.persistence.test.ts)
- [src/agents/subagent-registry.store.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.store.ts)
- [src/agents/subagent-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts)
- [src/agents/tool-display.json](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-display.json)
- [src/agents/tools/sessions-spawn-tool.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/sessions-spawn-tool.ts)
- [src/cli/nodes-cli.coverage.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/nodes-cli.coverage.test.ts)
- [src/cli/nodes-cli/register.invoke.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/nodes-cli/register.invoke.ts)
- [src/commands/agent.delivery.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent.delivery.test.ts)
- [src/commands/agent.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent.test.ts)
- [src/commands/agent.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent.ts)
- [src/commands/agent/delivery.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent/delivery.ts)
- [src/config/sessions.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions.test.ts)
- [src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions.ts)
- [src/config/sessions/store.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/store.ts)
- [src/cron/isolated-agent.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.ts)
- [src/infra/exec-approvals-allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-allowlist.ts)
- [src/infra/exec-approvals-analysis.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-analysis.ts)
- [src/infra/exec-approvals-safe-bins.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-safe-bins.test.ts)
- [src/infra/exec-approvals.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.test.ts)
- [src/infra/exec-command-resolution.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-command-resolution.ts)
- [src/infra/exec-safe-bin-policy-profiles.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy-profiles.ts)
- [src/infra/exec-safe-bin-policy-validator.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy-validator.ts)
- [src/infra/exec-safe-bin-policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy.test.ts)
- [src/infra/exec-safe-bin-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy.ts)
- [src/infra/outbound/agent-delivery.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/agent-delivery.test.ts)
- [src/infra/outbound/agent-delivery.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/agent-delivery.ts)
- [src/infra/outbound/channel-resolution.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/channel-resolution.ts)
- [src/infra/outbound/targets.channel-resolution.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/targets.channel-resolution.test.ts)
- [src/infra/path-prepend.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/path-prepend.ts)
- [src/node-host/invoke-system-run.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke-system-run.test.ts)
- [src/node-host/invoke-system-run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke-system-run.ts)
- [src/node-host/invoke.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke.ts)
- [src/utils/delivery-context.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/utils/delivery-context.test.ts)
- [src/utils/delivery-context.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/utils/delivery-context.ts)

This page covers the `exec` and `process` agent tools, execution host routing (sandbox, gateway, node), PATH handling, PTY support, and the exec approvals subsystem (allowlists, safe bins, and user approval prompts).

For the broader tool assembly pipeline and tool policy enforcement, see [Tools](/openclaw/openclaw/3.4-tools). For Docker sandbox configuration that affects exec host selection, see [Sandboxing](/openclaw/openclaw/7.2-sandboxing). For native node app architecture that exec routes to, see [Native Clients (Nodes)](/openclaw/openclaw/6-native-clients-(nodes)). For the security audit that checks exec configurations, see [Security Audit](/openclaw/openclaw/7.1-security-audit).

---

## The `exec` and `process` Tools

The `exec` tool lets agents run shell commands. It supports foreground execution (synchronous), background execution (returns a `sessionId`, polled later), and PTY mode for interactive programs.

The `process` tool manages background sessions started by `exec`. Actions: `list`, `poll`, `log`, `write` (stdin), `kill`, `clear`, `remove`.

Both tools are instantiated in `createOpenClawCodingTools` in [src/agents/pi-tools.ts375-413](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L375-L413)`exec` is created via `createExecTool` and `process` via `createProcessTool`, both defined in [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.ts) with the exec implementation detailed in [src/agents/bash-tools.exec.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts)

### Tool Parameters
ParameterTypeDefaultDescription`command`stringrequiredShell command`workdir`stringcwdWorking directory`env`object—Key/value env overrides`yieldMs`number10000Auto-background after N ms`background`boolfalseBackground immediately`timeout`number1800Kill timeout in seconds`pty`boolfalseRun in pseudo-terminal`elevated`boolfalseRequest elevated mode (gateway host)`host`string`sandbox``sandbox`, `gateway`, or `node``security`stringvaries`deny`, `allowlist`, or `full``ask`string`on-miss``off`, `on-miss`, or `always``node`string—Node id/name for `host=node`
The schema is defined as `execSchema` in [src/agents/bash-tools.exec-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec-runtime.ts)

---

## Execution Hosts

The host is resolved in this order: call-time `host` parameter (restricted unless elevated) → `tools.exec.host` config → hardcoded default `"sandbox"`.

**Exec host routing:**

```
yes

no

full bypass

normal

approved

pending

exec tool call

host resolution
bash-tools.exec.ts:createExecTool

host=sandbox
Docker container

host=gateway
Gateway process

host=node
Paired node

sandbox
context
present?

elevated
mode?

processGatewayAllowlist()
bash-tools.exec-host-gateway.ts

executeNodeHostCommand()
bash-tools.exec-host-node.ts

runExecProcess()
bash-tools.exec-runtime.ts

Error: sandbox
unavailable

status=approval-pending
```

Sources: [src/agents/bash-tools.exec.ts300-456](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L300-L456)[src/agents/bash-tools.exec-runtime.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec-runtime.ts#L1-L50)

### Sandbox Host

Commands run inside the Docker container. The `SandboxContext` (container name, workspace dir, env) is threaded through `createOpenClawCodingTools`. If `host=sandbox` is requested but the sandbox runtime is unavailable, `exec`**fails closed** — it does not silently fall back to the gateway host ([src/agents/bash-tools.exec.ts335-347](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L335-L347)).

### Gateway Host

Commands run on the gateway machine as the same OS user as the OpenClaw process. Before execution, `processGatewayAllowlist` ([src/agents/bash-tools.exec.ts426-456](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L426-L456)) evaluates the exec approvals policy described below.

### Node Host

Commands are forwarded via the Gateway WebSocket to a paired native node (macOS companion app or headless `openclaw node run`). The node independently enforces its own copy of exec approvals. Handled by `executeNodeHostCommand` ([src/agents/bash-tools.exec.ts401-424](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L401-L424)).

---

## Background Execution

When `allowBackground` is true (derived from whether the `process` tool is permitted by active tool policies, [src/agents/pi-tools.ts292-302](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L292-L302)), `exec` can return before the process exits.

- `yieldMs=N`: After N milliseconds, `exec` returns `status: "running"` with a `sessionId`. The process continues.
- `background: true`: Returns immediately with `status: "running"`.

Sessions are tracked in `bash-process-registry.ts`. The `process` tool's actions use the `sessionId` to interact with that registry.

**Background session lifecycle:**

```
"process tool"
"Shell process"
"bash-process-registry.ts"
"exec tool (bash-tools.exec.ts)"
"Agent (LLM)"
"process tool"
"Shell process"
"bash-process-registry.ts"
"exec tool (bash-tools.exec.ts)"
"Agent (LLM)"
"yieldMs timer fires"
"exec(command, yieldMs=5000)"
"spawn via runExecProcess()"
"addSession()"
"markBackgrounded()"
"status=running, sessionId=<id>"
"appendOutput() on stdout/stderr"
"process(action=poll, sessionId=<id>)"
"tail() + exit status"
"output + completed status"
```

Sources: [src/agents/bash-tools.exec.ts491-593](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L491-L593)[src/agents/bash-tools.exec-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec-runtime.ts)

---

## PTY Support

When `pty: true` is passed and `host` is not `sandbox`, the command spawns in a pseudo-terminal. Required for terminal UIs, interactive coding agents (`claude`, `codex`), `vim`, etc.

Active when `usePty = params.pty === true && !sandbox` ([src/agents/bash-tools.exec.ts465](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L465-L465)). DSR (Device Status Report) escape sequences are intercepted by `buildCursorPositionResponse` and `stripDsrRequests` from [src/agents/pty-dsr.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pty-dsr.ts)

---

## Configuration

`resolveExecConfig` in [src/agents/pi-tools.ts118-145](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L118-L145) merges global `tools.exec.*` with per-agent `agents.list[].tools.exec.*`. Per-agent values win.
Config keyDefaultDescription`tools.exec.host``sandbox`Default execution host`tools.exec.security``deny` (sandbox), `allowlist` (gateway/node)Enforcement mode`tools.exec.ask``on-miss`When to prompt for approval`tools.exec.node`—Bound node id/name for `host=node``tools.exec.pathPrepend``[]`Directories prepended to `PATH` (gateway + sandbox only)`tools.exec.safeBins`built-in liststdin-only safe binaries`tools.exec.safeBinTrustedDirs``/bin`, `/usr/bin`Extra trusted dirs for safeBins path validation`tools.exec.safeBinProfiles`built-in profilesPer-bin argv policy`tools.exec.backgroundMs`10000Default `yieldMs` value`tools.exec.timeoutSec`1800Default kill timeout`tools.exec.approvalRunningNoticeMs`10000Emit "running" notice if approval-gated exec exceeds this`tools.exec.notifyOnExit``true`Emit system event + heartbeat on backgrounded process exit`tools.exec.notifyOnExitEmptySuccess``false`Also notify on zero-output success
Sources: [src/agents/pi-tools.ts118-145](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L118-L145)[docs/tools/exec.md52-73](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/exec.md#L52-L73)

### PATH Handling
HostPATH source`env.PATH` override`pathPrepend``gateway`Login-shell PATH via `getShellPathFromLoginShell()`❌ rejected by `validateHostEnv`✅ applied via `applyPathPrepend``sandbox`Login-shell inside container (`sh -lc`)✅ prepended internally✅ applied`node`Node host's own environment❌ rejected❌ ignored (warning emitted)
`env.PATH` overrides and loader variables (`LD_*`, `DYLD_*`) are always blocked for gateway and node hosts via `sanitizeHostBaseEnv` and `validateHostEnv` in [src/agents/bash-tools.exec-runtime.ts34-62](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec-runtime.ts#L34-L62) to prevent binary hijacking.

---

## Elevated Mode

When `elevated: true`:

1. `host` is forced to `"gateway"` regardless of config ([src/agents/bash-tools.exec.ts317-319](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L317-L319)).
2. If `elevatedMode === "full"`: `security` → `"full"`, `ask` → `"off"`. All approvals bypassed.
3. If `elevatedMode === "ask"`: normal approval flow applies, but on the gateway host.

Elevated mode requires both `tools.elevated.enabled` and `tools.elevated.allowFrom.<provider>` to be set. Elevated mode is a no-op when sandboxing is off (exec is already running on the host).

Sources: [src/agents/bash-tools.exec.ts248-333](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L248-L333)

---

## Exec Approvals

Exec approvals are the host-side guardrail for gateway and node commands — separate from tool policy. Even if the `exec` tool is allowed by policy, individual commands must still pass exec approvals on the host that runs them.

> Effective policy is the **stricter** of `tools.exec.*` config and the approvals file defaults. `minSecurity` and `maxAsk` in `src/infra/exec-approvals.ts` compute the merged values.

### Approvals File

Stored at `~/.openclaw/exec-approvals.json` on each execution host. Key functions: `resolveExecApprovals`, `saveExecApprovals`, `normalizeExecApprovals` in [src/infra/exec-approvals.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.ts)

```
{
  "version": 1,
  "socket": {
    "path": "~/.openclaw/exec-approvals.sock",
    "token": "<base64url>"
  },
  "defaults": {
    "security": "deny",
    "ask": "on-miss",
    "askFallback": "deny",
    "autoAllowSkills": false
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "allowlist": [
        {
          "id": "<uuid>",
          "pattern": "/opt/homebrew/bin/rg",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg -n TODO",
          "lastResolvedPath": "/opt/homebrew/bin/rg"
        }
      ]
    }
  }
}
```

Sources: [src/infra/exec-approvals.test.ts80-130](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.test.ts#L80-L130)[docs/tools/exec-approvals.md40-78](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/exec-approvals.md#L40-L78)

### Policy Knobs
KnobValuesEffect`security``deny`, `allowlist`, `full`Block all / require allowlist / allow all`ask``off`, `on-miss`, `always`Never prompt / prompt on miss / always prompt`askFallback``deny`, `allowlist`, `full`Policy when approval UI is unreachable`autoAllowSkills`boolAuto-trust skill CLI binaries on node host
### Gateway Approval Flow

**Gateway exec approval decision:**

```
deny

full

allowlist

no

yes

yes

no

off

on-miss or always

no

yes

approved

denied/timeout

gateway exec request

security?

denied

run directly (security=full)

analyzeShellCommand()
exec-approvals-analysis.ts

parse
succeeded?

denied (unsupported syntax)

evaluateShellAllowlist()
exec-approvals-allowlist.ts

all segments
satisfied?

ask mode?

approval socket
available?

apply askFallback

prompt via companion UI
or approval socket

decision?

recordAllowlistUse()
save exec-approvals.json

runExecProcess()
bash-tools.exec-runtime.ts
```

Sources: [src/agents/bash-tools.exec.ts426-456](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L426-L456)[src/infra/exec-approvals.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.ts)[docs/tools/exec-approvals.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/exec-approvals.md)

---

## Shell Command Analysis

Before allowlist evaluation, `analyzeShellCommand` in [src/infra/exec-approvals-analysis.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-analysis.ts) parses the command string into an `ExecCommandAnalysis` object with `.segments[]` (pipeline segments) and `.chains[]` (chain groups separated by `&&`, `||`, `;`). Each segment contains `argv[]` and a `CommandResolution` (resolved binary path).

**Supported and rejected shell constructs:**
ConstructAllowedNotes`cmd | filter`✅Each segment must be independently allowlisted`cmd && cmd2`✅Each chain head must be allowlisted`cmd || fallback`✅Each chain head must be allowlisted`<<'EOF'\ntext\nEOF`✅Quoted heredoc (no expansion)`<<EOF\ntext\nEOF`✅Unquoted heredoc with no `$` or backticks`echo $(id)`❌Command substitution`echo `id``❌Backtick substitution`cat < file`❌Input redirect`echo ok > file`❌Output redirect`cmd\ncmd2`❌Newline (multi-command)`<<EOF\n$(id)\nEOF`❌Unquoted heredoc with expansion
The `resolveCommandResolutionFromArgv` function unwraps transparent dispatch wrappers (`env`, `nice`, `nohup`, `stdbuf`, `timeout`) to find the effective executable. `env -S` and nested wrappers beyond a safe depth are blocked with `policyBlocked: true` even if `env` itself is allowlisted ([src/infra/exec-approvals.test.ts269-342](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.test.ts#L269-L342)).

Sources: [src/infra/exec-approvals-analysis.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-analysis.ts)[src/infra/exec-approvals.test.ts362-498](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.test.ts#L362-L498)

---

## Allowlist Matching

Allowlists are **per agent** in the approvals file. Patterns are glob-matched against **resolved binary paths**. Basename-only entries are not matched.
PatternMatches`/opt/homebrew/bin/rg`Exact path`/opt/**/bin/rg`Any `rg` under `/opt/*/bin/``~/.local/bin/*`Any binary in `~/.local/bin/``*`Any resolved path
Key functions: `matchAllowlist`, `evaluateExecAllowlist`, `evaluateShellAllowlist` in [src/infra/exec-approvals-allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-allowlist.ts)

Each successful match records the timestamp, command, and resolved path back to the allowlist entry via `recordAllowlistUse`.

Sources: [src/infra/exec-approvals.test.ts35-78](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.test.ts#L35-L78)[src/infra/exec-approvals-allowlist.ts97-270](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-allowlist.ts#L97-L270)

---

## Safe Bins (stdin-only)

`tools.exec.safeBins` allows certain stream-filter binaries to run in `allowlist` mode without explicit allowlist entries — but only for stdin-only usage patterns.

**Default safe bins:**`jq`, `cut`, `uniq`, `head`, `tail`, `tr`, `wc`

**Safe bin validation chain:**

```
no

yes

no

yes

no

yes

missing

found

valid

invalid

segment argv[]

isSafeBinUsage()
exec-approvals-allowlist.ts

executableName
in safeBins?

not Windows?

resolvedPath in
trustedSafeBinDirs?

look up SafeBinProfile
exec-safe-bin-policy.ts
SAFE_BIN_PROFILES

validateSafeBinArgv()
exec-safe-bin-policy.ts

segment: satisfied (safeBins)

segment: not satisfied
```

Each `SafeBinProfile` (in [src/infra/exec-safe-bin-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy.ts)) defines:

- `minPositional` / `maxPositional`: bounds on non-flag arguments
- `allowedValueFlags`: flags that take values
- `deniedFlags`: explicitly blocked flags (e.g. `jq -f`, `grep -r`, `sort -o`)

Unknown long flags are rejected fail-closed. Custom safe bins require an explicit profile in `tools.exec.safeBinProfiles`.

> Do **not** add interpreter/runtime binaries (`python3`, `node`, `bash`, `sh`, `ruby`) to `safeBins`. Use explicit allowlist entries for those.

**Denied flags by built-in profile:**
BinaryDenied flags`grep``-r`, `-R`, `-d`, `-f`, `--file`, `--recursive`, `--directories`, `--exclude-from`, `--dereference-recursive``jq``-f`, `-L`, `--from-file`, `--rawfile`, `--slurpfile`, `--argfile`, `--library-path``sort``-o`, `-T`, `--output`, `--compress-program`, `--files0-from`, `--random-source`, `--temporary-directory``wc``--files0-from`
Sources: [src/infra/exec-approvals-allowlist.ts51-95](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-allowlist.ts#L51-L95)[src/infra/exec-safe-bin-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy.ts)[docs/tools/exec-approvals.md134-192](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/exec-approvals.md#L134-L192)

---

## Node Host Approval Flow

On a paired node host, `handleSystemRunInvoke` in [src/node-host/invoke-system-run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke-system-run.ts) runs the full approval pipeline locally on the node:

1. Load `exec-approvals.json` via `resolveExecApprovals`.
2. Evaluate policy via `evaluateSystemRunPolicy` ([src/node-host/exec-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/exec-policy.ts)).
3. Evaluate command against `evaluateSystemRunAllowlist` ([src/node-host/invoke-system-run-allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke-system-run-allowlist.ts)).
4. On miss: request approval via UNIX socket (`exec-approvals.sock`) to the companion app UI.
5. On approval: harden execution paths via `hardenApprovedExecutionPaths` ([src/node-host/invoke-system-run-plan.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke-system-run-plan.ts)) — pins resolved binary paths to prevent TOCTOU races.
6. On allow-always decisions: `addAllowlistEntry` / `recordAllowlistUse` persists the entry.

**Node host invocation flow:**

```
deny

full

allowlist

satisfied

miss + ask=off

miss + ask=on-miss/always

no

yes

approved

denied/timeout

Gateway forwards system.run
to node host

handleSystemRunInvoke()
invoke-system-run.ts

resolveExecApprovals()
exec-approvals.ts

evaluateSystemRunPolicy()
exec-policy.ts

evaluateSystemRunAllowlist()
invoke-system-run-allowlist.ts

exec-approvals.sock
available?

requestExecHostViaSocket()
invoke.ts

hardenApprovedExecutionPaths()
invoke-system-run-plan.ts

addAllowlistEntry() / recordAllowlistUse()

spawn child process

return denied
```

Sources: [src/node-host/invoke-system-run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke-system-run.ts)[src/node-host/invoke.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke.ts)[src/node-host/exec-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/exec-policy.ts)

---

## Code Entity Map

The diagram below maps system-level names to the specific code entities that implement them.

```
node-host/invoke-system-run.ts

exec-safe-bin-policy.ts

exec-approvals-allowlist.ts

exec-approvals-analysis.ts

exec-approvals.ts

bash-tools.exec-host-node.ts

bash-tools.exec-host-gateway.ts

bash-tools.exec-runtime.ts

bash-tools.exec.ts

pi-tools.ts

createOpenClawCodingTools()

resolveExecConfig()

createExecTool()

execSchema

runExecProcess()

sanitizeHostBaseEnv()

validateHostEnv()

processGatewayAllowlist()

executeNodeHostCommand()

resolveExecApprovals()

evaluateExecAllowlist()

evaluateShellAllowlist()

matchAllowlist()

minSecurity()

maxAsk()

recordAllowlistUse()

analyzeShellCommand()

analyzeArgvCommand()

ExecCommandAnalysis type

isSafeBinUsage()

validateSafeBinArgv()

SAFE_BIN_PROFILES

handleSystemRunInvoke()

evaluateSystemRunAllowlist()

hardenApprovedExecutionPaths()
```

Sources: [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts)[src/agents/bash-tools.exec.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts)[src/agents/bash-tools.exec-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec-runtime.ts)[src/infra/exec-approvals.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.ts)[src/infra/exec-approvals-analysis.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-analysis.ts)[src/infra/exec-approvals-allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-allowlist.ts)[src/infra/exec-safe-bin-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy.ts)[src/node-host/invoke-system-run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke-system-run.ts)

---

## Security Notes

- **Sandbox fails closed**: `host=sandbox` with no sandbox runtime produces an error, not a silent gateway fallback ([src/agents/bash-tools.exec.ts335-347](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L335-L347)).
- **env.PATH and loaders blocked**: `validateHostEnv` rejects `PATH`, `LD_*`, and `DYLD_*` in agent-supplied env to prevent binary hijacking or loader injection.
- **env wrapper depth limit**: `env -S` and deeply nested `env` wrappers are flagged `policyBlocked: true` and fail allowlist evaluation even when `env` is allowlisted ([src/infra/exec-approvals.test.ts269-308](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.test.ts#L269-L308)).
- **TOCTOU hardening**: `hardenApprovedExecutionPaths` on the node host pins the binary paths that were approved so the spawned process uses the same binary that was evaluated.
- **Safe bins fail closed on unknown flags**: Any long option not in the profile is rejected (no partial-match abbreviations).
- **Script preflight**: `validateScriptFileForShellBleed` in [src/agents/bash-tools.exec.ts80-149](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L80-L149) inspects Python/JS files for unescaped shell variable syntax (`$VARNAME`) before execution, catching a common LLM-generated code mistake.

---

# Memory-Tools

# Memory Tools
Relevant source files
- [docs/cli/memory.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/memory.md)
- [docs/concepts/memory.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/memory.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/configuration.md)
- [src/agents/memory-search.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/memory-search.test.ts)
- [src/agents/memory-search.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/memory-search.ts)
- [src/agents/tools/memory-tool.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/memory-tool.ts)
- [src/cli/memory-cli.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/memory-cli.test.ts)
- [src/cli/memory-cli.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/memory-cli.ts)
- [src/commands/status.scan.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/status.scan.ts)
- [src/config/schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/schema.ts)
- [src/config/types.memory.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.memory.ts)
- [src/config/types.tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.tools.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.ts)
- [src/config/zod-schema.agent-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.agent-runtime.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts)
- [src/memory/backend-config.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/backend-config.test.ts)
- [src/memory/backend-config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/backend-config.ts)
- [src/memory/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/index.ts)
- [src/memory/manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/manager.ts)
- [src/memory/qmd-manager.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/qmd-manager.test.ts)
- [src/memory/qmd-manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/qmd-manager.ts)
- [src/memory/search-manager.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.test.ts)
- [src/memory/search-manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.ts)

This page covers the `memory_search` and `memory_get` agent tools, the `MemorySearchManager` interface and its two backend implementations (`MemoryIndexManager` and `QmdMemoryManager`), embedding provider selection, vector/BM25/hybrid search mechanics, and the `openclaw memory` CLI commands.

For the broader concept of what memory files are, where they live in the agent workspace, and how the pre-compaction memory flush works, see the Memory concept documentation. For how these tools are assembled into the full tool set presented to the agent, see page [3.4](https://github.com/openclaw/openclaw/blob/8090cb4c/3.4)

---

## Agent-Facing Tools

Two tools are registered when memory search is enabled for an agent:
Tool nameCreator functionDescription`memory_search``createMemorySearchTool`Semantically searches `MEMORY.md` + `memory/*.md` (and optional session transcripts). Returns top snippets with path and line ranges.`memory_get``createMemoryGetTool`Reads a specific memory Markdown file by workspace-relative path, optionally from a start line for N lines.
Both functions live in [src/agents/tools/memory-tool.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/memory-tool.ts) and share a common context resolver, `resolveMemoryToolContext`, which checks that `resolveMemorySearchConfig` returns a non-null result before registering either tool. If memory search is disabled for the agent, neither tool is added.

**Tool parameters:**

`memory_search` (`MemorySearchSchema`):

- `query` (string, required)
- `maxResults` (number, optional)
- `minScore` (number, optional)

`memory_get` (`MemoryGetSchema`):

- `path` (string, required) — workspace-relative path; must be within `MEMORY.md` or `memory/`
- `from` (integer, optional) — 1-based start line
- `lines` (integer, optional) — number of lines to return

**`memory_search` return shape:**

```
{
  "results": [ { "path": "MEMORY.md", "startLine": 1, "endLine": 20, "score": 0.87, "snippet": "..." } ],
  "provider": "openai",
  "model": "text-embedding-3-small",
  "fallback": false,
  "citations": "auto",
  "mode": "search"
}
```

If the manager is unavailable (embedding not configured, index error), `memory_search` returns `{ "disabled": true }` instead of throwing so the agent can surface the issue gracefully.

`memory_get` on a missing file returns `{ "text": "", "path": "<relpath>" }` rather than throwing `ENOENT`.

**Diagram: Tool dispatch to manager**

```
enabled?

Agent turn
(createOpenClawCodingTools)

createMemorySearchTool
(memory-tool.ts)

createMemoryGetTool
(memory-tool.ts)

resolveMemoryToolContext
→ resolveMemorySearchConfig

getMemorySearchManager
(search-manager.ts)

manager.search(query, opts)

manager.readFile(params)

jsonResult(...)
```

Sources: [src/agents/tools/memory-tool.ts1-170](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/memory-tool.ts#L1-L170)

---

## `MemorySearchManager` Interface

Both backends implement the `MemorySearchManager` interface (defined in `src/memory/types.ts`):
MethodPurpose`search(query, opts?)`Returns `MemorySearchResult[]``readFile(params)`Returns `{ text, path }``sync(params?)`Triggers index refresh`status()`Returns `MemoryProviderStatus``close()`Releases resources`probeVectorAvailability()`Checks sqlite-vec extension (builtin only)`probeEmbeddingAvailability()`Checks embedding provider connectivity
`MemorySearchResult` fields: `path`, `startLine`, `endLine`, `score`, `snippet`, `source` (`"memory"` | `"sessions"`).

**Diagram: MemorySearchManager implementations**

```
"primary"

"fallback"

«interface»

MemorySearchManager

+search(query, opts) : MemorySearchResult[]

+readFile(params) : text_path

+sync(params) : void

+status() : MemoryProviderStatus

+close() : void

MemoryIndexManager

+db DatabaseSync

+provider EmbeddingProvider

+settings ResolvedMemorySearchConfig

+sources Set_MemorySource

+fts fts_state

+vector vector_state

+watcher FSWatcher

+static get(params) : MemoryIndexManager

+search(query, opts) : MemorySearchResult[]

+readFile(params) : text_path

+sync(params) : void

+status() : MemoryProviderStatus

QmdMemoryManager

+qmd ResolvedQmdConfig

+collectionRoots Map

+sessionExporter SessionExporterConfig

+static create(params) : QmdMemoryManager

+search(query, opts) : MemorySearchResult[]

+readFile(params) : text_path

+sync(params) : void

+status() : MemoryProviderStatus

FallbackMemoryManager

+primary MemorySearchManager

+fallbackFactory fn

+primaryFailed boolean

+search(query, opts) : MemorySearchResult[]
```

Sources: [src/memory/manager.ts44-212](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/manager.ts#L44-L212)[src/memory/qmd-manager.ts141-242](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/qmd-manager.ts#L141-L242)[src/memory/search-manager.ts75-180](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.ts#L75-L180)

---

## Backend Selection

`getMemorySearchManager` in [src/memory/search-manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.ts) is the single entry point for both tools and the CLI. It reads `resolveMemoryBackendConfig` and routes to the correct implementation.

**Diagram: Backend selection flow**

```
qmd

yes

no

builtin

getMemorySearchManager
(search-manager.ts)

resolveMemoryBackendConfig
(backend-config.ts)

resolved.backend

QmdMemoryManager.create(...)

FallbackMemoryManager
(wraps QMD + builtin)

QMD_MANAGER_CACHE
Map

MemoryIndexManager.get(...)

INDEX_CACHE
Map

manager returned
to caller

QMD init
succeeded?

log warn + fall through
to builtin
```

`resolveMemoryBackendConfig` reads `cfg.memory.backend` (default: `"builtin"`) and produces a `ResolvedMemoryBackendConfig`. For the QMD path it also resolves collections, update intervals, and limits into `ResolvedQmdConfig`.

When `purpose = "status"` (used by the CLI), `getMemorySearchManager` skips the `FallbackMemoryManager` wrapper and skips the cache — it creates a lightweight instance that doesn't start timers or run boot updates.

Sources: [src/memory/search-manager.ts19-73](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.ts#L19-L73)[src/memory/backend-config.ts1-72](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/backend-config.ts#L1-L72)

---

## Builtin Backend — `MemoryIndexManager`

`MemoryIndexManager` in [src/memory/manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/manager.ts) uses Node.js's built-in `DatabaseSync` (SQLite) with optional extensions for vector search.

### SQLite Schema
TablePurpose`files`One row per indexed Markdown file; stores path, mtime, hash, source`chunks`Text chunks derived from each file (~`DEFAULT_CHUNK_TOKENS` = 400 tokens, `DEFAULT_CHUNK_OVERLAP` = 80 overlap)`chunks_vec` (`VECTOR_TABLE`)sqlite-vec virtual table; embedding vectors per chunk`chunks_fts` (`FTS_TABLE`)FTS5 virtual table for BM25 keyword search`embedding_cache` (`EMBEDDING_CACHE_TABLE`)Caches embedding vectors keyed by content hash
The database is stored at `~/.openclaw/memory/<agentId>.sqlite` by default (configurable via `agents.defaults.memorySearch.store.path`, supports `{agentId}` token).

### Embedding Providers

`createEmbeddingProvider` in `src/memory/embeddings.ts` selects and initialises the embedding client. Provider auto-selection order when `memorySearch.provider = "auto"`:

1. `local` — if `memorySearch.local.modelPath` exists on disk
2. `openai` — if an OpenAI API key can be resolved
3. `gemini` — if a Gemini API key is available
4. `voyage` — if a Voyage API key is available
5. `mistral` — if a Mistral API key is available
6. No provider — FTS-only mode (BM25 without vectors)

ProviderDefault modelKey source`openai``text-embedding-3-small`auth profiles / `OPENAI_API_KEY``gemini``gemini-embedding-001``GEMINI_API_KEY` / `models.providers.google.apiKey``voyage``voyage-4-large``VOYAGE_API_KEY` / `models.providers.voyage.apiKey``mistral``mistral-embed``MISTRAL_API_KEY` / `models.providers.mistral.apiKey``local`user-specified GGUF`memorySearch.local.modelPath`
Sources: [src/agents/memory-search.ts81-100](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/memory-search.ts#L81-L100)[src/memory/manager.ts128-212](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/manager.ts#L128-L212)

### Sync and Indexing

The manager watches `MEMORY.md` and `memory/` with `chokidar` (debounced, default 1500 ms). Sync can also be triggered:

- On session start (`sync.onSessionStart = true`)
- On each search call when the index is dirty (`sync.onSearch = true`)
- On a periodic timer (`sync.intervalMinutes`)
- Via `memory index` CLI command

Session transcript indexing is gated by `delta` thresholds (`sync.sessions.deltaBytes`, `sync.sessions.deltaMessages`) to avoid re-indexing on every turn.

If the SQLite handle becomes read-only (e.g. after a filesystem remount), `runSyncWithReadonlyRecovery` reopens the database and retries once before surfacing the error.

### Hybrid Search Pipeline

**Diagram: `MemoryIndexManager.search()` execution**

```
query string

searchKeyword
(manager-search.ts)
→ chunks_fts FTS5

searchVector
(manager-search.ts)
→ chunks_vec sqlite-vec

embedQueryWithTimeout
→ EmbeddingProvider.embed()

mergeHybridResults
(hybrid.ts)

MMR re-rank
(optional)

temporalDecay
(optional)

MemorySearchResult[]
```

Score combination (from [src/memory/hybrid.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/hybrid.ts)):

```
textScore  = 1 / (1 + max(0, bm25Rank))
finalScore = vectorWeight * vectorScore + textWeight * textScore

```

Defaults: `vectorWeight = 0.7`, `textWeight = 0.3`, `candidateMultiplier = 4`, `maxResults = 6`, `minScore = 0.35`.

If the embedding provider returns a zero vector, only keyword results are used. If FTS5 is unavailable, only vector results are used.

Optional post-processing:

- **MMR** (Maximal Marginal Relevance): reduces redundancy by penalising chunks similar to already-selected ones. Default: disabled. Controlled by `memorySearch.query.hybrid.mmr`.
- **Temporal decay**: down-weights older chunks. Default: disabled. Half-life default: 30 days.

Sources: [src/memory/manager.ts230-316](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/manager.ts#L230-L316)[src/memory/hybrid.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/hybrid.ts)[src/memory/manager-search.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/manager-search.ts)[src/agents/memory-search.ts91-99](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/memory-search.ts#L91-L99)

---

## QMD Backend — `QmdMemoryManager`

`QmdMemoryManager` in [src/memory/qmd-manager.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/qmd-manager.ts) shells out to the `qmd` CLI binary for all indexing and retrieval. The Markdown files remain the source of truth; QMD manages its own SQLite index internally.

### XDG Isolation

Each agent gets a self-contained QMD home:

```
~/.openclaw/agents/<agentId>/qmd/
  xdg-config/   ← XDG_CONFIG_HOME
  xdg-cache/    ← XDG_CACHE_HOME
    qmd/
      index.sqlite   ← QMD's SQLite database (indexPath)
      models/        ← symlinked from ~/.cache/qmd/models/ to share downloads
  sessions/     ← session transcript exports (if enabled)

```

The `env` object passed to every `spawn` call includes `XDG_CONFIG_HOME`, `XDG_CACHE_HOME`, and `NO_COLOR=1`.

### Collection Management

QMD collections map collection names to filesystem paths + glob patterns. `QmdMemoryManager.ensureCollections()` runs at startup:

1. Lists existing collections via `qmd collection list --json`
2. Migrates legacy unscoped collection names (e.g. `memory-root` → `memory-root-main`) via `migrateLegacyUnscopedCollections`
3. Rebinds any collection whose path points to a different agent's directory
4. Adds missing collections via `qmd collection add <path> --name <name> --mask <pattern>`

Default collections when `memory.qmd.includeDefaultMemory = true`:
Collection namePathPattern`memory-root-<agentId>`workspace`MEMORY.md``memory-alt-<agentId>`workspace`memory.md``memory-dir-<agentId>`workspace/memory`**/*.md`
Additional collections from `memory.qmd.paths[]` are added with stable user-supplied names.

When `memory.qmd.sessions.enabled = true`, a `sessions-<agentId>` collection is added pointing to the sessions export directory.

### Search Modes

The `memory.qmd.searchMode` setting (default: `"search"`) controls which subcommand is used:
`searchMode`QMD command used`"search"``qmd search <query> --json -n <maxResults> -c <collection>``"vsearch"``qmd vsearch <query> --json -n <maxResults> -c <collection>``"query"``qmd query <query> --json -n <maxResults> -c <collection>`
If the selected mode fails with an unsupported-flag error, the manager retries with `qmd query`.

### Update Cycle

`runUpdate` shells out in sequence:

1. `qmd update` — re-ingests changed documents
2. `qmd embed` — regenerates embeddings (runs via a global serialize lock `runWithQmdEmbedLock` so concurrent agents don't race)

**Timers:**

- Boot update: optional, runs in background by default (`memory.qmd.update.waitForBootSync = false`)
- Periodic: `setInterval` at `memory.qmd.update.intervalMs` (default 5 min)
- Debounce: `memory.qmd.update.debounceMs` prevents repeated syncs (default 60 s)

### Null-byte Recovery

If `qmd update` fails with an error message matching `NUL_MARKER_RE` (patterns like `^@`, `\0`, `null byte`), the manager assumes corrupted collection metadata, removes and re-adds all managed collections, and retries the update once. Non-null-byte failures propagate as-is.

### Fallback Behaviour

`getMemorySearchManager` wraps `QmdMemoryManager` in a `FallbackMemoryManager`. On the first `search()` failure, `FallbackMemoryManager`:

1. Marks `primaryFailed = true`
2. Closes the QMD manager
3. Evicts the `QMD_MANAGER_CACHE` entry
4. Activates `MemoryIndexManager` as the fallback for subsequent calls

Sources: [src/memory/qmd-manager.ts141-300](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/qmd-manager.ts#L141-L300)[src/memory/search-manager.ts75-140](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/search-manager.ts#L75-L140)[src/memory/backend-config.ts60-160](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/backend-config.ts#L60-L160)

---

## Configuration Reference

### Builtin backend (`agents.defaults.memorySearch`)

Configured per-agent at `agents.defaults.memorySearch` (and per-agent overrides at `agents.list[*].memorySearch`). Resolved by `resolveMemorySearchConfig` in [src/agents/memory-search.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/memory-search.ts)
FieldDefaultDescription`enabled``true`Enable/disable memory tools`provider``"auto"`Embedding provider`model`provider defaultEmbedding model id`fallback``"none"`Fallback provider on primary failure`store.path``~/.openclaw/memory/<agentId>.sqlite`SQLite database path`store.vector.enabled``true`Enable sqlite-vec vector index`store.vector.extensionPath`—Path to `sqlite-vec` shared library`chunking.tokens``400`Target tokens per chunk`chunking.overlap``80`Overlap tokens between chunks`query.maxResults``6`Max search results`query.minScore``0.35`Minimum similarity score`query.hybrid.enabled``true`Enable BM25 + vector hybrid`query.hybrid.vectorWeight``0.7`Vector score weight`query.hybrid.textWeight``0.3`BM25 score weight`query.hybrid.candidateMultiplier``4`Candidate pool multiplier`query.hybrid.mmr.enabled``false`Enable MMR re-ranking`query.hybrid.temporalDecay.enabled``false`Enable temporal decay`sync.watch``true`Watch files for changes`sync.watchDebounceMs``1500`Watch debounce delay`sync.onSessionStart``true`Sync on each session start`sync.onSearch``false`Sync before each search`cache.enabled``true`Enable embedding vector cache`extraPaths``[]`Additional directories/files to index
### QMD backend (`memory.qmd.*`)

Activated by `memory.backend = "qmd"`. Schema defined in [src/config/zod-schema.ts100-112](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts#L100-L112) (`MemoryQmdSchema`). Types in [src/config/types.memory.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.memory.ts)
FieldDefaultDescription`memory.backend``"builtin"``"builtin"` or `"qmd"``memory.citations``"auto"``"auto"`, `"on"`, `"off"` — controls `Source:` footer in snippets`memory.qmd.command``"qmd"`Path/name of the QMD binary`memory.qmd.searchMode``"search"``"search"`, `"vsearch"`, `"query"``memory.qmd.includeDefaultMemory``true`Auto-add `MEMORY.md` + `memory/**` collections`memory.qmd.paths[]``[]`Extra collections: `{ path, name?, pattern? }``memory.qmd.sessions.enabled``false`Export session transcripts for indexing`memory.qmd.sessions.retentionDays`—Prune session exports older than N days`memory.qmd.update.interval``"5m"`Periodic update interval`memory.qmd.update.debounceMs``60000`Minimum ms between updates`memory.qmd.update.onBoot``true`Run update on Gateway start`memory.qmd.update.waitForBootSync``false`Block startup until boot update completes`memory.qmd.update.commandTimeoutMs``30000`Timeout for bootstrap QMD commands`memory.qmd.update.updateTimeoutMs``120000`Timeout for `qmd update``memory.qmd.update.embedTimeoutMs``120000`Timeout for `qmd embed``memory.qmd.limits.maxResults``6`Max search results returned`memory.qmd.limits.maxSnippetChars`—Truncate each snippet`memory.qmd.limits.maxInjectedChars`—Total character budget across all results`memory.qmd.limits.timeoutMs`—Timeout for search subprocess`memory.qmd.scope`DM-only`SessionSendPolicyConfig` — controls which sessions can use QMD results
Example minimum QMD config:

```
{
  memory: {
    backend: "qmd",
    citations: "auto",
    qmd: {
      includeDefaultMemory: true,
      update: { interval: "5m", debounceMs: 15000 },
      limits: { maxResults: 6, timeoutMs: 4000 }
    }
  }
}
```

Sources: [src/config/zod-schema.ts44-121](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.ts#L44-L121)[src/config/types.memory.ts1-68](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.memory.ts#L1-L68)[src/memory/backend-config.ts72-160](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/backend-config.ts#L72-L160)

---

## `openclaw memory` CLI

Registered by `registerMemoryCli` in [src/cli/memory-cli.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/memory-cli.ts) All commands call `getMemorySearchManager` internally.
CommandWhat it does`openclaw memory status`Shows provider, model, file/chunk counts, vector availability, FTS status, cache info`openclaw memory status --deep`Also probes embedding API connectivity (`probeEmbeddingAvailability`)`openclaw memory status --deep --index`Runs `sync({ reason: "cli", force: false })` if the index is dirty`openclaw memory index`Forces `sync({ reason: "cli", force: false })` with progress output`openclaw memory index --force`Forces a full reindex regardless of dirty flag`openclaw memory search <query>`Calls `manager.search()` and prints results
Common flags:

- `--agent <id>` — scope to a specific agent (defaults to all configured agents for `status`, default agent for other commands)
- `--verbose` — enables verbose logging via `setVerbose(true)`
- `--json` — emits JSON output

**Diagram: CLI → manager chain**

```
openclaw memory

registerMemoryCli
(memory-cli.ts)

loadConfig
(config/config.ts)

resolveAgent / resolveAgentIds

withMemoryManagerForAgent

getMemorySearchManager
(search-manager.ts)

MemorySearchManager
(builtin or qmd)

manager.status()

manager.sync(...)

manager.search(query)
```

Sources: [src/cli/memory-cli.ts86-109](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/memory-cli.ts#L86-L109)[src/cli/memory-cli.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/memory-cli.ts#L1-L50)

---

## Path Access Guards

`memory_get` enforces that `relPath` resolves to a file inside the workspace memory area. The allowed set is:

- Files matching `isMemoryPath(relPath)` — paths starting with `MEMORY.md`, `memory.md`, or `memory/`
- Files within directories listed in `memorySearch.extraPaths` (for the builtin backend)
- Paths with the `qmd/<collection>/` prefix (for the QMD backend; `memory_get` maps these back to the collection's filesystem root)

Symlinks are always rejected. Only `.md` files are permitted. Absolute paths are resolved then checked with `path.relative` to confirm they stay within the allowed roots.

Sources: [src/memory/manager.ts505-576](https://github.com/openclaw/openclaw/blob/8090cb4c/src/memory/manager.ts#L505-L576)[src/agents/tools/memory-tool.ts101-130](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/memory-tool.ts#L101-L130)

---

# Subagents

# Subagents
Relevant source files
- [docs/concepts/session-tool.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/concepts/session-tool.md)
- [docs/tools/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/index.md)
- [docs/tools/subagents.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/subagents.md)
- [src/agents/openclaw-tools.subagents.test-harness.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/openclaw-tools.subagents.test-harness.ts)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts)
- [src/agents/subagent-announce-dispatch.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce-dispatch.test.ts)
- [src/agents/subagent-announce-dispatch.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce-dispatch.ts)
- [src/agents/subagent-announce.format.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.format.test.ts)
- [src/agents/subagent-announce.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts)
- [src/agents/subagent-registry.announce-loop-guard.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.announce-loop-guard.test.ts)
- [src/agents/subagent-registry.persistence.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.persistence.test.ts)
- [src/agents/subagent-registry.store.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.store.ts)
- [src/agents/subagent-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts)
- [src/agents/tool-display.json](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tool-display.json)
- [src/agents/tools/sessions-spawn-tool.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/sessions-spawn-tool.ts)
- [src/browser/resolved-config-refresh.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/resolved-config-refresh.ts)
- [src/browser/server-context.hot-reload-profiles.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/server-context.hot-reload-profiles.test.ts)
- [src/commands/agent.delivery.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent.delivery.test.ts)
- [src/commands/agent.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent.test.ts)
- [src/commands/agent.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent.ts)
- [src/commands/agent/delivery.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/agent/delivery.ts)
- [src/commands/test-runtime-config-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/commands/test-runtime-config-helpers.ts)
- [src/config/sessions.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions.test.ts)
- [src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions.ts)
- [src/config/sessions/store.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/sessions/store.ts)
- [src/cron/isolated-agent.delivers-response-has-heartbeat-ok-but-includes.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.delivers-response-has-heartbeat-ok-but-includes.test.ts)
- [src/cron/isolated-agent.delivery.test-helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.delivery.test-helpers.ts)
- [src/cron/isolated-agent.direct-delivery-forum-topics.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.direct-delivery-forum-topics.test.ts)
- [src/cron/isolated-agent.mocks.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.mocks.ts)
- [src/cron/isolated-agent.skips-delivery-without-whatsapp-recipient-besteffortdeliver-true.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.skips-delivery-without-whatsapp-recipient-besteffortdeliver-true.test.ts)
- [src/cron/isolated-agent.test-harness.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.test-harness.ts)
- [src/cron/isolated-agent.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent.ts)
- [src/cron/isolated-agent/run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/isolated-agent/run.ts)
- [src/cron/run-log.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/run-log.test.ts)
- [src/cron/run-log.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/run-log.ts)
- [src/cron/service.delivery-plan.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.delivery-plan.test.ts)
- [src/cron/service.every-jobs-fire.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.every-jobs-fire.test.ts)
- [src/cron/service.issue-16156-list-skips-cron.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.issue-16156-list-skips-cron.test.ts)
- [src/cron/service.issue-regressions.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.issue-regressions.test.ts)
- [src/cron/service.persists-delivered-status.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.persists-delivered-status.test.ts)
- [src/cron/service.prevents-duplicate-timers.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.prevents-duplicate-timers.test.ts)
- [src/cron/service.read-ops-nonblocking.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.read-ops-nonblocking.test.ts)
- [src/cron/service.rearm-timer-when-running.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.rearm-timer-when-running.test.ts)
- [src/cron/service.restart-catchup.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.restart-catchup.test.ts)
- [src/cron/service.runs-one-shot-main-job-disables-it.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.runs-one-shot-main-job-disables-it.test.ts)
- [src/cron/service.skips-main-jobs-empty-systemevent-text.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.skips-main-jobs-empty-systemevent-text.test.ts)
- [src/cron/service.store-migration.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.store-migration.test.ts)
- [src/cron/service.store.migration.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.store.migration.test.ts)
- [src/cron/service.test-harness.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service.test-harness.ts)
- [src/cron/service/locked.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/locked.ts)
- [src/cron/service/ops.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/ops.ts)
- [src/cron/service/state.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/state.ts)
- [src/cron/service/timer.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/service/timer.ts)
- [src/cron/store.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/store.ts)
- [src/cron/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cron/types.ts)
- [src/discord/monitor.tool-result.test-harness.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.tool-result.test-harness.ts)
- [src/gateway/protocol/schema/cron.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/cron.ts)
- [src/gateway/server-cron.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-cron.ts)
- [src/infra/outbound/agent-delivery.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/agent-delivery.test.ts)
- [src/infra/outbound/agent-delivery.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/agent-delivery.ts)
- [src/infra/outbound/channel-resolution.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/channel-resolution.ts)
- [src/infra/outbound/targets.channel-resolution.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/targets.channel-resolution.test.ts)
- [src/utils/delivery-context.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/utils/delivery-context.test.ts)
- [src/utils/delivery-context.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/utils/delivery-context.ts)

This page covers how OpenClaw spawns subagent sessions via the `sessions_spawn` tool, the lifecycle of those sessions in the subagent registry, the announce flow that delivers results back to the requester, depth limiting, and the tool policy restrictions applied to subagent sessions.

For general session management concepts (session keys, transcripts, the session store), see [2.4](/openclaw/openclaw/2.4-session-management). For the tool policy pipeline that gates which tools a subagent receives, see [3.4](/openclaw/openclaw/3.4-tools). For ACP-runtime subagents (`runtime: "acp"`), which have a distinct harness path, see the ACP Agents documentation.

---

## Overview

A subagent is an agent run that executes inside its own isolated session, spawned at the request of a parent agent turn or a user command (`/subagents spawn`). When the subagent finishes, it **announces** its result back to the requester's chat channel through the announce flow.

Subagents enable:

- Parallel or background work without blocking the main agent turn
- Session-level isolation (separate context window, separate tool scope)
- Configurable nesting via depth limits

Each subagent session key has the form `agent:<agentId>:subagent:<uuid>`, which is detectable by `isSubagentSessionKey` in `src/routing/session-key.ts`.

---

## Spawn Entry Points

There are two ways a subagent is spawned:
Entry PointDescription`sessions_spawn` tool (agent call)The running agent calls the tool during a turn`/subagents spawn` slash commandA user issues the command directly in chat
Both ultimately call `spawnSubagentDirect` in `src/agents/subagent-spawn.ts`.

**Diagram: Spawn Entry Points to Code Entities**

```
src/agents/subagent-registry.ts

src/agents/subagent-spawn.ts

src/agents/tools/sessions-spawn-tool.ts

User / Agent Input

sessions_spawn tool call

/subagents spawn command

createSessionsSpawnTool()

execute() handler

spawnSubagentDirect()

SUBAGENT_SPAWN_MODES = run | session

subagentRuns Map
```

Sources: [src/agents/tools/sessions-spawn-tool.ts1-119](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/sessions-spawn-tool.ts#L1-L119)[src/agents/subagent-registry.ts48-55](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts#L48-L55)

---

## `sessions_spawn` Tool Parameters

Defined by `createSessionsSpawnTool` in `src/agents/tools/sessions-spawn-tool.ts`.
ParameterTypeDefaultDescription`task`string (required)—Task description sent as the subagent prompt`label`string?—Human-readable label for the session`runtime``"subagent"` | `"acp"``"subagent"`Which harness to use`agentId`string?caller's agentSpawn under a different agent identity`model`string?inheritedOverride model for this run`thinking`string?inheritedOverride thinking level`runTimeoutSeconds`number?`agents.defaults.subagents.runTimeoutSeconds` or `0`Abort the run after N seconds`thread`boolean`false`Request channel thread binding`mode``"run"` | `"session"``"run"` (or `"session"` when `thread: true`)One-shot vs. persistent session`cleanup``"delete"` | `"keep"``"keep"`Whether to delete the session after completion
`mode: "session"` requires `thread: true`. When `thread: true` and `mode` is omitted, mode defaults to `"session"`.

The tool returns `status: "accepted"` immediately — it is non-blocking.

Sources: [src/agents/tools/sessions-spawn-tool.ts11-119](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/sessions-spawn-tool.ts#L11-L119)

---

## Subagent Lifecycle

**Diagram: Subagent Run Lifecycle and Registry State Transitions**

```

```

Sources: [src/agents/subagent-registry.ts213-272](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts#L213-L272)[src/agents/subagent-registry.ts48-92](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts#L48-L92)

### Registry

The subagent registry is a module-level `Map` in `src/agents/subagent-registry.ts`:

```
subagentRuns: Map<runId, SubagentRunRecord>

```

`SubagentRunRecord` (from `src/agents/subagent-registry.types.ts`) tracks:

- `runId`, `childSessionKey`, `requesterSessionKey`
- `requesterOrigin: DeliveryContext`
- `startedAt`, `endedAt`
- `outcome: SubagentRunOutcome`
- `endedReason: SubagentLifecycleEndedReason`
- `cleanupHandled`, `cleanupCompletedAt`
- `announceRetryCount`

The registry persists its state to disk via `persistSubagentRunsToDisk` and restores it on startup via `restoreSubagentRunsFromDisk` (both in `src/agents/subagent-registry-state.ts`). This ensures subagent state survives Gateway restarts.

**Orphan reconciliation** runs on restore: if a run has no corresponding session entry in the session store, it is marked as an error and removed via `reconcileOrphanedRun`.

Sources: [src/agents/subagent-registry.ts48-209](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts#L48-L209)

### Lifecycle Event Handling

The registry subscribes to agent lifecycle events via `onAgentEvent` from `src/infra/agent-events.ts`. Key transitions:

- `lifecycle.start` — clears any pending deferred error for a run (handles model-fallback retries)
- `lifecycle.end` — calls `completeSubagentRun` with `SUBAGENT_ENDED_REASON_COMPLETE`
- `lifecycle.error` — schedules a deferred error via `schedulePendingLifecycleError` with a `LIFECYCLE_ERROR_RETRY_GRACE_MS` (15 s) grace period, allowing in-progress model retries to cancel it

Sources: [src/agents/subagent-registry.ts213-272](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts#L213-L272)

---

## Announce Flow

When a subagent run completes, `completeSubagentRun` calls `runSubagentAnnounceFlow` from `src/agents/subagent-announce.ts` to deliver the result back to the requester.

**Diagram: Announce Delivery Routing**

```
Delivery Paths

Route Resolution

completeSubagentRun()

runSubagentAnnounceFlow()

resolveSubagentCompletionOrigin()

createBoundDeliveryRouter().resolveDestination()

hookRunner.runSubagentDeliveryTarget()

requesterOrigin fallback

sendSubagentAnnounceDirectly()

maybeQueueSubagentAnnounce()

enqueueAnnounce()

sendAnnounce() → callGateway(agent)
```

Sources: [src/agents/subagent-announce.ts471-603](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts#L471-L603)[src/agents/subagent-announce.ts704-802](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts#L704-L802)

### Delivery Target Resolution

`resolveSubagentCompletionOrigin` in `src/agents/subagent-announce.ts` determines where to deliver the announce, in priority order:

1. **Bound route** — `createBoundDeliveryRouter().resolveDestination()` checks for a channel thread binding registered for `task_completion` events on the child session. Returns `routeMode: "bound"`.
2. **Hook** — If a `subagent_delivery_target` hook is registered (via `getGlobalHookRunner()`), its result is used. Returns `routeMode: "hook"`.
3. **Fallback** — The `requesterOrigin` captured at spawn time is used. Returns `routeMode: "fallback"`.

### Delivery vs. Queue

After resolving the target, the announce is either sent directly or queued:

- **Queue path** (`maybeQueueSubagentAnnounce`): if the requester session is currently active (an embedded run is in progress), the message is routed through `enqueueAnnounce` using the queue settings from `resolveQueueSettings`. The queue handles debounce, steer, and collect modes.
- **Direct path** (`sendSubagentAnnounceDirectly`): calls the Gateway's `agent` method with the completion message, using a stable idempotency key built by `buildAnnounceIdempotencyKey`.

### Transient Retry

Direct delivery retries on transient failures using `runAnnounceDeliveryWithRetry` with delays of `[5_000, 10_000, 20_000]` ms (in production). Errors matching patterns like `econnreset`, `gateway not connected`, or `UNAVAILABLE` are considered transient. Errors like `bot was blocked`, `chat not found`, or `unsupported channel` are permanent and not retried.

The registry itself also retries announce delivery up to `MAX_ANNOUNCE_RETRY_COUNT = 3` times with exponential backoff (`MIN_ANNOUNCE_RETRY_DELAY_MS = 1_000`, `MAX_ANNOUNCE_RETRY_DELAY_MS = 8_000`). Entries older than `ANNOUNCE_EXPIRY_MS = 5 minutes` are force-expired.

Sources: [src/agents/subagent-announce.ts117-201](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts#L117-L201)[src/agents/subagent-registry.ts56-92](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts#L56-L92)

### Completion Message Format

`buildCompletionDeliveryMessage` in `src/agents/subagent-announce.ts` formats the announcement:

```
✅ Subagent <name> finished      ← or ❌ failed / ⏱️ timed out

<output text from subagent>

Stats: runtime 12s • tokens 4.2k (in 3.1k / out 1.1k)

```

For `mode: "session"`, the status line reads "completed this task (session remains active)".

The `Result` text comes from the latest assistant reply in the subagent transcript, with a `toolResult` fallback if the assistant reply is empty (`readLatestAssistantReply` → `readLatestSubagentOutput`).

If the output text is the special `SILENT_REPLY_TOKEN` or matches `isAnnounceSkip`, the completion message is suppressed.

Sources: [src/agents/subagent-announce.ts68-98](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts#L68-L98)[src/agents/subagent-announce.ts292-334](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts#L292-L334)

---

## Tool Policy for Subagents

Subagent sessions automatically receive a restricted tool policy compared to the parent agent. This is applied in `createOpenClawCodingTools` in `src/agents/pi-tools.ts`.

**Diagram: Subagent Tool Policy Resolution**

```
is subagent

sessionKey

isSubagentSessionKey()

getSubagentDepthFromSessionStore()

resolveSubagentToolPolicy()

subagentPolicy

applyToolPolicyPipeline()

filtered tool list
```

Sources: [src/agents/pi-tools.ts285-301](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L285-L301)[src/agents/pi-tools.ts502-522](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L502-L522)

The subagent policy (`resolveSubagentToolPolicy` in `src/agents/pi-tools.policy.ts`) is applied as the final step in the tool policy pipeline (`applyToolPolicyPipeline`), after all global, agent, group, and sandbox policies. This means it can only further restrict the tool set, never expand it.

By default, subagents do **not** receive session tools (`sessions_spawn`, `sessions_send`, etc.) unless explicitly allowed, preventing runaway recursive spawning.

---

## Depth Limits

OpenClaw tracks spawn depth to prevent infinite recursion.

- The constant `DEFAULT_SUBAGENT_MAX_SPAWN_DEPTH` is defined in `src/config/agent-limits.ts`.
- Depth is read from the session store via `getSubagentDepthFromSessionStore` in `src/agents/subagent-depth.ts`.
- `resolveSubagentToolPolicy` receives the current depth and can apply increasingly restrictive policies at deeper levels.
- Configurable via `agents.defaults.subagents.maxSpawnDepth` in `openclaw.json`.

The depth of a session is encoded in its session store entry, not in the session key itself. The session key prefix `agent:<agentId>:subagent:` identifies it as a subagent session; the depth is a separate persisted field.

Sources: [src/agents/pi-tools.ts285-291](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/pi-tools.ts#L285-L291)

---

## Configuration Reference

All subagent-relevant config lives under `agents.defaults.subagents` (and per-agent in `agents.list[].subagents`):
FieldDescription`model`Default model for spawned subagents (caller's model used if unset)`thinking`Default thinking level for spawned subagents`runTimeoutSeconds`Default timeout for subagent runs (0 = no timeout)`maxSpawnDepth`Maximum nesting depth allowed`announceTimeoutMs`Timeout for the announce gateway call (default 60 s)
Individual `sessions_spawn` tool call parameters override these defaults for a single run. For example, an explicit `model` in the tool call takes precedence over `agents.defaults.subagents.model`.

Sources: [src/agents/subagent-announce.ts60-66](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts#L60-L66)[docs/tools/subagents.md74-91](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/subagents.md#L74-L91)

---

## Session Key and Identity

A subagent session key takes the form:

```
agent:<agentId>:subagent:<uuid>

```

This prefix is recognized by `isSubagentSessionKey` in `src/routing/session-key.ts` and used to:

- Apply the subagent tool policy (see above)
- Determine spawn depth from the session store
- Route announces to the correct requester

The `requesterSessionKey` is stored in the `SubagentRunRecord` and passed through the entire announce flow. If the requester is itself a subagent (`requesterDepth >= 1`), the announce is delivered to the Gateway without explicit channel/to routing (since the requester is an internal session, not a messaging channel).

Sources: [src/agents/subagent-announce.ts572-603](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts#L572-L603)[src/agents/subagent-registry.ts1-48](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-registry.ts#L1-L48)

---

## Thread-Bound Sessions (`mode: "session"`)

When `thread: true` is passed to `sessions_spawn`, the subagent session can be bound to a channel thread so that follow-up messages in that thread route to the same subagent session rather than spawning a new one.

Currently supported only on **Discord**. Relevant config keys:
Config KeyDescription`channels.discord.threadBindings.enabled`Master toggle`channels.discord.threadBindings.idleHours`Idle timeout for thread-bound sessions`channels.discord.threadBindings.maxAgeHours`Maximum age before the binding expires`channels.discord.threadBindings.spawnSubagentSessions`Allow spawning into thread-bound sessions
The `createBoundDeliveryRouter().resolveDestination()` call in `resolveSubagentCompletionOrigin` uses the thread binding registry to route completion announces to the correct thread.

Sources: [docs/tools/subagents.md93-99](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/subagents.md#L93-L99)[src/agents/subagent-announce.ts471-570](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/subagent-announce.ts#L471-L570)

---

# Commands-&-Auto-Reply

# Commands & Auto-Reply
Relevant source files
- [docs/tools/slash-commands.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/slash-commands.md)
- [src/agents/tools/session-status-tool.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/tools/session-status-tool.ts)
- [src/auto-reply/command-detection.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/command-detection.ts)
- [src/auto-reply/commands-args.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-args.ts)
- [src/auto-reply/commands-registry.data.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-registry.data.ts)
- [src/auto-reply/commands-registry.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-registry.test.ts)
- [src/auto-reply/commands-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-registry.ts)
- [src/auto-reply/group-activation.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/group-activation.ts)
- [src/auto-reply/reply.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply.ts)
- [src/auto-reply/reply/commands-core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands-core.ts)
- [src/auto-reply/reply/commands-info.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands-info.ts)
- [src/auto-reply/reply/commands-status.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands-status.ts)
- [src/auto-reply/reply/commands.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands.test.ts)
- [src/auto-reply/reply/commands.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/commands.ts)
- [src/auto-reply/reply/directive-handling.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/reply/directive-handling.ts)
- [src/auto-reply/send-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/send-policy.ts)
- [src/auto-reply/status.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/status.test.ts)
- [src/auto-reply/status.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/status.ts)
- [src/auto-reply/templating.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/templating.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.ts)
- [src/discord/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.ts)
- [src/imessage/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor.ts)
- [src/signal/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor.ts)
- [src/slack/monitor.tool-result.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor.tool-result.test.ts)
- [src/slack/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor.ts)
- [src/telegram/bot.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.ts)
- [src/web/auto-reply.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/auto-reply.ts)
- [src/web/inbound.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/inbound.test.ts)
- [src/web/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/inbound.ts)
- [src/web/vcard.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/vcard.ts)

This page documents the auto-reply command processing system: how inbound messages are inspected for slash commands and inline directives, how those are dispatched to handlers, how status messages are assembled, and how group activation and send policies gate replies in group chats.

This page does **not** cover the agent execution pipeline that runs after commands clear (see [3.1](/openclaw/openclaw/3.1-agent-execution-pipeline)), channel-specific message ingestion (see [4](/openclaw/openclaw/4-channels)), or session lifecycle management (see [2.4](/openclaw/openclaw/2.4-session-management)).

---

## Architecture Overview

Every inbound message passes through command detection and directive extraction before the model is invoked. Two major paths exist:

1. **Standalone command messages** (`/status`, `/reset`, etc.) are handled entirely without invoking the model — a "fast path" that bypasses the queue.
2. **Normal chat messages** may contain embedded inline directives (`/think high`) or inline shortcuts (`hey /status`) that are extracted, with the remainder forwarded to the agent.

The top-level entry point is `getReplyFromConfig()` in `src/auto-reply/reply/get-reply.ts`.

**Command Processing Pipeline**

```
no /! tokens

tokens found

yes: standalone cmd

no: has non-cmd text

yes

no

Inbound Message (MsgContext)

hasInlineCommandTokens()

Normal agent flow

shouldComputeCommandAuthorized()

finalizeInboundContext()
CommandAuthorized = true|false

getReplyFromConfig()
src/auto-reply/reply/get-reply.ts

isControlCommandMessage()?

Fast path: bypass queue + model
handleCommands()
src/auto-reply/reply/commands-core.ts

parseInlineDirectives()
src/auto-reply/reply/directive-handling.parse.ts

isDirectiveOnly() AND authorized?

persistInlineDirectives()
+ formatDirectiveAck()
src/auto-reply/reply/directive-handling.persist.ts

Apply directives as inline hints
for this turn only
→ runEmbeddedPiAgent()

CommandHandler chain
(HANDLERS array in commands-core.ts)

CommandHandlerResult
{shouldContinue, reply}

Reply to sender
```

Sources: `src/auto-reply/command-detection.ts`, `src/auto-reply/reply/directive-handling.ts`, `src/auto-reply/reply/commands-core.ts`

---

## Message Classification & Detection

Before the auto-reply system runs, channel monitors call lightweight detection functions to decide whether to compute authorization.
FunctionPurpose`hasInlineCommandTokens()`Coarse regex check (`/(?:^`isControlCommandMessage()`Returns `true` if the whole message is a recognized command or abort trigger`hasControlCommand()`Returns `true` if text starts with a recognized command alias`shouldComputeCommandAuthorized()`Combines the two above; used by channels to decide if auth is needed
All four functions are in `src/auto-reply/command-detection.ts`.

`isControlCommandMessage()` calls both `hasControlCommand()` (registry lookup) and `isAbortTrigger()` from `src/auto-reply/reply/abort.ts` to catch stop-words like "stop".

---

## Command Registry

All slash commands are defined in `src/auto-reply/commands-registry.data.ts` and exposed through `src/auto-reply/commands-registry.ts`.

### `ChatCommandDefinition` structure
FieldTypePurpose`key``string`Internal identifier (e.g., `"status"`, `"dock:telegram"`)`nativeName``string?`Name registered natively on Discord/Telegram/Slack`textAliases``string[]`Text aliases (e.g., `["/think", "/thinking", "/t"]`)`scope``"text" | "native" | "both"`Where the command is available`acceptsArgs``boolean`Whether the command takes trailing arguments`args``CommandArgDefinition[]?`Typed argument definitions for structured parsing`argsParsing``"positional" | "none"`How args are parsed from raw text`argsMenu``"auto" | {arg, title}?`Spec for interactive button menus on Telegram/Slack`category``CommandCategory`Display grouping for `/commands` output
### Key registry functions
FunctionPurpose`getChatCommands()`Returns the full cached `ChatCommandDefinition[]``listChatCommands()`Returns commands, optionally appending skill command definitions`listChatCommandsForConfig()`Filters by config flags (`bash`, `config`, `debug`)`listNativeCommandSpecs()`Returns `NativeCommandSpec[]` for native registration`normalizeCommandBody()`Resolves colon syntax, bot-username suffix, alias canonicalization`getCommandDetection()`Returns pre-built `{exact: Set, regex: RegExp}` for fast lookup`findCommandByNativeName()`Looks up command by its native name (provider-aware)`shouldHandleTextCommands()`Returns `true` if text commands should run on a given surface
### Text command normalization

`normalizeCommandBody()` handles these transformations in order:

1. **Colon syntax**: `/think: high` → `/think high`
2. **Telegram bot suffix**: `/help@mybot` → `/help` (only when `botUsername` matches)
3. **Alias resolution**: `/thinking` → `/think`, `/dock_telegram` → `/dock-telegram`

### Native name overrides

Some providers reserve names. These overrides are applied by `resolveNativeName()`[src/auto-reply/commands-registry.ts133-144](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-registry.ts#L133-L144):
ProviderCommand keyRegistered native name`discord``tts``voice` (Discord reserves `/tts`)`slack``status``agentstatus` (Slack reserves `/status`)
### Command categories

The `CATEGORY_ORDER` array in `src/auto-reply/status.ts` defines display ordering: `session` → `options` → `status` → `management` → `media` → `tools` → `docks`.

Sources: `src/auto-reply/commands-registry.ts`, `src/auto-reply/commands-registry.data.ts`

---

## Command Handlers

`handleCommands()` in `src/auto-reply/reply/commands-core.ts` is the main dispatcher. It iterates a `HANDLERS` array of `CommandHandler` functions, returning the first non-null `CommandHandlerResult`.

**Command Dispatcher → Handler Source File Map**

```
handleCommands()
commands-core.ts

commands-info.ts
/help, /commands, /status,
/whoami, /context, /export-session

commands-session.ts
/stop, /restart, /new, /reset,
/activation, /send, /usage,
abort trigger

commands-compact.ts
/compact

commands-models.ts
/model, /models

commands-bash.ts
/bash, !cmd, !poll, !stop

commands-config.ts
/config, /debug

commands-allowlist.ts
/allowlist

commands-approve.ts
/approve

commands-subagents.ts
/subagents, /kill, /steer, /focus

commands-tts.ts
/tts

commands-acp.ts
/acp

commands-plugin.ts
plugin-registered commands
```

Sources: `src/auto-reply/reply/commands-core.ts`, `src/auto-reply/reply/commands-info.ts`

### `CommandContext` and `HandleCommandsParams`

Handlers receive a `HandleCommandsParams` object. Key fields on the nested `CommandContext`:
FieldPurpose`commandBodyNormalized`Normalized command string (e.g., `/status`)`isAuthorizedSender`Whether sender has command privileges`senderId`Sender identifier string`channel`Channel type (e.g., `"telegram"`, `"discord"`)`surface`Provider surface label`resetHookTriggered`Tracks whether a reset hook has already fired
`HandleCommandsParams` also carries: `cfg` (`OpenClawConfig`), `ctx` (`MsgContext`), `sessionEntry`, `elevated` (access check result), and resolved directive levels (`thinkLevel`, `verboseLevel`, etc.).

`CommandHandlerResult` is `{ shouldContinue: boolean; reply?: ReplyPayload }`. Returning `null` means "this handler doesn't apply; try the next one."

---

## Directives

Directives are tokens embedded in messages that modify agent behavior. They differ from commands in that they can appear inside a normal chat message rather than standing alone.

### Recognized directives
DirectiveExtractorSource file`/think <level>``extractThinkDirective()``src/auto-reply/reply/directives.ts``/verbose <level>``extractVerboseDirective()``src/auto-reply/reply/directives.ts``/elevated <level>``extractElevatedDirective()``src/auto-reply/reply/directives.ts``/reasoning <mode>``extractReasoningDirective()``src/auto-reply/reply/directives.ts``/exec <params>``extractExecDirective()``src/auto-reply/reply/exec.ts``/queue <mode>``extractQueueDirective()``src/auto-reply/reply/queue.ts``/model <ref>`handled by `handleModelsCommand``src/auto-reply/reply/commands-models.ts`
All extractors are re-exported from `src/auto-reply/reply.ts`.

### Directive vs. directive-only behavior
Message typeAuthorized senderBehaviorDirective-only (e.g., `/think high`)Yes`persistInlineDirectives()` → session updated, `formatDirectiveAck()` replyDirective-onlyNoSilently ignoredMixed (text + directive)YesDirectives applied as inline hints for this turn only; not persistedMixedNoDirectives treated as plain text; passed to model
**Directive Extraction and Application Flow**

```
yes AND authorized

no: has non-directive text

unauthorized sender

Raw message text

parseInlineDirectives()
directive-handling.parse.ts
→ InlineDirectives object

Remaining text
(directives stripped)

isDirectiveOnly()
(only directive tokens remain)

persistInlineDirectives()
directive-handling.persist.ts
→ updateSessionStore()

formatDirectiveAck()
directive-handling.shared.ts
→ acknowledgement reply

Directives applied as
per-turn overrides to agent call
(not persisted to session)

runEmbeddedPiAgent()
with overridden levels

Entire message passed
to model as plain text
```

Sources: `src/auto-reply/reply/directive-handling.ts`, `src/auto-reply/reply.ts`

### Inline shortcuts

A subset of commands can appear embedded in a normal message and are stripped before the model sees the rest. Handled by `applyInlineDirectivesFastLane()` from `src/auto-reply/reply/directive-handling.ts`.
Inline shortcutEffect`/help`Sends help reply; remaining text continues to agent`/commands`Sends command list; remaining text continues to agent`/status`Sends status card; remaining text continues to agent`/whoami` / `/id`Sends sender ID; remaining text continues to agent
These only activate for **authorized senders** and bypass mention requirements in group chats.

---

## Authorization

`CommandAuthorized` in `FinalizedMsgContext` is always a `boolean`, default-deny — see `src/auto-reply/templating.ts`[src/auto-reply/templating.ts155-161](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/templating.ts#L155-L161)

Resolution priority:

1. **`commands.allowFrom`** — if configured, it is the *only* authorization source. Channel allowlists and pairing are ignored.
2. **Channel allowlists + pairing** — standard source when `commands.allowFrom` is not set.
3. **`commands.useAccessGroups`** (default `true`) — enforces standard allow/policy checks.

For unauthorized senders:

- Standalone command messages are **silently ignored** (no reply sent).
- Inline directives in mixed messages are treated as **plain text** passed to the model.

Three commands (`bash`, `config`, `debug`) additionally require their respective config flags to be explicitly `true` as own-properties (not inherited from a prototype chain) — this is enforced in `isCommandFlagEnabled()` and checked by `listChatCommandsForConfig()`[src/auto-reply/commands-registry.ts98-109](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-registry.ts#L98-L109)

---

## Status Messages

The `/status` command produces a detailed status card via `buildStatusMessage()` in `src/auto-reply/status.ts`. The same function is used by the `session_status` agent tool.

### Status card field breakdown

```
🦞 OpenClaw <version> (<commit>)
<timeLine>
🧠 Model: <provider>/<model> · 🔑 <authMode> [· channel override]
↪️ Fallback: <model> · 🔑 <auth> (<reason>)       ← only when active
🧮 Tokens: <input>k in / <output>k out  [· 💵 Cost: $X.XX]
🗄️ Cache: <hit>% hit · <cached>k cached, <new>k new
📚 Context: <total>/<window> (<pct>%) · 🧹 Compactions: N
📎 Media: <per-capability decisions>
<usageLine>                                         ← provider quota window
🧵 Session: <sessionKey> · updated Xm ago
🤖 Subagents: N active [· done: M]
⚙️ Runtime: <mode> · Think: <level> [· verbose] [· elevated]
🔊 Voice: <mode> · provider=<p> · limit=<n> · summary=<on|off>
👥 Activation: mention|always  · 🪢 Queue: <mode> [(depth N)]

```

`buildStatusReply()` in `src/auto-reply/reply/commands-status.ts` orchestrates this by:

1. Resolving model auth via `resolveModelAuthLabel()`
2. Loading provider quota via `loadProviderUsageSummary()`
3. Resolving queue settings via `resolveQueueSettings()`
4. Listing active subagents via `listSubagentRunsForRequester()`
5. Resolving group activation from session entry
6. Calling `buildStatusMessage()` with all resolved data

### Help and command listing
FunctionCommandNotes`buildHelpMessage()``/help`Compact summary; conditionally includes `/config` and `/debug``buildCommandsMessage()``/commands`Full list grouped by category; includes plugin commands`buildCommandsMessagePaginated()``/commands` on TelegramPaginates at 8 items/page; returns `{text, totalPages, currentPage, hasNext, hasPrev}`
Plugin commands are fetched via `listPluginCommands()` from `src/plugins/commands.ts` and appended under a "Plugins" category.

Sources: `src/auto-reply/status.ts`, `src/auto-reply/reply/commands-status.ts`

---

## Group Activation Policies

In group chats, the agent's responsiveness depends on its **group activation** setting per session.
ModeBehavior`mention` (default)Agent responds only when explicitly mentioned`always`Agent responds to every message in the group
**Group Activation Resolution**

```
entry.groupActivation = always

entry.groupActivation = mention

not set

requireMention = true

requireMention = false

yes

no

yes

no

Group message received

resolveGroupActivation()
Load from sessions.json
(session store entry)

requireMention = false

requireMention = true

resolveChannelGroupRequireMention()
from openclaw.json + opts.requireMention

Apply requireMention

Was agent mentioned?

Accept message

Is command-only
from authorized sender?

Skip: no reply
```

`/activation mention|always` persists the setting to the session store. Parsing is done by `parseActivationCommand()` in `src/auto-reply/group-activation.ts`. Handler: `handleActivationCommand` in `src/auto-reply/reply/commands-session.ts`.

The group policy config (`groupPolicy`, `requireMention`) is resolved via `resolveChannelGroupPolicy()` and `resolveChannelGroupRequireMention()` in `src/config/group-policy.ts`.

Sources: `src/auto-reply/group-activation.ts`, `src/telegram/bot.ts`, `src/config/group-policy.ts`

---

## Send Policies

The `/send on|off|inherit` command (owner-only) controls whether the agent's replies are delivered for a conversation.

`parseSendPolicyCommand()` in `src/auto-reply/send-policy.ts` parses the command. The resulting `SendPolicyOverride` is stored in the session and read by the delivery layer via `resolveSendPolicy()` in `src/sessions/send-policy.ts`.
ValueMeaning`on` / `allow`Force replies to be sent`off` / `deny`Suppress all replies`inherit` / `default` / `reset`Defer to channel/global defaults
---

## Configuration Reference

Commands are configured under the `commands` key in `openclaw.json`. See [2.3.1](/openclaw/openclaw/2.3.1-configuration-reference) for the complete config field reference.
KeyDefaultPurpose`commands.text``true`Parse `/...` in chat messages (always on for platforms without native support)`commands.native``"auto"`Register native commands on Discord/Telegram (auto = on for those providers)`commands.nativeSkills``"auto"`Register skill commands natively`commands.bash``false`Enable `! <cmd>` / `/bash <cmd>``commands.bashForegroundMs``2000`ms to wait before switching bash to background`commands.config``false`Enable `/config` (reads/writes `openclaw.json`)`commands.debug``false`Enable `/debug` (runtime-only overrides)`commands.restart``true`Enable `/restart``commands.allowFrom`(none)Per-provider sender allowlist; overrides all other auth sources when set`commands.useAccessGroups``true`Enforce channel allowlists/policies when `allowFrom` is not set
`shouldHandleTextCommands()`[src/auto-reply/commands-registry.ts378-420](https://github.com/openclaw/openclaw/blob/8090cb4c/src/auto-reply/commands-registry.ts#L378-L420) implements surface gating: platforms without native command support (WhatsApp, Signal, iMessage, Google Chat, MS Teams, WebChat) always process text commands regardless of the `commands.text` setting.

Sources: `docs/tools/slash-commands.md`, `src/auto-reply/commands-registry.ts`, `src/config/commands.ts`

---

# Channels

# Channels
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/discord.md)
- [docs/channels/imessage.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/imessage.md)
- [docs/channels/matrix.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/matrix.md)
- [docs/channels/msteams.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/msteams.md)
- [docs/channels/nostr.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/nostr.md)
- [docs/channels/signal.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/signal.md)
- [docs/channels/slack.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/slack.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/telegram.md)
- [docs/channels/twitch.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/twitch.md)
- [docs/channels/whatsapp.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/whatsapp.md)
- [docs/channels/zalo.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/zalo.md)
- [extensions/feishu/src/bot.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/feishu/src/bot.ts)
- [extensions/googlechat/src/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/googlechat/src/monitor.ts)
- [extensions/irc/src/inbound.policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/irc/src/inbound.policy.test.ts)
- [extensions/irc/src/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/irc/src/inbound.ts)
- [extensions/matrix/src/matrix/monitor/handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/matrix/src/matrix/monitor/handler.ts)
- [extensions/mattermost/src/mattermost/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/mattermost/src/mattermost/monitor.ts)
- [extensions/msteams/src/monitor-handler/message-handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/monitor-handler/message-handler.ts)
- [extensions/msteams/src/reply-dispatcher.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/reply-dispatcher.ts)
- [extensions/nextcloud-talk/src/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/nextcloud-talk/src/inbound.ts)
- [extensions/zalo/src/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/zalo/src/monitor.ts)
- [extensions/zalouser/src/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/zalouser/src/monitor.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.ts)
- [src/channels/typing.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/typing.test.ts)
- [src/channels/typing.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/typing.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.discord.ts)
- [src/config/types.slack.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.slack.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts)
- [src/discord/components-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components-registry.ts)
- [src/discord/components.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.test.ts)
- [src/discord/components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.test.ts)
- [src/discord/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.ts)
- [src/discord/monitor/agent-components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/agent-components.ts)
- [src/discord/monitor/allow-list.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/allow-list.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/listeners.ts)
- [src/discord/monitor/message-handler.preflight.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts)
- [src/discord/monitor/message-handler.process.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.process.ts)
- [src/discord/monitor/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/monitor.test.ts)
- [src/discord/monitor/native-command.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/native-command.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts)
- [src/imessage/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor.ts)
- [src/imessage/monitor/monitor-provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor/monitor-provider.ts)
- [src/plugin-sdk/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts)
- [src/plugins/runtime/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/runtime/index.ts)
- [src/plugins/runtime/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/runtime/types.ts)
- [src/signal/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor.ts)
- [src/signal/monitor/event-handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor/event-handler.ts)
- [src/slack/monitor.tool-result.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor.tool-result.test.ts)
- [src/slack/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor.ts)
- [src/slack/monitor/message-handler/dispatch.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/message-handler/dispatch.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/provider.ts)
- [src/telegram/bot.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.ts)
- [src/web/auto-reply.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/auto-reply.ts)
- [src/web/inbound.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/inbound.test.ts)
- [src/web/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/inbound.ts)
- [src/web/vcard.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/vcard.ts)

This page covers how OpenClaw connects to external messaging platforms: what the monitor pattern is, how inbound messages flow from a platform to the agent, how replies are delivered back, and how access control is enforced. For details on building a new channel plugin see [Channel Architecture & Plugin SDK](/openclaw/openclaw/4.1-channel-architecture-and-plugin-sdk). For Telegram-specific detail see [Telegram](/openclaw/openclaw/4.2-telegram). For Discord-specific detail see [Discord](/openclaw/openclaw/4.3-discord). For all remaining supported platforms see [Other Channels](/openclaw/openclaw/4.4-other-channels).

---

## Supported Platforms

Channels are either **core** (built into the main `src/` tree) or **extension** (separate packages under `extensions/`).
PlatformMonitor Entry PointConfig KeyNotesTelegram`createTelegramBot`[`src/telegram/bot.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/telegram/bot.ts`)`channels.telegram`grammY, long-poll or webhookDiscord`monitorDiscordProvider`[`src/discord/monitor/provider.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/provider.ts`)`channels.discord`@buape/carbon gatewaySlack`monitorSlackProvider`[`src/slack/monitor/provider.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/slack/monitor/provider.ts`)`channels.slack`Socket Mode or HTTPSignal`monitorSignalProvider`[`src/signal/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/signal/monitor.ts`)`channels.signal`signal-cli JSON-RPC / SSEiMessage`monitorIMessageProvider`[`src/imessage/monitor/monitor-provider.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/imessage/monitor/monitor-provider.ts`)`channels.imessage``imsg` CLI, macOS onlyWhatsApp`monitorWebInbox`[`src/web/inbound.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/web/inbound.ts`)`channels.whatsapp`Baileys / web protocolMatrix`MatrixMonitorHandlerParams`[`extensions/matrix/src/matrix/monitor/handler.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`extensions/matrix/src/matrix/monitor/handler.ts`)`channels.matrix`ExtensionFeishu`handleFeishuMessageEvent`[`extensions/feishu/src/bot.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`extensions/feishu/src/bot.ts`)`channels.feishu`ExtensionMattermost`monitorMattermostProvider`[`extensions/mattermost/src/mattermost/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`extensions/mattermost/src/mattermost/monitor.ts`)`channels.mattermost`ExtensionMS Teams(handler) [`extensions/msteams/src/monitor-handler/message-handler.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`extensions/msteams/src/monitor-handler/message-handler.ts`)`channels.msteams`ExtensionZalo(monitor) [`extensions/zalo/src/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`extensions/zalo/src/monitor.ts`)`channels.zalo`ExtensionGoogle Chat(schema) [`src/config/zod-schema.providers-core.ts610-695](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/config/zod-schema.providers-core.ts#L610-L695)`channels.googlechat`Webhook-basedLINE`resolveLineAccount`[`src/plugin-sdk/index.ts562-590](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/plugin-sdk/index.ts#L562-L590)`channels.line`ExtensionBlueBubbles(plugin)`channels.bluebubbles`ExtensionIRC(plugin)`channels.irc`ExtensionNextcloud Talk(plugin)`channels.nextcloud`Extension
Sources: [`src/plugin-sdk/index.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/plugin-sdk/index.ts`)[`src/config/zod-schema.providers-core.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/config/zod-schema.providers-core.ts`)[`src/discord/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor.ts`)[`src/slack/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/slack/monitor.ts`)[`src/signal/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/signal/monitor.ts`)[`src/imessage/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/imessage/monitor.ts`)[`src/web/inbound.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/web/inbound.ts`)

---

## The Monitor Pattern

Every channel integration runs as a long-lived async function (the **monitor**) that holds a connection to the platform — a WebSocket, long-poll loop, SSE stream, or incoming webhook listener. The monitor receives raw platform events, performs access control, builds a normalized inbound context, and hands off to `dispatchInboundMessage`.

The Gateway starts each enabled channel's monitor when the gateway process starts. The monitor owns its connection lifecycle; if the connection drops it reconnects (usually with backoff).

**Channel monitor entry points and their dispatch target**

```
Extension Channels

Core Channels

createTelegramBot
(src/telegram/bot.ts)

monitorDiscordProvider
(src/discord/monitor/provider.ts)

monitorSlackProvider
(src/slack/monitor/provider.ts)

monitorSignalProvider
(src/signal/monitor.ts)

monitorIMessageProvider
(src/imessage/monitor/monitor-provider.ts)

monitorWebInbox
(src/web/inbound.ts)

Matrix handler
(extensions/matrix/)

Feishu bot
(extensions/feishu/src/bot.ts)

Mattermost monitor
(extensions/mattermost/)

MSTeams handler
(extensions/msteams/)

dispatchInboundMessage
(src/auto-reply/dispatch.js)
```

Sources: [`src/telegram/bot.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/telegram/bot.ts`)[`src/discord/monitor/provider.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/provider.ts`)[`src/slack/monitor/provider.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/slack/monitor/provider.ts`)[`src/signal/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/signal/monitor.ts`)[`src/imessage/monitor/monitor-provider.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/imessage/monitor/monitor-provider.ts`)[`src/web/inbound.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/web/inbound.ts`)[`extensions/feishu/src/bot.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`extensions/feishu/src/bot.ts`)[`extensions/mattermost/src/mattermost/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`extensions/mattermost/src/mattermost/monitor.ts`)[`extensions/matrix/src/matrix/monitor/handler.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`extensions/matrix/src/matrix/monitor/handler.ts`)

---

## Inbound Message Flow

Once a raw platform event is received, each monitor performs the following steps before passing the message to the agent:

**Inbound processing pipeline (with code entity names)**

```
allowed

blocked

Raw platform event
(WebSocket / SSE / poll / webhook)

Deduplication
(createTelegramUpdateDedupe / createDedupeCache)

Access control
(resolveDmGroupAccessWithLists /
isDiscordGroupAllowedByPolicy)

Mention gating
(resolveMentionGatingWithBypass)

Media resolution
(resolveMediaList / resolveFeishuMediaList)

Envelope formatting
(formatInboundEnvelope)

History context
(buildPendingHistoryContextFromMap)

Session recording
(recordInboundSession)

dispatchInboundMessage
(src/auto-reply/dispatch.js)

ACK reaction
(resolveAckReaction / shouldAckReaction)

Typing indicator
(createTypingCallbacks)

Reply delivery
(createReplyDispatcherWithTyping)

drop / pairing challenge
```

Sources: [`src/discord/monitor/message-handler.process.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/message-handler.process.ts`)[`src/signal/monitor/event-handler.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/signal/monitor/event-handler.ts`)[`src/imessage/monitor/monitor-provider.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/imessage/monitor/monitor-provider.ts`)[`extensions/feishu/src/bot.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`extensions/feishu/src/bot.ts`)[`src/channels/typing.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/channels/typing.ts`)

### Key Pipeline Functions
StepFunctionLocationEnvelope format`formatInboundEnvelope``src/auto-reply/envelope.js`History context`buildPendingHistoryContextFromMap``src/auto-reply/reply/history.js`Session recording`recordInboundSession``src/channels/session.js`Inbound dispatch`dispatchInboundMessage``src/auto-reply/dispatch.js`Reply dispatcher`createReplyDispatcherWithTyping``src/auto-reply/reply/reply-dispatcher.js`Typing callbacks`createTypingCallbacks``src/channels/typing.ts`ACK reaction`resolveAckReaction`, `shouldAckReaction``src/channels/ack-reactions.js`Session key build`buildAgentSessionKey``src/routing/resolve-route.js`
Sources: [`src/discord/monitor/message-handler.process.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/message-handler.process.ts#L1-L50)[`src/signal/monitor/event-handler.ts1-55](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/signal/monitor/event-handler.ts#L1-L55)[`src/channels/typing.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/channels/typing.ts`)

---

## Session Key Format

Each inbound message is assigned a **session key** that determines which agent conversation the message belongs to. The format varies by context:
Chat TypeSession Key PatternDM (default scope)`agent:<agentId>:main`DM (per-user scope)`agent:<agentId>:<channel>:user:<userId>`Group chat`agent:<agentId>:<channel>:group:<groupId>`Channel (Discord/Slack)`agent:<agentId>:<channel>:channel:<channelId>`Telegram forum topic`agent:<agentId>:telegram:group:<chatId>:topic:<threadId>`
Session keys are built by `buildAgentSessionKey` in `src/routing/resolve-route.js` and resolved by `resolveAgentRoute`.

Sources: [`src/discord/monitor/message-handler.process.ts282-297](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/message-handler.process.ts#L282-L297)[`src/telegram/bot.ts66-114](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/telegram/bot.ts#L66-L114)

---

## Outbound Reply Delivery

After the agent produces a reply, `createReplyDispatcherWithTyping` drives delivery:

1. Typing indicator starts (channel-specific, e.g. `sendTyping` for Discord, `sendChatAction` for Telegram).
2. Streaming partial replies sent as draft edits if the channel and config support it (`streaming` mode).
3. Final reply chunked by `chunkTextForOutbound` / per-channel chunker (respects `textChunkLimit`, `chunkMode`).
4. Media attachments delivered (images, audio, video, documents).
5. ACK reaction removed if `messages.removeAckAfterReply` is set.

Delivery is channel-specific:

- **Telegram**: `bot.api.sendMessage`, draft editing via `sendChatAction` handler [`src/telegram/bot.ts356-364](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/telegram/bot.ts#L356-L364)
- **Discord**: `deliverDiscordReply`[`src/discord/monitor/message-handler.process.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/message-handler.process.ts`) draft stream via `createDiscordDraftStream`
- **Slack**: `deliverReplies` in `src/slack/monitor/replies.js`, with `startSlackStream` / `stopSlackStream` for streaming
- **Signal**: `sendMessageSignal`[`src/signal/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/signal/monitor.ts`)
- **iMessage**: `sendMessageIMessage` in `src/imessage/send.js`

Sources: [`src/discord/monitor/message-handler.process.ts400-620](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/message-handler.process.ts#L400-L620)[`src/slack/monitor/message-handler/dispatch.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/slack/monitor/message-handler/dispatch.ts`)[`src/signal/monitor/event-handler.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/signal/monitor/event-handler.ts`)

---

## Access Control

Access control happens before the message reaches the agent. It is driven by two orthogonal settings:

- **`dmPolicy`** — controls who may send direct messages to the bot.
- **`groupPolicy`** — controls which groups or guilds the bot will respond in, and which senders are permitted.

### DM Policy

`dmPolicy` is defined in `DmPolicySchema`[`src/config/zod-schema.providers-core.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/config/zod-schema.providers-core.ts`) and can be:
ValueBehavior`pairing` (default)Unknown senders receive a pairing code; approved senders are stored in the pairing store`allowlist`Only senders listed in `allowFrom` are accepted; requires at least one entry`open`Any sender accepted; requires `allowFrom` to include `"*"``disabled`All DMs rejected
The runtime check is performed by `resolveDmGroupAccessWithLists` in `src/security/dm-policy-shared.js`. For `pairing` mode, `readStoreAllowFromForDmPolicy` consults the pairing store file, and `upsertChannelPairingRequest` creates a pending request sent back to the user.

### Group Policy

`groupPolicy` is defined in `GroupPolicySchema` and can be:
ValueBehavior`open`Any group/guild accepted; all senders permitted`allowlist` (default when config present)Groups must be listed; senders optionally filtered by `groupAllowFrom` or per-group `allowFrom``disabled`All group messages rejected`blocked`Internal label used in policy resolution warnings
When `channels.<provider>` is completely absent from config, the runtime falls back to `groupPolicy="allowlist"` and logs a warning. See `resolveOpenProviderRuntimeGroupPolicy` in `src/config/runtime-group-policy.js`.

For **mentions** in groups, `requireMention` must be satisfied before a message reaches the agent. This is checked by `resolveMentionGatingWithBypass` in `src/channels/mention-gating.js`.

**Access control decision flow**

```
yes

no

pairing

approved

unknown

allowlist

match

no match

open

disabled

open

allowlist

disabled

allowed

blocked

yes

no

mentioned

not mentioned

Inbound message received

isDirect?

dmPolicy

Send pairing challenge
(upsertChannelPairingRequest)

Check pairing store
(readStoreAllowFromForDmPolicy)

Check allowFrom list
(isAllowedParsedChatSender)

groupPolicy

Check groups config +
groupAllowFrom
(isDiscordGroupAllowedByPolicy /
resolveSignalGroupAccess)

requireMention?

Check mention
(resolveMentionGatingWithBypass)

Pass to dispatchInboundMessage

Drop message
```

Sources: [`src/security/dm-policy-shared.js`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/security/dm-policy-shared.js`)[`src/config/runtime-group-policy.js`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/config/runtime-group-policy.js`)[`src/channels/mention-gating.js`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/channels/mention-gating.js`)[`src/discord/monitor/message-handler.preflight.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/message-handler.preflight.ts`)[`src/signal/monitor/event-handler.ts47-200](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/signal/monitor/event-handler.ts#L47-L200)[`src/imessage/monitor/monitor-provider.ts84-180](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/imessage/monitor/monitor-provider.ts#L84-L180)

---

## Configuration Structure

All channel configuration lives under `channels` in `openclaw.json`. Each provider has its own key with a validated Zod schema. Most providers share a set of common fields:
FieldTypeDefaultDescription`enabled``boolean`—Enable/disable this channel`dmPolicy``"pairing" | "allowlist" | "open" | "disabled"``"pairing"`DM access policy`allowFrom``(string | number)[]`—Sender allowlist for DMs`groupPolicy``"open" | "allowlist" | "disabled"``"allowlist"`Group access policy`groupAllowFrom``(string | number)[]`—Sender allowlist for groups (falls back to `allowFrom`)`requireMention``boolean``true`Require mention in group contexts`historyLimit``number`50Group chat history messages prepended per turn`textChunkLimit``number`platform-specificMax characters per outbound message`chunkMode``"length" | "newline"``"length"`How to split long replies`streaming``boolean | "off" | "partial" | "block" | "progress"``"off"`Reply streaming mode`mediaMaxMb``number`platform-specificMax inbound media file size`accounts``Record<string, AccountConfig>`—Multi-account support`commands.native``boolean | "auto"``"auto"`Enable native slash/bot commands`ackReaction``string`agent emojiEmoji reaction set while processing
Provider-specific schemas are in [`src/config/zod-schema.providers-core.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/config/zod-schema.providers-core.ts`) (Telegram, Discord, Slack, Signal, iMessage, Google Chat) and sibling files.

### Multi-Account Support

Telegram, Discord, and Slack support running multiple bot accounts simultaneously. Each is defined as a named entry under `.accounts`:

```
channels.telegram.accounts.second_bot.botToken = "..."
channels.discord.accounts.work.token = "..."
channels.slack.accounts.internal.botToken = "..."

```

Account-level config is shallow-merged with the top-level channel config at runtime. Fields set on an account override the channel default; unset fields inherit the channel default. The `accountId` is passed through the entire pipeline down to the agent.

Sources: [`src/config/zod-schema.providers-core.ts130-335](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/config/zod-schema.providers-core.ts#L130-L335)[`src/telegram/bot.ts45-64](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/telegram/bot.ts#L45-L64)[`src/discord/monitor/provider.ts81-90](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/provider.ts#L81-L90)

---

## Typing Indicators and ACK Reactions

### Typing Indicators

Each channel implementation calls `createTypingCallbacks`[`src/channels/typing.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/channels/typing.ts`) which wraps a platform-specific `start` function. The returned callbacks are passed to `createReplyDispatcherWithTyping`. The typing loop fires automatically during agent generation and stops when the reply is delivered.

```
createTypingCallbacks({ start, onStartError })
  → { onStart, onStop }

```

Errors from typing sends are logged via `logTypingFailure`[`src/channels/logging.js`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/channels/logging.js`) at verbose level and never surface to the user.

### ACK Reactions

When a message arrives, an acknowledgement emoji reaction is added while the agent is processing. Resolution order (first match wins):

1. `channels.<provider>.accounts.<accountId>.ackReaction`
2. `channels.<provider>.ackReaction`
3. `messages.ackReaction`
4. Agent identity emoji (`agents.list[].identity.emoji`), defaulting to `"👀"`

The gate `shouldAckReaction` in `src/channels/ack-reactions.js` applies scope filtering: `ackReactionScope` can be `"all"`, `"group-mentions"`, `"group"`, `"dm"`, or `"off"`. Not all platforms support reactions (e.g. Signal does not).

If `messages.removeAckAfterReply` is `true`, `removeAckReactionAfterReply` is called after the final reply is delivered.

Sources: [`src/channels/typing.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/channels/typing.ts`)[`src/discord/monitor/message-handler.process.ts124-170](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/message-handler.process.ts#L124-L170)[`src/telegram/bot.ts295-297](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/telegram/bot.ts#L295-L297)[`src/plugin-sdk/index.ts326-332](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/plugin-sdk/index.ts#L326-L332)

---

## Group Chat History

Several channels prepend recent conversation history to the inbound context so the agent has conversational context beyond the current message. This is managed by `buildPendingHistoryContextFromMap` in `src/auto-reply/reply/history.js`.

- History is stored in a `Map<string, HistoryEntry[]>` keyed by the channel or group ID, held in memory on the monitor.
- Capacity is controlled by `historyLimit` (per channel config) or `messages.groupChat.historyLimit` (global fallback, default 50).
- Setting `historyLimit: 0` disables history for that channel.
- History is cleared from the map after dispatch via `clearHistoryEntriesIfEnabled`.

Sources: [`src/telegram/bot.ts262-268](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/telegram/bot.ts#L262-L268)[`src/discord/monitor/provider.ts293-295](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/discord/monitor/provider.ts#L293-L295)[`src/signal/monitor.ts`](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/signal/monitor.ts`)

---

## Heartbeat

Channels that support the `ChannelHeartbeatAdapter` interface can emit periodic outbound messages (heartbeats) to configured targets. This is configured under `channels.<provider>.heartbeat` using `ChannelHeartbeatVisibilitySchema` from `src/config/zod-schema.channels.js`. Heartbeat targets are resolved at the Gateway level by the cron subsystem. For details on the cron system see [Cron Service](/openclaw/openclaw/2.5-cron-service).

Sources: [`src/config/zod-schema.providers-core.ts214-215](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/config/zod-schema.providers-core.ts#L214-L215)[`src/plugin-sdk/index.ts25](https://github.com/openclaw/openclaw/blob/8090cb4c/`src/plugin-sdk/index.ts#L25-L25)

---

# Channel-Architecture-&-Plugin-SDK

# Channel Architecture & Plugin SDK
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/discord.md)
- [docs/channels/imessage.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/imessage.md)
- [docs/channels/matrix.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/matrix.md)
- [docs/channels/msteams.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/msteams.md)
- [docs/channels/nostr.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/nostr.md)
- [docs/channels/signal.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/signal.md)
- [docs/channels/slack.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/slack.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/telegram.md)
- [docs/channels/twitch.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/twitch.md)
- [docs/channels/whatsapp.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/whatsapp.md)
- [docs/channels/zalo.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/zalo.md)
- [extensions/feishu/src/bot.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/feishu/src/bot.ts)
- [extensions/googlechat/src/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/googlechat/src/monitor.ts)
- [extensions/irc/src/inbound.policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/irc/src/inbound.policy.test.ts)
- [extensions/irc/src/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/irc/src/inbound.ts)
- [extensions/matrix/src/matrix/monitor/handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/matrix/src/matrix/monitor/handler.ts)
- [extensions/mattermost/src/mattermost/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/mattermost/src/mattermost/monitor.ts)
- [extensions/msteams/src/monitor-handler/message-handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/monitor-handler/message-handler.ts)
- [extensions/msteams/src/reply-dispatcher.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/reply-dispatcher.ts)
- [extensions/nextcloud-talk/src/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/nextcloud-talk/src/inbound.ts)
- [extensions/zalo/src/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/zalo/src/monitor.ts)
- [extensions/zalouser/src/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/zalouser/src/monitor.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.ts)
- [src/channels/typing.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/typing.test.ts)
- [src/channels/typing.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/typing.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.discord.ts)
- [src/config/types.slack.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.slack.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts)
- [src/discord/components-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components-registry.ts)
- [src/discord/components.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.test.ts)
- [src/discord/components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.test.ts)
- [src/discord/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.ts)
- [src/discord/monitor/agent-components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/agent-components.ts)
- [src/discord/monitor/allow-list.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/allow-list.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/listeners.ts)
- [src/discord/monitor/message-handler.preflight.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts)
- [src/discord/monitor/message-handler.process.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.process.ts)
- [src/discord/monitor/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/monitor.test.ts)
- [src/discord/monitor/native-command.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/native-command.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts)
- [src/imessage/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor.ts)
- [src/imessage/monitor/monitor-provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor/monitor-provider.ts)
- [src/plugin-sdk/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts)
- [src/plugins/runtime/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/runtime/index.ts)
- [src/plugins/runtime/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/runtime/types.ts)
- [src/signal/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor.ts)
- [src/signal/monitor/event-handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor/event-handler.ts)
- [src/slack/monitor.tool-result.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor.tool-result.test.ts)
- [src/slack/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor.ts)
- [src/slack/monitor/message-handler/dispatch.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/message-handler/dispatch.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/provider.ts)
- [src/telegram/bot.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.ts)
- [src/web/auto-reply.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/auto-reply.ts)
- [src/web/inbound.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/inbound.test.ts)
- [src/web/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/inbound.ts)
- [src/web/vcard.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/vcard.ts)

This page describes how channel integrations are structured: the **monitor pattern** shared by all channels, the **Plugin SDK** (`openclaw/plugin-sdk`) that extension plugins import, the **`ChannelPlugin` interface** that declares channel capabilities, and the utility helpers for common tasks such as typing indicators, pairing challenges, access decisions, and webhook registration.

For Telegram-specific behavior, see [4.2](/openclaw/openclaw/4.2-telegram). For Discord, see [4.3](/openclaw/openclaw/4.3-discord). For other platforms, see [4.4](/openclaw/openclaw/4.4-other-channels). For how dispatched messages flow through the agent pipeline, see [3.1](/openclaw/openclaw/3.1-agent-execution-pipeline).

---

## Channel Architecture Overview

Every messaging channel runs a long-lived **monitor** process that owns its connection to an external platform. All monitors normalize inbound events into a common context object and call `dispatchInboundMessage` to route them to the agent runtime. Replies are delivered back through the monitor's send helpers.

Two categories of channels exist:
CategoryLocationImports fromBuilt-in`src/{telegram,discord,slack,signal,imessage,web}/`Internal modulesExtension plugin`extensions/{feishu,matrix,mattermost,msteams,zalo}/``openclaw/plugin-sdk`
**Diagram: Channel Monitor Code Entities**

```
Extension Plugin Monitors

Built-in Monitor Functions

ReplyPayload

ReplyPayload

ReplyPayload

ReplyPayload

ReplyPayload

createTelegramBot
src/telegram/bot.ts

monitorDiscordProvider
src/discord/monitor/provider.ts

monitorSlackProvider
src/slack/monitor/provider.ts

monitorSignalProvider
src/signal/monitor.ts

monitorIMessageProvider
src/imessage/monitor/monitor-provider.ts

Feishu monitor
extensions/feishu/src/bot.ts

Mattermost monitor
extensions/mattermost/src/mattermost/monitor.ts

Matrix monitor
extensions/matrix/src/matrix/monitor/handler.ts

dispatchInboundMessage
src/auto-reply/dispatch.ts

Agent Runtime
runReplyAgent
```

Sources: [src/telegram/bot.ts116-427](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.ts#L116-L427)[src/discord/monitor/provider.ts249-662](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L249-L662)[src/slack/monitor/provider.ts59-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/provider.ts#L59-L200)[src/signal/monitor.ts1-51](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor.ts#L1-L51)[src/imessage/monitor/monitor-provider.ts84-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor/monitor-provider.ts#L84-L200)[extensions/feishu/src/bot.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/feishu/src/bot.ts#L1-L50)[extensions/mattermost/src/mattermost/monitor.ts1-65](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/mattermost/src/mattermost/monitor.ts#L1-L65)

---

### The Monitor Function Pattern

Each monitor function follows the same lifecycle:

1. Call `loadConfig()` and resolve the account via the channel's `resolveXxxAccount` helper.
2. Construct the platform client (bot API, WebSocket connection, HTTP listener, etc.).
3. Register per-event handlers (message, reaction, presence, etc.).
4. Run the event loop. For long-polling channels this is a `while (true)` loop; for WebSocket channels this means connecting and awaiting disconnect.
5. On each inbound event, run preflight access checks, build the inbound context, and call `dispatchInboundMessage`.

Extension plugins follow the same pattern but import all helpers from `openclaw/plugin-sdk` rather than internal modules.

---

## Inbound Message Flow

The sequence below applies to both built-in and extension channels.

**Diagram: Inbound Message Processing Sequence**

```
Channel Send
createReplyDispatcherWithTyping
dispatchInboundMessage
finalizeInboundContext
Preflight
Channel Monitor
Platform API
Channel Send
createReplyDispatcherWithTyping
dispatchInboundMessage
finalizeInboundContext
Preflight
Channel Monitor
Platform API
DM policy, pairing,
group allowlist,
mention gating
raw platform event
access control checks
allowed / denied / pairing challenge
build normalized context object
InboundContext with Body, From, To, SessionKey, MediaUrls...
dispatchInboundMessage(ctx)
create reply dispatcher
start typing indicator
ReplyPayload (streamed or final)
deliver text chunks + media
sendMessage / editMessage / react
```

Sources: [src/discord/monitor/message-handler.process.ts60-580](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.process.ts#L60-L580)[src/discord/monitor/message-handler.preflight.ts1-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts#L1-L200)[src/signal/monitor/event-handler.ts55-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor/event-handler.ts#L55-L200)[src/imessage/monitor/monitor-provider.ts84-400](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor/monitor-provider.ts#L84-L400)

### Preflight Access Control

Before dispatch, each channel evaluates access with these shared helpers (all importable from `openclaw/plugin-sdk`):
HelperSourcePurpose`resolveDmGroupAccessWithLists``src/security/dm-policy-shared.ts`DM policy + allowFrom check`createScopedPairingAccess``src/plugin-sdk/pairing-access.ts`Scoped pairing state per channel/account`issuePairingChallenge``src/pairing/pairing-challenge.ts`Generate and store pairing code`evaluateSenderGroupAccess``src/plugin-sdk/group-access.ts`Group sender access decision`resolveMentionGatingWithBypass``src/channels/mention-gating.ts``requireMention` + bypass logic`resolveControlCommandGate``src/channels/command-gating.ts`Command authorization gate
### Inbound Context Fields

`finalizeInboundContext` (from `src/auto-reply/reply/inbound-context.ts`) assembles the canonical payload:
FieldDescription`Body`Formatted envelope: `[Channel / from / timestamp]\ntext``BodyForAgent`Raw message text without envelope decoration`From`Sender ID (e.g. `discord:1234`, `telegram:5678`)`To`Reply target`SessionKey`Resolved session key for this conversation`ChatType``"direct"`, `"group"`, or `"channel"``Provider`Channel name string`MediaUrls`Paths to downloaded media`CommandAuthorized`Whether sender may run slash commands`WasMentioned`Whether the bot was @-mentioned
Sources: [src/discord/monitor/message-handler.process.ts337-378](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.process.ts#L337-L378)[src/signal/monitor/event-handler.ts55-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor/event-handler.ts#L55-L200)

---

## Plugin SDK

### Entry Point

`src/plugin-sdk/index.ts` is the single stable API surface for all extension channel plugins. It is published under the import path `openclaw/plugin-sdk`. Extension plugins must not import from internal package paths.

Sources: [src/plugin-sdk/index.ts1-450](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L1-L450)

### Plugin Package Shape: `OpenClawPluginApi`

A plugin package's root export must conform to `OpenClawPluginApi` (from `src/plugins/types.ts`):
FieldTypeDescription`configSchema``OpenClawPluginConfigSchema` (optional)Zod schema for `openclaw.json` config section`services``OpenClawPluginService[]`Services that run inside the gateway process`channels``ChannelPlugin[]` (optional)Channel plugin registrations
`OpenClawPluginService` is a factory function receiving `OpenClawPluginServiceContext` and returning lifecycle hooks (`start`, `stop`) plus optional HTTP route registrations.

Sources: [src/plugin-sdk/index.ts97-114](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L97-L114)

---

## ChannelPlugin Interface

`ChannelPlugin` (from `src/channels/plugins/types.plugin.ts`) declares a channel's identity and capabilities through a set of optional adapter objects. Each adapter covers one capability area.

**Diagram: ChannelPlugin Adapters → Source Files**

```
ChannelPlugin
src/channels/plugins/types.plugin.ts

ChannelAuthAdapter
(login / logout / QR)

ChannelSetupAdapter
(onboarding wizard)

ChannelPairingAdapter
(DM pairing challenge)

ChannelMessagingAdapter
(send text/media)

ChannelOutboundAdapter
(targeted delivery)

ChannelStreamingAdapter
(draft/partial reply)

ChannelStatusAdapter
(health + issues)

ChannelThreadingAdapter
(thread session keys)

ChannelGroupAdapter
(group membership)

ChannelMentionAdapter
(mention patterns)

ChannelCommandAdapter
(native commands)

ChannelConfigAdapter
(in-channel config writes)

ChannelDirectoryAdapter
(contact/group listing)

ChannelHeartbeatAdapter
(proactive heartbeat)

ChannelSecurityAdapter
(audit checks)

ChannelGatewayAdapter
(gateway event callbacks)

ChannelMessageActionAdapter
(message action tools)

ChannelResolverAdapter
(ID-to-address resolution)
```

Sources: [src/plugin-sdk/index.ts8-63](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L8-L63)

### Adapter Interface Reference
AdapterKey Methods / Purpose`ChannelAuthAdapter`OAuth login, QR login start/wait, logout`ChannelSetupAdapter`Wizard `promptSetup` steps, initial config write`ChannelPairingAdapter`Handle pairing code exchange for `dmPolicy: "pairing"``ChannelMessagingAdapter``sendMessage`, `sendTyping``ChannelOutboundAdapter`Delivery to explicit targets (`ChannelOutboundContext`)`ChannelStreamingAdapter`Progressive reply streaming (edit-based draft)`ChannelStatusAdapter``getStatus()` → `ChannelAccountSnapshot` + `ChannelStatusIssue[]``ChannelThreadingAdapter`Thread session key derivation, tool context for agents`ChannelGroupAdapter`Group allowlist resolution, `ChannelGroupContext``ChannelMentionAdapter`Custom mention regex patterns for group activation`ChannelCommandAdapter`Register and handle native slash commands`ChannelConfigAdapter`Handle runtime config writes triggered by channel events`ChannelDirectoryAdapter``listPeers`, `listGroups` → `ChannelDirectoryEntry[]``ChannelHeartbeatAdapter`Send heartbeat pings to configured recipients`ChannelSecurityAdapter`Contribute findings to `openclaw security audit``ChannelGatewayAdapter`Receive gateway-level lifecycle events`ChannelMessageActionAdapter`Expose platform actions as agent tools`ChannelResolverAdapter`Resolve human-readable targets to platform IDs
Sources: [src/plugin-sdk/index.ts8-62](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L8-L62)

---

## PluginRuntime

`PluginRuntime` (from `src/plugins/runtime/types.ts`) is injected into plugin service context objects. It provides:
NamespaceDescription`channel.media.*`Save/load/detect media buffers`agent.*`Dispatch inbound messages, start agent turns`session.*`Read and write session metadata`log` / `error`Runtime loggerConfig accessRead the resolved `OpenClawConfig`
The implementation is built in `src/plugins/runtime/index.ts` and re-exports many internal utilities pre-bound to the gateway's running context.

Sources: [src/plugins/runtime/types.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/runtime/types.ts#L1-L50)[src/plugins/runtime/index.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/runtime/index.ts#L1-L50)

---

## Common SDK Utilities

The table below lists frequently used utilities and their source paths within `src/plugin-sdk/`.

### Typing Indicators

`createTypingCallbacks` (from `src/channels/typing.ts`) wraps a channel-specific `sendTyping` function in a self-managing keepalive loop. It is called before `dispatchInboundMessage` and torn down after reply delivery.

```
const typingCallbacks = createTypingCallbacks({
  start: () => sendTypingPlatformCall(channelId),
  onStartError: (err) => logTypingFailure({ channel: "myChannel", ... }),
});

```

Sources: [src/channels/typing.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/typing.ts#L1-L50)[src/discord/monitor/message-handler.process.ts419-429](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.process.ts#L419-L429)

### Pairing Challenge Flow

For `dmPolicy: "pairing"`, the standard flow is:

1. `createScopedPairingAccess` wraps per-account pairing state.
2. `issuePairingChallenge` creates a one-time code and returns a reply string to send back to the user.
3. The operator runs `openclaw pairing approve <channel> <code>`.
4. Subsequent messages from the approved sender are allowed through.

Sources: [src/plugin-sdk/index.ts219-221](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L219-L221)

### Group History Context

Channels that support group history inject recent messages into the inbound envelope using:

- `recordPendingHistoryEntryIfEnabled` — append an entry to the in-memory history map
- `buildPendingHistoryContextFromMap` — prepend the history window to the current `Body`
- `clearHistoryEntriesIfEnabled` — evict entries after reply

Sources: [src/plugin-sdk/index.ts309-317](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L309-L317)

### Allowlist and Access Decisions
FunctionPurpose`isAllowedParsedChatSender`Check a sender ID/name against an `allowFrom` list`formatAllowFromLowercase`Normalize `allowFrom` entries for comparison`evaluateSenderGroupAccess`Full group access decision (`SenderGroupAccessDecision`)`resolveDmGroupAccessWithLists`DM policy check combining `allowFrom` + pairing store`readStoreAllowFromForDmPolicy`Read approved senders from the pairing store file`resolveRuntimeGroupPolicy`Resolve the effective `GroupPolicy` for a channel account
Sources: [src/plugin-sdk/index.ts207-422](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L207-L422)

### Text Chunking

`chunkTextForOutbound` (from `src/plugin-sdk/text-chunking.ts`) splits reply text into platform-appropriate chunks using `textChunkLimit` and `chunkMode` (`"length"` or `"newline"`). Per-channel limits are accessed via `resolveTextChunkLimit` (from `src/auto-reply/chunk.ts`).

Sources: [src/plugin-sdk/index.ts235](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L235-L235)

### Reply Delivery Helpers
FunctionSourcePurpose`createNormalizedOutboundDeliverer``src/plugin-sdk/reply-payload.ts`Normalize `ReplyPayload` for send`normalizeOutboundReplyPayload``src/plugin-sdk/reply-payload.ts`Resolve media URLs and metadata`sendMediaWithLeadingCaption``src/plugin-sdk/reply-payload.ts`Send text + media together`formatTextWithAttachmentLinks``src/plugin-sdk/reply-payload.ts`Append attachment URLs to text
Sources: [src/plugin-sdk/index.ts224-230](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L224-L230)

### Media Handling
FunctionSourcePurpose`buildAgentMediaPayload``src/plugin-sdk/agent-media-payload.ts`Convert downloaded files to `AgentMediaPayload``buildMediaPayload``src/channels/plugins/media-payload.ts`Low-level media payload builder`resolveChannelMediaMaxBytes``src/channels/plugins/media-limits.ts`Resolve configured byte size limit`loadWebMedia``src/web/media.ts`Download media from a URL
Sources: [src/plugin-sdk/index.ts132-136](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L132-L136)[extensions/feishu/src/bot.ts336-395](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/feishu/src/bot.ts#L336-L395)

### Webhook Registration

HTTP-based channels register with the gateway's HTTP listener at startup:
FunctionSourcePurpose`registerPluginHttpRoute``src/plugins/http-registry.ts`Register an HTTP route with the gateway`normalizePluginHttpPath``src/plugins/http-path.ts`Normalize the route path`registerWebhookTarget``src/plugin-sdk/webhook-targets.ts`Register a webhook recipient by account`resolveSingleWebhookTarget``src/plugin-sdk/webhook-targets.ts`Look up webhook registration`rejectNonPostWebhookRequest``src/plugin-sdk/webhook-targets.ts`Validate HTTP method
Sources: [src/plugin-sdk/index.ts113-130](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L113-L130)

### Ack Reactions

Channels that support reactions use `createStatusReactionController` (from `src/channels/status-reactions.ts`) and `shouldAckReaction` (from `src/channels/ack-reactions.ts`) to set an acknowledgement emoji while processing and clear or update it on reply delivery. The initial emoji is resolved by `resolveAckReaction` (from `src/agents/identity.ts`).

Sources: [src/discord/monitor/message-handler.process.ts124-173](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.process.ts#L124-L173)

### Miscellaneous SDK Utilities
FunctionPurpose`createDedupeCache` / `createPersistentDedupe`Deduplication for inbound message IDs`readJsonFileWithFallback` / `writeJsonFileAtomically`Safe JSON file I/O for plugin state`buildRandomTempFilePath` / `withTempDownloadPath`Temp file management for media downloads`acquireFileLock` / `withFileLock`File-based locking for shared state`runPluginCommandWithTimeout`Run a CLI subprocess with timeout from plugin code`recordInboundSession`Update session metadata and `lastRoute` after processing`formatInboundFromLabel`Format human-readable from-label for envelopes
Sources: [src/plugin-sdk/index.ts234-445](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L234-L445)

---

## Channel Configuration Schemas

Each channel's configuration block in `openclaw.json` is validated by a Zod schema. Built-in schemas live in `src/config/zod-schema.providers-core.ts`:
`channels.*` keyZod SchemaFile`telegram``TelegramConfigSchema``zod-schema.providers-core.ts``discord``DiscordConfigSchema``zod-schema.providers-core.ts``slack``SlackConfigSchema``zod-schema.providers-core.ts``signal``SignalConfigSchema``zod-schema.providers-core.ts``imessage``IMessageConfigSchema``zod-schema.providers-core.ts``googlechat``GoogleChatConfigSchema``zod-schema.providers-core.ts``whatsapp``WhatsAppConfigSchema``zod-schema.providers-whatsapp.ts`
Extension plugins define their own Zod schema and register it as the `ChannelConfigSchema` field on their `ChannelPlugin`. The helper `buildChannelConfigSchema` (from `src/channels/plugins/config-schema.ts`) provides scaffolding for common fields.

Sensitive fields (tokens, secrets) use `.register(sensitive)` from `src/config/zod-schema.sensitive.ts`. This causes the field to be redacted from logs and config API responses.

Multi-account patterns: each schema has a root account section plus an optional `accounts` record keyed by account ID. Runtime resolution always calls the channel's `resolveXxxAccount` helper, which performs shallow-merge of root + account-level config.

Sources: [src/config/zod-schema.providers-core.ts1-900](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L1-L900)[src/plugin-sdk/index.ts176-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L176-L200)

---

## Diagram: SDK Utility Categories and Source Paths

**Diagram: Plugin SDK Utility Modules**

```
openclaw/plugin-sdk
src/plugin-sdk/index.ts

Access Control
src/plugin-sdk/allow-from.ts
src/plugin-sdk/group-access.ts
src/security/dm-policy-shared.ts

Pairing
src/plugin-sdk/pairing-access.ts
src/pairing/pairing-challenge.ts

Typing Indicators
src/channels/typing.ts

Group History
src/auto-reply/reply/history.ts

Text Chunking
src/plugin-sdk/text-chunking.ts
src/auto-reply/chunk.ts

Media Handling
src/plugin-sdk/agent-media-payload.ts
src/channels/plugins/media-payload.ts

Reply Delivery
src/plugin-sdk/reply-payload.ts

Webhook Registration
src/plugins/http-registry.ts
src/plugin-sdk/webhook-targets.ts

Config Schemas
src/config/zod-schema.providers-core.ts
src/channels/plugins/config-schema.ts

Plugin Types
src/plugins/types.ts
src/channels/plugins/types.plugin.ts
src/channels/plugins/types.ts

PluginRuntime
src/plugins/runtime/types.ts
src/plugins/runtime/index.ts
```

Sources: [src/plugin-sdk/index.ts1-450](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L1-L450)

---

# Telegram

# Telegram
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/discord.md)
- [docs/channels/imessage.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/imessage.md)
- [docs/channels/matrix.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/matrix.md)
- [docs/channels/msteams.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/msteams.md)
- [docs/channels/nostr.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/nostr.md)
- [docs/channels/signal.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/signal.md)
- [docs/channels/slack.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/slack.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/telegram.md)
- [docs/channels/twitch.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/twitch.md)
- [docs/channels/whatsapp.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/whatsapp.md)
- [docs/channels/zalo.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/zalo.md)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.ts)
- [src/channels/draft-stream-loop.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/draft-stream-loop.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.discord.ts)
- [src/config/types.slack.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.slack.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts)
- [src/discord/components-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components-registry.ts)
- [src/discord/components.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.test.ts)
- [src/discord/components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.test.ts)
- [src/discord/monitor/agent-components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/agent-components.ts)
- [src/discord/monitor/allow-list.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/allow-list.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/listeners.ts)
- [src/discord/monitor/message-handler.preflight.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts)
- [src/discord/monitor/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/monitor.test.ts)
- [src/discord/monitor/native-command.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/native-command.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/provider.ts)
- [src/telegram/bot-handlers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-handlers.ts)
- [src/telegram/bot-message-context.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-context.ts)
- [src/telegram/bot-message-dispatch.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-dispatch.test.ts)
- [src/telegram/bot-message-dispatch.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-dispatch.ts)
- [src/telegram/bot-native-commands.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-native-commands.ts)
- [src/telegram/bot.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.test.ts)
- [src/telegram/bot/delivery.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot/delivery.test.ts)
- [src/telegram/bot/delivery.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot/delivery.ts)
- [src/telegram/bot/helpers.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot/helpers.test.ts)
- [src/telegram/bot/helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot/helpers.ts)
- [src/telegram/draft-stream.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/draft-stream.test.ts)
- [src/telegram/draft-stream.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/draft-stream.ts)
- [src/telegram/lane-delivery.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/lane-delivery.ts)

This page covers the Telegram channel integration in OpenClaw: how the bot is initialized, the inbound message processing pipeline, outbound reply delivery, streaming preview, access control, group and forum topic support, native and custom command registration, reaction handling, and all configuration options.

For the general channel plugin architecture and the shared `PluginRuntime` interface, see [Channel Architecture & Plugin SDK](/openclaw/openclaw/4.1-channel-architecture-and-plugin-sdk). For access control concepts like `dmPolicy` and `groupPolicy` that apply across channels, see [Channels](/openclaw/openclaw/4-channels).

---

## Overview

The Telegram integration uses [grammY](https://grammy.dev/) to connect to the Telegram Bot API. Long polling is the default; webhook mode is optional. The integration lives under `src/telegram/` and is owned by the Gateway process.

The primary entry point is `createTelegramBot` in `src/telegram/bot.js`. It constructs a grammY `Bot` instance, registers all message and command handlers, calls `setMyCommands` to publish the command menu, and starts polling (or attaches to the webhook server).

Sources: [src/telegram/bot.test.ts25-27](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.test.ts#L25-L27)[docs/channels/telegram.md1-11](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/telegram.md#L1-L11)

---

## Bot Initialization

**Telegram Bot Initialization and Handler Registration**

```
createTelegramBot
(src/telegram/bot.js)

loadConfig()
resolve TelegramAccountConfig

new Bot(token)
(grammy)

registerTelegramNativeCommands
(src/telegram/bot-native-commands.ts)

registerTelegramHandlers
(src/telegram/bot-handlers.ts)

bot.api.setMyCommands()
merge native + custom + plugin commands

bot.command(name, handler)
per native command

bot.on('message', ...)

bot.on('callback_query', ...)

bot.on('message_reaction', ...)

bot.start() / webhook attach
```

Sources: [src/telegram/bot.test.ts69-84](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.test.ts#L69-L84)[src/telegram/bot-native-commands.ts288-350](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-native-commands.ts#L288-L350)[src/telegram/bot-handlers.ts102-117](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-handlers.ts#L102-L117)

---

## Inbound Message Pipeline

Inbound messages go through several buffering and gating layers before reaching the agent.

**Inbound Message Processing Pipeline**

```
yes

no

yes

no

yes

no

flush

flush

flush

rejected

ok

skip

pass

Telegram update
(message event)

wasSentByBot?
(sent-message-cache)

drop

msg.media_group_id?

mediaGroupBuffer
Map
flush after MEDIA_GROUP_TIMEOUT_MS

long text fragment?
>= TELEGRAM_TEXT_FRAGMENT_START_THRESHOLD_CHARS

textFragmentBuffer
flush after TELEGRAM_TEXT_FRAGMENT_MAX_GAP_MS

inboundDebouncer
createInboundDebouncer()
debounceMs from config

processMessage()

resolveMedia()
(src/telegram/bot/delivery.ts)

buildTelegramMessageContext()
(src/telegram/bot-message-context.ts)

enforceTelegramDmAccess()
+ evaluateTelegramGroupBaseAccess()

drop / send rejection

resolveMentionGatingWithBypass()
check requireMention

drop / record pending history

dispatchTelegramMessage()
(src/telegram/bot-message-dispatch.ts)

dispatchReplyWithBufferedBlockDispatcher()
agent pipeline

deliverReplies()
(src/telegram/bot/delivery.ts)
```

Sources: [src/telegram/bot-handlers.ts118-253](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-handlers.ts#L118-L253)[src/telegram/bot-message-context.ts144-289](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-context.ts#L144-L289)[src/telegram/bot-message-dispatch.ts131-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-dispatch.ts#L131-L200)

### Key Buffering Behaviors
BufferPurposeKey constants`mediaGroupBuffer`Collects multiple photos/videos sent as an album`MEDIA_GROUP_TIMEOUT_MS` from `src/telegram/bot-updates.ts``textFragmentBuffer`Reassembles text split into rapid short messages`TELEGRAM_TEXT_FRAGMENT_MAX_GAP_MS = 1500`, threshold `4000` chars`inboundDebouncer`Combines rapid text messages into one agent turn`debounceMs` from `messages.inbound.debounceMs` configForward burst laneShort-circuits debounce for forwarded message bursts`FORWARD_BURST_DEBOUNCE_MS = 80`
Sources: [src/telegram/bot-handlers.ts118-252](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-handlers.ts#L118-L252)

### `buildTelegramMessageContext`

`buildTelegramMessageContext` in `src/telegram/bot-message-context.ts` produces the `TelegramMessageContext` object that `dispatchTelegramMessage` consumes. Key operations:

1. **Thread resolution** via `resolveTelegramThreadSpec` — determines `scope` (`dm | forum | none`) and thread ID.
2. **Route resolution** via `resolveAgentRoute` — derives `sessionKey`, `agentId`, `accountId`.
3. **DM access** via `enforceTelegramDmAccess` — enforces `dmPolicy` and `allowFrom`.
4. **Group access** via `evaluateTelegramGroupBaseAccess` — enforces group/topic `enabled` flags and `allowFrom` overrides.
5. **Mention gating** via `resolveMentionGatingWithBypass` — checks `requireMention`, bot `@username` mention, reply-to-bot implicit mentions, and configured mention patterns.
6. **ACK reaction** — fires `setMessageReaction` with `ackReaction` emoji immediately on inbound.
7. **Status reaction controller** — `createStatusReactionController` tracks queued/processing/done lifecycle.
8. **Preflight audio transcription** — for group voice messages, transcribes audio before mention check (`transcribeFirstAudio`).
9. **Envelope formatting** via `formatInboundEnvelope` — produces the `Body` field that the agent sees.

Sources: [src/telegram/bot-message-context.ts144-700](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-context.ts#L144-L700)

---

## Access Control

### DM Access (`dmPolicy`)

`dmPolicy` is configured at `channels.telegram.dmPolicy`. The enforcement is in `enforceTelegramDmAccess` (`src/telegram/dm-access.ts`).
PolicyBehavior`pairing` (default)Accepts senders in the pairing store (`readChannelAllowFromStore`)`allowlist`Accepts senders in `channels.telegram.allowFrom``open`Accepts any sender; requires `allowFrom: ["*"]``disabled`Rejects all DMs
### Group Access

Group access uses two layered checks in `evaluateTelegramGroupBaseAccess` and `evaluateTelegramGroupPolicyAccess` (`src/telegram/group-access.ts`):

1. **Group/topic enabled check** — `channels.telegram.groups.<chatId>.enabled` and `.topics.<threadId>.enabled`.
2. **allowFrom override** — Topic `allowFrom` takes precedence over group `allowFrom`, which takes precedence over `groupAllowFrom`.
3. **groupPolicy check** — `open`, `allowlist`, or `disabled`. Note: DM pairing-store entries are **not** inherited by group sender checks.

`groupAllowFrom` entries must be numeric Telegram user IDs. Non-numeric entries are ignored for authorization.

### Per-group and Per-topic Config Schemas

```
"groups"

"topics"

TelegramConfigSchema

+dmPolicy DmPolicy

+groupPolicy GroupPolicy

+allowFrom Array

+groupAllowFrom Array

+groups Record<string~TelegramGroupSchema>

+accounts Record<string~TelegramAccountSchema>

+customCommands Array

+capabilities TelegramCapabilitiesSchema

+streaming enum

+ackReaction string

+reactionNotifications enum

+webhookUrl string

+webhookSecret string

TelegramGroupSchema

+requireMention boolean

+groupPolicy GroupPolicy

+tools ToolPolicy

+toolsBySender Record

+skills Array

+enabled boolean

+allowFrom Array

+systemPrompt string

+topics Record<string~TelegramTopicSchema>

TelegramTopicSchema

+requireMention boolean

+groupPolicy GroupPolicy

+skills Array

+enabled boolean

+allowFrom Array

+systemPrompt string
```

Sources: [src/config/zod-schema.providers-core.ts57-108](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L57-L108)[src/config/zod-schema.providers-core.ts130-228](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L130-L228)

---

## Group and Forum Topic Sessions

Session key routing for Telegram uses `resolveTelegramThreadSpec` and `resolveTelegramForumThreadId` from `src/telegram/bot/helpers.ts`.
Chat typeSession key shapePrivate DM`agent:<agentId>:<accountId>`Private DM with thread`agent:<agentId>:<accountId>:thread:<threadId>`Group / supergroup`agent:<agentId>:telegram:group:<chatId>`Forum topic`agent:<agentId>:telegram:group:<chatId>:topic:<topicId>`
**Forum General topic** (ID=1) is handled specially: `sendMessage` omits `message_thread_id=1` because Telegram rejects it, but typing actions still include it.

Non-forum group `message_thread_id` (reply threads) does **not** create separate sessions — `resolveTelegramForumThreadId` returns `undefined` for non-forum chats regardless of thread ID.

Sources: [src/telegram/bot/helpers.ts65-107](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot/helpers.ts#L65-L107)[src/telegram/bot-message-context.ts168-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-context.ts#L168-L200)

---

## Commands

### Native Command Registration

`registerTelegramNativeCommands` in `src/telegram/bot-native-commands.ts` builds the command list at startup:

1. Native built-in commands via `listNativeCommandSpecsForConfig` (e.g., `/status`, `/reset`, `/new`).
2. Skill commands via `listSkillCommandsForAgents` (when `commands.nativeSkills` is enabled).
3. Custom commands from `channels.telegram.customCommands` via `resolveTelegramCustomCommands`.
4. Plugin commands from `getPluginCommandSpecs`.
5. Merges all, deduplicates, logs conflicts, and calls `bot.api.setMyCommands`.

Custom command names colliding with native command names are rejected with an error log and omitted from the menu.

Command names are normalized via `normalizeTelegramCommandName`: leading `/` stripped, lowercased, must match `[a-z0-9_]{1,32}`.

### Command Authorization

Each native command handler calls `resolveTelegramCommandAuth`, which checks:

- Group access (`evaluateTelegramGroupBaseAccess`, `evaluateTelegramGroupPolicyAccess`)
- DM allowlist / pairing store (`normalizeDmAllowFromWithStore`)
- `commands.useAccessGroups` global flag

Unauthorized callers receive `"You are not authorized to use this command."` via `bot.api.sendMessage`.

Sources: [src/telegram/bot-native-commands.ts139-286](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-native-commands.ts#L139-L286)[src/telegram/bot-native-commands.ts288-400](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-native-commands.ts#L288-L400)

---

## Outbound Reply Delivery

**Outbound Delivery and Streaming Pipeline**

```
yes

no

final flush

PARSE_ERR_RE match

Agent reply stream
(streaming chunks)

dispatchTelegramMessage
(src/telegram/bot-message-dispatch.ts)

resolveTelegramReasoningLevel()
check session reasoningLevel

canStreamAnswerDraft?
streamMode != off
&& !blockStreaming
&& !forceBlockForReasoning

createTelegramDraftStream()
(src/telegram/draft-stream.ts)
send + edit preview message

dispatchReplyWithBufferedBlockDispatcher()
buffered block delivery

deliverReplies()
(src/telegram/bot/delivery.ts)

markdownToTelegramChunks()
split by textChunkLimit

bot.api.sendMessage()
parse_mode: HTML

retry as plain text

sendPhoto / sendVideo / sendAudio
/ sendDocument / sendAnimation
/ sendVoice / sendSticker

buildInlineKeyboard()
reply_markup for buttons
```

Sources: [src/telegram/bot-message-dispatch.ts131-300](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-dispatch.ts#L131-L300)[src/telegram/bot/delivery.ts46-300](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot/delivery.ts#L46-L300)[src/telegram/draft-stream.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/draft-stream.ts#L1-L50)

### Streaming Modes

`channels.telegram.streaming` controls the outbound streaming behavior:
ValueBehavior`"off"` (default)No preview; final message sent after agent completes`"partial"`Preview message sent then edited as text streams`"block"`Same as `"partial"` on Telegram`"progress"`Maps to `"partial"` (cross-channel compat alias)
The legacy `streamMode` field and boolean `streaming: true` are auto-mapped by `normalizeTelegramStreamingConfig` at config parse time.

When `blockStreaming: true`, preview streaming is disabled (they don't combine). When reasoning is enabled (`/reasoning on`), block streaming is also forced.

`DRAFT_MIN_INITIAL_CHARS = 30` — preview message is not sent until at least 30 characters have accumulated, to avoid noisy push notifications.

Sources: [src/telegram/bot-message-dispatch.ts172-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-dispatch.ts#L172-L200)[src/config/zod-schema.providers-core.ts153-158](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L153-L158)

### Text Formatting

Outbound text is rendered to Telegram HTML via `markdownToTelegramHtml` and `renderTelegramHtmlText`. If Telegram rejects the parsed HTML (matching `PARSE_ERR_RE`), `deliverReplies` retries the same chunk as plain text. Link previews are enabled by default; set `linkPreview: false` to disable.

Long replies are split by `chunkMarkdownTextWithMode` using `textChunkLimit` (default 4096 chars for Telegram). `chunkMode: "newline"` splits on newlines rather than character count.

### Media Delivery

Media types handled in `deliverReplies`:

- Photos → `bot.api.sendPhoto`
- Videos → `bot.api.sendVideo`
- Audio → `bot.api.sendAudio` or `bot.api.sendVoice` (when `audioAsVoice` or `[[audio_as_voice]]` tag)
- Documents → `bot.api.sendDocument`
- Animations (GIF) → `bot.api.sendAnimation` (detected via `isGifMedia`)
- Stickers → `bot.api.sendSticker`

Caption text exceeding 1024 characters is split: the first 1024 chars go in the caption, the remainder is sent as a follow-up text message (`splitTelegramCaption`).

Sources: [src/telegram/bot/delivery.ts150-400](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot/delivery.ts#L150-L400)

---

## Inline Buttons and Callback Queries

`channels.telegram.capabilities.inlineButtons` controls which contexts receive inline keyboard markup.
ScopeBehavior`"off"`Inline buttons never sent`"dm"`Buttons only in private chats`"group"`Buttons only in groups`"all"`Buttons in all contexts`"allowlist"` (default)Buttons only in contexts where sender is allowlisted
The `callback_query` handler in `registerTelegramHandlers`:

1. Checks `resolveTelegramInlineButtonsScope` against the chat type and sender.
2. If unauthorized, calls `bot.api.answerCallbackQuery` silently (no reply).
3. Handles `commands_page_N` callbacks for command list pagination (edits existing message).
4. Handles `commands_page_N:<agentId>` for agent-scoped command listings.
5. Routes `cmd:<value>` callbacks as text messages to the agent.

Sources: [src/telegram/bot-handlers.ts600-900](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-handlers.ts#L600-L900)[src/telegram/bot.test.ts157-320](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.test.ts#L157-L320)

---

## Reactions

### ACK Reaction

When `ackReaction` is configured and the sender is in scope, the bot calls `setMessageReaction` immediately on the inbound message. Scope is controlled by `ackReactionScope` derived from `reactionLevel`:
`reactionLevel`Scope`"off"`No reactions`"ack"`Reaction in DMs only`"minimal"`Reaction on mentioned group messages`"extensive"`Reaction in all authorized contexts
When `messages.statusReactions.enabled: true`, the ACK reaction transitions through lifecycle states (queued → processing → done) via `createStatusReactionController`. `resolveTelegramReactionVariant` resolves emoji variants against the chat's `available_reactions`.

Sources: [src/telegram/bot-message-context.ts452-559](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-message-context.ts#L452-L559)

### Reaction Notifications

`message_reaction` events are handled when `reactionNotifications` is not `"off"`. Authorized reactions call `enqueueSystemEvent` with a description like `"Telegram reaction added: 👍 by Ada (@ada_bot) on msg 42"`.
`reactionNotifications`Behavior`"off"`No notifications`"own"` (default)Notify only on reactions to bot's own messages`"all"`Notify on any reaction in authorized context
Reaction events are access-controlled using the same DM/group policy checks as regular messages.

Sources: [src/telegram/bot.test.ts1027-1181](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.test.ts#L1027-L1181)[src/telegram/bot-handlers.ts1100-1200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot-handlers.ts#L1100-L1200)

---

## Webhook Mode

By default the bot uses long polling. To use webhook mode, configure:

```
{
  channels: {
    telegram: {
      webhookUrl: "https://your-public-host/telegram-webhook",
      webhookSecret: "your-secret-token",
      webhookPath: "/telegram-webhook",   // default
      webhookHost: "127.0.0.1",           // default
      webhookPort: 8787                   // default
    }
  }
}
```

`webhookUrl` requires `webhookSecret`. The webhook listener binds to `webhookHost:webhookPort` and verifies the secret token on inbound requests. The Gateway HTTP server serves the webhook path.

Sources: [src/config/zod-schema.providers-core.ts171-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L171-L200)

---

## Multi-Account Support

Multiple Telegram bots can run simultaneously using `channels.telegram.accounts`:

```
{
  channels: {
    telegram: {
      botToken: "default-token",
      dmPolicy: "pairing",
      accounts: {
        work: {
          botToken: "work-bot-token",
          dmPolicy: "allowlist",
          allowFrom: ["123456789"]
        }
      }
    }
  }
}
```

Each account runs its own `createTelegramBot` instance with its own handler registration and command menu. The default account uses `channels.telegram` directly; named accounts inherit unset fields from the top-level config (shallow merge at runtime).

`allowFrom` and `dmPolicy` validation is enforced at the `TelegramConfigSchema` level accounting for inheritance from top-level to account-level.

Sources: [src/config/zod-schema.providers-core.ts230-334](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L230-L334)

---

## Configuration Reference

All fields belong to `channels.telegram` (or `channels.telegram.accounts.<id>`).

### Authentication
FieldTypeDefaultNotes`botToken``string`—Bot token from BotFather. Sensitive.`tokenFile``string`—Path to file containing bot token.
Env fallback `TELEGRAM_BOT_TOKEN` applies to the default account only.

### DM Access
FieldTypeDefaultNotes`dmPolicy``"pairing" | "allowlist" | "open" | "disabled"``"pairing"`DM access policy.`allowFrom``Array<string|number>`—Allowlisted Telegram user IDs for DMs. Required when `dmPolicy="allowlist"`.`dms``Record<string, DmConfig>`—Per-DM session config.`dmHistoryLimit``number`—History limit for DM sessions.
### Group Access
FieldTypeDefaultNotes`groupPolicy``"open" | "allowlist" | "disabled"``"allowlist"`Sender policy for groups.`groupAllowFrom``Array<string|number>`—Sender allowlist for groups (numeric IDs).`groups``Record<string, TelegramGroupSchema>`—Per-group config keyed by chat ID. Use `"*"` for wildcard.`historyLimit``number`—Pending message history for groups.
**Per-group fields** (`channels.telegram.groups.<chatId>`):
FieldTypeNotes`requireMention``boolean`Override mention requirement for this group.`groupPolicy``GroupPolicy`Per-group policy override.`tools``ToolPolicy`Tool policy for this group's agent.`toolsBySender``Record<string, ToolPolicy>`Per-sender tool policy.`skills``string[]`Skill filter for this group.`enabled``boolean`Disable group entirely if `false`.`allowFrom``Array<string|number>`Per-group sender allowlist.`systemPrompt``string`Injected system prompt for this group.`topics``Record<string, TelegramTopicSchema>`Per-forum-topic config.
**Per-topic fields** (`channels.telegram.groups.<chatId>.topics.<threadId>`):
FieldTypeNotes`requireMention``boolean`Override for this topic.`groupPolicy``GroupPolicy`Per-topic policy.`skills``string[]`Skill filter.`enabled``boolean`Disable topic if `false`.`allowFrom``Array<string|number>`Per-topic sender allowlist. Takes precedence over group `allowFrom`.`systemPrompt``string`Injected system prompt.
### Commands
FieldTypeDefaultNotes`commands.native``boolean | "auto"``"auto"`Enable/disable native command menu.`customCommands``Array<{command, description}>`—Additional menu entries. Cannot override native names.
### Streaming and Delivery
FieldTypeDefaultNotes`streaming``"off" | "partial" | "block" | "progress"``"off"`Preview streaming mode.`blockStreaming``boolean`—Enable block (non-preview) streaming.`draftChunk``BlockStreamingChunkConfig`—Block streaming chunk config.`blockStreamingCoalesce``BlockStreamingCoalesceConfig`—Coalesce config for block streaming.`textChunkLimit``number``4096`Max chars per message.`chunkMode``"length" | "newline"``"length"`Chunking strategy.`replyToMode``"off" | "first" | "all"``"off"`Whether to thread replies.`linkPreview``boolean``true`Show link previews in outbound messages.`responsePrefix``string`—Text prepended to every agent reply.`markdown``MarkdownConfig`—Markdown rendering options.
### Media
FieldTypeDefaultNotes`mediaMaxMb``number``8`Max inbound media file size in MB.
### Reactions
FieldTypeDefaultNotes`ackReaction``string`—Emoji to react with on inbound messages.`reactionNotifications``"off" | "own" | "all"``"own"`Which reactions to report as system events.`reactionLevel``"off" | "ack" | "minimal" | "extensive"`—Scope of ACK reactions.
### Capabilities and Actions
FieldTypeDefaultNotes`capabilities.inlineButtons``"off" | "dm" | "group" | "all" | "allowlist"``"allowlist"`Scope for sending inline keyboards.`actions.sendMessage``boolean``true`Allow agent `sendMessage` tool action.`actions.reactions``boolean``true`Allow agent `react` tool action.`actions.deleteMessage``boolean``true`Allow agent `deleteMessage` tool action.`actions.sticker``boolean``false`Allow agent sticker send action.
### Network and Webhook
FieldTypeDefaultNotes`proxy``string`—HTTP proxy URL for Telegram API calls.`network.autoSelectFamily``boolean`—Enable Happy Eyeballs address selection.`network.dnsResultOrder``"ipv4first" | "verbatim"`—DNS result ordering.`webhookUrl``string`—Public HTTPS webhook URL. Requires `webhookSecret`.`webhookSecret``string`—Token verified on inbound webhook requests. Sensitive.`webhookPath``string``/telegram-webhook`Local route path.`webhookHost``string``127.0.0.1`Local bind host.`webhookPort``number``8787`Local bind port.
### Other
FieldTypeDefaultNotes`name``string`—Account display name.`enabled``boolean`—Disable this account if `false`.`configWrites``boolean`—Allow config write tool actions via this channel.`defaultTo``string | number`—Default outbound chat ID when no target is specified.`heartbeat``ChannelHeartbeatVisibilityConfig`—Heartbeat visibility settings.`timeoutSeconds``number`—API timeout.`retry``RetryConfig`—Retry policy for failed API calls.`accounts``Record<string, TelegramAccountSchema>`—Named additional bot accounts.
Sources: [src/config/zod-schema.providers-core.ts130-228](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L130-L228)[src/config/zod-schema.providers-core.ts57-108](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L57-L108)[docs/channels/telegram.md230-600](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/telegram.md#L230-L600)

---

# Discord

# Discord
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/discord.md)
- [docs/channels/imessage.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/imessage.md)
- [docs/channels/matrix.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/matrix.md)
- [docs/channels/msteams.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/msteams.md)
- [docs/channels/nostr.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/nostr.md)
- [docs/channels/signal.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/signal.md)
- [docs/channels/slack.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/slack.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/telegram.md)
- [docs/channels/twitch.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/twitch.md)
- [docs/channels/whatsapp.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/whatsapp.md)
- [docs/channels/zalo.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/zalo.md)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.discord.ts)
- [src/config/types.slack.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.slack.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts)
- [src/discord/components-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components-registry.ts)
- [src/discord/components.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.test.ts)
- [src/discord/components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.test.ts)
- [src/discord/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.ts)
- [src/discord/monitor/agent-components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/agent-components.ts)
- [src/discord/monitor/allow-list.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/allow-list.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/listeners.ts)
- [src/discord/monitor/message-handler.preflight.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts)
- [src/discord/monitor/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/monitor.test.ts)
- [src/discord/monitor/native-command.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/native-command.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts)
- [src/imessage/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor.ts)
- [src/signal/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor.ts)
- [src/slack/monitor.tool-result.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor.tool-result.test.ts)
- [src/slack/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/provider.ts)
- [src/telegram/bot.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/telegram/bot.ts)
- [src/web/auto-reply.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/auto-reply.ts)
- [src/web/inbound.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/inbound.test.ts)
- [src/web/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/inbound.ts)
- [src/web/vcard.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/web/vcard.ts)

This page documents the Discord channel integration in OpenClaw: the runtime lifecycle of the Discord bot, how inbound messages are authorized and dispatched, how guild/channel allowlists are resolved, thread binding behavior, exec approval interactive components, and native slash command deployment. For general channel architecture and the plugin SDK pattern, see [4.1](/openclaw/openclaw/4.1-channel-architecture-and-plugin-sdk). For configuration field-by-field reference, see [2.3.1](/openclaw/openclaw/2.3.1-configuration-reference).

---

## Overview

The Discord integration connects OpenClaw to Discord via the official Gateway WebSocket using the `@buape/carbon` library. It is started by the OpenClaw Gateway as part of channel startup. The primary entry point is `monitorDiscordProvider` in [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts) which wires together authentication, command deployment, message listeners, thread bindings, exec approval handlers, and agent components.

**Diagram: Discord integration top-level structure**

```
GatewayServer

monitorDiscordProvider
src/discord/monitor/provider.ts

resolveDiscordAccount
src/discord/accounts.ts

resolveDiscordAllowlistConfig
src/discord/monitor/provider.allowlist.ts

Client
@buape/carbon

deployDiscordCommands

createThreadBindingManager
src/discord/monitor/thread-bindings.ts

DiscordExecApprovalHandler
src/discord/monitor/exec-approvals.ts

createDiscordMessageHandler
src/discord/monitor/message-handler.ts

DiscordMessageListener

DiscordReactionListener

DiscordReactionRemoveListener

DiscordStatusReadyListener

DiscordVoiceManager
src/discord/voice/manager.ts

preflightDiscordMessage
src/discord/monitor/message-handler.preflight.ts
```

Sources: [src/discord/monitor/provider.ts1-687](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L1-L687)

---

## Bot setup and privileged intents

The Discord bot requires a bot token from the Discord Developer Portal and specific **privileged gateway intents** enabled on the application:
IntentRequiredPurposeMessage Content IntentYesReceive message text in guildsServer Members IntentRecommendedRole allowlists, name-to-ID resolutionPresence IntentOptionalPresence tracking (`channels.discord.intents.presence`)
Token resolution order:

1. `opts.token` (programmatic)
2. `channels.discord.token` (config)
3. `DISCORD_BOT_TOKEN` environment variable (default account only)

Multi-account setups configure additional accounts under `channels.discord.accounts.<accountId>`. Named accounts inherit `channels.discord.allowFrom` when their own `allowFrom` is unset, but do not inherit `channels.discord.accounts.default.allowFrom`.

Sources: [src/discord/monitor/provider.ts249-261](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L249-L261)[src/config/zod-schema.providers-core.ts406-554](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L406-L554)

---

## `monitorDiscordProvider` lifecycle

**Diagram: `monitorDiscordProvider` startup sequence**

```
"runDiscordGatewayLifecycle"
"Client (@buape/carbon)"
"deployDiscordCommands"
"fetchDiscordApplicationId"
"resolveDiscordAllowlistConfig"
"resolveDiscordAccount"
"monitorDiscordProvider"
"GatewayServer"
"runDiscordGatewayLifecycle"
"Client (@buape/carbon)"
"deployDiscordCommands"
"fetchDiscordApplicationId"
"resolveDiscordAllowlistConfig"
"resolveDiscordAccount"
"monitorDiscordProvider"
"GatewayServer"
"start"
"resolve account + config"
"resolve guild/allowFrom slugs"
"fetch applicationId"
"build commands + components + modals"
"new Client(...)"
"deployDiscordCommands"
"registerDiscordListener (message, reaction, presence)"
"await runDiscordGatewayLifecycle"
```

Sources: [src/discord/monitor/provider.ts249-662](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L249-L662)

Key steps in `monitorDiscordProvider`:

1. **Account resolution** — `resolveDiscordAccount` merges per-account config with the root `channels.discord` block.
2. **Allowlist resolution** — `resolveDiscordAllowlistConfig` calls the Discord REST API to resolve guild slugs to IDs and validates user allowlists. Guild slug-based entries in `channels.discord.guilds` are resolved to numeric IDs at startup.
3. **Application ID fetch** — `fetchDiscordApplicationId` is called with a 4-second timeout to obtain the bot's Discord application ID.
4. **Command building** — `listNativeCommandSpecsForConfig` assembles slash commands from the native command registry; each is wrapped in `createDiscordNativeCommand`. If the total exceeds 100 commands, per-skill commands are dropped and a warning is logged.
5. **Component registration** — Interactive components including exec approval buttons, agent component buttons, model picker selects, and modals are registered on the `Client`.
6. **Listener registration** — `DiscordMessageListener`, `DiscordReactionListener`, `DiscordReactionRemoveListener`, and optionally `DiscordPresenceListener` are attached via `registerDiscordListener`.
7. **Gateway lifecycle** — `runDiscordGatewayLifecycle` drives the WebSocket connection, handling reconnects and abort signals.

Sources: [src/discord/monitor/provider.ts249-662](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L249-L662)

---

## Access control: guild and channel allowlists

Allow-list resolution is handled by functions in [src/discord/monitor/allow-list.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/allow-list.ts)

**Diagram: allowlist resolution layers**

```
Yes

No

open

disabled

allowlist

no match

match

allowed=false

allowed=true

mention required, not present

ok

pairing

allowlist

match

no match

Inbound Discord message

isDirectMessage?

dmPolicy check
(open/pairing/allowlist/disabled)

isDiscordGroupAllowedByPolicy
groupPolicy check

pass

drop

resolveDiscordGuildEntry
guild in guilds config?

resolveDiscordChannelConfigWithFallback
channel in channels config?

resolveDiscordShouldRequireMention

upsertChannelPairingRequest

normalizeDiscordAllowList
allowListMatches
```

Sources: [src/discord/monitor/message-handler.preflight.ts108-400](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts#L108-L400)[src/discord/monitor/allow-list.ts1-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/allow-list.ts#L1-L200)

### Guild entry resolution

`resolveDiscordGuildEntry` looks up a guild in `channels.discord.guilds` by:

1. Exact numeric ID match
2. Slug key match (e.g., `"friends-of-openclaw"`)
3. Wildcard `"*"` fallback

Slugs are normalized via `normalizeDiscordSlug` which lowercases, strips `#`, and collapses non-alphanumeric runs to `-`.

### Channel config resolution

`resolveDiscordChannelConfigWithFallback` is used for both regular channels and threads:

- For regular channels: matches by channel ID, then by slug, then by wildcard `"*"`.
- For threads: matches using the **parent** channel's ID/slug (thread name/slug is intentionally not matched against the channel config).

The `matchSource` field on the resolved config indicates `"direct"`, `"parent"`, or `"wildcard"`.

### User and role allowlists

Per-guild and per-channel configs accept `users` (IDs or names) and `roles` (role IDs only). A sender is allowed when they match `users`**OR**`roles`. Name/tag matching is disabled by default; `channels.discord.dangerouslyAllowNameMatching: true` enables it.

`normalizeDiscordAllowList` parses the raw list, separating numeric IDs (placed in `ids` set) from name-like strings (placed in `names` set). Prefixes `discord:`, `user:`, `pk:` are stripped.

Sources: [src/discord/monitor/allow-list.ts56-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/allow-list.ts#L56-L200)[src/discord/monitor/message-handler.preflight.ts177-310](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts#L177-L310)

---

## Message preflight

Every inbound message passes through `preflightDiscordMessage` in [src/discord/monitor/message-handler.preflight.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts) This function returns a `DiscordMessagePreflightContext` on success, or `null` to drop the message.

**Diagram: `preflightDiscordMessage` decision flow**

```
own bot

other bot

false

true

human

GroupDM, disabled

DM

Guild

mention missing

ok

preflightDiscordMessage

resolve author, channelId

bot message?

return null

allowBots?

resolveDiscordSenderIdentity
(+pluralkit lookup)

DM / GroupDM / Guild?

return null

DM policy enforcement
(open/pairing/allowlist)

Guild policy + allowlist
resolveDiscordGuildEntry
resolveDiscordChannelConfigWithFallback

build DiscordMessagePreflightContext

requireMention?

return null

return context
```

Sources: [src/discord/monitor/message-handler.preflight.ts108-400](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts#L108-L400)

Pairing flow: when `dmPolicy="pairing"` and the sender is not in the allowlist, `upsertChannelPairingRequest` is called and the bot sends a pairing code reply via `buildPairingReply`.

`resolveDiscordSenderIdentity` handles PluralKit proxy messages: when `pluralkit.enabled=true`, it calls `fetchPluralKitMessageInfo` before resolving the sender identity.

Sources: [src/discord/monitor/message-handler.preflight.ts132-158](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts#L132-L158)[src/discord/monitor/sender-identity.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/sender-identity.ts)

---

## Session keys
ScenarioSession key patternDM (default `dmScope=main`)`agent:<agentId>:main`Guild channel`agent:<agentId>:discord:channel:<channelId>`Thread`agent:<agentId>:discord:channel:<threadId>`Slash command`agent:<agentId>:discord:slash:<userId>`
Guild channel sessions are isolated per channel ID. Thread sessions use the thread's own ID as the channel ID component.

Sources: [src/discord/monitor/provider.ts257-260](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L257-L260)[docs/channels/discord.md254-260](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/discord.md#L254-L260)

---

## Thread bindings

Thread bindings associate a Discord thread with an agent session, enabling autonomous subagents to post into threads directly.

`createThreadBindingManager` or `createNoopThreadBindingManager` is constructed at startup based on `channels.discord.threadBindings.enabled` (default: `true`).

Configuration fields under `channels.discord.threadBindings`:
FieldDefaultDescription`enabled``true`Enable/disable thread binding subsystem`idleHours``24`Expire thread binding after idle time`maxAgeHours``0` (disabled)Absolute max age before expiry`spawnSubagentSessions`—Control subagent thread spawn behavior`spawnAcpSessions`—Control ACP-routed thread spawns
At startup, `reconcileAcpThreadBindingsOnStartup` removes stale ACP thread bindings from previous sessions.

`isRecentlyUnboundThreadWebhookMessage` prevents double-processing webhook messages from threads that were recently unbound.

Sources: [src/discord/monitor/provider.ts382-401](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L382-L401)[src/discord/monitor/thread-bindings.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/thread-bindings.ts)

---

## Exec approvals

When `channels.discord.execApprovals.enabled=true`, OpenClaw routes exec approval requests to Discord as interactive messages with approve/deny buttons.

`DiscordExecApprovalHandler` ([src/discord/monitor/exec-approvals.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/exec-approvals.ts)) is instantiated in `monitorDiscordProvider` and receives the account config. `createExecApprovalButton` registers the button component on the `Client`.

Configuration under `channels.discord.execApprovals`:
FieldDescription`enabled`Enable Discord exec approval flow`approvers`Discord user IDs that may approve`agentFilter`Limit which agent IDs trigger approvals`sessionFilter`Limit which session keys trigger approvals`cleanupAfterResolve`Delete button message after approval/denial`target`Where to send approval: `dm`, `channel`, or `both`
Sources: [src/discord/monitor/provider.ts430-471](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L430-L471)[src/config/zod-schema.providers-core.ts466-476](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L466-L476)

---

## Slash command deployment

Native slash commands are deployed to Discord at startup via `deployDiscordCommands`.

**Diagram: command build and deploy**

```
yes

no

listNativeCommandSpecsForConfig
src/auto-reply/commands-registry.ts

commandSpecs[]

listSkillCommandsForAgents
src/auto-reply/skill-commands.ts

count > 100?

drop skill commands
keep /skill only

createDiscordNativeCommand
src/discord/monitor/native-command.ts

commands: BaseCommand[]

Client.handleDeployRequest
@buape/carbon

Discord Application Commands API
```

Sources: [src/discord/monitor/provider.ts356-380](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L356-L380)[src/discord/monitor/provider.ts189-206](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L189-L206)

When `commands.native=false` is explicitly set, `clearDiscordNativeCommands` issues a `PUT /applications/<id>/commands` with an empty body to remove all previously registered commands.

Each native command spec is wrapped in `createDiscordNativeCommand`, which extends Carbon's `Command` class. Commands support autocomplete, argument menus, and model picker flows via `createDiscordCommandArgFallbackButton` and `createDiscordModelPickerFallbackButton`/`createDiscordModelPickerFallbackSelect`.

Slash command sessions are isolated (`agent:<agentId>:discord:slash:<userId>`) and route against the target conversation session via `CommandTargetSessionKey`.

Default slash command config: `ephemeral: true`.

Sources: [src/discord/monitor/native-command.ts1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/native-command.ts#L1-L100)[src/config/zod-schema.providers-core.ts478-483](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L478-L483)

---

## Agent components

When `agentComponents.enabled` is `true` (default), `monitorDiscordProvider` registers a set of Carbon interactive component handlers that route Discord button/select/modal interactions back to the agent.

**Diagram: agent component registration**

```
monitorDiscordProvider

createAgentComponentButton
src/discord/monitor/agent-components.ts

createAgentSelectMenu

createDiscordComponentButton

createDiscordComponentStringSelect

createDiscordComponentUserSelect

createDiscordComponentRoleSelect

createDiscordComponentMentionableSelect

createDiscordComponentChannelSelect

createDiscordComponentModal

Client modals[]
```

Sources: [src/discord/monitor/provider.ts442-494](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts#L442-L494)[src/discord/monitor/agent-components.ts1-60](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/agent-components.ts#L1-L60)

Interaction results (button clicks, select choices, modal submissions) are formatted by `formatDiscordComponentEventText` and enqueued as inbound system events that route to the appropriate agent session. The `reusable` flag on a component entry controls whether the interaction component stays active after one use.

Per-button `allowedUsers` restricts which Discord users may click a button; unauthorized users receive an ephemeral denial.

Sources: [src/discord/monitor/agent-components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/agent-components.ts)

---

## Listeners

Listeners extend Carbon base classes and are registered via `registerDiscordListener`, which deduplicates by constructor to prevent double-registration.
ClassBase classPurpose`DiscordMessageListener``MessageCreateListener`Dispatches to `createDiscordMessageHandler``DiscordReactionListener``MessageReactionAddListener`Routes reaction-add events to system events`DiscordReactionRemoveListener``MessageReactionRemoveListener`Routes reaction-remove events`DiscordPresenceListener``PresenceUpdateListener`Tracks presence updates (optional)`DiscordVoiceReadyListener`—Initializes `DiscordVoiceManager` on ready`DiscordStatusReadyListener``ReadyListener`Sets bot presence on gateway ready
`DiscordMessageListener` wraps the handler in `runDiscordListenerWithSlowLog`, which logs a warning if the listener takes longer than 30 seconds to process an event.

Sources: [src/discord/monitor/listeners.ts112-280](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/listeners.ts#L112-L280)

---

## Streaming and output

Discord output streaming is controlled by `channels.discord.streaming`:
ModeBehavior`off` (default)Send final reply only`partial`Edit a temporary message as tokens arrive`block`Emit draft-sized chunks, tuned by `draftChunk``progress`Alias for `partial`
Legacy `channels.discord.streamMode` values are auto-migrated via `normalizeDiscordStreamingConfig` at config parse time.

`channels.discord.textChunkLimit` defaults to 2000 (Discord message length limit). `channels.discord.maxLinesPerMessage` provides an additional line-count cap per chunk.

Sources: [src/config/zod-schema.providers-core.ts115-118](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L115-L118)[src/config/zod-schema.providers-core.ts427-430](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L427-L430)

---

## Configuration quick-reference

Key `channels.discord` fields:
FieldTypeDefaultDescription`token``string`—Bot token (or `DISCORD_BOT_TOKEN`)`dmPolicy``pairing|allowlist|open|disabled``pairing`DM access policy`allowFrom``string[]`—DM allowlist (user IDs)`groupPolicy``open|allowlist|disabled``allowlist`Guild message policy`guilds``Record<string, DiscordGuildEntry>`—Per-guild allowlist + config`guilds.<id>.users``string[]`—Sender allowlist (IDs preferred)`guilds.<id>.roles``string[]`—Role ID allowlist`guilds.<id>.channels``Record<string, DiscordGuildChannelConfig>`—Per-channel overrides`guilds.<id>.requireMention``boolean``true`Require `@mention` in guild`streaming``off|partial|block|progress``off`Reply streaming mode`threadBindings.enabled``boolean``true`Thread binding subsystem`execApprovals.enabled``boolean``false`Discord exec approval UI`commands.native``boolean|"auto"``"auto"`Slash command deployment`slashCommand.ephemeral``boolean``true`Slash reply visibility`intents.presence``boolean``false`Enable Presence intent`voice.enabled``boolean``true`Voice channel support`dangerouslyAllowNameMatching``boolean``false`Allow name/tag allowlist matching
Discord IDs in config must be strings (wrap numeric IDs in quotes). The config validator enforces this via `DiscordIdSchema`.

Sources: [src/config/zod-schema.providers-core.ts337-608](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L337-L608)[src/config/types.discord.ts1-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.discord.ts#L1-L200)

---

# Other-Channels

# Other Channels
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/discord.md)
- [docs/channels/imessage.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/imessage.md)
- [docs/channels/matrix.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/matrix.md)
- [docs/channels/msteams.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/msteams.md)
- [docs/channels/nostr.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/nostr.md)
- [docs/channels/signal.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/signal.md)
- [docs/channels/slack.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/slack.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/telegram.md)
- [docs/channels/twitch.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/twitch.md)
- [docs/channels/whatsapp.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/whatsapp.md)
- [docs/channels/zalo.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/zalo.md)
- [extensions/feishu/src/bot.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/feishu/src/bot.ts)
- [extensions/googlechat/src/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/googlechat/src/monitor.ts)
- [extensions/irc/src/inbound.policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/irc/src/inbound.policy.test.ts)
- [extensions/irc/src/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/irc/src/inbound.ts)
- [extensions/matrix/src/matrix/monitor/handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/matrix/src/matrix/monitor/handler.ts)
- [extensions/mattermost/src/mattermost/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/mattermost/src/mattermost/monitor.ts)
- [extensions/msteams/src/monitor-handler/message-handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/monitor-handler/message-handler.ts)
- [extensions/msteams/src/reply-dispatcher.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/reply-dispatcher.ts)
- [extensions/nextcloud-talk/src/inbound.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/nextcloud-talk/src/inbound.ts)
- [extensions/zalo/src/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/zalo/src/monitor.ts)
- [extensions/zalouser/src/monitor.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/zalouser/src/monitor.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/allowlists/resolve-utils.ts)
- [src/channels/typing.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/typing.test.ts)
- [src/channels/typing.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/channels/typing.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.discord.ts)
- [src/config/types.slack.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.slack.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts)
- [src/discord/components-registry.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components-registry.ts)
- [src/discord/components.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.test.ts)
- [src/discord/components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/components.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor.test.ts)
- [src/discord/monitor/agent-components.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/agent-components.ts)
- [src/discord/monitor/allow-list.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/allow-list.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/listeners.ts)
- [src/discord/monitor/message-handler.preflight.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.preflight.ts)
- [src/discord/monitor/message-handler.process.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/message-handler.process.ts)
- [src/discord/monitor/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/monitor.test.ts)
- [src/discord/monitor/native-command.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/native-command.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/provider.ts)
- [src/imessage/monitor/monitor-provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor/monitor-provider.ts)
- [src/plugin-sdk/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts)
- [src/plugins/runtime/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/runtime/index.ts)
- [src/plugins/runtime/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/runtime/types.ts)
- [src/signal/monitor/event-handler.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor/event-handler.ts)
- [src/slack/monitor/message-handler/dispatch.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/message-handler/dispatch.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/provider.ts)

This page covers configuration and integration details for all supported messaging channels except Telegram ([4.2](/openclaw/openclaw/4.2-telegram)) and Discord ([4.3](/openclaw/openclaw/4.3-discord)). For the shared channel plugin interface and message dispatch architecture, see [Channel Architecture & Plugin SDK](/openclaw/openclaw/4.1-channel-architecture-and-plugin-sdk). For model configuration, see [3.3](/openclaw/openclaw/3.3-model-configuration-and-authentication).

Channels split into two implementation categories:

- **Core channels** — shipped with the main package; schemas in `src/config/`; monitors under `src/<channel>/`
- **Extension channels** — separate npm packages; source under `extensions/`; built against `openclaw/plugin-sdk` (see [src/plugin-sdk/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts))

---

## Channel Index
ChannelConfig KeyConfig SchemaMonitor Entry PointDefault `dmPolicy`Slack`channels.slack``SlackConfigSchema``monitorSlackProvider``pairing`Signal`channels.signal``SignalConfigSchema``createSignalEventHandler``pairing`iMessage`channels.imessage``IMessageConfigSchema``monitorIMessageProvider``pairing`WhatsApp`channels.whatsapp``WhatsAppConfigSchema`—`pairing`Google Chat`channels.googlechat``GoogleChatConfigSchema`—`pairing`IRC`channels.irc``IrcConfigSchema`—N/ALINE`channels.line``LineConfigSchema`—N/AMatrix`channels.matrix`(extension-local)—`pairing`Feishu`channels.feishu`(extension-local)—N/AMattermost`channels.mattermost`(extension-local)`monitorMattermostProvider``pairing`MS Teams`channels.msteams``MSTeamsConfigSchema`—`pairing`Zalo`channels.zalo`(extension-local)—N/A
---

## Architecture Diagrams

**Diagram: Channel Names → Config Schemas**

```
Other Schema Files

src/config/zod-schema.providers-core.ts

Slack
(channels.slack)

Signal
(channels.signal)

iMessage
(channels.imessage)

WhatsApp
(channels.whatsapp)

Google Chat
(channels.googlechat)

IRC
(channels.irc)

LINE
(channels.line)

MS Teams
(channels.msteams)

SlackConfigSchema

SignalConfigSchema

IMessageConfigSchema

GoogleChatConfigSchema

IrcConfigSchema

MSTeamsConfigSchema

WhatsAppConfigSchema
zod-schema.providers-whatsapp.ts

LineConfigSchema
src/line/config-schema.ts
```

Sources: [src/config/zod-schema.providers-core.ts1-35](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L1-L35)[src/plugin-sdk/index.ts176-184](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L176-L184)

---

**Diagram: Core vs Extension Channel Implementations**

```
Extension Monitors (extensions/)

openclaw/plugin-sdk

import

import

import

import

import

Core Monitors (src/)

monitorSlackProvider
src/slack/monitor/provider.ts

createSignalEventHandler
src/signal/monitor/event-handler.ts

monitorIMessageProvider
src/imessage/monitor/monitor-provider.ts

whatsapp monitor
src/web/ + src/whatsapp/

googlechat monitor
src/googlechat/

src/plugin-sdk/index.ts
(re-exports from src/)

extensions/matrix/src/matrix/monitor/handler.ts

extensions/feishu/src/bot.ts

extensions/mattermost/src/mattermost/monitor.ts

extensions/msteams/src/monitor-handler/message-handler.ts

extensions/zalo/src/monitor.ts
```

Sources: [src/plugin-sdk/index.ts1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L1-L100)[extensions/feishu/src/bot.ts1-15](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/feishu/src/bot.ts#L1-L15)[extensions/mattermost/src/mattermost/monitor.ts1-30](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/mattermost/src/mattermost/monitor.ts#L1-L30)[extensions/matrix/src/matrix/monitor/handler.ts1-15](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/matrix/src/matrix/monitor/handler.ts#L1-L15)

---

## Core Channels

### Slack

Provider: `monitorSlackProvider` at [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/provider.ts)
Schema: `SlackConfigSchema` / `SlackAccountSchema` at [src/config/zod-schema.providers-core.ts738-894](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L738-L894)

Slack supports two transport modes. The mode controls which tokens are required.

**Diagram: Slack Dual-Mode Provider Architecture**

```
monitorSlackProvider

HTTP Mode (mode=http)

Socket Mode (mode=socket, default)

WebSocket (xapp- token)

HTTP POST

Slack Cloud

@slack/bolt App

SocketModeReceiver
requires: appToken (xapp-)

HTTPReceiver
requires: signingSecret

webhookPath
(default: /slack/events)

registerSlackMonitorEvents
src/slack/monitor/events.ts

registerSlackMonitorSlashCommands
src/slack/monitor/slash.ts

createSlackMessageHandler
src/slack/monitor/message-handler.ts
```

Sources: [src/slack/monitor/provider.ts44-136](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/provider.ts#L44-L136)

**Key config fields (`SlackAccountSchema`):**
FieldType / DefaultNotes`mode``"socket"` | `"http"` (default `"socket"`)Transport mode`botToken`string`xoxb-...` OAuth bot token`appToken`string`xapp-...` for Socket Mode`signingSecret`stringRequired for `mode="http"``webhookPath`string (default `"/slack/events"`)HTTP inbound endpoint`userToken`stringOptional `xoxp-...` user token`userTokenReadOnly`boolean (default `true`)Restricts user token to reads`groupPolicy``"open"` | `"allowlist"` | `"disabled"` (default `"allowlist"`)Channel access policy`dmPolicy``"pairing"` | `"allowlist"` | `"open"` | `"disabled"`DM access policy`requireMention`booleanRequire `@mention` in channels`streaming``"off"` | `"partial"` | `"block"` | `"progress"`Reply streaming mode`nativeStreaming`booleanEnables Slack native streaming API`replyToMode``"off"` | `"first"` | `"all"`Reply threading behavior`replyToModeByChatType`objectPer-chat-type `replyToMode` override`ackReaction`stringEmoji reaction to send on receipt
**Thread config** (`SlackThreadSchema`):

- `historyScope`: `"thread"` | `"channel"` — whether thread context pulls from thread or parent channel
- `inheritParent`: boolean — inherit parent channel session
- `initialHistoryLimit`: integer

**Per-channel overrides** (`channels.slack.channels.<id>`, `SlackChannelSchema`): `requireMention`, `tools`, `toolsBySender`, `allowBots`, `users`, `skills`, `systemPrompt`

**Slash commands** (`slashCommand`): Optional single slash command with `name` (default `"openclaw"`), `sessionPrefix` (default `"slack:slash"`), `ephemeral`. Native multi-command support requires `channels.slack.commands.native: true`.

**Multi-account:**`channels.slack.accounts` map; named accounts inherit top-level `allowFrom` if their own is unset.

**Validation:** HTTP mode without `signingSecret` is rejected. DM `open` policy requires `allowFrom` to include `"*"`.

Sources: [src/config/zod-schema.providers-core.ts697-894](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L697-L894)[src/slack/monitor/provider.ts59-136](https://github.com/openclaw/openclaw/blob/8090cb4c/src/slack/monitor/provider.ts#L59-L136)

---

### Signal

Schema: `SignalConfigSchema` extends `SignalAccountSchemaBase` at [src/config/zod-schema.providers-core.ts896-991](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L896-L991)
Event handler: `createSignalEventHandler` at [src/signal/monitor/event-handler.ts55](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor/event-handler.ts#L55-L55)

Signal requires an external **signal-cli** daemon. OpenClaw connects to it via HTTP API or spawns it directly.

**Diagram: Signal-CLI Integration**

```
src/signal/

signal-cli (external)

Signal E2E encryption

localhost

inbound events

outbound replies

typing indicator

Signal Network

signal-cli process

JSON-RPC HTTP API

createSignalEventHandler
src/signal/monitor/event-handler.ts

handleSignalDirectMessageAccess
src/signal/monitor/access-policy.ts

sendMessageSignal
Src/signal/send.ts

sendTypingSignal
src/signal/send.ts
```

Sources: [src/signal/monitor/event-handler.ts55-180](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor/event-handler.ts#L55-L180)

**Key config fields (`SignalAccountSchemaBase`):**
FieldType / DefaultNotes`account`stringSignal phone number (E.164)`httpUrl`stringsignal-cli HTTP endpoint (e.g. `http://127.0.0.1:8080`)`httpHost` / `httpPort`string / integerAlternative to `httpUrl``cliPath`stringPath to signal-cli binary`autoStart`booleanAuto-start signal-cli`startupTimeoutMs`integer (1000–120000)Startup wait timeout`receiveMode``"on-start"` | `"manual"`When to begin receiving`ignoreAttachments`booleanSkip inbound attachments`ignoreStories`booleanSkip Signal Stories`sendReadReceipts`booleanSend read receipts`reactionNotifications``"off"` | `"own"` | `"all"` | `"allowlist"`Emoji reaction handling`reactionLevel``"off"` | `"ack"` | `"minimal"` | `"extensive"`Ack reaction verbosity`dmPolicy`(default `"pairing"`)DM access policy`groupPolicy`(default `"allowlist"`)Group access policy
Inbound debouncing (`resolveInboundDebounceMs`) is applied before dispatch. Mention patterns from `buildMentionRegexes` gate group messages when `requireMention` is set.

Sources: [src/config/zod-schema.providers-core.ts896-991](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L896-L991)[src/signal/monitor/event-handler.ts55-100](https://github.com/openclaw/openclaw/blob/8090cb4c/src/signal/monitor/event-handler.ts#L55-L100)

---

### iMessage and BlueBubbles

Two integration paths for Apple Messages exist:
ApproachConfig KeyBackendLocationimsg`channels.imessage``imsg` JSON-RPC CLI`src/imessage/`BlueBubbles`channels.bluebubbles`BlueBubbles server app (macOS)`src/bluebubbles/`
The `imsg` path uses `monitorIMessageProvider` at [src/imessage/monitor/monitor-provider.ts84](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor/monitor-provider.ts#L84-L84)

**Key config fields (iMessage / `IMessageConfigSchema`):**
FieldNotes`cliPath`Path to `imsg` binary (default `"imsg"`)`dbPath`iMessage SQLite database path`includeAttachments`Download and pass inbound attachments`remoteHost`SSH host for remote-Mac setups; auto-detected from SSH wrapper scripts at `cliPath``probeTimeoutMs`Startup probe timeout (`DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS`)`dmPolicy`Default `pairing``groupPolicy`Default from config; group chats use `groupAllowFrom`
**Attachment security:**`resolveIMessageAttachmentRoots` and `resolveIMessageRemoteAttachmentRoots` define allowed file roots. Each inbound attachment path is validated via `isInboundPathAllowed` before passing to the agent.

**Inbound debouncing:** Enabled via `createInboundDebouncer`. Consecutive messages from the same sender in the same conversation are coalesced into a single agent turn when no media or control commands are present.

**BlueBubbles:** Distinct channel integration. The plugin SDK exports:

- `BLUEBUBBLES_ACTIONS`, `BLUEBUBBLES_ACTION_NAMES`, `BLUEBUBBLES_GROUP_ACTIONS` from `src/channels/plugins/bluebubbles-actions.ts`
- `resolveBlueBubblesGroupRequireMention`, `resolveBlueBubblesGroupToolPolicy` from `src/channels/plugins/group-mentions.ts`
- `collectBlueBubblesStatusIssues` from `src/channels/plugins/status-issues/bluebubbles.ts`

Sources: [src/imessage/monitor/monitor-provider.ts84-200](https://github.com/openclaw/openclaw/blob/8090cb4c/src/imessage/monitor/monitor-provider.ts#L84-L200)[src/plugin-sdk/index.ts6-8](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L6-L8)

---

### WhatsApp

Config key: `channels.whatsapp`
Schema: `WhatsAppConfigSchema` at `src/config/zod-schema.providers-whatsapp.ts`
Implementation: `src/web/`, `src/whatsapp/`; onboarding via `whatsappOnboardingAdapter`

WhatsApp integration uses Baileys (WhatsApp Web protocol). The gateway owns linked WhatsApp sessions.

Shared plugin SDK helpers:

- `isWhatsAppGroupJid`, `normalizeWhatsAppTarget` — JID normalization
- `resolveWhatsAppOutboundTarget` — outbound target resolution
- `normalizeWhatsAppAllowFromEntries` — allow-from list normalization
- `resolveWhatsAppGroupIntroHint`, `resolveWhatsAppMentionStripPatterns` — group behavior
- `resolveWhatsAppHeartbeatRecipients` — heartbeat delivery targets
- `collectWhatsAppStatusIssues` — health check issues

Access control uses `resolveWhatsAppGroupRequireMention` and `resolveWhatsAppGroupToolPolicy` (same pattern as other channels).

Sources: [src/plugin-sdk/index.ts544-558](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L544-L558)

---

### Google Chat

Schema: `GoogleChatConfigSchema` at [src/config/zod-schema.providers-core.ts692-695](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L692-L695)
Account schema: `GoogleChatAccountSchema` at [src/config/zod-schema.providers-core.ts646-690](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L646-L690)

Google Chat uses a GCP service account for authentication. Inbound events arrive via webhook.

**Key config fields (`GoogleChatAccountSchema`):**
FieldNotes`serviceAccount`GCP service account — JSON object, path string, or `SecretRef``serviceAccountRef`Alternative `SecretRef` form`serviceAccountFile`File path alternative`audienceType``"app-url"` | `"project-number"``audience`Audience value for token validation`webhookPath`Inbound webhook route`webhookUrl`Public URL for event delivery`botUser`Bot email, used for `@mention` detection`typingIndicator``"none"` | `"message"` | `"reaction"``streamMode``"replace"` (default) | `"status_final"` | `"append"``requireMention`Global mention gate`groupPolicy`Default `"allowlist"`
**Per-group config** (`GoogleChatGroupSchema`): `enabled`, `allow`, `requireMention`, `users`, `systemPrompt`

**DM config** (`GoogleChatDmSchema`): `enabled`, `policy`, `allowFrom` with the same `open`/`allowlist` validation rules as other channels.

**Multi-account:**`GoogleChatConfigSchema` extends `GoogleChatAccountSchema` with `accounts` map and `defaultAccount` selector.

Sources: [src/config/zod-schema.providers-core.ts610-695](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L610-L695)

---

### IRC

Config key: `channels.irc`
Schema: `IrcConfigSchema` in `src/config/zod-schema.providers-core.ts` (line 993+)
Implementation: `src/irc/`

Per-channel group config (`IrcGroupSchema`) supports `requireMention`, `tools`, and `toolsBySender`, following the same schema pattern as other group-aware channels.

Sources: [src/config/zod-schema.providers-core.ts993](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/zod-schema.providers-core.ts#L993-L993)

---

### LINE

Config key: `channels.line`
Schema: `LineConfigSchema` from `src/line/config-schema.ts`
Account resolution: `resolveLineAccount` from `src/line/accounts.ts`
Types: `LineConfig`, `LineAccountConfig`, `ResolvedLineAccount`, `LineChannelData` from `src/line/types.ts`

LINE supports rich **Flex Messages**. The `src/line/flex-templates.ts` module provides builder helpers:
FunctionPurpose`createInfoCard`Info panel card`createListCard`List layout card`createImageCard`Image with caption`createActionCard`Card with action buttons`createReceiptCard`Receipt/summary card
Outbound markdown is converted to LINE format via `processLineMessage` in `src/line/markdown-to-line.ts`. Detection of convertible content uses `hasMarkdownToConvert`; plain-text fallback uses `stripMarkdown`.

Sources: [src/plugin-sdk/index.ts562-591](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L562-L591)

---

## Extension Channels

Extension channels are independent packages that import from `openclaw/plugin-sdk`. The SDK re-exports utilities from the core package including pairing access, group policy resolution, history management, typing callbacks, and plugin runtime creation.

**Diagram: Extension Channel SDK Dependency Pattern**

```
extensions/matrix/src/matrix/monitor/handler.ts

extensions/mattermost/src/mattermost/monitor.ts

extensions/feishu/src/bot.ts

openclaw/plugin-sdk (src/plugin-sdk/index.ts)

createScopedPairingAccess

resolveOpenProviderRuntimeGroupPolicy
resolveDefaultGroupPolicy

buildPendingHistoryContextFromMap
recordPendingHistoryEntryIfEnabled

createTypingCallbacks

createReplyPrefixOptions

resolveDmGroupAccessWithLists
readStoreAllowFromForDmPolicy

resolveOpenProviderRuntimeGroupPolicy
buildPendingHistoryContextFromMap
createDedupeCache

createScopedPairingAccess
createTypingCallbacks
resolveDmGroupAccessWithLists
DEFAULT_GROUP_HISTORY_LIMIT

createScopedPairingAccess
createTypingCallbacks
formatAllowlistMatchMeta
resolveControlCommandGate
```

Sources: [extensions/feishu/src/bot.ts1-13](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/feishu/src/bot.ts#L1-L13)[extensions/mattermost/src/mattermost/monitor.ts1-30](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/mattermost/src/mattermost/monitor.ts#L1-L30)[extensions/matrix/src/matrix/monitor/handler.ts1-15](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/matrix/src/matrix/monitor/handler.ts#L1-L15)

---

### Matrix

Location: `extensions/matrix/`
Handler: `extensions/matrix/src/matrix/monitor/handler.ts`
Library: `@vector-im/matrix-bot-sdk` (`MatrixClient`)

**Key handler parameters (`MatrixMonitorHandlerParams`):**
FieldTypeNotes`dmPolicy``"open"` | `"pairing"` | `"allowlist"` | `"disabled"`DM access policy`groupPolicy``"open"` | `"allowlist"` | `"disabled"`Room access policy`threadReplies``"off"` | `"inbound"` | `"always"`Thread reply routing`replyToMode``ReplyToMode`Reply threading behavior`startupMs`numberGateway start timestamp`startupGraceMs`numberIgnore messages before `startupMs + startupGraceMs``roomsConfig``Record<string, MatrixRoomConfig>`Per-room config`dmEnabled`booleanEnable DM rooms`textLimit`numberMax outbound text length`mediaMaxBytes`numberMax inbound media size
**Supported inbound event types:**

- Standard text messages
- Poll start events (`isPollStartType`, `parsePollStartContent`)
- Location events (`resolveMatrixLocation`) → `NormalizedLocation`
- Media attachments (`downloadMatrixMedia`)

**Threading:** Thread root tracked via `resolveMatrixThreadRootId`. Delivery target resolved by `resolveMatrixThreadTarget`. When `threadReplies: "always"`, all replies go into threads; `"inbound"` only threads replies to in-thread messages.

**Access:**`resolveMatrixAllowListMatch`, `resolveMatrixAllowListMatches`, `enforceMatrixDirectMessageAccess`, `resolveMatrixAccessState`.

Sources: [extensions/matrix/src/matrix/monitor/handler.ts44-76](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/matrix/src/matrix/monitor/handler.ts#L44-L76)

---

### Feishu (Lark)

Location: `extensions/feishu/`
Bot handler: `extensions/feishu/src/bot.ts`
API client: `createFeishuClient` from `extensions/feishu/src/client.ts`

Chat type is determined by `message.chat_type`: `"p2p"` (direct) vs `"group"`.

**Supported message types:**
`message_type`ParsingMedia Downloaded`text`JSON `.text` fieldNo`post``parsePostContent` — extracts text, links, mentions, embedded imagesImages via `downloadMessageResourceFeishu``image``parseMediaKeys` → `image_key`Yes`file``parseMediaKeys` → `file_key`Yes`audio``parseMediaKeys` → `file_key`Yes`video`Both `file_key` (video) and `image_key` (thumbnail)Yes`sticker``parseMediaKeys` → `file_key`Yes
**Mention handling:**`checkBotMentioned` inspects `message.mentions` or post content `at` tags. `stripBotMention` removes bot mention markers from processed text.

**Sender name resolution:**`resolveFeishuSenderName` calls `contact/v3/users/:user_id` API. Results cached with 10-minute TTL (`SENDER_NAME_TTL_MS = 10 * 60 * 1000`). Permission error code `99991672` (missing contact scope) is caught and surfaces a grant URL.

**Permission error deduplication:**`permissionErrorNotifiedAt` map throttles repeated notifications with a 5-minute cooldown (`PERMISSION_ERROR_COOLDOWN_MS`).

**Policy resolution:**`resolveFeishuGroupConfig`, `resolveFeishuReplyPolicy`, `resolveFeishuAllowlistMatch`, `isFeishuGroupAllowed` from `extensions/feishu/src/policy.ts`.

**Dynamic agents:**`maybeCreateDynamicAgent` from `extensions/feishu/src/dynamic-agent.ts` supports on-demand agent session creation based on group membership.

Sources: [extensions/feishu/src/bot.ts76-136](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/feishu/src/bot.ts#L76-L136)[extensions/feishu/src/bot.ts180-330](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/feishu/src/bot.ts#L180-L330)

---

### Mattermost

Location: `extensions/mattermost/`
Monitor: `monitorMattermostProvider` at `extensions/mattermost/src/mattermost/monitor.ts`

**Required config:**

- `botToken`: Mattermost bot user token
- `baseUrl`: Mattermost server URL

**Diagram: Mattermost WebSocket Connection**

```
monitorMattermostProvider

WebSocket

posted / reaction / etc

not seen

disconnect

reconnect

start

fetchMattermostMe
(resolve bot identity)

createMattermostConnectOnce
(monitor-websocket.ts)

runWithReconnect
(reconnect.ts)

recentInboundMessages
TTL=5min, max=2000

dispatch message
to agent

Mattermost Server
(/api/v4/websocket)
```

Sources: [extensions/mattermost/src/mattermost/monitor.ts167-220](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/mattermost/src/mattermost/monitor.ts#L167-L220)

**Cache constants:**
ConstantValuePurpose`RECENT_MATTERMOST_MESSAGE_TTL_MS`5 minDedup window for inbound messages`RECENT_MATTERMOST_MESSAGE_MAX`2000Max dedup cache entries`CHANNEL_CACHE_TTL_MS`5 minMattermost channel info cache`USER_CACHE_TTL_MS`10 minMattermost user info cache
**Channel type mapping:**`channelKind` maps Mattermost channel type codes:

- `"D"` → `"direct"`
- `"G"` → `"group"`
- other → `"channel"`

System posts (non-empty `post.type` field) are filtered by `isSystemPost`.

**WebSocket URL:**`buildMattermostWsUrl` converts the base URL scheme (`http` → `ws`) and appends `/api/v4/websocket`.

Sources: [extensions/mattermost/src/mattermost/monitor.ts77-166](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/mattermost/src/mattermost/monitor.ts#L77-L166)

---

### MS Teams

Location: `extensions/msteams/`
Handler: `extensions/msteams/src/monitor-handler/message-handler.ts`
Schemas: `MSTeamsConfigSchema`, types `MSTeamsConfig`, `MSTeamsTeamConfig`, `MSTeamsChannelConfig`, `MSTeamsReplyStyle` exported from `src/config/types.ts`

Access control follows the standard pattern from the plugin SDK: `createScopedPairingAccess`, `resolveDmGroupAccessWithLists`, `readStoreAllowFromForDmPolicy`, `resolveDefaultGroupPolicy`, `isDangerousNameMatchingEnabled`.

`MSTeamsReplyStyle` (validated by `MSTeamsReplyStyleSchema`) controls whether replies are posted inline or as new messages.

Per-team and per-channel configuration is available via `MSTeamsTeamConfig` and `MSTeamsChannelConfig`, allowing `requireMention`, `users`, `roles`, and `systemPrompt` overrides per scope.

Sources: [extensions/msteams/src/monitor-handler/message-handler.ts1-15](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/monitor-handler/message-handler.ts#L1-L15)[src/plugin-sdk/index.ts154-161](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugin-sdk/index.ts#L154-L161)

---

### Zalo

Location: `extensions/zalo/`
Monitor: `extensions/zalo/src/monitor.ts`

Zalo integration is webhook-based: Zalo sends HTTP POST events to OpenClaw. The monitor handles inbound event deserialization and dispatches to the agent via the standard Plugin SDK dispatch flow. Outbound replies use `OutboundReplyPayload` from `openclaw/plugin-sdk`. Markdown rendering respects `MarkdownTableMode` from the active config.

Sources: [extensions/zalo/src/monitor.ts1-5](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/zalo/src/monitor.ts#L1-L5)

---

## Common Configuration Patterns

All channels share these behaviors regardless of implementation location. For details on each, see [Channel Architecture & Plugin SDK](/openclaw/openclaw/4.1-channel-architecture-and-plugin-sdk).
PatternConfig FieldsNotesDM access`dmPolicy`, `allowFrom``open` requires `"*"` in `allowFrom`; `allowlist` requires at least one entryGroup access`groupPolicy`, `groupAllowFrom`Default `"allowlist"` fails-closed when provider config is missingMulti-account`accounts` mapNamed accounts inherit top-level `allowFrom` when their own is unsetHistory`historyLimit`, `dmHistoryLimit`, `dms[].historyLimit`Controls context window for group/DM sessionsMedia`mediaMaxMb`Caps inbound media download sizeAck reactions`ackReaction`Emoji sent while processing; falls back to agent identity emojiText chunking`textChunkLimit`, `chunkMode``"length"` or `"newline"` splitting for outbound messages

---

# Control-UI

# Control UI
Relevant source files
- [scripts/protocol-gen-swift.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/protocol-gen-swift.ts)
- [src/discord/monitor/thread-bindings.shared-state.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/discord/monitor/thread-bindings.shared-state.test.ts)
- [src/gateway/protocol/index.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/index.ts)
- [src/gateway/protocol/schema.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema.ts)
- [src/gateway/protocol/schema/protocol-schemas.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/protocol-schemas.ts)
- [src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/protocol/schema/types.ts)
- [src/gateway/server-methods-list.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods-list.ts)
- [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server-methods.ts)
- [src/gateway/server.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/server.ts)
- [ui/src/styles.css](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/styles.css)
- [ui/src/styles/base.css](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/styles/base.css)
- [ui/src/styles/chat/layout.css](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/styles/chat/layout.css)
- [ui/src/styles/components.css](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/styles/components.css)
- [ui/src/styles/layout.css](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/styles/layout.css)
- [ui/src/styles/layout.mobile.css](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/styles/layout.mobile.css)
- [ui/src/ui/app-chat.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-chat.ts)
- [ui/src/ui/app-gateway.node.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-gateway.node.test.ts)
- [ui/src/ui/app-gateway.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-gateway.ts)
- [ui/src/ui/app-lifecycle.node.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-lifecycle.node.test.ts)
- [ui/src/ui/app-lifecycle.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-lifecycle.ts)
- [ui/src/ui/app-polling.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-polling.ts)
- [ui/src/ui/app-render.helpers.node.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-render.helpers.node.test.ts)
- [ui/src/ui/app-render.helpers.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-render.helpers.ts)
- [ui/src/ui/app-render.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-render.ts)
- [ui/src/ui/app-settings.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-settings.test.ts)
- [ui/src/ui/app-settings.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-settings.ts)
- [ui/src/ui/app-tool-stream.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-tool-stream.ts)
- [ui/src/ui/app-view-state.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-view-state.ts)
- [ui/src/ui/app.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts)
- [ui/src/ui/chat/copy-as-markdown.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/chat/copy-as-markdown.ts)
- [ui/src/ui/controllers/chat.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/controllers/chat.test.ts)
- [ui/src/ui/controllers/chat.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/controllers/chat.ts)
- [ui/src/ui/gateway.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/gateway.ts)
- [ui/src/ui/icons.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/icons.ts)
- [ui/src/ui/navigation.browser.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/navigation.browser.test.ts)
- [ui/src/ui/storage.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/storage.ts)
- [ui/src/ui/theme-transition.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/theme-transition.ts)
- [ui/src/ui/theme.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/theme.ts)
- [ui/src/ui/views/chat.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/views/chat.ts)

The Control UI is the browser-based single-page application (SPA) that provides a dashboard for the OpenClaw Gateway. It runs in a standard web browser and communicates with the Gateway exclusively over a WebSocket connection. This page covers the SPA's component architecture, state management, Gateway client, view routing, settings persistence, and theming system.

For information about the Gateway WebSocket protocol the UI connects to, see [WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol). For details on authentication modes used during the connect handshake, see [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing). For the native iOS/macOS/Android node clients (which are a distinct type of Gateway client), see [Native Clients (Nodes)](/openclaw/openclaw/6-native-clients-(nodes)).

---

## Architecture Overview

The UI is a LitElement SPA served by the Gateway's HTTP server. All data flows through a single WebSocket connection managed by `GatewayBrowserClient`.

**Component and Data Flow Diagram**

```
Gateway

Browser

implements

calls

delegates to

call

use

WebSocket RPC

events + responses

onHello / onEvent / onClose

reads/writes

OpenClawApp
(openclaw-app custom element)
ui/src/ui/app.ts

AppViewState
(view interface)
ui/src/ui/app-view-state.ts

renderApp()
ui/src/ui/app-render.ts

GatewayBrowserClient
ui/src/ui/gateway.ts

UiSettings
(localStorage)
ui/src/ui/storage.ts

Per-view renderers
ui/src/ui/views/*.ts

Controllers
ui/src/ui/controllers/*.ts

GatewayServer
ws://127.0.0.1:18789
```

Sources: [ui/src/ui/app.ts1-616](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L1-L616)[ui/src/ui/app-view-state.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-view-state.ts#L1-L50)[ui/src/ui/app-render.ts1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-render.ts#L1-L100)[ui/src/ui/gateway.ts1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/gateway.ts#L1-L100)[ui/src/ui/storage.ts1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/storage.ts#L1-L50)

---

## `OpenClawApp` Component

`OpenClawApp` is the root LitElement custom element registered as `openclaw-app`[ui/src/ui/app.ts110-616](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L110-L616) It is the single instance of the application and holds all reactive state as `@state()` decorated properties.

It **does not** use Shadow DOM — `createRenderRoot()` returns `this`[ui/src/ui/app.ts392-394](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L392-L394) — so styles are applied globally.

### Lifecycle
Lifecycle MethodHandler`connectedCallback``handleConnected` in `app-lifecycle.ts``firstUpdated``handleFirstUpdated` in `app-lifecycle.ts``updated``handleUpdated` in `app-lifecycle.ts``disconnectedCallback``handleDisconnected` in `app-lifecycle.ts`
The `firstUpdated` hook is where the Gateway connection is initiated and URL-based settings (`token`, `session`, `gatewayUrl` query params) are consumed via `applySettingsFromUrl`[ui/src/ui/app-settings.ts89-149](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-settings.ts#L89-L149)

### `AppViewState` Interface

Rather than passing `this` (the `OpenClawApp` instance) directly to rendering and controller functions, the code casts to `AppViewState`[ui/src/ui/app-view-state.ts47](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-view-state.ts#L47-LNaN) a structural type that describes only the fields and methods needed for rendering and data loading. This pattern decouples the view layer from the component class.

`renderApp` is called as `renderApp(this as unknown as AppViewState)`[ui/src/ui/app.ts613-615](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L613-L615)

---

## State Management

### Reactive State (`@state()`)

`OpenClawApp` declares all UI state as `@state()` properties, grouped by feature domain:
DomainKey Properties**Connection**`connected`, `hello`, `lastError`, `lastErrorCode`, `client`**Chat**`chatMessages`, `chatStream`, `chatStreamStartedAt`, `chatSending`, `chatRunId`, `chatQueue`, `chatAttachments`**Sessions**`sessionsResult`, `sessionsLoading`, `sessionsFilterActive`, `sessionsFilterLimit`**Agents**`agentsList`, `agentsSelectedId`, `agentsPanel`, `agentFilesList`, `agentIdentityById`**Cron**`cronJobs`, `cronStatus`, `cronForm`, `cronRuns`, `cronFieldErrors`**Config**`configSnapshot`, `configSchema`, `configForm`, `configFormDirty`**Nodes/Devices**`nodes`, `devicesList`, `execApprovalsForm`, `execApprovalQueue`**Logs**`logsEntries`, `logsLevelFilters`, `logsAtBottom`**Skills**`skillsReport`, `skillEdits`, `skillMessages`**Usage**`usageResult`, `usageCostSummary`, `usageTimeSeries`**UI**`tab`, `theme`, `themeResolved`, `settings`, `onboarding`, `sidebarOpen`, `splitRatio`
Sources: [ui/src/ui/app.ts113-385](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L113-L385)

### Settings Persistence (`UiSettings`)

Settings that survive page reloads are persisted to `localStorage` under the key `openclaw.control.settings.v1`. The `UiSettings` type is:

```
type UiSettings = {
  gatewayUrl: string;           // ws:// or wss:// URL of the Gateway
  token: string;                // shared auth token
  sessionKey: string;           // last selected chat session key
  lastActiveSessionKey: string; // most recently active chat session key
  theme: ThemeMode;             // "dark" | "light" | "system"
  chatFocusMode: boolean;       // hides nav/header in chat view
  chatShowThinking: boolean;    // shows tool result messages
  splitRatio: number;           // sidebar split ratio (0.4–0.7)
  navCollapsed: boolean;        // whether the sidebar nav is hidden
  navGroupsCollapsed: Record<string, boolean>; // per-group collapse state
  locale?: string;              // UI language code
};
```

`loadSettings()` is called at component construction time. `saveSettings()` is called by `applySettings()` on every settings mutation [ui/src/ui/storage.ts20](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/storage.ts#L20-LNaN)[ui/src/ui/app-settings.ts64-76](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-settings.ts#L64-L76)

---

## `GatewayBrowserClient`

`GatewayBrowserClient`[ui/src/ui/gateway.ts94](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/gateway.ts#L94-LNaN) is the WebSocket client class. Each call to `connectGateway()`[ui/src/ui/app-gateway.ts139-214](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-gateway.ts#L139-L214) creates a new instance and stops the previous one.

### Connection Lifecycle

```
Gateway WebSocket
GatewayBrowserClient
OpenClawApp
Gateway WebSocket
GatewayBrowserClient
OpenClawApp
loop
["RPC calls"]
"start()"
"WebSocket open"
"queueConnect()"
"RequestFrame {method: 'connect.challenge'}"
"EventFrame {event: 'connect.challenge', nonce}"
"connect frame (token/password/device signature)"
"hello-ok {snapshot, features, auth}"
"onHello(hello)"
"applySnapshot(), load initial data"
"request(method, params)"
"RequestFrame"
"ResponseFrame"
"Promise resolved"
"EventFrame {event, payload, seq}"
"onEvent(evt)"
```

### Authentication

The client sends one of:

- **Shared token**: `auth.token` from `UiSettings.token`
- **Device token**: Rotated token derived from a browser-generated ECDSA keypair stored in `IndexedDB` (only in secure contexts where `crypto.subtle` is available)
- **Password**: `auth.password`

The device identity is managed by `loadOrCreateDeviceIdentity()` and `signDevicePayload()`[ui/src/ui/gateway.ts161-213](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/gateway.ts#L161-L213) The device token received in the `hello-ok` response is stored locally via `storeDeviceAuthToken()` for future connections.

### Reconnection

`GatewayBrowserClient` reconnects automatically on close, with exponential backoff starting at 800ms and capping at 15 seconds [ui/src/ui/gateway.ts145-152](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/gateway.ts#L145-L152)

Sources: [ui/src/ui/gateway.ts94-330](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/gateway.ts#L94-L330)[ui/src/ui/app-gateway.ts139-214](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-gateway.ts#L139-L214)

---

## Navigation and Views

Navigation is URL-path-based. The current tab is derived from `window.location.pathname` on load and updated via `history.pushState` when tabs are switched. The `onPopState` handler keeps tab state synchronized with browser history [ui/src/ui/app-settings.ts151-170](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-settings.ts#L151-L170)

**Tab-to-View Mapping**

```
View Renderers (ui/src/ui/views/)

Tabs (Tab type)

chat

overview

channels

instances

sessions

usage

cron

agents

skills

nodes

logs

debug

renderChat()
chat.ts

renderOverview()
overview.ts

renderChannels()
channels.ts

renderInstances()
instances.ts

renderSessions()
sessions.ts

renderUsageTab()
app-render-usage-tab.ts

renderCron()
cron.ts

renderAgents()
agents.ts

renderSkills()
skills.ts

renderNodes()
nodes.ts

renderLogs()
logs.ts

renderDebug()
debug.ts
```

Sources: [ui/src/ui/app-render.ts328-950](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-render.ts#L328-L950)[ui/src/ui/app-settings.ts186-244](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-settings.ts#L186-L244)

### Tab Groups

The navigation sidebar organizes tabs into collapsible groups via `TAB_GROUPS` from `navigation.ts`. Each group label maps to a `navGroupsCollapsed` entry in `UiSettings`, so collapse state survives page reloads [ui/src/ui/app-render.ts259-302](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-render.ts#L259-L302)

### Data Loading on Tab Switch

When `setTab()` is called, `refreshActiveTab()`[ui/src/ui/app-settings.ts186-244](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-settings.ts#L186-L244) loads the relevant data for the newly active tab:
TabData Loaded`overview``loadOverview()` (presence count, sessions count, cron status)`channels``loadChannels()``instances``loadPresence()``sessions``loadSessions()``cron``loadCronStatus()`, `loadCronJobs()`, `loadCronRuns()``agents``loadAgents()`, `loadToolsCatalog()`, `loadConfig()`, `loadAgentIdentities()``nodes``loadNodes()`, `loadDevices()`, `loadConfig()`, `loadExecApprovals()``chat``refreshChat()`, scroll to bottom`logs``loadLogs()`, starts polling interval`debug``loadDebug()`, starts polling interval`skills``loadSkills()`
---

## Shell Layout

The UI uses a CSS Grid shell defined in [ui/src/styles/layout.css1-50](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/styles/layout.css#L1-L50) The top-level structure is:

```
┌────────────────────────────────────────────┐
│  .topbar   (56px, spans full width)        │
├───────────────┬────────────────────────────┤
│  .nav         │  .content                  │
│  (220px wide) │  (fills remaining width)   │
│               │                            │
└───────────────┴────────────────────────────┘

```

CSS class modifiers on `.shell`:
ClassEffect`.shell--nav-collapsed`Sets `grid-template-columns: 0px 1fr`, hides nav`.shell--chat-focus`Collapses nav and topbar; full-screen chat`.shell--chat`Prevents overflow scrolling on the shell`.shell--onboarding`Hides topbar row (`grid-template-rows: 0 1fr`)
Sources: [ui/src/styles/layout.css1-622](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/styles/layout.css#L1-L622)

### Chat View Layout

When `tab === "chat"`, the main content area switches to a flex column layout (`.content--chat`). The chat view itself [ui/src/ui/views/chat.ts240-480](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/views/chat.ts#L240-L480) contains:

- **`.chat-thread`** — scrollable message history
- **`.chat-split-container`** — optional side-by-side markdown sidebar (resizable with `resizable-divider` custom element)
- **`.chat-compose`** — sticky compose area with textarea and send/abort buttons
- **Compaction/fallback indicators** — transient status toasts rendered by `renderCompactionIndicator()` and `renderFallbackIndicator()`

The sidebar split ratio is user-adjustable (range 0.4–0.7) and stored in `UiSettings.splitRatio`[ui/src/ui/app.ts607-611](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L607-L611)

---

## Gateway Event Handling

Incoming events from the Gateway are handled by `handleGatewayEvent()` in `app-gateway.ts`[ui/src/ui/app-gateway.ts216-328](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-gateway.ts#L216-L328)

**Event dispatch diagram:**

```
'agent'

'chat'

'presence'

'cron'

'device.pair.*'

'exec.approval.requested'

'exec.approval.resolved'

GATEWAY_EVENT_UPDATE_AVAILABLE

EventFrame from GatewayBrowserClient.onEvent()

Append to eventLogBuffer (capped at 250)

evt.event

handleAgentEvent()
app-tool-stream.ts
(updates tool stream state)

handleChatEvent()
controllers/chat.ts
(updates chatMessages, chatStream)

host.presenceEntries = payload.presence

loadCron() if tab === 'cron'

loadDevices()

addExecApproval()
shows approval prompt

removeExecApproval()

host.updateAvailable = payload
```

Sources: [ui/src/ui/app-gateway.ts260-328](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-gateway.ts#L260-L328)

### Chat Event States

`handleChatEvent()`[ui/src/ui/controllers/chat.ts220-285](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/controllers/chat.ts#L220-L285) processes `ChatEventPayload` with these state values:
`payload.state`Effect on UI`"delta"`Appends streamed text to `chatStream``"final"`Moves final message to `chatMessages`, clears `chatStream``"aborted"`Moves aborted message content to `chatMessages`, clears stream`"error"`Sets `lastError`, clears stream
After a terminal event (`final`, `error`, `aborted`), `resetToolStream()` is called and any queued chat messages are flushed via `flushChatQueueForEvent()`[ui/src/ui/app-gateway.ts224-244](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-gateway.ts#L224-L244)

---

## Theming

The theme system supports three modes defined in `ThemeMode`[ui/src/ui/theme.ts1](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/theme.ts#L1-LNaN): `"dark"`, `"light"`, and `"system"`. The resolved theme (`"dark"` or `"light"`) is written as a `data-theme` attribute on `:root`, which switches between two CSS variable sets defined in `base.css`[ui/src/styles/base.css1](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/styles/base.css#L1-LNaN)

- Dark mode uses `--bg: #12141a`, `--accent: #ff5c5c` (red)
- Light mode overrides are declared under `:root[data-theme="light"]`

The theme toggle widget (three-button dark/light/system selector) is rendered by `renderThemeToggle()` in `app-render.helpers.ts` and displayed in the topbar. When "system" is selected, a `MediaQueryList` listener on `prefers-color-scheme` drives automatic switching [ui/src/ui/app-settings.ts172-184](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-settings.ts#L172-L184)

Theme changes are animated via `startThemeTransition()`[ui/src/ui/app-lifecycle.ts1](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-lifecycle.ts#L1-LNaN)

---

## Agents View — Sub-panel Structure

The Agents tab is more complex than other tabs: it has an internal panel switcher within the view. The `agentsPanel` state field selects among:
PanelContents`"overview"`Agent identity, model selection, model fallbacks`"files"`Agent workspace files (AGENTS.md, SOUL.md, etc.) editor`"tools"`Tools catalog and tool policy controls`"skills"`Installed skills with enable/disable toggles`"channels"`Channel status filtered to the selected agent`"cron"`Cron jobs for the selected agent
Config mutations from the agents view (model changes, tool profile, skill enable/disable) use `updateConfigFormValue()` / `removeConfigFormValue()` to patch `configForm` in memory, then call `saveConfig()` to persist via the Gateway's `config.patch` RPC [ui/src/ui/app-render.ts639-869](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-render.ts#L639-L869)

Sources: [ui/src/ui/app-render.ts513-871](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-render.ts#L513-L871)[ui/src/ui/app.ts224-239](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L224-L239)

---

## Exec Approval Prompt

When an agent requests exec approval (e.g., before running a shell command), the Gateway emits `exec.approval.requested`. The UI queues these in `execApprovalQueue`[ui/src/ui/app.ts174-175](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L174-L175) and renders a modal prompt via `renderExecApprovalPrompt()`[ui/src/ui/app-render.ts74](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-render.ts#L74-L74)

The operator can respond with `allow-once`, `allow-always`, or `deny`. This calls the `exec.approval.resolve` RPC method [ui/src/ui/app.ts543-561](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L543-L561) Approvals expire automatically — a `setTimeout` removes them from the queue at their `expiresAtMs`[ui/src/ui/app-gateway.ts306-313](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-gateway.ts#L306-L313)

---

## URL-Based Configuration Injection

On initial load, the app reads the following query parameters (then strips them from the URL):
ParameterEffect`token`Sets `UiSettings.token``session`Sets the active session key`gatewayUrl`Prompts the user to confirm switching gateway URLs`password`Stripped only (never persisted)`onboarding=1`Activates onboarding mode (hides topbar, collapses nav)
Sources: [ui/src/ui/app-settings.ts89-149](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app-settings.ts#L89-L149)[ui/src/ui/app.ts97-108](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/src/ui/app.ts#L97-L108)

---

## Key File Index
FileRole`ui/src/ui/app.ts``OpenClawApp` LitElement root component`ui/src/ui/app-view-state.ts``AppViewState` structural type for rendering`ui/src/ui/app-render.ts``renderApp()` — top-level render function`ui/src/ui/app-gateway.ts``connectGateway()`, `handleGatewayEvent()``ui/src/ui/gateway.ts``GatewayBrowserClient` WebSocket client`ui/src/ui/storage.ts``UiSettings`, `loadSettings()`, `saveSettings()``ui/src/ui/app-settings.ts``setTab()`, `applySettings()`, `refreshActiveTab()``ui/src/ui/app-lifecycle.ts`LitElement lifecycle handlers`ui/src/ui/app-chat.ts`Chat message sending/queueing logic`ui/src/ui/navigation.ts``TAB_GROUPS`, `pathForTab()`, `tabFromPath()``ui/src/ui/views/*.ts`Per-tab view renderers`ui/src/ui/controllers/*.ts`Data-loading functions calling `GatewayBrowserClient``ui/src/styles/base.css`CSS design tokens (colors, typography, spacing)`ui/src/styles/layout.css`Shell grid and topbar/nav/content layout`ui/src/styles/components.css`Shared components (buttons, cards, forms, pills)`ui/src/styles/chat/layout.css`Chat-specific layout

---

# Native-Clients-(Nodes)

# Native Clients (Nodes)
Relevant source files
- [.npmrc](https://github.com/openclaw/openclaw/blob/8090cb4c/.npmrc)
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md)
- [Swabble/Package.resolved](https://github.com/openclaw/openclaw/blob/8090cb4c/Swabble/Package.resolved)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts)
- [apps/ios/ShareExtension/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/ShareExtension/Info.plist)
- [apps/ios/Sources/Chat/IOSGatewayChatTransport.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Chat/IOSGatewayChatTransport.swift)
- [apps/ios/Sources/Gateway/GatewayConnectionController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Info.plist)
- [apps/ios/Sources/Location/LocationService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Location/LocationService.swift)
- [apps/ios/Sources/Model/NodeAppModel.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift)
- [apps/ios/Sources/Motion/MotionService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Motion/MotionService.swift)
- [apps/ios/Sources/Onboarding/OnboardingWizardView.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Onboarding/OnboardingWizardView.swift)
- [apps/ios/Sources/OpenClawApp.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/OpenClawApp.swift)
- [apps/ios/Sources/Reminders/RemindersService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Reminders/RemindersService.swift)
- [apps/ios/Sources/RootCanvas.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootCanvas.swift)
- [apps/ios/Sources/RootTabs.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootTabs.swift)
- [apps/ios/Sources/Screen/ScreenController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenController.swift)
- [apps/ios/Sources/Screen/ScreenTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenTab.swift)
- [apps/ios/Sources/Services/NodeServiceProtocols.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/NodeServiceProtocols.swift)
- [apps/ios/Sources/Services/WatchMessagingService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/WatchMessagingService.swift)
- [apps/ios/Sources/Settings/SettingsTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Settings/SettingsTab.swift)
- [apps/ios/Sources/Status/StatusPill.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/StatusPill.swift)
- [apps/ios/Sources/Status/VoiceWakeToast.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/VoiceWakeToast.swift)
- [apps/ios/Sources/Voice/TalkModeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/TalkModeManager.swift)
- [apps/ios/Sources/Voice/VoiceWakeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/VoiceWakeManager.swift)
- [apps/ios/SwiftSources.input.xcfilelist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/SwiftSources.input.xcfilelist)
- [apps/ios/Tests/GatewayConnectionControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/GatewayConnectionControllerTests.swift)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/Info.plist)
- [apps/ios/Tests/NodeAppModelInvokeTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/NodeAppModelInvokeTests.swift)
- [apps/ios/Tests/ScreenControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/ScreenControllerTests.swift)
- [apps/ios/WatchApp/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/WatchApp/Info.plist)
- [apps/ios/WatchExtension/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/WatchExtension/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/project.yml)
- [apps/macos/Package.resolved](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.resolved)
- [apps/macos/Package.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift)
- [docs/gateway/pairing.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/pairing.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/platforms/mac/release.md)
- [extensions/memory-lancedb/package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/memory-lancedb/package.json)
- [package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-lock.yaml)
- [pnpm-workspace.yaml](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-workspace.yaml)
- [src/infra/machine-name.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/machine-name.ts)
- [src/tui/tui-input-history.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/tui/tui-input-history.test.ts)
- [src/tui/tui.submit-handler.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/tui/tui.submit-handler.test.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/package.json)

This page covers the native device node applications — iOS, macOS, and Android — that connect to the OpenClaw Gateway in the `node` role. It describes the connection model, pairing mechanism, dual-session architecture, and device capability system that all three platforms share.

For the **Gateway** itself and its `nodes.*` RPC methods, see page [2](https://github.com/openclaw/openclaw/blob/8090cb4c/2) For iOS-specific detail (voice, camera, canvas), see page [6.1](https://github.com/openclaw/openclaw/blob/8090cb4c/6.1) For the macOS menu bar app and BridgeServer IPC, see page [6.2](https://github.com/openclaw/openclaw/blob/8090cb4c/6.2) For Android-specific capabilities, see page [6.3](https://github.com/openclaw/openclaw/blob/8090cb4c/6.3)

---

## What a Node Is

A *node* is a native app running on a user's device (iPhone, Mac, or Android phone) that connects to the OpenClaw Gateway over WebSocket, identifies itself with the `node` role, and registers a set of *device capabilities* (camera, location, microphone, screen capture, etc.). The Gateway's agent runtime can then invoke these capabilities via `node.invoke` RPC calls — for example, requesting a photo, checking device location, or rendering a web canvas.

Nodes are paired to a specific Gateway instance during setup. After pairing, they reconnect automatically and are treated as trusted hardware extensions of the agent's environment.

---

## System Context

**Node role vs. operator role in the Gateway topology:**

```
GatewayServer

Native Apps (Clawdis)

nodeGateway
(role: node)
WS /ws

operatorGateway
(role: operator)
WS /ws

node + operator sessions

BridgeSession
(role: node)
WS /ws

node.invoke

dispatch to capability

dispatch to capability

dispatch to capability

iOS App
(ai.openclaw.ios)

macOS App
(ai.openclaw.mac)

Android App
(ai.openclaw.android)

WS Message Handler

nodes.* RPC
(status, invoke)

Auth System
(device identity / token)

Agent Runtime
```

Sources: `apps/ios/Sources/Model/NodeAppModel.swift`, system topology diagram

---

## Dual-Connection Architecture (iOS)

The iOS app maintains **two simultaneous WebSocket connections** to the same Gateway, each with a different role:
ConnectionFieldRolePurposePrimary`nodeGateway``node`Receives `node.invoke` requests, handles device capabilitiesSecondary`operatorGateway``operator`Sends chat messages, talk/voice streams, config reads
This separation means the agent can invoke a camera command (via the `node` session) while the user is simultaneously chatting (via the `operator` session) without the two traffic streams interfering.

Both connections are instances of `GatewayNodeSession`, defined in `apps/ios/Sources/`.

[apps/ios/Sources/Model/NodeAppModel.swift95-99](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift#L95-L99)

```
NodeAppModel consumers

GatewayServer

NodeAppModel

transcript send

agent deep links

nodeGateway
(GatewayNodeSession)
role: node

operatorGateway
(GatewayNodeSession)
role: operator

WS Message Handler

NodeCapabilityRouter
(node.invoke dispatch)

TalkModeManager
(voice streaming)

VoiceWakeManager
(wake-word)

ScreenController
(canvas nav)
```

Sources: `apps/ios/Sources/Model/NodeAppModel.swift:95-140`()

---

## Gateway Discovery and TLS Trust (iOS)

Before a node can connect, it must discover the Gateway on the local network and verify its TLS certificate.

**Discovery** uses mDNS/Bonjour. The iOS app registers for the `_openclaw-gw._tcp` service type (declared in `apps/ios/Sources/Info.plist`). The `GatewayDiscoveryModel` class runs the Bonjour scan and emits `DiscoveredGateway` entries.

**TLS trust** is managed by `GatewayConnectionController`. On first connect to a discovered gateway, the app probes the server's TLS fingerprint and presents it to the user for approval via a `TrustPrompt`. Once approved, the fingerprint is stored in `GatewayTLSStore` and subsequent reconnects verify against the stored value — no further user prompts needed.

[apps/ios/Sources/Gateway/GatewayConnectionController.swift20-135](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift#L20-L135)

```
"GatewayServer"
"GatewayTLSStore"
"GatewayConnectionController"
"GatewayDiscoveryModel
(mDNS)"
"iOS App"
"GatewayServer"
"GatewayTLSStore"
"GatewayConnectionController"
"GatewayDiscoveryModel
(mDNS)"
"iOS App"
"start() — scan _openclaw-gw._tcp"
"DiscoveredGateway"
"probeTLSFingerprint(url)"
"SHA-256 fingerprint"
"TrustPrompt (user approval)"
"User approves"
"saveFingerprint(stableID)"
"WebSocket connect (node role)"
"connect.challenge"
"hello (token/identity)"
"hello-ok"
```

Sources: `apps/ios/Sources/Gateway/GatewayConnectionController.swift`, `apps/ios/Sources/Info.plist`, `docs/gateway/pairing.md`

---

## Pairing

Nodes must be *paired* to a Gateway before they can connect. Pairing associates the node's device identity (derived from a keypair) with a Gateway-side allowlist entry.

### Setup Code Flow (iOS)

The primary pairing flow for iOS uses a setup code generated by a bot command (e.g., `/pair` in Telegram):

1. User sends `/pair` to their bot.
2. Bot returns a short setup code.
3. User pastes the code into the iOS Settings tab (`SettingsTab`, `gateway.setupCode` key).
4. App calls `applySetupCodeAndConnect()`, which decodes the embedded Gateway URL, token, and TLS hint from the code.
5. App connects and the Gateway presents a pairing approval request.
6. User runs `/pair approve` in Telegram (or approves via the macOS app) to confirm.

[apps/ios/Sources/Settings/SettingsTab.swift61-99](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Settings/SettingsTab.swift#L61-L99)

### Gateway-Owned Pairing (Option B)

When the macOS app is not present, the Gateway itself manages the approval UI. Pending pairing requests are surfaced via the `nodes.*` RPC namespace and the Control UI. Details are in `docs/gateway/pairing.md`.

Reconnection after a successful pairing uses the stored device identity and token; the Gateway pins the node's `platform` and `deviceFamily` metadata across reconnects to prevent metadata spoofing.

---

## Device Capabilities

Each node registers a set of named capabilities with the Gateway on connect. The Gateway's agent runtime can call `node.invoke` with a capability name and parameters, and the node dispatches to its local handler.

**iOS capability routing** goes through `NodeCapabilityRouter`, which is built lazily on first connect:

[apps/ios/Sources/Model/NodeAppModel.swift103](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift#L103-L103)

### iOS Capabilities
CapabilityService ClassCamera (photo, clip, list)`CameraController` / `CameraServicing`Screen capture / canvas`ScreenController`Screen recording`ScreenRecordService` / `ScreenRecordingServicing`Location`LocationService` / `LocationServicing`Device status / info`DeviceStatusService` / `DeviceStatusServicing`Photos library`PhotoLibraryService` / `PhotosServicing`Contacts`ContactsService` / `ContactsServicing`Calendar`CalendarService` / `CalendarServicing`Reminders`RemindersService` / `RemindersServicing`Motion`MotionService` / `MotionServicing`Apple Watch messaging`WatchMessagingService` / `WatchMessagingServicing`Talk (PTT/voice)`TalkModeManager`
Sources: `apps/ios/Sources/Model/NodeAppModel.swift:148-176`, `apps/ios/Sources/Services/NodeServiceProtocols.swift`

### Android Capabilities

Android capabilities are registered via `BridgeSession` and include:
CapabilityNotes`camera.*` (photo, clip, list)CameraX-backed`device.status`, `device.info`System device metadata`device.permissions`, `device.health`Permission/health status`notifications.list`Lists active device notifications`notifications.actions` (open/dismiss/reply)Notification interaction
Sources: `apps/android/app/build.gradle.kts`, `CHANGELOG.md` (versions 2026.2.26, 2026.2.27)

---

## iOS App Structure

The iOS app is built with SwiftUI and uses `@Observable` state. `NodeAppModel` is the central singleton, injected as an environment object throughout the view hierarchy.

```
Device Services

Feature Managers

NodeAppModel (central state)

Root UI

iOS App Entry

OpenClawAppDelegate
(UIApplicationDelegate)

OpenClawApp
(@main SwiftUI App)

RootCanvas
(canvas-first layout)

RootTabs
(tab bar layout)

NodeAppModel
(@Observable @MainActor)

NodeCapabilityRouter

GatewayHealthMonitor

nodeGateway
(GatewayNodeSession)

operatorGateway
(GatewayNodeSession)

TalkModeManager

VoiceWakeManager

ScreenController

CameraController

LocationService

DeviceStatusService

MotionService

WatchMessagingService
```

Sources: `apps/ios/Sources/Model/NodeAppModel.swift`, `apps/ios/Sources/OpenClawApp.swift`, `apps/ios/Sources/RootCanvas.swift`, `apps/ios/Sources/RootTabs.swift`

---

## macOS App Structure

The macOS app lives at `apps/macos/` and is a Swift Package (not Xcode project). It produces four targets:
TargetTypePurpose`OpenClaw`ExecutableMenu bar app`openclaw-mac` (`OpenClawMacCLI`)ExecutableCLI companion`OpenClawIPC`LibraryIPC primitives between menu bar app and CLI`OpenClawDiscovery`LibrarymDNS gateway discovery (shared with iOS)
Key components described in detail in page [6.2](https://github.com/openclaw/openclaw/blob/8090cb4c/6.2): `BridgeServer` (local IPC), `RelayProcessManager` (manages the Node.js gateway process), and `RemotePortTunnel`.

[apps/macos/Package.swift1-92](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L1-L92)

---

## Android App Structure

The Android app lives at `apps/android/` and is a standard Gradle project (Kotlin + Jetpack Compose).
ConfigValueApplication ID`ai.openclaw.android`Min SDK31 (Android 12)Target SDK36Key libraryOkHttp (WebSocket transport)
Key components described in detail in page [6.3](https://github.com/openclaw/openclaw/blob/8090cb4c/6.3): `BridgeSession` (WebSocket client), `BridgePairingClient` (pairing handshake), and `JpegSizeLimiter` (camera image size control).

[apps/android/app/build.gradle.kts1-152](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L1-L152)

---

## Background and Reconnection Behavior (iOS)

The iOS app implements a background grace period to avoid dropping the Gateway connection immediately on backgrounding:

- On background: `beginBackgroundConnectionGracePeriod(seconds: 25)` requests a background task from UIKit.
- During the grace period, reconnects are still permitted.
- After the grace expires (or the system reclaims time), the connection is dropped and `gatewayStatusText` is set to `"Background idle"`.
- On foreground, if the connection was live, a health probe (`health` RPC with 2 s timeout) confirms it is still valid before triggering a full reconnect.

[apps/ios/Sources/Model/NodeAppModel.swift371-460](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift#L371-L460)

Voice Wake (`VoiceWakeManager`) and Talk Mode (`TalkModeManager`) both release the microphone on background and re-acquire it on foreground via `suspendForBackground` / `resumeAfterBackground`.

---

## Canvas (A2UI)

All three platforms support rendering a web canvas in a native web view. The Gateway sends a URL via `node.canvas.*` commands and the node navigates its embedded `WKWebView` (iOS) or `WebView` (Android) to that URL. The canvas can contain interactive UI built by the agent, and user interactions (button taps, etc.) are forwarded back to the agent via the `handleCanvasA2UIAction` path.

On iOS, `ScreenController` manages the web view lifecycle, navigation, JavaScript evaluation, and snapshot capture.

[apps/ios/Sources/Screen/ScreenController.swift1-303](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenController.swift#L1-L303)

The canvas scaffold (local HTML file for the default idle state) is bundled in `OpenClawKit/Resources/CanvasScaffold/scaffold.html` and loaded via `WKWebView.loadFileURL`.

---

# iOS-Client

# iOS Client
Relevant source files
- [apps/ios/Sources/Chat/IOSGatewayChatTransport.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Chat/IOSGatewayChatTransport.swift)
- [apps/ios/Sources/Gateway/GatewayConnectionController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift)
- [apps/ios/Sources/Location/LocationService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Location/LocationService.swift)
- [apps/ios/Sources/Model/NodeAppModel.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift)
- [apps/ios/Sources/Motion/MotionService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Motion/MotionService.swift)
- [apps/ios/Sources/Onboarding/OnboardingWizardView.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Onboarding/OnboardingWizardView.swift)
- [apps/ios/Sources/OpenClawApp.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/OpenClawApp.swift)
- [apps/ios/Sources/Reminders/RemindersService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Reminders/RemindersService.swift)
- [apps/ios/Sources/RootCanvas.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootCanvas.swift)
- [apps/ios/Sources/RootTabs.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootTabs.swift)
- [apps/ios/Sources/Screen/ScreenController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenController.swift)
- [apps/ios/Sources/Screen/ScreenTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenTab.swift)
- [apps/ios/Sources/Services/NodeServiceProtocols.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/NodeServiceProtocols.swift)
- [apps/ios/Sources/Services/WatchMessagingService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/WatchMessagingService.swift)
- [apps/ios/Sources/Settings/SettingsTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Settings/SettingsTab.swift)
- [apps/ios/Sources/Status/StatusPill.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/StatusPill.swift)
- [apps/ios/Sources/Status/VoiceWakeToast.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/VoiceWakeToast.swift)
- [apps/ios/Sources/Voice/TalkModeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/TalkModeManager.swift)
- [apps/ios/Sources/Voice/VoiceWakeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/VoiceWakeManager.swift)
- [apps/ios/SwiftSources.input.xcfilelist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/SwiftSources.input.xcfilelist)
- [apps/ios/Tests/GatewayConnectionControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/GatewayConnectionControllerTests.swift)
- [apps/ios/Tests/NodeAppModelInvokeTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/NodeAppModelInvokeTests.swift)
- [apps/ios/Tests/ScreenControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/ScreenControllerTests.swift)
- [apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift)
- [docs/gateway/pairing.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/pairing.md)
- [src/infra/machine-name.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/machine-name.ts)

This page documents the iOS Clawdis app: its internal architecture, how it connects to the OpenClaw Gateway, and the device capability services it exposes. The app's primary role is to function as a "node" client, registering device hardware (camera, location, microphone, etc.) with the gateway so agents can invoke them.

For the Gateway WebSocket protocol the app speaks, see [2.1](/openclaw/openclaw/2.1-websocket-protocol). For the node pairing approval flow, see [2.2](/openclaw/openclaw/2.2-authentication-and-device-pairing). For macOS and Android clients, see [6.2](/openclaw/openclaw/6.2-macos-client) and [6.3](/openclaw/openclaw/6.3-android-client).

---

## Architecture Overview

The iOS app establishes **two simultaneous WebSocket connections** to the gateway, each with a distinct role:
ConnectionRolePurpose`nodeGateway``node`Receives `node.invoke` commands from agents; registers device capabilities`operatorGateway``operator`Issues chat, talk, config, and voicewake RPC calls to the gateway
Both are instances of `GatewayNodeSession` held by `NodeAppModel`.

**Architecture of the iOS client**

```
iOS App (Clawdis)

Device Services

Canvas

Voice

Gateway Connectivity

node.invoke (inbound)

chat., talk., voicewake.* (outbound)

NodeAppModel
(central state, @Observable)

GatewayConnectionController
(discovery, TLS, auto-connect)

GatewayDiscoveryModel
(Bonjour/mDNS)

nodeGateway: GatewayNodeSession
(role: node)

operatorGateway: GatewayNodeSession
(role: operator)

VoiceWakeManager
(wake-word detection)

TalkModeManager
(STT + TTS conversation)

ScreenController
(WKWebView manager)

CameraController

LocationService

RemindersService

MotionService

WatchMessagingService

ScreenRecordService

DeviceStatusService

NodeCapabilityRouter
(command dispatch)

GatewayServer
(ws://host:18789)
```

Sources: [apps/ios/Sources/Model/NodeAppModel.swift95-116](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift#L95-L116)[apps/ios/Sources/Gateway/GatewayConnectionController.swift19-57](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift#L19-L57)

---

## NodeAppModel

`NodeAppModel` ([apps/ios/Sources/Model/NodeAppModel.swift50-217](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift#L50-L217)) is the central `@Observable` class for the iOS app. It is created once and injected into the SwiftUI environment.

**Responsibilities:**

- Holds the two `GatewayNodeSession` instances (`nodeGateway`, `operatorGateway`)
- Manages connection lifecycle: connect, disconnect, health monitoring, background suppression
- Owns `VoiceWakeManager`, `TalkModeManager`, and `ScreenController`
- Builds the `NodeCapabilityRouter` which dispatches inbound `BridgeInvokeRequest` commands
- Handles deep links (`openclaw://agent?...`), canvas A2UI actions, push wake events, and Apple Watch quick replies
- Tracks observable state used by the SwiftUI views: `gatewayStatusText`, `gatewayServerName`, `seamColorHex`, `cameraHUDKind`, etc.

**Capability routing** is implemented via the lazily initialized `capabilityRouter: NodeCapabilityRouter`. All inbound `node.invoke` requests arrive on `nodeGateway` and are passed to `handleInvoke(_:)`, which applies background and permission guards before delegating to the router.

```
handleInvoke(_:)
  ↓ background check (canvas/camera/screen/talk blocked)
  ↓ camera.enabled check
  ↓ capabilityRouter.handle(req)
    ↓ routes by req.command prefix

```

Sources: [apps/ios/Sources/Model/NodeAppModel.swift709-755](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift#L709-L755)

---

## GatewayConnectionController

`GatewayConnectionController` ([apps/ios/Sources/Gateway/GatewayConnectionController.swift21-57](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift#L21-L57)) manages gateway discovery and connection setup.

**Discovery**

The controller uses `GatewayDiscoveryModel` for Bonjour/mDNS discovery on the local network. When gateways appear, it calls `maybeAutoConnect()`, which respects:

- `gateway.autoconnect` (UserDefaults)
- `gateway.preferredStableID` (previously connected gateway)
- Stored TLS fingerprint (auto-connect only connects to previously trusted gateways)

**TLS trust model**

The app uses a TOFU (Trust On First Use) model with certificate pinning by SHA-256 fingerprint. On first connection to a new gateway:

1. The controller probes the TLS endpoint via `probeTLSFingerprint(url:)`.
2. A `TrustPrompt` is shown to the user (displayed via `.gatewayTrustPromptAlert()` SwiftUI modifier).
3. On acceptance, the fingerprint is stored via `GatewayTLSStore.saveFingerprint(_:stableID:)`.
4. Subsequent connections verify against the stored fingerprint without re-prompting.

**Connection flow**

**Gateway connection and TLS trust flow**

```
GatewayServer
GatewayNodeSession
GatewayTLSStore
GatewayConnectionController
User
GatewayServer
GatewayNodeSession
GatewayTLSStore
GatewayConnectionController
User
alt
["No stored fingerprint"]
"connect(gateway)"
"loadFingerprint(stableID)"
"probeTLSFingerprint(url)"
"SHA-256 fingerprint"
"show TrustPrompt"
"acceptPendingTrustPrompt()"
"saveFingerprint(fp, stableID)"
"startAutoConnect(url, tls, token)"
"WebSocket connect (node role)"
"WebSocket connect (operator role)"
```

Sources: [apps/ios/Sources/Gateway/GatewayConnectionController.swift90-155](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift#L90-L155)[apps/ios/Sources/Gateway/GatewayConnectionController.swift241-277](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift#L241-L277)

---

## TalkModeManager

`TalkModeManager` ([apps/ios/Sources/Voice/TalkModeManager.swift16-103](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/TalkModeManager.swift#L16-L103)) implements two-way voice conversation with the agent.

**Speech-to-text (STT)**: Uses `SFSpeechRecognizer` with `AVAudioEngine`. Audio is tapped from the microphone, fed into an `SFSpeechAudioBufferRecognitionRequest`, and results are emitted as partial or final transcripts.

**Text-to-speech (TTS)**: Handled by the gateway via ElevenLabs. Configuration (`apiKey`, `voiceId`, `modelId`) is fetched from the gateway on connect. Streaming audio is played via `PCMStreamingAudioPlayer` (PCM) or `StreamingAudioPlayer` (MP3).

**Capture modes:**
ModeEnum caseDescriptionIdle`.idle`No active captureContinuous`.continuous`Always-on listening with silence detectionPush-to-talk`.pushToTalk`Single utterance capture
**Key methods:**
MethodDescription`start()`Enters continuous capture mode, requests permissions, subscribes to chat events`stop()`Cleans up all audio resources and chat subscriptions`beginPushToTalk()`Starts a single PTT capture, returns `OpenClawTalkPTTStartPayload``endPushToTalk()`Stops PTT, sends transcript to gateway, returns `OpenClawTalkPTTStopPayload``suspendForBackground(keepActive:)`Releases mic; optionally keeps listening in background`resumeAfterBackground(wasSuspended:wasKeptActive:)`Restores capture state
**Silence detection**: A `silenceTask` polling every 200ms checks `lastAudioActivity` and `lastHeard`. If both fall outside `silenceWindow` (0.9 s), the current transcript is processed and sent to the gateway.

**Noise floor calibration**: The first 22 audio samples calibrate `noiseFloor`. The VAD threshold is clamped to `[0.12, 0.35]` above the measured floor.

**Microphone coordination**: `TalkModeManager` and `VoiceWakeManager` compete for the same microphone. When talk mode is enabled, `NodeAppModel.setTalkEnabled(_:)` calls `voiceWake.setSuppressedByTalk(true)` and suspends voice wake capture.

Sources: [apps/ios/Sources/Voice/TalkModeManager.swift1-340](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/TalkModeManager.swift#L1-L340)

---

## VoiceWakeManager

`VoiceWakeManager` ([apps/ios/Sources/Voice/VoiceWakeManager.swift83-213](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/VoiceWakeManager.swift#L83-L213)) runs continuous always-on wake-word detection using `SFSpeechRecognizer`.

Audio buffers are enqueued into `AudioBufferQueue` (a thread-safe ring buffer) via an `AVAudioEngine` tap. A `tapDrainTask` drains the queue every 40ms and appends buffers to the recognition request.

Wake-word matching is delegated to `WakeWordGate.match(transcript:segments:config:)` from `SwabbleKit`. The active trigger words come from `VoiceWakePreferences` (stored in `UserDefaults`), kept in sync with the gateway via the `voicewake.changed` server event.

On a match, the command text is sent to the gateway via `NodeAppModel.sendVoiceTranscript(text:sessionKey:)` on the operator session.

**State transitions:**

- `setEnabled(true)` → `start()` → requests mic + speech permissions → `startRecognition()` → `isListening = true`
- `suspendForExternalAudioCapture()` → pauses recognition, releases `AVAudioSession`
- `resumeAfterExternalAudioCapture(wasSuspended:)` → calls `start()` if was suspended
- On recognition error → restarts after 700ms delay

Sources: [apps/ios/Sources/Voice/VoiceWakeManager.swift83-270](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/VoiceWakeManager.swift#L83-L270)

---

## ScreenController

`ScreenController` ([apps/ios/Sources/Screen/ScreenController.swift8-374](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenController.swift#L8-L374)) manages the single `WKWebView` that forms the primary visual surface of the app.

**Canvas modes:**
Mode`urlString`Scroll behaviorDefault canvas (scaffold)`""`Disabled (raw touch passthrough)External URLnon-emptyEnabled
The default canvas loads `CanvasScaffold/scaffold.html` from the `OpenClawKit` bundle.

**Security**: Loopback URLs (`localhost`, `127.x.x.x`, `::1`) received from the gateway are silently redirected to the default canvas. Local network URLs (LAN IPs, `.local`, `.ts.net`, `.tailscale.net`, Tailscale CGNAT `100.64/10`) are permitted.

**Key operations:**
MethodDescription`navigate(to:)`Loads a URL in the web view, or shows default canvas for empty/loopback URLs`showDefaultCanvas()`Resets to scaffold HTML`eval(javaScript:)`Evaluates JS via `WKWebView.evaluateJavaScript`, async/await wrapper`snapshotBase64(maxWidth:format:quality:)`Takes a `WKSnapshotConfiguration` snapshot, returns base64 PNG or JPEG`waitForA2UIReady(timeoutMs:)`Polls `globalThis.openclawA2UI.applyMessages` until ready
**A2UI actions**: Button clicks inside the canvas post a `userAction` message that is intercepted by `ScreenWebView` and forwarded to `NodeAppModel.handleCanvasA2UIAction(body:)`. This method packages the action as an agent message and sends it via `sendAgentRequest(link:)`.

Sources: [apps/ios/Sources/Screen/ScreenController.swift1-374](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenController.swift#L1-L374)

---

## Device Services

Each capability is backed by a protocol and a concrete implementation. `GatewayConnectionController` enumerates the currently enabled capabilities when building the connection options.

**Device service protocol map**

```
NodeCapabilityRouter

CameraServicing
→ CameraController
(camera.snap, camera.clip)

ScreenRecordingServicing
→ ScreenRecordService
(screen.record)

LocationServicing
→ LocationService
(location.get)

DeviceStatusServicing
→ DeviceStatusService
(device.status, device.info)

PhotosServicing
→ PhotoLibraryService
(photos.latest)

ContactsServicing
→ ContactsService
(contacts.search, contacts.add)

CalendarServicing
→ CalendarService
(calendar.events, calendar.add)

RemindersServicing
→ RemindersService
(reminders.list, reminders.add)

MotionServicing
→ MotionService
(motion.activities, motion.pedometer)

WatchMessagingServicing
→ WatchMessagingService
(watch.status, watch.notify)

ScreenController
(canvas.*, screen.snapshot)

TalkModeManager
(talk.ptt.*)
```

Sources: [apps/ios/Sources/Services/NodeServiceProtocols.swift1-103](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/NodeServiceProtocols.swift#L1-L103)

**Capability summary table:**
CapabilityProtocolCommand prefixiOS permissionCamera photo/video`CameraServicing``camera.*`NSCameraUsageDescriptionScreen recording`ScreenRecordingServicing``screen.record`ReplayKitGPS location`LocationServicing``location.get`NSLocationWhenInUseUsageDescriptionPhotos library`PhotosServicing``photos.latest`NSPhotoLibraryUsageDescriptionContacts`ContactsServicing``contacts.*`NSContactsUsageDescriptionCalendar`CalendarServicing``calendar.*`NSCalendarsUsageDescriptionReminders`RemindersServicing``reminders.*`NSRemindersUsageDescriptionMotion/pedometer`MotionServicing``motion.*`NSMotionUsageDescriptionApple Watch`WatchMessagingServicing``watch.*`WatchConnectivityCanvas web view`ScreenController``canvas.*`—Voice STT/TTS`TalkModeManager``talk.ptt.*`NSMicrophoneUsageDescription, NSSpeechRecognitionUsageDescriptionWake word`VoiceWakeManager`— (outbound only)same as above
**Background restrictions**: Commands with prefixes `canvas.*`, `camera.*`, `screen.*`, and `talk.*` return a `backgroundUnavailable` error when `isBackgrounded == true`. Location commands additionally require `Always` authorization when backgrounded.

Sources: [apps/ios/Sources/Model/NodeAppModel.swift757-760](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift#L757-L760)[apps/ios/Sources/Services/NodeServiceProtocols.swift1-103](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/NodeServiceProtocols.swift#L1-L103)

---

## Background and Foreground Lifecycle

`NodeAppModel.setScenePhase(_:)` is called by the SwiftUI `onChange(of: scenePhase)` handler.

**Background transition:**

1. `isBackgrounded = true`
2. Gateway health monitor stopped
3. 25-second `UIBackgroundTask` started (`beginBackgroundConnectionGracePeriod`)
4. Voice wake and talk mode mic released (`suspendForExternalAudioCapture`)
5. After grace period, `suppressBackgroundReconnect` disconnects both WebSocket sessions and sets status to "Background idle"
6. Optional background listening: if `talk.background.enabled` is set, talk mode is kept active

**Foreground transition:**

1. Grace period cancelled
2. Background suppression cleared
3. Health monitor restarted if operator is connected
4. If backgrounded for ≥ 3 seconds: health check sent (`health` RPC, 2s timeout); if unhealthy, both sessions are disconnected and the reconnect loop handles re-connect
5. Mic restored for voice wake and talk mode

Silent APNs push wakes are handled by `OpenClawAppDelegate.application(_:didReceiveRemoteNotification:fetchCompletionHandler:)`, which calls `NodeAppModel.handleSilentPushWake(_:)`. A `BGAppRefreshTask` is also scheduled for periodic wake-up.

Sources: [apps/ios/Sources/Model/NodeAppModel.swift297-369](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift#L297-L369)[apps/ios/Sources/OpenClawApp.swift75-155](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/OpenClawApp.swift#L75-L155)

---

## Onboarding and Settings

**First-run flow** is managed by `OnboardingWizardView` ([apps/ios/Sources/Onboarding/OnboardingWizardView.swift45](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Onboarding/OnboardingWizardView.swift#L45-LNaN)). Steps:
StepEnum caseContentWelcome`.welcome`Splash screenConnection mode`.mode`Manual vs. setup codeConnect`.connect`Gateway list or QR scanAuthentication`.auth`Token/password entrySuccess`.success`Confirmation
`RootCanvas.startupPresentationRoute(...)` determines whether to show onboarding, settings, or nothing on launch based on `hasConnectedOnce`, `onboardingComplete`, and the existence of a saved gateway config.

**Settings** (`SettingsTab`, [apps/ios/Sources/Settings/SettingsTab.swift9](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Settings/SettingsTab.swift#L9-LNaN)) exposes:

- Gateway section: setup code entry, discovered gateway list, manual host/port/TLS override, debug log view
- Device features: Voice Wake toggle, Talk Mode toggle, Background Listening, Wake Words, Camera, Location mode (`off`/`whileUsing`/`always`), Prevent Sleep
- Agent picker (selects which gateway agent the session key targets)
- Device info: display name, instance ID, platform string

Credentials (token, password) are stored per `instanceId` via `GatewaySettingsStore` (backed by the iOS keychain).

Sources: [apps/ios/Sources/Settings/SettingsTab.swift61-509](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Settings/SettingsTab.swift#L61-L509)[apps/ios/Sources/RootCanvas.swift48-67](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootCanvas.swift#L48-L67)

---

## UI Structure

**Main view hierarchy**

```
sheet

sheet

fullScreenCover

OpenClawApp (@main)

OpenClawAppDelegate
(UIApplicationDelegate)

RootCanvas
(full-screen canvas mode)

CanvasContent
(ZStack over ScreenTab)

ScreenTab → ScreenWebView
(WKWebView)

StatusPill
(connection indicator)

TalkOrbOverlay

ChatSheet
(uses operatorSession)

SettingsTab

OnboardingWizardView
```

The `ScreenTab` renders `ScreenWebView` (a `UIViewRepresentable` wrapping `WKWebView`). The coordinator class `ScreenWebViewCoordinator` calls `ScreenController.attachWebView(_:)` on appearance.

The `StatusPill` shows gateway connection state (`.connected`, `.connecting`, `.error`, `.disconnected`) with an animated pulsing dot while connecting, plus an activity slot that surfaces camera HUD, screen recording, pairing status, and voice wake state.

Sources: [apps/ios/Sources/RootCanvas.swift69-263](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootCanvas.swift#L69-L263)[apps/ios/Sources/Status/StatusPill.swift1-140](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/StatusPill.swift#L1-L140)[apps/ios/Sources/Screen/ScreenTab.swift1-27](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenTab.swift#L1-L27)

---

# macOS-Client

# macOS Client
Relevant source files
- [Swabble/Package.resolved](https://github.com/openclaw/openclaw/blob/8090cb4c/Swabble/Package.resolved)
- [apps/ios/Sources/Chat/IOSGatewayChatTransport.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Chat/IOSGatewayChatTransport.swift)
- [apps/ios/Sources/Gateway/GatewayConnectionController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift)
- [apps/ios/Sources/Location/LocationService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Location/LocationService.swift)
- [apps/ios/Sources/Model/NodeAppModel.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift)
- [apps/ios/Sources/Motion/MotionService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Motion/MotionService.swift)
- [apps/ios/Sources/Onboarding/OnboardingWizardView.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Onboarding/OnboardingWizardView.swift)
- [apps/ios/Sources/OpenClawApp.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/OpenClawApp.swift)
- [apps/ios/Sources/Reminders/RemindersService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Reminders/RemindersService.swift)
- [apps/ios/Sources/RootCanvas.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootCanvas.swift)
- [apps/ios/Sources/RootTabs.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootTabs.swift)
- [apps/ios/Sources/Screen/ScreenController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenController.swift)
- [apps/ios/Sources/Screen/ScreenTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenTab.swift)
- [apps/ios/Sources/Services/NodeServiceProtocols.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/NodeServiceProtocols.swift)
- [apps/ios/Sources/Services/WatchMessagingService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/WatchMessagingService.swift)
- [apps/ios/Sources/Settings/SettingsTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Settings/SettingsTab.swift)
- [apps/ios/Sources/Status/StatusPill.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/StatusPill.swift)
- [apps/ios/Sources/Status/VoiceWakeToast.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/VoiceWakeToast.swift)
- [apps/ios/Sources/Voice/TalkModeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/TalkModeManager.swift)
- [apps/ios/Sources/Voice/VoiceWakeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/VoiceWakeManager.swift)
- [apps/ios/SwiftSources.input.xcfilelist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/SwiftSources.input.xcfilelist)
- [apps/ios/Tests/GatewayConnectionControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/GatewayConnectionControllerTests.swift)
- [apps/ios/Tests/NodeAppModelInvokeTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/NodeAppModelInvokeTests.swift)
- [apps/ios/Tests/ScreenControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/ScreenControllerTests.swift)
- [apps/macos/Package.resolved](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.resolved)
- [apps/macos/Package.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift)
- [apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift)
- [docs/gateway/pairing.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/pairing.md)
- [src/infra/machine-name.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/machine-name.ts)
- [src/tui/tui-input-history.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/tui/tui-input-history.test.ts)
- [src/tui/tui.submit-handler.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/tui/tui.submit-handler.test.ts)

This page covers the macOS Clawdis application (`apps/macos`): its Swift package layout, menu bar integration, IPC bridge, process management, node pairing approval flow, and the `openclaw-mac` CLI companion. For the iOS equivalent, see [iOS Client](/openclaw/openclaw/6.1-ios-client). For the Gateway WebSocket protocol that all nodes speak, see [WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol) and [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing).

---

## Role in the System

The macOS app connects to the OpenClaw Gateway in the `node` role over WebSocket. From the Gateway's perspective it behaves identically to any other native client node: it completes the `connect.challenge` handshake, registers device capabilities, and handles `node.invoke` requests dispatched by the agent runtime.

In addition to its role as a node, the macOS app is a first-class pairing approval surface: when an iOS or other remote node sends a `node.pair.request`, the macOS app presents an Approve / Reject prompt to the local user. It can also attempt silent auto-approval when the request is marked `silent` and SSH connectivity to the gateway host can be verified.

```
macOS Host

node WebSocket

operator WebSocket

discovery + protocol

node.pair.request

node.pair.requested event

node.pair.approve / reject

OpenClaw.app (menu bar)

BridgeServer (OpenClawIPC)

RelayProcessManager

openclaw-mac CLI

GatewayServer (ws://127.0.0.1:18789)

RemotePortTunnel

Remote Node (iOS / Android)
```

Sources: [apps/macos/Package.swift1-92](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L1-L92)[docs/gateway/pairing.md1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/pairing.md#L1-L100)

---

## Swift Package Structure

The macOS app is a standalone Swift Package (`apps/macos/Package.swift`) targeting macOS 15+. It produces four products:
ProductKindPurpose`OpenClawIPC`libraryLocal IPC protocol between the menu bar process and other processes (e.g., `BridgeServer`)`OpenClawDiscovery`libraryBonjour/mDNS discovery of local Gateway instances`OpenClaw`executableThe menu bar app itself`openclaw-mac`executableHeadless CLI companion (`OpenClawMacCLI` target)
**Main app dependencies**
DependencyRole in macOS app`MenuBarExtraAccess`Menu bar window lifecycle and access management`swift-subprocess`Powers `RelayProcessManager` for spawning subprocesses`swift-log`Structured logging`Sparkle`In-app auto-update`PeekabooBridge` / `PeekabooAutomationKit`Screen automation capabilities exposed to the agent`OpenClawKit`Shared models, bridge frames, capability definitions`OpenClawChatUI`Shared chat UI components`OpenClawProtocol`Gateway WebSocket protocol frame types`SwabbleKit`Wake-word engine (same lib as iOS)
Sources: [apps/macos/Package.swift1-92](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L1-L92)[apps/macos/Package.resolved1-132](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.resolved#L1-L132)

**Package target dependency diagram**

```
OpenClaw (executable)

OpenClawMacCLI (executable)

OpenClawIPC (library)

OpenClawDiscovery (library)

OpenClawKit

OpenClawChatUI

OpenClawProtocol

SwabbleKit

MenuBarExtraAccess

swift-subprocess

swift-log

Sparkle

PeekabooBridge

PeekabooAutomationKit
```

Sources: [apps/macos/Package.swift26-92](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L26-L92)

---

## Menu Bar Integration

The main executable `OpenClaw` is a menu bar–resident application (no Dock icon). It uses the `MenuBarExtraAccess` library to manage the menu bar window lifecycle.

The menu bar popover/window renders:

- **Gateway connection status** — connected / connecting / offline indicator
- **Session list** — active chat sessions, selectable as the active session
- **Agent picker** — list of configured agents from the connected Gateway
- **Pairing approval prompts** — when a remote node's `node.pair.requested` event arrives
- **Settings** — Gateway URL, credentials, node display name

The app maintains two WebSocket connections to the Gateway (mirroring the iOS pattern):

1. A **node** connection — registers device capabilities, handles `node.invoke` requests
2. An **operator** connection — used for chat, config, and session management RPC calls

Sources: [apps/macos/Package.swift43-67](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L43-L67)[apps/macos/Package.resolved34-38](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.resolved#L34-L38)

---

## BridgeServer and OpenClawIPC

`OpenClawIPC` is a zero-dependency Swift library that implements local inter-process communication. The main app hosts a `BridgeServer` that other local processes can connect to. This allows tools like the `openclaw-mac` CLI or spawned subprocesses managed by `RelayProcessManager` to communicate with the running app without going through the Gateway.

The IPC framing mirrors the Gateway's bridge frame format — the same `BridgeInvokeRequest` / `BridgeInvokeResponse` types defined in `OpenClawKit` are reused, so capability invocations from the Gateway flow through the same path as local IPC calls.

Sources: [apps/macos/Package.swift27-31](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L27-L31)[apps/macos/Package.swift79-90](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L79-L90)

---

## RelayProcessManager

`RelayProcessManager` uses `swift-subprocess` to spawn and supervise relay processes. A relay process provides a `RemotePortTunnel`: it forwards a local port to a remote Gateway endpoint, enabling the menu bar app to reach a Gateway that isn't on the local network without requiring a full VPN.

**Lifecycle**

```
"GatewayServer (remote)"
"relay subprocess"
"RelayProcessManager"
"OpenClaw (menu bar)"
"GatewayServer (remote)"
"relay subprocess"
"RelayProcessManager"
"OpenClaw (menu bar)"
"start relay for target URL"
"spawn subprocess (swift-subprocess)"
"local port assigned"
"RemotePortTunnel (localPort)"
"WebSocket via tunnel localPort"
"stop relay"
"terminate"
```

Sources: [apps/macos/Package.swift52-54](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L52-L54)

---

## Node Pairing Approval

When a remote node (iOS, Android, etc.) attempts to pair with the Gateway, the Gateway emits a `node.pair.requested` event to all connected operator-role clients. The macOS app receives this event and presents an approval UI.

The pairing flow documented in `docs/gateway/pairing.md`:

1. Remote node connects and calls `node.pair.request`.
2. Gateway stores a pending request (expires after 5 minutes) and emits `node.pair.requested`.
3. macOS app receives the event and presents **Approve / Reject**.
4. If the request carries `silent: true`, the app can attempt **silent auto-approval** by verifying an SSH connection to the gateway host using the same local user. If SSH verification fails, it falls back to the interactive prompt.
5. On approval, the app calls `node.pair.approve`, which causes the Gateway to issue a fresh auth token to the node.
6. The Gateway emits `node.pair.resolved`.

```
"OpenClaw (macOS)"
"GatewayServer"
"Remote Node"
"OpenClaw (macOS)"
"GatewayServer"
"Remote Node"
alt
["silent=true and SSH OK"]
["interactive"]
"node.pair.request {silent: true}"
"node.pair.requested event"
"node.pair.approve (auto)"
"show Approve/Reject UI"
"node.pair.approve or node.pair.reject"
"node.pair.resolved (token issued)"
"reconnect with token"
```

Sources: [docs/gateway/pairing.md1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/pairing.md#L1-L100)

---

## Device Capabilities Exposed

The macOS app registers node capabilities with the Gateway on connect. Screen automation is a macOS-specific capability enabled by the `PeekabooBridge` and `PeekabooAutomationKit` dependencies, which expose accessibility and screen capture APIs to the agent via `node.invoke`.

Shared capabilities (also on iOS) exposed on macOS include canvas rendering and chat interaction. macOS-specific capabilities include:
CapabilityBacked byScreen automation / capture`PeekabooBridge`, `PeekabooAutomationKit`Wake word detection`SwabbleKit`Canvas (web view)`OpenClawKit`
Sources: [apps/macos/Package.swift43-67](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L43-L67)

---

## OpenClawMacCLI (`openclaw-mac`)

The `OpenClawMacCLI` target produces a standalone binary named `openclaw-mac`. It is a lightweight headless companion that reuses `OpenClawDiscovery` for Bonjour-based Gateway discovery and speaks the Gateway protocol directly via `OpenClawProtocol`.

Typical uses:

- Scripted Gateway interactions from the macOS terminal
- CI/CD pipelines that need to reach a local Gateway without the full app
- Querying discovered gateways on the local network

It does **not** depend on `OpenClawIPC` or any UI framework — it is a pure command-line tool.

```
mDNS

WebSocket RPC

openclaw-mac binary

OpenClawDiscovery (Bonjour)

OpenClawProtocol (WebSocket frames)

OpenClawKit (shared models)

GatewayServer
```

Sources: [apps/macos/Package.swift69-78](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L69-L78)

---

## Update Mechanism

The app integrates `Sparkle` (version 2.x) for automatic updates. Release artifacts are published and Sparkle's appcast mechanism handles update discovery and installation in the background. See [Releasing](/openclaw/openclaw/8.2-releasing) for the macOS release process.

Sources: [apps/macos/Package.swift21](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.swift#L21-L21)[apps/macos/Package.resolved46-56](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Package.resolved#L46-L56)

---

# Android-Client

# Android Client
Relevant source files
- [.npmrc](https://github.com/openclaw/openclaw/blob/8090cb4c/.npmrc)
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts)
- [apps/ios/ShareExtension/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/ShareExtension/Info.plist)
- [apps/ios/Sources/Chat/IOSGatewayChatTransport.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Chat/IOSGatewayChatTransport.swift)
- [apps/ios/Sources/Gateway/GatewayConnectionController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Gateway/GatewayConnectionController.swift)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Info.plist)
- [apps/ios/Sources/Location/LocationService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Location/LocationService.swift)
- [apps/ios/Sources/Model/NodeAppModel.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Model/NodeAppModel.swift)
- [apps/ios/Sources/Motion/MotionService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Motion/MotionService.swift)
- [apps/ios/Sources/Onboarding/OnboardingWizardView.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Onboarding/OnboardingWizardView.swift)
- [apps/ios/Sources/OpenClawApp.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/OpenClawApp.swift)
- [apps/ios/Sources/Reminders/RemindersService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Reminders/RemindersService.swift)
- [apps/ios/Sources/RootCanvas.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootCanvas.swift)
- [apps/ios/Sources/RootTabs.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/RootTabs.swift)
- [apps/ios/Sources/Screen/ScreenController.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenController.swift)
- [apps/ios/Sources/Screen/ScreenTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Screen/ScreenTab.swift)
- [apps/ios/Sources/Services/NodeServiceProtocols.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/NodeServiceProtocols.swift)
- [apps/ios/Sources/Services/WatchMessagingService.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Services/WatchMessagingService.swift)
- [apps/ios/Sources/Settings/SettingsTab.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Settings/SettingsTab.swift)
- [apps/ios/Sources/Status/StatusPill.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/StatusPill.swift)
- [apps/ios/Sources/Status/VoiceWakeToast.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Status/VoiceWakeToast.swift)
- [apps/ios/Sources/Voice/TalkModeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/TalkModeManager.swift)
- [apps/ios/Sources/Voice/VoiceWakeManager.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Sources/Voice/VoiceWakeManager.swift)
- [apps/ios/SwiftSources.input.xcfilelist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/SwiftSources.input.xcfilelist)
- [apps/ios/Tests/GatewayConnectionControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/GatewayConnectionControllerTests.swift)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/Info.plist)
- [apps/ios/Tests/NodeAppModelInvokeTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/NodeAppModelInvokeTests.swift)
- [apps/ios/Tests/ScreenControllerTests.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/Tests/ScreenControllerTests.swift)
- [apps/ios/WatchApp/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/WatchApp/Info.plist)
- [apps/ios/WatchExtension/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/WatchExtension/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/shared/OpenClawKit/Sources/OpenClawKit/TalkCommands.swift)
- [docs/gateway/pairing.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/pairing.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/platforms/mac/release.md)
- [extensions/memory-lancedb/package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/memory-lancedb/package.json)
- [package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-lock.yaml)
- [pnpm-workspace.yaml](https://github.com/openclaw/openclaw/blob/8090cb4c/pnpm-workspace.yaml)
- [src/infra/machine-name.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/machine-name.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8090cb4c/ui/package.json)

The Android client (`ai.openclaw.android`) is the Android device node for OpenClaw. Located at `apps/android/`, it connects to the Gateway via WebSocket in the `node` role, registers device capabilities (camera, device status, notifications, canvas), and hosts a native Compose-based chat UI and WebView canvas for A2UI interaction.

This page covers the Android app's connection architecture, pairing flow, node capabilities, image handling, and build configuration. For the equivalent iOS client, see [6.1](/openclaw/openclaw/6.1-ios-client). For the macOS client, see [6.2](/openclaw/openclaw/6.2-macos-client). For the shared node role protocol and Bridge connection model, see [6](/openclaw/openclaw/6-native-clients-(nodes)).

---

## Architecture Overview

The app maintains two concurrent WebSocket connections to the Gateway — one in the `node` role and one in the `operator` role — both managed by `BridgeSession` instances. The `node` connection handles capability advertisement and `node.invoke` dispatch. The `operator` connection is used for chat, config, and canvas RPCs. Initial device pairing is handled by `BridgePairingClient`.

**Android App Component Map**

```
ai.openclaw.android

role=node (node.invoke dispatch)

role=operator (chat, config)

node.pair.*

MainActivity

BridgeSession (role=node)

BridgeSession (role=operator)

BridgePairingClient

JpegSizeLimiter

CameraX Controller

Notification Listener

Device Service

WebView (Canvas / A2UI)

Compose Chat UI

GatewayServer (ws://host:18789)
```

Sources: [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts)[CHANGELOG.md11-12](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L11-L12)[CHANGELOG.md141](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L141-L141)

---

## BridgeSession

`BridgeSession` manages a single WebSocket connection to the Gateway. Two instances are created at app startup, one per role:
InstanceRoleResponsibilitiesnode session`node`Advertises capabilities, receives and dispatches `node.invoke` commandsoperator session`operator`Issues chat, config, and canvas RPCs on behalf of the local user
The WebSocket transport uses OkHttp3. An earlier bug where OkHttp added a native `Origin` header caused Gateway rejection; this was corrected by explicitly removing the header from the connection setup.

Device identity is derived from a keypair. The keypair is stored using `androidx.security:security-crypto` (encrypted SharedPreferences), and Bouncycastle (`bcprov-jdk18on`) provides the underlying cryptographic primitives for key generation and signing during the `connect.challenge` / `hello-ok` handshake.

Sources: [apps/android/app/build.gradle.kts124-127](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L124-L127)[CHANGELOG.md141](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L141-L141)

---

## BridgePairingClient

`BridgePairingClient` implements the device pairing approval flow. When an Android node first connects, a pending pairing request is stored on the Gateway and the operator must approve it via CLI or UI before the node is granted its auth token. This follows the `node.pair.*` protocol described in [2.2](/openclaw/openclaw/2.2-authentication-and-device-pairing).

QR code scanning for initial setup uses ZXing (`zxing-android-embedded`). The user scans a setup code displayed by the Gateway or CLI output to bootstrap the connection without manually entering credentials.

Sources: [apps/android/app/build.gradle.kts139-140](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L139-L140)[CHANGELOG.md141](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L141-L141)

---

## Node Capabilities

When the `node`-role `BridgeSession` connects, it advertises a set of capabilities to the Gateway. The Gateway can then call these via `node.invoke`. The capability set has grown across recent releases.

**Android Node Capability Tree**

```
BridgeSession (role=node)

camera

device

notifications

canvas

camera.list

camera.snap

camera.clip

device.status

device.info

device.permissions

device.health

notifications.list

notifications.actions

open

dismiss

reply

node.canvas.capability.refresh
```

Sources: [CHANGELOG.md11-12](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L11-L12)[CHANGELOG.md40-42](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L40-L42)[CHANGELOG.md59-60](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L59-L60)

### Camera

Camera commands use the CameraX library suite (`camera-core`, `camera-camera2`, `camera-lifecycle`, `camera-video`, `camera-view`).
CommandDescriptionNotes`camera.list`List available camerasReturns device IDs and facing info`camera.snap`Capture a still photoOutput is size-limited by `JpegSizeLimiter``camera.clip`Record a short video clipBinary upload; no base64 fallback
Behavioral constraints:

- `facing=both` is rejected when `deviceId` is also specified, to prevent mislabeled duplicate captures.
- `maxWidth` must be a positive integer; non-positive values fall back to the safe resize default.
- `camera.clip` uses deterministic binary upload transport. The base64 fallback was removed to make transport failures explicit.
- The invoke-result acknowledgement timeout is scaled to the full invoke budget to accommodate large clip payloads.

Sources: [apps/android/app/build.gradle.kts134-139](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L134-L139)[CHANGELOG.md40-41](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L40-L41)

### Device
CommandDescription`device.status`Current device status (battery, connectivity, etc.)`device.info`Static device metadata (model, OS version)`device.permissions`Runtime permission grant states`device.health`Device health diagnostics
Sources: [CHANGELOG.md11](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L11-L11)[CHANGELOG.md59](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L59-L59)

### Notifications
CommandActionNotes`notifications.list`List active notificationsReturns notification metadata array`notifications.actions open`Open/launch a notificationPermitted on non-clearable entries`notifications.actions dismiss`Dismiss a notificationGated: only clearable notifications`notifications.actions reply`Send an inline replyPermitted on non-clearable entries
The notification listener is rebound immediately before executing any notification action to ensure the action targets the current live state.

Sources: [CHANGELOG.md11](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L11-L11)[CHANGELOG.md40](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L40-L40)[CHANGELOG.md60](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L60-L60)

### Canvas and A2UI

The Android node supports the canvas capability. The WebView is hosted via `androidx.webkit:webkit`. The Gateway pushes a URL to the node; the node loads it in the WebView and executes A2UI interactions.

Key behaviors:

- `node.canvas.capability.refresh` is sent with empty object params (`{}`) to signal A2UI readiness and to recover after a scoped capability expiry. The Gateway validates that `params` is an object (not `null`), so sending `{}` rather than nothing is required for schema compliance.
- Canvas URLs are normalized by scope before being loaded.
- A2UI readiness is verified by polling for the `openclawA2UI` host object in the WebView JavaScript context, with retries on load delay.
- A debug diagnostics JSON endpoint can be enabled at runtime for canvas troubleshooting.

Sources: [apps/android/app/build.gradle.kts106](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L106-L106)[CHANGELOG.md12](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L12-L12)[CHANGELOG.md42](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L42-L42)

---

## JpegSizeLimiter

`JpegSizeLimiter` enforces maximum dimension and byte-size constraints on JPEG images produced by camera commands before they are transmitted to the Gateway. This prevents oversized payloads from overwhelming the WebSocket transport or Gateway processing.

Key rules enforced by `JpegSizeLimiter`:

- Non-positive `maxWidth` values are rejected at the call site; a safe resize default is used instead.
- EXIF metadata is handled via `androidx.exifinterface:exifinterface` to preserve or strip orientation data during resize.

Sources: [apps/android/app/build.gradle.kts125](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L125-L125)[CHANGELOG.md40-42](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L40-L42)

---

## Chat UI

The native Android chat interface is built with Jetpack Compose and driven by the `operator`-role `BridgeSession`. Streaming partial replies are assembled incrementally before being rendered.

Markdown rendering uses the CommonMark library suite:
LibraryPurpose`commonmark`Core CommonMark block/inline parsing`commonmark-ext-autolink`Automatic URL and email linkification`commonmark-ext-gfm-strikethrough`GitHub Flavored Markdown strikethrough`commonmark-ext-gfm-tables`GFM table rendering`commonmark-ext-task-list-items`Task list checkbox items
Sources: [apps/android/app/build.gradle.kts128-133](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L128-L133)[CHANGELOG.md152-153](https://github.com/openclaw/openclaw/blob/8090cb4c/CHANGELOG.md#L152-L153)

---

## Build Configuration

The app module is at `apps/android/app/` and built with Gradle Kotlin DSL.

### Module Identity
PropertyValueApplication ID`ai.openclaw.android``compileSdk`36`minSdk`31 (Android 12)`targetSdk`36`versionName``2026.2.27` (matches monorepo version)`versionCode``202602270`Supported ABIs`armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`
APK output files are named `openclaw-{versionName}-{buildType}.apk` via a custom `androidComponents.onVariants` hook [apps/android/app/build.gradle.kts78-89](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L78-L89)

Release builds enable both minification and resource shrinking (`isMinifyEnabled = true`, `isShrinkResources = true`). Debug builds have both disabled.

The app shares resource assets with the cross-platform `OpenClawKit` library by adding `../../shared/OpenClawKit/Sources/OpenClawKit/Resources` to the `main` source set's asset directories [apps/android/app/build.gradle.kts13-17](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L13-L17)

### Key Runtime Dependencies
DependencyVersionRole`okhttp3:okhttp`5.3.2WebSocket transport (`BridgeSession`)`bouncycastle:bcprov-jdk18on`1.83Device identity keypairs`security-crypto`1.1.0Encrypted credential storage`webkit`1.15.0Canvas / A2UI WebView`dnsjava:dnsjava`3.6.4Unicast DNS-SD for tailnet gateway discovery`camera-core` / `camera-camera2` / `camera-lifecycle` / `camera-video` / `camera-view`1.5.2CameraX for camera capability`zxing-android-embedded`4.3.0QR code scan for pairing setup`commonmark` + extensions0.27.1Chat markdown rendering`kotlinx-serialization-json`1.10.0JSON serialization`exifinterface`1.4.2Image EXIF metadata handlingCompose BOM2026.02.00Native UI framework
Sources: [apps/android/app/build.gradle.kts98-151](https://github.com/openclaw/openclaw/blob/8090cb4c/apps/android/app/build.gradle.kts#L98-L151)

---

## Development Commands

The root `package.json` exposes npm scripts for common Android tasks:
ScriptUnderlying CommandDescription`android:assemble``./gradlew :app:assembleDebug`Build debug APK`android:install``./gradlew :app:installDebug`Install on connected ADB device`android:run``installDebug` + `adb shell am start -n ai.openclaw.android/.MainActivity`Install and launch`android:test``./gradlew :app:testDebugUnitTest`Run unit tests`android:test:integration``vitest run ... android-node.capabilities.live.test.ts`Gateway-side live integration tests
The integration test suite is located at `src/gateway/android-node.capabilities.live.test.ts` in the Node.js gateway codebase and requires a connected Android device. It is gated by the environment variables `OPENCLAW_LIVE_TEST=1` and `OPENCLAW_LIVE_ANDROID_NODE=1`.

Sources: [package.json50-54](https://github.com/openclaw/openclaw/blob/8090cb4c/package.json#L50-L54)

---

# Security

# Security
Relevant source files
- [SECURITY.md](https://github.com/openclaw/openclaw/blob/8090cb4c/SECURITY.md)
- [docs/cli/security.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/security.md)
- [docs/gateway/security/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md)
- [src/agents/sandbox-create-args.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox-create-args.test.ts)
- [src/agents/sandbox/browser.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/browser.ts)
- [src/agents/sandbox/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts)
- [src/agents/sandbox/docker.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/docker.ts)
- [src/agents/sandbox/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/types.ts)
- [src/agents/sandbox/validate-sandbox-security.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.test.ts)
- [src/agents/sandbox/validate-sandbox-security.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts)
- [src/config/config.sandbox-docker.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.sandbox-docker.test.ts)
- [src/config/types.sandbox.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.sandbox.ts)
- [src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts)
- [src/security/audit-extra.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts)
- [src/security/audit.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts)
- [src/security/audit.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts)

This page covers the OpenClaw security model: the personal-assistant trust assumption, the attack surface it creates, and an overview of the key mechanisms for reducing risk. For the automated security audit command and its full check reference, see [Security Audit](/openclaw/openclaw/7.1-security-audit). For Docker-based agent sandboxing configuration, see [Sandboxing](/openclaw/openclaw/7.2-sandboxing). For exec command approvals and the exec tool policy, see [Exec Tool & Exec Approvals](/openclaw/openclaw/3.4.1-exec-tool-and-exec-approvals). For Gateway authentication modes and device pairing, see [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing).

---

## Trust Model: Personal Assistant

OpenClaw is designed for a **personal assistant** deployment: one trusted operator boundary per Gateway instance, potentially many agents.

- Anyone who can authenticate to the Gateway, or modify `~/.openclaw` state and config, is a trusted operator.
- A single Gateway shared by mutually untrusted users is **not** a supported security model. Use separate gateways — and ideally separate OS users or hosts — per trust boundary.
- `sessionKey`, session IDs, and labels are routing controls, not per-user authorization tokens.
- The model and agent are **not** trusted principals. Security comes from host/config trust, auth, tool policy, sandboxing, and exec approvals — not from model judgment.

### Trust Boundary Matrix
Boundary or controlWhat it meansCommon misread`gateway.auth` (token / password / device)Authenticates callers to Gateway APIs"Needs per-message signatures on every frame to be secure"`sessionKey`Routing key for context/session selection"Session key is a user auth boundary"Prompt/content guardrailsReduce model abuse risk"Prompt injection alone proves auth bypass"`canvas.eval` / browser evaluateIntentional operator capability when enabled"Any JS eval is automatically a vulnerability in this model"Local TUI `!` shellExplicit operator-triggered local execution"Local shell convenience is remote injection"Node pairing and node commandsOperator-level remote execution on paired devices"Remote device control should be untrusted by default"Exec approvals (`allow` / `ask`)Operator guardrails to reduce accidental command execution"Approval list is a multi-tenant authorization boundary"
Sources: [docs/gateway/security/index.md98-122](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L98-L122)[SECURITY.md84-160](https://github.com/openclaw/openclaw/blob/8090cb4c/SECURITY.md#L84-L160)

### What Is Not a Vulnerability by Design

These patterns are regularly reported and closed without code changes unless a real trust boundary bypass is demonstrated:

- Prompt-injection-only chains without a policy, auth, or sandbox bypass.
- Claims assuming hostile multi-tenant operation on one shared host/config.
- Normal operator read-path access (`sessions.list`, `sessions.preview`, `chat.history`) treated as IDOR in a shared-gateway setup.
- Localhost-only deployment findings such as missing HSTS on a loopback-only gateway.
- "Missing per-user authorization" findings that treat `sessionKey` as an auth token.
- Host-side exec when sandbox runtime is disabled — this is documented default behavior.

Sources: [SECURITY.md108-122](https://github.com/openclaw/openclaw/blob/8090cb4c/SECURITY.md#L108-L122)[docs/gateway/security/index.md123-133](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L123-L133)

---

## Attack Surface

The security model requires deliberate choices about three things:

1. **Who can talk to the bot** — channel DM/group policies, allowlists, and pairing.
2. **Where the bot is allowed to act** — tool policy, workspace restrictions, and sandboxing.
3. **What the bot can touch** — network exposure, filesystem access, and elevated tool grants.

The `summary.attack_surface` finding (check ID, emitted by `collectAttackSurfaceSummaryFindings`) appears on every audit run and summarizes the active surface across groups, elevated tools, webhooks, and browser control.

**Security subsystem architecture — code entities by concern:**

```
Security Audit - src/security/

Gateway Auth - src/gateway/

Exec Approvals

safeBins / safeBinProfiles

tools.exec.security (deny/ask/allow)

Sandbox - src/agents/sandbox/

validateSandboxSecurity (validate-sandbox-security.ts)

buildSandboxCreateArgs (docker.ts)

ensureSandboxContainer (docker.ts)

Channel Access Layer

dmPolicy / groupPolicy / allowFrom / allowlist pairing

resolveGatewayAuth (auth.ts)

runSecurityAudit (audit.ts)

audit-extra.sync.ts (config-based collectors)

audit-extra.async.ts (fs/plugin collectors)

audit-channel.ts (channel policy collectors)
```

Sources: [src/security/audit.ts1-60](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L1-L60)[src/security/audit-extra.ts1-40](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts#L1-L40)[src/agents/sandbox/docker.ts259-285](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/docker.ts#L259-L285)[src/agents/sandbox/validate-sandbox-security.ts1-40](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts#L1-L40)

---

## Key Security Mechanisms

### Gateway Authentication

Authentication is resolved by `resolveGatewayAuth` ([src/security/audit.ts268-285](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L268-L285)). Supported modes:
ModeDescription`token`Shared secret via `gateway.auth.token` or `OPENCLAW_GATEWAY_TOKEN` env var`password`Password via `gateway.auth.password` or `OPENCLAW_GATEWAY_PASSWORD` env var`trusted-proxy`Delegates auth to a reverse proxy; reads user identity from `gateway.auth.trustedProxy.userHeader`TailscaleNetwork-level auth when `gateway.tailscale.mode` is `"serve"` or `"funnel"``none`No auth — flagged `critical` by audit when Gateway is non-loopback
The audit emits `gateway.bind_no_auth` at `critical` when a non-loopback bind has no shared secret. For non-loopback binds without `trusted-proxy` mode, `gateway.auth.rateLimit` is also recommended (check ID `gateway.auth_no_rate_limit`).

Sources: [src/security/audit.ts262-550](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L262-L550)[docs/gateway/security/index.md311-351](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L311-L351)

### Channel DM and Group Access Policies

Channel access is evaluated before a message reaches the agent:
PolicyBehavior`dmPolicy: "pairing"`Unknown senders receive a pairing code; bot ignores them until an operator approves`dmPolicy: "allowlist"`Only listed senders can DM; others are silently dropped`dmPolicy: "open"`Anyone can DM; requires explicit `"*"` in allowlist as opt-in`dmPolicy: "disabled"`All inbound DMs ignored`groupPolicy: "allowlist"`Group messages only from configured group targets`groupPolicy: "open"`All group messages accepted; flagged by audit when combined with tool access
When multiple users share a DM inbox, session isolation can be enabled:

```
{ session: { dmScope: "per-channel-peer" } }
```

This is a messaging-context boundary, not a host-admin boundary.

Sources: [docs/gateway/security/index.md447-476](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L447-L476)

### Tool Policy and Elevated Access

`tools.elevated` grants extra capabilities to specific channel senders. A wildcard `"*"` in `tools.elevated.allowFrom` is flagged `critical` by the audit (check ID `tools.elevated.allowFrom.<channel>.wildcard`).

Two built-in tools make persistent control-plane changes and require explicit trust:
Tool namePersistent action`gateway`Calls `config.apply`, `config.patch`, `update.run``cron`Creates scheduled jobs that run after the session ends
For agents handling untrusted content, deny these:

```
{ tools: { deny: ["gateway", "cron", "sessions_spawn", "sessions_send"] } }
```

The audit emits `security.exposure.open_groups_with_elevated` (`critical`) when `groupPolicy: "open"` is combined with elevated tools.

Sources: [docs/gateway/security/index.md413-429](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L413-L429)[src/security/audit.test.ts1081-1093](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L1081-L1093)

### Sandboxing (Docker)

When sandbox mode is `"non-main"` or `"all"`, exec runs inside Docker containers. Security constraints are enforced at container creation time by `validateSandboxSecurity` in [src/agents/sandbox/validate-sandbox-security.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts)

**Sandbox enforcement chain:**

```
ensureSandboxContainer (docker.ts)

createSandboxContainer (docker.ts)

buildSandboxCreateArgs (docker.ts)

validateSandboxSecurity (validate-sandbox-security.ts)

validateBindMounts

validateNetworkMode

validateSeccompProfile

validateApparmorProfile

BLOCKED_HOST_PATHS denylist
```

Enforced blocks (no override without explicit `dangerouslyAllow*` config keys):
CategoryBlocked valuesBind mount host paths (`BLOCKED_HOST_PATHS`)`/etc`, `/proc`, `/sys`, `/dev`, `/root`, `/boot`, `/run`, `/var/run`, Docker socket pathsNetwork mode`host`, `container:<id>` (namespace join) — blocked by `validateNetworkMode`seccomp profile`unconfined` — blocked by `validateSeccompProfile`AppArmor profile`unconfined` — blocked by `validateApparmorProfile`
Dangerous overrides (`dangerouslyAllowReservedContainerTargets`, `dangerouslyAllowExternalBindSources`, `dangerouslyAllowContainerNamespaceJoin`) are tracked in `DANGEROUS_SANDBOX_DOCKER_BOOLEAN_KEYS`[src/agents/sandbox/config.ts27-31](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts#L27-L31) and reported by the security audit.

Sandbox modes (field `SandboxConfig.mode` in [src/agents/sandbox/types.ts55-64](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/types.ts#L55-L64)):
ModeBehavior`"off"`No containerization; exec runs on the gateway host`"non-main"`Sandbox applies to non-main sessions`"all"`All sessions run inside sandbox containers
For full sandboxing configuration details, see [Sandboxing](/openclaw/openclaw/7.2-sandboxing).

Sources: [src/agents/sandbox/validate-sandbox-security.ts1-120](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts#L1-L120)[src/agents/sandbox/docker.ts259-368](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/docker.ts#L259-L368)[src/agents/sandbox/config.ts27-32](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts#L27-L32)[src/agents/sandbox/types.ts55-64](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/types.ts#L55-L64)

### Exec Approvals

The exec approval subsystem controls shell command authorization per session:
SettingBehavior`tools.exec.security: "deny"`All exec blocked`tools.exec.security: "ask"`Every command requires operator approval`tools.exec.security: "allow"`Uses `safeBins` allowlist; commands not on the list are denied or prompted
The audit flags interpreter binaries in `safeBins` without explicit `safeBinProfiles` (check ID `tools.exec.safe_bins_interpreter_unprofiled`), and risky entries in `safeBinTrustedDirs` (check ID `tools.exec.safe_bin_trusted_dirs_risky`).

For full details, see [Exec Tool & Exec Approvals](/openclaw/openclaw/3.4.1-exec-tool-and-exec-approvals).

Sources: [src/security/audit.test.ts367-474](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L367-L474)

---

## Security Audit Overview

`runSecurityAudit` in [src/security/audit.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts) produces a `SecurityAuditReport` containing a `findings` array and a `summary` with counts by severity.

Each finding has this shape:

```
type SecurityAuditFinding = {
  checkId: string;           // e.g. "gateway.bind_no_auth"
  severity: "info" | "warn" | "critical";
  title: string;
  detail: string;
  remediation?: string;
};
```

**Audit collector pipeline — check categories mapped to functions:**

```
audit-channel.ts

collectChannelSecurityFindings

audit.ts (local)

collectGatewayConfigFindings

collectFilesystemFindings

collectBrowserControlFindings

audit-extra.async.ts

collectSandboxBrowserHashLabelFindings

collectStateDeepFilesystemFindings

collectPluginsTrustFindings

collectPluginsCodeSafetyFindings

collectIncludeFilePermFindings

audit-extra.sync.ts

collectAttackSurfaceSummaryFindings

collectExposureMatrixFindings

collectSandboxDangerousConfigFindings

collectSandboxDockerNoopFindings

collectNodeDangerousAllowCommandFindings

collectMinimalProfileOverrideFindings

collectSmallModelRiskFindings

collectSecretsInConfigFindings

collectHooksHardeningFindings

collectLikelyMultiUserSetupFindings

runSecurityAudit (audit.ts)
```

### Key Check IDs
Check IDSeverityTrigger`gateway.bind_no_auth`criticalNon-loopback bind without auth`gateway.tailscale_funnel`criticalPublic internet via Tailscale Funnel`gateway.loopback_no_auth`criticalLoopback + Control UI exposed + no auth`gateway.tools_invoke_http.dangerous_allow`warn/criticalDangerous tool re-enabled over HTTP`gateway.control_ui.device_auth_disabled`critical`dangerouslyDisableDeviceAuth=true``fs.state_dir.perms_world_writable`criticalState dir writable by other OS users`fs.config.perms_world_readable`criticalConfig file readable by other OS users`sandbox.dangerous_bind_mount`criticalBind mount to blocked host path`sandbox.dangerous_network_mode`critical`host` or `container:*` network mode`sandbox.docker_config_mode_off`warnDocker sandbox configured but `mode: "off"``security.exposure.open_groups_with_elevated`criticalOpen groups + elevated tools enabled`tools.exec.host_sandbox_no_sandbox_defaults`warn`exec.host=sandbox` while sandbox is off`tools.exec.safe_bins_interpreter_unprofiled`warnInterpreter in `safeBins` without `safeBinProfiles``logging.redact_off`warn`logging.redactSensitive="off"``config.insecure_or_dangerous_flags`warnAny `dangerous*` / `dangerously*` flag enabled`models.small_params`critical/infoSmall model with web/browser tools and no sandbox`security.trust_model.multi_user_heuristic`warnConfig suggests multi-user ingress patterns
### Running the Audit

```
openclaw security audit          # config + filesystem checks
openclaw security audit --deep   # includes live gateway probe
openclaw security audit --fix    # applies safe deterministic remediations
openclaw security audit --json   # machine-readable output for CI
```

`--fix` makes only safe, reversible changes: tightens filesystem permissions, flips `groupPolicy: "open"` to `"allowlist"`, and sets `logging.redactSensitive` to `"tools"`. It does not rotate tokens, disable tools, or change network exposure.

For the full check reference and remediation guidance, see [Security Audit](/openclaw/openclaw/7.1-security-audit).

Sources: [src/security/audit.ts54-122](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L54-L122)[src/security/audit-extra.ts1-40](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts#L1-L40)[src/security/audit-extra.sync.ts477-505](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts#L477-L505)[docs/cli/security.md1-72](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/security.md#L1-L72)

---

## Hardened Baseline

Use this as a starting point, then selectively re-enable capabilities per trusted agent:

```
{
  gateway: {
    bind: "loopback",
    auth: { mode: "token", token: "replace-with-long-random-token" },
  },
  session: { dmScope: "per-channel-peer" },
  tools: {
    profile: "messaging",
    deny: ["group:automation", "group:runtime", "group:fs", "sessions_spawn", "sessions_send"],
    fs: { workspaceOnly: true },
    exec: { security: "deny", ask: "always" },
    elevated: { enabled: false },
  },
  channels: {
    whatsapp: { dmPolicy: "pairing", groups: { "*": { requireMention: true } } },
  },
}
```

Sources: [docs/gateway/security/index.md145-172](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L145-L172)

---

## Credential Storage Map
CredentialDefault pathWhatsApp session`~/.openclaw/credentials/whatsapp/<accountId>/creds.json`Telegram bot tokenConfig/env or `channels.telegram.tokenFile`Discord bot tokenConfig/envSlack tokensConfig/env (`channels.slack.*`)Pairing allowlist (default account)`~/.openclaw/credentials/<channel>-allowFrom.json`Pairing allowlist (non-default account)`~/.openclaw/credentials/<channel>-<accountId>-allowFrom.json`Model auth profiles`~/.openclaw/agents/<agentId>/agent/auth-profiles.json`File-backed secrets payload`~/.openclaw/secrets.json`
Recommended permissions: state directory `0700`, config file `0600`. The audit emits `fs.state_dir.perms_world_writable` (`critical`) or `fs.state_dir.perms_readable` (`warn`) and similarly for the config file.

Session transcripts are stored on disk at `~/.openclaw/agents/<agentId>/sessions/*.jsonl`. Any OS user or process with filesystem access can read them; treat disk access as the trust boundary.

Sources: [docs/gateway/security/index.md197-210](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L197-L210)[SECURITY.md180-194](https://github.com/openclaw/openclaw/blob/8090cb4c/SECURITY.md#L180-L194)

---

## Reverse Proxy Configuration

When running the Gateway behind nginx, Caddy, Traefik, or similar:

- Set `gateway.trustedProxies` to the proxy IP(s). The Gateway uses `X-Forwarded-For` from listed addresses to determine the real client IP.
- Without `trustedProxies`, connections bearing proxy headers are not treated as local clients; if auth is absent, they are rejected.
- `gateway.allowRealIpFallback: true` enables `X-Real-IP` fallback — flagged as `warn` or `critical` by the audit (check ID `gateway.real_ip_fallback_enabled`) depending on bind and proxy configuration.

```
gateway:
  trustedProxies:
    - "127.0.0.1"
  allowRealIpFallback: false
  auth:
    mode: password
    password: ${OPENCLAW_GATEWAY_PASSWORD}
```

Sources: [docs/gateway/security/index.md311-351](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L311-L351)[src/security/audit.ts383-413](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L383-L413)

---

## Plugins and Extensions

Plugins run in-process with the Gateway at the same OS privilege level. Trust implications:

- Installing or enabling a plugin grants it full operator-level access to the Gateway process.
- Only install plugins from sources you explicitly trust.
- Use `plugins.allow` to pin specific trusted plugin IDs.
- Prefer pinned exact versions when installing from npm; `npm install` lifecycle scripts can execute code during install.
- The audit checks for unpinned plugin installs (check ID `plugins.tools_reachable_permissive_policy`) and reachable plugin tools under permissive tool policy.

Sources: [SECURITY.md100-106](https://github.com/openclaw/openclaw/blob/8090cb4c/SECURITY.md#L100-L106)[docs/gateway/security/index.md432-445](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L432-L445)

---

## Vulnerability Reporting

Report vulnerabilities via GitHub Security Advisories for the affected repository, or email `security@openclaw.ai`. Required in all reports:

1. Exact file path, function name, and line range on current `main` or latest release.
2. Reproducible proof-of-concept.
3. Demonstrated impact that crosses a documented trust boundary.
4. Explicit statement that the report does not rely on adversarial operators sharing one gateway host/config.

See [SECURITY.md](https://github.com/openclaw/openclaw/blob/8090cb4c/SECURITY.md) for the full reporting policy, triage fast-path requirements, common false-positive patterns, and the out-of-scope list.

Sources: [SECURITY.md1-80](https://github.com/openclaw/openclaw/blob/8090cb4c/SECURITY.md#L1-L80)

---

# Security-Audit

# Security Audit
Relevant source files
- [SECURITY.md](https://github.com/openclaw/openclaw/blob/8090cb4c/SECURITY.md)
- [docs/cli/security.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/security.md)
- [docs/gateway/security/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md)
- [src/agents/sandbox-create-args.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox-create-args.test.ts)
- [src/agents/sandbox/browser.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/browser.ts)
- [src/agents/sandbox/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts)
- [src/agents/sandbox/docker.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/docker.ts)
- [src/agents/sandbox/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/types.ts)
- [src/agents/sandbox/validate-sandbox-security.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.test.ts)
- [src/agents/sandbox/validate-sandbox-security.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts)
- [src/config/config.sandbox-docker.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.sandbox-docker.test.ts)
- [src/config/types.sandbox.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.sandbox.ts)
- [src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts)
- [src/security/audit-extra.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts)
- [src/security/audit.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts)
- [src/security/audit.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts)

This page covers the `openclaw security audit` command and the `runSecurityAudit` function — their data types, check categories, collector architecture, and remediation behavior. For the broader security model and trust boundaries, see [Security](/openclaw/openclaw/7-security). For sandboxing specifics referenced by the audit, see [Sandboxing](/openclaw/openclaw/7.2-sandboxing).

---

## CLI Usage

```
openclaw security audit          # standard config + filesystem checks
openclaw security audit --deep   # also live-probes the running Gateway
openclaw security audit --fix    # applies safe remediations
openclaw security audit --json   # machine-readable output
```

Combining flags is valid:

```
openclaw security audit --fix --json | jq '{fix: .fix.ok, summary: .report.summary}'
openclaw security audit --deep --json | jq '.findings[] | select(.severity=="critical") | .checkId'
```

Sources: [docs/cli/security.md1-73](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/security.md#L1-L73)

---

## Core Data Types

**Audit report hierarchy:**

```
SecurityAuditReport

+number ts

+SecurityAuditSummary summary

+SecurityAuditFinding[] findings

+deep: DeepResult

SecurityAuditSummary

+number critical

+number warn

+number info

SecurityAuditFinding

+string checkId

+SecurityAuditSeverity severity

+string title

+string detail

+string remediation

«type»

SecurityAuditSeverity

"info" | "warn" | "critical"
```

Sources: [src/security/audit.ts54-83](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L54-L83)

### `SecurityAuditOptions`

`runSecurityAudit` accepts a `SecurityAuditOptions` object:
FieldTypePurpose`config``OpenClawConfig`Parsed gateway config`env``NodeJS.ProcessEnv`Environment variables (for token/secret resolution)`platform``NodeJS.Platform`Platform override (default: `process.platform`)`deep``boolean`Enable live Gateway probe`includeFilesystem``boolean`Run filesystem permission checks`includeChannelSecurity``boolean`Run channel allowlist security checks`stateDir``string`Override default state directory path`configPath``string`Override default config file path`deepTimeoutMs``number`Timeout for deep Gateway probe`plugins``ChannelPlugin[]`DI for tests`probeGatewayFn``typeof probeGateway`DI for tests`execIcacls``ExecFn`DI for Windows ACL checks`execDockerRawFn``typeof execDockerRaw`DI for Docker label checks
Sources: [src/security/audit.ts85-106](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L85-L106)

---

## Architecture

### `runSecurityAudit` Execution Flow

**Diagram: runSecurityAudit execution flow**

```
includeFilesystem=true

includeFilesystem=true

includeFilesystem=true

includeChannelSecurity=true

includeChannelSecurity=true

includeChannelSecurity=true

deep=true

runSecurityAudit(SecurityAuditOptions)

collectGatewayConfigFindings(cfg, env)

collectBrowserControlFindings(cfg, env)

collectFilesystemFindings(stateDir, configPath)

collectAttackSurfaceSummaryFindings(cfg)

collectExposureMatrixFindings(cfg, env)

collectHooksHardeningFindings(cfg, env)

collectNodeDenyCommandPatternFindings(cfg)

collectNodeDangerousAllowCommandFindings(cfg)

collectSandboxDangerousConfigFindings(cfg)

collectSandboxDockerNoopFindings(cfg)

collectSmallModelRiskFindings(cfg, env)

collectModelHygieneFindings(cfg)

collectSecretsInConfigFindings(cfg)

collectMinimalProfileOverrideFindings(cfg)

collectLikelyMultiUserSetupFindings(cfg)

collectGatewayHttpNoAuthFindings(cfg, env)

collectGatewayHttpSessionKeyOverrideFindings(cfg)

collectSandboxBrowserHashLabelFindings(...)

collectIncludeFilePermFindings(cfg, stateDir)

collectPluginsTrustFindings(cfg)

collectPluginsCodeSafetyFindings(cfg, plugins)

collectChannelSecurityFindings(cfg, plugins)

probeGateway(...)

countBySeverity(findings)

SecurityAuditReport
```

Sources: [src/security/audit.ts1-52](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L1-L52)[src/security/audit-extra.ts1-39](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts#L1-L39)

### Collector Module Split

The collector functions are split into two files based on whether they require I/O:

```
src/security/audit-extra.async.ts

src/security/audit-extra.sync.ts

src/security/audit-extra.ts

Re-export barrel

Config-based checks
(no I/O)

Filesystem/plugin checks
(async I/O)

src/security/audit.ts
runSecurityAudit()
```

Sources: [src/security/audit-extra.ts1-39](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts#L1-L39)[src/security/audit-extra.sync.ts1-15](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts#L1-L15)

---

## Check Categories

Each finding has a `checkId` that follows a dot-separated namespace. The following table covers all checkId categories, their source collector functions, and typical severities.

### Gateway Configuration Checks

Produced by `collectGatewayConfigFindings` in [src/security/audit.ts262-551](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L262-L551)
`checkId`SeverityCondition`gateway.bind_no_auth`criticalNon-loopback bind with no auth token/password`gateway.loopback_no_auth`criticalLoopback bind + Control UI enabled + no auth configured`gateway.trusted_proxies_missing`warnLoopback bind + Control UI enabled + `trustedProxies` is empty`gateway.auth_no_rate_limit`warnNon-loopback bind with no `auth.rateLimit` configured`gateway.tools_invoke_http.dangerous_allow`warn / critical`gateway.tools.allow` re-enables tools from the default HTTP deny list`gateway.token_too_short`warnAuth token length < 24 characters`gateway.control_ui.allowed_origins_required`criticalNon-loopback Control UI without explicit `allowedOrigins``gateway.control_ui.host_header_origin_fallback`warn / critical`dangerouslyAllowHostHeaderOriginFallback=true``gateway.control_ui.insecure_auth`warn`allowInsecureAuth=true``gateway.control_ui.device_auth_disabled`critical`dangerouslyDisableDeviceAuth=true``gateway.real_ip_fallback_enabled`warn / critical`allowRealIpFallback=true``gateway.tailscale_funnel`critical`tailscale.mode="funnel"``gateway.tailscale_serve`info`tailscale.mode="serve"``gateway.trusted_proxy_auth`critical`auth.mode="trusted-proxy"` (informational reminder)`gateway.trusted_proxy_no_proxies`criticalTrusted-proxy mode with empty `trustedProxies``gateway.trusted_proxy_no_user_header`criticalTrusted-proxy mode without `userHeader``gateway.trusted_proxy_no_allowlist`warnTrusted-proxy mode with empty `allowUsers``discovery.mdns_full_mode`warn / critical`discovery.mdns.mode="full"``config.insecure_or_dangerous_flags`warnAny enabled `dangerous*`/`dangerously*` config flag
The severity of several gateway checks escalates from `warn` to `critical` when `gateway.bind` is not `loopback` or when Tailscale Funnel is active.

Sources: [src/security/audit.ts262-551](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L262-L551)

### Filesystem Permission Checks

Produced by `collectFilesystemFindings`, enabled only when `includeFilesystem=true`.
`checkId`SeverityCondition`fs.state_dir.symlink`warnState directory is a symlink`fs.state_dir.perms_world_writable`criticalState dir world-writable`fs.state_dir.perms_group_writable`warnState dir group-writable`fs.state_dir.perms_readable`warnState dir group- or world-readable`fs.config.symlink`warnConfig file is a symlink`fs.config.perms_writable`criticalConfig file world- or group-writable`fs.config.perms_world_readable`criticalConfig file world-readable`fs.config.perms_group_readable`warnConfig file group-readable`fs.synced_dir`warnState or config path looks like a cloud-synced folder
On Windows, filesystem permissions are evaluated using `icacls` via the injected `execIcacls` function rather than POSIX mode bits. Symlink targets are resolved before evaluating config file permissions; if the config is a symlink, readable-permission warnings are suppressed since the target path is responsible.

Sources: [src/security/audit.ts131-260](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L131-L260)[src/security/audit-extra.sync.ts507-522](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts#L507-L522)

### Browser Control Checks

Produced by `collectBrowserControlFindings` in [src/security/audit.ts582-706](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L582-L706)
`checkId`SeverityCondition`browser.control_invalid_config`warn`resolveBrowserConfig` throws`browser.control_no_auth`criticalBrowser enabled, no gateway auth token/password`browser.remote_cdp_http`warnRemote CDP URL uses `http://` instead of `https://`
### Attack Surface Summary

Produced by `collectAttackSurfaceSummaryFindings` in [src/security/audit-extra.sync.ts477-505](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts#L477-L505)
`checkId`SeverityAlways emitted?`summary.attack_surface`infoYes
The detail field includes counts of open/allowlist group policies, `tools.elevated` state, hooks state, browser control state, and a reminder of the personal-assistant trust model.

### Exposure Matrix Checks

Produced by `collectExposureMatrixFindings` in [src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts)
`checkId`SeverityCondition`security.exposure.open_groups_with_elevated`criticalOpen group policies with elevated tools enabled`security.exposure.open_groups_with_runtime_or_fs`critical / warnOpen groups with exec/fs tools accessible without sandbox/workspace guards`security.trust_model.multi_user_heuristic`warnConfig signals suggest likely multi-user ingress
### Tool Policy Checks

Produced by `collectMinimalProfileOverrideFindings` and related collectors.
`checkId`SeverityCondition`tools.profile_minimal_overridden`warnGlobal `tools.profile="minimal"` overridden by per-agent profile`tools.elevated.allowFrom.<channel>.wildcard`critical`tools.elevated.allowFrom` contains `"*"` for a channel`tools.exec.host_sandbox_no_sandbox_defaults`warn`tools.exec.host="sandbox"` but default sandbox mode is `off``tools.exec.host_sandbox_no_sandbox_agents`warnPer-agent `exec.host="sandbox"` but that agent's sandbox mode is `off``tools.exec.safe_bins_interpreter_unprofiled`warnInterpreter-like bins in `safeBins` without explicit `safeBinProfiles``tools.exec.safe_bin_trusted_dirs_risky`warn`safeBinTrustedDirs` contains user-writable or world-writable paths
Sources: [src/security/audit-extra.sync.ts243-272](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts#L243-L272)[src/security/audit.test.ts304-487](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L304-L487)

### Sandbox Configuration Checks
`checkId`SeverityCondition`sandbox.docker_config_mode_off`warnDocker config is set but `sandbox.mode="off"` on all agents`sandbox.dangerous_bind_mount`critical`binds` contains paths from `BLOCKED_HOST_PATHS` (e.g. `/etc`, `/proc`, Docker socket)`sandbox.dangerous_network_mode`critical`network="host"` or `"container:<id>"` namespace join`sandbox.dangerous_seccomp_profile`critical`seccompProfile="unconfined"``sandbox.dangerous_apparmor_profile`critical`apparmorProfile="unconfined"``sandbox.browser_container.hash_label_missing`warnRunning sandbox browser container missing `openclaw.browserConfigEpoch` label`sandbox.browser_container.hash_epoch_stale`warnBrowser container has an outdated security epoch label`sandbox.browser_container.non_loopback_publish`criticalBrowser container published port is bound to non-loopback address`sandbox.browser_cdp_bridge_unrestricted`warnSandbox browser uses Docker `bridge` network without `cdpSourceRange`
The sandbox Docker validation constants (`BLOCKED_HOST_PATHS`) are defined in [src/agents/sandbox/validate-sandbox-security.ts18-33](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts#L18-L33) and shared between the runtime sandbox creation code and the audit collectors.

Sources: [src/security/audit.test.ts618-985](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L618-L985)[src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts)

### Hooks Hardening Checks

Produced by `collectHooksHardeningFindings`.
`checkId`SeverityCondition`hooks.token_too_short`warn`hooks.token` length < 24`hooks.request_session_key_enabled`warn / critical`hooks.allowRequestSessionKey=true``hooks.request_session_key_prefixes_missing`warn / criticalSession key override enabled without `allowedSessionKeyPrefixes`
Sources: [src/security/audit-extra.sync.ts554-552](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts#L554-L552)

### Model Hygiene Checks
`checkId`SeverityCondition`models.small_params`critical / infoModel has ≤ 300B inferred parameters with web/browser tools enabled; severity degrades to `info` when sandbox mode is `all``models.legacy`warnModel matches legacy patterns (GPT-3.5, Claude 2, etc.)
Sources: [src/security/audit-extra.sync.ts154-159](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts#L154-L159)[src/security/audit.test.ts780-820](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L780-L820)

### Node Command Policy Checks
`checkId`SeverityCondition`gateway.nodes.deny_commands_ineffective`warn`denyCommands` entries use glob patterns or unknown command names (matching is exact)`gateway.nodes.allow_commands_dangerous`warn / critical`allowCommands` enables sensitive commands (camera, screen, contacts, etc.)
Sources: [src/security/audit.test.ts987-1059](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L987-L1059)

### Secrets and Config Flag Checks
`checkId`SeverityCondition`config.secrets.gateway_password_in_config`warn`gateway.auth.password` set in config file (not env ref)`config.secrets.hooks_token_in_config`info`hooks.token` set in config file`config.insecure_or_dangerous_flags`warnAny known insecure/dangerous debug flag is `true``logging.redact_off`warn`logging.redactSensitive="off"`
Sources: [src/security/audit-extra.sync.ts524-552](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts#L524-L552)[src/security/audit.test.ts1189-1212](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L1189-L1212)

### Plugin and Skill Checks
`checkId`SeverityCondition`plugins.tools_reachable_permissive_policy`warnExtension plugin tools reachable under permissive tool policy
Sources: [src/security/audit-extra.ts31-39](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts#L31-L39)

---

## Collector Module Map

**Diagram: collectors and the modules they live in**

```
src/security/audit-channel.ts

src/security/audit-extra.async.ts

src/security/audit-extra.sync.ts

src/security/audit.ts

runSecurityAudit()

collectGatewayConfigFindings()

collectFilesystemFindings()

collectBrowserControlFindings()

countBySeverity()

collectAttackSurfaceSummaryFindings()

collectExposureMatrixFindings()

collectGatewayHttpNoAuthFindings()

collectGatewayHttpSessionKeyOverrideFindings()

collectHooksHardeningFindings()

collectLikelyMultiUserSetupFindings()

collectMinimalProfileOverrideFindings()

collectModelHygieneFindings()

collectNodeDangerousAllowCommandFindings()

collectNodeDenyCommandPatternFindings()

collectSandboxDangerousConfigFindings()

collectSandboxDockerNoopFindings()

collectSecretsInConfigFindings()

collectSmallModelRiskFindings()

collectSyncedFolderFindings()

collectSandboxBrowserHashLabelFindings()

collectIncludeFilePermFindings()

collectInstalledSkillsCodeSafetyFindings()

collectPluginsCodeSafetyFindings()

collectPluginsTrustFindings()

collectStateDeepFilesystemFindings()

readConfigSnapshotForAudit()

collectChannelSecurityFindings()

collectNodeDanyCommandPatternFindings
```

Sources: [src/security/audit.ts1-52](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L1-L52)[src/security/audit-extra.ts1-39](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts#L1-L39)

---

## Severity Escalation Logic

Several checks use the gateway's network exposure to decide between `warn` and `critical`. The `isGatewayRemotelyExposed` helper in [src/security/audit-extra.sync.ts90-97](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts#L90-L97) returns `true` when:

- `gateway.bind` is not `loopback`, **or**
- `gateway.tailscale.mode` is `"serve"` or `"funnel"`

The `isStrictLoopbackTrustedProxyEntry` helper in [src/security/audit.ts555-580](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L555-L580) provides a stricter check for trusted proxy entries, treating only `127.0.0.1` and `::1` (with full /32 or /128 prefix) as loopback.

---

## Deep Mode

When `deep=true` is passed, `runSecurityAudit` calls `probeGateway` (or the injected `probeGatewayFn`) against the running Gateway. The result is included in `SecurityAuditReport.deep.gateway`:

```
deep?: {
  gateway?: {
    attempted: boolean;
    url: string | null;
    ok: boolean;
    error: string | null;
    close?: { code: number; reason: string } | null;
  };
}
```

The auth for the probe is resolved via `resolveGatewayProbeAuth` from [src/gateway/probe-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/gateway/probe-auth.ts)

Sources: [src/security/audit.ts74-83](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts#L74-L83)

---

## `--fix` Behavior

`--fix` applies deterministic, safe remediations. It does **not** touch secrets, tokens, or network binding settings.

**What `--fix` changes:**

- Flips `groupPolicy="open"` to `groupPolicy="allowlist"` in config (including per-account variants)
- Sets `logging.redactSensitive` from `"off"` to `"tools"`
- Tightens filesystem permissions on state directory, config file, `credentials/*.json`, `auth-profiles.json`, `sessions.json`, and session `*.jsonl` files

**What `--fix` does not change:**

- Token/password rotation
- Tool policy (`gateway`, `cron`, `exec`, etc.)
- Gateway bind or auth mode changes
- Plugin or skill removal

Sources: [docs/cli/security.md58-73](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/security.md#L58-L73)

---

## Finding Prioritization

The audit report's `summary` field counts findings by severity. When remediating, the documentation recommends the following priority order:

1. **Critical + open access + tools enabled** — lock down DM/group policies first
2. **Public network exposure** — LAN bind, Tailscale Funnel, missing auth
3. **Browser control remote exposure** — treat as equivalent to operator access
4. **Filesystem permissions** — state dir, config, credentials, session files
5. **Plugins/extensions** — load only trusted, explicitly allowlisted plugins
6. **Model choice** — prefer instruction-hardened models for tool-enabled agents

Sources: [docs/gateway/security/index.md212-220](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L212-L220)

---

## checkId Quick Reference

The table below consolidates the high-signal `checkId` values with their associated config keys for remediation.
`checkId`SeverityConfig key to fix`fs.state_dir.perms_world_writable`criticalfilesystem perms on `~/.openclaw``fs.config.perms_writable`criticalfilesystem perms on `openclaw.json``fs.config.perms_world_readable`criticalfilesystem perms on `openclaw.json``gateway.bind_no_auth`critical`gateway.bind`, `gateway.auth.*``gateway.loopback_no_auth`critical`gateway.auth.*``gateway.tools_invoke_http.dangerous_allow`warn/critical`gateway.tools.allow``gateway.nodes.allow_commands_dangerous`warn/critical`gateway.nodes.allowCommands``gateway.tailscale_funnel`critical`gateway.tailscale.mode``gateway.control_ui.allowed_origins_required`critical`gateway.controlUi.allowedOrigins``gateway.control_ui.device_auth_disabled`critical`gateway.controlUi.dangerouslyDisableDeviceAuth``gateway.real_ip_fallback_enabled`warn/critical`gateway.allowRealIpFallback``discovery.mdns_full_mode`warn/critical`discovery.mdns.mode``config.insecure_or_dangerous_flags`warnmultiple keys (see finding detail)`hooks.token_too_short`warn`hooks.token``hooks.request_session_key_enabled`warn/critical`hooks.allowRequestSessionKey``logging.redact_off`warn`logging.redactSensitive``sandbox.docker_config_mode_off`warn`agents.*.sandbox.mode``sandbox.dangerous_network_mode`critical`agents.*.sandbox.docker.network``sandbox.dangerous_bind_mount`critical`agents.*.sandbox.docker.binds``sandbox.browser_container.non_loopback_publish`criticalport binding in browser container`tools.exec.host_sandbox_no_sandbox_defaults`warn`tools.exec.host`, `agents.defaults.sandbox.mode``tools.exec.safe_bins_interpreter_unprofiled`warn`tools.exec.safeBins`, `tools.exec.safeBinProfiles``security.exposure.open_groups_with_elevated`critical`channels.*.groupPolicy`, `tools.elevated.*``security.trust_model.multi_user_heuristic`warnsplit trust boundaries or add sandbox/workspace scoping`tools.profile_minimal_overridden`warn`agents.list[].tools.profile``models.small_params`critical/infomodel choice + sandbox/tool policy
Sources: [docs/gateway/security/index.md227-259](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md#L227-L259)[src/security/audit.test.ts1-1300](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L1-L1300)

---

# Sandboxing

# Sandboxing
Relevant source files
- [SECURITY.md](https://github.com/openclaw/openclaw/blob/8090cb4c/SECURITY.md)
- [docs/cli/security.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/cli/security.md)
- [docs/gateway/security/index.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/gateway/security/index.md)
- [docs/tools/exec-approvals.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/exec-approvals.md)
- [docs/tools/exec.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/exec.md)
- [src/agents/bash-tools.exec-runtime.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec-runtime.ts)
- [src/agents/bash-tools.exec.path.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.path.test.ts)
- [src/agents/bash-tools.exec.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts)
- [src/agents/sandbox-create-args.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox-create-args.test.ts)
- [src/agents/sandbox-merge.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox-merge.test.ts)
- [src/agents/sandbox/browser.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/browser.ts)
- [src/agents/sandbox/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts)
- [src/agents/sandbox/docker.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/docker.ts)
- [src/agents/sandbox/types.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/types.ts)
- [src/agents/sandbox/validate-sandbox-security.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.test.ts)
- [src/agents/sandbox/validate-sandbox-security.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts)
- [src/cli/nodes-cli.coverage.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/nodes-cli.coverage.test.ts)
- [src/cli/nodes-cli/register.invoke.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/cli/nodes-cli/register.invoke.ts)
- [src/config/config.sandbox-docker.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.sandbox-docker.test.ts)
- [src/config/types.sandbox.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/types.sandbox.ts)
- [src/infra/exec-approvals-allowlist.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-allowlist.ts)
- [src/infra/exec-approvals-analysis.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-analysis.ts)
- [src/infra/exec-approvals-safe-bins.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals-safe-bins.test.ts)
- [src/infra/exec-approvals.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-approvals.test.ts)
- [src/infra/exec-command-resolution.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-command-resolution.ts)
- [src/infra/exec-safe-bin-policy-profiles.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy-profiles.ts)
- [src/infra/exec-safe-bin-policy-validator.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy-validator.ts)
- [src/infra/exec-safe-bin-policy.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy.test.ts)
- [src/infra/exec-safe-bin-policy.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/exec-safe-bin-policy.ts)
- [src/infra/path-prepend.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/path-prepend.ts)
- [src/node-host/invoke-system-run.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke-system-run.test.ts)
- [src/node-host/invoke-system-run.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke-system-run.ts)
- [src/node-host/invoke.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/node-host/invoke.ts)
- [src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts)
- [src/security/audit-extra.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts)
- [src/security/audit.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts)
- [src/security/audit.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.ts)

This page covers Docker-based agent sandboxing in OpenClaw: how the sandbox is configured, how dangerous configurations are blocked at runtime and at audit time, how the browser container is managed inside the sandbox, and how the `exec` tool routes commands to the container versus the host.

For the exec approval system (allowlists, `security` and `ask` modes that apply when exec runs on the **gateway or node host**), see [Exec Tool & Exec Approvals](/openclaw/openclaw/3.4.1-exec-tool-and-exec-approvals). For the security audit subsystem that surfaces sandbox misconfigurations, see [Security Audit](/openclaw/openclaw/7.1-security-audit).

---

## Overview

When sandbox mode is enabled, each agent session routes `exec` commands into a Docker container rather than running them directly on the gateway host. The sandbox:

- Isolates agent shell execution from the host filesystem (except explicitly mounted bind paths)
- Restricts network access according to the configured network mode
- Uses a configurable Docker image with bind mounts and kernel security profiles
- **Fails closed**: if `exec.host=sandbox` is configured but no sandbox runtime is active for the session, the `exec` tool throws rather than silently executing on the gateway host

A separate **browser sandbox** can run a Chromium-based container alongside the agent, accessed via noVNC and Chrome DevTools Protocol (CDP).

---

## Sandbox Modes

Sandbox mode is set via `agents.defaults.sandbox.mode` or per-agent via `agents.list[].sandbox.mode`. The function `resolveSandboxScope` in [src/agents/sandbox/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts) evaluates the active session key to determine whether sandbox applies.
ModeBehavior`"off"` (default)No Docker isolation; exec runs on the gateway host`"non-main"`Sandbox active for all sessions except the `main` session`"all"`Sandbox active for all sessions, including `main`
Sources: [src/agents/sandbox/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts)[src/agents/sandbox-merge.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox-merge.test.ts)

---

## Configuration

Sandbox configuration is resolved by `resolveSandboxDockerConfig` and `resolveSandboxBrowserConfig` in [src/agents/sandbox/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts) which merge global defaults with per-agent overrides.

### `SandboxConfig` structure
FieldTypeDescription`mode``"off" | "non-main" | "all"`When sandbox runtime is active`docker``SandboxDockerConfig`Docker container settings`browser``SandboxBrowserConfig`In-sandbox browser settings`prune`objectContainer/image prune settings
### `SandboxDockerConfig` fields
FieldDescriptionSecurity enforcement`image`Docker image for agent containers—`binds`Bind mount specs (`host:container[:ro]`)Blocked by `validateBindMounts``network`Network modeBlocked by `validateNetworkMode``seccompProfile`seccomp profile path or `"unconfined"``"unconfined"` blocked by `validateSeccompProfile``apparmorProfile`AppArmor profile or `"unconfined"``"unconfined"` blocked by `validateApparmorProfile``dangerouslyAllowReservedContainerTargets`Bypass reserved container name blockbreak-glass only`dangerouslyAllowExternalBindSources`Bypass external bind source blockbreak-glass only`dangerouslyAllowContainerNamespaceJoin`Bypass `container:*` network blockbreak-glass only
The `DANGEROUS_SANDBOX_DOCKER_BOOLEAN_KEYS` constant in [src/agents/sandbox/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts) enumerates all `dangerously*` keys; both runtime validation and the security audit reference this list.

Sources: [src/agents/sandbox/config.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/config.ts)[src/config/config.sandbox-docker.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/config/config.sandbox-docker.test.ts)

---

## Security Enforcement: `validateSandboxSecurity`

At container creation time, `validateSandboxSecurity` in [src/agents/sandbox/validate-sandbox-security.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts) runs a set of hard checks against the resolved Docker configuration. These run **before** Docker is invoked and throw on any violation, unless the corresponding `dangerously*` flag is set.

The same helper `getBlockedBindReason` is shared between runtime enforcement and the security audit (`collectSandboxDangerousConfigFindings` in [src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts) imports it directly), so audit findings and runtime errors reflect the same ruleset.

**Diagram: `validateSandboxSecurity` enforcement chain**

```
blocked system path

'host' or 'container:*'

'unconfined'

'unconfined'

all binds pass

passes

passes

passes

validateSandboxSecurity(config)
validate-sandbox-security.ts

validateBindMounts(binds)

validateNetworkMode(network)

validateSeccompProfile(seccompProfile)

validateApparmorProfile(apparmorProfile)

getBlockedBindReason(path)

isDangerousNetworkMode(network)
sandbox/network-mode.ts

container creation proceeds

throws Error
```

Sources: [src/agents/sandbox/validate-sandbox-security.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts)[src/agents/sandbox/validate-sandbox-security.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.test.ts)[src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts)

### Bind mount restrictions

`validateBindMounts` calls `getBlockedBindReason` for each bind's source path. Paths under sensitive system directories (e.g. `/etc`, `/run`, system binary/library paths) are blocked. Two `dangerously*` flags can bypass parts of this check:

- `dangerouslyAllowExternalBindSources` — skips the external-source path check
- `dangerouslyAllowReservedContainerTargets` — skips the reserved container name check

### Network mode restrictions

`isDangerousNetworkMode` (in [src/agents/sandbox/network-mode.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/network-mode.ts)) blocks:

- `"host"` — shares the host's network namespace entirely
- `"container:<id>"` — joins another container's network namespace

`dangerouslyAllowContainerNamespaceJoin` bypasses the `container:*` check.

### seccomp and AppArmor

Both `validateSeccompProfile` and `validateApparmorProfile` reject `"unconfined"`, which would disable kernel-level syscall filtering or MAC profile enforcement respectively.

Sources: [src/agents/sandbox/validate-sandbox-security.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.ts)[src/agents/sandbox/validate-sandbox-security.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/validate-sandbox-security.test.ts)

---

## Docker Container Lifecycle

**Diagram: sandbox container creation and exec dispatch**

```
Host Process

Sandbox Enforcement (sandbox/)

Agent Runtime (bash-tools.exec.ts)

host=sandbox

passes all checks

createExecTool()

resolveSandboxWorkdir()
bash-tools.shared.ts

buildSandboxEnv()
bash-tools.shared.ts

validateSandboxSecurity()
validate-sandbox-security.ts

buildSandboxCreateArgs()
sandbox/docker.ts

execDocker()
sandbox/docker.ts

execDockerRaw()
sandbox/docker.ts

docker binary
```

- `buildSandboxCreateArgs` ([src/agents/sandbox/docker.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/docker.ts)) translates the resolved `SandboxDockerConfig` into `docker create` arguments including bind mounts, network, memory limits, and security profiles
- `execDockerRaw` ([src/agents/sandbox/docker.ts29-100](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/docker.ts#L29-L100)) spawns the `docker` binary directly and returns typed `{ stdout, stderr, code }` buffers
- `resolveSandboxWorkdir` ([src/agents/bash-tools.shared.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.shared.ts)) maps the agent's requested `workdir` to the container's mounted path
- `buildSandboxEnv` ([src/agents/bash-tools.shared.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.shared.ts)) builds a clean container environment using `DEFAULT_PATH` rather than the host `PATH`, and applies `sandboxEnv` overrides from config

Sources: [src/agents/sandbox/docker.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/docker.ts)[src/agents/bash-tools.exec.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts)[src/agents/bash-tools.shared.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.shared.ts)[src/agents/sandbox-create-args.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox-create-args.test.ts)

---

## Exec Tool Integration

The `createExecTool` function in [src/agents/bash-tools.exec.ts151-595](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L151-L595) resolves the execution host and either routes to the sandbox container or to the gateway/node host.

**Diagram: exec host resolution inside `createExecTool`**

```

```

The relevant decision logic is at [src/agents/bash-tools.exec.ts307-347](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L307-L347) Key behaviors:

- `tools.exec.host` defaults to `"sandbox"` if not explicitly configured
- When `host === "sandbox"` but no sandbox runtime exists for the session, the tool throws with a message directing the user to enable sandbox mode or change `tools.exec.host` to `"gateway"`
- Elevated commands always route to `host = "gateway"` regardless of configured host, because elevated execution intentionally bypasses the sandbox
- In sandbox mode, `env.PATH` overrides are not blocked (unlike gateway/node host execution where `validateHostEnv` in [src/agents/bash-tools.exec-runtime.ts51-70](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec-runtime.ts#L51-L70) blocks `PATH` and dangerous env vars)

Sources: [src/agents/bash-tools.exec.ts151-595](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec.ts#L151-L595)[src/agents/bash-tools.exec-runtime.ts34-70](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/bash-tools.exec-runtime.ts#L34-L70)

---

## Browser Sandbox

When `agents.defaults.sandbox.browser.enabled` is `true`, a separate browser Docker container runs alongside the agent sandbox. It provides an isolated Chromium instance for web browsing and automation, accessible via noVNC and the CDP.

### Key components
ComponentLocationRole`resolveSandboxBrowserDockerCreateConfig`[src/agents/sandbox/browser.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/browser.ts)Builds the browser container's Docker config`computeSandboxBrowserConfigHash`[src/agents/sandbox/browser.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/browser.ts)Generates a config hash stored as a Docker label for stale-container detection`SANDBOX_BROWSER_SECURITY_HASH_EPOCH`[src/agents/sandbox/constants.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/constants.ts)Epoch string; changing it invalidates pre-existing browser containers`DEFAULT_SANDBOX_BROWSER_IMAGE`[src/agents/sandbox/constants.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/constants.ts)Default Chromium/noVNC image reference`SANDBOX_AGENT_WORKSPACE_MOUNT`[src/agents/sandbox/constants.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/constants.ts)Mount path for the agent workspace inside the browser container`generateNoVncPassword` / `issueNoVncObserverToken`[src/agents/sandbox/novnc-auth.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/novnc-auth.ts)noVNC password and observer token generation`startBrowserBridgeServer`[src/browser/bridge-server.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/browser/bridge-server.ts)Starts the CDP bridge between the agent and the browser container
### Browser network modes

`agents.defaults.sandbox.browser.network` controls how the browser container connects:
ValueBehaviorAudit finding*(unset, default)*Dedicated Docker network per sandbox instanceNone`"bridge"` without `cdpSourceRange`Shared bridge network without IP restriction`sandbox.browser_cdp_bridge_unrestricted` (warn)
`cdpSourceRange` restricts which source IPs can reach the Chrome DevTools Protocol port on the container.

### Security labels

Each browser container is labeled with a config hash computed by `computeSandboxBrowserConfigHash` and the current value of `SANDBOX_BROWSER_SECURITY_HASH_EPOCH`. The security audit uses `execDockerRaw` ([src/agents/sandbox/docker.ts29-100](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/docker.ts#L29-L100)) to run `docker ps` and `docker inspect` against running containers, checking these labels to detect stale or migrated containers.

Sources: [src/agents/sandbox/browser.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/browser.ts)[src/agents/sandbox/constants.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/agents/sandbox/constants.ts)[src/security/audit.test.ts618-695](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L618-L695)

---

## Security Audit Findings

`collectSandboxDangerousConfigFindings` and `collectSandboxDockerNoopFindings` in [src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts) and `collectSandboxBrowserHashLabelFindings` in [src/security/audit-extra.async.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.async.ts) produce the following findings:
`checkId`SeverityTrigger`sandbox.dangerous_bind_mount`critical`docker.binds` contains a path blocked by `getBlockedBindReason``sandbox.dangerous_network_mode`critical`docker.network` is `"host"` or `"container:*"``sandbox.dangerous_seccomp_profile`critical`docker.seccompProfile` is `"unconfined"``sandbox.dangerous_apparmor_profile`critical`docker.apparmorProfile` is `"unconfined"``sandbox.docker_config_mode_off`warn`docker` config present but `mode` is `"off"` on all agents`sandbox.browser_container.hash_label_missing`warnRunning browser container has no config hash label`sandbox.browser_container.hash_epoch_stale`warnRunning browser container has an outdated `SANDBOX_BROWSER_SECURITY_HASH_EPOCH``sandbox.browser_container.non_loopback_publish`criticalBrowser container publishes ports to a non-loopback address`sandbox.browser_cdp_bridge_unrestricted`warnBrowser uses Docker `bridge` network without `cdpSourceRange``tools.exec.host_sandbox_no_sandbox_defaults`warn`tools.exec.host="sandbox"` but `agents.defaults.sandbox.mode="off"``tools.exec.host_sandbox_no_sandbox_agents`warnPer-agent `exec.host="sandbox"` but that agent's `sandbox.mode="off"`
The `sandbox.docker_config_mode_off` finding is suppressed if any entry in `agents.list` overrides `sandbox.mode` to a non-`off` value. The `sandbox.browser_container.*` findings are skipped entirely if `docker` is not available on the host (`execDockerRaw` throws `ENOENT`).

Sources: [src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.sync.ts)[src/security/audit-extra.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit-extra.ts)[src/security/audit.test.ts304-365](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L304-L365)[src/security/audit.test.ts618-746](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L618-L746)[src/security/audit.test.ts822-904](https://github.com/openclaw/openclaw/blob/8090cb4c/src/security/audit.test.ts#L822-L904)

---

# Development-Guide

# Development Guide
Relevant source files
- [.github/ISSUE_TEMPLATE/config.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/ISSUE_TEMPLATE/config.yml)
- [.github/actions/setup-node-env/action.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-node-env/action.yml)
- [.github/actions/setup-pnpm-store-cache/action.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-pnpm-store-cache/action.yml)
- [.github/labeler.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/labeler.yml)
- [.github/workflows/auto-response.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/auto-response.yml)
- [.github/workflows/ci.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml)
- [.github/workflows/docker-release.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml)
- [.github/workflows/install-smoke.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/install-smoke.yml)
- [.github/workflows/labeler.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/labeler.yml)
- [.github/workflows/sandbox-common-smoke.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/sandbox-common-smoke.yml)
- [.github/workflows/stale.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/stale.yml)
- [.github/workflows/workflow-sanity.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/workflow-sanity.yml)
- [AGENTS.md](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md)
- [docs/channels/irc.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/irc.md)
- [docs/ci.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/ci.md)
- [docs/reference/RELEASING.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md)
- [docs/tools/creating-skills.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/creating-skills.md)
- [docs/zh-CN/vps.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/zh-CN/vps.md)
- [extensions/msteams/src/graph-upload.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/graph-upload.ts)
- [scripts/check-composite-action-input-interpolation.py](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/check-composite-action-input-interpolation.py)
- [scripts/docker/install-sh-nonroot/run.sh](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/docker/install-sh-nonroot/run.sh)
- [scripts/docker/install-sh-smoke/run.sh](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/docker/install-sh-smoke/run.sh)
- [scripts/sync-labels.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/sync-labels.ts)
- [scripts/test-install-sh-docker.sh](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/test-install-sh-docker.sh)
- [src/infra/outbound/abort.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/abort.ts)
- [src/plugins/source-display.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/source-display.test.ts)
- [src/plugins/source-display.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/source-display.ts)

This page covers the contributor and maintainer workflow for the OpenClaw monorepo: repository structure, toolchain setup, coding conventions, testing, commit and PR conventions, and local development commands. For CI/CD pipeline details see page [8.1](/openclaw/openclaw/8.1-cicd-pipeline). For release steps see page [8.2](/openclaw/openclaw/8.2-releasing).

---

## Repository Structure

OpenClaw uses **pnpm workspaces** to organize a TypeScript-first monorepo. The table below maps the top-level directories to their roles.
DirectoryRole`src/`Core Gateway, CLI, agents, channels, infra`src/cli/`CLI command wiring`src/commands/`Individual CLI commands`src/gateway/`GatewayServer, protocol, server methods`src/agents/`Agent runtime, tools, sandbox`src/telegram/`, `src/discord/`, `src/slack/`, etc.Built-in channel integrations`src/infra/`Shared infrastructure utilities`src/media/`Media pipeline`extensions/`Extension/plugin workspace packages`apps/ios/`iOS Clawdis app (Swift)`apps/macos/`macOS Clawdis app (Swift)`apps/android/`Android Clawdis app (Kotlin/Gradle)`apps/shared/`Shared native code (Swift packages)`ui/`Control UI (LitElement SPA)`packages/`Shared TypeScript packages`skills/`Python skill scripts`scripts/`Build, release, and utility scripts`docs/`Mintlify documentation source`dist/`Built output (generated, not committed)`.github/`CI workflows, actions, issue/PR templates
The repository structure, as described in `AGENTS.md`, keeps plugin-only dependencies in the extension's own `package.json`. Core `package.json` dependencies should only include things the core uses directly.

**Monorepo structure diagram:**

```
openclaw (repo root)

src/
(TypeScript core)

extensions/
(workspace plugin packages)

apps/
(native clients)

ui/
(Control UI SPA)

packages/
(shared TS packages)

skills/
(Python skill scripts)

scripts/
(build & release scripts)

docs/
(Mintlify docs source)

dist/
(build output, generated)

src/cli/
(CLI wiring)

src/commands/
(CLI commands)

src/gateway/
(GatewayServer, protocol)

src/agents/
(agent runtime, tools)

src/telegram/, src/discord/, ...
(built-in channels)

src/infra/
(shared utilities)

apps/ios/
(Clawdis iOS)

apps/macos/
(Clawdis macOS)

apps/android/
(Clawdis Android)

apps/shared/
(shared native)
```

Sources: [AGENTS.md10-22](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L10-L22)

---

## Toolchain & Prerequisites
ToolMinimum VersionNotesNode.js22+Required runtime baselinepnpm10.23.0Primary package manager; use lockfileBun1.3.9+Preferred for TypeScript execution and testsPython3.12Used for skill scripts (`skills/`) and CI tooling
Both Node and Bun paths must stay functional. `pnpm-lock.yaml` and Bun patching must be kept in sync when touching deps.

Sources: [AGENTS.md57-64](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L57-L64)

---

## Local Development Commands

These are the primary commands used during development. All commands run from the repo root.
CommandPurpose`pnpm install`Install all dependencies (uses lockfile)`pnpm openclaw ...`Run CLI in dev mode (via Bun)`pnpm dev`Alias for dev CLI run`pnpm build`Type-check and build `dist/``pnpm tsgo`TypeScript checks only`pnpm check`Types + lint + format (Oxlint + Oxfmt)`pnpm format`Check formatting only (oxfmt --check)`pnpm format:fix`Fix formatting in place (oxfmt --write)`pnpm test`Run all tests (Vitest)`pnpm test:coverage`Tests with V8 coverage report`pnpm release:check`Validate npm pack contents`prek install`Install pre-commit hooks (same checks as CI)
The `pnpm check` command must pass before commits. It runs the same type/lint/format checks as the CI `check` job.

**Key dev scripts:**

- Mac packaging: `scripts/package-mac-app.sh` (defaults to current arch)
- Commit helper: `scripts/committer "<msg>" <file...>` (scopes staging correctly)
- Release validation: `node --import tsx scripts/release-check.ts`

Sources: [AGENTS.md55-71](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L55-L71)[docs/reference/RELEASING.md44-56](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md#L44-L56)

---

## Coding Conventions

### Language & Tooling

- **TypeScript (ESM)** throughout. Strict typing; avoid `any`.
- Formatting and linting via **Oxlint** and **Oxfmt**. Run `pnpm check` before commits.
- Never add `@ts-nocheck`. Never disable `no-explicit-any`. Fix root causes.

### Class & Composition Rules

- Do **not** share behavior via prototype mutation (`applyPrototypeMixins`, `Object.defineProperty` on `.prototype`). Use explicit inheritance or helper composition so TypeScript can typecheck.
- In tests, prefer per-instance stubs over `SomeClass.prototype.method = ...` unless prototype-level patching is explicitly documented.

### File Size & Structure

- Aim to keep files under ~700 LOC (guideline, not a hard limit). Split or refactor when it improves clarity or testability.
- Extract helpers rather than creating "V2" copies of files.
- Use existing patterns for CLI options and dependency injection via `createDefaultDeps`.

### Naming Conventions

- **OpenClaw** (capitalized) for product/app/docs headings.
- `openclaw` (lowercase) for the CLI command, package/binary, paths, and config keys.

### Comments

Add brief comments for tricky or non-obvious logic. Keep comments focused on the *why*, not the *what*.

### UI and Progress Output

- CLI progress: use `src/cli/progress.ts` (`osc-progress` + `@clack/prompts` spinner). Do not hand-roll spinners or bars.
- Status output: use `src/terminal/table.ts` for tables with ANSI-safe wrapping.
- Color palette: use `src/terminal/palette.ts` (no hardcoded colors).

### Plugin/Extension Dependencies

- Keep plugin-only deps in the extension `package.json`. Do not add them to root `package.json` unless core uses them.
- `workspace:*` in `dependencies` breaks `npm install`. Use `devDependencies` or `peerDependencies` instead. The runtime resolves `openclaw/plugin-sdk` via a jiti alias.
- Plugin runtime deps must be in `dependencies`, not `devDependencies`.

Sources: [AGENTS.md73-84](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L73-L84)[AGENTS.md14-18](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L14-L18)

---

## Testing Guidelines

### Framework

- **Vitest** with V8 coverage thresholds: 70% lines, branches, functions, and statements.
- Test files are colocated with source: `*.test.ts` next to the source file.
- End-to-end tests: `*.e2e.test.ts`.

### Running Tests

```
# Standard test run
pnpm test
 
# With coverage
pnpm test:coverage
 
# Low-memory profile (for constrained hosts)
OPENCLAW_TEST_PROFILE=low OPENCLAW_TEST_SERIAL_GATEWAY=1 pnpm test
 
# Unit tests only via Bun
bunx vitest run --config vitest.unit.config.ts
 
# Live tests (requires real API keys)
CLAWDBOT_LIVE_TEST=1 pnpm test:live
LIVE=1 pnpm test:live  # includes provider live tests
 
# Docker-based live tests
pnpm test:docker:live-models
pnpm test:docker:live-gateway
 
# Onboarding E2E
pnpm test:docker:onboard
```

Do not set test workers above 16. The CI sets `OPENCLAW_TEST_WORKERS=2` on Linux runners to prevent V8 OOM.

### Changelog and Test Additions

Pure test additions or fixes generally do **not** need a changelog entry unless they alter user-facing behavior or the operator asks for one.

Sources: [AGENTS.md94-104](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L94-L104)[.github/workflows/ci.yml186-241](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L186-L241)

---

## Commit & Pull Request Guidelines

### Committing

Use `scripts/committer "<msg>" <file...>` to create commits. This keeps staging scoped to the intended files and avoids accidental inclusion of unrelated changes.

Do not use manual `git add` / `git commit` outside the helper.

### Commit Message Format

- Concise, action-oriented: `CLI: add verbose flag to send`
- Group related changes; do not bundle unrelated refactors.
- Prefix with the subsystem affected: `CLI:`, `Gateway:`, `Telegram:`, `Android:`, etc.

### Pull Requests

The canonical PR template is at `.github/pull_request_template.md`. The full maintainer PR workflow (triage order, quality bar, rebase rules, changelog conventions) is at `.agents/skills/PR_WORKFLOW.md`.

For PR submission, follow the `review-pr` → `prepare-pr` → `merge-pr` pipeline described in that skill.

**PR size labels** are applied automatically based on changed line count (excluding lockfiles and docs):
Lines changedLabel< 50`size: XS`50–199`size: S`200–499`size: M`500–999`size: L`1000+`size: XL`
Contributor labels are also applied automatically: `trusted-contributor` (≥4 merged PRs), `experienced-contributor` (≥10 merged PRs), `maintainer` (team member).

Sources: [AGENTS.md106-114](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L106-L114)[.github/workflows/labeler.yml39-127](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/labeler.yml#L39-L127)

---

## Multi-Agent Safety Rules

When multiple agents work the same repository simultaneously:

- Do **not** create, apply, or drop `git stash` entries unless explicitly requested (this includes `git pull --rebase --autostash`).
- Do **not** create, remove, or modify `git worktree` checkouts.
- Do **not** switch branches unless explicitly requested.
- When told "push", you may `git pull --rebase` to integrate latest changes; never discard other agents' work.
- When told "commit", scope to your changes only. When told "commit all", commit in grouped chunks.
- Running multiple agents is fine as long as each has its own session.

Sources: [AGENTS.md187-198](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L187-L198)

---

## Adding Channels or Extensions

When adding a new channel, extension, or app:

1. Add it to `.github/labeler.yml` with a matching glob pattern.
2. Create the matching GitHub label (match the color of existing channel/extension labels).
3. Use `scripts/sync-labels.ts` to create missing labels from `labeler.yml`.
4. Update all UI surfaces and docs that enumerate providers (macOS app, web UI, mobile if applicable, onboarding docs).
5. Add matching status and configuration forms so provider lists stay in sync.

**Channel label color assignments** (from `scripts/sync-labels.ts`):
PrefixColor`channel:``1d76db``app:``6f42c1``extensions:``0e8a16``docs:``0075ca``cli:``f9d0c4``gateway:``d4c5f9``size:``fbca04`
Sources: [AGENTS.md22](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L22-L22)[.github/labeler.yml1-20](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/labeler.yml#L1-L20)[scripts/sync-labels.ts10-18](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/sync-labels.ts#L10-L18)

---

## Version Locations

When bumping a version, update **all** of the following locations (never update `appcast.xml` unless cutting a new macOS Sparkle release):
FileField`package.json``version``apps/android/app/build.gradle.kts``versionName`, `versionCode``apps/ios/Sources/Info.plist``CFBundleShortVersionString`, `CFBundleVersion``apps/ios/Tests/Info.plist``CFBundleShortVersionString`, `CFBundleVersion``apps/macos/Sources/OpenClaw/Resources/Info.plist``CFBundleShortVersionString`, `CFBundleVersion``docs/install/updating.md`Pinned npm version
Sources: [AGENTS.md179-180](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L179-L180)

---

## Release Channels
ChannelTag Formatnpm dist-tagNotes`stable``vYYYY.M.D``latest`Tagged releases only`beta``vYYYY.M.D-beta.N``beta`May ship without macOS app`dev`(none)—Moving HEAD on `main`
For beta releases: publish npm with a matching beta version suffix (e.g., `YYYY.M.D-beta.N`), not just `--tag beta` with a plain version number.

Sources: [AGENTS.md87-91](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L87-L91)

---

## Development Workflow Diagram

This diagram maps the standard contributor workflow to the concrete commands and files involved.

```
Start: checkout branch

pnpm install
(reads pnpm-lock.yaml)

Edit source in src/, extensions/, apps/, ui/

pnpm check
(Oxlint + Oxfmt + tsc via pnpm tsgo)

pnpm test
(Vitest, vitest.unit.config.ts)

pnpm build
(generates dist/)

scripts/committer msg file...
(scoped git commit)

git push

CI: .github/workflows/ci.yml

.github/pull_request_template.md
```

Sources: [AGENTS.md55-115](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L55-L115)[.github/workflows/ci.yml1-30](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L1-L30)

---

## Code Entity Map

This diagram maps the major development toolchain touchpoints to the concrete files and scripts that implement them.

```
Progress & Tables

src/cli/progress.ts
(osc-progress + @clack/prompts)

src/terminal/table.ts
(ANSI-safe tables)

src/terminal/palette.ts
(shared color palette)

Commit & Release

scripts/committer
(scoped git commit)

scripts/release-check.ts
(pnpm release:check)

prek install
(pre-commit hooks)

Build Pipeline

pnpm build

tsdown.config.ts

dist/
(built output)

Test Pipeline

pnpm test

scripts/test-parallel.mjs

vitest*.ts
(vitest configs)

Check Pipeline

pnpm check

.oxlintrc.json
(Oxlint rules)

.oxfmtrc.jsonc
(Oxfmt rules)

pnpm tsgo
(TypeScript checks)

tsconfig*.json

CLI & Dev

pnpm openclaw
(dev CLI via Bun)

openclaw.mjs
(CLI entrypoint)

pnpm dev
```

Sources: [AGENTS.md55-84](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L55-L84)[AGENTS.md172-173](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L172-L173)[.github/workflows/ci.yml127-150](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L127-L150)

---

## Shorthand Commands
ShorthandBehavior`sync`If working tree dirty, commit all changes with a Conventional Commit message, then `git pull --rebase`. If rebase conflicts cannot be resolved, stop. Otherwise `git push`.
### Git Notes

- If `git branch -d/-D <branch>` is policy-blocked, delete the local ref directly:`git update-ref -d refs/heads/<branch>`
- Bulk PR close/reopen safety: if a close action would affect more than 5 PRs, ask for explicit confirmation with the exact count and target scope before proceeding.

Sources: [AGENTS.md117-123](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L117-L123)

---

## Documentation Guidelines

Docs live in `docs/` and are hosted on Mintlify at `docs.openclaw.ai`.

- Internal doc links: root-relative, no `.md`/`.mdx` extension. Example: `<FileRef file-url="https://github.com/openclaw/openclaw/blob/8090cb4c/Config" undefined  file-path="Config">Hii</FileRef>`
- Anchors: root-relative path with anchor. Example: `<FileRef file-url="https://github.com/openclaw/openclaw/blob/8090cb4c/Hooks" undefined  file-path="Hooks">Hii</FileRef>`
- Avoid em dashes (`—`) and apostrophes in headings — they break Mintlify anchor links.
- README (GitHub): use absolute `https://docs.openclaw.ai/...` URLs so links work on GitHub.
- Content must be generic: no personal device names, hostnames, or paths. Use placeholders like `user@gateway-host`.
- `docs/zh-CN/**` is auto-generated. Do not edit unless explicitly asked.

Sources: [AGENTS.md24-43](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L24-L43)

---

## Secret Scanning & Security

- Secrets are scanned on every CI run using `detect-secrets` against `.secrets.baseline`.
- Private keys are detected by `pre-commit run --all-files detect-private-key`.
- Changed GitHub workflows are audited with `zizmor`.
- Production dependencies are audited with `pnpm-audit-prod`.
- Never commit real phone numbers, videos, or live config values. Use obviously fake placeholders in docs, tests, and examples.

For the full security model and audit tooling, see page [7](/openclaw/openclaw/7-security) and page [7.1](/openclaw/openclaw/7.1-security-audit).

Sources: [.github/workflows/ci.yml349-401](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L349-L401)[AGENTS.md134-140](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L134-L140)

---

# CI-CD-Pipeline

# CI/CD Pipeline
Relevant source files
- [.github/ISSUE_TEMPLATE/config.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/ISSUE_TEMPLATE/config.yml)
- [.github/actions/setup-node-env/action.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-node-env/action.yml)
- [.github/actions/setup-pnpm-store-cache/action.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-pnpm-store-cache/action.yml)
- [.github/labeler.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/labeler.yml)
- [.github/workflows/auto-response.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/auto-response.yml)
- [.github/workflows/ci.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml)
- [.github/workflows/docker-release.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml)
- [.github/workflows/install-smoke.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/install-smoke.yml)
- [.github/workflows/labeler.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/labeler.yml)
- [.github/workflows/sandbox-common-smoke.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/sandbox-common-smoke.yml)
- [.github/workflows/stale.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/stale.yml)
- [.github/workflows/workflow-sanity.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/workflow-sanity.yml)
- [AGENTS.md](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md)
- [docs/channels/irc.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/irc.md)
- [docs/ci.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/ci.md)
- [docs/reference/RELEASING.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md)
- [docs/tools/creating-skills.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/creating-skills.md)
- [docs/zh-CN/vps.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/zh-CN/vps.md)
- [extensions/msteams/src/graph-upload.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/graph-upload.ts)
- [scripts/check-composite-action-input-interpolation.py](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/check-composite-action-input-interpolation.py)
- [scripts/docker/install-sh-nonroot/run.sh](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/docker/install-sh-nonroot/run.sh)
- [scripts/docker/install-sh-smoke/run.sh](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/docker/install-sh-smoke/run.sh)
- [scripts/sync-labels.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/sync-labels.ts)
- [scripts/test-install-sh-docker.sh](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/test-install-sh-docker.sh)
- [src/infra/outbound/abort.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/abort.ts)
- [src/plugins/source-display.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/source-display.test.ts)
- [src/plugins/source-display.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/source-display.ts)

This page documents the GitHub Actions workflows that validate every push and pull request in the OpenClaw repository, the Docker multi-arch release automation, and the supporting workflows that manage issues, labels, and repo hygiene.

For information about the npm and macOS app release process (tagging, publishing, appcast), see the [Releasing](/openclaw/openclaw/8.2-releasing) page. For the contributor workflow conventions (commit messages, PR templates, changelog rules) that feed into CI, see the [Development Guide](/openclaw/openclaw/8-development-guide).

---

## Workflow File Overview

All workflows live under `.github/workflows/`. The table below lists every workflow and its trigger.
FileTriggerPurpose`ci.yml`push `main`, all PRsPrimary validation pipeline`docker-release.yml`push `main`, tags `v*`Multi-arch Docker image build and publish`install-smoke.yml`push `main`, all PRsInstaller one-liner smoke tests in Docker`workflow-sanity.yml`push `main`, all PRsLint and validate workflow files themselves`stale.yml`daily cronMark and close stale issues and PRs`auto-response.yml`issues, PRs, commentsAuto-close/respond via `r:` label rules`labeler.yml`PRs, issuesApply area and size labels
Sources: [.github/workflows/ci.yml1-10](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L1-L10)[.github/workflows/docker-release.yml1-18](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml#L1-L18)[.github/workflows/install-smoke.yml1-12](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/install-smoke.yml#L1-L12)[.github/workflows/workflow-sanity.yml1-12](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/workflow-sanity.yml#L1-L12)[.github/workflows/stale.yml1-10](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/stale.yml#L1-L10)[.github/workflows/auto-response.yml1-12](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/auto-response.yml#L1-L12)[.github/workflows/labeler.yml1-10](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/labeler.yml#L1-L10)

---

## Main CI Pipeline

The primary workflow is defined in [.github/workflows/ci.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml) It runs on every push to `main` and every pull request. For pull requests, in-progress runs are cancelled when a new commit is pushed (`cancel-in-progress: true`).

[.github/workflows/ci.yml8-10](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L8-L10)

### Scope Detection

Before running expensive jobs, two "scope detection" jobs determine exactly which parts of the codebase changed. This allows PR CI to skip entire job groups that are irrelevant to the change.

**`docs-scope`** — runs first, always. Uses the composite action `.github/actions/detect-docs-changes`. Produces two outputs:

- `docs_only` — `true` if every changed file is under `docs/`, `*.md`, or `*.mdx`. Skips all heavy jobs.
- `docs_changed` — `true` if any docs files changed (triggers `check-docs`).

**`changed-scope`** — runs after `docs-scope` when `docs_only != 'true'`. Inspects `git diff` against the base SHA and produces three boolean outputs:
OutputTriggered by changed paths`run_node``src/`, `test/`, `extensions/`, `packages/`, `scripts/`, `ui/`, `.github/`, `package.json`, `pnpm-lock.yaml`, config files`run_macos``apps/macos/`, `apps/ios/`, `apps/shared/`, `Swabble/` (excludes generated protocol models)`run_android``apps/android/`, `apps/shared/`
If scope detection itself fails (e.g., the git diff is unavailable), the job applies the fail-safe of setting all three outputs to `true`.

[.github/workflows/ci.yml13-125](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L13-L125)

**Scope detection logic diagram:**

```
docs_only=true

docs_only=false

src/** changed

apps/macos/** changed

apps/android/** changed

docs_only=false

Push / PR event

docs-scope
(.github/actions/detect-docs-changes)

docs_only=true
Skip all heavy jobs

changed-scope
(git diff --name-only)

run_node=true
Node.js jobs enabled

run_macos=true
macOS job enabled

run_android=true
Android job enabled

check
(types+lint+format)
Always on non-docs
```

Sources: [.github/workflows/ci.yml13-125](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L13-L125)

---

### Job Reference

**Job dependency and conditional diagram:**

```
docs-scope

changed-scope

check
(types+lint+oxfmt)

check-docs
(docs lint)

build-artifacts
(pnpm build)

release-check
(pnpm release:check)

checks
(node/bun tests
protocol:check)

checks-windows
(lint+test+protocol)

macos
(TS+Swift)

android
(Gradle)

skills-python
(ruff+pytest)

secrets
(detect-secrets
zizmor
pnpm-audit)

deadcode
(disabled)
```

Sources: [.github/workflows/ci.yml127-821](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L127-L821)

The full set of jobs with their conditions:
JobRunnerCondition`docs-scope``blacksmith-16vcpu-ubuntu-2404`Always`changed-scope``blacksmith-16vcpu-ubuntu-2404``docs_only != 'true'``check``blacksmith-16vcpu-ubuntu-2404``docs_only != 'true'``check-docs``blacksmith-16vcpu-ubuntu-2404``docs_changed == 'true'``build-artifacts``blacksmith-16vcpu-ubuntu-2404``docs_only != 'true'` AND (`push` OR `run_node == 'true'`)`release-check``blacksmith-16vcpu-ubuntu-2404``push` to main AND `docs_only != 'true'``checks``blacksmith-16vcpu-ubuntu-2404``docs_only != 'true'` AND (`push` OR `run_node == 'true'`)`checks-windows``blacksmith-16vcpu-windows-2025`Same as `checks``macos``macos-latest`PR only AND `docs_only != 'true'` AND `run_macos == 'true'``ios``macos-latest`**Disabled** (`if: false`)`android``blacksmith-16vcpu-ubuntu-2404``docs_only != 'true'` AND (`push` OR `run_android == 'true'`)`skills-python``blacksmith-16vcpu-ubuntu-2404``docs_only != 'true'` AND (`push` OR `run_node == 'true'`)`secrets``blacksmith-16vcpu-ubuntu-2404`Always`deadcode``blacksmith-16vcpu-ubuntu-2404`**Disabled** (`if: false`)
Sources: [.github/workflows/ci.yml127-821](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L127-L821)

---

### `check` — Types, Lint, Format

Runs `pnpm check`, which runs TypeScript type-checking (`pnpm tsgo`), Oxlint linting, and Oxfmt format checking in one command. Also runs `pnpm lint:ui:no-raw-window-open` as a separate step to enforce the safe external URL opening policy.

This job **does not** depend on `build-artifacts` — it is intentionally fast and runs in parallel with the build.

[.github/workflows/ci.yml242-263](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L242-L263)

---

### `build-artifacts` — Shared Build

Runs `pnpm build`, then uploads the `dist/` directory as the `dist-build` artifact (retained for 1 day). Downstream jobs (`checks`, `checks-windows`, `release-check`) download this artifact rather than rebuilding.

[.github/workflows/ci.yml126-150](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L126-L150)

---

### `checks` — Test Matrix (Linux)

A matrix job with three variants:
`runtime``task`Command`node``test``pnpm canvas:a2ui:bundle && pnpm test``node``protocol``pnpm protocol:check``bun``test``pnpm canvas:a2ui:bundle && bunx vitest run --config vitest.unit.config.ts`
The `bun` lane is skipped on push-to-main events (only runs on PRs). The `node` test lane sets `OPENCLAW_TEST_WORKERS=2` and `OPENCLAW_TEST_MAX_OLD_SPACE_SIZE_MB=6144` to prevent OOM on the 16 vCPU Linux runner.

Test results are collected as JSON via `OPENCLAW_VITEST_REPORT_DIR` and uploaded as artifacts. Slowest tests are summarized via `scripts/vitest-slowest.mjs`.

[.github/workflows/ci.yml177-241](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L177-L241)

---

### `checks-windows` — Test Matrix (Windows)

Runs a separate matrix on `blacksmith-16vcpu-windows-2025` using `bash` shell. Includes sharding for the test task:
`task`ShardsCommand`lint`1`pnpm lint``test`2 (shard 1)`pnpm canvas:a2ui:bundle && pnpm test``test`2 (shard 2)`pnpm canvas:a2ui:bundle && pnpm test``protocol`1`pnpm protocol:check`
Sharding is controlled by `OPENCLAW_TEST_SHARDS` and `OPENCLAW_TEST_SHARD_INDEX` environment variables, read by `scripts/test-parallel.mjs`. The lint lane downloads the `dist-build` artifact instead of rebuilding.

Windows Defender exclusions are applied best-effort to reduce interference with vitest worker process spawning.

[.github/workflows/ci.yml403-536](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L403-L536)

---

### `macos` — Consolidated macOS Job

Runs on `macos-latest`, PR-only, only when macOS-relevant files changed. Runs all checks sequentially to stay within GitHub's 5 concurrent macOS jobs per org limit:

1. `pnpm test` (TypeScript tests, Node)
2. SwiftLint (`swiftlint --config .swiftlint.yml`)
3. SwiftFormat lint (`swiftformat --lint apps/macos/Sources`)
4. `swift build --package-path apps/macos --configuration release` (3 retries)
5. `swift test --package-path apps/macos --parallel --enable-code-coverage` (3 retries)

Uses Xcode 26.1 and installs `xcodegen`, `swiftlint`, `swiftformat` via Homebrew. SwiftPM packages are cached by `apps/macos/Package.resolved` hash.

[.github/workflows/ci.yml538-613](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L538-L613)

---

### `android` — Gradle Build and Tests

Matrix with two tasks, run in `apps/android/`:
`task`Command`test``./gradlew --no-daemon :app:testDebugUnitTest``build``./gradlew --no-daemon :app:assembleDebug`
Uses Java 17 (Temurin), Android SDK with platform 36 and build-tools 36.0.0, and Gradle 8.11.1 via `gradle/actions/setup-gradle`.

[.github/workflows/ci.yml775-821](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L775-L821)

---

### `skills-python` — Python Skill Scripts

Installs Python 3.12, `pytest`, `ruff`, and `pyyaml`, then:

1. `python -m ruff check skills` — lint all Python in `skills/`
2. `python -m pytest -q skills` — run all skill tests

[.github/workflows/ci.yml323-348](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L323-L348)

---

### `secrets` — Secret Scanning

Runs unconditionally on every push and PR. Performs four checks:

1. **`detect-secrets scan --baseline .secrets.baseline`** — scans for secrets against a known baseline; failure points to `docs/gateway/security.md#secret-scanning-detect-secrets`.
2. **`pre-commit run --all-files detect-private-key`** — uses pre-commit to catch committed private keys.
3. **`pre-commit run zizmor`** — audits any changed GitHub workflow files for security issues (skips if no workflow files changed).
4. **`pre-commit run --all-files pnpm-audit-prod`** — audits production npm dependencies.

[.github/workflows/ci.yml349-401](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L349-L401)

---

### `deadcode` — Dead Code Reports (Disabled)

Currently disabled (`if: false`). When enabled, runs three tools in a matrix:
ToolCommand`knip``pnpm deadcode:report:ci:knip``ts-prune``pnpm deadcode:report:ci:ts-prune``ts-unused-exports``pnpm deadcode:report:ci:ts-unused`
Results would be uploaded to `.artifacts/deadcode` as artifacts for manual triage. The comment in the workflow notes it is "temporarily disabled while we process initial findings."

[.github/workflows/ci.yml265-302](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L265-L302)

---

### `release-check` — npm Pack Validation

Runs only on push-to-main (not PRs). Downloads the `dist-build` artifact, then runs `pnpm release:check` to validate that the npm package contents are correct (correct `dist/*` directories included, no app bundles leaking in, etc.).

[.github/workflows/ci.yml152-176](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L152-L176)

---

## Composite Actions

Two reusable composite actions are defined under `.github/actions/`:

**`setup-node-env`** ([.github/actions/setup-node-env/action.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-node-env/action.yml)) — used by most Linux and macOS jobs. Performs:

1. Submodule sync + `git submodule update --init --force --depth=1 --recursive` (5 retries)
2. Node.js 22.x setup via `actions/setup-node`
3. pnpm setup via `setup-pnpm-store-cache` composite action
4. Optional Bun setup via `oven-sh/setup-bun` (Bun 1.3.9+cf6cdbbba)
5. `pnpm install --frozen-lockfile --ignore-scripts=false --config.enable-pre-post-scripts=true`

Accepts `install-bun` input to control whether Bun is installed. The `checks` job uses `install-bun: 'true'` only for the `bun` matrix row.

**`setup-pnpm-store-cache`** ([.github/actions/setup-pnpm-store-cache/action.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-pnpm-store-cache/action.yml)) — activates pnpm via corepack (with 3 retries) and restores the pnpm store cache keyed on `pnpm-lock.yaml` hash.

```
install-bun=true

setup-node-env
(composite action)

git submodule update
(5 retries)

actions/setup-node@v4
Node 22.x

setup-pnpm-store-cache
(composite action)

corepack prepare pnpm@10.23.0
(3 retries)

actions/cache
pnpm store keyed
by pnpm-lock.yaml hash

oven-sh/setup-bun
Bun 1.3.9
(optional)

pnpm install
--frozen-lockfile
```

Sources: [.github/actions/setup-node-env/action.yml1-99](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-node-env/action.yml#L1-L99)[.github/actions/setup-pnpm-store-cache/action.yml1-48](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-pnpm-store-cache/action.yml#L1-L48)

---

## Docker Release Pipeline

Defined in [.github/workflows/docker-release.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml) Triggers on push to `main` or any `v*` tag, with path exclusions for `docs/**`, `*.md`, `*.mdx`, `.agents/**`, and `skills/**`.

The pipeline publishes to the GitHub Container Registry (`ghcr.io`) under the repository image name.

### Tag Resolution
Git refamd64/arm64 tagsManifest tags`refs/heads/main``<image>:main-amd64`, `<image>:main-arm64``<image>:main``refs/tags/vX.Y.Z``<image>:X.Y.Z-amd64`, `<image>:X.Y.Z-arm64``<image>:X.Y.Z``refs/tags/vX.Y.Z` (stable)sameadditionally `<image>:latest`
Stable releases are identified by the regex `^[0-9]+\.[0-9]+\.[0-9]+(-[0-9]+)?$`. Beta tags (`vX.Y.Z-beta.N`) do not receive the `latest` tag.

**Docker release job diagram:**

```
image-digest output

image-digest output

push main
or v* tag

build-amd64
(blacksmith-16vcpu-ubuntu-2404)
docker/build-push-action
platforms: linux/amd64

build-arm64
(blacksmith-16vcpu-ubuntu-2404-arm)
docker/build-push-action
platforms: linux/arm64

create-manifest
docker buildx imagetools create
(amd64 digest + arm64 digest)

ghcr.io/openclaw/openclaw
:main / :X.Y.Z / :latest
```

Each architecture job uses a separate registry-based build cache (`type=registry,ref=...-cache:amd64` and `...-cache:arm64`) with `mode=max` to maximize layer reuse.

Sources: [.github/workflows/docker-release.yml1-201](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml#L1-L201)

---

## Install Smoke Tests

Defined in [.github/workflows/install-smoke.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/install-smoke.yml) Runs on every push to `main` and all PRs, skips when `docs_only == 'true'`.

The `install-smoke` job performs two Docker-based tests:

1. **Root installer smoke** — builds `scripts/docker/install-sh-smoke/Dockerfile`, then runs `scripts/docker/install-sh-smoke/run.sh`. This script:

- Resolves the latest npm version of `openclaw`
- Pre-installs the previous version (to exercise the upgrade path)
- Runs `curl -fsSL "$INSTALL_URL" | bash`
- Verifies the installed version matches the expected latest
2. **Non-root installer smoke** — builds `scripts/docker/install-sh-nonroot/Dockerfile` and verifies a non-root install. Skipped on PRs via `CLAWDBOT_INSTALL_SMOKE_SKIP_NONROOT=1`.
3. **CLI installer smoke** — runs the CLI installer script (`install-cli.sh`) via `curl | bash` in the non-root image.

Additionally, the job builds the root `Dockerfile` and verifies `openclaw --version` works inside it.

[.github/workflows/install-smoke.yml28-64](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/install-smoke.yml#L28-L64)[scripts/test-install-sh-docker.sh1-73](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/test-install-sh-docker.sh#L1-L73)[scripts/docker/install-sh-smoke/run.sh1-93](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/docker/install-sh-smoke/run.sh#L1-L93)

---

## Workflow Sanity Checks

Defined in [.github/workflows/workflow-sanity.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/workflow-sanity.yml) Runs on every push and PR. Two jobs:

**`no-tabs`** — a Python script that reads every `*.yml` and `*.yaml` under `.github/workflows/` and fails if any file contains a tab character (`\t`). YAML parsers allow tabs in some contexts but GitHub Actions rejects them.

**`actionlint`** — installs `actionlint` 1.7.11 (checksum-verified), runs `actionlint` against all workflow files. Also runs `scripts/check-composite-action-input-interpolation.py`, which scans composite action `run:` blocks for direct `${{ inputs.* }}` interpolation — a security pattern that GitHub recommends avoiding in favor of `env:` + shell variable references.

[.github/workflows/workflow-sanity.yml1-68](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/workflow-sanity.yml#L1-L68)[scripts/check-composite-action-input-interpolation.py1-81](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/check-composite-action-input-interpolation.py#L1-L81)

---

## Repository Automation Workflows

### Labeler

[.github/workflows/labeler.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/labeler.yml) — triggers on PR `opened/synchronize/reopened`, issue `opened`, and `workflow_dispatch`.

Three jobs:

1. **`label`** — uses `actions/labeler@v5` with `.github/labeler.yml` configuration to apply area labels based on changed files (e.g., `channel: telegram`, `app: android`, `gateway`). Then applies a **size label** based on changed lines (excluding docs and lockfiles):
Lines changedLabel< 50`size: XS`< 200`size: S`< 500`size: M`< 1000`size: L`≥ 1000`size: XL`
Also applies contributor classification labels: `maintainer`, `trusted-contributor` (≥ 4 merged PRs), or `experienced-contributor` (≥ 10 merged PRs).
2. **`backfill-pr-labels`** — `workflow_dispatch` only; retroactively applies size and contributor labels to all open PRs.
3. **`label-issues`** — applies maintainer/contributor labels to newly opened issues.

The `.github/labeler.yml` configuration maps glob patterns to label names for every channel, app, extension, and major subsystem. The `scripts/sync-labels.ts` utility creates missing labels in the GitHub repo based on the labeler config.

Sources: [.github/workflows/labeler.yml1-519](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/labeler.yml#L1-L519)[.github/labeler.yml1-259](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/labeler.yml#L1-L259)[scripts/sync-labels.ts1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/sync-labels.ts#L1-L100)

### Auto Response

[.github/workflows/auto-response.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/auto-response.yml) — handles `r:`-prefixed labels on issues and PRs. Defined rules:
LabelAction`r: skill`Close, redirect to Clawhub`r: support`Close, redirect to Discord`r: testflight`Close, "build from source"`r: third-party-extension`Close, redirect to plugin docs`r: moltbook`Close + lock (off-topic)
Also responds to comment triggers (`moltbook`, `testflight` keywords in comments) and warns when a non-maintainer mentions 3+ maintainers at once. PRs labeled `dirty` or with > 20 labels are closed automatically.

### Stale

[.github/workflows/stale.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/stale.yml) — runs daily at 03:17 UTC. Uses `actions/stale@v9`:

- Issues: stale after 7 days, closed after 5 more
- PRs: stale after 5 days, closed after 3 more
- Exempt labels: `enhancement`, `maintainer`, `pinned`, `security`, `no-stale`
- All assigned items are exempt

---

## Local Equivalents

The following commands reproduce what CI runs locally:

```
pnpm check          # check job: types (tsgo) + lint (oxlint) + format (oxfmt)
pnpm test           # checks job: vitest test suite (node runtime)
pnpm check:docs     # check-docs job: docs lint + broken link check
pnpm release:check  # release-check job: validate npm pack contents
pnpm lint           # checks-windows lint lane
pnpm protocol:check # checks protocol lane: verify generated protocol schema
```

Pre-commit hooks (`prek install`) run the same checks as CI before each commit.

Sources: [AGENTS.md56-71](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L56-L71)[docs/ci.md48-54](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/ci.md#L48-L54)

---

# Releasing

# Releasing
Relevant source files
- [.github/ISSUE_TEMPLATE/config.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/ISSUE_TEMPLATE/config.yml)
- [.github/actions/setup-node-env/action.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-node-env/action.yml)
- [.github/actions/setup-pnpm-store-cache/action.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/actions/setup-pnpm-store-cache/action.yml)
- [.github/labeler.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/labeler.yml)
- [.github/workflows/auto-response.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/auto-response.yml)
- [.github/workflows/ci.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml)
- [.github/workflows/docker-release.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml)
- [.github/workflows/install-smoke.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/install-smoke.yml)
- [.github/workflows/labeler.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/labeler.yml)
- [.github/workflows/sandbox-common-smoke.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/sandbox-common-smoke.yml)
- [.github/workflows/stale.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/stale.yml)
- [.github/workflows/workflow-sanity.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/workflow-sanity.yml)
- [AGENTS.md](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md)
- [docs/channels/irc.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/channels/irc.md)
- [docs/ci.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/ci.md)
- [docs/reference/RELEASING.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md)
- [docs/tools/creating-skills.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/tools/creating-skills.md)
- [docs/zh-CN/vps.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/zh-CN/vps.md)
- [extensions/msteams/src/graph-upload.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/extensions/msteams/src/graph-upload.ts)
- [scripts/check-composite-action-input-interpolation.py](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/check-composite-action-input-interpolation.py)
- [scripts/docker/install-sh-nonroot/run.sh](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/docker/install-sh-nonroot/run.sh)
- [scripts/docker/install-sh-smoke/run.sh](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/docker/install-sh-smoke/run.sh)
- [scripts/sync-labels.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/sync-labels.ts)
- [scripts/test-install-sh-docker.sh](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/test-install-sh-docker.sh)
- [src/infra/outbound/abort.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/infra/outbound/abort.ts)
- [src/plugins/source-display.test.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/source-display.test.ts)
- [src/plugins/source-display.ts](https://github.com/openclaw/openclaw/blob/8090cb4c/src/plugins/source-display.ts)

This page covers the release process for all OpenClaw artifacts: the `openclaw` npm package, the macOS desktop app (Sparkle distribution), Docker multi-arch images, and the `@openclaw/*` extension plugins. It also covers changelog conventions, the pre-release validation checklist, and GitHub repository automation (labels and stale management).

For the CI/CD pipeline that runs on every commit and validates code before a release is cut, see [8.1](https://github.com/openclaw/openclaw/blob/8090cb4c/8.1) For macOS-specific packaging steps (code signing, notarization), see `docs/platforms/mac/release.md`. The canonical step-by-step checklist lives at [docs/reference/RELEASING.md](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md)

---

## Release Channels

Three named channels are defined in [AGENTS.md86-92](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L86-L92):
ChannelTag formatnpm dist-tagNotes`stable``vYYYY.M.D``latest`Full release. Docker `:latest` tag is applied only for stable tags.`beta``vYYYY.M.D-beta.N``beta`Prerelease. May ship without macOS app.`dev`*(no tag)**(none)*Moving head on `main`. Docker `:main` image only.
The `APP_BUILD` number for the macOS Sparkle feed must be numeric and strictly monotonic — it must never include the `-beta` suffix, because Sparkle uses it for version comparison.

**Beta naming rule:** when publishing a beta npm version, the npm version string must include the suffix (e.g. `2026.2.15-beta.1`), not just a plain version on `--tag beta`. A plain version would consume the version name permanently.

---

## Version Locations

Bumping a release version requires updating every location below. Running `pnpm plugins:sync` aligns extension package versions and their changelogs, but the core locations must be updated manually.

**Release version bump diagram**

```
Version string
(e.g. 2026.5.1)

package.json
(root)

src/version.ts

src/web/session.ts
(Baileys user agent)

apps/ios/Sources/Info.plist
(CFBundleShortVersionString / CFBundleVersion)

apps/ios/Tests/Info.plist

apps/macos/Sources/OpenClaw/Resources/Info.plist
(CFBundleShortVersionString / CFBundleVersion)

apps/android/app/build.gradle.kts
(versionName / versionCode)

docs/install/updating.md
(pinned npm version)

docs/platforms/mac/release.md
(APP_VERSION / APP_BUILD examples)
```

Sources: [AGENTS.md179-180](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L179-L180)

`appcast.xml` is a special case — only touch it when cutting a new macOS Sparkle release. It is not part of a routine version bump.

---

## Pre-release Validation Checklist

Before tagging or publishing, all of the following must pass. These steps correspond to what CI runs on push to `main`, but must be verified locally on a clean working tree.
StepCommandPurposeType check + lint`pnpm check`Types, oxlint, oxfmtTests`pnpm test`Vitest unit suiteRelease pack check`pnpm release:check`Validates npm pack contents (dist dirs, no app bundle in tarball)Release script`node --import tsx scripts/release-check.ts`Supplemental release-time assertionsInstall smoke (fast)`OPENCLAW_INSTALL_SMOKE_SKIP_NONROOT=1 pnpm test:install:smoke`Docker install smoke, root path onlyInstall smoke (full)`pnpm test:install:smoke`Adds non-root + CLI install coverageE2E installer`pnpm test:install:e2e`Full `curl ... install.sh` onboard + real tool calls
The `release-check` CI job (in [.github/workflows/ci.yml152-176](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L152-L176)) runs `pnpm release:check` after every push to `main`, providing an automatic signal that the pack contents are valid.

Sources: [docs/reference/RELEASING.md44-56](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md#L44-L56)[AGENTS.md253-256](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L253-L256)[.github/workflows/ci.yml152-176](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/ci.yml#L152-L176)

---

## npm Package Release

**npm release flow**

```
Bump version in all locations
(package.json, src/version.ts, Info.plist, build.gradle.kts)

pnpm plugins:sync
(align extension package versions + changelogs)

pnpm run build
(regenerates dist/)

Update CHANGELOG.md

Run validation suite
(pnpm check, pnpm test,
pnpm release:check,
pnpm test:install:smoke)

npm publish --access public
(1Password OTP via op read)

Verify: npm view openclaw version
npx -y openclaw@X.Y.Z --version

git tag vX.Y.Z
git push origin vX.Y.Z

Create GitHub release
(title: openclaw X.Y.Z)
(body: full CHANGELOG section)

Attach artifacts
(OpenClaw-X.Y.Z.zip, .dSYM.zip, optional npm tarball)
```

Sources: [docs/reference/RELEASING.md22-92](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md#L22-L92)[AGENTS.md213-219](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L213-L219)

### npm Authentication

All `npm publish` and dist-tag operations must run inside a fresh tmux session. The 1Password CLI (`op`) is used to retrieve the OTP:

```
eval "$(op signin --account my.1password.com)"
op read 'op://Private/Npmjs/one-time password?attribute=otp'
npm publish --access public --otp="<otp>"
```

Kill the tmux session after publish. See [AGENTS.md213-220](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L213-L220) for the full authentication procedure.

### Common Pitfalls
ProblemCauseFixHuge tarball`dist/OpenClaw.app` swept into packWhitelist via `package.json``files`; confirm with `npm pack --dry-run`npm auth web loop for dist-tagsLegacy auth needed`NPM_CONFIG_AUTH_TYPE=legacy npm dist-tag add openclaw@X.Y.Z latest``npx` verify fails with `ECOMPROMISED`Cache issue`NPM_CONFIG_CACHE=/tmp/npm-cache-$(date +%s) npx -y openclaw@X.Y.Z --version`Tag needs repointingLate fix committed after tag`git tag -f vX.Y.Z && git push -f origin vX.Y.Z`
Sources: [docs/reference/RELEASING.md74-83](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md#L74-L83)

---

## macOS App Release (Sparkle)

The macOS app uses [Sparkle](https://sparkle-project.org/) for auto-update. The release flow for the app is separate from the npm release and is documented in full at `docs/platforms/mac/release.md`. Key constraints:

- Packaging is done via `scripts/package-mac-app.sh` (defaults to current arch for dev builds).
- Do **not** rebuild the macOS app over SSH; rebuilds must run directly on the Mac.
- The Sparkle appcast is generated by `scripts/make_appcast.sh` and written to `appcast.xml`. This file must be committed and pushed to `main` because Sparkle feeds from the main branch.
- `APP_BUILD` must be numeric and strictly monotonic. The `SPARKLE_PRIVATE_KEY_FILE` env var and App Store Connect API vars (`APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_API_KEY_P8`) must be set before running release commands.
- For beta GitHub prereleases: tag `vYYYY.M.D-beta.N`, create a prerelease with title `openclaw YYYY.M.D-beta.N`, attach at least `OpenClaw-YYYY.M.D.zip` and `OpenClaw-YYYY.M.D.dSYM.zip`.

Sources: [docs/reference/RELEASING.md58-65](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md#L58-L65)[AGENTS.md65-66](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L65-L66)[AGENTS.md185-186](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L185-L186)[AGENTS.md244-249](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L244-L249)

---

## Docker Multi-Arch Image Publishing

Docker images are built and published automatically by [.github/workflows/docker-release.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml) The workflow triggers on:

- Push to `main` (produces `:main` image)
- Any `v*` tag push (produces versioned and optionally `:latest` images)

Docs changes (`.md`, `.mdx`, `docs/**`, `.agents/**`, `skills/**`) are excluded via `paths-ignore`.

**Docker release workflow**

```
Push to main or v* tag
(.github/workflows/docker-release.yml)

build-amd64
runner: blacksmith-16vcpu-ubuntu-2404
platforms: linux/amd64
cache: ghcr.io/openclaw/openclaw-cache:amd64

build-arm64
runner: blacksmith-16vcpu-ubuntu-2404-arm
platforms: linux/arm64
cache: ghcr.io/openclaw/openclaw-cache:arm64

create-manifest
docker buildx imagetools create
(merges amd64 + arm64 digests)

refs/heads/main
→ ghcr.io/openclaw/openclaw:main

refs/tags/v*
→ ghcr.io/openclaw/openclaw:X.Y.Z

stable tag only
(no -beta, -N suffix)
→ ghcr.io/openclaw/openclaw:latest
```

Sources: [.github/workflows/docker-release.yml1-202](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml#L1-L202)

### Tag Resolution Logic

The `:latest` tag is only applied when the version tag matches the pattern `^[0-9]+\.[0-9]+\.[0-9]+(-[0-9]+)?$` — this deliberately excludes `-beta.N` prereleases. See [.github/workflows/docker-release.yml175-177](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml#L175-L177)

Each architecture is built on a native runner (`amd64` on standard Ubuntu, `arm64` on the `-arm` variant), then combined into a multi-platform manifest using `docker buildx imagetools create`. The per-arch images are tagged with `:X.Y.Z-amd64` and `:X.Y.Z-arm64` as intermediates before the manifest is assembled.

Registry: `ghcr.io` (GitHub Container Registry), image name `ghcr.io/openclaw/openclaw`.

Sources: [.github/workflows/docker-release.yml24-202](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/docker-release.yml#L24-L202)

---

## Plugin Publishing

Only plugins already present on npm under the `@openclaw/*` scope are published. Bundled extensions that are disk-tree only (in `extensions/**`) are not published to npm.

To derive the publish list:

1. Run `npm search @openclaw --json` to get currently-published packages.
2. Compare with `extensions/*/package.json` names.
3. Publish only the intersection.

**Current npm plugin list** (from [docs/reference/RELEASING.md106-119](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md#L106-L119)):
Package`@openclaw/bluebubbles``@openclaw/diagnostics-otel``@openclaw/discord``@openclaw/feishu``@openclaw/lobster``@openclaw/matrix``@openclaw/msteams``@openclaw/nextcloud-talk``@openclaw/nostr``@openclaw/voice-call``@openclaw/zalo``@openclaw/zalouser`
### Plugin Fast Path

When only plugins need publishing (no core `openclaw` bump), use the plugin fast path documented in [AGENTS.md222-240](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L222-L240) The procedure:

1. Open a tmux session and sign in to 1Password.
2. For each plugin, compare local `version` to `npm view <name> version`.
3. Run `npm publish --access public --otp="<otp>"` only for packages where the version differs.
4. Verify with `npm view @openclaw/<name> version` per plugin; confirm `npm view openclaw version` has **not** changed.

Never run `npm publish` from the repo root during a plugin-only release.

Sources: [AGENTS.md222-240](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L222-L240)[docs/reference/RELEASING.md93-121](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md#L93-L121)

---

## Changelog Management

`CHANGELOG.md` is the canonical user-facing release log. Rules from [AGENTS.md250-252](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L250-L252) and [docs/reference/RELEASING.md40-41](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md#L40-L41):

- Entries are **strictly descending by version** (newest at top).
- Each version section has two subsections in order:

1. `### Changes` — new features and behavior changes
2. `### Fixes` — bug fixes, ranked with user-facing fixes first, deduplicated
- **Do not include** internal/meta notes such as version alignment steps, appcast reminders, or release process details.
- Pure test additions and fixes generally **do not** need a changelog entry unless they alter user-facing behavior.
- For beta prereleases, the GitHub release body uses the content from the version's `### Changes` + `### Fixes` sections without duplicating the title.

The `changelog-add` pattern (referenced in the page purpose) is simply editing `CHANGELOG.md` directly following the conventions above. There is no separate script for adding changelog entries.

Sources: [AGENTS.md102-103](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L102-L103)[AGENTS.md250-252](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L250-L252)[docs/reference/RELEASING.md40-41](https://github.com/openclaw/openclaw/blob/8090cb4c/docs/reference/RELEASING.md#L40-L41)[AGENTS.md244-248](https://github.com/openclaw/openclaw/blob/8090cb4c/AGENTS.md#L244-L248)

---

## GitHub Label & Stale Automation

### Label Automation

Labels are applied automatically via two mechanisms:

**Path-based labels** (`.github/labeler.yml`): the `labeler` job in [.github/workflows/labeler.yml22-127](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/labeler.yml#L22-L127) runs on PRs and applies labels based on which files changed. Every channel, app, and subsystem has a matching label defined in [.github/labeler.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/labeler.yml)

**Size labels**: the same job also computes a PR size label (`size: XS/S/M/L/XL`) based on the total changed lines, excluding `docs/**`, lockfiles, and `docs.acp.md`. Thresholds: XS < 50, S < 200, M < 500, L < 1000, XL ≥ 1000.

**Contributor labels**: maintainers get a `maintainer` label; contributors with ≥ 4 merged PRs get `trusted-contributor`; ≥ 10 merged PRs gets `experienced-contributor`.

Labels are created if missing using `scripts/sync-labels.ts`, which reads `labeler.yml` to derive the label list and assigns colors by prefix:
PrefixColor`channel``1d76db``app``6f42c1``extensions``0e8a16``docs``0075ca``size``fbca04`
Sources: [.github/workflows/labeler.yml1-440](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/labeler.yml#L1-L440)[.github/labeler.yml1-260](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/labeler.yml#L1-L260)[scripts/sync-labels.ts1-100](https://github.com/openclaw/openclaw/blob/8090cb4c/scripts/sync-labels.ts#L1-L100)

### Stale Automation

The `stale` workflow ([.github/workflows/stale.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/stale.yml)) runs on a daily cron (`17 3 * * *`) and enforces the following policy:
ItemMarked stale afterClosed afterIssues7 days inactive5 more daysPRs5 days inactive3 more days
Exempt labels: `enhancement`, `maintainer`, `pinned`, `security`, `no-stale` (issues); `maintainer`, `no-stale` (PRs).

Stale state is removed when the item is updated (`remove-stale-when-updated: true`). All assignees are exempt from stale. The close reason for issues is `not_planned`.

Sources: [.github/workflows/stale.yml1-52](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/stale.yml#L1-L52)

### Auto-response Automation

The `auto-response` workflow ([.github/workflows/auto-response.yml](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/auto-response.yml)) fires on issue/PR label events and handles `r:`-prefixed trigger labels:
LabelAction`r: skill`Close with redirect to Clawhub`r: support`Close with redirect to Discord`r: testflight`Close with "build from source"`r: third-party-extension`Close with plugin docs link`r: moltbook`Close + lock (off-topic)`dirty` (PR)Comment + close`invalid`Close
The workflow also detects spam-pinging of multiple maintainers (≥ 3 maintainer mentions in a single comment or issue body) and posts a warning.

Sources: [.github/workflows/auto-response.yml1-349](https://github.com/openclaw/openclaw/blob/8090cb4c/.github/workflows/auto-response.yml#L1-L349)