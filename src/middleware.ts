import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse, type NextRequest } from 'next/server';
import {
  OPERATOR_COOKIE,
  OPERATOR_KEY_PARAM,
  isValidAccessKey,
  mintOperatorToken,
  operatorCookieOptions,
  verifyOperatorToken,
} from '@/lib/operator/access';

/**
 * The operator dashboard is link-only: arriving with `?k=<secret>` swaps
 * the key for a signed HttpOnly cookie and redirects to a clean URL, so
 * the secret never sticks around in history, referrers or analytics.
 *
 * Authorisation itself happens server-side in the page and API routes —
 * this only handles the hand-off.
 */
async function handleOperatorLink(request: NextRequest) {
  const key = request.nextUrl.searchParams.get(OPERATOR_KEY_PARAM);
  if (!key) return null;
  if (!(await isValidAccessKey(key))) return null;

  const token = await mintOperatorToken();
  if (!token) return null;

  const destination = request.nextUrl.clone();
  destination.searchParams.delete(OPERATOR_KEY_PARAM);

  const response = NextResponse.redirect(destination);
  response.cookies.set(OPERATOR_COOKIE, token, operatorCookieOptions());
  return response;
}

export default clerkMiddleware(async (_auth, request) => {
  if (request.nextUrl.pathname.startsWith('/operator')) {
    const response = await handleOperatorLink(request);
    if (response) return response;

    // Turn away unauthorised visitors here rather than in the page.
    // A dynamic page streams its shell before `notFound()` can run, so
    // it answers 200 with 404 content — which tells anyone probing that
    // the route exists. Rewriting to a path with no route produces the
    // same 404 as any other bad URL, which is the whole point.
    if (!(await verifyOperatorToken(request.cookies.get(OPERATOR_COOKIE)?.value))) {
      return NextResponse.rewrite(new URL('/operator-no-such-page', request.url));
    }
  }
  return undefined;
});

export const config = {
  matcher: [
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
    '/apps/(.*)',
  ],
};
