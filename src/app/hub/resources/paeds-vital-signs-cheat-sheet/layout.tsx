import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Paediatric Vital Signs Cheat Sheet | Nursing',
  description: 'Age-specific normal values for heart rate, respiratory rate, blood pressure, and oxygen saturation in children and infants.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
