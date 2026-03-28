'use client';

import EditorialLayout from '@/components/EditorialLayout';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <EditorialLayout
      kicker="About Lauren"
      title="Hi, I'm Lauren."
      standfirst="Children's nursing student, former medical photographer, and the person who built this because I couldn't find revision tools I actually liked."
      byline="Revision Foundations"
      backHref="/dashboard"
      backLabel="Back to Dashboard"
    >
      <>
        <h2 className="ed-section-title">How this started</h2>
        <div className="ed-card">
          <p style={{ fontSize: '15px', color: '#5A5750', lineHeight: '1.75', fontWeight: 300, marginBottom: '18px' }}>
            Before nursing, I spent years as a medical photographer in hospitals. Interesting work — genuinely — but it never felt like <em>my</em> thing. At 25 I decided to change that. Applied to nursing, got in, and haven't looked back.
          </p>
          <p style={{ fontSize: '15px', color: '#5A5750', lineHeight: '1.75', fontWeight: 300, marginBottom: '18px' }}>
            Children's was an easy choice. I knew it was the branch for me from the first placement.
          </p>
          <p style={{ fontSize: '15px', color: '#5A5750', lineHeight: '1.75', fontWeight: 300 }}>
            What wasn't so easy? Finding revision resources that weren't boring, badly designed, or weirdly expensive. So I started making my own — mostly for myself, then for coursemates who asked. That's when the idea clicked.
          </p>
        </div>

        <div className="ed-grid-4" style={{ marginTop: '32px', marginBottom: '8px' }}>
          {[
            { emoji: '👶', label: 'Paeds Student' },
            { emoji: '🍒', label: 'Pepsi Max Cherry' },
            { emoji: '💜', label: 'Purple Everything' },
            { emoji: '✏️', label: 'Design Nerd' },
          ].map((fact) => (
            <div key={fact.label} className="ed-grid-4-cell" style={{ textAlign: 'center', padding: '20px 16px' }}>
              <span style={{ fontSize: '22px', display: 'block', marginBottom: '8px' }}>{fact.emoji}</span>
              <span className="ed-grid-4-title" style={{ display: 'block', borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>{fact.label}</span>
            </div>
          ))}
        </div>

        <h2 className="ed-section-title">What Revision Foundations is</h2>
        <p style={{ fontSize: '15px', color: '#5A5750', lineHeight: '1.75', fontWeight: 300, marginBottom: '24px' }}>
          Study tools designed to actually look good and feel good to use — not walls of text recycled from a 2009 PDF. I use these myself, which means if something's wrong or unclear, I notice it too.
        </p>

        <div className="ed-grid-3" style={{ marginBottom: '32px' }}>
          {[
            {
              title: 'Made by a student',
              body: "I know the curriculum, the pressure, and what 'study-friendly' actually means at 11pm before a placement shift.",
            },
            {
              title: 'One payment',
              body: 'No subscription. No drip-feed. You pay once and everything — including future updates — is yours.',
            },
            {
              title: 'Always improving',
              body: 'New resources get added, things get fixed, content gets updated when guidelines change. Because I use it too.',
            },
          ].map((item) => (
            <div key={item.title} className="ed-cell">
              <p className="ed-cell-title">{item.title}</p>
              <p>{item.body}</p>
            </div>
          ))}
        </div>

        <div className="ed-pearl" style={{ marginBottom: '40px' }}>
          <p className="ed-pearl-label">A note</p>
          <p>Questions, feedback, or just want to say hi — I genuinely read every message. Email is the best way to reach me.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Heart style={{ width: '16px', height: '16px' }} />
            Get in Touch
          </Link>
          <Link href="/hub" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Explore the Hub
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>
      </>
    </EditorialLayout>
  );
}
