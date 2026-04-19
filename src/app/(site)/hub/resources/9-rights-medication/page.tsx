'use client';
/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import PremiumHubPageGate from '@/components/PremiumHubPageGate';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Data ─────────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'How many "rights" of medication administration are there?', options: ['5', '7', '9', '12'], answer: 2 },
  { question: 'Which right requires you to check the patient\'s wristband before giving a drug?', options: ['Right drug', 'Right patient', 'Right time', 'Right documentation'], answer: 1 },
  { question: 'What should you do FIRST if a patient refuses their medication?', options: ['Force them to take it', 'Skip it and move on', 'Document the refusal and inform the prescriber', 'Give it at a later time without telling anyone'], answer: 2 },
  { question: 'Why is "right reason" important?', options: ['It makes the chart look tidy', 'It ensures the drug matches the clinical indication', 'It saves money', 'It is optional for common drugs'], answer: 1 },
  { question: 'When should you document a medication you have given?', options: ['At the end of the shift', 'Before giving it', 'Immediately after giving it', 'When you next see the patient'], answer: 2 },
  { question: 'What does "right response" mean?', options: ['The drug must arrive quickly', 'You check whether the medication had the expected therapeutic effect', 'The patient must say thank you', 'The pharmacist approves the prescription'], answer: 1 },
  { question: 'What is the correct action if a dose calculation looks unusually large for a child?', options: ['Give it anyway — trust the prescription', 'Recheck your calculation and query with the prescriber', 'Give half the dose', 'Ask the parent to decide'], answer: 1 },
  { question: 'Which of these is a "never do" with medications?', options: ['Check the wristband twice', 'Pre-sign the MAR chart before giving the drug', 'Use two patient identifiers', 'Ask about allergies'], answer: 1 },
];

const rights = [
  {
    number: 1,
    title: 'Right Patient',
    colour: '1',
    badge: 'Identity',
    description: 'Make sure you have the right patient by checking at least two identifiers, such as name and date of birth.',
    tip: 'Check the wristband and ask the patient, or parent, to say the name and date of birth out loud.',
    paediatric: 'Always check the child\'s wristband yourself — even if a parent confirms. Ask the parent to state the child\'s full name AND date of birth. If no wristband, get one fitted before giving medications.',
  },
  {
    number: 2,
    title: 'Right Medication',
    colour: '2',
    badge: 'Drug',
    description: 'Make sure the medicine in your hand matches the prescription exactly, and check allergies before you give it.',
    tip: 'Read the label three times: when you pick it up, when you prepare it, and just before you give it.',
    paediatric: 'Always check the CONCENTRATION as well as the drug name with liquids. Paediatric formulations often have different strengths to adult versions.',
  },
  {
    number: 3,
    title: 'Right Route',
    colour: '3',
    badge: 'Route',
    description: 'Check the medicine is being given the right way, such as by mouth, into a vein, into a muscle, under the skin, or on the skin.',
    tip: 'Some medicines look the same but are meant for different routes, so always check the chart, not your memory.',
    paediatric: 'A toddler refusing oral liquid does not mean you can give a suppository instead. Different routes need a new prescription. Contact the prescriber.',
  },
  {
    number: 4,
    title: 'Right Dose',
    colour: '4',
    badge: 'Dose',
    description: 'Make sure the amount is correct for that patient. If you need to calculate it, slow down and check it properly.',
    tip: 'If you are unsure, get a second checker. Never guess a dose.',
    formula: 'Dose = (What you need ÷ What you have) × Volume',
    paediatric: 'Paediatric doses are weight-based and easy to miscalculate. Always double-check calculations with another registered professional.',
  },
  {
    number: 5,
    title: 'Right Time',
    colour: '5',
    badge: 'Timing',
    description: 'Give the medicine at the correct time and at the right interval.',
    tip: 'Know why the timing matters, for example before food or exactly 6-hourly.',
    paediatric: 'A baby needing 6-hourly antibiotics — skipping or changing intervals affects blood levels and can cause treatment failure or antibiotic resistance.',
  },
  {
    number: 6,
    title: 'Right Documentation',
    colour: '6',
    badge: 'Record',
    description: 'Write down what you gave as soon as you have given it. Never sign before the medicine is actually given.',
    tip: 'Record the time, dose, route, and your signature straight away.',
    paediatric: 'Document IMMEDIATELY after giving each medication. If the child vomits within 30 minutes, document this too — they may need the dose repeated.',
  },
  {
    number: 7,
    title: 'Right Reason',
    colour: '1',
    badge: 'Indication',
    description: 'Know why the patient is having this medicine and whether it fits what is going on clinically.',
    tip: 'If the prescription does not make sense for the patient, stop and question it before giving anything.',
    paediatric: 'Evidence shows salbutamol doesn\'t help bronchiolitis in young children. Query the prescription — cite NICE guidelines when necessary.',
  },
  {
    number: 8,
    title: 'Right Form',
    colour: '2',
    badge: 'Form',
    description: 'Check the medicine is in the right form, such as tablet, liquid, injection, patch, or inhaler.',
    tip: 'Some patients cannot swallow tablets, so check whether a different form has been prescribed.',
    paediatric: 'Request prednisolone soluble tablets which dissolve in water — designed for children. Never crush medications without checking it\'s safe to do so.',
  },
  {
    number: 9,
    title: 'Right Response',
    colour: '3',
    badge: 'Monitor',
    description: 'Watch what happens after the medicine is given, including the effect you wanted and any side effects.',
    tip: 'Know what improvement you are expecting, what side effects to watch for, and when to escalate.',
    paediatric: 'Signs of allergic reaction (itchy rash, lip swelling) within 30 minutes of first dose — STOP the antibiotic, call for help, monitor airway, breathing, circulation.',
  },
];

const highRiskMedicationChecks = [
  ['Insulin', 'Check the insulin type, units, blood glucose, and whether food is available if needed.'],
  ['Anticoagulants', 'Double-check the indication, dose timing, INR or anti-Xa plan where relevant, and bleeding risk.'],
  ['Opioids', 'Check sedation, respiratory rate, pain score, and when the last dose was given.'],
  ['IV potassium', 'Slow right down on concentration, dilution, and the route. Never improvise with this one.'],
  ['Gentamicin and other aminoglycosides', 'Check weight, renal function, timing, and whether levels are due.'],
  ['Chemotherapy and specialist infusions', 'These need the right area, right checks, and senior support, not guesswork.'],
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.nr-guide *, .nr-guide *::before, .nr-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.nr-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.nr-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.nr-back {
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
.nr-back:hover { color: #555; }
.nr-back-arrow { font-style: normal; }

/* Masthead */
.nr-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.nr-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.nr-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.nr-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Pearl / info callout */
.nr-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.nr-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.nr-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Red flags */
.nr-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.nr-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.nr-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Section headings */
.nr-section-title {
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

/* Step sections */
.nr-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.nr-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.nr-step-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.nr-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.nr-step-content {
  padding-left: 32px;
}

.nr-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.nr-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* Content grids */
.nr-content-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.nr-content-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.nr-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.nr-content-col:last-child { border-right: none; }

.nr-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.nr-col-text {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  font-weight: 300;
}

.nr-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nr-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.nr-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Formula box */
.nr-formula {
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  text-align: center;
  padding: 14px;
  background: #F5F3F0;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 18px;
  color: #1A1815;
}

/* Memory aid */
.nr-memory {
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  text-align: center;
  padding: 18px;
  background: #F5F3F0;
  border: 0.5px solid rgba(0,0,0,0.12);
  color: #1A1815;
  margin-bottom: 18px;
}

/* Step colour system */
.nr-numeral-1 { color: #185FA5; }
.nr-badge-1 { background: #E6F1FB; color: #0C447C; }
.nr-numeral-2 { color: #0F6E56; }
.nr-badge-2 { background: #E1F5EE; color: #085041; }
.nr-numeral-3 { color: #993C1D; }
.nr-badge-3 { background: #FAECE7; color: #712B13; }
.nr-numeral-4 { color: #534AB7; }
.nr-badge-4 { background: #EEEDFE; color: #3C3489; }
.nr-numeral-5 { color: #5F5E5A; }
.nr-badge-5 { background: #F1EFE8; color: #444441; }
.nr-numeral-6 { color: #8B5E3C; }
.nr-badge-6 { background: #F5EDE5; color: #6B4529; }

/* Responsive */
@media (max-width: 800px) {
  .nr-wrap { padding: 24px 20px 60px; }
  .nr-headline { font-size: 34px; }
  .nr-step { grid-template-columns: 1fr; }
  .nr-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 12px; padding-right: 0; margin-bottom: 16px; }
  .nr-step-numeral { font-size: 48px; }
  .nr-step-content { padding-left: 0; }
  .nr-content-grid-2, .nr-content-grid-3 { grid-template-columns: 1fr; }
  .nr-content-col { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .nr-content-col:last-child { border-bottom: none; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function NineRightsMedicationPage() {
  return (
    <PremiumHubPageGate resourceTitle="Medication Administration & Safety">
      <div className="nr-guide">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />

        <div className="nr-wrap">
        {/* Back nav */}
        <Link href="/hub" className="nr-back">
          <span className="nr-back-arrow">←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="nr-kicker">Medication Safety · Clinical Practice</p>
        <h1 className="nr-headline">9 Rights of Medication Administration</h1>
        <p className="nr-standfirst">
          The medication checks you need for OSCEs and placement, written in the kind of language students actually use.
        </p>
        <p className="nr-byline">The Nurse Lab · Nursing Hub</p>
        <EditorialSaveButton
          hubItemId="9-rights-medication"
          hubItemTitle="9 Rights of Medication Administration"
        />

        {/* Student note */}
        <div className="nr-pearl" style={{ marginBottom: '40px' }}>
          <p className="nr-pearl-label">Student note</p>
          <p>
            Think of the 9 Rights as your medication safety checklist. You do not need to sound robotic in an OSCE. What matters is showing that you know what you are checking, why it matters, and when you would pause and ask for help.
          </p>
        </div>

        {/* Why this matters */}
        <div className="nr-pearl" style={{ marginBottom: '40px' }}>
          <p className="nr-pearl-label">Why this matters</p>
          <p>Medication errors are one of the most common causes of avoidable harm. Using the 9 Rights every time builds a safety habit that protects patients and protects you. In OSCEs, examiners cannot mark checks they do not see, so say them out loud as you do them.</p>
        </div>

        {/* High-risk medications section */}
        <h2 className="nr-section-title" style={{ marginTop: '0' }}>High-risk meds to slow down for</h2>
        <div className="nr-content-grid-2" style={{ marginBottom: '18px' }}>
          {highRiskMedicationChecks.map(([title, check]) => (
            <div key={title} className="nr-content-col">
              <p className="nr-col-header">{title}</p>
              <p className="nr-col-text">{check}</p>
            </div>
          ))}
        </div>

        <div className="nr-pearl" style={{ marginBottom: '52px' }}>
          <p className="nr-pearl-label">Keep the meds pages straight</p>
          <p>
            This page is for the safety-check side of medication rounds. Use{' '}
            <Link href="/hub/resources/drug-calculations-cheat-sheet" style={{ color: '#633806', textDecoration: 'underline' }}>
              Drug Calculations Cheat Sheet
            </Link>{' '}
            for the maths and IV rates, and{' '}
            <Link href="/hub/resources/medication-abbreviations" style={{ color: '#633806', textDecoration: 'underline' }}>
              Medication Abbreviations Guide
            </Link>{' '}
            for the chart shorthand you keep seeing on drug charts.
          </p>
        </div>

        {/* The 9 Rights */}
        {rights.map((right) => (
          <div key={right.number} className="nr-step">
            {/* Sidebar */}
            <div className="nr-step-sidebar">
              <span className={`nr-step-numeral nr-numeral-${right.colour}`}>{right.number}</span>
              <span className={`nr-step-badge nr-badge-${right.colour}`}>{right.badge}</span>
            </div>

            {/* Content */}
            <div className="nr-step-content">
              <h2 className="nr-step-name">{right.title}</h2>
              <p className="nr-step-question">{right.description}</p>

              <div className="nr-pearl" style={{ marginBottom: '14px' }}>
                <p className="nr-pearl-label">Tip</p>
                <p>{right.tip}</p>
              </div>

              {right.formula && (
                <div className="nr-formula">{right.formula}</div>
              )}

              <div className="nr-pearl" style={{ background: '#F5F3F0' }}>
                <p className="nr-pearl-label" style={{ color: '#555' }}>Paediatric consideration</p>
                <p style={{ color: '#5A5750' }}>{right.paediatric}</p>
              </div>
            </div>
          </div>
        ))}

        {/* OSCE tip */}
        <div className="nr-pearl" style={{ marginTop: '16px', marginBottom: '18px' }}>
          <p className="nr-pearl-label">OSCE station tip</p>
          <p>In medication administration OSCEs, verbalise every check: &quot;I&apos;m checking the patient&apos;s wristband, and I have their full name and date of birth...&quot; Examiners can only mark what they see and hear, so talk through each right even if you would usually do part of it silently.</p>
        </div>

        {/* Quick Memory Aid */}
        <h2 className="nr-section-title">Quick Memory Aid</h2>
        <div className="nr-memory">
          Patient → Drug → Route → Dose → Time → Document → Reason → Form → Response
        </div>

        {/* Never do this */}
        <p className="nr-redflags-label">Never do this with medications</p>
        <div className="nr-redflags">
          {[
            'Pre-sign the MAR chart',
            'Give without checking wristband',
            'Change route without a new prescription',
            'Guess a dose calculation',
            'Give without knowing the indication',
            'Skip documentation after giving',
          ].map(flag => <span key={flag} className="nr-red-pill">{flag}</span>)}
        </div>

        <SelfTestQuiz title="Test Yourself: 9 Rights of Medication" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'NMC (2018)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
          { citation: 'BNFC', title: 'British National Formulary for Children', href: 'https://bnf.nice.org.uk/' },
          { citation: 'NHS England', title: 'Medication safety resources', href: 'https://www.england.nhs.uk/patient-safety/medication-safety/' },
          { citation: 'WHO', title: 'Medication Without Harm — Patient Safety Challenge', href: 'https://www.who.int/initiatives/medication-without-harm' },
        ]} />
        </div>
      </div>
    </PremiumHubPageGate>
  );
}
