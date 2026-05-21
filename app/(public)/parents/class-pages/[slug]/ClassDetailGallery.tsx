'use client';

import { useMemo, useState } from 'react';
import { useLanguage } from '@/providers/language-provider';
import { CLASS_PAGES_CONTENT } from '@/content/class-pages';
import { PhotoLightbox } from '@/components/common/PhotoLightbox';
import { cn } from '@/utils/cn';
import type { PublicClassGalleryImage } from '@/types';

type Props = {
  photos: PublicClassGalleryImage[];
  classTitle: string;
};

export function ClassDetailGallery({ photos, classTitle }: Props) {
  const { language } = useLanguage();
  const isUk = language === 'uk';
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const heading = isUk
    ? CLASS_PAGES_CONTENT.galleryHeadingUk
    : CLASS_PAGES_CONTENT.galleryHeading;

  const lightboxImages = useMemo(
    () => photos.map((p) => ({ src: p.src, alt: classTitle })),
    [photos, classTitle]
  );

  if (photos.length === 0) return null;

  return (
    <section className="not-prose mt-10 border-t border-border/60 pt-10">
      <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {heading}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.id}>
            <button
              type="button"
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
              className={cn(
                'relative aspect-square w-full overflow-hidden rounded-lg border bg-muted',
                'cursor-pointer transition-opacity hover:opacity-90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
              )}
              aria-label={
                isUk
                  ? `Відкрити фото ${index + 1} з ${photos.length}`
                  : `Open photo ${index + 1} of ${photos.length}`
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
          </li>
        ))}
      </ul>
      <PhotoLightbox
        images={lightboxImages}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        startIndex={lightboxIndex}
        title={heading}
      />
    </section>
  );
}
