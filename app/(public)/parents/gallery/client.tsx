'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Images } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { GALLERY_CONTENT } from '@/content/gallery';
import { PhotoLightbox } from '@/components/common/PhotoLightbox';
import type { GalleryLayoutPhoto, SchoolAtmosphereGalleryImage } from '@/types';
import { cn } from '@/utils/cn';
import { useScrollToTopOnMount } from '@/hooks/useScrollToTopOnMount';
import {
  computeGalleryRowHeight,
  getGalleryPhotoWidthFraction,
  getPhotoOrientation,
  getPhotoWidthUnits,
  loadImageDimensions,
  packGalleryPhotosIntoRows
} from '@/utils/gallery-layout';

type GalleryContentProps = {
  photos: SchoolAtmosphereGalleryImage[];
};

function useGalleryMobileStack(): boolean {
  const [mobileStack, setMobileStack] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const update = () => setMobileStack(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return mobileStack;
}

function useGalleryGap(): number {
  const [gap, setGap] = useState(12);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const update = () => setGap(media.matches ? 16 : 12);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return gap;
}

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      setWidth(next);
    });

    observer.observe(element);
    setWidth(element.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, [ref]);

  return width;
}

export default function GalleryContent({ photos }: GalleryContentProps) {
  useScrollToTopOnMount();

  const { language } = useLanguage();
  const isUk = language === 'uk';
  const mobileStack = useGalleryMobileStack();
  const gap = useGalleryGap();
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);

  const [layoutPhotos, setLayoutPhotos] = useState<GalleryLayoutPhoto[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function buildLayout() {
      if (photos.length === 0) {
        setLayoutPhotos([]);
        return;
      }

      const loaded = await Promise.all(
        photos.map(async (photo) => {
          const alt = isUk && photo.altUk ? photo.altUk : photo.altEn;
          try {
            const { width, height } = await loadImageDimensions(photo.src);
            const orientation = getPhotoOrientation(width, height);
            return {
              id: photo.id,
              src: photo.src,
              alt,
              width,
              height,
              orientation,
              units: getPhotoWidthUnits(orientation)
            } satisfies GalleryLayoutPhoto;
          } catch {
            const orientation = 'landscape' as const;
            return {
              id: photo.id,
              src: photo.src,
              alt,
              width: 4,
              height: 3,
              orientation,
              units: getPhotoWidthUnits(orientation)
            } satisfies GalleryLayoutPhoto;
          }
        })
      );

      if (!cancelled) setLayoutPhotos(loaded);
    }

    void buildLayout();
    return () => {
      cancelled = true;
    };
  }, [photos, isUk]);

  const photoRows = useMemo(
    () => packGalleryPhotosIntoRows(layoutPhotos, { mobileStack }),
    [layoutPhotos, mobileStack]
  );

  const lightboxImages = useMemo(
    () =>
      photos.map((p) => ({
        src: p.src,
        alt: isUk && p.altUk ? p.altUk : p.altEn
      })),
    [photos, isUk]
  );

  const isLayoutReady =
    layoutPhotos.length === photos.length && containerWidth > 0;

  if (photos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 p-8 text-center text-muted-foreground">
        <Images className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>{isUk ? GALLERY_CONTENT.noPhotosUk : GALLERY_CONTENT.noPhotos}</p>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="flex w-full min-w-0 flex-col">
        {!isLayoutReady ? (
          <div
            className="w-full animate-pulse rounded-none bg-muted/20"
            style={{ height: 240 }}
            aria-hidden
          />
        ) : (
          <div className="flex flex-col" style={{ gap }}>
            {photoRows.map((row, rowIndex) => {
              const rowHeight = computeGalleryRowHeight(
                row,
                containerWidth,
                gap
              );

              const singleInRow = row.length === 1;

              return (
                <ul
                  key={`row-${rowIndex}-${row.map((p) => p.id).join('-')}`}
                  className="flex w-full min-w-0 justify-start"
                  style={{ gap, height: rowHeight }}
                >
                  {row.map((photo) => {
                    const index = photos.findIndex((p) => p.id === photo.id);
                    const openLabel = isUk
                      ? `${GALLERY_CONTENT.openPhotoUk} ${index + 1}`
                      : `${GALLERY_CONTENT.openPhotoEn} ${index + 1}`;
                    const widthPercent =
                      getGalleryPhotoWidthFraction(photo, row.length) * 100;

                    return (
                      <li
                        key={photo.id}
                        className="min-h-0 min-w-0"
                        style={
                          singleInRow
                            ? {
                                flex: '0 0 auto',
                                width: `${widthPercent}%`
                              }
                            : { flex: `${photo.units} 1 0` }
                        }
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                          }}
                          className={cn(
                            'flex h-full w-full items-center justify-start rounded-none p-0',
                            'cursor-pointer transition-opacity hover:opacity-90',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
                          )}
                          aria-label={openLabel}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            className={cn(
                              'h-full w-full rounded-none',
                              mobileStack
                                ? 'object-contain object-left'
                                : 'object-cover object-left'
                            )}
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              );
            })}
          </div>
        )}
      </div>

      <PhotoLightbox
        images={lightboxImages}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        startIndex={lightboxIndex}
        title={isUk ? GALLERY_CONTENT.pageTitleUk : GALLERY_CONTENT.pageTitle}
      />
    </>
  );
}
