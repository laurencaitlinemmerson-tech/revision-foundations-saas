import Link from 'next/link';
import { accessOptions } from '@/lib/marketingContent';
import {
  border,
  display,
  ink,
  inkMid,
  panel,
  parchment,
  sectionLabelStyle,
  secondaryButton,
  serif,
  wrap,
} from './styles';

const toneMap = {
  free: { color: '#8B6B52', background: '#F3ECE4' },
  osce: { color: '#2F8A7E', background: '#E6F3F1' },
  quiz: { color: '#2E67B1', background: '#E7EEF8' },
  bundle: { color: ink, background: parchment },
};

export default function AccessPaths() {
  return (
    <section
      style={{
        padding: '56px 24px 64px',
        borderTop: `0.5px solid ${border}`,
        borderBottom: `0.5px solid ${border}`,
      }}
    >
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '28px',
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <p style={sectionLabelStyle}>Ways in</p>
            <h2
              style={{
                fontFamily: display,
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                color: ink,
                marginBottom: '12px',
              }}
            >
              Free first, a single tool, or the full bundle.
            </h2>
            <p
              style={{
                fontFamily: serif,
                fontSize: '15px',
                lineHeight: 1.85,
                fontWeight: 300,
                color: inkMid,
                maxWidth: '560px',
              }}
            >
              The clearest ways into the site, without having to decode what is free and what unlocks.
            </p>
          </div>

          <div
            style={{
              maxWidth: '320px',
              border: `0.5px solid ${border}`,
              background: parchment,
              padding: '16px 18px',
            }}
          >
            <p style={{ ...sectionLabelStyle, marginBottom: '8px' }}>Live now</p>
            <p
              style={{
                fontFamily: serif,
                fontSize: '13px',
                lineHeight: 1.7,
                color: inkMid,
                fontWeight: 300,
              }}
            >
              Children&apos;s is the most complete route today. The adult hub is available too for practical revision guides.
            </p>
          </div>
        </div>

        <div
          className="home-access-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '16px',
          }}
        >
          {accessOptions.map((option) => {
            const tone = toneMap[option.id];
            const isBundle = option.id === 'bundle';

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
                <div style={{ padding: '22px 22px 18px', borderBottom: `0.5px solid ${border}` }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '5px 10px',
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: tone.color,
                      background: tone.background,
                      marginBottom: '14px',
                    }}
                  >
                    {option.label}
                  </span>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '12px',
                      alignItems: 'baseline',
                      marginBottom: '10px',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: display,
                        fontSize: '24px',
                        fontWeight: 400,
                        lineHeight: 1.12,
                        color: ink,
                      }}
                    >
                      {option.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: display,
                        fontSize: '28px',
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
                      lineHeight: 1.75,
                      fontWeight: 300,
                      color: inkMid,
                    }}
                  >
                    {option.summary}
                  </p>
                </div>

                <div style={{ padding: '18px 22px', flexGrow: 1 }}>
                  <p style={{ ...sectionLabelStyle, marginBottom: '10px' }}>Best for</p>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      lineHeight: 1.7,
                      fontWeight: 300,
                      color: inkMid,
                      marginBottom: '16px',
                    }}
                  >
                    {option.bestFor}
                  </p>

                  <div style={{ display: 'grid', gap: '8px' }}>
                    {option.highlights.map((highlight) => (
                      <p
                        key={highlight}
                        style={{
                          fontFamily: serif,
                          fontSize: '12px',
                          lineHeight: 1.6,
                          fontWeight: 300,
                          color: inkMid,
                        }}
                      >
                        - {highlight}
                      </p>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '0 22px 22px' }}>
                  <Link
                    href={option.href}
                    style={{
                      ...secondaryButton,
                      width: '100%',
                      textAlign: 'center',
                      background: isBundle ? ink : 'transparent',
                      color: isBundle ? '#FAFAF8' : ink,
                      border: isBundle ? 'none' : secondaryButton.border,
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
