"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center">
        
        {/* Icon */}
        <div className="text-6xl mb-4">
          {status === "success" && "🎉"}
          {status === "failed" && "❌"}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2">
          {status === "success" && "Payment Successful"}
          {status === "failed" && "Payment Failed"}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-sm mb-6">
          {status === "success" &&
            "Your payment went through successfully."}
          {status === "failed" &&
            "Something went wrong. Please try again."}
        </p>

        {/* Loader / redirect note */}
        <div className="text-xs text-gray-400">
          Redirecting you in a few seconds...
        </div>

        {/* Manual button */}
        <button
          onClick={() => router.push("/chat")}
          className="mt-6 w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition"
        >
          Go to Chat →
        </button>
      </div>
    </div>
  );
}