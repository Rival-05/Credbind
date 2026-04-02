"use client";

import { Key } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { signCertificate } from "@/lib/crypto";

type FormData = {
  recipient: string;
  title: string;
  date: string;
  details: string;
  privatekey: string;
  publickey: string;
};

const fields = [
  {
    id: "privatekey",
    label: "Private key",
    placeholder: "Enter your private key.",
    iconClass: "text-red-600/80",
  },
  {
    id: "publickey",
    label: "Public key",
    placeholder: "Enter your public key.",
    iconClass: "text-green-600/80",
  },
] as const;

export function IssueForm() {
  const [formData, setFormData] = useState<FormData>({
    recipient: "",
    title: "",
    date: "",
    details: "",
    privatekey: "",
    publickey: "",
  });
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Issuing Certificate...");

    const issuingDetails = {
      recipient: formData.recipient,
      title: formData.title,
      date: formData.date,
      details: formData.details,
    };

    try {
      const decodedPrivateKey = JSON.parse(atob(formData.privatekey));
      const signature = await signCertificate(
        issuingDetails,
        decodedPrivateKey,
      );

      const res = await fetch("/api/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issuingDetails,
          Signature: signature,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setCid(data.cid);
      toast.success("Certificate Issued Successfully!", { id: toastId });
    } catch (err) {
      console.error("Certificate couldn't be issued:", err);
      toast.error("Certificate could not be issued. Please try again later.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-2 flex w-full max-w-4xl flex-col items-center justify-center rounded-lg p-4">
      <h2 className="mb-6 bg-linear-to-b from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-center text-2xl font-semibold text-transparent sm:text-3xl md:text-4xl">
        Issue Certificate
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-lg flex-col space-y-2"
      >
        <div className="flex w-full flex-col">
          <label
            htmlFor="recipient"
            className="mb-2 text-sm font-medium tracking-wide sm:text-base"
          >
            Recipient&apos;s Name
          </label>
          <input
            type="text"
            id="recipient"
            value={formData.recipient}
            onChange={handleChange}
            className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide focus:outline-none sm:text-base"
            placeholder="Name of the person to whom the certificate is issued."
            required
          />
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="title"
            className="mb-2 text-sm font-medium tracking-wide sm:text-base"
          >
            Certificate Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide focus:outline-none sm:text-base"
            required
            placeholder="Course, degree, or award title."
          />
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="date"
            className="mb-2 text-sm font-medium tracking-wide sm:text-base"
          >
            Issue Date
          </label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide text-neutral-400 focus:outline-none sm:text-base"
            required
          />
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="details"
            className="mb-2 text-sm font-medium tracking-wide sm:text-base"
          >
            Additional Details
          </label>
          <textarea
            id="details"
            rows={4}
            value={formData.details}
            onChange={handleChange}
            className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide focus:outline-none sm:text-base"
            placeholder="Any additional information about the certificate."
          />
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          {fields.map((field) => (
            <div key={field.id} className="flex w-full flex-col sm:w-1/2">
              <label
                htmlFor={field.id}
                className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wide sm:text-base"
              >
                <Key className={`inline-block h-5 w-5 ${field.iconClass}`} />
                {field.label}
              </label>
              <input
                type="text"
                id={field.id}
                value={formData[field.id]}
                onChange={handleChange}
                className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide focus:outline-none sm:text-base"
                required
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 cursor-pointer rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium tracking-wide text-neutral-800 transition-colors duration-300 hover:bg-neutral-400 hover:text-neutral-900 sm:px-6 sm:py-3 sm:text-base ${loading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {loading ? "Issuing..." : "Issue Certificate"}
        </button>
        <Toaster position="bottom-right" />
      </form>

      {cid && (
        <div className="mt-4 w-full max-w-lg rounded-md border border-neutral-600 p-3 text-xs sm:text-sm">
          <p className="mb-1 font-medium">Certificate CID:</p>
          <p className="font-mono break-all">{cid}</p>
        </div>
      )}
    </div>
  );
}
