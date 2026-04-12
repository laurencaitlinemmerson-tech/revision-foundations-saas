'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';

// ─── Shared CSS for all study components ──────────────────────────────────────

export const STUDY_COMPONENTS_CSS = `
/* ── Glossary Chips ── */
.sc-glossary { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
.sc-glossary-chip {
  display: inline-flex; align-items: baseline; gap: 6px;
  font-size: 11px; padding: 6px 14px; border-radius: 0;
  background: #F5F3F0; border: 0.5px solid rgba(0,0,0,0.08);
  font-family: 'Inter', -apple-system, sans-serif;
  transition: background 0.15s;
}
.sc-glossary-chip:hover { background: #EEEDFE; }
.sc-glossary-term { font-weight: 500; color: #2C2A27; }
.sc-glossary-def { font-weight: 300; color: #888; }

/* ── Formula Box ── */
.sc-formula {
  border: 0.5px solid rgba(83,74,183,0.2);
  background: linear-gradient(135deg, #FBFBFE 0%, #F6F5FE 100%);
  padding: 20px 24px 22px;
  border-radius: 0;
  margin-bottom: 18px;
}
.sc-formula-label {
  font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #534AB7; margin-bottom: 10px; font-weight: 500;
}
.sc-formula-expr {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 19px; font-style: italic; color: #2C2A27;
  margin-bottom: 10px; line-height: 1.4;
}
.sc-formula-explain {
  font-size: 12px; color: #666; font-weight: 300; line-height: 1.6; margin: 0;
}

/* ── Clinical Callout ── */
.sc-callout {
  padding: 16px 20px 18px;
  border-radius: 0;
  margin-bottom: 18px;
}
.sc-callout-label {
  font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase;
  margin-bottom: 7px; font-weight: 500;
}
.sc-callout p { font-size: 12px; line-height: 1.65; font-weight: 300; margin: 0; }

/* — Callout variants — */
.sc-callout-pearl {
  background: #FAEEDA;
}
.sc-callout-pearl .sc-callout-label { color: #633806; }
.sc-callout-pearl p { color: #633806; }

.sc-callout-exam {
  background: linear-gradient(135deg, #EDF7F3 0%, #E1F5EE 100%);
  border-left: 2px solid #0F6E56;
}
.sc-callout-exam .sc-callout-label { color: #0F6E56; }
.sc-callout-exam p { color: #2C2A27; }

.sc-callout-redflag {
  background: #FDF4F4;
  border-left: 2px solid #A32D2D;
}
.sc-callout-redflag .sc-callout-label { color: #A32D2D; }
.sc-callout-redflag p { color: #5A3030; }

.sc-callout-mistake {
  background: #FFF9EF;
  border-left: 2px solid #B8860B;
}
.sc-callout-mistake .sc-callout-label { color: #8B6914; }
.sc-callout-mistake p { color: #5A4A27; }

.sc-callout-why {
  background: linear-gradient(135deg, #F5F3F0 0%, #F0EDE8 100%);
  border-left: 2px solid #5A5750;
}
.sc-callout-why .sc-callout-label { color: #5A5750; }
.sc-callout-why p { color: #2C2A27; }

/* ── Mnemonic Row ── */
.sc-mnemonic {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0;
  margin-bottom: 18px;
}
.sc-mnemonic-label {
  font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #999; margin-right: 12px; flex-shrink: 0;
}
.sc-mnemonic-step {
  display: inline-flex; align-items: center; gap: 0;
  font-size: 12px; font-weight: 400; color: #2C2A27;
  padding: 5px 10px;
  background: #F5F3F0; border: 0.5px solid rgba(0,0,0,0.06);
}
.sc-mnemonic-step:first-of-type { border-radius: 3px 0 0 3px; }
.sc-mnemonic-step:last-of-type { border-radius: 0 3px 3px 0; }
.sc-mnemonic-arrow {
  font-size: 10px; color: #ccc; display: inline-flex;
  align-items: center; padding: 5px 0;
  background: #F5F3F0; border-top: 0.5px solid rgba(0,0,0,0.06);
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
}

/* ── Split Compare ── */
.sc-split {
  display: grid; grid-template-columns: 1fr 1fr;
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}
.sc-split-side { padding: 18px 20px; }
.sc-split-side:first-child { border-right: 0.5px solid rgba(0,0,0,0.1); }
.sc-split-header {
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  padding-bottom: 9px; margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}
.sc-split-left .sc-split-header { color: #185FA5; }
.sc-split-right .sc-split-header { color: #993C1D; }
.sc-split-list { list-style: none; margin: 0; padding: 0; }
.sc-split-list li {
  font-size: 12px; color: #5A5750; line-height: 1.6;
  padding: 2px 0 2px 10px; position: relative; font-weight: 300;
}
.sc-split-list li::before { content: '–'; position: absolute; left: 0; color: #ccc; }

/* ── Quick-Reference Grid ── */
.sc-qref-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 0; border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}
.sc-qref-card {
  padding: 16px 16px 18px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}
.sc-qref-card:nth-child(3n) { border-right: none; }
.sc-qref-card:nth-last-child(-n+3) { border-bottom: none; }
.sc-qref-title {
  font-size: 10px; font-weight: 500; color: #2C2A27;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 7px;
}
.sc-qref-text { font-size: 12px; color: #777; font-weight: 300; line-height: 1.55; margin: 0; }

/* ── Sentence Bank ── */
.sc-sentences {
  border: 0.5px solid rgba(15,110,86,0.15);
  background: linear-gradient(135deg, #FBFEFB 0%, #F3FAF6 100%);
  padding: 20px 24px 22px; border-radius: 4px;
  margin-bottom: 18px;
}
.sc-sentences-label {
  font-size: 8px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #0F6E56; margin-bottom: 12px; font-weight: 500;
}
.sc-sentences-list { list-style: none; margin: 0; padding: 0; }
.sc-sentences-list li {
  font-size: 12px; color: #2C2A27; line-height: 1.65;
  padding: 6px 0 6px 18px; position: relative; font-weight: 300;
  border-bottom: 0.5px solid rgba(0,0,0,0.04);
  font-style: italic;
}
.sc-sentences-list li:last-child { border-bottom: none; }
.sc-sentences-list li::before {
  content: '"'; position: absolute; left: 0;
  font-family: 'Playfair Display', serif; font-size: 18px;
  color: #0F6E56; line-height: 1; top: 5px;
}

/* ── Condition Card ── */
.sc-condition {
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}
.sc-condition-header {
  padding: 14px 20px;
  background: #F5F3F0;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 18px; font-weight: 400; color: #1A1815;
}
.sc-condition-body { padding: 0; }
.sc-condition-row {
  display: grid; grid-template-columns: 140px 1fr;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
}
.sc-condition-row:last-child { border-bottom: none; }
.sc-condition-key {
  padding: 10px 16px;
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  color: #999; font-weight: 400;
  border-right: 0.5px solid rgba(0,0,0,0.06);
  display: flex; align-items: flex-start; padding-top: 12px;
}
.sc-condition-val {
  padding: 10px 16px;
  font-size: 12px; color: #5A5750; font-weight: 300; line-height: 1.6;
}

/* ── Expandable Section ── */
.sc-expand { margin-bottom: 18px; }
.sc-expand-trigger {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 12px 16px; border: 0.5px solid rgba(0,0,0,0.1);
  background: #FAFAF8; cursor: pointer; font-family: 'Inter', sans-serif;
  font-size: 12px; font-weight: 400; color: #2C2A27;
  transition: background 0.15s;
}
.sc-expand-trigger:hover { background: #F5F3F0; }
.sc-expand-icon {
  font-size: 14px; color: #999; transition: transform 0.2s;
  font-style: normal;
}
.sc-expand-icon-open { transform: rotate(180deg); }
.sc-expand-body {
  padding: 16px 16px 18px;
  border: 0.5px solid rgba(0,0,0,0.1); border-top: none;
}

/* ── Related Resource Link ── */
.sc-related {
  display: flex; align-items: center; gap: 18px;
  padding: 16px 20px;
  background: #F5F3F0;
  border: 0.5px solid rgba(0,0,0,0.1);
  border-radius: 0;
  margin-bottom: 18px;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
}
.sc-related:hover { background: #EEEDFE; border-color: rgba(83,74,183,0.15); }
.sc-related-icon {
  font-size: 16px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.sc-related-text { flex: 1; }
.sc-related-title { display: block; font-size: 12px; font-weight: 500; color: #2C2A27; margin-bottom: 3px; }
.sc-related-desc { display: block; font-size: 11px; font-weight: 300; color: #888; line-height: 1.5; }
.sc-related-arrow { font-size: 14px; color: #bbb; font-style: normal; flex-shrink: 0; }

/* ── Responsive ── */
@media (max-width: 860px) {
  .sc-split { grid-template-columns: 1fr; }
  .sc-split-side:first-child { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .sc-qref-grid { grid-template-columns: repeat(2, 1fr); }
  .sc-qref-card:nth-child(2n) { border-right: none; }
  .sc-condition-row { grid-template-columns: 110px 1fr; }
  .sc-mnemonic { gap: 2px; }
}
@media (max-width: 520px) {
  .sc-qref-grid { grid-template-columns: 1fr; }
  .sc-qref-card { border-right: none; }
  .sc-condition-row { grid-template-columns: 1fr; }
  .sc-condition-key { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.04); }
}

/* ── Source Links ── */
.sc-sources { margin-top: 52px; padding-top: 28px; border-top: 0.5px solid rgba(0,0,0,0.1); }
.sc-sources-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #aaa; margin-bottom: 14px; }
.sc-source-link { display: block; font-size: 12px; font-weight: 300; color: #5A5750; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: rgba(0,0,0,0.18); padding: 7px 0; border-bottom: 0.5px solid rgba(0,0,0,0.06); transition: color 0.15s; }
.sc-source-link:last-child { border-bottom: none; }
.sc-source-link:hover { color: #1A1815; }
`;

// ─── GlossaryChips ────────────────────────────────────────────────────────────

interface GlossaryItem {
  term: string;
  definition: string;
}

export function GlossaryChips({ items }: { items: GlossaryItem[] }) {
  return (
    <div className="sc-glossary">
      {items.map((item) => (
        <span key={item.term} className="sc-glossary-chip">
          <span className="sc-glossary-term">{item.term}</span>
          <span className="sc-glossary-def">— {item.definition}</span>
        </span>
      ))}
    </div>
  );
}

// ─── FormulaBox ───────────────────────────────────────────────────────────────

export function FormulaBox({
  name,
  formula,
  explanation,
}: {
  name: string;
  formula: string;
  explanation: string;
}) {
  return (
    <div className="sc-formula">
      <p className="sc-formula-label">{name}</p>
      <p className="sc-formula-expr">{formula}</p>
      <p className="sc-formula-explain">{explanation}</p>
    </div>
  );
}

// ─── ClinicalCallout ─────────────────────────────────────────────────────────

type CalloutVariant = 'pearl' | 'exam' | 'redflag' | 'mistake' | 'why';

const CALLOUT_LABELS: Record<CalloutVariant, string> = {
  pearl: 'Clinical Pearl',
  exam: 'Exam Tip',
  redflag: 'Red Flag',
  mistake: 'Common Mistake',
  why: 'Why This Matters',
};

export function ClinicalCallout({
  variant,
  label,
  children,
}: {
  variant: CalloutVariant;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className={`sc-callout sc-callout-${variant}`}>
      <p className="sc-callout-label">{label || CALLOUT_LABELS[variant]}</p>
      {typeof children === 'string' ? <p>{children}</p> : children}
    </div>
  );
}

// ─── MnemonicRow ──────────────────────────────────────────────────────────────

export function MnemonicRow({
  label,
  steps,
}: {
  label: string;
  steps: string[];
}) {
  return (
    <div className="sc-mnemonic">
      <span className="sc-mnemonic-label">{label}</span>
      {steps.map((step, i) => (
        <span key={step} style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span className="sc-mnemonic-step">{step}</span>
          {i < steps.length - 1 && <span className="sc-mnemonic-arrow">→</span>}
        </span>
      ))}
    </div>
  );
}

// ─── SplitCompare ─────────────────────────────────────────────────────────────

export function SplitCompare({
  leftHeader,
  rightHeader,
  leftItems,
  rightItems,
}: {
  leftHeader: string;
  rightHeader: string;
  leftItems: string[];
  rightItems: string[];
}) {
  return (
    <div className="sc-split">
      <div className="sc-split-side sc-split-left">
        <p className="sc-split-header">{leftHeader}</p>
        <ul className="sc-split-list">
          {leftItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="sc-split-side sc-split-right">
        <p className="sc-split-header">{rightHeader}</p>
        <ul className="sc-split-list">
          {rightItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── QuickRefGrid ─────────────────────────────────────────────────────────────

interface QuickRef {
  title: string;
  text: string;
}

export function QuickRefGrid({ items }: { items: QuickRef[] }) {
  return (
    <div className="sc-qref-grid">
      {items.map((item) => (
        <div key={item.title} className="sc-qref-card">
          <p className="sc-qref-title">{item.title}</p>
          <p className="sc-qref-text">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

// ─── SentenceBank ─────────────────────────────────────────────────────────────

export function SentenceBank({
  label,
  sentences,
}: {
  label?: string;
  sentences: string[];
}) {
  return (
    <div className="sc-sentences">
      <p className="sc-sentences-label">{label || 'Say this in your exam'}</p>
      <ul className="sc-sentences-list">
        {sentences.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

// ─── ConditionCard ────────────────────────────────────────────────────────────

interface ConditionField {
  key: string;
  value: string;
}

export function ConditionCard({
  title,
  fields,
}: {
  title: string;
  fields: ConditionField[];
}) {
  return (
    <div className="sc-condition">
      <div className="sc-condition-header">{title}</div>
      <div className="sc-condition-body">
        {fields.map((field) => (
          <div key={field.key} className="sc-condition-row">
            <div className="sc-condition-key">{field.key}</div>
            <div className="sc-condition-val">{field.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ExpandableSection ────────────────────────────────────────────────────────

export function ExpandableSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sc-expand">
      <button className="sc-expand-trigger" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <i className={`sc-expand-icon ${open ? 'sc-expand-icon-open' : ''}`}>▾</i>
      </button>
      {open && <div className="sc-expand-body">{children}</div>}
    </div>
  );
}

// ─── RelatedResourceLink ──────────────────────────────────────────────────────

export function RelatedResourceLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="sc-related">
      <span className="sc-related-icon">📖</span>
      <span className="sc-related-text">
        <span className="sc-related-title">{title}</span>
        <span className="sc-related-desc">{description}</span>
      </span>
      <i className="sc-related-arrow">→</i>
    </Link>
  );
}

// ─── SourceLinks ──────────────────────────────────────────────────────────────

export function SourceLinks({
  sources,
}: {
  sources: { citation: string; title: string; href: string }[];
}) {
  return (
    <div className="sc-sources">
      <p className="sc-sources-label">Sources &amp; Further Reading</p>
      {sources.map((s) => (
        <a
          key={s.citation}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="sc-source-link"
        >
          {s.citation} — {s.title}
        </a>
      ))}
    </div>
  );
}
