"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/widgets/page-header"
import { ExercisesTable } from "./components/exercises-table"

export default function FitnessPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="Fitness Tracking" 
        subtitle="Manage the exercise database and track user activity."
      />

      <Tabs defaultValue="exercises" className="space-y-4">
        <TabsList>
          <TabsTrigger value="exercises">Exercise Database</TabsTrigger>
        </TabsList>
        <TabsContent value="exercises" className="space-y-4">
          <ExercisesTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
