import { PageWrapper } from '@/components/common/PageWrapper';
import { GalleryForm } from '@/app/admin/components/GalleryForm';

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
