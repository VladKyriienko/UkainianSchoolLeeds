'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { CARD_SURFACE_CLASSNAME, CARD_SURFACE_STATIC_CLASSNAME } from '@/components/ui/card';
import { useLanguage } from '@/providers/language-provider';
import { HOME_CONTENT } from '@/content/home';
import { ArrowRight, Backpack, CalendarDays, HeartHandshake, Quote, Snowflake, Users } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import type { Language, PublicHomeClientProps } from '@/types';
import { createMessageAction } from '@/app/(not-aunthenticated)/contact/actions';
import { isHtmlContent } from '@/utils/rich-text';
import { cn } from '@/utils/cn';

const heroMainImage = '/hero-home-classroom.png';

/** Icons for the trust row under hero CTAs (order matches content.heroTrust.items). */
const HERO_TRUST_ICON_PATHS = [
  '/home/hero-icon-learning.png',
  '/home/hero-icon-location.png',
  '/home/hero-icon-flag.png'
] as const;

const heroPngIcons = {
  learning: '/home/hero-icon-learning.png',
  location: '/home/hero-icon-location.png',
  book: '/home/hero-icon-book.png',
  teacher: '/home/hero-icon-teacher.png',
  /** Includes UA flag heart — used beside home lead CTA title. */
  community: '/home/hero-icon-community.png',
  creative: '/home/hero-icon-creative.png'
} as const;

const ABOUT_HIGHLIGHT_ICONS = [Backpack, HeartHandshake, Users] as const;

/** Decorative snowflakes — upper-right of the text column only. */
const ABOUT_SNOWFLAKES = [
  { top: '4%', right: '4%', size: 56, rotate: -14 },
  { top: '2%', right: '28%', size: 48, rotate: 12 },
  { top: '16%', right: '8%', size: 52, rotate: -8 },
  { top: '22%', right: '36%', size: 44, rotate: 20 },
  { top: '12%', right: '52%', size: 46, rotate: -18 },
  { top: '28%', right: '20%', size: 50, rotate: 6 },
  { top: '8%', right: '42%', size: 42, rotate: -22 }
] as const;

type ParentVoiceItem = { quote: string; attribution: string };

function clampScrollLeft(root: HTMLDivElement, left: number): number {
  const max = Math.max(0, root.scrollWidth - root.clientWidth);
  return Math.min(max, Math.max(0, left));
}

function scrollSlideIntoView(
  root: HTMLDivElement,
  slide: HTMLElement,
  align: 'center' | 'start',
  behavior: ScrollBehavior = 'smooth'
): void {
  const rootRect = root.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const slideLeftInScroller = slideRect.left - rootRect.left + root.scrollLeft;
  const target =
    align === 'center'
      ? slideLeftInScroller - (root.clientWidth - slideRect.width) / 2
      : slideLeftInScroller;
  root.scrollTo({ left: clampScrollLeft(root, Math.round(target)), behavior });
}

const PARENT_VOICES_LOOP_SETS = 3;

/** Parent testimonials: horizontal scroll + snap; triple DOM loop for infinite wrap; flex-basis % (peek / 3-up). */
function ParentVoicesCarousel({ items }: { items: ParentVoiceItem[] }) {
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

function HeroFloatingChipTitle({
  title,
  heroTitleLines
}: {
  title: string;
  heroTitleLines?: readonly [string, string];
}) {
  return (
    <h3 className="text-base font-semibold leading-snug text-foreground">
      {heroTitleLines ? (
        <>
          <span className="block">{heroTitleLines[0]}</span>
          <span className="block">{heroTitleLines[1]}</span>
        </>
      ) : (
        title
      )}
    </h3>
  );
}

type HomeCtaContent = (typeof HOME_CONTENT)['en']['cta'];

function HomeLeadCtaSection({ cta, language }: { cta: HomeCtaContent; language: Language }) {
  const [form, setForm] = useState({
    parentName: '',
    phone: '',
    email: '',
    childAge: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(null);
    if (
      !form.parentName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.childAge.trim()
    ) {
      setErrorText(cta.fillAllFields);
      return;
    }
    setStatus('submitting');
    try {
      const ageLabel = language === 'uk' ? 'Вік дитини' : "Child's age";
      const sourceLine =
        language === 'uk' ? 'Джерело: головна сторінка сайту.' : 'Source: website home page.';
      const message = [`${ageLabel}: ${form.childAge.trim()}`, '', sourceLine].join('\n');
      await createMessageAction({
        name: form.parentName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: cta.messageSubject,
        message
      });
      setForm({ parentName: '', phone: '', email: '', childAge: '' });
      setStatus('success');
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : cta.errorMessage);
      setStatus('idle');
    }
  };

  return (
    <section className="w-full min-w-0 max-w-full">
      <div className="w-full min-w-0 overflow-visible rounded-4xl bg-primary px-6 py-10 text-primary-foreground shadow-xl shadow-primary/20 md:px-10 md:py-12 lg:px-12 lg:py-14">
        <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-stretch lg:gap-10 xl:gap-14">
          <div className="relative flex min-w-0 shrink-0 flex-col justify-center lg:max-w-xl">
            <h2 className="text-balance font-display text-2xl font-bold leading-tight tracking-tight md:text-4xl">
              <span>{cta.titleBefore}</span>
              <span>{cta.titleHighlight}</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span>{cta.titleAfter}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/home/hero-card-1.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-8 w-8 shrink-0 object-contain md:h-9 md:w-9"
                />
              </span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/88 md:text-base">
              {cta.description}
            </p>
          </div>

          <div className="relative min-h-0 min-w-0 flex-1">
            <form
              id="home-lead-cta-form"
              onSubmit={handleSubmit}
              className="relative w-full"
              noValidate
            >
              <div className="w-full rounded-2xl bg-card p-5 pb-8 text-foreground shadow-md sm:p-6 sm:pb-10">
                {status === 'success' ? (
                  <p className="py-4 text-center text-sm font-medium leading-relaxed text-primary">{cta.successMessage}</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-3">
                      <Input
                        name="parentName"
                        value={form.parentName}
                        onChange={handleChange}
                        placeholder={cta.placeholders.parentName}
                        autoComplete="name"
                        disabled={status === 'submitting'}
                        className="h-11 rounded-lg border-border/80 bg-background"
                        aria-label={cta.placeholders.parentName}
                      />
                      <Input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder={cta.placeholders.phone}
                        autoComplete="tel"
                        disabled={status === 'submitting'}
                        className="h-11 rounded-lg border-border/80 bg-background"
                        aria-label={cta.placeholders.phone}
                      />
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={cta.placeholders.email}
                        autoComplete="email"
                        disabled={status === 'submitting'}
                        className="h-11 rounded-lg border-border/80 bg-background"
                        aria-label={cta.placeholders.email}
                      />
                      <Input
                        name="childAge"
                        value={form.childAge}
                        onChange={handleChange}
                        placeholder={cta.placeholders.childAge}
                        disabled={status === 'submitting'}
                        className="h-11 rounded-lg border-border/80 bg-background"
                        aria-label={cta.placeholders.childAge}
                      />
                    </div>
                    {errorText ? (
                      <p className="mt-3 text-sm text-destructive" role="alert">
                        {errorText}
                      </p>
                    ) : null}
                  </>
                )}
              </div>

              {status !== 'success' ? (
                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="absolute left-1/2 top-full z-10 flex h-14 min-w-[min(100%,17.5rem)] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-3 rounded-full border-0 bg-ukraine-yellow px-5 pl-8 pr-2 text-base font-semibold text-foreground shadow-lg transition-colors hover:bg-[rgb(234,179,8)] disabled:opacity-70"
                >
                  <span>{status === 'submitting' ? cta.submitting : cta.submit}</span>
                  <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                </Button>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Public marketing home page (`/`). Sections use `HOME_CONTENT[language]`; news from `initialNews`; parent voices from `parentVoices`. */
export function PublicHomeClient({
  initialNews,
  atmosphereGalleryImages,
  parentVoices
}: PublicHomeClientProps) {
  const { language } = useLanguage();
  const content = HOME_CONTENT[language];
  const isUk = language === 'uk';

  const parentVoiceCarouselItems = useMemo(() => {
    if (parentVoices.length === 0) return [];
    return parentVoices.map((r) => ({
      quote: isUk && r.content_uk?.trim() ? r.content_uk : r.content,
      attribution: isUk && r.perens_uk?.trim() ? r.perens_uk : r.perens
    }));
  }, [parentVoices, isUk]);

  const atmosphereStripImages =
    atmosphereGalleryImages.length > 0
      ? atmosphereGalleryImages.map((p) => ({
        key: p.id,
        src: p.src,
        alt: isUk && p.altUk ? p.altUk : p.altEn
      }))
      : content.schoolAtmosphere.images.map((p, index) => ({
        key: `static-${p.src}-${index}`,
        src: p.src,
        alt: p.alt
      }));

  useEffect(() => {
    // Supabase invite/OTP links can land on "/" with tokens in hash.
    // Forward to the dedicated callback page that sets the session.
    const hash = window.location.hash;
    if (!hash) return;
    const hasAuthTokens =
      hash.includes('access_token=') && hash.includes('refresh_token=');
    if (!hasAuthTokens) return;

    window.location.replace(`/auth/callback-client?redirectTo=/${hash}`);
  }, []);

  return (
    <div className="flex w-full min-w-0 flex-col pt-8 gap-12 pb-12 text-foreground md:gap-24">
      {/* Section: Hero — mobile: H1+lead → image+chips → trust row → CTAs; lg: two columns, left column H1+lead / CTAs / trust (`content.hero`, `content.heroTrust`, `content.features`). */}
      <section className="relative isolate -mx-4 w-[calc(100%+2rem)] max-w-none overflow-x-hidden rounded-t-[2.25rem] bg-card md:-mx-6 md:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-4 md:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
          {/* Mobile order: copy → photo → trust row → CTAs. Desktop col 1: copy, CTAs, trust; col 2: photo (rows 1–3). */}
          <div className="max-w-2xl lg:col-start-1 lg:row-start-1 lg:self-start">
            <h1 className="font-display font-bold leading-[1.02] tracking-tight text-foreground max-md:text-4xl md:text-h1">
              {content.hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="relative mt-1 inline-block pb-1.5 text-primary">
                {content.hero.titleAccent}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 rounded-full bg-linear-to-r from-brand-yellow/25 via-brand-yellow to-brand-yellow/25"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-px left-0 right-0 h-3px rounded-full bg-brand-yellow/35 blur-[1px]"
                />
              </span>
            </h1>
            <p className="mt-6 max-w-140 text-muted-foreground">{content.hero.subtitle}</p>
          </div>

          <div className="relative pb-6 lg:col-span-1 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:pb-8">
            <div className="relative overflow-hidden rounded-[2.4rem] border border-background/60 shadow-xl shadow-primary/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroMainImage}
                alt={content.hero.subtitle}
                className="aspect-16/10 w-full object-cover"
              />
            </div>
            <div className="absolute left-[55%] translate-x-[-50%] -top-6 z-20 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroPngIcons.teacher} alt="" className="h-12 w-12 object-contain" />
                </span>
                <HeroFloatingChipTitle
                  title={content.features[0]!.title}
                  heroTitleLines={content.features[0]!.heroTitleLines!}
                />
              </div>
            </div>
            <div className="absolute bottom-20 left-0 z-20 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-lg backdrop-blur md:-left-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroPngIcons.community} alt="" className="h-12 w-12 object-contain" />
                </span>
                <HeroFloatingChipTitle
                  title={content.features[1]!.title}
                  heroTitleLines={content.features[1]!.heroTitleLines!}
                />
              </div>
            </div>
            <div className="absolute -bottom-3 right-4 z-20 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={heroPngIcons.creative} alt="" className="h-12 w-12 object-contain" />
                </span>
                <HeroFloatingChipTitle
                  title={content.features[2]!.title}
                  heroTitleLines={content.features[2]!.heroTitleLines!}
                />
              </div>
            </div>
          </div>

          <div className="flex w-fit max-w-full flex-col gap-5 self-start sm:flex-row sm:flex-nowrap sm:items-center sm:gap-6 lg:col-start-1 lg:row-start-3 lg:gap-10 lg:self-start">
            {content.heroTrust.items.map((item, index) => (
              <div key={`${item.line1}-${index}`} className="flex shrink-0 items-center gap-3 text-left">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary ring-1 ring-primary/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={HERO_TRUST_ICON_PATHS[index] ?? HERO_TRUST_ICON_PATHS[0]}
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug text-foreground">{item.line1}</p>
                  <p className="mt-0.5 text-sm font-semibold leading-snug text-muted-foreground">
                    {item.line2}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-start-1 lg:row-start-2">
            <Button
              size="lg"
              asChild
              className="h-12 rounded-full bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/10 transition-colors duration-150 ease-in-out hover:bg-[rgb(29,78,216)]"
            >
              <Link href="/about/whos-who" className="gap-2">
                {content.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 rounded-full border border-border bg-card px-8 text-foreground transition-colors duration-150 ease-in-out hover:bg-secondary"
            >
              <Link href="/parents/calendar" className="gap-2">
                {content.hero.secondaryCta}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section: Why choose us — icon + heading, four value cards (`content.whyChooseUs`). Anchor: #why-choose-us. */}
      <section
        id="why-choose-us"
        aria-labelledby="why-choose-us-heading"
        className="-mx-4 w-[calc(100%+2rem)] max-w-none scroll-mt-24 md:-mx-6 md:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]"
      >
        <div className="flex flex-col items-center px-4 text-center md:px-6 lg:px-8">
          <div className="relative mb-4 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home/hero-card-1.png"
              alt=""
              width={48}
              height={48}
              className="relative z-10 h-10 w-10 object-contain"
            />
            <span
              aria-hidden
              className="absolute bottom-0 left-1/2 h-1 w-24 -translate-x-1/2 rounded-[999px] bg-linear-to-r from-brand-yellow/10 via-brand-yellow to-brand-yellow/10"
            />
            <span
              aria-hidden
              className="absolute bottom-[-2px] left-1/2 h-[3px] w-20 -translate-x-1/2 rounded-[999px] bg-brand-yellow/35 blur-[1px]"
            />
          </div>
          <h2
            id="why-choose-us-heading"
            className="mx-auto max-w-3xl text-center font-display text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl"
          >
            {content.whyChooseUs.heading}
          </h2>
        </div>

        <div className="mt-8 grid w-full grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-5 md:px-6 lg:grid-cols-4 lg:gap-6 lg:px-8">
          {content.whyChooseUs.cards.map((card, index) => (
            <article
              key={`${card.title}-${index}`}
              className={`flex h-full flex-col items-center overflow-hidden text-center ${CARD_SURFACE_CLASSNAME}`}
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden sm:h-16">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-8">
                <h3 className="font-bold leading-snug text-foreground">{card.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section: Programs — mobile: horizontal snap + vertical padding for hover shadow; md+: grid + overflow visible (same idea as school atmosphere strip). Anchor: #programs. */}
      <section
        id="programs"
        aria-labelledby="programs-heading"
        className="scroll-mt-24"
      >
        <div className="text-center">
          <h2
            id="programs-heading"
            className="font-display text-balance text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl"
          >
            <span>{content.programs.headingBefore}</span>
            <span className="relative inline-block">
              {content.programs.headingHighlight}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-1/2 h-1 w-[90%] max-w-48 -translate-x-1/2 rounded-full bg-linear-to-r from-brand-yellow/25 via-brand-yellow to-brand-yellow/25"
              />
            </span>
          </h2>
        </div>

        <div className="mt-8 flex w-full min-w-0 max-w-full snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overflow-y-visible py-10 [-ms-overflow-style:none] scroll-smooth scrollbar-none md:grid md:grid-cols-4 md:gap-4 md:overflow-x-visible md:py-0 [&::-webkit-scrollbar]:hidden">
          {content.programs.cards.map((card, index) => (
            <div
              key={`program-card-${index}`}
              className="flex w-[min(85vw,280px)] shrink-0 snap-start flex-col sm:w-[280px] md:w-auto md:min-w-0"
            >
              <article
                className={cn(
                  'flex min-h-0 w-full flex-1 flex-col text-left',
                  CARD_SURFACE_CLASSNAME
                )}
              >
                <div className="relative aspect-4/2 w-full shrink-0 overflow-hidden rounded-t-2xl bg-muted/30">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 85vw, 320px"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 rounded-b-2xl bg-card px-5 pb-5 pt-4">
                  <div className="min-w-0 shrink-0">
                    <h3 className="text-pretty font-bold leading-snug text-foreground">{card.title}</h3>
                    <p className="mt-1 text-sm font-medium text-primary">{card.subtitle}</p>
                  </div>
                  <p className="min-h-0 min-w-0 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                  <Link
                    href={card.href ?? '/parents/class-pages'}
                    className="mt-auto inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    {content.programs.learnMore}
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* Section: About the school — viewport full-bleed split layout (breaks out of `container` padding). */}
      <section
        aria-labelledby="about-school-heading"
        className="relative left-1/2 w-dvw max-w-none -translate-x-1/2 scroll-mt-24"
      >
        <div className="w-full overflow-hidden rounded-none bg-card lg:grid lg:min-h-[min(28rem,65vh)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
          <div className="relative aspect-5/4 min-h-[220px] lg:aspect-auto lg:min-h-[min(28rem,65vh)]">
            <Image
              src={content.about.imageSrc}
              alt={content.about.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background/50 to-transparent lg:hidden"
            />
            <div
              aria-hidden
              className="absolute -inset-y-1 -left-1 hidden w-[min(38%,22rem)] bg-linear-to-r from-card from-0% via-card/92 via-35% to-transparent lg:block"
            />
            <div
              aria-hidden
              className="absolute -inset-y-1 -right-1 hidden w-[min(38%,22rem)] bg-linear-to-l from-card from-0% via-card/92 via-35% to-transparent lg:block"
            />
          </div>

          <div className="relative flex flex-col justify-center bg-card px-6 pt-10 lg:px-10 lg:py-12 xl:px-12">
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 right-0 h-[min(38%,13rem)] min-h-44 w-[min(92%,26rem)] overflow-hidden max-lg:max-h-48"
            >
              {ABOUT_SNOWFLAKES.map((flake, index) => (
                <Snowflake
                  key={index}
                  className="absolute text-primary/25"
                  strokeWidth={1.45}
                  aria-hidden
                  style={{
                    top: flake.top,
                    right: flake.right,
                    width: flake.size,
                    height: flake.size,
                    transform: `rotate(${flake.rotate}deg)`
                  }}
                />
              ))}
            </div>

            <p className="relative text-sm font-semibold tracking-wide text-primary">
              <span className="relative inline-block">
                {content.about.eyebrow}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1 left-1/2 h-1 w-[90%] max-w-48 -translate-x-1/2 rounded-full bg-linear-to-r from-brand-yellow/25 via-brand-yellow to-brand-yellow/25"
                />
              </span>
            </p>
            <h2
              id="about-school-heading"
              className="relative mt-5 max-w-xl font-display text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl"
            >
              {content.about.title}
            </h2>
            <p className="relative mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.about.description}
            </p>

            <ul className="relative mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3 lg:grid-cols-3 lg:gap-2 [&>li:last-child]:sm:col-span-2 [&>li:last-child]:sm:flex [&>li:last-child]:sm:justify-center lg:[&>li:last-child]:col-span-1 lg:[&>li:last-child]:justify-start">
              {content.about.highlights.map((label, index) => {
                const Icon = ABOUT_HIGHLIGHT_ICONS[index] ?? Users;
                return (
                  <li
                    key={label}
                    className="flex min-w-0 flex-row items-center gap-2 text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 text-pretty text-sm font-medium leading-snug text-foreground">
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <Button
              size="lg"
              className="relative mt-9 h-12 w-fit rounded-full px-8"
              asChild
            >
              <Link href="/about/welcome" className="gap-2">
                {content.about.cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section: School atmosphere — gallery heading, CTA link, responsive image strip (`content.schoolAtmosphere`). Anchor: #school-atmosphere. */}
      <section
        id="school-atmosphere"
        aria-labelledby="school-atmosphere-heading"
        className="scroll-mt-24"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="school-atmosphere-heading"
            className="font-display text-balance text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl"
          >
            {content.schoolAtmosphere.heading}
          </h2>
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-fit shrink-0 rounded-full border-primary/35 px-6 text-primary transition-colors hover:bg-primary/5"
            asChild
          >
            <Link href={content.schoolAtmosphere.ctaHref} className="gap-2">
              {content.schoolAtmosphere.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="mt-8 flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible pb-2 [-ms-overflow-style:none] scroll-smooth scrollbar-none md:grid md:grid-cols-4 md:gap-4 md:overflow-x-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {atmosphereStripImages.map((photo) => (
            <div
              key={photo.key}
              className={`relative aspect-video w-[min(85vw,280px)] shrink-0 snap-start overflow-hidden md:w-auto ${CARD_SURFACE_STATIC_CLASSNAME}`}
            >
              {/* Native img: Supabase public URLs + avoids next/image remote optimizer edge cases in dev. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Section: Latest news — eyebrow, title, “view all” link, grid of news cards from `initialNews` prop (`content.news` for labels / empty state). */}
      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="relative text-sm font-semibold tracking-wide text-primary">
              <span className="relative inline-block">
                {content.news.eyebrow}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1 left-1/2 h-1 w-[90%] max-w-48 -translate-x-1/2 rounded-full bg-linear-to-r from-brand-yellow/25 via-brand-yellow to-brand-yellow/25"
                />
              </span>
            </p>
            <h2 className="mt-5 font-display text-2xl font-bold leading-tight text-foreground md:text-4xl">{content.news.title}</h2>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-fit shrink-0 rounded-full border-primary/35 px-6 text-primary transition-colors hover:bg-primary/5"
            asChild
          >
            <Link href="/parents/news" className="gap-2">
              {content.news.viewAll}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {initialNews.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/70 p-8 text-center text-sm text-muted-foreground">
              {content.news.emptyMessage}
            </div>
          ) : (
            initialNews.map((item) => {
              const title = isUk && item.title_uk ? item.title_uk : item.title;
              const description =
                isUk && item.description_uk
                  ? item.description_uk
                  : item.description ?? '';
              const hasHtmlDescription = isHtmlContent(description);
              const date = item.date ? new Date(item.date) : null;
              const dayLabel = date ? format(date, 'd', { locale: isUk ? uk : enUS }) : '';
              const monthLabel = date ? format(date, 'MMM', { locale: isUk ? uk : enUS }) : '';

              return (
                <article
                  key={item.id}
                  className={`group overflow-hidden ${CARD_SURFACE_CLASSNAME}`}
                >
                  <Link href={`/parents/news/${item.id}`} className="block">
                    <div className="relative aspect-16/10 overflow-hidden bg-secondary">
                      {item.photoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.photoUrl}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-secondary to-ukraine-yellow/35 text-primary">
                          <CalendarDays className="h-12 w-12" />
                        </div>
                      )}
                      {date ? (
                        <div className="absolute bottom-4 left-4 rounded-lg bg-card px-4 py-3 text-center shadow-lg shadow-black/10">
                          <div className="text-xl font-bold leading-none text-foreground">{dayLabel}</div>
                          <div className="mt-1 text-[11px] font-semibold uppercase text-muted-foreground">
                            {monthLabel}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold leading-snug text-foreground">{title}</h3>
                      {hasHtmlDescription ? (
                        <div
                          className="rich-text-preview mt-3 text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      ) : (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{description}</p>
                      )}
                    </div>
                  </Link>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* Section: Parent voices / testimonials — heading + `ParentVoicesCarousel` (`content.parentVoices`). Anchor: #parent-voices. */}
      <section
        id="parent-voices"
        aria-labelledby="parent-voices-heading"
        className="scroll-mt-24"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex flex-wrap items-end justify-center">
            <h2
              id="parent-voices-heading"
              className="font-display inline-flex max-w-4xl flex-wrap items-center justify-center gap-x-1 text-2xl font-bold leading-tight text-foreground md:text-4xl"
            >
              <span>{content.parentVoices.titleBefore}</span>
              <span className="relative inline-block">
                {content.parentVoices.titleHighlight}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1 left-1/2 h-1 w-[90%] max-w-48 -translate-x-1/2 rounded-full bg-linear-to-r from-brand-yellow/25 via-brand-yellow to-brand-yellow/25"
                />
              </span>
              <span>{content.parentVoices.titleAfter}</span>
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/home/hero-card-1.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 -translate-y-4 -translate-x-1.5 rotate-12 object-contain"
            />
          </div>
        </div>
        {parentVoiceCarouselItems.length === 0 ? (
          <p className="mx-auto max-w-md text-center text-sm text-muted-foreground">
            {isUk
              ? 'Тут зʼявляться відгуки батьків після додавання їх в адмін-панелі.'
              : 'Parent testimonials will appear here once they are added in the admin.'}
          </p>
        ) : (
          <ParentVoicesCarousel items={parentVoiceCarouselItems} />
        )}
      </section>

      {/* Section: FAQ — split title + two-column accordion (`content.faq`). Anchor: #faq. */}
      <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 overflow-visible">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,12rem)_1fr] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,14rem)_1fr]">
          <h2
            id="faq-heading"
            className="font-display text-2xl font-bold leading-tight text-foreground md:text-4xl mt-auto mb-auto lg:max-w-[14ch]"
          >
            <span className="inline-flex flex-wrap items-center gap-x-1">
              <span>{content.faq.titleBefore}</span>
              <span className="relative inline-block">
                {content.faq.titleHighlight}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1 left-1/2 h-1 w-[90%] max-w-48 -translate-x-1/2 rounded-full bg-linear-to-r from-brand-yellow/25 via-brand-yellow to-brand-yellow/25"
                />
              </span>
              <span>{content.faq.titleAfter}</span>
            </span>
          </h2>

          <Accordion
            type="single"
            collapsible
            className="relative isolate grid w-full grid-cols-1 gap-3 overflow-visible md:grid-cols-2 md:gap-x-6 md:gap-y-3"
          >
            {content.faq.items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`faq-${index}`}
                className={cn(
                  CARD_SURFACE_STATIC_CLASSNAME,
                  'relative z-0 overflow-visible border-0 data-[state=open]:z-30'
                )}
              >
                <AccordionTrigger className="px-4 py-4 text-left text-sm font-semibold hover:no-underline md:px-5 md:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent variant="overlay">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Section: Bottom lead CTA — headline, icon, lead form (`content.cta`); stays within container width; posts to `messages` like contact page. */}
      <HomeLeadCtaSection cta={content.cta} language={language} />
    </div>
  );
}
