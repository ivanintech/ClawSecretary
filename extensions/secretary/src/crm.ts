import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

/**
 * CRM Helper for Notion and Things 3.
 */
export class CRMManager {
  /**
   * Pushes a task to Things 3 (macOS only).
   */
  async pushToThings(title: string, notes: string = "", deadline?: string): Promise<boolean> {
    let command = `things add "${title}" --notes "${notes.replace(/"/g, '\\"')}"`;
    if (deadline) command += ` --deadline ${deadline}`;

    try {
      await execAsync(command);
      return true;
    } catch (error) {
      console.error("[CRM] Error pushing to Things:", error);
      return false;
    }
  }

  /**
   * Syncs a log entry to Notion.
   * Requires NOTION_API_KEY and a valid DATABASE_ID.
   */
  async syncToNotion(databaseId: string, title: string, content: string): Promise<boolean> {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) return false;

    const payload = {
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: title } }] },
        Date: { date: { start: new Date().toISOString() } },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: [{ text: { content: content.substring(0, 2000) } }] },
        },
      ],
    };

    try {
      const response = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return response.ok;
    } catch (error) {
      console.error("[CRM] Error syncing to Notion:", error);
      return false;
    }
  }
}
