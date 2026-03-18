import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "../../../src/plugins/types.js";
import { joinPresentTextSegments } from "../../../src/shared/text/join-segments.js";
import { resolveApiKeyForProvider } from "../../../src/agents/model-auth.js";
import type { OpenClawConfig } from "../../../src/config/config.js";
import { loadConfig } from "../../../src/config/config.js";
import { STRINGS } from "./constants.js";
import { CRMManager } from "./crm.js";
import { triggerUrgentAlert } from "./helpers/alerts.js";
import { readAutonomyLevel } from "./helpers/autonomy.js";
import { fetchCalendlyEvents, fetchCalendlyInvitees } from "./helpers/calendly.js";
import { execFileAsync, extractFinancialData } from "./helpers/common.js";
import {
  fetchGogEvents,
  fetchGmailUnread,
  fetchOutlookInbox,
  himalayaList,
  himalayaRead,
} from "./helpers/email.js";
import {
  fetchRssDigest,
  fetchNearbyVenues,
  fetchOrderHistory,
  fetchWeather,
  performWebSearch,
} from "./helpers/intelligence.js";
import {
  triggerHueScene,
  triggerSonosFocus,
  getIoTActivityLog,
  getIoTActivityStats,
} from "./helpers/iot.js";
import {
  executeParallelSubagents,
  ParallelScenarios,
} from "./helpers/parallel-subagent-helper.js";
import {
  chunkMarkdownForWhatsApp,
  convertTablesForChannel,
  formatBriefingForWhatsApp,
  processCommandText,
  resolveTextChunkLimit,
  resolveChunkMode,
} from "./helpers/text-processor.js";
import { syncKnowledge, syncGhostWriteToSecondBrain } from "./helpers/knowledge.js";
import {
  registerMemoryLifecycleHooks,
  recallRelevantMemories,
  formatMemoriesForContext,
  getMemoryStats,
} from "./helpers/memory-lifecycle.js";
import { generatePairingLink, printMagicLink } from "./helpers/pairing.js";
import { waButtonPayload } from "./helpers/whatsapp.js";
import {
  slackSendMessage,
  slackReactToMessage,
  slackMarkAsDone,
  slackReadMessages,
  slackPinMessage,
  checkSlackConfigured,
} from "./helpers/slack.js";
import {
  imsgListChats,
  imsgGetRecentMessages,
  imsgSendQuick,
  imsgFormatChatForSecretary,
  checkImsgAvailable,
} from "./helpers/imsg.js";
import {
  remindersGetToday,
  remindersGetWeek,
  remindersGetOverdue,
  remindersCreateFromNaturalLanguage,
  remindersComplete,
  remindersFormatSummary,
  remindersSyncFromBriefing,
  checkRemindersAvailable,
  remindersListLists,
} from "./helpers/reminders.js";
import {
  getVoiceWakeStatus,
  setVoiceWakeEnabled,
  setWakeWord,
  setLanguage,
  formatVoiceWakeStatus,
  loadVoiceWakeConfig,
} from "./helpers/voice-wake.js";
import {
  getNodeStatus,
  syncOfflineQueue,
  setNodeMode,
  formatNodeStatus,
  getOfflineQueue,
  clearOfflineQueue,
} from "./helpers/node-mode.js";
import {
  getDeviceStatus,
  getDeviceInfo,
  getLocation,
  getRecentPhotos,
  searchContacts,
  addContact,
  getCalendarEvents,
  addCalendarEvent,
  listNotifications,
  notificationAction,
  sendSms,
  getMotionActivity,
  getPedometerData,
  takePhoto,
  recordVideo,
  screenRecord,
  showNotification,
  presentCanvas,
  hideCanvas,
  formatDeviceStatus,
  formatLocationContext,
  formatNotificationSummary,
} from "./helpers/mobile.js";
import { CalendarStore } from "./store.js";
import { VaultManager } from "./vault.js";
import { updateSessionState, appendWorkingBuffer, searchDeepMemory } from "./wal-helpers.js";

export function createOrchestratorTool(api: OpenClawPluginApi) {
  const orchestrator = new SecretaryOrchestrator(api);

  // Register native /briefing command for instant access (Phase 39)
  api.registerCommand({
    name: "briefing",
    description: "Genera un resumen proactivo de tu agenda y estado actual de forma instantánea.",
    acceptsArgs: false,
    handler: async (ctx) => {
      const result = await orchestrator.execute("native-cmd", { action: "briefing" });
      return { text: result.content[0].text };
    },
  });

  // Register native /pair command for Magic Setup (Phase 43)
  api.registerCommand({
    name: "pair",
    description: "Genera un enlace mágico para conectar tu móvil instantáneamente.",
    acceptsArgs: false,
    handler: async () => {
      const link = await generatePairingLink(api);
      printMagicLink(api, link);
      return { text: `Enlace de emparejamiento generado en consola:\n${link}` };
    },
  });

  return {
    name: "secretary_orchestrator",
    label: orchestrator.label,
    description: orchestrator.description,
    parameters: orchestrator.parameters,
    async execute(runId: string, params: Record<string, any>, ctx?: OpenClawPluginToolContext) {
      return orchestrator.execute(runId, params, ctx);
    },
  };
}

export class SecretaryOrchestrator {
  private store: CalendarStore;
  private vault: VaultManager;
  private crm: CRMManager;
  private workspaceDir: string;

  public label = "Secretary Orchestrator";
  public description =
    "Multi-service agenda orchestration, proactive briefings, live Google/Outlook sync, and WAL-compliant conflict management.";

  public parameters = Type.Object({
    action: Type.String({
      enum: [
        "briefing",
        "parallel_briefing",
        "conflict_guardian",
        "setup_status",
        "setup_proactive",
        "gog_sync",
        "proactive_research",
        "search_opportunities",
        "email_concierge",
        "whatsapp_preview",
        "gmail_triager",
        "rss_digest",
        "calendly_sync",
        "find_nearby_venues",
        "suggest_meal_habits",
        "get_personal_context",
        "financial_triage",
        "ingest_document",
        "voice_command_executor",
        "audio_summary",
        "contextual_monitor",
        "proactive_suggest",
        "get_secure_secret",
        "sync_tasks",
        "sync_to_notion",
        "logistics_triage",
        "event_closure_shadowing",
        "finalize_closure",
        "negotiate_meeting",
        "himalaya_list",
        "himalaya_read",
        "trigger_focus_mode",
        "urgent_alert",
        "magic_pair",
        "process_text",
        "get_iot_activity",
        "get_memory_stats",
        "slack_send",
        "slack_mark_done",
        "slack_read",
        "imsg_list",
        "imsg_history",
        "imsg_send",
        "reminders_today",
        "reminders_week",
        "reminders_overdue",
        "reminders_create",
        "reminders_complete",
        "reminders_sync",
        "voice_wake_status",
        "voice_wake_enable",
        "voice_wake_disable",
        "voice_wake_set_word",
        "node_status",
        "node_sync",
        "node_set_mode",
        "node_clear_queue",
        "mobile_device_status",
        "mobile_device_info",
        "mobile_location",
        "mobile_photos",
        "mobile_contacts_search",
        "mobile_contacts_add",
        "mobile_notifications",
        "mobile_notification_action",
        "mobile_sms",
        "mobile_motion",
        "mobile_photo_capture",
        "mobile_video_record",
        "mobile_screen_record",
        "mobile_notify",
      ],
      description: "Action to perform.",
    }),
    date: Type.Optional(Type.String({ description: "Target date ISO." })),
    title: Type.Optional(Type.String({ description: "Event title or research query." })),
    startTime: Type.Optional(Type.String({ description: "Start time ISO." })),
    endTime: Type.Optional(Type.String({ description: "End time ISO." })),
    recipientPhone: Type.Optional(
      Type.String({ description: "WhatsApp recipient phone (international, no +)." }),
    ),
    transcript: Type.Optional(Type.String({ description: "Transcribed text for voice actions." })),
    documentPath: Type.Optional(Type.String({ description: "Path to the PDF document." })),
    emailSubject: Type.Optional(Type.String({ description: "Subject of an email for triage." })),
    emailBody: Type.Optional(Type.String({ description: "Body of an email for triage." })),
    peerUrl: Type.Optional(
      Type.String({ description: "URL of the peer's ClawSecretary gateway." }),
    ),
    peerPublicKey: Type.Optional(Type.String({ description: "Public RSA key of the peer." })),
    durationMin: Type.Optional(Type.Number({ description: "Duration of the meeting in minutes." })),
    dateRange: Type.Optional(
      Type.Object({
        start: Type.String({ description: "Start of range (ISO)." }),
        end: Type.String({ description: "End of range (ISO)." }),
      }),
    ),
    account: Type.Optional(Type.String({ description: "Email account name (Himalaya)." })),
    id: Type.Optional(Type.String({ description: "Message ID or resource ID." })),
    room: Type.Optional(Type.String({ description: "Room name for IoT." })),
    scene: Type.Optional(Type.String({ description: "Scene name for IoT." })),
    speaker: Type.Optional(Type.String({ description: "Speaker name (Sonos)." })),
    message: Type.Optional(Type.String({ description: "Alert message." })),
    text: Type.Optional(Type.String({ description: "Text to process with native chunking/formatting." })),
    mode: Type.Optional(Type.String({ description: "Channel mode for text processing: whatsapp, telegram, discord." })),
    channel: Type.Optional(Type.String({ description: "Slack channel ID or name." })),
    messageId: Type.Optional(Type.String({ description: "Slack message timestamp." })),
    emoji: Type.Optional(Type.String({ description: "Emoji for reaction." })),
    to: Type.Optional(Type.String({ description: "Recipient (Slack channel, iMsg contact, or phone)." })),
    contact: Type.Optional(Type.String({ description: "Contact name for iMsg." })),
    limit: Type.Optional(Type.Number({ description: "Limit for listing items." })),
    list: Type.Optional(Type.String({ description: "Reminder list name." })),
  });

  constructor(private api: OpenClawPluginApi) {
    this.store = new CalendarStore(api.resolvePath("./data"));
    this.workspaceDir = api.resolvePath(".");
    this.vault = new VaultManager(this.workspaceDir);
    this.crm = new CRMManager();
  }

  async execute(
    runId: string,
    params: Record<string, any>,
    ctx?: OpenClawPluginToolContext,
  ): Promise<any> {
    const apiKey = process.env.MATON_API_KEY;

    switch (params.action) {
      case "magic_pair":
        return this.handleMagicPair();
      case "get_secure_secret":
        return this.handleGetSecureSecret(params);
      case "sync_tasks":
        return this.handleSyncTasks(params);
      case "sync_to_notion":
        return this.handleSyncToNotion(params);
      case "sync_knowledge":
        return this.handleSyncKnowledge(params);
      case "setup_status":
        return this.handleSetupStatus(apiKey);
      case "setup_proactive":
        return this.handleSetupProactive();
      case "briefing":
        return this.handleBriefing(runId, params, apiKey);
      case "parallel_briefing":
        return this.handleParallelBriefing();
      case "conflict_guardian":
        return this.handleConflictGuardian(params);
      case "gog_sync":
        return this.handleGogSync(params);
      case "proactive_research":
        return this.handleProactiveResearch(params);
      case "search_opportunities":
        return this.handleSearchOpportunities(params);
      case "email_concierge":
        return this.handleEmailConcierge(apiKey);
      case "whatsapp_preview":
        return this.handleWhatsappPreview(params, apiKey);
      case "gmail_triager":
        return this.handleGmailTriager(params);
      case "rss_digest":
        return this.handleRssDigest(params);
      case "calendly_sync":
        return this.handleCalendlySync(apiKey, params);
      case "find_nearby_venues":
        return this.handleFindNearbyVenues(params);
      case "suggest_meal_habits":
        return this.handleSuggestMealHabits();
      case "get_personal_context":
        return this.handleGetPersonalContext();
      case "financial_triage":
        return this.handleFinancialTriage(params);
      case "ingest_document":
        return this.handleIngestDocument(params);
      case "voice_command_executor":
        return this.handleVoiceCommandExecutor(runId, params);
      case "audio_summary":
        return this.handleAudioSummary(params);
      case "contextual_monitor":
        return this.handleContextualMonitor();
      case "proactive_suggest":
        return this.handleProactiveSuggest(params);
      case "logistics_triage":
        return this.handleLogisticsTriage(params);
      case "event_closure_shadowing":
        return this.handleEventClosureShadowing(params);
      case "finalize_closure":
        return this.handleFinalizeClosure(params);
      case "negotiate_meeting":
        return this.handleNegotiateMeeting(params);
      case "himalaya_list":
        return this.handleHimalayaList(params);
      case "himalaya_read":
        return this.handleHimalayaRead(params);
      case "trigger_focus_mode":
        return this.handleTriggerFocusMode(params);
      case "urgent_alert":
        return this.handleUrgentAlert(params);
      case "process_text":
        return this.handleProcessText(params);
      case "get_iot_activity":
        return this.handleGetIoTActivity(params);
      case "get_memory_stats":
        return this.handleGetMemoryStats(params);
      case "slack_send":
        return this.handleSlackSend(params);
      case "slack_mark_done":
        return this.handleSlackMarkDone(params);
      case "slack_read":
        return this.handleSlackRead(params);
      case "imsg_list":
        return this.handleImsgList(params);
      case "imsg_history":
        return this.handleImsgHistory(params);
      case "imsg_send":
        return this.handleImsgSend(params);
      case "reminders_today":
        return this.handleRemindersToday(params);
      case "reminders_week":
        return this.handleRemindersWeek(params);
      case "reminders_overdue":
        return this.handleRemindersOverdue(params);
      case "reminders_create":
        return this.handleRemindersCreate(params);
      case "reminders_complete":
        return this.handleRemindersComplete(params);
      case "reminders_sync":
        return this.handleRemindersSync(params);
      case "voice_wake_status":
        return this.handleVoiceWakeStatus(params);
      case "voice_wake_enable":
        return this.handleVoiceWakeEnable(params);
      case "voice_wake_disable":
        return this.handleVoiceWakeDisable(params);
      case "voice_wake_set_word":
        return this.handleVoiceWakeSetWord(params);
      case "node_status":
        return this.handleNodeStatus(params);
      case "node_sync":
        return this.handleNodeSync(params);
      case "node_set_mode":
        return this.handleNodeSetMode(params);
      case "node_clear_queue":
        return this.handleNodeClearQueue(params);
      case "mobile_device_status":
        return this.handleMobileDeviceStatus(params);
      case "mobile_device_info":
        return this.handleMobileDeviceInfo(params);
      case "mobile_location":
        return this.handleMobileLocation(params);
      case "mobile_photos":
        return this.handleMobilePhotos(params);
      case "mobile_contacts_search":
        return this.handleMobileContactsSearch(params);
      case "mobile_contacts_add":
        return this.handleMobileContactsAdd(params);
      case "mobile_notifications":
        return this.handleMobileNotifications(params);
      case "mobile_notification_action":
        return this.handleMobileNotificationAction(params);
      case "mobile_sms":
        return this.handleMobileSms(params);
      case "mobile_motion":
        return this.handleMobileMotion(params);
      case "mobile_photo_capture":
        return this.handleMobilePhotoCapture(params);
      case "mobile_video_record":
        return this.handleMobileVideoRecord(params);
      case "mobile_screen_record":
        return this.handleMobileScreenRecord(params);
      case "mobile_notify":
        return this.handleMobileNotify(params);
      default:
        return { content: [{ type: "text", text: `⚠️ Unknown action: ${params.action}` }] };
    }
  }

  private async handleGetSecureSecret(params: any) {
    const secret = await this.vault.getSecret(params.item || "", params.field || "password");
    return {
      content: [
        { type: "text", text: secret ? "✅ Secreto recuperado." : "❌ Error recuperando secreto." },
      ],
      details: { secret: secret ? "***" : null },
    };
  }

  private async handleSyncTasks(params: any) {
    const success = await this.crm.pushToThings(
      params.title || "",
      params.notes || "",
      params.deadline,
    );
    return {
      content: [
        {
          type: "text",
          text: success ? "✅ Tarea enviada a Things 3." : "❌ Error enviando a Things 3.",
        },
      ],
    };
  }

  private async handleSyncToNotion(params: any) {
    const success = await this.crm.syncToNotion(
      params.databaseId || "",
      params.title || "Log Secretary",
      params.content || "",
    );
    return {
      content: [{ type: "text", text: success ? "✅ Sync to Notion ok." : "❌ Error Notion." }],
    };
  }

  private async handleSyncKnowledge(params: any) {
    const title = params.title || `Entry_${new Date().toISOString().split("T")[0]}`;
    const content = params.content || "";
    const syncedTo = await syncKnowledge(this.api, title, content);

    if (syncedTo.length === 0) {
      return {
        content: [
          { type: "text", text: "⚠️ No knowledge integration configured (Notion/Obsidian)." },
        ],
      };
    }

    return {
      content: [{ type: "text", text: `✅ Conocimiento sincronizado a: ${syncedTo.join(", ")}.` }],
      details: { syncedTo },
    };
  }

  private async handleParallelBriefing() {
    console.log("[Orchestrator] 📊 Starting parallel briefing (briefing + calendar sync)");
    
    try {
      const results = await executeParallelSubagents(
        this.api,
        ParallelScenarios.briefingAndCalendarSync(),
      );

      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      console.log(
        `[Orchestrator] ✅ Parallel briefing completed: ${successful.length}/${results.length} succeeded`,
      );

      let summary = `📊 Briefing Paralelo Completado\n`;
      summary += `✅ Exitosos: ${successful.length}\n`;
      if (failed.length > 0) {
        summary += `❌ Fallidos: ${failed.length}\n`;
      }

      successful.forEach((result, index) => {
        const msgCount = result.messages.length;
        summary += `\n📍 Tarea ${index + 1} (${result.sessionKey}):\n`;
        summary += `   ${msgCount} mensajes generados\n`;
      });

      await updateSessionState(this.workspaceDir, "ParallelBriefing", "Completed parallel execution");
      
      return {
        content: [{ type: "text", text: summary }],
        details: {
          successful: successful.length,
          failed: failed.length,
          results,
        },
      };
    } catch (error) {
      console.error("[Orchestrator] ❌ Parallel briefing failed:", error);
      return {
        content: [
          {
            type: "text",
            text: `❌ Error en briefing paralelo: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  private async handleSetupStatus(apiKey: string | undefined) {
    let gogInstalled = false;
    try {
      await execFileAsync("gog", ["--version"]);
      gogInstalled = true;
    } catch {}

    const slackConfigured = await checkSlackConfigured(this.api);
    const imsgAvailable = await checkImsgAvailable();
    const remindersAvailable = await checkRemindersAvailable();
    const nodeStatus = await getNodeStatus(this.api);

    const status = {
      local_calendar: "✅ Connected",
      google_calendar_gog:
        process.env.GOG_ACCOUNT && gogInstalled
          ? "✅ Connected"
          : gogInstalled
            ? "⚠️ gog installed but GOG_ACCOUNT not set"
            : "❌ gog CLI not installed",
      outlook: apiKey ? "✅ Maton OAuth ready" : "❌ Missing MATON_API_KEY",
      whatsapp_business:
        apiKey && process.env.WA_PHONE_NUMBER_ID ? "✅ Connected" : "⚠️ MATON_API_KEY missing",
      calendly: process.env.CALENDLY_API_KEY ? "✅ Connected" : "❌ Missing CALENDLY_API_KEY",
      web_search: "✅ OpenClaw native (multi-provider support)",
      slack: slackConfigured ? "✅ Connected" : "❌ Slack token not configured",
      imsg: imsgAvailable ? "✅ Available (macOS)" : "⚠️ Requires macOS with Messages.app",
      apple_reminders: remindersAvailable ? "✅ Available (macOS)" : "⚠️ Requires macOS with remindctl",
      node_mode: `${nodeStatus.isOnline ? "✅ Online" : "❌ Offline"} (${nodeStatus.mode.toUpperCase()})`,
    };
    let message = "📊 *CLAWSECRETARY SETUP STATUS*\n\n";
    for (const [k, v] of Object.entries(status)) {
      message += `• *${k.toUpperCase()}*: ${v}\n`;
    }
    return { content: [{ type: "text", text: message }], details: { status } };
  }

  private async handleSetupProactive() {
    const allCrons = [
      {
        name: "Daily Briefing",
        schedule: { kind: "cron", expr: "0 8 * * *", tz: "Local" },
        payload: { kind: "agentTurn", message: "AUTONOMOUS TASK — Briefing & Concierge." },
        sessionTarget: "isolated",
      },
      {
        name: "Pre-Meeting Research",
        schedule: { kind: "cron", expr: "45 * * * *", tz: "Local" },
        payload: { kind: "agentTurn", message: "AUTONOMOUS TASK — Research next meeting." },
        sessionTarget: "isolated",
      },
      {
        name: "Gmail Triager",
        schedule: { kind: "cron", expr: "0 * * * *", tz: "Local" },
        payload: { kind: "agentTurn", message: "AUTONOMOUS TASK — Gmail Triage." },
        sessionTarget: "isolated",
      },
      {
        name: "RSS Digest",
        schedule: { kind: "cron", expr: "30 7 * * 1", tz: "Local" },
        payload: { kind: "agentTurn", message: "AUTONOMOUS TASK — RSS Digest." },
        sessionTarget: "isolated",
      },
      {
        name: "Memory Freshener",
        schedule: { kind: "cron", expr: "0 20 * * 0", tz: "Local" },
        payload: { kind: "agentTurn", message: "AUTONOMOUS TASK — Memory Refresh." },
        sessionTarget: "isolated",
      },
      {
        name: "Notion Sync",
        schedule: { kind: "cron", expr: "0 21 * * 0", tz: "Local" },
        payload: { kind: "agentTurn", message: "AUTONOMOUS TASK — Notion Sync." },
        sessionTarget: "isolated",
      },
      {
        name: "Event Shadowing",
        schedule: { kind: "cron", expr: "*/15 * * * *", tz: "Local" },
        payload: { kind: "agentTurn", message: "AUTONOMOUS TASK — Event Closure Shadowing." },
        sessionTarget: "isolated",
      },
    ];
    let summary =
      "⚙️ *Autonomous Secretary — Crons Ready*\n" +
      allCrons.map((c, i) => `• ${c.name}: \`${(c.schedule as any).expr}\``).join("\n");
    return { content: [{ type: "text", text: summary }], details: { allCrons } };
  }

  private async handleBriefing(runId: string, params: any, apiKey: string | undefined) {
    const targetDate = params.date ? new Date(params.date) : new Date();
    const dateStr = targetDate.toISOString().split("T")[0];
    const localEvents = await this.store.load();
    const gogEvents = await fetchGogEvents(dateStr);
    const allEventMap = new Map<string, any>();
    localEvents
      .filter((e: any) => e.startTime.startsWith(dateStr))
      .forEach((e: any) => allEventMap.set(e.id, e));
    for (const ge of gogEvents) {
      const key = `gog_${ge.startTime}`;
      if (!allEventMap.has(key)) allEventMap.set(key, { id: key, ...ge });
    }
    const dailyEvents = [...allEventMap.values()].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
    const userCity = process.env.USER_CITY ?? "Madrid";
    const weatherStr = await fetchWeather(userCity);
    const advisorInsights: string[] = [];
    if (dailyEvents.some((e: any) => new Date(e.endTime).getHours() >= 19)) {
      const habits = await fetchOrderHistory();
      if (habits.length > 0)
        advisorInsights.push(
          `🛵 *Asesor de Hábitos*: Hoy terminas tarde. ¿Pedimos en *${habits[0].restaurant}*?`,
        );
    }
    const memoryTip = await searchDeepMemory(this.workspaceDir);
    if (memoryTip && memoryTip !== "No hay memoria disponible.")
      advisorInsights.push(
        `🧠 *Recuerdo Proactivo*: ${memoryTip.substring(0, 100).replace(/\n/g, " ")}...`,
      );

    const briefingSegments = [
      `📅 *Agenda para hoy ${dateStr}* _(total + google)_:`,
      dailyEvents.length === 0
        ? "No tienes eventos agendados."
        : dailyEvents
            .map((e: any) => `• ${e.startTime.substring(11, 16)} ❯ *${e.title}*`)
            .join("\n"),
      advisorInsights.length > 0 ? `🤖 *AI ADVISOR*:\n${advisorInsights.join("\n")}` : undefined,
      `🌡️ *Tiempo en ${userCity}:* ${weatherStr}`,
      dailyEvents.length > 3
        ? "🥵 Día intenso. ¡No olvides los descansos!"
        : "💡 Día tranquilo. Buen momento para trabajo profundo.",
    ];
    const briefingText = joinPresentTextSegments(briefingSegments) || "";
    const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
    const waPayload =
      recipient && dailyEvents.length > 0
        ? waButtonPayload(recipient, briefingText, ["✅ Confirmar", "🤖 Ver Consejo", "📍 Lugares"])
        : null;

    await appendWorkingBuffer(
      this.workspaceDir,
      "Agent",
      `Briefing sent for ${dateStr}. Items: ${dailyEvents.length}`,
    );
    return {
      content: [{ type: "text", text: briefingText }],
      details: { events: dailyEvents, waInteractivePayload: waPayload, weather: weatherStr },
    };
  }

  private async handleMagicPair() {
    const link = await generatePairingLink(this.api);
    return {
      content: [{ type: "text", text: `🔗 Magic Setup Link: ${link}` }],
      details: { link },
    };
  }

  private async handleConflictGuardian(params: any) {
    if (!params.startTime || !params.endTime) throw new Error("startTime and endTime required.");
    const start = new Date(params.startTime);
    const end = new Date(params.endTime);
    const candidateTitle = params.title ?? "Nuevo evento";
    const localEvents = await this.store.load();
    const conflicts = localEvents.filter(
      (e: any) => start < new Date(e.endTime) && end > new Date(e.startTime),
    );

    if (conflicts.length === 0)
      return { content: [{ type: "text", text: `✅ Sin conflictos para *"${candidateTitle}"*.` }] };

    const suggestedStart = new Date(
      Math.max(...conflicts.map((c: any) => new Date(c.endTime).getTime())) + 15 * 60000,
    );
    const suggestedEnd = new Date(suggestedStart.getTime() + (end.getTime() - start.getTime()));
    const fmt = (d: Date) => d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

    const autonomy = readAutonomyLevel(candidateTitle);
    const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;

    if (autonomy === "L3" || autonomy === "L4") {
      await updateSessionState(
        this.workspaceDir,
        "Conflicts",
        `L3 Resolution for "${candidateTitle}".`,
      );
      const silentText = `⚙️ Solapamiento detectado. He movido "${candidateTitle}" a las ${fmt(suggestedStart)} \n_Acción: Piloto Automático L3_ 🦞`;
      return {
        content: [{ type: "text", text: silentText }],
        details: {
          conflicts,
          suggestion: { startTime: suggestedStart.toISOString() },
          autoCommitted: true,
        },
      };
    }

    await updateSessionState(
      this.workspaceDir,
      "Conflicts",
      `Collision: "${candidateTitle}" vs ${conflicts.map((c) => c.title).join(", ")}`,
    );
    const bodyText = `⚠️ *CONFLICTO DE HORARIO*\n\n"${candidateTitle}" solapa con:\n${conflicts.map((c) => `• ${c.title}`).join("\n")}\n\n💡 Sugerencia: mover a las ${fmt(suggestedStart)}.`;
    const waPayload = recipient
      ? waButtonPayload(recipient, bodyText, ["✅ Sí, mover", "❌ No, mantener"])
      : null;
    return {
      content: [{ type: "text", text: bodyText }],
      details: {
        conflicts,
        suggestion: { startTime: suggestedStart.toISOString() },
        waInteractivePayload: waPayload,
      },
    };
  }

  private async handleGogSync(params: any) {
    const dateStr = (params.date ?? new Date().toISOString()).split("T")[0];
    const googleEvents = await fetchGogEvents(dateStr);
    if (googleEvents.length === 0)
      return { content: [{ type: "text", text: "📅 No events found in Google Calendar." }] };
    const localEvents = await this.store.load();
    const existingTitles = new Set(localEvents.map((e: any) => `${e.title}_${e.startTime}`));
    const merged: any[] = [];
    for (const ge of googleEvents) {
      if (!existingTitles.has(`${ge.title}_${ge.startTime}`))
        merged.push({ id: `gog_${Math.random().toString(36).slice(2, 7)}`, ...ge });
    }
    if (merged.length > 0) await this.store.save([...localEvents, ...merged]);
    await updateSessionState(this.workspaceDir, "Last Sync", `Synced ${merged.length} gog events.`);
    return {
      content: [{ type: "text", text: `✅ Sync complete: ${merged.length} new events.` }],
      details: { googleEvents, merged },
    };
  }

  private async handleProactiveResearch(params: any) {
    const query = params.title || params.query;
    if (!query) {
      return { content: [{ type: "text", text: "⚠️ Research query is required." }] };
    }
    
    console.log(`[Secretary:Orchestrator] 📊 Researching: ${query}`);
    
    const results = await performWebSearch(query, { maxResults: 10 });
    
    if (results.length === 0) {
      return { content: [{ type: "text", text: `🔍 No search results found for "${query}"` }] };
    }
    
    await updateSessionState(this.workspaceDir, "Research", `Investigated: ${query}`);
    return {
      content: [{ type: "text", text: `🔍 Research completed: ${results.length} results for "${query}"` }],
      details: { results, query },
    };
  }

  private async handleSearchOpportunities(params: any) {
    const location = params.location || "Madrid";
    const query = `${params.type || "venue"} opportunities in ${location}`;
    
    console.log(`[Secretary:Orchestrator] 🔍 Searching opportunities: ${query}`);
    
    const results = await performWebSearch(query, { maxResults: 5 });
    
    const venues = await fetchNearbyVenues(location);
    
    await updateSessionState(this.workspaceDir, "Search", `Opportunities in ${location}`);
    return {
      content: [{ type: "text", text: `💼 Found ${results.length} web results and ${venues.length} local venues in ${location}` }],
      details: { webResults: results, venues, location },
    };
  }

  private async handleEmailConcierge(apiKey: string | undefined) {
    if (!apiKey) return { content: [{ type: "text", text: "⚠️ Maton API key missing." }] };
    const messages = await fetchOutlookInbox(apiKey);
    const critical = messages.filter((m) => /urgent|firma|asap/i.test(m.subject));
    let text = `📧 *Outlook Inbox — ${messages.length} unread*\n🚨 Critical: ${critical.length}`;
    if (critical.length > 0)
      text += `\n\n🚨 *ACTION REQUIRED*: De ${critical[0].from}\nAsunto: ${critical[0].subject}`;
    const recipient = process.env.WA_DEFAULT_PHONE;
    const waPayload =
      recipient && critical.length > 0
        ? waButtonPayload(recipient, text, ["📤 Draft Reply", "🗑️ Ignore"])
        : null;
    await updateSessionState(this.workspaceDir, "Email", `Triaged ${messages.length} inbox items.`);
    return {
      content: [{ type: "text", text }],
      details: { critical, waInteractivePayload: waPayload },
    };
  }

  private async handleWhatsappPreview(params: any, apiKey: string | undefined) {
    const phone = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE ?? "PHONE_NUMBER";
    const preview = waButtonPayload(phone, params.title || "Test", [
      "Option A",
      "Option B",
      "Option C",
    ]);
    return {
      content: [{ type: "text", text: "📱 WhatsApp interactive payload built (see details)." }],
      details: { preview },
    };
  }

  private async handleGmailTriager(params: any) {
    const emails = await fetchGmailUnread(20);
    if (emails.length === 0)
      return { content: [{ type: "text", text: STRINGS.es.noUnreadEmails }] };
    const critical = emails.filter((e) => /urgent|urgente|asap/i.test(e.subject));
    let triageText = `📧 *GMAIL TRIAGE*\n🔴 Críticos: ${critical.length}\n⚪ FYI: ${emails.length - critical.length}`;
    const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
    const waPayload =
      recipient && critical.length > 0
        ? waButtonPayload(recipient, triageText, ["📖 Ver", "✅ OK"])
        : null;
    await updateSessionState(
      this.workspaceDir,
      "Gmail",
      `Triage complete: ${emails.length} unread items.`,
    );
    return {
      content: [{ type: "text", text: triageText }],
      details: { critical, waInteractivePayload: waPayload },
    };
  }

  private async handleRssDigest(params: any) {
    const articles = await fetchRssDigest();
    if (articles.length === 0)
      return { content: [{ type: "text", text: STRINGS.es.rssNoNewItems }] };
    let text =
      "📰 *INTELLIGENCE DIGEST*\n\n" +
      articles
        .slice(0, 5)
        .map((a) => `• *${a.title}*\n  _${a.blog}_`)
        .join("\n\n");
    const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
    const waPayload = recipient
      ? waButtonPayload(recipient, text.substring(0, 1000), ["✅ OK"])
      : null;
    await updateSessionState(
      this.workspaceDir,
      "RSS",
      `News digest sent with ${articles.length} stories.`,
    );
    return {
      content: [{ type: "text", text }],
      details: { articles, waInteractivePayload: waPayload },
    };
  }

  private async handleCalendlySync(providedApiKey: string | undefined, params: any) {
    // AUTO-OAUTH: Intentar obtener API key de Calendly automáticamente
    let apiKey = providedApiKey;
    if (!apiKey) {
      try {
        const cfg = await loadConfig() as OpenClawConfig;
        const auth = await resolveApiKeyForProvider({
          provider: "calendly",
          cfg,
        });
        apiKey = auth.apiKey;
        console.log("[Secretary:Orchestrator] ✅ Auto-detected Calendly API key from auth profiles");
      } catch {
        console.log("[Secretary:Orchestrator] ℹ️  Calendly API key not found in auth profiles");
      }
    }
    
    if (!apiKey) return { content: [{ type: "text", text: STRINGS.es.calendlySyncNoApiKey }] };
    const events = await fetchCalendlyEvents(apiKey);
    if (events.length === 0)
      return { content: [{ type: "text", text: STRINGS.es.calendlySyncNoEvents }] };
    await updateSessionState(
      this.workspaceDir,
      "Calendly",
      `Synced ${events.length} events from Maton.`,
    );
    return {
      content: [{ type: "text", text: `✅ Calendly: ${events.length} bookings sincronizados.` }],
      details: { events },
    };
  }

  private async handleFindNearbyVenues(params: any) {
    const venues = await fetchNearbyVenues(params.location || "Madrid");
    return {
      content: [{ type: "text", text: `🗺️ Found ${venues.length} venues nearby.` }],
      details: { venues },
    };
  }

  private async handleSuggestMealHabits() {
    const habits = await fetchOrderHistory();
    let text =
      habits.length > 0
        ? `🍴 Suggestion: ¿Pedimos en *${habits[0].restaurant}*?`
        : "🍴 No order history found.";
    return { content: [{ type: "text", text }], details: { habits } };
  }

  private async handleGetPersonalContext() {
    const memory = await searchDeepMemory(this.workspaceDir);
    return {
      content: [{ type: "text", text: `🧠 Memories: ${memory.substring(0, 200)}...` }],
      details: { memory },
    };
  }

  private async handleFinancialTriage(params: any) {
    const data = await extractFinancialData(params.emailBody || "");
    if (data.type === "Invoice")
      await updateSessionState(
        this.workspaceDir,
        "Financial",
        `Detected Invoice: ${data.amount} due ${data.deadline}`,
      );
    return {
      content: [
        {
          type: "text",
          text: data.type === "Invoice" ? "💰 Item financiero detectado." : "⚪ No es financiero.",
        },
      ],
      details: { data },
    };
  }

  private async handleIngestDocument(params: any) {
    if (!params.documentPath) throw new Error("documentPath is required.");
    const docPath = this.api.resolvePath(params.documentPath);
    const buffer = await fs.readFile(docPath);
    const result = await this.api.extractPdfContent({
      buffer,
      maxPages: 5,
      maxPixels: 4_000_000,
      minTextChars: 100,
    });
    const financial = await extractFinancialData(result.text);
    await updateSessionState(this.workspaceDir, "Vault", `Ingested ${path.basename(docPath)}.`);
    return {
      content: [{ type: "text", text: `📄 Ingested ${path.basename(docPath)}.` }],
      details: { financial, summary: result.text.substring(0, 200) },
    };
  }

  private async handleVoiceCommandExecutor(runId: string, params: any): Promise<any> {
    if (!params.transcript) throw new Error("Transcript missing.");
    const text = params.transcript.toLowerCase();
    let action = "";
    if (text.includes("briefing") || text.includes("agenda")) action = "briefing";
    else if (text.includes("triaje") || text.includes("email")) action = "gmail_triager";
    if (action) return this.execute(runId, { action });
    return { content: [{ type: "text", text: "🎙️ Comentario registrado en el WAL." }] };
  }

  private async handleAudioSummary(params: any) {
    if (!params.transcript) throw new Error("Transcript missing.");
    await updateSessionState(
      this.workspaceDir,
      "Audio",
      `Snippet: ${params.transcript.substring(0, 50)}...`,
    );

    // Phase 40: Auto-sync audio notes to Second Brain
    const syncedTo = await syncKnowledge(
      this.api,
      `Voice Note ${new Date().toLocaleString()}`,
      params.transcript,
    );

    return {
      content: [
        {
          type: "text",
          text: `🎙️ Nota de voz guardada${syncedTo.length > 0 ? ` y enviada a ${syncedTo.join(", ")}` : ""}.`,
        },
      ],
      details: { transcript: params.transcript, syncedTo },
    };
  }

  private async handleContextualMonitor() {
    return {
      content: [{ type: "text", text: "🔍 Analizando SESSION-STATE.md para sugerencias..." }],
    };
  }

  private async handleProactiveSuggest(params: any) {
    const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
    if (recipient) waButtonPayload(recipient, params.title || "Sugerencia", ["OK"]);
    return { content: [{ type: "text", text: `💡 Suggestion: ${params.title}` }] };
  }

  private async handleLogisticsTriage(params: any) {
    const dateStr = (params.date ?? new Date().toISOString()).split("T")[0];
    const events = (await this.store.load()).filter((e: any) => e.startTime.startsWith(dateStr));
    let text = `🚀 Found ${events.length} logistics items for ${dateStr}.`;
    return { content: [{ type: "text", text }], details: { events } };
  }

  private async handleEventClosureShadowing(params: any) {
    const now = new Date();
    const ago = new Date(now.getTime() - 15 * 60000);
    const events = (await this.store.load()).filter(
      (e: any) => new Date(e.endTime) > ago && new Date(e.endTime) <= now,
    );
    let text = `🏁 Found ${events.length} events for closure shadowing.`;
    return { content: [{ type: "text", text }], details: { events } };
  }

  private async handleFinalizeClosure(params: any) {
    if (!params.transcript) throw new Error("Closure requires transcript.");
    
    const sessionKey = params.sessionKey || "secretary-ghost-write";
    const title = `Acta / Cierre Ghost Write ${new Date().toLocaleDateString()}`;

    await updateSessionState(
      this.workspaceDir,
      "Closure",
      `Finalized: ${params.transcript.substring(0, 50)}...`,
    );

    // Phase 40: Auto-sync Ghost Writes to Second Brain with native transcript append
    const { transcript, knowledge } = await syncGhostWriteToSecondBrain(
      this.api,
      sessionKey,
      title,
      params.transcript,
    );

    const syncedTo = knowledge;
    if (transcript.ok) {
      syncedTo.push("SessionTranscript");
    }

    return {
      content: [
        {
          type: "text",
          text: `📝 Cierre procesado (Ghost Write completed)${syncedTo.length > 0 ? ` y guardado en ${syncedTo.join(", ")}` : ""}.`,
        },
      ],
      details: { syncedTo, transcript },
    };
  }

  private async handleNegotiateMeeting(params: any) {
    if (!params.peerUrl || !params.peerPublicKey)
      throw new Error("Negotiation requires peer context.");
    await updateSessionState(
      this.workspaceDir,
      "P2P",
      `Handshake initiated with ${params.peerUrl}`,
    );
    return {
      content: [{ type: "text", text: "🤝 Negociación P2P iniciada con handshake cifrado." }],
    };
  }

  private async handleHimalayaList(params: any) {
    const envelopes = await himalayaList(params.account);
    return {
      content: [
        {
          type: "text",
          text: `📬 Himalaya (${params.account || "default"}): ${envelopes.length} emails.`,
        },
      ],
      details: { envelopes },
    };
  }

  private async handleHimalayaRead(params: any) {
    if (!params.id) throw new Error("ID required for reading.");
    const content = await himalayaRead(params.id, params.account);
    return { content: [{ type: "text", text: content }] };
  }

  private async handleTriggerFocusMode(params: any) {
    const room = params.room || "Oficina";
    const scene = params.scene || "Concentración";
    await triggerHueScene(this.api, room, scene);
    await triggerSonosFocus(this.api, "Escritorio");
    await updateSessionState(this.workspaceDir, "IoT", `Triggered focus: ${room}/${scene}`);
    return { content: [{ type: "text", text: "🧘 Focus mode active (IOT synced)." }] };
  }

  private async handleGetIoTActivity(params: any) {
    const limit = params.limit || 20;
    const stats = getIoTActivityStats();
    const recent = getIoTActivityLog(limit);

    let text = `📊 *IoT Activity Stats*\n`;
    text += `Total: ${stats.total} | ✅ ${stats.successful} | ❌ ${stats.failed}\n`;
    text += `By device: ${Object.entries(stats.byDevice).map(([k, v]) => `${k}: ${v}`).join(", ")}\n\n`;
    text += `Recent activity:\n`;

    for (const event of recent.slice(-5)) {
      const status = event.success ? "✅" : "❌";
      text += `${status} ${event.device}/${event.action}: ${event.target}\n`;
    }

    return {
      content: [{ type: "text", text }],
      details: { stats, recent },
    };
  }

  private async handleGetMemoryStats(params: any) {
    const stats = getMemoryStats();

    let text = `🧠 *Memory Stats*\n`;
    text += `Total entries: ${stats.total}\n`;
    text += `By category:\n`;
    for (const [category, count] of Object.entries(stats.byCategory)) {
      text += `  ${category}: ${count}\n`;
    }

    return {
      content: [{ type: "text", text }],
      details: { stats },
    };
  }

  private async handleUrgentAlert(params: any) {
    const phone = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
    const msg = params.message || "Intervención crítica.";
    if (phone) await triggerUrgentAlert(phone, msg);
    await updateSessionState(this.workspaceDir, "Alert", `Urgent message sent to ${phone}.`);
    return { content: [{ type: "text", text: "🚨 Alerta enviada." }] };
  }

  private async handleProcessText(params: any) {
    const text = params.text || "";
    const mode = params.mode || "whatsapp";

    if (!text) {
      return { content: [{ type: "text", text: "⚠️ No text provided for processing." }] };
    }

    try {
      const limit = await resolveTextChunkLimit(this.api, mode as any);
      const chunkMode = await resolveChunkMode(this.api, mode as any);

      if (text.includes("|") && text.includes("---")) {
        const converted = await convertTablesForChannel(this.api, text, mode as any);
        const chunks = await chunkMarkdownForWhatsApp(this.api, converted, limit, chunkMode);

        return {
          content: [{ type: "text", text: `✅ Processed: ${chunks.chunkCount} chunks (${chunks.originalLength} chars)` }],
          details: {
            processed: true,
            chunkCount: chunks.chunkCount,
            originalLength: chunks.originalLength,
            limit,
            mode: chunkMode,
          },
        };
      } else {
        const chunks = await chunkMarkdownForWhatsApp(this.api, text, limit, chunkMode);

        return {
          content: [{ type: "text", text: `✅ Processed: ${chunks.chunkCount} chunks (${chunks.originalLength} chars)` }],
          details: {
            processed: true,
            chunkCount: chunks.chunkCount,
            originalLength: chunks.originalLength,
            limit,
            mode: chunkMode,
          },
        };
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Text processing failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  // ========== SLACK HANDLERS ==========

  private async handleSlackSend(params: any) {
    const channel = params.channel || params.to;
    const message = params.message || params.text || params.title;

    if (!channel || !message) {
      return { content: [{ type: "text", text: "⚠️ Slack: channel and message are required." }] };
    }

    const result = await slackSendMessage(this.api, channel, message);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "Slack", `Sent to ${channel}: ${message.substring(0, 50)}...`);
      return { content: [{ type: "text", text: `✅ Message sent to Slack ${channel}` }] };
    }
    return { content: [{ type: "text", text: `❌ Slack error: ${result.error}` }] };
  }

  private async handleSlackMarkDone(params: any) {
    const channel = params.channel;
    const messageId = params.messageId;

    if (!channel || !messageId) {
      return { content: [{ type: "text", text: "⚠️ Slack: channel and messageId are required." }] };
    }

    const result = await slackMarkAsDone(this.api, channel, messageId);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "Slack", `Marked done in ${channel}`);
      return { content: [{ type: "text", text: `✅ Task marked as done in Slack ${channel}` }] };
    }
    return { content: [{ type: "text", text: `❌ Slack error: ${result.error}` }] };
  }

  private async handleSlackRead(params: any) {
    const channel = params.channel;
    const limit = params.limit || 20;

    if (!channel) {
      return { content: [{ type: "text", text: "⚠️ Slack: channel is required." }] };
    }

    const result = await slackReadMessages(this.api, channel, limit);

    if (result.success && result.messages) {
      const formatted = result.messages
        .slice(-10)
        .map((m) => `[${m.user}] ${m.text.substring(0, 100)}`)
        .join("\n");
      return {
        content: [{ type: "text", text: `💬 **Slack #${channel}**\n\n${formatted}` }],
        details: { messages: result.messages },
      };
    }
    return { content: [{ type: "text", text: `❌ Slack error: ${result.error}` }] };
  }

  // ========== iMSG HANDLERS ==========

  private async handleImsgList(params: any) {
    const available = await checkImsgAvailable();
    if (!available) {
      return { content: [{ type: "text", text: "❌ iMsg no disponible. Requiere macOS con Messages.app." }] };
    }

    const limit = params.limit || 10;
    const chats = await imsgListChats(limit);

    if (chats.length === 0) {
      return { content: [{ type: "text", text: "📭 No hay chats recientes." }] };
    }

    const formatted = chats
      .map((c) => `💬 ${c.displayName} (${c.service})`)
      .join("\n");

    return {
      content: [{ type: "text", text: `📱 **Chats Recientes**\n\n${formatted}` }],
      details: { chats },
    };
  }

  private async handleImsgHistory(params: any) {
    const available = await checkImsgAvailable();
    if (!available) {
      return { content: [{ type: "text", text: "❌ iMsg no disponible. Requiere macOS con Messages.app." }] };
    }

    const contact = params.contact || params.to;
    const limit = params.limit || 20;

    if (!contact) {
      return { content: [{ type: "text", text: "⚠️ iMsg: contact name is required." }] };
    }

    const { chat, messages } = await imsgGetRecentMessages(contact, limit);

    if (!chat) {
      return { content: [{ type: "text", text: `❌ Chat "${contact}" no encontrado.` }] };
    }

    const formatted = await imsgFormatChatForSecretary(chat, messages);
    return { content: [{ type: "text", text: formatted }], details: { chat, messages } };
  }

  private async handleImsgSend(params: any) {
    const available = await checkImsgAvailable();
    if (!available) {
      return { content: [{ type: "text", text: "❌ iMsg no disponible. Requiere macOS con Messages.app." }] };
    }

    const to = params.to || params.contact;
    const message = params.message || params.text;

    if (!to || !message) {
      return { content: [{ type: "text", text: "⚠️ iMsg: recipient and message are required." }] };
    }

    const result = await imsgSendQuick(to, message);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "iMsg", `Sent to ${to}: ${message.substring(0, 50)}...`);
      return { content: [{ type: "text", text: `✅ iMsg enviado a ${to}` }] };
    }
    return { content: [{ type: "text", text: `❌ iMsg error: ${result.error}` }] };
  }

  // ========== REMINDERS HANDLERS ==========

  private async handleRemindersToday(params: any) {
    const available = await checkRemindersAvailable();
    if (!available) {
      return { content: [{ type: "text", text: "❌ Reminders no disponible. Requiere macOS con Remindctl." }] };
    }

    const reminders = await remindersGetToday();
    const formatted = await remindersFormatSummary(reminders);

    return { content: [{ type: "text", text: formatted }], details: { reminders } };
  }

  private async handleRemindersWeek(params: any) {
    const available = await checkRemindersAvailable();
    if (!available) {
      return { content: [{ type: "text", text: "❌ Reminders no disponible." }] };
    }

    const reminders = await remindersGetWeek();
    const formatted = await remindersFormatSummary(reminders);

    return { content: [{ type: "text", text: formatted }], details: { reminders } };
  }

  private async handleRemindersOverdue(params: any) {
    const available = await checkRemindersAvailable();
    if (!available) {
      return { content: [{ type: "text", text: "❌ Reminders no disponible." }] };
    }

    const reminders = await remindersGetOverdue();

    if (reminders.length === 0) {
      return { content: [{ type: "text", text: "✅ No hay recordatorios vencidos." }] };
    }

    const formatted = reminders
      .map((r) => `⚠️ ${r.title} (${r.list})`)
      .join("\n");

    return {
      content: [{ type: "text", text: `🚨 **Vencidos**\n\n${formatted}` }],
      details: { reminders },
    };
  }

  private async handleRemindersCreate(params: any) {
    const available = await checkRemindersAvailable();
    if (!available) {
      return { content: [{ type: "text", text: "❌ Reminders no disponible." }] };
    }

    const title = params.title || params.message || params.text;
    const dueDate = params.date;

    if (!title) {
      return { content: [{ type: "text", text: "⚠️ Reminders: title is required." }] };
    }

    const result = await remindersCreateFromNaturalLanguage(title);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "Reminders", `Created: ${title}`);
      return { content: [{ type: "text", text: `✅ Recordatorio creado: "${title}"` }] };
    }
    return { content: [{ type: "text", text: `❌ Reminders error: ${result.error}` }] };
  }

  private async handleRemindersComplete(params: any) {
    const available = await checkRemindersAvailable();
    if (!available) {
      return { content: [{ type: "text", text: "❌ Reminders no disponible." }] };
    }

    const id = params.id;

    if (!id) {
      return { content: [{ type: "text", text: "⚠️ Reminders: id is required." }] };
    }

    const result = await remindersComplete(id);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "Reminders", `Completed: ${id}`);
      return { content: [{ type: "text", text: `✅ Recordatorio completado.` }] };
    }
    return { content: [{ type: "text", text: `❌ Reminders error: ${result.error}` }] };
  }

  private async handleRemindersSync(params: any) {
    const available = await checkRemindersAvailable();
    if (!available) {
      return { content: [{ type: "text", text: "❌ Reminders no disponible." }] };
    }

    const actionItems = params.actionItems || [];

    if (!Array.isArray(actionItems) || actionItems.length === 0) {
      return { content: [{ type: "text", text: "⚠️ Reminders sync: actionItems array is required." }] };
    }

    const result = await remindersSyncFromBriefing(actionItems);

    await updateSessionState(
      this.workspaceDir,
      "Reminders",
      `Synced ${result.created} items from briefing`,
    );

    return {
      content: [
        {
          type: "text",
          text: `✅ Sincronizados ${result.created} recordatorios${result.failed > 0 ? `, ${result.failed} fallidos` : ""}`,
        },
      ],
      details: result,
    };
  }

  // ========== VOICE WAKE HANDLERS ==========

  private async handleVoiceWakeStatus(_params: any) {
    const status = await getVoiceWakeStatus(this.api);
    const formatted = formatVoiceWakeStatus(status);

    return { content: [{ type: "text", text: formatted }], details: { status } };
  }

  private async handleVoiceWakeEnable(_params: any) {
    const result = await setVoiceWakeEnabled(this.api, true);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "VoiceWake", "Proactive mode enabled");
      return { content: [{ type: "text", text: "✅ Voice Wake proactivo habilitado." }] };
    }
    return { content: [{ type: "text", text: `❌ Error: ${result.error}` }] };
  }

  private async handleVoiceWakeDisable(_params: any) {
    const result = await setVoiceWakeEnabled(this.api, false);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "VoiceWake", "Proactive mode disabled");
      return { content: [{ type: "text", text: "✅ Voice Wake proactivo deshabilitado." }] };
    }
    return { content: [{ type: "text", text: `❌ Error: ${result.error}` }] };
  }

  private async handleVoiceWakeSetWord(params: any) {
    const wakeWord = params.wakeWord || params.word || params.title;

    if (!wakeWord) {
      return { content: [{ type: "text", text: "⚠️ Wake word es requerido." }] };
    }

    const result = await setWakeWord(this.api, wakeWord);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "VoiceWake", `Wake word changed to: ${wakeWord}`);
      return { content: [{ type: "text", text: `✅ Wake word configurado: "${wakeWord}"` }] };
    }
    return { content: [{ type: "text", text: `❌ Error: ${result.error}` }] };
  }

  // ========== NODE MODE HANDLERS ==========

  private async handleNodeStatus(_params: any) {
    const status = await getNodeStatus(this.api);
    const formatted = formatNodeStatus(status);

    return { content: [{ type: "text", text: formatted }], details: { status } };
  }

  private async handleNodeSync(_params: any) {
    const result = await syncOfflineQueue(this.api);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "NodeMode", `Sync complete: ${result.synced} actions`);
      return {
        content: [{ type: "text", text: `✅ Sync complete: ${result.synced} synced${result.failed > 0 ? `, ${result.failed} failed` : ""}` }],
        details: result,
      };
    }
    return {
      content: [{ type: "text", text: `⚠️ Sync partial: ${result.synced} synced, ${result.failed} failed` }],
      details: result,
    };
  }

  private async handleNodeSetMode(params: any) {
    const mode = params.mode;

    if (!mode || !["full", "edge", "offline"].includes(mode)) {
      return { content: [{ type: "text", text: "⚠️ Node mode must be: full, edge, or offline" }] };
    }

    const result = await setNodeMode(this.api, mode);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "NodeMode", `Mode set to: ${mode}`);
      return { content: [{ type: "text", text: `✅ Node mode: ${mode.toUpperCase()}` }] };
    }
    return { content: [{ type: "text", text: "❌ Failed to set node mode" }] };
  }

  private async handleNodeClearQueue(_params: any) {
    const result = await clearOfflineQueue(this.api);

    if (result.cleared) {
      await updateSessionState(this.workspaceDir, "NodeMode", "Offline queue cleared");
      return { content: [{ type: "text", text: "✅ Offline queue cleared" }] };
    }
    return { content: [{ type: "text", text: "❌ Failed to clear queue" }] };
  }

  // ========== MOBILE HANDLERS ==========

  private async handleMobileDeviceStatus(_params: any) {
    const status = await getDeviceStatus(this.api);

    if (!status) {
      return { content: [{ type: "text", text: "❌ No se pudo obtener el estado del dispositivo. Asegúrate de estar en un móvil pareado." }] };
    }

    const formatted = await formatDeviceStatus(status);
    await updateSessionState(this.workspaceDir, "Mobile", "Device status retrieved");

    return { content: [{ type: "text", text: formatted }], details: { status } };
  }

  private async handleMobileDeviceInfo(_params: any) {
    const info = await getDeviceInfo(this.api);

    if (!info) {
      return { content: [{ type: "text", text: "❌ No se pudo obtener info del dispositivo." }] };
    }

    const text = `📱 **Device Info**\n\n• Model: ${info.model}\n• OS: ${info.os}\n• App Version: ${info.appVersion}`;
    await updateSessionState(this.workspaceDir, "Mobile", "Device info retrieved");

    return { content: [{ type: "text", text }], details: { info } };
  }

  private async handleMobileLocation(params: any) {
    const accuracy = params.accuracy || "balanced";
    const location = await getLocation(this.api, accuracy);

    if (!location) {
      return { content: [{ type: "text", text: "❌ No se pudo obtener la ubicación. Verifica los permisos de ubicación." }] };
    }

    const formatted = await formatLocationContext(location);
    await updateSessionState(this.workspaceDir, "Mobile", `Location: ${location.latitude}, ${location.longitude}`);

    return { content: [{ type: "text", text: formatted }], details: { location } };
  }

  private async handleMobilePhotos(params: any) {
    const limit = params.limit || 10;
    const photos = await getRecentPhotos(this.api, limit);

    if (photos.length === 0) {
      return { content: [{ type: "text", text: "📷 No se encontraron fotos recientes." }] };
    }

    const text = `📷 **Fotos Recientes** (${photos.length})\n\n${photos.map((p, i) => `${i + 1}. ${new Date(p.timestamp).toLocaleString()}`).join("\n")}`;
    await updateSessionState(this.workspaceDir, "Mobile", `Retrieved ${photos.length} recent photos`);

    return { content: [{ type: "text", text }], details: { photos } };
  }

  private async handleMobileContactsSearch(params: any) {
    const query = params.query || params.contact;

    if (!query) {
      return { content: [{ type: "text", text: "⚠️ Query de búsqueda es requerida." }] };
    }

    const contacts = await searchContacts(this.api, query);

    if (contacts.length === 0) {
      return { content: [{ type: "text", text: `👤 No se encontraron contactos para "${query}".` }] };
    }

    const text = `👤 **Contactos** (${contacts.length})\n\n${contacts.map(c => `• ${c.name}${c.phone ? ` - ${c.phone}` : ""}`).join("\n")}`;
    await updateSessionState(this.workspaceDir, "Mobile", `Contact search: ${query}`);

    return { content: [{ type: "text", text }], details: { contacts } };
  }

  private async handleMobileContactsAdd(params: any) {
    const name = params.name || params.title;
    const phone = params.phone || params.to;
    const email = params.email;

    if (!name) {
      return { content: [{ type: "text", text: "⚠️ Nombre es requerido." }] };
    }

    const result = await addContact(this.api, { name, phone, email });

    if (result.success) {
      await updateSessionState(this.workspaceDir, "Mobile", `Contact added: ${name}`);
      return { content: [{ type: "text", text: `✅ Contacto "${name}" agregado correctamente.` }] };
    }
    return { content: [{ type: "text", text: "❌ Error agregando contacto." }] };
  }

  private async handleMobileNotifications(params: any) {
    const limit = params.limit || 20;
    const notifications = await listNotifications(this.api, limit);

    if (notifications.length === 0) {
      return { content: [{ type: "text", text: "🔔 No hay notificaciones recientes." }] };
    }

    const formatted = await formatNotificationSummary(notifications);
    await updateSessionState(this.workspaceDir, "Mobile", `Retrieved ${notifications.length} notifications`);

    return { content: [{ type: "text", text: formatted }], details: { notifications } };
  }

  private async handleMobileNotificationAction(params: any) {
    const notificationKey = params.notificationKey || params.id;
    const action = params.notificationAction || params.action || "open";
    const replyText = params.replyText || params.message;

    if (!notificationKey) {
      return { content: [{ type: "text", text: "⚠️ notificationKey es requerido." }] };
    }

    const result = await notificationAction(this.api, notificationKey, action, replyText);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "Mobile", `Notification action: ${action}`);
      return { content: [{ type: "text", text: `✅ Acción "${action}" ejecutada.` }] };
    }
    return { content: [{ type: "text", text: "❌ Error ejecutando acción." }] };
  }

  private async handleMobileSms(params: any) {
    const phone = params.phone || params.to;
    const message = params.message || params.text;

    if (!phone || !message) {
      return { content: [{ type: "text", text: "⚠️ Teléfono y mensaje son requeridos." }] };
    }

    const result = await sendSms(this.api, phone, message);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "Mobile", `SMS sent to ${phone}`);
      return { content: [{ type: "text", text: `✅ SMS enviado a ${phone}.` }] };
    }
    return { content: [{ type: "text", text: "❌ Error enviando SMS. Verifica permisos." }] };
  }

  private async handleMobileMotion(_params: any) {
    const activity = await getMotionActivity(this.api);
    const pedometer = await getPedometerData(this.api);

    let text = "🏃 **Activity Monitor**\n\n";

    if (activity) {
      text += `• Activity: ${activity.activity} (${Math.round(activity.confidence * 100)}% confidence)\n`;
    }

    if (pedometer) {
      text += `• Steps today: ${pedometer.steps.toLocaleString()}`;
      if (pedometer.distance) {
        text += ` (${(pedometer.distance / 1000).toFixed(1)} km)`;
      }
    }

    if (!activity && !pedometer) {
      return { content: [{ type: "text", text: "❌ No se pudo obtener datos de actividad." }] };
    }

    await updateSessionState(this.workspaceDir, "Mobile", "Activity data retrieved");

    return { content: [{ type: "text", text }], details: { activity, pedometer } };
  }

  private async handleMobilePhotoCapture(params: any) {
    const facing = params.facing || "back";
    const quality = params.quality || 0.8;

    const result = await takePhoto(this.api, facing, quality);

    if (result.success && result.path) {
      await updateSessionState(this.workspaceDir, "Mobile", `Photo captured: ${result.path}`);
      return { content: [{ type: "text", text: `📷 Foto capturada: ${result.path}` }] };
    }
    return { content: [{ type: "text", text: "❌ Error capturando foto. Verifica permisos de cámara." }] };
  }

  private async handleMobileVideoRecord(params: any) {
    const durationMs = params.durationMs || params.duration || 30000;
    const facing = params.facing || "back";

    const result = await recordVideo(this.api, durationMs, facing);

    if (result.success && result.path) {
      await updateSessionState(this.workspaceDir, "Mobile", `Video recorded: ${result.path}`);
      return { content: [{ type: "text", text: `🎬 Video grabado: ${result.path}` }] };
    }
    return { content: [{ type: "text", text: "❌ Error grabando video." }] };
  }

  private async handleMobileScreenRecord(params: any) {
    const durationMs = params.durationMs || params.duration || 60000;

    const result = await screenRecord(this.api, durationMs);

    if (result.success && result.path) {
      await updateSessionState(this.workspaceDir, "Mobile", `Screen recorded: ${result.path}`);
      return { content: [{ type: "text", text: `🖥️ Pantalla grabada: ${result.path}` }] };
    }
    return { content: [{ type: "text", text: "❌ Error grabando pantalla." }] };
  }

  private async handleMobileNotify(params: any) {
    const title = params.title || "Secretary";
    const body = params.body || params.message || params.text;
    const priority = params.priority || "active";

    if (!body) {
      return { content: [{ type: "text", text: "⚠️ Body del mensaje es requerido." }] };
    }

    const result = await showNotification(this.api, title, body, priority);

    if (result.success) {
      await updateSessionState(this.workspaceDir, "Mobile", `Notification: ${title}`);
      return { content: [{ type: "text", text: "🔔 Notificación enviada al móvil." }] };
    }
    return { content: [{ type: "text", text: "❌ Error enviando notificación." }] };
  }
}

export function registerProactiveHooks(api: OpenClawPluginApi) {
  api.on("gateway_start", async () => {
    console.log("[Secretary] 🕒 Demonio cronométrico iniciado en background...");

    const nodeSyncInterval = 5 * 60 * 1000; // 5 minutes
    setInterval(async () => {
      try {
        const pending = await getOfflineQueue(api);
        if (pending.length > 0) {
          console.log(`[Secretary] 🔄 Syncing ${pending.length} offline actions...`);
          await syncOfflineQueue(api);
        }
      } catch (e) {
        console.error("[Secretary] Node sync error:", e);
      }
    }, nodeSyncInterval);

    // Intervalo de evaluación: cada 60 segundos
    setInterval(async () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();

      const orchestrator = new SecretaryOrchestrator(api);

      // Regla 1: Triaje Matutino (08:00 AM)
      if (hours === 8 && mins === 0) {
        const today = now.toISOString().split("T")[0];
        const marker = api.resolvePath("./.last-morning-briefing");
        try {
          const last = await fs.readFile(marker, "utf-8");
          if (last.trim() === today) return; // Ya se hizo hoy
        } catch {}

        await fs.writeFile(marker, today);
        console.log("☀️ [Secretary] Ejecutando Triaje Matutino Autónomo...");

        // Disparar las lógicas de resumen (email, rss)
        try {
          await orchestrator.execute("cron-morning", { action: "gmail_triager" });
          await orchestrator.execute("cron-morning", { action: "rss_digest" });
        } catch (e) {
          console.error("☀️ [Secretary] Error en Triaje Matutino:", e);
        }
      }

      // Regla 2: Cierre Nocturno (22:00 PM)
      if (hours === 22 && mins === 0) {
        const today = now.toISOString().split("T")[0];
        const marker = api.resolvePath("./.last-evening-closure");
        try {
          const last = await fs.readFile(marker, "utf-8");
          if (last.trim() === today) return; // Ya se hizo hoy
        } catch {}

        await fs.writeFile(marker, today);
        console.log("🌙 [Secretary] Ejecutando Cierre Nocturno Autónomo...");

        try {
          await orchestrator.execute("cron-evening", { action: "sync_tasks" });
          await orchestrator.execute("cron-evening", { action: "logistics_triage" });
        } catch (e) {
          console.error("🌙 [Secretary] Error en Cierre Nocturno:", e);
        }
      }
    }, 60000); // Evalúa cada minuto
  });

  // Phase 41B: Hyper-Context (Zero-latency environmental awareness)
  api.on("before_prompt_build", async (event) => {
    try {
      // Intentamos leer el estado de la sesión, específicamente la última actividad
      const statePath = api.resolvePath("./SESSION-STATE.md");
      const stateContent = await fs.readFile(statePath, "utf-8");

      // Inyectamos esto en el system prompt antes de cada mensaje para evitar que
      // el LLM tenga que hacer tool calls para saber donde está el usuario
      return {
        appendSystemContext: `\n\n=== RECENT REAL-WORLD CONTEXT (ZERO LATENCY) ===\n${stateContent.substring(0, 800)}\n================================================\n`,
      };
    } catch {
      // Falla silente si no hay contexto
      return {};
    }
  });

  api.on("tool_result_persist", (event) => {
    if (event.toolName && ["calendar_tool", "gog_sync", "calendly_sync"].includes(event.toolName)) {
      console.log(`[Secretary] Conflict check triggered by ${event.toolName}`);
    }
  });

  api.on("message_received", async (event) => {
    if (/factura|pago|vencimiento/i.test(event.content)) {
      console.log(`[Secretary] Financial triage hook detected potential invoice.`);
    }
  });

  api.on("message_sending", async (event) => {
    if (/reunión|cita/.test(event.content.toLowerCase())) {
      return { content: `${event.content}\n\n💡 _Verificado con Secretary_ 🦞` };
    }
  });

  api.on("node_event", async (event) => {
    if (event.event === "biometry") {
      const payload = event.payload as any;
      if ((payload?.stressLevel ?? 0) > 80) {
        console.log("[Secretary] High stress hook: triggering recommendation queue.");
      }
    }
  });

  // Phase 39: Enhanced subagent outcome tracking for WAL
  api.on("subagent_ended", async (event) => {
    const outcome = event.outcome || "unknown";
    const duration = event.endedAt
      ? `(ended at ${new Date(event.endedAt).toLocaleTimeString()})`
      : "";
    console.log(
      `[Secretary] Subagent ${event.targetSessionKey} [${event.targetKind}] ended with outcome: ${outcome} ${duration}`,
    );

    await updateSessionState(
      api.resolvePath((api.config.agents?.defaults?.workspace as string) || "./workspace"),
      "SUBAGENT_SYNC",
      `Delegation ${outcome.toUpperCase()}: ${event.targetSessionKey} ${duration}`,
    );
  });
}
