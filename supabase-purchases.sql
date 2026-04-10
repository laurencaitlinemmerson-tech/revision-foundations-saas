-- purchases.sql

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  customer_email text,
  product_key text not null,
  amount_total bigint,
  currency text,
  status text not null check (status in ('unclaimed', 'claimed')),
  claimed_by_clerk_user_id text,
  created_at timestamptz not null default now(),
  claimed_at timestamptz,
  constraint unique_unclaimed_email_product unique (customer_email, product_key, status)
);

create index if not exists idx_purchases_email_status on purchases (customer_email, status);
create index if not exists idx_purchases_claimed_by on purchases (claimed_by_clerk_user_id);

-- Ensure entitlements table has unique constraint
alter table entitlements
  add constraint unique_entitlement_per_user_product unique (clerk_user_id, product_key);