import Link from 'next/link';
import EditorialLayout from '@/components/EditorialLayout';
import { ClipboardCheck, BookOpen, Play, CheckCircle2, ArrowRight, Trophy } from 'lucide-react';

  return (
    <EditorialLayout
      kicker="Quick Guide"
      title="How to Use Your Tools"
      standfirst="Get the most out of your revision in just a few minutes a day!"
      byline="Revision Foundations"
      backHref="/dashboard"
      backLabel="Back to Dashboard"
    >
      {/* OSCE Tool Guide */}
      <div className="ed-card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--purple)]/15 flex items-center justify-center">
            <ClipboardCheck className="w-7 h-7 text-[var(--purple)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--plum)]">OSCE Tool</h2>
            <p className="text-sm text-[var(--plum-dark)]/70">Practice clinical stations like the real thing</p>
          </div>
        </div>
        {/* ...existing OSCE steps... */}
        <Link
          href="/osce"
          className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all"
        >
          <Play className="w-4 h-4" />
          Try OSCE Tool
        </Link>
      </div>
      {/* Quiz Tool Guide */}
      <div className="ed-card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--purple)]/15 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-[var(--purple)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--plum)]">Core Quiz</h2>
            <p className="text-sm text-[var(--plum-dark)]/70">Test your knowledge across 17 topic areas</p>
          </div>
        </div>
        {/* ...existing Quiz steps... */}
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all"
        >
          <Play className="w-4 h-4" />
          Try Core Quiz
        </Link>
      </div>
      {/* Tips Section */}
      <div className="ed-card bg-[var(--lilac-soft)]/50">
        <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Tips for Success
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--plum-dark)]/70">
              <strong className="text-[var(--plum)]">Little and often</strong> — 10-15 mins daily beats cramming
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--plum-dark)]/70">
              <strong className="text-[var(--plum)]">Mix it up</strong> — alternate between OSCE and Quiz
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--plum-dark)]/70">
              <strong className="text-[var(--plum)]">Review mistakes</strong> — they&apos;re your best teachers
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--plum-dark)]/70">
              <strong className="text-[var(--plum)]">Practice out loud</strong> — explain concepts as if teaching
            </p>
          </div>
        </div>
      </div>
    </EditorialLayout>
  );
}
