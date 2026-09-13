"use client"

import { PageHeader } from "@/components/widgets/page-header"
import { WeightEditor } from "./components/weight-editor"

export default function MetabolicIndexPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="Metabolic Index Configuration" 
        subtitle="Tune the algorithm weights that calculate the user's daily metabolic score."
      />

      <div className="max-w-3xl mx-auto mt-10">
        <WeightEditor />
      </div>
    </div>
  )
}
