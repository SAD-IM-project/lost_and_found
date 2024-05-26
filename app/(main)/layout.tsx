"use client";

import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import {
  Package2,
  Search,
  CircleUser,
  CirclePlus,
  Bell,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchForm } from "@/components/ui/searchForm";
import { Button } from "@/components/ui/button";
import { Filter } from "@/components/ui/filter";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import FilterNav from "@/components/FilterNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>({});
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    } else {
      router.replace("/");
    }
  };

  if (loading){
    getUser();
  }

  React.useEffect(() => {
    if (user.user_metadata) {
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Loader className="animate-spin size-10" />
        </div>
      ) : (
        <>
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between w-full bg-white z-50">
            <nav className="flex items-center gap-2 text-lg font-semibold md:text-base">
              <Link
                href="/all"
                className="flex items-center gap-2 text-muted-foreground text-base transition-colors hover:text-foreground cursor-pointer"
                style={{ zIndex: 10 }} // Ensuring it is on top
              >
                <div className="relative w-10 h-10 bg-muted">
                  <Image
                    src="/app_images/icon.png"
                    alt="Lost & Found"
                    layout="fill"
                    className="rounded-md object-cover"
                  />
                </div>
                <span className="text-base whitespace-nowrap">
                  Lost & Found
                </span>{" "}
                {/* Add whitespace-nowrap here */}
              </Link>
            </nav>
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <FilterNav />
            </div>
            <div className="flex items-center flex-1 sm:flex-initial justify-between">
              <SearchForm />
              <nav className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-muted-foreground text-base transition-colors hover:text-foreground cursor-pointer"
                  style={{ zIndex: 10 }} // Ensuring it is on top
                >
                  {user? (
                    <div className="relative w-7 h-7 rounded-full bg-muted">
                      <img
                        src={user.user_metadata.picture}
                        alt="User"
                        className="rounded-full object-fill"
                      />
                    </div>
                  ) : (
                    <CircleUser className="h-7 w-7" />
                  )}
                </Link>
              </nav>
            </div>
          </header>
          <div className="w-full flex flex-row relative h-full">
            <div className="w-96 sticky top-16 overflow-auto space-y-2 py-4 px-4 h-[calc(100vh-4rem)]">
              <Filter />
            </div>
            <div className="flex-grow overflow-auto h-[calc(100vh-4rem)]">
              {children}
            </div>
            <div className="w-20 sticky top-16 overflow-auto flex flex-col items-center py-4 gap-3 h-[calc(100vh-4rem)]">
              <Link href="/create">
                <Button variant="ghost" size="icon">
                  <CirclePlus className="h-7 w-7" />
                </Button>
              </Link>
              <Link href="/notification">
                <Button variant="ghost" size="icon">
                  <Bell className="h-7 w-7" />
                </Button>
              </Link>
              <Link href="/MyChat">
                <Button variant="ghost" size="icon">
                  <Mail className="h-7 w-7" />
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
