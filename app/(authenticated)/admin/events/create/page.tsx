import { PageWrapper } from '@/components/common/PageWrapper';
import { EventForm } from '@/app/(authenticated)/admin/components/EventForm';

export default function CreateEventPage() {
  return (
    <PageWrapper
      title="Create Event"
      description="Add a new school event to the calendar"
    >
      <EventForm mode="create" />
    </PageWrapper>
  );
}
