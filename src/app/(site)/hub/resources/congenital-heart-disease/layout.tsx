import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'congenital-heart-disease',
  title: 'Congenital Heart Disease | Year 2 Nursing Deep Dive',
  description: 'Duct-dependent lesions, cyanotic vs acyanotic CHD, coarctation, TGA, Tetralogy of Fallot spells, and HLHS explained for Year 2 children’s nursing — building on the Year 1 cardiovascular basics.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
