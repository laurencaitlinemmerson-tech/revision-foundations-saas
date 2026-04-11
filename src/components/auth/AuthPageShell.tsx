import Link from 'next/link';
import type { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

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
  helper,
  finePrint,
  children,
  mode,
}: AuthPageShellProps) {
  const formHeadingId = `${mode}-form-title`;
  const formDescriptionId = `${mode}-form-description`;
  const backgroundRuleStyle: React.CSSProperties = {
    backgroundImage:
      'repeating-linear-gradient(180deg, rgba(26,24,21,0.05) 0, rgba(26,24,21,0.05) 1px, transparent 1px, transparent 88px)',
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--espresso)] flex flex-col">
      <Navbar />

      <main id="main-content" className="flex-1 bg-[var(--cream)] flex flex-col relative">
        <div className="absolute inset-x-0 top-0 h-[600px] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(250,250,248,0.95)_60%,rgba(250,250,248,1))]" />
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={backgroundRuleStyle} />

        <div className="relative flex-1 flex flex-col justify-center items-center px-6 pt-32 pb-24 sm:px-8">
          
          <div className="w-full max-w-md text-center mb-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--charcoal-light)] mb-4">
               {mode === 'sign-in' ? 'Welcome Back' : 'Create Account'}
            </p>
            <h1 
              id={formHeadingId}
              className="font-display text-[clamp(2.2rem,5vw,3rem)] leading-[1.06] tracking-[-0.02em] text-[var(--espresso)]"
            >
              {title}
            </h1>
            <p 
              id={formDescriptionId}
              className="mt-4 text-[15px] leading-[1.7] text-[var(--charcoal)] font-light max-w-[40ch] mx-auto"
            >
              {intro}
            </p>
            {helper && (
              <p className="mt-2 text-[13px] leading-[1.6] text-[var(--charcoal-light)] max-w-[44ch] mx-auto">
                {helper}
              </p>
            )}
          </div>

          <div className="w-full max-w-[400px] bg-white border border-black/8 shadow-[0_28px_90px_rgba(26,24,21,0.07)] overflow-hidden">
            <div className="p-6 sm:p-8">
              <div
                className="auth-clerk-frame min-w-0 max-w-full"
                style={
                  {
                    '--clerk-color-shadow': 'transparent',
                    '--clerk-color-border': 'transparent',
                    '--clerk-spacing': '0px',
                  } as React.CSSProperties
                }
              >
                {children}
              </div>
            </div>
            
            <div className="border-t border-black/8 bg-[var(--linen-light)] px-6 py-5 text-center">
              <p className="text-[11px] leading-5 text-[var(--charcoal-light)] tracking-[0.02em]">
                {finePrint}{' '}
                <Link href="/privacy" className="font-medium text-[var(--charcoal)] underline underline-offset-3 hover:text-[var(--espresso)] transition-colors">
                  Privacy
                </Link>{' '}
                &amp;{' '}
                <Link href="/terms" className="font-medium text-[var(--charcoal)] underline underline-offset-3 hover:text-[var(--espresso)] transition-colors">
                  Terms
                </Link>
                .
              </p>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
