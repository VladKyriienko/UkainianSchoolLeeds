import { getEvents } from './actions';
import { CalendarClient } from './client';
import { PageWrapper } from '@/components/common/PageWrapper';
import { CALENDAR_CONTENT } from '@/content/calendar';

export default async function CalendarPage() {
  const events = await getEvents();

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
      <CalendarClient initialEvents={events} />
    </PageWrapper>
  );
}
