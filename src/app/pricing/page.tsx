'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Sparkles,
  Gift,
  ClipboardCheck,
  BookOpen,
  Play,
  ArrowRight,
  Loader2,
  Mail,
  Check,
  ChevronDown,
} from 'lucide-react';

type Product = 'osce' | 'quiz' | 'bundle';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function PricingPage() {
  const { isSignedIn, user } = useUser();

  const [loading, setLoading] = useState<Product | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<Product | null>(null);
  const [emailError, setEmailError] = useState('');

  const isPro = Boolean(user?.publicMetadata?.isPro);

  const packages = useMemo(
    () => [
      {
        name: "Children's OSCE Tool",
        price: '£4.99',
        description: 'Placement Ready',
        features: ['All OSCE stations', 'Detailed checklists', 'Timer & exam mode', 'Progress tracking'],
        perfectFor: 'OSCE practice + paeds placement confidence',
        ctaText: 'Get OSCE Tool',
        product: 'osce' as const,
        icon: ClipboardCheck,
      },
      {
        name: 'Full Hub Access',
        price: '£9.99',
        description: 'Everything Included',
        features: [
          'Full access to the Revision Hub',
          'OSCE Tool included',
          'Core Nursing Quiz included',
          'Everything unlocked',
          'Future tools included',
          'Lifetime access',
        ],
        badge: isPro ? 'Purchased ✓' : 'Most popular',
        highlighted: true,
        perfectFor: 'Students who want everything in one go',
        ctaText: isPro ? 'Go to Hub' : 'Get Full Hub Access',
        product: 'bundle' as const,
        icon: Gift,
      },
      {
        name: 'Core Nursing Quiz',
        price: '£4.99',
        description: 'Exam Ready',
        features: ['17 topic categories', 'Instant feedback', 'Detailed explanations', 'Mobile friendly'],
        perfectFor: 'Revision in little pockets of time',
        ctaText: 'Get Quiz Tool',
        product: 'quiz' as const,
        icon: BookOpen,
      },
    ],
    [isPro]
  );

  const addOns = useMemo(
    () => [
      'Printable checklists',
      'New resources weekly',
      'OSCE templates',
      'Revision plans',
      'Progress tracking',
      'Lifetime updates',
    ],
    []
  );

  const faqs = useMemo(
    () => [
      { question: 'Is this a subscription?', answer: 'No — one-time payment with lifetime access ✨' },
      { question: 'Do I need an account?', answer: 'No. Guests can checkout with email.' },
      { question: 'What payment methods do you accept?', answer: 'All major cards via Stripe 💳' },
      { question: 'Can I get a refund?', answer: 'Yes — within 7 days if you’re not happy.' },
      { question: 'Already purchased?', answer: 'If you’re signed in, you’ll see “Purchased” / “Go to Hub”.' },
    ],
    []
  );

  const handlePurchase = async (product: Product) => {
    if (!isSignedIn && !guestEmail) {
      setShowEmailInput(product);
      return;
    }

    if (!isSignedIn && guestEmail && !validateEmail(guestEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(product);
    setEmailError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          guestEmail: !isSignedIn ? guestEmail : undefined,
        }),
      });

      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(data?.error || 'No checkout URL returned');
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Oops! ${error?.message || 'Something went wrong.'}`);
    } finally {
      setLoading(null);
    }
  };

  const EmailBlock = ({ product }: { product: Product }) => (
    <div className="mt-3 space-y-2.5 animate-fadeUp">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--plum-dark)]/45" />
        <input
          type="email"
          placeholder="Email for receipt + access"
          value={guestEmail}
          onChange={(e) => {
            setGuestEmail(e.target.value);
            setEmailError('');
          }}
          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--lilac-medium)] bg-white focus:outline-none foc
