import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthPageShellProps = {
  title: string;
  intro: string;
  helper: string;
  cardLabel: string;
  finePrint: string;
  children: ReactNode;
  mode: 'sign-in' | 'sign-up';
};

export default function AuthPageShell({
  title,
  intro,
  finePrint,
  children,
  mode,
}: AuthPageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--cream)] text-[var(--charcoal)] transition-colors duration-300">
      <main className="flex-1 flex flex-col items-center justify-center py-[120px] px-6 pb-20 max-md:py-[100px] max-md:px-4 max-md:pb-[60px]">
        <div className="text-center mb-10 max-w-[400px]">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#999] mb-4">
            {mode === 'sign-in' ? 'Welcome back' : 'Get started'}
          </p>
          <h1 className="font-display text-[clamp(2rem,4.5vw,2.8rem)] font-normal leading-[1.1] text-[var(--espresso)] tracking-[-0.01em] mb-3">
            {title}
          </h1>
          <p className="text-sm font-light text-[var(--charcoal)] leading-[1.7]">
            {intro}
          </p>
        </div>

        <div className="w-full max-w-[400px]">
          <div style={{ minWidth: 0, maxWidth: '100%' }}>
            {children}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-[#999] leading-[1.6] m-0">
              {finePrint}{' '}
              <Link href="/privacy" className="text-[var(--charcoal)] underline underline-offset-3 font-normal transition-colors hover:text-[var(--espresso)]">Privacy</Link>
              {' & '}
              <Link href="/terms" className="text-[var(--charcoal)] underline underline-offset-3 font-normal transition-colors hover:text-[var(--espresso)]">Terms</Link>.
            </p>
          </div>
        </div>

        <div className="mt-9 text-center">
          <Link href="/" className="font-display text-sm text-[#bbb] tracking-[-0.01em] transition-colors hover:text-[#999] dark:hover:text-[var(--text-muted)]">
            The Nurse Lab
          </Link>
        </div>
      </main>
    </div>
  );
}
