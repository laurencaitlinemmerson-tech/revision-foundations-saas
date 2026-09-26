import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { requirePremium } from '@/lib/premiumGate';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'pharmacodynamics',
  title: 'Pharmacodynamics | Nursing Deep Dive',
  description: "How drugs act: receptors, ion channels, transporters and enzymes, agonists and antagonists, potency versus efficacy, receptor up- and down-regulation, and why some medicines must not be stopped suddenly.",
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

// Premium resource: signed-out visitors go to sign-in, non-subscribers to pricing.
export default async function Layout({ children }: { children: ReactNode }) {
  await requirePremium();
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
