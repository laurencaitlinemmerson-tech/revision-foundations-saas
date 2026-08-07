-- Cycle tracking for the operator dashboard.
--
-- Apple Health records menstrual flow per day. Knowing where in the cycle a
-- weigh-in falls is what separates a real stall from luteal water retention,
-- so it is the single most useful field the dashboard was missing.
--
-- Safe to run more than once. Until it has been run the dashboard simply has
-- no cycle data — the sync strips the column and carries on rather than
-- failing the whole import.

alter table operator_daily_metrics
  add column if not exists menstrual_flow smallint;

comment on column operator_daily_metrics.menstrual_flow is
  'Apple Health menstrual flow for the day: 0 none, 1 light, 2 medium, 3 heavy. Null when not recorded.';
