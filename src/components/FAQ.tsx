'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AnimateOnScroll } from './MotionComponents';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What's included in the £4.99 one-time payment?",
    answer: "You get lifetime access to everything: 50+ OSCE practice stations, 17 quiz topic areas, the full Nursing Hub with resources and guides, your personal dashboard with progress tracking, and all future updates we add!",
  },
  {
    question: "Is this suitable for my nursing course?",
    answer: "Our resources are designed primarily for UK nursing students, especially those in Year 1 of Children's Nursing. However, many topics like anatomy, pharmacology, and clinical skills are relevant across all nursing branches.",
  },
  {
    question: "Can I access it on my phone?",
    answer: "Absolutely! Revision Foundations is fully mobile-friendly. Study on the go during your commute, on placement breaks, or anywhere you have your phone.",
  },
  {
    question: "Is there a subscription or recurring payment?",
    answer: "Nope! It's a one-time payment of £4.99 for lifetime access. No hidden fees, no subscription traps. Pay once, use forever.",
  },
  {
    question: "What if it's not right for me?",
    answer: "We offer a 30-day money-back guarantee. If you're not happy with the resources, just reach out and we'll refund you, no questions asked.",
  },
  {
    question: "How do I get help if I have questions?",
    answer: "You can WhatsApp me directly! I'm always happy to chat and help with any questions about the platform or your nursing studies.",
  },
];

function FAQAccordionItem({ item, isOpen, onToggle }: { 
  item: FAQItem; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--lilac-medium)] last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left gap-4 group"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[var(--plum-dark)] group-hover:text-[var(--purple)] transition-colors">
          {item.question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-[var(--purple)] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-[var(--plum-dark)]/70 leading-relaxed pr-8">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-cream section" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <AnimateOnScroll className="text-center mb-12">
          <div className="inline-flex items-center gap-2 badge badge-purple mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-[var(--plum-dark)]">Common Questions</h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={0.1}>
          <div className="card bg-white p-6 md:p-8">
            {faqs.map((faq, index) => (
              <FAQAccordionItem
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
