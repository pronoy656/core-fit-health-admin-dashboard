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

export function ExerciseFormSheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Exercise</SheetTitle>
          <SheetDescription>
            Add a new exercise to the CoreFit database.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="ex-name">Exercise Name</Label>
            <Input id="ex-name" placeholder="e.g. Barbell Squat" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ex-type">Type</Label>
              <Input id="ex-type" placeholder="e.g. Strength" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ex-muscle">Muscle Group</Label>
              <Input id="ex-muscle" placeholder="e.g. Legs" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ex-met">MET Value</Label>
            <Input id="ex-met" placeholder="e.g. 5.0" type="number" step="0.1" />
            <p className="text-xs text-muted-foreground">Metabolic Equivalent of Task used for caloric burn calculations.</p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Exercise
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
