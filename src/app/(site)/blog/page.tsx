import Link from 'next/link';
import { blogPosts, blogAccents } from '@/lib/blog';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const ink = 'var(--ink-strong)';
const inkMid = 'var(--ink-soft)';
const cream = 'var(--surface-page)';
const paper = 'var(--surface-raised)';
const border = 'var(--hairline-soft)';
const gold = 'var(--gold-deep)';

export default function BlogPage() {
  return (
    <div style={{ background: cream, minHeight: '100vh' }}>
      <main id="main-content">
        <section style={{ padding: '108px 24px 52px' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <p
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: gold,
                marginBottom: '16px',
              }}
            >
              Blog
            </p>
            <h1
              style={{
                fontFamily: display,
                fontSize: 'clamp(2.5rem, 5vw, 4.1rem)',
                lineHeight: 1.05,
                color: ink,
                marginBottom: '16px',
                maxWidth: '15ch',
              }}
            >
              The bits of nursing training <em>nobody</em> warns you about.
            </h1>
            <p
              style={{
                fontFamily: serif,
                fontSize: '16px',
                lineHeight: 1.9,
                fontWeight: 300,
                color: inkMid,
                maxWidth: '640px',
              }}
            >
              Written from the middle of it rather than from the other side of it — what
              actually helped on placement, what I got wrong in first year, and the
              practical things that are much easier if someone tells you early.
            </p>

            <div
              aria-hidden="true"
              style={{
                display: 'flex',
                gap: '6px',
                marginTop: '34px',
              }}
            >
              {(['purple', 'teal', 'coral', 'blue', 'amber', 'sage'] as const).map((key) => (
                <span
                  key={key}
                  style={{
                    width: '44px',
                    height: '4px',
                    borderRadius: '20px',
                    background: blogAccents[key].mid,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '12px 24px 84px' }}>
          <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
            <div
              className="blog-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '20px',
              }}
            >
              {blogPosts.map((post) => {
                const accent = blogAccents[post.accent];
                return (
                  <Link
                    key={post.slug}
                    href={post.href}
                    className="blog-card"
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: ink,
                      border: `1px solid ${border}`,
                      borderRadius: 'var(--radius-sm)',
                      background: accent.tint,
                      padding: '30px 28px 32px',
                      ['--card-accent' as string]: accent.mid,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: accent.deep,
                        marginBottom: '14px',
                      }}
                    >
                      {post.kicker} · {post.dateLabel}
                    </p>
                    <h2
                      style={{
                        fontFamily: display,
                        fontSize: 'clamp(1.8rem, 3vw, 2.35rem)',
                        lineHeight: 1.08,
                        color: ink,
                        marginBottom: '12px',
                      }}
                    >
                      {post.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: serif,
                        fontSize: '14px',
                        lineHeight: 1.85,
                        fontWeight: 300,
                        color: inkMid,
                        marginBottom: '20px',
                      }}
                    >
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '20px' }}>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: serif,
                            fontSize: '11px',
                            color: accent.deep,
                            background: paper,
                            padding: '5px 12px',
                            borderRadius: '20px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: '13px',
                        color: accent.deep,
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                      }}
                    >
                      Read post →
                    </span>
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: '13px',
                        color: inkMid,
                        marginLeft: '10px',
                      }}
                    >
                      {post.readingTime}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .blog-card {
          transition: border-color 200ms ease, transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .blog-card:hover {
            border-color: var(--card-accent);
            transform: translateY(-2px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .blog-card { transition: border-color 200ms ease; }
          .blog-card:hover { transform: none; }
        }
        @media (max-width: 760px) {
          .blog-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
