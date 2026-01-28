'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import {
  Search,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Stethoscope,
  Lock,
  Zap,
  BookOpen,
} from 'lucide-react';

// Hub content items
interface HubItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'Quick Win' | 'Moderate' | 'Deep Dive';
  isLocked: boolean;
  href: string;
}

const hubItems: HubItem[] = [
  {
    id: '1',
    title: 'Paeds Respiratory Assessment',
    description:
      'Complete guide to assessing respiratory function in children including work of breathing and red flags.',
    tags: ['OSCE', 'Paeds', 'Assessment'],
    difficulty: 'Moderate',
    isLocked: false,
    href: '/hub/resources/paeds-respiratory-assessment',
  },
  {
    id: '2',
    title: 'Sepsis 6 & Escalation',
    description: 'Step-by-step sepsis recognition and the Sepsis 6 bundle with escalation pathways.',
    tags: ['Emergency/ABCDE', 'Adult Nursing', 'Critical Care'],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/sepsis-6-escalation',
  },
  {
    id: '3',
    title: 'Wound Care & Infection Control',
    description: 'Wound assessment, dressing selection, and infection prevention best practices.',
    tags: ['Adult Nursing', 'Placement', 'Practical'],
    difficulty: 'Moderate',
    isLocked: false,
    href: '/hub/resources/wound-care-infection-control',
  },
  {
    id: '4',
    title: 'Medicines Management OSCE',
    description: 'Drug calculations, administration routes, and common medication errors to avoid.',
    tags: ['OSCE', 'Meds & Calculations'],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/medicines-management-osce',
  },
  {
    id: '5',
    title: 'SBAR Handover Template',
    description: 'Printable SBAR template with examples for confident clinical handovers.',
    tags: ['Placement', 'Communication'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/sbar-handover',
  },
  {
    id: '6',
    title: 'IV Fluids & Vitals Red Flags',
    description: 'Fluid balance essentials and vital signs that need immediate escalation.',
    tags: ['Adult Nursing', 'Emergency/ABCDE', 'Critical Care'],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/iv-fluids-vitals',
  },
  {
    id: '7',
    title: 'NEWS2 Quick Guide',
    description: 'National Early Warning Score explained with scoring chart and response triggers.',
    tags: ['Adult Nursing', 'Assessment', 'Emergency/ABCDE'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/news2-guide',
  },
  {
    id: '11',
    title: 'PEWS - Paediatric Early Warning Score',
    description: 'Age-appropriate early warning scoring for children with escalation triggers.',
    tags: ['Paeds', 'Assessment', 'Emergency/ABCDE'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/pews-guide',
  },
  {
    id: '8',
    title: 'Pressure Area Care Plan',
    description: 'Waterlow scoring, prevention strategies, and SSKIN bundle implementation.',
    tags: ['Adult Nursing', 'Placement', 'Care Planning'],
    difficulty: 'Moderate',
    isLocked: true,
    href: '/hub/resources/pressure-area-care',
  },
  {
    id: '9',
    title: 'A-E Assessment Checklist',
    description: 'Systematic ABCDE assessment approach with printable pocket checklist.',
    tags: ['OSCE', 'Emergency/ABCDE', 'Assessment'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/ae-assessment',
  },
  {
    id: '10',
    title: 'End of Life Communication Phrases',
    description: 'Compassionate phrases and frameworks for difficult conversations with families.',
    tags: ['Mental Health', 'Palliative', 'Communication'],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/end-of-life-communication',
  },
];

// Filter tags
const filterTags = [
  'OSCE',
  'Adult Nursing',
  'Paeds',
  'Mental Health',
  'Meds & Calculations',
  'Placement',
  'Revision Plans',
  'Emergency/ABCDE',
] as const;

const difficultyStyles: Record<HubItem['difficulty'], string> = {
  'Quick Win': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  'Deep Dive': 'bg-purple-50 text-purple-700 border-purple-200',
};

const difficultyIcons: Record<HubItem['difficulty'], React.ComponentType<{ className?: string }>> = {
  'Quick Win': Zap,
  Moderate: BookOpen,
  'Deep Dive': Sparkles,
};

// Hub Card Component
function HubCard({
  item,
  isPro,
  isSignedIn,
}: {
  item: HubItem;
  isPro: boolean;
  isSignedIn: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const canAccess = !item.isLocked || isPro;
  const DifficultyIcon = difficultyIcons[item.difficulty];

  const handleClick = () => {
    if (canAccess) {
      router.push(item.href);
      return;
    }

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    showToast("That's a Pro resource 💜", 'info');
    router.push('/pricing');
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative card card-lift cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2
        ${!canAccess ? 'overflow-hidden' : ''}
      `}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      role="button"
    >
      {/* Locked overlay */}
      {!canAccess && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-[var(--lilac)] flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-[var(--purple)]" />
          </div>
          <span className="text-xs font-semibold text-[var(--purple)] bg-[var(--lilac-soft)] px-3 py-1 rounded-full">
            Upgrade to access
          </span>
        </div>
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            item.isLocked ? 'bg-[var(--purple)]/10 text-[var(--purple)]' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {item.isLocked ? 'PREMIUM' : 'FREE'}
        </span>

        <span
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${difficultyStyles[item.difficulty]}`}
        >
          <DifficultyIcon className="w-3 h-3" />
          {item.difficulty}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-[var(--plum)] text-base font-semibold mb-2 line-clamp-2">{item.title}</h3>
      <p className="text-sm text-[var(--plum-dark)]/70 mb-4 line-clamp-2">{item.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div
        className={`
          w-full py-2 rounded-full text-sm font-semibold text-center transition-all
          ${canAccess ? 'bg-[var(--purple)] text-white hover:bg-[var(--plum)]' : 'bg-[var(--lilac)] text-[var(--purple)]'}
        `}
      >
        {canAccess ? 'Open Resource' : 'Unlock'}
      </div>
    </div>
  );
}

// Main Client Component
export default function HubClient({
  isPro = false,
  isSignedIn = false,
}: {
  isPro?: boolean;
  isSignedIn?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const freeCount = hubItems.filter((i) => !i.isLocked).length;
  const premiumCount = hubItems.filter((i) => i.isLocked).length;

  // --- Home-style scroll + count-up animations ---
  const statsRef = useRef<HTMLDivElement>(null);
  const [counters, setCounters] = useState<Record<string, number>>({});
  const [hasAnimated, setHasAnimated] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const animateCounter = useCallback((id: string, target: number, duration: number) => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    intervalRef.current = window.setInterval(() => {
      current += increment;

      if (current >= target) {
        setCounters((prev) => ({ ...prev, [id]: target }));

        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        setCounters((prev) => ({ ...prev, [id]: Math.floor(current) }));
      }
    }, stepDuration);
  }, []);

  // Scroll animations (same as home)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.animate = 'in';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Counter animation trigger
  useEffect(() => {
    if (!statsRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setHasAnimated(true);
          animateCounter('total', hubItems.length, 1200);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [hasAnimated, animateCounter]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return hubItems.filter((item) => {
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesTags = selectedTags.size === 0 || item.tags.some((tag) => selectedTags.has(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream">
        <Navbar />

        {/* Hero (full screen like Home) */}
        <section className="gradient-hero min-h-screen relative overflow-hidden flex items-center">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />

          <div className="max-w-6xl mx-auto px-6 py-32 relative z-10 w-full">
            <div className="text-center max-w-3xl mx-auto">
              <div className="animate-on-scroll hero-badge">
                <Stethoscope className="w-4 h-4 text-[var(--purple)]" />
                <span className="text-[var(--plum)]">Content Library</span>
                <Sparkles className="w-4 h-4 text-[var(--pink)] icon-pulse" />
              </div>

              <h1 className="animate-on-scroll mb-2 hero-title">
                <span className="gradient-text">Nursing Hub</span>
              </h1>

              <p className="animate-on-scroll hero-subtitle">
                Your Nursing Bestie for OSCEs, exams & placement survival
              </p>

              <p className="animate-on-scroll hero-description">
                Free checklists, printable templates, and deep-dive guides — with premium resources when you’re ready.
              </p>

              <div className="animate-on-scroll hero-cta-group">
                <a
                  href="#resources"
                  className="btn-secondary btn-hover text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                >
                  <ArrowDown className="w-5 h-5" />
                  Browse free resources
                </a>

                <Link
                  href="/pricing"
                  className="btn-primary btn-hover text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Unlock everything
                </Link>
              </div>
            </div>
          </div>

          {/* Wave divider like Home */}
          <div className="wave-divider">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.1,118.92,150.63,69.29,321.39,56.44Z"
                fill="var(--cream)"
              />
            </svg>
          </div>
        </section>

        {/* Stats (home vibe) */}
        <section className="bg-cream py-12" ref={statsRef}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { id: 'total', label: 'Resources', icon: '📚', value: hubItems.length },
                { id: 'free', label: 'Free resources', icon: '🆓', value: freeCount },
                { id: 'premium', label: 'Premium resources', icon: '✨', value: premiumCount },
                { id: 'updates', label: 'Updated weekly', icon: '🗓️', value: '✓' },
              ].map((s, i) => (
                <div
                  key={s.id}
                  className="animate-on-scroll stat-card"
                  style={{ animationDelay: i * 0.1 + 's' }}
                >
                  <span className="text-2xl mb-2 block emoji-float" style={{ animationDelay: i * 0.2 + 's' }}>
                    {s.icon}
                  </span>

                  <div className="stat-number">
                    {typeof s.value === 'number'
                      ? s.id === 'total'
                        ? counters.total ?? 0
                        : s.value
                      : s.value}
                  </div>

                  <p className="text-[var(--plum-dark)]/60 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section id="resources" className="bg-cream py-10">
          <div className="max-w-6xl mx-auto px-6">
            {/* Search */}
            <div className="animate-on-scroll relative max-w-md mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--plum-dark)]/40" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--lilac-medium)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:border-transparent text-[var(--plum-dark)]"
              />
            </div>

            {/* Filter chips */}
            <div className="animate-on-scroll flex flex-wrap justify-center gap-2 mb-6">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.has(tag)
                      ? 'bg-[var(--purple)] text-white'
                      : 'bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70 hover:bg-[var(--lilac)]'
                  }`}
                  type="button"
                >
                  {tag}
                </button>
              ))}

              {selectedTags.size > 0 && (
                <button
                  onClick={() => setSelectedTags(new Set())}
                  className="px-4 py-2 rounded-full text-sm font-medium text-[var(--purple)] hover:underline"
                  type="button"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Legend */}
            <div className="animate-on-scroll flex justify-center gap-6 text-sm text-[var(--plum-dark)]/60 mb-8">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                FREE ({freeCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[var(--purple)]" />
                PREMIUM ({premiumCount})
              </span>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="bg-cream pb-16">
          <div className="max-w-6xl mx-auto px-6">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--plum-dark)]/60">No resources match your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags(new Set());
                  }}
                  className="mt-4 text-[var(--purple)] font-medium hover:underline"
                  type="button"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="animate-on-scroll fade-in-up"
                    style={{ animationDelay: i * 0.06 + 's' }}
                  >
                    <HubCard item={item} isPro={isPro} isSignedIn={isSignedIn} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Premium Upsell - Hide if already Pro */}
        {!isPro && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="gradient-hero rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="blob blob-1" style={{ opacity: 0.3 }} />

                <div className="relative z-10">
                  <div className="animate-on-scroll text-4xl mb-4 emoji-float">✨</div>
                  <h2 className="animate-on-scroll text-white mb-4">Unlock the Full Library</h2>
                  <p className="animate-on-scroll text-white/80 mb-8 max-w-lg mx-auto">
                    Get instant access to every resource, updated weekly with new content.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-left">
                    {[
                      'Full OSCE station packs',
                      'Smart quizzes with feedback',
                      'Progress tracking dashboard',
                      'Printable checklists & guides',
                      'New content added weekly',
                      'Lifetime access, one payment',
                    ].map((feature, i) => (
                      <div
                        key={feature}
                        className="animate-on-scroll fade-in-up flex items-start gap-2 text-white/90"
                        style={{ animationDelay: i * 0.06 + 's' }}
                      >
                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-white" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/pricing"
                    className="animate-on-scroll btn-primary btn-hover text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Upgrade to Pro
                  </Link>

                  <p className="animate-on-scroll text-white/70 text-sm mt-4">
                    One payment • Lifetime access • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </ToastProvider>
  );
}
