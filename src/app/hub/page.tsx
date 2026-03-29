import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nursing Hub | Revision Foundations',
  description:
    'Choose your nursing branch to find OSCE guides, cheat sheets, and revision materials tailored to your pathway.',
};

const serif = "'Source Serif 4', Georgia, serif";
const display = "'Playfair Display', Georgia, serif";
const espresso = '#301906';
const charcoal = '#5A5750';
const linenDeep = '#E8E0D8';
const linenLight = '#F7F3EF';

export default function HubPage() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: '112px', paddingBottom: '80px', padding: '112px 24px 80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Header */}
          <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#aaa', fontWeight: 400, marginBottom: '12px' }}>
            Revision Hub
          </p>
          <h1 style={{ fontFamily: display, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, color: espresso, marginBottom: '16px', lineHeight: 1.1 }}>
            Which branch are you studying?
          </h1>
          <p style={{ fontFamily: serif, fontSize: '15px', color: charcoal, fontWeight: 300, lineHeight: 1.75, maxWidth: '480px', marginBottom: '48px' }}>
            Pick your pathway to find resources, cheat sheets, and OSCE prep tailored to your branch.
          </p>

          {/* Branch cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '64px' }}>

            {/* Children's Nursing */}
            <Link
              href="/hub/childrens"
              style={{
                display: 'block',
                background: '#fff',
                border: `0.5px solid ${linenDeep}`,
                borderRadius: '12px',
                padding: '32px',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '20px' }}>🧒</div>
              <h2 style={{ fontFamily: display, fontSize: '22px', fontWeight: 500, color: espresso, marginBottom: '12px' }}>
                Children&apos;s Nursing
              </h2>
              <p style={{ fontFamily: serif, fontSize: '13px', color: charcoal, lineHeight: 1.8, fontWeight: 300, marginBottom: '24px' }}>
                Paediatric OSCEs, PEWS, normal ranges by age, Gillick competence, family-centred care, developmental milestones, and more.
              </p>
              <span style={{ fontFamily: serif, fontSize: '13px', color: espresso, display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 400 }}>
                Browse resources <ArrowRight style={{ width: '13px', height: '13px' }} />
              </span>
            </Link>

            {/* Adult Nursing — Coming Soon */}
            <div
              style={{
                background: linenLight,
                border: `0.5px solid ${linenDeep}`,
                borderRadius: '12px',
                padding: '32px',
                opacity: 0.6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <span style={{ fontSize: '28px' }}>🏥</span>
                <span style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', background: linenDeep, padding: '3px 10px', borderRadius: '99px' }}>
                  Coming soon
                </span>
              </div>
              <h2 style={{ fontFamily: display, fontSize: '22px', fontWeight: 500, color: espresso, marginBottom: '12px' }}>
                Adult Nursing
              </h2>
              <p style={{ fontFamily: serif, fontSize: '13px', color: charcoal, lineHeight: 1.8, fontWeight: 300, marginBottom: '24px' }}>
                NEWS2, sepsis recognition, wound care, medication management, and adult-specific OSCE stations. In development.
              </p>
              <span style={{ fontFamily: serif, fontSize: '13px', color: charcoal, display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 300 }}>
                Join the waitlist <ArrowRight style={{ width: '13px', height: '13px' }} />
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div style={{ borderTop: `0.5px solid ${linenDeep}`, paddingTop: '40px' }}>
            <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '20px' }}>
              Also in the hub
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {[
                { href: '/hub/questions', label: 'Q&A Board' },
                { href: '/hub/glossary', label: 'Nursing Glossary' },
                { href: '/pricing', label: 'Unlock Premium' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: serif,
                    fontSize: '13px',
                    fontWeight: 400,
                    color: espresso,
                    background: '#fff',
                    border: `0.5px solid ${linenDeep}`,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {link.label} <ArrowRight style={{ width: '12px', height: '12px', color: '#ccc' }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
