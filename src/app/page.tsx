'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";

const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';

const cream = '#F9F6F0';
const parchment = '#F3EEE4';
const panel = '#F7F2E8';
const panelSoft = 'rgba(255,255,255,0.32)';
const border = '#DDD5C8';

export default function HomePage() {
  const tools = [
    {
      num: '01',
      title: "Children's OSCE Tool",
      desc: '50+ practice stations covering paediatric observations, A–E assessment, medication administration, safeguarding, and SBAR handover.',
      tags: ['Paed obs', 'A–E assessment', 'Medication admin', 'Safeguarding'],
      href: '/osce',
    },
    {
      num: '02',
      title: 'Core Nursing Quiz',
      desc: 'Topic-based revision across vital signs, drug calculations, anatomy and physiology, pharmacology, infection control, and fluid balance.',
      tags: ['Drug calculations', 'Vital signs', 'Pharmacology', 'Infection control'],
      href: '/quiz',
    },
    {
      num: '03',
      title: 'Revision Hub',
      desc: 'Clinical guides, cheat sheets, and reference articles for the topics nursing students actually need during placement and revision.',
      tags: ['Cheat sheets', 'Clinical guides', 'Placement tips', 'Q&A'],
      href: '/hub',
    },
  ];

  const whyItems = [
    {
      title: 'Branch-specific content',
      text: "Children's nursing is live now, with paediatric observations, PEWS, safeguarding, and family-centred care built in from the start.",
    },
    {
      title: 'Built around real assessments',
      text: 'The structure reflects the way nursing students are actually assessed in OSCEs, written exams, and placement settings.',
    },
    {
      title: 'One payment, no subscription',
      text: 'Pay once and keep access. New material is added over time, with future updates included.',
    },
  ];

  const sectionLabelStyle: React.CSSProperties = {
    fontFamily: serif,
    fontSize: '11px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: inkLight,
    marginBottom: '14px',
  };

  const primaryButton: React.CSSProperties = {
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

  const secondaryButton: React.CSSProperties = {
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

  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      <section style={{ padding: '128px 24px 110px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>OSCE prep · theory revision · placement support</p>

          <h1
            style={{
              fontFamily: display,
              fontSize: 'clamp(2.8rem, 7vw, 4.4rem)',
              fontWeight: 400,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: ink,
              marginBottom: '24px',
            }}
          >
            Pass your nursing
            <br />
            <em>assessments.</em>
          </h1>

          <p
            style={{
              fontFamily: serif,
              fontSize: '18px',
              lineHeight: 1.9,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '560px',
              marginBottom: '34px',
            }}
          >
            Revision tools built by a nursing student, for nursing students — with OSCE practice,
            focused quizzes, and practical revision guides designed around what actually gets tested.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Link href="/pricing" style={primaryButton}>
              Start revising →
            </Link>
            <Link href="/quiz" style={secondaryButton}>
              Try free preview →
            </Link>
          </div>

          <p
            style={{
              fontFamily: serif,
              fontSize: '13px',
              lineHeight: 1.8,
              color: inkLight,
              fontWeight: 300,
            }}
          >
            £9.99 one-time payment · Lifetime access · 7-day guarantee
          </p>
        </div>
      </section>

      <section style={{ padding: '84px 24px 72px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Choose your branch</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 2.4rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '32px',
            }}
          >
            Which branch are you studying?
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            <Link
              href="/hub/childrens"
              style={{
                display: 'block',
                padding: '30px',
                border: `1px solid ${border}`,
                borderRadius: '22px',
                background: panelSoft,
                textDecoration: 'none',
                color: ink,
              }}
            >
              <p
                style={{
                  ...sectionLabelStyle,
                  marginBottom: '12px',
                }}
              >
                Available now
              </p>

              <h3
                style={{
                  fontFamily: display,
                  fontSize: '24px',
                  fontWeight: 400,
                  color: ink,
                  marginBottom: '12px',
                }}
              >
                Children&apos;s Nursing
              </h3>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  lineHeight: 1.85,
                  fontWeight: 300,
                  color: inkMid,
                  marginBottom: '20px',
                }}
              >
                Paediatric observations, PEWS, paediatric OSCEs, family-centred care,
                developmental milestones, and more.
              </p>

              <span
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  color: ink,
                }}
              >
                Browse resources →
              </span>
            </Link>

            <div
              style={{
                padding: '30px',
                border: `1px solid ${border}`,
                borderRadius: '22px',
                background: 'transparent',
                opacity: 0.72,
              }}
            >
              <p
                style={{
                  ...sectionLabelStyle,
                  marginBottom: '12px',
                }}
              >
                Coming soon
              </p>

              <h3
                style={{
                  fontFamily: display,
                  fontSize: '24px',
                  fontWeight: 400,
                  color: inkMid,
                  marginBottom: '12px',
                }}
              >
                Adult Nursing
              </h3>

              <p
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  lineHeight: 1.85,
                  fontWeight: 300,
                  color: inkMid,
                  marginBottom: '20px',
                }}
              >
                NEWS2, sepsis, wound care, medication management, and adult-specific OSCE
                stations.
              </p>

              <span
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  color: inkMid,
                }}
              >
                Join waitlist →
              </span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '36px 24px 84px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>What&apos;s included</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 2.4rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '16px',
            }}
          >
            Everything you need, in one place.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.9,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '560px',
              marginBottom: '40px',
            }}
          >
            A calmer way to revise for OSCEs, theory exams, and placement — without generic
            resources or scattered notes.
          </p>

          <div>
            {tools.map((tool, index) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: ink,
                  padding: '0 0 30px',
                  marginBottom: '30px',
                  borderBottom: index !== tools.length - 1 ? `1px solid ${border}` : 'none',
                }}
              >
                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    color: inkLight,
                    marginBottom: '10px',
                  }}
                >
                  {tool.num}
                </p>

                <h3
                  style={{
                    fontFamily: display,
                    fontSize: '24px',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    color: ink,
                    marginBottom: '10px',
                  }}
                >
                  {tool.title}
                </h3>

                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '14px',
                    lineHeight: 1.9,
                    fontWeight: 300,
                    color: inkMid,
                    maxWidth: '640px',
                    marginBottom: '10px',
                  }}
                >
                  {tool.desc}
                </p>

                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '12px',
                    lineHeight: 1.8,
                    color: inkLight,
                  }}
                >
                  {tool.tags.join(' · ')}
                </p>
              </Link>
            ))}
          </div>

          <div
            style={{
              marginTop: '42px',
              padding: '44px 40px',
              borderRadius: '24px',
              background: panel,
              border: `1px solid ${border}`,
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: inkLight,
                marginBottom: '14px',
              }}
            >
              Children&apos;s Nursing Bundle
            </p>

            <p
              style={{
                fontFamily: display,
                fontSize: '56px',
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
                lineHeight: 1.85,
                color: inkMid,
                maxWidth: '480px',
                marginBottom: '24px',
              }}
            >
              One-time access to the OSCE Tool, Core Quiz, Revision Hub, and all future updates.
            </p>

            <div
              style={{
                width: '100%',
                maxWidth: '420px',
                height: '1px',
                background: border,
                marginBottom: '24px',
              }}
            />

            <p
              style={{
                fontFamily: serif,
                fontSize: '14px',
                lineHeight: 2,
                color: inkMid,
                marginBottom: '28px',
              }}
            >
              50+ OSCE stations
              <br />
              Topic-based quizzes with explanations
              <br />
              Clinical guides, cheat sheets, and references
            </p>

            <Link href="/pricing" style={primaryButton}>
              Start revising →
            </Link>

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
        </div>
      </section>

      <section style={{ padding: '84px 24px', background: parchment }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={sectionLabelStyle}>Why it exists</p>

          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 2.4rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: ink,
              marginBottom: '40px',
            }}
          >
            Designed around real nursing assessments.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '36px',
            }}
          >
            {whyItems.map((item) => (
              <div key={item.title}>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: '20px',
                    fontWeight: 400,
                    lineHeight: 1.25,
                    color: ink,
                    marginBottom: '12px',
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '14px',
                    lineHeight: 1.9,
                    fontWeight: 300,
                    color: inkMid,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section style={{ padding: '88px 24px 96px', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
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
            Start with the tools you&apos;ll actually use.
          </h2>

          <p
            style={{
              fontFamily: serif,
              fontSize: '16px',
              lineHeight: 1.9,
              fontWeight: 300,
              color: inkMid,
              maxWidth: '520px',
              marginBottom: '28px',
            }}
          >
            One payment. Lifetime access. Built for nursing students preparing for real
            assessments.
          </p>

          <Link href="/pricing" style={primaryButton}>
            Explore the bundle →
          </Link>
        </div>
      </section>

      <section
        style={{
          padding: '26px 24px',
          background: parchment,
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
