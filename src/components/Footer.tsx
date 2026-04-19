'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const display = "'Playfair Display', Georgia, serif";

  const headingStyle: React.CSSProperties = {
    fontFamily: serif, fontSize: '11px', fontWeight: 400,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    color: '#5C4A38', marginBottom: '12px',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: serif, fontSize: '13px', fontWeight: 300,
    color: '#9C8878', textDecoration: 'none', transition: 'color 0.15s',
  };

  const colStyle: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', gap: '10px',
  };

  return (
    <footer style={{ background: '#FAFAF8', borderTop: '1px solid rgba(0,0,0,0.08)', padding: '56px 24px 36px' }}
      role="contentinfo" aria-label="Site footer">
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '40px', marginBottom: '48px' }}>

          <div style={{ gridColumn: 'span 2' }} className="md:col-span-1">
            <p style={{ fontFamily: display, fontSize: '20px', fontWeight: 400, fontStyle: 'italic', color: '#1A1815', marginBottom: '10px', letterSpacing: '0.01em' }}>
              The Nurse Lab
            </p>
            <p style={{ fontFamily: serif, fontSize: '13px', fontWeight: 300, color: '#77736C', lineHeight: 1.7 }}>
              Made with care by Lauren.<br />Built in 2026 for UK student nurses.
            </p>
          </div>

          <nav aria-label="Products">
            <div style={colStyle}>
              <p style={headingStyle}>Products</p>
              {[{ href: '/osce', label: 'OSCE Tool' }, { href: '/quiz', label: 'Core Quiz' }, { href: '/hub', label: 'Revision Hub' }, { href: '/pricing', label: 'Pricing' }].map(l => (
                <Link key={l.href} href={l.href} style={linkStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1A1815'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#9C8878'; }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Company">
            <div style={colStyle}>
              <p style={headingStyle}>Company</p>
              {[{ href: '/study-skills', label: 'Study Skills' }, { href: '/about', label: 'About' }, { href: '/contact', label: 'Contact' }, { href: '/privacy', label: 'Privacy Policy' }, { href: '/terms', label: 'Terms of Service' }, { href: '/delete-data', label: 'Delete My Data' }].map(l => (
                <Link key={l.href} href={l.href} style={linkStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1A1815'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#9C8878'; }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Account">
            <div style={colStyle}>
              <p style={headingStyle}>Account</p>
              {[{ href: '/sign-in', label: 'Sign in or create account' }, { href: '/dashboard', label: 'Dashboard' }].map(l => (
                <Link key={l.href} href={l.href} style={linkStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#1A1815'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#9C8878'; }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <p style={{ fontFamily: serif, fontSize: '12px', fontWeight: 300, color: '#9C8878', lineHeight: 1.6, marginBottom: '20px', fontStyle: 'italic' }}>
          This resource is designed to support revision and does not replace clinical teaching or university guidance.
        </p>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '8px' }}>
          <p style={{ fontFamily: serif, fontSize: '12px', fontWeight: 300, color: '#9C8878' }}>
            © {currentYear} The Nurse Lab. All rights reserved.
          </p>
          <p style={{ fontFamily: serif, fontSize: '12px', fontWeight: 300, color: '#9C8878' }}>
            UK nursing students
          </p>
        </div>
      </div>
    </footer>
  );
}
