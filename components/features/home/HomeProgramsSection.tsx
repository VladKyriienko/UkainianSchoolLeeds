'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CARD_SURFACE_CLASSNAME } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { TextHighlightUnderline } from './TextHighlightUnderline';
import type { HomeContent } from './types';

export function HomeProgramsSection({ programs }: { programs: HomeContent['programs'] }) {
  return (
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
          <span>{programs.headingBefore}</span>
          <span className="relative inline-block">
            {programs.headingHighlight}
            <TextHighlightUnderline />
          </span>
        </h2>
      </div>

      <div
        className={cn(
          'mt-8 w-full min-w-0 max-w-full gap-3',
          'max-md:flex max-md:snap-x max-md:snap-mandatory max-md:items-stretch',
          'max-md:overflow-x-auto max-md:overflow-y-visible max-md:px-1',
          'max-md:scroll-smooth max-md:[-ms-overflow-style:none] max-md:scrollbar-none',
          'md:grid md:grid-cols-2 md:gap-4',
          'lg:grid-cols-4',
          '[&::-webkit-scrollbar]:hidden'
        )}
      >
        {programs.cards.map((card, index) => (
          <div
            key={`program-card-${index}`}
            className={cn(
              'flex min-w-0 flex-col',
              'max-md:w-[72vw] max-md:max-w-64 max-md:shrink-0 max-md:snap-center',
              'md:w-auto md:max-w-none'
            )}
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
                  sizes="(max-width: 767px) 72vw, (max-width: 1023px) 50vw, 320px"
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
                  {programs.learnMore}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
