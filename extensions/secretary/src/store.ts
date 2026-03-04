import fs from "node:fs/promises";
import path from "node:path";

export type CalendarEvent = {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  description?: string;
  source?: "local" | "google" | "outlook" | "calendly";
  researched?: boolean;
};

export class CalendarStore {
  private filePath: string;

  constructor(baseDir: string) {
    this.filePath = path.join(baseDir, "calendar.json");
  }

  async load(): Promise<CalendarEvent[]> {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async save(events: CalendarEvent[]): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(events, null, 2));
  }
}
