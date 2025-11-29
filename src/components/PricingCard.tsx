import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { motion } from "motion/react"
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

const PricingCard: React.FC<PricingPlan> = ({ index, id, name, price, priceUnit, tagline, features }) => {
    return (
        <>
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: .8, delay: 0.2 * index }}
                className={`p-4 ${instrumentFont.variable} flex justify-between flex-col items-start border-2 border-white/20 rounded-3xl w-[300px] lg:w-[350px]  h-[500px] gap-5 bg-black/20 backdrop-blur-md hover:bg-purple-700/10`}>
                <div className="flex flex-col">
                    <span className={`text-4xl ${inter.className}`}>
                        {name}
                    </span>
                    <span className={`text-4xl font-semibold`}>
                        ${price}/{priceUnit}
                    </span>
                </div>
                <div className="text-sm  ">
                    {tagline}
                </div>
                <div className="flex justify-center items-center w-full">
                    <div className="text-sm ">
                        {features.map((p, i) => (
                            <div key={i} className="flex gap-2 my-2 text-gray-100 justify-start items-center">
                                <FaCircleCheck size={25} color="#50056e" /> {p}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center items-center w-full">
                    <Link href={`pricing/choose/${id}`} className="p-2 lg:p-4 bg-white rounded-2xl text-black hover:bg-white/50 cursor-pointer transition-all duration-75 ease-in-out flex text-sm md:text-base">
                        Choose Plan
                    </Link>
                </div>
            </motion.div>
        </>
    );
}

export default PricingCard;
