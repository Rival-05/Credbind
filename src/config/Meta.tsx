import type { Metadata } from "next";

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  noIndex?: boolean;
}

export const siteConfig = {
  name: "credbind",
  title: "CredBind",
  description:
    "Issue and verify credentials in seconds with decentralized credential management and instant authenticity checks.",
  url: process.env.NEXT_PUBLIC_URL || "https://credbind.vercel.app",
  ogImage: "/credbind.png",
  author: {
    name: "Rajat Tripathi",
    twitter: "@Rival_o5",
    github: "RajatTripathi",
    email: "rivalo3.chat@gmail.com",
  },
  keywords: [
    "credbind",
    "decentralized credentials",
    "verifiable credentials",
    "credential verification",
    "academic credentials",
    "web3 identity",
  ],
};

export const pageMetadata: Record<string, PageMeta> = {
  "/": {
    title: "credbind",
    description:
      "Create and verify decentralized credentials in seconds with secure, tamper-evident authenticity checks.",
    keywords: [
      "issue credentials",
      "verify credentials",
      "decentralized identity",
      "digital credentials",
      "credential authenticity",
    ],
    ogImage: "/credbind.png",
    twitterCard: "summary_large_image",
  },
  "/login": {
    title: "Login | CredBind",
    description:
      "Sign in to CredBind as a holder or issuer to manage and verify verifiable credentials.",
    keywords: [
      "credbind login",
      "holder login",
      "issuer login",
      "credential platform sign in",
    ],
    ogImage: "/credbind.png",
    twitterCard: "summary",
  },
  "/signup": {
    title: "Sign Up | CredBind",
    description:
      "Create your CredBind account to issue or receive decentralized credentials securely.",
    keywords: [
      "credbind signup",
      "create credential account",
      "issuer signup",
      "holder signup",
    ],
    ogImage: "/credbind.png",
    twitterCard: "summary",
  },
  "/docs": {
    title: "Docs | CredBind",
    description:
      "Learn how CredBind issuers publish credentials, how holders prove ownership, and how third parties verify records anchored to IPFS.",
    keywords: [
      "credbind docs",
      "credential issuance flow",
      "credential verification guide",
      "issuer holder verifier",
    ],
    ogImage: "/credbind.png",
    twitterCard: "summary_large_image",
  },
  "/404": {
    title: "Page Not Found | CredBind",
    description: "The page you are looking for does not exist on CredBind.",
    keywords: ["404", "page not found", "credbind"],
    ogImage: "/credbind.png",
    twitterCard: "summary",
    noIndex: true,
  },
};

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function getPageMetadata(pathname: string): PageMeta {
  const normalizedPath = normalizePath(pathname);
  return pageMetadata[normalizedPath] || pageMetadata["/"];
}

export function getMetadata(pathname: string): Metadata {
  const normalizedPath = normalizePath(pathname);
  const pageMeta = getPageMetadata(normalizedPath);
  const ogImage = pageMeta.ogImage || siteConfig.ogImage;
  const canonical = new URL(normalizedPath, siteConfig.url).toString();
  const isIndexable = !pageMeta.noIndex;

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageMeta.title,
    description: pageMeta.description,
    keywords: pageMeta.keywords || siteConfig.keywords,
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    icons: {
      icon: [{ url: "/favicon.png", sizes: "16x16", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: pageMeta.title,
      description: pageMeta.description,
      siteName: siteConfig.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: pageMeta.title,
        },
      ],
      locale: "en-US",
    },
    twitter: {
      card: pageMeta.twitterCard || "summary_large_image",
      title: pageMeta.title,
      description: pageMeta.description,
      creator: siteConfig.author.twitter,
      images: [ogImage],
    },
    robots: {
      index: isIndexable,
      follow: isIndexable,
      googleBot: {
        index: isIndexable,
        follow: isIndexable,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical,
    },
  };
}
