import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/common/Navbar";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sileo";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getMetadata } from "@/config/Meta";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = getMetadata("/");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.className, "font-sans", inter.variable)}
      data-scroll-behavior="smooth"
    >
      <body>
        <Navbar />
        <Toaster position="top-center" theme="light" />
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
