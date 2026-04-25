"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function Visitors() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/visitors", { cache: "no-store" });
        const data = await res.json();
        setCount(data.count);
      } catch {
        setCount(-1);
      }
    };

    load();
  }, []);

  return (
    <div className="flex items-center gap-1 text-neutral-400">
      <span className="text-sm tracking-wide">
        {count === null ? (
          <Spinner className="h-4 w-4" />
        ) : (
          `${count} ${count === 1 ? "visitor" : "visitors"}`
        )}
      </span>
    </div>
  );
}
