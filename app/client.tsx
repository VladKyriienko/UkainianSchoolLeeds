'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/providers/language-provider';
import { HOME_CONTENT } from '@/content/home';
import { ArrowRight, CalendarDays, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import type { PublicNews } from '@/app/(not-aunthenticated)/parents/news/actions';

export type PublicHomeClientProps = {
  initialNews: PublicNews[];
};

export function PublicHomeClient({ initialNews }: PublicHomeClientProps) {
  const { language } = useLanguage();
  const content = HOME_CONTENT[language];
  const isUk = language === 'uk';

  return (
    <div className="w-full pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-card">
        {/* Image placeholder */}
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,rgba(30,120,210,0.35),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(255,215,0,0.25),transparent_55%),linear-gradient(135deg,rgba(15,23,42,0.12),rgba(255,251,235,0.75))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
        </div>

        <div className="relative px-6 py-14 md:px-10 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-ukraine-yellow" />
              {content.hero.eyebrow}
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
              {content.hero.title}
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg max-w-2xl">
              {content.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild className="sm:w-auto">
                <Link href="/parents/calendar" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {content.hero.primaryCta}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="sm:w-auto">
                <Link href="/contact" className="gap-2">
                  <Mail className="h-4 w-4" />
                  {content.hero.secondaryCta}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{content.programs.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.programs.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {content.programs.cards.map((card) => (
            <Card key={card.href} className="group">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {card.description}
                </p>
                <div className="mt-4">
                  <Button variant="ghost" asChild className="px-0">
                    <Link href={card.href} className="gap-2">
                      <span>{content.programs.openLabel}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{content.news.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.news.subtitle}
            </p>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/parents/news" className="gap-2">
              {content.news.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {initialNews.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full">
              {content.news.emptyMessage}
            </p>
          ) : (
            initialNews.map((item) => {
              const title = isUk && item.title_uk ? item.title_uk : item.title;
              const description =
                isUk && item.description_uk
                  ? item.description_uk
                  : item.description ?? '';
              const dateLabel = item.date
                ? format(new Date(item.date), 'd MMM yyyy', {
                    locale: isUk ? uk : enUS
                  })
                : '';

              return (
                <article key={item.id} className="flex flex-col">
                  <div className="aspect-[16/10] w-full overflow-hidden bg-muted/50">
                    {item.photoUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.photoUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    {dateLabel}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground flex-1 line-clamp-3">
                    {description}
                  </p>
                  <div className="mt-4">
                    <Button variant="ghost" asChild className="px-0">
                      <Link
                        href={`/parents/news/${item.id}`}
                        className="gap-2"
                      >
                        <span>{content.news.readMore}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
