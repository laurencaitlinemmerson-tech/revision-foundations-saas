import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'paediatric-respiratory-conditions',
  title: 'Common Respiratory Conditions | Year 2 Nursing Deep Dive',
  description: 'Asthma, bronchiolitis, croup, pneumonia, and cystic fibrosis compared by mechanism, signs, and nursing priorities for Year 2 children’s nursing, plus why children deteriorate faster than adults.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
