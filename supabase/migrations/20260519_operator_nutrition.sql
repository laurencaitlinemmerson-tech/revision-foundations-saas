-- Adds MyFitnessPal-style nutrition columns to operator_daily_metrics.
-- MFP writes these to Apple Health, Health Auto Export forwards them.

ALTER TABLE operator_daily_metrics
  ADD COLUMN IF NOT EXISTS dietary_energy_kcal numeric(7,1),
  ADD COLUMN IF NOT EXISTS protein_g           numeric(6,1),
  ADD COLUMN IF NOT EXISTS carbs_g             numeric(6,1),
  ADD COLUMN IF NOT EXISTS fat_g               numeric(6,1),
  ADD COLUMN IF NOT EXISTS fiber_g             numeric(5,1),
  ADD COLUMN IF NOT EXISTS sugar_g             numeric(6,1),
  ADD COLUMN IF NOT EXISTS water_ml            numeric(7,1);
