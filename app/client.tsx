'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/providers/language-provider';
import { HOME_CONTENT } from '@/content/home';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  HeartHandshake,
  Leaf,
  PlayCircle,
  Sparkles,
  Star,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import type { PublicNews } from '@/app/(not-aunthenticated)/parents/news/actions';
import { isHtmlContent } from '@/utils/rich-text';

export type PublicHomeClientProps = {
  initialNews: PublicNews[];
};

const featureIcons = [BookOpen, HeartHandshake, Star, Leaf];

export function PublicHomeClient({ initialNews }: PublicHomeClientProps) {
  const { language } = useLanguage();
  const content = HOME_CONTENT[language];
  const isUk = language === 'uk';

  return (
    <div className="public-page w-full overflow-hidden pb-12">
      <section className="public-hero relative isolate overflow-hidden md:-mx-6 lg:-mx-8">
        <div className="public-hero-image-desktop absolute inset-y-0 right-0 hidden w-[64%] bg-cover bg-center lg:block" />
        <div className="absolute inset-y-0 right-0 hidden w-[64%] bg-gradient-to-b from-white/10 via-transparent to-white/40 lg:block" />
        <div className="relative z-10 grid min-h-[540px] items-center gap-8 px-4 py-12 md:px-8 lg:grid-cols-[0.52fr_0.48fr] lg:px-14 lg:py-16">
          <div className="max-w-xl">
            <h1 className="public-title text-5xl font-bold leading-[0.94] tracking-tight md:text-6xl lg:text-[4.7rem]">
              {content.hero.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="public-title-accent block">{content.hero.titleAccent}</span>
            </h1>
            <div className="public-accent-line mt-4 h-2 w-24 rounded-full" />
            <p className="public-text mt-8 max-w-[28rem] text-base leading-7">
              {content.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="public-button-primary rounded-lg px-7 shadow-lg shadow-blue-900/10"
              >
                <Link href="/about/whos-who" className="gap-2">
                  {content.hero.primaryCta}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="public-button-outline rounded-lg px-7"
              >
                <Link href="/parents/calendar" className="gap-2">
                  <PlayCircle className="public-link h-4 w-4" />
                  {content.hero.secondaryCta}
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-[330px] lg:min-h-[430px]">
            <div className="public-hero-image-mobile absolute inset-0 overflow-hidden rounded-[1.5rem] bg-cover bg-center shadow-xl shadow-slate-900/10 lg:hidden" />
            <div className="public-floating-card absolute bottom-5 right-4 max-w-[20rem] rounded-2xl border p-5 shadow-xl shadow-slate-900/10 backdrop-blur md:right-8 lg:hidden">
              <div className="flex gap-4">
                <span className="public-icon-warm flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
                  <HeartHandshake className="h-7 w-7" />
                </span>
                <p className="public-title text-sm font-semibold leading-6">
                  {content.hero.mission}
                </p>
              </div>
            </div>
          </div>

          <div className="public-floating-card absolute bottom-8 right-8 z-20 hidden max-w-sm rounded-2xl border p-5 shadow-xl shadow-slate-900/10 backdrop-blur lg:block xl:right-16">
            <div className="flex gap-4">
              <span className="public-icon-warm flex h-14 w-14 shrink-0 items-center justify-center rounded-full">
                <HeartHandshake className="h-7 w-7" />
              </span>
              <p className="public-title text-sm font-semibold leading-6">
                {content.hero.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {content.features.map((feature, index) => {
          const Icon = featureIcons[index] ?? Sparkles;

          return (
            <article
              key={feature.title}
              className="public-feature-card group rounded-2xl border p-6 shadow-sm shadow-slate-900/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-900/10"
            >
              <span className="public-feature-icon public-icon-soft flex h-12 w-12 items-center justify-center rounded-full transition duration-300 group-hover:shadow-lg group-hover:shadow-blue-900/15">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="public-title mt-5 text-base font-bold">{feature.title}</h2>
              <p className="public-text mt-3 text-sm leading-6">{feature.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid items-center gap-10 py-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="relative">
          <div className="public-accent-line absolute -left-5 top-8 hidden h-40 w-6 rounded-full lg:block" />
          <div className="public-dot-accent absolute -left-8 top-0 hidden grid-cols-2 gap-2 lg:grid">
            {Array.from({ length: 10 }).map((_, index) => (
              <span key={index} className="h-1.5 w-1.5 rounded-full bg-current" />
            ))}
          </div>
          <div className="public-image-frame relative overflow-hidden rounded-2xl border shadow-xl shadow-slate-900/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/school-building.png"
              alt={content.about.imageAlt}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </div>

        <div className="relative">
          <p className="public-eyebrow text-xs font-bold uppercase tracking-[0.18em]">
            {content.about.eyebrow}
          </p>
          <h2 className="public-title mt-4 max-w-md text-4xl font-bold leading-tight md:text-5xl">
            {content.about.title}
          </h2>
          <p className="public-text mt-5 max-w-xl text-base leading-7">
            {content.about.description}
          </p>
          <Button
            variant="ghost"
            asChild
            className="public-text-link mt-6 px-0 hover:bg-transparent"
          >
            <Link href="/about/welcome" className="gap-2">
              {content.about.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Leaf className="public-link absolute right-4 top-6 hidden h-40 w-40 opacity-20 lg:block" />
        </div>
      </section>

      <section className="py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="public-eyebrow text-xs font-bold uppercase tracking-[0.18em]">
              {content.news.eyebrow}
            </p>
            <h2 className="public-title mt-3 text-3xl font-bold md:text-4xl">
              {content.news.title}
            </h2>
          </div>
          <Button variant="ghost" asChild className="public-text-link w-fit px-0">
            <Link href="/parents/news" className="gap-2">
              {content.news.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {initialNews.length === 0 ? (
            <div className="public-empty-state col-span-full rounded-2xl border border-dashed p-8 text-sm">
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
                  className="public-news-card group overflow-hidden rounded-2xl border shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
                >
                  <Link href={`/parents/news/${item.id}`} className="block">
                    <div className="public-news-image relative aspect-[16/10] overflow-hidden">
                      {item.photoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.photoUrl}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="public-news-placeholder flex h-full w-full items-center justify-center">
                          <CalendarDays className="h-12 w-12" />
                        </div>
                      )}
                      {date ? (
                        <div className="public-date-badge absolute bottom-4 left-4 rounded-lg px-4 py-3 text-center shadow-lg shadow-slate-900/10">
                          <div className="public-title text-xl font-bold leading-none">
                            {dayLabel}
                          </div>
                          <div className="public-text mt-1 text-[11px] font-semibold uppercase">
                            {monthLabel}
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h3 className="public-title text-lg font-bold leading-snug">
                        {title}
                      </h3>
                      {hasHtmlDescription ? (
                        <div
                          className="rich-text-preview public-text mt-3"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      ) : (
                        <p className="public-text mt-3 line-clamp-3 text-sm leading-6">
                          {description}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="public-cta-section mt-6 overflow-hidden px-4 py-10 md:-mx-6 md:px-8 lg:-mx-8 lg:px-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <Users className="mb-5 h-12 w-12 text-white/25" />
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">{content.cta.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/80">{content.cta.description}</p>
          </div>
          <Button
            size="lg"
            asChild
            className="public-button-yellow w-fit rounded-lg px-7"
          >
            <Link href="/contact" className="gap-2">
              {content.cta.button}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
