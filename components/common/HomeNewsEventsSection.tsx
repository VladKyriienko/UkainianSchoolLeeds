'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CARD_SURFACE_CLASSNAME } from '@/components/ui/card';
import type { HomeContent } from '@/content/home';
import type { PublicEvent, PublicNews } from '@/types';
import { isHtmlContent } from '@/utils/rich-text';
import { cn } from '@/utils/cn';

const HOME_FEED_MAX = 3;

type HomeFeedItem =
  | { kind: 'news'; date: string; item: PublicNews }
  | { kind: 'event'; date: string; item: PublicEvent };

type HomeNewsEventsSectionProps = {
  initialNews: PublicNews[];
  initialEvents: PublicEvent[];
  content: HomeContent['news'];
  isUk: boolean;
};

export function HomeNewsEventsSection({
  initialNews,
  initialEvents,
  content,
  isUk
}: HomeNewsEventsSectionProps) {
  const hasNews = initialNews.length > 0;
  const hasUpcomingEvents = initialEvents.length > 0;

  if (!hasNews && !hasUpcomingEvents) {
    return null;
  }

  const compactRow =
    initialEvents.length < HOME_FEED_MAX || initialNews.length < HOME_FEED_MAX;

  const homeFeedItems = useMemo((): HomeFeedItem[] => {
    const eventItems: HomeFeedItem[] = hasUpcomingEvents
      ? initialEvents
          .map((item) => ({
            kind: 'event' as const,
            date: item.date,
            item
          }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
      : [];

    const newsItems: HomeFeedItem[] = initialNews
      .map((item) => ({
        kind: 'news' as const,
        date: item.date,
        item
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const ordered = [...eventItems, ...newsItems];
    return compactRow ? ordered.slice(0, HOME_FEED_MAX) : ordered;
  }, [initialNews, initialEvents, hasUpcomingEvents, compactRow]);

  const gridClassName = cn(
    'mt-6 grid gap-6',
    compactRow
      ? homeFeedItems.length === 1
        ? 'mx-auto max-w-md grid-cols-1'
        : homeFeedItems.length === 2
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-3'
  );

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="relative text-sm font-semibold tracking-wide text-primary">
            <span className="relative inline-block">
              {content.eyebrow}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/text-highlight-underline.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-1/2 z-0 h-2.5 w-[min(110%,14rem)] -translate-x-1/2 object-contain mix-blend-multiply sm:h-3 dark:mix-blend-screen"
              />
            </span>
          </p>
          <h2 className="mt-5 font-display text-2xl font-bold leading-tight text-foreground md:text-4xl">
            {content.title}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-fit shrink-0 rounded-full border-primary/35 px-6 text-primary transition-colors hover:bg-primary/5"
            asChild
          >
            <Link href="/parents/news" className="gap-2">
              {content.viewAllNews}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
          {hasUpcomingEvents ? (
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-fit shrink-0 rounded-full border-primary/35 px-6 text-primary transition-colors hover:bg-primary/5"
              asChild
            >
              <Link href="/parents/calendar" className="gap-2">
                {content.viewAllEvents}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className={gridClassName}>
        {homeFeedItems.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/70 p-8 text-center text-sm text-muted-foreground">
            {content.emptyMessage}
          </div>
        ) : (
          homeFeedItems.map((entry) => {
            const date = entry.date ? new Date(entry.date) : null;
            const dayLabel = date ? format(date, 'd', { locale: isUk ? uk : enUS }) : '';
            const monthLabel = date ? format(date, 'MMM', { locale: isUk ? uk : enUS }) : '';
            const kindLabel =
              entry.kind === 'news' ? content.newsLabel : content.eventLabel;
            const href =
              entry.kind === 'news'
                ? `/parents/news/${entry.item.id}`
                : `/parents/calendar/${entry.item.id}`;

            const title =
              isUk && entry.item.title_uk ? entry.item.title_uk : entry.item.title;

            let excerpt = '';
            if (entry.kind === 'news') {
              excerpt =
                isUk && entry.item.description_uk
                  ? entry.item.description_uk
                  : entry.item.description ?? '';
            } else {
              excerpt =
                isUk && entry.item.description_uk
                  ? entry.item.description_uk
                  : entry.item.description ?? '';
              if (!excerpt) {
                excerpt =
                  isUk && entry.item.location_uk
                    ? entry.item.location_uk
                    : entry.item.location ?? '';
              }
            }
            const hasHtmlDescription = isHtmlContent(excerpt);
            const photoUrl = entry.item.photoUrl;

            return (
              <article
                key={`${entry.kind}-${entry.item.id}`}
                className={`group overflow-hidden ${CARD_SURFACE_CLASSNAME}`}
              >
                <Link href={href} className="block">
                  <div className="relative aspect-16/10 overflow-hidden bg-secondary">
                    {photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoUrl}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-secondary to-ukraine-yellow/35 text-primary">
                        <CalendarDays className="h-12 w-12" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                      {kindLabel}
                    </span>
                    {date && entry.kind === 'event' ? (
                      <div className="absolute bottom-4 left-4 rounded-lg bg-card px-4 py-3 text-center shadow-lg shadow-black/10">
                        <div className="text-xl font-bold leading-none text-foreground">
                          {dayLabel}
                        </div>
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
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                      />
                    ) : excerpt ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {excerpt}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
