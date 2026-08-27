-- Operator training plan — one row per weekday, the week you intend to train.
--
-- Nothing syncs a plan: Apple Health records what happened, never what was meant
-- to happen. Without this the dashboard can only ever report backwards, and
-- "three sessions this week" has no answer to "out of how many".
--
-- A repeating weekly template rather than dated entries, because that is how the
-- week is actually decided — the same shape every week until it changes — and a
-- dated calendar would need filling in forever to stay useful.

CREATE TABLE IF NOT EXISTS operator_plan (
    -- 1 Monday through 7 Sunday, matching ISO weekday numbering.
    weekday SMALLINT PRIMARY KEY CHECK (weekday BETWEEN 1 AND 7),
    -- 'strength' | 'cardio' | 'other' | 'rest'
    kind TEXT NOT NULL DEFAULT 'rest',
    label TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reached only through the operator API, which gates on OPERATOR_PASSWORD and
-- uses the service role key, so row-level policies would never be consulted.
ALTER TABLE operator_plan ENABLE ROW LEVEL SECURITY;
