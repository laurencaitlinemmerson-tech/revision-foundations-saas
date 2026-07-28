import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateEntitlement } from '@/lib/entitlements';
import { createServiceClient } from '@/lib/supabase';
import { sendPurchaseConfirmation } from '@/lib/purchaseEmail';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

type Product = 'osce' | 'quiz' | 'bundle';
const VALID_PRODUCTS: Product[] = ['osce', 'quiz', 'bundle'];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Get email from Clerk directly — sessionClaims.email is not populated by default
  let email: string | null = null;
  try {
    const clerk = await clerkClient();
    const user  = await clerk.users.getUser(userId);
    email = user.emailAddresses?.[0]?.emailAddress ?? null;
  } catch {
    // Non-fatal: session-based claiming below can still work
  }

  const supabase = createServiceClient();
  const results: { product_key: string }[] = [];

  // ── 1. Email-based claiming (guest purchases stored by the webhook) ──────────
  if (email) {
    const { data: purchases } = await supabase
      .from('purchases')
      .select('*')
      .eq('customer_email', email)
      .eq('status', 'unclaimed');

    for (const purchase of purchases ?? []) {
      await createOrUpdateEntitlement(userId, purchase.product_key, null, null, null);
      await supabase
        .from('purchases')
        .update({
          status: 'claimed',
          claimed_by_clerk_user_id: userId,
          claimed_at: new Date().toISOString(),
        })
        .eq('id', purchase.id);
      results.push({ product_key: purchase.product_key });
    }
  }

  // ── 2. Stripe session fallback (catches webhook delays / failures) ───────────
  // When the success page provides the session_id, verify directly with Stripe
  // and create the entitlement even if the webhook hasn't fired yet.
  const stripeSessionId = new URL(req.url).searchParams.get('session_id');
  if (stripeSessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

      if (session.payment_status === 'paid') {
        const rawProduct =
          session.metadata?.product ?? session.metadata?.product_key;

        if (rawProduct && VALID_PRODUCTS.includes(rawProduct as Product)) {
          const product    = rawProduct as Product;
          const toCreate: Product[] =
            product === 'bundle' ? ['osce', 'quiz', 'bundle'] : [product];

          for (const p of toCreate) {
            await createOrUpdateEntitlement(
              userId,
              p,
              (session.customer as string) ?? null,
              null,
              null,
            );
            if (!results.find(r => r.product_key === p)) {
              results.push({ product_key: p });
            }
          }
        }
      }
    } catch (e) {
      console.error('Stripe session verification failed:', e);
      // Non-fatal: email claiming above may have already succeeded
    }
  }

  // Send confirmation email (fire-and-forget, only on first successful claim)
  if (results.length > 0 && email) {
    sendPurchaseConfirmation(email, results[0].product_key).catch(() => {});
  }

  return NextResponse.json({ claimed: results });
}
