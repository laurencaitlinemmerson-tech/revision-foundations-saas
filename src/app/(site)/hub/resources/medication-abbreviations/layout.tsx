import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Medication Abbreviations | Nursing Reference',
  description: 'Common Latin and English prescription abbreviations explained for nursing students — OD, BD, TDS, PRN, and more.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
