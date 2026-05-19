import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createAdminClient } from '@/lib/supabase/admin';
import { getTeacherById } from '@/app/admin/teachers/actions';
import { AdminEntityDetailsActions } from '@/components/common/admin/AdminEntityDetailsActions';
import { deleteTeacher } from '@/app/admin/teachers/actions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { isHtmlContent } from '@/utils/rich-text';

export default async function TeacherDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let teacher = null;
  try {
    teacher = await getTeacherById(id);
  } catch {
    // fallthrough
  }

  if (!teacher) {
    notFound();
  }

  const supabaseAdmin = createAdminClient();
  const photoUrl = teacher.photo
    ? supabaseAdmin.storage.from('teachers-photos').getPublicUrl(teacher.photo)
      .data.publicUrl
    : null;

  return (
    <PageWrapper
      title={teacher.name}
      description={teacher.title || '—'}
      goBackButton={<BackButton />}
      actions={
        <AdminEntityDetailsActions
          editHref={`/admin/teachers/${teacher.id}/edit`}
          listPath="/admin/teachers"
          confirmMessage={`Are you sure you want to delete ${teacher.name}? This action cannot be undone.`}
          deleteErrorMessage="Failed to delete teacher"
          entityId={teacher.id}
          deleteAction={deleteTeacher}
        />
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Photo</CardTitle>
          </CardHeader>
          <CardContent>
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={teacher.name}
                className="w-full rounded-md border object-cover aspect-square"
              />
            ) : (
              <div className="aspect-square w-full rounded-md border bg-muted flex items-center justify-center text-muted-foreground text-sm">
                No photo
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Category:</span>
              <Badge variant="secondary">{teacher.category}</Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <div className="font-medium break-all">{teacher.email || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Phone</div>
                <div className="font-medium">{teacher.phone || '—'}</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-1">Description</div>
              {isHtmlContent(teacher.description) ? (
                <div
                  className="rich-text-content"
                  dangerouslySetInnerHTML={{ __html: teacher.description || '' }}
                />
              ) : (
                <div className="whitespace-pre-wrap">
                  {teacher.description || '—'}
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Created:{' '}
              {teacher.created_at
                ? new Date(teacher.created_at).toLocaleString()
                : '—'}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}

