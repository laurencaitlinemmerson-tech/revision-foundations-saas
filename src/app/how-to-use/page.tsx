import Link from 'next/link';
import EditorialLayout from '@/components/EditorialLayout';
import {
  ClipboardCheck,
  BookOpen,
  Play,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Clock3,
  Brain,
  MessageSquareText,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-9 h-9 rounded-full bg-[var(--purple)] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="text-[var(--plum)] font-semibold mb-1">{title}</h3>
        <p className="text-sm text-[var(--plum-dark)]/75 leading-6">{description}</p>
      </div>
    </div>
  );
}

function Tip({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-[var(--plum-dark)]/75 leading-6">
        <strong className="text-[var(--plum)]">{title}</strong> — {children}
      </p>
    </div>
  );
}

export default function HowToUsePage() {
  return (
    <EditorialLayout
      kicker="Quick Guide"
      title="How to Use Your Tools"
      standfirst="A simple way to revise with confidence, stay consistent, and make the most of your study time."
      byline="The Nurse Lab"
      backHref="/dashboard"
      backLabel="Back to Dashboard"
    >
      <div className="space-y-8">
        {/* Intro Card */}
        <div className="ed-card bg-[var(--lilac-soft)]/35 border border-[var(--purple)]/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--purple)]/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-[var(--purple)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--plum)] mb-2">
                Start simple
              </h2>
              <p className="text-sm text-[var(--plum-dark)]/75 leading-6 max-w-2xl">
                You do not need hours of revision to make progress. The best results usually come
                from short, focused sessions done regularly. Use the OSCE Tool to practise your
                clinical thinking and communication, and use the Core Quiz to test your knowledge
                and spot weak areas quickly.
              </p>
            </div>
          </div>
        </div>

        {/* Best Way to Use */}
        <div className="ed-card">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-5 flex items-center gap-2">
            <Clock3 className="w-5 h-5 text-[var(--purple)]" />
            Best way to use the platform
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[var(--purple)]/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--plum-dark)]/50 mb-2">
                Step 1
              </p>
              <h3 className="font-semibold text-[var(--plum)] mb-2">Warm up with a quiz</h3>
              <p className="text-sm text-[var(--plum-dark)]/75 leading-6">
                Do a short quiz to wake up your memory and see what feels strong or shaky today.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--purple)]/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--plum-dark)]/50 mb-2">
                Step 2
              </p>
              <h3 className="font-semibold text-[var(--plum)] mb-2">Practise one OSCE station</h3>
              <p className="text-sm text-[var(--plum-dark)]/75 leading-6">
                Focus on one station at a time and talk through your approach like it is the real exam.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--purple)]/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--plum-dark)]/50 mb-2">
                Step 3
              </p>
              <h3 className="font-semibold text-[var(--plum)] mb-2">Review and repeat</h3>
              <p className="text-sm text-[var(--plum-dark)]/75 leading-6">
                Look at what you missed, tighten up your weak spots, and come back tomorrow for another short session.
              </p>
            </div>
          </div>
        </div>

        {/* OSCE Tool Guide */}
        <div className="ed-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[var(--purple)]/15 flex items-center justify-center">
              <ClipboardCheck className="w-7 h-7 text-[var(--purple)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--plum)]">OSCE Tool</h2>
              <p className="text-sm text-[var(--plum-dark)]/70">
                Practise clinical stations in a realistic, structured way
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="space-y-5">
              <Step
                number="1"
                title="Choose a station"
                description="Pick a station you want to practise, whether that is an area you find difficult or one you want to keep fresh."
              />
              <Step
                number="2"
                title="Treat it like the real exam"
                description="Read the prompt carefully, think about your structure, and speak your answers out loud as if you were in front of an examiner."
              />
              <Step
                number="3"
                title="Focus on your approach"
                description="Do not just aim to finish — work on being calm, organised, safe, and clear in how you explain your thinking."
              />
              <Step
                number="4"
                title="Reflect afterwards"
                description="Notice what went well, what you forgot, and what you want to improve next time. Repeating stations builds confidence fast."
              />
            </div>

            <div className="rounded-2xl bg-[var(--lilac-soft)]/35 border border-[var(--purple)]/10 p-5">
              <h3 className="font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[var(--purple)]" />
                OSCE mini strategy
              </h3>
              <ul className="space-y-3 text-sm text-[var(--plum-dark)]/75 leading-6">
                <li>Start with introduction, consent, and patient safety.</li>
                <li>Use a clear structure so you do not rush or ramble.</li>
                <li>Say your clinical reasoning out loud where appropriate.</li>
                <li>Repeat tricky stations until your wording feels natural.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/osce"
              className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all"
            >
              <Play className="w-4 h-4" />
              Try OSCE Tool
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--purple)]/15 text-[var(--plum)] font-semibold text-sm hover:bg-[var(--lilac-soft)]/40 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Quiz Tool Guide */}
        <div className="ed-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[var(--purple)]/15 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-[var(--purple)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--plum)]">Core Quiz</h2>
              <p className="text-sm text-[var(--plum-dark)]/70">
                Test your knowledge across key nursing topics and build recall
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="space-y-5">
              <Step
                number="1"
                title="Pick a topic or jump in"
                description="Choose a topic you want to revise or use the quiz to quickly find out where your gaps are."
              />
              <Step
                number="2"
                title="Answer before looking"
                description="Try to commit to an answer first. Even getting it wrong helps strengthen your memory when you review it afterwards."
              />
              <Step
                number="3"
                title="Use feedback properly"
                description="Do not just move on after each question. Read the explanation, compare it to your thinking, and notice patterns in your mistakes."
              />
              <Step
                number="4"
                title="Revisit weak areas"
                description="Come back to the topics you struggle with until they start to feel familiar and easier to recall under pressure."
              />
            </div>

            <div className="rounded-2xl bg-[var(--lilac-soft)]/35 border border-[var(--purple)]/10 p-5">
              <h3 className="font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
                <Brain className="w-4 h-4 text-[var(--purple)]" />
                Quiz mini strategy
              </h3>
              <ul className="space-y-3 text-sm text-[var(--plum-dark)]/75 leading-6">
                <li>Use quizzes little and often instead of saving everything for one long session.</li>
                <li>Keep a note of repeated mistakes or weak topics.</li>
                <li>Mix strong and weak topics so revision feels balanced.</li>
                <li>Come back to questions you got wrong a day or two later.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[var(--plum)] transition-all"
            >
              <Play className="w-4 h-4" />
              Try Core Quiz
            </Link>

            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--purple)]/15 text-[var(--plum)] font-semibold text-sm hover:bg-[var(--lilac-soft)]/40 transition-all"
            >
              Explore topics
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Study routine */}
        <div className="ed-card">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-[var(--purple)]" />
            A simple daily routine
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[var(--purple)]/10 p-5 bg-white">
              <h3 className="font-semibold text-[var(--plum)] mb-2">10-minute version</h3>
              <p className="text-sm text-[var(--plum-dark)]/75 leading-6">
                Do a short quiz, review the feedback, and practise one small concept out loud.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--purple)]/10 p-5 bg-white">
              <h3 className="font-semibold text-[var(--plum)] mb-2">20-minute version</h3>
              <p className="text-sm text-[var(--plum-dark)]/75 leading-6">
                Start with quiz questions, then complete one OSCE station and reflect on what to improve next time.
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="ed-card bg-[var(--lilac-soft)]/50">
          <h2 className="text-lg font-semibold text-[var(--plum)] mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Tips for Success
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <Tip title="Little and often">
              10 to 15 minutes most days usually works better than one long cram session.
            </Tip>

            <Tip title="Mix it up">
              Alternate between OSCE and Quiz so you build both confidence and recall.
            </Tip>

            <Tip title="Review mistakes">
              The questions and stations you find hardest are often the ones that help you improve the most.
            </Tip>

            <Tip title="Practise out loud">
              Saying answers out loud helps with memory, confidence, and exam-style communication.
            </Tip>
          </div>
        </div>
      </div>
    </EditorialLayout>
  );
}
