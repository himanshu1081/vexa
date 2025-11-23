"use client";
import Link from "next/link";
import { motion } from "motion/react"
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";


const inter = Inter({ subsets: ["latin"], weight: "700" });
const instrumentFont = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
});
export default function Page() {
  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center flex-col gap-5 p-4 text-center font-instrument">
        <motion.div
          initial={{ y: 30, opacity: 0, backdropFilter: 2 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl  ${inter.className}`}>
          Your Personal AI Brain.
        </motion.div>
        <div className={`${instrumentFont.variable} font-instrument w-3/4 md:w-2/4 text-center`}>
          <motion.p
            initial={{ y: 30, opacity: 0, backdropFilter: 2 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: .4 }} className={`text-xs lg:text-lg ${instrumentFont.variable}`}>
            Stop wasting time searching, scrolling, or rewriting. Type your thoughts and let the AI refine, explain, expand, or execute — instantly. Smarter communication, zero effort.
          </motion.p>
        </div>
        <motion.div
          initial={{ y: 30, opacity: 0, backdropFilter: 2 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}>
          <Link href="/login" className="md:px-4 md:py-3 bg-[#50056e] rounded-full text-lg hover:bg-[#7700a5] transition-all duration-75 ease-in border border-white/20 cursor-pointer px-3 py-1">
            Get Started
          </Link>
        </motion.div>
      </div >
    </>
  );
}
