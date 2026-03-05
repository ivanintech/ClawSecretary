import { NextResponse } from "next/server";
import { publicEncrypt } from "node:crypto";

/**
 * PHASE 28: Mobile-Edge OAuth Bridge.
 * This API route acts as the ephemeral bridge between Nango/Clerk and the user's local device.
 */
export async function POST(req: Request) {
  try {
    const { provider, profiles, edgeUrl } = await req.json();

    if (!provider || !profiles || !edgeUrl) {
      return NextResponse.json({ error: "Missing required fields: provider, profiles, or edgeUrl" }, { status: 400 });
    }

    // PHASE 29: ASYMMETRIC ENCRYPTION (Secure Tunnel)
    // 1. Fetch the mobile node's ephemeral public key
    const keyRes = await fetch(`${edgeUrl}/plugins/secretary/public-key`, {
        headers: {
            "Authorization": "Bearer 29ffd6bef34329021139062c3fcecbbb9646a2c0c093ed5b"
        }
    });
    if (!keyRes.ok) {
        const errText = await keyRes.text();
        throw new Error(`Could not fetch public key from mobile edge node: ${errText}`);
    }
    const { publicKey } = await keyRes.json();

    // 2. Encrypt the sensitive profiles payload
    const encryptedBuffer = publicEncrypt(
        {
            key: publicKey,
        },
        Buffer.from(JSON.stringify({
            saasToken: "29ffd6bef34329021139062c3fcecbbb9646a2c0c093ed5b", // Match SAAS_BRIDGE_TOKEN
            profiles
        }))
    );
    const encryptedPayload = encryptedBuffer.toString("base64");

    // SECURE PUSH TO LOCAL LISTENER
    const listenerRes = await fetch(`${edgeUrl}/plugins/secretary/oauth-inject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 29ffd6bef34329021139062c3fcecbbb9646a2c0c093ed5b"
      },
      body: JSON.stringify({
        encryptedPayload
      })
    });

    if (!listenerRes.ok) {
      const errorText = await listenerRes.text();
      return NextResponse.json({ 
        success: false, 
        message: "Failed to reach local listener. Is OpenClaw Gateway running?", 
        details: errorText 
      }, { status: 502 });
    }

    const result = await listenerRes.json();
    
    // ZERO-STORAGE ENFORCEMENT: 
    // After forwarding, we do NOT log or save the 'profiles' (tokens) anywhere.
    console.log(`[SaaS Bridge] Tokens successfully injected into ${edgeUrl}. Bridge payload discarded.`);

    return NextResponse.json({
      success: true,
      message: "OAuth Bridge finalized. Tokens injected into local Sovereignty Vault.",
      injected: result.injectedCount
    });

  } catch (err: unknown) {
    const error = err as Error;
    console.error("[SaaS Bridge Error]", error);
    return NextResponse.json({ error: "Internal Bridge Error", details: error.message }, { status: 500 });
  }
}
