export type PhotoOrientation = 'landscape' | 'portrait';

export type GalleryLayoutPhoto = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  orientation: PhotoOrientation;
  units: 1 | 2 | 4;
};

export type PackGalleryRowsOptions = {
  mobileStack?: boolean;
};

export type CompressionOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
  outputMimeType?: string;
};

export type ValidLucideIconName = import('@/utils/lucide-icons').ValidLucideIconName;
