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

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/hub', label: 'Hub' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  const display = "'Playfair Display', Georgia, serif";
  const serif = "'Source Serif 4', Georgia, serif";

  const ink = '#1C1510';
  const inkMid = '#5C4A38';
  const cream = '#F9F6F0';
  const border = '#DDD5C8';
  const inkHover = '#3a2010';

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
        backgroundColor: scrolled ? 'rgba(249,246,240,0.97)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${border}` : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0 16px',
        }}
        className="sm:px-6"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '68px',
            gap: '12px',
          }}
        >
          <Link
            href="/"
            aria-label="Revision Foundations — Home"
            style={{
              fontFamily: display,
              fontSize: '17px',
              fontWeight: 400,
              letterSpacing: '0.01em',
              color: ink,
              textDecoration: 'none',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              flexShrink: 1,
              minWidth: 0,
            }}
          >
            Revision Foundations
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
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
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = ink;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive(link.href) ? ink : inkMid;
                }}
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <div
                style={{
                  width: '1px',
                  height: '16px',
                  background: border,
                }}
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
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = ink;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive('/dashboard') ? ink : inkMid;
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
              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  style={{
                    fontFamily: serif,
                    fontSize: '14px',
                    fontWeight: 400,
                    color: inkMid,
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = ink;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = inkMid;
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
                    whiteSpace: 'nowrap',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = inkHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = ink;
                  }}
                >
                  Get Access
                </Link>
              </div>
            </SignedOut>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
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
          role="menu"
          style={{
            background: cream,
            borderTop: `1px solid ${border}`,
            padding: '20px 16px 28px',
          }}
          className="md:hidden sm:px-6"
        >
          <div
            style={{
              maxWidth: '1120px',
              margin: '0 auto',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={closeMobileMenu}
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
              >
                {link.label}
              </Link>
            ))}

            <SignedIn>
              <Link
                href="/dashboard"
                role="menuitem"
                onClick={closeMobileMenu}
                style={{
                  display: 'block',
                  padding: '12px 0',
                  fontFamily: serif,
                  fontSize: '16px',
                  fontWeight: isActive('/dashboard') ? 500 : 400,
                  color: isActive('/dashboard') ? ink : inkMid,
                  textDecoration: 'none',
                  borderBottom: `1px solid ${border}`,
                }}
              >
                Dashboard
              </Link>

              <div
                style={{
                  paddingTop: '20px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                }}
              >
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
                  onClick={closeMobileMenu}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '11px',
                    fontFamily: serif,
                    fontSize: '15px',
                    color: inkMid,
                    border: `1px solid ${border}`,
                    borderRadius: '9999px',
                    textDecoration: 'none',
                  }}
                >
                  Sign in
                </Link>

                <Link
                  href="/pricing"
                  onClick={closeMobileMenu}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '11px',
                    fontFamily: serif,
                    fontSize: '15px',
                    color: cream,
                    background: ink,
                    borderRadius: '9999px',
                    textDecoration: 'none',
                  }}
                >
                  Get Access
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
