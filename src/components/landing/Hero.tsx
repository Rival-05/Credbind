import Link from "next/link";
import { Playwrite_PE } from "next/font/google";
import { Button } from "@/components/ui/button";
import Github from "../svgs/github";
import Lightbulb from "../svgs/lightbulb";
import ArrowRight from "../svgs/arrowright";

const playwrite = Playwrite_PE({
  weight: ["100", "200", "300", "400"],
});

export function Hero() {
  return (
    <div className="my-10 flex flex-col items-center justify-center gap-6 py-4 text-center">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-700 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-black/10 ring-inset">
        <span className="inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.45)]">
          <Lightbulb className="text-amber-500" />
        </span>
        <span>Why Credbind</span>
      </div>
      <h1 className="max-w-2xl bg-linear-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-3xl tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
        Secure, Verifiable{" "}
        <p className="text-brand">Certificates — Anywhere.</p>
      </h1>
      <p className="text-muted-foreground max-w-2xl text-sm font-light sm:text-base md:text-lg">
        A smarter way to issue and verify certificates — built to streamline
        credentialing, reduce fraud, and make every certificate instantly
        secure.
      </p>
      <div className="flex gap-2">
        <Button
          asChild
          variant="outline"
          className="group text-foreground mt-4 gap-2 px-4 py-2 text-sm tracking-tight sm:text-base"
        >
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="transition-all duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button
          asChild
          variant="default"
          className={`${playwrite.className} group tracking-loose mt-4 gap-2 px-4 py-2 text-sm`}
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
      </div>
    </div>
  );
}
