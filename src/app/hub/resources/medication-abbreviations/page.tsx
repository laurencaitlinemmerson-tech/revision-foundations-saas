'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, FileText, Clock, Syringe, Pill, AlertTriangle, CheckCircle2, XCircle, RotateCcw, Printer, Brain, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const abbreviations = {
  frequency: [
    { abbr: 'OD', meaning: 'Once daily', latin: 'Omni die', warning: null, example: 'Atorvastatin 20mg OD at night' },
    { abbr: 'BD / BID', meaning: 'Twice daily', latin: 'Bis in die', warning: null, example: 'Amoxicillin 500mg BD' },
    { abbr: 'TDS / TID', meaning: 'Three times daily', latin: 'Ter die sumendum', warning: null, example: 'Paracetamol 1g TDS' },
    { abbr: 'QDS / QID', meaning: 'Four times daily', latin: 'Quater die sumendum', warning: 'Check if truly 6-hourly or with meals', example: 'Ibuprofen 400mg QDS with food' },
    { abbr: 'PRN', meaning: 'As needed/when required', latin: 'Pro re nata', warning: 'Always check maximum daily dose & frequency', example: 'Paracetamol 1g PRN (max 4g/24hrs)' },
    { abbr: 'Stat', meaning: 'Immediately/at once', latin: 'Statim', warning: 'Give as soon as possible - time critical!', example: 'Adrenaline 0.5mg IM stat' },
    { abbr: 'Mane', meaning: 'In the morning', latin: 'Mane', warning: null, example: 'Prednisolone 40mg mane' },
    { abbr: 'Nocte', meaning: 'At night/bedtime', latin: 'Nocte', warning: null, example: 'Zopiclone 7.5mg nocte' },
    { abbr: 'AC', meaning: 'Before food', latin: 'Ante cibum', warning: 'Usually 30-60 mins before meals', example: 'Omeprazole 20mg AC' },
    { abbr: 'PC', meaning: 'After food', latin: 'Post cibum', warning: 'Usually within 30 mins of eating', example: 'Ibuprofen 400mg PC' },
    { abbr: 'OM', meaning: 'Every morning', latin: 'Omni mane', warning: null, example: 'Levothyroxine 50mcg OM' },
    { abbr: 'ON', meaning: 'Every night', latin: 'Omni nocte', warning: null, example: 'Simvastatin 40mg ON' },
  ],
  routes: [
    { abbr: 'PO', meaning: 'By mouth (oral)', warning: 'Check swallowing ability first', example: 'Paracetamol 1g PO' },
    { abbr: 'IV', meaning: 'Intravenous (into vein)', warning: 'Check cannula site for phlebitis', example: 'Flucloxacillin 1g IV QDS' },
    { abbr: 'IM', meaning: 'Intramuscular (into muscle)', warning: 'Check injection site & technique', example: 'Vitamin B12 1mg IM' },
    { abbr: 'SC / SubCut', meaning: 'Subcutaneous (under skin)', warning: 'Rotate injection sites', example: 'Insulin 10 units SC' },
    { abbr: 'SL', meaning: 'Sublingual (under tongue)', warning: 'Do not swallow - absorbs through mucosa', example: 'GTN 0.5mg SL' },
    { abbr: 'PR', meaning: 'Per rectum', warning: 'Check patient consent & dignity', example: 'Diazepam 10mg PR' },
    { abbr: 'PV', meaning: 'Per vagina', warning: 'Explain procedure clearly to patient', example: 'Clotrimazole 500mg pessary PV' },
    { abbr: 'INH', meaning: 'Inhaled/inhalation', warning: 'Check inhaler technique', example: 'Salbutamol 100mcg INH PRN' },
    { abbr: 'NEB', meaning: 'Via nebuliser', warning: 'Check O2 vs air-driven for COPD', example: 'Salbutamol 2.5mg NEB' },
    { abbr: 'TOP', meaning: 'Topical (on skin)', warning: 'Apply to affected area only', example: 'Hydrocortisone 1% TOP BD' },
    { abbr: 'NG', meaning: 'Via nasogastric tube', warning: 'Check tube position before giving', example: 'Omeprazole 20mg via NG' },
    { abbr: 'NJ', meaning: 'Via nasojejunal tube', warning: 'Some meds interact with feeds', example: 'Phenytoin via NJ (stop feed)' },
    { abbr: 'PEG', meaning: 'Via PEG tube', warning: 'Flush before and after meds', example: 'Paracetamol liquid via PEG' },
    { abbr: 'IT', meaning: 'Intrathecal (into spine)', warning: 'SPECIALIST USE ONLY - fatal if wrong drug given!', example: 'Methotrexate IT' },
  ],
  units: [
    { abbr: 'g', meaning: 'Gram', note: null, conversion: '1g = 1000mg' },
    { abbr: 'mg', meaning: 'Milligram (1/1000 gram)', note: null, conversion: '1mg = 1000mcg' },
    { abbr: 'mcg / μg', meaning: 'Microgram (1/1000 milligram)', note: 'NEVER abbreviate to "μg" in handwriting - looks like "mg"!', conversion: '1000mcg = 1mg' },
    { abbr: 'ml / mL', meaning: 'Millilitre', note: null, conversion: '1000ml = 1L' },
    { abbr: 'L', meaning: 'Litre', note: null, conversion: '1L = 1000ml' },
    { abbr: 'mmol', meaning: 'Millimole', note: 'Used for electrolytes & glucose', conversion: null },
    { abbr: 'units', meaning: 'Units (e.g., insulin)', note: 'NEVER abbreviate "units" to "U" - can be misread as "0"!', conversion: null },
    { abbr: 'IU', meaning: 'International Units', note: 'Used for vitamins, heparin', conversion: null },
  ],
  forms: [
    { abbr: 'Tab', meaning: 'Tablet', note: 'Check if can be crushed' },
    { abbr: 'Cap', meaning: 'Capsule', note: 'Usually cannot open - check first' },
    { abbr: 'Susp', meaning: 'Suspension', note: 'Shake well before use' },
    { abbr: 'Sol', meaning: 'Solution', note: 'Liquid form, ready to use' },
    { abbr: 'Inj', meaning: 'Injection', note: 'Check route carefully' },
    { abbr: 'Supp', meaning: 'Suppository', note: 'Rectal or vaginal' },
    { abbr: 'MDI', meaning: 'Metered dose inhaler', note: 'May need spacer device' },
    { abbr: 'DPI', meaning: 'Dry powder inhaler', note: 'Breath-activated' },
    { abbr: 'Neb', meaning: 'Nebuliser solution', note: 'For use with nebuliser only' },
    { abbr: 'EC', meaning: 'Enteric coated', note: 'Do NOT crush - releases in intestine' },
    { abbr: 'MR / SR / XL', meaning: 'Modified/Slow/Extended release', note: 'NEVER crush - causes dose dumping!' },
    { abbr: 'Eff', meaning: 'Effervescent', note: 'Dissolve in water before taking' },
  ],
};

// Quiz questions
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
    if (index === quizQuestions[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
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

  const tabs = [
    { id: 'frequency', label: 'Frequency/Timing', icon: Clock, emoji: '⏰' },
    { id: 'routes', label: 'Routes', icon: Syringe, emoji: '💉' },
    { id: 'units', label: 'Units', icon: null, emoji: '⚖️' },
    { id: 'forms', label: 'Drug Forms', icon: Pill, emoji: '💊' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero pt-28 pb-12 relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.25 }} />
        <div className="blob blob-2" style={{ opacity: 0.25 }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-[var(--plum)] hover:text-[var(--purple)] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                FREE
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Medication Abbreviations Guide 💊
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg mb-6">
            Essential abbreviations for prescriptions and drug charts — with clinical tips, warnings, and examples.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setQuizMode(!quizMode)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                quizMode 
                  ? 'bg-[var(--purple)] text-white' 
                  : 'bg-white/80 text-[var(--plum)] hover:bg-white'
              }`}
            >
              <Brain className="w-4 h-4" />
              {quizMode ? 'Exit Quiz' : 'Test Yourself'}
            </button>
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/80 text-[var(--plum)] hover:bg-white transition-all print:hidden"
            >
              <Printer className="w-4 h-4" />
              Print for Placement
            </button>
          </div>
        </div>
      </section>

      {/* Quiz Mode */}
      <AnimatePresence>
        {quizMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-[var(--purple)]/10 to-[var(--pink)]/10 border-y border-[var(--lilac-medium)]"
          >
            <div className="max-w-2xl mx-auto px-6 py-8">
              {!quizComplete ? (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-[var(--plum-dark)]/60">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                    <span className="text-sm font-semibold text-[var(--purple)]">
                      Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-[var(--plum-dark)] mb-4">
                    {quizQuestions[currentQuestion].question}
                  </h3>
                  
                  <div className="space-y-2">
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          showResult
                            ? index === quizQuestions[currentQuestion].answer
                              ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800'
                              : selectedAnswer === index
                                ? 'bg-red-100 border-2 border-red-500 text-red-800'
                                : 'bg-gray-50 border-2 border-transparent'
                            : selectedAnswer === index
                              ? 'bg-[var(--lilac)] border-2 border-[var(--purple)]'
                              : 'bg-[var(--lilac-soft)] border-2 border-transparent hover:border-[var(--lavender)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {showResult && index === quizQuestions[currentQuestion].answer && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          )}
                          {showResult && selectedAnswer === index && index !== quizQuestions[currentQuestion].answer && (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleNextQuestion}
                      className="mt-4 btn-primary w-full"
                    >
                      {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="text-5xl mb-4">
                    {score >= 8 ? '🎉' : score >= 5 ? '👍' : '📚'}
                  </div>
                  <h3 className="text-2xl font-display text-[var(--plum-dark)] mb-2">
                    Quiz Complete!
                  </h3>
                  <p className="text-4xl font-bold text-[var(--purple)] mb-4">
                    {score}/{quizQuestions.length}
                  </p>
                  <p className="text-[var(--plum-dark)]/70 mb-6">
                    {score >= 8 
                      ? 'Excellent! You know your abbreviations well!' 
                      : score >= 5 
                        ? 'Good effort! Review the ones you missed.' 
                        : 'Keep practicing! Review the guide below.'}
                  </p>
                  <button onClick={resetQuiz} className="btn-secondary inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Critical Safety Warnings */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 print:border-red-400">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-800 mb-2">⚠️ Critical Safety Reminders</h2>
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>NEVER write &quot;U&quot; for units</strong> — it can be misread as &quot;0&quot; (e.g., &quot;10U&quot; looks like &quot;100&quot;)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>NEVER write &quot;μg&quot; for micrograms</strong> — handwritten &quot;μ&quot; looks like &quot;m&quot;, so &quot;μg&quot; becomes &quot;mg&quot; (1000x overdose!)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>NEVER crush MR/SR/EC tablets</strong> — this releases the full dose at once instead of slowly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>If unsure, ASK!</strong> — never guess an abbreviation. Check with a senior or pharmacist.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 print:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[var(--purple)] text-white shadow-md'
                  : 'bg-white text-[var(--plum-dark)] hover:bg-[var(--lilac-soft)]'
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Frequency Table */}
        <div className={`card mb-6 ${activeTab !== 'frequency' ? 'hidden print:block' : ''}`}>
          <h2 className="text-xl font-display text-[var(--plum)] mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[var(--purple)]" />
            Frequency & Timing Abbreviations
          </h2>
          <div className="space-y-3">
            {abbreviations.frequency.map((item, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl transition-all ${
                  item.warning ? 'bg-amber-50/50 border border-amber-200/50' : 'bg-[var(--lilac-soft)]/50'
                }`}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="min-w-[100px]">
                    <span className="font-mono text-lg font-bold text-[var(--purple)]">{item.abbr}</span>
                    {item.latin && (
                      <p className="text-xs text-[var(--plum-dark)]/50 italic">{item.latin}</p>
                    )}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-medium text-[var(--plum-dark)]">{item.meaning}</p>
                    <p className="text-sm text-[var(--plum-dark)]/60 mt-1">
                      <span className="font-medium">Example:</span> {item.example}
                    </p>
                    {item.warning && (
                      <p className="text-sm text-amber-700 mt-2 flex items-start gap-1">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {item.warning}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Routes Table */}
        <div className={`card mb-6 ${activeTab !== 'routes' ? 'hidden print:block' : ''}`}>
          <h2 className="text-xl font-display text-[var(--plum)] mb-4 flex items-center gap-2">
            <Syringe className="w-6 h-6 text-[var(--purple)]" />
            Routes of Administration
          </h2>
          <div className="space-y-3">
            {abbreviations.routes.map((item, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl transition-all ${
                  item.warning?.includes('SPECIALIST') || item.warning?.includes('fatal')
                    ? 'bg-red-50 border border-red-200' 
                    : item.warning 
                      ? 'bg-amber-50/50 border border-amber-200/50' 
                      : 'bg-[var(--lilac-soft)]/50'
                }`}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="min-w-[100px]">
                    <span className="font-mono text-lg font-bold text-[var(--purple)]">{item.abbr}</span>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-medium text-[var(--plum-dark)]">{item.meaning}</p>
                    <p className="text-sm text-[var(--plum-dark)]/60 mt-1">
                      <span className="font-medium">Example:</span> {item.example}
                    </p>
                    {item.warning && (
                      <p className={`text-sm mt-2 flex items-start gap-1 ${
                        item.warning.includes('SPECIALIST') || item.warning.includes('fatal')
                          ? 'text-red-700 font-semibold'
                          : 'text-amber-700'
                      }`}>
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {item.warning}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Units Table */}
        <div className={`card mb-6 ${activeTab !== 'units' ? 'hidden print:block' : ''}`}>
          <h2 className="text-xl font-display text-[var(--plum)] mb-4 flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            Units & Measurements
          </h2>
          <div className="space-y-3">
            {abbreviations.units.map((item, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl transition-all ${
                  item.note ? 'bg-red-50 border border-red-200' : 'bg-[var(--lilac-soft)]/50'
                }`}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="min-w-[100px]">
                    <span className="font-mono text-lg font-bold text-[var(--purple)]">{item.abbr}</span>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-medium text-[var(--plum-dark)]">{item.meaning}</p>
                    {item.conversion && (
                      <p className="text-sm text-[var(--plum-dark)]/60 mt-1">
                        <span className="font-medium">Conversion:</span> {item.conversion}
                      </p>
                    )}
                    {item.note && (
                      <p className="text-sm text-red-700 font-semibold mt-2 flex items-start gap-1">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Conversion Quick Reference */}
          <div className="mt-6 p-4 bg-[var(--mint)]/20 rounded-xl border border-[var(--mint)]">
            <h3 className="font-semibold text-emerald-800 mb-2">📐 Quick Conversion Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-emerald-700">
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-mono font-bold">1g</div>
                <div>= 1,000mg</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-mono font-bold">1mg</div>
                <div>= 1,000mcg</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-mono font-bold">1L</div>
                <div>= 1,000ml</div>
              </div>
              <div className="bg-white/60 rounded-lg p-2 text-center">
                <div className="font-mono font-bold">1kg</div>
                <div>= 1,000g</div>
              </div>
            </div>
          </div>
        </div>

        {/* Drug Forms Table */}
        <div className={`card mb-6 ${activeTab !== 'forms' ? 'hidden print:block' : ''}`}>
          <h2 className="text-xl font-display text-[var(--plum)] mb-4 flex items-center gap-2">
            <Pill className="w-6 h-6 text-[var(--purple)]" />
            Drug Forms & Formulations
          </h2>
          <div className="space-y-3">
            {abbreviations.forms.map((item, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl transition-all ${
                  item.note?.includes('NEVER') 
                    ? 'bg-red-50 border border-red-200' 
                    : 'bg-[var(--lilac-soft)]/50'
                }`}
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="min-w-[100px]">
                    <span className="font-mono text-lg font-bold text-[var(--purple)]">{item.abbr}</span>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-medium text-[var(--plum-dark)]">{item.meaning}</p>
                    {item.note && (
                      <p className={`text-sm mt-1 ${
                        item.note.includes('NEVER') ? 'text-red-700 font-semibold' : 'text-[var(--plum-dark)]/60'
                      }`}>
                        {item.note.includes('NEVER') && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Tips */}
        <div className="card bg-gradient-to-br from-[var(--lilac-soft)] to-[var(--pink-soft)]/30 border-0 mb-6">
          <h2 className="text-xl font-display text-[var(--plum)] mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[var(--purple)]" />
            Clinical Tips for Placement
          </h2>
          <div className="space-y-4">
            <div className="bg-white/60 rounded-xl p-4">
              <h3 className="font-semibold text-[var(--plum)] mb-2">📋 Before Giving Any Medication:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-[var(--plum-dark)]/80">
                <li>Check the 9 rights of medication administration</li>
                <li>Read the prescription carefully - if you can&apos;t read it, don&apos;t guess!</li>
                <li>Check allergies documented on the drug chart</li>
                <li>Know why the patient is taking this medication</li>
                <li>Document administration immediately after giving</li>
              </ol>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <h3 className="font-semibold text-[var(--plum)] mb-2">🚨 When to Escalate:</h3>
              <ul className="space-y-1 text-sm text-[var(--plum-dark)]/80">
                <li>• You can&apos;t read the prescription or abbreviation</li>
                <li>• The dose seems unusually high or low</li>
                <li>• You&apos;re not sure which route is meant</li>
                <li>• The drug isn&apos;t available in the prescribed form</li>
                <li>• Patient reports a new allergy or side effect</li>
              </ul>
            </div>
          </div>
        </div>

        {/* More resources CTA */}
        <div className="card bg-white text-center print:hidden">
          <h3 className="text-lg font-display text-[var(--plum)] mb-2">Want More Medication Resources?</h3>
          <p className="text-sm text-[var(--plum-dark)]/70 mb-4">
            Check out our drug calculations guide and the 9 Rights of Medication Administration.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/hub/resources/drug-calculations-cheat-sheet" className="btn-primary">
              Drug Calculations
            </Link>
            <Link href="/hub/resources/9-rights-medication" className="btn-secondary">
              9 Rights Guide
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .card { break-inside: avoid; margin-bottom: 1rem; }
          body { font-size: 12px; }
          h1 { font-size: 20px; }
          h2 { font-size: 16px; }
        }
      `}</style>
    </div>
  );
}
