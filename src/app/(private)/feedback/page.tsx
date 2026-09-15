"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MessageSquareReply, Trash2, User } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/widgets/page-header";
import { DataTable } from "@/components/widgets/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatBadge } from "@/components/widgets/stat-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAllFeedbacks, useFeedbackStats, useUpdateFeedback, useDeleteFeedback } from "@/hooks/use-feedbacks";
import { IFeedback, FeedbackStatus, IFeedbackUser } from "@/types/feedback";

export default function FeedbackPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data: feedbacksData, isLoading } = useAllFeedbacks({ 
    page, 
    limit: 10, 
    searchTerm,
    category: categoryFilter !== "ALL" ? categoryFilter : undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined
  });
  
  const { data: statsData } = useFeedbackStats();

  const { mutate: updateFeedback, isPending: isUpdating } = useUpdateFeedback();
  const { mutate: deleteFeedback } = useDeleteFeedback();

  const [openRespond, setOpenRespond] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<IFeedback | null>(null);
  const [status, setStatus] = useState<FeedbackStatus>("PENDING");
  const [adminResponse, setAdminResponse] = useState("");
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);

  const handleOpenRespond = (feedback: IFeedback) => {
    setSelectedFeedback(feedback);
    setStatus(feedback.status);
    setAdminResponse(feedback.adminResponse || "");
    setOpenRespond(true);
  };

  const handleSubmitResponse = () => {
    if (!selectedFeedback) return;

    updateFeedback(
      { id: selectedFeedback._id, payload: { status, adminResponse } },
      { onSuccess: () => setOpenRespond(false) }
    );
  };

  const confirmDelete = (id: string) => {
    setFeedbackToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (feedbackToDelete) {
      deleteFeedback(feedbackToDelete, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setFeedbackToDelete(null);
        }
      });
    }
  };

  const columns: ColumnDef<IFeedback>[] = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.getValue("user") as IFeedbackUser | string;
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div className="text-sm whitespace-nowrap">{row.getValue("category")}</div>,
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const colorMap: Record<string, "warning" | "success" | "default"> = {
          PENDING: "warning",
          REVIEWED: "success",
          RESOLVED: "default"
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
      accessorKey: "createdAt",
      header: "Date",
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
        const feedback = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => handleOpenRespond(feedback)}
            >
              <MessageSquareReply className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => confirmDelete(feedback._id)}
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
        title="User Feedback" 
        subtitle="Review, manage, and respond to user feedback and bug reports."
      />

      {/* Analytics Summary */}
      {statsData && statsData.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-center">
            <span className="text-sm font-medium text-muted-foreground">Total Feedbacks</span>
            <div className="text-3xl font-bold mt-2">{statsData.data.totalFeedbacks}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm col-span-1 md:col-span-2">
            <span className="text-sm font-medium text-muted-foreground mb-2 block">Category Distribution</span>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {statsData.data.categoryDistribution.map(stat => (
                <div key={stat._id} className="flex-none bg-muted/30 rounded-lg p-2 px-3 text-center min-w-[100px]">
                  <div className="text-[10px] text-muted-foreground mb-1 font-semibold">{(stat._id || 'UNKNOWN').replace('_', ' ')}</div>
                  <div className="text-lg font-semibold">{stat.count}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm col-span-1 md:col-span-1">
            <span className="text-sm font-medium text-muted-foreground mb-2 block">Status Distribution</span>
            <div className="flex flex-col gap-2">
              {statsData.data.statusDistribution.map(stat => (
                <div key={stat._id} className="flex justify-between items-center bg-muted/30 rounded-lg p-1.5 px-3">
                  <div className="text-xs text-muted-foreground">{stat._id}</div>
                  <div className="text-sm font-semibold">{stat.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="flex gap-4 mb-4">
          <div className="w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                <SelectItem value="APP_EXPERIENCE">App Experience</SelectItem>
                <SelectItem value="BUG_REPORT">Bug Report</SelectItem>
                <SelectItem value="FEATURE_REQUEST">Feature Request</SelectItem>
                <SelectItem value="CONTENT">Content</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={feedbacksData?.data || []} 
          searchKey="user" 
          searchPlaceholder="Search feedback..."
        />
      </div>

      {/* Respond Modal */}
      <Dialog open={openRespond} onOpenChange={setOpenRespond}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Feedback</DialogTitle>
            <DialogDescription>
              Update status and add an administrative response.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="grid gap-6 py-4">
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold">{selectedFeedback.category}</div>
                </div>
                <div className="text-sm text-foreground/80 whitespace-pre-wrap">
                  "{selectedFeedback.comment}"
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(val: FeedbackStatus) => setStatus(val)} disabled={isUpdating}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="REVIEWED">Reviewed</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="adminResponse">Admin Response (Optional)</Label>
                  <Textarea 
                    id="adminResponse" 
                    placeholder="Enter a response to this feedback..." 
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    disabled={isUpdating}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    This response will be visible to the user in their feedback history.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRespond(false)} disabled={isUpdating}>Cancel</Button>
            <Button onClick={handleSubmitResponse} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
