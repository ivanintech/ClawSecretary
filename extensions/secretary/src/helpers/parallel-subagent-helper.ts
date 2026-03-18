import type { OpenClawPluginApi } from "../../../../src/plugins/types.js";

export type ParallelSubagentTask = {
  message: string;
  sessionKey?: string;
  extraSystemPrompt?: string;
  provider?: string;
  model?: string;
  lane?: string;
  deliver?: boolean;
  idempotencyKey?: string;
};

export type ParallelSubagentResult = {
  runId: string;
  sessionKey: string;
  success: boolean;
  error?: string;
  messages: unknown[];
};

/**
 * Execute multiple subagent tasks in parallel and collect all results.
 * Ideal for concurrent operations like:
 * - Briefing + calendar sync
 * - Multiple email analysis
 * - Parallel topic research
 * - Multiple document processing
 */
export async function executeParallelSubagents(
  api: OpenClawPluginApi,
  tasks: ParallelSubagentTask[],
): Promise<ParallelSubagentResult[]> {
  if (tasks.length === 0) {
    return [];
  }

  api.logger.info(`[ParallelSubagent] 🚀 Starting ${tasks.length} parallel subagents`);

  const startTime = Date.now();

  // Step 1: Launch all subagents concurrently
  const launchPromises = tasks.map((task, index) =>
    launchSubagent(api, task, index),
  );

  try {
    const results = await Promise.all(launchPromises);
    
    // Step 2: Wait for all runs to complete
    const completionPromises = results.map((result) =>
      waitSubagent(api, result.runId),
    );

    const completions = await Promise.all(completionPromises);

    // Step 3: Gather messages from all sessions
    const messagePromises = results.map((result) =>
      getSessionMessages(api, result.sessionKey),
    );

    const allMessages = await Promise.all(messagePromises);

    const finalResults: ParallelSubagentResult[] = results.map(
      (result, index) => ({
        runId: result.runId,
        sessionKey: result.sessionKey,
        success: completions[index].status === "ok",
        error: completions[index].error,
        messages: allMessages[index],
      }),
    );

    const successfulCount = finalResults.filter((r) => r.success).length;
    const duration = Date.now() - startTime;

    api.logger.info(
      `[ParallelSubagent] ✅ Completed: ${successfulCount}/${tasks.length} in ${duration}ms`,
    );

    return finalResults;
  } catch (error) {
    const duration = Date.now() - startTime;
    api.logger.error(
      `[ParallelSubagent] ❌ Failed after ${duration}ms: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
}

async function launchSubagent(
  api: OpenClawPluginApi,
  task: ParallelSubagentTask,
  index: number,
): Promise<{ runId: string; sessionKey: string }> {
  const sessionKey = task.sessionKey ?? `secretary-parallel-${index}`;
  
  try {
    api.logger.info(`[ParallelSubagent] 🎯 Launching agent ${index + 1}: ${task.message.slice(0, 50)}...`);
    
    const result = await api.runtime.subagent.run({
      sessionKey,
      message: task.message,
      extraSystemPrompt: task.extraSystemPrompt,
      provider: task.provider,
      model: task.model,
      lane: task.lane,
      deliver: task.deliver ?? false, // Internal process by default
      idempotencyKey: task.idempotencyKey,
    });

    return { runId: result.runId, sessionKey };
  } catch (error) {
    api.logger.error(`[ParallelSubagent] ❌ Failed to launch agent ${index + 1}: ${error}`);
    throw error;
  }
}

async function waitSubagent(
  api: OpenClawPluginApi,
  runId: string,
): Promise<{ status: "ok" | "error" | "timeout"; error?: string }> {
  try {
    // Default timeout: 2 minutes
    const result = await api.runtime.subagent.waitForRun({
      runId,
      timeoutMs: 120_000,
    });
    return result;
  } catch (error) {
    api.logger.error(`[ParallelSubagent] ❌ Wait failed for ${runId}: ${error}`);
    return { status: "error", error: String(error) };
  }
}

async function getSessionMessages(
  api: OpenClawPluginApi,
  sessionKey: string,
): Promise<unknown[]> {
  try {
    const result = await api.runtime.subagent.getSessionMessages({
      sessionKey,
      limit: 50,
    });
    return result.messages;
  } catch (error) {
    api.logger.warn(
      `[ParallelSubagent] ⚠️ Failed to retrieve messages for ${sessionKey}: ${error}`,
    );
    return [];
  }
}

/**
 * Utility: Execute a single subagent with timeout and result extraction
 */
export async function executeSingleSubagent(
  api: OpenClawPluginApi,
  task: ParallelSubagentTask,
): Promise<{ runId: string; success: boolean; messages: unknown[] }> {
  const result = await executeParallelSubagents(api, [task]);
  return {
    runId: result[0]?.runId ?? "",
    success: result[0]?.success ?? false,
    messages: result[0]?.messages ?? [],
  };
}

/**
 * Utility: Create standard parallel tasks for common Secretary scenarios
 */
export const ParallelScenarios = {
  /**
   * Briefing + Calendar Sync scenario
   */
  briefingAndCalendarSync: (): ParallelSubagentTask[] => [
    {
      message: "Generate a comprehensive briefing for the user. Include calendar events summary, urgent tasks, recommendations.",
      sessionKey: "secretary-briefing",
      extraSystemPrompt: "You are an executive assistant. Provide clear, actionable insights. Focus on the immediate day and upcoming priorities.",
    },
    {
      message: "Sync and validate calendar events. Check for conflicts, prepare upcoming meeting details.",
      sessionKey: "secretary-calendar-sync",
      extraSystemPrompt: "You are a calendar specialist. Ensure all events are properly synchronized and prepare context for upcoming meetings.",
    },
  ],

  /**
   * Multi-email analysis scenario
   */
  analyzeMultipleEmails: (emailSummaries: string[]): ParallelSubagentTask[] =>
    emailSummaries.map((summary, index) => ({
      message: `Analyze this email: ${summary}\n\nProvide: 1) Priority level, 2) Action required, 3) Key takeaways, 4) Response needed within 24h?`,
      sessionKey: `secretary-email-analysis-${index}`,
      extraSystemPrompt: "You are an email triage specialist. Be concise and actionable.",
    })),

  /**
   * Parallel research scenario
   */
  parallelResearch: (topics: string[]): ParallelSubagentTask[] =>
    topics.map((topic) => ({
      message: `Research the following topic: ${topic}\n\nProvide comprehensive, factual information with sources.`,
      sessionKey: `secretary-research-${topic.replace(/\s+/g, "-").toLowerCase()}`,
      extraSystemPrompt: "You are a research assistant. Focus on accuracy and provide citations when possible.",
    })),
};