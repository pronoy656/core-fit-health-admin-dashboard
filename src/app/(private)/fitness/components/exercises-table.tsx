"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/widgets/data-table"
import { StatBadge } from "@/components/widgets/stat-badge"
import { mockFitness } from "@/data"
import { ExerciseFormSheet } from "./exercise-form-sheet"

type Exercise = typeof mockFitness.exercises[0]

const columns: ColumnDef<Exercise>[] = [
  {
    accessorKey: "name",
    header: "Exercise Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <StatBadge 
          label={type} 
          variant="outline"
          color={type === "Cardio" ? "info" : "warning"} 
        />
      )
    },
  },
  {
    accessorKey: "muscleGroup",
    header: "Muscle Group",
  },
  {
    accessorKey: "metValue",
    header: "MET Value",
    cell: ({ row }) => <div className="font-bold font-sans text-health-teal">{row.getValue("metValue")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <StatBadge 
          label={status} 
          color={status === "active" ? "success" : "default"} 
        />
      )
    },
  },
]

export function ExercisesTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">CoreFit Exercise Database</h3>
        <ExerciseFormSheet>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Exercise
          </Button>
        </ExerciseFormSheet>
      </div>
      <DataTable 
        columns={columns} 
        data={mockFitness.exercises} 
        searchKey="name" 
        searchPlaceholder="Search exercises..."
      />
    </div>
  )
}
