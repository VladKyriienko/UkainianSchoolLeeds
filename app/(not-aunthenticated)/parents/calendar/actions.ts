'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { unstable_noStore as noStore } from 'next/cache';

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
    return data as unknown as CalendarEventDetail;
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
