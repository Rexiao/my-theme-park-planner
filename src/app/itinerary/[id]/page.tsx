import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import ItineraryContent from './ItineraryContent';

export default async function ItineraryPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return <ItineraryContent id={params.id} userEmail={data.user.email ?? ''} />;
}
