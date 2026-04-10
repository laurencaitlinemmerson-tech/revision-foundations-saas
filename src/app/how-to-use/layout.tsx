import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'How to Use',
  description:
    'A practical guide to using the OSCE tool, quiz, and revision hub without making revision feel more overwhelming than it needs to be.',
  path: '/how-to-use',
});

export default function HowToUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
