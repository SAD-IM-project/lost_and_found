import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const handleSignInWithGoogle = async () => {
    "use server";

    const origin = headers().get("origin");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
    return redirect(data.url);
  };

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      return redirect("/login?message=Could not authenticate user");
    }
    console.log(user.user_metadata);
    let api =
      "/api/user/create?" +
      `user_id=${user.id}&user_name=${user.user_metadata.full_name}&gmail=${user.email}&avatar_url=${user.user_metadata.avatar_url}`;
    const data = await fetch(api, { method: "POST" });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/protected");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="flex-1 flex flex-col w-full h-full px-8 justify-center items-center gap-2">
      <Card className="">
        <CardHeader>
          <CardTitle>歡迎來到 Lost & Found 肉絲飯</CardTitle>
        </CardHeader>
        <CardContent>
          <p>歡迎使用 [平台名稱]，讓我們幫助您找回遺失的物品。</p>
        </CardContent>
        <CardContent>
          <form className="flex w-full justify-center">
            <SubmitButton
              formAction={handleSignInWithGoogle}
              className="w-full rounded-md px-4 py-2 mb-2"
              pendingText="Signing In..."
            >
              Google sign in
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
