import { NextResponse, type NextRequest } from 'next/server';
import { OPERATOR_COOKIE } from '@/lib/operator/access';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Sign out — drop the cookie and go back to the public site. */
export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url), { status: 303 });
  response.cookies.delete(OPERATOR_COOKIE);
  return response;
}
