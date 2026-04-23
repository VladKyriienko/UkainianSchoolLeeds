import { getEvents, getSchedules } from './actions';
import { CalendarClient } from './client';
import { PageWrapper } from '@/components/common/PageWrapper';
import { CALENDAR_CONTENT } from '@/content/calendar';

export default async function CalendarPage() {
  const events = await getEvents();
  const schedules = await getSchedules();

  return (
    <PageWrapper
      title={{
        en: CALENDAR_CONTENT.en.pageTitle,
        uk: CALENDAR_CONTENT.uk.pageTitle
      }}
      description={{
        en: CALENDAR_CONTENT.en.pageDescription,
        uk: CALENDAR_CONTENT.uk.pageDescription
      }}
    >
      <CalendarClient initialEvents={events} initialSchedules={schedules} />
    </PageWrapper>
  );
}
