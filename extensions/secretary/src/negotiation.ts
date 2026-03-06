import { privateDecrypt, publicEncrypt } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { OpenClawPluginApi } from "../../../src/plugins/types.js";
import { getKeys } from "./oauth-bridge.js";
import { CalendarStore } from "./store.js";

export type NegotiationOffer = {
  version: "1.0";
  senderUrl: string;
  senderPublicKey: string;
  title: string;
  durationMin: number;
  proposedSlots: { start: string; end: string }[];
};

export type NegotiationReply = {
  version: "1.0";
  accepted: boolean;
  selectedSlot?: { start: string; end: string };
  reason?: string;
};

// Helper to encrypt data for a peer
export function encryptForPeer(peerPublicKey: string, data: object): string {
  const buffer = Buffer.from(JSON.stringify(data), "utf-8");
  const encrypted = publicEncrypt(
    {
      key: peerPublicKey,
      // OAEP padding should be used in production
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

    // Overlap condition
    if (slotStart < evEnd && slotEnd > evStart) {
      return false; // Conflict found
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

    try {
      const body = await getJsonBody(req);
      if (!body.encryptedOffer) throw new Error("Missing encryptedOffer");

      // Decrypt the offer
      const offer = decryptLocal(body.encryptedOffer) as NegotiationOffer;
      api.logger.info(`Received negotiation offer from ${offer.senderUrl} for "${offer.title}"`);

      // Load calendar and find a matching slot
      const store = new CalendarStore(api.resolvePath("./data"));
      const events = await store.load();

      let acceptedSlot: { start: string; end: string } | null = null;
      for (const slot of offer.proposedSlots) {
        if (isSlotFree(events, slot.start, slot.end)) {
          acceptedSlot = slot;
          break; // Take the first available slot
        }
      }

      // Generate reply
      let reply: NegotiationReply;
      if (acceptedSlot) {
        reply = { version: "1.0", accepted: true, selectedSlot: acceptedSlot };

        // Save to our own calendar implicitly since we accepted
        events.push({
          id: `neg_${Date.now()}`,
          title: offer.title,
          startTime: acceptedSlot.start,
          endTime: acceptedSlot.end,
          source: "local",
        });
        await store.save(events);
        api.logger.info(`Negotiation accepted. Auto-committed slot: ${acceptedSlot.start}`);
      } else {
        reply = { version: "1.0", accepted: false, reason: "No matching slots available." };
        api.logger.info(`Negotiation rejected: No matching slots.`);
      }

      // We could respond synchronously or send to their /reply endpoint.
      // For simplicity in Phase 31, we return the encrypted reply synchronously.
      const encryptedReply = encryptForPeer(offer.senderPublicKey, reply);

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ encryptedReply }));
    } catch (err: any) {
      api.logger.error(`Negotiation Offer error: ${err.message}`);
      res.statusCode = 400;
      res.end(JSON.stringify({ error: err.message }));
    }
    return true;
  };
}
