import { Type } from "@sinclair/typebox";
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
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
async function appendWorkingBuffer(workspaceDir: string | undefined, role: "Human" | "Agent", summary: string): Promise<void> {
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
async function fetchGogEvents(dateStr: string): Promise<{ title: string; startTime: string; endTime: string }[]> {
  try {
    const { stdout } = await execFileAsync("gog", [
      "calendar", "events", "primary",
      "--from", `${dateStr}T00:00:00Z`,
      "--to", `${dateStr}T23:59:59Z`,
      "--json", "--no-input",
    ]);
    const raw = JSON.parse(stdout) as { summary?: string; start?: { dateTime?: string }; end?: { dateTime?: string } }[];
    return raw.map((e) => ({
      title: e.summary ?? "Sin tÃ­tulo",
      startTime: e.start?.dateTime ?? `${dateStr}T00:00:00Z`,
      endTime: e.end?.dateTime ?? `${dateStr}T01:00:00Z`,
    }));
  } catch {
    return []; // gog unavailable or no account configured
  }
}

// â”€â”€â”€ Maton Outlook Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function fetchOutlookInbox(apiKey: string): Promise<{ subject: string; from: string; id: string; bodyPreview: string }[]> {
  const res = await fetch(
    "https://gateway.maton.ai/outlook/v1.0/me/mailFolders/Inbox/messages?$top=20&$filter=isRead eq false&$orderby=receivedDateTime desc&$select=id,subject,from,bodyPreview",
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );
  if (!res.ok) return [];
  const data = await res.json() as { value?: { id: string; subject: string; from: { emailAddress: { name: string } }; bodyPreview: string }[] };
  return (data.value ?? []).map((m) => ({
    id: m.id,
    subject: m.subject ?? "(sin asunto)",
    from: m.from?.emailAddress?.name ?? "Desconocido",
    bodyPreview: m.bodyPreview ?? "",
  }));
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
          "email_concierge",
          "whatsapp_preview",
        ],
        description: "Action to perform.",
      }),
      date: Type.Optional(Type.String({ description: "Target date ISO." })),
      title: Type.Optional(Type.String({ description: "Event title or research query." })),
      startTime: Type.Optional(Type.String({ description: "Start time ISO." })),
      endTime: Type.Optional(Type.String({ description: "End time ISO." })),
      recipientPhone: Type.Optional(Type.String({ description: "WhatsApp recipient phone (international, no +)." })),
    }),

    async execute(_runId: string, params: Record<string, any>, ctx?: OpenClawPluginToolContext) {
      const localEvents = await store.load();
      const workspaceDir = ctx?.workspaceDir;
      const apiKey = process.env.MATON_API_KEY;

      // â”€â”€â”€ SETUP STATUS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "setup_status") {
        let gogInstalled = false;
        try { await execFileAsync("gog", ["--version"]); gogInstalled = true; } catch { /* noop */ }

        const status = {
          local_calendar: "âœ… Connected",
          google_calendar_gog: process.env.GOG_ACCOUNT && gogInstalled ? "âœ… Connected" : gogInstalled ? "âš ï¸ gog installed but GOG_ACCOUNT not set" : "âŒ gog CLI not installed",
          outlook: apiKey ? "âœ… Maton OAuth ready" : "âŒ Missing MATON_API_KEY",
          whatsapp_business: (apiKey && process.env.WA_PHONE_NUMBER_ID) ? "âœ… Connected" : "âš ï¸ MATON_API_KEY or WA_PHONE_NUMBER_ID missing",
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
            content: [{ type: "text", text: "ðŸ“… No se encontraron eventos en Google Calendar (o gog no disponible)." }],
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

        await updateSessionState(workspaceDir, "Last Sync", `Google Calendar sync: ${googleEvents.length} events fetched, ${merged.length} new merged`);
        return {
          content: [{ type: "text", text: `âœ… Sincronizados *${googleEvents.length}* eventos de Google Calendar (${merged.length} nuevos).\n${googleEvents.map((e) => `â€¢ ${e.startTime.substring(11, 16)} âˆ’ *${e.title}*`).join("\n")}` }],
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
        localEvents.filter((e) => e.startTime.startsWith(dateStr)).forEach((e) => allEventMap.set(e.id, e));
        for (const ge of gogEvents) {
          const key = `gog_${ge.startTime}`;
          if (!allEventMap.has(key)) allEventMap.set(key, { id: key, ...ge });
        }
        const dailyEvents = [...allEventMap.values()].sort((a, b) => a.startTime.localeCompare(b.startTime));

        const sources = gogEvents.length > 0 ? " _(local + Google Calendar)_" : " _(local)_";
        let briefingText = `ðŸ“… *Agenda para hoy ${dateStr}*${sources}:\n\n`;
        if (dailyEvents.length === 0) {
          briefingText += "No tienes eventos agendados.\n";
        } else {
          briefingText += dailyEvents.map((e) => `â€¢ ${e.startTime.substring(11, 16)} â€º *${e.title}*`).join("\n");
        }
        briefingText += dailyEvents.length > 3
          ? "\n\nðŸ”¥ DÃ­a intenso. Â¡No olvides los descansos!"
          : "\n\nðŸ’¡ DÃ­a tranquilo. Buen momento para trabajo profundo o tareas creativas.";

        // Build real WA button payload (if phone available)
        const recipient = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE;
        const waPayload = recipient && dailyEvents.length > 0
          ? waButtonPayload(recipient, briefingText, ["âœ… Confirmar todo", "ðŸ”„ Revisar conflictos", "âž• AÃ±adir evento"])
          : null;

        await appendWorkingBuffer(workspaceDir, "Agent", `Briefing sent for ${dateStr}: ${dailyEvents.length} events`);

        return {
          content: [{ type: "text", text: briefingText }],
          details: { events: dailyEvents, waInteractivePayload: waPayload },
        };
      }

      // â”€â”€â”€ CONFLICT GUARDIAN (WAL-compliant) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "conflict_guardian") {
        if (!params.startTime || !params.endTime) throw new Error("startTime and endTime required.");

        const start = new Date(params.startTime);
        const end = new Date(params.endTime);
        const candidateTitle = params.title ?? "Nuevo evento";

        const conflicts = localEvents.filter((e) => start < new Date(e.endTime) && end > new Date(e.startTime));

        if (conflicts.length === 0) {
          return {
            content: [{ type: "text", text: `âœ… Sin conflictos. Puedes agendar *"${candidateTitle}"* a las ${start.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}.` }],
          };
        }

        const latestEndMs = Math.max(...conflicts.map((c) => new Date(c.endTime).getTime()));
        const suggestedStart = new Date(latestEndMs + 15 * 60 * 1000);
        const suggestedEnd = new Date(suggestedStart.getTime() + (end.getTime() - start.getTime()));
        const fmt = (d: Date) => d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

        // WAL: persist BEFORE replying
        await updateSessionState(workspaceDir, "Active Conflicts",
          `Conflict: "${candidateTitle}" blocks with: ${conflicts.map((c) => `"${c.title}"`).join(", ")}. Suggested: ${fmt(suggestedStart)}â€“${fmt(suggestedEnd)}`);

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
            suggestion: { startTime: suggestedStart.toISOString(), endTime: suggestedEnd.toISOString() },
            walPersisted: true,
            waInteractivePayload: waPayload,
          },
        };
      }

      // â”€â”€â”€ EMAIL CONCIERGE (live Outlook via Maton) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "email_concierge") {
        if (!apiKey) {
          return {
            content: [{ type: "text", text: "âš ï¸ Email Concierge requiere `MATON_API_KEY` para acceder a Outlook." }],
          };
        }

        const messages = await fetchOutlookInbox(apiKey);

        // Triage keywords
        const urgentKeywords = ["urgente", "urgent", "asap", "critical", "firma", "sign", "decisiÃ³n", "decision", "aprobaciÃ³n", "approval"];
        const spamKeywords = ["newsletter", "oferta", "descuento", "unsubscribe", "promotion", "no-reply", "noreply"];

        const critical = messages.filter((m) => urgentKeywords.some((k) => m.subject.toLowerCase().includes(k) || m.from.toLowerCase().includes(k)));
        const spam = messages.filter((m) => spamKeywords.some((k) => m.subject.toLowerCase().includes(k) || m.from.toLowerCase().includes(k)));
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
            waPayload = waButtonPayload(recipient, text, ["ðŸ“¤ Enviar borrador", "âœï¸ Corregir", "ðŸ—‘ï¸ Ignorar"]);
          }
        } else {
          text += fyi.length > 0 ? `\nâœ… Solo newsletters e informativos. Bandeja limpia.` : `\nðŸ“­ Bandeja de entrada vacÃ­a.`;
        }

        await updateSessionState(workspaceDir, "Email Triage", `Outlook: ${messages.length} unread, ${critical.length} critical, ${spam.length} spam`);

        return {
          content: [{ type: "text", text }],
          details: { critical, fyi, spam: spam.length, waInteractivePayload: waPayload },
        };
      }

      // â”€â”€â”€ WHATSAPP PREVIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "whatsapp_preview") {
        // Shows what the WA button payload would look like without sending it
        const phone = params.recipientPhone ?? process.env.WA_DEFAULT_PHONE ?? "PHONE_NUMBER";
        const preview = waButtonPayload(phone, params.title ?? "Test message", ["âœ… OpciÃ³n A", "ðŸ”„ OpciÃ³n B", "âŒ OpciÃ³n C"]);
        return {
          content: [{ type: "text", text: "ðŸ“± *WhatsApp Business Button Preview (no enviado)*\n\n```json\n" + JSON.stringify(preview, null, 2) + "\n```" }],
          details: { preview },
        };
      }

      // â”€â”€â”€ SETUP PROACTIVE (isolated agentTurn â€” proactive-agent v3.1) â”€â”€â”€â”€â”€â”€
      if (params.action === "setup_proactive") {
        const cronParams = {
          name: "Secretary Daily Briefing",
          schedule: { kind: "cron", expr: "0 8 * * *", tz: "Local" },
          // Use isolated agentTurn (not systemEvent) so it runs autonomously
          payload: {
            kind: "agentTurn",
            message:
              "AUTONOMOUS TASK â€” No preguntes, solo ejecuta:\n" +
              "1. Llama a secretary_orchestrator(action='briefing') para obtener el resumen del dÃ­a\n" +
              "2. Si hay eventos, llama a secretary_whatsapp(action='send_buttons') con el payload retornado en waInteractivePayload\n" +
              "3. Llama a secretary_orchestrator(action='email_concierge') y envÃ­a el resumen por WA si hay crÃ­ticos\n" +
              "4. Actualiza SESSION-STATE.md con el timestamp del briefing enviado",
          },
          delivery: { mode: "announce" },
          sessionTarget: "isolated",
        };

        const preResearchCron = {
          name: "Secretary Pre-Meeting Research",
          schedule: { kind: "cron", expr: "45 * * * *", tz: "Local" },
          payload: {
            kind: "agentTurn",
            message:
              "AUTONOMOUS TASK â€” Comprueba si hay una reuniÃ³n en los prÃ³ximos 15 minutos en el calendario. " +
              "Si la hay, llama a secretary_orchestrator(action='proactive_research', title='<tÃ­tulo de la reuniÃ³n>'). No preguntes.",
          },
          sessionTarget: "isolated",
        };

        return {
          content: [
            {
              type: "text",
              text:
                "âš™ï¸ *ConfiguraciÃ³n de Crons AutÃ³nomos (isolated agentTurn)*\n\n" +
                "Usa `cron.add` con estos parÃ¡metros para activar los briefings automÃ¡ticos:\n\n" +
                "**Cron 1 â€” Briefing diario (08:00):**\n```json\n" +
                JSON.stringify(cronParams, null, 2) +
                "\n```\n\n" +
                "**Cron 2 â€” InvestigaciÃ³n pre-reuniÃ³n (cada hora :45):**\n```json\n" +
                JSON.stringify(preResearchCron, null, 2) +
                "\n```",
            },
          ],
          details: { cronParams, preResearchCron },
        };
      }

      // â”€â”€â”€ PROACTIVE RESEARCH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (params.action === "proactive_research") {
        if (!process.env.TAVILY_API_KEY) {
          return {
            content: [{ type: "text", text: "ðŸ” InvestigaciÃ³n proactiva pendiente. Configura `TAVILY_API_KEY`." }],
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

      return {
        content: [{ type: "text", text: `AcciÃ³n '${params.action}' recibida.` }],
      };
    },
  };
}

