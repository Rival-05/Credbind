"use client";

import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/common/PageLoader";
import { useAuthDashboardRedirect } from "@/lib/dashboardRedirect";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useAuthDashboardRedirect({
    replace: (href) => router.replace(href),
    unauthenticatedRedirectTo: "/login",
  });

  return <PageLoader message="Taking you to your dashboard..." />;
}
