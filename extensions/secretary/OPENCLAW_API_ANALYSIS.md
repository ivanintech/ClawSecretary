# OpenClaw Native APIs Available for Integration

**Date:** March 17, 2026
**Status:** 6/9 integrations completed (67%)

---

## Overview

Based on analysis of OpenClaw Core Runtime APIs (`src/plugins/runtime/types-core.ts` and `types-channel.ts`), this document identifies **all available native APIs** that Secretary Extension can leverage to achieve maximum integration.

---

## ✅ Already Completed Integrations (6/9)

### 1. Media Understanding API ✅
**Status:** COMPLETED
**API:** `api.runtime.mediaUnderstanding.*`
- `transcribeAudioFile()` - Transcription with custom models
- `describeImageFile()` - Image analysis
- `describeVideoFile()` - Video analysis
- `runFile()` - Generic media understanding

### 2. Web Search API ✅
**Status:** COMPLETED
**API:** `api.runtime.webSearch.*`
- `search()` - Native web search (multi-provider)
- `listProviders()` - List available providers

### 3. Image Generation API ✅
**Status:** COMPLETED
**API:** `api.runtime.imageGeneration.*`
- `generate()` - Generate images
- `listProviders()` - List image generation providers

### 4. WhatsApp Native Channel ✅
**Status:** COMPLETED (verified)
**API:** `api.runtime.channel.whatsapp.*`
- `sendMessageWhatsApp()` - Send WhatsApp messages
- `sendPollWhatsApp()` - Send polls
- `loginWeb()` / `startWebLoginWithQr()` - Authentication

### 5. Enhanced TTS (Voice Selection) ✅
**Status:** COMPLETED
**API:** `api.runtime.tts.*`
- `textToSpeech()` - Text to speech
- `textToSpeechTelephony()` - Telephony TTS
- `listVoices()` - List available voices with context-aware selection

### 6. Subagent Runtime ✅
**Status:** COMPLETED
**API:** `api.runtime.subagent.*`
- `run()` - Launch subagent
- `waitForRun()` - Wait for subagent completion
- `getSessionMessages()` - Retrieve session messages
- `deleteSession()` - Delete session

---

## 🟡 Integrations In Progress (3/9)

### 7. Session Management APIs 🟡
**Status:** PENDING (Next Priority)
**API:** `api.runtime.agent.session.*`
- `resolveStorePath()` - Resolve session store path
- `loadSessionStore()` - Load session store
- `saveSessionStore()` - Save session store
- `resolveSessionFilePath()` - Resolve session file path

**Current State:**
- Secretary uses custom WAL with `SESSION-STATE.md` (lines 40-66 in `wal-helpers.ts`)
- Custom `updateSessionState()`, `appendWorkingBuffer()`, `searchDeepMemory()` functions

**Integration Benefits:**
- Native session management with OpenClaw
- Better cross-session coordination
- Native session file handling
- Reduced custom code

**Estimated Effort:** 3-4 hours

### 8. Cron/Scheduled Tasks 🟡
**Status:** PENDING
**API:** `api.runtime.system.*`
- `requestHeartbeatNow()` - Request immediate heartbeat
- `enqueueSystemEvent()` - Enqueue system events (NEW - not in original matrix)

**Current State:**
- Partial heartbeats mentioned
- No scheduled briefing implementation

**Integration Benefits:**
- Scheduled briefings (morning, evening)
- Automated workflow triggering
- Native event handling

**Estimated Effort:** 2-3 hours

### 9. Canvas/Nodes Runtime 🟢
**Status:** OPTIONAL
**API:** Not directly exposed in `types-core.ts` (may be in `runtime.ts` or other)
- May be available via `api.runtime.canvas.*` or `api.runtime.nodes.*`

**Integration Benefits:**
- Visual briefings
- Device control visualization

**Estimated Effort:** 8-12 hours

---

## 🆕 Additional Native APIs Available (Not in Original Matrix)

### Text Processing APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.channel.text.*`
- `chunkByNewline()` - Chunk text by newlines
- `chunkMarkdownText()` - Chunk Markdown text
- `chunkText()` - Chunk general text
- `chunkMarkdownTextWithMode()` - Chunk Markdown with mode
- `chunkTextWithMode()` - Chunk text with mode
- `resolveChunkMode()` - Resolve chunk mode
- `resolveTextChunkLimit()` - Resolve text chunk limit
- `hasControlCommand()` - Detect control commands
- `resolveMarkdownTableMode()` - Resolve Markdown table mode
- `convertMarkdownTables()` - Convert Markdown tables

**Use Case for Secretary:**
- Better email processing (chunking long emails)
- Improved document analysis
- Parse structured text (tables, commands)
- Enhanced WhatsApp message handling

**Estimated Effort:** 1-2 hours (NEW - High Impact)

### Routing APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.channel.routing.*`
- `buildAgentSessionKey()` - Build session key
- `resolveAgentRoute()` - Resolve agent routing

**Use Case for Secretary:**
- Better session management
- Multi-agent routing scenarios
- Parallel subagent session key management

**Estimated Effort:** 1 hour (NEW - Low Impact, already partly using in parallel subagent helper)

### Reply Dispatcher APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.channel.reply.*`
- `dispatchReplyWithBufferedBlockDispatcher()` - Dispatch replies
- `createReplyDispatcherWithTyping()` - Create dispatcher with typing
- `resolveEffectiveMessagesConfig()` - Resolve message config
- `resolveHumanDelayConfig()` - Resolve human delay config
- `dispatchReplyFromConfig()` - Dispatch from config
- `withReplyDispatcher()` - Wrap with dispatcher
- `finalizeInboundContext()` - Finalize inbound context
- `formatAgentEnvelope()` - Format agent envelope
- `formatInboundEnvelope()` - Format inbound envelope (deprecated)
- `resolveEnvelopeFormatOptions()` - Resolve format options

**Use Case for Secretary:**
- Better WhatsApp message dispatch
- Typing indicators
- Delay management
- Context formatting

**Estimated Effort:** 2-3 hours (NEW - Medium Impact)

### Events APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.events.*`
- `onAgentEvent()` - Listen to agent events
- `onSessionTranscriptUpdate()` - Listen to transcript updates

**Use Case for Secretary:**
- Real-time monitoring of agent activity
- Auto-save on transcript updates
- Integrated analytics

**Estimated Effort:** 1-2 hours (NEW - Medium Impact)

### Logging APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.logging.*`
- `shouldLogVerbose()` - Check verbose logging
- `getChildLogger()` - Get child logger with bindings

**Use Case for Secretary:**
- Better logging structure
- Component-specific logging
- Improved debugging

**Estimated Effort:** 1 hour (NEW - Low Impact)

### State Management APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.state.*`
- `resolveStateDir()` - Resolve state directory

**Use Case for Secretary:**
- Native state directory resolution
- Better path management

**Estimated Effort:** 30 minutes (NEW - Very Low Impact)

### Command Authorization APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.channel.commands.*`
- `resolveCommandAuthorizedFromAuthorizers()` - Resolve command auth
- `isControlCommandMessage()` - Check control command
- `shouldComputeCommandAuthorized()` - Should compute auth
- `shouldHandleTextCommands()` - Should handle text commands

**Use Case for Secretary:**
- Command gating for Secretary actions
- Control command detection
- Better security

**Estimated Effort:** 2-3 hours (NEW - Medium Impact)

### Group Policy APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.channel.groups.*`
- `resolveGroupPolicy()` - Resolve group policy
- `resolveRequireMention()` - Resolve mention requirement

**Use Case for Secretary:**
- Better group/chat handling
- Mention-based triggers

**Estimated Effort:** 1 hour (NEW - Low Impact)

### Mentions APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.channel.mentions.*`
- `buildMentionRegexes()` - Build mention regexes
- `matchesMentionPatterns()` - Match mention patterns
- `matchesMentionWithExplicit()` - Match with explicit

**Use Case for Secretary:**
- @mention detection in WhatsApp
- Trigger actions when mentioned

**Estimated Effort:** 1-2 hours (NEW - Medium Impact)

### Activity Monitoring APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.channel.activity.*`
- `record()` - Record channel activity
- `get()` - Get channel activity

**Use Case for Secretary:**
- Track user engagement
- Activity-based briefing triggers
- Usage analytics

**Estimated Effort:** 1 hour (NEW - Low Impact)

### Debounce APIs 🆕
**Status:** NOT INTEGRATED
**API:** `api.runtime.channel.debounce.*`
- `createInboundDebouncer()` - Create debouncer
- `resolveInboundDebounceMs()` - Resolve debounce timing

**Use Case for Secretary:**
- Prevent duplicate briefing triggers
- Rate limiting

**Estimated Effort:** 1 hour (NEW - Low Impact)

### Multi-Channel Integration APIs 🆕
**Status:** PARTIALLY INTEGRATED (WhatsApp only)

**Discord Integration:** `api.runtime.channel.discord.*`
- `messageActions()` - Message actions
- `auditChannelPermissions()` - Audit permissions
- `listDirectoryGroupsLive()` - List groups
- `listDirectoryPeersLive()` - List peers
- `sendMessageDiscord()` - Send message
- `sendPollDiscord()` - Send poll
- `monitorDiscordProvider()` - Monitor provider
- And more...

**Telegram Integration:** `api.runtime.channel.telegram.*`
- `auditGroupMembership()` - Audit groups
- `probeTelegram()` - Probe connection
- `sendMessageTelegram()` - Send message
- `sendPollTelegram()` - Send poll
- `monitorTelegramProvider()` - Monitor provider
- `messageActions()` - Message actions
- `typing.pulse()` / `typing.start()` - Typing indicators
- `conversationActions.*` - Edit/delete/pin messages
- And more...

**Slack Integration:** `api.runtime.channel.slack.*`
- `listDirectoryGroupsLive()` - List groups
- `listDirectoryPeersLive()` - List peers
- `probeSlack()` - Probe connection
- `sendMessageSlack()` - Send message
- `monitorSlackProvider()` - Monitor provider
- `handleSlackAction()` - Handle actions

**Signal Integration:** `api.runtime.channel.signal.*`
- `probeSignal()` - Probe connection
- `sendMessageSignal()` - Send message
- `monitorSignalProvider()` - Monitor provider

**iMessage Integration:** `api.runtime.channel.imessage.*`
- `probeIMessage()` - Probe connection
- `sendMessageIMessage()` - Send message
- `monitorIMessageProvider()` - Monitor provider

**Line Integration:** `api.runtime.channel.line.*`
- `listLineAccountIds()` - List accounts
- `resolveDefaultLineAccountId()` - Resolve default account
- `probeLineBot()` - Probe connection
- `sendMessageLine()` - Send message
- `pushMessagesLine()` - Push multiple messages
- `pushFlexMessage()` - Push rich messages
- And more...

**Use Case for Secretary:**
- Multi-channel briefings (not just WhatsApp)
- Cross-platform notifications
- Unified assistant experience

**Estimated Effort:** 8-12 hours per channel (NEW - High Impact for multi-channel support)

---

## Updated Integration Priority Matrix

### High Priority (Core Functionality)
| # | API/Feature | Status | Impact | Effort | Priority |
|---|-------------|--------|---------|--------|----------|
| ✅ 1 | Media Understanding | COMPLETED | HIGH | 2-4h | P1 |
| ✅ 2 | Web Search | COMPLETED | HIGH | 1-2h | P1 |
| ✅ 3 | Image Generation | COMPLETED | HIGH | 4-6h | P1 |
| ✅ 4 | WhatsApp Native | COMPLETED | HIGH | 2-3h | P1 |
| ✅ 5 | Enhanced TTS | COMPLETED | MEDIUM | 1-2h | P1 |
| ✅ 6 | Subagent Runtime | COMPLETED | MEDIUM | 4-6h | P1 |
| 🟡 7 | Session Management | PENDING | HIGH | 3-4h | P1 |
| 🟡 8 | Cron/Scheduled Tasks | PENDING | MEDIUM | 2-3h | P1 |
| 🆕 9 | Text Processing | NEW | HIGH | 1-2h | P1 |
| 🆕 10 | Tools Memory APIs | VERIFY | HIGH | 1-2h | P1 |

### Medium Priority (Enhancements)
| # | API/Feature | Status | Impact | Effort | Priority |
|---|-------------|--------|---------|--------|----------|
| 🆕 11 | Reply Dispatcher | NEW | MEDIUM | 2-3h | P2 |
| 🆕 12 | Events Monitoring | NEW | MEDIUM | 1-2h | P2 |
| 🆕 13 | Command Authorization | NEW | MEDIUM | 2-3h | P2 |
| 🆕 14 | Mentions Detection | NEW | MEDIUM | 1-2h | P2 |

### Low Priority (Nice-to-Have)
| # | API/Feature | Status | Impact | Effort | Priority |
|---|-------------|--------|---------|--------|----------|
| 🆕 15 | Routing APIs | NEW | LOW | 1h | P3 |
| 🆕 16 | Group Policy | NEW | LOW | 1h | P3 |
| 🆕 17 | Activity Monitoring | NEW | LOW | 1h | P3 |
| 🆕 18 | Debounce | NEW | LOW | 1h | P3 |
| 🆕 19 | Logging APIs | NEW | LOW | 1h | P3 |
| 🆕 20 | State Management | NEW | LOW | 30min | P3 |

### Optional (Feature Creep)
| # | API/Feature | Status | Impact | Effort | Priority |
|---|-------------|--------|---------|--------|----------|
| 🟢 21 | Canvas/Nodes | OPTIONAL | LOW | 8-12h | P4 |
| 🆕 22 | Multi-Channel Integration | NEW | HIGH | 8-12h per channel | P4 |

---

## Summary

### Original Matrix vs. Expanded Analysis

**Original 9 Integrations:**
- 6/9 completed (67%)
- 3/9 pending (33%)

**Expanded Analysis:**
- 6/9 original integrations completed (67%)
- **14+ NEW potential integrations identified**
- **Text Processing** API has HIGH impact and LOW effort (1-2 hours) - should be added as P1
- **Multi-Channel Support** could transform Secretary from WhatsApp-only to truly multi-platform

### Recommendations

1. **Immediate Next Steps (Complete Original P1):**
   - Integration #7: Session Management APIs
   - Integration #8: Cron/Scheduled Tasks

2. **Quick Wins (New High Impact):**
   - Integration #9: Text Processing APIs (NEW - HIGH impact, LOW effort)
   - Integration #10: Tools Memory APIs (VERIFY - ensure using native memory_search correctly)

3. **Medium-Term Enhancements:**
   - Integration #11-14: Reply Dispatcher, Events, Command Auth, Mentions

4. **Long-Term Visions:**
   - Integration #21: Canvas/Nodes (visual briefings)
   - Integration #22: Multi-Channel Support (Discord, Telegram, Slack, etc.)

### Zero-Configuration Philosophy Check

All recommended integrations:
- ✅ Use native OpenClaw APIs
- ✅ No external dependencies
- ✅ Maintain zero-configuration philosophy
- ✅ Enhance core functionality

---

**Last Updated:** March 17, 2026
**Next Action:** Review Text Processing APIs (Integration #9) and Session Management APIs (Integration #7)