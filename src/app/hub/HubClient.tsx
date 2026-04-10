'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/Toast';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { Search, MessageCircle } from 'lucide-react';
import type { HubBranch, QuestionPreview } from './hubTypes';
import {
  hubItems, adultHubItems,
  filterTags, adultFilterTags,
  pathways, adultPathways,
  suggestedQuestionPrompts,
  sortHubItemsAlphabetically,
} from './hubData';
import { CSS } from './hubStyles';
import HubCard from './HubCard';

export default function HubClient({
  branch = 'childrens',
  isPro = false,
  isSignedIn = false,
}: {
  branch?: HubBranch;
  isPro?: boolean;
  isSignedIn?: boolean;
}) {
  useScrollAnimation();

  const branchMeta =
    branch === 'adult'
      ? {
          kicker: 'The Nurse Lab \u00B7 Adult Nursing',
          breadcrumbLabel: 'Adult Nursing',
          title: 'Adult nursing resources',
          standfirst: 'Revision resources, escalation guides, placement support, and practical pages written for adult branch student nurses.',
          questionTitle: 'Stuck on what to open first, or which adult page will help most?',
          questionDescription:
            'Ask about deterioration basics, care planning, communication, placement worries, or where to start in the adult branch.',
        }
      : {
          kicker: "The Nurse Lab \u00B7 Children's Nursing",
          breadcrumbLabel: "Children's Nursing",
          title: "Children's nursing resources",
          standfirst: 'OSCE guides, paediatric cheat sheets, placement support, and revision pages written for children\'s branch student nurses.',
          questionTitle: 'Stuck on what to open first, or what something actually means?',
          questionDescription:
            'Ask about OSCE phrasing, drug calculations, placement worries, or which page in the hub will help fastest.',
        };

  const branchHubItems = branch === 'adult' ? adultHubItems : hubItems;
  const branchFilterTags = branch === 'adult' ? adultFilterTags : filterTags;
  const branchPathways = branch === 'adult' ? adultPathways : pathways;
  const branchFreeCount = branchHubItems.filter((item) => !item.isLocked).length;
  const branchPremiumCount = branchHubItems.filter((item) => item.isLocked).length;
  const branchBriefing =
    branch === 'adult'
      ? {
          label: 'Live now',
          title: 'Adult hub pages',
          primaryHref: '/hub/resources/palliative-care-adult',
          primaryLabel: 'Open an adult guide',
          secondaryHref: '/pricing',
          secondaryLabel: 'See current paid tools',
          stats: [
            { label: 'Resources', value: String(branchHubItems.length) },
            { label: 'Free to open', value: String(branchFreeCount) },
            { label: 'Premium guides', value: String(branchPremiumCount) },
          ],
        }
      : {
          label: 'Live now',
          title: "Children's hub pages",
          primaryHref: '/osce',
          primaryLabel: 'Try OSCE preview',
          secondaryHref: '/pricing',
          secondaryLabel: 'See children\'s bundle',
          stats: [
            { label: 'Resources', value: String(branchHubItems.length) },
            { label: 'Free to open', value: String(branchFreeCount) },
            { label: 'Premium guides', value: String(branchPremiumCount) },
          ],
        };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [activePathwayId, setActivePathwayId] = useState<string | null>(null);
  const [showFullShelf, setShowFullShelf] = useState(false);
  const [questionPreviews, setQuestionPreviews] = useState<QuestionPreview[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionCounts, setQuestionCounts] = useState({ answered: 0, open: 0 });

  useEffect(() => {
    let cancelled = false;
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) throw new Error('Failed to load questions');
        const data = await response.json();
        if (cancelled) return;
        const questions: QuestionPreview[] = data.questions || [];
        setQuestionPreviews(questions.slice(0, 3));
        setQuestionCounts({
          answered: questions.filter((q) => q.is_answered).length,
          open: questions.filter((q) => !q.is_answered).length,
        });
      } catch {
        if (!cancelled) {
          setQuestionPreviews([]);
          setQuestionCounts({ answered: 0, open: 0 });
        }
      } finally {
        if (!cancelled) setQuestionsLoading(false);
      }
    };
    void loadQuestions();
    return () => { cancelled = true; };
  }, []);

  const activePathway = useMemo(
    () => branchPathways.find((p) => p.id === activePathwayId) ?? null,
    [activePathwayId, branchPathways],
  );

  const toggleTag = (tag: string) => {
    setActivePathwayId(null);
    setShowFullShelf(true);
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const activePathwayItems = activePathway ? new Set(activePathway.itemIds) : null;
    const visible = branchHubItems.filter((item) => {
      if (searchQuery === '' && selectedTags.size === 0 && !activePathway && item.isRecommended) return false;
      if (activePathwayItems && !activePathwayItems.has(item.id)) return false;
      const matchesSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q));
      if (selectedTags.size === 0) return matchesSearch;
      const matchesTags = item.tags.some((tag) => selectedTags.has(tag));
      const matchesDeepDive = selectedTags.has('Deep Dive') && item.difficulty === 'Deep Dive';
      return matchesSearch && (matchesTags || matchesDeepDive);
    });
    return sortHubItemsAlphabetically(visible);
  }, [activePathway, branchHubItems, searchQuery, selectedTags]);

  const recommendedItems = useMemo(
    () => sortHubItemsAlphabetically(branchHubItems.filter((item) => item.isRecommended)),
    [branchHubItems],
  );

  const showRecommended = searchQuery === '' && selectedTags.size === 0 && !activePathway;
  const shouldShowFullShelf = !showRecommended || showFullShelf;

  const totalCount = branchHubItems.length;
  const defaultShelfCount = branchHubItems.filter((item) => !item.isRecommended).length;
  const defaultShelfFreeCount = branchHubItems.filter((item) => !item.isRecommended && !item.isLocked).length;
  const defaultShelfPremiumCount = branchHubItems.filter((item) => !item.isRecommended && item.isLocked).length;
  const freeCount = filteredItems.filter((item) => !item.isLocked).length;
  const premiumCount = filteredItems.filter((item) => item.isLocked).length;
  const totalQuestionCount = questionCounts.answered + questionCounts.open;
  const isFilteringLibrary = Boolean(searchQuery.trim() || selectedTags.size > 0 || activePathway);
  const librarySummary = isFilteringLibrary
    ? `Showing ${filteredItems.length} resources \u00B7 ${freeCount} free \u00B7 ${premiumCount} premium`
    : `Shelf holds ${defaultShelfCount} more resources \u00B7 ${defaultShelfFreeCount} free \u00B7 ${defaultShelfPremiumCount} premium`;

  const handleActivatePathway = (pathwayId: string) => {
    setActivePathwayId(pathwayId);
    setSearchQuery('');
    setSelectedTags(new Set());
    setShowFullShelf(true);
    requestAnimationFrame(() => {
      document.getElementById('hbc-shelf')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const revealFullShelf = () => {
    setShowFullShelf(true);
    requestAnimationFrame(() => {
      document.getElementById('hbc-shelf')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <ToastProvider>
      <div className="hbc-page">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <Navbar />

        <main className="hbc-main">
          {/* Breadcrumb */}
          <nav className="hbc-breadcrumb">
            <Link href="/hub">Hub</Link>
            <span>/</span>
            <span>{branchMeta.breadcrumbLabel}</span>
          </nav>

          {/* Masthead */}
          <p className="hbc-kicker">{branchMeta.kicker}</p>
          <h1 className="hbc-headline">{branchMeta.title}</h1>
          <p className="hbc-standfirst">{branchMeta.standfirst}</p>

          <section className="hbc-briefing">
            <div className="hbc-briefing-copy">
              <span className="hbc-briefing-label">{branchBriefing.label}</span>
              <h2 className="hbc-briefing-title" style={{ marginBottom: 0 }}>{branchBriefing.title}</h2>
              <div className="hbc-briefing-actions" style={{ marginTop: '20px' }}>
                <Link href={branchBriefing.primaryHref} className="hbc-briefing-btn-primary">
                  {branchBriefing.primaryLabel}
                </Link>
                <Link href={branchBriefing.secondaryHref} className="hbc-briefing-btn-secondary">
                  {branchBriefing.secondaryLabel}
                </Link>
              </div>
            </div>

            <div className="hbc-briefing-stats">
              {branchBriefing.stats.map((stat) => (
                <div key={stat.label} className="hbc-briefing-stat">
                  <span className="hbc-briefing-stat-label">{stat.label}</span>
                  <span className="hbc-briefing-stat-value">{stat.value}</span>
                </div>
              ))}
            </div>
          </section>

          <hr className="hbc-divider" />

          {/* Pathways */}
          <span className="hbc-section-label">Study pathways</span>
          <div className="hbc-pathways">
            {branchPathways.map((pathway) => (
              <button
                key={pathway.id}
                type="button"
                className={`hbc-pathway${activePathway?.id === pathway.id ? ' active' : ''}`}
                onClick={() => handleActivatePathway(pathway.id)}
              >
                <span className="hbc-pathway-eyebrow">{pathway.eyebrow}</span>
                <span className="hbc-pathway-title">{pathway.title}</span>
                <span className="hbc-pathway-desc">{pathway.description}</span>
                <span className="hbc-pathway-cta">
                  Open pathway
                  <span className="hbc-pathway-arrow">&rarr;</span>
                </span>
              </button>
            ))}
          </div>

          {/* Library shelf */}
          <div id="hbc-shelf" className="hbc-shelf">
            {activePathway && (
              <div className="hbc-active-banner">
                <div>
                  <span className="hbc-active-banner-eyebrow">Active pathway</span>
                  <span className="hbc-active-banner-title">{activePathway.title}</span>
                  <span className="hbc-active-banner-desc">{activePathway.description}</span>
                </div>
                <button
                  type="button"
                  className="hbc-clear-btn"
                  onClick={() => setActivePathwayId(null)}
                >
                  Clear pathway
                </button>
              </div>
            )}

            <div className="hbc-search-wrap">
              <Search className="hbc-search-icon" />
              <input
                type="text"
                className="hbc-search"
                placeholder="Search by topic, skill, or term from class"
                value={searchQuery}
                onChange={(e) => {
                  setActivePathwayId(null);
                  setShowFullShelf(true);
                  setSearchQuery(e.target.value);
                }}
              />
            </div>

            <span className="hbc-glossary-hint">
              Not sure what a term means yet?{' '}
              <Link href="/hub/glossary">Open the glossary for a plain-English definition</Link>
            </span>

            <div className="hbc-filters">
              {branchFilterTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`hbc-filter-btn${selectedTags.has(tag) ? ' active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.size > 0 && (
                <button
                  type="button"
                  className="hbc-filter-clear"
                  onClick={() => setSelectedTags(new Set())}
                >
                  Clear all
                </button>
              )}
            </div>

            <p className="hbc-summary">{librarySummary}</p>
          </div>

          {/* Recommended / Editor's picks */}
          {showRecommended && (
            <>
              <span className="hbc-section-label">Start here</span>
              <h2 className="hbc-section-heading">Editor&apos;s picks</h2>
              <div className="hbc-resources-grid">
                {recommendedItems.map((item) => (
                  <HubCard key={item.id} item={item} isPro={isPro} isSignedIn={isSignedIn} />
                ))}
              </div>

              {!shouldShowFullShelf && (
                <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '52px' }}>
                  <button type="button" className="hbc-browse-btn" onClick={revealFullShelf}>
                    Browse all {totalCount} resources &rarr;
                  </button>
                </div>
              )}
            </>
          )}

          {/* All resources label */}
          {showRecommended && shouldShowFullShelf && filteredItems.length > 0 && (
            <span className="hbc-section-label" style={{ marginBottom: '20px' }}>All resources</span>
          )}

          {/* Resource grid or empty state */}
          {shouldShowFullShelf && filteredItems.length === 0 ? (
            <div className="hbc-empty">
              <p className="hbc-empty-title">Nothing matches that search just yet.</p>
              <p className="hbc-empty-desc">Try a broader topic or clear the filters to return to the full shelf.</p>
              <button
                type="button"
                className="hbc-empty-clear"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags(new Set());
                  setShowFullShelf(false);
                }}
              >
                Clear filters
              </button>
            </div>
          ) : shouldShowFullShelf ? (
            <div className="hbc-resources-grid">
              {filteredItems.map((item) => (
                <HubCard key={item.id} item={item} isPro={isPro} isSignedIn={isSignedIn} />
              ))}
            </div>
          ) : null}

          {/* Questions */}
          <div className="hbc-questions">
            <div className="hbc-q-header">
              <div className="hbc-q-meta">
                <span className="hbc-q-kicker">Student questions</span>
                <h2 className="hbc-q-title">{branchMeta.questionTitle}</h2>
                <p className="hbc-q-desc">{branchMeta.questionDescription}</p>
              </div>
              <div className="hbc-q-actions">
                <Link href="/hub/questions" className="hbc-q-btn-primary">
                  Browse questions
                </Link>
                <Link href="/hub/questions?ask=1" className="hbc-q-btn-secondary">
                  Ask a question
                </Link>
              </div>
            </div>

            <div className="hbc-q-body">
              <div className="hbc-q-list" style={{ borderRight: 'none' }}>
                {!questionsLoading && questionPreviews.length > 0
                  ? questionPreviews.slice(0, 3).map((question) => (
                      <Link
                        key={question.id}
                        href={`/hub/questions/${question.id}`}
                        className="hbc-q-item"
                      >
                        <span className={`hbc-q-item-status ${question.is_answered ? 'answered' : 'open'}`}>
                          {question.is_answered ? 'Answered' : 'Open'}
                        </span>
                        <p className="hbc-q-item-title">{question.title}</p>
                      </Link>
                    ))
                  : suggestedQuestionPrompts.map((prompt) => (
                      <article key={prompt.title} className="hbc-prompt-item">
                        <p className="hbc-prompt-title">{prompt.title}</p>
                        <p className="hbc-prompt-desc">{prompt.description}</p>
                        <div className="hbc-prompt-tags">
                          {prompt.tags.map((tag) => (
                            <span key={tag} className="hbc-prompt-tag">{tag}</span>
                          ))}
                        </div>
                      </article>
                    ))}
              </div>
            </div>
          </div>

          {/* Upsell */}
          {!isPro && (
            <div style={{
              padding: '24px 32px',
              background: 'linear-gradient(135deg, rgba(250,238,218,0.4) 0%, rgba(245,243,240,0.6) 100%)',
              border: `0.5px solid rgba(0,0,0,0.08)`,
              marginBottom: '52px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ maxWidth: '600px' }}>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '20px', fontWeight: 400, color: '#1A1815', marginBottom: '8px' }}>
                  Unlock the full study setup.
                </h2>
                <p style={{ fontSize: '13px', color: '#5A5750', fontWeight: 300, lineHeight: 1.6, margin: 0 }}>
                  Get every locked resource, OSCE station pack, and quiz topic in one place.
                </p>
              </div>
              <Link href="/pricing" style={{
                fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FAFAF8',
                background: '#1A1815', padding: '10px 20px', textDecoration: 'none', whiteSpace: 'nowrap'
              }}>
                See pricing &rarr;
              </Link>
            </div>
          )}

          {/* Contact */}
          <div className="hbc-contact">
            <p>Got a question or spotted something that needs updating?</p>
            <Link href="/contact">
              <MessageCircle style={{ width: '14px', height: '14px' }} />
              Get in touch
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
}
