import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'A&E Assessment | Nursing Revision',
  description: 'Systematic approach to emergency presentations for nursing students — triage, primary survey, and clinical decision-making in A&E.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
