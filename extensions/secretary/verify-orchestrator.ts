import { createOrchestratorTool } from "./src/orchestrator.js";
import { CalendarStore } from "./src/store.js";
import * as path from "node:path";
import * as fs from "node:fs";

// Mock API
const mockApi = {
  resolvePath: (p: string) => path.join(process.cwd(), "extensions/secretary", p),
};

async function runTest() {
  console.log("🚀 Testing Secretary Orchestrator...");

  // 1. Setup Data
  const dataDir = path.join(process.cwd(), "extensions/secretary/data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const store = new CalendarStore(dataDir);
  await store.save([
    {
      id: "test-1",
      title: "Reunión de Sincronización",
      startTime: new Date().toISOString().split('T')[0] + "T10:00:00.000Z",
      endTime: new Date().toISOString().split('T')[0] + "T11:00:00.000Z",
    }
  ]);

  const tool = createOrchestratorTool(mockApi as any);

  // 2. Test Briefing
  console.log("\n--- Testing Briefing ---");
  const briefing = await tool.execute("test-run", { action: "briefing" });
  console.log(briefing.content[0].text);

  // 3. Test Conflict Guardian
  console.log("\n--- Testing Conflict Guardian ---");
  const conflict = await tool.execute("test-run", { 
    action: "conflict_guardian",
    startTime: new Date().toISOString().split('T')[0] + "T10:30:00.000Z",
    endTime: new Date().toISOString().split('T')[0] + "T11:30:00.000Z",
  });
  console.log(conflict.content[0].text);

  // 4. Test Proactive Setup
  console.log("\n--- Testing Setup Proactive ---");
  const setup = await tool.execute("test-run", { action: "setup_proactive" });
  console.log(setup.content[0].text);

  console.log("\n✅ Verification Complete!");
}

runTest().catch(console.error);
