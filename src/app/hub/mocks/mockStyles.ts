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

/* ── How to approach ── */
.mk-approach {
  padding: 20px 24px;
  background: #F5F3F0;
  border: 0.5px solid rgba(0,0,0,0.08);
  margin-bottom: 16px;
}
.mk-approach-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #633806;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.mk-approach-label::before { content: '🧠'; font-size: 12px; }
.mk-approach p {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.6;
  margin: 0 0 10px;
}
.mk-approach p:last-child { margin-bottom: 0; }
.mk-approach-command {
  font-size: 12px;
  font-weight: 400;
  color: #633806;
  background: #FAEEDA;
  padding: 8px 12px;
  margin-bottom: 12px;
}
.mk-approach-musts-label {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 8px;
}

/* ── Examiner insight ── */
.mk-examiner {
  padding: 20px 24px;
  background: rgba(83,74,183,0.04);
  border: 0.5px solid rgba(83,74,183,0.12);
  margin-bottom: 16px;
}
.mk-examiner-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #534AB7;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.mk-examiner-label::before { content: '🔍'; font-size: 12px; }
.mk-examiner-sub {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 4px;
}
.mk-examiner p {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.6;
  margin: 0 0 14px;
}
.mk-examiner p:last-child { margin-bottom: 0; }

/* ── Clinical reasoning chain ── */
.mk-reasoning {
  padding: 16px 20px;
  background: #E4F2EC;
  border: 0.5px solid rgba(28,122,103,0.12);
  margin-bottom: 16px;
}
.mk-reasoning-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #1C7A67;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.mk-reasoning-label::before { content: '🧠'; font-size: 12px; }
.mk-reasoning p {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.7;
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ── Low-mark answer warning ── */
.mk-lowmark {
  padding: 16px 20px;
  background: rgba(161,74,87,0.05);
  border: 0.5px solid rgba(161,74,87,0.12);
  margin-bottom: 16px;
}
.mk-lowmark-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A14A57;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.mk-lowmark-label::before { content: '🚫'; font-size: 12px; }
.mk-lowmark p {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
}

/* ── Deterioration panel ── */
.mk-deterioration {
  padding: 20px 24px;
  background: #FCEBEB;
  border: 0.5px solid rgba(163,45,45,0.15);
  margin-bottom: 16px;
}
.mk-deterioration-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.mk-deterioration-label::before { content: '⚡'; font-size: 12px; }
.mk-deterioration-row {
  margin-bottom: 10px;
}
.mk-deterioration-row:last-child { margin-bottom: 0; }
.mk-deterioration-sub {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #A32D2D;
  margin-bottom: 3px;
}
.mk-deterioration p {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.6;
  margin: 0;
}

/* ── Part A progression ── */
.mk-progression {
  padding: 24px 28px;
  background: #F5F3F0;
  border: 0.5px solid rgba(0,0,0,0.08);
  margin-bottom: 24px;
}
.mk-progression-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.mk-progression-label::before { content: '🧠'; font-size: 12px; }

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
  .mk-steps-inner { padding: 0 16px; }
  .mk-step-dot { width: 24px; height: 24px; font-size: 9px; }
  .mk-scenario { padding: 24px 20px; }
  .mk-guidance { padding: 24px 20px; }
  .mk-q-header { grid-template-columns: 40px 1fr; }
  .mk-q-numeral { font-size: 32px; }
  .mk-obs-grid { grid-template-columns: repeat(2, 1fr); }
  .mk-list-card { flex-direction: column; align-items: flex-start; gap: 16px; padding: 24px 20px; }
  .mk-flow-step { max-width: 100%; }
  .mk-summary-stats { grid-template-columns: repeat(2, 1fr); }
  .mk-summary-stat { border-bottom: 0.5px solid rgba(0,0,0,0.08); }
  .mk-step-nav { flex-direction: column; gap: 12px; align-items: stretch; text-align: center; }
}

@media (max-width: 560px) {
  .mk-systems-grid { grid-template-columns: 1fr; }
  .mk-system-card { border-right: none !important; }
  .mk-system-card { border-bottom: 0.5px solid rgba(0,0,0,0.1) !important; }
  .mk-system-card:last-child { border-bottom: none !important; }
  .mk-complete-actions { flex-direction: column; align-items: stretch; }
  .mk-step-dot { width: 20px; height: 20px; font-size: 8px; }
}
`;

export const MOCK_INTERACTIVE_CSS = `
/* Step tracker */
.mk-steps { position: sticky; top: 68px; z-index: 50; background: rgba(250,250,248,0.97); backdrop-filter: blur(12px); border-bottom: 0.5px solid rgba(0,0,0,0.08); padding: 14px 0; }
.mk-steps-inner { max-width: 1180px; margin: 0 auto; padding: 0 48px; display: flex; align-items: center; gap: 0; }
.mk-step { display: flex; align-items: center; gap: 0; flex: 1; }
.mk-step:last-child { flex: 0; }
.mk-step-dot { width: 28px; height: 28px; border: 1.5px solid #e8e4df; background: #FAFAF8; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 400; color: #bbb; cursor: default; transition: border-color 0.3s ease, background 0.3s ease; flex-shrink: 0; }
.mk-step-dot[data-state="completed"] { background: #1A1815; border-color: #1A1815; color: #FAFAF8; cursor: pointer; }
.mk-step-dot[data-state="current"] { border-color: #1A1815; color: #1A1815; font-weight: 500; }
.mk-step-dot[data-state="future"] { opacity: 0.5; }
.mk-step-line { flex: 1; height: 1px; background: #e8e4df; transition: background 0.3s ease; }
.mk-step-line[data-filled="true"] { background: #1A1815; }

/* Step navigation */
.mk-step-nav { display: flex; align-items: center; justify-content: space-between; padding-top: 32px; margin-top: 32px; border-top: 0.5px solid rgba(0,0,0,0.08); }
.mk-step-nav-prev { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #999; background: none; border: none; cursor: pointer; padding: 8px 0; font-family: 'Inter', -apple-system, sans-serif; transition: color 0.15s; }
.mk-step-nav-prev:hover { color: #5A5750; }
.mk-step-nav-next { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #FAFAF8; background: #1A1815; border: none; cursor: pointer; padding: 12px 24px; font-family: 'Inter', -apple-system, sans-serif; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s; }
.mk-step-nav-next:hover { background: #3a2010; }
.mk-step-nav-next:disabled { opacity: 0.35; cursor: not-allowed; }

/* Attempt-first gating */
.mk-gate { margin-top: 20px; padding: 16px 20px; background: #F5F3F0; border: 0.5px solid rgba(0,0,0,0.08); text-align: center; }
.mk-gate-hint { font-size: 12px; color: #999; font-weight: 300; margin-bottom: 12px; }
.mk-unlock-btn { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; padding: 10px 20px; border: 0.5px solid rgba(0,0,0,0.12); background: white; color: #5A5750; cursor: pointer; font-family: 'Inter', -apple-system, sans-serif; transition: all 0.3s ease; }
.mk-unlock-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.mk-unlock-btn:not(:disabled):hover { background: #1A1815; color: #FAFAF8; border-color: #1A1815; }
.mk-unlock-btn[data-ready="true"] { animation: mk-glow 2s ease-in-out 1; }
@keyframes mk-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(26,24,21,0); } 50% { box-shadow: 0 0 0 8px rgba(26,24,21,0.06); } }

/* Guidance fade-in */
.mk-guidance-layer { animation: mk-fadeIn 0.25s ease-out; }
@keyframes mk-fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* Clinical reasoning flow diagram */
.mk-flow { padding: 20px; background: #E4F2EC; border: 0.5px solid rgba(28,122,103,0.12); margin-bottom: 16px; }
.mk-flow-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #1C7A67; margin-bottom: 16px; }
.mk-flow-chain { display: flex; flex-direction: column; align-items: center; gap: 0; }
.mk-flow-step { width: 100%; max-width: 480px; padding: 10px 16px; background: white; border: 0.5px solid rgba(28,122,103,0.15); border-left: 3px solid #1C7A67; font-size: 13px; font-weight: 300; color: #2C2A27; line-height: 1.5; }
.mk-flow-arrow { color: #1C7A67; font-size: 16px; line-height: 1; padding: 4px 0; user-select: none; }

/* Self-mark checklist */
.mk-selfmark { padding: 24px; background: #F5F3F0; border: 0.5px solid rgba(0,0,0,0.08); margin-top: 20px; animation: mk-fadeIn 0.25s ease-out; }
.mk-selfmark-title { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #999; margin-bottom: 14px; }
.mk-selfmark-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.mk-selfmark-item { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.mk-selfmark-item input[type="checkbox"] { margin-top: 2px; accent-color: #1C7A67; width: 15px; height: 15px; flex-shrink: 0; }
.mk-selfmark-item label { font-size: 13px; font-weight: 300; color: #2C2A27; line-height: 1.5; cursor: pointer; }
.mk-selfmark-score { display: inline-block; padding: 6px 14px; font-size: 11px; letter-spacing: 0.08em; font-weight: 400; border: 0.5px solid; animation: mk-fadeIn 0.2s ease-out; }
.mk-selfmark-score[data-grade="pass"] { color: #A14A57; border-color: rgba(161,74,87,0.2); background: rgba(161,74,87,0.05); }
.mk-selfmark-score[data-grade="2:1"] { color: #633806; border-color: rgba(99,56,6,0.2); background: rgba(99,56,6,0.05); }
.mk-selfmark-score[data-grade="first"] { color: #1C7A67; border-color: rgba(28,122,103,0.2); background: rgba(28,122,103,0.05); }

/* Priority stack */
.mk-priority { margin-bottom: 16px; }
.mk-priority-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #999; margin-bottom: 10px; }
.mk-priority-list { display: flex; flex-direction: column; gap: 0; border: 0.5px solid rgba(0,0,0,0.08); }
.mk-priority-item { display: flex; align-items: center; gap: 14px; padding: 12px 16px; border-bottom: 0.5px solid rgba(0,0,0,0.06); font-size: 13px; font-weight: 300; color: #2C2A27; line-height: 1.45; }
.mk-priority-item:last-child { border-bottom: none; }
.mk-priority-item:nth-child(1) { background: #FCEBEB; font-weight: 400; }
.mk-priority-item:nth-child(2) { background: rgba(252,235,235,0.5); }
.mk-priority-item:nth-child(3) { background: rgba(245,243,240,0.8); }
.mk-priority-item:nth-child(n+4) { background: #FAFAF8; }
.mk-priority-num { font-family: 'Playfair Display', serif; font-size: 18px; font-style: italic; color: #A32D2D; min-width: 20px; text-align: center; flex-shrink: 0; }
.mk-priority-item:nth-child(n+3) .mk-priority-num { color: #999; }

/* Deterioration toggle */
.mk-deter-toggle { display: flex; align-items: center; gap: 8px; width: 100%; font-family: 'Inter', -apple-system, sans-serif; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #A32D2D; background: none; border: 0.5px solid rgba(163,45,45,0.15); padding: 10px 14px; cursor: pointer; text-align: left; transition: background 0.15s; margin-bottom: 10px; }
.mk-deter-toggle:hover { background: rgba(163,45,45,0.03); }
.mk-deter-response-wrap { margin-top: 12px; padding: 16px; background: rgba(163,45,45,0.03); border: 0.5px solid rgba(163,45,45,0.1); }
.mk-deter-response-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #A32D2D; margin-bottom: 8px; }
.mk-deter-response-textarea { width: 100%; min-height: 80px; padding: 12px; font-family: 'Inter', -apple-system, sans-serif; font-size: 13px; font-weight: 300; color: #2C2A27; line-height: 1.6; background: #fff; border: 0.5px solid rgba(0,0,0,0.12); border-radius: 0; outline: none; resize: vertical; }
.mk-deter-response-textarea:focus { border-color: rgba(163,45,45,0.3); }

/* Part B transition */
.mk-transition { padding: 32px; background: linear-gradient(135deg, rgba(234,241,250,0.4) 0%, rgba(250,250,248,0.6) 100%); border: 0.5px solid rgba(24,95,165,0.12); margin-bottom: 24px; text-align: center; }
.mk-transition-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #185FA5; margin-bottom: 12px; }
.mk-transition-text { font-size: 14px; font-weight: 300; color: #2C2A27; line-height: 1.7; max-width: 560px; margin: 0 auto; font-style: italic; }

/* Parent perspective callout */
.mk-perspective { padding: 20px 24px; background: #FAEEDA; border: 0.5px solid rgba(99,56,6,0.12); border-left: 3px solid #633806; margin-bottom: 16px; font-style: italic; }
.mk-perspective-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: #633806; margin-bottom: 6px; font-style: normal; }
.mk-perspective p { font-size: 13px; font-weight: 300; color: #2C2A27; line-height: 1.65; margin: 0; }

/* Timer */
.mk-timer { font-size: 11px; color: #bbb; font-weight: 300; font-style: italic; }

/* Word count enhanced */
.mk-word-count[data-near="true"] { color: #1C7A67; transition: color 0.3s; }

/* Summary card */
.mk-summary { padding: 32px; background: linear-gradient(135deg, rgba(228,242,236,0.3) 0%, rgba(250,250,248,0.5) 100%); border: 0.5px solid rgba(28,122,103,0.12); margin-bottom: 36px; }
.mk-summary-title { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 400; color: #1A1815; margin-bottom: 18px; }
.mk-summary-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0; border: 0.5px solid rgba(0,0,0,0.08); }
.mk-summary-stat { padding: 14px 18px; border-right: 0.5px solid rgba(0,0,0,0.08); }
.mk-summary-stat:last-child { border-right: none; }
.mk-summary-stat-num { font-family: 'Playfair Display', serif; font-size: 24px; font-style: italic; color: #1A1815; line-height: 1; margin-bottom: 4px; }
.mk-summary-stat-label { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #999; }

/* Scenario read note */
.mk-read-note { font-size: 13px; font-weight: 300; color: #5A5750; line-height: 1.65; font-style: italic; margin-top: 20px; padding-top: 16px; border-top: 0.5px solid rgba(0,0,0,0.06); }

/* Mark my answer button */
.mk-mark-btn { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #5A5750; background: none; border: 0.5px solid rgba(0,0,0,0.1); padding: 8px 14px; cursor: pointer; font-family: 'Inter', -apple-system, sans-serif; transition: background 0.15s; margin-top: 16px; }
.mk-mark-btn:hover { background: #F5F3F0; }

@media (max-width: 768px) {
  .mk-steps-inner { padding: 0 16px; }
  .mk-step-dot { width: 24px; height: 24px; font-size: 9px; }
  .mk-flow-step { max-width: 100%; }
  .mk-summary-stats { grid-template-columns: repeat(2, 1fr); }
  .mk-summary-stat { border-bottom: 0.5px solid rgba(0,0,0,0.08); }
  .mk-step-nav { flex-direction: column; gap: 12px; align-items: stretch; text-align: center; }
}
@media (max-width: 560px) {
  .mk-step-dot { width: 20px; height: 20px; font-size: 8px; }
}

/* ═══════════════════════════════════════════════════════════════════════
   PHASE 1 — PREMIUM INTRO REDESIGN
   ═══════════════════════════════════════════════════════════════════════ */

/* Metadata chips */
.mk-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
.mk-chip {
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 5px 12px; border: 0.5px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.8); color: #5A5750;
}
.mk-chip[data-accent="blue"] { border-color: rgba(24,95,165,0.2); color: #185FA5; background: rgba(234,241,250,0.5); }
.mk-chip[data-accent="sage"] { border-color: rgba(28,122,103,0.2); color: #1C7A67; background: rgba(228,242,236,0.5); }
.mk-chip[data-accent="warm"] { border-color: rgba(153,60,29,0.2); color: #993C1D; background: rgba(255,243,232,0.5); }

/* Intro stats row */
.mk-intro-stats {
  display: flex; flex-wrap: wrap; gap: 28px; align-items: center;
  padding: 20px 0; border-top: 0.5px solid rgba(0,0,0,0.08);
  border-bottom: 0.5px solid rgba(0,0,0,0.08); margin-bottom: 36px;
}
.mk-intro-stat-num {
  font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic;
  font-weight: 400; color: #1A1815; line-height: 1;
}
.mk-intro-stat-label {
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #999; margin-top: 4px;
}

/* Scenario card grid */
.mk-scenario-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0;
  border: 0.5px solid rgba(0,0,0,0.1); margin-bottom: 32px;
}
.mk-scenario-card {
  padding: 24px 28px; border-right: 0.5px solid rgba(0,0,0,0.08);
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
}
.mk-scenario-card:nth-child(2n) { border-right: none; }
.mk-scenario-card:nth-last-child(-n+2) { border-bottom: none; }
.mk-scenario-card-label {
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #999; margin-bottom: 12px;
}
.mk-scenario-card--full {
  grid-column: 1 / -1; border-right: none !important;
  border-bottom: none !important;
}

/* Obs highlight */
.mk-obs-item[data-abnormal="true"] { background: rgba(153,60,29,0.04); }
.mk-obs-item[data-abnormal="true"] .mk-obs-value { color: #993C1D; }

/* Skills pills */
.mk-skills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
.mk-skill-pill {
  font-size: 11px; font-weight: 300; color: #2C2A27;
  padding: 6px 14px; border: 0.5px solid rgba(0,0,0,0.1);
  background: #FAFAF8;
}

/* "What strong answers do" */
.mk-strong-answers {
  padding: 28px 32px; background: linear-gradient(135deg, rgba(228,242,236,0.2) 0%, rgba(250,250,248,0.95) 100%);
  border: 0.5px solid rgba(28,122,103,0.12); margin-bottom: 32px;
}
.mk-strong-answers-title {
  font-family: 'Playfair Display', Georgia, serif; font-size: 18px;
  font-weight: 400; color: #1A1815; margin-bottom: 14px;
}

/* Primary CTA */
.mk-begin-cta {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 13px; letter-spacing: 0.04em; color: #FAFAF8;
  background: #1A1815;
  padding: 14px 32px; border: none; cursor: pointer; text-decoration: none;
  transition: opacity 0.2s;
  font-family: 'Inter', -apple-system, sans-serif;
}
.mk-begin-cta:hover { opacity: 0.85; }

/* ═══════════════════════════════════════════════════════════════════════
   PHASE 2 — SPLIT-SCREEN QUESTION UX
   ═══════════════════════════════════════════════════════════════════════ */

/* Split layout */
.mk-split {
  display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 0;
  min-height: 60vh;
}

/* Sticky scenario sidebar */
.mk-sidebar {
  position: sticky; top: 108px; max-height: calc(100vh - 120px);
  overflow-y: auto; padding: 24px 24px 24px 0;
  border-right: 0.5px solid rgba(0,0,0,0.08);
  scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.08) transparent;
}
.mk-sidebar::-webkit-scrollbar { width: 3px; }
.mk-sidebar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); }

.mk-sidebar-label {
  font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #999; margin-bottom: 12px;
}
.mk-sidebar-child {
  font-family: 'Playfair Display', serif; font-size: 18px;
  font-weight: 400; color: #1A1815; margin-bottom: 2px;
}
.mk-sidebar-age { font-size: 12px; color: #5A5750; margin-bottom: 12px; }
.mk-sidebar-complaint {
  font-size: 12px; font-weight: 300; color: #2C2A27; line-height: 1.65;
  margin-bottom: 16px; padding-bottom: 14px; border-bottom: 0.5px solid rgba(0,0,0,0.06);
}

/* Sidebar mini obs */
.mk-sidebar-obs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.mk-sidebar-obs-item { padding: 8px 10px; background: rgba(0,0,0,0.02); }
.mk-sidebar-obs-item[data-abnormal="true"] { background: rgba(153,60,29,0.05); }
.mk-sidebar-obs-label { font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase; color: #999; margin-bottom: 2px; }
.mk-sidebar-obs-value { font-family: 'Playfair Display', serif; font-size: 14px; font-style: italic; color: #1A1815; }
.mk-sidebar-obs-item[data-abnormal="true"] .mk-sidebar-obs-value { color: #993C1D; }

.mk-sidebar-signs { font-size: 11px; font-weight: 300; color: #5A5750; line-height: 1.6; margin-bottom: 14px; }
.mk-sidebar-diagnosis { font-size: 12px; font-weight: 400; color: #1A1815; padding-top: 14px; border-top: 0.5px solid rgba(0,0,0,0.06); }

/* Right panel */
.mk-main-panel { padding: 24px 0 24px 36px; }

/* Word count bar */
.mk-word-bar { height: 3px; background: rgba(0,0,0,0.04); margin-top: 6px; }
.mk-word-bar-fill { height: 100%; background: #8BBCAA; transition: width 0.3s ease; }
.mk-word-bar-fill[data-over="true"] { background: #D4A574; }

/* Mobile scenario toggle */
.mk-scenario-fab {
  display: none; position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 100; padding: 10px 20px; font-size: 12px; letter-spacing: 0.08em;
  color: #FAFAF8; background: rgba(26,24,21,0.92);
  border: none; cursor: pointer; font-family: 'Inter', -apple-system, sans-serif;
}

/* Mobile scenario sheet */
.mk-scenario-sheet {
  display: none; position: fixed; bottom: 0; left: 0; right: 0;
  z-index: 200; max-height: 75vh; overflow-y: auto;
  background: #FAFAF8; border-top: 0.5px solid rgba(0,0,0,0.1);
  padding: 24px 24px 32px;
}
.mk-scenario-sheet[data-open="true"] { display: block; }
.mk-scenario-sheet-close {
  display: flex; align-items: center; justify-content: center;
  width: 100%; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  color: #5A5750; background: none; border: 0.5px solid rgba(0,0,0,0.1);
  padding: 10px; cursor: pointer; margin-bottom: 16px;
  font-family: 'Inter', -apple-system, sans-serif;
}
.mk-sheet-overlay {
  display: none; position: fixed; inset: 0; z-index: 199;
  background: rgba(0,0,0,0.3); backdrop-filter: blur(4px);
}
.mk-sheet-overlay[data-open="true"] { display: block; }

/* Question flag button */
.mk-flag-btn {
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  color: #999; background: none; border: 0.5px solid rgba(0,0,0,0.08);
  padding: 4px 10px; cursor: pointer; transition: all 0.15s;
  font-family: 'Inter', -apple-system, sans-serif;
}
.mk-flag-btn:hover { border-color: rgba(0,0,0,0.15); color: #5A5750; }
.mk-flag-btn[data-flagged="true"] { border-color: rgba(212,165,116,0.4); color: #D4A574; background: rgba(212,165,116,0.06); }

/* ═══════════════════════════════════════════════════════════════════════
   PHASE 3 — PREMIUM REVIEW
   ═══════════════════════════════════════════════════════════════════════ */

.mk-review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 0.5px solid rgba(0,0,0,0.08); margin-bottom: 32px; }
.mk-review-card { padding: 24px 28px; border-right: 0.5px solid rgba(0,0,0,0.08); border-bottom: 0.5px solid rgba(0,0,0,0.08); }
.mk-review-card:nth-child(2n) { border-right: none; }
.mk-review-card:nth-last-child(-n+2) { border-bottom: none; }
.mk-review-card-label { font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: #999; margin-bottom: 8px; }
.mk-review-card-value { font-family: 'Playfair Display', serif; font-size: 32px; font-style: italic; color: #1A1815; line-height: 1; }
.mk-review-card-sub { font-size: 11px; color: #5A5750; font-weight: 300; margin-top: 4px; }

/* Performance bars */
.mk-perf-bars { margin-bottom: 32px; }
.mk-perf-bar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
.mk-perf-bar-label { font-size: 12px; font-weight: 300; color: #2C2A27; width: 160px; flex-shrink: 0; }
.mk-perf-bar-track { flex: 1; height: 4px; background: rgba(0,0,0,0.06); overflow: hidden; }
.mk-perf-bar-fill { height: 100%; transition: width 0.8s ease; }
.mk-perf-bar-pct { font-family: 'Playfair Display', serif; font-size: 14px; font-style: italic; color: #1A1815; width: 40px; text-align: right; }

/* Question mini-review */
.mk-q-review { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0; border: 0.5px solid rgba(0,0,0,0.08); margin-bottom: 32px; }
.mk-q-review-item {
  padding: 16px 20px; border-right: 0.5px solid rgba(0,0,0,0.08);
  border-bottom: 0.5px solid rgba(0,0,0,0.08); cursor: pointer;
  transition: background 0.15s;
}
.mk-q-review-item:hover { background: #F5F3F0; }
.mk-q-review-num { font-family: 'Playfair Display', serif; font-size: 20px; font-style: italic; color: #CBD9E7; margin-bottom: 4px; }
.mk-q-review-title { font-size: 13px; font-weight: 400; color: #1A1815; margin-bottom: 6px; }
.mk-q-review-meta { font-size: 10px; color: #999; letter-spacing: 0.08em; }

/* Responsive split */
@media (max-width: 900px) {
  .mk-split { grid-template-columns: 1fr; }
  .mk-sidebar { display: none; }
  .mk-main-panel { padding: 0; }
  .mk-scenario-fab { display: block; }
  .mk-scenario-grid { grid-template-columns: 1fr; }
  .mk-review-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .mk-scenario-grid { grid-template-columns: 1fr; }
  .mk-scenario-card { border-right: none !important; }
  .mk-review-grid { grid-template-columns: 1fr; }
  .mk-review-card { border-right: none !important; }
  .mk-intro-stats { gap: 20px; }
  .mk-perf-bar-label { width: 100px; font-size: 11px; }
}
`;
