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
    this.baseUrl = `http://localhost:${port}/v1`;
  }

  /**
   * Directly invokes a gateway method via HTTP (simulating the JSON-RPC over WS/HTTP)
   */
  private async invoke<T>(method: string, params: any = {}): Promise<GatewayResult<T>> {
    try {
      // Note: In real production, we'd use the proper JSON-RPC format
      // but for this dashboard simulation we'll use a simplified fetch
      const response = await fetch(`${this.baseUrl}/request`, {
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
}

export const gateway = new GatewayClient();
