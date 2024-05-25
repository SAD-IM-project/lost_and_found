"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FilterNav() {
  const path = usePathname();
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 pointer-events-auto">
      <Link
        href="/all"
        className={`text-muted-foreground text-base transition-colors hover:text-foreground cursor-pointer ${path==="/all" ? " text-blue-500" : ""}`}
      >
        All
      </Link>
      <Link
        href="/lost"
        className={`text-muted-foreground text-base transition-colors hover:text-foreground cursor-pointer ${path==="/lost" ? " text-blue-500" : ""}`}
      >
        Lost
      </Link>
      <Link
        href="/found"
        className={`text-muted-foreground text-base transition-colors hover:text-foreground cursor-pointer ${path==="/found" ? " text-blue-500" : ""}`}
      >
        Found
      </Link>
    </nav>
  );
}
