import type { OpenClawPluginApi } from "../../../src/plugins/types.js";
import { chunkByParagraph } from "../../../src/auto-reply/chunk.js";

export type ChunkMode = "length" | "newline";

export interface ChunkResult {
  chunks: string[];
  originalLength: number;
  chunkCount: number;
}

export interface TextProcessingResult {
  text: string;
  hasTables: boolean;
  hasControlCommands: boolean;
  wasProcessed: boolean;
  originalText: string;
}

export interface EmailChunkResult {
  subject: string;
  sender: string;
  chunks: string[];
  totalChunks: number;
  hasAttachments: boolean;
  snippet: string;
}

export interface DocumentChunkResult {
  title: string;
  chunks: string[];
  totalChunks: number;
  wordCount: number;
  hasTables: boolean;
  hasCodeBlocks: boolean;
}

export async function chunkTextForWhatsApp(
  api: OpenClawPluginApi,
  text: string,
  limit =  4000,
  mode: ChunkMode = "length",
): Promise<ChunkResult> {
  try {
    const chunks = api.runtime.channel.text.chunkTextWithMode(text, limit, mode);
    return {
      chunks,
      originalLength: text.length,
      chunkCount: chunks.length,
    };
  } catch (error) {
    api.logger.warn(`[text-processor] chunkTextWithMode failed: ${error}`);
    return {
      chunks: [text],
      originalLength: text.length,
      chunkCount: 1,
    };
  }
}

export async function chunkMarkdownForWhatsApp(
  api: OpenClawPluginApi,
  markdown: string,
  limit = 4000,
  mode: ChunkMode = "length",
): Promise<ChunkResult> {
  try {
    const chunks = api.runtime.channel.text.chunkMarkdownTextWithMode(markdown, limit, mode);
    return {
      chunks,
      originalLength: markdown.length,
      chunkCount: chunks.length,
    };
  } catch (error) {
    api.logger.warn(`[text-processor] chunkMarkdownTextWithMode failed: ${error}`);
    return {
      chunks: [markdown],
      originalLength: markdown.length,
      chunkCount: 1,
    };
  }
}

export async function chunkByNewlines(
  api: OpenClawPluginApi,
  text: string,
): Promise<ChunkResult> {
  try {
    const chunks = api.runtime.channel.text.chunkByNewline(text);
    return {
      chunks,
      originalLength: text.length,
      chunkCount: chunks.length,
    };
  } catch (error) {
    api.logger.warn(`[text-processor] chunkByNewline failed: ${error}`);
    return {
      chunks: [text],
      originalLength: text.length,
      chunkCount: 1,
    };
  }
}

export async function convertTablesForChannel(
  api: OpenClawPluginApi,
  markdown: string,
  channel: "whatsapp" | "telegram" | "discord" | "default" = "whatsapp",
): Promise<string> {
  try {
    const mode = getTableModeForChannel(channel);
    return api.runtime.channel.text.convertMarkdownTables(markdown, mode);
  } catch (error) {
    api.logger.warn(`[text-processor] convertMarkdownTables failed: ${error}`);
    return markdown;
  }
}

type MarkdownTableMode = "whatsapp" | "telegram" | "discord" | "default";

function getTableModeForChannel(channel: string): MarkdownTableMode {
  const channelMap: Record<string, MarkdownTableMode> = {
    whatsapp: "whatsapp",
    telegram: "telegram",
    discord: "discord",
  };
  return channelMap[channel] ?? "default";
}

export async function hasControlCommand(
  api: OpenClawPluginApi,
  text: string,
): Promise<boolean> {
  try {
    return api.runtime.channel.text.hasControlCommand(text);
  } catch (error) {
    api.logger.warn(`[text-processor] hasControlCommand failed: ${error}`);
    return false;
  }
}

export async function isControlCommandMessage(
  api: OpenClawPluginApi,
  text?: string,
): Promise<boolean> {
  try {
    return api.runtime.channel.text.isControlCommandMessage(text);
  } catch (error) {
    api.logger.warn(`[text-processor] isControlCommandMessage failed: ${error}`);
    return false;
  }
}

export async function resolveTextChunkLimit(
  api: OpenClawPluginApi,
  channel: "whatsapp" | "telegram" | "discord" | "default" = "whatsapp",
): Promise<number> {
  try {
    return api.runtime.channel.text.resolveTextChunkLimit(api.config, channel);
  } catch (error) {
    api.logger.warn(`[text-processor] resolveTextChunkLimit failed: ${error}`);
    return 4000;
  }
}

export async function resolveChunkMode(
  api: OpenClawPluginApi,
  channel: "whatsapp" | "telegram" | "discord" | "default" = "whatsapp",
): Promise<ChunkMode> {
  try {
    return api.runtime.channel.text.resolveChunkMode(api.config, channel);
  } catch (error) {
    api.logger.warn(`[text-processor] resolveChunkMode failed: ${error}`);
    return "length";
  }
}

export async function processEmailBody(
  api: OpenClawPluginApi,
  subject: string,
  sender: string,
  body: string,
): Promise<EmailChunkResult> {
  const hasAttachments = /attachment|adjunto|image\/|application\/pdf/i.test(body);
  const snippet = body.substring(0, 200).replace(/\s+/g, " ").trim();

  const limit = await resolveTextChunkLimit(api, "whatsapp");
  const mode = await resolveChunkMode(api, "whatsapp");

  const preprocessedBody = await preprocessEmailBody(api, body);
  const chunks = await chunkTextForWhatsApp(api, preprocessedBody, limit, mode);

  return {
    subject,
    sender,
    chunks: chunks.chunks,
    totalChunks: chunks.chunkCount,
    hasAttachments,
    snippet,
  };
}

async function preprocessEmailBody(api: OpenClawPluginApi, body: string): Promise<string> {
  let processed = body;

  processed = processed.replace(/<[^>]+>/g, "");
  processed = processed.replace(/&nbsp;/g, " ");
  processed = processed.replace(/&amp;/g, "&");
  processed = processed.replace(/&lt;/g, "<");
  processed = processed.replace(/&gt;/g, ">");

  if (processed.includes("|")) {
    processed = await convertTablesForChannel(api, processed, "whatsapp");
  }

  return processed.trim();
}

export async function processDocumentText(
  api: OpenClawPluginApi,
  title: string,
  content: string,
): Promise<DocumentChunkResult> {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const hasTables = /\|.*\|/.test(content);
  const hasCodeBlocks = /```[\s\S]*?```|`[^`]+`/.test(content);

  const limit = await resolveTextChunkLimit(api, "whatsapp");
  const mode = await resolveChunkMode(api, "whatsapp");

  const preprocessed = await preprocessDocumentContent(api, content, hasTables);
  const chunks = await chunkMarkdownForWhatsApp(api, preprocessed, limit, mode);

  return {
    title,
    chunks: chunks.chunks,
    totalChunks: chunks.chunkCount,
    wordCount,
    hasTables,
    hasCodeBlocks,
  };
}

async function preprocessDocumentContent(
  api: OpenClawPluginApi,
  content: string,
  hasTables: boolean,
): Promise<string> {
  let processed = content;

  if (hasTables) {
    processed = await convertTablesForChannel(api, processed, "whatsapp");
  }

  return processed;
}

export async function formatBriefingForWhatsApp(
  api: OpenClawPluginApi,
  briefing: string,
): Promise<string[]> {
  const limit = await resolveTextChunkLimit(api, "whatsapp");
  const mode = await resolveChunkMode(api, "whatsapp");

  const converted = await convertTablesForChannel(api, briefing, "whatsapp");
  const result = await chunkMarkdownForWhatsApp(api, converted, limit, mode);

  return result.chunks;
}

export async function processCommandText(
  api: OpenClawPluginApi,
  text: string,
): Promise<TextProcessingResult> {
  const hasCommands = await hasControlCommand(api, text);
  const isCommand = await isControlCommandMessage(api, text);
  const hasTables = /\|.*\|/.test(text);

  let processed = text;
  if (hasTables) {
    processed = await convertTablesForChannel(api, processed, "whatsapp");
  }

  return {
    text: processed,
    hasTables,
    hasControlCommands: hasCommands || isCommand,
    wasProcessed: hasTables || hasCommands || isCommand,
    originalText: text,
  };
}

export async function createWhatsAppChunks(
  api: OpenClawPluginApi,
  text: string,
): Promise<ChunkResult> {
  const limit = await resolveTextChunkLimit(api, "whatsapp");
  const mode = await resolveChunkMode(api, "whatsapp");

  const result = await chunkMarkdownForWhatsApp(api, text, limit, mode);

  api.logger.info(
    `[text-processor] Created ${result.chunkCount} chunks from ${result.originalLength} chars`,
  );

  return result;
}

export async function chunkByParagraphForDocuments(
  api: OpenClawPluginApi,
  text: string,
  limit = 4000,
  opts?: { splitLongParagraphs?: boolean },
): Promise<ChunkResult> {
  try {
    const chunks = chunkByParagraph(text, limit, opts);
    api.logger.info(
      `[text-processor] Paragraph chunking: ${chunks.length} chunks from ${text.length} chars`,
    );
    return {
      chunks,
      originalLength: text.length,
      chunkCount: chunks.length,
    };
  } catch (error) {
    api.logger.warn(`[text-processor] chunkByParagraph failed: ${error}`);
    return {
      chunks: [text],
      originalLength: text.length,
      chunkCount: 1,
    };
  }
}

export async function processGhostWriteDocument(
  api: OpenClawPluginApi,
  title: string,
  content: string,
): Promise<{
  chunks: string[];
  totalChunks: number;
  wordCount: number;
  hasTables: boolean;
  hasCodeBlocks: boolean;
}> {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const hasTables = /\|.*\|/.test(content);
  const hasCodeBlocks = /```[\s\S]*?```|`[^`]+`/.test(content);

  const limit = await resolveTextChunkLimit(api, "whatsapp");
  const chunks = await chunkByParagraphForDocuments(api, content, limit, { splitLongParagraphs: true });

  return {
    chunks: chunks.chunks,
    totalChunks: chunks.chunkCount,
    wordCount,
    hasTables,
    hasCodeBlocks,
  };
}

export const TextProcessingUtils = {
  chunkForWhatsApp: chunkTextForWhatsApp,
  chunkMarkdownForWhatsApp,
  chunkByNewlines,
  chunkByParagraph: chunkByParagraphForDocuments,
  convertTablesForChannel,
  hasControlCommand,
  isControlCommandMessage,
  resolveTextChunkLimit,
  resolveChunkMode,
  processEmailBody,
  processDocumentText,
  formatBriefingForWhatsApp,
  processCommandText,
  createWhatsAppChunks,
  processGhostWriteDocument,
};
