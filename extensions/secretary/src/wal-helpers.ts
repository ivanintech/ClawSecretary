import fs from "node:fs/promises";
import path from "node:path";
import type { OpenClawPluginApi } from "../../../src/plugins/types.js";
import { STRINGS } from "./constants.js";

export type SubagentRole = "orchestrator" | "leaf" | "peer";

export interface SessionHierarchyEntry {
  sessionKey: string;
  role: SubagentRole;
  spawnDepth: number;
  parentSessionKey?: string;
  childSessionKeys: string[];
  createdAt: string;
  status: "active" | "completed" | "failed";
  metadata?: Record<string, unknown>;
}

const sessionHierarchyRegistry = new Map<string, SessionHierarchyEntry>();

/**
 * Register a new session with hierarchy tracking for P2P RSA negotiations.
 * This enables hierarchical session management similar to upstream's spawnDepth/subagentRole.
 */
export async function registerSessionHierarchy(
  api: OpenClawPluginApi,
  sessionKey: string,
  role: SubagentRole,
  parentSessionKey?: string,
  metadata?: Record<string, unknown>,
): Promise<SessionHierarchyEntry> {
  const parent = parentSessionKey ? sessionHierarchyRegistry.get(parentSessionKey) : undefined;
  const spawnDepth = parent ? parent.spawnDepth + 1 : 1;

  const entry: SessionHierarchyEntry = {
    sessionKey,
    role,
    spawnDepth,
    parentSessionKey,
    childSessionKeys: [],
    createdAt: new Date().toISOString(),
    status: "active",
    metadata,
  };

  sessionHierarchyRegistry.set(sessionKey, entry);

  if (parent) {
    parent.childSessionKeys.push(sessionKey);
    sessionHierarchyRegistry.set(parentSessionKey!, parent);
  }

  api.logger.info(
    `[session-hierarchy] Registered ${role} session "${sessionKey}" (depth=${spawnDepth})` +
      (parentSessionKey ? `, parent="${parentSessionKey}"` : ""),
  );

  await updateSessionState(
    api.resolvePath ? api.resolvePath("./data") : undefined,
    "SessionHierarchy",
    `${role} session "${sessionKey}" started (depth=${spawnDepth})`,
  );

  return entry;
}

/**
 * Clean up a session and its children recursively.
 * Uses the new deleteSession() API from upstream.
 */
export async function cleanupSessionHierarchy(
  api: OpenClawPluginApi,
  sessionKey: string,
): Promise<void> {
  const entry = sessionHierarchyRegistry.get(sessionKey);
  if (!entry) {
    api.logger.warn(`[session-hierarchy] Session "${sessionKey}" not found in registry`);
    return;
  }

  api.logger.info(`[session-hierarchy] Cleaning up session "${sessionKey}" and ${entry.childSessionKeys.length} children`);

  for (const childKey of entry.childSessionKeys) {
    await cleanupSessionHierarchy(api, childKey);
  }

  try {
    await api.runtime.subagent.deleteSession({
      sessionKey,
      deleteTranscript: false,
    });
    api.logger.info(`[session-hierarchy] Deleted subagent session "${sessionKey}"`);
  } catch (err: any) {
    api.logger.warn(`[session-hierarchy] Failed to delete session "${sessionKey}": ${err.message}`);
  }

  if (entry.parentSessionKey) {
    const parent = sessionHierarchyRegistry.get(entry.parentSessionKey);
    if (parent) {
      parent.childSessionKeys = parent.childSessionKeys.filter((k) => k !== sessionKey);
      sessionHierarchyRegistry.set(entry.parentSessionKey, parent);
    }
  }

  entry.status = "completed";
  sessionHierarchyRegistry.set(sessionKey, entry);

  await updateSessionState(
    api.resolvePath ? api.resolvePath("./data") : undefined,
    "SessionHierarchy",
    `Session "${sessionKey}" cleaned up`,
  );
}

/**
 * Get all active sessions in the hierarchy tree.
 */
export function getSessionHierarchyTree(rootSessionKey?: string): SessionHierarchyEntry[] {
  const sessions = Array.from(sessionHierarchyRegistry.values());
  if (!rootSessionKey) {
    return sessions;
  }
  return sessions.filter(
    (s) => s.sessionKey === rootSessionKey || s.parentSessionKey === rootSessionKey,
  );
}

/**
 * Phase 41D: Bridges the Secretary internal state with OpenClaw's Vector Memory (sqlite-vec or qmd).
 * Uses Subagent Delegation to ensure we leverage the core memory configuration and embedding keys.
 */
export async function storeVectorMemory(
  api: OpenClawPluginApi,
  text: string,
  category: "preference" | "decision" | "fact" | "entity" | "other" = "other",
): Promise<void> {
  try {
    api.logger.info(
      `[memory-cognition] Delegating storage to native LanceDB: ${text.slice(0, 50)}...`,
    );

    const sessionKey = `secretary-ltm-sync-${Date.now()}`;

    await registerSessionHierarchy(api, sessionKey, "leaf", undefined, { category });

    const runResult = await api.runtime.subagent.run({
      sessionKey,
      message: `Memory Capture Request: "${text}"\nCategory: ${category}`,
      extraSystemPrompt: `
        You are a memory synchronization specialist. 
        Use the 'memory_store' tool to persist the provided information into the long-term vector database.
        Include the category: ${category} if possible.
        Exit immediately after successful storage.
      `,
      deliver: false,
      idempotencyKey: `memory-${Date.now()}`,
    });

    await api.runtime.subagent.waitForRun({
      runId: runResult.runId,
      timeoutMs: 30000,
    });

    await cleanupSessionHierarchy(api, sessionKey);
  } catch (err: any) {
    api.logger.warn(`[memory-cognition] Failed to delegate memory storage: ${err.message}`);
  }
}

/**
 * "STOP and PERSIST before you REPLY." — WAL-PROTOCOL.md + proactive-agent v3.1
 */
export async function updateSessionState(
  workspaceDir: string | undefined,
  section: string,
  entry: string,
): Promise<void> {
  if (!workspaceDir) return;
  const sessionStatePath = path.join(workspaceDir, "SESSION-STATE.md");
  let content: string;
  try {
    content = await fs.readFile(sessionStatePath, "utf-8");
  } catch {
    content = STRINGS.es.walHeader;
  }

  const timestamp = new Date().toISOString();
  const fullEntry = `\n### [${timestamp}] ${entry}`;

  if (content.includes(`## ${section}`)) {
    content = content.replace(
      new RegExp(`## ${section}[\\s\\S]*?(?=\\n## |\\n---\\n\\n##|\\s*$)`),
      `## ${section}\n${fullEntry}\n`,
    );
  } else {
    content += `\n---\n\n## ${section}\n${fullEntry}\n`;
  }
  await fs.writeFile(sessionStatePath, content, "utf-8");
}

export async function appendWorkingBuffer(
  workspaceDir: string | undefined,
  role: "Human" | "Agent",
  summary: string,
): Promise<void> {
  if (!workspaceDir) return;
  const bufferPath = path.join(workspaceDir, "memory", "working-buffer.md");
  const timestamp = new Date().toISOString();
  const entry = `\n## [${timestamp}] ${role}\n${summary}\n`;
  try {
    await fs.appendFile(bufferPath, entry, "utf-8");
  } catch {
    /* silent — buffer is non-critical */
  }
}

export async function searchDeepMemory(workspaceDir: string | undefined): Promise<string> {
  if (!workspaceDir) return "No hay memoria disponible.";
  try {
    const sessionStatePath = path.join(workspaceDir, "SESSION-STATE.md");
    const content = await fs.readFile(sessionStatePath, "utf-8");
    return content.length > 2000 ? `...${content.slice(-2000)}` : content;
  } catch {
    return "No hay memoria disponible.";
  }
}

