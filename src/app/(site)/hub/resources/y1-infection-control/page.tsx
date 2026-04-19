'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.ic-guide *, .ic-guide *::before, .ic-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ic-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.ic-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.ic-back {
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
.ic-back:hover { color: #555; }
.ic-back-arrow { font-style: normal; }

/* Masthead */
.ic-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.ic-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ic-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ic-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Pearl */
.ic-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.ic-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.ic-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step sections */
.ic-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.ic-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.ic-step-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.ic-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.ic-step-content {
  padding-left: 32px;
}

.ic-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.ic-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.ic-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ic-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ic-content-col:last-child { border-right: none; }

.ic-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.ic-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ic-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.ic-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* 2-column grid */
.ic-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ic-grid-2-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ic-grid-2-col:last-child { border-right: none; }

.ic-grid-2-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

/* Red flags */
.ic-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.ic-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ic-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Table */
.ic-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.ic-table th {
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
.ic-table th:last-child { border-right: none; }

.ic-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.ic-table td:last-child { border-right: none; }
.ic-table tr:last-child td { border-bottom: none; }
.ic-table td:first-child { font-weight: 400; color: #2C2A27; }

/* Section headings */
.ic-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 18px;
  padding-top: 24px;
  margin-top: 36px;
  padding-bottom: 16px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

/* Ordered list */
.ic-ordered-list {
  padding-left: 16px;
  font-size: 13px;
  color: #5A5750;
  font-weight: 300;
  line-height: 1.8;
  margin: 0;
}

/* Step colour system */
.ic-num-1 { color: #185FA5; }
.ic-badge-1 { background: #E6F1FB; color: #0C447C; }
.ic-num-2 { color: #0F6E56; }
.ic-badge-2 { background: #E1F5EE; color: #085041; }
.ic-num-3 { color: #993C1D; }
.ic-badge-3 { background: #FAECE7; color: #712B13; }
.ic-num-4 { color: #534AB7; }
.ic-badge-4 { background: #EEEDFE; color: #3C3489; }
.ic-num-5 { color: #5F5E5A; }
.ic-badge-5 { background: #F1EFE8; color: #444441; }
.ic-num-6 { color: #8B5E3C; }
.ic-badge-6 { background: #F5EDE5; color: #5C3D25; }

/* Responsive */
@media (max-width: 860px) {
  .ic-wrap { padding: 24px 20px 48px; }
  .ic-headline { font-size: 36px; }
  .ic-step { grid-template-columns: 1fr; }
  .ic-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 16px; padding-right: 0; margin-bottom: 20px; }
  .ic-step-numeral { font-size: 48px; }
  .ic-step-content { padding-left: 0; }
  .ic-content-grid { grid-template-columns: repeat(2, 1fr); }
  .ic-content-col:nth-child(2) { border-right: none; }
  .ic-content-col:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }
  .ic-grid-2 { grid-template-columns: 1fr; }
  .ic-grid-2-col { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .ic-grid-2-col:last-child { border-bottom: none; }
}
`;


// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    num: '1',
    colour: '1',
    name: 'Hand Hygiene',
    badge: 'Foundation',
    question: 'The single most important IPC measure — when and how?',
    cols: [
      {
        header: 'WHO 5 Moments',
        items: [
          'Before touching a patient',
          'Before a clean/aseptic procedure',
          'After body fluid exposure risk',
          'After touching a patient',
          'After touching patient surroundings',
        ],
      },
      {
        header: 'Soap & Water (40–60s)',
        items: [
          'Hands visibly soiled',
          'After using the toilet',
          'Caring for C. diff or norovirus patients',
          'After removing gloves if hands dirty',
        ],
      },
      {
        header: 'Alcohol Gel (20–30s)',
        items: [
          'Hands visibly clean',
          'Between patient contacts',
          'Before and after putting on gloves',
          'Quick decontamination needed',
        ],
      },
      {
        header: 'Ayliffe Technique',
        items: [
          'Palm to palm',
          'Backs of hands',
          'Between fingers',
          'Backs of fingers',
          'Thumbs',
          'Fingertips',
        ],
      },
    ],
    redFlags: [],
    pearl: 'Alcohol gel does NOT kill C. diff spores. If a patient has diarrhoea and vomiting, or is known C. diff positive, always use soap and running water instead.',
  },
  {
    num: '2',
    colour: '2',
    name: 'Personal Protective Equipment',
    badge: 'PPE',
    question: 'What to wear, when, and in what order?',
    cols: [
      {
        header: 'Gloves',
        items: [
          'Contact with blood/body fluids',
          'Non-intact skin or mucous membranes',
          'Change between procedures',
          'Single-use only',
        ],
      },
      {
        header: 'Aprons',
        items: [
          'Direct patient care',
          'Risk of splashing',
          'Decontamination of equipment',
          'Single-use per patient',
        ],
      },
      {
        header: 'Surgical Mask',
        items: [
          'Droplet precautions (flu, COVID)',
          'Procedures generating splashes',
          'Within 1m of symptomatic patient',
        ],
      },
      {
        header: 'Eye Protection',
        items: [
          'Risk of splash to face or eyes',
          'Aerosol-generating procedures',
          'Airborne precautions',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    num: '3',
    colour: '3',
    name: 'Transmission Routes & Precautions',
    badge: 'Spread',
    question: 'How do infections move from person to person?',
    cols: [
      {
        header: 'Contact',
        items: [
          'Direct touch or via surfaces',
          'MRSA, C. diff, scabies, norovirus',
          'Gloves + apron, isolation',
          'Hand hygiene after every contact',
        ],
      },
      {
        header: 'Droplet',
        items: [
          'Larger droplets fall within 1–2m',
          'Influenza, COVID-19, pertussis',
          'Surgical mask within range',
          'Eye protection if close contact',
        ],
      },
      {
        header: 'Airborne',
        items: [
          'Tiny particles stay in the air',
          'TB, measles, chickenpox',
          'FFP3/N95 mask required',
          'Negative pressure room',
        ],
      },
      {
        header: 'Chain of Infection',
        items: [
          'Germ (organism)',
          'Where it lives (reservoir)',
          'Way out (portal of exit)',
          'Way it spreads (transmission)',
          'Way in (portal of entry)',
          'Person who can catch it (host)',
        ],
      },
    ],
    redFlags: ['Suspected outbreak (2+ linked cases)', 'Breach of isolation with high-risk organism', 'Unexplained cluster of infections'],
    pearl: 'Breaking any link in the chain stops spread. In day-to-day nursing, standard precautions mostly try to block the spread step and the way in.',
  },
  {
    num: '4',
    colour: '4',
    name: 'Aseptic Non-Touch Technique',
    badge: 'ANTT',
    question: 'How do you protect the parts that must stay sterile?',
    cols: [
      {
        header: 'Key-Parts',
        items: [
          'Parts of equipment that must stay sterile',
          'Needle tip, catheter tip',
          'Do not touch these directly',
        ],
      },
      {
        header: 'Key-Sites',
        items: [
          'Part of the patient needing protection',
          'Wound or insertion site',
          'Keep clean throughout procedure',
        ],
      },
      {
        header: 'Standard ANTT',
        items: [
          'Simpler procedures',
          'IM or SC injections',
          'Cannulation',
          'Simple dressings',
        ],
      },
      {
        header: 'Surgical ANTT',
        items: [
          'More complex procedures',
          'Urinary catheterisation',
          'Central-line care',
          'Complex wounds',
        ],
      },
    ],
    redFlags: [],
    pearl: 'ANTT means protecting the important clean parts by not touching the bits that must stay sterile. Think of key-parts as the equipment and key-sites as the patient.',
  },
  {
    num: '5',
    colour: '5',
    name: 'Common Healthcare-Associated Infections',
    badge: 'HCAIs',
    question: 'Which organisms come up most often in hospital settings?',
    cols: [
      {
        header: 'MRSA',
        items: [
          'Spread by contact',
          'Screening and decolonisation',
          'Contact precautions',
          'Resistant to many common antibiotics',
        ],
      },
      {
        header: 'C. difficile',
        items: [
          'Spread by contact (spores)',
          'Soap and water, not alcohol gel',
          'Isolation required',
          'Antibiotic stewardship key',
        ],
      },
      {
        header: 'Norovirus',
        items: [
          'Contact and faecal-oral spread',
          'Soap and water only',
          'Isolation essential',
          'Terminal clean after discharge',
        ],
      },
      {
        header: 'TB & VRE',
        items: [
          'TB — airborne spread',
          'Negative pressure room + FFP3 mask',
          'VRE — contact spread',
          'Environmental cleaning critical',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    num: '6',
    colour: '6',
    name: 'Sharps Safety',
    badge: 'Safety',
    question: 'What are the rules, and what do you do after a needlestick?',
    cols: [
      {
        header: 'Golden Rules',
        items: [
          'Never re-cap needles',
          'Dispose at point of use',
          'Fill sharps bin to three-quarters max',
          'Your sharp, your responsibility',
        ],
      },
      {
        header: 'More Rules',
        items: [
          'Never hand-to-hand',
          'Use neutral zone in theatre',
          'Close bin when not in use',
          'Replace bin before overfull',
        ],
      },
      {
        header: 'Needlestick: Immediate',
        items: [
          'Encourage bleeding — do NOT suck',
          'Wash with soap and running water',
          'Cover with waterproof dressing',
          'Report to senior/manager immediately',
        ],
      },
      {
        header: 'Needlestick: Follow-Up',
        items: [
          'Urgent Occupational Health review',
          'Ideally within 1 hour',
          'HIV PEP must start within 72 hours',
          'Complete incident report (Datix)',
        ],
      },
    ],
    redFlags: ['Never re-cap needles', 'Dispose at point of use', 'Fill to three-quarters max', 'Your sharp — your responsibility', 'Never hand-to-hand', 'Use neutral zone'],
    pearl: null,
  },
];

const quizQuestions = [
  { question: 'How long should alcohol hand rub be applied for?', options: ['10 seconds', '20-30 seconds', '40-60 seconds', '2 minutes'], answer: 1, explanation: 'Alcohol hand rub should be applied for 20-30 seconds, ensuring all areas of the hands are covered.' },
  { question: 'When should you wash with soap and water instead of using alcohol gel?', options: ['When your hands look clean', 'When caring for C. diff patients or visibly soiled hands', 'Never — gel is always better', 'Only before eating'], answer: 1, explanation: 'Alcohol gel does NOT kill C. diff spores. Use soap and water when hands are visibly soiled or after caring for patients with diarrhoea/vomiting.' },
  { question: 'What does MRSA stand for?', options: ['Multiple Resistant Skin Allergy', 'Methicillin-Resistant Staphylococcus Aureus', 'Micro-Resistant Staph Infection', 'Medication-Related Skin Abscess'], answer: 1, explanation: 'MRSA is Methicillin-Resistant Staphylococcus Aureus — a bacteria resistant to many common antibiotics.' },
  { question: 'Which type of isolation requires a negative pressure room?', options: ['Contact isolation', 'Droplet isolation', 'Airborne isolation', 'Protective isolation'], answer: 2, explanation: 'Airborne isolation (e.g., TB, measles, chickenpox) requires negative pressure rooms to prevent spread through air currents.' },
  { question: 'What is the chain of infection?', options: ['A type of bacterial infection', 'The sequence of events required for infection to spread', 'A list of antibiotic treatments', 'The order of PPE application'], answer: 1, explanation: 'The chain of infection describes the 6 links needed for infection: organism, reservoir, exit, transmission, entry, susceptible host.' },
  { question: 'After a needlestick injury, when should you attend occupational health?', options: ['Within the next week', 'Within 24 hours', 'Within 1 hour', 'Only if you feel unwell'], answer: 2, explanation: 'Needlestick injuries need URGENT assessment — ideally within 1 hour — as HIV post-exposure prophylaxis must start within 72 hours to be effective.' },
  { question: 'What colour bag are clinical waste items disposed in?', options: ['Black', 'Yellow/Orange', 'Clear', 'Blue'], answer: 1, explanation: 'Clinical waste goes in yellow or orange bags (varies by trust). Black is domestic waste, clear is recycling.' },
  { question: 'Which of the following does NOT require contact precautions?', options: ['MRSA', 'C. difficile', 'Common cold', 'Scabies'], answer: 2, explanation: 'Common cold is spread by droplets, not contact. MRSA, C. diff, and scabies all require contact precautions.' },
];

// ─── Donning/Doffing data ─────────────────────────────────────────────────────

const DONNING = ['Hand hygiene', 'Apron/Gown', 'Mask (fit-check!)', 'Eye protection', 'Gloves (over gown cuffs)'];
const DOFFING = ['Gloves (most contaminated)', 'Hand hygiene', 'Apron/Gown', 'Eye protection', 'Mask (by straps only)', 'Hand hygiene AGAIN'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Y1InfectionControlPage() {
  return (
    <div className="ic-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ic-wrap">
        {/* Back nav */}
        <Link href="/hub" className="ic-back">
          <span className="ic-back-arrow">←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="ic-kicker">Year 1 Essentials · Free Resource</p>
        <h1 className="ic-headline">Infection Prevention &amp; Control</h1>
        <p className="ic-standfirst">
          The infection-control basics you use all the time, from hand hygiene to isolation, explained in student-friendly language.
        </p>
        <p className="ic-byline">The Nurse Lab · Nursing Hub</p>
        <EditorialSaveButton
          hubItemId="y1-infection-control"
          hubItemTitle="Infection Prevention & Control"
        />

        {/* Student note */}
        <div className="ic-pearl" style={{ marginBottom: '40px' }}>
          <p className="ic-pearl-label">Student note</p>
          <p>IPC stands for infection prevention and control. Most of this topic comes back to one practical question: what stops germs moving from one place, person, or surface to another?</p>
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.num} className="ic-step">
            {/* Sidebar */}
            <div className="ic-step-sidebar">
              <span className={`ic-step-numeral ic-num-${section.colour}`}>{section.num}</span>
              <span className={`ic-step-badge ic-badge-${section.colour}`}>{section.badge}</span>
            </div>

            {/* Content */}
            <div className="ic-step-content">
              <h2 className="ic-step-name">{section.name}</h2>
              <p className="ic-step-question">{section.question}</p>

              {/* 4-col grid */}
              <div className="ic-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="ic-content-col">
                    <p className="ic-col-header">{col.header}</p>
                    <ul className="ic-col-list">
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
                  <p className="ic-redflags-label">Red flags</p>
                  <div className="ic-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="ic-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="ic-pearl">
                  <p className="ic-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* PPE Donning & Doffing */}
        <h2 className="ic-section-title">PPE Order — Donning &amp; Doffing</h2>
        <div className="ic-grid-2" style={{ marginBottom: '32px' }}>
          <div className="ic-grid-2-col">
            <p className="ic-grid-2-header">Donning Order (Putting ON)</p>
            <ol className="ic-ordered-list">
              {DONNING.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="ic-grid-2-col">
            <p className="ic-grid-2-header">Doffing Order (Taking OFF)</p>
            <ol className="ic-ordered-list">
              {DOFFING.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* WHO 5 Moments table */}
        <h2 className="ic-section-title">WHO 5 Moments — Quick Reference</h2>
        <table className="ic-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Moment</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {[
              { num: '1', text: 'BEFORE touching a patient', why: 'Protect patient from your germs' },
              { num: '2', text: 'BEFORE a clean/aseptic procedure', why: 'Protect patient from germs entering body' },
              { num: '3', text: 'AFTER body fluid exposure risk', why: 'Protect yourself and environment' },
              { num: '4', text: 'AFTER touching a patient', why: 'Protect yourself and environment' },
              { num: '5', text: 'AFTER touching patient surroundings', why: 'Protect yourself and environment' },
            ].map(m => (
              <tr key={m.num}>
                <td>{m.num}</td>
                <td>{m.text}</td>
                <td>{m.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Timing reference */}
        <div className="ic-pearl" style={{ marginBottom: '32px' }}>
          <p className="ic-pearl-label">Timing reference</p>
          <p>Alcohol hand rub: 20–30 seconds. Soap and water: 40–60 seconds. Surgical scrub: 3–5 minutes. Needlestick: attend Occupational Health within 1 hour if you can. HIV post-exposure prophylaxis needs to start within 72 hours.</p>
        </div>

        {/* IPC Red Flags */}
        <p className="ic-redflags-label">IPC red flags — escalate immediately</p>
        <div className="ic-redflags" style={{ marginBottom: '40px' }}>
          {[
            'Suspected outbreak (2+ linked cases)',
            'Needlestick from known HIV/Hep B/C patient',
            'Unexplained cluster of infections',
            'Breach of isolation with high-risk organism',
            'Healthcare worker with symptoms working',
          ].map(flag => <span key={flag} className="ic-red-pill">{flag}</span>)}
        </div>

        {/* Quiz */}
        <h2 className="ic-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: Infection Control" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'WHO (2009)', title: 'Hand hygiene in healthcare — technical reference manual', href: 'https://www.who.int/teams/integrated-health-services/infection-prevention-control' },
          { citation: 'NICE (2017)', title: 'Healthcare-associated infections: prevention and control (NG125)', href: 'https://www.nice.org.uk/guidance/ng125' },
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
          { citation: 'UKHSA', title: 'Standard infection control precautions (SICPs)', href: 'https://www.gov.uk/government/organisations/uk-health-security-agency' },
        ]} />
      </div>
    </div>
  );
}
