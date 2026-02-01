'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, Heart, Wind, Brain, Eye, Stethoscope, ChevronDown, ChevronUp, AlertCircle, Sparkles, Clock, BookOpen } from 'lucide-react';

const quizQuestions = [
  {
    question: 'What is the FIRST thing you should assess in the A-E approach?',
    options: ['Breathing rate', 'Airway patency', 'Blood pressure', 'Level of consciousness'],
    answer: 1,
    explanation: 'Always start with Airway. A patient who is talking has a patent airway, but always assess systematically.',
  },
  {
    question: 'A patient has a respiratory rate of 28 and SpO2 of 88% on room air. Which assessment is this?',
    options: ['A - Airway', 'B - Breathing', 'C - Circulation', 'D - Disability'],
    answer: 1,
    explanation: 'Respiratory rate and oxygen saturation are key Breathing (B) assessments. This patient needs oxygen.',
  },
  {
    question: 'What does AVPU stand for?',
    options: ['Alert, Verbal, Pain, Unconscious', 'Airway, Ventilation, Pulse, Urine', 'Alert, Voice, Pain, Unresponsive', 'Assess, Verify, Perform, Update'],
    answer: 2,
    explanation: 'AVPU is a quick consciousness assessment: Alert, responds to Voice, responds to Pain, Unresponsive.',
  },
  {
    question: 'A capillary refill time of 4 seconds indicates:',
    options: ['Normal perfusion', 'Possible poor peripheral perfusion', 'Excellent circulation', 'Need for immediate CPR'],
    answer: 1,
    explanation: 'Normal CRT is <2 seconds. A CRT of 4 seconds suggests poor peripheral perfusion and possible circulatory compromise.',
  },
  {
    question: 'In the E (Exposure) assessment, which is a red flag finding?',
    options: ['Warm skin', 'A surgical scar', 'Petechial/purpuric rash', 'Mild bruising'],
    answer: 2,
    explanation: 'A petechial or purpuric rash is a red flag - it can indicate meningococcal septicaemia or other serious conditions requiring urgent treatment.',
  },
  {
    question: 'When should you call for help during an A-E assessment?',
    options: ['Only after completing all 5 assessments', 'After the E assessment', 'Early if any concerns are found', 'Only if the patient becomes unconscious'],
    answer: 2,
    explanation: 'Call for help EARLY if you have any concerns. Treat problems as you find them - don\'t wait until you\'ve completed the whole assessment.',
  },
];

export default function AEAssessmentPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['A']));
  const [showQuiz, setShowQuiz] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleSection = (letter: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(letter)) {
      newExpanded.delete(letter);
    } else {
      newExpanded.add(letter);
    }
    setExpandedSections(newExpanded);
  };

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="min-h-screen bg-cream">
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
            <span>⚡ Quick Win</span>
            <span>•</span>
            <span>10 min interactive</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            A-E Assessment Framework 🏥
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Master the systematic approach to assessing acutely unwell patients. Interactive guide with clinical pearls and red flags.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* What is A-E? */}
        <div className="bg-white rounded-2xl p-6 border border-[var(--lilac-medium)] shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--purple)]" />
            What is the A-E Assessment?
          </h2>
          <p className="text-[var(--plum-dark)] mb-4">
            The A-E (or ABCDE) assessment is a <strong>systematic approach</strong> to rapidly assess and treat critically ill patients. It&apos;s used in emergency situations, during ward rounds, and whenever a patient deteriorates.
          </p>
          <div className="grid sm:grid-cols-5 gap-3 mb-4">
            <div className="text-center p-3 bg-red-50 rounded-xl border border-red-200">
              <div className="text-2xl font-bold text-red-600">A</div>
              <div className="text-xs text-red-700">Airway</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">B</div>
              <div className="text-xs text-orange-700">Breathing</div>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-xl border border-pink-200">
              <div className="text-2xl font-bold text-pink-600">C</div>
              <div className="text-xs text-pink-700">Circulation</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">D</div>
              <div className="text-xs text-purple-700">Disability</div>
            </div>
            <div className="text-center p-3 bg-teal-50 rounded-xl border border-teal-200">
              <div className="text-2xl font-bold text-teal-600">E</div>
              <div className="text-xs text-teal-700">Exposure</div>
            </div>
          </div>
          <p className="text-[var(--plum-dark)]/70 text-sm">
            Always assess in this order because airway problems kill fastest. A blocked airway kills in minutes, breathing problems in minutes to hours, circulation problems in hours.
          </p>
        </div>

        {/* Golden Rules */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)] mb-8">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--purple)]" />
            The Golden Rules
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-medium text-[var(--plum)]">Treat as you find</p>
                <p className="text-sm text-[var(--plum-dark)]/70">Don&apos;t wait until you&apos;ve finished - fix problems immediately</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium text-[var(--plum)]">Call for help early</p>
                <p className="text-sm text-[var(--plum-dark)]/70">If concerned at any point, get senior support</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium text-[var(--plum)]">Reassess constantly</p>
                <p className="text-sm text-[var(--plum-dark)]/70">After any intervention, go back to A</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <p className="font-medium text-[var(--plum)]">Use SBAR to escalate</p>
                <p className="text-sm text-[var(--plum-dark)]/70">Situation, Background, Assessment, Recommendation</p>
              </div>
            </div>
          </div>
        </div>

        {/* A - Airway */}
        <div className="bg-white rounded-2xl border border-[var(--lilac-medium)] overflow-hidden shadow-sm mb-4">
          <button
            onClick={() => toggleSection('A')}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--lilac-soft)] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
                <Wind className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--plum-dark)]">A - Airway</h3>
                <p className="text-sm text-[var(--plum-dark)]/60">Is the airway patent?</p>
              </div>
            </div>
            {expandedSections.has('A') ? <ChevronUp className="w-5 h-5 text-[var(--purple)]" /> : <ChevronDown className="w-5 h-5 text-[var(--purple)]" />}
          </button>

          {expandedSections.has('A') && (
            <div className="px-4 pb-4 space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-blue-800">
                  <strong>Quick check:</strong> Is the patient talking? If yes, their airway is patent. If no or struggling, assess using <strong>Look, Listen, Feel</strong>.
                </p>
              </div>

              {/* Look Listen Feel - Only for Airway */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                  <h4 className="font-semibold text-[var(--plum)] mb-3">👀 Look</h4>
                  <ul className="space-y-2 text-sm text-[var(--plum-dark)]">
                    <li>• Visible obstruction (vomit, blood, tongue)</li>
                    <li>• Swelling of lips, tongue, throat</li>
                    <li>• Facial/neck trauma</li>
                    <li>• Accessory muscle use</li>
                    <li>• Cyanosis</li>
                  </ul>
                </div>
                <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                  <h4 className="font-semibold text-[var(--plum)] mb-3">👂 Listen</h4>
                  <ul className="space-y-2 text-sm text-[var(--plum-dark)]">
                    <li>• <strong>Stridor</strong> - high pitched (upper obstruction)</li>
                    <li>• <strong>Gurgling</strong> - fluid in airway</li>
                    <li>• <strong>Snoring</strong> - tongue obstruction</li>
                    <li>• <strong>Silence</strong> - complete obstruction!</li>
                  </ul>
                </div>
                <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                  <h4 className="font-semibold text-[var(--plum)] mb-3">✋ Feel</h4>
                  <ul className="space-y-2 text-sm text-[var(--plum-dark)]">
                    <li>• Air movement at mouth/nose</li>
                    <li>• Chest rise</li>
                    <li>• Tracheal position</li>
                  </ul>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Actions if obstructed
                </h4>
                <ul className="space-y-1 text-sm text-emerald-700">
                  <li>• Head tilt, chin lift (no C-spine concern)</li>
                  <li>• Jaw thrust (C-spine concern)</li>
                  <li>• Suction secretions</li>
                  <li>• Airway adjuncts (OPA/NPA)</li>
                  <li>• Call for anaesthetic help if severe</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Red Flags
                </h4>
                <p className="text-sm text-red-700">Stridor • Complete silence • Cyanosis • Inability to speak • Drooling (can&apos;t swallow)</p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Clinical Pearl
                </h4>
                <p className="text-sm text-amber-800">In anaphylaxis, airway swelling can progress rapidly. Give IM adrenaline early and call for help.</p>
              </div>
            </div>
          )}
        </div>

        {/* B - Breathing */}
        <div className="bg-white rounded-2xl border border-[var(--lilac-medium)] overflow-hidden shadow-sm mb-4">
          <button
            onClick={() => toggleSection('B')}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--lilac-soft)] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--plum-dark)]">B - Breathing</h3>
                <p className="text-sm text-[var(--plum-dark)]/60">Is breathing adequate?</p>
              </div>
            </div>
            {expandedSections.has('B') ? <ChevronUp className="w-5 h-5 text-[var(--purple)]" /> : <ChevronDown className="w-5 h-5 text-[var(--purple)]" />}
          </button>

          {expandedSections.has('B') && (
            <div className="px-4 pb-4 space-y-4">
              <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                <h4 className="font-semibold text-[var(--plum)] mb-3">📋 Assess</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--plum)] mb-2">Observations:</p>
                    <ul className="space-y-1 text-sm text-[var(--plum-dark)]">
                      <li>• <strong>Respiratory rate</strong> (count for 60s)</li>
                      <li>• <strong>SpO2</strong> (target 94-98%, 88-92% COPD)</li>
                      <li>• Work of breathing (see diagram)</li>
                      <li>• Chest expansion (equal?)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--plum)] mb-2">Auscultation:</p>
                    <ul className="space-y-1 text-sm text-[var(--plum-dark)]">
                      <li>• Air entry (present, reduced, absent?)</li>
                      <li>• Wheeze (bronchospasm)</li>
                      <li>• Crackles (fluid/infection)</li>
                      <li>• Silent areas (pneumothorax?)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Work of Breathing Diagram */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <h4 className="font-semibold text-orange-700 mb-4 text-center">🫁 Signs of Increased Work of Breathing</h4>
                
                {/* Cleaner list-based diagram */}
                <div className="max-w-md mx-auto">
                  <div className="flex items-start gap-4">
                    {/* Body illustration */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      {/* Head */}
                      <div className="w-14 h-14 rounded-full bg-orange-200 border-2 border-orange-400 flex items-center justify-center">
                        <span className="text-xl">😮</span>
                      </div>
                      {/* Neck */}
                      <div className="w-5 h-6 bg-orange-200 border-x-2 border-orange-400"></div>
                      {/* Chest */}
                      <div className="w-24 h-20 bg-orange-100 border-2 border-orange-400 rounded-t-lg relative">
                        <div className="absolute inset-2 border-2 border-dashed border-orange-300 rounded"></div>
                      </div>
                      {/* Abdomen */}
                      <div className="w-20 h-10 bg-orange-100 border-2 border-t-0 border-orange-400 rounded-b-lg"></div>
                    </div>
                    
                    {/* Labels list */}
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-orange-200 flex-1">
                          <strong className="text-orange-700 text-sm">Head bobbing</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-orange-200 flex-1">
                          <strong className="text-orange-700 text-sm">Nasal flaring</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-orange-200 flex-1">
                          <strong className="text-orange-700 text-sm">Tracheal tug</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-orange-200 flex-1">
                          <strong className="text-orange-700 text-sm">Accessory muscle use</strong>
                          <span className="text-orange-600 text-xs ml-1">(SCM, scalenes)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-orange-200 flex-1">
                          <strong className="text-orange-700 text-sm">Intercostal recession</strong>
                          <span className="text-orange-600 text-xs ml-1">(between ribs)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-orange-200 flex-1">
                          <strong className="text-orange-700 text-sm">Subcostal recession</strong>
                          <span className="text-orange-600 text-xs ml-1">(below ribs)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional info below diagram */}
                <div className="mt-6 pt-4 border-t border-orange-200">
                  <p className="text-sm text-orange-800 text-center mb-3">
                    <strong>Also watch for:</strong>
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="bg-white px-3 py-1 rounded-full border border-orange-300 text-orange-700">Tripod position</span>
                    <span className="bg-white px-3 py-1 rounded-full border border-orange-300 text-orange-700">Can&apos;t complete sentences</span>
                    <span className="bg-white px-3 py-1 rounded-full border border-orange-300 text-orange-700">Pursed lip breathing</span>
                    <span className="bg-white px-3 py-1 rounded-full border border-orange-300 text-orange-700">See-saw breathing</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Actions
                </h4>
                <ul className="space-y-1 text-sm text-emerald-700">
                  <li>• Give oxygen if SpO2 &lt;94% (or &lt;88% in COPD)</li>
                  <li>• Sit patient upright if conscious</li>
                  <li>• Nebulisers if bronchospasm</li>
                  <li>• Consider tension pneumothorax if tracheal deviation</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Red Flags
                </h4>
                <p className="text-sm text-red-700">RR &lt;8 or &gt;30 • SpO2 &lt;92% on O2 • Silent chest • Tracheal deviation • Exhaustion/can&apos;t speak</p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Clinical Pearl
                </h4>
                <p className="text-sm text-amber-800">Respiratory rate is often the first vital sign to change in a deteriorating patient. A &quot;silent chest&quot; in asthma is a pre-arrest sign - escalate immediately.</p>
              </div>
            </div>
          )}
        </div>

        {/* C - Circulation */}
        <div className="bg-white rounded-2xl border border-[var(--lilac-medium)] overflow-hidden shadow-sm mb-4">
          <button
            onClick={() => toggleSection('C')}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--lilac-soft)] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white">
                <Heart className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--plum-dark)]">C - Circulation</h3>
                <p className="text-sm text-[var(--plum-dark)]/60">Is circulation adequate?</p>
              </div>
            </div>
            {expandedSections.has('C') ? <ChevronUp className="w-5 h-5 text-[var(--purple)]" /> : <ChevronDown className="w-5 h-5 text-[var(--purple)]" />}
          </button>

          {expandedSections.has('C') && (
            <div className="px-4 pb-4 space-y-4">
              <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                <h4 className="font-semibold text-[var(--plum)] mb-3">📋 Assess</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--plum)] mb-2">Observations:</p>
                    <ul className="space-y-1 text-sm text-[var(--plum-dark)]">
                      <li>• <strong>Heart rate</strong> (rate, rhythm)</li>
                      <li>• <strong>Blood pressure</strong></li>
                      <li>• <strong>Capillary refill</strong> (&lt;2s normal)</li>
                      <li>• Urine output</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--plum)] mb-2">Examination:</p>
                    <ul className="space-y-1 text-sm text-[var(--plum-dark)]">
                      <li>• Skin colour (pale, mottled?)</li>
                      <li>• <strong>Temperature</strong> (core + peripheries)</li>
                      <li>• JVP (raised or flat?)</li>
                      <li>• Visible bleeding</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Actions
                </h4>
                <ul className="space-y-1 text-sm text-emerald-700">
                  <li>• Get IV access (x2 large bore if shocked)</li>
                  <li>• Take bloods (FBC, U&E, clotting, crossmatch)</li>
                  <li>• Fluid bolus if hypovolaemic (250ml, reassess)</li>
                  <li>• Control bleeding with direct pressure</li>
                  <li>• ECG if arrhythmia suspected</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Red Flags
                </h4>
                <p className="text-sm text-red-700">Systolic BP &lt;90 • HR &gt;130 or &lt;40 • CRT &gt;4 seconds • Oliguria • Altered consciousness</p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Clinical Pearl
                </h4>
                <p className="text-sm text-amber-800">Tachycardia is often the FIRST sign of shock. Young patients compensate well and can look fine until they suddenly crash. Don&apos;t forget hidden bleeding sources: chest, abdomen, pelvis, long bones.</p>
              </div>
            </div>
          )}
        </div>

        {/* D - Disability */}
        <div className="bg-white rounded-2xl border border-[var(--lilac-medium)] overflow-hidden shadow-sm mb-4">
          <button
            onClick={() => toggleSection('D')}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--lilac-soft)] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                <Brain className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--plum-dark)]">D - Disability</h3>
                <p className="text-sm text-[var(--plum-dark)]/60">What is their neurological status?</p>
              </div>
            </div>
            {expandedSections.has('D') ? <ChevronUp className="w-5 h-5 text-[var(--purple)]" /> : <ChevronDown className="w-5 h-5 text-[var(--purple)]" />}
          </button>

          {expandedSections.has('D') && (
            <div className="px-4 pb-4 space-y-4">
              <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                <h4 className="font-semibold text-[var(--plum)] mb-3">📋 Assess</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--plum)] mb-2">AVPU / GCS:</p>
                    <ul className="space-y-1 text-sm text-[var(--plum-dark)]">
                      <li>• <strong>A</strong>lert</li>
                      <li>• Responds to <strong>V</strong>oice</li>
                      <li>• Responds to <strong>P</strong>ain</li>
                      <li>• <strong>U</strong>nresponsive</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--plum)] mb-2">Check:</p>
                    <ul className="space-y-1 text-sm text-[var(--plum-dark)]">
                      <li>• <strong>Pupils</strong> (size, equal, reactive)</li>
                      <li>• <strong>Blood glucose</strong></li>
                      <li>• Limb movement/weakness</li>
                      <li>• Drug chart (opioids, sedatives?)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Actions
                </h4>
                <ul className="space-y-1 text-sm text-emerald-700">
                  <li>• Check blood glucose NOW</li>
                  <li>• Treat hypoglycaemia if &lt;4mmol/L</li>
                  <li>• Consider naloxone if opioid toxicity</li>
                  <li>• Recovery position if unconscious + patent airway</li>
                  <li>• Consider CT head if new neurology</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Red Flags
                </h4>
                <p className="text-sm text-red-700">GCS ≤8 (airway at risk) • Unequal/unreactive pupils • New focal weakness • BM &lt;3 • Prolonged seizure</p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Clinical Pearl
                </h4>
                <p className="text-sm text-amber-800">ALWAYS check glucose in altered consciousness - it&apos;s reversible! GCS ≤8 means the patient cannot protect their airway. Opioid overdose = pinpoint pupils + low RR → give naloxone.</p>
              </div>
            </div>
          )}
        </div>

        {/* E - Exposure */}
        <div className="bg-white rounded-2xl border border-[var(--lilac-medium)] overflow-hidden shadow-sm mb-8">
          <button
            onClick={() => toggleSection('E')}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--lilac-soft)] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white">
                <Eye className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--plum-dark)]">E - Exposure</h3>
                <p className="text-sm text-[var(--plum-dark)]/60">What else could be going on?</p>
              </div>
            </div>
            {expandedSections.has('E') ? <ChevronUp className="w-5 h-5 text-[var(--purple)]" /> : <ChevronDown className="w-5 h-5 text-[var(--purple)]" />}
          </button>

          {expandedSections.has('E') && (
            <div className="px-4 pb-4 space-y-4">
              <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                <h4 className="font-semibold text-[var(--plum)] mb-3">📋 Full Examination</h4>
                <ul className="space-y-2 text-sm text-[var(--plum-dark)]">
                  <li>• <strong>Fully expose</strong> (maintain dignity + warmth)</li>
                  <li>• Check for rashes (petechial, purpuric, urticarial)</li>
                  <li>• Wounds, surgical sites, drains</li>
                  <li>• Check the back (log roll if needed)</li>
                  <li>• Pressure areas</li>
                  <li>• <strong>Temperature</strong></li>
                </ul>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Actions
                </h4>
                <ul className="space-y-1 text-sm text-emerald-700">
                  <li>• Keep patient warm (prevent hypothermia)</li>
                  <li>• Document all findings</li>
                  <li>• Review charts, notes, drug chart</li>
                  <li>• Handover using SBAR</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Red Flags
                </h4>
                <p className="text-sm text-red-700">Non-blanching (petechial) rash • Temp &lt;35°C or &gt;40°C • Rapidly spreading redness • Signs of abuse</p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" /> Clinical Pearl
                </h4>
                <p className="text-sm text-amber-800">Petechial rash + fever = sepsis (possibly meningococcal) until proven otherwise. Don&apos;t forget to check the back - log roll if trauma suspected.</p>
              </div>
            </div>
          )}
        </div>

        {/* After Assessment Checklist */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--pink)]/10 rounded-2xl p-6 border border-[var(--lavender)] mb-8">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            ✅ After A-E Assessment Checklist
          </h2>
          <div className="space-y-3">
            {[
              'Reassess from A after any intervention',
              'Calculate NEWS2 score',
              'Escalate concerns using SBAR',
              'Document findings and actions',
              'Increase monitoring frequency if unwell',
              'Review again in 15-30 minutes',
            ].map((item, i) => {
              const id = `after-${i}`;
              return (
                <label key={id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedItems.has(id)}
                    onChange={() => toggleCheck(id)}
                    className="w-5 h-5 rounded border-2 border-[var(--purple)] text-[var(--purple)] focus:ring-[var(--purple)]"
                  />
                  <span className={`${checkedItems.has(id) ? 'text-[var(--plum-dark)]/50 line-through' : 'text-[var(--plum-dark)]'}`}>
                    {item}
                  </span>
                </label>
              );
            })}
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
                title="A-E Assessment Quiz"
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
