'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  User,
  Send,
  MessageCircle,
  Sparkles,
  Crown,
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

interface Answer {
  id: string;
  clerk_user_id: string;
  user_name: string;
  body: string;
  is_accepted: boolean;
  is_from_lauren: boolean;
  created_at: string;
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
  return date.toLocaleDateString();
}

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isSignedIn } = useUser();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestion();
    fetchAnswers();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      const found = data.questions?.find((q: Question) => q.id === id);
      setQuestion(found || null);
    } catch (error) {
      console.error('Failed to fetch question:', error);
    }
    setLoading(false);
  };

  const fetchAnswers = async () => {
    try {
      const res = await fetch(`/api/questions/${id}/answers`);
      const data = await res.json();
      setAnswers(data.answers || []);
    } catch (error) {
      console.error('Failed to fetch answers:', error);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerBody.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/questions/${id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: answerBody.trim() }),
      });

      if (res.ok) {
        setAnswerBody('');
        fetchAnswers();
        fetchQuestion(); // Refresh to get updated is_answered status
      }
    } catch (error) {
      console.error('Failed to post answer:', error);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="pt-28 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--lavender)] border-t-transparent rounded-full mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main className="pt-28 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center py-12">
            <h1 className="text-2xl mb-4">Question not found</h1>
            <Link href="/hub/questions" className="text-[var(--purple)] hover:underline">
              ← Back to Q&A
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/hub/questions"
            className="inline-flex items-center gap-2 text-[var(--purple)] font-medium mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Q&A
          </Link>

          {/* Question */}
          <div className="card mb-8">
            <div className="flex items-start gap-4 mb-4">
              {question.is_answered ? (
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--lilac-soft)] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-[var(--purple)]" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-[var(--plum)] mb-2">{question.title}</h1>
                <div className="flex items-center gap-3 text-sm text-[var(--plum-dark)]/60">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {question.user_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {timeAgo(question.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[var(--plum-dark)]/80 whitespace-pre-wrap mb-4">{question.body}</p>

            {question.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Answers */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>

            {answers.length === 0 ? (
              <div className="card text-center py-8 bg-[var(--lilac-soft)]/30">
                <p className="text-[var(--plum-dark)]/60 mb-2">No answers yet</p>
                <p className="text-sm text-[var(--plum-dark)]/50">Be the first to help out!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`card ${
                      answer.is_from_lauren
                        ? 'bg-[var(--lilac-soft)] border-[var(--lavender)]'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        answer.is_from_lauren
                          ? 'bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)]'
                          : 'bg-[var(--lilac)]'
                      }`}>
                        {answer.is_from_lauren ? (
                          <Crown className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-[var(--purple)]" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[var(--plum)]">
                            {answer.user_name}
                          </span>
                          {answer.is_from_lauren && (
                            <span className="text-xs bg-[var(--purple)] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Lauren
                            </span>
                          )}
                          <span className="text-xs text-[var(--plum-dark)]/50">
                            {timeAgo(answer.created_at)}
                          </span>
                        </div>
                        <p className="text-[var(--plum-dark)]/80 whitespace-pre-wrap">
                          {answer.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Answer Form */}
          {isSignedIn ? (
            <div className="card">
              <h3 className="font-semibold text-[var(--plum)] mb-4">Your Answer</h3>
              <form onSubmit={handleSubmitAnswer}>
                <textarea
                  value={answerBody}
                  onChange={(e) => setAnswerBody(e.target.value)}
                  placeholder="Share your knowledge..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--lilac-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] resize-none mb-4"
                  maxLength={2000}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !answerBody.trim()}
                  className="bg-[var(--purple)] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[var(--plum)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post Answer'}
                </button>
              </form>
            </div>
          ) : (
            <div className="card text-center bg-[var(--lilac-soft)]/30">
              <p className="text-[var(--plum-dark)]/70 mb-4">Sign in to answer this question</p>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[var(--plum)] transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
