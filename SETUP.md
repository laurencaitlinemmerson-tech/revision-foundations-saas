# The Nurse Lab SaaS - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Accounts created for:
  - [Clerk](https://clerk.com) - Authentication
  - [Stripe](https://stripe.com) - Payments
  - [Supabase](https://supabase.com) - Database
  - [Resend](https://resend.com) - Contact form email delivery
  - [Vercel](https://vercel.com) - Hosting

---

## 1. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Choose "Email" as the sign-in method
4. Copy your keys:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`

---

## 2. Supabase Setup

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Once created, go to **Settings → API**
4. Copy your keys:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

5. Run the database schema:
   - Go to **SQL Editor**
   - Copy the contents of `supabase-schema.sql`
   - Click **Run**

---

## 3. Stripe Setup

### Create Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Products**
3. Create two products:

   **Product 1: Children's OSCE Tool**
   - Name: "Children's OSCE Tool"
   - Price: £4.99 (one-time)
   - Copy the **Price ID** (starts with `price_`) → `STRIPE_OSCE_PRICE_ID`

   **Product 2: Nursing Theory Quiz**
   - Name: "Nursing Theory Quiz"
   - Price: £4.99 (one-time)
   - Copy the **Price ID** → `STRIPE_QUIZ_PRICE_ID`

### Get API Keys

4. Go to **Developers → API keys**
5. Copy your keys:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### Set Up Webhook

6. Go to **Developers → Webhooks**
7. Click **Add endpoint**
8. Enter your endpoint URL:
   - For local testing: Use [Stripe CLI](https://stripe.com/docs/stripe-cli)
   - For production: `https://your-domain.com/api/webhooks/stripe`
9. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
10. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 4. Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_OSCE_PRICE_ID=price_...
STRIPE_QUIZ_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Contact form email delivery
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=The Nurse Lab <lauren@nurselab.co.uk>
CONTACT_NOTIFICATION_TO=lauren@nurselab.co.uk

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Operator dashboard (private, link-only) — see section 4a
OPERATOR_ACCESS_KEY=
```

---

## 4a. Operator Dashboard (private)

`/operator` is a private dashboard for the studio owner: body composition,
energy balance, training, recovery, and the business pulse. It is not linked
from anywhere on the site, is excluded from the sitemap, is disallowed in
`robots.txt`, and carries `noindex`.

**Access is by secret link only — there is no login form.**

1. Generate a key (32 bytes is plenty) and set it as `OPERATOR_ACCESS_KEY`
   in `.env.local` and in Vercel:

   ```bash
   openssl rand -hex 32
   ```

   Keys shorter than 16 characters are rejected. If the variable is unset,
   `/operator` returns 404 for everyone — a missing env var never means
   "open to the world".

2. Create the tables by running
   `supabase/migrations/20260803_operator_dashboard.sql` in the Supabase SQL
   editor. Row-level security is enabled with no policies, so the tables are
   reachable only by the service role from the server. Until they exist the
   dashboard renders clearly-labelled sample data.

3. Open the dashboard once with the key in the URL:

   ```
   https://your-domain.com/operator?k=YOUR_OPERATOR_ACCESS_KEY
   ```

   Middleware swaps the key for a signed, HttpOnly, 30-day cookie and
   redirects to a clean `/operator`, so the secret never lingers in browser
   history, referrers or analytics. Bookmark the clean URL, not the one with
   the key. "Sign out" in the masthead clears the cookie.

### Feeding it data

Body-composition readings (one row per day; posting the same date replaces it):

```bash
curl -X POST https://your-domain.com/api/operator/readings \
  -H "Authorization: Bearer $OPERATOR_ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-08-03","weight":71.9,"bodyFat":26.8,"muscleMass":39.1,"water":50.6}'
```

Daily Apple Health metrics and workouts, hand-built JSON (a Shortcut, a
script). Only the fields you send are written, so a partial sync never
blanks the rest of the day:

```bash
curl -X POST https://your-domain.com/api/operator/ingest \
  -H "Authorization: Bearer $OPERATOR_ACCESS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"days":[{"date":"2026-08-03","steps":9120,"activeEnergyKcal":529,
        "dietaryEnergyKcal":2041,"proteinG":133,"sleepTotalMin":456}],
       "workouts":[{"startedAt":"2026-08-03T18:15:00Z","type":"Strength",
        "durationMin":52,"energyKcal":320,"avgHr":128}]}'
```

**Apple Health, automatically — the "Health Auto Export" app.** This is
the real sync: install [Health Auto Export – JSON+CSV](https://apps.apple.com/app/health-auto-export-json-csv/id1115567069)
on the phone that carries your Health data, then in the app:

1. **Automations → new automation → REST API**
2. `URL`: `https://your-domain.com/api/operator/healthkit`
3. `Method`: POST · `Body format`: JSON (the app's default export)
4. Add a header: `Authorization: Bearer <OPERATOR_ACCESS_KEY>`
5. Pick the metrics to include — steps, active energy, resting heart rate,
   HRV, VO2 max, sleep analysis, dietary energy/protein/carbs/fat/fibre/
   sugar/water, and workouts. (Body composition — weight, body fat, muscle,
   water — isn't part of this export; that still comes from a smart scale
   via `/api/operator/readings` above, or logged by hand on the Today tab.)
6. Set it to run automatically (hourly is plenty), or tap **Sync Now** to
   test.

The endpoint responds with `metricsSeen` and `unmatchedMetrics` so a naming
mismatch across app versions is visible rather than silent — if a metric
you enabled isn't landing, check the response body from a manual sync and
send it over, since the mapping in `src/lib/operator/healthkit.ts` is easy
to extend.

Targets and body profile (height, age, goal weight, weekly rate, protein and
step targets) live in the single `operator_settings` row — edit it in the
Supabase table editor.

---

## 5. Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Testing Stripe Locally

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy the webhook secret and update `.env.local`

Test card numbers:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

---

## 6. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Deploy!

### Post-Deployment

1. Update Stripe webhook URL to your production domain
2. Update `NEXT_PUBLIC_APP_URL` to your production URL
3. Ensure Clerk redirects are set correctly

---

## Folder Structure

```
revision-foundations-saas/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── api/
│   │   │   ├── checkout/
│   │   │   └── webhooks/stripe/
│   │   ├── about/
│   │   ├── account/
│   │   ├── contact/
│   │   ├── dashboard/
│   │   ├── osce/
│   │   ├── pricing/
│   │   ├── quiz/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── LockedContent.tsx
│   │   └── Navbar.tsx
│   ├── lib/
│   │   ├── entitlements.ts
│   │   ├── stripe.ts
│   │   └── supabase.ts
│   └── middleware.ts
├── supabase-schema.sql
├── .env.local.example
├── SETUP.md
└── package.json
```

---

## Troubleshooting

### "Clerk is not configured"
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- Restart the dev server after adding env vars

### Stripe webhook not working
- Check the webhook secret is correct
- Ensure the endpoint URL is accessible
- Check Stripe Dashboard → Webhooks → Recent deliveries

### Contact form not reaching your inbox
- Ensure `RESEND_API_KEY` is set in local and Vercel environments
- Verify the sending domain/address used in `CONTACT_FROM_EMAIL` inside Resend
- Confirm `CONTACT_NOTIFICATION_TO` points to the inbox you want notified
- Check Vercel function logs for `Contact submission saved but email delivery failed`

### Database not connecting
- Verify Supabase URL and keys
- Check if the schema has been applied
- Ensure RLS policies allow access

---

## Support

Questions? Contact us at hello@revisionfoundations.com
