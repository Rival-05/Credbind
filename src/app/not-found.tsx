import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { getMetadata } from "@/config/Meta";

export const metadata: Metadata = getMetadata("/404");

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        <div className="relative mx-auto w-full max-w-60 md:max-w-75">
          <div
            aria-hidden="true"
            className="absolute inset-x-2 bottom-8 h-80 rounded-full bg-sky-400/30 blur-3xl"
          />
          <Image
            src="/sadness.png"
            alt="Sad character"
            width={260}
            height={260}
            priority
            className="relative z-10 h-auto w-full object-contain"
          />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-muted-foreground text-3xl leading-tight font-semibold sm:text-4xl">
            Awww... Don&apos;t Cry.
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            It&apos;s just a 404 Error!
          </p>
          <p className="text-muted-foreground mt-3 text-base leading-7">
            We are trying our best to fix.
          </p>

          <Button asChild variant="outline" className="mt-8">
            <Link href="/">Head back to home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
