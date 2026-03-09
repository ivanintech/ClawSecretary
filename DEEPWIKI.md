# Overview

# Overview
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

This document provides a high-level technical introduction to the OpenClaw codebase, its architecture, and core components. It serves as an entry point for developers who need to understand the system's structure before diving into specific subsystems.

**Purpose**: Introduce the overall system architecture, key code entities, configuration model, and development workflow.

**Scope**: This page covers the architectural layers and major subsystems. For specific implementation details, see:

- Gateway internals and service lifecycle: [2](/openclaw/openclaw/2-gateway)
- Agent execution pipeline and runtime: [3](/openclaw/openclaw/3-agents)
- Channel integrations and messaging: [4](/openclaw/openclaw/4-channels)
- Web UI and control surfaces: [5](/openclaw/openclaw/5-control-ui)
- Native client applications (nodes): [6](/openclaw/openclaw/6-native-clients-(nodes))
- Security model and policies: [7](/openclaw/openclaw/7-security)
- Development workflows and CI/CD: [8](/openclaw/openclaw/8-development)

## What is OpenClaw?

OpenClaw is a **self-hosted, multi-channel AI agent gateway** that bridges messaging platforms (WhatsApp, Telegram, Discord, Slack, Signal, iMessage, and others) to AI coding agents. It runs as a single persistent process that manages sessions, routes messages, executes tools, and coordinates agent interactions.

**Key characteristics**:

- Single `gateway` process serves all channels and clients
- Agent runtime uses Pi SDK (`@mariozechner/pi-agent-core`, `@mariozechner/pi-ai`, `@mariozechner/pi-coding-agent`)
- Configuration-driven with strict Zod validation (`OpenClawSchema`)
- Plugin architecture for channel extensions and custom integrations
- Multi-agent routing with per-agent workspaces and sessions
- Sandboxing support (Docker-based isolation for untrusted sessions)

Sources: [package.json1-443](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L1-L443)[README.md1-581](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L1-L581)[src/config/zod-schema.ts1-694](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L1-L694)

## Core Architecture

```
Infrastructure

Agent Execution

Channel Providers

Gateway Process

User Interfaces

CLI Commands
(openclaw.mjs)

Control UI
(ui/ - Lit components)

macOS App
(apps/macos)

Mobile Nodes
(apps/ios, apps/android)

Gateway Server
(WebSocket + HTTP)
Port 18789

Config Loader
(loadConfig, validateConfigObject)

Session Manager
(SessionSchema)

Message Router
(bindings, routing)

WhatsApp
(@whiskeysockets/baileys)

Telegram
(grammy)

Discord
(@buape/carbon)

Slack
(@slack/bolt)

Signal
(signal-cli)

Other Channels
(extensions/*)

Agent Orchestrator
(runReplyAgent,
runAgentTurnWithFallback)

Pi Agent Runtime
(@mariozechner/pi-agent-core)

Tool System
(ToolsSchema)

Memory Backend
(QMD or builtin)

Plugin Loader
(plugin-sdk)

Sandbox Manager
(Docker)

Model Providers
(OpenAI, Anthropic, etc.)
```

Sources: [package.json1-443](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L1-L443)[README.md186-202](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L186-L202)[src/config/types.ts1-36](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts#L1-L36)

## Configuration System

OpenClaw uses a strict, schema-validated configuration file at `~/.openclaw/openclaw.json` (JSON5 format with comments and trailing commas).

### Core Config Schema

The configuration is defined by `OpenClawSchema` and includes these top-level sections:
SectionSchemaPurpose`gateway`Gateway settingsPort, bind address, auth mode, reload behavior`agents``AgentsSchema`Agent list, defaults, workspace paths`channels``ChannelsSchema`Channel-specific config (WhatsApp, Telegram, Discord, etc.)`models``ModelsConfigSchema`Model providers, auth profiles, fallbacks`tools``ToolsSchema`Tool policy, sandbox settings, browser config`session``SessionSchema`Session scoping, reset policy, thread bindings`messages``MessagesSchema`Message delivery, chunking, media handling`bindings``BindingsSchema`Multi-agent routing rules`memory``MemorySchema`Memory backend selection (QMD or builtin)`plugins`Plugin entriesExtension config and hooks`hooks``HooksSchema`Webhook endpoints and mappings`cron`Cron settingsJob scheduling and execution`browser`Browser configPlaywright/CDP settings, profiles`secrets``SecretsConfigSchema`SecretRef definitions (env/file/exec)
### Config Lifecycle

```
hybrid/restart

hot

File Watcher
(chokidar)

loadConfig()

parseConfigJson5()

$include resolver

validateConfigObjectWithPlugins()

Secret resolver
(SecretRef)

Runtime snapshot
(getRuntimeConfigSnapshot)

Hot reload check
(gateway.reload.mode)

Gateway restart

Live config update
```

**Key code entities**:

- `loadConfig()` - Main config loader [src/config/config.ts1-24](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts#L1-L24)
- `validateConfigObjectWithPlugins()` - Zod validation with plugin schemas
- `OpenClawSchema` - Root Zod schema [src/config/zod-schema.ts162-694](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L162-L694)
- `gateway.reload.mode` - Controls hot reload behavior (`hybrid`, `hot`, `restart`, `off`)

Sources: [src/config/zod-schema.ts1-694](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L1-L694)[src/config/config.ts1-24](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts#L1-L24)[docs/gateway/configuration.md1-489](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L1-L489)

## Multi-Channel Architecture

OpenClaw supports multiple messaging platforms simultaneously through a provider pattern. Each channel has:

1. **Monitor** - Listens for inbound events
2. **Access control** - DM/group policies (`dmPolicy`, `groupPolicy`)
3. **Send adapter** - Outbound message delivery
4. **Native command registration** - Platform-specific commands (Discord slash, Telegram bot menu)

### Channel Provider Map
ChannelProvider PackageConfig KeyDM PolicyWhatsApp`@whiskeysockets/baileys``channels.whatsapp``pairing` (default)Telegram`grammy``channels.telegram``pairing` (default)Discord`@buape/carbon``channels.discord``pairing` (default)Slack`@slack/bolt``channels.slack``pairing` (default)Signalsignal-cli`channels.signal``allowlist`iMessageimsg (legacy)`channels.imessage`N/A (macOS only)BlueBubblesHTTP API`channels.bluebubbles``allowlist`Google ChatPlugin`plugins.entries.googlechat`Via plugin configMattermostPlugin`plugins.entries.mattermost`Via plugin config
**Channel loading pattern**:

- Built-in channels: WhatsApp, Telegram, Discord, Slack, Signal, iMessage
- Plugin channels: Loaded via `plugins.load.paths` and registered through plugin SDK
- All channels share common `ChannelMonitor` interface

Sources: [package.json332-384](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L332-L384)[src/config/zod-schema.ts417-694](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L417-L694)[README.md152-154](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L152-L154)

## Agent Execution Pipeline

The agent execution system uses a layered orchestration model:

```
Inbound message

resolveAgentRoute()

runReplyAgent()

Start typing indicator

runAgentTurnWithFallback()

Model fallback loop

runEmbeddedPiAgent()

Retry loop
(auth profile rotation)

runEmbeddedAttempt()

Load session
(session key, transcript)

Build system prompt
(bootstrap context)

Provision tools
(filtered by policy)

Pi SDK run
(@mariozechner/pi-agent-core)

Stream to model provider

Tool calls

Tool execution
(sandbox aware)

Final response

Update session transcript

Channel delivery adapter
```

**Key execution functions** (in order of invocation):

1. `runReplyAgent()` - Top-level entry point, manages typing indicators and memory flushing
2. `runAgentTurnWithFallback()` - Implements model fallback logic
3. `runEmbeddedPiAgent()` - Handles retry/fallback across auth profiles
4. `runEmbeddedAttempt()` - Single turn execution with Pi SDK

**Tool provisioning**:

- `ToolsSchema` defines global tool policy
- Hierarchical filtering: global → agent → group → sandbox
- Sandbox mode (`agents.defaults.sandbox.mode`): `off`, `non-main`, `all`

Sources: [package.json55-66](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L55-L66)[src/config/zod-schema.ts3-23](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L3-L23)

## Memory System Architecture

OpenClaw supports two memory backends via plugin slot selection:

```
Builtin Backend

QMD Backend

qmd

builtin

on error

memory_search tool

getMemorySearchManager()

memory.backend

QMD Backend

Builtin Backend

Fallback wrapper

QmdMemoryManager

qmd CLI spawn

Collection management

mcporter
(MCP integration)

MemoryIndexManager

SQLite + sqlite-vec

FTS5 (BM25)

Vector search
(cosine similarity)

Embedding provider
(OpenAI/Gemini)

Hybrid merge
(MMR + temporal decay)
```

**Memory backend selection**:

- `memory.backend: "qmd"` - External QMD process (supports MCP via mcporter)
- `memory.backend: "builtin"` - Embedded SQLite with FTS5 and sqlite-vec
- Fallback: QMD → Builtin on error

**Config entities**:

- `MemorySchema`[src/config/zod-schema.ts114-121](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L114-L121)
- `MemoryQmdSchema`[src/config/zod-schema.ts100-112](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L100-L112)
- `memory.citations` - Controls citation decoration (`auto`, `on`, `off`)

Sources: [src/config/zod-schema.ts44-121](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L44-L121)[package.json163-165](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L163-L165)

## Gateway Service Lifecycle

OpenClaw runs as a persistent background service (systemd on Linux, launchd on macOS).

### Service Management Commands
CommandPurpose`openclaw gateway install`Install systemd/launchd service unit`openclaw gateway start`Start the service`openclaw gateway stop`Stop the service`openclaw gateway restart`Restart the service`openclaw gateway status`Check service status and RPC probe`openclaw gateway run`Run gateway in foreground (dev mode)
### Runtime Paths
PathPurposeConfig/Env Override`~/.openclaw/openclaw.json`Main config file`OPENCLAW_CONFIG_PATH``~/.openclaw/sessions.json`Session stateN/A`~/.openclaw/credentials/`OAuth/API key storeN/A`~/.openclaw/workspace/`Default agent workspace`agents.defaults.workspace``~/.openclaw/logs/`Log files`logging.file``~/.openclaw/.env`Environment variablesN/A
**Profile isolation**:

- `--dev` flag → `~/.openclaw-dev/`
- `--profile <name>` → `~/.openclaw-<name>/`
- `OPENCLAW_STATE_DIR` env var for custom state root

Sources: [src/config/paths.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/paths.ts) (referenced but not provided), [docs/cli/index.md63-68](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md#L63-L68)[README.md52-90](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L52-L90)

## Plugin Architecture

OpenClaw uses a plugin system for extensibility:

```
Plugin loader

Plugin discovery
(npm packages, local paths)

Load plugin manifest

Import plugin SDK
(openclaw/plugin-sdk/*)

Plugin registration
(channels, hooks, tools)

Runtime API access
(api.runtime)
```

**Plugin SDK exports** (scoped by subsystem):

- `openclaw/plugin-sdk/core` - Core plugin utilities
- `openclaw/plugin-sdk/telegram` - Telegram channel APIs
- `openclaw/plugin-sdk/discord` - Discord channel APIs
- `openclaw/plugin-sdk/slack` - Slack channel APIs
- Plugin-specific subpaths for bundled extensions

**Plugin config**:

- `plugins.load.paths` - Array of paths to load plugins from
- `plugins.entries.<id>.enabled` - Enable/disable specific plugins
- `plugins.entries.<id>.config` - Plugin-specific configuration
- `plugins.entries.<id>.hooks.allowPromptInjection` - Control prompt-mutating hooks

Sources: [package.json37-215](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L37-L215)[src/config/zod-schema.ts149-161](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L149-L161)

## Development Workflow

### Local Development

```
# Clone and install
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
 
# Build UI and main codebase
pnpm ui:build
pnpm build
 
# Run onboarding wizard
pnpm openclaw onboard --install-daemon
 
# Development mode (auto-reload)
pnpm gateway:watch
```

### Mobile Development
PlatformBuild CommandOutputiOS`pnpm ios:build`Xcode project (via xcodegen)Android`pnpm android:assemble`APK in `apps/android/app/build/outputs/`macOS`pnpm mac:package`Signed `.app` bundle
**iOS/macOS specifics**:

- Uses XcodeGen for project generation [apps/ios/project.yml1-200](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml#L1-L200)
- Swift 6.0 with strict concurrency
- CFBundleVersion/CFBundleShortVersionString in Info.plist

**Android specifics**:

- Gradle-based build system [apps/android/app/build.gradle.kts1-169](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L1-L169)
- Compose UI with Material 3
- Multi-ABI support (arm64-v8a, armeabi-v7a, x86, x86_64)

Sources: [package.json217-330](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L217-L330)[apps/ios/project.yml1-200](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml#L1-L200)[apps/android/app/build.gradle.kts1-169](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L1-L169)

## CLI Entry Point

The main CLI entry point is `openclaw.mjs`, which delegates to the command tree built by `buildProgram()`.

**Command structure**:

- Root: `openclaw [--dev] [--profile <name>] <command>`
- Subcommands organized by domain (gateway, channels, agents, models, etc.)
- Global flags: `--dev`, `--profile`, `--no-color`, `--json`, `--version`

**Command domains**:

- Setup/config: `onboard`, `configure`, `config`, `doctor`
- Service: `gateway`, `daemon` (legacy alias)
- Messaging: `message`, `channels`, `pairing`
- Agents: `agent`, `agents`, `acp`, `sessions`
- Tools: `models`, `memory`, `browser`, `cron`, `hooks`, `skills`, `plugins`
- Nodes: `nodes`, `devices`, `node`
- Security: `security`, `secrets`, `approvals`, `sandbox`

Sources: [src/cli/program.ts1-3](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts#L1-L3)[docs/cli/index.md1-547](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md#L1-L547)

## Version and Release Information

Current version: **2026.3.2** (build 20260301)

**Version locations**:

- package.json: `version: "2026.3.3"`[package.json3](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L3-L3)
- iOS Info.plist: `CFBundleShortVersionString: "2026.3.2"`[apps/ios/Sources/Info.plist22](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L22-L22)
- Android build.gradle.kts: `versionName: "2026.3.2"`[apps/android/app/build.gradle.kts25](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L25-L25)
- macOS Info.plist: `CFBundleShortVersionString: "2026.3.2"`[apps/macos/Sources/OpenClaw/Resources/Info.plist18](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist#L18-L18)
- CHANGELOG.md: Latest entry `## 2026.3.3`[CHANGELOG.md5](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L5-L5)

**Release channels**:

- `stable` - Tagged releases, npm dist-tag `latest`
- `beta` - Prerelease tags, npm dist-tag `beta`
- `dev` - Moving head of `main`, npm dist-tag `dev`

Sources: [package.json3](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L3-L3)[CHANGELOG.md1-605](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L1-L605)[apps/ios/Sources/Info.plist22](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L22-L22)[apps/android/app/build.gradle.kts24-25](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L24-L25)

---

# Getting-Started

# Getting Started
Relevant source files
- [docs/gateway/doctor.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/doctor.md)
- [docs/help/faq.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/faq.md)
- [docs/help/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/index.md)
- [docs/help/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/troubleshooting.md)
- [docs/install/gcp.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/install/gcp.md)
- [docs/install/hetzner.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/install/hetzner.md)
- [docs/install/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/install/index.md)
- [docs/install/installer.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/install/installer.md)
- [docs/install/migrating.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/install/migrating.md)
- [docs/install/node.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/install/node.md)
- [docs/platforms/digitalocean.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/digitalocean.md)
- [docs/platforms/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/index.md)
- [docs/platforms/linux.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/linux.md)
- [docs/platforms/oracle.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/oracle.md)
- [docs/vps.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/vps.md)
- [src/agents/bash-tools.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.test.ts)
- [src/agents/model-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-auth.ts)
- [src/agents/models-config.providers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts)
- [src/agents/pi-tools-agent-config.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools-agent-config.test.ts)
- [src/cli/program/register.onboard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program/register.onboard.ts)
- [src/commands/auth-choice-options.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.test.ts)
- [src/commands/auth-choice-options.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.ts)
- [src/commands/auth-choice.apply.api-providers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.apply.api-providers.ts)
- [src/commands/auth-choice.preferred-provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.preferred-provider.ts)
- [src/commands/auth-choice.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.test.ts)
- [src/commands/auth-choice.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.ts)
- [src/commands/configure.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/configure.ts)
- [src/commands/doctor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/doctor.ts)
- [src/commands/onboard-auth.config-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.config-core.ts)
- [src/commands/onboard-auth.credentials.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.credentials.ts)
- [src/commands/onboard-auth.models.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.models.ts)
- [src/commands/onboard-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.test.ts)
- [src/commands/onboard-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.ts)
- [src/commands/onboard-non-interactive.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-non-interactive.ts)
- [src/commands/onboard-non-interactive/local/auth-choice.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-non-interactive/local/auth-choice.ts)
- [src/commands/onboard-types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-types.ts)
- [src/wizard/onboarding.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/wizard/onboarding.ts)

This page covers prerequisites, installation, the `openclaw onboard` wizard, the `openclaw doctor` command, and verifying a working setup. It targets first-time users going from zero to a running Gateway.

For definitions of Gateway, Agent, Node, Channel, and Session, see [Core Concepts](/openclaw/openclaw/1.2-core-concepts). For deep Gateway configuration after setup is working, see [Configuration](/openclaw/openclaw/2.3-configuration-system). For the full CLI surface, see [Gateway](/openclaw/openclaw/2-gateway).

---

## Prerequisites
RequirementDetails**Node.js**Version 22 or newer (`node --version` to check)**Package manager**npm or pnpm; **pnpm is recommended****OS**macOS, Linux, or Windows via WSL2 (WSL2 strongly recommended on Windows)**RAM**512MB-1GB minimum for personal use; 2GB recommended with headroom for logs/media**Disk**~500MB for Gateway installation
The minimum runtime is enforced at process startup via `assertSupportedRuntime` before any commands run. Bun is **not recommended** for the Gateway.

Sources: [docs/help/faq.md362-377](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/faq.md#L362-L377)[src/index.ts44-45](https://github.com/openclaw/openclaw/blob/8873e13f/src/index.ts#L44-L45)

---

## Installation

Three installation paths are supported:
MethodCommandUse case**Installer script (recommended)**`curl -fsSL https://openclaw.ai/install.sh | bash`Most users; handles Node detection, installation, PATH setup, and onboarding automatically**npm/pnpm global**`npm install -g openclaw@latest`Clean installs with Node >= 22 already on PATH**From source (git)**`git clone` + `pnpm install && pnpm build`Contributors and development; allows local edits
### Installer Script (Recommended)

The installer script automatically detects Node, installs it if missing, installs OpenClaw globally via npm, and launches the onboarding wizard.

**macOS/Linux/WSL2:**

```
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**

```
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**Skip onboarding (install binary only):**

```
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

**Install from git checkout (hackable install):**

```
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --install-method git
```

The `--install-method git` flag clones the repository and installs from source, allowing you to modify code locally. This is useful for development or when working with AI coding assistants that need to read the full source tree.

Sources: [docs/help/faq.md318-332](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/faq.md#L318-L332)[docs/install/installer.md14-67](https://github.com/openclaw/openclaw/blob/8873e13f/docs/install/installer.md#L14-L67)

### npm/pnpm

If you already have Node 22+ installed:

```
npm install -g openclaw@latest
# or
pnpm add -g openclaw@latest
```

After installation, run the onboarding wizard:

```
openclaw onboard --install-daemon
```

Sources: [docs/install/index.md72-85](https://github.com/openclaw/openclaw/blob/8873e13f/docs/install/index.md#L72-L85)

### From Source (Git)

For contributors or development workflows:

```
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
pnpm ui:build   # builds Control UI assets; auto-installs UI deps on first run
```

For source installs:

- `pnpm openclaw ...` runs TypeScript directly via `tsx`
- `pnpm build` is required before running via Node or the packaged binary
- `pnpm gateway:watch` provides hot-reload during development

Run onboarding after building:

```
pnpm openclaw onboard
```

Sources: [docs/help/faq.md318-340](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/faq.md#L318-L340)[docs/install/index.md34-69](https://github.com/openclaw/openclaw/blob/8873e13f/docs/install/index.md#L34-L69)

---

## Running the Onboarding Wizard

`openclaw onboard` is the recommended first step after installing. It is an interactive wizard that configures:

- Model provider authentication (Anthropic, OpenAI, Google Gemini, local models, etc.)
- Agent workspace directory
- Gateway settings (port, bind address, authentication)
- Communication channels (Telegram, Discord, WhatsApp, etc.)
- Skills and memory search setup
- Optional background daemon installation

```
openclaw onboard --install-daemon
```

The `--install-daemon` flag installs the Gateway as a **launchd user service** (macOS) or **systemd user unit** (Linux/WSL2), ensuring it runs automatically after system boot and persists after the terminal closes.

### Wizard Execution Flow

**Diagram: Onboarding wizard execution path → code entities**

```
true

false

invalid

valid

quickstart

advanced

remote

local

openclaw onboard
(CLI entry point)

onboardCommand()
src/commands/onboard.ts

opts.nonInteractive
?

runNonInteractiveOnboarding()
src/commands/onboard-non-interactive.ts

runInteractiveOnboarding()
src/commands/onboard-interactive.ts

runOnboardingWizard()
src/wizard/onboarding.ts

requireRiskAcknowledgement()
Security warning + confirmation

readConfigFileSnapshot()
Load existing config

Config valid?

Error: run 'openclaw doctor' first

Prompt: WizardFlow
quickstart | advanced

QuickStart defaults:
port 18789
bind loopback
auth token
Tailscale off

Manual prompts for all settings

Prompt: OnboardMode
local | remote

promptRemoteGatewayConfig()
src/commands/onboard-remote.ts

resolveUserPath(workspace)
applyOnboardingLocalWorkspaceConfig()

promptAuthChoiceGrouped()
src/commands/auth-choice-prompt.ts

applyAuthChoice()
src/commands/auth-choice.ts

promptDefaultModel()
src/commands/model-picker.ts

configureGatewayForOnboarding()
src/wizard/onboarding.gateway-config.ts

setupChannels()
src/commands/onboard-channels.ts

setupSearch()
src/commands/onboard-search.ts

setupSkills()
src/commands/onboard-skills.ts

setupInternalHooks()
src/commands/onboard-hooks.ts

writeConfigFile()
config.writeConfigFile()

applyWizardMetadata()
wizard.lastRunAt
wizard.lastRunVersion

finalizeOnboardingWizard()
Daemon install + health checks
```

Sources: [src/commands/onboard.ts1-24](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard.ts#L1-L24)[src/wizard/onboarding.ts73-553](https://github.com/openclaw/openclaw/blob/8873e13f/src/wizard/onboarding.ts#L73-L553)[src/commands/onboard-interactive.ts1-30](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-interactive.ts#L1-L30)

### QuickStart vs Advanced Mode

The first prompt is mode selection (unless `--flow` is specified via CLI). QuickStart applies sensible defaults and minimizes prompts; Advanced provides full control over all settings.

**Diagram: QuickStart vs Advanced configuration flow**

```
Flow selection prompt

QuickStart

Advanced

Apply defaults:
port: 18789
bind: loopback
auth: token (generated)
Tailscale: off
skip DM policy prompt
quickstartAllowFrom for channels

Prompt for each setting:
port
bind mode
auth mode
custom bind host (if custom)
Tailscale mode
DM isolation policy

Common steps:
Workspace
Auth choice
Model selection
Channels
Skills
Search
```
SettingQuickStart DefaultAdvancedGateway bind`loopback` (127.0.0.1)`loopback`, `lan`, `auto`, `custom`, or `tailnet`Gateway port`18789`ConfigurableGateway authToken (auto-generated via `randomToken()`)Token or PasswordTailscale modeOffOff / Serve / FunnelModeLocal onlyLocal or RemoteDM isolation`per-channel-peer` (implicit)Explicit promptChannel allowFromAuto-configured for QuickStart-eligible channelsPrompted per channel
**Type reference:**`WizardFlow = "quickstart" | "advanced"` is defined in [src/wizard/onboarding.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/wizard/onboarding.types.ts) The `"manual"` CLI value is normalized to `"advanced"` before processing.

Sources: [src/wizard/onboarding.ts108-139](https://github.com/openclaw/openclaw/blob/8873e13f/src/wizard/onboarding.ts#L108-L139)[src/wizard/onboarding.ts229-279](https://github.com/openclaw/openclaw/blob/8873e13f/src/wizard/onboarding.ts#L229-L279)[src/wizard/onboarding.types.ts1-20](https://github.com/openclaw/openclaw/blob/8873e13f/src/wizard/onboarding.types.ts#L1-L20)

### What the Wizard Writes to Config

All wizard output is written to `~/.openclaw/openclaw.json` (resolved via `CONFIG_PATH` constant). The sections it populates:
Config keyWhat is setSource function`agents.defaults.workspace`Workspace directory (default `~/.openclaw/workspace`)`applyOnboardingLocalWorkspaceConfig()``agents.defaults.model`Primary model (e.g., `anthropic/claude-opus-4-6`)`applyPrimaryModel()``agents.defaults.models`Model allowlist with aliases`applyAuthChoice()``auth.profiles.*`Auth profile configurations`applyAuthProfileConfig()``gateway.mode``local` or `remote`Wizard mode selection`gateway.port`Default `18789` (`DEFAULT_GATEWAY_PORT`)Gateway configuration flow`gateway.bind``loopback`, `lan`, `tailnet`, `custom`, or `auto`Gateway configuration flow`gateway.auth.mode``token` or `password`Gateway configuration flow`gateway.auth.token`Auto-generated hex token via `randomToken()`Gateway configuration flow`gateway.tailscale.mode``off`, `serve`, or `funnel`Gateway configuration flow`gateway.tailscale.resetOnExit`Boolean flagGateway configuration flow`channels.*`Channel tokens and `allowFrom` lists`setupChannels()``memory.backend``qmd` or `builtin``setupSearch()``skills.*`Skills configuration`setupSkills()``hooks.newSession.appendMemory`Session memory hook`setupInternalHooks()``wizard.lastRunAt`ISO 8601 timestamp`applyWizardMetadata()``wizard.lastRunVersion`Package version at run time`applyWizardMetadata()``wizard.lastRunCommand``"onboard"``applyWizardMetadata()`
Sources: [src/commands/onboard-helpers.ts40-62](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-helpers.ts#L40-L62)[src/wizard/onboarding.ts409-537](https://github.com/openclaw/openclaw/blob/8873e13f/src/wizard/onboarding.ts#L409-L537)[src/config/config.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts#L1-L50)

### Key `onboard` Flags
FlagEffectUse case`--install-daemon`Install Gateway as a launchd/systemd servicePersist Gateway across reboots`--flow quickstart|advanced`Skip the flow selection promptAutomation or known preferences`--mode local|remote`Skip the mode selection promptAutomation`--non-interactive`Run without prompts; requires explicit flags for all optionsCI/CD, automation scripts`--accept-risk`Acknowledge security warning (required for `--non-interactive`)Headless installs`--reset`Clear config/credentials/sessions before runningFresh start`--reset-scope config|config+creds+sessions|full`Control reset granularity (`full` also removes workspace)Targeted cleanup`--workspace <dir>`Set workspace directory pathCustom workspace location`--auth-choice <choice>`Set auth method (see [Auth Choice Options](https://github.com/openclaw/openclaw/blob/8873e13f/Auth Choice Options))Non-interactive setup`--token-provider <provider>`Provider for `--auth-choice token`Non-interactive token auth`--token <value>`Token value for `--auth-choice token`Non-interactive token auth`--anthropic-api-key <key>`Anthropic API keyNon-interactive API key auth`--openai-api-key <key>`OpenAI API keyNon-interactive API key auth`--gemini-api-key <key>`Google Gemini API keyNon-interactive API key auth`--gateway-port <port>`Override gateway port (default `18789`)Custom port binding`--gateway-bind <mode>`Override bind address (`loopback|lan|tailnet|custom|auto`)Network configuration`--gateway-auth <mode>`Auth mode (`token|password`)Gateway authentication`--skip-channels`Skip channel setup stepFast initial setup`--skip-skills`Skip skills install stepFast initial setup`--skip-search`Skip memory search setupFast initial setup`--secret-input-mode <mode>`API key persistence mode (`plaintext|ref`)SecretRef configuration
Sources: [src/cli/program/register.onboard.ts1-143](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program/register.onboard.ts#L1-L143)[docs/cli/onboard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/onboard.md)

### Auth Choice Options

The `--auth-choice` flag accepts these values:
ValueProviderAuth Method`token`AnthropicSetup token (paste from `claude setup-token`)`apiKey`AnthropicAPI key`openai-codex`OpenAICodex OAuth (ChatGPT subscription)`openai-api-key`OpenAIAPI key`gemini-api-key`GoogleGemini API key`google-gemini-cli`GoogleGemini CLI OAuth (unofficial)`github-copilot`GitHubCopilot (GitHub device login)`vllm`vLLMLocal/self-hosted OpenAI-compatible server`minimax-portal`MiniMaxOAuth`minimax-api`MiniMaxAPI key`qwen-portal`QwenOAuth`chutes`ChutesOAuth... and many moreSee [Auth Choice Options](https://github.com/openclaw/openclaw/blob/8873e13f/Auth Choice Options)Various API keys and OAuth flows
For the complete list, see [src/commands/auth-choice-options.ts190-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.ts#L190-L300)

Sources: [src/commands/auth-choice-options.ts20-188](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.ts#L20-L188)[src/commands/onboard-provider-auth-flags.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-provider-auth-flags.ts#L1-L200)

---

## The `doctor` Command

`openclaw doctor` is the health check, repair, and migration tool. It validates config, checks auth profiles, migrates legacy state, repairs sandbox images, audits service configurations, and offers interactive fixes for detected issues.

**When to run doctor:**

- After initial installation (via onboarding wizard)
- After upgrading OpenClaw (`openclaw update`)
- When the Gateway won't start or behaves unexpectedly
- Before filing a bug report (include `openclaw doctor` output)

```
openclaw doctor
```

For headless or automated environments:

```
openclaw doctor --yes          # accept all defaults without prompting (including restart/service/sandbox repairs)
openclaw doctor --repair       # apply recommended repairs without prompting
openclaw doctor --non-interactive  # safe migrations only, no prompts (skips restart/service/sandbox actions)
openclaw doctor --deep         # scan system services for extra gateway installs (launchd/systemd/schtasks)
```

Sources: [src/commands/doctor.ts72-363](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/doctor.ts#L72-L363)[docs/gateway/doctor.md1-100](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/doctor.md#L1-L100)

### What `doctor` Checks and Repairs

**Diagram: doctorCommand execution flow → check modules**

```
yes

no

yes

no

doctorCommand()
src/commands/doctor.ts:72

printWizardHeader()
intro('OpenClaw doctor')

maybeOfferUpdateBeforeDoctor()
doctor-update.ts

maybeRepairUiProtocolFreshness()
doctor-ui.ts

noteSourceInstallIssues()
doctor-install.ts

noteDeprecatedLegacyEnvVars()
doctor-platform-notes.ts

loadAndMaybeMigrateDoctorConfig()
doctor-config-flow.ts

maybeRepairAnthropicOAuthProfileId()
doctor-auth.ts

noteAuthProfileHealth()
doctor-auth.ts

gateway.auth.token
missing?

Prompt: generate token?
randomToken()

detectLegacyStateMigrations()
doctor-state-migrations.ts

runLegacyStateMigrations()
(if detected)

noteStateIntegrity()
doctor-state-integrity.ts

noteSessionLockHealth()
doctor-session-locks.ts

maybeRepairSandboxImages()
doctor-sandbox.ts

noteSandboxScopeWarnings()
doctor-sandbox.ts

maybeScanExtraGatewayServices()
doctor-gateway-services.ts

maybeRepairGatewayServiceConfig()
doctor-gateway-services.ts

noteMacLaunchAgentOverrides()
doctor-platform-notes.ts

noteMacLaunchctlGatewayEnvOverrides()
doctor-platform-notes.ts

noteSecurityWarnings()
doctor-security.ts

noteOpenAIOAuthTlsPrerequisites()
oauth-tls-preflight.ts

Validate hooks.gmail.model
(if configured)

ensureSystemdUserLingerInteractive()
systemd-linger.ts

noteWorkspaceStatus()
doctor-workspace-status.ts

noteBootstrapFileSize()
doctor-bootstrap-size.ts

doctorShellCompletion()
doctor-completion.ts

checkGatewayHealth()
doctor-gateway-health.ts

probeGatewayMemoryStatus()
doctor-gateway-health.ts

noteMemorySearchHealth()
doctor-memory-search.ts

maybeRepairGatewayDaemon()
doctor-gateway-daemon-flow.ts

Config changed?

writeConfigFile()
applyWizardMetadata()

Log backup path
(if .bak exists)

noteWorkspaceBackupTip()
shouldSuggestMemorySystem()

readConfigFileSnapshot()
Validate final state

outro('Doctor complete.')
```

Sources: [src/commands/doctor.ts72-363](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/doctor.ts#L72-L363)
Check categoryWhat it examinesModule/Function**Pre-flight update**Offers update for git installs (interactive only)`maybeOfferUpdateBeforeDoctor()`**UI protocol**Rebuilds Control UI when protocol schema is newer`maybeRepairUiProtocolFreshness()`**Source install**pnpm workspace mismatch, missing UI assets, missing tsx binary`noteSourceInstallIssues()`**Deprecated env vars**Legacy `CLAWDBOT_*` env vars`noteDeprecatedLegacyEnvVars()`**Config validity**Validates `openclaw.json` against Zod schema; applies migrations`loadAndMaybeMigrateDoctorConfig()`**Auth profiles**OAuth/API key health; repairs Anthropic OAuth profile IDs; checks expiry/cooldown`maybeRepairAnthropicOAuthProfileId()`, `noteAuthProfileHealth()`**Gateway token**Ensures `gateway.auth.token` is set; offers to generate via `randomToken()`Gateway token check in `doctorCommand()`**Legacy state**Old session/agent file paths; WhatsApp auth migration`detectLegacyStateMigrations()`, `runLegacyStateMigrations()`**State integrity**Session lock health; dangling lock files; state directory permissions`noteStateIntegrity()`, `noteSessionLockHealth()`**Sandbox images**Docker image availability when `tools.sandbox.enabled: true``maybeRepairSandboxImages()`**Sandbox scope**Warns if sandbox config violates security best practices`noteSandboxScopeWarnings()`**Extra services**Scans launchd/systemd/schtasks for duplicate gateway instances`maybeScanExtraGatewayServices()`**Service config**LaunchAgent/systemd unit config matches current settings`maybeRepairGatewayServiceConfig()`**macOS overrides**Cached launchd label; env var overrides in launchctl`noteMacLaunchAgentOverrides()`, `noteMacLaunchctlGatewayEnvOverrides()`**Security**Open DM policies, non-loopback bind without auth`noteSecurityWarnings()`**OAuth TLS**OpenAI Codex OAuth TLS prerequisites`noteOpenAIOAuthTlsPrerequisites()`**Hooks config**Validates `hooks.gmail.model` against model catalog`resolveHooksGmailModel()`, `getModelRefStatus()`**systemd linger**Ensures systemd user linger is enabled on Linux (prevents session kill on logout)`ensureSystemdUserLingerInteractive()`**Workspace**Workspace directory status; extra workspace dir detection`noteWorkspaceStatus()`**Bootstrap size**Warns if bootstrap files are unusually large`noteBootstrapFileSize()`**Shell completion**Tab completion installation for bash/zsh/fish`doctorShellCompletion()`**Gateway health**Live WebSocket probe; checks if Gateway is reachable`checkGatewayHealth()`**Memory status**Probes memory search backend readiness`probeGatewayMemoryStatus()`**Memory health**Memory backend configuration and status`noteMemorySearchHealth()`**Daemon repair**Service running status; offers restart/reload`maybeRepairGatewayDaemon()`
Sources: [src/commands/doctor.ts72-363](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/doctor.ts#L72-L363)[docs/gateway/doctor.md59-86](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/doctor.md#L59-L86)

### `doctor` Flags
FlagEffectWhen to use`--yes`Accept all prompts with defaults (including restart/service/sandbox repairs)Automation, headless installs`--repair` / `--fix`Apply recommended repairs without prompting (repairs + restarts where safe)Automation, known issues`--force`Apply aggressive repairs too (overwrites custom supervisor configs)When `--repair` isn't enough`--non-interactive`Run without prompts; only apply safe migrations (skips restart/service/sandbox)CI/CD, read-only diagnostics`--deep`Scan system services for extra gateway instances (launchd/systemd/schtasks)Debugging multiple installs`--generate-gateway-token`Generate and write a gateway token non-interactivelyHeadless token generation`--no-workspace-suggestions`Suppress workspace memory hintsClean output for automation
Sources: [src/commands/doctor-prompter.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/doctor-prompter.ts#L1-L50)[docs/gateway/doctor.md14-52](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/doctor.md#L14-L52)

---

## Verifying a Working Setup

**Diagram: Post-install verification sequence → Gateway + CLI components**

```
"Control UI
(browser)"
"WebSocket
ws://127.0.0.1:18789"
"Gateway Process
(GatewayServer)"
"Gateway Service
(launchd/systemd)"
"openclaw CLI
(src/index.ts)"
User
"Control UI
(browser)"
"WebSocket
ws://127.0.0.1:18789"
"Gateway Process
(GatewayServer)"
"Gateway Service
(launchd/systemd)"
"openclaw CLI
(src/index.ts)"
User
openclaw gateway status
Check service runtime
(resolveGatewayService().isRunning())
"running" or "stopped"
RPC probe
(buildGatewayConnectionDetails())
WebSocket handshake + auth
pong
RPC ok
"Runtime: running
RPC probe: ok"
openclaw status
RPC: health request
(gateway/call.ts)
health()
{ agents, sessions, channels, providers }
status payload
formatted status report
openclaw doctor
doctorCommand()
Run all checks
"Doctor complete."
openclaw dashboard
open http://127.0.0.1:18789/
WebSocket connect
Authorization: Bearer <token>
authenticate + establish session
OpenClawApp
(Control UI rendered)
```

Sources: [src/index.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/index.ts#L1-L100)[src/gateway/call.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/call.ts#L1-L100)[src/commands/doctor.ts72-363](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/doctor.ts#L72-L363)

Run these commands in sequence to confirm a healthy install:

```
# 1. Is the gateway service running and reachable?
openclaw gateway status
 
# 2. Overall system status snapshot
openclaw status
 
# 3. Run health checks and repairs
openclaw doctor
 
# 4. Open the Control UI in the browser
openclaw dashboard
```

### Expected Healthy Output
CommandHealthy OutputWhat it checks`openclaw gateway status``Runtime: running` and `RPC probe: ok`Service supervisor status + WebSocket reachability`openclaw status`No blocking errors; shows configured channels and agentsLive Gateway health via RPC; agent/session/provider summary`openclaw doctor`No critical issues; `Config valid: true`All doctor checks pass; config validates against Zod schema`openclaw channels status`Channels show `connected` or `ready`Live channel connection status from running Gateway`openclaw dashboard`Browser opens to `http://127.0.0.1:18789/` and renders Control UIWebSocket auth succeeds; UI assets are built
### Troubleshooting Startup Issues

If the Gateway does not start or RPC probe fails:

```
# Tail the latest log file
openclaw logs --follow
 
# If RPC is down, tail file logs directly
tail -f "$(ls -t /tmp/openclaw/openclaw-*.log | head -1)"
 
# Check service supervisor status
openclaw gateway status
 
# Full diagnostic report (safe to share; tokens redacted)
openclaw status --all
```

**Common issues:**

- **Port collision:** Another process is using port `18789`. Change `gateway.port` in config or stop the conflicting process.
- **Missing auth token:** Run `openclaw doctor` to generate one.
- **Invalid config:** Run `openclaw doctor` to repair and migrate.
- **Service not installed:** Run `openclaw onboard --install-daemon` or `openclaw daemon install`.

Sources: [docs/help/faq.md203-250](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/faq.md#L203-L250)[docs/help/troubleshooting.md14-50](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/troubleshooting.md#L14-L50)

---

## Key Environment Variables
VariableEffectDefault`OPENCLAW_HOME`Overrides the home directory for all internal path resolution`~``OPENCLAW_STATE_DIR`Overrides the state directory`~/.openclaw``OPENCLAW_CONFIG_PATH`Overrides config file path`~/.openclaw/openclaw.json``OPENCLAW_AGENT_DIR`Overrides the agent directory (for auth profiles, sessions, memory)`~/.openclaw/agents/main/agent``OPENCLAW_GATEWAY_TOKEN`Gateway auth token; read by both CLI and Gateway at startup(none; must be set in config or env)`OPENCLAW_GATEWAY_PASSWORD`Gateway password (alternative to token)(none)`OPENCLAW_GATEWAY_PORT`Overrides gateway port`18789``NODE_ENV`Node environment (`production`, `development`, `test`)(none)
**Legacy aliases (deprecated):**

- `CLAWDBOT_GATEWAY_TOKEN` → use `OPENCLAW_GATEWAY_TOKEN`
- `CLAWDBOT_GATEWAY_PASSWORD` → use `OPENCLAW_GATEWAY_PASSWORD`

Sources: [docs/help/faq.md123-127](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/faq.md#L123-L127)[src/config/paths.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/paths.ts#L1-L50)[src/commands/doctor-platform-notes.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/doctor-platform-notes.ts#L1-L50)

---

## Important Files and Paths
PathPurposeConstant/Function`~/.openclaw/openclaw.json`Primary config file`CONFIG_PATH``~/.openclaw/workspace/`Default agent workspace root`DEFAULT_WORKSPACE` constant`~/.openclaw/agents/main/agent/`Default agent directory (auth profiles, sessions, memory)`resolveOpenClawAgentDir()``~/.openclaw/agents/main/agent/auth-profiles.json`Model provider auth profiles`authProfilePathForAgent()``~/.openclaw/agents/main/agent/sessions/`Session transcript storage`resolveAgentSessionsDir()``~/.openclaw/credentials/`Channel credential storage (WhatsApp, etc.)Channel-specific paths`/tmp/openclaw/openclaw-*.log`Gateway log files (timestamped)Log rotation in Gateway startup`~/Library/LaunchAgents/ai.openclaw.gateway.plist`macOS launchd service config`resolveGatewayService()` (macOS)`~/.config/systemd/user/openclaw-gateway.service`Linux systemd user unit`resolveGatewayService()` (Linux)`~/.openclaw/.backup/`Config backups (`.json.bak` files)Created by `writeConfigFile()` on migrations
Sources: [src/config/config.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts#L1-L50)[src/config/paths.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/paths.ts#L1-L100)[src/commands/onboard-helpers.ts1-30](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-helpers.ts#L1-L30)[docs/help/faq.md91-96](https://github.com/openclaw/openclaw/blob/8873e13f/docs/help/faq.md#L91-L96)

---

## Minimal Config Example

If you bypass the onboarding wizard and want a minimal hand-written config:

```
{
  gateway: {
    mode: "local",
    auth: { mode: "token", token: "your-gateway-token-here" },
  },
  agents: {
    defaults: {
      model: "anthropic/claude-opus-4-6",
    },
  },
}
```

**Note:** The Zod schema validates all config fields at startup via `readConfigFileSnapshot()`. An invalid config file prevents the Gateway from starting. The schema enforces required fields, type constraints, and legacy field migrations.

For a complete example with channels and auth profiles, see the [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference).

Sources: [src/config/config.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts#L1-L100)[src/config/validation.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts#L1-L100)

---

## Next Steps
GoalWhere to goConnect WhatsApp, Telegram, Discord[Channels](/openclaw/openclaw/4-channels)Learn Gateway, Agent, Session concepts[Core Concepts](/openclaw/openclaw/1.2-core-concepts)Configure `openclaw.json` in detail[Configuration](/openclaw/openclaw/2.3-configuration-system)Understand the Gateway WebSocket protocol[WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol-and-rpc)Set up authentication and device pairing[Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing)Understand the agent execution pipeline[Agent Execution Pipeline](/openclaw/openclaw/3.1-agent-execution-pipeline)Run a security audit[Security Audit](/openclaw/openclaw/7.1-access-control-policies)

---

# Core-Concepts

# Core Concepts
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

This page defines the fundamental building blocks of OpenClaw's architecture. It covers the core entities you'll encounter when working with the system: Gateway, Agents, Channels, Sessions, Nodes, Skills, and Bindings.

For operational details about running the Gateway, see [Gateway Runbook](/openclaw/openclaw/2-gateway). For configuration reference, see [Configuration System](/openclaw/openclaw/2.3-configuration-system) and [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference).

---

## System Model Overview

OpenClaw operates as a **multi-layer agent orchestration platform** where a central Gateway process routes messages from various channels to AI agents, managing sessions, tools, and authentication along the way.

```
External Services

Execution Layer

Control Plane

Inbound Layer

WhatsApp
channels.whatsapp

Telegram
channels.telegram

Discord
channels.discord

Slack
channels.slack

WebChat
Control UI

Gateway
gateway.port: 18789
WebSocket + HTTP

Session Manager
session.dmScope
SessionKeyResolver

Routing Engine
bindings[]
resolveAgentRoute

Agent: main
agents.list[0]
workspace

Agent: work
agents.list[1]
workspace

Tool System
tools.profile
exec, read, write

Memory Backend
memory.backend
qmd or builtin

Model Providers
models.providers
auth.profiles

Docker Sandbox
agents.defaults.sandbox
```

**Sources:**[README.md185-202](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L185-L202)[docs/index.md59-70](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md#L59-L70)[src/config/zod-schema.ts162-800](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L162-L800)

---

## Gateway

The **Gateway** is the central control plane that runs as a single long-lived process. All communication flows through it via WebSocket and HTTP on a unified port (default `18789`).

### Responsibilities

1. **WebSocket protocol server** — Protocol v3 for clients, TUI, Control UI, and nodes
2. **Message routing** — Routes inbound messages to the correct agent session via `resolveAgentRoute`
3. **Session management** — Maintains conversation state using `SessionManager` and transcript files
4. **Channel coordination** — Manages lifecycle for all configured channel providers
5. **Configuration hot-reload** — Watches config file and applies changes (see `gateway.reload.mode`)
6. **Authentication** — Enforces `gateway.auth.mode` (token/password) and device pairing

### Key Configuration Fields
FieldPurposeDefault`gateway.port`WebSocket + HTTP listener port`18789``gateway.bind`Bind address (`loopback`, `lan`, `tailnet`, `custom`)`loopback``gateway.auth.mode`Authentication mode (`token` or `password`)Required when non-loopback`gateway.auth.token`Shared token for RPC access(required if mode=token)`gateway.reload.mode`Config reload behavior (`hybrid`, `hot`, `restart`, `off`)`hybrid`
**Lifecycle:** Typically runs as a systemd user unit (Linux) or LaunchAgent (macOS). Use `openclaw gateway status` to check health and `openclaw gateway --port 18789` to run in foreground.

```
loadConfig

WebSocket

RPC

RPC

Monitor

~/.openclaw/
openclaw.json

Gateway Process
gateway.port
WebSocket Server

Control UI
http://127.0.0.1:18789

CLI
openclaw gateway call

Nodes
iOS/Android/macOS

Channel Providers
TelegramMonitor
DiscordMonitor
```

**Sources:**[docs/gateway/index.md1-350](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md#L1-L350)[src/config/zod-schema.ts490-560](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L490-L560)[README.md186-202](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L186-L202)[package.json1-18](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L1-L18)

---

## Agents

An **Agent** is an isolated AI execution unit with its own workspace, model configuration, and session scope. Agents run the Pi agent runtime in embedded RPC mode.

### Agent Structure

Each agent is defined in `agents.list[]` and has:

- **`id`** — Unique identifier (e.g. `"main"`, `"work"`)
- **`workspace`** — Root directory for agent files (`AGENTS.md`, `SOUL.md`, `TOOLS.md`, skills)
- **Model configuration** — Primary model and fallbacks via `agents.defaults.model`
- **Tool policy** — Which tools are available (`tools.profile`, per-agent overrides)
- **Sandbox settings** — Isolation mode (`agents.defaults.sandbox.mode`)

### Execution Flow

Agent turns are orchestrated through a layered call stack:

1. **`runReplyAgent`** — Top-level dispatcher (handles typing indicators, memory flush)
2. **`runAgentTurnWithFallback`** — Error recovery and model fallback logic
3. **`runEmbeddedPiAgent`** — Retry/fallback across auth profiles and providers
4. **`runEmbeddedAttempt`** — Single turn execution (assembles tools, builds system prompt, streams model)

```
Inbound Message

runReplyAgent
Typing indicators

runAgentTurnWithFallback
Error recovery

runEmbeddedPiAgent
Retry + fallback logic

runEmbeddedAttempt
Session + tools + prompt

Pi Agent Runtime
@mariozechner/pi-agent-core

Model Provider API
OpenAI, Anthropic, etc.

Tool Execution
ToolRegistry
```

### Multi-Agent Routing

Use `bindings[]` to route channels/accounts to specific agents:

```
{
  agents: {
    list: [
      { id: "main", workspace: "~/.openclaw/workspace" },
      { id: "work", workspace: "~/.openclaw/workspace-work" }
    ]
  },
  bindings: [
    { agentId: "main", match: { channel: "whatsapp", accountId: "personal" } },
    { agentId: "work", match: { channel: "telegram" } }
  ]
}
```

**Sources:**[README.md130-136](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L130-L136)[docs/gateway/configuration.md302-323](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L302-L323)[CHANGELOG.md14-26](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L14-L26)[src/config/zod-schema.ts418-419](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L418-L419)

---

## Channels

**Channels** are messaging platform integrations that connect the Gateway to external services like WhatsApp, Telegram, Discord, and Slack.

### Channel Architecture

Each channel implements a **monitor provider pattern**:

- **Provider** — Long-lived connection to the platform (e.g. `TelegramMonitor`, `DiscordMonitor`)
- **Monitor lifecycle** — Start/stop/restart managed by Gateway
- **Access control** — `dmPolicy`, `groupPolicy`, `allowFrom`, pairing store
- **Native commands** — Platform-specific slash commands and interactions

### Built-in Channels
ChannelConfig KeyNotesWhatsApp`channels.whatsapp`Uses Baileys multi-deviceTelegram`channels.telegram`grammY bot frameworkDiscord`channels.discord`@buape/carbon clientSlack`channels.slack`Bolt SDKSignal`channels.signal`signal-cli integrationiMessage`channels.imessage`macOS-only legacyBlueBubbles`channels.bluebubbles`Recommended iMessage (any OS)WebChat(built-in)Control UI chat interface
### Access Control

Channels enforce DM and group policies before routing messages:

```
{
  channels: {
    telegram: {
      dmPolicy: "pairing",      // pairing | allowlist | open | disabled
      allowFrom: ["tg:123456"], // allowlist for allowlist/open modes
      groups: {
        "*": { requireMention: true }
      }
    }
  }
}
```

```
Pairing required

Allowed

Channel Event
TelegramMonitor

Access Control
dmPolicy check

Generate pairing code
Pairing store

Message Router
resolveAgentRoute

Agent Session
```

**Sources:**[docs/channels/index.md1-150](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/index.md#L1-L150)[README.md151-154](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L151-L154)[src/config/zod-schema.ts620-730](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L620-L730)[docs/gateway/configuration.md74-105](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L74-L105)

---

## Sessions

A **Session** is an isolated conversation context with its own transcript, state, and model usage tracking. Sessions are identified by a **session key** and persist to disk as JSONL transcript files.

### Session Key Structure

Session keys follow a hierarchical format:

- **`main`** — Shared main session (legacy default)
- **`agent:<agentId>:main`** — Agent-scoped main session
- **`agent:<agentId>:<channel>:dm:<peer>`** — DM session (per-channel-peer)
- **`agent:<agentId>:<channel>:group:<groupId>`** — Group session
- **`agent:<agentId>:<channel>:thread:<threadId>`** — Thread-bound session

### Session Scoping

The `session.dmScope` setting controls DM isolation:
`dmScope`Behavior`main`All DMs share one session (legacy)`per-peer`Separate session per peer, across channels`per-channel-peer`Separate session per channel + peer (recommended)`per-account-channel-peer`Separate per account + channel + peer
### Session Lifecycle

```
New Message

Resolve Session Key
SessionKeyResolver
session.dmScope

Load Session
readSessionFile
transcript.jsonl

Agent Turn Execution

Save Session
writeSessionFile

Session Reset
/reset command

Clear Transcript
Archive old

Daily Reset
session.reset.mode
```

### Session Tools

Agents can interact with sessions via tools:

- **`sessions_list`** — Discover active sessions
- **`sessions_history`** — Fetch transcript logs
- **`sessions_send`** — Message another session
- **`sessions_spawn`** — Create subagent (ACP)

**Sources:**[docs/concepts/session.md1-200](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/session.md#L1-L200)[README.md256-262](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L256-L262)[src/config/zod-schema.ts20-22](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L20-L22)[docs/gateway/configuration.md176-204](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L176-L204)

---

## Nodes

**Nodes** are paired devices (iOS, Android, macOS) that expose device-specific capabilities to agents via the Gateway protocol. Nodes authenticate using device pairing and respond to `node.invoke` RPC calls.

### Node Capabilities
CapabilityCommandNotesSystem exec`system.run`Bash execution (macOS only with approval)Notifications`system.notify`User notificationsCamera`camera.snap`, `camera.clip`Photo/video captureScreen recording`screen.record`Screen captureLocation`location.get`GPS coordinatesCanvas`canvas.push`, `canvas.reset`A2UI rendering
### Pairing Flow

```
Operator
Gateway
iOS/Android Node
Operator
Gateway
iOS/Android Node
device.pair.request(deviceId, capabilities)
Display pairing code
openclaw pairing approve <code>
device.pair.approved
Authenticated node.list/node.invoke calls
```

**Sources:**[docs/nodes/index.md1-200](https://github.com/openclaw/openclaw/blob/8873e13f/docs/nodes/index.md#L1-L200)[README.md158-162](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L158-L162)[docs/gateway/configuration.md1-100](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L1-L100)[apps/ios/Sources/Info.plist1-91](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L1-L91)[apps/android/app/build.gradle.kts1-169](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L1-L169)

---

## Skills

**Skills** are agent capabilities packaged as workspace files or npm-installed plugins. Skills inject prompt guidance and optional tools into the agent runtime.

### Skill Types

1. **Workspace skills** — `~/.openclaw/workspace/skills/<name>/SKILL.md`
2. **Bundled skills** — Shipped with OpenClaw distribution
3. **Managed skills** — Installed from ClawHub registry

### Skill Configuration

```
{
  skills: {
    enabled: true,
    bundled: { enabled: true },
    managed: {
      enabled: true,
      clawhub: { enabled: true, url: "https://clawhub.com" }
    },
    entries: {
      "diffs": { enabled: true }
    }
  }
}
```

### Skill Loading

Skills are discovered and loaded during agent turn execution:

1. **Workspace scan** — Load `skills/*/SKILL.md` from agent workspace
2. **Bundled/managed** — Load from OpenClaw distribution or npm packages
3. **Tool provisioning** — Skills can register tools via plugin hooks
4. **Prompt injection** — `SKILL.md` content is injected into system prompt

```
Agent Workspace
~/.openclaw/workspace

Skill Scanner
listSkillCommandsForAgents

SKILL.md Files

System Prompt Builder

Plugin SDK
plugin hooks

Tool Registry
ToolsSchema

Agent Turn
```

**Sources:**[README.md312-318](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L312-L318)[docs/tools/skills.md1-200](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/skills.md#L1-L200)[src/config/zod-schema.ts140-148](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L140-L148)[CHANGELOG.md77-78](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L77-L78)

---

## Bindings

**Bindings** define routing rules that map inbound messages to specific agents based on channel, account, peer, or thread criteria.

### Binding Structure

Each binding in `bindings[]` specifies:

- **`agentId`** — Target agent identifier
- **`match`** — Matching criteria (channel, accountId, peerId, threadId)
- **Priority** — Bindings are evaluated in order; first match wins

### Example Configuration

```
{
  bindings: [
    // Route personal WhatsApp to main agent
    {
      agentId: "main",
      match: { channel: "whatsapp", accountId: "personal" }
    },
    // Route all Telegram to work agent
    {
      agentId: "work",
      match: { channel: "telegram" }
    },
    // Route specific Discord thread to a dedicated agent
    {
      agentId: "support",
      match: { channel: "discord", threadId: "123456" }
    }
  ]
}
```

### Routing Resolution

The Gateway uses `resolveAgentRoute` to determine which agent handles a message:

```
Match found

No match

Inbound Message
channel + accountId + peerId + threadId

Bindings Resolver
resolveAgentRoute

Check each binding
in order

Route to agentId

Route to default agent
agents.defaults or first in list
```

**Persistent bindings** are stored for ACP sessions and Discord threads to maintain session continuity across restarts.

**Sources:**[docs/gateway/configuration.md302-323](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L302-L323)[CHANGELOG.md16-17](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L16-L17)[src/config/zod-schema.ts420](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L420-L420)

---

## Configuration Model

OpenClaw reads configuration from `~/.openclaw/openclaw.json` (JSON5 format) and validates it against a strict Zod schema.

### Configuration Pipeline

```
openclaw.json5
JSON5 with comments

JSON5 Parser
json5.parse

$include files
agents.json5

Zod Validation
OpenClawSchema.parse

Secret Resolver
SecretRef resolution

Runtime Config Snapshot
getRuntimeConfigSnapshot

Gateway Runtime
```

### Top-Level Schema Structure
KeyTypePurpose`gateway``GatewaySchema`Port, bind, auth, reload settings`agents``AgentsSchema`Agent list, defaults, workspace`channels``ChannelsSchema`Channel-specific configurations`session``SessionSchema`Session scoping, reset, bindings`tools``ToolsSchema`Tool policy and configuration`models``ModelsConfigSchema`Model catalog and providers`bindings``BindingsSchema`Multi-agent routing rules`skills``SkillsSchema`Skill discovery and management`memory``MemorySchema`Memory backend (qmd or builtin)`cron``CronSchema`Scheduled job configuration`hooks``HooksSchema`Webhook and hook mappings
### Hot Reload

The Gateway watches the config file and applies changes automatically based on `gateway.reload.mode`:

- **`hybrid`** (default) — Hot-applies safe changes; restarts for critical ones
- **`hot`** — Only hot-applies; logs warnings for restart-required changes
- **`restart`** — Restarts on any config change
- **`off`** — No file watching

**Sources:**[docs/gateway/configuration.md1-500](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L1-L500)[src/config/zod-schema.ts162-800](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L162-L800)[src/config/types.ts1-36](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts#L1-L36)[src/config/config.ts1-24](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts#L1-L24)

---

# Gateway

# Gateway
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [apps/macos/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClawProtocol/GatewayModels.swift)
- [apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/experiments/onboarding-config-protocol.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/experiments/onboarding-config-protocol.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/protocol-gen-swift.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/protocol-gen-swift.ts)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/openclaw-gateway-tool.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/openclaw-gateway-tool.test.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/agents/tools/gateway-tool.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/gateway-tool.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/schema.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.test.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [src/discord/monitor/thread-bindings.shared-state.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/thread-bindings.shared-state.test.ts)
- [src/gateway/method-scopes.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.test.ts)
- [src/gateway/method-scopes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.ts)
- [src/gateway/protocol/index.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts)
- [src/gateway/protocol/schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema.ts)
- [src/gateway/protocol/schema/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/config.ts)
- [src/gateway/protocol/schema/protocol-schemas.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/protocol-schemas.ts)
- [src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/types.ts)
- [src/gateway/server-methods-list.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods-list.ts)
- [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts)
- [src/gateway/server-methods/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/config.ts)
- [src/gateway/server-methods/restart-request.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/restart-request.ts)
- [src/gateway/server-methods/update.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/update.ts)
- [src/gateway/server.config-patch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.config-patch.test.ts)
- [src/gateway/server.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

## Purpose and Scope

The Gateway is OpenClaw's **central control plane** — a single process that manages WebSocket and HTTP communication, routes messages between channels and agents, handles sessions and configuration, and coordinates all system components. It runs as a daemon service (launchd on macOS, systemd on Linux/WSL2) and serves as the unified access point for clients (CLI, Control UI, mobile nodes), channels (Telegram, WhatsApp, Discord, etc.), and the agent execution engine.

This page covers the Gateway server implementation, protocol, configuration system, authentication, and service lifecycle. For related topics:

- **WebSocket protocol specification**: See [WebSocket Protocol & RPC](/openclaw/openclaw/2.1-websocket-protocol-and-rpc)
- **Authentication and device pairing flows**: See [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing)
- **Configuration reference and hot reload**: See [Configuration System](/openclaw/openclaw/2.3-configuration-system)
- **Session routing and isolation**: See [Session Management](/openclaw/openclaw/2.4-session-management)
- **Service installation and diagnostics**: See [Service Lifecycle & Diagnostics](/openclaw/openclaw/2.5-service-lifecycle-and-diagnostics)

---

## Architecture Overview

The Gateway operates as a unified server that exposes:

1. **WebSocket endpoint** (protocol v3) for real-time bidirectional communication with clients
2. **HTTP endpoints** for Control UI, webhooks, health checks, and REST-style operations
3. **RPC method layer** that handles 50+ methods across config, sessions, agents, channels, cron, and tools
4. **Configuration system** that validates and hot-reloads `~/.openclaw/openclaw.json`
5. **Session management** that tracks conversation state and routes messages to agents

**Gateway as Central Control Plane**

```
Agent Execution

Channel Monitors

Gateway Server

Client Layer

WS protocol v3

WS + HTTP

WS

WS + device pairing

CLI
(openclaw ...)

Control UI
(browser)

macOS App

iOS/Android Nodes

WebSocket Server
startGatewayServer()

HTTP Server
Express

RPC Method Dispatcher
handleInboundRequest()

Configuration Manager
loadConfig()

Session Manager
sessions.json

Telegram Monitor

WhatsApp Monitor

Discord Monitor

...

runReplyAgent()

Pi Agent (RPC)
```

Sources: [Diagram 1 (system architecture)](https://github.com/openclaw/openclaw/blob/8873e13f/Diagram 1 (system architecture))[src/gateway/server.impl.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.impl.ts#L1-L500)[README.md186-202](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L186-L202)

---

## Server Implementation

The Gateway server is implemented in [src/gateway/server.impl.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.impl.ts) and exports the `startGatewayServer()` function, which:

1. Validates configuration via Zod schemas
2. Starts the WebSocket server (using `ws` library)
3. Starts the HTTP server (using Express)
4. Initializes channel monitors (Telegram, WhatsApp, Discord, etc.)
5. Sets up hot reload watchers for `openclaw.json`
6. Registers RPC method handlers via `handleInboundRequest()`

**Key Entry Points**
FunctionFilePurpose`startGatewayServer()`[src/gateway/server.impl.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.impl.ts)Main server startup; returns teardown callback`handleInboundRequest()`[src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts)Dispatches RPC frames to method handlers`loadConfig()`[src/config/io.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts)Loads and validates `openclaw.json` with Zod`buildProgram()`[src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)CLI entry point that invokes `startGatewayServer()` for `openclaw gateway`
**Server Startup Sequence**

```
Config Watcher
Channel Monitors
Express HTTP
WebSocket Server
loadConfig()
startGatewayServer()
CLI Entry
buildProgram()
Config Watcher
Channel Monitors
Express HTTP
WebSocket Server
loadConfig()
startGatewayServer()
CLI Entry
buildProgram()
On file change:
1. Parse JSON5
2. Validate schema
3. Hot-apply or restart
invoke via gateway command
loadConfig()
validate with Zod
OpenClawConfig object
create WebSocket server
port from config.gateway.port
create Express app
serve Control UI
start monitors
(Telegram, WhatsApp, etc.)
watch openclaw.json
mode = config.gateway.reload.mode
teardown callback
```

Sources: [src/gateway/server.impl.ts100-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.impl.ts#L100-L300)[src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)[src/config/io.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L1-L200)

**Port and Bind Configuration**

The Gateway binds to a port and address specified in config:

```
{
  gateway: {
    port: 18789,           // default WebSocket/HTTP port
    bind: "loopback",      // loopback | lan | tailnet | auto | custom
    // custom mode requires explicit host:
    host: "192.168.1.100", // only for bind="custom"
  }
}
```

- **Loopback** (`127.0.0.1`): Default; only local clients can connect
- **LAN** (`0.0.0.0`): Listens on all interfaces; requires firewall configuration
- **Tailnet**: Uses Tailscale Serve/Funnel for secure remote access
- **Auto**: Detects Tailscale presence and falls back to loopback

Sources: [docs/gateway/configuration.md1-100](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L1-L100)[src/config/types.gateway.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.gateway.ts)

---

## Protocol (v3)

The Gateway uses **protocol version 3** for all WebSocket communication. Clients and the server exchange three frame types: `request`, `response`, and `event`.

**Frame Types**
Frame TypeDirectionSchemaPurpose`request`Client → Gateway`RequestFrame`Invoke an RPC method`response`Gateway → Client`ResponseFrame`Return method result or error`event`Gateway → Client`EventFrame`Push state changes (sessions, chat deltas, etc.)
**RequestFrame Structure**

```
{
  type: "request",
  id: "unique-request-id",        // client-generated UUID
  method: "chat.send",             // RPC method name
  params: { sessionKey: "...", ... } // method-specific parameters
}
```

**ResponseFrame Structure**

```
{
  type: "response",
  id: "matching-request-id",
  ok: true,                        // true = success, false = error
  payload: { ... },                // result when ok=true
  error: {                         // error shape when ok=false
    code: "INVALID_REQUEST",
    message: "...",
    retryAfterMs: 5000             // optional rate-limit backoff
  }
}
```

**EventFrame Structure**

```
{
  type: "event",
  event: "chat:delta",             // event name
  seq: 123,                        // monotonic sequence number
  payload: { sessionKey: "...", content: "..." },
  stateVersion: { sessions: 45 }   // optional state version
}
```

**Error Codes**

Standard error codes are defined in [src/gateway/protocol/schema/error-codes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/error-codes.ts):

- `NOT_LINKED`: Client not authenticated
- `NOT_PAIRED`: Device pairing required
- `AGENT_TIMEOUT`: Agent execution exceeded timeout
- `INVALID_REQUEST`: Malformed request or missing required fields
- `UNAVAILABLE`: Rate-limited or temporarily unavailable (includes `retryAfterMs`)

Sources: [src/gateway/protocol/schema/frames.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/frames.ts)[src/gateway/protocol/schema/error-codes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/error-codes.ts)[apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift1-220](https://github.com/openclaw/openclaw/blob/8873e13f/apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift#L1-L220)

**Protocol Handshake**

```
Gateway
Client
Gateway
Client
Client is now linked
alt
[Authentication success]
[Authentication failure]
WebSocket connect
connection established
request: "connect"
params: { minProtocol: 3, maxProtocol: 3, ... }
validate protocol version
authenticate (token/password)
response: HelloOk
{ protocol: 3, snapshot: {...}, features: {...} }
response: error
{ code: "NOT_LINKED", message: "..." }
close WebSocket
```

Sources: [src/gateway/protocol/schema/types.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/types.ts#L1-L100)[src/gateway/server-methods/connect.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/connect.ts)

---

## Configuration System

Configuration lives in `~/.openclaw/openclaw.json` (JSON5 format with comments and trailing commas). The Gateway validates config on startup and whenever the file changes, using **Zod schemas** defined in [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)

**Configuration Loading Pipeline**

```
openclaw.json
(JSON5)

parseConfigJson5()

resolveSecrets()

validateConfigObject()

RuntimeConfigSnapshot

Gateway Server

Channel Monitors

Agent Runtime
```

Sources: [src/config/io.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L1-L300)[src/config/validation.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts)

**Hot Reload**

The Gateway watches `openclaw.json` and applies changes automatically based on `gateway.reload.mode`:
ModeBehavior`hybrid` (default)Hot-apply safe changes; auto-restart for critical fields`hot`Hot-apply only; log warning for restart-required changes`restart`Always restart on any config change`off`No file watching; manual restart required
**Hot-Reloadable Fields**

Most config fields hot-apply without downtime:

- ✅ `channels.*` (all channel configs)
- ✅ `agents`, `models`, `tools`, `session`, `messages`
- ✅ `hooks`, `cron`, `browser`, `skills`
- ❌ `gateway.port`, `gateway.bind`, `gateway.auth` (require restart)
- ❌ `discovery`, `canvasHost`, `plugins` (require restart)

Sources: [docs/gateway/configuration.md348-388](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L348-L388)[src/config/io.ts200-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L200-L400)

**SecretRef Pattern**

Sensitive values (API keys, tokens, passwords) can be stored as **SecretRefs** instead of plaintext:

```
{
  channels: {
    telegram: {
      botToken: { $ref: { env: "TELEGRAM_BOT_TOKEN" } }
    }
  },
  gateway: {
    auth: {
      token: { $ref: { file: "~/.openclaw/gateway-token.txt" } }
    }
  }
}
```

SecretRef types:

- `env`: Read from environment variable
- `file`: Read from file path
- `exec`: Execute command and capture stdout

Sources: [src/config/zod-schema.core.ts10-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.core.ts#L10-L50)[src/config/types.secrets.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.secrets.ts)

---

## Session Management

Sessions track conversation state and route messages to the correct agent. Each session has a **session key** that encodes scope, agent, and delivery context.

**Session Key Format**

```
agent:<agentId>:<scope>:<identifiers>

```

Examples:

- `agent:main:main` — default main session
- `agent:main:whatsapp:dm:+15555550123` — WhatsApp DM with specific peer
- `agent:work:discord:guild:123:channel:456` — Discord channel in multi-agent setup

**Session Isolation (dmScope)**

The `session.dmScope` setting controls per-sender isolation:
dmScopeBehavior`main`All DMs share one session`per-peer`Each sender gets isolated session`per-channel-peer`Isolated by channel + sender`per-account-channel-peer`Isolated by account + channel + sender
Sources: [src/config/zod-schema.session.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.session.ts)[docs/gateway/configuration.md178-204](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L178-L204)

**Session State Persistence**

Sessions are stored in `~/.openclaw/sessions.json` with fields:

```
{
  sessionKey: string;
  agentId: string;
  workspace: string;
  model?: string;              // per-session model override
  thinkingLevel?: string;      // per-session thinking level
  totalTokens?: number;        // accumulated usage
  deliveryContext?: { ... };   // routing metadata (channel, peer, etc.)
}
```

Transcripts are written to `~/.openclaw/transcripts/<sessionKey>.jsonl` as append-only JSONL.

Sources: [src/gateway/session-utils.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/session-utils.types.ts)[docs/concepts/session.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/session.md)

---

## Authentication & Authorization

The Gateway supports two authentication modes:

1. **Token mode** (`gateway.auth.mode: "token"`) — clients provide a shared secret token
2. **Password mode** (`gateway.auth.mode: "password"`) — clients authenticate with username/password

**Token Authentication Flow**

```
Config
(gateway.auth.token)
Gateway
Client
Config
(gateway.auth.token)
Gateway
Client
alt
[Token matches]
[Token mismatch or
missing]
connect frame
auth: { token: "..." }
resolve token
(plaintext or SecretRef)
HelloOk
(authenticated)
error: NOT_LINKED
close connection
```

Sources: [src/gateway/server-methods/connect.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/connect.ts)[docs/gateway/configuration.md420-450](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L420-L450)

**Role-Based Access Control**

The Gateway assigns **roles** to clients based on authentication:
RoleScopesAccess Level`operator``admin`, `agent`, `config`, `sessions`, ...Full admin access`node``nodes`, `agent` (limited)Device node access`user``chat`, `sessions` (read-only)Chat-only access
Methods are protected by **scope requirements** defined in [src/gateway/method-scopes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.ts):

```
const ADMIN_SCOPE = "admin";
 
const METHOD_SCOPES: Record<string, string[]> = {
  "config.apply": [ADMIN_SCOPE],
  "config.patch": [ADMIN_SCOPE],
  "gateway.restart": [ADMIN_SCOPE],
  "sessions.delete": [ADMIN_SCOPE],
  "chat.send": ["chat"],
  // ...
};
```

Sources: [src/gateway/method-scopes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.ts)[src/gateway/role-policy.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/role-policy.ts)

**Control Plane Rate Limiting**

Write operations (`config.apply`, `config.patch`, `update.run`) are rate-limited to **3 requests per 60 seconds** per `(deviceId, clientIp)` pair. Exceeded requests return `UNAVAILABLE` with `retryAfterMs`.

Sources: [src/gateway/control-plane-rate-limit.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/control-plane-rate-limit.ts)[docs/gateway/configuration.md389-412](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L389-L412)

---

## Service Lifecycle

The Gateway runs as a **user daemon** installed via `openclaw onboard --install-daemon` or `openclaw gateway install`:

- **macOS**: LaunchAgent at `~/Library/LaunchAgents/ai.openclaw.gateway.plist`
- **Linux/WSL2**: systemd user unit at `~/.config/systemd/user/openclaw-gateway.service`

**Daemon Management Commands**
CommandAction`openclaw gateway install`Install daemon service`openclaw gateway start`Start the Gateway`openclaw gateway stop`Stop the Gateway`openclaw gateway restart`Restart the Gateway`openclaw gateway status`Check runtime status + RPC probe`openclaw gateway uninstall`Remove daemon service
Sources: [src/cli/program/build-program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program/build-program.ts)[docs/cli/gateway.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/gateway.md)

**Health Checks**

```
# Check if Gateway is running and responding
openclaw gateway status
 
# Probe health endpoint (HTTP)
curl http://127.0.0.1:18789/health
 
# Check logs
openclaw logs --follow
```

Health check logic validates:

1. Process is running (via PID file or system query)
2. WebSocket port is bound and accepting connections
3. RPC probe succeeds (sends `ping` request, expects `pong` response)

Sources: [src/gateway/health.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/health.ts)[src/cli/program/gateway/status.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program/gateway/status.ts)

**Restart Management**

When config changes require a restart (e.g., `gateway.port` update), the Gateway:

1. Writes a **restart sentinel** file to `~/.openclaw/restart.sentinel.json` with metadata (reason, timestamp, session key for wake-up ping)
2. Shuts down the server gracefully
3. Daemon supervisor (launchd/systemd) automatically restarts the process
4. On startup, Gateway reads the sentinel, sends a wake-up ping to the specified session, and cleans up the sentinel

Sources: [src/infra/restart-sentinel.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/restart-sentinel.ts)[src/gateway/server-methods/config.ts200-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/config.ts#L200-L400)

**Diagnostics: `openclaw doctor`**

The `doctor` command performs automated health checks and repairs:

- ✅ Validates `openclaw.json` against schema
- ✅ Checks for legacy config keys and auto-migrates
- ✅ Verifies daemon installation and runtime status
- ✅ Probes Gateway RPC availability
- ✅ Scans for security misconfigurations (open DM policies, missing auth, etc.)
- ✅ Repairs file permissions and missing directories

Run with `--fix` or `--yes` to apply automatic repairs.

Sources: [src/cli/program/doctor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program/doctor.ts)[docs/cli/doctor.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/doctor.md)

---

## RPC Methods

The Gateway exposes **50+ RPC methods** organized into categories. Methods are dispatched via `handleInboundRequest()` in [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts)

**Method Categories**
CategoryMethodsPurpose`connect.*``connect`Initial handshake and authentication`chat.*``send`, `inject`, `abort`, `history`Send messages, abort runs, fetch history`sessions.*``list`, `get`, `reset`, `delete`, `patch`, `spawn`Session CRUD and management`agent.*``identity`, `wait`Agent metadata and synchronization`agents.*``list`, `create`, `update`, `delete`, `files.*`Multi-agent management`config.*``get`, `schema`, `apply`, `patch`, `set`Configuration read/write`models.*``list`, `status`, `auth.*`, `scan`Model catalog and auth profiles`channels.*``status`, `logout`, `talk.config`Channel runtime status`cron.*``list`, `add`, `update`, `remove`, `run`, `runs`, `status`Cron job management`devices.*``list`, `pair.*`, `token.*`Device pairing and token management`nodes.*``list`, `describe`, `invoke`Node capability discovery and invocation`browser.*``status`, `start`, `stop`, `tabs`, `navigate`, ...Browser control (20+ methods)`gateway.*``restart`, `status`, `health`, `reload`, `update`Gateway lifecycle`exec.approvals.*``get`, `set`, `request`, `resolve`Command approval workflows`secrets.*``reload`, `status`Secret resolution and status`push.*``subscribe`Push notification registration
**Invoking Methods via CLI**

```
# Generic RPC call
openclaw gateway call <method> --params '{ ... }'
 
# Examples
openclaw gateway call config.get --params '{}'
openclaw gateway call chat.send --params '{"sessionKey":"agent:main:main","content":"Hello"}'
openclaw gateway call sessions.list --params '{}'
```

Sources: [src/gateway/server-methods-list.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods-list.ts)[src/gateway/server-methods.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L1-L100)[docs/cli/gateway.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/gateway.md)

**Method Handler Registration**

Handlers are organized in `src/gateway/server-methods/<category>.ts` files and registered in [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts):

```
export const METHOD_HANDLERS: Record<string, MethodHandler> = {
  ...connectHandlers,
  ...chatHandlers,
  ...sessionsHandlers,
  ...agentHandlers,
  ...agentsHandlers,
  ...configHandlers,
  ...cronHandlers,
  ...devicesHandlers,
  ...browserHandlers,
  // ...
};
```

Each handler receives:

- `params`: Validated method parameters
- `ctx`: Request context (clientId, role, scopes, deviceId, IP address)
- `server`: Gateway server instance (config, sessions, etc.)

Sources: [src/gateway/server-methods.ts50-150](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L50-L150)[src/gateway/server-methods/chat.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/chat.ts)[src/gateway/server-methods/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/config.ts)

---

## Code Entity Reference

**Key Files and Functions**
EntityFilePurpose`startGatewayServer()`[src/gateway/server.impl.ts100-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.impl.ts#L100-L500)Main server entry point`handleInboundRequest()`[src/gateway/server-methods.ts200-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L200-L300)RPC method dispatcher`loadConfig()`[src/config/io.ts50-150](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L50-L150)Load and validate `openclaw.json``validateConfigObjectWithPlugins()`[src/config/validation.ts100-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts#L100-L200)Zod validation with plugin schema merging`OpenClawSchema`[src/config/zod-schema.ts162-700](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L162-L700)Root Zod schema for config`METHOD_HANDLERS`[src/gateway/server-methods.ts50-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L50-L100)RPC method registry`ErrorCodes`[src/gateway/protocol/schema/error-codes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/error-codes.ts)Standard error code enum`RequestFrame`[src/gateway/protocol/schema/frames.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/frames.ts)WebSocket request frame schema`ResponseFrame`[src/gateway/protocol/schema/frames.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/frames.ts)WebSocket response frame schema`EventFrame`[src/gateway/protocol/schema/frames.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/frames.ts)WebSocket event frame schema`ConnectParams`[src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/types.ts)Handshake parameters`HelloOk`[src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/types.ts)Handshake success response`SessionsPatchResult`[src/gateway/session-utils.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/session-utils.types.ts)Session update result type`buildProgram()`[src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)CLI program builder (Commander.js)
**Configuration Types**
TypeFilePurpose`OpenClawConfig`[src/config/types.openclaw.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.openclaw.ts)Root config type (inferred from Zod)`GatewayConfig`[src/config/types.gateway.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.gateway.ts)`config.gateway` section`ChannelsConfig`[src/config/types.channels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.channels.ts)`config.channels` section`AgentsConfig`[src/config/types.agents.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agents.ts)`config.agents` section`SessionConfig`[src/config/types.base.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.base.ts)`config.session` section`SecretInput`[src/config/types.secrets.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.secrets.ts)SecretRef input type (plaintext or `$ref`)
**Protocol Schema Exports**

All protocol schemas are exported from [src/gateway/protocol/index.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts) and re-exported to Swift in [apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift) and [apps/macos/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClawProtocol/GatewayModels.swift)

Sources: [src/gateway/server.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.ts)[src/gateway/protocol/index.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts#L1-L300)[src/config/types.ts1-40](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts#L1-L40)

---

# WebSocket-Protocol-&-RPC

# WebSocket Protocol & RPC
Relevant source files
- [apps/macos/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClawProtocol/GatewayModels.swift)
- [apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift)
- [docs/experiments/onboarding-config-protocol.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/experiments/onboarding-config-protocol.md)
- [scripts/protocol-gen-swift.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/protocol-gen-swift.ts)
- [src/agents/openclaw-gateway-tool.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/openclaw-gateway-tool.test.ts)
- [src/agents/tools/gateway-tool.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/gateway-tool.ts)
- [src/config/schema.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.test.ts)
- [src/discord/monitor/thread-bindings.shared-state.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/thread-bindings.shared-state.test.ts)
- [src/gateway/method-scopes.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.test.ts)
- [src/gateway/method-scopes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.ts)
- [src/gateway/protocol/index.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts)
- [src/gateway/protocol/schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema.ts)
- [src/gateway/protocol/schema/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/config.ts)
- [src/gateway/protocol/schema/protocol-schemas.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/protocol-schemas.ts)
- [src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/types.ts)
- [src/gateway/server-methods-list.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods-list.ts)
- [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts)
- [src/gateway/server-methods/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/config.ts)
- [src/gateway/server-methods/restart-request.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/restart-request.ts)
- [src/gateway/server-methods/update.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/update.ts)
- [src/gateway/server.config-patch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.config-patch.test.ts)
- [src/gateway/server.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.ts)

This page documents the Gateway WebSocket protocol and RPC layer: frame types, connection handshake, request/response semantics, method authorization, server-push event semantics, protocol versioning, and the complete method and event reference.

Authentication mechanisms (token, password, Tailscale, device keypairs) are covered in [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing). Gateway configuration (`openclaw.json`) is in [Configuration](/openclaw/openclaw/2.3-configuration-system). The HTTP surface (`POST /tools/invoke`) is a separate channel and is not part of this protocol.

---

## Transport

The Gateway listens on `ws://127.0.0.1:18789` by default. TLS (`wss://`) is supported for remote access. All messages are **text frames carrying UTF-8 JSON**. Binary frames are not used.

Size limits enforced server-side are defined in `src/gateway/server-constants.ts` as `MAX_PAYLOAD_BYTES` (max inbound message size) and `MAX_BUFFERED_BYTES` (max write-queue backpressure before a slow-client close). The client sets `maxPayload: 25 * 1024 * 1024` (25 MiB) to accommodate large node canvas snapshots.

Sources: [src/gateway/client.ts139-141](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L139-L141)[src/gateway/server/ws-connection/message-handler.ts65](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server/ws-connection/message-handler.ts#L65-L65)

---

## Protocol Version

`PROTOCOL_VERSION` is exported from `src/gateway/protocol/index.ts` (currently `3`). Every `connect` request carries `minProtocol` and `maxProtocol`. The server rejects a connection when:

```
maxProtocol < PROTOCOL_VERSION  OR  minProtocol > PROTOCOL_VERSION

```

A version mismatch causes WebSocket close code `1002` with reason `"protocol mismatch"` and an error response carrying `details: { expectedProtocol: PROTOCOL_VERSION }`.

Sources: [src/gateway/protocol/index.ts159](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts#L159-L159)[src/gateway/server/ws-connection/message-handler.ts435-450](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server/ws-connection/message-handler.ts#L435-L450)

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

Sources: [src/gateway/protocol/schema/frames.ts1-120](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/frames.ts#L1-L120)[src/gateway/protocol/index.ts241-244](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts#L241-L244)
FrameDirectionValidatorKey Fields`RequestFrame`Client → Server`validateRequestFrame``type: "req"`, `id`, `method`, `params?``ResponseFrame`Server → Client`validateResponseFrame``type: "res"`, `id`, `ok`, `payload?`, `error?``EventFrame`Server → Client`validateEventFrame``type: "event"`, `event`, `payload?`, `seq?`
Sources: [src/gateway/protocol/index.ts241-244](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts#L241-L244)

---

## Connection Handshake

The first message a client sends **must** be a `connect` request. Before the client can send that request, the server emits a `connect.challenge` event. The `nonce` from that event must be included in the `connect` request (and in the device signature if device auth is used).

**Handshake sequence:**

```

```

Sources: [src/gateway/client.ts356-368](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L356-L368)[src/gateway/server/ws-connection/message-handler.ts364-406](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server/ws-connection/message-handler.ts#L364-L406)

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

Sources: [src/gateway/server/ws-connection/message-handler.ts91](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server/ws-connection/message-handler.ts#L91-L91)[src/gateway/server/ws-connection/message-handler.ts654-676](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server/ws-connection/message-handler.ts#L654-L676)

### ConnectParams

The `connect` method's parameter schema is `ConnectParamsSchema` in `src/gateway/protocol/schema/frames.ts`. The client builds and sends this via `GatewayClient.sendConnect()`.
FieldTypeNotes`minProtocol``number`Minimum protocol version the client supports`maxProtocol``number`Maximum protocol version the client supports`client.id``string`Well-known client identifier (e.g. `"cli"`, `"control-ui"`, `"node-host"`)`client.version``string`Client software version`client.platform``string`OS platform string (e.g. `"macos"`, `"ios"`, `"linux"`)`client.mode``string`Operational mode (e.g. `"cli"`, `"webchat"`, `"node"`)`client.displayName?``string`Human-readable name shown in presence list`client.instanceId?``string`Unique instance UUID for presence tracking`role``"operator"` | `"node"`Requested connection role`scopes``string[]`Requested operator scopes (e.g. `["operator.admin"]`)`caps``string[]`Declared client capabilities`commands?``string[]`Node role only: declared executable command names`auth?``object``{ token?, deviceToken?, password? }``device?``object``{ id, publicKey, signature, signedAt, nonce }` — device keypair identity`permissions?``object`Capability key/boolean map`pathEnv?``string`PATH override (node role)
Sources: [src/gateway/client.ts266-318](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L266-L318)[src/gateway/server/ws-connection/message-handler.ts408-466](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server/ws-connection/message-handler.ts#L408-L466)

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
Sources: [src/gateway/client.ts321-338](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L321-L338)[docs/gateway/protocol.md69-100](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/protocol.md#L69-L100)

---

## RPC Architecture

### Request / Response Flow

Every RPC call uses a `RequestFrame` with a caller-generated UUID `id`. The server sends back a matching `ResponseFrame`. The full request lifecycle includes validation, authorization, rate limiting, handler dispatch, and response serialization.

**RPC request processing pipeline:**

```
Unauthorized

Rate limited

Invalid params

GatewayClient
.request()

validateRequestFrame
AJV schema validation

authorizeGatewayMethod()
Role + scope check

Control Plane Rate Limit
3 per 60s for write methods

Resolve handler from
coreGatewayHandlers or
extraHandlers

Method-specific param validation
e.g. validateSessionsListParams

Handler execution
e.g. sessionsHandlers['sessions.list']

respond(ok, payload, error)

Send ResponseFrame

Send error response
code: INVALID_REQUEST

Send error response
code: UNAVAILABLE
retryable: true

Send error response
code: INVALID_REQUEST
```

Sources: [src/gateway/server-methods.ts98-155](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L98-L155)[src/gateway/server/ws-connection/message-handler.ts236-262](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server/ws-connection/message-handler.ts#L236-L262)

**Client-side request tracking:**

```
// Request
{ "type": "req", "id": "550e8400-e29b-41d4-a716-446655440000", "method": "sessions.list", "params": {} }
 
// Success
{ "type": "res", "id": "550e8400-e29b-41d4-a716-446655440000", "ok": true, "payload": { "sessions": [...] } }
 
// Failure
{ "type": "res", "id": "550e8400-e29b-41d4-a716-446655440000", "ok": false, "error": { "code": "INVALID_REQUEST", "message": "missing scope: operator.read" } }
```

`GatewayClient` maintains a `pending` map keyed by request `id`. When a `ResponseFrame` arrives, the corresponding `Promise` is resolved or rejected.

Sources: [src/gateway/client.ts496-520](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L496-L520)

### Method Authorization

All RPC methods (except `health` and `connect`) require authorization based on the connection's `role` and `scopes`. The `authorizeGatewayMethod()` function enforces these rules before handler dispatch.

**Authorization flow:**

```
No

Yes

Yes

No

No

Yes

Yes

No

Yes

No

Allowed

Denied

authorizeGatewayMethod(method, client)

client.connect
exists?

Return error:
NOT_LINKED

method === 'health'?

Return null
(allowed)

parseGatewayRole(role)

isRoleAuthorizedForMethod(role, method)?

Return error:
unauthorized role

role === 'node'?

scopes includes
operator.admin?

authorizeOperatorScopesForMethod(method, scopes)

Return error:
missing scope
```

Sources: [src/gateway/server-methods.ts38-65](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L38-L65)[src/gateway/method-scopes.ts187-205](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.ts#L187-L205)

**Role and scope hierarchy:**
RoleScopeMethods Allowed`operator``operator.admin`All methods`operator``operator.read`Read-only methods (e.g., `health`, `sessions.list`, `config.get`)`operator``operator.write`Write methods (e.g., `send`, `agent`, `chat.send`)`operator``operator.approvals`Exec approval methods (e.g., `exec.approval.resolve`)`operator``operator.pairing`Device/node pairing methods (e.g., `node.pair.approve`)`node`N/ANode-specific methods (e.g., `node.invoke.result`, `node.event`)
The scope classification is defined in `METHOD_SCOPE_GROUPS` and `ADMIN_METHOD_PREFIXES` in `src/gateway/method-scopes.ts`. Methods prefixed with `config.`, `wizard.`, `update.`, or `exec.approvals.` automatically require `operator.admin`.

Sources: [src/gateway/method-scopes.ts29-148](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.ts#L29-L148)

### Rate Limiting

Control plane write methods (`config.apply`, `config.patch`, `update.run`) are rate-limited to prevent abuse. The `CONTROL_PLANE_WRITE_METHODS` set in `src/gateway/server-methods.ts` defines which methods are subject to the limit. The rate limit is 3 requests per 60 seconds per client, enforced by `consumeControlPlaneWriteBudget()`.

When rate-limited, the server returns an error with:

- `code: "UNAVAILABLE"`
- `retryable: true`
- `retryAfterMs: <milliseconds until limit resets>`

Sources: [src/gateway/server-methods.ts37-132](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L37-L132)

### Handler Dispatch

RPC method handlers are organized by subsystem in `src/gateway/server-methods/*.ts` and aggregated in `coreGatewayHandlers`. Channel plugins can inject additional handlers via `extraHandlers`. The `handleGatewayRequest()` function resolves the handler from these sources and invokes it within a plugin runtime request scope.

**Handler organization:**

```
handleGatewayRequest()

coreGatewayHandlers

extraHandlers
(channel plugins)

connectHandlers
connect

healthHandlers
health, doctor.*

agentHandlers
agent, agent.wait

sessionsHandlers
sessions.*

configHandlers
config.*

cronHandlers
cron.*

nodeHandlers
node.*

deviceHandlers
device.pair.*
```

Sources: [src/gateway/server-methods.ts67-96](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L67-L96)[src/gateway/server-methods.ts98-155](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L98-L155)

### Param Validation

Each RPC method has a dedicated Zod-based validator compiled with AJV (e.g., `validateSessionsListParams`, `validateConfigApplyParams`). These validators are defined in `src/gateway/protocol/index.ts` and referenced by handlers. Invalid params result in a response with `code: "INVALID_REQUEST"` and a formatted validation error message.

Sources: [src/gateway/protocol/index.ts249-402](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts#L249-L402)[src/gateway/protocol/index.ts404-438](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts#L404-L438)

### Accepted / Final Pattern

Some long-running operations (e.g., agent runs) return an intermediate acknowledgement before the final result. Callers signal this with `expectFinal: true` in `GatewayClient.request()`.

```
// Intermediate ack — caller keeps waiting
{ "type": "res", "id": "...", "ok": true, "payload": { "status": "accepted" } }
 
// Final response — caller resolves
{ "type": "res", "id": "...", "ok": true, "payload": { <final result> } }
```

Sources: [src/gateway/client.ts388-393](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L388-L393)[src/gateway/client.ts510-511](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L510-L511)

---

## Event Semantics

`EventFrame` messages are server-pushed and not tied to any request. Events carry a monotonically increasing `seq` integer. `GatewayClient` tracks `lastSeq` and fires the `onGap` callback when a gap is detected between consecutive sequence numbers.

```
{ "type": "event", "event": "agent", "seq": 42, "payload": { ... } }
```

The `tick` event is a mandatory heartbeat. `GatewayClient.startTickWatch()` closes the socket with code `4000` (`"tick timeout"`) if no tick is received within `tickIntervalMs × 2`. The `tickIntervalMs` value is set from `HelloOk.policy.tickIntervalMs`.

Sources: [src/gateway/client.ts369-380](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L369-L380)[src/gateway/client.ts445-467](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L445-L467)

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
Sources: [src/gateway/protocol/index.ts515-516](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts#L515-L516)[src/gateway/server/ws-connection/message-handler.ts374-404](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server/ws-connection/message-handler.ts#L374-L404)

---

## WebSocket Close Codes
CodeMeaning`1000`Normal closure`1002`Protocol version mismatch`1006`Abnormal closure (no close frame — network drop)`1008`Policy violation (auth failure, invalid handshake)`1012`Service restart`4000`Tick heartbeat timeout (client-side watchdog)
Sources: [src/gateway/client.ts74-79](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/client.ts#L74-L79)[src/gateway/server/ws-connection/message-handler.ts447-448](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server/ws-connection/message-handler.ts#L447-L448)

---

## Method Reference

Methods are assembled in `coreGatewayHandlers` in `src/gateway/server-methods.ts` and dispatched by `handleGatewayRequest()`. Channel plugins can inject additional methods via `extraHandlers`. The full base method list is `BASE_METHODS` in `src/gateway/server-methods-list.ts`.

**Handler modules and exported method groups:**
Handler ModuleExported ConstantMethods`server-methods/connect.ts``connectHandlers``connect``server-methods/health.ts``healthHandlers``health``server-methods/agent.ts``agentHandlers``agent`, `agent.identity.get`, `agent.wait``server-methods/agents.ts``agentsHandlers``agents.list`, `agents.create`, `agents.update`, `agents.delete`, `agents.files.*``server-methods/chat.ts``chatHandlers``chat.history`, `chat.send`, `chat.abort`, `chat.inject``server-methods/sessions.ts``sessionsHandlers``sessions.list`, `sessions.patch`, `sessions.reset`, `sessions.delete`, `sessions.compact`, `sessions.preview`, `sessions.resolve`, `sessions.usage``server-methods/config.ts``configHandlers``config.get`, `config.set`, `config.apply`, `config.patch`, `config.schema`, `config.schema.lookup``server-methods/cron.ts``cronHandlers``cron.list`, `cron.status`, `cron.add`, `cron.update`, `cron.remove`, `cron.run`, `cron.runs``server-methods/nodes.ts``nodeHandlers``node.pair.*`, `node.rename`, `node.list`, `node.describe`, `node.invoke`, `node.invoke.result`, `node.event``server-methods/devices.ts``deviceHandlers``device.pair.*`, `device.token.*``server-methods/exec-approvals.ts``execApprovalsHandlers``exec.approvals.*`, `exec.approval.request`, `exec.approval.resolve``server-methods/skills.ts``skillsHandlers``skills.status`, `skills.bins`, `skills.install`, `skills.update``server-methods/models.ts``modelsHandlers``models.list``server-methods/send.ts``sendHandlers``send`, `poll``server-methods/update.ts``updateHandlers``update.run``server-methods/wizard.ts``wizardHandlers``wizard.start`, `wizard.next`, `wizard.cancel`, `wizard.status`
Sources: [src/gateway/server-methods.ts7-95](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts#L7-L95)[src/gateway/server-methods-list.ts4-101](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods-list.ts#L4-L101)

### System & Health
MethodDescription`health`Liveness check — no scope required`status`Gateway and agent status`usage.status`Token usage summary`usage.cost`Cost breakdown`doctor.memory.status`Memory subsystem diagnostics`logs.tail`Stream recent log entries`secrets.reload`Hot-reload secret references`update.run`Trigger a software update check
### Agent
MethodDescription`agent`Run an agent turn`agent.identity.get`Get the agent's identity info`agent.wait`Wait for an in-progress agent run to complete`send`Send a message to an agent (non-streaming)`wake`Trigger an agent wake (heartbeat / cron)`last-heartbeat`Get the last heartbeat timestamp`set-heartbeats`Configure heartbeat schedule
### Chat (WebChat / Control UI)
MethodDescription`chat.history`Retrieve chat transcript`chat.send`Send a chat message`chat.abort`Abort an in-progress streaming response
### Sessions
MethodDescription`sessions.list`List sessions`sessions.preview`Preview a session transcript`sessions.patch`Update session metadata`sessions.reset`Reset (clear) a session`sessions.delete`Delete a session and its transcript`sessions.compact`Compact session context manually
### Configuration
MethodDescriptionRequired Scope`config.get`Read the current configuration snapshot (redacted)`operator.read``config.set`Overwrite the configuration (requires baseHash)`operator.admin``config.apply`Apply configuration from raw JSON5, then schedule restart`operator.admin``config.patch`Merge-patch specific configuration fields, then schedule restart`operator.admin``config.schema`Retrieve the config schema with UI hints and tags`operator.admin``config.schema.lookup`Look up a specific config path with child summaries`operator.read`
The `config.apply` and `config.patch` methods write the config file, then call `scheduleGatewaySigusr1Restart()` to trigger a gateway restart. They accept optional `sessionKey`, `note`, and `restartDelayMs` params to control restart behavior and post-restart message delivery. Both methods require a `baseHash` param (obtained from `config.get`) to prevent concurrent write conflicts. The `config.patch` method uses `applyMergePatch()` to merge changes into the existing config, while `config.apply` replaces the entire config.

Sources: [src/gateway/server-methods/config.ts262-513](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/config.ts#L262-L513)

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
Sources: [src/gateway/server-methods-list.ts4-103](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods-list.ts#L4-L103)

---

## Event Reference

Server-push events are declared in `GATEWAY_EVENTS` in `src/gateway/server-methods-list.ts`. The payload schemas are in `src/gateway/protocol/schema/`.
EventSchemaDescription`connect.challenge`—Nonce challenge sent on socket open (before `connect`)`tick``TickEventSchema`Periodic heartbeat carrying a timestamp`shutdown``ShutdownEventSchema`Gateway is shutting down`agent``AgentEventSchema`Streaming agent reply fragment or run status update`chat``ChatEventSchema`Chat transcript update pushed to webchat clients`presence``PresenceEntrySchema`Connected client presence list update`health`—Health snapshot push`heartbeat`—Agent heartbeat tick`cron`—Cron job run status update`talk.mode`—Voice talk mode state change`node.pair.requested`—A node pairing request has been initiated`node.pair.resolved`—A node pairing request was approved or rejected`node.invoke.request`—A command invocation has been dispatched to a node`device.pair.requested`—A device pairing request has been initiated`device.pair.resolved`—A device pairing request was approved or rejected
Sources: [src/gateway/server-methods-list.ts106-140](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods-list.ts#L106-L140)

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

Sources: [scripts/protocol-gen-swift.ts1-5](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/protocol-gen-swift.ts#L1-L5)[src/gateway/protocol/schema/protocol-schemas.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/protocol-schemas.ts#L1-L50)

---

# Authentication-&-Device-Pairing

# Authentication & Device Pairing
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [apps/macos/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClawProtocol/GatewayModels.swift)
- [apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/experiments/onboarding-config-protocol.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/experiments/onboarding-config-protocol.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/protocol-gen-swift.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/protocol-gen-swift.ts)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/openclaw-gateway-tool.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/openclaw-gateway-tool.test.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/agents/tools/gateway-tool.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/gateway-tool.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/schema.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.test.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [src/discord/monitor/thread-bindings.shared-state.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/thread-bindings.shared-state.test.ts)
- [src/gateway/method-scopes.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.test.ts)
- [src/gateway/method-scopes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.ts)
- [src/gateway/protocol/index.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts)
- [src/gateway/protocol/schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema.ts)
- [src/gateway/protocol/schema/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/config.ts)
- [src/gateway/protocol/schema/protocol-schemas.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/protocol-schemas.ts)
- [src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/types.ts)
- [src/gateway/server-methods-list.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods-list.ts)
- [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts)
- [src/gateway/server-methods/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/config.ts)
- [src/gateway/server-methods/restart-request.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/restart-request.ts)
- [src/gateway/server-methods/update.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/update.ts)
- [src/gateway/server.config-patch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.config-patch.test.ts)
- [src/gateway/server.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

This page covers the Gateway's authentication system, the cryptographic device identity mechanism, the device pairing approval workflow, and the role/scope permission model.

For the WebSocket frame structures that wrap the connect handshake, see [WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol-and-rpc). For configuring `gateway.auth` fields in `openclaw.json`, see [Configuration](/openclaw/openclaw/2.3-configuration-system). For how native node apps use the pairing mechanism, see [Native Clients (Nodes)](/openclaw/openclaw/6-native-clients-(nodes)).

---

## Authentication Modes

At startup, the gateway resolves a single `ResolvedGatewayAuth` object from config and environment. Every subsequent auth check reads from this object.

**Defined in:**`src/gateway/auth.ts` — `ResolvedGatewayAuth` type [`src/gateway/auth.ts30-37](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/auth.ts#L30-L37)
Mode (`ResolvedGatewayAuthMode`)CredentialTypical use`"token"`Shared secret string; `OPENCLAW_GATEWAY_TOKEN` env or `gateway.auth.token`Default`"password"`Gateway password; `gateway.auth.password`Alternative to token`"trusted-proxy"`Identity injected via HTTP header by a reverse proxySSO / Tailscale Serve`"none"`No credential requiredLoopback-only, development
Tailscale peer authentication is a separate overlay controlled by `allowTailscale: boolean` on `ResolvedGatewayAuth`. It is only available on the WS Control UI surface (`authorizeWsControlUiGatewayConnect`), not HTTP.

The `GatewayAuthResult.method` field reports how auth actually resolved:

```
"none" | "token" | "password" | "tailscale" | "device-token" | "trusted-proxy"

```

**Auth surface functions**[`src/gateway/auth.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/auth.ts`):
FunctionSurface`resolveGatewayAuth`Resolves `ResolvedGatewayAuth` from config/env at startup`authorizeGatewayConnect`Core shared-secret check used internally`authorizeHttpGatewayConnect`Used by `POST /tools/invoke``authorizeWsControlUiGatewayConnect`WS variant; enables Tailscale header auth
Sources: [`src/gateway/auth.ts1-47](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/auth.ts#L1-L47)[`src/gateway/auth.test.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/auth.test.ts#L1-L50)

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

Sources: [`src/gateway/server/ws-connection/message-handler.ts335-970](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L335-L970)[`src/gateway/test-helpers.server.ts254-274](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/test-helpers.server.ts#L254-L274)

### connect.challenge Event

Immediately on WebSocket open — before the client sends anything — the server emits a `connect.challenge` EventFrame:

```
{ "type": "event", "event": "connect.challenge", "payload": { "nonce": "<uuid>" } }

```

The nonce is per-connection and must be included in the device's cryptographic signature. A missing or blank nonce returns error detail code `DEVICE_AUTH_NONCE_REQUIRED`; a nonce that does not match the challenge returns `DEVICE_AUTH_NONCE_MISMATCH`.

Sources: [`src/gateway/server.auth.test.ts564-576](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server.auth.test.ts#L564-L576)[`src/gateway/server/ws-connection/message-handler.ts654-662](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L654-L662)

### ConnectParams Structure

The client sends a request frame `{ type: "req", method: "connect", params: ConnectParams }`. Key fields:
FieldTypeNotes`minProtocol` / `maxProtocol``number`Must bracket the server's `PROTOCOL_VERSION``client.id``string`From `GATEWAY_CLIENT_IDS` / `GATEWAY_CLIENT_NAMES``client.mode``GatewayClientMode``"cli"`, `"node"`, `"webchat"`, etc.`client.platform``string?`Pinned after first approved pairing`client.deviceFamily``string?`Pinned after first approved pairing`auth.token``string?`Shared gateway token or device token`auth.deviceToken``string?`Explicit device token`auth.password``string?`Gateway password`role``"operator" | "node"`Requested role; committed to in device signature`scopes``string[]`Requested scopes; committed to in device signature`device.id``string`Must equal `deriveDeviceIdFromPublicKey(device.publicKey)``device.publicKey``string`Base64url Ed25519 public key`device.signature``string`Ed25519 signature over auth payload`device.signedAt``number`Unix ms; must be within ±2 min of server time`device.nonce``string`Must match `connect.challenge` nonce
Sources: [`src/gateway/client.ts270-318](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/client.ts#L270-L318)[`src/gateway/server/ws-connection/message-handler.ts434-467](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L434-L467)

### Protocol Version Negotiation

The server rejects connections where `maxProtocol < PROTOCOL_VERSION || minProtocol > PROTOCOL_VERSION`, returning an `INVALID_REQUEST` error with `{ expectedProtocol }` in the details. `PROTOCOL_VERSION` is a numeric constant in [`src/gateway/protocol/index.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/protocol/index.ts`)

Sources: [`src/gateway/server/ws-connection/message-handler.ts435-450](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L435-L450)

### Origin Check

For connections that carry a browser `Origin` header, or for `CONTROL_UI` and webchat clients, `checkBrowserOrigin` validates that the origin matches the request host or an allowlist from `gateway.controlUi.allowedOrigins`. Failed origin checks close the connection before auth is attempted.

Sources: [`src/gateway/server/ws-connection/message-handler.ts471-491](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L471-L491)[`src/gateway/origin-check.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/origin-check.ts`)

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

Sources: [`src/gateway/server/ws-connection/message-handler.ts139-181](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L139-L181)[`src/gateway/client.ts270-294](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/client.ts#L270-L294)[`src/gateway/device-auth.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/device-auth.ts`)

### Device ID Derivation

`device.id` in `ConnectParams` must equal `deriveDeviceIdFromPublicKey(device.publicKey)`. The server computes this independently and rejects mismatches (`device-id-mismatch`) before any pairing check.

### Signature Payload Versions

`resolveDeviceSignaturePayloadVersion` tries the **v3 payload** first (includes `platform` and `deviceFamily`), then falls back to **v2**. If neither verifies, the connection is rejected with `device-signature-invalid` (detail code `DEVICE_AUTH_SIGNATURE_INVALID`).

Because `scopes` are included in the signed payload, a client cannot present different scopes in `ConnectParams` than those it signed over — any mismatch fails signature verification.

### Clock Skew Tolerance

`device.signedAt` must be within `DEVICE_SIGNATURE_SKEW_MS` (2 minutes) of the server clock. Stale timestamps are rejected with `device-signature-stale`.

Sources: [`src/gateway/server/ws-connection/message-handler.ts91](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L91-L91)[`src/gateway/server/ws-connection/message-handler.ts646-662](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L646-L662)

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

Sources: [`src/gateway/server/ws-connection/message-handler.ts764-912](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L764-L912)[`src/gateway/server/ws-connection/message-handler.ts125-137](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L125-L137)

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

Sources: [`src/gateway/server/ws-connection/message-handler.ts764-824](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L764-L824)

### Pairing Upgrade Triggers

When a device is already paired but the new connection requests more access, a fresh pairing approval is required:
TriggerReason codeAllows silent?Public key not found in pairing store`"not-paired"`Yes (local client)Requested `role` not in `pairedRoles``"role-upgrade"`NoRequested `scopes` not covered by `pairedScopes``"scope-upgrade"`Yes (local client)Claimed `platform` or `deviceFamily` differs from pinned value`"metadata-upgrade"`No
Role and metadata upgrades always require manual operator approval regardless of connection locality.

Sources: [`src/gateway/server/ws-connection/message-handler.ts861-906](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L861-L906)

### Platform and Device Family Pinning

On first approved pairing, the device's `platform` and `deviceFamily` values are stored. On subsequent connections:

- If stored value is set and the claimed value differs → `metadata-upgrade` required
- If stored value is set and claims match → the stored value is written back to `connectParams.client`, preventing drift

This makes it harder for a stolen public key to be used from a different device type.

Sources: [`src/gateway/server/ws-connection/message-handler.ts833-860](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L833-L860)

### Device Tokens

After a successful pairing and handshake, `ensureDeviceToken({ deviceId, role, scopes })` generates a per-device, per-role secret token. This token:

- Is returned in the `hello-ok` response as `auth.deviceToken`
- Is cached by `GatewayClient` via `storeDeviceAuthToken` ([`src/infra/device-auth-store.js`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/infra/device-auth-store.js`))
- Can substitute for the shared gateway token in future `ConnectParams.auth.deviceToken`
- Is included in the device signature payload, so it is cryptographically bound to the keypair

When the gateway closes with code `1008` and reason `"device token mismatch"`, `GatewayClient` automatically clears the cached token and pairing record via `clearDeviceAuthToken` and `clearDevicePairing`.

Token resolution priority in `GatewayClient.sendConnect()`:

1. Explicit `opts.token` (shared gateway token)
2. Explicit `opts.deviceToken`
3. Stored device token from `loadDeviceAuthToken` (only when no explicit shared token)

Sources: [`src/gateway/client.ts244-254](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/client.ts#L244-L254)[`src/gateway/client.ts183-210](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/client.ts#L183-L210)[`src/gateway/server/ws-connection/message-handler.ts915-917](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L915-L917)

---

## Roles and Scopes

### Roles
RolePurpose`"operator"`Full gateway control: chat, config, agent management, sessions`"node"`Device capability provider: camera, location, exec. Used by native apps.
`node` role requires a device identity — connections requesting `role: "node"` without a `device` block are rejected immediately.

Sources: [`src/gateway/server/ws-connection/message-handler.ts452-461](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L452-L461)[`src/gateway/server/ws-connection/message-handler.ts919-929](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L919-L929)

### Scopes

Scopes are declared in `ConnectParams.scopes`, committed to by the device signature, and verified against the pairing record via `roleScopesAllow`. They follow a **default-deny** model: omitting scopes produces a connected session with access only to unscopeced methods like `health`.
ScopeAccess granted`operator.admin`All admin operations`operator.read`Read-only (health, config read, session history)`operator.write`Write operations (send message, config apply)`operator.approvals`Exec approval handling`operator.pairing`Device pairing management
The CLI (`callGatewayCli`) requests all five scopes by default (`CLI_DEFAULT_OPERATOR_SCOPES`). Internal gateway-to-gateway callers use `resolveLeastPrivilegeOperatorScopesForMethod`, which returns only the minimum scope for each RPC method.

**Scope stripping:** When no device identity is present and shared auth did not succeed, `clearUnboundScopes` removes any scopes claimed in `ConnectParams`. This prevents self-declared privilege escalation on connections that cannot be bound to a pairing record.

Sources: [`src/gateway/call.ts22-25](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/call.ts#L22-L25)[`src/gateway/server/ws-connection/message-handler.ts462-465](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L462-L465)[`src/gateway/server/ws-connection/message-handler.ts560-565](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L560-L565)[`src/gateway/call.test.ts185-200](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/call.test.ts#L185-L200)

---

## Tailscale Authentication

When `allowTailscale: true` is configured, `authorizeWsControlUiGatewayConnect` inspects Tailscale-forwarded HTTP headers:

- `tailscale-user-login` — authenticated Tailscale user login name
- `tailscale-user-name` — display name

Alternatively, `readTailscaleWhoisIdentity(clientIp)` queries `tailscaled` locally to resolve the peer. A successful lookup sets `method: "tailscale"` on `GatewayAuthResult`.

Tailscale auth is **not available** on `POST /tools/invoke`. It requires `gateway.trustedProxies` to be set so that forwarded headers from Tailscale Serve are accepted.

Sources: [`src/gateway/auth.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/auth.ts`)[`src/gateway/server.auth.test.ts63-77](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server.auth.test.ts#L63-L77)

---

## Trusted Proxy Authentication

When `gateway.auth.mode = "trusted-proxy"`:

- `gateway.auth.trustedProxy.userHeader` — header name injected by the proxy (e.g., `"x-forwarded-user"`)
- `gateway.auth.trustedProxy.requiredHeaders` — headers that must be present for the auth to be considered valid
- `gateway.trustedProxies` — list of upstream proxy IPs allowed to inject these headers

For the Control UI, a successful trusted-proxy auth bypasses device pairing entirely via `shouldSkipControlUiPairing` and `isTrustedProxyControlUiOperatorAuth`.

Sources: [`src/gateway/auth.ts22-48](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/auth.ts#L22-L48)[`src/gateway/server/ws-connection/message-handler.ts708-719](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L708-L719)[`src/gateway/server.auth.test.ts200-215](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server.auth.test.ts#L200-L215)

---

## Control UI Auth Policy

The Control UI (`client.id === GATEWAY_CLIENT_IDS.CONTROL_UI`) has a distinct auth policy resolved by `resolveControlUiAuthPolicy` in [`src/gateway/server/ws-connection/connect-policy.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/connect-policy.ts`):

- Over a non-secure context (non-HTTPS, non-localhost), device identity is **required** to prevent credential interception. Missing device identity returns error code `CONTROL_UI_DEVICE_IDENTITY_REQUIRED`.
- If shared auth (token or password) succeeds, device pairing is **skipped** entirely (`shouldSkipControlUiPairing`).
- If trusted-proxy auth succeeds, pairing is also skipped.

This allows the Control UI to connect with just a shared token, without going through the device pairing workflow.

Sources: [`src/gateway/server/ws-connection/message-handler.ts499-503](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L499-L503)[`src/gateway/server/ws-connection/message-handler.ts714-719](https://github.com/openclaw/openclaw/blob/8873e13f/`src/gateway/server/ws-connection/message-handler.ts#L714-L719)

---

## iOS Dual-Session Pattern

The iOS Clawdis app (and similarly macOS/Android) maintains **two simultaneous WebSocket connections** to the gateway:
Session`NodeAppModel` fieldRolePurpose`nodeGateway``GatewayNodeSession``"node"`Device capabilities: camera, location, exec, push`operatorGateway``GatewayNodeSession``"operator"`Chat, config, voicewake, agent RPCs
Both sessions use the same Ed25519 keypair but request different roles. Both go through the full device identity and pairing flow.

`gatewayPairingPaused: Bool` on `NodeAppModel` suppresses reconnect attempts while a pairing request is pending, preventing duplicate pairing requests from reconnect churn.

Sources: [`apps/ios/Sources/Model/NodeAppModel.swift94-99](https://github.com/openclaw/openclaw/blob/8873e13f/`apps/ios/Sources/Model/NodeAppModel.swift#L94-L99)[`apps/ios/Sources/Model/NodeAppModel.swift83-84](https://github.com/openclaw/openclaw/blob/8873e13f/`apps/ios/Sources/Model/NodeAppModel.swift#L83-L84)

### TLS Trust Prompt

When a native client connects over `wss://` to a self-signed gateway certificate, `GatewayConnectionController` presents a `TrustPrompt` to the user showing the host, port, and SHA-256 fingerprint. After the user confirms, the fingerprint is persisted and used to validate the certificate on all future connections.

Sources: [`apps/ios/Sources/Gateway/GatewayConnectionController.swift21-57](https://github.com/openclaw/openclaw/blob/8873e13f/`apps/ios/Sources/Gateway/GatewayConnectionController.swift#L21-L57)

### Setup Code Onboarding

The iOS app provides a setup code flow that bundles gateway URL and token into a single transferable string issued by a Telegram channel command:

1. User sends `/pair` to their Telegram bot
2. Bot returns a setup code encoding the gateway URL and a shared token
3. User pastes the setup code into the iOS Settings tab and taps **Connect**
4. App extracts the URL and token, connects to the gateway, and presents its device identity
5. User sends `/pair approve` in Telegram; this calls `approveDevicePairing` on the gateway
6. Gateway broadcasts `device.pair.resolved`; the iOS app's next reconnect succeeds

This flow is the channel-based path to `approveDevicePairing`. The underlying cryptographic device pairing mechanism is the same regardless of how approval is delivered.

Sources: [`apps/ios/Sources/Settings/SettingsTab.swift67-99](https://github.com/openclaw/openclaw/blob/8873e13f/`apps/ios/Sources/Settings/SettingsTab.swift#L67-L99)[`apps/ios/Sources/Onboarding/OnboardingWizardView.swift`](https://github.com/openclaw/openclaw/blob/8873e13f/`apps/ios/Sources/Onboarding/OnboardingWizardView.swift`)

---

# Configuration-System

# Configuration System
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

The Configuration System provides runtime configuration loading, validation, hot-reload, and management for the OpenClaw gateway and all its subsystems (channels, agents, tools, models, etc.). It reads configuration from `~/.openclaw/openclaw.json` in JSON5 format, validates it against a strict Zod schema, resolves secrets and includes, and exposes a runtime snapshot to all gateway components. The system supports multiple reload modes, programmatic updates via RPC, and automatic migration from legacy formats.

For channel-specific configuration patterns, see [Channels](/openclaw/openclaw/4-channels). For agent and model configuration, see [Agents](/openclaw/openclaw/3-agents). For the complete field reference, see page [2.3.1](/openclaw/openclaw/2.3.1-configuration-reference).

---

## Architecture Overview

The configuration system operates as a multi-stage pipeline that transforms raw JSON5 files into a validated, resolved runtime snapshot consumed by all gateway subsystems.

### Configuration Loading Pipeline

```
openclaw.json (JSON5)

.env files

$include files

SecretRef sources
(env/file/exec)

parseConfigJson5()
JSON5 → object

resolveIncludes()
Deep merge

validateConfigObject()
Zod schema

resolveSecrets()
SecretRef resolution

migrateLegacyConfig()
Schema migrations

Runtime Config
Snapshot

Gateway
Server

Channel
Providers

Agent
Runtime

Tool
System
```

**Sources:**[src/config/io.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L1-L500)[src/config/validation.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts#L1-L300)[src/config/legacy-migrate.ts1-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/legacy-migrate.ts#L1-L400)

---

## Core Configuration Modules

### Config I/O and Loading

The `createConfigIO()` function factory returns isolated config I/O operations for a given profile. The primary entry point is `loadConfig()`, which orchestrates the full pipeline:

```
loadConfig()

readConfigFileSnapshot()

parseConfigJson5()

validateConfigObject()

migrateLegacyConfig()

resolveConfigIncludes()

resolveSecretsInConfig()

Runtime Snapshot
(cached)
```
FunctionPurposeLocation`loadConfig()`Full config load + cache[src/config/io.ts200-250](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L200-L250)`readConfigFileSnapshot()`Read raw file + hash[src/config/io.ts100-150](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L100-L150)`parseConfigJson5()`JSON5 parse + env substitution[src/config/io.ts50-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L50-L100)`validateConfigObject()`Zod validation + plugins[src/config/validation.ts50-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts#L50-L100)`migrateLegacyConfig()`Schema migrations[src/config/legacy-migrate.ts1-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/legacy-migrate.ts#L1-L400)`resolveConfigIncludes()`$include merge[src/config/includes.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/includes.ts#L1-L200)`resolveSecretsInConfig()`SecretRef resolution[src/config/secrets/resolver.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/secrets/resolver.ts#L1-L300)
**Sources:**[src/config/io.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L1-L500)[src/config/validation.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts#L1-L300)

### Validation with Zod

All configuration is validated against `OpenClawSchema`, a comprehensive Zod schema defined in [src/config/zod-schema.ts162-700](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L162-L700) The schema is strict by default—unknown keys cause validation failures, and all field types are enforced at parse time.

```
mergePluginSchemas()

Raw Config Object

OpenClawSchema
(Zod root)

GatewaySchema

AgentsSchema

ChannelsSchema

ToolsSchema

ModelsConfigSchema

Plugin Schema
Extensions

Validated Config
```

**Key Schema Characteristics:**

- **Strict mode**: `.strict()` on all object schemas rejects unknown keys
- **Optional by default**: Most fields have `.optional()` to support partial configs
- **Custom transforms**: Fields like `meta.lastTouchedAt` auto-coerce timestamps to ISO strings [src/config/zod-schema.ts169-182](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L169-L182)
- **Cross-field refinements**: Complex validation like `dmPolicy: "allowlist"` requiring non-empty `allowFrom`[src/config/zod-schema.core.ts100-150](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.core.ts#L100-L150)
- **Plugin schema merging**: `validateConfigObjectWithPlugins()` merges plugin Zod schemas dynamically [src/config/validation.ts80-120](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts#L80-L120)

**Sources:**[src/config/zod-schema.ts162-700](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L162-L700)[src/config/validation.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts#L1-L300)[src/config/zod-schema.core.ts1-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.core.ts#L1-L400)

### SecretRef Pattern

The SecretRef system allows config values to reference secrets stored outside the config file (environment variables, files, or executable output). References use the syntax:

```
{
  gateway: {
    auth: {
      token: { $ref: "env:OPENCLAW_GATEWAY_TOKEN" }
    }
  }
}
```

```
Config Field Value

SecretInputSchema
(Zod)

Plain String

{ $ref: 'source' }

env:VAR_NAME

file:/path/to/secret

exec:command

resolveSecretRef()

Resolved String
```
Ref TypeFormatResolutionEnvironment`env:VAR_NAME``process.env.VAR_NAME`File`file:/absolute/path`Read file content, trim whitespaceExecutable`exec:command args`Run command, capture stdout, trim
**Resolution flow:**

1. `SecretInputSchema` validates the shape [src/config/zod-schema.core.ts50-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.core.ts#L50-L100)
2. `resolveSecretRef()` performs runtime resolution [src/config/secrets/resolver.ts50-150](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/secrets/resolver.ts#L50-L150)
3. Sensitive fields marked with `.register(sensitive)` are redacted in logs [src/config/zod-schema.sensitive.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.sensitive.ts#L1-L50)

**Sources:**[src/config/zod-schema.core.ts50-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.core.ts#L50-L100)[src/config/secrets/resolver.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/secrets/resolver.ts#L1-L300)[src/config/zod-schema.sensitive.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.sensitive.ts#L1-L50)

---

## Hot Reload System

The gateway watches `~/.openclaw/openclaw.json` and applies changes automatically without manual restarts, based on the configured reload mode.

### Reload Modes

```
chokidar.watch()

File change event

After debounceMs

Compare old vs new

Safe change + (hot|hybrid)

Critical change + hybrid

Critical change + hot

Any change + off

Changes applied

Gateway restarted

No action

No action

FileWatch

Debounce

LoadNew

Diff

HotApply

Restart

LogWarn

Ignore
```
ModeBehaviorWhen to use**`hybrid`** (default)Hot-apply safe changes instantly; auto-restart for critical onesProduction (safest)**`hot`**Hot-apply safe changes only; log warnings for critical onesManual restart control**`restart`**Restart on any config changeTesting/development**`off`**Disable file watching entirelyExternal orchestration
**Configuration:**

```
{
  gateway: {
    reload: {
      mode: "hybrid",        // hot | restart | hybrid | off
      debounceMs: 300        // Coalesce rapid edits
    }
  }
}
```

### Hot vs Restart Fields

The system classifies config fields into "hot-apply" and "restart-required" categories:
CategoryFieldsRestart?Channels`channels.*`, `web.*`NoAgents & Models`agents.*`, `models.*`, `bindings.*`NoAutomation`hooks.*`, `cron.*`NoSessions & Messages`session.*`, `messages.*`NoTools & Media`tools.*`, `browser.*`, `skills.*`No**Gateway Server**`gateway.port`, `gateway.bind`, `gateway.auth.*`**Yes****Infrastructure**`discovery.*`, `plugins.*`**Yes**
**Exceptions:**`gateway.reload` and `gateway.remote` do **not** trigger restarts when changed [docs/gateway/configuration.md380-390](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L380-L390)

**Implementation:**

- Field classification logic: [src/gateway/config-reload.ts100-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/config-reload.ts#L100-L200)
- Hot-reload orchestration: [src/gateway/config-reload.ts200-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/config-reload.ts#L200-L400)
- Restart coordination: [src/gateway/restart.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/restart.ts#L1-L300)

**Sources:**[src/gateway/config-reload.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/config-reload.ts#L1-L500)[src/gateway/restart.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/restart.ts#L1-L300)[docs/gateway/configuration.md348-388](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L348-L388)

---

## $include Directives

Config files can be split and composed using `$include` directives, which support both single-file replacement and multi-file deep merging.

### Include Resolution

```
openclaw.json

{ agents: { $include: './agents.json5' } }

{ broadcast: { $include: ['a.json5', 'b.json5'] } }

Replace entire 'agents' object

Deep merge array in order
(later wins)

Sibling keys override
included values

Final Merged Config
```

**Semantics:**

- **Single file**: `{ $include: "./file.json5" }` replaces the containing object
- **Array of files**: `{ $include: ["a.json5", "b.json5"] }` deep-merges in order (later wins)
- **Sibling keys**: Merged after includes, overriding included values
- **Nested includes**: Supported up to 10 levels deep
- **Relative paths**: Resolved relative to the including file

**Example:**

```
// ~/.openclaw/openclaw.json
{
  gateway: { port: 18789 },
  agents: { $include: "./agents.json5" },
  broadcast: {
    $include: ["./clients/a.json5", "./clients/b.json5"]
  }
}
```

**Error handling:**

- Missing files, parse errors, and circular includes produce clear diagnostics
- Validation happens **after** full include resolution

**Sources:**[src/config/includes.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/includes.ts#L1-L200)[docs/gateway/configuration.md325-347](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L325-L347)

---

## Config RPC (Programmatic Updates)

The gateway exposes WebSocket RPC methods for programmatic config updates, supporting both full replacement (`config.apply`) and partial updates (`config.patch`).

### RPC Methods

```
Restart Manager
Config File
Zod Validator
Gateway RPC
Client
Restart Manager
Config File
Zod Validator
Gateway RPC
Client
30s cooldown between restarts
config.get()
{ raw, hash }
config.patch({ raw, baseHash })
Merge + validate
Valid or errors
Atomic write
Schedule restart (if needed)
Restart sentinel
```

**Rate Limiting:**

- Control-plane writes (`config.apply`, `config.patch`, `update.run`) are limited to **3 requests per 60 seconds** per `deviceId+clientIp`
- When limited, RPC returns `UNAVAILABLE` with `retryAfterMs`

MethodPurposeKey Params`config.get`Fetch current config + hash—`config.apply`Full config replacement`raw`, `baseHash`, `sessionKey?``config.patch`Partial update (JSON merge patch)`raw`, `baseHash`, `sessionKey?``config.schema.lookup`Inspect single config path`path`
**Restart coordination:**

- Pending restart requests are coalesced while one is in-flight
- 30-second cooldown applies between restart cycles
- Optional `sessionKey` param enables post-restart wake-up ping

**Sources:**[src/gateway/rpc/config.ts1-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/rpc/config.ts#L1-L400)[src/gateway/restart.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/restart.ts#L1-L300)[docs/gateway/configuration.md389-448](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L389-L448)

---

## Environment Variables

The config system integrates environment variables through multiple layers:

```
no override

no override

if enabled

inline vars

process.env

.env (cwd)

~/.openclaw/.env

Login Shell Env
(optional)

config.env.vars

Merged Runtime Env

${VAR} substitution
in config strings

env:VAR SecretRef
resolution
```

**Load order (no override):**

1. `process.env` (highest precedence)
2. `.env` from current working directory
3. `~/.openclaw/.env` (global fallback)
4. Shell environment import (if `env.shellEnv.enabled: true`)
5. `config.env.vars` (inline config vars)

**Shell environment import:**

```
{
  env: {
    shellEnv: {
      enabled: true,      // Run login shell to import missing vars
      timeoutMs: 15000    // Shell resolution timeout
    },
    vars: {
      GROQ_API_KEY: "gsk-..."  // Inline var injection
    }
  }
}
```

**Substitution syntax:**

```
{
  gateway: {
    auth: { token: "${OPENCLAW_GATEWAY_TOKEN}" }
  }
}
```

**Sources:**[src/config/env.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/env.ts#L1-L300)[src/config/io.ts50-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L50-L100)[docs/gateway/configuration.md449-488](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L449-L488)

---

## Legacy Migration System

The config system includes automatic migrations from legacy config formats, triggered during validation:

```
legacy detected

Legacy Config
(e.g. channels.telegram.dm.policy)

detectLegacyFields()

migrateLegacyConfig()

Migrated Config
(e.g. channels.telegram.dmPolicy)

Zod Validation
```

**Migration examples:**
Legacy FieldNew FieldNotes`channels.telegram.dm.policy``channels.telegram.dmPolicy`DM policy flattening`channels.discord.dm.allowFrom``channels.discord.allowFrom`DM allowlist flattening`heartbeat` (root)`agents.defaults.heartbeat`Agent-scoped heartbeat`channels.telegram.groups."*".requireMention: false``requireMention: true` (new default)Mention gating flip
**Behavior:**

- Migrations run **before** Zod validation
- Legacy fields are removed after successful migration
- Migration failures block startup; run `openclaw doctor --fix` to repair
- Non-migratable legacy entries produce detailed errors [src/config/legacy-migrate.ts300-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/legacy-migrate.ts#L300-L400)

**Sources:**[src/config/legacy-migrate.ts1-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/legacy-migrate.ts#L1-L400)[CHANGELOG.md118](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L118-L118)

---

## Runtime Config Snapshot

The validated, resolved config is cached as a runtime snapshot accessible via `getRuntimeConfigSnapshot()`. All gateway subsystems consume this snapshot rather than re-parsing config files.

```
setRuntimeConfigSnapshot()

write + reload

loadConfig()

Runtime Snapshot
(in-memory cache)

Gateway Server

Channel Monitors

Agent Runner

Tool System

Browser Controller

Cron Manager

Hot Reload Event

config.patch RPC
```

**Key functions:**
FunctionPurposeLocation`getRuntimeConfigSnapshot()`Retrieve cached config[src/config/io.ts400-420](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L400-L420)`setRuntimeConfigSnapshot()`Update cache (hot reload)[src/config/io.ts420-440](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L420-L440)`clearRuntimeConfigSnapshot()`Invalidate cache[src/config/io.ts440-460](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L440-L460)`resolveConfigSnapshotHash()`Compute config hash[src/config/io.ts460-480](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L460-L480)
**Cache invalidation:**

- Hot reload: `setRuntimeConfigSnapshot()` swaps the snapshot atomically
- Gateway restart: Cache cleared on process start
- Manual: `clearRuntimeConfigSnapshot()` used by test harnesses

**Sources:**[src/config/io.ts400-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L400-L500)[src/gateway/config-reload.ts200-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/config-reload.ts#L200-L400)

---

## Config Schema Metadata

The config system includes rich metadata for Control UI rendering, CLI help text, and validation diagnostics.

### Field Metadata System

```
Zod Schema

FIELD_LABELS
Display names

FIELD_HELP
Descriptions

Field Categories
(gateway, agents, etc.)

Control UI
Form Renderer

CLI Help Text

openclaw doctor
Diagnostics
```

**Metadata sources:**

- **Field labels**: [src/config/schema.labels.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts#L1-L500) — Human-readable field names
- **Field help**: [src/config/schema.help.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L1-L500) — Detailed descriptions and guidance
- **Schema documentation**: Inline Zod `.describe()` calls for machine-readable metadata

**Usage:**

- **Control UI**: Renders forms with labels and help tooltips [ui/src/components/config-form.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/components/config-form.ts#L1-L300)
- **CLI**: `openclaw config get/set` uses labels for output formatting [src/cli/commands/config.ts1-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/commands/config.ts#L1-L400)
- **Doctor**: Field-specific diagnostics and repair suggestions [src/cli/commands/doctor.ts1-800](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/commands/doctor.ts#L1-L800)

**Sources:**[src/config/schema.labels.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts#L1-L500)[src/config/schema.help.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L1-L500)[ui/src/components/config-form.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/components/config-form.ts#L1-L300)

---

## Config Validation Error Handling

Validation failures produce structured error messages with exact field paths and actionable guidance:

```
Success

ZodError

validateConfigObject()

schema.parse(config)

Valid Config

formatZodErrors()

Structured Error List
(path, message, code)

CLI Error Display

Log Output

RPC Error Response

openclaw doctor --fix
```

**Error structure:**

```
{
  path: ["channels", "telegram", "dmPolicy"],
  message: "Invalid enum value. Expected 'pairing' | 'allowlist' | 'open' | 'disabled', received 'public'",
  code: "invalid_enum_value"
}
```

**Error handling paths:**

- **Startup**: Gateway refuses to boot; only diagnostic commands work (`doctor`, `logs`, `health`, `status`)
- **Hot reload**: Changes rejected; gateway continues with old config
- **RPC**: `config.apply`/`config.patch` return detailed validation errors
- **CLI**: `openclaw doctor` lists issues; `openclaw doctor --fix` applies repairs when possible

**Sources:**[src/config/validation.ts150-250](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts#L150-L250)[src/cli/commands/doctor.ts1-800](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/commands/doctor.ts#L1-L800)[docs/gateway/configuration.md61-74](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L61-L74)

---

## Configuration File Locations

```
--dev

--profile NAME

default

Profile Selection

~/.openclaw-dev/

~/.openclaw-NAME/

~/.openclaw/

openclaw.json

.env

credentials/

state/
```

**Standard paths:**

- **Config file**: `~/.openclaw/openclaw.json` (JSON5 format)
- **Global env**: `~/.openclaw/.env`
- **Credentials**: `~/.openclaw/credentials/` (channel auth, OAuth tokens)
- **State**: `~/.openclaw/state/` (sessions, cron, pairing store)

**Profile isolation:**

- `--dev`: Shifts all paths to `~/.openclaw-dev/` and default ports (+100 offset)
- `--profile NAME`: Shifts all paths to `~/.openclaw-NAME/`
- Profiles are fully isolated; no shared state

**Sources:**[src/config/paths.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/paths.ts#L1-L200)[src/cli/profile.ts1-150](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/profile.ts#L1-L150)

---

## Key Takeaways

1. **Strict validation**: Config must fully match Zod schema; unknown keys fail startup
2. **Hot reload by default**: `hybrid` mode auto-restarts only when necessary
3. **SecretRef everywhere**: Keep secrets out of config files using `{ $ref: "env:VAR" }`
4. **$include composition**: Split large configs into focused files with deep merge
5. **RPC-driven updates**: Control UI and CLI update config via WebSocket RPC
6. **Migration safety**: Legacy configs auto-migrate; `openclaw doctor --fix` repairs issues
7. **Runtime snapshot**: All subsystems consume cached, validated config—no file I/O in hot path

**Sources:**[src/config/io.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/io.ts#L1-L500)[src/config/validation.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/validation.ts#L1-L300)[src/config/zod-schema.ts162-700](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L162-L700)[src/gateway/config-reload.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/config-reload.ts#L1-L500)[docs/gateway/configuration.md1-500](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L1-L500)

---

# Configuration-Reference

# Configuration Reference
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)

This page provides comprehensive field-by-field documentation of the `~/.openclaw/openclaw.json` configuration file structure. For an overview of the configuration loading pipeline, validation, and hot reload behavior, see [Configuration System](/openclaw/openclaw/2.3-configuration-system).

All configuration fields are optional unless explicitly stated otherwise. OpenClaw uses safe defaults when fields are omitted. The config format is **JSON5**, which supports comments and trailing commas.

**Sources:**[docs/gateway/configuration-reference.md1-15](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L1-L15)

---

## Configuration Schema Overview

The root configuration object is validated by `ConfigSchema` in the codebase and contains these top-level sections:

```
ConfigSchema (root)

meta: MetaSchema

env: EnvSchema

wizard: WizardSchema

diagnostics: DiagnosticsSchema

logging: LoggingSchema

cli: CliSchema

update: UpdateSchema

gateway: GatewaySchema

channels: ChannelsSchema

agents: AgentsSchema

tools: ToolsSchema

browser: BrowserSchema

web: WebSchema

discovery: DiscoverySchema

session: SessionSchema

messages: MessagesSchema

commands: CommandsSchema

approvals: ApprovalsSchema

acp: AcpSchema

talk: TalkSchema

bindings: BindingsSchema[]
```

**Configuration Validation Path:**

```
openclaw.json5

JSON5 Parser

Zod Schema Validation

Secret Resolver

Runtime Config Snapshot
```

**Sources:**[src/config/zod-schema.providers-core.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L1-L50)[src/config/schema.help.ts1-350](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L1-L350)

---

## Meta Section

System-managed metadata fields that record config write and version history:
FieldTypeDescription`meta.lastTouchedVersion``string`OpenClaw version that last wrote this config`meta.lastTouchedAt``string`ISO timestamp of last config write
**Example:**

```
{
  meta: {
    lastTouchedVersion: "2026.2.25",
    lastTouchedAt: "2026-02-25T10:30:00.000Z"
  }
}
```

**Sources:**[src/config/schema.help.ts9-11](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L9-L11)

---

## Environment Section

Controls environment variable import and runtime variable injection:
FieldTypeDefaultDescription`env.shellEnv.enabled``boolean``true`Load variables from user shell profile during startup`env.shellEnv.timeoutMs``number``5000`Maximum time for shell environment resolution`env.vars``Record<string, string>``{}`Explicit key/value environment overrides
**Example:**

```
{
  env: {
    shellEnv: {
      enabled: true,
      timeoutMs: 5000
    },
    vars: {
      NODE_ENV: "production",
      LOG_LEVEL: "info"
    }
  }
}
```

**Sources:**[src/config/schema.help.ts12-20](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L12-L20)

---

## Gateway Section

Gateway runtime configuration for bind mode, authentication, control UI, and operational controls.

### Core Gateway Fields

```
gateway

port: number (18789)

mode: 'local' | 'remote'

bind: 'auto' | 'lan' | 'loopback' | 'custom' | 'tailnet'

customBindHost: string

controlUi: ControlUiSchema

auth: GatewayAuthSchema

tools: GatewayToolsSchema

remote: RemoteGatewaySchema

reload: ReloadSchema

tls: TlsSchema

http: HttpSchema

tailscale: TailscaleSchema
```
FieldTypeDefaultDescription`gateway.port``number``18789`TCP port for gateway listener (API, Control UI, channel ingress)`gateway.mode``"local"` | `"remote"``"local"`Operation mode: local runs channels and agents on this host; remote connects through remote transport`gateway.bind``"auto"` | `"lan"` | `"loopback"` | `"custom"` | `"tailnet"``"auto"`Network bind profile controlling interface exposure`gateway.customBindHost``string`-Explicit bind host/IP when `bind` is `"custom"``gateway.channelHealthCheckMinutes``number``5`Interval in minutes for automatic channel health probing
**Sources:**[src/config/schema.help.ts68-110](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L68-L110)[docs/gateway/configuration-reference.md68-126](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L68-L126)

### Gateway Authentication

The `gateway.auth` object controls HTTP/WebSocket access authentication:
FieldTypeDefaultDescription`gateway.auth.mode``"none"` | `"token"` | `"password"` | `"trusted-proxy"``"none"`Authentication mode`gateway.auth.token``SecretInput`-Bearer token for token auth mode`gateway.auth.password``SecretInput`-Password for password auth mode`gateway.auth.allowTailscale``boolean``false`Allow Tailscale identity paths to satisfy auth checks`gateway.auth.rateLimit``RateLimitSchema`-Login/auth attempt throttling controls`gateway.auth.trustedProxy``TrustedProxyAuthSchema`-Trusted-proxy auth header mapping
**Example:**

```
{
  gateway: {
    port: 18789,
    bind: "loopback",
    auth: {
      mode: "token",
      token: "${GATEWAY_TOKEN}"
    }
  }
}
```

**Sources:**[src/config/schema.help.ts82-96](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L82-L96)[docs/gateway/configuration-reference.md68-126](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L68-L126)

### Gateway TLS
FieldTypeDefaultDescription`gateway.tls.enabled``boolean``false`Enable TLS termination at gateway listener`gateway.tls.autoGenerate``boolean``false`Auto-generate local TLS certificate/key pair`gateway.tls.certPath``string`-Filesystem path to TLS certificate file`gateway.tls.keyPath``string`-Filesystem path to TLS private key file`gateway.tls.caPath``string`-Optional CA bundle path for client verification
**Sources:**[src/config/schema.help.ts116-127](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L116-L127)

### Remote Gateway

For split-host operation where this instance proxies to another runtime:
FieldTypeDefaultDescription`gateway.remote.transport``"direct"` | `"ssh"``"direct"`Connection transport`gateway.remote.url``string`-Remote Gateway WebSocket URL (`ws://` or `wss://`)`gateway.remote.token``SecretInput`-Bearer token for remote gateway authentication`gateway.remote.password``SecretInput`-Password credential for remote gateway`gateway.remote.tlsFingerprint``string`-Expected sha256 TLS fingerprint (pin to avoid MITM)`gateway.remote.sshTarget``string`-SSH tunnel target (format: `user@host` or `user@host:port`)`gateway.remote.sshIdentity``string`-Optional SSH identity file path
**Sources:**[src/config/schema.help.ts112-145](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L112-L145)

---

## Channels Section

Multi-channel messaging integration configuration. Each channel starts automatically when its config section exists unless `enabled: false`.

### Channel Defaults and Shared Settings

```
channels

defaults: ChannelDefaultsSchema

modelByChannel: Record>

telegram: TelegramConfigSchema

discord: DiscordConfigSchema

slack: SlackConfigSchema

whatsapp: WhatsAppConfigSchema

signal: SignalConfigSchema

googlechat: GoogleChatConfigSchema

mattermost: MattermostConfigSchema

imessage: IMessageConfigSchema

bluebubbles: BlueBubblesConfigSchema

irc: IrcConfigSchema

msteams: MSTeamsConfigSchema
```
FieldTypeDefaultDescription`channels.defaults.groupPolicy``"open"` | `"allowlist"` | `"disabled"``"allowlist"`Fallback group policy when provider-level `groupPolicy` is unset`channels.defaults.heartbeat.showOk``boolean``false`Include healthy channel statuses in heartbeat output`channels.defaults.heartbeat.showAlerts``boolean``true`Include degraded/error statuses in heartbeat output`channels.defaults.heartbeat.useIndicator``boolean``true`Render compact indicator-style heartbeat output
**Channel Model Override Mapping:**

Use `channels.modelByChannel` to pin specific channel IDs to a model. Values accept `provider/model` or configured model aliases.

```
{
  channels: {
    modelByChannel: {
      discord: {
        "123456789012345678": "anthropic/claude-opus-4-6"
      },
      slack: {
        "C1234567890": "openai/gpt-4.1"
      },
      telegram: {
        "-1001234567890": "openai/gpt-4.1-mini",
        "-1001234567890:topic:99": "anthropic/claude-sonnet-4-6"
      }
    }
  }
}
```

**Sources:**[docs/gateway/configuration-reference.md68-90](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L68-L90)[src/config/zod-schema.providers-core.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L1-L100)

### DM and Group Access Policies

All channels support DM policies and group policies:

**DM Policy Values:**
PolicyBehavior`"pairing"` (default)Unknown senders get a one-time pairing code; owner must approve`"allowlist"`Only senders in `allowFrom` (or paired allow store)`"open"`Allow all inbound DMs (requires `allowFrom: ["*"]`)`"disabled"`Ignore all inbound DMs
**Group Policy Values:**
PolicyBehavior`"allowlist"` (default)Only groups matching the configured allowlist`"open"`Bypass group allowlists (mention-gating still applies)`"disabled"`Block all group/room messages
**Sources:**[docs/gateway/configuration-reference.md22-43](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L22-L43)

### Telegram Configuration

**Schema Path:**`TelegramConfigSchema` in [src/config/zod-schema.providers-core.ts152-344](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L152-L344)

**Core Fields:**
FieldTypeDefaultDescription`channels.telegram.enabled``boolean``true`Enable Telegram channel`channels.telegram.botToken``SecretInput`-Telegram bot token (env: `TELEGRAM_BOT_TOKEN` for default account)`channels.telegram.tokenFile``string`-Alternative: path to file containing bot token`channels.telegram.dmPolicy``DmPolicy``"pairing"`Direct message access policy`channels.telegram.groupPolicy``GroupPolicy``"allowlist"`Group message access policy`channels.telegram.allowFrom``Array<string | number>`-Allowlist for DM senders (numeric Telegram user IDs)`channels.telegram.groupAllowFrom``Array<string | number>`-Allowlist for group senders (falls back to `allowFrom`)`channels.telegram.historyLimit``number``50`Group chat history limit`channels.telegram.dmHistoryLimit``number`-DM history limit (falls back to unlimited)`channels.telegram.textChunkLimit``number``4000`Max text chars before splitting`channels.telegram.chunkMode``"length"` | `"newline"``"length"`Text splitting strategy`channels.telegram.streaming``"off"` | `"partial"` | `"block"` | `"progress"``"partial"`Live stream preview mode`channels.telegram.mediaMaxMb``number``100`Max media file size in MB`channels.telegram.linkPreview``boolean``true`Enable link preview in messages
**Group Configuration:**

```
{
  channels: {
    telegram: {
      groups: {
        "-1001234567890": {
          requireMention: true,
          allowFrom: ["123456789"],
          systemPrompt: "Keep answers brief.",
          topics: {
            "99": {
              requireMention: false,
              skills: ["search"],
              agentId: "research"
            }
          }
        }
      }
    }
  }
}
```

**Multi-Account Configuration:**

```
{
  channels: {
    telegram: {
      accounts: {
        default: {
          name: "Primary bot",
          botToken: "123456:ABC..."
        },
        alerts: {
          name: "Alerts bot",
          botToken: "987654:XYZ..."
        }
      },
      defaultAccount: "default"
    }
  }
}
```

**Sources:**[docs/gateway/configuration-reference.md152-212](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L152-L212)[src/config/zod-schema.providers-core.ts152-344](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L152-L344)[docs/channels/telegram.md1-100](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md#L1-L100)

### Discord Configuration

**Schema Path:**`DiscordConfigSchema` in [src/config/zod-schema.providers-core.ts417-580](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L417-L580)

**Core Fields:**
FieldTypeDefaultDescription`channels.discord.enabled``boolean``true`Enable Discord channel`channels.discord.token``SecretInput`-Discord bot token (env: `DISCORD_BOT_TOKEN` for default account)`channels.discord.dmPolicy``DmPolicy``"pairing"`Direct message access policy`channels.discord.groupPolicy``GroupPolicy``"allowlist"`Guild access policy`channels.discord.allowFrom``Array<string>`-Allowlist for DM senders (Discord IDs as strings)`channels.discord.historyLimit``number``20`Guild channel history limit`channels.discord.dmHistoryLimit``number`-DM history limit`channels.discord.textChunkLimit``number``2000`Max text chars before splitting`channels.discord.chunkMode``"length"` | `"newline"``"length"`Text splitting strategy`channels.discord.streaming``"off"` | `"partial"` | `"block"` | `"progress"``"off"`Stream preview mode`channels.discord.maxLinesPerMessage``number``17`Max lines before splitting tall messages`channels.discord.mediaMaxMb``number``8`Max media file size in MB`channels.discord.allowBots``boolean` | `"mentions"``false`Allow bot-authored messages`channels.discord.replyToMode``"off"` | `"first"` | `"all"``"off"`Reply threading mode
**Guild Configuration:**

```
{
  channels: {
    discord: {
      guilds: {
        "123456789012345678": {
          slug: "friends-of-openclaw",
          requireMention: false,
          ignoreOtherMentions: true,
          users: ["987654321098765432"],
          channels: {
            "general": { allow: true },
            "help": {
              allow: true,
              requireMention: true,
              skills: ["docs"],
              systemPrompt: "Short answers only."
            }
          }
        }
      }
    }
  }
}
```

**Thread Bindings Configuration:**
FieldTypeDefaultDescription`channels.discord.threadBindings.enabled``boolean`-Discord override for thread-bound session features`channels.discord.threadBindings.idleHours``number``24`Inactivity auto-unfocus timeout in hours (0 disables)`channels.discord.threadBindings.maxAgeHours``number``0`Hard max age in hours (0 disables)`channels.discord.threadBindings.spawnSubagentSessions``boolean``false`Opt-in for `sessions_spawn({ thread: true })` auto thread creation
**Voice Configuration:**

```
{
  channels: {
    discord: {
      voice: {
        enabled: true,
        autoJoin: [
          {
            guildId: "123456789012345678",
            channelId: "234567890123456789"
          }
        ],
        daveEncryption: true,
        decryptionFailureTolerance: 24,
        tts: {
          provider: "openai",
          openai: { voice: "alloy" }
        }
      }
    }
  }
}
```

**Sources:**[docs/gateway/configuration-reference.md215-326](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L215-L326)[src/config/zod-schema.providers-core.ts417-580](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L417-L580)[docs/channels/discord.md1-300](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md#L1-L300)

### Slack Configuration

**Schema Path:**`SlackConfigSchema` in [src/config/zod-schema.providers-core.ts655-850](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L655-L850)

**Core Fields:**
FieldTypeDefaultDescription`channels.slack.enabled``boolean``true`Enable Slack channel`channels.slack.botToken``SecretInput`-Slack bot token (env: `SLACK_BOT_TOKEN` for default account)`channels.slack.appToken``SecretInput`-Slack app token for socket mode (env: `SLACK_APP_TOKEN` for default)`channels.slack.signingSecret``SecretInput`-Slack signing secret for HTTP mode`channels.slack.mode``"socket"` | `"http"``"socket"`Connection mode`channels.slack.dmPolicy``DmPolicy``"pairing"`Direct message access policy`channels.slack.groupPolicy``GroupPolicy``"allowlist"`Channel access policy`channels.slack.allowFrom``Array<string>`-Allowlist for DM senders (Slack user IDs)`channels.slack.historyLimit``number``50`Channel history limit`channels.slack.textChunkLimit``number``4000`Max text chars before splitting`channels.slack.streaming``"off"` | `"partial"` | `"block"` | `"progress"``"partial"`Stream mode`channels.slack.nativeStreaming``boolean``true`Use Slack native streaming API when streaming is enabled`channels.slack.reactionNotifications``"off"` | `"own"` | `"all"` | `"allowlist"``"own"`Reaction notification mode`channels.slack.replyToMode``"off"` | `"first"` | `"all"``"off"`Reply threading mode
**Channel Configuration:**

```
{
  channels: {
    slack: {
      channels: {
        "C123": {
          allow: true,
          requireMention: true,
          users: ["U123"],
          skills: ["docs"],
          systemPrompt: "Short answers only."
        }
      }
    }
  }
}
```

**Thread Configuration:**
FieldTypeDefaultDescription`channels.slack.thread.historyScope``"thread"` | `"channel"``"thread"`Per-thread or shared across channel`channels.slack.thread.inheritParent``boolean``false`Copy parent channel transcript to new threads
**Sources:**[docs/gateway/configuration-reference.md365-440](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L365-L440)[src/slack/monitor/provider.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts#L1-L300)

### WhatsApp Configuration

**Schema Path:**`WhatsAppConfigSchema` (implicit in gateway channels)

WhatsApp runs through the gateway's web channel (Baileys Web). It starts automatically when a linked session exists.
FieldTypeDefaultDescription`channels.whatsapp.dmPolicy``DmPolicy``"pairing"`Direct message access policy`channels.whatsapp.groupPolicy``GroupPolicy``"allowlist"`Group access policy`channels.whatsapp.allowFrom``Array<string>`-Allowlist for DM senders (phone numbers)`channels.whatsapp.groupAllowFrom``Array<string>`-Allowlist for group senders`channels.whatsapp.textChunkLimit``number``4000`Max text chars before splitting`channels.whatsapp.chunkMode``"length"` | `"newline"``"length"`Text splitting strategy`channels.whatsapp.mediaMaxMb``number``50`Max media file size in MB`channels.whatsapp.sendReadReceipts``boolean``true`Send blue ticks (false in self-chat mode)
**Multi-Account Configuration:**

```
{
  channels: {
    whatsapp: {
      accounts: {
        default: {},
        personal: {},
        biz: {
          // authDir: "~/.openclaw/credentials/whatsapp/biz"
        }
      },
      defaultAccount: "default"
    }
  }
}
```

**Sources:**[docs/gateway/configuration-reference.md92-150](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L92-L150)

### Signal Configuration

**Schema Path:** Signal integration via signal-cli
FieldTypeDefaultDescription`channels.signal.enabled``boolean``true`Enable Signal channel`channels.signal.account``string`-Optional account binding (phone number)`channels.signal.dmPolicy``DmPolicy``"pairing"`Direct message access policy`channels.signal.allowFrom``Array<string>`-Allowlist (phone numbers or UUIDs)`channels.signal.reactionNotifications``"off"` | `"own"` | `"all"` | `"allowlist"``"own"`Reaction notification mode`channels.signal.reactionAllowlist``Array<string>`-Allowlist for reaction notifications`channels.signal.historyLimit``number``50`History limit
**Sources:**[docs/gateway/configuration-reference.md484-506](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L484-L506)

### Other Channels

Additional channels are configured similarly under their respective keys:

- **Google Chat**: `channels.googlechat` (service account + webhook)
- **Mattermost**: `channels.mattermost` (bot token + base URL)
- **iMessage**: `channels.imessage` (imsg CLI + DB path)
- **BlueBubbles**: `channels.bluebubbles` (server URL + password)
- **IRC**: `channels.irc` (server + channels + NickServ)
- **Microsoft Teams**: `channels.msteams` (app credentials + webhook)

See [Channels](/openclaw/openclaw/4-channels) for detailed channel-specific documentation.

**Sources:**[docs/gateway/configuration-reference.md329-653](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L329-L653)

---

## Agents Section

Agent runtime configuration covering defaults and explicit agent entries used for routing and execution context.

### Agent Configuration Structure

```
agents

defaults: AgentDefaultsSchema

list: AgentSchema[]

model: AgentModelSchema

imageModel: AgentModelSchema

pdfModel: AgentModelSchema

models: Record

workspace: string

heartbeat: HeartbeatSchema

compaction: CompactionSchema

contextPruning: ContextPruningSchema

memorySearch: MemorySearchSchema

id: string

runtime: AgentRuntimeSchema

model: AgentModelSchema

tools: ToolPolicySchema

identity: IdentitySchema

workspace: string
```

**Sources:**[src/config/zod-schema.agent-defaults.ts1-150](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts#L1-L150)

### Agent Defaults

**Workspace and Bootstrap:**
FieldTypeDefaultDescription`agents.defaults.workspace``string``~/.openclaw/workspace`Default workspace directory`agents.defaults.repoRoot``string`(auto-detected)Repository root shown in system prompt Runtime line`agents.defaults.skipBootstrap``boolean``false`Disable automatic creation of workspace bootstrap files`agents.defaults.bootstrapMaxChars``number``20000`Max chars per workspace bootstrap file before truncation`agents.defaults.bootstrapTotalMaxChars``number``150000`Max total chars across all bootstrap files`agents.defaults.bootstrapPromptTruncationWarning``"off"` | `"once"` | `"always"``"once"`Controls agent-visible warning text when bootstrap context is truncated
**Model Configuration:**
FieldTypeDefaultDescription`agents.defaults.model``string` | `AgentModelListConfig`-Primary model (string) or model with fallbacks (object)`agents.defaults.imageModel``string` | `AgentModelListConfig`-Vision model config`agents.defaults.pdfModel``string` | `AgentModelListConfig`-PDF tool model config`agents.defaults.models``Record<string, AgentModelEntryConfig>`-Model catalog and allowlist for `/model` command`agents.defaults.contextTokens``number``200000`Context token limit`agents.defaults.timeoutSeconds``number``600`Agent turn timeout`agents.defaults.maxConcurrent``number``1`Max parallel agent runs across sessions
**Model Entry Configuration:**

```
{
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-6": {
          alias: "opus",
          params: {
            temperature: 0.7,
            cacheRetention: "auto"
          }
        },
        "openai/gpt-5.2": {
          alias: "gpt"
        }
      },
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["openai/gpt-5.2"]
      }
    }
  }
}
```

**Built-in Model Aliases:**
AliasModel`opus``anthropic/claude-opus-4-6``sonnet``anthropic/claude-sonnet-4-5``gpt``openai/gpt-5.2``gpt-mini``openai/gpt-5-mini``gemini``google/gemini-3-pro-preview``gemini-flash``google/gemini-3-flash-preview`
**Sources:**[docs/gateway/configuration-reference.md756-926](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L756-L926)

### Agent List

Each agent entry in `agents.list[]` defines an agent with explicit routing and execution config:
FieldTypeDefaultDescription`agents.list[].id``string`(required)Unique agent ID for routing and bindings`agents.list[].runtime.type``"embedded"` | `"acp"``"embedded"`Runtime type`agents.list[].runtime.acp``AcpRuntimeConfig`-ACP runtime defaults when `type=acp``agents.list[].model``string` | `AgentModelListConfig`(inherits)Agent-specific model override`agents.list[].workspace``string`(inherits)Agent-specific workspace`agents.list[].tools``ToolPolicySchema`(inherits)Agent-specific tool policy`agents.list[].identity.name``string`-Agent display name`agents.list[].identity.avatar``string`-Avatar image path or URL`agents.list[].skills``Array<string>`(all skills)Allowlist of skills for this agent
**Example:**

```
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "OpenClaw",
          avatar: "avatar.png"
        }
      },
      {
        id: "research",
        model: "anthropic/claude-sonnet-4-5",
        skills: ["web_search", "memory"],
        workspace: "~/research-workspace"
      },
      {
        id: "codex",
        runtime: {
          type: "acp",
          acp: {
            agent: "codex",
            backend: "acpx",
            mode: "persistent"
          }
        }
      }
    ]
  }
}
```

**Sources:**[docs/gateway/configuration-reference.md201-230](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L201-L230)[src/config/types.agent-defaults.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts#L1-L200)

### Heartbeat Configuration

Periodic heartbeat runs for proactive agent activity:
FieldTypeDefaultDescription`agents.defaults.heartbeat.every``string``"30m"`Duration string (ms/s/m/h), 0m disables`agents.defaults.heartbeat.model``string`(inherits)Model for heartbeat runs`agents.defaults.heartbeat.includeReasoning``boolean``false`Include reasoning in heartbeat output`agents.defaults.heartbeat.lightContext``boolean``false`Keep only `HEARTBEAT.md` from bootstrap files`agents.defaults.heartbeat.session``string``"main"`Session key for heartbeat`agents.defaults.heartbeat.to``string`-Target channel for heartbeat delivery`agents.defaults.heartbeat.target``"none"` | `"last"` | channel`"none"`Heartbeat delivery target`agents.defaults.heartbeat.prompt``string`-Custom prompt for heartbeat runs`agents.defaults.heartbeat.suppressToolErrorWarnings``boolean``false`Suppress tool error warnings in heartbeat
**Sources:**[docs/gateway/configuration-reference.md963-994](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L963-L994)

### Compaction Configuration

Context compaction controls for long-running sessions:
FieldTypeDefaultDescription`agents.defaults.compaction.mode``"default"` | `"safeguard"``"safeguard"`Compaction strategy`agents.defaults.compaction.reserveTokensFloor``number``24000`Reserve token floor before compaction`agents.defaults.compaction.identifierPolicy``"strict"` | `"off"` | `"custom"``"strict"`Identifier preservation policy`agents.defaults.compaction.identifierInstructions``string`-Custom identifier-preservation text when `policy=custom``agents.defaults.compaction.postCompactionSections``Array<string>``["Session Startup", "Red Lines"]`AGENTS.md sections to re-inject after compaction`agents.defaults.compaction.memoryFlush.enabled``boolean``true`Silent agentic turn before compaction to store durable memories`agents.defaults.compaction.memoryFlush.softThresholdTokens``number``6000`Token threshold for memory flush trigger
**Sources:**[docs/gateway/configuration-reference.md996-1024](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L996-L1024)

### Context Pruning Configuration
FieldTypeDefaultDescription`agents.defaults.contextPruning.mode``"off"` | `"cache-ttl"``"off"`Context pruning mode`agents.defaults.contextPruning.ttl``string``"60m"`Cache TTL duration string`agents.defaults.contextPruning.keepLastAssistants``number``3`Keep N most recent assistant messages`agents.defaults.contextPruning.softTrimRatio``number``0.7`Context size ratio to trigger soft trim`agents.defaults.contextPruning.hardClearRatio``number``0.9`Context size ratio to trigger hard clear
**Sources:**[docs/gateway/configuration-reference.md1025-1110](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L1025-L1110)

---

## Tools Section

Global tool access policy and capability configuration.

### Tool Policy Structure

```
tools

allow: string[]

deny: string[]

profile: string

alsoAllow: string[]

web: WebToolsSchema

exec: ExecToolSchema

media: MediaToolsSchema

links: LinksToolSchema

agentToAgent: AgentToAgentSchema

elevated: ElevatedToolsSchema

subagents: SubagentToolPolicySchema

sandbox: SandboxToolPolicySchema

fs: FsToolsSchema

sessions: SessionsToolSchema

message: MessageToolSchema

loopDetection: LoopDetectionSchema
```

**Sources:**[src/config/schema.help.ts293-330](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L293-L330)

### Global Tool Policy
FieldTypeDefaultDescription`tools.allow``Array<string>`-Absolute tool allowlist (replaces profile defaults)`tools.deny``Array<string>`-Global tool denylist (blocks even if profile allows)`tools.profile``string`-Named tool profile (e.g., `"default"`, `"minimal"`, `"full"`)`tools.alsoAllow``Array<string>`-Additional tools to allow beyond profile
**Sources:**[src/config/schema.help.ts295-299](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L295-L299)

### Web Tools
FieldTypeDefaultDescription`tools.web.search.enabled``boolean``true`Enable web search tool`tools.web.search.provider``"brave"` | `"perplexity"` | `"gemini"` | `"grok"` | `"kimi"``"brave"`Search provider`tools.web.search.apiKey``SecretInput`-API key for search provider`tools.web.search.maxResults``number``10`Max search results to return`tools.web.search.timeoutSeconds``number``30`Search timeout`tools.web.search.cacheTtlMinutes``number``60`Search result cache TTL`tools.web.fetch.enabled``boolean``true`Enable web fetch tool`tools.web.fetch.maxChars``number``50000`Max chars to extract from fetched pages`tools.web.fetch.timeoutSeconds``number``30`Fetch timeout
**Sources:**[docs/gateway/configuration-reference.md1315-1420](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L1315-L1420)

### Exec Tool
FieldTypeDefaultDescription`tools.exec.host``"local"` | `"node"``"local"`Execution host strategy`tools.exec.security``"strict"` | `"permissive"``"strict"`Security posture`tools.exec.ask``"always"` | `"auto"` | `"never"``"auto"`Approval strategy`tools.exec.node``NodeBindingSchema`-Node binding for delegated execution`tools.exec.notifyOnExit``boolean``true`Notify agent when process exits`tools.exec.approvalRunningNoticeMs``number``5000`Delay before showing "running" notice during approval
**Sources:**[src/config/schema.help.ts302-310](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L302-L310)

### Media Tools
FieldTypeDefaultDescription`tools.media.image.enabled``boolean``true`Enable image understanding`tools.media.image.maxBytes``number` | `string``"10MB"`Max image size`tools.media.image.maxChars``number``10000`Max output chars`tools.media.image.models``Array<string>`-Image understanding models`tools.media.audio.enabled``boolean``true`Enable audio transcription`tools.media.video.enabled``boolean``true`Enable video understanding`tools.media.concurrency``number``3`Max concurrent media processing
**Sources:**[src/config/schema.help.ts132-150](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L132-L150)

### Agent-to-Agent Tool
FieldTypeDefaultDescription`tools.agentToAgent.enabled``boolean``false`Enable agent-to-agent tool surface`tools.agentToAgent.allow``Array<string>`-Allowlist of target agent IDs permitted for cross-agent calls
**Sources:**[src/config/schema.help.ts311-316](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L311-L316)

### Elevated Tools
FieldTypeDefaultDescription`tools.elevated.enabled``boolean``false`Enable elevated tool execution path`tools.elevated.allowFrom``Record<string, Array<string>>`-Sender allow rules by channel/provider identity
**Example:**

```
{
  tools: {
    elevated: {
      enabled: true,
      allowFrom: {
        telegram: ["123456789"],
        discord: ["user:987654321098765432"]
      }
    }
  }
}
```

**Sources:**[src/config/schema.help.ts317-322](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L317-L322)

---

## Browser Section

Browser runtime controls for local or remote CDP attachment, profile routing, and automation behavior.
FieldTypeDefaultDescription`browser.enabled``boolean``true`Enable browser capability wiring`browser.cdpUrl``string`-Remote CDP websocket URL`browser.executablePath``string`(auto)Explicit browser executable path`browser.headless``boolean``true`Force browser launch in headless mode`browser.noSandbox``boolean``false`Disable Chromium sandbox isolation flags`browser.attachOnly``boolean``false`Restrict to attach-only mode (no local browser launch)`browser.cdpPortRangeStart``number``9222`Starting local CDP port for auto-allocated profiles`browser.defaultProfile``string`-Default profile name when not explicitly chosen`browser.profiles``Record<string, BrowserProfileConfig>`-Named browser profile connection map
**Profile Configuration:**
FieldTypeDescription`browser.profiles.*.cdpPort``number`Per-profile local CDP port`browser.profiles.*.cdpUrl``string`Per-profile CDP websocket URL`browser.profiles.*.driver``"clawd"` | `"extension"`Browser driver mode`browser.profiles.*.attachOnly``boolean`Per-profile attach-only override`browser.profiles.*.color``string`Accent color for visual differentiation
**Sources:**[src/config/schema.help.ts231-282](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L231-L282)

---

## Discovery Section

Service discovery settings for local mDNS advertisement and optional wide-area signaling.
FieldTypeDefaultDescription`discovery.mdns.mode``"minimal"` | `"full"` | `"off"``"minimal"`mDNS broadcast mode`discovery.wideArea.enabled``boolean``false`Enable wide-area discovery signaling
**Sources:**[src/config/schema.help.ts283-292](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L283-L292)

---

## Session Section

Session management configuration for scope, keys, and thread bindings.
FieldTypeDefaultDescription`session.scope``"per-sender"` | `"per-channel"` | `"main"``"per-sender"`Session isolation scope`session.mainKey``string``"main"`Session key for main session`session.dmScope``"per-sender"` | `"main"``"main"`DM session scope`session.threadBindings.enabled``boolean`-Global thread-binding feature gate`session.threadBindings.idleHours``number``24`Idle timeout in hours`session.threadBindings.maxAgeHours``number``0`Hard max age in hours (0 disables)
**Sources:**[src/config/types.base.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.base.ts#L1-L100)

---

## Commands Section

Chat command handling configuration for native and text commands.
FieldTypeDefaultDescription`commands.native``boolean` | `"auto"``"auto"`Register native commands when supported`commands.text``boolean``true`Parse `/commands` in chat messages`commands.bash``boolean``false`Allow `!` (alias: `/bash`)`commands.bashForegroundMs``number``2000`Bash command foreground timeout`commands.config``boolean``false`Allow `/config` command`commands.debug``boolean``false`Allow `/debug` command`commands.restart``boolean``false`Allow `/restart` + gateway restart tool`commands.allowFrom``Record<string, Array<string>>`-Per-provider command authorization`commands.useAccessGroups``boolean``true`Use access-group policies for command authorization
**Sources:**[docs/gateway/configuration-reference.md720-753](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L720-L753)

---

## ACP Section

ACP runtime controls for enabling dispatch, selecting backends, and constraining allowed agent targets.
FieldTypeDefaultDescription`acp.enabled``boolean``false`Global ACP feature gate`acp.dispatch.enabled``boolean``true`Independent dispatch gate for ACP session turns`acp.backend``string`-Default ACP runtime backend id (e.g., `"acpx"`)`acp.defaultAgent``string`-Fallback ACP target agent id when spawns don't specify explicit target`acp.allowedAgents``Array<string>`-Allowlist of ACP target agent ids permitted for runtime sessions`acp.maxConcurrentSessions``number`-Maximum concurrently active ACP sessions
**Stream Configuration:**
FieldTypeDefaultDescription`acp.stream.coalesceIdleMs``number`-Coalescer idle flush window in ms for streamed text`acp.stream.maxChunkChars``number`-Max chunk size for streamed block projection`acp.stream.repeatSuppression``boolean``true`Suppress repeated status/tool projection lines`acp.stream.deliveryMode``"live"` | `"final_only"``"live"`Stream output incrementally or buffer until terminal`acp.stream.maxOutputChars``number`-Max assistant output chars per ACP turn before truncation
**Sources:**[src/config/schema.help.ts166-201](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L166-L201)

---

## Configuration Resolution Flow

The configuration loading and validation flow follows this pipeline:

```
~/.openclaw/openclaw.json5

Environment Variables

$include files

JSON5 Parser

Config Merge

Schema Migration

Zod Schema Validation

Secret Resolver
(env/file/exec)

Runtime Config Snapshot

Gateway Process

Channel Monitors

Agent Runtime
```

**Key Code Paths:**

- Config loading: [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- Schema validation: [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- Secret resolution: [src/config/types.secrets.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.secrets.ts)
- Hot reload: [src/gateway/reload.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/reload.ts)

**Sources:**[src/config/config.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts#L1-L100)[src/config/zod-schema.providers-core.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L1-L100)

---

## Channel-Specific Configuration Deep Dive

### Telegram Configuration Code Mapping

```
TelegramConfigSchema

resolveTelegramAccount()
src/telegram/accounts.ts

resolveTelegramToken()
src/telegram/token.ts

Bot API Creation
grammy Bot instance

Send Functions
src/telegram/send.ts

botToken / tokenFile

dmPolicy

groupPolicy

streaming mode

sendMessageTelegram()

reactMessageTelegram()

sendPollTelegram()

createForumTopicTelegram()
```

**Sources:**[src/telegram/send.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L1-L100)[src/telegram/accounts.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/accounts.ts#L1-L50)

### Discord Configuration Code Mapping

```
DiscordConfigSchema

resolveDiscordAccount()
src/discord/accounts.ts

Carbon Client Setup
src/discord/monitor/provider.ts

resolveDiscordAllowlistConfig()
src/discord/monitor/provider.allowlist.ts

Native Commands
createDiscordNativeCommand()

Interactive Components
createAgentComponentButton()

Event Listeners
DiscordMessageListener

guildEntries processing

allowFrom user resolution

Name-to-ID matching
```

**Sources:**[src/discord/monitor/provider.ts1-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L1-L300)[src/discord/accounts.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/accounts.ts#L1-L50)

### Slack Configuration Code Mapping

```
SlackConfigSchema

resolveSlackAccount()
src/slack/accounts.ts

Slack Bolt App
socket or HTTP mode

resolveSlackChannelAllowlist()
src/slack/resolve-channels.ts

resolveSlackUserAllowlist()
src/slack/resolve-users.ts

Socket Mode
appToken + botToken

HTTP Mode
signingSecret + botToken

Channel name to ID

User name to ID
```

**Sources:**[src/slack/monitor/provider.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts#L1-L200)[src/slack/accounts.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/accounts.ts#L1-L50)

---

## Tool Configuration Code Mapping

```
tools: ToolsSchema

Tool Policy Resolution

Web Tools
src/agents/tools/web-*.ts

Exec Tool
src/agents/tools/exec.ts

Media Tools
src/agents/tools/media-*.ts

Message Tools
src/agents/tools/message-tools.ts

Hierarchical Policy Filtering

Global: tools.allow/deny

Agent: agents.list[].tools

Group: per-channel tools

Sandbox: tools.sandbox

web_search tool

web_fetch tool

exec tool

process tool

Approval workflow

image tool

audio tool

video tool

send_message tool

react tool
```

**Sources:**[src/agents/tools/web-search.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/web-search.ts#L1-L50)[src/agents/tools/exec.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/exec.ts#L1-L100)

---

## Multi-Account Configuration Pattern

All channels support multi-account configuration following this pattern:

```
channels.

Top-level fields
(single-account legacy)

accounts: Record

defaultAccount: string

accounts.default

accounts.personal

accounts.work

token / credentials

dmPolicy / groupPolicy

account-specific settings

Default Account Selection

CLI commands

Message routing
```

**Account Resolution Order:**

1. Explicit `accountId` parameter in CLI/API
2. Configured `channels.<provider>.defaultAccount`
3. Account named `"default"` in `channels.<provider>.accounts`
4. First account (alphabetically sorted) in `channels.<provider>.accounts`
5. Top-level single-account config (legacy path)

**Sources:**[src/telegram/accounts.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/accounts.ts#L1-L100)[src/discord/accounts.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/accounts.ts#L1-L100)[src/slack/accounts.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/accounts.ts#L1-L100)

---

## Field-Level Help and Labels

The codebase maintains comprehensive metadata for all config fields:

- **Help Text**: [src/config/schema.help.ts1-1000](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L1-L1000) - Detailed descriptions for each field
- **Field Labels**: [src/config/schema.labels.ts1-1000](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts#L1-L1000) - Human-readable labels for UI/CLI display
- **Zod Schemas**: [src/config/zod-schema.*.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.*.ts) - Type-safe validation schemas

**Example Field Documentation Pattern:**

```
// From schema.help.ts
export const FIELD_HELP: Record<string, string> = {
  "channels.telegram.streaming": 
    "Live stream preview mode: 'off' disables streaming, 'partial' streams " +
    "text in real-time via draft API or message edits, 'block' uses block " +
    "streaming with coalesced chunks, 'progress' maps to 'partial' on Telegram.",
  
  "channels.discord.threadBindings.idleHours":
    "Discord override for inactivity auto-unfocus in hours (0 disables). " +
    "When a thread-bound session is idle for this duration, the binding is " +
    "automatically removed."
};
```

**Sources:**[src/config/schema.help.ts1-1000](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts#L1-L1000)[src/config/schema.labels.ts1-1000](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts#L1-L1000)

---

This configuration reference covers all major sections and fields in the OpenClaw configuration file. For runtime behavior and validation pipeline details, see [Configuration System](/openclaw/openclaw/2.3-configuration-system). For channel-specific setup and behavior, see [Channels](/openclaw/openclaw/4-channels).

---

# Session-Management

# Session Management
Relevant source files
- [apps/macos/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClawProtocol/GatewayModels.swift)
- [apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift)
- [docs/concepts/typing-indicators.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/typing-indicators.md)
- [docs/experiments/onboarding-config-protocol.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/experiments/onboarding-config-protocol.md)
- [scripts/protocol-gen-swift.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/protocol-gen-swift.ts)
- [src/agents/auth-profiles.runtime-snapshot-save.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles.runtime-snapshot-save.test.ts)
- [src/agents/auth-profiles/oauth.openai-codex-refresh-fallback.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.openai-codex-refresh-fallback.test.ts)
- [src/agents/auth-profiles/oauth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.test.ts)
- [src/agents/auth-profiles/oauth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.ts)
- [src/agents/openclaw-gateway-tool.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/openclaw-gateway-tool.test.ts)
- [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts)
- [src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts)
- [src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts)
- [src/agents/pi-embedded-runner/run/params.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/params.ts)
- [src/agents/pi-embedded-runner/run/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/types.ts)
- [src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/system-prompt.ts)
- [src/agents/tools/gateway-tool.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/gateway-tool.ts)
- [src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts)
- [src/auto-reply/reply/agent-runner-memory.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-memory.ts)
- [src/auto-reply/reply/agent-runner-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-utils.test.ts)
- [src/auto-reply/reply/agent-runner-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-utils.ts)
- [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts)
- [src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/followup-runner.ts)
- [src/auto-reply/reply/test-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/test-helpers.ts)
- [src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/typing-mode.ts)
- [src/browser/control-auth.auto-token.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.auto-token.test.ts)
- [src/browser/control-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.test.ts)
- [src/browser/control-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.ts)
- [src/config/schema.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.test.ts)
- [src/discord/monitor/thread-bindings.shared-state.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/thread-bindings.shared-state.test.ts)
- [src/gateway/method-scopes.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.test.ts)
- [src/gateway/method-scopes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.ts)
- [src/gateway/protocol/index.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts)
- [src/gateway/protocol/schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema.ts)
- [src/gateway/protocol/schema/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/config.ts)
- [src/gateway/protocol/schema/protocol-schemas.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/protocol-schemas.ts)
- [src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/types.ts)
- [src/gateway/server-methods-list.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods-list.ts)
- [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts)
- [src/gateway/server-methods/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/config.ts)
- [src/gateway/server-methods/restart-request.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/restart-request.ts)
- [src/gateway/server-methods/update.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/update.ts)
- [src/gateway/server.config-patch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.config-patch.test.ts)
- [src/gateway/server.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.ts)
- [src/gateway/startup-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/startup-auth.test.ts)
- [src/gateway/startup-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/startup-auth.ts)

## Purpose and Scope

This document describes OpenClaw's session management system: how conversations are identified, isolated, persisted, and synchronized across the Gateway and Agent execution layers. Sessions maintain conversation history, track agent state, and ensure safe concurrent access through file-based locking.

For information about how sessions are created and routed from inbound channel messages, see [Message Flow and Agent Turn Execution](/openclaw/openclaw/2-gateway). For details on the session storage format and repair mechanisms, see the transcript sections below.

---

## Session Architecture Overview

Sessions are the fundamental unit of conversation state in OpenClaw. Each session represents a distinct conversation thread (DM, group chat, or internal interaction) and maintains its own transcript, metadata, and execution context.

```
Access Layer

Transcript Layer

Session Store Layer

Session Identification Layer

Session Key
(string identifier)

dmScope
(isolation namespace)

Agent Binding
(resolveAgentIdFromSessionKey)

sessions.json
(~/.openclaw/state/)

SessionEntry
{sessionId, sessionFile,
updatedAt, contextTokens,
fallback state, etc.}

File Lock
(withFileLock)

session-*.jsonl
(~/.openclaw/sessions/)

Session Write Lock
(acquireSessionWriteLock)

SessionManager
(@mariozechner/pi-coding-agent)

repairSessionFileIfNeeded

updateSessionStoreEntry

updateSessionStore

touchActiveSessionEntry

prewarmSessionFile
```

**Sources:**[src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/sessions.ts)[src/agents/session-write-lock.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/session-write-lock.ts)[src/agents/pi-embedded-runner/run/attempt.ts536-541](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L536-L541)[src/auto-reply/reply/agent-runner.ts181-195](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L181-L195)

---

## Session Keys and Identification

### Session Key Format

Session keys are structured string identifiers that encode the routing and isolation context for a conversation:

```
<provider>:<accountId>:<chatId>:<dmScope>

```

Additional suffixes may be appended for specialized session types:

- **Thread sessions:**`:thread:<threadId>` or `:topic:<topicId>`
- **Subagent sessions:**`:acp:<subagentName>`
- **Cron sessions:**`:cron:<jobId>`

```
Session Key String

Provider
(telegram, discord, etc.)

Account ID
(bot instance)

Chat ID
(user/group identifier)

dmScope
(isolation boundary)

Optional Suffix
(thread, acp, cron)

resolveSessionAgentIds
resolveAgentIdFromSessionKey

Session Isolation
(separate transcripts)

isSubagentSessionKey
isCronSessionKey

Agent ID

resolveSessionTranscriptPath
```

**Sources:**[src/routing/session-key.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/routing/session-key.ts)[src/agents/agent-scope.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/agent-scope.ts#LNaN-LNaN)[src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/sessions.ts#LNaN-LNaN)

### dmScope Isolation

The `dmScope` component isolates sessions to prevent cross-contamination. Different dmScope values create entirely separate conversation contexts even for the same user and provider:
dmScope ValuePurpose`dm`Standard direct message sessions`group`Group chat sessions`internal`Internal system sessions (Control UI, CLI)`cron`Scheduled job sessions`acp`Agent Control Plane (subagent) sessions
**Sources:**[src/routing/session-key.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/routing/session-key.ts)[src/agents/pi-embedded-runner/run/attempt.ts606-611](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L606-L611)

---

## Session Store and Registry

### SessionEntry Structure

The session store maintains a registry mapping session keys to their metadata. Each `SessionEntry` contains:

```
type SessionEntry = {
  sessionId: string;              // Unique session UUID
  sessionFile: string;            // Path to JSONL transcript
  updatedAt: number;              // Last activity timestamp (ms)
  createdAt?: number;             // Session creation timestamp
  contextTokens?: number;         // Model context window size
  systemSent?: boolean;           // Whether system intro was sent
  abortedLastRun?: boolean;       // Last run was aborted
  totalTokens?: number;           // Cumulative usage tokens
  promptTokens?: number;          // Last prompt tokens
  fallbackNoticeSelectedModel?: string;  // Fallback tracking
  fallbackNoticeActiveModel?: string;
  fallbackNoticeReason?: string;
  compactionCount?: number;       // Auto-compaction counter
  groupActivationNeedsSystemIntro?: boolean;
  systemPromptReport?: object;    // Last system prompt metadata
  cliSessionId?: string;          // CLI provider session tracking
};
```

**Sources:**[src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/sessions.ts)[src/auto-reply/reply/agent-runner.ts256-284](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L256-L284)

### Persistent Store File

The session store is persisted to `~/.openclaw/state/sessions.json`. All updates acquire a file lock to ensure atomicity:

```
blocked

updateSessionStore
updateSessionStoreEntry

withFileLock
(sessions.json)

Read Current Store

Apply Update
(merge or replace)

Write Store
(atomic)

Release Lock

Concurrent Update
```

**Sources:**[src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/sessions.ts#LNaN-LNaN)[src/auto-reply/reply/agent-runner.ts189-194](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L189-L194)[src/infra/file-lock.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/file-lock.ts)

### Session Store Operations
FunctionPurpose`updateSessionStore`Update entire store with atomic callback`updateSessionStoreEntry`Update single session entry`touchActiveSessionEntry`Update `updatedAt` timestamp`resolveSessionFilePath`Resolve transcript file path from entry`resolveSessionTranscriptPath`Generate transcript path from sessionId
**Sources:**[src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/sessions.ts)[src/auto-reply/reply/agent-runner.ts181-195](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L181-L195)

---

## Session Transcripts

### JSONL Format

Session transcripts are stored as newline-delimited JSON (JSONL) files in `~/.openclaw/sessions/`. Each line represents a message in the conversation history:

```
{"sessionId":"uuid","role":"user","content":"Hello","timestamp":1234567890}
{"sessionId":"uuid","role":"assistant","content":"Hi there","timestamp":1234567891}
{"sessionId":"uuid","role":"toolCall","name":"exec","arguments":{"command":"ls"},"timestamp":1234567892}
{"sessionId":"uuid","role":"toolResult","name":"exec","content":"file1.txt","timestamp":1234567893}
```

The transcript format follows the Pi agent message schema with OpenClaw-specific extensions for tool execution metadata.

**Sources:**[src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts)[@mariozechner/pi-coding-agent SessionManager](https://github.com/openclaw/openclaw/blob/8873e13f/@mariozechner/pi-coding-agent SessionManager)

### Transcript Paths and Resolution

```
optional

sessionId

sessionKey

resolveAgentIdFromSessionKey

~/.openclaw/sessions//

session-.jsonl

Transcript File Path

messageThreadId
```

**Sources:**[src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/sessions.ts#LNaN-LNaN)[src/agents/agent-paths.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/agent-paths.ts)

### Transcript Repair

The system automatically repairs corrupted transcript files before opening them:

```
Logger
File System
repairSessionFileIfNeeded
Caller
Logger
File System
repairSessionFileIfNeeded
Caller
alt
[Parse errors found]
[All lines valid]
alt
[File missing]
[File exists]
sessionFile path
Check file exists
No repair needed
Read file
Parse JSONL lines
Warn about corruption
Filter invalid lines
Write repaired file
Repair completed
No repair needed
```

**Sources:**[src/agents/session-file-repair.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/session-file-repair.ts)[src/agents/pi-embedded-runner/run/attempt.ts543-546](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L543-L546)

---

## File-Based Locking

### Lock Acquisition and Hold Time

OpenClaw uses file-based locking to serialize access to session transcripts during agent turns. This prevents race conditions when multiple requests target the same session:

```
wait/retry

expires

acquireSessionWriteLock

Create .lock file
(atomic O_EXCL)

maxHoldMs
(calculated from timeout)

Execute Agent Turn

Release Lock
(delete .lock file)

Concurrent Request

Force Release
(dead lock recovery)
```

**Lock hold time calculation:**

```
maxHoldMs = timeoutMs + LOCK_HOLD_BUFFER_MS

```

Where `LOCK_HOLD_BUFFER_MS` provides additional margin to prevent premature lock expiration during slow operations (compaction, tool execution).

**Sources:**[src/agents/session-write-lock.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/session-write-lock.ts#LNaN-LNaN)[src/agents/session-write-lock.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/session-write-lock.ts#LNaN-LNaN)[src/agents/pi-embedded-runner/run/attempt.ts536-541](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L536-L541)

### Lock Scope and Guarantees

Session write locks guarantee:

- **Mutual exclusion:** Only one agent turn executes per session at a time
- **Deadlock prevention:** Lock expiration with configurable `maxHoldMs`
- **Transcript consistency:** Prevents interleaved message writes

The lock file path is derived from the transcript path:

```
<transcript-path>.lock

```

**Sources:**[src/agents/session-write-lock.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/session-write-lock.ts)[src/infra/file-lock.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/file-lock.ts)

---

## Session Lifecycle

### Creation and Initialization

Sessions are created lazily when the first message arrives for a new session key:

```
Agent Runner
Session Store
Message Router
Inbound Message
Agent Runner
Session Store
Message Router
Inbound Message
sessionKey not in store
Generate new sessionId
Create SessionEntry
Persist to sessions.json
runReplyAgent (isNewSession=true)
Create session transcript
Write initial message
```

**Sources:**[src/auto-reply/reply/agent-runner.ts63-93](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L63-L93)[src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/sessions.ts)

### Active Session Updates

During an agent turn, the session entry is updated to track:

```
// Touch session to update activity timestamp
await updateSessionStoreEntry({
  storePath,
  sessionKey,
  update: async () => ({ updatedAt: Date.now() }),
});
 
// Persist usage after turn completion
await persistRunSessionUsage({
  storePath,
  sessionKey,
  usage,
  lastCallUsage,
  promptTokens,
  modelUsed,
  providerUsed,
  contextTokensUsed,
  systemPromptReport,
});
```

**Sources:**[src/auto-reply/reply/agent-runner.ts189-194](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L189-L194)[src/auto-reply/reply/session-run-accounting.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/session-run-accounting.ts#LNaN-LNaN)

### Session Compaction

When conversation history exceeds the model's context window, auto-compaction triggers to summarize older messages:

```
reset session

Context Overflow
Detection

Acquire Session Lock

Run Compaction
(compactEmbeddedPiSession)

Generate Summary
(via LLM)

Write Compacted
Transcript

Release Lock

Compaction Failure

New Session
(generateSecureUuid)
```

**Compaction triggers auto-increment of `compactionCount` in the session entry.**

**Sources:**[src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts)[src/auto-reply/reply/agent-runner.ts328-340](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L328-L340)[src/auto-reply/reply/session-run-accounting.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/session-run-accounting.ts#LNaN-LNaN)

### Session Reset and Deletion

Sessions can be reset (new transcript, same key) or deleted entirely:
OperationEffectAPI Method**Reset**Generates new `sessionId`, preserves key`sessions.reset`**Delete**Removes entry and transcript file`sessions.delete`**Cleanup**Removes orphaned/expired sessionsAuto-cleanup on store load
**Reset implementation:**

```
const nextSessionId = generateSecureUuid();
const nextEntry: SessionEntry = {
  ...prevEntry,
  sessionId: nextSessionId,
  updatedAt: Date.now(),
  systemSent: false,
  abortedLastRun: false,
  fallbackNotice* fields cleared
};
```

**Sources:**[src/auto-reply/reply/agent-runner.ts256-340](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L256-L340)[src/gateway/server-methods/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/sessions.ts)

---

## Session Operations (RPC Methods)

The Gateway exposes session management through RPC methods accessible via WebSocket protocol:

### sessions.list

**Request:**

```
{
  method: "sessions.list",
  params: {
    agentId?: string;
    dmScope?: string;
    limit?: number;
    offset?: number;
  }
}
```

**Response:**

```
{
  sessions: Array<{
    sessionKey: string;
    sessionId: string;
    updatedAt: number;
    totalTokens?: number;
    agentId: string;
    messageChannel?: string;
  }>;
  total: number;
}
```

**Sources:**[src/gateway/protocol/schema/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/sessions.ts)[src/gateway/server-methods/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/sessions.ts)

### sessions.preview

Retrieves the last N messages from a session transcript without loading the full history:

```
{
  method: "sessions.preview",
  params: {
    sessionKey: string;
    limit?: number;  // Default: 10
  }
}
```

**Sources:**[src/gateway/server-methods/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/sessions.ts)

### sessions.patch

Updates session metadata without modifying the transcript:

```
{
  method: "sessions.patch",
  params: {
    sessionKey: string;
    updates: {
      contextTokens?: number;
      totalTokens?: number;
      responseUsage?: "off" | "minimal" | "full";
      // ... other SessionEntry fields
    }
  }
}
```

**Returns:**`SessionsPatchResult` with updated entry.

**Sources:**[src/gateway/protocol/schema/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/sessions.ts)[src/gateway/session-utils.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/session-utils.types.ts)

### sessions.reset

Resets a session by generating a new `sessionId` and creating a fresh transcript:

```
{
  method: "sessions.reset",
  params: {
    sessionKey: string;
    preserveMetadata?: boolean;
  }
}
```

**Cleanup behavior:** Optionally deletes the old transcript file.

**Sources:**[src/gateway/server-methods/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/sessions.ts)[src/auto-reply/reply/agent-runner.ts261-327](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L261-L327)

### sessions.delete

Permanently removes a session entry and its transcript file:

```
{
  method: "sessions.delete",
  params: {
    sessionKey: string;
  }
}
```

**Sources:**[src/gateway/server-methods/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/sessions.ts)

### sessions.compact

Manually triggers compaction for a session (normally happens automatically):

```
{
  method: "sessions.compact",
  params: {
    sessionKey: string;
    force?: boolean;
    tokenBudget?: number;
  }
}
```

**Response:**

```
{
  ok: boolean;
  compacted: boolean;
  reason?: string;
  messagesBefore?: number;
  messagesAfter?: number;
}
```

**Sources:**[src/gateway/protocol/schema/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/sessions.ts)[src/gateway/server-methods/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/sessions.ts)

---

## Session Metadata and State Tracking

### Usage Accounting

Sessions track token usage across turns to enable accurate context window management:

```
type UsageSnapshot = {
  totalTokens: number;        // Cumulative usage
  promptTokens: number;       // Last call prompt tokens
  contextTokens: number;      // Model context window size
};
```

**Usage persistence flow:**

```
Agent Run Completes

Extract Usage
(agentMeta.usage)

Derive promptTokens
(input + cacheRead + cacheWrite)

persistRunSessionUsage

updateSessionStoreEntry
```

**Sources:**[src/auto-reply/reply/session-run-accounting.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/session-run-accounting.ts#LNaN-LNaN)[src/agents/usage.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/usage.ts)

### Fallback State

When model fallback occurs (provider unavailable, rate limit, etc.), the session tracks the transition:

```
{
  fallbackNoticeSelectedModel: "anthropic/claude-3-5-sonnet",
  fallbackNoticeActiveModel: "openai/gpt-4o",
  fallbackNoticeReason: "rate_limit"
}
```

This state persists until the selected model becomes available again, allowing the system to display informative notices to users.

**Sources:**[src/auto-reply/reply/agent-runner.ts422-454](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L422-L454)[src/auto-reply/fallback-state.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/fallback-state.ts)

### System Prompt Reporting

The `systemPromptReport` field stores metadata about the system prompt used in the last turn:

```
type SessionSystemPromptReport = {
  promptCharacters: number;
  bootstrapFilesInjected: number;
  skillsPromptIncluded: boolean;
  contextFilesInjected: number;
  truncationWarnings?: string[];
  // ... additional metadata
};
```

This enables diagnostics and debugging of context window budget issues.

**Sources:**[src/config/sessions/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/sessions/types.ts)[src/agents/system-prompt-report.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt-report.ts)

---

## Session Manager Integration

### SessionManager Lifecycle

The `SessionManager` class from `@mariozechner/pi-coding-agent` provides the low-level interface to transcript files:

```
Transcript File
SessionManager
Session Lock
Agent Runner
Transcript File
SessionManager
Session Lock
Agent Runner
acquireSessionWriteLock
Lock acquired
repairSessionFileIfNeeded
prewarmSessionFile (cache)
SessionManager.open(path)
Load transcript
Session instance
session.run(prompt)
Add message
Append to JSONL
session.compact()
Generate summary
Write compacted transcript
Release lock
```

**Sources:**[src/agents/pi-embedded-runner/run/attempt.ts536-605](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L536-L605)[@mariozechner/pi-coding-agent](https://github.com/openclaw/openclaw/blob/8873e13f/@mariozechner/pi-coding-agent)

### Guard Wrappers

The `guardSessionManager` wrapper adds OpenClaw-specific safety checks:

```
const sessionManager = guardSessionManager(
  SessionManager.open(sessionFile),
  {
    agentId: sessionAgentId,
    sessionKey: params.sessionKey,
    allowSyntheticToolResults: transcriptPolicy.allowSyntheticToolResults,
    allowedToolNames,
  }
);
```

Guards enforce:

- Tool name allowlists (prevent unauthorized tool injection)
- Synthetic tool result policies (some providers require real tool calls)
- Transcript repair and validation

**Sources:**[src/agents/session-tool-result-guard-wrapper.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/session-tool-result-guard-wrapper.ts)[src/agents/pi-embedded-runner/run/attempt.ts554-558](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L554-L558)

### Session Manager Caching

The `prewarmSessionFile` function implements an LRU cache to avoid redundant file reads:

```
const SESSION_CACHE_SIZE = 32;
const sessionCache = new Map<string, { content: string; mtime: number }>();
 
async function prewarmSessionFile(path: string): Promise<void> {
  const stats = await fs.stat(path);
  const cached = sessionCache.get(path);
  if (cached && cached.mtime === stats.mtimeMs) {
    return; // Cache hit
  }
  const content = await fs.readFile(path, "utf-8");
  sessionCache.set(path, { content, mtime: stats.mtimeMs });
  // Evict oldest entries if cache exceeds size
}
```

**Sources:**[src/agents/pi-embedded-runner/session-manager-cache.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/session-manager-cache.ts)[src/agents/pi-embedded-runner/run/attempt.ts547](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L547-L547)

---

## Session Isolation and Security

### dmScope Boundaries

Sessions with different `dmScope` values are completely isolated:
ScenarioSession Key PatternIsolationUser DMs bot on Telegram`telegram:bot1:user123:dm`Separate from groupsSame user in group chat`telegram:bot1:user123:group:chat456`Separate transcriptControl UI interaction`internal:webchat:session789:internal`Separate from channelsSubagent spawned in DM`telegram:bot1:user123:dm:acp:researcher`Nested session
**Access control:** The Gateway's routing layer enforces dmPolicy and groupPolicy before resolving session keys, preventing unauthorized cross-scope access.

**Sources:**[src/routing/session-key.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/routing/session-key.ts)[src/gateway/server.impl.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.impl.ts)

### Subagent Session Nesting

ACP (Agent Control Plane) subagents create nested sessions under their parent:

```
Parent:  telegram:bot1:user123:dm
Subagent: telegram:bot1:user123:dm:acp:researcher

```

The `isSubagentSessionKey` predicate identifies these sessions for special handling (minimal system prompts, thread binding persistence).

**Sources:**[src/routing/session-key.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/routing/session-key.ts#LNaN-LNaN)[src/agents/pi-embedded-runner/run/attempt.ts606-611](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L606-L611)

---

## Performance Considerations

### Lock Contention

High-frequency requests to the same session can cause lock contention. The system mitigates this through:

- **Queue policies:**`mode: "enqueue"` defers followup turns until the active turn completes
- **Lock timeouts:** Expired locks are force-released to prevent permanent deadlock
- **Typing indicators:** Provide user feedback during long-running turns

**Sources:**[src/auto-reply/reply/queue-policy.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/queue-policy.ts)[src/auto-reply/reply/agent-runner.ts206-223](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L206-L223)

### Transcript Size Growth

Large transcripts impact performance. OpenClaw manages this through:

- **Auto-compaction:** Triggered when `estimateMessagesTokens()` exceeds context window
- **History limits:**`dmHistoryLimit` configuration caps message retention
- **Tool result truncation:** Oversized tool outputs are truncated before persistence

**Sources:**[src/agents/compaction.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/compaction.ts)[src/agents/pi-embedded-runner/history.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/history.ts)[src/agents/pi-embedded-runner/tool-result-truncation.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-truncation.ts)

### Session Store Size

The global `sessions.json` file can grow large with many active sessions. Cleanup strategies:

- **Auto-expiry:** Sessions inactive beyond configured TTL are removed on load
- **Manual deletion:**`sessions.delete` RPC method
- **Agent-scoped isolation:** Each agent maintains separate session subdirectories

**Sources:**[src/config/sessions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/sessions.ts)

---

# Service-Lifecycle-&-Diagnostics

# Cron Service
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/doctor.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/doctor.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/bash-tools.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.test.ts)
- [src/agents/model-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-auth.ts)
- [src/agents/models-config.providers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts)
- [src/agents/pi-tools-agent-config.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools-agent-config.test.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/cli/program/register.onboard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program/register.onboard.ts)
- [src/commands/auth-choice-options.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.test.ts)
- [src/commands/auth-choice-options.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.ts)
- [src/commands/auth-choice.apply.api-providers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.apply.api-providers.ts)
- [src/commands/auth-choice.preferred-provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.preferred-provider.ts)
- [src/commands/auth-choice.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.test.ts)
- [src/commands/auth-choice.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.ts)
- [src/commands/configure.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/configure.ts)
- [src/commands/doctor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/doctor.ts)
- [src/commands/onboard-auth.config-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.config-core.ts)
- [src/commands/onboard-auth.credentials.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.credentials.ts)
- [src/commands/onboard-auth.models.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.models.ts)
- [src/commands/onboard-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.test.ts)
- [src/commands/onboard-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.ts)
- [src/commands/onboard-non-interactive.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-non-interactive.ts)
- [src/commands/onboard-non-interactive/local/auth-choice.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-non-interactive/local/auth-choice.ts)
- [src/commands/onboard-types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-types.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [src/wizard/onboarding.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/wizard/onboarding.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

The Cron Service is an internal scheduler embedded in the Gateway that runs time-triggered jobs. It supports one-shot and recurring schedules, two execution modes (injecting into a main session or running a full isolated agent turn), and optional outbound delivery of results to messaging channels.

This page covers the scheduler internals, job data structures, execution pipeline, delivery system, run log, and the `cron.*` RPC methods exposed over the Gateway WebSocket protocol. For the overall Gateway architecture see page [2](https://github.com/openclaw/openclaw/blob/8873e13f/2) and for the Agent execution pipeline that isolated cron jobs invoke see page [3.1](https://github.com/openclaw/openclaw/blob/8873e13f/3.1)

---

## Core Data Model

### CronJob

A `CronJob` is the central record. Its type is defined in [src/cron/types.ts111-128](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/types.ts#L111-L128)
FieldTypeDescription`id``string`Unique job identifier`name``string`Human-readable label`agentId``string?`Target agent; falls back to default agent`sessionKey``string?`Origin session namespace for wake routing`enabled``boolean`Whether the job participates in scheduling`deleteAfterRun``boolean?`Delete the job after a successful run`schedule``CronSchedule`When to fire`sessionTarget``CronSessionTarget``"main"` or `"isolated"``wakeMode``CronWakeMode``"now"` or `"next-heartbeat"``payload``CronPayload`What to do when fired`delivery``CronDelivery?`How to deliver results to a channel`state``CronJobState`Runtime tracking fields
### Schedule Types

Defined in [src/cron/types.ts3-12](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/types.ts#L3-L12)
`kind`FieldsBehavior`at``at: string` (ISO 8601)One-shot: fires once at the specified time`every``everyMs: number`, `anchorMs?: number`Interval: fires repeatedly with a fixed gap from an anchor point`cron``expr: string`, `tz?: string`, `staggerMs?: number`Cron expression (supports seconds-level); optional timezone and deterministic stagger window
The `staggerMs` field on `cron` schedules introduces a deterministic per-job offset derived from the job ID (via SHA-256 hash) to avoid all jobs firing exactly at the top of the hour.

### Payload Kinds

Defined in [src/cron/types.ts58-72](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/types.ts#L58-L72)
`kind`FieldsBehavior`systemEvent``text: string`Injects `text` as a system event into the main session`agentTurn``message`, `model?`, `thinking?`, `timeoutSeconds?`, `allowUnsafeExternalContent?`Runs a full isolated agent turn with the given message
### Session Targets
ValueDescription`"main"`The payload text is enqueued as a system event on the main session; no separate agent context is created`"isolated"`A dedicated session is created (or reused) for this job; the agent runs independently
### Delivery Modes

Defined in [src/cron/types.ts19-27](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/types.ts#L19-L27)
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

Sources: [src/cron/service/state.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/state.ts)[src/cron/service/ops.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/ops.ts)[src/cron/service/timer.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/timer.ts)[src/cron/run-log.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/run-log.ts)[src/gateway/server-cron.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-cron.ts)

---

### CronServiceDeps

The `CronServiceDeps` interface ([src/cron/service/state.ts37-92](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/state.ts#L37-L92)) wires the scheduler to the rest of the Gateway:
DepSignaturePurpose`enqueueSystemEvent``(text, opts?) => void`Inject text into a main-session event queue`requestHeartbeatNow``(opts?) => void`Trigger the heartbeat runner without waiting`runHeartbeatOnce``(opts?) => Promise<HeartbeatRunResult>`Wait for a single heartbeat cycle to complete`runIsolatedAgentJob``(params) => Promise<...>`Run a full isolated agent turn for a cron job`onEvent``(evt: CronEvent) => void`Receive job lifecycle events (added/started/finished/removed)`cronConfig``CronConfig?`Session retention and run log settings`resolveSessionStorePath``(agentId?) => string`Look up sessions.json path per agent
---

### CronServiceState

`CronServiceState` ([src/cron/service/state.ts98-107](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/state.ts#L98-L107)) is the runtime state object threaded through all internal operations:
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

Sources: [src/cron/service/timer.ts239-278](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/timer.ts#L239-L278)[src/cron/service/timer.ts291-443](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/timer.ts#L291-L443)

#### Key Invariants

- The timer delay is clamped to `MAX_TIMER_DELAY_MS = 60_000` ms. Even jobs scheduled years away will cause a tick every 60 seconds.
- If `state.running` is already `true` when the timer fires (a job is still running), a new 60 s recheck timer is armed and the tick exits immediately. This prevents the scheduler from going silent during long-running jobs (issue #12025).
- After every tick, the store is force-reloaded before writing results so that concurrent disk writes (e.g., from isolated delivery paths) are not overwritten.

#### Startup Catch-up

On `start()` ([src/cron/service/ops.ts89-128](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/ops.ts#L89-L128)), the service:

1. Clears any stale `runningAtMs` markers left from a previous crash.
2. Calls `runMissedJobs` ([src/cron/service/timer.ts500-578](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/timer.ts#L500-L578)) to immediately execute any jobs whose `nextRunAtMs` is in the past and that have not yet run since the last terminal status (guarded by `skipAtIfAlreadyRan`).
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

Sources: [src/cron/service/timer.ts591-765](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/timer.ts#L591-L765)

### Main Session Jobs

When `sessionTarget === "main"`:

- The payload `text` is passed to `enqueueSystemEvent`, which places it into the system-event queue for the appropriate session.
- With `wakeMode === "now"`: `runHeartbeatOnce` is awaited. If the main lane is busy (returns `reason: "requests-in-flight"`), the service retries up to `wakeNowHeartbeatBusyMaxWaitMs` (default 2 min) before falling back to `requestHeartbeatNow`.
- With `wakeMode === "next-heartbeat"`: `requestHeartbeatNow` is called non-blocking.

### Isolated Agent Jobs

When `sessionTarget === "isolated"` and `payload.kind === "agentTurn"`:

1. `runIsolatedAgentJob` is called, which delegates to `runCronIsolatedAgentTurn` ([src/cron/isolated-agent/run.ts90-646](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/isolated-agent/run.ts#L90-L646)).
2. The isolated run resolves the agent config, model, auth profile, and session; then calls `runEmbeddedPiAgent` (or `runCliAgent` for CLI-backed providers).
3. After the run completes, if delivery was not already handled and a summary is available, the summary is enqueued as a system event on the main session.

#### Security: External Hook Content

If the session key marks the job as an external hook (e.g., `hook:gmail:`), `runCronIsolatedAgentTurn` wraps the message in security boundaries using `buildSafeExternalPrompt` to prevent prompt injection, unless `allowUnsafeExternalContent: true` is set on the payload ([src/cron/isolated-agent/run.ts327-362](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/isolated-agent/run.ts#L327-L362)).

---

## Error Backoff

Defined in [src/cron/service/timer.ts94-105](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/timer.ts#L94-L105)

When a recurring job errors, its next run is delayed by an exponential backoff. The natural next-run time and the backoff time are compared and the later one wins:
Consecutive ErrorsDelay130 seconds21 minute35 minutes415 minutes5+60 minutes
The `consecutiveErrors` counter resets to `0` on a successful run.

### One-shot Jobs

For `schedule.kind === "at"` jobs ([src/cron/service/timer.ts153-167](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/timer.ts#L153-L167)):

- After any terminal status (`ok`, `error`, or `skipped`), the job is disabled (`enabled = false`) and `nextRunAtMs` is cleared.
- If `deleteAfterRun === true`**and** the status is `ok`, the job is deleted from the store entirely.

---

## Delivery

After an isolated run completes, `dispatchCronDelivery` ([src/cron/isolated-agent/delivery-dispatch.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/isolated-agent/delivery-dispatch.ts)) routes the output based on the job's `delivery` configuration.

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

Sources: [src/cron/isolated-agent/run.ts585-645](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/isolated-agent/run.ts#L585-L645)[src/gateway/server-cron.ts52-70](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-cron.ts#L52-L70)

**Delivery modes in detail:**
`delivery.mode`Behavior`"none"`Output is only available in run log; no outbound send`"announce"`Calls `runSubagentAnnounceFlow` (or direct channel send for threaded targets). If `bestEffort: true`, delivery failures downgrade the run status from `error` to `ok``"webhook"`POSTs the run summary to `delivery.to` as JSON; timeout is 10 seconds
The `delivery.channel` field accepts any `ChannelId` (e.g., `"telegram"`, `"discord"`) or the special value `"last"` which resolves to the channel used in the most recent conversation in that session.

---

## Run Log

Every completed job execution is appended to a per-job JSONL file. The relevant code is in [src/cron/run-log.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/run-log.ts)

**Storage layout:**

```
~/.openclaw/cron/
  jobs.json              # CronStoreFile (all job definitions + state)
  runs/
    <jobId>.jsonl        # CronRunLogEntry per completed execution

```

`CronRunLogEntry` fields ([src/cron/run-log.ts7-23](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/run-log.ts#L7-L23)):
FieldDescription`ts`Unix timestamp of log write`jobId`Job identifier`status``ok` / `error` / `skipped``error`Error message if applicable`summary`Agent output summary`delivered`Whether output was delivered to a channel`deliveryStatus``delivered` / `not-delivered` / `unknown` / `not-requested``durationMs`Wall-clock duration of the run`model` / `provider`Model used for the run`usage`Token usage telemetry
Log files are pruned automatically: default cap is **2 MB** and **2000 lines** (`DEFAULT_CRON_RUN_LOG_MAX_BYTES`, `DEFAULT_CRON_RUN_LOG_KEEP_LINES`). These limits are configurable via `cron.runLog.maxBytes` and `cron.runLog.keepLines` in `openclaw.json` (see page [2.3.1](https://github.com/openclaw/openclaw/blob/8873e13f/2.3.1)).

---

## Store Persistence

Defined in [src/cron/store.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/store.ts)
SymbolValue`DEFAULT_CRON_STORE_PATH``~/.openclaw/cron/jobs.json``resolveCronStorePath(cfg?)`Resolves store path from config or default`loadCronStore(storePath)`Reads and parses; returns empty store on `ENOENT``saveCronStore(storePath, store)`Atomic write via tmp-file rename
The store is hot-reloaded on each timer tick (force-reload) and on each mutation operation. The service tracks `storeFileMtimeMs` to skip unnecessary disk reads when the file has not changed.

---

## RPC Methods

The `cron.*` methods are available to authenticated operator clients over the Gateway WebSocket protocol (see page [2.1](https://github.com/openclaw/openclaw/blob/8873e13f/2.1)). Schemas are defined in [src/gateway/protocol/schema/cron.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/cron.ts)

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

Sources: [src/cron/service/ops.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/ops.ts)[src/gateway/protocol/schema/cron.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/cron.ts)[src/cron/run-log.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/run-log.ts)

### Method Reference
MethodParametersReturns`cron.add``CronAddParamsSchema``CronJob``cron.update``id`, `CronJobPatchSchema``CronJob``cron.remove``id``{ ok, removed }``cron.list``includeDisabled?`, `limit?`, `offset?`, `query?`, `enabled?`, `sortBy?`, `sortDir?``CronJob[]``cron.listPage`Same as list`CronListPageResult``cron.status`—`{ enabled, storePath, jobs, nextWakeAtMs }``cron.run``id`, `mode: "force" | "due"``CronRunResult``cron.runs.read``jobId`, `limit?``CronRunLogEntry[]``cron.runs.page``jobId`, `offset?`, `limit?`, `status?`, `sortDir?``CronRunLogPageResult`
The `cron.run` method with `mode: "force"` bypasses the schedule check and runs the job immediately. If the job is already running (`runningAtMs` is set), it returns `{ ok: true, ran: false, reason: "already-running" }` without executing a second instance.

---

## Gateway Integration

`buildGatewayCronService` in [src/gateway/server-cron.ts72](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-cron.ts#L72-LNaN) instantiates the `CronService` and wires it into the running Gateway:

- **Store path** is resolved from `cfg.cron?.store` via `resolveCronStorePath`.
- **Enabled flag**: disabled by either `OPENCLAW_SKIP_CRON=1` env var or `cron.enabled: false` in config.
- **Agent/session resolution**: `enqueueSystemEvent` and `requestHeartbeatNow` callbacks resolve the target `agentId` and `sessionKey` at call time by re-reading the live config (hot-reload safe).
- **Webhook delivery**: Handled in the `onEvent` callback inside `buildGatewayCronService`; fires HTTP POSTs using `fetchWithSsrFGuard` (SSRF-protected) with a 10 s timeout.
- **WebSocket broadcast**: Every `CronEvent` (added / updated / started / finished / removed) is broadcast to all connected operator clients via the Gateway's `broadcast` function.

Sources: [src/gateway/server-cron.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-cron.ts)

---

## Concurrency

The service serializes mutations through an async mutex (`locked` in [src/cron/service/locked.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/locked.ts)). Read operations (`list`, `status`, `listPage`) acquire the same lock but use a maintenance-only recompute path that never advances a past-due `nextRunAtMs` without executing the job, so they remain non-blocking even during long-running isolated turns.

Concurrent job execution is controlled by `cronConfig.maxConcurrentRuns` (resolved in `resolveRunConcurrency` in [src/cron/service/timer.ts73-79](https://github.com/openclaw/openclaw/blob/8873e13f/src/cron/service/timer.ts#L73-L79)). It defaults to `1` (sequential). When greater than 1, the timer tick fans out across a worker pool up to `min(maxConcurrentRuns, dueJobCount)`.

---

# Agents

# Agents
Relevant source files
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md)
- [docs/concepts/typing-indicators.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/typing-indicators.md)
- [docs/gateway/background-process.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md)
- [src/agents/auth-profiles.runtime-snapshot-save.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles.runtime-snapshot-save.test.ts)
- [src/agents/auth-profiles/oauth.openai-codex-refresh-fallback.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.openai-codex-refresh-fallback.test.ts)
- [src/agents/auth-profiles/oauth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.test.ts)
- [src/agents/auth-profiles/oauth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.ts)
- [src/agents/bash-process-registry.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts)
- [src/agents/bash-process-registry.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts)
- [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts)
- [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers.ts)
- [src/agents/pi-embedded-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts)
- [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts)
- [src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts)
- [src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts)
- [src/agents/pi-embedded-runner/run/params.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/params.ts)
- [src/agents/pi-embedded-runner/run/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/types.ts)
- [src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/system-prompt.ts)
- [src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts)
- [src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts)
- [src/auto-reply/reply/agent-runner-memory.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-memory.ts)
- [src/auto-reply/reply/agent-runner-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-utils.test.ts)
- [src/auto-reply/reply/agent-runner-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-utils.ts)
- [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts)
- [src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/followup-runner.ts)
- [src/auto-reply/reply/test-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/test-helpers.ts)
- [src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/typing-mode.ts)
- [src/browser/control-auth.auto-token.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.auto-token.test.ts)
- [src/browser/control-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.test.ts)
- [src/browser/control-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.ts)
- [src/gateway/startup-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/startup-auth.test.ts)
- [src/gateway/startup-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/startup-auth.ts)

This page covers what an agent is in OpenClaw, how multiple agents are configured and isolated from each other, how workspace directories are resolved, and how the embedded runner orchestrates a conversational turn. For a detailed end-to-end execution trace, see [Agent Execution Pipeline](/openclaw/openclaw/3.1-agent-execution-pipeline). For system prompt construction, see [System Prompt](/openclaw/openclaw/3.2-system-prompt-and-context). For model and API key configuration, see [Model Configuration & Authentication](/openclaw/openclaw/3.3-model-providers-and-authentication). For the tool system, see [Tools](/openclaw/openclaw/3.4-tools-system). For the command processing layer that sits above the agent, see [Commands & Auto-Reply](/openclaw/openclaw/3.5-commands-and-directives).

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

The workspace is the agent's root for all file operations. It is resolved by `resolveRunWorkspaceDir` (in `src/agents/workspace-run.ts`) using the agent ID, session key, and config. The process working directory is `chdir`'d to this path at the start of every run attempt [src/agents/pi-embedded-runner/run/attempt.ts454](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L454-L454)

When Docker sandbox mode is active (see [Sandboxing](/openclaw/openclaw/7.2-sandboxing)), the workspace splits into two paths:

- **Host path** (`workspaceDir`) — used by file tools (`read`, `write`, `edit`) that bridge the host filesystem into the sandbox.
- **Container path** (`containerWorkspaceDir`) — the path inside Docker where `exec` commands run; injected into the system prompt as the working directory guidance.

Workspace context files (`AGENTS.md`, `SOUL.md`, `MEMORY.md`, etc.) are read and injected into the system prompt on every turn via `resolveBootstrapContextForRun`. Their sizes are capped by `bootstrapMaxChars` and `bootstrapTotalMaxChars`. See [System Prompt](/openclaw/openclaw/3.2-system-prompt-and-context) for the full list of injected files and truncation behavior.

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

Sources: [src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts)[src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts)[src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts)

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

Sources: [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts)[src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts)[src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts)[src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts)[src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts)

---

## Session & Transcript Management

Conversation history is stored in JSONL files — one JSON object per line, one file per session. The `SessionManager` class (from `@mariozechner/pi-coding-agent`) reads and appends messages to these files.

Key operations performed around the session file:
OperationFunctionFileResolve file path`resolveSessionTranscriptPath``src/config/sessions.ts`Prevent concurrent writes`acquireSessionWriteLock``src/agents/session-write-lock.ts`Fix orphaned user messages`repairSessionFileIfNeeded``src/agents/session-file-repair.ts`Remove unpaired tool entries`sanitizeToolUseResultPairing``src/agents/session-transcript-repair.ts`Warm file into read cache`prewarmSessionFile``src/agents/pi-embedded-runner/session-manager-cache.ts`Enforce tool-name allowlist`guardSessionManager``src/agents/session-tool-result-guard-wrapper.ts`
Session write locks prevent a race condition where two concurrent messages to the same session produce interleaved transcript entries. The lock's max hold time is derived from the run's `timeoutMs` via `resolveSessionLockMaxHoldFromTimeout`.

Sources: [src/agents/pi-embedded-runner/run/attempt.ts707-741](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L707-L741)

---

## System Prompt Modes

`buildAgentSystemPrompt` in [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts) assembles the system prompt from injected context files, tool lists, skills, heartbeat config, runtime info, and safety guardrails. The `promptMode` parameter controls the scope of included content:
ModeTriggerWhat is omitted relative to `"full"``"full"`All normal agent sessionsNothing`"minimal"`Subagent sessions (`isSubagentSessionKey` → `true`)Authorized Senders, Reply Tags, Messaging, Memory Recall, Heartbeats, Silent Replies, Model Aliases, OpenClaw Self-Update`"none"`Bare identity onlyAll sections; returns the single identity line
The mode is selected automatically by `resolvePromptModeForSession(sessionKey)`[src/agents/pi-embedded-runner/run/attempt.ts347-352](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L347-L352) Subagent sessions also receive a `"Subagent Context"` header for any `extraSystemPrompt` injection, instead of the `"Group Chat Context"` header used in full mode.

For complete details on prompt structure and workspace file injection, see [System Prompt](/openclaw/openclaw/3.2-system-prompt-and-context).

Sources: [src/agents/system-prompt.ts11-17](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L11-L17)[src/agents/pi-embedded-runner/run/attempt.ts347-352](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L347-L352)

---

## Context Compaction

When conversation history approaches the model's context window limit, the runner triggers automatic compaction:

1. **Detect overflow** — `isContextOverflowError` or `isLikelyContextOverflowError` (in `src/agents/pi-embedded-helpers/errors.ts`) identifies the condition.
2. **Compact** — `compactEmbeddedPiSessionDirect` in [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts) runs a summarization pass using the same configured model, condensing the session history.
3. **Inject context** — `readPostCompactionContext` injects a post-compaction workspace snapshot as a system event for the next turn.
4. **Retry** — the outer loop in `runEmbeddedPiAgent` retries the original prompt with the compacted history.
5. **Reset on failure** — if compaction itself fails (too many retries), the session is reset: a new `sessionId` is generated, the transcript is discarded, and the run restarts from scratch.

The compaction count is tracked in `EmbeddedPiAgentMeta.compactionCount` and persisted in the session store via `persistRunSessionUsage`.

Sources: [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts)[src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts)[src/auto-reply/reply/agent-runner.ts676-704](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L676-L704)

---

## Key Types Reference
TypeFilePurpose`EmbeddedPiRunResult``src/agents/pi-embedded-runner/types.ts`Return value of `runEmbeddedPiAgent` — reply payloads, metadata, messaging tool sent-texts`EmbeddedPiRunMeta``src/agents/pi-embedded-runner/types.ts`Duration, agent metadata, error kind (`context_overflow`, `compaction_failure`, `role_ordering`, `retry_limit`), stop reason`EmbeddedPiAgentMeta``src/agents/pi-embedded-runner/types.ts`Session ID, provider, model, token usage breakdown, `lastCallUsage`, compaction count`EmbeddedRunAttemptParams``src/agents/pi-embedded-runner/run/types.ts`Full parameter set passed into `runEmbeddedAttempt`, extends `RunEmbeddedPiAgentParams` with resolved model/auth`EmbeddedRunAttemptResult``src/agents/pi-embedded-runner/run/types.ts`Per-attempt result: assistant texts, tool metas, usage, error flags, messaging tool state, client tool call`RunEmbeddedPiAgentParams``src/agents/pi-embedded-runner/run/params.ts`Top-level parameters for `runEmbeddedPiAgent` — session, workspace, config, prompt, streaming callbacks`PromptMode``src/agents/system-prompt.ts``"full"` / `"minimal"` / `"none"` — controls system prompt scope`CompactEmbeddedPiSessionParams``src/agents/pi-embedded-runner/compact.ts`Parameters for the compaction operation — session, model, provider, workspace, skills snapshot
Sources: [src/agents/pi-embedded-runner/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/types.ts)[src/agents/pi-embedded-runner/run/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/types.ts)[src/agents/pi-embedded-runner/run/params.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/params.ts)[src/agents/system-prompt.ts11-17](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L11-L17)[src/agents/pi-embedded-runner/compact.ts88-125](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts#L88-L125)

---

# Agent-Execution-Pipeline

# Agent Execution Pipeline
Relevant source files
- [docs/concepts/typing-indicators.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/typing-indicators.md)
- [src/agents/auth-profiles.runtime-snapshot-save.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles.runtime-snapshot-save.test.ts)
- [src/agents/auth-profiles/oauth.openai-codex-refresh-fallback.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.openai-codex-refresh-fallback.test.ts)
- [src/agents/auth-profiles/oauth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.test.ts)
- [src/agents/auth-profiles/oauth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.ts)
- [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts)
- [src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts)
- [src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts)
- [src/agents/pi-embedded-runner/run/params.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/params.ts)
- [src/agents/pi-embedded-runner/run/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/types.ts)
- [src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/system-prompt.ts)
- [src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts)
- [src/auto-reply/reply/agent-runner-memory.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-memory.ts)
- [src/auto-reply/reply/agent-runner-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-utils.test.ts)
- [src/auto-reply/reply/agent-runner-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-utils.ts)
- [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts)
- [src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/followup-runner.ts)
- [src/auto-reply/reply/test-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/test-helpers.ts)
- [src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/typing-mode.ts)
- [src/browser/control-auth.auto-token.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.auto-token.test.ts)
- [src/browser/control-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.test.ts)
- [src/browser/control-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.ts)
- [src/gateway/startup-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/startup-auth.test.ts)
- [src/gateway/startup-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/startup-auth.ts)

This page traces a message end-to-end: from when a processed message body arrives at the agent layer, through model invocation, streaming, and reply delivery. It covers the function call chain, lane queuing, model resolution, auth profile failover, session initialization, streaming partial replies, compaction on context overflow, and typing indicators.

For how commands and directives are detected and dispatched *before* the agent is invoked, see [Commands & Auto-Reply](/openclaw/openclaw/3.5-commands-and-directives). For the contents of the system prompt built on each turn, see [System Prompt](/openclaw/openclaw/3.2-system-prompt-and-context). For how tools are assembled and policy-enforced, see [Tools](/openclaw/openclaw/3.4-tools-system). For session storage and lifecycle management, see [Session Management](/openclaw/openclaw/2.4-session-management).

---

## Pipeline Layers

A single agent turn passes through four named function layers before reaching the model API.
LayerFunctionFilePrimary Concern1`runReplyAgent``src/auto-reply/reply/agent-runner.ts`Queue policy, steer/inject, typing, post-processing2`runAgentTurnWithFallback``src/auto-reply/reply/agent-runner-execution.ts`Retry loops (compaction, transient errors, role ordering conflicts)3`runEmbeddedPiAgent``src/agents/pi-embedded-runner/run.ts`Lane queuing, model resolution, auth profile iteration4`runEmbeddedAttempt``src/agents/pi-embedded-runner/run/attempt.ts`Workspace setup, tool creation, session init, single attempt—`subscribeEmbeddedPiSession``src/agents/pi-embedded-subscribe.ts`Streaming events, block chunking, tag stripping, tool callbacks
Sources: [src/auto-reply/reply/agent-runner.ts92-122](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L92-L122)[src/auto-reply/reply/agent-runner-execution.ts72-99](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts#L72-L99)[src/agents/pi-embedded-runner/run.ts192-212](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L192-L212)[src/agents/pi-embedded-runner/run/attempt.ts427-440](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L427-L440)[src/agents/pi-embedded-subscribe.ts34-82](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts#L34-L82)

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

Sources: [src/auto-reply/reply/agent-runner.ts92-728](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L92-L728)[src/auto-reply/reply/agent-runner-execution.ts72-380](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts#L72-L380)[src/agents/pi-embedded-runner/run.ts192](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L192-LNaN)[src/agents/pi-embedded-runner/run/attempt.ts427](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L427-LNaN)[src/agents/pi-embedded-subscribe.ts34](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts#L34-LNaN)

---

## Layer 1: runReplyAgent

`runReplyAgent`[src/auto-reply/reply/agent-runner.ts92-728](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L92-L728) is the first function in the agent path. It receives:

- `commandBody` – the processed message text (after directive stripping)
- `followupRun` – a `FollowupRun` struct containing the `run` object (`sessionId`, `sessionFile`, `provider`, `model`, `config`, `prompt`, etc.)
- `sessionCtx` – a `TemplateContext` with sender/channel metadata
- `typing` – a `TypingController` for typing indicator lifecycle
- Queue, session store, and verbose-level parameters

### Queue and Steer Checks

Before invoking the model, two early-exit checks run:

**Steer check** – If `shouldSteer && isStreaming` is true, `queueEmbeddedPiMessage` is called to inject the new message into the currently-active streaming run for the same session. If the injection succeeds, the function returns early without starting a new turn.

**Queue policy** – `resolveActiveRunQueueAction`[src/auto-reply/reply/queue-policy.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/queue-policy.ts) returns one of:

- `"drop"` – silently discard the message
- `"enqueue-followup"` – save the run to a follow-up queue via `enqueueFollowupRun`
- `"proceed"` – continue to model invocation

### Post-Processing

After `runAgentTurnWithFallback` completes, `runReplyAgent` performs:
ActionFunctionFallback state tracking`resolveFallbackTransition` → updates `fallbackNotice*` fields in session storeCompaction count`incrementRunCompactionCount` (if compaction ran)Usage persistence`persistRunSessionUsage`Diagnostic event`emitDiagnosticEvent` (`type: "model.usage"`)Response usage line`formatResponseUsageLine` (appended if `/usage` is enabled)Verbose noticesPrepend notices for new sessions, fallback, and compaction eventsUnscheduled reminder note`appendUnscheduledReminderNote` if agent promised a reminder but created no cron job
Sources: [src/auto-reply/reply/agent-runner.ts154-248](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L154-L248)[src/auto-reply/reply/agent-runner.ts362-716](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L362-L716)[src/auto-reply/reply/session-run-accounting.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/session-run-accounting.ts)

---

## Layer 2: runAgentTurnWithFallback

`runAgentTurnWithFallback`[src/auto-reply/reply/agent-runner-execution.ts72-380](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts#L72-L380) wraps the model invocation in a retry loop that handles several failure modes.

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

Sources: [src/auto-reply/reply/agent-runner-execution.ts100-380](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts#L100-L380)[src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers.ts)[src/auto-reply/reply/block-reply-pipeline.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/block-reply-pipeline.ts)

---

## Layer 3: runEmbeddedPiAgent

`runEmbeddedPiAgent`[src/agents/pi-embedded-runner/run.ts192](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L192-LNaN) handles concurrency, model resolution, and auth profile iteration.

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

`resolveModel(provider, modelId, agentDir, config)`[src/agents/pi-embedded-runner/model.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/model.ts) looks up the model definition (API type, context window, input modalities, cost) from the `openclaw-models.json` registry. If the model is not found, a `FailoverError` is thrown with `reason: "model_not_found"`.

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

Sources: [src/agents/pi-embedded-runner/run.ts192-480](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L192-L480)[src/agents/pi-embedded-runner/run.ts354-480](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L354-L480)[src/agents/pi-embedded-runner/lanes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/lanes.ts)[src/agents/auth-profiles.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles.ts)

---

## Layer 4: runEmbeddedAttempt

`runEmbeddedAttempt`[src/agents/pi-embedded-runner/run/attempt.ts427](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L427-LNaN) executes a single model invocation attempt and sets up the full execution environment.

### Execution Environment Setup
StepKey Function / ClassPurposeWorkspace`resolveUserPath`, `fs.mkdir`Resolve and create workspace directorySandbox`resolveSandboxContext`Detect Docker sandbox; determine effective workspaceSkills`loadWorkspaceSkillEntries`, `resolveSkillsPromptForRun`Load skill definitions from workspaceBootstrap files`resolveBootstrapContextForRun`Load `AGENTS.md`, `SOUL.md`, `MEMORY.md`, etc. as `EmbeddedContextFile[]`Agent IDs`resolveSessionAgentIds`Determine `sessionAgentId` and `defaultAgentId`Tools`createOpenClawCodingTools`Build the full tool set for this agent and sessionGoogle sanitization`sanitizeToolsForGoogle`Adjust tool schemas for Gemini API compatibilitySystem prompt`buildEmbeddedSystemPrompt`Delegate to `buildAgentSystemPrompt` with all resolved paramsSession lock`acquireSessionWriteLock`Prevent concurrent writes to the JSONL transcriptSession repair`repairSessionFileIfNeeded`Fix corrupted or incomplete session transcriptsSession open`SessionManager.open` + `guardSessionManager`Open the session file with tool-use pairing guardsSession init`prepareSessionManagerForRun`Initialize cwd, inject session header if neededExtensions`buildEmbeddedExtensionFactories`Register compaction and context-pruning extensionsTool split`splitSdkTools`Partition tools into `builtInTools` and `customTools`Agent session`createAgentSession` (pi-coding-agent SDK)Create the `AgentSession` with model, tools, and session managerSystem prompt inject`applySystemPromptOverrideToSession`Write the computed system prompt into the sessionTool result guard`installToolResultContextGuard`Guard against tool results that would overflow context
Sources: [src/agents/pi-embedded-runner/run/attempt.ts427-820](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L427-L820)[src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/system-prompt.ts)[src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)

### System Prompt Construction

`buildEmbeddedSystemPrompt`[src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/system-prompt.ts) calls `buildAgentSystemPrompt`[src/agents/system-prompt.ts189-664](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L189-L664) with all resolved parameters including tools, runtime info, context files, skills prompt, timezone, sandbox info, and reaction guidance.

The `promptMode` is resolved by `resolvePromptModeForSession`[src/agents/pi-embedded-runner/run/attempt.ts347-352](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts#L347-L352): sessions with a subagent key use `"minimal"` mode; all others use `"full"` mode. Minimal mode omits sections like `## Authorized Senders`, `## Heartbeats`, `## Silent Replies`, and `## Messaging`.

---

## Streaming: subscribeEmbeddedPiSession

`subscribeEmbeddedPiSession`[src/agents/pi-embedded-subscribe.ts34-640](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts#L34-L640) is called before the agent turn begins. It returns an event handler object that the pi-coding-agent SDK calls as the model streams output.

### Internal State
FieldTypePurpose`assistantTexts``string[]`Collected assistant text segments → final `ReplyPayload``toolMetas`arrayTool call metadata for verbose/tool-result display`deltaBuffer``string`In-progress text delta accumulation`blockBuffer``string`Text buffered for block reply chunking`blockState``{thinking, final, inlineCode}`Stateful tag-stripping context (crosses chunk boundaries)`messagingToolSentTexts``string[]`Texts already sent via the `message` tool (deduplication)`compactionInFlight``boolean`Pauses chunk emission during compaction`pendingCompactionRetry``number`Counts pending compactions to resolve after all complete
### Tag Stripping

`stripBlockTags`[src/agents/pi-embedded-subscribe.ts355-443](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts#L355-L443) handles two tag families across chunk boundaries:

- **`<think>` / `<thinking>` / `<thought>` / `<antthinking>`** — Content inside is stripped from the user-visible reply. Tracks open/close state across chunks via `blockState.thinking`.
- **`<final>`** — When `enforceFinalTag` is true (reasoning-tag providers), only content inside `<final>` is emitted; all other text is discarded.

Code-span detection (`buildCodeSpanIndex`) prevents tag matches inside backtick code spans.

### Block Reply Streaming

When the `onBlockReply` callback is provided, text is delivered incrementally. The `EmbeddedBlockChunker`[src/agents/pi-embedded-block-chunker.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-block-chunker.ts) splits the stream into delivery-sized pieces based on `blockReplyChunking` config (`minChars`, `maxChars`, `breakPreference`).

`emitBlockChunk`[src/agents/pi-embedded-subscribe.ts465-521](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts#L465-L521) is called for each chunk. It:

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

When `reasoningMode === "stream"`, thinking block content is forwarded to `emitReasoningStream`[src/agents/pi-embedded-subscribe.ts543-573](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts#L543-L573) which:

- Computes a delta from the previously-sent reasoning text
- Calls `emitAgentEvent` with `stream: "thinking"` (broadcast to WebSocket clients)
- Calls the `onReasoningStream` callback

Sources: [src/agents/pi-embedded-subscribe.ts34-640](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts#L34-L640)[src/agents/pi-embedded-block-chunker.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-block-chunker.ts)

---

## Compaction on Context Overflow

When the model reports context overflow, compaction condenses the conversation history to free up context space. It can be triggered at two layers:
Trigger SiteWhenFunction CalledInside `runEmbeddedPiAgent`Overflow detected within a running attempt`compactEmbeddedPiSessionDirect`Inside `runAgentTurnWithFallback`Overflow propagates out of `runEmbeddedPiAgent``compactEmbeddedPiSession`
Both ultimately execute logic in [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts) which:

1. Opens the session transcript with `SessionManager.open`
2. Constructs a compaction-specific system prompt and tool set
3. Runs a dedicated agent turn that summarizes the transcript into a compact form
4. Replaces the original transcript entries with the summary
5. Returns `EmbeddedPiCompactResult` with the new message count and token estimate

After compaction, the interrupted run is retried. `incrementRunCompactionCount`[src/auto-reply/reply/session-run-accounting.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/session-run-accounting.ts) updates the session store so `/status` reports the compaction count. A post-compaction workspace context snapshot (`readPostCompactionContext`) is injected as a system event for the next turn.

Detection helpers used: `isContextOverflowError`, `isLikelyContextOverflowError`, `isCompactionFailureError` from [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers.ts)

Sources: [src/agents/pi-embedded-runner/compact.ts88](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts#L88-LNaN)[src/agents/pi-embedded-runner/run.ts53-57](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L53-L57)[src/auto-reply/reply/agent-runner-execution.ts90-130](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts#L90-L130)[src/auto-reply/reply/agent-runner.ts676-703](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L676-L703)

---

## Model Fallback

`runWithModelFallback`[src/agents/model-fallback.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-fallback.ts) attempts the configured primary model. On `FailoverError`, it tries configured fallback models in sequence.

`FailoverError` carries a `reason` field:
ReasonMeaning`"rate_limit"`Rate limited; try next profile or model`"auth"`Auth failure; try next profile`"context_overflow"`Context window exceeded`"model_not_found"`Model not in registry`"billing"`Billing issue; do not failover`"unknown"`Generic failure
When a fallback transition occurs, `runReplyAgent` records it in the session store via `fallbackNoticeSelectedModel`, `fallbackNoticeActiveModel`, `fallbackNoticeReason`, and emits a `phase: "fallback"` agent event. If verbose mode is on, a notice is prepended to the reply payloads.

When the primary model becomes available again on a subsequent turn, `fallbackCleared` is detected and a `phase: "fallback_cleared"` event is emitted.

Sources: [src/agents/model-fallback.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-fallback.ts)[src/agents/pi-embedded-runner/run.ts232-240](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L232-L240)[src/auto-reply/reply/agent-runner.ts444-674](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L444-L674)[src/auto-reply/fallback-state.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/fallback-state.ts)

---

## Typing Indicators

Typing indicators are managed by a `TypingController` passed into `runReplyAgent`. The `createTypingSignaler` factory [src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/typing-mode.ts) wraps it and controls when signals are sent based on `typingMode` config.
Signal methodWhen called`signalRunStart`After queue check passes, before model invocation`signalTextDelta(text)`During streaming, for each partial text chunk`markRunComplete`In `finally` block of `runReplyAgent``markDispatchIdle`Also in `finally` block (safety net for stuck keepalive loops)
Heartbeat turns (`isHeartbeat === true`) skip the typing indicator. The `TypingMode` values (`"off"`, `"pre-reply"`, `"streaming"`, etc.) determine which signals are suppressed.

Sources: [src/auto-reply/reply/agent-runner.ts154-159](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L154-L159)[src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/typing-mode.ts)[src/auto-reply/reply/agent-runner.ts717-727](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L717-L727)

---

## Reply Payload Assembly

After the model turn completes, `buildReplyPayloads`[src/auto-reply/reply/agent-runner-payloads.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-payloads.ts) assembles the final `ReplyPayload[]` from the collected `assistantTexts` and tool-related payloads.

Key transformations applied:
TransformationDetailSilent reply filteringPayloads whose full text is `SILENT_REPLY_TOKEN` are dropped`HEARTBEAT_OK` stripping`stripHeartbeatToken` removes the token from non-heartbeat repliesMessaging tool deduplicationTexts matching `messagingToolSentTexts` are filtered outReply-to threading`applyReplyToMode` applies `[[reply_to_current]]` or `[[reply_to:<id>]]` per channel configMedia URL attachmentTool result screenshots and images are attached to payloadsBlock-stream deduplicationChunks already sent via `blockReplyPipeline` are excluded from final delivery
`finalizeWithFollowup` then checks for queued follow-up runs and, if present, dispatches them via `createFollowupRunner`[src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/followup-runner.ts)

Sources: [src/auto-reply/reply/agent-runner-payloads.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-payloads.ts)[src/auto-reply/reply/agent-runner.ts506-534](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts#L506-L534)[src/auto-reply/reply/followup-runner.ts35-45](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/followup-runner.ts#L35-L45)

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

Sources: [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts)[src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts)[src/auto-reply/reply/agent-runner-payloads.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-payloads.ts)[src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/followup-runner.ts)[src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/typing-mode.ts)[src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts)[src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts)[src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts)[src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts)[src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts)[src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)[src/agents/model-fallback.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-fallback.ts)

---

# System-Prompt-&-Context

# System Prompt & Context
Relevant source files
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md)
- [docs/gateway/background-process.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md)
- [src/agents/bash-process-registry.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts)
- [src/agents/bash-process-registry.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts)
- [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts)
- [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers.ts)
- [src/agents/pi-embedded-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts)
- [src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts)

This page documents how OpenClaw assembles the system prompt for each agent run, including hardcoded sections, bootstrap context injection, and runtime metadata. The system prompt is built dynamically per-turn and injected into the agent's context window before model invocation.

For agent execution flow and tool provisioning, see [Agent Execution Pipeline](/openclaw/openclaw/3.1-agent-execution-pipeline). For configuration of bootstrap files and limits, see [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference).

---

## Overview

OpenClaw owns the system prompt entirely—it does not use the default pi-coding-agent prompt. The prompt is assembled by [`buildAgentSystemPrompt()`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildAgentSystemPrompt()`)() and includes:

- **Hardcoded sections**: Tooling, Safety, OpenClaw CLI, Workspace, Runtime, etc.
- **Dynamic content**: Tool summaries, runtime capabilities, model info, time zone
- **Injected bootstrap files**: `AGENTS.md`, `SOUL.md`, `TOOLS.md`, `IDENTITY.md`, `USER.md`, `HEARTBEAT.md`, `MEMORY.md`, `BOOTSTRAP.md` (when present in workspace)
- **Prompt mode filtering**: `full`, `minimal`, or `none` to control verbosity (subagents use `minimal`)

The assembled prompt is passed to the agent runtime as the system message in the conversation history.

**Sources:**[src/agents/system-prompt.ts189-686](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L189-L686)[docs/concepts/system-prompt.md1-133](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md#L1-L133)

---

## System Prompt Assembly Pipeline

```
Final Assembly

Prompt Mode Filtering

Bootstrap Context Injection

Section Builders

Input Parameters

full

minimal

none

buildAgentSystemPrompt params
workspaceDir, toolNames,
promptMode, sandboxInfo,
runtimeInfo, etc.

buildToolSummaries
toolOrder + coreToolSummaries

buildSkillsSection
skillsPrompt

buildMemorySection
memory_search/memory_get

buildDocsSection
docsPath

Safety section
hardcoded guardrails

buildTimeSection
userTimezone

buildMessagingSection
message tool hints

buildReplyTagsSection
[[reply_to_current]]

Sandbox section
sandboxInfo

buildRuntimeLine
agentId, host, model, etc.

buildBootstrapContextFiles
AGENTS.md, SOUL.md, etc.

Per-file truncation
bootstrapMaxChars

Total cap
bootstrapTotalMaxChars

EmbeddedContextFile[]
{path, content}

promptMode?

full: all sections

minimal: omit Skills,
Memory, Docs, Messaging,
Silent Replies, etc.

none: identity line only

lines.filter(Boolean).join('
')

System prompt string
```

**Prompt Assembly Flow**

The system prompt is built by assembling sections conditionally based on `promptMode` and available data. Each section builder checks preconditions (e.g., `isMinimal`, tool availability) before contributing lines to the final prompt array.

**Sources:**[src/agents/system-prompt.ts189-686](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L189-L686)[src/agents/system-prompt.ts422-684](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L422-L684)

---

## Prompt Modes

OpenClaw supports three prompt modes, controlled by the `promptMode` parameter passed to [`buildAgentSystemPrompt()`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildAgentSystemPrompt()`)():
ModeUsed ForIncluded SectionsOmitted Sections`full`Main agent runsAll sectionsNone`minimal`Subagents, isolated sessionsTooling, Safety, Workspace, Sandbox, Runtime, Skills (if provided), Subagent ContextMemory Recall, Documentation, User Identity, Reply Tags, Messaging, Silent Replies, Heartbeats, Model Aliases, OpenClaw Self-Update`none`Rare/experimentalIdentity line onlyAll sections
**Mode Selection Logic:**

```
full (default)

minimal

none

promptMode

Return full prompt
All sections included

Return minimal prompt
Filtered for subagents

Return identity line
'You are a personal assistant
running inside OpenClaw.'
```

**Minimal Mode Rationale:** Subagents inherit context from the parent session and don't need user identity, heartbeats, or messaging guidance. Skills are still included when `skillsPrompt` is provided (for cron sessions). The `extraSystemPrompt` parameter is labeled as "Subagent Context" instead of "Group Chat Context" when `promptMode="minimal"`.

**Sources:**[src/agents/system-prompt.ts16-17](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L16-L17)[src/agents/system-prompt.ts379-420](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L379-L420)[src/agents/system-prompt.test.ts96-133](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.test.ts#L96-L133)[docs/concepts/system-prompt.md35-50](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md#L35-L50)

---

## System Prompt Sections

The following table lists all hardcoded sections that may appear in the system prompt, their conditions, and the builder function responsible for each.
SectionConditionBuilder / LinesDescription**Identity**AlwaysHardcoded line"You are a personal assistant running inside OpenClaw."**Tooling**Always (except `none`)[system-prompt.ts422-448](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L422-L448)Lists available tools + summaries (filtered by policy)**Tool Call Style**Not `minimal`[system-prompt.ts461-467](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L461-L467)Default: don't narrate routine tool calls**Safety**Always (except `none`)[system-prompt.ts394-400](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L394-L400)"You have no independent goals..." guardrails**OpenClaw CLI Quick Reference**Not `minimal`[system-prompt.ts469-477](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L469-L477)`openclaw gateway start/stop/restart`**Skills**`skillsPrompt` provided[`buildSkillsSection`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildSkillsSection`)()Available skills list + read-on-demand instructions**Memory Recall**`memory_search` or `memory_get` available, not `minimal`[`buildMemorySection`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildMemorySection`)()Guidance on using memory tools + citations mode**OpenClaw Self-Update**`gateway` tool + not `minimal`[system-prompt.ts481-491](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L481-L491)`config.apply`, `config.patch`, `update.run` guidance**Model Aliases**`modelAliasLines` provided, not `minimal`[system-prompt.ts494-503](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L494-L503)Prefer aliases like "opus" over full provider/model**Workspace**Always (except `none`)[system-prompt.ts507-511](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L507-L511)Working directory + sandbox path distinction**Documentation**`docsPath` provided, not `minimal`[`buildDocsSection`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildDocsSection`)()Local docs path, mirror, community links**Sandbox**`sandboxInfo.enabled`[system-prompt.ts513-560](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L513-L560)Container workdir, elevated exec, browser bridge**Authorized Senders**`ownerNumbers` provided, not `minimal`[`buildUserIdentitySection`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildUserIdentitySection`)()Hashed or raw owner IDs**Current Date & Time**`userTimezone` provided[`buildTimeSection`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildTimeSection`)()Time zone only (not current time, for cache stability)**Workspace Files (injected)**Always (except `none`)[system-prompt.ts565-567](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L565-L567)Header for bootstrap context**Reply Tags**Not `minimal`[`buildReplyTagsSection`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildReplyTagsSection`)()`[[reply_to_current]]` syntax**Messaging**Not `minimal`[`buildMessagingSection`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildMessagingSection`)()`message` tool usage, inline buttons, cross-session sends**Voice (TTS)**`ttsHint` provided, not `minimal`[`buildVoiceSection`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildVoiceSection`)()TTS guidance**Group Chat Context** / **Subagent Context**`extraSystemPrompt` provided[system-prompt.ts580-585](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L580-L585)Custom injected context (header varies by mode)**Reactions**`reactionGuidance` provided[system-prompt.ts586-608](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L586-L608)Minimal or extensive reaction frequency**Reasoning Format**`reasoningTagHint` enabled[system-prompt.ts352-363](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L352-L363)[system-prompt.ts609-611](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L609-L611)`` + `<final>...</final>` tags**Project Context**`contextFiles` present or truncation warnings[system-prompt.ts613-646](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L613-L646)Injected bootstrap files (AGENTS.md, SOUL.md, etc.)**Silent Replies**Not `minimal`[system-prompt.ts649-664](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L649-L664)`[SILENT_REPLY_TOKEN]` rules**Heartbeats**Not `minimal`[system-prompt.ts666-677](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L666-L677)Heartbeat ack behavior**Runtime**Always (except `none`)[`buildRuntimeLine`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildRuntimeLine`)()`agent=X
**Sources:**[src/agents/system-prompt.ts189-686](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L189-L686)[src/agents/system-prompt.ts20-187](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L20-L187)

---

## Bootstrap Context Injection

Bootstrap files are workspace files that are automatically loaded and injected into the **Project Context** section of the system prompt. This allows the agent to see identity, preferences, and memory without requiring explicit `read` tool calls.

### Bootstrap File Loading

```
Output

buildBootstrapContextFiles

Workspace Files

AGENTS.md

SOUL.md

TOOLS.md

IDENTITY.md

USER.md

HEARTBEAT.md

MEMORY.md or memory.md

BOOTSTRAP.md

Read files from workspace

Filter for subagents
(keep AGENTS.md, TOOLS.md only)

Truncate each file
bootstrapMaxChars (20000)

Apply total cap
bootstrapTotalMaxChars (150000)

Build truncation warnings
bootstrapPromptTruncationWarning

EmbeddedContextFile[]
{path, content}

bootstrapTruncationWarningLines
```

**Bootstrap File Rules:**

1. **Main sessions** inject all bootstrap files found in workspace
2. **Subagent sessions** only inject `AGENTS.md` and `TOOLS.md` (filtered via [`buildBootstrapContextFiles`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildBootstrapContextFiles`)())
3. **Per-file cap**: Each file is truncated to `bootstrapMaxChars` (default 20,000 characters)
4. **Total cap**: All injected content combined is capped at `bootstrapTotalMaxChars` (default 150,000 characters)
5. **Truncation warnings**: When `bootstrapPromptTruncationWarning` is enabled (`once` or `always`), a warning block is injected into Project Context showing which files were truncated and by how much

**Special Handling:**

- **SOUL.md**: When detected (case-insensitive basename check), the prompt includes: *"If SOUL.md is present, embody its persona and tone. Avoid stiff, generic replies; follow its guidance unless higher-priority instructions override it."* ([system-prompt.ts623-633](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L623-L633))
- **MEMORY.md**: Both `MEMORY.md` and `memory.md` are injected if present (case-sensitive check)
- **BOOTSTRAP.md**: Only injected for brand-new workspaces (not re-injected after initial setup)
- **memory/*.md daily files**: **Not** injected automatically; accessed on-demand via `memory_search` and `memory_get` tools

**Configuration:**

```
agents.defaults.bootstrapMaxChars          // Default: 20000
agents.defaults.bootstrapTotalMaxChars     // Default: 150000
agents.defaults.bootstrapPromptTruncationWarning  // "off" | "once" | "always"
```

**Sources:**[src/agents/pi-embedded-helpers/bootstrap.ts1-11](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers/bootstrap.ts#L1-L11)[docs/concepts/system-prompt.md51-88](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md#L51-L88)[src/agents/system-prompt.ts613-646](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L613-L646)

---

## Tool Summaries

The **Tooling** section lists all tools available to the agent, filtered by policy (global, agent-level, group-level, sandbox, subagent). Tool names are case-sensitive and displayed exactly as provisioned.

### Tool Summary Assembly

```
Output

Assembly Logic

Core Summaries

Input

params.toolNames
(from createOpenClawCodingTools)

params.toolSummaries
(external tool descriptions)

coreToolSummaries
read, write, edit, exec,
memory_search, sessions_spawn, etc.

Dedupe by lowercase
preserve caller casing

Apply toolOrder[]
read, write, edit, grep, find, ls,
exec, process, web_search, etc.

Append extra tools
(sorted, not in toolOrder)

Format as
'- toolName: summary'

Array of formatted lines
injected into Tooling section
```

**Core Tool Summaries** ([system-prompt.ts240-272](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L240-L272)):

- `read`: "Read file contents"
- `write`: "Create or overwrite files"
- `edit`: "Make precise edits to files"
- `apply_patch`: "Apply multi-file patches"
- `exec`: "Run shell commands (pty available for TTY-required CLIs)"
- `process`: "Manage background exec sessions"
- `memory_search`: Varies based on ACP runtime state
- `sessions_spawn`: Varies based on ACP runtime state
- `subagents`: "List, steer, or kill sub-agent runs for this requester session"
- `session_status`: "Show a /status-equivalent status card..."
- `image`: "Analyze an image with the configured image model"
- ... (see full map in [system-prompt.ts240-272](https://github.com/openclaw/openclaw/blob/8873e13f/system-prompt.ts#L240-L272))

**ACP-Aware Summaries:** When `acpSpawnRuntimeEnabled` is true (not sandboxed + ACP enabled), tool summaries for `agents_list`, `sessions_spawn`, and related tools include ACP harness guidance. When sandboxed, ACP spawn references are omitted and a sandbox blocking note is added.

**Tool Ordering:** Tools are sorted by `toolOrder` array for consistent display. Extra tools (not in `toolOrder`) are appended alphabetically.

**Sources:**[src/agents/system-prompt.ts240-339](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L240-L339)[src/agents/system-prompt.ts422-448](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L422-L448)

---

## Runtime Information

The **Runtime** section is a single-line summary of the current execution context, built by [`buildRuntimeLine()`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildRuntimeLine()`)().

**Format:**

```
Runtime: agent=<agentId> | host=<hostname> | repo=<repoRoot> | os=<os> (<arch>) | node=<version> | model=<modelId> | default_model=<defaultModel> | shell=<shell> | channel=<channel> | capabilities=<cap1,cap2,...> | thinking=<thinkLevel>

```

**Components:**
FieldSourceExample`agent``runtimeInfo.agentId``agent=work``host``runtimeInfo.host``host=macbook-pro.local``repo``runtimeInfo.repoRoot``repo=/Users/me/openclaw``os``runtimeInfo.os` + `runtimeInfo.arch``os=macOS (arm64)``node``runtimeInfo.node``node=v20.11.0``model``runtimeInfo.model``model=anthropic/claude-sonnet-4``default_model``runtimeInfo.defaultModel``default_model=anthropic/claude-sonnet-3-5``shell``runtimeInfo.shell``shell=/bin/zsh``channel``runtimeInfo.channel``channel=telegram``capabilities``runtimeInfo.capabilities``capabilities=inlineButtons,reactions``thinking``defaultThinkLevel``thinking=off`
All fields are optional; only non-empty values appear in the final line.

**Additional Runtime Context:**

The **Reasoning** line follows the Runtime line and shows the current reasoning visibility level:

```
Reasoning: <reasoningLevel> (hidden unless on/stream). Toggle /reasoning; /status shows Reasoning when enabled.

```

**Sources:**[src/agents/system-prompt.ts688-725](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L688-L725)[src/agents/system-prompt.ts679-684](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L679-L684)

---

## Configuration Parameters

The `buildAgentSystemPrompt()` function accepts extensive configuration through its parameters. Key parameters:
ParameterTypePurpose`workspaceDir``string`Required. Agent workspace directory.`promptMode``PromptMode``"full"` | `"minimal"` | `"none"`. Default: `"full"`.`toolNames``string[]`Available tool names (case-sensitive).`toolSummaries``Record<string, string>`External tool descriptions.`contextFiles``EmbeddedContextFile[]`Bootstrap files to inject.`sandboxInfo``EmbeddedSandboxInfo`Sandbox runtime details (enabled, paths, browser, elevated).`runtimeInfo``{agentId, host, os, arch, node, model, shell, channel, capabilities}`Runtime metadata for Runtime line.`skillsPrompt``string`Available skills XML block.`docsPath``string`Local OpenClaw docs directory path.`userTimezone``string`User timezone (e.g., `"America/Chicago"`).`ownerNumbers``string[]`Authorized sender IDs (phone numbers, etc.).`ownerDisplay``"raw"` | `"hash"`Display mode for owner IDs.`ownerDisplaySecret``string`HMAC secret for hashing owner IDs.`modelAliasLines``string[]`Model alias display lines.`reasoningTagHint``boolean`Enable `<think>/<final>` tag instructions.`reasoningLevel``ReasoningLevel``"off"` | `"on"` | `"stream"`.`defaultThinkLevel``ThinkLevel`Thinking level for Runtime line.`extraSystemPrompt``string`Custom context (Group Chat Context or Subagent Context).`workspaceNotes``string[]`Additional workspace guidance lines.`ttsHint``string`Voice (TTS) guidance.`messageToolHints``string[]`Additional message tool guidance.`reactionGuidance``{level, channel}`Reaction frequency guidance.`memoryCitationsMode``MemoryCitationsMode``"on"` | `"off"`. Controls citation display.`acpEnabled``boolean`Include ACP harness guidance. Default: `true`.`bootstrapTruncationWarningLines``string[]`Truncation warning lines.
**Sources:**[src/agents/system-prompt.ts189-236](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L189-L236)

---

## Context Injection Hook

The bootstrap file loading step can be intercepted by internal hooks via the `agent:bootstrap` hook. This allows plugins or runtime logic to:

- Replace `SOUL.md` with an alternate persona
- Inject additional context files not in the workspace
- Mutate or filter loaded files before injection

**Hook Invocation:** The hook is called by [`buildBootstrapContextFiles()`](https://github.com/openclaw/openclaw/blob/8873e13f/`buildBootstrapContextFiles()`)() (implementation exported from [src/agents/pi-embedded-runner.ts2](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts#L2-L2)).

**Sources:**[docs/concepts/system-prompt.md84-86](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md#L84-L86)

---

## Time Zone Handling

The system prompt includes **only the time zone** in the "Current Date & Time" section, not the current time or date. This design choice preserves **prompt cache stability**—including dynamic timestamps would invalidate the cache on every request.

**Guidance to Agent:**

```
If you need the current date, time, or day of week, run session_status (📊 session_status).

```

The `session_status` tool returns a status card that includes a timestamp line with the current date/time formatted according to `agents.defaults.timeFormat` (`auto`, `12`, or `24`).

**Why no timestamp in system prompt?**

- Prompt caching (especially Anthropic's) relies on stable system prompts
- Dynamic content (like timestamps) invalidates the cache every turn
- Gateway-level timestamp injection into messages is the preferred approach (see issue references in test comments)

**Sources:**[src/agents/system-prompt.ts97-102](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L97-L102)[src/agents/system-prompt.test.ts409-426](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.test.ts#L409-L426)[docs/concepts/system-prompt.md89-104](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md#L89-L104)

---

# Model-Providers-&-Authentication

# Model Configuration & Authentication
Relevant source files
- [docs/concepts/typing-indicators.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/typing-indicators.md)
- [docs/gateway/doctor.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/doctor.md)
- [src/agents/auth-profiles.runtime-snapshot-save.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles.runtime-snapshot-save.test.ts)
- [src/agents/auth-profiles/oauth.openai-codex-refresh-fallback.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.openai-codex-refresh-fallback.test.ts)
- [src/agents/auth-profiles/oauth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.test.ts)
- [src/agents/auth-profiles/oauth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.ts)
- [src/agents/bash-tools.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.test.ts)
- [src/agents/model-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-auth.ts)
- [src/agents/models-config.providers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts)
- [src/agents/pi-embedded-runner/compact.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/compact.ts)
- [src/agents/pi-embedded-runner/run.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts)
- [src/agents/pi-embedded-runner/run/attempt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/attempt.ts)
- [src/agents/pi-embedded-runner/run/params.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/params.ts)
- [src/agents/pi-embedded-runner/run/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run/types.ts)
- [src/agents/pi-embedded-runner/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/system-prompt.ts)
- [src/agents/pi-tools-agent-config.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools-agent-config.test.ts)
- [src/auto-reply/reply/agent-runner-execution.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-execution.ts)
- [src/auto-reply/reply/agent-runner-memory.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-memory.ts)
- [src/auto-reply/reply/agent-runner-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-utils.test.ts)
- [src/auto-reply/reply/agent-runner-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner-utils.ts)
- [src/auto-reply/reply/agent-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.ts)
- [src/auto-reply/reply/followup-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/followup-runner.ts)
- [src/auto-reply/reply/test-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/test-helpers.ts)
- [src/auto-reply/reply/typing-mode.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/typing-mode.ts)
- [src/browser/control-auth.auto-token.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.auto-token.test.ts)
- [src/browser/control-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.test.ts)
- [src/browser/control-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/browser/control-auth.ts)
- [src/cli/program/register.onboard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program/register.onboard.ts)
- [src/commands/auth-choice-options.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.test.ts)
- [src/commands/auth-choice-options.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.ts)
- [src/commands/auth-choice.apply.api-providers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.apply.api-providers.ts)
- [src/commands/auth-choice.preferred-provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.preferred-provider.ts)
- [src/commands/auth-choice.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.test.ts)
- [src/commands/auth-choice.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.ts)
- [src/commands/configure.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/configure.ts)
- [src/commands/doctor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/doctor.ts)
- [src/commands/onboard-auth.config-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.config-core.ts)
- [src/commands/onboard-auth.credentials.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.credentials.ts)
- [src/commands/onboard-auth.models.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.models.ts)
- [src/commands/onboard-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.test.ts)
- [src/commands/onboard-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.ts)
- [src/commands/onboard-non-interactive.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-non-interactive.ts)
- [src/commands/onboard-non-interactive/local/auth-choice.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-non-interactive/local/auth-choice.ts)
- [src/commands/onboard-types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-types.ts)
- [src/gateway/startup-auth.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/startup-auth.test.ts)
- [src/gateway/startup-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/startup-auth.ts)
- [src/wizard/onboarding.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/wizard/onboarding.ts)

This page covers how OpenClaw configures AI model providers, stores and resolves credentials, selects primary and fallback models, and exposes the `openclaw models` CLI commands. It applies to the agent-side model API (Anthropic, OpenAI, Ollama, etc.).

For **Gateway authentication** (WebSocket token, password, Tailscale), see page [2.2](/openclaw/openclaw/2.2-authentication-and-device-pairing). For the full `openclaw.json` configuration reference, see page [2.3.1](/openclaw/openclaw/2.3.1-configuration-reference).

---

## Auth Profiles

Credentials for model providers are stored in `auth-profiles.json`, located in the agent directory (`~/.openclaw/agents/<agentId>/agent/auth-profiles.json`). The file is managed by `upsertAuthProfile` and read by `ensureAuthProfileStore`, both in [src/agents/auth-profiles.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles.js)

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

This is activated by the `--secret-input-mode ref` flag in `openclaw onboard` / `openclaw configure`, which calls `resolveApiKeySecretInput` in [src/commands/onboard-auth.credentials.ts52-70](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.credentials.ts#L52-L70)

Sources: [src/agents/model-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-auth.ts)[src/commands/onboard-auth.credentials.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.credentials.ts)

---

## Auth Modes by Provider

The `AuthChoice` union type in [src/commands/onboard-types.ts5-53](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-types.ts#L5-L53) enumerates every supported auth flow. The onboarding wizard (`openclaw onboard`) and the `openclaw configure` command both resolve these choices via `applyAuthChoice` in [src/commands/auth-choice.apply.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice.apply.js)

### Common Provider Auth Flows
Auth ChoiceProfile TypeProfile IDMechanism`apiKey``api_key``anthropic:default`Anthropic API key`token``token``anthropic:<name>`Anthropic setup-token (from `claude setup-token`)`openai-api-key``api_key``openai:default`OpenAI API key`openai-codex``oauth``openai-codex:<email>`OpenAI Codex OAuth (ChatGPT subscription)`gemini-api-key``api_key``google:default`Google Gemini API key`google-gemini-cli``oauth``google:<email>`Gemini CLI OAuth (unofficial)`github-copilot``oauth``github-copilot:*`GitHub device-flow OAuth`openrouter-api-key``api_key``openrouter:default`OpenRouter API key`minimax-api``api_key``minimax:default`MiniMax API key`minimax-portal``oauth``minimax-portal:*`MiniMax OAuth`moonshot-api-key``api_key``moonshot:default`Moonshot (Kimi) API key`vllm``api_key``vllm:default`vLLM (any value)
For OAuth providers, `writeOAuthCredentials` in [src/commands/onboard-auth.credentials.ts153-199](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.credentials.ts#L153-L199) handles persisting the credentials and broadcasting to sibling agent directories when `syncSiblingAgents` is set.

### Anthropic Setup-Token Flow

The setup-token is a long-lived credential generated by the Claude Code CLI (`claude setup-token`). It is stored as a `token`-type profile rather than `api_key`. The flow:

1. Run `claude setup-token` on any machine.
2. Copy the token string.
3. In the wizard, select "Anthropic token (paste setup-token)" or run:

```
openclaw models auth paste-token --provider anthropic

```
4. `validateAnthropicSetupToken` in [src/commands/auth-token.ts39-65](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-token.ts#L39-L65) validates the format before it is stored via `upsertAuthProfile`.

Sources: [src/commands/onboard-types.ts5-53](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-types.ts#L5-L53)[src/commands/auth-choice-options.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.ts)[src/commands/onboard-auth.credentials.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-auth.credentials.ts)[src/commands/auth-token.ts39-65](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-token.ts#L39-L65)

---

## OAuth Token Refresh

OAuth credentials for providers like OpenAI Codex, Google Gemini CLI, GitHub Copilot, Chutes, Qwen Portal, and MiniMax Portal require periodic token refresh. The `refreshOAuthTokensForProfile` function in [src/agents/auth-profiles/oauth.ts27-213](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.ts#L27-L213) handles refresh logic for all OAuth providers.

### OAuth Refresh Flow

```
no (api_key/token)

yes

missing_expiry

valid

expired

expiring_soon

openai-codex,
anthropicweb,
minimax-portal

qwen-portal

chutes

other

getApiKeyForModel(model, cfg, profileId)

profile.type
=== 'oauth'?

return profile.key or profile.token

resolveTokenExpiryState(profile)

expiry
state?

return profile.access
(assume valid)

refreshOAuthTokensForProfile(store, profileId, cfg)

profile.provider?

getOAuthApiKey(provider, profile.refresh)
pi-ai OAuth refresh

refreshQwenPortalCredentials(profile)

refreshChutesTokens(profile.refresh)

return profile.access
(no refresh logic)

upsertAuthProfile:
update access, refresh, expires

return refreshed access token
```

### GitHub Copilot Token Management

GitHub Copilot OAuth tokens expire hourly and require proactive refresh. The `runEmbeddedPiAgent` execution path manages a refresh timer for Copilot sessions [src/agents/pi-embedded-runner/run.ts431-529](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L431-L529):

1. **Initial Token Fetch**: `resolveCopilotApiToken(githubToken)` exchanges the GitHub token for a Copilot API token with expiry timestamp.
2. **Schedule Refresh**: `scheduleCopilotRefresh()` sets a timer to refresh 5 minutes before expiry (`COPILOT_REFRESH_MARGIN_MS`).
3. **Refresh on Error**: If an API call fails with auth error and Copilot is the provider, `maybeRefreshCopilotForAuthError`[src/agents/pi-embedded-runner/run.ts702-775](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L702-L775) immediately refreshes the token and retries.
4. **Cleanup**: `stopCopilotRefreshTimer()` cancels the timer when the run completes.

The refresh timer persists across tool calls within a single agent turn, ensuring the token remains valid throughout execution.

Sources: [src/agents/auth-profiles/oauth.ts27-213](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles/oauth.ts#L27-L213)[src/agents/pi-embedded-runner/run.ts431-775](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L431-L775)[src/providers/github-copilot-token.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/providers/github-copilot-token.ts)

---

## Auth Resolution at Runtime

When the agent attempts a model call, `getApiKeyForModel` in [src/agents/model-auth.ts135-233](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-auth.ts#L135-L233) resolves credentials by checking sources in priority order. The runtime execution in `runEmbeddedPiAgent`[src/agents/pi-embedded-runner/run.ts253-1450](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L253-L1450) manages profile selection, cooldown tracking, and auth profile advancement on failures.

**Title: Auth Profile Selection in `runEmbeddedPiAgent`**

```
yes

no

yes + transient

yes + permanent

no

yes

no

runEmbeddedPiAgent
begin auth resolution

ensureAuthProfileStore(agentDir)

preferredProfileId = params.authProfileId

authProfileIdSource
=== 'user'?

lockedProfileId = preferredProfileId
if provider matches

resolveAuthProfileOrder(cfg, store, provider, preferredProfile)

profileCandidates = locked ? [locked] : profileOrder
or [undefined] if empty

check all auto profiles:
isProfileInCooldown(store, profileId)?

all in
cooldown?

allowTransientCooldownProbe:
try cooldowned profile anyway
for rate_limit/overloaded

throw FailoverError:
No available auth profile

profileIndex = 0

while profileIndex < candidates.length:
skip profiles in cooldown
(unless probe allowed)

applyApiKeyInfo(candidate)
resolve API key or OAuth token

provider ===
github-copilot?

resolveCopilotApiToken(githubToken)
fetch Copilot token
schedule refresh timer

authStorage.setRuntimeApiKey(provider, apiKey)

runEmbeddedAttempt:
execute agent turn
```

**Title: Auth Profile Failure Tracking & Cooldown**

```
yes

no

API error
(401, 429, 503, timeout)

classifyFailoverReason(errorMessage)
returns: auth, rate_limit, overloaded, timeout, ...

markAuthProfileFailure(store, profileId, reason)

store.cooldowns[profileId] = {
reason,
failedAt: Date.now(),
cooldownMs: 60000 (rate_limit)
| 30000 (overloaded)
| 120000 (auth)
}

next agent turn:
isProfileInCooldown(store, profileId)

Date.now() < failedAt
+ cooldownMs?

skip profile
(or probe if transient)

profile eligible again

successful API call:
markAuthProfileGood(store, profileId)

delete store.cooldowns[profileId]
markAuthProfileUsed(store, profileId)
```

Sources: [src/agents/pi-embedded-runner/run.ts253-1450](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/run.ts#L253-L1450)[src/agents/model-auth.ts135-233](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-auth.ts#L135-L233)[src/agents/auth-profiles.ts17-383](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/auth-profiles.ts#L17-L383)

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
A common misconfiguration is setting `apiKey: "${ENV_VAR}"` instead of `apiKey: "ENV_VAR"`. The `normalizeApiKeyConfig` function in [src/agents/models-config.providers.ts387-391](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts#L387-L391) automatically strips the `${}` wrapper.

### `models.json` and the Merge Pipeline

`ensureOpenClawModelsJson` in [src/agents/models-config.ts113-199](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.ts#L113-L199) is the central routine that generates `models.json` in the agent directory. It runs on gateway startup and on config reload.

**Title: models.json Generation Pipeline in `ensureOpenClawModelsJson`**

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

Sources: [src/agents/models-config.ts113-199](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.ts#L113-L199)[src/agents/models-config.providers.ts904-1060](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts#L904-L1060)

### Implicit Provider Registration

`resolveImplicitProviders` in [src/agents/models-config.providers.ts904-1060](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts#L904-L1060) auto-registers providers when credentials exist (env var or auth profile) **without** requiring explicit `models.providers` config. For example, if `MINIMAX_API_KEY` is set or a `minimax:default` profile exists in `auth-profiles.json`, the `minimax` provider is automatically registered with its built-in model catalog.

Providers registered implicitly include: `minimax`, `minimax-portal`, `moonshot`, `kimi-coding`, `synthetic`, `venice`, `qwen-portal`, `volcengine`, `byteplus`, `xiaomi`, `cloudflare-ai-gateway`, and others.

### Auto-Discovered Providers (Ollama and vLLM)

**Ollama**: `discoverOllamaModels` in [src/agents/models-config.providers.ts273-332](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts#L273-L332) calls `/api/tags` to list locally running models, then calls `/api/show` on each to query actual context window sizes. It skips discovery in test environments.

**vLLM**: `discoverVllmModels` in [src/agents/models-config.providers.ts334-385](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts#L334-L385) calls `/models` on the configured base URL (default `http://127.0.0.1:8000/v1`).

Both providers require at least a placeholder API key value (any non-empty string) in `auth-profiles.json` or environment variables to trigger registration.

Sources: [src/agents/models-config.providers.ts273-385](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts#L273-L385)[src/agents/models-config.ts113-199](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.ts#L113-L199)

---

## Model Selection

### Model Reference Format

Models are referenced as `<provider>/<model-id>`, e.g.:

- `anthropic/claude-sonnet-4-5`
- `openai-codex/gpt-5.3-codex`
- `openrouter/moonshotai/kimi-k2` (double slash for pass-through providers)
- `ollama/llama3.2`

The `resolveModel` function in [src/agents/pi-embedded-runner/model.ts42-127](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/model.ts#L42-L127) splits on the first `/` to get provider and model ID, then queries the `ModelRegistry` built from `models.json`.

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

This map also acts as an **allowlist**: when `agents.defaults.models` is non-empty, only models listed there can be selected with `/model` in chat. Models not in the allowlist return an error before generating a reply. The built-in alias line builder (`buildModelAliasLines` in [src/agents/pi-embedded-runner/model.ts23](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/model.ts#L23-L23)) injects alias metadata into the system prompt.

**Title: Model Resolution Flow in `resolveModel`**

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

resolveModel(provider, modelId, agentDir, cfg)

'Model not allowed' reply
(no agent run)

modelRegistry.find(provider, modelId)
from models.json

Model object
(api, baseUrl, contextWindow, ...)

buildInlineProviderModels(providers)
from openclaw.json models.providers

resolveForwardCompatModel(provider, modelId)
per-provider fallback logic

provider ==
openrouter?

synthetic fallback Model
OpenRouter pass-through

error: Unknown model: provider/id
```

Sources: [src/agents/pi-embedded-runner/model.ts42-127](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/model.ts#L42-L127)[docs/concepts/models.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/models.md)

---

## The `openclaw models` CLI

The `openclaw models` command group manages model and auth configuration without editing `openclaw.json` directly. Subcommands from [docs/concepts/models.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/models.md):
CommandEffect`openclaw models status`Shows configured providers, auth candidates, model availability`openclaw models list`Lists models from the configured catalog`openclaw models list --all`Full catalog including auto-discovered providers`openclaw models set <provider/model>`Sets `agents.defaults.model.primary``openclaw models set-image <provider/model>`Sets `agents.defaults.imageModel.primary``openclaw models aliases list`Lists all aliases from `agents.defaults.models``openclaw models aliases add <alias> <ref>`Adds an alias entry`openclaw models aliases remove <alias>`Removes an alias entry`openclaw models fallbacks list`Shows `agents.defaults.model.fallbacks``openclaw models fallbacks add <ref>`Appends to fallbacks list`openclaw models fallbacks remove <ref>`Removes from fallbacks list`openclaw models fallbacks clear`Clears all fallbacks`openclaw models scan`Probes configured models for tool and image support
`openclaw models status` calls `openclaw status --deep` internally for provider probe details.

---

## Environment Variables

`resolveEnvApiKey` in [src/agents/model-auth.ts238-269](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-auth.ts#L238-L269) maps provider names to known environment variables. The `PROVIDER_ENV_VARS` map in [src/secrets/provider-env-vars.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/secrets/provider-env-vars.ts) defines the canonical environment variable for each provider. Standard env vars:
ProviderEnvironment Variable(s)`anthropic``ANTHROPIC_API_KEY``openai``OPENAI_API_KEY``google``GEMINI_API_KEY`, `GOOGLE_API_KEY``openrouter``OPENROUTER_API_KEY``ollama``OLLAMA_API_KEY` (any value enables Ollama)`vllm``VLLM_API_KEY``amazon-bedrock``AWS_BEARER_TOKEN_BEDROCK`, `AWS_ACCESS_KEY_ID`+`AWS_SECRET_ACCESS_KEY`, or `AWS_PROFILE``minimax``MINIMAX_API_KEY``moonshot``MOONSHOT_API_KEY``huggingface``HF_TOKEN`, `HUGGINGFACE_HUB_TOKEN``mistral``MISTRAL_API_KEY``xai``XAI_API_KEY`
The label in `openclaw models status` distinguishes "shell env" (loaded from `~/.openclaw/.env` via the daemon env loader) from "env" (already in the process environment).

For the Gateway daemon (`launchd`/`systemd`), env vars not set in the system environment must be placed in `~/.openclaw/.env`. See page [2.3](/openclaw/openclaw/2.3-configuration-system) for env var loading details. The Gateway loads env vars via the shell env loader [src/infra/shell-env.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/shell-env.ts) before spawning the agent runtime.

Sources: [src/agents/model-auth.ts238-269](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-auth.ts#L238-L269)[src/secrets/provider-env-vars.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/secrets/provider-env-vars.ts)[docs/gateway/authentication.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/authentication.md)

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

The onboarding wizard exposes this as `--auth-choice custom-api-key` via `applyCustomApiConfig` in [src/commands/onboard-custom.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/onboard-custom.js) which accepts `--custom-base-url`, `--custom-api-key`, `--custom-model-id`, and `--custom-compatibility openai|anthropic`.

Sources: [src/agents/models-config.providers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/models-config.providers.ts)[src/commands/auth-choice-options.ts184-188](https://github.com/openclaw/openclaw/blob/8873e13f/src/commands/auth-choice-options.ts#L184-L188)

---

# Tools-System

# Tools
Relevant source files
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md)
- [docs/gateway/background-process.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md)
- [src/agents/bash-process-registry.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts)
- [src/agents/bash-process-registry.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts)
- [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts)
- [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers.ts)
- [src/agents/pi-embedded-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts)
- [src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts)

This page covers the agent tool system: how tools are assembled for each agent turn, the policy enforcement pipeline that filters and guards them, workspace root protection, schema normalization, and the full inventory of available tools.

For details on specific tool subsystems, see:

- Exec tool, exec approvals, and PTY support: [3.4.1](/openclaw/openclaw/3.4.1-exec-tool-and-background-processes)
- Memory tools (`memory_search`, `memory_get`): [3.4.2](/openclaw/openclaw/3.4.2-memory-and-search)
- Subagent spawning via `sessions_spawn`: [3.4.3](/openclaw/openclaw/3.4.3-subagents-and-acp)
- How tools are injected into the system prompt: [3.2](/openclaw/openclaw/3.2-system-prompt-and-context)
- Sandbox interaction with tools: [7.2](/openclaw/openclaw/7.2-sandboxing)

---

## Tool Assembly Entry Point

Every agent turn begins by calling `createOpenClawCodingTools` in [src/agents/pi-tools.ts182-544](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L182-L544) This function constructs and returns the complete `AnyAgentTool[]` list that is passed to the model API. It accepts a rich `options` object covering agent identity, model provider, sandbox context, filesystem policy, message routing, and policy overrides.

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

Sources: [src/agents/pi-tools.ts331-543](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L331-L543)

---

## Tool Categories

Tools come from two origins: the upstream `codingTools` set (from `@mariozechner/pi-coding-agent`) and OpenClaw-native tools created in `createOpenClawTools` ([src/agents/openclaw-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/openclaw-tools.ts)).

### Base Coding Tools

The `codingTools` array from `@mariozechner/pi-coding-agent` provides the core filesystem tools. OpenClaw replaces several of these in-place during assembly:
Tool nameReplacement in `createOpenClawCodingTools`Source`read``createOpenClawReadTool` or `createSandboxedReadTool``pi-tools.read.ts``write``createHostWorkspaceWriteTool` or `createSandboxedWriteTool``pi-tools.read.ts``edit``createHostWorkspaceEditTool` or `createSandboxedEditTool``pi-tools.read.ts``bash`**Removed entirely**—`exec`**Removed from base, re-added via `createExecTool`**`bash-tools.ts`
Sources: [src/agents/pi-tools.ts331-373](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L331-L373)

### OpenClaw-Native Tools

`createOpenClawTools` ([src/agents/openclaw-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/openclaw-tools.ts)) adds the following tool groups. These are documented in [docs/tools/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/index.md):
Tool group shorthandTools included`group:runtime``exec`, `bash`, `process``group:fs``read`, `write`, `edit`, `apply_patch``group:sessions``sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn`, `session_status``group:memory``memory_search`, `memory_get``group:web``web_search`, `web_fetch``group:ui``browser`, `canvas``group:automation``cron`, `gateway``group:messaging``message``group:nodes``nodes``group:openclaw`All built-in tools
Additional tools: `image`, `agents_list`, `tts` (voice; excluded when `messageProvider=voice`).

Channel plugins may also contribute tools via `listChannelAgentTools` ([src/agents/channel-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/channel-tools.ts)).

Sources: [docs/tools/index.md141-164](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/index.md#L141-L164)[src/agents/pi-tools.ts454-496](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L454-L496)

---

## Tool Policy Pipeline

Policy enforcement is the most complex part of tool assembly. Multiple independent policy layers are resolved and then applied in sequence via `applyToolPolicyPipeline` ([src/agents/tool-policy-pipeline.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-policy-pipeline.ts)).

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

Sources: [src/agents/pi-tools.ts244-521](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L244-L521)[src/agents/pi-tools.policy.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.policy.ts)[src/agents/tool-policy-pipeline.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-policy-pipeline.ts)[src/agents/tool-policy.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-policy.ts)

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

Sources: [src/agents/pi-tools.ts259-522](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L259-L522)[docs/tools/index.md34-136](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/index.md#L34-L136)

### Tool Profiles

The `tools.profile` setting establishes a base allowlist before explicit `allow`/`deny` lists:
ProfileIncluded tools`minimal``session_status` only`coding``group:fs`, `group:runtime`, `group:sessions`, `group:memory`, `image``messaging``group:messaging`, `sessions_list`, `sessions_history`, `sessions_send`, `session_status``full`No restriction (same as unset)
Per-agent override: `agents.list[].tools.profile`. Provider override: `tools.byProvider[key].profile`.

Sources: [docs/tools/index.md34-80](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/index.md#L34-L80)

---

## Workspace Root Guards

When `tools.fs.workspaceOnly` is `true` (or the agent is sandboxed), filesystem tools are wrapped with guards that enforce path containment. This is done via wrappers defined in [src/agents/pi-tools.read.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.read.ts):
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

Sources: [src/agents/pi-tools.ts331-373](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L331-L373)[src/agents/pi-tools.read.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.read.ts)

The `workspaceRoot` is resolved via `resolveWorkspaceRoot` ([src/agents/workspace-dir.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/workspace-dir.ts)), which uses `options.workspaceDir` or falls back to the configured agent workspace. The filesystem policy itself is created by `createToolFsPolicy` in [src/agents/tool-fs-policy.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-fs-policy.ts)

For `apply_patch`, an analogous flag `applyPatchConfig.workspaceOnly` defaults to `true` and is checked independently:

```
applyPatchWorkspaceOnly = workspaceOnly || applyPatchConfig?.workspaceOnly !== false

```

Sources: [src/agents/pi-tools.ts311-323](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L311-L323)

---

## Exec Tool Configuration

The `exec` tool is constructed via `createExecTool` from [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts) which merges configuration from:

1. Inline `options.exec` overrides (passed directly by the caller)
2. Per-agent exec config (`agents.list[id].tools.exec`)
3. Global exec config (`tools.exec`)

This merging is done by `resolveExecConfig` in [src/agents/pi-tools.ts118-145](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L118-L145) The resulting `execTool` is always included in the assembled list, regardless of policy (policy filtering happens afterward).

The `process` tool (for managing background exec sessions) is created via `createProcessTool` from [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts) with its own `cleanupMs` and `scopeKey`. When `process` is disallowed by policy, `exec` runs synchronously and ignores `yieldMs`/`background` parameters.

Sources: [src/agents/pi-tools.ts374-413](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L374-L413)[docs/tools/index.md188-226](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/index.md#L188-L226)

---

## Schema Normalization and Provider Quirks

After policy filtering, every tool in the list is passed through `normalizeToolParameters` from [src/agents/pi-tools.schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.schema.ts):

- **OpenAI and most providers**: strips root-level union schemas that would be rejected
- **Gemini**: applies `cleanToolSchemaForGemini`, which removes constraint keywords (e.g., `minLength`, `pattern`) that the Gemini API rejects

This is applied uniformly to prevent provider-specific schema rejections at the API layer.

Additionally, two provider-specific gating rules exist in `createOpenClawCodingTools`:

- `apply_patch` is only enabled for OpenAI-family providers (`isOpenAIProvider` check at [src/agents/pi-tools.ts60-63](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L60-L63))
- Anthropic OAuth transport remaps tool names to Claude Code–style names on the wire (handled in `pi-ai`, not in this layer)

Sources: [src/agents/pi-tools.ts524-528](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L524-L528)[src/agents/pi-tools.schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.schema.ts)

---

## Tool Lifecycle Wrappers

After schema normalization, each tool receives two additional wrappers applied in order:

**`wrapToolWithBeforeToolCallHook`** ([src/agents/pi-tools.before-tool-call.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.before-tool-call.ts)):

- Intercepts every tool call before execution
- Runs loop detection logic (see below)
- Receives `agentId`, `sessionKey`, and `loopDetection` config

**`wrapToolWithAbortSignal`** ([src/agents/pi-tools.abort.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.abort.ts)):

- Wraps tool execution with an `AbortSignal`
- Only applied when `options.abortSignal` is provided
- Throws on signal abort before or during tool execution

Sources: [src/agents/pi-tools.ts529-541](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L529-L541)

---

## Tool-Call Loop Detection

Loop detection is configured via `tools.loopDetection` in `openclaw.json` and resolved per-agent by `resolveToolLoopDetectionConfig` in [src/agents/pi-tools.ts147-172](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L147-L172):

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

Sources: [src/agents/pi-tools.ts147-172](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L147-L172)[docs/tools/index.md228-255](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/index.md#L228-L255)

---

## Sandbox Integration

When `options.sandbox` is provided and `sandbox.enabled` is `true`, tool assembly adapts in several ways:

- `read`, `write`, `edit` use sandboxed variants that route through `sandboxFsBridge`
- The filesystem root for path guards becomes `sandboxRoot` (the container workspace path)
- `exec` receives a `sandbox` object with `containerName`, `workspaceDir`, `containerWorkdir`, and Docker env
- `apply_patch` is only created when `allowWorkspaceWrites` (i.e., `sandbox.workspaceAccess !== "ro"`)
- Plugin tool allowlist is computed from `sandbox.tools.allow` as an additional pipeline step

The `SandboxContext` type is defined in [src/agents/sandbox.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/sandbox.ts)

Sources: [src/agents/pi-tools.ts241-328](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L241-L328)[src/agents/pi-tools.ts400-450](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L400-L450)

---

## Tool Display Metadata

Tool call display in the Control UI is driven by [src/agents/tool-display.json](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-display.json) which maps tool names to emoji, display titles, and which parameter keys to extract for the detail label. For example:
ToolEmojiDetail keys`exec`🛠️`command``read`📖`path``browser`🌐action-specific (e.g., `targetUrl`)`nodes`📱action-specific (e.g., `node`, `facing`)`cron`⏰action-specific`sessions_spawn`🤖`task`, `agentId`, `mode`
A `fallback` entry handles any tool not explicitly listed.

Sources: [src/agents/tool-display.json1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-display.json#L1-L50)

---

## Key Types and Files Reference
SymbolFileRole`createOpenClawCodingTools`[src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)Main tool assembly entry point`AnyAgentTool``src/agents/pi-tools.types.ts`Union type for all tool objects`resolveEffectiveToolPolicy``src/agents/pi-tools.policy.ts`Resolves global/agent/provider policies`resolveGroupToolPolicy``src/agents/pi-tools.policy.ts`Resolves channel-level group restrictions`resolveSubagentToolPolicy``src/agents/pi-tools.policy.ts`Depth-based subagent tool restrictions`applyToolPolicyPipeline``src/agents/tool-policy-pipeline.ts`Applies ordered policy steps to tool list`applyOwnerOnlyToolPolicy``src/agents/tool-policy.ts`Gates owner-only tools on `senderIsOwner``resolveToolProfilePolicy``src/agents/tool-policy.ts`Converts a profile string to an allow set`mergeAlsoAllowPolicy``src/agents/tool-policy.ts`Merges `alsoAllow` extension into a profile policy`wrapToolWorkspaceRootGuard``src/agents/pi-tools.read.ts`Enforces path containment (host mode)`createToolFsPolicy``src/agents/tool-fs-policy.ts`Creates the fs policy object from config`resolveWorkspaceRoot``src/agents/workspace-dir.ts`Resolves the effective workspace root path`normalizeToolParameters``src/agents/pi-tools.schema.ts`Provider-aware JSON Schema normalization`cleanToolSchemaForGemini``src/agents/pi-tools.schema.ts`Removes Gemini-incompatible schema keywords`wrapToolWithBeforeToolCallHook``src/agents/pi-tools.before-tool-call.ts`Loop detection intercept`wrapToolWithAbortSignal``src/agents/pi-tools.abort.ts`Abort signal wrapper`createExecTool``src/agents/bash-tools.ts`Creates the `exec` tool`createProcessTool``src/agents/bash-tools.ts`Creates the `process` tool`createApplyPatchTool``src/agents/apply-patch.ts`Creates the `apply_patch` tool`createOpenClawTools``src/agents/openclaw-tools.ts`Creates all OpenClaw-native tools`listChannelAgentTools``src/agents/channel-tools.ts`Returns channel plugin–contributed tools`resolveExecConfig`[src/agents/pi-tools.ts118-145](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L118-L145)Merges global + agent exec configuration`resolveToolLoopDetectionConfig`[src/agents/pi-tools.ts147-172](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L147-L172)Merges global + agent loop detection config

---

# Exec-Tool-&-Background-Processes

# Exec Tool & Background Processes
Relevant source files
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md)
- [docs/gateway/background-process.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md)
- [src/agents/bash-process-registry.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts)
- [src/agents/bash-process-registry.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts)
- [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts)
- [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers.ts)
- [src/agents/pi-embedded-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts)
- [src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts)

This page documents the `exec` and `process` tools, which enable shell command execution and background job management within OpenClaw agents. The `exec` tool spawns shell commands with configurable timeout and backgrounding behavior, while the `process` tool manages long-running sessions through polling, stdin writes, and lifecycle control.

For tool policy and filtering, see [Tools System](/openclaw/openclaw/3.4-tools-system). For sandbox isolation of exec commands, see [Sandboxing](/openclaw/openclaw/7.2-sandboxing). For exec-related configuration fields, see [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference).

---

## Architecture Overview

The exec and process tools form a paired system: `exec` spawns commands and optionally backgrounds them, while `process` manages backgrounded sessions. The background process registry maintains in-memory state for running and finished sessions.

**Diagram: Exec and Process Tool Architecture**

```
addSession()

appendOutput()
markExited()
markBackgrounded()

getSession()
drainSession()
listRunningSessions()

markExited() +
backgrounded=true

pruneFinishedSessions()
(after jobTtlMs)

exec tool
(bash-tools.exec.js)

process tool
(bash-tools.process.js)

BashProcessRegistry
(bash-process-registry.ts)

runningSessions
Map<string, ProcessSession>

finishedSessions
Map<string, FinishedSession>

TTL Sweeper
(setInterval)
```

**Sources:**[src/agents/bash-tools.ts1-10](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts#L1-L10)[src/agents/bash-process-registry.ts73-310](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L73-L310)

---

## Exec Tool

The `exec` tool spawns shell commands via `child_process.spawn` with support for PTY allocation, background execution, elevated mode (host execution from sandbox), and output capture. It is exposed to agents through the tool schema and delegates session management to the process registry.

### Parameters
ParameterTypeDefaultDescription`command``string`(required)Shell command to execute`yieldMs``number``10000` (via config)Auto-background after this duration (milliseconds)`background``boolean``false`Immediately background the command`timeout``number``1800` (via config)Kill process after timeout (seconds)`elevated``boolean``false`Run on host (if elevated mode enabled and allowed)`pty``boolean``false`Allocate a pseudo-TTY (for interactive CLIs)`workdir``string`(agent workspace)Working directory for execution`env``Record<string, string>`(inherited + overrides)Environment variables
**Sources:**[docs/gateway/background-process.md14-31](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L14-L31)[src/agents/pi-tools.ts394-428](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L394-L428)

### Behavior

1. **Foreground execution**: When `yieldMs` is not exceeded and `background` is `false`, the tool returns full stdout/stderr upon completion.
2. **Background execution**: When `yieldMs` expires or `background` is `true`, the tool returns `status: "running"`, a `sessionId`, and a short tail of output. The session is registered in the process registry.
3. **Fallback to synchronous**: If the `process` tool is disallowed by policy, `exec` ignores `yieldMs` and `background` and runs synchronously to completion.
4. **Environment marker**: Spawned processes receive `OPENCLAW_SHELL=exec` to enable context-aware shell profile logic.

**Sources:**[docs/gateway/background-process.md26-31](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L26-L31)[src/agents/bash-tools.ts1-10](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts#L1-L10)

### Return Formats

**Foreground completion:**

```
{
  "status": "completed",
  "exitCode": 0,
  "stdout": "...",
  "stderr": "...",
  "truncated": false
}
```

**Backgrounded:**

```
{
  "status": "running",
  "sessionId": "abc123",
  "pid": 12345,
  "tail": "..."
}
```

**Sources:**[docs/gateway/background-process.md26-31](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L26-L31)

---

## Process Tool

The `process` tool manages backgrounded exec sessions through a set of actions. Sessions are scoped per `scopeKey` (typically per session or agent), so agents only see their own background jobs.

### Actions
ActionParametersDescription`list`(none)List running and finished sessions`poll``sessionId`Drain new output since last poll; reports exit status if finished`log``sessionId`, `offset?`, `limit?`Read aggregated output (line-based pagination)`write``sessionId`, `data`, `eof?`Send data to stdin; optionally close stdin with `eof: true``kill``sessionId`Terminate a running session (SIGTERM, then SIGKILL)`clear``sessionId`Remove a finished session from memory`remove``sessionId`Kill if running, otherwise clear if finished
**Sources:**[docs/gateway/background-process.md54-73](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L54-L73)[src/agents/bash-process-registry.ts86-103](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L86-L103)

### List Output Format

The `list` action returns a derived `name` field (command verb + target) for quick identification:

```
{
  "running": [
    {
      "id": "abc123",
      "command": "npm run build",
      "name": "npm: build",
      "pid": 12345,
      "startedAt": 1699999999000,
      "cwd": "/workspace"
    }
  ],
  "finished": [
    {
      "id": "def456",
      "command": "git pull",
      "name": "git: pull",
      "status": "completed",
      "exitCode": 0,
      "startedAt": 1699999998000,
      "endedAt": 1699999999000
    }
  ]
}
```

**Sources:**[docs/gateway/background-process.md54-73](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L54-L73)

### Log Pagination

The `log` action uses line-based `offset` and `limit`:

- **Default (no offset/limit):** Returns last 200 lines with a paging hint.
- **With offset only:** Returns from `offset` to end (uncapped).
- **With both:** Returns `limit` lines starting at `offset`.

**Sources:**[docs/gateway/background-process.md72-73](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L72-L73)

---

## Background Process Registry

The registry is implemented in [src/agents/bash-process-registry.ts1-310](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L1-L310) and maintains two in-memory maps:

**Diagram: Process Registry Data Structures**

```
FinishedSession Fields

ProcessSession Fields

Registry State

runningSessions
Map<string, ProcessSession>

finishedSessions
Map<string, FinishedSession>

id: string
command: string
scopeKey?: string
sessionKey?: string
child?: ChildProcess
stdin?: SessionStdin
pid?: number
startedAt: number
maxOutputChars: number
pendingStdout: string[]
pendingStderr: string[]
aggregated: string
tail: string
exitCode?: number | null
exited: boolean
truncated: boolean
backgrounded: boolean

id: string
command: string
scopeKey?: string
startedAt: number
endedAt: number
status: ProcessStatus
exitCode?: number | null
aggregated: string
tail: string
truncated: boolean
```

**Sources:**[src/agents/bash-process-registry.ts18-74](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L18-L74)

### Key Functions
FunctionPurpose`addSession(session)`Register a new running session`getSession(id)`Retrieve a running session`getFinishedSession(id)`Retrieve a finished session`deleteSession(id)`Remove from both maps`appendOutput(session, stream, chunk)`Append stdout/stderr with truncation`drainSession(session)`Flush pending output buffers`markExited(session, exitCode, signal, status)`Move to finished (if backgrounded)`markBackgrounded(session)`Flag session as backgrounded`listRunningSessions()`List all backgrounded running sessions`listFinishedSessions()`List all finished sessions
**Sources:**[src/agents/bash-process-registry.ts86-275](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L86-L275)

### Output Capping

Output is capped at two levels to prevent memory exhaustion:

1. **Pending output cap** (`pendingMaxOutputChars`, default 30,000): Limits buffered stdout/stderr between polls. When exceeded, older chunks are discarded (FIFO).
2. **Aggregated output cap** (`maxOutputChars`): Limits total retained output. When exceeded, the tail is preserved and `truncated` is set to `true`.

**Sources:**[src/agents/bash-process-registry.ts104-132](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L104-L132)[src/agents/bash-process-registry.test.ts51-82](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts#L51-L82)

---

## Session Lifecycle

**Diagram: Exec Session State Machine**

```
"exec tool invoked"

"yieldMs not exceeded
background=false"

"yieldMs exceeded
OR background=true"

"exit code 0"

"exit code non-0"

"addSession()
markBackgrounded()"

"process poll called"

"still running"

"exit detected"

"markExited()
(if backgrounded)"

"after jobTtlMs"

"process kill"

Spawned

Foreground

Backgrounded

Completed

Failed

Running

Polling

Exited

Finished

Pruned

Killed
```

**Sources:**[src/agents/bash-process-registry.ts145-213](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L145-L213)[docs/gateway/background-process.md26-31](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L26-L31)

### Backgrounded Session Persistence

Only sessions with `backgrounded: true` are moved to `finishedSessions` upon exit. Non-backgrounded sessions (foreground executions) are discarded immediately after returning output. This prevents memory accumulation from short-lived commands.

**Sources:**[src/agents/bash-process-registry.test.ts102-116](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts#L102-L116)

### TTL Sweeper

Finished sessions are pruned after `jobTtlMs` (default: 30 minutes, bounded 1 minute to 3 hours). The sweeper runs at `max(30s, jobTtlMs / 6)` intervals.

**Sources:**[src/agents/bash-process-registry.ts4-16](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L4-L16)[src/agents/bash-process-registry.ts286-309](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L286-L309)

---

## Scope Isolation

The `scopeKey` field isolates process visibility. By default, it is set to `sessionKey` (or falls back to `agent:{agentId}`). This ensures:

- Agents in different sessions cannot see each other's background jobs.
- The `process list` and `process poll` actions are scoped to the requester's session.

**Sources:**[src/agents/pi-tools.ts300-303](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L300-L303)[src/agents/bash-process-registry.ts29-32](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L29-L32)

---

## Configuration

Exec and process behavior is controlled via `tools.exec.*` config fields, with agent-level overrides available:
Config FieldTypeDefaultDescription`tools.exec.backgroundMs``number``10000`Default `yieldMs` for exec`tools.exec.timeoutSec``number``1800`Default timeout (seconds)`tools.exec.cleanupMs``number``1800000`Default TTL for finished sessions (milliseconds)`tools.exec.notifyOnExit``boolean``true`Enqueue system event when backgrounded exec exits`tools.exec.notifyOnExitEmptySuccess``boolean``false`Also notify for successful exits with no output`tools.exec.ask``string` or `object`(undefined)Approval policy for exec (`always`, `elevated`, `auto`, etc.)`tools.exec.host``boolean``false`Allow host execution from sandbox`tools.exec.security``string`(undefined)Security mode (`safe-bins`, `allow-all`, etc.)
**Sources:**[src/agents/pi-tools.ts132-159](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L132-L159)[docs/gateway/background-process.md43-51](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L43-L51)

### Environment Variables

Legacy environment variable overrides (lower priority than config):

- `PI_BASH_YIELD_MS`: Default yield duration
- `PI_BASH_MAX_OUTPUT_CHARS`: Aggregated output cap
- `OPENCLAW_BASH_PENDING_MAX_OUTPUT_CHARS`: Pending output cap per stream
- `PI_BASH_JOB_TTL_MS`: Finished session TTL

**Sources:**[docs/gateway/background-process.md37-42](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L37-L42)

---

## System Prompt Guidance

The system prompt includes exec and process tool summaries with usage hints:

```
- exec: Run shell commands (pty available for TTY-required CLIs)
- process: Manage background exec sessions

For long waits, avoid rapid poll loops: use exec with enough yieldMs or process(action=poll, timeout=<ms>).

```

The prompt also warns against polling `subagents list` or `sessions_list` in tight loops, encouraging push-based workflows where background jobs auto-announce completion via `notifyOnExit`.

**Sources:**[src/agents/system-prompt.ts248-249](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L248-L249)[src/agents/system-prompt.ts449-459](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L449-L459)

---

## Exit Notifications

When `tools.exec.notifyOnExit` is enabled (default), OpenClaw enqueues a system event when a backgrounded exec exits. This triggers a heartbeat request to the agent, allowing it to surface completion messages without polling.

The notification includes:

- Exit status (`completed`, `failed`, `killed`)
- Exit code
- Tail of output
- Session ID

If `notifyOnExitEmptySuccess` is enabled, notifications are also sent for successful exits with no output (otherwise suppressed to reduce noise).

**Sources:**[src/agents/pi-tools.ts152-156](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L152-L156)[docs/gateway/background-process.md49-50](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L49-L50)

---

## Child Process Bridging

When spawning long-running processes outside the exec/process tools (e.g., gateway respawns, CLI helpers), attach the child-process bridge helper to:

- Forward termination signals (SIGTERM, SIGINT) to the child.
- Detach event listeners on exit/error.
- Prevent orphaned processes on systemd and other init systems.

This ensures consistent shutdown behavior across platforms.

**Sources:**[docs/gateway/background-process.md33-35](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L33-L35)

---

## Examples

### Background a Long-Running Task

```
{
  "tool": "exec",
  "command": "npm run build",
  "background": true
}
```

**Returns:**

```
{
  "status": "running",
  "sessionId": "abc123",
  "pid": 12345,
  "tail": "..."
}
```

**Sources:**[docs/gateway/background-process.md88-91](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L88-L91)

### Poll for Updates

```
{
  "tool": "process",
  "action": "poll",
  "sessionId": "abc123"
}
```

**Returns (while running):**

```
{
  "status": "running",
  "newOutput": "Building project...\n",
  "tail": "..."
}
```

**Returns (after exit):**

```
{
  "status": "completed",
  "exitCode": 0,
  "newOutput": "Build complete.\n",
  "aggregated": "...",
  "tail": "..."
}
```

**Sources:**[docs/gateway/background-process.md77-86](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L77-L86)

### Send Stdin to Interactive Process

```
{
  "tool": "process",
  "action": "write",
  "sessionId": "abc123",
  "data": "y\n"
}
```

**Sources:**[docs/gateway/background-process.md93-97](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L93-L97)

### Read Paginated Logs

```
{
  "tool": "process",
  "action": "log",
  "sessionId": "abc123",
  "offset": 100,
  "limit": 50
}
```

Returns 50 lines starting at line 100.

**Sources:**[docs/gateway/background-process.md72-73](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md#L72-L73)

---

## Implementation References

- **Exec tool definition:**[src/agents/bash-tools.ts1-10](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts#L1-L10)
- **Process tool definition:**[src/agents/bash-tools.ts8-9](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts#L8-L9)
- **Process registry core:**[src/agents/bash-process-registry.ts73-310](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts#L73-L310)
- **Tool creation in agent context:**[src/agents/pi-tools.ts394-432](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L394-L432)
- **Exec config resolution:**[src/agents/pi-tools.ts132-159](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L132-L159)
- **Registry tests:**[src/agents/bash-process-registry.test.ts1-118](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts#L1-L118)

---

# Memory-&-Search

# Memory Tools
Relevant source files
- [docs/cli/memory.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/memory.md)
- [docs/concepts/memory.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/memory.md)
- [src/agents/memory-search.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/memory-search.test.ts)
- [src/agents/memory-search.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/memory-search.ts)
- [src/agents/tools/memory-tool.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/memory-tool.ts)
- [src/cli/memory-cli.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/memory-cli.test.ts)
- [src/cli/memory-cli.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/memory-cli.ts)
- [src/config/schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.ts)
- [src/config/types.memory.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.memory.ts)
- [src/config/types.tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.tools.ts)
- [src/config/zod-schema.agent-runtime.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-runtime.ts)
- [src/memory/backend-config.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/backend-config.test.ts)
- [src/memory/backend-config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/backend-config.ts)
- [src/memory/manager.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/manager.ts)
- [src/memory/qmd-manager.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/qmd-manager.test.ts)
- [src/memory/qmd-manager.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/qmd-manager.ts)
- [src/memory/search-manager.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/search-manager.test.ts)
- [src/memory/search-manager.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/search-manager.ts)

This page covers the `memory_search` and `memory_get` agent tools, the `MemorySearchManager` interface and its two backend implementations (`MemoryIndexManager` and `QmdMemoryManager`), embedding provider selection, vector/BM25/hybrid search mechanics, and the `openclaw memory` CLI commands.

For the broader concept of what memory files are, where they live in the agent workspace, and how the pre-compaction memory flush works, see the Memory concept documentation. For how these tools are assembled into the full tool set presented to the agent, see page [3.4](https://github.com/openclaw/openclaw/blob/8873e13f/3.4)

---

## Agent-Facing Tools

Two tools are registered when memory search is enabled for an agent:
Tool nameCreator functionDescription`memory_search``createMemorySearchTool`Semantically searches `MEMORY.md` + `memory/*.md` (and optional session transcripts). Returns top snippets with path and line ranges.`memory_get``createMemoryGetTool`Reads a specific memory Markdown file by workspace-relative path, optionally from a start line for N lines.
Both functions live in [src/agents/tools/memory-tool.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/memory-tool.ts) and share a common context resolver, `resolveMemoryToolContext`, which checks that `resolveMemorySearchConfig` returns a non-null result before registering either tool. If memory search is disabled for the agent, neither tool is added.

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

Sources: [src/agents/tools/memory-tool.ts1-170](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/memory-tool.ts#L1-L170)

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

Sources: [src/memory/manager.ts44-212](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/manager.ts#L44-L212)[src/memory/qmd-manager.ts141-242](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/qmd-manager.ts#L141-L242)[src/memory/search-manager.ts75-180](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/search-manager.ts#L75-L180)

---

## Backend Selection

`getMemorySearchManager` in [src/memory/search-manager.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/search-manager.ts) is the single entry point for both tools and the CLI. It reads `resolveMemoryBackendConfig` and routes to the correct implementation.

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

Sources: [src/memory/search-manager.ts19-73](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/search-manager.ts#L19-L73)[src/memory/backend-config.ts1-72](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/backend-config.ts#L1-L72)

---

## Builtin Backend — `MemoryIndexManager`

`MemoryIndexManager` in [src/memory/manager.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/manager.ts) uses Node.js's built-in `DatabaseSync` (SQLite) with optional extensions for vector search.

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
Sources: [src/agents/memory-search.ts81-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/memory-search.ts#L81-L100)[src/memory/manager.ts128-212](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/manager.ts#L128-L212)

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

Score combination (from [src/memory/hybrid.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/hybrid.ts)):

```
textScore  = 1 / (1 + max(0, bm25Rank))
finalScore = vectorWeight * vectorScore + textWeight * textScore

```

Defaults: `vectorWeight = 0.7`, `textWeight = 0.3`, `candidateMultiplier = 4`, `maxResults = 6`, `minScore = 0.35`.

If the embedding provider returns a zero vector, only keyword results are used. If FTS5 is unavailable, only vector results are used.

Optional post-processing:

- **MMR** (Maximal Marginal Relevance): reduces redundancy by penalising chunks similar to already-selected ones. Default: disabled. Controlled by `memorySearch.query.hybrid.mmr`.
- **Temporal decay**: down-weights older chunks. Default: disabled. Half-life default: 30 days.

Sources: [src/memory/manager.ts230-316](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/manager.ts#L230-L316)[src/memory/hybrid.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/hybrid.ts)[src/memory/manager-search.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/manager-search.ts)[src/agents/memory-search.ts91-99](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/memory-search.ts#L91-L99)

---

## QMD Backend — `QmdMemoryManager`

`QmdMemoryManager` in [src/memory/qmd-manager.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/qmd-manager.ts) shells out to the `qmd` CLI binary for all indexing and retrieval. The Markdown files remain the source of truth; QMD manages its own SQLite index internally.

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

Sources: [src/memory/qmd-manager.ts141-300](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/qmd-manager.ts#L141-L300)[src/memory/search-manager.ts75-140](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/search-manager.ts#L75-L140)[src/memory/backend-config.ts60-160](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/backend-config.ts#L60-L160)

---

## Configuration Reference

### Builtin backend (`agents.defaults.memorySearch`)

Configured per-agent at `agents.defaults.memorySearch` (and per-agent overrides at `agents.list[*].memorySearch`). Resolved by `resolveMemorySearchConfig` in [src/agents/memory-search.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/memory-search.ts)
FieldDefaultDescription`enabled``true`Enable/disable memory tools`provider``"auto"`Embedding provider`model`provider defaultEmbedding model id`fallback``"none"`Fallback provider on primary failure`store.path``~/.openclaw/memory/<agentId>.sqlite`SQLite database path`store.vector.enabled``true`Enable sqlite-vec vector index`store.vector.extensionPath`—Path to `sqlite-vec` shared library`chunking.tokens``400`Target tokens per chunk`chunking.overlap``80`Overlap tokens between chunks`query.maxResults``6`Max search results`query.minScore``0.35`Minimum similarity score`query.hybrid.enabled``true`Enable BM25 + vector hybrid`query.hybrid.vectorWeight``0.7`Vector score weight`query.hybrid.textWeight``0.3`BM25 score weight`query.hybrid.candidateMultiplier``4`Candidate pool multiplier`query.hybrid.mmr.enabled``false`Enable MMR re-ranking`query.hybrid.temporalDecay.enabled``false`Enable temporal decay`sync.watch``true`Watch files for changes`sync.watchDebounceMs``1500`Watch debounce delay`sync.onSessionStart``true`Sync on each session start`sync.onSearch``false`Sync before each search`cache.enabled``true`Enable embedding vector cache`extraPaths``[]`Additional directories/files to index
### QMD backend (`memory.qmd.*`)

Activated by `memory.backend = "qmd"`. Schema defined in [src/config/zod-schema.ts100-112](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L100-L112) (`MemoryQmdSchema`). Types in [src/config/types.memory.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.memory.ts)
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

Sources: [src/config/zod-schema.ts44-121](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L44-L121)[src/config/types.memory.ts1-68](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.memory.ts#L1-L68)[src/memory/backend-config.ts72-160](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/backend-config.ts#L72-L160)

---

## `openclaw memory` CLI

Registered by `registerMemoryCli` in [src/cli/memory-cli.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/memory-cli.ts) All commands call `getMemorySearchManager` internally.
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

Sources: [src/cli/memory-cli.ts86-109](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/memory-cli.ts#L86-L109)[src/cli/memory-cli.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/memory-cli.ts#L1-L50)

---

## Path Access Guards

`memory_get` enforces that `relPath` resolves to a file inside the workspace memory area. The allowed set is:

- Files matching `isMemoryPath(relPath)` — paths starting with `MEMORY.md`, `memory.md`, or `memory/`
- Files within directories listed in `memorySearch.extraPaths` (for the builtin backend)
- Paths with the `qmd/<collection>/` prefix (for the QMD backend; `memory_get` maps these back to the collection's filesystem root)

Symlinks are always rejected. Only `.md` files are permitted. Absolute paths are resolved then checked with `path.relative` to confirm they stay within the allowed roots.

Sources: [src/memory/manager.ts505-576](https://github.com/openclaw/openclaw/blob/8873e13f/src/memory/manager.ts#L505-L576)[src/agents/tools/memory-tool.ts101-130](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/memory-tool.ts#L101-L130)

---

# Subagents-&-ACP

# Subagents
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md)
- [docs/gateway/background-process.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/bash-process-registry.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts)
- [src/agents/bash-process-registry.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts)
- [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts)
- [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers.ts)
- [src/agents/pi-embedded-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)

This page covers how OpenClaw spawns subagent sessions via the `sessions_spawn` tool, the lifecycle of those sessions in the subagent registry, the announce flow that delivers results back to the requester, depth limiting, and the tool policy restrictions applied to subagent sessions.

For general session management concepts (session keys, transcripts, the session store), see [2.4](/openclaw/openclaw/2.4-session-management). For the tool policy pipeline that gates which tools a subagent receives, see [3.4](/openclaw/openclaw/3.4-tools-system). For ACP-runtime subagents (`runtime: "acp"`), which have a distinct harness path, see the ACP Agents documentation.

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

Sources: [src/agents/tools/sessions-spawn-tool.ts1-119](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/sessions-spawn-tool.ts#L1-L119)[src/agents/subagent-registry.ts48-55](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry.ts#L48-L55)

---

## `sessions_spawn` Tool Parameters

Defined by `createSessionsSpawnTool` in `src/agents/tools/sessions-spawn-tool.ts`.
ParameterTypeDefaultDescription`task`string (required)—Task description sent as the subagent prompt`label`string?—Human-readable label for the session`runtime``"subagent"` | `"acp"``"subagent"`Which harness to use`agentId`string?caller's agentSpawn under a different agent identity`model`string?inheritedOverride model for this run`thinking`string?inheritedOverride thinking level`runTimeoutSeconds`number?`agents.defaults.subagents.runTimeoutSeconds` or `0`Abort the run after N seconds`thread`boolean`false`Request channel thread binding`mode``"run"` | `"session"``"run"` (or `"session"` when `thread: true`)One-shot vs. persistent session`cleanup``"delete"` | `"keep"``"keep"`Whether to delete the session after completion
`mode: "session"` requires `thread: true`. When `thread: true` and `mode` is omitted, mode defaults to `"session"`.

The tool returns `status: "accepted"` immediately — it is non-blocking.

Sources: [src/agents/tools/sessions-spawn-tool.ts11-119](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/sessions-spawn-tool.ts#L11-L119)

---

## Subagent Lifecycle

**Diagram: Subagent Run Lifecycle and Registry State Transitions**

```

```

Sources: [src/agents/subagent-registry.ts213-272](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry.ts#L213-L272)[src/agents/subagent-registry.ts48-92](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry.ts#L48-L92)

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

Sources: [src/agents/subagent-registry.ts48-209](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry.ts#L48-L209)

### Lifecycle Event Handling

The registry subscribes to agent lifecycle events via `onAgentEvent` from `src/infra/agent-events.ts`. Key transitions:

- `lifecycle.start` — clears any pending deferred error for a run (handles model-fallback retries)
- `lifecycle.end` — calls `completeSubagentRun` with `SUBAGENT_ENDED_REASON_COMPLETE`
- `lifecycle.error` — schedules a deferred error via `schedulePendingLifecycleError` with a `LIFECYCLE_ERROR_RETRY_GRACE_MS` (15 s) grace period, allowing in-progress model retries to cancel it

Sources: [src/agents/subagent-registry.ts213-272](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry.ts#L213-L272)

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

Sources: [src/agents/subagent-announce.ts471-603](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-announce.ts#L471-L603)[src/agents/subagent-announce.ts704-802](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-announce.ts#L704-L802)

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

Sources: [src/agents/subagent-announce.ts117-201](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-announce.ts#L117-L201)[src/agents/subagent-registry.ts56-92](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry.ts#L56-L92)

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

Sources: [src/agents/subagent-announce.ts68-98](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-announce.ts#L68-L98)[src/agents/subagent-announce.ts292-334](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-announce.ts#L292-L334)

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

Sources: [src/agents/pi-tools.ts285-301](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L285-L301)[src/agents/pi-tools.ts502-522](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L502-L522)

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

Sources: [src/agents/pi-tools.ts285-291](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L285-L291)

---

## Configuration Reference

All subagent-relevant config lives under `agents.defaults.subagents` (and per-agent in `agents.list[].subagents`):
FieldDescription`model`Default model for spawned subagents (caller's model used if unset)`thinking`Default thinking level for spawned subagents`runTimeoutSeconds`Default timeout for subagent runs (0 = no timeout)`maxSpawnDepth`Maximum nesting depth allowed`announceTimeoutMs`Timeout for the announce gateway call (default 60 s)
Individual `sessions_spawn` tool call parameters override these defaults for a single run. For example, an explicit `model` in the tool call takes precedence over `agents.defaults.subagents.model`.

Sources: [src/agents/subagent-announce.ts60-66](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-announce.ts#L60-L66)[docs/tools/subagents.md74-91](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/subagents.md#L74-L91)

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

Sources: [src/agents/subagent-announce.ts572-603](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-announce.ts#L572-L603)[src/agents/subagent-registry.ts1-48](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry.ts#L1-L48)

---

## Thread-Bound Sessions (`mode: "session"`)

When `thread: true` is passed to `sessions_spawn`, the subagent session can be bound to a channel thread so that follow-up messages in that thread route to the same subagent session rather than spawning a new one.

Currently supported only on **Discord**. Relevant config keys:
Config KeyDescription`channels.discord.threadBindings.enabled`Master toggle`channels.discord.threadBindings.idleHours`Idle timeout for thread-bound sessions`channels.discord.threadBindings.maxAgeHours`Maximum age before the binding expires`channels.discord.threadBindings.spawnSubagentSessions`Allow spawning into thread-bound sessions
The `createBoundDeliveryRouter().resolveDestination()` call in `resolveSubagentCompletionOrigin` uses the thread binding registry to route completion announces to the correct thread.

Sources: [docs/tools/subagents.md93-99](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/subagents.md#L93-L99)[src/agents/subagent-announce.ts471-570](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-announce.ts#L471-L570)

---

# Commands-&-Directives

# Commands & Auto-Reply
Relevant source files
- [docs/tools/slash-commands.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/slash-commands.md)
- [src/agents/tools/session-status-tool.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/session-status-tool.ts)
- [src/auto-reply/command-detection.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/command-detection.ts)
- [src/auto-reply/commands-args.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/commands-args.ts)
- [src/auto-reply/commands-registry.data.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/commands-registry.data.ts)
- [src/auto-reply/commands-registry.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/commands-registry.test.ts)
- [src/auto-reply/commands-registry.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/commands-registry.ts)
- [src/auto-reply/commands-registry.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/commands-registry.types.ts)
- [src/auto-reply/group-activation.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/group-activation.ts)
- [src/auto-reply/reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply.ts)
- [src/auto-reply/reply/commands-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/commands-core.ts)
- [src/auto-reply/reply/commands-info.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/commands-info.ts)
- [src/auto-reply/reply/commands-status.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/commands-status.ts)
- [src/auto-reply/reply/commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/commands.test.ts)
- [src/auto-reply/reply/commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/commands.ts)
- [src/auto-reply/reply/directive-handling.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/directive-handling.ts)
- [src/auto-reply/send-policy.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/send-policy.ts)
- [src/auto-reply/status.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/status.test.ts)
- [src/auto-reply/status.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/status.ts)
- [src/discord/monitor/native-command.options.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/native-command.options.test.ts)
- [test/mocks/baileys.ts](https://github.com/openclaw/openclaw/blob/8873e13f/test/mocks/baileys.ts)

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

Some providers reserve names. These overrides are applied by `resolveNativeName()`[src/auto-reply/commands-registry.ts133-144](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/commands-registry.ts#L133-L144):
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

`CommandAuthorized` in `FinalizedMsgContext` is always a `boolean`, default-deny — see `src/auto-reply/templating.ts`[src/auto-reply/templating.ts155-161](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/templating.ts#L155-L161)

Resolution priority:

1. **`commands.allowFrom`** — if configured, it is the *only* authorization source. Channel allowlists and pairing are ignored.
2. **Channel allowlists + pairing** — standard source when `commands.allowFrom` is not set.
3. **`commands.useAccessGroups`** (default `true`) — enforces standard allow/policy checks.

For unauthorized senders:

- Standalone command messages are **silently ignored** (no reply sent).
- Inline directives in mixed messages are treated as **plain text** passed to the model.

Three commands (`bash`, `config`, `debug`) additionally require their respective config flags to be explicitly `true` as own-properties (not inherited from a prototype chain) — this is enforced in `isCommandFlagEnabled()` and checked by `listChatCommandsForConfig()`[src/auto-reply/commands-registry.ts98-109](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/commands-registry.ts#L98-L109)

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
`shouldHandleTextCommands()`[src/auto-reply/commands-registry.ts378-420](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/commands-registry.ts#L378-L420) implements surface gating: platforms without native command support (WhatsApp, Signal, iMessage, Google Chat, MS Teams, WebChat) always process text commands regardless of the `commands.text` setting.

Sources: `docs/tools/slash-commands.md`, `src/auto-reply/commands-registry.ts`, `src/config/commands.ts`

---

# Channels

# Channels
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts)
- [src/auto-reply/reply/normalize-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/normalize-reply.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/auto-reply/tokens.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.test.ts)
- [src/auto-reply/tokens.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/draft-stream-loop.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/draft-stream-loop.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/imessage/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/monitor.ts)
- [src/signal/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor.ts)
- [src/slack/monitor.tool-result.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.tool-result.test.ts)
- [src/slack/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/bot-handlers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-handlers.ts)
- [src/telegram/bot-message-context.dm-threads.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.dm-threads.test.ts)
- [src/telegram/bot-message-context.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts)
- [src/telegram/bot-message-dispatch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.test.ts)
- [src/telegram/bot-message-dispatch.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.ts)
- [src/telegram/bot-native-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-commands.ts)
- [src/telegram/bot.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.test.ts)
- [src/telegram/bot.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts)
- [src/telegram/bot/delivery.replies.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.replies.ts)
- [src/telegram/bot/delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.test.ts)
- [src/telegram/bot/delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.ts)
- [src/telegram/bot/helpers.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.test.ts)
- [src/telegram/bot/helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.ts)
- [src/telegram/draft-stream.test-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test-helpers.ts)
- [src/telegram/draft-stream.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test.ts)
- [src/telegram/draft-stream.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.ts)
- [src/telegram/lane-delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.test.ts)
- [src/telegram/lane-delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)
- [src/web/auto-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/auto-reply.ts)
- [src/web/inbound.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.test.ts)
- [src/web/inbound.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.ts)
- [src/web/vcard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/vcard.ts)

OpenClaw's channel subsystem integrates external messaging platforms through a **provider pattern**: each platform runs as an independent monitor that receives raw events, enforces access control, normalizes messages to a common envelope format, and routes replies back through platform-specific delivery mechanisms. This page documents the core architecture, access control flow, message normalization, and outbound delivery abstractions. For platform-specific integration details see [Channel Architecture](/openclaw/openclaw/4.1-channel-architecture), [Telegram](/openclaw/openclaw/4.2-telegram-integration), [Discord](/openclaw/openclaw/4.3-discord-integration), and [Other Channels](/openclaw/openclaw/4.4-other-channels).

---

## Supported Platforms

Channels are either **core** (built into the main `src/` tree) or **extension** (separate packages under `extensions/`).
PlatformMonitor Entry PointConfig KeyNotesTelegram`createTelegramBot`[`src/telegram/bot.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/telegram/bot.ts`)`channels.telegram`grammY, long-poll or webhookDiscord`monitorDiscordProvider`[`src/discord/monitor/provider.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/discord/monitor/provider.ts`)`channels.discord`@buape/carbon gatewaySlack`monitorSlackProvider`[`src/slack/monitor/provider.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/slack/monitor/provider.ts`)`channels.slack`Socket Mode or HTTPSignal`monitorSignalProvider`[`src/signal/monitor.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/signal/monitor.ts`)`channels.signal`signal-cli JSON-RPC / SSEiMessage`monitorIMessageProvider`[`src/imessage/monitor/monitor-provider.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/imessage/monitor/monitor-provider.ts`)`channels.imessage``imsg` CLI, macOS onlyWhatsApp`monitorWebInbox`[`src/web/inbound.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/web/inbound.ts`)`channels.whatsapp`Baileys / web protocolMatrix`MatrixMonitorHandlerParams`[`extensions/matrix/src/matrix/monitor/handler.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`extensions/matrix/src/matrix/monitor/handler.ts`)`channels.matrix`ExtensionFeishu`handleFeishuMessageEvent`[`extensions/feishu/src/bot.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`extensions/feishu/src/bot.ts`)`channels.feishu`ExtensionMattermost`monitorMattermostProvider`[`extensions/mattermost/src/mattermost/monitor.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`extensions/mattermost/src/mattermost/monitor.ts`)`channels.mattermost`ExtensionMS Teams(handler) [`extensions/msteams/src/monitor-handler/message-handler.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`extensions/msteams/src/monitor-handler/message-handler.ts`)`channels.msteams`ExtensionZalo(monitor) [`extensions/zalo/src/monitor.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`extensions/zalo/src/monitor.ts`)`channels.zalo`ExtensionGoogle Chat(schema) [`src/config/zod-schema.providers-core.ts610-695](https://github.com/openclaw/openclaw/blob/8873e13f/`src/config/zod-schema.providers-core.ts#L610-L695)`channels.googlechat`Webhook-basedLINE`resolveLineAccount`[`src/plugin-sdk/index.ts562-590](https://github.com/openclaw/openclaw/blob/8873e13f/`src/plugin-sdk/index.ts#L562-L590)`channels.line`ExtensionBlueBubbles(plugin)`channels.bluebubbles`ExtensionIRC(plugin)`channels.irc`ExtensionNextcloud Talk(plugin)`channels.nextcloud`Extension
Sources: [`src/plugin-sdk/index.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/plugin-sdk/index.ts`)[`src/config/zod-schema.providers-core.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/config/zod-schema.providers-core.ts`)[`src/discord/monitor.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/discord/monitor.ts`)[`src/slack/monitor.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/slack/monitor.ts`)[`src/signal/monitor.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/signal/monitor.ts`)[`src/imessage/monitor.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/imessage/monitor.ts`)[`src/web/inbound.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/web/inbound.ts`)

---

## Provider Architecture and Monitor Pattern

Each channel integration implements a **provider pattern** where a dedicated monitor function establishes a platform connection, registers event handlers, and owns the complete message lifecycle from inbound receipt through access control to outbound delivery. The monitor runs as a long-lived async function started by the Gateway on process initialization.

**Provider pattern implementation per platform**
PlatformMonitor FunctionClient LibraryConnection TypeHandler RegistrationTelegram`createTelegramBot`grammY `Bot`Long poll or webhook`registerTelegramHandlers`Discord`monitorDiscordProvider`@buape/carbon `Client`Gateway WebSocket`registerDiscordListener`Slack`monitorSlackProvider`@slack/bolt `App`Socket Mode or HTTP`app.message`, `app.event`Signal`monitorSignalProvider`signal-cli JSON-RPCSSE stream`createSignalEventHandler`iMessage`monitorIMessageProvider`imsg CLI stdioPolling loopDirect handler in monitorWhatsApp`monitorWebInbox`Baileys WebWebSocketWeb event listeners
**Channel monitor initialization and lifecycle**

```
true

false

error

shutdown

Gateway Process Start

Load channel config
(loadConfig)

channels..enabled

Start monitor function
(createTelegramBot /
monitorDiscordProvider /
monitorSlackProvider)

Initialize platform client
(Bot / Client / App)

Register event handlers
(registerTelegramHandlers /
registerDiscordListener)

Establish connection
(WebSocket / poll / SSE)

Event loop
(bot.start / client.login /
runSlackSocketLoop)

Connection lost

Backoff policy
(computeBackoff)

Reconnect

Skip channel

Cleanup
```

Monitor functions are invoked by the Gateway's channel coordinator and run until process termination. Reconnection logic is provider-specific but typically uses exponential backoff with jitter via `computeBackoff`[src/infra/backoff.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/backoff.js)

Sources: [src/telegram/bot.ts69-416](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts#L69-L416)[src/discord/monitor/provider.ts307-633](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L307-L633)[src/slack/monitor/provider.ts48-547](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts#L48-L547)[src/signal/monitor.ts30-362](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor.ts#L30-L362)[src/web/inbound/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound/monitor.ts)

---

## Inbound Message Processing Pipeline

Raw platform events flow through a unified pipeline that normalizes messages, enforces access control, resolves routing, and dispatches to the agent runtime. Each stage is implemented through platform-independent functions that consume normalized data structures.

**Inbound message processing stages (code entity mapping)**

```
duplicate

new

denied

allowed

new user

no mention in group

mentioned or DM

Raw platform event
(Update / Message / Event)

Deduplication
(createTelegramUpdateDedupe /
createDedupeCache)

Parse message fields
(ctx.message / event.message)

Access control gate
(resolveDmGroupAccessWithLists /
isDiscordGroupAllowedByPolicy /
evaluateTelegramGroupBaseAccess)

Pairing challenge
(upsertChannelPairingRequest)

Mention gating
(resolveMentionGatingWithBypass /
matchesMentionWithExplicit)

Resolve agent route
(resolveAgentRoute /
buildAgentSessionKey)

Media resolution
(resolveMedia /
resolveMediaList)

Build inbound envelope
(formatInboundEnvelope)

Append history context
(buildPendingHistoryContextFromMap)

Finalize context
(finalizeInboundContext)

Record session metadata
(recordInboundSession /
recordInboundSessionMetaSafe)

dispatchInboundMessage

Set ACK reaction
(shouldAckReaction /
resolveAckReaction)

Agent execution
(runReplyAgent)

Drop

Send pairing code

Drop

Drop
```

### Core Pipeline Functions
StagePrimary FunctionFallback / AlternativeLocationDeduplication`createTelegramUpdateDedupe``createDedupeCache`[src/telegram/bot-updates.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-updates.ts)[src/auto-reply/reply/inbound-dedupe.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/inbound-dedupe.js)Access control (DM)`resolveDmGroupAccessWithLists``readStoreAllowFromForDmPolicy`[src/security/dm-policy-shared.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/dm-policy-shared.js)Access control (group)`isDiscordGroupAllowedByPolicy``evaluateTelegramGroupBaseAccess`[src/discord/monitor/allow-list.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/allow-list.ts)[src/telegram/group-access.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/group-access.ts)Mention detection`matchesMentionWithExplicit``hasBotMention`[src/auto-reply/reply/mentions.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/mentions.js)[src/telegram/bot/helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.ts)Routing`resolveAgentRoute``buildAgentSessionKey`[src/routing/resolve-route.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/routing/resolve-route.js)Media resolution`resolveMedia` (Telegram)`buildDiscordMediaPayload`[src/telegram/bot/delivery.resolve-media.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.resolve-media.ts)[src/discord/monitor/message-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-utils.ts)Envelope format`formatInboundEnvelope`—[src/auto-reply/envelope.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/envelope.js)History context`buildPendingHistoryContextFromMap`—[src/auto-reply/reply/history.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/history.js)Context finalization`finalizeInboundContext`—[src/auto-reply/reply/inbound-context.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/inbound-context.js)Session recording`recordInboundSession``recordInboundSessionMetaSafe`[src/channels/session.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/session.js)[src/channels/session-meta.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/session-meta.ts)Inbound dispatch`dispatchInboundMessage`—[src/auto-reply/dispatch.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/dispatch.js)ACK reaction`shouldAckReaction``resolveAckReaction`[src/channels/ack-reactions.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/ack-reactions.js)[src/agents/identity.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/identity.js)
**Telegram-specific implementation**: [src/telegram/bot-message-context.ts170-720](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts#L170-L720)**Discord-specific implementation**: [src/discord/monitor/message-handler.process.ts1-500](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.process.ts#L1-L500)**Slack-specific implementation**: [src/slack/monitor/message-handler/process.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/message-handler/process.ts)

Sources: [src/telegram/bot-message-context.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts)[src/discord/monitor/message-handler.process.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.process.ts)[src/slack/monitor/message-handler/process.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/message-handler/process.ts)[src/signal/monitor/event-handler.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor/event-handler.ts)[src/channels/mention-gating.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/mention-gating.js)[src/security/dm-policy-shared.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/dm-policy-shared.js)

---

## Session Key Format

Each inbound message is assigned a **session key** that determines which agent conversation the message belongs to. The format varies by context:
Chat TypeSession Key PatternDM (default scope)`agent:<agentId>:main`DM (per-user scope)`agent:<agentId>:<channel>:user:<userId>`Group chat`agent:<agentId>:<channel>:group:<groupId>`Channel (Discord/Slack)`agent:<agentId>:<channel>:channel:<channelId>`Telegram forum topic`agent:<agentId>:telegram:group:<chatId>:topic:<threadId>`
Session keys are built by `buildAgentSessionKey` in `src/routing/resolve-route.js` and resolved by `resolveAgentRoute`.

Sources: [`src/discord/monitor/message-handler.process.ts282-297](https://github.com/openclaw/openclaw/blob/8873e13f/`src/discord/monitor/message-handler.process.ts#L282-L297)[`src/telegram/bot.ts66-114](https://github.com/openclaw/openclaw/blob/8873e13f/`src/telegram/bot.ts#L66-L114)

---

## Outbound Reply Delivery

Reply delivery is orchestrated by `createReplyDispatcherWithTyping`[src/auto-reply/reply/reply-dispatcher.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/reply-dispatcher.js) which coordinates typing indicators, streaming previews, text chunking, media attachments, and ACK reaction cleanup. The dispatcher invokes platform-specific delivery functions that abstract protocol differences.

**Reply delivery stages**

```
yes

no

Agent produces reply
(runReplyAgent)

createReplyDispatcherWithTyping

Start typing indicator
(createTypingCallbacks)

Streaming enabled?

Stream partial replies
(createTelegramDraftStream /
createDiscordDraftStream)

Edit draft messages
(editMessageTelegram /
editDiscordMessage)

Chunk final text
(chunkTextWithMode)

Platform delivery
(deliverReplies /
deliverDiscordReply /
sendMessageSignal)

Attach media
(sendMessageTelegram /
deliverDiscordMedia)

Stop typing indicator

Remove ACK reaction
(removeAckReactionAfterReply)

Delivery complete
```

### Platform-Specific Delivery Functions
PlatformPrimary FunctionStreaming ImplementationRetry PolicyLocationTelegram`deliverReplies``createTelegramDraftStream` with `sendChatAction("typing")` loop`createTelegramRetryRunner`[src/telegram/bot/delivery.replies.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.replies.ts)Discord`deliverDiscordReply``createDiscordDraftStream` with message edits`createDiscordRetryRunner`[src/discord/monitor/message-handler.process.ts400-620](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.process.ts#L400-L620)Slack`deliverReplies``startSlackStream` / `stopSlackStream` with chat.updateBolt SDK internal[src/slack/monitor/replies.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/replies.js)Signal`sendMessageSignal`Not supportedManual retry in `sendSignalMessage`[src/signal/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/send.ts)iMessage`sendMessageIMessage`Not supportedNone[src/imessage/send.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/send.js)WhatsApp`sendMessageWeb`Not supportedNone[src/web/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/send.ts)
**Text chunking**:

- `chunkTextWithMode`[src/auto-reply/chunk.js80-150](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/chunk.js#L80-L150) splits replies exceeding `textChunkLimit`
- `chunkMode: "length"` splits at character boundaries
- `chunkMode: "newline"` splits at paragraph boundaries
- Per-channel limits: Telegram 4000, Discord 2000, Slack 4000 (configurable)

**Media delivery**:

- Media paths resolved by `resolveMedia` (Telegram) or `buildDiscordMediaPayload` (Discord)
- Attachments sent via `sendMessageTelegram` with `InputFile`, `deliverDiscordMedia` with file uploads
- Media size limits enforced by `mediaMaxMb` config (default: Telegram 100MB, Discord 8MB)

**Retry behavior**:

- Telegram: `createTelegramRetryRunner`[src/infra/retry-policy.js20-80](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/retry-policy.js#L20-L80) with exponential backoff
- Discord: `createDiscordRetryRunner`[src/infra/retry-policy.js120-180](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/retry-policy.js#L120-L180)
- Retry config from `channels.<provider>.retry` or `channels.<provider>.accounts.<id>.retry`

Sources: [src/auto-reply/reply/reply-dispatcher.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/reply-dispatcher.js)[src/telegram/bot/delivery.replies.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.replies.ts)[src/discord/monitor/message-handler.process.ts400-620](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.process.ts#L400-L620)[src/slack/monitor/replies.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/replies.js)[src/signal/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/send.ts)[src/auto-reply/chunk.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/chunk.js)[src/infra/retry-policy.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/retry-policy.js)

---

## Access Control Policies

Access control enforcement occurs before any message reaches the agent runtime. Two independent policy layers gate inbound messages:

1. **DM policy** (`dmPolicy`) — controls direct message sender authorization
2. **Group policy** (`groupPolicy`) — controls group/guild membership and sender authorization

Both policies are evaluated by `resolveDmGroupAccessWithLists`[src/security/dm-policy-shared.js90-180](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/dm-policy-shared.js#L90-L180) which consults the pairing store, config allowlists, and group membership rules.

### DM Policy Values
PolicyValidation FunctionBehaviorConfig Requirement`pairing` (default)`readStoreAllowFromForDmPolicy`Unknown senders receive pairing code; approved senders stored in pairing store [~/.openclaw/credentials/<channel>/pairing.json](https://github.com/openclaw/openclaw/blob/8873e13f/~/.openclaw/credentials/<channel>/pairing.json)None`allowlist``isAllowedParsedChatSender`Only `allowFrom` entries acceptedRequires ≥1 entry in `allowFrom``open`—Any sender accepted (no gate)Requires `allowFrom: ["*"]``disabled`—All DMs rejectedNone
**Pairing flow implementation**:

- `upsertChannelPairingRequest`[src/pairing/pairing.js50-120](https://github.com/openclaw/openclaw/blob/8873e13f/src/pairing/pairing.js#L50-L120) creates pending request with 1-hour expiry
- `sendPairingCode`[src/pairing/pairing.js180-220](https://github.com/openclaw/openclaw/blob/8873e13f/src/pairing/pairing.js#L180-L220) delivers challenge to user
- `approvePairingRequest`[src/pairing/pairing.js250-290](https://github.com/openclaw/openclaw/blob/8873e13f/src/pairing/pairing.js#L250-L290) commits approval to pairing store

### Group Policy Values
PolicyValidation FunctionBehaviorFallback on Missing Config`open`—Any group accepted; all senders permitted—`allowlist` (default)`isDiscordGroupAllowedByPolicy`Groups must match `groups` config; senders filtered by `groupAllowFrom`Applied when `channels.<provider>` missing`disabled`—All group messages rejected—
**Provider-specific group validation**:

- Telegram: `evaluateTelegramGroupBaseAccess`[src/telegram/group-access.ts20-95](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/group-access.ts#L20-L95)
- Discord: `isDiscordGroupAllowedByPolicy`[src/discord/monitor/allow-list.ts140-210](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/allow-list.ts#L140-L210)
- Slack: `isSlackChannelAllowedByPolicy`[src/slack/monitor/policy.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/policy.ts)
- Signal: group resolution in `createSignalEventHandler`[src/signal/monitor/event-handler.ts120-180](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor/event-handler.ts#L120-L180)

### Mention Gating

Groups with `requireMention: true` enforce mention detection before dispatch. Mention sources:

1. **Platform metadata mentions** — native @-mentions extracted from message entities
2. **Regex pattern matches** — `agents.list[].groupChat.mentionPatterns` and `messages.groupChat.mentionPatterns`

Implementation: `resolveMentionGatingWithBypass`[src/channels/mention-gating.js15-80](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/mention-gating.js#L15-L80) returns `{ pass, bypass }` where `bypass` allows commands to skip mention requirements.

**Access control decision tree (code entity references)**

```
direct

group

pairing

allowlist

open

disabled

yes

no

yes

no

open

allowlist

disabled

no

yes

no

yes

yes

no

yes

no

Inbound message

Chat type

dmPolicy value

pairing path

readStoreAllowFromForDmPolicy

In pairing store?

upsertChannelPairingRequest

sendPairingCode

allowlist path

isSenderAllowed /
isAllowedParsedChatSender

In allowFrom?

open path

disabled path

groupPolicy value

open path

allowlist path

isDiscordGroupAllowedByPolicy /
evaluateTelegramGroupBaseAccess

Group allowed?

Check groupAllowFrom

Sender allowed?

requireMention?

resolveMentionGatingWithBypass

Was mentioned?

dispatchInboundMessage

Drop message
```

**Allowlist resolution** for username-to-ID conversion is handled by platform-specific resolvers:

- Telegram: `resolveTelegramAccount`[src/telegram/accounts.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/accounts.ts)
- Discord: `resolveDiscordAllowlistConfig`[src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- Slack: `resolveSlackUserAllowlist`[src/slack/resolve-users.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/resolve-users.ts)

Resolved IDs are optionally written back to config via `openclaw doctor --fix`.

Sources: [src/security/dm-policy-shared.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/dm-policy-shared.js)[src/config/runtime-group-policy.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/runtime-group-policy.js)[src/channels/mention-gating.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/mention-gating.js)[src/telegram/group-access.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/group-access.ts)[src/discord/monitor/allow-list.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/allow-list.ts)[src/slack/monitor/policy.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/policy.ts)[src/pairing/pairing.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/pairing/pairing.js)[src/config/zod-schema.core.ts20-34](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.core.ts#L20-L34)

---

## Configuration and Schema Validation

Channel configuration is defined under `channels.<provider>` and validated by Zod schemas at config load time. Each provider schema extends common fields with platform-specific options.

### Common Channel Configuration Fields
FieldTypeSchema LocationDefaultDescription`enabled``boolean`All provider schemas—Enable/disable channel monitor`dmPolicy``DmPolicySchema``zod-schema.core.ts:22-26``"pairing"`Direct message access policy`allowFrom``Array<string | number>`—`[]`DM sender allowlist`groupPolicy``GroupPolicySchema``zod-schema.core.ts:28-32``"allowlist"`Group access policy`groupAllowFrom``Array<string | number>`—`allowFrom`Group sender allowlist (fallback)`requireMention``boolean`—`true`Require mention in groups`historyLimit``number`—50Group history messages per turn`textChunkLimit``number`—Platform-specificMax outbound message length`chunkMode``"length" | "newline"``zod-schema.core.ts:95-97``"length"`Text splitting strategy`streaming``boolean | StreamMode`—`"off"`Reply streaming mode`mediaMaxMb``number`—Platform-specificInbound media size limit`ackReaction``string`—Agent emojiACK reaction emoji`commands.native``boolean | "auto"``ProviderCommandsSchema``"auto"`Native command registration
**Schema definition locations**:

- Core types: [src/config/zod-schema.core.ts15-120](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.core.ts#L15-L120)
- Telegram: [src/config/zod-schema.providers-core.ts152-310](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L152-L310)
- Discord: [src/config/zod-schema.providers-core.ts315-590](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L315-L590)
- Slack: [src/config/zod-schema.providers-core.ts595-750](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L595-L750)

### Multi-Account Configuration

Channels supporting multiple accounts (Telegram, Discord, Slack) define accounts under `channels.<provider>.accounts.<accountId>`. Account-level config is shallow-merged with top-level channel config via `resolveXAccount` functions:

**Account resolution logic**:

```
// Telegram: src/telegram/accounts.ts:30-80
export function resolveTelegramAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): ResolvedTelegramAccount {
  const channelConfig = cfg.channels?.telegram;
  const accountId = params.accountId ?? 
    channelConfig?.defaultAccount ?? 
    "default";
  const accountConfig = channelConfig?.accounts?.[accountId];
  
  // Shallow merge: account overrides channel defaults
  return {
    accountId,
    token: accountConfig?.botToken ?? channelConfig?.botToken,
    config: {
      ...channelConfig,
      ...accountConfig,
      accountId,
    },
  };
}
```

**Multi-account routing**:

- `accountId` flows through the entire pipeline: `resolveAgentRoute` → `buildAgentSessionKey` → session file → agent context
- Bindings support `match.accountId` to route specific accounts to specific agents
- Default account selection: explicit `defaultAccount` config → `"default"` account → first account (sorted by ID)

Example multi-account config:

```
{
  channels: {
    telegram: {
      defaultAccount: "main",
      accounts: {
        main: {
          name: "Primary bot",
          botToken: "${TELEGRAM_MAIN_TOKEN}",
          allowFrom: ["123456789"],
        },
        alerts: {
          name: "Alerts bot",
          botToken: "${TELEGRAM_ALERTS_TOKEN}",
          allowFrom: ["987654321"],
        },
      },
    },
  },
}
```

Sources: [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)[src/config/zod-schema.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.core.ts)[src/telegram/accounts.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/accounts.ts)[src/discord/accounts.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/accounts.ts)[src/slack/accounts.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/accounts.ts)

---

## Typing Indicators and Acknowledgement Reactions

### Typing Indicators

Typing indicators are implemented through `createTypingCallbacks`[src/channels/typing.ts15-80](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/typing.ts#L15-L80) which wraps a platform-specific start function. The returned callbacks integrate with `createReplyDispatcherWithTyping` and run in a loop during agent execution.

**Platform typing implementations**:
PlatformStart FunctionStop MethodNotesTelegram`sendChatActionHandler.sendChatAction(chatId, "typing")`Automatic timeoutLooped every 5 secondsDiscord`channel.sendTyping()`Automatic timeoutLooped every 9 secondsSlack`client.chat.setTyping(channel, true)`No explicit stopSingle callSignalNot supported—No typing APIiMessageNot supported—No typing API
**Implementation**:

```
// Telegram: src/telegram/bot.ts:356-366
const sendTyping = async () => {
  await sendChatActionHandler.sendChatAction(
    chatId,
    "typing",
    buildTypingThreadParams(replyThreadId)
  );
};
 
// Discord: src/discord/monitor/message-handler.process.ts:200-210
const typingStart = async () => {
  await channel.sendTyping();
};
```

Typing errors are logged via `logTypingFailure`[src/channels/logging.js40-55](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/logging.js#L40-L55) at verbose level and never block message processing.

### Acknowledgement (ACK) Reactions

ACK reactions provide immediate user feedback while the agent processes a message. The reaction emoji is resolved in priority order:

1. `channels.<provider>.accounts.<accountId>.ackReaction`
2. `channels.<provider>.ackReaction`
3. `messages.ackReaction`
4. `agents.list[].identity.emoji` (default `"👀"`)

**ACK reaction flow**:

```
off

dm / group-mentions / all

should ack

skip

true

false

Message received

ackReactionScope

shouldAckReaction

resolveAckReaction

Add reaction
(reactMessageTelegram /
reactDiscordMessage)

Agent execution

removeAckAfterReply?

removeAckReactionAfterReply

Complete
```

**Scope filtering** (enforced by `shouldAckReaction`[src/channels/ack-reactions.js15-70](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/ack-reactions.js#L15-L70)):
`ackReactionScope`Direct MessagesGroup (not mentioned)Group (mentioned)`off`NoNoNo`dm`YesNoNo`group-mentions`YesNoYes`group-all`YesYesYes`all`YesYesYes
Platforms without reaction support (Signal, iMessage) skip ACK reaction calls silently.

Sources: [src/channels/typing.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/typing.ts)[src/channels/ack-reactions.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/ack-reactions.js)[src/telegram/bot-message-context.ts477-490](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts#L477-L490)[src/discord/monitor/message-handler.process.ts124-170](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.process.ts#L124-L170)[src/channels/logging.js](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/logging.js)

---

## Group Chat History

Several channels prepend recent conversation history to the inbound context so the agent has conversational context beyond the current message. This is managed by `buildPendingHistoryContextFromMap` in `src/auto-reply/reply/history.js`.

- History is stored in a `Map<string, HistoryEntry[]>` keyed by the channel or group ID, held in memory on the monitor.
- Capacity is controlled by `historyLimit` (per channel config) or `messages.groupChat.historyLimit` (global fallback, default 50).
- Setting `historyLimit: 0` disables history for that channel.
- History is cleared from the map after dispatch via `clearHistoryEntriesIfEnabled`.

Sources: [`src/telegram/bot.ts262-268](https://github.com/openclaw/openclaw/blob/8873e13f/`src/telegram/bot.ts#L262-L268)[`src/discord/monitor/provider.ts293-295](https://github.com/openclaw/openclaw/blob/8873e13f/`src/discord/monitor/provider.ts#L293-L295)[`src/signal/monitor.ts`](https://github.com/openclaw/openclaw/blob/8873e13f/`src/signal/monitor.ts`)

---

## Heartbeat

Channels that support the `ChannelHeartbeatAdapter` interface can emit periodic outbound messages (heartbeats) to configured targets. This is configured under `channels.<provider>.heartbeat` using `ChannelHeartbeatVisibilitySchema` from `src/config/zod-schema.channels.js`. Heartbeat targets are resolved at the Gateway level by the cron subsystem. For details on the cron system see [Cron Service](/openclaw/openclaw/2.5-service-lifecycle-and-diagnostics).

Sources: [`src/config/zod-schema.providers-core.ts214-215](https://github.com/openclaw/openclaw/blob/8873e13f/`src/config/zod-schema.providers-core.ts#L214-L215)[`src/plugin-sdk/index.ts25](https://github.com/openclaw/openclaw/blob/8873e13f/`src/plugin-sdk/index.ts#L25-L25)

---

# Channel-Architecture

# Channel Architecture & Plugin SDK
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts)
- [src/auto-reply/reply/normalize-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/normalize-reply.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/auto-reply/tokens.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.test.ts)
- [src/auto-reply/tokens.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/draft-stream-loop.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/draft-stream-loop.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/imessage/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/monitor.ts)
- [src/signal/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor.ts)
- [src/slack/monitor.tool-result.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.tool-result.test.ts)
- [src/slack/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/bot-handlers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-handlers.ts)
- [src/telegram/bot-message-context.dm-threads.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.dm-threads.test.ts)
- [src/telegram/bot-message-context.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts)
- [src/telegram/bot-message-dispatch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.test.ts)
- [src/telegram/bot-message-dispatch.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.ts)
- [src/telegram/bot-native-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-commands.ts)
- [src/telegram/bot.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.test.ts)
- [src/telegram/bot.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts)
- [src/telegram/bot/delivery.replies.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.replies.ts)
- [src/telegram/bot/delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.test.ts)
- [src/telegram/bot/delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.ts)
- [src/telegram/bot/helpers.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.test.ts)
- [src/telegram/bot/helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.ts)
- [src/telegram/draft-stream.test-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test-helpers.ts)
- [src/telegram/draft-stream.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test.ts)
- [src/telegram/draft-stream.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.ts)
- [src/telegram/lane-delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.test.ts)
- [src/telegram/lane-delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)
- [src/web/auto-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/auto-reply.ts)
- [src/web/inbound.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.test.ts)
- [src/web/inbound.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.ts)
- [src/web/vcard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/vcard.ts)

This page describes how channel integrations are structured: the **monitor pattern** shared by all channels, the **Plugin SDK** (`openclaw/plugin-sdk`) that extension plugins import, the **`ChannelPlugin` interface** that declares channel capabilities, and the utility helpers for common tasks such as typing indicators, pairing challenges, access decisions, and webhook registration.

For Telegram-specific behavior, see [4.2](/openclaw/openclaw/4.2-telegram-integration). For Discord, see [4.3](/openclaw/openclaw/4.3-discord-integration). For other platforms, see [4.4](/openclaw/openclaw/4.4-other-channels). For how dispatched messages flow through the agent pipeline, see [3.1](/openclaw/openclaw/3.1-agent-execution-pipeline).

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

Sources: [src/telegram/bot.ts116-427](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts#L116-L427)[src/discord/monitor/provider.ts249-662](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L249-L662)[src/slack/monitor/provider.ts59-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts#L59-L200)[src/signal/monitor.ts1-51](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor.ts#L1-L51)[src/imessage/monitor/monitor-provider.ts84-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/monitor/monitor-provider.ts#L84-L200)[extensions/feishu/src/bot.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/feishu/src/bot.ts#L1-L50)[extensions/mattermost/src/mattermost/monitor.ts1-65](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/mattermost/src/mattermost/monitor.ts#L1-L65)

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

Sources: [src/discord/monitor/message-handler.process.ts60-580](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.process.ts#L60-L580)[src/discord/monitor/message-handler.preflight.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.preflight.ts#L1-L200)[src/signal/monitor/event-handler.ts55-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor/event-handler.ts#L55-L200)[src/imessage/monitor/monitor-provider.ts84-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/monitor/monitor-provider.ts#L84-L400)

### Preflight Access Control

Before dispatch, each channel evaluates access with these shared helpers (all importable from `openclaw/plugin-sdk`):
HelperSourcePurpose`resolveDmGroupAccessWithLists``src/security/dm-policy-shared.ts`DM policy + allowFrom check`createScopedPairingAccess``src/plugin-sdk/pairing-access.ts`Scoped pairing state per channel/account`issuePairingChallenge``src/pairing/pairing-challenge.ts`Generate and store pairing code`evaluateSenderGroupAccess``src/plugin-sdk/group-access.ts`Group sender access decision`resolveMentionGatingWithBypass``src/channels/mention-gating.ts``requireMention` + bypass logic`resolveControlCommandGate``src/channels/command-gating.ts`Command authorization gate
### Inbound Context Fields

`finalizeInboundContext` (from `src/auto-reply/reply/inbound-context.ts`) assembles the canonical payload:
FieldDescription`Body`Formatted envelope: `[Channel / from / timestamp]\ntext``BodyForAgent`Raw message text without envelope decoration`From`Sender ID (e.g. `discord:1234`, `telegram:5678`)`To`Reply target`SessionKey`Resolved session key for this conversation`ChatType``"direct"`, `"group"`, or `"channel"``Provider`Channel name string`MediaUrls`Paths to downloaded media`CommandAuthorized`Whether sender may run slash commands`WasMentioned`Whether the bot was @-mentioned
Sources: [src/discord/monitor/message-handler.process.ts337-378](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.process.ts#L337-L378)[src/signal/monitor/event-handler.ts55-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor/event-handler.ts#L55-L200)

---

## Plugin SDK

### Entry Point

`src/plugin-sdk/index.ts` is the single stable API surface for all extension channel plugins. It is published under the import path `openclaw/plugin-sdk`. Extension plugins must not import from internal package paths.

Sources: [src/plugin-sdk/index.ts1-450](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L1-L450)

### Plugin Package Shape: `OpenClawPluginApi`

A plugin package's root export must conform to `OpenClawPluginApi` (from `src/plugins/types.ts`):
FieldTypeDescription`configSchema``OpenClawPluginConfigSchema` (optional)Zod schema for `openclaw.json` config section`services``OpenClawPluginService[]`Services that run inside the gateway process`channels``ChannelPlugin[]` (optional)Channel plugin registrations
`OpenClawPluginService` is a factory function receiving `OpenClawPluginServiceContext` and returning lifecycle hooks (`start`, `stop`) plus optional HTTP route registrations.

Sources: [src/plugin-sdk/index.ts97-114](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L97-L114)

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

Sources: [src/plugin-sdk/index.ts8-63](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L8-L63)

### Adapter Interface Reference
AdapterKey Methods / Purpose`ChannelAuthAdapter`OAuth login, QR login start/wait, logout`ChannelSetupAdapter`Wizard `promptSetup` steps, initial config write`ChannelPairingAdapter`Handle pairing code exchange for `dmPolicy: "pairing"``ChannelMessagingAdapter``sendMessage`, `sendTyping``ChannelOutboundAdapter`Delivery to explicit targets (`ChannelOutboundContext`)`ChannelStreamingAdapter`Progressive reply streaming (edit-based draft)`ChannelStatusAdapter``getStatus()` → `ChannelAccountSnapshot` + `ChannelStatusIssue[]``ChannelThreadingAdapter`Thread session key derivation, tool context for agents`ChannelGroupAdapter`Group allowlist resolution, `ChannelGroupContext``ChannelMentionAdapter`Custom mention regex patterns for group activation`ChannelCommandAdapter`Register and handle native slash commands`ChannelConfigAdapter`Handle runtime config writes triggered by channel events`ChannelDirectoryAdapter``listPeers`, `listGroups` → `ChannelDirectoryEntry[]``ChannelHeartbeatAdapter`Send heartbeat pings to configured recipients`ChannelSecurityAdapter`Contribute findings to `openclaw security audit``ChannelGatewayAdapter`Receive gateway-level lifecycle events`ChannelMessageActionAdapter`Expose platform actions as agent tools`ChannelResolverAdapter`Resolve human-readable targets to platform IDs
Sources: [src/plugin-sdk/index.ts8-62](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L8-L62)

---

## PluginRuntime

`PluginRuntime` (from `src/plugins/runtime/types.ts`) is injected into plugin service context objects. It provides:
NamespaceDescription`channel.media.*`Save/load/detect media buffers`agent.*`Dispatch inbound messages, start agent turns`session.*`Read and write session metadata`log` / `error`Runtime loggerConfig accessRead the resolved `OpenClawConfig`
The implementation is built in `src/plugins/runtime/index.ts` and re-exports many internal utilities pre-bound to the gateway's running context.

Sources: [src/plugins/runtime/types.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugins/runtime/types.ts#L1-L50)[src/plugins/runtime/index.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugins/runtime/index.ts#L1-L50)

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

Sources: [src/channels/typing.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/typing.ts#L1-L50)[src/discord/monitor/message-handler.process.ts419-429](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.process.ts#L419-L429)

### Pairing Challenge Flow

For `dmPolicy: "pairing"`, the standard flow is:

1. `createScopedPairingAccess` wraps per-account pairing state.
2. `issuePairingChallenge` creates a one-time code and returns a reply string to send back to the user.
3. The operator runs `openclaw pairing approve <channel> <code>`.
4. Subsequent messages from the approved sender are allowed through.

Sources: [src/plugin-sdk/index.ts219-221](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L219-L221)

### Group History Context

Channels that support group history inject recent messages into the inbound envelope using:

- `recordPendingHistoryEntryIfEnabled` — append an entry to the in-memory history map
- `buildPendingHistoryContextFromMap` — prepend the history window to the current `Body`
- `clearHistoryEntriesIfEnabled` — evict entries after reply

Sources: [src/plugin-sdk/index.ts309-317](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L309-L317)

### Allowlist and Access Decisions
FunctionPurpose`isAllowedParsedChatSender`Check a sender ID/name against an `allowFrom` list`formatAllowFromLowercase`Normalize `allowFrom` entries for comparison`evaluateSenderGroupAccess`Full group access decision (`SenderGroupAccessDecision`)`resolveDmGroupAccessWithLists`DM policy check combining `allowFrom` + pairing store`readStoreAllowFromForDmPolicy`Read approved senders from the pairing store file`resolveRuntimeGroupPolicy`Resolve the effective `GroupPolicy` for a channel account
Sources: [src/plugin-sdk/index.ts207-422](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L207-L422)

### Text Chunking

`chunkTextForOutbound` (from `src/plugin-sdk/text-chunking.ts`) splits reply text into platform-appropriate chunks using `textChunkLimit` and `chunkMode` (`"length"` or `"newline"`). Per-channel limits are accessed via `resolveTextChunkLimit` (from `src/auto-reply/chunk.ts`).

Sources: [src/plugin-sdk/index.ts235](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L235-L235)

### Reply Delivery Helpers
FunctionSourcePurpose`createNormalizedOutboundDeliverer``src/plugin-sdk/reply-payload.ts`Normalize `ReplyPayload` for send`normalizeOutboundReplyPayload``src/plugin-sdk/reply-payload.ts`Resolve media URLs and metadata`sendMediaWithLeadingCaption``src/plugin-sdk/reply-payload.ts`Send text + media together`formatTextWithAttachmentLinks``src/plugin-sdk/reply-payload.ts`Append attachment URLs to text
Sources: [src/plugin-sdk/index.ts224-230](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L224-L230)

### Media Handling
FunctionSourcePurpose`buildAgentMediaPayload``src/plugin-sdk/agent-media-payload.ts`Convert downloaded files to `AgentMediaPayload``buildMediaPayload``src/channels/plugins/media-payload.ts`Low-level media payload builder`resolveChannelMediaMaxBytes``src/channels/plugins/media-limits.ts`Resolve configured byte size limit`loadWebMedia``src/web/media.ts`Download media from a URL
Sources: [src/plugin-sdk/index.ts132-136](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L132-L136)[extensions/feishu/src/bot.ts336-395](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/feishu/src/bot.ts#L336-L395)

### Webhook Registration

HTTP-based channels register with the gateway's HTTP listener at startup:
FunctionSourcePurpose`registerPluginHttpRoute``src/plugins/http-registry.ts`Register an HTTP route with the gateway`normalizePluginHttpPath``src/plugins/http-path.ts`Normalize the route path`registerWebhookTarget``src/plugin-sdk/webhook-targets.ts`Register a webhook recipient by account`resolveSingleWebhookTarget``src/plugin-sdk/webhook-targets.ts`Look up webhook registration`rejectNonPostWebhookRequest``src/plugin-sdk/webhook-targets.ts`Validate HTTP method
Sources: [src/plugin-sdk/index.ts113-130](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L113-L130)

### Ack Reactions

Channels that support reactions use `createStatusReactionController` (from `src/channels/status-reactions.ts`) and `shouldAckReaction` (from `src/channels/ack-reactions.ts`) to set an acknowledgement emoji while processing and clear or update it on reply delivery. The initial emoji is resolved by `resolveAckReaction` (from `src/agents/identity.ts`).

Sources: [src/discord/monitor/message-handler.process.ts124-173](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.process.ts#L124-L173)

### Miscellaneous SDK Utilities
FunctionPurpose`createDedupeCache` / `createPersistentDedupe`Deduplication for inbound message IDs`readJsonFileWithFallback` / `writeJsonFileAtomically`Safe JSON file I/O for plugin state`buildRandomTempFilePath` / `withTempDownloadPath`Temp file management for media downloads`acquireFileLock` / `withFileLock`File-based locking for shared state`runPluginCommandWithTimeout`Run a CLI subprocess with timeout from plugin code`recordInboundSession`Update session metadata and `lastRoute` after processing`formatInboundFromLabel`Format human-readable from-label for envelopes
Sources: [src/plugin-sdk/index.ts234-445](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L234-L445)

---

## Channel Configuration Schemas

Each channel's configuration block in `openclaw.json` is validated by a Zod schema. Built-in schemas live in `src/config/zod-schema.providers-core.ts`:
`channels.*` keyZod SchemaFile`telegram``TelegramConfigSchema``zod-schema.providers-core.ts``discord``DiscordConfigSchema``zod-schema.providers-core.ts``slack``SlackConfigSchema``zod-schema.providers-core.ts``signal``SignalConfigSchema``zod-schema.providers-core.ts``imessage``IMessageConfigSchema``zod-schema.providers-core.ts``googlechat``GoogleChatConfigSchema``zod-schema.providers-core.ts``whatsapp``WhatsAppConfigSchema``zod-schema.providers-whatsapp.ts`
Extension plugins define their own Zod schema and register it as the `ChannelConfigSchema` field on their `ChannelPlugin`. The helper `buildChannelConfigSchema` (from `src/channels/plugins/config-schema.ts`) provides scaffolding for common fields.

Sensitive fields (tokens, secrets) use `.register(sensitive)` from `src/config/zod-schema.sensitive.ts`. This causes the field to be redacted from logs and config API responses.

Multi-account patterns: each schema has a root account section plus an optional `accounts` record keyed by account ID. Runtime resolution always calls the channel's `resolveXxxAccount` helper, which performs shallow-merge of root + account-level config.

Sources: [src/config/zod-schema.providers-core.ts1-900](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L1-L900)[src/plugin-sdk/index.ts176-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L176-L200)

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

Sources: [src/plugin-sdk/index.ts1-450](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L1-L450)

---

# Telegram-Integration

# Telegram Integration
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts)
- [src/auto-reply/reply/normalize-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/normalize-reply.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/auto-reply/tokens.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.test.ts)
- [src/auto-reply/tokens.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/draft-stream-loop.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/draft-stream-loop.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/imessage/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/monitor.ts)
- [src/signal/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor.ts)
- [src/slack/monitor.tool-result.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.tool-result.test.ts)
- [src/slack/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/bot-handlers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-handlers.ts)
- [src/telegram/bot-message-context.dm-threads.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.dm-threads.test.ts)
- [src/telegram/bot-message-context.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts)
- [src/telegram/bot-message-dispatch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.test.ts)
- [src/telegram/bot-message-dispatch.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.ts)
- [src/telegram/bot-native-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-commands.ts)
- [src/telegram/bot.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.test.ts)
- [src/telegram/bot.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts)
- [src/telegram/bot/delivery.replies.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.replies.ts)
- [src/telegram/bot/delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.test.ts)
- [src/telegram/bot/delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.ts)
- [src/telegram/bot/helpers.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.test.ts)
- [src/telegram/bot/helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.ts)
- [src/telegram/draft-stream.test-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test-helpers.ts)
- [src/telegram/draft-stream.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test.ts)
- [src/telegram/draft-stream.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.ts)
- [src/telegram/lane-delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.test.ts)
- [src/telegram/lane-delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)
- [src/web/auto-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/auto-reply.ts)
- [src/web/inbound.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.test.ts)
- [src/web/inbound.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.ts)
- [src/web/vcard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/vcard.ts)

## Purpose and Scope

This document covers the Telegram Bot API integration in OpenClaw, including bot initialization, message processing pipelines, access control enforcement, native command handling, and streaming delivery mechanisms. For general channel architecture patterns, see [Channel Architecture](/openclaw/openclaw/4.1-channel-architecture). For access control policy configuration, see [Access Control Policies](/openclaw/openclaw/7.1-access-control-policies). For configuration field reference, see [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference).

---

## Architecture Overview

The Telegram integration uses the grammY bot library with custom middleware for access control, message deduplication, media handling, and streaming delivery. The gateway owns the Telegram bot lifecycle and routes inbound messages through dedicated processing pipelines.

```
Outbound Delivery

Command & Reply Dispatch

Inbound Pipeline

Bot Initialization

createTelegramBot()

Bot constructor
(grammY)

Middleware Stack

Event Handlers

Telegram Bot API
(long polling)

Update Deduplication
createTelegramUpdateDedupe()

sequentialize()
per-chat queuing

createTelegramMessageProcessor()

Access Control
enforceTelegramDmAccess()
evaluateTelegramGroupBaseAccess()

buildTelegramMessageContext()

registerTelegramNativeCommands()

dispatchTelegramMessageReply()

runReplyAgent()

deliverReplies()

Lane Delivery + Draft Stream

sendMessageTelegram()
editMessageTelegram()
sendPollTelegram()

Telegram Bot API
(sendMessage, editMessageText)
```

**Sources**: [src/telegram/bot.ts1-417](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts#L1-L417)[src/telegram/bot-message.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message.ts#L1-LNaN)[src/telegram/bot-message-dispatch.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.ts#L1-LNaN)[src/telegram/send.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L1-LNaN)

---

## Bot Initialization and Lifecycle

### Factory Function: `createTelegramBot`

The entry point for Telegram integration is `createTelegramBot` in [src/telegram/bot.ts69-416](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts#L69-L416) It accepts `TelegramBotOptions` and returns a configured grammY `Bot` instance.
Initialization StepFunction/ModulePurposeAccount resolution`resolveTelegramAccount`Resolves token, config, and account settingsThread binding setup`createTelegramThreadBindingManager`Creates forum topic / DM topic session binding managerUpdate tracking`createTelegramUpdateDedupe`Deduplicates updates by keySequentialization`sequentialize(getTelegramSequentialKey)`Enforces per-chat/per-thread message orderingSendChatAction handler`createTelegramSendChatActionHandler`Wraps typing indicators with 401 backoff/circuit breakerMessage processor`createTelegramMessageProcessor`Main inbound message → reply pipelineNative commands`registerTelegramNativeCommands`Registers slash commands with TelegramEvent handlers`registerTelegramHandlers`Callback queries, media groups, reactions
**Update watermark persistence**: The bot tracks `highestCompletedUpdateId` and persists safe watermarks only below the minimum pending update ID to avoid skipping queued updates after restart [src/telegram/bot.ts126-160](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts#L126-L160)

**Sources**: [src/telegram/bot.ts69-416](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts#L69-L416)[src/telegram/accounts.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/accounts.ts#L1-LNaN)[src/telegram/thread-bindings.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/thread-bindings.ts#L1-LNaN)[src/telegram/bot-updates.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-updates.ts#L1-LNaN)[src/telegram/sendchataction-401-backoff.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/sendchataction-401-backoff.ts#L1-LNaN)

---

## Inbound Message Processing Pipeline

### Update Flow: Telegram API → Context → Dispatch

```
not duplicate

has media_group_id

no media_group

allowed

flush

Telegram Update
(message, callback_query, etc.)

shouldSkipUpdate()
buildTelegramUpdateKey()

pendingUpdateIds.add(updateId)

sequentialize key:
getTelegramSequentialKey()

on('message')
on('callback_query')
on('message_reaction')

Media Group Collector
(MEDIA_GROUP_TIMEOUT_MS)

resolveMedia()
fetch via bot.api.getFile()

processMessage()
(createTelegramMessageProcessor)

buildTelegramMessageContext()

enforceTelegramDmAccess()
evaluateTelegramGroupBaseAccess()

resolveAgentRoute()
resolveConfiguredAcpRoute()

Inbound Debounce
(resolveInboundDebounceMs)

dispatchTelegramMessageReply()
```

**Sources**: [src/telegram/bot.ts162-234](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts#L162-L234)[src/telegram/bot-updates.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-updates.ts#L1-LNaN)[src/telegram/bot-message.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message.ts#L1-LNaN)[src/telegram/bot-handlers.ts107](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-handlers.ts#L107-LNaN)

### Context Building: `buildTelegramMessageContext`

Located in [src/telegram/bot-message-context.ts170](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts#L170-LNaN) this function transforms a raw Telegram update into a normalized `TelegramMessageContext` with:

- **Session routing**: Resolves `agentId`, `sessionKey`, `mainSessionKey` via `resolveAgentRoute` and configured ACP bindings
- **Thread isolation**: DM topics and forum topics append `:topic:<threadId>` to session keys
- **Access enforcement**: Checks DM policy, group policy, sender allowlists
- **Mention detection**: Evaluates `requireMention` and `mentionRegexes` for group activation
- **Media placeholders**: Constructs `MediaPath` / `MediaPaths` for attachments, stickers, and reply media
- **Reply metadata**: Extracts `ReplyToId`, `ReplyToBody`, `ReplyToSender`, quote text, and forwarding context
- **Envelope formatting**: Builds `Body` with timestamp, sender name, group label, and message text/captions

**DM topic handling**: When `message_thread_id` is present in DMs, OpenClaw generates thread-scoped session keys [src/telegram/bot-message-context.ts426-430](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts#L426-L430) and preserves thread ID for reply delivery.

**Sources**: [src/telegram/bot-message-context.ts170](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts#L170-LNaN)[src/telegram/bot/helpers.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.ts#L1-LNaN)[src/routing/resolve-route.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/routing/resolve-route.ts#L1-LNaN)

---

## Access Control System

### DM Policy Enforcement

`enforceTelegramDmAccess` in [src/telegram/dm-access.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/dm-access.ts#L1-LNaN) implements pairing-based DM access:
`dmPolicy` ModeBehavior`pairing`Unknown senders receive pairing code; requires approval via `openclaw pairing approve telegram <CODE>``allowlist`Only senders in `allowFrom` (or paired allowlist store)`open`Requires `allowFrom` to include `"*"``disabled`All DMs blocked
**Pairing flow**:

1. Unknown sender DMs bot → `sendMessageTelegram` sends pairing code [src/telegram/dm-access.ts53-88](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/dm-access.ts#L53-L88)
2. Operator approves via CLI or agent command → updates allowlist store
3. Subsequent messages from sender pass access checks

**Sources**: [src/telegram/dm-access.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/dm-access.ts#L1-LNaN)[src/telegram/bot-access.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-access.ts#L1-LNaN)[src/pairing/pairing-store.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/pairing/pairing-store.ts#L1-LNaN)

### Group Policy and Sender Authorization

`evaluateTelegramGroupBaseAccess` in [src/telegram/group-access.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/group-access.ts#L1-LNaN) enforces group-level access:

1. **Group ID authorization**: Checks `channels.telegram.groups` config (explicit ID or wildcard `"*"`)
2. **Topic-level overrides**: `groups.<groupId>.topics.<topicId>` can override `enabled`, `allowFrom`, `requireMention`
3. **Sender authorization**: If `allowFrom` is present (group or topic level), sender must match

**Group policy modes**:

- `allowlist` (default): Only groups in `channels.telegram.groups` config
- `open`: Bypass group allowlist (mention gating still applies)
- `disabled`: Block all group messages

**Per-topic agent routing**: `topicConfig.agentId` overrides agent selection for specific forum topics [src/telegram/bot-message-context.ts228-253](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts#L228-L253)

**Sources**: [src/telegram/group-access.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/group-access.ts#L1-LNaN)[src/telegram/bot-message-context.ts206-253](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts#L206-L253)[src/config/group-policy.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/group-policy.ts#L1-LNaN)

### Allowlist Resolution

`normalizeDmAllowFromWithStore` and `normalizeAllowFrom` in [src/telegram/bot-access.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-access.ts#L1-LNaN) normalize allowlist inputs:

- Numeric Telegram user IDs (e.g. `123456789`)
- Prefixed IDs (e.g. `telegram:123456789`, `tg:123456789`)
- Wildcard `"*"` for open access
- Pairing store entries (DM mode only)

`isSenderAllowed` checks if a sender ID or username matches the normalized allowlist [src/telegram/bot-access.ts68-91](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-access.ts#L68-L91)

**Sources**: [src/telegram/bot-access.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-access.ts#L1-LNaN)[src/telegram/bot-message-context.ts309-316](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts#L309-L316)

---

## Native Command System

### Command Registration: `registerTelegramNativeCommands`

Located in [src/telegram/bot-native-commands.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-commands.ts#L1-LNaN) this module registers Telegram slash commands with `bot.api.setMyCommands`.

**Command catalog assembly**:

1. Native commands from `listNativeCommandSpecsForConfig` (e.g. `/status`, `/model`, `/help`)
2. Skill commands from `listSkillCommandsForAgents` (if `nativeSkills` enabled)
3. Custom commands from `channels.telegram.customCommands`
4. Plugin commands from `getPluginCommandSpecs`

**Collision detection**: Custom/plugin commands that collide with native names are skipped with error logs [src/telegram/bot.test.ts94-138](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.test.ts#L94-L138)

**Menu sync**: `syncTelegramMenuCommands` in [src/telegram/bot-native-command-menu.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-command-menu.ts#L1-LNaN) caps total commands at 100 (Telegram limit) and merges command groups.

**Sources**: [src/telegram/bot-native-commands.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-commands.ts#L1-LNaN)[src/telegram/bot-native-command-menu.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-command-menu.ts#L1-LNaN)[src/telegram/bot.test.ts59-170](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.test.ts#L59-L170)

### Command Execution

Native commands are handled by `bot.command(...)` handlers [src/telegram/bot-native-commands.ts398](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-commands.ts#L398-LNaN) Each handler:

1. Authorizes sender via `resolveCommandAuthorizedFromAuthorizers`
2. Parses command args via `parseCommandArgs`
3. Builds inbound context with `buildCommandInboundContext`
4. Dispatches to agent via `dispatchReplyWithBufferedBlockDispatcher`
5. Delivers reply via `deliverReplies`

**Slash command routing**: Uses `channels.telegram.slashCommand.sessionPrefix` to isolate slash command sessions from regular message sessions.

**Sources**: [src/telegram/bot-native-commands.ts398](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-commands.ts#L398-LNaN)[src/auto-reply/commands-registry.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/commands-registry.ts#L1-LNaN)

---

## Outbound Message Delivery

### Delivery Orchestrator: `deliverReplies`

Located in [src/telegram/bot/delivery.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.ts#L1-LNaN) this function processes `ReplyPayload[]` and dispatches to Telegram:

```
ReplyPayload[]
(from agent)

Type Router

Text Reply

Media Reply
(photo, video, audio, sticker)

Poll Reply

Reaction Reply

Streaming Handler
(lane delivery + draft stream)

Direct Send
(sendMessageTelegram)
```

**Message chunking**: Text exceeding `textLimit` (default 4096 chars) is split via `chunkTextWithMode`[src/auto-reply/chunk.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/chunk.ts#L1-LNaN)

**Button attachment**: `TelegramInlineButtons` are converted to `InlineKeyboardMarkup` via `buildInlineKeyboard`[src/telegram/send.ts92-171](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L92-L171)

**Sources**: [src/telegram/bot/delivery.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.ts#L1-LNaN)[src/telegram/bot/delivery.replies.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.replies.ts#L1-LNaN)[src/telegram/send.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L1-LNaN)

### Send Functions

Core send operations in [src/telegram/send.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L1-LNaN):
FunctionPurposeTelegram API Method`sendMessageTelegram`Send text messages`sendMessage``editMessageTelegram`Edit existing messages`editMessageText``sendPollTelegram`Send polls`sendPoll``sendStickerTelegram`Send stickers`sendSticker``reactMessageTelegram`React to messages`setMessageReaction``createForumTopicTelegram`Create forum topics`createForumTopic`
**Thread parameter injection**: `buildTelegramThreadReplyParams` in [src/telegram/send.ts262-292](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L262-L292) adds `message_thread_id` and `reply_to_message_id` / `reply_parameters` for threading.

**Thread-not-found fallback**: If Telegram returns "message thread not found", OpenClaw retries without `message_thread_id`[src/telegram/send.ts395-417](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L395-L417)

**HTML parse fallback**: If Telegram rejects HTML parse mode, OpenClaw retries as plain text [src/telegram/send.ts294-315](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L294-L315)

**Sources**: [src/telegram/send.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L1-LNaN)[src/telegram/send.test.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts#L1-LNaN)

---

## Streaming and Draft Updates

### Streaming Modes

`channels.telegram.streaming` controls live preview behavior:
ModeDM BehaviorGroup/Topic Behavior`off`No streamingNo streaming`partial``sendMessageDraft` + updatesPreview message + `editMessageText``block`Block streaming (separate messages)Block streaming`progress`Maps to `partial`Maps to `partial`
**Draft streaming (DM only)**: Uses Telegram's `sendMessageDraft` API (Bot API 9.5+) to update drafts in place without sending separate preview messages [src/telegram/draft-stream.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.ts#L1-LNaN)

**Group preview streaming**: Sends a preview message with 🔄 indicator, then edits in place as text accumulates [src/telegram/lane-delivery.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.ts#L1-LNaN)

**Sources**: [src/telegram/bot-message-dispatch.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.ts#L1-LNaN)[src/telegram/draft-stream.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.ts#L1-LNaN)[src/telegram/lane-delivery.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.ts#L1-LNaN)[src/config/discord-preview-streaming.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/discord-preview-streaming.ts#L1-LNaN)

### Lane Delivery Coordinator

`createLaneDeliveryStateTracker` in [src/telegram/lane-delivery.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.ts#L1-LNaN) manages multi-lane streaming:

- **Main lane**: Assistant text
- **Reasoning lane**: Optional reasoning stream (`/reasoning stream`)
- **Status lane**: Tool/command status

Each lane maintains its own `DraftLaneState` with message ID, archived previews, and text buffer. `createLaneTextDeliverer` flushes lanes via `editMessageTelegram` when buffer exceeds thresholds.

**Reasoning stream splitting**: `splitTelegramReasoningText` in [src/telegram/reasoning-lane-coordinator.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/reasoning-lane-coordinator.ts#L1-LNaN) separates reasoning from final answer and routes them to separate lanes.

**Sources**: [src/telegram/lane-delivery.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.ts#L1-LNaN)[src/telegram/reasoning-lane-coordinator.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/reasoning-lane-coordinator.ts#L1-LNaN)[src/telegram/bot-message-dispatch.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.ts#L1-LNaN)

---

## Media Handling

### Inbound Media Resolution

`resolveMedia` in [src/telegram/bot/delivery.resolve-media.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.resolve-media.ts#L1-LNaN) fetches media via `bot.api.getFile()` and downloads via Telegram CDN:

1. **File ID resolution**: Extract `file_id` from photo, video, document, audio, voice, sticker
2. **File metadata fetch**: `bot.api.getFile(fileId)` → `file_path`
3. **Download**: Fetch from `https://api.telegram.org/file/bot<token>/<file_path>`
4. **Save to disk**: `saveMediaBuffer` writes to `~/.openclaw/media`

**Media group handling**: Updates with the same `media_group_id` are collected for `MEDIA_GROUP_TIMEOUT_MS` (default 1000ms), then processed as a batch [src/telegram/bot-handlers.ts107](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-handlers.ts#L107-LNaN)

**Sticker caching**: `cacheSticker` in [src/telegram/sticker-cache.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/sticker-cache.ts#L1-LNaN) stores sticker image descriptions so repeated sticker sends can reuse cached descriptions instead of re-analyzing.

**Sources**: [src/telegram/bot/delivery.resolve-media.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.resolve-media.ts#L1-LNaN)[src/telegram/bot-handlers.ts107](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-handlers.ts#L107-LNaN)[src/telegram/bot-updates.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-updates.ts#L1-LNaN)[src/telegram/sticker-cache.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/sticker-cache.ts#L1-LNaN)

### Outbound Media Delivery

`sendMessageTelegram` handles media delivery [src/telegram/send.ts600](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L600-LNaN):

- **Photo**: `sendPhoto` with caption
- **Video**: `sendVideo` with caption
- **Audio**: `sendAudio` (or `sendVoice` if `asVoice: true`)
- **Document**: `sendDocument` with caption
- **Sticker**: Via `sendStickerTelegram`

**Media loading**: `loadWebMedia` in [src/web/media.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/media.ts#L1-LNaN) fetches media from URLs or local paths based on `mediaUrl` / `mediaLocalRoots` options.

**Caption splitting**: `splitTelegramCaption` in [src/telegram/caption.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/caption.ts#L1-LNaN) splits captions exceeding 1024 chars into separate text messages.

**Sources**: [src/telegram/send.ts600](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts#L600-LNaN)[src/web/media.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/media.ts#L1-LNaN)[src/telegram/caption.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/caption.ts#L1-LNaN)

---

## Configuration Schema

### Account-Level Schema: `TelegramAccountSchema`

Defined in [src/config/zod-schema.providers-core.ts152-260](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L152-L260):
FieldTypePurpose`botToken``SecretInputSchema`Bot token (or `tokenFile`, or `TELEGRAM_BOT_TOKEN` env)`dmPolicy``DmPolicySchema``pairing` | `allowlist` | `open` | `disabled``allowFrom``Array<string | number>`DM sender allowlist (numeric IDs or prefixed)`groups``Record<string, TelegramGroupSchema>`Per-group config (ID or `"*"`)`groupPolicy``GroupPolicySchema``allowlist` | `open` | `disabled``groupAllowFrom``Array<string | number>`Group sender allowlist`streaming``boolean | enum``off` | `partial` | `block` | `progress``customCommands``Array<TelegramCustomCommandSchema>`Custom bot menu commands`historyLimit``number`Group history message count`dmHistoryLimit``number`DM history message count`direct``Record<string, TelegramDirectSchema>`Per-DM config overrides`threadBindings``object`Thread binding policy (enabled, idleHours, maxAgeHours)
**Group schema**: `TelegramGroupSchema` supports `requireMention`, `allowFrom`, `skills`, `systemPrompt`, and nested `topics`[src/config/zod-schema.providers-core.ts75-88](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L75-L88)

**Topic schema**: `TelegramTopicSchema` allows per-topic overrides of `requireMention`, `allowFrom`, `skills`, `systemPrompt`, and `agentId`[src/config/zod-schema.providers-core.ts62-73](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L62-L73)

**Sources**: [src/config/zod-schema.providers-core.ts152-315](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L152-L315)[src/config/types.telegram.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts#L1-LNaN)

### Top-Level Schema: `TelegramConfigSchema`

Defined in [src/config/zod-schema.providers-core.ts262-315](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L262-L315) extends `TelegramAccountSchemaBase` with:

- `accounts`: `Record<string, TelegramAccountSchema>` for multi-account setups
- `defaultAccount`: `string` for default account selection

**Validation refinements**:

- `requireOpenAllowFrom`: `dmPolicy="open"` requires `allowFrom` to include `"*"`
- `requireAllowlistAllowFrom`: `dmPolicy="allowlist"` requires at least one sender in `allowFrom`
- `validateTelegramCustomCommands`: Checks for command name collisions and invalid patterns
- Per-account validation: Applies same validation to each account entry

**Sources**: [src/config/zod-schema.providers-core.ts262-315](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L262-L315)[src/config/telegram-custom-commands.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/telegram-custom-commands.ts#L1-LNaN)

---

# Discord-Integration

# Discord
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)

This page documents the Discord channel integration in OpenClaw: the runtime lifecycle of the Discord bot, how inbound messages are authorized and dispatched, how guild/channel allowlists are resolved, thread binding behavior, exec approval interactive components, and native slash command deployment. For general channel architecture and the plugin SDK pattern, see [4.1](/openclaw/openclaw/4.1-channel-architecture). For configuration field-by-field reference, see [2.3.1](/openclaw/openclaw/2.3.1-configuration-reference).

---

## Overview

The Discord integration connects OpenClaw to Discord via the official Gateway WebSocket using the `@buape/carbon` library. It is started by the OpenClaw Gateway as part of channel startup. The primary entry point is `monitorDiscordProvider` in [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts) which wires together authentication, command deployment, message listeners, thread bindings, exec approval handlers, and agent components.

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

Sources: [src/discord/monitor/provider.ts1-687](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L1-L687)

---

## Bot setup and privileged intents

The Discord bot requires a bot token from the Discord Developer Portal and specific **privileged gateway intents** enabled on the application:
IntentRequiredPurposeMessage Content IntentYesReceive message text in guildsServer Members IntentRecommendedRole allowlists, name-to-ID resolutionPresence IntentOptionalPresence tracking (`channels.discord.intents.presence`)
Token resolution order:

1. `opts.token` (programmatic)
2. `channels.discord.token` (config)
3. `DISCORD_BOT_TOKEN` environment variable (default account only)

Multi-account setups configure additional accounts under `channels.discord.accounts.<accountId>`. Named accounts inherit `channels.discord.allowFrom` when their own `allowFrom` is unset, but do not inherit `channels.discord.accounts.default.allowFrom`.

Sources: [src/discord/monitor/provider.ts249-261](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L249-L261)[src/config/zod-schema.providers-core.ts406-554](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L406-L554)

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

Sources: [src/discord/monitor/provider.ts249-662](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L249-L662)

Key steps in `monitorDiscordProvider`:

1. **Account resolution** — `resolveDiscordAccount` merges per-account config with the root `channels.discord` block.
2. **Allowlist resolution** — `resolveDiscordAllowlistConfig` calls the Discord REST API to resolve guild slugs to IDs and validates user allowlists. Guild slug-based entries in `channels.discord.guilds` are resolved to numeric IDs at startup.
3. **Application ID fetch** — `fetchDiscordApplicationId` is called with a 4-second timeout to obtain the bot's Discord application ID.
4. **Command building** — `listNativeCommandSpecsForConfig` assembles slash commands from the native command registry; each is wrapped in `createDiscordNativeCommand`. If the total exceeds 100 commands, per-skill commands are dropped and a warning is logged.
5. **Component registration** — Interactive components including exec approval buttons, agent component buttons, model picker selects, and modals are registered on the `Client`.
6. **Listener registration** — `DiscordMessageListener`, `DiscordReactionListener`, `DiscordReactionRemoveListener`, and optionally `DiscordPresenceListener` are attached via `registerDiscordListener`.
7. **Gateway lifecycle** — `runDiscordGatewayLifecycle` drives the WebSocket connection, handling reconnects and abort signals.

Sources: [src/discord/monitor/provider.ts249-662](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L249-L662)

---

## Access control: guild and channel allowlists

Allow-list resolution is handled by functions in [src/discord/monitor/allow-list.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/allow-list.ts)

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

Sources: [src/discord/monitor/message-handler.preflight.ts108-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.preflight.ts#L108-L400)[src/discord/monitor/allow-list.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/allow-list.ts#L1-L200)

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

Sources: [src/discord/monitor/allow-list.ts56-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/allow-list.ts#L56-L200)[src/discord/monitor/message-handler.preflight.ts177-310](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.preflight.ts#L177-L310)

---

## Message preflight

Every inbound message passes through `preflightDiscordMessage` in [src/discord/monitor/message-handler.preflight.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.preflight.ts) This function returns a `DiscordMessagePreflightContext` on success, or `null` to drop the message.

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

Sources: [src/discord/monitor/message-handler.preflight.ts108-400](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.preflight.ts#L108-L400)

Pairing flow: when `dmPolicy="pairing"` and the sender is not in the allowlist, `upsertChannelPairingRequest` is called and the bot sends a pairing code reply via `buildPairingReply`.

`resolveDiscordSenderIdentity` handles PluralKit proxy messages: when `pluralkit.enabled=true`, it calls `fetchPluralKitMessageInfo` before resolving the sender identity.

Sources: [src/discord/monitor/message-handler.preflight.ts132-158](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/message-handler.preflight.ts#L132-L158)[src/discord/monitor/sender-identity.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/sender-identity.ts)

---

## Session keys
ScenarioSession key patternDM (default `dmScope=main`)`agent:<agentId>:main`Guild channel`agent:<agentId>:discord:channel:<channelId>`Thread`agent:<agentId>:discord:channel:<threadId>`Slash command`agent:<agentId>:discord:slash:<userId>`
Guild channel sessions are isolated per channel ID. Thread sessions use the thread's own ID as the channel ID component.

Sources: [src/discord/monitor/provider.ts257-260](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L257-L260)[docs/channels/discord.md254-260](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md#L254-L260)

---

## Thread bindings

Thread bindings associate a Discord thread with an agent session, enabling autonomous subagents to post into threads directly.

`createThreadBindingManager` or `createNoopThreadBindingManager` is constructed at startup based on `channels.discord.threadBindings.enabled` (default: `true`).

Configuration fields under `channels.discord.threadBindings`:
FieldDefaultDescription`enabled``true`Enable/disable thread binding subsystem`idleHours``24`Expire thread binding after idle time`maxAgeHours``0` (disabled)Absolute max age before expiry`spawnSubagentSessions`—Control subagent thread spawn behavior`spawnAcpSessions`—Control ACP-routed thread spawns
At startup, `reconcileAcpThreadBindingsOnStartup` removes stale ACP thread bindings from previous sessions.

`isRecentlyUnboundThreadWebhookMessage` prevents double-processing webhook messages from threads that were recently unbound.

Sources: [src/discord/monitor/provider.ts382-401](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L382-L401)[src/discord/monitor/thread-bindings.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/thread-bindings.ts)

---

## Exec approvals

When `channels.discord.execApprovals.enabled=true`, OpenClaw routes exec approval requests to Discord as interactive messages with approve/deny buttons.

`DiscordExecApprovalHandler` ([src/discord/monitor/exec-approvals.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/exec-approvals.ts)) is instantiated in `monitorDiscordProvider` and receives the account config. `createExecApprovalButton` registers the button component on the `Client`.

Configuration under `channels.discord.execApprovals`:
FieldDescription`enabled`Enable Discord exec approval flow`approvers`Discord user IDs that may approve`agentFilter`Limit which agent IDs trigger approvals`sessionFilter`Limit which session keys trigger approvals`cleanupAfterResolve`Delete button message after approval/denial`target`Where to send approval: `dm`, `channel`, or `both`
Sources: [src/discord/monitor/provider.ts430-471](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L430-L471)[src/config/zod-schema.providers-core.ts466-476](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L466-L476)

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

Sources: [src/discord/monitor/provider.ts356-380](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L356-L380)[src/discord/monitor/provider.ts189-206](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L189-L206)

When `commands.native=false` is explicitly set, `clearDiscordNativeCommands` issues a `PUT /applications/<id>/commands` with an empty body to remove all previously registered commands.

Each native command spec is wrapped in `createDiscordNativeCommand`, which extends Carbon's `Command` class. Commands support autocomplete, argument menus, and model picker flows via `createDiscordCommandArgFallbackButton` and `createDiscordModelPickerFallbackButton`/`createDiscordModelPickerFallbackSelect`.

Slash command sessions are isolated (`agent:<agentId>:discord:slash:<userId>`) and route against the target conversation session via `CommandTargetSessionKey`.

Default slash command config: `ephemeral: true`.

Sources: [src/discord/monitor/native-command.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/native-command.ts#L1-L100)[src/config/zod-schema.providers-core.ts478-483](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L478-L483)

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

Sources: [src/discord/monitor/provider.ts442-494](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts#L442-L494)[src/discord/monitor/agent-components.ts1-60](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/agent-components.ts#L1-L60)

Interaction results (button clicks, select choices, modal submissions) are formatted by `formatDiscordComponentEventText` and enqueued as inbound system events that route to the appropriate agent session. The `reusable` flag on a component entry controls whether the interaction component stays active after one use.

Per-button `allowedUsers` restricts which Discord users may click a button; unauthorized users receive an ephemeral denial.

Sources: [src/discord/monitor/agent-components.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/agent-components.ts)

---

## Listeners

Listeners extend Carbon base classes and are registered via `registerDiscordListener`, which deduplicates by constructor to prevent double-registration.
ClassBase classPurpose`DiscordMessageListener``MessageCreateListener`Dispatches to `createDiscordMessageHandler``DiscordReactionListener``MessageReactionAddListener`Routes reaction-add events to system events`DiscordReactionRemoveListener``MessageReactionRemoveListener`Routes reaction-remove events`DiscordPresenceListener``PresenceUpdateListener`Tracks presence updates (optional)`DiscordVoiceReadyListener`—Initializes `DiscordVoiceManager` on ready`DiscordStatusReadyListener``ReadyListener`Sets bot presence on gateway ready
`DiscordMessageListener` wraps the handler in `runDiscordListenerWithSlowLog`, which logs a warning if the listener takes longer than 30 seconds to process an event.

Sources: [src/discord/monitor/listeners.ts112-280](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts#L112-L280)

---

## Streaming and output

Discord output streaming is controlled by `channels.discord.streaming`:
ModeBehavior`off` (default)Send final reply only`partial`Edit a temporary message as tokens arrive`block`Emit draft-sized chunks, tuned by `draftChunk``progress`Alias for `partial`
Legacy `channels.discord.streamMode` values are auto-migrated via `normalizeDiscordStreamingConfig` at config parse time.

`channels.discord.textChunkLimit` defaults to 2000 (Discord message length limit). `channels.discord.maxLinesPerMessage` provides an additional line-count cap per chunk.

Sources: [src/config/zod-schema.providers-core.ts115-118](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L115-L118)[src/config/zod-schema.providers-core.ts427-430](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L427-L430)

---

## Configuration quick-reference

Key `channels.discord` fields:
FieldTypeDefaultDescription`token``string`—Bot token (or `DISCORD_BOT_TOKEN`)`dmPolicy``pairing|allowlist|open|disabled``pairing`DM access policy`allowFrom``string[]`—DM allowlist (user IDs)`groupPolicy``open|allowlist|disabled``allowlist`Guild message policy`guilds``Record<string, DiscordGuildEntry>`—Per-guild allowlist + config`guilds.<id>.users``string[]`—Sender allowlist (IDs preferred)`guilds.<id>.roles``string[]`—Role ID allowlist`guilds.<id>.channels``Record<string, DiscordGuildChannelConfig>`—Per-channel overrides`guilds.<id>.requireMention``boolean``true`Require `@mention` in guild`streaming``off|partial|block|progress``off`Reply streaming mode`threadBindings.enabled``boolean``true`Thread binding subsystem`execApprovals.enabled``boolean``false`Discord exec approval UI`commands.native``boolean|"auto"``"auto"`Slash command deployment`slashCommand.ephemeral``boolean``true`Slash reply visibility`intents.presence``boolean``false`Enable Presence intent`voice.enabled``boolean``true`Voice channel support`dangerouslyAllowNameMatching``boolean``false`Allow name/tag allowlist matching
Discord IDs in config must be strings (wrap numeric IDs in quotes). The config validator enforces this via `DiscordIdSchema`.

Sources: [src/config/zod-schema.providers-core.ts337-608](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L337-L608)[src/config/types.discord.ts1-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts#L1-L200)

---

# Other-Channels

# Other Channels
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts)
- [src/auto-reply/reply/normalize-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/normalize-reply.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/auto-reply/tokens.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.test.ts)
- [src/auto-reply/tokens.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/draft-stream-loop.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/draft-stream-loop.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/imessage/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/monitor.ts)
- [src/signal/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor.ts)
- [src/slack/monitor.tool-result.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.tool-result.test.ts)
- [src/slack/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/bot-handlers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-handlers.ts)
- [src/telegram/bot-message-context.dm-threads.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.dm-threads.test.ts)
- [src/telegram/bot-message-context.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts)
- [src/telegram/bot-message-dispatch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.test.ts)
- [src/telegram/bot-message-dispatch.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.ts)
- [src/telegram/bot-native-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-commands.ts)
- [src/telegram/bot.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.test.ts)
- [src/telegram/bot.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts)
- [src/telegram/bot/delivery.replies.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.replies.ts)
- [src/telegram/bot/delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.test.ts)
- [src/telegram/bot/delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.ts)
- [src/telegram/bot/helpers.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.test.ts)
- [src/telegram/bot/helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.ts)
- [src/telegram/draft-stream.test-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test-helpers.ts)
- [src/telegram/draft-stream.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test.ts)
- [src/telegram/draft-stream.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.ts)
- [src/telegram/lane-delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.test.ts)
- [src/telegram/lane-delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)
- [src/web/auto-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/auto-reply.ts)
- [src/web/inbound.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.test.ts)
- [src/web/inbound.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.ts)
- [src/web/vcard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/vcard.ts)

This page covers configuration and integration details for all supported messaging channels except Telegram ([4.2](/openclaw/openclaw/4.2-telegram-integration)) and Discord ([4.3](/openclaw/openclaw/4.3-discord-integration)). For the shared channel plugin interface and message dispatch architecture, see [Channel Architecture & Plugin SDK](/openclaw/openclaw/4.1-channel-architecture). For model configuration, see [3.3](/openclaw/openclaw/3.3-model-providers-and-authentication).

Channels split into two implementation categories:

- **Core channels** — shipped with the main package; schemas in `src/config/`; monitors under `src/<channel>/`
- **Extension channels** — separate npm packages; source under `extensions/`; built against `openclaw/plugin-sdk` (see [src/plugin-sdk/index.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts))

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

Sources: [src/config/zod-schema.providers-core.ts1-35](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L1-L35)[src/plugin-sdk/index.ts176-184](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L176-L184)

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

Sources: [src/plugin-sdk/index.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L1-L100)[extensions/feishu/src/bot.ts1-15](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/feishu/src/bot.ts#L1-L15)[extensions/mattermost/src/mattermost/monitor.ts1-30](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/mattermost/src/mattermost/monitor.ts#L1-L30)[extensions/matrix/src/matrix/monitor/handler.ts1-15](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/matrix/src/matrix/monitor/handler.ts#L1-L15)

---

## Core Channels

### Slack

Provider: `monitorSlackProvider` at [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
Schema: `SlackConfigSchema` / `SlackAccountSchema` at [src/config/zod-schema.providers-core.ts738-894](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L738-L894)

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

Sources: [src/slack/monitor/provider.ts44-136](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts#L44-L136)

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

Sources: [src/config/zod-schema.providers-core.ts697-894](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L697-L894)[src/slack/monitor/provider.ts59-136](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts#L59-L136)

---

### Signal

Schema: `SignalConfigSchema` extends `SignalAccountSchemaBase` at [src/config/zod-schema.providers-core.ts896-991](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L896-L991)
Event handler: `createSignalEventHandler` at [src/signal/monitor/event-handler.ts55](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor/event-handler.ts#L55-L55)

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

Sources: [src/signal/monitor/event-handler.ts55-180](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor/event-handler.ts#L55-L180)

**Key config fields (`SignalAccountSchemaBase`):**
FieldType / DefaultNotes`account`stringSignal phone number (E.164)`httpUrl`stringsignal-cli HTTP endpoint (e.g. `http://127.0.0.1:8080`)`httpHost` / `httpPort`string / integerAlternative to `httpUrl``cliPath`stringPath to signal-cli binary`autoStart`booleanAuto-start signal-cli`startupTimeoutMs`integer (1000–120000)Startup wait timeout`receiveMode``"on-start"` | `"manual"`When to begin receiving`ignoreAttachments`booleanSkip inbound attachments`ignoreStories`booleanSkip Signal Stories`sendReadReceipts`booleanSend read receipts`reactionNotifications``"off"` | `"own"` | `"all"` | `"allowlist"`Emoji reaction handling`reactionLevel``"off"` | `"ack"` | `"minimal"` | `"extensive"`Ack reaction verbosity`dmPolicy`(default `"pairing"`)DM access policy`groupPolicy`(default `"allowlist"`)Group access policy
Inbound debouncing (`resolveInboundDebounceMs`) is applied before dispatch. Mention patterns from `buildMentionRegexes` gate group messages when `requireMention` is set.

Sources: [src/config/zod-schema.providers-core.ts896-991](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L896-L991)[src/signal/monitor/event-handler.ts55-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor/event-handler.ts#L55-L100)

---

### iMessage and BlueBubbles

Two integration paths for Apple Messages exist:
ApproachConfig KeyBackendLocationimsg`channels.imessage``imsg` JSON-RPC CLI`src/imessage/`BlueBubbles`channels.bluebubbles`BlueBubbles server app (macOS)`src/bluebubbles/`
The `imsg` path uses `monitorIMessageProvider` at [src/imessage/monitor/monitor-provider.ts84](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/monitor/monitor-provider.ts#L84-L84)

**Key config fields (iMessage / `IMessageConfigSchema`):**
FieldNotes`cliPath`Path to `imsg` binary (default `"imsg"`)`dbPath`iMessage SQLite database path`includeAttachments`Download and pass inbound attachments`remoteHost`SSH host for remote-Mac setups; auto-detected from SSH wrapper scripts at `cliPath``probeTimeoutMs`Startup probe timeout (`DEFAULT_IMESSAGE_PROBE_TIMEOUT_MS`)`dmPolicy`Default `pairing``groupPolicy`Default from config; group chats use `groupAllowFrom`
**Attachment security:**`resolveIMessageAttachmentRoots` and `resolveIMessageRemoteAttachmentRoots` define allowed file roots. Each inbound attachment path is validated via `isInboundPathAllowed` before passing to the agent.

**Inbound debouncing:** Enabled via `createInboundDebouncer`. Consecutive messages from the same sender in the same conversation are coalesced into a single agent turn when no media or control commands are present.

**BlueBubbles:** Distinct channel integration. The plugin SDK exports:

- `BLUEBUBBLES_ACTIONS`, `BLUEBUBBLES_ACTION_NAMES`, `BLUEBUBBLES_GROUP_ACTIONS` from `src/channels/plugins/bluebubbles-actions.ts`
- `resolveBlueBubblesGroupRequireMention`, `resolveBlueBubblesGroupToolPolicy` from `src/channels/plugins/group-mentions.ts`
- `collectBlueBubblesStatusIssues` from `src/channels/plugins/status-issues/bluebubbles.ts`

Sources: [src/imessage/monitor/monitor-provider.ts84-200](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/monitor/monitor-provider.ts#L84-L200)[src/plugin-sdk/index.ts6-8](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L6-L8)

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

Sources: [src/plugin-sdk/index.ts544-558](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L544-L558)

---

### Google Chat

Schema: `GoogleChatConfigSchema` at [src/config/zod-schema.providers-core.ts692-695](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L692-L695)
Account schema: `GoogleChatAccountSchema` at [src/config/zod-schema.providers-core.ts646-690](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L646-L690)

Google Chat uses a GCP service account for authentication. Inbound events arrive via webhook.

**Key config fields (`GoogleChatAccountSchema`):**
FieldNotes`serviceAccount`GCP service account — JSON object, path string, or `SecretRef``serviceAccountRef`Alternative `SecretRef` form`serviceAccountFile`File path alternative`audienceType``"app-url"` | `"project-number"``audience`Audience value for token validation`webhookPath`Inbound webhook route`webhookUrl`Public URL for event delivery`botUser`Bot email, used for `@mention` detection`typingIndicator``"none"` | `"message"` | `"reaction"``streamMode``"replace"` (default) | `"status_final"` | `"append"``requireMention`Global mention gate`groupPolicy`Default `"allowlist"`
**Per-group config** (`GoogleChatGroupSchema`): `enabled`, `allow`, `requireMention`, `users`, `systemPrompt`

**DM config** (`GoogleChatDmSchema`): `enabled`, `policy`, `allowFrom` with the same `open`/`allowlist` validation rules as other channels.

**Multi-account:**`GoogleChatConfigSchema` extends `GoogleChatAccountSchema` with `accounts` map and `defaultAccount` selector.

Sources: [src/config/zod-schema.providers-core.ts610-695](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L610-L695)

---

### IRC

Config key: `channels.irc`
Schema: `IrcConfigSchema` in `src/config/zod-schema.providers-core.ts` (line 993+)
Implementation: `src/irc/`

Per-channel group config (`IrcGroupSchema`) supports `requireMention`, `tools`, and `toolsBySender`, following the same schema pattern as other group-aware channels.

Sources: [src/config/zod-schema.providers-core.ts993](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts#L993-L993)

---

### LINE

Config key: `channels.line`
Schema: `LineConfigSchema` from `src/line/config-schema.ts`
Account resolution: `resolveLineAccount` from `src/line/accounts.ts`
Types: `LineConfig`, `LineAccountConfig`, `ResolvedLineAccount`, `LineChannelData` from `src/line/types.ts`

LINE supports rich **Flex Messages**. The `src/line/flex-templates.ts` module provides builder helpers:
FunctionPurpose`createInfoCard`Info panel card`createListCard`List layout card`createImageCard`Image with caption`createActionCard`Card with action buttons`createReceiptCard`Receipt/summary card
Outbound markdown is converted to LINE format via `processLineMessage` in `src/line/markdown-to-line.ts`. Detection of convertible content uses `hasMarkdownToConvert`; plain-text fallback uses `stripMarkdown`.

Sources: [src/plugin-sdk/index.ts562-591](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L562-L591)

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

Sources: [extensions/feishu/src/bot.ts1-13](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/feishu/src/bot.ts#L1-L13)[extensions/mattermost/src/mattermost/monitor.ts1-30](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/mattermost/src/mattermost/monitor.ts#L1-L30)[extensions/matrix/src/matrix/monitor/handler.ts1-15](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/matrix/src/matrix/monitor/handler.ts#L1-L15)

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

Sources: [extensions/matrix/src/matrix/monitor/handler.ts44-76](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/matrix/src/matrix/monitor/handler.ts#L44-L76)

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

Sources: [extensions/feishu/src/bot.ts76-136](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/feishu/src/bot.ts#L76-L136)[extensions/feishu/src/bot.ts180-330](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/feishu/src/bot.ts#L180-L330)

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

Sources: [extensions/mattermost/src/mattermost/monitor.ts167-220](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/mattermost/src/mattermost/monitor.ts#L167-L220)

**Cache constants:**
ConstantValuePurpose`RECENT_MATTERMOST_MESSAGE_TTL_MS`5 minDedup window for inbound messages`RECENT_MATTERMOST_MESSAGE_MAX`2000Max dedup cache entries`CHANNEL_CACHE_TTL_MS`5 minMattermost channel info cache`USER_CACHE_TTL_MS`10 minMattermost user info cache
**Channel type mapping:**`channelKind` maps Mattermost channel type codes:

- `"D"` → `"direct"`
- `"G"` → `"group"`
- other → `"channel"`

System posts (non-empty `post.type` field) are filtered by `isSystemPost`.

**WebSocket URL:**`buildMattermostWsUrl` converts the base URL scheme (`http` → `ws`) and appends `/api/v4/websocket`.

Sources: [extensions/mattermost/src/mattermost/monitor.ts77-166](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/mattermost/src/mattermost/monitor.ts#L77-L166)

---

### MS Teams

Location: `extensions/msteams/`
Handler: `extensions/msteams/src/monitor-handler/message-handler.ts`
Schemas: `MSTeamsConfigSchema`, types `MSTeamsConfig`, `MSTeamsTeamConfig`, `MSTeamsChannelConfig`, `MSTeamsReplyStyle` exported from `src/config/types.ts`

Access control follows the standard pattern from the plugin SDK: `createScopedPairingAccess`, `resolveDmGroupAccessWithLists`, `readStoreAllowFromForDmPolicy`, `resolveDefaultGroupPolicy`, `isDangerousNameMatchingEnabled`.

`MSTeamsReplyStyle` (validated by `MSTeamsReplyStyleSchema`) controls whether replies are posted inline or as new messages.

Per-team and per-channel configuration is available via `MSTeamsTeamConfig` and `MSTeamsChannelConfig`, allowing `requireMention`, `users`, `roles`, and `systemPrompt` overrides per scope.

Sources: [extensions/msteams/src/monitor-handler/message-handler.ts1-15](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/msteams/src/monitor-handler/message-handler.ts#L1-L15)[src/plugin-sdk/index.ts154-161](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugin-sdk/index.ts#L154-L161)

---

### Zalo

Location: `extensions/zalo/`
Monitor: `extensions/zalo/src/monitor.ts`

Zalo integration is webhook-based: Zalo sends HTTP POST events to OpenClaw. The monitor handles inbound event deserialization and dispatches to the agent via the standard Plugin SDK dispatch flow. Outbound replies use `OutboundReplyPayload` from `openclaw/plugin-sdk`. Markdown rendering respects `MarkdownTableMode` from the active config.

Sources: [extensions/zalo/src/monitor.ts1-5](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/zalo/src/monitor.ts#L1-L5)

---

## Common Configuration Patterns

All channels share these behaviors regardless of implementation location. For details on each, see [Channel Architecture & Plugin SDK](/openclaw/openclaw/4.1-channel-architecture).
PatternConfig FieldsNotesDM access`dmPolicy`, `allowFrom``open` requires `"*"` in `allowFrom`; `allowlist` requires at least one entryGroup access`groupPolicy`, `groupAllowFrom`Default `"allowlist"` fails-closed when provider config is missingMulti-account`accounts` mapNamed accounts inherit top-level `allowFrom` when their own is unsetHistory`historyLimit`, `dmHistoryLimit`, `dms[].historyLimit`Controls context window for group/DM sessionsMedia`mediaMaxMb`Caps inbound media download sizeAck reactions`ackReaction`Emoji sent while processing; falls back to agent identity emojiText chunking`textChunkLimit`, `chunkMode``"length"` or `"newline"` splitting for outbound messages

---

# Control-UI

# Control UI
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [apps/macos/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClawProtocol/GatewayModels.swift)
- [apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift](https://github.com/openclaw/openclaw/blob/8873e13f/apps/shared/OpenClawKit/Sources/OpenClawProtocol/GatewayModels.swift)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/experiments/onboarding-config-protocol.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/experiments/onboarding-config-protocol.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/protocol-gen-swift.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/protocol-gen-swift.ts)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/openclaw-gateway-tool.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/openclaw-gateway-tool.test.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/agents/tools/gateway-tool.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/gateway-tool.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/schema.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.test.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [src/discord/monitor/thread-bindings.shared-state.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/thread-bindings.shared-state.test.ts)
- [src/gateway/method-scopes.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.test.ts)
- [src/gateway/method-scopes.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/method-scopes.ts)
- [src/gateway/protocol/index.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/index.ts)
- [src/gateway/protocol/schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema.ts)
- [src/gateway/protocol/schema/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/config.ts)
- [src/gateway/protocol/schema/protocol-schemas.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/protocol-schemas.ts)
- [src/gateway/protocol/schema/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/protocol/schema/types.ts)
- [src/gateway/server-methods-list.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods-list.ts)
- [src/gateway/server-methods.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods.ts)
- [src/gateway/server-methods/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/config.ts)
- [src/gateway/server-methods/restart-request.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/restart-request.ts)
- [src/gateway/server-methods/update.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server-methods/update.ts)
- [src/gateway/server.config-patch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.config-patch.test.ts)
- [src/gateway/server.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/server.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

The Control UI is the browser-based single-page application (SPA) that provides a dashboard for the OpenClaw Gateway. It runs in a standard web browser and communicates with the Gateway exclusively over a WebSocket connection. This page covers the SPA's component architecture, state management, Gateway client, view routing, settings persistence, and theming system.

For information about the Gateway WebSocket protocol the UI connects to, see [WebSocket Protocol](/openclaw/openclaw/2.1-websocket-protocol-and-rpc). For details on authentication modes used during the connect handshake, see [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing). For the native iOS/macOS/Android node clients (which are a distinct type of Gateway client), see [Native Clients (Nodes)](/openclaw/openclaw/6-native-clients-(nodes)).

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

Sources: [ui/src/ui/app.ts1-616](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L1-L616)[ui/src/ui/app-view-state.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-view-state.ts#L1-L50)[ui/src/ui/app-render.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-render.ts#L1-L100)[ui/src/ui/gateway.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/gateway.ts#L1-L100)[ui/src/ui/storage.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/storage.ts#L1-L50)

---

## `OpenClawApp` Component

`OpenClawApp` is the root LitElement custom element registered as `openclaw-app`[ui/src/ui/app.ts110-616](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L110-L616) It is the single instance of the application and holds all reactive state as `@state()` decorated properties.

It **does not** use Shadow DOM — `createRenderRoot()` returns `this`[ui/src/ui/app.ts392-394](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L392-L394) — so styles are applied globally.

### Lifecycle
Lifecycle MethodHandler`connectedCallback``handleConnected` in `app-lifecycle.ts``firstUpdated``handleFirstUpdated` in `app-lifecycle.ts``updated``handleUpdated` in `app-lifecycle.ts``disconnectedCallback``handleDisconnected` in `app-lifecycle.ts`
The `firstUpdated` hook is where the Gateway connection is initiated and URL-based settings (`token`, `session`, `gatewayUrl` query params) are consumed via `applySettingsFromUrl`[ui/src/ui/app-settings.ts89-149](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-settings.ts#L89-L149)

### `AppViewState` Interface

Rather than passing `this` (the `OpenClawApp` instance) directly to rendering and controller functions, the code casts to `AppViewState`[ui/src/ui/app-view-state.ts47](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-view-state.ts#L47-LNaN) a structural type that describes only the fields and methods needed for rendering and data loading. This pattern decouples the view layer from the component class.

`renderApp` is called as `renderApp(this as unknown as AppViewState)`[ui/src/ui/app.ts613-615](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L613-L615)

---

## State Management

### Reactive State (`@state()`)

`OpenClawApp` declares all UI state as `@state()` properties, grouped by feature domain:
DomainKey Properties**Connection**`connected`, `hello`, `lastError`, `lastErrorCode`, `client`**Chat**`chatMessages`, `chatStream`, `chatStreamStartedAt`, `chatSending`, `chatRunId`, `chatQueue`, `chatAttachments`**Sessions**`sessionsResult`, `sessionsLoading`, `sessionsFilterActive`, `sessionsFilterLimit`**Agents**`agentsList`, `agentsSelectedId`, `agentsPanel`, `agentFilesList`, `agentIdentityById`**Cron**`cronJobs`, `cronStatus`, `cronForm`, `cronRuns`, `cronFieldErrors`**Config**`configSnapshot`, `configSchema`, `configForm`, `configFormDirty`**Nodes/Devices**`nodes`, `devicesList`, `execApprovalsForm`, `execApprovalQueue`**Logs**`logsEntries`, `logsLevelFilters`, `logsAtBottom`**Skills**`skillsReport`, `skillEdits`, `skillMessages`**Usage**`usageResult`, `usageCostSummary`, `usageTimeSeries`**UI**`tab`, `theme`, `themeResolved`, `settings`, `onboarding`, `sidebarOpen`, `splitRatio`
Sources: [ui/src/ui/app.ts113-385](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L113-L385)

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

`loadSettings()` is called at component construction time. `saveSettings()` is called by `applySettings()` on every settings mutation [ui/src/ui/storage.ts20](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/storage.ts#L20-LNaN)[ui/src/ui/app-settings.ts64-76](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-settings.ts#L64-L76)

---

## `GatewayBrowserClient`

`GatewayBrowserClient`[ui/src/ui/gateway.ts94](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/gateway.ts#L94-LNaN) is the WebSocket client class. Each call to `connectGateway()`[ui/src/ui/app-gateway.ts139-214](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-gateway.ts#L139-L214) creates a new instance and stops the previous one.

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

The device identity is managed by `loadOrCreateDeviceIdentity()` and `signDevicePayload()`[ui/src/ui/gateway.ts161-213](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/gateway.ts#L161-L213) The device token received in the `hello-ok` response is stored locally via `storeDeviceAuthToken()` for future connections.

### Reconnection

`GatewayBrowserClient` reconnects automatically on close, with exponential backoff starting at 800ms and capping at 15 seconds [ui/src/ui/gateway.ts145-152](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/gateway.ts#L145-L152)

Sources: [ui/src/ui/gateway.ts94-330](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/gateway.ts#L94-L330)[ui/src/ui/app-gateway.ts139-214](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-gateway.ts#L139-L214)

---

## Navigation and Views

Navigation is URL-path-based. The current tab is derived from `window.location.pathname` on load and updated via `history.pushState` when tabs are switched. The `onPopState` handler keeps tab state synchronized with browser history [ui/src/ui/app-settings.ts151-170](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-settings.ts#L151-L170)

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

Sources: [ui/src/ui/app-render.ts328-950](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-render.ts#L328-L950)[ui/src/ui/app-settings.ts186-244](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-settings.ts#L186-L244)

### Tab Groups

The navigation sidebar organizes tabs into collapsible groups via `TAB_GROUPS` from `navigation.ts`. Each group label maps to a `navGroupsCollapsed` entry in `UiSettings`, so collapse state survives page reloads [ui/src/ui/app-render.ts259-302](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-render.ts#L259-L302)

### Data Loading on Tab Switch

When `setTab()` is called, `refreshActiveTab()`[ui/src/ui/app-settings.ts186-244](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-settings.ts#L186-L244) loads the relevant data for the newly active tab:
TabData Loaded`overview``loadOverview()` (presence count, sessions count, cron status)`channels``loadChannels()``instances``loadPresence()``sessions``loadSessions()``cron``loadCronStatus()`, `loadCronJobs()`, `loadCronRuns()``agents``loadAgents()`, `loadToolsCatalog()`, `loadConfig()`, `loadAgentIdentities()``nodes``loadNodes()`, `loadDevices()`, `loadConfig()`, `loadExecApprovals()``chat``refreshChat()`, scroll to bottom`logs``loadLogs()`, starts polling interval`debug``loadDebug()`, starts polling interval`skills``loadSkills()`
---

## Shell Layout

The UI uses a CSS Grid shell defined in [ui/src/styles/layout.css1-50](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/styles/layout.css#L1-L50) The top-level structure is:

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
Sources: [ui/src/styles/layout.css1-622](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/styles/layout.css#L1-L622)

### Chat View Layout

When `tab === "chat"`, the main content area switches to a flex column layout (`.content--chat`). The chat view itself [ui/src/ui/views/chat.ts240-480](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/views/chat.ts#L240-L480) contains:

- **`.chat-thread`** — scrollable message history
- **`.chat-split-container`** — optional side-by-side markdown sidebar (resizable with `resizable-divider` custom element)
- **`.chat-compose`** — sticky compose area with textarea and send/abort buttons
- **Compaction/fallback indicators** — transient status toasts rendered by `renderCompactionIndicator()` and `renderFallbackIndicator()`

The sidebar split ratio is user-adjustable (range 0.4–0.7) and stored in `UiSettings.splitRatio`[ui/src/ui/app.ts607-611](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L607-L611)

---

## Gateway Event Handling

Incoming events from the Gateway are handled by `handleGatewayEvent()` in `app-gateway.ts`[ui/src/ui/app-gateway.ts216-328](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-gateway.ts#L216-L328)

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

Sources: [ui/src/ui/app-gateway.ts260-328](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-gateway.ts#L260-L328)

### Chat Event States

`handleChatEvent()`[ui/src/ui/controllers/chat.ts220-285](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/controllers/chat.ts#L220-L285) processes `ChatEventPayload` with these state values:
`payload.state`Effect on UI`"delta"`Appends streamed text to `chatStream``"final"`Moves final message to `chatMessages`, clears `chatStream``"aborted"`Moves aborted message content to `chatMessages`, clears stream`"error"`Sets `lastError`, clears stream
After a terminal event (`final`, `error`, `aborted`), `resetToolStream()` is called and any queued chat messages are flushed via `flushChatQueueForEvent()`[ui/src/ui/app-gateway.ts224-244](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-gateway.ts#L224-L244)

---

## Theming

The theme system supports three modes defined in `ThemeMode`[ui/src/ui/theme.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/theme.ts#L1-LNaN): `"dark"`, `"light"`, and `"system"`. The resolved theme (`"dark"` or `"light"`) is written as a `data-theme` attribute on `:root`, which switches between two CSS variable sets defined in `base.css`[ui/src/styles/base.css1](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/styles/base.css#L1-LNaN)

- Dark mode uses `--bg: #12141a`, `--accent: #ff5c5c` (red)
- Light mode overrides are declared under `:root[data-theme="light"]`

The theme toggle widget (three-button dark/light/system selector) is rendered by `renderThemeToggle()` in `app-render.helpers.ts` and displayed in the topbar. When "system" is selected, a `MediaQueryList` listener on `prefers-color-scheme` drives automatic switching [ui/src/ui/app-settings.ts172-184](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-settings.ts#L172-L184)

Theme changes are animated via `startThemeTransition()`[ui/src/ui/app-lifecycle.ts1](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-lifecycle.ts#L1-LNaN)

---

## Agents View — Sub-panel Structure

The Agents tab is more complex than other tabs: it has an internal panel switcher within the view. The `agentsPanel` state field selects among:
PanelContents`"overview"`Agent identity, model selection, model fallbacks`"files"`Agent workspace files (AGENTS.md, SOUL.md, etc.) editor`"tools"`Tools catalog and tool policy controls`"skills"`Installed skills with enable/disable toggles`"channels"`Channel status filtered to the selected agent`"cron"`Cron jobs for the selected agent
Config mutations from the agents view (model changes, tool profile, skill enable/disable) use `updateConfigFormValue()` / `removeConfigFormValue()` to patch `configForm` in memory, then call `saveConfig()` to persist via the Gateway's `config.patch` RPC [ui/src/ui/app-render.ts639-869](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-render.ts#L639-L869)

Sources: [ui/src/ui/app-render.ts513-871](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-render.ts#L513-L871)[ui/src/ui/app.ts224-239](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L224-L239)

---

## Exec Approval Prompt

When an agent requests exec approval (e.g., before running a shell command), the Gateway emits `exec.approval.requested`. The UI queues these in `execApprovalQueue`[ui/src/ui/app.ts174-175](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L174-L175) and renders a modal prompt via `renderExecApprovalPrompt()`[ui/src/ui/app-render.ts74](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-render.ts#L74-L74)

The operator can respond with `allow-once`, `allow-always`, or `deny`. This calls the `exec.approval.resolve` RPC method [ui/src/ui/app.ts543-561](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L543-L561) Approvals expire automatically — a `setTimeout` removes them from the queue at their `expiresAtMs`[ui/src/ui/app-gateway.ts306-313](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-gateway.ts#L306-L313)

---

## URL-Based Configuration Injection

On initial load, the app reads the following query parameters (then strips them from the URL):
ParameterEffect`token`Sets `UiSettings.token``session`Sets the active session key`gatewayUrl`Prompts the user to confirm switching gateway URLs`password`Stripped only (never persisted)`onboarding=1`Activates onboarding mode (hides topbar, collapses nav)
Sources: [ui/src/ui/app-settings.ts89-149](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app-settings.ts#L89-L149)[ui/src/ui/app.ts97-108](https://github.com/openclaw/openclaw/blob/8873e13f/ui/src/ui/app.ts#L97-L108)

---

## Key File Index
FileRole`ui/src/ui/app.ts``OpenClawApp` LitElement root component`ui/src/ui/app-view-state.ts``AppViewState` structural type for rendering`ui/src/ui/app-render.ts``renderApp()` — top-level render function`ui/src/ui/app-gateway.ts``connectGateway()`, `handleGatewayEvent()``ui/src/ui/gateway.ts``GatewayBrowserClient` WebSocket client`ui/src/ui/storage.ts``UiSettings`, `loadSettings()`, `saveSettings()``ui/src/ui/app-settings.ts``setTab()`, `applySettings()`, `refreshActiveTab()``ui/src/ui/app-lifecycle.ts`LitElement lifecycle handlers`ui/src/ui/app-chat.ts`Chat message sending/queueing logic`ui/src/ui/navigation.ts``TAB_GROUPS`, `pathForTab()`, `tabFromPath()``ui/src/ui/views/*.ts`Per-tab view renderers`ui/src/ui/controllers/*.ts`Data-loading functions calling `GatewayBrowserClient``ui/src/styles/base.css`CSS design tokens (colors, typography, spacing)`ui/src/styles/layout.css`Shell grid and topbar/nav/content layout`ui/src/styles/components.css`Shared components (buttons, cards, forms, pills)`ui/src/styles/chat/layout.css`Chat-specific layout

---

# Native-Clients-(Nodes)

# Native Clients (Nodes)
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

## Purpose and scope

This page describes **native clients** (referred to as **nodes** in the Gateway protocol) that pair with the OpenClaw Gateway to provide device-specific capabilities. Nodes are mobile or desktop applications (iOS, Android, macOS) that connect via WebSocket, advertise their capabilities, and execute local actions when invoked by agents or tools.

For platform-specific features and setup instructions, see:

- [iOS Client](/openclaw/openclaw/6.1-ios-client) - Canvas, Voice Wake, Talk Mode, camera, screen recording
- [macOS Client](/openclaw/openclaw/6.2-macos-client) - Menu bar app, PTT, WebChat, remote gateway control
- [Android Client](/openclaw/openclaw/6.3-android-client) - Connect/Chat/Voice tabs, Canvas, Camera, Screen capture, device commands

For node discovery and connection mechanisms, see [Gateway Discovery](https://github.com/openclaw/openclaw/blob/8873e13f/Gateway Discovery) (page not yet written). For security aspects of device pairing, see [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing).

---

## What is a node?

A **node** is a native client application that connects to the Gateway over WebSocket and exposes device-specific capabilities. Unlike channels (which route messages from chat platforms), nodes provide **tool execution surfaces** for local device actions.

Key characteristics:

- **Device-local execution**: Nodes run commands on the device they're installed on (camera access, notifications, file operations, screen recording)
- **Capability-based**: Each node advertises what it can do via the Gateway protocol
- **Permission-aware**: Nodes enforce platform permissions (TCC on macOS/iOS, runtime permissions on Android)
- **Paired authentication**: Nodes authenticate via device pairing before gaining access to the Gateway

**Sources:**[README.md240-253](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L240-L253)[README.md156-161](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L156-L161)

---

## Node architecture

```
Device Actions

Node Capabilities

Gateway Host

WebSocket connect

node.list

node.describe

node.invoke

advertise

Discovery

Bonjour/mDNS
_openclaw-gw._tcp

Tailscale Serve
wss://.ts.net

Manual URL entry

Gateway WebSocket
(port 18789)

Agent Runtime
Pi embedded mode

Tool Router

Node Client
(iOS/Android/macOS)

Capability Registry
node.list / node.describe

Local Executor
node.invoke handler

camera.snap
camera.clip

screen.record

location.get

system.run
system.notify

canvas.push
canvas.eval
canvas.snapshot
```

**Diagram: Node-Gateway Integration Architecture**

**Sources:**[README.md240-253](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L240-L253)[README.md206-211](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L206-L211)

---

## Device pairing flow

Nodes authenticate with the Gateway via a **device pairing** flow before they can execute commands. The Gateway issues a pairing code, the node submits it, and upon approval, receives a persistent credential.

```
Operator
(CLI/UI)
Gateway
Node Client
Operator
(CLI/UI)
Gateway
Node Client
Generate device keypair
Sign challenge with private key
Display pairing code to user
alt
[Device not paired]
Node available for invocation
WebSocket connect
connect.challenge event
connect (device.nonce, device.signature)
device.pair.required
device.pair.request
(deviceId, publicKey, hostname)
device.pair.pending
(pairingCode)
openclaw pairing approve
<channel> <code>
Store device credential
device.pair.complete
(approved: true)
Store credential in keychain
node.register
(capabilities, permissions)
node.register.success
```

**Diagram: Device Pairing Sequence**

The pairing flow uses **challenge-based device authentication** (introduced in device auth v2):

1. Gateway sends a `connect.challenge` with a random nonce
2. Node signs the challenge with its private key
3. Node includes the signed payload in `connect` params
4. Gateway validates the signature before allowing pairing or RPC access

**Sources:**[CHANGELOG.md111-117](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L111-L117)[README.md240-253](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L240-L253)[docs/gateway/troubleshooting.md93-136](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md#L93-L136)

---

## Capability discovery and invocation

Nodes advertise their capabilities to the Gateway using two RPC methods:

- **`node.list`**: Returns a list of all registered nodes with basic metadata (deviceId, hostname, platform)
- **`node.describe`**: Returns detailed capability metadata for a specific node (available commands, permission status)

The Gateway routes tool invocations to nodes via **`node.invoke`**, which specifies the target deviceId, command ID, and parameters.

```
Node Execution

Gateway Routing

Agent Turn

granted

denied

Pi Agent

Tool Call
camera.snap

Tool Dispatcher

Node Resolver
deviceId selection

node.invoke RPC

Node Client

Permission Check
(TCC / Runtime)

Platform Camera API

Response
(image bytes, metadata)
```

**Diagram: Node Tool Invocation Flow**

**Permission enforcement**: Nodes return error codes when permissions are missing:

- `PERMISSION_MISSING` - Permission not granted (e.g., camera access denied)
- `PERMISSION_DENIED` - Permission explicitly denied by user
- `UNSUPPORTED` - Command not available on this platform

**Sources:**[README.md240-253](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L240-L253)[CHANGELOG.md95-97](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L95-L97)

---

## Discovery mechanisms

Nodes discover the Gateway using multiple methods:
MethodProtocolUse case**Bonjour/mDNS**`_openclaw-gw._tcp`Local network discovery (default)**Wide-Area DNS-SD**Unicast DNS-SDTailscale tailnet discovery**Tailscale Serve**`wss://<peer>.ts.net`Remote gateway over Tailscale**Manual URL**WebSocket URL entryDirect connection to known endpoint
**Bonjour discovery** advertises the Gateway on the local network:

- Service type: `_openclaw-gw._tcp`
- TXT records include: version, auth mode, capabilities

**Tailscale discovery** probes for gateways on the tailnet:

1. Node queries wide-area DNS-SD for `_openclaw-gw._tcp` records
2. Falls back to direct Tailscale peer probe (`wss://<peer>.ts.net`)
3. Connects to discovered gateway and authenticates

**Sources:**[CHANGELOG.md160-161](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L160-L161)[apps/android/app/build.gradle.kts154-155](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L154-L155)[README.md230-238](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L230-L238)

---

## Platform support matrix
FeatureiOSAndroidmacOS**Device pairing**✅✅✅**Canvas (A2UI)**✅✅✅**Camera snap**✅✅✅**Camera clip (video)**✅✅❌**Screen recording**✅✅✅**Voice Wake**✅❌✅**Talk Mode**✅✅ (Voice tab)✅**Location**✅✅❌**Notifications**✅✅✅ (system.notify)**System run**❌❌✅ (system.run)**App management**❌✅ (APK update)❌**SMS/Contacts/Calendar**❌✅❌
**Sources:**[README.md156-161](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L156-L161)[README.md240-253](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L240-L253)[README.md307-310](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L307-L310)

---

## Node command families

### Common commands (all platforms)

- **`camera.snap`**: Capture still image
- **`camera.clip`**: Record video clip (iOS/Android only)
- **`screen.record`**: Record screen video
- **`canvas.push`**: Update Canvas UI (A2UI)
- **`canvas.eval`**: Execute Canvas JavaScript
- **`canvas.snapshot`**: Capture Canvas screenshot

### macOS-specific commands

- **`system.run`**: Execute shell command (with permission checks)
- **`system.notify`**: Post system notification

### Android-specific commands

- **`location.get`**: Get device location
- **`notifications.send`**: Send notification
- **`sms.send`**: Send SMS message
- **`contacts.list`**: List contacts
- **`calendar.events`**: Query calendar events
- **`motion.status`**: Get motion sensor data
- **`app.update`**: Install APK update

**Sources:**[README.md240-253](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L240-L253)[README.md167-168](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L167-L168)[README.md307-310](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L307-L310)

---

## Permission model

Nodes enforce platform-specific permissions and report status to the Gateway:

**macOS/iOS (TCC - Transparency, Consent, and Control)**:

- Camera: `NSCameraUsageDescription`
- Microphone: `NSMicrophoneUsageDescription`
- Location: `NSLocationWhenInUseUsageDescription`
- Screen Recording: System Preferences → Privacy & Security → Screen Recording
- Notifications: System Preferences → Notifications

**Android (Runtime Permissions)**:

- Camera: `android.permission.CAMERA`
- Location: `android.permission.ACCESS_FINE_LOCATION`
- Microphone: `android.permission.RECORD_AUDIO`
- Notifications: `android.permission.POST_NOTIFICATIONS` (API 33+)
- SMS: `android.permission.SEND_SMS`

**Permission status in node.describe**:

```
{
  "capabilities": {
    "camera.snap": {
      "available": true,
      "permission": "granted"
    },
    "screen.record": {
      "available": true,
      "permission": "denied"
    }
  }
}
```

**Sources:**[apps/ios/Sources/Info.plist45-57](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L45-L57)[README.md240-253](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L240-L253)

---

## Node configuration

Nodes are configured primarily through their native app settings. Gateway-side configuration is minimal:

**Gateway config (optional)**:

```
{
  gateway: {
    nodes: {
      denyCommands: ["system.run"], // Block specific commands
      approvals: {
        // Approval workflow for sensitive commands
      }
    }
  }
}
```

**Node-side configuration**:

- **iOS/Android**: Settings UI for gateway URL, credentials, Canvas preferences
- **macOS**: Menu bar → Preferences for gateway connection, node mode toggle

**Sources:**[CHANGELOG.md126-127](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L126-L127)[README.md240-253](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L240-L253)

---

## Remote gateway usage

Nodes can connect to remote gateways (running on VPS or home server) while executing commands locally:

```
Connection

Local Device

Remote VPS

node.invoke
camera.snap

node.invoke
camera.snap

Gateway
(exec tool host)

Pi Agent

Telegram/WhatsApp
Discord

Node Client
(iOS/Android/macOS)

Camera

Screen

System APIs

Tailscale Serve/Funnel

SSH Tunnel
```

**Diagram: Remote Gateway with Local Node Execution**

**Use case**: Run the Gateway on a Linux VPS for 24/7 availability, while nodes provide device-local actions (camera, notifications) on demand.

**Connection modes**:

- **Tailscale Serve**: Gateway binds to loopback, Tailscale exposes via HTTPS on tailnet
- **Tailscale Funnel**: Public HTTPS with password auth
- **SSH tunnel**: Forward local port to remote gateway port

**Sources:**[README.md230-238](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L230-L238)[docs/gateway/configuration.md214-228](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L214-L228)

---

## Common troubleshooting

**Node won't connect**:

1. Check gateway status: `openclaw gateway status`
2. Verify discovery method (Bonjour, Tailscale, manual URL)
3. Check firewall rules (allow port 18789 inbound)
4. Review logs: `openclaw logs --follow`

**Permission denied errors**:

1. Check node.describe response for permission status
2. Grant permissions in System Settings (iOS/macOS) or App Info (Android)
3. Restart node app after granting permissions

**Device pairing fails**:

1. Verify gateway auth mode matches client expectations
2. Check pairing store: `openclaw pairing list`
3. Approve pending requests: `openclaw pairing approve <channel> <code>`

**Sources:**[docs/gateway/troubleshooting.md142-189](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md#L142-L189)[CHANGELOG.md95-97](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L95-L97)

---

## Related CLI commands
CommandPurpose`openclaw nodes`List registered nodes`openclaw devices`Alias for `openclaw nodes``openclaw node run <deviceId> <command>`Execute node command directly`openclaw pairing list`Show device pairing status`openclaw pairing approve <channel> <code>`Approve pairing request
**Sources:**[docs/cli/index.md38-40](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md#L38-L40)[docs/cli/index.md250-253](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md#L250-L253)

---

## See also

- [iOS Client](/openclaw/openclaw/6.1-ios-client) - iOS-specific features and setup
- [macOS Client](/openclaw/openclaw/6.2-macos-client) - macOS menu bar app and node mode
- [Android Client](/openclaw/openclaw/6.3-android-client) - Android node capabilities
- [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing) - Gateway authentication and device auth v2
- [Gateway Configuration](/openclaw/openclaw/2.3-configuration-system) - Node-related config options

---

# iOS-Client

# iOS Client
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

This page documents the iOS Clawdis app: its internal architecture, how it connects to the OpenClaw Gateway, and the device capability services it exposes. The app's primary role is to function as a "node" client, registering device hardware (camera, location, microphone, etc.) with the gateway so agents can invoke them.

For the Gateway WebSocket protocol the app speaks, see [2.1](/openclaw/openclaw/2.1-websocket-protocol-and-rpc). For the node pairing approval flow, see [2.2](/openclaw/openclaw/2.2-authentication-and-device-pairing). For macOS and Android clients, see [6.2](/openclaw/openclaw/6.2-macos-client) and [6.3](/openclaw/openclaw/6.3-android-client).

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

Sources: [apps/ios/Sources/Model/NodeAppModel.swift95-116](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Model/NodeAppModel.swift#L95-L116)[apps/ios/Sources/Gateway/GatewayConnectionController.swift19-57](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Gateway/GatewayConnectionController.swift#L19-L57)

---

## NodeAppModel

`NodeAppModel` ([apps/ios/Sources/Model/NodeAppModel.swift50-217](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Model/NodeAppModel.swift#L50-L217)) is the central `@Observable` class for the iOS app. It is created once and injected into the SwiftUI environment.

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

Sources: [apps/ios/Sources/Model/NodeAppModel.swift709-755](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Model/NodeAppModel.swift#L709-L755)

---

## GatewayConnectionController

`GatewayConnectionController` ([apps/ios/Sources/Gateway/GatewayConnectionController.swift21-57](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Gateway/GatewayConnectionController.swift#L21-L57)) manages gateway discovery and connection setup.

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

Sources: [apps/ios/Sources/Gateway/GatewayConnectionController.swift90-155](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Gateway/GatewayConnectionController.swift#L90-L155)[apps/ios/Sources/Gateway/GatewayConnectionController.swift241-277](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Gateway/GatewayConnectionController.swift#L241-L277)

---

## TalkModeManager

`TalkModeManager` ([apps/ios/Sources/Voice/TalkModeManager.swift16-103](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Voice/TalkModeManager.swift#L16-L103)) implements two-way voice conversation with the agent.

**Speech-to-text (STT)**: Uses `SFSpeechRecognizer` with `AVAudioEngine`. Audio is tapped from the microphone, fed into an `SFSpeechAudioBufferRecognitionRequest`, and results are emitted as partial or final transcripts.

**Text-to-speech (TTS)**: Handled by the gateway via ElevenLabs. Configuration (`apiKey`, `voiceId`, `modelId`) is fetched from the gateway on connect. Streaming audio is played via `PCMStreamingAudioPlayer` (PCM) or `StreamingAudioPlayer` (MP3).

**Capture modes:**
ModeEnum caseDescriptionIdle`.idle`No active captureContinuous`.continuous`Always-on listening with silence detectionPush-to-talk`.pushToTalk`Single utterance capture
**Key methods:**
MethodDescription`start()`Enters continuous capture mode, requests permissions, subscribes to chat events`stop()`Cleans up all audio resources and chat subscriptions`beginPushToTalk()`Starts a single PTT capture, returns `OpenClawTalkPTTStartPayload``endPushToTalk()`Stops PTT, sends transcript to gateway, returns `OpenClawTalkPTTStopPayload``suspendForBackground(keepActive:)`Releases mic; optionally keeps listening in background`resumeAfterBackground(wasSuspended:wasKeptActive:)`Restores capture state
**Silence detection**: A `silenceTask` polling every 200ms checks `lastAudioActivity` and `lastHeard`. If both fall outside `silenceWindow` (0.9 s), the current transcript is processed and sent to the gateway.

**Noise floor calibration**: The first 22 audio samples calibrate `noiseFloor`. The VAD threshold is clamped to `[0.12, 0.35]` above the measured floor.

**Microphone coordination**: `TalkModeManager` and `VoiceWakeManager` compete for the same microphone. When talk mode is enabled, `NodeAppModel.setTalkEnabled(_:)` calls `voiceWake.setSuppressedByTalk(true)` and suspends voice wake capture.

Sources: [apps/ios/Sources/Voice/TalkModeManager.swift1-340](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Voice/TalkModeManager.swift#L1-L340)

---

## VoiceWakeManager

`VoiceWakeManager` ([apps/ios/Sources/Voice/VoiceWakeManager.swift83-213](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Voice/VoiceWakeManager.swift#L83-L213)) runs continuous always-on wake-word detection using `SFSpeechRecognizer`.

Audio buffers are enqueued into `AudioBufferQueue` (a thread-safe ring buffer) via an `AVAudioEngine` tap. A `tapDrainTask` drains the queue every 40ms and appends buffers to the recognition request.

Wake-word matching is delegated to `WakeWordGate.match(transcript:segments:config:)` from `SwabbleKit`. The active trigger words come from `VoiceWakePreferences` (stored in `UserDefaults`), kept in sync with the gateway via the `voicewake.changed` server event.

On a match, the command text is sent to the gateway via `NodeAppModel.sendVoiceTranscript(text:sessionKey:)` on the operator session.

**State transitions:**

- `setEnabled(true)` → `start()` → requests mic + speech permissions → `startRecognition()` → `isListening = true`
- `suspendForExternalAudioCapture()` → pauses recognition, releases `AVAudioSession`
- `resumeAfterExternalAudioCapture(wasSuspended:)` → calls `start()` if was suspended
- On recognition error → restarts after 700ms delay

Sources: [apps/ios/Sources/Voice/VoiceWakeManager.swift83-270](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Voice/VoiceWakeManager.swift#L83-L270)

---

## ScreenController

`ScreenController` ([apps/ios/Sources/Screen/ScreenController.swift8-374](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Screen/ScreenController.swift#L8-L374)) manages the single `WKWebView` that forms the primary visual surface of the app.

**Canvas modes:**
Mode`urlString`Scroll behaviorDefault canvas (scaffold)`""`Disabled (raw touch passthrough)External URLnon-emptyEnabled
The default canvas loads `CanvasScaffold/scaffold.html` from the `OpenClawKit` bundle.

**Security**: Loopback URLs (`localhost`, `127.x.x.x`, `::1`) received from the gateway are silently redirected to the default canvas. Local network URLs (LAN IPs, `.local`, `.ts.net`, `.tailscale.net`, Tailscale CGNAT `100.64/10`) are permitted.

**Key operations:**
MethodDescription`navigate(to:)`Loads a URL in the web view, or shows default canvas for empty/loopback URLs`showDefaultCanvas()`Resets to scaffold HTML`eval(javaScript:)`Evaluates JS via `WKWebView.evaluateJavaScript`, async/await wrapper`snapshotBase64(maxWidth:format:quality:)`Takes a `WKSnapshotConfiguration` snapshot, returns base64 PNG or JPEG`waitForA2UIReady(timeoutMs:)`Polls `globalThis.openclawA2UI.applyMessages` until ready
**A2UI actions**: Button clicks inside the canvas post a `userAction` message that is intercepted by `ScreenWebView` and forwarded to `NodeAppModel.handleCanvasA2UIAction(body:)`. This method packages the action as an agent message and sends it via `sendAgentRequest(link:)`.

Sources: [apps/ios/Sources/Screen/ScreenController.swift1-374](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Screen/ScreenController.swift#L1-L374)

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

Sources: [apps/ios/Sources/Services/NodeServiceProtocols.swift1-103](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Services/NodeServiceProtocols.swift#L1-L103)

**Capability summary table:**
CapabilityProtocolCommand prefixiOS permissionCamera photo/video`CameraServicing``camera.*`NSCameraUsageDescriptionScreen recording`ScreenRecordingServicing``screen.record`ReplayKitGPS location`LocationServicing``location.get`NSLocationWhenInUseUsageDescriptionPhotos library`PhotosServicing``photos.latest`NSPhotoLibraryUsageDescriptionContacts`ContactsServicing``contacts.*`NSContactsUsageDescriptionCalendar`CalendarServicing``calendar.*`NSCalendarsUsageDescriptionReminders`RemindersServicing``reminders.*`NSRemindersUsageDescriptionMotion/pedometer`MotionServicing``motion.*`NSMotionUsageDescriptionApple Watch`WatchMessagingServicing``watch.*`WatchConnectivityCanvas web view`ScreenController``canvas.*`—Voice STT/TTS`TalkModeManager``talk.ptt.*`NSMicrophoneUsageDescription, NSSpeechRecognitionUsageDescriptionWake word`VoiceWakeManager`— (outbound only)same as above
**Background restrictions**: Commands with prefixes `canvas.*`, `camera.*`, `screen.*`, and `talk.*` return a `backgroundUnavailable` error when `isBackgrounded == true`. Location commands additionally require `Always` authorization when backgrounded.

Sources: [apps/ios/Sources/Model/NodeAppModel.swift757-760](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Model/NodeAppModel.swift#L757-L760)[apps/ios/Sources/Services/NodeServiceProtocols.swift1-103](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Services/NodeServiceProtocols.swift#L1-L103)

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

Sources: [apps/ios/Sources/Model/NodeAppModel.swift297-369](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Model/NodeAppModel.swift#L297-L369)[apps/ios/Sources/OpenClawApp.swift75-155](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/OpenClawApp.swift#L75-L155)

---

## Onboarding and Settings

**First-run flow** is managed by `OnboardingWizardView` ([apps/ios/Sources/Onboarding/OnboardingWizardView.swift45](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Onboarding/OnboardingWizardView.swift#L45-LNaN)). Steps:
StepEnum caseContentWelcome`.welcome`Splash screenConnection mode`.mode`Manual vs. setup codeConnect`.connect`Gateway list or QR scanAuthentication`.auth`Token/password entrySuccess`.success`Confirmation
`RootCanvas.startupPresentationRoute(...)` determines whether to show onboarding, settings, or nothing on launch based on `hasConnectedOnce`, `onboardingComplete`, and the existence of a saved gateway config.

**Settings** (`SettingsTab`, [apps/ios/Sources/Settings/SettingsTab.swift9](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Settings/SettingsTab.swift#L9-LNaN)) exposes:

- Gateway section: setup code entry, discovered gateway list, manual host/port/TLS override, debug log view
- Device features: Voice Wake toggle, Talk Mode toggle, Background Listening, Wake Words, Camera, Location mode (`off`/`whileUsing`/`always`), Prevent Sleep
- Agent picker (selects which gateway agent the session key targets)
- Device info: display name, instance ID, platform string

Credentials (token, password) are stored per `instanceId` via `GatewaySettingsStore` (backed by the iOS keychain).

Sources: [apps/ios/Sources/Settings/SettingsTab.swift61-509](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Settings/SettingsTab.swift#L61-L509)[apps/ios/Sources/RootCanvas.swift48-67](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/RootCanvas.swift#L48-L67)

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

Sources: [apps/ios/Sources/RootCanvas.swift69-263](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/RootCanvas.swift#L69-L263)[apps/ios/Sources/Status/StatusPill.swift1-140](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Status/StatusPill.swift#L1-L140)[apps/ios/Sources/Screen/ScreenTab.swift1-27](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Screen/ScreenTab.swift#L1-L27)

---

# macOS-Client

# macOS Client
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

The macOS client (`OpenClaw.app`) is a menu bar application that serves as both a Gateway control interface and a device node. It provides Voice Wake/push-to-talk, Talk Mode overlay, WebChat access, debug tools, and remote Gateway control via SSH tunnels and Tailscale discovery. The app is packaged as a Swift Package at `apps/macos/`.

Related pages: [iOS Client](/openclaw/openclaw/6.1-ios-client), [Android Client](/openclaw/openclaw/6.3-android-client), [WebSocket Protocol & RPC](/openclaw/openclaw/2.1-websocket-protocol-and-rpc), [Authentication & Device Pairing](/openclaw/openclaw/2.2-authentication-and-device-pairing).

---

## Architecture Overview

The macOS app operates in dual mode:

1. **Node mode**: Connects to the Gateway as a device node, registers capabilities (screen automation, camera, canvas), and handles `node.invoke` requests.
2. **Operator mode**: Maintains a second WebSocket connection for chat, session management, and configuration RPC calls.

It also serves as a pairing approval surface: when iOS/Android nodes send `node.pair.request`, the macOS app presents Approve/Reject UI. Silent auto-approval is supported when the request includes `silent: true` and SSH connectivity to the Gateway host can be verified.

**Key features** (from README.md and CHANGELOG.md):
FeaturePurposeMenu bar controlGateway health, session list, agent pickerVoice Wake / PTTWake-word detection (`SwabbleKit`), push-to-talk overlayTalk ModeContinuous voice interaction overlayWebChatIn-app browser-based chat UIDebug toolsSession inspector, capability testingRemote Gateway controlSSH tunnel relay, Tailscale Serve/Funnel discoveryPairing approvalInteractive/silent approval for remote nodes
Sources: [README.md289-295](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L289-L295)[CHANGELOG.md161](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L161-L161)[package.json1-18](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L1-L18)

**Component interaction diagram**

```
macOS Host

node WebSocket

operator WebSocket

Bonjour/DNS-SD

node.pair.request

node.pair.requested

node.pair.approve/reject

OpenClaw.app
(MenuBarExtra)

VoiceWakeController
(SwabbleKit)

TalkModeOverlay

BridgeServer
(OpenClawIPC)

RelayProcessManager
(swift-subprocess)

openclaw-mac CLI

GatewayServer
(ws://127.0.0.1:18789)

RemotePortTunnel
(SSH/Tailscale)

Remote Node
(iOS/Android)
```

Sources: [apps/macos/Package.swift1-92](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L1-L92)[README.md289-295](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L289-L295)[CHANGELOG.md161](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L161-L161)

---

## Swift Package Structure

The macOS app is a standalone Swift Package (`apps/macos/Package.swift`) targeting macOS 15+. It produces four products:
ProductKindPurpose`OpenClawIPC`libraryLocal IPC protocol between the menu bar process and other processes (e.g., `BridgeServer`)`OpenClawDiscovery`libraryBonjour/mDNS discovery of local Gateway instances`OpenClaw`executableThe menu bar app itself`openclaw-mac`executableHeadless CLI companion (`OpenClawMacCLI` target)
**Main app dependencies**
DependencyRole in macOS app`MenuBarExtraAccess`Menu bar window lifecycle and access management`swift-subprocess`Powers `RelayProcessManager` for spawning subprocesses`swift-log`Structured logging`Sparkle`In-app auto-update`PeekabooBridge` / `PeekabooAutomationKit`Screen automation capabilities exposed to the agent`OpenClawKit`Shared models, bridge frames, capability definitions`OpenClawChatUI`Shared chat UI components`OpenClawProtocol`Gateway WebSocket protocol frame types`SwabbleKit`Wake-word engine (same lib as iOS)
Sources: [apps/macos/Package.swift1-92](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L1-L92)[apps/macos/Package.resolved1-132](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.resolved#L1-L132)

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

Sources: [apps/macos/Package.swift26-92](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L26-L92)

---

## Menu Bar Features

The main executable `OpenClaw` runs as a menu bar-resident application (no Dock icon). It leverages `MenuBarExtraAccess` for lifecycle management and presents a popover UI with the following surfaces:
SurfacePurposeConnection statusGateway reachability (connected/connecting/offline)Session listActive chat sessions, selectable for WebChatAgent pickerConfigured agents from `agents.list`Pairing approvalsInteractive prompts for `node.pair.requested` eventsVoice Wake controlsWake word on/off, push-to-talk activationTalk Mode toggleEnable continuous voice overlayWebChat windowIn-app browser view of `http://127.0.0.1:18789/`Debug toolsSession inspector, capability probe, log viewerSettingsGateway URL, auth token/password, node display name
**Dual WebSocket connections**:

1. **Node connection** (`node` role): Registers device capabilities via `node.describe`, handles `node.invoke` requests (screen automation, camera, canvas).
2. **Operator connection** (`operator` role): Handles `chat.send`, `sessions.list`, `config.get`, and other RPC methods.

Sources: [apps/macos/Package.swift43-67](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L43-L67)[README.md289-295](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L289-L295)[CHANGELOG.md161](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L161-L161)

---

## BridgeServer and OpenClawIPC

`OpenClawIPC` is a zero-dependency Swift library that implements local inter-process communication. The main app hosts a `BridgeServer` that other local processes can connect to. This allows tools like the `openclaw-mac` CLI or spawned subprocesses managed by `RelayProcessManager` to communicate with the running app without going through the Gateway.

The IPC framing mirrors the Gateway's bridge frame format — the same `BridgeInvokeRequest` / `BridgeInvokeResponse` types defined in `OpenClawKit` are reused, so capability invocations from the Gateway flow through the same path as local IPC calls.

Sources: [apps/macos/Package.swift27-31](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L27-L31)[apps/macos/Package.swift79-90](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L79-L90)

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

Sources: [apps/macos/Package.swift52-54](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L52-L54)

---

**Pairing sequence diagram**

```
"SSH Probe"
"OpenClaw.app"
"GatewayServer"
"Remote Node
(iOS/Android)"
"SSH Probe"
"OpenClaw.app"
"GatewayServer"
"Remote Node
(iOS/Android)"
alt
[SSH succeeds]
[SSH fails]
alt
[silent=true]
[silent=false]
"node.pair.request
{silent: true}"
"node.pair.requested
event"
"ssh <host> echo ok"
"exit 0"
"node.pair.approve"
"exit 1"
"show UI prompt"
"node.pair.approve
or node.pair.reject"
"show UI prompt"
"node.pair.approve
or node.pair.reject"
"node.pair.resolved
(token issued)"
"reconnect with token"
```

Sources: [CHANGELOG.md161](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L161-L161)

## openclaw-mac CLI

The `OpenClawMacCLI` target produces a standalone binary (`openclaw-mac`) for headless Gateway interaction. It reuses `OpenClawDiscovery` for Bonjour/DNS-SD discovery and speaks the Gateway WebSocket protocol via `OpenClawProtocol`.

**Use cases**:
ScenarioExampleScripted Gateway calls`openclaw-mac call sessions.list`CI/CD automationTrigger agent runs without the full appGateway discovery`openclaw-mac discover` (Bonjour/mDNS probe)Tailscale peer probeDiscover Gateway via `wss://<peer>.ts.net` (CHANGELOG.md #32860)
**Architecture**: Pure command-line tool with no `OpenClawIPC` or UI dependencies. Uses `OpenClawDiscovery` for mDNS (`_openclaw-gw._tcp`) and DNS-SD wide-area lookups, including Tailscale Serve/Funnel endpoints.

---

## Device Capabilities

The macOS app registers node capabilities with the Gateway via `node.describe` after completing the `connect.challenge` handshake. Capabilities are exposed as `node.invoke` actions that the agent runtime can call through the `nodes` tool.

**macOS-specific capabilities**:
CapabilityImplementationAgent access`system.run`Command execution (bash/zsh)`node.invoke action=system.run``system.notify`macOS notification center`node.invoke action=system.notify`Screen automation`PeekabooBridge`, `PeekabooAutomationKit``node.invoke action=screen.*`Screen captureAccessibility + Screen Recording permissions`node.invoke action=screen.capture`
**Shared capabilities** (also on iOS):
CapabilityImplementationAgent accessCanvas rendering`OpenClawKit` (web view)`canvas.*` tool actionsCamera snap/clipSystem camera APIs`node.invoke action=camera.*`Voice Wake`SwabbleKit` wake-word engineWake word triggers chat sessions
**Permission model**: The macOS app tracks TCC (Transparency, Consent, and Control) permissions for Screen Recording, Accessibility, Camera, and Microphone. When a `node.invoke` action requires a missing permission, the response includes `PERMISSION_MISSING` with actionable guidance.

Sources: [apps/macos/Package.swift43-67](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L43-L67)[README.md240-252](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L240-L252)

<old_str>

## Node Pairing Approval

When a remote node (iOS, Android, etc.) attempts to pair with the Gateway, the Gateway emits a `node.pair.requested` event to all connected operator-role clients. The macOS app receives this event and presents an approval UI.

The pairing flow documented in `docs/gateway/pairing.md`:

1. Remote node connects and calls `node.pair.request`.
2. Gateway stores a pending request (expires after 5 minutes) and emits `node.pair.requested`.
3. macOS app receives the event and presents **Approve / Reject**.
4. If the request carries `silent: true`, the app can attempt **silent auto-approval** by verifying an SSH connection to the gateway host using the same local user. If SSH verification fails, it falls back to the interactive prompt.
5. On approval, the app calls `node.pair.approve`, which causes the Gateway to issue a fresh auth token to the node.
6. The Gateway emits `node.pair.resolved`.
</old_str>
<new_str>

## Pairing Approval Flow

When a remote node (iOS, Android) attempts to pair, the Gateway emits `node.pair.requested` to all connected operator clients. The macOS app presents an approval UI (or attempts silent auto-approval).

**Pairing sequence**:

1. Remote node connects and calls `node.pair.request { silent: true/false }`.
2. Gateway stores pending request (expires after 5 minutes), emits `node.pair.requested`.
3. macOS app receives event and evaluates approval mode:

- **Silent mode** (`silent: true`): Attempt SSH connection verification to Gateway host. If SSH succeeds (same local user context), auto-approve. If SSH fails, fall back to interactive prompt.
- **Interactive mode**: Present Approve/Reject UI with node metadata (device name, platform, requested capabilities).
4. On approval, macOS app calls `node.pair.approve`, Gateway issues fresh auth token.
5. Gateway emits `node.pair.resolved`, remote node receives token and reconnects.

**Silent approval logic** (introduced in CHANGELOG.md #32860):

- Requires `silent: true` in the pairing request.
- macOS app probes SSH connectivity: `ssh <gateway-host> echo ok`.
- If probe succeeds, approval is automatic (no user interaction).
- If probe fails (host unreachable, credentials missing), falls back to interactive prompt.

---

**openclaw-mac dependency diagram**

```
Discovery methods

WebSocket RPC

openclaw-mac
(OpenClawMacCLI)

OpenClawDiscovery

OpenClawProtocol

OpenClawKit

Bonjour/mDNS
(_openclaw-gw._tcp)

DNS-SD wide-area

Tailscale peer probe
(wss://.ts.net)

GatewayServer
(local or remote)
```

Sources: [apps/macos/Package.swift69-78](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L69-L78)[CHANGELOG.md161](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L161-L161)

```
mDNS

WebSocket RPC

openclaw-mac binary

OpenClawDiscovery (Bonjour)

OpenClawProtocol (WebSocket frames)

OpenClawKit (shared models)

GatewayServer
```

Sources: [apps/macos/Package.swift69-78](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L69-L78)

---

## Update Mechanism

The app integrates `Sparkle` (version 2.x) for automatic updates. Release artifacts are published and Sparkle's appcast mechanism handles update discovery and installation in the background. See [Releasing](/openclaw/openclaw/8.2-release-process) for the macOS release process.

Sources: [apps/macos/Package.swift21](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.swift#L21-L21)[apps/macos/Package.resolved46-56](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Package.resolved#L46-L56)

---

# Android-Client

# Android Client
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

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

Sources: [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)[CHANGELOG.md11-12](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L11-L12)[CHANGELOG.md141](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L141-L141)

---

## BridgeSession

`BridgeSession` manages a single WebSocket connection to the Gateway. Two instances are created at app startup, one per role:
InstanceRoleResponsibilitiesnode session`node`Advertises capabilities, receives and dispatches `node.invoke` commandsoperator session`operator`Issues chat, config, and canvas RPCs on behalf of the local user
The WebSocket transport uses OkHttp3. An earlier bug where OkHttp added a native `Origin` header caused Gateway rejection; this was corrected by explicitly removing the header from the connection setup.

Device identity is derived from a keypair. The keypair is stored using `androidx.security:security-crypto` (encrypted SharedPreferences), and Bouncycastle (`bcprov-jdk18on`) provides the underlying cryptographic primitives for key generation and signing during the `connect.challenge` / `hello-ok` handshake.

Sources: [apps/android/app/build.gradle.kts124-127](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L124-L127)[CHANGELOG.md141](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L141-L141)

---

## BridgePairingClient

`BridgePairingClient` implements the device pairing approval flow. When an Android node first connects, a pending pairing request is stored on the Gateway and the operator must approve it via CLI or UI before the node is granted its auth token. This follows the `node.pair.*` protocol described in [2.2](/openclaw/openclaw/2.2-authentication-and-device-pairing).

QR code scanning for initial setup uses ZXing (`zxing-android-embedded`). The user scans a setup code displayed by the Gateway or CLI output to bootstrap the connection without manually entering credentials.

Sources: [apps/android/app/build.gradle.kts139-140](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L139-L140)[CHANGELOG.md141](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L141-L141)

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

Sources: [CHANGELOG.md11-12](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L11-L12)[CHANGELOG.md40-42](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L40-L42)[CHANGELOG.md59-60](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L59-L60)

### Camera

Camera commands use the CameraX library suite (`camera-core`, `camera-camera2`, `camera-lifecycle`, `camera-video`, `camera-view`).
CommandDescriptionNotes`camera.list`List available camerasReturns device IDs and facing info`camera.snap`Capture a still photoOutput is size-limited by `JpegSizeLimiter``camera.clip`Record a short video clipBinary upload; no base64 fallback
Behavioral constraints:

- `facing=both` is rejected when `deviceId` is also specified, to prevent mislabeled duplicate captures.
- `maxWidth` must be a positive integer; non-positive values fall back to the safe resize default.
- `camera.clip` uses deterministic binary upload transport. The base64 fallback was removed to make transport failures explicit.
- The invoke-result acknowledgement timeout is scaled to the full invoke budget to accommodate large clip payloads.

Sources: [apps/android/app/build.gradle.kts134-139](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L134-L139)[CHANGELOG.md40-41](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L40-L41)

### Device
CommandDescription`device.status`Current device status (battery, connectivity, etc.)`device.info`Static device metadata (model, OS version)`device.permissions`Runtime permission grant states`device.health`Device health diagnostics
Sources: [CHANGELOG.md11](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L11-L11)[CHANGELOG.md59](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L59-L59)

### Notifications
CommandActionNotes`notifications.list`List active notificationsReturns notification metadata array`notifications.actions open`Open/launch a notificationPermitted on non-clearable entries`notifications.actions dismiss`Dismiss a notificationGated: only clearable notifications`notifications.actions reply`Send an inline replyPermitted on non-clearable entries
The notification listener is rebound immediately before executing any notification action to ensure the action targets the current live state.

Sources: [CHANGELOG.md11](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L11-L11)[CHANGELOG.md40](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L40-L40)[CHANGELOG.md60](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L60-L60)

### Canvas and A2UI

The Android node supports the canvas capability. The WebView is hosted via `androidx.webkit:webkit`. The Gateway pushes a URL to the node; the node loads it in the WebView and executes A2UI interactions.

Key behaviors:

- `node.canvas.capability.refresh` is sent with empty object params (`{}`) to signal A2UI readiness and to recover after a scoped capability expiry. The Gateway validates that `params` is an object (not `null`), so sending `{}` rather than nothing is required for schema compliance.
- Canvas URLs are normalized by scope before being loaded.
- A2UI readiness is verified by polling for the `openclawA2UI` host object in the WebView JavaScript context, with retries on load delay.
- A debug diagnostics JSON endpoint can be enabled at runtime for canvas troubleshooting.

Sources: [apps/android/app/build.gradle.kts106](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L106-L106)[CHANGELOG.md12](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L12-L12)[CHANGELOG.md42](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L42-L42)

---

## JpegSizeLimiter

`JpegSizeLimiter` enforces maximum dimension and byte-size constraints on JPEG images produced by camera commands before they are transmitted to the Gateway. This prevents oversized payloads from overwhelming the WebSocket transport or Gateway processing.

Key rules enforced by `JpegSizeLimiter`:

- Non-positive `maxWidth` values are rejected at the call site; a safe resize default is used instead.
- EXIF metadata is handled via `androidx.exifinterface:exifinterface` to preserve or strip orientation data during resize.

Sources: [apps/android/app/build.gradle.kts125](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L125-L125)[CHANGELOG.md40-42](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L40-L42)

---

## Chat UI

The native Android chat interface is built with Jetpack Compose and driven by the `operator`-role `BridgeSession`. Streaming partial replies are assembled incrementally before being rendered.

Markdown rendering uses the CommonMark library suite:
LibraryPurpose`commonmark`Core CommonMark block/inline parsing`commonmark-ext-autolink`Automatic URL and email linkification`commonmark-ext-gfm-strikethrough`GitHub Flavored Markdown strikethrough`commonmark-ext-gfm-tables`GFM table rendering`commonmark-ext-task-list-items`Task list checkbox items
Sources: [apps/android/app/build.gradle.kts128-133](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L128-L133)[CHANGELOG.md152-153](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L152-L153)

---

## Build Configuration

The app module is at `apps/android/app/` and built with Gradle Kotlin DSL.

### Module Identity
PropertyValueApplication ID`ai.openclaw.android``compileSdk`36`minSdk`31 (Android 12)`targetSdk`36`versionName``2026.2.27` (matches monorepo version)`versionCode``202602270`Supported ABIs`armeabi-v7a`, `arm64-v8a`, `x86`, `x86_64`
APK output files are named `openclaw-{versionName}-{buildType}.apk` via a custom `androidComponents.onVariants` hook [apps/android/app/build.gradle.kts78-89](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L78-L89)

Release builds enable both minification and resource shrinking (`isMinifyEnabled = true`, `isShrinkResources = true`). Debug builds have both disabled.

The app shares resource assets with the cross-platform `OpenClawKit` library by adding `../../shared/OpenClawKit/Sources/OpenClawKit/Resources` to the `main` source set's asset directories [apps/android/app/build.gradle.kts13-17](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L13-L17)

### Key Runtime Dependencies
DependencyVersionRole`okhttp3:okhttp`5.3.2WebSocket transport (`BridgeSession`)`bouncycastle:bcprov-jdk18on`1.83Device identity keypairs`security-crypto`1.1.0Encrypted credential storage`webkit`1.15.0Canvas / A2UI WebView`dnsjava:dnsjava`3.6.4Unicast DNS-SD for tailnet gateway discovery`camera-core` / `camera-camera2` / `camera-lifecycle` / `camera-video` / `camera-view`1.5.2CameraX for camera capability`zxing-android-embedded`4.3.0QR code scan for pairing setup`commonmark` + extensions0.27.1Chat markdown rendering`kotlinx-serialization-json`1.10.0JSON serialization`exifinterface`1.4.2Image EXIF metadata handlingCompose BOM2026.02.00Native UI framework
Sources: [apps/android/app/build.gradle.kts98-151](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L98-L151)

---

## Development Commands

The root `package.json` exposes npm scripts for common Android tasks:
ScriptUnderlying CommandDescription`android:assemble``./gradlew :app:assembleDebug`Build debug APK`android:install``./gradlew :app:installDebug`Install on connected ADB device`android:run``installDebug` + `adb shell am start -n ai.openclaw.android/.MainActivity`Install and launch`android:test``./gradlew :app:testDebugUnitTest`Run unit tests`android:test:integration``vitest run ... android-node.capabilities.live.test.ts`Gateway-side live integration tests
The integration test suite is located at `src/gateway/android-node.capabilities.live.test.ts` in the Node.js gateway codebase and requires a connected Android device. It is gated by the environment variables `OPENCLAW_LIVE_TEST=1` and `OPENCLAW_LIVE_ANDROID_NODE=1`.

Sources: [package.json50-54](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L50-L54)

---

# Security

# Security
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md)
- [docs/gateway/background-process.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/bash-process-registry.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts)
- [src/agents/bash-process-registry.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts)
- [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts)
- [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers.ts)
- [src/agents/pi-embedded-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

## Purpose and Scope

This document describes OpenClaw's security architecture, including access control, authentication, sandboxing, secret management, and network hardening. It provides an operational overview of the security model and references to implementation details.

For specific access policy mechanics (DM/group policies, pairing flows), see [Access Control Policies](/openclaw/openclaw/7.1-access-control-policies). For sandbox configuration and Docker isolation, see [Sandboxing](/openclaw/openclaw/7.2-sandboxing).

---

## Security Model Overview

OpenClaw implements defense-in-depth security with multiple layers:

```
Data Layer

Execution Layer

Authentication Layer

Access Control Layer

Network Layer

Gateway Bind Mode
(loopback, private, public)

Tailscale Serve/Funnel
(optional remote access)

TLS Configuration
(certificate validation)

DM Policy
(pairing, allowlist, open, disabled)

Group Policy
(allowlist, open, disabled)

Pairing Store
(approved senders)

Gateway Auth
(token or password)

Device Pairing
(node authentication)

OAuth/API Key Profiles
(model providers)

Tool Policy
(hierarchical filtering)

Docker Sandbox
(session isolation)

Owner-Only Tools
(elevated commands)

SecretRef Pattern
(credential indirection)

Log Redaction
(sensitive data masking)

File Policy
(workspace boundaries)
```

**Threat Model:**

- **Untrusted inbound messages**: DM senders and group members are treated as untrusted by default.
- **Privileged tool access**: Tools like `exec`, `browser`, and `nodes` can perform privileged operations on the host.
- **Credential exposure**: API keys, tokens, and OAuth credentials must be protected from logs and config leakage.
- **Network exposure**: Gateway must be safe to expose remotely (via Tailscale or public bind).

Sources: [README.md112-125](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L112-L125)[docs/gateway/configuration.md112-125](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L112-L125)

---

## Access Control Policies

OpenClaw enforces access control at the channel level using **DM policies** and **group policies**.

### DM Policy Modes
ModeBehaviorUse Case`pairing` (default)Unknown senders receive a one-time pairing code; operator must approveMulti-user deployments`allowlist`Only senders in `allowFrom` or paired store can messageLocked-down access`open`All inbound DMs accepted (requires `allowFrom: ["*"]`)Public bots (high risk)`disabled`All DMs ignoredGroup-only bots
### Group Policy Modes
ModeBehavior`allowlist` (default)Only groups matching configured allowlist`open`Bypass group allowlists (mention-gating still applies)`disabled`Block all group/room messages
```
Agent
Pairing Store
Access Control
Channel Monitor
User
Agent
Pairing Store
Access Control
Channel Monitor
User
Operator runs:
openclaw pairing approve
alt
[Not in store]
alt
[dmPolicy=disabled]
[dmPolicy=pairing && unknown sender]
[dmPolicy=allowlist && not in allowFrom]
[dmPolicy=open && "*" in allowFrom]
[Authorized (in allowFrom or paired)]
Send DM
Check dmPolicy + allowFrom
Drop (silent)
Check if approved
Return pairing code
"Code: XY123Z"
Add to allowlist
Drop (silent or error)
Route message
Route message
```

**Configuration:**

```
{
  channels: {
    telegram: {
      dmPolicy: "pairing",             // pairing | allowlist | open | disabled
      allowFrom: ["tg:123456"],        // sender allowlist
      groupPolicy: "allowlist",        // allowlist | open | disabled
      groups: {
        "*": { requireMention: true },
        "-1001234567890": {
          allowFrom: ["@admin"]        // per-group sender allowlist
        }
      }
    }
  }
}
```

See [Access Control Policies](/openclaw/openclaw/7.1-access-control-policies) for detailed policy resolution and pairing workflows.

Sources: [docs/gateway/configuration-reference.md22-43](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L22-L43)[src/config/runtime-group-policy.ts1-39](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/runtime-group-policy.ts#L1-L39)[README.md112-125](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L112-L125)

---

## Authentication and Authorization

### Gateway Authentication

The Gateway WebSocket/HTTP surface requires authentication when exposed beyond loopback:

```
Connect

token

password

none

Authorization: Bearer

X-Password: header

Local only

Client
(CLI, UI, Node)

Gateway
:18789

gateway.auth.mode

Token Auth
(operator token)

Password Auth
(shared secret)

No Auth
(loopback only)

Authorized Request
```

**Configuration:**

```
{
  gateway: {
    auth: {
      mode: "token",                   // token | password | none
      token: { $ref: "env/GATEWAY_TOKEN" },
      allowTailscale: true             // trust Tailscale identity headers
    },
    bind: "loopback"                   // loopback | private | public
  }
}
```

**Breaking change (v2026.3.3):** Gateway auth now requires explicit `gateway.auth.mode` when both `token` and `password` are configured.

Sources: [CHANGELOG.md34](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L34-L34)[src/config/zod-schema.ts419-452](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L419-L452)[docs/gateway/configuration-reference.md688-736](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md#L688-L736)

### Device Pairing

Native clients (iOS, Android, macOS) authenticate as **nodes** via device pairing:

1. Client generates pairing request with device ID
2. Gateway returns pairing token (expires in 5 minutes)
3. User approves via CLI: `openclaw devices approve <token>`
4. Client exchanges token for long-lived device credential

```
Device Store
openclaw CLI
Gateway
iOS/Android/macOS
Device Store
openclaw CLI
Gateway
iOS/Android/macOS
User reviews request
Store credential in keychain
POST /devices/pair/request
{deviceId, capabilities}
Generate pairing token
{pairingToken, expiresAt}
POST /devices/pair/approve
{pairingToken}
Mark approved
{deviceId, credential}
POST /devices/pair/complete
{pairingToken}
Issue device credential
{credential, deviceId}
WebSocket connect
Authorization: Bearer {credential}
Validate credential
Authenticated session
```

Sources: [src/gateway/pairing-device.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/pairing-device.ts#L1-L50)[docs/gateway/pairing.md1-100](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/pairing.md#L1-L100)

### Model Provider Authentication

API keys and OAuth tokens for model providers use **auth profiles**:

```
{
  auth: {
    profiles: {
      "openai-main": {
        provider: "openai",
        mode: "api_key",              // api_key | oauth | token
        email: "user@example.com"
      },
      "anthropic-oauth": {
        provider: "anthropic",
        mode: "oauth"
      }
    },
    order: {
      "openai": ["openai-main", "openai-fallback"],
      "anthropic": ["anthropic-oauth"]
    }
  }
}
```

Profile credentials are stored separately and resolved at runtime via the auth resolver.

Sources: [src/config/zod-schema.ts346-372](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L346-L372)[src/agents/model-auth.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/model-auth.ts#L1-L100)

---

## Sandboxing

OpenClaw can isolate agent sessions in Docker containers to limit host access. See [Sandboxing](/openclaw/openclaw/7.2-sandboxing) for full details.

**Modes:**

- `off`: No sandboxing (tools run on host)
- `non-main`: Sandbox only non-main sessions (groups, channels)
- `all`: Sandbox all sessions including direct chat

**Scopes:**

- `session`: One container per session (highest isolation)
- `agent`: One container per agent (shared across sessions)
- `shared`: One global container (lowest isolation)

```
off

non-main

all

Yes

No

session

agent

shared

Session Start

sandbox.mode

Is main session?

Execute on Host

Execute in Docker

sandbox.scope

Dedicated Container

Agent-Shared Container

Global Container

Apply Tool Policy

exec/process/read/write
```

**Default tool policy in sandbox:**

- **Allow:**`bash`, `process`, `read`, `write`, `edit`, `sessions_*`
- **Deny:**`browser`, `canvas`, `nodes`, `cron`, `discord`, `gateway`

Sources: [README.md333-338](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L333-L338)[src/agents/sandbox.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/sandbox.ts#L1-L100)[src/agents/pi-embedded-runner/sandbox-info.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/sandbox-info.ts#L1-L50)

---

## Secret Management

OpenClaw uses the **SecretRef pattern** to avoid storing credentials directly in config files.

### SecretRef Schema

```
type SecretRef = 
  | { $ref: string }                    // "env/VAR_NAME" | "file/path" | "exec/command"
  | string                              // plain value (discouraged for secrets)
```

**Examples:**

```
{
  channels: {
    telegram: {
      botToken: { $ref: "env/TELEGRAM_BOT_TOKEN" }
    },
    discord: {
      token: { $ref: "file/~/.openclaw/credentials/discord.token" }
    }
  },
  gateway: {
    auth: {
      token: { $ref: "exec/pass openclaw/gateway-token" }
    }
  }
}
```

### Credential Storage

**Channel credentials** are stored in `~/.openclaw/credentials/<channel>/`:

- WhatsApp: Baileys session files
- Telegram: Bot tokens (if using `tokenFile`)
- Signal: signal-cli config

**OAuth tokens** are stored in `~/.openclaw/auth/` as encrypted JSON files (per provider).

**File permissions:**

- Credential files: `0600` (owner read/write only)
- Credential directories: `0700` (owner access only)
- Cron store/backup: `0600` (enforced since v2026.3.3)

Sources: [src/config/zod-schema.ts10-11](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L10-L11)[CHANGELOG.md63](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L63-L63)[src/config/types.secrets.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.secrets.ts#L1-L50)

---

## Network Security

### Gateway Bind Modes
ModeBehaviorRisk`loopback` (default)Bind to `127.0.0.1` onlyLow (local-only access)`private`Bind to all private IPsMedium (LAN exposure)`public`Bind to `0.0.0.0`High (requires auth)
**Enforcement:**

- When `gateway.tailscale.mode` is `serve` or `funnel`, bind must be `loopback`.
- When `gateway.bind` is `public`, `gateway.auth.mode` must be `token` or `password`.

```
loopback

private

public

off

serve

funnel

none

token

password

Gateway Start

gateway.bind

gateway.tailscale.mode

gateway.auth.mode

Warn if no auth

Require auth or fail

Local-only access

Tailnet-only access

Public HTTPS access

Require password auth

Allow if allowTailscale=true

Token required

Password required
```

### Tailscale Integration

OpenClaw can auto-configure Tailscale **Serve** (tailnet-only) or **Funnel** (public):

```
{
  gateway: {
    bind: "loopback",
    tailscale: {
      mode: "serve",                   // off | serve | funnel
      resetOnExit: false               // cleanup on shutdown
    },
    auth: {
      mode: "token",
      allowTailscale: true             // trust Tailscale identity
    }
  }
}
```

**Security notes:**

- `serve` mode uses Tailscale identity headers for auth (when `allowTailscale: true`)
- `funnel` mode refuses to start without `gateway.auth.mode: "password"`
- Break-glass support for `ws://` URLs via `OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1`

Sources: [README.md213-228](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L213-L228)[CHANGELOG.md64](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L64-L64)[docs/gateway/tailscale.md1-100](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/tailscale.md#L1-L100)

### Security Headers

Default HTTP response headers (added v2026.3.3):

```
Permissions-Policy: camera=(), microphone=(), geolocation=()

```

Additional headers can be configured via `gateway.http.headers`.

Sources: [CHANGELOG.md114](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L114-L114)

---

## Tool Security

### Hierarchical Tool Policy

Tool availability is filtered through multiple policy layers:

```
Global Tool Policy
(tools.policy)

Agent Tool Policy
(agents.*.tools.policy)

Provider Tool Policy
(tools.byModelProvider)

Group Tool Policy
(channels..groups..tools)

Subagent Tool Policy
(tools.subagents.policy)

Sandbox Tool Policy
(agents.*.sandbox.tools)

Final Tool Set
```

**Policy resolution order:**

1. Start with all available tools
2. Apply global `tools.policy` (allow/deny/profile)
3. Apply per-agent `agents.<id>.tools.policy`
4. Apply per-provider `tools.byModelProvider.<provider>`
5. Apply per-group `channels.<channel>.groups.<id>.tools`
6. Apply subagent depth policy `tools.subagents.policy`
7. Apply sandbox policy (if sandboxed)

**Example:**

```
{
  tools: {
    policy: {
      allow: ["read", "write", "exec"],
      deny: ["browser", "nodes"]
    },
    byModelProvider: {
      "xai": { deny: ["web_search"] }  // avoid duplicate xAI native tool
    },
    subagents: {
      policy: {
        allow: ["read", "message", "sessions_send"],
        deny: ["exec", "browser", "nodes"]
      }
    }
  },
  agents: {
    list: [
      {
        id: "main",
        sandbox: {
          mode: "non-main",
          tools: {
            allow: ["bash", "process", "read", "write"],
            deny: ["browser", "canvas", "nodes", "cron"]
          }
        }
      }
    ]
  }
}
```

Sources: [src/agents/pi-tools.policy.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.policy.ts#L1-L100)[src/agents/tool-policy-pipeline.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-policy-pipeline.ts#L1-L100)[README.md333-338](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L333-L338)

### Owner-Only Tools

Certain tools require `senderIsOwner` flag:

- `system.run` with elevated permissions
- `gateway.*` configuration RPCs
- `/restart` command in groups

Owner status is derived from:

- Channel allowlist membership (`channels.<channel>.allowFrom`)
- Group admin status (where applicable)
- Device pairing credentials

Sources: [src/agents/tool-policy.ts54-70](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-policy.ts#L54-L70)[src/agents/openclaw-tools.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/openclaw-tools.ts#L1-L100)

---

## Audit and Compliance

### Logging and Redaction

**Log levels:**

- `silent`, `fatal`, `error`, `warn`, `info`, `debug`, `trace`

**Redaction modes:**

- `off`: No redaction
- `tools`: Redact sensitive tool arguments and config fields (default)

**Redaction implementation:**

```
{
  logging: {
    level: "info",
    redactSensitive: "tools",         // off | tools
    redactPatterns: [
      "sk-[a-zA-Z0-9]{32,}",          // API keys
      "\\d{3}-\\d{2}-\\d{4}"          // SSNs (custom)
    ]
  }
}
```

Sensitive fields are marked with `.register(sensitive)` in Zod schemas and automatically redacted in structured logs.

Sources: [src/config/zod-schema.ts16](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L16-L16)[src/logging/redact.ts1-50](https://github.com/openclaw/openclaw/blob/8873e13f/src/logging/redact.ts#L1-L50)[CHANGELOG.md125](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L125-L125)

### Dependency Audits

Recent security patches (v2026.3.3):

- Pinned `hono@4.12.5` and `@hono/node-server@1.19.10` (transitive Hono vulnerabilities)
- Bumped `tar@7.5.10` (hardlink path traversal - `GHSA-qffp-2rhf-9h96`)

```
{
  "pnpm": {
    "overrides": {
      "hono": "4.12.5",
      "@hono/node-server": "1.19.10",
      "tar": "7.5.10"
    }
  }
}
```

Sources: [CHANGELOG.md86-87](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L86-L87)[package.json414-428](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L414-L428)

### Audit Checks

The `openclaw doctor` command includes security audit checks:

- **DM policy misconfigurations**: Warns on `dmPolicy: "open"` without `allowFrom: ["*"]`
- **Group policy warnings**: Detects missing or unsafe group allowlists
- **Credential permissions**: Verifies `0600` on sensitive files
- **Gateway auth consistency**: Ensures auth mode matches bind/Tailscale config
- **Prototype pollution guards**: Uses own-property checks for account IDs

```
openclaw doctor                # run audit
openclaw doctor --fix          # apply repairs
openclaw doctor --yes          # auto-confirm fixes
```

Sources: [CHANGELOG.md91](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L91-L91)[src/cli/commands/doctor.ts1-100](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/commands/doctor.ts#L1-L100)

---

## Security Best Practices

1. **Start with pairing**: Use `dmPolicy: "pairing"` for DMs unless you have a specific reason for `allowlist` or `open`.
2. **Sandbox non-main sessions**: Set `agents.defaults.sandbox.mode: "non-main"` to isolate groups/channels.
3. **Use SecretRef for credentials**: Never commit plain API keys to config files.
4. **Enable gateway auth**: Set `gateway.auth.mode: "token"` when binding beyond loopback.
5. **Review tool policies**: Start with minimal tool allowlists and expand as needed.
6. **Monitor logs**: Enable `logging.redactSensitive: "tools"` and review `openclaw logs`.
7. **Keep dependencies updated**: Run `openclaw update` regularly and review `CHANGELOG.md`.
8. **Restrict media roots**: Use `mediaLocalRoots` to limit file attachment sources.
9. **Validate webhook payloads**: Never enable `hooks.*.allowUnsafeExternalContent` in production.
10. **Use Docker + UFW on VPS**: Follow [VPS hardening guidance](https://docs.openclaw.ai/gateway/security#docker--ufw-policy) for public-facing deployments.

Sources: [README.md112-125](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L112-L125)[docs/gateway/security.md1-100](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/security.md#L1-L100)[CHANGELOG.md129-130](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L129-L130)

---

# Access-Control-Policies

# Security Audit
Relevant source files
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/discord.md)
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/telegram.md)
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration-reference.md)
- [src/acp/control-plane/manager.core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/acp/control-plane/manager.core.ts)
- [src/agents/pi-embedded-runner/tool-result-char-estimator.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-char-estimator.ts)
- [src/agents/pi-embedded-runner/tool-result-context-guard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner/tool-result-context-guard.ts)
- [src/agents/tools/telegram-actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.test.ts)
- [src/agents/tools/telegram-actions.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tools/telegram-actions.ts)
- [src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/agent-runner.runreplyagent.e2e.test.ts)
- [src/auto-reply/reply/normalize-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/reply/normalize-reply.ts)
- [src/auto-reply/skill-commands.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.test.ts)
- [src/auto-reply/skill-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/skill-commands.ts)
- [src/auto-reply/tokens.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.test.ts)
- [src/auto-reply/tokens.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/auto-reply/tokens.ts)
- [src/channels/allowlists/resolve-utils.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.test.ts)
- [src/channels/allowlists/resolve-utils.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/allowlists/resolve-utils.ts)
- [src/channels/draft-stream-loop.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/draft-stream-loop.ts)
- [src/channels/plugins/actions/actions.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/actions.test.ts)
- [src/channels/plugins/actions/telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/channels/plugins/actions/telegram.ts)
- [src/config/schema.help.quality.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.quality.test.ts)
- [src/config/schema.help.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.help.ts)
- [src/config/schema.labels.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/schema.labels.ts)
- [src/config/types.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.agent-defaults.ts)
- [src/config/types.discord.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.discord.ts)
- [src/config/types.telegram.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.telegram.ts)
- [src/config/zod-schema.agent-defaults.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.agent-defaults.ts)
- [src/config/zod-schema.providers-core.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.providers-core.ts)
- [src/discord/monitor.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.test.ts)
- [src/discord/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor.ts)
- [src/discord/monitor/listeners.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.test.ts)
- [src/discord/monitor/listeners.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/listeners.ts)
- [src/discord/monitor/provider.allowlist.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.test.ts)
- [src/discord/monitor/provider.allowlist.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.allowlist.ts)
- [src/discord/monitor/provider.skill-dedupe.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.skill-dedupe.test.ts)
- [src/discord/monitor/provider.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.test.ts)
- [src/discord/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/discord/monitor/provider.ts)
- [src/imessage/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/imessage/monitor.ts)
- [src/signal/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/signal/monitor.ts)
- [src/slack/monitor.tool-result.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.tool-result.test.ts)
- [src/slack/monitor.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor.ts)
- [src/slack/monitor/provider.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/slack/monitor/provider.ts)
- [src/telegram/bot-handlers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-handlers.ts)
- [src/telegram/bot-message-context.dm-threads.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.dm-threads.test.ts)
- [src/telegram/bot-message-context.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-context.ts)
- [src/telegram/bot-message-dispatch.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.test.ts)
- [src/telegram/bot-message-dispatch.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-message-dispatch.ts)
- [src/telegram/bot-native-commands.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot-native-commands.ts)
- [src/telegram/bot.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.test.ts)
- [src/telegram/bot.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot.ts)
- [src/telegram/bot/delivery.replies.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.replies.ts)
- [src/telegram/bot/delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.test.ts)
- [src/telegram/bot/delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/delivery.ts)
- [src/telegram/bot/helpers.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.test.ts)
- [src/telegram/bot/helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/bot/helpers.ts)
- [src/telegram/draft-stream.test-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test-helpers.ts)
- [src/telegram/draft-stream.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.test.ts)
- [src/telegram/draft-stream.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/draft-stream.ts)
- [src/telegram/lane-delivery.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.test.ts)
- [src/telegram/lane-delivery.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/lane-delivery.ts)
- [src/telegram/send.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.test.ts)
- [src/telegram/send.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/telegram/send.ts)
- [src/web/auto-reply.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/auto-reply.ts)
- [src/web/inbound.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.test.ts)
- [src/web/inbound.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/inbound.ts)
- [src/web/vcard.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/web/vcard.ts)

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

Sources: [docs/cli/security.md1-73](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/security.md#L1-L73)

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

Sources: [src/security/audit.ts54-83](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L54-L83)

### `SecurityAuditOptions`

`runSecurityAudit` accepts a `SecurityAuditOptions` object:
FieldTypePurpose`config``OpenClawConfig`Parsed gateway config`env``NodeJS.ProcessEnv`Environment variables (for token/secret resolution)`platform``NodeJS.Platform`Platform override (default: `process.platform`)`deep``boolean`Enable live Gateway probe`includeFilesystem``boolean`Run filesystem permission checks`includeChannelSecurity``boolean`Run channel allowlist security checks`stateDir``string`Override default state directory path`configPath``string`Override default config file path`deepTimeoutMs``number`Timeout for deep Gateway probe`plugins``ChannelPlugin[]`DI for tests`probeGatewayFn``typeof probeGateway`DI for tests`execIcacls``ExecFn`DI for Windows ACL checks`execDockerRawFn``typeof execDockerRaw`DI for Docker label checks
Sources: [src/security/audit.ts85-106](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L85-L106)

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

Sources: [src/security/audit.ts1-52](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L1-L52)[src/security/audit-extra.ts1-39](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.ts#L1-L39)

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

Sources: [src/security/audit-extra.ts1-39](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.ts#L1-L39)[src/security/audit-extra.sync.ts1-15](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts#L1-L15)

---

## Check Categories

Each finding has a `checkId` that follows a dot-separated namespace. The following table covers all checkId categories, their source collector functions, and typical severities.

### Gateway Configuration Checks

Produced by `collectGatewayConfigFindings` in [src/security/audit.ts262-551](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L262-L551)
`checkId`SeverityCondition`gateway.bind_no_auth`criticalNon-loopback bind with no auth token/password`gateway.loopback_no_auth`criticalLoopback bind + Control UI enabled + no auth configured`gateway.trusted_proxies_missing`warnLoopback bind + Control UI enabled + `trustedProxies` is empty`gateway.auth_no_rate_limit`warnNon-loopback bind with no `auth.rateLimit` configured`gateway.tools_invoke_http.dangerous_allow`warn / critical`gateway.tools.allow` re-enables tools from the default HTTP deny list`gateway.token_too_short`warnAuth token length < 24 characters`gateway.control_ui.allowed_origins_required`criticalNon-loopback Control UI without explicit `allowedOrigins``gateway.control_ui.host_header_origin_fallback`warn / critical`dangerouslyAllowHostHeaderOriginFallback=true``gateway.control_ui.insecure_auth`warn`allowInsecureAuth=true``gateway.control_ui.device_auth_disabled`critical`dangerouslyDisableDeviceAuth=true``gateway.real_ip_fallback_enabled`warn / critical`allowRealIpFallback=true``gateway.tailscale_funnel`critical`tailscale.mode="funnel"``gateway.tailscale_serve`info`tailscale.mode="serve"``gateway.trusted_proxy_auth`critical`auth.mode="trusted-proxy"` (informational reminder)`gateway.trusted_proxy_no_proxies`criticalTrusted-proxy mode with empty `trustedProxies``gateway.trusted_proxy_no_user_header`criticalTrusted-proxy mode without `userHeader``gateway.trusted_proxy_no_allowlist`warnTrusted-proxy mode with empty `allowUsers``discovery.mdns_full_mode`warn / critical`discovery.mdns.mode="full"``config.insecure_or_dangerous_flags`warnAny enabled `dangerous*`/`dangerously*` config flag
The severity of several gateway checks escalates from `warn` to `critical` when `gateway.bind` is not `loopback` or when Tailscale Funnel is active.

Sources: [src/security/audit.ts262-551](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L262-L551)

### Filesystem Permission Checks

Produced by `collectFilesystemFindings`, enabled only when `includeFilesystem=true`.
`checkId`SeverityCondition`fs.state_dir.symlink`warnState directory is a symlink`fs.state_dir.perms_world_writable`criticalState dir world-writable`fs.state_dir.perms_group_writable`warnState dir group-writable`fs.state_dir.perms_readable`warnState dir group- or world-readable`fs.config.symlink`warnConfig file is a symlink`fs.config.perms_writable`criticalConfig file world- or group-writable`fs.config.perms_world_readable`criticalConfig file world-readable`fs.config.perms_group_readable`warnConfig file group-readable`fs.synced_dir`warnState or config path looks like a cloud-synced folder
On Windows, filesystem permissions are evaluated using `icacls` via the injected `execIcacls` function rather than POSIX mode bits. Symlink targets are resolved before evaluating config file permissions; if the config is a symlink, readable-permission warnings are suppressed since the target path is responsible.

Sources: [src/security/audit.ts131-260](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L131-L260)[src/security/audit-extra.sync.ts507-522](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts#L507-L522)

### Browser Control Checks

Produced by `collectBrowserControlFindings` in [src/security/audit.ts582-706](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L582-L706)
`checkId`SeverityCondition`browser.control_invalid_config`warn`resolveBrowserConfig` throws`browser.control_no_auth`criticalBrowser enabled, no gateway auth token/password`browser.remote_cdp_http`warnRemote CDP URL uses `http://` instead of `https://`
### Attack Surface Summary

Produced by `collectAttackSurfaceSummaryFindings` in [src/security/audit-extra.sync.ts477-505](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts#L477-L505)
`checkId`SeverityAlways emitted?`summary.attack_surface`infoYes
The detail field includes counts of open/allowlist group policies, `tools.elevated` state, hooks state, browser control state, and a reminder of the personal-assistant trust model.

### Exposure Matrix Checks

Produced by `collectExposureMatrixFindings` in [src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts)
`checkId`SeverityCondition`security.exposure.open_groups_with_elevated`criticalOpen group policies with elevated tools enabled`security.exposure.open_groups_with_runtime_or_fs`critical / warnOpen groups with exec/fs tools accessible without sandbox/workspace guards`security.trust_model.multi_user_heuristic`warnConfig signals suggest likely multi-user ingress
### Tool Policy Checks

Produced by `collectMinimalProfileOverrideFindings` and related collectors.
`checkId`SeverityCondition`tools.profile_minimal_overridden`warnGlobal `tools.profile="minimal"` overridden by per-agent profile`tools.elevated.allowFrom.<channel>.wildcard`critical`tools.elevated.allowFrom` contains `"*"` for a channel`tools.exec.host_sandbox_no_sandbox_defaults`warn`tools.exec.host="sandbox"` but default sandbox mode is `off``tools.exec.host_sandbox_no_sandbox_agents`warnPer-agent `exec.host="sandbox"` but that agent's sandbox mode is `off``tools.exec.safe_bins_interpreter_unprofiled`warnInterpreter-like bins in `safeBins` without explicit `safeBinProfiles``tools.exec.safe_bin_trusted_dirs_risky`warn`safeBinTrustedDirs` contains user-writable or world-writable paths
Sources: [src/security/audit-extra.sync.ts243-272](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts#L243-L272)[src/security/audit.test.ts304-487](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.test.ts#L304-L487)

### Sandbox Configuration Checks
`checkId`SeverityCondition`sandbox.docker_config_mode_off`warnDocker config is set but `sandbox.mode="off"` on all agents`sandbox.dangerous_bind_mount`critical`binds` contains paths from `BLOCKED_HOST_PATHS` (e.g. `/etc`, `/proc`, Docker socket)`sandbox.dangerous_network_mode`critical`network="host"` or `"container:<id>"` namespace join`sandbox.dangerous_seccomp_profile`critical`seccompProfile="unconfined"``sandbox.dangerous_apparmor_profile`critical`apparmorProfile="unconfined"``sandbox.browser_container.hash_label_missing`warnRunning sandbox browser container missing `openclaw.browserConfigEpoch` label`sandbox.browser_container.hash_epoch_stale`warnBrowser container has an outdated security epoch label`sandbox.browser_container.non_loopback_publish`criticalBrowser container published port is bound to non-loopback address`sandbox.browser_cdp_bridge_unrestricted`warnSandbox browser uses Docker `bridge` network without `cdpSourceRange`
The sandbox Docker validation constants (`BLOCKED_HOST_PATHS`) are defined in [src/agents/sandbox/validate-sandbox-security.ts18-33](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/sandbox/validate-sandbox-security.ts#L18-L33) and shared between the runtime sandbox creation code and the audit collectors.

Sources: [src/security/audit.test.ts618-985](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.test.ts#L618-L985)[src/security/audit-extra.sync.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts)

### Hooks Hardening Checks

Produced by `collectHooksHardeningFindings`.
`checkId`SeverityCondition`hooks.token_too_short`warn`hooks.token` length < 24`hooks.request_session_key_enabled`warn / critical`hooks.allowRequestSessionKey=true``hooks.request_session_key_prefixes_missing`warn / criticalSession key override enabled without `allowedSessionKeyPrefixes`
Sources: [src/security/audit-extra.sync.ts554-552](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts#L554-L552)

### Model Hygiene Checks
`checkId`SeverityCondition`models.small_params`critical / infoModel has ≤ 300B inferred parameters with web/browser tools enabled; severity degrades to `info` when sandbox mode is `all``models.legacy`warnModel matches legacy patterns (GPT-3.5, Claude 2, etc.)
Sources: [src/security/audit-extra.sync.ts154-159](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts#L154-L159)[src/security/audit.test.ts780-820](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.test.ts#L780-L820)

### Node Command Policy Checks
`checkId`SeverityCondition`gateway.nodes.deny_commands_ineffective`warn`denyCommands` entries use glob patterns or unknown command names (matching is exact)`gateway.nodes.allow_commands_dangerous`warn / critical`allowCommands` enables sensitive commands (camera, screen, contacts, etc.)
Sources: [src/security/audit.test.ts987-1059](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.test.ts#L987-L1059)

### Secrets and Config Flag Checks
`checkId`SeverityCondition`config.secrets.gateway_password_in_config`warn`gateway.auth.password` set in config file (not env ref)`config.secrets.hooks_token_in_config`info`hooks.token` set in config file`config.insecure_or_dangerous_flags`warnAny known insecure/dangerous debug flag is `true``logging.redact_off`warn`logging.redactSensitive="off"`
Sources: [src/security/audit-extra.sync.ts524-552](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts#L524-L552)[src/security/audit.test.ts1189-1212](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.test.ts#L1189-L1212)

### Plugin and Skill Checks
`checkId`SeverityCondition`plugins.tools_reachable_permissive_policy`warnExtension plugin tools reachable under permissive tool policy
Sources: [src/security/audit-extra.ts31-39](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.ts#L31-L39)

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

Sources: [src/security/audit.ts1-52](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L1-L52)[src/security/audit-extra.ts1-39](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.ts#L1-L39)

---

## Severity Escalation Logic

Several checks use the gateway's network exposure to decide between `warn` and `critical`. The `isGatewayRemotelyExposed` helper in [src/security/audit-extra.sync.ts90-97](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit-extra.sync.ts#L90-L97) returns `true` when:

- `gateway.bind` is not `loopback`, **or**
- `gateway.tailscale.mode` is `"serve"` or `"funnel"`

The `isStrictLoopbackTrustedProxyEntry` helper in [src/security/audit.ts555-580](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L555-L580) provides a stricter check for trusted proxy entries, treating only `127.0.0.1` and `::1` (with full /32 or /128 prefix) as loopback.

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

The auth for the probe is resolved via `resolveGatewayProbeAuth` from [src/gateway/probe-auth.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/gateway/probe-auth.ts)

Sources: [src/security/audit.ts74-83](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.ts#L74-L83)

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

Sources: [docs/cli/security.md58-73](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/security.md#L58-L73)

---

## Finding Prioritization

The audit report's `summary` field counts findings by severity. When remediating, the documentation recommends the following priority order:

1. **Critical + open access + tools enabled** — lock down DM/group policies first
2. **Public network exposure** — LAN bind, Tailscale Funnel, missing auth
3. **Browser control remote exposure** — treat as equivalent to operator access
4. **Filesystem permissions** — state dir, config, credentials, session files
5. **Plugins/extensions** — load only trusted, explicitly allowlisted plugins
6. **Model choice** — prefer instruction-hardened models for tool-enabled agents

Sources: [docs/gateway/security/index.md212-220](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/security/index.md#L212-L220)

---

## checkId Quick Reference

The table below consolidates the high-signal `checkId` values with their associated config keys for remediation.
`checkId`SeverityConfig key to fix`fs.state_dir.perms_world_writable`criticalfilesystem perms on `~/.openclaw``fs.config.perms_writable`criticalfilesystem perms on `openclaw.json``fs.config.perms_world_readable`criticalfilesystem perms on `openclaw.json``gateway.bind_no_auth`critical`gateway.bind`, `gateway.auth.*``gateway.loopback_no_auth`critical`gateway.auth.*``gateway.tools_invoke_http.dangerous_allow`warn/critical`gateway.tools.allow``gateway.nodes.allow_commands_dangerous`warn/critical`gateway.nodes.allowCommands``gateway.tailscale_funnel`critical`gateway.tailscale.mode``gateway.control_ui.allowed_origins_required`critical`gateway.controlUi.allowedOrigins``gateway.control_ui.device_auth_disabled`critical`gateway.controlUi.dangerouslyDisableDeviceAuth``gateway.real_ip_fallback_enabled`warn/critical`gateway.allowRealIpFallback``discovery.mdns_full_mode`warn/critical`discovery.mdns.mode``config.insecure_or_dangerous_flags`warnmultiple keys (see finding detail)`hooks.token_too_short`warn`hooks.token``hooks.request_session_key_enabled`warn/critical`hooks.allowRequestSessionKey``logging.redact_off`warn`logging.redactSensitive``sandbox.docker_config_mode_off`warn`agents.*.sandbox.mode``sandbox.dangerous_network_mode`critical`agents.*.sandbox.docker.network``sandbox.dangerous_bind_mount`critical`agents.*.sandbox.docker.binds``sandbox.browser_container.non_loopback_publish`criticalport binding in browser container`tools.exec.host_sandbox_no_sandbox_defaults`warn`tools.exec.host`, `agents.defaults.sandbox.mode``tools.exec.safe_bins_interpreter_unprofiled`warn`tools.exec.safeBins`, `tools.exec.safeBinProfiles``security.exposure.open_groups_with_elevated`critical`channels.*.groupPolicy`, `tools.elevated.*``security.trust_model.multi_user_heuristic`warnsplit trust boundaries or add sandbox/workspace scoping`tools.profile_minimal_overridden`warn`agents.list[].tools.profile``models.small_params`critical/infomodel choice + sandbox/tool policy
Sources: [docs/gateway/security/index.md227-259](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/security/index.md#L227-L259)[src/security/audit.test.ts1-1300](https://github.com/openclaw/openclaw/blob/8873e13f/src/security/audit.test.ts#L1-L1300)

---

# Sandboxing

# Sandboxing
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/concepts/system-prompt.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/concepts/system-prompt.md)
- [docs/gateway/background-process.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/background-process.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/bash-process-registry.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.test.ts)
- [src/agents/bash-process-registry.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-process-registry.ts)
- [src/agents/bash-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/bash-tools.ts)
- [src/agents/pi-embedded-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-helpers.ts)
- [src/agents/pi-embedded-runner.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts)
- [src/agents/pi-embedded-subscribe.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-subscribe.ts)
- [src/agents/pi-tools.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/agents/system-prompt.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.test.ts)
- [src/agents/system-prompt.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

**Purpose**: OpenClaw provides Docker-based sandboxing for tool execution to isolate untrusted agent sessions from the host system. Sandboxing prevents arbitrary code execution on the host for group chat sessions, external hook triggers, or any scenario where you want to restrict agent access to host resources.

**Scope**: This page covers sandbox configuration, architecture, tool filtering, setup procedures, and security guarantees. For broader security policies including DM/group access control, see [Access Control Policies](/openclaw/openclaw/7.1-access-control-policies). For configuration reference, see the [Configuration Reference](https://github.com/openclaw/openclaw/blob/8873e13f/Configuration Reference)

---

## Sandbox Configuration

Sandboxing is controlled via `agents.defaults.sandbox` (or per-agent overrides). The sandbox system uses Docker containers to execute tools in isolated environments.

### Sandbox Modes
ModeBehavior`off` (default)All sessions run on the host. No isolation.`non-main`Group chats, hook-driven sessions, and non-DM sessions run in Docker. Main DM sessions run on host.`all`All agent sessions run in Docker, including main DM sessions.
### Sandbox Scope
ScopeContainer Lifecycle`session`One container per session key. Container persists for session duration.`agent`One container per agent ID. All sessions for that agent share the container.`shared`Single shared container for all sandboxed sessions.
### Configuration Example

```
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "agent",
      },
    },
  },
}
```

**Sources**: [src/config/zod-schema.ts209-219](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts#L209-L219)[docs/gateway/configuration.md206-225](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L206-L225)[README.md333-338](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L333-L338)

---

## Sandbox Architecture

### High-Level Integration

```
Execution Context

Tool Provisioning

Agent Execution Pipeline

Gateway

Message Router

Session Resolver

runReplyAgent

runAgentTurnWithFallback

runEmbeddedPiAgent

runEmbeddedAttempt

createOpenClawCodingTools

buildEmbeddedSandboxInfo

applyToolPolicyPipeline

Host Execution
exec, read, write

Sandboxed Execution
Docker container

Docker Container
isolated filesystem
restricted network
```

**Sources**: [src/agents/pi-embedded-runner.ts1-29](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts#L1-L29)[src/agents/pi-tools.ts258-262](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L258-L262)

### Sandbox Context Resolution Flow

```
mode=all OR
(mode=non-main AND
session!=main)

mode=off OR
(mode=non-main AND
session=main)

Load Config
sandbox.mode
sandbox.scope

Check Session Type
main vs non-main

Enable
Sandbox?

buildEmbeddedSandboxInfo

SandboxContext
{enabled: true}

SandboxContext
{enabled: false}
```

**Sources**: [src/agents/pi-embedded-runner.ts20](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-embedded-runner.ts#L20-L20)[src/agents/pi-tools.ts260](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L260-L260)

---

## Tool Filtering and Policy

When sandboxing is enabled, tools are filtered through a hierarchical policy system that restricts access to host-only capabilities.

### Default Sandbox Tool Policy

**Allowed tools** (safe in containers):

- `bash` / `exec` - Command execution inside container
- `process` - Process management within container
- `read` - File reads (container filesystem)
- `write` - File writes (container filesystem)
- `edit` - File edits (container filesystem)
- `apply_patch` - Multi-file patches (container filesystem)
- `sessions_list`, `sessions_history`, `sessions_send`, `sessions_spawn` - Session coordination tools

**Denied tools** (require host access):

- `browser` - Requires host Chrome/CDP connection
- `canvas` - Requires host window manager
- `nodes` - Requires paired physical devices
- `cron` - Requires host cron scheduler
- `discord`, `slack`, `telegram` - Require host channel connections
- `gateway` - Requires host Gateway RPC access

### Tool Provisioning Logic

```
false or null

true

createOpenClawCodingTools
(sandbox param)

sandbox.enabled?

Provision Full Tool Set
exec, browser, nodes,
canvas, cron, etc.

Provision Filtered Tools
exec (containerized),
read/write/edit (container fs)

Global Tool Policy
tools.policy

Agent Tool Policy
agents[id].tools.policy

Group Tool Policy
channels[].groups[].tools

Sandbox Policy
(implicit denylist)

Final Tool Array
```

**Sources**: [src/agents/pi-tools.ts258-311](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L258-L311)[src/agents/pi-tools.policy.ts1-28](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.policy.ts#L1-L28)[src/agents/tool-policy-pipeline.ts1-52](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-policy-pipeline.ts#L1-L52)

### Tool Policy Resolution

Tool policy is evaluated in this order:

1. **Global policy** (`tools.policy` or `tools.allowTools`/`denyTools`)
2. **Agent policy** (`agents[id].tools.policy`)
3. **Provider-specific policy** (`agents[id].models[provider].tools`)
4. **Group policy** (`channels[].groups[].tools`)
5. **Subagent policy** (depth-based restrictions)
6. **Sandbox policy** (implicit deny for host-only tools)

Each layer can further restrict tools but cannot grant tools denied by an earlier layer.

**Sources**: [src/agents/pi-tools.ts261-310](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/pi-tools.ts#L261-L310)[src/agents/tool-policy.ts1-58](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/tool-policy.ts#L1-L58)

---

## Sandbox Setup and Operations

### Building the Sandbox Image

Before enabling sandboxing, you must build the Docker image:

```
scripts/sandbox-setup.sh
```

This script:

1. Creates a Dockerfile with Node.js, Git, and common dev tools
2. Builds the image tagged as `openclaw-sandbox`
3. Verifies the image is ready

The image includes:

- Node.js (matching your host version)
- Git, curl, jq, and other common CLI tools
- Workspace directory structure

### CLI Commands

```
# List active sandbox containers
openclaw sandbox list
 
# Recreate sandbox container for a session
openclaw sandbox recreate --session agent:main:whatsapp:group:123
 
# Explain sandbox status for current config
openclaw sandbox explain
```

### Container Lifecycle

Containers are created on-demand when the first sandboxed tool is executed for a session. Container behavior depends on `sandbox.scope`:

- **`session` scope**: Container is destroyed when the session is reset or deleted
- **`agent` scope**: Container persists across session resets, destroyed only when agent is removed
- **`shared` scope**: Single container persists indefinitely (manual cleanup required)

**Sources**: [docs/cli/index.md42-43](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md#L42-L43)[README.md333-338](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L333-L338)

---

## Security Model and Guarantees

### What Sandboxing Protects

✅ **File system isolation**: Tools cannot access host files outside the container
✅ **Process isolation**: Agent code runs in a separate process namespace
✅ **Network isolation**: Docker networking rules can restrict outbound connections
✅ **Resource limits**: Docker can enforce CPU/memory limits per container

### What Sandboxing Does Not Protect

❌ **Network exfiltration**: By default, containers have network access (can call external APIs)
❌ **Model prompt injection**: Sandboxing does not prevent prompt injection attacks
❌ **Gateway RPC abuse**: Sandboxed sessions can still call Gateway RPC methods (if `gateway` tool is enabled)
❌ **Side-channel attacks**: Container escape exploits or kernel vulnerabilities

### Recommended Security Posture

For untrusted input scenarios (groups, webhooks, public bots):

1. **Enable sandboxing**: Set `sandbox.mode: "non-main"` or `"all"`
2. **Restrict tools**: Use explicit tool allowlists, deny `gateway` tool
3. **Network isolation**: Configure Docker network policies to block egress
4. **Monitor sessions**: Review `openclaw sessions` output for suspicious activity
5. **Use strong models**: Stronger models are more resistant to prompt injection

**Sources**: [README.md333-338](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L333-L338)[docs/gateway/configuration.md206-225](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L206-L225)

---

## Sandbox Information in System Prompt

When a session runs in a sandbox, the system prompt includes sandbox metadata so the agent knows it's running in a restricted environment:

```
buildAgentSystemPrompt

sandboxInfo param

Runtime Environment section

Agent sees:
'Sandboxed runtime:
Docker container'
```

This allows the agent to adjust behavior (e.g., not attempt browser or node tool use).

**Sources**: [src/agents/system-prompt.ts229](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L229-L229)[src/agents/system-prompt.ts238](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/system-prompt.ts#L238-L238)

---

## Summary

OpenClaw's sandboxing system provides Docker-based isolation for tool execution, protecting the host from untrusted agent code in group chats, webhooks, and other scenarios. Sandboxing is configured via `agents.defaults.sandbox.mode` (`off`/`non-main`/`all`) and `scope` (`session`/`agent`/`shared`), with tool filtering applied automatically to deny host-only capabilities like browser control and device access. Setup requires building the `openclaw-sandbox` Docker image via `scripts/sandbox-setup.sh`, and sandboxed sessions are managed through the `openclaw sandbox` CLI commands. While sandboxing provides strong file system and process isolation, it does not prevent network exfiltration or prompt injection attacks, so additional tool restrictions and network policies are recommended for untrusted input scenarios.

---

# Development

# Development Guide
Relevant source files
- [.github/actionlint.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actionlint.yaml)
- [.github/actions/setup-node-env/action.yml](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-node-env/action.yml)
- [.github/actions/setup-pnpm-store-cache/action.yml](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-pnpm-store-cache/action.yml)
- [.github/workflows/ci.yml](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml)
- [.shellcheckrc](https://github.com/openclaw/openclaw/blob/8873e13f/.shellcheckrc)
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/channels/irc.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/irc.md)
- [docs/ci.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/ci.md)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [docs/tools/creating-skills.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/creating-skills.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/check-composite-action-input-interpolation.py](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/check-composite-action-input-interpolation.py)
- [scripts/ci-changed-scope.mjs](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/ci-changed-scope.mjs)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [src/infra/outbound/abort.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/outbound/abort.ts)
- [src/plugins/source-display.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugins/source-display.test.ts)
- [src/plugins/source-display.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugins/source-display.ts)
- [src/scripts/ci-changed-scope.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/scripts/ci-changed-scope.test.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

This page covers the contributor and maintainer workflow for the OpenClaw monorepo: repository structure, toolchain setup, coding conventions, testing, commit and PR conventions, and local development commands. For CI/CD pipeline details see page [8.1](/openclaw/openclaw/8.1-cicd-pipeline). For release steps see page [8.2](/openclaw/openclaw/8.2-release-process).

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

Sources: [AGENTS.md10-22](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L10-L22)

---

## Toolchain & Prerequisites
ToolMinimum VersionNotesNode.js22+Required runtime baselinepnpm10.23.0Primary package manager; use lockfileBun1.3.9+Preferred for TypeScript execution and testsPython3.12Used for skill scripts (`skills/`) and CI tooling
Both Node and Bun paths must stay functional. `pnpm-lock.yaml` and Bun patching must be kept in sync when touching deps.

Sources: [AGENTS.md57-64](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L57-L64)

---

## Local Development Commands

These are the primary commands used during development. All commands run from the repo root.
CommandPurpose`pnpm install`Install all dependencies (uses lockfile)`pnpm openclaw ...`Run CLI in dev mode (via Bun)`pnpm dev`Alias for dev CLI run`pnpm build`Type-check and build `dist/``pnpm tsgo`TypeScript checks only`pnpm check`Types + lint + format (Oxlint + Oxfmt)`pnpm format`Check formatting only (oxfmt --check)`pnpm format:fix`Fix formatting in place (oxfmt --write)`pnpm test`Run all tests (Vitest)`pnpm test:coverage`Tests with V8 coverage report`pnpm release:check`Validate npm pack contents`prek install`Install pre-commit hooks (same checks as CI)
The `pnpm check` command must pass before commits. It runs the same type/lint/format checks as the CI `check` job.

**Key dev scripts:**

- Mac packaging: `scripts/package-mac-app.sh` (defaults to current arch)
- Commit helper: `scripts/committer "<msg>" <file...>` (scopes staging correctly)
- Release validation: `node --import tsx scripts/release-check.ts`

Sources: [AGENTS.md55-71](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L55-L71)[docs/reference/RELEASING.md44-56](https://github.com/openclaw/openclaw/blob/8873e13f/docs/reference/RELEASING.md#L44-L56)

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

Sources: [AGENTS.md73-84](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L73-L84)[AGENTS.md14-18](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L14-L18)

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

Sources: [AGENTS.md94-104](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L94-L104)[.github/workflows/ci.yml186-241](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L186-L241)

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

Sources: [AGENTS.md106-114](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L106-L114)[.github/workflows/labeler.yml39-127](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/labeler.yml#L39-L127)

---

## Multi-Agent Safety Rules

When multiple agents work the same repository simultaneously:

- Do **not** create, apply, or drop `git stash` entries unless explicitly requested (this includes `git pull --rebase --autostash`).
- Do **not** create, remove, or modify `git worktree` checkouts.
- Do **not** switch branches unless explicitly requested.
- When told "push", you may `git pull --rebase` to integrate latest changes; never discard other agents' work.
- When told "commit", scope to your changes only. When told "commit all", commit in grouped chunks.
- Running multiple agents is fine as long as each has its own session.

Sources: [AGENTS.md187-198](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L187-L198)

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
Sources: [AGENTS.md22](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L22-L22)[.github/labeler.yml1-20](https://github.com/openclaw/openclaw/blob/8873e13f/.github/labeler.yml#L1-L20)[scripts/sync-labels.ts10-18](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/sync-labels.ts#L10-L18)

---

## Version Locations

When bumping a version, update **all** of the following locations (never update `appcast.xml` unless cutting a new macOS Sparkle release):
FileField`package.json``version``apps/android/app/build.gradle.kts``versionName`, `versionCode``apps/ios/Sources/Info.plist``CFBundleShortVersionString`, `CFBundleVersion``apps/ios/Tests/Info.plist``CFBundleShortVersionString`, `CFBundleVersion``apps/macos/Sources/OpenClaw/Resources/Info.plist``CFBundleShortVersionString`, `CFBundleVersion``docs/install/updating.md`Pinned npm version
Sources: [AGENTS.md179-180](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L179-L180)

---

## Release Channels
ChannelTag Formatnpm dist-tagNotes`stable``vYYYY.M.D``latest`Tagged releases only`beta``vYYYY.M.D-beta.N``beta`May ship without macOS app`dev`(none)—Moving HEAD on `main`
For beta releases: publish npm with a matching beta version suffix (e.g., `YYYY.M.D-beta.N`), not just `--tag beta` with a plain version number.

Sources: [AGENTS.md87-91](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L87-L91)

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

Sources: [AGENTS.md55-115](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L55-L115)[.github/workflows/ci.yml1-30](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L1-L30)

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

Sources: [AGENTS.md55-84](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L55-L84)[AGENTS.md172-173](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L172-L173)[.github/workflows/ci.yml127-150](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L127-L150)

---

## Shorthand Commands
ShorthandBehavior`sync`If working tree dirty, commit all changes with a Conventional Commit message, then `git pull --rebase`. If rebase conflicts cannot be resolved, stop. Otherwise `git push`.
### Git Notes

- If `git branch -d/-D <branch>` is policy-blocked, delete the local ref directly:`git update-ref -d refs/heads/<branch>`
- Bulk PR close/reopen safety: if a close action would affect more than 5 PRs, ask for explicit confirmation with the exact count and target scope before proceeding.

Sources: [AGENTS.md117-123](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L117-L123)

---

## Documentation Guidelines

Docs live in `docs/` and are hosted on Mintlify at `docs.openclaw.ai`.

- Internal doc links: root-relative, no `.md`/`.mdx` extension. Example: `<FileRef file-url="https://github.com/openclaw/openclaw/blob/8873e13f/Config" undefined  file-path="Config">Hii</FileRef>`
- Anchors: root-relative path with anchor. Example: `<FileRef file-url="https://github.com/openclaw/openclaw/blob/8873e13f/Hooks" undefined  file-path="Hooks">Hii</FileRef>`
- Avoid em dashes (`—`) and apostrophes in headings — they break Mintlify anchor links.
- README (GitHub): use absolute `https://docs.openclaw.ai/...` URLs so links work on GitHub.
- Content must be generic: no personal device names, hostnames, or paths. Use placeholders like `user@gateway-host`.
- `docs/zh-CN/**` is auto-generated. Do not edit unless explicitly asked.

Sources: [AGENTS.md24-43](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L24-L43)

---

## Secret Scanning & Security

- Secrets are scanned on every CI run using `detect-secrets` against `.secrets.baseline`.
- Private keys are detected by `pre-commit run --all-files detect-private-key`.
- Changed GitHub workflows are audited with `zizmor`.
- Production dependencies are audited with `pnpm-audit-prod`.
- Never commit real phone numbers, videos, or live config values. Use obviously fake placeholders in docs, tests, and examples.

For the full security model and audit tooling, see page [7](/openclaw/openclaw/7-security) and page [7.1](/openclaw/openclaw/7.1-access-control-policies).

Sources: [.github/workflows/ci.yml349-401](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L349-L401)[AGENTS.md134-140](https://github.com/openclaw/openclaw/blob/8873e13f/AGENTS.md#L134-L140)

---

# CI-CD-Pipeline

# CI/CD Pipeline
Relevant source files
- [.github/actionlint.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actionlint.yaml)
- [.github/actions/setup-node-env/action.yml](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-node-env/action.yml)
- [.github/actions/setup-pnpm-store-cache/action.yml](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-pnpm-store-cache/action.yml)
- [.github/workflows/ci.yml](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml)
- [.shellcheckrc](https://github.com/openclaw/openclaw/blob/8873e13f/.shellcheckrc)
- [docs/channels/irc.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/channels/irc.md)
- [docs/ci.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/ci.md)
- [docs/tools/creating-skills.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/tools/creating-skills.md)
- [scripts/check-composite-action-input-interpolation.py](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/check-composite-action-input-interpolation.py)
- [scripts/ci-changed-scope.mjs](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/ci-changed-scope.mjs)
- [src/infra/outbound/abort.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/infra/outbound/abort.ts)
- [src/plugins/source-display.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugins/source-display.test.ts)
- [src/plugins/source-display.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/plugins/source-display.ts)
- [src/scripts/ci-changed-scope.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/scripts/ci-changed-scope.test.ts)

## Purpose and Scope

This document describes the OpenClaw continuous integration and deployment infrastructure, including the GitHub Actions workflow orchestration, intelligent scope detection that optimizes job execution, platform-specific test strategies, and caching mechanisms. For information about the release process itself (versioning, changelogs, distribution), see [Release Process](/openclaw/openclaw/8.2-release-process).

**Sources:**[.github/workflows/ci.yml1-776](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L1-L776)[docs/ci.md1-57](https://github.com/openclaw/openclaw/blob/8873e13f/docs/ci.md#L1-L57)

## Overview

The OpenClaw CI pipeline executes on every push to `main` and every pull request. The workflow uses a two-phase scope detection system to skip expensive jobs when only documentation or platform-specific code has changed. This optimization reduces CI time for most PRs while maintaining full coverage for `main` branch pushes.

The pipeline is defined in `.github/workflows/ci.yml` and consists of:

- Early scope detection gates (`docs-scope`, `changed-scope`)
- Static analysis jobs (`check`, `check-docs`, `deadcode`, `secrets`)
- Platform-specific test suites (`checks`, `checks-windows`, `macos`, `android`)
- Build and release validation (`build-artifacts`, `release-check`)
- Python skill validation (`skills-python`)

**Sources:**[.github/workflows/ci.yml1-12](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L1-L12)[.github/workflows/ci.yml139-776](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L139-L776)

## Scope Detection System

### Two-Phase Detection

The CI uses a two-stage detection system to determine which jobs should run:

```
yes

no

Push/PR Trigger

docs-scope job

changed-scope job

docs_only == true?

Skip: checks, build-artifacts,
macos, android, windows

Run: check, check-docs, secrets

Scope outputs:
run_node, run_macos,
run_android, run_windows,
run_skills_python

Jobs check scope outputs
via needs.changed-scope.outputs
```

**Phase 1: docs-scope**

The `docs-scope` job ([.github/workflows/ci.yml15-36](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L15-L36)) runs first and detects if all changes are documentation-only using the `detect-docs-changes` action. It outputs `docs_only` and `docs_changed` flags that downstream jobs reference.

**Phase 2: changed-scope**

If not docs-only, the `changed-scope` job ([.github/workflows/ci.yml41-77](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L41-L77)) analyzes the git diff to determine which platform-specific jobs should run. It invokes `scripts/ci-changed-scope.mjs` with the base and head commits.

**Sources:**[.github/workflows/ci.yml15-77](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L15-L77)[scripts/ci-changed-scope.mjs1-167](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/ci-changed-scope.mjs#L1-L167)

### Scope Detection Logic

The `detectChangedScope` function in `scripts/ci-changed-scope.mjs` examines changed file paths against regex patterns to set boolean flags:

```
Changed file paths
(from git diff)

Pattern Matching

NODE_SCOPE_RE
src/, test/, extensions/,
packages/, scripts/, ui/,
.github/, config files

MACOS_NATIVE_RE
apps/macos/, apps/ios/,
apps/shared/, Swabble/

ANDROID_NATIVE_RE
apps/android/,
apps/shared/

WINDOWS_SCOPE_RE
(NODE_SCOPE_RE subset +
specific CI files)

SKILLS_PYTHON_SCOPE_RE
skills/

run_node: boolean
run_macos: boolean
run_android: boolean
run_windows: boolean
run_skills_python: boolean
```

Key patterns defined in [scripts/ci-changed-scope.mjs6-17](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/ci-changed-scope.mjs#L6-L17):

- `DOCS_PATH_RE`: matches `docs/` and `*.md` files
- `NODE_SCOPE_RE`: matches Node/TypeScript source, tests, extensions, config files
- `WINDOWS_SCOPE_RE`: narrower subset of Node scope plus CI workflow files
- `MACOS_NATIVE_RE`: matches macOS/iOS Swift code
- `ANDROID_NATIVE_RE`: matches Android Kotlin code and shared Swift code
- `SKILLS_PYTHON_SCOPE_RE`: matches `skills/` directory

The function includes special logic ([scripts/ci-changed-scope.mjs79-81](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/ci-changed-scope.mjs#L79-L81)):

- Sets `runNode=true` as a fallback if non-docs, non-native files changed
- Excludes generated protocol files from triggering macOS builds ([scripts/ci-changed-scope.mjs58-60](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/ci-changed-scope.mjs#L58-L60))

**Fail-safe behavior:** If no changed paths are detected or an error occurs, all scope flags default to `true` ([scripts/ci-changed-scope.mjs24-31](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/ci-changed-scope.mjs#L24-L31)[scripts/ci-changed-scope.mjs158-165](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/ci-changed-scope.mjs#L158-L165)).

**Sources:**[scripts/ci-changed-scope.mjs19-167](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/ci-changed-scope.mjs#L19-L167)[src/scripts/ci-changed-scope.test.ts1-143](https://github.com/openclaw/openclaw/blob/8873e13f/src/scripts/ci-changed-scope.test.ts#L1-L143)

### Scope Output Consumption

Jobs declare dependencies and conditionals using the scope outputs:

```
needs: [docs-scope, changed-scope]
if: needs.docs-scope.outputs.docs_only != 'true' && 
    (github.event_name == 'push' || needs.changed-scope.outputs.run_node == 'true')
```

This pattern appears in the `checks`, `check`, `build-artifacts`, and other jobs. Push events to `main` bypass PR optimizations to ensure full coverage ([.github/workflows/ci.yml82](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L82-L82)[.github/workflows/ci.yml141](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L141-L141)).

**Sources:**[.github/workflows/ci.yml80-82](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L80-L82)[.github/workflows/ci.yml139-141](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L139-L141)

## Job Orchestration and Dependencies

### Job Dependency Graph

```
Release Validation

Platform Tests

Build

Static Analysis

Gate Jobs (fast)

docs-scope
(detect docs-only)

changed-scope
(analyze file paths)

secrets
(detect-secrets, zizmor)

check
(types, lint, format)

check-docs
(markdown lint)

deadcode
(Knip report)

build-artifacts
(pnpm build, upload dist/)

checks (matrix)
node test, bun test,
extensions, protocol

checks-windows (matrix)
6-shard parallel tests

macos
(TS tests + Swift)

android (matrix)
(Gradle build + test)

skills-python
(ruff + pytest)

release-check
(npm pack validation)
```

The pipeline enforces a fail-fast order where cheap checks complete before expensive platform tests run. The `check` job must pass before the `macos` job starts ([.github/workflows/ci.yml498](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L498-L498)).

**Concurrency:** The workflow uses a concurrency group to cancel in-progress PR runs when new commits are pushed ([.github/workflows/ci.yml8-10](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L8-L10)):

```
concurrency:
  group: ci-${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
```

**Sources:**[.github/workflows/ci.yml8-10](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L8-L10)[.github/workflows/ci.yml139-776](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L139-L776)[docs/ci.md31-38](https://github.com/openclaw/openclaw/blob/8873e13f/docs/ci.md#L31-L38)

## Platform-Specific Jobs

### Node/Bun Checks

The `checks` job ([.github/workflows/ci.yml139-188](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L139-L188)) runs a matrix of Node and Bun test suites:
RuntimeTaskCommandnodetest`pnpm canvas:a2ui:bundle && pnpm test`nodeextensions`pnpm test:extensions`nodeprotocol`pnpm protocol:check`buntest`pnpm canvas:a2ui:bundle && bunx vitest run`
The Bun lane is skipped on push to `main` ([.github/workflows/ci.yml160-162](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L160-L162)) to reduce queue time while still validating Bun compatibility on PRs.

**Test worker configuration:** Node tests configure parallel worker limits and heap size via environment variables ([.github/workflows/ci.yml177-183](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L177-L183)):

```
OPENCLAW_TEST_WORKERS=2
OPENCLAW_TEST_MAX_OLD_SPACE_SIZE_MB=6144
```

**Sources:**[.github/workflows/ci.yml139-188](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L139-L188)

### Windows Tests with Sharding

The `checks-windows` job ([.github/workflows/ci.yml372-492](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L372-L492)) runs on `blacksmith-32vcpu-windows-2025` with aggressive 6-way sharding to manage the large test suite:

```
strategy:
  fail-fast: false
  matrix:
    include:
      - runtime: node
        task: test
        shard_index: 1
        shard_count: 6
        command: pnpm test
      # ... repeated for shards 2-6
```

Each shard runs independently with environment variables set by the matrix ([.github/workflows/ci.yml480-484](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L480-L484)):

```
OPENCLAW_TEST_SHARDS=${{ matrix.shard_count }}
OPENCLAW_TEST_SHARD_INDEX=${{ matrix.shard_index }}
```

**Windows Defender exclusions:** The workflow attempts to exclude the workspace from Windows Defender scanning ([.github/workflows/ci.yml425-442](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L425-L442)) to improve process spawning performance for Vitest workers. This is best-effort and continues on failure.

**Cache configuration:** Windows shards disable sticky disk and restore keys ([.github/workflows/ci.yml457-459](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L457-L459)) because they caused retries and added ~50s per shard without improving pnpm store reuse.

**Sources:**[.github/workflows/ci.yml372-492](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L372-L492)

### macOS Consolidated Job

The `macos` job ([.github/workflows/ci.yml493-569](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L493-L569)) runs all macOS validation sequentially on a single runner to avoid starving GitHub's 5-concurrent-macOS-job limit:

**Execution order:**

1. TypeScript tests (`pnpm test`)
2. Swift lint (`swiftlint`, `swiftformat`)
3. Swift release build (`swift build --configuration release`)
4. Swift tests with coverage (`swift test --enable-code-coverage`)

The job uses Xcode 26.1 ([.github/workflows/ci.yml519-522](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L519-L522)) and includes retry logic for Swift build/test commands ([.github/workflows/ci.yml546-568](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L546-L568)) to handle transient network failures in SwiftPM dependency resolution.

**SwiftPM caching:** The job caches `~/Library/Caches/org.swift.swiftpm` keyed by `Package.resolved` ([.github/workflows/ci.yml538-544](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L538-L544)).

**Sources:**[.github/workflows/ci.yml493-569](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L493-L569)

### Android Jobs

The `android` job ([.github/workflows/ci.yml730-776](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L730-L776)) runs a matrix of Gradle tasks:
TaskCommandtest`./gradlew --no-daemon :app:testDebugUnitTest`build`./gradlew --no-daemon :app:assembleDebug`
The job sets up Java 17 (JDK 21 causes sdkmanager crashes in CI, [.github/workflows/ci.yml752-753](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L752-L753)), Android SDK packages, and Gradle 8.11.1.

**Sources:**[.github/workflows/ci.yml730-776](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L730-L776)

### Python Skills

The `skills-python` job ([.github/workflows/ci.yml264-288](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L264-L288)) validates Python skill scripts:

```
python -m ruff check skills
python -m pytest -q skills
```

This job runs when `run_skills_python` scope is active or on push to `main` ([.github/workflows/ci.yml265-266](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L265-L266)).

**Sources:**[.github/workflows/ci.yml264-288](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L264-L288)

## Build Artifacts and Caching

### Build Artifacts Job

The `build-artifacts` job ([.github/workflows/ci.yml80-111](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L80-L111)) runs once per workflow and shares the built `dist/` directory with downstream jobs:

```
pnpm build
```

The job uploads the `dist/` directory as an artifact named `dist-build` with 1-day retention ([.github/workflows/ci.yml106-111](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L106-L111)). The `release-check` job downloads this artifact to validate npm pack contents ([.github/workflows/ci.yml130-137](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L130-L137)).

**Sources:**[.github/workflows/ci.yml80-111](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L80-L111)[.github/workflows/ci.yml114-137](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L114-L137)

### pnpm Store Caching

Most jobs use the `setup-node-env` composite action ([.github/actions/setup-node-env/action.yml1-110](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-node-env/action.yml#L1-L110)) which delegates to `setup-pnpm-store-cache` ([.github/actions/setup-pnpm-store-cache/action.yml1-75](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-pnpm-store-cache/action.yml#L1-L75)) for store management.

**Cache strategies:**

```
yes

no

yes

no

yes

no

pnpm store path
(from pnpm store path --silent)

use-sticky-disk == true?

useblacksmith/stickydisk@v1
(persistent mount)

use-actions-cache == true?

use-restore-keys == true?

actions/cache@v4
(exact key only)

actions/cache@v4
(with restore-keys)

No caching
```

**Sticky disks** ([.github/actions/setup-pnpm-store-cache/action.yml53-58](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-pnpm-store-cache/action.yml#L53-L58)): Blacksmith runners support persistent disk mounts keyed by repository and runner OS. This provides faster cache hits than `actions/cache` but is currently disabled for Windows shards ([.github/workflows/ci.yml457](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L457-L457)).

**Cache keys** ([.github/actions/setup-pnpm-store-cache/action.yml65](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-pnpm-store-cache/action.yml#L65-L65)[.github/actions/setup-pnpm-store-cache/action.yml72](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-pnpm-store-cache/action.yml#L72-L72)):

```
${{ runner.os }}-pnpm-store-${{ inputs.cache-key-suffix }}-${{ hashFiles('pnpm-lock.yaml') }}

```

The `cache-key-suffix` input (default `"node22"`) allows cache invalidation when Node versions change.

**Sources:**[.github/actions/setup-node-env/action.yml1-110](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-node-env/action.yml#L1-L110)[.github/actions/setup-pnpm-store-cache/action.yml1-75](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-pnpm-store-cache/action.yml#L1-L75)

### Submodule Initialization

The `setup-node-env` action includes retry logic for submodule checkout ([.github/actions/setup-node-env/action.yml33-45](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-node-env/action.yml#L33-L45)):

```
for attempt in 1 2 3 4 5; do
  if git -c protocol.version=2 submodule update --init --force --depth=1 --recursive; then
    exit 0
  fi
  echo "Submodule update failed (attempt $attempt/5). Retrying…"
  sleep $((attempt * 10))
done
```

This handles transient network failures when fetching submodules.

**Sources:**[.github/actions/setup-node-env/action.yml33-45](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actions/setup-node-env/action.yml#L33-L45)

## Security Checks

### Secrets Job

The `secrets` job ([.github/workflows/ci.yml290-371](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L290-L371)) runs security scans independently of scope detection to ensure they always execute:

**Pre-commit hooks executed:**

1. `detect-secrets`: Scans for leaked API keys, tokens, and credentials
2. `detect-private-key`: Detects committed SSH/PGP private keys
3. `zizmor`: Audits GitHub Actions workflows for security issues
4. `pnpm-audit-prod`: Checks production dependencies for vulnerabilities

**Scan optimization:** On pull requests, `detect-secrets` runs only on changed files ([.github/workflows/ci.yml330-346](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L330-L346)). On push to `main`, it's currently skipped pending allowlist cleanup ([.github/workflows/ci.yml319-322](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L319-L322)).

**Zizmor workflow audit:** Only runs when `.github/workflows/*.yml` files change ([.github/workflows/ci.yml351-367](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L351-L367)):

```
mapfile -t workflow_files < <(git diff --name-only "$BASE" HEAD -- '.github/workflows/*.yml' '.github/workflows/*.yaml')
if [ "${#workflow_files[@]}" -eq 0 ]; then
  echo "No workflow changes detected; skipping zizmor."
  exit 0
fi
pre-commit run zizmor --files "${workflow_files[@]}"
```

**Sources:**[.github/workflows/ci.yml290-371](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L290-L371)

### Input Interpolation Policy

A Python script enforces a security policy against direct input interpolation in composite action `run` blocks ([scripts/check-composite-action-input-interpolation.py1-82](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/check-composite-action-input-interpolation.py#L1-L82)):

```
INPUT_INTERPOLATION_RE = re.compile(r"\$\{\{\s*inputs\.")
```

This prevents injection vulnerabilities where untrusted inputs could be expanded in shell scripts. The policy requires using `env:` declarations and referencing shell variables instead.

**Sources:**[scripts/check-composite-action-input-interpolation.py1-82](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/check-composite-action-input-interpolation.py#L1-L82)

## Static Analysis Jobs

### Check Job

The `check` job ([.github/workflows/ci.yml190-215](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L190-L215)) runs static analysis on Node code:

```
pnpm check               # TypeScript types, ESLint, oxfmt
pnpm build:strict-smoke  # Strict TypeScript compilation
pnpm lint:ui:no-raw-window-open  # Enforce safe URL opening policy
```

The `pnpm check` command internally runs type checking, linting, and formatting validation ([.github/workflows/ci.yml208](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L208-L208)).

**Sources:**[.github/workflows/ci.yml190-215](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L190-L215)

### Dead Code Report

The `deadcode` job ([.github/workflows/ci.yml217-243](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L217-L243)) runs Knip to detect unused exports, dependencies, and configuration:

```
pnpm deadcode:report:ci:knip
```

This is currently report-only ([.github/workflows/ci.yml219](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L219-L219)) and stores results as an artifact for manual triage ([.github/workflows/ci.yml238-242](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L238-L242)) rather than failing the build.

**Sources:**[.github/workflows/ci.yml217-243](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L217-L243)

### Documentation Validation

When documentation files change, the `check-docs` job ([.github/workflows/ci.yml245-262](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L245-L262)) validates:

```
pnpm check:docs  # Markdown format, lint, broken link detection
```

This job is conditional on `docs_changed == 'true'` ([.github/workflows/ci.yml247](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L247-L247)) rather than the broader `docs_only` flag.

**Sources:**[.github/workflows/ci.yml245-262](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L245-L262)

## Runner Infrastructure

### Runner Types
RunnerCPUJobsNotes`blacksmith-16vcpu-ubuntu-2404`16 vCPUscope detection, checks, build-artifacts, android, pythonBlacksmith optimized Linux`blacksmith-32vcpu-windows-2025`32 vCPUchecks-windows (6 shards)High concurrency for parallel tests`macos-latest`variesmacos, ios (disabled)GitHub-hosted macOS runner
**Blacksmith runners** provide faster network, disk I/O, and better cache performance compared to standard GitHub-hosted runners. The configuration is declared in `.github/actionlint.yaml` ([.github/actionlint.yaml4-12](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actionlint.yaml#L4-L12)) for actionlint validation.

**Sources:**[.github/workflows/ci.yml16](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L16-L16)[.github/workflows/ci.yml375](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L375-L375)[.github/workflows/ci.yml500](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L500-L500)[.github/actionlint.yaml1-24](https://github.com/openclaw/openclaw/blob/8873e13f/.github/actionlint.yaml#L1-L24)[docs/ci.md42-47](https://github.com/openclaw/openclaw/blob/8873e13f/docs/ci.md#L42-L47)

### Resource Limits

**Node heap size:** Jobs set `NODE_OPTIONS` to increase the V8 heap limit ([.github/workflows/ci.yml378](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L378-L378)[.github/workflows/ci.yml515](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L515-L515)):

```
NODE_OPTIONS=--max-old-space-size=6144  # Windows
NODE_OPTIONS=--max-old-space-size=4096  # macOS
```

**Test workers:** The `OPENCLAW_TEST_WORKERS` environment variable controls parallel worker count ([.github/workflows/ci.yml182](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L182-L182)[.github/workflows/ci.yml381](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L381-L381)):

```
OPENCLAW_TEST_WORKERS=2  # Linux
OPENCLAW_TEST_WORKERS=1  # Windows (per shard, due to observed instability)
```

**Sources:**[.github/workflows/ci.yml177-183](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L177-L183)[.github/workflows/ci.yml377-381](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L377-L381)[.github/workflows/ci.yml514-516](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L514-L516)

## Local Development Equivalents

Developers can run CI checks locally without GitHub Actions:
CI JobLocal Command`check``pnpm check``checks` (node test)`pnpm test``checks` (protocol)`pnpm protocol:check``checks` (extensions)`pnpm test:extensions``check-docs``pnpm check:docs``release-check``pnpm release:check``skills-python``python -m ruff check skills && python -m pytest -q skills``deadcode``pnpm deadcode:report:ci:knip`
**Scope detection testing:** The scope detection logic has unit tests in `src/scripts/ci-changed-scope.test.ts` ([src/scripts/ci-changed-scope.test.ts1-143](https://github.com/openclaw/openclaw/blob/8873e13f/src/scripts/ci-changed-scope.test.ts#L1-L143)) that can be run locally with `pnpm test`.

**Sources:**[docs/ci.md49-56](https://github.com/openclaw/openclaw/blob/8873e13f/docs/ci.md#L49-L56)[src/scripts/ci-changed-scope.test.ts1-143](https://github.com/openclaw/openclaw/blob/8873e13f/src/scripts/ci-changed-scope.test.ts#L1-L143)

## Optimization Strategies

The CI pipeline employs several strategies to minimize execution time:

1. **Early scope detection:** The `docs-scope` job completes in ~30 seconds and can skip all heavy jobs for docs-only PRs
2. **Parallel scope analysis:** The `changed-scope` job runs independently and produces multiple boolean outputs that jobs can check individually
3. **Fail-fast ordering:** Static analysis (`check`) must pass before platform tests start
4. **Test sharding:** Windows tests split across 6 parallel shards on a 32 vCPU runner
5. **Build once, share:** The `build-artifacts` job produces `dist/` once and downstream jobs download it
6. **Selective bun testing:** Bun tests skip on push to `main` to reduce queue pressure
7. **Consolidated macOS job:** All macOS validation runs sequentially on one runner instead of 4 separate jobs to respect GitHub's concurrency limits

**Sources:**[.github/workflows/ci.yml1-776](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml#L1-L776)[docs/ci.md10-38](https://github.com/openclaw/openclaw/blob/8873e13f/docs/ci.md#L10-L38)

---

# Release-Process

# Release Process
Relevant source files
- [CHANGELOG.md](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md)
- [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Tests/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/8873e13f/assets/avatar-placeholder.svg)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/cli/index.md)
- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/getting-started.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/8873e13f/docs/start/wizard.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/8873e13f/extensions/bluebubbles/src/send-helpers.ts)
- [package.json](https://github.com/openclaw/openclaw/blob/8873e13f/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/8873e13f/pnpm-lock.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.types.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/agents/subagent-registry-cleanup.test.ts)
- [src/cli/program.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/cli/program.ts)
- [src/config/config.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/config.ts)
- [src/config/types.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/types.ts)
- [src/config/zod-schema.ts](https://github.com/openclaw/openclaw/blob/8873e13f/src/config/zod-schema.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/8873e13f/ui/package.json)

This document describes the versioning strategy, release checklist, changelog maintenance, and distribution process for OpenClaw releases across npm, GitHub, and platform-specific channels (macOS, iOS, Android).

For CI/CD pipeline details, see [CI/CD Pipeline](/openclaw/openclaw/8.1-cicd-pipeline). For platform-specific development setup, see [macOS Dev Setup](https://github.com/openclaw/openclaw/blob/8873e13f/macOS Dev Setup)[iOS](https://github.com/openclaw/openclaw/blob/8873e13f/iOS) and [Android](https://github.com/openclaw/openclaw/blob/8873e13f/Android)

## Purpose and Scope

This page covers:

- Versioning scheme and version number coordination
- Release checklist and pre-release validation
- Changelog format and maintenance practices
- Distribution to npm, GitHub releases, and platform app stores
- Platform-specific release processes (Sparkle auto-updates for macOS, mobile builds)
- Update mechanisms and channels (stable/beta/dev)

---

## Versioning Strategy

OpenClaw uses a **calendar-based versioning scheme**: `YYYY.M.D` (year, month, day).
Example VersionInterpretation`2026.3.3`March 3, 2026 (stable release)`2026.3.2`March 2, 2026 (previous stable)`2026.3.3-beta.1`Beta prerelease for March 3 cycle
**Version Fields:**

- **npm package version** ([package.json3](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L3-L3)): semantic source of truth for Node.js distribution
- **Android `versionCode`** ([apps/android/app/build.gradle.kts24](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L24-L24)): monotonic integer for Google Play (e.g., `202603010`)
- **Android `versionName`** ([apps/android/app/build.gradle.kts25](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L25-L25)): human-readable display version (e.g., `"2026.3.2"`)
- **iOS `CFBundleShortVersionString`** ([apps/ios/Sources/Info.plist22](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L22-L22)): marketing version (e.g., `"2026.3.2"`)
- **iOS `CFBundleVersion`** ([apps/ios/Sources/Info.plist35](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L35-L35)): build number (e.g., `"20260301"`)
- **macOS `CFBundleShortVersionString`** ([apps/macos/Sources/OpenClaw/Resources/Info.plist18](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist#L18-L18)): display version
- **macOS `CFBundleVersion`** ([apps/macos/Sources/OpenClaw/Resources/Info.plist20](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist#L20-L20)): Sparkle version (numeric, monotonic)

**Distribution Channels:**

- `stable` — tagged releases (`vYYYY.M.D`), npm dist-tag `latest`
- `beta` — prerelease tags (`vYYYY.M.D-beta.N`), npm dist-tag `beta`
- `dev` — moving head of `main`, npm dist-tag `dev`

Sources: [CHANGELOG.md5-31](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L5-L31)[package.json3](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L3-L3)[README.md85-90](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L85-L90)

---

## Version Coordination Across Platforms

```
Distribution

Build Artifacts

Version Sources

derives

derives

derives

derives

derives

derives

package.json
version: 2026.3.3

Git tags
v2026.3.3

Android versionCode
202603010

Android versionName
2026.3.2

iOS CFBundleShortVersionString
2026.3.2

iOS CFBundleVersion
20260301

macOS CFBundleShortVersionString
2026.3.2

macOS CFBundleVersion (Sparkle)
202603010

npm registry
latest/beta/dev

GitHub Releases
assets + notes

Sparkle Feed
appcast.xml
```

**Key Invariants:**

- **npm version** is the canonical source for all platform versions
- **Mobile build numbers** must be monotonic integers for app store submission
- **macOS `APP_BUILD`** must be numeric and monotonic for Sparkle version comparison ([docs/platforms/mac/release.md29-31](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md#L29-L31))
- Android `versionCode` format: `YYYYMMDDNN` (date + lane suffix)
- iOS `CFBundleVersion` format: `YYYYMMDD` (date only)

Sources: [package.json3](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L3-L3)[apps/android/app/build.gradle.kts24-25](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L24-L25)[apps/ios/Sources/Info.plist22-35](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L22-L35)[apps/macos/Sources/OpenClaw/Resources/Info.plist18-20](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist#L18-L20)

---

## Release Checklist

### Pre-Release Validation

```
Build Process
Test Suite
GitHub Actions
scripts/release-check.ts
Developer
Build Process
Test Suite
GitHub Actions
scripts/release-check.ts
Developer
npm run release:check
Validate version format
Check CHANGELOG.md updated
Verify git state (clean, on main)
✓ or ✗ with errors
git push tag v2026.3.3
Run full test suite
Pass/Fail
Build all platforms
Node/TypeScript dist/
macOS .app + .dmg
iOS .ipa
Android .apk
Artifacts
Publish to npm
Create GitHub Release
Update Sparkle appcast
```

**Manual Steps:**

1. **Update version numbers** across all platform configs to match

- [package.json3](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L3-L3)
- [apps/android/app/build.gradle.kts24-25](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L24-L25)
- [apps/ios/Sources/Info.plist22-35](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L22-L35)
- [apps/ios/project.yml101-102](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml#L101-L102)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist18-20](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist#L18-L20)
2. **Update CHANGELOG.md** with release notes

- Add new `## YYYY.M.D` section at top
- Categorize changes: `### Changes`, `### Breaking`, `### Fixes`
- Include PR references and contributor credits ([CHANGELOG.md1-166](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L1-L166))
3. **Run pre-release checks:**

```
npm run release:check
```

This script ([package.json294](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L294-L294)) validates version consistency, changelog presence, and git state.
4. **Verify build across platforms:**

```
pnpm build                    # Node/TS dist
pnpm ui:build                 # Control UI
pnpm android:assemble         # Android APK
pnpm ios:build               # iOS build
# macOS: see platform-specific section below
```
5. **Run full test suite:**

```
pnpm test                     # Unit tests
pnpm test:e2e                # E2E tests
pnpm test:channels           # Channel integration tests
```
6. **Tag and push:**

```
git tag v2026.3.3
git push origin v2026.3.3
```

**Automated Validation:**

- CI runs [scope detection](/openclaw/openclaw/8.1-cicd-pipeline) to determine which platform jobs to execute
- Type checking, linting, and formatting checks run on all pushes
- Platform-specific tests run when relevant files change

Sources: [package.json294](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L294-L294)[CHANGELOG.md1-166](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L1-L166)[.github/workflows/ci.yml](https://github.com/openclaw/openclaw/blob/8873e13f/.github/workflows/ci.yml) (implied)

---

## Changelog Maintenance

The changelog follows a **structured format** with three main categories:
SectionPurpose`### Changes`New features, improvements, and non-breaking changes`### Breaking`Breaking changes requiring user action (bold with migration guidance)`### Fixes`Bug fixes with symptoms, root cause, and resolution
**Changelog Entry Format:**

```
### Changes
 
- Feature/area: description of change with context and user impact. (#PR) Thanks @contributor.
```

**Best Practices:**

- **User-centric language**: describe impact, not implementation
- **Include context**: why the change was needed, what problem it solves
- **Cite PRs and contributors**: `(#12345) Thanks @username`
- **Breaking changes**: must include migration path or workaround
- **Categorize precisely**: Changes vs Fixes vs Breaking

**Example Breaking Change Entry:**

```
### Breaking
 
- **BREAKING:** Gateway auth now requires explicit `gateway.auth.mode` when both
  `gateway.auth.token` and `gateway.auth.password` are configured. Set
  `gateway.auth.mode` to `token` or `password` before upgrade to avoid startup
  failures. (#35094) Thanks @joshavant.
```

Sources: [CHANGELOG.md1-166](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L1-L166)

---

## Distribution Channels

### npm Registry

OpenClaw publishes to npm with three dist-tags:
Dist-TagPurposeAudience`latest`Stable releasesProduction users`beta`Beta prereleasesEarly adopters, testing`dev`Development snapshotsContributors, bleeding edge
**Publish Command:**

```
npm publish --tag latest      # Stable
npm publish --tag beta        # Beta
npm publish --tag dev         # Dev snapshot
```

**Package Contents** ([package.json23-34](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L23-L34)):

- `CHANGELOG.md`, `LICENSE`, `README.md`
- `openclaw.mjs` (CLI entry point)
- `dist/` (compiled TypeScript)
- `assets/`, `docs/`, `extensions/`, `skills/`

**Pre-Publish Hook** ([package.json289](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L289-L289)):

```
pnpm build && pnpm ui:build
```

Ensures `dist/` and Control UI assets are fresh before packing.

Sources: [package.json23-289](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L23-L289)[README.md85-90](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L85-L90)

---

### GitHub Releases

GitHub Releases serve as the **changelog archive** and **asset distribution point**.

**Release Workflow:**

1. Tag pushed triggers CI
2. CI builds all platform artifacts
3. CI creates GitHub Release with:

- Release notes (extracted from CHANGELOG.md)
- Downloadable assets:

- `openclaw-{version}.tgz` (npm tarball)
- `OpenClaw-{version}.dmg` (macOS)
- `openclaw-{version}-release.apk` (Android)
- `openclaw-{version}.ipa` (iOS, if built)

**Release Notes Format:**

```
## 2026.3.3
 
### Changes
- [List from CHANGELOG.md]
 
### Breaking
- [List from CHANGELOG.md]
 
### Fixes
- [List from CHANGELOG.md]
```

Sources: [CHANGELOG.md1-166](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L1-L166)[README.md16](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L16-L16)

---

## Platform-Specific Release Processes

### macOS: Sparkle Auto-Updates

macOS releases use **Sparkle** for in-app auto-updates.

**Sparkle Version Constraints:**

- `APP_BUILD` (maps to `sparkle:version` and `CFBundleVersion`) must be **numeric and monotonic**
- `APP_VERSION` (maps to `sparkle:shortVersionString` and `CFBundleShortVersionString`) is human-readable
- If `APP_BUILD` is omitted, `scripts/package-mac-app.sh` auto-derives it from `APP_VERSION` using format `YYYYMMDDNN` (stable defaults to `90`, prereleases use suffix-derived lane)

**Build and Package Commands:**

```
# Set release metadata
BUNDLE_ID=ai.openclaw.mac \
APP_VERSION=2026.3.2 \
BUILD_CONFIG=release \
SIGN_IDENTITY="Developer ID Application: <Name> (<TEAMID>)" \
scripts/package-mac-app.sh
 
# Create signed, notarized distribution artifacts
BUNDLE_ID=ai.openclaw.mac \
APP_VERSION=2026.3.2 \
BUILD_CONFIG=release \
SIGN_IDENTITY="Developer ID Application: <Name> (<TEAMID>)" \
scripts/package-mac-dist.sh
```

**Output Artifacts:**

- `dist/OpenClaw.app` — Developer ID signed app bundle
- `dist/OpenClaw-{version}.zip` — Sparkle-signed archive
- `dist/OpenClaw-{version}.dmg` — Notarized disk image
- `dist/openclaw-{version}.appcast.xml` — Sparkle feed entry

**Sparkle Feed Update:**

```
# Generate/update appcast.xml
~/.build/artifacts/sparkle/Sparkle/bin/generate_appcast \
  --channel main \
  dist/
```

**Notarization Flow:**

1. Build and sign with Developer ID
2. Create distributable archive (`.zip` or `.dmg`)
3. Submit to Apple notary service:

```
xcrun notarytool submit dist/OpenClaw-{version}.dmg \
  --keychain-profile openclaw-notary \
  --wait
```
4. Staple notarization ticket:

```
xcrun stapler staple dist/OpenClaw-{version}.dmg
```

**Prerequisites:**

- Developer ID Application certificate installed
- Sparkle private key at `$SPARKLE_PRIVATE_KEY_FILE`
- Notary credentials stored in keychain profile `openclaw-notary`

Sources: [docs/platforms/mac/release.md1-45](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md#L1-L45)[apps/macos/Sources/OpenClaw/Resources/Info.plist18-20](https://github.com/openclaw/openclaw/blob/8873e13f/apps/macos/Sources/OpenClaw/Resources/Info.plist#L18-L20)

---

### iOS Release

**Version Management:**

- `CFBundleShortVersionString` ([apps/ios/Sources/Info.plist22](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L22-L22)): marketing version (e.g., `"2026.3.2"`)
- `CFBundleVersion` ([apps/ios/Sources/Info.plist35](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L35-L35)): build number (e.g., `"20260301"`, monotonic)

**Build Commands:**

```
# Generate Xcode project from project.yml
pnpm ios:gen
 
# Build for simulator
IOS_DEST="platform=iOS Simulator,name=iPhone 17" pnpm ios:build
 
# Build for device (requires signing)
pnpm ios:build
```

**Signing Configuration:**
Managed via `Signing.xcconfig` and environment variables:

- `OPENCLAW_CODE_SIGN_STYLE` (Automatic or Manual)
- `OPENCLAW_DEVELOPMENT_TEAM` (Team ID)
- `OPENCLAW_APP_BUNDLE_ID` (Bundle identifier)
- `OPENCLAW_APP_PROFILE` (Provisioning profile name)

**Release Steps:**

1. Update versions in [apps/ios/project.yml101-102](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml#L101-L102) and [apps/ios/Sources/Info.plist22-35](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L22-L35)
2. Run `pnpm ios:build` with release configuration
3. Archive via Xcode or `xcodebuild archive`
4. Submit to App Store Connect via Xcode Organizer or `xcrun altool`

Sources: [apps/ios/project.yml1-119](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/project.yml#L1-L119)[apps/ios/Sources/Info.plist1-91](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L1-L91)[package.json262-265](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L262-L265)

---

### Android Release

**Version Management:**

- `versionCode` ([apps/android/app/build.gradle.kts24](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L24-L24)): monotonic integer for Play Store (e.g., `202603010`)
- `versionName` ([apps/android/app/build.gradle.kts25](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L25-L25)): display version (e.g., `"2026.3.2"`)

**Build Commands:**

```
# Debug build
pnpm android:assemble
 
# Release build (requires signing key)
cd apps/android
./gradlew :app:assembleRelease
```

**Output Filename:**
The `androidComponents` block ([apps/android/app/build.gradle.kts82-94](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L82-L94)) customizes output filename:

```
openclaw-{versionName}-{buildType}.apk

```

Example: `openclaw-2026.3.2-release.apk`

**Release Steps:**

1. Update `versionCode` (increment monotonically) and `versionName` in [apps/android/app/build.gradle.kts24-25](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L24-L25)
2. Build release APK: `./gradlew :app:assembleRelease`
3. Sign with release keystore (configured in `signing` block, not shown in provided files)
4. Upload to Google Play Console

Sources: [apps/android/app/build.gradle.kts1-169](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L1-L169)[package.json218-224](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L218-L224)

---

## Automated Release Checks

The `release:check` script validates release readiness:

```
npm run release:check
```

**Validation Steps** (inferred from script name):

1. **Version format**: Ensure all version strings match expected calendar format
2. **Version consistency**: Verify npm package version matches platform versions
3. **Changelog presence**: Require corresponding CHANGELOG.md section for current version
4. **Git state**: Ensure working tree is clean and on `main` branch
5. **Build status**: Verify `dist/` is up-to-date (optional, may require manual `pnpm build`)

**Usage in CI:**
The `release:check` script likely runs as part of the tag push workflow to catch errors before publishing.

Sources: [package.json294](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L294-L294)

---

## Update Mechanisms

### User-Facing Update Command

```
openclaw update [--channel stable|beta|dev]
```

**Behavior:**

- Detects current install method (npm, git source, or other)
- Updates to latest version on specified channel
- For npm installs: `npm install -g openclaw@latest` (or `@beta`, `@dev`)
- For git installs: `git pull && pnpm install && pnpm build`

**Auto-Update Configuration** ([docs/gateway/configuration.md269-283](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L269-L283)):

```
{
  update: {
    channel: "stable",           // stable | beta | dev
    checkOnStart: true,          // Check for updates on gateway start
    auto: {
      enabled: false,            // Auto-install updates (disabled by default)
      stableDelayHours: 72,      // Delay before auto-applying stable updates
      stableJitterHours: 24,     // Random jitter to spread update load
      betaCheckIntervalHours: 6  // How often to check for beta updates
    }
  }
}
```

**macOS Auto-Update Flow:**

1. Sparkle checks appcast feed on app launch
2. User prompted when update available
3. Update downloaded in background
4. User chooses "Install and Relaunch"
5. Sparkle replaces app bundle and relaunches

Sources: [README.md85-90](https://github.com/openclaw/openclaw/blob/8873e13f/README.md#L85-L90)[docs/gateway/configuration.md269-283](https://github.com/openclaw/openclaw/blob/8873e13f/docs/gateway/configuration.md#L269-L283)

---

## Contributor Credits

The `scripts/update-clawtributors.ts` script maintains the contributor section in README.md:

**Data Sources:**

- GitHub API: fetch contributors via `gh api "repos/openclaw/openclaw/contributors"`
- Git history: parse commits for name/email mappings
- Manual mappings: [scripts/clawtributors-map.json1-41](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json#L1-L41) for display name overrides

**Update Command:**

```
# Run manually before release
pnpm tsx scripts/update-clawtributors.ts
```

**Output:**
Updates the contributor grid in [README.md](https://github.com/openclaw/openclaw/blob/8873e13f/README.md) with avatars and profile links.

Sources: [scripts/update-clawtributors.ts1-227](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/update-clawtributors.ts#L1-L227)[scripts/clawtributors-map.json1-41](https://github.com/openclaw/openclaw/blob/8873e13f/scripts/clawtributors-map.json#L1-L41)

---

## Summary Workflow Diagram

```
Post-Release

Distribution

Release

Pre-Release

Update version numbers
package.json, Android, iOS, macOS

Update CHANGELOG.md
with release notes

Run release:check
validate consistency

Build all platforms
npm, macOS, iOS, Android

Run full test suite
unit + e2e + channels

git tag v2026.3.3
git push origin v2026.3.3

GitHub Actions CI
runs platform jobs

Publish to npm
latest/beta/dev

Create GitHub Release
+ upload assets

Update Sparkle appcast
for macOS auto-update

Submit to App Store (iOS)
and Play Store (Android)

Update docs site
if needed

Announce release
Discord, Twitter, etc.

Monitor update adoption
and issue reports
```

Sources: [package.json3-294](https://github.com/openclaw/openclaw/blob/8873e13f/package.json#L3-L294)[CHANGELOG.md1-166](https://github.com/openclaw/openclaw/blob/8873e13f/CHANGELOG.md#L1-L166)[docs/platforms/mac/release.md1-45](https://github.com/openclaw/openclaw/blob/8873e13f/docs/platforms/mac/release.md#L1-L45)[apps/android/app/build.gradle.kts24-25](https://github.com/openclaw/openclaw/blob/8873e13f/apps/android/app/build.gradle.kts#L24-L25)[apps/ios/Sources/Info.plist22-35](https://github.com/openclaw/openclaw/blob/8873e13f/apps/ios/Sources/Info.plist#L22-L35)