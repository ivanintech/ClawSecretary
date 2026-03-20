# SecretaryOS - Intelligent Personal Secretary

<p align="center">
  <strong>Privacy-first AI secretary that runs 24/7 on your phone. Zero app to open. Everything through WhatsApp.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-orange" alt="Status">
  <img src="https://img.shields.io/badge/WhatsApp-Baileys-green" alt="WhatsApp">
  <img src="https://img.shields.io/badge/Bridge-Fastify-blue" alt="Bridge">
  <img src="https://img.shields.io/badge/Web-Next.js%2014-black" alt="Web">
</p>

---

## 🚀 Quick Start

### 1. Start the Bridge Server

```bash
cd apps/secretary-bridge
npm install
npm run dev
# Server runs on http://localhost:3001
```

### 2. Start the Web App

```bash
cd apps/secretaryos-web
npm install
npm run dev
# App runs on http://localhost:3000
```

### 3. Open in Browser

```
http://localhost:3000/install
```

---

## 📁 Project Structure

```
ClawSecretary/
├── apps/
│   ├── secretary-bridge/     # Bridge server (WhatsApp relay)
│   │   ├── src/
│   │   │   ├── index.ts           # Fastify server entry
│   │   │   ├── services/
│   │   │   │   ├── whatsapp-preauth.ts  # WhatsApp Baileys integration
│   │   │   │   ├── device-manager.ts   # Device registration
│   │   │   │   └── websocket-relay.ts  # Message relay
│   │   │   ├── db/
│   │   │   │   └── client.ts     # Supabase client
│   │   │   └── utils/
│   │   │       └── encryption.ts # AES-256-GCM encryption
│   │   └── package.json
│   │
│   ├── secretaryos-web/     # Web app (Next.js)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx           # Landing
│   │   │   │   ├── install/page.tsx   # ONE QR flow
│   │   │   │   ├── dashboard/         # User dashboard
│   │   │   │   └── api/              # API routes
│   │   │   └── lib/
│   │   │       ├── bridge/client.ts  # Bridge API client
│   │   │       └── supabase/         # Supabase setup
│   │   └── package.json
│   │
│   └── secretary-mobile/    # Mobile client (Node.js CLI)
│       ├── src/
│       │   ├── index.ts            # CLI entry
│       │   ├── bridge-client.ts    # WebSocket client
│       │   ├── message-processor.ts # AI processing
│       │   └── ...
│       └── package.json
│
└── extensions/
    └── secretary/          # OpenClaw extension
        ├── src/
        │   ├── orchestrator.ts     # 40+ actions
        │   ├── hooks.ts           # Lifecycle hooks
        │   ├── helpers/           # Utilities
        │   └── ...
        └── README.md
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SECRETARYOS FLOW                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐          │
│  │   Web App   │────▶│   Bridge    │────▶│   WhatsApp  │          │
│  │  (Next.js)  │     │  (Fastify)  │     │  (Baileys)  │          │
│  └─────────────┘     └─────────────┘     └─────────────┘          │
│         │                   │                   │                   │
│         │                   │                   │                   │
│         │                   │ WebSocket         │                   │
│         │                   │                   │                   │
│         │                   │                   │                   │
│         │                   │                   ▼                   │
│         │                   │            ┌─────────────┐           │
│         │                   │            │ User Phone   │           │
│         │                   │            │ (receives)   │           │
│         │                   │            └─────────────┘           │
│         │                   │                                       │
│         │                   │                   │                   │
│         │                   ▼                   │                   │
│         │            ┌─────────────┐           │                   │
│         │            │   Mobile    │◀──────────┘                   │
│         │            │   Client    │   QR Scan                     │
│         │            └─────────────┘                              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### How It Works

1. **User scans WhatsApp QR** via web app → Bridge captures session
2. **Setup QR generated** with bridge URL + encrypted WhatsApp session
3. **Mobile app scans setup QR** → saves config locally
4. **Mobile connects to bridge** via WebSocket
5. **Messages relayed** through bridge (never stored)
6. **Mobile processes messages** with local AI
7. **Responses sent back** through WhatsApp

---

## 🔧 Configuration

### Environment Variables

**Bridge Server (`apps/secretary-bridge/.env`):**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SESSION_ENCRYPTION_KEY=32-byte-base64-key
JWT_SECRET=your-jwt-secret
PORT=3001
```

**Web App (`apps/secretaryos-web/.env.local`):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
BRIDGE_URL=http://localhost:3001
```

---

## 📡 API Reference

### Bridge Server Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/whatsapp/start` | Generate WhatsApp QR |
| `GET` | `/auth/whatsapp/status/:id` | Check QR scan status |
| `POST` | `/auth/whatsapp/complete/:id` | Complete WhatsApp link |
| `DELETE` | `/auth/whatsapp/cancel/:id` | Cancel pending scan |
| `GET` | `/health` | Server health check |
| `GET` | `/metrics` | Connection metrics |
| `WS` | `/relay` | Message relay WebSocket |

### Web App API Routes

| Endpoint | Description |
|----------|-------------|
| `/api/whatsapp` | WhatsApp pre-auth actions |
| `/api/bridge/config` | Bridge configuration |
| `/api/profile/gateway` | Gateway URL CRUD |
| `/api/auth/status` | Auth status check |

---

## 🧪 Testing

### Run Bridge Tests
```bash
cd apps/secretary-bridge
npx tsx tests/integration.ts
```

### Run Web App
```bash
cd apps/secretaryos-web
npm run dev
# Open http://localhost:3000/install
```

### Test WhatsApp Flow
1. Open http://localhost:3000/install
2. Click "Generate Setup QR"
3. Click "Simulate WhatsApp Scan" (demo mode)
4. View final setup QR

---

## 🚢 Deployment

### Bridge Server
```bash
# Deploy to Railway
railway login
cd apps/secretary-bridge
railway init
railway up

# Or Docker
docker build -t secretary-bridge .
docker run -p 3001:3001 \
  -e SUPABASE_URL=... \
  -e SUPABASE_ANON_KEY=... \
  -e SESSION_ENCRYPTION_KEY=... \
  secretary-bridge
```

### Web App
```bash
# Deploy to Vercel
cd apps/secretaryos-web
vercel --prod
```

---

## 📊 Status

| Component | Status | Notes |
|-----------|--------|-------|
| Bridge Server | ✅ Working | Local dev, needs prod deployment |
| WhatsApp Pre-Auth | ⚠️ Demo | Real scan needs production bridge |
| Web App | ✅ Working | Next.js 14, Supabase |
| Mobile Client | ⚠️ Skeleton | CLI exists, needs scanner |
| Documentation | ✅ Updated | Reflects current state |

---

## 🔗 Links

- [Documentation](docs/)
- [API Reference](docs/api/)
- [Contributing](../CONTRIBUTING.md)
- [License](../LICENSE)

---

## 📝 License

MIT License - See [LICENSE](../LICENSE)
