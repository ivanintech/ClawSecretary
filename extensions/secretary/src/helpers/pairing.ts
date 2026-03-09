import os from "node:os";
import qrcode from "qrcode-terminal";
import type { OpenClawPluginApi } from "../../../../src/plugins/types.js";

/**
 * Phase 43: Magic Setup
 * Resolves the best possible URL for the mobile device to connect to.
 */
function resolveBestHost(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

/**
 * Generates a pairing link that auto-configures the mobile PWA.
 */
export async function generatePairingLink(api: OpenClawPluginApi): Promise<string> {
  const port = 11434;

  let host = resolveBestHost();
  const config = api.config as any;
  const bind = config.gateway?.bind;

  if (bind === "tailnet") {
    // In tailnet mode, we trust the bind logic if available
  } else if (process.env.SAAS_TUNNEL_URL) {
    return `${process.env.SAAS_TUNNEL_URL}/?pair=true&token=${api.config.gateway?.auth?.token || ""}`;
  }

  const baseUrl = `http://${host}:${port}`;
  const pairingPayload = {
    v: "1",
    url: baseUrl,
    token: config.gateway?.auth?.token || "none",
  };

  const encoded = Buffer.from(JSON.stringify(pairingPayload)).toString("base64");
  // The PWA dashboard logic will check for 'pair' param
  return `${baseUrl}/plugins/secretary/dashboard?pair=${encoded}`;
}

/**
 * Generates a real QR code in the terminal for the customer.
 */
export function printMagicLink(api: OpenClawPluginApi, link: string) {
  api.logger.info(
    "\n\n" +
      "╔════════════════════════════════════════════════════════════╗\n" +
      "║             🦞 CLAWSECRETARY MAGIC SETUP 🦞                ║\n" +
      "╚════════════════════════════════════════════════════════════╝\n",
  );

  qrcode.generate(link, { small: true }, (qr) => {
    console.log(qr);
  });

  api.logger.info("\n  Scan the QR above or open this link on your phone:\n" + `  ${link}\n\n`);
}
