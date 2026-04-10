'use client';

import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
      <Navbar />

      <main className="qb-main">
        {/* Breadcrumb */}
        <nav className="qb-breadcrumb">
          <Link href="/hub">Hub</Link>
          <span>/</span>
          <span>Q&amp;A Board</span>
        </nav>

        {/* Masthead */}
        <p className="qb-kicker">The Nurse Lab &middot; Student Questions</p>
        <h1 className="qb-headline">Questions and answers for the messy bits of nursing school.</h1>
        <p className="qb-standfirst">
          Ask about placements, OSCEs, calculations, or where to start in the hub. Keep it practical, keep it general, and keep it study-safe.
        </p>

        <hr className="qb-divider" />

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
          <div className="qb-search-wrap">
            <Search className="qb-search-icon" />
            <input
              type="text"
              className="qb-search"
              placeholder="Search questions, placements, calculations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="qb-select"
            value={filterTag || ''}
            onChange={(e) => setFilterTag(e.target.value || null)}
          >
            <option value="">All topics</option>
            {TAGS.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>

          <select
            className="qb-select"
            value={filterAnswered || ''}
            onChange={(e) => setFilterAnswered(e.target.value || null)}
          >
            <option value="">All questions</option>
            <option value="true">Answered</option>
            <option value="false">Open</option>
          </select>

          {hasActiveFilters ? (
            <button
              type="button"
              className="qb-clear-btn"
              onClick={() => { setSearchQuery(''); setFilterTag(null); setFilterAnswered(null); }}
            >
              <X style={{ width: '12px', height: '12px' }} />
              Clear
            </button>
          ) : (
            <span className="qb-filter-meta">
              {hasQuestions
                ? `${filteredQuestions.length} ${filteredQuestions.length === 1 ? 'question' : 'questions'}`
                : 'Ready for the first question'}
            </span>
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
                  onClick={() => { setShowAskForm(false); setAskPromptDismissed(true); }}
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="qb-modal-body">
                <div className="qb-form-group">
                  <label className="qb-form-label">Question title</label>
                  <input
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
                  <label className="qb-form-label">Details</label>
                  <textarea
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
                  <label className="qb-form-label">Topics</label>
                  <div className="qb-form-tags">
                    {TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`qb-form-tag-btn${selectedTags.includes(tag) ? ' active' : ''}`}
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
                  <label className="qb-form-label">Attach image <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  {imageUrl ? (
                    <div className="qb-img-preview">
                      <Image src={imageUrl} alt="Uploaded image" width={240} height={160} style={{ display: 'block', objectFit: 'cover' }} />
                      <button type="button" className="qb-img-remove" onClick={() => setImageUrl(null)}>
                        <X />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="qb-upload-btn"
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
            {filteredQuestions.map((question) => (
              <Link
                key={question.id}
                href={`/hub/questions/${question.id}`}
                className="qb-q-row"
              >
                <div className="qb-q-row-top">
                  <div className="qb-q-row-meta">
                    <span className={`qb-q-status ${question.is_answered ? 'answered' : 'open'}`}>
                      {question.is_answered ? 'Answered' : 'Open'}
                    </span>
                    <span className="qb-q-user">{question.user_name}</span>
                    <span className="qb-q-time">{timeAgo(question.created_at)}</span>
                  </div>
                  <span className="qb-q-arrow">&rarr;</span>
                </div>

                <p className="qb-q-title">{question.title}</p>
                <p className="qb-q-preview">{question.body}</p>

                {question.image_url && (
                  <div className="qb-q-image">
                    <Image
                      src={question.image_url}
                      alt="Question attachment"
                      width={200}
                      height={130}
                      style={{ display: 'block', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {question.tags.length > 0 && (
                  <div className="qb-q-footer">
                    <div className="qb-q-tags">
                      {question.tags.map((tag) => (
                        <span key={tag} className="qb-q-tag">{tag}</span>
                      ))}
                    </div>
                    <span className="qb-q-open-link">Open thread &rarr;</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
