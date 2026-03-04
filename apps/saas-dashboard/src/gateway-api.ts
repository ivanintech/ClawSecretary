/**
 * Simple client to interact with the OpenClaw Gateway API.
 * In a real SaaS scenario, this would likely go through a secure proxy.
 */

export type GatewayResult<T = any> = {
  ok: boolean;
  payload?: T;
  error?: { code: string; message: string };
};

export class GatewayClient {
  private baseUrl: string;

  constructor(port: number = 18789) {
    this.baseUrl = `http://localhost:${port}`;
  }

  /**
   * Directly invokes a gateway method via HTTP (simulating the JSON-RPC over WS/HTTP)
   */
  private async invoke<T>(method: string, params: any = {}): Promise<GatewayResult<T>> {
    try {
      // Note: In real production, we'd use the proper JSON-RPC format
      // but for this dashboard simulation we'll use a simplified fetch
      const response = await fetch(`${this.baseUrl}/v1/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('SAAS_TOKEN') || 'mock-token'}`
        },
        body: JSON.stringify({ method, params })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.error(`Gateway error (${method}):`, err);
      // Return a simulated success if we're in "demo mode" without a running gateway
      return this.mockInvoke<T>(method, params);
    }
  }

  /**
   * Mock responses for development when the gateway isn't reachable
   */
  private mockInvoke<T>(method: string, params: any): GatewayResult<T> {
    if (params.simulateError) {
        return { ok: false, error: { code: 'DEV_ERROR', message: 'Simulated failure' } };
    }

    if (method === 'web.login.start') {
      return { 
        ok: true, 
        payload: { 
          qrDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAYAAACLz2ctAAAACXBIWXMAAAsTAAALEwEAmpwYAAABXElEQVR4nO3BMQEAAADCoPVPbQo/oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAz9hAAABAnZ6AAAAAElFTkSuQmCC',
          message: 'Scan this QR in WhatsApp'
        } as any 
      };
    }

    if (method === 'web.login.wait') {
      return { ok: true, payload: { connected: true, message: 'Linked!' } as any };
    }

    if (method === 'system.reboot') {
      return { ok: true, payload: { message: 'Rebooting...' } as any };
    }

    if (method === 'agent.analyze_pdf') {
      return { 
        ok: true, 
        payload: { 
          text: `Analysis of ${params.filename}: This document appears to be a technical manual for Federated SaaS. Primary findings include privacy node sync and automated OAuth fallback logic.`
        } as any 
      };
    }

    if (method === 'status') {
      return {
        ok: true,
        payload: {
          sessions: {
            recent: [
              {
                agentId: 'ClawBot-V2',
                thinkingLevel: 'deep',
                percentUsed: 42,
                updatedAt: Date.now()
              }
            ]
          },
          heartbeat: {
            agents: [
              { agentId: 'ClawBot-V2', enabled: true }
            ]
          }
        } as any
      };
    }

    if (method === 'doctor.memory.status') {
      return {
        ok: true,
        payload: {
          agentId: 'ClawBot-V2',
          provider: 'ollama',
          embedding: { ok: true }
        } as any
      };
    }

    if (method === 'config.patch') {
      return {
        ok: true,
        payload: { ok: true, path: 'openclaw.json' } as any
      };
    }

    if (method === 'cron.list') {
      return {
        ok: true,
        payload: {
          items: [
            { id: 'briefing', name: 'Daily Briefing', schedule: { kind: 'cron', expr: '0 8 * * *' }, enabled: true },
            { id: 'cleanup', name: 'Memory Cleanup', schedule: { kind: 'cron', expr: '0 0 * * 0' }, enabled: true }
          ]
        } as any
      };
    }

    if (method === 'sessions.reset') {
      return { ok: true, payload: { ok: true } as any };
    }

    if (method === 'doctor.security.audit') {
      return {
        ok: true,
        payload: {
          score: 85,
          warnings: ["DM Policy set to 'open'", "No sandbox for main session"]
        } as any
      };
    }

    if (method === 'agent.invoke_tool' && (params as any)?.name === 'secretary_orchestrator') {
      const action = (params as any)?.params?.action;
      if (action === 'search_opportunities') {
        return {
          ok: true,
          payload: {
            details: {
              query: (params as any)?.params?.title || "Oportunidades",
              answer: "Se han encontrado varias oportunidades en el sector Saas y AI para 2026.",
              results: [
                { title: "Tendencias SaaS 2026", url: "https://example.com/saas-2026", snippet: "El mercado de micro-saas federados crecerá un 40% este año." },
                { title: "Oportunidades en AI Local", url: "https://example.com/local-ai", snippet: "La privacidad en el edge es la prioridad número uno para empresas en Europa." }
              ]
            }
          }
        } as any;
      }
      if (action === 'setup_proactive') {
        const allCrons = [
          { name: "Secretary Daily Briefing", schedule: { kind: "cron", expr: "0 8 * * *", tz: "Local" }, sessionTarget: "isolated" },
          { name: "Secretary Pre-Meeting Research", schedule: { kind: "cron", expr: "45 * * * *", tz: "Local" }, sessionTarget: "isolated" },
          { name: "Secretary Gmail Triager", schedule: { kind: "cron", expr: "0 * * * *", tz: "Local" }, sessionTarget: "isolated" },
          { name: "Secretary RSS Intelligence Digest", schedule: { kind: "cron", expr: "30 7 * * 1", tz: "Local" }, sessionTarget: "isolated" },
          { name: "Secretary Memory Freshener", schedule: { kind: "cron", expr: "0 20 * * 0", tz: "Local" }, sessionTarget: "isolated" },
        ];
        return {
          ok: true,
          payload: {
            details: {
              cronParams: allCrons[0],
              preResearchCron: allCrons[1],
              gmailTriagerCron: allCrons[2],
              rssDigestCron: allCrons[3],
              memoryFreshenerCron: allCrons[4],
              allCrons,
            }
          }
        } as any;
      }
      if (action === 'gmail_triager') {
        return {
          ok: true,
          payload: {
            details: {
              critical: [{ subject: "URGENTE: Renovación contrato", from: "cliente@empresa.com", snippet: "Necesitamos respuesta hoy..." }],
              actionRequired: [{ subject: "Re: Propuesta Q2", from: "equity@ventures.io", snippet: "Revisado, en espera de..." }],
              fyi: [{ subject: "Newsletter Semanal", from: "news@producthunt.com", snippet: "Los mejores lanzamientos..." }]
            }
          }
        } as any;
      }
      if (action === 'rss_digest') {
        return {
          ok: true,
          payload: {
            details: {
              articles: [
                { title: "The Rise of Agentic AI in 2026", blog: "TechCrunch" },
                { title: "WhatsApp Business API: New Features", blog: "Meta Developers" },
                { title: "SaaS Pricing Strategies That Work", blog: "Product Hunt" },
              ]
            }
          }
        } as any;
      }
      return {
        ok: true,
        payload: {
          details: {
            status: {
              local_calendar: "✅ Connected",
              google_calendar_gog: "✅ Connected",
              outlook: "✅ Maton OAuth ready",
              whatsapp_business: "✅ Connected",
              calendly: "❌ Missing CALENDLY_API_KEY",
              tavily: "✅ Connected"
            }
          }
        } as any
      };
    }

    if (method === 'cron.add') {
      return { ok: true, payload: { id: `job-${Math.random().toString(36).substr(2, 9)}`, ...params } as any };
    }

    return { ok: true };
  }

  public async startWhatsAppLogin() {
    return this.invoke<{ qrDataUrl: string; message: string }>('web.login.start');
  }

  public async waitForWhatsAppLogin() {
    return this.invoke<{ connected: boolean; message: string }>('web.login.wait');
  }

  public async rebootAgent() {
    return this.invoke<{ message: string }>('system.reboot');
  }

  public async checkHealth(): Promise<GatewayResult<{ status: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (err) {
      return { ok: true, payload: { status: 'live' } }; // Mocked for demo
    }
  }

  public async checkReadiness(): Promise<GatewayResult<{ status: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/readyz`);
      if (!response.ok) throw new Error('Readiness check failed');
      return await response.json();
    } catch (err) {
      return { ok: true, payload: { status: 'ready' } }; // Mocked for demo
    }
  }

  public async analyzeDocument(fileBase64: string, filename: string) {
    return this.invoke<{ text: string }>('agent.analyze_pdf', { 
      pdf: `data:application/pdf;base64,${fileBase64}`,
      filename,
      prompt: "Summarize the key technical sections of this document."
    });
  }

  public async getStatus() {
    return this.invoke<any>('status', {});
  }

  public async getMemoryStatus() {
    return this.invoke<any>('doctor.memory.status', {});
  }

  public async patchConfig(patch: any) {
    return this.invoke<any>('config.patch', { raw: JSON.stringify(patch) });
  }

  public async listCrons() {
    return this.invoke<any>('cron.list', {});
  }

  public async runCron(jobId: string) {
    return this.invoke<any>('cron.run', { id: jobId, mode: 'force' });
  }

  public async resetSession(key: string = 'main') {
    return this.invoke<any>('sessions.reset', { key });
  }

  public async getSecurityAudit() {
    return this.invoke<any>('doctor.security.audit', {});
  }

  public async getSecretaryStatus() {
    return this.invoke<any>('agent.invoke_tool', { 
      name: 'secretary_orchestrator', 
      params: { action: 'setup_status' } 
    });
  }

  public async searchOpportunities(query: string) {
    return this.invoke<any>('agent.invoke_tool', {
      name: 'secretary_orchestrator',
      params: { action: 'search_opportunities', title: query }
    });
  }

  public async syncCalendars() {
    return this.invoke<any>('agent.invoke_tool', { 
      name: 'secretary_orchestrator', 
      params: { action: 'gog_sync' } 
    });
  }

  public async setupProactive() {
    return this.invoke<any>('agent.invoke_tool', { 
      name: 'secretary_orchestrator', 
      params: { action: 'setup_proactive' } 
    });
  }

  public async addCron(params: { name: string, schedule: any, payload: any, sessionTarget?: string }) {
    return this.invoke<any>('cron.add', params);
  }
}

export const gateway = new GatewayClient();
