"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Bitcoin, Coins, DollarSign, Wallet } from "lucide-react"

const cryptoSymbols = [
  { name: "Bitcoin", symbol: <Bitcoin className="w-8 h-8 text-orange-500" /> },
  { name: "Coin", symbol: <Coins className="w-8 h-8 text-blue-500" /> },
  { name: "Stablecoin", symbol: <DollarSign className="w-8 h-8 text-green-500" /> },
  { name: "Wallet", symbol: <Wallet className="w-8 h-8 text-purple-500" /> },
]

interface CryptoCaptchaProps {
  onValidate: (isValid: boolean) => void
}

export function CryptoCaptcha({ onValidate }: CryptoCaptchaProps) {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState<typeof cryptoSymbols>([])
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [userAnswer, setUserAnswer] = useState("")

  useEffect(() => {
    generateNewQuestion()
  }, [])

  useEffect(() => {
    onValidate(userAnswer === correctAnswer)
  }, [userAnswer, correctAnswer, onValidate])

  const generateNewQuestion = () => {
    const shuffled = [...cryptoSymbols].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 4)
    const correctIndex = Math.floor(Math.random() * 4)

    setQuestion(`Select the symbol for ${selected[correctIndex].name}:`)
    setOptions(selected)
    setCorrectAnswer(selected[correctIndex].name)
    setUserAnswer("")
  }

  return (
    <div className="space-y-4">
      <Label className="text-gray-300 text-sm block">{question}</Label>
      <div className="grid grid-cols-2 gap-4">
        {options.map((crypto, index) => (
          <Button
            key={index}
            onClick={() => setUserAnswer(crypto.name)}
            className={`h-16 ${
              userAnswer === crypto.name ? "bg-purple-600 hover:bg-purple-700" : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            {crypto.symbol}
          </Button>
        ))}
      </div>
      <Button onClick={generateNewQuestion} variant="outline" className="w-full mt-2">
        New Question
      </Button>
    </div>
  )
}

