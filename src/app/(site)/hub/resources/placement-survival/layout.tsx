import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Nursing Placement Survival Guide',
  description: 'Practical tips for student nurses on making the most of clinical placement — communication, documentation, and staying calm under pressure.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
