# SecretaryOS Mobile Client

Edge AI client for SecretaryOS - processes messages locally, relays through bridge.

## Quick Start

```bash
cd apps/secretary-mobile
npm install
npm run dev
```

## Setup

### Option 1: Scan QR Code
1. Open SecretaryOS web app
2. Go to Settings > Devices
3. Scan the QR code

### Option 2: Setup Code
```bash
secretary-mobile --setup <setup-code>
secretary-mobile --start
```

## Usage

```bash
# Start the client
secretary-mobile --start

# Check status
secretary-mobile --status

# Generate setup QR
secretary-mobile --qr
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LLM_ENDPOINT` | Local LLM API endpoint | No |
| `LOG_LEVEL` | Logging level (default: info) | No |

## Architecture

```
┌─────────────┐     WebSocket      ┌─────────────┐
│   Mobile    │◄──────────────────►│   Bridge    │
│   Client    │                    │   Server    │
│             │                    │             │
│  - Config   │                    │  - Relay    │
│  - Bridge   │                    │  - Devices  │
│  - Process  │                    │  - Metrics  │
└─────────────┘                    └─────────────┘
      │
      │ Local Processing
      ▼
┌─────────────┐
│  Local LLM  │
│  (optional) │
└─────────────┘
```

## Mobile App Installation

### Android (Termux)
```bash
# Install Termux from F-Droid
pkg update && pkg install nodejs
cd /sdcard/secretary-mobile
npm install
npm start
```

### iOS (iSH or similar)
```bash
# Install iSH from App Store
apk add nodejs
cd /root/secretary-mobile
npm install
npm start
```

### Desktop (Linux/macOS/Windows)
```bash
npm install
npm run dev
```

## Privacy

- All message processing happens locally on your device
- The bridge server only relays encrypted messages
- No message content is stored on the bridge
- WhatsApp session is encrypted before transmission

## License

MIT
