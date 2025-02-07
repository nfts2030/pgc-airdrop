"use client"

import { motion } from "framer-motion"
import type React from "react"

export function AnimatedGradientText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="inline-block"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      style={{
        backgroundImage: "linear-gradient(90deg, #9945FF, #14F195, #9945FF)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </motion.span>
  )
}

