# OpenClaw Upstream Intelligence Report

**Date:** March 18, 2026
**Upstream Version:** `91d37ccfc3` (main)
**Sync Status:** ✅ Successfully merged (30 commits ahead)

---

## Executive Summary

Strategic synchronization with OpenClaw upstream completed successfully. The upstream has evolved significantly with:
- **Plugin SDK improvements** for better runtime integration
- **Enhanced session management** with depth tracking and role control
- **Advanced text processing** with paragraph-aware chunking
- **New extension patterns** for memory, activity tracking, and multi-channel support

**Key Finding:** Our Secretary extension is ahead of the curve - we've already integrated most of the new patterns (text processing, subagent runtime, channel APIs). Now we can leverage the **advanced session tracking** and **memory lifecycle hooks** for our exclusive features (P2P RSA, IoT, Ghost Write).

---

## Part 1: Sincronización Técnica

### Merge Results

```
Auto-merging: README.md, src/plugins/registry.ts, src/plugins/types.ts, src/wizard/setup.ts
Merge: 30 commits ahead, 0 conflicts
Status: ✅ Clean merge
```

### Files Modified in Merge

**Core Plugin System:**
- `src/plugins/registry.ts` - Plugin registration improvements
- `src/plugins/types.ts` - Type definitions updated
- `src/plugins/runtime/index.ts` - Gateway subagent late-binding

**Channel Runtimes:**
- `src/plugins/runtime/types-channel.ts` - Enhanced channel APIs
- `src/plugins/runtime/types-core.ts` - Core runtime improvements
- `src/plugins/runtime/types.ts` - Subagent runtime types

**Session Management:**
- `src/config/sessions/types.ts` - Session entry with depth/role tracking
- `src/config/sessions/store.ts` - TTL caching, atomic writes, disk budget
- `src/config/sessions/transcript.ts` - Transcript append APIs

**Text Processing:**
- `src/auto-reply/chunk.ts` - Paragraph-aware chunking, markdown-safe splitting
- `src/markdown/fences.ts` - Fence-safe break detection

**Documentation:**
- `docs/plugins/building-extensions.md` - New extension building guide
- `docs/tools/plugin.md` - Updated plugin documentation

---

## Part 2: Novedades del Core

### 2.1 Plugin SDK Improvements

#### Gateway Subagent Late-Binding
**File:** `src/plugins/runtime/index.ts:60-131`

```typescript
// Process-global gateway subagent runtime with late-binding
export function setGatewaySubagentRuntime(subagent: PluginRuntime["subagent"]): void;
export function clearGatewaySubagentRuntime(): void;
export function getGatewaySubagentRuntime(): PluginRuntime["subagent"];
```

**Secretary Use Case:** 
- Late-binding allows subagent runtime to be configured after plugin initialization
- Enables dynamic subagent orchestration for P2P RSA coordination
- Zero-configuration by default, with runtime override capability

#### Subagent Runtime Enhanced
**File:** `src/plugins/runtime/types.ts:53-63`

```typescript
subagent: {
  run: (params: SubagentRunParams) => Promise<SubagentRunResult>;
  waitForRun: (params: SubagentWaitParams) => Promise<SubagentWaitResult>;
  getSessionMessages: (params: SubagentGetSessionMessagesParams) => Promise<SubagentGetSessionMessagesResult>;
  deleteSession: (params: SubagentDeleteSessionParams) => Promise<void>;  // NEW
}
```

**Secretary Use Case:**
- `deleteSession()` enables cleanup of P2P RSA negotiation sessions
- Better session lifecycle management for autonomous operations

### 2.2 Session Management Evolution

#### Session Entry with Subagent Hierarchy
**File:** `src/config/sessions/types.ts`

```typescript
export type SessionEntry = {
  // ... existing fields
  
  // NEW: Subagent hierarchy tracking
  spawnDepth?: number;                    // 0=main, 1=sub-agent, 2+...
  subagentRole?: "orchestrator" | "leaf";
  subagentControlScope?: "children" | "none";
  
  // NEW: Parent session linking
  spawnedBy?: string;                     // Parent session ID
  spawnedWorkspaceDir?: string;
};
```

**Secretary Use Case:**
- `spawnDepth` enables hierarchical P2P RSA coordination
- `subagentRole` distinguishes orchestrator vs leaf agents in multi-device scenarios
- `spawnedBy` links child sessions to parent for audit trails

#### Session Store Improvements
**File:** `src/config/sessions/store.ts`

```typescript
// NEW: TTL-cached loading
const DEFAULT_SESSION_STORE_TTL_MS = 45_000;

// NEW: Windows-safe atomic writes with retry
if (process.platform === "win32") {
  for (let i = 0; i < 5; i++) {
    try {
      await writeSessionStoreAtomic(...);
      return;
    } catch { /* retry with backoff */ }
  }
}

// NEW: Session maintenance
pruneStaleEntries();
capEntryCount();
rotateSessionFile();
enforceSessionDiskBudget();
```

**Secretary Use Case:**
- TTL caching improves performance for frequent session reads
- Windows compatibility for cross-platform IoT control
- Disk budget prevents unbounded session storage

#### Transcript Append API
**File:** `src/config/sessions/transcript.ts`

```typescript
export async function appendAssistantMessageToSessionTranscript(params: {
  agentId?: string;
  sessionKey: string;
  text?: string;
  mediaUrls?: string[];
  idempotencyKey?: string;
}): Promise<{ ok: true; sessionFile: string } | { ok: false; reason: string }>
```

**Secretary Use Case:**
- Structured transcript append for Ghost Write documents
- Idempotent operations prevent duplicate entries
- Media URL support for embedding generated assets

### 2.3 Advanced Text Processing

#### Paragraph-Aware Chunking
**File:** `src/auto-reply/chunk.ts:178-242`

```typescript
export function chunkByParagraph(
  text: string,
  limit: number,
  opts?: { splitLongParagraphs?: boolean },
): string[]
```

**Features:**
- Breaks only on blank lines (`\n\n+`)
- Preserves fenced code blocks intact
- Falls back to length-based splitting for long paragraphs

**Secretary Use Case:**
- Ghost Write documents with proper paragraph boundaries
- Email body chunking that preserves logical sections
- Meeting notes with structured formatting

#### Markdown-Safe Chunking
**File:** `src/auto-reply/chunk.ts:254-300`

```typescript
export function chunkMarkdownTextWithMode(
  text: string,
  limit: number,
  mode: ChunkMode,
): string[]
```

**Features:**
- Parses fence spans before splitting
- Reopens fences at break boundaries
- Respects fence indentation markers

**Secretary Use Case:**
- P2P message relay with code block preservation
- Briefing documents with syntax-highlighted examples
- Technical documentation generation

#### Chunk Mode Configuration
**File:** `src/auto-reply/chunk.ts:22`

```typescript
export type ChunkMode = "length" | "newline";
```

**Mode Behavior:**
- `"length"`: Split only when exceeding limit (default)
- `"newline"`: Prefer breaking on paragraph boundaries, unless text exceeds limit

**Secretary Use Case:**
- Configurable chunking for different message types
- Per-channel mode configuration in WhatsApp/Telegram/Discord

### 2.4 Memory Lifecycle Hooks

#### Auto-Recall Pattern
**File:** `extensions/memory-lancedb/index.ts:548-571`

```typescript
if (cfg.autoRecall) {
  api.on("before_agent_start", async (event) => {
    const vector = await embeddings.embed(event.prompt);
    const results = await db.search(vector, 3, 0.3);
    return {
      prependContext: formatRelevantMemoriesContext(results),
    };
  });
}
```

**Secretary Use Case:**
- Persistent context across P2P RSA negotiations
- IoT command history recall
- Ghost Write document reference

#### Auto-Capture Pattern
**File:** `extensions/memory-lancedb/index.ts:576-590`

```typescript
if (cfg.autoCapture) {
  api.on("agent_end", async (event) => {
    // Filter user messages for capturable content
    // Store with category detection
  });
}
```

**Secretary Use Case:**
- Automatic preference learning
- Decision tracking for audit trails
- Entity extraction for CRM integration

#### Prompt Injection Guard
**File:** `extensions/memory-lancedb/index.ts:204-227`

```typescript
const PROMPT_INJECTION_PATTERNS = [
  /ignore (all|any|previous|above|prior) instructions/i,
  /do not follow (the )?(system|developer)/i,
  /disregard (all|previous) (instructions|commands)/i,
  /new instructions?:/i,
  /you (are|should act as) (?:a )?different/i,
  // ...
];
```

**Secretary Use Case:**
- Security hardening for P2P RSA message parsing
- IoT command validation
- Ghost Write content filtering

### 2.5 Activity Tracking APIs

**File:** `src/plugins/runtime/types-channel.ts:62-65`

```typescript
activity: {
  record: typeof recordChannelActivity;
  get: typeof getChannelActivity;
}
```

**Secretary Use Case:**
- Track IoT device interaction patterns
- Monitor P2P connection health
- Analytics for proactive briefings

### 2.6 New Extension Patterns

#### Zalo Target Normalization
**File:** `extensions/zalouser/src/channel.ts:59-129`

```typescript
function normalizeTarget(input: string): NormalizedTarget {
  // Flexible targeting with prefixes
  // "group:123" → { type: "group", id: "123" }
  // "g:123" → { type: "group", id: "123" }
  // "123" → auto-detect based on prefix patterns
}
```

**Secretary Use Case:**
- Unified target resolution for multi-channel messaging
- Phone number normalization for WhatsApp/ Signal
- Room/venue ID parsing for IoT commands

#### Mattermost Runtime Store Pattern
**File:** `extensions/mattermost/src/runtime.ts`

```typescript
import { createPluginRuntimeStore } from "openclaw/plugin-sdk/runtime-store";
const { setRuntime, getRuntime } = createPluginRuntimeStore<PluginRuntime>("...");
```

**Secretary Use Case:**
- Centralized runtime state management
- Type-safe runtime access
- Cross-component communication

---

## Part 3: Potencial de Integración

### 3.1 Para P2P RSA

| Oportunidad | API | Prioridad |
|------------|-----|-----------|
| Session hierarchy tracking | `SessionEntry.spawnDepth`, `subagentRole` | 🟡 HIGH |
| Subagent lifecycle management | `runtime.subagent.deleteSession()` | 🟢 MEDIUM |
| Late-binding subagent runtime | `setGatewaySubagentRuntime()` | 🟢 MEDIUM |
| Prompt injection guard | Pattern from `memory-lancedb` | 🟡 HIGH |

**Recommended Actions:**
1. Update `wal-helpers.ts` to use `spawnDepth` for P2P negotiation hierarchy
2. Add `subagentRole` to track orchestrator vs. peer agents
3. Implement prompt injection guard in message parsing

### 3.2 Para IoT

| Oportunidad | API | Prioridad |
|------------|-----|-----------|
| Activity tracking | `runtime.channel.activity.record/get` | 🟡 HIGH |
| Session state persistence | `recordInboundSession()` | 🟢 MEDIUM |
| Per-account config | `resolveTextChunkLimit(..., accountId)` | 🟢 LOW |
| Target normalization | Pattern from `zalouser` | 🟢 LOW |

**Recommended Actions:**
1. Add activity tracking to `helpers/iot.ts` for device interaction patterns
2. Use session metadata for device state persistence
3. Implement target normalization for unified IoT command routing

### 3.3 Para Ghost Write

| Oportunidad | API | Prioridad |
|------------|-----|-----------|
| Paragraph-aware chunking | `chunkByParagraph()` | 🟡 HIGH |
| Markdown-safe chunking | `chunkMarkdownTextWithMode()` | 🟡 HIGH |
| Transcript append | `appendAssistantMessageToSessionTranscript()` | 🟡 HIGH |
| Memory lifecycle hooks | `before_agent_start`, `agent_end` | 🟡 HIGH |

**Recommended Actions:**
1. Replace custom text chunking with `chunkByParagraph()` in document generation
2. Use `appendAssistantMessageToSessionTranscript()` for Ghost Write audit trail
3. Implement auto-recall pattern for document reference
4. Add auto-capture for Ghost Write decisions

### 3.4 Para Long-term Memory

| Oportunidad | API | Prioridad |
|------------|-----|-----------|
| Auto-recall hook | `before_agent_start` | 🟡 HIGH |
| Auto-capture hook | `agent_end` | 🟡 HIGH |
| Category detection | `detectCategory()` | 🟡 HIGH |
| Similarity thresholds | 0.95 duplicate, 0.7 candidate | 🟢 MEDIUM |

**Recommended Actions:**
1. Add memory lifecycle hooks to orchestrator initialization
2. Implement category detection for preferences/decisions/facts
3. Use similarity thresholds to avoid duplicate memory entries

---

## Part 4: Propuesta de Evolución

### Phase 3: Memory & Lifecycle Integration

**Objective:** Implement native memory lifecycle hooks and session hierarchy for all exclusive features.

**Timeline:** 1-2 weeks

**Tasks:**
1. **Memory Lifecycle Hooks** (3-4 hours) - ✅ COMPLETED
   - Add `before_agent_start` hook for memory recall
   - Add `agent_end` hook for memory capture
   - Implement prompt injection guard

2. **Session Hierarchy** (4-6 hours) - ✅ COMPLETED (Phase 2)
   - Update P2P RSA to use `spawnDepth` and `subagentRole`
   - Add parent-child session linking for negotiations
   - Implement subagent cleanup with `deleteSession()`

3. **Ghost Write Enhancement** (4-6 hours) - ✅ COMPLETED (Phase 2)
   - Use `chunkByParagraph()` for document generation
   - Implement transcript append for audit trail
   - Add memory reference for document continuity

### Phase 4: Activity Intelligence

**Objective:** Add activity tracking and analytics for proactive briefings.

**Timeline:** 1-2 weeks

**Tasks:**
1. **IoT Activity Tracking** (2-3 hours) - ✅ COMPLETED
   - Integrate `runtime.channel.activity.record()` in IoT helpers
   - Build activity analytics for device usage patterns

2. **P2P Connection Health** (2-3 hours) - 🔄 Planned
   - Track connection events with activity APIs
   - Build health dashboard from activity data

3. **Proactive Analytics** (4-6 hours) - 🔄 Planned
   - Use activity patterns for briefing insights
   - Build recommendation engine from interaction data

### Phase 5: Advanced Text Processing

**Objective:** Leverage advanced chunking for better document and message handling.

**Timeline:** 1 week

**Tasks:**
1. **Paragraph Chunking** (2-3 hours)
   - Replace custom chunking with `chunkByParagraph()`
   - Add paragraph-aware email processing

2. **Markdown Safety** (2-3 hours)
   - Use `chunkMarkdownTextWithMode()` for P2P relay
   - Implement fence-safe code block handling

3. **Target Normalization** (2-3 hours)
   - Add unified target parsing
   - Support prefixes for all channels

---

## Part 5: Análisis Competitivo

### Our Advantages vs. Standard Extensions

| Feature | Secretary | Standard Extension |
|---------|----------|-------------------|
| P2P RSA Coordination | ✅ Custom implementation | ❌ Not available |
| IoT Integration | ✅ Hue/Sonos/PhilipsHue | ❌ Not available |
| Ghost Write | ✅ Automated closure shadowing | ❌ Not available |
| WAL Protocol | ✅ SESSION-STATE.md | ❌ Not available |
| Session Hierarchy | ✅ Implemented | ❌ Not available |
| Activity Tracking | ✅ Implemented | ❌ Not available |
| Memory Lifecycle | ✅ Implemented | ❌ Not available |

**Conclusion:** Secretary is ahead of standard extensions in exclusive features. Now we need to **leverage upstream APIs** to make these features more robust and maintainable.

### Integration Strategy

**Don't reinvent - integrate:**
- ✅ Use `chunkByParagraph()` instead of custom text processing
- ✅ Use `appendAssistantMessageToSessionTranscript()` for audit trails
- ✅ Use `runtime.channel.activity.record()` for IoT tracking
- ✅ Use `SessionEntry.spawnDepth` for P2P hierarchy

**Keep exclusive:**
- 🔐 P2P RSA encryption and key exchange
- 🔐 IoT device integration (Hue, Sonos, etc.)
- 🔐 Ghost Write workflow automation
- 🔐 WAL protocol implementation

---

## Part 6: Archivos Clave Referenciados

| Categoría | Archivos |
|-----------|---------|
| Plugin SDK Core | `src/plugins/types.ts`, `src/plugins/runtime/index.ts` |
| Runtime Types | `src/plugins/runtime/types.ts`, `src/plugins/runtime/types-channel.ts`, `src/plugins/runtime/types-core.ts` |
| Text Processing | `src/auto-reply/chunk.ts` |
| Session Management | `src/config/sessions/types.ts`, `src/config/sessions/store.ts`, `src/config/sessions/transcript.ts` |
| Extension Patterns | `extensions/memory-lancedb/index.ts`, `extensions/mattermost/src/runtime.ts`, `extensions/zalouser/src/channel.ts` |
| Markdown Utilities | `src/markdown/fences.ts` |

---

## Recomendaciones Inmediatas

### Alta Prioridad (Esta Semana) ✅ COMPLETADO

1. **Add Session Hierarchy to P2P RSA** ✅
   - Update `negotiation.ts` to use `spawnDepth` and `subagentRole` ✅
   - Implement subagent cleanup ✅

2. **Implement Ghost Write Transcript Append** ✅
   - Use `appendAssistantMessageToSessionTranscript()` in `handleFinalizeClosure()` ✅
   - Add idempotency keys for safe retries ✅

3. **Replace Custom Chunking** ✅
   - Update `text-processor.ts` to use `chunkByParagraph()` ✅
   - Add paragraph-aware mode for Ghost Write ✅

### Media Prioridad (Próxima Semana)

4. **Add Memory Lifecycle Hooks**
   - Integrate `before_agent_start` and `agent_end` hooks
   - Implement auto-capture for preferences

5. **Add Activity Tracking to IoT**
   - Integrate `runtime.channel.activity.record()` in `helpers/iot.ts`
   - Build usage analytics

### Baja Prioridad (Futuro)

6. **Target Normalization**
   - Add unified target parsing
   - Support channel-specific prefixes

7. **Advanced Analytics**
   - Build proactive briefing from activity data
   - Implement recommendation engine

---

## Conclusión

La sincronización con upstream fue exitosa. Secretary tiene una ventaja competitiva significativa en características exclusivas (P2P RSA, IoT, Ghost Write). Las **3 recomendaciones de Alta Prioridad han sido completadas**:

✅ **Session Hierarchy for P2P RSA**
- registerSessionHierarchy() con spawnDepth/subagentRole
- cleanupSessionHierarchy() con deleteSession() API
- P2P negotiations ahora tienen audit trail

✅ **Ghost Write Transcript Append**
- appendGhostWriteTranscript() con API nativa
- syncGhostWriteToSecondBrain() unificado
- Idempotency keys para safe retries

✅ **Paragraph-Aware Chunking**
- chunkByParagraphForDocuments() con API nativa
- processGhostWriteDocument() para documentos
- Mejor preservación de estructura

**✅ Medium Priority COMPLETED:**
- Memory Lifecycle Hooks (before_agent_start, agent_end)
- IoT Activity Tracking (runtime.channel.activity)

**Próximo paso:** Phase 4 - P2P Connection Health y Proactive Analytics.

---

**Report Generated:** March 18, 2026
**Last Updated:** March 18, 2026 (Medium Priority Completed)
**Next Review:** After Phase 4 completion
