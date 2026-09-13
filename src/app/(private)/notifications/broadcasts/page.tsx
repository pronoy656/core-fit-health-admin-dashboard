"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Send } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/widgets/page-header";
import { DataTable } from "@/components/widgets/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBroadcasts, useSendBroadcast } from "@/hooks/use-notifications";
import { BroadcastHistoryItem } from "@/types/notification";

export default function BroadcastsPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useBroadcasts(page, 10, searchTerm);
  const { mutate: sendBroadcast, isPending } = useSendBroadcast();

  const handleSend = () => {
    if (!title.trim() || !text.trim()) return;
    sendBroadcast(
      { title, text, audience: "USER" },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setText("");
        }
      }
    );
  };

  const columns: ColumnDef<BroadcastHistoryItem>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium text-foreground max-w-[250px] truncate">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "text",
      header: "Message",
      cell: ({ row }) => <div className="text-muted-foreground max-w-[350px] truncate">{row.getValue("text")}</div>,
    },
    {
      accessorKey: "recipientCount",
      header: "Recipients",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("recipientCount")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Sent At",
      cell: ({ row }) => {
        const dateStr = row.getValue("createdAt") as string;
        if (!dateStr) return null;
        try {
          return <div className="text-xs whitespace-nowrap">{format(new Date(dateStr), "MMM dd, yyyy HH:mm")}</div>;
        } catch {
          return dateStr;
        }
      },
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 pt-6 animate-fade-up">
      <PageHeader 
        title="Broadcast Management" 
        subtitle="Send system-wide notifications and view broadcast history."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="size-4" />
                New Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Send Broadcast Notification</DialogTitle>
                <DialogDescription>
                  This will instantly send a push notification and in-app alert to all selected users.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Notification Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Important System Update" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isPending}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="text">Message Content</Label>
                  <Textarea 
                    id="text" 
                    placeholder="Enter the detailed message here..." 
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
                <Button onClick={handleSend} disabled={isPending || !title.trim() || !text.trim()} className="gap-2">
                  <Send className="size-4" />
                  {isPending ? "Sending..." : "Send Now"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <DataTable 
          columns={columns} 
          data={data?.data || []} 
          searchKey="title" 
          searchPlaceholder="Search broadcasts..."
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
