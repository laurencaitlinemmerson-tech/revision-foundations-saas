'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DashboardCarouselProps<T extends { id: string }> {
  eyebrow?: string;
  title: string;
  description?: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
  itemClassName?: string;
}

export default function DashboardCarousel<T extends { id: string }>({
  eyebrow,
  title,
  description,
  items,
  renderItem,
  itemClassName = 'min-w-[82%] sm:min-w-[420px] lg:min-w-[360px]',
}: DashboardCarouselProps<T>) {
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const updateScrollState = () => {
      const maxScrollLeft = node.scrollWidth - node.clientWidth - 4;
      setCanScrollLeft(node.scrollLeft > 4);
      setCanScrollRight(node.scrollLeft < maxScrollLeft);
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

    const amount = Math.max(node.clientWidth * 0.88, 280);
    node.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--charcoal)]/52">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-[clamp(2rem,3vw,2.8rem)] leading-[0.98] tracking-[-0.03em] text-[var(--espresso)]">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-[54ch] text-sm leading-7 text-[var(--charcoal)]/74">
              {description}
            </p>
          ) : null}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/75 text-[var(--espresso)] transition hover:border-black/20 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={`Scroll ${title} left`}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/75 text-[var(--espresso)] transition hover:border-black/20 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
            aria-label={`Scroll ${title} right`}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label={title}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.05, ease: 'easeOut' }}
            className={`snap-start ${itemClassName} shrink-0`}
          >
            {renderItem(item)}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
