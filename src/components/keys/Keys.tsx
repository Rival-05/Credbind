"use client";

import { Copy, Key, Sparkle } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import {
  exportPrivateKey,
  exportPublicKey,
  generateKeyPair,
} from "@/lib/crypto";

export function Keys() {
  const [keys, setKeys] = useState({ privateKey: "", publicKey: "" });
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const { publicKey, privateKey } = await generateKeyPair();
      const b64privatekey = await exportPrivateKey(privateKey);
      const b64publickey = await exportPublicKey(publicKey);
      setKeys({ privateKey: b64privatekey, publicKey: b64publickey });
      toast.success("Keys generated!");
    } catch {
      toast.error("Key generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied!`);
    } catch {
      toast.error("Copy failed!");
    }
  };

  const keyFields = [
    { label: "Private Key", value: keys.privateKey, color: "text-red-600/80" },
    { label: "Public Key", value: keys.publicKey, color: "text-green-600/80" },
  ];

  return (
    <div className="relative mx-auto my-14 flex w-full max-w-4xl flex-col items-center justify-center p-6 shadow-md sm:my-20 sm:p-8">
      <button
        className="group border-border bg-background hover:bg-muted relative flex cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-lg border px-4 py-1 transition-all duration-300"
        onClick={handleGenerate}
        disabled={loading}
        type="button"
      >
        <span className="text-sm sm:text-base">
          {loading ? "Generating..." : "Generate"}
        </span>
        <Sparkle
          size={18}
          className="text-muted-foreground group-hover:text-primary relative z-10 transition-all duration-300"
        />
      </button>
      <Toaster position="top-center" />
      <div className="mt-10 flex w-full max-w-3xl flex-col items-center justify-center gap-1 sm:flex-row sm:gap-4">
        {keyFields.map(
          ({ label, value, color }) =>
            value && (
              <div key={label} className="my-4">
                <div className="mb-2 flex items-center gap-2 font-normal">
                  <Key className={`h-4 w-4 ${color}`} />
                  <span>{label}</span>
                </div>
                <div className="flex h-8 items-stretch gap-0">
                  <textarea
                    className="border-border bg-background text-foreground cursor-default rounded-l-lg border border-r-0 px-2 py-1 text-sm font-light tracking-wide focus:outline-none sm:text-base"
                    readOnly
                    rows={1}
                    value={value}
                  />
                  <button
                    className={`border-border bg-secondary text-secondary-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-r-lg border border-l-0 px-2 text-sm font-light tracking-tight ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                    style={{ paddingTop: "0.25rem", paddingBottom: "0.25rem" }}
                    onClick={() => handleCopy(value, label)}
                    type="button"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ),
        )}
      </div>
      {(keys.privateKey || keys.publicKey) && (
        <h3 className="text-muted-foreground mt-4 flex w-full items-center justify-center text-xs font-light sm:text-sm md:text-base">
          - Do not share the private key with anyone.
        </h3>
      )}
    </div>
  );
}
