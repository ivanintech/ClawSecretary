import { AutoAuthOrchestrator } from "./orchestrator.js";
import { defaultRuntime } from "../runtime.js";
import path from "node:path";
import fs from "node:fs";

/**
 * E2E Simulation of the ClawSecretary "Plug and Play" Onboarding.
 */
async function simulate() {
  const runtime = defaultRuntime;
  const orchestrator = new AutoAuthOrchestrator(runtime);
  const tempWorkspace = path.join(process.cwd(), "tmp_simulation_workspace");
  
  if (!fs.existsSync(tempWorkspace)) {
    fs.mkdirSync(tempWorkspace, { recursive: true });
  }

  runtime.log("--- 🏁 Inicia Simulación ClawSecretary SaaS ---");

  // 1. Dashboard: Generar Link Mágico
  const setupToken = "magic_onboarding_2026";
  const magicLink = orchestrator.generateMagicLink(setupToken);
  runtime.log(`[DASHBOARD] Link Mágico generado: ${magicLink}`);

  // 2. Usuario: Hace clic y vincula Google Calendar
  const googleToken = await orchestrator.captureToken({
    provider: "google",
    code: "mock_auth_code_from_redirect",
    setupToken,
  });
  runtime.log(`[SAAS BRIDGE] Token de Google capturado: ${googleToken}`);

  // 4. Inyección de Perfiles OAuth (Zero-Touch)
  const mockProfiles = {
    "google:default": {
      type: "oauth",
      provider: "google",
      accessToken: "mock_access_token",
      refreshToken: "mock_refresh_token",
      email: "user@example.com"
    },
    "microsoft:default": {
      type: "oauth",
      provider: "microsoft",
      accessToken: "mock_ms_token",
      email: "user@outlook.com"
    }
  };
  const profilesBase64 = Buffer.from(JSON.stringify(mockProfiles)).toString("base64");
  runtime.log(`[SAAS BRIDGE] Perfiles OAuth preparados (Base64): ${profilesBase64.substring(0, 20)}...`);

  // 5. Agente: Ejecutar Onboarding Headless (Simulado)
  runtime.log(`[AGENT] Ejecutando: openclaw onboard --non-interactive --saas-token ${setupToken} --install-skill secretary --cloud-profiles ${profilesBase64.substring(0, 10)}...`);
  
  await orchestrator.injectCloudProfiles(mockProfiles as any);
  
  runtime.log("--- ✅ Simulación Completada Exitosamente ---");
  runtime.log("El agente ya está configurado y funcionando de forma autónoma.");
  
  // Clean up
  fs.rmSync(tempWorkspace, { recursive: true, force: true });
}

simulate().catch(console.error);
