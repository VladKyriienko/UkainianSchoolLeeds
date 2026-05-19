/** Shared calendar domain types (public parents calendar + home feed). */

export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  created_at: string;
  title_uk?: string | null;
  description_uk?: string | null;
  location_uk?: string | null;
  kind?: 'event' | 'schedule';
  publicUrl?: string;
};

export type CalendarEventDetail = CalendarEvent & {
  title_uk: string | null;
  description_uk: string | null;
  location_uk: string | null;
  photo: string | null;
  photoUrl: string | null;
};

/** Public list/detail row with resolved event photo URL. */
export type PublicEvent = CalendarEvent & {
  photo: string | null;
  photoUrl: string | null;
};

export type EventsFilter = {
  search?: string;
  startDate?: string;
  endDate?: string;
};

export type CalendarSchedule = {
  id: string;
  date: string;
  file: string;
  publicUrl: string;
};
