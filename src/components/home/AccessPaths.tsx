import Link from 'next/link';
import { accessOptions } from '@/lib/marketingContent';
import {
  border,
  display,
  ink,
  inkLight,
  inkMid,
  panel,
  parchment,
  sectionLabelStyle,
  secondaryButton,
  serif,
  wrap,
} from './styles';

const toneMap = {
  free:  { color: '#8B6B52', background: 'var(--surface-sunken)' },
  osce:  { color: 'var(--topic-skills-text)', background: 'var(--topic-skills-surface)' },
  quiz:  { color: 'var(--topic-assessment-text)', background: 'var(--topic-assessment-surface)' },
  bundle:{ color: ink,       background: parchment  },
};

export default function AccessPaths() {
  const bundle  = accessOptions.find((o) => o.id === 'bundle')!;
  const others  = accessOptions.filter((o) => o.id !== 'bundle');

  return (
    <section
      style={{
        padding: '56px 24px 64px',
        borderTop: `0.5px solid ${border}`,
        borderBottom: `0.5px solid ${border}`,
      }}
    >
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <p style={sectionLabelStyle}>Pricing</p>
        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            color: ink,
            marginBottom: '28px',
          }}
        >
          Start free. Unlock everything for £9.99.
        </h2>

        {/* Featured bundle card */}
        <div
          style={{
            background: parchment,
            border: `0.5px solid ${border}`,
            padding: '36px 40px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '32px',
          }}
        >
          <div style={{ flex: '1 1 340px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: serif,
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--surface-page)',
                  background: ink,
                  padding: '5px 10px',
                }}
              >
                Best value
              </span>
              <span style={{ fontFamily: serif, fontSize: '12px', color: inkLight, fontWeight: 300 }}>
                OSCE + Quiz + Hub — one payment
              </span>
            </div>

            <h3
              style={{
                fontFamily: display,
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 400,
                color: ink,
                marginBottom: '10px',
                lineHeight: 1.1,
              }}
            >
              {bundle.title}
            </h3>

            <p
              style={{
                fontFamily: serif,
                fontSize: '14px',
                lineHeight: 1.75,
                fontWeight: 300,
                color: inkMid,
                maxWidth: '480px',
                marginBottom: '18px',
              }}
            >
              {bundle.summary}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {bundle.highlights.map((h) => (
                <span
                  key={h}
                  style={{
                    fontFamily: serif,
                    fontSize: '11px',
                    color: inkMid,
                    background: 'var(--surface-sunken)',
                    padding: '5px 10px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
            <p
              style={{
                fontFamily: display,
                fontSize: 'clamp(2.8rem, 5vw, 4rem)',
                lineHeight: 1,
                color: ink,
                marginBottom: '6px',
              }}
            >
              {bundle.price}
            </p>
            <p
              style={{
                fontFamily: serif,
                fontSize: '12px',
                color: inkLight,
                fontWeight: 300,
                marginBottom: '20px',
              }}
            >
              Tools separately: £9.98 · hub included free
            </p>
            <Link
              href={bundle.href}
              style={{
                display: 'inline-block',
                fontFamily: serif,
                fontSize: '13px',
                background: ink,
                color: 'var(--surface-page)',
                padding: '11px 22px',
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              {bundle.cta} →
            </Link>
          </div>
        </div>

        {/* Three secondary cards */}
        <div
          className="home-access-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '16px',
          }}
        >
          {others.map((option) => {
            const tone = toneMap[option.id];
            return (
              <div
                key={option.id}
                style={{
                  border: `0.5px solid ${border}`,
                  background: panel,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ padding: '22px 22px 16px', borderBottom: `0.5px solid ${border}` }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 9px',
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase' as const,
                      color: tone.color,
                      background: tone.background,
                      marginBottom: '12px',
                    }}
                  >
                    {option.label}
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: '12px',
                      marginBottom: '8px',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: display,
                        fontSize: '20px',
                        fontWeight: 400,
                        lineHeight: 1.15,
                        color: ink,
                      }}
                    >
                      {option.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: display,
                        fontSize: '22px',
                        lineHeight: 1,
                        color: ink,
                        flexShrink: 0,
                      }}
                    >
                      {option.price}
                    </p>
                  </div>

                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      lineHeight: 1.7,
                      fontWeight: 300,
                      color: inkMid,
                    }}
                  >
                    {option.summary}
                  </p>
                </div>

                <div style={{ padding: '14px 22px', flexGrow: 1 }}>
                  <div style={{ display: 'grid', gap: '6px' }}>
                    {option.highlights.map((highlight) => (
                      <p
                        key={highlight}
                        style={{
                          fontFamily: serif,
                          fontSize: '12px',
                          lineHeight: 1.6,
                          fontWeight: 300,
                          color: inkLight,
                        }}
                      >
                        — {highlight}
                      </p>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '0 22px 22px' }}>
                  <Link
                    href={option.href}
                    style={{
                      ...secondaryButton,
                      display: 'block',
                      textAlign: 'center',
                    }}
                  >
                    {option.cta} →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
