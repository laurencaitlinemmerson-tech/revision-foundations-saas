'use client';

import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { motion, Variants } from 'framer-motion';

interface DashboardClientProps {
  children: ReactNode;
  firstName: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export default function DashboardClient({ children, firstName }: DashboardClientProps) {
  useScrollAnimation();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Editorial hero */}
      <section
        className="
          relative overflow-hidden
          pt-14 md:pt-16
          pb-10 md:pb-12
          bg-[var(--linen-light)]
          border-b border-[var(--linen-deep)]
        "
      >
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            className="flex items-center justify-between gap-6 pt-8 md:pt-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="min-w-0">
              <h1 className="font-display text-3xl md:text-4xl text-[var(--espresso)] mb-2">
                Hey, {firstName}!
              </h1>

              <p className="text-[var(--charcoal)] text-base md:text-lg font-light mb-3">
                Ready to smash your revision today?
              </p>

              <div
                className="inline-flex items-center gap-2 bg-white border border-[var(--linen-deep)] px-4 py-1.5"
                style={{ borderRadius: '8px' }}
              >
                <span className="text-sm text-[var(--espresso)]">{greeting}</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex-shrink-0">
              <Link
                href="/hub"
                className="bg-[var(--espresso)] text-white inline-flex items-center gap-2 group px-5 py-2.5 text-sm hover:bg-[#3a2010] transition-colors"
                style={{ borderRadius: '8px' }}
              >
                <span>Go to Hub</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.main
        className="px-6 pb-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-5xl mx-auto space-y-8 pt-4 md:pt-6">
          {children}
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
