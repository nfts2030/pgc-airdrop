"use client"

import { useState, useEffect } from "react"
import { AirdropForm } from "./AirdropForm"
import { AdminPanel } from "./AdminPanel"
import { LoginPage } from "./LoginPage"
import { supabase } from "./supabaseClient"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, User, ShieldCheck } from "lucide-react"

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAdmin(false)
    setIsAuthenticated(false)
  }

  const toggleView = () => {
    if (isAuthenticated) {
      setIsAdmin((prev) => !prev)
    } else {
      setIsAdmin(true)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={isAdmin ? "admin" : "user"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          {isAdmin ? (
            isAuthenticated ? (
              <div className="bg-black min-h-screen">
                <AdminPanel />
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 text-white border-none"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
            )
          ) : (
            <AirdropForm />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          onClick={toggleView}
          className="bg-black/30 hover:bg-black/40 text-white border-white/10 transition-all duration-300 ease-in-out relative overflow-hidden group"
        >
          {isAdmin ? (
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <User className="w-4 h-4 mr-2" />
              <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-200">USER</span>
              <span
                className="absolute inset-0 flex items-center justify-center text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ paddingLeft: "24px" }}
              >
                USER
              </span>
            </motion.div>
          ) : (
            <motion.div className="flex items-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-200">ADMIN</span>
              <span
                className="absolute inset-0 flex items-center justify-center text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ paddingLeft: "24px" }}
              >
                ADMIN
              </span>
            </motion.div>
          )}
        </Button>
      </div>
    </main>
  )
}

