import { Suspense } from "react";
import { getMetadata } from "@/config/Meta";
import { Metadata } from "next";
import Loginui from "@/components/login/ui";

export const metadata: Metadata = {
  ...getMetadata("/login"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Loginui />
    </Suspense>
  );
}
