"use client";

import {
  AlertCircle,
  ArrowUpDown,
  Grid,
  LayoutGrid,
  List,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  X
} from "lucide-react";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/widgets/page-header";
import { useLegalPages } from "@/hooks/use-legal";
import { getLegalId, LegalPageListItem } from "@/types";

import { LegalCardGrid } from "./components/legal-card-grid";
import { LegalDeleteDialog } from "./components/legal-delete-dialog";
import { LegalEditorDialog } from "./components/legal-editor-dialog";
import { LegalPreviewDialog } from "./components/legal-preview-dialog";
import { LegalStats } from "./components/legal-stats";
import { LegalTable } from "./components/legal-table";

type SortOption = "updated-desc" | "updated-asc" | "title-asc" | "title-desc";

export default function LegalManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated-desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal dialog states
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LegalPageListItem | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<LegalPageListItem | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<LegalPageListItem | null>(null);

  // Fetch legal pages
  const { data: legalPages = [], isLoading, isError, error, refetch, isFetching } = useLegalPages();

  // Handlers for modal triggers
  const handleOpenCreate = () => {
    setEditingItem(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (item: LegalPageListItem) => {
    setEditingItem(item);
    setEditorOpen(true);
  };

  const handleOpenPreview = (item: LegalPageListItem) => {
    setPreviewItem(item);
    setPreviewOpen(true);
  };

  const handleOpenDelete = (item: LegalPageListItem) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let result = Array.isArray(legalPages) ? [...legalPages] : [];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((item) => {
        const title = item.title ? item.title.toLowerCase() : "";
        const id = getLegalId(item).toLowerCase();
        return title.includes(q) || id.includes(q);
      });
    }

    // Sort items
    result.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      if (sortBy === "updated-desc") {
        return bTime - aTime;
      }
      if (sortBy === "updated-asc") {
        return aTime - bTime;
      }
      if (sortBy === "title-asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "title-desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      return 0;
    });

    return result;
  }, [legalPages, searchQuery, sortBy]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 animate-fade-up">
      <PageHeader
        title="Legal & Compliance"
        subtitle="Create, update, and manage public legal pages, privacy policies, terms of service, and agreements."
      />

      {/* Stats Summary Bar */}
      {!isLoading && !isError && (
        <LegalStats items={legalPages} />
      )}

      {/* Filter and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title or ID..."
            className="pl-9 pr-8 text-xs sm:text-sm h-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Sort & View Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Sort Select */}
          <div className="w-40 sm:w-44">
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
              <SelectTrigger className="h-9 text-xs">
                <ArrowUpDown className="size-3.5 mr-1 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated-desc" className="text-xs">Recently Updated</SelectItem>
                <SelectItem value="updated-asc" className="text-xs">Oldest Updated</SelectItem>
                <SelectItem value="title-asc" className="text-xs">Title (A - Z)</SelectItem>
                <SelectItem value="title-desc" className="text-xs">Title (Z - A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle (Table / Grid) */}
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="gap-1.5 shadow-sm h-9 ml-2"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline-block">New Page</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <ShieldAlert className="size-10 text-destructive mb-3" />
          <h3 className="text-base font-semibold text-foreground">Failed to Load Legal Pages</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md">
            {error?.message || "An error occurred while communicating with the backend API."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-4 gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            <span>Try Again</span>
          </Button>
        </div>
      ) : viewMode === "table" ? (
        <LegalTable
          items={filteredAndSortedItems}
          onView={handleOpenPreview}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onNew={handleOpenCreate}
        />
      ) : (
        <LegalCardGrid
          items={filteredAndSortedItems}
          onView={handleOpenPreview}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onNew={handleOpenCreate}
        />
      )}

      {/* Editor Modal Dialog (Create & Edit) */}
      <LegalEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editingItem={editingItem}
      />

      {/* Preview Modal Dialog */}
      <LegalPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        item={previewItem}
        onEdit={handleOpenEdit}
      />

      {/* Delete Confirmation Dialog */}
      <LegalDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        item={deleteItem}
      />
    </div>
  );
}
