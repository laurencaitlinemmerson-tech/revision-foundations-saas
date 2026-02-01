'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X, Sparkles } from 'lucide-react';
import { useEffect, useState, useCallback, useId } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuId = useId();

  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/hub', label: 'Hub' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const authLinks = [{ href: '/dashboard', label: 'Dashboard' }];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 min-w-0" aria-label="Revision Foundations - Home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" aria-hidden="true" />
            </div>

            {/* ✅ allow full title on desktop; clamp to 1 line on mobile without truncating too aggressively */}
            <span
              className="
                font-display text-lg text-[var(--plum)]
                leading-none
                block
                max-w-[220px] sm:max-w-[320px] md:max-w-none
                whitespace-nowrap
              "
              style={{ fontFamily: 'Shrikhand' }}
            >
              Revision Foundations
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[var(--purple)]'
                    : 'text-[var(--plum-dark)]/70 hover:text-[var(--purple)]'
                }`}
                role="menuitem"
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div className="w-px h-4 bg-[var(--lilac-medium)]" aria-hidden="true" />
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[var(--purple)]'
                      : 'text-[var(--plum-dark)]/70 hover:text-[var(--purple)]'
                  }`}
                  role="menuitem"
                  aria-current={isActive(link.href) ? 'page' : undefined}
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
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Get Started
              </Link>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-[var(--lilac-soft)] transition-colors" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[var(--plum)]" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6 text-[var(--plum)]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          id={mobileMenuId}
          className="md:hidden bg-white border-t border-[var(--lilac)] max-h-[calc(100vh-5rem)] overflow-y-auto"
          role="menu"
          aria-label="Mobile navigation"
        >
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 text-sm font-medium ${
                  isActive(link.href) ? 'text-[var(--purple)]' : 'text-[var(--plum-dark)]'
                }`}
                onClick={closeMobileMenu}
                role="menuitem"
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div className="border-t border-[var(--lilac)] my-2" aria-hidden="true" />
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-3 text-sm font-medium ${
                    isActive(link.href) ? 'text-[var(--purple)]' : 'text-[var(--plum-dark)]'
                  }`}
                  onClick={closeMobileMenu}
                  role="menuitem"
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </SignedIn>

            <SignedOut>
              <div className="border-t border-[var(--lilac)] my-2" aria-hidden="true" />
              <Link
                href="/sign-in"
                className="block py-3 text-sm font-medium text-[var(--plum-dark)]"
                onClick={closeMobileMenu}
                role="menuitem"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="btn-primary w-full text-center mt-2"
                onClick={closeMobileMenu}
                role="menuitem"
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
