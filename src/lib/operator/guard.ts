import { cookies, headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import {
  OPERATOR_COOKIE,
  OPERATOR_KEY_PARAM,
  getOperatorKey,
  isValidAccessKey,
  verifyOperatorToken,
} from './access';

/**
 * Server-side authorisation for operator pages and API routes.
 *
 * Pages rely on the cookie that middleware set from the secret link.
 * API routes may additionally present the raw key as a bearer token —
 * or, when `request` is passed, as a `?k=` query param — which is how
 * a phone automation (Health Auto Export, a Shortcut) posts data
 * without needing to configure a custom header.
 */
export async function hasOperatorAccess(request?: NextRequest): Promise<boolean> {
  if (!getOperatorKey()) return false;

  const cookieStore = await cookies();
  if (await verifyOperatorToken(cookieStore.get(OPERATOR_COOKIE)?.value)) return true;

  const headerStore = await headers();
  const authorization = headerStore.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    if (await isValidAccessKey(authorization.slice('Bearer '.length).trim())) return true;
  }

  const keyParam = request?.nextUrl.searchParams.get(OPERATOR_KEY_PARAM);
  if (keyParam && (await isValidAccessKey(keyParam))) return true;

  return false;
}
