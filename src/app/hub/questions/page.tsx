'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import {
  MessageCircle,
  Plus,
  CheckCircle2,
  Clock,
  ChevronRight,
  Search,
  X,
  Send,
  User,
  Sparkles,
} from 'lucide-react';

interface Question {
  id: string;
  clerk_user_id: string;
  user_name: string;
  title: string;
  body: string;
  tags: string[];
  is_answered: boolean;
  created_at: string;
}

const TAGS = [
  'OSCE',
  'Adult Nursing',
  'Paeds',
  'Mental Health',
  'Meds & Calculations',
  'Placement',
  'Exams',
  'General',
];

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
  return date.toLocaleDateString();
}

export default function QuestionsPage() {
  const { isSignedIn } = useUser();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAskForm, setShowAskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterAnswered, setFilterAnswered] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [filterTag, filterAnswered]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let url = '/api/questions?';
      if (filterTag) url += `tag=${encodeURIComponent(filterTag)}&`;
      if (filterAnswered) url += `answered=${filterAnswered}&`;

      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          tags: selectedTags,
        }),
      });

      if (res.ok) {
        setTitle('');
        setBody('');
        setSelectedTags([]);
        setShowAskForm(false);
        fetchQuestions();
      }
    } catch (error) {
      console.error('Failed to post question:', error);
    }
    setSubmitting(false);
  };

  const filteredQuestions = questions.filter((q) =>
    searchQuery === '' ||
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Q&A Board</h1>
              <p className="text-[var(--plum-dark)]/70">
                Ask questions, share knowledge, help each other out
              </p>
            </div>
            {isSignedIn ? (
              <button
                onClick={() => setShowAskForm(true)}
                className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all"
              >
                <Plus className="w-5 h-5" />
                Ask a Question
              </button>
            ) : (
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all"
              >
                Sign in to ask
              </Link>
            )}
          </div>

          {/* Search & Filters */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--plum-dark)]/40" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[var(--lilac-medium)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] text-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterTag || ''}
                  onChange={(e) => setFilterTag(e.target.value || null)}
                  className="px-4 py-2.5 rounded-full border border-[var(--lilac-medium)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--lavender)]"
                >
                  <option value="">All Topics</option>
                  {TAGS.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <select
                  value={filterAnswered || ''}
                  onChange={(e) => setFilterAnswered(e.target.value || null)}
                  className="px-4 py-2.5 rounded-full border border-[var(--lilac-medium)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--lavender)]"
                >
                  <option value="">All Questions</option>
                  <option value="true">Answered</option>
                  <option value="false">Unanswered</option>
                </select>
              </div>
            </div>
          </div>

          {/* Ask Form Modal */}
          {showAskForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[var(--plum)]">Ask a Question</h2>
                  <button onClick={() => setShowAskForm(false)} className="p-2 hover:bg-[var(--lilac-soft)] rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--plum)] mb-1">
                      Question title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. How do I calculate IV drip rates?"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--lilac-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--lavender)]"
                      maxLength={200}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--plum)] mb-1">
                      Details
                    </label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Explain your question in more detail..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--lilac-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] resize-none"
                      maxLength={2000}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--plum)] mb-2">
                      Topics (optional)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSelectedTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedTags.includes(tag)
                              ? 'bg-[var(--purple)] text-white'
                              : 'bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70 hover:bg-[var(--lilac)]'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !title.trim() || !body.trim()}
                    className="w-full bg-[var(--purple)] text-white py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? 'Posting...' : 'Post Question'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Questions List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--lavender)] border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-[var(--plum-dark)]/60">Loading questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12 card">
              <MessageCircle className="w-12 h-12 text-[var(--lavender)] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[var(--plum)] mb-2">No questions yet</h3>
              <p className="text-[var(--plum-dark)]/60 mb-4">Be the first to ask a question!</p>
              {isSignedIn && (
                <button
                  onClick={() => setShowAskForm(true)}
                  className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[var(--plum)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Ask a Question
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <Link
                  key={question.id}
                  href={`/hub/questions/${question.id}`}
                  className="card block hover:border-[var(--lavender)] hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      question.is_answered ? 'bg-emerald-100' : 'bg-[var(--lilac-soft)]'
                    }`}>
                      {question.is_answered ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <MessageCircle className="w-5 h-5 text-[var(--purple)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--plum)] group-hover:text-[var(--purple)] transition-colors line-clamp-2">
                        {question.title}
                      </h3>
                      <p className="text-sm text-[var(--plum-dark)]/60 line-clamp-2 mt-1">
                        {question.body}
                      </p>
                      <div className="flex items-center gap-3 mt-3 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-[var(--plum-dark)]/50">
                          <User className="w-3 h-3" />
                          {question.user_name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[var(--plum-dark)]/50">
                          <Clock className="w-3 h-3" />
                          {timeAgo(question.created_at)}
                        </span>
                        {question.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--plum-dark)]/30 group-hover:text-[var(--purple)] transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Back to Hub */}
          <div className="text-center mt-10">
            <Link
              href="/hub"
              className="text-[var(--purple)] font-medium hover:underline"
            >
              ← Back to Hub
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
