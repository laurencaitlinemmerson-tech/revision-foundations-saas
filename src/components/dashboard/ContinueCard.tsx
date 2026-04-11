'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface ContinueCardProps {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  progressCurrent: number;
  progressTotal: number;
  progressLabel: string;
  lastActiveLabel: string;
  nextStep: string;
  contextLabel: string;
}

export default function ContinueCard({
  eyebrow,
  title,
  description,
  href,
  cta,
  progressCurrent,
  progressTotal,
  progressLabel,
  lastActiveLabel,
  nextStep,
  contextLabel,
}: ContinueCardProps) {
  const progress = progressTotal > 0 ? Math.min((progressCurrent / progressTotal) * 100, 100) : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="relative overflow-hidden rounded-[34px] border border-[rgba(26,24,21,0.08)] bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(247,243,236,0.98)_56%,rgba(240,234,225,0.94)_100%)] p-7 shadow-[0_22px_70px_rgba(61,45,28,0.08)] sm:p-9"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 top-0 h-44 w-44 rounded-full bg-[rgba(214,197,172,0.18)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[rgba(171,195,178,0.16)] blur-3xl" />
      </div>

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_270px] lg:items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/52">
            {eyebrow}
          </p>
          <h2 className="mt-4 max-w-[12ch] text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.92] tracking-[-0.04em] text-[var(--espresso)]">
            {title}
          </h2>
          <p className="mt-4 max-w-[48ch] text-[15px] leading-8 text-[var(--charcoal)]/76">
            {description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--espresso)] px-5 py-3 text-sm tracking-[0.04em] text-white transition hover:bg-[#2a241d]"
            >
              {cta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <p className="text-sm text-[var(--charcoal)]/58">
              {contextLabel}
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-[rgba(26,24,21,0.08)] bg-[rgba(255,255,255,0.68)] p-5 backdrop-blur-sm">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/48">
            Session state
          </p>
          <div className="mt-4 flex items-end gap-3">
            <p className="font-display text-[3.6rem] italic leading-none text-[var(--espresso)]">
              {progressCurrent}
            </p>
            <div className="pb-2 text-sm leading-5 text-[var(--charcoal)]/62">
              of {progressTotal}
              <br />
              markers complete
            </div>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[rgba(26,24,21,0.08)]">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#7f9d8c_0%,#d8b28a_100%)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-3 text-sm leading-6 text-[var(--charcoal)]/72">
            {progressLabel}
          </p>
        </div>
      </div>

      <div className="relative mt-8 grid gap-4 border-t border-[rgba(26,24,21,0.08)] pt-5 sm:grid-cols-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/42">
            Last active
          </p>
          <p className="mt-2 text-sm text-[var(--espresso)]">
            {lastActiveLabel}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/42">
            Best next step
          </p>
          <p className="mt-2 text-sm text-[var(--espresso)]">
            {nextStep}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/42">
            Why now
          </p>
          <p className="mt-2 text-sm text-[var(--espresso)]">
            This is still your fastest route back into focused revision.
          </p>
        </div>
      </div>
    </motion.article>
  );
}
