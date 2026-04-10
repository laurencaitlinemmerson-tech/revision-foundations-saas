import Link from 'next/link';
import {
  serif, display, ink, inkMid, inkLight, border, panel,
  sectionLabelStyle, tagStyle, wrap,
} from './styles';
import { tools } from './data';

export default function WhatsIncluded() {
  return (
    <section style={{ padding: '56px 24px 64px' }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <p style={sectionLabelStyle}>What&apos;s included</p>

        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.12,
            color: ink,
            marginBottom: '18px',
          }}
        >
          Revise the way nursing students are actually assessed.
        </h2>

        <p
          style={{
            fontFamily: serif,
            fontSize: '16px',
            lineHeight: 1.9,
            fontWeight: 300,
            color: inkMid,
            maxWidth: '580px',
            marginBottom: '36px',
          }}
        >
          Move between OSCE practice, quick-reference guides, and active recall without
          having to stitch your revision together from random tabs.
        </p>

        <div
          style={{
            border: `0.5px solid ${border}`,
            background: panel,
            overflow: 'hidden',
          }}
        >
          {tools.map((tool, index) => (
            <Link
              key={tool.href}
              href={tool.href}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: ink,
                padding: '34px 30px',
                borderBottom: index !== tools.length - 1 ? `0.5px solid ${border}` : 'none',
              }}
            >
              <div
                className="home-tool-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '96px minmax(0, 1fr)',
                  gap: '18px',
                  alignItems: 'start',
                }}
              >
                <div
                  style={{
                    fontFamily: display,
                    fontSize: '30px',
                    lineHeight: 1,
                    color: '#C7B8A5',
                    paddingTop: '4px',
                  }}
                >
                  {tool.num}
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: display,
                      fontSize: '24px',
                      fontWeight: 400,
                      lineHeight: 1.2,
                      color: ink,
                      marginBottom: '14px',
                    }}
                  >
                    {tool.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '14px',
                      lineHeight: 1.95,
                      fontWeight: 300,
                      color: inkMid,
                      maxWidth: '720px',
                      marginBottom: '18px',
                    }}
                  >
                    {tool.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {tool.tags.map((tag) => (
                      <span key={tag} style={tagStyle}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
