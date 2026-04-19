'use client';

import { useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Send, ImagePlus, Loader2, X } from 'lucide-react';
import { CSS } from './questionsBoardStyles';
import { TAGS, STARTER_PROMPTS, timeAgo } from './questionsBoardData';

export interface Question {
  id: string;
  clerk_user_id: string;
  user_name: string;
  title: string;
  body: string;
  tags: string[];
  is_answered: boolean;
  created_at: string;
  image_url?: string;
}

const STATUS_FILTERS: Array<{ label: string; value: string | null }> = [
  { label: 'All questions', value: null },
  { label: 'Open only', value: 'false' },
  { label: 'Answered', value: 'true' },
];

export default function QuestionsBoardClient({
  initialQuestions,
  isSignedIn,
}: {
  initialQuestions: Question[];
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);
  const [showAskForm, setShowAskForm] = useState(false);
  const [askPromptDismissed, setAskPromptDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterAnswered, setFilterAnswered] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [autoOpenAsk] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('ask') === '1';
  });
  const questionTitleId = useId();
  const questionDetailsId = useId();
  const questionTopicsGroupId = useId();
  const questionImageGroupId = useId();
  const questionImageInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const shouldAutoOpenAsk = isSignedIn && autoOpenAsk && !askPromptDismissed;
  const isAskFormOpen = showAskForm || shouldAutoOpenAsk;

  const answeredCount = useMemo(
    () => questions.filter((q) => q.is_answered).length,
    [questions],
  );
  const openCount = questions.length - answeredCount;

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch =
        searchQuery === '' ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.body.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !filterTag || q.tags.includes(filterTag);
      const matchesAnswered =
        !filterAnswered ||
        (filterAnswered === 'true' ? q.is_answered : !q.is_answered);
      return matchesSearch && matchesTag && matchesAnswered;
    });
  }, [filterAnswered, filterTag, questions, searchQuery]);

  const hasActiveFilters = Boolean(searchQuery || filterTag || filterAnswered);
  const hasQuestions = questions.length > 0;
  const hasMatches = filteredQuestions.length > 0;
  const activeFilterLabels = [
    searchQuery ? 'Search active' : null,
    filterAnswered === 'true' ? 'Answered only' : filterAnswered === 'false' ? 'Open only' : null,
    filterTag,
  ].filter(Boolean) as string[];

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
        setImageUrl(data.url);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to upload image');
      }
    } catch {
      alert('Failed to upload image');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), tags: selectedTags, image_url: imageUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.question) setQuestions((prev) => [data.question, ...prev]);
        setTitle('');
        setBody('');
        setSelectedTags([]);
        setImageUrl(null);
        setShowAskForm(false);
        setAskPromptDismissed(true);
        router.refresh();
      }
    } catch {
      // silent
    }
    setSubmitting(false);
  };

  return (
    <div className="qb-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main className="qb-main">
        {/* Breadcrumb */}
        <nav className="qb-breadcrumb">
          <Link href="/hub">Hub</Link>
          <span>/</span>
          <span>Q&amp;A Board</span>
        </nav>

        {/* Masthead */}
        <section className="qb-hero">
          <div className="qb-hero-copy">
            <p className="qb-kicker">The Nurse Lab &middot; Student Questions</p>
            <h1 className="qb-headline">Questions and answers for the messy bits of nursing school.</h1>
            <p className="qb-standfirst">
              Ask about placements, OSCEs, calculations, or where to start in the hub. Keep it practical, keep it general, and keep it study-safe.
            </p>

            <div className="qb-hero-points" aria-label="What makes a good thread">
              <span className="qb-hero-point">Name the exact step</span>
              <span className="qb-hero-point">Say what you already tried</span>
              <span className="qb-hero-point">Add a screenshot if it helps</span>
            </div>
          </div>

          <aside className="qb-hero-note">
            <span className="qb-hero-note-kicker">What helps</span>
            <p className="qb-hero-note-title">Clear threads get calmer answers.</p>
            <p className="qb-hero-note-desc">
              The best posts stay specific, give just enough context, and make it easy for someone else to answer without guessing.
            </p>
          </aside>
        </section>

        {/* Top bar: actions + stats */}
        <div className="qb-top-bar">
          <div>
            <div className="qb-actions">
              {isSignedIn ? (
                <button
                  type="button"
                  className="qb-btn-primary"
                  onClick={() => { setAskPromptDismissed(false); setShowAskForm(true); }}
                >
                  + Ask a question
                </button>
              ) : (
                <Link href="/sign-in" className="qb-btn-primary">
                  Sign in to ask a question
                </Link>
              )}
              <Link href="/hub" className="qb-btn-secondary">
                &larr; Back to hub
              </Link>
            </div>
          </div>

          <div className="qb-stats">
            {hasQuestions ? (
              <>
                <span className="qb-stats-kicker">Board snapshot</span>
                <div className="qb-stats-grid">
                  <div className="qb-stat-cell">
                    <span className="qb-stat-label">Answered</span>
                    <span className="qb-stat-num">{answeredCount}</span>
                  </div>
                  <div className="qb-stat-cell">
                    <span className="qb-stat-label">Open</span>
                    <span className="qb-stat-num">{openCount}</span>
                  </div>
                </div>
                <p className="qb-stats-desc">
                  Short, clear questions work best here. Add a screenshot when the wording or layout is the problem.
                </p>
              </>
            ) : (
              <>
                <span className="qb-stats-kicker">A good first post</span>
                <div className="qb-prompt-list">
                  {STARTER_PROMPTS.slice(0, 2).map((p) => (
                    <div key={p.title} className="qb-prompt-card">
                      <span className="qb-prompt-card-eyebrow">Example</span>
                      <p className="qb-prompt-card-title">{p.title}</p>
                      <p className="qb-prompt-card-desc">{p.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filter shelf */}
        <div className="qb-shelf">
          <div className="qb-shelf-header">
            <div>
              <span className="qb-shelf-kicker">Refine the board</span>
              <p className="qb-shelf-title">Find the right thread faster.</p>
            </div>
            <span className="qb-filter-meta">
              {hasQuestions
                ? `${filteredQuestions.length} ${filteredQuestions.length === 1 ? 'question' : 'questions'}`
                : 'Ready for the first question'}
            </span>
          </div>

          <div className="qb-shelf-search-row">
            <div className="qb-search-wrap">
              <Search className="qb-search-icon" />
              <input
                type="text"
                className="qb-search"
                placeholder="Search questions, placements, calculations..."
                aria-label="Search questions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                className="qb-clear-btn"
                onClick={() => { setSearchQuery(''); setFilterTag(null); setFilterAnswered(null); }}
              >
                <X style={{ width: '12px', height: '12px' }} />
                Reset view
              </button>
            )}
          </div>

          <div className="qb-shelf-groups">
            <div className="qb-filter-group">
              <span className="qb-filter-label">Status</span>
              <div className="qb-filter-pills" role="group" aria-label="Filter questions by answer status">
                {STATUS_FILTERS.map((filter) => {
                  const isActive = filterAnswered === filter.value;
                  return (
                    <button
                      key={filter.label}
                      type="button"
                      className={`qb-filter-pill${isActive ? ' active' : ''}`}
                      aria-pressed={isActive}
                      onClick={() => setFilterAnswered(filter.value)}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="qb-filter-group">
              <span className="qb-filter-label">Topics</span>
              <div className="qb-filter-pills qb-filter-pills-scroll" role="group" aria-label="Filter questions by topic">
                <button
                  type="button"
                  className={`qb-filter-pill${filterTag === null ? ' active' : ''}`}
                  aria-pressed={filterTag === null}
                  onClick={() => setFilterTag(null)}
                >
                  All topics
                </button>
                {TAGS.map((tag) => {
                  const isActive = filterTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`qb-filter-pill${isActive ? ' active' : ''}`}
                      aria-pressed={isActive}
                      onClick={() => setFilterTag(isActive ? null : tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="qb-active-filters" aria-label="Active filters">
              {activeFilterLabels.map((label) => (
                <span key={label} className="qb-active-filter">{label}</span>
              ))}
            </div>
          )}
        </div>

        {/* Ask modal */}
        {isAskFormOpen && (
          <div className="qb-modal-overlay">
            <div className="qb-modal">
              <div className="qb-modal-header">
                <div className="qb-modal-meta">
                  <span className="qb-modal-kicker">Ask a question</span>
                  <h2 className="qb-modal-title">What are you stuck on?</h2>
                  <p className="qb-modal-desc">
                    Keep it specific enough that someone can answer clearly. If the problem is visual, add a screenshot.
                  </p>
                </div>
                <button
                  type="button"
                  className="qb-modal-close"
                  aria-label="Close ask question dialog"
                  onClick={() => { setShowAskForm(false); setAskPromptDismissed(true); }}
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="qb-modal-body">
                <div className="qb-form-group">
                  <label className="qb-form-label" htmlFor={questionTitleId}>Question title</label>
                  <input
                    id={questionTitleId}
                    type="text"
                    className="qb-form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How do I calculate IV drip rates?"
                    maxLength={200}
                    required
                  />
                </div>

                <div className="qb-form-group">
                  <label className="qb-form-label" htmlFor={questionDetailsId}>Details</label>
                  <textarea
                    id={questionDetailsId}
                    className="qb-form-textarea"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="What have you already tried, and where is the bit that feels unclear?"
                    rows={6}
                    maxLength={2000}
                    required
                  />
                </div>

                <div className="qb-form-group">
                  <span id={questionTopicsGroupId} className="qb-form-label">Topics</span>
                  <div className="qb-form-tags" role="group" aria-labelledby={questionTopicsGroupId}>
                    {TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`qb-form-tag-btn${selectedTags.includes(tag) ? ' active' : ''}`}
                        aria-pressed={selectedTags.includes(tag)}
                        onClick={() =>
                          setSelectedTags((prev) =>
                            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
                          )
                        }
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="qb-form-group">
                  <span id={questionImageGroupId} className="qb-form-label">Attach image <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></span>
                  <div role="group" aria-labelledby={questionImageGroupId}>
                    <input
                      id={questionImageInputId}
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    {imageUrl ? (
                      <div className="qb-img-preview">
                        <Image src={imageUrl} alt="Uploaded image" width={240} height={160} style={{ display: 'block', objectFit: 'cover' }} />
                        <button
                          type="button"
                          className="qb-img-remove"
                          aria-label="Remove uploaded image"
                          onClick={() => setImageUrl(null)}
                        >
                          <X />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="qb-upload-btn"
                        aria-controls={questionImageInputId}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <><Loader2 style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} /> Uploading...</>
                        ) : (
                          <><ImagePlus style={{ width: '13px', height: '13px' }} /> Add image or GIF</>
                        )}
                      </button>
                    )}
                    <span className="qb-form-hint">Max 5 MB. JPG, PNG, GIF, WebP.</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="qb-form-submit"
                  disabled={submitting || !title.trim() || !body.trim()}
                >
                  <Send style={{ width: '13px', height: '13px' }} />
                  {submitting ? 'Posting...' : 'Post question'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Questions list or empty states */}
        {!hasQuestions ? (
          <div className="qb-empty">
            <span className="qb-empty-kicker">A quieter board</span>
            <h2 className="qb-empty-title">Start with one clear question.</h2>
            <p className="qb-empty-desc">
              The board is ready for placement questions, OSCE worries, calculations, and &quot;where do I even start?&quot; moments.
            </p>
            {isSignedIn ? (
              <button
                type="button"
                className="qb-btn-primary"
                onClick={() => { setAskPromptDismissed(false); setShowAskForm(true); }}
              >
                + Ask the first question
              </button>
            ) : (
              <Link href="/sign-in" className="qb-btn-primary">Sign in to ask</Link>
            )}
            <div className="qb-empty-grid">
              {STARTER_PROMPTS.map((p) => (
                <div key={p.title} className="qb-empty-card">
                  <span className="qb-empty-card-eye">Example</span>
                  <p className="qb-empty-card-title">{p.title}</p>
                  <p className="qb-empty-card-desc">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : !hasMatches ? (
          <div className="qb-empty">
            <span className="qb-empty-kicker">Nothing here yet</span>
            <h2 className="qb-empty-title">No questions match this view.</h2>
            <p className="qb-empty-desc">
              Try clearing the filters, or ask a new question if the thing you need is still missing.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="qb-btn-secondary"
                onClick={() => { setSearchQuery(''); setFilterTag(null); setFilterAnswered(null); }}
              >
                Clear filters
              </button>
              {isSignedIn && (
                <button
                  type="button"
                  className="qb-btn-primary"
                  onClick={() => { setAskPromptDismissed(false); setShowAskForm(true); }}
                >
                  + Ask a question
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="qb-q-list">
            {filteredQuestions.map((question) => {
              const visibleTags = question.tags.slice(0, 3);
              const hiddenTagCount = Math.max(question.tags.length - visibleTags.length, 0);

              return (
                <Link
                  key={question.id}
                  href={`/hub/questions/${question.id}`}
                  className={`qb-q-row ${question.is_answered ? 'answered' : 'open'}`}
                >
                  <div className="qb-q-row-top">
                    <div className="qb-q-row-state">
                      <span className={`qb-q-status ${question.is_answered ? 'answered' : 'open'}`}>
                        {question.is_answered ? 'Answered' : 'Open'}
                      </span>
                      <span className="qb-q-state-note">
                        {question.is_answered ? 'Solved thread, good for quick skims.' : 'Still waiting for a clear reply.'}
                      </span>
                    </div>

                    <span className="qb-q-open-link">
                      Open thread <span className="qb-q-open-arrow" aria-hidden="true">&rarr;</span>
                    </span>
                  </div>

                  <div className="qb-q-row-content">
                    <div className="qb-q-row-copy">
                      <p className="qb-q-title">{question.title}</p>
                      <p className="qb-q-preview">{question.body}</p>
                    </div>

                    {question.image_url && (
                      <div className="qb-q-image">
                        <Image
                          src={question.image_url}
                          alt="Question attachment"
                          width={220}
                          height={150}
                          style={{ display: 'block', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="qb-q-row-footer">
                    <div className="qb-q-row-context">
                      <span className="qb-q-context-label">Asked by</span>
                      <span className="qb-q-user">{question.user_name}</span>
                      <span className="qb-q-meta-sep" aria-hidden="true" />
                      <span className="qb-q-time">{timeAgo(question.created_at)}</span>
                    </div>

                    {visibleTags.length > 0 && (
                      <div className="qb-q-row-tags">
                        {visibleTags.map((tag) => (
                          <span key={tag} className="qb-q-tag">{tag}</span>
                        ))}
                        {hiddenTagCount > 0 && (
                          <span className="qb-q-tag qb-q-tag-more">+{hiddenTagCount}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}
