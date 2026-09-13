"use client";

import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useDeleteLegalPage } from "@/hooks/use-legal";
import { getLegalId, LegalPageListItem } from "@/types";

interface LegalDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: LegalPageListItem | null;
}

export function LegalDeleteDialog({
  open,
  onOpenChange,
  item
}: LegalDeleteDialogProps) {
  const deleteMutation = useDeleteLegalPage();

  const handleDelete = () => {
    if (!item) return;
    const itemId = getLegalId(item);
    if (!itemId) return;

    deleteMutation.mutate(
      { id: itemId, title: item.title },
      {
        onSuccess: () => {
          onOpenChange(false);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mx-auto sm:mx-0">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <DialogTitle className="text-lg font-semibold text-center sm:text-left">
              Delete Legal Document?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1.5 text-center sm:text-left">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground font-semibold">"{item?.title}"</strong>? This
              action cannot be undone and will remove public access to this legal page.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={deleteMutation.isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
            className="gap-1.5"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Delete Document</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
