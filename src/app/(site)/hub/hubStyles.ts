export const CSS = `

.hbc-page *, .hbc-page *::before, .hbc-page *::after { box-sizing: border-box; }

.hbc-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--surface-page);
  color: var(--ink-mid);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hbc-main {
  flex: 1;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding: 72px 48px 96px;
}

/* Breadcrumb */
.hbc-breadcrumb {
  font-size: 11px;
  color: var(--ink-faint);
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.02em;
}
.hbc-breadcrumb a {
  color: var(--ink-faint);
  text-decoration: none;
  transition: color 0.1s;
}
.hbc-breadcrumb a:hover { color: var(--ink-mid); }

/* Masthead */
.hbc-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
}

.hbc-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 400;
  line-height: 1.06;
  color: var(--ink-strong);
  letter-spacing: -0.01em;
  margin-bottom: 16px;
  max-width: 16ch;
}

.hbc-standfirst {
  font-size: 15px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.7;
  max-width: 520px;
}

.hbc-briefing {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: 18px;
  margin-top: 28px;
}

.hbc-briefing-copy {
  border: 0.5px solid var(--hairline-firm);
  background: var(--surface-sunken);
  padding: 22px 24px;
}

.hbc-briefing-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 10px;
  display: block;
}

.hbc-briefing-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  line-height: 1.15;
  color: var(--ink-strong);
  margin-bottom: 10px;
}

.hbc-briefing-desc {
  font-size: 13px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.7;
  max-width: 56ch;
}

.hbc-briefing-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.hbc-briefing-btn-primary,
.hbc-briefing-btn-secondary {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 9px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hbc-briefing-btn-primary {
  background: var(--action-bg);
  color: var(--action-text);
  border: 0.5px solid var(--action-bg);
}
.hbc-briefing-btn-primary:hover { background: var(--action-bg-hover); }

.hbc-briefing-btn-secondary {
  background: var(--surface-raised);
  color: var(--ink-strong);
  border: 0.5px solid var(--hairline-firm);
}
.hbc-briefing-btn-secondary:hover { background: var(--surface-page); }

.hbc-briefing-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5px;
  border: 0.5px solid var(--hairline-firm);
  background: var(--hairline-firm);
}

.hbc-briefing-stat {
  background: var(--surface-raised);
  padding: 18px 16px;
}

.hbc-briefing-stat-label {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 8px;
  display: block;
}

.hbc-briefing-stat-value {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px;
  line-height: 1.05;
  color: var(--ink-strong);
  display: block;
}

.hbc-divider {
  border: none;
  border-top: 0.5px solid var(--hairline-firm);
  margin: 36px 0 48px;
}

/* Section labels */
.hbc-section-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 14px;
  display: block;
}

.hbc-section-heading {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 24px;
}

.hbc-lens-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 40px;
}

.hbc-lens-card {
  text-align: left;
  padding: 16px 16px 18px;
  border: 0.5px solid var(--hairline-firm);
  background: var(--surface-raised);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
}
.hbc-lens-card:hover {
  border-color: var(--border-strong);
  background: var(--surface-sunken);
  transform: translateY(-1px);
}
.hbc-lens-card.active {
  background: var(--surface-sunken);
  border-color: var(--border-strong);
}

.hbc-lens-title {
  display: block;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 19px;
  line-height: 1.1;
  color: var(--ink-strong);
  margin-bottom: 7px;
}

.hbc-lens-desc {
  display: block;
  font-size: 12px;
  line-height: 1.65;
  color: var(--ink-soft);
  font-weight: 300;
}

.hbc-lens-count {
  display: inline-block;
  margin-top: 14px;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* ── Pathways ─────────────────────────────────────────────────────────────── */

.hbc-pathways {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 52px;
}

.hbc-pathway {
  padding: 24px 26px 22px;
  border-right: 0.5px solid var(--hairline-firm);
  cursor: pointer;
  transition: background 0.12s;
  background: transparent;
  text-align: left;
  width: 100%;
  border-top: none;
  border-bottom: none;
  border-left: none;
}
.hbc-pathway:last-child { border-right: none; }
.hbc-pathway:hover { background: var(--surface-sunken); }
.hbc-pathway.active { background: var(--surface-sunken); }

.hbc-pathway-eyebrow {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 10px;
  display: block;
}
.hbc-pathway.active .hbc-pathway-eyebrow { color: var(--ink-strong); }

.hbc-pathway-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 400;
  color: var(--ink-strong);
  line-height: 1.15;
  margin-bottom: 8px;
  display: block;
}

.hbc-pathway-desc {
  font-size: 12px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.6;
  margin-bottom: 14px;
  display: block;
}

.hbc-pathway-count {
  display: inline-block;
  margin-bottom: 14px;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.hbc-pathway-cta {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-strong);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.hbc-pathway-arrow {
  font-size: 12px;
  transition: transform 0.12s;
  display: inline-block;
}
.hbc-pathway:hover .hbc-pathway-arrow { transform: translateX(3px); }

/* ── Library shelf ────────────────────────────────────────────────────────── */

.hbc-shelf {
  border: 0.5px solid var(--hairline-firm);
  padding: 24px 28px;
  margin-bottom: 48px;
}

.hbc-active-banner {
  border: 0.5px solid var(--hairline-soft);
  padding: 16px 20px;
  margin-bottom: 20px;
  background: var(--surface-sunken);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.hbc-active-banner-eyebrow {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 4px;
  display: block;
}
.hbc-active-banner-title {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 4px;
  display: block;
}
.hbc-active-banner-desc {
  font-size: 12px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.55;
}
.hbc-clear-btn {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border: 0.5px solid var(--hairline-firm);
  padding: 6px 14px;
  cursor: pointer;
  background: white;
  font-family: inherit;
  color: var(--ink-soft);
  white-space: nowrap;
  flex-shrink: 0;
}
.hbc-clear-btn:hover { background: var(--surface-page); }

.hbc-search-wrap {
  position: relative;
  margin-bottom: 18px;
}
.hbc-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--ink-faint);
  pointer-events: none;
}
.hbc-search {
  width: 100%;
  border: 0.5px solid var(--hairline-firm);
  background: white;
  padding: 10px 14px 10px 36px;
  font-size: 13px;
  font-weight: 300;
  color: var(--ink-mid);
  outline: none;
  font-family: inherit;
  border-radius: 0;
  -webkit-appearance: none;
}
.hbc-search:focus { border-color: var(--border-strong); }
.hbc-search::placeholder { color: var(--ink-faint); }

.hbc-glossary-hint {
  font-size: 12px;
  font-weight: 300;
  color: var(--ink-soft);
  margin-bottom: 16px;
  display: block;
}
.hbc-glossary-hint a {
  color: var(--ink-strong);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.hbc-glossary-hint a:hover { opacity: 0.7; }

.hbc-shortcuts {
  margin-bottom: 16px;
}

.hbc-shortcuts-label {
  display: block;
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 8px;
}

.hbc-shortcuts-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hbc-shortcut-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0.5px solid var(--hairline-firm);
  background: var(--surface-sunken);
  color: var(--ink-soft);
  padding: 7px 10px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
}
.hbc-shortcut-btn span {
  color: var(--ink-faint);
}
.hbc-shortcut-btn:hover {
  background: var(--surface-sunken);
  border-color: var(--hairline-firm);
}
.hbc-shortcut-btn.active {
  background: var(--action-bg);
  color: var(--action-text);
  border-color: var(--action-bg);
}
.hbc-shortcut-btn.active span {
  color: rgba(250,250,248,0.7);
}

.hbc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.hbc-controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.hbc-sort-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hbc-sort-label {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.hbc-sort-select {
  border: 0.5px solid var(--hairline-firm);
  background: var(--surface-raised);
  color: var(--ink-strong);
  font-size: 12px;
  padding: 9px 12px;
  border-radius: 0;
}
.hbc-filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border: 0.5px solid var(--hairline-firm);
  padding: 4px 11px;
  cursor: pointer;
  font-family: inherit;
  background: transparent;
  color: var(--ink-soft);
  transition: background 0.1s, color 0.1s;
}
.hbc-filter-btn:hover { background: var(--surface-sunken); }
.hbc-filter-btn.active {
  background: var(--action-bg);
  color: var(--action-text);
  border-color: var(--action-bg);
}

.hbc-filter-count {
  color: var(--ink-faint);
}
.hbc-filter-btn.active .hbc-filter-count {
  color: rgba(250,250,248,0.72);
}

.hbc-filter-clear {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: none;
  background: transparent;
  color: var(--ink-faint);
  cursor: pointer;
  font-family: inherit;
  padding: 4px 8px;
}
.hbc-filter-clear:hover { color: var(--ink-strong); }

.hbc-summary {
  font-size: 11px;
  color: var(--ink-faint);
  letter-spacing: 0.03em;
  margin-top: 12px;
}

.hbc-active-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.hbc-active-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0.5px solid var(--hairline-firm);
  background: var(--surface-raised);
  color: var(--ink-strong);
  padding: 7px 10px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
}

.hbc-active-pill span {
  color: var(--ink-faint);
  font-size: 12px;
  line-height: 1;
}

.hbc-active-pill:hover {
  background: var(--surface-sunken);
}

/* ── Resource cards ───────────────────────────────────────────────────────── */

.hbc-resources-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5px;
  background: var(--hairline-firm);
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 52px;
}

.hbc-card {
  display: flex;
  flex-direction: column;
  padding: 26px 28px 22px;
  background: var(--surface-page);
  cursor: pointer;
  transition: background 0.12s;
  position: relative;
  overflow: hidden;
}
.hbc-card:hover { background: var(--surface-sunken); }

/* Subject spine. A 3px bar down the leading edge, in the card's topic hue —
   the fastest thing to scan in a grid, because it needs no reading at all.
   Cards whose tags don't map to a family simply have no spine. */
.hbc-card[data-family]::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--spine, transparent);
}
.hbc-card[data-family='assessment']   { --spine: var(--topic-assessment-solid); }
.hbc-card[data-family='emergency']    { --spine: var(--topic-emergency-solid); }
.hbc-card[data-family='meds']         { --spine: var(--topic-meds-solid); }
.hbc-card[data-family='skills']       { --spine: var(--topic-skills-solid); }
.hbc-card[data-family='anatomy']      { --spine: var(--topic-anatomy-solid); }
.hbc-card[data-family='professional'] { --spine: var(--topic-professional-solid); }
.hbc-card[data-family='foundations']  { --spine: var(--topic-foundations-solid); }

.hbc-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.hbc-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.hbc-card-badge {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.hbc-card-badge.free { color: var(--state-correct-text); }
.hbc-card-badge.premium { color: var(--ink-faint); }
.hbc-card-recommended {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.hbc-card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 19px;
  font-weight: 400;
  color: var(--ink-strong);
  line-height: 1.18;
  margin-bottom: 10px;
}

.hbc-card-desc {
  font-size: 12px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.65;
  flex: 1;
  margin-bottom: 20px;
}

.hbc-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 0.5px solid var(--hairline-soft);
  padding-top: 12px;
  gap: 8px;
}
.hbc-card-meta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.02em;
}
.hbc-card-cta {
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-strong);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  flex-shrink: 0;
}
.hbc-card-arrow {
  font-size: 12px;
  transition: transform 0.12s;
  display: inline-block;
}
.hbc-card:hover .hbc-card-arrow { transform: translateX(3px); }

/* Locked overlay */
.hbc-locked-overlay {
  position: absolute;
  inset: 0;
  background: rgba(250,250,248,0.88);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 10;
}
.hbc-lock-icon {
  width: 18px;
  height: 18px;
  color: var(--ink-strong);
  opacity: 0.5;
}
.hbc-lock-badge {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border: 0.5px solid var(--hairline-firm);
  padding: 6px 16px;
  color: var(--ink-strong);
  background: white;
}



/* Empty state */
.hbc-empty {
  text-align: center;
  padding: 64px 40px;
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 52px;
}
.hbc-empty-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 10px;
}
.hbc-empty-desc {
  font-size: 13px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.7;
  margin-bottom: 20px;
}
.hbc-empty-clear {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  background: transparent;
  border: 0.5px solid var(--hairline-firm);
  padding: 7px 16px;
  cursor: pointer;
  font-family: inherit;
  color: var(--ink-strong);
}
.hbc-empty-clear:hover { background: var(--surface-sunken); }

/* ── Questions section ────────────────────────────────────────────────────── */

.hbc-questions {
  border: 0.5px solid var(--hairline-firm);
  margin-bottom: 52px;
}

.hbc-q-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px 32px;
  border-bottom: 0.5px solid var(--hairline-soft);
  gap: 24px;
}
.hbc-q-meta { flex: 1; min-width: 0; }
.hbc-q-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 10px;
  display: block;
}
.hbc-q-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 8px;
  line-height: 1.15;
}
.hbc-q-desc {
  font-size: 13px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.65;
}
.hbc-q-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}
.hbc-q-btn-primary {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  background: var(--action-bg);
  color: var(--action-text);
  border: 0.5px solid var(--action-bg);
  padding: 9px 18px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
}
.hbc-q-btn-primary:hover { background: var(--action-bg-hover); }
.hbc-q-btn-secondary {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  background: transparent;
  color: var(--ink-strong);
  border: 0.5px solid var(--hairline-firm);
  padding: 9px 18px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  white-space: nowrap;
}
.hbc-q-btn-secondary:hover { background: var(--surface-sunken); }

.hbc-q-body {
  display: grid;
  grid-template-columns: 1fr 260px;
}

.hbc-q-list { border-right: 0.5px solid var(--hairline-soft); }

.hbc-q-item {
  display: block;
  padding: 18px 24px;
  border-bottom: 0.5px solid var(--hairline-soft);
  text-decoration: none;
  transition: background 0.1s;
}
.hbc-q-item:last-child { border-bottom: none; }
.hbc-q-item:hover { background: var(--surface-sunken); }

.hbc-q-item-status {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 3px 8px;
  display: inline-block;
  margin-bottom: 8px;
}
.hbc-q-item-status.answered { background: var(--state-correct-surface); color: var(--state-correct-text); }
.hbc-q-item-status.open { background: var(--state-warning-surface); color: var(--state-warning-text); }

.hbc-q-item-title {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--ink-strong);
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}



/* Suggested prompts */
.hbc-prompt-item {
  padding: 18px 24px;
  border-bottom: 0.5px solid var(--hairline-soft);
}
.hbc-prompt-item:last-child { border-bottom: none; }
.hbc-prompt-title {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--ink-strong);
  margin-bottom: 6px;
}
.hbc-prompt-desc {
  font-size: 12px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.55;
  margin-bottom: 10px;
}
.hbc-prompt-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.hbc-prompt-tag {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 0.5px solid var(--hairline-firm);
  padding: 2px 8px;
  color: var(--ink-soft);
}



/* ── Contact bar ──────────────────────────────────────────────────────────── */

.hbc-contact {
  border-top: 0.5px solid var(--hairline-soft);
  padding: 24px 0;
  text-align: center;
  margin-top: 8px;
}
.hbc-contact p {
  font-size: 12px;
  font-weight: 300;
  color: var(--ink-soft);
  margin-bottom: 6px;
}
.hbc-contact a {
  font-size: 12px;
  color: var(--ink-strong);
  text-decoration: underline;
  text-underline-offset: 2px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.hbc-contact a:hover { opacity: 0.7; }

/* ── Responsive ───────────────────────────────────────────────────────────── */

@media (max-width: 1024px) {
  .hbc-briefing { grid-template-columns: 1fr; }
  .hbc-lens-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hbc-pathways { grid-template-columns: repeat(2, 1fr); }
  .hbc-pathway:nth-child(2n) { border-right: none; }
  .hbc-pathway:nth-child(n+3) { border-top: 0.5px solid var(--hairline-firm); }
  .hbc-resources-grid { grid-template-columns: repeat(2, 1fr); }
  .hbc-q-list { border-right: none; border-bottom: 0.5px solid var(--hairline-soft); }
}

@media (max-width: 768px) {
  .hbc-main { padding: 48px 20px 64px; }
  .hbc-briefing-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .hbc-lens-grid { grid-template-columns: 1fr; }
  .hbc-pathways { grid-template-columns: 1fr; }
  .hbc-pathway { border-right: none; border-bottom: 0.5px solid var(--hairline-firm); }
  .hbc-pathway:last-child { border-bottom: none; }
  .hbc-pathway:nth-child(2n) { border-right: none; }
  .hbc-pathway:nth-child(n+3) { border-top: none; }
  .hbc-resources-grid { grid-template-columns: 1fr; }
  .hbc-q-header { flex-direction: column; }
  .hbc-q-actions { flex-direction: row; }
  .hbc-shelf { padding: 18px 20px; }
  .hbc-controls-row { align-items: flex-start; }
}
`;
