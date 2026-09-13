"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { mockMembership } from "@/data"

export function FailedPaymentsAlert() {
  const failedCount = mockMembership.failedPayments.length

  if (failedCount === 0) return null

  return (
    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-semibold text-destructive">Action Required: Failed Payments</AlertTitle>
      <AlertDescription className="mt-2 flex items-center justify-between">
        <span>There are {failedCount} failed subscription renewals in the last 24 hours.</span>
        <Button variant="outline" size="sm" className="border-destructive/20 hover:bg-destructive/10 text-destructive">
          Review Payments
        </Button>
      </AlertDescription>
    </Alert>
  )
}
