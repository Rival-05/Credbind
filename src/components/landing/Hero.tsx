import Link from "next/link";

import { Button } from "@/components/ui/button";
import Github from "../svgs/github";
import Lightbulb from "../svgs/lightbulb";
export function Hero() {
  return (
    <div className="my-12 flex flex-col items-center justify-center gap-6 py-8 text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-700 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-black/10 ring-inset">
        <span className="inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.45)]">
          <Lightbulb className="text-amber-500" />
        </span>
        <span>Why Credbind</span>
      </div>
      <h1 className="max-w-3xl bg-linear-to-b from-neutral-900 via-neutral-700 to-neutral-600 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
        Secure, Verifiable Certificates — Anywhere.
      </h1>
      <p className="text-muted-foreground max-w-2xl text-sm font-light sm:text-base md:text-lg">
        A smarter way to issue and check certificates — simple, and trusted.
      </p>
      <div className="flex gap-2">
        <Button
          asChild
          variant="default"
          className="group mt-4 gap-2 px-4 py-2 text-sm tracking-tight sm:text-base"
        >
          <Link
            href="https://github.com/Rival-05/Decentracert"
            target="_blank"
            rel="noreferrer"
          >
            <Github />
            Contribute !
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="group mt-4 gap-2 px-4 py-2 text-sm tracking-tight sm:text-base"
        >
          <Link href="/login">
            Go to Dashboard
            <svg
              width="16"
              height="16"
              fill="none"
              className="transition-all duration-300 group-hover:pl-1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity=".8"
                strokeWidth="1.25"
                d="M8 4.75 11.25 8m0 0L8 11.25M11.25 8h-6.5"
              />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
}
