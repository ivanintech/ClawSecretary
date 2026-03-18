#!/bin/bash
# =============================================================================
# Voice Wake Setup for ClawSecretary
# =============================================================================
# Configures "Hey Secretary" as a custom wake word for OpenClaw mobile apps
#
# Usage:
#   ./voice-wake-setup.sh           # Interactive setup
#   ./voice-wake-setup.sh --status  # Check current status
#   ./voice-wake-setup.sh --config  # Generate config file
#
# Requirements:
#   - OpenClaw mobile app (iOS/Android)
#   - macOS Shortcuts app (for iOS wake word customization)
#
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="${HOME}/.openclaw"
CONFIG_FILE="${CONFIG_DIR}/voice-wake.json"
SECRETARY_CONFIG="${CONFIG_DIR}/secretary-voice.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

echo_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# Detect Platform
# =============================================================================

detect_platform() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if [[ "$(uname -m)" == "arm64" ]]; then
            PLATFORM="macOS-Apple-Silicon"
        else
            PLATFORM="macOS-Intel"
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        PLATFORM="Linux"
    else
        PLATFORM="Unknown"
    fi
    echo "$PLATFORM"
}

# =============================================================================
# Check Dependencies
# =============================================================================

check_dependencies() {
    echo_step "Checking dependencies..."
    
    local missing=()
    
    # Check for OpenClaw CLI
    if ! command -v openclaw &> /dev/null; then
        missing+=("openclaw")
    else
        echo_success "OpenClaw CLI found"
    fi
    
    # Check for mobile apps (check config)
    if [[ -f "${CONFIG_DIR}/devices.json" ]]; then
        echo_success "Device registry found"
    else
        echo_warning "No devices registered yet"
    fi
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        echo_warning "Missing: ${missing[*]}"
        echo "  Run: npm install -g openclaw"
    fi
}

# =============================================================================
# Generate Configuration
# =============================================================================

generate_config() {
    echo_step "Generating Voice Wake configuration..."
    
    mkdir -p "${CONFIG_DIR}"
    
    cat > "${SECRETARY_CONFIG}" << 'EOF'
{
  "version": "1.0",
  "wakeWord": "Hey Secretary",
  "wakeWordAliases": [
    "Hey Secretary",
    "Secretary",
    "Oye Secretary"
  ],
  "platform": "auto-detect",
  "sensitivity": 0.7,
  "timeoutMs": 5000,
  "language": "es-ES",
  "fallbackLanguage": "en-US",
  "routing": {
    "primary": "secretary",
    "fallback": "main"
  },
  "commands": {
    "briefing": ["briefing", "resumen", "agenda"],
    "reminders": ["recuerda", "recordatorio", "recuerdame"],
    "message": ["envía", "mensaje", "send"],
    "call": ["llama", "call", "teléfono"]
  },
  "channels": {
    "primary": "whatsapp",
    "secondary": ["telegram", "imessage", "slack"]
  },
  "proactive": {
    "enabled": true,
    "morningBriefing": "08:00",
    "eveningClosure": "22:00"
  }
}
EOF
    
    echo_success "Configuration saved to ${SECRETARY_CONFIG}"
}

# =============================================================================
# iOS Shortcuts Setup
# =============================================================================

setup_ios_shortcuts() {
    echo_step "Setting up iOS Shortcuts..."
    
    if [[ ! "$OSTYPE" == "darwin"* ]]; then
        echo_warning "iOS Shortcuts setup requires macOS"
        return 1
    fi
    
    # Generate AppleScript for creating Shortcut
    cat > "${SCRIPT_DIR}/create-secretary-shortcut.scpt" << 'APPLESCRIPT'
-- AppleScript to create "Hey Secretary" Shortcut
-- Run with: osascript create-secretary-shortcut.scpt

tell application "Shortcuts"
    -- Check if shortcut exists
    set shortcutExists to exists shortcut "Hey Secretary"
    
    if shortcutExists then
        display dialog "Shortcut 'Hey Secretary' already exists." buttons {"OK"}
        return
    end if
    
    -- Create the shortcut
    set newShortcut to make new shortcut with properties {name: "Hey Secretary"}
    
    display dialog "Shortcut 'Hey Secretary' created! Configure it in the Shortcuts app." buttons {"OK"}
end tell
APPLESCRIPT
    
    echo_success "AppleScript template created: create-secretary-shortcut.scpt"
    echo ""
    echo "To create the iOS Shortcut:"
    echo "1. Open Shortcuts app on your iPhone/iPad"
    echo "2. Tap + to create new Shortcut"
    echo "3. Name it 'Hey Secretary'"
    echo "4. Add action: 'When Siri runs'"
    echo "5. Add action: 'Open URL'"
    echo "   URL: openclaw://voice?wake=hey+secretary"
    echo "6. Tap Done"
    echo ""
    echo_warning "Alternative: Use OpenClaw app's built-in Voice Wake settings"
}

# =============================================================================
# Android Setup Instructions
# =============================================================================

setup_android_instructions() {
    echo_step "Android Voice Wake setup instructions..."
    
    cat << 'EOF'

📱 Android Setup for "Hey Secretary" Wake Word
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open OpenClaw app on your Android device

2. Go to Settings → Voice Wake

3. Configure:
   • Wake Word: "Hey Secretary"
   • Sensitivity: 70%
   • Language: Spanish (ES)
   
4. Test the wake word:
   Say "Hey Secretary" and verify the app responds

5. Grant permissions if requested:
   • Microphone access
   • Background activity
   • Notification access

📋 Configuration File
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The configuration has been saved to:
~/.openclaw/secretary-voice.json

You can edit this file to customize:
• Wake word aliases
• Routing behavior
• Channel preferences
• Proactive schedule

EOF
}

# =============================================================================
# macOS Setup Instructions
# =============================================================================

setup_macos_instructions() {
    echo_step "macOS Voice Wake setup instructions..."
    
    cat << 'EOF'

🖥️ macOS OpenClaw App Voice Wake Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Open OpenClaw app on your Mac

2. Go to Preferences → Voice Wake

3. Configure:
   • Enable Voice Wake: ✅
   • Wake Word: "Hey Secretary"
   • Listen: Always / When Headphones Connected
   • Language: Spanish (ES)
   
4. Optional: Create macOS Shortcut
   • Open Shortcuts app
   • Create new Shortcut named "Hey Secretary"
   • Add: Run Shell Script
   • Command: openclaw voice wake --activate
   • Add: Display Notification

5. Test:
   Say "Hey Secretary, briefing"
   → Should open OpenClaw and start briefing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Command Line Options
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Check status
openclaw voice-wake status

# Test wake word
openclaw voice-wake test

# Enable/disable
openclaw voice-wake enable
openclaw voice-wake disable

# Update configuration
openclaw voice-wake config --wake-word "Hey Secretary"

EOF
}

# =============================================================================
# Status Check
# =============================================================================

check_status() {
    echo_step "Checking Voice Wake status..."
    
    if [[ -f "${SECRETARY_CONFIG}" ]]; then
        echo_success "Secretary Voice Wake config found"
        echo ""
        cat "${SECRETARY_CONFIG}"
        echo ""
    else
        echo_warning "No Secretary Voice Wake config found"
        echo "Run with --config to generate"
    fi
    
    echo ""
    echo "Platform: $(detect_platform)"
    
    # Check OpenClaw status
    if command -v openclaw &> /dev/null; then
        echo_success "OpenClaw CLI installed"
        openclaw --version 2>/dev/null || true
    else
        echo_warning "OpenClaw CLI not found"
    fi
}

# =============================================================================
# Main
# =============================================================================

main() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║     🦞 ClawSecretary Voice Wake Setup                 ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    
    local platform
    platform=$(detect_platform)
    echo "Platform detected: ${platform}"
    echo ""
    
    case "${1:-}" in
        --status|-s)
            check_status
            ;;
        --config|-c)
            generate_config
            ;;
        --ios)
            setup_ios_shortcuts
            ;;
        --android)
            setup_android_instructions
            ;;
        --macos)
            setup_macos_instructions
            ;;
        --all)
            generate_config
            check_dependencies
            if [[ "$platform" == "darwin"* ]]; then
                setup_macos_instructions
                setup_ios_shortcuts
            else
                setup_android_instructions
            fi
            ;;
        --help|-h|*)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --status, -s      Check current status"
            echo "  --config, -c       Generate configuration file"
            echo "  --ios              iOS Shortcuts setup instructions"
            echo "  --android          Android setup instructions"
            echo "  --macos            macOS setup instructions"
            echo "  --all              Full setup for current platform"
            echo "  --help, -h        Show this help"
            echo ""
            echo "Examples:"
            echo "  $0 --config        # Generate config"
            echo "  $0 --all           # Full setup"
            echo "  $0 --status        # Check status"
            ;;
    esac
    
    echo ""
}

main "$@"
