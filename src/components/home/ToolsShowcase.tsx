import Link from 'next/link';
import ProductVisualShowcase from '@/components/product-pages/ProductVisualShowcase';
import {
  serif, display, ink, inkMid, border, panel,
  sectionLabelStyle, secondaryButton, wrap,
} from './styles';

export default function ToolsShowcase() {
  return (
    <section style={{ padding: '56px 24px 64px', borderBottom: `0.5px solid ${border}` }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <p style={sectionLabelStyle}>See the tools</p>

        <h2
          style={{
            fontFamily: display,
            fontSize: 'clamp(2rem, 4vw, 2.7rem)',
            fontWeight: 400,
            lineHeight: 1.12,
            color: ink,
            marginBottom: '14px',
            maxWidth: '14ch',
          }}
        >
          A closer look at the two paid tools.
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
          Real exported views from the paid tools, so the quiz and OSCE flow feel tangible before you open the previews.
        </p>

        <div
          className="home-tool-visual-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '18px',
          }}
        >
          <div
            style={{
              border: `0.5px solid ${border}`,
              background: panel,
              padding: '22px',
            }}
          >
            <ProductVisualShowcase variant="quiz" compact />
            <div style={{ marginTop: '18px' }}>
              <p style={{ ...sectionLabelStyle, marginBottom: '8px' }}>Core quiz</p>
              <p
                style={{
                  fontFamily: display,
                  fontSize: '28px',
                  lineHeight: 1.08,
                  color: ink,
                  marginBottom: '10px',
                }}
              >
                Question, feedback, then a better sense of what still needs work.
              </p>
              <Link href="/quiz" style={{ ...secondaryButton, padding: '10px 18px' }}>
                Explore quiz page {'->'}
              </Link>
            </div>
          </div>

          <div
            style={{
              border: `0.5px solid ${border}`,
              background: panel,
              padding: '22px',
            }}
          >
            <ProductVisualShowcase variant="osce" compact />
            <div style={{ marginTop: '18px' }}>
              <p style={{ ...sectionLabelStyle, marginBottom: '8px' }}>OSCE tool</p>
              <p
                style={{
                  fontFamily: display,
                  fontSize: '28px',
                  lineHeight: 1.08,
                  color: ink,
                  marginBottom: '10px',
                }}
              >
                Station structure, checklist cues, and a calmer run-up to timed practice.
              </p>
              <Link href="/osce" style={{ ...secondaryButton, padding: '10px 18px' }}>
                Explore OSCE page {'->'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
