'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import { Check } from 'lucide-react';

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";
const espresso = '#1C1510';
const ink = '#1C1510';
const inkMid = '#5C4A38';
const inkLight = '#9C8878';
const cream = '#F9F6F0';
const parchment = '#F0EBE0';
const border = '#DDD5C8';
const amber = '#C8700A';
const amberBg = '#FDF3E3';
const amberText = '#7A3F04';
const white = '#ffffff';

const tools = [
  {
    num: '01',
    title: "Children's OSCE Tool",
    desc: '50+ practice stations covering paediatric obs, A-E assessment, medication administration, safeguarding, and SBAR handover. Each station has a marking checklist and timed mode.',
    tags: ['Paed obs', 'ABCDE', 'Medication admin', 'Safeguarding'],
    href: '/osce',
  },
  {
    num: '02',
    title: 'Core Nursing Quiz',
    desc: '17 topic areas: vital signs, drug calculations, anatomy & physiology, pharmacology, infection control, fluid balance. Every answer includes an explanation — not just right or wrong.',
    tags: ['Drug calculations', 'Vital signs', 'Pharmacology', 'Infection control'],
    href: '/quiz',
  },
  {
    num: '03',
    title: 'Revision Hub',
    desc: 'Cheat sheets, clinical guides, and reference articles. A-E assessment guide, SBAR template, paediatric vital signs, placement survival guide, and much more.',
    tags: ['Cheat sheets', 'Clinical guides', 'Placement tips', 'Q&A'],
    href: '/hub',
  },
];

const whyItems = [
  { title: 'Branch-specific content', text: "Generic revision tools miss what matters for your branch. Children's nursing is live now — paed obs, PEWS, safeguarding. Adult nursing is next." },
  { title: 'What actually gets tested', text: "Made while preparing for my own OSCEs and theory exams. The topics reflect what nursing students actually face — not what a textbook assumes." },
  { title: 'No recurring cost', text: "Students don't have spare cash. One payment, and it's yours. New content is added regularly — all future updates at no extra cost." },
];

const trustItems = [
  { label: 'Secure checkout', sub: 'Powered by Stripe' },
  { label: 'Instant access', sub: 'Start right away' },
  { label: '7-day refund', sub: 'No questions asked' },
  { label: 'Lifetime access', sub: 'All updates included' },
];

export default function HomePage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: amber, flexShrink: 0 }} />
            <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: inkLight, fontWeight: 400, margin: 0 }}>
              OSCE prep · Theory revision · Placement survival
            </p>
          </div>
          <h1 style={{ fontFamily: display, fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', fontWeight: 400, lineHeight: 1.08, color: ink, marginBottom: '24px', letterSpacing: '-0.01em' }}>
            Pass your nursing<br /><em>assessments.</em>
          </h1>
          <p style={{ fontFamily: serif, fontSize: '17px', color: inkMid, fontWeight: 300, lineHeight: 1.8, maxWidth: '480px', marginBottom: '40px' }}>
            Revision tools built by a nursing student, for nursing students. OSCE practice, theory quizzes, cheat sheets — no generic content.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, alignItems: 'center', marginBottom: '18px' }}>
            <Link href="/pricing" style={{ fontFamily: serif, fontSize: '14px', fontWeight: 400, background: ink, color: cream, padding: '12px 28px', borderRadius: '9999px', textDecoration: 'none' }}>
              Get access — £9.99
            </Link>
            <Link href="/quiz" style={{ fontFamily: serif, fontSize: '14px', fontWeight: 400, background: 'transparent', color: ink, padding: '11px 26px', borderRadius: '9999px', border: `1px solid ${border}`, textDecoration: 'none' }}>
              Try free preview →
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' as const }}>
            {['One-time payment', 'Lifetime access', '7-day refund'].map((t, i) => (
              <span key={t} style={{ fontFamily: serif, fontSize: '12px', color: inkLight, fontWeight: 300, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {i > 0 && <span style={{ color: border }}>·</span>}
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust band ── */}
      <section style={{ background: parchment, borderBottom: `1px solid ${border}`, padding: '16px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', gap: '32px', flexWrap: 'wrap' as const }}>
          {trustItems.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: amberBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke={amber} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontFamily: serif, fontSize: '12px', color: inkMid, fontWeight: 300 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Choose your branch ── */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: inkLight, marginBottom: '12px' }}>
            Choose your branch
          </p>
          <h2 style={{ fontFamily: display, fontSize: '28px', fontWeight: 400, color: ink, marginBottom: '28px' }}>
            Which branch are you studying?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <Link href="/hub/childrens" style={{ display: 'block', background: white, border: `1px solid ${border}`, borderRadius: '16px', padding: '28px', textDecoration: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: amberBg, color: amberText, fontSize: '11px', fontFamily: serif, fontWeight: 500, padding: '4px 10px', borderRadius: '9999px', marginBottom: '14px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: amber }} />
                Available now
              </div>
              <h3 style={{ fontFamily: display, fontSize: '20px', fontWeight: 400, color: ink, marginBottom: '10px' }}>Children&apos;s Nursing</h3>
              <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, lineHeight: 1.75, fontWeight: 300, marginBottom: '20px' }}>
                Paed obs, PEWS, paediatric OSCEs, family-centred care, developmental milestones, and more.
              </p>
              <span style={{ fontFamily: serif, fontSize: '13px', color: amber }}>Browse resources →</span>
            </Link>
            <div style={{ background: parchment, border: `1px solid ${border}`, borderRadius: '16px', padding: '28px', opacity: 0.75 }}>
              <div style={{ display: 'inline-block', background: 'transparent', color: inkLight, fontSize: '11px', fontFamily: serif, padding: '4px 10px', borderRadius: '9999px', border: `1px solid ${border}`, marginBottom: '14px' }}>
                Coming soon
              </div>
              <h3 style={{ fontFamily: display, fontSize: '20px', fontWeight: 400, color: inkMid, marginBottom: '10px' }}>Adult Nursing</h3>
              <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, lineHeight: 1.75, fontWeight: 300, marginBottom: '20px' }}>
                NEWS2, sepsis, wound care, medication management, adult-specific OSCE stations. In development.
              </p>
              <span style={{ fontFamily: serif, fontSize: '13px', color: inkLight }}>Join waitlist →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: inkLight, marginBottom: '8px' }}>
            What&apos;s included
          </p>
          <h2 style={{ fontFamily: display, fontSize: '28px', fontWeight: 400, color: ink, marginBottom: '32px' }}>
            Three tools, one payment.
          </h2>
          <div style={{ border: `1px solid ${border}`, borderRadius: '16px', overflow: 'hidden' }}>
            {tools.map((tool, i) => (
              <Link key={tool.href} href={tool.href} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '24px', background: white, textDecoration: 'none', borderBottom: i < tools.length - 1 ? `1px solid ${border}` : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = cream; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = white; }}
              >
                <span style={{ fontFamily: display, fontSize: '22px', color: border, lineHeight: 1, paddingTop: '2px', flexShrink: 0, width: '32px' }}>
                  {tool.num}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: display, fontSize: '16px', fontWeight: 400, color: ink, marginBottom: '6px' }}>{tool.title}</p>
                  <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, lineHeight: 1.75, fontWeight: 300, marginBottom: '12px' }}>{tool.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                    {tool.tags.map(tag => (
                      <span key={tag} style={{ fontFamily: serif, fontSize: '11px', background: amberBg, color: amberText, padding: '3px 9px', borderRadius: '9999px', fontWeight: 400 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pricing block */}
          <div style={{ background: ink, borderRadius: '20px', padding: '36px', marginTop: '24px' }}>
            <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#7A6A5A', marginBottom: '6px' }}>
              Children&apos;s Bundle
            </p>
            <p style={{ fontFamily: display, fontSize: '48px', fontWeight: 400, color: cream, lineHeight: 1, marginBottom: '6px' }}>
              £9.99
            </p>
            <p style={{ fontFamily: serif, fontSize: '13px', color: '#7A6A5A', fontWeight: 300, marginBottom: '24px' }}>
              One-time · all three tools · all future updates
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
              {['Full Revision Hub', 'OSCE Tool (50+ stations)', 'Core Nursing Quiz', 'All future updates', 'Progress tracking', 'Lifetime access'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: amber, fontSize: '13px' }}>✓</span>
                  <span style={{ fontFamily: serif, fontSize: '13px', color: '#C4B4A4', fontWeight: 300 }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/pricing" style={{ display: 'block', textAlign: 'center' as const, background: amber, color: white, fontFamily: serif, fontSize: '14px', fontWeight: 400, padding: '14px', borderRadius: '9999px', textDecoration: 'none' }}>
              Get Children&apos;s Bundle — £9.99
            </Link>
            <p style={{ fontFamily: serif, fontSize: '12px', color: '#5C4A38', textAlign: 'center' as const, marginTop: '12px', fontWeight: 300 }}>
              7-day money-back guarantee · no questions asked
            </p>
          </div>
        </div>
      </section>

      {/* ── Why I built this ── */}
      <section style={{ padding: '64px 24px', background: parchment, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: inkLight, marginBottom: '8px' }}>
            Why I built this
          </p>
          <h2 style={{ fontFamily: display, fontSize: '28px', fontWeight: 400, color: ink, marginBottom: '40px' }}>
            Made by a student, for students.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '36px' }}>
            {whyItems.map(item => (
              <div key={item.title}>
                <h3 style={{ fontFamily: display, fontSize: '17px', fontWeight: 400, color: ink, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, lineHeight: 1.8, fontWeight: 300 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── Bottom CTA ── */}
      <section style={{ padding: '80px 24px', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: inkLight, marginBottom: '16px' }}>Ready?</p>
          <h2 style={{ fontFamily: display, fontSize: '32px', fontWeight: 400, color: ink, marginBottom: '12px' }}>
            Start revising today
          </h2>
          <p style={{ fontFamily: serif, fontSize: '14px', color: inkMid, fontWeight: 300, marginBottom: '36px', lineHeight: 1.7 }}>
            One-time access. Works on mobile. Built for nursing students.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '24px' }}>
            <Link href="/pricing" style={{ fontFamily: serif, fontSize: '14px', fontWeight: 400, background: ink, color: cream, padding: '12px 28px', borderRadius: '9999px', textDecoration: 'none' }}>
              Get Access — £9.99
            </Link>
            <Link href="/quiz" style={{ fontFamily: serif, fontSize: '14px', fontWeight: 400, background: 'transparent', color: ink, padding: '11px 26px', borderRadius: '9999px', border: `1px solid ${border}`, textDecoration: 'none' }}>
              Try for free →
            </Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '16px' }}>
            {["Full Revision Hub", "Children's OSCE Tool", "Core Nursing Quiz", "All future updates"].map(f => (
              <span key={f} style={{ fontFamily: serif, fontSize: '12px', color: inkMid, fontWeight: 300, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Check style={{ width: '11px', height: '11px', color: amber, flexShrink: 0 }} />{f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact strip ── */}
      <section style={{ padding: '28px 24px', background: parchment, borderTop: `1px solid ${border}`, textAlign: 'center' as const }}>
        <p style={{ fontFamily: serif, fontSize: '13px', color: inkLight, fontWeight: 300 }}>
          Got a question or spotted something that needs updating?{' '}
          <a href="https://wa.me/447572650980" target="_blank" rel="noopener noreferrer" style={{ color: espresso, textDecoration: 'underline', textUnderlineOffset: '3px' }}>WhatsApp me</a>
          {' '}or{' '}
          <Link href="/contact" style={{ color: espresso, textDecoration: 'underline', textUnderlineOffset: '3px' }}>use the contact form</Link>
        </p>
      </section>

      <Footer />
    </div>
  );
}
