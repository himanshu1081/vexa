"use client";
import PricingCard from "../../../components/PricingCard";
import { Inter } from "next/font/google";
import { motion } from "motion/react"
import { useState } from "react";


const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});


export default function Page() {

  interface PricingPlan {
    id: string;
    name: string;
    price: number;
    priceUnit: "month" | "year";
    tagline: string;
    features: string[];
  }

  const pricing: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      priceUnit: "month",
      tagline: "For creators taking their first steps.",
      features: [
        "Up to 3 projects in the cloud",
        "Image export up to 1080p",
        "Basic editing tools",
        "Free templates and icons",
        "Access via web and mobile app"
      ],
    },
    {
      id: "standard",
      name: "Standard",
      price: 9.99,
      priceUnit: "month",
      tagline: "For freelancers and small teams needing flexibility.",
      features: [
        "Up to 50 projects in the cloud",
        "Export up to 4K",
        "Advanced editing tools",
        "Team collaboration (up to 5 members)",
        "Access to premium template library"
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 19.99,
      priceUnit: "month",
      tagline: "For studios, agencies, and professional creators.",
      features: [
        "Unlimited projects",
        "Export up to 8K + animations",
        "AI-powered content generation tools",
        "Unlimited team members",
        "Brand customization (logos, colors, palettes)"
      ],
    }
  ];

  const [priceUnit, setPriceUnit] = useState<'month' | 'year'>('month');
  const handleToggle = () => {
    if (priceUnit == 'year') {
      setPriceUnit('month')
    } else {
      setPriceUnit('year')
    }
  }
  return (
    <>
      <div className="w-screen lg:h-screen lg:overflow-y-hidden overflow-x-hidden">
        <div className={`font-bold text-[20vw] flex justify-center items-center w-screen absolute -z-20`}
          style={{ fontFamily: inter.style.fontFamily }}>
          <motion.span
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 0.2 }}
            transition={{ duration: 0.8 }}
            className={`${inter.className} opacity-10 text-[#0f6f3f] w-screen h-screen flex items-center justify-center fixed top-10`}>
            Pricing
          </motion.span>
        </div>
        <div className="flex flex-col gap-5 w-full h-full lg:justify-center items-center p-5 ">
          <div
            className="p-1 md:p-2 bg-white text-black rounded-full cursor-pointer text-sm md:text-base mt-16 md:mt-20"
            onClick={handleToggle}
          >
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded-full transition ${priceUnit === "month"
                    ? "bg-[#0f6f3f] text-white"
                    : "text-black"
                  }`}
              >
                Monthly
              </span>

              <span className="text-black/40">|</span>

              <span
                className={`px-3 py-1.5 rounded-full transition ${priceUnit === "year"
                    ? "bg-[#0f6f3f] text-white"
                    : "text-black"
                  }`}
              >
                Yearly
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row justify-center items-center h-full ">
            {pricing.map((p, index) => (
              <PricingCard
                index={index}
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                priceUnit={priceUnit}
                tagline={p.tagline}
                features={p.features} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
