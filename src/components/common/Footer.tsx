import { Separator } from "@/components/ui/separator";
import { socialLinks } from "@/config/Hero";
import { footerConfig } from "@/config/Footer";
import Visitors from "@/components/analytics/Visitors";
import Link from "next/link";
import { Container } from "./Container";
import Image from "next/image";

export default function Footer() {
  const twitterLink =
    socialLinks.find((link) => link.name === "X")?.href ?? "#";
  const mailLink =
    socialLinks.find((link) => link.name === "Email")?.href ??
    "mailto:rivalo3.chat@gmail.com";
  const contactLinkClass =
    "transition-colors duration-400 text-neutral-500 hover:text-neutral-900";

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-5 text-neutral-500">
        <Link
          href="/"
          className="flex items-baseline gap-2"
          aria-label="Go to homepage"
        >
          <Image src="/logo.svg" alt="Logo" width={25} height={25} />
          <span className="text-2xl font-normal tracking-wide text-neutral-900">
            credbind
          </span>
        </Link>
        <div className="flex flex-col">
          <p className="flex items-baseline gap-2 text-sm font-medium">
            <Link href={`${socialLinks[0].href}`} className={contactLinkClass}>
              {footerConfig.copyrightName}
            </Link>
            <span className="text-xs">{footerConfig.copyright}</span>
          </p>
          <Visitors />
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 text-sm font-medium md:pt-1">
        <span className="text-base text-neutral-900">Contact us</span>
        <div className="flex flex-col gap-2">
          <Link
            href={twitterLink}
            target="_blank"
            rel="noopener noreferrer"
            className={contactLinkClass}
          >
            Twitter
          </Link>
          <Link href={mailLink} className={contactLinkClass}>
            Mail
          </Link>
        </div>
      </div>
    </div>
  );
}
