import type { OpenClawPluginApi } from "../../../../src/plugins/types.js";
import { execFileAsync } from "./common.js";

export interface IoTActivityEvent {
  device: string;
  action: string;
  target: string;
  success: boolean;
  timestamp: string;
}

const iotActivityLog: IoTActivityEvent[] = [];

export async function triggerHueScene(
  api: OpenClawPluginApi,
  room: string,
  scene: string,
): Promise<boolean> {
  try {
    await execFileAsync("openhue", ["set", "scene", scene, "--room", room]);

    const event: IoTActivityEvent = {
      device: "philips-hue",
      action: "set_scene",
      target: `${room}/${scene}`,
      success: true,
      timestamp: new Date().toISOString(),
    };
    iotActivityLog.push(event);
    await recordIoTActivity(api, event);

    api.logger.info(`[IoT] Hue scene set: ${room}/${scene}`);
    return true;
  } catch {
    const event: IoTActivityEvent = {
      device: "philips-hue",
      action: "set_scene",
      target: `${room}/${scene}`,
      success: false,
      timestamp: new Date().toISOString(),
    };
    iotActivityLog.push(event);
    await recordIoTActivity(api, event);

    return false;
  }
}

export async function triggerSonosFocus(
  api: OpenClawPluginApi,
  name: string,
): Promise<boolean> {
  try {
    await execFileAsync("sonos", ["play", "--name", name]);

    const event: IoTActivityEvent = {
      device: "sonos",
      action: "play_focus",
      target: name,
      success: true,
      timestamp: new Date().toISOString(),
    };
    iotActivityLog.push(event);
    await recordIoTActivity(api, event);

    api.logger.info(`[IoT] Sonos focus started: ${name}`);
    return true;
  } catch {
    const event: IoTActivityEvent = {
      device: "sonos",
      action: "play_focus",
      target: name,
      success: false,
      timestamp: new Date().toISOString(),
    };
    iotActivityLog.push(event);
    await recordIoTActivity(api, event);

    return false;
  }
}

async function recordIoTActivity(
  api: OpenClawPluginApi,
  event: IoTActivityEvent,
): Promise<void> {
  try {
    const runtime = api.runtime as any;
    const activity = runtime?.channel?.activity;
    if (activity?.record) {
      await activity.record({
        channel: "iot",
        direction: event.success ? "outbound" : "inbound",
      });
      api.logger.info(`[IoT:Activity] Recorded: ${event.device}/${event.action}`);
    }
  } catch (err: any) {
    api.logger.warn(`[IoT:Activity] Failed to record: ${err.message}`);
  }
}

export function getIoTActivityLog(limit = 50): IoTActivityEvent[] {
  return iotActivityLog.slice(-limit);
}

export function getIoTActivityStats(): {
  total: number;
  successful: number;
  failed: number;
  byDevice: Record<string, number>;
} {
  const stats = {
    total: iotActivityLog.length,
    successful: iotActivityLog.filter((e) => e.success).length,
    failed: iotActivityLog.filter((e) => !e.success).length,
    byDevice: {} as Record<string, number>,
  };

  for (const event of iotActivityLog) {
    stats.byDevice[event.device] = (stats.byDevice[event.device] || 0) + 1;
  }

  return stats;
}
