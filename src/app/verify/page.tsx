import { Suspense } from "react";
import Verifyui from "@/components/verify/ui";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Verifyui />
    </Suspense>
  );
}
