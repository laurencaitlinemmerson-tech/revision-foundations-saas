import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { studySkillsGuides } from '@/lib/studySkills';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink = '#1A1815';
const inkMid = '#5A5750';
const inkLight = '#9C8878';
const cream = '#FAFAF8';
const paper = '#FFFFFF';
const parchment = '#F5F3F0';
const border = 'rgba(0,0,0,0.08)';

export default function StudySkillsPage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>

      <main>
        <section style={{ padding: '108px 24px 56px', borderBottom: `0.5px solid ${border}` }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <p
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: inkLight,
                marginBottom: '16px',
              }}
            >
              Study Skills
            </p>
            <h1
              style={{
                fontFamily: display,
                fontSize: 'clamp(2.5rem, 5vw, 4.1rem)',
                lineHeight: 1.05,
                color: ink,
                marginBottom: '16px',
                maxWidth: '12ch',
              }}
            >
              Use the site in a way your brain can actually keep coming back to.
            </h1>
            <p
              style={{
                fontFamily: serif,
                fontSize: '16px',
                lineHeight: 1.9,
                fontWeight: 300,
                color: inkMid,
                maxWidth: '640px',
                marginBottom: '26px',
              }}
            >
              These guides are for the part before the revision session really works:
              how to get started, how to keep the session small, and how to use the
              tools without making studying feel heavier than it already does.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              {['Small sessions', 'Clearer structure', 'Neurodivergent-friendly', 'Built for nursing students'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: serif,
                    fontSize: '12px',
                    color: inkMid,
                    background: parchment,
                    padding: '7px 12px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '40px 24px 56px' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <div
              className="study-skills-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '18px',
                marginBottom: '18px',
              }}
            >
              {studySkillsGuides.map((guide) => (
                <Link
                  key={guide.id}
                  href={guide.href}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    color: ink,
                    border: `0.5px solid ${border}`,
                    background: paper,
                    padding: '28px 26px 30px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: inkLight,
                      marginBottom: '12px',
                    }}
                  >
                    {guide.kicker}
                  </p>
                  <h2
                    style={{
                      fontFamily: display,
                      fontSize: 'clamp(1.8rem, 3vw, 2.35rem)',
                      lineHeight: 1.08,
                      color: ink,
                      marginBottom: '12px',
                    }}
                  >
                    {guide.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '14px',
                      lineHeight: 1.85,
                      fontWeight: 300,
                      color: inkMid,
                      marginBottom: '12px',
                    }}
                  >
                    {guide.description}
                  </p>
                  <p
                    style={{
                      fontFamily: serif,
                      fontSize: '12px',
                      lineHeight: 1.75,
                      fontWeight: 300,
                      color: inkLight,
                      marginBottom: '18px',
                    }}
                  >
                    {guide.bestFor}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                    {guide.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: serif,
                          fontSize: '11px',
                          color: inkMid,
                          background: parchment,
                          padding: '5px 10px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span
                    style={{
                      fontFamily: serif,
                      fontSize: '13px',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    Open guide →
                  </span>
                </Link>
              ))}
            </div>

            <div
              style={{
                border: `0.5px solid ${border}`,
                background: parchment,
                padding: '24px 24px 26px',
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: inkLight,
                  marginBottom: '10px',
                }}
              >
                Built into the site
              </p>
              <h2
                style={{
                  fontFamily: display,
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  lineHeight: 1.1,
                  color: ink,
                  marginBottom: '10px',
                }}
              >
                Use the Accessibility button if the page itself is getting in the way.
              </h2>
              <p
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  lineHeight: 1.85,
                  fontWeight: 300,
                  color: inkMid,
                  maxWidth: '720px',
                }}
              >
                Easier reading mode is now available site-wide: dyslexia-friendly font,
                looser spacing, and reduced motion. If the screen feels hard before the
                studying even starts, change that first.
              </p>
            </div>
          </div>
        </section>
      </main>


      <style>{`
        @media (max-width: 760px) {
          .study-skills-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
