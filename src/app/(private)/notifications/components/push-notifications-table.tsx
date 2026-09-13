"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BellRing } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/widgets/data-table"
import { mockNotifications } from "@/data"
import { PushNotificationSheet } from "./push-notification-sheet"

type PushNotification = typeof mockNotifications.push[0]

const columns: ColumnDef<PushNotification>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "audience",
    header: "Audience",
  },
  {
    accessorKey: "sent",
    header: "Sent",
    cell: ({ row }) => <div className="font-sans">{row.getValue<number>("sent").toLocaleString()}</div>,
  },
  {
    accessorKey: "clicked",
    header: "Clicked",
    cell: ({ row }) => {
      const sent = row.getValue<number>("sent")
      const clicked = row.getValue<number>("clicked")
      const percentage = ((clicked / sent) * 100).toFixed(1)
      return (
        <div className="flex items-center gap-2">
          <span className="font-sans">{clicked.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">({percentage}%)</span>
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Date Sent",
  },
]

export function PushNotificationsTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Push Notification History</h3>
        <PushNotificationSheet>
          <Button>
            <BellRing className="mr-2 h-4 w-4" />
            Send Push Notification
          </Button>
        </PushNotificationSheet>
      </div>
      <DataTable 
        columns={columns} 
        data={mockNotifications.push} 
        searchKey="title" 
        searchPlaceholder="Search notifications..."
      />
    </div>
  )
}
