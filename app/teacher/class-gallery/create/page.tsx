import { PageWrapper } from '@/components/common/PageWrapper';
import { ClassGalleryForm } from '@/app/admin/components/ClassGalleryForm';
import { getTeacherAssignedClassForGallery } from '@/app/admin/class-gallery/actions';

export default async function TeacherCreateClassGalleryPage() {
  const assignedClass = await getTeacherAssignedClassForGallery();

  if (!assignedClass) {
    return (
      <PageWrapper
        title="Add photo to gallery"
        description="Add a photo to your class gallery."
      >
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            No class is assigned to your account. Please contact an admin.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Add photo to gallery"
      description="Add a photo to your class gallery."
    >
      <ClassGalleryForm
        mode="create"
        classes={[assignedClass]}
        fixedClassId={assignedClass.id}
        hideClassSelect={true}
        successRedirectPath="/teacher/class-gallery"
      />
    </PageWrapper>
  );
}
