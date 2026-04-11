import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import RememberedBranchCard from '@/components/hub/RememberedBranchCard';
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Nursing Hub',
  description:
    'Choose your nursing branch to explore revision guides, cheat sheets, OSCE prep, and practical study resources tailored to your pathway.',
  path: '/hub',
});

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');

.hub-page *, .hub-page *::before, .hub-page *::after { box-sizing: border-box; }

.hub-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #FAFAF8;
  color: #2C2A27;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hub-main {
  flex: 1;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding: 72px 48px 96px;
}

/* Masthead */
.hub-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 14px;
}

.hub-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.6rem, 5vw, 4rem);
  font-weight: 400;
  line-height: 1.06;
  color: #1A1815;
  letter-spacing: -0.01em;
  margin-bottom: 18px;
  max-width: 14ch;
}

.hub-standfirst {
  font-size: 16px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.7;
  max-width: 560px;
  margin-bottom: 0;
}

.hub-divider {
  border: none;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  margin: 40px 0 52px;
}

/* Branch grid */
.hub-branches {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 60px;
}

.hub-branch {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 36px 40px 32px;
  text-decoration: none;
  border-right: 0.5px solid rgba(0,0,0,0.12);
  transition: background 0.15s;
  position: relative;
  overflow: hidden;
}
.hub-branch:last-child { border-right: none; }
.hub-branch:hover { background: #F5F3F0; }

.hub-branch-eyebrow {
  font-size: 9px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 16px;
}

.hub-branch-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 80px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  color: #e8e4df;
  position: absolute;
  top: 20px;
  right: 32px;
  pointer-events: none;
  user-select: none;
}

.hub-branch-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 400;
  color: #1A1815;
  line-height: 1.15;
  margin-bottom: 12px;
}

.hub-branch-desc {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.7;
  margin-bottom: 24px;
  max-width: 320px;
}

.hub-branch-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 28px;
}

.hub-branch-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hub-branch-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-style: italic;
  color: #1A1815;
  line-height: 1;
}

.hub-branch-stat-label {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #aaa;
}

.hub-branch-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 28px;
}

.hub-branch-topic {
  font-size: 10px;
  color: #5A5750;
  background: transparent;
  border: 0.5px solid rgba(0,0,0,0.15);
  padding: 3px 9px;
  border-radius: 2px;
  font-weight: 300;
  letter-spacing: 0.02em;
}

.hub-branch-cta {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #1A1815;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
}

.hub-branch-arrow {
  font-size: 14px;
  transition: transform 0.15s;
}
.hub-branch:hover .hub-branch-arrow { transform: translateX(3px); }

/* More ways row */
.hub-more-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 16px;
}

.hub-more-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
}

.hub-more-grid:has(:nth-child(4)) {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 769px) {
  .hub-more-grid:has(:nth-child(4)) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.hub-more-item {
  padding: 20px 24px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  text-decoration: none;
  transition: background 0.12s;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.hub-more-item:last-child { border-right: none; }
.hub-more-item:hover { background: #F5F3F0; }

.hub-more-item-title {
  font-size: 14px;
  font-weight: 400;
  color: #1A1815;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.hub-more-item-desc {
  font-size: 12px;
  font-weight: 300;
  color: #777;
  line-height: 1.55;
}

/* Mock Exams featured section */
.hub-mock-section {
  border: 0.5px solid rgba(0,0,0,0.12);
  background: #FBF8F3;
  padding: 40px 44px 36px;
  margin-bottom: 60px;
}

.hub-mock-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
}

.hub-mock-text {
  flex: 1;
}

.hub-mock-desc {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 20px;
}

.hub-mock-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  background: #1A1815;
  color: #FAFAF8;
  padding: 12px 24px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 400;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s;
}
.hub-mock-cta:hover { background: #3a2010; }
.hub-mock-cta .hub-branch-arrow { color: #FAFAF8; }

@media (max-width: 768px) {
  .hub-main { padding: 48px 20px 64px; }
  .hub-branches { grid-template-columns: 1fr; }
  .hub-branch { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.12); }
  .hub-branch:last-child { border-bottom: none; }
  .hub-mock-section { padding: 28px 24px; }
  .hub-mock-inner { flex-direction: column; align-items: flex-start; gap: 24px; }
  .hub-more-grid { grid-template-columns: 1fr; }
  .hub-more-item { border-right: none; border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .hub-more-item:last-child { border-bottom: none; }
  .hub-branch-numeral { font-size: 60px; }
}
`;

export default function HubPage() {
  return (
    <div className="hub-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Navbar />

      <main className="hub-main">
        {/* Masthead */}
        <p className="hub-kicker">The Nurse Lab · Nursing Hub</p>
        <h1 className="hub-headline">Choose your nursing branch</h1>
        <p className="hub-standfirst">
          Revision resources, cheat sheets, and OSCE prep written for the way student nurses actually study. Pick your branch to get started.
        </p>

        <RememberedBranchCard />

        <hr className="hub-divider" />

        {/* Branch cards */}
        <div className="hub-branches">
          <Link href="/hub/childrens" className="hub-branch">
            <span className="hub-branch-numeral">01</span>
            <div>
              <p className="hub-branch-eyebrow">Branch one</p>
              <h2 className="hub-branch-title">Children&apos;s<br />Nursing</h2>
              <div className="hub-branch-stats">
                <div className="hub-branch-stat">
                  <span className="hub-branch-stat-num">22</span>
                  <span className="hub-branch-stat-label">Resources</span>
                </div>
                <div className="hub-branch-stat">
                  <span className="hub-branch-stat-num">15</span>
                  <span className="hub-branch-stat-label">Free</span>
                </div>
                <div className="hub-branch-stat">
                  <span className="hub-branch-stat-num">4</span>
                  <span className="hub-branch-stat-label">Pathways</span>
                </div>
              </div>
              <div className="hub-branch-topics">
                {['OSCE prep', 'Paediatrics', 'Meds & calculations', 'Placement', 'Y1 essentials'].map(t => (
                  <span key={t} className="hub-branch-topic">{t}</span>
                ))}
              </div>
            </div>
            <span className="hub-branch-cta">
              Explore children&apos;s resources
              <span className="hub-branch-arrow">→</span>
            </span>
          </Link>

          <Link href="/hub/adult" className="hub-branch">
            <span className="hub-branch-numeral">02</span>
            <div>
              <p className="hub-branch-eyebrow">Branch two</p>
              <h2 className="hub-branch-title">Adult<br />Nursing</h2>
              <div className="hub-branch-stats">
                <div className="hub-branch-stat">
                  <span className="hub-branch-stat-num">13</span>
                  <span className="hub-branch-stat-label">Resources</span>
                </div>
                <div className="hub-branch-stat">
                  <span className="hub-branch-stat-num">8</span>
                  <span className="hub-branch-stat-label">Free</span>
                </div>
                <div className="hub-branch-stat">
                  <span className="hub-branch-stat-num">4</span>
                  <span className="hub-branch-stat-label">Pathways</span>
                </div>
              </div>
              <div className="hub-branch-topics">
                {['Escalation', 'Critical care', 'Placement', 'Communication', 'Y1 essentials'].map(t => (
                  <span key={t} className="hub-branch-topic">{t}</span>
                ))}
              </div>
            </div>
            <span className="hub-branch-cta">
              Explore adult resources
              <span className="hub-branch-arrow">→</span>
            </span>
          </Link>
        </div>

        {/* Mock Exams — featured section */}
        <div className="hub-mock-section">
          <div className="hub-mock-inner">
            <div className="hub-mock-text">
              <p className="hub-branch-eyebrow">Exam practice</p>
              <h2 className="hub-branch-title">Mock Exams</h2>
              <p className="hub-mock-desc">
                Practice real exam-style scenarios with guided support. Each mock includes examiner insight, clinical reasoning chains, answer structure guidance, and high-scoring phrasing — everything you need to write first-class answers.
              </p>
              <div className="hub-branch-stats">
                <div className="hub-branch-stat">
                  <span className="hub-branch-stat-num">1</span>
                  <span className="hub-branch-stat-label">System</span>
                </div>
                <div className="hub-branch-stat">
                  <span className="hub-branch-stat-num">8</span>
                  <span className="hub-branch-stat-label">Questions</span>
                </div>
                <div className="hub-branch-stat">
                  <span className="hub-branch-stat-num">12</span>
                  <span className="hub-branch-stat-label">Sentence starters</span>
                </div>
              </div>
              <div className="hub-branch-topics">
                {['Bronchiolitis', 'Respiratory', 'Pathophysiology', 'Family-centred care', 'Developmental theory'].map(t => (
                  <span key={t} className="hub-branch-topic">{t}</span>
                ))}
              </div>
            </div>
            <Link href="/hub/mocks" className="hub-mock-cta">
              <span className="hub-mock-cta-text">Start a mock exam</span>
              <span className="hub-branch-arrow">→</span>
            </Link>
          </div>
        </div>

        {/* More ways */}
        <p className="hub-more-label">More ways to revise</p>
        <div className="hub-more-grid">
          {[
            { href: '/hub/questions', title: 'Q&A Board', desc: 'Ask a question or browse what other students have asked about placements, OSCEs, and exams.' },
            { href: '/hub/glossary', title: 'Nursing Glossary', desc: 'A searchable A–Z of nursing words and abbreviations explained in plain English.' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="hub-more-item">
              <span className="hub-more-item-title">
                {item.title}
                <span style={{ color: '#aaa', fontSize: '12px' }}>→</span>
              </span>
              <span className="hub-more-item-desc">{item.desc}</span>
            </Link>
          ))}
        </div>
      </main>

      <Testimonials />
      <Footer />
    </div>
  );
}
