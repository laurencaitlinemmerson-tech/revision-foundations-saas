import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Core Nursing Quiz',
  description:
    'Revise vital signs, drug calculations, pharmacology, infection control, and more with instant-feedback nursing quiz practice.',
  path: '/quiz',
});

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
