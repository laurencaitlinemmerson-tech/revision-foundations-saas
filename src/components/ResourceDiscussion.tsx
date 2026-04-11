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
    <div className="mt-12 border-t border-black/10 pt-8">
      <h2
        className="mb-6 flex items-center gap-2 text-lg"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          color: '#1A1815',
          fontWeight: 400,
        }}
      >
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
            className="mb-3 w-full resize-none border border-black/10 bg-[#FBF8F3] px-4 py-3 focus:outline-none"
            maxLength={1000}
            style={{
              color: '#1A1815',
              fontSize: '14px',
              lineHeight: 1.7,
            }}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="flex items-center gap-2 px-5 py-2 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: '#1A1815', color: '#FAFAF8' }}
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-6 border border-black/8 bg-[#FBF8F3] p-5 text-center">
          <p className="mb-3 text-sm" style={{ color: '#5A5750' }}>
            Sign in or create an account to join the discussion.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm transition-all"
            style={{ background: '#1A1815', color: '#FAFAF8' }}
          >
            Open account page
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-[3px] border-[#D8D0C5] border-t-transparent" />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center" style={{ color: '#8F877D' }}>
          <p>No comments yet. Be the first to start the discussion!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 border-b border-black/6 pb-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-[#F3F1EE]">
                <User className="w-4 h-4" style={{ color: '#5A5750' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium" style={{ color: '#1A1815' }}>
                    {comment.user_name}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#8F877D' }}>
                    <Clock className="w-3 h-3" />
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm leading-7" style={{ color: '#5A5750' }}>{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
