import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'y1-paeds-medications',
  title: 'Y1 Paediatric Medications Guide',
  description:
    'The paediatric meds basics for first year: common drugs and doses, weight-based calculations with worked examples, high-risk medications and why they matter, and what examiners look for in a medicines management OSCE.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
