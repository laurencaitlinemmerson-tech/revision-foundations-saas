import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Neurodivergent Revision Guide',
  description:
    'A practical, low-pressure guide to revising for nursing exams and OSCEs with ADHD, autism, dyslexia, or any mix of neurodivergent traits. Smaller sessions, clearer structure, less burnout.',
  path: '/neurodivergent-guide',
});

export default function NeurodivergentGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
