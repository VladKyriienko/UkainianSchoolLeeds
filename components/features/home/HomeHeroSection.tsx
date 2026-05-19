'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextHighlightUnderline } from './TextHighlightUnderline';
import { HERO_MAIN_IMAGE, HERO_PNG_ICONS, HERO_TRUST_ICON_PATHS } from './home-constants';
import type { HomeContent } from './types';

type HeroSectionContent = Pick<HomeContent, 'hero' | 'heroTrust' | 'features'>;

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

export function HomeHeroSection({ content }: { content: HeroSectionContent }) {
  return (
    <section className="relative isolate -mx-4 w-[calc(100%+(--spacing(8)))] max-w-none overflow-x-hidden rounded-t-[2.25rem] bg-card md:-mx-6 md:w-[calc(100%+(--spacing(12)))] lg:-mx-8 lg:w-[calc(100%+(--spacing(16)))]">
      <div className="relative z-10 grid grid-cols-1 items-center gap-8 px-4 md:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        <div className="max-w-2xl lg:col-start-1 lg:row-start-1 lg:self-start">
          <h1 className="font-display font-bold leading-[1.02] tracking-tight text-foreground max-md:text-4xl md:text-h1">
            {content.hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="relative mt-1 inline-block pb-2 text-primary">
              {content.hero.titleAccent}
              <TextHighlightUnderline fullWidth />
            </span>
          </h1>
          <p className="mt-6 max-w-140 text-muted-foreground">{content.hero.subtitle}</p>
        </div>

        <div className="relative pb-6 lg:col-span-1 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:pb-8">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-background/60 shadow-xl shadow-primary/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_MAIN_IMAGE}
              alt={content.hero.subtitle}
              className="aspect-16/10 w-full object-cover"
            />
          </div>
          <div className="absolute left-[55%] translate-x-[-50%] -top-6 z-20 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HERO_PNG_ICONS.teacher} alt="" className="h-12 w-12 object-contain" />
              </span>
              <HeroFloatingChipTitle
                title={content.features[0]!.title}
                heroTitleLines={content.features[0]!.heroTitleLines!}
              />
            </div>
          </div>
          <div className="absolute bottom-20 -left-4 z-20 rounded-2xl border border-border/80 bg-card/95 px-4 py-3 shadow-lg backdrop-blur md:-left-6">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HERO_PNG_ICONS.community} alt="" className="h-12 w-12 object-contain" />
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
                <img src={HERO_PNG_ICONS.creative} alt="" className="h-12 w-12 object-contain" />
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
  );
}
