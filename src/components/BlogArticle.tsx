import Link from 'next/link';
import { blogAccents, type BlogPost } from '@/lib/blog';

const CSS = `
.bp-article {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  background: var(--surface-page);
  color: var(--ink-mid);
  line-height: 1.6;
  min-height: 100vh;
}

.bp-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 112px 24px 96px;
}

.bp-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bp-deep);
  text-decoration: none;
  margin-bottom: 40px;
}
.bp-back:hover { text-decoration: underline; text-underline-offset: 4px; }

.bp-kicker {
  display: block;
  width: fit-content;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bp-deep);
  background: var(--bp-tint);
  padding: 5px 13px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.bp-headline {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--ink-strong);
  margin-bottom: 22px;
}

.bp-standfirst {
  font-size: 17px;
  font-weight: 300;
  color: var(--ink-soft);
  line-height: 1.7;
  margin-bottom: 22px;
}

.bp-byline {
  font-size: 12px;
  color: var(--ink-soft);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding-bottom: 26px;
  border-bottom: 2px solid var(--bp-mid);
  margin-bottom: 40px;
}

.bp-body p {
  font-size: 16px;
  line-height: 1.85;
  color: var(--ink-mid);
  margin-bottom: 20px;
}

.bp-body h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.5rem, 3vw, 1.9rem);
  font-weight: 400;
  line-height: 1.16;
  color: var(--ink-strong);
  margin: 50px 0 14px;
}

.bp-body h2:first-child { margin-top: 0; }

/* Numeral sits above its heading as a coloured pill. */
.bp-body h2 .bp-num {
  display: block;
  width: fit-content;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 14px;
  background: var(--gray-50);
  color: var(--gray-800);
}

.bp-body h2 .bp-num.c-purple { background: var(--purple-50); color: var(--purple-800); }
.bp-body h2 .bp-num.c-teal   { background: var(--teal-50);   color: var(--teal-800);   }
.bp-body h2 .bp-num.c-coral  { background: var(--coral-50);  color: var(--coral-800);  }
.bp-body h2 .bp-num.c-blue   { background: var(--blue-50);   color: var(--blue-800);   }
.bp-body h2 .bp-num.c-amber  { background: var(--amber-50);  color: var(--amber-800);  }
.bp-body h2 .bp-num.c-sage   { background: var(--sage-50);   color: var(--sage-800);   }

.bp-body ul {
  margin: 0 0 22px 0;
  padding-left: 20px;
}

.bp-body li {
  font-size: 16px;
  line-height: 1.8;
  color: var(--ink-mid);
  margin-bottom: 8px;
}

.bp-body strong {
  font-weight: 500;
  color: var(--ink-strong);
}

.bp-body a {
  color: var(--bp-deep);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* The line the whole post is built around. */
.bp-body p.bp-pull {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.5rem, 3.6vw, 2rem);
  line-height: 1.28;
  color: var(--ink-strong);
  background: var(--bp-tint);
  border-left: 4px solid var(--bp-mid);
  border-radius: var(--radius-sm);
  padding: 24px 26px;
  margin: 34px 0;
}

.bp-note {
  background: var(--amber-50);
  border-radius: var(--radius-sm);
  padding: 20px 22px;
  margin: 30px 0 34px;
}

.bp-body .bp-note p {
  font-size: 15px;
  line-height: 1.75;
  color: var(--ink-mid);
  margin: 0;
}

.bp-body p.bp-note-label {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--amber-800);
  margin-bottom: 8px;
}

.bp-end {
  margin-top: 56px;
  padding-top: 28px;
  border-top: 2px solid var(--bp-mid);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.bp-end-link {
  font-size: 13px;
  color: var(--bp-deep);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.bp-cta {
  font-size: 13px;
  color: var(--action-text);
  background: var(--action-bg);
  padding: 11px 22px;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 200ms ease;
}
.bp-cta:hover { background: var(--gold-deep); }

@media (max-width: 640px) {
  .bp-wrap { padding: 96px 20px 72px; }
  .bp-back { margin-bottom: 30px; }
  .bp-body p.bp-pull { padding: 20px 20px; }
}
`;

export default function BlogArticle({
  post,
  standfirst,
  titleNode,
  children,
}: {
  post: BlogPost;
  standfirst: string;
  /** Optional headline with an <em> for the italic-gold accent. */
  titleNode?: React.ReactNode;
  children: React.ReactNode;
}) {
  const accent = blogAccents[post.accent];

  return (
    <div
      className="bp-article"
      style={
        {
          '--bp-tint': accent.tint,
          '--bp-mid': accent.mid,
          '--bp-deep': accent.deep,
        } as React.CSSProperties
      }
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <main id="main-content" className="bp-wrap">
        <Link href="/blog" className="bp-back">
          <span>←</span>
          Back to the blog
        </Link>

        <p className="bp-kicker">{post.kicker}</p>
        <h1 className="bp-headline">{titleNode ?? post.title}</h1>
        <p className="bp-standfirst">{standfirst}</p>
        <p className="bp-byline">
          Lauren · {post.dateLabel} · {post.readingTime}
        </p>

        <div className="bp-body">{children}</div>

        <div className="bp-end">
          <Link href="/blog" className="bp-end-link">
            ← All posts
          </Link>
          <Link href="/hub" className="bp-cta">
            Open the Revision Hub
          </Link>
        </div>
      </main>
    </div>
  );
}
