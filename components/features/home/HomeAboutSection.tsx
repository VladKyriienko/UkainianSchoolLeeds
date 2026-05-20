'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextHighlightUnderline } from './TextHighlightUnderline';
import { ABOUT_HIGHLIGHT_ICONS, ABOUT_PATTERN_SRC } from './home-constants';
import type { HomeContent } from './types';

export function HomeAboutSection({ about }: { about: HomeContent['about'] }) {
  return (
    <section
      aria-labelledby="about-school-heading"
      className="relative left-1/2 w-dvw max-w-none -translate-x-1/2 scroll-mt-24"
    >
      <div className="w-full overflow-visible rounded-none bg-card lg:grid lg:min-h-[min(28rem,65vh)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
        <div className="relative aspect-5/4 min-h-editor lg:aspect-auto lg:min-h-[min(28rem,65vh)]">
          <Image
            src={about.imageSrc}
            alt={about.imageAlt}
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

        <div className="relative flex flex-col justify-center overflow-visible bg-card px-6 pt-10 lg:px-10 lg:py-12 xl:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 lg:-top-20 lg:-bottom-20 right-0 w-[min(100%,32rem)]"
          >
            <Image
              src={ABOUT_PATTERN_SRC}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 32rem"
              className="object-cover object-center opacity-[0.12] mix-blend-multiply dark:opacity-[0.45] dark:mix-blend-screen"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-r from-card from-0% via-card/88 via-5% to-card/25 to-100%" />
          </div>

          <p className="relative z-10 text-sm font-semibold tracking-wide text-primary">
            <span className="relative inline-block">
              {about.eyebrow}
              <TextHighlightUnderline />
            </span>
          </p>
          <h2
            id="about-school-heading"
            className="relative z-10 mt-5 max-w-xl font-display text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl"
          >
            {about.title}
          </h2>
          <p className="relative z-10 mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {about.description}
          </p>

          <ul className="relative z-10 mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3 lg:grid-cols-3 lg:gap-2 [&>li:last-child]:sm:col-span-2 [&>li:last-child]:sm:flex [&>li:last-child]:sm:justify-center lg:[&>li:last-child]:col-span-1 lg:[&>li:last-child]:justify-start">
            {about.highlights.map((label, index) => {
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
            className="relative z-10 mt-9 h-12 w-fit rounded-full px-8"
            asChild
          >
            <Link href="/about/welcome" className="gap-2">
              {about.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
