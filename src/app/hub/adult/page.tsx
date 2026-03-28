'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react';

export default function AdultHubPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setLoading(true);
    // In production this would POST to a waitlist endpoint
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/hub"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--charcoal-light)] hover:text-[var(--espresso)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>

          <div className="text-4xl mb-6">🏥</div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--espresso)] mb-4">
            Adult Nursing Hub
          </h1>
          <p className="text-[var(--charcoal)] mb-3 leading-relaxed">
            This branch is in development. We&apos;re building resources for adult nursing students — NEWS2,
            sepsis, wound care, medicine management, and adult-specific OSCE stations.
          </p>
          <p className="text-sm text-[var(--charcoal-light)] mb-10">
            Leave your email and we&apos;ll let you know when it launches.
          </p>

          {submitted ? (
            <div className="bg-[var(--linen-light)] border border-[var(--linen-deep)] rounded-xl p-6">
              <p className="text-[var(--espresso)] font-medium mb-1">Got it — thanks!</p>
              <p className="text-sm text-[var(--charcoal-light)]">
                We&apos;ll email you when the adult nursing hub goes live.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-[var(--linen-deep)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--espresso)]/20 focus:border-[var(--espresso)]/40 text-sm text-[var(--espresso)]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-3 text-sm flex-shrink-0 flex items-center gap-2"
              >
                {loading ? 'Saving...' : <>Notify me <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          <div className="mt-16 pt-10 border-t border-[var(--linen-deep)]">
            <p className="text-sm text-[var(--charcoal-light)] mb-4">
              In the meantime, the children&apos;s nursing resources are live and free to browse.
            </p>
            <Link href="/hub/childrens" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--espresso)] underline underline-offset-2 hover:opacity-75 transition-opacity">
              Browse Children&apos;s Nursing Hub <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
