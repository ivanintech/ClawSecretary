/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OpenClawPluginApi } from "../../../src/plugins/types.js";

const BRIEFING_KEYWORDS = [
  "briefing",
  "resumen",
  "resumen del día",
  "summary",
  "buenos días",
  "buenas tardes",
  "buenas noches",
  "agenda",
  "qué tengo hoy",
  "qué tengo mañana",
  "resumen matutino",
];

const analyticsCache = new Map<string, { startTime: number; messageCount: number }>();

export function registerSecretaryHooks(api: OpenClawPluginApi): void {
  api.logger.info("[secretary-hooks] Registering SecretaryOS plugin hooks");

  (api.on as any)("inbound_claim", async (event: any, _ctx: any) => {
    const content = event.content || event.body || event.transcript || "";
    const lowerContent = content.toLowerCase().trim();

    const isBriefingRequest = BRIEFING_KEYWORDS.some((keyword) =>
      lowerContent.includes(keyword.toLowerCase())
    );

    if (!isBriefingRequest) {
      return { handled: false };
    }

    api.logger.info(
      `[secretary-hooks] 📬 Briefing request detected: "${content.substring(0, 50)}..."`
    );

    try {
      const briefingResult = await generateBriefingResponse(api);

      if (briefingResult) {
        return { handled: true };
      }
    } catch (error) {
      api.logger.error(`[secretary-hooks] Failed to generate briefing: ${error}`);
    }

    return { handled: false };
  });

  (api.on as any)("session_start", async (event: any, _ctx: any) => {
    const sessionKey = event.sessionKey || "unknown";

    analyticsCache.set(sessionKey, {
      startTime: Date.now(),
      messageCount: 0,
    });

    api.logger.info(
      `[secretary-hooks] 🟢 Session started: ${sessionKey} (resumed: ${event.resumedFrom || "no"})`
    );
  });

  (api.on as any)("session_end", async (event: any, _ctx: any) => {
    const sessionKey = event.sessionKey || "unknown";
    const cached = analyticsCache.get(sessionKey);

    if (cached) {
      const duration = Date.now() - cached.startTime;

      api.logger.info(
        `[secretary-hooks] 🔴 Session ended: ${sessionKey} | ` +
          `messages: ${event.messageCount} | ` +
          `duration: ${Math.round(duration / 1000)}s`
      );

      analyticsCache.delete(sessionKey);
    }
  });

  (api.on as any)("message_sending", async (event: any, _ctx: any) => {
    const content = event.content;

    if (content && content.length > 4096) {
      api.logger.warn(
        `[secretary-hooks] ⚠️ Message too long (${content.length} chars), truncating for ${event.to}`
      );

      return {
        content: content.substring(0, 4096) + "\n\n_(mensaje truncado)_",
      };
    }

    return;
  });

  api.logger.info("[secretary-hooks] All SecretaryOS hooks registered successfully");
}

async function generateBriefingResponse(api: OpenClawPluginApi): Promise<boolean> {
  try {
    const { SecretaryOrchestrator } = await import("./orchestrator.js");

    const instance = new SecretaryOrchestrator(api);

    await instance.execute("briefing-hook", {
      action: "briefing",
      date: new Date().toISOString().split("T")[0],
    });

    api.logger.info("[secretary-hooks] ✅ Briefing generated successfully");

    return true;
  } catch (error) {
    api.logger.error(`[secretary-hooks] ❌ Briefing generation failed: ${error}`);
    return false;
  }
}

export function getHookAnalytics(): {
  activeSessions: number;
  sessionDetails: Array<{
    sessionKey: string;
    startTime: number;
    messageCount: number;
    durationSeconds: number;
  }>;
} {
  const now = Date.now();
  const details: Array<{
    sessionKey: string;
    startTime: number;
    messageCount: number;
    durationSeconds: number;
  }> = [];

  for (const [sessionKey, data] of analyticsCache.entries()) {
    details.push({
      sessionKey,
      startTime: data.startTime,
      messageCount: data.messageCount,
      durationSeconds: Math.round((now - data.startTime) / 1000),
    });
  }

  return {
    activeSessions: analyticsCache.size,
    sessionDetails: details,
  };
}
