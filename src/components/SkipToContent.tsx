'use client';

import type { MouseEvent } from 'react';

export default function SkipToContent() {
  const handleSkipToContent = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector<HTMLElement>('main, [role="main"], [data-main-content], h1');

    if (!target) {
      return;
    }

    event.preventDefault();

    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }

    target.focus({ preventScroll: true });

    const top = window.scrollY + target.getBoundingClientRect().top - 88;
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: 'smooth',
    });
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkipToContent}
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[100]
        bg-[var(--purple)] text-white
        px-6 py-3 rounded-xl
        font-semibold text-sm
        shadow-lg
        focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--lavender)]
        transition-transform
      "
    >
      Skip to main content
    </a>
  );
}
