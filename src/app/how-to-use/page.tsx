import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ClipboardCheck,
  BookOpen,
  Play,
  Timer,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  RotateCcw,
  Trophy
} from 'lucide-react';

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="badge badge-purple mb-4">Quick Guide</span>
            <h1 className="mb-4">How to Use Your Tools</h1>
            <p className="text-[var(--plum-dark)]/70 max-w-xl mx-auto">
              Get the most out of your revision in just a few minutes a day!
            </p>
          </div>

          {/* OSCE Tool Guide */}
          <div className="card mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--purple)]/15 flex items-center justify-center">
                <ClipboardCheck className="w-7 h-7 text-[var(--purple)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--plum)]">OSCE Tool</h2>
                <p className="text-sm text-[var(--plum-dark)]/70">Practice clinical stations like the real thing</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex gap-4 p-4 rounded-xl bg-[var(--lilac-soft)]/50">
                <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-[var(--plum)] mb-1">Choose a Station</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70">Pick from 50+ stations covering all key clinical skills for children&apos;s nursing.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-[var(--lilac-soft)]/50">
                <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-[var(--plum)] mb-1">Start the Timer</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70">Practice under timed conditions just like your real OSCE exam.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-[var(--lilac-soft)]/50">
                <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-[var(--plum)] mb-1">Follow the Checklist</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70">Work through each step using the examiner-style checklist to make sure you don&apos;t miss anything.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-[var(--lilac-soft)]/50">
                <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-[var(--plum)] mb-1">Review &amp; Repeat</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70">Check your performance and practice again until you feel confident!</p>
                </div>
              </div>
            </div>

            <Link
              href="/osce"
              className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all"
            >
              <Play className="w-4 h-4" />
              Try OSCE Tool
            </Link>
          </div>

          {/* Quiz Tool Guide */}
          <div className="card mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--purple)]/15 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-[var(--purple)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--plum)]">Core Quiz</h2>
                <p className="text-sm text-[var(--plum-dark)]/70">Test your knowledge across 17 topic areas</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex gap-4 p-4 rounded-xl bg-[var(--lilac-soft)]/50">
                <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-[var(--plum)] mb-1">Pick a Topic</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70">Choose from topics like infection control, medication, observations, and more.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-[var(--lilac-soft)]/50">
                <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-[var(--plum)] mb-1">Answer Questions</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70">Work through exam-style questions at your own pace.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-[var(--lilac-soft)]/50">
                <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-[var(--plum)] mb-1">Get Instant Feedback</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70">See if you&apos;re right straight away with detailed explanations for each answer.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-[var(--lilac-soft)]/50">
                <div className="w-8 h-8 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-[var(--plum)] mb-1">Track Your Progress</h3>
                  <p className="text-sm text-[var(--plum-dark)]/70">See which topics you&apos;re smashing and which need more practice.</p>
                </div>
              </div>
            </div>

            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all"
            >
              <Play className="w-4 h-4" />
              Try Core Quiz
            </Link>
          </div>

          {/* Tips Section */}
          <div className="card bg-[var(--lilac-soft)]/50">
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

          {/* Back to Dashboard */}
          <div className="text-center mt-10">
            <Link
              href="/dashboard"
              className="text-[var(--purple)] font-medium hover:underline inline-flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Dashboard
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
