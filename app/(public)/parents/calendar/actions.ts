'use server';

import { format, startOfToday } from 'date-fns';
import { unstable_cache, unstable_noStore as noStore } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPublicStorageUrl } from '@/lib/supabase/public-storage-url';
import type {
  CalendarEvent,
  CalendarEventDetail,
  CalendarSchedule,
  EventsFilter,
  PublicEvent
} from '@/types/calendar';
import {
  EVENT_LIST_COLUMNS,
  SCHEDULE_LIST_COLUMNS
} from '@/lib/supabase/columns';

const EVENTS_PHOTOS_BUCKET = 'events-photos';
const PUBLIC_EVENTS_REVALIDATE_SECONDS = 300;

function withEventPhotoUrl(
  row: CalendarEvent & { photo?: string | null }
): PublicEvent {
  const photo = row.photo ?? null;
  const photoUrl = photo
    ? getPublicStorageUrl(EVENTS_PHOTOS_BUCKET, photo)
    : null;
  return { ...row, photo, photoUrl };
}

async function fetchUpcomingPublicEvents(
  limit: number
): Promise<PublicEvent[]> {
  const supabase = createAdminClient();
  const todayStart = `${format(startOfToday(), 'yyyy-MM-dd')}T00:00:00.000Z`;

  const { data, error } = await supabase
    .from('events')
    .select(EVENT_LIST_COLUMNS)
    .gte('date', todayStart)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching upcoming public events:', error);
    return [];
  }

  return ((data as (CalendarEvent & { photo?: string | null })[]) ?? []).map(
    withEventPhotoUrl
  );
}

function getUpcomingPublicEventsCached(limit: number) {
  return unstable_cache(
    () => fetchUpcomingPublicEvents(limit),
    ['upcoming-public-events', String(limit)],
    {
      revalidate: PUBLIC_EVENTS_REVALIDATE_SECONDS,
      tags: ['events', 'public-home']
    }
  )();
}

/** Cached upcoming events for the home page (revalidates every 5 min). */
export async function getCachedUpcomingPublicEvents(
  limit = 3
): Promise<PublicEvent[]> {
  return getUpcomingPublicEventsCached(limit);
}

/** Upcoming events — always fresh (calendar views). */
export async function getUpcomingPublicEvents(
  limit = 3
): Promise<PublicEvent[]> {
  noStore();

  try {
    return await fetchUpcomingPublicEvents(limit);
  } catch (err) {
    console.error('Error fetching upcoming public events:', err);
    return [];
  }
}

export async function getEvents(
  filter: EventsFilter = {}
): Promise<CalendarEvent[]> {
  noStore();

  try {
    const supabase = createAdminClient();
    let query = supabase
      .from('events')
      .select(EVENT_LIST_COLUMNS)
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

export async function getEventById(
  id: string
): Promise<CalendarEventDetail | null> {
  noStore();
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('events')
      .select(EVENT_LIST_COLUMNS)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    const photo = data.photo as string | null;
    const photoUrl = photo
      ? getPublicStorageUrl(EVENTS_PHOTOS_BUCKET, photo)
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
      .select(SCHEDULE_LIST_COLUMNS)
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
