import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { getUserEntitlements } from '@/lib/entitlements';
import HubClient from '../HubClient';

export const metadata: Metadata = {
  title: "Children's Nursing Hub | The Nurse Lab",
  description:
    "OSCE guides, paediatric cheat sheets, and revision materials for children's nursing students.",
};

export default async function ChildrensHubPage() {
  const { userId } = await auth();

  let isPro = false;
  if (userId) {
    const entitlements = await getUserEntitlements(userId);
    isPro = entitlements.length > 0;
  }

  return <HubClient isPro={isPro} isSignedIn={!!userId} />;
}
