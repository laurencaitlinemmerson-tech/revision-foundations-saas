'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, Play } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { saveLastActivity, recordSessionStart } from '@/components/DashboardWidgets';
import ProductVisualShowcase from '@/components/product-pages/ProductVisualShowcase';
import { getQuizLoopCards } from '@/lib/productLoop';

const PREVIEW_TIME = 180;

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#FAFAF8';
const paper = '#FFFFFF';
const border = 'rgba(28, 21, 16, 0.1)';
const accent = '#2E67B1';
const accentSoft = '#E7EEF8';
const accentLine = 'rgba(46, 103, 177, 0.18)';
const success = '#1E8A4D';
const successSoft = '#E6F4EA';

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
    key: 'question',
    label: 'Question',
    title: "What's the normal HR for a 2-year-old at rest?",
    description: 'Quick to scan — designed to help you answer before you overthink it.',
    rows: [
      { label: '60–100 bpm', state: 'muted' },
      { label: '80–120 bpm', state: 'muted' },
      { label: '100–140 bpm', state: 'correct' },
      { label: '120–160 bpm', state: 'muted' },
    ],
    noteLabel: 'Question style',
    note: 'A short prompt keeps the cognitive load on the content, not on decoding the screen.',
  },
  {
    key: 'feedback',
    label: 'Feedback',
    title: 'See the answer without losing the thread.',
    description: 'The feedback shows the right answer clearly, then points you to the bit that matters.',
    rows: [
      { label: 'Correct answer highlighted', state: 'correct' },
      { label: 'Why this range fits age', state: 'active' },
      { label: 'What students confuse it with', state: 'muted' },
      { label: 'Move straight to next question', state: 'muted' },
    ],
    noteLabel: 'Why it helps',
    note: "It is not just being told correct. It is seeing why the logic works while the question is still fresh.",
  },
  {
    key: 'review',
    label: 'Review',
    title: 'Spot the real gap before you leave the session.',
    description: 'Good quiz practice ends with a clearer picture of what needs work next.',
    rows: [
      { label: 'Age-based norms', state: 'active' },
      { label: 'Drug calculations', state: 'muted' },
      { label: 'Fluid balance', state: 'muted' },
      { label: 'Medication safety', state: 'muted' },
    ],
    noteLabel: 'Review note',
    note: 'That small review moment is what turns a question bank into a more useful study tool.',
  },
] as const;

const focusAreas = [
  {
    title: 'Vital signs and age-based norms',
    text: 'What is normal, what is not, and what should make you stop and think twice.',
  },
  {
    title: 'Drug calculations and medicines',
    text: 'The formulas and medication-safety details that people re-check over and over.',
  },
  {
    title: 'Fluids, balance, and clinical basics',
    text: 'Foundational knowledge that keeps showing up in theory exams and placement questions.',
  },
  {
    title: 'Reasoning, not just recall',
    text: 'Every question reinforces understanding — not just right or wrong and move on.',
  },
] as const;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function QuizPageClient({ hasPremium }: { hasPremium: boolean }) {
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
    () => getQuizLoopCards(searchParams.get('from')),
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
      recordSessionStart('quiz');
      saveLastActivity({ toolName: 'quiz', path: '/quiz', label: 'Core Quiz Practice' });
    }
  }, [hasPremium, enterApp, showPreview]);

  // Sync quiz localStorage progress to Supabase (same-origin iframe shares localStorage)
  useEffect(() => {
    if (!hasPremium) return;

    function syncProgress() {
      try {
        const raw = localStorage.getItem('ntq_history_v1');
        if (!raw) return;
        const history: Array<{ topic: string; correct: boolean; at: string }> = JSON.parse(raw);
        if (!history.length) return;

        const byTopic: Record<string, { attempted: number; correct: number; lastAt: string }> = {};
        for (const ev of history) {
          if (!byTopic[ev.topic]) byTopic[ev.topic] = { attempted: 0, correct: 0, lastAt: ev.at };
          byTopic[ev.topic].attempted++;
          if (ev.correct) byTopic[ev.topic].correct++;
          if (ev.at > byTopic[ev.topic].lastAt) byTopic[ev.topic].lastAt = ev.at;
        }

        const topics = Object.entries(byTopic).map(([topicId, d]) => ({ topicId, ...d }));
        fetch('/api/progress/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topics }),
        }).catch(() => {});

        // Write rf_weak_topics for WeakAreaBanner
        const weakTopics = topics
          .filter((t) => t.attempted >= 3)
          .map((t) => ({
            topic: t.topicId,
            score: Math.round((t.correct / t.attempted) * 100),
            attempts: t.attempted,
            lastSeen: t.lastAt,
          }));
        try {
          localStorage.setItem('rf_weak_topics', JSON.stringify(weakTopics));
        } catch {};
      } catch {}
    }

    syncProgress();

    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') syncProgress();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [hasPremium]);

  if (hasPremium) {
    return (
      <iframe
        src={`/apps/quiz.html${forwardedQuery}`}
        className="fixed inset-0 w-full border-0"
        style={{ height: '100vh', width: '100vw' }}
        title="Core Nursing Quiz"
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
                Your quiz warm-up is ready to become a real revision block.
              </h1>
              <p style={{ ...bodyText, marginBottom: '18px' }}>
                You have had a quick warm-up. Full access keeps all 17 topic areas open, so you can choose a focus, answer, mark the gap, and repeat it before placement.
              </p>
              <div style={{ background: accentSoft, border: `0.5px solid ${accentLine}`, padding: '14px 16px', marginBottom: '24px' }}>
                <p style={{ fontFamily: serif, fontSize: '12px', color: inkMid, lineHeight: 1.7 }}>
                  Suggested next block: answer 10 mixed questions, write down the slowest topic, then repeat that topic once.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Link href="/pricing?product=quiz" style={primaryButton}>Unlock quiz — £4.99</Link>
                <Link href="/pricing" style={secondaryButton}>See full bundle</Link>
                <Link href="/hub/resources/drug-calculations-cheat-sheet" style={secondaryButton}>Read calculation sheet</Link>
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
              <Link href="/pricing?product=quiz" style={{ fontFamily: serif, fontSize: '13px', color: cream, background: ink, padding: '5px 14px', textDecoration: 'none' }}>
                Unlock full access
              </Link>
            </div>
          </div>
        </div>
        <iframe
          src={`/apps/quiz.html?preview=1${forwardedQuery ? `&${forwardedQuery.slice(1)}` : ''}`}
          className="fixed bottom-0 left-0 right-0 w-full border-0"
          style={{ top: '44px', height: 'calc(100vh - 44px)' }}
          title="Core Nursing Quiz"
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
          <div className="quiz-hero-grid" style={{ maxWidth: '1120px', margin: '0 auto' }}>

            {/* Left */}
            <div>
              <p style={sectionLabel}>Quiz tool</p>
              <h1 style={{
                fontFamily: display,
                fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                lineHeight: 1.06,
                color: ink,
                marginBottom: '16px',
                maxWidth: '13ch',
              }}>
                Active recall for the topics nursing students keep second-guessing.
              </h1>
              <p style={{ ...bodyText, maxWidth: '460px', marginBottom: '24px' }}>
                Vital signs, drug calculations, infection control, pharmacology, and fluid
                balance — the topics that keep showing up in exams and placement.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
                {hasPremium ? (
                  <>
                    <button onClick={() => setEnterApp(true)} style={primaryButton}>
                      <Play style={{ width: '14px', height: '14px' }} />
                      Enter quiz app
                    </button>
                    <Link href="/pricing" style={secondaryButton}>See bundle</Link>
                  </>
                ) : (
                  <>
                    <button onClick={() => setShowPreview(true)} style={primaryButton}>
                      <Play style={{ width: '14px', height: '14px' }} />
                      Start 3-minute preview
                    </button>
                    <Link href="/pricing?product=quiz" style={secondaryButton}>
                      Unlock — £4.99
                    </Link>
                  </>
                )}
              </div>

              {/* Slim stat strip */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', paddingTop: '24px', borderTop: `1px solid ${border}` }}>
                {[
                  { value: '17', label: 'topic areas' },
                  { value: 'Instant', label: 'feedback' },
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
                <div style={{ display: 'inline-flex', gap: '6px', padding: '4px', background: '#F4F7FC' }}>
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

              <h2 style={{ fontFamily: display, fontSize: '22px', lineHeight: 1.15, color: ink, marginBottom: '8px' }}>
                {heroMode.title}
              </h2>
              <p style={{ ...bodyText, fontSize: '13px', marginBottom: '14px' }}>
                {heroMode.description}
              </p>

              <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                {heroMode.rows.map((option) => (
                  <div
                    key={option.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      border: `0.5px solid ${option.state === 'correct' ? success : option.state === 'active' ? accent : accentLine}`,
                      background: option.state === 'correct' ? successSoft : option.state === 'active' ? '#F1F6FD' : accentSoft,
                      padding: '10px 13px',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <span style={{
                      width: '16px', height: '16px', flexShrink: 0,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      background: option.state === 'correct' ? success : option.state === 'active' ? accent : 'rgba(46,103,177,0.12)',
                      color: option.state === 'correct' || option.state === 'active' ? cream : accent,
                      fontSize: '10px',
                    }}>
                      {option.state === 'correct' ? '✓' : option.state === 'active' ? '•' : ''}
                    </span>
                    <span style={{ fontFamily: serif, fontSize: '12px', color: option.state === 'correct' ? success : option.state === 'active' ? accent : inkMid }}>
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{
                border: `0.5px solid ${accentLine}`,
                background: activeHeroMode === 2 ? '#F3F0FB' : '#F7FAFD',
                padding: '13px 15px',
                transition: 'background-color 0.2s ease',
              }}>
                <p style={{ ...sectionLabel, color: activeHeroMode === 2 ? '#7354B8' : accent, marginBottom: '5px' }}>
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
      See exactly how the quiz works before you open it.
    </h2>

    <p style={{ ...bodyText, maxWidth: '620px', marginBottom: '28px' }}>
      This is a real quiz screen — not a demo. You can see how the question appears
      and how feedback is shown before opening the full app.
    </p>

    {/* Preview component */}
    <div style={{ marginTop: '24px' }}>
      <ProductVisualShowcase variant="quiz" />
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
              Built for quick sessions that still feel genuinely useful.
            </h2>

            <div className="quiz-focus-grid">
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
              Use the quiz with one guide open, then switch format when you need to.
            </h2>
            <p style={{ ...bodyText, maxWidth: '620px', marginBottom: '28px' }}>
              The strongest sessions usually move between recall, one useful guide, and then a more spoken practice run.
            </p>

            <div className="quiz-loop-grid">
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
          <div className="quiz-pricing-grid" style={{ maxWidth: '1120px', margin: '0 auto' }}>

            {/* Standalone */}
            <div style={{ background: paper, border: `0.5px solid ${border}`, padding: '32px 28px' }}>
              <p style={sectionLabel}>Quiz only</p>
              <p style={{ fontFamily: display, fontSize: '48px', lineHeight: 1, color: ink, marginBottom: '10px' }}>£4.99</p>
              <p style={{ ...bodyText, fontSize: '14px', marginBottom: '20px' }}>
                One-time access to all 17 topic areas, instant feedback, and detailed explanations.
              </p>
              <div style={{ height: '1px', background: border, marginBottom: '20px' }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '22px' }}>
                {['17 topics', 'Instant feedback', 'Explanations', 'Future updates'].map((tag) => (
                  <span key={tag} style={{ fontFamily: serif, fontSize: '12px', color: inkMid, background: '#F3F1EE', padding: '6px 12px' }}>
                    {tag}
                  </span>
                ))}
              </div>
              {hasPremium ? (
                <button onClick={() => setEnterApp(true)} style={primaryButton}>Enter quiz app</button>
              ) : (
                <Link href="/pricing?product=quiz" style={primaryButton}>Get the quiz →</Link>
              )}
            </div>

            {/* Bundle */}
            <div style={{ background: paper, border: `0.5px solid ${border}`, padding: '32px 28px', position: 'relative' as const }}>
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
                Quiz, OSCE tool, and Revision Hub — all in one payment.
              </p>
              <div style={{ height: '1px', background: border, marginBottom: '20px' }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '22px' }}>
                {['Core Quiz', 'OSCE tool', 'Revision Hub', 'Future updates'].map((tag) => (
                  <span key={tag} style={{ fontFamily: serif, fontSize: '12px', color: accent, background: accentSoft, padding: '6px 12px' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link href="/pricing" style={secondaryButton}>See bundle pricing →</Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        .quiz-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
          gap: 24px;
          align-items: center;
        }
        .quiz-focus-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 48px;
        }
        .quiz-pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }
        .quiz-loop-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }
        @media (max-width: 860px) {
          .quiz-hero-grid,
          .quiz-pricing-grid,
          .quiz-loop-grid {
            grid-template-columns: 1fr;
          }
          .quiz-focus-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
