import { NextRequest, NextResponse } from 'next/server';
import { accountEmail, exchangeCode, redirectUri, saveAuth, verifyState } from '@/lib/operatorGoogle';

/**
 * Where Google sends the browser back after consent.
 *
 * This one cannot check the operator password — it is a redirect from Google,
 * not a call from the dashboard. The signed `state` minted at the start of the
 * flow is what proves the round trip began with an authenticated operator.
 *
 * Every exit lands back on /operator with a short code in the query, so the
 * dashboard can say what happened rather than leaving a bare JSON page.
 */

export const dynamic = 'force-dynamic';

function back(req: NextRequest, params: Record<string, string>) {
  const url = new URL('/operator', redirectUri(req));
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const denied = url.searchParams.get('error');
  if (denied) return back(req, { google: 'denied', detail: denied });

  if (!verifyState(url.searchParams.get('state'))) {
    return back(req, { google: 'bad_state' });
  }

  const code = url.searchParams.get('code');
  if (!code) return back(req, { google: 'no_code' });

  const result = await exchangeCode(code, redirectUri(req));
  if (!result.ok) {
    return back(req, { google: 'exchange_failed', detail: result.description || result.error });
  }

  try {
    await saveAuth(result.refreshToken, await accountEmail(result.accessToken));
  } catch (e) {
    // Almost always the table not existing yet.
    return back(req, { google: 'save_failed', detail: String(e).slice(0, 160) });
  }

  return back(req, { google: 'connected' });
}
