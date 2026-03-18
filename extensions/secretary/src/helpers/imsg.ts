import { execFileAsync } from "./common.js";

export interface ImsgChat {
  id: number;
  displayName: string;
  service: string;
  lastMessage?: string;
  lastMessageDate?: string;
}

export interface ImsgMessage {
  id: number;
  text: string;
  isFromMe: boolean;
  date: string;
  service: string;
  attachments?: string[];
}

export interface ImsgAttachment {
  id: number;
  mimeType: string;
  filePath?: string;
}

export async function checkImsgAvailable(): Promise<boolean> {
  try {
    await execFileAsync("imsg", ["--version"]);
    return true;
  } catch {
    return false;
  }
}

export async function imsgListChats(limit = 10): Promise<ImsgChat[]> {
  try {
    const { stdout } = await execFileAsync("imsg", [
      "chats",
      "--limit",
      String(limit),
      "--json",
    ]);
    return JSON.parse(stdout) as ImsgChat[];
  } catch (err: any) {
    console.error(`[iMsg] Failed to list chats: ${err.message}`);
    return [];
  }
}

export async function imsgGetHistory(
  chatId: number,
  limit = 20,
  withAttachments = false,
): Promise<ImsgMessage[]> {
  try {
    const args = ["history", "--chat-id", String(chatId), "--limit", String(limit), "--json"];
    if (withAttachments) {
      args.push("--attachments");
    }
    const { stdout } = await execFileAsync("imsg", args);
    return JSON.parse(stdout) as ImsgMessage[];
  } catch (err: any) {
    console.error(`[iMsg] Failed to get history: ${err.message}`);
    return [];
  }
}

export async function imsgFindChat(
  name: string,
  limit = 20,
): Promise<ImsgChat | null> {
  try {
    const chats = await imsgListChats(limit);
    const lowerName = name.toLowerCase();
    return (
      chats.find(
        (c) =>
          c.displayName.toLowerCase().includes(lowerName) ||
          lowerName.includes(c.displayName.toLowerCase()),
      ) || null
    );
  } catch {
    return null;
  }
}

export async function imsgSendText(
  to: string,
  text: string,
  service: "imessage" | "sms" | "auto" = "auto",
): Promise<{ success: boolean; error?: string }> {
  try {
    const args = ["send", "--to", to, "--text", text];
    if (service !== "auto") {
      args.push("--service", service);
    }
    await execFileAsync("imsg", args);
    console.log(`[iMsg] Sent message to ${to}: ${text.substring(0, 50)}...`);
    return { success: true };
  } catch (err: any) {
    console.error(`[iMsg] Failed to send: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function imsgSendWithAttachment(
  to: string,
  text: string,
  filePath: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const args = ["send", "--to", to, "--text", text, "--file", filePath];
    await execFileAsync("imsg", args);
    console.log(`[iMsg] Sent message with attachment to ${to}`);
    return { success: true };
  } catch (err: any) {
    console.error(`[iMsg] Failed to send with attachment: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function imsgWatchChat(
  chatId: number,
  withAttachments = false,
): Promise<{ success: boolean; error?: string }> {
  try {
    const args = ["watch", "--chat-id", String(chatId)];
    if (withAttachments) {
      args.push("--attachments");
    }
    const proc = await import("node:child_process").then(({ spawn }) =>
      spawn("imsg", args, { stdio: "inherit" }),
    );
    return new Promise((resolve) => {
      proc.on("close", (code) => {
        resolve({ success: code === 0 });
      });
    });
  } catch (err: any) {
    console.error(`[iMsg] Failed to watch: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function imsgGetRecentMessages(
  name: string,
  limit = 10,
): Promise<{ chat: ImsgChat | null; messages: ImsgMessage[] }> {
  const chat = await imsgFindChat(name, 20);
  if (!chat) {
    return { chat: null, messages: [] };
  }

  const messages = await imsgGetHistory(chat.id, limit);
  return { chat, messages };
}

export async function imsgFormatChatForSecretary(
  chat: ImsgChat,
  messages: ImsgMessage[],
): Promise<string> {
  const lines: string[] = [];
  lines.push(`💬 **${chat.displayName}** (${chat.service})`);
  lines.push("");

  for (const msg of messages.slice(-5)) {
    const prefix = msg.isFromMe ? "👤" : "👥";
    const time = new Date(msg.date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    lines.push(`${prefix} [${time}] ${msg.text}`);
  }

  return lines.join("\n");
}

export async function imsgSendQuick(
  name: string,
  message: string,
): Promise<{ success: boolean; contact?: string; error?: string }> {
  const chat = await imsgFindChat(name);
  if (!chat) {
    return { success: false, error: `Chat "${name}" not found` };
  }

  const result = await imsgSendText(chat.displayName, message);
  return {
    success: result.success,
    contact: chat.displayName,
    error: result.error,
  };
}
