import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Study Skills',
  description:
    'Study skills and support guides for using The Nurse Lab in a calmer, more workable way, including getting started and neurodivergent-friendly revision.',
  path: '/study-skills',
});

export default function StudySkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
