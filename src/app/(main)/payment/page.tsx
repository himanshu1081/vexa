"use client";
import { API_URL } from "../../../lib/config";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter()

    const status = searchParams.get("status");
    setTimeout(() => {
        router.push(`${API_URL}/chat`)
    }, 5000)

    return (
        <div>
            {status === "success" && <p>Payment Successful 🎉</p>}
            {status === "failed" && <p>Payment Failed ❌</p>}
        </div>
    );
}