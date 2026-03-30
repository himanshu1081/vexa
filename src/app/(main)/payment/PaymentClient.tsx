"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/chat");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {status === "success" && <p>Payment Successful 🎉</p>}
      {status === "fail" && <p>Payment Failed ❌</p>}
    </div>
  );
}