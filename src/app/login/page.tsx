"use client";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { motion } from "motion/react"
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


export default function Page() {
  return (
    <>
      <div>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: .8 }}
          className={`p-6 ${instrumentFont.variable} flex justify-between flex-col items-start border-2 border-white/20 p-4 rounded-3xl w-1/4 h-3/4 gap-10 bg-black/20 backdrop-blur-md hover:bg-purple-700/10`}>
          <div className="flex flex-col">
            <span className={`text-4xl ${inter.className}`}>
              Login
            </span>
            <span className={`text-5xl font-semibold`}>

            </span>
          </div>
          <div>
            
          </div>
          <div>
            
          </div>
        </motion.div>
      </div>
    </>
  );
}
