'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { glossaryTerms, glossaryCategories, glossaryPopulations, GlossaryCategory, GlossaryTerm, GlossaryPopulation } from '@/lib/glossary';
import { 
  Search, 
  ArrowLeft, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Sparkles,
  AlertTriangle,
  Lightbulb,
  MessageCircle,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Users,
  Baby,
  User,
} from 'lucide-react';

// Single glossary card component
function GlossaryCard({ 
  term, 
  isUnlocked 
}: { 
  term: GlossaryTerm; 
  isUnlocked: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const canViewPremiumContent = !term.premium || isUnlocked;
  const hasPremiumContent = term.whyItMatters || term.exampleInPractice || term.osceWording || term.redFlags || term.commonMistakes || term.quizQuestion;

  const categoryColors: Record<GlossaryCategory, string> = {
    "Abbreviations": "bg-blue-100 text-blue-700",
    "OSCE": "bg-purple-100 text-purple-700",
    "Medications": "bg-pink-100 text-pink-700",
    "Clinical Conditions": "bg-red-100 text-red-700",
    "Observations & Vitals": "bg-emerald-100 text-emerald-700",
    "Placement Basics": "bg-amber-100 text-amber-700",
  };

  const populationColors: Record<GlossaryPopulation, { bg: string; icon: React.ReactNode }> = {
    "general": { bg: "bg-gray-100 text-gray-600", icon: <Users className="w-3 h-3" /> },
    "adult": { bg: "bg-indigo-100 text-indigo-700", icon: <User className="w-3 h-3" /> },
    "paediatric": { bg: "bg-cyan-100 text-cyan-700", icon: <Baby className="w-3 h-3" /> },
  };

  return (
    <div className="card bg-white border border-[var(--lilac)] rounded-xl overflow-hidden transition-all hover:shadow-md">
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-[var(--plum)]">{term.term}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[term.category]}`}>
              {term.category}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${populationColors[term.population].bg}`}>
              {populationColors[term.population].icon}
              {term.population === 'paediatric' ? 'Paeds' : term.population === 'adult' ? 'Adult' : 'All'}
            </span>
            {term.premium && !isUnlocked && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--purple)]/10 text-[var(--purple)]">
                <Lock className="w-3 h-3 inline mr-1" />
                Premium
              </span>
            )}
          </div>
          {term.pronunciation && (
            <p className="text-xs text-[var(--plum-dark)]/50 italic mb-1">/{term.pronunciation}/</p>
          )}
          <p className="text-sm text-[var(--plum-dark)]/80">{term.shortDefinition}</p>
        </div>
        <div className="flex-shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-[var(--purple)]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[var(--plum-dark)]/40" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && hasPremiumContent && (
        <div className="border-t border-[var(--lilac)]">
          {canViewPremiumContent ? (
            <div className="p-4 sm:p-5 space-y-4 bg-[var(--lilac-soft)]/50">
              {term.whyItMatters && (
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--plum)] uppercase tracking-wide mb-1">Why it matters</p>
                    <p className="text-sm text-[var(--plum-dark)]/80">{term.whyItMatters}</p>
                  </div>
                </div>
              )}

              {term.exampleInPractice && (
                <div className="flex gap-3">
                  <MessageCircle className="w-5 h-5 text-[var(--purple)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--plum)] uppercase tracking-wide mb-1">Example in practice</p>
                    <p className="text-sm text-[var(--plum-dark)]/80">{term.exampleInPractice}</p>
                  </div>
                </div>
              )}

              {term.osceWording && (
                <div className="flex gap-3">
                  <BookOpen className="w-5 h-5 text-[var(--lavender-dark)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--plum)] uppercase tracking-wide mb-1">OSCE wording</p>
                    <p className="text-sm text-[var(--plum-dark)]/80 italic">&ldquo;{term.osceWording}&rdquo;</p>
                  </div>
                </div>
              )}

              {term.redFlags && term.redFlags.length > 0 && (
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--plum)] uppercase tracking-wide mb-1">Red flags 🚩</p>
                    <ul className="space-y-1">
                      {term.redFlags.map((flag, i) => (
                        <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {term.commonMistakes && term.commonMistakes.length > 0 && (
                <div className="flex gap-3">
                  <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[var(--plum)] uppercase tracking-wide mb-1">Common mistakes</p>
                    <ul className="space-y-1">
                      {term.commonMistakes.map((mistake, i) => (
                        <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                          <span className="text-orange-500">✗</span>
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {term.quizQuestion && (
                <QuizSection quiz={term.quizQuestion} />
              )}
            </div>
          ) : (
            /* Locked premium content */
            <div className="p-4 sm:p-5 relative">
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[3px] z-10 flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 rounded-full bg-[var(--lilac)] flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5 text-[var(--purple)]" />
                </div>
                <p className="text-sm text-[var(--plum)] font-medium text-center mb-3">
                  Unlock detailed explanations, OSCE wording & quiz questions
                </p>
                <Link
                  href="/pricing"
                  className="btn-primary text-sm px-5 py-2 inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Unlock full explanation
                </Link>
              </div>
              {/* Blurred preview */}
              <div className="space-y-3 opacity-40 select-none" aria-hidden="true">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[var(--plum)]">Why it matters</p>
                    <p className="text-sm text-[var(--plum-dark)]">Detailed explanation about clinical importance...</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MessageCircle className="w-5 h-5 text-[var(--purple)]" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[var(--plum)]">Example in practice</p>
                    <p className="text-sm text-[var(--plum-dark)]">Real-world scenario showing how to apply...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Quiz section component
function QuizSection({ quiz }: { quiz: NonNullable<GlossaryTerm['quizQuestion']> }) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
  };

  const isCorrect = selectedAnswer === quiz.answerIndex;

  return (
    <div className="bg-white rounded-xl p-4 border border-[var(--lilac)]">
      <div className="flex items-start gap-3 mb-3">
        <HelpCircle className="w-5 h-5 text-[var(--purple)] flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-[var(--plum)]">{quiz.question}</p>
      </div>
      
      <div className="space-y-2 ml-8">
        {quiz.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(i)}
            disabled={showAnswer}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
              showAnswer
                ? i === quiz.answerIndex
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : selectedAnswer === i
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-50 text-gray-500 border border-gray-200'
                : 'bg-[var(--lilac-soft)] hover:bg-[var(--lilac)] text-[var(--plum-dark)] border border-transparent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showAnswer && (
        <div className={`mt-3 ml-8 p-3 rounded-lg text-sm ${isCorrect ? 'bg-emerald-50' : 'bg-amber-50'}`}>
          <p className={`font-medium ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
            {isCorrect ? '✓ Correct!' : '✗ Not quite!'}
          </p>
          <p className="text-[var(--plum-dark)]/80 mt-1">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default function GlossaryPage() {
  const { isPro, isLoading } = useEntitlements();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'All'>('All');
  const [selectedPopulation, setSelectedPopulation] = useState<GlossaryPopulation | 'all'>('all');

  // Filter terms based on search, category, and population
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
      const matchesPopulation = selectedPopulation === 'all' || term.population === selectedPopulation || (selectedPopulation !== 'general' && term.population === 'general');
      
      if (!searchQuery.trim()) return matchesCategory && matchesPopulation;

      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        term.term.toLowerCase().includes(q) ||
        term.shortDefinition.toLowerCase().includes(q) ||
        term.category.toLowerCase().includes(q) ||
        (isPro && term.whyItMatters?.toLowerCase().includes(q)) ||
        (isPro && term.exampleInPractice?.toLowerCase().includes(q));

      return matchesCategory && matchesPopulation && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedPopulation, isPro]);

  const freeCount = glossaryTerms.filter(t => !t.premium).length;
  const premiumCount = glossaryTerms.filter(t => t.premium).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-pulse text-[var(--purple)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero pt-28 pb-6 relative overflow-hidden">
        <div className="blob blob-1" style={{ opacity: 0.25 }} />
        <div className="blob blob-2" style={{ opacity: 0.25 }} />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 text-[var(--plum)] hover:text-[var(--purple)] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--lavender)] to-[var(--purple)] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                NEW
              </span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-[var(--plum-dark)] mb-2">
            Glossary of Terms
          </h1>
          <p className="text-[var(--plum-dark)]/70 text-lg mb-6">
            Search nursing terms, abbreviations &amp; clinical definitions.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-[var(--plum-dark)]/60">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {freeCount} free
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--purple)]" />
              {premiumCount} premium
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              {glossaryTerms.filter(t => t.population === 'general').length} general
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              {glossaryTerms.filter(t => t.population === 'adult').length} adult
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              {glossaryTerms.filter(t => t.population === 'paediatric').length} paediatric
            </span>
          </div>
        </div>
      </section>

      {/* Sticky search & filters */}
      <div className="sticky top-20 z-30 bg-cream/95 backdrop-blur-sm border-b border-[var(--lilac)] py-4">
        <div className="max-w-4xl mx-auto px-6">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--plum-dark)]/40" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--lilac-medium)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:border-transparent text-[var(--plum-dark)]"
            />
          </div>

          {/* Population filter tabs */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-[var(--plum-dark)]/50 uppercase tracking-wide font-medium self-center mr-1">Patient:</span>
            <button
              onClick={() => setSelectedPopulation('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedPopulation === 'all'
                  ? 'bg-[var(--plum)] text-white'
                  : 'bg-white text-[var(--plum-dark)]/70 hover:bg-[var(--lilac)] border border-[var(--lilac-medium)]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              All
            </button>
            <button
              onClick={() => setSelectedPopulation('adult')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedPopulation === 'adult'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-[var(--plum-dark)]/70 hover:bg-indigo-50 border border-[var(--lilac-medium)]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Adult
            </button>
            <button
              onClick={() => setSelectedPopulation('paediatric')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                selectedPopulation === 'paediatric'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-[var(--plum-dark)]/70 hover:bg-cyan-50 border border-[var(--lilac-medium)]'
              }`}
            >
              <Baby className="w-3.5 h-3.5" />
              Paediatric
            </button>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-[var(--plum-dark)]/50 uppercase tracking-wide font-medium self-center mr-1">Category:</span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'All'
                  ? 'bg-[var(--purple)] text-white'
                  : 'bg-white text-[var(--plum-dark)]/70 hover:bg-[var(--lilac)] border border-[var(--lilac-medium)]'
              }`}
            >
              All
            </button>
            {glossaryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[var(--purple)] text-white'
                    : 'bg-white text-[var(--plum-dark)]/70 hover:bg-[var(--lilac)] border border-[var(--lilac-medium)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Terms list */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[var(--lilac)] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[var(--purple)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--plum)] mb-2">No results found</h3>
            <p className="text-[var(--plum-dark)]/60 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedPopulation('all');
              }}
              className="text-[var(--purple)] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTerms.map((term) => (
              <GlossaryCard 
                key={term.id} 
                term={term} 
                isUnlocked={isPro}
              />
            ))}
          </div>
        )}

        {/* Upgrade CTA for non-pro users */}
        {!isPro && (
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[var(--lilac)] to-[var(--pink-soft)] text-center">
            <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-[var(--purple)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--plum)] mb-2">
              Unlock all {premiumCount} premium terms
            </h3>
            <p className="text-[var(--plum-dark)]/70 mb-6 max-w-md mx-auto">
              Get detailed explanations, OSCE wording, red flags, and quiz questions for every term.
            </p>
            <Link
              href="/pricing"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade to Pro
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--lilac)] px-6 py-8 text-center text-[var(--plum-dark)]/70 text-sm">
        <p>Made with love by Lauren</p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/privacy" className="hover:text-[var(--plum)]">Privacy</Link>
          <Link href="/terms" className="hover:text-[var(--plum)]">Terms</Link>
          <Link href="/hub" className="hover:text-[var(--plum)]">Hub</Link>
        </div>
      </footer>
    </div>
  );
}
