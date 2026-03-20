# SecretaryOS - User Guide

## 🚀 Installation Guide

**Note:** SecretaryOS is currently in development. Full production deployment is in progress.

### For Developers (Local Setup)

#### 1. Start the Bridge Server

```bash
cd apps/secretary-bridge
npm install
cp .env.example .env
# Configure Supabase credentials in .env
npm run dev
# Server runs on http://localhost:3001
```

#### 2. Start the Web App

```bash
cd apps/secretaryos-web
npm install
cp .env.example .env.local
# Configure Supabase credentials in .env.local
npm run dev
# App runs on http://localhost:3000
```

#### 3. Open the App

```
http://localhost:3000/install
```

---

## 📱 How It Works (Development Mode)

### Current Flow (Demo Mode)

Since we're in development, the WhatsApp integration uses demo mode:

```
1. Go to http://localhost:3000/install
        ↓
2. Click "Generate Setup QR"
        ↓
3. A demo QR code appears (simulated WhatsApp)
        ↓
4. Click "Simulate WhatsApp Scan"
        ↓
5. Setup QR is generated
        ↓
6. (Future: Scan with SecretaryOS mobile app)
```

### Real Flow (When Production Ready)

```
1. Go to https://secretaryos.app/install
        ↓
2. Click "Generate WhatsApp QR"
        ↓
3. Real QR code appears
        ↓
4. Scan with your WhatsApp app
        ↓
5. WhatsApp linked to your account
        ↓
6. Setup QR generated with your config
        ↓
7. Scan with SecretaryOS mobile app
        ↓
8. SecretaryOS ready! 🚀
```

---

## 🎯 Features

### What Works (Development)

| Feature | Status | How to Test |
|---------|--------|-------------|
| Landing page | ✅ | Visit `/` |
| Auth flow | ✅ | Login/signup |
| Dashboard | ✅ | Visit `/dashboard` |
| Setup QR generation | ⚠️ Demo | Visit `/install` |
| Bridge health | ✅ | `curl localhost:3001/health` |
| WebSocket relay | ⚠️ Demo | Mobile app needed |

### What's Coming

| Feature | ETA | Notes |
|---------|-----|-------|
| Real WhatsApp linking | 1 week | Need production bridge |
| Mobile app scanner | 2 weeks | Need QR library |
| End-to-end messaging | 3 weeks | Full integration |

---

## 🔧 Troubleshooting

### "WhatsApp QR doesn't work"

**Cause:** Currently in demo mode
**Solution:** Wait for production deployment or test with demo mode

### "Can't connect to bridge"

**Check:**
1. Bridge server running on port 3001
2. `curl localhost:3001/health` returns 200
3. Web app `.env.local` has correct `BRIDGE_URL`

### "Setup QR doesn't scan"

**Cause:** Mobile scanner not implemented yet
**Solution:** Development in progress

---

## 📊 Architecture (For Developers)

```
┌─────────────────────────────────────────────────────────────┐
│                      SECRETARYOS                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Browser                  Bridge Server           WhatsApp    │
│  ┌─────────┐            ┌───────────┐         ┌────────┐ │
│  │ Web App │────HTTPS──▶│ Pre-Auth  │──Baileys─▶│ Whats  │ │
│  │         │◀───HTML────│           │◀─────────│ App    │ │
│  └─────────┘            └─────┬─────┘           └────────┘ │
│                               │                          │
│                               │ WebSocket                │
│                               ▼                          │
│                          ┌───────────┐                   │
│                          │ Mobile    │◀───QR Scan──┐      │
│                          │ Client    │              │      │
│                          └───────────┘              │      │
│                                                       │      │
└───────────────────────────────────────────────────────┘      │
                                                              │
                    Setup QR ──────────────────────────────┘      │
                    (bridge URL + encrypted session)            │
```

---

## 💡 Tips for Developers

### Testing WhatsApp Flow

1. Use a **test WhatsApp account** (not your main number!)
2. WhatsApp may temporarily ban numbers using unofficial clients
3. Use `demo` mode in API for testing without real WhatsApp

### Debugging Bridge Server

```bash
# Check logs
cd apps/secretary-bridge
npm run dev

# Test health
curl http://localhost:3001/health

# Test metrics
curl http://localhost:3001/metrics

# Test WhatsApp start
curl -X POST http://localhost:3001/auth/whatsapp/start \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user"}'
```

### Supabase Setup

1. Create project at https://supabase.com
2. Run migrations in `apps/secretaryos-web/src/lib/migrations/`
3. Copy URL and anon key to `.env.local`

---

## 📞 Getting Help

1. **Documentation:** See other files in this directory
2. **Issues:** Open on GitHub
3. **Discord:** Join OpenClaw community

---

## ⚠️ Known Limitations (Development)

1. **Demo Mode:** WhatsApp integration uses simulated data
2. **No Mobile Scanner:** QR codes generated but not consumed
3. **Local Only:** No production deployment yet
4. **Single Device:** Only one mobile client supported

---

## 🗺️ Roadmap to Production

```
Week 1:
├── Deploy bridge to Railway/Fly.io
├── Configure production WhatsApp session
└── Test real QR scan flow

Week 2:
├── Implement mobile QR scanner
├── Test setup flow end-to-end
└── Add monitoring

Week 3:
├── Load testing
├── Beta user testing
└── Production launch
```

---

**Thank you for testing SecretaryOS! 🚀**

Your feedback helps us build a better product.
