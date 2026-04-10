export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');

.qb-page *, .qb-page *::before, .qb-page *::after { box-sizing: border-box; }

.qb-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #FAFAF8;
  color: #2C2A27;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.qb-main {
  flex: 1;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding: 72px 48px 96px;
}

.qb-breadcrumb {
  font-size: 11px;
  color: #bbb;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.02em;
}
.qb-breadcrumb a { color: #bbb; text-decoration: none; transition: color 0.1s; }
.qb-breadcrumb a:hover { color: #2C2A27; }

.qb-kicker {
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 14px;
}

.qb-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 400;
  line-height: 1.04;
  color: #1A1815;
  letter-spacing: -0.01em;
  margin-bottom: 16px;
  max-width: 20ch;
}

.qb-standfirst {
  font-size: 15px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.7;
  max-width: 560px;
}

.qb-divider {
  border: none;
  border-top: 0.5px solid rgba(0,0,0,0.1);
  margin: 36px 0 48px;
}

/* Top bar */
.qb-top-bar {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 40px;
  margin-bottom: 48px;
  align-items: start;
}

.qb-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 0;
}

.qb-btn-primary {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: #1A1815;
  color: #FAFAF8;
  border: 0.5px solid #1A1815;
  padding: 10px 20px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.qb-btn-primary:hover { background: #2C2A27; }

.qb-btn-secondary {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: transparent;
  color: #1A1815;
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 10px 20px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.qb-btn-secondary:hover { background: #F5F3F0; }

/* Stats panel */
.qb-stats {
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 22px 24px;
}
.qb-stats-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 14px;
  display: block;
}
.qb-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5px;
  background: rgba(0,0,0,0.08);
  margin-bottom: 14px;
}
.qb-stat-cell {
  background: #FAFAF8;
  padding: 14px 16px;
}
.qb-stat-label {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 6px;
  display: block;
}
.qb-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-style: italic;
  font-weight: 400;
  color: #1A1815;
  line-height: 1;
  display: block;
}
.qb-stats-desc {
  font-size: 12px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.6;
}

/* Starter prompts (empty state sidebar) */
.qb-prompt-list { display: flex; flex-direction: column; gap: 0.5px; background: rgba(0,0,0,0.08); }
.qb-prompt-card { background: #FAFAF8; padding: 14px 16px; }
.qb-prompt-card-eyebrow {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 6px;
  display: block;
}
.qb-prompt-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 14px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 4px;
}
.qb-prompt-card-desc {
  font-size: 11px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.55;
}

/* Filter shelf */
.qb-shelf {
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 18px 22px;
  margin-bottom: 36px;
  display: grid;
  grid-template-columns: 1fr 150px 150px auto;
  gap: 10px;
  align-items: center;
}

.qb-search-wrap { position: relative; }
.qb-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 13px;
  height: 13px;
  color: #aaa;
  pointer-events: none;
}
.qb-search {
  width: 100%;
  border: 0.5px solid rgba(0,0,0,0.12);
  background: white;
  padding: 8px 12px 8px 30px;
  font-size: 12px;
  font-weight: 300;
  color: #2C2A27;
  outline: none;
  font-family: inherit;
  border-radius: 0;
  -webkit-appearance: none;
}
.qb-search:focus { border-color: rgba(0,0,0,0.25); }
.qb-search::placeholder { color: #aaa; }

.qb-select {
  border: 0.5px solid rgba(0,0,0,0.12);
  background: white;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 300;
  color: #2C2A27;
  outline: none;
  font-family: inherit;
  border-radius: 0;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  cursor: pointer;
}
.qb-select:focus { border-color: rgba(0,0,0,0.25); }

.qb-filter-meta {
  font-size: 11px;
  color: #aaa;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.qb-clear-btn {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 6px 14px;
  cursor: pointer;
  background: white;
  font-family: inherit;
  color: #5A5750;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.qb-clear-btn:hover { background: #F5F3F0; }

/* Question list */
.qb-q-list {
  border: 0.5px solid rgba(0,0,0,0.1);
  margin-bottom: 60px;
}

.qb-q-row {
  display: block;
  padding: 22px 28px;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
  text-decoration: none;
  transition: background 0.1s;
}
.qb-q-row:last-child { border-bottom: none; }
.qb-q-row:hover { background: #F5F3F0; }

.qb-q-row-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.qb-q-row-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.qb-q-status {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 3px 8px;
  display: inline-block;
}
.qb-q-status.answered { background: #E6F5F1; color: #0F6E56; }
.qb-q-status.open { background: #FFF3E5; color: #993C1D; }

.qb-q-user {
  font-size: 10px;
  color: #aaa;
  letter-spacing: 0.02em;
}
.qb-q-time {
  font-size: 10px;
  color: #aaa;
}

.qb-q-arrow {
  font-size: 13px;
  color: #aaa;
  transition: transform 0.12s;
  display: inline-block;
  flex-shrink: 0;
}
.qb-q-row:hover .qb-q-arrow { transform: translateX(3px); color: #1A1815; }

.qb-q-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 20px;
  font-weight: 400;
  color: #1A1815;
  line-height: 1.15;
  margin-bottom: 8px;
}

.qb-q-preview {
  font-size: 12px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.65;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.qb-q-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.qb-q-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.qb-q-tag {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 2px 7px;
  color: #5A5750;
}

.qb-q-open-link {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #1A1815;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Image attachment in list */
.qb-q-image {
  margin: 10px 0;
  border: 0.5px solid rgba(0,0,0,0.08);
  display: inline-block;
  overflow: hidden;
  padding: 4px;
}

/* Empty / no-matches states */
.qb-empty {
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 36px 40px;
  margin-bottom: 60px;
}
.qb-empty-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 12px;
  display: block;
}
.qb-empty-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 10px;
}
.qb-empty-desc {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 20px;
}
.qb-empty-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5px;
  background: rgba(0,0,0,0.08);
  margin-top: 24px;
}
.qb-empty-card {
  background: #FAFAF8;
  padding: 18px 20px;
}
.qb-empty-card-eye {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 8px;
  display: block;
}
.qb-empty-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 6px;
}
.qb-empty-card-desc {
  font-size: 12px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.55;
}

/* Ask modal */
.qb-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26,24,21,0.5);
  backdrop-filter: blur(2px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.qb-modal {
  background: #FAFAF8;
  border: 0.5px solid rgba(0,0,0,0.15);
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
}

.qb-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  border-bottom: 0.5px solid rgba(0,0,0,0.1);
  padding: 28px 32px 24px;
}
.qb-modal-meta { flex: 1; min-width: 0; }
.qb-modal-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 10px;
  display: block;
}
.qb-modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 8px;
  line-height: 1.1;
}
.qb-modal-desc {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.65;
}
.qb-modal-close {
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 7px;
  cursor: pointer;
  background: white;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qb-modal-close:hover { background: #F5F3F0; }
.qb-modal-close svg { width: 14px; height: 14px; color: #1A1815; }

.qb-modal-body { padding: 28px 32px; }

.qb-form-group { margin-bottom: 22px; }
.qb-form-label {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 8px;
  display: block;
}
.qb-form-input {
  width: 100%;
  border: 0.5px solid rgba(0,0,0,0.12);
  background: white;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  outline: none;
  font-family: inherit;
  border-radius: 0;
  -webkit-appearance: none;
}
.qb-form-input:focus { border-color: rgba(0,0,0,0.25); }
.qb-form-input::placeholder { color: #aaa; }

.qb-form-textarea {
  width: 100%;
  border: 0.5px solid rgba(0,0,0,0.12);
  background: white;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  outline: none;
  font-family: inherit;
  border-radius: 0;
  resize: none;
  -webkit-appearance: none;
}
.qb-form-textarea:focus { border-color: rgba(0,0,0,0.25); }
.qb-form-textarea::placeholder { color: #aaa; }

.qb-form-hint {
  font-size: 11px;
  color: #aaa;
  margin-top: 6px;
  display: block;
}

.qb-form-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.qb-form-tag-btn {
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 5px 12px;
  cursor: pointer;
  font-family: inherit;
  background: transparent;
  color: #5A5750;
  transition: all 0.1s;
}
.qb-form-tag-btn:hover { background: #F5F3F0; }
.qb-form-tag-btn.active { background: #1A1815; color: #FAFAF8; border-color: #1A1815; }

.qb-upload-btn {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border: 0.5px dashed rgba(0,0,0,0.18);
  padding: 9px 18px;
  cursor: pointer;
  font-family: inherit;
  background: transparent;
  color: #5A5750;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.qb-upload-btn:hover { border-color: rgba(0,0,0,0.3); background: #F5F3F0; }
.qb-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.qb-upload-btn svg { width: 13px; height: 13px; }

.qb-img-preview {
  position: relative;
  display: inline-block;
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 4px;
}
.qb-img-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background: white;
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qb-img-remove svg { width: 12px; height: 12px; }

.qb-form-submit {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: #1A1815;
  color: #FAFAF8;
  border: none;
  padding: 10px 22px;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.qb-form-submit:hover { background: #2C2A27; }
.qb-form-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.qb-form-submit svg { width: 13px; height: 13px; }

/* Responsive */
@media (max-width: 900px) {
  .qb-top-bar { grid-template-columns: 1fr; }
  .qb-shelf { grid-template-columns: 1fr; }
  .qb-empty-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .qb-main { padding: 48px 20px 64px; }
  .qb-modal { margin: 0; }
  .qb-modal-header { padding: 20px; }
  .qb-modal-body { padding: 20px; }
  .qb-q-row { padding: 18px 20px; }
}
`;
