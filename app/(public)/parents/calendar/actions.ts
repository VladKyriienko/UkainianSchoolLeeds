'use server';

import { format, startOfToday } from 'date-fns';
import { createAdminClient } from '@/lib/supabase/admin';
import { unstable_noStore as noStore } from 'next/cache';
import type {
  CalendarEvent,
  CalendarEventDetail,
  CalendarSchedule,
  EventsFilter,
  PublicEvent
} from '@/types/calendar';

export type {
  CalendarEvent,
  CalendarEventDetail,
  CalendarSchedule,
  EventsFilter,
  PublicEvent
} from '@/types/calendar';

function withEventPhotoUrl(
  supabase: ReturnType<typeof createAdminClient>,
  row: CalendarEvent & { photo?: string | null }
): PublicEvent {
  const photo = row.photo ?? null;
  const photoUrl = photo
    ? supabase.storage.from('events-photos').getPublicUrl(photo).data.publicUrl
    : null;
  return { ...row, photo, photoUrl };
}

/** Upcoming events from today onward (soonest first), for home page. */
export async function getUpcomingPublicEvents(limit = 3): Promise<PublicEvent[]> {
  noStore();

  try {
    const supabase = createAdminClient();
    const todayStart = `${format(startOfToday(), 'yyyy-MM-dd')}T00:00:00.000Z`;

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', todayStart)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming public events:', error);
      return [];
    }

    return ((data as (CalendarEvent & { photo?: string | null })[]) ?? []).map(
      (row) => withEventPhotoUrl(supabase, row)
    );
  } catch (err) {
    console.error('Error fetching upcoming public events:', err);
    return [];
  }
}

export async function getEvents(filter: EventsFilter = {}): Promise<CalendarEvent[]> {
  noStore();

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    // Apply date range filter
    if (filter.startDate) {
      query = query.gte('date', filter.startDate);
    }
    if (filter.endDate) {
      query = query.lte('date', filter.endDate);
    }

    // Apply search filter
    if (filter.search && filter.search.trim()) {
      query = query.or(
        `title.ilike.%${filter.search}%,description.ilike.%${filter.search}%,location.ilike.%${filter.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return (data as CalendarEvent[]) || [];
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
}

export async function getEventById(id: string): Promise<CalendarEventDetail | null> {
  noStore();
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    const photo = data.photo as string | null;
    const photoUrl = photo
      ? supabase.storage.from('events-photos').getPublicUrl(photo).data.publicUrl
      : null;

    return {
      ...(data as unknown as CalendarEventDetail),
      photo,
      photoUrl
    };
  } catch (err) {
    console.error('Error fetching event:', err);
    return null;
  }
}

export async function getSchedules(): Promise<CalendarSchedule[]> {
  noStore();
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .order('date', { ascending: true });

    if (error || !data) return [];

    return data.map((item) => ({
      id: item.id as string,
      date: item.date as string,
      file: item.file as string,
      publicUrl: supabase.storage
        .from('schedule-files')
        .getPublicUrl(item.file as string).data.publicUrl
    }));
  } catch (err) {
    console.error('Error fetching schedule:', err);
    return [];
  }
}
