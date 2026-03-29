'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#F9F6F0';
const parchment = '#F3EEE4';
const panel = '#F6F0E5';
const panelSoft = 'rgba(255,255,255,0.42)';
const border = '#D9D0C1';
const tagBg = '#EFE5D4';

const sectionLabelStyle: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

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

const secondaryButton: CSSProperties = {
  display: 'inline-block',
  fontFamily: serif,
  fontSize: '14px',
  fontWeight: 400,
  background: 'transparent',
  color: ink,
  padding: '11px 24px',
  borderRadius: '9999px',
  border: `1px solid ${border}`,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const bodyText: CSSProperties = {
  fontFamily: serif,
  fontSize: '15px',
  lineHeight: 1.95,
  fontWeight: 300,
  color: inkMid,
};

const cardStyle: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '28px',
  background: panel,
  overflow: 'hidden',
};

const chipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: serif,
  fontSize: '13px',
  color: inkMid,
  background: tagBg,
  padding: '8px 14px',
  borderRadius: '999px',
  lineHeight: 1,
};

const littleThings = [
  'Children’s nursing student',
  'Former medical photographer',
  'Pepsi Max Cherry loyalist',
  'Purple everything',
];

export default function AboutPage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      <section
        style={{
          padding: '128px 24px 96px',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>About me</p>

          <h1
            style={{
              fontFamily: display,
              fontSize: 'clamp(3rem, 7vw, 4.7rem)',
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: ink,
              marginBottom: '24px',
              maxWidth: '760px',
            }}
          >
            Hi, I’m Lauren.
          </h1>

          <p
            style={{
              fontFamily: serif,
              fontSize: '18px',
              lineHeight: 1.95,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '640px',
              marginBottom: '32px',
            }}
          >
            I’m a children’s nursing student, former medical photographer, and
            the person behind Revision Foundations. I made this because I
            couldn’t find revision tools I actually liked using.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '34px',
            }}
          >
            {littleThings.map((item) => (
              <span key={item} style={chipStyle}>
                {item}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Link href="/hub" style={primaryButton}>
              Explore the hub →
            </Link>
            <Link href="/contact" style={secondaryButton}>
              Get in touch →
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '84px 24px 44px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>How this started</p>

          <div style={cardStyle}>
            <div style={{ padding: '36px 32px' }}>
              <p style={{ ...bodyText, marginBottom: '18px' }}>
                Before nursing, I spent years working as a medical photographer
                in hospitals. It was interesting work, and I liked being in that
                environment, but it never quite felt like the right fit for me.
              </p>

              <p style={{ ...bodyText, marginBottom: '18px' }}>
                At 25, I decided to change direction, applied to nursing, and
                got in. Children’s nursing felt right very quickly. From my
                first placement, I knew it was the branch for me.
              </p>

              <p style={bodyText}>
                What was harder was finding revision resources that didn’t feel
                boring, badly designed, overwhelming, or oddly expensive. So I
                started making my own. At first they were just for me, then for
                coursemates, and eventually that became Revision Foundations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '28px 24px 52px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>What this is</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2.1rem, 4.3vw, 2.9rem)',
              fontWeight: 400,
              lineHeight: 1.14,
              color: ink,
              marginBottom: '18px',
              maxWidth: '660px',
            }}
          >
            Revision tools made the way I wanted them to feel.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.95,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '600px',
              marginBottom: '36px',
            }}
          >
            Clear, practical, and actually nice to come back to when your brain
            is already full. The hub is built for OSCE prep, theory revision,
            placement support, and those quick refreshers you end up needing all
            the time.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                title: 'Made by someone doing the degree',
                text: 'I’m making this alongside nursing school, so it stays close to real student life and what actually feels useful.',
              },
              {
                title: 'Built to be easy to use',
                text: 'I care a lot about making things feel clear, calm, and not like a giant wall of text you never want to open again.',
              },
              {
                title: 'One payment',
                text: 'No subscription. You pay once and keep access, including future updates as I keep adding to it.',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  border: `1px solid ${border}`,
                  borderRadius: '24px',
                  background: panelSoft,
                  padding: '26px 24px',
                }}
              >
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: '22px',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    color: ink,
                    marginBottom: '12px',
                  }}
                >
                  {item.title}
                </h3>

                <p style={bodyText}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: '36px 24px 88px',
          borderTop: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>A small note</p>

          <div
            style={{
              padding: '44px 38px',
              borderRadius: '28px',
              background: panel,
              border: `1px solid ${border}`,
            }}
          >
            <p
              style={{
                fontFamily: display,
                fontSize: 'clamp(2rem, 4vw, 2.7rem)',
                lineHeight: 1.1,
                color: ink,
                marginBottom: '16px',
                maxWidth: '620px',
              }}
            >
              I still use these resources myself.
            </p>

            <p
              style={{
                fontFamily: serif,
                fontSize: '15px',
                lineHeight: 1.95,
                color: inkMid,
                maxWidth: '620px',
                marginBottom: '24px',
                fontWeight: 300,
              }}
            >
              So if something feels unclear, clunky, or like it needs improving,
              I usually notice it too. If you ever have a question, spot
              something that needs updating, or just want to say hi, I really do
              read every message.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <Link href="/contact" style={primaryButton}>
                Contact me →
              </Link>
              <Link href="/hub" style={secondaryButton}>
                Browse resources →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '84px 24px', background: parchment }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Outside of revision</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '18px',
            }}
          >
            A few Lauren facts.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.95,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '620px',
              marginBottom: '30px',
            }}
          >
            Because an About page should probably feel a bit human.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
            }}
          >
            {[
              'I study children’s nursing.',
              'I used to work as a medical photographer.',
              'I will nearly always pick Pepsi Max Cherry.',
              'I genuinely do love good design.',
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: '20px 20px',
                  border: `1px solid ${border}`,
                  borderRadius: '22px',
                  background: cream,
                }}
              >
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '15px',
                    lineHeight: 1.8,
                    color: inkMid,
                    fontWeight: 300,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          padding: '26px 24px',
          background: cream,
          borderTop: `1px solid ${border}`,
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

      <Footer />
    </div>
  );
}
