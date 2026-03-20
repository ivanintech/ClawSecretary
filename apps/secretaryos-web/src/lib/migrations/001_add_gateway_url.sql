-- Add gateway_url to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gateway_url TEXT;

-- Add gateway_url to install_tokens for faster lookup
ALTER TABLE install_tokens ADD COLUMN IF NOT EXISTS gateway_url TEXT;

-- Create index for faster token validation
CREATE INDEX IF NOT EXISTS idx_install_tokens_gateway_url ON install_tokens(gateway_url);
