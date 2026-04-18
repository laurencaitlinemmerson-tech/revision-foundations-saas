import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Nasogastric Tube Insertion | Nursing Guide',
  description: 'NG tube insertion technique, position checking, and safety considerations for nursing students.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
