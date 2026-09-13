"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { mockAnalytics } from "@/data"

const chartConfig = {
  new: {
    label: "New Users",
    color: "var(--color-chart-1)",
  },
  churned: {
    label: "Churned",
    color: "var(--color-chart-4)",
  },
} satisfies ChartConfig

export function UserGrowthChart() {
  return (
    <Card className="h-full border-t-4 border-t-primary/80 animate-fade-up" style={{ animationDelay: "0.1s" }}>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Weekly new vs churned users</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={mockAnalytics.userGrowth} margin={{ left: -20, right: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="new" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="churned" fill="var(--color-chart-5)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
