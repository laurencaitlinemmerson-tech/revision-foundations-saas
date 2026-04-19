import { Metadata } from 'next';
import PricingPageClient from './PricingPageClient';

export const metadata: Metadata = {
  title: 'Pricing - The Nurse Lab',
  description: 'Choose the revision bundle or specific testing tool to help you pass exams and OSCEs.',
};

export default function PricingPage() {
  return <PricingPageClient />;
}
