import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 pt-20">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-4">🔍</div>
          <h1 className="text-4xl font-display text-[var(--plum-dark)] mb-3">
            Page Not Found
          </h1>
          <p className="text-[var(--plum)] mb-8">
            Oops! This page seems to have wandered off. Let&apos;s get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Go Home
            </Link>
            <Link href="/hub" className="btn-secondary">
              Browse Hub
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
