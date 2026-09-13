"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Edit2 } from "lucide-react"
import { mockMembership } from "@/data"
import { PlanEditSheet } from "./plan-edit-sheet"

export function PlansGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockMembership.plans.map((plan) => (
        <Card key={plan.id} className="relative overflow-hidden flex flex-col">
          {plan.id === "yearly" && (
            <div className="absolute top-0 right-0 bg-health-teal text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <CardDescription>
              {plan.users.toLocaleString()} active users
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4">
              <span className="text-3xl font-bold font-sans">${plan.price}</span>
              <span className="text-muted-foreground text-sm">/{plan.interval}</span>
            </div>
            <ul className="space-y-2 text-sm">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-health-emerald" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <PlanEditSheet plan={plan}>
              <Button variant="outline" className="w-full">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Pricing
              </Button>
            </PlanEditSheet>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
