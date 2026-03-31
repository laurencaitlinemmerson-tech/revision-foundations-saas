'use client';

import { useState } from 'react';
import EditorialLayout from '@/components/EditorialLayout';

const glossaryTerms = {
  A: [
    { term: 'ABG', definition: 'Arterial Blood Gas — a test measuring oxygen, carbon dioxide, and pH levels in arterial blood.' },
    { term: 'ADLs', definition: 'Activities of Daily Living — basic self-care tasks like bathing, dressing, eating, and toileting.' },
    { term: 'Afebrile', definition: 'Without fever; normal body temperature.' },
    { term: 'Anaphylaxis', definition: 'A severe, potentially life-threatening allergic reaction requiring immediate treatment.' },
    { term: 'Anticoagulant', definition: 'Medication that prevents blood clots from forming (e.g., heparin, warfarin).' },
    { term: 'Apnoea', definition: 'Temporary cessation of breathing.' },
    { term: 'Aseptic technique', definition: 'Procedures used to prevent contamination by microorganisms.' },
  ],
  B: [
    { term: 'BD/BID', definition: 'Twice daily (bis die) — medication frequency.' },
    { term: 'Bradycardia', definition: 'Heart rate slower than 60 beats per minute in adults.' },
    { term: 'BM', definition: 'Blood glucose monitoring (from "Boehringer Mannheim" glucose meters).' },
    { term: 'BP', definition: 'Blood pressure — the force of blood against artery walls.' },
    { term: 'Bronchospasm', definition: 'Sudden constriction of bronchial muscles causing breathing difficulty.' },
  ],
  C: [
    { term: 'Cannula', definition: 'A thin tube inserted into the body to deliver or drain fluids.' },
    { term: 'Cardiac arrest', definition: 'When the heart stops beating effectively; requires immediate CPR.' },
    { term: 'Catheter', definition: 'A flexible tube inserted to drain fluids (e.g., urinary catheter).' },
    { term: 'CNS', definition: 'Central Nervous System — the brain and spinal cord.' },
    { term: 'Contraindication', definition: 'A condition that makes a particular treatment inadvisable.' },
    { term: 'CPAP', definition: 'Continuous Positive Airway Pressure — breathing support device.' },
    { term: 'Cyanosis', definition: 'Bluish discolouration of skin due to poor oxygenation.' },
  ],
  D: [
    { term: 'Defibrillation', definition: 'Electric shock to restore normal heart rhythm during cardiac arrest.' },
    { term: 'Diaphoresis', definition: 'Excessive sweating, often a sign of distress.' },
    { term: 'Dysphagia', definition: 'Difficulty swallowing.' },
    { term: 'Dyspnoea', definition: 'Difficulty breathing or shortness of breath.' },
  ],
  E: [
    { term: 'ECG/EKG', definition: 'Electrocardiogram — records electrical activity of the heart.' },
    { term: 'Emesis', definition: 'Vomiting.' },
    { term: 'Epidural', definition: 'Injection of anaesthetic into the epidural space of the spine.' },
    { term: 'Erythema', definition: 'Redness of the skin due to increased blood flow.' },
  ],
  F: [
    { term: 'Febrile', definition: 'Having a fever; elevated body temperature.' },
    { term: 'Fluid balance', definition: 'Monitoring intake vs output of fluids.' },
    { term: 'FBC', definition: 'Full Blood Count — blood test measuring different cell types.' },
  ],
  G: [
    { term: 'GCS', definition: 'Glasgow Coma Scale — assessment of consciousness level (3–15).' },
    { term: 'GTN', definition: 'Glyceryl Trinitrate — medication for angina.' },
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
    { term: 'IM', definition: 'Intramuscular — injection into muscle tissue.' },
    { term: 'IV', definition: 'Intravenous — into or within a vein.' },
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
    { term: 'LFTs', definition: 'Liver Function Tests — blood tests assessing liver health.' },
    { term: 'Lumbar puncture', definition: 'Procedure to collect cerebrospinal fluid from the lower back.' },
  ],
  M: [
    { term: 'MDI', definition: 'Metered Dose Inhaler — device for delivering inhaled medications.' },
    { term: 'MRSA', definition: 'Methicillin-Resistant Staphylococcus Aureus — antibiotic-resistant bacteria.' },
    { term: 'Mucositis', definition: 'Inflammation of mucous membranes, often in the mouth.' },
  ],
  N: [
    { term: 'NBM', definition: 'Nil By Mouth — no food or drink allowed.' },
    { term: 'NEWS/NEWS2', definition: 'National Early Warning Score — standardised assessment of patient deterioration.' },
    { term: 'NG tube', definition: 'Nasogastric tube — passed through nose to stomach.' },
    { term: 'Nystagmus', definition: 'Involuntary rhythmic eye movements.' },
  ],
  O: [
    { term: 'O2 sats', definition: 'Oxygen saturation — percentage of oxygen in blood (normal 94–98%).' },
    { term: 'Oedema', definition: 'Swelling caused by fluid accumulation in tissues.' },
    { term: 'OD', definition: 'Once daily (omni die) — medication frequency.' },
    { term: 'Oliguria', definition: 'Reduced urine output (<400 ml/24 hrs in adults).' },
  ],
  P: [
    { term: 'Pallor', definition: 'Pale appearance, often indicating poor circulation or anaemia.' },
    { term: 'Parenteral', definition: 'Administration by injection rather than orally.' },
    { term: 'PEEP', definition: 'Positive End-Expiratory Pressure — ventilator setting.' },
    { term: 'Phlebitis', definition: 'Inflammation of a vein.' },
    { term: 'PRN', definition: 'Pro Re Nata — as needed/when required.' },
    { term: 'Pyrexia', definition: 'Fever; elevated body temperature.' },
  ],
  Q: [
    { term: 'QDS', definition: 'Four times daily (quater die sumendum) — medication frequency.' },
  ],
  R: [
    { term: 'Resuscitation', definition: 'Emergency procedures to restore breathing and circulation.' },
    { term: 'Rigors', definition: 'Severe shivering, often associated with fever.' },
    { term: 'RR', definition: 'Respiratory Rate — breaths per minute.' },
  ],
  S: [
    { term: 'SBAR', definition: 'Situation, Background, Assessment, Recommendation — communication framework.' },
    { term: 'Sepsis', definition: 'Life-threatening response to infection causing organ dysfunction.' },
    { term: 'SpO2', definition: 'Peripheral oxygen saturation measured by pulse oximeter.' },
    { term: 'Stat', definition: 'Immediately (statim) — give medication right away.' },
    { term: 'Subcutaneous (SC)', definition: 'Under the skin — injection site.' },
    { term: 'Syncope', definition: 'Fainting; temporary loss of consciousness.' },
  ],
  T: [
    { term: 'Tachycardia', definition: 'Heart rate faster than 100 beats per minute in adults.' },
    { term: 'Tachypnoea', definition: 'Abnormally rapid breathing.' },
    { term: 'TDS', definition: 'Three times daily (ter die sumendum) — medication frequency.' },
    { term: 'Thrombosis', definition: 'Blood clot formation within a blood vessel.' },
    { term: 'Tracheostomy', definition: 'Surgical opening in the trachea for breathing.' },
  ],
  U: [
    { term: 'U&Es', definition: 'Urea and Electrolytes — blood test for kidney function.' },
    { term: 'Urinalysis', definition: 'Laboratory examination of urine.' },
  ],
  V: [
    { term: 'Venepuncture', definition: 'Puncturing a vein to obtain a blood sample.' },
    { term: 'VTE', definition: 'Venous Thromboembolism — includes DVT and PE.' },
  ],
  W: [
    { term: 'Waterlow score', definition: 'Assessment tool for pressure ulcer risk.' },
    { term: 'WCC', definition: 'White Cell Count — part of blood test.' },
  ],
};

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);

  type GlossaryTerm = { term: string; definition: string };
  type FilteredTerms = Record<string, GlossaryTerm[]>;

  const filteredTerms: FilteredTerms = searchQuery
    ? Object.entries(glossaryTerms).reduce((acc, [letter, terms]) => {
        const filtered = terms.filter(
          t => t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
               t.definition.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) acc[letter] = filtered;
        return acc;
      }, {} as FilteredTerms)
    : (glossaryTerms as FilteredTerms);

  return (
    <EditorialLayout
      kicker="Nursing Terminology · Free Resource"
      title="Nursing Glossary A–Z"
      standfirst="Your complete reference to nursing terminology, abbreviations, and medical jargon — searchable and organised alphabetically."
      byline="The Nurse Lab · Children's Hub"
    >
      {/* Search */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search terms or definitions…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '0.5px solid #ccc8c0',
                borderRadius: '8px',
                fontFamily: 'Source Serif 4, serif',
                fontSize: '14px',
                color: '#1A1815',
                background: '#FAFAF8',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Letter nav */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '32px' }}>
            {(Object.keys(glossaryTerms) as string[]).map(letter => {
              const available = !!filteredTerms[letter];
              return (
                <button
                  key={letter}
                  onClick={() => {
                    if (!available) return;
                    setExpandedLetter(expandedLetter === letter ? null : letter);
                    document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    width: '32px',
                    height: '32px',
                    border: available ? '0.5px solid #ccc8c0' : '0.5px solid #e8e4df',
                    borderRadius: '2px',
                    background: expandedLetter === letter ? '#301906' : available ? '#FAFAF8' : '#f5f3f0',
                    color: expandedLetter === letter ? '#fff' : available ? '#301906' : '#ccc',
                    fontFamily: 'Source Serif 4, serif',
                    fontSize: '12px',
                    cursor: available ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Glossary sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(filteredTerms).map(([letter, terms]) => (
              <div key={letter} id={`letter-${letter}`}>
                <button
                  onClick={() => setExpandedLetter(expandedLetter === letter ? null : letter)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: expandedLetter === letter ? '#f5f0e8' : '#FAFAF8',
                    border: '0.5px solid #ccc8c0',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    textAlign: 'left' as const,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontStyle: 'italic', color: '#301906', lineHeight: 1 }}>{letter}</span>
                    <span style={{ fontFamily: 'Source Serif 4, serif', fontSize: '12px', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{terms.length} term{terms.length !== 1 ? 's' : ''}</span>
                  </div>
                  <span style={{ color: '#999', fontSize: '16px' }}>{expandedLetter === letter ? '−' : '+'}</span>
                </button>

                {(expandedLetter === letter || !!searchQuery) && (
                  <div style={{ borderLeft: '0.5px solid #ccc8c0', borderRight: '0.5px solid #ccc8c0', borderBottom: '0.5px solid #ccc8c0', borderRadius: '0 0 2px 2px', padding: '16px' }}>
                    {terms.map((item, idx) => (
                      <div key={idx} style={{ borderBottom: idx < terms.length - 1 ? '0.5px solid #e8e4df' : 'none', paddingBottom: idx < terms.length - 1 ? '12px' : 0, marginBottom: idx < terms.length - 1 ? '12px' : 0 }}>
                        <dt style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 600, fontSize: '14px', color: '#1A1815', marginBottom: '3px' }}>{item.term}</dt>
                        <dd style={{ fontFamily: 'Source Serif 4, serif', fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>{item.definition}</dd>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {Object.keys(filteredTerms).length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ fontFamily: 'Source Serif 4, serif', fontSize: '14px', color: '#999' }}>No terms match your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                style={{ marginTop: '12px', background: 'transparent', border: 'none', color: '#301906', fontFamily: 'Source Serif 4, serif', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear search
              </button>
            </div>
      )}
    </EditorialLayout>
  );
}
