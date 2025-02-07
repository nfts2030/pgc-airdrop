import { motion } from "framer-motion"

type NetworkCounterProps = {
  network: string
  count: number
}

const networkColors = {
  Solana: "from-purple-500 to-orange-500",
  BSC: "from-yellow-500 to-orange-500",
  Polygon: "from-blue-500 to-purple-500",
}

export function NetworkCounter({ network, count }: NetworkCounterProps) {
  return (
    <motion.div
      className={`text-xs bg-gradient-to-r ${networkColors[network as keyof typeof networkColors]} rounded-full px-3 py-1.5 shadow-lg`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="font-bold">{network}</span>: <span className="font-mono">{count}</span>
    </motion.div>
  )
}

