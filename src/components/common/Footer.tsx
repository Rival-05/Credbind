import { Separator } from "@/components/ui/separator";
import { socialLinks } from "@/config/Hero";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { footerConfig } from "@/config/Footer";
import Visitors from "@/components/analytics/Visitors";
import Link from "next/link";
import { Container } from "./Container";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Container>
      <Separator />
      <div className="flex w-full items-center justify-between py-6 text-neutral-500">
        <div className="flex w-full flex-col justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <p className="flex items-center gap-2 text-sm font-medium">
              {footerConfig.copyrightSymbol} {currentYear}
              <Link
                href={`${socialLinks[0].href}`}
                key={`${socialLinks[0].name}`}
                className="underline-offset-3 transition-all duration-300 hover:underline"
              >
                {footerConfig.copyrightName}.
              </Link>
            </p>
            <span className="text-xs">{footerConfig.copyright}</span>
          </div>
          <Visitors />
        </div>
        <div className="flex gap-1">
          {socialLinks.map((link) => (
            <Tooltip key={link.name}>
              <TooltipTrigger>
                <Link
                  href={link.href}
                  key={link.name}
                  className="text-secondary flex items-center gap-2"
                >
                  <span className="size-6">{link.icon}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{link.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </Container>
  );
}
