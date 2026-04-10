import {
  serif, display, ink, inkMid, parchment,
  sectionLabelStyle, wrap,
} from './styles';
import { whyItems } from './data';

export default function WhySection() {
  return (
    <section style={{ padding: '72px 24px 76px', background: parchment }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <p style={sectionLabelStyle}>Why it exists</p>

        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: ink,
            marginBottom: '40px',
          }}
        >
          Designed around real nursing assessments.
        </h2>

        <div
          className="home-why-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '36px',
          }}
        >
          {whyItems.map((item) => (
            <div key={item.title}>
              <h3
                style={{
                  fontFamily: display,
                  fontSize: '20px',
                  fontWeight: 400,
                  lineHeight: 1.25,
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
                  lineHeight: 1.95,
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
