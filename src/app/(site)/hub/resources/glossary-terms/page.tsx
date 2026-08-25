'use client';

import { useState } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.gl-guide *, .gl-guide *::before, .gl-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.gl-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.gl-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.gl-back {
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
.gl-back:hover { color: var(--ink-soft); }

.gl-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.gl-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.gl-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.gl-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.gl-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  margin-bottom: 40px;
}
.gl-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}
.gl-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.gl-search {
  width: 100%;
  padding: 12px 18px;
  border: 0.5px solid var(--hairline-firm);
  background: var(--surface-page);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  color: var(--ink-strong);
  outline: none;
  margin-bottom: 24px;
  border-radius: 0;
}
.gl-search::placeholder { color: var(--ink-faint); }
.gl-search:focus { border-color: var(--border-strong); }

.gl-letter-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 40px;
}

.gl-letter-btn {
  width: 32px;
  height: 32px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gl-letter-btn-active {
  background: #1A1815;
  border: 0.5px solid #1A1815;
  color: #fff;
}
.gl-letter-btn-available {
  background: var(--surface-page);
  border: 0.5px solid var(--hairline-firm);
  color: var(--ink-mid);
}
.gl-letter-btn-available:hover {
  background: var(--surface-sunken);
}
.gl-letter-btn-disabled {
  background: var(--surface-sunken);
  border: 0.5px solid var(--hairline-soft);
  color: var(--ink-faint);
  cursor: default;
}

.gl-sections { display: flex; flex-direction: column; gap: 6px; }

.gl-letter-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 0.5px solid var(--hairline-firm);
  background: var(--surface-page);
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
}
.gl-letter-header:hover { background: var(--surface-sunken); }
.gl-letter-header-open { background: var(--surface-sunken) !important; }

.gl-letter-header-left { display: flex; align-items: center; gap: 14px; }
.gl-letter-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-style: italic;
  color: var(--ink-strong);
  line-height: 1;
}
.gl-letter-count {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}
.gl-letter-chevron { color: var(--ink-faint); font-size: 14px; line-height: 1; }

.gl-terms-panel {
  border-left: 0.5px solid var(--hairline-firm);
  border-right: 0.5px solid var(--hairline-firm);
  border-bottom: 0.5px solid var(--hairline-firm);
}

.gl-term-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  border-bottom: 0.5px solid var(--hairline-soft);
  padding: 0;
}
.gl-term-row:last-child { border-bottom: none; }

.gl-term-name {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-strong);
  border-right: 0.5px solid var(--hairline-soft);
  line-height: 1.45;
  display: flex;
  align-items: flex-start;
}

.gl-term-def {
  padding: 12px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  font-weight: 300;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
}

.gl-empty {
  text-align: center;
  padding: 60px 0;
  border: 0.5px solid var(--hairline-firm);
}
.gl-empty p { font-size: 14px; color: var(--ink-faint); margin-bottom: 12px; }
.gl-empty button {
  background: transparent;
  border: none;
  color: var(--ink-strong);
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

@media (max-width: 768px) {
  .gl-wrap { padding: 24px 20px 60px; }
  .gl-headline { font-size: 36px; }
  .gl-term-row { grid-template-columns: 1fr; }
  .gl-term-name { border-right: none; border-bottom: 0.5px solid var(--hairline-soft); padding-bottom: 6px; }
  .gl-term-def { padding-top: 6px; }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const glossaryTerms: Record<string, { term: string; definition: string }[]> = {
  A: [
    { term: 'ABG', definition: 'Arterial Blood Gas — a blood test taken from an artery that shows oxygen, carbon dioxide, and how acidic the blood is.' },
    { term: 'ADLs', definition: 'Activities of Daily Living — basic self-care tasks like bathing, dressing, eating, and toileting.' },
    { term: 'Afebrile', definition: 'Without fever; normal body temperature.' },
    { term: 'Anaphylaxis', definition: 'A severe, potentially life-threatening allergic reaction requiring immediate treatment.' },
    { term: 'Anticoagulant', definition: 'Medication that prevents blood clots from forming (e.g., heparin, warfarin).' },
    { term: 'Apnoea', definition: 'Temporary cessation of breathing.' },
    { term: 'Aseptic technique', definition: 'A clean technique used to stop germs getting into key equipment or body sites.' },
  ],
  B: [
    { term: 'BD/BID', definition: 'Twice daily (bis die) — medication frequency.' },
    { term: 'Bradycardia', definition: 'Heart rate slower than 60 beats per minute in adults.' },
    { term: 'BM', definition: 'Blood glucose monitoring (from "Boehringer Mannheim" glucose meters).' },
    { term: 'BP', definition: 'Blood pressure — the force of blood against artery walls.' },
    { term: 'Bronchospasm', definition: 'When the airways tighten suddenly, making breathing harder.' },
  ],
  C: [
    { term: 'Cannula', definition: 'A small plastic tube placed in a vein so fluids or medicines can be given.' },
    { term: 'Cardiac arrest', definition: 'When the heart stops beating effectively; requires immediate CPR.' },
    { term: 'Catheter', definition: 'A flexible tube inserted to drain fluids (e.g., urinary catheter).' },
    { term: 'CNS', definition: 'Central Nervous System — the brain and spinal cord.' },
    { term: 'Contraindication', definition: 'A reason why a treatment or medicine may be unsafe.' },
    { term: 'CPAP', definition: 'Continuous Positive Airway Pressure — breathing support that uses constant pressure to help keep the airways open.' },
    { term: 'Cyanosis', definition: 'Bluish discolouration of skin due to poor oxygenation.' },
  ],
  D: [
    { term: 'Defibrillation', definition: 'An electric shock given in some cardiac arrests to try to restore a safe heart rhythm.' },
    { term: 'Diaphoresis', definition: 'Heavy sweating, often because the body is stressed or unwell.' },
    { term: 'Dysphagia', definition: 'Difficulty swallowing.' },
    { term: 'Dyspnoea', definition: 'Difficulty breathing or shortness of breath.' },
  ],
  E: [
    { term: 'ECG/EKG', definition: "Electrocardiogram — a tracing that shows the heart's electrical activity." },
    { term: 'Emesis', definition: 'Vomiting.' },
    { term: 'Epidural', definition: 'Injection of anaesthetic into the epidural space of the spine.' },
    { term: 'Erythema', definition: 'Redness of the skin due to increased blood flow.' },
  ],
  F: [
    { term: 'Febrile', definition: 'Having a fever; elevated body temperature.' },
    { term: 'Fluid balance', definition: 'Monitoring intake vs output of fluids.' },
    { term: 'FBC', definition: 'Full Blood Count — a blood test that checks red cells, white cells, and platelets.' },
  ],
  G: [
    { term: 'GCS', definition: 'Glasgow Coma Scale — a score used to describe how awake and responsive someone is.' },
    { term: 'GTN', definition: 'Glyceryl Trinitrate — medication for angina.' },
    { term: 'Gastrostomy', definition: 'A feeding tube that goes directly into the stomach through the abdominal wall.' },
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
    { term: 'Korotkoff sounds', definition: 'The sounds you hear through the stethoscope when taking a manual blood pressure.' },
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
    { term: 'NBM', definition: 'Nil By Mouth — nothing to eat or drink.' },
    { term: 'NEWS/NEWS2', definition: 'National Early Warning Score — a score built from vital signs to show if a patient may be getting worse.' },
    { term: 'NG tube', definition: 'Nasogastric tube — a tube passed through the nose into the stomach.' },
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
    { term: 'Parenteral', definition: 'Given by injection rather than by mouth.' },
    { term: 'PEEP', definition: 'Positive End-Expiratory Pressure — a ventilator setting that helps keep the tiny air sacs in the lungs open.' },
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
    { term: 'SBAR', definition: 'Situation, Background, Assessment, Recommendation — a simple structure for handovers and escalation.' },
    { term: 'Sepsis', definition: 'Life-threatening response to infection causing organ dysfunction.' },
    { term: 'SpO2', definition: 'Peripheral oxygen saturation — the oxygen level reading shown on a pulse oximeter.' },
    { term: 'Stat', definition: 'Immediately (statim) — give medication right away.' },
    { term: 'Subcutaneous (SC)', definition: 'Under the skin — injection site.' },
    { term: 'Syncope', definition: 'Fainting; temporary loss of consciousness.' },
  ],
  T: [
    { term: 'Tachycardia', definition: 'Heart rate faster than 100 beats per minute in adults.' },
    { term: 'Tachypnoea', definition: 'Breathing faster than expected.' },
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null);

  type GlossaryTerm = { term: string; definition: string };
  type FilteredTerms = Record<string, GlossaryTerm[]>;

  const filteredTerms: FilteredTerms = searchQuery
    ? Object.entries(glossaryTerms).reduce((acc, [letter, terms]) => {
        const filtered = terms.filter(
          t =>
            t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.definition.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        if (filtered.length > 0) acc[letter] = filtered;
        return acc;
      }, {} as FilteredTerms)
    : (glossaryTerms as FilteredTerms);

  const allLetters = Object.keys(glossaryTerms);

  return (
    <div className="gl-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="gl-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="gl-back">
          <span>←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="gl-kicker">Nursing Terminology · Free Resource</p>
        <h1 className="gl-headline">Nursing Glossary A–Z</h1>
        <p className="gl-standfirst">
          A searchable plain-English glossary for the nursing words and abbreviations that blur together when you&apos;re revising.
        </p>
        <p className="gl-byline">The Nurse Lab · Children&apos;s Hub</p>
        <EditorialSaveButton
          hubItemId="nursing-glossary"
          hubItemTitle="Nursing Glossary A–Z"
        />

        <div className="gl-pearl">
          <p className="gl-pearl-label">Plain English</p>
          <p>This glossary keeps the real nursing terms but explains them in simpler language. If you recognise the word but cannot picture what it means in practice, start here.</p>
        </div>

        {/* Search */}
        <input
          type="text"
          className="gl-search"
          placeholder="Search a term, abbreviation, or definition..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        {/* Letter nav */}
        <div className="gl-letter-nav">
          {allLetters.map(letter => {
            const available = !!filteredTerms[letter];
            const isActive = expandedLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => {
                  if (!available) return;
                  setExpandedLetter(isActive ? null : letter);
                  document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`gl-letter-btn ${isActive ? 'gl-letter-btn-active' : available ? 'gl-letter-btn-available' : 'gl-letter-btn-disabled'}`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Glossary sections */}
        <div className="gl-sections">
          {Object.entries(filteredTerms).map(([letter, terms]) => (
            <div key={letter} id={`letter-${letter}`}>
              <button
                className={`gl-letter-header ${expandedLetter === letter || !!searchQuery ? 'gl-letter-header-open' : ''}`}
                onClick={() => setExpandedLetter(expandedLetter === letter ? null : letter)}
              >
                <div className="gl-letter-header-left">
                  <span className="gl-letter-numeral">{letter}</span>
                  <span className="gl-letter-count">{terms.length} term{terms.length !== 1 ? 's' : ''}</span>
                </div>
                <span className="gl-letter-chevron">{expandedLetter === letter || !!searchQuery ? '−' : '+'}</span>
              </button>

              {(expandedLetter === letter || !!searchQuery) && (
                <div className="gl-terms-panel">
                  {terms.map((item, idx) => (
                    <div key={idx} className="gl-term-row">
                      <div className="gl-term-name">{item.term}</div>
                      <div className="gl-term-def">{item.definition}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {Object.keys(filteredTerms).length === 0 && (
          <div className="gl-empty">
            <p>No terms match your search.</p>
            <button onClick={() => setSearchQuery('')}>Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}
