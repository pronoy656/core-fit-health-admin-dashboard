"use client"

import { ReactNode } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export function LabMarkerFormSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Lab Marker</SheetTitle>
          <SheetDescription>
            Define a new biomarker for the metabolic analysis engine.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="lm-name">Marker Name</Label>
            <Input id="lm-name" placeholder="e.g. Vitamin D (25-OH)" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lm-unit">Unit of Measurement</Label>
            <Input id="lm-unit" placeholder="e.g. ng/mL" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lm-std">Standard Clinical Range</Label>
            <Input id="lm-std" placeholder="e.g. 20-100" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lm-opt">CoreFit Optimal Target</Label>
            <Input id="lm-opt" placeholder="e.g. 50-80" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Marker
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
