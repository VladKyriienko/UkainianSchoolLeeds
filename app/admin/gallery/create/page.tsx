import { PageWrapper } from '@/components/common/PageWrapper';
import { GalleryForm } from '@/components/features/admin/GalleryForm';

export default function AdminGalleryCreatePage() {
  return (
    <PageWrapper
      title="Add photo to gallery"
      description="Upload a photo for the school gallery."
    >
      <GalleryForm mode="create" />
    </PageWrapper>
  );
}
