import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Account',
  description:
    'Manage your Nurse Lab account, purchases, saved pages, and dashboard links.',
  path: '/account',
  noIndex: true,
});

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
