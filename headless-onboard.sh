#!/bin/bash
set -e

# ClawSecretary Headless Onboarding Bridge
# This script is designed to run inside a Docker container for a zero-config setup.

SAAS_TOKEN="${SAAS_TOKEN:-}"
WHATSAPP_TOKEN="${WHATSAPP_TOKEN:-}"
INSTALL_SKILLS="${INSTALL_SKILLS:-secretary}"
AUTH_CHOICE="${AUTH_CHOICE:-}"
CLOUD_PROFILES="${CLOUD_PROFILES:-}"

echo "🚀 Starting ClawSecretary Headless Onboarding..."

# Build onboarding arguments
ONBOARD_FLAGS=(--non-interactive --accept-risk)

if [ -n "$SAAS_TOKEN" ]; then
  ONBOARD_FLAGS+=(--saas-token "$SAAS_TOKEN")
fi

if [ -n "$WHATSAPP_TOKEN" ]; then
  ONBOARD_FLAGS+=(--whatsapp-token "$WHATSAPP_TOKEN")
fi

if [ -n "$INSTALL_SKILLS" ]; then
  # Split by comma for multiple skills
  IFS=',' read -ra SKILLS <<< "$INSTALL_SKILLS"
  ONBOARD_FLAGS+=(--install-skill "${SKILLS[@]}")
fi

if [ -n "$AUTH_CHOICE" ]; then
  ONBOARD_FLAGS+=(--auth-choice "$AUTH_CHOICE")
fi

if [ -n "$CLOUD_PROFILES" ]; then
  ONBOARD_FLAGS+=(--cloud-profiles "$CLOUD_PROFILES")
fi

# Execute onboarding
pnpm openclaw onboard "${ONBOARD_FLAGS[@]}"

echo "✅ Onboarding complete. Starting OpenClaw Gateway..."

# Start the gateway
pnpm openclaw gateway start --loopback
