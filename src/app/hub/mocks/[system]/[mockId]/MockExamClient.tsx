'use client';

import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import type { MockExam, MockQuestion } from '../../mockTypes';
import { MOCK_PAGE_CSS } from '../../mockStyles';
import { MOCK_INTERACTIVE_CSS } from '../../mockStyles';

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

  const handleRevealStructure = useCallback(() => {
    onUpdate({
      revealedStructures: { ...progress.revealedStructures, [question.id]: true },
    });
  }, [question.id, progress.revealedStructures, onUpdate]);

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
  const scoreKey = `${question.id}-score`;
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
            <span className="mk-q-word-guide">{question.wordGuide}</span>
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

            {/* Answer structure */}
            {!progress.revealedStructures[question.id] ? (
              <button
                type="button"
                className="mk-reveal-btn"
                onClick={handleRevealStructure}
              >
                Reveal answer structure
              </button>
            ) : (
              <div className="mk-reveal-body" style={{ marginTop: '12px', marginBottom: '10px' }}>
                <ol>
                  {question.answerStructure.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* To score highly */}
            <ExpandablePanel
              label="To score highly"
              panelClass="mk-score-body"
              isOpen={!!progress.expandedSections[scoreKey]}
              onToggle={() => handleToggleSection(scoreKey)}
            >
              <ul className="mk-expand-list">
                {question.toScoreHighly.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </ExpandablePanel>

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
        <p className="mk-kicker">Mock Exam &middot; {mock.condition}</p>
        <h1 className="mk-headline">{mock.title}</h1>
        <p className="mk-standfirst">{mock.description}</p>

        <hr className="mk-divider" />

        {/* ═══════ STEP 0: SCENARIO ═══════ */}
        {currentStep === 0 && (
          <>
            {/* What this mock tests */}
            <div className="mk-guidance">
              <h2 className="mk-guidance-title">What this mock is testing</h2>
              <ul className="mk-guidance-list">
                {mock.whatThisMockTests.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Scenario */}
            <div className="mk-scenario">
              <p className="mk-scenario-label">Clinical Scenario</p>
              <h2 className="mk-scenario-child">{mock.scenario.childName}</h2>
              <p className="mk-scenario-age">{mock.scenario.age}</p>

              <p className="mk-scenario-complaint">
                {mock.scenario.presentingComplaint} ({mock.scenario.duration})
              </p>

              <div className="mk-obs-grid">
                {mock.scenario.observations.map((obs) => (
                  <div key={obs.label} className="mk-obs-item">
                    <p className="mk-obs-label">{obs.label}</p>
                    <p className="mk-obs-value">{obs.value}</p>
                  </div>
                ))}
              </div>

              <p className="mk-scenario-signs-label">Clinical signs</p>
              <ul className="mk-scenario-signs">
                {mock.scenario.clinicalSigns.map((sign, i) => (
                  <li key={i}>{sign}</li>
                ))}
              </ul>

              <p className="mk-scenario-diagnosis">
                <strong>Diagnosis:</strong> {mock.scenario.diagnosis}
              </p>

              <p className="mk-scenario-family">{mock.scenario.familyContext}</p>

              <p className="mk-read-note">
                Take your time with this scenario. Every detail {'\u2014'} the observations, the family context, the clinical signs {'\u2014'} will be relevant to your answers.
              </p>
            </div>

            {/* Part A progression */}
            {mock.partAProgression.length > 0 && (
              <div className="mk-progression">
                <p className="mk-progression-label">How Part A builds</p>
                <ul className="mk-expand-list">
                  {mock.partAProgression.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation */}
            <div className="mk-step-nav">
              <div />
              <button type="button" className="mk-step-nav-next" onClick={goNext}>
                Begin Part A <span aria-hidden="true">{'\u2192'}</span>
              </button>
            </div>
          </>
        )}

        {/* ═══════ STEPS 1-8: QUESTIONS ═══════ */}
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
                  Part B moves from clinical science to the human side of care. You are now thinking about Ellie as a developing child, Sara as an anxious parent, and the nursing team as the people who bring it all together.
                </p>
              </div>
            )}

            <QuestionStep
              question={currentQuestion}
              progress={progress}
              onUpdate={handleUpdate}
              isPartB={isPartB}
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

        {/* ═══════ STEP 9: REVIEW ═══════ */}
        {currentStep === totalSteps - 1 && (
          <>
            {/* Summary */}
            <div className="mk-summary">
              <h2 className="mk-summary-title">Your mock summary</h2>
              <div className="mk-summary-stats">
                <div className="mk-summary-stat">
                  <p className="mk-summary-stat-num">{answeredCount}/{allQuestions.length}</p>
                  <p className="mk-summary-stat-label">Questions answered</p>
                </div>
                <div className="mk-summary-stat">
                  <p className="mk-summary-stat-num">{totalWords.toLocaleString()}</p>
                  <p className="mk-summary-stat-label">Words written</p>
                </div>
                <div className="mk-summary-stat">
                  <p className="mk-summary-stat-num">{formatTime(totalTime)}</p>
                  <p className="mk-summary-stat-label">Time spent</p>
                </div>
              </div>
            </div>

            {/* Sentence bank */}
            <SentenceBank sentences={mock.sentenceBank} />

            {/* Post-mock analysis */}
            <div className="mk-post">
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
            </div>

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
                {'\u2190'} Back to Q8
              </button>
              <div />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
