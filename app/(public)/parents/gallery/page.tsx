import { PageWrapper } from '@/components/common/PageWrapper';
import { GALLERY_CONTENT } from '@/content/gallery';
import { getPublicGalleryImages } from '@/lib/data/home';
import GalleryContent from '@/app/(public)/parents/gallery/client';

export default async function GalleryPage() {
  const photos = await getPublicGalleryImages();

  return (
    <PageWrapper
      title={{
        en: GALLERY_CONTENT.pageTitle,
        uk: GALLERY_CONTENT.pageTitleUk
      }}
      description={{
        en: GALLERY_CONTENT.pageDescription,
        uk: GALLERY_CONTENT.pageDescriptionUk
      }}
    >
      <GalleryContent photos={photos} />
    </PageWrapper>
  );
}
