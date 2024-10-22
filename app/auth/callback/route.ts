import { createSupabaseServerClient } from "@/app/lib/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // get code from OAuth provider
  const code = searchParams.get("code");

  // next = /dashboard
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createSupabaseServerClient();
    // exchange code with supabase
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-error`);
}
