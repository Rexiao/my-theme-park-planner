import { createClient } from '@/utils/supabase/server';

export async function getThemeParks() {
  const supabase = createClient();
  const { data, error } = await supabase.from('theme_parks').select('id, name').order('name');

  if (error) {
    console.error('Error fetching theme parks:', error);
    return [];
  }

  return data;
}
