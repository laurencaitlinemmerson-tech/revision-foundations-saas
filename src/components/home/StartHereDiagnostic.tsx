'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  border,
  cream,
  display,
  green,
  greenBg,
  ink,
  inkLight,
  inkMid,
  panel,
  parchment,
  primaryButton,
  secondaryButton,
  sectionLabelStyle,
  serif,
  teal,
  wrap,
} from './styles';

type Concern = 'osce' | 'quiz' | 'placement';
type Timeframe = 'tonight' | 'week' | 'browse';

const concernOptions: Array<{ value: Concern; label: string; note: string }> = [
  { value: 'osce', label: 'OSCE coming up', note: 'stations, A-E, checklists, wording' },
  { value: 'quiz', label: 'Theory exam', note: 'drug calculations, obs, recall topics' },
  { value: 'placement', label: 'Placement soon', note: 'quick guides, escalation, confidence' },
];

const timeframeOptions: Array<{ value: Timeframe; label: string }> = [
  { value: 'tonight', label: 'Tonight' },
  { value: 'week', label: 'This week' },
  { value: 'browse', label: 'I am browsing' },
];

const recommendations: Record<Concern, Record<Timeframe, {
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  plan: string[];
}>> = {
  osce: {
    tonight: {
      title: 'Do one A-E refresh, then one timed station.',
      body: 'Keep the session narrow. Warm up with the A-E guide, then open the OSCE preview and practise speaking the first 60 seconds out loud.',
      primaryHref: '/osce',
      primaryLabel: 'Start OSCE preview',
      secondaryHref: '/hub/resources/ae-assessment-guide',
      secondaryLabel: 'Read A-E guide',
      plan: ['5 min: scan A-E order', '10 min: speak one station out loud', '3 min: write one phrase to improve'],
    },
    week: {
      title: 'Build a small OSCE loop for the week.',
      body: 'Pair a free clinical guide with station practice, then repeat the same station once after feedback.',
      primaryHref: '/osce',
      primaryLabel: 'Open OSCE tool',
      secondaryHref: '/pricing',
      secondaryLabel: 'See bundle',
      plan: ['Pick one assessment theme', 'Run a station once without stopping', 'Repeat the weakest section only'],
    },
    browse: {
      title: 'Start with the station shape before you buy.',
      body: 'See how the OSCE tool feels, then browse the children’s hub for free pages that match your placement area.',
      primaryHref: '/osce',
      primaryLabel: 'Try 3-minute preview',
      secondaryHref: '/hub/childrens',
      secondaryLabel: 'Browse free hub',
      plan: ['Preview the OSCE flow', 'Open one free hub guide', 'Save pricing until you know the tool fits'],
    },
  },
  quiz: {
    tonight: {
      title: 'Answer ten questions before reading more notes.',
      body: 'Start active. Use the quiz preview first, then read the drug calculation cheat sheet only if the questions show a gap.',
      primaryHref: '/quiz',
      primaryLabel: 'Start quiz preview',
      secondaryHref: '/hub/resources/drug-calculations-cheat-sheet',
      secondaryLabel: 'Open calculation sheet',
      plan: ['10 questions: no notes first', 'Mark one weak topic', 'Read the matching guide for 8 minutes'],
    },
    week: {
      title: 'Make weak topics visible early.',
      body: 'Use short quiz runs through the week instead of one giant cram. Keep a note of the topic that slows you down twice.',
      primaryHref: '/quiz',
      primaryLabel: 'Open quiz preview',
      secondaryHref: '/pricing',
      secondaryLabel: 'See full access',
      plan: ['Monday: mixed recall', 'Midweek: drug calculations', 'Weekend: repeat incorrect topics'],
    },
    browse: {
      title: 'Check whether the question style works for your brain.',
      body: 'The free preview gives you the rhythm: question first, answer, feedback, explanation. No account needed to look around the free hub.',
      primaryHref: '/quiz',
      primaryLabel: 'Try quiz preview',
      secondaryHref: '/hub/childrens',
      secondaryLabel: 'Browse hub',
      plan: ['Open the interactive preview', 'Try one calculation', 'Open one free revision page'],
    },
  },
  placement: {
    tonight: {
      title: 'Pack one placement-safe refresh before tomorrow.',
      body: 'Choose a practical page, copy three reminders into your notes, then leave the rest. Tired revision should be small and useful.',
      primaryHref: '/hub/resources/placement-survival',
      primaryLabel: 'Open placement survival',
      secondaryHref: '/hub/resources/paeds-vital-signs-cheat-sheet',
      secondaryLabel: 'Open vital signs',
      plan: ['Read one practical page', 'Write 3 things to check tomorrow', 'Sleep instead of opening 12 tabs'],
    },
    week: {
      title: 'Choose one clinical refresh for each placement day.',
      body: 'Use the hub like a pocket reference: quick pages before shift, deeper quiz or OSCE practice when you are back home.',
      primaryHref: '/hub/childrens',
      primaryLabel: 'Open children’s hub',
      secondaryHref: '/pricing',
      secondaryLabel: 'See bundle',
      plan: ['Pin one guide for tomorrow', 'Refresh obs and escalation', 'Do one quiz block at the end of the week'],
    },
    browse: {
      title: 'Start with the free placement pages.',
      body: 'The hub is the easiest entry point. Open a free practical guide first; come back to the bundle when you need structured practice.',
      primaryHref: '/hub/childrens',
      primaryLabel: 'Browse free resources',
      secondaryHref: '/how-to-use',
      secondaryLabel: 'How to use it',
      plan: ['Open the children’s hub', 'Pick one page that matches placement', 'Try OSCE or quiz when you want practice'],
    },
  },
};

export default function StartHereDiagnostic() {
  const [concern, setConcern] = useState<Concern>('osce');
  const [timeframe, setTimeframe] = useState<Timeframe>('tonight');

  const result = useMemo(() => recommendations[concern][timeframe], [concern, timeframe]);

  return (
    <section style={{ padding: '58px 24px 68px', background: cream, borderBottom: `0.5px solid ${border}` }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <div style={{ maxWidth: '700px', marginBottom: '28px' }}>
          <p style={{ ...sectionLabelStyle, marginBottom: '12px' }}>Start here</p>
          <h2 style={{ fontFamily: display, fontSize: 'clamp(2rem, 4vw, 3.15rem)', fontWeight: 400, lineHeight: 1.02, color: ink, marginBottom: '16px', maxWidth: '11ch' }}>
            Get one useful next step.
          </h2>
          <p style={{ fontFamily: serif, fontSize: '15px', lineHeight: 1.9, fontWeight: 300, color: inkMid, maxWidth: '560px' }}>
            Pick the lane that feels most urgent and get a small revision block instead of another huge list.
          </p>
        </div>

        <div style={{ border: `0.5px solid ${border}`, background: panel, overflow: 'hidden' }}>
          <div className="home-diagnostic-card-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.05fr)' }}>
            <div className="home-diagnostic-panel-controls" style={{ padding: '24px 24px 26px' }}>
              <p style={{ ...sectionLabelStyle, marginBottom: '14px' }}>What feels most urgent?</p>
              <div className="home-diagnostic-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
                {concernOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setConcern(option.value)}
                    aria-pressed={concern === option.value}
                    style={{
                      minHeight: '118px',
                      padding: '16px 14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: concern === option.value ? parchment : '#fff',
                      color: ink,
                      border: `0.5px solid ${concern === option.value ? 'rgba(26,24,21,0.24)' : border}`,
                    }}
                  >
                    <span style={{ display: 'block', fontFamily: display, fontSize: '20px', lineHeight: 1.1, marginBottom: '9px' }}>
                      {option.label}
                    </span>
                    <span style={{ display: 'block', fontFamily: serif, fontSize: '12px', lineHeight: 1.55, color: inkMid }}>
                      {option.note}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '20px' }}>
                {timeframeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTimeframe(option.value)}
                    aria-pressed={timeframe === option.value}
                    style={{
                      fontFamily: serif,
                      fontSize: '12px',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      color: timeframe === option.value ? cream : inkMid,
                      background: timeframe === option.value ? ink : panel,
                      border: `0.5px solid ${timeframe === option.value ? ink : border}`,
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '24px 24px 26px', background: parchment }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '14px' }}>
                <span style={{ width: '9px', height: '9px', background: green, display: 'inline-flex' }} />
                <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: teal }}>
                  Suggested next block
                </p>
              </div>
              <h3 style={{ fontFamily: display, fontSize: 'clamp(1.6rem, 3vw, 2.3rem)', fontWeight: 400, lineHeight: 1.08, color: ink, marginBottom: '14px', maxWidth: '16ch' }}>
                {result.title}
              </h3>
              <p style={{ fontFamily: serif, fontSize: '14px', lineHeight: 1.85, fontWeight: 300, color: inkMid, marginBottom: '20px', maxWidth: '48ch' }}>
                {result.body}
              </p>
              <ol style={{ display: 'grid', gap: '10px', margin: '0 0 22px', padding: 0, listStyle: 'none' }}>
                {result.plan.map((step, index) => (
                  <li key={step} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: '10px', alignItems: 'baseline', fontFamily: serif, fontSize: '13px', lineHeight: 1.55, color: inkMid }}>
                    <span style={{ color: inkLight, fontFamily: display, fontSize: '18px' }}>{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Link href={result.primaryHref} style={primaryButton}>{result.primaryLabel} →</Link>
                <Link href={result.secondaryHref} style={secondaryButton}>{result.secondaryLabel} →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
