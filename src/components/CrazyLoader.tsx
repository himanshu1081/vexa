"use client";

import { motion } from "motion/react";

const dots = ["", ".", "..", "..."];

export default function VexaThinking() {
  return (
    <div className="flex flex-col items-start">
      {/* AI CORE */}
      <div className="relative w-2 h-8 items-center">

        {/* Glow aura */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#00CC66]/30 blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Core */}
        <motion.div
          className="absolute inset-6 rounded-full bg-[#00CC66]"
          animate={{
            scale: [1, 0.85, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Neural ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#00CC66]/60"
          animate={{
            rotate: 360,
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Orbiting thoughts */}
        
      </div>

      {/* TEXT */}
      <motion.div
        className="text-sm md:text-base text-white/80 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
      </motion.div>
    </div>
  );
}
