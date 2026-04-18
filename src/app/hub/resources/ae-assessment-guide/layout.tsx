import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Emergency Assessment Guide | Nursing',
  description: 'Primary and secondary survey, triage categories, and emergency assessment frameworks for nursing students.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
