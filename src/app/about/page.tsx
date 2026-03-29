'use client';

import EditorialLayout from '@/components/EditorialLayout';
import Link from 'next/link';
import { ArrowRight, Heart, CheckCircle2, Sparkles, NotebookPen, Stethoscope } from 'lucide-react';

const heroPoints = [
  'Made by a children’s nursing student',
  'Created for OSCEs, placements, and exams',
  'One payment, future updates included',
];

const pillars = [
  {
    icon: NotebookPen,
    title: 'Clearer revision',
    body: 'Resources designed to help you revise quickly and confidently, without digging through cluttered notes or overwhelming blocks of text.',
  },
  {
    icon: Stethoscope,
    title: 'Built from real student experience',
    body: 'Created by someone doing the degree, going on placement, and using these tools in real life — not by someone guessing what student nurses need.',
  },
  {
    icon: Sparkles,
    title: 'Designed to feel good to use',
    body: 'Useful is not enough. These resources are built to be visually calm, well structured, and genuinely pleasant to come back to.',
  },
];

const useCases = [
  'OSCE preparation',
  'Exam revision',
  'Placement support',
  'Quick pre-shift refreshers',
  'Less overwhelming study sessions',
  'Resources you will actually want to open',
];

export default function AboutPage() {
  return (
    <EditorialLayout
      kicker="About Revision Foundations"
      title="Nursing revision tools, made the way I wish I’d found them."
      standfirst="I’m Lauren — a children’s nursing student and former medical photographer. I created Revision Foundations after struggling to find study resources that felt clear, well-designed, and genuinely worth paying for."
      byline="Revision Foundations"
      backHref="/dashboard"
      backLabel="Back to Dashboard"
    >
      <>
        <section
          className="ed-card"
          style={{
            marginBottom: '40px',
            padding: '32px 24px',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,244,255,0.92) 100%)',
            border: '1px solid rgba(126, 92, 255, 0.10)',
            boxShadow: '0 10px 30px rgba(50, 35, 90, 0.05)',
          }}
        >
          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.75',
              color: '#3F3B35',
              marginBottom: '22px',
              fontWeight: 300,
              maxWidth: '760px',
            }}
          >
            Revision Foundations is a growing collection of nursing revision tools
            for <strong>OSCEs, placements, and exams</strong> — built to be clear,
            practical, and actually nice to use when your brain is full and your
            energy is low.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '26px',
            }}
          >
            {heroPoints.map((point) => (
              <div
                key={point}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.82)',
                  border: '1px solid rgba(90, 87, 80, 0.10)',
                }}
              >
                <CheckCircle2
                  style={{
                    width: '18px',
                    height: '18px',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#5A5750',
                    fontWeight: 400,
                  }}
                >
                  {point}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/hub"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Browse Revision Tools
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>

            <Link
              href="/contact"
              className="btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Heart style={{ width: '16px', height: '16px' }} />
              Contact Lauren
            </Link>
          </div>
        </section>

        <h2 className="ed-section-title">Why I started this</h2>

        <div
          className="ed-card"
          style={{
            marginBottom: '36px',
            padding: '28px 24px',
          }}
        >
          <p
            style={{
              fontSize: '15px',
              color: '#5A5750',
              lineHeight: '1.85',
              fontWeight: 300,
              marginBottom: '18px',
            }}
          >
            Before nursing, I worked as a medical photographer in hospitals. It
            was fascinating work, but it never quite felt like the right fit for
            me. At 25, I decided to change direction, applied to nursing, and got
            in.
          </p>

          <p
            style={{
              fontSize: '15px',
              color: '#5A5750',
              lineHeight: '1.85',
              fontWeight: 300,
              marginBottom: '18px',
            }}
          >
            Children’s nursing felt right almost immediately. From my first
            placement, I knew it was where I wanted to be.
          </p>

          <p
            style={{
              fontSize: '15px',
              color: '#5A5750',
              lineHeight: '1.85',
              fontWeight: 300,
              marginBottom: 0,
            }}
          >
            What I didn’t love was the revision experience. So many resources felt
            cluttered, dull, badly designed, or strangely expensive for what they
            offered. I wanted study tools that felt clearer, calmer, and easier to
            trust under pressure — so I started making my own. First for myself,
            then for coursemates, and eventually into what became Revision
            Foundations.
          </p>
        </div>

        <h2 className="ed-section-title">What makes it different</h2>

        <div className="ed-grid-3" style={{ marginBottom: '36px' }}>
          {pillars.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="ed-cell"
                style={{
                  paddingTop: '22px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                    background: 'rgba(126, 92, 255, 0.08)',
                    border: '1px solid rgba(126, 92, 255, 0.10)',
                  }}
                >
                  <Icon style={{ width: '18px', height: '18px' }} />
                </div>

                <p className="ed-cell-title" style={{ marginBottom: '10px' }}>
                  {item.title}
                </p>

                <p>{item.body}</p>
              </div>
            );
          })}
        </div>

        <h2 className="ed-section-title">Who it’s for</h2>

        <div
          className="ed-card"
          style={{
            marginBottom: '36px',
            padding: '28px 24px',
          }}
        >
          <p
            style={{
              fontSize: '15px',
              color: '#5A5750',
              lineHeight: '1.8',
              fontWeight: 300,
              marginBottom: '18px',
              maxWidth: '760px',
            }}
          >
            Revision Foundations is for student nurses who want revision support
            that feels more thoughtful, less overwhelming, and easier to use when
            time is short and confidence is wobbling.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {useCases.map((item) => (
              <div
                key={item}
                style={{
                  padding: '14px 16px',
                  border: '1px solid rgba(90, 87, 80, 0.12)',
                  borderRadius: '14px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#5A5750',
                  fontWeight: 300,
                  background: 'rgba(255,255,255,0.7)',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <section
          className="ed-card"
          style={{
            marginBottom: '40px',
            padding: '30px 24px',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(250,247,255,0.94) 100%)',
            border: '1px solid rgba(126, 92, 255, 0.10)',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#7A746B',
              marginBottom: '12px',
            }}
          >
            A simple promise
          </p>

          <p
            style={{
              fontSize: '20px',
              lineHeight: '1.75',
              color: '#3F3B35',
              fontWeight: 300,
              marginBottom: '12px',
              maxWidth: '800px',
            }}
          >
            No subscription. No monthly fee. No drip-fed access.
          </p>

          <p
            style={{
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#5A5750',
              fontWeight: 300,
              maxWidth: '800px',
              marginBottom: 0,
            }}
          >
            You pay once and keep access to everything included — with future
            updates added as Revision Foundations grows and improves.
          </p>
        </section>

        <div className="ed-pearl" style={{ marginBottom: '40px' }}>
          <p className="ed-pearl-label">A note from Lauren</p>
          <p>
            If you have a question, spot something unclear, or just want to say
            hi, I really do read every message. Email is the best place to reach
            me.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/hub"
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Explore the Hub
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>

          <Link
            href="/contact"
            className="btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Heart style={{ width: '16px', height: '16px' }} />
            Get in Touch
          </Link>
        </div>
      </>
    </EditorialLayout>
  );
}
