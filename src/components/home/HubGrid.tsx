import Link from 'next/link';
import {
  serif, display, ink, inkMid, border, panel,
  sectionLabelStyle, wrap,
} from './styles';
import { hubResources } from './data';

export default function HubGrid() {
  return (
    <section style={{ padding: '72px 24px 84px', borderTop: `0.5px solid ${border}` }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <p style={sectionLabelStyle}>From the revision hub</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
            }}
          >
            Guides students actually use.
          </h2>

          <Link href="/hub" style={{ fontFamily: serif, fontSize: '14px', color: ink, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Browse all resources →
          </Link>
        </div>

        <div className="home-hub-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
          {hubResources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              style={{
                display: 'block',
                padding: '24px',
                border: `0.5px solid ${border}`,
                background: panel,
                textDecoration: 'none',
                color: ink,
                transition: 'border-color 0.15s',
              }}
              className="home-hub-card"
            >
              <h3 style={{ fontFamily: display, fontSize: '18px', fontWeight: 400, color: ink, marginBottom: '10px', lineHeight: 1.25 }}>
                {resource.title}
              </h3>
              <p style={{ fontFamily: serif, fontSize: '13px', lineHeight: 1.7, fontWeight: 300, color: inkMid }}>
                {resource.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
