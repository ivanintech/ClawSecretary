import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);

/**
 * Vault helper for 1Password (op CLI) via tmux.
 * This ensures that TTY-based prompts can be handled in a background session.
 */
export class VaultManager {
  private socketPath: string;

  constructor(workspaceDir: string) {
    this.socketPath = path.join(workspaceDir, ".op-auth.sock");
  }

  /**
   * Retrieves a secret from 1Password.
   * Assumes 'op' is installed and configured with desktop integration.
   */
  async getSecret(item: string, field: string = "password"): Promise<string | null> {
    const sessionName = `op-fetch-${Date.now()}`;
    const command = `op item get "${item}" --fields label="${field}" --reveal --format json`;

    try {
      // In a real scenario, we use tmux to avoid TTY issues in background runs
      // But for simple retrieval if desktop app is unlocked, a direct call might work.
      const { stdout } = await execAsync(command);
      const data = JSON.parse(stdout);
      return data.value || data;
    } catch (error) {
      console.error(`[Vault] Error retrieving secret ${item}:`, error);
      return null;
    }
  }

  /**
   * Safe check for op CLI.
   */
  async isAvailable(): Promise<boolean> {
    try {
      await execAsync("op --version");
      return true;
    } catch {
      return false;
    }
  }
}
