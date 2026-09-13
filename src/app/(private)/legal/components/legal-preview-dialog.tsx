"use client";

import {
  Calendar,
  Check,
  Clock,
  Code2,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  Share2,
  ShieldCheck
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

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
import { useLegalPage } from "@/hooks/use-legal";
import { getLegalId, LegalPageListItem } from "@/types";

interface LegalPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LegalPageListItem | null;
  onEdit?: (item: LegalPageListItem) => void;
}

export function LegalPreviewDialog({
  open,
  onOpenChange,
  item,
  onEdit
}: LegalPreviewDialogProps) {
  const [showRawHtml, setShowRawHtml] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const itemId = getLegalId(item);

  const { data: detail, isLoading, error } = useLegalPage(itemId, {
    enabled: open && !!itemId
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyHtml = () => {
    if (detail?.content) {
      navigator.clipboard.writeText(detail.content);
      setCopiedHtml(true);
      toast.success("HTML content copied to clipboard.");
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  const handleCopyId = () => {
    if (item?._id) {
      navigator.clipboard.writeText(item._id);
      toast.success("Document ID copied to clipboard.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0 flex flex-col sm:max-w-3xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <span>{item?.title || "Legal Document Details"}</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                  <span>ID: <code className="text-[11px] font-mono bg-muted px-1.5 py-0.5 rounded cursor-pointer hover:bg-muted/80" onClick={handleCopyId} title="Click to copy ID">{itemId || "N/A"}</code></span>
                </DialogDescription>
              </div>
            </div>

            {/* Badges / Meta */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="outline" className="bg-background text-muted-foreground gap-1 font-normal text-[11px]">
                <Clock className="size-3" />
                Updated: {formatDate(item?.updatedAt || detail?.updatedAt)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Fetching legal page content...</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive text-center text-sm">
              Failed to load document content: {error.message}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Metadata Info Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-lg border border-border/80 bg-muted/20 p-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-3.5 text-primary" />
                  <span>Created: <strong className="text-foreground font-medium">{formatDate(detail?.createdAt || item?.createdAt)}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5 text-primary" />
                  <span>Last Modified: <strong className="text-foreground font-medium">{formatDate(detail?.updatedAt || item?.updatedAt)}</strong></span>
                </div>
              </div>

              {/* View Mode Toolbar */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  {showRawHtml ? "Raw HTML Source" : "Formatted Document Preview"}
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => setShowRawHtml(!showRawHtml)}
                  >
                    {showRawHtml ? <Eye className="size-3.5" /> : <Code2 className="size-3.5" />}
                    <span>{showRawHtml ? "Show Rendered" : "View HTML"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={handleCopyHtml}
                  >
                    {copiedHtml ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    <span>{copiedHtml ? "Copied" : "Copy HTML"}</span>
                  </Button>
                </div>
              </div>

              {/* Document Presentation */}
              {showRawHtml ? (
                <pre className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed overflow-x-auto text-foreground whitespace-pre-wrap">
                  {detail?.content || "No content found."}
                </pre>
              ) : (
                <div className="rounded-lg border border-border/60 bg-card p-5 sm:p-6 shadow-xs">
                  <div
                    className="legal-rendered-content space-y-4 text-sm text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:border-border/50 [&_h2]:pb-1.5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_ol]:text-muted-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:bg-muted/30 [&_blockquote]:p-3 [&_blockquote]:rounded-r [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_hr]:my-5 [&_hr]:border-border/80"
                    dangerouslySetInnerHTML={{ __html: detail?.content || "<p>No content available</p>" }}
                  />
                </div>
              )}
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

          {item && onEdit && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                onOpenChange(false);
                onEdit(item);
              }}
            >
              <Edit className="size-3.5" />
              <span>Edit Document</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
