'use client';

import { useState } from 'react';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Loader2, ArrowRight, Shield } from 'lucide-react';
import Testimonials from '@/components/Testimonials';
import { useEntitlements } from '@/lib/hooks/useEntitlements';

type Product = 'osce' | 'quiz' | 'bundle';
type CardTone = Product | 'free';

// design tokens
const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink = '#1A1815';
const inkMid = '#5A5750';
const inkLight = '#9C8878';
const cream = '#FAFAF8';
const parchment = '#F5F3F0';
const panel = '#FFFFFF';
const border = 'rgba(0,0,0,0.08)';
const tagBg = '#F3F1EE';
const green = '#1E8A4D';
const greenBg = '#E6F4EA';
const teal = '#2F8A7E';
const tealBg = '#E6F3F1';
const blue = '#2E67B1';
const blueBg = '#E7EEF8';
const coral = '#D96C55';
const coralBg = '#F8E7E2';
const wrap = '1120px';

const sectionLabelStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const tagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: serif,
  fontSize: '12px',
  color: inkMid,
  background: tagBg,
  padding: '7px 14px',
  lineHeight: 1,
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
  width: '100%',
};

const secondaryBtn: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: 'transparent',
  color: ink,
  padding: '12px 24px',
  border: `0.5px solid ${border}`,
  textDecoration: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  width: '100%',
};

const BUNDLE_FEATURES = [
  '50+ paediatric OSCE stations',
  '17 quiz topics with instant feedback',
  'Revision hub with clinical guides',
  'Timed mode, checklists, and saved progress',
];

const PROOF_ITEMS = [
  { label: 'OSCE stations', value: '50+', note: 'Paediatric stations live now', accent: teal, accentBg: tealBg },
  { label: 'Quiz topics', value: '17', note: 'Core revision areas', accent: blue, accentBg: blueBg },
  { label: 'Hub resources', value: '25+', note: 'Free and premium guides', accent: green, accentBg: greenBg },
  { label: 'Guarantee', value: '7 days', note: 'Money-back, no questions', accent: coral, accentBg: coralBg },
];

const SHAPE_OPTIONS: Array<{
  label: string;
  title: string;
  price: string;
  summary: string;
  points: string[];
  tone: CardTone;
  accent: string;
  accentBg: string;
}> = [
  {
    label: 'Free',
    title: 'Free Hub',
    price: '£0',
    summary: 'Browse practical revision guides first if you want to check the tone and usefulness before paying.',
    points: ['Selected free hub resources', 'No payment needed', 'Best if you want to explore first'],
    tone: 'free',
    accent: green,
    accentBg: greenBg,
  },
  {
    label: 'Best value',
    title: "Children's Bundle",
    price: '£9.99',
    summary: 'Everything in one place — OSCE prep, quiz revision, and placement guides.',
    points: ['OSCE Tool + Core Quiz + Hub', 'Best for placement and OSCE prep together', 'All future updates included'],
    tone: 'bundle',
    accent: ink,
    accentBg: parchment,
  },
  {
    label: 'Focused',
    title: 'OSCE Tool only',
    price: '£4.99',
    summary: 'Station practice only — if OSCEs are your immediate priority.',
    points: ['50+ paediatric OSCE stations', 'Timed mode and marking checklists', 'Good for targeted station prep'],
    tone: 'osce',
    accent: teal,
    accentBg: tealBg,
  },
  {
    label: 'Focused',
    title: 'Quiz only',
    price: '£4.99',
    summary: 'Question-based revision without the full bundle.',
    points: ['17 quiz topics', 'Instant feedback and explanations', 'Good for high-yield recall practice'],
    tone: 'quiz',
    accent: blue,
    accentBg: blueBg,
  },
];

const HOW_TO_USE_STEPS = [
  {
    number: '01',
    title: 'Create a free account',
    body: 'Sign up with your email — takes under a minute. No payment needed at this stage.',
  },
  {
    number: '02',
    title: 'Choose what you need',
    body: 'Pick the full bundle or a single tool. Free previews are available so you can try before you buy.',
  },
  {
    number: '03',
    title: 'Pay once',
    body: 'One payment via Stripe. No subscription, no recurring charge. Yours permanently.',
  },
  {
    number: '04',
    title: 'Start revising',
    body: 'Access everything instantly from your dashboard — on any device, online or offline.',
  },
];

const FAQS = [
  { q: 'Is this a subscription?', a: 'No. One payment, yours forever. No recurring charges.' },
  { q: 'Do I need an account?', a: 'Yes — create a free account first so your purchase, saved pages, and dashboard access all stay in one place.' },
  { q: "What if it's not for me?", a: "Full refund within 7 days, no questions asked. Just email and we'll sort it." },
  { q: 'Will more content be added?', a: 'Yes. New resources are added over time and included in your purchase.' },
  { q: 'Does it work on mobile?', a: 'Yes. Everything is mobile-friendly and designed for revising on placement, on the bus, wherever.' },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const { hasOsce, hasQuiz, hasBundle, isPro, isLoading: accessLoading } = useEntitlements();
  const redirectUrl = '/pricing';

  const [loading, setLoading] = useState<Product | null>(null);

  const handlePurchase = async (product: Product) => {
    if (!isSignedIn) return;
    setLoading(product);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data?.error || 'No checkout URL returned');
    } catch (err: unknown) {
      alert(`Oops! ${err instanceof Error ? err.message : 'Something went wrong.'}`);
    } finally {
      setLoading(null);
    }
  };

  if (!accessLoading && hasBundle) {
    return (
      <div style={{ background: cream, minHeight: '100vh' }}>
        <Navbar />
        <main style={{ padding: '128px 24px 96px' }}>
          <div style={{ maxWidth: wrap, margin: '0 auto' }}>
            <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', background: greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p style={sectionLabelStyle}>Account status</p>
              <h1 style={{ fontFamily: display, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 400, color: ink, marginBottom: '12px', lineHeight: 1.12 }}>
                You have full access.
              </h1>
              <p style={{ fontFamily: serif, fontSize: '15px', lineHeight: 1.85, fontWeight: 300, color: inkMid, marginBottom: '28px' }}>
                Lifetime access to everything — no subscription, no renewal.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                {['OSCE Tool', 'Core Quiz', 'Revision Hub', 'Lifetime access'].map((l) => (
                  <span key={l} style={tagStyle}>
                    {l}
                  </span>
                ))}
              </div>
              <Link href="/dashboard" style={{ ...primaryBtn, display: 'inline-flex', width: 'auto' }}>
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      <section style={{ padding: '128px 24px 0', borderBottom: `0.5px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <div
            className="pricing-hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.05fr) minmax(340px, 0.95fr)',
              gap: '24px',
              alignItems: 'end',
              paddingBottom: '48px',
            }}
          >
            <div>
              <p style={sectionLabelStyle}>Pricing</p>
              <h1
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
                  fontWeight: 400,
                  lineHeight: 1.04,
                  color: ink,
                  marginBottom: '20px',
                  maxWidth: '14ch',
                }}
              >
                Lifetime access. One payment.
              </h1>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '17px',
                  lineHeight: 1.85,
                  fontWeight: 300,
                  color: inkMid,
                  maxWidth: '540px',
                  marginBottom: '28px',
                }}
              >
                The Children&apos;s Bundle brings together paediatric OSCE practice, core quiz revision, and placement-ready guides in one calm study space.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
                {['No subscription', 'Free previews available', '7-day guarantee', 'Works on mobile'].map((t) => (
                  <span key={t} style={tagStyle}>
                    <Check size={12} color={inkMid} />
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/hub/childrens" style={{ ...secondaryBtn, width: 'auto' }}>
                  Browse free resources →
                </Link>
              </div>
            </div>

            <div
              id="bundle"
              style={{
                border: `0.5px solid ${border}`,
                background: panel,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '32px 32px 24px', borderBottom: `0.5px solid ${border}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ ...tagStyle, background: parchment, marginBottom: '12px', display: 'inline-flex' }}>
                      Best value
                    </span>
                    <h2 style={{ fontFamily: display, fontSize: '28px', fontWeight: 400, color: ink, lineHeight: 1.1 }}>
                      Children&apos;s Bundle
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: display, fontSize: '44px', lineHeight: 1, color: ink }}>£9.99</p>
                    <p style={{ fontFamily: serif, fontSize: '12px', color: inkLight, marginTop: '4px' }}>
                      one payment
                    </p>
                  </div>
                </div>
                <p style={{ fontFamily: serif, fontSize: '14px', lineHeight: 1.8, fontWeight: 300, color: inkMid }}>
                  The full setup for OSCE practice, question revision, and quick clinical refreshers in one place.
                </p>
              </div>

              <div style={{ padding: '20px 32px 24px', borderBottom: `0.5px solid ${border}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {BUNDLE_FEATURES.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Check size={13} color={inkMid} style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span style={{ fontFamily: serif, fontSize: '13px', color: inkMid, lineHeight: 1.55, fontWeight: 300 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '24px 32px', background: parchment }}>
                {!isSignedIn ? (
                  <SignedOutActions createLabel="Create account to continue" redirectUrl={redirectUrl} primaryStyle={primaryBtn} />
                ) : (
                  <button onClick={() => handlePurchase('bundle')} disabled={loading !== null} style={primaryBtn}>
                    {loading === 'bundle' ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Processing…
                      </>
                    ) : (
                      <>Get Children&apos;s Bundle — £9.99</>
                    )}
                  </button>
                )}

                <div style={{ display: 'grid', gap: '8px', marginTop: '16px' }}>
                  {[
                    { icon: Shield, text: '7-day money-back guarantee' },
                    { icon: Check, text: 'No subscription or recurring charges' },
                  ].map((item) => (
                    <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <item.icon size={13} color={inkLight} style={{ flexShrink: 0 }} />
                      <span style={{ fontFamily: serif, fontSize: '12px', color: inkMid, fontWeight: 300 }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="pricing-proof-strip"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
              borderTop: `0.5px solid ${border}`,
            }}
          >
            {PROOF_ITEMS.map((item, i) => (
              <div
                key={item.label}
                style={{
                  padding: '22px 0',
                  borderRight: i < 3 ? `0.5px solid ${border}` : 'none',
                  paddingLeft: i > 0 ? '28px' : '0',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 10px',
                    fontFamily: serif,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: item.accent,
                    background: item.accentBg,
                    marginBottom: '10px',
                  }}
                >
                  {item.label}
                </span>
                <p style={{ fontFamily: display, fontSize: '28px', color: ink, lineHeight: 1, marginBottom: '4px' }}>
                  {item.value}
                </p>
                <p style={{ fontFamily: serif, fontSize: '12px', color: inkMid, fontWeight: 300 }}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px 0', borderBottom: `0.5px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <div style={{ marginBottom: '28px' }}>
            <p style={sectionLabelStyle}>Choose the shape</p>
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                fontWeight: 400,
                color: ink,
                marginBottom: '10px',
                lineHeight: 1.1,
              }}
            >
              Pick the route that matches what you need.
            </h2>
            <p style={{ fontFamily: serif, fontSize: '15px', lineHeight: 1.85, fontWeight: 300, color: inkMid, maxWidth: '560px' }}>
              Start free if you want to explore first, then move to a paid tool only when you know which lane you&apos;ll actually use.
            </p>
          </div>

          <div
            className="pricing-shape-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
              gap: '16px',
              paddingBottom: '48px',
            }}
          >
            {SHAPE_OPTIONS.map((item) => {
              const isOwned = item.tone === 'osce' ? hasOsce : item.tone === 'quiz' ? hasQuiz : false;
              const openHref = item.tone === 'free' ? '/hub/childrens' : item.tone === 'osce' ? '/osce' : item.tone === 'quiz' ? '/quiz' : '/dashboard';
              const openLabel = item.tone === 'free' ? 'Browse Free Hub' : item.tone === 'osce' ? 'Open OSCE Tool' : item.tone === 'quiz' ? 'Open Quiz' : 'Go to Dashboard';
              const buyLabel = item.tone === 'bundle' ? "Get Children's Bundle — £9.99" : item.tone === 'osce' ? 'Get OSCE Tool — £4.99' : 'Get Quiz — £4.99';
              const isBest = item.tone === 'bundle';
              const purchaseTone = item.tone === 'free' ? null : item.tone;

              return (
                <div
                  key={item.title}
                  className="pricing-shape-card"
                  style={{
                    border: `0.5px solid ${isBest ? 'rgba(26,24,21,0.14)' : border}`,
                    background: panel,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ padding: '24px 24px 20px', borderBottom: `0.5px solid ${border}` }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '5px 12px',
                        fontFamily: serif,
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: item.accent,
                        background: item.accentBg,
                        marginBottom: '14px',
                      }}
                    >
                      {item.label}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                      <h3 style={{ fontFamily: display, fontSize: '22px', fontWeight: 400, color: ink, lineHeight: 1.15 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontFamily: display, fontSize: '30px', lineHeight: 1, color: ink, flexShrink: 0 }}>
                        {item.price}
                      </p>
                    </div>

                    <p style={{ fontFamily: serif, fontSize: '13px', lineHeight: 1.75, fontWeight: 300, color: inkMid }}>
                      {item.summary}
                    </p>
                  </div>

                  <div style={{ padding: '18px 24px', flexGrow: 1 }}>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {item.points.map((point) => (
                        <div key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span
                            style={{
                              width: '17px',
                              height: '17px',
                              background: item.accentBg,
                              color: item.accent,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '10px',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            ✓
                          </span>
                          <span style={{ fontFamily: serif, fontSize: '13px', lineHeight: 1.7, fontWeight: 300, color: inkMid }}>
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '0 24px 24px' }}>
                    {item.tone === 'free' ? (
                      <Link href={openHref} style={secondaryBtn}>
                        {openLabel}
                      </Link>
                    ) : !isSignedIn ? (
                      <SignedOutActions createLabel="Create account to continue" redirectUrl={redirectUrl} primaryStyle={item.tone === 'bundle' ? primaryBtn : secondaryBtn} />
                    ) : isOwned || item.tone === 'bundle' && hasBundle ? (
                      <Link href={openHref} style={secondaryBtn}>
                        {openLabel}
                      </Link>
                    ) : (
                      <button onClick={() => handlePurchase(purchaseTone!)} disabled={loading !== null} style={item.tone === 'bundle' ? primaryBtn : secondaryBtn}>
                        {loading === purchaseTone ? (
                          <>
                            <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing…
                          </>
                        ) : (
                          buyLabel
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {!isPro && (
        <section style={{ padding: '36px 24px', borderBottom: `0.5px solid ${border}` }}>
          <div style={{ maxWidth: wrap, margin: '0 auto' }}>
            <div
              className="pricing-preview-strip"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) auto',
                gap: '24px',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={sectionLabelStyle}>Not sure yet?</p>
                <h2 style={{ fontFamily: display, fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 400, color: ink, lineHeight: 1.15 }}>
                  Try the free previews before you buy.
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flexShrink: 0 }}>
                <Link href="/osce" style={{ ...secondaryBtn, width: 'auto' }}>
                  Try OSCE preview →
                </Link>
                <Link href="/quiz" style={{ ...secondaryBtn, width: 'auto' }}>
                  Try quiz preview →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: '48px 24px', borderBottom: `0.5px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <div style={{ marginBottom: '36px' }}>
            <p style={sectionLabelStyle}>How it works</p>
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
                fontWeight: 400,
                color: ink,
                lineHeight: 1.1,
                maxWidth: '22ch',
              }}
            >
              From sign-up to studying in four steps.
            </h2>
          </div>

          <div
            className="pricing-steps-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              borderTop: `0.5px solid ${border}`,
              borderLeft: `0.5px solid ${border}`,
            }}
          >
            {HOW_TO_USE_STEPS.map((step) => (
              <div
                key={step.number}
                style={{
                  padding: '32px 28px 36px',
                  borderRight: `0.5px solid ${border}`,
                  borderBottom: `0.5px solid ${border}`,
                  background: panel,
                }}
              >
                <p
                  style={{
                    fontFamily: display,
                    fontSize: '3rem',
                    lineHeight: 1,
                    color: ink,
                    opacity: 0.1,
                    marginBottom: '20px',
                    userSelect: 'none',
                  }}
                >
                  {step.number}
                </p>
                <p
                  style={{
                    fontFamily: display,
                    fontSize: '18px',
                    fontWeight: 400,
                    color: ink,
                    lineHeight: 1.25,
                    marginBottom: '10px',
                  }}
                >
                  {step.title}
                </p>
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '13px',
                    lineHeight: 1.8,
                    fontWeight: 300,
                    color: inkMid,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '48px 24px', borderBottom: `0.5px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <div
            className="pricing-faq-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(200px, 0.7fr) minmax(0, 1.3fr)',
              gap: '48px',
              alignItems: 'start',
            }}
          >
            <div style={{ position: 'sticky', top: '24px' }}>
              <p style={sectionLabelStyle}>Questions</p>
              <h2 style={{ fontFamily: display, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 400, color: ink, lineHeight: 1.1, marginBottom: '14px' }}>
                Common questions answered.
              </h2>
              <p style={{ fontFamily: serif, fontSize: '14px', lineHeight: 1.85, fontWeight: 300, color: inkMid, marginBottom: '20px' }}>
                Anything else? Email lauren@nurselab.co.uk.
              </p>
              <Link href="/contact" style={{ fontFamily: serif, fontSize: '13px', color: ink, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Contact page →
              </Link>
            </div>

            <div
              style={{
                border: `0.5px solid ${border}`,
                background: panel,
                overflow: 'hidden',
              }}
            >
              {FAQS.map((faq, i) => (
                <div
                  key={faq.q}
                  style={{
                    padding: '22px 28px',
                    borderBottom: i < FAQS.length - 1 ? `0.5px solid ${border}` : 'none',
                  }}
                >
                  <p style={{ fontFamily: serif, fontSize: '14px', fontWeight: 500, color: ink, marginBottom: '6px' }}>{faq.q}</p>
                  <p style={{ fontFamily: serif, fontSize: '14px', lineHeight: 1.75, fontWeight: 300, color: inkMid }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {!isPro && (
        <section style={{ padding: '88px 24px 96px' }}>
          <div style={{ maxWidth: wrap, margin: '0 auto' }}>
            <div
              className="pricing-final-cta"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) auto',
                gap: '32px',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={sectionLabelStyle}>Ready</p>
                <h2 style={{ fontFamily: display, fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 400, lineHeight: 1.1, color: ink, marginBottom: '12px' }}>
                  Start with the tools you&apos;ll actually use on placement.
                </h2>
                <p style={{ fontFamily: serif, fontSize: '15px', lineHeight: 1.85, fontWeight: 300, color: inkMid, maxWidth: '560px' }}>
                  One payment. Lifetime access. Built for nursing students preparing for real assessments.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px', flexShrink: 0 }}>
                {isSignedIn ? (
                  <button onClick={() => handlePurchase('bundle')} disabled={loading !== null} style={primaryBtn}>
                    {loading === 'bundle' ? (
                      <>
                        <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing…
                      </>
                    ) : (
                      'Get the Bundle — £9.99'
                    )}
                  </button>
                ) : (
                  <SignedOutActions createLabel="Create account to continue" redirectUrl={redirectUrl} primaryStyle={primaryBtn} />
                )}
                <Link href="/hub/childrens" style={secondaryBtn}>
                  Browse free first →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        .waitlist-input::placeholder { color: #B8AD9E; }
        .waitlist-input:focus { border-color: #B8AD9E !important; background: #fff !important; }

        .pricing-shape-card {
          transition: border-color 0.2s ease;
        }
        .pricing-shape-card:hover {
          border-color: #B8AD9E !important;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1100px) {
          .pricing-shape-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
        }

        @media (max-width: 900px) {
          .pricing-hero-grid { grid-template-columns: 1fr !important; }
          .pricing-faq-grid { grid-template-columns: 1fr !important; }
          .pricing-final-cta { grid-template-columns: 1fr !important; }
          .pricing-preview-strip { grid-template-columns: 1fr !important; }
          .pricing-proof-strip { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .pricing-steps-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
        }

        @media (max-width: 560px) {
          .pricing-proof-strip { grid-template-columns: 1fr !important; }
          .pricing-steps-grid { grid-template-columns: 1fr !important; }
          .pricing-shape-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function SignedOutActions({
  createLabel,
  redirectUrl,
  primaryStyle,
}: {
  createLabel: string;
  redirectUrl: string;
  primaryStyle: CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <SignUpButton forceRedirectUrl={redirectUrl} signInForceRedirectUrl={redirectUrl} mode="redirect">
        <button style={primaryStyle}>{createLabel}</button>
      </SignUpButton>
      <SignInButton forceRedirectUrl={redirectUrl}>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: serif,
            fontSize: '12px',
            color: inkMid,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            padding: '4px',
          }}
        >
          Have an account? Sign in
        </button>
      </SignInButton>
    </div>
  );
}
