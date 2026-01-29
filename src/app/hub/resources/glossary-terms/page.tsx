'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LockedContent from '@/components/LockedContent';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { Search, ArrowLeft, BookOpen, Sparkles, ChevronDown } from 'lucide-react';

// Glossary terms data
const glossaryTerms = {
  A: [
    { term: 'ABG', definition: 'Arterial Blood Gas - a test measuring oxygen, carbon dioxide, and pH levels in arterial blood.' },
    { term: 'ADLs', definition: 'Activities of Daily Living - basic self-care tasks like bathing, dressing, eating, and toileting.' },
    { term: 'Afebrile', definition: 'Without fever; normal body temperature.' },
    { term: 'Anaphylaxis', definition: 'A severe, potentially life-threatening allergic reaction requiring immediate treatment.' },
    { term: 'Anticoagulant', definition: 'Medication that prevents blood clots from forming (e.g., heparin, warfarin).' },
    { term: 'Apnoea', definition: 'Temporary cessation of breathing.' },
    { term: 'Aseptic technique', definition: 'Procedures used to prevent contamination by microorganisms.' },
  ],
  B: [
    { term: 'BD/BID', definition: 'Twice daily (bis die) - medication frequency.' },
    { term: 'Bradycardia', definition: 'Heart rate slower than 60 beats per minute in adults.' },
    { term: 'BM', definition: 'Blood glucose monitoring (from "Boehringer Mannheim" glucose meters).' },
    { term: 'BP', definition: 'Blood pressure - the force of blood against artery walls.' },
    { term: 'Bronchospasm', definition: 'Sudden constriction of bronchial muscles causing breathing difficulty.' },
  ],
  C: [
    { term: 'Cannula', definition: 'A thin tube inserted into the body to deliver or drain fluids.' },
    { term: 'Cardiac arrest', definition: 'When the heart stops beating effectively; requires immediate CPR.' },
    { term: 'Catheter', definition: 'A flexible tube inserted to drain fluids (e.g., urinary catheter).' },
    { term: 'CNS', definition: 'Central Nervous System - the brain and spinal cord.' },
    { term: 'Contraindication', definition: 'A condition that makes a particular treatment inadvisable.' },
    { term: 'CPAP', definition: 'Continuous Positive Airway Pressure - breathing support device.' },
    { term: 'Cyanosis', definition: 'Bluish discolouration of skin due to poor oxygenation.' },
  ],
  D: [
    { term: 'Defibrillation', definition: 'Electric shock to restore normal heart rhythm during cardiac arrest.' },
    { term: 'Diaphoresis', definition: 'Excessive sweating, often a sign of distress.' },
    { term: 'Dysphagia', definition: 'Difficulty swallowing.' },
    { term: 'Dyspnoea', definition: 'Difficulty breathing or shortness of breath.' },
  ],
  E: [
    { term: 'ECG/EKG', definition: 'Electrocardiogram - records electrical activity of the heart.' },
    { term: 'Emesis', definition: 'Vomiting.' },
    { term: 'Epidural', definition: 'Injection of anaesthetic into the epidural space of the spine.' },
    { term: 'Erythema', definition: 'Redness of the skin due to increased blood flow.' },
  ],
  F: [
    { term: 'Febrile', definition: 'Having a fever; elevated body temperature.' },
    { term: 'Fluid balance', definition: 'Monitoring intake vs output of fluids.' },
    { term: 'FBC', definition: 'Full Blood Count - blood test measuring different cell types.' },
  ],
  G: [
    { term: 'GCS', definition: 'Glasgow Coma Scale - assessment of consciousness level (3-15).' },
    { term: 'GTN', definition: 'Glyceryl Trinitrate - medication for angina.' },
    { term: 'Gastrostomy', definition: 'Surgical opening into the stomach for feeding tube placement.' },
  ],
  H: [
    { term: 'Haematemesis', definition: 'Vomiting blood.' },
    { term: 'Haematuria', definition: 'Blood in urine.' },
    { term: 'Hypertension', definition: 'High blood pressure (typically >140/90 mmHg).' },
    { term: 'Hypotension', definition: 'Low blood pressure (typically <90/60 mmHg).' },
    { term: 'Hypoxia', definition: 'Inadequate oxygen supply to tissues.' },
  ],
  I: [
    { term: 'IM', definition: 'Intramuscular - injection into muscle tissue.' },
    { term: 'IV', definition: 'Intravenous - into or within a vein.' },
    { term: 'Infiltration', definition: 'IV fluid leaking into surrounding tissue.' },
    { term: 'Intubation', definition: 'Inserting a tube into the airway to assist breathing.' },
  ],
  J: [
    { term: 'Jaundice', definition: 'Yellow discolouration of skin/eyes due to elevated bilirubin.' },
  ],
  K: [
    { term: 'Korotkoff sounds', definition: 'Sounds heard through stethoscope when measuring blood pressure.' },
  ],
  L: [
    { term: 'LFTs', definition: 'Liver Function Tests - blood tests assessing liver health.' },
    { term: 'Lumbar puncture', definition: 'Procedure to collect cerebrospinal fluid from the lower back.' },
  ],
  M: [
    { term: 'MDI', definition: 'Metered Dose Inhaler - device for delivering inhaled medications.' },
    { term: 'MRSA', definition: 'Methicillin-Resistant Staphylococcus Aureus - antibiotic-resistant bacteria.' },
    { term: 'Mucositis', definition: 'Inflammation of mucous membranes, often in mouth.' },
  ],
  N: [
    { term: 'NBM', definition: 'Nil By Mouth - no food or drink allowed.' },
    { term: 'NEWS/NEWS2', definition: 'National Early Warning Score - standardised assessment of patient deterioration.' },
    { term: 'NG tube', definition: 'Nasogastric tube - passed through nose to stomach.' },
    { term: 'Nystagmus', definition: 'Involuntary rhythmic eye movements.' },
  ],
  O: [
    { term: 'O2 sats', definition: 'Oxygen saturation - percentage of oxygen in blood (normal 94-98%).' },
    { term: 'Oedema', definition: 'Swelling caused by fluid accumulation in tissues.' },
    { term: 'OD', definition: 'Once daily (omni die) - medication frequency.' },
    { term: 'Oliguria', definition: 'Reduced urine output (<400ml/24hrs in adults).' },
  ],
  P: [
    { term: 'Pallor', definition: 'Pale appearance, often indicating poor circulation or anaemia.' },
    { term: 'Parenteral', definition: 'Administration by injection rather than orally.' },
    { term: 'PEEP', definition: 'Positive End-Expiratory Pressure - ventilator setting.' },
    { term: 'Phlebitis', definition: 'Inflammation of a vein.' },
    { term: 'PRN', definition: 'Pro Re Nata - as needed/when required.' },
    { term: 'Pyrexia', definition: 'Fever; elevated body temperature.' },
  ],
  Q: [
    { term: 'QDS', definition: 'Four times daily (quater die sumendum) - medication frequency.' },
  ],
  R: [
    { term: 'Resuscitation', definition: 'Emergency procedures to restore breathing and circulation.' },
    { term: 'Rigors', definition: 'Severe shivering, often associated with fever.' },
    { term: 'RR', definition: 'Respiratory Rate - breaths per minute.' },
  ],
  S: [
    { term: 'SBAR', definition: 'Situation, Background, Assessment, Recommendation - communication framework.' },
    { term: 'Sepsis', definition: 'Life-threatening response to infection causing organ dysfunction.' },
    { term: 'SpO2', definition: 'Peripheral oxygen saturation measured by pulse oximeter.' },
    { term: 'Stat', definition: 'Immediately (statim) - give medication right away.' },
    { term: 'Subcutaneous (SC)', definition: 'Under the skin - injection site.' },
    { term: 'Syncope', definition: 'Fainting; temporary loss of consciousness.' },
  ],
  T: [
    { term: 'Tachycardia', definition: 'Heart rate faster than 100 beats per minute in adults.' },
    { term: 'Tachypnoea', definition: 'Abnormally rapid breathing.' },
    { term: 'TDS', definition: 'Three times daily (ter die sumendum) - medication frequency.' },
    { term: 'Thrombosis', definition: 'Blood clot formation within a blood vessel.' },
    { term: 'Tracheostomy', definition: 'Surgical opening in the trachea for breathing.' },
  ],
  U: [
    { term: 'U&Es', definition: 'Urea and Electrolytes - blood test for kidney function.' },
    { term: 'Urinalysis', definition: 'Laboratory examination of urine.' },
  ],
  V: [
    { term: 'Venepuncture', definition: 'Puncturing a vein to obtain a blood sample.' },
    { term: 'VTE', definition: 'Venous Thromboembolism - includes DVT and PE.' },
  ],
  W: [
    { term: 'Waterlow score', definition: 'Assessment tool for pressure ulcer risk.' },
    { term: 'WCC', definition: 'White Cell Count - part of blood test.' },
  ],
};

export default function GlossaryPage() {
  const { isPro, isLoading } = useEntitlements();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);

  const alphabet = Object.keys(glossaryTerms) as (keyof typeof glossaryTerms)[];

  type GlossaryTerm = { term: string; definition: string };
  type FilteredTerms = Record<string, GlossaryTerm[]>;

  // Filter terms based on search
  const filteredTerms: FilteredTerms = searchQuery
    ? Object.entries(glossaryTerms).reduce((acc, [letter, terms]) => {
        const filtered = terms.filter(
          (t) =>
            t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.definition.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[letter] = filtered;
        }
        return acc;
      }, {} as FilteredTerms)
    : (glossaryTerms as FilteredTerms);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse text-[var(--purple)]">Loading...</div>
      </div>
    );
  }

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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--pink)] to-[var(--lavender)] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--purple)]/10 text-[var(--purple)]">
                PREMIUM
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-3">
            Nursing Glossary A-Z 📚
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg">
            Your complete reference guide to nursing terminology, abbreviations, and medical jargon.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {!isPro ? (
          <LockedContent
            title="Unlock the Full Glossary"
            description="Get instant access to our comprehensive A-Z nursing glossary with 100+ terms and definitions."
            features={[
              'Complete A-Z terminology',
              'Medical abbreviations',
              'Searchable database',
              'Regular updates',
            ]}
          />
        ) : (
          <>
            {/* Search */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--plum-dark)]/40" />
              <input
                type="text"
                placeholder="Search terms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--lilac-medium)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:border-transparent"
              />
            </div>

            {/* Alphabet quick links */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => {
                    setExpandedLetter(expandedLetter === letter ? null : letter);
                    document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                    filteredTerms[letter]
                      ? 'bg-[var(--lilac)] text-[var(--purple)] hover:bg-[var(--lavender)] hover:text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!filteredTerms[letter]}
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Glossary sections */}
            <div className="space-y-4">
              {Object.entries(filteredTerms).map(([letter, terms]) => (
                <div
                  key={letter}
                  id={`letter-${letter}`}
                  className="card"
                >
                  <button
                    onClick={() => setExpandedLetter(expandedLetter === letter ? null : letter)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center text-white font-bold">
                        {letter}
                      </span>
                      <span className="text-[var(--plum)] font-semibold">{terms.length} terms</span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--purple)] transition-transform ${
                        expandedLetter === letter ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {(expandedLetter === letter || searchQuery) && (
                    <div className="mt-4 space-y-3 border-t border-[var(--lilac)] pt-4">
                      {terms.map((item, idx) => (
                        <div key={idx} className="group">
                          <dt className="font-semibold text-[var(--plum)]">{item.term}</dt>
                          <dd className="text-[var(--plum-dark)]/70 text-sm mt-1">{item.definition}</dd>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {Object.keys(filteredTerms).length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--plum-dark)]/60">No terms match your search.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-[var(--purple)] font-medium hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--lilac)] px-6 py-8 text-center text-[var(--plum-dark)]/70 text-sm">
        <p>Made with love by Lauren</p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/privacy" className="hover:text-[var(--plum)]">Privacy</Link>
          <Link href="/terms" className="hover:text-[var(--plum)]">Terms</Link>
          <Link href="/hub" className="hover:text-[var(--plum)]">Hub</Link>
        </div>
      </footer>
    </div>
  );
}
