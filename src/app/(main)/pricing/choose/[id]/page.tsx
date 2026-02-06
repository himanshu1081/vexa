"use client";

import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Inter } from "next/font/google";
import { FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";

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
    price: 9.99,
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
    price: 19.99,
    tagline: "For professionals who want everything.",
    features: [
      "Unlimited projects",
      "AI-powered tools",
      "Unlimited team members",
      "Brand customization",
    ],
  },
};

export default function Page() {
  const { id } = useParams<{ id: keyof typeof plans }>();
  const plan = plans[id];

  if (!plan) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-white">
        Invalid plan
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8"
      >

        {/* LEFT — PLAN SUMMARY */}
        <div className="border border-white/20 rounded-3xl p-6 bg-black/30 backdrop-blur-md">
          <h1 className={`text-3xl mb-2 ${inter.className}`}>
            {plan.name} Plan
          </h1>

          <p className="text-white/60 mb-6">
            {plan.tagline}
          </p>

          <div className="mb-6">
            <span className="text-4xl font-semibold">
              ${plan.price}
            </span>
            <span className="text-white/60"> / month</span>
          </div>

          <div className="space-y-3">
            {plan.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
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

          <div className="mt-10">
            <Link
              href={`/checkout/${id}`}
              className="
                w-full flex justify-center items-center
                bg-[#0f6f3f] hover:bg-[#052e1a]
                text-white rounded-full py-3
                transition
              "
            >
              Continue to payment
            </Link>

            <p className="text-xs text-white/40 text-center mt-4">
              Secure checkout · No hidden fees
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
