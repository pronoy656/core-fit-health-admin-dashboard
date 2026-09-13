import { Activity, ArrowDownIcon, UserMinus, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockAnalytics } from "@/data"

export function ChurnMetrics() {
  const metrics = [
    {
      title: "Gross Churn Rate",
      value: `${mockAnalytics.churnMetrics.grossChurn}%`,
      description: "Total subscribers lost this month",
      icon: UserMinus,
    },
    {
      title: "Net Churn Rate",
      value: `${mockAnalytics.churnMetrics.netChurn}%`,
      description: "Accounting for expansion/upgrades",
      icon: Activity,
    },
    {
      title: "Logo Churn",
      value: `${mockAnalytics.churnMetrics.logoChurn}%`,
      description: "Accounts canceled completely",
      icon: Users,
    },
    {
      title: "Expansion Revenue",
      value: `${mockAnalytics.churnMetrics.expansion}%`,
      description: "Revenue from plan upgrades",
      icon: ArrowDownIcon, // using this as a placeholder, we will rotate it or replace it
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="border-t-4 border-t-primary/80 animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
