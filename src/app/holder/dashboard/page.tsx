"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { PageLoader } from "@/components/common/PageLoader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch, getToken } from "@/lib/api";
import { sileo } from "sileo";

type StudentUser = {
  id: string;
  name: string;
  email: string;
  enrollment: string;
  walletId: string;
  createdAt: string;
};

type CredentialItem = {
  id: string;
  credentialId: string;
  cid: string;
  type: string;
  title: string | null;
  status: "ACTIVE" | "REVOKED" | "EXPIRED" | "SUSPENDED";
  issuedAt: string;
  expiresAt: string | null;
  issuer: {
    id: string;
    orgName: string;
    domain: string;
  };
};

type MineResponse = {
  success: boolean;
  student?: StudentUser;
  credentials?: CredentialItem[];
  message?: string;
};

export default function HolderDashboardPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<CredentialItem[]>([]);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/login?role=holder");
  }, [router]);

  const loadData = useCallback(async () => {
    const token = getToken();

    if (!token) {
      router.replace("/login?role=holder");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const meRes = await apiFetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });
      const meData = (await meRes.json()) as {
        success: boolean;
        role?: "ISSUER" | "STUDENT";
        message?: string;
      };

      if (!meRes.ok || !meData.success) {
        handleUnauthorized();
        return;
      }

      if (meData.role !== "STUDENT") {
        router.replace("/issuer/dashboard");
        return;
      }

      const mineRes = await apiFetch("/api/credentials/mine", {
        method: "GET",
        cache: "no-store",
      });
      const mineData = (await mineRes.json()) as MineResponse;

      if (!mineRes.ok || !mineData.success || !mineData.student) {
        if (mineRes.status === 401) {
          handleUnauthorized();
          return;
        }

        const message = mineData.message || "Unable to load your credentials.";
        setError(message);
        sileo.error({ title: message });
        return;
      }

      setCredentials(mineData.credentials ?? []);
    } catch (loadError) {
      console.error("Holder dashboard load failed:", loadError);
      setError("Request failed. Please try again.");
      sileo.error({ title: "Request failed. Please try again" });
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function statusClass(status: CredentialItem["status"]) {
    if (status === "ACTIVE") {
      return "bg-brand/20 text-neutral-700";
    }

    if (status === "REVOKED") {
      return "bg-destructive/10 text-destructive";
    }

    if (status === "EXPIRED") {
      return "bg-secondary text-secondary-foreground";
    }

    return "bg-muted text-muted-foreground";
  }

  if (isLoading) {
    return <PageLoader message="Fetching your certificates..." />;
  }

  return (
    <div className="bg-background min-h-screen w-full pt-20">
      <Container>
        <main className="flex w-full flex-col gap-4 py-4 sm:gap-5 sm:py-6 md:gap-6 md:py-8">
          {error ? (
            <Card>
              <CardContent className="pt-1">
                <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
                  {error}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <section className="grid gap-3">
            {credentials.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground py-5 text-sm">
                  No certificates found. Stay tuned till your university issues
                  you some!
                </CardContent>
              </Card>
            ) : (
              credentials.map((credential) => (
                <Card key={credential.id} className="gap-4">
                  <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {credential.title || credential.type}
                      </CardTitle>
                      <CardDescription>{credential.type}</CardDescription>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(credential.status)}`}
                    >
                      {credential.status}
                    </span>
                  </CardHeader>

                  <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground">Issued By</p>
                      <p className="font-medium">{credential.issuer.orgName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issuer Domain</p>
                      <p className="font-medium">{credential.issuer.domain}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issued On</p>
                      <p className="font-medium">
                        {new Date(credential.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium">
                        {credential.expiresAt
                          ? new Date(credential.expiresAt).toLocaleDateString()
                          : "No expiry"}
                      </p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <p className="text-muted-foreground">CID</p>
                      <p className="truncate font-medium">{credential.cid}</p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <Link
                        href={`/verify?cid=${encodeURIComponent(credential.cid)}`}
                        className="text-foreground text-sm font-medium underline underline-offset-4"
                      >
                        Verify this credential
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </section>
        </main>
      </Container>
    </div>
  );
}
