import type { CSSProperties } from 'react';

export const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
export const display = "'Playfair Display', Georgia, serif";

export const ink = 'var(--ink-strong)';
export const inkMid = 'var(--ink-soft)';
export const inkLight = 'var(--ink-faint)';
export const cream = 'var(--surface-page)';
export const parchment = 'var(--surface-sunken)';
export const panel = 'var(--surface-raised)';
export const border = 'var(--hairline-soft)';
export const tagBg = 'var(--surface-sunken)';
export const green = 'var(--state-correct-text)';
export const greenBg = 'var(--state-correct-surface)';
export const greenLine = 'var(--state-correct-border)';
export const teal = 'var(--topic-skills-text)';
export const tealBg = 'var(--topic-skills-surface)';
export const blue = 'var(--topic-assessment-text)';
export const blueBg = 'var(--topic-assessment-surface)';
export const blueLine = 'var(--topic-assessment-border)';
export const coral = 'var(--state-incorrect-text)';
export const coralBg = 'var(--state-incorrect-surface)';
export const danger = 'var(--state-incorrect-text)';
export const dangerBg = 'var(--state-incorrect-surface)';
export const dangerLine = 'var(--state-incorrect-border)';
export const infoBg = 'var(--topic-assessment-surface)';
export const strongBorder = 'var(--border-strong)';

export const wrap = '1120px';

export const sectionLabelStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

export const primaryButton: CSSProperties = {
  display: 'inline-block',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: 'var(--action-bg)',
  color: 'var(--action-text)',
  padding: '12px 24px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

export const secondaryButton: CSSProperties = {
  display: 'inline-block',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: 'transparent',
  color: ink,
  padding: '11px 24px',
  border: `0.5px solid ${border}`,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

export const tagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: serif,
  fontSize: '12px',
  color: inkMid,
  background: tagBg,
  padding: '7px 14px',
  lineHeight: 1,
};

export const sampleCardStyle: CSSProperties = {
  border: `0.5px solid ${border}`,
  background: panel,
  overflow: 'hidden',
};

export const sampleInnerStyle: CSSProperties = {
  padding: '24px',
};
