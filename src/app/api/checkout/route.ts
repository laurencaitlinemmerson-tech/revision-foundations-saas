import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRODUCTS, ProductKey } from '@/lib/stripe';
import { upsertClerkUser } from '@/lib/clerkUsers';

export async function POST(request: NextRequest) {
  try {
    // Validate Stripe keys are configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    // Warn if using test keys in production
    const isProduction = process.env.NODE_ENV === 'production';
    const isTestKey = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
    if (isProduction && isTestKey) {
      console.warn('WARNING: Using Stripe TEST keys in production environment');
    }

    const body = await request.json();
    const { product, guestEmail } = body as { product: ProductKey; guestEmail?: string };

    if (!product || !['osce', 'quiz', 'bundle'].includes(product)) {
      return NextResponse.json(
        { error: 'Invalid product' },
        { status: 400 }
      );
    }

    // Validate price IDs are configured
    const priceIdEnvVar = product === 'osce'
      ? 'STRIPE_OSCE_PRICE_ID'
      : product === 'quiz'
      ? 'STRIPE_QUIZ_PRICE_ID'
      : 'STRIPE_BUNDLE_PRICE_ID';
    const priceId = process.env[priceIdEnvVar];
    if (!priceId) {
      console.error(`${priceIdEnvVar} is not configured`);
      return NextResponse.json(
        { error: 'Product pricing not configured' },
        { status: 500 }
      );
    }

    // Check if user is signed in
    const { userId } = await auth();
    let customerEmail = guestEmail || '';
    let clerkUserId = userId || '';

    // If signed in, get their email
    if (userId) {
      const user = await currentUser();
      if (user?.emailAddresses?.[0]?.emailAddress) {
        customerEmail = user.emailAddresses[0].emailAddress;
      }
      if (user) {
        const email = user.emailAddresses?.[0]?.emailAddress ?? null;
        const firstName = user.firstName ?? null;
        const lastName = user.lastName ?? null;
        const username = user.username ?? null;
        const fullName = [firstName, lastName].filter(Boolean).join(' ') || null;
        await upsertClerkUser({
          clerkUserId: userId,
          email,
          firstName,
          lastName,
          fullName,
          username,
        });
      }
  }
    // For guest checkout, email is required
    if (!userId && !guestEmail) {
      return NextResponse.json(
        { error: 'Email required for guest checkout' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const productInfo = PRODUCTS[product];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: productInfo.priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success?product=${product}`,
      cancel_url: `${appUrl}/pricing?cancelled=true`,
      customer_email: customerEmail,
      metadata: {
        clerk_user_id: clerkUserId,
        product: product,
        guest_email: guestEmail || '',
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);

    // Provide more specific error messages
    let errorMessage = 'Failed to create checkout session';
    if (error?.message?.includes('price')) {
      errorMessage = 'Product price not configured correctly';
    } else if (error?.message?.includes('No such price')) {
      errorMessage = 'Invalid price configuration - please contact support';
    }

    return NextResponse.json(
      { error: errorMessage, details: error?.message },
      { status: 500 }
    );
  }
}
