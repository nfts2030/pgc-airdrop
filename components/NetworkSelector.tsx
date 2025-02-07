"use client"

import { motion } from "framer-motion"
import { Coins, Wallet } from "lucide-react"

interface NetworkSelectorProps {
  value: string
  onChange: (network: string) => void
}

export function NetworkSelector({ value, onChange }: NetworkSelectorProps) {
  const networks = [
    {
      id: "Solana",
      name: "Solana",
      icon: <Coins className="h-8 w-8" />,
      color: "from-purple-500 to-orange-500",
    },
    {
      id: "Polygon",
      name: "Polygon",
      icon: <Wallet className="h-8 w-8" />,
      color: "from-purple-500 to-blue-500",
    },
    {
      id: "BSC",
      name: "BSC",
      icon: <Coins className="h-8 w-8" />,
      color: "from-yellow-500 to-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {networks.map((network) => (
        <motion.div
          key={network.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(network.id)}
          className={`
            cursor-pointer rounded-xl p-4
            ${value === network.id ? "ring-2 ring-white" : "ring-1 ring-white/20"}
            bg-gradient-to-br ${network.color}
          `}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-white">
            {network.icon}
            <span className="font-bold">{network.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

