import React from 'react';

export type HubCategory = 'Anatomy & Physiology';

export interface HubItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: 'Quick Win' | 'Moderate' | 'Deep Dive';
  isLocked: boolean;
  href: string;
  isRecommended?: boolean;
  category?: HubCategory;
}

export interface QuestionPreview {
  id: string;
  title: string;
  tags: string[];
  is_answered: boolean;
  created_at: string;
}

export type HubBranch = 'childrens' | 'adult';

export interface HubPathway {
  id: string;
  title: string;
  description: string;
  eyebrow: string;
  itemIds: string[];
  icon: React.ComponentType<{ className?: string }>;
}
