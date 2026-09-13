"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { DataTable } from "@/components/widgets/data-table"
import { StatBadge } from "@/components/widgets/stat-badge"
import { MockUser, UserStatus, UserPlan } from "@/data"

import { 
  UserDetailSheet, 
  SendMessageModal, 
  ChangePlanModal, 
  SuspendUserModal 
} from "./user-detail-sheet"

export const columns: ColumnDef<MockUser>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{user.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      const plan = row.getValue("plan") as UserPlan
      return (
        <StatBadge 
          label={plan} 
          color={
            plan === "yearly" || plan === "premium" ? "info" : 
            plan === "trial" ? "warning" : "default"
          } 
        />
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as UserStatus
      return (
        <StatBadge 
          label={status} 
          variant="outline"
          color={
            status === "active" ? "success" : 
            status === "suspended" ? "warning" : "default"
          } 
        />
      )
    },
  },
  {
    accessorKey: "metabolicScore",
    header: "Metabolic Score",
    cell: ({ row }) => {
      const score = row.getValue("metabolicScore") as number
      const color = score >= 85 ? "bg-health-emerald" : score >= 70 ? "bg-health-teal" : "bg-warning"
      return (
        <div className="flex items-center gap-2">
          <div className="w-[80px]">
            <Progress value={score} className="h-2 bg-muted [&>div]:bg-[color:var(--color-health-teal)]" />
          </div>
          <span className="text-sm font-medium">{score}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue("lastLogin")}</div>,
  },
  {
    id: "actions",
    cell: function ActionCell({ row }) {
      const user = row.original
      const [sheetOpen, setSheetOpen] = React.useState(false)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSheetOpen(true)}>
                View Profile
              </DropdownMenuItem>
              <SendMessageModal 
                user={user} 
                trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Send Message</DropdownMenuItem>} 
              />
              <DropdownMenuSeparator />
              <ChangePlanModal 
                user={user} 
                trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Change Plan</DropdownMenuItem>} 
              />
              <SuspendUserModal 
                user={user} 
                trigger={
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className={user.status === "active" ? "text-destructive" : "text-success"}
                  >
                    {user.status === "active" ? "Suspend User" : "Reactivate User"}
                  </DropdownMenuItem>
                } 
              />
            </DropdownMenuContent>
          </DropdownMenu>
          
          <UserDetailSheet user={user} open={sheetOpen} onOpenChange={setSheetOpen} />
        </>
      )
    },
  },
]

export function UsersTable({ data }: { data: MockUser[] }) {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      searchKey="name" 
      searchPlaceholder="Search users by name..."
    />
  )
}
