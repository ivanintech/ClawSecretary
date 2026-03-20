-- Add WhatsApp connection info to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_connected BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_connected_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_whatsapp_connected ON profiles(whatsapp_connected) WHERE whatsapp_connected = TRUE;
