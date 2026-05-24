'use client';

/* ============================================================
   PrintIssueButton.tsx + print-issue.css
   ============================================================
   Opens window.print() with a print-only stylesheet that hides
   navigation chrome and lays out the dashboard as A4 portrait
   editorial pages — designed primarily for the Sunday Issue
   block.

   To use:
     1. Import './print-issue.css' once in operator/page.tsx
     2. Drop <PrintIssueButton /> wherever you want the CTA
     3. (Optional) wrap your Sunday Issue in
        <section data-print-page> so it gets a page-break-before
   ============================================================ */

export function PrintIssueButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{
        background: 'transparent',
        border: 0,
        padding: '6px 0',
        cursor: 'pointer',
        fontFamily: "'Inter', sans-serif",
        fontSize: 10.5, fontWeight: 500,
        letterSpacing: '0.26em', textTransform: 'uppercase',
        color: 'var(--ink)',
        borderBottom: '0.5px solid var(--ink)',
      }}
    >
      Print the issue →
    </button>
  );
}
