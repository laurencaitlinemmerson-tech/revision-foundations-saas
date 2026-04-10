'use client';
/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';

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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap');

.ma-guide *, .ma-guide *::before, .ma-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ma-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.ma-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.ma-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
  text-decoration: none;
  margin-bottom: 44px;
}
.ma-back:hover { color: #555; }
.ma-back-arrow { font-style: normal; }

/* Masthead */
.ma-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.ma-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ma-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ma-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Pearl / info callout */
.ma-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.ma-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.ma-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Red flags */
.ma-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
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
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 2px;
  font-weight: 300;
}

/* Section headings */
.ma-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 18px;
  padding-top: 36px;
  margin-top: 52px;
  padding-bottom: 16px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

/* Step sections — used for the 4 category tabs */
.ma-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}

.ma-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
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
  border-radius: 3px;
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
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.ma-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* Table */
.ma-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.ma-table th {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  font-weight: 400;
  padding: 11px 16px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  border-right: 0.5px solid rgba(0,0,0,0.1);
  text-align: left;
  background: #F5F3F0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.ma-table th:last-child { border-right: none; }

.ma-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.ma-table td:last-child { border-right: none; }
.ma-table tr:last-child td { border-bottom: none; }
.ma-table td:first-child { font-weight: 400; color: #2C2A27; font-family: 'Courier New', Courier, monospace; }

/* Tabs */
.ma-tabs {
  display: flex;
  gap: 0;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
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
  color: #1A1815;
  border-bottom: 1.5px solid #1A1815;
  font-weight: 400;
}

.ma-tab-inactive {
  color: #aaa;
  border-bottom: 1.5px solid transparent;
  font-weight: 300;
}
.ma-tab-inactive:hover {
  color: #555;
}

/* Quiz card */
.ma-quiz-card {
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 24px;
  margin-bottom: 32px;
  background: #fff;
}

.ma-quiz-option {
  display: block;
  width: 100%;
  text-align: left;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  padding: 10px 14px;
  border: 0.5px solid rgba(0,0,0,0.12);
  background: #FAFAF8;
  cursor: pointer;
  transition: background 0.12s;
}
.ma-quiz-option:hover { background: #F5F3F0; }

.ma-quiz-correct {
  background: #E1F5EE !important;
  border-color: #0F6E56 !important;
  color: #085041 !important;
}

.ma-quiz-wrong {
  background: #FCEBEB !important;
  border-color: #A32D2D !important;
  color: #A32D2D !important;
}

/* Step colour system */
.ma-numeral-1 { color: #185FA5; }
.ma-badge-1 { background: #E6F1FB; color: #0C447C; }
.ma-numeral-2 { color: #0F6E56; }
.ma-badge-2 { background: #E1F5EE; color: #085041; }
.ma-numeral-3 { color: #993C1D; }
.ma-badge-3 { background: #FAECE7; color: #712B13; }
.ma-numeral-4 { color: #534AB7; }
.ma-badge-4 { background: #EEEDFE; color: #3C3489; }

/* Responsive */
@media (max-width: 800px) {
  .ma-wrap { padding: 24px 20px 60px; }
  .ma-headline { font-size: 34px; }
  .ma-step { grid-template-columns: 1fr; }
  .ma-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 12px; padding-right: 0; margin-bottom: 16px; }
  .ma-step-numeral { font-size: 48px; }
  .ma-step-content { padding-left: 0; }
  .ma-tabs { gap: 0; }
  .ma-tab { padding: 8px 12px; font-size: 9px; }
  .ma-table { font-size: 11px; }
  .ma-table th, .ma-table td { padding: 8px 10px; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function MedicationAbbreviationsPage() {
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
                  <span style={{ fontSize: '9px', color: '#aaa', letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                  <span style={{ fontSize: '11px', color: '#2C2A27' }}>
                    Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                  </span>
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#1A1815', marginBottom: '16px' }}>
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
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#1A1815', marginBottom: '8px' }}>
                  {score}/{quizQuestions.length}
                </p>
                <p style={{ fontSize: '14px', color: '#5A5750', marginBottom: '16px', fontWeight: 300 }}>
                  {score >= 8 ? 'Excellent. These abbreviations are looking solid.' : score >= 5 ? 'Good effort. Review the ones you missed and you will be fine.' : 'Keep practising. Use the guide below and try again.'}
                </p>
                <button onClick={resetQuiz} style={{ background: 'transparent', color: '#2C2A27', border: '0.5px solid rgba(0,0,0,0.2)', padding: '8px 18px', borderRadius: '3px', cursor: 'pointer', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>
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
                      {activeTab === 'frequency' && <td style={{ fontStyle: 'italic', color: '#999', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>{item.latin || '—'}</td>}
                      {(activeTab === 'frequency' || activeTab === 'routes') && <td style={{ fontSize: '11px' }}>{item.example || '—'}</td>}
                      {activeTab === 'units' && <td>{item.conversion || '—'}</td>}
                      <td style={{ color: item.warning?.includes('SPECIALIST') || item.warning?.includes('NEVER') || item.note?.includes('NEVER') ? '#A32D2D' : '#555', fontWeight: item.warning?.includes('SPECIALIST') || item.note?.includes('NEVER') ? 400 : 300 }}>
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
      </div>
    </div>
  );
}
