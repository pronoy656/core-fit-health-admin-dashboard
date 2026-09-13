"use client"

import { Cell, Pie, PieChart } from "recharts"

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
  Free: { label: "Free", color: "var(--color-chart-1)" },
  Premium: { label: "Premium", color: "var(--color-chart-2)" },
  Yearly: { label: "Yearly", color: "var(--color-chart-3)" },
  Trial: { label: "Trial", color: "var(--color-chart-4)" },
} satisfies ChartConfig

export function PlanDistributionChart() {
  const total = mockAnalytics.planDistribution.reduce((acc, curr) => acc + curr.value, 0)
  
  return (
    <Card className="h-full border-t-4 border-t-primary/80 animate-fade-up">
      <CardHeader className="items-center pb-0">
        <CardTitle>Plan Distribution</CardTitle>
        <CardDescription>Current subscriber breakdown</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={mockAnalytics.planDistribution}
              dataKey="value"
              nameKey="plan"
              innerRadius={60}
              strokeWidth={2}
              paddingAngle={2}
            >
              {mockAnalytics.planDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent />}
              className="mt-4 flex-wrap justify-center gap-2"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
