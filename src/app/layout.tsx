import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/common/Navbar";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sileo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://decentracert.vercel.app"),
  title: "Decentracert",
  description:
    "Issue and verify certificates in seconds. Decentracert offers secure, decentralized credential management with instant authenticity checks.",
  icons: {
    icon: [{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }],
  },
  openGraph: {
    title: "Decentracert",
    description:
      "Issue and verify certificates in seconds. Decentracert offers secure, decentralized credential management with instant authenticity checks.",
    url: "https://decentracert.vercel.app",
    siteName: "Decentracert",
    images: [
      {
        url: "opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Decentracert Preview",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Decentracert",
    description:
      "Issue and verify certificates in seconds. Decentracert offers secure, decentralized credential management with instant authenticity checks.",
    images: ["opengraph-image.png"],
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
