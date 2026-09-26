import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { requirePremium } from '@/lib/premiumGate';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'anaphylaxis',
  title: 'Anaphylaxis | Nursing Deep Dive',
  description: "Recognising anaphylaxis, why intramuscular adrenaline comes first, doses by age, the A to E response, what not to rely on, and observation, tryptase and follow-up afterwards.",
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

// Premium resource: signed-out visitors go to sign-in, non-subscribers to pricing.
export default async function Layout({ children }: { children: ReactNode }) {
  await requirePremium();
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
