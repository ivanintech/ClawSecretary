import { privateDecrypt, publicEncrypt } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { OpenClawPluginApi } from "../../../src/plugins/types.js";
import { getKeys } from "./oauth-bridge.js";
import { CalendarStore } from "./store.js";
import {
  registerSessionHierarchy,
  cleanupSessionHierarchy,
  getSessionHierarchyTree,
  type SubagentRole,
} from "./wal-helpers.js";

export type NegotiationOffer = {
  version: "1.0";
  senderUrl: string;
  senderPublicKey: string;
  title: string;
  durationMin: number;
  proposedSlots: { start: string; end: string }[];
  parentSessionKey?: string;
  peerId?: string;
};

export type NegotiationReply = {
  version: "1.0";
  accepted: boolean;
  selectedSlot?: { start: string; end: string };
  reason?: string;
};

const activeNegotiations = new Map<string, { offer: NegotiationOffer; sessionKey: string }>();

// Helper to encrypt data for a peer
export function encryptForPeer(peerPublicKey: string, data: object): string {
  const buffer = Buffer.from(JSON.stringify(data), "utf-8");
  const encrypted = publicEncrypt(
    {
      key: peerPublicKey,
    },
    buffer,
  );
  return encrypted.toString("base64");
}

// Helper to decrypt data sent to us
export function decryptLocal(encryptedBase64: string): object {
  const { privateKey } = getKeys();
  const buffer = Buffer.from(encryptedBase64, "base64");
  const decrypted = privateDecrypt(
    {
      key: privateKey,
    },
    buffer,
  );
  return JSON.parse(decrypted.toString("utf-8"));
}

function getJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

// Check if a slot conflicts with existing events
function isSlotFree(events: any[], startIso: string, endIso: string): boolean {
  const slotStart = new Date(startIso).getTime();
  const slotEnd = new Date(endIso).getTime();

  for (const event of events) {
    const evStart = new Date(event.startTime).getTime();
    const evEnd = new Date(event.endTime).getTime();

    if (slotStart < evEnd && slotEnd > evStart) {
      return false;
    }
  }
  return true;
}

export function createNegotiationOfferHandler(api: OpenClawPluginApi) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== "POST") {
      res.statusCode = 405;
      res.end("Method Not Allowed");
      return true;
    }

    const negotiationSessionKey = `p2p-negotiation-${Date.now()}`;

    try {
      const body = await getJsonBody(req);
      if (!body.encryptedOffer) throw new Error("Missing encryptedOffer");

      const offer = decryptLocal(body.encryptedOffer) as NegotiationOffer;
      api.logger.info(`[P2P-Negotiation] Received offer from ${offer.senderUrl} for "${offer.title}"`);

      await registerSessionHierarchy(
        api,
        negotiationSessionKey,
        "peer" as SubagentRole,
        offer.parentSessionKey,
        {
          peerUrl: offer.senderUrl,
          peerId: offer.peerId,
          title: offer.title,
          durationMin: offer.durationMin,
        },
      );

      activeNegotiations.set(negotiationSessionKey, { offer, sessionKey: negotiationSessionKey });

      const store = new CalendarStore(api.resolvePath("./data"));
      const events = await store.load();

      let acceptedSlot: { start: string; end: string } | null = null;
      for (const slot of offer.proposedSlots) {
        if (isSlotFree(events, slot.start, slot.end)) {
          acceptedSlot = slot;
          break;
        }
      }

      let reply: NegotiationReply;
      if (acceptedSlot) {
        reply = { version: "1.0", accepted: true, selectedSlot: acceptedSlot };

        events.push({
          id: `neg_${Date.now()}`,
          title: offer.title,
          startTime: acceptedSlot.start,
          endTime: acceptedSlot.end,
          source: "p2p",
          peerUrl: offer.senderUrl,
        });
        await store.save(events);
        api.logger.info(`[P2P-Negotiation] Accepted. Auto-committed: ${acceptedSlot.start}`);
      } else {
        reply = { version: "1.0", accepted: false, reason: "No matching slots available." };
        api.logger.info(`[P2P-Negotiation] Rejected: No matching slots.`);
      }

      const encryptedReply = encryptForPeer(offer.senderPublicKey, reply);

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ encryptedReply }));

      await cleanupSessionHierarchy(api, negotiationSessionKey);
    } catch (err: any) {
      api.logger.error(`[P2P-Negotiation] Error: ${err.message}`);
      await cleanupSessionHierarchy(api, negotiationSessionKey);
      res.statusCode = 400;
      res.end(JSON.stringify({ error: err.message }));
    }
    return true;
  };
}

export function getActiveNegotiations(): { sessionKey: string; peerUrl: string; title: string }[] {
  return Array.from(activeNegotiations.entries()).map(([key, { offer }]) => ({
    sessionKey: key,
    peerUrl: offer.senderUrl,
    title: offer.title,
  }));
}

export function getNegotiationHierarchy(): ReturnType<typeof getSessionHierarchyTree> {
  return getSessionHierarchyTree();
}
