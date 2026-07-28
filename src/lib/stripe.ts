import Stripe from 'stripe';

// The Stripe client is created lazily on first use rather than at module load.
// Next.js evaluates this module while collecting page data during the build,
// where secrets may be absent — constructing eagerly would fail the build.
let client: Stripe | null = null;

function getStripe(): Stripe {
  if (client) return client;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }

  client = new Stripe(stripeSecretKey, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  });
  return client;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripe();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});


export const PRODUCTS = {
  osce: {
    name: "Children's OSCE Tool",
    description: 'Full access to all OSCE stations, checklists, and exam mode',
    priceId: process.env.STRIPE_OSCE_PRICE_ID!,
    price: 4.99,
  },
  quiz: {
    name: 'Core Nursing Quiz',
    description: 'Full access to all quiz topics, questions, and progress tracking',
    priceId: process.env.STRIPE_QUIZ_PRICE_ID!,
    price: 4.99,
  },
  bundle: {
    name: 'Complete Nursing Bundle',
    description: 'Full access to BOTH the OSCE Tool and Core Quiz - best value!',
    priceId: process.env.STRIPE_BUNDLE_PRICE_ID!,
    price: 9.99,
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
