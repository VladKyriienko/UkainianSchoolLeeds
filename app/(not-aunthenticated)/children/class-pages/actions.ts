'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import type { Tables } from '@/utils/supabase/types';

export type PublicClass = Tables<'classes'>;

export async function getClasses(): Promise<PublicClass[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
  return (data as PublicClass[]) ?? [];
}

export async function getClassById(id: string): Promise<PublicClass | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as PublicClass;
}
