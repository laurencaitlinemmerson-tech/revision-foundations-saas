import Link from 'next/link';
import {
  border, display, ink, inkMid, inkLight, panel, parchment,
  sectionLabelStyle, serif, wrap,
} from './styles';

export default function AccessibilityNote() {
  return (
    <section style={{ padding: '0 24px 64px' }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <div
          style={{
            background: panel,
            border: `0.5px solid ${border}`,
            padding: '36px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '28px',
          }}
        >
          <div style={{ flex: '1 1 380px' }}>
            <p style={sectionLabelStyle}>Built for how you actually read</p>
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(1.5rem, 2.6vw, 1.9rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                color: ink,
                marginBottom: '10px',
              }}
            >
              Accessibility settings live on every page.
            </h2>
            <p
              style={{
                fontFamily: serif,
                fontSize: '14px',
                lineHeight: 1.85,
                fontWeight: 300,
                color: inkMid,
                maxWidth: '520px',
                margin: 0,
              }}
            >
              Look for the <strong style={{ fontWeight: 500, color: ink }}>Accessibility</strong> button in the bottom-left corner &mdash; a dyslexia-friendly font, relaxed line spacing, reduced motion, and a warm night reading mode, saved to your device, no account needed. There&apos;s also a full guide for revising with ADHD, autism, dyslexia, dyspraxia, dyscalculia, or an anxious brain.
            </p>
          </div>

          <Link
            href="/neurodivergent-guide"
            style={{
              display: 'inline-block',
              fontFamily: serif,
              fontSize: '13px',
              letterSpacing: '0.04em',
              color: ink,
              background: parchment,
              border: `0.5px solid ${border}`,
              padding: '12px 22px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Read the guide &rarr;
          </Link>
        </div>
        <p
          style={{
            fontFamily: serif,
            fontSize: '11px',
            color: inkLight,
            marginTop: '12px',
          }}
        >
          Changes apply instantly and never require sign-in.
        </p>
      </div>
    </section>
  );
}
