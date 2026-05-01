import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type AdminGalleryItem,
  getGalleryItemById,
  listAccessibleClassesForGallery
} from '@/app/admin/class-gallery/actions';
import { ClassGalleryDetailsActions } from '@/app/admin/components/ClassGalleryDetailsActions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { createAdminClient } from '@/utils/supabase/admin';
import { format } from 'date-fns';

export default async function TeacherClassGalleryViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item: AdminGalleryItem | null = null;
  let classTitle = '';
  try {
    item = await getGalleryItemById(id);
    if (item) {
      const itemClassId = item.class_id;
      const { classes } = await listAccessibleClassesForGallery();
      classTitle =
        classes.find((galleryClass) => galleryClass.id === itemClassId)?.title ??
        itemClassId;
    }
  } catch {
    // fallthrough
  }

  if (!item) notFound();

  const supabaseAdmin = createAdminClient();
  const photoUrl = supabaseAdmin.storage
    .from('class-gallery')
    .getPublicUrl(item.photo).data.publicUrl;

  return (
    <PageWrapper
      title="Gallery photo"
      description={classTitle}
      goBackButton={<BackButton />}
      actions={
        <ClassGalleryDetailsActions
          itemId={item.id}
          basePath="/teacher/class-gallery"
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border overflow-hidden max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt=""
              className="w-full aspect-video object-cover"
            />
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Class</div>
            <div className="font-medium">{classTitle}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Order</div>
            <div className="font-medium">{item.order}</div>
          </div>
          <div className="text-sm text-muted-foreground pt-4 border-t">
            Created:{' '}
            {item.created_at
              ? format(new Date(item.created_at), 'MMMM d, yyyy h:mm a')
              : '—'}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
