'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ToastProvider, useToast } from '@/components/Toast';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import {
  Search,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Stethoscope,
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
  // Y1 Child Nursing Resources
  {
    id: '12',
    title: 'Y1 Growth & Development Milestones',
    description: 'Key developmental milestones from birth to 5 years with red flags to spot.',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-growth-milestones',
  },
  {
    id: '13',
    title: 'Y1 Paediatric Vital Signs by Age',
    description: 'Normal vital sign ranges for children from newborn to adolescent with quick reference chart.',
    tags: ['Paeds', 'Y1 Essentials', 'Assessment'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-paeds-vital-signs',
  },
  {
    id: '14',
    title: 'Y1 Family-Centred Care Principles',
    description: 'Understanding family-centred care in paediatrics and how to apply it on placement.',
    tags: ['Paeds', 'Y1 Essentials', 'Placement'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-family-centred-care',
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
    id: '19',
    title: 'Y1 Immunisation Schedule UK',
    description: 'Complete UK childhood immunisation schedule with catch-up information.',
    tags: ['Paeds', 'Y1 Essentials', 'Health Promotion'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-immunisation-schedule',
  },
  {
    id: '20',
    title: 'Y1 Play & Distraction Techniques',
    description: 'Age-appropriate play and distraction techniques for procedures and hospital stays.',
    tags: ['Paeds', 'Y1 Essentials', 'Placement'],
    difficulty: 'Quick Win',
    isLocked: false,
    href: '/hub/resources/y1-play-distraction',
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
            item.isLocked
              ? 'bg-[var(--purple)]/10 text-[var(--purple)]'
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
  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream">
        <Navbar />
        {/* ...existing code for all sections, cards, overlays, etc... */}
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

        {/* Smaller Hero */}
        <section className="gradient-hero pt-28 pb-12 relative overflow-hidden">
          <div className="blob blob-1" style={{ opacity: 0.25 }} />
          <div className="blob blob-2" style={{ opacity: 0.25 }} />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="animate-on-scroll hero-badge">
                <Stethoscope className="w-4 h-4 text-[var(--purple)]" />
                <span className="text-[var(--plum)]">Content Library</span>
                <Sparkles className="w-4 h-4 text-[var(--pink)] icon-pulse" />
              </div>

              <h1 className="animate-on-scroll mb-2 hero-title">
                <span className="gradient-text">Nursing Hub</span>
              </h1>

              <p className="animate-on-scroll hero-description !mb-6">
                Find exactly what you need for OSCEs, exams &amp; placement survival.
              </p>

              <div className="animate-on-scroll flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#resources"
                  className="btn-secondary btn-hover text-base px-7 py-3 inline-flex items-center justify-center gap-2"
                >
                  <ArrowDown className="w-5 h-5" />
                  Browse resources
                </a>

                <Link
                  href="/pricing"
                  className="btn-primary btn-hover text-base px-7 py-3 inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Unlock everything
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section id="resources" className="bg-cream py-10">
          <div className="max-w-6xl mx-auto px-6">
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

        {/* Q&A Board Section */}
        <section className="bg-white py-12 border-y border-[var(--lilac-medium)]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--lavender)] to-[var(--pink)] flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-[var(--plum)] mb-2">Q&amp;A Board</h3>
                <p className="text-[var(--plum-dark)]/70">
                  Got a nursing question? Ask the community! Browse questions from other students or post your own.
                </p>
              </div>
              <Link
                href="/hub/questions"
                className="inline-flex items-center gap-2 bg-[var(--purple)] text-white px-6 py-3 rounded-full font-semibold hover:bg-[var(--plum)] transition-all flex-shrink-0"
              >
                Browse Q&amp;A
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Premium Upsell */}
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

        {/* Footer */}
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
