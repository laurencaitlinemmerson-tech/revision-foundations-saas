import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Lauren',
  description:
    "Meet Lauren, the children's nursing student and former medical photographer behind The Nurse Lab, and see what the brand is built to stand for.",
  path: '/about',
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
