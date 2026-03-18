import type { OpenClawPluginApi } from "../../../src/plugins/types.js";

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
  return entry;
}

export function recallRelevantMemories(
  query: string,
  maxResults = 5,
): MemoryEntry[] {
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

export async function registerMemoryLifecycleHooks(api: OpenClawPluginApi): Promise<void> {
  api.logger.info(`[memory-lifecycle] Registering memory lifecycle hooks`);

  api.on("agent_end", async (event) => {
    try {
      const outcome = event.outcome || "";
      const duration = event.endedAt && event.startedAt
        ? Math.round((new Date(event.endedAt).getTime() - new Date(event.startedAt).getTime()) / 1000)
        : 0;

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

  api.on("before_agent_start", async (event) => {
    try {
      const relevant = recallRelevantMemories(event.prompt?.slice(0, 200) || "", 3);

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
