"use client";
import { motion } from "motion/react";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: "700" });
const instrumentFont = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
});

export default function Page() {
  return (
    <div className="h-screen w-screen  relative overflow-hidden">
  
  {/* LEFT — Title */}
  <div className="absolute top-32 left-20">
    <h1 className="text-6xl font-light text-white">About us</h1>
  </div>

  {/* RIGHT — Statement */}
  <div className="absolute bottom-42 md:bottom-24 right-10 md:right-20 max-w-sm text-right">
    <p className="text-3xl font-light text-white leading-tight">
      Creating a brighter future  
      with intelligent AI
    </p>
  </div>

  {/* SUBTEXT — Mission */}
  <div className="absolute bottom-24 left-20 text-sm text-white/60">
    — Our Mission
  </div>

</div>

  );
}
