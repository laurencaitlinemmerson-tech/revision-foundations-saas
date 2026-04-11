'use client';

import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import type { MockExam, MockQuestion } from '../../mockTypes';
import { MOCK_PAGE_CSS } from '../../mockStyles';

// ── localStorage helpers ────────────────────────────────────────────────────

function storageKey(mockId: string) {
  return `rf_mock_${mockId}`;
}

interface MockProgress {
  answers: Record<string, string>;
  expandedSections: Record<string, boolean>;
  revealedStructures: Record<string, boolean>;
}

function loadProgress(mockId: string): MockProgress {
  if (typeof window === 'undefined') return { answers: {}, expandedSections: {}, revealedStructures: {} };
  try {
    const raw = localStorage.getItem(storageKey(mockId));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { answers: {}, expandedSections: {}, revealedStructures: {} };
}

function saveProgress(mockId: string, progress: MockProgress) {
  try {
    localStorage.setItem(storageKey(mockId), JSON.stringify(progress));
  } catch { /* ignore */ }
}

// ── Word count ──────────────────────────────────────────────────────────────

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Expandable section ──────────────────────────────────────────────────────

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
    <div style={{ marginBottom: isOpen ? '0' : '10px' }}>
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

// ── Question block ──────────────────────────────────────────────────────────

function QuestionBlock({
  question,
  answer,
  onAnswerChange,
  expandedSections,
  onToggleSection,
  structureRevealed,
  onRevealStructure,
  savedAt,
}: {
  question: MockQuestion;
  answer: string;
  onAnswerChange: (id: string, value: string) => void;
  expandedSections: Record<string, boolean>;
  onToggleSection: (key: string) => void;
  structureRevealed: boolean;
  onRevealStructure: (id: string) => void;
  savedAt: string | null;
}) {
  const approachKey = `${question.id}-approach`;
  const scoreKey = `${question.id}-score`;
  const thinkKey = `${question.id}-think`;
  const examinerKey = `${question.id}-examiner`;
  const reasoningKey = `${question.id}-reasoning`;
  const lowmarkKey = `${question.id}-lowmark`;
  const deteriorationKey = `${question.id}-deterioration`;
  const words = countWords(answer);

  return (
    <div className="mk-question" id={`question-${question.id}`}>
      <div className="mk-q-header">
        <span className="mk-q-numeral">{question.number}</span>
        <div className="mk-q-meta">
          <h3 className="mk-q-title">{question.title}</h3>
          <span className="mk-q-word-guide">{question.wordGuide}</span>
        </div>
      </div>

      <p className="mk-q-prompt">{question.prompt}</p>

      {/* How to approach this question */}
      <ExpandablePanel
        label="How to approach this question"
        isOpen={!!expandedSections[approachKey]}
        onToggle={() => onToggleSection(approachKey)}
      >
        <div className="mk-approach">
          <p className="mk-approach-label">How to approach this question</p>
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

      {/* Answer structure reveal */}
      {!structureRevealed ? (
        <button
          type="button"
          className="mk-reveal-btn"
          onClick={() => onRevealStructure(question.id)}
        >
          Reveal answer structure
        </button>
      ) : (
        <div className="mk-reveal-body" style={{ marginTop: '12px' }}>
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
        isOpen={!!expandedSections[scoreKey]}
        onToggle={() => onToggleSection(scoreKey)}
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
        isOpen={!!expandedSections[thinkKey]}
        onToggle={() => onToggleSection(thinkKey)}
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
        isOpen={!!expandedSections[examinerKey]}
        onToggle={() => onToggleSection(examinerKey)}
      >
        <div className="mk-examiner">
          <p className="mk-examiner-label">Examiner insight</p>
          <p className="mk-examiner-sub">What students commonly get wrong</p>
          <p>{question.examinerInsight.commonMistakes}</p>
          <p className="mk-examiner-sub">What pushes an answer into a First</p>
          <p>{question.examinerInsight.whatPushesToFirst}</p>
        </div>
      </ExpandablePanel>

      {/* Clinical reasoning chain */}
      {question.clinicalReasoning && (
        <ExpandablePanel
          label="Clinical reasoning chain"
          isOpen={!!expandedSections[reasoningKey]}
          onToggle={() => onToggleSection(reasoningKey)}
        >
          <div className="mk-reasoning">
            <p className="mk-reasoning-label">Clinical reasoning</p>
            <p>{question.clinicalReasoning}</p>
          </div>
        </ExpandablePanel>
      )}

      {/* Common low-mark answer */}
      <ExpandablePanel
        label="Common low-mark answer"
        isOpen={!!expandedSections[lowmarkKey]}
        onToggle={() => onToggleSection(lowmarkKey)}
      >
        <div className="mk-lowmark">
          <p className="mk-lowmark-label">Common low-mark answer</p>
          <p>{question.commonLowMarkAnswer}</p>
        </div>
      </ExpandablePanel>

      {/* If this patient deteriorates */}
      {question.deterioration && (
        <ExpandablePanel
          label="If this patient deteriorates\u2026"
          isOpen={!!expandedSections[deteriorationKey]}
          onToggle={() => onToggleSection(deteriorationKey)}
        >
          <div className="mk-deterioration">
            <p className="mk-deterioration-label">If this patient deteriorates</p>
            <div className="mk-deterioration-row">
              <p className="mk-deterioration-sub">What changes clinically</p>
              <p>{question.deterioration.clinicalChanges}</p>
            </div>
            <div className="mk-deterioration-row">
              <p className="mk-deterioration-sub">What this indicates</p>
              <p>{question.deterioration.whatItIndicates}</p>
            </div>
            <div className="mk-deterioration-row">
              <p className="mk-deterioration-sub">What the nurse should do</p>
              <p>{question.deterioration.nurseAction}</p>
            </div>
          </div>
        </ExpandablePanel>
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

      {/* Answer input */}
      <div className="mk-answer-wrap">
        <p className="mk-answer-label">Your answer</p>
        <textarea
          className="mk-answer-textarea"
          placeholder="Start writing your answer here..."
          value={answer}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
        />
        <div className="mk-answer-footer">
          <span className="mk-word-count">{words} {words === 1 ? 'word' : 'words'}</span>
          {savedAt && <span className="mk-autosave">Saved</span>}
        </div>
      </div>
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
              {copiedIdx === i ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function MockExamClient({ mock }: { mock: MockExam }) {
  const [progress, setProgress] = useState<MockProgress>(() => loadProgress(mock.id));
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save on progress change
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveProgress(mock.id, progress);
      setSavedAt(new Date().toLocaleTimeString());
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [progress, mock.id]);

  const allQuestions = [...mock.questionsPartA, ...mock.questionsPartB];
  const answeredCount = allQuestions.filter((q) => countWords(progress.answers[q.id] || '') > 0).length;
  const totalQuestions = allQuestions.length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
  const isComplete = answeredCount === totalQuestions;

  const handleAnswerChange = useCallback((qId: string, value: string) => {
    setProgress((prev) => ({
      ...prev,
      answers: { ...prev.answers, [qId]: value },
    }));
  }, []);

  const handleToggleSection = useCallback((key: string) => {
    setProgress((prev) => ({
      ...prev,
      expandedSections: {
        ...prev.expandedSections,
        [key]: !prev.expandedSections[key],
      },
    }));
  }, []);

  const handleRevealStructure = useCallback((qId: string) => {
    setProgress((prev) => ({
      ...prev,
      revealedStructures: { ...prev.revealedStructures, [qId]: true },
    }));
  }, []);

  const handleRetake = useCallback(() => {
    const cleared: MockProgress = { answers: {}, expandedSections: {}, revealedStructures: {} };
    setProgress(cleared);
    saveProgress(mock.id, cleared);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mock.id]);

  return (
    <div className="mk">
      <style dangerouslySetInnerHTML={{ __html: MOCK_PAGE_CSS }} />

      {/* Progress bar */}
      <div className="mk-progress-bar">
        <div className="mk-progress-inner">
          <span className="mk-progress-label">Progress</span>
          <div className="mk-progress-track">
            <div className="mk-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="mk-progress-count">{answeredCount}/{totalQuestions}</span>
        </div>
      </div>

      <main className="mk-wrap">
        {/* Back */}
        <Link href={`/hub/mocks/${mock.system}`} className="mk-back">
          <span aria-hidden="true">&larr;</span> {mock.system} mocks
        </Link>

        {/* Masthead */}
        <p className="mk-kicker">Mock Exam &middot; {mock.condition}</p>
        <h1 className="mk-headline">{mock.title}</h1>
        <p className="mk-standfirst">{mock.description}</p>

        <hr className="mk-divider" />

        {/* Pre-mock guidance */}
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

          <p className="mk-scenario-complaint">{mock.scenario.presentingComplaint} ({mock.scenario.duration})</p>

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
        </div>

        {/* Part A progression */}
        {mock.partAProgression.length > 0 && (
          <div className="mk-progression">
            <p className="mk-progression-label">Part A flow — how these questions build</p>
            <ul className="mk-expand-list">
              {mock.partAProgression.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Part A */}
        <p className="mk-part-label">Part A &mdash; Questions 1&ndash;5</p>
        {mock.questionsPartA.map((q) => (
          <QuestionBlock
            key={q.id}
            question={q}
            answer={progress.answers[q.id] || ''}
            onAnswerChange={handleAnswerChange}
            expandedSections={progress.expandedSections}
            onToggleSection={handleToggleSection}
            structureRevealed={!!progress.revealedStructures[q.id]}
            onRevealStructure={handleRevealStructure}
            savedAt={savedAt}
          />
        ))}

        {/* Part B */}
        <p className="mk-part-label" style={{ marginTop: '24px' }}>Part B &mdash; Questions 6&ndash;8</p>
        {mock.questionsPartB.map((q) => (
          <QuestionBlock
            key={q.id}
            question={q}
            answer={progress.answers[q.id] || ''}
            onAnswerChange={handleAnswerChange}
            expandedSections={progress.expandedSections}
            onToggleSection={handleToggleSection}
            structureRevealed={!!progress.revealedStructures[q.id]}
            onRevealStructure={handleRevealStructure}
            savedAt={savedAt}
          />
        ))}

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

        {/* Completion state */}
        {isComplete && (
          <div className="mk-complete">
            <h2 className="mk-complete-title">Mock complete</h2>
            <p className="mk-complete-desc">
              You have written answers for all {totalQuestions} questions. Review your work, retake the mock, or try another system.
            </p>
            <div className="mk-complete-actions">
              <button
                type="button"
                className="mk-complete-btn-secondary"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
        )}
      </main>
    </div>
  );
}
