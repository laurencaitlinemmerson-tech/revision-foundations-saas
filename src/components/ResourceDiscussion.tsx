'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { MessageCircle, Send, User, Clock } from 'lucide-react';

interface Comment {
  id: string;
  clerk_user_id: string;
  user_name: string;
  body: string;
  parent_id: string | null;
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

export default function ResourceDiscussion({ slug }: { slug: string }) {
  const { isSignedIn } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          body: newComment.trim(),
        }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-12 pt-8 border-t border-[var(--lilac-medium)]">
      <h2 className="text-lg font-semibold text-[var(--plum)] mb-6 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Discussion ({comments.length})
      </h2>

      {/* Comment Form */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a question or share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-[var(--lilac-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] resize-none mb-3"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="bg-[var(--purple)] text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="card bg-[var(--lilac-soft)]/50 text-center mb-6">
          <p className="text-[var(--plum-dark)]/70 mb-3">Sign in to join the discussion</p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-2 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-3 border-[var(--lavender)] border-t-transparent rounded-full mx-auto" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-[var(--plum-dark)]/50">
          <p>No comments yet. Be the first to start the discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--lilac)] flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-[var(--purple)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-[var(--plum)]">
                    {comment.user_name}
                  </span>
                  <span className="text-xs text-[var(--plum-dark)]/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[var(--plum-dark)]/80">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
