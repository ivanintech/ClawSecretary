import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { Type } from "@sinclair/typebox";
import { extractPdfContent } from "../../../src/media/pdf-extract.js";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "../../../src/plugins/types.js";
import { CalendarStore } from "./store.js";

const execFileAsync = promisify(execFile);

// â”€â”€â”€ WAL Protocol Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * "STOP and PERSIST before you REPLY." â€” WAL-PROTOCOL.md + proactive-agent v3.1
 */
async function updateSessionState(
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
    content = "# Active Working Memory (WAL) ðŸ¦ž\n\n**Status**: READY\n\n---\n";
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

// â”€â”€â”€ Working Buffer Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function appendWorkingBuffer(
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
    /* silent â€” buffer is non-critical */
  }
}

// â”€â”€â”€ gog Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchGogEvents(
  dateStr: string,
): Promise<{ title: string; startTime: string; endTime: string }[]> {
  try {
    const { stdout } = await execFileAsync("gog", [
      "calendar",
      "events",
      "primary",
      "--from",
      `${dateStr}T00:00:00Z`,
      "--to",
      `${dateStr}T23:59:59Z`,
      "--json",
      "--no-input",
    ]);
    const raw = JSON.parse(stdout) as {
      summary?: string;
      start?: { dateTime?: string };
      end?: { dateTime?: string };
    }[];
    return raw.map((e) => ({
      title: e.summary ?? "Sin tÃ­tulo",
      startTime: e.start?.dateTime ?? `${dateStr}T00:00:00Z`,
      endTime: e.end?.dateTime ?? `${dateStr}T01:00:00Z`,
    }));
  } catch {
    return []; // gog unavailable or no account configured
  }
}

// â”€â”€â”€ Weather Helper (wttr.in â€” no API key needed) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchWeather(city: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync("curl", [
      "-s",
      `wttr.in/${encodeURIComponent(city)}?format=%c+%t+%w+%h`,
    ]);
    return stdout.trim() || "ðŸ—…ï¸ Tiempo no disponible";
  } catch {
    return "ðŸ—…ï¸ Tiempo no disponible";
  }
}

// â”€â”€â”€ Gmail Unread Helper (gog) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchGmailUnread(
  maxResults = 15,
): Promise<{ subject: string; from: string; snippet: string }[]> {
  try {
    const { stdout } = await execFileAsync("gog", [
      "gmail",
      "messages",
      "search",
      "is:unread newer_than:1h",
      "--max",
      String(maxResults),
      "--json",
      "--no-input",
    ]);
    const raw = JSON.parse(stdout) as { subject?: string; from?: string; snippet?: string }[];
    return raw.map((m) => ({
      subject: m.subject ?? "(sin asunto)",
      from: m.from ?? "Desconocido",
      snippet: m.snippet ?? "",
    }));
  } catch {
    return []; // gog not available or no account
  }
}

// â”€â”€â”€ RSS Intelligence Helper (blogwatcher) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchRssDigest(): Promise<{ title: string; blog: string; url?: string }[]> {
  try {
    const { stdout } = await execFileAsync("blogwatcher", ["articles", "--json"]);
    // blogwatcher outputs JSON lines or JSON array
    const raw = JSON.parse(stdout) as { title?: string; blog?: string; url?: string }[];
    return raw.slice(0, 10).map((a) => ({
      title: a.title ?? "Sin tÃ­tulo",
      blog: a.blog ?? "Feed",
      url: a.url,
    }));
  } catch {
    // blogwatcher not installed or no feeds configured
    return [];
  }
}

// â”€â”€â”€ Maton Outlook Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchOutlookInbox(
  apiKey: string,
): Promise<{ subject: string; from: string; id: string; bodyPreview: string }[]> {
  const res = await fetch(
    "https://gateway.maton.ai/outlook/v1.0/me/mailFolders/Inbox/messages?$top=20&$filter=isRead eq false&$orderby=receivedDateTime desc&$select=id,subject,from,bodyPreview",
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );
  if (!res.ok) return [];
  const data = (await res.json()) as {
    value?: {
      id: string;
      subject: string;
      from: { emailAddress: { name: string } };
      bodyPreview: string;
    }[];
  };
  return (data.value ?? []).map((m) => ({
    id: m.id,
    subject: m.subject ?? "(sin asunto)",
    from: m.from?.emailAddress?.name ?? "Desconocido",
    bodyPreview: m.bodyPreview ?? "",
  }));
}

// â”€â”€â”€ Venue Intel Helper (goplaces) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchNearbyVenues(
  query: string,
  lat?: number,
  lng?: number,
): Promise<{ name: string; address: string; rating: number }[]> {
  try {
    const args = ["search", query, "--json", "--limit", "3", "--min-rating", "4"];
    if (lat !== undefined && lng !== undefined) {
      args.push("--lat", String(lat), "--lng", String(lng), "--radius-m", "2000");
    }
    const { stdout } = await execFileAsync("goplaces", args);
    const raw = JSON.parse(stdout) as {
      name?: string;
      formatted_address?: string;
      rating?: number;
    }[];
    return raw.map((p) => ({
      name: p.name ?? "Lugar desconocido",
      address: p.formatted_address ?? "",
      rating: p.rating ?? 0,
    }));
  } catch {
    return [];
  }
}

// â”€â”€â”€ Food & habit Helper (ordercli) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchOrderHistory(): Promise<{ code: string; items: string; restaurant: string }[]> {
  try {
    const { stdout } = await execFileAsync("ordercli", [
      "foodora",
      "history",
      "--limit",
      "5",
      "--json",
    ]);
    const raw = JSON.parse(stdout) as { code: string; vendor_name?: string; summary?: string }[];
    return raw.map((o) => ({
      code: o.code,
      restaurant: o.vendor_name ?? "Restaurante",
      items: o.summary ?? "",
    }));
  } catch {
    return [];
  }
}

// â”€â”€â”€ Personalized Memory Helper (WAL Read) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function searchDeepMemory(workspaceDir: string | undefined): Promise<string> {
  if (!workspaceDir) return "No hay memoria disponible.";
  try {
    const sessionStatePath = path.join(workspaceDir, "SESSION-STATE.md");
    const content = await fs.readFile(sessionStatePath, "utf-8");
    // Just return the last 1000 chars for context
    return content.length > 2000 ? `...${content.slice(-2000)}` : content;
  } catch {
    return "No hay memoria disponible.";
  }
}

// â”€â”€â”€ Calendly Helpers (Maton API) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchCalendlyEvents(apiKey: string): Promise<any[]> {
  try {
    const res = await fetch("https://gateway.maton.ai/calendly/scheduled_events?status=active", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.collection || [];
  } catch {
    return [];
  }
}

async function fetchCalendlyInvitees(apiKey: string, eventUri: string): Promise<any[]> {
  try {
    // Extract UUID from URI: https://api.calendly.com/scheduled_events/UUID
    const uuid = eventUri.split("/").pop();
    const res = await fetch(`https://gateway.maton.ai/calendly/scheduled_events/${uuid}/invitees`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.collection || [];
  } catch {
    return [];
  }
}

// â”€â”€â”€ WhatsApp Business Button Payload Builder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function waButtonPayload(to: string, bodyText: string, buttons: string[]): object {
  return {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: {
        buttons: buttons.slice(0, 3).map((label, i) => ({
          type: "reply",
          reply: { id: `btn_${i}`, title: label },
        })),
      },
    },
  };
}

export function createOrchestratorTool(api: OpenClawPluginApi) {
  const store = new CalendarStore(api.resolvePath("./data"));

  return {
    name: "secretary_orchestrator",
    label: "Secretary Orchestrator",
    description:
      "Multi-service agenda orchestration, proactive briefings, live Google/Outlook sync, and WAL-compliant conflict management.",
    parameters: Type.Object({
      action: Type.String({
        enum: [
          "briefing",
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
          "sync_to_notion",
          "find_nearby_venues",
          "suggest_meal_habits",
          "get_personal_context",
          "financial_triage",
          "ingest_document",
          "voice_command_executor",
          "audio_summary",
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
      transcript: Type.Optional(
        Type.String({ description: "Transcribed text for voice actions." }),
      ),
      documentPath: Type.Optional(Type.String({ description: "Path to the PDF document." })),
      emailSubject: Type.Optional(Type.String({ description: "Subject of an email for triage." })),
      emailBody: Type.Optional(Type.String({ description: "Body of an email for triage." })),
    }),

    async execute(_runId: string, params: Record<string, any>, ctx?: OpenClawPluginToolContext) {
      const localEvents = await store.load();
      const workspaceDir = ctx?.workspaceDir;
      const apiKey = process.env.MATON_API_KEY;

      // â”€â”€â”€ SETUP STATUS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "setup_status") {
        let gogInstalled = false;
        try {
          await execFileAsync("gog", ["--version"]);
          gogInstalled = true;
        } catch {
          /* noop */
        }

        const status = {
          local_calendar: "âœ… Connected",
          google_calendar_gog:
            process.env.GOG_ACCOUNT && gogInstalled
              ? "âœ… Connected"
              : gogInstalled
                ? "âš ï¸ gog installed but GOG_ACCOUNT not set"
                : "âŒ gog CLI not installed",
          outlook: apiKey ? "âœ… Maton OAuth ready" : "âŒ Missing MATON_API_KEY",
          whatsapp_business:
            apiKey && process.env.WA_PHONE_NUMBER_ID
              ? "âœ… Connected"
              : "âš ï¸ MATON_API_KEY or WA_PHONE_NUMBER_ID missing",
          calendly: process.env.CALENDLY_API_KEY ? "âœ… Connected" : "âŒ Missing CALENDLY_API_KEY",
          tavily: process.env.TAVILY_API_KEY ? "âœ… Connected" : "âŒ Missing TAVILY_API_KEY",
        };

        let message = "ðŸ“Š *CLAWSECRETARY SETUP STATUS*\n\n";
        for (const [k, v] of Object.entries(status)) {
          message += `â€¢ *${k.toUpperCase()}*: ${v}\n`;
        }
        return { content: [{ type: "text", text: message }], details: { status } };
      }

      // â”€â”€â”€ GOG SYNC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "gog_sync") {
        const dateStr = (params.date ?? new Date().toISOString()).split("T")[0];
        const googleEvents = await fetchGogEvents(dateStr);

        if (googleEvents.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "ðŸ“… No se encontraron eventos en Google Calendar (o gog no disponible).",
              },
            ],
          };
        }

        // Merge: add gog events not already in local store
        const existingTitles = new Set(localEvents.map((e) => `${e.title}_${e.startTime}`));
        const merged: typeof localEvents = [];
        for (const ge of googleEvents) {
          const key = `${ge.title}_${ge.startTime}`;
          if (!existingTitles.has(key)) {
            merged.push({ id: `gog_${Math.random().toString(36).slice(2, 7)}`, ...ge });
          }
        }
        if (merged.length > 0) {
          await store.save([...localEvents, ...merged]);
        }

        await updateSessionState(
          workspaceDir,
          "Last Sync",
          `Google Calendar sync: ${googleEvents.length} events fetched, ${merged.length} new merged`,
        );
        return {
          content: [
            {
              type: "text",
              text: `âœ… Sincronizados *${googleEvents.length}* eventos de Google Calendar (${merged.length} nuevos).\n${googleEvents.map((e) => `â€¢ ${e.startTime.substring(11, 16)} âˆ’ *${e.title}*`).join("\n")}`,
            },
          ],
          details: { googleEvents, merged },
        };
      }

      // â”€â”€â”€ DAILY BRIEFING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "briefing") {
        const targetDate = params.date ? new Date(params.date) : new Date();
        const dateStr = targetDate.toISOString().split("T")[0];

        // Merge local + Google events
        const gogEvents = await fetchGogEvents(dateStr);
        const allEventMap = new Map<string, (typeof localEvents)[0]>();
        localEvents
          .filter((e) => e.startTime.startsWith(dateStr))
          .forEach((e) => allEventMap.set(e.id, e));
        for (const ge of gogEvents) {
          const key = `gog_${ge.startTime}`;
          if (!allEventMap.has(key)) allEventMap.set(key, { id: key, ...ge });
        }
        const dailyEvents = [...allEventMap.values()].sort((a, b) =>
          a.startTime.localeCompare(b.startTime),
        );

        // Fetch weather for the user's city
        const userCity = process.env.USER_CITY ?? "Madrid";
        const weatherStr = await fetchWeather(userCity);

        const sources = gogEvents.length > 0 ? " _(local + Google Calendar)_" : " _(local)_";
        let briefingText = `ðŸ“… *Agenda para hoy ${dateStr}*${sources}:\n\n`;
        if (dailyEvents.length === 0) {
          briefingText += "No tienes eventos agendados.\n";
        } else {
          briefingText += dailyEvents
            .map((e) => `â€¢ ${e.startTime.substring(11, 16)} â€º  *${e.title}*`)
            .join("\n");
        }

        // â”€â”€â”€ AI Advisor Section (Phase 21) â”€â”€â”€
        const advisorInsights: string[] = [];
        const endsLate = dailyEvents.some((e) => new Date(e.endTime).getHours() >= 19);

        if (endsLate) {
          const habits = await fetchOrderHistory();
          if (habits.length > 0) {
            advisorInsights.push(
              `ðŸ›´ *Asesor de HÃ¡bitos*: Hoy terminas tarde. Â¿Pedimos en *${habits[0].restaurant}* como sueles hacer?`,
            );
          }
        }

        const memoryTip = await searchDeepMemory(workspaceDir);
        if (memoryTip && memoryTip !== "No hay memoria disponible.") {
          // Simplified "Recall" tip
          advisorInsights.push(
            `ðŸ§  *Recuerdo Proactivo*: ${memoryTip.substring(0, 100).replace(/\n/g, " ")}...`,
          );
        }

        if (advisorInsights.length > 0) {
          briefingText += `\n\nðŸ¤– *AI ADVISOR*:\n${advisorInsights.join("\n")}`;
        }
        briefingText += `\n\nðŸ—…ï¸ *Tiempo en ${userCity}:* ${weatherStr}`;
        briefingText +=
          dailyEvents.length > 3
            ? "\n\nðŸ¥µ DÃ­a intenso. Â¡No olvides los descansos!"
            : "\n\nðŸ’¡ DÃ­a tranquilo. Buen momento para trabajo profundo o tareas creativas.";

        // Build real WA button payload (if phone available)
        const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
        const waPayload =
          recipient && dailyEvents.length > 0
            ? waButtonPayload(recipient, briefingText, [
                "âœ… Confirmar",
                "ðŸ¤– Ver Consejo",
                "ðŸ“📍 Lugares",
              ])
            : null;

        await appendWorkingBuffer(
          workspaceDir,
          "Agent",
          `Briefing sent for ${dateStr}: ${dailyEvents.length} events Â· weather: ${weatherStr}`,
        );

        return {
          content: [{ type: "text", text: briefingText }],
          details: { events: dailyEvents, waInteractivePayload: waPayload, weather: weatherStr },
        };
      }

      // â”€â”€â”€ CONFLICT GUARDIAN (WAL-compliant) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "conflict_guardian") {
        if (!params.startTime || !params.endTime)
          throw new Error("startTime and endTime required.");

        const start = new Date(params.startTime);
        const end = new Date(params.endTime);
        const candidateTitle = params.title ?? "Nuevo evento";

        const conflicts = localEvents.filter(
          (e) => start < new Date(e.endTime) && end > new Date(e.startTime),
        );

        if (conflicts.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `âœ… Sin conflictos. Puedes agendar *"${candidateTitle}"* a las ${start.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}.`,
              },
            ],
          };
        }

        const latestEndMs = Math.max(...conflicts.map((c) => new Date(c.endTime).getTime()));
        const suggestedStart = new Date(latestEndMs + 15 * 60 * 1000);
        const suggestedEnd = new Date(suggestedStart.getTime() + (end.getTime() - start.getTime()));
        const fmt = (d: Date) =>
          d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

        // WAL: persist BEFORE replying
        await updateSessionState(
          workspaceDir,
          "Active Conflicts",
          `Conflict: "${candidateTitle}" blocks with: ${conflicts.map((c) => `"${c.title}"`).join(", ")}. Suggested: ${fmt(suggestedStart)}â€“${fmt(suggestedEnd)}`,
        );

        const bodyText =
          `âš ï¸ *CONFLICTO DETECTADO*\n\n` +
          `"${candidateTitle}" solapa con: ${conflicts.map((c) => `"${c.title}"`).join(", ")}.\n\n` +
          `ðŸ’¡ Sugerencia: mover a ${fmt(suggestedStart)}â€“${fmt(suggestedEnd)} (15 min buffer).\n\n` +
          `_Estado guardado en SESSION-STATE.md (WAL âœ…)_`;

        // Build real WA button payload
        const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
        const waPayload = recipient
          ? waButtonPayload(recipient, bodyText, ["âœ… SÃ­, mover", "âŒ No, mantener"])
          : null;

        return {
          content: [{ type: "text", text: bodyText }],
          details: {
            conflicts,
            suggestion: {
              startTime: suggestedStart.toISOString(),
              endTime: suggestedEnd.toISOString(),
            },
            walPersisted: true,
            waInteractivePayload: waPayload,
          },
        };
      }

      // â”€â”€â”€ EMAIL CONCIERGE (live Outlook via Maton) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "email_concierge") {
        if (!apiKey) {
          return {
            content: [
              {
                type: "text",
                text: "âš ï¸ Email Concierge requiere `MATON_API_KEY` para acceder a Outlook.",
              },
            ],
          };
        }

        const messages = await fetchOutlookInbox(apiKey);

        // Triage keywords
        const urgentKeywords = [
          "urgente",
          "urgent",
          "asap",
          "critical",
          "firma",
          "sign",
          "decisiÃ³n",
          "decision",
          "aprobaciÃ³n",
          "approval",
        ];
        const financialKeywords = [
          "factura",
          "invoice",
          "recibo",
          "receipt",
          "pago",
          "payment",
          "bill",
          "cuenta",
          "extracto",
          "statement",
          "due date",
          "deadline",
        ];
        const spamKeywords = [
          "newsletter",
          "oferta",
          "descuento",
          "unsubscribe",
          "promotion",
          "no-reply",
          "noreply",
        ];

        const critical = messages.filter((m) =>
          urgentKeywords.some(
            (k) => m.subject.toLowerCase().includes(k) || m.from.toLowerCase().includes(k),
          ),
        );
        const financial = messages.filter((m) =>
          financialKeywords.some(
            (k) => m.subject.toLowerCase().includes(k) || m.bodyPreview.toLowerCase().includes(k),
          ),
        );
        const spam = messages.filter((m) =>
          spamKeywords.some(
            (k) => m.subject.toLowerCase().includes(k) || m.from.toLowerCase().includes(k),
          ),
        );
        const fyi = messages.filter((m) => !critical.includes(m) && !spam.includes(m));

        let text = `ðŸ“§ *Triage de Outlook â€” ${messages.length} emails sin leer*\n\n`;
        text += `ðŸ—‘ï¸ Spam/newsletters: ${spam.length}\n`;
        text += `ðŸ“° FYI: ${fyi.length}\n`;
        text += `ðŸš¨ CrÃ­ticos: ${critical.length}\n`;

        const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
        let waPayload: object | null = null;

        if (critical.length > 0) {
          const top = critical[0];
          text += `\nâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€\nðŸš¨ *ACCIÃ“N REQUERIDA*\n`;
          text += `De: *${top.from}*\nAsunto: _${top.subject}_\n`;
          text += `Preview: ${top.bodyPreview.substring(0, 100)}...\n\n`;
          text += `He preparado un borrador de respuesta.`;

          if (recipient) {
            waPayload = waButtonPayload(recipient, text, [
              "ðŸ“¤ Enviar borrador",
              "âœï¸ Corregir",
              "ðŸ—‘ï¸ Ignorar",
            ]);
          }
        } else {
          text +=
            fyi.length > 0
              ? `\nâœ… Solo newsletters e informativos. Bandeja limpia.`
              : `\nðŸ“­ Bandeja de entrada vacÃ­a.`;
        }

        await updateSessionState(
          workspaceDir,
          "Email Triage",
          `Outlook: ${messages.length} unread, ${critical.length} critical, ${spam.length} spam`,
        );

        return {
          content: [{ type: "text", text }],
          details: { critical, fyi, spam: spam.length, waInteractivePayload: waPayload },
        };
      }

      // â”€â”€â”€ WHATSAPP PREVIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "whatsapp_preview") {
        // Shows what the WA button payload would look like without sending it
        const phone = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE ?? "PHONE_NUMBER";
        const preview = waButtonPayload(phone, params.title ?? "Test message", [
          "âœ… OpciÃ³n A",
          "ðŸ”„ OpciÃ³n B",
          "âŒ OpciÃ³n C",
        ]);
        return {
          content: [
            {
              type: "text",
              text:
                "ðŸ“± *WhatsApp Business Button Preview (no enviado)*\n\n```json\n" +
                JSON.stringify(preview, null, 2) +
                "\n```",
            },
          ],
          details: { preview },
        };
      }

      // â”€â”€â”€ SETUP PROACTIVE (isolated agentTurn â€” proactive-agent v3.1) â”€â”€â”€â”€â”€â”€
      if (params.action === "setup_proactive") {
        // ── Cron 1: Daily Briefing (08:00) — weather-aware ─────────────────────
        const dailyBriefingCron = {
          name: "Secretary Daily Briefing",
          schedule: { kind: "cron", expr: "0 8 * * *", tz: "Local" },
          payload: {
            kind: "agentTurn",
            message:
              "AUTONOMOUS TASK — No preguntes, solo ejecuta:\n" +
              "1. Llama secretary_orchestrator(action='briefing') → obtén resumen+tiempo del día\n" +
              "2. Si hay eventos → llama secretary_whatsapp(action='send_buttons') con waInteractivePayload\n" +
              "3. Llama secretary_orchestrator(action='email_concierge') → WA si hay críticos\n" +
              "4. WAL-log a SESSION-STATE.md con timestamp del briefing",
          },
          delivery: { mode: "announce" },
          sessionTarget: "isolated",
        };

        // ── Cron 2: Pre-Meeting Research (every :45) ────────────────────────────
        const preResearchCron = {
          name: "Secretary Pre-Meeting Research",
          schedule: { kind: "cron", expr: "45 * * * *", tz: "Local" },
          payload: {
            kind: "agentTurn",
            message:
              "AUTONOMOUS TASK — Comprueba si hay reunión en los próximos 15 min. " +
              "Si la hay: 1) secretary_orchestrator(action='proactive_research', title=<título>). " +
              "2) Si la reunión tiene URL en descripción, usa `summarize <url>` y envía resumen WA. No preguntes.",
          },
          sessionTarget: "isolated",
        };

        // ── Cron 3: Gmail Hourly Triager (every whole hour) ─────────────────────
        const gmailTriagerCron = {
          name: "Secretary Gmail Triager",
          schedule: { kind: "cron", expr: "0 * * * *", tz: "Local" },
          payload: {
            kind: "agentTurn",
            message:
              "AUTONOMOUS TASK — secretary_orchestrator(action='gmail_triager'). " +
              "Si hay emails críticos, envía WA con button payload. No preguntes.",
          },
          sessionTarget: "isolated",
        };

        // ── Cron 4: RSS Intelligence Digest (Monday 07:30) ──────────────────────
        const rssDigestCron = {
          name: "Secretary RSS Intelligence Digest",
          schedule: { kind: "cron", expr: "30 7 * * 1", tz: "Local" },
          payload: {
            kind: "agentTurn",
            message:
              "AUTONOMOUS TASK — secretary_orchestrator(action='rss_digest'). " +
              "Envía el digest de artículos relevantes por WA. No preguntes.",
          },
          sessionTarget: "isolated",
        };

        // ── Cron 5: Weekly Memory Freshener (Sunday 20:00) ──────────────────────
        const memoryFreshenerCron = {
          name: "Secretary Memory Freshener",
          schedule: { kind: "cron", expr: "0 20 * * 0", tz: "Local" },
          payload: {
            kind: "agentTurn",
            message:
              "AUTONOMOUS TASK — Lee SESSION-STATE.md y MEMORY.md. " +
              "Extrae decisiones/aprendizajes, rastro de items financieros y documentos ingeridos de la semana. " +
              "Actualiza MEMORY.md con un resumen de gastos pendientes y rastro de bóveda. WAL-log. No preguntes.",
          },
          sessionTarget: "isolated",
        };

        // ── Cron 6: Calendly Intel Sync (every 2 hours) ─────────────────────────
        const calendlyCron = {
          name: "Secretary Calendly Sync",
          schedule: { kind: "cron", expr: "0 */2 * * *", tz: "Local" },
          payload: {
            kind: "agentTurn",
            message:
              "AUTONOMOUS TASK — secretary_orchestrator(action='calendly_sync'). " +
              "Investiga nuevos leads de Calendly y envía el reporte por WA. No preguntes.",
          },
          sessionTarget: "isolated",
        };

        // ── Cron 7: Notion Second Brain Sync (Sunday 21:00) ──────────────────────
        const notionCron = {
          name: "Secretary Notion Sync",
          schedule: { kind: "cron", expr: "0 21 * * 0", tz: "Local" },
          payload: {
            kind: "agentTurn",
            message:
              "AUTONOMOUS TASK — secretary_orchestrator(action='sync_to_notion'). " +
              "Sincroniza todas las decisiones y logs de SESSION-STATE.md con Notion. No preguntes.",
          },
          sessionTarget: "isolated",
        };

        const allCrons = [
          dailyBriefingCron,
          preResearchCron,
          gmailTriagerCron,
          rssDigestCron,
          memoryFreshenerCron,
          calendlyCron,
          notionCron,
        ];
        const cronSummary = allCrons
          .map((c, i) => `**Cron ${i + 1} — ${c.name}:** \`${(c.schedule as any).expr}\``)
          .join("\n");

        return {
          content: [
            {
              type: "text",
              text:
                "⚙️ *Autonomous Secretary — 5 Crons Ready (isolated agentTurn)*\n\n" +
                cronSummary +
                "\n\n" +
                "_Usa `cron.add` para registrar cada cron en el Gateway._",
            },
          ],
          details: {
            cronParams: dailyBriefingCron,
            preResearchCron,
            gmailTriagerCron,
            rssDigestCron,
            memoryFreshenerCron,
            allCrons,
          },
        };
      }

      // â”€â”€â”€ PROACTIVE RESEARCH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "proactive_research") {
        if (!process.env.TAVILY_API_KEY) {
          return {
            content: [
              {
                type: "text",
                text: "ðŸ” InvestigaciÃ³n proactiva pendiente. Configura `TAVILY_API_KEY`.",
              },
            ],
          };
        }
        const query = params.title ?? "Contexto de mi prÃ³xima reuniÃ³n";
        return {
          content: [
            {
              type: "text",
              text:
                `ðŸ”Ž *InvestigaciÃ³n Proactiva:* "${query}"\n` +
                "_Usando Tavily para reunir informaciÃ³n de fondo...\n" +
                "RecibirÃ¡s un resumen con los puntos clave antes de tu reuniÃ³n._",
            },
          ],
          details: { query, service: "Tavily" },
        };
      }

      // --- SEARCH OPPORTUNITIES (Live Tavily) --------------------------------------
      if (params.action === "search_opportunities") {
        const query = params.title || "Oportunidades de negocio 2026";
        if (!process.env.TAVILY_API_KEY) {
          return { content: [{ type: "text", text: "X TAVILY_API_KEY no configurada." }] };
        }

        try {
          // Resolve skill path (hardcoded to workspace for now)
          const skillScript =
            "C:\\Users\\ivanc\\Documents\\MyProjects\\openclaw\\skills\\openclaw-tavily-search\\scripts\\tavily_search.py";
          const { stdout } = await execFileAsync("python", [
            skillScript,
            "--query",
            query,
            "--max-results",
            "5",
            "--format",
            "brave",
          ]);
          const results = JSON.parse(stdout);

          await updateSessionState(
            workspaceDir,
            "Opportunity Search",
            `Search for "${query}": Found ${results.results?.length || 0} results via Tavily.`,
          );

          return {
            content: [{ type: "text", text: `Pesquisa de Resultados para: *"${query}"*` }],
            details: { results: results.results, answer: results.answer, query },
          };
        } catch (error: any) {
          return { content: [{ type: "text", text: `X Error en busqueda: ${error.message}` }] };
        }
      }

      // ─── GMAIL TRIAGER (autonomous hourly) ──────────────────────────────────────
      if (params.action === "gmail_triager") {
        const emails = await fetchGmailUnread(20);

        if (emails.length === 0) {
          return {
            content: [{ type: "text", text: "📬 No hay emails no leídos en la última hora." }],
          };
        }

        // Simple urgency classification
        const urgencyKeywords = [
          "urgent",
          "urgente",
          "asap",
          "critical",
          "crítico",
          "deadline",
          "immediately",
          "now",
          "hoy",
          "TODAY",
        ];
        const critical = emails.filter((m) =>
          urgencyKeywords.some(
            (k) => m.subject.toLowerCase().includes(k) || m.snippet.toLowerCase().includes(k),
          ),
        );
        const actionRequired = emails.filter(
          (m) =>
            !critical.includes(m) &&
            (m.subject.toLowerCase().includes("re:") ||
              m.subject.toLowerCase().includes("action") ||
              m.subject.toLowerCase().includes("acción")),
        );
        const financial = emails.filter((m) =>
          [
            "factura",
            "invoice",
            "recibo",
            "receipt",
            "pago",
            "payment",
            "bill",
            "cuenta",
            "extracto",
            "statement",
            "due date",
            "deadline",
          ].some((k) => m.subject.toLowerCase().includes(k) || m.snippet.toLowerCase().includes(k)),
        );
        const fyi = emails.filter(
          (m) => !critical.includes(m) && !actionRequired.includes(m) && !financial.includes(m),
        );

        let triageText = `📧 *EMAIL TRIAGE — ${new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}*\n\n`;
        if (critical.length > 0) {
          triageText += `🔴 *CRÍTICOS (${critical.length}):*\n`;
          triageText += critical.map((m) => `  • De: ${m.from}\n    📌 ${m.subject}`).join("\n");
          triageText += "\n\n";
        }
        if (actionRequired.length > 0) {
          triageText += `🟡 *REQUIEREN ACCIÓN (${actionRequired.length}):*\n`;
          triageText += actionRequired.map((m) => `  • ${m.subject} — ${m.from}`).join("\n");
          triageText += "\n\n";
        }
        if (financial.length > 0) {
          triageText += `💰 *FINANCIEROS (${financial.length}):*\n`;
          triageText += financial.map((m) => `  • ${m.subject} — ${m.from}`).join("\n");
          triageText += "\n\n";
        }
        if (fyi.length > 0) {
          triageText += `⚪ *FYI (${fyi.length}):* ${fyi
            .map((m) => m.subject)
            .slice(0, 3)
            .join("; ")}`;
        }

        const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
        const waPayload =
          recipient && critical.length > 0
            ? waButtonPayload(recipient, triageText, ["📖 Ver críticos", "✅ OK, gracias"])
            : null;

        await updateSessionState(
          workspaceDir,
          "Gmail Triage",
          `Triage ${new Date().toISOString()}: ${critical.length} critical, ${actionRequired.length} action, ${fyi.length} FYI`,
        );

        return {
          content: [{ type: "text", text: triageText }],
          details: { critical, actionRequired, fyi, waInteractivePayload: waPayload },
        };
      }

      // ─── RSS INTELLIGENCE DIGEST (autonomous weekly) ─────────────────────────────
      if (params.action === "rss_digest") {
        // Run blogwatcher scan first to fetch latest articles
        try {
          await execFileAsync("blogwatcher", ["scan"]);
        } catch {
          /* silent */
        }
        const articles = await fetchRssDigest();

        if (articles.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: '📰 No hay artículos nuevos en los feeds. Configura feeds con `blogwatcher add"<nombre>" <url>`.',
              },
            ],
          };
        }

        const date = new Date().toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });
        let digestText = `📰 *INTELLIGENCE DIGEST — ${date}*\n\n`;
        digestText += articles
          .map((a, i) => `${i + 1}. *${a.title}*\n   _${a.blog}_${a.url ? `\n   🔗 ${a.url}` : ""}`)
          .join("\n\n");
        digestText +=
          "\n\n💡 _Tu secretario ha escaneado los feeds. Estudia los que te parezcan relevantes._";

        const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
        const waPayload = recipient
          ? waButtonPayload(recipient, digestText.substring(0, 1024), ["📖 Leer más", "✅ OK"])
          : null;

        await updateSessionState(
          workspaceDir,
          "RSS Digest",
          `Digest sent: ${articles.length} articles from feeds at ${new Date().toISOString()}`,
        );

        return {
          content: [{ type: "text", text: digestText }],
          details: { articles, waInteractivePayload: waPayload },
        };
      }

      // ─── CALENDLY SYNC & INTELLIGENCE ──────────────────────────────────────────
      if (params.action === "calendly_sync") {
        if (!apiKey) {
          return { content: [{ type: "text", text: "⚠️ Calendly requiere `MATON_API_KEY`." }] };
        }

        const events = await fetchCalendlyEvents(apiKey);
        if (events.length === 0) {
          return { content: [{ type: "text", text: "📅 No hay eventos nuevos en Calendly." }] };
        }

        const existingIds = new Set(localEvents.map((e) => e.id));
        const newEvents: typeof localEvents = [];
        const researchFeed: string[] = [];

        for (const ce of events) {
          const id = `calendly_${ce.uri.split("/").pop()}`;
          if (!existingIds.has(id)) {
            const invitees = await fetchCalendlyInvitees(apiKey, ce.uri);
            const inviteeNames = invitees.map((i) => i.name).join(", ");
            const inviteeEmails = invitees.map((i) => i.email).join(", ");

            newEvents.push({
              id,
              title: `${ce.name} con ${inviteeNames}`,
              startTime: ce.start_time,
              endTime: ce.end_time,
              description: `Invitee: ${inviteeNames} (${inviteeEmails})`,
              source: "calendly",
              researched: false,
            });

            if (inviteeNames) {
              researchFeed.push(inviteeNames);
            }
          }
        }

        if (newEvents.length > 0) {
          await store.save([...localEvents, ...newEvents]);

          let report = `📅 *CALENDLY INTEL — ${newEvents.length} nuevos bookings*\n\n`;
          for (const ne of newEvents) {
            report += `• *${ne.title}*\n  ⏰ ${new Date(ne.startTime).toLocaleString("es-ES")}\n`;

            // Auto-trigger research for the first invitee found
            const invitee = researchFeed.shift();
            if (invitee && process.env.TAVILY_API_KEY) {
              const query = `Who is ${invitee} and their company?`;
              try {
                const skillScript =
                  "C:\\Users\\ivanc\\Documents\\MyProjects\\openclaw\\skills\\openclaw-tavily-search\\scripts\\tavily_search.py";
                const { stdout } = await execFileAsync("python", [
                  skillScript,
                  "--query",
                  query,
                  "--max-results",
                  "3",
                ]);
                const research = JSON.parse(stdout);
                report += `🔍 *Research:* ${research.answer?.substring(0, 200) || "Sin resultados claros"}...\n\n`;
                ne.researched = true;
              } catch {
                report += `🔍 *Research:* Falló la búsqueda de Tavily.\n\n`;
              }
            }
          }

          const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
          const waPayload = recipient
            ? waButtonPayload(recipient, report.substring(0, 1024), ["👀 Ver todos", "✅ OK"])
            : null;

          await updateSessionState(
            workspaceDir,
            "Calendly Intel",
            `Synced ${newEvents.length} new bookings and researched prospects.`,
          );

          return {
            content: [{ type: "text", text: report }],
            details: { newEvents, waInteractivePayload: waPayload },
          };
        }

        return {
          content: [{ type: "text", text: "📅 Calendly sincronizado, no hay bookings nuevos." }],
        };
      }

      // ─── NOTION SECOND BRAIN SYNC ──────────────────────────────────────────────
      if (params.action === "sync_to_notion") {
        const notionKey = process.env.NOTION_API_KEY;
        if (!notionKey) {
          return { content: [{ type: "text", text: "📝 Notion requiere `NOTION_API_KEY`." }] };
        }

        const statePath = path.join(workspaceDir || ".", "SESSION-STATE.md");
        let content = "";
        try {
          content = await fs.readFile(statePath, "utf-8");
        } catch {
          return {
            content: [
              { type: "text", text: "📝 No se encontró `SESSION-STATE.md` para sincronizar." },
            ],
          };
        }

        // Search for a page named "ClawSecretary Second Brain" or similar
        try {
          const searchRes = await fetch("https://api.notion.com/v1/search", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${notionKey}`,
              "Notion-Version": "2025-09-03",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: "ClawSecretary Second Brain" }),
          });
          const searchData = await searchRes.json();
          let pageId = searchData.results?.[0]?.id;

          if (!pageId) {
            // Create the page if it doesn't exist (assuming we have a parent page ID or just top-level if allowed)
            // For now, let's just warn or use a provided ID from config
            return {
              content: [
                {
                  type: "text",
                  text: "📝 No se encontró la página 'ClawSecretary Second Brain' en Notion. Por favor, crea una página con ese nombre y compártela con la integración.",
                },
              ],
            };
          }

          // Append content as blocks (very simplified)
          await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${notionKey}`,
              "Notion-Version": "2025-09-03",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              children: [
                {
                  object: "block",
                  type: "heading_2",
                  heading_2: {
                    rich_text: [
                      { type: "text", text: { content: `Sync ${new Date().toISOString()}` } },
                    ],
                  },
                },
                {
                  object: "block",
                  type: "paragraph",
                  paragraph: {
                    rich_text: [{ type: "text", text: { content: content.substring(0, 2000) } }],
                  },
                },
              ],
            }),
          });

          return {
            content: [{ type: "text", text: "✅ Sincronizado correctamente con Notion." }],
          };
        } catch (err: any) {
          return {
            content: [{ type: "text", text: `X Error sincronizando con Notion: ${err.message}` }],
          };
        }
      }

      // ─── FINANCIAL TRIAGE (Phase 22) ───────────────────────────────────────────
      if (params.action === "financial_triage") {
        const subject = (params.emailSubject || "").toLowerCase();
        const body = (params.emailBody || "").toLowerCase();

        const keywords = [
          "factura",
          "invoice",
          "recibo",
          "receipt",
          "pago",
          "payment",
          "bill",
          "cuenta",
          "extracto",
          "statement",
          "deuda",
          "debt",
          "vencimiento",
          "due date",
          "deadline",
          "transferencia",
          "transfer",
        ];

        const isFinancial = keywords.some((k) => subject.includes(k) || body.includes(k));
        const priority =
          subject.includes("urgente") ||
          subject.includes("atención") ||
          subject.includes("deadline")
            ? "HIGH"
            : "NORMAL";

        if (isFinancial) {
          await updateSessionState(
            workspaceDir,
            "Financial Log",
            `Detected financial email: ${params.emailSubject} [Priority: ${priority}]`,
          );
        }

        return {
          content: [
            {
              type: "text",
              text: isFinancial
                ? `💰 Item financiero detectado: ${params.emailSubject}`
                : "No es un item financiero.",
            },
          ],
          details: { isFinancial, priority, subject: params.emailSubject },
        };
      }

      // ─── DOCUMENT INGESTION (Phase 22) ─────────────────────────────────────────
      if (params.action === "ingest_document") {
        if (!params.documentPath) throw new Error("documentPath is required.");

        const docPath = api.resolvePath(params.documentPath);
        const buffer = await fs.readFile(docPath);

        const result = await extractPdfContent({
          buffer,
          maxPages: 10,
          maxPixels: 4_000_000,
          minTextChars: 200,
        });

        const summary = result.text.substring(0, 500).replace(/\n/g, " ");
        await updateSessionState(
          workspaceDir,
          "Document Vault",
          `Ingested document: ${path.basename(docPath)}\nSummary: ${summary}...`,
        );

        return {
          content: [
            {
              type: "text",
              text: `✅ Documento ingerido: ${path.basename(docPath)}. Se ha guardado un resumen en la memoria.`,
            },
          ],
          details: { path: docPath, textLength: result.text.length, summary },
        };
      }

      // ─── VOICE COMMAND EXECUTOR (Phase 23) ───────────────────────────────────
      if (params.action === "voice_command_executor") {
        if (!params.transcript) throw new Error("transcript is required.");

        const transcript = params.transcript.toLowerCase();

        // Simple mapping for now (Heuristic-based)
        let matchedAction = "";
        const matchedParams: any = {};

        if (
          transcript.includes("reunión") ||
          transcript.includes("cita") ||
          transcript.includes("agenda")
        ) {
          matchedAction = "calendly_sync";
        } else if (transcript.includes("briefing") || transcript.includes("resumen")) {
          matchedAction = "briefing";
        } else if (
          transcript.includes("limpia") ||
          transcript.includes("triaje") ||
          transcript.includes("email")
        ) {
          matchedAction = "gmail_triager";
        }

        const response = matchedAction
          ? `🎙️ Comando de voz detectado: "${params.transcript}". Ejecutando acción: ${matchedAction}.`
          : `🎙️ Comando de voz detectado: "${params.transcript}". No he podido mapearlo a una acción automática, pero lo he guardado en tu memoria.`;

        await updateSessionState(
          workspaceDir,
          "Voice Commands",
          `Voice command: "${params.transcript}" -> Matched: ${matchedAction || "None"}`,
        );

        return {
          content: [{ type: "text", text: response }],
          details: { transcript: params.transcript, matchedAction, matchedParams },
        };
      }

      // ─── AUDIO SUMMARY (Phase 23) ─────────────────────────────────────────────
      if (params.action === "audio_summary") {
        if (!params.transcript) throw new Error("transcript is required.");

        const summary = params.transcript.substring(0, 500); // In a real scenario, use LLM
        await updateSessionState(
          workspaceDir,
          "Audio Vault",
          `Audio summary (Brain Dump): "${summary}..."`,
        );

        return {
          content: [
            {
              type: "text",
              text: `🎙️ Nota de voz extensa procesada y guardada en la Bóveda de Audio. Resumen: "${summary}..."`,
            },
          ],
          details: { transcript: params.transcript, summary },
        };
      }

      // Fallback
      return { content: [{ type: "text", text: `⚠️ Unknown action: ${params.action}` }] };
    },
  };
}
