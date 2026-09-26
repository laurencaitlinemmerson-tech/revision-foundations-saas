-- Operator state — small key/value store so ticks, notes and logs follow you
-- between phone and laptop instead of living in one browser's localStorage.
--
-- One row per key (e.g. 'study.topics', 'nursing.shiftlog'), the value is JSON.
-- Last write wins per key; `updated_at` lets a device tell whether its local
-- copy or the server copy is newer.
--
-- Run this once in the Supabase SQL editor. Until it exists the operator pages
-- keep working and save to this browser only.

CREATE TABLE IF NOT EXISTS operator_state (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reached only through the operator API, which gates on OPERATOR_PASSWORD and
-- uses the service role key, so row-level policies would never be consulted.
ALTER TABLE operator_state ENABLE ROW LEVEL SECURITY;
