import Link from 'next/link';
import { Metadata } from 'next';
import { Home, BookOpen, Search, ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import EditorialLayout from '@/components/EditorialLayout';

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
          return (
            <EditorialLayout
              kicker="404"
              title="Page Not Found"
              standfirst="Sorry, the page you’re looking for doesn’t exist."
              byline="Revision Foundations"
              backHref="/"
              backLabel="Back Home"
            >
              <div className="w-full text-center py-16">
                <h1 className="text-5xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
                <p className="text-[var(--plum-dark)]/70 mb-6">Sorry, the page you’re looking for doesn’t exist.</p>
                <a href="/" className="btn-gradient inline-flex items-center gap-2">
                  Back Home
                </a>
              </div>
            </EditorialLayout>
          );
              </Link>
