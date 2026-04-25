import { socialLinks, footerConfig } from "@/config/Footer";
import Visitors from "@/components/analytics/Visitors";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const linkClass =
    "transition-colors duration-400 text-muted-foreground hover:text-foreground";

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-3 py-6 sm:gap-8 sm:px-4 sm:py-8 md:flex-row md:items-start md:justify-between">
      <div className="text-muted-foreground flex min-w-0 flex-col gap-4 sm:gap-5">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2"
          aria-label="Go to homepage"
        >
          <Image
            src="/logo.svg"
            alt="Logo"
            width={25}
            height={25}
            className="shrink-0"
          />
          <span className="text-foreground text-lg font-normal tracking-wide sm:text-2xl">
            credbind
          </span>
        </Link>
        <div className="flex flex-col gap-2 sm:gap-3">
          <p className="flex items-baseline gap-2 text-xs font-medium sm:text-sm">
            <Link
              href={footerConfig.author.href}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {footerConfig.author.name}
            </Link>
            <span className="text-xs">{footerConfig.copyright}</span>
          </p>
          <Visitors />
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 text-xs font-medium sm:gap-3 sm:text-sm md:pt-1">
        <span className="text-foreground text-sm sm:text-base">Contact us</span>
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={linkClass}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
