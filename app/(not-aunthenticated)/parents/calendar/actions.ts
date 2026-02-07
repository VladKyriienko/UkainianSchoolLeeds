'use server';

import { createClient } from '@/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';

export type CalendarEvent = {
  id: string;
  title: string;
  description: string | null;
  date: string; // Date in YYYY-MM-DD format
  start_time: string | null; // Time in HH:MM:SS format
  end_time: string | null; // Time in HH:MM:SS format
  location: string | null;
  created_at: string;
};

export type EventsFilter = {
  search?: string;
  startDate?: string;
  endDate?: string;
};

export async function getEvents(filter: EventsFilter = {}): Promise<CalendarEvent[]> {
  noStore();

  const supabase = await createClient();
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

  return data || [];
}
