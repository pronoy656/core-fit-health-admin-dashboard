"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";
import { toast } from "sonner";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/widgets/page-header";
import { DataTable } from "@/components/widgets/data-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatBadge } from "@/components/widgets/stat-badge";

import { useEducationBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog } from "@/hooks/use-education-blogs";
import { educationBlogService } from "@/services/education-blog.service";
import { IBlogListItem, IEducationBlog, BlogStatus, BlogCategory } from "@/types/educationBlog";
import { BlogPreviewDialog } from "./components/blog-preview-dialog";

export default function EducationBlogsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useEducationBlogs({ page, limit: 10, searchTerm });
  
  const { mutate: createBlog, isPending: isCreating } = useCreateBlog();
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();
  const { mutate: deleteBlog } = useDeleteBlog();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedBlogForPreview, setSelectedBlogForPreview] = useState<IBlogListItem | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  
  // Form State
  const [blogId, setBlogId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<BlogCategory>("General Health");
  const [status, setStatus] = useState<BlogStatus>("DRAFT");
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>(undefined);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | undefined>(undefined);

  const resetForm = () => {
    setBlogId("");
    setTitle("");
    setContent("");
    setCategory("General Health");
    setStatus("DRAFT");
    setThumbnailFile(undefined);
    setExistingThumbnailUrl(undefined);
    setIsEditing(false);
  };

  const handleOpenNew = () => {
    resetForm();
    setOpen(true);
  };

  const handleOpenPreview = (blogItem: IBlogListItem) => {
    setSelectedBlogForPreview(blogItem);
    setPreviewOpen(true);
  };

  const handleOpenEdit = async (blogItem: IBlogListItem) => {
    const targetId = blogItem._id || (blogItem as any).id;
    if (!targetId) {
      toast.error("Blog ID is missing.");
      return;
    }
    
    // Optimistically set the basic fields
    setBlogId(targetId);
    setTitle(blogItem.title);
    setCategory(blogItem.category);
    setStatus(blogItem.status);
    setExistingThumbnailUrl(blogItem.thumbnail);
    setContent("Loading..."); // Temporary state while fetching
    setIsEditing(true);
    setOpen(true);

    try {
      // Fetch full content
      const response = await educationBlogService.getEducationBlogById(targetId);
      const fullBlog = response.data;
      setContent(fullBlog.content || "");
    } catch (error) {
      console.error("Failed to load full blog details", error);
      setContent("Failed to load content.");
    }
  };


  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

    if (isEditing && blogId) {
      updateBlog(
        { id: blogId, payload: { title, content, category, status }, thumbnail: thumbnailFile },
        { onSuccess: () => setOpen(false) }
      );
    } else {
      createBlog(
        { payload: { title, content, category, status }, thumbnail: thumbnailFile },
        { onSuccess: () => setOpen(false) }
      );
    }
  };

  const confirmDelete = (id: string) => {
    setBlogToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (blogToDelete) {
      deleteBlog(blogToDelete, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setBlogToDelete(null);
        }
      });
    }
  };

  const columns: ColumnDef<IBlogListItem>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="font-medium text-foreground max-w-[250px] truncate">
          {row.getValue("title")}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div className="text-sm">{row.getValue("category")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <StatBadge 
            label={status} 
            color={
              status === "PUBLISHED" ? "success" : 
              status === "DRAFT" ? "warning" : "default"
            } 
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
        const blog = row.original;
        return (
          <div className="flex justify-end gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="View Details"
              onClick={() => handleOpenPreview(blog)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title="Edit Blog"
              onClick={() => handleOpenEdit(blog)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              title="Delete Blog"
              onClick={() => confirmDelete(blog._id || (blog as any).id)}
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
        title="Education Blogs" 
        subtitle="Manage health, nutrition, and wellness articles."
        action={
          <Dialog open={open} onOpenChange={(val) => {
            if (!val) resetForm();
            setOpen(val);
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2" onClick={handleOpenNew}>
                <Plus className="size-4" />
                New Blog
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Blog" : "Create New Blog"}</DialogTitle>
                <DialogDescription>
                  {isEditing ? "Update the blog content and status." : "Create a new educational article."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Enter blog title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isCreating || isUpdating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={(val: BlogCategory) => setCategory(val)} disabled={isCreating || isUpdating}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Health">General Health</SelectItem>
                        <SelectItem value="Nutrition">Nutrition</SelectItem>
                        <SelectItem value="Wellness">Wellness</SelectItem>
                        <SelectItem value="Fasting">Fasting</SelectItem>
                        <SelectItem value="Medication">Medication</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(val: BlogStatus) => setStatus(val)} disabled={isCreating || isUpdating}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Thumbnail Image (Optional)</Label>
                  
                  {/* Image Preview Area */}
                  <div className="mt-2 mb-2 flex flex-col gap-3">
                    <label 
                      htmlFor="thumbnail" 
                      className="relative block h-48 w-full cursor-pointer overflow-hidden rounded-md border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50"
                    >
                      {(thumbnailFile || existingThumbnailUrl) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : existingThumbnailUrl} 
                          alt="Thumbnail preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground/50 mb-3" />
                          <span className="text-sm font-medium text-muted-foreground">Click to upload thumbnail</span>
                        </div>
                      )}
                      
                      {/* Overlay on hover for uploaded images */}
                      {(thumbnailFile || existingThumbnailUrl) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                          <span className="text-sm font-medium text-white">Click to change image</span>
                        </div>
                      )}
                    </label>
                  </div>

                  <Input 
                    id="thumbnail" 
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0])}
                    disabled={isCreating || isUpdating}
                    className="hidden"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">Content (Rich Text)</Label>
                  <div className="min-h-[250px] bg-background">
                    <ReactQuill 
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      readOnly={isCreating || isUpdating}
                      className="h-[200px] mb-12"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isCreating || isUpdating}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isCreating || isUpdating || !title.trim() || !content.trim()}>
                  {isCreating || isUpdating ? "Saving..." : "Save Blog"}
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
          searchPlaceholder="Search blogs by title..."
        />
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog? This action cannot be undone and will permanently remove the blog and its thumbnail from the server.
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

      <BlogPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        blogItem={selectedBlogForPreview}
        onEdit={(item) => handleOpenEdit(item)}
      />
    </div>
  );
}
