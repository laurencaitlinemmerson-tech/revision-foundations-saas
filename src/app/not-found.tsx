import Link from 'next/link';
import { Metadata } from 'next';
import { Home, BookOpen, Search, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <main 
        id="main-content"
        className="flex-1 flex items-center justify-center px-6 pt-20"
        role="main"
      >
        <div className="text-center max-w-md">
          <div className="text-8xl mb-4" aria-hidden="true">🔍</div>
          <h1 className="text-4xl font-display text-[var(--plum-dark)] mb-3">
            Page Not Found
          </h1>
          <p className="text-[var(--plum)] mb-8">
            Oops! This page seems to have wandered off. Let&apos;s get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link 
              href="/" 
              className="btn-primary inline-flex items-center gap-2 justify-center"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Go Home
            </Link>
            <Link 
              href="/hub" 
              className="btn-secondary inline-flex items-center gap-2 justify-center"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Browse Hub
            </Link>
          </div>
          
          {/* Helpful links */}
          <div className="pt-6 border-t border-[var(--lilac)]">
            <p className="text-sm text-[var(--plum-dark)]/60 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-sm">
              <Link 
                href="/osce" 
                className="text-[var(--purple)] hover:underline inline-flex items-center gap-1"
              >
                OSCE Tool
              </Link>
              <span className="text-[var(--lilac-medium)]" aria-hidden="true">•</span>
              <Link 
                href="/quiz" 
                className="text-[var(--purple)] hover:underline inline-flex items-center gap-1"
              >
                Quiz
              </Link>
              <span className="text-[var(--lilac-medium)]" aria-hidden="true">•</span>
              <Link 
                href="/pricing" 
                className="text-[var(--purple)] hover:underline inline-flex items-center gap-1"
              >
                Pricing
              </Link>
              <span className="text-[var(--lilac-medium)]" aria-hidden="true">•</span>
              <Link 
                href="/contact" 
                className="text-[var(--purple)] hover:underline inline-flex items-center gap-1"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
