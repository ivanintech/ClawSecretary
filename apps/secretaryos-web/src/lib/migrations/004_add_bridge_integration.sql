-- Add WhatsApp pre-auth state columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_session_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_encrypted_session TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_preauth_started BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_preauth_expires TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bridge_url TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_whatsapp_session ON profiles(whatsapp_session_id) WHERE whatsapp_session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_bridge_url ON profiles(bridge_url) WHERE bridge_url IS NOT NULL;
