import { Suspense } from "react"
import App from "./App"
import Loading from "./loading"

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  )
}

