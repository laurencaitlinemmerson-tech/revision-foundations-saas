-- Operator lift log — one row per exercise per session.
--
-- Apple Health records that a workout happened, not what was lifted in it, so
-- sets/reps/load have to live here. This is what makes total volume, per-session
-- set detail and per-movement personal bests possible.
--
-- Sets are stored as JSONB rather than a child table: they are always read and
-- written together with their exercise, and never queried across rows.
--   [{ "reps": 6, "weightKg": 62.5 }, { "reps": 6, "weightKg": 62.5 }]

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS operator_lifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    performed_on DATE NOT NULL,
    exercise TEXT NOT NULL,
    sets JSONB NOT NULL DEFAULT '[]'::jsonb,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_operator_lifts_date
    ON operator_lifts(performed_on DESC);

CREATE INDEX IF NOT EXISTS idx_operator_lifts_exercise
    ON operator_lifts(exercise, performed_on DESC);

-- Reached only through the operator API, which gates on OPERATOR_PASSWORD and
-- uses the service role key, so row-level policies would never be consulted.
ALTER TABLE operator_lifts ENABLE ROW LEVEL SECURITY;
