import type { OpenClawPluginApi } from "../../../../src/plugins/types.js";

const PROMPT_INJECTION_PATTERNS = [
  /ignore (all|any|previous|above|prior) instructions/i,
  /do not follow (the )?(system|developer)/i,
  /disregard (all|previous) (instructions|commands)/i,
  /new instructions?:/i,
  /you (are|should act as) (?:a )?different/i,
];

export type MemoryCategory = "preference" | "decision" | "fact" | "entity" | "other";

export interface MemoryEntry {
  id: string;
  content: string;
  category: MemoryCategory;
  timestamp: string;
  source?: string;
  confidence?: number;
}

const memoryCache = new Map<string, MemoryEntry>();

let nativeToolsRegistered = false;

export function looksLikePromptInjection(text: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

export function detectCategory(text: string): MemoryCategory {
  const lower = text.toLowerCase();

  if (/prefer|prefiero|me gusta|i like|i prefer/i.test(lower)) {
    return "preference";
  }
  if (/decided|decidí|elegí|i chose|i decided/i.test(lower)) {
    return "decision";
  }
  if (/person|people|team|contact|email|phone/i.test(lower)) {
    return "entity";
  }
  if (/fact|info|data|information|record/i.test(lower)) {
    return "fact";
  }

  return "other";
}

export async function captureMemoryFromText(
  api: OpenClawPluginApi,
  text: string,
  source?: string,
): Promise<MemoryEntry | null> {
  if (looksLikePromptInjection(text)) {
    api.logger.warn(`[memory-lifecycle] Rejected prompt injection attempt`);
    return null;
  }

  const category = detectCategory(text);
  const entry: MemoryEntry = {
    id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    content: text.slice(0, 500),
    category,
    timestamp: new Date().toISOString(),
    source,
    confidence: 0.8,
  };

  memoryCache.set(entry.id, entry);
  
  await storeToNativeMemory(api, entry);

  return entry;
}

async function storeToNativeMemory(api: OpenClawPluginApi, entry: MemoryEntry): Promise<void> {
  if (!api.runtime.tools?.createMemorySearchTool) {
    api.logger?.debug(`[memory-lifecycle] Native memory tools not available, using cache only`);
    return;
  }

  try {
    const memoryPath = api.resolvePath(`./memory/${entry.category}s.md`);
    const timestamp = new Date().toISOString().slice(0, 10);
    const content = `\n## [${timestamp}] ${entry.source || "captured"}\n\n${entry.content}\n`;
    
    const fs = (api.runtime as any).fs;
    if (fs?.readFile && fs?.writeFile) {
      const existing = await fs.readFile(memoryPath).catch(() => "");
      await fs.writeFile(memoryPath, existing + content);
      api.logger?.debug(`[memory-lifecycle] Stored to native memory: ${memoryPath}`);
    }
  } catch (err: any) {
    api.logger.warn(`[memory-lifecycle] Failed to store to native memory: ${err.message}`);
  }
}

export async function recallRelevantMemories(
  api: OpenClawPluginApi,
  query: string,
  maxResults = 5,
): Promise<MemoryEntry[]> {
  const nativeResults = await recallFromNativeMemory(api, query, maxResults);
  
  if (nativeResults.length > 0) {
    api.logger.info(`[memory-lifecycle] Recalled ${nativeResults.length} memories from native backend`);
    return nativeResults;
  }

  return recallFromCache(query, maxResults);
}

async function recallFromNativeMemory(
  api: OpenClawPluginApi,
  query: string,
  maxResults: number,
): Promise<MemoryEntry[]> {
  if (!api.runtime.tools?.createMemorySearchTool) {
    return [];
  }

  try {
    const createTool = api.runtime.tools.createMemorySearchTool;
    if (!createTool) {
      return [];
    }

    const tool = createTool({
      config: api.config,
      agentSessionKey: undefined,
    });

    if (!tool || !tool.execute) {
      return [];
    }

    const result = await tool.execute("memory-lifecycle-recall", {
      query,
      maxResults,
    });

    const details = (result as any).details as { results?: any[] } | undefined;
    if (details?.results?.length) {
      return details.results.map((r: any, idx: number) => ({
        id: `native-${idx}`,
        content: r.snippet || r.text || "",
        category: detectCategory(r.snippet || r.text || "") as MemoryCategory,
        timestamp: r.path || new Date().toISOString(),
        source: "native_memory",
        confidence: r.score || 0.9,
      }));
    }

    return [];
  } catch (err: any) {
    api.logger?.debug(`[memory-lifecycle] Native memory recall failed: ${err.message}`);
    return [];
  }
}

function recallFromCache(query: string, maxResults: number): MemoryEntry[] {
  const queryWords = query.toLowerCase().split(/\s+/);
  const results: { entry: MemoryEntry; score: number }[] = [];

  for (const entry of memoryCache.values()) {
    const contentWords = entry.content.toLowerCase().split(/\s+/);
    const matches = queryWords.filter((qw) =>
      contentWords.some((cw) => cw.includes(qw) || qw.includes(cw)),
    ).length;

    if (matches > 0) {
      const score = matches / Math.max(queryWords.length, contentWords.length);
      results.push({ entry, score });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((r) => r.entry);
}

export function formatMemoriesForContext(memories: MemoryEntry[]): string {
  if (memories.length === 0) {
    return "";
  }

  const sections: string[] = [];

  const byCategory = memories.reduce((acc, mem) => {
    acc[mem.category] = acc[mem.category] || [];
    acc[mem.category].push(mem);
    return acc;
  }, {} as Record<string, MemoryEntry[]>);

  for (const [category, entries] of Object.entries(byCategory)) {
    sections.push(`\n### ${category.charAt(0).toUpperCase() + category.slice(1)}s`);
    for (const entry of entries) {
      sections.push(`- [${entry.timestamp}] ${entry.content}${entry.source ? ` (${entry.source})` : ""}`);
    }
  }

  return sections.join("\n");
}

async function registerNativeMemoryTools(api: OpenClawPluginApi): Promise<void> {
  if (!api.runtime.tools?.createMemorySearchTool || !api.runtime.tools?.createMemoryGetTool) {
    api.logger.info(`[memory-lifecycle] Native memory tools not available, using custom implementation`);
    return;
  }

  if (nativeToolsRegistered) {
    return;
  }

  try {
    const config = api.config;
    
    const memorySearchTool = api.runtime.tools.createMemorySearchTool({
      config,
      agentSessionKey: undefined,
    });

    const memoryGetTool = api.runtime.tools.createMemoryGetTool?.({
      config,
      agentSessionKey: undefined,
    });

    if (memorySearchTool) {
      api.registerTool(memorySearchTool);
      api.logger.info(`[memory-lifecycle] Registered native memory_search tool`);
    }

    if (memoryGetTool) {
      api.registerTool(memoryGetTool);
      api.logger.info(`[memory-lifecycle] Registered native memory_get tool`);
    }

    nativeToolsRegistered = true;
  } catch (err: any) {
    api.logger.warn(`[memory-lifecycle] Failed to register native memory tools: ${err.message}`);
  }
}

export async function registerMemoryLifecycleHooks(api: OpenClawPluginApi): Promise<void> {
  api.logger.info(`[memory-lifecycle] Registering memory lifecycle hooks`);

  await registerNativeMemoryTools(api);

  api.on("agent_end", async (event: { messages: unknown[]; success: boolean; error?: string; durationMs?: number }) => {
    try {
      const outcome = event.success ? "completed successfully" : `failed: ${event.error || "unknown"}`;
      const duration = event.durationMs ? Math.round(event.durationMs / 1000) : 0;

      const memoryEntry = await captureMemoryFromText(
        api,
        `Agent completed task: ${outcome} (${duration}s)`,
        "agent_end",
      );

      if (memoryEntry) {
        api.logger.info(
          `[memory-lifecycle] Captured ${memoryEntry.category} memory: "${memoryEntry.content.slice(0, 50)}..."`,
        );
      }
    } catch (err: any) {
      api.logger.warn(`[memory-lifecycle] Failed to capture agent_end memory: ${err.message}`);
    }
  });

  api.on("before_agent_start", async (event: { prompt: string; messages?: unknown[] }) => {
    try {
      const relevant = await recallRelevantMemories(api, event.prompt.slice(0, 200), 3);

      if (relevant.length > 0) {
        const context = formatMemoriesForContext(relevant);
        api.logger.info(
          `[memory-lifecycle] Recalled ${relevant.length} relevant memories for agent start`,
        );

        return {
          prependContext: `\n\n=== RELEVANT MEMORIES ===${context}\n===================\n`,
        };
      }
    } catch (err: any) {
      api.logger.warn(`[memory-lifecycle] Failed to recall memories: ${err.message}`);
    }
    return {};
  });

  api.logger.info(`[memory-lifecycle] Memory lifecycle hooks registered successfully`);
}

export function getMemoryStats(): { total: number; byCategory: Record<string, number> } {
  const byCategory: Record<string, number> = {};
  let total = 0;

  for (const entry of memoryCache.values()) {
    total++;
    byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
  }

  return { total, byCategory };
}

export function clearMemoryCache(): void {
  memoryCache.clear();
}
