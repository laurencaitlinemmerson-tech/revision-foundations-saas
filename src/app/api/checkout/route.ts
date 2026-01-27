import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, ProductKey } from '@/lib/stripe';

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

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { product } = body as { product: ProductKey };

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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await createCheckoutSession(
      product,
      userId,
      user.emailAddresses[0].emailAddress,
      `${appUrl}/success?product=${product}`,
      `${appUrl}/pricing?cancelled=true`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
