import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Cardiovascular System | Nursing Revision',
  description: 'Heart anatomy, cardiac output, blood pressure regulation, and common cardiovascular conditions explained for nursing students.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
