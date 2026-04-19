import { auth } from '@clerk/nextjs/server';
import { getUserEntitlements } from '@/lib/entitlements';
import { generatePageMetadata } from '@/lib/seo';
import HubClient from '../HubClient';

export const metadata = generatePageMetadata({
  title: 'Adult Nursing Hub',
  description:
    'Browse adult nursing revision guides, placement refreshers, escalation pages, and practical resources built for UK student nurses.',
  path: '/hub/adult',
});

export default async function AdultHubPage() {
  const { userId } = await auth();

  let isPro = false;
  if (userId) {
    const entitlements = await getUserEntitlements(userId);
    isPro = entitlements.length > 0;
  }

  return <HubClient branch="adult" isPro={isPro} isSignedIn={!!userId} />;
}
