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
const mist = '#8A8178';
const linenDeep = '#E8E0D8';
const linenLight = '#F7F3EF';
const white = '#FFFFFF';

const cardBase: React.CSSProperties = {
  borderRadius: '16px',
  padding: '28px',
  minHeight: '100%',
};

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
          padding: '96px 20px 72px',
        }}
      >
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Hero */}
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
                marginBottom: '10px',
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
                marginBottom: '14px',
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

          {/* Branch cards */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '18px',
              marginBottom: '48px',
            }}
          >
            <Link
              href="/hub/childrens"
              style={{
                ...cardBase,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: white,
                border: `1px solid ${linenDeep}`,
                textDecoration: 'none',
                boxShadow: '0 1px 2px rgba(48, 25, 6, 0.04)',
              }}
            >
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    background: linenLight,
                    fontSize: '24px',
                    marginBottom: '18px',
                  }}
                >
                  🧒
                </div>

                <h2
                  style={{
                    fontFamily: display,
                    fontSize: '24px',
                    fontWeight: 500,
                    color: espresso,
                    marginBottom: '10px',
                    lineHeight: 1.2,
                  }}
                >
                  Children&apos;s Nursing
                </h2>

                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '14px',
                    color: charcoal,
                    lineHeight: 1.75,
                    fontWeight: 300,
                    marginBottom: '18px',
                  }}
                >
                  Paediatric OSCEs, PEWS, age-based normal ranges, Gillick
                  competence, family-centred care, developmental milestones, and
                  more.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '22px',
                  }}
                >
                  {['OSCE prep', 'Cheat sheets', 'Paediatrics'].map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: serif,
                        fontSize: '12px',
                        color: espresso,
                        background: linenLight,
                        border: `1px solid ${linenDeep}`,
                        borderRadius: '999px',
                        padding: '6px 10px',
                        lineHeight: 1,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <span
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  color: espresso,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 500,
                }}
              >
                Explore children&apos;s resources
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </span>
            </Link>

            <div
              style={{
                ...cardBase,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: linenLight,
                border: `1px solid ${linenDeep}`,
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      display: 'grid',
                      placeItems: 'center',
                      background: white,
                      fontSize: '24px',
                    }}
                  >
                    🏥
                  </div>

                  <span
                    style={{
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: mist,
                      background: '#EFE7DE',
                      padding: '5px 10px',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Coming soon
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: display,
                    fontSize: '24px',
                    fontWeight: 500,
                    color: espresso,
                    marginBottom: '10px',
                    lineHeight: 1.2,
                  }}
                >
                  Adult Nursing
                </h2>

                <p
                  style={{
                    fontFamily: serif,
                    fontSize: '14px',
                    color: charcoal,
                    lineHeight: 1.75,
                    fontWeight: 300,
                    marginBottom: '18px',
                  }}
                >
                  NEWS2, sepsis recognition, wound care, medication management,
                  and adult-focused OSCE stations are in development.
                </p>
              </div>

              <span
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  color: mist,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 400,
                }}
              >
                Available soon
              </span>
            </div>
          </section>

          {/* Secondary navigation */}
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
                marginBottom: '16px',
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
                    background: white,
                    border: `1px solid ${linenDeep}`,
                    borderRadius: '999px',
                    padding: '10px 14px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
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
