import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkEntitlement } from '@/lib/entitlements';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ hasAccess: false });
    }

    const { searchParams } = new URL(request.url);
    const product = searchParams.get('product') as 'osce' | 'quiz';

    if (!product || !['osce', 'quiz'].includes(product)) {
      return NextResponse.json({ hasAccess: false });
    }

    const hasAccess = await checkEntitlement(userId, product);

    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Check access error:', error);
    return NextResponse.json({ hasAccess: false });
  }
}
