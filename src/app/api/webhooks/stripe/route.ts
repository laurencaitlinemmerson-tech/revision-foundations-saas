import { clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrUpdateEntitlement } from "@/lib/entitlements";
import { createServiceClient } from "@/lib/supabase";
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
             const user = await clerkClient.users.getUser(clerkUserId);
            customerName =
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              user.username ||
              null;
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
            // Create/ensure entitlement
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
          } else if (guestEmail) {
            // Guest entitlement (store name directly in upsert)
            const { error } = await supabase.from("entitlements").upsert(
              {
                clerk_user_id: "guest_" + guestEmail,
                product: p,
                status: "active",
                stripe_customer_id: (session.customer as string) ?? null,
                stripe_payment_intent_id: (session.payment_intent as string) ?? null,
                customer_name: customerName,
              },
              { onConflict: "clerk_user_id,product" }
            );

            if (error) {
              console.error("Error creating guest entitlement:", error);
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

