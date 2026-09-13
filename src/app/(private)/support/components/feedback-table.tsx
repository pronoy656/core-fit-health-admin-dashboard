"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Star } from "lucide-react"

import { DataTable } from "@/components/widgets/data-table"
import { mockSupport } from "@/data"

type Feedback = typeof mockSupport.feedback[0]

const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => <div className="font-medium">{row.getValue("user")}</div>,
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue<number>("rating")
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${i < rating ? "fill-warning text-warning" : "text-muted"}`} 
            />
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "comment",
    header: "Feedback",
    cell: ({ row }) => <div className="max-w-md truncate">{row.getValue("comment")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
  },
]

export function FeedbackTable() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent User Feedback</h3>
      <DataTable 
        columns={columns} 
        data={mockSupport.feedback} 
        searchKey="comment" 
        searchPlaceholder="Search feedback..."
      />
    </div>
  )
}
