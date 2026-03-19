'use client';

import { useLanguage } from '@/providers/language-provider';
import { format } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import type { PublicNews } from '../actions';

type Props = {
  item: PublicNews;
};

export function NewsDetailContent({ item }: Props) {
  const { language } = useLanguage();
  const isUk = language === 'uk';
  const description = isUk
    ? (item.description_uk ?? item.description)
    : item.description;

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {item.date ? (
        <p className="text-sm text-muted-foreground mb-4">
          {format(new Date(item.date), 'd MMMM yyyy', {
            locale: isUk ? uk : enUS
          })}
        </p>
      ) : null}
      {item.photoUrl ? (
        <div className="not-prose w-2/3 mx-auto mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.photoUrl}
            alt=""
            className="w-full object-contain"
          />
        </div>
      ) : null}
      {description ? (
        <div className="text-muted-foreground whitespace-pre-line">
          {description}
        </div>
      ) : (
        <p className="text-muted-foreground">Content will be added soon.</p>
      )}
    </article>
  );
}
