import Link from 'next/link';
import type { CSSProperties } from 'react';

interface StudySkillsPromptProps {
  eyebrow?: string;
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  accent: string;
  accentSoft: string;
}

export default function StudySkillsPrompt({
  eyebrow = 'Study skills',
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref = '/study-skills',
  secondaryLabel = 'Browse study skills',
  accent,
  accentSoft,
}: StudySkillsPromptProps) {
  const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const display = "'Playfair Display', Georgia, serif";
  const ink = '#1C1510';
  const inkMid = '#5C4A38';
  const cream = '#FAFAF8';
  const border = 'rgba(28, 21, 16, 0.1)';

  const buttonStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: serif,
    fontSize: '13px',
    fontWeight: 400,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      className="study-skills-prompt"
      style={{
        border: `0.5px solid ${border}`,
        borderLeft: `3px solid ${accent}`,
        background: accentSoft,
        padding: '26px 24px',
      }}
    >
      <div>
        <p
          style={{
            fontFamily: serif,
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: accent,
            marginBottom: '10px',
          }}
        >
          {eyebrow}
        </p>
        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(1.55rem, 2.8vw, 2.1rem)',
            lineHeight: 1.08,
            color: ink,
            marginBottom: '10px',
            maxWidth: '18ch',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: serif,
            fontSize: '14px',
            lineHeight: 1.8,
            fontWeight: 300,
            color: inkMid,
            maxWidth: '48ch',
          }}
        >
          {body}
        </p>
      </div>

      <div className="study-skills-prompt-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
        <Link
          href={primaryHref}
          style={{
            ...buttonStyle,
            color: cream,
            background: ink,
            padding: '12px 18px',
          }}
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          style={{
            ...buttonStyle,
            color: ink,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          {secondaryLabel} →
        </Link>
      </div>

      <style>{`
        .study-skills-prompt {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 20px 28px;
          align-items: center;
        }

        @media (max-width: 760px) {
          .study-skills-prompt {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
