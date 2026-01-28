'use client';

import { useEffect, ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Heart } from 'lucide-react';

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

      {/* Hero Section */}
      <section className="gradient-hero pt-32 pb-12 relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.25 }} />
        <div className="blob blob-2" style={{ opacity: 0.25 }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="animate-on-scroll hero-badge">
              <Heart className="w-4 h-4 text-[var(--pink)]" />
              <span className="text-[var(--plum)]">Dashboard</span>
              <Sparkles className="w-4 h-4 text-[var(--purple)] icon-pulse" />
            </div>

            <h1 className="animate-on-scroll mb-2 hero-title">
              <span className="gradient-text">Hey, {firstName}!</span>
            </h1>

            <p className="animate-on-scroll hero-description !mb-6">
              Ready to smash your revision today? 💜
            </p>
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
