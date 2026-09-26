'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Data ─────────────────────────────────────────────────────────────────────

const abbreviations = {
  frequency: [
    { abbr: 'OD', meaning: 'Once daily', latin: 'Omni die', warning: null, example: 'Atorvastatin 20mg OD at night' },
    { abbr: 'BD / BID', meaning: 'Twice daily', latin: 'Bis in die', warning: null, example: 'Amoxicillin 500mg BD' },
    { abbr: 'TDS / TID', meaning: 'Three times daily', latin: 'Ter die sumendum', warning: null, example: 'Paracetamol 1g TDS' },
    { abbr: 'QDS / QID', meaning: 'Four times daily', latin: 'Quater die sumendum', warning: 'Check if truly 6-hourly or with meals', example: 'Ibuprofen 400mg QDS with food' },
    { abbr: 'PRN', meaning: 'As needed / when required', latin: 'Pro re nata', warning: 'Always check maximum daily dose & frequency', example: 'Paracetamol 1g PRN (max 4g/24hrs)' },
    { abbr: 'Stat', meaning: 'Immediately / at once', latin: 'Statim', warning: 'Give as soon as possible — time critical!', example: 'Adrenaline 0.5mg IM stat' },
    { abbr: 'Mane', meaning: 'In the morning', latin: 'Mane', warning: null, example: 'Prednisolone 40mg mane' },
    { abbr: 'Nocte', meaning: 'At night / bedtime', latin: 'Nocte', warning: null, example: 'Zopiclone 7.5mg nocte' },
    { abbr: 'AC', meaning: 'Before food', latin: 'Ante cibum', warning: 'Usually 30–60 mins before meals', example: 'Omeprazole 20mg AC' },
    { abbr: 'PC', meaning: 'After food', latin: 'Post cibum', warning: 'Usually within 30 mins of eating', example: 'Ibuprofen 400mg PC' },
    { abbr: 'OM', meaning: 'Every morning', latin: 'Omni mane', warning: null, example: 'Levothyroxine 50mcg OM' },
    { abbr: 'ON', meaning: 'Every night', latin: 'Omni nocte', warning: null, example: 'Simvastatin 40mg ON' },
  ],
  routes: [
    { abbr: 'PO', meaning: 'By mouth (oral)', warning: 'Check swallowing ability first', example: 'Paracetamol 1g PO' },
    { abbr: 'IV', meaning: 'Intravenous (into vein)', warning: 'Check cannula site for phlebitis', example: 'Flucloxacillin 1g IV QDS' },
    { abbr: 'IM', meaning: 'Intramuscular (into muscle)', warning: 'Check injection site & technique', example: 'Vitamin B12 1mg IM' },
    { abbr: 'SC / SubCut', meaning: 'Subcutaneous (under skin)', warning: 'Rotate injection sites', example: 'Insulin 10 units SC' },
    { abbr: 'SL', meaning: 'Sublingual (under tongue)', warning: 'Do not swallow — absorbs through mucosa', example: 'GTN 0.5mg SL' },
    { abbr: 'PR', meaning: 'Per rectum', warning: 'Check patient consent & dignity', example: 'Diazepam 10mg PR' },
    { abbr: 'INH', meaning: 'Inhaled / inhalation', warning: 'Check inhaler technique', example: 'Salbutamol 100mcg INH PRN' },
    { abbr: 'NEB', meaning: 'Via nebuliser', warning: 'Check O2 vs air-driven for COPD', example: 'Salbutamol 2.5mg NEB' },
    { abbr: 'TOP', meaning: 'Topical (on skin)', warning: 'Apply to affected area only', example: 'Hydrocortisone 1% TOP BD' },
    { abbr: 'NG', meaning: 'Via nasogastric tube', warning: 'Check tube position before giving', example: 'Omeprazole 20mg via NG' },
    { abbr: 'IT', meaning: 'Intrathecal (into spine)', warning: 'SPECIALIST USE ONLY — fatal if wrong drug given!', example: 'Methotrexate IT' },
  ],
  units: [
    { abbr: 'g', meaning: 'Gram', note: null, conversion: '1g = 1,000mg' },
    { abbr: 'mg', meaning: 'Milligram (1/1000 gram)', note: null, conversion: '1mg = 1,000mcg' },
    { abbr: 'mcg / μg', meaning: 'Microgram (1/1000 milligram)', note: 'NEVER abbreviate to "μg" in handwriting — looks like "mg"!', conversion: '1,000mcg = 1mg' },
    { abbr: 'ml / mL', meaning: 'Millilitre', note: null, conversion: '1,000ml = 1L' },
    { abbr: 'L', meaning: 'Litre', note: null, conversion: '1L = 1,000ml' },
    { abbr: 'mmol', meaning: 'Millimole', note: 'Used for electrolytes & glucose', conversion: null },
    { abbr: 'units', meaning: 'Units (e.g., insulin)', note: 'NEVER abbreviate "units" to "U" — can be misread as "0"!', conversion: null },
  ],
  forms: [
    { abbr: 'Tab', meaning: 'Tablet', note: 'Check if can be crushed' },
    { abbr: 'Cap', meaning: 'Capsule', note: 'Usually cannot open — check first' },
    { abbr: 'Susp', meaning: 'Suspension', note: 'Shake well before use' },
    { abbr: 'Sol', meaning: 'Solution', note: 'Liquid form, ready to use' },
    { abbr: 'EC', meaning: 'Enteric coated', note: 'Do NOT crush — releases in intestine' },
    { abbr: 'MR / SR / XL', meaning: 'Modified/Slow/Extended release', note: 'NEVER crush — causes dose dumping!' },
    { abbr: 'MDI', meaning: 'Metered dose inhaler', note: 'May need spacer device' },
    { abbr: 'DPI', meaning: 'Dry powder inhaler', note: 'Breath-activated' },
  ],
};

const quizQuestions = [
  { question: 'What does "BD" mean?', options: ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily'], answer: 1 },
  { question: 'What does "PO" mean?', options: ['Per rectum', 'By mouth', 'Intravenous', 'Intramuscular'], answer: 1 },
  { question: 'What does "PRN" mean?', options: ['Immediately', 'Once daily', 'As needed', 'Before food'], answer: 2 },
  { question: 'What does "SC" stand for?', options: ['Sublingual', 'Subcutaneous', 'Slow release', 'Solution'], answer: 1 },
  { question: 'What does "Stat" mean?', options: ['At night', 'In the morning', 'Immediately', 'Twice daily'], answer: 2 },
  { question: 'What does "Nocte" mean?', options: ['In the morning', 'With food', 'At night', 'As needed'], answer: 2 },
  { question: 'What is the meaning of "AC"?', options: ['After food', 'Before food', 'At bedtime', 'Once daily'], answer: 1 },
  { question: 'What does "MR" on a tablet mean?', options: ['Must refrigerate', 'Modified release', 'Morning only', 'Mix required'], answer: 1 },
  { question: 'Why should you NEVER write "U" for units?', options: ['It\'s not medical terminology', 'It can be misread as "0"', 'It\'s only used in America', 'It means something else'], answer: 1 },
  { question: 'What does "SL" mean?', options: ['Slow release', 'Sublingual', 'Solution', 'Suspension'], answer: 1 },
];

const TABS = [
  { id: 'frequency', label: 'Frequency / Timing' },
  { id: 'routes', label: 'Routes' },
  { id: 'units', label: 'Units' },
  { id: 'forms', label: 'Drug Forms' },
] as const;

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.ma-guide *, .ma-guide *::before, .ma-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ma-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.ma-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.ma-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-decoration: none;
  margin-bottom: 44px;
}
.ma-back:hover { color: var(--ink-soft); }
.ma-back-arrow { font-style: normal; }

/* Masthead */
.ma-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.ma-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ma-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ma-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Pearl / info callout */
.ma-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.ma-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.ma-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Red flags */
.ma-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.ma-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ma-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Section headings */
.ma-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 18px;
  padding-top: 24px;
  margin-top: 36px;
  padding-bottom: 16px;
  border-top: 0.5px solid var(--hairline-firm);
  border-bottom: 0.5px solid var(--hairline-firm);
}

/* Step sections — used for the 4 category tabs */
.ma-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.ma-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.ma-step-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.ma-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.ma-step-content {
  padding-left: 32px;
}

.ma-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.ma-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

/* Table */
.ma-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.ma-table th {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  font-weight: 400;
  padding: 11px 16px;
  border-bottom: 0.5px solid var(--hairline-firm);
  border-right: 0.5px solid var(--hairline-firm);
  text-align: left;
  background: var(--surface-sunken);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.ma-table th:last-child { border-right: none; }

.ma-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.ma-table td:last-child { border-right: none; }
.ma-table tr:last-child td { border-bottom: none; }
.ma-table td:first-child { font-weight: 400; color: var(--ink-mid); font-family: 'Courier New', Courier, monospace; }

/* Tabs */
.ma-tabs {
  display: flex;
  gap: 0;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.ma-tab {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 10px 18px;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  background: transparent;
}

.ma-tab-active {
  color: var(--ink-strong);
  border-bottom: 1.5px solid #1A1815;
  font-weight: 400;
}

.ma-tab-inactive {
  color: var(--ink-faint);
  border-bottom: 1.5px solid transparent;
  font-weight: 300;
}
.ma-tab-inactive:hover {
  color: var(--ink-soft);
}

/* Quiz card */
.ma-quiz-card {
  border: 0.5px solid var(--hairline-firm);
  padding: 24px;
  margin-bottom: 32px;
  background: var(--surface-raised);
}

.ma-quiz-option {
  display: block;
  width: 100%;
  text-align: left;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: var(--ink-mid);
  padding: 10px 14px;
  border: 0.5px solid var(--hairline-firm);
  background: var(--surface-page);
  cursor: pointer;
  transition: background 0.12s;
}
.ma-quiz-option:hover { background: var(--surface-sunken); }

.ma-quiz-correct {
  background: var(--teal-50) !important;
  border-color: var(--teal-600) !important;
  color: var(--teal-800) !important;
}

.ma-quiz-wrong {
  background: var(--red-50) !important;
  border-color: var(--red-600) !important;
  color: var(--red-600) !important;
}

/* Step colour system */
.ma-numeral-1 { color: var(--blue-600); }
.ma-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.ma-numeral-2 { color: var(--teal-600); }
.ma-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.ma-numeral-3 { color: var(--coral-600); }
.ma-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.ma-numeral-4 { color: var(--purple-600); }
.ma-badge-4 { background: var(--purple-50); color: var(--purple-800); }

/* Responsive */
@media (max-width: 800px) {
  .ma-wrap { padding: 24px 20px 60px; }
  .ma-headline { font-size: 34px; }
  .ma-step { grid-template-columns: 1fr; }
  .ma-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid var(--hairline-firm); padding-bottom: 12px; padding-right: 0; margin-bottom: 16px; }
  .ma-step-numeral { font-size: 48px; }
  .ma-step-content { padding-left: 0; }
  .ma-tabs { gap: 0; }
  .ma-tab { padding: 8px 12px; font-size: 9px; }
  .ma-table { font-size: 11px; }
  .ma-table th, .ma-table td { padding: 8px 10px; }
}
/* ── Polish layer ───────────────────────────────────────────── */
.ma-kicker { color: var(--gold-deep, #8a7350); }
.ma-headline { font-size: 56px; }
.ma-byline { border-bottom: none; padding-bottom: 6px; margin-bottom: 0; }
.ma-pulse { display: block; width: 100%; height: 40px; margin-bottom: 40px; overflow: visible; }
.ma-pulse path { stroke: var(--gold, #cbae78); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; animation: ma-pulse-draw 2.6s ease-out 0.3s forwards; }
@keyframes ma-pulse-draw { to { stroke-dashoffset: 0; } }
.ma-golden { gap: 14px; border: none; }
.ma-golden-cell { border: 0.5px solid var(--hairline-firm); border-radius: 2px; background: var(--surface-page); transition: transform 0.2s ease, border-color 0.2s ease; }
.ma-golden-cell:last-child { border-right: 0.5px solid var(--hairline-firm); }
.ma-golden-cell:hover { transform: translateY(-2px); border-color: var(--gold); }
.ma-golden-numeral { color: var(--gold); font-size: 34px; }
.ma-section-title { border: none; padding: 18px 0 0; margin-top: 56px; font-size: 28px; position: relative; }
.ma-section-title::before { content: ''; position: absolute; top: 0; left: 0; width: 44px; height: 3px; border-radius: 999px; background: var(--gold); }
.ma-content-grid, .ma-table { border-radius: 2px; }
.ma-content-grid { overflow: hidden; border-color: var(--hairline-firm); }
.ma-table { border-collapse: separate; border-spacing: 0; overflow: hidden; border-color: var(--hairline-firm); }
.ma-table th { background: transparent; color: var(--gold-deep, #8a7350); border-bottom-color: var(--hairline-firm); }
.ma-table td { padding-top: 12px; padding-bottom: 12px; line-height: 1.65; }
.ma-table td:first-child { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; color: var(--ink-strong); }
.ma-table tbody tr:nth-child(even) td { background: rgba(203, 174, 120, 0.06); }
.ma-table tbody tr:hover td { background: rgba(203, 174, 120, 0.14); }
.ma-step { border-top-color: var(--hairline-soft); }
.ma-step-letter { text-shadow: none; }
.ma-step-name { font-size: 34px; }
.ma-step-badge, .ma-red-pill { border-radius: 999px; }
.ma-pearl { background: transparent; border: 0.5px solid var(--hairline-firm); border-left: 3px solid var(--gold); border-radius: 2px; padding: 18px 24px; }
.ma-pearl-label { color: var(--gold-deep, #8a7350); font-size: 10px; letter-spacing: 0.18em; margin-bottom: 8px; }
.ma-pearl p { color: var(--ink-mid); font-size: 13.5px; line-height: 1.75; }
.ma-diagram { border-radius: 2px; border-color: var(--hairline-firm); background: var(--surface-page); }
.ma-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.ma-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .ma-pulse path { animation: none; stroke-dashoffset: 0; }
  .ma-reveal { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) { .ma-headline { font-size: 36px; } .ma-step-name { font-size: 26px; } }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MedicationAbbreviationsPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.ma-guide .ma-step, .ma-guide .ma-diagram, .ma-guide .ma-golden-cell, .ma-guide .ma-pearl'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('ma-reveal'); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);

  const [activeTab, setActiveTab] = useState<'frequency' | 'routes' | 'units' | 'forms'>('frequency');
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === quizQuestions[currentQuestion].answer) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  const currentData = abbreviations[activeTab] as Array<{ abbr: string; meaning: string; warning?: string | null; note?: string | null; latin?: string; example?: string; conversion?: string | null }>;

  const sectionMeta: Record<string, { num: string; colour: string; badge: string; subtitle: string }> = {
    frequency: { num: '1', colour: '1', badge: 'Timing', subtitle: 'OD, BD, TDS, PRN and the rest — what they actually mean on a drug chart' },
    routes: { num: '2', colour: '2', badge: 'Routes', subtitle: 'PO, IV, IM, SC — how the drug gets into the patient' },
    units: { num: '3', colour: '3', badge: 'Units', subtitle: 'Grams, milligrams, micrograms — and the ones that cause errors' },
    forms: { num: '4', colour: '4', badge: 'Forms', subtitle: 'Tablets, capsules, modified release — and which you must never crush' },
  };

  const meta = sectionMeta[activeTab];

  return (
    <div className="ma-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ma-wrap">
        {/* Back nav */}
        <Link href="/hub" className="ma-back">
          <span className="ma-back-arrow">←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="ma-kicker">Medication Safety · Chart Shorthand</p>
        <h1 className="ma-headline">Medication Abbreviations Guide</h1>
        <p className="ma-standfirst">
          A plain-English guide to the shorthand you keep seeing on drug charts, plus the ones safest not to write at all.
        </p>
        <p className="ma-byline">The Nurse Lab · Nursing Hub</p>
        <svg className="ma-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" pathLength={1} />
        </svg>
        <EditorialSaveButton
          hubItemId="medication-abbreviations"
          hubItemTitle="Medication Abbreviations Guide"
        />

        {/* Student note */}
        <div className="ma-pearl" style={{ marginBottom: '40px' }}>
          <p className="ma-pearl-label">Student note</p>
          <p>
            You do not need to memorise every Latin phrase to work safely. Focus on what the abbreviation means in practice, what it tells you to do, and which short forms are risky enough that you should avoid writing them yourself.
          </p>
        </div>

        {/* Safety warnings */}
        <p className="ma-redflags-label">Critical safety reminders</p>
        <div className="ma-redflags" style={{ marginBottom: '40px' }}>
          {[
            'NEVER write "U" for units — misread as "0"',
            'NEVER write "μg" — handwritten looks like "mg" (1000× overdose!)',
            'NEVER crush MR/SR/EC tablets',
            'If a chart abbreviation is unclear, stop and check',
          ].map(flag => <span key={flag} className="ma-red-pill">{flag}</span>)}
        </div>

        {/* Tabs */}
        <div className="ma-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as typeof activeTab); setQuizMode(false); }}
              className={`ma-tab ${activeTab === tab.id && !quizMode ? 'ma-tab-active' : 'ma-tab-inactive'}`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setQuizMode(!quizMode)}
            className={`ma-tab ${quizMode ? 'ma-tab-active' : 'ma-tab-inactive'}`}
            style={{ marginLeft: 'auto' }}
          >
            {quizMode ? 'Exit Quiz' : 'Test Yourself'}
          </button>
        </div>

        {/* Quiz Mode */}
        {quizMode && (
          <div className="ma-quiz-card">
            {!quizComplete ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '9px', color: 'var(--ink-faint)', letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-mid)' }}>
                    Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                  </span>
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--ink-strong)', marginBottom: '16px' }}>
                  {quizQuestions[currentQuestion].question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '16px' }}>
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`ma-quiz-option ${showResult && index === quizQuestions[currentQuestion].answer ? 'ma-quiz-correct' : ''} ${showResult && selectedAnswer === index && index !== quizQuestions[currentQuestion].answer ? 'ma-quiz-wrong' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {showResult && (
                  <button onClick={handleNext} style={{ background: '#2C2A27', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>
                    {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'See Results'}
                  </button>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center' as const }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--ink-strong)', marginBottom: '8px' }}>
                  {score}/{quizQuestions.length}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: '16px', fontWeight: 300 }}>
                  {score >= 8 ? 'Excellent. These abbreviations are looking solid.' : score >= 5 ? 'Good effort. Review the ones you missed and you will be fine.' : 'Keep practising. Use the guide below and try again.'}
                </p>
                <button onClick={resetQuiz} style={{ background: 'transparent', color: 'var(--ink-mid)', border: '0.5px solid var(--hairline-firm)', padding: '8px 18px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Numbered section with table */}
        {!quizMode && (
          <div className="ma-step">
            <div className="ma-step-sidebar">
              <span className={`ma-step-numeral ma-numeral-${meta.colour}`}>{meta.num}</span>
              <span className={`ma-step-badge ma-badge-${meta.colour}`}>{meta.badge}</span>
            </div>
            <div className="ma-step-content">
              <h2 className="ma-step-name">{TABS.find(t => t.id === activeTab)?.label}</h2>
              <p className="ma-step-question">{meta.subtitle}</p>

              <table className="ma-table">
                <thead>
                  <tr>
                    <th>Abbreviation</th>
                    <th>Meaning</th>
                    {activeTab === 'frequency' && <th>Origin</th>}
                    {(activeTab === 'frequency' || activeTab === 'routes') && <th>Example</th>}
                    {activeTab === 'units' && <th>Conversion</th>}
                    <th>What to remember</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item) => (
                    <tr key={item.abbr}>
                      <td>{item.abbr}</td>
                      <td>{item.meaning}</td>
                      {activeTab === 'frequency' && <td style={{ fontStyle: 'italic', color: 'var(--ink-faint)', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>{item.latin || '—'}</td>}
                      {(activeTab === 'frequency' || activeTab === 'routes') && <td style={{ fontSize: '11px' }}>{item.example || '—'}</td>}
                      {activeTab === 'units' && <td>{item.conversion || '—'}</td>}
                      <td style={{ color: item.warning?.includes('SPECIALIST') || item.warning?.includes('NEVER') || item.note?.includes('NEVER') ? 'var(--red-600)' : '#555', fontWeight: item.warning?.includes('SPECIALIST') || item.note?.includes('NEVER') ? 400 : 300 }}>
                        {item.warning || item.note || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clinical pearl */}
        <div className="ma-pearl">
          <p className="ma-pearl-label">Before giving any medication</p>
          <p>Check the 9 Rights. Read the prescription carefully. If you cannot read it clearly, do not guess. Check allergies, make sure you know why the patient is having it, and document straight after giving.</p>
        </div>

        <SelfTestQuiz title="Test Yourself: Medication Abbreviations" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'BNFC', title: 'British National Formulary for Children', href: 'https://bnf.nice.org.uk/' },
          { citation: 'BNF', title: 'British National Formulary', href: 'https://bnf.nice.org.uk/' },
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
          { citation: 'NHS England', title: 'Medication safety and prescribing resources', href: 'https://www.england.nhs.uk/patient-safety/medication-safety/' },
        ]} />
      </div>
    </div>
  );
}
