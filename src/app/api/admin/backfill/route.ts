import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createOrUpdateEntitlement } from '@/lib/entitlements';
import { createServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 60;

const VALID_PRODUCTS = ['osce', 'quiz', 'bundle'] as const;
type Product = (typeof VALID_PRODUCTS)[number];

export async function POST() {
  const { userId } = await auth();
  const operatorId = process.env.LAUREN_CLERK_USER_ID?.trim();
  if (!userId || !operatorId || userId !== operatorId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const supabase = createServiceClient();
  const results = { entitlements: 0, purchases: 0, skipped: 0, errors: 0 };

  let startingAfter: string | undefined;

  // Paginate through every Stripe checkout session ever created
  while (true) {
    const page = await stripe.checkout.sessions.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const session of page.data) {
      // Only process fully paid sessions
      if (session.payment_status !== 'paid') {
        results.skipped++;
        continue;
      }

      try {
        // Support both old metadata key (product_key) and new (product)
        const rawProduct =
          session.metadata?.product ?? session.metadata?.product_key;

        if (!rawProduct || !VALID_PRODUCTS.includes(rawProduct as Product)) {
          results.skipped++;
          continue;
        }

        const product      = rawProduct as Product;
        const clerkUserId  = session.metadata?.clerk_user_id ?? null;
        const guestEmail   =
          session.metadata?.guest_email ||
          session.customer_email ||
          session.customer_details?.email ||
          null;

        if (clerkUserId) {
          // Signed-in user — ensure entitlements exist (idempotent upsert)
          const toCreate: Product[] =
            product === 'bundle' ? ['osce', 'quiz', 'bundle'] : [product];

          for (const p of toCreate) {
            await createOrUpdateEntitlement(
              clerkUserId,
              p,
              (session.customer as string) ?? null,
              null,
              null,
            );
            results.entitlements++;
          }
        } else {
          // Guest — store as unclaimed purchase so the success-page claim flow can pick it up.
          // ignoreDuplicates: true preserves already-claimed rows.
          const { error } = await supabase.from('purchases').upsert(
            [{
              stripe_session_id:        session.id,
              stripe_payment_intent_id: (session.payment_intent as string) ?? null,
              customer_email:           guestEmail,
              product_key:              product,
              amount_total:             session.amount_total,
              currency:                 session.currency,
              status:                   'unclaimed',
            }],
            { onConflict: 'stripe_session_id', ignoreDuplicates: true },
          );

          if (error) {
            console.error('Backfill purchase upsert error', session.id, error);
            results.errors++;
          } else {
            results.purchases++;
          }
        }
      } catch (e) {
        console.error('Backfill error for session', session.id, e);
        results.errors++;
      }
    }

    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1].id;
  }

  return NextResponse.json({ ok: true, ...results });
}
