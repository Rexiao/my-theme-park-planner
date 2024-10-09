import { createClient } from '@/utils/supabase/server'
import NavBar from '@/components/NavBar'
import './globals.css'

export const metadata = {
  title: 'Disney Trip Planner',
  description: 'Plan your magical Disney trip',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body>
        <NavBar isAuthenticated={!!user} />
        <main className="container mx-auto px-4">{children}</main>
      </body>
    </html>
  )
}
