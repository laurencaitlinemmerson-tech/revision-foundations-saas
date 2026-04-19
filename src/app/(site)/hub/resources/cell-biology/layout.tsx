import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Cell Biology | Nursing Revision',
  description: 'Cell structure, osmosis, membrane transport, and cellular processes relevant to clinical nursing practice.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
