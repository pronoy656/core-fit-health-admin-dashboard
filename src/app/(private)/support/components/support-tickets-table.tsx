"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Eye, User } from "lucide-react"
import Link from "next/link"

import { DataTable } from "@/components/widgets/data-table"
import { StatBadge } from "@/components/widgets/stat-badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useAdminSupportTickets, useSupportTicketStats } from "@/hooks/use-support-tickets"
import { ISupportTicket, TicketCategory, TicketPriority, TicketStatus } from "@/types/support-ticket"

export function SupportTicketsTable() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL")

  const { data: ticketsData, isLoading } = useAdminSupportTickets({
    page,
    limit: 10,
    searchTerm,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
  })

  const { data: statsData } = useSupportTicketStats()

  const columns: ColumnDef<ISupportTicket>[] = [
    {
      accessorKey: "ticketNumber",
      header: "Ticket ID",
      cell: ({ row }) => <div className="font-mono text-xs text-muted-foreground">{row.getValue("ticketNumber")}</div>,
    },
    {
      accessorKey: "userId",
      header: "User",
      cell: ({ row }) => {
        const user = row.getValue("userId") as any
        if (typeof user === 'string') return <div className="text-sm">{user}</div>;
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name || "Unknown"}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div className="max-w-[200px] md:max-w-[300px] truncate" title={row.getValue("subject")}>
          {row.getValue("subject")}
        </div>
      )
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
              priority === "HIGH" ? "warning" : 
              priority === "MEDIUM" ? "info" : "default"
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
        const colorMap: Record<string, any> = {
          OPEN: "warning",
          IN_PROGRESS: "info",
          RESOLVED: "success",
          CLOSED: "default",
          REOPENED: "warning"
        };
        return (
          <StatBadge 
            label={status} 
            color={colorMap[status] || "default"} 
          />
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string
        if (!dateStr) return null
        return <div className="text-xs">{format(new Date(dateStr), "MMM dd, yyyy")}</div>
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original
        return (
          <div className="flex justify-end pr-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <Link href={`/support/tickets/${ticket._id}`}>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        )
      }
    },
  ]

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      {statsData && statsData.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col justify-center">
            <span className="text-sm font-medium text-muted-foreground">Total Tickets</span>
            <div className="text-3xl font-bold mt-2">{statsData.data.total}</div>
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col justify-center">
            <span className="text-sm font-medium text-muted-foreground">Awaiting Reply</span>
            <div className="text-3xl font-bold mt-2 text-warning">{statsData.data.awaitingReply}</div>
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col justify-center">
            <span className="text-sm font-medium text-muted-foreground">SLA Breaching</span>
            <div className="text-3xl font-bold mt-2 text-destructive">{statsData.data.slaBreaching}</div>
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col justify-center">
            <span className="text-sm font-medium text-muted-foreground">Avg First Response</span>
            <div className="text-3xl font-bold mt-2">{statsData.data.avgFirstResponseHours.toFixed(1)}h</div>
          </div>
        </div>
      )}

      {/* Filters and Table */}
      <div className="flex gap-4">
        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
              <SelectItem value="REOPENED">Reopened</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-48">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={ticketsData?.data || []} 
        searchKey="subject" 
        searchPlaceholder="Search tickets by subject..."
        // Normally we'd handle onSearchChange and pass it to setSearchTerm if DataTable supports it, 
        // but for now relying on how DataTable is built.
      />
    </div>
  )
}
