'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { ArrowLeft, AlertTriangle, Lightbulb, Heart, Wind, Brain, Thermometer, Activity, Droplets, ChevronDown, ChevronUp, Printer, Download, BookOpen, Info, Stethoscope, CircleDot, HandMetal, Ruler, Baby, User } from 'lucide-react';

// Vital signs data by age group
const vitalSignsData = [
  {
    ageGroup: 'Newborn',
    ageRange: '0-28 days',
    color: 'pink',
    heartRate: { min: 100, max: 160 },
    respiratoryRate: { min: 30, max: 60 },
    systolicBP: { min: 60, max: 90 },
    diastolicBP: { min: 20, max: 60 },
    oxygenSat: { min: 95, max: 100 },
    temperature: { min: 36.5, max: 37.5 },
    capRefill: '< 3 seconds',
    notes: 'Irregular breathing patterns normal. May have periodic breathing (pauses up to 20s).',
  },
  {
    ageGroup: 'Infant',
    ageRange: '1-12 months',
    color: 'purple',
    heartRate: { min: 100, max: 150 },
    respiratoryRate: { min: 25, max: 50 },
    systolicBP: { min: 70, max: 100 },
    diastolicBP: { min: 30, max: 65 },
    oxygenSat: { min: 95, max: 100 },
    temperature: { min: 36.5, max: 37.5 },
    capRefill: '< 2 seconds',
    notes: 'Nose breathers - nasal congestion can cause significant distress.',
  },
  {
    ageGroup: 'Toddler',
    ageRange: '1-3 years',
    color: 'blue',
    heartRate: { min: 90, max: 140 },
    respiratoryRate: { min: 20, max: 40 },
    systolicBP: { min: 80, max: 110 },
    diastolicBP: { min: 40, max: 70 },
    oxygenSat: { min: 95, max: 100 },
    temperature: { min: 36.5, max: 37.5 },
    capRefill: '< 2 seconds',
    notes: 'Fear of strangers common - observe before touching. Use parents for reassurance.',
  },
  {
    ageGroup: 'Pre-school',
    ageRange: '3-5 years',
    color: 'teal',
    heartRate: { min: 80, max: 120 },
    respiratoryRate: { min: 20, max: 30 },
    systolicBP: { min: 85, max: 110 },
    diastolicBP: { min: 45, max: 70 },
    oxygenSat: { min: 95, max: 100 },
    temperature: { min: 36.5, max: 37.5 },
    capRefill: '< 2 seconds',
    notes: 'May cooperate with distraction. Explain procedures in simple terms.',
  },
  {
    ageGroup: 'School-age',
    ageRange: '6-11 years',
    color: 'emerald',
    heartRate: { min: 70, max: 110 },
    respiratoryRate: { min: 16, max: 24 },
    systolicBP: { min: 90, max: 120 },
    diastolicBP: { min: 50, max: 80 },
    oxygenSat: { min: 95, max: 100 },
    temperature: { min: 36.5, max: 37.5 },
    capRefill: '< 2 seconds',
    notes: 'Can understand explanations. Involve them in their care. Privacy becoming important.',
  },
  {
    ageGroup: 'Adolescent',
    ageRange: '12-18 years',
    color: 'amber',
    heartRate: { min: 60, max: 100 },
    respiratoryRate: { min: 12, max: 20 },
    systolicBP: { min: 100, max: 135 },
    diastolicBP: { min: 60, max: 85 },
    oxygenSat: { min: 95, max: 100 },
    temperature: { min: 36.5, max: 37.5 },
    capRefill: '< 2 seconds',
    notes: 'Approaching adult values. Consider confidentiality and offer time alone.',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; light: string }> = {
  pink: { bg: 'bg-pink-500', border: 'border-pink-300', text: 'text-pink-700', light: 'bg-pink-50' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-300', text: 'text-purple-700', light: 'bg-purple-50' },
  blue: { bg: 'bg-blue-500', border: 'border-blue-300', text: 'text-blue-700', light: 'bg-blue-50' },
  teal: { bg: 'bg-teal-500', border: 'border-teal-300', text: 'text-teal-700', light: 'bg-teal-50' },
  emerald: { bg: 'bg-emerald-500', border: 'border-emerald-300', text: 'text-emerald-700', light: 'bg-emerald-50' },
  amber: { bg: 'bg-amber-500', border: 'border-amber-300', text: 'text-amber-700', light: 'bg-amber-50' },
};

const quizQuestions = [
  {
    question: 'What is the normal heart rate range for a 6-month-old infant?',
    options: ['60-100 bpm', '80-120 bpm', '100-150 bpm', '120-180 bpm'],
    answer: 2,
    explanation: 'Infants (1-12 months) have a normal heart rate of 100-150 bpm. Their hearts are smaller and need to beat faster to meet metabolic demands.',
  },
  {
    question: 'A 2-year-old has a respiratory rate of 45. Is this normal?',
    options: ['Yes, this is within normal range', 'No, this is tachypnoea', 'No, this is bradypnoea', 'Cannot determine'],
    answer: 0,
    explanation: 'Toddlers (1-3 years) have a normal RR of 20-40. A rate of 45 is slightly elevated but close to the upper limit - continue monitoring and assess other signs.',
  },
  {
    question: 'What capillary refill time is considered abnormal in children?',
    options: ['> 1 second', '> 2 seconds', '> 5 seconds', '> 10 seconds'],
    answer: 1,
    explanation: 'Capillary refill > 2 seconds (or > 3 seconds in newborns) is abnormal and may indicate poor peripheral perfusion or shock.',
  },
  {
    question: 'A newborn has a respiratory rate of 55 with occasional pauses of 15 seconds. What should you do?',
    options: ['Immediate resuscitation', 'This is normal periodic breathing', 'Start oxygen therapy', 'Call a 2222'],
    answer: 1,
    explanation: 'Newborns can have periodic breathing with pauses up to 20 seconds. RR 30-60 is normal. This is expected and not a cause for concern unless pauses exceed 20s or are accompanied by colour change or bradycardia.',
  },
  {
    question: 'Which vital sign is often the FIRST to change in a deteriorating child?',
    options: ['Blood pressure', 'Heart rate', 'Temperature', 'Respiratory rate'],
    answer: 3,
    explanation: 'Respiratory rate is often the first vital sign to change in a deteriorating child. Children compensate well initially, and hypotension is a LATE sign of shock.',
  },
  {
    question: 'What is a normal systolic BP for a 4-year-old?',
    options: ['60-80 mmHg', '85-110 mmHg', '110-130 mmHg', '130-150 mmHg'],
    answer: 1,
    explanation: 'Pre-school children (3-5 years) have a normal systolic BP of 85-110 mmHg. Remember: hypotension is a late and serious sign in children.',
  },
];

export default function PaedsVitalSignsCheatSheet() {
  const [expandedAgeGroup, setExpandedAgeGroup] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const toggleAgeGroup = (ageGroup: string) => {
    setExpandedAgeGroup(expandedAgeGroup === ageGroup ? null : ageGroup);
  };

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden" style={{ touchAction: 'pan-y' }}>
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero pt-28 pb-12 relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.2 }} />
        <div className="blob blob-2" style={{ opacity: 0.2 }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-[var(--purple)] hover:text-[var(--plum)] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>
          <div className="flex items-center gap-2 text-sm text-[var(--purple)] mb-2">
            <span className="px-2 py-0.5 bg-[var(--mint)] text-[var(--plum)] rounded-full text-xs font-medium">
              FREE
            </span>
            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Quick Win</span>
            <span>•</span>
            <span>Save for placement</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Paediatric Vital Signs Cheat Sheet
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Complete reference for normal vital signs by age group. Essential for OSCEs, placement, and clinical practice.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Key Principles Box */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--pink)]/10 rounded-2xl p-6 border border-[var(--lavender)] mb-8">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" /> Key Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--plum-dark)]">
            <div className="flex items-start gap-2">
              <span className="text-[var(--purple)] font-bold">1.</span>
              <span><strong>Respiratory rate</strong> is often the FIRST sign to change in a deteriorating child</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--purple)] font-bold">2.</span>
              <span><strong>Hypotension is a LATE sign</strong> - children compensate well until they crash</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--purple)] font-bold">3.</span>
              <span>Always use <strong>age-appropriate cuff size</strong> for BP (cuff width = 2/3 upper arm)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--purple)] font-bold">4.</span>
              <span><strong>Trends matter more</strong> than single readings - compare to baseline</span>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[var(--plum-dark)]">Normal Ranges by Age</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-[var(--purple)] text-white'
                  : 'bg-[var(--lilac-soft)] text-[var(--plum)] hover:bg-[var(--lilac-medium)]'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-[var(--purple)] text-white'
                  : 'bg-[var(--lilac-soft)] text-[var(--plum)] hover:bg-[var(--lilac-medium)]'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {/* Cards View */}
        {viewMode === 'cards' && (
          <div className="space-y-4 mb-8">
            {vitalSignsData.map((data) => {
              const colors = colorClasses[data.color];
              const isExpanded = expandedAgeGroup === data.ageGroup;

              return (
                <div
                  key={data.ageGroup}
                  className={`bg-white rounded-2xl border-2 ${colors.border} overflow-hidden shadow-sm transition-all`}
                >
                  <button
                    onClick={() => toggleAgeGroup(data.ageGroup)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-white font-bold`}>
                        {data.ageGroup.charAt(0)}
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-[var(--plum-dark)]">{data.ageGroup}</h3>
                        <p className="text-sm text-[var(--plum-dark)]/60">{data.ageRange}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex items-center gap-3 text-sm">
                        <span className={`${colors.text} flex items-center gap-1`}>
                          <Heart className="w-4 h-4" /> {data.heartRate.min}-{data.heartRate.max}
                        </span>
                        <span className={`${colors.text} flex items-center gap-1`}>
                          <Wind className="w-4 h-4" /> {data.respiratoryRate.min}-{data.respiratoryRate.max}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[var(--purple)]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[var(--purple)]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4" style={{ touchAction: 'pan-y' }}>
                      {/* Vital Signs Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className={`${colors.light} rounded-xl p-3 text-center`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Heart className={`w-4 h-4 ${colors.text}`} />
                            <span className={`text-xs font-medium ${colors.text}`}>Heart Rate</span>
                          </div>
                          <p className="text-lg font-bold text-[var(--plum-dark)]">
                            {data.heartRate.min}-{data.heartRate.max}
                          </p>
                          <p className="text-xs text-[var(--plum-dark)]/60">bpm</p>
                        </div>

                        <div className={`${colors.light} rounded-xl p-3 text-center`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Wind className={`w-4 h-4 ${colors.text}`} />
                            <span className={`text-xs font-medium ${colors.text}`}>Resp Rate</span>
                          </div>
                          <p className="text-lg font-bold text-[var(--plum-dark)]">
                            {data.respiratoryRate.min}-{data.respiratoryRate.max}
                          </p>
                          <p className="text-xs text-[var(--plum-dark)]/60">breaths/min</p>
                        </div>

                        <div className={`${colors.light} rounded-xl p-3 text-center`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Activity className={`w-4 h-4 ${colors.text}`} />
                            <span className={`text-xs font-medium ${colors.text}`}>Systolic BP</span>
                          </div>
                          <p className="text-lg font-bold text-[var(--plum-dark)]">
                            {data.systolicBP.min}-{data.systolicBP.max}
                          </p>
                          <p className="text-xs text-[var(--plum-dark)]/60">mmHg</p>
                        </div>

                        <div className={`${colors.light} rounded-xl p-3 text-center`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Activity className={`w-4 h-4 ${colors.text}`} />
                            <span className={`text-xs font-medium ${colors.text}`}>Diastolic BP</span>
                          </div>
                          <p className="text-lg font-bold text-[var(--plum-dark)]">
                            {data.diastolicBP.min}-{data.diastolicBP.max}
                          </p>
                          <p className="text-xs text-[var(--plum-dark)]/60">mmHg</p>
                        </div>

                        <div className={`${colors.light} rounded-xl p-3 text-center`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Droplets className={`w-4 h-4 ${colors.text}`} />
                            <span className={`text-xs font-medium ${colors.text}`}>SpO2</span>
                          </div>
                          <p className="text-lg font-bold text-[var(--plum-dark)]">
                            {data.oxygenSat.min}-{data.oxygenSat.max}
                          </p>
                          <p className="text-xs text-[var(--plum-dark)]/60">%</p>
                        </div>

                        <div className={`${colors.light} rounded-xl p-3 text-center`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Thermometer className={`w-4 h-4 ${colors.text}`} />
                            <span className={`text-xs font-medium ${colors.text}`}>Temperature</span>
                          </div>
                          <p className="text-lg font-bold text-[var(--plum-dark)]">
                            {data.temperature.min}-{data.temperature.max}
                          </p>
                          <p className="text-xs text-[var(--plum-dark)]/60">°C</p>
                        </div>
                      </div>

                      {/* Cap Refill & Notes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs font-medium text-[var(--plum)] mb-1">Capillary Refill</p>
                          <p className="text-sm font-semibold text-[var(--plum-dark)]">{data.capRefill}</p>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                          <p className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" /> Clinical Note
                          </p>
                          <p className="text-sm text-amber-800">{data.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-[var(--lilac-medium)] overflow-hidden shadow-sm mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--lilac-soft)]">
                    <th className="px-3 py-3 text-left font-semibold text-[var(--plum)]">Age Group</th>
                    <th className="px-3 py-3 text-center font-semibold text-[var(--plum)]">
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="w-4 h-4" /> HR
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center font-semibold text-[var(--plum)]">
                      <div className="flex items-center justify-center gap-1">
                        <Wind className="w-4 h-4" /> RR
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center font-semibold text-[var(--plum)]">
                      <div className="flex items-center justify-center gap-1">
                        <Activity className="w-4 h-4" /> SBP
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center font-semibold text-[var(--plum)]">DBP</th>
                    <th className="px-3 py-3 text-center font-semibold text-[var(--plum)]">
                      <div className="flex items-center justify-center gap-1">
                        <Droplets className="w-4 h-4" /> SpO2
                      </div>
                    </th>
                    <th className="px-3 py-3 text-center font-semibold text-[var(--plum)]">CRT</th>
                  </tr>
                </thead>
                <tbody>
                  {vitalSignsData.map((data, index) => {
                    const colors = colorClasses[data.color];
                    return (
                      <tr
                        key={data.ageGroup}
                        className={`border-t border-[var(--lilac-soft)] ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                            <div>
                              <p className="font-medium text-[var(--plum-dark)]">{data.ageGroup}</p>
                              <p className="text-xs text-[var(--plum-dark)]/60">{data.ageRange}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-[var(--plum-dark)]">
                          {data.heartRate.min}-{data.heartRate.max}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-[var(--plum-dark)]">
                          {data.respiratoryRate.min}-{data.respiratoryRate.max}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-[var(--plum-dark)]">
                          {data.systolicBP.min}-{data.systolicBP.max}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-[var(--plum-dark)]">
                          {data.diastolicBP.min}-{data.diastolicBP.max}
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-[var(--plum-dark)]">
                          {data.oxygenSat.min}-{data.oxygenSat.max}%
                        </td>
                        <td className="px-3 py-3 text-center text-[var(--plum-dark)]">
                          {data.capRefill}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-[var(--lilac-soft)] border-t border-[var(--lilac-medium)]">
              <p className="text-xs text-[var(--plum-dark)]/70">
                <strong>Legend:</strong> HR = Heart Rate (bpm) | RR = Respiratory Rate (breaths/min) | SBP/DBP = Systolic/Diastolic Blood Pressure (mmHg) | SpO2 = Oxygen Saturation (%) | CRT = Capillary Refill Time
              </p>
            </div>
          </div>
        )}

        {/* How to Take Observations Section */}
        <div className="bg-white rounded-2xl border border-[var(--lilac-medium)] overflow-hidden shadow-sm mb-8">
          <div className="bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] p-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5" /> How to Take Observations by Age
            </h2>
            <p className="text-white/80 text-sm mt-1">Equipment, technique & positioning guidance</p>
          </div>

          <div className="p-4 space-y-6">
            {/* Blood Pressure Section */}
            <div>
              <h3 className="font-semibold text-[var(--plum-dark)] mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--purple)]" /> Blood Pressure
              </h3>

              {/* Cuff Size Table */}
              <div className="bg-[var(--lilac-soft)] rounded-xl p-4 mb-4">
                <h4 className="font-medium text-[var(--plum)] mb-3 flex items-center gap-2">
                  <Ruler className="w-4 h-4" /> Cuff Size Selection (CRITICAL!)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--lavender)]">
                        <th className="px-3 py-2 text-left font-semibold text-[var(--plum)]">Age</th>
                        <th className="px-3 py-2 text-left font-semibold text-[var(--plum)]">Cuff Width</th>
                        <th className="px-3 py-2 text-left font-semibold text-[var(--plum)]">Bladder Length</th>
                        <th className="px-3 py-2 text-left font-semibold text-[var(--plum)]">Cuff Name</th>
                      </tr>
                    </thead>
                    <tbody className="text-[var(--plum-dark)]">
                      <tr className="border-b border-[var(--lilac-soft)]">
                        <td className="px-3 py-2">Newborn</td>
                        <td className="px-3 py-2 font-mono">2.5-4 cm</td>
                        <td className="px-3 py-2 font-mono">5-9 cm</td>
                        <td className="px-3 py-2">Neonatal / Size 1</td>
                      </tr>
                      <tr className="border-b border-[var(--lilac-soft)]">
                        <td className="px-3 py-2">Infant (1-12m)</td>
                        <td className="px-3 py-2 font-mono">4-6 cm</td>
                        <td className="px-3 py-2 font-mono">9-14 cm</td>
                        <td className="px-3 py-2">Infant / Size 2</td>
                      </tr>
                      <tr className="border-b border-[var(--lilac-soft)]">
                        <td className="px-3 py-2">Toddler (1-3y)</td>
                        <td className="px-3 py-2 font-mono">6-8 cm</td>
                        <td className="px-3 py-2 font-mono">12-18 cm</td>
                        <td className="px-3 py-2">Child / Size 3</td>
                      </tr>
                      <tr className="border-b border-[var(--lilac-soft)]">
                        <td className="px-3 py-2">Child (3-6y)</td>
                        <td className="px-3 py-2 font-mono">8-10 cm</td>
                        <td className="px-3 py-2 font-mono">17-22 cm</td>
                        <td className="px-3 py-2">Small Adult / Size 4</td>
                      </tr>
                      <tr className="border-b border-[var(--lilac-soft)]">
                        <td className="px-3 py-2">School-age (6-12y)</td>
                        <td className="px-3 py-2 font-mono">10-12 cm</td>
                        <td className="px-3 py-2 font-mono">22-26 cm</td>
                        <td className="px-3 py-2">Adult / Size 5</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Adolescent</td>
                        <td className="px-3 py-2 font-mono">12-14 cm</td>
                        <td className="px-3 py-2 font-mono">26-33 cm</td>
                        <td className="px-3 py-2">Adult / Large Adult</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Golden Rule:</strong> Cuff bladder width should cover <strong>2/3 of upper arm</strong> (or 40% of arm circumference).
                    Too small = falsely HIGH reading. Too large = falsely LOW reading.
                  </p>
                </div>
              </div>

              {/* BP Technique by Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                  <h4 className="font-medium text-pink-800 mb-2 flex items-center gap-2">
                    <Baby className="w-4 h-4" /> Newborns & Infants
                  </h4>
                  <ul className="space-y-1 text-sm text-pink-900">
                    <li>• Use <strong>oscillometric device</strong> (Dinamap)</li>
                    <li>• Upper arm OR lower leg/calf acceptable</li>
                    <li>• Measure when <strong>calm or asleep</strong></li>
                    <li>• Support limb at heart level</li>
                    <li>• May need to repeat if moving/crying</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Toddlers & Older
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-900">
                    <li>• <strong>Right arm preferred</strong> (standardised)</li>
                    <li>• Seated with arm supported at heart level</li>
                    <li>• Allow 5 mins rest before measuring</li>
                    <li>• Explain procedure - use distraction</li>
                    <li>• Manual auscultation reliable from ~3 years</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Heart Rate Section */}
            <div>
              <h3 className="font-semibold text-[var(--plum-dark)] mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[var(--purple)]" /> Heart Rate
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                  <h4 className="font-medium text-pink-800 mb-2">Newborn & Infant</h4>
                  <ul className="space-y-1 text-sm text-pink-900">
                    <li>• <strong>Apex beat</strong> (auscultate) most accurate</li>
                    <li>• Brachial pulse for quick check</li>
                    <li>• Femoral pulse if concern about coarctation</li>
                    <li>• Count for <strong>full 60 seconds</strong></li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">Toddler & Pre-school</h4>
                  <ul className="space-y-1 text-sm text-purple-900">
                    <li>• Apex or radial pulse</li>
                    <li>• Pulse oximeter gives continuous HR</li>
                    <li>• Carotid palpable but can frighten</li>
                    <li>• Distraction helps cooperation</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <h4 className="font-medium text-emerald-800 mb-2">School-age & Adolescent</h4>
                  <ul className="space-y-1 text-sm text-emerald-900">
                    <li>• <strong>Radial pulse</strong> (standard)</li>
                    <li>• Can use apex if irregular</li>
                    <li>• Automated monitors reliable</li>
                    <li>• Note rhythm as well as rate</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 p-3 bg-[var(--lilac-soft)] rounded-lg">
                <p className="text-sm text-[var(--plum-dark)]">
                  <strong>Pulse locations:</strong> Brachial (inside elbow) • Radial (wrist) • Femoral (groin crease) • Carotid (neck) • Apex (left side of chest, 4th-5th intercostal space)
                </p>
              </div>
            </div>

            {/* Respiratory Rate Section */}
            <div>
              <h3 className="font-semibold text-[var(--plum-dark)] mb-3 flex items-center gap-2">
                <Wind className="w-5 h-5 text-[var(--purple)]" /> Respiratory Rate
              </h3>
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200 mb-3">
                <h4 className="font-medium text-teal-800 mb-2">Technique for All Ages</h4>
                <ul className="space-y-1 text-sm text-teal-900">
                  <li>• <strong>Observe chest/abdomen</strong> - don&apos;t touch (changes RR)</li>
                  <li>• Count for <strong>full 60 seconds</strong> (irregularities in young children)</li>
                  <li>• Count when child is <strong>calm/asleep</strong> if possible</li>
                  <li>• One rise AND fall = one breath</li>
                  <li>• Note: effort, symmetry, accessory muscle use, sounds</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-teal-100">
                  <p className="text-sm text-teal-800"><strong>Infants:</strong> Watch abdomen (diaphragmatic breathers)</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-teal-100">
                  <p className="text-sm text-teal-800"><strong>Older children:</strong> Watch chest wall movement</p>
                </div>
              </div>
            </div>

            {/* Temperature Section */}
            <div>
              <h3 className="font-semibold text-[var(--plum-dark)] mb-3 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-[var(--purple)]" /> Temperature
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--lilac-soft)]">
                      <th className="px-3 py-2 text-left font-semibold text-[var(--plum)]">Age</th>
                      <th className="px-3 py-2 text-left font-semibold text-[var(--plum)]">Recommended Site</th>
                      <th className="px-3 py-2 text-left font-semibold text-[var(--plum)]">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--plum-dark)]">
                    <tr className="border-b border-[var(--lilac-soft)]">
                      <td className="px-3 py-2 font-medium">0-4 weeks</td>
                      <td className="px-3 py-2"><strong>Axilla</strong> (electronic)</td>
                      <td className="px-3 py-2">Add 0.5°C for core estimate. Rectal if needed for accuracy.</td>
                    </tr>
                    <tr className="border-b border-[var(--lilac-soft)]">
                      <td className="px-3 py-2 font-medium">4 weeks - 5 years</td>
                      <td className="px-3 py-2"><strong>Axilla</strong> or <strong>Tympanic</strong></td>
                      <td className="px-3 py-2">Tympanic unreliable &lt;3 months. Pull pinna back and down.</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium">5+ years</td>
                      <td className="px-3 py-2"><strong>Tympanic</strong> or <strong>Oral</strong></td>
                      <td className="px-3 py-2">Pull pinna back and up. Oral: under tongue, lips closed.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800"><strong>Fever:</strong> ≥38°C (any method) requires assessment. &lt;3 months with fever = urgent review.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800"><strong>Tympanic tip:</strong> Gently pull ear - back/down (&lt;1yr) or back/up (&gt;1yr) to straighten canal.</p>
                </div>
              </div>
            </div>

            {/* Oxygen Saturation Section */}
            <div>
              <h3 className="font-semibold text-[var(--plum-dark)] mb-3 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-[var(--purple)]" /> Oxygen Saturation (SpO2)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                  <h4 className="font-medium text-[var(--plum)] mb-2">Probe Placement by Age</h4>
                  <ul className="space-y-2 text-sm text-[var(--plum-dark)]">
                    <li><strong>Newborn/Infant:</strong> Foot (wrap-around) or hand</li>
                    <li><strong>Toddler:</strong> Finger or toe (paediatric probe)</li>
                    <li><strong>Older child:</strong> Finger (adult probe often fits)</li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="font-medium text-amber-800 mb-2">Tips for Accurate Reading</h4>
                  <ul className="space-y-1 text-sm text-amber-900">
                    <li>• Warm cold peripheries first</li>
                    <li>• Remove nail polish</li>
                    <li>• Ensure good waveform on monitor</li>
                    <li>• Wait for stable reading (30+ seconds)</li>
                    <li>• Poor perfusion = unreliable reading</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Capillary Refill Section */}
            <div>
              <h3 className="font-semibold text-[var(--plum-dark)] mb-3 flex items-center gap-2">
                <CircleDot className="w-5 h-5 text-[var(--purple)]" /> Capillary Refill Time (CRT)
              </h3>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-emerald-800 mb-2">Technique</h4>
                    <ol className="space-y-1 text-sm text-emerald-900 list-decimal list-inside">
                      <li>Press on <strong>sternum</strong> (central) or <strong>fingertip</strong> (peripheral)</li>
                      <li>Apply pressure for <strong>5 seconds</strong></li>
                      <li>Release and count seconds to return to pink</li>
                      <li>Normal: <strong>&lt;2 seconds</strong> (or &lt;3s in newborns)</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-800 mb-2">Sites by Age</h4>
                    <ul className="space-y-1 text-sm text-emerald-900">
                      <li><strong>All ages:</strong> Sternum (most reliable, central)</li>
                      <li><strong>Infant:</strong> Sole of foot or palm</li>
                      <li><strong>Older child:</strong> Fingertip or nail bed</li>
                      <li><strong>Tip:</strong> Peripheral CRT affected by cold - use central if in doubt</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* General Tips */}
            <div className="bg-gradient-to-r from-[var(--purple)]/10 to-[var(--pink)]/10 rounded-xl p-4 border border-[var(--lavender)]">
              <h4 className="font-semibold text-[var(--plum)] mb-3">General Tips for Paediatric Observations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[var(--plum-dark)]">
                <ul className="space-y-1">
                  <li>• <strong>LOOK before touching</strong> - observe from end of bed first</li>
                  <li>• Work from <strong>least to most invasive</strong> (RR → HR → Temp → BP)</li>
                  <li>• Involve <strong>parents</strong> - child on lap, parent holds probe</li>
                  <li>• <strong>Explain</strong> in age-appropriate language</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Use <strong>distraction</strong> - bubbles, videos, toys</li>
                  <li>• <strong>Praise cooperation</strong> - stickers, certificates</li>
                  <li>• <strong>Document position</strong> (asleep/awake/crying)</li>
                  <li>• <strong>Trending</strong> is more important than single values</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Formula */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" /> Quick Calculation Formulas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Minimum Systolic BP</h3>
              <div className="bg-blue-50 rounded-lg p-3 text-center mb-2">
                <p className="text-lg font-mono font-bold text-blue-900">70 + (2 × age in years)</p>
              </div>
              <p className="text-sm text-blue-700">For children 1-10 years. Below this = hypotension (LATE sign!)</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Weight Estimation</h3>
              <div className="bg-blue-50 rounded-lg p-3 text-center mb-2">
                <p className="text-lg font-mono font-bold text-blue-900">(Age + 4) × 2</p>
              </div>
              <p className="text-sm text-blue-700">For children 1-10 years. Useful for drug calculations.</p>
            </div>
          </div>
        </div>

        {/* Red Flags Section */}
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200 mb-8">
          <h2 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Red Flags - When to Escalate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Respiratory</h3>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• RR &gt; 60 in any age (or &gt; 50 if &gt; 1 year)</li>
                <li>• SpO2 &lt; 92% on room air</li>
                <li>• Grunting, nasal flaring, severe recession</li>
                <li>• Apnoea &gt; 20 seconds</li>
                <li>• Silent chest, exhaustion</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Cardiovascular</h3>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• HR &lt; 60 in infants (or absent peripheral pulses)</li>
                <li>• Capillary refill &gt; 4-5 seconds</li>
                <li>• Hypotension (LATE sign - act fast!)</li>
                <li>• Mottled, pale, or grey skin colour</li>
                <li>• Reduced consciousness + poor perfusion</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-100 rounded-xl">
            <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
              <Info className="w-4 h-4" /> Remember: In children, call for help EARLY. Don&apos;t wait for hypotension - it means they&apos;re already decompensating!
            </p>
          </div>
        </div>

        {/* Clinical Pearls */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-8">
          <h2 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" /> Clinical Pearls for Practice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-900">
            <div className="bg-white rounded-xl p-4 border border-amber-100">
              <h3 className="font-semibold mb-2">Taking Observations</h3>
              <ul className="space-y-1">
                <li>• Count RR for a <strong>full 60 seconds</strong> (not 15s × 4)</li>
                <li>• Use age-appropriate BP cuff (2/3 upper arm)</li>
                <li>• Assess at rest - crying affects all parameters</li>
                <li>• Compare to previous readings, not just charts</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 border border-amber-100">
              <h3 className="font-semibold mb-2">Assessment Tips</h3>
              <ul className="space-y-1">
                <li>• <strong>Look</strong> before touching - observe work of breathing</li>
                <li>• Warm peripheries = good perfusion (usually)</li>
                <li>• A quiet, listless child may be sicker than a crying one</li>
                <li>• Parents know their child - trust their concerns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PEWS Link */}
        <div className="bg-[var(--lilac-soft)] rounded-2xl p-6 border border-[var(--lavender)] mb-8">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Related Resources
          </h2>
          <p className="text-sm text-[var(--plum-dark)] mb-4">
            Use these vital signs with early warning scores to identify deteriorating children early.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/hub/resources/pews-guide"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[var(--lavender)] text-[var(--purple)] hover:bg-[var(--purple)] hover:text-white transition-colors text-sm font-medium"
            >
              PEWS Guide <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </Link>
            <Link
              href="/hub/resources/ae-assessment"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[var(--lavender)] text-[var(--purple)] hover:bg-[var(--purple)] hover:text-white transition-colors text-sm font-medium"
            >
              A-E Assessment <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </Link>
            <Link
              href="/hub/resources/paeds-respiratory-assessment"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-[var(--lavender)] text-[var(--purple)] hover:bg-[var(--purple)] hover:text-white transition-colors text-sm font-medium"
            >
              Paeds Respiratory Assessment <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </Link>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Brain className="w-5 h-5" />
            {showQuiz ? 'Hide Quiz' : 'Test Your Knowledge'}
          </button>

          {showQuiz && (
            <div className="mt-6">
              <SelfTestQuiz
                questions={quizQuestions}
                title="Paediatric Vital Signs Quiz"
              />
            </div>
          )}
        </div>

        {/* Back to Hub */}
        <div className="text-center">
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-[var(--purple)] hover:text-[var(--plum)] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Nursing Hub
          </Link>
        </div>
      </main>
    </div>
  );
}
