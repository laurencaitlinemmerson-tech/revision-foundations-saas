import React from 'react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { useUser } from '@clerk/nextjs';

export default function PlacementSurvivalPage() {
  const { user } = useUser();
  const isLauren = user?.primaryEmailAddress?.emailAddress === 'laurencaitlinemmerson@gmail.com';

  if (!isLauren) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-[var(--plum)] mb-4">Placement Survival Guide</h1>
        <p className="text-[var(--plum-dark)]/80 mb-6">This page is only available to Lauren.</p>
        <div className="text-5xl text-[var(--plum)]">🔒</div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[var(--plum)] mb-4">Placement Survival Guide</h1>
      <p className="mb-6 text-[var(--plum-dark)]/80">
        Tips, tricks, and real talk for surviving and thriving on your first nursing placement. (For Lauren only!)
      </p>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Top Survival Tips</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Always ask questions—no one expects you to know everything.</li>
          <li>Write down key names, numbers, and routines on day one.</li>
          <li>Be early, be kind, and offer to help with small tasks.</li>
          <li>Keep a small notebook for learning points and feedback.</li>
          <li>Eat, hydrate, and take your breaks—self-care is patient care.</li>
          <li>Don’t be afraid to say “I don’t know, but I’ll find out.”</li>
          <li>Reflect on your day, even if it was tough. Growth comes from challenge.</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">What I Wish I Knew</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Everyone feels nervous at first—confidence comes with time.</li>
          <li>It’s okay to make mistakes; own them and learn from them.</li>
          <li>Find a buddy or mentor—support makes all the difference.</li>
          <li>Document everything, even the small stuff.</li>
          <li>Trust your instincts—if something feels off, escalate it.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-[var(--purple)] mb-2">Lauren’s Personal Notes</h2>
        <ul className="list-disc pl-6 text-[var(--plum-dark)]/90">
          <li>Remember why you started—your compassion is your superpower.</li>
          <li>Celebrate small wins and be gentle with yourself on hard days.</li>
        </ul>
      </section>
    </main>
  );
}
