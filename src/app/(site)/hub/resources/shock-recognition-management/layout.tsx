import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'shock-recognition-management',
  title: 'Shock: Recognition & Management | Year 2 Nursing',
  description: 'Compensated, decompensated, and irreversible shock, the seven D NACHOS shock types, A–E management, and inotropes explained for Year 2 children’s nursing.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
