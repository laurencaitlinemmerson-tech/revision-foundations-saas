import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HubResourceStructuredData from '@/components/resources/HubResourceStructuredData';
import { createHubResourceMetadata } from '@/lib/seo';

const RESOURCE = {
  slug: 'ecg-cardiac-conduction',
  title: 'ECG & Cardiac Conduction | Nursing Deep Dive',
  description: 'The conduction pathway, how to read a waveform, a structured rate-and-rhythm approach, common arrhythmias compared, and paediatric vs adult ECG differences — for children’s and adult nursing.',
} as const;

export const metadata: Metadata = createHubResourceMetadata(RESOURCE);

export default function Layout({ children }: { children: ReactNode }) {
  return <HubResourceStructuredData resource={RESOURCE}>{children}</HubResourceStructuredData>;
}
