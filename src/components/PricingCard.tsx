import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { motion } from "motion/react";
import { FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const instrumentFont = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
});

interface PricingPlan {
  index: number;
  id: string;
  name: string;
  price: number;
  priceUnit: "month" | "year";
  tagline: string;
  features: string[];
}

const PricingCard: React.FC<PricingPlan> = ({
  index,
  id,
  name,
  price,
  priceUnit,
  tagline,
  features,
}) => {
  if (priceUnit === "year") {
    price = price * 12 * 0.9;
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 * index }}
      className={`
        p-4 ${instrumentFont.variable}
        flex flex-col justify-between items-start
        border border-white/20
        rounded-3xl
        w-[300px] h-[450px]
        xl:w-[350px] xl:h-[500px]
        bg-black/30 backdrop-blur-md
        hover:bg-[#0f6f3f]/10
        transition
      `}
    >
      {/* Header */}
      <div>
        <span className={`text-2xl ${inter.className}`}>{name}</span>
        <div className="text-4xl font-semibold mt-1">
          ₹{price.toFixed(2)}
          <span className="text-base font-normal text-white/60">
            /{priceUnit}
          </span>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-sm text-white/70">{tagline}</p>

      {/* Features */}
      <div className="w-full">
        {features.map((p, i) => (
          <div
            key={i}
            className="flex gap-2 my-2 text-sm text-gray-100 items-center"
          >
            <FaCircleCheck size={18} color="#0f6f3f" />
            <span>{p}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="w-full flex justify-center">
        {price === 0 ?
          <span className="
        px-4 py-2
        bg-white text-black
        rounded-2xl
        text-sm md:text-base
        hover:bg-white/80
        transition
        "
          >
            {name == 'Free' ? "Current Plan" : "Upgrade"}

          </span>
          :
          <Link
            href={`pricing/choose/${id}`}
            className="
        px-4 py-2
        bg-white text-black
        rounded-2xl
        text-sm md:text-base
        hover:bg-white/80
        transition
        "
          >
            {name == 'Free' ? "Current Plan" : "Upgrade"}
          </Link>
        }
      </div>
    </motion.div>
  );
};

export default PricingCard;
