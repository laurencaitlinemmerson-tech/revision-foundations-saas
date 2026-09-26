'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';
import ConductionDiagram from '@/components/hub/ConductionDiagram';
import SheetLinks from '@/components/hub/SheetLinks';
import { InteractiveHeart, InteractiveEcgBeat } from '@/components/hub/InteractiveHeart';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.ecg-guide *, .ecg-guide *::before, .ecg-guide *::after { box-sizing: border-box; }

.ecg-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.ecg-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

.ecg-back {
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
.ecg-back:hover { color: var(--ink-soft); }
.ecg-back-arrow { font-style: normal; }

.ecg-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.ecg-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.ecg-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.ecg-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

.ecg-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.ecg-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.ecg-golden-cell:last-child { border-right: none; }

.ecg-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.ecg-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.ecg-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

.ecg-diagram {
  border: 0.5px solid var(--hairline-firm);
  padding: 24px;
  margin-bottom: 18px;
  background: var(--surface-page);
}
.ecg-diagram img {
  display: block;
  width: 100%;
  height: auto;
}
.ecg-diagram-caption {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: center;
  margin-top: 14px;
}

.ecg-key {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 32px;
}
@media (max-width: 720px) {
  .ecg-key { grid-template-columns: 1fr; }
}
.ecg-key-col {
  border: 0.5px solid var(--hairline-firm);
  padding: 18px 20px;
}
.ecg-key-title {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin: 0 0 12px;
}
.ecg-key-item {
  display: flex;
  gap: 12px;
  padding: 9px 0;
  border-top: 0.5px solid var(--hairline-soft);
  font-size: 12.5px;
  line-height: 1.6;
  font-weight: 300;
  color: var(--ink-soft);
}
.ecg-key-item:first-of-type { border-top: none; }
.ecg-key-item strong {
  display: block;
  font-weight: 500;
  color: var(--ink-mid);
}
.ecg-key-dot {
  flex: 0 0 12px;
  height: 12px;
  border-radius: 999px;
  margin-top: 5px;
}

.ecg-rhythm-card {
  border: 0.5px solid var(--hairline-firm);
  padding: 20px 22px 22px;
  margin-bottom: 14px;
}

.ecg-rhythm-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.ecg-rhythm-name {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 400;
  color: var(--ink-strong);
}

.ecg-rhythm-badge {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 500;
}
.ecg-rhythm-badge.normal {
  background: var(--teal-50);
  color: var(--teal-800);
}
.ecg-rhythm-badge.abnormal {
  background: var(--red-50);
  color: var(--red-600);
}

.ecg-rhythm-svg-wrap {
  background: var(--surface-sunken);
  border: 0.5px solid var(--hairline-soft);
  padding: 10px 12px;
  margin-bottom: 12px;
}
.ecg-rhythm-svg-wrap svg {
  display: block;
  width: 100%;
  height: auto;
}

.ecg-rhythm-explain {
  font-size: 12.5px;
  color: var(--ink-soft);
  line-height: 1.7;
  font-weight: 300;
  margin: 0;
}
.ecg-rhythm-explain strong {
  font-weight: 500;
  color: var(--ink-mid);
}

.ecg-rhythm-key {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  margin-bottom: 4px;
}
.ecg-rhythm-key span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: var(--ink-faint);
}
.ecg-rhythm-key i {
  width: 14px;
  height: 2px;
  display: inline-block;
}

.ecg-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.ecg-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.ecg-step-letter {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.ecg-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.ecg-step-content {
  padding-left: 32px;
}

.ecg-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.ecg-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.ecg-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.ecg-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.ecg-content-col:last-child { border-right: none; }

.ecg-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.ecg-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ecg-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.ecg-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

.ecg-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.ecg-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ecg-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

.ecg-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.ecg-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.ecg-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

.ecg-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 18px;
  padding-top: 24px;
  margin-top: 36px;
  padding-bottom: 16px;
  border-top: 0.5px solid var(--hairline-firm);
  border-bottom: 0.5px solid var(--hairline-firm);
}

.ecg-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.ecg-table th {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  font-weight: 400;
  padding: 11px 16px;
  border-bottom: 0.5px solid var(--hairline-firm);
  border-right: 0.5px solid var(--hairline-firm);
  text-align: left;
  background: var(--surface-sunken);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.ecg-table th:last-child { border-right: none; }

.ecg-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.ecg-table td:last-child { border-right: none; }
.ecg-table tr:last-child td { border-bottom: none; }
.ecg-table td:first-child { font-weight: 400; color: var(--ink-mid); }

.ecg-letter-1 { color: var(--blue-600); }
.ecg-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.ecg-letter-2 { color: var(--teal-600); }
.ecg-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.ecg-letter-3 { color: var(--coral-600); }
.ecg-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.ecg-letter-4 { color: var(--purple-600); }
.ecg-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.ecg-letter-5 { color: var(--gray-600); }
.ecg-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.ecg-letter-6 { color: #8B5E3C; }
.ecg-badge-6 { background: var(--surface-sunken); color: #6B4729; }

@media (max-width: 860px) {
  .ecg-wrap { padding: 24px 20px 48px; }
  .ecg-headline { font-size: 34px; }
  .ecg-golden { grid-template-columns: repeat(2, 1fr); }
  .ecg-golden-cell:nth-child(2) { border-right: none; }
  .ecg-golden-cell:nth-child(1), .ecg-golden-cell:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
  .ecg-step { grid-template-columns: 64px 1fr; }
  .ecg-step-letter { font-size: 48px; }
  .ecg-content-grid { grid-template-columns: repeat(2, 1fr); }
  .ecg-content-col:nth-child(2) { border-right: none; }
  .ecg-content-col:nth-child(1), .ecg-content-col:nth-child(2) { border-bottom: 0.5px solid var(--hairline-firm); }
}

@media (max-width: 520px) {
  .ecg-golden { grid-template-columns: 1fr; }
  .ecg-golden-cell { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .ecg-golden-cell:last-child { border-bottom: none; }
  .ecg-content-grid { grid-template-columns: 1fr; }
  .ecg-content-col { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .ecg-content-col:last-child { border-bottom: none; }
  .ecg-step { grid-template-columns: 52px 1fr; }
  .ecg-step-letter { font-size: 38px; }
  .ecg-step-content { padding-left: 18px; }
}
/* ── Polish layer ───────────────────────────────────────────── */
.ecg-guide { background: var(--surface-page); }
.ecg-kicker { color: var(--gold-deep, #8a7350); }
.ecg-headline { font-size: 60px; }
.ecg-byline { border-bottom: none; padding-bottom: 6px; margin-bottom: 0; }
.ecg-pulse {
  display: block;
  width: 100%;
  height: 40px;
  margin-bottom: 40px;
  overflow: visible;
}
.ecg-pulse path {
  stroke: var(--gold, #cbae78);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ecg-pulse-draw 2.6s ease-out 0.3s forwards;
}
@keyframes ecg-pulse-draw { to { stroke-dashoffset: 0; } }

.ecg-golden {
  gap: 14px;
  border: none;
}
.ecg-golden-cell {
  border: 0.5px solid var(--hairline-firm);
  border-radius: 2px;
  background: var(--surface-page);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.ecg-golden-cell:last-child { border-right: 0.5px solid var(--hairline-firm); }
.ecg-golden-cell:hover { transform: translateY(-2px); border-color: var(--gold); box-shadow: var(--shadow-sm); }
.ecg-golden-numeral { color: var(--gold); font-size: 34px; }

.ecg-diagram {
  border-radius: 2px;
  padding: 28px;
  border-color: var(--hairline-firm);
  background: var(--surface-page);
  margin-bottom: 28px;
}
.ecg-diagram-caption { letter-spacing: 0.12em; }

.ecg-key { grid-template-columns: 1fr; }
.ecg-key-col {
  border-radius: 2px;
  padding: 22px 26px;
  background: var(--surface-sunken);
  border-color: var(--hairline-firm);
}
.ecg-key-col.wide { columns: 2; column-gap: 40px; }
.ecg-key-col.wide .ecg-key-title { column-span: all; }
.ecg-key-col.wide .ecg-key-item { break-inside: avoid; }
@media (max-width: 720px) { .ecg-key-col.wide { columns: 1; } }
.ecg-key-dot { box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05); }

.ecg-section-title {
  border: none;
  padding: 18px 0 0;
  margin-top: 56px;
  font-size: 28px;
  position: relative;
}
.ecg-section-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 44px;
  height: 3px;
  border-radius: 999px;
  background: var(--gold);
}

.ecg-rhythm-card {
  border-radius: 2px;
  border-color: var(--hairline-firm);
  border-left: 4px solid var(--hairline-firm);
  background: var(--surface-page);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.ecg-rhythm-card:has(.ecg-rhythm-badge.normal) { border-left-color: var(--teal-600); }
.ecg-rhythm-card:has(.ecg-rhythm-badge.abnormal) { border-left-color: var(--red-600); }
.ecg-rhythm-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.ecg-rhythm-name { font-size: 20px; }
.ecg-rhythm-svg-wrap {
  border-radius: 2px;
  padding: 14px 16px;
  border-color: var(--hairline-firm);
  background-color: rgba(214, 96, 96, 0.035);
  background-image:
    linear-gradient(rgba(214, 96, 96, 0.22) 1px, transparent 1px),
    linear-gradient(90deg, rgba(214, 96, 96, 0.22) 1px, transparent 1px),
    linear-gradient(rgba(214, 96, 96, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(214, 96, 96, 0.09) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px, 12px 12px, 12px 12px;
}
.ecg-rhythm-svg-wrap svg path { stroke-linecap: round; stroke-linejoin: round; }

.ecg-content-grid, .ecg-table { border-radius: 2px; }
.ecg-content-grid { overflow: hidden; border-color: var(--hairline-firm); }
.ecg-table { border-collapse: separate; border-spacing: 0; overflow: hidden; border-color: var(--hairline-firm); }
.ecg-table tbody tr:nth-child(even) td { background: rgba(203, 174, 120, 0.06); }
.ecg-table tbody tr:hover td { background: rgba(203, 174, 120, 0.14); }
.ecg-step { border-top-color: var(--hairline-soft); }
.ecg-step-letter { text-shadow: 0 6px 24px rgba(203, 174, 120, 0.35); }
.ecg-step-badge, .ecg-red-pill { border-radius: 999px; }
.ecg-pearl { border-radius: 2px; border-left: 3px solid var(--gold); }

.ecg-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.ecg-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .ecg-pulse path { animation: none; stroke-dashoffset: 0; }
  .ecg-reveal { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) {
  .ecg-headline { font-size: 36px; }
  .ecg-diagram { padding: 18px; border-radius: 2px; }
  .ecg-golden-cell:nth-child(2) { border-right: 0.5px solid var(--hairline-firm); }
}
@media (max-width: 520px) {
  .ecg-golden-cell { border-bottom: 0.5px solid var(--hairline-firm); }
}
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    number: '1',
    colour: '1',
    name: 'The Conduction Pathway',
    question: 'Where does the electrical signal actually start, and where does it go?',
    cols: [
      {
        header: 'The route',
        items: [
          'SA node (right atrium) – the natural pacemaker',
          '→ spreads across both atria → AV node',
          'AV node: brief delay, lets the ventricles finish filling',
          '→ Bundle of His → left/right bundle branches → Purkinje fibres',
        ],
      },
      {
        header: 'Why the AV delay matters',
        items: [
          'Without it, atria and ventricles would contract almost together',
          'The pause lets blood finish moving from atria into ventricles',
          'This protects effective stroke volume',
        ],
      },
      {
        header: 'Backup pacemakers',
        items: [
          'SA node: intrinsic rate ~60–100 bpm – normally wins',
          'AV node/junctional tissue: ~40–60 bpm if SA node fails',
          'Purkinje/ventricular tissue: ~20–40 bpm as a last resort',
        ],
      },
      {
        header: 'Why this hierarchy matters',
        items: [
          'If a higher pacemaker fails, a lower one can take over – just slower',
          'This is why some bradycardias are still "junctional" rhythms, not asystole',
          'Rate alone hints at which part of the system is actually driving the heart',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'The conduction system has built-in backups. If the SA node fails, the AV node can take over at a slower rate; if that fails too, ventricular tissue can still fire on its own. This is why a slow rhythm is not automatically "no rhythm" – it may be a lower pacemaker doing its job.',
  },
  {
    number: '2',
    colour: '2',
    name: 'Reading the Waveform',
    question: 'What does each part of the trace actually represent underneath?',
    cols: [
      {
        header: 'P wave',
        items: [
          'Atrial depolarisation (the atria being triggered to contract)',
          'Normal: small, rounded, upright in most leads',
          'One P wave should precede each QRS in normal sinus rhythm',
        ],
      },
      {
        header: 'PR interval',
        items: [
          'Start of P wave to start of QRS',
          'Represents the signal travelling through the AV node delay',
          'Normal: roughly 120–200 ms (3–5 small squares)',
        ],
      },
      {
        header: 'QRS complex',
        items: [
          'Ventricular depolarisation – the big contraction signal',
          'Normal: narrow, under ~120 ms (3 small squares)',
          'A wide QRS suggests an abnormal conduction pathway through the ventricles',
        ],
      },
      {
        header: 'ST segment, T wave & QT',
        items: [
          'ST segment: brief pause before the ventricles reset',
          'T wave: ventricular repolarisation – the ventricles resetting electrically',
          'QT interval: total time for ventricular depolarisation + repolarisation',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'A simple way to remember it: P = atria triggered, QRS = ventricles triggered (the big squeeze), T = ventricles resetting. Once that sequence is automatic, most rhythm strips become a pattern-matching exercise rather than a memory test.',
  },
  {
    number: '3',
    colour: '3',
    name: 'Rate & Rhythm: A Structured Approach',
    question: 'Faced with any strip, what is the actual order of questions to ask?',
    cols: [
      {
        header: 'Step 1 & 2',
        items: [
          '1. Rate – too fast, too slow, or normal for age?',
          '2. Regularity – regular, or irregularly irregular?',
          'Do this before trying to name the rhythm',
        ],
      },
      {
        header: 'Step 3 & 4',
        items: [
          '3. Is there a P wave before every QRS?',
          '4. Is the QRS narrow or wide?',
          'These four answers narrow down most common rhythms',
        ],
      },
      {
        header: 'Step 5: the patient',
        items: [
          '5. Is the child/patient perfusing? Pulse, colour, CRT, consciousness',
          'The monitor shows the rhythm; the pulse shows whether it is effective',
          'Pulseless electrical activity (PEA): organised rhythm, no output',
        ],
      },
      {
        header: 'Quick rate calculation',
        items: [
          '300 ÷ number of large squares between R waves (regular rhythm)',
          'Or: count QRS complexes in a 6-second strip × 10',
          'Useful as a fast estimate before a precise count',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'The ECG tells you the rhythm; the patient tells you whether that rhythm is producing effective circulation. Always link the trace back to pulse, colour, and consciousness – a "normal-looking" rhythm with no pulse is a resuscitation emergency, not a reassuring strip.',
  },
  {
    number: '4',
    colour: '4',
    name: 'Common Arrhythmias Compared',
    question: 'How do the everyday abnormal rhythms actually differ from each other?',
    cols: [
      {
        header: 'Sinus tachycardia / bradycardia',
        items: [
          'Normal P-QRS relationship, just faster or slower than expected',
          'Often a response to fever, pain, hypovolaemia, fitness, or medication',
          'Usually not the primary problem – look for the underlying cause',
        ],
      },
      {
        header: 'Atrial fibrillation',
        items: [
          'Irregularly irregular rhythm',
          'No clear, consistent P waves – chaotic atrial activity instead',
          'Common in adults; increases stroke risk due to atrial stasis',
        ],
      },
      {
        header: 'SVT',
        items: [
          'Fast, narrow-complex rhythm, often >200 bpm in children',
          'P waves often absent or hard to see',
          'Classically starts and stops suddenly, unlike a gradual rate rise',
        ],
      },
      {
        header: 'VT / VF & heart block',
        items: [
          'VT: wide-complex, fast, can be life-threatening',
          'VF: chaotic, no organised complexes – no cardiac output at all',
          'Heart block: PR prolongation (1st), dropped beats (2nd), or full AV dissociation (3rd)',
        ],
      },
    ],
    redFlags: ['Wide-complex tachycardia', 'VF or pulseless VT', 'Complete (3rd degree) heart block with symptoms'],
    pearl:
      'Narrow vs wide QRS is one of the fastest ways to triage an unfamiliar fast rhythm. Narrow complexes usually mean the signal is still travelling through the normal conduction pathway; wide complexes suggest it is not – and wide-complex tachycardias are treated with much more caution.',
  },
  {
    number: '5',
    colour: '5',
    name: 'Paediatric vs Adult ECG',
    question: 'Why can a "normal" child’s ECG look alarming if you are only used to reading adult traces?',
    cols: [
      {
        header: 'Heart rate ranges',
        items: [
          'Newborn: roughly 100–160 bpm at rest',
          'Rates fall gradually through childhood towards adult range',
          'A rate that is normal for an infant would be tachycardia in an adult',
        ],
      },
      {
        header: 'Axis & precordial pattern',
        items: [
          'Right axis deviation can be normal in neonates',
          'Reflects a dominant right ventricle at birth',
          'T wave inversion in right-sided chest leads can be a normal juvenile pattern',
        ],
      },
      {
        header: 'Why this matters',
        items: [
          'A finding that would be abnormal in an adult can be normal in a child',
          'Always interpret against age-specific reference ranges',
          'When unsure, compare with the child’s own baseline trace if available',
        ],
      },
      {
        header: 'What stays the same',
        items: [
          'The conduction pathway itself: SA → AV → His → Purkinje',
          'The basic waveform meaning: P, QRS, T represent the same events',
          'The principle of linking rhythm to perfusion, at any age',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'Do not apply adult ECG reference ranges to a child’s trace by habit. Faster resting rates, right axis deviation, and juvenile T wave patterns can all be completely normal in children – the same finding in an adult might prompt real concern.',
  },
  {
    number: '6',
    colour: '6',
    name: 'Nursing Priorities & Escalation',
    question: 'Once you have read the strip, what do you actually do with that information?',
    cols: [
      {
        header: 'Always do this first',
        items: [
          'Check the patient, not just the screen – pulse, colour, consciousness',
          'Confirm lead placement/contact before assuming a true arrhythmia',
          'Compare with the patient’s baseline rhythm if one is known',
        ],
      },
      {
        header: 'Escalate without delay',
        items: [
          'Any new arrhythmia with symptoms (dizziness, chest pain, collapse)',
          'Wide-complex tachycardia',
          'Bradycardia with hypotension or reduced consciousness',
          'Any rhythm on the monitor without a corresponding pulse',
        ],
      },
      {
        header: 'Monitoring considerations',
        items: [
          'Continuous monitoring shows trend; a 12-lead gives more diagnostic detail',
          'Document rate, rhythm, and how the patient tolerated it, not just "abnormal ECG"',
          'Artefact (movement, lead fall-off) can mimic arrhythmia – always correlate clinically',
        ],
      },
      {
        header: 'Communicating findings',
        items: [
          '"The monitor shows the rhythm; the patient tells us whether it is being tolerated."',
          'Describe rate, regularity, P-QRS relationship, and QRS width when handing over',
          'State clearly whether this is new or a known baseline for that patient',
        ],
      },
    ],
    redFlags: [],
    pearl:
      'An ECG finding only matters in context. The same rhythm can be a stable baseline for one patient and a genuine emergency for another – always read the strip alongside the patient in front of you, not in isolation.',
  },
];

const conductionRows = [
  { structure: 'SA node', location: 'Right atrium, near the SVC', role: 'Natural pacemaker; sets the normal heart rate (~60–100 bpm).' },
  { structure: 'AV node', location: 'Between atria and ventricles', role: 'Delays the signal briefly, letting ventricles finish filling before contracting.' },
  { structure: 'Bundle of His', location: 'Interventricular septum', role: 'Carries the signal from the AV node towards the ventricles.' },
  { structure: 'Bundle branches', location: 'Left and right, either side of the septum', role: 'Spread the signal down through each ventricle.' },
  { structure: 'Purkinje fibres', location: 'Throughout the ventricular walls', role: 'Rapidly distribute the signal so both ventricles contract together.' },
];

const waveformRows = [
  { part: 'P wave', represents: 'Atrial depolarisation', normalDuration: 'Small, rounded; part of a ~0.8s cycle at normal rate' },
  { part: 'PR interval', represents: 'AV node delay before ventricular signal', normalDuration: '~120–200 ms (3–5 small squares)' },
  { part: 'QRS complex', represents: 'Ventricular depolarisation', normalDuration: '<120 ms (up to 3 small squares)' },
  { part: 'ST segment', represents: 'Brief pause before ventricles reset', normalDuration: 'Usually isoelectric (flat)' },
  { part: 'T wave', represents: 'Ventricular repolarisation', normalDuration: 'Rounded, usually upright in most leads' },
  { part: 'QT interval', represents: 'Total ventricular depolarisation + repolarisation time', normalDuration: 'Varies with heart rate; corrected as QTc' },
];

const arrhythmiaRows = [
  { rhythm: 'Sinus tachycardia', rate: 'Fast', regularity: 'Regular', pWaves: 'Present, normal', qrs: 'Narrow' },
  { rhythm: 'Sinus bradycardia', rate: 'Slow', regularity: 'Regular', pWaves: 'Present, normal', qrs: 'Narrow' },
  { rhythm: 'Atrial fibrillation', rate: 'Variable, often fast', regularity: 'Irregularly irregular', pWaves: 'Absent/chaotic', qrs: 'Narrow (usually)' },
  { rhythm: 'SVT', rate: 'Very fast (often >200 in children)', regularity: 'Regular', pWaves: 'Often absent/hidden', qrs: 'Narrow' },
  { rhythm: 'Ventricular tachycardia', rate: 'Fast', regularity: 'Usually regular', pWaves: 'Absent/dissociated', qrs: 'Wide' },
  { rhythm: 'Ventricular fibrillation', rate: 'Chaotic, unmeasurable', regularity: 'Chaotic', pWaves: 'Absent', qrs: 'No organised complexes' },
];

const paediatricRateRows = [
  { age: 'Newborn', rate: '100–160 bpm' },
  { age: '1–12 months', rate: '100–150 bpm' },
  { age: '1–5 years', rate: '90–140 bpm' },
  { age: '5–12 years', rate: '70–120 bpm' },
  { age: 'Adolescent/adult', rate: '60–100 bpm' },
];

const quizQuestions = [
  {
    question: 'What happens if the SA node fails to fire?',
    options: [
      'The heart stops immediately with no backup',
      'The AV node/junctional tissue can take over as a slower backup pacemaker',
      'The ventricles immediately go into fibrillation',
      'The PR interval becomes shorter',
    ],
    answer: 1,
    explanation: 'The conduction system has backup pacemakers. If the SA node fails, junctional tissue around the AV node can take over at a slower intrinsic rate (~40–60 bpm), and ventricular tissue can act as a last-resort pacemaker if that also fails.',
  },
  {
    question: 'Why is the AV node delay clinically important?',
    options: [
      'It has no real purpose',
      'It allows the ventricles to finish filling with blood before they contract, protecting stroke volume',
      'It speeds up ventricular contraction',
      'It only matters in children',
    ],
    answer: 1,
    explanation: 'Without the AV node delay, the atria and ventricles would contract almost simultaneously, reducing the time available for the ventricles to fill and lowering stroke volume.',
  },
  {
    question: 'A rhythm strip shows a fast, regular, narrow-complex rhythm with no visible P waves that started suddenly. What does this most likely represent?',
    options: ['Sinus tachycardia', 'SVT', 'Ventricular tachycardia', 'Complete heart block'],
    answer: 1,
    explanation: 'SVT classically presents as a fast, regular, narrow-complex rhythm with absent or hidden P waves, and it typically starts and stops abruptly rather than rising gradually like sinus tachycardia.',
  },
  {
    question: 'Why is a wide QRS complex in a tachycardia treated with more caution than a narrow one?',
    options: [
      'Wide complexes are always less serious',
      'A wide QRS suggests the signal is not travelling through the normal conduction pathway, which is associated with more dangerous rhythms like VT',
      'QRS width has no clinical significance',
      'Wide complexes only occur in children',
    ],
    answer: 1,
    explanation: 'A wide QRS suggests abnormal ventricular conduction, which is associated with potentially life-threatening rhythms such as ventricular tachycardia, so wide-complex tachycardias are managed with more caution than narrow-complex ones.',
  },
  {
    question: 'Why can right axis deviation be a normal finding on a neonate’s ECG?',
    options: [
      'It is never normal at any age',
      'It reflects the dominant right ventricle present at birth, which shifts towards adult patterns over time',
      'It always indicates congenital heart disease',
      'Neonates do not have a measurable cardiac axis',
    ],
    answer: 1,
    explanation: 'At birth the right ventricle is relatively dominant, so right axis deviation on a neonatal ECG can be a normal developmental finding rather than a sign of pathology.',
  },
  {
    question: 'What does pulseless electrical activity (PEA) mean?',
    options: [
      'The heart has stopped generating any electrical activity',
      'An organised rhythm is present on the monitor, but it is not producing an effective pulse or circulation',
      'It is another name for ventricular fibrillation',
      'It only applies to paediatric patients',
    ],
    answer: 1,
    explanation: 'PEA describes a situation where the ECG shows an organised electrical rhythm, but there is no effective cardiac output or palpable pulse – a key reminder that the trace and the patient must always be assessed together.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function EcgCardiacConductionPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.ecg-guide .ecg-step, .ecg-guide .ecg-rhythm-card, .ecg-guide .ecg-diagram, .ecg-guide .ecg-key-col, .ecg-guide .ecg-golden-cell'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('ecg-reveal');
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);


  return (
    <div className="ecg-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ecg-wrap">
        <Link href="/hub" className="ecg-back">
          <span className="ecg-back-arrow">&larr;</span>
          Nursing Hub
        </Link>

        <p className="ecg-kicker">Anatomy &amp; Physiology &middot; Children&apos;s &amp; Adult Nursing</p>
        <h1 className="ecg-headline">ECG &amp; Cardiac Conduction</h1>
        <p className="ecg-standfirst">
          Where the heartbeat actually starts, how to read a waveform, a structured way to approach any rhythm strip, and the common arrhythmias compared side by side &mdash; for both branches.
        </p>
        <p className="ecg-byline">Children&apos;s &amp; adult nursing &middot; The Nurse Lab</p>
        <svg className="ecg-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" pathLength={1} />
        </svg>
        <EditorialSaveButton
          hubItemId="ecg-cardiac-conduction"
          hubItemTitle="ECG & Cardiac Conduction"
        />

        <div className="ecg-pearl" style={{ marginBottom: '32px' }}>
          <p className="ecg-pearl-label">Student note</p>
          <p>Depolarisation is the electrical trigger for contraction; repolarisation is the cell resetting afterwards. SVT stands for supraventricular tachycardia. VT and VF are ventricular tachycardia and ventricular fibrillation. PEA is pulseless electrical activity &mdash; an organised rhythm with no effective circulation.</p>
        </div>

        <div className="ecg-diagram">
          <InteractiveHeart />
          <p className="ecg-diagram-caption">Tap the dots to explore the heart, or follow one full loop of blood &mdash; worth holding in mind as you read the conduction pathway below</p>
          <div className="ad-sheet"><SheetLinks slug="heart" /></div>
        </div>

        <div className="ecg-golden">
          {[
            { n: '01', title: 'The route', text: 'SA node → AV node → Bundle of His → bundle branches → Purkinje fibres.' },
            { n: '02', title: 'P-QRS-T', text: 'P = atria triggered. QRS = ventricles triggered. T = ventricles resetting.' },
            { n: '03', title: '5-step approach', text: 'Rate → regularity → P before QRS? → narrow/wide QRS? → is the patient perfusing?' },
            { n: '04', title: 'Trace vs patient', text: 'The monitor shows the rhythm; the pulse shows whether it is actually effective.' },
          ].map((cell) => (
            <div key={cell.n} className="ecg-golden-cell">
              <span className="ecg-golden-numeral">{cell.n}</span>
              <p className="ecg-golden-title">{cell.title}</p>
              <p className="ecg-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {SECTIONS.map((section) => (
          <div key={section.number} className="ecg-step">
            <div className="ecg-step-sidebar">
              <span className={`ecg-step-letter ecg-letter-${section.colour}`}>{section.number}</span>
              <span className={`ecg-step-badge ecg-badge-${section.colour}`}>{section.name.split(' ')[0]}</span>
            </div>

            <div className="ecg-step-content">
              <h2 className="ecg-step-name">{section.name}</h2>
              <p className="ecg-step-question">{section.question}</p>

              <div className="ecg-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="ecg-content-col">
                    <p className="ecg-col-header">{col.header}</p>
                    <ul className="ecg-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {section.redFlags.length > 0 && (
                <>
                  <p className="ecg-redflags-label">Red flags</p>
                  <div className="ecg-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="ecg-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {section.pearl && (
                <div className="ecg-pearl">
                  <p className="ecg-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="ecg-diagram">
          <ConductionDiagram />
          <p className="ecg-diagram-caption">The conduction system, step by step &mdash; each label shows what happens and where it appears on the ECG</p>
          <div className="ad-sheet"><SheetLinks slug="conduction" /></div>
        </div>

        <h2 className="ecg-section-title">Try it: Explore One Heartbeat</h2>
        <div className="ecg-diagram">
          <InteractiveEcgBeat />
          <p className="ecg-diagram-caption">Drag the handle along the trace, or tap a wave, segment or interval</p>
        </div>

        <div className="ecg-key">
          <div className="ecg-key-col wide">
            <p className="ecg-key-title">Reading the trace</p>
            <div className="ecg-key-item"><span className="ecg-key-dot" style={{ background: 'var(--ink-mid)' }} /><span><strong>P wave</strong>Atrial depolarisation: the atria contract.</span></div>
            <div className="ecg-key-item"><span className="ecg-key-dot" style={{ background: '#3aa15a' }} /><span><strong>PR segment (green)</strong>The flat line while the AV node delays the signal.</span></div>
            <div className="ecg-key-item"><span className="ecg-key-dot" style={{ background: '#f5a623' }} /><span><strong>PR interval (orange)</strong>Start of the P wave to the start of the QRS: the whole trip from atria to ventricles. Normally 0.12&ndash;0.20 s.</span></div>
            <div className="ecg-key-item"><span className="ecg-key-dot" style={{ background: '#e5484d' }} /><span><strong>QRS complex (red)</strong>Ventricular depolarisation: the big squeeze. Q is the first small dip, R the tall spike, S the dip after. Normally narrow (under 0.12 s). The atria are also resetting here, but it is hidden by the QRS.</span></div>
            <div className="ecg-key-item"><span className="ecg-key-dot" style={{ background: '#8b6fc0' }} /><span><strong>ST segment (purple)</strong>The ventricles are fully depolarised and the trace is normally flat. Raised or dipped ST can point to cardiac ischaemia or infarction.</span></div>
            <div className="ecg-key-item"><span className="ecg-key-dot" style={{ background: 'var(--ink-mid)' }} /><span><strong>T wave</strong>Ventricular repolarisation: the ventricles reset ready for the next beat.</span></div>
            <div className="ecg-key-item"><span className="ecg-key-dot" style={{ background: '#3b7fc0' }} /><span><strong>QT interval (blue)</strong>Start of QRS to the end of the T wave: the ventricles&apos; whole electrical cycle. Too long can trigger dangerous rhythms.</span></div>
          </div>
        </div>

        <h2 className="ecg-section-title">Conduction Pathway Reference</h2>
        <table className="ecg-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Structure</th>
              <th>Location</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {conductionRows.map((row) => (
              <tr key={row.structure}>
                <td>{row.structure}</td>
                <td>{row.location}</td>
                <td>{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="ecg-section-title">Waveform Reference</h2>
        <table className="ecg-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Part</th>
              <th>Represents</th>
              <th>Normal duration/appearance</th>
            </tr>
          </thead>
          <tbody>
            {waveformRows.map((row) => (
              <tr key={row.part}>
                <td>{row.part}</td>
                <td>{row.represents}</td>
                <td>{row.normalDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="ecg-section-title">Common Arrhythmias Compared</h2>
        <table className="ecg-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Rhythm</th>
              <th>Rate</th>
              <th>Regularity</th>
              <th>P waves</th>
              <th>QRS</th>
            </tr>
          </thead>
          <tbody>
            {arrhythmiaRows.map((row) => (
              <tr key={row.rhythm}>
                <td>{row.rhythm}</td>
                <td>{row.rate}</td>
                <td>{row.regularity}</td>
                <td>{row.pWaves}</td>
                <td>{row.qrs}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ecg-pearl" style={{ marginBottom: '32px' }}>
          <p className="ecg-pearl-label">Exam tip</p>
          <p>Heart block is graded by how much the AV node delay is disrupted: 1st degree just prolongs the PR interval; 2nd degree drops occasional beats; 3rd degree (complete) loses the connection entirely, so atria and ventricles beat independently of each other.</p>
        </div>

        <h2 className="ecg-section-title">Normal vs Abnormal: See the Difference</h2>
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '20px', maxWidth: '70ch' }}>
          Five simplified rhythm strips, redrawn to make the shape of each problem obvious &mdash; not exact patient traces, but the same pattern you would learn to spot one.
        </p>

        <div className="ecg-rhythm-card">
          <div className="ecg-rhythm-header">
            <span className="ecg-rhythm-name">Normal Sinus Rhythm</span>
            <span className="ecg-rhythm-badge normal">Normal</span>
          </div>
          <div className="ecg-rhythm-svg-wrap">
            <svg viewBox="0 0 600 100" role="img" aria-label="Normal sinus rhythm: regular, evenly spaced P-QRS-T complexes">
              <path d="M0,50 L20,50 L24,44 L28,50 L46,50 L48,58 L50,8 L52,64 L54,50 L62,50 L74,50 L80,40 L92,50 L200,50 L220,50 L224,44 L228,50 L246,50 L248,58 L250,8 L252,64 L254,50 L262,50 L274,50 L280,40 L292,50 L400,50 L420,50 L424,44 L428,50 L446,50 L448,58 L450,8 L452,64 L454,50 L462,50 L474,50 L480,40 L492,50 L600,50" fill="none" style={{ stroke: 'var(--teal-600)', strokeWidth: 2 }} />
            </svg>
          </div>
          <p className="ecg-rhythm-explain">
            <strong>Why it&apos;s normal:</strong> every QRS is preceded by a P wave, the P–R gap is consistent, the QRS is narrow, and the beats are evenly spaced. This is the SA node driving the heart exactly as it should.
          </p>
        </div>

        <div className="ecg-rhythm-card">
          <div className="ecg-rhythm-header">
            <span className="ecg-rhythm-name">Atrial Fibrillation</span>
            <span className="ecg-rhythm-badge abnormal">Abnormal</span>
          </div>
          <div className="ecg-rhythm-svg-wrap">
            <svg viewBox="0 0 600 100" role="img" aria-label="Atrial fibrillation: irregularly spaced QRS complexes with no clear P waves and a wavy baseline">
              <path d="M0,50 L2,53 L6,47 L10,52 L14,48 L16,56 L18,8 L20,64 L22,50 L30,50 L36,40 L46,50 L50,53 L58,47 L66,52 L74,48 L82,53 L90,47 L98,52 L106,48 L114,53 L122,47 L130,52 L138,48 L140,56 L142,8 L144,64 L146,50 L154,50 L160,40 L170,50 L176,53 L184,47 L192,52 L200,48 L208,53 L216,47 L224,52 L232,48 L234,56 L236,8 L238,64 L240,50 L248,50 L254,40 L264,50 L270,53 L278,47 L286,52 L294,48 L302,53 L310,47 L318,52 L326,48 L334,53 L342,47 L350,52 L358,48 L366,53 L374,47 L382,52 L390,48 L392,56 L394,8 L396,64 L398,50 L406,50 L412,40 L422,50 L430,53 L438,47 L446,52 L454,48 L462,53 L470,47 L478,52 L486,48 L494,53 L502,47 L510,52 L518,48 L520,56 L522,8 L524,64 L526,50 L534,50 L540,40 L550,50 L558,53 L566,47 L574,52 L582,48 L590,53 L598,47 L600,50" fill="none" style={{ stroke: 'var(--red-600)', strokeWidth: 2 }} />
            </svg>
          </div>
          <p className="ecg-rhythm-explain">
            <strong>Why it&apos;s abnormal:</strong> no organised P waves &mdash; just a chaotic, wavy baseline from disorganised atrial activity &mdash; and the gap between QRS complexes keeps changing. This is the &ldquo;irregularly irregular&rdquo; pattern that defines AF.
          </p>
        </div>

        <div className="ecg-rhythm-card">
          <div className="ecg-rhythm-header">
            <span className="ecg-rhythm-name">SVT (Supraventricular Tachycardia)</span>
            <span className="ecg-rhythm-badge abnormal">Abnormal</span>
          </div>
          <div className="ecg-rhythm-svg-wrap">
            <svg viewBox="0 0 600 100" role="img" aria-label="SVT: very fast, regular, narrow-complex rhythm with no visible P waves">
              <path d="M0,50 L4,56 L6,10 L8,62 L10,50 L18,50 L24,42 L34,50 L75,50 L79,56 L81,10 L83,62 L85,50 L93,50 L99,42 L109,50 L150,50 L154,56 L156,10 L158,62 L160,50 L168,50 L174,42 L184,50 L225,50 L229,56 L231,10 L233,62 L235,50 L243,50 L249,42 L259,50 L300,50 L304,56 L306,10 L308,62 L310,50 L318,50 L324,42 L334,50 L375,50 L379,56 L381,10 L383,62 L385,50 L393,50 L399,42 L409,50 L450,50 L454,56 L456,10 L458,62 L460,50 L468,50 L474,42 L484,50 L525,50 L529,56 L531,10 L533,62 L535,50 L543,50 L549,42 L559,50 L600,50" fill="none" style={{ stroke: 'var(--red-600)', strokeWidth: 2 }} />
            </svg>
          </div>
          <p className="ecg-rhythm-explain">
            <strong>Why it&apos;s abnormal:</strong> the rate is far too fast for the P waves to be seen at all, but the QRS stays narrow and regular &mdash; the signal is still using the normal conduction pathway, just firing much too quickly and starting/stopping suddenly.
          </p>
        </div>

        <div className="ecg-rhythm-card">
          <div className="ecg-rhythm-header">
            <span className="ecg-rhythm-name">Ventricular Tachycardia</span>
            <span className="ecg-rhythm-badge abnormal">Abnormal</span>
          </div>
          <div className="ecg-rhythm-svg-wrap">
            <svg viewBox="0 0 600 100" role="img" aria-label="Ventricular tachycardia: fast, regular, wide and bizarre-shaped complexes">
              <path d="M0,50 L10,50 L20,70 L35,15 L55,75 L75,45 L90,50 L120,50 L130,50 L140,70 L155,15 L175,75 L195,45 L210,50 L240,50 L250,50 L260,70 L275,15 L295,75 L315,45 L330,50 L360,50 L370,50 L380,70 L395,15 L415,75 L435,45 L450,50 L480,50 L490,50 L500,70 L515,15 L535,75 L555,45 L570,50 L600,50" fill="none" style={{ stroke: 'var(--red-600)', strokeWidth: 2.5 }} />
            </svg>
          </div>
          <p className="ecg-rhythm-explain">
            <strong>Why it&apos;s abnormal:</strong> the complexes are wide and oddly shaped instead of the usual sharp, narrow spike &mdash; the signal is spreading through the ventricles abnormally rather than down the normal conduction pathway. Fast, wide, and regular like this needs urgent attention.
          </p>
        </div>

        <div className="ecg-rhythm-card">
          <div className="ecg-rhythm-header">
            <span className="ecg-rhythm-name">Complete Heart Block</span>
            <span className="ecg-rhythm-badge abnormal">Abnormal</span>
          </div>
          <div className="ecg-rhythm-svg-wrap">
            <svg viewBox="0 0 600 100" role="img" aria-label="Complete heart block: P waves and QRS complexes each regular but running at independent rates">
              <path d="M0,50 L2,58 L4,8 L6,64 L8,50 L16,50 L22,40 L34,50 L150,50 L152,58 L154,8 L156,64 L158,50 L166,50 L172,40 L184,50 L300,50 L302,58 L304,8 L306,64 L308,50 L316,50 L322,40 L334,50 L450,50 L452,58 L454,8 L456,64 L458,50 L466,50 L472,40 L484,50 L600,50" fill="none" style={{ stroke: 'var(--red-600)', strokeWidth: 2.5 }} />
              <path d="M0,50 L4,44 L8,50 L65,50 L69,44 L73,50 L130,50 L134,44 L138,50 L195,50 L199,44 L203,50 L260,50 L264,44 L268,50 L325,50 L329,44 L333,50 L390,50 L394,44 L398,50 L455,50 L459,44 L463,50 L520,50 L524,44 L528,50 L585,50 L589,44 L593,50 L600,50" fill="none" style={{ stroke: 'var(--blue-600)', strokeWidth: 1.5, strokeDasharray: '3 2' }} />
            </svg>
          </div>
          <div className="ecg-rhythm-key">
            <span><i style={{ background: 'var(--blue-600)' }} />P waves (atrial rate)</span>
            <span><i style={{ background: 'var(--red-600)' }} />QRS-T (ventricular rate)</span>
          </div>
          <p className="ecg-rhythm-explain">
            <strong>Why it&apos;s abnormal:</strong> the dashed P waves march along at their own steady (faster) rate, completely independent of the solid QRS-T complexes at their own steady (slower) rate. The AV node connection has been lost entirely &mdash; atria and ventricles are no longer &ldquo;talking&rdquo; to each other at all.
          </p>
        </div>

        <h2 className="ecg-section-title">Paediatric Resting Heart Rate by Age</h2>
        <table className="ecg-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Age</th>
              <th>Typical resting rate</th>
            </tr>
          </thead>
          <tbody>
            {paediatricRateRows.map((row) => (
              <tr key={row.age}>
                <td>{row.age}</td>
                <td>{row.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="ecg-section-title">Quick Mnemonic Recap</h2>
        <div className="ecg-golden" style={{ marginBottom: '40px' }}>
          {[
            { n: '01', title: 'The pathway', text: 'SA → AV → Bundle of His → bundle branches → Purkinje fibres' },
            { n: '02', title: 'Backup rates', text: 'SA ~60–100 → junctional ~40–60 → ventricular ~20–40 bpm' },
            { n: '03', title: 'Narrow vs wide', text: 'Narrow = normal pathway. Wide = abnormal ventricular conduction, treat with caution' },
            { n: '04', title: 'Always ask', text: 'Is the patient actually perfusing this rhythm?' },
          ].map((cell) => (
            <div key={cell.n} className="ecg-golden-cell">
              <span className="ecg-golden-numeral">{cell.n}</span>
              <p className="ecg-golden-title">{cell.title}</p>
              <p className="ecg-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        <h2 className="ecg-section-title" style={{ marginTop: '44px', marginBottom: '18px' }}>
          Quick self-test
        </h2>
        <SelfTestQuiz title="Test Yourself: ECG & Cardiac Conduction" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'Resuscitation Council UK (2021)', title: '2021 Resuscitation Guidelines', href: 'https://www.resus.org.uk/library/2021-resuscitation-guidelines' },
          { citation: 'Waugh A & Grant A (2018)', title: 'Ross and Wilson Anatomy and Physiology in Health and Illness (13th edn)', href: 'https://www.elsevier.com/' },
          { citation: 'NICE (2021)', title: 'Atrial fibrillation: diagnosis and management (NG196)', href: 'https://www.nice.org.uk/guidance/ng196' },
          { citation: 'Park MK & Salamat MK (2020)', title: 'Park’s Pediatric Cardiology for Practitioners (7th edn)', href: 'https://www.elsevier.com/' },
        ]} />
      </div>
    </div>
  );
}
