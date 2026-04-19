import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { generatePageMetadata } from '@/lib/seo';
import { bodySystems } from './mockTypes';
import { MOCK_PAGE_CSS } from './mockStyles';

export const metadata = generatePageMetadata({
  title: 'Written Practice',
  description:
    'Practice real exam-style scenarios with guided support. Choose a body system to start written practice and learn how to write first-class answers.',
  path: '/hub/mocks',
});

function padNum(n: number) {
  return String(n).padStart(2, '0');
}

export default function MockExamsPage() {
  return (
    <div className="mk">
      <style dangerouslySetInnerHTML={{ __html: MOCK_PAGE_CSS }} />

      <main className="mk-wrap">
        <Link href="/hub" className="mk-back">
          <span aria-hidden="true">&larr;</span> Hub
        </Link>

        <p className="mk-kicker">The Nurse Lab &middot; Written Practice</p>
        <h1 className="mk-headline">Written Practice</h1>
        <p className="mk-standfirst">
          Practice real exam-style scenarios and learn how to achieve first-class answers. Choose a body system to begin.
        </p>

        <hr className="mk-divider" />

        <div className="mk-systems-grid">
          {bodySystems.map((system, i) => {
            const hasContent = system.mockCount > 0;
            const content = (
              <>
                <span className="mk-system-card-numeral">{padNum(i + 1)}</span>
                <div>
                  <h2 className="mk-system-card-title">{system.label}</h2>
                  <p className="mk-system-card-desc">{system.description}</p>
                </div>
                <div className="mk-system-card-footer">
                  {hasContent ? (
                    <>
                      <span className="mk-system-card-count">
                        {system.mockCount} {system.mockCount === 1 ? 'mock' : 'mocks'}
                      </span>
                      <span className="mk-system-card-arrow">&rarr;</span>
                    </>
                  ) : (
                    <span className="mk-system-card-soon">Coming soon</span>
                  )}
                </div>
              </>
            );

            if (hasContent) {
              return (
                <Link key={system.id} href={`/hub/mocks/${system.id}`} className="mk-system-card">
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={system.id}
                className="mk-system-card"
                style={{ opacity: 0.55, cursor: 'default' }}
              >
                {content}
              </div>
            );
          })}
        </div>
      </main>

    </div>
  );
}
