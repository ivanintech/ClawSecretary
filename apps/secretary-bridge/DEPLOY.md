# SecretaryOS Bridge Server

Privacy-first message relay server for SecretaryOS.

## Deployment

### Fly.io (Recommended)

```bash
cd apps/secretary-bridge

# Create the app
fly apps create secretaryos-bridge

# Set secrets
fly secrets set SUPABASE_URL="https://your-project.supabase.co"
fly secrets set SUPABASE_SERVICE_KEY="your-service-key"
fly secrets set SESSION_ENCRYPTION_KEY="$(openssl rand -base64 32)"
fly secrets set JWT_SECRET="$(openssl rand -base64 32)"

# Deploy
fly deploy
```

### Docker

```bash
cd apps/secretary-bridge

# Build
docker build -t secretaryos-bridge .

# Run
docker run -d \
  -p 3001:3001 \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_SERVICE_KEY="your-service-key" \
  -e SESSION_ENCRYPTION_KEY="$(openssl rand -base64 32)" \
  -e JWT_SECRET="$(openssl rand -base64 32)" \
  secretaryos-bridge
```

### Railway

1. Connect your GitHub repo
2. Set environment variables in Railway dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `SESSION_ENCRYPTION_KEY`
   - `JWT_SECRET`
3. Railway auto-detects Node.js and builds

## Local Development

```bash
cd apps/secretary-bridge
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/metrics` | Connection metrics |
| POST | `/auth/whatsapp/start` | Start WhatsApp pre-auth |
| GET | `/auth/whatsapp/status/:id` | Check pre-auth status |
| POST | `/auth/whatsapp/complete/:id` | Complete pre-auth |
| DELETE | `/auth/whatsapp/cancel/:id` | Cancel pre-auth |
| WS | `/relay` | WebSocket relay |

## Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Mobile    │◄──────────────────►│   Bridge    │
│   Client    │                    │   Server    │
└─────────────┘                    └─────────────┘
                                          │
                                          ▼
                                    ┌─────────────┐
                                    │   Supabase  │
                                    │  (Sessions) │
                                    └─────────────┘
```
