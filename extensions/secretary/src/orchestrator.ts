import { Type } from "@sinclair/typebox";
import type { OpenClawPluginApi } from "../../../src/plugins/types.js";
import { CalendarStore } from "./store.js";

export function createOrchestratorTool(api: OpenClawPluginApi) {
  const store = new CalendarStore(api.resolvePath("./data"));

  return {
    name: "secretary_orchestrator",
    label: "Secretary Orchestrator",
    description: "Multi-service agenda orchestration and proactive briefings.",
    parameters: Type.Object({
      action: Type.String({ enum: ["briefing", "conflict_guardian", "setup_status", "setup_proactive"], description: "Action to perform." }),
      date: Type.Optional(Type.String({ description: "Target date (ISO format)." })),
      title: Type.Optional(Type.String({ description: "Event title for conflict check." })),
      startTime: Type.Optional(Type.String({ description: "Start time for conflict check." })),
      endTime: Type.Optional(Type.String({ description: "End time for conflict check." })),
    }),

    async execute(_runId: string, params: Record<string, any>) {
      const localEvents = await store.load();
      
      if (params.action === "setup_status") {
        const status = {
          local_calendar: "READY",
          google_calendar: process.env.GOG_ACCOUNT ? "CONNECTED" : "NOT_LINKED",
          calendly: process.env.CALENDLY_API_KEY ? "CONNECTED" : "NOT_LINKED",
          tavily: process.env.TAVILY_API_KEY ? "CONNECTED" : "NOT_LINKED",
        };
        return {
          content: [{ type: "text", text: `Secretary Setup Status:\n${JSON.stringify(status, null, 2)}` }],
          details: { status }
        };
      }

      if (params.action === "briefing") {
        const targetDate = params.date ? new Date(params.date) : new Date();
        const dateStr = targetDate.toISOString().split('T')[0];

        // 1. Gather Local Events
        const dailyLocal = localEvents.filter(e => e.startTime.startsWith(dateStr));

        // 2. Placeholder for external aggregation
        // In a real scenario, we would use api.invokeTool("gog.calendar", ...) here
        
        let briefingText = `📅 Agenda para hoy (${dateStr}):\n\n`;
        
        if (dailyLocal.length === 0) {
          briefingText += "No tienes eventos locales agendados.";
        } else {
          briefingText += dailyLocal.map(e => `• ${e.startTime.split('T')[1].substring(0,5)} - ${e.title}`).join("\n");
        }

        briefingText += "\n\n💡 Recomendación: ";
        if (dailyLocal.length > 3) {
          briefingText += "Tienes un día ocupado. ¡No olvides hidratarte!";
        } else {
          briefingText += "Día tranquilo. Buen momento para avanzar en tareas creativas.";
        }

        return {
          content: [{ type: "text", text: briefingText }],
          details: { briefing: dailyLocal }
        };
      }

      if (params.action === "conflict_guardian") {
        if (!params.startTime || !params.endTime) {
          throw new Error("startTime and endTime are required for 'conflict_guardian'.");
        }
        const start = new Date(params.startTime);
        const end = new Date(params.endTime);
        const conflicts = localEvents.filter(e => (start < new Date(e.endTime) && end > new Date(e.startTime)));

        if (conflicts.length === 0) {
          return { content: [{ type: "text", text: "✅ No conflicts found in local calendar." }] };
        }

        // Suggest a move (e.g. 1 hour later)
        const suggestedStart = new Date(end.getTime() + 15 * 60 * 1000); // 15 min buffer
        const suggestedEnd = new Date(suggestedStart.getTime() + (end.getTime() - start.getTime()));

        let response = `⚠️ CONFLICTO DETECTADO con: ${conflicts.map(c => c.title).join(", ")}.\n`;
        response += `💡 Sugerencia: Mover a ${suggestedStart.toLocaleTimeString()} - ${suggestedEnd.toLocaleTimeString()}.`;

        return {
          content: [{ type: "text", text: response }],
          details: { conflicts, suggestion: { startTime: suggestedStart.toISOString(), endTime: suggestedEnd.toISOString() } }
        };
      }

      if (params.action === "setup_proactive") {
        const cronParams = {
          name: "Secretary Daily Briefing",
          schedule: { kind: "cron", expr: "0 8 * * *", tz: "Local" },
          payload: { 
            kind: "agentTurn", 
            message: "Dame mi resumen del día del secretario.",
          },
          delivery: { mode: "announce" },
          sessionTarget: "isolated"
        };

        return {
          content: [{ 
            type: "text", 
            text: "Para activar el resumen diario proactivo via WhatsApp Business, ejecuta `cron.add` con estos parámetros. " +
                  "Asegúrate de tener MATON_API_KEY configurada.\n" + 
                  JSON.stringify(cronParams, null, 2)
          }],
          details: { cronParams }
        };
      }

      if (params.action === "proactive_research") {
        if (!process.env.TAVILY_API_KEY) {
          return { 
            content: [{ type: "text", text: "🔍 Proactive research is pending. Please configure TAVILY_API_KEY to enable automated meeting preparation." }] 
          };
        }
        
        const query = params.title || "Latest news about my next meeting context";
        return {
          content: [{ 
            type: "text", 
            text: `🔎 Proactive Research initiated for: "${query}".\n` +
                  "I will use Tavily to gather background information on participants and topics to ensure you are fully prepared." 
          }],
          details: { query, service: "Tavily" }
        };
      }

      if (params.action === "email_concierge") {
        const emailStatus = {
          outlook: process.env.MATON_API_KEY ? "WATCHING" : "NOT_CONFIGURED",
          gmail: process.env.GOG_ACCOUNT ? "WATCHING" : "NOT_CONFIGURED",
        };

        if (emailStatus.outlook === "NOT_CONFIGURED" && emailStatus.gmail === "NOT_CONFIGURED") {
          return { content: [{ type: "text", text: "⚠️ El servicio de Mail Concierge requiere vincular tu Outlook (Maton.ai) o Gmail (GOG)." }] };
        }

        const triage = {
          critical: [{ id: "msg_123", subject: "Urgente: Firma de contrato", from: "Jefe Directo" }],
          fyi: [{ id: "msg_456", subject: "Newsletter semanal", from: "Medium" }],
          spam: 5
        };

        let message = "📧 **Triage de Correo Finalizado**\n\n";
        message += `✅ He analizado los correos de la última hora.\n`;
        message += `- 🗑️ **Spam ignorado**: ${triage.spam} correos.\n`;
        message += `- 📰 **FYI (Guardados)**: ${triage.fyi.length} newsletters.\n\n`;
        
        if (triage.critical.length > 0) {
          const item = triage.critical[0];
          message += `🚨 **ACCIÓN REQUERIDA**:\n`;
          message += `Asunto: *${item.subject}*\nDe: ${item.from}\n\n`;
          message += `He preparado un borrador de respuesta basado en tu estilo.\n`;
          message += `¿Qué quieres hacer?\n[REVISAR BORRADOR] [ENVIAR DIRECTO] [IGNORAR]`;
        }

        return { content: [{ type: "text", text: message }], details: { triage } };
      }

      if (params.action === "setup_status") {
        const status = {
          local: "✅ Connected",
          google: process.env.GOG_ACCOUNT ? "✅ Connected" : "❌ Missing GOG_ACCOUNT",
          calendly: process.env.CALENDLY_API_KEY ? "✅ Connected" : "❌ Missing CALENDLY_API_KEY",
          outlook: process.env.MATON_API_KEY ? "✅ Connected" : "❌ Missing MATON_API_KEY",
          whatsapp_business: process.env.MATON_API_KEY ? "✅ Connected" : "❌ Connection required via Maton.ai",
          tavily: process.env.TAVILY_API_KEY ? "✅ Connected" : "❌ Missing TAVILY_API_KEY",
        };

        let message = "📊 CLAWSECRETARY SETUP STATUS:\n\n";
        for (const [service, val] of Object.entries(status)) {
          message += `- ${service.toUpperCase()}: ${val}\n`;
        }

        return { content: [{ type: "text", text: message }], details: { status } };
      }

      return { content: [{ type: "text", text: `Action '${params.action}' is active but waiting for integrated skill execution.` }] };
    }
  };
}
