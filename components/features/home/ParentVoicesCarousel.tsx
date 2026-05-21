'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';
import { CARD_SURFACE_CLASSNAME } from '@/components/ui/card';
import { isHtmlContent } from '@/utils/rich-text';
import { clampScrollLeft, scrollSlideIntoView } from './carousel-utils';
import type { ParentVoiceItem } from '@/types';
import { PARENT_VOICES_LOOP_SETS } from './home-constants';

/** Parent testimonials: horizontal scroll + snap; triple DOM loop for infinite wrap; flex-basis % (peek / 3-up). */
export function ParentVoicesCarousel({ items }: { items: ParentVoiceItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const jumpingRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const n = items.length;
  const totalSlides = n * PARENT_VOICES_LOOP_SETS;

  const getFocusedPhysicalIndex = useCallback((): number => {
    const root = scrollerRef.current;
    const slides = slideRefs.current;
    if (!root || totalSlides === 0) return 0;

    const rootRect = root.getBoundingClientRect();
    const viewportCenter = rootRect.left + rootRect.width / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < totalSlides; i++) {
      const el = slides[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const slideCenter = r.left + r.width / 2;
      const d = Math.abs(slideCenter - viewportCenter);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  }, [totalSlides]);

  const updateSelectedFromScroll = useCallback(() => {
    if (n === 0) return;
    const physical = getFocusedPhysicalIndex();
    setSelectedIndex(((physical % n) + n) % n);
  }, [getFocusedPhysicalIndex, n]);

  const jumpLoopIfNeeded = useCallback(() => {
    const root = scrollerRef.current;
    const slides = slideRefs.current;
    if (!root || n <= 1 || jumpingRef.current) return;

    const pi = getFocusedPhysicalIndex();
    let delta = 0;
    const leftEdge = slides[pi];
    const midEdge = slides[pi + n];
    const prevEdge = slides[pi - n];
    if (pi < n && leftEdge && midEdge) {
      delta = midEdge.offsetLeft - leftEdge.offsetLeft;
    } else if (pi >= 2 * n && leftEdge && prevEdge) {
      delta = prevEdge.offsetLeft - leftEdge.offsetLeft;
    }
    if (delta === 0) return;

    jumpingRef.current = true;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    root.scrollLeft = clampScrollLeft(root, root.scrollLeft + delta);
    root.style.scrollBehavior = prevBehavior;
    requestAnimationFrame(() => {
      jumpingRef.current = false;
    });
  }, [getFocusedPhysicalIndex, n]);

  useEffect(() => {
    slideRefs.current = new Array(totalSlides).fill(null);
  }, [totalSlides]);

  /** Only when slide *count* changes — not when `items` is a new array reference (e.g. language) so viewport scroll and carousel position stay stable. */
  useLayoutEffect(() => {
    const root = scrollerRef.current;
    if (!root || n === 0) return;

    const mid = slideRefs.current[n];
    if (!mid) return;

    root.style.scrollBehavior = 'auto';
    scrollSlideIntoView(root, mid, 'center', 'auto');
    root.style.scrollBehavior = '';
    setSelectedIndex(0);
  }, [n]);

  /** When all slides fit (no horizontal overflow), center the row; avoids lopsided peek / clipped edges. */
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || n === 0) return undefined;

    const syncJustify = () => {
      const overflow = root.scrollWidth - root.clientWidth;
      root.style.justifyContent = overflow <= 2 ? 'center' : 'flex-start';
    };

    syncJustify();
    const ro = new ResizeObserver(syncJustify);
    ro.observe(root);
    return () => ro.disconnect();
  }, [n]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root || n === 0) return undefined;

    let scrollIdleTimer: ReturnType<typeof setTimeout> | undefined;

    const finishScroll = () => {
      updateSelectedFromScroll();
      jumpLoopIfNeeded();
    };

    const onScroll = () => {
      if (!jumpingRef.current) updateSelectedFromScroll();
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(finishScroll, 120);
    };
    const onScrollEnd = () => {
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      finishScroll();
    };

    updateSelectedFromScroll();
    root.addEventListener('scroll', onScroll, { passive: true });
    root.addEventListener('scrollend', onScrollEnd);
    window.addEventListener('resize', updateSelectedFromScroll);
    return () => {
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      root.removeEventListener('scroll', onScroll);
      root.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('resize', updateSelectedFromScroll);
    };
  }, [n, updateSelectedFromScroll, jumpLoopIfNeeded]);

  /** Scroll snap fights programmatic `scrollTo` — disable snap briefly when jumping via dots/keyboard. */
  const scrollToPhysical = useCallback(
    (physicalIdx: number) => {
      const root = scrollerRef.current;
      const el = slideRefs.current[physicalIdx];
      if (!root || !el) return;

      const prevSnap = root.style.scrollSnapType;
      root.style.scrollSnapType = 'none';

      scrollSlideIntoView(root, el, 'center', 'smooth');

      const restoreSnap = () => {
        root.style.scrollSnapType = prevSnap || '';
        updateSelectedFromScroll();
        jumpLoopIfNeeded();
      };

      root.addEventListener('scrollend', restoreSnap, { once: true });
      window.setTimeout(restoreSnap, 500);
    },
    [updateSelectedFromScroll, jumpLoopIfNeeded]
  );

  /** Scroll to logical slide via nearest physical copy (shortest path in the loop). */
  const scrollToSlide = useCallback(
    (logicalIdx: number) => {
      if (n === 0) return;
      const i = ((logicalIdx % n) + n) % n;
      const currentPhysical = getFocusedPhysicalIndex();
      const candidates = [i, i + n, i + 2 * n];
      const targetPhysical = candidates.reduce((best, cand) =>
        Math.abs(cand - currentPhysical) < Math.abs(best - currentPhysical) ? cand : best
      );
      requestAnimationFrame(() => {
        scrollToPhysical(targetPhysical);
      });
    },
    [n, getFocusedPhysicalIndex, scrollToPhysical]
  );

  const goNext = useCallback(() => {
    if (n <= 1) return;
    scrollToPhysical(getFocusedPhysicalIndex() + 1);
  }, [n, getFocusedPhysicalIndex, scrollToPhysical]);

  const goPrev = useCallback(() => {
    if (n <= 1) return;
    scrollToPhysical(getFocusedPhysicalIndex() - 1);
  }, [n, getFocusedPhysicalIndex, scrollToPhysical]);

  if (n === 0) return null;

  return (
    <>
      <div
        className="mx-auto w-full max-w-full overflow-visible outline-none"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Parent testimonials"
        onKeyDown={(e) => {
          if (n <= 1) return;
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            goNext();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
          }
        }}
      >
        <div
          ref={scrollerRef}
          className="flex w-full min-w-0 snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overflow-y-visible overscroll-x-contain px-2 py-5 scroll-pl-2 scroll-pr-2 [-ms-overflow-style:none] scroll-smooth scrollbar-none sm:gap-5 sm:px-3 sm:scroll-pl-3 sm:scroll-pr-3 sm:py-6 lg:gap-6 lg:px-3 lg:scroll-pl-3 lg:scroll-pr-3 lg:py-6 [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {Array.from({ length: PARENT_VOICES_LOOP_SETS }, (_, set) =>
            items.map((item, index) => {
              const physicalIndex = set * n + index;
              return (
                <div
                  key={`pv-${set}-${index}`}
                  ref={(el) => {
                    slideRefs.current[physicalIndex] = el;
                  }}
                  className="flex min-h-0 shrink-0 grow-0 snap-center flex-col overflow-visible basis-[85%] py-1 md:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
                  aria-hidden={set !== 1}
                >
                  <article
                    className={`relative flex min-h-220px flex-1 flex-col p-6 ${CARD_SURFACE_CLASSNAME}`}
                  >
                    <Quote className="mb-4 h-8 w-8 shrink-0 text-primary/35" aria-hidden />
                    {isHtmlContent(item.quote) ? (
                      <div
                        className="rich-text-preview flex-1 text-sm leading-relaxed text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: item.quote }}
                      />
                    ) : (
                      <p className="flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                        {item.quote}
                      </p>
                    )}
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/50 pt-4">
                      <p className="text-sm font-semibold text-foreground">{item.attribution}</p>
                    </div>
                  </article>
                </div>
              );
            })
          ).flat()}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2 px-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`h-2.5 w-2.5 rounded-full transition-colors ${idx === selectedIndex
              ? 'bg-primary'
              : 'bg-muted-foreground/30'
              }`}
            aria-label={`Slide ${idx + 1}`}
            aria-current={idx === selectedIndex ? true : undefined}
            onClick={(e) => {
              e.preventDefault();
              scrollToSlide(idx);
            }}
          />
        ))}
      </div>
    </>
  );
}
