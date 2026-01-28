import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { getUserEntitlements } from '@/lib/entitlements';
import HubClient from './HubClient';

export const metadata: Metadata = {
  title: 'Nursing Hub',
  description: 'Browse nursing study resources, OSCE guides, and revision materials. Your central hub for nursing exam prep.',
};

export default async function HubPage() {
  const { userId } = await auth();

  let isPro = false;

  if (userId) {
    const entitlements = await getUserEntitlements(userId);
    // User is "Pro" if they have any active entitlement (osce, quiz, or bundle)
    isPro = entitlements.length > 0;
  }

  return <HubClient isPro={isPro} isSignedIn={!!userId} />;
}
