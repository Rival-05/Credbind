"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/common/ProfileMenu";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          aria-label="Go to homepage"
        >
          <Image src="/logo.svg" alt="Logo" width={25} height={25} />
          <span className="text-foreground text-base font-normal tracking-wide sm:text-lg">
            credbind
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isHome && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-xs tracking-wide sm:text-sm"
            >
              <Link href="/docs" aria-label="Get Started guide">
                <span className="sm:hidden">Guide</span>
                <span className="hidden sm:inline">Get Started</span>
              </Link>
            </Button>
          )}
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
