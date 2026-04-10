import Link from 'next/link';
import {
  serif, display, ink, inkMid, inkLight, border, panel,
  sectionLabelStyle, primaryButton, secondaryButton, tagStyle, wrap,
} from './styles';

export default function BundleCTA() {
  return (
    <div
      className="home-bundle-cta"
      style={{
        marginTop: '44px',
        padding: '46px 40px',
        background: panel,
        border: `0.5px solid ${border}`,
        maxWidth: wrap,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <p style={sectionLabelStyle}>Children&apos;s Nursing Bundle</p>

      <p
        style={{
          fontFamily: display,
          fontSize: '58px',
          lineHeight: 1,
          color: ink,
          marginBottom: '14px',
        }}
      >
        £9.99
      </p>

      <p
        style={{
          fontFamily: serif,
          fontSize: '15px',
          lineHeight: 1.9,
          color: inkMid,
          maxWidth: '500px',
          marginBottom: '24px',
        }}
      >
        One-time access to the OSCE Tool, Core Quiz, Revision Hub, and all future
        updates.
      </p>

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '1px',
          background: border,
          marginBottom: '24px',
        }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
        {['50+ OSCE stations', 'Topic-based quizzes', 'Clinical guides', 'Future updates'].map(
          (item) => (
            <span key={item} style={tagStyle}>
              {item}
            </span>
          ),
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link href="/pricing" style={primaryButton}>
          Get the Children&apos;s Bundle →
        </Link>
        <Link href="/hub/childrens" style={secondaryButton}>
          Browse free resources →
        </Link>
      </div>

      <p
        style={{
          fontFamily: serif,
          fontSize: '12px',
          color: inkLight,
          marginTop: '14px',
        }}
      >
        7-day guarantee
      </p>
    </div>
  );
}
