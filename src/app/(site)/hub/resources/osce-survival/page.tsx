'use client';

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  {
    question: 'What does WIPE stand for at the start of an OSCE station?',
    options: [
      'Wait, Introduce, Practise, Explain',
      'Wash hands, Introduce, Permission, Explain',
      'Watch, Identify, Prepare, Engage',
      'Wave, Inform, Position, Examine',
    ],
    answer: 1,
  },
  {
    question: 'You forget a step partway through a station. What is the safest move?',
    options: [
      'Carry on silently and hope they did not notice',
      'Apologise repeatedly and start again from the beginning',
      'Pause, say "I am going to recheck this step before I continue", then recover',
      'Stop the station and tell the examiner you have failed',
    ],
    answer: 2,
  },
  {
    question: 'Which three identifiers should you check before any procedure?',
    options: [
      'Name, address, GP',
      'Name, date of birth, hospital number',
      'Name, weight, allergies',
      'Name, age, parent',
    ],
    answer: 1,
  },
  {
    question: 'The examiner cannot read your mind. What does this mean for the station?',
    options: [
      'Say every step out loud, even the checks you are doing in your head',
      'Mime each step so they can see you',
      'Write down everything you are thinking',
      'Ask the examiner what they want next',
    ],
    answer: 0,
  },
  {
    question: 'Which one of these almost always loses marks instantly?',
    options: [
      'Looking nervous',
      'Forgetting hand hygiene before patient contact',
      'Talking through the steps',
      'Pausing to think',
    ],
    answer: 1,
  },
  {
    question: 'You realise mid-station that something is unsafe. What should you say?',
    options: [
      '"Sorry, I will just do it anyway"',
      '"I would escalate this to my mentor or registered nurse before continuing"',
      '"I am not sure, can I skip this?"',
      'Nothing, hope the examiner missed it',
    ],
    answer: 1,
  },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.os-guide *, .os-guide *::before, .os-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.os-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.os-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.os-back {
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
.os-back:hover { color: #555; }
.os-back-arrow { font-style: normal; }

/* Masthead */
.os-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.os-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.os-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.os-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
}

/* Pearl */
.os-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.os-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.os-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step sections */
.os-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 24px;
}

.os-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.os-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.os-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.os-step-content {
  padding-left: 32px;
}

.os-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.os-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

/* 4-column content grid */
.os-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.os-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.os-content-col:last-child { border-right: none; }

.os-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.os-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.os-col-list li {
  font-size: 12px;
  color: #5A5750;
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.os-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Red flags */
.os-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
}

.os-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.os-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Script callout */
.os-script {
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 16px 20px;
  margin-bottom: 18px;
  background: #FBFAF6;
}

.os-script-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #5F5E5A;
  margin-bottom: 9px;
}

.os-script-line {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 15px;
  color: #2C2A27;
  line-height: 1.55;
  margin: 0 0 6px;
}
.os-script-line:last-child { margin-bottom: 0; }

/* Golden rules grid */
.os-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.os-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.os-golden-cell:last-child { border-right: none; }

.os-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.os-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.os-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Challenge cards */
.os-challenge {
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 16px 20px;
  margin-bottom: 6px;
}

.os-challenge-title {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 4px;
}

.os-challenge-text {
  font-size: 12px;
  color: #5A5750;
  font-weight: 300;
  line-height: 1.6;
  margin: 0;
}

/* Step colour system */
.os-letter-1 { color: #185FA5; }
.os-badge-1 { background: #E6F1FB; color: #0C447C; }
.os-letter-2 { color: #0F6E56; }
.os-badge-2 { background: #E1F5EE; color: #085041; }
.os-letter-3 { color: #993C1D; }
.os-badge-3 { background: #FAECE7; color: #712B13; }
.os-letter-4 { color: #534AB7; }
.os-badge-4 { background: #EEEDFE; color: #3C3489; }
.os-letter-5 { color: #5F5E5A; }
.os-badge-5 { background: #F1EFE8; color: #444441; }
.os-letter-6 { color: #8B5E3C; }
.os-badge-6 { background: #F5EDE6; color: #6B4527; }

/* Responsive */
@media (max-width: 800px) {
  .os-wrap { padding: 24px 18px 60px; }
  .os-headline { font-size: 32px; }
  .os-step { grid-template-columns: 1fr; }
  .os-step-sidebar {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    border-right: none;
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
    padding-bottom: 14px;
    margin-bottom: 18px;
    padding-right: 0;
  }
  .os-step-content { padding-left: 0; }
  .os-content-grid { grid-template-columns: 1fr 1fr; }
  .os-content-col:nth-child(2) { border-right: none; }
  .os-content-col:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }
  .os-golden { grid-template-columns: 1fr 1fr; }
  .os-golden-cell:nth-child(2) { border-right: none; }
  .os-golden-cell:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.12); }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

type Section = {
  num: string;
  colour: string;
  name: string;
  subtitle: string;
  cols: { header: string; items: string[] }[];
  script?: { label: string; lines: string[] };
  challenges?: { challenge: string; solution: string }[];
  redFlags?: string[];
  pearl?: string | null;
};

const SECTIONS: Section[] = [
  {
    num: '1',
    colour: '1',
    name: 'The Night Before',
    subtitle: 'Less revising, more setting yourself up. The last-minute cram rarely wins the marks.',
    cols: [
      {
        header: 'Sort your kit',
        items: [
          'Uniform clean and hung',
          'ID badge, fob watch, pen',
          'Spare pair of black socks',
          'Water bottle and snack',
          'Tissues, hair tie, mints',
        ],
      },
      {
        header: 'Read the brief',
        items: [
          'Re-read the station list once',
          'Note what each station tests',
          'Check the venue and arrival time',
          'Know the time per station',
        ],
      },
      {
        header: 'Practise out loud',
        items: [
          'Say WIPE through end-to-end',
          'Talk to an empty chair if needed',
          'Practise your "if I forget" line',
          'Recheck one calculation by hand',
        ],
      },
      {
        header: 'Wind down',
        items: [
          'Stop revising by 9pm',
          'Eat something normal for dinner',
          'Pack your bag tonight, not in the morning',
          'Phone away, lights low',
          'Set two alarms',
        ],
      },
    ],
    pearl: 'You already know more than you think. The night-before cram almost never adds the marks people hope for, and it usually takes from the next morning. Sleep is the most useful revision you will do.',
  },
  {
    num: '2',
    colour: '2',
    name: 'The Morning Of',
    subtitle: 'Quiet, repeatable, low-decision. Today is not the day to try something new.',
    cols: [
      {
        header: 'Eat & drink',
        items: [
          'Something with protein and slow carbs',
          'Avoid only caffeine on an empty stomach',
          'Bring water for between stations',
        ],
      },
      {
        header: 'Move your body',
        items: [
          'Walk part of the way if you can',
          'Stretch shoulders and jaw',
          'Long slow exhale, longer than your inhale',
        ],
      },
      {
        header: 'Arrive early',
        items: [
          'Aim for 30 minutes before your slot',
          'Toilet, hand wash, settle',
          'Quiet corner over chatty group',
        ],
      },
      {
        header: 'Hold your script',
        items: [
          'Mutter WIPE under your breath',
          'Re-read your one-line "if I freeze" plan',
          'Remind yourself this is one moment, not your whole career',
        ],
      },
    ],
    pearl: 'Nerves are not a sign you are unprepared. They are a sign you care. Your hands might shake, your voice might wobble — examiners have seen all of it and mark the steps, not the shake.',
  },
  {
    num: '3',
    colour: '3',
    name: 'WIPE & The Door',
    subtitle: 'The first sixty seconds of every station have a script. Learn it once and you can borrow it everywhere.',
    cols: [
      {
        header: 'W – Wash hands',
        items: [
          'Visible, deliberate, six-step technique',
          'Before you touch anything',
          'Say "I am washing my hands now" if needed',
          'Re-wash any time you re-contaminate',
        ],
      },
      {
        header: 'I – Introduce',
        items: [
          'Full name and role',
          '"I am a student nurse, year one"',
          'Smile and eye contact',
          'Ask their name and what they like to be called',
        ],
      },
      {
        header: 'P – Permission',
        items: [
          'Explain what you are about to do',
          'Why you need to do it',
          'Ask "is that okay with you?"',
          'Check allergies and any concerns',
        ],
      },
      {
        header: 'E – Explain & ID',
        items: [
          'Confirm name, DOB, hospital number',
          'Cross-check the wristband',
          'Close the curtain, offer privacy',
          'Position the patient for comfort',
        ],
      },
    ],
    script: {
      label: 'A line you can borrow',
      lines: [
        '"Hi, my name is [Name], I am a year [X] student nurse. Can I check your name and date of birth?"',
        '"I have been asked to [task]. It involves [one sentence]. Are you happy for me to do that?"',
        '"Before I start, do you have any allergies, and are you in any pain right now?"',
      ],
    },
    pearl: 'Examiners cannot mark thoughts. Say the step out loud, even quietly. "I am washing my hands" is worth a mark; silently washing them is not.',
  },
  {
    num: '4',
    colour: '4',
    name: 'Inside The Station',
    subtitle: 'The actual skill. What the examiner is watching for, and what students lose marks on without realising.',
    cols: [
      {
        header: 'Talk through it',
        items: [
          'Narrate each step you do',
          'Say what you would check, even if not shown',
          'Verbalise the "why" of the step',
          'Tell the patient what comes next',
        ],
      },
      {
        header: 'Check & re-check',
        items: [
          'Allergies before any medication',
          'Equipment in date and sealed',
          'Right patient, right side, right dose',
          'Sharps and waste straight to the bin',
        ],
      },
      {
        header: 'Care about the patient',
        items: [
          '"Are you comfortable?"',
          '"Is this position okay?"',
          'Keep them covered and warm',
          'Pause if they look uncomfortable',
        ],
      },
      {
        header: 'Close the loop',
        items: [
          'Reposition and tidy',
          'Wash hands again',
          'Document what you did',
          'Hand over to the registered nurse',
          'Ask "is there anything else I can do for you?"',
        ],
      },
    ],
    challenges: [
      {
        challenge: 'Going completely silent',
        solution: 'You will lose marks for steps you did but never said. If you notice you have gone quiet, restart the narration: "Just to talk you through what I am doing…"',
      },
      {
        challenge: 'Apologising for everything',
        solution: 'One small apology if needed is fine. Repeating sorry every step undermines the picture you are trying to build. Replace "sorry" with "let me recheck".',
      },
      {
        challenge: 'Forgetting allergies before meds',
        solution: 'This is the easiest mark to lose and the easiest to win. Make it a reflex: "Before I give this, can I just check you do not have any allergies?"',
      },
      {
        challenge: 'Re-contaminating after hand wash',
        solution: 'If you touch your face, hair, bed rail, or curtain, re-wash. Out loud: "I am going to wash my hands again before I continue."',
      },
      {
        challenge: 'Not closing the curtain',
        solution: 'Privacy and dignity is a marked domain in nearly every station. Curtain, door, or screen — do it first and they cannot deduct for it.',
      },
    ],
    redFlags: [
      'No hand hygiene before contact',
      'No allergy check',
      'No patient ID',
      'No consent',
      'Patient distress ignored',
      'Sharps left out',
      'Unsafe drug calculation',
    ],
  },
  {
    num: '5',
    colour: '5',
    name: 'When The Script Slips',
    subtitle: 'You will forget something. The marks are in how you recover, not in pretending you did not.',
    cols: [],
    script: {
      label: 'Recovery lines that work',
      lines: [
        '"I am going to pause and recheck this step before I continue."',
        '"Sorry, just to recap before I move on…"',
        '"In real practice, I would also check…"',
        '"At this point I would escalate to my mentor or the registered nurse."',
      ],
    },
    challenges: [
      {
        challenge: 'You completely blank',
        solution: 'Stop. Breathe. Look at the patient. Start at WIPE again — wash hands, who am I, what am I doing. The script is your fall-back when memory fails.',
      },
      {
        challenge: 'You realise mid-task you skipped a step',
        solution: 'Name it. "I should have checked X earlier — I am going to do that now before continuing." Going back beats hoping the examiner missed it.',
      },
      {
        challenge: 'You make a mistake the examiner sees',
        solution: 'Acknowledge, correct, document. "I noticed I did not… I would correct this by… and I would document it."',
      },
      {
        challenge: 'Something feels unsafe',
        solution: 'Stop and escalate out loud. "This does not feel safe for me to continue alone — I would call the registered nurse." This is the right answer, not a failed station.',
      },
      {
        challenge: 'You run out of time',
        solution: 'Tell them what you would do next. "If I had more time, I would also… document… hand over… ask if there was anything else." Examiners can mark intent.',
      },
    ],
    pearl: 'There is no station where "I would escalate" is the wrong answer. Asking for help is a marked skill, not a failure of one.',
  },
  {
    num: '6',
    colour: '6',
    name: 'Afterwards',
    subtitle: 'How to leave the day behind without unpicking every second of it.',
    cols: [
      {
        header: 'In the corridor',
        items: [
          'Do not debrief with peers immediately',
          'Comparing stations rarely helps',
          'Water, snack, sit somewhere quiet',
        ],
      },
      {
        header: 'That evening',
        items: [
          'Write down what felt smooth',
          'Write one thing to practise',
          'Close the notebook',
          'Do something unrelated to nursing',
        ],
      },
      {
        header: 'When results arrive',
        items: [
          'Read feedback once, then again the next day',
          'Separate the technique from the day',
          'Take the named feedback to your next sim',
        ],
      },
      {
        header: 'If it did not go well',
        items: [
          'A failed station is data, not identity',
          'Ask for a structured re-sit plan',
          'Book a tutorial, not a panic spiral',
          'Most nurses you respect have failed one',
        ],
      },
    ],
    pearl: 'However it went, you turned up, walked in, and tried. That is the part this guide is named for — the surviving. The rest is editing.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OsceSurvivalPage() {
  return (
    <div className="os-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="os-wrap">
        {/* Back nav */}
        <Link href="/hub" className="os-back">
          <span className="os-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="os-kicker">OSCE &middot; Free Resource</p>
        <h1 className="os-headline">How to Survive Your First OSCE</h1>
        <p className="os-standfirst">
          Take a deep breath. The honest version of OSCE advice from someone who has just been through one: what to do the night before, the script to lean on when your brain goes blank, and how to leave the day behind afterwards.
        </p>
        <p className="os-byline">The Nurse Lab · Nursing Hub</p>
        <EditorialSaveButton
          hubItemId="osce-survival"
          hubItemTitle="How to Survive Your First OSCE"
        />

        <div className="os-pearl" style={{ marginBottom: '40px' }}>
          <p className="os-pearl-label">Student note</p>
          <p>This page is for the part of the OSCE that no lecture covers properly: walking up to the door, the script you can borrow when your memory empties out, and what to do with yourself in the corridor afterwards. The clinical steps are in the technique pages — this one is the wrapper.</p>
        </div>

        {/* Golden rules */}
        <div className="os-golden">
          {[
            {
              n: '01',
              title: 'Say it out loud',
              text: 'Examiners cannot mark silent thoughts. Narrate every step, even the ones you would normally do without thinking.',
            },
            {
              n: '02',
              title: 'WIPE every station',
              text: 'Wash, Introduce, Permission, Explain. The same first sixty seconds works for every station from BP to BLS.',
            },
            {
              n: '03',
              title: 'Recover, do not pretend',
              text: 'If you skip a step, name it and go back. Honest recovery is a marked skill. Quietly hoping is not.',
            },
            {
              n: '04',
              title: '"I would escalate" works',
              text: 'There is no OSCE where asking for the registered nurse is the wrong answer. Use it any time something feels unsafe.',
            },
          ].map((cell) => (
            <div key={cell.n} className="os-golden-cell">
              <span className="os-golden-numeral">{cell.n}</span>
              <p className="os-golden-title">{cell.title}</p>
              <p className="os-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Step sections */}
        {SECTIONS.map((section) => (
          <div key={section.num} className="os-step">
            {/* Sidebar */}
            <div className="os-step-sidebar">
              <span className={`os-step-letter os-letter-${section.colour}`}>{section.num}</span>
              <span className={`os-step-badge os-badge-${section.colour}`}>{section.name}</span>
            </div>

            {/* Content */}
            <div className="os-step-content">
              <h2 className="os-step-name">{section.name}</h2>
              <p className="os-step-question">{section.subtitle}</p>

              {/* 4-col grid */}
              {section.cols.length > 0 && (
                <div className="os-content-grid">
                  {section.cols.map((col) => (
                    <div key={col.header} className="os-content-col">
                      <p className="os-col-header">{col.header}</p>
                      <ul className="os-col-list">
                        {col.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Script callout */}
              {section.script && (
                <div className="os-script">
                  <p className="os-script-label">{section.script.label}</p>
                  {section.script.lines.map((line) => (
                    <p key={line} className="os-script-line">&ldquo;{line.replace(/^"|"$/g, '')}&rdquo;</p>
                  ))}
                </div>
              )}

              {/* Challenge cards */}
              {section.challenges && section.challenges.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  {section.challenges.map((item) => (
                    <div key={item.challenge} className="os-challenge">
                      <p className="os-challenge-title">{item.challenge}</p>
                      <p className="os-challenge-text">{item.solution}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Red flags */}
              {section.redFlags && section.redFlags.length > 0 && (
                <>
                  <p className="os-redflags-label">Marks lost fastest</p>
                  <div className="os-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="os-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="os-pearl">
                  <p className="os-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <SelfTestQuiz title="Test Yourself: OSCE Survival" questions={quizQuestions} />

      <SourceLinks sources={[
        { citation: 'NMC (2018a)', title: 'The Code: Professional standards of practice and behaviour for nurses', href: 'https://www.nmc.org.uk/standards/code/' },
        { citation: 'NMC (2018b)', title: 'Future nurse: Standards of proficiency for registered nurses', href: 'https://www.nmc.org.uk/standards/standards-for-nurses/standards-of-proficiency-for-registered-nurses/' },
        { citation: 'RCN', title: 'Student and learner resources', href: 'https://www.rcn.org.uk/' },
      ]} />
    </div>
  );
}
