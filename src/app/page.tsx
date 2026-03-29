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
    desc: '17 topic areas: vital signs, drug calculations, anatomy & physiology, pharmacology, infection control, fluid balance. Every answer includes clear explanations.',
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

export default function HomePage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontFamily: display, fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', fontWeight: 400, lineHeight: 1.08, color: ink, marginBottom: '24px', letterSpacing: '-0.01em' }}>
            Pass your nursing<br /><em>assessments.</em>
          </h1>
          <p style={{ fontFamily: serif, fontSize: '17px', color: inkMid, fontWeight: 300, lineHeight: 1.8, maxWidth: '480px', marginBottom: '40px' }}>
            Revision tools built by a nursing student, for nursing students. OSCE practice, theory quizzes, cheat sheets — no generic content.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '18px' }}>
            <Link href="/pricing" style={{ fontFamily: serif, fontSize: '14px', fontWeight: 400, background: ink, color: cream, padding: '12px 28px', borderRadius: '9999px', textDecoration: 'none' }}>
              Get access — £9.99
            </Link>
            <Link href="/quiz" style={{ fontFamily: serif, fontSize: '14px', fontWeight: 400, background: 'transparent', color: ink, padding: '11px 26px', borderRadius: '9999px', border: `1px solid ${border}`, textDecoration: 'none' }}>
              Try free preview →
            </Link>
          </div>
          {/* Inline badge strip */}
          <div style={{ fontFamily: serif, fontSize: '12px', color: inkLight, fontWeight: 300 }}>
            One-time payment · Lifetime access · 7-day refund
          </div>
        </div>
      </section>

      {/* ── Choose your branch ── */}
      <section style={{ padding: '64px 24px', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: display, fontSize: '28px', fontWeight: 400, color: ink, marginBottom: '28px' }}>
            Which branch are you studying?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <Link href="/hub/childrens" style={{ display: 'block', padding: '28px', textDecoration: 'none', color: ink }}>
              <h3 style={{ fontFamily: display, fontSize: '20px', fontWeight: 400, color: ink, marginBottom: '10px' }}>Children&apos;s Nursing</h3>
              <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, lineHeight: 1.75, fontWeight: 300, marginBottom: '20px' }}>
                Paed obs, PEWS, paediatric OSCEs, family-centred care, developmental milestones, and more.
              </p>
              <span style={{ fontFamily: serif, fontSize: '13px', color: amber }}>Browse resources →</span>
            </Link>
            <div style={{ padding: '28px', opacity: 0.75 }}>
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
          <h2 style={{ fontFamily: display, fontSize: '28px', fontWeight: 400, color: ink, marginBottom: '32px' }}>
            Three tools, one payment.
          </h2>
          {tools.map(tool => (
            <Link key={tool.href} href={tool.href} style={{ display: 'block', marginBottom: '32px', textDecoration: 'none', color: ink }}>
              <p style={{ fontFamily: display, fontSize: '16px', marginBottom: '6px' }}>{tool.title}</p>
              <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid, marginBottom: '6px' }}>{tool.desc}</p>
              <p style={{ fontFamily: serif, fontSize: '12px', color: inkLight }}>
                {tool.tags.join(' · ')}
              </p>
            </Link>
          ))}

          {/* Simple pricing block */}
          <div style={{ marginTop: '32px', padding: '36px', borderRadius: '16px', background: cream }}>
            <p style={{ fontFamily: serif, fontSize: '11px', color: inkMid }}>Children's Bundle</p>
            <p style={{ fontFamily: display, fontSize: '48px', color: ink }}>£9.99</p>
            <p style={{ fontFamily: serif, fontSize: '13px', color: inkMid }}>
              One-time · Full Revision Hub · OSCE Tool · Core Quiz · All future updates
            </p>
            <Link href="/pricing" style={{ display: 'inline-block', marginTop: '24px', background: amber, color: white, fontFamily: serif, fontSize: '14px', padding: '12px 28px', borderRadius: '9999px', textDecoration: 'none' }}>
              Get Access — £9.99
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why I built this ── */}
      <section style={{ padding: '64px 24px', background: parchment, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
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
          <h2 style={{ fontFamily: display, fontSize: '32px', fontWeight: 400, color: ink, marginBottom: '12px' }}>
            Start revising today
          </h2>
          <p style={{ fontFamily: serif, fontSize: '14px', color: inkMid, fontWeight: 300, marginBottom: '36px', lineHeight: 1.7 }}>
            One-time access. Works on mobile. Built for nursing students.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <Link href="/pricing" style={{ fontFamily: serif, fontSize: '14px', fontWeight: 400, background: ink, color: cream, padding: '12px 28px', borderRadius: '9999px', textDecoration: 'none' }}>
              Get Access — £9.99
            </Link>
            <Link href="/quiz" style={{ fontFamily: serif, fontSize: '14px', fontWeight: 400, background: 'transparent', color: ink, padding: '11px 26px', borderRadius: '9999px', border: `1px solid ${border}`, textDecoration: 'none' }}>
              Try for free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact strip ── */}
      <section style={{ padding: '28px 24px', background: parchment, borderTop: `1px solid ${border}`, textAlign: 'center' }}>
        <p style={{ fontFamily: serif, fontSize: '13px', color: inkLight, fontWeight: 300 }}>
          Got a question or spotted something that needs updating?{' '}
          <a href="https://wa.me/447572650980" target="_blank" rel="noopener noreferrer" style={{ color: ink, textDecoration: 'underline' }}>WhatsApp me</a>
          {' '}or{' '}
          <Link href="/contact" style={{ color: ink, textDecoration: 'underline' }}>use the contact form</Link>
        </p>
      </section>

      <Footer />
    </div>
  );
}
