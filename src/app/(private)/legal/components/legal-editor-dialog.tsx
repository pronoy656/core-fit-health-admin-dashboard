"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bold,
  Code,
  Eye,
  FileText,
  Heading2,
  Heading3,
  HelpCircle,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Save,
  Sparkles,
  Undo2,
  Wand2
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLegalPage, useLegalPage, useUpdateLegalPage } from "@/hooks/use-legal";
import { LegalPageFormData, legalPageSchema } from "@/schemas/legal.schema";
import { getLegalId, LegalPageListItem } from "@/types";

interface LegalEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem?: LegalPageListItem | null;
}

const TEMPLATES: Record<string, { title: string; content: string }> = {
  privacy: {
    title: "Privacy Policy",
    content: `<h2>1. Information We Collect</h2>
<p>We collect information to provide better services to our users. This includes account details, health & fitness metrics, and usage statistics.</p>

<h2>2. How We Use Information</h2>
<p>We use the data we collect to personalize workout routines, nutrition plans, and track your fitness progress over time.</p>

<h2>3. Data Protection & Security</h2>
<p>Your health data is encrypted at rest and in transit. We never sell your personal data to third parties.</p>

<h2>4. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us at support@corefithealth.com.</p>`
  },
  terms: {
    title: "Terms of Service",
    content: `<h2>1. Acceptance of Terms</h2>
<p>By accessing and using CoreFit Health services, you agree to be bound by these Terms of Service.</p>

<h2>2. Health Disclaimer</h2>
<p>The fitness advice and health metrics provided are for informational purposes and should not replace professional medical advice.</p>

<h2>3. User Responsibilities</h2>
<p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.</p>

<h2>4. Termination</h2>
<p>We reserve the right to terminate or suspend access to our service immediately without prior notice for conduct violating these terms.</p>`
  },
  refund: {
    title: "Refund & Cancellation Policy",
    content: `<h2>1. Subscription Cancellation</h2>
<p>You can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing cycle.</p>

<h2>2. Refund Eligibility</h2>
<p>Refund requests submitted within 14 days of purchase are eligible for full consideration if you have encountered technical issues preventing service access.</p>

<h2>3. Processing Time</h2>
<p>Approved refunds are processed within 5 to 7 business days to the original payment method.</p>`
  }
};

export function LegalEditorDialog({
  open,
  onOpenChange,
  editingItem
}: LegalEditorDialogProps) {
  const isEditing = !!editingItem;
  const editingId = getLegalId(editingItem);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [editorTab, setEditorTab] = useState<"edit" | "preview" | "split">("edit");

  // Fetch full details if editing
  const { data: fullDetails, isLoading: isFetchingDetails } = useLegalPage(
    editingId,
    { enabled: open && isEditing && !!editingId }
  );

  const createMutation = useCreateLegalPage();
  const updateMutation = useUpdateLegalPage();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<LegalPageFormData>({
    resolver: zodResolver(legalPageSchema),
    defaultValues: {
      title: "",
      content: ""
    }
  });

  const contentValue = watch("content");
  const titleValue = watch("title");

  // Populate form when dialog opens or data changes
  useEffect(() => {
    if (open) {
      if (isEditing && fullDetails) {
        reset({
          title: fullDetails.title,
          content: fullDetails.content
        });
      } else if (!isEditing) {
        reset({
          title: "",
          content: ""
        });
      }
    }
  }, [open, isEditing, fullDetails, reset]);

  // Insert HTML tags at cursor position
  const insertTag = (openTag: string, closeTag: string, placeholder = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = contentValue || "";
    const selectedText = current.substring(start, end) || placeholder;

    const replacement = `${openTag}${selectedText}${closeTag}`;
    const newContent = current.substring(0, start) + replacement + current.substring(end);

    setValue("content", newContent, { shouldValidate: true, shouldDirty: true });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + selectedText.length
      );
    }, 10);
  };

  const applyTemplate = (key: string) => {
    const template = TEMPLATES[key];
    if (template) {
      setValue("title", template.title, { shouldValidate: true, shouldDirty: true });
      setValue("content", template.content, { shouldValidate: true, shouldDirty: true });
    }
  };

  const onSubmit = (data: LegalPageFormData) => {
    if (isEditing && editingId) {
      updateMutation.mutate(
        { id: editingId, payload: data },
        {
          onSuccess: () => {
            onOpenChange(false);
          }
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-hidden p-0 flex flex-col sm:max-w-4xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isEditing ? `Edit "${editingItem?.title}"` : "Create New Legal Document"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {isEditing
                    ? "Update the legal document title and HTML content. Changes take effect immediately."
                    : "Add a new compliance, privacy policy, or agreement page for the platform."}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Body Content */}
        {isEditing && isFetchingDetails ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading document details...</p>
          </div>
        ) : (
          <form
            id="legal-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
          >
            {/* Quick Templates (only in Create mode or when empty) */}
            {!isEditing && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border/80 bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Sparkles className="size-3.5 text-primary" />
                  <span>Quick Templates:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs font-normal"
                    onClick={() => applyTemplate("privacy")}
                  >
                    Privacy Policy
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs font-normal"
                    onClick={() => applyTemplate("terms")}
                  >
                    Terms of Service
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs font-normal"
                    onClick={() => applyTemplate("refund")}
                  >
                    Refund Policy
                  </Button>
                </div>
              </div>
            )}

            {/* Document Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="title" className="text-xs font-semibold text-foreground">
                  Document Title <span className="text-destructive">*</span>
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {titleValue?.length || 0}/120 characters
                </span>
              </div>
              <Input
                id="title"
                placeholder="e.g. Privacy Policy, Terms of Service, Community Guidelines"
                disabled={isSubmitting}
                className="text-sm font-medium"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs font-medium text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Content Editor & Preview */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="content" className="text-xs font-semibold text-foreground">
                  Document HTML Content <span className="text-destructive">*</span>
                </Label>

                {/* View Mode Toggle */}
                <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5">
                  <button
                    type="button"
                    onClick={() => setEditorTab("edit")}
                    className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-all ${
                      editorTab === "edit"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Code className="size-3.5" />
                    <span>Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab("preview")}
                    className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-all ${
                      editorTab === "preview"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="size-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab("split")}
                    className={`hidden sm:flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-all ${
                      editorTab === "split"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Wand2 className="size-3.5" />
                    <span>Split View</span>
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-border bg-muted/40 p-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Heading 2"
                  className="h-7 px-2 text-xs font-semibold"
                  onClick={() => insertTag("<h2>", "</h2>", "Section Heading")}
                >
                  <Heading2 className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Heading 3"
                  className="h-7 px-2 text-xs font-semibold"
                  onClick={() => insertTag("<h3>", "</h3>", "Subheading")}
                >
                  <Heading3 className="size-3.5" />
                </Button>
                <div className="h-4 w-px bg-border mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Bold"
                  className="h-7 px-2 text-xs"
                  onClick={() => insertTag("<strong>", "</strong>", "bold text")}
                >
                  <Bold className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Italic"
                  className="h-7 px-2 text-xs"
                  onClick={() => insertTag("<em>", "</em>", "italic text")}
                >
                  <Italic className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Paragraph"
                  className="h-7 px-2 text-xs font-mono"
                  onClick={() => insertTag("<p>", "</p>", "Paragraph text goes here.")}
                >
                  &para;
                </Button>
                <div className="h-4 w-px bg-border mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Bullet List"
                  className="h-7 px-2 text-xs"
                  onClick={() =>
                    insertTag(
                      "<ul>\n  <li>",
                      "</li>\n  <li>Second item</li>\n</ul>",
                      "First item"
                    )
                  }
                >
                  <List className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Numbered List"
                  className="h-7 px-2 text-xs"
                  onClick={() =>
                    insertTag(
                      "<ol>\n  <li>",
                      "</li>\n  <li>Second item</li>\n</ol>",
                      "First item"
                    )
                  }
                >
                  <ListOrdered className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Blockquote"
                  className="h-7 px-2 text-xs"
                  onClick={() => insertTag("<blockquote>", "</blockquote>", "Important notice")}
                >
                  <Quote className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Horizontal Divider"
                  className="h-7 px-2 text-xs font-mono"
                  onClick={() => insertTag("<hr />\n", "")}
                >
                  &minus;&minus;&minus;
                </Button>
              </div>

              {/* Editor / Preview Area */}
              <div
                className={`grid gap-3 ${
                  editorTab === "split" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {/* Editor Pane */}
                {(editorTab === "edit" || editorTab === "split") && (
                  <div className="relative">
                    <Textarea
                      id="content"
                      placeholder="<h2>Title</h2><p>Write your legal terms and privacy details in HTML format...</p>"
                      disabled={isSubmitting}
                      className={`min-h-[260px] font-mono text-xs leading-relaxed rounded-t-none border-t-0 focus-visible:ring-1 ${
                        editorTab === "split" ? "h-[340px]" : "h-[280px]"
                      }`}
                      {...register("content")}
                      ref={(e) => {
                        register("content").ref(e);
                        textareaRef.current = e;
                      }}
                    />
                  </div>
                )}

                {/* Preview Pane */}
                {(editorTab === "preview" || editorTab === "split") && (
                  <div
                    className={`rounded-b-lg border border-border bg-card p-4 overflow-y-auto ${
                      editorTab === "preview"
                        ? "min-h-[280px] rounded-t-none border-t-0"
                        : "h-[340px] rounded-lg"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Live Rendered Preview
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {contentValue ? `${contentValue.length} characters` : "Empty content"}
                      </span>
                    </div>

                    {contentValue ? (
                      <div
                        className="legal-preview-content space-y-3 text-sm text-foreground [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted-foreground [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-muted-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_hr]:my-4 [&_hr]:border-border"
                        dangerouslySetInnerHTML={{ __html: contentValue }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <FileText className="size-8 stroke-1 text-muted-foreground/50 mb-2" />
                        <p className="text-xs">No content to preview yet.</p>
                        <p className="text-[11px] text-muted-foreground/70">
                          Type HTML in the editor or choose a template above.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {errors.content && (
                <p className="text-xs font-medium text-destructive">{errors.content.message}</p>
              )}
            </div>
          </form>
        )}

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-between sm:justify-between">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <HelpCircle className="size-3.5" />
            <span>Accepts standard HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="legal-form"
              size="sm"
              disabled={isSubmitting || (isEditing && isFetchingDetails)}
              className="gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>{isEditing ? "Save Changes" : "Create Document"}</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
