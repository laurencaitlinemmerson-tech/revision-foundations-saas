import Link from 'next/link';
import {
  serif, display, ink, inkMid, border, panel, parchment,
  sectionLabelStyle, wrap,
} from './styles';

export default function BranchSelector() {
  return (
    <section style={{ padding: '48px 24px 56px', borderBottom: `0.5px solid ${border}` }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <div style={{ maxWidth: '680px', marginBottom: '24px' }}>
          <p style={sectionLabelStyle}>Browse by branch</p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.12,
              color: ink,
              marginBottom: '12px',
            }}
          >
            Choose the nursing route you want to revise in.
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: '15px',
              lineHeight: 1.85,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '620px',
            }}
          >
            Children&apos;s is the most complete study route today. The adult hub is available too for revision guides and placement support.
          </p>
        </div>

        <div
          className="home-branch-strip"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '26px 28px',
              border: `0.5px solid ${border}`,
              background: panel,
            }}
          >
            <p style={{ ...sectionLabelStyle, marginBottom: '10px' }}>Children&apos;s nursing</p>
            <h2
              style={{
                fontFamily: display,
                fontSize: '30px',
                fontWeight: 400,
                color: ink,
                marginBottom: '10px',
              }}
            >
              Most complete right now.
            </h2>
            <p
              style={{
                fontFamily: serif,
                fontSize: '14px',
                lineHeight: 1.9,
                fontWeight: 300,
                color: inkMid,
                marginBottom: '18px',
              }}
            >
              Paediatric observations, PEWS, OSCE prep, placement pages, drug calculations, and quick-reference guides.
            </p>
            <Link href="/hub/childrens" style={{ fontFamily: serif, fontSize: '14px', color: ink, textDecoration: 'none' }}>
              Browse resources →
            </Link>
          </div>

          <div
            style={{
              padding: '26px 28px',
              border: `0.5px solid ${border}`,
              background: panel,
            }}
          >
            <p style={{ ...sectionLabelStyle, marginBottom: '10px' }}>Adult nursing</p>
            <h2
              style={{
                fontFamily: display,
                fontSize: '30px',
                fontWeight: 400,
                color: ink,
                marginBottom: '10px',
              }}
            >
              Revision guides live now.
            </h2>
            <p
              style={{
                fontFamily: serif,
                fontSize: '14px',
                lineHeight: 1.9,
                fontWeight: 300,
                color: inkMid,
                marginBottom: '18px',
              }}
            >
              Practical adult pages for escalation, fluids, documentation, infection control, and placement refreshers.
            </p>
            <Link href="/hub/adult" style={{ fontFamily: serif, fontSize: '14px', color: ink, textDecoration: 'none' }}>
              Explore adult hub →
            </Link>
          </div>

          <Link
            href="/hub/resources/ae-assessment-guide"
            style={{
              display: 'block',
              padding: '26px 28px',
              border: `0.5px solid ${border}`,
              background: parchment,
              textDecoration: 'none',
              color: ink,
            }}
          >
            <p style={{ ...sectionLabelStyle, marginBottom: '10px' }}>Start free</p>
            <h3
              style={{
                fontFamily: display,
                fontSize: '24px',
                fontWeight: 400,
                color: ink,
                marginBottom: '10px',
              }}
            >
              Open the pages students use first.
            </h3>
            <p
              style={{
                fontFamily: serif,
                fontSize: '14px',
                lineHeight: 1.9,
                fontWeight: 300,
                color: inkMid,
                marginBottom: '18px',
              }}
            >
              If you&apos;re deciding whether The Nurse Lab is worth it, start with
              the children&apos;s hub and the free A-E, obs, and placement pages before
              you buy.
            </p>
            <span style={{ fontFamily: serif, fontSize: '14px', color: ink }}>
              Read a sample guide →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
