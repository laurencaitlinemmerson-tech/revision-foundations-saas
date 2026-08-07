import { createHmac, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Loaded on demand rather than imported at the top, because supabaseAdmin
 * throws during module evaluation when its environment is missing. Starting the
 * consent flow needs no database at all, and a 500 there would hide the reason
 * behind a blank error page.
 */
async function admin() {
  const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
  return supabaseAdmin;
}

/**
 * Google Calendar connection for the operator dashboard.
 *
 * The refresh token used to be an environment variable, which made every
 * expiry a manual round trip: mint a token in the OAuth playground, paste it
 * into Vercel, redeploy. It is stored in Supabase instead, so reconnecting is a
 * button — and, because the flow runs against the dashboard's own OAuth client,
 * there is no way to mint a token under the wrong client by accident.
 *
 * GOOGLE_REFRESH_TOKEN still works and still wins, so an existing setup keeps
 * running untouched.
 */

export const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';

export type StoredAuth = {
  refreshToken: string;
  accountEmail: string | null;
  connectedAt: string | null;
  /** Where it came from, so the UI can explain what reconnecting would change. */
  source: 'stored' | 'env';
};

/** True when the OAuth client itself is configured, connected or not. */
export function googleClientConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/**
 * The connected account's refresh token.
 *
 * `setup_required` distinguishes "the table has not been created" from "nobody
 * has connected yet" — the first needs a migration, the second needs a click.
 */
export async function loadAuth(): Promise<StoredAuth | null | 'setup_required'> {
  const env = process.env.GOOGLE_REFRESH_TOKEN?.trim();
  if (env) return { refreshToken: env, accountEmail: null, connectedAt: null, source: 'env' };

  try {
    const { data, error } = await (await admin())
      .from('operator_google_auth')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (error) return 'setup_required';
    if (!data?.refresh_token) return null;
    return {
      refreshToken: String(data.refresh_token),
      accountEmail: (data.account_email as string | null) ?? null,
      connectedAt: (data.connected_at as string | null) ?? null,
      source: 'stored',
    };
  } catch {
    return 'setup_required';
  }
}

export async function saveAuth(refreshToken: string, accountEmail: string | null) {
  const { error } = await (await admin()).from('operator_google_auth').upsert(
    {
      id: 1,
      refresh_token: refreshToken,
      scope: GOOGLE_SCOPE,
      account_email: accountEmail,
      connected_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );
  if (error) throw new Error(error.message);
}

export async function clearAuth() {
  await (await admin()).from('operator_google_auth').delete().eq('id', 1);
}

/* ── redirect URI ─────────────────────────────────────────────────────────── */

/**
 * Where Google sends the browser back to.
 *
 * Derived from the request rather than configured, so it is right on preview
 * deployments and localhost as well as production — but it has to match a URI
 * registered on the OAuth client exactly, which is the one manual step left.
 */
export function redirectUri(req: Request) {
  const url = new URL(req.url);
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto');
  const host = forwardedHost ?? url.host;
  const proto = forwardedProto ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}/api/operator/google/callback`;
}

/* ── CSRF state ───────────────────────────────────────────────────────────── */

/**
 * The callback cannot carry the operator password — it is a browser redirect
 * from Google, not a fetch. So the password is checked when the flow starts,
 * and that check is carried across the round trip as a signed, expiring token.
 * Without it, anyone who found the callback URL could attach their own Google
 * account to this dashboard.
 */
const STATE_TTL_MS = 10 * 60 * 1000;

function stateKey() {
  // The service role key is always present and never leaves the server, which
  // makes it a better signing key than the operator password — that one is
  // shared with the browser on every API call.
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.OPERATOR_PASSWORD ?? 'operator';
}

export function signState() {
  const payload = `${Date.now() + STATE_TTL_MS}.${randomBytes(12).toString('hex')}`;
  const mac = createHmac('sha256', stateKey()).update(payload).digest('hex');
  return `${payload}.${mac}`;
}

export function verifyState(state: string | null): boolean {
  if (!state) return false;
  const parts = state.split('.');
  if (parts.length !== 3) return false;
  const [expRaw, nonce, mac] = parts;
  const expected = createHmac('sha256', stateKey()).update(`${expRaw}.${nonce}`).digest('hex');
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const exp = Number(expRaw);
  return Number.isFinite(exp) && Date.now() < exp;
}

/* ── token exchange ───────────────────────────────────────────────────────── */

export function consentUrl(redirect: string, state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
    redirect_uri: redirect,
    response_type: 'code',
    scope: GOOGLE_SCOPE,
    // Offline plus a forced consent screen is what makes Google return a refresh
    // token. Without the prompt it only issues one on the very first
    // authorisation, which is why re-running the playground returned an empty box.
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCode(code: string, redirect: string) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
      client_secret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
      redirect_uri: redirect,
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
  });
  const json = (await res.json().catch(() => ({}))) as {
    refresh_token?: string;
    access_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !json.refresh_token) {
    return {
      ok: false as const,
      error: json.error ?? `http_${res.status}`,
      description: json.error_description ?? (json.access_token ? 'Google returned no refresh token.' : ''),
    };
  }
  return { ok: true as const, refreshToken: json.refresh_token, accessToken: json.access_token ?? null };
}

/** Whose calendar this is, for the dashboard to display. Best effort. */
export async function accountEmail(accessToken: string | null): Promise<string | null> {
  if (!accessToken) return null;
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { email?: string };
    return json.email ?? null;
  } catch {
    return null;
  }
}
