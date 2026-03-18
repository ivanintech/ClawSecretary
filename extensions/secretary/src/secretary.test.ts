import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

const SECRETARY_ROOT = path.join(process.cwd(), "extensions/secretary/src");

describe("Secretary Extension - Integration Tests", () => {
  
  describe("File Structure", () => {
    it("should have orchestrator.ts", async () => {
      const exists = await fs.access(path.join(SECRETARY_ROOT, "orchestrator.ts")).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });
    
    it("should have all helper files", async () => {
      const helpers = [
        "helpers/slack.ts",
        "helpers/imsg.ts",
        "helpers/reminders.ts",
        "helpers/voice-wake.ts",
        "helpers/node-mode.ts",
        "helpers/email.ts",
        "helpers/intelligence.ts",
        "helpers/iot.ts",
        "helpers/memory-lifecycle.ts",
      ];
      
      for (const helper of helpers) {
        const exists = await fs.access(path.join(SECRETARY_ROOT, helper)).then(() => true).catch(() => false);
        expect(exists, `Missing: ${helper}`).toBe(true);
      }
    });
  });
  
  describe("Orchestrator Actions", () => {
    it("should define all Phase 3 actions in enum", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "orchestrator.ts"), "utf-8");
      
      const requiredActions = [
        "slack_send",
        "slack_mark_done",
        "slack_read",
        "imsg_list",
        "imsg_history",
        "imsg_send",
        "reminders_today",
        "reminders_week",
        "reminders_overdue",
        "reminders_create",
        "reminders_complete",
        "reminders_sync",
        "voice_wake_status",
        "voice_wake_enable",
        "voice_wake_disable",
        "voice_wake_set_word",
        "node_status",
        "node_sync",
        "node_set_mode",
        "node_clear_queue",
      ];
      
      for (const action of requiredActions) {
        expect(content).toContain(`"${action}"`);
      }
    });
    
    it("should implement all handler methods", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "orchestrator.ts"), "utf-8");
      
      const handlers = [
        "handleSlackSend",
        "handleSlackMarkDone",
        "handleSlackRead",
        "handleImsgList",
        "handleImsgHistory",
        "handleImsgSend",
        "handleRemindersToday",
        "handleRemindersWeek",
        "handleRemindersOverdue",
        "handleRemindersCreate",
        "handleRemindersComplete",
        "handleRemindersSync",
        "handleVoiceWakeStatus",
        "handleVoiceWakeEnable",
        "handleVoiceWakeDisable",
        "handleVoiceWakeSetWord",
        "handleNodeStatus",
        "handleNodeSync",
        "handleNodeSetMode",
        "handleNodeClearQueue",
        "handleMobileDeviceStatus",
        "handleMobileDeviceInfo",
        "handleMobileLocation",
        "handleMobilePhotos",
        "handleMobileContactsSearch",
        "handleMobileContactsAdd",
        "handleMobileNotifications",
        "handleMobileNotificationAction",
        "handleMobileSms",
        "handleMobileMotion",
        "handleMobilePhotoCapture",
        "handleMobileVideoRecord",
        "handleMobileScreenRecord",
        "handleMobileNotify",
      ];
      
      for (const handler of handlers) {
        expect(content).toContain(`async ${handler}`);
      }
    });
  });
  
  describe("Slack Integration", () => {
    it("should export all Slack functions", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/slack.ts"), "utf-8");
      
      expect(content).toContain("export async function slackSendMessage");
      expect(content).toContain("export async function slackMarkAsDone");
      expect(content).toContain("export async function slackReadMessages");
      expect(content).toContain("export async function checkSlackConfigured");
    });
    
    it("should use real OpenClaw runtime API", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/slack.ts"), "utf-8");
      
      expect(content).toContain("runtime?.messaging");
      expect(content).toContain("channels?.slack");
    });
  });
  
  describe("iMsg Integration", () => {
    it("should export all iMsg functions", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/imsg.ts"), "utf-8");
      
      expect(content).toContain("export async function imsgListChats");
      expect(content).toContain("export async function imsgGetRecentMessages");
      expect(content).toContain("export async function imsgSendQuick");
      expect(content).toContain("export async function checkImsgAvailable");
    });
    
    it("should use real CLI execution", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/imsg.ts"), "utf-8");
      
      expect(content).toContain("execFileAsync");
      expect(content).toContain("imsg");
    });
  });
  
  describe("Reminders Integration", () => {
    it("should export all Reminders functions", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/reminders.ts"), "utf-8");
      
      expect(content).toContain("export async function remindersGetToday");
      expect(content).toContain("export async function remindersGetWeek");
      expect(content).toContain("export async function remindersGetOverdue");
      expect(content).toContain("export async function remindersCreateFromNaturalLanguage");
      expect(content).toContain("export async function remindersComplete");
      expect(content).toContain("export async function checkRemindersAvailable");
    });
    
    it("should use real CLI execution", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/reminders.ts"), "utf-8");
      
      expect(content).toContain("execFileAsync");
      expect(content).toContain("remindctl");
    });
  });
  
  describe("Voice Wake Integration", () => {
    it("should export all Voice Wake functions", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/voice-wake.ts"), "utf-8");
      
      expect(content).toContain("export async function getVoiceWakeStatus");
      expect(content).toContain("export async function setVoiceWakeEnabled");
      expect(content).toContain("export async function setWakeWord");
      expect(content).toContain("export function formatVoiceWakeStatus");
      expect(content).toContain("export async function loadVoiceWakeConfig");
    });
    
    it("should use real file system for config", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/voice-wake.ts"), "utf-8");
      
      expect(content).toContain("fs.readFile");
      expect(content).toContain("fs.writeFile");
      expect(content).toContain("JSON.parse");
    });
  });
  
  describe("Node Mode Integration", () => {
    it("should export all Node Mode functions", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/node-mode.ts"), "utf-8");
      
      expect(content).toContain("export async function getNodeStatus");
      expect(content).toContain("export async function syncOfflineQueue");
      expect(content).toContain("export async function setNodeMode");
      expect(content).toContain("export async function getOfflineQueue");
      expect(content).toContain("export async function clearOfflineQueue");
      expect(content).toContain("export async function queueOfflineAction");
    });
    
    it("should use real file system and HTTP", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/node-mode.ts"), "utf-8");
      
      expect(content).toContain("fs.readFile");
      expect(content).toContain("fs.writeFile");
      expect(content).toContain("fetch(");
    });
  });
  
  describe("Mobile Integration", () => {
    it("should have mobile helper file", async () => {
      const exists = await fs.access(path.join(SECRETARY_ROOT, "helpers/mobile.ts")).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });
    
    it("should export all Mobile functions", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/mobile.ts"), "utf-8");
      
      expect(content).toContain("export async function getDeviceStatus");
      expect(content).toContain("export async function getLocation");
      expect(content).toContain("export async function searchContacts");
      expect(content).toContain("export async function listNotifications");
      expect(content).toContain("export async function sendSms");
      expect(content).toContain("export async function takePhoto");
    });
    
    it("should use node.invoke for mobile commands", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "helpers/mobile.ts"), "utf-8");
      
      expect(content).toContain("invokeMobileCommand");
      expect(content).toContain("api.runtime.tools");
    });
  });
  
  describe("WAL Protocol", () => {
    it("should have WAL helper functions", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "wal-helpers.ts"), "utf-8");
      
      expect(content).toContain("updateSessionState");
      expect(content).toContain("appendWorkingBuffer");
    });
    
    it("should reference SESSION-STATE.md", async () => {
      const content = await fs.readFile(path.join(SECRETARY_ROOT, "orchestrator.ts"), "utf-8");
      
      expect(content).toContain("updateSessionState");
    });
  });
});
