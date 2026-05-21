'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { PhotoLightboxImage } from '@/types';

type PhotoLightboxProps = {
  images: PhotoLightboxImage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startIndex?: number;
  title?: string;
};

const SLIDE_TRANSITION_MS = 320;
const SWIPE_RATIO = 0.18;

export function PhotoLightbox({
  images,
  open,
  onOpenChange,
  startIndex = 0,
  title = 'Photo gallery'
}: PhotoLightboxProps) {
  const count = images.length;
  const hasMultiple = count > 1;

  const extendedImages = useMemo(() => {
    if (!hasMultiple) return images;
    const last = images[count - 1];
    const first = images[0];
    if (!last || !first) return images;
    return [last, ...images, first];
  }, [images, count, hasMultiple]);

  const [slideIndex, setSlideIndex] = useState(hasMultiple ? 1 : 0);
  const [dragPx, setDragPx] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isResettingRef = useRef(false);

  const displayIndex = hasMultiple
    ? (slideIndex - 1 + count) % count
    : 0;

  const resetSlidePosition = useCallback(
    (targetStartIndex: number) => {
      if (!hasMultiple) {
        setSlideIndex(0);
        setDragPx(0);
        return;
      }
      const safe = Math.min(Math.max(0, targetStartIndex), count - 1);
      setTransitionEnabled(false);
      setSlideIndex(safe + 1);
      setDragPx(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionEnabled(true));
      });
    },
    [count, hasMultiple]
  );

  useEffect(() => {
    if (!open || count === 0) return;
    resetSlidePosition(startIndex);
  }, [open, startIndex, count, resetSlidePosition]);

  const goNext = useCallback(() => {
    if (!hasMultiple) return;
    setTransitionEnabled(true);
    setDragPx(0);
    setSlideIndex((i) => i + 1);
  }, [hasMultiple]);

  const goPrev = useCallback(() => {
    if (!hasMultiple) return;
    setTransitionEnabled(true);
    setDragPx(0);
    setSlideIndex((i) => i - 1);
  }, [hasMultiple]);

  const handleTransitionEnd = useCallback(() => {
    if (!hasMultiple || isResettingRef.current) return;

    if (slideIndex === 0) {
      isResettingRef.current = true;
      setTransitionEnabled(false);
      setSlideIndex(count);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
          isResettingRef.current = false;
        });
      });
    } else if (slideIndex === count + 1) {
      isResettingRef.current = true;
      setTransitionEnabled(false);
      setSlideIndex(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
          isResettingRef.current = false;
        });
      });
    }
  }, [slideIndex, count, hasMultiple]);

  useEffect(() => {
    if (!open || !hasMultiple) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, hasMultiple, goPrev, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!hasMultiple) return;
    touchStartX.current = e.touches[0]?.clientX ?? null;
    setTransitionEnabled(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultiple) return;
    const x = e.touches[0]?.clientX;
    if (x === undefined) return;
    setDragPx(x - touchStartX.current);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || !hasMultiple) return;

    const width = viewportRef.current?.clientWidth ?? window.innerWidth;
    const threshold = Math.max(48, width * SWIPE_RATIO);

    if (dragPx > threshold) goPrev();
    else if (dragPx < -threshold) goNext();
    else {
      setTransitionEnabled(true);
      setDragPx(0);
    }

    touchStartX.current = null;
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    setTransitionEnabled(true);
    setDragPx(0);
  };

  if (count === 0) return null;

  const translateX = hasMultiple
    ? `translateX(calc(-${slideIndex * 100}% + ${dragPx}px))`
    : 'translateX(0)';

  const trackTransition =
    transitionEnabled && dragPx === 0
      ? `transform ${SLIDE_TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`
      : 'none';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-199 bg-black/90" />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-200 flex h-dvh w-dvw max-w-none -translate-x-1/2 -translate-y-1/2',
            'flex-col gap-0 border-0 bg-black/95 p-0 shadow-none outline-none',
            'origin-center duration-300',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-90 data-[state=open]:zoom-in-90',
            'data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0',
            'data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0',
            'sm:rounded-none'
          )}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>

          <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            {hasMultiple ? (
              <p className="text-sm tabular-nums text-white/80">
                {displayIndex + 1} / {count}
              </p>
            ) : (
              <span />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-white hover:bg-white/10 hover:text-white"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative flex min-h-0 w-full flex-1 flex-col">
            {hasMultiple && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white md:left-4 md:inline-flex"
                onClick={goPrev}
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            <div
              ref={viewportRef}
              className="relative min-h-0 w-full flex-1 overflow-hidden touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
            >
              <div
                className="flex h-full"
                style={{
                  transform: translateX,
                  transition: trackTransition
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {(hasMultiple ? extendedImages : images).map((image, i) => (
                  <div
                    key={`${image.src}-${i}`}
                    className="flex h-full w-full shrink-0 items-center justify-center px-0 md:px-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt={image.alt ?? ''}
                      className={cn(
                        'h-auto w-full max-h-[min(85dvh,calc(100dvh-5.5rem))] object-contain select-none',
                        'md:h-auto md:w-auto md:max-h-full md:max-w-full'
                      )}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {hasMultiple && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white md:right-4 md:inline-flex"
                onClick={goNext}
                aria-label="Next photo"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
