'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import {
  Search,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Stethoscope,
  Heart,
  MessageCircle,
  Lock,
  Zap,
  BookOpen,
  HelpCircle,
  ChevronRight,
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
];

const difficultyStyles: Record<HubItem['difficulty'], string> = {
  'Quick Win': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  'Deep Dive': 'bg-purple-50 text-purple-700 border-purple-200',
};

const difficultyIcons: Record<HubItem['difficulty'], any> = {
  'Quick Win': Zap,
  Moderate: BookOpen,
  'Deep Dive': Sparkles,
};

// Hub Card Component
function HubCard({ item, isPro, isSignedIn }: { item: HubItem; isPro: boolean; isSignedIn: boolean }) {
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
        relative card cursor-pointer transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:ring-offset-2
        ${!canAccess ? 'overflow-hidden' : ''}
      `}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
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

      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            item.isLocked ? 'bg-[var(--purple)]/10 text-[var(--purple)]' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {item.isLocked ? 'PREMIUM' : 'FREE'}
        </span>

        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${difficultyStyles[item.difficulty]}`}>
          <DifficultyIcon className="w-3 h-3" />
          {item.difficulty}
        </span>
      </div>

      <h3 className="text-[var(--plum)] text-base font-semibold mb-2 line-clamp-2">{item.title}</h3>
      <p className="text-sm text-[var(--plum-dark)]/70 mb-4 line-clamp-2">{item.description}</p>

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

export default function HubPage() {
  const { isSignedIn } = useUser();

  // ✅ TEMP for now: set true once you wire up purchase checks
  const isPro = false;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    return hubItems.filter((item) => {
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchesTags = selectedTags.size === 0 || item.tags.some((tag) => selectedTags.has(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  const freeCount = hubItems.filter((i) => !i.isLocked).length;
  const premiumCount = hubItems.filter((i) => i.isLocked).length;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream">
        <Navbar />

        {/* Hero */}
        <section className="gradient-hero pt-28 pb-16 relative overflow-hidden">
          <div className="blob blob-1" />
          <div className="blob blob-2" />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[var(--lavender)]/30">
              <Stethoscope className="w-4 h-4 text-[var(--purple)]" />
              <span className="text-[var(--plum)]">Content Library</span>
            </div>

            <h1 className="mb-4">Nursing Hub</h1>
            <p className="text-lg md:text-xl text-[var(--plum-dark)]/80 mb-8 max-w-2xl mx-auto">
              Your Nursing Bestie for OSCEs, exams & placement survival
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#resources" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                <ArrowDown className="w-5 h-5" />
                Browse free resources
              </a>
              <Link href="/pricing" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Unlock everything
              </Link>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section id="resources" className="bg-cream py-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--plum-dark)]/40" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-[var(--lilac-medium)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] focus:border-transparent text-[var(--plum-dark)]"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.has(tag)
                      ? 'bg-[var(--purple)] text-white'
                      : 'bg-[var(--lilac-soft)] text-[var(--plum-dark)]/70 hover:bg-[var(--lilac)]'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.size > 0 && (
                <button
                  onClick={() => setSelectedTags(new Set())}
                  className="px-4 py-2 rounded-full text-sm font-medium text-[var(--purple)] hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex justify-center gap-6 text-sm text-[var(--plum-dark)]/60 mb-8">
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
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <HubCard key={item.id} item={item} isPro={isPro} isSignedIn={!!isSignedIn} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Premium Upsell */}
        {!isPro && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="gradient-hero rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="blob blob-1" style={{ opacity: 0.3 }} />

                <div className="relative z-10">
                  <div className="text-4xl mb-4">✨</div>
                  <h2 className="text-white mb-4">Unlock the Full Library</h2>
                  <p className="text-white/80 mb-8 max-w-lg mx-auto">
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
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-white/90 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[var(--mint)] flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 bg-white text-[var(--purple)] px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Go Premium
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Q&A Board */}
        <section className="bg-white py-12 border-y border-[var(--lilac-medium)]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-[var(--plum)] mb-2">Q&A Board</h3>
                <p className="text-[var(--plum-dark)]/70">
                  Got a nursing question? Ask the community! Browse questions from other students or post your own.
                </p>
              </div>

              <Link
                href="/hub/questions"
                className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all flex-shrink-0"
              >
                Browse Q&A
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Need Help */}
        <section className="bg-[var(--lilac-soft)] py-12">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-[var(--pink)]" />
              <h3 className="text-[var(--plum)]">Need help?</h3>
            </div>
            <p className="text-[var(--plum-dark)]/70 mb-6">
              Got questions about the resources or need study advice? I&apos;m here to help!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Get in Touch
            </Link>
          </div>
        </section>

        <footer className="bg-[var(--lilac)] px-6 py-8 text-center text-[var(--plum-dark)]/70 text-sm">
          <p>Made with love by Lauren</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/privacy" className="hover:text-[var(--plum)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--plum)]">
              Terms
            </Link>
            <Link href="/about" className="hover:text-[var(--plum)]">
              About
            </Link>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
