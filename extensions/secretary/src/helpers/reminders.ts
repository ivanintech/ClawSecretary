import { execFileAsync } from "./common.js";

export interface ReminderList {
  name: string;
  id: string;
  count: number;
}

export interface Reminder {
  id: string;
  title: string;
  list: string;
  dueDate?: string;
  isCompleted: boolean;
  notes?: string;
  priority?: number;
}

export interface ReminderCreateParams {
  title: string;
  list?: string;
  dueDate?: string;
  notes?: string;
  priority?: "high" | "medium" | "low";
}

const PRIORITY_MAP: Record<string, number> = {
  high: 1,
  medium: 5,
  low: 9,
};

export async function checkRemindersAvailable(): Promise<boolean> {
  try {
    await execFileAsync("remindctl", ["status"]);
    return true;
  } catch {
    return false;
  }
}

export async function remindersGetStatus(): Promise<{
  available: boolean;
  authorized: boolean;
}> {
  try {
    const { stdout } = await execFileAsync("remindctl", ["status", "--json"]);
    const status = JSON.parse(stdout) as { authorized?: boolean };
    return {
      available: true,
      authorized: status.authorized ?? false,
    };
  } catch {
    return { available: false, authorized: false };
  }
}

export async function remindersAuthorize(): Promise<{ success: boolean; error?: string }> {
  try {
    await execFileAsync("remindctl", ["authorize"]);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function remindersListLists(): Promise<ReminderList[]> {
  try {
    const { stdout } = await execFileAsync("remindctl", ["list", "--json"]);
    const lines = stdout.split("\n").filter(Boolean);
    const lists: ReminderList[] = [];

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.name) {
          lists.push({
            name: parsed.name,
            id: parsed.name,
            count: parsed.count ?? 0,
          });
        }
      } catch {
        const match = line.match(/^(.+?)\s+\((\d+)\s+items?\)/);
        if (match) {
          lists.push({
            name: match[1].trim(),
            id: match[1].trim(),
            count: parseInt(match[2], 10),
          });
        }
      }
    }

    return lists;
  } catch {
    return [];
  }
}

export async function remindersGetToday(): Promise<Reminder[]> {
  try {
    const { stdout } = await execFileAsync("remindctl", ["today", "--json"]);
    return parseRemindersOutput(stdout);
  } catch {
    return [];
  }
}

export async function remindersGetTomorrow(): Promise<Reminder[]> {
  try {
    const { stdout } = await execFileAsync("remindctl", ["tomorrow", "--json"]);
    return parseRemindersOutput(stdout);
  } catch {
    return [];
  }
}

export async function remindersGetWeek(): Promise<Reminder[]> {
  try {
    const { stdout } = await execFileAsync("remindctl", ["week", "--json"]);
    return parseRemindersOutput(stdout);
  } catch {
    return [];
  }
}

export async function remindersGetOverdue(): Promise<Reminder[]> {
  try {
    const { stdout } = await execFileAsync("remindctl", ["overdue", "--json"]);
    return parseRemindersOutput(stdout);
  } catch {
    return [];
  }
}

export async function remindersGetAll(limit = 50): Promise<Reminder[]> {
  try {
    const { stdout } = await execFileAsync("remindctl", ["all", "--json"]);
    return parseRemindersOutput(stdout).slice(0, limit);
  } catch {
    return [];
  }
}

function parseRemindersOutput(stdout: string): Reminder[] {
  const reminders: Reminder[] = [];
  const lines = stdout.split("\n").filter(Boolean);

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.title) {
        reminders.push({
          id: parsed.id ?? "",
          title: parsed.title,
          list: parsed.list ?? "Reminders",
          dueDate: parsed.dueDate ?? parsed.due ?? undefined,
          isCompleted: parsed.isCompleted ?? parsed.completed ?? false,
          notes: parsed.notes ?? parsed.body,
          priority: parsed.priority,
        });
      }
    } catch {
      const match = line.match(/^\[([^\]]+)\]\s*(.+)$/);
      if (match) {
        const dueMatch = match[1].match(/(\d{4}-\d{2}-\d{2})/);
        reminders.push({
          id: "",
          title: match[2].trim(),
          list: "Reminders",
          dueDate: dueMatch ? dueMatch[1] : undefined,
          isCompleted: false,
        });
      }
    }
  }

  return reminders;
}

export async function remindersCreate(params: ReminderCreateParams): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    const args = ["add", "--title", params.title];

    if (params.list) {
      args.push("--list", params.list);
    }

    if (params.dueDate) {
      args.push("--due", params.dueDate);
    }

    if (params.notes) {
      args.push("--notes", params.notes);
    }

    await execFileAsync("remindctl", args);
    console.log(`[Reminders] Created: ${params.title}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Reminders] Failed to create: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function remindersComplete(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await execFileAsync("remindctl", ["complete", id]);
    console.log(`[Reminders] Completed: ${id}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function remindersDelete(id: string, force = true): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const args = ["delete", id];
    if (force) args.push("--force");
    await execFileAsync("remindctl", args);
    console.log(`[Reminders] Deleted: ${id}`);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function remindersCreateFromNaturalLanguage(
  text: string,
): Promise<{ success: boolean; reminder?: Reminder; error?: string }> {
  const dueMatch = text.match(
    /(hoy|mañana|manana|este\s+(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)|en\s+(\d+)\s*(horas?|días?|dias?)|(\d{4}-\d{2}-\d{2})|(\d{2}\/\d{2}\/\d{4})|(\d{2}-\d{2}-\d{4}))/i,
  );

  let dueDate: string | undefined;

  if (dueMatch) {
    const match = dueMatch[0].toLowerCase();
    if (match === "hoy") {
      dueDate = new Date().toISOString().split("T")[0];
    } else if (match === "mañana" || match === "manana") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow.toISOString().split("T")[0];
    } else if (match.includes("horas")) {
      const hours = parseInt(dueMatch[3] || "1", 10);
      const due = new Date();
      due.setHours(due.getHours() + hours);
      dueDate = due.toISOString();
    } else if (match.includes("días") || match.includes("dias")) {
      const days = parseInt(dueMatch[3] || "1", 10);
      const due = new Date();
      due.setDate(due.getDate() + days);
      dueDate = due.toISOString();
    } else {
      dueDate = dueMatch[5] || dueMatch[6] || dueMatch[7];
    }
  }

  const title = text.replace(
    /(hoy|mañana|manana|en\s+\d+\s*(horas?|días?|dias?)|este\s+(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)|\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4})/gi,
    "",
  ).trim();

  return remindersCreate({ title, dueDate });
}

export async function remindersCreateQuick(
  title: string,
  dueDate?: string,
): Promise<{ success: boolean; error?: string }> {
  return remindersCreate({ title, dueDate });
}

export async function remindersFormatSummary(reminders: Reminder[]): Promise<string> {
  const lines: string[] = [];
  lines.push("⏰ **Recordatorios**");
  lines.push("");

  const byList = reminders.reduce((acc, r) => {
    acc[r.list] = acc[r.list] || [];
    acc[r.list].push(r);
    return acc;
  }, {} as Record<string, Reminder[]>);

  for (const [listName, items] of Object.entries(byList)) {
    lines.push(`📋 **${listName}** (${items.length})`);
    for (const item of items.slice(0, 5)) {
      const status = item.isCompleted ? "✅" : "☐";
      const due = item.dueDate
        ? ` - ${new Date(item.dueDate).toLocaleDateString("es-ES")}`
        : "";
      lines.push(`  ${status} ${item.title}${due}`);
    }
    if (items.length > 5) {
      lines.push(`  ... y ${items.length - 5} más`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export async function remindersSyncFromBriefing(
  actionItems: string[],
): Promise<{ success: boolean; created: number; failed: number }> {
  let created = 0;
  let failed = 0;

  for (const item of actionItems) {
    const result = await remindersCreateFromNaturalLanguage(item);
    if (result.success) {
      created++;
    } else {
      failed++;
    }
  }

  return { success: failed === 0, created, failed };
}
