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

const tagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: serif,
  fontSize: '12px',
  color: inkMid,
  background: tagBg,
  padding: '7px 14px',
  borderRadius: '999px',
  lineHeight: 1,
};

const principles = [
  {
    title: 'Built around real assessments',
    text: 'The tools are designed for OSCEs, theory exams, placement learning, and the kinds of topics nursing students are actually expected to know under pressure.',
  },
  {
    title: 'Made by a nursing student',
    text: 'I use these resources myself, which means I notice quickly when something feels unclear, clunky, or not useful enough.',
  },
  {
    title: 'One payment, no subscription',
    text: 'You pay once and keep access. New material is added over time, with future updates included.',
  },
];

const supportAreas = [
  'OSCE preparation',
  'Theory revision',
  'Placement support',
  'Quick refreshers',
];

export default function AboutPage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      <section
        style={{
          padding: '128px 24px 104px',
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>About</p>

          <h1
            style={{
              fontFamily: display,
              fontSize: 'clamp(3rem, 7vw, 4.8rem)',
              fontWeight: 400,
              lineHeight: 1.01,
              letterSpacing: '-0.02em',
              color: ink,
              marginBottom: '26px',
              maxWidth: '780px',
            }}
          >
            Why I made
            <br />
            <em>Revision Foundations.</em>
          </h1>

          <p
            style={{
              fontFamily: serif,
              fontSize: '18px',
              lineHeight: 1.95,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '620px',
              marginBottom: '36px',
            }}
          >
            I’m Lauren — a children’s nursing student and former medical
            photographer. I started building these tools because I wanted
            revision resources that felt clearer, calmer, and genuinely useful.
          </p>

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

      <section style={{ padding: '84px 24px 40px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>My story</p>

          <div style={cardStyle}>
            <div style={{ padding: '36px 32px' }}>
              <p style={{ ...bodyText, marginBottom: '18px' }}>
                Before nursing, I worked as a medical photographer in hospitals.
                I loved being in clinical environments, but it never quite felt
                like the right fit for me. At 25, I decided to change direction,
                applied to nursing, and got in.
              </p>

              <p style={{ ...bodyText, marginBottom: '18px' }}>
                Children’s nursing felt right very quickly. From my first
                placement, I knew it was where I wanted to be.
              </p>

              <p style={bodyText}>
                What I struggled with was revision. So many resources felt badly
                designed, hard to use, or too expensive for what they were. I
                started making my own, first for myself, then for coursemates —
                and that gradually became Revision Foundations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '36px 24px 52px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Why it exists</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.12,
              color: ink,
              marginBottom: '18px',
              maxWidth: '640px',
            }}
          >
            Revision support that feels easier to use.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.95,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '590px',
              marginBottom: '40px',
            }}
          >
            The aim is simple: make tools that help nursing students revise for
            real assessments without the clutter, vagueness, or overwhelm.
          </p>

          <div style={cardStyle}>
            {principles.map((item, index) => (
              <div
                key={item.title}
                style={{
                  padding: '34px 32px',
                  borderBottom:
                    index !== principles.length - 1
                      ? `1px solid ${border}`
                      : 'none',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 250px) minmax(0, 1fr)',
                    gap: '22px',
                    alignItems: 'start',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: display,
                      fontSize: '24px',
                      fontWeight: 400,
                      lineHeight: 1.2,
                      color: ink,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p style={bodyText}>{item.text}</p>
                </div>
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
          <p style={sectionLabelStyle}>What it supports</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2.2rem, 4.5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.12,
              color: ink,
              marginBottom: '18px',
              maxWidth: '680px',
            }}
          >
            Built for the parts of nursing school that matter most.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.95,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '590px',
              marginBottom: '40px',
            }}
          >
            The tools are designed to support the way student nurses actually
            revise, prepare, and practise.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '46px',
            }}
          >
            {supportAreas.map((item) => (
              <div
                key={item}
                style={{
                  padding: '18px 18px',
                  border: `1px solid ${border}`,
                  borderRadius: '999px',
                  background: panelSoft,
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: '14px',
                    color: ink,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: '48px 40px',
              borderRadius: '28px',
              background: panel,
              border: `1px solid ${border}`,
            }}
          >
            <p style={sectionLabelStyle}>A simple promise</p>

            <p
              style={{
                fontFamily: display,
                fontSize: 'clamp(2rem, 4vw, 2.9rem)',
                lineHeight: 1.06,
                color: ink,
                marginBottom: '16px',
                maxWidth: '580px',
              }}
            >
              No subscription.
              <br />
              Just one payment.
            </p>

            <p
              style={{
                fontFamily: serif,
                fontSize: '15px',
                lineHeight: 1.95,
                color: inkMid,
                maxWidth: '540px',
                marginBottom: '24px',
                fontWeight: 300,
              }}
            >
              You pay once and keep access to the tools included, with future
              updates added over time as Revision Foundations grows.
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

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '28px',
              }}
            >
              {[
                'OSCE practice',
                'Topic quizzes',
                'Clinical guides',
                'Future updates',
              ].map((item) => (
                <span key={item} style={tagStyle}>
                  {item}
                </span>
              ))}
            </div>

            <Link href="/pricing" style={primaryButton}>
              See the bundle →
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '84px 24px', background: parchment }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>A note</p>

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
            Still made with care.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.95,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '640px',
              marginBottom: '28px',
            }}
          >
            I still use these resources myself, and I still notice when
            something needs tightening up. If you have a question, spot
            something unclear, or think something should be added, I genuinely
            want to hear it.
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
