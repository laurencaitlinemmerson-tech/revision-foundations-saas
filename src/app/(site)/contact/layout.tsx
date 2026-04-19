import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Lauren',
  description:
    'Contact Lauren at The Nurse Lab for support, feedback, broken-link fixes, purchase questions, or quick nursing revision feedback.',
  path: '/contact',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
