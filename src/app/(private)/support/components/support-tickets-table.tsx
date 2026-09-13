"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "@/components/widgets/data-table"
import { StatBadge } from "@/components/widgets/stat-badge"
import { mockSupport } from "@/data"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

type SupportTicket = typeof mockSupport.tickets[0]

const columns: ColumnDef<SupportTicket>[] = [
  {
    accessorKey: "id",
    header: "Ticket ID",
    cell: ({ row }) => <div className="font-mono text-xs text-muted-foreground">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => <div className="font-medium">{row.getValue("user")}</div>,
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      return (
        <StatBadge 
          label={priority} 
          variant="outline"
          color={
            priority === "high" ? "warning" : 
            priority === "medium" ? "info" : "default"
          } 
        />
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <StatBadge 
          label={status} 
          color={
            status === "closed" ? "success" : 
            status === "open" ? "warning" : "default"
          } 
        />
      )
    },
  },
  {
    accessorKey: "date",
    header: "Last Updated",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    )
  },
]

export function SupportTicketsTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Open Tickets</h3>
      <DataTable 
        columns={columns} 
        data={mockSupport.tickets} 
        searchKey="user" 
        searchPlaceholder="Search tickets by user..."
      />
    </div>
  )
}
