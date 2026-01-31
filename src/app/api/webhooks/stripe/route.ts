import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrUpdateEntitlement } from "@/lib/entitlements";
import { createServiceClient } from "@/lib/supabase";
import { upsertClerkUser } from "@/lib/clerkUsers";
import Stripe from "stripe";

export const runtime = "nodejs";

type Product = "osce" | "quiz" | "bundle";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
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
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // ---- pull metadata ----
        const rawClerkUserId = session.metadata?.clerk_user_id;
        const clerkUserId =
          rawClerkUserId && rawClerkUserId.trim().length > 0
            ? rawClerkUserId
            : null;

        const product = session.metadata?.product as Product | undefined;
        if (!product) {
          console.error("Missing product in checkout session metadata");
          break;
        }

        // ---- decide entitlements ----
        const productsToCreate =
          product === "bundle"
            ? (["osce", "quiz", "bundle"] as const)
            : ([product] as const);

        const supabase = createServiceClient();

        // ---- resolve customer_name ----
        // Signed-in: from Clerk
        // Guest: from Stripe customer_details.name
        let customerName: string | null = null;

        if (clerkUserId) {
          try {
            const clerk = await clerkClient();
            const user = await clerk.users.getUser(clerkUserId);
            customerName =
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              user.username ||
              null;
         const email = user.emailAddresses?.[0]?.emailAddress ?? null;
            const firstName = user.firstName ?? null;
            const lastName = user.lastName ?? null;
            const username = user.username ?? null;
            const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;
            await upsertClerkUser({
              clerkUserId,
              email,
              firstName,
              lastName,
              fullName,
              username,
            });
          } catch (e) {
            console.error("Failed to fetch Clerk user for name:", e);
            customerName = null;
          }
        }

        if (!customerName) {
          customerName = session.customer_details?.name ?? null;
        }

        // ---- email for guests (your existing pattern) ----
        const guestEmail =
          session.metadata?.guest_email ??
          session.customer_email ??
          session.customer_details?.email ??
          null;

        // ---- create/update entitlements ----
        for (const p of productsToCreate) {
          if (clerkUserId) {
            // Create/ensure entitlement (idempotent)
            await createOrUpdateEntitlement(
              clerkUserId,
              p,
              (session.customer as string) ?? null,
              null,
              null
            );
            // Write customer_name into this entitlement row
            const { error } = await supabase
              .from("entitlements")
              .update({ customer_name: customerName })
              .eq("clerk_user_id", clerkUserId)
              .eq("product", p);
            if (error) {
              console.error("Error updating customer_name (signed-in):", error);
            }
          } else {
            // Guest checkout: store as unclaimed purchase
            const stripe_session_id = session.id;
            const stripe_payment_intent_id = (session.payment_intent as string) ?? null;
            const amount_total = session.amount_total || null;
            const currency = session.currency || null;
            const customer_email = guestEmail;
            const status = 'unclaimed';
            await supabase.from('purchases').upsert(
              [{
                stripe_session_id,
                stripe_payment_intent_id,
                customer_email,
                product_key: p,
                amount_total,
                currency,
                status,
              }],
              { onConflict: 'stripe_session_id' }
            );
            if (!customer_email) {
              console.warn(`Stripe webhook: guest checkout missing email for session ${stripe_session_id}`);
            }
          }
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(
          "Subscription event received (not applicable for one-time):",
          subscription.id
        );
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
