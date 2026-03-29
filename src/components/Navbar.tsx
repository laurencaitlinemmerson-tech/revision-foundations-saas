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
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/hub', label: 'Hub' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  const serif = "'Source Serif 4', Georgia, serif";
  const display = "'Playfair Display', Georgia, serif";
  const ink = '#1C1510';
  const inkMid = '#5C4A38';
  const cream = '#F9F6F0';
  const border = '#DDD5C8';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
        backgroundColor: scrolled ? 'rgba(249,246,240,0.97)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${border}` : '1px solid transparent',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '68px',
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: display,
              fontSize: '17px',
              fontWeight: 400,
              letterSpacing: '0.01em',
              color: ink,
              textDecoration: 'none',
              lineHeight: 1,
            }}
            aria-label="Revision Foundations — Home"
          >
            Revision Foundations
          </Link>

          <div
            style={{ display: 'flex', alignItems: 'center', gap: '28px' }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  fontWeight: isActive(link.href) ? 500 : 400,
                  color: isActive(link.href) ? ink : inkMid,
                  textDecoration: 'none',
                  borderBottom: isActive(link.href)
                    ? `1px solid ${ink}`
                    : '1px solid transparent',
                  paddingBottom: '1px',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = ink;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = isActive(link.href)
                    ? ink
                    : inkMid;
                }}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div
                style={{ width: '1px', height: '16px', background: border }}
                aria-hidden="true"
              />
              <Link
                href="/dashboard"
                style={{
                  fontFamily: serif,
                  fontSize: '14px',
                  fontWeight: isActive('/dashboard') ? 500 : 400,
                  color: isActive('/dashboard') ? ink : inkMid,
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = ink;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = isActive('/dashboard')
                    ? ink
                    : inkMid;
                }}
              >
                Dashboard
              </Link>
              <UserButton
                afterSwitchSessionUrl="/"
                appearance={{ elements: { avatarBox: 'w-7 h-7' } }}
              />
            </SignedIn>

            <SignedOut>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  href="/sign-in"
                  style={{
                    fontFamily: serif,
                    fontSize: '14px',
                    fontWeight: 400,
                    color: inkMid,
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = ink;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = inkMid;
                  }}
                >
                  Sign in
                </Link>
                <Link
                  href="/pricing"
                  style={{
                    fontFamily: serif,
                    fontSize: '13px',
                    fontWeight: 400,
                    color: cream,
                    background: ink,
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#3a2010';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = ink;
                  }}
                >
                  Get Access
                </Link>
              </div>
            </SignedOut>
          </div>

          <button
            className="md:hidden"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: ink,
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X style={{ width: '22px', height: '22px' }} />
            ) : (
              <Menu style={{ width: '22px', height: '22px' }} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id={mobileMenuId}
          style={{
            background: cream,
            borderTop: `1px solid ${border}`,
            padding: '20px 24px 28px',
          }}
          role="menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'block',
                padding: '12px 0',
                fontFamily: serif,
                fontSize: '16px',
                fontWeight: isActive(link.href) ? 500 : 400,
                color: isActive(link.href) ? ink : inkMid,
                textDecoration: 'none',
                borderBottom: `1px solid ${border}`,
              }}
              onClick={closeMobileMenu}
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
                fontFamily: serif,
                fontSize: '16px',
                color: inkMid,
                textDecoration: 'none',
                borderBottom: `1px solid ${border}`,
              }}
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
            <div style={{ paddingTop: '20px' }}>
              <UserButton afterSwitchSessionUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                paddingTop: '20px',
              }}
            >
              <Link
                href="/sign-in"
                style={{
                  display: 'block',
                  textAlign: 'center' as const,
                  padding: '11px',
                  fontFamily: serif,
                  fontSize: '15px',
                  color: inkMid,
                  border: `1px solid ${border}`,
                  borderRadius: '9999px',
                  textDecoration: 'none',
                }}
                onClick={closeMobileMenu}
              >
                Sign in
              </Link>
              <Link
                href="/pricing"
                style={{
                  display: 'block',
                  textAlign: 'center' as const,
                  padding: '11px',
                  fontFamily: serif,
                  fontSize: '15px',
                  color: cream,
                  background: ink,
                  borderRadius: '9999px',
                  textDecoration: 'none',
                }}
                onClick={closeMobileMenu}
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
