"use client"

import { ReactNode } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

interface Plan {
  id: string
  name: string
  price: number
  interval: string
  features: string[]
}

interface PlanEditSheetProps {
  plan: Plan
  children: ReactNode
}

export function PlanEditSheet({ plan, children }: PlanEditSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Plan: {plan.name}</SheetTitle>
          <SheetDescription>
            Update pricing and features for this plan. Changes will affect new subscribers immediately.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input id="plan-name" defaultValue={plan.name} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan-price">Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                <Input id="plan-price" defaultValue={plan.price} className="pl-7" type="number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-interval">Interval</Label>
              <Input id="plan-interval" defaultValue={plan.interval} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-features">Features (One per line)</Label>
            <Textarea 
              id="plan-features" 
              defaultValue={plan.features.join("\n")} 
              className="min-h-[150px]"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}


