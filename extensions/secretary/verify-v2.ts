import { createOrchestratorTool } from "./src/orchestrator.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifyV2() {
  console.log("🚀 Starting ClawSecretary v2 Verification...\n");

  const workspacePath = path.resolve(__dirname, "../../workspace");
  const soulPath = path.join(workspacePath, "SOUL.md");
  const walPath = path.join(workspacePath, "SESSION-STATE.md");

  // 1. Check Workspace Integrity
  console.log("Checking workspace files:");
  console.log(`- SOUL.md exists: ${fs.existsSync(soulPath)}`);
  console.log(`- SESSION-STATE.md exists: ${fs.existsSync(walPath)}`);

  // 2. Test Orchestrator Setup Status
  const orchestrator = createOrchestratorTool({
    resolvePath: (p: string) => path.join(__dirname, p),
    log: (msg) => console.log(`[LOG] ${msg}`),
    error: (msg) => console.error(`[ERR] ${msg}`),
  } as any);

  console.log("\nTesting 'setup_status' action:");
  const result = await (orchestrator as any).execute("test-run", { action: "setup_status" });
  console.log(result.content[0].text);

  // 3. Simulate WAL Update logic (conceptual)
  console.log("\nSimulating WAL Protocol update...");
  const walContent = fs.readFileSync(walPath, "utf-8");
  if (walContent.includes("READY")) {
    console.log("✅ WAL state is correct.");
  }

  console.log("\n--- Verification Complete ---");
}

verifyV2().catch(console.error);
