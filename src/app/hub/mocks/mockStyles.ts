export const MOCK_PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');

.mk *, .mk *::before, .mk *::after { box-sizing: border-box; box-shadow: none !important; }

.mk {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: #FAFAF8;
  color: #2C2A27;
  line-height: 1.6;
  min-height: 100vh;
}

.mk-wrap {
  max-width: 1180px;
  margin: 0 auto;
  padding: 40px 48px 100px;
}

/* Back nav */
.mk-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
  text-decoration: none;
  margin-bottom: 44px;
}
.mk-back:hover { color: #555; }

/* Masthead */
.mk-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 14px;
}

.mk-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 400;
  line-height: 1.08;
  color: #1A1815;
  margin-bottom: 18px;
  letter-spacing: -0.01em;
}

.mk-standfirst {
  font-size: 16px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.72;
  max-width: 640px;
  margin-bottom: 0;
}

.mk-divider {
  border: none;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  margin: 40px 0;
}

/* ── Body system selector grid ── */
.mk-systems-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 0.5px solid rgba(0,0,0,0.1);
}

.mk-system-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px 24px 24px;
  text-decoration: none;
  border-right: 0.5px solid rgba(0,0,0,0.1);
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  transition: background 0.15s;
  position: relative;
  min-height: 160px;
}
.mk-system-card:nth-child(4n) { border-right: none; }
.mk-system-card:nth-last-child(-n+4) { border-bottom: none; }
.mk-system-card:hover { background: #F5F3F0; }

.mk-system-card-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 48px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  color: #e8e4df;
  position: absolute;
  top: 16px;
  right: 20px;
  pointer-events: none;
  user-select: none;
}

.mk-system-card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #1A1815;
  line-height: 1.2;
  margin-bottom: 8px;
}

.mk-system-card-desc {
  font-size: 12px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.6;
  margin-bottom: 16px;
}

.mk-system-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
}

.mk-system-card-count {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #999;
}

.mk-system-card-arrow {
  font-size: 14px;
  color: #bbb;
  transition: transform 0.15s, color 0.15s;
}
.mk-system-card:hover .mk-system-card-arrow {
  transform: translateX(3px);
  color: #1A1815;
}

.mk-system-card-soon {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #bbb;
  padding: 3px 8px;
  border: 0.5px solid rgba(0,0,0,0.08);
}

/* ── Mock list cards ── */
.mk-list-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border: 0.5px solid rgba(0,0,0,0.1);
}

.mk-list-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px;
  text-decoration: none;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  transition: background 0.15s;
}
.mk-list-card:last-child { border-bottom: none; }
.mk-list-card:hover { background: #F5F3F0; }

.mk-list-card-body {
  flex: 1;
}

.mk-list-card-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 6px;
}

.mk-list-card-desc {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.6;
  max-width: 600px;
}

.mk-list-card-btn {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #FAFAF8;
  background: #1A1815;
  padding: 10px 20px;
  white-space: nowrap;
  text-decoration: none;
  transition: background 0.15s;
  flex-shrink: 0;
}
.mk-list-card-btn:hover { background: #3a2010; }

/* ── Mock exam page ── */

.mk-progress-bar {
  position: sticky;
  top: 68px;
  z-index: 50;
  background: rgba(250,250,248,0.97);
  backdrop-filter: blur(12px);
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  padding: 10px 0;
}

.mk-progress-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.mk-progress-label {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #999;
  white-space: nowrap;
}

.mk-progress-track {
  flex: 1;
  height: 2px;
  background: rgba(0,0,0,0.06);
  position: relative;
}

.mk-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: #1A1815;
  transition: width 0.4s ease;
}

.mk-progress-count {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-style: italic;
  color: #1A1815;
  white-space: nowrap;
}

/* Guidance intro */
.mk-guidance {
  padding: 28px 32px;
  background: #EAF1FA;
  border: 0.5px solid rgba(24,95,165,0.15);
  margin-bottom: 48px;
}

.mk-guidance-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 14px;
}

.mk-guidance-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mk-guidance-list li {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.6;
  padding-left: 16px;
  position: relative;
}
.mk-guidance-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 5px;
  height: 0.5px;
  background: #185FA5;
}

/* Scenario block */
.mk-scenario {
  padding: 32px;
  background: #FBF8F3;
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 48px;
}

.mk-scenario-label {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 16px;
}

.mk-scenario-child {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 4px;
}

.mk-scenario-age {
  font-size: 13px;
  color: #5A5750;
  font-weight: 300;
  margin-bottom: 20px;
}

.mk-scenario-complaint {
  font-size: 14px;
  color: #2C2A27;
  font-weight: 300;
  line-height: 1.65;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.mk-obs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0;
  border: 0.5px solid rgba(0,0,0,0.08);
  margin-bottom: 20px;
}

.mk-obs-item {
  padding: 12px 16px;
  border-right: 0.5px solid rgba(0,0,0,0.08);
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

.mk-obs-label {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 4px;
}

.mk-obs-value {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-style: italic;
  color: #1A1815;
}

.mk-scenario-signs-label {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 10px;
}

.mk-scenario-signs {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.mk-scenario-signs li {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.55;
  padding-left: 14px;
  position: relative;
}
.mk-scenario-signs li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 4px;
  height: 0.5px;
  background: rgba(0,0,0,0.3);
}

.mk-scenario-diagnosis {
  font-size: 13px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 16px;
}

.mk-scenario-family {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.65;
  padding-top: 16px;
  border-top: 0.5px solid rgba(0,0,0,0.08);
}

/* Part label */
.mk-part-label {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 24px;
  padding-bottom: 10px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}

/* Question block */
.mk-question {
  margin-bottom: 48px;
  padding-bottom: 48px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}
.mk-question:last-child { border-bottom: none; }

.mk-q-header {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 0;
  margin-bottom: 20px;
}

.mk-q-numeral {
  font-family: 'Playfair Display', serif;
  font-size: 44px;
  font-style: italic;
  font-weight: 400;
  line-height: 1;
  color: #CBD9E7;
}

.mk-q-meta {
  padding-top: 4px;
}

.mk-q-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 4px;
}

.mk-q-word-guide {
  font-size: 11px;
  color: #999;
  font-weight: 300;
}

.mk-q-prompt {
  font-size: 14px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.72;
  margin-bottom: 24px;
  max-width: 720px;
}

/* Expandable guidance panels */
.mk-expand-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px 14px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5A5750;
  border: 0.5px solid rgba(0,0,0,0.08);
  transition: background 0.15s, border-color 0.15s;
  width: 100%;
  text-align: left;
}
.mk-expand-trigger:hover {
  background: #F5F3F0;
  border-color: rgba(0,0,0,0.14);
}

.mk-expand-trigger[aria-expanded="true"] {
  border-bottom: none;
}

.mk-expand-chevron {
  font-size: 10px;
  transition: transform 0.2s;
  font-style: normal;
  flex-shrink: 0;
}
.mk-expand-trigger[aria-expanded="true"] .mk-expand-chevron {
  transform: rotate(90deg);
}

.mk-expand-body {
  padding: 16px;
  border: 0.5px solid rgba(0,0,0,0.08);
  border-top: none;
  margin-bottom: 10px;
}

.mk-expand-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mk-expand-list li {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.55;
  padding-left: 14px;
  position: relative;
}
.mk-expand-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 4px;
  height: 0.5px;
  background: rgba(0,0,0,0.3);
}

/* To score highly panel — blue tint */
.mk-score-body {
  background: #EAF1FA;
  border-color: rgba(24,95,165,0.12);
}
.mk-score-body li::before { background: #185FA5; }

/* Think about panel — gold tint */
.mk-think-body {
  background: #FAEEDA;
  border-color: rgba(99,56,6,0.12);
}
.mk-think-body li::before { background: #633806; }

/* Revision links */
.mk-revision-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.mk-revision-link {
  font-size: 11px;
  color: #185FA5;
  text-decoration: none;
  padding: 5px 12px;
  border: 0.5px solid rgba(24,95,165,0.2);
  background: rgba(234,241,250,0.4);
  transition: background 0.15s, border-color 0.15s;
}
.mk-revision-link:hover {
  background: #EAF1FA;
  border-color: rgba(24,95,165,0.35);
}

/* Answer structure reveal */
.mk-reveal-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5A5750;
  background: none;
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 12px;
}
.mk-reveal-btn:hover { background: #F5F3F0; }

.mk-reveal-body {
  padding: 16px;
  background: #E4F2EC;
  border: 0.5px solid rgba(28,122,103,0.12);
  margin-top: 10px;
}

.mk-reveal-body ol {
  margin: 0;
  padding: 0 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mk-reveal-body li {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.55;
}

/* Answer input area */
.mk-answer-wrap {
  margin-top: 24px;
}

.mk-answer-label {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 8px;
}

.mk-answer-textarea {
  width: 100%;
  min-height: 160px;
  padding: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.72;
  background: #fff;
  border: 0.5px solid rgba(0,0,0,0.12);
  border-radius: 0;
  outline: none;
  resize: vertical;
  transition: border-color 0.15s;
}
.mk-answer-textarea:focus {
  border-color: rgba(0,0,0,0.28);
}
.mk-answer-textarea::placeholder {
  color: #bbb;
  font-weight: 300;
}

.mk-answer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.mk-word-count {
  font-size: 11px;
  color: #999;
  font-weight: 300;
}

.mk-autosave {
  font-size: 10px;
  color: #bbb;
  font-style: italic;
}

/* Sentence bank */
.mk-sentences {
  margin-top: 48px;
}

.mk-sentence-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 0.5px solid rgba(0,0,0,0.1);
}

.mk-sentence-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}
.mk-sentence-item:last-child { border-bottom: none; }

.mk-sentence-text {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.6;
  flex: 1;
}

.mk-sentence-copy {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #999;
  background: none;
  border: 0.5px solid rgba(0,0,0,0.08);
  padding: 4px 10px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
.mk-sentence-copy:hover {
  background: #F5F3F0;
  color: #5A5750;
}

/* Post-mock analysis */
.mk-post {
  margin-top: 48px;
  padding-top: 48px;
  border-top: 0.5px solid rgba(0,0,0,0.1);
}

.mk-post-section {
  margin-bottom: 36px;
}

.mk-post-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 14px;
}

.mk-post-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mk-post-list li {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.6;
  padding-left: 16px;
  position: relative;
}
.mk-post-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 5px;
  height: 0.5px;
  background: rgba(0,0,0,0.3);
}

/* First-class section — green tint */
.mk-first-body {
  padding: 24px 28px;
  background: #E4F2EC;
  border: 0.5px solid rgba(28,122,103,0.12);
}
.mk-first-body li::before { background: #1C7A67; }

/* Mistakes section — rose tint */
.mk-mistakes-body {
  padding: 24px 28px;
  background: #F9E8EB;
  border: 0.5px solid rgba(161,74,87,0.12);
}
.mk-mistakes-body li::before { background: #A14A57; }

/* Completion state */
.mk-complete {
  padding: 40px 32px;
  background: linear-gradient(135deg, rgba(228,242,236,0.5) 0%, rgba(250,250,248,0.6) 100%);
  border: 0.5px solid rgba(28,122,103,0.15);
  text-align: center;
  margin-top: 48px;
}

.mk-complete-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 28px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 10px;
}

.mk-complete-desc {
  font-size: 14px;
  font-weight: 300;
  color: #5A5750;
  margin-bottom: 24px;
}

.mk-complete-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.mk-complete-btn-primary {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #FAFAF8;
  background: #1A1815;
  padding: 10px 20px;
  text-decoration: none;
  transition: background 0.15s;
}
.mk-complete-btn-primary:hover { background: #3a2010; }

.mk-complete-btn-secondary {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5A5750;
  background: white;
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 10px 20px;
  text-decoration: none;
  transition: background 0.15s;
}
.mk-complete-btn-secondary:hover { background: #F5F3F0; }

/* Section titles */
.mk-section-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 18px;
}

/* Responsive */
@media (max-width: 980px) {
  .mk-systems-grid { grid-template-columns: repeat(2, 1fr); }
  .mk-system-card:nth-child(2n) { border-right: none; }
  .mk-system-card:nth-child(4n) { border-right: 0.5px solid rgba(0,0,0,0.1); }
  .mk-system-card:nth-last-child(-n+4) { border-bottom: 0.5px solid rgba(0,0,0,0.1); }
  .mk-system-card:nth-last-child(-n+2) { border-bottom: none; }
}

@media (max-width: 768px) {
  .mk-wrap { padding: 32px 20px 80px; }
  .mk-progress-inner { padding: 0 20px; }
  .mk-scenario { padding: 24px 20px; }
  .mk-guidance { padding: 24px 20px; }
  .mk-q-header { grid-template-columns: 40px 1fr; }
  .mk-q-numeral { font-size: 32px; }
  .mk-obs-grid { grid-template-columns: repeat(2, 1fr); }
  .mk-list-card { flex-direction: column; align-items: flex-start; gap: 16px; padding: 24px 20px; }
}

@media (max-width: 560px) {
  .mk-systems-grid { grid-template-columns: 1fr; }
  .mk-system-card { border-right: none !important; }
  .mk-system-card { border-bottom: 0.5px solid rgba(0,0,0,0.1) !important; }
  .mk-system-card:last-child { border-bottom: none !important; }
  .mk-complete-actions { flex-direction: column; align-items: stretch; }
}
`;
