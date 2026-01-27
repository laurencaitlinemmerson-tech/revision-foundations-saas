'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const authLinks = [
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-purple-500/5'
        : 'bg-white/40 backdrop-blur-md'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--lavender-dark)] to-[var(--pink-dark)] flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white sparkle" />
            </div>
            <span className="font-display text-lg font-semibold text-[var(--text-dark)]" style={{ fontFamily: 'Fraunces, serif' }}>
              Revision Foundations
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link text-sm ${isActive(link.href) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div className="w-px h-5 bg-[var(--lavender)]/50" />
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm ${isActive(link.href) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <UserButton
                afterSwitchSessionUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9 ring-2 ring-[var(--lavender)] ring-offset-2',
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className="nav-link text-sm"
              >
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary text-sm px-5 py-2.5">
                <Sparkles className="w-4 h-4" />
                Get Started
              </Link>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-white/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--text-dark)]" />
            ) : (
              <Menu className="w-6 h-6 text-[var(--text-dark)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-[var(--lavender)]/20">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-[var(--lavender)]/10 text-[var(--purple-accent)]'
                    : 'text-[var(--text-dark)] hover:bg-[var(--lavender)]/5'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div className="border-t border-[var(--lavender)]/20 my-3" />
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-[var(--lavender)]/10 text-[var(--purple-accent)]'
                      : 'text-[var(--text-dark)] hover:bg-[var(--lavender)]/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </SignedIn>

            <SignedOut>
              <div className="border-t border-[var(--lavender)]/20 my-3" />
              <Link
                href="/sign-in"
                className="block py-3 px-4 rounded-xl text-sm font-medium text-[var(--text-dark)] hover:bg-[var(--lavender)]/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="btn-primary w-full justify-center mt-3"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="w-4 h-4" />
                Get Started
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
