import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BranchCard from '@/components/hub/BranchCard';
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
const mist = '#8A8178';
const linenDeep = '#E8E0D8';
const white = '#FFFFFF';

const quickLinks = [
  { href: '/hub/questions', label: 'Q&A Board' },
  { href: '/hub/glossary', label: 'Nursing Glossary' },
  { href: '/pricing', label: 'Unlock Premium' },
];

export default function HubPage() {
  return (
    <div
      style={{
        background: 'var(--cream)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          padding: '96px 16px 64px',
        }}
      >
        <div
          style={{
            maxWidth: '880px',
            margin: '0 auto',
          }}
        >
          <section
            style={{
              marginBottom: '40px',
              padding: '0 4px',
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: mist,
                fontWeight: 500,
                margin: '0 0 10px',
              }}
            >
              Revision Hub
            </p>

            <h1
              style={{
                fontFamily: display,
                fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                fontWeight: 600,
                color: espresso,
                margin: '0 0 14px',
                lineHeight: 1.05,
                maxWidth: '12ch',
              }}
            >
              Choose your nursing branch
            </h1>

            <p
              style={{
                fontFamily: serif,
                fontSize: '15px',
                color: charcoal,
                fontWeight: 300,
                lineHeight: 1.75,
                maxWidth: '560px',
                margin: 0,
              }}
            >
              Pick your pathway to explore revision resources, cheat sheets, and
              OSCE prep tailored to your branch.
            </p>
          </section>

          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px',
              marginBottom: '48px',
            }}
          >
            <BranchCard
              title="Children's Nursing"
              description="Paediatric OSCEs, PEWS, age-based normal ranges, Gillick competence, family-centred care, developmental milestones, and more."
              icon="🧒"
              href="/hub/childrens"
              tags={['OSCE prep', 'Cheat sheets', 'Paediatrics']}
            />

            <BranchCard
              title="Adult Nursing"
              description="NEWS2, sepsis recognition, wound care, medication management, and adult-focused OSCE stations are in development."
              icon="🏥"
              comingSoon
              tags={['Adult care', 'OSCEs', 'Clinical skills']}
            />
          </section>

          <section
            style={{
              borderTop: `1px solid ${linenDeep}`,
              paddingTop: '28px',
            }}
          >
            <p
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: mist,
                margin: '0 0 16px',
              }}
            >
              More ways to revise
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {quickLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: serif,
                    fontSize: '13px',
                    fontWeight: 400,
                    color: espresso,
                    background: white,
                    border: `1px solid ${linenDeep}`,
                    borderRadius: '999px',
                    padding: '10px 14px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background 0.18s ease, border-color 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F7F3EF';
                    e.currentTarget.style.borderColor = '#D9CDC2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = white;
                    e.currentTarget.style.borderColor = linenDeep;
                  }}
                >
                  {link.label}
                  <ArrowRight style={{ width: '12px', height: '12px', color: mist }} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
