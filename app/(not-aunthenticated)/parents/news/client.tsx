'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';
import { NEWS_CONTENT } from '@/content/news';
import type { PublicNews } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import { isHtmlContent } from '@/utils/rich-text';

type Props = {
  news: PublicNews[];
};

export default function NewsContent({ news }: Props) {
  const { language } = useLanguage();
  const content = NEWS_CONTENT;
  const readMore = language === 'uk' ? content.readMoreUk : content.readMore;
  const noNews = language === 'uk' ? content.noNewsUk : content.noNews;

  if (news.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 p-8 text-center text-muted-foreground">
        <Newspaper className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>{noNews}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => {
          const title = language === 'uk' && item.title_uk ? item.title_uk : item.title;
          const description =
            language === 'uk' && item.description_uk
              ? item.description_uk
              : item.description ?? '';

          return (
            <li key={item.id}>
              <Card className="h-full overflow-hidden">
                {item.photoUrl ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.photoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    {item.date
                      ? format(new Date(item.date), 'd MMM yyyy', {
                        locale: language === 'uk' ? uk : enUS
                      })
                      : ''}
                  </p>
                  <h3 className="font-semibold leading-snug font-display text-foreground mb-2 line-clamp-2">
                    {title}
                  </h3>
                  {description ? (
                    isHtmlContent(description) ? (
                      <div
                        className="rich-text-preview mb-4"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    ) : (
                      <p className="mb-4 line-clamp-3 text-muted-foreground">
                        {description}
                      </p>
                    )
                  ) : null}
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link href={`/parents/news/${item.id}`} className="gap-2">
                      {readMore}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
