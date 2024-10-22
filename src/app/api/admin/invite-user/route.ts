import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const redirectOrigin = request.headers.get('origin');
  const redirectTo = `${redirectOrigin}/auth/callback`;

  const supabaseAdmin = createSupabaseAdminClient();

  const { error } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
