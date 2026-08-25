import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'The Nursing Student Dashboard — Notion template',
  description:
    'A Notion template for UK nursing students: track your degree classification, placement hours, NMC proficiencies, assignments and revision in one linked system.',
  path: '/template',
});

export default function TemplateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
