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

## Features

### Message Processing
- Local LLM inference (optional, via `LLM_ENDPOINT`)
- Rule-based fallback for quick responses
- Automatic language detection

### Memory Management
- Stores facts, preferences, contacts, and notes
- Persistent storage across sessions
- Search and retrieval

### Briefing Scheduler
- Morning briefing (configurable time, default 8:00 AM)
- Evening summary (configurable time, default 9:00 PM)
- Automatic scheduling based on timezone

### Progress Notifications
- Real-time installation progress via WhatsApp
- Stage-based updates (download, install, WhatsApp connect)
- Multilingual messages (Spanish/English)

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
│  - Memory   │                    │             │
│  - Briefing │                    │             │
└─────────────┘                    └─────────────┘
      │
      │ Local Processing
      ▼
┌─────────────┐
│  Local LLM  │
│  (optional) │
└─────────────┘
```

## Message Templates

### Welcome Message
Sent on first connection after installation.

### Morning Briefing
Includes:
- Greeting based on time of day
- Number of meetings scheduled
- Pending tasks
- Unread emails
- Weather (if configured)

### Evening Summary
Includes:
- Day's summary
- Tomorrow's pending items
- Closing message

## Commands

Secretary understands natural language commands:

| Command | Description |
|---------|-------------|
| `Agenda una reunión con [nombre]` | Schedule a meeting |
| `Recuérdame [cosa] a las [hora]` | Set a reminder |
| `Qué tengo pendiente?` | Show pending tasks |
| `Resúmeme mis emails` | Email summary |
| `Añade [nota]` | Add a note |
| `Recuérdame sobre [tema]` | Search memory |

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
- Memory data is stored locally on device

## License

MIT
