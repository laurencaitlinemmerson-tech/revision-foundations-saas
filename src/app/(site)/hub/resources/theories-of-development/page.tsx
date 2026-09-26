'use client';

import { useEffect } from 'react';/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import SelfTestQuiz from '@/components/SelfTestQuiz';
import { SourceLinks } from '@/components/hub/StudyComponents';

// ─── Quiz Data ─────────────────────────────────────────────────────────────────

const quizQuestions = [
  { question: 'Which theorist described how children THINK in stages?', options: ['Erikson', 'Piaget', 'Bowlby', 'Bandura'], answer: 1 },
  { question: 'In Piaget\'s preoperational stage (2\u20137 years), a child may believe they caused their illness. What should you do?', options: ['Ignore it', 'Reassure them it is not their fault', 'Tell them they are wrong', 'Discuss it only with parents'], answer: 1 },
  { question: 'Which Erikson stage involves the question "Who am I?"', options: ['Trust vs Mistrust', 'Autonomy vs Shame', 'Identity vs Role Confusion', 'Initiative vs Guilt'], answer: 2 },
  { question: 'What attachment pattern shows no clear pattern and is linked to abuse or neglect?', options: ['Secure', 'Insecure-Avoidant', 'Insecure-Resistant', 'Disorganised'], answer: 3 },
  { question: 'What is Vygotsky\'s "Zone of Proximal Development"?', options: ['What a child can do alone', 'The gap between solo ability and guided ability', 'The area of the brain that develops last', 'The distance from home to school'], answer: 1 },
  { question: 'Which theorist said children learn by observing and imitating?', options: ['Kohlberg', 'Freud', 'Bandura', 'Bowlby'], answer: 2 },
  { question: 'In Kohlberg\'s pre-conventional stage, what drives a young child\'s sense of right and wrong?', options: ['Abstract moral principles', 'Avoiding punishment and self-interest', 'Social approval', 'Following the law'], answer: 1 },
  { question: 'Who developed the Ecological Systems Theory (micro, meso, exo, macrosystem)?', options: ['Bronfenbrenner', 'Vygotsky', 'Erikson', 'Piaget'], answer: 0 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.td-guide *, .td-guide *::before, .td-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.td-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.td-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 32px 48px 64px;
}

/* Back nav */
.td-back {
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
.td-back:hover { color: var(--ink-soft); }
.td-back-arrow { font-style: normal; }

/* Masthead */
.td-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.td-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: var(--ink-strong);
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.td-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.td-byline {
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 24px;
  border-bottom: 0.5px solid var(--hairline-firm);
  margin-bottom: 36px;
}

/* Pearl */
.td-pearl {
  background: var(--amber-50);
  padding: 14px 18px;
  border-radius: 0;
}

.td-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 6px;
}

.td-pearl p {
  font-size: 12px;
  color: var(--amber-800);
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step sections */
.td-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 36px;
  border-top: 0.5px solid var(--hairline-firm);
  padding-top: 24px;
}

.td-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid var(--hairline-firm);
  padding-top: 4px;
}

.td-step-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 10px;
}

.td-step-badge {
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}

.td-step-content {
  padding-left: 32px;
}

.td-step-name {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 3px;
  line-height: 1.2;
}

.td-step-question {
  font-size: 13px;
  font-style: italic;
  color: var(--ink-faint);
  margin-bottom: 22px;
}

.td-step-intro {
  font-size: 14px;
  color: var(--ink-soft);
  font-weight: 300;
  line-height: 1.7;
  margin-bottom: 20px;
}

/* 4-column content grid */
.td-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 18px;
}

.td-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid var(--hairline-firm);
}
.td-content-col:last-child { border-right: none; }

.td-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--hairline-firm);
}

.td-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.td-col-list li {
  font-size: 12px;
  color: var(--ink-soft);
  line-height: 1.55;
  padding: 2px 0;
  font-weight: 300;
  padding-left: 10px;
  position: relative;
}
.td-col-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: var(--ink-faint);
}

/* Red flags */
.td-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--red-600);
  margin-bottom: 7px;
}

.td-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.td-red-pill {
  font-size: 11px;
  background: var(--red-50);
  color: var(--red-600);
  padding: 3px 11px;
  border-radius: 0;
  font-weight: 300;
}

/* Table */
.td-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 0;
  font-size: 13px;
}

.td-table th {
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
.td-table th:last-child { border-right: none; }

.td-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: var(--ink-soft);
  border-bottom: 0.5px solid var(--hairline-soft);
  border-right: 0.5px solid var(--hairline-soft);
  font-weight: 300;
}
.td-table td:last-child { border-right: none; }
.td-table tr:last-child td { border-bottom: none; }
.td-table td:first-child { font-weight: 400; color: var(--ink-mid); }

/* Section headings */
.td-section-title {
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

/* Golden rules grid (for quick ref) */
.td-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 60px;
}

.td-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid var(--hairline-firm);
}
.td-golden-cell:last-child { border-right: none; }

.td-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: var(--hairline-firm);
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.td-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: var(--ink-mid);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 7px;
}

.td-golden-text {
  font-size: 12px;
  color: #777;
  line-height: 1.55;
  font-weight: 300;
}

/* Step colour system */
.td-num-1 { color: var(--blue-600); }
.td-badge-1 { background: var(--blue-50); color: var(--blue-800); }
.td-num-2 { color: var(--teal-600); }
.td-badge-2 { background: var(--teal-50); color: var(--teal-800); }
.td-num-3 { color: var(--coral-600); }
.td-badge-3 { background: var(--coral-50); color: var(--coral-800); }
.td-num-4 { color: var(--purple-600); }
.td-badge-4 { background: var(--purple-50); color: var(--purple-800); }
.td-num-5 { color: var(--gray-600); }
.td-badge-5 { background: var(--surface-sunken); color: var(--gray-800); }
.td-num-6 { color: #8B5E3C; }
.td-badge-6 { background: var(--surface-sunken); color: #5C3D25; }

/* Responsive */
@media (max-width: 860px) {
  .td-wrap { padding: 24px 20px 48px; }
  .td-headline { font-size: 36px; }
  .td-step { grid-template-columns: 1fr; }
  .td-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid var(--hairline-firm); padding-bottom: 16px; padding-right: 0; margin-bottom: 20px; }
  .td-step-numeral { font-size: 48px; }
  .td-step-content { padding-left: 0; }
  .td-content-grid { grid-template-columns: repeat(2, 1fr); }
  .td-content-col:nth-child(2) { border-right: none; }
  .td-content-col:nth-child(n+3) { border-top: 0.5px solid var(--hairline-firm); }
  .td-golden { grid-template-columns: repeat(2, 1fr); }
  .td-golden-cell:nth-child(2) { border-right: none; }
  .td-golden-cell:nth-child(n+3) { border-top: 0.5px solid var(--hairline-firm); }
}
/* ── Polish layer ───────────────────────────────────────────── */
.td-kicker { color: var(--gold-deep, #8a7350); }
.td-headline { font-size: 56px; }
.td-byline { border-bottom: none; padding-bottom: 6px; margin-bottom: 0; }
.td-pulse { display: block; width: 100%; height: 40px; margin-bottom: 40px; overflow: visible; }
.td-pulse path { stroke: var(--gold, #cbae78); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; stroke-dasharray: 1; stroke-dashoffset: 1; animation: td-pulse-draw 2.6s ease-out 0.3s forwards; }
@keyframes td-pulse-draw { to { stroke-dashoffset: 0; } }
.td-golden { gap: 14px; border: none; }
.td-golden-cell { border: 0.5px solid var(--hairline-firm); border-radius: 2px; background: var(--surface-page); transition: transform 0.2s ease, border-color 0.2s ease; }
.td-golden-cell:last-child { border-right: 0.5px solid var(--hairline-firm); }
.td-golden-cell:hover { transform: translateY(-2px); border-color: var(--gold); }
.td-golden-numeral { color: var(--gold); font-size: 34px; }
.td-section-title { border: none; padding: 18px 0 0; margin-top: 56px; font-size: 28px; position: relative; }
.td-section-title::before { content: ''; position: absolute; top: 0; left: 0; width: 44px; height: 3px; border-radius: 999px; background: var(--gold); }
.td-content-grid, .td-table { border-radius: 2px; }
.td-content-grid { overflow: hidden; border-color: var(--hairline-firm); }
.td-table { border-collapse: separate; border-spacing: 0; overflow: hidden; border-color: var(--hairline-firm); }
.td-table th { background: transparent; color: var(--gold-deep, #8a7350); border-bottom-color: var(--hairline-firm); }
.td-table td { padding-top: 12px; padding-bottom: 12px; line-height: 1.65; }
.td-table td:first-child { font-family: 'Playfair Display', Georgia, serif; font-size: 15px; color: var(--ink-strong); }
.td-table tbody tr:nth-child(even) td { background: rgba(203, 174, 120, 0.06); }
.td-table tbody tr:hover td { background: rgba(203, 174, 120, 0.14); }
.td-step { border-top-color: var(--hairline-soft); }
.td-step-letter { text-shadow: none; }
.td-step-name { font-size: 34px; }
.td-step-badge, .td-red-pill { border-radius: 999px; }
.td-pearl { background: transparent; border: 0.5px solid var(--hairline-firm); border-left: 3px solid var(--gold); border-radius: 2px; padding: 18px 24px; }
.td-pearl-label { color: var(--gold-deep, #8a7350); font-size: 10px; letter-spacing: 0.18em; margin-bottom: 8px; }
.td-pearl p { color: var(--ink-mid); font-size: 13.5px; line-height: 1.75; }
.td-diagram { border-radius: 2px; border-color: var(--hairline-firm); background: var(--surface-page); }
.td-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.6s ease, transform 0.6s ease; }
.td-reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .td-pulse path { animation: none; stroke-dashoffset: 0; }
  .td-reveal { opacity: 1; transform: none; transition: none; }
}
@media (max-width: 860px) { .td-headline { font-size: 36px; } .td-step-name { font-size: 26px; } }
`;


// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    num: '1',
    colour: '1',
    name: 'Piaget — Cognitive Development',
    badge: 'Thinking',
    question: 'How do children think, and how does that change with age?',
    intro: 'Piaget is about how children think. His main idea is that children are not just mini adults. Their understanding changes in stages, so the explanation that works for a teenager will not land in the same way for a toddler.',
    cols: [
      {
        header: 'Sensorimotor (0–2 yrs)',
        items: [
          'Learning through movement, touch, sight, sound',
          'Gradually learn object permanence',
          'Use distraction for procedures',
          'Infant may cry when parent leaves',
          'Allow comfort objects',
        ],
      },
      {
        header: 'Preoperational (2–7 yrs)',
        items: [
          'Big imagination and pretend play',
          'Thinking is still very child-centred',
          'May believe they caused their illness',
          'Use simple, concrete explanations',
          'Demonstrate on a teddy or doll',
          'Reassure it is not their fault',
        ],
      },
      {
        header: 'Concrete Op. (7–11 yrs)',
        items: [
          'More logical thinking about real things',
          'Can follow clear cause and effect',
          'Understands another person\'s view better',
          'Include child in discussions',
          'Give logical explanations',
          'They can learn about their condition',
        ],
      },
      {
        header: 'Formal Op. (12+ yrs)',
        items: [
          'Can think about ideas and "what if"',
          'Future consequences make sense now',
          'Involve them in care decisions',
          'Discuss longer-term implications',
          'Consider Gillick competence',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    num: '2',
    colour: '2',
    name: 'Erikson — Psychosocial Development',
    badge: 'Feeling',
    question: 'What emotional and social tasks does each age group face?',
    intro: 'Erikson is about the social and emotional tasks of growing up. Each stage has a big question or struggle to work through, and that changes what support feels most helpful.',
    cols: [
      {
        header: 'Trust vs Mistrust (0–1 yr)',
        items: [
          '"Can I trust the world?"',
          'Keep routines consistent',
          'Involve parents throughout',
          'Respond to cries promptly',
        ],
      },
      {
        header: 'Autonomy vs Shame (1–3 yrs)',
        items: [
          '"Me do it!"',
          'Offer simple choices',
          'Allow some control',
          'Be patient with attempts',
        ],
      },
      {
        header: 'Initiative vs Guilt (3–6 yrs)',
        items: [
          '"Am I good or bad?"',
          'Encourage questions',
          'Use play for procedures',
          'Praise appropriate curiosity',
        ],
      },
      {
        header: 'Identity vs Confusion (12–18)',
        items: [
          '"Who am I?"',
          'Respect autonomy',
          'Address body image concerns',
          'Involve in care decisions',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
  {
    num: '3',
    colour: '3',
    name: 'Bowlby — Attachment Theory',
    badge: 'Bonding',
    question: 'How do early relationships shape a child\'s sense of safety?',
    intro: 'Bowlby is about how early relationships shape a child\'s sense of safety. Ainsworth\'s Strange Situation then described common attachment patterns you might notice in real children and families.',
    cols: [
      {
        header: 'Secure',
        items: [
          'Uses caregiver as safe base',
          'Distressed when separated',
          'Easily comforted on reunion',
          'Develops from consistent, responsive care',
        ],
      },
      {
        header: 'Insecure–Avoidant',
        items: [
          'Avoids caregiver',
          'Little distress at separation',
          'Ignores on reunion',
          'Often from emotionally unavailable parenting',
        ],
      },
      {
        header: 'Insecure–Resistant',
        items: [
          'Very distressed at separation',
          'Hard to comfort on reunion',
          'From inconsistent caregiving',
          'Also called ambivalent attachment',
        ],
      },
      {
        header: 'Disorganised',
        items: [
          'No clear pattern',
          'Confused or contradictory behaviours',
          'Often linked to abuse or neglect',
          'Highest risk for later difficulties',
        ],
      },
    ],
    redFlags: ['Signs of disorganised attachment', 'Concerning parent-child interactions'],
    pearl: 'Keep parents with children wherever possible, prepare children for separations, watch for signs of attachment difficulties, and think about attachment when you are worried about safeguarding. Supporting parent-infant bonding matters even more when a baby is premature or unwell.',
  },
  {
    num: '4',
    colour: '4',
    name: 'Vygotsky — Social Development Theory',
    badge: 'Learning',
    question: 'How do children learn with the help of others?',
    intro: null,
    cols: [
      {
        header: 'Zone of Proximal Dev.',
        items: [
          'The "almost but not quite alone" zone',
          'Gap between solo ability and guided ability',
          'Where real learning happens',
        ],
      },
      {
        header: 'Scaffolding',
        items: [
          'Temporary support to help succeed',
          'Reduce support as confidence grows',
          'Think of it like training wheels',
        ],
      },
      {
        header: 'More Knowledgeable Other',
        items: [
          'Parent, teacher, nurse, sibling, or peer',
          'Anyone who knows a bit more',
          'Guides the learner through ZPD',
        ],
      },
      {
        header: 'Clinical Application',
        items: [
          'Guide self-care step by step at first',
          'Step back as confidence grows',
          'Peer support helps — children learn from others',
          'E.g., inhaler technique teaching',
        ],
      },
    ],
    redFlags: [],
    pearl: 'When teaching a child self-care skills such as inhaler technique, guide them step by step at first, then gradually step back as they become more confident. Peer support can help too, because children often learn well from others who have been through the same thing.',
  },
  {
    num: '5',
    colour: '5',
    name: 'Kohlberg — Moral Development',
    badge: 'Morals',
    question: 'How does a child\'s sense of right and wrong evolve?',
    intro: null,
    cols: [
      {
        header: 'Pre-Conventional',
        items: [
          'Stage 1: Avoid punishment (~2–6 yrs)',
          '"It\'s wrong because I\'ll get in trouble"',
          'Stage 2: Self-interest (~6–9 yrs)',
          '"What\'s in it for me? Fair exchange"',
        ],
      },
      {
        header: 'Conventional',
        items: [
          'Stage 3: Good boy/girl (adolescence)',
          'Want approval; relationships matter',
          'Stage 4: Law and order (adulthood)',
          'Rules and authority are important',
        ],
      },
      {
        header: 'Post-Conventional',
        items: [
          'Stage 5: Social contract (some adults)',
          'Rules can be changed for greater good',
          'Stage 6: Universal principles (few adults)',
          'Personal ethics may override law',
        ],
      },
      {
        header: 'Clinical Application',
        items: [
          'Young children — link to concrete consequences',
          'Older children — rules and fairness matter',
          'Adolescents — discuss reasoning openly',
          'More effective than simply telling them',
        ],
      },
    ],
    redFlags: [],
    pearl: 'For younger children, link behaviour and treatment to concrete consequences they can grasp. For older children, rules and fairness start to matter more. For adolescents, discussing the reasoning openly is usually more effective than simply telling them what to do.',
  },
  {
    num: '6',
    colour: '6',
    name: 'Other Important Theorists',
    badge: 'More',
    question: 'Which other theorists appear in exams and essays?',
    intro: null,
    cols: [
      {
        header: 'Bandura',
        items: [
          'Social Learning Theory',
          'Children learn by observing and imitating',
          'Explains modelling of behaviour',
          'Model healthy behaviours in practice',
          'Be aware children may copy staff',
        ],
      },
      {
        header: 'Bronfenbrenner',
        items: [
          'Ecological Systems Theory',
          'Family (microsystem)',
          'School/community (mesosystem)',
          'Parental work (exosystem)',
          'Culture (macrosystem)',
          'Consider the whole context of a child\'s life',
        ],
      },
      {
        header: 'Freud',
        items: [
          'Psychosexual Development',
          'Five stages: oral, anal, phallic, latent, genital',
          'Concepts like defence mechanisms still relevant',
          'Denial and regression are common coping strategies',
        ],
      },
      {
        header: 'Clinical Applications',
        items: [
          'Model healthy behaviours (Bandura)',
          'Consider family, community, culture (Bronfenbrenner)',
          'Understand behaviour may have unconscious roots (Freud)',
          'Defence mechanisms are normal coping',
        ],
      },
    ],
    redFlags: [],
    pearl: null,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TheoriesOfDevelopmentPage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('.td-guide .td-step, .td-guide .td-diagram, .td-guide .td-golden-cell, .td-guide .td-pearl'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('td-reveal'); io.observe(el); }
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="td-guide">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="td-wrap">
        {/* Back nav */}
        <Link href="/hub/childrens" className="td-back">
          <span className="td-back-arrow">←</span>
          Children&apos;s Nursing Hub
        </Link>

        {/* Masthead */}
        <p className="td-kicker">Children&apos;s Nursing · Free Resource</p>
        <h1 className="td-headline">Theories of Development</h1>
        <p className="td-standfirst">
          The child development theories that come up in exams and essays, explained in a way that is easier to use in practice.
        </p>
        <p className="td-byline">The Nurse Lab · Children&apos;s Hub</p>
        <svg className="td-pulse" viewBox="0 0 1000 48" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,30 L180,30 L196,30 L204,24 L212,30 L232,30 L238,36 L246,4 L254,44 L260,30 L280,30 L296,20 L312,30 L520,30 L536,30 L544,24 L552,30 L572,30 L578,36 L586,4 L594,44 L600,30 L620,30 L636,20 L652,30 L1000,30" fill="none" pathLength={1} />
        </svg>
        <EditorialSaveButton
          hubItemId="theories-of-development"
          hubItemTitle="Theories of Development"
        />

        {/* Student note */}
        <div className="td-pearl" style={{ marginBottom: '16px' }}>
          <p className="td-pearl-label">Student note</p>
          <p>You are not expected to sound like a textbook. The useful revision question is usually: what does this theory help me notice, explain, or do differently when I am caring for a child?</p>
        </div>

        <div className="td-pearl" style={{ marginBottom: '40px' }}>
          <p className="td-pearl-label">Why it matters</p>
          <p>Developmental theories help you judge what is typical for age, adapt how you communicate, understand behaviour in context, spot delay earlier, and make care feel more genuinely age-appropriate.</p>
        </div>

        {/* Quick reference grid */}
        <div className="td-golden">
          {[
            { n: '01', title: 'Piaget', text: 'How children THINK' },
            { n: '02', title: 'Erikson', text: 'How children FEEL' },
            { n: '03', title: 'Bowlby', text: 'How children BOND' },
            { n: '04', title: 'Vygotsky', text: 'How children LEARN' },
          ].map((cell) => (
            <div key={cell.n} className="td-golden-cell">
              <span className="td-golden-numeral">{cell.n}</span>
              <p className="td-golden-title">{cell.title}</p>
              <p className="td-golden-text">{cell.text}</p>
            </div>
          ))}
        </div>

        {/* Numbered sections */}
        {SECTIONS.map((section) => (
          <div key={section.num} className="td-step">
            {/* Sidebar */}
            <div className="td-step-sidebar">
              <span className={`td-step-numeral td-num-${section.colour}`}>{section.num}</span>
              <span className={`td-step-badge td-badge-${section.colour}`}>{section.badge}</span>
            </div>

            {/* Content */}
            <div className="td-step-content">
              <h2 className="td-step-name">{section.name}</h2>
              <p className="td-step-question">{section.question}</p>

              {section.intro && (
                <p className="td-step-intro">{section.intro}</p>
              )}

              {/* 4-col grid */}
              <div className="td-content-grid">
                {section.cols.map((col) => (
                  <div key={col.header} className="td-content-col">
                    <p className="td-col-header">{col.header}</p>
                    <ul className="td-col-list">
                      {col.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Red flags */}
              {section.redFlags && section.redFlags.length > 0 && (
                <>
                  <p className="td-redflags-label">Red flags</p>
                  <div className="td-redflags">
                    {section.redFlags.map((flag) => (
                      <span key={flag} className="td-red-pill">{flag}</span>
                    ))}
                  </div>
                </>
              )}

              {/* Pearl */}
              {section.pearl && (
                <div className="td-pearl">
                  <p className="td-pearl-label">Clinical pearl</p>
                  <p>{section.pearl}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Erikson full table */}
        <h2 className="td-section-title">Erikson Stages — Full Reference</h2>
        <table className="td-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Age</th>
              <th>Stage / Crisis</th>
              <th>Key Theme</th>
              <th>Clinical Application</th>
            </tr>
          </thead>
          <tbody>
            {[
              { age: '0–1 yr', stage: 'Trust vs Mistrust', theme: 'Can I trust the world?', clinical: 'Keep routines consistent. Involve parents. Respond to cries.' },
              { age: '1–3 yrs', stage: 'Autonomy vs Shame', theme: '"Me do it!"', clinical: 'Offer simple choices. Allow some control. Be patient.' },
              { age: '3–6 yrs', stage: 'Initiative vs Guilt', theme: 'Am I good or bad?', clinical: 'Encourage questions. Use play for procedures.' },
              { age: '6–12 yrs', stage: 'Industry vs Inferiority', theme: 'Am I competent?', clinical: 'Praise achievements. Keep up with schoolwork if possible.' },
              { age: '12–18 yrs', stage: 'Identity vs Role Confusion', theme: 'Who am I?', clinical: 'Respect autonomy. Address body image. Involve in care decisions.' },
            ].map((row) => (
              <tr key={row.age}>
                <td>{row.age}</td>
                <td>{row.stage}</td>
                <td>{row.theme}</td>
                <td>{row.clinical}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Kohlberg full table */}
        <h2 className="td-section-title">Kohlberg Stages — Full Reference</h2>
        <table className="td-table" style={{ marginBottom: '32px' }}>
          <thead>
            <tr>
              <th>Level</th>
              <th>Stage</th>
              <th>Age</th>
              <th>Reasoning</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Pre-Conventional</td><td>1 — Avoid punishment</td><td>~2–6 yrs</td><td>&quot;It&apos;s wrong because I&apos;ll get in trouble.&quot;</td></tr>
            <tr><td>Pre-Conventional</td><td>2 — Self-interest</td><td>~6–9 yrs</td><td>&quot;What&apos;s in it for me? Fair exchange.&quot;</td></tr>
            <tr><td>Conventional</td><td>3 — Good boy/girl</td><td>Adolescence</td><td>Want approval; relationships matter.</td></tr>
            <tr><td>Conventional</td><td>4 — Law and order</td><td>Adulthood</td><td>Rules and authority are important.</td></tr>
            <tr><td>Post-Conventional</td><td>5 — Social contract</td><td>Some adults</td><td>Rules can be changed for the greater good.</td></tr>
            <tr><td>Post-Conventional</td><td>6 — Universal principles</td><td>Few adults</td><td>Personal ethics may override law.</td></tr>
          </tbody>
        </table>

        {/* Red flags summary */}
        <p className="td-redflags-label">Red flags — when to be concerned</p>
        <div className="td-redflags" style={{ marginBottom: '40px' }}>
          {[
            'Significant developmental delay',
            'Regression — losing acquired skills',
            'Signs of disorganised attachment',
            'Social withdrawal',
            'Lack of empathy or cruelty',
            'Concerning parent-child interactions',
            'Missed key milestones',
          ].map((flag) => (
            <span key={flag} className="td-red-pill">{flag}</span>
          ))}
        </div>

        <SelfTestQuiz title="Test Yourself: Theories of Development" questions={quizQuestions} />

        <SourceLinks sources={[
          { citation: 'McLeod S (2024)', title: "Piaget's Theory of Cognitive Development", href: 'https://www.simplypsychology.org/piaget.html' },
          { citation: 'McLeod S (2024)', title: "Erikson's Stages of Psychosocial Development", href: 'https://www.simplypsychology.org/erik-erikson.html' },
          { citation: 'McLeod S (2024)', title: "Bowlby's Attachment Theory", href: 'https://www.simplypsychology.org/bowlby.html' },
          { citation: 'McLeod S (2024)', title: "Kohlberg's Theory of Moral Development", href: 'https://www.simplypsychology.org/kohlberg.html' },
        ]} />
      </div>
    </div>
  );
}
