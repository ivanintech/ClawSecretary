# SecretaryOS Bridge Server

Privacy-first message relay server for SecretaryOS.

## Overview

The bridge server provides:
- **WebSocket Relay** - Real-time message relay without storage
- **WhatsApp Pre-Auth** - Connect WhatsApp before mobile app installation
- **Device Management** - Track connected devices
- **Metrics** - Connection monitoring

## Quick Start

```bash
cd apps/secretary-bridge

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_ENCRYPTION_KEY` | 32-char key for session encryption | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `PORT` | Server port (default: 3001) | No |
| `LOG_LEVEL` | Logging level (default: info) | No |

## API Endpoints

### Health & Metrics

```
GET /health          - Health check
GET /metrics         - Active connection metrics
```

### WhatsApp Pre-Auth

```
POST /auth/whatsapp/start        - Start WhatsApp connection
GET  /auth/whatsapp/status/:id  - Check Pre-Auth status
POST /auth/whatsapp/complete/:id - Complete Pre-Auth
DELETE /auth/whatsapp/cancel/:id - Cancel Pre-Auth
```

### Sessions

```
GET    /sessions/:userId         - Get user session
DELETE /sessions/:userId         - Revoke session
```

### Devices

```
GET    /devices/:userId          - List user devices
DELETE /devices/:deviceId        - Deactivate device
```

### WebSocket Relay

```
WS /relay?device-token=X&session=Y
```

Connect with device token and encrypted session. Send/receive messages:

```typescript
// Send message
{ type: 'message', id: '...', to: 'jid', payload: { text: '...' }, timestamp: 123 }

// Receive ack
{ type: 'ack', id: '...', payload: { status: 'delivered' }, timestamp: 123 }

// Typing indicator
{ type: 'typing', id: '...', payload: { to: 'jid', isTyping: true }, timestamp: 123 }
```

## Testing

```bash
# Run integration tests
npm run test
```

Requires:
1. Bridge server running (`npm run dev`)
2. PostgreSQL database with schema applied (`npm run db:migrate`)

## Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Mobile    │◄──────────────────►│   Bridge    │
│   Client    │                    │   Server    │
└─────────────┘                    └─────────────┘
      │                                  │
      │ Local LLM                        │
      ▼                                  ▼
┌─────────────┐                    ┌─────────────┐
│  Processing │                    │ PostgreSQL  │
│  (Private)  │                    │ (Sessions)  │
└─────────────┘                    └─────────────┘
```

## Privacy

The bridge server:
- ✅ Relays messages in real-time
- ✅ Stores encrypted WhatsApp sessions
- ❌ Does NOT read message content
- ❌ Does NOT store messages
- ❌ Does NOT store contacts

## License

MIT
