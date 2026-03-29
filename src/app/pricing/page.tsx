'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Check,
  BookOpen,
  ClipboardCheck,
  Loader2,
  Mail,
  ArrowRight,
  Crown,
  Shield,
  X,
  Info,
} from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';

type Product = 'osce' | 'quiz' | 'bundle';

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#F9F6F0';
const parchment = '#F3EEE4';
const panel = '#F6F0E5';
const border = '#D9D0C1';
const softLine = 'rgba(217, 208, 193, 0.7)';
const tagBg = '#EFE5D4';

const sectionLabel: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const body: CSSProperties = {
  fontFamily: serif,
  fontSize: '16px',
  lineHeight: 1.9,
  fontWeight: 300,
  color: inkMid,
};

const editorialCard: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '28px',
  overflow: 'hidden',
};

const tagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontFamily: serif,
  fontSize: '13px',
  color: inkMid,
  background: tagBg,
  padding: '8px 14px',
  borderRadius: '999px',
  lineHeight: 1,
};

const primaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: ink,
  color: cream,
  padding: '14px 28px',
  borderRadius: '9999px',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  width: '100%',
};

const secondaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: 'transparent',
  color: ink,
  padding: '13px 24px',
  borderRadius: '9999px',
  border: `1px solid ${border}`,
  textDecoration: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  width: '100%',
};

const inputStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '14px',
  width: '100%',
  padding: '12px 16px 12px 40px',
  border: `1px solid ${border}`,
  borderRadius: '14px',
  background: '#fff',
  color: ink,
  outline: 'none',
};

const BUNDLE_FEATURES = [
  '50+ paediatric OSCE stations',
  'Core nursing quiz — 17 topics',
  'Revision hub with clinical guides',
  'Timed exam mode + marking checklists',
  'Progress tracking dashboard',
  'All future updates included',
];

const FAQS = [
  { q: 'Is this a subscription?', a: 'Nope. One payment, yours forever. No recurring charges.' },
  { q: 'Do I need an account?', a: "Not to buy — you can checkout as a guest with just your email. Create an account later to sync progress across devices." },
  { q: "What if it's not for me?", a: 'Full refund within 7 days, no questions asked. Just email and we\'ll sort it.' },
  { q: 'Will more content be added?', a: 'Yes — new resources are added regularly. All future updates are included with your purchase.' },
  { q: 'Does it work on my phone?', a: 'Yes. Everything is mobile-friendly and designed for revising on placement, on the bus, wherever.' },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const { hasOsce, hasQuiz, hasBundle, isPro, isLoading: accessLoading } = useEntitlements();

  const [loading, setLoading] = useState<Product | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState<Product | null>(null);
  const [emailError, setEmailError] = useState('');
  const [adultEmail, setAdultEmail] = useState('');
  const [adultSubmitted, setAdultSubmitted] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const resetEmailState = () => setEmailError('');

  const handlePurchase = async (product: Product) => {
    if (!isSignedIn && !guestEmail.trim()) {
      setShowEmailInput(product);
      setEmailError('');
      return;
    }
    if (!isSignedIn && !validateEmail(guestEmail)) {
      setShowEmailInput(product);
      setEmailError('Please enter a valid email address');
      return;
    }
    setLoading(product);
    setEmailError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, guestEmail: !isSignedIn ? guestEmail.trim() : undefined }),
      });
      const data = await response.json();
      if (data?.url) { window.location.href = data.url; return; }
      throw new Error(data?.error || 'No checkout URL returned');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      alert(`Oops! ${message}`);
    } finally { setLoading(null); }
  };

  const handleGuestCheckout = (product: Product) => {
    if (!validateEmail(guestEmail)) { setEmailError('Please enter a valid email address'); return; }
    void handlePurchase(product);
  };

  const handleAdultWaitlist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(adultEmail)) return;
    await new Promise((resolve) => setTimeout(resolve, 400));
    setAdultSubmitted(true);
  };

  // ── Full access state ──
  if (!accessLoading && hasBundle) {
    return (
      <div style={{ background: cream, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px' }}>
          <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
            <p style={sectionLabel}>Account status</p>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: parchment, border: `1px solid ${softLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Crown style={{ width: '28px', height: '28px', color: inkMid }} />
            </div>
            <h1 style={{ fontFamily: display, fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 400, color: ink, marginBottom: '10px', lineHeight: 1.15 }}>
              You have full access
            </h1>
            <p style={{ ...body, fontSize: '15px', marginBottom: '28px' }}>
              Lifetime access to everything — no subscription, no renewal.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
              {['OSCE Tool', 'Core Quiz', 'Revision Hub', 'Lifetime access'].map((label) => (
                <span key={label} style={tagStyle}>{label}</span>
              ))}
            </div>
            <Link href="/dashboard" style={{ ...primaryButton, display: 'inline-flex', width: 'auto' }}>
              Go to Dashboard <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
            <div style={{ marginTop: '16px' }}>
              <Link href="/hub" style={{ fontFamily: serif, fontSize: '14px', color: ink, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                Browse the Hub
              </Link>
            </div>
          </div>
        </main>
        <footer style={{ borderTop: `1px solid ${softLine}`, padding: '20px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: serif, fontSize: '12px', color: inkLight }}>Revision Foundations &middot; {new Date().getFullYear()}</p>
        </footer>
      </div>
    );
  }

  // ── Main pricing page ──
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '128px 24px 64px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <p style={sectionLabel}>Pricing</p>

          <h1 style={{
            fontFamily: display,
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 400,
            lineHeight: 1.06,
            letterSpacing: '-0.02em',
            color: ink,
            marginBottom: '20px',
            maxWidth: '700px',
          }}>
            One payment.{' '}
            <em>Lifetime access.</em>
          </h1>

          <p style={{ ...body, fontSize: '18px', maxWidth: '560px', marginBottom: '28px' }}>
            Everything you need for OSCE practice, theory revision, and placement support — built by a nursing student who actually uses it.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '0' }}>
            {['No subscription', 'Future updates included', '7-day guarantee', 'Works on mobile'].map((item) => (
              <span key={item} style={tagStyle}>
                <Check style={{ width: '13px', height: '13px', color: inkMid }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main bundle card */}
      <section style={{ padding: '0 24px 56px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{ ...editorialCard, background: panel, border: `2px solid ${border}` }}>
            <div className="pricing-bundle-grid">
              {/* Left: details */}
              <div className="pricing-bundle-left" style={{ padding: '40px 36px 44px', borderRight: `1px solid ${softLine}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <p style={{ ...sectionLabel, marginBottom: 0 }}>Recommended</p>
                  <span style={{ fontFamily: serif, fontSize: '11px', color: inkMid, background: tagBg, padding: '5px 12px', borderRadius: '999px' }}>
                    Best value
                  </span>
                </div>

                <h2 style={{ fontFamily: display, fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 400, color: ink, marginBottom: '10px' }}>
                  Children&apos;s Bundle
                </h2>

                <p style={{ ...body, fontSize: '15px', marginBottom: '28px', maxWidth: '480px' }}>
                  OSCE practice, nursing quizzes, and the revision hub — all in one.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
                  {BUNDLE_FEATURES.map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                      <Check style={{ width: '14px', height: '14px', color: inkMid, marginTop: '3px', flexShrink: 0 }} />
                      <span style={{ fontFamily: serif, fontSize: '13px', color: inkMid, lineHeight: 1.5, fontWeight: 300 }}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: cream, border: `1px solid ${softLine}`, borderRadius: '18px', padding: '18px 20px' }}>
                  <p style={{ fontFamily: serif, fontSize: '13px', fontWeight: 400, color: ink, marginBottom: '4px' }}>What this helps with</p>
                  <p style={{ fontFamily: serif, fontSize: '13px', lineHeight: 1.7, fontWeight: 300, color: inkMid }}>
                    Practise stations before OSCEs, revise high-yield topics, and build the knowledge you need for exams and placement.
                  </p>
                </div>
              </div>

              {/* Right: price + CTA */}
              <div className="pricing-bundle-right" style={{ padding: '40px 36px 44px', background: parchment }}>
                <p style={{ ...sectionLabel, marginBottom: '8px' }}>One-time payment</p>

                <p style={{ fontFamily: display, fontSize: 'clamp(3rem, 6vw, 4.2rem)', lineHeight: 1, color: ink, marginBottom: '8px' }}>
                  £9.99
                </p>

                <p style={{ fontFamily: serif, fontSize: '13px', color: inkLight, marginBottom: '32px' }}>
                  Better value than buying separately
                </p>

                {showEmailInput === 'bundle' && !isSignedIn ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontFamily: serif, fontSize: '13px', fontWeight: 400, color: ink }}>Checkout as guest</p>
                    <div style={{ position: 'relative' }}>
                      <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: inkLight }} />
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={guestEmail}
                        onChange={(e) => { setGuestEmail(e.target.value); resetEmailState(); }}
                        style={inputStyle}
                        aria-label="Guest email address"
                      />
                    </div>
                    {emailError && <p style={{ fontFamily: serif, fontSize: '12px', color: '#c44' }}>{emailError}</p>}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleGuestCheckout('bundle')} disabled={loading !== null} style={{ ...primaryButton, flex: 1 }}>
                        {loading === 'bundle' ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Processing...</> : <>Get instant access — £9.99</>}
                      </button>
                      <button onClick={() => { setShowEmailInput(null); setEmailError(''); }} style={{ ...secondaryButton, width: 'auto', padding: '13px 16px' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handlePurchase('bundle')} disabled={loading !== null} style={primaryButton}>
                      {loading === 'bundle' ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Processing...</> : <>Get Children&apos;s Bundle — £9.99</>}
                    </button>

                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { icon: Shield, text: '7-day money-back guarantee' },
                        { icon: Check, text: 'No subscription or recurring charges' },
                        { icon: Check, text: 'Guest checkout available' },
                      ].map((item) => (
                        <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <item.icon style={{ width: '14px', height: '14px', color: inkMid, flexShrink: 0 }} />
                          <span style={{ fontFamily: serif, fontSize: '13px', color: inkMid, fontWeight: 300 }}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Guest tip */}
          {!isSignedIn && (
            <div style={{ marginTop: '16px', padding: '16px 20px', background: parchment, border: `1px solid ${softLine}`, borderRadius: '16px', display: 'flex', alignItems: 'start', gap: '12px' }}>
              <Info style={{ width: '16px', height: '16px', color: inkLight, marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, lineHeight: 1.6, fontWeight: 300 }}>
                <strong style={{ fontWeight: 400, color: ink }}>No account needed.</strong> You can checkout as a guest with just your email, then create an account later to sync progress.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Or buy individually */}
      <section style={{ padding: '0 24px 56px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
            <div style={{ flex: 1, height: '1px', background: border }} />
            <span style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: inkLight }}>Or buy individually</span>
            <div style={{ flex: 1, height: '1px', background: border }} />
          </div>

          <div className="pricing-individual-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            {/* OSCE Tool */}
            <div style={{ ...editorialCard, background: '#fff', padding: '32px 28px 34px' }}>
              {hasOsce && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: serif, fontSize: '11px', color: cream, background: ink, padding: '4px 12px', borderRadius: '999px', marginBottom: '16px' }}>
                  <Check style={{ width: '12px', height: '12px' }} /> Owned
                </span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: parchment, border: `1px solid ${softLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardCheck style={{ width: '20px', height: '20px', color: inkMid }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: display, fontSize: '20px', fontWeight: 400, color: ink }}>Children&apos;s OSCE Tool</h3>
                  {!hasOsce && <p style={{ fontFamily: serif, fontSize: '13px', color: inkLight }}>£4.99</p>}
                </div>
              </div>

              <p style={{ ...body, fontSize: '14px', marginBottom: '24px' }}>
                50+ paediatric OSCE stations with marking checklists and timed exam mode.
              </p>

              {hasOsce ? (
                <Link href="/osce" style={secondaryButton}>Open OSCE Tool <ArrowRight style={{ width: '14px', height: '14px' }} /></Link>
              ) : showEmailInput === 'osce' && !isSignedIn ? (
                <EmailInput product="osce" guestEmail={guestEmail} setGuestEmail={setGuestEmail} emailError={emailError} resetEmailState={resetEmailState} loading={loading} handleGuestCheckout={handleGuestCheckout} setShowEmailInput={setShowEmailInput} setEmailError={setEmailError} />
              ) : (
                <button onClick={() => handlePurchase('osce')} disabled={loading !== null} style={secondaryButton}>
                  {loading === 'osce' ? 'Processing...' : 'Get OSCE Tool — £4.99'}
                </button>
              )}
            </div>

            {/* Quiz Tool */}
            <div style={{ ...editorialCard, background: '#fff', padding: '32px 28px 34px' }}>
              {hasQuiz && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: serif, fontSize: '11px', color: cream, background: ink, padding: '4px 12px', borderRadius: '999px', marginBottom: '16px' }}>
                  <Check style={{ width: '12px', height: '12px' }} /> Owned
                </span>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: parchment, border: `1px solid ${softLine}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen style={{ width: '20px', height: '20px', color: inkMid }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: display, fontSize: '20px', fontWeight: 400, color: ink }}>Core Nursing Quiz</h3>
                  {!hasQuiz && <p style={{ fontFamily: serif, fontSize: '13px', color: inkLight }}>£4.99</p>}
                </div>
              </div>

              <p style={{ ...body, fontSize: '14px', marginBottom: '24px' }}>
                17 topic areas with instant feedback and explanations — not just right or wrong.
              </p>

              {hasQuiz ? (
                <Link href="/quiz" style={secondaryButton}>Open Quiz Tool <ArrowRight style={{ width: '14px', height: '14px' }} /></Link>
              ) : showEmailInput === 'quiz' && !isSignedIn ? (
                <EmailInput product="quiz" guestEmail={guestEmail} setGuestEmail={setGuestEmail} emailError={emailError} resetEmailState={resetEmailState} loading={loading} handleGuestCheckout={handleGuestCheckout} setShowEmailInput={setShowEmailInput} setEmailError={setEmailError} />
              ) : (
                <button onClick={() => handlePurchase('quiz')} disabled={loading !== null} style={secondaryButton}>
                  {loading === 'quiz' ? 'Processing...' : 'Get Quiz Tool — £4.99'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Try previews */}
      {!isPro && (
        <section style={{ padding: '0 24px 64px' }}>
          <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontFamily: serif, fontSize: '14px', color: inkMid, marginBottom: '16px' }}>
              Not sure yet? Try the free previews first.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/osce" style={{ ...secondaryButton, width: 'auto', padding: '11px 24px' }}>
                Try OSCE preview
              </Link>
              <Link href="/quiz" style={{ ...secondaryButton, width: 'auto', padding: '11px 24px' }}>
                Try quiz preview
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Adult bundle — coming soon */}
      <section style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{ ...editorialCard, background: parchment, padding: '36px 32px 38px' }}>
            <div className="pricing-adult-grid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: '520px' }}>
                <span style={{ ...tagStyle, marginBottom: '14px', display: 'inline-flex' }}>Coming soon</span>
                <h2 style={{ fontFamily: display, fontSize: '24px', fontWeight: 400, color: ink, marginBottom: '10px' }}>
                  Adult Nursing Bundle
                </h2>
                <p style={{ ...body, fontSize: '14px' }}>
                  Adult nursing content is in development — NEWS2, sepsis, wound care, adult OSCE stations, and more.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: display, fontSize: '32px', color: ink, lineHeight: 1, marginBottom: '4px' }}>£9.99</p>
                <p style={{ fontFamily: serif, fontSize: '12px', color: inkLight }}>planned one-time price</p>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              {adultSubmitted ? (
                <p style={{ fontFamily: serif, fontSize: '14px', fontWeight: 400, color: ink }}>
                  Got it — we&apos;ll email you when it&apos;s ready.
                </p>
              ) : (
                <form onSubmit={handleAdultWaitlist} style={{ display: 'flex', gap: '10px', maxWidth: '400px', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: inkLight }} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={adultEmail}
                      onChange={(e) => setAdultEmail(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <button type="submit" style={{ ...secondaryButton, width: 'auto', padding: '12px 20px', flexShrink: 0 }}>
                    Notify me
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 64px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={{ ...editorialCard, background: '#fff', padding: '36px 32px 38px' }}>
            <h2 style={{ fontFamily: display, fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 400, color: ink, marginBottom: '28px' }}>
              Questions
            </h2>

            {FAQS.map((faq, i) => (
              <div key={faq.q} style={{ borderBottom: i !== FAQS.length - 1 ? `1px solid ${softLine}` : 'none', paddingBottom: i !== FAQS.length - 1 ? '20px' : '0', marginBottom: i !== FAQS.length - 1 ? '20px' : '0' }}>
                <h3 style={{ fontFamily: serif, fontSize: '15px', fontWeight: 400, color: ink, marginBottom: '6px' }}>{faq.q}</h3>
                <p style={{ fontFamily: serif, fontSize: '14px', lineHeight: 1.7, fontWeight: 300, color: inkMid }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {!isPro && (
        <section style={{ padding: '0 24px 96px' }}>
          <div style={{ maxWidth: '920px', margin: '0 auto', textAlign: 'center' }}>
            <p style={sectionLabel}>Ready</p>
            <h2 style={{ fontFamily: display, fontSize: 'clamp(2rem, 4vw, 2.6rem)', fontWeight: 400, lineHeight: 1.15, color: ink, marginBottom: '14px' }}>
              Start with the tools you&apos;ll actually use.
            </h2>
            <p style={{ ...body, maxWidth: '480px', margin: '0 auto 28px' }}>
              One payment. Lifetime access. Built for nursing students preparing for real assessments.
            </p>
            <button onClick={() => handlePurchase('bundle')} disabled={loading !== null} style={{ ...primaryButton, width: 'auto', display: 'inline-flex' }}>
              {loading === 'bundle' ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Processing...</> : <>Get Children&apos;s Bundle — £9.99</>}
            </button>
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        .pricing-bundle-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
        }
        .pricing-individual-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 768px) {
          .pricing-bundle-grid {
            grid-template-columns: 1fr;
          }
          .pricing-bundle-left {
            border-right: none !important;
            border-bottom: 1px solid rgba(217, 208, 193, 0.7);
            padding: 28px 24px 32px !important;
          }
          .pricing-bundle-right {
            padding: 28px 24px 32px !important;
          }
          .pricing-individual-grid {
            grid-template-columns: 1fr;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function EmailInput({ product, guestEmail, setGuestEmail, emailError, resetEmailState, loading, handleGuestCheckout, setShowEmailInput, setEmailError }: {
  product: Product;
  guestEmail: string;
  setGuestEmail: (v: string) => void;
  emailError: string;
  resetEmailState: () => void;
  loading: Product | null;
  handleGuestCheckout: (p: Product) => void;
  setShowEmailInput: (p: Product | null) => void;
  setEmailError: (v: string) => void;
}) {
  const serif = "'Source Serif 4', Georgia, serif";
  const ink = '#1C1510';
  const inkLight = '#9C8878';
  const border = '#D9D0C1';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ position: 'relative' }}>
        <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: inkLight }} />
        <input
          type="email"
          placeholder="Your email"
          value={guestEmail}
          onChange={(e) => { setGuestEmail(e.target.value); resetEmailState(); }}
          style={{ fontFamily: serif, fontSize: '14px', width: '100%', padding: '12px 16px 12px 40px', border: `1px solid ${border}`, borderRadius: '14px', background: '#fff', color: ink, outline: 'none' }}
          aria-label={`Guest email for ${product} checkout`}
        />
      </div>
      {emailError && <p style={{ fontFamily: serif, fontSize: '12px', color: '#c44' }}>{emailError}</p>}
      <button onClick={() => handleGuestCheckout(product)} disabled={loading !== null} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: serif, fontSize: '14px', background: 'transparent', color: ink, padding: '13px 24px', borderRadius: '9999px', border: `1px solid ${border}`, cursor: 'pointer', width: '100%' }}>
        {loading === product ? 'Processing...' : 'Continue to checkout'}
      </button>
      <button onClick={() => { setShowEmailInput(null); setEmailError(''); }} style={{ fontFamily: serif, fontSize: '12px', color: inkLight, background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
        Cancel
      </button>
    </div>
  );
}
