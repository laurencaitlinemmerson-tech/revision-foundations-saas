import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Drug Calculations Cheat Sheet | Nursing',
  description: 'Drug calculation formulas, worked examples, and dosage guides for nursing students — weight-based, IV rates, and paediatric calculations.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
