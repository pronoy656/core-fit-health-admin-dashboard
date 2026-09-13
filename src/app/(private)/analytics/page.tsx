"use client"

import { PageHeader } from "@/components/widgets/page-header"
import { RevenueChart } from "../overview/components/revenue-chart"
import { ChurnMetrics } from "./components/churn-metrics"
import { CohortChart } from "./components/cohort-chart"

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="Analytics & Growth" 
        subtitle="Deep dive into user retention, churn, and revenue metrics."
      />

      <ChurnMetrics />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-7 min-w-0">
          <RevenueChart />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-7 min-w-0">
          <CohortChart />
        </div>
      </div>
    </div>
  )
}
