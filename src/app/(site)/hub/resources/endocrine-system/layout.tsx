import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'endocrine-system',
  title: 'Endocrine System | Nursing Revision',
  description: 'Hormones, glands, and feedback loops explained for nursing students, with diabetes, thyroid disorders, DKA red flags, and the assessment that matters in both paediatric and adult care.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
