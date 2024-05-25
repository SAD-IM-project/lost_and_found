"use client";

import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user);
    if (user) {
      setLoading(false);
    } else {
      router.replace("/login");
    }
  };
  getUser();
  return (
    <>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader className="animate-spin size-10" />
        </div>
      ) : (
        children
      )}
    </>
  );
}
