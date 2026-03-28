export const EDITORIAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;1,8..60,300;1,8..60,400&display=swap');

.ed *, .ed *::before, .ed *::after { box-sizing: border-box; }

.ed {
  font-family: 'Source Serif 4', Georgia, serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.ed-wrap {
  max-width: 820px;
  margin: 0 auto;
  padding: 40px 32px 100px;
}

/* Back nav */
.ed-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
  text-decoration: none;
  margin-bottom: 44px;
  font-family: 'Source Serif 4', Georgia, serif;
}
.ed-back:hover { color: #555; }

/* Masthead */
.ed-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
  font-family: 'Source Serif 4', Georgia, serif;
}

.ed-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 400;
  line-height: 1.1;
  color: #1A1815;
  margin-bottom: 20px;
  letter-spacing: -0.01em;
}

.ed-standfirst {
  font-size: 16px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.68;
  max-width: 640px;
  margin-bottom: 14px;
}

.ed-byline {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 32px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 48px;
  font-family: 'Source Serif 4', Georgia, serif;
}

/* Section dividers */
.ed-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 18px;
  padding-top: 32px;
  margin-top: 48px;
  padding-bottom: 14px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
}

/* Content cards */
.ed-card {
  background: #F5F2EE;
  border: 0.5px solid rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 24px 28px;
  margin-bottom: 18px;
}

.ed-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 16px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 14px;
}

/* Grid layouts */
.ed-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 18px;
}

.ed-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}

.ed-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 18px;
}

.ed-grid-4-cell {
  padding: 18px 16px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
}
.ed-grid-4-cell:last-child { border-right: none; }

.ed-grid-4-title {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  font-family: 'Source Serif 4', serif;
}

.ed-cell {
  background: white;
  border: 0.5px solid rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 16px 18px;
}

.ed-cell-title {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #301906;
  font-weight: 400;
  margin-bottom: 8px;
  font-family: 'Source Serif 4', serif;
}

.ed-cell p {
  font-size: 13px;
  color: #5A5750;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Red flags */
.ed-redflags-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 7px;
  font-family: 'Source Serif 4', serif;
}

.ed-redflags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 14px;
}

.ed-red-pill {
  font-size: 11px;
  background: #FCEBEB;
  color: #A32D2D;
  padding: 3px 9px;
  border-radius: 2px;
  font-weight: 300;
  font-family: 'Source Serif 4', serif;
}

/* Pearl callouts */
.ed-pearl {
  background: #FAEEDA;
  padding: 14px 18px;
  border-radius: 0;
  margin-bottom: 14px;
}

.ed-pearl-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 6px;
  font-family: 'Source Serif 4', serif;
}

.ed-pearl p {
  font-size: 13px;
  color: #633806;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Info callout (blue tinted) */
.ed-info {
  background: #EEF3FA;
  padding: 14px 18px;
  border-radius: 0;
  margin-bottom: 14px;
}

.ed-info-label {
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #185FA5;
  margin-bottom: 6px;
  font-family: 'Source Serif 4', serif;
}

.ed-info p, .ed-info li {
  font-size: 13px;
  color: #1a3a5c;
  line-height: 1.6;
  font-weight: 300;
  margin: 0;
}

/* Numbered/lettered step marker */
.ed-step-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 28px;
  margin-bottom: 36px;
}

.ed-step-sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 20px;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  padding-top: 4px;
}

.ed-step-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 60px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  color: #c8c4be;
  margin-bottom: 8px;
}

.ed-step-content {
  padding-left: 28px;
}

.ed-step-heading {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 4px;
}

.ed-step-sub {
  font-size: 12px;
  font-style: italic;
  color: #999;
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
  color: #5A5750;
  line-height: 1.6;
  padding: 4px 0 4px 14px;
  position: relative;
  font-weight: 300;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
}
.ed-list li:last-child { border-bottom: none; }
.ed-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #ccc;
}

/* Mono code / formula */
.ed-mono {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  background: #F0EDE8;
  padding: 10px 14px;
  border-radius: 4px;
  margin-bottom: 12px;
  color: #301906;
  line-height: 1.5;
}

/* Table */
.ed-table {
  width: 100%;
  border-collapse: collapse;
  border: 0.5px solid rgba(0,0,0,0.12);
  margin-bottom: 18px;
  font-size: 13px;
}
.ed-table th {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  font-weight: 400;
  padding: 10px 14px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  border-right: 0.5px solid rgba(0,0,0,0.1);
  text-align: left;
  background: #F5F3F0;
  font-family: 'Source Serif 4', serif;
}
.ed-table th:last-child { border-right: none; }
.ed-table td {
  padding: 9px 14px;
  font-size: 12px;
  color: #555;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  border-right: 0.5px solid rgba(0,0,0,0.08);
  font-weight: 300;
}
.ed-table td:last-child { border-right: none; }
.ed-table tr:last-child td { border-bottom: none; }
.ed-table td:first-child { font-weight: 400; color: #2C2A27; }

/* Tags / badges */
.ed-tag {
  display: inline-block;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 2px;
  font-family: 'Source Serif 4', serif;
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
  font-family: 'Source Serif 4', serif;
  transition: all 0.15s;
}

.ed-tab-active {
  background: #301906;
  color: white;
  border-color: #301906;
}
.ed-tab-inactive {
  background: white;
  color: #5A5750;
  border-color: rgba(0,0,0,0.12);
}
.ed-tab-inactive:hover { border-color: #301906; color: #301906; }

/* Quiz / interactive */
.ed-quiz-option {
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: 0.5px solid rgba(0,0,0,0.15);
  border-radius: 2px;
  font-size: 13px;
  font-family: 'Source Serif 4', serif;
  font-weight: 300;
  cursor: pointer;
  margin-bottom: 6px;
  background: white;
  color: #2C2A27;
  transition: all 0.15s;
}
.ed-quiz-option:hover:not(:disabled) { border-color: #301906; background: #FAFAF8; }
.ed-quiz-correct { background: #E8F5E9 !important; border-color: #2E7D32 !important; color: #1B5E20 !important; }
.ed-quiz-wrong { background: #FCEBEB !important; border-color: #A32D2D !important; color: #A32D2D !important; }

/* Responsive */
@media (max-width: 640px) {
  .ed-wrap { padding: 28px 20px 80px; }
  .ed-headline { font-size: 32px; }
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
  font-family: 'Source Serif 4', serif;
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
