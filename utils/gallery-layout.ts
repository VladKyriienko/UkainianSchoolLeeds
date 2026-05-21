import type {
  GalleryLayoutPhoto,
  PackGalleryRowsOptions,
  PhotoOrientation
} from '@/types';

/** Row width budget: landscape = 2 (half), portrait = 1 (quarter). */
export const GALLERY_ROW_CAPACITY = 4;

export function getPhotoOrientation(
  width: number,
  height: number
): PhotoOrientation {
  return width >= height ? 'landscape' : 'portrait';
}

export function getPhotoWidthUnits(orientation: PhotoOrientation): 1 | 2 {
  return orientation === 'landscape' ? 2 : 1;
}

/** Pack photos into rows that fill the container width (4 units per row). */
export function packGalleryPhotosIntoRows(
  photos: GalleryLayoutPhoto[],
  options?: PackGalleryRowsOptions
): GalleryLayoutPhoto[][] {
  if (options?.mobileStack) {
    return photos.map((photo) => [{ ...photo, units: 4 }]);
  }

  const rows: GalleryLayoutPhoto[][] = [];
  let currentRow: GalleryLayoutPhoto[] = [];
  let usedUnits = 0;

  for (const photo of photos) {
    const units = photo.units;

    if (usedUnits + units > GALLERY_ROW_CAPACITY) {
      if (currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
        usedUnits = 0;
      }
    }

    currentRow.push(photo);
    usedUnits += units;

    if (usedUnits === GALLERY_ROW_CAPACITY) {
      rows.push(currentRow);
      currentRow = [];
      usedUnits = 0;
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

/** Share of row width for one photo (capped at half the container). */
export function getGalleryPhotoWidthFraction(
  photo: GalleryLayoutPhoto,
  rowLength: number
): number {
  const fraction = photo.units / GALLERY_ROW_CAPACITY;
  if (rowLength === 1) {
    return Math.min(fraction, 0.5);
  }
  return fraction;
}

function getGalleryPhotoSlotWidth(
  photo: GalleryLayoutPhoto,
  row: GalleryLayoutPhoto[],
  containerWidth: number,
  gapPx: number
): number {
  if (row.length === 1) {
    return containerWidth * getGalleryPhotoWidthFraction(photo, 1);
  }

  const totalUnits = row.reduce((sum, p) => sum + p.units, 0);
  const gapTotal = gapPx * Math.max(0, row.length - 1);
  const availableWidth = containerWidth - gapTotal;
  const unitWidth = availableWidth / totalUnits;
  return unitWidth * photo.units;
}

/** Row height = tallest photo when scaled to its slot width. */
export function computeGalleryRowHeight(
  row: GalleryLayoutPhoto[],
  containerWidth: number,
  gapPx: number
): number {
  if (containerWidth <= 0 || row.length === 0) return 0;

  let maxHeight = 0;
  for (const photo of row) {
    const itemWidth = getGalleryPhotoSlotWidth(
      photo,
      row,
      containerWidth,
      gapPx
    );
    const itemHeight = itemWidth * (photo.height / photo.width);
    maxHeight = Math.max(maxHeight, itemHeight);
  }

  return Math.ceil(maxHeight);
}

export function loadImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || 1,
        height: img.naturalHeight || 1
      });
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}
