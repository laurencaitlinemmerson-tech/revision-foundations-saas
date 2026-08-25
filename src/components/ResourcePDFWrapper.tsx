'use client';

import { useRef, useState, ReactNode, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ResourceDiscussion from '@/components/ResourceDiscussion';

interface ResourcePDFWrapperProps {
  children: ReactNode;
}

export default function ResourcePDFWrapper({ children }: ResourcePDFWrapperProps) {
  const pathname = usePathname();
  // Extract slug from e.g. /hub/resources/cell-biology → "cell-biology"
  const slug = pathname?.split('/').pop() ?? '';
  const contentRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [showSaveNudge, setShowSaveNudge] = useState(false);
  const nudgeDismissed = useRef(false);

  // Show save nudge after scrolling 80% of the page
  useEffect(() => {
    const handleScroll = () => {
      if (nudgeDismissed.current) return;
      const el = contentRef.current;
      if (!el) return;
      const scrolled = window.scrollY + window.innerHeight;
      const threshold = el.offsetTop + el.scrollHeight * 0.8;
      if (scrolled >= threshold) setShowSaveNudge(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dismissNudge = useCallback(() => {
    nudgeDismissed.current = true;
    setShowSaveNudge(false);
  }, []);

  const scrollToSave = useCallback(() => {
    const saveBtn = contentRef.current?.querySelector('[class*="mt-6"]') as HTMLElement | null;
    if (saveBtn) saveBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    dismissNudge();
  }, [dismissNudge]);

  const handleDownload = useCallback(async () => {
    const el = contentRef.current;
    if (!el || generating) return;

    setGenerating(true);

    // ── Hide interactive / non-print elements ──
    const hidden: HTMLElement[] = [];
    const hide = (node: HTMLElement | null) => {
      if (!node) return;
      node.style.display = 'none';
      hidden.push(node);
    };

    try {
      // Back navigation
      el.querySelectorAll<HTMLElement>('[class*="-back"]').forEach(hide);
      // Save / bookmark row
      el.querySelectorAll<HTMLElement>('.mt-6').forEach((node) => {
        if (node.querySelector('button')) hide(node);
      });
      // Download button itself
      el.querySelectorAll<HTMLElement>('.pdf-download-btn').forEach(hide);
      // Checklist grids
      el.querySelectorAll<HTMLElement>('[class*="checklist"], [class*="check-item"]').forEach(hide);
      // SelfTestQuiz components
      el.querySelectorAll<HTMLElement>('.mt-8.print\\:hidden').forEach(hide);
      // Self-test / checklist headings
      el.querySelectorAll<HTMLElement>('h2').forEach((h2) => {
        const text = h2.textContent?.trim().toLowerCase() || '';
        if (text.includes('self-test') || text.includes('checklist')) hide(h2);
      });

      el.classList.add('pdf-generating');

      // Extract title for filename
      const h1 = el.querySelector('h1');
      const title = h1?.textContent?.trim().replace(/[^a-zA-Z0-9\s\-–]/g, '').replace(/\s+/g, '-') || 'resource';

      // Dynamic scale to stay under browser canvas limit (~16k px)
      const elHeight = el.scrollHeight;
      const scale = elHeight * 1.5 > 15000 ? 1 : 1.5;

      const [html2canvas, { jsPDF }] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(el, {
        scale,
        useCORS: true,
        scrollY: 0,
        windowWidth: 860,
        logging: false,
      });

      // A4 dimensions in mm
      const pageW = 210;
      const pageH = 297;
      const mTop = 12, mRight = 10, mBottom = 14, mLeft = 10;
      const contentW = pageW - mLeft - mRight; // 190mm
      const contentH = pageH - mTop - mBottom; // 271mm

      // Total image height in mm at content width
      const imgHeight = (canvas.height / canvas.width) * contentW;
      const pagesCount = Math.ceil(imgHeight / contentH);

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

      for (let i = 0; i < pagesCount; i++) {
        if (i > 0) pdf.addPage();

        // How many mm from the top of the full image this page starts
        const yOffsetMm = i * contentH;
        // Corresponding pixel offset in the source canvas
        const sourceY = (yOffsetMm / imgHeight) * canvas.height;
        // Pixels to take for this page
        const sliceH = Math.min(
          (contentH / imgHeight) * canvas.height,
          canvas.height - sourceY,
        );

        // Render this slice to a temporary canvas
        const slice = document.createElement('canvas');
        slice.width = canvas.width;
        slice.height = Math.ceil(sliceH);
        const ctx = slice.getContext('2d')!;
        ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

        const imgData = slice.toDataURL('image/jpeg', 0.95);
        // Height of this slice in mm
        const sliceHMm = (sliceH / canvas.height) * imgHeight;
        pdf.addImage(imgData, 'JPEG', mLeft, mTop, contentW, sliceHMm);
      }

      pdf.save(`${title}-TheNurseLab.pdf`);
    } finally {
      el.classList.remove('pdf-generating');
      hidden.forEach((node) => { node.style.display = ''; });
      setGenerating(false);
    }
  }, [generating]);

  return (
    <div ref={contentRef} className="resource-pdf-root">
      <style dangerouslySetInnerHTML={{ __html: PDF_CSS }} />
      {children}

      {/* ── Quiz/OSCE cross-link — hidden during PDF generation ── */}
      <div className="resource-quiz-cta">
        <p className="resource-quiz-cta-label">Also practice with</p>
        <div className="resource-quiz-cta-links">
          <Link href="/quiz" className="resource-quiz-cta-link">
            Core Quiz — test your recall →
          </Link>
          <Link href="/osce" className="resource-quiz-cta-link">
            OSCE Stations — apply it clinically →
          </Link>
        </div>
      </div>

      {/* ── Discussion — hidden during PDF generation ── */}
      {slug && slug !== 'resources' && (
        <div className="resource-discussion-wrap">
          <ResourceDiscussion slug={slug} />
        </div>
      )}

      {/* ── Save nudge — appears after 80% scroll ── */}
      {showSaveNudge && (
        <div className="save-nudge">
          <button className="save-nudge-action" onClick={scrollToSave}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Save this guide for later
          </button>
          <button className="save-nudge-dismiss" onClick={dismissNudge} aria-label="Dismiss">×</button>
        </div>
      )}

      <button
        className="pdf-download-btn"
        onClick={handleDownload}
        disabled={generating}
        aria-label="Download as PDF"
      >
        {generating ? (
          <span className="pdf-download-spinner" />
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
        <span>{generating ? 'Generating…' : 'Download PDF'}</span>
      </button>
    </div>
  );
}

/* ─── Scoped styles ─────────────────────────────────────────────────────────── */

const PDF_CSS = `
  .pdf-download-btn {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 900;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 12px 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--surface-page);
    background: #1A1815;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
  }
  .pdf-download-btn:hover {
    opacity: 0.82;
  }
  .pdf-download-btn:disabled {
    opacity: 0.5;
    cursor: wait;
  }
  .pdf-download-btn svg {
    flex-shrink: 0;
    stroke: var(--surface-page);
  }

  .pdf-download-spinner {
    width: 14px;
    height: 14px;
    border: 1.5px solid rgba(255,255,255,0.2);
    border-top-color: var(--surface-page);
    border-radius: 50%;
    animation: pdf-spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes pdf-spin {
    to { transform: rotate(360deg); }
  }

  /* ── PDF generation layout overrides ── */

  .pdf-generating * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  .pdf-generating [class*="-wrap"] {
    padding-left: 28px !important;
    padding-right: 28px !important;
    padding-top: 24px !important;
  }

  .pdf-generating [class*="-step"] {
    grid-template-columns: 64px 1fr !important;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating [class*="-step-letter"] {
    font-size: 44px !important;
  }

  .pdf-generating [class*="-step-sidebar"] {
    padding-right: 12px !important;
  }

  .pdf-generating [class*="-step-content"] {
    padding-left: 16px !important;
  }

  .pdf-generating [class*="-golden"] {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .pdf-generating [class*="-content-grid"] {
    grid-template-columns: repeat(4, 1fr) !important;
    font-size: 11px !important;
  }

  .pdf-generating [class*="-content-col"] {
    padding: 10px 10px 14px !important;
  }

  .pdf-generating [class*="-golden"],
  .pdf-generating [class*="golden-rules"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating [class*="-pearl"],
  .pdf-generating [class*="-callout"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating [class*="-flags"],
  .pdf-generating [class*="red-flag"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating table,
  .pdf-generating [class*="-table"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating [class*="-grid"] {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .pdf-generating h2,
  .pdf-generating [class*="section-title"] {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* PDF footer branding */
  .pdf-generating::after {
    content: 'thenurselab.co.uk';
    display: block;
    text-align: center;
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ink-faint);
    padding: 32px 0 16px;
    border-top: 0.5px solid var(--hairline-soft);
    margin-top: 48px;
  }

  @media print {
    .pdf-download-btn { display: none !important; }
  }

  /* ── Save nudge ── */
  .save-nudge {
    position: fixed;
    bottom: 28px;
    left: 28px;
    z-index: 900;
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--surface-page);
    border: 0.5px solid var(--hairline-firm);
    box-shadow: 0 2px 16px rgba(0,0,0,0.10);
    animation: nudge-in 0.25s ease;
  }
  @keyframes nudge-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .save-nudge-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 16px;
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: var(--ink-strong);
    background: none;
    border: none;
    cursor: pointer;
  }
  .save-nudge-action:hover { background: var(--surface-sunken); }
  .save-nudge-dismiss {
    padding: 11px 13px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--ink-faint);
    background: none;
    border: none;
    border-left: 0.5px solid var(--hairline-soft);
    cursor: pointer;
    line-height: 1;
  }
  .save-nudge-dismiss:hover { color: var(--ink-soft); }

  /* ── Quiz/OSCE cross-link CTA ── */
  .resource-quiz-cta {
    margin-top: 48px;
    padding: 24px 28px;
    border: 0.5px solid var(--hairline-soft);
    background: var(--surface-sunken);
  }
  .resource-quiz-cta-label {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--ink-faint);
    margin-bottom: 14px;
  }
  .resource-quiz-cta-links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .resource-quiz-cta-link {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: var(--ink-strong);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: rgba(0,0,0,0.25);
  }
  .resource-quiz-cta-link:hover {
    text-decoration-color: #1A1815;
  }

  /* ── Discussion wrapper ── */
  .resource-discussion-wrap {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 0.5px solid var(--hairline-soft);
  }

  /* Hide non-print sections during PDF generation */
  .pdf-generating .resource-quiz-cta,
  .pdf-generating .resource-discussion-wrap {
    display: none !important;
  }
`;
