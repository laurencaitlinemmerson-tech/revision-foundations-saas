'use client';

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
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
