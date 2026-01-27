import Stripe from 'stripe';

// Validate Stripe configuration
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY environment variable is not set');
}

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

// Log Stripe mode on initialization (useful for debugging)
if (stripeSecretKey) {
  const mode = stripeSecretKey.startsWith('sk_live_') ? 'LIVE' : 'TEST';
  console.log(`Stripe initialized in ${mode} mode`);
}

export const PRODUCTS = {
  osce: {
    name: "Children's OSCE Tool",
    description: 'Full access to all OSCE stations, checklists, and exam mode',
    priceId: process.env.STRIPE_OSCE_PRICE_ID!,
    price: 4.99,
  },
  quiz: {
    name: 'Nursing Theory Quiz',
    description: 'Full access to all quiz topics, questions, and progress tracking',
    priceId: process.env.STRIPE_QUIZ_PRICE_ID!,
    price: 4.99,
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

export async function createCheckoutSession(
  product: ProductKey,
  clerkUserId: string,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const productInfo = PRODUCTS[product];

  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // One-time payment
    payment_method_types: ['card'],
    line_items: [
      {
        price: productInfo.priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: {
      clerk_user_id: clerkUserId,
      product: product,
    },
    allow_promotion_codes: true,
  });

  return session;
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}
