import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Leave a Review',
  description:
    "Share your experience using The Nurse Lab and help other UK student nurses decide if it's the right revision tool for them.",
  path: '/review',
});

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
