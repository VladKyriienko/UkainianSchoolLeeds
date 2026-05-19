'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';

type AdminDetailPhotoProps = {
  src: string;
  alt: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
};

export function AdminDetailPhoto({
  src,
  alt,
  label = 'Photo',
  showLabel = true,
  className
}: AdminDetailPhotoProps) {
  const [isLandscape, setIsLandscape] = useState<boolean | null>(null);

  return (
    <div className={cn('min-w-0 w-full max-w-full not-prose', className)}>
      {showLabel ? (
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
      ) : null}
      <div className="flex justify-center">
        <div
          className={cn(
            'rounded-md border bg-muted/30',
            isLandscape ? 'w-full max-w-xl' : 'max-w-sm'
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="block h-auto w-full max-w-full object-contain"
            onLoad={(e) => {
              const img = e.currentTarget;
              setIsLandscape(img.naturalWidth > img.naturalHeight);
            }}
          />
        </div>
      </div>
    </div>
  );
}
