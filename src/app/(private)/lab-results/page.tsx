"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/widgets/page-header"

import { mockLabResults } from "@/data"
import { LabMarkersTable } from "./components/lab-markers-table"

export default function LabResultsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="Lab Marker Configuration" 
        subtitle="Manage standard clinical ranges and CoreFit optimal health targets."
      />

      <Tabs defaultValue={mockLabResults.categories[0].id} className="space-y-4 mt-6">
        <TabsList className="bg-muted/50 w-full justify-start overflow-x-auto h-auto p-1 flex-wrap">
          {mockLabResults.categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-sm px-6 py-2">
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {mockLabResults.categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-4">
            <LabMarkersTable category={cat.name} markers={cat.markers} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
