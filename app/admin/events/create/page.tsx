import { PageWrapper } from '@/components/common/PageWrapper';
import { EventForm } from '@/app/admin/components/EventForm';

export default async function CreateEventPage() {
  return (
    <PageWrapper
      title="Add Event"
      description="Create a new school event for the public site."
    >
      <EventForm mode="create" />
    </PageWrapper>
  );
}
