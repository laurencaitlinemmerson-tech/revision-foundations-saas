'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import { ArrowRight, Shield, Check } from 'lucide-react';

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";
const espresso = '#301906';
const charcoal = '#5A5750';
const cream = '#FAFAF8';
const linen = '#F7F3EF';
const linenDeep = '#E8E0D8';

export default function HomePage() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', borderBottom: `0.5px solid ${linenDeep}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#aaa', fontWeight: 400, marginBottom: '20px' }}>
            OSCE prep · Theory revision · Placement survival
          </p>
          <h1 style={{ fontFamily: display, fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', fontWeight: 600, lineHeight: 1.08, color: espresso, marginBottom: '24px', letterSpacing: '-0.01em' }}>
            Pass your nursing<br />assessments.
          </h1>
          <p style={{ fontFamily: serif, fontSize: '17px', color: charcoal, fontWeight: 300, lineHeight: 1.8, maxWidth: '520px', marginBottom: '40px' }}>
            Revision tools built by a nursing student, for nursing students. OSCE practice, theory quizzes, cheat sheets, and a full reference hub — no generic content.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, alignItems: 'center', marginBottom: '20px' }}>
            <Link href="/pricing" className="btn-primary" style={{ fontSize: '14px', padding: '11px 28px' }}>
              Get Access — £9.99
            </Link>
            <Link href="/quiz" className="btn-secondary" style={{ fontSize: '14px', padding: '11px 28px' }}>
              Try free preview →
            </Link>
          </div>
          <p style={{ fontFamily: serif, fontSize: '12px', color: '#bbb', fontWeight: 300, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Shield style={{ width: '11px', height: '11px', flexShrink: 0 }} />
            One-time payment · Lifetime access · 7-day refund
          </p>
        </div>
      </section>

      {/* ── Choose your branch ── */}
      <section style={{ padding: '64px 24px', borderBottom: `0.5px solid ${linenDeep}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '28px' }}>
            Choose your branch
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <Link
              href="/hub/childrens"
              style={{ display: 'block', background: '#fff', border: `0.5px solid ${linenDeep}`, borderRadius: '8px', padding: '28px', textDecoration: 'none' }}
            >
              <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#bbb', marginBottom: '12px' }}>Available now</p>
              <h2 style={{ fontFamily: display, fontSize: '22px', fontWeight: 500, color: espresso, marginBottom: '10px' }}>Children&apos;s Nursing</h2>
              <p style={{ fontFamily: serif, fontSize: '13px', color: charcoal, lineHeight: 1.75, fontWeight: 300, marginBottom: '20px' }}>
                Paed obs, PEWS, paediatric OSCEs, family-centred care, developmental milestones, and more.
              </p>
              <span style={{ fontFamily: serif, fontSize: '13px', color: espresso, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Browse resources <ArrowRight style={{ width: '13px', height: '13px' }} />
              </span>
            </Link>
            <div style={{ background: linen, border: `0.5px solid ${linenDeep}`, borderRadius: '8px', padding: '28px', opacity: 0.6 }}>
              <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#ccc', marginBottom: '12px' }}>Coming soon</p>
              <h2 style={{ fontFamily: display, fontSize: '22px', fontWeight: 500, color: espresso, marginBottom: '10px' }}>Adult Nursing</h2>
              <p style={{ fontFamily: serif, fontSize: '13px', color: charcoal, lineHeight: 1.75, fontWeight: 300 }}>
                NEWS2, sepsis, wound care, medication management, adult-specific OSCE stations. In development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section style={{ padding: '64px 24px', borderBottom: `0.5px solid ${linenDeep}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '8px' }}>What&apos;s included</p>
          <h2 style={{ fontFamily: display, fontSize: '28px', fontWeight: 500, color: espresso, marginBottom: '36px' }}>Three tools, one payment.</h2>

          <div style={{ border: `0.5px solid ${linenDeep}`, borderRadius: '8px', overflow: 'hidden' }}>
            {[
              {
                emoji: '🩺',
                title: "Children's OSCE Tool",
                desc: '50+ practice stations covering paediatric obs, A-E assessment, medication administration, safeguarding, and SBAR handover. Each station has a marking checklist and timed mode.',
                tags: ['Paed obs', 'ABCDE', 'Medication admin', 'Safeguarding'],
                href: '/osce',
              },
              {
                emoji: '📋',
                title: 'Core Nursing Quiz',
                desc: '17 topic areas: vital signs, drug calculations, anatomy & physiology, pharmacology, infection control, fluid balance. Every answer includes an explanation — not just right or wrong.',
                tags: ['Drug calculations', 'Vital signs', 'Pharmacology', 'Infection control'],
                href: '/quiz',
              },
              {
                emoji: '📚',
                title: 'Revision Hub',
                desc: 'Cheat sheets, clinical guides, and reference articles. A-E assessment guide, SBAR template, paediatric vital signs, placement survival guide, and much more.',
                tags: ['Cheat sheets', 'Clinical guides', 'Placement tips', 'Q&A'],
                href: '/hub',
              },
            ].map((tool, i, arr) => (
              <Link
                key={tool.href}
                href={tool.href}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  padding: '24px 24px',
                  background: '#fff',
                  textDecoration: 'none',
                  borderBottom: i < arr.length - 1 ? `0.5px solid ${linenDeep}` : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = cream; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#fff'; }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0, lineHeight: 1.4 }}>{tool.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: serif, fontSize: '15px', fontWeight: 500, color: espresso, marginBottom: '6px' }}>{tool.title}</p>
                  <p style={{ fontFamily: serif, fontSize: '13px', color: charcoal, lineHeight: 1.75, fontWeight: 300, marginBottom: '12px' }}>{tool.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                    {tool.tags.map(tag => (
                      <span key={tag} style={{ fontFamily: serif, fontSize: '11px', background: linen, color: charcoal, padding: '2px 10px', border: `0.5px solid ${linenDeep}`, borderRadius: '2px', fontWeight: 400 }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <ArrowRight style={{ width: '15px', height: '15px', color: '#ccc', flexShrink: 0, marginTop: '4px' }} />
              </Link>
            ))}
          </div>

          <p style={{ fontFamily: serif, fontSize: '13px', color: '#aaa', fontWeight: 300, marginTop: '20px' }}>
            £9.99 one-time — includes everything above plus new content as it&apos;s added.{' '}
            <Link href="/pricing" style={{ color: espresso, textDecoration: 'underline', textUnderlineOffset: '3px' }}>See pricing →</Link>
          </p>
        </div>
      </section>

      {/* ── Why I built this ── */}
      <section style={{ padding: '64px 24px', background: linen, borderBottom: `0.5px solid ${linenDeep}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: display, fontSize: '28px', fontWeight: 500, color: espresso, marginBottom: '40px' }}>Why I built this</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '36px' }}>
            {[
              { title: 'Branch-specific content', text: "Generic revision tools miss what matters for your branch. Children's nursing is live now — paed obs, PEWS, safeguarding. Adult nursing is next." },
              { title: 'What actually gets tested', text: "Made while preparing for my own OSCEs and theory exams. The topics reflect what nursing students actually face — not what a textbook assumes." },
              { title: 'No recurring cost', text: "Students don't have spare cash. One payment, and it's yours. New content is added regularly — all future updates at no extra cost." },
            ].map(item => (
              <div key={item.title}>
                <h3 style={{ fontFamily: display, fontSize: '16px', fontWeight: 500, color: espresso, marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontFamily: serif, fontSize: '13px', color: charcoal, lineHeight: 1.8, fontWeight: 300 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section style={{ padding: '40px 24px', borderBottom: `0.5px solid ${linenDeep}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', textAlign: 'center' as const }}>
          {[
            { icon: '🔒', label: 'Secure checkout', sub: 'Powered by Stripe' },
            { icon: '⚡', label: 'Instant access', sub: 'Start right away' },
            { icon: '↩️', label: '7-day refund', sub: 'No questions asked' },
            { icon: '♾️', label: 'Lifetime access', sub: 'All updates included' },
          ].map(item => (
            <div key={item.label} style={{ padding: '20px 12px', background: '#fff', border: `0.5px solid ${linenDeep}`, borderRadius: '8px' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{item.icon}</div>
              <p style={{ fontFamily: serif, fontSize: '12px', fontWeight: 500, color: espresso, marginBottom: '3px' }}>{item.label}</p>
              <p style={{ fontFamily: serif, fontSize: '11px', color: '#aaa', fontWeight: 300 }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── Bottom CTA ── */}
      <section style={{ padding: '80px 24px', borderTop: `0.5px solid ${linenDeep}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '16px' }}>Ready?</p>
          <h2 style={{ fontFamily: display, fontSize: '32px', fontWeight: 500, color: espresso, marginBottom: '12px' }}>Start revising today</h2>
          <p style={{ fontFamily: serif, fontSize: '14px', color: charcoal, fontWeight: 300, marginBottom: '36px', lineHeight: 1.7 }}>
            One-time access. Works on mobile. Built for nursing students.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '20px' }}>
            <Link href="/pricing" className="btn-primary" style={{ fontSize: '14px', padding: '11px 28px' }}>
              Get Access — £9.99
            </Link>
            <Link href="/quiz" className="btn-secondary" style={{ fontSize: '14px', padding: '11px 28px' }}>
              Try for free →
            </Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '16px' }}>
            {['Full Revision Hub', 'Children\'s OSCE Tool', 'Core Nursing Quiz', 'All future updates'].map(f => (
              <span key={f} style={{ fontFamily: serif, fontSize: '12px', color: charcoal, fontWeight: 300, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Check style={{ width: '11px', height: '11px', color: espresso, flexShrink: 0 }} />{f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact strip ── */}
      <section style={{ padding: '28px 24px', background: linen, borderTop: `0.5px solid ${linenDeep}`, textAlign: 'center' as const }}>
        <p style={{ fontFamily: serif, fontSize: '13px', color: '#aaa', fontWeight: 300 }}>
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
