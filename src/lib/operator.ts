import { clerkClient } from '@clerk/nextjs/server';

/**
 * Accounts allowed into /operator and the admin APIs.
 *
 * Access is granted by verified Clerk email so the dashboard works without any
 * deployment configuration. Set OPERATOR_EMAILS (comma-separated) to override
 * this list, or LAUREN_CLERK_USER_ID to match on Clerk user ID instead.
 */
const DEFAULT_OPERATOR_EMAILS = ['laurencaitlinemmerson@gmail.com'];

function allowedEmails(): string[] {
  const fromEnv = process.env.OPERATOR_EMAILS?.trim();
  const list = fromEnv ? fromEnv.split(',') : DEFAULT_OPERATOR_EMAILS;
  return list.map(e => e.trim().toLowerCase()).filter(Boolean);
}

export async function isOperator(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;

  // Explicit user-ID match, when configured
  const configuredId = process.env.LAUREN_CLERK_USER_ID?.trim();
  if (configuredId && userId === configuredId) return true;

  try {
    const clerk = await clerkClient();
    const user  = await clerk.users.getUser(userId);

    const primary =
      user.emailAddresses.find(e => e.id === user.primaryEmailAddressId) ??
      user.emailAddresses[0];

    // Require a verified address — an unverified one proves nothing about ownership
    if (!primary || primary.verification?.status !== 'verified') return false;

    return allowedEmails().includes(primary.emailAddress.trim().toLowerCase());
  } catch (error) {
    console.error('Operator check failed:', error);
    return false;
  }
}
