import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:8888";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Lost & Found",
  description: "The fastest way to build apps with Next.js and Supabase",
  icons: {
    icon: '/app_images/icon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen w-full flex flex-col items-center border-2 border-blue-500">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 border-2 border-blue-500 justify-between w-full relative">
            {/* <div className="flex items-center gap-2 text-lg font-semibold md:text-base "> */}
            <nav className="flex items-center gap-2 text-lg font-semibold md:text-base">
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
              lost & Found
            </nav>
            {/* </div> */}
            <div className="absolute inset-0 flex justify-center items-center">
              <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  All
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Lost
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Found
                </Link>
              </nav>
            </div>
            <form className="flex items-center flex-1 sm:flex-initial justify-between">
              <div className="relative flex-grow mr-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div>
              <nav className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc1</span>
              </nav>
            </form>
          </header>
          <div className="w-3/5 flex-grow overflow-auto border-2 border-red-500">
            {children}
          </div>
        </main>
      </body>
    </html >
  );
}