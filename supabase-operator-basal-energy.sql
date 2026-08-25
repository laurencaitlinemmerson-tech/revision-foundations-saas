-- Basal energy, so a day's total burn can be published.
--
-- Apple's Move ring is active energy only — a few hundred kcal. Garmin reports
-- basal + active, in the low thousands. The peer contract's `caloriesOut` is
-- total burn, so comparing an active-only figure against a Garmin total would
-- make every energy comparison meaningless, and quietly so.
--
-- The sync drops this column rather than failing if the migration has not been
-- run, so applying this is what switches the field on.

ALTER TABLE operator_daily_metrics
    ADD COLUMN IF NOT EXISTS basal_energy_kcal NUMERIC(8, 1);
