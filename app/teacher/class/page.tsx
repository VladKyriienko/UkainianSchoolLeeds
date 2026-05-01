import { PageWrapper } from '@/components/common/PageWrapper';
import { getTeacherAssignedClassForGallery } from '@/app/admin/class-gallery/actions';
import { isHtmlContent } from '@/utils/rich-text';

export default async function TeacherClassPage() {
  const assignedClass = await getTeacherAssignedClassForGallery();

  if (!assignedClass) {
    return (
      <PageWrapper
        title="Class"
        description="Your assigned class details."
      >
        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="mb-2 text-xl font-semibold">No class assigned</h2>
          <p className="text-sm text-muted-foreground">
            You currently do not have a class assigned. Please contact an admin.
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Class"
      description="Your assigned class details."
    >
      <div className="mt-8 rounded-lg border bg-card p-6">
        <h2 className="mb-2 text-xl font-semibold">{assignedClass.title}</h2>
        {assignedClass.title_uk && (
          <p className="text-sm text-muted-foreground mb-3">{assignedClass.title_uk}</p>
        )}
        {(() => {
          const description =
            assignedClass.description || assignedClass.description_uk || '';
          if (!description) {
            return (
              <p className="text-sm text-muted-foreground">No description.</p>
            );
          }
          if (isHtmlContent(description)) {
            return (
              <div
                className="rich-text-content text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            );
          }
          return (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {description}
            </p>
          );
        })()}
      </div>
    </PageWrapper>
  );
}
