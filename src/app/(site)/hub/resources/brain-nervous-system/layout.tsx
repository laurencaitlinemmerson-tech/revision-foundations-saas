import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Brain & Nervous System | Nursing Revision',
  description: 'Neurology basics for nursing students — CNS and PNS anatomy, neurological assessment, and common conditions in paediatric and adult settings.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
