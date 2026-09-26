import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUserEntitlements } from '@/lib/entitlements';

/**
 * Server-side paywall for premium hub pages that have their own route folder.
 * The hub cards only show a padlock; this is what actually stops a direct visit.
 * Mirrors the check in hub/resources/[slug]/page.tsx.
 */
export async function requirePremium() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const entitlements = await getUserEntitlements(userId);
  if (entitlements.length === 0) redirect('/pricing');
}
