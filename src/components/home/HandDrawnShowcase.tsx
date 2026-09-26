import Link from 'next/link';
import { InteractiveHeart } from '@/components/hub/InteractiveHeart';
import {
  border, display, ink, inkMid, panel, parchment,
  sectionLabelStyle, serif, wrap,
} from './styles';

export default function HandDrawnShowcase() {
  return (
    <section style={{ padding: '0 24px 72px' }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <div style={{ maxWidth: '640px', marginBottom: '28px' }}>
          <p style={sectionLabelStyle}>Drawn by hand, made to explore</p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(1.7rem, 3vw, 2.3rem)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: ink,
              marginBottom: '12px',
            }}
          >
            Diagrams you can <em>touch</em>, not just look at.
          </h2>
          <p
            style={{
              fontFamily: serif,
              fontSize: '14px',
              lineHeight: 1.85,
              fontWeight: 300,
              color: inkMid,
              margin: 0,
            }}
          >
            This heart was drawn by hand in Adobe Illustrator, then made interactive. Tap any part of the heart below, or press
            <strong style={{ fontWeight: 500, color: ink }}> Follow the blood </strong>
            to watch one full loop from the body, through the lungs and back out again.
          </p>
        </div>

        <div
          style={{
            background: panel,
            border: `0.5px solid ${border}`,
            padding: 'clamp(18px, 3vw, 32px)',
            maxWidth: '820px',
          }}
        >
          <InteractiveHeart />
        </div>

        <Link
          href="/hub/resources/ecg-cardiac-conduction"
          style={{
            display: 'inline-block',
            marginTop: '20px',
            fontFamily: serif,
            fontSize: '13px',
            letterSpacing: '0.04em',
            color: ink,
            background: parchment,
            border: `0.5px solid ${border}`,
            padding: '11px 22px',
            textDecoration: 'none',
          }}
        >
          See it in the ECG &amp; cardiac conduction guide &rarr;
        </Link>
      </div>
    </section>
  );
}
