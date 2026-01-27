-- Supabase Schema for Revision Foundations
-- Run this in the Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Entitlements table - tracks user purchases
CREATE TABLE IF NOT EXISTS entitlements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL,
    product TEXT NOT NULL CHECK (product IN ('osce', 'quiz', 'bundle')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    stripe_customer_id TEXT,
    stripe_payment_intent_id TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Ensure one entitlement per product per user
    UNIQUE(clerk_user_id, product)
);

-- Create index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_entitlements_clerk_user_id ON entitlements(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_stripe_customer_id ON entitlements(stripe_customer_id);

-- Users table (optional - for additional user data)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);

-- Quiz progress tracking (optional - for future features)
CREATE TABLE IF NOT EXISTS quiz_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    questions_attempted INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    last_attempted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(clerk_user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_progress_clerk_user_id ON quiz_progress(clerk_user_id);

-- OSCE progress tracking (optional - for future features)
CREATE TABLE IF NOT EXISTS osce_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL,
    station_id TEXT NOT NULL,
    attempts INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    last_attempted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(clerk_user_id, station_id)
);

CREATE INDEX IF NOT EXISTS idx_osce_progress_clerk_user_id ON osce_progress(clerk_user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_entitlements_updated_at
    BEFORE UPDATE ON entitlements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE osce_progress ENABLE ROW LEVEL SECURITY;

-- Policy for service role (full access for API routes)
-- Note: The service role key bypasses RLS automatically

-- Policy for authenticated users to read their own data
-- These are optional if you only use the service role key
CREATE POLICY "Users can view own entitlements" ON entitlements
    FOR SELECT
    USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can view own user data" ON users
    FOR SELECT
    USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can view own quiz progress" ON quiz_progress
    FOR SELECT
    USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can view own osce progress" ON osce_progress
    FOR SELECT
    USING (auth.uid()::text = clerk_user_id);

-- Grant permissions to service role
GRANT ALL ON entitlements TO service_role;
GRANT ALL ON users TO service_role;
GRANT ALL ON quiz_progress TO service_role;
GRANT ALL ON osce_progress TO service_role;
