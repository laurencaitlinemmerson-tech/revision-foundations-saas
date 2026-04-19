import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { getFAQSchema, getProductSchema } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Pricing',
  description:
    "Get lifetime access to children's nursing OSCE practice, core nursing quizzes, and placement-ready revision guides in one calm study bundle for UK nursing students.",
  path: '/pricing',
});

const pricingFaqs = [
  { question: 'Is this a subscription?', answer: 'No. One payment, yours forever. No recurring charges.' },
  {
    question: 'Do I need an account?',
    answer: 'Yes. Create a free account first so your purchase, saved pages, and dashboard access all stay in one place.',
  },
  {
    question: "What if it's not for me?",
    answer: "Full refund within 7 days, no questions asked. Just email and we'll sort it.",
  },
  {
    question: 'Will more content be added?',
    answer: 'Yes. New resources are added over time and included in your purchase.',
  },
  {
    question: 'Does it work on mobile?',
    answer: 'Yes. Everything is mobile-friendly and designed for revising on placement, on the bus, and at home.',
  },
];

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getProductSchema()} />
      <JsonLd data={getFAQSchema(pricingFaqs)} />
      {children}
    </>
  );
}
