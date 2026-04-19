'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, Play } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudySkillsPrompt from '@/components/StudySkillsPrompt';
import { saveLastActivity, recordSessionStart } from '@/components/DashboardWidgets';
import ProductVisualShowcase from '@/components/product-pages/ProductVisualShowcase';
import { getOsceLoopCards } from '@/lib/productLoop';

const PREVIEW_TIME = 180;

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#FAFAF8';
const paper = '#FFFFFF';
const border = 'rgba(28, 21, 16, 0.1)';
const accent = '#2F8A7E';
const accentSoft = '#E6F3F1';
const accentLine = 'rgba(47, 138, 126, 0.18)';
const coral = '#D96C55';
const coralSoft = '#F8E7E2';

const sectionLabel: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const bodyText: CSSProperties = {
  fontFamily: serif,
  fontSize: '15px',
  lineHeight: 1.85,
  fontWeight: 300,
  color: inkMid,
};

const primaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  color: cream,
  background: ink,
  padding: '13px 22px',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
};

const secondaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  color: ink,
  background: paper,
  padding: '13px 22px',
  textDecoration: 'none',
  border: `0.5px solid ${border}`,
  cursor: 'pointer',
  whiteSpace: 'nowrap' as const,
};

const heroModes = [
  {
    key: 'brief',
    label: 'Brief',
    title: 'A-E assessment',
    description: 'The station opens with the core frame so you can settle into the order before you start speaking.',
    rows: [
      ['Look', 'Appearance, work of breathing, colour'],
      ['Listen', 'Airway sounds, stridor, verbal response'],
      ['Feel', 'Chest movement, pulses, cap refill'],
      ['Act', 'Escalate, oxygen, repeat obs'],
    ],
    noteLabel: 'Station shape',
    note: 'Seeing the structure early helps the station feel more familiar before the pressure kicks in.',
  },
  {
    key: 'checklist',
    label: 'Checklist',
    title: 'Know what the examiner is listening for.',
    description: 'The app reinforces safe order, good escalation, and clearer language under pressure.',
    rows: [
      ['Structure', 'Move through A-E without drifting'],
      ['Safety', 'State red flags and escalation clearly'],
      ['Communication', 'Include parent or carer appropriately'],
      ['Closure', 'Summarise and repeat observations'],
    ],
    noteLabel: 'Examiner lens',
    note: 'Strong OSCE practice is about sounding safer and more structured, not more complicated.',
  },
  {
    key: 'review',
    label: 'Review',
    title: 'Tighten one weak section and go again.',
    description: 'The best sessions come from spotting the wobbly phrase, then cleaning it up on the next run.',
    rows: [
      ['Keep', 'Airway-first order stayed steady'],
      ['Tighten', 'Escalation language was vague'],
      ['Keep', 'Paediatric focus was clear'],
      ['Repeat', 'Second run with cleaner wording'],
    ],
    noteLabel: 'After the station',
    note: 'That small review loop is what turns repetition into actual improvement.',
  },
] as const;

const focusAreas = [
  {
    title: 'A-E and paediatric assessment',
    text: 'Structured assessment stations with checklists built in — no inventing your own order every time.',
  },
  {
    title: 'Medication and procedures',
    text: 'Safety-critical steps that slip under pressure, rehearsed until they feel automatic.',
  },
  {
    title: 'Safeguarding and communication',
    text: 'The wording, escalation points, and professional judgment that stations often hinge on.',
  },
  {
    title: 'Child and family-centred care',
    text: 'Age-appropriate care, consent, and how to involve parents and carers naturally.',
  },
] as const;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function OscePageClient({ hasPremium }: { hasPremium: boolean }) {
  const searchParams = useSearchParams();
  const [enterApp, setEnterApp] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PREVIEW_TIME);
  const [previewExpired, setPreviewExpired] = useState(false);
  const [activeHeroMode, setActiveHeroMode] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const heroMode = heroModes[activeHeroMode] ?? heroModes[0];
  const forwardedQuery = useMemo(() => {
    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }, [searchParams]);
  const loopCards = useMemo(
    () => getOsceLoopCards(searchParams.get('from')),
    [searchParams],
  );

  useEffect(() => {
    if (showPreview && !hasPremium && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setPreviewExpired(true);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [showPreview, hasPremium, timeLeft]);

  useEffect(() => {
    if (hasPremium || enterApp || showPreview) {
      recordSessionStart('osce');
      saveLastActivity({ toolName: 'osce', path: '/osce', label: 'OSCE Practice' });
    }
  }, [hasPremium, enterApp, showPreview]);

  // Listen for OSCE station progress posted by the iframe on session complete
  useEffect(() => {
    if (!hasPremium) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'osce-progress') return;
      const { stations } = event.data;
      if (!Array.isArray(stations)) return;

      // Local dashboard tracking
      import('@/lib/dashboardTracking').then((m) => {
        for (const s of stations) {
          m.addOsceScore(s.score ?? 0, (s.stationId as string).replace(/-/g, ' '));
        }
      });

      fetch('/api/progress/osce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stations }),
      }).catch(() => {});
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [hasPremium]);

  if (hasPremium) {
    return (
      <iframe
        src={`/apps/osce.html${forwardedQuery}`}
        className="fixed inset-0 w-full border-0"
        style={{ height: '100vh', width: '100vw' }}
        title="Children's OSCE Tool"
      />
    );
  }

  if (previewExpired) {
    return (
      <div style={{ background: cream, minHeight: '100vh' }}>
        <Navbar />
        <main style={{ padding: '132px 24px 96px' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ background: paper, border: `0.5px solid ${border}`, padding: '42px 36px' }}>
              <p style={sectionLabel}>Preview ended</p>
              <h1 style={{ fontFamily: display, fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.05, color: ink, marginBottom: '12px' }}>
                Your first station run should not stop at the preview timer.
              </h1>
              <p style={{ ...bodyText, marginBottom: '18px' }}>
                You have had a quick station warm-up. Full access keeps the paediatric practice open, so you can run one station, spot where you hesitate, and repeat that section.
              </p>
              <div style={{ background: accentSoft, border: `0.5px solid ${accentLine}`, padding: '14px 16px', marginBottom: '24px' }}>
                <p style={{ fontFamily: serif, fontSize: '12px', color: inkMid, lineHeight: 1.7 }}>
                  Suggested next block: refresh A-E for 5 minutes, speak one station out loud, then repeat only the escalation section.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Link href="/pricing?product=osce" style={primaryButton}>Unlock OSCE tool — £4.99</Link>
                <Link href="/pricing" style={secondaryButton}>See full bundle</Link>
                <Link href="/hub/resources/ae-assessment-guide" style={secondaryButton}>Read A-E guide</Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showPreview) {
    return (
      <div className="relative">
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          background: 'rgba(250, 250, 248, 0.96)',
          padding: '10px 20px', zIndex: 50,
          borderBottom: `1px solid ${border}`,
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: serif, fontSize: '13px', color: inkLight }}>Free preview</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Courier New', monospace", fontSize: '13px', fontWeight: 600, background: accentSoft, color: accent, padding: '4px 12px' }}>
                <Clock style={{ width: '13px', height: '13px' }} />
                {formatTime(timeLeft)}
              </div>
              <Link href="/pricing?product=osce" style={{ fontFamily: serif, fontSize: '13px', color: cream, background: ink, padding: '5px 14px', textDecoration: 'none' }}>
                Unlock full access
              </Link>
            </div>
          </div>
        </div>
        <iframe
          src={`/apps/osce.html?preview=1${forwardedQuery ? `&${forwardedQuery.slice(1)}` : ''}`}
          className="fixed bottom-0 left-0 right-0 w-full border-0"
          style={{ top: '44px', height: 'calc(100vh - 44px)' }}
          title="Children's OSCE Tool"
        />
      </div>
    );
  }

  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      <main>

        {/* ── Hero ── */}
        <section style={{ padding: '96px 24px 72px', borderBottom: `1px solid ${border}` }}>
          <div className="osce-hero-grid" style={{ maxWidth: '1120px', margin: '0 auto' }}>

            {/* Left */}
            <div>
              <p style={sectionLabel}>OSCE tool</p>
              <h1 style={{
                fontFamily: display,
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                lineHeight: 1.06,
                color: ink,
                marginBottom: '16px',
                maxWidth: '13ch',
              }}>
                Practise paediatric OSCE stations with a structure you can rely on.
              </h1>
              <p style={{ ...bodyText, maxWidth: '460px', marginBottom: '24px' }}>
                A calm way to rehearse A-E, medication, safeguarding, and paediatric
                assessment stations before the real thing.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
                {hasPremium ? (
                  <>
                    <button onClick={() => setEnterApp(true)} style={primaryButton}>
                      <Play style={{ width: '14px', height: '14px' }} />
                      Enter OSCE app
                    </button>
                    <Link href="/pricing" style={secondaryButton}>See bundle</Link>
                  </>
                ) : (
                  <>
                    <button onClick={() => setShowPreview(true)} style={primaryButton}>
                      <Play style={{ width: '14px', height: '14px' }} />
                      Start 3-minute preview
                    </button>
                    <Link href="/pricing?product=osce" style={secondaryButton}>
                      Unlock — £4.99
                    </Link>
                  </>
                )}
              </div>

              {/* Slim stat strip */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', paddingTop: '24px', borderTop: `1px solid ${border}` }}>
                {[
                  { value: '50+', label: 'paediatric stations' },
                  { value: 'Timed', label: 'mode included' },
                  { value: '£4.99', label: 'one payment' },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ fontFamily: display, fontSize: '20px', color: ink, lineHeight: 1, marginBottom: '3px' }}>{item.value}</p>
                    <p style={{ fontFamily: serif, fontSize: '12px', color: inkLight, fontWeight: 300 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: interactive card */}
            <div style={{ background: paper, border: `0.5px solid ${border}`, padding: '22px 22px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <p style={{ ...sectionLabel, marginBottom: 0 }}>Interactive preview</p>
                <div style={{ display: 'inline-flex', gap: '6px', padding: '4px', background: '#F1F8F6' }}>
                  {heroModes.map((mode, index) => {
                    const isActive = activeHeroMode === index;
                    return (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => setActiveHeroMode(index)}
                        onMouseEnter={() => setActiveHeroMode(index)}
                        style={{
                          border: 'none', padding: '7px 12px',
                          background: isActive ? accentSoft : 'transparent',
                          color: isActive ? accent : inkMid,
                          fontFamily: serif, fontSize: '12px', cursor: 'pointer',
                        }}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <h2 style={{ fontFamily: display, fontSize: '24px', lineHeight: 1.12, color: ink, marginBottom: '8px' }}>
                {heroMode.title}
              </h2>
              <p style={{ ...bodyText, fontSize: '13px', marginBottom: '14px' }}>
                {heroMode.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', marginBottom: '12px' }}>
                {heroMode.rows.map(([heading, text], index) => (
                  <div
                    key={heading}
                    style={{
                      border: `0.5px solid ${activeHeroMode === 1 && index === 1 ? 'rgba(217,108,85,0.28)' : accentLine}`,
                      background: activeHeroMode === 2 && index === 1 ? coralSoft : accentSoft,
                      padding: '12px 12px 10px',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <p style={{ ...sectionLabel, color: activeHeroMode === 1 && index === 1 ? coral : accent, marginBottom: '5px' }}>
                      {heading}
                    </p>
                    <p style={{ fontFamily: serif, fontSize: '12px', color: inkMid, lineHeight: 1.55 }}>{text}</p>
                  </div>
                ))}
              </div>

              <div style={{
                border: `0.5px solid ${activeHeroMode === 2 ? 'rgba(115,84,184,0.18)' : 'rgba(217,108,85,0.2)'}`,
                background: activeHeroMode === 2 ? '#F3F0FB' : coralSoft,
                padding: '13px 15px',
                transition: 'background-color 0.2s ease',
              }}>
                <p style={{ ...sectionLabel, color: activeHeroMode === 2 ? '#7354B8' : coral, marginBottom: '5px' }}>
                  {heroMode.noteLabel}
                </p>
                <p style={{ fontFamily: serif, fontSize: '13px', lineHeight: 1.7, color: inkMid }}>{heroMode.note}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── A closer look ── */}
<section style={{ padding: '48px 24px 56px', borderBottom: `1px solid ${border}` }}>
  <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
    
    <p style={sectionLabel}>A closer look</p>

    <h2
      style={{
        fontFamily: display,
        fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
        lineHeight: 1.1,
        color: ink,
        marginBottom: '14px',
        maxWidth: '20ch',
      }}
    >
      See exactly how the OSCE flow works before you open it.
    </h2>

    <p style={{ ...bodyText, maxWidth: '620px', marginBottom: '28px' }}>
      This is a real OSCE app screen, not a demo. You can see how a station opens,
      how the structure is laid out, and how the practice flow feels before opening the full app.
    </p>

    {/* Preview component */}
    <div style={{ marginTop: '24px' }}>
      <ProductVisualShowcase variant="osce" />
    </div>

    {/* Optional CTA (recommended) */}
    {!hasPremium && (
      <div style={{ marginTop: '24px' }}>
        <button onClick={() => setShowPreview(true)} style={primaryButton}>
          <Play style={{ width: '14px', height: '14px' }} />
          Try the 3-minute preview
        </button>
      </div>
    )}

  </div>
</section>
        {/* ── What's inside ── */}
        <section style={{ padding: '48px 24px 52px', borderBottom: `1px solid ${border}` }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <p style={sectionLabel}>What&apos;s inside</p>
            <h2 style={{
              fontFamily: display,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              lineHeight: 1.1,
              color: ink,
              marginBottom: '36px',
              maxWidth: '22ch',
            }}>
              Stations that help you sound safer, clearer, and more structured.
            </h2>

            <div className="osce-focus-grid">
              {focusAreas.map((item, i) => (
                <div key={item.title} style={{ paddingTop: i > 0 ? '20px' : 0, borderTop: i > 0 ? `1px solid ${border}` : 'none' }}>
                  <h3 style={{ fontFamily: display, fontSize: '19px', lineHeight: 1.2, color: ink, marginBottom: '6px' }}>
                    {item.title}
                  </h3>
                  <p style={{ ...bodyText, fontSize: '14px' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '48px 24px 56px', borderBottom: `1px solid ${border}` }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <p style={sectionLabel}>Keep the loop moving</p>
            <h2 style={{
              fontFamily: display,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              lineHeight: 1.1,
              color: ink,
              marginBottom: '14px',
              maxWidth: '20ch',
            }}>
              Use one guide to steady the station, then back it up with recall.
            </h2>
            <p style={{ ...bodyText, maxWidth: '620px', marginBottom: '28px' }}>
              The OSCE tool works best when the knowledge underneath it is close by, not in another tab you never return to.
            </p>

            <div className="osce-loop-grid">
              {loopCards.map((card) => (
                <Link
                  key={`${card.eyebrow}-${card.title}`}
                  href={card.href}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    border: `0.5px solid ${border}`,
                    background: paper,
                    padding: '22px 22px 24px',
                    color: ink,
                  }}
                >
                  <p style={{ ...sectionLabel, marginBottom: '10px' }}>{card.eyebrow}</p>
                  <h3 style={{ fontFamily: display, fontSize: '26px', lineHeight: 1.08, fontWeight: 400, marginBottom: '10px' }}>
                    {card.title}
                  </h3>
                  <p style={{ ...bodyText, fontSize: '13px', marginBottom: '16px' }}>{card.description}</p>
                  <span style={{ fontFamily: serif, fontSize: '12px', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                    {card.cta} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section style={{ padding: '48px 24px 96px' }}>
          <div className="osce-pricing-grid" style={{ maxWidth: '1120px', margin: '0 auto' }}>

            {/* Standalone */}
            <div style={{ background: paper, border: `0.5px solid ${border}`, padding: '32px 28px' }}>
              <p style={sectionLabel}>OSCE tool only</p>
              <p style={{ fontFamily: display, fontSize: '48px', lineHeight: 1, color: ink, marginBottom: '10px' }}>£4.99</p>
              <p style={{ ...bodyText, fontSize: '14px', marginBottom: '20px' }}>
                One-time access to all 50+ stations, timed mode, and marking checklists.
              </p>
              <div style={{ height: '1px', background: border, marginBottom: '20px' }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '22px' }}>
                {['50+ stations', 'Timed mode', 'Checklists', 'Future updates'].map((tag) => (
                  <span key={tag} style={{ fontFamily: serif, fontSize: '12px', color: inkMid, background: '#F3F1EE', padding: '6px 12px' }}>
                    {tag}
                  </span>
                ))}
              </div>
              {hasPremium ? (
                <button onClick={() => setEnterApp(true)} style={primaryButton}>Enter OSCE app</button>
              ) : (
                <Link href="/pricing?product=osce" style={primaryButton}>Get the OSCE tool →</Link>
              )}
            </div>

            {/* Bundle */}
            <div style={{
              background: paper,
              border: `0.5px solid ${border}`,
              padding: '32px 28px',
              position: 'relative' as const,
            }}>
              <span style={{
                position: 'absolute' as const, top: '20px', right: '20px',
                fontFamily: serif, fontSize: '11px', letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                background: accentSoft, color: accent,
                padding: '5px 10px',
              }}>
                Better value
              </span>
              <p style={sectionLabel}>Children&apos;s Bundle</p>
              <p style={{ fontFamily: display, fontSize: '48px', lineHeight: 1, color: ink, marginBottom: '10px' }}>£9.99</p>
              <p style={{ ...bodyText, fontSize: '14px', marginBottom: '20px' }}>
                OSCE tool, Core Quiz, and Revision Hub — all in one payment.
              </p>
              <div style={{ height: '1px', background: border, marginBottom: '20px' }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '22px' }}>
                {['OSCE tool', 'Core Quiz', 'Revision Hub', 'Future updates'].map((tag) => (
                  <span key={tag} style={{ fontFamily: serif, fontSize: '12px', color: accent, background: accentSoft, padding: '6px 12px' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link href="/pricing" style={secondaryButton}>See bundle pricing →</Link>
            </div>

          </div>
        </section>

        <section style={{ padding: '0 24px 96px' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <StudySkillsPrompt
              eyebrow="Need a gentler route in?"
              title="Read the neurodivergent guide before you force the station."
              body="If starting feels hard, the guide gives calmer ways into OSCE practice, clearer structures for overloaded days, and a route back into the tool without turning the session into a battle."
              primaryHref="/neurodivergent-guide"
              primaryLabel="Open neurodivergent guide"
              accent={accent}
              accentSoft="#F1F8F6"
            />
          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        .osce-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
          gap: 24px;
          align-items: center;
        }
        .osce-focus-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 48px;
        }
        .osce-pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }
        .osce-loop-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        @media (max-width: 860px) {
          .osce-hero-grid,
          .osce-pricing-grid,
          .osce-loop-grid {
            grid-template-columns: 1fr;
          }
          .osce-focus-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
