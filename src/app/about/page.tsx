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
const paper = '#F7F2E8';
const border = '#D9D0C1';
const softLine = 'rgba(217, 208, 193, 0.7)';
const blush = '#EEE4DE';

const sectionLabel: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '16px',
};

const body: CSSProperties = {
  fontFamily: serif,
  fontSize: '16px',
  lineHeight: 2,
  fontWeight: 300,
  color: inkMid,
};

const editorialCard: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '34px',
  background: parchment,
  overflow: 'hidden',
};

const noteCard: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '30px',
  background: paper,
};

const chip: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: serif,
  fontSize: '13px',
  lineHeight: 1,
  color: inkMid,
  padding: '9px 15px',
  borderRadius: '999px',
  background: blush,
};

const textLink: CSSProperties = {
  fontFamily: serif,
  fontSize: '14px',
  color: ink,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
};

const smallCaps: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
};

const laurenFacts = [
  'Children’s nursing student',
  'Former medical photographer',
  'Pepsi Max Cherry',
  'Purple everything',
];

const supportItems = [
  'OSCE preparation',
  'Theory revision',
  'Placement support',
  'Quick refreshers',
];

export default function AboutPage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      <section style={{ padding: '132px 24px 88px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.15fr) minmax(220px, 0.85fr)',
              gap: '36px',
              alignItems: 'end',
            }}
          >
            <div>
              <p style={sectionLabel}>About me</p>

              <h1
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(3.2rem, 7.5vw, 5.4rem)',
                  lineHeight: 0.98,
                  fontWeight: 400,
                  letterSpacing: '-0.025em',
                  color: ink,
                  marginBottom: '24px',
                }}
              >
                Hi, I’m Lauren.
              </h1>

              <p
                style={{
                  ...body,
                  fontSize: '18px',
                  maxWidth: '640px',
                  marginBottom: '0',
                }}
              >
                I’m a children’s nursing student and the person behind Revision
                Foundations. I made it because I wanted revision tools that felt
                thoughtful, calm, and actually lovely to use.
              </p>
            </div>

            <div
              style={{
                paddingBottom: '10px',
              }}
            >
              <div
                style={{
                  borderLeft: `1px solid ${softLine}`,
                  paddingLeft: '24px',
                }}
              >
                <p style={{ ...smallCaps, marginBottom: '14px' }}>A few Lauren things</p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  {laurenFacts.map((item) => (
                    <span key={item} style={chip}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 76px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div style={editorialCard}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '150px minmax(0, 1fr)',
                gap: '0',
              }}
            >
              <div
                style={{
                  borderRight: `1px solid ${softLine}`,
                  padding: '42px 24px 42px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: display,
                      fontSize: '92px',
                      lineHeight: 0.9,
                      color: '#BBAA96',
                      marginBottom: '16px',
                    }}
                  >
                    L
                  </p>

                  <p style={smallCaps}>Founder note</p>
                </div>
              </div>

              <div style={{ padding: '42px 40px 46px' }}>
                <p style={sectionLabel}>How this started</p>

                <p style={{ ...body, marginBottom: '18px', maxWidth: '700px' }}>
                  Before nursing, I worked as a medical photographer in hospitals.
                  I loved being in clinical environments, but it never quite felt
                  like the right fit for me.
                </p>

                <p style={{ ...body, marginBottom: '18px', maxWidth: '700px' }}>
                  At 25, I decided to change direction, applied to nursing, and got
                  in. Children’s nursing felt right almost immediately. From my
                  first placement, I knew it was where I wanted to be.
                </p>

                <p style={{ ...body, marginBottom: '28px', maxWidth: '700px' }}>
                  What I struggled with was revision. Most resources felt either
                  overwhelming, badly designed, or just not that useful when you
                  were already tired and trying to take everything in. So I started
                  making my own.
                </p>

                <div
                  style={{
                    width: '100%',
                    maxWidth: '640px',
                    height: '1px',
                    background: softLine,
                    marginBottom: '28px',
                  }}
                />

                <p style={{ ...body, marginBottom: '18px', maxWidth: '700px' }}>
                  At first they were just for me. Then people on my course started
                  asking for them too, and that’s when Revision Foundations slowly
                  became a real thing.
                </p>

                <p style={{ ...body, maxWidth: '700px' }}>
                  I still make everything in the same way — based on what actually
                  feels helpful when you’re revising, not what sounds good on paper.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 76px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(240px, 320px)',
              gap: '18px',
            }}
          >
            <div style={noteCard}>
              <div style={{ padding: '34px 34px 36px' }}>
                <p style={sectionLabel}>What this is</p>

                <p
                  style={{
                    fontFamily: display,
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    lineHeight: 1.08,
                    color: ink,
                    marginBottom: '16px',
                    maxWidth: '520px',
                  }}
                >
                  Revision tools made the way I wanted them to feel.
                </p>

                <p style={{ ...body, maxWidth: '620px' }}>
                  Clear, practical, and actually nice to come back to. Built for
                  OSCE prep, theory revision, placement support, and those quick
                  refreshers you always seem to need at exactly the wrong moment.
                </p>
              </div>
            </div>

            <div
              style={{
                ...noteCard,
                background: cream,
              }}
            >
              <div style={{ padding: '34px 28px 36px' }}>
                <p style={sectionLabel}>What it helps with</p>

                <div
                  style={{
                    display: 'grid',
                    gap: '10px',
                  }}
                >
                  {supportItems.map((item) => (
                    <div
                      key={item}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '999px',
                        border: `1px solid ${softLine}`,
                        fontFamily: serif,
                        fontSize: '14px',
                        color: inkMid,
                        textAlign: 'center',
                        background: parchment,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div
            style={{
              ...editorialCard,
              background: cream,
            }}
          >
            <div
              style={{
                padding: '38px 36px 40px',
              }}
            >
              <p style={sectionLabel}>A small note</p>

              <p
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(2rem, 4vw, 2.6rem)',
                  lineHeight: 1.1,
                  color: ink,
                  marginBottom: '16px',
                  maxWidth: '620px',
                }}
              >
                I still use these resources myself.
              </p>

              <p style={{ ...body, marginBottom: '18px', maxWidth: '660px' }}>
                Which means I notice pretty quickly when something feels unclear,
                clunky, or like it needs improving.
              </p>

              <p style={{ ...body, marginBottom: '24px', maxWidth: '660px' }}>
                If you ever have a question, spot something that doesn’t make
                sense, or just want to say hi, I really do read every message.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                <Link href="/contact" style={textLink}>
                  Contact me →
                </Link>

                <Link href="/hub" style={textLink}>
                  Browse the hub →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
