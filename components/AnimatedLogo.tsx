"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function AnimatedLogo() {
  return (
    <div className="relative w-full max-w-md mx-auto h-40 mb-8">
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/pgc-logo.png" // Update this path to match your public folder
          alt="PGC Coins"
          width={400}
          height={133}
          className="w-full h-auto drop-shadow-2xl"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1318] via-transparent to-transparent pointer-events-none" />
    </div>
  )
}

