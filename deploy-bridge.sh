#!/bin/bash
# Deploy SecretaryOS Bridge to Fly.io

set -e

echo "Deploying SecretaryOS Bridge to Fly.io..."

cd "$(dirname "$0")/apps/secretary-bridge"

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "Installing Fly CLI..."
    curl -L https://fly.io/install.sh | sh
    export PATH="$HOME/.fly/bin:$PATH"
fi

# Login to Fly.io
fly auth login

# Create app if it doesn't exist
fly apps create secretaryos-bridge --org personal 2>/dev/null || true

# Set secrets
echo "Setting secrets..."
fly secrets set \
    SUPABASE_URL="https://eqjkpvizlcijrfcigqkt.supabase.co" \
    SUPABASE_SERVICE_KEY="$SUPABASE_SERVICE_KEY" \
    SESSION_ENCRYPTION_KEY="$(openssl rand -base64 32)" \
    JWT_SECRET="$(openssl rand -base64 32)" \
    --app secretaryos-bridge

# Deploy
echo "Deploying..."
fly deploy --app secretaryos-bridge

# Get the public IP
echo ""
echo "Deployment complete!"
echo "Bridge URL: https://secretaryos-bridge.fly.dev"
