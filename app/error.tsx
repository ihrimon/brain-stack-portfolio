"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { StatusPage } from "@/components/shared/StatusPage"
import { useEffect } from "react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  // Minimal logging so a failure is at least visible in server/browser logs.
  // Swap this for a real error-tracking service (Sentry, etc.) if one gets
  // added — this is the one place in the app that would need to change.
  useEffect(() => {
    console.error("[app/error.tsx] Unhandled error in a route segment:", error)
  }, [error])

  return (
    <StatusPage
      watermark="500"
      badge="Something Went Wrong"
      title="Unexpected Error"
      description="Something went wrong loading this page. Try again, or head back to the homepage."
    >
      <PrimaryButton onClick={reset}>Try Again</PrimaryButton>
      <PrimaryButton href="/" showArrow={false}>
        Back to Home
      </PrimaryButton>
    </StatusPage>
  )
}
