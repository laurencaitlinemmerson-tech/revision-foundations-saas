import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Paediatric Palliative Care | Nursing Guide',
  description: 'Child-centred end-of-life care for nursing students — symptom management, communication with families, and supporting siblings.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
