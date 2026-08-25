-- Adds the Notion template as a purchasable product.
-- Run this in the Supabase SQL Editor BEFORE taking any template payments —
-- without it the Stripe webhook will fail to write the entitlement and the
-- buyer will be charged without getting access.

ALTER TABLE entitlements DROP CONSTRAINT IF EXISTS entitlements_product_check;

ALTER TABLE entitlements
  ADD CONSTRAINT entitlements_product_check
  CHECK (product IN ('osce', 'quiz', 'bundle', 'template'));
