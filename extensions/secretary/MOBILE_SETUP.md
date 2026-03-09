# ClawSecretary: Mobile Installation & Setup Guide 📱🦞

This guide explains how to set up the **Secretary Mobile-Edge SaS** on your phone. Since the Secretary lives "on the Edge" (your device), we need to bridge your local OpenClaw instance with the mobile environment.

---

## 🛠️ Step 0: Prerequisites & Tunneling

Your phone needs to talk to your computer. Because your computer is likely behind a firewall, we need a secure tunnel.

### Option A: Tailscale (Recommended)
1.  Install **Tailscale** on both your PC and your iPhone/Android.
2.  Log in with the same account.
3.  Note your PC's **Tailscale IP** (e.g., `100.x.y.z`).

### Option B: LocalTunnel / Ngrok
1.  Run `npx localtunnel --port 11434`.
2.  Copy the generated URL (e.g., `https://smart-lobster.loca.lt`).

---

## 🚀 Step 1: Start the Local Engine

Ensure your environment variables are configured in `.env`:
- `MATON_API_KEY`: Required for WhatsApp.
- `WA_PHONE_NUMBER_ID`: Your Meta WhatsApp ID.

Start the dev server:
```bash
npm run dev
```
Wait until you see: `[OpenClaw] Gateway started on port 11434`.

---

## 📱 Step 2: Install the Mobile Brain (PWA)

1.  Open Chrome (Android) or Safari (iOS) on your phone.
2.  Navigate to your tunnel URL (e.g., `http://100.x.y.z:11434` or your LocalTunnel URL).
3.  **Safari:** Tap the "Share" icon -> **"Add to Home Screen"**.
4.  **Chrome:** Tap the three dots -> **"Install App"**.

You now have the **ClawSecretary Dashboard** as a native-feeling app on your phone.

---

## 🔑 Step 3: OAuth Sync (The Cloud Bridge)

1.  Open the newly installed app on your phone.
2.  Go to **Settings > Integrations**.
3.  Click **"Connect Google Calendar"** or **"Connect Notion"**.
4.  Perform the login on your phone.
5.  **Magic Flow:** The Cloud Bridge (Vercel) will securely inject the token back into your phone via the encrypted tunnel. No tokens are stored in the cloud.

---

## 🔘 Step 4: The Physical Trigger (Apple Shortcuts)

To make it truly useful, set up a physical button:
1.  Open the **Shortcuts app** on iOS.
2.  Create a new shortcut called **"Secretary Briefing"**.
3.  Add the **"Get Contents of URL"** action.
4.  **URL:** `http://your-tunnel-url/plugins/secretary/trigger`
5.  **Method:** `POST`
6.  **JSON Body:**
    ```json
    { "action": "briefing" }
    ```
7.  Add this shortcut to your **Home Screen** or **Action Button**.

---

## ✅ Step 5: Initial Verification

1.  **Test the Briefing:** Press your new shortcut button. You should receive an interactive WhatsApp message within 5-10 seconds.
2.  **Verify WAL:** Open `extensions/secretary/SESSION-STATE.md` on your PC. You should see a new log entry: `Agent: Briefing sent...`.
3.  **Check Memory:** Send an audio note to your WhatsApp number. The Secretary will transcribe it, sync it to Obsidian, and index it in LanceDB on your device.

---

## 🏁 How to Maintain
-   **Always running:** For the 08:00 AM briefing to work, your computer must be on and the `npm run dev` process active.
-   **Tunnel Stability:** If using LocalTunnel, remember the URL changes on restart. Tailscale IPs are permanent.

**You are now officially a High-Leverage Agentic Human.** 🦞🚀
