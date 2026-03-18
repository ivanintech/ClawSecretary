import type { OpenClawPluginApi } from "../../../../src/plugins/types.js";

export interface DeviceStatus {
  battery: {
    level: number;
    state: "charging" | "discharging" | "full" | "unknown";
    lowPowerMode: boolean;
  };
  network: {
    status: "wifi" | "cellular" | "offline" | "unknown";
    isExpensive: boolean;
  };
  storage: {
    totalBytes: number;
    freeBytes: number;
    usedBytes: number;
  };
  uptimeSeconds: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  timestamp: string;
}

export interface NotificationItem {
  key: string;
  app: string;
  title: string;
  text: string;
  timestamp: number;
}

export interface ContactInfo {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}

export interface PhotoItem {
  id: string;
  path: string;
  timestamp: number;
  width: number;
  height: number;
}

export async function invokeMobileCommand(
  api: OpenClawPluginApi,
  command: string,
  params?: Record<string, unknown>,
): Promise<{ success: boolean; payload?: unknown; error?: string }> {
  try {
    const gatewayOpts = { gatewayUrl: api.config.gateway?.remote?.url };
    const nodeId = "self";

    const result = await (api.runtime.tools as any)?.nodes?.invoke?.({
      gatewayOpts,
      node: nodeId,
      command,
      commandParams: params,
    });

    if (result?.success !== false) {
      return { success: true, payload: result?.payload };
    }
    return { success: false, error: result?.error || "Command failed" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function getDeviceStatus(api: OpenClawPluginApi): Promise<DeviceStatus | null> {
  try {
    const result = await invokeMobileCommand(api, "device.status");
    if (result.success && result.payload) {
      return result.payload as DeviceStatus;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getDeviceInfo(api: OpenClawPluginApi): Promise<{ model: string; os: string; appVersion: string } | null> {
  try {
    const result = await invokeMobileCommand(api, "device.info");
    if (result.success && result.payload) {
      return result.payload as { model: string; os: string; appVersion: string };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getLocation(api: OpenClawPluginApi, accuracy: "coarse" | "balanced" | "precise" = "balanced"): Promise<LocationData | null> {
  try {
    const result = await invokeMobileCommand(api, "location.get", { desiredAccuracy: accuracy });
    if (result.success && result.payload) {
      return result.payload as LocationData;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getRecentPhotos(api: OpenClawPluginApi, limit = 10): Promise<PhotoItem[]> {
  try {
    const result = await invokeMobileCommand(api, "photos.latest", { limit });
    if (result.success && result.payload) {
      return (result.payload as any[]) || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function searchContacts(api: OpenClawPluginApi, query: string): Promise<ContactInfo[]> {
  try {
    const result = await invokeMobileCommand(api, "contacts.search", { query });
    if (result.success && result.payload) {
      return (result.payload as any[]) || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function addContact(api: OpenClawPluginApi, contact: { name: string; phone?: string; email?: string }): Promise<{ success: boolean }> {
  try {
    const result = await invokeMobileCommand(api, "contacts.add", contact);
    return { success: result.success };
  } catch {
    return { success: false };
  }
}

export async function getCalendarEvents(api: OpenClawPluginApi, startDate: string, endDate: string): Promise<CalendarEvent[]> {
  try {
    const result = await invokeMobileCommand(api, "calendar.events", { startDate, endDate });
    if (result.success && result.payload) {
      return (result.payload as any[]) || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function addCalendarEvent(api: OpenClawPluginApi, event: Partial<CalendarEvent>): Promise<{ success: boolean; id?: string }> {
  try {
    const result = await invokeMobileCommand(api, "calendar.add", event);
    if (result.success && result.payload) {
      return { success: true, id: (result.payload as any)?.id };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}

export async function listNotifications(api: OpenClawPluginApi, limit = 20): Promise<NotificationItem[]> {
  try {
    const result = await invokeMobileCommand(api, "notifications.list", { limit });
    if (result.success && result.payload) {
      return (result.payload as any[]) || [];
    }
    return [];
  } catch {
    return [];
  }
}

export async function notificationAction(
  api: OpenClawPluginApi,
  notificationKey: string,
  action: "open" | "dismiss" | "reply",
  replyText?: string,
): Promise<{ success: boolean }> {
  try {
    const result = await invokeMobileCommand(api, "notifications.action", {
      notificationKey,
      action,
      replyText,
    });
    return { success: result.success };
  } catch {
    return { success: false };
  }
}

export async function sendSms(api: OpenClawPluginApi, phone: string, message: string): Promise<{ success: boolean }> {
  try {
    const result = await invokeMobileCommand(api, "sms.send", { phone, message });
    return { success: result.success };
  } catch {
    return { success: false };
  }
}

export async function getMotionActivity(api: OpenClawPluginApi): Promise<{ activity: string; confidence: number } | null> {
  try {
    const result = await invokeMobileCommand(api, "motion.activity");
    if (result.success && result.payload) {
      return result.payload as { activity: string; confidence: number };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getPedometerData(api: OpenClawPluginApi): Promise<{ steps: number; distance?: number } | null> {
  try {
    const result = await invokeMobileCommand(api, "motion.pedometer");
    if (result.success && result.payload) {
      return result.payload as { steps: number; distance?: number };
    }
    return null;
  } catch {
    return null;
  }
}

export async function takePhoto(
  api: OpenClawPluginApi,
  facing: "front" | "back" = "back",
  quality = 0.8,
): Promise<{ success: boolean; path?: string }> {
  try {
    const result = await invokeMobileCommand(api, "camera.snap", { facing, quality });
    if (result.success && result.payload) {
      return { success: true, path: (result.payload as any)?.path };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}

export async function recordVideo(
  api: OpenClawPluginApi,
  durationMs: number = 30000,
  facing: "front" | "back" = "back",
): Promise<{ success: boolean; path?: string }> {
  try {
    const result = await invokeMobileCommand(api, "camera.clip", { durationMs, facing });
    if (result.success && result.payload) {
      return { success: true, path: (result.payload as any)?.path };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}

export async function screenRecord(
  api: OpenClawPluginApi,
  durationMs: number = 60000,
): Promise<{ success: boolean; path?: string }> {
  try {
    const result = await invokeMobileCommand(api, "screen.record", { durationMs });
    if (result.success && result.payload) {
      return { success: true, path: (result.payload as any)?.path };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}

export async function showNotification(
  api: OpenClawPluginApi,
  title: string,
  body: string,
  priority: "passive" | "active" | "timeSensitive" = "active",
): Promise<{ success: boolean }> {
  try {
    const result = await invokeMobileCommand(api, "system.notify", { title, body, priority });
    return { success: result.success };
  } catch {
    return { success: false };
  }
}

export async function presentCanvas(api: OpenClawPluginApi, url?: string): Promise<{ success: boolean }> {
  try {
    const result = await invokeMobileCommand(api, "canvas.present", { url });
    return { success: result.success };
  } catch {
    return { success: false };
  }
}

export async function hideCanvas(api: OpenClawPluginApi): Promise<{ success: boolean }> {
  try {
    const result = await invokeMobileCommand(api, "canvas.hide");
    return { success: result.success };
  } catch {
    return { success: false };
  }
}

export function formatDeviceStatus(status: DeviceStatus): string {
  const lines: string[] = [];
  lines.push("📱 **Device Status**");
  lines.push("");
  lines.push(`• Battery: ${Math.round(status.battery.level * 100)}% ${status.battery.state === "charging" ? "⚡" : ""}`);
  lines.push(`• Network: ${status.network.status.toUpperCase()}${status.network.isExpensive ? " (metered)" : ""}`);
  lines.push(`• Storage: ${formatBytes(status.storage.freeBytes)} free of ${formatBytes(status.storage.totalBytes)}`);
  lines.push(`• Uptime: ${formatUptime(status.uptimeSeconds)}`);

  return lines.join("\n");
}

export function formatLocationContext(location: LocationData): string {
  return `📍 Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)} (${Math.round(location.accuracy)}m accuracy)`;
}

export function formatNotificationSummary(notifications: NotificationItem[]): string {
  if (notifications.length === 0) {
    return "📭 No recent notifications";
  }

  const lines: string[] = [];
  lines.push("🔔 **Recent Notifications**");
  lines.push("");

  const recent = notifications.slice(0, 5);
  for (const n of recent) {
    const time = new Date(n.timestamp).toLocaleTimeString();
    lines.push(`• [${n.app}] ${n.title}`);
    if (n.text) {
      lines.push(`  _${n.text.substring(0, 50)}_`);
    }
  }

  if (notifications.length > 5) {
    lines.push(`\n... and ${notifications.length - 5} more`);
  }

  return lines.join("\n");
}

function formatBytes(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${mins}m`;
}
