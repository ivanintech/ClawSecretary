import type { OpenClawPluginApi } from "../../../../src/plugins/types.js";
import fs from "node:fs/promises";
import path from "node:path";

export interface VoiceWakeConfig {
  version: string;
  wakeWord: string;
  wakeWordAliases: string[];
  platform: string;
  sensitivity: number;
  timeoutMs: number;
  language: string;
  fallbackLanguage: string;
  routing: {
    primary: string;
    fallback: string;
  };
  commands: Record<string, string[]>;
  channels: {
    primary: string;
    secondary: string[];
  };
  proactive: {
    enabled: boolean;
    morningBriefing: string;
    eveningClosure: string;
  };
}

const DEFAULT_CONFIG: VoiceWakeConfig = {
  version: "1.0",
  wakeWord: "Hey Secretary",
  wakeWordAliases: ["Hey Secretary", "Secretary", "Oye Secretary"],
  platform: "auto-detect",
  sensitivity: 0.7,
  timeoutMs: 5000,
  language: "es-ES",
  fallbackLanguage: "en-US",
  routing: {
    primary: "secretary",
    fallback: "main",
  },
  commands: {
    briefing: ["briefing", "resumen", "agenda"],
    reminders: ["recuerda", "recordatorio", "recuerdame"],
    message: ["envía", "mensaje", "send"],
    call: ["llama", "call", "teléfono"],
  },
  channels: {
    primary: "whatsapp",
    secondary: ["telegram", "imessage", "slack"],
  },
  proactive: {
    enabled: true,
    morningBriefing: "08:00",
    eveningClosure: "22:00",
  },
};

export async function getVoiceWakeConfigDir(api: OpenClawPluginApi): Promise<string> {
  return api.resolvePath("./data");
}

export async function loadVoiceWakeConfig(api: OpenClawPluginApi): Promise<VoiceWakeConfig> {
  const configDir = await getVoiceWakeConfigDir(api);
  const configPath = path.join(configDir, "secretary-voice.json");

  try {
    const content = await fs.readFile(configPath, "utf-8");
    return JSON.parse(content) as VoiceWakeConfig;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveVoiceWakeConfig(
  api: OpenClawPluginApi,
  config: Partial<VoiceWakeConfig>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const configDir = await getVoiceWakeConfigDir(api);
    const configPath = path.join(configDir, "secretary-voice.json");

    const current = await loadVoiceWakeConfig(api);
    const updated = { ...current, ...config };

    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(updated, null, 2), "utf-8");

    api.logger.info(`[VoiceWake] Config saved to ${configPath}`);
    return { success: true };
  } catch (err: any) {
    api.logger.error(`[VoiceWake] Failed to save config: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function checkVoiceWakeEnabled(api: OpenClawPluginApi): Promise<boolean> {
  try {
    const config = await loadVoiceWakeConfig(api);
    return config.proactive.enabled;
  } catch {
    return false;
  }
}

export function parseVoiceCommand(text: string, config: VoiceWakeConfig): {
  command: string | null;
  params: string;
} {
  const lowerText = text.toLowerCase();

  for (const [command, aliases] of Object.entries(config.commands)) {
    for (const alias of aliases) {
      if (lowerText.includes(alias.toLowerCase())) {
        const params = lowerText.replace(alias.toLowerCase(), "").trim();
        return { command, params };
      }
    }
  }

  return { command: null, params: text };
}

export async function getVoiceWakeStatus(api: OpenClawPluginApi): Promise<{
  enabled: boolean;
  wakeWord: string;
  language: string;
  sensitivity: number;
  proactiveEnabled: boolean;
  morningBriefing: string;
  eveningClosure: string;
  platform: string;
}> {
  const config = await loadVoiceWakeConfig(api);

  return {
    enabled: true,
    wakeWord: config.wakeWord,
    language: config.language,
    sensitivity: config.sensitivity,
    proactiveEnabled: config.proactive.enabled,
    morningBriefing: config.proactive.morningBriefing,
    eveningClosure: config.proactive.eveningClosure,
    platform: config.platform,
  };
}

export async function setVoiceWakeEnabled(
  api: OpenClawPluginApi,
  enabled: boolean,
): Promise<{ success: boolean; error?: string }> {
  return saveVoiceWakeConfig(api, {
    proactive: {
      ...DEFAULT_CONFIG.proactive,
      enabled,
    },
  });
}

export async function setWakeWord(
  api: OpenClawPluginApi,
  wakeWord: string,
): Promise<{ success: boolean; error?: string }> {
  return saveVoiceWakeConfig(api, { wakeWord });
}

export async function setLanguage(
  api: OpenClawPluginApi,
  language: string,
): Promise<{ success: boolean; error?: string }> {
  return saveVoiceWakeConfig(api, { language });
}

export function formatVoiceWakeStatus(status: ReturnType<typeof getVoiceWakeStatus> extends Promise<infer T> ? T : never): string {
  const lines: string[] = [];
  lines.push("🎤 **Voice Wake Status**");
  lines.push("");
  lines.push(`• Wake Word: **${status.wakeWord}**`);
  lines.push(`• Language: ${status.language}`);
  lines.push(`• Sensitivity: ${Math.round(status.sensitivity * 100)}%`);
  lines.push(`• Proactive: ${status.proactiveEnabled ? "✅ Enabled" : "❌ Disabled"}`);

  if (status.proactiveEnabled) {
    lines.push("");
    lines.push("📅 **Proactive Schedule**");
    lines.push(`• Morning Briefing: ${status.morningBriefing}`);
    lines.push(`• Evening Closure: ${status.eveningClosure}`);
  }

  return lines.join("\n");
}
