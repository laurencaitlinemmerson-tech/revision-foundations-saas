import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Wellness During My Haem/Onc Placement',
  description:
    'How meal prep, short bursts of exercise and a few boundaries helped me stay well through an emotionally demanding haematology and oncology placement.',
  path: '/blog/wellness-during-placement',
});

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
