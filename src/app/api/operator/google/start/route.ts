import { NextRequest, NextResponse } from 'next/server';
import { consentUrl, googleClientConfigured, redirectUri, signState } from '@/lib/operatorGoogle';

/**
 * Begins the Google Calendar connection.
 *
 * Returns the consent URL rather than redirecting, because the operator
 * password lives in localStorage and can only be sent on a fetch — the browser
 * navigates itself once it has the URL back.
 */

export const dynamic = 'force-dynamic';

function authed(req: NextRequest) {
  const pw = req.headers.get('x-operator-pw') ?? '';
  return pw === (process.env.OPERATOR_PASSWORD ?? 'operator2026');
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!googleClientConfigured()) {
    return NextResponse.json(
      {
        error: 'unconfigured',
        detail: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set on this deployment.',
      },
      { status: 400 },
    );
  }

  const redirect = redirectUri(req);
  return NextResponse.json({ url: consentUrl(redirect, signState()), redirectUri: redirect });
}

/**
 * The exact string that has to be registered on the OAuth client. Surfaced so
 * the dashboard can show it instead of making the operator guess at it.
 */
export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ redirectUri: redirectUri(req), configured: googleClientConfigured() });
}
