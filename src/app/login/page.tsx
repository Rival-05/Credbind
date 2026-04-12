"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
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
import { sileo } from "sileo";

type Role = "holder" | "issuer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole =
    searchParams.get("role") === "issuer" ? "issuer" : "holder";

  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const heading = useMemo(
    () => (role === "issuer" ? "Issuer Login" : "Holder Login"),
    [role],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        role === "issuer" ? "/api/auth/issuer/login" : "/api/auth/holder/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        sileo.error({ title: data.message || "Login failed" });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role === "issuer" ? "ISSUER" : "STUDENT");

      sileo.success({ title: "Login successful" });

      setTimeout(() => {
        router.push(
          role === "issuer" ? "/issuer/dashboard" : "/student/dashboard",
        );
      }, 600);
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
            <CardHeader className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1">
                <button type="button" onClick={() => setRole("holder")}>
                  Holder
                </button>

                <button type="button" onClick={() => setRole("issuer")}>
                  Issuer
                </button>
              </div>

              <CardTitle className="text-2xl">{heading}</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
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
                  {loading ? "Logging in..." : "Log in"}
                </Button>
              </form>
            </CardContent>

            <CardFooter>
              <Link href={`/signup?role=${role}`}>Sign up</Link>
            </CardFooter>
          </Card>
        </main>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
