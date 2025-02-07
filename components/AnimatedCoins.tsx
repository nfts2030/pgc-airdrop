"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"

export function AnimatedCoins() {
  const [imageError, setImageError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const imageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pgc-coins-QlNR7qTgg17LzKOQP1KMgVaHPx8jlA.png"

  return (
    <div className="relative mb-4">
      <motion.div
        animate={{
          y: [0, -5, 0],
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="PGC Coins"
          width={400}
          height={132}
          className="drop-shadow-[0_0_10px_rgba(120,119,198,0.3)]"
          onError={() => setImageError(true)}
        />
        {imageError && (
          <div className="text-red-500 text-sm text-center mt-2">
            Error loading image. Please try refreshing the page.
          </div>
        )}
      </motion.div>
    </div>
  )
}

