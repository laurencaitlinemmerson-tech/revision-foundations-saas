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

const commonHighlights = [
  'Saved pages and dashboard access stay attached to one login.',
  'Using one email keeps purchases and access connected cleanly.',
  'You can come back later without losing your place.',
];

const modeNote = {
  'sign-in':
    'Use the same email you have used before so any saved pages and access reconnect properly.',
  'sign-up':
    'Creating an account does not start a subscription. It simply gives your saves and future purchases one proper home.',
} as const;

const modeChecklist = {
  'sign-in': [
    'Use the same email address you used before so your saved pages and access reconnect properly.',
    'If you are on a new device, your dashboard and saved content will still appear after you sign in.',
  ],
  'sign-up': [
    'Use an email address you can open right now so you can verify your account without extra steps.',
    'Keep using one login for purchases, saved pages, and future sign-ins so everything stays together.',
    'Making an account here does not start a paid plan on its own.',
  ],
} as const;

const modeFormHeading = {
  'sign-in': 'Pick up where you left off',
  'sign-up': 'Create your study space',
} as const;

const modeBadges = {
  'sign-in': [
    {
      label: 'Saved pages',
      className: 'bg-[var(--linen-light)] text-[var(--charcoal)]',
    },
    {
      label: 'Dashboard access',
      className: 'bg-[var(--blue-50)] text-[var(--blue-800)]',
    },
    {
      label: 'Secure sign-in',
      className: 'bg-[var(--teal-50)] text-[var(--teal-800)]',
    },
  ],
  'sign-up': [
    {
      label: 'Free account',
      className: 'bg-[var(--teal-50)] text-[var(--teal-800)]',
    },
    {
      label: 'No subscription',
      className: 'bg-[var(--blue-50)] text-[var(--blue-800)]',
    },
    {
      label: 'Start with the hub',
      className: 'bg-[var(--amber-50)] text-[var(--amber-800)]',
    },
  ],
} as const;

const modeProofItems = {
  'sign-in': [
    {
      label: 'Login',
      value: '1',
      note: 'email used to reconnect your saves and access',
      className: 'bg-[var(--linen-light)] text-[var(--charcoal)]',
    },
    {
      label: 'Access',
      value: 'Any device',
      note: 'your dashboard is there when you return',
      className: 'bg-[var(--blue-50)] text-[var(--blue-800)]',
    },
    {
      label: 'Security',
      value: 'Clerk',
      note: 'handles sign-in and account protection',
      className: 'bg-[var(--teal-50)] text-[var(--teal-800)]',
    },
  ],
  'sign-up': [
    {
      label: 'Cost',
      value: '£0',
      note: 'to create your account and start saving pages',
      className: 'bg-[var(--teal-50)] text-[var(--teal-800)]',
    },
    {
      label: 'Setup',
      value: '1 min',
      note: 'to get your login and dashboard ready',
      className: 'bg-[var(--blue-50)] text-[var(--blue-800)]',
    },
    {
      label: 'Purpose',
      value: '1 place',
      note: 'for saved pages, dashboard access, and purchases',
      className: 'bg-[var(--amber-50)] text-[var(--amber-800)]',
    },
  ],
} as const;

const modePanelLabel = {
  'sign-in': 'Secure account access',
  'sign-up': 'Free account setup',
} as const;

const modeSupportHeading = {
  'sign-in': 'Use one login and everything reconnects properly.',
  'sign-up': 'One account keeps the practical side of revision simple.',
} as const;

const modeSupportBody = {
  'sign-in':
    'Your dashboard, saved pages, and any access you already have are tied to one email. Signing in with that same login is the cleanest way to get straight back into your study space.',
  'sign-up':
    'Free hub pages, saved resources, dashboard access, and later purchases all sit behind one login. That keeps things calmer to come back to when placement and revision get busy.',
} as const;

const modePullQuote = {
  'sign-in':
    'Use the same email as before and your dashboard, saved pages, and access should fall back into place.',
  'sign-up':
    'Start with a free account now, then keep one calm login for your saves, dashboard, and anything you unlock later.',
} as const;

const modePullQuoteSource = {
  'sign-in': 'Account recovery note',
  'sign-up': 'New account note',
} as const;

const modeFeatureColumns = {
  'sign-in': [
    {
      label: 'Reconnect',
      title: 'Your saved pages should come back with the same login.',
      body: 'If you have used The Nurse Lab before, signing in with the same email is the cleanest route back to your study space.',
    },
    {
      label: 'Protected',
      title: 'Your account stays behind a secure Clerk flow.',
      body: 'Passwords, email codes, and account protection are handled by Clerk so the sign-in journey stays reliable.',
    },
  ],
  'sign-up': [
    {
      label: 'Free start',
      title: 'Creating an account does not start a subscription.',
      body: 'You can make your login, save pages, and use the free parts of the hub before deciding whether to unlock anything else.',
    },
    {
      label: 'One place',
      title: 'Keep purchases, saves, and dashboard access together.',
      body: 'Using one account now keeps the practical side of revision calmer later when placement and deadlines get busy.',
    },
  ],
} as const;

export default function AuthPageShell({
  title,
  intro,
  helper,
  cardLabel,
  finePrint,
  children,
  mode,
}: AuthPageShellProps) {
  const formHeadingId = `${mode}-form-title`;
  const formDescriptionId = `${mode}-form-description`;
  const supportHeadingId = `${mode}-support-title`;
  const backgroundRuleStyle: React.CSSProperties = {
    backgroundImage:
      'repeating-linear-gradient(180deg, rgba(26,24,21,0.05) 0, rgba(26,24,21,0.05) 1px, transparent 1px, transparent 88px)',
  };

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[var(--espresso)]">
      <Navbar />

      <main id="main-content" className="bg-[var(--cream)]">
        <section className="relative overflow-hidden border-b border-black/8 px-6 pb-0 pt-28 sm:px-8 sm:pt-32">
          <div className="absolute inset-x-0 top-0 h-[540px] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(250,250,248,0.94)_46%,rgba(250,250,248,1))]" />
          <div className="absolute inset-0 opacity-50" style={backgroundRuleStyle} />

          <div className="relative mx-auto max-w-[1120px]">
            <div className="grid gap-6 pb-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] lg:items-start">
              <div className="order-2 lg:order-1">
                <div className="flex flex-wrap gap-2">
                  {modeBadges[mode].map((badge) => (
                    <span
                      key={badge.label}
                      className={`inline-flex items-center px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>

                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--charcoal-light)]">
                  Account
                </p>

                <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(2.3rem,6vw,4.2rem)] leading-[1.02] tracking-[-0.03em] text-[var(--espresso)]">
                  {title}
                </h1>

                <p className="mt-5 max-w-[34rem] text-[16px] font-light leading-[1.85] text-[var(--charcoal)] sm:text-[17px]">
                  {intro}
                </p>

                <p className="mt-4 max-w-[34rem] text-[13px] leading-7 text-[var(--charcoal-light)] sm:text-[14px]">
                  {helper}
                </p>

                <div className="mt-8 border-l border-[rgba(26,24,21,0.14)] bg-white/70 px-5 py-5 backdrop-blur-sm sm:px-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--charcoal-light)]">
                    {modePullQuoteSource[mode]}
                  </p>
                  <p className="mt-3 max-w-[26rem] font-display text-[clamp(1.55rem,3vw,2.2rem)] leading-[1.06] text-[var(--espresso)]">
                    {modePullQuote[mode]}
                  </p>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {commonHighlights.map((item) => (
                    <div
                      key={item}
                      className="border border-black/8 bg-white/92 px-4 py-4 shadow-[0_18px_50px_rgba(26,24,21,0.04)]"
                    >
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal-light)]">
                        One account
                      </p>
                      <p className="mt-2 text-[14px] leading-6 text-[var(--charcoal)]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <section
                aria-labelledby={formHeadingId}
                aria-describedby={formDescriptionId}
                className="order-1 overflow-hidden border border-black/8 bg-white shadow-[0_28px_90px_rgba(26,24,21,0.07)] lg:order-2"
              >
                <div className="border-b border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,243,240,0.96))] px-5 py-5 sm:px-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--charcoal-light)]">
                      {cardLabel}
                    </p>
                    <span className="inline-flex items-center bg-[var(--linen-light)] px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-[var(--charcoal)]">
                      {modePanelLabel[mode]}
                    </span>
                  </div>

                  <h2
                    id={formHeadingId}
                    className="mt-4 font-display text-[clamp(1.75rem,4vw,2.35rem)] leading-[1.04] tracking-[-0.02em] text-[var(--espresso)]"
                  >
                    {modeFormHeading[mode]}
                  </h2>

                  <p id={formDescriptionId} className="mt-3 text-sm leading-6 text-[var(--charcoal)]">
                    {mode === 'sign-in'
                      ? 'Use the same email as before so your saves and access line up properly.'
                      : 'Create your account once, then keep the same details for purchases, saves, and future sign-ins.'}
                  </p>
                </div>

                <div className="grid gap-px border-b border-black/8 bg-black/8 sm:grid-cols-2">
                  {modeFeatureColumns[mode].map((column) => (
                    <div key={column.label} className="bg-[rgba(255,251,245,0.92)] px-5 py-4 sm:px-6">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal-light)]">
                        {column.label}
                      </p>
                      <p className="mt-2 font-display text-[1.3rem] leading-[1.08] text-[var(--espresso)]">
                        {column.title}
                      </p>
                      <p className="mt-2 text-[13px] leading-6 text-[var(--charcoal)]">{column.body}</p>
                    </div>
                  ))}
                </div>

                <div className="border-b border-black/8 bg-[var(--linen-light)] px-5 py-4 sm:px-6">
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--charcoal-light)]">
                    Before you continue
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--charcoal)]">
                    {modeChecklist[mode].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--espresso)]/55"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-5 py-5 sm:px-6">
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

                <div className="border-t border-black/8 bg-[var(--linen-light)] px-5 py-4 sm:px-6">
                  <p className="text-sm leading-6 text-[var(--charcoal)]">
                    {finePrint}{' '}
                    <Link
                      href="/privacy"
                      className="font-medium text-[var(--espresso)] underline underline-offset-4"
                    >
                      Privacy
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/terms"
                      className="font-medium text-[var(--espresso)] underline underline-offset-4"
                    >
                      terms
                    </Link>
                    .
                  </p>
                </div>
              </section>
            </div>

            <div className="grid border-t border-black/8 bg-white/55 md:grid-cols-3">
              {modeProofItems[mode].map((item, index) => (
                <div
                  key={item.label}
                  className={`border-b border-black/8 py-6 md:border-b-0 ${
                    index < modeProofItems[mode].length - 1 ? 'md:border-r md:pr-8' : ''
                  } ${index > 0 ? 'md:pl-8' : ''}`}
                >
                  <span
                    className={`inline-flex items-center px-3 py-1 text-[11px] uppercase tracking-[0.12em] ${item.className}`}
                  >
                    {item.label}
                  </span>
                  <p className="mt-4 font-display text-[2rem] leading-none text-[var(--espresso)]">
                    {item.value}
                  </p>
                  <p className="mt-2 max-w-[18ch] text-[12px] leading-5 text-[var(--charcoal)]">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-black/8 px-6 py-12 sm:px-8">
          <div className="mx-auto max-w-[1120px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--charcoal-light)]">
              Why The Account Helps
            </p>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.96fr)]">
              <section
                aria-labelledby={supportHeadingId}
                className="border border-black/8 bg-white px-5 py-6 shadow-[0_18px_60px_rgba(26,24,21,0.04)] sm:px-6"
              >
                <h2
                  id={supportHeadingId}
                  className="max-w-[20ch] font-display text-[clamp(1.7rem,4vw,2.35rem)] leading-[1.06] text-[var(--espresso)]"
                >
                  {modeSupportHeading[mode]}
                </h2>

                <p className="mt-4 max-w-[40rem] text-[15px] leading-8 text-[var(--charcoal)]">
                  {modeSupportBody[mode]}
                </p>

                <div className="mt-6 flex flex-wrap gap-4 border-t border-black/8 pt-4">
                  <Link
                    href="/hub"
                    className="text-sm text-[var(--charcoal)] underline underline-offset-4 transition-colors hover:text-[var(--espresso)]"
                  >
                    Browse the hub
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm text-[var(--charcoal)] underline underline-offset-4 transition-colors hover:text-[var(--espresso)]"
                  >
                    See pricing
                  </Link>
                </div>
              </section>

              <section className="border border-[rgba(217,108,85,0.14)] bg-[rgba(255,247,237,0.9)] px-5 py-6 shadow-[0_18px_60px_rgba(217,108,85,0.06)] sm:px-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--amber-800)]">
                  Student note
                </p>

                <p className="mt-3 text-[15px] leading-7 text-[var(--charcoal)]">{modeNote[mode]}</p>

                <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--charcoal)]">
                  {modeChecklist[mode].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--amber-800)]/60"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
