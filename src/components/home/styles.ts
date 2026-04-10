import type { CSSProperties } from 'react';

export const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
export const display = "'Playfair Display', Georgia, serif";

export const ink = '#1A1815';
export const inkMid = '#5A5750';
export const inkLight = '#9C8878';
export const cream = '#FAFAF8';
export const parchment = '#F5F3F0';
export const panel = '#FFFFFF';
export const border = 'rgba(0,0,0,0.08)';
export const tagBg = '#F3F1EE';
export const green = '#1E8A4D';
export const greenBg = '#E6F4EA';
export const greenLine = 'rgba(30, 138, 77, 0.22)';
export const teal = '#2F8A7E';
export const tealBg = '#E6F3F1';
export const blue = '#2E67B1';
export const blueBg = '#E7EEF8';
export const blueLine = 'rgba(46, 103, 177, 0.22)';
export const coral = '#D96C55';
export const coralBg = '#F8E7E2';
export const danger = '#C45D4E';
export const dangerBg = '#F8E7E2';
export const dangerLine = 'rgba(196, 93, 78, 0.22)';
export const infoBg = '#F1F5FA';
export const strongBorder = 'rgba(26, 24, 21, 0.24)';

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
  background: ink,
  color: cream,
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
