import type { CalendarEvent } from '@/types/calendar';
import { format, parseISO } from 'date-fns';

/**
 * Generates an iCalendar (.ics) file content from events
 */
export function generateICalendar(events: CalendarEvent[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UkSchool//Events Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:UkSchool Events',
    'X-WR-TIMEZONE:UTC',
    'X-WR-CALDESC:School events calendar',
  ];

  events.forEach((event) => {
    const eventDate = parseISO(event.date);
    const dateStr = format(eventDate, 'yyyyMMdd');
    
    // Parse start and end times
    let dtStart = dateStr;
    let dtEnd = dateStr;
    
    if (event.start_time) {
      const [hours, minutes] = event.start_time.split(':');
      if (hours && minutes) {
        dtStart = `${dateStr}T${hours}${minutes}00`;
      }
    }
    
    if (event.end_time) {
      const [hours, minutes] = event.end_time.split(':');
      if (hours && minutes) {
        dtEnd = `${dateStr}T${hours}${minutes}00`;
      }
    } else if (event.start_time) {
      // If no end time, default to 1 hour after start
      const [hours, minutes] = event.start_time.split(':');
      if (hours && minutes) {
        const endHour = (parseInt(hours, 10) + 1).toString().padStart(2, '0');
        dtEnd = `${dateStr}T${endHour}${minutes}00`;
      }
    }

    // Create unique ID
    const uid = `${event.id}@ukschool.local`;

    // Escape special characters in text fields
    const escapeText = (text: string | null | undefined): string => {
      if (!text) return '';
      return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
    };

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${escapeText(event.title)}`);
    
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeText(event.description)}`);
    }
    
    if (event.location) {
      lines.push(`LOCATION:${escapeText(event.location)}`);
    }
    
    lines.push('STATUS:CONFIRMED');
    lines.push('TRANSP:OPAQUE');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Downloads an iCalendar file
 */
export function downloadICalendar(events: CalendarEvent[], filename = 'ukschool-calendar.ics'): void {
  const icalContent = generateICalendar(events);
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
