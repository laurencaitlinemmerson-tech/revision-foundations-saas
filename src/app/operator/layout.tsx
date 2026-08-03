import type { Metadata } from 'next';
import './operator.css';

export const metadata: Metadata = {
  title: 'Operator Desk',
  // Belt and braces alongside the robots.txt disallow: this page is
  // reachable only with the link and should never be indexed.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Sets the theme before first paint so a dark-mode viewer never gets a
 * flash of the light palette. Kept inline and tiny for that reason.
 */
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('op-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.opTheme=t;}catch(e){}})();`;

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      {children}
    </>
  );
}
