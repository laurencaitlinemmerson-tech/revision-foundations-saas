import { auth } from '@clerk/nextjs/server';
import { getUserEntitlements } from '@/lib/entitlements';
import { generatePageMetadata } from '@/lib/seo';
import HubClient from '../HubClient';

export const metadata = generatePageMetadata({
  title: "Children's Nursing Hub",
  description:
    "Browse children's nursing OSCE guides, paediatric cheat sheets, placement support, and revision pages built for UK student nurses.",
  path: '/hub/childrens',
});

export default async function ChildrensHubPage() {
  const { userId } = await auth();

  let isPro = false;
  if (userId) {
    const entitlements = await getUserEntitlements(userId);
    isPro = entitlements.length > 0;
  }

  return <HubClient branch="childrens" isPro={isPro} isSignedIn={!!userId} />;
}
