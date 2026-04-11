'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import PremiumHubPageGate from '@/components/PremiumHubPageGate';
import SelfTestQuiz from '@/components/SelfTestQuiz';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'What are the four pillars of the NMC Code?', options: ['Care, Compassion, Competence, Communication', 'Prioritise people, Practise effectively, Preserve safety, Promote trust', 'Honesty, Integrity, Respect, Accountability', 'Assess, Plan, Implement, Evaluate'], answer: 1 },
  { question: 'What are the four ethical principles (Beauchamp and Childress)?', options: ['Autonomy, Beneficence, Non-maleficence, Justice', 'Consent, Capacity, Competence, Communication', 'Privacy, Dignity, Respect, Honesty', 'Care, Compassion, Courage, Commitment'], answer: 0 },
  { question: 'What makes consent valid?', options: ['The patient signs a form', 'Capacity, information, and voluntariness', 'The doctor approves it', 'The family agrees'], answer: 1 },
  { question: 'What is the first principle of the Mental Capacity Act 2005?', options: ['Best interests come first', 'Assume capacity unless proven otherwise', 'Always get written consent', 'Refer to the courts'], answer: 1 },
  { question: 'What does Gillick competence mean?', options: ['A child is over 16', 'A child under 16 who demonstrates sufficient understanding can consent', 'A child must always have parental consent', 'A legal test for all minors'], answer: 1 },
  { question: 'What should you do if you witness a colleague breaching patient confidentiality?', options: ['Ignore it', 'Post about it on social media', 'Raise concerns through proper channels', 'Only mention it at the end of the year'], answer: 2 },
  { question: 'What Act protects staff who raise genuine safety concerns in good faith?', options: ['Human Rights Act 1998', 'Mental Capacity Act 2005', 'Public Interest Disclosure Act 1998', 'Data Protection Act 2018'], answer: 2 },
  { question: 'Which of these would be a serious fitness-to-practise concern?', options: ['Being 5 minutes late once', 'Falsifying patient records', 'Asking a mentor a question', 'Requesting feedback'], answer: 1 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.pe-guide *, .pe-guide *::before, .pe-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.pe-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.pe-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.pe-back {
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
.pe-back:hover { color: #555; }
.pe-back-arrow { font-style: normal; }

/* Masthead */
.pe-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.pe-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.pe-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.pe-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Pearl */
.pe-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.pe-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.pe-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step sections */
.pe-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}

.pe-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.pe-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.pe-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.pe-step-content {
  padding-left: 32px;
}

.pe-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.pe-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.pe-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.pe-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.pe-content-col:last-child { border-right: none; }

.pe-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.pe-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pe-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.pe-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* 2-column grid */
.pe-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.pe-grid-2-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.pe-grid-2-col:last-child { border-right: none; }

/* Red flags */
.pe-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.pe-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.pe-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Golden rules grid */
.pe-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.pe-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.pe-golden-cell:last-child { border-right: none; }

.pe-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.pe-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.pe-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Section headings */
.pe-section-title {
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

/* Step colour system */
.pe-letter-1 { color: #185FA5; }
.pe-badge-1 { background: #E6F1FB; color: #0C447C; }
.pe-letter-2 { color: #0F6E56; }
.pe-badge-2 { background: #E1F5EE; color: #085041; }
.pe-letter-3 { color: #993C1D; }
.pe-badge-3 { background: #FAECE7; color: #712B13; }
.pe-letter-4 { color: #534AB7; }
.pe-badge-4 { background: #EEEDFE; color: #3C3489; }
.pe-letter-5 { color: #5F5E5A; }
.pe-badge-5 { background: #F1EFE8; color: #444441; }
.pe-letter-6 { color: #8B5E3C; }
.pe-badge-6 { background: #F5EDE6; color: #6B4527; }

/* Responsive */
@media (max-width: 800px) {
  .pe-wrap { padding: 24px 18px 60px; }
  .pe-headline { font-size: 32px; }
  .pe-step { grid-template-columns: 1fr; }
  .pe-step-sidebar {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    border-right: none;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
    padding-bottom: 14px;
    margin-bottom: 18px;
    padding-right: 0;
  }
  .pe-step-content { padding-left: 0; }
  .pe-content-grid { grid-template-columns: 1fr 1fr; }
  .pe-content-col:nth-child(2) { border-right: none; }
  .pe-content-col:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }
  .pe-golden { grid-template-columns: 1fr 1fr; }
  .pe-golden-cell:nth-child(2) { border-right: none; }
  .pe-golden-cell:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.12); }
  .pe-grid-2 { grid-template-columns: 1fr; }
  .pe-grid-2-col { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .pe-grid-2-col:last-child { border-bottom: none; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Y1ProfessionalismEthicsPage() {
  return (
    <PremiumHubPageGate resourceTitle="Professionalism & Ethics">
      <div className="pe-guide">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />

        <div className="pe-wrap">
        {/* Back nav */}
        <Link href="/hub" className="pe-back">
          <span className="pe-back-arrow">&larr;</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="pe-kicker">Year 1 Essentials &middot; Free Resource</p>
        <h1 className="pe-headline">Professionalism &amp; Ethics</h1>
        <p className="pe-standfirst">
          The professionalism and ethics ideas that can sound vague until they are explained in the kind of language students actually use.
        </p>
        <p className="pe-byline">The Nurse Lab · Nursing Hub</p>
        <EditorialSaveButton
          hubItemId="y1-professionalism-ethics"
          hubItemTitle="Professionalism & Ethics"
        />

        <div className="pe-pearl" style={{ marginBottom: '40px' }}>
          <p className="pe-pearl-label">Student note</p>
          <p>This page is really about how to make safe, fair, professional decisions when the situation is not completely straightforward. Try linking each idea back to something you might actually say, do, or escalate on placement.</p>
        </div>

        {/* Golden rules */}
        <div className="pe-golden">
          {[
            {
              n: '01',
              title: 'Prioritise people',
              text: 'Put patients first, treat with kindness and respect. The NMC Code starts here for a reason.',
            },
            {
              n: '02',
              title: 'Practise effectively',
              text: 'Assess, plan, deliver, and evaluate care competently. Know what you can and cannot do.',
            },
            {
              n: '03',
              title: 'Preserve safety',
              text: 'Act without delay if patient safety is at risk. Escalate early and honestly.',
            },
            {
              n: '04',
              title: 'Promote trust',
              text: 'Uphold the reputation of the profession in everything you do, including online.',
            },
          ].map((cell) => (
            <div key={cell.n} className="pe-golden-cell">
              <span className="pe-golden-numeral">{cell.n}</span>
              <p className="pe-golden-title">{cell.title}</p>
              <p className="pe-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Section 1: NMC Code */}
        <div className="pe-step">
          <div className="pe-step-sidebar">
            <span className="pe-step-letter pe-letter-1">1</span>
            <span className="pe-step-badge pe-badge-1">NMC Code</span>
          </div>
          <div className="pe-step-content">
            <h2 className="pe-step-name">The NMC Code</h2>
            <p className="pe-step-question">The professional standards nurses and nursing students are expected to follow.</p>

            <div className="pe-content-grid">
              {[
                {
                  header: 'Prioritise people',
                  items: [
                    'Put patients first',
                    'Treat with kindness and respect',
                    'Listen to patients and respond to preferences',
                    'Act as an advocate for the vulnerable',
                  ],
                },
                {
                  header: 'Practise effectively',
                  items: [
                    'Assess needs and plan care',
                    'Deliver evidence-based care',
                    'Communicate clearly with colleagues',
                    'Keep skills and knowledge up to date',
                  ],
                },
                {
                  header: 'Preserve safety',
                  items: [
                    'Act without delay if safety is at risk',
                    'Raise concerns promptly',
                    'Advise on, prescribe, and give medicines safely',
                    'Be accountable for your decisions',
                  ],
                },
                {
                  header: 'Promote trust',
                  items: [
                    'Uphold the reputation of the profession',
                    'Act with honesty and integrity',
                    'Cooperate with investigations',
                    'Maintain professional boundaries',
                  ],
                },
              ].map((col) => (
                <div key={col.header} className="pe-content-col">
                  <p className="pe-col-header">{col.header}</p>
                  <ul className="pe-col-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Four Ethical Principles */}
        <div className="pe-step">
          <div className="pe-step-sidebar">
            <span className="pe-step-letter pe-letter-2">2</span>
            <span className="pe-step-badge pe-badge-2">Ethics</span>
          </div>
          <div className="pe-step-content">
            <h2 className="pe-step-name">The Four Ethical Principles</h2>
            <p className="pe-step-question">Beauchamp and Childress&apos;s framework for working through ethical decisions in healthcare.</p>

            <div className="pe-content-grid">
              {[
                {
                  header: 'Autonomy',
                  items: [
                    'Respect the patient\u2019s right to decide',
                    'Give information clearly so they can choose',
                    'Respect refusal of treatment when valid',
                    'Gain proper consent before procedures',
                  ],
                },
                {
                  header: 'Beneficence',
                  items: [
                    'Do what is likely to help the patient',
                    'Give evidence-based care',
                    'Advocate for patient needs',
                    'Think about overall wellbeing',
                  ],
                },
                {
                  header: 'Non-maleficence',
                  items: [
                    'Avoid causing harm',
                    'Check carefully, do not cut corners',
                    'Know your limits and ask for help',
                    'Report concerns and errors honestly',
                  ],
                },
                {
                  header: 'Justice',
                  items: [
                    'Treat people fairly',
                    'Do not discriminate',
                    'Use resources as fairly as possible',
                    'Challenge unfair practice when you see it',
                  ],
                },
              ].map((col) => (
                <div key={col.header} className="pe-content-col">
                  <p className="pe-col-header">{col.header}</p>
                  <ul className="pe-col-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Consent */}
        <div className="pe-step">
          <div className="pe-step-sidebar">
            <span className="pe-step-letter pe-letter-3">3</span>
            <span className="pe-step-badge pe-badge-3">Consent</span>
          </div>
          <div className="pe-step-content">
            <h2 className="pe-step-name">Consent</h2>
            <p className="pe-step-question">What makes consent valid, and when it may not be needed.</p>

            <div className="pe-content-grid">
              {[
                {
                  header: 'Capacity',
                  items: [
                    'Patient can understand the information',
                    'Hold onto it long enough',
                    'Weigh it up',
                    'Communicate a choice',
                  ],
                },
                {
                  header: 'Information',
                  items: [
                    'Risks explained clearly',
                    'Benefits discussed',
                    'Alternatives offered',
                    'What happens if they refuse',
                  ],
                },
                {
                  header: 'Voluntary',
                  items: [
                    'Decision made freely',
                    'No pressure or coercion',
                    'Time to consider if needed',
                  ],
                },
                {
                  header: 'Types of consent',
                  items: [
                    'Implied: holding out arm for BP check',
                    'Verbal: agreeing to take medication',
                    'Written: surgery, procedures with significant risk',
                  ],
                },
              ].map((col) => (
                <div key={col.header} className="pe-content-col">
                  <p className="pe-col-header">{col.header}</p>
                  <ul className="pe-col-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pe-pearl">
              <p className="pe-pearl-label">Clinical pearl</p>
              <p>Consent may not be needed in emergency life-saving treatment for an unconscious patient, Mental Health Act detainment, or certain public health emergencies. But these are exceptions, not the rule.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Mental Capacity Act */}
        <div className="pe-step">
          <div className="pe-step-sidebar">
            <span className="pe-step-letter pe-letter-4">4</span>
            <span className="pe-step-badge pe-badge-4">Capacity</span>
          </div>
          <div className="pe-step-content">
            <h2 className="pe-step-name">Mental Capacity Act 2005</h2>
            <p className="pe-step-question">Five statutory principles and the two-stage assessment.</p>

            <div className="pe-content-grid">
              {[
                {
                  header: 'Five principles',
                  items: [
                    'Assume capacity unless proven otherwise',
                    'Support the person to decide if possible',
                    'Unwise decisions are allowed',
                    'Decisions for those lacking capacity must be in their best interests',
                    'Choose the least restrictive option',
                  ],
                },
                {
                  header: 'Stage 1 \u2014 Impairment',
                  items: [
                    'Is there an impairment of the mind or brain?',
                    'E.g. dementia, delirium',
                    'Learning disability',
                    'Intoxication, brain injury',
                  ],
                },
                {
                  header: 'Stage 2 \u2014 Functional test',
                  items: [
                    'Can they understand the information?',
                    'Can they retain it long enough?',
                    'Can they weigh the information?',
                    'Can they communicate their decision?',
                  ],
                },
                {
                  header: 'Best interests',
                  items: [
                    'Consider the person\u2019s wishes and feelings',
                    'Consult family or carers',
                    'Choose least restrictive option',
                    'Document the decision and reasoning',
                  ],
                },
              ].map((col) => (
                <div key={col.header} className="pe-content-col">
                  <p className="pe-col-header">{col.header}</p>
                  <ul className="pe-col-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Professionalism in Practice */}
        <div className="pe-step">
          <div className="pe-step-sidebar">
            <span className="pe-step-letter pe-letter-5">5</span>
            <span className="pe-step-badge pe-badge-5">Practice</span>
          </div>
          <div className="pe-step-content">
            <h2 className="pe-step-name">Professionalism in Practice</h2>
            <p className="pe-step-question">How professionalism looks day to day, and where the boundaries sit.</p>

            <div className="pe-content-grid">
              {[
                {
                  header: 'Professional behaviours',
                  items: [
                    'Punctuality and reliability',
                    'Professional appearance (uniform policy)',
                    'Respectful communication',
                    'Taking responsibility for actions',
                    'Continuous learning and reflection',
                    'Working within scope of practice',
                    'Maintaining professional boundaries',
                  ],
                },
                {
                  header: 'Professional boundaries',
                  items: [
                    'No personal relationships with patients',
                    'Do not accept significant gifts',
                    'No social media contact with patients',
                    'Do not share personal problems',
                    'Self-disclosure only if therapeutic',
                    'Refer if personal feelings interfere with care',
                  ],
                },
                {
                  header: 'Social media rules',
                  items: [
                    'Never post identifiable patient information',
                    'Do not add or accept patients online',
                    'Do not discuss work complaints online',
                    'Posts reflect on the profession',
                    'Use privacy settings appropriately',
                    'Do not post photos from the workplace',
                    'Think before you post: would the NMC approve?',
                    'Employers and the NMC can see posts',
                  ],
                },
                {
                  header: 'Raising concerns',
                  items: [
                    'Speak to your mentor or supervisor first',
                    'Use your organisation\u2019s procedure',
                    'Document your concerns clearly',
                    'If not resolved, escalate to senior staff',
                    'External bodies: NMC, CQC if needed',
                  ],
                },
              ].map((col) => (
                <div key={col.header} className="pe-content-col">
                  <p className="pe-col-header">{col.header}</p>
                  <ul className="pe-col-list">
                    {col.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pe-pearl" style={{ marginBottom: '18px' }}>
              <p className="pe-pearl-label">Whistleblower protection</p>
              <p>The Public Interest Disclosure Act 1998 protects staff who raise genuine concerns in good faith. In other words, you should not be punished for speaking up about safety through the right channels.</p>
            </div>

            <div className="pe-pearl">
              <p className="pe-pearl-label">The Newspaper Test</p>
              <p>Before any action, ask yourself: &ldquo;How would this look if it was made public?&rdquo; If you would feel uneasy seeing it explained on the front page of a newspaper, stop and think again. It is not a legal test, but it is a useful gut-check for everyday professionalism.</p>
            </div>
          </div>
        </div>

        {/* Section 6: Fitness to Practise */}
        <div className="pe-step">
          <div className="pe-step-sidebar">
            <span className="pe-step-letter pe-letter-6">6</span>
            <span className="pe-step-badge pe-badge-6">Fitness</span>
          </div>
          <div className="pe-step-content">
            <h2 className="pe-step-name">Fitness to Practise</h2>
            <p className="pe-step-question">The serious red flags that can lead to fitness-to-practise proceedings.</p>

            <p className="pe-redflags-label">Serious professionalism red flags</p>
            <div className="pe-redflags">
              {[
                'Dishonesty (falsifying records, plagiarism)',
                'Patient harm through neglect',
                'Breach of confidentiality',
                'Boundary violations',
                'Criminal behaviour',
                'Substance misuse affecting practice',
                'Social media misconduct',
                'Failure to raise safety concerns',
              ].map((flag) => (
                <span key={flag} className="pe-red-pill">{flag}</span>
              ))}
            </div>
          </div>
        </div>

        <SelfTestQuiz title="Test Yourself: Professionalism &amp; Ethics" questions={quizQuestions} />
        </div>
      </div>
    </PremiumHubPageGate>
  );
}
