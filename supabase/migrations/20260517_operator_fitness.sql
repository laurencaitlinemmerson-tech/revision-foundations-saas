-- Run this once in your Supabase SQL editor to enable cloud persistence
-- for the operator fitness tracker.

CREATE TABLE IF NOT EXISTS operator_fitness_readings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date        timestamptz NOT NULL,
  weight      numeric(5,2) NOT NULL,
  bmi         numeric(4,1) NOT NULL,
  body_fat    numeric(4,1) NOT NULL,
  water       numeric(4,1) NOT NULL,
  muscle_mass numeric(4,1) NOT NULL,
  bone_mass   numeric(4,2) NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operator_fitness_goal (
  id          int PRIMARY KEY DEFAULT 1,
  target_weight numeric(5,2) NOT NULL DEFAULT 60.0,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Seed one goal row (upsert-safe)
INSERT INTO operator_fitness_goal (id, target_weight)
VALUES (1, 60.0)
ON CONFLICT (id) DO NOTHING;
