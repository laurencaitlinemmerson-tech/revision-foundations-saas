-- Study sessions — one row per user per calendar date.
-- Any activity (hub page, quiz, OSCE) upserts today's row. Powers streaks,
-- days-active, and future email nudges.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT NOT NULL,
    study_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(clerk_user_id, study_date)
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user
    ON study_sessions(clerk_user_id);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date
    ON study_sessions(clerk_user_id, study_date DESC);
