-- Beta Waitlist Signups
CREATE TABLE IF NOT EXISTS beta_signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    use_case TEXT,
    referral_code VARCHAR(50),
    signup_source VARCHAR(50) DEFAULT 'landing_page',
    position INTEGER,
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'invited', 'active', 'expired')),
    invited_at TIMESTAMPTZ,
    activated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_beta_signups_email ON beta_signups(email);
CREATE INDEX IF NOT EXISTS idx_beta_signups_position ON beta_signups(position);
CREATE INDEX IF NOT EXISTS idx_beta_signups_status ON beta_signups(status);

-- Auto-assign position on insert
CREATE OR REPLACE FUNCTION assign_beta_position()
RETURNS TRIGGER AS $$
BEGIN
    NEW.position = COALESCE(
        (SELECT MAX(position) FROM beta_signups WHERE status = 'waiting') + 1,
        1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_beta_position_trigger
    BEFORE INSERT ON beta_signups
    FOR EACH ROW
    WHEN (NEW.position IS NULL)
    EXECUTE FUNCTION assign_beta_position();

-- Billing Plans
CREATE TABLE IF NOT EXISTS billing_plans (
    id TEXT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    features JSONB DEFAULT '[]',
    limits JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default plans
INSERT INTO billing_plans (id, name, price_monthly, price_yearly, features, limits) VALUES
    ('free', 'Free', 0, 0, 
     '["Morning briefing", "Basic reminders", "5 commands", "1 device"]',
     '{"messages_per_day": 100, "devices": 1}'),
    ('basic', 'Básico', 4.99, 47.88,
     '["Morning briefing", "Basic reminders", "Unlimited commands", "1 device", "Support"]',
     '{"messages_per_day": 1000, "devices": 1}'),
    ('pro', 'Pro', 9.99, 95.88,
     '["Morning briefing", "Evening summary", "Unlimited commands", "Memory bank", "3 devices", "Priority support"]',
     '{"messages_per_day": -1, "devices": 3}'),
    ('teams', 'Teams', 24.99, 239.88,
     '["Everything in Pro", "Family sharing", "6 devices", "Calendar integration", "API access"]',
     '{"messages_per_day": -1, "devices": 6}')
ON CONFLICT (id) DO NOTHING;
