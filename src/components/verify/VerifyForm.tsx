"use client";

import { Key } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type VerifyField = {
  id: "certificateId" | "publicKey";
  label: string;
  placeholder: string;
  icon?: typeof Key;
};

const fields: VerifyField[] = [
  {
    id: "certificateId",
    label: "Certificate ID",
    placeholder: "Enter your certificate CID.",
  },
  {
    id: "publicKey",
    label: "Public Key",
    placeholder: "Enter your public key (Base64).",
    icon: Key,
  },
];

export function VerifyForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    certificateId: "",
    publicKey: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Verifying Certificate...");

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cid: formData.certificateId,
          publicKeyBase64: formData.publicKey,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      if (data.valid) {
        toast.success("Certificate Verified Successfully!", { id: toastId });
      } else {
        toast.error("Certificate is tampered.", { id: toastId });
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Certificate Verification Failed. Please try again.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-16 flex w-full max-w-4xl flex-col items-center justify-center rounded-lg p-6 shadow-md sm:my-20 sm:p-8">
      <h2 className="text-foreground mb-6 text-center text-2xl font-semibold sm:text-3xl md:text-4xl">
        Verify Certificate
      </h2>

      <form
        onSubmit={handleVerify}
        className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:gap-4"
      >
        {fields.map((field) => {
          const Icon = field.icon;

          return (
            <div key={field.id} className="relative flex-1">
              {Icon && (
                <Icon
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-green-600/80"
                />
              )}
              <input
                id={field.id}
                type="text"
                value={formData[field.id]}
                onChange={handleChange}
                className={`border-border bg-background text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-3 py-2 text-sm font-light tracking-wide focus:outline-none sm:text-base ${Icon ? "pl-9" : ""}`}
                placeholder={field.placeholder}
                required
              />
            </div>
          );
        })}
        <button
          type="submit"
          disabled={loading}
          className={`bg-primary text-primary-foreground hover:bg-primary/85 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 sm:px-6 sm:text-base ${loading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
        <Toaster position="top-center" />
      </form>
    </div>
  );
}
