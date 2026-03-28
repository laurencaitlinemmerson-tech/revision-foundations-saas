'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import { useEffect, useState, useCallback, useId } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuId = useId();

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/hub', label: 'Hub' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: 'background-color 0.25s ease, border-color 0.25s ease',
    backgroundColor: scrolled ? 'rgba(241,237,233,0.97)' : 'transparent',
    borderBottom: scrolled ? '0.5px solid var(--linen-deep)' : '0.5px solid transparent',
    backdropFilter: 'none',
  };

  return (
    <nav style={navStyle} role="navigation" aria-label="Main navigation">
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '68px' }}>

          {/* Wordmark */}
          <Link
            href="/"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '18px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: 'var(--espresso)',
              textDecoration: 'none',
              lineHeight: 1,
            }}
            aria-label="Revision Foundations — Home"
          >
            Revision Foundations
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden md:flex" role="menubar">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '14px',
                  fontWeight: isActive(link.href) ? 500 : 400,
                  color: isActive(link.href) ? 'var(--espresso)' : 'var(--charcoal-light)',
                  textDecoration: 'none',
                  borderBottom: isActive(link.href) ? '1px solid var(--espresso)' : '1px solid transparent',
                  paddingBottom: '1px',
                  transition: 'color 0.15s',
                }}
                role="menuitem"
                aria-current={isActive(link.href) ? 'page' : undefined}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--espresso)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = isActive(link.href) ? 'var(--espresso)' : 'var(--charcoal-light)'; }}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div style={{ width: '0.5px', height: '16px', background: 'var(--linen-deep)' }} aria-hidden="true" />
              <Link
                href="/dashboard"
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '14px',
                  fontWeight: isActive('/dashboard') ? 500 : 400,
                  color: isActive('/dashboard') ? 'var(--espresso)' : 'var(--charcoal-light)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--espresso)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = isActive('/dashboard') ? 'var(--espresso)' : 'var(--charcoal-light)'; }}
              >
                Dashboard
              </Link>
              <UserButton afterSwitchSessionUrl="/" appearance={{ elements: { avatarBox: 'w-7 h-7' } }} />
            </SignedIn>

            <SignedOut>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  href="/sign-in"
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: '14px',
                    fontWeight: 400,
                    color: 'var(--charcoal-light)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--espresso)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--charcoal-light)'; }}
                >
                  Sign in
                </Link>
                <Link
                  href="/pricing"
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: '13px',
                    fontWeight: 400,
                    color: 'var(--cream)',
                    background: 'var(--espresso)',
                    padding: '7px 18px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                    letterSpacing: '0.01em',
                  }}
                >
                  Get Access
                </Link>
              </div>
            </SignedOut>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--espresso)',
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen
              ? <X style={{ width: '22px', height: '22px' }} aria-hidden="true" />
              : <Menu style={{ width: '22px', height: '22px' }} aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id={mobileMenuId}
          style={{
            background: 'var(--cream)',
            borderTop: '0.5px solid var(--linen-deep)',
            padding: '20px 24px 28px',
          }}
          role="menu"
          aria-label="Mobile navigation"
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                padding: '12px 0',
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '16px',
                fontWeight: isActive(link.href) ? 500 : 400,
                color: isActive(link.href) ? 'var(--espresso)' : 'var(--charcoal)',
                textDecoration: 'none',
                borderBottom: '0.5px solid var(--linen-deep)',
              }}
              onClick={closeMobileMenu}
              role="menuitem"
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}

          <SignedIn>
            <Link
              href="/dashboard"
              style={{
                display: 'block',
                padding: '12px 0',
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: '16px',
                color: 'var(--charcoal)',
                textDecoration: 'none',
                borderBottom: '0.5px solid var(--linen-deep)',
              }}
              onClick={closeMobileMenu}
              role="menuitem"
            >
              Dashboard
            </Link>
            <div style={{ paddingTop: '20px' }}>
              <UserButton afterSwitchSessionUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px' }}>
              <Link
                href="/sign-in"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px',
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '15px',
                  color: 'var(--charcoal)',
                  border: '0.5px solid var(--linen-deep)',
                  borderRadius: '3px',
                  textDecoration: 'none',
                }}
                onClick={closeMobileMenu}
                role="menuitem"
              >
                Sign in
              </Link>
              <Link
                href="/pricing"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px',
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: '15px',
                  color: 'var(--cream)',
                  background: 'var(--espresso)',
                  borderRadius: '3px',
                  textDecoration: 'none',
                }}
                onClick={closeMobileMenu}
                role="menuitem"
              >
                Get Access
              </Link>
            </div>
          </SignedOut>
        </div>
      )}
    </nav>
  );
}
