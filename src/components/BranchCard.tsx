import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import React from 'react';

const serif = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const display = "'Playfair Display', Georgia, serif";
const espresso = '#301906';
const charcoal = '#5A5750';
const mist = '#8A8178';
const linenDeep = '#E8E0D8';
const linenLight = '#F7F3EF';
const white = '#FFFFFF';

type BranchCardProps = {
  title: string;
  description: string;
  icon: string;
  href?: string;
  comingSoon?: boolean;
  tags?: string[];
};

export default function BranchCard({
  title,
  description,
  icon,
  href,
  comingSoon = false,
  tags = [],
}: BranchCardProps) {
  const baseStyle: React.CSSProperties = {
    padding: '28px',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textDecoration: 'none',
    transition: 'border-color 0.18s ease',
  };

  const liveStyle: React.CSSProperties = {
    background: white,
    border: `0.5px solid ${linenDeep}`,
    cursor: 'pointer',
  };

  const soonStyle: React.CSSProperties = {
    background: linenLight,
    border: `0.5px solid ${linenDeep}`,
  };

  const content = (
    <>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              display: 'grid',
              placeItems: 'center',
              background: comingSoon ? white : linenLight,
              fontSize: '24px',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>

          {comingSoon && (
            <span
              style={{
                fontFamily: serif,
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: mist,
                background: '#EFE7DE',
                padding: '5px 10px',
                whiteSpace: 'nowrap',
              }}
            >
              Coming soon
            </span>
          )}
        </div>

        <h2
          style={{
            fontFamily: display,
            fontSize: '24px',
            fontWeight: 500,
            color: espresso,
            margin: '0 0 10px',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontFamily: serif,
            fontSize: '14px',
            color: charcoal,
            lineHeight: 1.75,
            fontWeight: 300,
            margin: '0 0 18px',
          }}
        >
          {description}
        </p>

        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '22px',
            }}
          >
            {tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontFamily: serif,
                  fontSize: '12px',
                  color: espresso,
                  background: comingSoon ? white : linenLight,
                  border: `0.5px solid ${linenDeep}`,
                  padding: '6px 10px',
                  lineHeight: 1,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <span
        style={{
          fontFamily: serif,
          fontSize: '14px',
          color: comingSoon ? mist : espresso,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: comingSoon ? 400 : 500,
        }}
      >
        {comingSoon ? 'Available soon' : 'Browse resources'}
        {!comingSoon && <ArrowRight style={{ width: '15px', height: '15px' }} />}
      </span>
    </>
  );

  if (comingSoon || !href) {
    return <div style={{ ...baseStyle, ...soonStyle }}>{content}</div>;
  }

  return (
    <Link
      href={href}
      style={{ ...baseStyle, ...liveStyle }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#D9CDC2';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = linenDeep;
      }}
    >
      {content}
    </Link>
  );
}
