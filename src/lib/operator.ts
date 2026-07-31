import { clerkClient } from '@clerk/nextjs/server';

/**
 * Accounts allowed into the operator dashboard and the admin APIs.
 *
 * Access is granted by verified Clerk email so the dashboard works without any
 * deployment configuration. Set OPERATOR_EMAILS (comma-separated) to override
 * this list, or LAUREN_CLERK_USER_ID to match on Clerk user ID instead.
 */
const DEFAULT_OPERATOR_EMAILS = ['laurencaitlinemmerson@gmail.com'];

export function allowedEmails(): string[] {
  const fromEnv = process.env.OPERATOR_EMAILS?.trim();
  const list = fromEnv ? fromEnv.split(',') : DEFAULT_OPERATOR_EMAILS;
  return list.map(e => e.trim().toLowerCase()).filter(Boolean);
}

export type OperatorStatus = {
  allowed: boolean;
  /** The signed-in account's primary email, when it could be read */
  email: string | null;
  /** Whether Clerk considers that address verified */
  verified: boolean;
  /** Why access was refused — surfaced on the dashboard so it can be fixed */
  reason: 'ok' | 'no-session' | 'lookup-failed' | 'no-email' | 'unverified' | 'not-allowed';
};

export async function getOperatorStatus(
  userId: string | null | undefined,
): Promise<OperatorStatus> {
  if (!userId) {
    return { allowed: false, email: null, verified: false, reason: 'no-session' };
  }

  // Explicit user-ID match, when configured — skips the Clerk lookup entirely
  const configuredId = process.env.LAUREN_CLERK_USER_ID?.trim();
  if (configuredId && userId === configuredId) {
    return { allowed: true, email: null, verified: true, reason: 'ok' };
  }

  let email: string | null = null;
  let verified = false;

  try {
    const clerk = await clerkClient();
    const user  = await clerk.users.getUser(userId);

    const primary =
      user.emailAddresses.find(e => e.id === user.primaryEmailAddressId) ??
      user.emailAddresses[0];

    email    = primary?.emailAddress ?? null;
    verified = primary?.verification?.status === 'verified';
  } catch (error) {
    console.error('Operator check: Clerk lookup failed', error);
    return { allowed: false, email: null, verified: false, reason: 'lookup-failed' };
  }

  if (!email)    return { allowed: false, email, verified, reason: 'no-email' };
  // An unverified address proves nothing about ownership
  if (!verified) return { allowed: false, email, verified, reason: 'unverified' };

  const allowed = allowedEmails().includes(email.trim().toLowerCase());
  return { allowed, email, verified, reason: allowed ? 'ok' : 'not-allowed' };
}

export async function isOperator(userId: string | null | undefined): Promise<boolean> {
  return (await getOperatorStatus(userId)).allowed;
}
