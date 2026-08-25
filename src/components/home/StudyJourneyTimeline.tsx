'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  border,
  cream,
  display,
  green,
  greenBg,
  ink,
  inkLight,
  inkMid,
  panel,
  parchment,
  primaryButton,
  secondaryButton,
  sectionLabelStyle,
  serif,
  tealBg,
  blueBg,
  coralBg,
  wrap,
} from './styles';

const steps = [
  {
    eyebrow: '01 · Start small',
    title: 'Start where your head is at.',
    body: 'You do not need a massive plan to begin. Pick the next useful step that matches the thing that feels most urgent right now.',
    accent: 'var(--state-correct-text)',
    accentBg: greenBg,
    links: [
      { href: '#start-here', label: 'Use the start-here guide' },
      { href: '/hub/childrens', label: 'Browse free pages' },
    ],
  },
  {
    eyebrow: '02 · Build the basics',
    title: 'Build the core knowledge that keeps coming back.',
    body: 'Use quick guides, cheat sheets, and the glossary to stop lectures, notes, and clinical language from feeling scattered.',
    accent: 'var(--topic-assessment-text)',
    accentBg: blueBg,
    links: [
      { href: '/hub', label: 'Open the revision hub' },
      { href: '/hub/glossary', label: 'Use the glossary' },
    ],
  },
  {
    eyebrow: '03 · Prepare for placement',
    title: 'Get placement-safe before shift.',
    body: 'Refresh observations, escalation, documentation, and practical details before placement days so the essentials feel close to hand.',
    accent: 'var(--topic-skills-text)',
    accentBg: tealBg,
    links: [
      { href: '/hub/resources/placement-survival', label: 'Open placement guide' },
      { href: '/hub/resources/paeds-vital-signs-cheat-sheet', label: 'Check vital signs' },
    ],
  },
  {
    eyebrow: '04 · Practise under pressure',
    title: 'Move from reading into active practice.',
    body: 'Turn the knowledge into recall and repetition with short quiz blocks and steadier OSCE station practice.',
    accent: 'var(--state-incorrect-text)',
    accentBg: coralBg,
    links: [
      { href: '/quiz', label: 'Try quiz preview' },
      { href: '/osce', label: 'Start OSCE preview' },
    ],
  },
  {
    eyebrow: '05 · Walk in calmer',
    title: 'Walk into exams and placement feeling more ready.',
    body: 'The point is not to know everything. It is to feel clearer on the essentials and less scrambled when you need to perform.',
    accent: '#1A1815',
    accentBg: parchment,
    links: [
      { href: '/pricing', label: 'See the full setup' },
      { href: '/dashboard', label: 'Open your dashboard' },
    ],
  },
] as const;

export default function StudyJourneyTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-study-journey-step]'));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const nextIndex = Number((visible.target as HTMLElement).dataset.stepIndex);
        if (!Number.isNaN(nextIndex)) setActiveIndex(nextIndex);
      },
      {
        threshold: [0.3, 0.55],
        rootMargin: '-15% 0px -25% 0px',
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{ padding: '72px 24px 84px', borderTop: `0.5px solid ${border}` }}>
      <div style={{ maxWidth: wrap, margin: '0 auto' }}>
        <div style={{ maxWidth: '640px', marginBottom: '34px' }}>
          <p style={sectionLabelStyle}>The study journey</p>
          <h2
            style={{
              fontFamily: display,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.06,
              color: ink,
              marginBottom: '14px',
              maxWidth: '12ch',
            }}
          >
            From overwhelmed to placement-ready.
          </h2>
          <p style={{ fontFamily: serif, fontSize: '15px', lineHeight: 1.9, fontWeight: 300, color: inkMid }}>
            The site works best as a sequence. Start narrow, build the basics, then move into practice while the right pieces are still fresh.
          </p>
        </div>

        <div className="home-journey-grid" style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '28px', alignItems: 'start' }}>
          <aside
            className="home-journey-rail"
            style={{
              position: 'sticky',
              top: '96px',
              border: `0.5px solid ${border}`,
              background: panel,
              padding: '22px 20px',
            }}
          >
            <p style={{ ...sectionLabelStyle, marginBottom: '16px' }}>Roadmap</p>
            <div style={{ position: 'relative', display: 'grid', gap: '10px' }}>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '7px',
                  top: '6px',
                  bottom: '6px',
                  width: '1px',
                  background: 'rgba(26,24,21,0.08)',
                }}
              />
              {steps.map((step, index) => (
                <a
                  key={step.title}
                  href={`#study-journey-step-${index + 1}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '16px 1fr',
                    gap: '12px',
                    textDecoration: 'none',
                    color: ink,
                    alignItems: 'start',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '14px',
                      height: '14px',
                      marginTop: '4px',
                      background: index === activeIndex ? step.accent : cream,
                      border: `1px solid ${index === activeIndex ? step.accent : 'rgba(26,24,21,0.12)'}`,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                  <span>
                    <span style={{ display: 'block', fontFamily: serif, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: index === activeIndex ? ink : inkLight, marginBottom: '4px' }}>
                      Step {index + 1}
                    </span>
                    <span style={{ display: 'block', fontFamily: display, fontSize: '21px', lineHeight: 1.08, fontWeight: 400, color: index === activeIndex ? ink : inkMid }}>
                      {step.title}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </aside>

          <div style={{ display: 'grid', gap: '16px' }}>
            {steps.map((step, index) => (
              <article
                key={step.title}
                id={`study-journey-step-${index + 1}`}
                data-study-journey-step
                data-step-index={index}
                style={{
                  border: `0.5px solid ${border}`,
                  background: index === activeIndex ? panel : 'var(--surface-raised)',
                  padding: '26px 24px 28px',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  transform: index === activeIndex ? 'translateY(-2px)' : 'translateY(0)',
                }}
              >
                <div className="home-journey-step-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 120px', gap: '16px', alignItems: 'start' }}>
                  <div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', fontFamily: serif, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: step.accent, background: step.accentBg, marginBottom: '14px' }}>
                      {step.eyebrow}
                    </span>
                    <h3 style={{ fontFamily: display, fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 400, lineHeight: 1.08, color: ink, marginBottom: '12px', maxWidth: '16ch' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontFamily: serif, fontSize: '14px', lineHeight: 1.85, fontWeight: 300, color: inkMid, marginBottom: '18px', maxWidth: '50ch' }}>
                      {step.body}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {step.links.map((link, linkIndex) => (
                        <Link key={link.href} href={link.href} style={linkIndex === 0 ? primaryButton : secondaryButton}>
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="home-journey-meta" style={{ borderLeft: `1px solid ${border}`, paddingLeft: '18px' }}>
                    <p style={{ ...sectionLabelStyle, marginBottom: '8px' }}>Focus</p>
                    <p style={{ fontFamily: display, fontSize: '24px', lineHeight: 1.05, fontWeight: 400, color: ink, marginBottom: '6px' }}>
                      0{index + 1}
                    </p>
                    <p style={{ fontFamily: serif, fontSize: '12px', lineHeight: 1.65, fontWeight: 300, color: inkMid, margin: 0 }}>
                      Keep the next block small enough to actually finish.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
