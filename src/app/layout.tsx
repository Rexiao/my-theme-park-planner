import { createClient } from '@/utils/supabase/server';
import NavBar from '@/components/NavBar';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { isUserAdmin } from '@/utils/auth';

export const metadata = {
  title: 'Disney Trip Planner',
  description: 'Plan your magical Disney trip',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const isAdmin = isUserAdmin(user?.email);

  return (
    <html lang="en">
      <body>
        <NavBar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        <main className="container mx-auto px-4">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
