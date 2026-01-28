'use client';

import { useEffect, ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface DashboardClientProps {
  children: ReactNode;
  firstName: string;
}

export default function DashboardClient({ children, firstName }: DashboardClientProps) {
  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.animate = 'in';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Compact Hero */}
      <section className="pt-28 pb-6 bg-gradient-to-b from-[var(--lilac-soft)] to-cream">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="animate-on-scroll text-2xl md:text-3xl font-display text-[var(--plum-dark)]">
                Hey, {firstName}! 👋
              </h1>
              <p className="animate-on-scroll text-[var(--plum)] mt-1">
                Ready to smash your revision today?
              </p>
            </div>
            <Link 
              href="/hub" 
              className="animate-on-scroll btn-primary inline-flex items-center gap-2 w-fit"
            >
              Go to Hub
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <main className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
