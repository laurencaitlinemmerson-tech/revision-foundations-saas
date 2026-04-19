import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'IM & SC Injection Technique | Nursing Guide',
  description: 'Step-by-step IM and subcutaneous injection guide for nursing students — sites, angles, needle selection, and safe administration.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
