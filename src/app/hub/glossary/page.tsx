'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EditorialSaveButton from '@/components/EditorialSaveButton';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { glossaryTerms, glossaryCategories, GlossaryCategory, GlossaryTerm, GlossaryPopulation } from '@/lib/glossary';

// ─── Glossary card ────────────────────────────────────────────────────────────

function GlossaryCard({ term, isUnlocked }: { term: GlossaryTerm; isUnlocked: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const canView = !term.premium || isUnlocked;
  const hasExtra = !!(term.whyItMatters || term.exampleInPractice || term.osceWording || term.redFlags?.length || term.commonMistakes?.length || term.quizQuestion);

  const catStyle: Record<GlossaryCategory, string> = {
    'Basic Terms':             'bg-[rgba(245,243,240,0.92)] text-[var(--charcoal)]/78',
    'Placement Essentials':    'bg-[rgba(255,247,237,0.96)] text-[var(--espresso)]',
    'Abbreviations':           'bg-[rgba(241,246,255,0.92)] text-[var(--blue-600)]',
    'OSCE':                    'bg-[rgba(245,243,240,0.92)] text-[var(--espresso)]',
    'Medications':             'bg-[rgba(255,243,245,0.96)] text-[var(--coral-800)]',
    'Clinical Conditions':     'bg-[rgba(253,241,239,0.96)] text-[var(--coral-800)]',
    'Observations & Vitals':   'bg-[rgba(240,249,247,0.96)] text-[var(--teal-600)]',
  };

  const popStyle: Record<GlossaryPopulation, { label: string; cls: string }> = {
    general:    { label: 'General',    cls: 'bg-[rgba(245,243,240,0.92)] text-[var(--charcoal)]/72' },
    adult:      { label: 'Adult',      cls: 'bg-[rgba(241,246,255,0.92)] text-[var(--blue-600)]' },
    paediatric: { label: 'Paediatric', cls: 'bg-[rgba(240,249,247,0.96)] text-[var(--teal-600)]' },
  };

  return (
    <div className="border-b border-[rgba(26,24,21,0.06)] last:border-b-0 bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-5 py-5 flex items-start justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          {/* Term name — own line, display font */}
          <p className="font-display text-[1.2rem] leading-[1.1] text-[var(--espresso)] mb-2">
            {term.term}
            {term.pronunciation && (
              <span className="ml-2 font-sans text-sm font-light text-[var(--charcoal)]/40 italic">/{term.pronunciation}/</span>
            )}
          </p>
          {/* Badges below */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <span className={`text-[10px] px-2 py-0.5 ${catStyle[term.category]}`}>{term.category}</span>
            {term.population !== 'general' && (
              <span className={`text-[10px] px-2 py-0.5 ${popStyle[term.population].cls}`}>{popStyle[term.population].label}</span>
            )}
            {term.premium && !isUnlocked && (
              <span className="text-[10px] px-2 py-0.5 bg-[rgba(245,243,240,0.92)] text-[var(--espresso)]">Premium</span>
            )}
          </div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--charcoal)]/38 mb-1">Plain English</p>
          <p className="text-sm font-light leading-6 text-[var(--charcoal)]/75">{term.shortDefinition}</p>
        </div>
        {hasExtra && (
          <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--charcoal)]/35 shrink-0 mt-0.5">
            {isExpanded ? 'Close' : 'Open'}
          </span>
        )}
      </button>

      {isExpanded && hasExtra && (
        <div className="border-t border-[rgba(26,24,21,0.06)]">
          {canView ? (
            <div className="px-5 py-5 space-y-4 bg-[rgba(245,243,240,0.4)]">
              {term.whyItMatters && (
                <div className="border-l-2 border-[rgba(200,112,10,0.22)] pl-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--espresso)] mb-1">Why it matters</p>
                  <p className="text-sm font-light leading-7 text-[var(--charcoal)]/75">{term.whyItMatters}</p>
                </div>
              )}
              {term.exampleInPractice && (
                <div className="border-l-2 border-[rgba(26,24,21,0.12)] pl-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--espresso)] mb-1">Example in practice</p>
                  <p className="text-sm font-light leading-7 text-[var(--charcoal)]/75">{term.exampleInPractice}</p>
                </div>
              )}
              {term.osceWording && (
                <div className="border-l-2 border-[rgba(26,24,21,0.15)] pl-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--espresso)] mb-1">OSCE wording</p>
                  <p className="text-sm font-light leading-7 text-[var(--charcoal)]/75 italic">&ldquo;{term.osceWording}&rdquo;</p>
                </div>
              )}
              {term.redFlags && term.redFlags.length > 0 && (
                <div className="border-l-2 border-[rgba(153,60,29,0.22)] pl-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--espresso)] mb-1">Red flags</p>
                  <ul className="space-y-1">
                    {term.redFlags.map((f, i) => (
                      <li key={i} className="text-sm font-light text-[var(--coral-800)] flex items-start gap-2">
                        <span className="text-[var(--coral-600)] shrink-0">•</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {term.commonMistakes && term.commonMistakes.length > 0 && (
                <div className="border-l-2 border-[rgba(200,112,10,0.22)] pl-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--espresso)] mb-1">Common mistakes</p>
                  <ul className="space-y-1">
                    {term.commonMistakes.map((m, i) => (
                      <li key={i} className="text-sm font-light text-[var(--charcoal)] flex items-start gap-2">
                        <span className="text-[var(--charcoal)]/40 shrink-0">•</span>{m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {term.quizQuestion && <QuizSection quiz={term.quizQuestion} />}
            </div>
          ) : (
            <div className="px-5 py-5 relative">
              <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center p-6">
                <p className="text-sm text-[var(--espresso)] font-medium text-center mb-3">
                  Unlock detailed explanations, OSCE wording &amp; quiz questions
                </p>
                <Link href="/pricing" className="inline-flex items-center gap-2 bg-[var(--espresso)] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#3a2010]">
                  Unlock full explanation
                </Link>
              </div>
              <div className="space-y-3 opacity-30 select-none" aria-hidden="true">
                <div className="border-l-2 border-[rgba(200,112,10,0.22)] pl-4">
                  <p className="text-xs text-[var(--espresso)]">Why it matters</p>
                  <p className="text-sm text-[var(--charcoal)]">Detailed explanation about clinical importance...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Quiz section ─────────────────────────────────────────────────────────────

function QuizSection({ quiz }: { quiz: NonNullable<GlossaryTerm['quizQuestion']> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const correct = selected === quiz.answerIndex;

  return (
    <div className="bg-white p-4 border border-[rgba(26,24,21,0.08)]">
      <p className="mb-3 text-sm font-medium text-[var(--espresso)]">{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { setSelected(i); setShown(true); }}
            disabled={shown}
            className={`w-full text-left text-sm px-3 py-2 transition-all border ${
              shown
                ? i === quiz.answerIndex
                  ? 'bg-[rgba(240,249,247,0.96)] text-[var(--teal-600)] border-[var(--teal-600)]/30'
                  : selected === i
                    ? 'bg-[rgba(253,241,239,0.96)] text-[var(--coral-800)] border-[var(--coral-600)]/30'
                    : 'bg-[rgba(245,243,240,0.5)] text-[var(--charcoal)]/40 border-[rgba(26,24,21,0.06)]'
                : 'bg-[rgba(245,243,240,0.5)] hover:bg-[rgba(245,243,240,0.9)] text-[var(--charcoal)] border-transparent'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {shown && (
        <div className={`mt-3 p-3 text-sm ${correct ? 'bg-[rgba(240,249,247,0.72)]' : 'bg-[rgba(255,247,237,0.72)]'}`}>
          <p className={`font-medium ${correct ? 'text-[var(--teal-600)]' : 'text-[var(--espresso)]'}`}>
            {correct ? '✓ Correct!' : '✗ Not quite!'}
          </p>
          <p className="text-[var(--charcoal)]/75 mt-1 font-light">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}

// ─── Letter group (accordion row) ────────────────────────────────────────────

function LetterGroup({ letter, terms, isUnlocked }: { letter: string; terms: GlossaryTerm[]; isUnlocked: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div id={`letter-${letter}`} className="border border-[rgba(26,24,21,0.08)] bg-white">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-5 px-6 py-5 text-left hover:bg-[rgba(245,243,240,0.4)] transition-colors"
      >
        <span className="font-display italic text-[3rem] leading-none text-[var(--espresso)] w-10 shrink-0">{letter}</span>
        <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--charcoal)]/45">
          {terms.length} {terms.length === 1 ? 'term' : 'terms'}
        </span>
        <span className="ml-auto text-[var(--charcoal)]/35 text-xl leading-none select-none">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="border-t border-[rgba(26,24,21,0.08)]">
          {terms.map(term => (
            <GlossaryCard key={term.id} term={term} isUnlocked={isUnlocked} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function GlossaryPage() {
  const { isPro, isLoading } = useEntitlements();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<GlossaryCategory | 'All'>('All');
  const [selectedPop, setSelectedPop] = useState<GlossaryPopulation | 'all'>('all');

  const filtered = useMemo(() => {
    return glossaryTerms.filter(term => {
      const catOk = selectedCat === 'All' || term.category === selectedCat;
      const popOk = selectedPop === 'all' || term.population === selectedPop || (selectedPop !== 'general' && term.population === 'general');
      if (!search.trim()) return catOk && popOk;
      const q = search.toLowerCase();
      return catOk && popOk && (
        term.term.toLowerCase().includes(q) ||
        term.shortDefinition.toLowerCase().includes(q) ||
        term.category.toLowerCase().includes(q) ||
        (isPro && term.whyItMatters?.toLowerCase().includes(q)) ||
        (isPro && term.exampleInPractice?.toLowerCase().includes(q))
      );
    });
  }, [search, selectedCat, selectedPop, isPro]);

  const byLetter = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    for (const term of filtered) {
      const l = term.term[0].toUpperCase();
      if (!map[l]) map[l] = [];
      map[l].push(term);
    }
    return map;
  }, [filtered]);

  const activeLetters = useMemo(() => new Set(Object.keys(byLetter)), [byLetter]);

  const scrollTo = useCallback((letter: string) => {
    document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const freeCount = glossaryTerms.filter(t => !t.premium).length;
  const premiumCount = glossaryTerms.filter(t => t.premium).length;
  const adultCount = glossaryTerms.filter(t => t.population === 'adult').length;
  const paedCount = glossaryTerms.filter(t => t.population === 'paediatric').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center">
        <div className="text-sm text-[var(--charcoal)]/60">Loading&hellip;</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      <Navbar />

      {/* Header */}
      <section
        className="border-b border-[rgba(26,24,21,0.08)] pt-28 pb-10"
        style={{ background: 'linear-gradient(180deg, rgba(250,248,244,0.98) 0%, rgba(245,243,240,0.9) 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/hub" className="inline-flex items-center text-sm text-[var(--charcoal)]/55 hover:text-[var(--espresso)] mb-8 transition-colors underline underline-offset-4">
            ← Back to Hub
          </Link>

          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/45 mb-5">Glossary</p>

          <h1 className="font-display text-[clamp(2.6rem,5vw,4rem)] leading-[1.06] tracking-[-0.01em] text-[var(--espresso)] mb-5 max-w-[14ch]">
            Glossary of Terms
          </h1>

          <hr className="border-none border-t-0 h-px bg-[rgba(26,24,21,0.08)] mb-5" />

          <p className="text-base font-light leading-[1.7] text-[var(--charcoal)] max-w-[520px] mb-3">
            Search nursing words, abbreviations, and clinical phrases with simple student-friendly explanations.
          </p>
          <p className="text-sm font-light text-[var(--charcoal)]/50 mb-6 max-w-2xl">
            The real term stays on the card, but the first line is written as the version you&apos;d want a friend on placement to say out loud.
          </p>

          <EditorialSaveButton hubItemId="glossary" hubItemTitle="Glossary of Terms" />

          {/* Single flat data line instead of dot bullets */}
          <p className="mt-5 text-sm font-light text-[var(--charcoal)]/50">
            {glossaryTerms.length} terms &mdash; {freeCount} free &middot; {premiumCount} premium &middot; {adultCount} adult &middot; {paedCount} paediatric
          </p>
        </div>
      </section>

      {/* Sticky filters — lighter, no outer border box */}
      <div className="sticky top-20 z-30 bg-[var(--cream)] border-b border-[rgba(26,24,21,0.07)] py-3">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search a word, abbreviation, or topic&hellip;"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-[rgba(26,24,21,0.1)] bg-white focus:outline-none focus:border-[rgba(26,24,21,0.22)] text-[var(--espresso)] text-sm placeholder:text-[var(--charcoal)]/35"
            />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/38">Patient</span>
            {(['all', 'adult', 'paediatric'] as const).map(p => (
              <button key={p} onClick={() => setSelectedPop(p)}
                className={`text-xs transition-all underline-offset-4 ${
                  selectedPop === p
                    ? 'text-[var(--espresso)] font-medium underline'
                    : 'text-[var(--charcoal)]/50 hover:text-[var(--espresso)]'
                }`}>
                {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}

            <span className="text-[var(--charcoal)]/20 select-none">|</span>

            <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--charcoal)]/38">Category</span>
            {(['All', ...glossaryCategories] as const).map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat as GlossaryCategory | 'All')}
                className={`text-xs transition-all whitespace-nowrap underline-offset-4 ${
                  selectedCat === cat
                    ? 'text-[var(--espresso)] font-medium underline'
                    : 'text-[var(--charcoal)]/50 hover:text-[var(--espresso)]'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* Alphabet nav — plain letters, no bordered squares */}
        <div className="mb-7 flex flex-wrap gap-x-2 gap-y-1">
          {ALL_LETTERS.map(l => (
            <button
              key={l}
              onClick={() => activeLetters.has(l) && scrollTo(l)}
              className={`text-sm w-6 text-center transition-colors ${
                activeLetters.has(l)
                  ? 'text-[var(--espresso)] hover:underline underline-offset-4 cursor-pointer'
                  : 'text-[var(--charcoal)]/18 cursor-default'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="font-display text-[1.6rem] text-[var(--espresso)] mb-2">No results found</h3>
            <p className="text-sm font-light text-[var(--charcoal)]/55 mb-4">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setSelectedCat('All'); setSelectedPop('all'); }}
              className="text-sm text-[var(--espresso)] underline underline-offset-4 hover:no-underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {ALL_LETTERS.filter(l => byLetter[l]).map(l => (
              <LetterGroup key={l} letter={l} terms={byLetter[l]} isUnlocked={isPro} />
            ))}
          </div>
        )}

        {!isPro && (
          <div className="mt-12 border border-[rgba(26,24,21,0.08)] bg-[rgba(245,243,240,0.72)] p-6 sm:p-8 text-center">
            <h3 className="font-display text-[1.6rem] text-[var(--espresso)] mb-2">
              Unlock all {premiumCount} premium terms
            </h3>
            <p className="text-sm font-light leading-7 text-[var(--charcoal)] mb-6 max-w-md mx-auto">
              Get detailed explanations, OSCE wording, red flags, and quiz questions for every term.
            </p>
            <Link href="/pricing" className="inline-flex items-center gap-2 bg-[var(--espresso)] px-6 py-3 text-sm text-white transition-colors hover:bg-[#3a2010]">
              Upgrade to Pro
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
