import { createAdminClient } from '@/lib/supabase/admin';
import { getEventById } from '@/app/admin/events/actions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { EventForm } from '@/components/features/admin/EventForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getAdminUser } from '@/lib/auth/server';

type EditEventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;

  // Verify admin access (layout already does this, but we need it for type safety)
  await getAdminUser();

  let event = null;
  let error: string | null = null;

  try {
    event = await getEventById(id);
    if (!event) {
      error = 'Event not found';
    }
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : 'Failed to load event';
  }

  if (error || !event) {
    return (
      <PageWrapper
        title="Edit Event"
        description="Update event details"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Event not found'}</AlertDescription>
        </Alert>
      </PageWrapper>
    );
  }

  const supabaseAdmin = createAdminClient();
  const currentPhotoUrl = event.photo
    ? supabaseAdmin.storage.from('events-photos').getPublicUrl(event.photo).data
        .publicUrl
    : null;

  return (
    <PageWrapper
      title="Edit Event"
      description="Update event details"
    >
      <EventForm mode="edit" event={event} currentPhotoUrl={currentPhotoUrl} />
    </PageWrapper>
  );
}
