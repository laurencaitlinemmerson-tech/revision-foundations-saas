-- ============================================================
-- Operator dashboard — private, link-only. Run once in the
-- Supabase SQL editor.
--
-- These tables hold personal data for a single operator, so RLS is
-- enabled with no policies: nothing reaches them through the anon or
-- authenticated keys. The dashboard reads them with the service role
-- from the server only, behind the link gate.
-- ============================================================

-- Body composition, one row per weigh-in -----------------------------
CREATE TABLE IF NOT EXISTS operator_fitness_readings (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date         NOT NULL,
  weight      numeric(5,2) NOT NULL,
  bmi         numeric(4,1) NOT NULL DEFAULT 0,
  body_fat    numeric(4,1) NOT NULL DEFAULT 0,
  water       numeric(4,1) NOT NULL DEFAULT 0,
  muscle_mass numeric(4,1) NOT NULL DEFAULT 0,
  bone_mass   numeric(4,2) NOT NULL DEFAULT 0,
  created_at  timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (date)
);

CREATE INDEX IF NOT EXISTS operator_fitness_readings_date_idx
  ON operator_fitness_readings (date DESC);

-- Daily Apple Health + nutrition rollup ------------------------------
CREATE TABLE IF NOT EXISTS operator_daily_metrics (
  date                  date         PRIMARY KEY,

  steps                 integer,
  active_energy_kcal    numeric(7,1),
  exercise_minutes      integer,
  stand_hours           integer,
  distance_km           numeric(6,2),

  resting_hr            integer,
  hrv_ms                numeric(6,1),
  walking_hr_avg        integer,
  vo2_max               numeric(5,2),

  sleep_total_min       integer,
  sleep_in_bed_min      integer,
  sleep_rem_min         integer,
  sleep_deep_min        integer,
  sleep_core_min        integer,
  sleep_awake_min       integer,

  dietary_energy_kcal   numeric(7,1),
  protein_g             numeric(6,1),
  carbs_g               numeric(6,1),
  fat_g                 numeric(6,1),
  fiber_g               numeric(5,1),
  sugar_g               numeric(6,1),
  water_ml              numeric(7,1),

  updated_at            timestamptz  NOT NULL DEFAULT now()
);

-- Individual training sessions ---------------------------------------
CREATE TABLE IF NOT EXISTS operator_workouts (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at    timestamptz  NOT NULL,
  ended_at      timestamptz,
  type          text,
  duration_min  numeric(6,1),
  energy_kcal   numeric(7,1),
  avg_hr        integer,
  max_hr        integer,
  distance_km   numeric(6,2),
  source        text,
  raw           jsonb,
  created_at    timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (started_at, type)
);

CREATE INDEX IF NOT EXISTS operator_workouts_started_at_idx
  ON operator_workouts (started_at DESC);

-- Targets and body profile, a single row -----------------------------
CREATE TABLE IF NOT EXISTS operator_settings (
  id                int          PRIMARY KEY DEFAULT 1,
  height_cm         numeric(5,1) NOT NULL DEFAULT 157.5,
  age_years         integer      NOT NULL DEFAULT 26,
  sex               text         NOT NULL DEFAULT 'female'
                                 CHECK (sex IN ('female', 'male')),
  target_weight_kg  numeric(5,2) NOT NULL DEFAULT 60.0,
  weekly_change_kg  numeric(4,2) NOT NULL DEFAULT 0.5,
  neat_factor       numeric(4,3) NOT NULL DEFAULT 0.25,
  protein_target_g  numeric(6,1) NOT NULL DEFAULT 120,
  step_target       integer      NOT NULL DEFAULT 8000,
  sleep_target_min  integer      NOT NULL DEFAULT 450,
  water_target_ml   integer      NOT NULL DEFAULT 2000,
  updated_at        timestamptz  NOT NULL DEFAULT now(),
  CONSTRAINT operator_settings_single_row CHECK (id = 1)
);

INSERT INTO operator_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Lock the tables to the service role --------------------------------
ALTER TABLE operator_fitness_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_daily_metrics    ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_workouts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_settings         ENABLE ROW LEVEL SECURITY;

-- Progress photos ----------------------------------------------------
-- Rows point at objects in the private `operator-photos` storage
-- bucket; the dashboard mints short-lived signed URLs server-side, so
-- the images are never publicly addressable.
--
-- Create the bucket once (Storage → New bucket → name: operator-photos,
-- Public: OFF), then run this file.
CREATE TABLE IF NOT EXISTS operator_photos (
  id          uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date         NOT NULL,
  slot        text         NOT NULL,
  path        text         NOT NULL,
  weight_kg   numeric(5,2),
  note        text,
  created_at  timestamptz  NOT NULL DEFAULT now(),
  UNIQUE (slot)
);

CREATE INDEX IF NOT EXISTS operator_photos_date_idx ON operator_photos (date DESC);

ALTER TABLE operator_photos ENABLE ROW LEVEL SECURITY;
