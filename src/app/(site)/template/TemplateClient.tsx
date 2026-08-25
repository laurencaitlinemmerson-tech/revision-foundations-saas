'use client';

import { useCallback, useEffect, useState } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Check, ExternalLink, Loader2, Shield } from 'lucide-react';

// design tokens — matched to /pricing
const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink = 'var(--ink-strong)';
const inkMid = 'var(--ink-soft)';
const inkLight = 'var(--ink-faint)';
const cream = 'var(--surface-page)';
const parchment = 'var(--surface-sunken)';
const border = 'var(--hairline-soft)';
const gold = 'var(--gold)';
const goldDeep = 'var(--gold-deep)';
const green = 'var(--state-correct-text)';
const greenBg = 'var(--state-correct-surface)';
const wrap = '1120px';

const PRICE = '£9.99';

const sectionLabelStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const primaryBtn: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: ink,
  color: cream,
  padding: '13px 28px',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const bodyText: CSSProperties = {
  fontFamily: serif,
  fontSize: '15px',
  lineHeight: 1.85,
  fontWeight: 300,
  color: inkMid,
};

const DATABASES: Array<{ name: string; detail: string }> = [
  { name: '🎓 Degree Projection', detail: 'Live classification forecast from the marks you have so far' },
  { name: '✨ Module Tracker', detail: 'Every module, its credits, and how much its year counts' },
  { name: '🥧 Result Tracker', detail: 'Each assessment, its weighting, and what it did to your average' },
  { name: '🏥 Placements', detail: 'Blocks, dates, specialties, and what you saw on each one' },
  { name: '⏱️ Placement Hours', detail: 'Shift-by-shift log that totals itself by year' },
  { name: '✅ Proficiencies (PAD)', detail: 'All 93 NMC proficiencies, ready to tick off as they get signed' },
  { name: '🎀 Assignment Planner', detail: 'Briefs, deadlines, drafting stages, and days remaining' },
  { name: '🩺 Condition Bank', detail: '29 written-up paediatric conditions with red flags' },
  { name: '💊 Drug Formulary', detail: 'A structure for building your own drug notes as you learn them' },
  { name: '🃏 Flashcards', detail: 'Active recall cards with a confidence rating to sort revision' },
  { name: '🌼 Lecture Notes', detail: 'A home for your notes, linked to the right module' },
  { name: '🌈 Progress Bar', detail: 'Credits banked against credits needed' },
  { name: '🌷 Quick Links', detail: 'The handful of portals you actually open every week' },
];

const CALCULATES = [
  'Your weighted average across everything graded so far',
  'The classification you are currently on track for',
  'What you would finish on if the rest goes to plan',
  'The average you need from here for a 1st, 2:1 or 2:2',
  'Placement hours totalled per year against what you owe',
  'Days left on every assignment, and how far through it you are',
];

export default function TemplateClient() {
  const { isSignedIn, isLoaded } = useUser();
  const [owned, setOwned] = useState(false);
  const [checking, setChecking] = useState(true);
  const [buying, setBuying] = useState(false);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  const loadLink = useCallback(async () => {
    try {
      const res = await fetch('/api/template-link');
      const data = await res.json();
      if (res.ok && data?.url) {
        setTemplateUrl(data.url);
      } else if (res.ok) {
        setLinkError('Your purchase is confirmed, but the template link is not set up yet. Email us and we will send it over.');
      }
    } catch {
      setLinkError('Could not load your template link. Please refresh, or email us.');
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setChecking(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/check-access?product=template');
        const data = await res.json();
        if (cancelled) return;
        if (data?.hasAccess) {
          setOwned(true);
          await loadLink();
        }
      } catch {
        // fall through to the purchase state
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, loadLink]);

  const handlePurchase = async () => {
    setBuying(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'template' }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data?.error || 'No checkout URL returned');
    } catch (err: unknown) {
      alert(`Oops! ${err instanceof Error ? err.message : 'Something went wrong.'}`);
      setBuying(false);
    }
  };

  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <main style={{ padding: '128px 24px 0' }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <div style={{ maxWidth: '680px' }}>
            <p style={sectionLabelStyle}>Notion template</p>
            <h1
              style={{
                fontFamily: display,
                fontSize: 'clamp(2rem, 5vw, 3.1rem)',
                fontWeight: 400,
                color: ink,
                lineHeight: 1.1,
                marginBottom: '20px',
              }}
            >
              The Nursing Student <em style={{ color: goldDeep }}>Dashboard</em>
            </h1>
            <p style={{ ...bodyText, fontSize: '17px', marginBottom: '28px' }}>
              The system I actually run my own degree on — the grade projection, the placement
              hours, the PAD proficiencies, all wired together. Emptied out, ready for yours.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '36px' }}>
              {['13 linked databases', 'All 93 NMC proficiencies', 'One payment, yours to keep'].map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: serif,
                    fontSize: '12px',
                    color: inkMid,
                    background: parchment,
                    padding: '7px 14px',
                    lineHeight: 1,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* ── Purchase / access panel ── */}
            <div style={{ border: `0.5px solid ${border}`, padding: '28px', background: cream }}>
              {owned ? (
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: greenBg,
                      color: green,
                      fontFamily: serif,
                      fontSize: '12px',
                      padding: '7px 14px',
                      marginBottom: '16px',
                    }}
                  >
                    <Check size={14} /> You own this template
                  </div>
                  {templateUrl ? (
                    <>
                      <a
                        href={templateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ ...primaryBtn, marginBottom: '12px' }}
                      >
                        Open in Notion and duplicate <ExternalLink size={15} />
                      </a>
                      <p style={{ ...bodyText, fontSize: '13px', margin: 0 }}>
                        Click <strong>Duplicate</strong> in the top-right of the Notion page to copy
                        it into your own workspace. You will need a free Notion account.
                      </p>
                    </>
                  ) : (
                    <p style={{ ...bodyText, margin: 0 }}>
                      {linkError ?? 'Loading your template link…'}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '18px' }}>
                    <span style={{ fontFamily: display, fontSize: '2.2rem', color: ink, lineHeight: 1 }}>
                      {PRICE}
                    </span>
                    <span style={{ ...bodyText, fontSize: '13px' }}>one payment</span>
                  </div>
                  {isSignedIn ? (
                    <button onClick={handlePurchase} disabled={buying} style={primaryBtn}>
                      {buying ? (
                        <>
                          <Loader2 size={15} className="animate-spin" /> Redirecting…
                        </>
                      ) : (
                        <>
                          Get the template <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  ) : (
                    <SignInButton mode="modal">
                      <button style={primaryBtn}>
                        Sign in to buy <ArrowRight size={15} />
                      </button>
                    </SignInButton>
                  )}
                  <p style={{ ...bodyText, fontSize: '13px', marginTop: '14px', marginBottom: 0 }}>
                    {checking && isSignedIn
                      ? 'Checking whether you already own this…'
                      : 'Delivered as a Notion duplicate link, instantly. A free Notion account is all you need.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── What it works out ── */}
      <section style={{ padding: '96px 24px 0' }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <p style={sectionLabelStyle}>What it works out for you</p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              color: ink,
              marginBottom: '32px',
              maxWidth: '620px',
              lineHeight: 1.2,
            }}
          >
            Put your marks in once. It tells you where you stand.
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1px',
              background: border,
              border: `0.5px solid ${border}`,
            }}
          >
            {CALCULATES.map((c) => (
              <div key={c} style={{ background: cream, padding: '22px 24px', display: 'flex', gap: '12px' }}>
                <Check size={16} style={{ color: goldDeep, flexShrink: 0, marginTop: '4px' }} />
                <span style={{ ...bodyText, fontSize: '14px' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's inside ── */}
      <section style={{ padding: '96px 24px 0' }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <p style={sectionLabelStyle}>What&rsquo;s inside</p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              color: ink,
              marginBottom: '32px',
              maxWidth: '620px',
              lineHeight: 1.2,
            }}
          >
            Thirteen databases, already linked to each other.
          </h2>
          <div style={{ borderTop: `0.5px solid ${border}` }}>
            {DATABASES.map((d) => (
              <div
                key={d.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(200px, 260px) 1fr',
                  gap: '24px',
                  padding: '18px 0',
                  borderBottom: `0.5px solid ${border}`,
                }}
              >
                <span style={{ fontFamily: serif, fontSize: '14px', color: ink }}>{d.name}</span>
                <span style={{ ...bodyText, fontSize: '14px' }}>{d.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Honest notes ── */}
      <section style={{ padding: '96px 24px 0' }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <div style={{ maxWidth: '680px' }}>
            <p style={sectionLabelStyle}>Before you buy</p>
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 400,
                color: ink,
                marginBottom: '24px',
                lineHeight: 1.2,
              }}
            >
              Things worth knowing.
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {[
                {
                  q: 'Will the grade projection match my university?',
                  a: 'It is set up so you tell it your rules — you enter your own classification boundaries and how much each year counts. It uses a credit-weighted average, which is how most UK courses work. If yours discounts your worst module or caps resits, the projection will not match exactly, so check it against your handbook.',
                },
                {
                  q: 'Do I need to pay for Notion?',
                  a: 'No. A free personal Notion account runs all of this.',
                },
                {
                  q: 'Is my own data in it?',
                  a: 'No. It is a blank copy — my grades, placements, shifts and notes have all been stripped out. What remains is the structure, plus the 93 NMC proficiencies and a set of written-up paediatric conditions.',
                },
                {
                  q: 'Can I get a refund?',
                  a: 'Because it is delivered instantly as a duplicate link, it cannot be returned once you have copied it. Email before duplicating if it is not what you expected and we will sort it out.',
                },
              ].map((f) => (
                <div key={f.q} style={{ borderLeft: `2px solid ${gold}`, paddingLeft: '18px' }}>
                  <p style={{ fontFamily: serif, fontSize: '14px', color: ink, marginBottom: '6px' }}>
                    {f.q}
                  </p>
                  <p style={{ ...bodyText, fontSize: '14px', margin: 0 }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing ── */}
      <section style={{ padding: '96px 24px 120px' }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <div
            style={{
              border: `0.5px solid ${border}`,
              padding: 'clamp(32px, 6vw, 56px)',
              textAlign: 'center',
            }}
          >
            <Shield size={20} style={{ color: goldDeep, marginBottom: '14px' }} />
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                fontWeight: 400,
                color: ink,
                marginBottom: '12px',
                lineHeight: 1.2,
              }}
            >
              {owned ? 'It’s yours — go and set it up.' : `Everything above, for ${PRICE}.`}
            </h2>
            <p style={{ ...bodyText, maxWidth: '520px', margin: '0 auto 24px' }}>
              {owned
                ? 'Give yourself fifteen minutes with it and put your own modules in.'
                : 'One payment. No subscription. Yours to keep and change however you like.'}
            </p>
            {!owned && (
              <div>
                {isSignedIn ? (
                  <button onClick={handlePurchase} disabled={buying} style={primaryBtn}>
                    {buying ? 'Redirecting…' : 'Get the template'} <ArrowRight size={15} />
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button style={primaryBtn}>
                      Sign in to buy <ArrowRight size={15} />
                    </button>
                  </SignInButton>
                )}
              </div>
            )}
            <p style={{ ...bodyText, fontSize: '13px', marginTop: '20px', marginBottom: 0 }}>
              Looking for the revision tools instead?{' '}
              <Link href="/pricing" style={{ color: ink, textDecoration: 'underline' }}>
                See all pricing
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
