import {
  serif, display, ink, inkMid, border, panel,
  sectionLabelStyle, wrap,
} from './styles';
import { trustHighlights } from './data';

export default function TrustSection() {
  return (
    <section style={{ padding: '72px 24px 76px', borderTop: `0.5px solid ${border}`, borderBottom: `0.5px solid ${border}` }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <p style={sectionLabelStyle}>Why trust it</p>

        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: 400,
            lineHeight: 1.12,
            color: ink,
            marginBottom: '14px',
            maxWidth: '700px',
          }}
        >
          Calm design is only useful if the studying itself still feels solid.
        </h2>

        <p
          style={{
            fontFamily: serif,
            fontSize: '16px',
            lineHeight: 1.9,
            fontWeight: 300,
            color: inkMid,
            maxWidth: '640px',
            marginBottom: '32px',
          }}
        >
          The point is not to look polished for the sake of it. The point is to make OSCE prep, placement refreshers, and high-yield revision easier to come back to under pressure.
        </p>

        <div
          className="home-trust-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '18px',
          }}
        >
          {trustHighlights.map((item) => (
            <div
              key={item.label}
              style={{
                border: `0.5px solid ${border}`,
                background: panel,
                padding: '22px 22px 20px',
              }}
            >
              <p style={{ ...sectionLabelStyle, marginBottom: '10px' }}>{item.label}</p>
              <h3
                style={{
                  fontFamily: display,
                  fontSize: '24px',
                  fontWeight: 400,
                  lineHeight: 1.12,
                  color: ink,
                  marginBottom: '12px',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  lineHeight: 1.9,
                  fontWeight: 300,
                  color: inkMid,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
