import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { requirePremium } from '@/lib/premiumGate';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'childhood-cancer-neutropenic-sepsis',
  title: 'Childhood Cancers & Neutropenic Sepsis | Nursing Deep Dive',
  description: "Leukaemia (ALL and AML), neuroblastoma and other childhood cancers, neutropenic sepsis and its one-hour rule, tumour lysis, central line care, supportive care and family support.",
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

// Premium resource: signed-out visitors go to sign-in, non-subscribers to pricing.
export default async function Layout({ children }: { children: ReactNode }) {
  await requirePremium();
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
