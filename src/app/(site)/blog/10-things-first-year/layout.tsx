import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: '10 Things You Should Know as a First Year Nursing Student',
  description:
    'Ten honest things to know in first year of UK nursing training: attendance and practice hours, your PAD, drug calculations, referencing, and looking after yourself on placement.',
  path: '/blog/10-things-first-year',
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
