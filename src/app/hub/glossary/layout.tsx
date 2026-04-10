import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Nursing Glossary',
  description:
    'A plain-English nursing glossary for UK student nurses, covering placement language, OSCE wording, abbreviations, medicines, vitals, and clinical basics.',
  path: '/hub/glossary',
});

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
