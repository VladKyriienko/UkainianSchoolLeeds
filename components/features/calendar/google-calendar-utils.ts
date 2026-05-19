import type { CalendarEvent } from '@/types/calendar';
import { format, parseISO } from 'date-fns';

/**
 * Generates a Google Calendar URL for adding an event
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const eventDate = parseISO(event.date);
  const dateStr = format(eventDate, 'yyyyMMdd');
  
  // Parse start and end times
  let startDateTime = `${dateStr}`;
  let endDateTime = `${dateStr}`;
  
  if (event.start_time) {
    const [hours, minutes] = event.start_time.split(':');
    if (hours && minutes) {
      startDateTime = `${dateStr}T${hours}${minutes}00`;
    }
  }
  
  if (event.end_time) {
    const [hours, minutes] = event.end_time.split(':');
    if (hours && minutes) {
      endDateTime = `${dateStr}T${hours}${minutes}00`;
    }
  } else if (event.start_time) {
    // If no end time, default to 1 hour after start
    const [hours, minutes] = event.start_time.split(':');
    if (hours && minutes) {
      const endHour = (parseInt(hours, 10) + 1).toString().padStart(2, '0');
      endDateTime = `${dateStr}T${endHour}${minutes}00`;
    }
  }

  // Build URL parameters
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDateTime}/${endDateTime}`,
  });

  if (event.description) {
    params.append('details', event.description);
  }

  if (event.location) {
    params.append('location', event.location);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Opens Google Calendar to add multiple events
 */
export function addEventsToGoogleCalendar(events: CalendarEvent[]): void {
  if (events.length === 0) {
    return;
  }

  // If there are many events, confirm with the user
  if (events.length > 10) {
    const confirmed = window.confirm(
      `This will open ${events.length} tabs to add events to Google Calendar. Continue?`
    );
    if (!confirmed) {
      return;
    }
  }

  // Open each event in a new tab
  events.forEach((event, index) => {
    const url = generateGoogleCalendarUrl(event);
    
    // Add a small delay between opening tabs to avoid browser blocking
    setTimeout(() => {
      window.open(url, '_blank');
    }, index * 100);
  });
}
