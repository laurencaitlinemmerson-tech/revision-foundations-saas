import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { requirePremium } from '@/lib/premiumGate';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'sickle-cell-thalassaemia',
  title: 'Sickle Cell Disease & Thalassaemia | Nursing Deep Dive',
  description: "How haemoglobinopathies are inherited, the mechanism of sickle cell disease and crises, acute chest syndrome and other emergencies, pain management, thalassaemia and transfusion, and family care.",
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

// Premium resource: signed-out visitors go to sign-in, non-subscribers to pricing.
export default async function Layout({ children }: { children: ReactNode }) {
  await requirePremium();
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
