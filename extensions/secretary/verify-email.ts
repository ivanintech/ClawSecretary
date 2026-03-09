import { SecretaryOrchestrator } from './src/orchestrator.js';
import * as path from "node:path";

async function verifyEmailPhase() {
    // Mock API for testing
    const mockApi = {
        resolvePath: (p: string) => path.join(process.cwd(), "extensions/secretary", p),
        log: (msg: string) => console.log(`[LOG] ${msg}`),
        error: (msg: string) => console.error(`[ERR] ${msg}`),
    } as any;
    
    const orchestrator = new SecretaryOrchestrator(mockApi);
    
    console.log("🧪 Verificando Phase 8: Email Concierge...");
    
    // Mock environment for verification
    process.env.MATON_API_KEY = "mock_key";
    
    // @ts-ignore
    const result = await orchestrator.execute({ action: "email_concierge" }, { runId: "test-run" });
    
    const text = result.content[0].text;
    
    if (text.includes("ACCIÓN REQUERIDA")) {
        console.log("✅ Triage critico detectado y formateado correctamente.");
    } else {
        console.error("❌ Fallo en el triaje de correo.");
        process.exit(1);
    }

    if (text.includes("[REVISAR BORRADOR]")) {
        console.log("✅ Botones interactivos incluidos en el briefing.");
    }

    console.log("\n--- Resumen del Triage Simulado ---");
    console.log(text);
    console.log("----------------------------------");
}

verifyEmailPhase().catch(console.error);
