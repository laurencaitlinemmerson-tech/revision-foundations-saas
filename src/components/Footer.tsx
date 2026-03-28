'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const colStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(241,237,233,0.45)',
    marginBottom: '4px',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: '13px',
    fontWeight: 300,
    color: 'rgba(241,237,233,0.7)',
    textDecoration: 'none',
    transition: 'color 0.15s',
  };

  return (
    <footer
      style={{
        background: '#1E1713',
        borderTop: '0.5px solid rgba(241,237,233,0.08)',
        padding: '56px 24px 36px',
      }}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '40px', marginBottom: '48px' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }} className="md:col-span-1">
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '20px',
              fontWeight: 600,
              fontStyle: 'italic',
              color: 'rgba(241,237,233,0.9)',
              marginBottom: '10px',
              letterSpacing: '0.03em',
            }}>
              Revision Foundations
            </p>
            <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '13px', fontWeight: 300, color: 'rgba(241,237,233,0.45)', lineHeight: 1.6 }}>
              Made with care by Lauren.<br />
              Helping nursing students pass since 2024.
            </p>
          </div>

          {/* Products */}
          <nav aria-label="Products">
            <div style={colStyle}>
              <p style={headingStyle}>Products</p>
              {[
                { href: '/osce', label: 'OSCE Tool' },
                { href: '/quiz', label: 'Core Quiz' },
                { href: '/hub', label: 'Revision Hub' },
                { href: '/pricing', label: 'Pricing' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={linkStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(241,237,233,0.95)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(241,237,233,0.7)'; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <div style={colStyle}>
              <p style={headingStyle}>Company</p>
              {[
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/delete-data', label: 'Delete My Data' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={linkStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(241,237,233,0.95)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(241,237,233,0.7)'; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Account */}
          <nav aria-label="Account">
            <div style={colStyle}>
              <p style={headingStyle}>Account</p>
              {[
                { href: '/sign-in', label: 'Sign In' },
                { href: '/sign-up', label: 'Sign Up' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={linkStyle}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(241,237,233,0.95)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(241,237,233,0.7)'; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div style={{ borderTop: '0.5px solid rgba(241,237,233,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '12px', fontWeight: 300, color: 'rgba(241,237,233,0.3)' }}>
            © {currentYear} Revision Foundations. All rights reserved.
          </p>
          <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '12px', fontWeight: 300, color: 'rgba(241,237,233,0.3)' }}>
            UK nursing students
          </p>
        </div>
      </div>
    </footer>
  );
}
