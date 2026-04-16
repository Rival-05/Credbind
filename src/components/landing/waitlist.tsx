import Link from "next/link";
import ArrowRight from "../svgs/arrowright";

export function Waitlist() {
  return (
    <div id="steps" className="my-10 py-12 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl">
        <span className="text-foreground block">
          Launch your wallet with secure
        </span>
        <span className="text-muted-foreground block">
          issuance and instant verification—all in one platform.
        </span>
      </h2>

      <div className="mt-10 flex w-full flex-col items-center gap-2 px-4">
        <p className="text-muted-foreground text-sm">
          University not already approved.
        </p>

        <Link
          href="/signup?role=issuer"
          className="bg-background text-muted-foreground border-border flex w-full max-w-xl items-center justify-between rounded-lg border px-5 py-4 text-left text-sm font-medium shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:px-6"
        >
          <span className="flex items-center gap-3">
            Signup to Join the waitlist
          </span>
          <ArrowRight className="shrink-0 transition-all duration-200" />
        </Link>
      </div>
    </div>
  );
}
