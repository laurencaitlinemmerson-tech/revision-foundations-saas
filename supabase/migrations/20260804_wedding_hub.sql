-- ============================================================
-- Wedding hub — maid-of-honour planning. Run once in the
-- Supabase SQL editor, after 20260803_operator_dashboard.sql.
--
-- Same posture as the operator tables: personal data for a single
-- user, RLS on with no policies, so nothing is reachable through the
-- anon or authenticated keys. The hub reads them with the service
-- role from the server only, behind the same link gate.
-- ============================================================

-- The wedding itself, a single row ------------------------------------
CREATE TABLE IF NOT EXISTS wedding_settings (
  id              int          PRIMARY KEY DEFAULT 1,
  bride_name      text         NOT NULL DEFAULT '',
  partner_name    text         NOT NULL DEFAULT '',
  wedding_date    date,
  venue           text         NOT NULL DEFAULT '',
  hen_date        date,
  hen_location    text         NOT NULL DEFAULT '',
  -- What the maid of honour has personally committed to spend, so the
  -- budget section can show a ceiling rather than just a running total.
  budget_cap      numeric(10,2),
  currency        text         NOT NULL DEFAULT 'GBP',
  updated_at      timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT wedding_settings_single_row CHECK (id = 1)
);

INSERT INTO wedding_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Tasks, grouped by how far out they belong -----------------------------
CREATE TABLE IF NOT EXISTS wedding_tasks (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text         NOT NULL,
  -- Free text rather than an enum: the phases people actually use vary
  -- ("12 months out", "week of", "on the day"), and a CHECK here would
  -- mean a migration every time one is renamed.
  phase       text         NOT NULL DEFAULT 'Anytime',
  due_date    date,
  done        boolean      NOT NULL DEFAULT false,
  -- Hen-do tasks live in the same table, flagged, so the checklist can
  -- show everything together or filter to just the hen.
  is_hen      boolean      NOT NULL DEFAULT false,
  notes       text,
  sort_order  integer      NOT NULL DEFAULT 0,
  created_at  timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS wedding_tasks_due_idx ON wedding_tasks (due_date);

-- Bridal party and vendors, one table ----------------------------------
CREATE TABLE IF NOT EXISTS wedding_contacts (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text         NOT NULL,
  -- 'party' = bridesmaid/usher/etc, 'vendor' = florist/photographer/etc.
  kind        text         NOT NULL DEFAULT 'party'
                           CHECK (kind IN ('party', 'vendor')),
  role        text         NOT NULL DEFAULT '',
  phone       text,
  email       text,
  -- Dress size / fitting notes for the party; booking refs for vendors.
  detail      text,
  attending_hen boolean    NOT NULL DEFAULT false,
  created_at  timestamptz  NOT NULL DEFAULT now()
);

-- Costs, covering both the wedding and the hen -------------------------
CREATE TABLE IF NOT EXISTS wedding_costs (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  label       text         NOT NULL,
  amount      numeric(10,2) NOT NULL DEFAULT 0,
  -- Who is actually out of pocket — 'me' totals against the budget cap.
  payer       text         NOT NULL DEFAULT 'me',
  paid        boolean      NOT NULL DEFAULT false,
  is_hen      boolean      NOT NULL DEFAULT false,
  due_date    date,
  created_at  timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS wedding_costs_due_idx ON wedding_costs (due_date);

-- Lock everything to the service role ----------------------------------
ALTER TABLE wedding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_tasks    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_costs    ENABLE ROW LEVEL SECURITY;
