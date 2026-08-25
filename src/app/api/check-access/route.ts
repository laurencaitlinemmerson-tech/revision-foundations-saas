import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkEntitlement, type Product } from '@/lib/entitlements';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ hasAccess: false });
    }

    const { searchParams } = new URL(request.url);
    const product = searchParams.get('product') as Product;

    if (!product || !['osce', 'quiz', 'bundle', 'template'].includes(product)) {
      return NextResponse.json({ hasAccess: false });
    }

    const hasAccess = await checkEntitlement(userId, product);

    return NextResponse.json({ hasAccess });
  } catch (error) {
    console.error('Check access error:', error);
    return NextResponse.json({ hasAccess: false });
  }
}
