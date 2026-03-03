import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import { upsertAuthProfile } from "../agents/auth-profiles.js";
import { resolveOpenClawAgentDir } from "../agents/agent-paths.js";
import type { AuthProfileCredential } from "../agents/auth-profiles/types.js";

/**
 * AutoAuthOrchestrator bridges the gap between SaaS OAuth and the local agent.
 * It handles token capture from the SaaS redirect and pushes it to the agent.
 */
export class AutoAuthOrchestrator {
  constructor(
    private readonly runtime: RuntimeEnv,
    private readonly saasBaseUrl: string = "https://saas.openclaw.ai",
  ) {}

  /**
   * Generates a Magic Link for the user to initiate onboarding.
   */
  public generateMagicLink(setupToken: string): string {
    return `${this.saasBaseUrl}/setup?token=${setupToken}`;
  }

  /**
   * Simulates capturing an OAuth token from a redirect.
   * In a real SaaS, this would be an HTTP handler.
   */
  public async captureToken(params: {
    provider: "google" | "microsoft";
    code: string;
    setupToken: string;
  }): Promise<string> {
    this.runtime.log(`Capturing ${params.provider} token for setup ${params.setupToken}...`);
    
    // Simulate SaaS-side token exchange
    const mockToken = `saas_captured_${params.provider}_${Date.now()}`;
    
    return mockToken;
  }

  /**
   * Securely injects a captured token into the agent's configuration.
   */
  public async injectCredential(params: {
    config: OpenClawConfig;
    token: string;
    target: "google_calendar" | "outlook";
  }): Promise<OpenClawConfig> {
    this.runtime.log(`Injecting ${params.target} credential into agent config...`);
    
    const next = { ...params.config };
    if (params.target === "google_calendar") {
      // Mock injection logic
      next.skills = {
        ...next.skills,
        entries: {
          ...next.skills?.entries,
          "google-calendar": {
            ...(next.skills?.entries?.["google-calendar"] as any),
            apiKey: params.token,
          }
        }
      };
    }
    
    return next;
  }

  /**
   * Inyecta múltiples perfiles de autenticación (OAuth/API Key) directamente en el almacén del agente.
   * Esto permite que las skills funcionen inmediatamente sin intervención del usuario.
   */
  public async injectCloudProfiles(profiles: Record<string, AuthProfileCredential>): Promise<void> {
    const agentDir = resolveOpenClawAgentDir();
    this.runtime.log(`Inyectando ${Object.keys(profiles).length} perfiles desde el Cloud en ${agentDir}...`);

    for (const [profileId, credential] of Object.entries(profiles)) {
      try {
        upsertAuthProfile({
          profileId,
          credential,
          agentDir,
        });
        this.runtime.log(`  - Perfil inyectado: ${profileId}`);
      } catch (err) {
        this.runtime.log(`Error inyectando perfil ${profileId}: ${(err as Error).message}`);
      }
    }
  }
}
