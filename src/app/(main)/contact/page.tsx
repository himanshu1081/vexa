"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="relative h-screen w-screen  overflow-hidden">

      {/* LEFT — Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-32 left-8 md:left-20"
      >
        <h1 className="text-5xl md:text-6xl font-light text-white">
          Contact
        </h1>
        <p className="text-white/50 mt-4 max-w-xs">
          Let’s talk about what you’re building.
        </p>
      </motion.div>


      {/* RIGHT — Contact info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-24 right-8 md:right-20 text-right max-w-sm"
      >
        <p className="text-2xl md:text-3xl font-light text-white leading-tight">
          Start a conversation  
          that actually matters
        </p>

        <Link
          href="mailto:hello@yourdomain.com"
          className="inline-block mt-6 px-6 py-3 rounded-full 
                     bg-[#0f6f3f] hover:bg-[#052e1a] transition"
        >
          Say hello
        </Link>
      </motion.div>

      {/* MOBILE — Bottom hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs md:hidden">
        Scroll to continue
      </div>

    </div>
  );
}
