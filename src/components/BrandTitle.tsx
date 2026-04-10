'use client';

import { ReactNode } from 'react';

interface BrandTitleProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  animate?: boolean;
}

/**
 * BrandTitle - Unified brand title component with gradient styling
 * Provides consistent styling for all major headings across the site
 * 
 * Features:
 * - Soft pink → purple gradient text
 * - Shrikhand display font
 * - Responsive sizing
 * - Accessibility fallback for forced-colors mode
 * - Optional scroll animation
 */
export default function BrandTitle({ 
  children, 
  as: Tag = 'h1', 
  className = '',
  animate = false 
}: BrandTitleProps) {
  const baseClasses = 'brand-title';
  const animateClass = animate ? 'animate-on-scroll' : '';
  
  return (
    <Tag className={`${baseClasses} ${animateClass} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
