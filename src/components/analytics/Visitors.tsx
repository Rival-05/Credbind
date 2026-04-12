"use client";

import { useEffect, useState } from "react";
import Eye from "../svgs/eye";
import { getUniqueVisitorCount } from "@/lib/visitor-count";

export default function Visitors() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      setVisitorCount(getUniqueVisitorCount());
    } catch {
      setVisitorCount(0);
    }
  }, []);

  const visitorLabel = visitorCount === 1 ? "visitor" : "visitors";

  return (
    <div className="flex items-center gap-1 text-neutral-400">
      <Eye />
      <span className="text-sm tracking-wide">
        {visitorCount === null ? "..." : `${visitorCount} ${visitorLabel}`}
      </span>
    </div>
  );
}
