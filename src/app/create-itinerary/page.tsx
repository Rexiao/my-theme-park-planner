import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getThemeParks } from './page.server';
import CreateItineraryForm from './CreateItineraryForm';

export default async function CreateItineraryPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  const themeParks = await getThemeParks();

  return <CreateItineraryForm themeParks={themeParks} />;
}
