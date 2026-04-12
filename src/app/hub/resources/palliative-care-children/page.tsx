'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'What is the core goal of paediatric palliative care?', options: ['To cure the child', 'The best possible quality of life for the child and family', 'To extend life as long as possible', 'To reduce treatment costs'], answer: 1 },
  { question: 'Which pain assessment tool is used for pre-verbal children?', options: ['Visual Analogue Scale', 'FLACC scale', 'McGill Pain Questionnaire', 'NEWS2'], answer: 1 },
  { question: 'What is the first-line rescue medication for seizures in children?', options: ['Diazepam IV', 'Buccal midazolam', 'Phenytoin', 'Morphine'], answer: 1 },
  { question: 'What phrase should you AVOID when talking to a child about dying?', options: ['"Your body is very poorly"', '"Going to sleep"', '"The medicines cannot make it better"', '"You can ask me anything"'], answer: 1 },
  { question: 'What does "anticipatory prescribing" mean?', options: ['Giving medications before they are needed', 'Prescribing medications in advance so they are available when symptoms arise', 'Prescribing based on a prediction', 'Ordering repeat prescriptions automatically'], answer: 1 },
  { question: 'What is a cold cot used for?', options: ['Keeping medications cold', 'Allowing families time with their child after death', 'Cooling a child with a fever', 'Storing equipment'], answer: 1 },
  { question: 'What sibling support charity should you know about?', options: ['Macmillan', 'Winston\'s Wish', 'Cruse', 'Marie Curie'], answer: 1 },
  { question: 'What does DNACPR mean in practice?', options: ['Do not treat the patient at all', 'Do not attempt to restart the heart, but all other care continues', 'The patient has given up', 'No more medications should be given'], answer: 1 },
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
  padding: 40px 48px 100px;
}

/* Back nav */
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

/* Masthead */
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
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Principle grid */
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

/* Section steps — like A-E steps */
.pc-section {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
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

.pc-section-content {
  padding-left: 32px;
}

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

/* Content grid */
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

/* Red flags */
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

/* Pearl */
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

/* Tip box */
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

/* Section headings */
.pc-heading {
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

/* Table */
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

/* Body text */
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
  { n: '01', title: 'Total pain', text: 'Pain is not just physical — it includes emotional, social, and spiritual suffering. Ask about fears, friendships, school, and what the child misses.' },
  { n: '02', title: 'Family as unit of care', text: 'The child and family are cared for together. Parents and siblings need support too. Offer information, time, and space.' },
  { n: '03', title: 'Quality over quantity', text: 'The goal shifts from cure to comfort, dignity, and the best possible days. Ask what matters most to the child and family right now.' },
  { n: '04', title: 'Honest communication', text: 'Children often understand more than adults expect. Use simple, truthful language. Avoid saying "going to sleep" — children may fear bedtime.' },
  { n: '05', title: 'Advance care planning', text: 'Conversations about wishes, preferences, and what-if scenarios happen early, not at the crisis point. Support families to think ahead.' },
];

const SECTIONS = [
  {
    numeral: '1',
    colour: '1',
    name: 'Symptom Management',
    subtitle: 'What does good comfort care look like?',
    badge: 'Comfort',
    cols: [
      {
        header: 'Pain',
        items: [
          'WHO analgesic ladder adapted for children',
          'Age-appropriate assessment (FLACC, Wong-Baker)',
          'Paracetamol and ibuprofen first-line for mild pain',
          'Morphine is the strong opioid of choice',
          'Always prescribe a laxative alongside opioids',
          'Non-pharmacological: positioning, distraction, warmth',
        ],
      },
      {
        header: 'Nausea & vomiting',
        items: [
          'Identify the cause before choosing antiemetic',
          'Ondansetron for chemotherapy-related nausea',
          'Cyclizine for general nausea or raised ICP',
          'Domperidone for gastric stasis',
          'Mouth care if vomiting frequently',
        ],
      },
      {
        header: 'Breathlessness',
        items: [
          'Low-dose morphine reduces the sensation',
          'Cool air from a fan across the face',
          'Positioning upright or side preference',
          'Oxygen not always helpful',
          'Midazolam for anxiety-driven breathlessness',
          'Noisy breathing does not always mean distress',
        ],
      },
      {
        header: 'Seizures & agitation',
        items: [
          'Buccal midazolam is first-line rescue',
          'Anticipatory prescribing is essential',
          'Families need a clear seizure plan at home',
          'Rule out reversible causes of agitation first',
          'Familiar voices, music, touch can help',
        ],
      },
    ],
    redFlags: ['Uncontrolled pain despite escalation', 'Prolonged seizure >5 min', 'Sudden new symptom', 'Family distress beyond coping'],
    pearl: 'Always check doses against the BNF for Children. Palliative doses may differ from standard paediatric doses. If in doubt, contact the palliative care team or pharmacy.',
  },
  {
    numeral: '2',
    colour: '2',
    name: 'Secretions & End-of-Life Symptoms',
    subtitle: 'What happens in the last hours and days?',
    badge: 'Final days',
    cols: [
      {
        header: 'Secretions',
        items: [
          '"Death rattle" distresses families more than the child',
          'Gentle repositioning and raising head of bed',
          'Glycopyrronium or hyoscine reduce new secretions',
          'Suctioning usually avoided — causes more distress',
          'Explain to families the child is not choking',
        ],
      },
      {
        header: 'Agitation',
        items: [
          'Can be pain, fear, full bladder, or the dying process',
          'Midazolam commonly used for terminal agitation',
          'Keep the environment calm and quiet',
          'Familiar voices and touch help',
        ],
      },
      {
        header: 'Recognising dying',
        items: [
          'Increasing drowsiness and withdrawal',
          'Reduced oral intake',
          'Mottled skin, peripheral cyanosis',
          'Changes in breathing pattern',
          'Reduced urine output',
        ],
      },
      {
        header: 'Anticipatory prescribing',
        items: [
          'Medications for pain, nausea, breathlessness, agitation, secretions',
          'Prescribed before crisis happens',
          'Available in the home or bedside',
          'Clear instructions for families and out-of-hours teams',
        ],
      },
    ],
    redFlags: ['Unmanaged distress', 'No anticipatory medications prescribed', 'Family not prepared for what dying looks like'],
    pearl: 'Explain to families that changes in breathing are a normal part of dying and do not mean the child is suffering. Your presence and calm reassurance matters more than having the perfect words.',
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
          '"I need to talk to you about something important"',
          'Find a private, quiet space',
          'Sit at eye level, phone on silent',
          'Ask who they would like present',
          'Have tissues and water available',
        ],
      },
      {
        header: 'Talking to parents',
        items: [
          '"What is your understanding of what\'s happening?"',
          '"I wish things were different."',
          '"What matters most to you and your child right now?"',
          '"You don\'t have to make any decisions right now."',
          'Be clear — say "dying" not "passing away"',
        ],
      },
      {
        header: 'Talking to the child',
        items: [
          'Use the child\'s own words for illness',
          '"Your body is very poorly and the medicines can\'t make it better"',
          'Avoid "going to sleep" — use "dying" gently',
          'Let the child lead with questions',
          'Drawing and play can open conversations',
        ],
      },
      {
        header: 'Supporting siblings',
        items: [
          '"It is not your fault"',
          '"It\'s okay to feel sad, angry, or confused"',
          'Include siblings in visits if they want',
          'Schools should be informed',
          'Signpost to Winston\'s Wish',
        ],
      },
    ],
    redFlags: ['"I know how you feel"', '"At least they won\'t suffer"', '"Be strong"', '"Everything happens for a reason"', 'Medical jargon', 'Rushing the conversation'],
    pearl: null,
  },
  {
    numeral: '4',
    colour: '4',
    name: 'Place of Care & Memory Making',
    subtitle: 'Where should the child be, and what can families hold onto?',
    badge: 'Place & memory',
    cols: [
      {
        header: 'Home',
        items: [
          'Often the family\'s preference',
          'Requires community nursing support',
          'Anticipatory medications delivered',
          'Clear out-of-hours plan',
          'GP, community team, hospice involved',
        ],
      },
      {
        header: 'Hospice',
        items: [
          'Respite, symptom management, end-of-life care',
          'Families can stay together',
          'Expert bereavement support',
          'Not all areas have a local hospice',
        ],
      },
      {
        header: 'Hospital',
        items: [
          'May be needed for complex symptoms',
          'Aim for a side room with family facilities',
          'Palliative care team involved alongside ward',
          'Flexible visiting',
        ],
      },
      {
        header: 'Memory making',
        items: [
          'Hand and foot prints or casts',
          'Locks of hair, photos, memory boxes',
          'Journals, letters, or recordings',
          'Cold cots allow time after death',
          'Offer gently — never push',
        ],
      },
    ],
    redFlags: [],
    pearl: 'Some families are not ready for memory making during the illness. Cold cots and bereavement suites give families time after death to create memories at their own pace.',
  },
  {
    numeral: '5',
    colour: '5',
    name: 'After the Child Dies',
    subtitle: 'What happens next, and who needs support?',
    badge: 'Afterwards',
    cols: [
      {
        header: 'Verification',
        items: [
          'Doctor verifies death',
          'If expected, GP or community team can attend at home',
          'Death certificate issued by attending doctor',
        ],
      },
      {
        header: 'Care after death',
        items: [
          'Wash and dress the child with family if they wish',
          'Cold cot or cool room gives families time',
          'Explain normal physical changes',
        ],
      },
      {
        header: 'Practicalities',
        items: [
          'Register the death within five days',
          'Give written information about next steps',
          'Offer chaplain or spiritual support',
        ],
      },
      {
        header: 'Bereavement support',
        items: [
          'Follow up — a card, a call, an appointment',
          'Winston\'s Wish (siblings)',
          'The Compassionate Friends',
          'Local hospice bereavement services',
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
    name: 'Ethics & Your Role',
    subtitle: 'What are the hard decisions, and where do you fit?',
    badge: 'Ethics',
    cols: [
      {
        header: 'Best interests',
        items: [
          'Decisions made in the child\'s best interests',
          'Not the same as what parents want or team prefers',
          'About what is right for this child',
        ],
      },
      {
        header: 'Treatment decisions',
        items: [
          'No ethical difference between withholding and withdrawing',
          'Shifting from cure to comfort is not "giving up"',
          'DNACPR means not restarting the heart — not withdrawing all care',
        ],
      },
      {
        header: 'Disagreement',
        items: [
          'When parents and team disagree, mediation and ethics committees help',
          'Courts may become involved',
          'Your role: listen, document, advocate for the child',
        ],
      },
      {
        header: 'Student nurse role',
        items: [
          'Be present — sitting quietly with a family matters',
          'Ask your mentor how you can help',
          'It is okay to feel upset — that is human',
          'Write a reflective account afterwards',
          'Use supervision and debrief',
        ],
      },
    ],
    redFlags: [],
    pearl: 'You may feel unsure about your place in palliative care as a student. You belong there. Your presence, your care, and your willingness to sit with difficulty matters more than having the perfect words.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PalliativeCareChildrenPage() {
  return (
    <div className="pc-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="pc-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="pc-back">
          <span style={{ fontStyle: 'normal' }}>←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="pc-kicker">Palliative Care · Children&apos;s Nursing</p>
        <h1 className="pc-headline">Palliative Care in Children</h1>
        <p className="pc-standfirst">
          What palliative care means in paediatrics, how to manage symptoms, how to talk to children and families about dying, and how to support everyone involved — including yourself.
        </p>
        <p className="pc-byline">Children&apos;s nursing · Communication · The Nurse Lab</p>
        <EditorialSaveButton
          hubItemId="palliative-care-children"
          hubItemTitle="Palliative Care in Children"
        />

        <div className="pc-pearl" style={{ marginBottom: '40px' }}>
          <p className="pc-pearl-label">Student note</p>
          <p>Palliative care in children is not the same as end-of-life care. It can begin at diagnosis of a life-limiting condition and run alongside active treatment for months or years. The aim is the best possible quality of life for the child and their family, whatever the prognosis.</p>
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
            {/* Sidebar */}
            <div className="pc-section-sidebar">
              <span className={`pc-section-numeral pc-num-${section.colour}`}>{section.numeral}</span>
              <span className={`pc-section-badge pc-badge-${section.colour}`}>{section.badge}</span>
            </div>

            {/* Content */}
            <div className="pc-section-content">
              <h2 className="pc-section-name">{section.name}</h2>
              <p className="pc-section-question">{section.subtitle}</p>

              {/* Grid */}
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

              {/* Red flags */}
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

              {/* Pearl */}
              {section.pearl && (
                <div className="pc-pearl">
                  <p className="pc-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Together for Short Lives framework */}
        <h2 className="pc-heading">Together for Short Lives Categories</h2>
        <p className="pc-body">
          The Together for Short Lives framework groups children&apos;s palliative care into four categories based on the nature and trajectory of the condition. You do not need to memorise these, but knowing they exist helps you understand why care plans look so different from child to child.
        </p>
        <table className="pc-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Life-threatening conditions where curative treatment may be possible but can fail</td>
              <td>Cancer, organ failure requiring transplant</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Conditions where premature death is inevitable but long periods of intensive treatment can prolong life</td>
              <td>Cystic fibrosis, Duchenne muscular dystrophy</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Progressive conditions without curative options where treatment is palliative from diagnosis</td>
              <td>Batten disease, mucopolysaccharidoses</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Irreversible but non-progressive conditions causing severe disability and susceptibility to complications</td>
              <td>Severe cerebral palsy, brain or spinal cord injury</td>
            </tr>
          </tbody>
        </table>

        <div className="pc-tip">
          <p className="pc-tip-label">Key organisations</p>
          <p>Together for Short Lives, Winston&apos;s Wish (sibling support), The Compassionate Friends, Rays of Sunshine, Make-A-Wish, and your local children&apos;s hospice are all worth knowing about.</p>
        </div>

        <SelfTestQuiz title="Test Yourself: Palliative Care (Children)" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: "NICE (2016)", title: "End of life care for infants, children and young people (NG61)", href: "https://www.nice.org.uk/guidance/ng61" },
          { citation: "Together for Short Lives", title: "Clinical guidance and resources for children's palliative care", href: "https://www.togetherforshortlives.org.uk/" },
          { citation: "RCPCH", title: "Palliative care for children", href: "https://www.rcpch.ac.uk/" },
          { citation: "Winston's Wish", title: "Support for bereaved children and families", href: "https://www.winstonswish.org/" },
          { citation: "NMC (2018)", title: "The Code: Professional standards of practice and behaviour for nurses", href: "https://www.nmc.org.uk/standards/code/" },
        ]} />
      </div>
    </div>
  );
}
