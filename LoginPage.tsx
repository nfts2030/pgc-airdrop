"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "./supabaseClient"
import { motion } from "framer-motion"
import { Key, Lock, Mail } from "lucide-react"
import Image from "next/image"

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      onLogin()
    } catch (error) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-[350px] bg-gray-900 text-white border-green-500 border-2">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="relative w-16 h-16"
              >
                <Image
                  src="https://petgascoin.com/media/PETGASCOIN-SOLANA.png"
                  alt="PetGasCoin Logo"
                  width={64}
                  height={64}
                  className="rounded-full drop-shadow-[0_0_8px_rgba(0,255,0,0.3)]"
                />
              </motion.div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-gray-400 text-center">Access the crypto realm</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
                <Key className="w-4 h-4 mr-2" />
                Unlock Admin Panel
              </Button>
              {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
            </CardFooter>
          </form>
        </Card>
      </motion.div>
      <div className="absolute top-0 left-0 right-0 p-4">
        <h1 className="text-3xl font-bold text-center text-green-500">PetGasCoin ($PGC) Admin</h1>
      </div>
      <CryptoBackground />
    </div>
  )
}

function CryptoBackground() {
  return (
    <div className="fixed inset-0 z-[-1] opacity-10">
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  )
}

