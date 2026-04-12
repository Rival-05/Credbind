"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  generateKeyPair,
  exportPublicKey,
  exportPrivateKey,
} from "@/lib/crypto";
import { savePrivateKey } from "@/lib/walletStorage";
import { sileo } from "sileo";

type Role = "holder" | "issuer";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole =
    searchParams.get("role") === "issuer" ? "issuer" : "holder";

  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Record<string, string>>({
    name: "",
    enrollment: "",
    orgName: "",
    domain: "",
    email: "",
    password: "",
  });

  const [wallet, setWallet] = useState<CryptoKeyPair | null>(null);

  const heading = useMemo(
    () => (role === "issuer" ? "Issuer Signup" : "Holder Signup"),
    [role],
  );

  useEffect(() => {
    if (role === "holder" && !wallet) {
      (async () => {
        try {
          const kp = await generateKeyPair();
          setWallet(kp);
        } catch {
          sileo.error({
            title: "Can't generate wallet right now",
          });
        }
      })();
    }
  }, [role, wallet]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "issuer") {
        const res = await fetch("/api/auth/issuer/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orgName: form.orgName,
            email: form.email,
            domain: form.domain,
            password: form.password,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          sileo.error({ title: data.message || "Signup failed" });
          return;
        }

        sileo.success({ title: "Issuer account created" });
        router.push("/login?role=issuer");
        return;
      }

      if (!wallet) {
        sileo.error({ title: "Wallet not ready yet" });
        return;
      }

      const publicKey = await exportPublicKey(wallet.publicKey);
      const privateKey = await exportPrivateKey(wallet.privateKey);

      await savePrivateKey(privateKey);

      const res = await fetch("/api/auth/holder/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          enrollment: form.enrollment,
          password: form.password,
          publicKey,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        sileo.error({ title: data.message || "Signup failed" });
        return;
      }

      sileo.success({ title: "Account created successfully" });
      router.push("/login?role=holder");
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background min-h-screen w-full pt-20">
      <Container>
        <main className="flex w-full max-w-md items-center justify-center py-8">
          <Card className="w-full rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{heading}</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                {role === "issuer" ? (
                  <>
                    <Input
                      placeholder="College Name"
                      value={form.orgName}
                      onChange={(e) =>
                        setForm({ ...form, orgName: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Domain"
                      value={form.domain}
                      onChange={(e) =>
                        setForm({ ...form, domain: e.target.value })
                      }
                    />
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Enrollment"
                      value={form.enrollment}
                      onChange={(e) =>
                        setForm({ ...form, enrollment: e.target.value })
                      }
                    />
                  </>
                )}

                <Input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" />}
                  {loading ? "Creating..." : "Create account"}
                </Button>
              </form>
            </CardContent>

            <CardFooter>
              <Link href={`/login?role=${role}`}>Log in</Link>
            </CardFooter>
          </Card>
        </main>
      </Container>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
