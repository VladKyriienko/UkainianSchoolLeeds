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
          <h3 className="font-semibold leading-snug font-display text-foreground">No class assigned</h3>
          <p className="text-muted-foreground">
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
        <h3 className="font-semibold leading-snug font-display text-foreground">{assignedClass.title}</h3>
        {assignedClass.title_uk && (
          <p className="mb-3 text-muted-foreground">{assignedClass.title_uk}</p>
        )}
        {(() => {
          const description =
            assignedClass.description || assignedClass.description_uk || '';
          if (!description) {
            return (
              <p className="text-muted-foreground">No description.</p>
            );
          }
          if (isHtmlContent(description)) {
            return (
              <div
                className="rich-text-content text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            );
          }
          return (
            <p className="whitespace-pre-wrap text-muted-foreground">
              {description}
            </p>
          );
        })()}
      </div>
    </PageWrapper>
  );
}
