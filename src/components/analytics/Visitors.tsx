"use client";

import { useEffect, useState } from "react";

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
        {count === null
          ? "..."
          : `${count} ${count === 1 ? "visitor" : "visitors"}`}
      </span>
    </div>
  );
}
