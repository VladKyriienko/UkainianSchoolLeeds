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

      <div className="mt-8 flex w-full min-w-0 max-w-full snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overflow-y-visible [-ms-overflow-style:none] scroll-smooth scrollbar-none md:grid md:grid-cols-4 md:gap-4 md:overflow-x-visible md:py-0 [&::-webkit-scrollbar]:hidden">
        {programs.cards.map((card, index) => (
          <div
            key={`program-card-${index}`}
            className="flex w-min(85vw,70) shrink-0 snap-start flex-col sm:w-70 md:w-auto md:min-w-0"
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
