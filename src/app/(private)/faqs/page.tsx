"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/widgets/page-header";
import { DataTable } from "@/components/widgets/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatBadge } from "@/components/widgets/stat-badge";
import { Switch } from "@/components/ui/switch";

import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from "@/hooks/use-faqs";
import { faqService } from "@/services";
import { IFaq, FaqCategory } from "@/types/faq";

export default function FaqsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useFaqs({ page, limit: 10, searchTerm });
  
  const { mutate: createFaq, isPending: isCreating } = useCreateFaq();
  const { mutate: updateFaq, isPending: isUpdating } = useUpdateFaq();
  const { mutate: deleteFaq } = useDeleteFaq();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);
  
  // Form State
  const [faqId, setFaqId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState<FaqCategory>("General");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setFaqId("");
    setQuestion("");
    setAnswer("");
    setCategory("General");
    setIsActive(true);
    setIsEditing(false);
  };

  const handleOpenNew = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenEdit = async (faqItem: IFaq) => {
    const targetId = faqItem._id || (faqItem as any).id;
    if (!targetId) {
      toast.error("FAQ ID is missing.");
      return;
    }
    
    // Optimistically set the basic fields
    setFaqId(targetId);
    setQuestion(faqItem.question);
    setCategory(faqItem.category);
    setIsActive(faqItem.isActive);
    setAnswer("Loading..."); // Temporary state while fetching
    setIsEditing(true);
    setOpen(true);

    try {
      // Fetch full details
      const response = await faqService.getFaqById(targetId);
      const fullFaq = response.data;
      setAnswer(fullFaq.answer || "");
    } catch (error) {
      console.error("Failed to load full FAQ details", error);
      setAnswer("Failed to load content.");
    }
  };

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim()) return;

    if (isEditing && faqId) {
      updateFaq(
        { id: faqId, payload: { question, answer, category, isActive } },
        { onSuccess: () => setOpen(false) }
      );
    } else {
      createFaq(
        { question, answer, category, isActive },
        { onSuccess: () => setOpen(false) }
      );
    }
  };

  const confirmDelete = (id: string) => {
    setFaqToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (faqToDelete) {
      deleteFaq(faqToDelete, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setFaqToDelete(null);
        }
      });
    }
  };

  const columns: ColumnDef<IFaq>[] = [
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => (
        <div className="font-medium text-foreground max-w-[300px] truncate">
          {row.getValue("question")}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div className="text-sm">{row.getValue("category")}</div>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("isActive") as boolean;
        return (
          <StatBadge 
            label={active ? "Active" : "Inactive"} 
            color={active ? "success" : "default"} 
          />
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
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
        const faq = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => handleOpenEdit(faq)}
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => confirmDelete(faq._id || (faq as any).id)}
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
        title="FAQ Management" 
        subtitle="Manage frequently asked questions across the platform."
        action={
          <Dialog open={open} onOpenChange={(val) => {
            if (!val) resetForm();
            setOpen(val);
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2" onClick={handleOpenNew}>
                <Plus className="size-4" />
                New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit FAQ" : "Create New FAQ"}</DialogTitle>
                <DialogDescription>
                  {isEditing ? "Update the FAQ question, answer, and category." : "Add a new frequently asked question."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <Input 
                    id="question" 
                    placeholder="Enter the FAQ question..." 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isCreating || isUpdating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(val: FaqCategory) => setCategory(val)} disabled={isCreating || isUpdating}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Account">Account</SelectItem>
                        <SelectItem value="Fasting">Fasting</SelectItem>
                        <SelectItem value="Nutrition">Nutrition</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-8">
                    <Switch 
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      disabled={isCreating || isUpdating}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      {isActive ? "Active (Visible to users)" : "Inactive (Hidden)"}
                    </Label>
                  </div>
                </div>

                <div className="grid gap-2 mt-4">
                  <Label htmlFor="answer">Answer (Rich Text)</Label>
                  <div className="min-h-[250px] bg-background">
                    <ReactQuill 
                      theme="snow"
                      value={answer}
                      onChange={setAnswer}
                      readOnly={isCreating || isUpdating}
                      className="h-[200px] mb-12"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isCreating || isUpdating}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isCreating || isUpdating || !question.trim() || !answer.trim()}>
                  {isCreating || isUpdating ? "Saving..." : "Save FAQ"}
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
          searchKey="question" 
          searchPlaceholder="Search FAQs by question..."
        />
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
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
