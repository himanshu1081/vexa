"use client";
import PricingCard from "../../components/PricingCard";
import { Inter } from "next/font/google";
import { motion } from "motion/react"


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


  return (
    <>
      <div className="w-screen h-screen">
        <div className={`font-bold text-[20vw] flex justify-center items-center w-screen h-screen absolute -z-20`}
          style={{ fontFamily: inter.style.fontFamily }}>
          <motion.span
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 0.2 }}
            transition={{ duration: 0.8 }}
            className="opacity-15 text-[#8e19b9]">
            Pricing
          </motion.span>
        </div>
        <div className="flex gap-10 mt-10 w-screen h-screen justify-center items-center">
          {pricing.map((p, index) => (
            <PricingCard
              index={index}
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              priceUnit={p.priceUnit}
              tagline={p.tagline}
              features={p.features} />
          ))}
        </div>
      </div>
    </>
  );
}
