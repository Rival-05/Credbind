"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/common/Container";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { sileo } from "sileo";

type VerifyResult = {
  success: boolean;
  found?: boolean;
  summary?: {
    trustworthy: boolean;
    message: string;
  };
  credential?: {
    credentialId: string;
    cid: string;
    type: string;
    title: string | null;
    issuedAt: string;
    expiresAt: string | null;
    status: string;
  };
  issuer?: {
    orgName: string;
    domain: string;
    approved: boolean;
  };
  holder?: {
    name: string;
    enrollment: string;
    walletId: string;
  };
  checks?: {
    existsInRegistry: boolean;
    existsOnIPFS: boolean;
    integrityPassed: boolean;
    issuerApproved: boolean;
    revoked: boolean;
    suspended: boolean;
    expired: boolean;
    active: boolean;
  };
  academic?: {
    program?: string | null;
    department?: string | null;
    cgpa?: string | null;
    graduationYear?: string | null;
  } | null;
  message?: string;
};

export default function Verifyui() {
  const searchParams = useSearchParams();

  const [cid, setCid] = useState(searchParams.get("cid") ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const lookupLabel = useMemo(() => {
    if (!result?.summary) {
      return "Not checked";
    }

    return result.summary.trustworthy ? "Verified" : "Flagged";
  }, [result]);

  const lookupTone = useMemo(() => {
    if (!result?.summary) {
      return "bg-secondary text-secondary-foreground";
    }

    return result.summary.trustworthy
      ? "bg-brand/20 text-neutral-700"
      : "bg-destructive/10 text-destructive";
  }, [result]);

  const runVerify = useCallback(async (inputCid: string) => {
    const normalizedCid = inputCid.trim();

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/verify/${encodeURIComponent(normalizedCid)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = (await res.json()) as VerifyResult;

      if (!res.ok || !data.success) {
        setResult(null);
        const message = data.message || "Verification failed.";
        setError(message);
        sileo.error({ title: message });
        return;
      }

      setResult(data);
      if (data.summary?.trustworthy) {
        sileo.success({ title: "Credential verified successfully" });
      } else {
        sileo.error({
          title: data.summary?.message || "Credential has verification issues",
        });
      }
    } catch (verifyError) {
      console.error("Verification request failed:", verifyError);
      setResult(null);
      const message = "Unable to complete verification right now.";
      setError(message);
      sileo.error({ title: message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialCid = searchParams.get("cid");
    if (initialCid) {
      setCid(initialCid);
      runVerify(initialCid);
    }
  }, [runVerify, searchParams]);

  function checkClass(passed: boolean) {
    return passed
      ? "bg-brand/20 text-neutral-700"
      : "bg-destructive/10 text-destructive";
  }

  return (
    <div className="bg-background min-h-screen w-full pt-20">
      <Container>
        <main className="flex w-full flex-col gap-4 py-4 sm:gap-5 sm:py-6 md:gap-6 md:py-8">
          <Card>
            <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  Credential Verification
                </CardTitle>
                <CardDescription>
                  Validate credential trust by checking registry presence, IPFS
                  payload integrity, issuer approval, and lifecycle status.
                </CardDescription>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${lookupTone}`}
              >
                {lookupLabel}
              </span>
            </CardHeader>
            <CardContent className="grid gap-3">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  runVerify(cid);
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Input
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  placeholder="Enter credential CID"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer sm:w-44"
                >
                  {isLoading ? <Spinner className="mr-2" /> : null}
                  {isLoading ? "Verifying..." : "Verify Credential"}
                </Button>
              </form>

              {error ? (
                <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
                  {error}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {result?.found ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Trust Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Credential ID</p>
                    <p className="font-medium">
                      {result.credential?.credentialId ?? "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">
                      {result.credential?.type ?? "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {result.credential?.status ?? "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Issued On</p>
                    <p className="font-medium">
                      {result.credential?.issuedAt
                        ? new Date(
                            result.credential.issuedAt,
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3 sm:col-span-2 lg:col-span-4">
                    <p className="text-muted-foreground">CID</p>
                    <p className="truncate font-medium">
                      {result.credential?.cid ?? "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Issuer & Holder</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Issuer</p>
                    <p className="font-medium">
                      {result.issuer?.orgName ?? "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Issuer Domain</p>
                    <p className="font-medium">
                      {result.issuer?.domain ?? "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Issuer Approved</p>
                    <p className="font-medium">
                      {result.issuer?.approved ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Holder Name</p>
                    <p className="font-medium">{result.holder?.name ?? "-"}</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Enrollment</p>
                    <p className="font-medium">
                      {result.holder?.enrollment ?? "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Wallet ID</p>
                    <p className="truncate font-medium">
                      {result.holder?.walletId ?? "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Verification Checks</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div
                    className={`rounded-md border p-3 ${checkClass(Boolean(result.checks?.existsInRegistry))}`}
                  >
                    Registry record
                  </div>
                  <div
                    className={`rounded-md border p-3 ${checkClass(Boolean(result.checks?.existsOnIPFS))}`}
                  >
                    IPFS payload available
                  </div>
                  <div
                    className={`rounded-md border p-3 ${checkClass(Boolean(result.checks?.integrityPassed))}`}
                  >
                    Integrity hash match
                  </div>
                  <div
                    className={`rounded-md border p-3 ${checkClass(Boolean(result.checks?.issuerApproved))}`}
                  >
                    Issuer approved
                  </div>
                  <div
                    className={`rounded-md border p-3 ${checkClass(Boolean(result.checks?.active))}`}
                  >
                    Active lifecycle state
                  </div>
                  <div
                    className={`rounded-md border p-3 ${checkClass(!Boolean(result.checks?.revoked))}`}
                  >
                    Not revoked
                  </div>
                  <div
                    className={`rounded-md border p-3 ${checkClass(!Boolean(result.checks?.suspended))}`}
                  >
                    Not suspended
                  </div>
                  <div
                    className={`rounded-md border p-3 ${checkClass(!Boolean(result.checks?.expired))}`}
                  >
                    Not expired
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Academic Payload</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Program</p>
                    <p className="font-medium">
                      {result.academic?.program || "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Department</p>
                    <p className="font-medium">
                      {result.academic?.department || "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">CGPA</p>
                    <p className="font-medium">
                      {result.academic?.cgpa || "-"}
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-lg border p-3">
                    <p className="text-muted-foreground">Graduation Year</p>
                    <p className="font-medium">
                      {result.academic?.graduationYear || "-"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}

          <Footer />
        </main>
      </Container>
    </div>
  );
}
