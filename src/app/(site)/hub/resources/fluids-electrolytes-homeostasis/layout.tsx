import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'fluids-electrolytes-homeostasis',
  title: 'Fluids, Electrolytes & Homeostasis | Nursing Revision',
  description: 'Homeostasis, fluid compartments, and electrolyte balance explained for nursing students, with paediatric and adult fluid assessment and the imbalance red flags that matter in both.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
