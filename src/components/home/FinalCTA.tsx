import Link from 'next/link';
import {
  serif, display, ink, inkMid, inkLight, border, parchment,
  sectionLabelStyle, primaryButton, secondaryButton, wrap,
} from './styles';

export default function FinalCTA() {
  return (
    <>
      <section className="home-final-cta-main" style={{ padding: '88px 24px 96px', borderTop: `0.5px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Ready</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 2.6rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '14px',
            }}
          >
            Start with the tools you&apos;ll actually use on placement and before OSCEs.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.9,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '540px',
              marginBottom: '28px',
            }}
          >
            Start free in the hub, or unlock the full bundle when you want the complete
            OSCE tool, quiz bank, and revision library in one place.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {['£9.99 one payment', 'Free to start', 'Built for UK students'].map((item) => (
              <span
                key={item}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 10px',
                  fontFamily: serif,
                  fontSize: '12px',
                  color: inkMid,
                  background: parchment,
                }}
              >
                {item}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/pricing" style={primaryButton}>
              Get the bundle — £9.99 →
            </Link>
            <Link href="/hub/childrens" style={secondaryButton}>
              Start free →
            </Link>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section
        style={{
          padding: '26px 24px',
          background: parchment,
          borderTop: `0.5px solid ${border}`,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: serif,
            fontSize: '13px',
            lineHeight: 1.8,
            color: inkLight,
            fontWeight: 300,
          }}
        >
          Got a question or spotted something that needs updating?{' '}
          <a
            href="https://wa.me/447572650980"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: ink, textDecoration: 'underline' }}
          >
            WhatsApp me
          </a>{' '}
          or{' '}
          <Link href="/contact" style={{ color: ink, textDecoration: 'underline' }}>
            use the contact form
          </Link>
          .
        </p>
      </section>
    </>
  );
}
