# SecretaryOS Web

Web application for SecretaryOS - AI Personal Assistant.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Auth**: Demo (ready for Supabase Auth)
- **Database**: Demo (ready for Supabase)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Supabase (for production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenClaw Gateway
GATEWAY_URL=http://localhost:18789

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_xxx
```

## Database Setup

Run the SQL in `SUPABASE_SETUP.md` in your Supabase SQL Editor to create:

- `profiles` - User profiles
- `memories` - User memories
- `routines` - User routines
- `install_tokens` - Mobile install tokens
- `subscriptions` - Stripe subscriptions

## Pages

- `/` - Landing page
- `/register` - User registration
- `/login` - User login
- `/install` - QR code generator for mobile installation
- `/dashboard` - Main dashboard
- `/dashboard/memory` - Memory bank
- `/dashboard/routines` - Routine editor
- `/dashboard/activity` - Activity feed
- `/dashboard/settings` - Settings

## API Routes

- `POST /api/auth` - Auth (login, register, logout)
- `GET/POST/PUT/DELETE /api/memories` - Memories CRUD
- `GET/POST/PUT/DELETE /api/routines` - Routines CRUD
- `POST /api/install/generate` - Generate install QR token
- `GET /api/status` - Dashboard status

## Production Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t secretaryos-web .
docker run -p 3000:3000 --env-file .env.local secretaryos-web
```

## Architecture

```
apps/secretaryos-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── install/          # Install page
│   │   ├── login/           # Login page
│   │   └── register/        # Register page
│   ├── components/           # React components
│   │   ├── WhatsAppChat.tsx  # WhatsApp UI simulation
│   │   ├── UseCasesSection.tsx
│   │   ├── DayTimelineSection.tsx
│   │   └── ComparisonSection.tsx
│   └── lib/                  # Utilities
│       ├── auth-context.tsx  # Auth provider
│       ├── hooks.ts          # Data fetching hooks
│       ├── mock-data.ts      # Demo data
│       ├── supabase-client.ts
│       ├── supabase-server.ts
│       └── types.ts
├── SUPABASE_SETUP.md         # Database schema
└── .env.example             # Environment template
```

## Next Steps

1. Create Supabase project and run SQL schema
2. Configure Supabase Auth
3. Add Stripe for payments
4. Connect to OpenClaw Gateway
5. Deploy to Vercel
