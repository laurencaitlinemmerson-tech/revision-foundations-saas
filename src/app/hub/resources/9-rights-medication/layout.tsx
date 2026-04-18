import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '9 Rights of Medication Administration | Nursing',
  description: 'The 9 rights of safe medication administration — a practical safety framework for nursing students and registered nurses.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
