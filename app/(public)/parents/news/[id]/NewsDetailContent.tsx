'use client';

import { useLanguage } from '@/providers/language-provider';
import { format } from 'date-fns';
import { enUS, uk } from 'date-fns/locale';
import type { PublicNews } from '@/types';
import { isHtmlContent } from '@/utils/rich-text';
import { AdminDetailPhoto } from '@/components/common/admin/AdminDetailPhoto';

type Props = {
  item: PublicNews;
};

export function NewsDetailContent({ item }: Props) {
  const { language } = useLanguage();
  const isUk = language === 'uk';
  const description = isUk
    ? (item.description_uk ?? item.description)
    : item.description;
  const title = isUk && item.title_uk ? item.title_uk : item.title;

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
        <AdminDetailPhoto
          src={item.photoUrl}
          alt={title}
          showLabel={false}
          className="mb-6"
        />
      ) : null}
      {description ? (
        isHtmlContent(description) ? (
          <div
            className="rich-text-content"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <div className="text-muted-foreground whitespace-pre-line">
            {description}
          </div>
        )
      ) : (
        <p className="text-muted-foreground">Content will be added soon.</p>
      )}
    </article>
  );
}
