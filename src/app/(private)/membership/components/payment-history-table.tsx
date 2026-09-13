"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/widgets/data-table"
import { StatBadge } from "@/components/widgets/stat-badge"
import { mockMembership } from "@/data"

type Payment = typeof mockMembership.paymentHistory[0]

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: ({ row }) => <div className="font-mono text-xs text-muted-foreground">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => <div className="font-medium">{row.getValue("user")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-bold">{formatted}</div>
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
  },
  {
    accessorKey: "platform",
    header: "Platform",
  },
  {
    accessorKey: "date",
    header: "Date",
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
          color={
            status === "success" ? "success" : 
            status === "failed" ? "warning" : "default"
          } 
        />
      )
    },
  },
]

export function PaymentHistoryTable() {
  return (
    <DataTable 
      columns={columns} 
      data={mockMembership.paymentHistory} 
      searchKey="user" 
      searchPlaceholder="Search by user name..."
    />
  )
}
