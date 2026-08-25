import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { checkEntitlement } from '@/lib/entitlements';

// The Notion "Duplicate template" URL. Server-side only — it is never sent to
// the browser unless the signed-in user actually owns the template, because
// anyone holding this link can duplicate the template for free.
const TEMPLATE_URL = process.env.NOTION_TEMPLATE_URL;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const hasAccess = await checkEntitlement(userId, 'template');

    if (!hasAccess) {
      return NextResponse.json({ hasAccess: false }, { status: 403 });
    }

    if (!TEMPLATE_URL) {
      console.error('NOTION_TEMPLATE_URL is not configured');
      return NextResponse.json(
        { hasAccess: true, error: 'Template link not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({ hasAccess: true, url: TEMPLATE_URL });
  } catch (error) {
    console.error('Template link error:', error);
    return NextResponse.json({ hasAccess: false }, { status: 500 });
  }
}
