-- Partner daily summary — one row per person per day.
--
-- The head-to-head screen compares two people, but only one of them syncs Apple
-- Health into this project. This table is the other side: a small daily summary
-- that can be typed in, pasted from a phone, or posted by a shortcut, holding
-- exactly the fields the comparison needs and nothing more.
--
-- `person` is carried so a third name can be added later without a migration.
-- The unique constraint on (person, date) makes a re-send an update rather than
-- a duplicate, which matters because these rows get re-posted as a day fills in.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS operator_partner_days (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    person TEXT NOT NULL DEFAULT 'partner',
    date DATE NOT NULL,

    steps INTEGER,
    gym_sessions INTEGER,
    runs INTEGER,

    calories_in INTEGER,
    calories_out INTEGER,
    protein_g NUMERIC(6, 1),
    carbs_g NUMERIC(6, 1),
    fat_g NUMERIC(6, 1),

    sleep_min INTEGER,
    weight_kg NUMERIC(5, 1),
    body_fat NUMERIC(4, 1),

    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_operator_partner_person_date
    ON operator_partner_days(person, date);

CREATE INDEX IF NOT EXISTS idx_operator_partner_date
    ON operator_partner_days(date DESC);

-- Reached only through the operator API, which gates on OPERATOR_PASSWORD and
-- uses the service role key, so row-level policies would never be consulted.
ALTER TABLE operator_partner_days ENABLE ROW LEVEL SECURITY;
