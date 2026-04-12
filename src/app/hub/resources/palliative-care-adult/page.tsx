'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'What is Dame Cicely Saunders\' concept of "total pain"?', options: ['Pain that cannot be treated', 'Pain that is physical, psychological, social, and spiritual', 'Pain that lasts more than 6 months', 'Pain requiring opioids'], answer: 1 },
  { question: 'What is the first-line strong opioid for palliative pain?', options: ['Fentanyl', 'Codeine', 'Morphine', 'Tramadol'], answer: 2 },
  { question: 'What should ALWAYS be co-prescribed with opioids?', options: ['Antibiotics and antifungals', 'A laxative and an antiemetic', 'Paracetamol only', 'Nothing — they work alone'], answer: 1 },
  { question: 'What is a breakthrough dose of morphine calculated as?', options: ['Half the daily dose', 'One sixth (1/6th) of the total 24-hour dose', 'The same as the regular dose', 'Double the bedtime dose'], answer: 1 },
  { question: 'Which device delivers continuous subcutaneous medication over 24 hours?', options: ['PCA pump', 'Nebuliser', 'Syringe driver', 'Infusion bag'], answer: 2 },
  { question: 'What is the preferred language when discussing dying with families?', options: ['"Passing away"', '"Going to a better place"', '"Dying" — clear and honest', '"Moving on"'], answer: 2 },
  { question: 'What is an ADRT?', options: ['A drug chart', 'An Advance Decision to Refuse Treatment, which is legally binding', 'A type of care plan', 'A referral form'], answer: 1 },
  { question: 'What should families be told about the "death rattle"?', options: ['It means the patient is in pain', 'They should request suctioning', 'The patient is not aware of it and is not drowning', 'It requires immediate medical review'], answer: 2 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.pc-guide *, .pc-guide *::before, .pc-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.pc-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.pc-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.pc-back {
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
.pc-back:hover { color: #555; }

.pc-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.pc-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.pc-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.pc-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

.pc-principles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.pc-principle-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.pc-principle-cell:last-child { border-right: none; }

.pc-principle-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.pc-principle-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.pc-principle-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.pc-section {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.pc-section-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.pc-section-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.pc-section-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.pc-section-content { padding-left: 32px; }

.pc-section-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.pc-section-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

.pc-content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.pc-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.pc-content-col:last-child { border-right: none; }

.pc-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.pc-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pc-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.pc-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

.pc-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.pc-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.pc-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.pc-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
  margin-bottom: 18px;
}

.pc-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.pc-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.pc-tip {
  background: #E8F5EE;
  padding: 14px 18px;
  margin-bottom: 18px;
}
.pc-tip-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0F6E56;
  margin-bottom: 6px;
}
.pc-tip p {
  font-size: 12px;
  color: #0F6E56;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.pc-heading {
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

.pc-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 24px;
  font-size: 13px;
}

.pc-table th {
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
.pc-table th:last-child { border-right: none; }

.pc-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
  line-height: 1.55;
  vertical-align: top;
}
.pc-table td:last-child { border-right: none; }
.pc-table tr:last-child td { border-bottom: none; }
.pc-table td:first-child { font-weight: 400; color: #2C2A27; }

.pc-body {
  font-size: 14px;
  color: #5A5750;
  line-height: 1.7;
  font-weight: 300;
  max-width: 680px;
  margin-bottom: 22px;
}

/* Colour system */
.pc-num-1 { color: #185FA5; }
.pc-badge-1 { background: #E6F1FB; color: #0C447C; }
.pc-num-2 { color: #0F6E56; }
.pc-badge-2 { background: #E1F5EE; color: #085041; }
.pc-num-3 { color: #993C1D; }
.pc-badge-3 { background: #FAECE7; color: #712B13; }
.pc-num-4 { color: #534AB7; }
.pc-badge-4 { background: #EEEDFE; color: #3C3489; }
.pc-num-5 { color: #5F5E5A; }
.pc-badge-5 { background: #F1EFE8; color: #444441; }
.pc-num-6 { color: #8B5E3C; }
.pc-badge-6 { background: #FAF0E6; color: #5C3D26; }
.pc-num-7 { color: #185FA5; }
.pc-badge-7 { background: #E6F1FB; color: #0C447C; }

@media (max-width: 768px) {
  .pc-wrap { padding: 24px 20px 60px; }
  .pc-headline { font-size: 36px; }
  .pc-section { grid-template-columns: 1fr; }
  .pc-section-sidebar { flex-direction: row; align-items: center; gap: 12px; padding-right: 0; border-right: none; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .pc-section-numeral { font-size: 48px; }
  .pc-section-content { padding-left: 0; }
  .pc-content-grid { grid-template-columns: 1fr 1fr; }
  .pc-content-col { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .pc-principles { grid-template-columns: 1fr 1fr; }
  .pc-principle-cell { border-bottom: 0.5px solid rgba(0,0,0,0.12); }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const PRINCIPLES = [
  { n: '01', title: 'Total pain', text: 'Pain is physical, psychological, social, and spiritual. Ask about worries, loneliness, family tensions, and existential fears — not just the pain score.' },
  { n: '02', title: 'Patient-centred goals', text: 'The patient\'s wishes, values, and priorities drive care decisions. Ask "What matters most to you?" early and often.' },
  { n: '03', title: 'Anticipatory care', text: 'Plan for what is likely to happen next. Prescribe anticipatory medications. Have conversations about preferred place of death before the final days.' },
  { n: '04', title: 'Holistic approach', text: 'Care covers physical symptoms, emotional support, spiritual needs, and practical concerns. Involve the full MDT.' },
  { n: '05', title: 'Supporting carers', text: 'Family and carers are part of the care plan, not bystanders. Offer information, emotional support, practical help, and bereavement follow-up.' },
];

const SECTIONS = [
  {
    numeral: '1',
    colour: '1',
    name: 'Pain & Symptom Management',
    subtitle: 'What does good comfort care look like in adult patients?',
    badge: 'Comfort',
    cols: [
      {
        header: 'Pain',
        items: [
          'WHO analgesic ladder — step up, not straight to strong',
          'Paracetamol and NSAIDs useful alongside stronger drugs',
          'Morphine is first-line strong opioid; start low, titrate',
          'Co-prescribe laxative and antiemetic with opioids',
          'Breakthrough dose = 1/6th of total 24-hour dose',
          'Neuropathic: amitriptyline, gabapentin, or pregabalin',
          'Non-pharmacological: repositioning, heat, massage, TENS',
        ],
      },
      {
        header: 'Nausea & vomiting',
        items: [
          'Match antiemetic to cause',
          'Cyclizine for vestibular or raised ICP',
          'Metoclopramide for gastric stasis (not bowel obstruction)',
          'Haloperidol for chemical and metabolic causes',
          'Levomepromazine if cause unclear',
          'SC route if vomiting persists',
        ],
      },
      {
        header: 'Breathlessness',
        items: [
          'Low-dose oral morphine (2.5–5 mg) reduces the sensation',
          'Fan blowing cool air across the face — evidence-based',
          'Position: upright, leaning forward, or patient preference',
          'Oxygen only helps if hypoxic',
          'Midazolam for anxiety-driven breathlessness',
        ],
      },
      {
        header: 'Constipation & mouth',
        items: [
          'Start laxatives when opioids are started',
          'Softener + stimulant combination (docusate + senna)',
          'Macrogols for impaction',
          'Mouth care every 2–4 hours',
          'Moisten lips with water-based balm',
          'Check for oral thrush',
        ],
      },
    ],
    redFlags: ['Uncontrolled pain despite escalation', 'Bowel obstruction with stimulant laxative', 'No laxative prescribed with opioids', 'Opioid toxicity signs'],
    pearl: 'When the oral route is lost, a syringe driver delivers continuous subcutaneous medication over 24 hours. Common combinations include morphine + midazolam + glycopyrronium. Always check compatibility and local guidelines.',
  },
  {
    numeral: '2',
    colour: '2',
    name: 'Last Days of Life',
    subtitle: 'What changes, and what should the care look like?',
    badge: 'Final days',
    cols: [
      {
        header: 'Recognising dying',
        items: [
          'Increasing drowsiness and withdrawal',
          'Reduced oral intake',
          'Mottled skin, peripheral cyanosis',
          'Cheyne-Stokes breathing',
          'Reduced urine output',
          'General withdrawal from surroundings',
        ],
      },
      {
        header: 'Medication review',
        items: [
          'Stop non-essential medications',
          'Convert essentials to SC route',
          'Set up syringe driver if multiple drugs needed',
          'Anticipatory prescribing for pain, nausea, breathlessness, agitation, secretions',
        ],
      },
      {
        header: 'Comfort care',
        items: [
          'Mouth care every 2–4 hours',
          'Repositioning for comfort',
          'Continence care with dignity',
          'Pressure area care continues',
          'Gentle hygiene',
        ],
      },
      {
        header: 'Environment & family',
        items: [
          'Side room if possible',
          'Reduce noise and bright lights',
          'Allow personal items, photos, music',
          'Flexible visiting',
          'Keep family informed of changes',
          'Reassure about what is normal',
        ],
      },
    ],
    redFlags: ['No anticipatory medications prescribed', 'Family not prepared for what dying looks like', 'Non-essential medications still running'],
    pearl: 'Respiratory secretions — the "death rattle" — distress families far more than the patient. Reposition gently. Glycopyrronium or hyoscine reduce new secretions. Suctioning is usually avoided. Explain that the patient is not drowning.',
  },
  {
    numeral: '3',
    colour: '3',
    name: 'Communication',
    subtitle: 'How do you say the hard things well?',
    badge: 'Words',
    cols: [
      {
        header: 'Setting up',
        items: [
          '"I\'d like to talk about what\'s ahead. Is now okay?"',
          'Find a private space — not a corridor',
          'Sit down, eye level, phone on silent',
          'Ask who they\'d like present',
          'Have tissues and water available',
        ],
      },
      {
        header: 'During the conversation',
        items: [
          '"What is your understanding of where things are?"',
          '"I wish I had better news."',
          '"What matters most to you right now?"',
          '"We will make sure you are comfortable"',
          '"You don\'t have to decide anything today"',
          'Be clear — say "dying" when that is what you mean',
        ],
      },
      {
        header: 'Advance care planning',
        items: [
          'ADRT is legally binding',
          'Lasting Power of Attorney for Health',
          '"Have you thought about what you\'d want if you couldn\'t speak for yourself?"',
          'Document and share with GP, hospital, ambulance',
        ],
      },
      {
        header: 'Supporting relatives',
        items: [
          '"If you need a break, that is okay"',
          '"It is normal for breathing to change like this"',
          '"There is no right or wrong way to grieve"',
          'Offer tea. Show them the bathroom.',
          'Small kindnesses matter enormously',
        ],
      },
    ],
    redFlags: ['"I know how you feel"', '"They had a good innings"', '"Be strong"', '"Everything happens for a reason"', 'Medical jargon', 'Rushing'],
    pearl: null,
  },
  {
    numeral: '4',
    colour: '4',
    name: 'Preferred Place of Death',
    subtitle: 'Where should the patient be cared for?',
    badge: 'Place',
    cols: [
      {
        header: 'Home',
        items: [
          'Often the patient\'s preference',
          'District nursing support needed',
          'Anticipatory medications at home',
          'Equipment: hospital bed, syringe driver',
          'Clear out-of-hours plan',
          'GP and palliative team involved',
        ],
      },
      {
        header: 'Hospice',
        items: [
          'Specialist palliative care, calm environment',
          'Expert symptom management',
          'Family support and bereavement services',
          'Referral via GP or hospital palliative team',
        ],
      },
      {
        header: 'Hospital',
        items: [
          'May be needed for complex symptoms',
          'Aim for a side room',
          'Palliative care team involved',
          'Flexible visiting, reduce clinical clutter',
        ],
      },
      {
        header: 'Care home',
        items: [
          'Many residents die in care homes',
          'Staff need palliative care training',
          'Access to anticipatory medications',
          'GP and community palliative team closely involved',
        ],
      },
    ],
    redFlags: [],
    pearl: 'Conversations about preferred place of death should happen early and be revisited. Most people say they want to die at home, but this requires planning, support, and resources. Preferences can change — and that is okay.',
  },
  {
    numeral: '5',
    colour: '5',
    name: 'After Death',
    subtitle: 'What happens next, and who needs support?',
    badge: 'Afterwards',
    cols: [
      {
        header: 'Verification',
        items: [
          'Can be performed by RN or doctor',
          'Check heart sounds, breath sounds, pupils for 5+ min',
          'Document time, who verified, who present',
        ],
      },
      {
        header: 'Last offices',
        items: [
          'Wash and prepare with dignity',
          'Remove non-essential lines',
          'Respect cultural and religious wishes',
          'Offer family the chance to help',
        ],
      },
      {
        header: 'Documentation',
        items: [
          'Complete nursing notes and notification forms',
          'Property documented carefully',
          'Handle belongings sensitively — a carrier bag of possessions handled badly stays with families forever',
        ],
      },
      {
        header: 'Bereavement',
        items: [
          'Give written information about next steps',
          'Cruse Bereavement Care, Macmillan, Marie Curie',
          'Some wards send a follow-up card',
          'Staff debrief and wellbeing support',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    numeral: '6',
    colour: '6',
    name: 'Spiritual, Cultural & Ethical Care',
    subtitle: 'What should you ask, and what should you never assume?',
    badge: 'Ethics',
    cols: [
      {
        header: 'Spiritual needs',
        items: [
          'Ask about religious or spiritual needs',
          'Offer chaplaincy',
          'Some patients want prayer, readings, or rituals',
          'Some want nothing — respect that too',
        ],
      },
      {
        header: 'Cultural practices',
        items: [
          'Some families wish to wash the body themselves',
          'Specific requirements about who handles the body',
          'Timing of burial may be important',
          'Ask — do not assume based on appearance or name',
        ],
      },
      {
        header: 'Ethical decisions',
        items: [
          'DNACPR: not restarting the heart, not withdrawing care',
          'Best interests decisions if patient lacks capacity',
          'Withdrawing treatment is ethically equal to withholding',
          'Mental Capacity Act applies',
        ],
      },
      {
        header: 'Student nurse role',
        items: [
          'Be present — sitting with someone matters',
          'Offer practical help: tea, blankets, directions',
          'Ask your mentor what you can do',
          'It is okay to feel emotional',
          'Write a reflective account',
          'Debrief with someone you trust',
        ],
      },
    ],
    redFlags: [],
    pearl: 'End-of-life care can feel daunting as a student. You do not need to have all the answers. Your presence and your care matter enormously. If you are struggling, say so — there is always support available.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PalliativeCareAdultPage() {
  return (
    <div className="pc-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pc-wrap">
        <Link href="/hub/adult" className="pc-back">
          <span style={{ fontStyle: 'normal' }}>←</span>
          Adult Nursing Hub
        </Link>

        <p className="pc-kicker">Palliative Care · Adult Nursing</p>
        <h1 className="pc-headline">Palliative &amp; End of Life Care</h1>
        <p className="pc-standfirst">
          What palliative care means in adult nursing, how to manage the most common symptoms, what to say to patients and families, and how to care for someone in their last days with skill and compassion.
        </p>
        <p className="pc-byline">Adult nursing · Communication · The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="palliative-care-adult"
          hubItemTitle="Palliative & End of Life Care"
        />

        <div className="pc-pearl" style={{ marginBottom: '40px' }}>
          <p className="pc-pearl-label">Student note</p>
          <p>Palliative care is not just for the last days of life. It can begin at diagnosis of a life-limiting illness and run alongside active treatment. The aim is the best possible quality of life — physically, emotionally, socially, and spiritually.</p>
        </div>

        {/* Core principles */}
        <div className="pc-principles">
          {PRINCIPLES.map((p) => (
            <div key={p.n} className="pc-principle-cell">
              <span className="pc-principle-numeral">{p.n}</span>
              <p className="pc-principle-title">{p.title}</p>
              <p className="pc-principle-text">{p.text}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <div key={section.numeral} className="pc-section">
            <div className="pc-section-sidebar">
              <span className={`pc-section-numeral pc-num-${section.colour}`}>{section.numeral}</span>
              <span className={`pc-section-badge pc-badge-${section.colour}`}>{section.badge}</span>
            </div>

            <div className="pc-section-content">
              <h2 className="pc-section-name">{section.name}</h2>
              <p className="pc-section-question">{section.subtitle}</p>

              <div className="pc-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="pc-content-col">
                    <p className="pc-col-header">{col.header}</p>
                    <ul className="pc-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="pc-redflags-label">Things to avoid</p>
                  <div className="pc-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="pc-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="pc-pearl">
                  <p className="pc-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Key frameworks */}
        <h2 className="pc-heading">Key Frameworks & Guidelines</h2>
        <p className="pc-body">
          These are the frameworks and tools you are most likely to encounter on placement or in exams. You do not need to memorise them in full, but knowing they exist and what they do helps you sound confident in discussions.
        </p>
        <table className="pc-table">
          <thead>
            <tr>
              <th>Framework</th>
              <th>What it does</th>
              <th>When you will see it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NICE NG142</td>
              <td>End-of-life care guideline for adults — covers recognition, communication, shared decision-making, and symptom management</td>
              <td>Assignments, placement, care planning</td>
            </tr>
            <tr>
              <td>Gold Standards Framework</td>
              <td>Helps identify patients approaching end of life using the &quot;surprise question&quot; and triggers proactive care planning</td>
              <td>Community and GP settings</td>
            </tr>
            <tr>
              <td>Amber Care Bundle</td>
              <td>Used when clinicians are uncertain whether a patient may recover — prompts earlier conversations about goals of care</td>
              <td>Acute hospital wards</td>
            </tr>
            <tr>
              <td>ReSPECT</td>
              <td>A personalised plan for emergency treatment preferences, broader than DNACPR alone</td>
              <td>Hospital and community, replacing older DNACPR forms</td>
            </tr>
          </tbody>
        </table>

        <div className="pc-tip">
          <p className="pc-tip-label">Key organisations</p>
          <p>Macmillan Cancer Support, Marie Curie, Cruse Bereavement Care, and your local hospice are all worth knowing about. They provide patient support, family support, and resources for staff.</p>
        </div>

        <SelfTestQuiz title="Test Yourself: Palliative Care (Adult)" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'NICE (2019)', title: 'End of life care for adults: service delivery (NG142)', href: 'https://www.nice.org.uk/guidance/ng142' },
          { citation: 'Gold Standards Framework', title: 'GSF programmes and clinical tools', href: 'https://goldstandardsframework.org.uk/' },
          { citation: 'Macmillan Cancer Support', title: 'Professional resources for healthcare teams', href: 'https://www.macmillan.org.uk/' },
          { citation: 'Marie Curie', title: 'Clinical information and end of life resources', href: 'https://www.mariecurie.org.uk/' },
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
        ]} />
      </div>
    </div>
  );
}
