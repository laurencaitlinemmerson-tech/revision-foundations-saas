'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ink = '#1C1510';
const cream = '#F9F6F0';
const border = '#D9D0C1';
const green = '#1E8A4D';
const tagBg = '#EFE5D4';
const display = "'Playfair Display', Georgia, serif";
const serif = "'Source Serif 4', Georgia, serif";
const wrap = '1120px';

const primaryButton: CSSProperties = {
  display: 'inline-block',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: ink,
  color: cream,
  padding: '12px 24px',
  borderRadius: '9999px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const sectionLabelStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#9C8878',
  marginBottom: '14px',
};

export default function ReviewSection() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      {/* Review Section */}
      <section style={{ padding: '100px 24px 80px', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: wrap, margin: '0 auto', textAlign: 'center' }}>
          <p style={sectionLabelStyle}>Your Opinion Matters</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '24px',
            }}
          >
            Share Your Experience with Us
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '18px',
              lineHeight: 1.8,
              fontWeight: 300,
              color: '#5C4A38',
              maxWidth: '600px',
              marginBottom: '40px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Your feedback helps us improve and better serve you. We’d love to hear how we’ve helped you in your nursing journey!
          </p>

          <Link href="https://g.page/r/CW5Zf9rFJ4f0EAI/review" target="_blank" style={primaryButton}>
            Leave a Review →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
