'use client';

import { Children, ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DashboardCarouselProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function DashboardCarousel({
  eyebrow,
  title,
  description,
  children,
}: DashboardCarouselProps) {
  const items = Children.toArray(children);
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const updateScrollState = () => {
      const maxScroll = node.scrollWidth - node.clientWidth - 4;
      setCanScrollLeft(node.scrollLeft > 4);
      setCanScrollRight(node.scrollLeft < maxScroll);
    };

    updateScrollState();
    node.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      node.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [items.length]);

  function scroll(direction: 'left' | 'right') {
    const node = scrollRef.current;
    if (!node) return;

    node.scrollBy({
      left: direction === 'left' ? -Math.max(node.clientWidth * 0.82, 280) : Math.max(node.clientWidth * 0.82, 280),
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }

  return (
    <section>
      <div className="flex flex-col gap-4 border-t border-[rgba(26,24,21,0.08)] pt-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--charcoal)]/48">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] leading-[1.04] tracking-[-0.02em] text-[var(--espresso)]">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-[56ch] text-sm leading-7 text-[var(--charcoal)]/72">
              {description}
            </p>
          ) : null}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="inline-flex h-10 w-10 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white text-[var(--espresso)] transition hover:border-[rgba(26,24,21,0.16)] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={`Scroll ${title} left`}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="inline-flex h-10 w-10 items-center justify-center border border-[rgba(26,24,21,0.08)] bg-white text-[var(--espresso)] transition hover:border-[rgba(26,24,21,0.16)] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={`Scroll ${title} right`}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.32, delay: index * 0.04, ease: 'easeOut' }}
            className="min-w-[86%] snap-start sm:min-w-[410px] lg:min-w-[360px]"
          >
            {item}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
