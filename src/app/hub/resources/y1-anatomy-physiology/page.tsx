'use client';
/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'How many chambers does the heart have?', options: ['2', '3', '4', '6'], answer: 2 },
  { question: 'What is the normal adult resting heart rate?', options: ['40\u201360 bpm', '60\u2013100 bpm', '100\u2013120 bpm', '80\u2013140 bpm'], answer: 1 },
  { question: 'Where does gas exchange happen in the lungs?', options: ['Bronchi', 'Trachea', 'Alveoli', 'Larynx'], answer: 2 },
  { question: 'What is the normal SpO2 range on room air?', options: ['88\u201392%', '90\u201394%', '94\u201398%', '98\u2013100%'], answer: 2 },
  { question: 'What does oliguria mean?', options: ['Excessive urine output', 'Less than 400ml urine in 24 hours', 'No urine output', 'Cloudy urine'], answer: 1 },
  { question: 'Which part of the nervous system triggers "fight or flight"?', options: ['Parasympathetic', 'Sympathetic', 'Somatic', 'Central'], answer: 1 },
  { question: 'What is the normal serum potassium range?', options: ['1.5\u20132.5 mmol/L', '3.5\u20135.0 mmol/L', '5.5\u20137.0 mmol/L', '135\u2013145 mmol/L'], answer: 1 },
  { question: 'A GCS of 8 or below indicates what?', options: ['The patient is mildly drowsy', 'Serious concern about airway protection', 'Normal consciousness', 'Pain only'], answer: 1 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.ap-guide *, .ap-guide *::before, .ap-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ap-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.ap-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.ap-back {
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
.ap-back:hover { color: #555; }
.ap-back-arrow { font-style: normal; }

/* Masthead */
.ap-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.ap-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ap-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ap-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Pearl */
.ap-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.ap-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.ap-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step sections */
.ap-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}

.ap-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.ap-step-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.ap-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.ap-step-content {
  padding-left: 32px;
}

.ap-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.ap-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.ap-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ap-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ap-content-col:last-child { border-right: none; }

.ap-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.ap-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ap-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.ap-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Red flags */
.ap-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.ap-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ap-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Table */
.ap-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.ap-table th {
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
.ap-table th:last-child { border-right: none; }

.ap-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.ap-table td:last-child { border-right: none; }
.ap-table tr:last-child td { border-bottom: none; }
.ap-table td:first-child { font-weight: 400; color: #2C2A27; }

/* Section headings */
.ap-section-title {
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

/* Mono pathway */
.ap-mono {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
  font-size: 12px;
  color: #5A5750;
  background: #F5F3F0;
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 12px 16px;
  margin-bottom: 12px;
  letter-spacing: 0.02em;
}

.ap-body-text {
  font-size: 13px;
  color: #5A5750;
  font-weight: 300;
  line-height: 1.7;
  margin-bottom: 16px;
}

/* Step colour system */
.ap-num-1 { color: #185FA5; }
.ap-badge-1 { background: #E6F1FB; color: #0C447C; }
.ap-num-2 { color: #0F6E56; }
.ap-badge-2 { background: #E1F5EE; color: #085041; }
.ap-num-3 { color: #993C1D; }
.ap-badge-3 { background: #FAECE7; color: #712B13; }
.ap-num-4 { color: #534AB7; }
.ap-badge-4 { background: #EEEDFE; color: #3C3489; }
.ap-num-5 { color: #5F5E5A; }
.ap-badge-5 { background: #F1EFE8; color: #444441; }

/* Responsive */
@media (max-width: 860px) {
  .ap-wrap { padding: 28px 20px 60px; }
  .ap-headline { font-size: 36px; }
  .ap-step { grid-template-columns: 1fr; }
  .ap-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 16px; padding-right: 0; margin-bottom: 20px; }
  .ap-step-numeral { font-size: 48px; }
  .ap-step-content { padding-left: 0; }
  .ap-content-grid { grid-template-columns: repeat(2, 1fr); }
  .ap-content-col:nth-child(2) { border-right: none; }
  .ap-content-col:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }
}
`;


// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    num: '1',
    colour: '1',
    name: 'Cardiovascular System',
    badge: 'Heart',
    question: 'How does the heart pump blood around the body?',
    cols: [
      {
        header: 'The Heart',
        items: [
          '4 chambers: 2 atria (top), 2 ventricles (bottom)',
          'Right side — blood low in oxygen goes to lungs',
          'Left side — oxygen-rich blood goes to the body',
          '4 valves prevent backflow',
        ],
      },
      {
        header: 'Blood Vessels',
        items: [
          'Arteries — away from heart (thick walls)',
          'Veins — towards heart (have valves)',
          'Capillaries — gas exchange (1 cell thick)',
        ],
      },
      {
        header: 'Blood Pressure',
        items: [
          'Normal: <140/90 mmHg',
          'Hypertension: ≥140/90',
          'Hypotension: <90/60',
        ],
      },
      {
        header: 'Heart Rate',
        items: [
          'Normal: 60–100 bpm (adult)',
          'Tachycardia: >100 bpm',
          'Bradycardia: <60 bpm',
        ],
      },
    ],
    redFlags: ['Chest pain + sweating + pallor — possible MI'],
    pearl: null,
    pathway: 'SA Node → AV Node → Bundle of His → Bundle Branches → Purkinje Fibres',
    pathwayNote: 'This is the heart\'s electrical pathway. The signal starts in the SA node, pauses briefly at the AV node, then spreads through the ventricles so they squeeze in a coordinated way. It helps to think of it as the wiring that makes the pump work smoothly.',
  },
  {
    num: '2',
    colour: '2',
    name: 'Respiratory System',
    badge: 'Lungs',
    question: 'How do the lungs get oxygen in and carbon dioxide out?',
    cols: [
      {
        header: 'Upper Airways',
        items: [
          'Nose and nasal cavity (warms, filters, humidifies)',
          'Pharynx (throat)',
          'Larynx (voice box)',
        ],
      },
      {
        header: 'Lower Airways',
        items: [
          'Trachea (windpipe)',
          'Bronchi → Bronchioles',
          'Alveoli (gas exchange)',
        ],
      },
      {
        header: 'Oxygen Sats',
        items: [
          'Normal: 94–98% (room air)',
          'COPD target: 88–92%',
          '<94% — consider oxygen therapy',
        ],
      },
      {
        header: 'Respiratory Rate',
        items: [
          'Normal adult: 12–20 breaths/min',
          'Tachypnoea: >20/min',
          'Bradypnoea: <12/min',
        ],
      },
    ],
    redFlags: ['Hypoxia + confusion — urgent assessment'],
    pearl: 'Alveoli are the tiny air sacs where oxygen moves into the blood and carbon dioxide moves back out to be breathed away. There are millions of them, which gives the lungs a huge working surface. Surfactant is the slippery lining that helps stop them sticking shut.',
    pathway: null,
    pathwayNote: null,
  },
  {
    num: '3',
    colour: '3',
    name: 'Renal & Urinary System',
    badge: 'Kidneys',
    question: 'How do the kidneys filter blood and control fluid balance?',
    cols: [
      {
        header: 'Key Functions',
        items: [
          'Filter waste products from blood',
          'Regulate fluid balance',
          'Control blood pressure (renin)',
          'Produce erythropoietin (red blood cells)',
          'Activate vitamin D',
          'Balance electrolytes (Na⁺, K⁺, Ca²⁺)',
        ],
      },
      {
        header: 'Urine Output',
        items: [
          'Normal: >0.5 ml/kg/hr',
          'Oliguria: <400 ml/24hr',
          'Anuria: <100 ml/24hr',
        ],
      },
      {
        header: 'Kidney Function Markers',
        items: [
          'Rising creatinine — kidney strain',
          'eGFR <60 — possible CKD',
          'Rising urea — dehydration or damage',
        ],
      },
      {
        header: 'Filtration Steps',
        items: [
          'Filtration at glomerulus',
          'Reabsorption of useful substances',
          'Secretion of extra waste',
          'Excretion as urine',
        ],
      },
    ],
    redFlags: ['No urine + rising creatinine — AKI'],
    pearl: 'A simple way to think about the kidneys is: they filter the blood, keep what the body still needs, add extra waste into the urine, then send the urine out.',
    pathway: 'Filtration (glomerulus) → Reabsorption → Secretion → Excretion',
    pathwayNote: null,
  },
  {
    num: '4',
    colour: '4',
    name: 'Nervous System',
    badge: 'Neuro',
    question: 'How does the brain control and coordinate the body?',
    cols: [
      {
        header: 'Central (CNS)',
        items: [
          'Brain (cerebrum, cerebellum, brainstem)',
          'Spinal cord',
          'Protected by meninges and CSF',
        ],
      },
      {
        header: 'Peripheral (PNS)',
        items: [
          'Cranial nerves (12 pairs)',
          'Spinal nerves (31 pairs)',
          'Autonomic: sympathetic and parasympathetic',
        ],
      },
      {
        header: 'Sympathetic — Fight or Flight',
        items: [
          '↑ Heart rate and BP',
          'Dilates pupils',
          '↑ Blood to muscles',
          '↓ Digestion',
        ],
      },
      {
        header: 'Parasympathetic — Rest & Digest',
        items: [
          '↓ Heart rate and BP',
          'Constricts pupils',
          '↑ Digestion',
          '↑ Secretions',
        ],
      },
    ],
    redFlags: ['Sudden severe headache — possible SAH', 'Altered consciousness + fever — meningitis'],
    pearl: 'GCS is a simple way of describing how awake and responsive someone is by scoring eyes, voice, and movement. A fully alert patient scores 15. A score of 8 or below is serious and raises major concern about airway protection.',
    pathway: null,
    pathwayNote: null,
  },
  {
    num: '5',
    colour: '5',
    name: 'Homeostasis',
    badge: 'Balance',
    question: 'What does the body try to keep within a safe range?',
    cols: [
      {
        header: 'Temperature & Glucose',
        items: [
          'Body temp: 36.5–37.5°C',
          'Blood glucose (fasting): 4–7 mmol/L',
          'Blood pH: 7.35–7.45',
        ],
      },
      {
        header: 'Electrolytes',
        items: [
          'Sodium: 135–145 mmol/L',
          'Potassium: 3.5–5.0 mmol/L',
          'Calcium: 2.2–2.6 mmol/L',
        ],
      },
      {
        header: 'Urine & Fluid',
        items: [
          'Urine output: >0.5 ml/kg/hr',
          'Monitor fluid balance charts',
          'Watch for signs of dehydration',
        ],
      },
      {
        header: 'Why It Matters',
        items: [
          'Body constantly tries to self-correct',
          'Values outside range trigger concern',
          'Trends matter more than single readings',
          'Small changes can signal big problems',
        ],
      },
    ],
    redFlags: ['Hot red swollen limb + SOB — DVT/PE'],
    pearl: null,
    pathway: null,
    pathwayNote: null,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Y1AnatomyPhysiologyPage() {
  return (
    <div className="ap-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ap-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="ap-back">
          <span className="ap-back-arrow">←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="ap-kicker">Year 1 Essentials · Free Resource</p>
        <h1 className="ap-headline">Anatomy &amp; Physiology</h1>
        <p className="ap-standfirst">
          The body-system basics that make first year click, with the normal ranges and key ideas worth remembering first.
        </p>
        <p className="ap-byline">The Nurse Lab · Children&apos;s Hub</p>
        <EditorialSaveButton
          hubItemId="y1-anatomy-physiology"
          hubItemTitle="Anatomy & Physiology"
        />

        {/* Student note */}
        <div className="ap-pearl" style={{ marginBottom: '16px' }}>
          <p className="ap-pearl-label">Why A&amp;P matters in nursing</p>
          <p>Anatomy and physiology matters because it helps you answer the same bedside question again and again: what is this part of the body meant to be doing, and what changes when it starts going wrong?</p>
        </div>

        <div className="ap-pearl" style={{ marginBottom: '40px' }}>
          <p className="ap-pearl-label">Student note</p>
          <p>You do not need to memorise every tiny detail at once. Start with the job of the system, then learn the changes that matter clinically when that job is not being done properly.</p>
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.num} className="ap-step">
            {/* Sidebar */}
            <div className="ap-step-sidebar">
              <span className={`ap-step-numeral ap-num-${section.colour}`}>{section.num}</span>
              <span className={`ap-step-badge ap-badge-${section.colour}`}>{section.badge}</span>
            </div>

            {/* Content */}
            <div className="ap-step-content">
              <h2 className="ap-step-name">{section.name}</h2>
              <p className="ap-step-question">{section.question}</p>

              {/* Pathway if present — before grid */}
              {section.pathway && (
                <div className="ap-mono">{section.pathway}</div>
              )}
              {section.pathwayNote && (
                <p className="ap-body-text">{section.pathwayNote}</p>
              )}

              {/* 4-col grid */}
              <div className="ap-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="ap-content-col">
                    <p className="ap-col-header">{col.header}</p>
                    <ul className="ap-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Red flags */}
              {section.redFlags.length > 0 && (
                <>
                  <p className="ap-redflags-label">Red flags</p>
                  <div className="ap-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="ap-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="ap-pearl">
                  <p className="ap-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Homeostasis normal ranges table */}
        <h2 className="ap-section-title">Normal Ranges — Quick Reference</h2>
        <table className="ap-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Normal Range</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Body Temperature</td><td>36.5–37.5°C</td></tr>
            <tr><td>Blood Glucose (fasting)</td><td>4–7 mmol/L</td></tr>
            <tr><td>Blood pH</td><td>7.35–7.45</td></tr>
            <tr><td>Serum Sodium</td><td>135–145 mmol/L</td></tr>
            <tr><td>Serum Potassium</td><td>3.5–5.0 mmol/L</td></tr>
            <tr><td>Serum Calcium</td><td>2.2–2.6 mmol/L</td></tr>
            <tr><td>Urine Output</td><td>&gt;0.5 ml/kg/hr</td></tr>
          </tbody>
        </table>

        {/* Red flags summary */}
        <p className="ap-redflags-label">Red flags — where basic A&amp;P knowledge really matters</p>
        <div className="ap-redflags" style={{ marginBottom: '40px' }}>
          {[
            'Hypoxia + confusion — urgent assessment',
            'Chest pain + sweating + pallor — possible MI',
            'Sudden severe headache — possible SAH',
            'No urine + rising creatinine — AKI',
            'Hot red swollen limb + SOB — DVT/PE',
            'Altered consciousness + fever — meningitis',
          ].map((flag) => (
            <span key={flag} className="ap-red-pill">{flag}</span>
          ))}
        </div>

        <SelfTestQuiz title="Test Yourself: Anatomy & Physiology" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Waugh A & Grant A (2018)', title: 'Ross and Wilson Anatomy and Physiology in Health and Illness (13th edn)', href: 'https://www.elsevier.com/' },
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
          { citation: 'NICE', title: 'Clinical guidelines and quality standards', href: 'https://www.nice.org.uk/' },
        ]} />
      </div>
    </div>
  );
}
