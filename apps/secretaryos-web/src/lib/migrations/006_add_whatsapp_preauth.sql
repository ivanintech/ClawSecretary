-- Add WhatsApp pre-auth session info to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_session_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_encrypted_session TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_preauth_started BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_preauth_expires TIMESTAMPTZ;

-- Add bridge integration columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bridge_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bridge_connected BOOLEAN DEFAULT FALSE;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_whatsapp_session ON profiles(whatsapp_session_id) WHERE whatsapp_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_bridge_url ON profiles(bridge_url) WHERE bridge_url IS NOT NULL;
