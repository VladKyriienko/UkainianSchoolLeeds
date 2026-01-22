import { getEvents } from './actions';
import { CalendarClient } from './client';
import { PageWrapper } from '@/components/common/PageWrapper';

export default async function CalendarPage() {
  const events = await getEvents();

  return (
    <PageWrapper
      title="Calendar"
      description="View upcoming school events, activities, and important dates"
      className="py-8 px-4"
    >
      <CalendarClient initialEvents={events} />
    </PageWrapper>
  );
}
