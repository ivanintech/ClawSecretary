# Overview

# Overview
Relevant source files
- [.npmrc](https://github.com/openclaw/openclaw/blob/17eaa59a/.npmrc)
- [README.md](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md)
- [apps/android/app/build.gradle.kts](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/android/app/build.gradle.kts)
- [apps/ios/ShareExtension/Info.plist](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/ios/ShareExtension/Info.plist)
- [apps/ios/Sources/Info.plist](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/ios/Sources/Info.plist)
- [apps/ios/Tests/Info.plist](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/ios/Tests/Info.plist)
- [apps/ios/WatchApp/Info.plist](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/ios/WatchApp/Info.plist)
- [apps/ios/WatchExtension/Info.plist](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/ios/WatchExtension/Info.plist)
- [apps/ios/project.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/ios/project.yml)
- [apps/macos/Sources/OpenClaw/Resources/Info.plist](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/macos/Sources/OpenClaw/Resources/Info.plist)
- [assets/avatar-placeholder.svg](https://github.com/openclaw/openclaw/blob/17eaa59a/assets/avatar-placeholder.svg)
- [docs/channels/index.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/channels/index.md)
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/cli/index.md)
- [docs/cli/onboard.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/cli/onboard.md)
- [docs/concepts/multi-agent.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/concepts/multi-agent.md)
- [docs/docs.json](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/docs.json)
- [docs/gateway/index.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/index.md)
- [docs/gateway/troubleshooting.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/troubleshooting.md)
- [docs/index.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/index.md)
- [docs/platforms/mac/release.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/platforms/mac/release.md)
- [docs/reference/wizard.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/reference/wizard.md)
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/getting-started.md)
- [docs/start/hubs.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/hubs.md)
- [docs/start/onboarding.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/onboarding.md)
- [docs/start/setup.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/setup.md)
- [docs/start/wizard-cli-automation.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/wizard-cli-automation.md)
- [docs/start/wizard-cli-reference.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/wizard-cli-reference.md)
- [docs/start/wizard.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/wizard.md)
- [docs/tools/skills-config.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/tools/skills-config.md)
- [docs/tools/skills.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/tools/skills.md)
- [docs/web/webchat.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/web/webchat.md)
- [docs/zh-CN/channels/index.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/zh-CN/channels/index.md)
- [extensions/bluebubbles/src/send-helpers.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/extensions/bluebubbles/src/send-helpers.ts)
- [extensions/diagnostics-otel/package.json](https://github.com/openclaw/openclaw/blob/17eaa59a/extensions/diagnostics-otel/package.json)
- [extensions/discord/package.json](https://github.com/openclaw/openclaw/blob/17eaa59a/extensions/discord/package.json)
- [extensions/memory-lancedb/package.json](https://github.com/openclaw/openclaw/blob/17eaa59a/extensions/memory-lancedb/package.json)
- [extensions/nostr/package.json](https://github.com/openclaw/openclaw/blob/17eaa59a/extensions/nostr/package.json)
- [package.json](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json)
- [pnpm-lock.yaml](https://github.com/openclaw/openclaw/blob/17eaa59a/pnpm-lock.yaml)
- [pnpm-workspace.yaml](https://github.com/openclaw/openclaw/blob/17eaa59a/pnpm-workspace.yaml)
- [scripts/clawtributors-map.json](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/clawtributors-map.json)
- [scripts/update-clawtributors.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/update-clawtributors.ts)
- [scripts/update-clawtributors.types.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/update-clawtributors.types.ts)
- [src/agents/subagent-registry-cleanup.test.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/src/agents/subagent-registry-cleanup.test.ts)
- [ui/package.json](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/package.json)

## Purpose and Scope

This document introduces OpenClaw as a self-hosted multi-agent AI gateway system. It explains the high-level architecture, core capabilities, and deployment model. For hands-on setup instructions, see [Getting Started](/openclaw/openclaw/1.1-getting-started). For conceptual deep-dives on agents, sessions, and routing, see [Core Concepts](/openclaw/openclaw/1.2-core-concepts). For detailed architectural diagrams and subsystem interactions, see [System Architecture](/openclaw/openclaw/1.3-system-architecture).

## What is OpenClaw?

OpenClaw is a **self-hosted gateway** that connects messaging platforms (WhatsApp, Telegram, Discord, Slack, Signal, iMessage, and others) to AI coding agents. It runs as a single process on your infrastructure, managing sessions, routing, tool execution, and channel connections.

**Key characteristics:**

- **Self-hosted**: Runs on your hardware with your credentials and data
- **Multi-channel**: One gateway process serves multiple messaging platforms simultaneously
- **Multi-agent**: Supports isolated agent workspaces with independent sessions and auth profiles
- **Agent-native**: Built for coding agents with tool use, context management, and background execution
- **Extensible**: Plugin SDK for custom channels, tools, and integrations

The gateway acts as a **control plane** for all agent interactions. Clients (CLI, web UI, mobile apps, channel plugins) connect via WebSocket RPC on port 18789 (default). The agent runtime is embedded using the Pi Agent system [package.json354-356](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L354-L356)

**Sources:**[README.md1-27](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L1-L27)[package.json1-473](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L1-L473)[docs/index.md44-56](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/index.md#L44-L56)

## High-Level Architecture

```

```

**Sources:**[package.json16-18](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L16-L18)[package.json354-356](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L354-L356)[README.md186-202](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L186-L202)

## Core Components

### Gateway Server

The gateway is the **central control plane** that runs on a single multiplexed port (default 18789). It handles:

- **WebSocket RPC**: Client connections for CLI, Control UI, and mobile nodes
- **HTTP APIs**: OpenAI-compatible endpoints, webhook receivers, tool invocations
- **Session routing**: Maps inbound messages to agent sessions
- **Authentication**: Token-based or password-based auth [docs/gateway/index.md76](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/index.md#L76-L76)

**Entry point:**`openclaw.mjs` → `dist/index.js`[package.json16-36](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L16-L36)

**Configuration:**`~/.openclaw/openclaw.json` validated with Zod schemas [docs/gateway/index.md63-66](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/index.md#L63-L66)

**Sources:**[package.json16-36](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L16-L36)[docs/gateway/index.md1-10](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/index.md#L1-L10)

### Agent Runtime

OpenClaw embeds the **Pi Agent** system for agent execution:

- `@mariozechner/pi-agent-core`: Core agent loop and tool calling
- `@mariozechner/pi-ai`: LLM provider integrations
- `@mariozechner/pi-coding-agent`: Coding-specific tools

**Agent isolation:** Each agent has:

- Dedicated workspace directory (`~/.openclaw/workspace` or `~/.openclaw/workspace-<agentId>`)
- Separate session store (`~/.openclaw/agents/<agentId>/sessions/`)
- Independent auth profiles (`~/.openclaw/agents/<agentId>/agent/auth-profiles.json`)

**Sources:**[package.json354-356](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L354-L356)[docs/concepts/multi-agent.md13-37](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/concepts/multi-agent.md#L13-L37)

### Session Management

Sessions are keyed by agent + routing scope:

- **Per-sender**: `agent:main:peer:<phoneNumber>`
- **Per-channel**: `agent:main:channel:whatsapp`
- **Per-group**: `agent:main:guild:<groupId>`

Session files are stored as JSONL transcripts in `~/.openclaw/agents/<agentId>/sessions/<sessionKey>.jsonl`.

**Sources:**[docs/concepts/multi-agent.md40-56](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/concepts/multi-agent.md#L40-L56)[README.md147-149](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L147-L149)

### Configuration System

Configuration is loaded from `~/.openclaw/openclaw.json` (JSON5 format):

- **Zod validation**: Schema defined in TypeScript with runtime validation
- **Hot reload**: Most changes apply without restart (port/bind require restart)
- **Secret management**: Supports SecretRef for environment variables, files, or exec commands
- **Migration**: `openclaw doctor` auto-repairs legacy formats

**Sources:**[docs/gateway/index.md63-66](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/index.md#L63-L66)[README.md318-330](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L318-L330)

### Tools System

Tools are registered in `src/tools/registry.ts` with multi-layered policy enforcement:

- **Global policies**: `tools.global.allowlist`, `tools.global.denylist`
- **Agent policies**: Per-agent tool filtering
- **Sandbox policies**: Restrict tools in non-main sessions
- **Per-tool policies**: Fine-grained access control

**Built-in tools:**

- `bash`/`exec`: Shell command execution
- `read`, `write`, `edit`: File operations
- `browser_*`: Browser automation via Playwright
- `memory_search`: Vector + FTS hybrid search
- `sessions_*`: Agent-to-agent communication

**Sources:**[README.md334-338](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L334-L338)[docs/tools/skills.md1-9](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/tools/skills.md#L1-L9)

### Skills System

Skills are **modular tool instructions** loaded from:

1. **Workspace skills**: `<workspace>/skills/` (highest precedence)
2. **Managed skills**: `~/.openclaw/skills/`
3. **Bundled skills**: Shipped with the package

Each skill is a directory with `SKILL.md` containing YAML frontmatter + instructions. Skills can declare dependencies (binaries, API keys) and gating rules.

**Format:** AgentSkills.io-compatible markdown files

**Sources:**[docs/tools/skills.md10-27](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/tools/skills.md#L10-L27)[README.md312-317](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L312-L317)

### Memory System

Long-term memory uses **SQLite + vector embeddings**:

- **Database**: `~/.openclaw/memory/<agentId>.sqlite`
- **Vector extension**: `sqlite-vec`[package.json179](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L179-L179)
- **Hybrid search**: Vector similarity + full-text search
- **Indexing**: `memory_index` tool indexes `MEMORY.md` and `memory/*.md`

**Sources:**[package.json179](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L179-L179)[docs/cli/index.md295-299](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/cli/index.md#L295-L299)

### Plugin SDK

The plugin system supports extensibility via `openclaw/plugin-sdk`:

**Channel plugins:** Custom messaging platform integrations (see `extensions/` for 25+ examples)

**Tool plugins:** Add custom tools to the registry

**Exports:**[package.json38-214](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L38-L214) defines subpaths for each plugin type

**Sources:**[package.json38-214](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L38-L214)[README.md285-290](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L285-L290)

## Key Capabilities
CapabilityDescriptionCode Reference**Multi-channel messaging**WhatsApp, Telegram, Discord, Slack, Signal, iMessage, Matrix, and 20+ more[extensions/*/](https://github.com/openclaw/openclaw/blob/17eaa59a/extensions/*/)**Multi-agent routing**Isolated agents with independent workspaces, sessions, and auth[docs/concepts/multi-agent.md1-10](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/concepts/multi-agent.md#L1-L10)**Tool execution**Bash, file ops, browser control, memory search, agent messaging[src/tools/](https://github.com/openclaw/openclaw/blob/17eaa59a/src/tools/)**Context compaction**Automatic session summarization when context window fills[README.md174-176](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L174-L176)**Cron scheduling**Background agent tasks with configurable delivery[src/cron/](https://github.com/openclaw/openclaw/blob/17eaa59a/src/cron/)[README.md167-169](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L167-L169)**WebSocket RPC**Real-time bidirectional communication for all clients[docs/gateway/index.md71-77](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/index.md#L71-L77)**OAuth integration**Token refresh for Anthropic, OpenAI, Google providers[docs/cli/index.md459](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/cli/index.md#L459-L459)**Device pairing**Secure node registration with challenge-response auth[docs/gateway/troubleshooting.md93-150](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/troubleshooting.md#L93-L150)**Hot reload**Config changes apply without restart (hybrid mode default)[docs/gateway/index.md63-66](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/index.md#L63-L66)**Sandboxing**Per-session Docker isolation for non-main sessions[README.md334-338](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L334-L338)
**Sources:**[README.md126-176](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L126-L176)[docs/gateway/index.md69-77](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/index.md#L69-L77)

## Platform Support

### Operating Systems
PlatformGateway SupportNode SupportInstallation Method**macOS**✓ Full✓ Fullnpm, installer script, native app**Linux**✓ Full✓ Fullnpm, installer script, Docker**Windows**✓ WSL2 required✓ Via WSL2npm, PowerShell installer
**Native clients:**

- **macOS app**: Menu bar control, Voice Wake, Canvas, WebChat [apps/macos/](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/macos/)
- **iOS app**: Node mode, Canvas, camera, voice [apps/ios/](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/ios/)
- **Android app**: Node mode, Canvas, camera, device actions [apps/android/](https://github.com/openclaw/openclaw/blob/17eaa59a/apps/android/)

**Sources:**[README.md22-31](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L22-L31)[package.json432](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L432-L432)

### Runtime Requirements

- **Node.js**: ≥22.16.0 (22 LTS or 24 recommended) [package.json431-433](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L431-L433)
- **Package manager**: npm, pnpm (recommended), or bun [package.json434](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L434-L434)
- **Optional**: Docker for sandboxing [README.md335-336](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L335-L336)
- **Optional**: Browser binaries for `browser_*` tools (Playwright)

**Sources:**[package.json431-434](https://github.com/openclaw/openclaw/blob/17eaa59a/package.json#L431-L434)[README.md52-56](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L52-L56)

## Installation Overview

### Quick Install (Recommended)

```
# Install globally
npm install -g openclaw@latest
 
# Run onboarding wizard
openclaw onboard --install-daemon
```

The wizard configures:

1. Model authentication (API key or OAuth)
2. Gateway settings (port, bind, auth)
3. Channel connections (optional)
4. System service installation (launchd/systemd)
5. Skills setup

For detailed setup instructions, see [Getting Started](/openclaw/openclaw/1.1-getting-started).

**Sources:**[README.md50-81](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L50-L81)[docs/start/wizard.md10-33](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/wizard.md#L10-L33)

### Alternative Installations
MethodUse CaseCommand**Docker**Container deploymentSee [Docker docs](https://github.com/openclaw/openclaw/blob/17eaa59a/Docker docs)**Nix**Declarative configSee [Nix docs](https://github.com/openclaw/openclaw/blob/17eaa59a/Nix docs)**Install script**Automated setup`curl -fsSL https://openclaw.ai/install.sh | bash`**From source**Development`git clone && pnpm install && pnpm build`
**Sources:**[README.md82-111](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L82-L111)[docs/start/getting-started.md30-53](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/getting-started.md#L30-L53)

## Configuration Overview

### Minimal Configuration

A minimal `~/.openclaw/openclaw.json` requires only a model:

```
{
  agent: {
    model: "anthropic/claude-opus-4-6",
  },
}
```

**Sources:**[README.md320-328](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L320-L328)

### Key Configuration Sections
SectionPurposeExample`gateway`Port, bind, auth, Tailscale`gateway: { port: 18789, auth: { mode: "token" } }``agents`Agent list, workspaces, bindings`agents: { list: [{ name: "work", workspace: "..." }] }``channels`Channel credentials and policies`channels: { whatsapp: { allowFrom: ["+1..."] } }``tools`Tool policies and allowlists`tools: { global: { allowlist: ["bash", "read"] } }``skills`Skills configuration and gating`skills: { entries: { mcp: { enabled: true } } }``memory`Vector search config`memory: { provider: "openai" }``cron`Scheduled jobs`cron: { jobs: [{ schedule: "0 9 * * *" }] }`
For complete configuration reference, see [Configuration](/openclaw/openclaw/2.3.1-configuration-reference).

**Sources:**[docs/gateway/configuration.md1-10](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/configuration.md#L1-L10)[README.md320-330](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L320-L330)

## Deployment Models

```

```

### Local Deployment

- Gateway runs on developer machine (macOS/Linux)
- Best for: Development, single-user personal use
- Access: Loopback only (127.0.0.1) or LAN bind

### Remote Gateway

- Gateway runs on VPS/server
- Clients connect via Tailscale or SSH tunnel
- Best for: Always-on availability, team usage
- See [Remote Access](/openclaw/openclaw/2.5-multi-agent-routing) for setup details

### Hybrid with Nodes

- Gateway on server or macOS
- Device nodes (iOS/Android/macOS) paired for local actions
- `node.invoke` routes device-specific commands (camera, screen recording, notifications)
- Best for: Multi-device workflows, remote gateway with local device capabilities

**Sources:**[README.md230-238](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L230-L238)[docs/gateway/remote.md1-10](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/remote.md#L1-L10)

## Security Defaults

OpenClaw requires **explicit opt-in** for public access:

### DM Policy (Default: Pairing)

- **Pairing mode**: Unknown senders receive a pairing code; messages are dropped until approval
- **Approval**: `openclaw pairing approve <channel> <code>`
- **Open mode**: Requires explicit `dmPolicy="open"` and `"*"` in allowlist

**Sources:**[README.md112-124](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L112-L124)[docs/channels/pairing.md1-10](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/channels/pairing.md#L1-L10)

### Tool Policies

- **Main session**: Full host access (default)
- **Non-main sessions**: Sandboxed or restricted based on `agents.defaults.sandbox.mode`
- **Group safety**: Set `sandbox.mode: "non-main"` to run group/channel sessions in Docker

**Sources:**[README.md334-338](https://github.com/openclaw/openclaw/blob/17eaa59a/README.md#L334-L338)[docs/gateway/sandboxing.md1-10](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/sandboxing.md#L1-L10)

### Authentication

- **Loopback bind**: Token auth recommended (even on 127.0.0.1)
- **Non-loopback bind**: Token or password auth **required**
- **Device pairing**: Challenge-response with Ed25519 signatures

**Sources:**[docs/gateway/index.md76](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/index.md#L76-L76)[docs/gateway/troubleshooting.md93-150](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/gateway/troubleshooting.md#L93-L150)

## Next Steps

- **Setup**: Follow [Getting Started](/openclaw/openclaw/1.1-getting-started) for installation and onboarding
- **Concepts**: Read [Core Concepts](/openclaw/openclaw/1.2-core-concepts) for agents, sessions, and routing
- **Architecture**: See [System Architecture](/openclaw/openclaw/1.3-system-architecture) for detailed subsystem diagrams
- **Configuration**: Explore [Configuration Reference](/openclaw/openclaw/2.3.1-configuration-reference) for all options

**Sources:**[docs/start/getting-started.md1-136](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/getting-started.md#L1-L136)[docs/start/wizard.md1-126](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/start/wizard.md#L1-L126)

---

# Development

# Development Guide
Relevant source files
- [.github/actions/setup-node-env/action.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/actions/setup-node-env/action.yml)
- [.github/actions/setup-pnpm-store-cache/action.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/actions/setup-pnpm-store-cache/action.yml)
- [.github/workflows/auto-response.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/auto-response.yml)
- [.github/workflows/ci.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/ci.yml)
- [.github/workflows/codeql.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/codeql.yml)
- [.github/workflows/docker-release.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/docker-release.yml)
- [.github/workflows/install-smoke.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/install-smoke.yml)
- [.github/workflows/labeler.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/labeler.yml)
- [.github/workflows/openclaw-npm-release.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/openclaw-npm-release.yml)
- [.github/workflows/sandbox-common-smoke.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/sandbox-common-smoke.yml)
- [.github/workflows/stale.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/stale.yml)
- [.github/workflows/workflow-sanity.yml](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/workflow-sanity.yml)
- [AGENTS.md](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md)
- [docs/channels/irc.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/channels/irc.md)
- [docs/ci.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/ci.md)
- [docs/help/testing.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/help/testing.md)
- [docs/providers/venice.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/providers/venice.md)
- [docs/reference/RELEASING.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/reference/RELEASING.md)
- [docs/reference/test.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/reference/test.md)
- [docs/tools/creating-skills.md](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/tools/creating-skills.md)
- [scripts/ci-changed-scope.mjs](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/ci-changed-scope.mjs)
- [scripts/docker/install-sh-common/cli-verify.sh](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/docker/install-sh-common/cli-verify.sh)
- [scripts/docker/install-sh-common/version-parse.sh](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/docker/install-sh-common/version-parse.sh)
- [scripts/docker/install-sh-nonroot/run.sh](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/docker/install-sh-nonroot/run.sh)
- [scripts/docker/install-sh-smoke/run.sh](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/docker/install-sh-smoke/run.sh)
- [scripts/e2e/parallels-macos-smoke.sh](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/e2e/parallels-macos-smoke.sh)
- [scripts/e2e/parallels-windows-smoke.sh](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/e2e/parallels-windows-smoke.sh)
- [scripts/sync-labels.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/sync-labels.ts)
- [scripts/test-install-sh-docker.sh](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/test-install-sh-docker.sh)
- [scripts/test-parallel.mjs](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/test-parallel.mjs)
- [src/agents/model-tool-support.test.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/src/agents/model-tool-support.test.ts)
- [src/agents/model-tool-support.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/src/agents/model-tool-support.ts)
- [src/agents/venice-models.test.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/src/agents/venice-models.test.ts)
- [src/agents/venice-models.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/src/agents/venice-models.ts)
- [src/cli/program/help.test.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/src/cli/program/help.test.ts)
- [src/gateway/hooks-test-helpers.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/src/gateway/hooks-test-helpers.ts)
- [src/scripts/ci-changed-scope.test.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/src/scripts/ci-changed-scope.test.ts)
- [src/shared/config-ui-hints-types.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/src/shared/config-ui-hints-types.ts)
- [test/setup.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/test/setup.ts)
- [test/test-env.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/test/test-env.ts)
- [ui/src/ui/controllers/nodes.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/controllers/nodes.ts)
- [ui/src/ui/controllers/skills.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/controllers/skills.ts)
- [ui/src/ui/views/agents-panels-status-files.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/views/agents-panels-status-files.ts)
- [ui/src/ui/views/agents-panels-tools-skills.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/views/agents-panels-tools-skills.ts)
- [ui/src/ui/views/agents-utils.test.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/views/agents-utils.test.ts)
- [ui/src/ui/views/agents-utils.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/views/agents-utils.ts)
- [ui/src/ui/views/agents.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/views/agents.ts)
- [ui/src/ui/views/channel-config-extras.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/views/channel-config-extras.ts)
- [ui/src/ui/views/chat.test.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/views/chat.test.ts)
- [ui/src/ui/views/login-gate.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/views/login-gate.ts)
- [ui/src/ui/views/skills.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/ui/src/ui/views/skills.ts)
- [vitest.channels.config.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/vitest.channels.config.ts)
- [vitest.config.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/vitest.config.ts)
- [vitest.e2e.config.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/vitest.e2e.config.ts)
- [vitest.extensions.config.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/vitest.extensions.config.ts)
- [vitest.gateway.config.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/vitest.gateway.config.ts)
- [vitest.live.config.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/vitest.live.config.ts)
- [vitest.scoped-config.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/vitest.scoped-config.ts)
- [vitest.unit.config.ts](https://github.com/openclaw/openclaw/blob/17eaa59a/vitest.unit.config.ts)

This page covers the contributor and maintainer workflow for the OpenClaw monorepo: repository structure, toolchain setup, coding conventions, testing, commit and PR conventions, and local development commands. For CI/CD pipeline details see page [8.1](/openclaw/openclaw/8.1-ios-client). For release steps see page [8.2](/openclaw/openclaw/8.2-macos-client).

---

## Repository Structure

OpenClaw uses **pnpm workspaces** to organize a TypeScript-first monorepo. The table below maps the top-level directories to their roles.
DirectoryRole`src/`Core Gateway, CLI, agents, channels, infra`src/cli/`CLI command wiring`src/commands/`Individual CLI commands`src/gateway/`GatewayServer, protocol, server methods`src/agents/`Agent runtime, tools, sandbox`src/telegram/`, `src/discord/`, `src/slack/`, etc.Built-in channel integrations`src/infra/`Shared infrastructure utilities`src/media/`Media pipeline`extensions/`Extension/plugin workspace packages`apps/ios/`iOS Clawdis app (Swift)`apps/macos/`macOS Clawdis app (Swift)`apps/android/`Android Clawdis app (Kotlin/Gradle)`apps/shared/`Shared native code (Swift packages)`ui/`Control UI (LitElement SPA)`packages/`Shared TypeScript packages`skills/`Python skill scripts`scripts/`Build, release, and utility scripts`docs/`Mintlify documentation source`dist/`Built output (generated, not committed)`.github/`CI workflows, actions, issue/PR templates
The repository structure, as described in `AGENTS.md`, keeps plugin-only dependencies in the extension's own `package.json`. Core `package.json` dependencies should only include things the core uses directly.

**Monorepo structure diagram:**

```

```

Sources: [AGENTS.md10-22](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L10-L22)

---

## Toolchain & Prerequisites
ToolMinimum VersionNotesNode.js22+Required runtime baselinepnpm10.23.0Primary package manager; use lockfileBun1.3.9+Preferred for TypeScript execution and testsPython3.12Used for skill scripts (`skills/`) and CI tooling
Both Node and Bun paths must stay functional. `pnpm-lock.yaml` and Bun patching must be kept in sync when touching deps.

Sources: [AGENTS.md57-64](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L57-L64)

---

## Local Development Commands

These are the primary commands used during development. All commands run from the repo root.
CommandPurpose`pnpm install`Install all dependencies (uses lockfile)`pnpm openclaw ...`Run CLI in dev mode (via Bun)`pnpm dev`Alias for dev CLI run`pnpm build`Type-check and build `dist/``pnpm tsgo`TypeScript checks only`pnpm check`Types + lint + format (Oxlint + Oxfmt)`pnpm format`Check formatting only (oxfmt --check)`pnpm format:fix`Fix formatting in place (oxfmt --write)`pnpm test`Run all tests (Vitest)`pnpm test:coverage`Tests with V8 coverage report`pnpm release:check`Validate npm pack contents`prek install`Install pre-commit hooks (same checks as CI)
The `pnpm check` command must pass before commits. It runs the same type/lint/format checks as the CI `check` job.

**Key dev scripts:**

- Mac packaging: `scripts/package-mac-app.sh` (defaults to current arch)
- Commit helper: `scripts/committer "<msg>" <file...>` (scopes staging correctly)
- Release validation: `node --import tsx scripts/release-check.ts`

Sources: [AGENTS.md55-71](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L55-L71)[docs/reference/RELEASING.md44-56](https://github.com/openclaw/openclaw/blob/17eaa59a/docs/reference/RELEASING.md#L44-L56)

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

Sources: [AGENTS.md73-84](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L73-L84)[AGENTS.md14-18](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L14-L18)

---

## Testing Guidelines

### Framework

- **Vitest** with V8 coverage thresholds: 70% lines, branches, functions, and statements.
- Test files are colocated with source: `*.test.ts` next to the source file.
- End-to-end tests: `*.e2e.test.ts`.

### Running Tests

```

```

Do not set test workers above 16. The CI sets `OPENCLAW_TEST_WORKERS=2` on Linux runners to prevent V8 OOM.

### Changelog and Test Additions

Pure test additions or fixes generally do **not** need a changelog entry unless they alter user-facing behavior or the operator asks for one.

Sources: [AGENTS.md94-104](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L94-L104)[.github/workflows/ci.yml186-241](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/ci.yml#L186-L241)

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

Sources: [AGENTS.md106-114](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L106-L114)[.github/workflows/labeler.yml39-127](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/labeler.yml#L39-L127)

---

## Multi-Agent Safety Rules

When multiple agents work the same repository simultaneously:

- Do **not** create, apply, or drop `git stash` entries unless explicitly requested (this includes `git pull --rebase --autostash`).
- Do **not** create, remove, or modify `git worktree` checkouts.
- Do **not** switch branches unless explicitly requested.
- When told "push", you may `git pull --rebase` to integrate latest changes; never discard other agents' work.
- When told "commit", scope to your changes only. When told "commit all", commit in grouped chunks.
- Running multiple agents is fine as long as each has its own session.

Sources: [AGENTS.md187-198](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L187-L198)

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
Sources: [AGENTS.md22](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L22-L22)[.github/labeler.yml1-20](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/labeler.yml#L1-L20)[scripts/sync-labels.ts10-18](https://github.com/openclaw/openclaw/blob/17eaa59a/scripts/sync-labels.ts#L10-L18)

---

## Version Locations

When bumping a version, update **all** of the following locations (never update `appcast.xml` unless cutting a new macOS Sparkle release):
FileField`package.json``version``apps/android/app/build.gradle.kts``versionName`, `versionCode``apps/ios/Sources/Info.plist``CFBundleShortVersionString`, `CFBundleVersion``apps/ios/Tests/Info.plist``CFBundleShortVersionString`, `CFBundleVersion``apps/macos/Sources/OpenClaw/Resources/Info.plist``CFBundleShortVersionString`, `CFBundleVersion``docs/install/updating.md`Pinned npm version
Sources: [AGENTS.md179-180](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L179-L180)

---

## Release Channels
ChannelTag Formatnpm dist-tagNotes`stable``vYYYY.M.D``latest`Tagged releases only`beta``vYYYY.M.D-beta.N``beta`May ship without macOS app`dev`(none)—Moving HEAD on `main`
For beta releases: publish npm with a matching beta version suffix (e.g., `YYYY.M.D-beta.N`), not just `--tag beta` with a plain version number.

Sources: [AGENTS.md87-91](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L87-L91)

---

## Development Workflow Diagram

This diagram maps the standard contributor workflow to the concrete commands and files involved.

```

```

Sources: [AGENTS.md55-115](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L55-L115)[.github/workflows/ci.yml1-30](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/ci.yml#L1-L30)

---

## Code Entity Map

This diagram maps the major development toolchain touchpoints to the concrete files and scripts that implement them.

```

```

Sources: [AGENTS.md55-84](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L55-L84)[AGENTS.md172-173](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L172-L173)[.github/workflows/ci.yml127-150](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/ci.yml#L127-L150)

---

## Shorthand Commands
ShorthandBehavior`sync`If working tree dirty, commit all changes with a Conventional Commit message, then `git pull --rebase`. If rebase conflicts cannot be resolved, stop. Otherwise `git push`.
### Git Notes

- If `git branch -d/-D <branch>` is policy-blocked, delete the local ref directly:`git update-ref -d refs/heads/<branch>`
- Bulk PR close/reopen safety: if a close action would affect more than 5 PRs, ask for explicit confirmation with the exact count and target scope before proceeding.

Sources: [AGENTS.md117-123](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L117-L123)

---

## Documentation Guidelines

Docs live in `docs/` and are hosted on Mintlify at `docs.openclaw.ai`.

- Internal doc links: root-relative, no `.md`/`.mdx` extension. Example: `<FileRef file-url="https://github.com/openclaw/openclaw/blob/17eaa59a/Config" undefined  file-path="Config">Hii</FileRef>`
- Anchors: root-relative path with anchor. Example: `<FileRef file-url="https://github.com/openclaw/openclaw/blob/17eaa59a/Hooks" undefined  file-path="Hooks">Hii</FileRef>`
- Avoid em dashes (`—`) and apostrophes in headings — they break Mintlify anchor links.
- README (GitHub): use absolute `https://docs.openclaw.ai/...` URLs so links work on GitHub.
- Content must be generic: no personal device names, hostnames, or paths. Use placeholders like `user@gateway-host`.
- `docs/zh-CN/**` is auto-generated. Do not edit unless explicitly asked.

Sources: [AGENTS.md24-43](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L24-L43)

---

## Secret Scanning & Security

- Secrets are scanned on every CI run using `detect-secrets` against `.secrets.baseline`.
- Private keys are detected by `pre-commit run --all-files detect-private-key`.
- Changed GitHub workflows are audited with `zizmor`.
- Production dependencies are audited with `pnpm-audit-prod`.
- Never commit real phone numbers, videos, or live config values. Use obviously fake placeholders in docs, tests, and examples.

For the full security model and audit tooling, see page [7](/openclaw/openclaw/7-control-ui) and page [7.1](/openclaw/openclaw/7.1-ui-overview).

Sources: [.github/workflows/ci.yml349-401](https://github.com/openclaw/openclaw/blob/17eaa59a/.github/workflows/ci.yml#L349-L401)[AGENTS.md134-140](https://github.com/openclaw/openclaw/blob/17eaa59a/AGENTS.md#L134-L140)
