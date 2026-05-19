import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BackButton } from '@/components/common/BackButton';
import { getEventById } from '../actions';
import { format } from 'date-fns';
import { EventDetailContent } from '@/components/features/calendar/EventDetailContent';
import { Calendar } from 'lucide-react';

function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return '';
  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;
  const hour = parseInt(parts[0] || '0', 10);
  const minute = parts[1] || '00';
  if (hour === 0) return `12:${minute} am`;
  if (hour < 12) return `${hour}:${minute} am`;
  if (hour === 12) return `12:${minute} pm`;
  return `${hour - 12}:${minute} pm`;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const eventDate = event.date ? new Date(event.date) : null;
  const dateLabel = eventDate ? format(eventDate, 'd MMMM yyyy') : '';
  const timeLabel =
    event.start_time && event.end_time
      ? `${formatTime(event.start_time)} – ${formatTime(event.end_time)}`
      : event.start_time
        ? formatTime(event.start_time)
        : '';

  return (
    <PageWrapper
      title={{ en: event.title, uk: event.title_uk ?? event.title }}
      description={
        dateLabel ? (
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {timeLabel ? `${dateLabel}, ${timeLabel}` : dateLabel}
          </span>
        ) : undefined
      }
      goBackButton={<BackButton />}
    >
      <EventDetailContent event={event} timeLabel={timeLabel} />
    </PageWrapper>
  );
}
