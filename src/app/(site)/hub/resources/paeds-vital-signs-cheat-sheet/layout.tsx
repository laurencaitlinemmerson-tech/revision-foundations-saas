import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'paeds-vital-signs-cheat-sheet',
  title: 'Paediatric Vital Signs Cheat Sheet | Nursing',
  description: 'Age-specific normal values for heart rate, respiratory rate, blood pressure, and oxygen saturation in children and infants.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
