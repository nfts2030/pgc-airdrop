"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { addSubmission, checkSupabaseConnection } from "./supabaseClient"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NetworkSelector } from "./components/NetworkSelector"
import { AnimatedGradientText } from "./components/AnimatedGradientText"
import { AnimatedHeader } from "./components/AnimatedHeader"
import { CryptoCaptcha } from "./components/CryptoCaptcha"

type FormData = {
  name: string
  email: string
  network: "Solana" | "Polygon" | "BSC"
  address: string
}

export function AirdropForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)

  const network = watch("network")

  useEffect(() => {
    async function checkConnection() {
      const connected = await checkSupabaseConnection()
      setIsConnected(connected)
    }
    checkConnection()
  }, [])

  const onSubmit = async (data: FormData) => {
    if (!isConnected) {
      setSubmitError("Unable to connect to the server. Please try again later.")
      return
    }

    if (!isCaptchaValid) {
      setSubmitError("Please complete the captcha correctly.")
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      await addSubmission({
        ...data,
        tokens_sent: false,
        amount_sent: 0,
      })
      setSubmitSuccess(true)
      reset()
    } catch (error) {
      setSubmitError("An error occurred while submitting your information. Please try again later.")
      console.error("Error submitting form:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const addressPatterns = {
    Solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    Polygon: /^0x[a-fA-F0-9]{40}$/,
    BSC: /^0x[a-fA-F0-9]{40}$/,
  }

  const validateAddress = (value: string) => {
    if (!network) return true
    const pattern = addressPatterns[network]
    if (!pattern) return true
    return pattern.test(value) || `Invalid ${network} address format`
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-6 space-y-3"
            >
              <AnimatedHeader />
              <h1 className="text-3xl md:text-4xl font-bold">
                <AnimatedGradientText>PetGasCoin ($PGC) Airdrop</AnimatedGradientText>
              </h1>
              <div className="text-gray-300 text-sm md:text-base">
                Limited-time airdrop🔥 Get your $PGC now. We're building a sustainable future by turning plastic waste
                into clean energy using <AnimatedGradientText>Solana/Polygon/BNB Chain</AnimatedGradientText>.
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-center space-x-2 mt-2"
              >
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-500 text-sm">Airdrop Live</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="backdrop-blur-xl bg-black/30 rounded-2xl border border-white/10 shadow-2xl p-6"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300 text-sm">
                    Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your name"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 mt-1"
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300 text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="your@email.com"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 mt-1"
                  />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Choose Network</Label>
                  <input type="hidden" {...register("network", { required: "Please select a network" })} />
                  <NetworkSelector
                    value={network || ""}
                    onChange={(value) => setValue("network", value as FormData["network"])}
                  />
                  {errors.network && <p className="text-xs text-red-400 mt-1">{errors.network.message}</p>}
                </div>

                {network && (
                  <div>
                    <Label htmlFor="address" className="text-gray-300 text-sm">
                      {network} Address
                    </Label>
                    <Input
                      id="address"
                      {...register("address", {
                        required: `${network} address is required`,
                        validate: validateAddress,
                      })}
                      placeholder={`Enter your ${network} address`}
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-gray-500 font-mono text-xs mt-1"
                    />
                    {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address.message}</p>}
                  </div>
                )}

                <CryptoCaptcha onValidate={setIsCaptchaValid} />

                <button
                  type="submit"
                  disabled={submitting || !isCaptchaValid}
                  className="w-full h-11 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg text-sm relative overflow-hidden group transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-out" />
                  <div className="relative flex items-center justify-center gap-2">
                    {submitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Claim Your $PGC
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {submitError && (
                <Alert variant="destructive" className="mt-4 bg-red-500/20 border-red-500/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              {submitSuccess && (
                <Alert className="mt-4 bg-green-500/20 border-green-500/50">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>Your information has been successfully submitted!</AlertDescription>
                </Alert>
              )}
            </motion.div>
          </div>
        </div>

        {!isConnected && (
          <Alert
            variant="default"
            className="fixed top-20 left-4 right-4 mx-auto max-w-md bg-yellow-500/20 border-yellow-500/50"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Unable to connect to the server. Some features may be limited.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
