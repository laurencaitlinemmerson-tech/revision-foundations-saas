import { cookies, headers } from 'next/headers';
import {
  OPERATOR_COOKIE,
  getOperatorKey,
  isValidAccessKey,
  verifyOperatorToken,
} from './access';

/**
 * Server-side authorisation for operator pages and API routes.
 *
 * Pages rely on the cookie that middleware set from the secret link.
 * API routes may additionally present the raw key as a bearer token,
 * which is how the phone shortcut / Health Auto Export posts data.
 */
export async function hasOperatorAccess(): Promise<boolean> {
  if (!getOperatorKey()) return false;

  const cookieStore = await cookies();
  if (await verifyOperatorToken(cookieStore.get(OPERATOR_COOKIE)?.value)) return true;

  const headerStore = await headers();
  const authorization = headerStore.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    return isValidAccessKey(authorization.slice('Bearer '.length).trim());
  }

  return false;
}
