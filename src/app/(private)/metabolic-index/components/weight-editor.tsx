"use client"

import * as React from "react"
import { AlertCircle, Save, Undo2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WeightItem {
  id: string
  name: string
  value: number
  color: string
}

const DEFAULT_WEIGHTS: WeightItem[] = [
  { id: "a1c", name: "HbA1c & Blood Glucose", value: 25, color: "bg-chart-1" },
  { id: "lipids", name: "Lipid Panel (Trig/HDL)", value: 20, color: "bg-chart-2" },
  { id: "activity", name: "Activity & Steps", value: 25, color: "bg-chart-3" },
  { id: "sleep", name: "Sleep Duration & Quality", value: 15, color: "bg-chart-4" },
  { id: "bp", name: "Blood Pressure", value: 15, color: "bg-chart-5" },
]

export function WeightEditor() {
  const [weights, setWeights] = React.useState<WeightItem[]>(DEFAULT_WEIGHTS)
  const [isDirty, setIsDirty] = React.useState(false)

  const total = weights.reduce((acc, curr) => acc + curr.value, 0)
  const isError = total !== 100

  const handleWeightChange = (id: string, newValue: number[]) => {
    setWeights(weights.map(w => w.id === id ? { ...w, value: newValue[0] } : w))
    setIsDirty(true)
  }

  const handleReset = () => {
    setWeights(DEFAULT_WEIGHTS)
    setIsDirty(false)
  }

  return (
    <Card className="border-t-4 border-t-primary/80 shadow-md">
      <CardHeader>
        <CardTitle>Algorithm Weights</CardTitle>
        <CardDescription>
          Adjust the percentage weight of each category. The total must exactly equal 100%.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Progress bar visualizing the total */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Total Weight</span>
            <span className={isError ? "text-destructive font-bold" : "text-success font-bold"}>
              {total}%
            </span>
          </div>
          <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex">
            {weights.map((w) => (
              <div 
                key={w.id} 
                className={`h-full ${w.color} transition-all duration-300`} 
                style={{ width: `${(w.value / Math.max(total, 100)) * 100}%` }}
              />
            ))}
          </div>
          {isError && (
            <Alert variant="destructive" className="mt-4 py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Configuration</AlertTitle>
              <AlertDescription>
                Total weights must equal exactly 100%. Current total is {total}%.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Sliders */}
        <div className="space-y-6 pt-4">
          {weights.map((w) => (
            <div key={w.id} className="space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${w.color}`} />
                  <span className="font-medium text-sm">{w.name}</span>
                </div>
                <span className="font-sans font-bold">{w.value}%</span>
              </div>
              <Slider
                value={[w.value]}
                max={100}
                step={1}
                className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
                onValueChange={(val) => handleWeightChange(w.id, val)}
              />
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
        <Button variant="outline" onClick={handleReset} disabled={!isDirty}>
          <Undo2 className="mr-2 h-4 w-4" />
          Reset to Default
        </Button>
        <Button disabled={isError || !isDirty} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}
