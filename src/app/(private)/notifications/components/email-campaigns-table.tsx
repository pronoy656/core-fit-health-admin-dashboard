"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MailPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/widgets/data-table"
import { StatBadge } from "@/components/widgets/stat-badge"
import { mockNotifications } from "@/data"
import { EmailCampaignSheet } from "./email-campaign-sheet"

type EmailCampaign = typeof mockNotifications.email[0]

const columns: ColumnDef<EmailCampaign>[] = [
  {
    accessorKey: "subject",
    header: "Email Subject",
    cell: ({ row }) => <div className="font-medium">{row.getValue("subject")}</div>,
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
    accessorKey: "openRate",
    header: "Open Rate",
    cell: ({ row }) => <div className="font-bold font-sans text-health-teal">{row.getValue("openRate")}</div>,
  },
  {
    accessorKey: "ctr",
    header: "Click-Through Rate",
    cell: ({ row }) => <div className="font-bold font-sans text-health-emerald">{row.getValue("ctr")}</div>,
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
            status === "sent" ? "success" : 
            status === "automated" ? "info" : "warning"
          } 
        />
      )
    },
  },
]

export function EmailCampaignsTable() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Email Campaigns</h3>
        <EmailCampaignSheet>
          <Button>
            <MailPlus className="mr-2 h-4 w-4" />
            Create Email Campaign
          </Button>
        </EmailCampaignSheet>
      </div>
      <DataTable 
        columns={columns} 
        data={mockNotifications.email} 
        searchKey="subject" 
        searchPlaceholder="Search campaigns..."
      />
    </div>
  )
}
