/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OpenClawPluginApi } from "../../src/plugins/types.js";
import { createCalendarTool } from "./src/calendar-tool.js";
import { createOrchestratorTool } from "./src/orchestrator.js";
import { createPrivacyTool } from "./src/privacy-tool.js";
import { createWhatsAppWebhookHandler } from "./src/webhook.js";
import { createWhatsAppTool } from "./src/whatsapp-tool.js";

export default function register(api: OpenClawPluginApi) {
  // Cast as any: plugin tool factories use simplified execute(runId, params, ctx?) signature
  // which is normalized by pi-tool-definition-adapter.ts at runtime.
  api.registerTool(createCalendarTool(api) as any);
  api.registerTool(createOrchestratorTool(api) as any);
  api.registerTool(createPrivacyTool(api) as any);
  api.registerTool(createWhatsAppTool(api) as any);

  // Register public webhook endpoint for Meta WhatsApp events
  api.registerHttpRoute({
    path: "/secretary/wa-webhook",
    handler: createWhatsAppWebhookHandler(api),
    auth: "plugin", // Public endpoint; implements its own verification if needed
    match: "exact",
  });
}
