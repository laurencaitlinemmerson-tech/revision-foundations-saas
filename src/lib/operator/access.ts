/* ============================================================
   access.ts — link-only gate for the operator dashboard
   ============================================================

   The dashboard is not behind Clerk and is never linked from the
   site. Access is granted purely by knowing a secret link:

       https://<site>/operator?k=<OPERATOR_ACCESS_KEY>

   Middleware validates `k`, swaps it for a signed HttpOnly cookie,
   and redirects to a clean `/operator` so the secret never lingers
   in browser history, referrers or analytics. Every later request
   is authorised by the cookie alone.

   If OPERATOR_ACCESS_KEY is unset the route is dead — the page
   404s for everyone, including us. That is the safe default: a
   missing env var must never mean "open to the world".

   Uses Web Crypto so the exact same module runs in the edge
   middleware and in Node route handlers.
   ============================================================ */

export const OPERATOR_COOKIE = 'nl_operator';
export const OPERATOR_KEY_PARAM = 'k';

/** How long a link-granted session stays valid. */
export const OPERATOR_SESSION_DAYS = 30;

const TOKEN_VERSION = 'v1';
const MIN_KEY_LENGTH = 16;

const encoder = new TextEncoder();

/**
 * The shared secret. Returns null when unset or too weak to be
 * worth trusting, which collapses the whole route to a 404.
 */
export function getOperatorKey(): string | null {
  const key = process.env.OPERATOR_ACCESS_KEY;
  if (!key || key.length < MIN_KEY_LENGTH) return null;
  return key;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256Hex(value: string): Promise<string> {
  return toHex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

/** Constant-time comparison of two equal-length hex digests. */
function digestsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Compare a candidate key against the configured one. Both sides are
 * hashed first so the comparison is constant-time even when the
 * candidate is a different length to the real key.
 */
export async function isValidAccessKey(candidate: string | null | undefined): Promise<boolean> {
  const key = getOperatorKey();
  if (!key || !candidate) return false;
  const [a, b] = await Promise.all([sha256Hex(candidate), sha256Hex(key)]);
  return digestsMatch(a, b);
}

/** Mint a signed, expiring session token to store in the cookie. */
export async function mintOperatorToken(now = Date.now()): Promise<string | null> {
  const key = getOperatorKey();
  if (!key) return null;
  const expiresAt = now + OPERATOR_SESSION_DAYS * 86_400_000;
  const payload = `${TOKEN_VERSION}.${expiresAt}`;
  return `${payload}.${await hmacHex(key, payload)}`;
}

/** Verify a cookie token: correct signature, correct version, unexpired. */
export async function verifyOperatorToken(
  token: string | null | undefined,
  now = Date.now(),
): Promise<boolean> {
  const key = getOperatorKey();
  if (!key || !token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [version, expiresRaw, signature] = parts;
  if (version !== TOKEN_VERSION) return false;

  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= now) return false;

  const expected = await hmacHex(key, `${version}.${expiresRaw}`);
  return digestsMatch(signature, expected);
}

/** Cookie attributes shared by middleware and route handlers. */
export function operatorCookieOptions(secure = process.env.NODE_ENV === 'production') {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure,
    path: '/',
    maxAge: OPERATOR_SESSION_DAYS * 86_400,
  };
}
