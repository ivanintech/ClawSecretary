import { createOrchestratorTool } from "./src/orchestrator.js";
import { CalendarStore } from "./src/store.js";
import * as path from "node:path";
import * as fs from "node:fs";

// Mock API
const cwd = process.cwd();
const mockApi = {
  resolvePath: (p: string) => path.join(cwd, "extensions/secretary", p),
};

// Mock WorkspaceDir context (for WAL protocol testing)
const mockCtx = {
  workspaceDir: path.join(cwd, "workspace"),
};

async function runTest() {
  console.log("🚀 Testing Secretary Orchestrator (Phase 15 — WAL Protocol)...\n");

  // 1. Setup Data
  const dataDir = path.join(cwd, "extensions/secretary/data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const store = new CalendarStore(dataDir);
  await store.save([
    {
      id: "test-1",
      title: "Reunión de Sincronización",
      startTime: new Date().toISOString().split("T")[0] + "T10:00:00.000Z",
      endTime: new Date().toISOString().split("T")[0] + "T11:00:00.000Z",
    },
  ]);

  const tool = createOrchestratorTool(mockApi as any);

  // 2. Test Setup Status
  console.log("--- [1] Setup Status ---");
  const statusResult = await tool.execute("test-run", { action: "setup_status" }, mockCtx as any);
  console.log(statusResult.content[0].text);

  // 3. Test Briefing (with pollHint)
  console.log("\n--- [2] Briefing ---");
  const briefing = await tool.execute("test-run", { action: "briefing" }, mockCtx as any);
  console.log(briefing.content[0].text);
  console.log("  pollHint:", JSON.stringify((briefing.details as any).pollHint, null, 2));

  // 4. Test Conflict Guardian (triggers WAL write to SESSION-STATE.md)
  console.log("\n--- [3] Conflict Guardian (WAL Test) ---");
  const today = new Date().toISOString().split("T")[0];
  const conflict = await tool.execute(
    "test-run",
    {
      action: "conflict_guardian",
      title: "Llamada con Cliente",
      startTime: today + "T10:30:00.000Z",
      endTime: today + "T11:30:00.000Z",
    },
    mockCtx as any,
  );
  console.log(conflict.content[0].text);
  console.log("  walPersisted:", (conflict.details as any).walPersisted);

  // 5. Verify SESSION-STATE.md was updated
  console.log("\n--- [4] Verifying SESSION-STATE.md (WAL) ---");
  const sessionStatePath = path.join(cwd, "workspace", "SESSION-STATE.md");
  const sessionContent = fs.readFileSync(sessionStatePath, "utf-8");
  const hasConflictSection = sessionContent.includes("## Active Conflicts");
  const hasConflictEntry = sessionContent.includes("Llamada con Cliente");
  console.log("  ✅ Has 'Active Conflicts' section:", hasConflictSection);
  console.log("  ✅ Has conflict entry for 'Llamada con Cliente':", hasConflictEntry);

  // 6. Test Setup Proactive
  console.log("\n--- [5] Setup Proactive ---");
  const setup = await tool.execute("test-run", { action: "setup_proactive" }, mockCtx as any);
  console.log(setup.content[0].text);

  console.log("\n✅ All verification steps complete!");
}

runTest().catch(console.error);
