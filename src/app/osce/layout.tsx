import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: "Children's OSCE Tool",
  description:
    "Practise children's nursing OSCE stations with marking checklists, timed mode, and step-by-step guidance for UK student nurses.",
  path: '/osce',
});

export default function OsceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
