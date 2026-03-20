# SecretaryOS - Product Specification

**Status:** 🔴 DEVELOPMENT - Production Readiness In Progress
**Last Updated:** March 20, 2026

---

## Product Philosophy

### The Problem
- Existing AI assistants require you to open an app and interact with them
- Most "personal assistants" need constant management
- Phone batteries die, apps get killed, integrations break

### The Solution
- **Invisible**: Installs once, runs forever, never need to open it
- **Proactive**: Sends you information before you ask
- **Natural**: Talk to it like a human via WhatsApp
- **Always On**: Survives app kills, runs in background

---

## Architecture - CURRENT IMPLEMENTATION

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              SECRETARYOS                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     WEB APP (Next.js 14)                          │   │
│   │   Landing + Auth (Supabase) + Dashboard + Install QR             │   │
│   │   URL: https://secretaryos.app (deployed)                       │   │
│   └─────────────────────────────┬───────────────────────────────────┘   │
│                                 │ HTTPS/REST                           │
│                                 ▼                                       │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     BRIDGE SERVER (:3001)                        │   │
│   │   Fastify + WebSocket + WhatsApp Baileys                        │   │
│   │   - Pre-Auth: Generate QR for WhatsApp linking                  │   │
│   │   - Relay: WebSocket message relay between mobile & WhatsApp    │   │
│   │   - Sessions: Encrypted WhatsApp session storage                │   │
│   │   URL: wss://bridge.secretaryos.app (needs deployment)        │   │
│   └─────────────────────────────┬───────────────────────────────────┘   │
│                                 │                                       │
│           ┌─────────────────────┼─────────────────────┐               │
│           │                     │                     │               │
│           ▼                     ▼                     ▼               │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      │
│   │ WhatsApp    │      │ WhatsApp    │      │ Mobile      │      │
│   │ User Phone  │◄─────│ QR Scan     │      │ Client      │      │
│   │ (receives)  │      │ (link acct) │      │ (Node.js)   │      │
│   └─────────────┘      └─────────────┘      └─────────────┘      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Current Components

### 1. Web App (`apps/secretaryos-web/`)

**Stack:** Next.js 14 + React + Supabase + TailwindCSS

**Pages:**
- `/` - Landing page with features + pricing
- `/login` - Supabase authentication
- `/dashboard` - User dashboard with memories, routines
- `/install` - **Unified QR flow** (WhatsApp + Setup in ONE QR)

**API Routes:**
- `/api/whatsapp` - WhatsApp pre-auth, status, complete
- `/api/bridge/config` - Bridge URL configuration
- `/api/oauth/*` - OAuth flows for calendar, email

### 2. Bridge Server (`apps/secretary-bridge/`)

**Stack:** Node.js + Fastify + WebSocket + @whiskeysockets/baileys

**Endpoints:**
```
POST /auth/whatsapp/start     - Generate QR for WhatsApp linking
GET  /auth/whatsapp/status/:id - Check scan status
POST /auth/whatsapp/complete/:id - Complete linking, get session
DELETE /auth/whatsapp/cancel/:id - Cancel pending scan

GET  /health                  - Server health check
GET  /metrics                - Connection metrics

WS   /relay                  - WebSocket relay endpoint
```

### 3. Mobile Client (`apps/secretary-mobile/`)

**Stack:** Node.js CLI

**Features:**
- Connects to bridge via WebSocket
- Processes incoming WhatsApp messages
- Sends AI responses back through bridge
- Progress notifications
- Briefing scheduling
- Memory management

---

## Flow - CURRENT BEHAVIOR

### Registration Flow (DEMO MODE)

```
1. User goes to /install
        ↓
2. Clicks "Generate Setup QR"
        ↓
3. API calls /auth/whatsapp/start (demo mode)
        ↓
4. QR code displayed (DEMO - not real WhatsApp)
        ↓
5. User clicks "Simulate WhatsApp Scan"
        ↓
6. API calls /auth/whatsapp/complete (demo)
        ↓
7. Setup QR generated with config:
   {
     bridgeUrl: "wss://bridge.secretaryos.app",
     bridgeToken: "auto-generated",
     encryptedSession: "demo-session",
     phoneNumber: "+1234567890"
   }
        ↓
8. Mobile client would scan this QR
        ↓
9. BUT: No mobile app scanner implemented yet!
```

### Real Flow (TO IMPLEMENT)

```
1. User goes to /install
        ↓
2. Clicks "Generate WhatsApp QR"
        ↓
3. Bridge generates real WhatsApp QR via Baileys
        ↓
4. User scans with WhatsApp mobile app
        ↓
5. Bridge captures WhatsApp session (encrypted)
        ↓
6. Session stored in Supabase
        ↓
7. Setup QR generated with:
   - bridgeUrl
   - bridgeToken  
   - encryptedSession (WhatsApp)
   - userId
        ↓
8. User scans with SecretaryOS mobile app
        ↓
9. Mobile app:
   - Decodes QR → saves config
   - Connects to bridge WebSocket
   - Loads WhatsApp session
        ↓
10. SecretaryOS ready! 🚀
```

---

## Features - IMPLEMENTED vs PLANNED

### ✅ IMPLEMENTED

| Feature | File | Status |
|---------|------|--------|
| Web landing page | `page.tsx` | Working |
| Supabase auth | `lib/supabase/` | Working |
| Dashboard | `dashboard/page.tsx` | Working |
| WhatsApp API | `api/whatsapp/route.ts` | Demo mode |
| Bridge client | `lib/bridge/client.ts` | Working |
| WebSocket relay | `websocket-relay.ts` | Working |
| Session encryption | `utils/encryption.ts` | Working |
| Mobile client skeleton | `src/index.ts` | Working |

### ⚠️ PARTIAL (Demo Mode)

| Feature | Status | Issue |
|---------|--------|-------|
| WhatsApp Pre-Auth | Demo | QR is mock, not real |
| Setup QR | Demo | No real session |
| Message relay | Mock | Not end-to-end tested |

### 🔴 TODO FOR PRODUCTION

| Feature | Priority | Effort |
|---------|----------|--------|
| Real WhatsApp Pre-Auth | High | 1 day |
| Mobile QR Scanner App | High | 3 days |
| Deploy Bridge Server | High | 1 day |
| End-to-End Testing | High | 2 days |
| Monitoring/Logging | Medium | 2 days |

---

## Technical Decisions

### Why Baileys for WhatsApp?

```
Pros:
✅ Open source, maintained
✅ Supports Multi-Device protocol
✅ No official API needed
✅ Node.js (matches our stack)
✅ Session persistence

Cons:
❌ Can trigger WhatsApp bans (use secondary number!)
❌ No guarantee of stability
❌ QR codes expire quickly
```

### Why Bridge Server Architecture?

```
┌─────────────────────────────────────────┐
│              USER PHONE                  │
│  ┌───────────────────────────────────┐  │
│  │  SecretaryOS Mobile App           │  │
│  │  - Local LLM inference            │  │
│  │  - WhatsApp session (encrypted)   │  │
│  │  - Message processing             │  │
│  └───────────────────────────────────┘  │
└────────────────┬────────────────────────┘
                 │ WebSocket
                 ▼
┌─────────────────────────────────────────┐
│           BRIDGE SERVER                  │
│  - Message relay (NO processing)        │
│  - Session validation                   │
│  - Rate limiting                       │
│  - Connection management               │
└────────────────┬────────────────────────┘
                 │ WhatsApp Web Protocol
                 ▼
┌─────────────────────────────────────────┐
│           WHATSAPP CLOUD                │
└─────────────────────────────────────────┘
```

**Key Point:** Bridge NEVER sees message content. It's a dumb relay.

### Supabase for Storage

```
What's stored in Supabase:
✅ User accounts (auth)
✅ Bridge configuration
✅ WhatsApp session (encrypted)
✅ User preferences

What's NOT stored:
❌ Message content (ephemeral)
❌ Session tokens (in-memory only)
❌ Personal data (privacy-first)
```

---

## Security Model

### Data Flow

```
1. WhatsApp session: encrypted with AES-256-GCM
   Key: SESSION_ENCRYPTION_KEY (env var, never stored)
   
2. Bridge validates: token + signature
   Token: JWT signed with JWT_SECRET
   
3. Mobile connects: WebSocket with token
   Session: Decrypted locally on mobile only
   
4. Messages: relayed, not stored
   Bridge: stateless, no persistence
```

### Privacy Guarantees

| Data | Stored? | Where | Encrypted? |
|------|---------|-------|------------|
| WhatsApp messages | ❌ | Never | N/A |
| Session tokens | ❌ | Memory only | N/A |
| WhatsApp session | ✅ | Supabase | ✅ AES-256-GCM |
| User preferences | ✅ | Supabase | ✅ (TLS) |
| Bridge logs | Partial | Server | ❌ |

---

## Deployment Architecture (TARGET)

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS / CLOUDFLARE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │                   CLOUDFLARE EDGE                          │      │
│  │   - DDoS protection                                        │      │
│  │   - SSL termination                                        │      │
│  │   - CDN for static assets                                  │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              │                                     │
│          ┌───────────────────┼───────────────────┐               │
│          ▼                   ▼                   ▼               │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐      │
│  │ Web App       │  │ Bridge Server │  │ Supabase      │      │
│  │ (Vercel)      │  │ (Railway/     │  │ (Cloud)       │      │
│  │ :3000          │  │  Fly.io)      │  │ :5432         │      │
│  │                │  │ :443 (WSS)    │  │               │      │
│  └───────────────┘  └───────────────┘  └───────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────┘
```

### URLs

| Service | URL | Port |
|---------|-----|------|
| Web App | https://secretaryos.app | 443 |
| Bridge | wss://bridge.secretaryos.app | 443 |
| Supabase | https://eqjkpvizlcijrfcigqkt.supabase.co | 443 |

---

## Cost Estimation (Production)

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Vercel | Pro | $20/mo |
| Railway | Basic | $5/mo |
| Supabase | Pro | $25/mo |
| Domain | .app | $12/yr |
| **Total** | | ~$50/mo |

---

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Setup time | < 2 minutes | Demo only |
| WhatsApp latency | < 2 seconds | Not measured |
| Bridge uptime | 99.9% | 100% (local) |
| QR scan success | > 95% | Demo only |
| Message delivery | > 99% | Not tested |

---

## Next Steps

### Immediate (This Week)

1. **Deploy Bridge Server** to Railway/Fly.io
2. **Configure production WhatsApp** session
3. **Test real QR flow** end-to-end

### Short Term (Next Sprint)

4. **Build Mobile Scanner App** (React Native or PWA)
5. **Implement message relay** with real devices
6. **Add monitoring** (Sentry, Datadog)

### Medium Term (Next Month)

7. **Load testing** with multiple users
8. **WhatsApp Business API** for official support
9. **Analytics dashboard**
10. **Beta user testing**
