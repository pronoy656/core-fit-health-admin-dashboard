"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/widgets/data-table"
import { StatBadge } from "@/components/widgets/stat-badge"
import { mockMembership } from "@/data"

type PromoCode = typeof mockMembership.promoCodes[0]

const columns: ColumnDef<PromoCode>[] = [
  {
    accessorKey: "code",
    header: "Promo Code",
    cell: ({ row }) => <div className="font-mono font-bold tracking-wider">{row.getValue("code")}</div>,
  },
  {
    accessorKey: "discount",
    header: "Discount",
  },
  {
    accessorKey: "uses",
    header: "Uses",
    cell: ({ row }) => <div className="font-medium">{row.getValue("uses")}</div>,
  },
  {
    accessorKey: "expiry",
    header: "Expiry Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <StatBadge 
          label={status} 
          variant="outline"
          color={status === "active" ? "success" : "default"} 
        />
      )
    },
  },
]

export function PromoCodesTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Active & Past Promotions</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Promo Code
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={mockMembership.promoCodes} 
        searchKey="code" 
        searchPlaceholder="Search codes..."
      />
    </div>
  )
}
