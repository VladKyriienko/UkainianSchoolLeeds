import { PageWrapper } from '@/components/common/PageWrapper';
import { ClassGalleryForm } from '@/app/admin/components/ClassGalleryForm';
import { listClasses } from '@/app/admin/classes/actions';

export default async function CreateClassGalleryPage() {
  const { classes } = await listClasses({ page: 1, limit: 500 });
  return (
    <PageWrapper
      title="Add photo to gallery"
      description="Add a photo to a class gallery."
    >
      <ClassGalleryForm mode="create" classes={classes} />
    </PageWrapper>
  );
}
