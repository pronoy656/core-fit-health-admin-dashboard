"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, User, Activity, ArrowUpIcon, ArrowDownIcon, Minus, Mail, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/widgets/page-header";
import { DataTable } from "@/components/widgets/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatBadge } from "@/components/widgets/stat-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAllUsers, useUserMetrics, useUpdateUser, useDeleteUser, useUserDossier } from "@/hooks/use-user-management";
import { IAdminUserListItem, UserStatus, UserRole } from "@/types/userManagement";

function MetricCard({ title, value, changePercentage, trend }: { title: string; value: number; changePercentage: number; trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-center">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <div className="text-3xl font-bold mt-2">{value}</div>
      <div className="flex items-center gap-1 mt-2 text-xs">
        {trend === 'up' ? (
          <ArrowUpIcon className="h-3 w-3 text-emerald-500" />
        ) : trend === 'down' ? (
          <ArrowDownIcon className="h-3 w-3 text-rose-500" />
        ) : (
          <Minus className="h-3 w-3 text-muted-foreground" />
        )}
        <span className={trend === 'up' ? "text-emerald-500 font-medium" : trend === 'down' ? "text-rose-500 font-medium" : "text-muted-foreground font-medium"}>
          {Math.abs(changePercentage)}%
        </span>
        <span className="text-muted-foreground ml-1">vs last month</span>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const { data: usersData, isLoading } = useAllUsers({ 
    page, 
    limit: 10, 
    searchTerm,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    role: roleFilter !== "ALL" ? roleFilter : undefined,
  });
  
  const { data: metricsData } = useUserMetrics();

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  // Edit Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editStatus, setEditStatus] = useState<UserStatus>("ACTIVE");
  const [editRole, setEditRole] = useState<UserRole>("USER");
  
  const { data: dossierData, isLoading: isLoadingDossier } = useUserDossier(selectedUserId || "");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleOpenEdit = (user: IAdminUserListItem) => {
    setSelectedUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditStatus(user.status);
    setEditRole(user.role);
    setOpenEdit(true);
  };

  const handleSubmitEdit = () => {
    if (!selectedUserId) return;

    updateUser(
      { id: selectedUserId, payload: { name: editName, email: editEmail, status: editStatus, role: editRole } },
      { onSuccess: () => setOpenEdit(false) }
    );
  };

  const confirmDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        }
      });
    }
  };

  const columns: ColumnDef<IAdminUserListItem>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.photo} />
              <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user.name || "Unknown"}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {user.email} 
                {user.emailVerified && <span title="Verified"><ShieldAlert className="h-3 w-3 text-blue-500" /></span>}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return <div className="text-xs font-semibold">{role}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colorMap: Record<string, "warning" | "success" | "destructive" | "default"> = {
          PENDING: "warning",
          ACTIVE: "success",
          RESTRICTED: "warning",
          SUSPENDED: "destructive",
          DELETED: "destructive",
          INACTIVE: "default"
        };
        return (
          <StatBadge 
            label={status} 
            color={colorMap[status] || "default"} 
          />
        );
      },
    },
    {
      accessorKey: "engagement",
      header: "Engagement",
      cell: ({ row }) => {
        const engagement = row.getValue("engagement") as string;
        const colorMap: Record<string, string> = {
          high: "text-emerald-500",
          medium: "text-amber-500",
          low: "text-muted-foreground"
        };
        return (
          <div className="flex items-center gap-1">
            <Activity className={`h-4 w-4 ${colorMap[engagement] || ""}`} />
            <span className="text-xs font-medium capitalize">{engagement}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => {
        const plan = row.getValue("plan") as string;
        return <div className="text-xs font-medium">{plan}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string;
        if (!dateStr) return null;
        try {
          return <div className="text-xs whitespace-nowrap">{format(new Date(dateStr), "MMM dd, yyyy")}</div>;
        } catch {
          return dateStr;
        }
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => handleOpenEdit(user)}
              title="Edit User"
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => confirmDelete(user.id)}
              title="Delete User"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="User Directory" 
        subtitle="Manage user accounts, monitor engagement, and apply administrative actions."
      />

      {/* Analytics Summary */}
      {metricsData && metricsData.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            title="Total Users" 
            value={metricsData.data.totalUsers?.value ?? 0} 
            changePercentage={metricsData.data.totalUsers?.changePct ?? 0} 
            trend={metricsData.data.totalUsers?.direction ?? 'neutral'} 
          />
          <MetricCard 
            title="Active Users" 
            value={metricsData.data.activeUsers?.value ?? 0} 
            changePercentage={metricsData.data.activeUsers?.changePct ?? 0} 
            trend={metricsData.data.activeUsers?.direction ?? 'neutral'} 
          />
          <MetricCard 
            title="Suspended Users" 
            value={metricsData.data.suspendedUsers?.value ?? 0} 
            changePercentage={metricsData.data.suspendedUsers?.changePct ?? 0} 
            trend={metricsData.data.suspendedUsers?.direction ?? 'neutral'} 
          />
        </div>
      )}

      {/* Data Table */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex gap-4 mb-4">
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="RESTRICTED">Restricted</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={usersData?.data || []} 
          searchKey="searchTerm" 
          searchPlaceholder="Search users by name or email..."
          onSearchChange={(val) => setSearchTerm(val)}
        />
      </div>

      {/* Edit Dossier Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Dossier & Governance</DialogTitle>
            <DialogDescription>
              Review user details and modify administrative access and status.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            
            {/* Top Metrics Row */}
            {dossierData && dossierData.data ? (
              <div className="grid grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Total Symptom Logs</span>
                  <span className="text-xl font-bold">{dossierData.data.totalSymptomLogs}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Total Meal Logs</span>
                  <span className="text-xl font-bold">{dossierData.data.totalMealLogs}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Total AI Sessions</span>
                  <span className="text-xl font-bold">{dossierData.data.totalAiSessions}</span>
                </div>
              </div>
            ) : isLoadingDossier ? (
              <div className="h-20 flex items-center justify-center text-sm text-muted-foreground">Loading dossier metrics...</div>
            ) : null}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isUpdating}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    className="pl-9"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Account Status</Label>
                <Select value={editStatus} onValueChange={(val: UserStatus) => setEditStatus(val)} disabled={isUpdating}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                {['RESTRICTED', 'SUSPENDED', 'DELETED'].includes(editStatus) && (
                  <p className="text-[10px] text-destructive font-medium mt-1">
                    Warning: Applying this status will immediately log the user out of all devices.
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={editRole} onValueChange={(val: UserRole) => setEditRole(val)} disabled={isUpdating}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)} disabled={isUpdating}>Cancel</Button>
            <Button onClick={handleSubmitEdit} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Irreversible Action
            </DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to permanently delete this user? This will wipe all their logs, history, and active sessions from the database. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Permanently Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
