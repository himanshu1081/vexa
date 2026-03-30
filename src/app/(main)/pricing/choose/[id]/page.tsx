"use client";
import { API_URL } from "../../../../../lib/config";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import { Inter } from "next/font/google";
import { FaCircleCheck } from "react-icons/fa6";
import { useState } from "react";
import { supabase } from "../../../../../lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plans = {
  free: {
    name: "Free",
    price: 0,
    tagline: "Perfect for getting started.",
    features: [
      "Up to 3 projects",
      "Basic editing tools",
      "Web access",
    ],
  },
  standard: {
    name: "Standard",
    price: 50,
    tagline: "For freelancers and growing teams.",
    features: [
      "Up to 50 projects",
      "Advanced tools",
      "Team collaboration",
      "Premium templates",
    ],
  },
  pro: {
    name: "Pro",
    price: 200,
    tagline: "For professionals who want everything.",
    features: [
      "Unlimited projects",
      "AI-powered tools",
      "Unlimited team members",
      "Brand customization",
    ],
  },
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export { };


export default function Page() {
  const router = useRouter();
  const [coupon, setCoupon] = useState("")
  const [couponApplied, setCouponApplied] = useState({ isApplied: false, discount: 0 })
  const [error, setError] = useState("")

  const { id } = useParams<{ id: keyof typeof plans }>();
  const plan = plans[id];

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async () => {
    const isLoaded = await loadRazorpay();
    const createOrder = await fetch(`${API_URL}/api/create-order`,
      {
        method: "POST", body: JSON.stringify(
          {
            amount: plan.price - couponApplied.discount
          }
        )
      })
    const { amount, currency, receipt } = await createOrder.json()

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency,
      receipt,
      handler: async (response) => {
        const verifyPayment = await fetch(`${API_URL}/api/create-orderverify-payment`, {
          method: "POST",
          body: JSON.stringify(response)
        })
        const payment = await verifyPayment.json()
        if (payment.success) {
          router.push("/payment?status=success");
        } else {
          router.push("/payment?status=fail");
        }
      }
    }

    const rzp = new window.Razorpay(options);
    rzp.open();


  }

  const handleCoupon = async () => {
    const { data, error } = await supabase.from("coupons").select("discount").eq("coupon", coupon.toLowerCase().trim()).eq("is_active", true)
    console.log(data)
    if (data.length == 0) {
      setError("Invalid/expired coupon")
      return
    }
    setCouponApplied({ isApplied: true, discount: data[0].discount })

    setError("")
  }


  if (!plan) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-white">
        Invalid plan
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4 ">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-8 my-20"
      >

        {/* LEFT — PLAN SUMMARY */}
        <div className="border border-white/20 rounded-3xl p-4 lg:p-6 bg-black/30 backdrop-blur-md">
          <h1 className={`text-md lg:text-3xl mb-2 ${inter.className}`}>
            {plan.name} Plan
          </h1>

          <p className="text-white/60 mb-6 text-xs">
            {plan.tagline}
          </p>

          <div className="mb-6">
            <span className="text-2xl lg:text-4xl font-semibold">
              {
                couponApplied.isApplied ?
                  <span>
                    <span className="line-through">₹{plan.price}</span> <span>₹{(plan.price - couponApplied.discount) < 0 ? 0 : plan.price - couponApplied.discount}</span>
                  </span>
                  :
                  <span>
                    ₹{plan.price}
                  </span>
              }
            </span>
            <span className="text-sm text-white/60"> / month</span>
          </div>

          <div className="space-y-3">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-xs md:text-sm">
                <FaCircleCheck color="#0f6f3f" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — CTA */}
        <div className="border border-white/20 rounded-3xl p-6 flex flex-col justify-between bg-black/40">
          <div>
            <h2 className={`text-2xl mb-2 ${inter.className}`}>
              Ready to continue?
            </h2>

            <p className="text-white/60 text-sm">
              You can change or cancel your plan at any time.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-2">
            <div className="w-full p-2 flex items-center justify-between bg-green-500/10 backdrop-blur-2xl border border-white/20 rounded-md">
              <input
                type="text"
                className="outline-0 w-full text-sm"
                onChange={(e) => setCoupon(e.target.value)}
                value={coupon}
                placeholder="Enter coupon here"
                onKeyDown={e => e.key == 'Enter' && handleCoupon()} />
              <button
                onClick={handleCoupon}
                className={`text-sm ${coupon === "" ? "text-white/20" : "text-white"} cursor-pointer`}>
                Apply
              </button>
            </div>
            {
              (error.trim() !== "") &&
              <div className="text-xs text-red-600  rounded-sm w-full text-center ">
                {error}
              </div>
            }
            <span
              onClick={handlePay}
              className="text-sm
                w-full flex justify-center items-center
                bg-[#0f6f3f] hover:bg-[#052e1a]
                text-white rounded-full py-3
                transition
              "
            >
              Continue to payment
            </span>

            <p className="text-xs text-white/40 text-center mt-4">
              Secure checkout · No hidden fees
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
