import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata, getArticleSchema } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Neurodivergent Revision Guide',
  description:
    'A practical, low-pressure guide to revising for nursing exams and OSCEs with ADHD, AuDHD, autism, dyslexia, anxiety, or any mix of neurodivergent traits. Smaller sessions, clearer structure, less burnout.',
  path: '/neurodivergent-guide',
});

export default function NeurodivergentGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={getArticleSchema({
          headline: 'Neurodivergent Revision Guide',
          description:
            'A practical, low-pressure guide to revising for nursing exams and OSCEs with ADHD, AuDHD, autism, dyslexia, anxiety, or any mix of neurodivergent traits.',
          path: '/neurodivergent-guide',
          keywords: [
            'nursing revision ADHD',
            'nursing revision AuDHD',
            'nursing revision autism',
            'dyslexia study guide nursing',
            'student nurse neurodivergent revision',
          ],
        })}
      />
      {children}
    </>
  );
}
