'use client';
/* eslint-disable react/no-unescaped-entities */

import Link from 'next/link';
import EditorialSaveButton from '@/components/EditorialSaveButton';

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.td-guide *, .td-guide *::before, .td-guide *::after { box-sizing: border-box; box-shadow: none !important; }

.td-guide {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.td-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.td-back {
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
.td-back:hover { color: #555; }
.td-back-arrow { font-style: normal; }

/* Masthead */
.td-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.td-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 22px;
  letter-spacing: -0.01em;
}

.td-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 680px;
  margin-bottom: 14px;
}

.td-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 36px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 52px;
}

/* Pearl */
.td-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
}

.td-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
}

.td-pearl p {
  font-size: 12px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Step sections */
.td-step {
  display: grid;
  grid-template-columns: 96px 1fr;
  margin-bottom: 52px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 36px;
}

.td-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
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
  border-radius: 3px;
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
  color: #1A1815;
  margin-bottom: 3px;
  line-height: 1.2;
}

.td-step-question {
  font-size: 13px;
  font-style: italic;
  color: #999;
  margin-bottom: 22px;
}

.td-step-intro {
  font-size: 14px;
  color: #5A5750;
  font-weight: 300;
  line-height: 1.7;
  margin-bottom: 20px;
}

/* 4-column content grid */
.td-content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.td-content-col {
  padding: 14px 14px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.td-content-col:last-child { border-right: none; }

.td-col-header {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

.td-col-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.td-col-list li {
  font-size: 12px;
  color: #5A5750;
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
  color: #ccc;
}

/* Red flags */
.td-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
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
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 11px;
  border-radius: 2px;
  font-weight: 300;
}

/* Table */
.td-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 0;
  font-size: 13px;
}

.td-table th {
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
.td-table th:last-child { border-right: none; }

.td-table td {
  padding: 10px 16px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.td-table td:last-child { border-right: none; }
.td-table tr:last-child td { border-bottom: none; }
.td-table td:first-child { font-weight: 400; color: #2C2A27; }

/* Section headings */
.td-section-title {
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

/* Golden rules grid (for quick ref) */
.td-golden {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.td-golden-cell {
  padding: 22px 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.12);
}
.td-golden-cell:last-child { border-right: none; }

.td-golden-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-style: italic;
  color: #c8c4be;
  display: block;
  margin-bottom: 6px;
  line-height: 1;
}

.td-golden-title {
  font-size: 10px;
  font-weight: 400;
  color: #2C2A27;
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
.td-num-1 { color: #185FA5; }
.td-badge-1 { background: #E6F1FB; color: #0C447C; }
.td-num-2 { color: #0F6E56; }
.td-badge-2 { background: #E1F5EE; color: #085041; }
.td-num-3 { color: #993C1D; }
.td-badge-3 { background: #FAECE7; color: #712B13; }
.td-num-4 { color: #534AB7; }
.td-badge-4 { background: #EEEDFE; color: #3C3489; }
.td-num-5 { color: #5F5E5A; }
.td-badge-5 { background: #F1EFE8; color: #444441; }
.td-num-6 { color: #8B5E3C; }
.td-badge-6 { background: #F5EDE5; color: #5C3D25; }

/* Responsive */
@media (max-width: 860px) {
  .td-wrap { padding: 28px 20px 60px; }
  .td-headline { font-size: 36px; }
  .td-step { grid-template-columns: 1fr; }
  .td-step-sidebar { flex-direction: row; align-items: center; gap: 12px; border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); padding-bottom: 16px; padding-right: 0; margin-bottom: 20px; }
  .td-step-numeral { font-size: 48px; }
  .td-step-content { padding-left: 0; }
  .td-content-grid { grid-template-columns: repeat(2, 1fr); }
  .td-content-col:nth-child(2) { border-right: none; }
  .td-content-col:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.1); }
  .td-golden { grid-template-columns: repeat(2, 1fr); }
  .td-golden-cell:nth-child(2) { border-right: none; }
  .td-golden-cell:nth-child(n+3) { border-top: 0.5px solid rgba(0,0,0,0.12); }
}
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
      </div>
    </div>
  );
}
