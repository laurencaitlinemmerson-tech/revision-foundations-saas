import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Purchase Complete',
  description:
    'Finish connecting your Nurse Lab purchase to your account and continue to your dashboard or study tool.',
  path: '/success',
  noIndex: true,
});

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
