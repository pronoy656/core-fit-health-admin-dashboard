"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockAnalytics } from "@/data"

export function CohortChart() {
  const getCellColor = (value: number | null) => {
    if (value === null) return "bg-muted/30"
    if (value > 85) return "bg-chart-1" // Lightest purple
    if (value > 80) return "bg-chart-2"
    if (value > 75) return "bg-chart-3"
    if (value > 70) return "bg-chart-4"
    return "bg-chart-5" // Darkest purple
  }

  return (
    <Card className="border-t-4 border-t-primary/80 animate-fade-up">
      <CardHeader>
        <CardTitle>User Cohort Retention</CardTitle>
        <CardDescription>Retention percentage by monthly cohorts over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-muted-foreground bg-muted/50">
              <tr>
                <th className="px-4 py-3">Cohort</th>
                <th className="px-4 py-3 text-center">Month 0</th>
                <th className="px-4 py-3 text-center">Month 1</th>
                <th className="px-4 py-3 text-center">Month 2</th>
                <th className="px-4 py-3 text-center">Month 3</th>
                <th className="px-4 py-3 text-center">Month 4</th>
              </tr>
            </thead>
            <tbody>
              {mockAnalytics.cohortRetention.map((row, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-3 font-medium">{row.cohort} 2026</td>
                  <td className="p-1">
                    <div className={`h-10 flex items-center justify-center rounded text-white font-bold ${getCellColor(row.m0)}`}>
                      {row.m0}%
                    </div>
                  </td>
                  <td className="p-1">
                    <div className={`h-10 flex items-center justify-center rounded text-white font-bold ${getCellColor(row.m1)}`}>
                      {row.m1 ? `${row.m1}%` : "-"}
                    </div>
                  </td>
                  <td className="p-1">
                    <div className={`h-10 flex items-center justify-center rounded text-white font-bold ${getCellColor(row.m2)}`}>
                      {row.m2 ? `${row.m2}%` : "-"}
                    </div>
                  </td>
                  <td className="p-1">
                    <div className={`h-10 flex items-center justify-center rounded text-white font-bold ${getCellColor(row.m3)}`}>
                      {row.m3 ? `${row.m3}%` : "-"}
                    </div>
                  </td>
                  <td className="p-1">
                    <div className={`h-10 flex items-center justify-center rounded text-white font-bold ${getCellColor(row.m4)}`}>
                      {row.m4 ? `${row.m4}%` : "-"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
