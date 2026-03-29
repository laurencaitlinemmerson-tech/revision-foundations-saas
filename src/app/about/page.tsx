'use client';

import Link from 'next/link';
import Image from 'next/image';
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
const border = '#D9D0C1';
const softLine = 'rgba(217, 208, 193, 0.7)';
const blush = '#EEE4DE';

const sectionLabel: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
  marginBottom: '14px',
};

const body: CSSProperties = {
  fontFamily: serif,
  fontSize: '16px',
  lineHeight: 2,
  fontWeight: 300,
  color: inkMid,
};

const smallCaps: CSSProperties = {
  fontFamily: serif,
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: inkLight,
};

const textLink: CSSProperties = {
  fontFamily: serif,
  fontSize: '14px',
  color: ink,
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
};

const editorialCard: CSSProperties = {
  border: `1px solid ${border}`,
  borderRadius: '34px',
  background: parchment,
  overflow: 'hidden',
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

const introPoints = [
  {
    number: '01',
    title: 'Thoughtful design',
    text: 'Made to feel calm, clear, and easy to come back to when revision already feels heavy.',
  },
  {
    number: '02',
    title: 'Built from practice',
    text: 'Shaped by placement learning, real nursing study, and the things I actually needed myself.',
  },
  {
    number: '03',
    title: 'Actually useful',
    text: 'Created for OSCE prep, theory revision, placement support, and quick refreshers that save time.',
  },
  {
    number: '04',
    title: 'Still evolving',
    text: 'Everything gets improved when it feels clunky, unclear, or not quite helpful enough.',
  },
];

const supportItems = [
  'Resources that are clear before they are clever',
  'Revision tools designed to feel calm, not chaotic',
  'Useful support for both OSCE prep and theory',
  'Content that gets updated when something needs improving',
];

const laurenFacts = [
  "Children's nursing student",
  'Former medical photographer',
  'Pepsi Max Cherry',
  'Purple everything',
];

const blogPosts = [
  {
    title: 'Maintaining Wellness During Placement',
    excerpt: 'A look at how simple habits like meal prepping and exercise can help you stay healthy during a busy placement...',
    link: '/blog/wellness-placement',
  },
  {
    title: 'The Importance of Mental Health in Nursing',
    excerpt: 'Taking care of your mental health in a demanding field like nursing is vital to your long-term success...',
    link: '/blog/mental-health-nursing',
  },
  {
    title: 'Study Hacks for OSCE Success',
    excerpt: 'Tips and tricks to help you ace your OSCE exams while staying calm and confident...',
    link: '/blog/study-hacks-osce',
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      <section className="about-hero" style={{ padding: '132px 24px 60px' }}>
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-34px',
              left: '-26px',
              width: '220px',
              height: '220px',
              borderRadius: '999px',
              background: 'rgba(238, 228, 222, 0.55)',
              filter: 'blur(10px)',
              zIndex: 0,
            }}
          />

          <div
            className="about-hero-grid"
            style={{ position: 'relative', zIndex: 1 }}
          >
            <div>
              <p
                style={{
                  ...smallCaps,
                  marginBottom: '18px',
                }}
              >
                Founder story · Revision Foundations
              </p>

              <h1
                className="about-headline"
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
                Hi, I&apos;m Lauren.
              </h1>

              <p
                style={{
                  ...body,
                  fontSize: '18px',
                  maxWidth: '590px',
                  marginBottom: '0',
                }}
              >
                I&apos;m a children&apos;s nursing student and the person behind
                Revision Foundations. I started making these resources because I
                wanted revision tools that felt thoughtful, calm, and genuinely
                lovely to use.
              </p>
            </div>

            <div className="about-right-col">
              <div
                className="about-photo-frame"
                style={{
                  borderRadius: '28px',
                  overflow: 'hidden',
                  border: `1px solid ${softLine}`,
                  background: parchment,
                  aspectRatio: '4 / 5',
                  position: 'relative',
                }}
              >
                <Image
                  src="/DSC00374.jpg"
                  alt="Lauren"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 200px, 280px"
                  priority
                />
              </div>

              <div className="about-facts-section">
                <p style={{ ...smallCaps, marginBottom: '14px' }}>
                  A few Lauren things
                </p>

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

      {/* Blog Post List Section */}
      <section style={{ padding: '40px 24px 60px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <p style={{ ...smallCaps, marginBottom: '18px' }}>Featured Blog Posts</p>

          <div className="blog-posts">
            {blogPosts.map((post, index) => (
              <div key={index} style={{ padding: '20px', background: parchment, borderRadius: '14px', marginBottom: '16px' }}>
                <h3
                  style={{
                    fontFamily: display,
                    fontSize: '1.5rem',
                    color: ink,
                    marginBottom: '12px',
                  }}
                >
                  <Link href={post.link} style={textLink}>
                    {post.title}
                  </Link>
                </h3>
                <p
                  style={{
                    ...body,
                    fontSize: '14px',
                    lineHeight: 1.8,
                    marginBottom: '16px',
                  }}
                >
                  {post.excerpt}
                </p>
                <Link href={post.link} style={textLink}>
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <div className="intro-points-grid">
            {introPoints.map((item) => (
              <div
                key={item.number}
                style={{
                  padding: '20px 0 0',
                  borderTop: `1px solid ${softLine}`,
                }}
              >
                <p style={{ ...smallCaps, marginBottom: '10px' }}>{item.number}</p>

                <p
                  style={{
                    fontFamily: display,
                    fontSize: '1.35rem',
                    lineHeight: 1.15,
                    color: ink,
                    marginBottom: '8px',
                  }}
                >
                  {item.title}
                </p>

                <p
                  style={{
                    ...body,
                    fontSize: '15px',
                    lineHeight: 1.85,
                    maxWidth: '270px',
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .about-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(220px, 0.9fr);
          gap: 48px;
          align-items: start;
        }

        .about-right-col {
          padding-top: 24px;
        }

        .about-photo-frame {
          max-width: 280px;
        }

        .about-facts-section {
          margin-top: 24px;
          padding-left: 24px;
          border-left: 1px solid rgba(217, 208, 193, 0.7);
        }

        .blog-posts {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .about-hero {
            padding-top: 108px !important;
            padding-bottom: 52px !important;
          }

          .about-hero-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .about-right-col {
            display: flex;
            flex-direction: row;
            align-items: start;
            gap: 24px;
            padding-top: 0;
          }

          .about-photo-frame {
            max-width: 140px;
            min-width: 120px;
            flex-shrink: 0;
          }

          .about-facts-section {
            margin-top: 0 !important;
            border-left: none !important;
            padding-left: 0 !important;
          }

          .about-headline {
            font-size: clamp(2.4rem, 9vw, 3.6rem) !important;
          }

          .intro-points-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .founder-card-inner {
            grid-template-columns: 1fr;
          }

          .founder-sidebar {
            border-right: none !important;
            border-bottom: 1px solid rgba(217, 208, 193, 0.7);
            padding: 28px 28px 24px !important;
            flex-direction: row !important;
            align-items: center;
            gap: 16px;
          }

          .founder-sidebar > div > p:first-child {
            font-size: 48px !important;
            margin-bottom: 0 !important;
          }

          .founder-content {
            padding: 28px !important;
          }

          .founder-aside-grid {
            grid-template-columns: 1fr;
          }

          .what-grid,
          .closing-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }

        @media (max-width: 480px) {
          .about-right-col {
            flex-direction: column;
          }

          .about-photo-frame {
            max-width: 160px;
          }
        }
      `}</style>
    </div>
  );
}
