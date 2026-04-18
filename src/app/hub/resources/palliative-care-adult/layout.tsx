import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Adult Palliative Care | Nursing Guide',
  description: 'Symptom management, communication, and end-of-life care principles for adult nursing — covering pain, dyspnoea, and family support.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
