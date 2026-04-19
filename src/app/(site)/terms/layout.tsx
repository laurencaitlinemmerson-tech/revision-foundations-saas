import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service',
  description:
    'The terms for using The Nurse Lab nursing revision resources, OSCE practice, quizzes, accounts, and purchases.',
  path: '/terms',
});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
