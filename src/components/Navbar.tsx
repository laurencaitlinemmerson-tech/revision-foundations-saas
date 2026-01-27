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
    { href: '/account', label: 'Account' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-lg text-[var(--plum)]" style={{ fontFamily: 'Shrikhand' }}>
              Revision Foundations
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[var(--purple)]'
                    : 'text-[var(--plum-dark)]/70 hover:text-[var(--purple)]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div className="w-px h-4 bg-[var(--lilac-medium)]" />
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[var(--purple)]'
                      : 'text-[var(--plum-dark)]/70 hover:text-[var(--purple)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <UserButton
                afterSwitchSessionUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 ring-2 ring-[var(--lilac)]',
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-[var(--plum-dark)]/70 hover:text-[var(--purple)]"
              >
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary text-sm px-5 py-2">
                <Sparkles className="w-4 h-4" />
                Get Started
              </Link>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--plum)]" />
            ) : (
              <Menu className="w-6 h-6 text-[var(--plum)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[var(--lilac)]">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-medium ${
                  isActive(link.href) ? 'text-[var(--purple)]' : 'text-[var(--plum-dark)]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div className="border-t border-[var(--lilac)] my-2" />
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 text-sm font-medium ${
                    isActive(link.href) ? 'text-[var(--purple)]' : 'text-[var(--plum-dark)]'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </SignedIn>

            <SignedOut>
              <div className="border-t border-[var(--lilac)] my-2" />
              <Link
                href="/sign-in"
                className="block py-2 text-sm font-medium text-[var(--plum-dark)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="btn-primary w-full text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
