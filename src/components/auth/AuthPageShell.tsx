import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthPageShellProps = {
  title: string;
  intro: string;
  helper: string;
  cardLabel: string;
  finePrint: string;
  children: ReactNode;
  mode: 'sign-in' | 'sign-up';
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');

.auth-shell *, .auth-shell *::before, .auth-shell *::after {
  box-sizing: border-box;
  box-shadow: none !important;
}

.auth-shell {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.auth-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 80px;
}

.auth-header {
  text-align: center;
  margin-bottom: 40px;
  max-width: 400px;
}

.auth-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 16px;
}

.auth-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2rem, 4.5vw, 2.8rem);
  font-weight: 400;
  line-height: 1.1;
  color: #1A1815;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
}

.auth-intro {
  font-size: 14px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.7;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  border: 0.5px solid rgba(0,0,0,0.1);
  background: #fff;
}

.auth-card-body {
  padding: 32px 28px 24px;
}

.auth-card-footer {
  padding: 14px 28px;
  border-top: 0.5px solid rgba(0,0,0,0.08);
  background: #FBF8F3;
  text-align: center;
}

.auth-card-footer p {
  font-size: 11px;
  color: #999;
  line-height: 1.6;
  margin: 0;
}

.auth-card-footer a {
  color: #5A5750;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 400;
  transition: color 0.15s;
}
.auth-card-footer a:hover {
  color: #1A1815;
}

.auth-brand {
  margin-top: 36px;
  text-align: center;
}

.auth-brand-link {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 14px;
  color: #bbb;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: color 0.15s;
}
.auth-brand-link:hover {
  color: #999;
}

@media (max-width: 480px) {
  .auth-main {
    padding: 100px 16px 60px;
  }
  .auth-card-body {
    padding: 24px 20px 20px;
  }
  .auth-card-footer {
    padding: 12px 20px;
  }
}
`;

export default function AuthPageShell({
  title,
  intro,
  finePrint,
  children,
  mode,
}: AuthPageShellProps) {
  return (
    <div className="auth-shell">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main className="auth-main">
        <div className="auth-header">
          <p className="auth-kicker">
            {mode === 'sign-in' ? 'Welcome back' : 'Get started'}
          </p>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-intro">{intro}</p>
        </div>

        <div className="auth-card">
          <div className="auth-card-body">
            <div
              style={{ minWidth: 0, maxWidth: '100%' }}
              className="auth-clerk-frame"
            >
              {children}
            </div>
          </div>

          <div className="auth-card-footer">
            <p>
              {finePrint}{' '}
              <Link href="/privacy">Privacy</Link>
              {' & '}
              <Link href="/terms">Terms</Link>.
            </p>
          </div>
        </div>

        <div className="auth-brand">
          <Link href="/" className="auth-brand-link">
            The Nurse Lab
          </Link>
        </div>
      </main>
    </div>
  );
}
