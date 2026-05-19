import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSchoolGalleryItemById } from '@/app/admin/gallery/actions';
import { GalleryDetailsActions } from '@/app/admin/components/GalleryDetailsActions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { AdminDetailPhoto } from '@/components/common/admin/AdminDetailPhoto';
import { createAdminClient } from '@/utils/supabase/admin';
import { format } from 'date-fns';

export default async function GalleryViewPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item = null;
  try {
    item = await getSchoolGalleryItemById(id);
  } catch {
    // fallthrough
  }

  if (!item) notFound();

  const supabaseAdmin = createAdminClient();
  const photoUrl = supabaseAdmin.storage
    .from('gallery-photos')
    .getPublicUrl(item.photo).data.publicUrl;

  return (
    <PageWrapper
      title="Gallery photo"
      description={`Order: ${item.order}`}
      goBackButton={<BackButton />}
      actions={<GalleryDetailsActions itemId={item.id} />}
    >
      <Card>
        <CardHeader>
          <CardTitle>Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 min-w-0">
          <AdminDetailPhoto src={photoUrl} alt="Gallery photo" showLabel={false} />
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
          {item.updated_at && item.updated_at !== item.created_at && (
            <div className="text-sm text-muted-foreground">
              Updated:{' '}
              {format(new Date(item.updated_at), 'MMMM d, yyyy h:mm a')}
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
