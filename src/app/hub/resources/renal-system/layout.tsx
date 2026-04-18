import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Renal System | Nursing Revision',
  description: 'Kidney anatomy, fluid balance, electrolytes, acid-base balance, and urinary assessment for nursing students.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
