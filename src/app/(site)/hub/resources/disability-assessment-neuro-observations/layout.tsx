import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'disability-assessment-neuro-observations',
  title: 'Disability Assessment & Neuro Observations | Year 2 Nursing',
  description: 'AVPU, paediatric GCS under vs over 5, pupils, decorticate vs decerebrate posturing, and why hypoglycaemia can mimic neurological deterioration — the D in ABCDE explained for Year 2 children’s nursing.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
