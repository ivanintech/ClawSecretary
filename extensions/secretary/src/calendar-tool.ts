import { Type } from "@sinclair/typebox";
import { CalendarStore, CalendarEvent } from "./store.js";
import type { OpenClawPluginApi } from "../../../src/plugins/types.js";

export function createCalendarTool(api: OpenClawPluginApi) {
  const store = new CalendarStore(api.resolvePath("./data"));

  return {
    name: "secretary_calendar",
    label: "Secretary Calendar",
    description: "Manage personal calendar events with intelligent conflict detection.",
    parameters: Type.Object({
      action: Type.String({ enum: ["list", "add", "delete"], description: "The action to perform." }),
      title: Type.Optional(Type.String({ description: "Event title (required for 'add')." })),
      startTime: Type.Optional(Type.String({ description: "Start time in ISO format (required for 'add')." })),
      endTime: Type.Optional(Type.String({ description: "End time in ISO format (required for 'add')." })),
      id: Type.Optional(Type.String({ description: "Event ID (required for 'delete')." })),
    }),

    async execute(_runId: string, params: Record<string, any>) {
      const events = await store.load();

      if (params.action === "list") {
        return {
          content: [{ type: "text", text: JSON.stringify(events, null, 2) }],
          details: { events },
        };
      }

      if (params.action === "add") {
        if (!params.title || !params.startTime || !params.endTime) {
          throw new Error("title, startTime, and endTime are required for 'add' action.");
        }

        const start = new Date(params.startTime);
        const end = new Date(params.endTime);

        // Basic Conflict Detection
        const conflicts = events.filter(e => {
          const eStart = new Date(e.startTime);
          const eEnd = new Date(e.endTime);
          return (start < eEnd && end > eStart);
        });

        if (conflicts.length > 0) {
          return {
            content: [{ 
              type: "text", 
              text: `CONFLICT DETECTED: This event overlaps with:\n${conflicts.map(c => `- ${c.title} (${c.startTime} to ${c.endTime})`).join("\n")}` 
            }],
            details: { status: "conflict", conflicts }
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
          content: [{ type: "text", text: `Event added: ${params.title}` }],
          details: { status: "success", event: newEvent },
        };
      }

      if (params.action === "delete") {
        if (!params.id) {
          throw new Error("id is required for 'delete' action.");
        }

        const initialLength = events.length;
        const filtered = events.filter(e => e.id !== params.id);
        
        if (filtered.length === initialLength) {
          throw new Error(`Event with ID ${params.id} not found.`);
        }

        await store.save(filtered);
        return {
          content: [{ type: "text", text: `Event deleted: ${params.id}` }],
          details: { status: "success", deletedId: params.id },
        };
      }

      throw new Error(`Unknown action: ${params.action}`);
    },
  };
}
