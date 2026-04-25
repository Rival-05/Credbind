import { Suspense } from "react";
import { getMetadata } from "@/config/Meta";
import { Metadata } from "next";
import Signupui from "@/components/signup/ui";

export const metadata: Metadata = {
  ...getMetadata("/signup"),
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Signupui />
    </Suspense>
  );
}
