'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'What does NEX stand for?', options: ['Nose, Ear, Xiphisternum', 'Nasal, External, Xiphoid', 'Naso-Enteral Xray', 'None of the above'], answer: 0 },
  { question: 'What pH confirms gastric placement of an NG tube?', options: ['pH \u2264 7.0', 'pH \u2264 5.5', 'pH \u2264 3.0', 'pH \u2264 8.0'], answer: 1 },
  { question: 'Why is the whoosh test (auscultation) no longer accepted?', options: ['It takes too long', 'Air in the lung sounds similar to air in the stomach', 'It requires special equipment', 'It is too painful for children'], answer: 1 },
  { question: 'What minimum syringe size should you use to aspirate from an NG tube?', options: ['5ml', '10ml', '20ml', '2ml'], answer: 2 },
  { question: 'Why is a larger syringe used?', options: ['It holds more fluid', 'It creates gentler suction so the tube is less likely to collapse', 'It is easier to grip', 'It is hospital standard'], answer: 1 },
  { question: 'What type of pH paper should be used?', options: ['Litmus paper', 'Universal indicator paper', 'Approved pH indicator paper with 0.5 graduations', 'Any available test strip'], answer: 2 },
  { question: 'If no aspirate is obtained, what should you try first?', options: ['Remove and reinsert the tube', 'Request an X-ray immediately', 'Turn the patient onto their left side and wait', 'Use a smaller syringe'], answer: 2 },
  { question: 'When must NG tube placement be re-confirmed?', options: ['Only when first inserted', 'Before each bolus feed or medication', 'Once a day', 'Only after an X-ray'], answer: 1 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.ng-guide *, .ng-guide *::before, .ng-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.ng-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.ng-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.ng-back {
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
.ng-back:hover { color: #555; }
.ng-back-arrow { font-style: normal; }

/* Masthead */
.ng-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.ng-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ng-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ng-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Step sections */
.ng-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.ng-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.ng-step-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.ng-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.ng-step-content {
  padding-left: 32px;
}

.ng-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.ng-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* Content grids */
.ng-content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ng-content-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ng-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ng-content-col:last-child { border-right: none; }

.ng-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.ng-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ng-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.ng-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Numbered steps list */
.ng-numbered-list {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 18px;
}

.ng-numbered-item {
  display: grid;
  grid-template-columns: 32px 1fr;
  padding: 10px 0;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
}
.ng-numbered-item:last-child { border-bottom: none; }

.ng-numbered-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-style: italic;
  color: #ccc;
}

.ng-numbered-text {
  font-size: 13px;
  color: #2C2A27;
  line-height: 1.6;
  font-weight: 300;
}

/* Red flags */
.ng-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.ng-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ng-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Pearl */
.ng-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.ng-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.ng-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Safe/Unsafe pH cards */
.ng-ph-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ng-ph-safe {
  background: #EDFAEF;
  padding: 18px 20px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ng-ph-safe-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #1a6b2a;
  margin-bottom: 8px;
  font-weight: 400;
}
.ng-ph-safe-num {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-style: italic;
  color: #1a6b2a;
  margin-bottom: 6px;
}
.ng-ph-safe-text {
  font-size: 12px;
  color: #1a6b2a;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.ng-ph-unsafe {
  background: #FCEBEB;
  padding: 18px 20px;
}
.ng-ph-unsafe-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 8px;
  font-weight: 400;
}
.ng-ph-unsafe-num {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-style: italic;
  color: #A32D2D;
  margin-bottom: 6px;
}
.ng-ph-unsafe-text {
  font-size: 12px;
  color: #A32D2D;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Factors table */
.ng-factors {
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ng-factor-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}
.ng-factor-row:last-child { border-bottom: none; }

.ng-factor-name {
  font-size: 12px;
  color: #2C2A27;
  font-weight: 400;
  padding: 12px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.08);
}

.ng-factor-desc {
  font-size: 12px;
  color: #5A5750;
  font-weight: 300;
  line-height: 1.6;
  padding: 12px 18px;
  margin: 0;
}

/* Tube size table */
.ng-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 18px;
  font-size: 13px;
}

.ng-table th {
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
.ng-table th:last-child { border-right: none; }

.ng-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.ng-table td:last-child { border-right: none; }
.ng-table tr:last-child td { border-bottom: none; }
.ng-table td:first-child { font-weight: 400; color: #2C2A27; }

/* Dash list */
.ng-dash-list {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 18px;
}
.ng-dash-list li {
  font-size: 13px;
  color: #2C2A27;
  line-height: 1.6;
  font-weight: 300;
  padding: 6px 0 6px 14px;
  position: relative;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
}
.ng-dash-list li:last-child { border-bottom: none; }
.ng-dash-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Syringe info box */
.ng-info-box {
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 18px;
}

.ng-info-row {
  padding: 20px 22px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}
.ng-info-row:last-child { border-bottom: none; }

.ng-info-row-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 10px;
}

.ng-info-row-text {
  font-size: 13px;
  color: #2C2A27;
  line-height: 1.7;
  font-weight: 300;
  margin: 0;
}

/* Section headings */
.ng-section-title {
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

/* Step colour system */
.ng-numeral-1 { color: #185FA5; }
.ng-badge-1 { background: #E6F1FB; color: #0C447C; }
.ng-numeral-2 { color: #0F6E56; }
.ng-badge-2 { background: #E1F5EE; color: #085041; }
.ng-numeral-3 { color: #993C1D; }
.ng-badge-3 { background: #FAECE7; color: #712B13; }
.ng-numeral-4 { color: #534AB7; }
.ng-badge-4 { background: #EEEDFE; color: #3C3489; }
.ng-numeral-5 { color: #5F5E5A; }
.ng-badge-5 { background: #F1EFE8; color: #444441; }
.ng-numeral-6 { color: #8B5E3C; }
.ng-badge-6 { background: #F5EDE5; color: #6B4529; }

@media (max-width: 800px) {
  .ng-wrap { padding: 24px 18px 60px; }
  .ng-headline { font-size: 34px; }
  .ng-step { grid-template-columns: 1fr; }
  .ng-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 16px; padding-right: 0; margin-bottom: 20px; }
  .ng-step-content { padding-left: 0; }
  .ng-content-grid { grid-template-columns: 1fr; }
  .ng-content-grid-4 { grid-template-columns: repeat(2, 1fr); }
  .ng-content-col:nth-child(2) { border-right: none; }
  .ng-content-col:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }
  .ng-ph-grid { grid-template-columns: 1fr; }
  .ng-ph-safe { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .ng-factor-row { grid-template-columns: 1fr; }
  .ng-factor-name { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.06); }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDICATIONS = [
  {
    heading: 'Feeding',
    items: ['Unsafe swallow (dysphagia)', 'Premature infants', 'Faltering growth / poor oral intake', 'Post-operative nutrition', 'Neurological conditions'],
  },
  {
    heading: 'Medication',
    items: ['Child unable to take oral meds', 'Continuous infusions (e.g. omeprazole)', 'When accurate dosing is critical'],
  },
  {
    heading: 'Decompression',
    items: ['Bowel obstruction', 'Post-operative ileus', 'Gastric drainage', 'Reducing abdominal distension'],
  },
];

const NEX_STEPS = [
  'Place the tip of the tube at the nose.',
  'Loop the tube over the ear.',
  'Extend down to the xiphisternum, which means the bottom of the breastbone.',
  'Mark the tube at the nostril point or note the centimetre marking.',
];

const INSERTION_STEPS = [
  'Check the prescription and make sure the child actually needs the tube. Also check there are no reasons it would be unsafe, such as major facial trauma, known oesophageal problems, or recent nasal surgery.',
  'Gather equipment: the right size NG tube, a 20ml, 50ml, or 60ml syringe, approved pH paper, tape or a fixation device, water or water-based lubricant, gloves, and a bowl or receiver.',
  'Explain to the child and family. Use age-appropriate language. Gain consent. Position the child \u2014 upright or semi-upright if possible, with head in a neutral or slightly flexed position.',
  'Perform hand hygiene. Put on gloves.',
  'Measure using NEX and mark the tube.',
  'Lubricate the tip of the tube with water or water-based lubricant. Do not use oil-based lubricant.',
  'Insert the tube into the nostril that seems clearer. You can check this by gently closing one nostril at a time and asking the child to sniff. Advance it along the floor of the nose, aiming straight back rather than upwards.',
  'If the child is old enough, ask them to swallow sips of water as you advance the tube. In infants, use a dummy/pacifier to trigger the swallowing reflex.',
  'If you feel resistance, do not force it. Pull back a little and change the angle. Gagging is common and often settles, but coughing, going blue, or a sudden voice change means stop straight away.',
  'Advance to the marked length. Secure the tube to the cheek with tape or a nasal bridle/fixation device.',
  'Confirm placement before any use \u2014 see testing section below.',
];

const PH_STEPS = [
  'Attach a 20\u201360ml syringe to the end of the NG tube.',
  'Gently pull back to aspirate gastric contents. You need a small amount \u2014 even 0.5ml is enough.',
  'If no aspirate is obtained, do not panic. Work through the usual steps: turn the patient onto their left side, sit them up more if possible, move the tube in or out by 1 to 2 cm, then wait 15 to 30 minutes and try again. If you still cannot get aspirate after all of that, request an X-ray as a last resort to confirm placement.',
  'Apply the aspirate to approved pH indicator paper, not litmus paper.',
  'Read the pH against the colour chart immediately.',
  'Gastric placement is confirmed if pH is \u22645.5.',
  'If pH is >5.5, do NOT use the tube. Seek senior advice. An X-ray may be needed.',
];

const PH_FACTORS = [
  { factor: 'Antacids / PPIs / H2 blockers', effect: 'These medicines can make the stomach less acidic, so the pH may be above 5.5 even when the tube is in the right place. Those children often need X-ray confirmation.' },
  { factor: 'Recent feed', effect: 'Milk and formula make the stomach contents less acidic. Wait at least 1 hour after a feed before testing, or try before the next feed is due.' },
  { factor: 'Continuous feeds', effect: 'The pH may stay above 5.5 while feed is running all the time. A planned feeding break or an X-ray may be needed.' },
  { factor: 'Using litmus paper', effect: 'Litmus paper is not accurate enough for this. Use approved pH indicator paper with 0.5 graduations.' },
];

const TUBE_SIZES = [
  { age: 'Premature neonate', size: '5 Fr' },
  { age: 'Term neonate', size: '6 Fr' },
  { age: 'Infant (1\u201312 months)', size: '6\u20138 Fr' },
  { age: 'Toddler (1\u20133 years)', size: '8 Fr' },
  { age: 'Child (3\u201310 years)', size: '8\u201310 Fr' },
  { age: 'Adolescent', size: '10\u201312 Fr' },
];

const ONGOING_CHECKS = [
  'Before each bolus feed or medication',
  'At the start of each shift (for continuous feeds)',
  'After any episode of vomiting, retching, or coughing',
  'If the external length at the nostril has changed',
  'If the tube has been displaced or pulled at',
  'If there are any signs of respiratory distress',
];

const COMPLICATIONS = [
  'Pulmonary aspiration',
  'Oesophageal perforation',
  'Nasal trauma / epistaxis',
  'Tube misplacement in lung',
  'Aspiration pneumonia',
  'Skin breakdown at nostril',
  'Tube blockage',
];

const UNSAFE_METHODS = [
  'Whoosh test (auscultation)',
  'Bubbling in water',
  'Observing for respiratory distress alone',
  'Litmus paper',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NGTubeInsertionPage() {
  return (
    <div className="ng-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ng-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="ng-back">
          <span className="ng-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="ng-kicker">Clinical Skills &middot; Children&apos;s Nursing</p>
        <h1 className="ng-headline">NG Tube Insertion &amp; Testing</h1>
        <p className="ng-standfirst">
          A clearer guide to NG tubes in children, including the parts students get asked about most: NEX, pH testing, and what to do if you cannot get aspirate.
        </p>
        <p className="ng-byline">The Nurse Lab &middot; Children&apos;s Hub</p>
        <EditorialSaveButton
          hubItemId="ng-tube-insertion"
          hubItemTitle="NG Tube Insertion & Testing"
        />

        <div className="ng-pearl" style={{ marginBottom: '40px' }}>
          <p className="ng-pearl-label">Student note</p>
          <p>An NG tube is a soft tube that goes from the nose into the stomach. In children it is used for feeding, medicines, and sometimes to drain the stomach. The most important part of the skill is proving it is really in the stomach before anything goes down it.</p>
        </div>

        {/* Section 1: Indications */}
        <div className="ng-step">
          <div className="ng-step-sidebar">
            <span className="ng-step-numeral ng-numeral-1">1</span>
            <span className="ng-step-badge ng-badge-1">Why</span>
          </div>
          <div className="ng-step-content">
            <h2 className="ng-step-name">Indications for NG Tube</h2>
            <p className="ng-step-question">When and why a child might need one</p>
            <div className="ng-content-grid">
              {INDICATIONS.map((col) => (
                <div key={col.heading} className="ng-content-col">
                  <p className="ng-col-header">{col.heading}</p>
                  <ul className="ng-col-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Measuring */}
        <div className="ng-step">
          <div className="ng-step-sidebar">
            <span className="ng-step-numeral ng-numeral-2">2</span>
            <span className="ng-step-badge ng-badge-2">Measure</span>
          </div>
          <div className="ng-step-content">
            <h2 className="ng-step-name">Measuring the Tube</h2>
            <p className="ng-step-question">NEX &mdash; Nose, Ear, Xiphisternum</p>

            <p style={{ fontSize: '13px', color: '#5A5750', lineHeight: 1.7, fontWeight: 300, marginBottom: '16px' }}>
              NEX is the quick measuring rule students often get taught first. It stands for Nose, Ear, Xiphisternum, and it gives you an estimated insertion length:
            </p>

            <ol className="ng-numbered-list">
              {NEX_STEPS.map((step, i) => (
                <li key={i} className="ng-numbered-item">
                  <span className="ng-numbered-numeral">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ng-numbered-text">{step}</span>
                </li>
              ))}
            </ol>

            <div className="ng-pearl">
              <p className="ng-pearl-label">Clinical pearl</p>
              <p>NEX is a guide, not proof. A tube can still be too short and sit in the food pipe instead of the stomach, which is why pH testing of aspirate matters so much. Some trusts use slightly modified versions of NEX to improve accuracy, so always follow local policy.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Insertion technique */}
        <div className="ng-step">
          <div className="ng-step-sidebar">
            <span className="ng-step-numeral ng-numeral-3">3</span>
            <span className="ng-step-badge ng-badge-3">Insert</span>
          </div>
          <div className="ng-step-content">
            <h2 className="ng-step-name">Insertion Technique</h2>
            <p className="ng-step-question">Step by step &mdash; paediatric specific</p>

            <ol className="ng-numbered-list">
              {INSERTION_STEPS.map((step, i) => (
                <li key={i} className="ng-numbered-item">
                  <span className="ng-numbered-numeral">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ng-numbered-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Section 4: Syringe */}
        <div className="ng-step">
          <div className="ng-step-sidebar">
            <span className="ng-step-numeral ng-numeral-4">4</span>
            <span className="ng-step-badge ng-badge-4">Syringe</span>
          </div>
          <div className="ng-step-content">
            <h2 className="ng-step-name">Why a 20&ndash;60ml Syringe?</h2>
            <p className="ng-step-question">This is a common exam question &mdash; and it matters clinically</p>

            <div className="ng-info-box">
              <div className="ng-info-row">
                <p className="ng-info-row-label">The physics</p>
                <p className="ng-info-row-text">The simple version is this: a small syringe pulls much harder. That stronger suction can flatten the fine tube against the stomach lining, which makes aspirate harder to get and can irritate the stomach.</p>
              </div>
              <div className="ng-info-row">
                <p className="ng-info-row-label">The clinical implication</p>
                <p className="ng-info-row-text">A <strong style={{ fontWeight: 600 }}>20 ml, 50 ml, or 60 ml syringe</strong> gives gentler suction. That makes it more likely you will actually get aspirate for pH testing without collapsing the tube.</p>
              </div>
              <div className="ng-info-row">
                <p className="ng-info-row-label">The rule</p>
                <p className="ng-info-row-text"><strong style={{ fontWeight: 600 }}>Do not use a syringe smaller than 20 ml</strong> to aspirate from an NG tube. Many trusts use 50 ml or 60 ml as standard. A very small syringe can make you think the tube is misplaced when the problem is actually the syringe.</p>
              </div>
            </div>

            <div className="ng-pearl">
              <p className="ng-pearl-label">Exam pearl</p>
              <p>If you get asked why a large syringe is used, the short student answer is: it creates gentler suction, so the tube is less likely to collapse and you are more likely to get aspirate safely.</p>
            </div>
          </div>
        </div>

        {/* Section 5: Confirming placement */}
        <div className="ng-step">
          <div className="ng-step-sidebar">
            <span className="ng-step-numeral ng-numeral-5">5</span>
            <span className="ng-step-badge ng-badge-5">Confirm</span>
          </div>
          <div className="ng-step-content">
            <h2 className="ng-step-name">Confirming Placement</h2>
            <p className="ng-step-question">First-line method: pH testing of gastric aspirate</p>

            <ol className="ng-numbered-list">
              {PH_STEPS.map((step, i) => (
                <li key={i} className="ng-numbered-item">
                  <span className="ng-numbered-numeral">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ng-numbered-text">{step}</span>
                </li>
              ))}
            </ol>

            <div className="ng-ph-grid">
              <div className="ng-ph-safe">
                <p className="ng-ph-safe-label">Safe to use</p>
                <p className="ng-ph-safe-num">pH &le; 5.5</p>
                <p className="ng-ph-safe-text">Confirms stomach placement. Document the pH reading, the tube length at the nostril, and the time of the check.</p>
              </div>
              <div className="ng-ph-unsafe">
                <p className="ng-ph-unsafe-label">Do not use</p>
                <p className="ng-ph-unsafe-num">pH &gt; 5.5</p>
                <p className="ng-ph-unsafe-text">Could be in the food pipe, airway, or beyond the stomach. Do not give anything down the tube. Escalate.</p>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#1A1815', fontWeight: 400, marginBottom: '12px' }}>Things that affect pH readings</p>
            <div className="ng-factors">
              {PH_FACTORS.map((row, i) => (
                <div key={i} className="ng-factor-row">
                  <p className="ng-factor-name">{row.factor}</p>
                  <p className="ng-factor-desc">{row.effect}</p>
                </div>
              ))}
            </div>

            {/* Unsafe methods */}
            <p className="ng-redflags-label">Unsafe methods &mdash; never use these</p>
            <div className="ng-redflags" style={{ marginBottom: '18px' }}>
              {UNSAFE_METHODS.map((flag) => (
                <span key={flag} className="ng-red-pill">{flag}</span>
              ))}
            </div>

            <div className="ng-pearl">
              <p className="ng-pearl-label">Clinical pearl</p>
              <p>The whoosh test, which means pushing air down the tube and listening over the stomach, is <strong style={{ fontWeight: 600 }}>no longer accepted practice</strong>. Air in the lung can sound very similar to air in the stomach, so it is not safe enough to trust. Placement should be checked with pH testing of aspirate or, if needed, X-ray confirmation.</p>
            </div>
          </div>
        </div>

        {/* Section 6: Ongoing checks & tube sizes */}
        <div className="ng-step">
          <div className="ng-step-sidebar">
            <span className="ng-step-numeral ng-numeral-6">6</span>
            <span className="ng-step-badge ng-badge-6">Ongoing</span>
          </div>
          <div className="ng-step-content">
            <h2 className="ng-step-name">Ongoing Checks &amp; Tube Sizes</h2>
            <p className="ng-step-question">When to re-confirm and which size to use</p>

            <p style={{ fontSize: '13px', color: '#5A5750', lineHeight: 1.7, fontWeight: 300, marginBottom: '12px' }}>
              Placement must be re-confirmed:
            </p>

            <ul className="ng-dash-list">
              {ONGOING_CHECKS.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <div className="ng-pearl" style={{ marginBottom: '22px' }}>
              <p className="ng-pearl-label">Clinical pearl</p>
              <p>Always document the external tube length at the nostril when you first confirm placement. This gives you a simple reference point. If the length changes, assume the tube may have moved and re-test before using it.</p>
            </div>

            <p style={{ fontSize: '13px', color: '#1A1815', fontWeight: 400, marginBottom: '12px' }}>Tube size guide</p>
            <table className="ng-table">
              <thead>
                <tr>
                  <th>Age / weight</th>
                  <th>French gauge (Fr)</th>
                </tr>
              </thead>
              <tbody>
                {TUBE_SIZES.map((row, i) => (
                  <tr key={i}>
                    <td>{row.age}</td>
                    <td>{row.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Complications */}
            <p className="ng-redflags-label" style={{ marginTop: '22px' }}>Complications &amp; red flags</p>
            <div className="ng-redflags">
              {COMPLICATIONS.map((flag) => (
                <span key={flag} className="ng-red-pill">{flag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* OSCE tips */}
        <h2 className="ng-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>OSCE Station Tips</h2>

        <div className="ng-pearl" style={{ marginBottom: '16px' }}>
          <p className="ng-pearl-label">Exam pearl</p>
          <p>The most common questions are: why do we use a large syringe, what pH confirms stomach placement, and why is the whoosh test unsafe. Examiners also want to hear that you would never use the tube until placement is confirmed and that you would escalate if pH is above 5.5 or you still cannot get aspirate.</p>
        </div>

        <div className="ng-pearl">
          <p className="ng-pearl-label">&ldquo;What if you can&apos;t get aspirate?&rdquo;</p>
          <p>This comes up a lot in OSCEs. Know the order: <strong style={{ fontWeight: 600 }}>turn the patient onto their left side</strong>, <strong style={{ fontWeight: 600 }}>sit them more upright</strong> if possible, <strong style={{ fontWeight: 600 }}>move the tube in or out by 1 to 2 cm</strong>, then <strong style={{ fontWeight: 600 }}>wait 15 to 30 minutes</strong> and try again. If none of that works, <strong style={{ fontWeight: 600 }}>request an X-ray</strong> as a last resort. Never use the tube until placement is confirmed.</p>
        </div>

        <SelfTestQuiz title="Test Yourself: NG Tube Insertion &amp; Testing" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'NHS England (2022)', title: 'Patient safety alert: nasogastric tube misplacement', href: 'https://www.england.nhs.uk/patient-safety/patient-safety-alerts/' },
          { citation: 'NICE (2006)', title: 'Nutrition support for adults (CG32)', href: 'https://www.nice.org.uk/guidance/cg32' },
          { citation: 'RCN', title: 'Nasogastric tube guidance and clinical resources', href: 'https://www.rcn.org.uk/' },
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
        ]} />
      </div>
    </div>
  );
}
