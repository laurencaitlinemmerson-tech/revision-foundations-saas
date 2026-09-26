import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { requirePremium } from '@/lib/premiumGate';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'pharmacokinetics',
  title: 'Pharmacokinetics | Nursing Deep Dive',
  description: "ADME explained with the why: absorption, distribution, metabolism and excretion, first-pass effect, CYP interactions, half-life and therapeutic index, and how babies, children and older adults handle drugs differently.",
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

// Premium resource: signed-out visitors go to sign-in, non-subscribers to pricing.
export default async function Layout({ children }: { children: ReactNode }) {
  await requirePremium();
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
