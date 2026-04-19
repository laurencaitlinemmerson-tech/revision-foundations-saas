import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'respiratory-system',
  title: 'Respiratory System | Nursing Revision',
  description: 'Anatomy, physiology, common conditions, and paediatric assessment for the respiratory system. Covers bronchiolitis, croup, asthma, V/Q mismatch, and work of breathing signs.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
