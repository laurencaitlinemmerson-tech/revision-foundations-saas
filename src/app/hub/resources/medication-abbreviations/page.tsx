'use client';

import { useState } from 'react';
import EditorialLayout from '@/components/EditorialLayout';
import { EDITORIAL_CSS } from '@/lib/editorialStyles';

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

const tabs = [
  { id: 'frequency', label: 'Frequency / Timing' },
  { id: 'routes', label: 'Routes' },
  { id: 'units', label: 'Units' },
  { id: 'forms', label: 'Drug Forms' },
];

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

  return (
    <EditorialLayout
      kicker="Medication Safety · Free Resource"
      title="Medication Abbreviations Guide"
      standfirst="Essential abbreviations for prescriptions and drug charts — with clinical tips, warnings, and examples for safe medication practice."
      byline="Revision Foundations · Children's Hub"
    >

      {/* Safety warnings */}
      <p className="ed-redflags-label">Critical safety reminders</p>
      <div className="ed-redflags" style={{ marginBottom: '32px' }}>
        {[
          'NEVER write "U" for units — misread as "0"',
          'NEVER write "μg" — handwritten looks like "mg" (1000× overdose!)',
          'NEVER crush MR/SR/EC tablets',
          'If unsure about any abbreviation — ask!',
        ].map(flag => <span key={flag} className="ed-red-pill">{flag}</span>)}
      </div>

      {/* Tabs */}
      <div className="ed-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`ed-tab ${activeTab === tab.id ? 'ed-tab-active' : 'ed-tab-inactive'}`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setQuizMode(!quizMode)}
          className={`ed-tab ${quizMode ? 'ed-tab-active' : 'ed-tab-inactive'}`}
          style={{ marginLeft: 'auto' }}
        >
          {quizMode ? 'Exit Quiz' : 'Test Yourself'}
        </button>
      </div>

      {/* Quiz Mode */}
      {quizMode && (
        <div className="ed-card" style={{ marginBottom: '32px' }}>
          {!quizComplete ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', color: '#999', fontFamily: 'Source Serif 4, serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                  Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <span style={{ fontSize: '11px', color: '#301906', fontFamily: 'Source Serif 4, serif' }}>
                  Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                </span>
              </div>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1A1815', marginBottom: '16px' }}>
                {quizQuestions[currentQuestion].question}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '16px' }}>
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`ed-quiz-option ${showResult && index === quizQuestions[currentQuestion].answer ? 'ed-quiz-correct' : ''} ${showResult && selectedAnswer === index && index !== quizQuestions[currentQuestion].answer ? 'ed-quiz-wrong' : ''}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showResult && (
                <button onClick={handleNext} style={{ background: '#301906', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '3px', cursor: 'pointer', fontFamily: 'Source Serif 4, serif', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                  {currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'See Results'}
                </button>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center' as const }}>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', color: '#301906', marginBottom: '8px' }}>
                {score}/{quizQuestions.length}
              </p>
              <p style={{ fontSize: '14px', color: '#5A5750', marginBottom: '16px' }}>
                {score >= 8 ? 'Excellent! You know your abbreviations well.' : score >= 5 ? 'Good effort — review the ones you missed.' : 'Keep practising — review the guide below.'}
              </p>
              <button onClick={resetQuiz} style={{ background: 'transparent', color: '#301906', border: '0.5px solid #301906', padding: '8px 18px', borderRadius: '3px', cursor: 'pointer', fontFamily: 'Source Serif 4, serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Abbreviation Table */}
      <table className="ed-table" style={{ marginBottom: '32px' }}>
        <thead>
          <tr>
            <th>Abbreviation</th>
            <th>Meaning</th>
            {activeTab === 'frequency' && <th>Latin origin</th>}
            {(activeTab === 'frequency' || activeTab === 'routes') && <th>Example</th>}
            {activeTab === 'units' && <th>Conversion</th>}
            <th>Clinical note</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.abbr}>
              <td style={{ fontFamily: 'Courier New, monospace', fontWeight: 600 }}>{item.abbr}</td>
              <td>{item.meaning}</td>
              {activeTab === 'frequency' && <td style={{ fontStyle: 'italic', color: '#999' }}>{item.latin || '—'}</td>}
              {(activeTab === 'frequency' || activeTab === 'routes') && <td style={{ fontSize: '11px' }}>{item.example || '—'}</td>}
              {activeTab === 'units' && <td>{item.conversion || '—'}</td>}
              <td style={{ color: item.warning?.includes('SPECIALIST') || item.warning?.includes('NEVER') || item.note?.includes('NEVER') ? '#A32D2D' : '#5A5750', fontWeight: item.warning?.includes('SPECIALIST') || item.note?.includes('NEVER') ? 400 : 300 }}>
                {item.warning || item.note || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Clinical tips */}
      <div className="ed-pearl">
        <p className="ed-pearl-label">Before giving any medication</p>
        <p>Check the 9 rights. Read the prescription carefully — if you can't read it, don't guess. Check allergies on the drug chart. Know why the patient is taking it. Document administration immediately after giving.</p>
      </div>

    </EditorialLayout>
  );
}
