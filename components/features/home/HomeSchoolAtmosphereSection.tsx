'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CARD_SURFACE_CLASSNAME } from '@/components/ui/card';
import { PhotoLightbox } from '@/components/common/PhotoLightbox';
import { cn } from '@/utils/cn';
import type { HomeContent } from './types';

export type AtmosphereStripImage = {
  key: string;
  src: string;
  alt: string;
};

export function HomeSchoolAtmosphereSection({
  images,
  content,
  isUk
}: {
  images: AtmosphereStripImage[];
  content: HomeContent['schoolAtmosphere'];
  isUk: boolean;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxImages = useMemo(
    () => images.map((p) => ({ src: p.src, alt: p.alt })),
    [images]
  );

  return (
    <section
      id="school-atmosphere"
      aria-labelledby="school-atmosphere-heading"
      className="scroll-mt-24"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="school-atmosphere-heading"
          className="font-display text-balance text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl"
        >
          {content.heading}
        </h2>
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-fit shrink-0 rounded-full border-primary/35 px-6 text-primary transition-colors hover:bg-primary/5"
          asChild
        >
          <Link href={content.ctaHref} scroll className="gap-2">
            {content.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>
      <div className="mt-8 flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible pb-2 [-ms-overflow-style:none] scroll-smooth scrollbar-none md:grid md:grid-cols-4 md:gap-4 md:overflow-x-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
        {images.map((photo, photoIndex) => (
          <button
            key={photo.key}
            type="button"
            onClick={() => {
              setLightboxIndex(photoIndex);
              setLightboxOpen(true);
            }}
            className={cn(
              'group relative aspect-video w-min(85vw,70) shrink-0 snap-start overflow-hidden md:w-auto',
              CARD_SURFACE_CLASSNAME,
              'cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
            )}
            aria-label={
              isUk
                ? `Відкрити фото ${photoIndex + 1} з ${images.length}`
                : `Open photo ${photoIndex + 1} of ${images.length}`
            }
          >
            {/* Native img: Supabase public URLs + avoids next/image remote optimizer edge cases in dev. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      <PhotoLightbox
        images={lightboxImages}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        startIndex={lightboxIndex}
        title={content.heading}
      />
    </section>
  );
}
