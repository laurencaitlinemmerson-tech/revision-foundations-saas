-- Run this once in your Supabase SQL editor to enable daily Apple Health
-- metrics (activity, heart, sleep) and workout sessions for the operator
-- dashboard. Body composition continues to live in operator_fitness_readings.

CREATE TABLE IF NOT EXISTS operator_daily_metrics (
  date                  date         PRIMARY KEY,

  -- Activity
  steps                 integer,
  active_energy_kcal    numeric(7,1),
  exercise_minutes      integer,
  stand_hours           integer,
  distance_km           numeric(6,2),

  -- Heart
  resting_hr            integer,
  hrv_ms                numeric(6,1),
  walking_hr_avg        integer,
  vo2_max               numeric(5,2),

  -- Sleep (minutes)
  sleep_total_min       integer,
  sleep_in_bed_min      integer,
  sleep_rem_min         integer,
  sleep_deep_min        integer,
  sleep_core_min        integer,
  sleep_awake_min       integer,

  updated_at            timestamptz  NOT NULL DEFAULT now()
);

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
