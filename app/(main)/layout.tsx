"use client";

import { createClient } from "@/utils/supabase/client";
import { fetchUser } from "@/utils/user_management";
import { useRouter } from "next/navigation";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const getUser = async () => {
    const {data: {user}} = await supabase.auth.getUser();
    console.log(user);
    if (user) {
      setLoading(false);
    } else {
      router.replace("/login");
    }
  };
  getUser()
  return <>{loading ? <i className="fa-solid fa-spinner"></i> : children}</>;
}
