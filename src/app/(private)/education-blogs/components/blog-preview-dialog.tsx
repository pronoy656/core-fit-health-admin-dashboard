"use client";

import {
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Eye,
  FileText,
  Loader2,
  Sparkles,
  Timer
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { StatBadge } from "@/components/widgets/stat-badge";
import { useEducationBlog } from "@/hooks/use-education-blogs";
import { IBlogListItem, IEducationBlog } from "@/types/educationBlog";

interface BlogPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogItem: IBlogListItem | null;
  onEdit?: (blogItem: IBlogListItem) => void;
}

export function BlogPreviewDialog({
  open,
  onOpenChange,
  blogItem,
  onEdit
}: BlogPreviewDialogProps) {
  const targetId = blogItem?._id || (blogItem as any)?.id || "";

  const { data: blogResponse, isLoading, error } = useEducationBlog(
    open && targetId ? targetId : ""
  );

  const blog: IEducationBlog | undefined = blogResponse?.data;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy 'at' hh:mm a");
    } catch {
      return dateStr;
    }
  };

  const status = blog?.status || blogItem?.status || "DRAFT";
  const category = blog?.category || blogItem?.category || "General Health";
  const title = blog?.title || blogItem?.title || "Blog Details";
  const thumbnail = blog?.thumbnail || blogItem?.thumbnail;
  const content = blog?.content || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0 flex flex-col sm:max-w-3xl">
        {/* Header */}
        <DialogHeader className="px-6 pr-14 pt-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                <BookOpen className="size-5" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold leading-snug line-clamp-2">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                  <span>Category: <strong className="text-foreground font-medium">{category}</strong></span>
                  <span>•</span>
                  <span>ID: <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">{targetId || "N/A"}</code></span>
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <StatBadge
                label={status}
                color={
                  status === "PUBLISHED" ? "success" :
                  status === "DRAFT" ? "warning" : "default"
                }
              />
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading blog details...</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive text-center text-sm">
              Failed to load blog content. Please try again.
            </div>
          ) : (
            <div className="space-y-5">
              {/* Meta information bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3.5 text-primary" />
                  <div>
                    <span className="text-[11px] block text-muted-foreground">Created</span>
                    <strong className="text-foreground font-medium">{formatDate(blog?.createdAt || blogItem?.createdAt)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5 text-primary" />
                  <div>
                    <span className="text-[11px] block text-muted-foreground">Updated</span>
                    <strong className="text-foreground font-medium">{formatDate(blog?.updatedAt)}</strong>
                  </div>
                </div>

                {blog?.readTimeMinutes ? (
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2 sm:col-span-1">
                    <Timer className="size-3.5 text-primary" />
                    <div>
                      <span className="text-[11px] block text-muted-foreground">Read Time</span>
                      <strong className="text-foreground font-medium">{blog.readTimeMinutes} min read</strong>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Thumbnail banner if present */}
              {thumbnail && (
                <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-border bg-muted/40 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Blog HTML Content */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Blog Content
                </h4>
                <div className="rounded-xl border border-border/60 bg-card p-5 sm:p-6 shadow-xs">
                  {content ? (
                    <div
                      className="blog-rendered-content space-y-4 text-sm text-foreground leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-border/50 [&_h2]:pb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:text-muted-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:bg-muted/30 [&_blockquote]:p-3 [&_blockquote]:rounded-r [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-3 [&_hr]:my-5 [&_hr]:border-border/80"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No content available for this blog.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-between sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          {blogItem && onEdit && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                onOpenChange(false);
                onEdit(blogItem);
              }}
            >
              <Edit className="size-3.5" />
              <span>Edit Blog</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
