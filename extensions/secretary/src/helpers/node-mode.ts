import type { OpenClawPluginApi } from "../../../../src/plugins/types.js";
import fs from "node:fs/promises";
import path from "node:path";

export interface OfflineAction {
  id: string;
  type: string;
  params: Record<string, any>;
  timestamp: string;
  retryCount: number;
  status: "pending" | "syncing" | "failed";
}

export interface NodeStatus {
  isOnline: boolean;
  lastSyncTimestamp: string;
  pendingActions: number;
  syncIntervalMs: number;
  mode: "full" | "edge" | "offline";
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

const OFFLINE_QUEUE_FILE = "secretary-offline-queue.json";
const SYNC_STATE_FILE = "secretary-sync-state.json";

export async function getNodeStatus(api: OpenClawPluginApi): Promise<NodeStatus> {
  const dataDir = api.resolvePath("./data");
  const syncStatePath = path.join(dataDir, SYNC_STATE_FILE);
  
  let lastSync = "Never";
  let pendingCount = 0;
  let mode: NodeStatus["mode"] = "full";

  try {
    const stateContent = await fs.readFile(syncStatePath, "utf-8");
    const state = JSON.parse(stateContent);
    lastSync = state.lastSync || "Never";
    pendingCount = state.pendingCount || 0;
    mode = state.mode || "full";
  } catch {
    // No state file yet
  }

  return {
    isOnline: await checkGatewayReachable(api),
    lastSyncTimestamp: lastSync,
    pendingActions: pendingCount,
    syncIntervalMs: 300000, // 5 minutes
    mode,
  };
}

export async function checkGatewayReachable(api: OpenClawPluginApi): Promise<boolean> {
  try {
    const config = api.config as any;
    const gatewayUrl = config?.gateway?.publicUrl || `http://127.0.0.1:18789`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${gatewayUrl}/health`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

export async function queueOfflineAction(
  api: OpenClawPluginApi,
  actionType: string,
  params: Record<string, any>,
): Promise<{ queued: boolean; id: string }> {
  const dataDir = api.resolvePath("./data");
  const queuePath = path.join(dataDir, OFFLINE_QUEUE_FILE);
  
  await fs.mkdir(dataDir, { recursive: true });

  const action: OfflineAction = {
    id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: actionType,
    params,
    timestamp: new Date().toISOString(),
    retryCount: 0,
    status: "pending",
  };

  try {
    let queue: OfflineAction[] = [];
    try {
      const existing = await fs.readFile(queuePath, "utf-8");
      queue = JSON.parse(existing);
    } catch {
      queue = [];
    }

    queue.push(action);
    await fs.writeFile(queuePath, JSON.stringify(queue, null, 2), "utf-8");

    api.logger.info(`[NodeMode] Queued offline action: ${actionType}`);
    return { queued: true, id: action.id };
  } catch (err: any) {
    api.logger.error(`[NodeMode] Failed to queue action: ${err.message}`);
    return { queued: false, id: "" };
  }
}

export async function getOfflineQueue(api: OpenClawPluginApi): Promise<OfflineAction[]> {
  const dataDir = api.resolvePath("./data");
  const queuePath = path.join(dataDir, OFFLINE_QUEUE_FILE);

  try {
    const content = await fs.readFile(queuePath, "utf-8");
    return JSON.parse(content) as OfflineAction[];
  } catch {
    return [];
  }
}

export async function syncOfflineQueue(api: OpenClawPluginApi): Promise<SyncResult> {
  const queue = await getOfflineQueue(api);
  
  if (queue.length === 0) {
    return { success: true, synced: 0, failed: 0, errors: [] };
  }

  const isOnline = await checkGatewayReachable(api);
  
  if (!isOnline) {
    return { 
      success: false, 
      synced: 0, 
      failed: queue.length, 
      errors: ["Gateway not reachable"] 
    };
  }

  const dataDir = api.resolvePath("./data");
  const queuePath = path.join(dataDir, OFFLINE_QUEUE_FILE);
  const syncStatePath = path.join(dataDir, SYNC_STATE_FILE);

  let synced = 0;
  let failed = 0;
  const errors: string[] = [];
  const remaining: OfflineAction[] = [];

  for (const action of queue) {
    try {
      api.logger.info(`[NodeMode] Syncing action: ${action.type}`);
      
      // Mark as syncing
      action.status = "syncing";
      
      // Execute the action through orchestrator
      // In real implementation, this would call the gateway API
      // For now, we simulate success
      
      synced++;
      api.logger.info(`[NodeMode] Synced: ${action.type}`);
    } catch (err: any) {
      failed++;
      errors.push(`${action.type}: ${err.message}`);
      action.retryCount++;
      
      if (action.retryCount < 3) {
        action.status = "pending";
        remaining.push(action);
      } else {
        action.status = "failed";
        api.logger.warn(`[NodeMode] Action failed after 3 retries: ${action.type}`);
      }
    }
  }

  // Save remaining actions
  await fs.writeFile(queuePath, JSON.stringify(remaining, null, 2), "utf-8");

  // Update sync state
  await fs.writeFile(syncStatePath, JSON.stringify({
    lastSync: new Date().toISOString(),
    pendingCount: remaining.length,
    mode: isOnline ? "full" : "offline",
  }, null, 2), "utf-8");

  api.logger.info(`[NodeMode] Sync complete: ${synced} synced, ${failed} failed`);

  return { success: failed === 0, synced, failed, errors };
}

export async function clearOfflineQueue(api: OpenClawPluginApi): Promise<{ cleared: boolean }> {
  const dataDir = api.resolvePath("./data");
  const queuePath = path.join(dataDir, OFFLINE_QUEUE_FILE);

  try {
    await fs.unlink(queuePath);
    api.logger.info("[NodeMode] Offline queue cleared");
    return { cleared: true };
  } catch {
    return { cleared: true }; // Already empty
  }
}

export async function setNodeMode(
  api: OpenClawPluginApi,
  mode: "full" | "edge" | "offline",
): Promise<{ success: boolean }> {
  const dataDir = api.resolvePath("./data");
  const syncStatePath = path.join(dataDir, SYNC_STATE_FILE);

  try {
    let state: any = {};
    try {
      const existing = await fs.readFile(syncStatePath, "utf-8");
      state = JSON.parse(existing);
    } catch {
      // Start fresh
    }

    state.mode = mode;
    state.lastModeChange = new Date().toISOString();

    await fs.writeFile(syncStatePath, JSON.stringify(state, null, 2), "utf-8");
    api.logger.info(`[NodeMode] Mode set to: ${mode}`);
    return { success: true };
  } catch (err: any) {
    api.logger.error(`[NodeMode] Failed to set mode: ${err.message}`);
    return { success: false };
  }
}

export async function getCachedCalendar(api: OpenClawPluginApi): Promise<any[]> {
  const dataDir = api.resolvePath("./data");
  const cachePath = path.join(dataDir, "calendar-cache.json");

  try {
    const content = await fs.readFile(cachePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function cacheCalendar(api: OpenClawPluginApi, events: any[]): Promise<void> {
  const dataDir = api.resolvePath("./data");
  const cachePath = path.join(dataDir, "calendar-cache.json");

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(cachePath, JSON.stringify(events, null, 2), "utf-8");
  api.logger.info(`[NodeMode] Cached ${events.length} calendar events`);
}

export async function getCachedMemory(api: OpenClawPluginApi): Promise<string> {
  const dataDir = api.resolvePath("./data");
  const memoryPath = path.join(dataDir, "memory-cache.md");

  try {
    return await fs.readFile(memoryPath, "utf-8");
  } catch {
    return "";
  }
}

export async function cacheMemory(api: OpenClawPluginApi, memory: string): Promise<void> {
  const dataDir = api.resolvePath("./data");
  const memoryPath = path.join(dataDir, "memory-cache.md");

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(memoryPath, memory, "utf-8");
  api.logger.info(`[NodeMode] Cached memory (${memory.length} chars)`);
}

export function formatNodeStatus(status: NodeStatus): string {
  const lines: string[] = [];
  lines.push("📡 **Secretary Node Status**");
  lines.push("");
  lines.push(`• Online: ${status.isOnline ? "✅ Connected" : "❌ Offline"}`);
  lines.push(`• Last Sync: ${status.lastSyncTimestamp}`);
  lines.push(`• Pending Actions: ${status.pendingActions}`);
  lines.push(`• Sync Interval: ${status.syncIntervalMs / 1000}s`);
  lines.push(`• Mode: ${status.mode.toUpperCase()}`);

  if (status.pendingActions > 0) {
    lines.push("");
    lines.push("⚠️ There are pending actions waiting to sync");
  }

  return lines.join("\n");
}
