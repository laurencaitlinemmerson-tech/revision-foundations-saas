import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Blog',
  description:
    'Honest write-ups from a UK student nurse: first-year advice, placement survival, and the practical things nobody puts in the handbook.',
  path: '/blog',
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
