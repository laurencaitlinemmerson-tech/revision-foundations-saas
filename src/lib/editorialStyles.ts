export const EDITORIAL_CSS = `

.ed *, .ed *::before, .ed *::after { box-sizing: border-box; }

.ed {
  --ed-paper: #FAFAF8;
  --ed-surface: #FBF8F3;
  --ed-cell: #FFFEFC;
  --ed-ink: #1A1815;
  --ed-body: #5A5750;
  --ed-muted: #9A948C;
  --ed-line: rgba(26, 24, 21, 0.11);
  --ed-soft-line: rgba(26, 24, 21, 0.07);
  --ed-blue: #185FA5;
  --ed-blue-soft: #EAF1FA;
  --ed-green: #1C7A67;
  --ed-green-soft: #E4F2EC;
  --ed-gold: #633806;
  --ed-gold-soft: #FAEEDA;
  --ed-rose: #A14A57;
  --ed-rose-soft: #F9E8EB;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--ed-paper);
  color: var(--ed-ink);
  line-height: 1.6;
  min-height: 100vh;
}

.ed-wrap {
  max-width: 980px;
  margin: 0 auto;
  padding: 40px 40px 110px;
}

.ed-header {
  padding-bottom: 32px;
  margin-bottom: 44px;
  border-bottom: 0.5px solid var(--ed-line);
}

.ed-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 0.5px solid var(--ed-soft-line);
}

.ed-body {
  position: relative;
}

/* Back nav */
.ed-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ed-muted);
  text-decoration: none;
  margin-bottom: 44px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.ed-back:hover { color: var(--ed-body); }

/* Masthead */
.ed-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ed-muted);
  margin-bottom: 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.ed-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(40px, 5.4vw, 58px);
  font-weight: 400;
  line-height: 1.06;
  color: var(--ed-ink);
  margin-bottom: 18px;
  letter-spacing: -0.01em;
  max-width: 760px;
}

.ed-standfirst {
  font-size: 18px;
  font-weight: 300;
  color: var(--ed-body);
  line-height: 1.72;
  max-width: 720px;
  margin-bottom: 0;
}

.ed-byline {
  font-size: 10px;
  color: var(--ed-muted);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Section dividers */
.ed-section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(24px, 3vw, 30px);
  font-weight: 400;
  color: var(--ed-ink);
  margin-bottom: 22px;
  padding-top: 34px;
  margin-top: 54px;
  border-top: 0.5px solid var(--ed-line);
}

/* Content cards */
.ed-card {
  background: var(--ed-surface);
  border: 0.5px solid var(--ed-line);
  border-radius: 0;
  padding: 26px 28px;
  margin-bottom: 20px;
}

.ed-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 400;
  color: var(--ed-ink);
  margin-bottom: 16px;
}

/* Grid layouts */
.ed-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  margin-bottom: 20px;
}

.ed-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.ed-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid var(--ed-line);
  margin-bottom: 20px;
}

.ed-grid-4-cell {
  padding: 18px 16px;
  border-right: 0.5px solid var(--ed-line);
}
.ed-grid-4-cell:last-child { border-right: none; }
.ed-grid-4-cell p {
  margin: 0;
  font-size: 13px;
  color: var(--ed-body);
  line-height: 1.68;
  font-weight: 300;
}

.ed-grid-4-title {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ed-muted);
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid var(--ed-soft-line);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.ed-cell {
  background: var(--ed-cell);
  border: 0.5px solid var(--ed-line);
  border-radius: 0;
  padding: 18px 20px;
}

.ed-cell-title {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--ed-blue);
  font-weight: 400;
  margin-bottom: 12px;
  background: var(--ed-blue-soft);
  padding: 4px 10px;
  border-radius: 999px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.ed-cell p {
  font-size: 13px;
  color: var(--ed-body);
  line-height: 1.68;
  font-weight: 300;
  margin: 0;
}

/* Red flags */
.ed-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ed-rose);
  margin-bottom: 9px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.ed-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 16px;
}

.ed-red-pill {
  font-size: 11px;
  background: var(--ed-rose-soft);
  color: var(--ed-rose);
  padding: 4px 10px;
  border-radius: 0;
  font-weight: 300;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Pearl callouts */
.ed-pearl {
  background: var(--ed-gold-soft);
  padding: 16px 20px;
  border-radius: 0;
  margin-bottom: 16px;
}

.ed-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ed-gold);
  margin-bottom: 7px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.ed-pearl p {
  font-size: 13px;
  color: var(--ed-gold);
  line-height: 1.68;
  font-weight: 300;
  margin: 0;
}

/* Info callout (blue tinted) */
.ed-info {
  background: var(--ed-blue-soft);
  padding: 16px 20px;
  border-radius: 0;
  margin-bottom: 16px;
}

.ed-info-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ed-blue);
  margin-bottom: 7px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.ed-info p, .ed-info li {
  font-size: 13px;
  color: #1f4568;
  line-height: 1.68;
  font-weight: 300;
  margin: 0;
}

/* Numbered/lettered step marker */
.ed-step-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  border-top: 0.5px solid var(--ed-line);
  padding-top: 28px;
  margin-bottom: 36px;
}

.ed-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 20px;
  border-right: 0.5px solid var(--ed-line);
  padding-top: 4px;
}

.ed-step-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 60px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  color: #CBD9E7;
  margin-bottom: 8px;
}

.ed-step-content {
  padding-left: 28px;
}

.ed-step-heading {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: var(--ed-ink);
  margin-bottom: 4px;
}

.ed-step-sub {
  font-size: 12px;
  font-style: italic;
  color: var(--ed-muted);
  margin-bottom: 18px;
}

/* Lists */
.ed-list {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
}

.ed-list li {
  font-size: 13px;
  color: var(--ed-body);
  line-height: 1.68;
  padding: 4px 0 4px 14px;
  position: relative;
  font-weight: 300;
  border-bottom: 0.5px solid var(--ed-soft-line);
}
.ed-list li:last-child { border-bottom: none; }
.ed-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #C7BFB4;
}

/* Mono code / formula */
.ed-mono {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  background: #F3EFE9;
  padding: 10px 14px;
  border-radius: 0;
  margin-bottom: 12px;
  color: var(--ed-gold);
  line-height: 1.5;
}

/* Table */
.ed-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid var(--ed-line);
  margin-bottom: 20px;
  font-size: 13px;
}
.ed-table th {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ed-muted);
  font-weight: 400;
  padding: 11px 14px;
  border-bottom: 0.5px solid var(--ed-line);
  border-right: 0.5px solid var(--ed-soft-line);
  text-align: left;
  background: #F7F3EE;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.ed-table th:last-child { border-right: none; }
.ed-table td {
  padding: 10px 14px;
  font-size: 12px;
  color: var(--ed-body);
  border-bottom: 0.5px solid var(--ed-soft-line);
  border-right: 0.5px solid var(--ed-soft-line);
  font-weight: 300;
}
.ed-table td:last-child { border-right: none; }
.ed-table tr:last-child td { border-bottom: none; }
.ed-table td:first-child { font-weight: 400; color: var(--ed-ink); }

/* Tags / badges */
.ed-tag {
  display: inline-block;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 2px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
}
.ed-tag-free { background: #E8F5E9; color: #2E7D32; }
.ed-tag-premium { background: #FFF3E0; color: #E65100; }

/* Tabs (for interactive pages) */
.ed-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 24px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  padding-bottom: 16px;
}

.ed-tab {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 14px;
  border-radius: 2px;
  border: 0.5px solid transparent;
  cursor: pointer;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  transition: all 0.15s;
}

.ed-tab-active {
  background: var(--ed-ink);
  color: white;
  border-color: var(--ed-ink);
}
.ed-tab-inactive {
  background: white;
  color: var(--ed-body);
  border-color: var(--ed-line);
}
.ed-tab-inactive:hover { border-color: var(--ed-blue); color: var(--ed-blue); }

/* Quiz / interactive */
.ed-quiz-option {
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: 0.5px solid rgba(0,0,0,0.15);
  border-radius: 2px;
  font-size: 13px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  cursor: pointer;
  margin-bottom: 6px;
  background: white;
  color: var(--ed-ink);
  transition: all 0.15s;
}
.ed-quiz-option:hover:not(:disabled) { border-color: var(--ed-blue); background: var(--ed-paper); }
.ed-quiz-correct { background: #E8F5E9 !important; border-color: #2E7D32 !important; color: #1B5E20 !important; }
.ed-quiz-wrong { background: #FCEBEB !important; border-color: #A32D2D !important; color: #A32D2D !important; }

/* Responsive */
@media (max-width: 640px) {
  .ed-wrap { padding: 28px 20px 80px; }
  .ed-headline { font-size: 34px; }
  .ed-standfirst { font-size: 16px; }
  .ed-meta { align-items: flex-start; }
  .ed-grid-2 { grid-template-columns: 1fr; }
  .ed-grid-3 { grid-template-columns: 1fr; }
  .ed-grid-4 { grid-template-columns: repeat(2, 1fr); }
  .ed-step-row { grid-template-columns: 60px 1fr; }
  .ed-step-numeral { font-size: 44px; }
}

/* Semantic badges for editorial pages */
.ed-badge {
  display: inline-block;
  font-size: 9px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 2px;
}
.ed-badge-blue   { background: #E6F1FB; color: #0C447C; }
.ed-badge-teal   { background: #E1F5EE; color: #085041; }
.ed-badge-coral  { background: #FAECE7; color: #712B13; }
.ed-badge-purple { background: #EEEDFE; color: #3C3489; }
.ed-badge-amber  { background: #FAEEDA; color: #633806; }
.ed-badge-red    { background: #FCEBEB; color: #A32D2D; }
.ed-badge-gray   { background: #F1EFE8; color: #444441; }
`;
