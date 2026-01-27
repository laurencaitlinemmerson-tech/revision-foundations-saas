# Revision Foundations SaaS - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Accounts created for:
  - [Clerk](https://clerk.com) - Authentication
  - [Stripe](https://stripe.com) - Payments
  - [Supabase](https://supabase.com) - Database
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

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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

### Database not connecting
- Verify Supabase URL and keys
- Check if the schema has been applied
- Ensure RLS policies allow access

---

## Support

Questions? Contact us at hello@revisionfoundations.com
