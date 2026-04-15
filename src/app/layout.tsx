import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/common/Navbar";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sileo";
import { TooltipProvider } from "@/components/ui/tooltip";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://credbind.vercel.app"),
  title: "credbind",
  description:
    "Issue and verify credentials in seconds. credbind offers decentralized credential management with instant authenticity checks.",
  icons: {
    icon: [{ url: "/favicon.png", sizes: "16x16", type: "image/png" }],
  },
  openGraph: {
    title: "credbind",
    description:
      "Issue and verify credentials in seconds. credbind offers decentralized credential management with instant authenticity checks.",
    url: "https://credbind.vercel.app",
    siteName: "credbind",
    images: [
      {
        url: "/credbind.png",
        width: 1200,
        height: 630,
        alt: "CredBind Preview",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "credbind",
    description:
      "Issue and verify credentials in seconds. credbind offers decentralized credential management with instant authenticity checks.",
    images: ["/credbind.png"],
    creator: "@Rival_o5",
  },
};

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
        <Toaster position="top-right" theme="light" />
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
