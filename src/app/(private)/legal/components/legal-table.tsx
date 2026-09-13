"use client";

import { Calendar, Clock, Edit, FileText, Plus, Shield, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getLegalId, LegalPageListItem } from "@/types";

interface LegalTableProps {
  items: LegalPageListItem[];
  onView: (item: LegalPageListItem) => void;
  onEdit: (item: LegalPageListItem) => void;
  onDelete: (item: LegalPageListItem) => void;
  onNew: () => void;
}

export function LegalTable({
  items = [],
  onView,
  onEdit,
  onDelete,
  onNew
}: LegalTableProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "";
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <FileText className="size-7" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Legal Pages Found</h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
          You haven't created any legal documents yet or your search filter didn't match any pages.
        </p>
        <Button size="sm" onClick={onNew} className="mt-5 gap-1.5 shadow-sm">
          <Plus className="size-4" />
          <span>Create Legal Page</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[45%] text-xs font-semibold">Document Title</TableHead>
            <TableHead className="text-xs font-semibold">Created Date</TableHead>
            <TableHead className="text-xs font-semibold">Last Updated</TableHead>
            <TableHead className="w-[160px] text-right text-xs font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item, index) => {
            const itemId = getLegalId(item);

            return (
              <TableRow
                key={itemId || `item-${index}`}
                className="group transition-colors hover:bg-muted/30 cursor-pointer"
                onClick={() => onView(item)}
              >
                {/* Title & Icon */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                      <Shield className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title || "Untitled Document"}
                      </p>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        Public Policy Document
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Created At */}
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground/70" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </TableCell>

                {/* Updated At */}
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{formatDate(item.updatedAt)}</span>
                    {item.updatedAt && (
                      <span className="text-[10px] text-muted-foreground">
                        {formatTime(item.updatedAt)}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Actions: Direct Edit & Delete Buttons */}
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="h-8 px-2.5 text-xs gap-1 border-border/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors"
                      title="Edit Document"
                    >
                      <Edit className="size-3.5 text-primary" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(item)}
                      className="h-8 px-2.5 text-xs gap-1 border-border/80 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
