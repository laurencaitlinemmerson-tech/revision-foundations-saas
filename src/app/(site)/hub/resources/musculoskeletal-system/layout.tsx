import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'musculoskeletal-system',
  title: 'Musculoskeletal System | Nursing Revision',
  description: 'Bones, joints, and muscles explained for nursing students, with paediatric growth-plate conditions, adult degenerative conditions, and the assessment and red flags that matter in both.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
