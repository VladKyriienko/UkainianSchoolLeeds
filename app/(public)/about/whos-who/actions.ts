'use server';

import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/types';

export type PublicTeacher = Tables<'teachers'> & {
  photoUrl: string | null;
};

export async function getTeachers(): Promise<PublicTeacher[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching teachers:', error);
    return [];
  }

  return (data || []).map((t) => {
    const photoUrl = t.photo
      ? supabase.storage.from('teachers-photos').getPublicUrl(t.photo).data
          .publicUrl
      : null;
    return { ...t, photoUrl };
  });
}

export async function getTeacherById(
  id: string
): Promise<PublicTeacher | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  const photoUrl = data.photo
    ? supabase.storage.from('teachers-photos').getPublicUrl(data.photo).data
        .publicUrl
    : null;

  return { ...data, photoUrl };
}
