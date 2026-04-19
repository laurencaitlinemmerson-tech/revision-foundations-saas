import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description:
    'How The Nurse Lab handles account, purchase, contact, and usage data for nursing students using the site.',
  path: '/privacy',
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
