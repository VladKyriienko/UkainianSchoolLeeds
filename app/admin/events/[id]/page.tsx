import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getEventById } from '@/app/admin/events/actions';
import { EventDetailsActions } from '@/app/admin/components/EventDetailsActions';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { format } from 'date-fns';
import { isHtmlContent } from '@/utils/rich-text';

export default async function EventDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let event = null;
  try {
    event = await getEventById(id);
  } catch {
    // fallthrough
  }

  if (!event) {
    notFound();
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return '—';
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '—';
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString;
    const hour = parseInt(parts[0] || '0', 10);
    const minute = parts[1] || '00';
    if (hour === 0) return `12:${minute} am`;
    if (hour < 12) return `${hour}:${minute} am`;
    if (hour === 12) return `12:${minute} pm`;
    return `${hour - 12}:${minute} pm`;
  };

  return (
    <PageWrapper
      title={event.title}
      description={formatDate(event.date)}
      goBackButton={<BackButton />}
      actions={<EventDetailsActions eventId={event.id} eventTitle={event.title} />}
    >
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Title</div>
            <div className="font-medium text-lg">{event.title}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Description</div>
            {isHtmlContent(event.description) ? (
              <div
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: event.description || '' }}
              />
            ) : (
              <div className="whitespace-pre-wrap">{event.description || '—'}</div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Date</div>
              <div className="font-medium">{formatDate(event.date)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Location</div>
              <div className="font-medium">{event.location || '—'}</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Start Time</div>
              <div className="font-medium">{formatTime(event.start_time)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">End Time</div>
              <div className="font-medium">{formatTime(event.end_time)}</div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground pt-4 border-t">
            Created:{' '}
            {event.created_at
              ? format(new Date(event.created_at), 'MMMM d, yyyy h:mm a')
              : '—'}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
