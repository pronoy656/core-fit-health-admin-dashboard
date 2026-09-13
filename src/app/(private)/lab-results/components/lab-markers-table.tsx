"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/widgets/data-table"
import { StatBadge } from "@/components/widgets/stat-badge"
import { mockLabResults } from "@/data"
import { LabMarkerFormSheet } from "./lab-marker-form-sheet"

type Marker = typeof mockLabResults.categories[0]["markers"][0]

const columns: ColumnDef<Marker>[] = [
  {
    accessorKey: "name",
    header: "Biomarker",
    cell: ({ row }) => <div className="font-medium text-lg">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "standardRange",
    header: "Standard Clinical Range",
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("standardRange")}</div>,
  },
  {
    accessorKey: "optimalRange",
    header: "CoreFit Optimal Target",
    cell: ({ row }) => (
      <div className="font-bold font-sans text-health-emerald bg-health-emerald/10 px-3 py-1 rounded-md inline-block">
        {row.getValue("optimalRange")}
      </div>
    ),
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("unit")}</div>,
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

interface LabMarkersTableProps {
  category: string;
  markers: Marker[];
}

export function LabMarkersTable({ category, markers }: LabMarkersTableProps) {
  return (
    <div className="space-y-4 bg-card rounded-lg p-6 border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold">{category} Markers</h3>
          <p className="text-sm text-muted-foreground">Configure the ranges used for AI analysis in the mobile app.</p>
        </div>
        <LabMarkerFormSheet>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Marker
          </Button>
        </LabMarkerFormSheet>
      </div>
      <DataTable 
        columns={columns} 
        data={markers} 
      />
    </div>
  )
}
