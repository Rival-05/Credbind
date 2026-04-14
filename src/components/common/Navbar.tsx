"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-3 py-2 sm:px-4">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Go to homepage"
        >
          <Image src="/logo.svg" alt="Logo" width={25} height={25} />
          <span className="text-lg font-normal tracking-wide text-black">
            credbind
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {isHome && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-xs tracking-wide text-neutral-900 md:text-sm"
            >
              <Link href="#steps" aria-label="Get Started guide">
                <span className="sm:hidden">Guide</span>
                <span className="hidden sm:inline">Get Started</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
