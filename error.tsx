"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-400 mb-4">Please try again later or contact support if the problem persists.</p>
      <Button onClick={reset} className="bg-green-600 hover:bg-green-700 text-white">
        Try again
      </Button>
    </div>
  )
}

