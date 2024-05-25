import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { createUser, getUser } from "@/lib/user/utils";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.redirect('/');
		}

		const existingUser = await getUser(supabase, user.id as string);
		if (!existingUser) {
			const new_user: User = {
				avatar_url: user.user_metadata.avatar_url as string,
				gmail: user.email as string,
				user_id: user.id as string,
				user_name: user.user_metadata.full_name as string,
			};
			await createUser(supabase, new_user);
		}
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/all`);
}
