"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { PageLoader } from "@/components/common/PageLoader";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch, getToken } from "@/lib/api";
import ArrowClockwise from "@/components/svgs/arrowclockwise";
import CaretDown from "@/components/svgs/caretdown";
import { sileo } from "sileo";

type IssuerUser = {
  id: string;
  orgName: string;
  email: string;
  domain: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

type MeResponse = {
  success: boolean;
  role?: "ISSUER" | "STUDENT";
  user?: IssuerUser;
  message?: string;
};

type IssueForm = {
  walletId: string;
  type: string;
  title: string;
  program: string;
  department: string;
  cgpa: string;
  graduationYear: string;
  expiresAt: string;
  additionalRemarks: string;
};

type IssuedCredential = {
  id: string;
  credentialId: string;
  cid: string;
  type: string;
  title: string | null;
  status: string;
  issuedAt: string;
};

type IssueResponse = {
  success: boolean;
  message?: string;
  credential?: IssuedCredential;
};

const initialForm: IssueForm = {
  walletId: "",
  type: "",
  title: "",
  program: "",
  department: "",
  cgpa: "",
  graduationYear: "",
  expiresAt: "",
  additionalRemarks: "",
};

const CREDENTIAL_TYPES = [
  "Degree",
  "Transcript",
  "Course Completion",
  "Internship Certificate",
  "Merit Certificate",
  "Diploma",
];

export default function IssuerDashboardPage() {
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [issuer, setIssuer] = useState<IssuerUser | null>(null);
  const [form, setForm] = useState<IssueForm>(initialForm);
  const [issuedResult, setIssuedResult] = useState<IssuedCredential | null>(
    null,
  );
  const [typeOpen, setTypeOpen] = useState(false);

  const isApproved = issuer?.status === "APPROVED";

  const statusTone = useMemo(() => {
    if (!issuer) {
      return "bg-secondary text-secondary-foreground";
    }

    if (issuer.status === "APPROVED") {
      return "bg-brand/20 text-neutral-700";
    }

    if (issuer.status === "REJECTED") {
      return "bg-destructive/10 text-destructive";
    }

    return "bg-secondary text-secondary-foreground";
  }, [issuer]);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/login?role=issuer");
  }, [router]);

  const loadIssuer = useCallback(
    async (showSpinner = false) => {
      const token = getToken();

      if (!token) {
        router.replace("/login?role=issuer");
        return;
      }

      try {
        if (showSpinner) {
          setIsRefreshing(true);
        } else {
          setIsPageLoading(true);
        }

        const res = await apiFetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await res.json()) as MeResponse;

        if (!res.ok || !data.success || !data.user) {
          handleUnauthorized();
          return;
        }

        if (data.role !== "ISSUER") {
          router.replace("/holder/dashboard");
          return;
        }

        setIssuer(data.user);
      } catch (error) {
        console.error("Issuer dashboard auth check failed:", error);
        sileo.error({ title: "Could not load issuer profile" });
        handleUnauthorized();
      } finally {
        setIsPageLoading(false);
        setIsRefreshing(false);
      }
    },
    [handleUnauthorized, router],
  );

  useEffect(() => {
    loadIssuer();
  }, [loadIssuer]);

  function updateForm<K extends keyof IssueForm>(key: K, value: IssueForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleIssueSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIssuedResult(null);

    if (
      !form.walletId.trim() ||
      !form.type.trim() ||
      !form.title.trim() ||
      !form.program.trim() ||
      !form.department.trim() ||
      !form.cgpa.trim() ||
      !form.graduationYear.trim()
    ) {
      sileo.error({ title: "Fill all mandatory fields" });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        walletId: form.walletId.trim(),
        type: form.type.trim(),
        title: form.title.trim(),
        program: form.program.trim(),
        department: form.department.trim(),
        cgpa: form.cgpa.trim(),
        graduationYear: form.graduationYear.trim(),
      };

      if (form.additionalRemarks.trim())
        payload.additionalRemarks = form.additionalRemarks.trim();
      if (form.expiresAt) payload.expiresAt = form.expiresAt;

      const res = await apiFetch("/api/credentials/issue", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as IssueResponse;

      if (!res.ok || !data.success || !data.credential) {
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }

        sileo.error({ title: data.message || "Unable to issue credential" });
        return;
      }

      setIssuedResult(data.credential);
      setForm(initialForm);
      sileo.success({ title: "Credential issued successfully" });
    } catch (error) {
      console.error("Credential issue request failed:", error);
      sileo.error({ title: "Request failed. Please try again" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPageLoading) {
    return <PageLoader message="Loading issuer workspace" />;
  }

  return (
    <div className="bg-background min-h-screen w-full pt-20">
      <Container>
        <Card className="w-full rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl">Issue New Credential</CardTitle>
            <CardDescription>
              Fill the holder wallet ID and credential details. Required fields
              are validated before submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isApproved ? (
              <div className="bg-secondary text-secondary-foreground rounded-lg border p-4 text-sm">
                Your issuer account is not approved yet. Credential issuance is
                disabled until approval.
              </div>
            ) : (
              <form onSubmit={handleIssueSubmit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Wallet ID</label>
                    <Input
                      value={form.walletId}
                      onChange={(e) => updateForm("walletId", e.target.value)}
                      placeholder="Holder wallet ID"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Credential Type
                    </label>
                    <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="secondary"
                          className="w-full cursor-pointer justify-between"
                        >
                          {form.type || "Select credential type"}
                          <CaretDown />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search type..." />
                          <CommandList>
                            <CommandEmpty>No type found.</CommandEmpty>
                            <CommandGroup>
                              {CREDENTIAL_TYPES.map((type) => (
                                <CommandItem
                                  key={type}
                                  onSelect={() => {
                                    updateForm("type", type);
                                    setTypeOpen(false);
                                  }}
                                >
                                  {type}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={form.title}
                      onChange={(e) => updateForm("title", e.target.value)}
                      placeholder="B.Tech Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Program</label>
                    <Input
                      value={form.program}
                      onChange={(e) => updateForm("program", e.target.value)}
                      placeholder="B.Tech"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Input
                      value={form.department}
                      onChange={(e) => updateForm("department", e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CGPA</label>
                    <Input
                      value={form.cgpa}
                      onChange={(e) => updateForm("cgpa", e.target.value)}
                      placeholder="8.74"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Graduation Year
                    </label>
                    <Input
                      value={form.graduationYear}
                      onChange={(e) =>
                        updateForm("graduationYear", e.target.value)
                      }
                      placeholder="2026"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Expires At (optional)
                    </label>
                    <DatePicker
                      value={
                        form.expiresAt ? new Date(form.expiresAt) : undefined
                      }
                      onChange={(date) => {
                        updateForm("expiresAt", date ? date.toISOString() : "");
                      }}
                      className="data-[empty=true]:text-muted-foreground w-full cursor-pointer justify-between text-left font-normal"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium">
                      Additional Remarks (Optional)
                    </label>
                    <Input
                      value={form.additionalRemarks}
                      onChange={(e) =>
                        updateForm("additionalRemarks", e.target.value)
                      }
                      placeholder="Any additional context or note"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer"
                  >
                    {isSubmitting ? <Spinner className="mr-2" /> : null}
                    {isSubmitting
                      ? "Issuing credential..."
                      : "Issue Credential"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => {
                      setForm(initialForm);
                      setIssuedResult(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          {issuedResult ? (
            <CardFooter className="border-t pt-4">
              <div className="bg-brand/10 w-full space-y-2 rounded-md border p-3 text-sm">
                <p className="font-semibold">Credential issued successfully</p>
                <p>
                  Credential ID:{" "}
                  <span className="font-medium">
                    {issuedResult.credentialId}
                  </span>
                </p>
                <p>
                  CID: <span className="font-medium">{issuedResult.cid}</span>
                </p>
                <p>
                  Status:{" "}
                  <span className="font-medium">{issuedResult.status}</span>
                </p>
                <Link
                  href={`/verify?cid=${encodeURIComponent(issuedResult.cid)}`}
                  className="text-foreground text-sm font-medium underline underline-offset-4"
                >
                  Verify this credential
                </Link>
              </div>
            </CardFooter>
          ) : null}
        </Card>
      </Container>
    </div>
  );
}
