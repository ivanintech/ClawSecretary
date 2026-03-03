import type { OpenClawPluginApi } from "../../src/plugins/types.js";
import { createCalendarTool } from "./src/calendar-tool.js";
import { createOrchestratorTool } from "./src/orchestrator.js";
import { createPrivacyTool } from "./src/privacy-tool.js";

export default function register(api: OpenClawPluginApi) {
  api.registerTool(createCalendarTool(api));
  api.registerTool(createOrchestratorTool(api));
  api.registerTool(createPrivacyTool(api));
}
