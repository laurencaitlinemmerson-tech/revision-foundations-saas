import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'tracheostomy-care',
  title: 'Tracheostomy Care | Year 2 Nursing Deep Dive',
  description: 'Airway adjuncts, tracheostomy indications, tube types, humidification, safe suctioning, and the blocked-vs-displaced-tube emergency, explained for Year 2 children’s nursing.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
