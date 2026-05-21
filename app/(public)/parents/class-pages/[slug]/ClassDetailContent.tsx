'use client';

import { useLanguage } from '@/providers/language-provider';
import type { PublicClass, PublicClassGalleryImage } from '@/types';
import { isHtmlContent } from '@/utils/rich-text';
import { ClassDetailGallery } from './ClassDetailGallery';

type Props = {
  item: PublicClass;
  galleryPhotos: PublicClassGalleryImage[];
};

export function ClassDetailContent({ item, galleryPhotos }: Props) {
  const { language } = useLanguage();
  const isUk = language === 'uk';
  const description = isUk
    ? (item.description_uk ?? item.description)
    : item.description;
  const title = isUk && item.title_uk ? item.title_uk : item.title;

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {item.photoUrl ? (
        <div className="not-prose mx-auto mb-6 w-full max-w-4xl overflow-hidden rounded-lg bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.photoUrl}
            alt={title}
            className="h-[50vh] min-h-72 w-full object-cover"
          />
        </div>
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
        <p className="text-muted-foreground">
          Content for this class will be added soon.
        </p>
      )}
      <ClassDetailGallery photos={galleryPhotos} classTitle={title} />
    </article>
  );
}
