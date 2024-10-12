import React from 'react';
import { getThemeParks } from './page.server';
import CreateItineraryForm from './CreateItineraryForm';

export default async function CreateItineraryPage() {
  const themeParks = await getThemeParks();

  return <CreateItineraryForm themeParks={themeParks} />;
}
