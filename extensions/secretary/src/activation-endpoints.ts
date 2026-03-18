import type { IncomingMessage, ServerResponse } from "node:http";
import type { OpenClawPluginApi } from "../../../src/plugins/types.js";
import {
  createAutoActivator,
  handleActivationStart,
  handleActivationComplete
} from "./auto-activator.js";

/**
 * Sistema de Endpoints HTTP para Activación Automática
 * Zero Configuration - Token-less, API Key-less Setup
 */

/**
 * Endpoint: GET /plugins/secretary/activate/info
 * Propósito: Información del sistema de activación (para panel de control)
 * Auth: plugin endpoint (verificado automáticamente por OpenClaw)
 */
export function createActivationInfoHandler(api: OpenClawPluginApi) {
  return async (_req: IncomingMessage, res: ServerResponse) => {
    try {
      const activator = createAutoActivator(api);
      const status = await activator.getActivationStatus();

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: true,
        system: "ClawSecretary Auto-Activator",
        version: "1.0.0",
        status: {
          active_sessions: status.activeSessions,
          paired_devices: status.totalDevices,
          last_activation: status.lastActivation
        },
        capabilities: [
          "zero_configuration",
          "whatsapp_auto_setup",
          "oauth_auto_provisioning",
          "local_privacy",
          "mobile_first"
        ],
        requirements: {
          openclaw_gateway: "running",
          whatsapp_channel: "optional_but_recommended"
        }
      }));
      return true;
    } catch (error) {
      console.error("[ActivationInfo] Error:", error);

      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: false,
        error: "Failed to retrieve activation information"
      }));
      return false;
    }
  };
}

/**
 * Endpoint: POST /plugins/secretary/activate/start
 * Propósito: Iniciar nueva sesión de activación (generar código de emparejamiento)
 * Auth: plugin endpoint (público para iniciales/new-users)
 */
export function createActivationStartHandler(api: OpenClawPluginApi) {
  return async (_req: IncomingMessage, res: ServerResponse) => {
    try {
      const activator = createAutoActivator(api);
      const activation = await activator.generateActivationLink();

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: true,
        activation: {
          session_id: activation.sessionId,
          pair_code: activation.pairCode,
          activation_url: activation.qrLink,
          expires_in: "10 minutes",
          instructions: activation.instructions
        },
        next_step: "User should scan QR or visit activation_url",
        user_facing_message: `Tu código: ${activation.pairCode}. Válido por 10 minutos.`
      }));
      return true;
    } catch (error) {
      console.error("[ActivationStart] Error:", error);

      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: false,
        error: "Failed to generate activation code",
        user_facing_message: "Hubo un error generando tu código. Intenta nuevamente."
      }));
      return false;
    }
  };
}

/**
 * Endpoint: POST /plugins/secretary/activate/pair
 * Propósito: Completar emparejamiento de dispositivo
 * Auth: plugin endpoint (verificado por código de emparejamiento, no auth header)
 */
export function createActivationPairHandler(api: OpenClawPluginApi) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      // Parse request body
      const body = await parseJsonBody(req);

      if (!body.session_id || !body.pair_code || !body.device_info) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: false,
          error: "Missing required fields: session_id, pair_code, device_info"
        }));
        return false;
      }

      // Validate and complete pairing
      const result = await handleActivationComplete(
        api,
        body.session_id,
        body.pair_code,
        body.device_info
      );

      if (!result.success) {
        res.statusCode = 400;  // Bad request for invalid codes
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: false,
          error: result.error,
          user_facing_message: "Código inválido o expirado. Intenta generar uno nuevo."
        }));
        return false;
      }

      // Success response con instrucciones de bienvenida
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: true,
        pairing: {
          pairing_id: result.pairingId,
          device_name: result.deviceName,
          paired_at: new Date().toISOString()
        },
        welcome_instructions: result.instructions,
        next_steps: [
          "1. Abre tu panel de control: https://127.0.0.1:18789",
          "2. Ve a Channels → WhatsApp → Conecta tu cuenta",
          "3. ¡Listo! Recibirás respuestas automáticas"
        ],
        user_facing_message: "¡Emparejamiento exitoso! Tu Secretary está listo."
      }));
      return true;
    } catch (error) {
      console.error("[ActivationPair] Error:", error);

      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: false,
        error: "Failed to complete device pairing",
        user_facing_message: "Hubo un error en el emparejamiento. Intenta nuevamente."
      }));
      return false;
    }
  };
}

/**
 * Endpoint: POST /plugins/secretary/activate/verify
 * Propósito: Verificar si un código de emparejamiento es válido (sin modificar estado)
 * Auth: plugin endpoint
 */
export function createActivationVerifyHandler(api: OpenClawPluginApi) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const body = await parseJsonBody(req);

      if (!body.session_id || !body.pair_code) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: false,
          error: "Missing session_id or pair_code"
        }));
        return false;
      }

      // Verify session without changing state
      const result = await handleActivationStart(api, body.session_id, body.pair_code);

      if (!result.success || !result.session) {
        res.statusCode = 200;  // Still return 200, just indicate invalid
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: false,
          valid: false,
          message: "Session not found or invalid pairing code"
        }));
        return true;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: true,
        valid: true,
        session: {
          session_id: result.session.sessionId,
          pair_code: result.session.pairCode,
          status: result.session.status,
          expires_at: new Date(
            new Date(result.session.createdAt).getTime() + 10 * 60 * 1000
          ).toISOString()
        }
      }));
      return true;
    } catch (error) {
      console.error("[ActivationVerify] Error:", error);

      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: false,
        error: "Failed to verify activation code"
      }));
      return false;
    }
  };
}

/**
 * Helper: Parse JSON body from HTTP request
 */
function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Endpoint: GET /plugins/secretary/activate/status/:sessionId
 * Propósito: Obtener estado de una sesión específica
 * Auth: plugin endpoint
 */
export function createActivationStatusHandler(api: OpenClawPluginApi) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      // Extraer sessionId del path
      const urlParts = req.url?.split("/");
      const sessionId = urlParts?.[urlParts.length - 1];

      if (!sessionId) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: false,
          error: "Missing session_id in path"
        }));
        return false;
      }

      // Verificar sesión sin cambiar estado
      const result = await handleActivationStart(api, sessionId, "");  // pair_code vacío para verificar solo

      if (!result.success) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: false,
          session_found: false,
          message: "Session not found or expired"
        }));
        return true;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: true,
        session_found: true,
        session: {
          session_id: sessionId,
          status: result.session?.status,
          created_at: result.session?.createdAt,
          expires_at: new Date(
            new Date(result.session?.createdAt || Date.now()).getTime() + 10 * 60 * 1000
          ).toISOString()
        }
      }));
      return true;
    } catch (error) {
      console.error("[ActivationStatus] Error:", error);

      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: false,
        error: "Failed to retrieve session status"
      }));
      return false;
    }
  };
}

/**
 * Endpoint: POST /plugins/secretary/activate/whatsapp-connect
 * Propósito: Solicitar conexión de WhatsApp (trigger flujo nativo de OpenClaw)
 * Auth: plugin endpoint
 */
export function createWhatsAppConnectHandler(api: OpenClawPluginApi) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const body = await parseJsonBody(req);

      // Verificar si WhatsApp ya está configurado
      const whatsAppConfig = api.config.channels?.whatsapp;

      if (whatsAppConfig && whatsAppConfig.enabled) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: true,
          already_configured: true,
          message: "WhatsApp ya está configurado en tu sistema"
        }));
        return true;
      }

      // Recuerda: OpenClaw no puede iniciar conexión WhatsApp por sí solo
      // El usuario debe hacerlo via Control Panel o CLI
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: true,
        action_required: true,
        instructions: {
          step1: "Abre tu panel de control: https://127.0.0.1:18789",
          step2: "Ve a Channels → WhatsApp",
          step3: "Sigue los pasos de conexión con tu teléfono",
          step4: "Escanea el QR que aparecerá",
          alternative: "También puedes usar: openclaw channels configure whatsapp"
        },
        user_facing_message: "Por favor, configura WhatsApp en tu Control Panel para recibir respuestas automáticas."
      }));
      return true;
    } catch (error) {
      console.error("[WhatsAppConnect] Error:", error);

      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: false,
        error: "Failed to request WhatsApp connection"
      }));
      return false;
    }
  };
}

/**
 * Endpoint: POST /plugins/secretary/activate/oauth/:provider
 * Propósito: Iniciar flujo OAuth para servicios (Google, Notion, etc.)
 * Auth: plugin endpoint
 */
export function createOAuthProviderHandler(api: OpenClawPluginApi) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const urlParts = req.url?.split("/");
      const provider = urlParts?.[urlParts.length - 1] || urlParts?.[4];  // /activate/oauth/:provider

      if (!provider) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: false,
          error: "Missing provider in path"
        }));
        return false;
      }

      // Verificar si el provider ya está configurado en auth-profiles
      const cfg = api.config;
      const authProfiles = cfg.auth?.profiles || {};
      const isProviderConfigured = Object.keys(authProfiles).some(key =>
        key.toLowerCase().includes(provider.toLowerCase())
      );

      if (isProviderConfigured) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
          success: true,
          already_configured: true,
          provider,
          message: `${provider} ya está configurado en tu sistema`
        }));
        return true;
      }

      // Generar instrucciones para configurar OAuth via CLI
      const authCommands: Record<string, string> = {
        google: "openclaw agents add default --auth-choice google-gemini-cli",
        "google-gmail": "openclaw agents add default --auth-choice google-gemini-cli",
        "google-calendar": "openclaw agents add default --auth-choice google-gemini-cli",
        "notion": "openclaw agents add default --auth-choice token --provider notion",
        "outlook": "openclaw agents add default --auth-choice microsoft",
        "microsoft": "openclaw agents add default --auth-choice microsoft",
        "calendly": "openclaw agents add default --auth-choice token --provider calendly"
      };

      const command = authCommands[provider] || `# openclaw agents add default --auth-choice ${provider}`;

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: true,
        provider,
        requires_setup: true,
        instructions: {
          command: command,
          steps: [
            "1. Ejecuta el comando arriba en tu terminal",
            "2. Sigue el flujo OAuth interactivo",
            "3. El sistema detectará automáticamente las credenciales",
            "4. ¡Secretary usará tus servicios sin configuración extra!"
          ],
          alternative: `También puedes configurarlo vía Control Panel → Agents → Add Auth`
        },
        user_facing_message: `Para conectar ${provider}, ejecuta el comando de configuración OAuth`
      }));
      return true;
    } catch (error) {
      console.error("[OAuthProvider] Error:", error);

      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: false,
        error: "Failed to retrieve OAuth instructions"
      }));
      return false;
    }
  };
}