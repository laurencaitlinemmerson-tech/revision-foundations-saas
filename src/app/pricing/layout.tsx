import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Pricing',
  description:
    "Get lifetime access to children's nursing OSCE practice, core nursing quizzes, and placement-ready revision guides in one bundle.",
  path: '/pricing',
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
