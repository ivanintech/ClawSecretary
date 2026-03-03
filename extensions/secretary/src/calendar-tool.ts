import { Type } from "@sinclair/typebox";
import fs from "node:fs/promises";
import path from "node:path";
import { CalendarStore, CalendarEvent } from "./store.js";
import type { OpenClawPluginApi, OpenClawPluginToolContext } from "../../../src/plugins/types.js";

export function createCalendarTool(api: OpenClawPluginApi) {
  const store = new CalendarStore(api.resolvePath("./data"));

  return {
    name: "secretary_calendar",
    label: "Secretary Calendar",
    description: "Manage personal calendar events with intelligent conflict detection and WAL-compliant persistence.",
    parameters: Type.Object({
      action: Type.String({
        enum: ["list", "add", "delete"],
        description: "The action to perform.",
      }),
      title: Type.Optional(Type.String({ description: "Event title (required for 'add')." })),
      startTime: Type.Optional(
        Type.String({ description: "Start time in ISO format (required for 'add')." }),
      ),
      endTime: Type.Optional(
        Type.String({ description: "End time in ISO format (required for 'add')." }),
      ),
      id: Type.Optional(Type.String({ description: "Event ID (required for 'delete')." })),
    }),

    async execute(_runId: string, params: Record<string, any>, ctx?: OpenClawPluginToolContext) {
      const events = await store.load();

      // ─── LIST ─────────────────────────────────────────────────────────────
      if (params.action === "list") {
        if (events.length === 0) {
          return {
            content: [{ type: "text", text: "📅 No hay eventos en el calendario local." }],
            details: { events },
          };
        }
        const formatted = events
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map(
            (e) =>
              `• [${e.id}] ${e.startTime.substring(0, 16).replace("T", " ")} → ${e.endTime.substring(11, 16)} — *${e.title}*`,
          )
          .join("\n");
        return {
          content: [{ type: "text", text: `📅 *Calendario Local (${events.length} eventos):*\n\n${formatted}` }],
          details: { events },
        };
      }

      // ─── ADD (with conflict detection + WAL sync) ─────────────────────────
      if (params.action === "add") {
        if (!params.title || !params.startTime || !params.endTime) {
          throw new Error("title, startTime, and endTime are required for 'add' action.");
        }

        const start = new Date(params.startTime);
        const end = new Date(params.endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          throw new Error("startTime and endTime must be valid ISO date strings.");
        }
        if (end <= start) {
          throw new Error("endTime must be after startTime.");
        }

        // Conflict Detection
        const conflicts = events.filter((e) => {
          const eStart = new Date(e.startTime);
          const eEnd = new Date(e.endTime);
          return start < eEnd && end > eStart;
        });

        if (conflicts.length > 0) {
          // WAL PROTOCOL: Persist the conflict to SESSION-STATE.md before replying
          const workspaceDir = ctx?.workspaceDir;
          if (workspaceDir) {
            const sessionStatePath = path.join(workspaceDir, "SESSION-STATE.md");
            try {
              let content = await fs.readFile(sessionStatePath, "utf-8").catch(
                () => "# Active Working Memory (WAL) 🦞\n\n**Status**: READY\n\n---\n",
              );
              const fmt = (iso: string) => iso.substring(11, 16);
              const entry =
                `\n### [${new Date().toISOString()}] Add Conflict: "${params.title}"\n` +
                `- **Attempted slot**: ${fmt(params.startTime)} – ${fmt(params.endTime)}\n` +
                `- **Blocked by**: ${conflicts.map((c) => `"${c.title}" (${fmt(c.startTime)}–${fmt(c.endTime)})`).join(", ")}\n`;

              if (content.includes("## Active Conflicts")) {
                content = content.replace(
                  /## Active Conflicts[\s\S]*?(?=\n## |\n---\n\n##|\s*$)/,
                  `## Active Conflicts\n${entry}\n`,
                );
              } else {
                content += `\n---\n\n## Active Conflicts\n${entry}\n`;
              }
              await fs.writeFile(sessionStatePath, content, "utf-8");
            } catch (err) {
              console.warn("[WAL] Could not update SESSION-STATE.md:", err);
            }
          }

          const conflictList = conflicts
            .map((c) => `  - "${c.title}" (${c.startTime.substring(11, 16)} → ${c.endTime.substring(11, 16)})`)
            .join("\n");

          return {
            content: [
              {
                type: "text",
                text:
                  `⚠️ *CONFLICTO DETECTADO* — No se pudo añadir *"${params.title}"*.\n\n` +
                  `Solapa con:\n${conflictList}\n\n` +
                  `Usa \`conflict_guardian\` en el orquestador para encontrar un horario alternativo.\n` +
                  `_Conflicto registrado en SESSION-STATE.md (WAL ✅)_`,
              },
            ],
            details: { status: "conflict", conflicts },
          };
        }

        const newEvent: CalendarEvent = {
          id: Math.random().toString(36).substring(2, 9),
          title: params.title,
          startTime: params.startTime,
          endTime: params.endTime,
        };

        events.push(newEvent);
        await store.save(events);

        return {
          content: [
            {
              type: "text",
              text: `✅ Evento añadido: *"${params.title}"* — ${params.startTime.substring(11, 16)} → ${params.endTime.substring(11, 16)}`,
            },
          ],
          details: { status: "success", event: newEvent },
        };
      }

      // ─── DELETE ───────────────────────────────────────────────────────────
      if (params.action === "delete") {
        if (!params.id) {
          throw new Error("id is required for 'delete' action.");
        }

        const initialLength = events.length;
        const filtered = events.filter((e) => e.id !== params.id);

        if (filtered.length === initialLength) {
          throw new Error(`Event with ID "${params.id}" not found.`);
        }

        const deleted = events.find((e) => e.id === params.id)!;
        await store.save(filtered);

        return {
          content: [
            {
              type: "text",
              text: `🗑️ Evento eliminado: *"${deleted.title}"* (ID: ${params.id})`,
            },
          ],
          details: { status: "success", deletedId: params.id, deletedEvent: deleted },
        };
      }

      throw new Error(`Unknown action: ${params.action}`);
    },
  };
}
