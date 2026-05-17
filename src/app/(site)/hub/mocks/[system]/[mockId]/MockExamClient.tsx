'use client';

import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { MockExam, MockQuestion, MockReference } from '../../mockTypes';
import { MOCK_PAGE_CSS } from '../../mockStyles';
import { MOCK_INTERACTIVE_CSS } from '../../mockStyles';

// ── Motion variants ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

// ── localStorage helpers ────────────────────────────────────────────────────

function storageKey(mockId: string) {
  return `rf_mock_v2_${mockId}`;
}

interface MockProgress {
  answers: Record<string, string>;
  expandedSections: Record<string, boolean>;
  revealedStructures: Record<string, boolean>;
  currentStep: number;
  guidanceUnlocked: Record<string, boolean>;
  selfMarkChecks: Record<string, boolean[]>;
  questionTimes: Record<string, number>;
  deteriorationResponses: Record<string, string>;
  showSelfMark: Record<string, boolean>;
  flaggedQuestions: Record<string, boolean>;
}

const emptyProgress: MockProgress = {
  answers: {},
  expandedSections: {},
  revealedStructures: {},
  currentStep: 0,
  guidanceUnlocked: {},
  selfMarkChecks: {},
  questionTimes: {},
  deteriorationResponses: {},
  showSelfMark: {},
  flaggedQuestions: {},
};

function loadProgress(mockId: string): MockProgress {
  if (typeof window === 'undefined') return { ...emptyProgress };
  try {
    const raw = localStorage.getItem(storageKey(mockId));
    if (raw) return { ...emptyProgress, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...emptyProgress };
}

function saveProgress(mockId: string, progress: MockProgress) {
  try {
    localStorage.setItem(storageKey(mockId), JSON.stringify(progress));
  } catch { /* ignore */ }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s < 10 ? '0' : ''}${s}s`;
}

function parseWordGuide(guide: string): number {
  const match = guide.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 250;
}

function isAbnormal(label: string, value: string): boolean {
  const l = label.toLowerCase();
  if (l.includes('spo') && value.includes('91')) return true;
  if (l.includes('respiratory') && parseInt(value) > 40) return true;
  if (l.includes('heart') && parseInt(value) > 150) return true;
  if (l.includes('capillary') && value.includes('3')) return true;
  return false;
}

// ── Scenario Sidebar (split-screen) ─────────────────────────────────────────

function ScenarioSidebar({ mock }: { mock: MockExam }) {
  return (
    <aside className="mk-sidebar">
      <p className="mk-sidebar-label">Clinical Scenario</p>
      <p className="mk-sidebar-child">{mock.scenario.childName}</p>
      <p className="mk-sidebar-age">{mock.scenario.age}</p>
      <p className="mk-sidebar-complaint">
        {mock.scenario.presentingComplaint} ({mock.scenario.duration})
      </p>
      <div className="mk-sidebar-obs">
        {mock.scenario.observations.map((obs) => (
          <div key={obs.label} className="mk-sidebar-obs-item" data-abnormal={String(isAbnormal(obs.label, obs.value))}>
            <p className="mk-sidebar-obs-label">{obs.label}</p>
            <p className="mk-sidebar-obs-value">{obs.value}</p>
          </div>
        ))}
      </div>
      <p className="mk-sidebar-signs">
        {mock.scenario.clinicalSigns.join(' · ')}
      </p>
      <p className="mk-sidebar-diagnosis">
        <strong>Dx:</strong> {mock.scenario.diagnosis}
      </p>
    </aside>
  );
}

// ── Scenario Sheet (mobile) ─────────────────────────────────────────────────

function ScenarioSheet({ mock, open, onClose }: { mock: MockExam; open: boolean; onClose: () => void }) {
  return (
    <>
      <div className="mk-sheet-overlay" data-open={String(open)} onClick={onClose} />
      <div className="mk-scenario-sheet" data-open={String(open)}>
        <button type="button" className="mk-scenario-sheet-close" onClick={onClose}>
          Close scenario
        </button>
        <p className="mk-sidebar-child">{mock.scenario.childName}, {mock.scenario.age}</p>
        <p style={{ fontSize: '12px', color: '#5A5750', marginBottom: '14px', lineHeight: 1.65 }}>
          {mock.scenario.presentingComplaint} ({mock.scenario.duration})
        </p>
        <div className="mk-sidebar-obs">
          {mock.scenario.observations.map((obs) => (
            <div key={obs.label} className="mk-sidebar-obs-item" data-abnormal={String(isAbnormal(obs.label, obs.value))}>
              <p className="mk-sidebar-obs-label">{obs.label}</p>
              <p className="mk-sidebar-obs-value">{obs.value}</p>
            </div>
          ))}
        </div>
        <ul style={{ fontSize: '12px', color: '#2C2A27', lineHeight: 1.65, paddingLeft: '16px', marginBottom: '14px' }}>
          {mock.scenario.clinicalSigns.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
        <p style={{ fontSize: '12px', fontWeight: 500, color: '#1A1815' }}>
          Diagnosis: {mock.scenario.diagnosis}
        </p>
      </div>
    </>
  );
}

// ── Step Tracker ────────────────────────────────────────────────────────────

function StepTracker({
  totalSteps,
  currentStep,
  onNavigate,
}: {
  totalSteps: number;
  currentStep: number;
  onNavigate: (step: number) => void;
}) {
  const labels = ['S', '1', '2', '3', '4', '5', '6', '7', '8', 'R'];

  return (
    <div className="mk-steps">
      <div className="mk-steps-inner">
        {labels.slice(0, totalSteps).map((label, i) => {
          const state = i < currentStep ? 'completed' : i === currentStep ? 'current' : 'future';
          return (
            <div key={i} className="mk-step">
              <div
                className="mk-step-dot"
                data-state={state}
                onClick={() => state === 'completed' && onNavigate(i)}
                role={state === 'completed' ? 'button' : undefined}
                tabIndex={state === 'completed' ? 0 : undefined}
              >
                {state === 'completed' ? '\u2713' : label}
              </div>
              {i < totalSteps - 1 && (
                <div className="mk-step-line" data-filled={String(i < currentStep)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Expandable Panel ────────────────────────────────────────────────────────

function ExpandablePanel({
  label,
  panelClass,
  children,
  isOpen,
  onToggle,
}: {
  label: string;
  panelClass?: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mk-guidance-layer" style={{ marginBottom: isOpen ? '0' : '10px' }}>
      <button
        type="button"
        className="mk-expand-trigger"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="mk-expand-chevron" aria-hidden="true">&rsaquo;</span>
        {label}
      </button>
      {isOpen && (
        <div className={`mk-expand-body ${panelClass || ''}`}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Clinical Reasoning Flow ─────────────────────────────────────────────────

function ClinicalReasoningFlow({ text }: { text: string }) {
  const steps = text.split(/\s*\u2192\s*/);

  return (
    <div className="mk-flow">
      <p className="mk-flow-label">Clinical reasoning chain</p>
      <div className="mk-flow-chain">
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="mk-flow-step">{step.trim()}</div>
            {i < steps.length - 1 && <span className="mk-flow-arrow">{'\u2193'}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Priority Stack ──────────────────────────────────────────────────────────

function PriorityStack({ items }: { items: string[] }) {
  return (
    <div className="mk-priority">
      <p className="mk-priority-label">{'\u26A1'} Priority order</p>
      <div className="mk-priority-list">
        {items.map((item, i) => (
          <div key={i} className="mk-priority-item">
            <span className="mk-priority-num">{i + 1}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Self-Mark Checklist ─────────────────────────────────────────────────────

function SelfMarkChecklist({
  criteria,
  checks,
  onToggle,
}: {
  criteria: string[];
  checks: boolean[];
  onToggle: (index: number) => void;
}) {
  const checkedCount = checks.filter(Boolean).length;
  const total = criteria.length;
  const ratio = total > 0 ? checkedCount / total : 0;
  const grade = ratio >= 0.8 ? 'first' : ratio >= 0.5 ? '2:1' : 'pass';
  const gradeLabel = ratio >= 0.8 ? 'First-class territory' : ratio >= 0.5 ? 'Heading toward a 2:1' : 'Around a Pass';

  return (
    <div className="mk-selfmark">
      <p className="mk-selfmark-title">Mark your answer</p>
      <div className="mk-selfmark-list">
        {criteria.map((item, i) => (
          <div key={i} className="mk-selfmark-item" onClick={() => onToggle(i)}>
            <input
              type="checkbox"
              checked={checks[i] || false}
              onChange={() => onToggle(i)}
              onClick={(e) => e.stopPropagation()}
            />
            <label>{item}</label>
          </div>
        ))}
      </div>
      {checkedCount > 0 && (
        <span className="mk-selfmark-score" data-grade={grade}>
          {checkedCount}/{total} {'\u2014'} {gradeLabel}
        </span>
      )}
    </div>
  );
}

// ── Deterioration Mode ──────────────────────────────────────────────────────

function DeteriorationMode({
  deterioration,
  response,
  onResponseChange,
}: {
  deterioration: { clinicalChanges: string; whatItIndicates: string; nurseAction: string };
  response: string;
  onResponseChange: (value: string) => void;
}) {
  const [showGuidance, setShowGuidance] = useState(false);

  return (
    <div className="mk-deterioration" style={{ animation: 'mk-fadeIn 0.25s ease-out' }}>
      <p className="mk-deterioration-label">{'\uD83D\uDEA8'} If this patient deteriorates</p>

      <div className="mk-deterioration-row">
        <p className="mk-deterioration-sub">What changes clinically</p>
        <p>{deterioration.clinicalChanges}</p>
      </div>

      <div className="mk-deter-response-wrap">
        <p className="mk-deter-response-label">What would you do?</p>
        <textarea
          className="mk-deter-response-textarea"
          placeholder="Write your response before revealing the guidance..."
          value={response}
          onChange={(e) => onResponseChange(e.target.value)}
        />
      </div>

      {countWords(response) >= 15 && !showGuidance && (
        <button
          type="button"
          className="mk-unlock-btn"
          style={{ marginTop: '12px' }}
          onClick={() => setShowGuidance(true)}
        >
          Reveal what the nurse should do {'\u2192'}
        </button>
      )}

      {showGuidance && (
        <div style={{ marginTop: '12px', animation: 'mk-fadeIn 0.25s ease-out' }}>
          <div className="mk-deterioration-row">
            <p className="mk-deterioration-sub">What this indicates</p>
            <p>{deterioration.whatItIndicates}</p>
          </div>
          <div className="mk-deterioration-row">
            <p className="mk-deterioration-sub">Correct nurse action</p>
            <p>{deterioration.nurseAction}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sentence bank ───────────────────────────────────────────────────────────

function SentenceBank({ sentences }: { sentences: string[] }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch { /* fallback */ }
  }, []);

  return (
    <div className="mk-sentences">
      <h2 className="mk-section-title">High-Scoring Phrasing</h2>
      <div className="mk-sentence-list">
        {sentences.map((sentence, i) => (
          <div key={i} className="mk-sentence-item">
            <span className="mk-sentence-text">{sentence}</span>
            <button
              type="button"
              className="mk-sentence-copy"
              onClick={() => handleCopy(sentence, i)}
            >
              {copiedIdx === i ? 'Copied \u2713' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Question Step ───────────────────────────────────────────────────────────

function QuestionStep({
  question,
  progress,
  onUpdate,
  isPartB,
}: {
  question: MockQuestion;
  progress: MockProgress;
  onUpdate: (p: Partial<MockProgress>) => void;
  isPartB?: boolean;
}) {
  const answer = progress.answers[question.id] || '';
  const words = countWords(answer);
  const wordGuide = parseWordGuide(question.wordGuide);
  const isNearGuide = words >= wordGuide * 0.7;
  const isUnlocked = !!progress.guidanceUnlocked[question.id];
  const canUnlock = words >= 30;
  const showingSelfMark = !!progress.showSelfMark[question.id];
  const topBandUnlocks = question.topBandUnlocks ?? question.toScoreHighly;

  // Timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(progress.questionTimes[question.id] || 0);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // save time periodically
    const timer = setTimeout(() => {
      onUpdate({
        questionTimes: { ...progress.questionTimes, [question.id]: elapsed },
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, [elapsed, question.id, onUpdate, progress.questionTimes]);

  const handleAnswerChange = useCallback((value: string) => {
    onUpdate({
      answers: { ...progress.answers, [question.id]: value },
    });
  }, [question.id, progress.answers, onUpdate]);

  const handleUnlock = useCallback(() => {
    onUpdate({
      guidanceUnlocked: { ...progress.guidanceUnlocked, [question.id]: true },
      questionTimes: { ...progress.questionTimes, [question.id]: elapsed },
    });
  }, [question.id, progress.guidanceUnlocked, progress.questionTimes, elapsed, onUpdate]);

  const handleToggleSection = useCallback((key: string) => {
    onUpdate({
      expandedSections: {
        ...progress.expandedSections,
        [key]: !progress.expandedSections[key],
      },
    });
  }, [progress.expandedSections, onUpdate]);

  const handleShowSelfMark = useCallback(() => {
    onUpdate({
      showSelfMark: { ...progress.showSelfMark, [question.id]: true },
    });
  }, [question.id, progress.showSelfMark, onUpdate]);

  const handleToggleMark = useCallback((index: number) => {
    const current = progress.selfMarkChecks[question.id] || [];
    const updated = [...current];
    updated[index] = !updated[index];
    onUpdate({
      selfMarkChecks: { ...progress.selfMarkChecks, [question.id]: updated },
    });
  }, [question.id, progress.selfMarkChecks, onUpdate]);

  const handleDeterResponse = useCallback((value: string) => {
    onUpdate({
      deteriorationResponses: { ...progress.deteriorationResponses, [question.id]: value },
    });
  }, [question.id, progress.deteriorationResponses, onUpdate]);

  const approachKey = `${question.id}-approach`;
  const thinkKey = `${question.id}-think`;
  const examinerKey = `${question.id}-examiner`;
  const lowmarkKey = `${question.id}-lowmark`;
  const [showDeterioration, setShowDeterioration] = useState(false);

  return (
    <div>
      {/* Q7 parent perspective */}
      {question.id === 'q7' && (
        <div className="mk-perspective">
          <p className="mk-perspective-label">Sara&rsquo;s perspective</p>
          <p>Imagine you are Sara. You are 19, alone, watching your baby struggle to breathe in an unfamiliar ward. What do you need from the nurse right now?</p>
        </div>
      )}

      <div className="mk-question">
        <div className="mk-q-header">
          <span className="mk-q-numeral">{question.number}</span>
          <div className="mk-q-meta">
            <h3 className="mk-q-title">{question.title}</h3>
            <div className="mk-q-badges">
              {question.marks ? <span className="mk-mark-badge">{question.marks}</span> : null}
              <span className="mk-word-badge">{question.wordGuide}</span>
              <span className="mk-chip" data-accent={isPartB ? 'warm' : 'blue'}>{question.partLabel}</span>
              <button
                type="button"
                className="mk-flag-btn"
                data-flagged={String(!!progress.flaggedQuestions[question.id])}
                onClick={() => onUpdate({
                  flaggedQuestions: { ...progress.flaggedQuestions, [question.id]: !progress.flaggedQuestions[question.id] },
                })}
              >
                {progress.flaggedQuestions[question.id] ? '\u2691 Flagged' : '\u2690 Flag'}
              </button>
            </div>
            {question.focusLabel ? (
              <p className="mk-q-focus">{question.focusLabel}</p>
            ) : null}
          </div>
        </div>

        <p className="mk-q-prompt">{question.prompt}</p>

        {/* Answer textarea — always visible */}
        <div className="mk-answer-wrap">
          <p className="mk-answer-label">Your answer</p>
          <textarea
            className="mk-answer-textarea"
            placeholder="Start writing your answer here..."
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
          <div className="mk-answer-footer">
            <span className="mk-word-count" data-near={String(isNearGuide)}>
              {words} / {wordGuide} words
            </span>
            <span className="mk-timer">{formatTime(elapsed)}</span>
          </div>
          <div className="mk-word-bar">
            <div
              className="mk-word-bar-fill"
              data-over={String(words > wordGuide)}
              style={{ width: `${Math.min((words / wordGuide) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Attempt-first gate */}
        {!isUnlocked && (
          <div className="mk-gate">
            <p className="mk-gate-hint">
              {canUnlock
                ? 'Ready to see the guidance?'
                : `Write at least 30 words to unlock guidance (${words}/30)`
              }
            </p>
            <button
              type="button"
              className="mk-unlock-btn"
              data-ready={String(canUnlock)}
              disabled={!canUnlock}
              onClick={handleUnlock}
            >
              Unlock guidance {'\u2192'}
            </button>
          </div>
        )}

        {/* Guidance layers — only after unlock */}
        {isUnlocked && (
          <div className="mk-guidance-layer" style={{ marginTop: '24px' }}>
            {/* How to approach */}
            <ExpandablePanel
              label="How to approach this question"
              isOpen={!!progress.expandedSections[approachKey]}
              onToggle={() => handleToggleSection(approachKey)}
            >
              <div className="mk-approach">
                <p>{question.howToApproach.whatItsAsking}</p>
                <div className="mk-approach-command">
                  <strong>Command word:</strong> {question.howToApproach.commandWord}
                </div>
                <p className="mk-approach-musts-label">A high-scoring answer must include</p>
                <ul className="mk-expand-list">
                  {question.howToApproach.highScoringMustInclude.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </ExpandablePanel>

            <div className="mk-framework-card">
              <p className="mk-framework-label">Answer structure</p>
              <ol className="mk-framework-list">
                {question.answerStructure.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            {question.exemplarAnswer && question.exemplarAnswer.length > 0 ? (
              <div className="mk-exemplar-card">
                <p className="mk-exemplar-label">Exemplar answer</p>
                {question.exemplarAnswer.map((paragraph, i) => (
                  <p key={i} className="mk-exemplar-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {topBandUnlocks.length > 0 ? (
              <div className="mk-topband-box">
                <p className="mk-topband-label">Top band unlocks</p>
                <ul className="mk-topband-list">
                  {topBandUnlocks.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Think about */}
            <ExpandablePanel
              label="Think about"
              panelClass="mk-think-body"
              isOpen={!!progress.expandedSections[thinkKey]}
              onToggle={() => handleToggleSection(thinkKey)}
            >
              <ul className="mk-expand-list">
                {question.thinkAbout.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </ExpandablePanel>

            {/* Examiner insight */}
            <ExpandablePanel
              label="Examiner insight"
              isOpen={!!progress.expandedSections[examinerKey]}
              onToggle={() => handleToggleSection(examinerKey)}
            >
              <div className="mk-examiner">
                <p className="mk-examiner-sub">What students commonly get wrong</p>
                <p>{question.examinerInsight.commonMistakes}</p>
                <p className="mk-examiner-sub">What pushes an answer into a First</p>
                <p>{question.examinerInsight.whatPushesToFirst}</p>
              </div>
            </ExpandablePanel>

            {/* Clinical reasoning flow */}
            {question.clinicalReasoning && (
              <ClinicalReasoningFlow text={question.clinicalReasoning} />
            )}

            {/* Priority stack */}
            {question.priorityStack && question.priorityStack.length > 0 && (
              <PriorityStack items={question.priorityStack} />
            )}

            {/* Common low-mark answer */}
            <ExpandablePanel
              label="Common low-mark answer"
              isOpen={!!progress.expandedSections[lowmarkKey]}
              onToggle={() => handleToggleSection(lowmarkKey)}
            >
              <div className="mk-lowmark">
                <p>{question.commonLowMarkAnswer}</p>
              </div>
            </ExpandablePanel>

            {/* Deterioration toggle */}
            {question.deterioration && (
              <>
                {!showDeterioration ? (
                  <button
                    type="button"
                    className="mk-deter-toggle"
                    onClick={() => setShowDeterioration(true)}
                  >
                    {'\uD83D\uDEA8'} What if this patient deteriorates?
                  </button>
                ) : (
                  <DeteriorationMode
                    deterioration={question.deterioration}
                    response={progress.deteriorationResponses[question.id] || ''}
                    onResponseChange={handleDeterResponse}
                  />
                )}
              </>
            )}

            {/* Revision links */}
            {question.revisionLinks.length > 0 && (
              <div className="mk-revision-links">
                {question.revisionLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="mk-revision-link">
                    {link.label} &rarr;
                  </Link>
                ))}
              </div>
            )}

            {/* Self-mark */}
            {question.markingCriteria && question.markingCriteria.length > 0 && (
              <>
                {!showingSelfMark ? (
                  <button
                    type="button"
                    className="mk-mark-btn"
                    onClick={handleShowSelfMark}
                  >
                    Mark my answer
                  </button>
                ) : (
                  <SelfMarkChecklist
                    criteria={question.markingCriteria}
                    checks={progress.selfMarkChecks[question.id] || []}
                    onToggle={handleToggleMark}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function MockExamClient({ mock }: { mock: MockExam }) {
  const [progress, setProgress] = useState<MockProgress>(() => loadProgress(mock.id));
  const [mobileSheet, setMobileSheet] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allQuestions = [...mock.questionsPartA, ...mock.questionsPartB];
  // Steps: 0 = scenario, 1-8 = questions, 9 = review
  const totalSteps = allQuestions.length + 2;
  const currentStep = progress.currentStep;

  // Auto-save on progress change
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProgress(mock.id, progress);
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [progress, mock.id]);

  const handleUpdate = useCallback((partial: Partial<MockProgress>) => {
    setProgress((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleNavigate = useCallback((step: number) => {
    setProgress((prev) => ({ ...prev, currentStep: step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goNext = useCallback(() => {
    setProgress((prev) => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, totalSteps - 1) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setProgress((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 0) }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRetake = useCallback(() => {
    const cleared = { ...emptyProgress };
    setProgress(cleared);
    saveProgress(mock.id, cleared);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mock.id]);

  // Current question (for steps 1-8)
  const currentQuestion = currentStep >= 1 && currentStep <= allQuestions.length
    ? allQuestions[currentStep - 1]
    : null;
  const isPartB = currentQuestion ? currentQuestion.partLabel === 'Part B' : false;
  const isFirstPartBQuestion = currentQuestion?.id === 'q6';

  // Stats for review
  const answeredCount = allQuestions.filter((q) => countWords(progress.answers[q.id] || '') > 0).length;
  const totalWords = allQuestions.reduce((sum, q) => sum + countWords(progress.answers[q.id] || ''), 0);
  const totalTime = Object.values(progress.questionTimes).reduce((a, b) => a + b, 0);
  const flaggedCount = Object.values(progress.flaggedQuestions).filter(Boolean).length;
  const avgWordsPerQ = answeredCount > 0 ? Math.round(totalWords / answeredCount) : 0;

  // Performance domain scores (from self-mark)
  const totalChecks = Object.values(progress.selfMarkChecks).flat();
  const checkedCount = totalChecks.filter(Boolean).length;
  const totalPossible = totalChecks.length;
  const overallPct = totalPossible > 0 ? Math.round((checkedCount / totalPossible) * 100) : 0;

  // Skills assessed
  const skillsAssessed = [
    'Anatomy & Physiology', 'Clinical Reasoning', 'Pathophysiology',
    'Paediatric Specificity', 'Family-Centred Care', 'Developmental Theory',
    'MDT Coordination', 'Answer Structure',
  ];

  return (
    <div className="mk">
      <style dangerouslySetInnerHTML={{ __html: MOCK_PAGE_CSS + MOCK_INTERACTIVE_CSS }} />

      {/* Step tracker */}
      <StepTracker
        totalSteps={totalSteps}
        currentStep={currentStep}
        onNavigate={handleNavigate}
      />

      <main className="mk-wrap">
        {/* Back */}
        <Link href={`/hub/mocks/${mock.system}`} className="mk-back">
          <span aria-hidden="true">&larr;</span> {mock.system} mocks
        </Link>

        {/* Masthead  — always visible */}
        <p className="mk-kicker">Written Practice &middot; {mock.condition}</p>
        <h1 className="mk-headline">{mock.title}</h1>
        <p className="mk-standfirst">{mock.description}</p>

        <hr className="mk-divider" />

        {/* ═══════ STEP 0: PREMIUM INTRO ═══════ */}
        {currentStep === 0 && (
          <>
            {/* Metadata chips */}
            <motion.div className="mk-chips" initial="hidden" animate="visible" variants={fadeIn}>
              <span className="mk-chip" data-accent="blue">{mock.system}</span>
              <span className="mk-chip" data-accent="sage">Children{"'s"} Nursing</span>
              <span className="mk-chip">Long-Answer Mock</span>
              <span className="mk-chip">{allQuestions.length} Questions</span>
              <span className="mk-chip" data-accent="warm">~90 min</span>
            </motion.div>

            {/* Stats row */}
            <motion.div className="mk-intro-stats" custom={1} initial="hidden" animate="visible" variants={fadeUp}>
              <div>
                <p className="mk-intro-stat-num">{allQuestions.length}</p>
                <p className="mk-intro-stat-label">Questions</p>
              </div>
              <div>
                <p className="mk-intro-stat-num">2</p>
                <p className="mk-intro-stat-label">Parts</p>
              </div>
              <div>
                <p className="mk-intro-stat-num">~90</p>
                <p className="mk-intro-stat-label">Minutes</p>
              </div>
              <div>
                <p className="mk-intro-stat-num">{mock.questionsPartA.length + mock.questionsPartB.length}</p>
                <p className="mk-intro-stat-label">Marking criteria</p>
              </div>
            </motion.div>

            {/* Clinical scenario — card grid */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
              <div className="mk-scenario-grid">
                {/* Patient overview */}
                <div className="mk-scenario-card">
                  <p className="mk-scenario-card-label">Patient</p>
                  <h2 className="mk-scenario-child">{mock.scenario.childName}</h2>
                  <p className="mk-scenario-age">{mock.scenario.age}</p>
                  <p style={{ fontSize: '13px', fontWeight: 300, color: '#2C2A27', lineHeight: 1.65, marginTop: '8px' }}>
                    {mock.scenario.presentingComplaint} ({mock.scenario.duration})
                  </p>
                </div>

                {/* Observations */}
                <div className="mk-scenario-card">
                  <p className="mk-scenario-card-label">Observations</p>
                  <div className="mk-obs-grid">
                    {mock.scenario.observations.map((obs) => (
                      <div key={obs.label} className="mk-obs-item" data-abnormal={String(isAbnormal(obs.label, obs.value))}>
                        <p className="mk-obs-label">{obs.label}</p>
                        <p className="mk-obs-value">{obs.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinical signs */}
                <div className="mk-scenario-card">
                  <p className="mk-scenario-card-label">Clinical Signs</p>
                  <ul className="mk-scenario-signs">
                    {mock.scenario.clinicalSigns.map((sign, i) => (
                      <li key={i}>{sign}</li>
                    ))}
                  </ul>
                  <p className="mk-scenario-diagnosis">
                    <strong>Diagnosis:</strong> {mock.scenario.diagnosis}
                  </p>
                </div>

                {/* Family context */}
                <div className="mk-scenario-card">
                  <p className="mk-scenario-card-label">Family Context</p>
                  <p style={{ fontSize: '13px', fontWeight: 300, color: '#5A5750', lineHeight: 1.65 }}>
                    {mock.scenario.familyContext}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* What this mock tests */}
            <motion.div className="mk-guidance" custom={3} initial="hidden" animate="visible" variants={fadeUp}>
              <h2 className="mk-guidance-title">What this mock is testing</h2>
              <ul className="mk-guidance-list">
                {mock.whatThisMockTests.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>

            {/* Skills assessed */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <p style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>
                Skills assessed
              </p>
              <div className="mk-skills">
                {skillsAssessed.map((skill) => (
                  <span key={skill} className="mk-skill-pill">{skill}</span>
                ))}
              </div>
            </motion.div>

            {/* What strong answers do */}
            <motion.div className="mk-strong-answers" custom={5} initial="hidden" animate="visible" variants={fadeUp}>
              <h2 className="mk-strong-answers-title">What strong answers do</h2>
              <ul className="mk-guidance-list">
                {mock.whatGetsYouAFirst.slice(0, 4).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </motion.div>

            {/* Part A progression */}
            {mock.partAProgression.length > 0 && (
              <motion.div className="mk-progression" custom={6} initial="hidden" animate="visible" variants={fadeUp}>
                <p className="mk-progression-label">How Part A builds</p>
                <ul className="mk-expand-list">
                  {mock.partAProgression.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Read note + CTA */}
            <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp} style={{ marginTop: '8px' }}>
              <p className="mk-read-note" style={{ marginBottom: '28px' }}>
                Take your time with this scenario. Every detail {'\u2014'} the observations, the family context, the clinical signs {'\u2014'} will be relevant to your answers.
              </p>
              <button type="button" className="mk-begin-cta" onClick={goNext}>
                Begin Part A <span aria-hidden="true">{'\u2192'}</span>
              </button>
            </motion.div>
          </>
        )}

        {/* ═══════ STEPS 1-8: QUESTIONS (SPLIT-SCREEN) ═══════ */}
        {currentQuestion && (
          <>
            {/* Part label */}
            {(currentStep === 1 || isFirstPartBQuestion) && (
              <p className="mk-part-label">
                {isPartB ? 'Part B \u2014 Questions 6\u20138' : 'Part A \u2014 Questions 1\u20135'}
              </p>
            )}

            {/* Part B transition */}
            {isFirstPartBQuestion && (
              <div className="mk-transition">
                <p className="mk-transition-label">Shifting focus</p>
                <p className="mk-transition-text">
                  Part B moves from clinical science to the human side of care. You are now thinking about {mock.scenario.childName} as a developing child, Sara as an anxious parent, and the nursing team as the people who bring it all together.
                </p>
              </div>
            )}

            {/* Split-screen layout */}
            <div className="mk-split">
              <ScenarioSidebar mock={mock} />

              <div className="mk-main-panel">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <QuestionStep
                      question={currentQuestion}
                      progress={progress}
                      onUpdate={handleUpdate}
                      isPartB={isPartB}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile scenario toggle */}
            <button
              type="button"
              className="mk-scenario-fab"
              onClick={() => setMobileSheet(true)}
            >
              View scenario
            </button>
            <ScenarioSheet
              mock={mock}
              open={mobileSheet}
              onClose={() => setMobileSheet(false)}
            />

            {/* Navigation */}
            <div className="mk-step-nav">
              <button type="button" className="mk-step-nav-prev" onClick={goPrev}>
                {'\u2190'} Previous
              </button>
              <button type="button" className="mk-step-nav-next" onClick={goNext}>
                {currentStep < allQuestions.length ? 'Next question' : 'Review'} <span aria-hidden="true">{'\u2192'}</span>
              </button>
            </div>
          </>
        )}

        {/* ═══════ STEP 9: PREMIUM REVIEW ═══════ */}
        {currentStep === totalSteps - 1 && (
          <>
            {/* Summary grid */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <h2 className="mk-summary-title" style={{ marginBottom: '20px' }}>Your mock summary</h2>
              <div className="mk-review-grid">
                <div className="mk-review-card">
                  <p className="mk-review-card-label">Questions answered</p>
                  <p className="mk-review-card-value">{answeredCount}/{allQuestions.length}</p>
                </div>
                <div className="mk-review-card">
                  <p className="mk-review-card-label">Words written</p>
                  <p className="mk-review-card-value">{totalWords.toLocaleString()}</p>
                  <p className="mk-review-card-sub">{avgWordsPerQ} avg per question</p>
                </div>
                <div className="mk-review-card">
                  <p className="mk-review-card-label">Time spent</p>
                  <p className="mk-review-card-value">{formatTime(totalTime)}</p>
                </div>
                <div className="mk-review-card">
                  <p className="mk-review-card-label">Flagged for review</p>
                  <p className="mk-review-card-value">{flaggedCount}</p>
                  <p className="mk-review-card-sub">{flaggedCount > 0 ? 'Review these first' : 'None flagged'}</p>
                </div>
              </div>
            </motion.div>

            {/* Performance domain bars */}
            {overallPct > 0 && (
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                <h2 className="mk-summary-title" style={{ marginBottom: '18px' }}>Self-assessment overview</h2>
                <div className="mk-perf-bars">
                  {[
                    { label: 'Overall marking', pct: overallPct, colour: '#8BBCAA' },
                    { label: 'Questions completed', pct: Math.round((answeredCount / allQuestions.length) * 100), colour: '#7BA7CC' },
                    { label: 'Word engagement', pct: Math.min(Math.round((totalWords / (allQuestions.length * 300)) * 100), 100), colour: '#D4A574' },
                  ].map((bar) => (
                    <div key={bar.label} className="mk-perf-bar-row">
                      <span className="mk-perf-bar-label">{bar.label}</span>
                      <div className="mk-perf-bar-track">
                        <div className="mk-perf-bar-fill" style={{ width: `${bar.pct}%`, background: bar.colour }} />
                      </div>
                      <span className="mk-perf-bar-pct">{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Question-by-question mini review */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
              <h2 className="mk-summary-title" style={{ marginBottom: '16px' }}>Question breakdown</h2>
              <div className="mk-q-review">
                {allQuestions.map((q) => {
                  const w = countWords(progress.answers[q.id] || '');
                  const t = progress.questionTimes[q.id] || 0;
                  const checks = progress.selfMarkChecks[q.id] || [];
                  const marked = checks.filter(Boolean).length;
                  const total = q.markingCriteria?.length || 0;
                  const flagged = !!progress.flaggedQuestions[q.id];
                  return (
                    <div
                      key={q.id}
                      className="mk-q-review-item"
                      onClick={() => handleNavigate(q.number)}
                      style={flagged ? { borderLeft: '2px solid #D4A574' } : undefined}
                    >
                      <p className="mk-q-review-num">{q.number}</p>
                      <p className="mk-q-review-title">{q.title}</p>
                      <p className="mk-q-review-meta">
                        {w} words {'\u00B7'} {formatTime(t)}
                        {total > 0 && ` \u00B7 ${marked}/${total} marked`}
                        {flagged && ' \u00B7 \u2691 Flagged'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Sentence bank */}
            <SentenceBank sentences={mock.sentenceBank} />

            {/* Post-mock analysis */}
            <motion.div className="mk-post" custom={3} initial="hidden" animate="visible" variants={fadeUp}>
              <div className="mk-post-section">
                <h2 className="mk-post-title">What gets you a first</h2>
                <div className="mk-first-body">
                  <ul className="mk-post-list">
                    {mock.whatGetsYouAFirst.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mk-post-section">
                <h2 className="mk-post-title">Common mistakes</h2>
                <div className="mk-mistakes-body">
                  <ul className="mk-post-list">
                    {mock.commonMistakes.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mk-post-section">
                <h2 className="mk-post-title">How to structure your answers</h2>
                <ul className="mk-post-list">
                  {mock.howToStructure.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* References */}
            {mock.references && mock.references.length > 0 && (
              <div className="mk-references">
                <p className="mk-references-title">Sources &amp; References</p>
                <div className="mk-ref-list">
                  {mock.references.map((ref: MockReference) => (
                    <a
                      key={ref.citation}
                      href={ref.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mk-ref-item mk-ref-link"
                    >
                      {ref.citation} — {ref.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Completion actions */}
            <div className="mk-complete">
              <h2 className="mk-complete-title">Mock complete</h2>
              <p className="mk-complete-desc">
                Review your work, retake the mock, or try another system.
              </p>
              <div className="mk-complete-actions">
                <button
                  type="button"
                  className="mk-complete-btn-secondary"
                  onClick={() => handleNavigate(1)}
                >
                  Review answers
                </button>
                <button
                  type="button"
                  className="mk-complete-btn-secondary"
                  onClick={handleRetake}
                >
                  Retake mock
                </button>
                <Link href="/hub/mocks" className="mk-complete-btn-primary">
                  Try another system &rarr;
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div className="mk-step-nav">
              <button type="button" className="mk-step-nav-prev" onClick={goPrev}>
                {'\u2190'} Back to Q{allQuestions.length}
              </button>
              <div />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
