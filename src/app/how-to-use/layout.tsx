import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata, getArticleSchema } from '@/lib/seo';

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
  return (
    <>
      <JsonLd
        data={getArticleSchema({
          headline: 'How to Use The Nurse Lab',
          description:
            'A practical guide to using the OSCE tool, quiz, and revision hub without making revision feel more overwhelming than it needs to be.',
          path: '/how-to-use',
          keywords: [
            'nursing revision plan',
            'how to revise for nursing OSCE',
            'student nurse study method',
            'how to use revision tools for nursing students',
          ],
        })}
      />
      {children}
    </>
  );
}
