'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import {
  Search,
  ArrowDown,
  Lock,
  Zap,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Heart,
  MessageCircle,
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
  isRecommended?: boolean;
}

const hubItems: HubItem[] = [
  // ===== RECOMMENDED / POPULAR =====
  {
    id: 'ae-guide',
    title: 'A–E Assessment Framework — Full Guide',
    description: 'Editorial-style reference covering all five steps with paediatric values, red flags, vital signs table, and an interactive after-A–E checklist.',
    tags: ['OSCE', 'Emergency/ABCDE', 'Paeds', 'Assessment'],
    difficulty: 'Quick Win' as const,
    isLocked: false,
    href: '/hub/resources/ae-assessment-guide',
    isRecommended: true,
  },
  {
    id: 'rec-1',
    title: 'Drug Calculations Cheat Sheet',
    description: 'Essential formulas, worked examples, and practice questions for medication calculations.',
    tags: ['Meds & Calculations', 'OSCE', 'Placement'],
    difficulty: 'Quick Win' as const,
    isLocked: false,
    href: '/hub/resources/drug-calculations-cheat-sheet',
    isRecommended: true,
  },
  {
    id: 'rec-3',
    title: 'Placement Survival Guide',
    description: 'Everything you need to survive and thrive on your nursing placements. Tips from real students!',
    tags: ['Placement', 'Y1 Essentials'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/placement-survival',
    isRecommended: true,
  },
  // ===== CORE RESOURCES =====
  {
    id: '0',
    title: 'Medication Abbreviations Guide',
    description: 'Common prescription abbreviations with safety warnings. Quiz mode to test yourself!',
    tags: ['Meds & Calculations', 'Placement'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/medication-abbreviations',
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
    id: '4',
    title: 'Medicines Management OSCE',
    description: 'Drug calculations, administration routes, and common medication errors to avoid.',
    tags: ['OSCE', 'Meds & Calculations'],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/medicines-management-osce',
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
    title: '9 Rights of Medication Administration',
    description: 'Essential medication safety checklist every nursing student needs to know. Interactive quiz included!',
    tags: ['Meds & Calculations', 'OSCE', 'Placement'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/9-rights-medication',
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
  // Y1 Child Nursing Resources
  {
    id: '13',
    title: 'Paediatric Vital Signs Cheat Sheet',
    description: 'Massive reference for normal vital signs by age (newborn to adolescent). Tables, cards, red flags, formulas & quiz!',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment', 'OSCE'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/paeds-vital-signs-cheat-sheet',
  },
  {
    id: '15',
    title: 'Y1 Pain Assessment in Children',
    description: 'Age-appropriate pain assessment tools including FLACC, Wong-Baker, and numeric scales.',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment', 'OSCE'],
    difficulty: 'Moderate',
    isLocked: true,
    href: '/hub/resources/y1-pain-assessment',
  },
  {
    id: '16',
    title: 'Y1 Safeguarding Children Essentials',
    description: 'Key safeguarding concepts, signs of abuse, and your responsibilities as a student nurse.',
    tags: ['Paeds', 'Y1 Essentials', 'Placement'],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/y1-safeguarding',
  },
  {
    id: '17',
    title: 'Y1 Consent & Gillick Competence',
    description: 'Understanding consent in paediatrics including Gillick competence and Fraser guidelines.',
    tags: ['Paeds', 'Y1 Essentials', 'Ethics'],
    difficulty: 'Moderate',
    isLocked: true,
    href: '/hub/resources/y1-consent-gillick',
  },
  {
    id: '18',
    title: 'Y1 Paediatric Medications Guide',
    description: 'Weight-based dosing, common paediatric medications, and safety considerations.',
    tags: ['Paeds', 'Y1 Essentials', 'Meds & Calculations'],
    difficulty: 'Deep Dive',
    isLocked: true,
    href: '/hub/resources/y1-paeds-medications',
  },
  {
    id: '21',
    title: 'Y1 Communicating with Children',
    description: 'How to adapt your communication for different ages and developmental stages.',
    tags: ['Paeds', 'Y1 Essentials', 'Communication'],
    difficulty: 'Moderate',
    isLocked: true,
    href: '/hub/resources/y1-child-communication',
  },
  // ===== MORE Y1 ESSENTIALS =====
  {
    id: '22',
    title: 'Y1 Anatomy & Physiology Basics',
    description: 'Key anatomy and physiology concepts for first-year nursing students with visual aids.',
    tags: ['Y1 Essentials', 'Revision Plans'],
    difficulty: 'Moderate',
    isLocked: false,
    href: '/hub/resources/y1-anatomy-physiology',
  },
  {
    id: '23',
    title: 'Y1 Documentation & Record Keeping',
    description: 'How to write clear, accurate nursing documentation. NMC standards explained.',
    tags: ['Y1 Essentials', 'Placement'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-documentation',
  },
  {
    id: '24',
    title: 'Y1 Infection Control Essentials',
    description: 'Hand hygiene, PPE, aseptic technique and infection prevention basics. Quiz included!',
    tags: ['Y1 Essentials', 'Placement', 'OSCE'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-infection-control',
  },
  {
    id: '25',
    title: 'Y1 Professionalism & Ethics',
    description: 'NMC Code, professional boundaries, and ethical principles for nursing students.',
    tags: ['Y1 Essentials', 'Ethics'],
    difficulty: 'Moderate',
    isLocked: false,
    href: '/hub/resources/y1-professionalism-ethics',
  },
  {
    id: '26',
    title: 'Theories of Development',
    description: 'Piaget, Erikson, Bowlby and other key developmental theories for child nursing.',
    tags: ['Paeds', 'Y1 Essentials'],
    difficulty: 'Moderate',
    isLocked: false,
    href: '/hub/resources/theories-of-development',
  },
  {
    id: '27',
    title: 'Nursing Glossary',
    description: 'Searchable glossary of 100+ nursing terms, abbreviations and definitions.',
    tags: ['Y1 Essentials', 'Revision Plans'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/glossary',
  },
];

// Filter tags
const filterTags = [
  'Y1 Essentials',
  'OSCE',
  'Paeds',
  'Adult Nursing',
  'Mental Health',
  'Meds & Calculations',
  'Placement',
  'Revision Plans',
  'Emergency/ABCDE',
  'Deep Dive', // Added filter for Deep Dive difficulty
] as const;

const difficultyStyles: Record<HubItem['difficulty'], string> = {
  'Quick Win': 'bg-[var(--linen-light)] text-[var(--espresso)] border-[var(--linen-deep)]',
  Moderate: 'bg-[var(--linen-light)] text-[var(--charcoal)] border-[var(--linen-deep)]',
  'Deep Dive': 'bg-[var(--linen-deep)] text-[var(--espresso)] border-[var(--linen-medium)]',
};

const difficultyIcons: Record<HubItem['difficulty'], React.ComponentType<{ className?: string }>> = {
  'Quick Win': Zap,
  Moderate: BookOpen,
  'Deep Dive': Heart,
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
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-[var(--linen-deep)] flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-[var(--espresso)]" />
          </div>
          <span className="text-xs font-semibold text-[var(--espresso)] bg-[var(--linen-light)] px-3 py-1 rounded-full">
            Upgrade to access
          </span>
        </div>
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            item.isLocked
              ? 'bg-[var(--linen-light)] text-[var(--espresso)]'
              : 'bg-emerald-50 text-emerald-700'
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
            className="text-xs bg-[var(--linen-light)] text-[var(--plum-dark)]/70 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div
        style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '13px', fontWeight: 400, borderRadius: '8px', letterSpacing: '0.01em' }}
        className={`
          w-full py-2 text-center transition-all
          ${canAccess ? 'bg-[var(--espresso)] text-[var(--cream)] hover:bg-[var(--charcoal)]' : 'bg-[var(--linen-deep)] text-[var(--espresso)] border border-[var(--linen-medium)]'}
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
  useScrollAnimation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = new Set(prev);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return newTags;
    });
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    // Filter out recommended items for the main grid (they show separately)
    return hubItems.filter((item) => {
      // Exclude recommended items when showing all
      if (searchQuery === '' && selectedTags.size === 0 && item.isRecommended) {
        return false;
      }
      
      // Search filter
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q));
      
      // Tag filter - if no tags selected, show all
      if (selectedTags.size === 0) {
        return matchesSearch;
      }
      
      // Check if item matches any selected tag OR matches Deep Dive difficulty
      const matchesTags = item.tags.some((tag) => selectedTags.has(tag));
      const matchesDeepDive = selectedTags.has('Deep Dive') && item.difficulty === 'Deep Dive';
      
      return matchesSearch && (matchesTags || matchesDeepDive);
    });
  }, [searchQuery, selectedTags]);

  // Get recommended items for the featured section
  const recommendedItems = useMemo(() => {
    return hubItems.filter((item) => item.isRecommended);
  }, []);

  // Only show recommended section when no filters active
  const showRecommended = searchQuery === '' && selectedTags.size === 0;

  const freeCount = filteredItems.filter((item) => !item.isLocked).length;
  const premiumCount = filteredItems.filter((item) => item.isLocked).length;
  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream">
        <Navbar />

        {/* Hero */}
        <section className="bg-cream pt-28 pb-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-3">
              <Link href="/hub" className="text-xs text-[var(--charcoal-light)] hover:text-[var(--espresso)] transition-colors">
                Hub
              </Link>
              <span className="text-[var(--charcoal-light)] text-xs">/</span>
              <span className="text-xs text-[var(--espresso)] font-medium">Children&apos;s Nursing</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display text-[var(--espresso)] mb-3">
              Children&apos;s Nursing Hub
            </h1>
            <p className="text-[var(--charcoal)] mb-6 max-w-xl">
              OSCE guides, cheat sheets, and revision resources for paediatric nursing students.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#resources"
                className="btn-secondary btn-hover text-sm px-6 py-2.5 inline-flex items-center justify-center gap-2"
              >
                <ArrowDown className="w-4 h-4" />
                Browse resources
              </a>
              <Link
                href="/pricing"
                className="btn-primary btn-hover text-sm px-6 py-2.5 inline-flex items-center justify-center gap-2"
              >
                Unlock everything
              </Link>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section id="resources" className="bg-cream py-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="animate-on-scroll relative max-w-md mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--charcoal-light)]" />
              <input
                type="text"
                placeholder="Search resources…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '14px', borderRadius: '8px' }}
                className="w-full pl-11 pr-4 py-2.5 border border-[var(--linen-deep)] bg-white focus:outline-none focus:border-[var(--espresso)]/40 text-[var(--espresso)]"
              />
            </div>

            <div className="animate-on-scroll flex flex-wrap justify-center gap-2 mb-6">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '12px', letterSpacing: '0.01em', borderRadius: '99px', fontWeight: 400 }}
                  className={`px-3 py-1.5 border transition-all ${
                    selectedTags.has(tag)
                      ? 'bg-[var(--espresso)] text-[var(--cream)] border-[var(--espresso)]'
                      : 'bg-white text-[var(--charcoal)] border-[var(--linen-deep)] hover:border-[var(--charcoal-light)]'
                  }`}
                  type="button"
                >
                  {tag}
                </button>
              ))}

              {selectedTags.size > 0 && (
                <button
                  onClick={() => setSelectedTags(new Set())}
                  style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '12px', background: 'transparent', border: 'none' }}
                  className="px-3 py-1.5 text-[var(--espresso)] hover:underline underline-offset-2"
                  type="button"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="animate-on-scroll flex justify-center gap-6 text-sm text-[var(--plum-dark)]/60 mb-8">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                FREE ({freeCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[var(--espresso)]" />
                PREMIUM ({premiumCount})
              </span>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="bg-cream pb-16">
          <div className="max-w-6xl mx-auto px-6">
            {/* Lauren Recommends Section */}
            {showRecommended && (
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#aaa', marginBottom: '4px', fontWeight: 400 }}>Start here</p>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: 500, color: 'var(--espresso)' }}>Lauren Recommends</h2>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedItems.map((item, i) => (
                    <div
                      key={item.id}
                      className="animate-on-scroll fade-in-up relative"
                      style={{ animationDelay: i * 0.06 + 's' }}
                    >
                      {/* Recommended badge */}
                      <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontWeight: 500, borderRadius: '99px' }} className="absolute -top-2 -right-2 z-20 bg-[var(--espresso)] text-[var(--cream)] px-2.5 py-1">
                        Recommended
                      </div>
                      <HubCard item={item} isPro={isPro} isSignedIn={isSignedIn} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section divider */}
            {showRecommended && filteredItems.length > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-[var(--linen-deep)]" />
                <span className="text-sm font-medium text-[var(--plum-dark)]/50">All Resources</span>
                <div className="flex-1 h-px bg-[var(--linen-deep)]" />
              </div>
            )}

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--plum-dark)]/60">No resources match your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags(new Set());
                  }}
                  className="mt-4 text-[var(--espresso)] font-medium hover:underline"
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

        {/* Q&A Board Section */}
        <section className="bg-[var(--linen-light)] py-10 border-y border-[var(--linen-deep)]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-[var(--linen-deep)] flex items-center justify-center">
                  <HelpCircle className="w-7 h-7 text-[var(--espresso)]" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold text-[var(--espresso)] mb-1">Q&amp;A Board</h3>
                <p className="text-sm text-[var(--charcoal)]">
                  Got a nursing question? Browse questions from other students or post your own.
                </p>
              </div>
              <Link
                href="/hub/questions"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400, fontSize: '13px', borderRadius: '8px' }}
                className="inline-flex items-center gap-2 bg-[var(--espresso)] text-[var(--cream)] px-5 py-2.5 hover:bg-[var(--charcoal)] transition-all flex-shrink-0"
              >
                Browse Q&amp;A
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Premium Upsell */}
        {!isPro && (
          <section className="py-14">
            <div className="max-w-3xl mx-auto px-6">
              <div className="bg-[var(--espresso)] rounded-2xl p-8 md:p-10 text-center">
                <div className="text-3xl mb-4">✨</div>
                <h2 className="text-2xl font-display text-white mb-3">Unlock the full library</h2>
                <p className="text-white/70 mb-7 max-w-md mx-auto text-sm">
                  Access every resource, OSCE station packs, quiz topics, and progress tracking. One payment, lifetime access.
                </p>
                <Link
                  href="/pricing"
                  style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 400, fontSize: '14px', borderRadius: '8px' }}
                  className="inline-flex items-center gap-2 bg-white text-[var(--espresso)] px-7 py-3 hover:bg-[var(--linen-light)] transition-all"
                >
                  See pricing — from £9.99
                </Link>
                <p className="text-white/50 text-xs mt-4">
                  7-day money-back guarantee
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Need Help */}
        <section className="bg-[var(--linen-light)] border-t border-[var(--linen-deep)] py-10">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <p className="text-sm text-[var(--charcoal)] mb-2">Got a question or spotted something that needs updating?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-[var(--espresso)] underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              Get in touch
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[var(--linen-light)] border-t border-[var(--linen-deep)] px-6 py-8 text-center text-[var(--charcoal-light)] text-sm">
          <p>Made by Lauren — children&apos;s nursing student</p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/privacy" className="hover:text-[var(--espresso)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--espresso)] transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-[var(--espresso)] transition-colors">About</Link>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
