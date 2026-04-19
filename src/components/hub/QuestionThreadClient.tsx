'use client';

import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Send, ImagePlus, Loader2, X } from 'lucide-react';
import type { Question } from '@/components/hub/QuestionsBoardClient';

interface Answer {
  id: string;
  clerk_user_id: string;
  user_name: string;
  body: string;
  is_accepted: boolean;
  is_from_lauren: boolean;
  created_at: string;
  image_url?: string;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `

.qt-page *, .qt-page *::before, .qt-page *::after { box-sizing: border-box; }

.qt-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #FAFAF8;
  color: #2C2A27;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.qt-main {
  flex: 1;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  padding: 72px 48px 96px;
}

.qt-breadcrumb {
  font-size: 11px;
  color: var(--charcoal-light);
  margin-bottom: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.02em;
}
.qt-breadcrumb a { color: var(--charcoal-light); text-decoration: none; transition: color 0.1s; }
.qt-breadcrumb a:hover { color: #2C2A27; }

/* Layout */
.qt-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 40px;
  align-items: start;
}

/* Question article */
.qt-question {
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 32px 36px;
  margin-bottom: 40px;
}

.qt-q-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--charcoal-light);
  margin-bottom: 14px;
  display: block;
}

.qt-q-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.qt-q-status {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 3px 8px;
  display: inline-block;
}
.qt-q-status.answered { background: #E6F5F1; color: #0F6E56; }
.qt-q-status.open { background: #FFF3E5; color: #993C1D; }

.qt-q-user {
  font-size: 10px;
  color: var(--charcoal-light);
  letter-spacing: 0.02em;
}
.qt-q-time {
  font-size: 10px;
  color: var(--charcoal-light);
}

.qt-q-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 400;
  line-height: 1.06;
  color: #1A1815;
  letter-spacing: -0.01em;
  margin-bottom: 20px;
}

.qt-q-body {
  font-size: 14px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.9;
  white-space: pre-wrap;
  margin-bottom: 20px;
}

.qt-q-image {
  border: 0.5px solid rgba(0,0,0,0.08);
  padding: 4px;
  display: inline-block;
  overflow: hidden;
  margin-bottom: 20px;
}

.qt-q-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  border-top: 0.5px solid rgba(0,0,0,0.08);
  padding-top: 16px;
}
.qt-q-tag {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 2px 8px;
  color: #5A5750;
}

/* Answers section */
.qt-answers {
  margin-bottom: 40px;
}

.qt-answers-header {
  border: 0.5px solid rgba(0,0,0,0.1);
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,244,239,0.95) 100%);
  box-shadow: 0 22px 42px rgba(26,24,21,0.05);
  padding: 24px 28px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  position: relative;
  overflow: hidden;
}
.qt-answers-header::after {
  content: '';
  position: absolute;
  right: -70px;
  top: -80px;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(239,203,182,0.36) 0%, rgba(239,203,182,0) 72%);
  pointer-events: none;
}

.qt-answers-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--charcoal-light);
  margin-bottom: 8px;
  display: block;
}

.qt-answers-count {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.75rem, 4vw, 2.4rem);
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 6px;
  line-height: 1;
}

.qt-answers-desc {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.65;
  max-width: 50ch;
}

.qt-answers-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex-shrink: 0;
}

.qt-badge {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 6px 10px;
  display: inline-block;
  border-radius: 999px;
}
.qt-badge.accepted { background: #E6F5F1; color: #0F6E56; }
.qt-badge.lauren { border: 0.5px solid rgba(0,0,0,0.1); background: white; color: #1A1815; }

/* No-answers state */
.qt-no-answers {
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 28px 32px;
  margin-bottom: 32px;
}
.qt-no-answers-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--charcoal-light);
  margin-bottom: 10px;
  display: block;
}
.qt-no-answers-title {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 8px;
}
.qt-no-answers-desc {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.65;
}

/* Answer articles */
.qt-answer-list {
  display: grid;
  gap: 18px;
  margin-bottom: 32px;
}

.qt-answer {
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(250,250,248,1) 100%);
  padding: 26px 30px 24px;
  position: relative;
  overflow: hidden;
  border: 0.5px solid rgba(0,0,0,0.1);
  box-shadow: 0 18px 34px rgba(26,24,21,0.04);
}
.qt-answer::after {
  content: '';
  position: absolute;
  right: -58px;
  bottom: -68px;
  width: 170px;
  height: 170px;
  background: radial-gradient(circle, rgba(255,223,181,0.18) 0%, rgba(255,223,181,0) 72%);
  pointer-events: none;
}
.qt-answer.lauren {
  background: linear-gradient(180deg, rgba(240,249,247,0.98) 0%, rgba(250,250,248,1) 100%);
  border-color: rgba(15,110,86,0.12);
}
.qt-answer.accepted {
  background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,249,247,0.78) 100%);
  border-color: rgba(15,110,86,0.18);
  box-shadow: 0 24px 44px rgba(15,110,86,0.08);
}

.qt-answer-stripe {
  position: absolute;
  left: 0;
  top: 18px;
  bottom: 18px;
  width: 4px;
}
.qt-answer-stripe.accepted { background: #0F6E56; }
.qt-answer-stripe.lauren { background: rgba(47,138,126,0.4); }

.qt-answer-highlight {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.qt-answer-highlight-badge {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 6px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
}
.qt-answer-highlight-badge.accepted {
  background: #0F6E56;
  color: white;
}
.qt-answer-highlight-badge.lauren {
  background: white;
  color: #1A1815;
  border: 0.5px solid rgba(0,0,0,0.12);
}

.qt-answer-highlight-copy {
  font-size: 12px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.55;
  margin: 0;
}

.qt-answer-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.qt-answer-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.5px solid rgba(0,0,0,0.1);
  font-size: 11px;
  letter-spacing: 0.06em;
  flex-shrink: 0;
}
.qt-answer-avatar.lauren-av { background: #0F6E56; color: white; border-color: #0F6E56; }
.qt-answer-avatar.student-av { background: white; color: #5A5750; }

.qt-answer-name {
  font-family: 'Playfair Display', serif;
  font-size: 17px;
  font-weight: 400;
  color: #1A1815;
}
.qt-answer-time {
  font-size: 10px;
  color: var(--charcoal-light);
  letter-spacing: 0.03em;
}

.qt-answer-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: auto;
}

.qt-answer-body {
  font-size: 14px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.9;
  white-space: pre-wrap;
  max-width: 68ch;
}

.qt-answer-image {
  border: 0.5px solid rgba(0,0,0,0.08);
  background: white;
  padding: 6px;
  display: inline-block;
  overflow: hidden;
  margin-top: 14px;
}

/* Reply form */
.qt-reply {
  border: 0.5px solid rgba(0,0,0,0.1);
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,244,239,0.96) 100%);
  box-shadow: 0 24px 48px rgba(26,24,21,0.05);
  padding: 28px 32px;
  position: relative;
  overflow: hidden;
}
.qt-reply::after {
  content: '';
  position: absolute;
  right: -80px;
  top: -70px;
  width: 210px;
  height: 210px;
  background: radial-gradient(circle, rgba(239,203,182,0.34) 0%, rgba(239,203,182,0) 72%);
  pointer-events: none;
}
.qt-reply > * {
  position: relative;
  z-index: 1;
}

.qt-reply-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--charcoal-light);
  margin-bottom: 10px;
  display: block;
}
.qt-reply-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 8px;
}
.qt-reply-desc {
  font-size: 14px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.7;
  margin-bottom: 24px;
  max-width: 54ch;
}

.qt-reply-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 22px;
  align-items: start;
}

.qt-reply-form {
  display: grid;
  gap: 14px;
}

.qt-compose-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.qt-compose-label {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--charcoal-light);
}

.qt-compose-note {
  font-size: 12px;
  font-weight: 300;
  color: #5A5750;
  margin: 0;
}

.qt-compose-surface {
  border: 0.5px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.9);
  padding: 18px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
}

.qt-form-textarea {
  width: 100%;
  border: 0.5px solid rgba(0,0,0,0.12);
  background: #FFFCF8;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 300;
  color: #2C2A27;
  outline: none;
  font-family: inherit;
  border-radius: 0;
  resize: none;
  -webkit-appearance: none;
  min-height: 220px;
  margin-bottom: 14px;
}
.qt-form-textarea:focus { border-color: rgba(0,0,0,0.25); }
.qt-form-textarea::placeholder { color: var(--charcoal-light); }

.qt-form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.qt-compose-helper {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.qt-compose-helper-copy,
.qt-compose-helper-limit {
  font-size: 12px;
  font-weight: 300;
  color: #5A5750;
  margin: 0;
}

.qt-upload-btn {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border: 0.5px dashed rgba(0,0,0,0.18);
  padding: 9px 14px;
  cursor: pointer;
  font-family: inherit;
  background: transparent;
  color: #5A5750;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.qt-upload-btn:hover { background: #F5F3F0; }
.qt-upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.qt-img-preview {
  position: relative;
  display: inline-block;
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 4px;
}
.qt-img-remove {
  position: absolute;
  top: 7px;
  right: 7px;
  background: white;
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qt-img-remove svg { width: 12px; height: 12px; }

.qt-submit-btn {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: #1A1815;
  color: #FAFAF8;
  border: none;
  padding: 10px 18px;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.qt-submit-btn:hover { background: #2C2A27; }
.qt-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.qt-reply-tip {
  border: 0.5px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.78);
  padding: 20px 22px;
}
.qt-reply-tip-kicker {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--charcoal-light);
  margin-bottom: 8px;
  display: block;
}
.qt-reply-tip-title {
  font-size: 15px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 10px;
}
.qt-reply-tip-desc {
  font-size: 12px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.7;
}

/* Sign-in prompt */
.qt-signin-prompt {
  text-align: center;
  padding: 28px 32px;
}
.qt-signin-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--charcoal-light);
  margin-bottom: 10px;
  display: block;
}
.qt-signin-title {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 400;
  color: #1A1815;
  margin-bottom: 8px;
}
.qt-signin-desc {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.65;
  margin-bottom: 18px;
}

.qt-btn-primary {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: #1A1815;
  color: #FAFAF8;
  border: 0.5px solid #1A1815;
  padding: 9px 18px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-block;
}
.qt-btn-primary:hover { background: #2C2A27; }

.qt-btn-secondary {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: transparent;
  color: #1A1815;
  border: 0.5px solid rgba(0,0,0,0.12);
  padding: 9px 18px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-block;
}
.qt-btn-secondary:hover { background: #F5F3F0; }

/* Sidebar */
.qt-sidebar {
  position: sticky;
  top: 32px;
  display: grid;
  gap: 16px;
}

.qt-sidebar-panel {
  border: 0.5px solid rgba(0,0,0,0.1);
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,244,239,0.94) 100%);
  box-shadow: 0 20px 36px rgba(26,24,21,0.05);
  overflow: hidden;
}

.qt-sidebar-header {
  border-bottom: 0.5px solid rgba(0,0,0,0.08);
  padding: 14px 18px;
  background: rgba(255,255,255,0.62);
}
.qt-sidebar-kicker {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--charcoal-light);
}

.qt-sidebar-summary-body {
  padding: 18px;
}

.qt-sidebar-summary-top {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.qt-sidebar-chip {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #1A1815;
  background: white;
  border: 0.5px solid rgba(0,0,0,0.1);
  padding: 5px 9px;
  border-radius: 999px;
}

.qt-sidebar-summary-title {
  font-family: 'Playfair Display', serif;
  font-size: 21px;
  line-height: 1.12;
  color: #1A1815;
  margin-bottom: 10px;
}

.qt-sidebar-summary-desc {
  font-size: 13px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.7;
  margin-bottom: 18px;
}

.qt-sidebar-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5px;
  background: rgba(0,0,0,0.08);
  margin-bottom: 18px;
}

.qt-sidebar-metric {
  background: rgba(255,255,255,0.82);
  padding: 14px 12px;
}

.qt-sidebar-metric-label {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--charcoal-light);
  margin-bottom: 6px;
  display: block;
}

.qt-sidebar-metric-value {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  color: #1A1815;
  line-height: 1;
}

.qt-sidebar-metric-copy {
  font-size: 12px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.5;
}

.qt-sidebar-summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.qt-sidebar-row {
  padding: 14px 18px;
  border-bottom: 0.5px solid rgba(0,0,0,0.06);
}
.qt-sidebar-row:last-child { border-bottom: none; }
.qt-sidebar-row-label {
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--charcoal-light);
  margin-bottom: 6px;
  display: block;
}
.qt-sidebar-row-value {
  font-size: 13px;
  font-weight: 300;
  color: #2C2A27;
  line-height: 1.5;
}
.qt-sidebar-num {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-style: italic;
  color: #1A1815;
  display: block;
  line-height: 1;
}

.qt-sidebar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.qt-sidebar-tag {
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: 0.5px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.82);
  padding: 5px 9px;
  color: #5A5750;
}

.qt-form-textarea:focus-visible,
.qt-upload-btn:focus-visible,
.qt-img-remove:focus-visible,
.qt-submit-btn:focus-visible {
  outline: 3px solid var(--peach-warm);
  outline-offset: 3px;
}

.qt-sidebar-actions {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qt-sidebar-next-copy {
  padding: 18px 18px 0;
}

.qt-sidebar-next-title {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  color: #1A1815;
  line-height: 1.15;
  margin-bottom: 8px;
}

.qt-sidebar-next-desc {
  font-size: 12px;
  font-weight: 300;
  color: #5A5750;
  line-height: 1.65;
  margin: 0;
}

.qt-sidebar-btn {
  width: 100%;
  justify-content: center;
  text-align: center;
}

/* Responsive */
@media (max-width: 900px) {
  .qt-layout { grid-template-columns: 1fr; }
  .qt-sidebar { position: static; }
  .qt-reply-grid { grid-template-columns: 1fr; }
  .qt-answer-badges { margin-left: 0; }
}
@media (max-width: 768px) {
  .qt-main { padding: 48px 20px 64px; }
  .qt-question { padding: 22px 20px; }
  .qt-reply { padding: 20px; }
  .qt-answers-header { padding: 20px; }
  .qt-compose-surface { padding: 14px; }
  .qt-answers-header { flex-direction: column; align-items: flex-start; }
  .qt-answer { padding: 22px 20px 20px; }
  .qt-sidebar-summary-body { padding: 16px; }
  .qt-sidebar-next-copy,
  .qt-sidebar-actions { padding: 16px; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuestionThreadClient({
  question,
  initialAnswers,
  isSignedIn,
}: {
  question: Question;
  initialAnswers: Answer[];
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState(initialAnswers);
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [answerImageUrl, setAnswerImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const answerBodyId = useId();
  const answerImageInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const answerCountLabel = `${answers.length} ${answers.length === 1 ? 'answer' : 'answers'}`;
  const hasAcceptedAnswer = answers.some((a) => a.is_accepted);
  const hasLaurenReply = answers.some((a) => a.is_from_lauren);

  const refreshAnswers = async () => {
    try {
      const res = await fetch(`/api/questions/${question.id}/answers`);
      const data = await res.json();
      setAnswers(data.answers || []);
    } catch {
      // silent
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setAnswerImageUrl(data.url);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to upload image');
      }
    } catch {
      alert('Failed to upload image');
    }
    setUploading(false);
  };

  const handleSubmitAnswer = async (e: FormEvent) => {
    e.preventDefault();
    if (!answerBody.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/questions/${question.id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: answerBody.trim(), image_url: answerImageUrl }),
      });
      if (res.ok) {
        setAnswerBody('');
        setAnswerImageUrl(null);
        await refreshAnswers();
        router.refresh();
      }
    } catch {
      // silent
    }
    setSubmitting(false);
  };

  return (
    <div className="qt-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main className="qt-main">
        {/* Breadcrumb */}
        <nav className="qt-breadcrumb">
          <Link href="/hub">Hub</Link>
          <span>/</span>
          <Link href="/hub/questions">Q&amp;A Board</Link>
          <span>/</span>
          <span>Thread</span>
        </nav>

        <div className="qt-layout">
          {/* Main column */}
          <div>
            {/* Question */}
            <article className="qt-question">
              <span className="qt-q-kicker">Question thread</span>

              <div className="qt-q-meta">
                <span className={`qt-q-status ${question.is_answered ? 'answered' : 'open'}`}>
                  {question.is_answered ? 'Answered' : 'Open'}
                </span>
                <span className="qt-q-user">{question.user_name}</span>
                <span className="qt-q-time">{timeAgo(question.created_at)}</span>
              </div>

              <h1 className="qt-q-title">{question.title}</h1>
              <div className="qt-q-body">{question.body}</div>

              {question.image_url && (
                <div className="qt-q-image">
                  <Image
                    src={question.image_url}
                    alt="Question attachment"
                    width={680}
                    height={400}
                    style={{ display: 'block', objectFit: 'contain' }}
                  />
                </div>
              )}

              {question.tags.length > 0 && (
                <div className="qt-q-tags">
                  {question.tags.map((tag) => (
                    <span key={tag} className="qt-q-tag">{tag}</span>
                  ))}
                </div>
              )}
            </article>

            {/* Answers */}
            <section className="qt-answers" id="answers">
              <div className="qt-answers-header">
                <div>
                  <span className="qt-answers-kicker">Answers</span>
                  <p className="qt-answers-count">{answerCountLabel}</p>
                  <p className="qt-answers-desc">
                    The clearest replies usually explain the step, name the safety bit, and keep the wording calm.
                  </p>
                </div>
                <div className="qt-answers-badges">
                  {hasAcceptedAnswer && (
                    <span className="qt-badge accepted">Accepted reply in thread</span>
                  )}
                  {hasLaurenReply && (
                    <span className="qt-badge lauren">Lauren has replied</span>
                  )}
                </div>
              </div>

              {answers.length === 0 ? (
                <div className="qt-no-answers">
                  <span className="qt-no-answers-kicker">No answers yet</span>
                  <p className="qt-no-answers-title">Be the first person to help with this one.</p>
                  <p className="qt-no-answers-desc">
                    A useful answer usually explains the step clearly, names any safety check worth keeping, and avoids making the other person feel silly for asking.
                  </p>
                </div>
              ) : (
                <div className="qt-answer-list">
                  {answers.map((answer) => {
                    const highlight = answer.is_accepted
                      ? {
                          label: 'Best answer',
                          className: 'accepted',
                          copy: 'This reply has been marked as the clearest way through the problem.',
                        }
                      : answer.is_from_lauren
                        ? {
                            label: 'Lauren note',
                            className: 'lauren',
                            copy: 'Staff guidance with extra context for revision and placement confidence.',
                          }
                        : null;

                    return (
                      <article
                        key={answer.id}
                        className={`qt-answer${answer.is_from_lauren ? ' lauren' : ''}${answer.is_accepted ? ' accepted' : ''}`}
                      >
                        {(answer.is_from_lauren || answer.is_accepted) && (
                          <div className={`qt-answer-stripe ${answer.is_accepted ? 'accepted' : 'lauren'}`} />
                        )}

                        {highlight && (
                          <div className="qt-answer-highlight">
                            <span className={`qt-answer-highlight-badge ${highlight.className}`}>{highlight.label}</span>
                            <p className="qt-answer-highlight-copy">{highlight.copy}</p>
                          </div>
                        )}

                        <div className="qt-answer-meta">
                          <div className={`qt-answer-avatar ${answer.is_from_lauren ? 'lauren-av' : 'student-av'}`}>
                            {answer.is_from_lauren ? 'L' : answer.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="qt-answer-name">{answer.user_name}</p>
                            <p className="qt-answer-time">{timeAgo(answer.created_at)}</p>
                          </div>
                          <div className="qt-answer-badges">
                            {answer.is_from_lauren && (
                              <span className="qt-badge lauren">Lauren</span>
                            )}
                            {answer.is_accepted && (
                              <span className="qt-badge accepted">Accepted</span>
                            )}
                          </div>
                        </div>

                        <p className="qt-answer-body">{answer.body}</p>

                        {answer.image_url && (
                          <div className="qt-answer-image">
                            <Image
                              src={answer.image_url}
                              alt="Answer attachment"
                              width={480}
                              height={300}
                              style={{ display: 'block', objectFit: 'contain' }}
                            />
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Reply form */}
            <section id="reply" className="qt-reply">
              {isSignedIn ? (
                <>
                  <span className="qt-reply-kicker">Add a reply</span>
                  <h3 className="qt-reply-title">Add something useful.</h3>
                  <p className="qt-reply-desc">
                    Keep it clear, practical, and kind. If the explanation needs a visual, add an image.
                  </p>

                  <div className="qt-reply-grid">
                    <form onSubmit={handleSubmitAnswer} className="qt-reply-form">
                      <div className="qt-compose-meta">
                        <span className="qt-compose-label">Compose your answer</span>
                        <span className="qt-compose-note">Aim for the step, the safety bit, and the calm wording.</span>
                      </div>

                      <div className="qt-compose-surface">
                        <label className="sr-only" htmlFor={answerBodyId}>Your answer</label>
                        <textarea
                          id={answerBodyId}
                          className="qt-form-textarea"
                          value={answerBody}
                          onChange={(e) => setAnswerBody(e.target.value)}
                          placeholder="Share what would help another student understand this more clearly..."
                          rows={8}
                          maxLength={2000}
                          required
                        />

                        <div className="qt-form-actions">
                          <div>
                            <input
                              id={answerImageInputId}
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              onChange={handleImageUpload}
                              style={{ display: 'none' }}
                            />
                            {answerImageUrl ? (
                              <div className="qt-img-preview">
                                <Image
                                  src={answerImageUrl}
                                  alt="Uploaded answer image"
                                  width={180}
                                  height={120}
                                  style={{ display: 'block', objectFit: 'cover' }}
                                />
                                <button
                                  type="button"
                                  className="qt-img-remove"
                                  aria-label="Remove uploaded answer image"
                                  onClick={() => setAnswerImageUrl(null)}
                                >
                                  <X />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="qt-upload-btn"
                                aria-controls={answerImageInputId}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                              >
                                {uploading ? (
                                  <><Loader2 style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} /> Uploading...</>
                                ) : (
                                  <><ImagePlus style={{ width: '13px', height: '13px' }} /> Add image</>
                                )}
                              </button>
                            )}
                          </div>

                          <button
                            type="submit"
                            className="qt-submit-btn"
                            disabled={submitting || !answerBody.trim()}
                          >
                            <Send style={{ width: '13px', height: '13px' }} />
                            {submitting ? 'Posting...' : 'Post answer'}
                          </button>
                        </div>

                        <div className="qt-compose-helper">
                          <p className="qt-compose-helper-copy">Short paragraphs and one practical takeaway make answers easier to use on shift.</p>
                          <p className="qt-compose-helper-limit">Max 2000 characters</p>
                        </div>
                      </div>
                    </form>

                    <div className="qt-reply-tip">
                      <span className="qt-reply-tip-kicker">Reply tip</span>
                      <p className="qt-reply-tip-title">Best replies usually do three things.</p>
                      <p className="qt-reply-tip-desc">
                        Explain the step plainly, point out the safety bit worth remembering, and keep the tone gentle enough that someone would actually want to read it under pressure.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="qt-signin-prompt">
                  <span className="qt-signin-kicker">Join the board</span>
                  <p className="qt-signin-title">Sign in to add an answer.</p>
                  <p className="qt-signin-desc">
                    If you have something useful to add, open your account page and jump straight back in.
                  </p>
                  <Link href="/sign-in" className="qt-btn-primary">
                    Open account page
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="qt-sidebar">
            <div className="qt-sidebar-panel">
              <div className="qt-sidebar-header">
                <span className="qt-sidebar-kicker">Thread snapshot</span>
              </div>

              <div className="qt-sidebar-summary-body">
                <div className="qt-sidebar-summary-top">
                  <span className={`qt-q-status ${question.is_answered ? 'answered' : 'open'}`}>
                    {question.is_answered ? 'Solved' : 'Still open'}
                  </span>
                  {hasAcceptedAnswer && (
                    <span className="qt-sidebar-chip">Best answer marked</span>
                  )}
                  {hasLaurenReply && (
                    <span className="qt-sidebar-chip">Lauren replied</span>
                  )}
                </div>

                <p className="qt-sidebar-summary-title">
                  {question.is_answered
                    ? 'Start with the strongest answer, then skim the rest for extra context.'
                    : 'This thread could still use one clear, practical reply.'}
                </p>
                <p className="qt-sidebar-summary-desc">
                  {question.is_answered
                    ? 'Use the accepted answer as the main path through the problem, then read supporting replies for nuance.'
                    : isSignedIn
                      ? 'If you know the next safe step, a calm answer here would probably help someone else too.'
                      : 'If you know the next safe step, sign in and add it while the thread is still open.'}
                </p>

                <div className="qt-sidebar-metrics">
                  <div className="qt-sidebar-metric">
                    <span className="qt-sidebar-metric-label">Replies</span>
                    <span className="qt-sidebar-metric-value">{answers.length}</span>
                  </div>
                  <div className="qt-sidebar-metric">
                    <span className="qt-sidebar-metric-label">Posted</span>
                    <span className="qt-sidebar-metric-copy">{timeAgo(question.created_at)}</span>
                  </div>
                  <div className="qt-sidebar-metric">
                    <span className="qt-sidebar-metric-label">Asked by</span>
                    <span className="qt-sidebar-metric-copy">{question.user_name}</span>
                  </div>
                  <div className="qt-sidebar-metric">
                    <span className="qt-sidebar-metric-label">Status</span>
                    <span className="qt-sidebar-metric-copy">
                      {question.is_answered ? 'Accepted answer in thread' : 'Waiting for the clearest reply'}
                    </span>
                  </div>
                </div>

                {question.tags.length > 0 && (
                  <div className="qt-sidebar-summary-tags">
                    {question.tags.map((tag) => (
                      <span key={tag} className="qt-sidebar-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="qt-sidebar-panel">
              <div className="qt-sidebar-header">
                <span className="qt-sidebar-kicker">Next move</span>
              </div>
              <div className="qt-sidebar-next-copy">
                <p className="qt-sidebar-next-title">
                  {isSignedIn
                    ? question.is_answered
                      ? 'Still unsure? Add the missing bit.'
                      : 'Jump in with the clearest next step you know.'
                    : 'Want to add context or a reply?'}
                </p>
                <p className="qt-sidebar-next-desc">
                  {isSignedIn
                    ? 'Keep it short, practical, and kind so someone can use it under pressure.'
                    : 'Open your account, come back here, and you can reply or ask a similar question in one go.'}
                </p>
              </div>
              <div className="qt-sidebar-actions">
                <Link href="/hub/questions" className="qt-btn-primary qt-sidebar-btn">
                  Browse questions
                </Link>
                {isSignedIn ? (
                  <a href="#reply" className="qt-btn-secondary qt-sidebar-btn">
                    Jump to reply
                  </a>
                ) : (
                  <Link href="/sign-in" className="qt-btn-secondary qt-sidebar-btn">
                    Sign in to reply
                  </Link>
                )}
                <Link href="/hub/questions?ask=1" className="qt-btn-secondary qt-sidebar-btn">
                  Ask a similar question
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

    </div>
  );
}
