import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { bodySystems } from '../mockTypes';
import { getMocksBySystem } from '../mockData';
import { MOCK_PAGE_CSS } from '../mockStyles';

interface Props {
  params: Promise<{ system: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { system: systemId } = await params;
  const system = bodySystems.find((s) => s.id === systemId);
  if (!system) return {};
  return {
    title: `${system.label} Written Practice | The Nurse Lab`,
    description: system.description,
  };
}

export default async function SystemMocksPage({ params }: Props) {
  const { system: systemId } = await params;
  const system = bodySystems.find((s) => s.id === systemId);
  if (!system) notFound();

  const mocks = getMocksBySystem(systemId);

  return (
    <div className="mk">
      <style dangerouslySetInnerHTML={{ __html: MOCK_PAGE_CSS }} />
      <Navbar />

      <main className="mk-wrap">
        <Link href="/hub/mocks" className="mk-back">
          <span aria-hidden="true">&larr;</span> All systems
        </Link>

        <p className="mk-kicker">Written Practice &middot; {system.label}</p>
        <h1 className="mk-headline">{system.label} Mocks</h1>
        <p className="mk-standfirst">{system.description}</p>

        <hr className="mk-divider" />

        {mocks.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: 400, color: '#1A1815', marginBottom: '10px' }}>
              No mocks available yet
            </p>
            <p style={{ fontSize: '13px', fontWeight: 300, color: '#5A5750', marginBottom: '24px' }}>
              {system.label} mocks are coming soon. Try a different system in the meantime.
            </p>
            <Link
              href="/hub/mocks"
              style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FAFAF8', background: '#1A1815', padding: '10px 20px', textDecoration: 'none' }}
            >
              View all systems
            </Link>
          </div>
        ) : (
          <div className="mk-list-grid">
            {mocks.map((mock) => (
              <Link key={mock.id} href={`/hub/mocks/${systemId}/${mock.id}`} className="mk-list-card">
                <div className="mk-list-card-body">
                  <h2 className="mk-list-card-title">{mock.title}</h2>
                  <p className="mk-list-card-desc">{mock.description}</p>
                </div>
                <span className="mk-list-card-btn">Start mock</span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
