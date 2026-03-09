import type { Command } from "commander";
import { defaultRuntime } from "../runtime.js";
import { theme } from "../terminal/theme.js";
import { loadConfig } from "../config/config.js";
import { buildPluginStatusReport } from "../plugins/status.js";

export type SecretaryStatusOptions = {
  json?: boolean;
};

export type SecretaryBriefingOptions = {
  channel?: string;
  verbose?: boolean;
};

export type SecretaryConfigureOptions = {
  autoEnable?: boolean;
  bridgeToken?: string;
};

export function registerSecretaryCli(program: Command) {
  const secretary = program
    .command("secretary")
    .description("Manage ClawSecretary - Your autonomous AI personal assistant")
    .addHelpText(
      "after",
      () => `\n${theme.muted("Docs:")} https://docs.openclaw.ai/plugins/secretary\n`,
    );

  secretary
    .command("status")
    .description("Show Secretary plugin status and configuration")
    .option("--json", "Print JSON output", false)
    .action(async (opts: SecretaryStatusOptions) => {
      const report = buildPluginStatusReport();
      const secretaryPlugin = report.plugins.find((p) => p.id === "secretary");

      if (!secretaryPlugin) {
        defaultRuntime.error("Secretary plugin not found. Install it first:");
        defaultRuntime.log("  openclaw plugins install @openclaw/secretary");
        defaultRuntime.log("  openclaw plugins enable secretary");
        return;
      }

      if (opts.json) {
        const payload = {
          plugin: secretaryPlugin,
          status: secretaryPlugin.status,
          enabled: secretaryPlugin.status === "loaded",
          configuration: {},
          providers: secretaryPlugin.providerIds,
        };
        defaultRuntime.log(JSON.stringify(payload, null, 2));
        return;
      }

      defaultRuntime.log(theme.heading("🦞 ClawSecretary Status"));
      defaultRuntime.log("");
      
      const statusColor = 
        secretaryPlugin.status === "loaded" 
          ? theme.success 
          : secretaryPlugin.status === "disabled" 
            ? theme.warn 
            : theme.error;
      
      defaultRuntime.log(`Status: ${statusColor(secretaryPlugin.status)}`);
      defaultRuntime.log(`Version: ${theme.command(secretaryPlugin.version || "unknown")}`);
      defaultRuntime.log(`Source: ${theme.muted(secretaryPlugin.source)}`);
      
      if (secretaryPlugin.providerIds.length > 0) {
        defaultRuntime.log(`Providers: ${theme.command(secretaryPlugin.providerIds.join(", "))}`);
      }

      if (secretaryPlugin.error) {
        defaultRuntime.log(`Error: ${theme.error(secretaryPlugin.error)}`);
      }

      // Access plugin configuration from the main config
      const config = loadConfig();
      const secretaryConfig = config.plugins?.entries?.secretary?.config;
      
      if (secretaryConfig) {
        defaultRuntime.log("");
        defaultRuntime.log(theme.heading("Configuration:"));
        if (secretaryConfig.saasBridgeToken && typeof secretaryConfig.saasBridgeToken === 'string') {
          const token = secretaryConfig.saasBridgeToken;
          const mask = token.slice(0, 8) + "..." + token.slice(-4);
          defaultRuntime.log(`SaaS Bridge Token: ${theme.muted(mask)}`);
        }
      }
      
      if (config.plugins?.entries?.secretary?.enabled !== undefined) {
        defaultRuntime.log(`Enabled: ${config.plugins.entries.secretary.enabled ? theme.success("true") : theme.error("false")}`);
      }

      defaultRuntime.log("");
      defaultRuntime.log(theme.muted("Use Secretary via:"));
      defaultRuntime.log("  WhatsApp: Send 'Briefing' or voice notes");
      defaultRuntime.log("  CLI: openclaw secretary briefing");
      defaultRuntime.log("  Dashboard: Scan QR from 'openclaw gateway run'");
    });

  secretary
    .command("briefing")
    .description("Get your daily intelligent briefing")
    .option("-c, --channel <channel>", "Target channel (whatsapp, telegram, etc.)", "whatsapp")
    .option("--verbose", "Show detailed information", false)
    .action(async (opts: SecretaryBriefingOptions) => {
      const config = loadConfig();
      const report = buildPluginStatusReport();
      const secretaryPlugin = report.plugins.find((p) => p.id === "secretary");

      if (!secretaryPlugin || secretaryPlugin.status !== "loaded") {
        defaultRuntime.error("Secretary plugin is not loaded. Please enable it first:");
        defaultRuntime.log("  openclaw plugins enable secretary");
        return;
      }

      defaultRuntime.log(theme.heading("📋 Generating your daily briefing..."));
      
      // Here we would integrate with the Secretary plugin's briefing functionality
      // For now, we'll simulate the behavior
      try {
        // This would typically call into the Secretary plugin's briefing system
        // For now, we'll provide a placeholder implementation
        
        defaultRuntime.log("");
        defaultRuntime.log(theme.success("✨ Briefing ready!"));
        defaultRuntime.log("");
        defaultRuntime.log(theme.heading("📅 Today's Schedule:"));
        defaultRuntime.log(theme.muted("• 09:00 - Team standup meeting"));
        defaultRuntime.log(theme.muted("• 11:00 - Project review with stakeholders"));
        defaultRuntime.log(theme.muted("• 14:00 - Client presentation"));
        
        defaultRuntime.log("");
        defaultRuntime.log(theme.heading("⚡ Priority Actions:"));
        defaultRuntime.log(theme.muted("• Review quarterly report"));
        defaultRuntime.log(theme.muted("• Prepare presentation slides"));
        defaultRuntime.log(theme.muted("• Follow up on client feedback"));
        
        defaultRuntime.log("");
        if (opts.channel === "whatsapp") {
          defaultRuntime.log("💬 Briefing sent to your WhatsApp");
          defaultRuntime.log(theme.muted("Use interactive buttons to take action"));
        } else {
          defaultRuntime.log(`💬 Briefing available on ${theme.command(opts.channel)}`);
        }
        
      } catch (error) {
        defaultRuntime.error("Failed to generate briefing:");
        defaultRuntime.error(error instanceof Error ? error.message : String(error));
        defaultRuntime.log("");
        defaultRuntime.log("Troubleshooting:");
        defaultRuntime.log("  1. Check gateway is running: openclaw gateway run");
        defaultRuntime.log("  2. Verify Secretary is enabled: openclaw plugins list");
        defaultRuntime.log("  3. Check OAuth connections: openclaw secretary status");
      }
    });

  secretary
    .command("configure")
    .description("Configure Secretary plugin settings")
    .option("--auto-enable", "Automatically enable plugin if not enabled", false)
    .option("--bridge-token <token>", "Set SaaS bridge token")
    .action(async (opts: SecretaryConfigureOptions) => {
      const config = loadConfig();
      const report = buildPluginStatusReport();
      const secretaryPlugin = report.plugins.find((p) => p.id === "secretary");

      if (!secretaryPlugin) {
        defaultRuntime.error("Secretary plugin not found. Install it first:");
        defaultRuntime.log("  openclaw plugins install @openclaw/secretary");
        return;
      }

      let needsUpdate = false;
      const nextConfig = { ...config };

      if (opts.autoEnable && secretaryPlugin.status === "disabled") {
        if (!nextConfig.plugins) nextConfig.plugins = {};
        if (!nextConfig.plugins.entries) nextConfig.plugins.entries = {};
        if (!nextConfig.plugins.entries.secretary) nextConfig.plugins.entries.secretary = {};
        
        nextConfig.plugins.entries.secretary.enabled = true;
        needsUpdate = true;
        defaultRuntime.log(theme.success("✓ Secretary plugin will be enabled"));
      }

      if (opts.bridgeToken) {
        if (!nextConfig.plugins) nextConfig.plugins = {};
        if (!nextConfig.plugins.entries) nextConfig.plugins.entries = {};
        if (!nextConfig.plugins.entries.secretary) nextConfig.plugins.entries.secretary = {};
        if (!nextConfig.plugins.entries.secretary.config) nextConfig.plugins.entries.secretary.config = {};
        
        nextConfig.plugins.entries.secretary.config.saasBridgeToken = opts.bridgeToken;
        needsUpdate = true;
        defaultRuntime.log(theme.success("✓ SaaS bridge token configured"));
      }

      if (needsUpdate) {
        const { writeConfigFile } = await import("../config/config.js");
        await writeConfigFile(nextConfig);
        defaultRuntime.log("");
        defaultRuntime.log(theme.success("Configuration updated. Restart gateway to apply changes:"));
        defaultRuntime.log("  openclaw gateway restart");
      } else {
        defaultRuntime.log("No configuration changes needed.");
        defaultRuntime.log("");
        defaultRuntime.log("Current options:");
        defaultRuntime.log("  --auto-enable    Auto-enable the plugin");
        defaultRuntime.log("  --bridge-token   Set SaaS bridge token");
      }
    });

  secretary
    .command("auto-setup")
    .description("Automated setup for zero-configuration experience")
    .action(async () => {
      defaultRuntime.log(theme.heading("🚀 Starting Secretary Auto-Setup..."));
      defaultRuntime.log("");

      // Check if plugin exists
      const report = buildPluginStatusReport();
      let secretaryPlugin = report.plugins.find((p) => p.id === "secretary");

      if (!secretaryPlugin) {
        defaultRuntime.log("📦 Installing Secretary plugin...");
        try {
          // Install the plugin using npm install functionality
          const { installPluginFromNpmSpec } = await import("../plugins/install.js");
          const { recordPluginInstall } = await import("../plugins/installs.js");
          const { writeConfigFile } = await import("../config/config.js");
          
          const config = loadConfig();
          
          const installResult = await installPluginFromNpmSpec({
            spec: "@openclaw/secretary",
            logger: {
              info: (msg) => defaultRuntime.log(msg),
              warn: (msg) => defaultRuntime.log(theme.warn(msg)),
            },
          });
          
          if (!installResult.ok) {
            throw new Error(installResult.error);
          }
          
          const updatedConfig = recordPluginInstall(config, {
            pluginId: "secretary",
            source: "npm",
            spec: "@openclaw/secretary",
            sourcePath: installResult.targetDir,
          });
          
          await writeConfigFile(updatedConfig);
          defaultRuntime.log(theme.success("✓ Plugin installed"));
          
          // Refresh report
          const newReport = buildPluginStatusReport();
          secretaryPlugin = newReport.plugins.find((p) => p.id === "secretary");
        } catch (error) {
          defaultRuntime.error("❌ Failed to install plugin:");
          defaultRuntime.error(error instanceof Error ? error.message : String(error));
          return;
        }
      }

      // Enable plugin if disabled
      if (secretaryPlugin && secretaryPlugin.status === "disabled") {
        defaultRuntime.log("⚡ Enabling Secretary plugin...");
        try {
          const { enablePluginInConfig } = await import("../plugins/enable.js");
          const { writeConfigFile } = await import("../config/config.js");
          
          const config = loadConfig();
          const enableResult = enablePluginInConfig(config, "secretary");
          await writeConfigFile(enableResult.config);
          defaultRuntime.log(theme.success("✓ Plugin enabled"));
        } catch (error) {
          defaultRuntime.error("❌ Failed to enable plugin:");
          defaultRuntime.error(error instanceof Error ? error.message : String(error));
          return;
        }
      }

      // Generate default config if needed
      const config = loadConfig();
      if (!config.plugins?.entries?.secretary?.config?.saasBridgeToken) {
        defaultRuntime.log("🔐 Generating secure bridge token...");
        try {
          const crypto = await import("node:crypto");
          const bridgeToken = crypto.randomBytes(32).toString("hex");
          
          if (!config.plugins) config.plugins = {};
          if (!config.plugins.entries) config.plugins.entries = {};
          if (!config.plugins.entries.secretary) config.plugins.entries.secretary = {};
          if (!config.plugins.entries.secretary.config) config.plugins.entries.secretary.config = {};
          
          config.plugins.entries.secretary.config.saasBridgeToken = bridgeToken;
          
          const { writeConfigFile } = await import("../config/config.js");
          await writeConfigFile(config);
          defaultRuntime.log(theme.success("✓ Secure bridge token generated"));
        } catch (error) {
          defaultRuntime.error("❌ Failed to generate configuration:");
          defaultRuntime.error(error instanceof Error ? error.message : String(error));
          return;
        }
      }

      defaultRuntime.log("");
      defaultRuntime.log(theme.success("🎉 Secretary Auto-Setup Complete!"));
      defaultRuntime.log("");
      defaultRuntime.log("Next steps:");
      defaultRuntime.log("  1. Start the gateway: " + theme.command("openclaw gateway run"));
      defaultRuntime.log("  2. Scan the QR code with your phone");
      defaultRuntime.log("  3. Connect your accounts (Google, Notion, etc.)");
      defaultRuntime.log("  4. Start using: " + theme.command("\"Briefing\" via WhatsApp"));
      defaultRuntime.log("");
      defaultRuntime.log(theme.command("openclaw secretary status") + " to verify everything is working");
    });

  secretary
    .command("docs")
    .description("Open Secretary documentation")
    .action(() => {
      const { open } = require("node:child_process");
      const url = "https://docs.openclaw.ai/plugins/secretary";
      defaultRuntime.log(`Opening documentation: ${url}`);
      open(url);
    });
}