import { clerkClient } from "@clerk/nextjs/server";
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createOrUpdateEntitlement } from '@/lib/entitlements';
import { createServiceClient } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        const clerkUserId = session.metadata?.clerk_user_id;
        const guestEmail = session.metadata?.guest_email || session.customer_email;
        const product = session.metadata?.product as 'osce' | 'quiz' | 'bundle';

        if (!product) {
          console.error('Missing product in checkout session metadata');
          break;
        }

        // Handle bundle - create entitlements for both products
        const productsToCreate = product === 'bundle'
          ? ['osce', 'quiz', 'bundle'] as const
          : [product] as const;

        const supabase = createServiceClient();

        for (const p of productsToCreate) {
          if (clerkUserId) {
            // Signed-in user purchase
            await createOrUpdateEntitlement(
              clerkUserId,
              p,
              session.customer as string,
              null, // No subscription for one-time
              null  // Lifetime access
            );
            console.log(`Entitlement created for user ${clerkUserId}, product ${p}`);
          } else if (guestEmail) {
            // Guest purchase - store with email
            const { error } = await supabase
              .from('entitlements')
              .upsert({
                clerk_user_id: `guest_${guestEmail}`, // Prefix to identify guest
                product: p,
                status: 'active',
                stripe_customer_id: session.customer as string,
                stripe_payment_intent_id: session.payment_intent as string,
              }, {
                onConflict: 'clerk_user_id,product'
              });

            if (error) {
              console.error('Error creating guest entitlement:', error);
            } else {
              console.log(`Guest entitlement created for ${guestEmail}, product ${p}`);
            }
          }
        }

        // TODO: Send access email to guest users
        if (guestEmail && !clerkUserId) {
          console.log(`Should send access email to ${guestEmail}`);
          // In future: integrate with email service (Resend, SendGrid, etc.)
        }

        break;
      }

      case 'customer.subscription.deleted': {
        // Not needed for one-time payments, but keeping for future
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Subscription ${subscription.id} event received (not applicable for one-time)`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
