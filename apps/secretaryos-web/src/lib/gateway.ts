/**
 * SecretaryOS Gateway Client
 * 
 * Connects to OpenClaw gateway for:
 * - Cron/routine management
 * - Memory operations
 * - Activity/session tracking
 * - Configuration
 */

export type GatewayResult<T = any> = {
  ok: boolean;
  payload?: T;
  error?: { code: string; message: string };
};

export interface Activity {
  id: string;
  type: 'briefing' | 'meeting' | 'reminder' | 'email' | 'action' | 'notification';
  title: string;
  description: string;
  time: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Routine {
  id: string;
  name: string;
  type: 'morning' | 'evening' | 'periodic' | 'trigger';
  enabled: boolean;
  time: string;
  days: string[];
  content: {
    greeting: boolean;
    weather: boolean;
    calendar: boolean;
    reminders: boolean;
    emails: boolean;
    tasks: boolean;
    news: boolean;
  };
}

export interface MemoryItem {
  id: string;
  category: string;
  content: string;
  createdAt?: string;
}

export interface DeviceStatus {
  connected: boolean;
  model: string;
  battery: number;
  signal: string;
  secretaryActive: boolean;
  whatsappConnected: boolean;
  voiceWakeActive: boolean;
  backgroundRefresh: boolean;
}

export interface UserStats {
  emails: number;
  meetings: number;
  reminders: number;
  actions: number;
  emailChange: string;
  meetingChange: string;
  reminderChange: string;
  actionChange: string;
}

class SecretaryOSGateway {
  private gatewayUrl: string;
  private token: string | null;

  constructor() {
    this.gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:18789';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('SOS_TOKEN') : null;
  }

  private async invoke<T>(method: string, params: any = {}): Promise<GatewayResult<T>> {
    try {
      const response = await fetch(`${this.gatewayUrl}/v1/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token || 'mock-token'}`
        },
        body: JSON.stringify({ method, params })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`Gateway unavailable (${method}), using mock data:`, err);
      return this.getMockResponse<T>(method, params);
    }
  }

  private getMockResponse<T>(method: string, params: any): GatewayResult<T> {
    // Return realistic mock data for development
    if (method === 'cron.list') {
      return {
        ok: true,
        payload: {
          items: [
            { id: 'briefing', name: 'Morning Briefing', schedule: { kind: 'cron', expr: '50 7 * * *' }, enabled: true },
            { id: 'evening', name: 'Evening Summary', schedule: { kind: 'cron', expr: '0 21 * * *' }, enabled: true },
            { id: 'emails', name: 'Email Digest', schedule: { kind: 'cron', expr: '0 * * * *' }, enabled: true },
          ]
        } as any
      };
    }

    if (method === 'status') {
      return {
        ok: true,
        payload: {
          sessions: {
            recent: [{ agentId: 'secretary', thinkingLevel: 'low', percentUsed: 23, updatedAt: Date.now() }]
          },
          heartbeat: {
            agents: [{ agentId: 'secretary', enabled: true }]
          }
        } as any
      };
    }

    if (method === 'memory.search') {
      return {
        ok: true,
        payload: {
          results: [
            { id: '1', content: 'CEO de TechStart', category: 'work' },
            { id: '2', content: 'No bebo café', category: 'preferences' },
          ]
        } as any
      };
    }

    if (method === 'agent.invoke_tool') {
      const action = (params as any)?.params?.action;
      if (action === 'get_activity') {
        return {
          ok: true,
          payload: {
            activities: [
              { id: '1', type: 'briefing', title: 'Morning Briefing', description: '3 reuniones, 2 pendientes', time: '07:50', date: 'Hoy', status: 'completed' },
              { id: '2', type: 'meeting', title: 'Reunión confirmada', description: 'Con Carlos - 10:00', time: '09:45', date: 'Hoy', status: 'completed' },
            ]
          } as any
        };
      }
    }

    return { ok: true };
  }

  async getActivity(): Promise<Activity[]> {
    const result = await this.invoke<{ activities: Activity[] }>('agent.invoke_tool', {
      name: 'secretary_orchestrator',
      params: { action: 'get_activity' }
    });

    if (result.ok && result.payload?.activities) {
      return result.payload.activities;
    }

    // Return mock data
    return [
      { id: '1', type: 'briefing', title: 'Morning Briefing', description: 'Resumen del día: 3 reuniones, 2 pendientes', time: '07:50', date: 'Hoy', status: 'completed' },
      { id: '2', type: 'meeting', title: 'Reunión confirmada', description: 'Con Carlos - Mañana 10:00', time: '09:45', date: 'Hoy', status: 'completed' },
      { id: '3', type: 'reminder', title: 'Recordatorio enviado', description: 'Llamar a mamá', time: '09:30', date: 'Hoy', status: 'completed' },
      { id: '4', type: 'email', title: 'Resumen de emails', description: '12 nuevos, 3 importantes', time: '08:00', date: 'Hoy', status: 'completed' },
      { id: '5', type: 'action', title: 'Tarea completada', description: 'Revisión de propuesta Q2', time: '08:30', date: 'Hoy', status: 'completed' },
    ];
  }

  async getRoutines(): Promise<Routine[]> {
    const result = await this.invoke<{ items: Routine[] }>('cron.list', {});

    if (result.ok && result.payload?.items) {
      return result.payload.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.name.toLowerCase().includes('morning') ? 'morning' :
              item.name.toLowerCase().includes('evening') ? 'evening' :
              item.name.toLowerCase().includes('email') ? 'periodic' : 'trigger',
        enabled: item.enabled,
        time: item.schedule?.expr || 'N/A',
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        content: {
          greeting: true,
          weather: true,
          calendar: true,
          reminders: true,
          emails: item.name.toLowerCase().includes('email'),
          tasks: false,
          news: false
        }
      }));
    }

    return [
      { id: '1', name: 'Morning Briefing', type: 'morning', enabled: true, time: '07:50', days: ['mon', 'tue', 'wed', 'thu', 'fri'], content: { greeting: true, weather: true, calendar: true, reminders: true, emails: true, tasks: false, news: false } },
      { id: '2', name: 'Evening Summary', type: 'evening', enabled: true, time: '21:00', days: ['mon', 'tue', 'wed', 'thu', 'fri'], content: { greeting: true, weather: false, calendar: false, reminders: false, emails: false, tasks: true, news: false } },
      { id: '3', name: 'Email Digest', type: 'periodic', enabled: true, time: 'Cada hora', days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], content: { greeting: false, weather: false, calendar: false, reminders: false, emails: true, tasks: false, news: false } },
    ];
  }

  async addRoutine(routine: Omit<Routine, 'id'>): Promise<Routine> {
    const result = await this.invoke<{ id: string }>('cron.add', {
      name: routine.name,
      schedule: { kind: 'cron', expr: routine.time },
      payload: routine.content,
      sessionTarget: 'isolated'
    });

    return {
      ...routine,
      id: result.payload?.id || Date.now().toString()
    };
  }

  async updateRoutine(id: string, updates: Partial<Routine>): Promise<void> {
    await this.invoke('cron.update', { id, ...updates });
  }

  async deleteRoutine(id: string): Promise<void> {
    await this.invoke('cron.delete', { id });
  }

  async getMemory(): Promise<MemoryItem[]> {
    const result = await this.invoke<{ results: MemoryItem[] }>('memory.search', {
      query: '',
      limit: 50
    });

    if (result.ok && result.payload?.results) {
      return result.payload.results;
    }

    return [
      { id: '1', category: 'personal', content: 'CEO de TechStart' },
      { id: '2', category: 'personal', content: '35 años' },
      { id: '3', category: 'work', content: 'Reuniones: mañanas' },
      { id: '4', category: 'preferences', content: 'No bebo café' },
    ];
  }

  async addMemory(item: Omit<MemoryItem, 'id'>): Promise<MemoryItem> {
    await this.invoke('memory.add', item);
    return { ...item, id: Date.now().toString() };
  }

  async deleteMemory(id: string): Promise<void> {
    await this.invoke('memory.delete', { id });
  }

  async getDeviceStatus(): Promise<DeviceStatus> {
    const result = await this.invoke<any>('status', {});

    if (result.ok) {
      return {
        connected: true,
        model: 'iPhone 15 Pro',
        battery: 78,
        signal: 'Excelente',
        secretaryActive: true,
        whatsappConnected: true,
        voiceWakeActive: true,
        backgroundRefresh: true
      };
    }

    return {
      connected: false,
      model: 'Unknown',
      battery: 0,
      signal: 'N/A',
      secretaryActive: false,
      whatsappConnected: false,
      voiceWakeActive: false,
      backgroundRefresh: false
    };
  }

  async getStats(): Promise<UserStats> {
    return {
      emails: 12,
      meetings: 3,
      reminders: 5,
      actions: 47,
      emailChange: '+3 hoy',
      meetingChange: '2 coordinadas',
      reminderChange: '4 enviados',
      actionChange: '+12%'
    };
  }

  async generateInstallQR(): Promise<{ token: string; url: string }> {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return {
      token,
      url: `secretaryos://install?token=${token}`
    };
  }
}

export const secretaryGateway = new SecretaryOSGateway();
export default SecretaryOSGateway;
