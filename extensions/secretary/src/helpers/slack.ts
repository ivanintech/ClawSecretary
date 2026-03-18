import type { OpenClawPluginApi } from "../../../src/plugins/types.js";

export interface SlackReaction {
  name: string;
  count: number;
  users: string[];
}

export interface SlackMessage {
  ts: string;
  user: string;
  text: string;
  reactions?: SlackReaction[];
  edited?: { ts: string };
}

export interface SlackChannel {
  id: string;
  name: string;
  isChannel: boolean;
  isPrivate: boolean;
  isArchived: boolean;
}

export async function checkSlackConfigured(api: OpenClawPluginApi): Promise<boolean> {
  try {
    const slackConfig = api.config.channels?.slack;
    return !!(slackConfig?.enabled && slackConfig?.token);
  } catch {
    return false;
  }
}

export async function slackSendMessage(
  api: OpenClawPluginApi,
  to: string,
  content: string,
): Promise<{ success: boolean; ts?: string; error?: string }> {
  if (!await checkSlackConfigured(api)) {
    return { success: false, error: "Slack not configured. Set channels.slack.token in config." };
  }

  try {
    const result = await api.runtime.messaging.send({
      channel: "slack",
      recipient: to,
      message: { text: content },
    });

    api.logger.info(`[Slack] Message sent to ${to}: ${content.substring(0, 50)}...`);
    return { success: true, ts: result.id };
  } catch (err: any) {
    api.logger.error(`[Slack] Failed to send message: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function slackReactToMessage(
  api: OpenClawPluginApi,
  channelId: string,
  messageTs: string,
  emoji: string,
): Promise<{ success: boolean; error?: string }> {
  if (!await checkSlackConfigured(api)) {
    return { success: false, error: "Slack not configured" };
  }

  try {
    const slackApi = api.runtime.tools?.slack;
    if (slackApi?.react) {
      await slackApi.react({ channelId, messageId: messageTs, emoji });
      api.logger.info(`[Slack] Reacted with ${emoji} to message ${messageTs}`);
      return { success: true };
    }

    api.logger.warn("[Slack] React action not available via runtime");
    return { success: false, error: "React action not available" };
  } catch (err: any) {
    api.logger.error(`[Slack] Failed to react: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function slackPinMessage(
  api: OpenClawPluginApi,
  channelId: string,
  messageTs: string,
): Promise<{ success: boolean; error?: string }> {
  if (!await checkSlackConfigured(api)) {
    return { success: false, error: "Slack not configured" };
  }

  try {
    const slackApi = api.runtime.tools?.slack;
    if (slackApi?.pin) {
      await slackApi.pin({ channelId, messageId: messageTs });
      api.logger.info(`[Slack] Pinned message ${messageTs} in ${channelId}`);
      return { success: true };
    }

    return { success: false, error: "Pin action not available" };
  } catch (err: any) {
    api.logger.error(`[Slack] Failed to pin: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function slackUnpinMessage(
  api: OpenClawPluginApi,
  channelId: string,
  messageTs: string,
): Promise<{ success: boolean; error?: string }> {
  if (!await checkSlackConfigured(api)) {
    return { success: false, error: "Slack not configured" };
  }

  try {
    const slackApi = api.runtime.tools?.slack;
    if (slackApi?.unpin) {
      await slackApi.unpin({ channelId, messageId: messageTs });
      api.logger.info(`[Slack] Unpinned message ${messageTs} in ${channelId}`);
      return { success: true };
    }

    return { success: false, error: "Unpin action not available" };
  } catch (err: any) {
    api.logger.error(`[Slack] Failed to unpin: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function slackReadMessages(
  api: OpenClawPluginApi,
  channelId: string,
  limit = 20,
): Promise<{ success: boolean; messages?: SlackMessage[]; error?: string }> {
  if (!await checkSlackConfigured(api)) {
    return { success: false, error: "Slack not configured" };
  }

  try {
    const slackApi = api.runtime.tools?.slack;
    if (slackApi?.readMessages) {
      const result = await slackApi.readMessages({ channelId, limit });
      return { success: true, messages: result.messages };
    }

    return { success: false, error: "Read messages not available" };
  } catch (err: any) {
    api.logger.error(`[Slack] Failed to read messages: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function slackDeleteMessage(
  api: OpenClawPluginApi,
  channelId: string,
  messageTs: string,
): Promise<{ success: boolean; error?: string }> {
  if (!await checkSlackConfigured(api)) {
    return { success: false, error: "Slack not configured" };
  }

  try {
    const slackApi = api.runtime.tools?.slack;
    if (slackApi?.deleteMessage) {
      await slackApi.deleteMessage({ channelId, messageId: messageTs });
      api.logger.info(`[Slack] Deleted message ${messageTs} in ${channelId}`);
      return { success: true };
    }

    return { success: false, error: "Delete action not available" };
  } catch (err: any) {
    api.logger.error(`[Slack] Failed to delete: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function slackEditMessage(
  api: OpenClawPluginApi,
  channelId: string,
  messageTs: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  if (!await checkSlackConfigured(api)) {
    return { success: false, error: "Slack not configured" };
  }

  try {
    const slackApi = api.runtime.tools?.slack;
    if (slackApi?.editMessage) {
      await slackApi.editMessage({ channelId, messageId: messageTs, content });
      api.logger.info(`[Slack] Edited message ${messageTs} in ${channelId}`);
      return { success: true };
    }

    return { success: false, error: "Edit action not available" };
  } catch (err: any) {
    api.logger.error(`[Slack] Failed to edit: ${err.message}`);
    return { success: false, error: err.message };
  }
}

export async function slackMarkAsDone(
  api: OpenClawPluginApi,
  channelId: string,
  messageTs: string,
): Promise<{ success: boolean; error?: string }> {
  return slackReactToMessage(api, channelId, messageTs, "white_check_mark");
}

export async function slackGetStatus(): Promise<{
  configured: boolean;
  channels?: string[];
}> {
  return { configured: false };
}
