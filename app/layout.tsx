import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Link from "next/link";
import { Package2, Search, CircleUser, CirclePlus, Bell, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchForm } from "@/components/ui/searchForm";
import { Button } from "@/components/ui/button";
import { Filter } from "@/components/ui/filter";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/all`
  : "http://localhost:8888/all";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Lost & Found",
  description: "The fastest way to build apps with Next.js and Supabase",
  icons: {
    icon: '/app_images/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen w-full flex flex-col items-center h-full">
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
                <span className="text-base whitespace-nowrap">Lost & Found</span> {/* Add whitespace-nowrap here */}
              </Link>
            </nav>
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 pointer-events-auto">
                <Link
                  href="/all"
                  className="text-muted-foreground text-base transition-colors hover:text-foreground cursor-pointer"
                >
                  All
                </Link>
                <Link
                  href="/lost"
                  className="text-muted-foreground text-base transition-colors hover:text-foreground cursor-pointer"
                >
                  Lost
                </Link>
                <Link
                  href="/found"
                  className="text-muted-foreground text-base transition-colors hover:text-foreground cursor-pointer"
                >
                  Found
                </Link>
              </nav>
            </div>
            <div className="flex items-center flex-1 sm:flex-initial justify-between">
              <SearchForm />
              <nav className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <Link
                  href="profile"
                  className="flex items-center gap-2 text-muted-foreground text-base transition-colors hover:text-foreground cursor-pointer"
                  style={{ zIndex: 10 }} // Ensuring it is on top
                >
                  <CircleUser className="h-7 w-7" />
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
              <Link href="/message">
                <Button variant="ghost" size="icon">
                  <Mail className="h-7 w-7" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
