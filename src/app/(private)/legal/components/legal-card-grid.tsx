"use client";

import {
  Calendar,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  MoreVertical,
  Plus,
  Shield,
  Trash2
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { getLegalId, LegalPageListItem } from "@/types";

interface LegalCardGridProps {
  items: LegalPageListItem[];
  onView: (item: LegalPageListItem) => void;
  onEdit: (item: LegalPageListItem) => void;
  onDelete: (item: LegalPageListItem) => void;
  onNew: () => void;
}

export function LegalCardGrid({
  items = [],
  onView,
  onEdit,
  onDelete,
  onNew
}: LegalCardGridProps) {
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

  const copyId = (id: string, title: string) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    toast.success(`Copied ID for "${title}"`);
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const itemId = getLegalId(item);
        const shortId = itemId ? (itemId.length > 10 ? itemId.slice(0, 10) : itemId) : `doc-${index}`;

        return (
          <Card
            key={itemId || `item-${index}`}
            className="group relative flex flex-col justify-between border-border/60 bg-card/80 backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
          >
            <CardHeader className="p-5 pb-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                  <Shield className="size-5" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVertical className="size-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() => onView(item)}
                      className="gap-2 text-xs cursor-pointer"
                    >
                      <Eye className="size-3.5 text-primary" />
                      <span>Preview Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEdit(item)}
                      className="gap-2 text-xs cursor-pointer"
                    >
                      <Edit className="size-3.5 text-amber-500" />
                      <span>Edit Document</span>
                    </DropdownMenuItem>
                    {itemId && (
                      <DropdownMenuItem
                        onClick={() => copyId(itemId, item.title)}
                        className="gap-2 text-xs cursor-pointer"
                      >
                        <Copy className="size-3.5 text-muted-foreground" />
                        <span>Copy ID</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(item)}
                      className="gap-2 text-xs text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardTitle className="text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                {item.title || "Untitled Document"}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              <div className="rounded-lg border border-border/70 bg-muted/30 p-2.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[11px] flex items-center gap-1">
                    <Calendar className="size-3" /> Created:
                  </span>
                  <span className="text-foreground text-[11px]">{formatDate(item.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[11px] flex items-center gap-1">
                    <Clock className="size-3" /> Updated:
                  </span>
                  <span className="text-foreground font-medium text-[11px]">
                    {formatDate(item.updatedAt)}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs gap-1"
                onClick={() => onView(item)}
              >
                <Eye className="size-3.5 text-primary" />
                <span>Preview</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 text-xs gap-1"
                onClick={() => onEdit(item)}
              >
                <Edit className="size-3.5" />
                <span>Edit</span>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
