'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { ArrowLeft, CheckCircle2, AlertTriangle, Lightbulb, Heart, Wind, Brain, Eye, Stethoscope, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';

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

interface AssessmentSection {
  letter: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  look: string[];
  listen: string[];
  feel: string[];
  actions: string[];
  redFlags: string[];
  pearls: string[];
}

const assessmentSections: AssessmentSection[] = [
  {
    letter: 'A',
    title: 'Airway',
    icon: <Wind className="w-6 h-6" />,
    color: 'from-red-500 to-red-600',
    look: [
      'Is the patient talking? (Patent airway if speaking clearly)',
      'Visible obstruction: secretions, vomit, blood, foreign body',
      'Swelling of tongue, lips, or throat',
      'Signs of trauma to face/neck',
      'Accessory muscle use in neck',
    ],
    listen: [
      'Stridor (high-pitched, upper airway obstruction)',
      'Gurgling (fluid in airway)',
      'Snoring (tongue obstruction)',
      'Silence (complete obstruction - most dangerous!)',
    ],
    feel: [
      'Air movement at mouth and nose',
      'Chest rise with breathing',
      'Tracheal position (deviation = emergency)',
    ],
    actions: [
      'Head tilt, chin lift (if no C-spine concern)',
      'Jaw thrust (if C-spine concern)',
      'Suction if secretions visible',
      'Airway adjuncts: OPA or NPA if needed',
      'Call for senior help if compromised',
    ],
    redFlags: [
      'No breath sounds',
      'Stridor',
      'Cyanosis',
      'Inability to speak',
      'Paradoxical chest movement',
    ],
    pearls: [
      'A talking patient has a patent airway - reassess regularly',
      'In trauma, always assume C-spine injury until cleared',
      'Anaphylaxis can cause rapid airway swelling - act fast',
    ],
  },
  {
    letter: 'B',
    title: 'Breathing',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'from-orange-500 to-orange-600',
    look: [
      'Respiratory rate (count for 60 seconds)',
      'Work of breathing: accessory muscles, recession',
      'Chest expansion: equal and bilateral?',
      'Skin colour: cyanosis (central or peripheral)',
      'Position: tripod position indicates distress',
    ],
    listen: [
      'Air entry: present, reduced, or absent?',
      'Wheeze (airways narrowing)',
      'Crackles/crepitations (fluid in alveoli)',
      'Bronchial breathing (consolidation)',
      'Pleural rub (inflammation)',
    ],
    feel: [
      'Chest expansion with hands',
      'Percussion: dull (fluid/consolidation) or hyperresonant (pneumothorax)',
      'Subcutaneous emphysema (crackling under skin)',
    ],
    actions: [
      'Measure SpO2 - target 94-98% (88-92% in COPD)',
      'Give oxygen if hypoxic',
      'Nebulisers/inhalers if bronchospasm',
      'Sit patient upright if conscious',
      'Prepare for chest decompression if tension pneumothorax suspected',
    ],
    redFlags: [
      'RR <8 or >30',
      'SpO2 <92% on oxygen',
      'Silent chest (asthma emergency)',
      'Tracheal deviation',
      'Exhaustion/can\'t complete sentences',
    ],
    pearls: [
      'RR is the vital sign that changes first in deterioration',
      'A "silent chest" in asthma is a pre-arrest sign',
      'In COPD, aim for SpO2 88-92% to avoid CO2 retention',
    ],
  },
  {
    letter: 'C',
    title: 'Circulation',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-pink-500 to-pink-600',
    look: [
      'Skin colour: pale, mottled, flushed?',
      'Visible bleeding or signs of blood loss',
      'JVP (raised in heart failure, flat in hypovolaemia)',
      'Peripheral oedema',
    ],
    listen: [
      'Heart sounds: rate, rhythm, murmurs',
      'Blood pressure (compare to baseline)',
    ],
    feel: [
      'Pulse: rate, rhythm, volume',
      'Capillary refill time (<2 seconds normal)',
      'Skin temperature: warm or cold peripheries?',
      'Peripheral pulses: present and equal?',
    ],
    actions: [
      'Establish IV access',
      'Take bloods: FBC, U&E, clotting, crossmatch if bleeding',
      'IV fluids if hypovolaemic (250ml bolus, reassess)',
      'Control visible bleeding with direct pressure',
      'ECG if arrhythmia suspected',
      'Catheterise to monitor urine output',
    ],
    redFlags: [
      'Systolic BP <90mmHg',
      'HR >130 or <40',
      'CRT >4 seconds',
      'Urine output <0.5ml/kg/hr',
      'Altered consciousness (sign of poor perfusion)',
    ],
    pearls: [
      'Tachycardia is often the first sign of shock',
      'Young patients compensate well - may crash suddenly',
      'Hidden bleeding: chest, abdomen, pelvis, long bones',
    ],
  },
  {
    letter: 'D',
    title: 'Disability',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    look: [
      'Level of consciousness: is patient Alert?',
      'Pupil size, symmetry, and reactivity',
      'Limb movement: any weakness or asymmetry?',
      'Signs of seizure activity',
    ],
    listen: [
      'Speech: confused, slurred, or inappropriate?',
      'Can they follow commands?',
    ],
    feel: [
      'Muscle tone: normal, increased, or floppy?',
      'Blood glucose (use glucometer)',
    ],
    actions: [
      'AVPU or GCS assessment',
      'Check blood glucose immediately',
      'Treat hypoglycaemia (<4mmol/L) with glucose',
      'Review medications: sedatives, opioids, insulin',
      'Consider CT head if new confusion/neurology',
      'Recovery position if unconscious with patent airway',
    ],
    redFlags: [
      'GCS ≤8 (airway at risk)',
      'Unequal or unreactive pupils',
      'New focal weakness',
      'Hypoglycaemia <3mmol/L',
      'Prolonged seizure >5 minutes',
    ],
    pearls: [
      'ALWAYS check glucose in altered consciousness',
      'GCS ≤8 = patient cannot protect their airway',
      'Opioid overdose: pinpoint pupils + low RR = give naloxone',
    ],
  },
  {
    letter: 'E',
    title: 'Exposure',
    icon: <Eye className="w-6 h-6" />,
    color: 'from-teal-500 to-teal-600',
    look: [
      'Fully expose patient (maintain dignity)',
      'Rashes: petechial, purpuric, urticarial',
      'Wounds, surgical sites, drains',
      'Pressure areas',
      'Swelling or deformities',
      'Check back and hidden areas (log roll if needed)',
    ],
    listen: [
      'Patient\'s concerns about pain or discomfort',
      'Any history of recent procedures or injuries',
    ],
    feel: [
      'Temperature (core)',
      'Tenderness, masses, or deformities',
      'Check calves for DVT signs',
    ],
    actions: [
      'Measure temperature',
      'Cover patient to prevent hypothermia',
      'Document all findings',
      'Review charts, notes, and drug chart',
      'Handover using SBAR',
    ],
    redFlags: [
      'Non-blanching (petechial) rash',
      'Temperature <35°C or >40°C',
      'Rapidly spreading redness/swelling',
      'Signs of abuse or self-harm',
    ],
    pearls: [
      'Don\'t forget to check the back - log roll if needed',
      'Petechial rash + fever = sepsis until proven otherwise',
      'Maintain dignity - only expose what you need to assess',
    ],
  },
];

export default function AEAssessmentPage() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['A']));
  const [showQuiz, setShowQuiz] = useState(false);

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const toggleSection = (letter: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(letter)) {
      newExpanded.delete(letter);
    } else {
      newExpanded.add(letter);
    }
    setExpandedSections(newExpanded);
  };

  const totalItems = assessmentSections.reduce((acc, section) => {
    return acc + section.look.length + section.listen.length + section.feel.length + section.actions.length;
  }, 0);

  const checkedCount = checkedItems.size;
  const progress = Math.round((checkedCount / totalItems) * 100);

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
            Master the systematic approach to assessing acutely unwell patients. Interactive checklist with clinical pearls and red flags.
          </p>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-sm border-b border-[var(--lilac)]">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--plum)]">Assessment Progress</span>
            <span className="text-sm text-[var(--plum-dark)]/60">{checkedCount}/{totalItems} checks</span>
          </div>
          <div className="h-2 bg-[var(--lilac)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--purple)] to-[var(--pink)] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Key Principle */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)] mb-8">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--purple)]" />
            The Golden Rule
          </h2>
          <p className="text-[var(--plum-dark)]">
            <strong>Treat problems as you find them.</strong> Don&apos;t wait until you&apos;ve completed the whole assessment. 
            If you find something wrong with Airway, fix it before moving to Breathing. Call for help early if concerned.
          </p>
        </div>

        {/* Assessment Sections */}
        <div className="space-y-4">
          {assessmentSections.map((section) => (
            <div
              key={section.letter}
              className="bg-white rounded-2xl border border-[var(--lilac-medium)] overflow-hidden shadow-sm"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.letter)}
                className="w-full flex items-center justify-between p-4 hover:bg-[var(--lilac-soft)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white`}>
                    {section.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-[var(--plum-dark)]">
                      {section.letter} - {section.title}
                    </h3>
                    <p className="text-sm text-[var(--plum-dark)]/60">
                      {section.look.length + section.listen.length + section.feel.length + section.actions.length} checks
                    </p>
                  </div>
                </div>
                {expandedSections.has(section.letter) ? (
                  <ChevronUp className="w-5 h-5 text-[var(--purple)]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[var(--purple)]" />
                )}
              </button>

              {/* Section Content */}
              {expandedSections.has(section.letter) && (
                <div className="px-4 pb-4 space-y-4">
                  
                  {/* Look */}
                  <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                    <h4 className="font-semibold text-[var(--plum)] mb-3 flex items-center gap-2">
                      👀 Look
                    </h4>
                    <div className="space-y-2">
                      {section.look.map((item, i) => {
                        const id = `${section.letter}-look-${i}`;
                        return (
                          <label key={id} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={checkedItems.has(id)}
                              onChange={() => toggleCheck(id)}
                              className="mt-1 w-5 h-5 rounded border-2 border-[var(--purple)] text-[var(--purple)] focus:ring-[var(--purple)]"
                            />
                            <span className={`text-sm ${checkedItems.has(id) ? 'text-[var(--plum-dark)]/50 line-through' : 'text-[var(--plum-dark)]'}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Listen */}
                  <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                    <h4 className="font-semibold text-[var(--plum)] mb-3 flex items-center gap-2">
                      👂 Listen
                    </h4>
                    <div className="space-y-2">
                      {section.listen.map((item, i) => {
                        const id = `${section.letter}-listen-${i}`;
                        return (
                          <label key={id} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={checkedItems.has(id)}
                              onChange={() => toggleCheck(id)}
                              className="mt-1 w-5 h-5 rounded border-2 border-[var(--purple)] text-[var(--purple)] focus:ring-[var(--purple)]"
                            />
                            <span className={`text-sm ${checkedItems.has(id) ? 'text-[var(--plum-dark)]/50 line-through' : 'text-[var(--plum-dark)]'}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feel */}
                  <div className="bg-[var(--lilac-soft)] rounded-xl p-4">
                    <h4 className="font-semibold text-[var(--plum)] mb-3 flex items-center gap-2">
                      ✋ Feel
                    </h4>
                    <div className="space-y-2">
                      {section.feel.map((item, i) => {
                        const id = `${section.letter}-feel-${i}`;
                        return (
                          <label key={id} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={checkedItems.has(id)}
                              onChange={() => toggleCheck(id)}
                              className="mt-1 w-5 h-5 rounded border-2 border-[var(--purple)] text-[var(--purple)] focus:ring-[var(--purple)]"
                            />
                            <span className={`text-sm ${checkedItems.has(id) ? 'text-[var(--plum-dark)]/50 line-through' : 'text-[var(--plum-dark)]'}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <h4 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Actions
                    </h4>
                    <div className="space-y-2">
                      {section.actions.map((item, i) => {
                        const id = `${section.letter}-action-${i}`;
                        return (
                          <label key={id} className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={checkedItems.has(id)}
                              onChange={() => toggleCheck(id)}
                              className="mt-1 w-5 h-5 rounded border-2 border-emerald-500 text-emerald-500 focus:ring-emerald-500"
                            />
                            <span className={`text-sm ${checkedItems.has(id) ? 'text-emerald-700/50 line-through' : 'text-emerald-700'}`}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Red Flags */}
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Red Flags - Act Immediately
                    </h4>
                    <ul className="space-y-1">
                      {section.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Clinical Pearls */}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Clinical Pearls
                    </h4>
                    <ul className="space-y-2">
                      {section.pearls.map((pearl, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                          <span className="text-amber-500">💡</span>
                          {pearl}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* After Assessment */}
        <div className="mt-8 bg-gradient-to-br from-[var(--purple)]/10 to-[var(--pink)]/10 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-3 flex items-center gap-2">
            ✅ After A-E Assessment
          </h2>
          <ul className="space-y-2 text-[var(--plum-dark)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-[var(--purple)]" />
              <span><strong>Reassess</strong> - Go back to A if any interventions made</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-[var(--purple)]" />
              <span><strong>Escalate</strong> - Use SBAR for handover to seniors</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-[var(--purple)]" />
              <span><strong>Document</strong> - Record findings, interventions, and response</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-[var(--purple)]" />
              <span><strong>Monitor</strong> - Increase observation frequency if concerns</span>
            </li>
          </ul>
        </div>

        {/* Quiz Section */}
        <div className="mt-8">
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

        {/* Reset Button */}
        {checkedCount > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setCheckedItems(new Set())}
              className="text-[var(--purple)] hover:text-[var(--plum)] text-sm font-medium"
            >
              Reset all checkboxes
            </button>
          </div>
        )}

        {/* Back to Hub */}
        <div className="mt-12 text-center">
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
