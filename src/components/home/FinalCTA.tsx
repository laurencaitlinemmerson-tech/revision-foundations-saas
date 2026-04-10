import Link from 'next/link';
import DesktopAppButton from '@/components/DesktopAppButton';
import {
  serif, display, ink, inkMid, inkLight, border, parchment, blue, blueLine, infoBg,
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
            {['Start free first', 'One payment', 'Built for UK students'].map((item) => (
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
            <Link href="/hub/childrens" style={primaryButton}>
              Start free →
            </Link>
            <Link href="/pricing" style={secondaryButton}>
              Explore the bundle →
            </Link>
            <DesktopAppButton
              label="Download desktop app"
              style={{
                ...secondaryButton,
                background: infoBg,
                border: `0.5px solid ${blueLine}`,
                color: blue,
              }}
              title="Install The Nurse Lab as a desktop app"
            />
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
