import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ItinerariesList from './ItinerariesList'

export default async function ItinerariesPage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <ItinerariesList userEmail={data.user.email} />
}