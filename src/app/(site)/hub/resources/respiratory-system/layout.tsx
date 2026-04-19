import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Respiratory System | Nursing Revision',
  description: 'Anatomy, physiology, common conditions, and paediatric assessment for the respiratory system. Covers bronchiolitis, croup, asthma, V/Q mismatch, and work of breathing signs.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
