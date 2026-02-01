'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Shield, Droplets, Hand, AlertTriangle, CheckCircle2, Lightbulb, Syringe, Bug, Sparkles, Clock, XCircle, Printer } from 'lucide-react';
import SelfTestQuiz from '@/components/SelfTestQuiz';

const quizQuestions = [
  {
    question: 'How long should alcohol hand rub be applied for?',
    options: ['10 seconds', '20-30 seconds', '40-60 seconds', '2 minutes'],
    answer: 1,
    explanation: 'Alcohol hand rub should be applied for 20-30 seconds, ensuring all areas of the hands are covered.',
  },
  {
    question: 'When should you wash with soap and water instead of using alcohol gel?',
    options: ['When your hands look clean', 'When caring for C. diff patients or visibly soiled hands', 'Never - gel is always better', 'Only before eating'],
    answer: 1,
    explanation: 'Alcohol gel does NOT kill C. diff spores. Use soap and water when hands are visibly soiled or after caring for patients with diarrhoea/vomiting.',
  },
  {
    question: 'What does MRSA stand for?',
    options: ['Multiple Resistant Skin Allergy', 'Methicillin-Resistant Staphylococcus Aureus', 'Micro-Resistant Staph Infection', 'Medication-Related Skin Abscess'],
    answer: 1,
    explanation: 'MRSA is Methicillin-Resistant Staphylococcus Aureus - a bacteria resistant to many common antibiotics.',
  },
  {
    question: 'Which type of isolation requires a negative pressure room?',
    options: ['Contact isolation', 'Droplet isolation', 'Airborne isolation', 'Protective isolation'],
    answer: 2,
    explanation: 'Airborne isolation (e.g., TB, measles, chickenpox) requires negative pressure rooms to prevent spread through air currents.',
  },
  {
    question: 'What is the chain of infection?',
    options: ['A type of bacterial infection', 'The sequence of events required for infection to spread', 'A list of antibiotic treatments', 'The order of PPE application'],
    answer: 1,
    explanation: 'The chain of infection describes the 6 links needed for infection: organism, reservoir, exit, transmission, entry, susceptible host.',
  },
  {
    question: 'After a needlestick injury, when should you attend occupational health?',
    options: ['Within the next week', 'Within 24 hours', 'Within 1 hour', 'Only if you feel unwell'],
    answer: 2,
    explanation: 'Needlestick injuries need URGENT assessment - ideally within 1 hour - as HIV post-exposure prophylaxis must start within 72 hours to be effective.',
  },
  {
    question: 'What colour bag are clinical waste items disposed in?',
    options: ['Black', 'Yellow/Orange', 'Clear', 'Blue'],
    answer: 1,
    explanation: 'Clinical waste goes in yellow or orange bags (varies by trust). Black is domestic waste, clear is recycling.',
  },
  {
    question: 'Which of the following does NOT require contact precautions?',
    options: ['MRSA', 'C. difficile', 'Common cold', 'Scabies'],
    answer: 2,
    explanation: 'Common cold is spread by droplets, not contact. MRSA, C. diff, and scabies all require contact precautions.',
  },
];

export default function Y1InfectionControlPage() {
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                FREE
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Y1 Infection Prevention & Control 🛡️
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Essential IPC knowledge to protect patients, yourself, and colleagues from healthcare-associated infections.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {/* Quick Reference Card */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Bug className="w-5 h-5 text-[var(--purple)]" />
            Chain of Infection
          </h2>
          <p className="text-[var(--plum-dark)]/80 mb-4 text-sm">
            Breaking ANY link in the chain prevents infection spread:
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {[
              { step: '1. Pathogen', color: 'bg-red-100 text-red-800 border-red-200' },
              { step: '→', color: 'text-gray-400' },
              { step: '2. Reservoir', color: 'bg-orange-100 text-orange-800 border-orange-200' },
              { step: '→', color: 'text-gray-400' },
              { step: '3. Exit', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
              { step: '→', color: 'text-gray-400' },
              { step: '4. Transmission', color: 'bg-green-100 text-green-800 border-green-200' },
              { step: '→', color: 'text-gray-400' },
              { step: '5. Entry', color: 'bg-blue-100 text-blue-800 border-blue-200' },
              { step: '→', color: 'text-gray-400' },
              { step: '6. Host', color: 'bg-purple-100 text-purple-800 border-purple-200' },
            ].map((item, i) => (
              item.step === '→' ? (
                <span key={i} className={item.color}>→</span>
              ) : (
                <span key={i} className={`px-3 py-1.5 rounded-full border ${item.color}`}>{item.step}</span>
              )
            ))}
          </div>
        </div>

        {/* Hand Hygiene Section */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Hand className="w-6 h-6 text-blue-500" />
            Hand Hygiene - The Most Important IPC Measure
          </h2>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">WHO 5 Moments for Hand Hygiene 🖐️</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { num: '1', text: 'BEFORE touching a patient', why: 'Protect patient from your germs' },
                  { num: '2', text: 'BEFORE clean/aseptic procedure', why: 'Protect patient from germs entering body' },
                  { num: '3', text: 'AFTER body fluid exposure risk', why: 'Protect yourself and environment' },
                  { num: '4', text: 'AFTER touching a patient', why: 'Protect yourself and environment' },
                  { num: '5', text: 'AFTER touching patient surroundings', why: 'Protect yourself and environment' },
                ].map((moment) => (
                  <div key={moment.num} className="bg-white rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">{moment.num}</span>
                      <span className="font-medium text-blue-800 text-sm">{moment.text}</span>
                    </div>
                    <p className="text-xs text-blue-700/70 ml-8">{moment.why}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Soap & Water (40-60 seconds)
                </h3>
                <p className="text-sm text-blue-800/80 mb-2">Use when:</p>
                <ul className="text-sm text-blue-800/80 space-y-1">
                  <li>• Hands are visibly soiled</li>
                  <li>• After using the toilet</li>
                  <li>• Caring for patients with C. diff or norovirus</li>
                  <li>• After removing gloves (if hands are dirty)</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Alcohol Gel (20-30 seconds)
                </h3>
                <p className="text-sm text-blue-800/80 mb-2">Use when:</p>
                <ul className="text-sm text-blue-800/80 space-y-1">
                  <li>• Hands are visibly clean</li>
                  <li>• Between patient contacts</li>
                  <li>• Before and after putting on gloves</li>
                  <li>• Quick decontamination needed</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Ayliffe Hand Washing Technique</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
                {[
                  { step: 1, desc: 'Palm to palm' },
                  { step: 2, desc: 'Backs of hands' },
                  { step: 3, desc: 'Interlace fingers' },
                  { step: 4, desc: 'Backs of fingers' },
                  { step: 5, desc: 'Thumbs' },
                  { step: 6, desc: 'Fingertips' },
                ].map((s) => (
                  <div key={s.step} className="bg-blue-50 rounded-lg p-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold mx-auto mb-1">{s.step}</div>
                    <p className="text-xs text-blue-800">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PPE Section */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-500" />
            Personal Protective Equipment (PPE)
          </h2>
          
          <div className="space-y-4">
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-3">Types of PPE & When to Use</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <p className="font-semibold text-emerald-700 mb-2">🧤 Gloves</p>
                  <ul className="text-sm text-emerald-800/80 space-y-1">
                    <li>• Contact with blood/body fluids</li>
                    <li>• Non-intact skin or mucous membranes</li>
                    <li>• Change between procedures</li>
                    <li>• Remove before touching clean surfaces</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <p className="font-semibold text-emerald-700 mb-2">👗 Aprons</p>
                  <ul className="text-sm text-emerald-800/80 space-y-1">
                    <li>• Direct patient care activities</li>
                    <li>• Risk of splashing</li>
                    <li>• Decontamination of equipment</li>
                    <li>• Single-use, dispose after each patient</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <p className="font-semibold text-emerald-700 mb-2">😷 Masks (Fluid-Resistant Surgical)</p>
                  <ul className="text-sm text-emerald-800/80 space-y-1">
                    <li>• Droplet precautions (flu, COVID)</li>
                    <li>• Procedures generating splashes</li>
                    <li>• Within 1m of symptomatic patient</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-emerald-200">
                  <p className="font-semibold text-emerald-700 mb-2">🥽 Eye Protection</p>
                  <ul className="text-sm text-emerald-800/80 space-y-1">
                    <li>• Risk of splash to face/eyes</li>
                    <li>• Aerosol-generating procedures</li>
                    <li>• Airborne precautions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">✅ Donning Order (Putting ON)</p>
                <ol className="text-sm text-emerald-800/80 space-y-1 list-decimal list-inside">
                  <li>Hand hygiene</li>
                  <li>Apron/Gown</li>
                  <li>Mask (fit-check!)</li>
                  <li>Eye protection</li>
                  <li>Gloves (over gown cuffs)</li>
                </ol>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">❌ Doffing Order (Taking OFF)</p>
                <ol className="text-sm text-red-800/80 space-y-1 list-decimal list-inside">
                  <li>Gloves (most contaminated)</li>
                  <li>Hand hygiene</li>
                  <li>Apron/Gown</li>
                  <li>Eye protection</li>
                  <li>Mask (by straps only)</li>
                  <li>Hand hygiene AGAIN</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Aseptic Technique */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Aseptic Non-Touch Technique (ANTT)
          </h2>
          
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">Key Principles</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { title: 'Key-Parts', desc: 'Parts of equipment that must remain sterile (e.g., needle tip, catheter tip)' },
                  { title: 'Key-Sites', desc: 'Patient body sites that must be protected (e.g., wound, insertion site)' },
                  { title: 'Non-Touch', desc: 'Never touch key-parts or key-sites directly' },
                  { title: 'Aseptic Field', desc: 'Clean working area to protect key-parts' },
                ].map((p) => (
                  <div key={p.title} className="bg-white rounded-lg p-3 border border-purple-200">
                    <p className="font-semibold text-purple-700 text-sm">{p.title}</p>
                    <p className="text-xs text-purple-800/80">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">Standard vs Surgical ANTT</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="font-semibold text-purple-700 mb-2">Standard ANTT</p>
                  <p className="text-xs text-purple-800/80 mb-2">For simpler procedures with few key-parts</p>
                  <ul className="text-xs text-purple-800/70 space-y-1">
                    <li>• IM/SC injections</li>
                    <li>• IV cannulation</li>
                    <li>• Simple wound dressing</li>
                    <li>• Blood glucose monitoring</li>
                  </ul>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="font-semibold text-purple-700 mb-2">Surgical ANTT</p>
                  <p className="text-xs text-purple-800/80 mb-2">For complex procedures with multiple key-parts</p>
                  <ul className="text-xs text-purple-800/70 space-y-1">
                    <li>• Urinary catheterisation</li>
                    <li>• Central line care</li>
                    <li>• Complex wound care</li>
                    <li>• Lumbar puncture assistance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transmission Routes */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Bug className="w-6 h-6 text-orange-500" />
            Transmission Routes & Precautions
          </h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">🤝 Contact</h3>
                <p className="text-xs text-orange-800/80 mb-2">Direct/indirect touch</p>
                <p className="text-xs font-medium text-orange-700 mb-1">Examples:</p>
                <ul className="text-xs text-orange-800/70 space-y-0.5">
                  <li>• MRSA</li>
                  <li>• C. difficile</li>
                  <li>• Scabies</li>
                  <li>• Norovirus</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-orange-200">
                  <p className="text-xs font-medium text-orange-700">Precautions:</p>
                  <p className="text-xs text-orange-800/70">Gloves + apron, hand hygiene, isolation</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">💧 Droplet</h3>
                <p className="text-xs text-blue-800/80 mb-2">Large particles (&gt;5μm), fall within 1-2m</p>
                <p className="text-xs font-medium text-blue-700 mb-1">Examples:</p>
                <ul className="text-xs text-blue-800/70 space-y-0.5">
                  <li>• Influenza</li>
                  <li>• COVID-19</li>
                  <li>• Pertussis</li>
                  <li>• Meningococcal</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <p className="text-xs font-medium text-blue-700">Precautions:</p>
                  <p className="text-xs text-blue-800/70">Surgical mask, eye protection if close</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">💨 Airborne</h3>
                <p className="text-xs text-purple-800/80 mb-2">Small particles (&lt;5μm), remain suspended</p>
                <p className="text-xs font-medium text-purple-700 mb-1">Examples:</p>
                <ul className="text-xs text-purple-800/70 space-y-0.5">
                  <li>• TB (pulmonary)</li>
                  <li>• Measles</li>
                  <li>• Chickenpox</li>
                  <li>• COVID-19 (AGPs)</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <p className="text-xs font-medium text-purple-700">Precautions:</p>
                  <p className="text-xs text-purple-800/70">FFP3/N95 mask, negative pressure room</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sharps Safety */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Syringe className="w-6 h-6 text-red-500" />
            Sharps Safety
          </h2>
          
          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">Golden Rules</h3>
              <ul className="space-y-2">
                {[
                  'NEVER re-cap needles',
                  'Use safety-engineered devices where available',
                  'Dispose IMMEDIATELY at point of use',
                  'Fill sharps bins to line (no more than ¾ full)',
                  'Person using sharp disposes of it (your sharp, your responsibility)',
                  'Do not pass sharps hand-to-hand',
                  'Use a kidney dish or neutral zone',
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-sm text-red-800">
                    <CheckCircle2 className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-300">
              <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Needlestick Injury - What to Do
              </h3>
              <ol className="text-sm text-red-800/80 space-y-1 list-decimal list-inside">
                <li><strong>Encourage bleeding</strong> - do NOT suck the wound</li>
                <li><strong>Wash</strong> with soap and running water</li>
                <li><strong>Cover</strong> with waterproof dressing</li>
                <li><strong>Report</strong> immediately to senior/manager</li>
                <li><strong>Occupational Health</strong> - attend ASAP (ideally within 1 hour)</li>
                <li><strong>Document</strong> - complete incident report (Datix)</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Common HCAIs */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <Bug className="w-6 h-6 text-amber-500" />
            Common Healthcare-Associated Infections (HCAIs)
          </h2>
          
          <div className="space-y-3">
            {[
              { name: 'MRSA', full: 'Methicillin-resistant Staphylococcus aureus', spread: 'Contact', key: 'Screening, decolonisation, contact precautions' },
              { name: 'C. diff', full: 'Clostridioides difficile', spread: 'Contact (spores)', key: 'Soap & water (not alcohol gel), isolation, antibiotic stewardship' },
              { name: 'VRE', full: 'Vancomycin-resistant Enterococci', spread: 'Contact', key: 'Contact precautions, environmental cleaning' },
              { name: 'E. coli', full: 'Gram-negative bacteraemia', spread: 'Various', key: 'UTI prevention, catheter care, hydration' },
              { name: 'Norovirus', full: 'Winter vomiting bug', spread: 'Contact/Faecal-oral', key: 'Soap & water, isolation, terminal clean' },
            ].map((inf) => (
              <div key={inf.name} className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-amber-800">{inf.name}</p>
                    <p className="text-xs text-amber-700/70">{inf.full}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-200 text-amber-800">{inf.spread}</span>
                </div>
                <p className="text-sm text-amber-800/80 mt-2">
                  <strong>Key:</strong> {inf.key}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Isolation */}
        <div className="card">
          <h2 className="text-xl text-[var(--plum)] mb-4 flex items-center gap-2">
            <XCircle className="w-6 h-6 text-pink-500" />
            Isolation & Source Isolation
          </h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                <h3 className="font-semibold text-pink-800 mb-2">Source Isolation</h3>
                <p className="text-sm text-pink-800/80 mb-2">Patient has infection - protect others</p>
                <ul className="text-xs text-pink-800/70 space-y-1">
                  <li>• Infectious patient in single room</li>
                  <li>• Door closed (airborne = negative pressure)</li>
                  <li>• PPE before entry, remove before leaving</li>
                  <li>• Dedicated equipment</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Protective Isolation</h3>
                <p className="text-sm text-blue-800/80 mb-2">Patient vulnerable - protect them</p>
                <ul className="text-xs text-blue-800/70 space-y-1">
                  <li>• Immunocompromised patients</li>
                  <li>• Positive pressure room (if available)</li>
                  <li>• No visitors with infections</li>
                  <li>• Strict hand hygiene</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference - Timing */}
        <div className="bg-gradient-to-br from-[var(--purple)]/10 to-[var(--lavender)]/20 rounded-2xl p-6 border border-[var(--lavender)]">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--purple)]" />
            Quick Timing Reference
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { action: 'Alcohol hand rub', time: '20-30 seconds' },
              { action: 'Soap & water wash', time: '40-60 seconds' },
              { action: 'Surgical scrub', time: '3-5 minutes' },
              { action: 'Contact time for surface disinfectant', time: 'Check product label' },
              { action: 'Needlestick - attend Occ Health', time: 'Within 1 hour' },
              { action: 'Post-exposure prophylaxis (HIV)', time: 'Within 72 hours' },
            ].map((t) => (
              <div key={t.action} className="bg-white rounded-lg p-3">
                <p className="text-sm font-medium text-[var(--plum)]">{t.action}</p>
                <p className="text-xs text-[var(--plum-dark)]/70">{t.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
          <h2 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            IPC Red Flags - Escalate Immediately
          </h2>
          <ul className="space-y-2">
            {[
              'Suspected outbreak (2+ cases linked in time/place) - inform IPC team',
              'Needlestick injury from known HIV/Hep B/C patient - urgent occupational health',
              'Unexplained cluster of similar infections on ward',
              'Patient deteriorating despite treatment - consider resistant organism',
              'Healthcare worker with symptoms continuing to work',
              'Breach of isolation or PPE failure with high-risk organism',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Self-Test Quiz */}
        <SelfTestQuiz 
          title="Test Yourself: Infection Control" 
          questions={quizQuestions}
        />

        {/* Print button */}
        <div className="text-center print:hidden">
          <button 
            onClick={() => window.print()}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print This Guide
          </button>
        </div>

        {/* Back to Hub */}
        <div className="text-center pt-4">
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
