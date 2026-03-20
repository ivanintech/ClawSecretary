-- SecretaryOS Database Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- 1. Add gateway_url column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gateway_url TEXT;

-- 2. Add gateway_url column to install_tokens for faster lookup
ALTER TABLE install_tokens ADD COLUMN IF NOT EXISTS gateway_url TEXT;

-- 3. Create index for faster token validation
CREATE INDEX IF NOT EXISTS idx_install_tokens_token ON install_tokens(token);
CREATE INDEX IF NOT EXISTS idx_install_tokens_user_id ON install_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_install_tokens_gateway_url ON install_tokens(gateway_url);

-- 4. Verify the changes
SELECT 'Profiles columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';

SELECT 'Install tokens columns:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'install_tokens';
