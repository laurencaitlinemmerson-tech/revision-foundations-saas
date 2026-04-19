'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Menu, X, Search } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuId = 'nav-mobile-menu';
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      window.requestAnimationFrame(() => {
        firstMobileLinkRef.current?.focus();
      });
      return;
    }

    menuButtonRef.current?.focus();
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const desktopLinks = [
    { href: '/hub', label: 'Hub' },
    { href: '/osce', label: 'OSCE' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const signedInDesktopLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    ...desktopLinks,
  ];

  const signedOutDesktopLinks = [
    ...desktopLinks,
  ];

  const signedInMobilePrimaryLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/hub', label: 'Hub' },
    { href: '/osce', label: 'OSCE' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const signedOutMobilePrimaryLinks = [
    { href: '/hub', label: 'Hub' },
    { href: '/osce', label: 'OSCE' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/pricing', label: 'Pricing' },
  ];

  const mobileSecondaryLinks = [
    { href: '/', label: 'Home' },
    { href: '/study-skills', label: 'Study Skills' },
    { href: '/hub/questions', label: 'Q&A Board' },
    { href: '/hub/glossary', label: 'Glossary' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const display = "'Playfair Display', Georgia, serif";
  const ink = '#1A1815';
  const inkMid = '#5A5750';
  const cream = '#FAFAF8';
  const border = 'rgba(0,0,0,0.08)';
  const navHeight = 'calc(68px + env(safe-area-inset-top))';
  const navBackground = mobileMenuOpen || scrolled ? 'rgba(250,250,248,0.97)' : 'rgba(250,250,248,0.9)';

  return (
    <nav
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 120, pointerEvents: 'none' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          pointerEvents: 'auto',
          transition:
            'background-color 0.25s ease, border-color 0.25s ease, backdrop-filter 0.25s ease',
          backgroundColor: navBackground,
          backdropFilter: 'blur(16px)',
          borderBottom: `0.5px solid ${mobileMenuOpen || scrolled ? border : 'transparent'}`,
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            paddingLeft: 'calc(24px + env(safe-area-inset-left))',
            paddingRight: 'calc(24px + env(safe-area-inset-right))',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '68px' }}>
          <Link href="/" style={{ fontFamily: display, fontSize: '18px', fontWeight: 400, letterSpacing: '-0.01em', color: ink, textDecoration: 'none', lineHeight: 1 }} aria-label="The Nurse Lab — Home">
            The Nurse Lab
          </Link>

          <div className="nav-desktop-links" style={{ alignItems: 'center', gap: '28px' }}>
            <SignedIn>
              {signedInDesktopLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ fontFamily: serif, fontSize: '14px', fontWeight: isActive(link.href) ? 400 : 300, color: isActive(link.href) ? ink : inkMid, textDecoration: 'none', borderBottom: isActive(link.href) ? `1px solid ${ink}` : '1px solid transparent', paddingBottom: '2px', transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = ink; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = isActive(link.href) ? ink : inkMid; }}
                  aria-current={isActive(link.href) ? 'page' : undefined}>
                  {link.label}
                </Link>
              ))}
            </SignedIn>
            <SignedOut>
              {signedOutDesktopLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ fontFamily: serif, fontSize: '14px', fontWeight: isActive(link.href) ? 400 : 300, color: isActive(link.href) ? ink : inkMid, textDecoration: 'none', borderBottom: isActive(link.href) ? `1px solid ${ink}` : '1px solid transparent', paddingBottom: '2px', transition: 'color 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = ink; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = isActive(link.href) ? ink : inkMid; }}
                  aria-current={isActive(link.href) ? 'page' : undefined}>
                  {link.label}
                </Link>
              ))}
            </SignedOut>
            <SignedIn>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('open-command-palette'))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: `0.5px solid ${border}`,
                  padding: '6px 10px',
                  borderRadius: '6px',
                  color: inkMid,
                  cursor: 'pointer',
                  fontFamily: serif,
                  fontSize: '13px',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = ink; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.16)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = inkMid; (e.currentTarget as HTMLButtonElement).style.borderColor = border }}
              >
                <Search className="w-4 h-4" />
                <span style={{ marginRight: '4px' }}>Search</span>
                <kbd style={{ fontFamily: 'monospace', fontSize: '10px', opacity: 0.6 }}>⌘K</kbd>
              </button>
              <UserButton afterSwitchSessionUrl="/" appearance={{ elements: { avatarBox: 'w-7 h-7' } }} />
            </SignedIn>
            <SignedOut>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link href="/sign-in" style={{ fontFamily: serif, fontSize: '13px', fontWeight: 400, color: ink, background: 'rgba(255,255,255,0.8)', border: `0.5px solid ${border}`, padding: '8px 16px', textDecoration: 'none', transition: 'background-color 0.15s ease, border-color 0.15s ease' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#ffffff';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,0,0,0.14)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.8)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = border;
                  }}>
                  Sign in / create account
                </Link>
                <Link href="/pricing" style={{ fontFamily: serif, fontSize: '13px', fontWeight: 400, color: cream, background: ink, padding: '8px 20px', textDecoration: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#3a2010'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ink; }}>
                  Get Access
                </Link>
              </div>
            </SignedOut>
          </div>

            <button
              ref={menuButtonRef}
              type="button"
              className="nav-mobile-toggle md:hidden"
              style={{ background: 'transparent', border: '0.5px solid transparent', cursor: 'pointer', padding: '10px', color: ink, alignItems: 'center', justifyContent: 'center', touchAction: 'manipulation' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen} aria-controls={mobileMenuId}
              aria-haspopup="dialog"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
              {mobileMenuOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close mobile navigation overlay"
            onClick={closeMobileMenu}
            style={{ position: 'fixed', inset: 0, background: 'rgba(26,24,21,0.18)', backdropFilter: 'blur(2px)', zIndex: 1, border: 'none', padding: 0, pointerEvents: 'auto' }}
          />
          <div
            id={mobileMenuId}
            style={{ position: 'fixed', top: navHeight, left: 0, right: 0, bottom: 0, background: cream, borderTop: `1px solid ${border}`, padding: '20px calc(24px + env(safe-area-inset-right)) calc(28px + env(safe-area-inset-bottom)) calc(24px + env(safe-area-inset-left))', overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', zIndex: 2, pointerEvents: 'auto' }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div role="navigation" aria-label="Mobile navigation links">
              <SignedIn>
                {signedInMobilePrimaryLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    href={link.href}
                    style={{ display: 'block', padding: '14px 0', fontFamily: serif, fontSize: '16px', fontWeight: isActive(link.href) ? 500 : 400, color: isActive(link.href) ? ink : inkMid, textDecoration: 'none', borderBottom: `1px solid ${border}` }}
                    onClick={closeMobileMenu}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </SignedIn>
              <SignedOut>
                {signedOutMobilePrimaryLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    ref={index === 0 ? firstMobileLinkRef : undefined}
                    href={link.href}
                    style={{ display: 'block', padding: '14px 0', fontFamily: serif, fontSize: '16px', fontWeight: isActive(link.href) ? 500 : 400, color: isActive(link.href) ? ink : inkMid, textDecoration: 'none', borderBottom: `1px solid ${border}` }}
                    onClick={closeMobileMenu}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </SignedOut>
              <div style={{ paddingTop: '18px' }}>
                <p style={{ fontFamily: serif, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9C8878', marginBottom: '8px' }}>
                  More
                </p>
                {mobileSecondaryLinks.map(link => (
                  <Link key={link.href} href={link.href} style={{ display: 'block', padding: '12px 0', fontFamily: serif, fontSize: '15px', fontWeight: isActive(link.href) ? 500 : 400, color: isActive(link.href) ? ink : inkMid, textDecoration: 'none' }}
                    onClick={closeMobileMenu} aria-current={isActive(link.href) ? 'page' : undefined}>
                    {link.label}
                  </Link>
                ))}
              </div>
              <SignedIn>
                <div style={{ paddingTop: '20px' }}><UserButton afterSwitchSessionUrl="/" /></div>
              </SignedIn>
              <SignedOut>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px' }}>
                  <Link href="/sign-in" style={{ display: 'block', textAlign: 'center' as const, padding: '13px', fontFamily: serif, fontSize: '15px', color: inkMid, border: `0.5px solid ${border}`, textDecoration: 'none' }} onClick={closeMobileMenu}>
                    Sign in or create account
                  </Link>
                  <Link href="/pricing" style={{ display: 'block', textAlign: 'center' as const, padding: '13px', fontFamily: serif, fontSize: '15px', color: cream, background: ink, textDecoration: 'none' }} onClick={closeMobileMenu}>
                    Get Access
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        </>
      )}
      <style>{`
        .nav-desktop-links { display: none; }
        .nav-mobile-toggle { display: inline-flex; }
        .nav-mobile-toggle:focus-visible,
        .nav-mobile-toggle:hover {
          background: rgba(80, 76, 68, 0.06);
          border-color: rgba(0,0,0,0.08);
          outline: none;
        }
        @media (min-width: 768px) {
          .nav-desktop-links { display: flex; }
          .nav-mobile-toggle { display: none; }
        }
      `}</style>
    </nav>
  );
}
